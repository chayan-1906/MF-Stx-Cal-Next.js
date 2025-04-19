import NextAuth, {Session, User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "@/models/User";
import {JWT} from "next-auth/jwt";
import {dbConnect} from "@/lib/db";
import OtpModel from "@/models/Otp";
import bcrypt from "bcryptjs";
import routes from "@/lib/routes";
import {isStringInvalid} from "@/lib/utils";

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            credentials: {
                name: {label: 'Name', type: 'text'},
                email: {label: 'Email', type: 'email'},
                code: {label: 'Verification Code', type: 'password'},
            },
            async authorize(credentials: Partial<Record<'name' | 'email' | 'code', any>>, req: Request): Promise<any> {
                await dbConnect();
                console.log('credentials:', credentials);

                // don't use try/catch
                if (isStringInvalid(credentials.email) || isStringInvalid(credentials.code)) {
                    console.error('Email and/or code missing ❌');
                    throw new Error('missingEmailCode');
                    // return null;
                }

                let user = await UserModel.findOne({email: credentials.email});
                if (!user) {
                    console.log('user not found ℹ️');
                    console.log('name:', credentials.name, !credentials.name, typeof credentials.name);
                    if (isStringInvalid(credentials.name)) {
                        console.error('Name missing ❌');
                        throw new Error('missingName');
                        // return null;
                    } else {
                        user = await UserModel.create({
                            name: credentials.name,
                            email: credentials.email,
                            image: null,
                            googleId: null,
                            createdAt: new Date(),
                        });
                    }
                }

                const storedOtp = await OtpModel.findOne({email: credentials.email});
                if (!storedOtp || new Date() > new Date(storedOtp.codeExpiry)) {
                    console.error('Code expired ❌');
                    throw new Error('expiredCode');
                    // return {code: "expiredCode", success: false, message: "Code has been expired"} as ApiResponse;
                }

                // validate credentials
                const isCodeMatched = await bcrypt.compare(credentials.code, storedOtp.hashedOtp);
                if (!isCodeMatched) {
                    console.error('Code invalid ❌');
                    throw new Error('invalidCode');
                    // return {code: "invalidCode", success: false, message: "Invalid verification code"} as ApiResponse;
                }

                await OtpModel.deleteOne({email: credentials.email});

                return user;
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
    callbacks: {
        async signIn({user, account, profile}) {
            console.log("signIn callback user:", JSON.stringify(user, null, 2));
            return true;
        },

        async authorized({request: {nextUrl}, auth}) {
            const isLoggedIn = !!auth?.user;
            const {pathname} = nextUrl;
            if (pathname.startsWith(routes.loginPath()) && isLoggedIn) {
                return Response.redirect(new URL(routes.homePath(), nextUrl));
            }
            return !!auth;
        },

        async jwt({token, user}: { token: JWT; user: User }) {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string || 'Default User';
                token.email = user.email as string;
            }
            console.log('token from jwt:', token);
            console.log('user from jwt:', user);
            return token;
        },

        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name || 'Default User';
                session.user.email = token.email;
            }
            console.log('session from session:', session);
            console.log('token from session:', token);
            return session;
        },
    },
    debug: true,
});
