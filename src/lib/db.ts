import bcrypt from 'bcryptjs';
import UserModel, {User} from "@/models/User";
import {ConnectionObject} from "@/types/DB";
import mongoose from "mongoose";
import {MONGODB_URI, TOKEN_EXPIRY} from "@/lib/config";
import {sendVerificationEmail} from "@/lib/email";
import {ApiResponse} from "@/types/ApiResponse";
import {generateRandomToken} from "@/lib/utils";

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to database 👍👍👍');
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('DB connected successfully ✅✅✅');
    } catch (error: any) {
        console.error('Database connection failed ‼️‼️‼️', error);
        process.exit(1);
    }
}

async function getUserFromDb(credentials: any) {
    const user = await UserModel.findOne({
        $or: [
            {email: credentials.identifier},
            {username: credentials.identifier},
        ],
    });
    if (!user) {
        throw new Error('No user found with this email');
    }

    if (!user.isVerified) {
        throw new Error('Please verify your account before login');
    }

    return user;
}

async function createUserInDb(user: Partial<User>, {requireVerification = true}: { requireVerification?: boolean }) {
    await dbConnect();

    try {
        const token = generateRandomToken();
        const tokenExpiry = new Date(Date.now() + Number(TOKEN_EXPIRY ?? 0));
        const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : '';

        // Check for existing user
        if (!user.email) {
            return {
                code: 'missingEmail',
                success: false,
                message: 'Email is required',
            } as ApiResponse;
        }

        const existingUserByEmail = await UserModel.findOne({email: user.email});
        if (existingUserByEmail) {
            console.log('email exists 😀😀');
            if (existingUserByEmail.isVerified) {
                // Already verified
                return {
                    success: false,
                    code: 'emailAlreadyVerified',
                    message: 'User already verified with this email',
                } as ApiResponse;
            } else if (requireVerification) {
                // Update unverified user for credentials
                if (user.name) {
                    existingUserByEmail.name = user.name;
                }
                if (user.password) {
                    existingUserByEmail.password = hashedPassword;
                }
                existingUserByEmail.token = token;
                existingUserByEmail.tokenExpiry = tokenExpiry;
                await existingUserByEmail.save();

                // Send verification email
                const emailResponse = await sendVerificationEmail(user.email, token);
                if (!emailResponse.success) {
                    return {
                        success: false,
                        code: emailResponse.code,
                        message: emailResponse.message,
                    } as ApiResponse;
                }

                return {
                    code: 'registered',
                    success: emailResponse.success,
                    message: 'User registered successfully. Please verify your email!',
                    data: {
                        user: existingUserByEmail,
                    },
                } as ApiResponse;
            } else {
                // For OAuth, update unverified user to verified
                if (user.name) {
                    existingUserByEmail.name = user.name;
                }
                if (user.googleId) {
                    existingUserByEmail.googleId = user.googleId;
                }
                existingUserByEmail.isVerified = true;
                existingUserByEmail.token = undefined;
                existingUserByEmail.tokenExpiry = undefined;
                await existingUserByEmail.save();

                return {
                    code: 'registered',
                    success: true,
                    message: 'User registered successfully',
                    data: {
                        user: existingUserByEmail,
                    },
                } as ApiResponse;
            }
        }

        console.log('creating new user 🤓🤓🤓');
        // Create new user
        const newUser = new UserModel({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            googleId: user.googleId,
            isVerified: !requireVerification,
            token,
            tokenExpiry,
            createdAt: new Date(),
        });
        console.log('password 👀:', newUser.password);
        await newUser.save();

        // Clear token fields for OAuth
        if (!requireVerification) {
            await UserModel.updateOne({_id: newUser._id}, {$set: {token: null, tokenExpiry: null, password: null}});
        }

        // Send verification email for Credentials
        if (requireVerification && token) {
            const emailResponse = await sendVerificationEmail(user.email, token);
            if (!emailResponse.success) {
                await UserModel.deleteOne({_id: newUser._id}); // Cleanup on email failure
                return {
                    code: emailResponse.code,
                    success: emailResponse.success,
                    message: emailResponse.message,
                } as ApiResponse;
            }
        }

        return {
            success: true,
            code: 'registered',
            message: requireVerification
                ? 'User registered successfully. Please verify your email!'
                : 'User registered successfully!',
            data: {
                user: newUser,
            },
        } as ApiResponse;
    } catch (error: any) {
        console.error('Error creating user:', error);
        return {
            code: 'unknownError',
            success: false,
            message: `Error creating user: ${error.message}`,
        } as ApiResponse;
    }
}

export {dbConnect, getUserFromDb, createUserInDb}
