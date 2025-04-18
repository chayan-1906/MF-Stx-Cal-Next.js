import UserModel, {User} from "@/models/User";
import {TOKEN_EXPIRY} from "@/lib/config";
import {ApiResponse} from "@/types/ApiResponse";
import {generateRandomCode} from "@/lib/utils";
import {dbConnect} from "@/lib/db/index";

async function getUserFromDb(credentials: any) {
    const user = await UserModel.findOne({
        $or: [
            {email: credentials.identifier},
            {username: credentials.identifier},
        ],
    });
    if (!user) {
        throw new Error('No user found with this email');
    }

    return user;
}

async function createUserInDb(user: Partial<User>, {requireVerification = true}: { requireVerification?: boolean }) {
    await dbConnect();

    try {
        const code = generateRandomCode();
        const codeExpiry = new Date(Date.now() + Number(TOKEN_EXPIRY ?? 0));

        return {
            success: true,
            code: 'registered',
            message: requireVerification
                ? 'User registered successfully. Please verify your email!'
                : 'User registered successfully!',
            data: {
                user: newUser,
            },
        } as ApiResponse;
    } catch (error: any) {
        console.error('Error creating user:', error);
        return {
            code: 'unknownError',
            success: false,
            message: `Error creating user: ${error.message}`,
        } as ApiResponse;
    }
}

export {getUserFromDb, createUserInDb}
