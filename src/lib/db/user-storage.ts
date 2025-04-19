import UserModel from "@/models/User";

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

export {getUserFromDb}
