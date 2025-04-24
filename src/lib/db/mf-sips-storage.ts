import {NODE_ENV} from "@/lib/config";
import {headers} from "next/headers";
import {getToken} from "@auth/core/jwt";
import {deployedCookieName, getRawToken, localhostCookieName} from "@/lib/db/user-storage";
import UserModel from "@/models/User";
import {ApiResponse} from "@/types/ApiResponse";
import MFSIPModel, {MFSIP} from "@/models/MFSIP";
import {dbConnect} from "@/lib/db/index";

/*export async function getMfSipsByToken(): Promise<ApiResponse> {
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
        /!*const mfSips = await MFSIPModel.find({
            userId: new mongoose.Types.ObjectId(userId),
        });*!/
        // const mfSips = await MFSIPModel.where('userId').equals(userId);
        const mfSips = await MFSIPModel.find<MFSIP>({_id: {$in: dbUser.mfSIPIds}})
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
}*/

export async function getMfSipsByToken(): Promise<ApiResponse> {
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.time('getMfSipsByToken ⏰');

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
        const dbUser = await UserModel.findById(token.userId)
            .select('mfSIPIds')
            .lean()
            .exec();

        if (!dbUser) {
            console.timeEnd('databaseOperations ⏰');
            return {
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            };
        }

        if (!dbUser.mfSIPIds || dbUser.mfSIPIds.length === 0) {
            console.timeEnd('databaseOperations ⏰');
            return {
                code: 'noSIPs',
                success: true,
                message: 'No SIPs found for this user',
            };
        }

        const mfSips = await MFSIPModel.find<MFSIP>({_id: {$in: dbUser.mfSIPIds}})
            .lean()
            .exec();
        console.timeEnd('databaseOperations ⏰');
        console.log('mfSips:', mfSips.length);

        console.timeEnd('getMfSipsByToken ⏰');
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
    } catch (error) {
        console.error('Error in fetching MFSIPs:', error);
        console.timeEnd('getMfSipsByToken ⏰');
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}

export async function getMfSipByExternalId(mfSipExternalId: string): Promise<ApiResponse> {
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

        const mfSip = await MFSIPModel.findOne({externalId: mfSipExternalId}).lean().exec() as MFSIP | null;
        console.log('mfSip:', mfSip);

        if (!mfSip) {
            return {
                code: 'sipNotFound',
                success: false,
                message: 'We couldn\'t find the SIP',
            };
        }

        if (mfSip.userId?.toString() !== token?.userId) {
            return {
                code: 'unauthorizedAccess',
                success: false,
                message: 'You are not authorized to access this SIP',
            };
        }

        return {
            code: 'fetched',
            success: true,
            message: 'MFSIP fetched',
            data: {
                mfSip: mfSip
                    ? {
                        ...mfSip,
                        mfSipId: mfSip?._id?.toString(),
                        userId: mfSip.userId.toString(),
                        _id: undefined,
                        __v: undefined,
                    }
                    : null,
            },
        };
    } catch (error: any) {
        console.error('error in fetching mfsip:', error);
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}
