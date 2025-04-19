import NextAuth, {Session, User} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "@/models/User";
import {JWT} from "next-auth/jwt";
import {dbConnect} from "@/lib/db";
import OtpModel from "@/models/Otp";
import bcrypt from "bcryptjs";
import {isStringInvalid} from "@/lib/utils";
import Google from "@auth/core/providers/google";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "@/lib/config";
import routes from "./lib/routes";

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            credentials: {
                email: {label: 'Email', type: 'email'},
                code: {label: 'Verification Code', type: 'password'},
            },
            async authorize(credentials: Partial<Record<'email' | 'code', any>>, req: Request): Promise<any> {
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
                    user = await UserModel.create({
                        name: null,
                        email: credentials.email,
                        image: null,
                        googleId: null,
                        createdAt: new Date(),
                    });
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
                console.log('otp deleted 👈');

                return user;
            },
        }),

        Google({
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

        /** TODO: Add Apple OAuth */
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            console.log('provider:', account?.provider);
            if (account?.provider === 'google') {
                await dbConnect();
                try {
                    const email = user.email;
                    if (!email) return false;

                    let dbUser = await UserModel.findOne({email});
                    console.log('dbUser:', dbUser);

                    if (!dbUser) {
                        console.log('user not found ℹ️');

                        // Create new user for Google sign-in, auto-verified
                        dbUser = await UserModel.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            googleId: profile?.sub,
                            createdAt: new Date(),
                        });
                    } else {
                        // user already exists
                        let needToUpdateDbUser = false;
                        if (isStringInvalid(dbUser.name)) {
                            dbUser.name = user.name || '';
                            needToUpdateDbUser = true;
                        }
                        if (isStringInvalid(dbUser.image)) {
                            dbUser.image = user.image || undefined;
                            needToUpdateDbUser = true;
                        }
                        if (isStringInvalid(dbUser.googleId) && profile?.sub) {
                            dbUser.googleId = profile.sub;
                            needToUpdateDbUser = true;
                        }

                        if (needToUpdateDbUser) {
                            await dbUser.save();
                        }
                    }

                    return true; // Allow sign-in
                } catch (error) {
                    console.error('Error in Google signIn callback:', error);
                    return false;
                }
            } else if (account?.provider === 'credentials') {
                console.log('login with credentials');
            }

            console.log('signIn callback user:', JSON.stringify(user, null, 2));
            return true;
        },

        authorized({request: {nextUrl}, auth}) {
            const isLoggedIn = !!auth?.user;
            console.log('isLoggedIn:', isLoggedIn);
            const {pathname} = nextUrl;
            if (pathname.startsWith(routes.loginPath()) && isLoggedIn) {
                return Response.redirect(new URL(routes.homePath(), nextUrl));
            }
            return !!auth;
        },

        async jwt({token, user}: { token: JWT; user: User }) {
            if (user) {
                // Initial token creation
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
            } else if (token.email) {
                // Refresh token with latest DB data
                const dbUser = await UserModel.findOne({email: token.email});
                if (dbUser) {
                    token.id = dbUser.id as string;
                    token.name = dbUser.name as string;
                    token.email = dbUser.email as string;
                }
            }
            console.log('token from jwt:', token);
            console.log('user from jwt:', user);
            return token;
        },

        async session({session, token}: { session: Session; token: JWT }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            console.log('session from session:', session);
            console.log('token from session:', token);
            return session;
        },
    },
    debug: true,
});
