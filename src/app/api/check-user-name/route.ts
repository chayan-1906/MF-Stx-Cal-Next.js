import {dbConnect} from "@/lib/db";
import UserModel from "@/models/User";
import {ApiResponse} from "@/types/ApiResponse";
import {NextResponse} from "next/server";
import {isStringInvalid} from "@/lib/utils";

/** CHECK NAME */
export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const email = searchParams.get('email');

    await dbConnect();
    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'No user found with this email',
            });
        }

        if (isStringInvalid(user.name)) {
            return NextResponse.json<ApiResponse>({
                code: 'missingName',
                success: false,
                message: 'User doesn\'t have a name',
            });
        }

        return NextResponse.json<ApiResponse>({
            code: 'nameExists',
            success: true,
            message: 'User has a name',
        });
    } catch (error: any) {
        console.error('error in getUserFromDb:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
        });
    }
}
