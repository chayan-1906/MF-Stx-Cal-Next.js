import 'next-auth';
import {DefaultSession} from "next-auth";

declare module 'next-auth' {
    interface User {
        userId: string;
        name?: string;
        email: string;
    }

    interface Session {
        user: {
            userId: string;
            name?: string;
            email: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId: string;
        name?: string;
        email: string;
    }
}
