import {NextResponse} from "next/server";
import {ApiResponse} from "@/types/ApiResponse";
import {dbConnect} from "@/lib/db";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import MFSIPModel from "@/models/MFSIP";
import UserModel from "@/models/User";
import {isStringInvalid} from "@/lib/utils";
import mongoose from "mongoose";

/** ADD MFSIP */
/*export async function POST(request: Request) {
    console.log('addMFSIP called');

    await dbConnect();

    try {
        const {fundName, fundCode, schemeName, folioNo, amount, dayOfMonth, active, startDate, endDate, notes, category} = await request.json();

        /!** validation *!/
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
        } else if (isStringInvalid(schemeName)) {
            return NextResponse.json<ApiResponse>({
                code: 'invalidSchemeName',
                success: false,
                message: 'Scheme name must be a string',
            }, {status: 400});
        } else if (isStringInvalid(folioNo)) {
            return NextResponse.json<ApiResponse>({
                code: 'invalidFolioNo',
                success: false,
                message: 'Folio no must be a string',
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
        } else if (!['equity', 'debt', 'liquid'].includes(category)) {
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
            userId, fundName, fundCode, schemeName, folioNo, amount, dayOfMonth, active,
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
            message: 'SIP added successfully',
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
}*/

export async function POST(request: Request) {
    console.time('addMFSIP ⏰'); // Log total execution time
    await dbConnect();

    try {
        console.time('parseInput');
        const {
            mfFundId,
            // fundName,
            // fundCode,
            // schemeName,
            // folioNo,
            amount,
            dayOfMonth,
            active,
            startDate,
            endDate,
            notes,
            // category,
        } = await request.json();
        console.timeEnd('parseInput ⏰');

        // Validation
        if (isStringInvalid(mfFundId)) {
            return NextResponse.json(
                {code: 'missingFundId', success: false, message: 'Fund ID is required'},
                {status: 400}
            );
        }
        if (typeof amount !== 'number' || isNaN(amount) || amount < 1) {
            return NextResponse.json(
                {code: 'invalidAmount', success: false, message: 'Amount is required and must be at least ₹1'},
                {status: 400}
            );
        }
        if (typeof dayOfMonth !== 'number' || isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
            return NextResponse.json(
                {
                    code: 'invalidDayOfMonth',
                    success: false,
                    message: 'Day of month must be between 1 and 31',
                },
                {status: 400}
            );
        }
        if (typeof active !== 'boolean') {
            return NextResponse.json(
                {code: 'invalidActive', success: false, message: 'Active status must be true or false'},
                {status: 400}
            );
        }
        if (!startDate || isNaN(Date.parse(startDate))) {
            return NextResponse.json(
                {code: 'missingStartDate', success: false, message: 'Start date must be a valid date'},
                {status: 400}
            );
        }
        if (endDate && (isNaN(Date.parse(endDate)) || Date.parse(endDate) <= Date.parse(startDate))) {
            return NextResponse.json(
                {
                    code: 'invalidEndDate',
                    success: false,
                    message: 'End date must be a valid date and after the start date',
                },
                {status: 400}
            );
        }
        if (notes && typeof notes !== 'string') {
            return NextResponse.json(
                {code: 'invalidNotes', success: false, message: 'Notes must be a string'},
                {status: 400}
            );
        }
        /*if (!['equity', 'debt', 'liquid'].includes(category)) {
            return NextResponse.json(
                {code: 'invalidCategory', success: false, message: 'Category must be equity, debt, or liquid'},
                {status: 400}
            );
        }*/

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
        // Combine user check and update
        const user = await UserModel.findOneAndUpdate(
            {_id: userId},
            {$push: {mfSIPIds: {$each: []}}},
            {lean: true, select: '_id'}
        );
        if (!user) {
            console.timeEnd('databaseOperations ⏰');
            return NextResponse.json(
                {code: 'userNotFound', success: false, message: 'User not found'},
                {status: 404}
            );
        }

        // Create SIP
        const addedSIP = await MFSIPModel.create({
            userId,
            mfFundId,
            // fundName,
            // fundCode,
            // schemeName,
            // folioNo,
            amount,
            dayOfMonth,
            active,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            notes,
            // category,
        });

        // Update user with SIP ID
        await UserModel.updateOne(
            {_id: userId},
            {$push: {mfSIPIds: addedSIP._id}}
        );
        console.timeEnd('databaseOperations ⏰');

        console.timeEnd('addMFSIP ⏰');
        return NextResponse.json(
            {
                code: 'added',
                success: true,
                message: 'SIP added successfully',
                data: {sip: addedSIP},
            },
            {status: 201}
        );
    } catch (error) {
        console.error('Error in adding SIP:', error);
        console.timeEnd('addMFSIP ⏰');
        return NextResponse.json(
            {code: 'unknownError', success: false, message: 'Something went wrong', error},
            {status: 500}
        );
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
        console.error('error in fetching mfsips:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}

/** UPDATE MFSIP */
export async function PUT(request: Request) {
    console.log('updateMFSIP called');
    await dbConnect();

    try {
        // const {mfSipId, fundName, fundCode, schemeName, folioNo, amount, dayOfMonth, active, startDate, endDate, notes, category} = await request.json();
        const {
            mfSipId,
            mfFundId,
            // fundName,
            // fundCode,
            // schemeName,
            // folioNo,
            amount,
            dayOfMonth,
            active,
            startDate,
            endDate,
            notes,
            // category,
        } = await request.json();

        /** validation */
        if (isStringInvalid(mfSipId)) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingMfSipId',
                success: false,
                message: 'mfSipId is required',
            }, {status: 400});
        }
        if (isStringInvalid(mfFundId)) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingMfFundId',
                success: false,
                message: 'mfFundId is required',
            }, {status: 400});
        }
        /*if (fundName !== undefined && isStringInvalid(fundName)) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingFundName',
                success: false,
                message: 'Fund Name is required',
            }, {status: 400});
        }
        if (fundCode !== undefined && typeof fundCode !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidFundCode',
                success: false,
                message: 'Fund code must be a string',
            }, {status: 400});
        }
        if (schemeName !== undefined && typeof schemeName !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidSchemeName',
                success: false,
                message: 'Scheme name must be a string',
            }, {status: 400});
        }
        if (folioNo !== undefined && typeof folioNo !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidFolioNo',
                success: false,
                message: 'Folio no must be a string',
            }, {status: 400});
        }*/
        if (amount !== undefined && (typeof amount !== 'number' || isNaN(amount) || amount < 1)) {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidAmount',
                success: false,
                message: 'Amount is required and must be at least ₹1',
            }, {status: 400});
        }
        if (dayOfMonth !== undefined && (typeof dayOfMonth !== 'number' || isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31)) {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidDayOfMonth',
                success: false,
                message: 'Day of month must be between 1 and 31',
            }, {status: 400});
        }
        if (active !== undefined && typeof active !== 'boolean') {
            return NextResponse.json(<ApiResponse>{
                code: 'invalidActive',
                success: false,
                message: 'Active status must be true or false',
            }, {status: 400});
        }
        if (startDate !== undefined && (isStringInvalid(startDate) || isNaN(Date.parse(startDate)))) {
            return NextResponse.json({
                code: 'missingStartDate',
                success: false,
                message: 'Start date must be a valid date',
            }, {status: 400});
        }
        if (endDate !== undefined && endDate !== null && (typeof endDate !== 'string' || isNaN(Date.parse(endDate)))) {
            return NextResponse.json({
                code: 'invalidEndDate',
                success: false,
                message: 'End date must be a valid date',
            }, {status: 400});
        }
        if (startDate && endDate && Date.parse(endDate) <= Date.parse(startDate)) {
            return NextResponse.json({
                code: 'invalidEndDate',
                success: false,
                message: 'End date must be after the start date',
            }, {status: 400});
        }
        if (notes !== undefined && notes !== null && typeof notes !== 'string') {
            return NextResponse.json<ApiResponse>({
                code: 'invalidNotes',
                success: false,
                message: 'Notes must be a string',
            }, {status: 400});
        }
        /*if (category !== undefined && !['equity', 'debt', 'liquid', null].includes(category)) {
            return NextResponse.json<ApiResponse>({
                code: 'invalidCategory',
                success: false,
                message: 'Category must be equity, debt, or liquid',
            }, {status: 400});
        }*/

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
        if (!dbUser.mfSIPIds.includes(mfSipId)) {
            return NextResponse.json<ApiResponse>({
                code: 'sipNotFound',
                success: false,
                message: 'SIP not found or does not belong to user',
            }, {status: 404});
        }

        const existingSIP = await MFSIPModel.findById(mfSipId);
        if (!existingSIP) {
            return NextResponse.json<ApiResponse>({
                code: 'sipNotFound',
                success: false,
                message: 'SIP not found',
            }, {status: 404});
        }

        const updateFields: any = {};

        if (mfFundId !== undefined && mfFundId !== existingSIP.mfFundId) {
            updateFields.mfFundId = mfFundId;
        }
        /*if (fundName !== undefined && fundName !== existingSIP.fundName) {
            updateFields.fundName = fundName;
        }
        if (fundCode !== undefined && fundCode !== existingSIP.fundCode) {
            updateFields.fundCode = fundCode;
        }
        if (schemeName !== undefined && schemeName !== existingSIP.schemeName) {
            updateFields.schemeName = schemeName;
        }
        if (folioNo !== undefined && folioNo !== existingSIP.folioNo) {
            updateFields.folioNo = folioNo;
        }*/
        if (amount !== undefined && amount !== existingSIP.amount) {
            updateFields.amount = amount;
        }
        if (dayOfMonth !== undefined && dayOfMonth !== existingSIP.dayOfMonth) {
            updateFields.dayOfMonth = dayOfMonth;
        }
        if (active !== undefined && active !== existingSIP.active) {
            updateFields.active = active;
        }
        if (startDate !== undefined && new Date(startDate).toISOString() !== existingSIP.startDate.toISOString()) {
            updateFields.startDate = new Date(startDate);
        }
        if (endDate !== undefined && (endDate ? new Date(endDate).toISOString() : null) !== (existingSIP.endDate ? existingSIP.endDate.toISOString() : null)) {
            updateFields.endDate = endDate ? new Date(endDate) : null;
        }
        if (notes !== undefined && notes !== existingSIP.notes) {
            updateFields.notes = notes;
        }
        /*if (category !== undefined && category !== existingSIP.category) {
            updateFields.category = category;
        }*/

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json<ApiResponse>({
                code: 'noChanges',
                success: true,
                message: 'No changes to update',
                data: existingSIP,
            }, {status: 200});
        }

        // Perform the update
        const updatedSIP = await MFSIPModel.findByIdAndUpdate(
            mfSipId,
            {$set: updateFields},
            {new: true},
        );

        if (!updatedSIP) {
            return NextResponse.json<ApiResponse>({
                code: 'updateFailed',
                success: false,
                message: 'Failed to update SIP',
            }, {status: 500});
        }

        return NextResponse.json(<ApiResponse>{
            code: 'updated',
            success: true,
            message: 'SIP updated successfully',
            data: {
                sip: updatedSIP,
            },
        }, {status: 200});
    } catch (error: any) {
        console.error('error in updating sip:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}

/** DELETE MFSIP */
export async function DELETE(request: Request) {
    console.log('deleteMFSIPById called');

    await dbConnect();

    try {
        const {userId} = await getUserDetailsFromToken();
        console.log('userId:', userId);

        const {searchParams} = new URL(request.url);
        const mfSipId = searchParams.get('mfSipId')?.toString();

        if (isStringInvalid(mfSipId) || !mongoose.Types.ObjectId.isValid(mfSipId ?? '')) {
            return NextResponse.json(<ApiResponse>{
                code: 'missingMfSipId',
                success: false,
                message: 'mfSipId is required',
            }, {status: 400});
        }

        const dbUser = await UserModel.findById(userId).select('mfSIPIds');
        if (!dbUser) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        const mfSipObjectId = new mongoose.Types.ObjectId(mfSipId);

        // Assuming dbUser is fetched earlier in the function
        if (!dbUser.mfSIPIds.some(id => id instanceof mongoose.Types.ObjectId && id.equals(mfSipObjectId))) {
            return NextResponse.json<ApiResponse>({
                code: 'sipNotFound',
                success: false,
                message: 'SIP not found or does not belong to user',
            }, {status: 404});
        }

        const deletedSIP = await MFSIPModel.findByIdAndDelete(mfSipId);
        console.log('deletedSip:', deletedSIP);

        if (!deletedSIP) {
            return NextResponse.json(<ApiResponse>{
                code: 'deleteFailed',
                success: false,
                message: 'Failed to delete SIP due to server error',
            }, {status: 500});
        }

        await UserModel.findByIdAndUpdate(userId, {
            $pull: {mfSIPIds: mfSipId},
        });

        return NextResponse.json(<ApiResponse>{
            code: 'deleted',
            success: true,
            message: 'SIP deleted successfully',
        }, {status: 201});
    } catch (error: any) {
        console.error('error in deleting sip:', error);
        return NextResponse.json<ApiResponse>({
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
            error,
        }, {status: 500});
    }
}
