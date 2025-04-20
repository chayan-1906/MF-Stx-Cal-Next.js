import {dbConnect} from "@/lib/db";
import {ApiResponse} from "@/types/ApiResponse";
import {NextResponse} from "next/server";
import UserModel from "@/models/User";
import {isStringInvalid} from "@/lib/utils";
import {getToken} from "@auth/core/jwt";
import {NEXTAUTH_SECRET} from "@/lib/config";

/** DELETE ACCOUNT */
export async function DELETE(request: Request) {
    await dbConnect();

    try {
        // Get the JWT token
        const token = await getToken({req: request, secret: NEXTAUTH_SECRET});
        console.log('token:', token);

        // Check if token exists and compare emails
        if (!token || !token.email) {
            return NextResponse.json<ApiResponse>({
                code: 'unauthorized',
                success: false,
                message: 'Email does not match authenticated user',
            }, {status: 403});
        }

        const dbUser = await UserModel.deleteOne({email: token.email});

        return Response.json(<ApiResponse>{
            code: 'deleted',
            success: true,
            message: 'Account has been deleted',
        }, {status: 200});
    } catch (error: any) {
        console.error('Error in updating user', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error in updating user', error}, {status: 500});
    }
}
