import {ApiResponse} from "@/types/ApiResponse";
import {createUserInDb, dbConnect} from "@/lib/db";
import UserModel from "@/models/User";

/** SIGN UP */
export async function POST(request: Request) {
    await dbConnect();

    try {
        const {name, email, password} = await request.json();

        const user = new UserModel({name, email, password});
        const createUserResponse: ApiResponse = await createUserInDb(user, {requireVerification: true});

        return Response.json(<ApiResponse>{
            code: createUserResponse.code,
            success: createUserResponse.success,
            message: createUserResponse.message,
        }, {status: createUserResponse.success ? 201 : 400});
    } catch (error) {
        console.error('Error in registering user', error);
        return Response.json(<ApiResponse>{code: 'unknownError', success: false, message: 'Error registering user', error}, {status: 500});
    }
}
