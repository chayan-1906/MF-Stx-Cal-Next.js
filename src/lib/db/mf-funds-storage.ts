import {headers} from "next/headers";
import {getToken} from "@auth/core/jwt";
import {deployedCookieName, localhostCookieName} from "@/lib/db/user-storage";
import {ApiResponse} from "@/types/ApiResponse";
import {dbConnect} from "@/lib/db/index";
import mongoose from "mongoose";
import MFFundModel from "@/models/MFFund";
import {transformMfFund} from "../utils";

export async function getMfFundsByToken(): Promise<ApiResponse> {
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.time('getMfFundsByToken ⏰');

    try {
        console.time('dbConnect ⏰');
        await dbConnect();
        console.timeEnd('dbConnect ⏰');

        console.time('tokenValidation ⏰');
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
        console.timeEnd('tokenValidation ⏰');

        if (!token?.userId) {
            return {
                code: 'unauthorized',
                success: false,
                message: 'Invalid or missing token',
            };
        }

        console.time('databaseOperations ⏰');
        const mfFunds = await MFFundModel.find({
            userId: new mongoose.Types.ObjectId(token.userId),
            // userId: new mongoose.Types.ObjectId('6807d28c0c61b460a607b398'),
        }).lean().exec();
        console.timeEnd('databaseOperations ⏰');

        console.timeEnd('getMfFundsByToken ⏰');
        return {
            code: 'fetched',
            success: true,
            message: 'MFFunds fetched',
            data: {
                /* mfFunds: mfFunds.map((mfFund) => ({
                     ...mfFund,
                     mfSipId: mfFund?._id?.toString(),
                     userId: mfFund.userId.toString(),
                     _id: undefined,
                     __v: undefined,
                 })),*/
                mfFunds: mfFunds.map(transformMfFund),
            },
        };
    } catch (error) {
        console.error('Error in fetching MFFunds:', error);
        console.timeEnd('getMfFundsByToken ⏰');
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}
