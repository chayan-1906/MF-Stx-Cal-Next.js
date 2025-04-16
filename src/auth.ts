import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "@/lib/config";
import Credentials from "@auth/core/providers/credentials";
import {dbConnect, getUserFromDb} from "@/lib/db";
import bcrypt from "bcryptjs";

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
                    // logic to verify if the user exists
                    const user = await getUserFromDb(credentials);

                    if (!user) {
                        // No user found, so this is their first attempt to login
                        // Optionally, this is also the place you could do a user registration
                        throw new Error('Invalid credentials');
                    }

                    // logic to compare entered and hash password
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    // return user object with their profile data
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }
                } catch (error: any) {
                    throw new Error(error);
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
});
