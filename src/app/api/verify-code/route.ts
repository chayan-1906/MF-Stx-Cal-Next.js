import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {ApiResponse} from "@/types/ApiResponse";
import UserModel from "@/models/User";
import {dbConnect} from "@/lib/db";
import OtpModel from "@/models/Otp";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";

/** VERIFY CODE */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const {name, email, code} = await request.json();

        if (!email || !code) {
            return {code: 'missingCredentials', success: false, message: 'Email and code are required'} as ApiResponse;
        }

        let user = await UserModel.findOne({email});
        if (!user) {
            console.log('user not found ℹ️');
            if (!name) {
                return NextResponse.json<ApiResponse>({
                    code: 'missingName',
                    success: false,
                    message: 'Name is required',
                });
                // return {code: 'missingName', success: false, message: 'Name is required'} as ApiResponse;
            }
            user = await UserModel.create({
                name,
                email,
                createdAt: new Date(),
            });
        }

        const storedOtp = await OtpModel.findOne({email});
        if (!storedOtp) {
            return NextResponse.json<ApiResponse>({
                code: 'codeNotFound',
                success: false,
                message: 'No code found',
            });
            // return {code: 'codeNotFound', success: false, message: 'No code found'} as ApiResponse;
        }

        if (new Date() > new Date(storedOtp.codeExpiry)) {
            await OtpModel.deleteOne({email});
            return {code: 'expiredCode', success: false, message: 'Code has been expired'} as ApiResponse;
        }

        const isValid = await bcrypt.compare(code, storedOtp.hashedOtp);
        if (!isValid) {
            return {code: 'invalidCode', success: false, message: 'Invalid verification code'} as ApiResponse;
        }

        await OtpModel.deleteOne({email});

        return {
            code: 'authenticated',
            success: true,
            message: 'User authenticated',
            data: {user},
        } as ApiResponse;
    } catch (error: any) {
        console.error('Error verifying token', error);
        return Response.json(<ApiResponse>{
            code: 'unknownError',
            success: false,
            message: 'Error verifying code',
            error,
        }, {status: 500});
    }
}
