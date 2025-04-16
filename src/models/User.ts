import mongoose, {Document, Schema} from 'mongoose';

export interface User extends Document {
    name?: string;
    email: string;
    password: string;
    image?: string;
    token: string;
    tokenExpiry: Date;
    isVerified: boolean;
    createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email Address is required'],
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    image: {type: String},
    token: {
        type: String,
        required: [true, 'Token is required'],
    },
    tokenExpiry: {
        type: Date,
        required: [true, 'Token Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema));

export default UserModel;
