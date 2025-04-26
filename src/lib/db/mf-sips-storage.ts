import {NODE_ENV} from "@/lib/config";
import {headers} from "next/headers";
import {getToken} from "@auth/core/jwt";
import {deployedCookieName, getRawToken, localhostCookieName} from "@/lib/db/user-storage";
import {ApiResponse} from "@/types/ApiResponse";
import MFSIPModel, {MFSIP} from "@/models/MFSIP";
import {dbConnect} from "@/lib/db/index";
import mongoose from "mongoose";

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

        /*console.time('databaseOperations - I ⏰');
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
        console.timeEnd('databaseOperations - I ⏰');
        console.log('mfSips:', mfSips.length);*/

        console.time('databaseOperations - II ⏰');
        const mfSips = await MFSIPModel.find({
            userId: new mongoose.Types.ObjectId(token.userId),
            // userId: new mongoose.Types.ObjectId('6807d28c0c61b460a607b398'),
        }).lean().exec();
        console.timeEnd('databaseOperations - II ⏰');

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
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.time('getMfSipByExternalId ⏰');
    try {
        console.time('dbConnect ⏰');
        await dbConnect();
        console.timeEnd('dbConnect ⏰');

        console.time('tokenValidation ⏰');
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
        console.timeEnd('tokenValidation ⏰');

        if (!token?.userId) {
            return {
                code: 'unauthorized',
                success: false,
                message: 'Invalid or missing token',
            };
        }

        console.time('databaseOperations ⏰');
        const mfSip = await MFSIPModel.findOne({externalId: mfSipExternalId}).lean().exec() as MFSIP | null;
        console.log('mfSip:', mfSip);
        console.timeEnd('databaseOperations ⏰');

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

        console.timeEnd('getMfSipByExternalId ⏰');
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
        console.timeEnd('getMfSipByExternalId ⏰');
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}

export async function getMFSIPsByDayOfMonth(year: number, month: number): Promise<ApiResponse> {
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.time('getMFSIPsByDayOfMonth ⏰');
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

        const today = new Date();
        // const startOfMonth = new Date(year, month - 1, 1);
        // const endOfMonth = new Date(year, month, 0);

        console.time('databaseOperations ⏰');
        const mfSipsByDates = await MFSIPModel.aggregate([
            {
                $match: {
                    active: true,
                    // startDate: {$lte: endOfMonth},
                    $or: [
                        {endDate: {$gte: today}},
                        {endDate: null},
                    ],
                    userId: new mongoose.Types.ObjectId(token?.userId),
                },
            },
            {
                $group: {
                    _id: '$dayOfMonth',
                    count: {$sum: 1},
                    sips: {$push: '$$ROOT'},
                },
            },
            {$unwind: '$sips'},
            {
                $addFields: {
                    'sips.mfSipId': {$toString: '$sips._id'},
                    'sips.userId': {$toString: '$sips.userId'},
                },
            },
            {
                $unset: ['sips._id', 'sips.__v'],
            },
            {
                $group: {
                    _id: '$_id',
                    count: {$first: '$count'},
                    sips: {$push: '$sips'},
                },
            },
            {$sort: {_id: 1}},
            {
                $project: {
                    dayOfMonth: '$_id',
                    count: 1,
                    sips: 1,
                    _id: 0,
                },
            },
        ]).exec();
        console.timeEnd('databaseOperations ⏰');

        // Initialize array for all days (1-31)
        const daysInMonth = Array.from({length: 31}, (_, i) => ({
            dayOfMonth: i + 1,
            count: 0,
            mfSips: [] as MFSIP[],
        }));

        // Merge results
        mfSipsByDates.forEach(mfSip => {
            daysInMonth[mfSip.dayOfMonth - 1] = mfSip;
        });
        console.log('daysInMonth:', daysInMonth);

        console.timeEnd('getMFSIPsByDayOfMonth ⏰');
        return {
            code: 'fetched',
            success: true,
            message: 'MFSIP fetched',
            data: {
                mfSips: daysInMonth,
            },
        };
    } catch (error: any) {
        console.error('error in fetching mfSipsByDayOfMonth:', error);
        console.timeEnd('getMFSIPsByDayOfMonth ⏰');
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        };
    }
}

// await MFSIPModel.aggregate([{$match: {userId}}, {$group: {_id: 'dayOfMonth'}}, {$sort: {'dayOfMonth': 1}}])
