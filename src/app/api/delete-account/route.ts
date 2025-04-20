import {dbConnect} from "@/lib/db";
import {ApiResponse} from "@/types/ApiResponse";
import {NextResponse} from "next/server";
import UserModel from "@/models/User";
import {getEmailFromToken} from "@/lib/db/user-storage";

/** DELETE ACCOUNT */
export async function DELETE(request: Request) {
    await dbConnect();

    try {
        // Get the JWT token
        // const token = await getToken({req: request, secret: NEXTAUTH_SECRET});
        const email = await getEmailFromToken();
        console.log('email:', email);

        if (!email) {
            return NextResponse.json<ApiResponse>({
                code: 'unauthorized',
                success: false,
                message: 'Email does not match authenticated user',
            }, {status: 401});
        }

        const dbUser = await UserModel.deleteOne({email});

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
