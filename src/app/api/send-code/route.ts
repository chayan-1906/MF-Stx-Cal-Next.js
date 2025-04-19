import {dbConnect} from "@/lib/db";
import {ApiResponse} from "@/types/ApiResponse";
import {sendVerificationEmail} from "@/lib/email";
import {generateRandomCode} from "@/lib/utils";
import {TOKEN_EXPIRY} from "@/lib/config";
import {Otp} from "@/models/Otp";
import {NextResponse} from "next/server";

/** SEND OTP/CODE */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const {email} = await request.json();
        const code = generateRandomCode();
        const codeExpiry = new Date(Date.now() + Number(TOKEN_EXPIRY ?? 0));

        if (!email) {
            return NextResponse.json({
                code: 'missingEmail',
                success: false,
                message: 'Email is required',
            } as ApiResponse);
        }

        const sendVerificationEmailResponse = await sendVerificationEmail({email, code, codeExpiry} as Otp);

        return Response.json(<ApiResponse>{
            code: sendVerificationEmailResponse.code,
            success: sendVerificationEmailResponse.success,
            message: sendVerificationEmailResponse.message,
            verificationCode: code, // todo remove
        }, {status: sendVerificationEmailResponse.success ? 201 : 400});
    } catch (error) {
        console.error('Error in sending code', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error sending code', error}, {status: 500});
    }
}
