import {getToken} from "@auth/core/jwt";
import {dbConnect} from "@/lib/db/index";
import UserModel, {User} from "@/models/User";
import {headers} from "next/headers";

export async function getEmailFromToken() {
    // const token = await getToken({req: {headers: {cookie: (await cookies()).toString()}} as any, secret: NEXTAUTH_SECRET});
    const cookieHeader = (await headers()).get("cookie") ?? "";

    const token =
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: "__Secure-authjs.session-token",
        })) ||
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: "authjs.session-token",
        }));
    console.log('token in getEmailFromToken:', token);
    if (!token?.email) return null;
    return token.email;
}

async function getUserFromDb(): Promise<User | null> {
    await dbConnect();

    try {
        const email = await getEmailFromToken();
        if (!email) {
            return null;
        }

        const user = await UserModel.findOne({email});
        if (!user) {
            return null;
        }

        return user;
    } catch (error: any) {
        console.log('error in getUserFromDb:', error);
        return null;
    }
}

export {getUserFromDb}
