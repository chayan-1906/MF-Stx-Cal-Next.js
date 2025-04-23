import {getToken} from "@auth/core/jwt";
import {dbConnect} from "@/lib/db/index";
import UserModel, {User} from "@/models/User";
import {cookies, headers} from "next/headers";
import {NODE_ENV} from "@/lib/config";

export const localhostCookieName = 'authjs.session-token';
export const deployedCookieName = '__Secure-authjs.session-token';

export async function getRawToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get(deployedCookieName)?.value || cookieStore.get(localhostCookieName)?.value;
    console.log('rawToken:', token);
    return token;
}

export async function getEmailFromToken() {
    if (NODE_ENV === 'development') {
        await getRawToken();
    }

    // const token = await getToken({req: {headers: {cookie: (await cookies()).toString()}} as any, secret: NEXTAUTH_SECRET});
    const cookieHeader = (await headers()).get("cookie") ?? "";

    const token =
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: deployedCookieName,
        })) ||
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: localhostCookieName,
        }));
    console.log('token in getEmailFromToken:', token);
    if (!token?.email) return null;
    return token.email;
}

export async function getUserDetailsFromToken() {
    if (NODE_ENV === 'development') {
        await getRawToken();
    }

    const cookieHeader = (await headers()).get('cookie') ?? '';

    const token =
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: deployedCookieName,
        })) ||
        (await getToken({
            req: {headers: {cookie: cookieHeader}} as any,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: localhostCookieName,
        }));
    console.log('token in getUserIdFromToken:', token);
    // if (!token?.id) return null;
    return {userId: token?.userId, email: token?.email};
}

async function getUserFromDb(): Promise<User | null> {
    await dbConnect();

    try {
        const {email} = await getUserDetailsFromToken();
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
