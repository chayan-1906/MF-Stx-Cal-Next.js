import {NextAuthOptions, Session, User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {NEXTAUTH_SECRET} from "@/lib/config";
import {createUserInDb} from "@/lib/db/user-storage";
import UserModel from "@/models/User";
import {JWT} from "next-auth/jwt";
import {dbConnect} from "@/lib/db";
import OtpModel from "@/models/Otp";
import bcrypt from "bcryptjs";
import {ApiResponse} from "@/types/ApiResponse";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            credentials: {
                name: {label: 'Name', type: 'text'},
                email: {label: 'Email', type: 'text'},
                code: {label: 'Verification Code', type: 'text'},
            },
            async authorize(credentials: any, req: any): Promise<any> {
                await dbConnect();
                try {
                    if (!credentials.email || !credentials.code) {
                        throw new Error(JSON.stringify({
                            code: "missingEmailCode",
                            success: false,
                            message: "Email & Code are required",
                        }));
                    }

                    let user = await UserModel.findOne({email: credentials.email});
                    if (!user) {
                        console.log('user not found ℹ️');
                        if (!credentials.name) {
                            throw new Error(JSON.stringify({
                                code: "missingName",
                                success: false,
                                message: "Name is required",
                            }));
                            // return {code: 'missingName', success: false, message: 'Name is required'} as ApiResponse;
                        }
                        user = await UserModel.create({
                            name: credentials.name,
                            email: credentials.email,
                            createdAt: new Date(),
                        });
                    }

                    const storedOtp = await OtpModel.findOne({email: credentials.email});
                    if (!storedOtp) {
                        throw new Error(JSON.stringify({
                            code: "codeNotFound",
                            success: false,
                            message: "No code found",
                        }));
                        // return {code: "codeNotFound", success: false, message: "No code found"} as ApiResponse;
                    }

                    if (new Date() > new Date(storedOtp.codeExpiry)) {
                        await OtpModel.deleteOne({email: credentials.email});
                        throw new Error(JSON.stringify({
                            code: "expiredCode",
                            success: false,
                            message: "Code has been expired",
                        }));
                        // return {code: "expiredCode", success: false, message: "Code has been expired"} as ApiResponse;
                    }

                    const isValid = await bcrypt.compare(credentials.code, storedOtp.hashedOtp);
                    if (!isValid) {
                        throw new Error(JSON.stringify({
                            code: "invalidCode",
                            success: false,
                            message: "Invalid verification code",
                        }));
                        // return {code: "invalidCode", success: false, message: "Invalid verification code"} as ApiResponse;
                    }

                    await OtpModel.deleteOne({email: credentials.email});

                    return {
                        code: "authenticated",
                        success: true,
                        message: "User authenticated",
                        data: {user},
                    } as ApiResponse;
                } catch (error: any) {
                    console.error("error in authorize:", error);
                    throw new Error(JSON.stringify({
                        code: error.code || 'unknownError',
                        success: error.success || false,
                        message: error.message || 'Something went wronggggg',
                    }));
                    // return {code: "unknownError", success: false, message: "Something went wrong", error} as ApiResponse;
                }
            },
        }),
        /*GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),*/
        /** TODO: Add Apple OAuth */
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: NEXTAUTH_SECRET,
    theme: {
        colorScheme: 'auto',
    },
    callbacks: {
        async signIn({user, account, profile}) {
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    const email = user.email;
                    const name = user.name;
                    if (!email) return false;

                    let dbUser = await UserModel.findOne({email});
                    console.log('dbUser:', dbUser);
                    /*if (!dbUser) {
                        // Create new user for Google sign-in, auto-verified
                        const newUser = new UserModel({name, email, googleId: profile?.sub});
                        const {data: {user}} = await createUserInDb(newUser, {requireVerification: false});
                        dbUser = user;
                    } else if (!dbUser.isVerified) {
                        // Block unverified Credentials users, but allow Google if verified elsewhere
                        console.log('blocking here ✔︎✔︎✔︎');
                        return false;
                    }*/

                    if (!dbUser || !dbUser.isVerified) {
                        const newUser = new UserModel({name, email, googleId: profile?.sub});
                        const {data: {user}} = await createUserInDb(newUser, {requireVerification: false});
                        dbUser = user;
                    }

                    if (dbUser && !dbUser.googleId && profile?.sub) {
                        dbUser.googleId = profile.sub;
                        await dbUser.save();
                    }

                    return true; // Allow sign-in
                } catch (error) {
                    console.error('Error in Google signIn callback:', error);
                    return false;
                }
            }

            console.log("signIn callback user:", JSON.stringify(user, null, 2));
            return true;
        },

        async jwt({token, user}: { token: JWT; user: User }) {
            if (user) {
                token._id = user._id;
                token.name = user.name ?? '';
                token.email = user.email ?? '';
                token.isVerified = user.isVerified;
            }
            return token;
        },

        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user._id = token._id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
    },
}

