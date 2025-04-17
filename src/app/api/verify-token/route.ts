import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {ApiResponse} from "@/types/ApiResponse";
import {dbConnect} from "@/lib/db";
import UserModel from "@/models/User";

/** VERIFY TOKEN */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const {email, token} = await request.json();
        const decodedEmail = decodeURIComponent(email);
        const user = await UserModel.findOne({email: decodedEmail});
        if (!user) {
            return Response.json(<ApiResponse>{
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        const isTokenValid = user.token === token;
        const isTokenNotExpired = new Date(user.tokenExpiry ?? '') > new Date();
        if (user.isVerified) {
            return Response.json(<ApiResponse>{
                code: 'alreadyVerified',
                success: false,
                message: 'User already verified',
            }, {status: 400});
        } else if (isTokenValid && isTokenNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(<ApiResponse>{
                code: 'verified',
                success: true,
                message: 'Account verified successfully',
            }, {status: 200});
        } else {
            return Response.json(<ApiResponse>{
                code: 'invalidExpiredToken',
                success: false,
                message: 'Token is either invalid or expired',
            }, {status: 400});
        }
    } catch (error: any) {
        console.error('Error verifying token', error);
        return Response.json(<ApiResponse>{
            code: 'unknownError',
            success: false,
            message: 'Error verifying token',
            error,
        }, {status: 500});
    }
}
