import mongoose, {Document, Schema} from 'mongoose';

export interface User extends Document {
    name?: string;
    email: string;
    password?: string;  // for credential-based auth
    image?: string; // for oauth
    token?: string;  // for credential-based auth
    tokenExpiry?: Date;  // for credential-based auth
    isVerified: boolean;
    googleId?: string; // for oauth
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
        required: false,
    },
    image: {type: String},
    token: {
        type: String,
        required: false,
    },
    tokenExpiry: {
        type: Date,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema));

export default UserModel;
