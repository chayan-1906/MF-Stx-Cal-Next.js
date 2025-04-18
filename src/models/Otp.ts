import mongoose, {Document} from "mongoose";

export interface Otp extends Document {
    email: string;
    code: string;
    codeExpiry: Date;
    createdAt: Date;
}

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    hashedOtp: {
        type: String,
        required: true,
    },
    codeExpiry: {
        type: Date,
        required: true,
        index: {expires: 0}, // TTL index to auto-delete after expiresAt
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const OtpModel = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export default OtpModel;
