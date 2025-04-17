import NextAuth, {Session, User} from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "@/lib/config";
import Credentials from "@auth/core/providers/credentials";
import {createUserInDb, dbConnect} from "@/lib/db";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import {JWT} from "next-auth/jwt";

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {label: 'Email', type: 'text'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({email: credentials.email});
                    if (!user) {
                        throw new Error('Invalid credentials');
                    }
                    if (!user.isVerified) {
                        throw new Error('Account not verified. Please check your email for a verification link.');
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password ?? '');
                    if (isPasswordCorrect) {
                        return {
                            id: user._id?.toString(),
                            email: user.email,
                            name: user.name,
                            isVerified: user.isVerified,
                        };
                    }
                    throw new Error('Incorrect credentials');
                } catch (error: any) {
                    throw new Error(error.message);
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
        /** TODO: Add Apple OAuth */
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
            } else if (account?.provider === 'credentials') {
                return user.isVerified || false;
            }
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
});
