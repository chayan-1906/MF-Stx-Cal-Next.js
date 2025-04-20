import {NextResponse} from "next/server";
import {ApiResponse} from "@/types/ApiResponse";
import {dbConnect} from "@/lib/db";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import MFSIPModel from "@/models/MFSIP";
import UserModel from "@/models/User";
import {isStringInvalid} from "@/lib/utils";

/** ADD MFSIP */
export async function POST(request: Request) {
    console.log('addMFSIP called');

    await dbConnect();

    try {
        const {fundName, fundCode, amount, dayOfMonth, active, startDate, endDate, notes, category} = await request.json();

        /** validation */
        if (isStringInvalid(fundName)) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingFundName',
                success: false,
                message: 'Fund Name is required',
            }, {status: 400});
        } else if (fundCode && typeof fundCode !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidFundCode',
                success: false,
                message: 'Fund code must be a string',
            }, {status: 400});
        } else if (typeof amount !== 'number' || isNaN(amount) || amount < 1) {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidAmount',
                success: false,
                message: 'Amount is required and must be at least ₹1',
            }, {status: 400});
        } else if (typeof dayOfMonth !== 'number' || isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidDayOfMonth',
                success: false,
                message: 'Day of month must be between 1 and 31',
            }, {status: 400});
        } else if (typeof active !== 'boolean') {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidActive',
                success: false,
                message: 'Active status must be true or false',
            }, {status: 400});
        } else if (!startDate || isNaN(Date.parse(startDate))) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingStartDate',
                success: false,
                message: 'Start date must be a valid date',
            }, {status: 400});
        } else if ((endDate && isNaN(Date.parse(endDate))) || Date.parse(endDate) <= Date.parse(startDate)) {
            return NextResponse.json<ApiResponse>({
                code: 'invalidEndDate',
                success: false,
                message: 'End date must be a valid date and after the start date',
            }, {status: 400});
        } else if (notes && typeof notes !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidNotes',
                success: false,
                message: 'Notes must be a string',
            }, {status: 400});
        } else if (category && !['equity', 'debt', 'liquid'].includes(category)) {
            return NextResponse.json<ApiResponse>({
                code: 'invalidCategory',
                success: false,
                message: 'Category must be equity, debt, or liquid',
            }, {status: 400});
        }

        const {userId} = await getUserDetailsFromToken();
        console.log('userId:', userId);

        const dbUser = await UserModel.findById(userId);
        if (!dbUser) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        const addedSIP = await MFSIPModel.create({
            userId, fundName, fundCode, amount, dayOfMonth, active,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            notes, category,
        });

        await UserModel.findByIdAndUpdate(userId, {
            $push: {mfSIPIds: addedSIP._id},
        });

        return NextResponse.json(<ApiResponse>{
            code: 'added',
            success: true,
            message: 'MFSIP added',
            data: {
                sip: addedSIP,
            },
        }, {status: 201});
    } catch (error: any) {
        console.error('error in adding sip:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}

/** GET ALL MFSIPs */
export async function GET(request: Request) {
    console.log('getAllMFSIPs called');

    await dbConnect();

    try {
        const {userId} = await getUserDetailsFromToken();
        console.log('userId:', userId);

        const dbUser = await UserModel.findById(userId).select('mfSIPIds');
        if (!dbUser) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        if (!dbUser.mfSIPIds || dbUser.mfSIPIds.length === 0) {
            return NextResponse.json<ApiResponse>({
                code: 'noSIPs',
                success: false,
                message: 'No SIPs found for this user',
            }, {status: 200});
        }

        // both are same
        /*const mfSips = await MFSIPModel.find({
            userId: new mongoose.Types.ObjectId(userId),
        });*/
        // const mfSips = await MFSIPModel.where('userId').equals(userId);
        const mfSips = await MFSIPModel.find({_id: {$in: dbUser.mfSIPIds}});

        return NextResponse.json(<ApiResponse>{
            code: 'fetched',
            success: true,
            message: 'MFSIPs fetched',
            data: {
                mfSips,
            },
        }, {status: 201});
    } catch (error: any) {
        console.error('error in adding sip:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}
