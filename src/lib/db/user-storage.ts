import {dbConnect} from "@/lib/db/index";
import {ApiResponse} from "@/types/ApiResponse";
import UserModel from "@/models/User";

async function getUserFromDb(email: string): Promise<ApiResponse> {
    await dbConnect();

    try {
        const user = await UserModel.findOne({email: 'hello'});
        if (!user) {
            return {
                code: 'userNotFound',
                success: false,
                message: 'No user found with this email',
            };
        }

        return {
            code: 'userFound',
            success: true,
            message: 'User found with this email',
            data: {
                user,
            },
        };
    } catch (error: any) {
        console.error('error in getUserFromDb:', error);
        return {
            code: 'unknownError',
            success: false,
            message: 'Something went wrong',
        };
    }
}

export {getUserFromDb}
