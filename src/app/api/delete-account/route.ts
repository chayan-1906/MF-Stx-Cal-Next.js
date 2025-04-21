import {dbConnect} from "@/lib/db";
import {ApiResponse} from "@/types/ApiResponse";
import {NextResponse} from "next/server";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import UserModel from "@/models/User";
import MFSIPModel from "@/models/MFSIP";

/** DELETE ACCOUNT */
export async function DELETE(request: Request) {
    await dbConnect();

    try {
        // Get the JWT token
        // const token = await getToken({req: request, secret: NEXTAUTH_SECRET});
        const {userId} = await getUserDetailsFromToken();
        console.log('userId:', userId);

        if (!userId) {
            return NextResponse.json<ApiResponse>({
                code: 'unauthorized',
                success: false,
                message: 'User Id is required',
            }, {status: 401});
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId);
        console.log('deletedUser:', deletedUser);

        if (!deletedUser) {
            return NextResponse.json<ApiResponse>({
                code: 'userNotFound',
                success: false,
                message: 'User not found',
            }, {status: 404});
        }

        // delete user's mfsips
        await MFSIPModel.deleteMany({_id: {$in: deletedUser.mfSIPIds}});

        // TODO: delete user's mflumpsums
        // await MFLumpsumModel.deleteMany({_id: {$in: deletedUser.mfLumpsumIds}});

        // TODO: delete user's stxSips
        // await StxSIPModel.deleteMany({_id: {$in: deletedUser.stxSIPIds}});

        // TODO: delete user's stxLumpsums
        // await StxLumpsumModel.deleteMany({_id: {$in: deletedUser.stxLumpsumIds}});

        return Response.json(<ApiResponse>{
            code: 'deleted',
            success: true,
            message: 'Account has been deleted',
        }, {status: 200});
    } catch (error: any) {
        console.error('Error in updating user', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error in updating user', error}, {status: 500});
    }
}
