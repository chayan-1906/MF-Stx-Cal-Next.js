import {NODE_ENV} from "@/lib/config";
import {headers} from "next/headers";
import {getToken} from "@auth/core/jwt";
import {deployedCookieName, getRawToken, localhostCookieName} from "@/lib/db/user-storage";
import UserModel from "@/models/User";
import {ApiResponse} from "@/types/ApiResponse";
import MFSIPModel from "@/models/MFSIP";

export async function getMfSipsByToken(): Promise<ApiResponse> {
    try {
        if (NODE_ENV === 'development') {
            await getRawToken();
        }

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
        console.log('token in getUserIdFromToken:', token);

        const dbUser = await UserModel.findById(token?.userId).select('mfSIPIds');
        if (!dbUser) {
            return {
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            };
        }

        if (!dbUser.mfSIPIds || dbUser.mfSIPIds.length === 0) {
            return {
                code: 'noSIPs',
                success: true,
                message: 'No SIPs found for this user',
            };
        }

        // both are same
        /*const mfSips = await MFSIPModel.find({
            userId: new mongoose.Types.ObjectId(userId),
        });*/
        // const mfSips = await MFSIPModel.where('userId').equals(userId);
        const mfSips = await MFSIPModel.find({_id: {$in: dbUser.mfSIPIds}})
            .lean()
            .exec();

        return {
            code: 'fetched',
            success: true,
            message: 'MFSIPs fetched',
            data: {
                mfSips: mfSips.map((mfSip) => ({
                    ...mfSip,
                    mfSipId: mfSip?._id?.toString(),
                    userId: mfSip.userId.toString(),
                    // startDate: mfSip.startDate.toISOString(),
                    // endDate: mfSip.endDate ? mfSip.endDate.toISOString() : null,
                    _id: undefined,
                    __v: undefined,
                })),
            },
        };
    } catch (error: any) {
        console.error('error in fetching mfsips:', error);
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}
