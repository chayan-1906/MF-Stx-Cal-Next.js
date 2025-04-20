import {dbConnect} from "@/lib/db";
import {ApiResponse} from "@/types/ApiResponse";
import {NextResponse} from "next/server";
import UserModel from "@/models/User";
import {isStringInvalid} from "@/lib/utils";
import {getToken} from "@auth/core/jwt";
import {NEXTAUTH_SECRET} from "@/lib/config";
import {getEmailFromToken} from "@/lib/db/user-storage";

/** UPDATE USER */
export async function PUT(request: Request) {
    await dbConnect();

    try {
        const {name, email} = await request.json();

        if (isStringInvalid(email)) {
            return NextResponse.json<ApiResponse>({
                code: 'missingEmail',
                success: false,
                message: 'Email is required',
            }, {status: 400});
        }

        // Get the JWT token
        // const token = await getToken({req: request, secret: NEXTAUTH_SECRET});
        const emailFromToken = await getEmailFromToken();
        console.log('email:', email);

        // Check if token exists and compare emails
        if (!emailFromToken || emailFromToken !== email) {
            return NextResponse.json<ApiResponse>({
                code: 'unauthorized',
                success: false,
                message: 'Email does not match authenticated user',
            }, {status: 401});
        }

        const dbUser = await UserModel.findOne({email});
        if (!dbUser) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        if (!isStringInvalid(name)) {
            dbUser.name = name;
        }
        await dbUser.save();

        return Response.json(<ApiResponse>{
            code: 'updated',
            success: true,
            message: 'User has been updated',
        }, {status: 200});
    } catch (error: any) {
        console.error('Error in updating user', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error in updating user', error}, {status: 500});
    }
}
