import {NODE_ENV} from "@/lib/config";
import {headers} from "next/headers";
import {getToken} from "@auth/core/jwt";
import {deployedCookieName, getRawToken, localhostCookieName} from "@/lib/db/user-storage";
import {ApiResponse} from "@/types/ApiResponse";
import MFSIPModel, {MFSIP} from "@/models/MFSIP";
import {dbConnect} from "@/lib/db/index";
import mongoose from "mongoose";
import {flattenMfSip, transformMfSip} from "@/lib/utils";
import MFLumpsumModel from "@/models/MFLumpsum";

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
        })
            .populate('mfFundId', 'fundName schemeName folioNo category')
            .lean()
            .exec();
        console.timeEnd('databaseOperations - II ⏰');

        console.timeEnd('getMfSipsByToken ⏰');
        return {
            code: 'fetched',
            success: true,
            message: 'MFSIPs fetched',
            data: {
                mfSips: mfSips.map((sip) => transformMfSip(flattenMfSip(sip))),
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
        const mfSip = await MFSIPModel.findOne({externalId: mfSipExternalId})
            .populate('mfFundId', 'fundName schemeName folioNo category')
            .lean()
            .exec() as MFSIP | null;
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
                /*mfSip: mfSip
                    ? {
                        ...mfSip,
                        mfSipId: mfSip?._id?.toString(),
                        userId: mfSip.userId.toString(),
                        _id: undefined,
                        __v: undefined,
                    }
                    : null,*/
                mfSip: mfSip ? transformMfSip(flattenMfSip(mfSip)) : null,
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
        const currentDay = today.getDate();
        // const startOfMonth = new Date(year, month - 1, 1);
        // const endOfMonth = new Date(year, month, 0);

        console.time('databaseOperations ⏰');
        const [mfSipsByDates, totals] = await Promise.all([
            MFSIPModel.aggregate([
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
                    $lookup: {
                        from: 'mffunds', // Ensure this matches your actual collection name
                        localField: 'mfFundId',
                        foreignField: '_id',
                        as: 'mfFundId',
                    },
                },
                {$unwind: '$mfFundId'},
                {
                    $addFields: {
                        'sips.userId': {$toString: '$userId'},
                        'sips.mfFundId': {$toString: '$mfFundId._id'},
                        'sips.mfSipId': {$toString: '$_id'},
                        fundName: '$mfFundId.fundName',
                        schemeName: '$mfFundId.schemeName',
                        folioNo: '$mfFundId.folioNo',
                        category: '$mfFundId.category',
                    },
                },
                {
                    $group: {
                        _id: '$dayOfMonth',
                        count: {$sum: 1},
                        sips: {
                            $push: {
                                $mergeObjects: [
                                    '$$ROOT',
                                    {
                                        mfFundId: {$toString: '$mfFundId._id'},
                                        mfSipId: {$toString: '$_id'},
                                        userId: {$toString: '$userId'},
                                    },
                                ],
                            },
                        },
                    },
                },
                {$sort: {_id: 1}},
                {
                    $project: {
                        dayOfMonth: '$_id',
                        count: 1,
                        sips: {
                            mfSipId: 1,
                            mfFundId: 1,
                            userId: 1,
                            fundName: 1,
                            schemeName: 1,
                            folioNo: 1,
                            category: 1,
                            amount: 1,
                            dayOfMonth: 1,
                            startDate: 1,
                            endDate: 1,
                            notes: 1,
                            externalId: 1,
                        },
                        _id: 0,
                    },
                },
            ]).exec(),
            MFSIPModel.aggregate([
                {
                    $match: {
                        active: true,
                        $or: [{endDate: {$gte: today}}, {endDate: null}],
                        userId: new mongoose.Types.ObjectId(token.userId),
                    },
                },
                {
                    $group: {   /// ???
                        _id: null,
                        totalActiveSipAmount: {$sum: '$amount'},
                        amountPaidThisMonth: {
                            $sum: {
                                $cond: [{$lte: ['$dayOfMonth', currentDay]}, '$amount', 0],
                            },
                        },
                        amountRemainingThisMonth: {
                            $sum: {
                                $cond: [{$gt: ['$dayOfMonth', currentDay]}, '$amount', 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalActiveSipAmount: 1,
                        amountPaidThisMonth: 1,
                        amountRemainingThisMonth: 1,
                    },
                },
            ]).exec(),
        ]);
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
        // console.log('daysInMonth:', daysInMonth);

        console.timeEnd('getMFSIPsByDayOfMonth ⏰');
        return {
            code: 'fetched',
            success: true,
            message: 'MFSIPs for month fetched',
            data: {
                mfSips: daysInMonth,
                totals: totals[0] || {
                    totalActiveSipAmount: 0,
                    amountPaidThisMonth: 0,
                    amountRemainingThisMonth: 0,
                },
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

export async function getMfLumpsumsByToken(): Promise<ApiResponse> {
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.time('getMfLumpsumsByToken ⏰');

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
        const mfLumpsums = await MFLumpsumModel.find({
            userId: new mongoose.Types.ObjectId(token.userId),
            // userId: new mongoose.Types.ObjectId('6807d28c0c61b460a607b398'),
        })
            .populate('mfFundId', 'fundName schemeName folioNo category')
            .lean()
            .exec();
        console.timeEnd('databaseOperations - II ⏰');

        console.timeEnd('getMfLumpsumsByToken ⏰');
        return {
            code: 'fetched',
            success: true,
            message: 'MFSIPs fetched',
            data: {
                mfLumpsums: mfLumpsums.map((lumpsum) => transformMfSip(flattenMfSip(lumpsum))),
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