/*export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            credentials: {
                name: {label: 'Name', type: 'text'},
                email: {label: 'Email', type: 'text'},
                code: {label: 'Verification Code', type: 'text'},
            },
            async authorize(credentials: any, req: any): Promise<any> {
                await dbConnect();
                try {
                    if (!credentials.email || !credentials.code) {
                        throw new Error(JSON.stringify({
                            code: "missingEmailCode",
                            success: false,
                            message: "Email & Code are required",
                        }));
                    }

                    let user = await UserModel.findOne({email: credentials.email});
                    if (!user) {
                        console.log('user not found ℹ️');
                        if (!credentials.name) {
                            throw new Error(JSON.stringify({
                                code: "missingName",
                                success: false,
                                message: "Name is required",
                            }));
                            // return {code: 'missingName', success: false, message: 'Name is required'} as ApiResponse;
                        }
                        user = await UserModel.create({
                            name: credentials.name,
                            email: credentials.email,
                            createdAt: new Date(),
                        });
                    }

                    const storedOtp = await OtpModel.findOne({email: credentials.email});
                    if (!storedOtp) {
                        throw new Error(JSON.stringify({
                            code: "codeNotFound",
                            success: false,
                            message: "No code found",
                        }));
                        // return {code: "codeNotFound", success: false, message: "No code found"} as ApiResponse;
                    }

                    if (new Date() > new Date(storedOtp.codeExpiry)) {
                        await OtpModel.deleteOne({email: credentials.email});
                        throw new Error(JSON.stringify({
                            code: "expiredCode",
                            success: false,
                            message: "Code has been expired",
                        }));
                        // return {code: "expiredCode", success: false, message: "Code has been expired"} as ApiResponse;
                    }

                    const isValid = await bcrypt.compare(credentials.code, storedOtp.hashedOtp);
                    if (!isValid) {
                        throw new Error(JSON.stringify({
                            code: "invalidCode",
                            success: false,
                            message: "Invalid verification code",
                        }));
                        // return {code: "invalidCode", success: false, message: "Invalid verification code"} as ApiResponse;
                    }

                    await OtpModel.deleteOne({email: credentials.email});

                    return {
                        code: "authenticated",
                        success: true,
                        message: "User authenticated",
                        data: {user},
                    } as ApiResponse;
                } catch (error: any) {
                    console.error("error in authorize:", error);
                    throw new Error(JSON.stringify({
                        code: "unknownError",
                        success: false,
                        message: "Something went wrong",
                    }));
                    // return {code: "unknownError", success: false, message: "Something went wrong", error} as ApiResponse;
                }
            },
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        /!** TODO: Add Apple OAuth *!/
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    const email = user.email;
                    const name = user.name;
                    if (!email) return false;

                    let dbUser = await UserModel.findOne({email});
                    console.log('dbUser:', dbUser);
                    /!*if (!dbUser) {
                        // Create new user for Google sign-in, auto-verified
                        const newUser = new UserModel({name, email, googleId: profile?.sub});
                        const {data: {user}} = await createUserInDb(newUser, {requireVerification: false});
                        dbUser = user;
                    } else if (!dbUser.isVerified) {
                        // Block unverified Credentials users, but allow Google if verified elsewhere
                        console.log('blocking here ✔︎✔︎✔︎');
                        return false;
                    }*!/

                    if (!dbUser || !dbUser.isVerified) {
                        const newUser = new UserModel({name, email, googleId: profile?.sub});
                        const {data: {user}} = await createUserInDb(newUser, {requireVerification: false});
                        dbUser = user;
                    }

                    if (dbUser && !dbUser.googleId && profile?.sub) {
                        dbUser.googleId = profile.sub;
                        await dbUser.save();
                    }

                    return true; // Allow sign-in
                } catch (error) {
                    console.error('Error in Google signIn callback:', error);
                    return false;
                }
            }

            console.log("signIn callback user:", JSON.stringify(user, null, 2));
            return true;
        },

        async jwt({token, user}: { token: JWT; user: User }) {
            if (user) {
                token._id = user._id;
                token.name = user.name ?? '';
                token.email = user.email ?? '';
                token.isVerified = user.isVerified;
            }
            return token;
        },

        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user._id = token._id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
    },
    debug: true,
});*/
