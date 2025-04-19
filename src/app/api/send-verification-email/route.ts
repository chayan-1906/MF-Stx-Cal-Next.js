import {NextResponse} from "next/server";
import {sendVerificationEmail} from "@/lib/email";
import {Otp} from "@/models/Otp";
import {TOKEN_EXPIRY} from "@/lib/config";
import {ApiResponse} from "@/types/ApiResponse";

/** RESEND CODE */
export async function POST(request: Request) {
    const {email, code} = await request.json();
    const codeExpiry = new Date(Date.now() + Number(TOKEN_EXPIRY ?? 0));

    if (!email) {
        return NextResponse.json({
            code: 'missingEmail',
            success: false,
            message: 'Email is required',
        } as ApiResponse);
    }

    if (!code) {
        return NextResponse.json({
            code: 'missingCode',
            success: false,
            message: 'Code is required',
        } as ApiResponse);
    }

    if (!codeExpiry) {
        return NextResponse.json({
            code: 'missingCodeExpiry',
            success: false,
            message: 'Code expiration is required',
        } as ApiResponse);
    }

    await sendVerificationEmail({email, code, codeExpiry} as Otp);
    return NextResponse.json({});
}
