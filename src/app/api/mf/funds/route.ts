import {dbConnect} from "@/lib/db";
import {isStringInvalid, transformMfFund} from "@/lib/utils";
import {NextResponse} from "next/server";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import UserModel from "@/models/User";
import MFFundModel from "@/models/MFFund";
import {ApiResponse} from "@/types/ApiResponse";
import mongoose from "mongoose";

/** ADD MF FUND */
export async function POST(request: Request) {
    console.time('addMFFund ⏰');
    await dbConnect();

    try {
        console.time('parseInput');
        const {fundName, fundCode, schemeName, folioNo, notes, category} = await request.json();
        console.timeEnd('parseInput ⏰');

        // Validation
        if (isStringInvalid(fundName)) {
            return NextResponse.json(
                {code: 'missingFundName', success: false, message: 'Fund Name is required'},
                {status: 400}
            );
        }
        if (fundCode && typeof fundCode !== 'string') {
            return NextResponse.json(
                {code: 'invalidFundCode', success: false, message: 'Fund code must be a string'},
                {status: 400}
            );
        }
        if (isStringInvalid(schemeName)) {
            return NextResponse.json(
                {code: 'invalidSchemeName', success: false, message: 'Scheme name must be a string'},
                {status: 400}
            );
        }
        if (isStringInvalid(folioNo)) {
            return NextResponse.json(
                {code: 'invalidFolioNo', success: false, message: 'Folio no must be a string'},
                {status: 400}
            );
        }
        if (notes && typeof notes !== 'string') {
            return NextResponse.json(
                {code: 'invalidNotes', success: false, message: 'Notes must be a string'},
                {status: 400}
            );
        }
        if (!['equity', 'debt', 'liquid'].includes(category)) {
            return NextResponse.json(
                {code: 'invalidCategory', success: false, message: 'Category must be equity, debt, or liquid'},
                {status: 400}
            );
        }

        console.time('tokenValidation ⏰');
        const {userId} = await getUserDetailsFromToken();
        console.timeEnd('tokenValidation ⏰');
        if (!userId) {
            return NextResponse.json(
                {code: 'unauthorized', success: false, message: 'Invalid token'},
                {status: 401}
            );
        }

        console.time('databaseOperations ⏰');

        // Create Fund
        const addedFund = await MFFundModel.create({
            userId,
            fundName,
            fundCode,
            schemeName,
            folioNo,
            notes,
            category,
        });

        const user = await UserModel.findByIdAndUpdate(
            userId,
            {$push: {mfFundIds: addedFund._id}},
            {lean: true, select: '_id'}
        );
        if (!user) {
            await MFFundModel.deleteOne({_id: addedFund._id});
            return NextResponse.json({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }
        console.timeEnd('databaseOperations ⏰');

        console.timeEnd('addMFFund ⏰');
        return NextResponse.json({
            code: 'added',
            success: true,
            message: 'Fund added successfully',
            data: {fund: addedFund},
        }, {status: 201});
    } catch (error) {
        console.error('Error in adding mfFund:', error);
        console.timeEnd('addMFFund ⏰');
        return NextResponse.json(
            {code: 'unknownError', success: false, message: 'Something went wrong', error},
            {status: 500}
        );
    }
}

/** GET ALL MFFunds */
export async function GET(request: Request) {
    console.log('Function invoked at ⏰:', new Date().toISOString());
    console.log('getAllMFFunds called');

    const url = new URL(request.url);
    const rawSearchTerm = url.searchParams.get('searchTerm');
    const searchTerm = decodeURIComponent(rawSearchTerm ?? '');
    console.log('searchTerm:', searchTerm);

    console.time('dbConnect ⏰');
    await dbConnect();
    console.timeEnd('dbConnect ⏰');

    try {
        console.time('tokenValidation ⏰');
        const {userId} = await getUserDetailsFromToken();
        console.log('userId:', userId);
        console.timeEnd('tokenValidation ⏰');

        console.time('databaseOperations ⏰');
        const query: { userId: mongoose.Types.ObjectId; $or?: Array<any> } = {userId: new mongoose.Types.ObjectId(userId)};
        if (searchTerm) {
            const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'i');
            query.$or = [
                {folioNo: regex},
                {schemeName: regex},
                {fundName: regex},
                {fundCode: regex}
            ];
        }
        const mfFunds = await MFFundModel.find(query).lean().exec();
        console.timeEnd('databaseOperations ⏰');

        console.timeEnd('getAllMFFunds ⏰');
        return NextResponse.json(<ApiResponse>{
            code: 'fetched',
            success: true,
            message: 'MFFunds fetched',
            data: {
                mfFunds: mfFunds?.map(transformMfFund),
            },
        }, {status: 200});
    } catch (error: any) {
        console.error('error in fetching mfFunds:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}
