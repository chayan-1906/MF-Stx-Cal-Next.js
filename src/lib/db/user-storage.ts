import {getToken} from "@auth/core/jwt";
import {cookies} from "next/headers";
import {dbConnect} from "@/lib/db/index";
import UserModel, {User} from "@/models/User";
import {NEXTAUTH_SECRET} from "@/lib/config";

export async function getEmailFromToken() {
    const token = await getToken({req: {headers: {cookie: (await cookies()).toString()}} as any, secret: NEXTAUTH_SECRET});
    console.log('token in getEmailFromToken:', token);
    if (!token?.email) throw new Error('Unauthorized');
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
