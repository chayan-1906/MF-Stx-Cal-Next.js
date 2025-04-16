import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "@/lib/config";

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
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
    ],
});
