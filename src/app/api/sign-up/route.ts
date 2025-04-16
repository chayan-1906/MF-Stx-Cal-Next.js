import bcrypt from 'bcryptjs';
import {ApiResponse} from "@/types/ApiResponse";
import UserModel from "@/models/User";
import {sendVerificationEmail} from "@/lib/email";
import {dbConnect} from "@/lib/db";
import {generateRandomToken} from "@/lib/utils";
import {TOKEN_EXPIRY} from "@/lib/config";

/** SIGN UP */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const {name, email, password} = await request.json();

        const existingUserByEmail = await UserModel.findOne({email});
        const token = generateRandomToken();
        if (existingUserByEmail) {
            // if email exists, check whether verified or not ———— if verified return 400, otherwise update the existing user with the new token
            if (existingUserByEmail.isVerified) {
                return Response.json(<ApiResponse>{
                    code: 'emailAlreadyExists',
                    success: false,
                    message: 'User already exists with this email',
                }, {status: 400});
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.token = token;
                existingUserByEmail.tokenExpiry = new Date(Date.now() + TOKEN_EXPIRY!);
                await existingUserByEmail.save();
            }
        } else {
            // if email doesn't exist, save the new user (in other word, create user)
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                name,
                email,
                password: hashedPassword,
                token,
                tokenExpiry: expiryDate,
                isVerified: false,
                createdAt: new Date(),
            });
            const savedUser = await newUser.save();
            console.log('registered user ✅', savedUser);
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, token);
        console.log('verification email response ✅', emailResponse);
        if (!emailResponse.success) {
            return Response.json(<ApiResponse>{
                code: emailResponse.code,
                success: emailResponse.success,
                message: emailResponse.message,
            }, {status: 500});
        }

        return Response.json(<ApiResponse>{
            code: 'registered',
            success: emailResponse.success,
            message: 'User registered successfully. Please verify your email!',
        }, {status: 201});
    } catch (error) {
        console.error('Error in registering user', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error registering user', error}, {status: 500});
    }
}
