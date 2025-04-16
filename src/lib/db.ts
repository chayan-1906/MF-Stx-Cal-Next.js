import UserModel from "@/models/User";
import {ConnectionObject} from "@/types/DB";
import mongoose from "mongoose";
import {MONGODB_URI} from "@/lib/config";

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to database 👍👍👍');
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('DB connected successfully ✅✅✅');
    } catch (error: any) {
        console.error('Database connection failed ‼️‼️‼️', error);
        process.exit(1);
    }
}

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

    if (!user.isVerified) {
        throw new Error('Please verify your account before login');
    }

    return user;
}

export {dbConnect, getUserFromDb}
