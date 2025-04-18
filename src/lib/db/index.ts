import {ConnectionObject} from "@/types/DB";
import mongoose from "mongoose";
import {MONGODB_URI} from "@/lib/config";

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
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
