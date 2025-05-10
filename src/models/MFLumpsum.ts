import mongoose, {Document, Schema} from "mongoose";
import crypto from 'crypto';

export interface MFLumpsum extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    mfFundId: mongoose.Schema.Types.ObjectId;
    mfLumpsumId?: string;
    externalId: string;
    fundName: string;
    fundCode?: string;
    schemeName: string;
    folioNo: string;
    amount: number;
    date: Date;
    notes?: string;
    category: 'equity' | 'debt' | 'liquid';
}

const MFLumpsumSchema: Schema<MFLumpsum> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is required'],
        ref: 'User',
    },
    mfFundId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Fund Id is required'],
        ref: 'MFFund',
    },
    externalId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomUUID(),
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1, 'Amount must be at least ₹1'],
    },
    date: {
        type: Date,
        required: [true, 'Start Date is required'],
    },
    notes: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },
});

MFLumpsumSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.mfLumpsumId = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const MFLumpsumModel = mongoose.models.MFLumpsum || mongoose.model<MFLumpsum>('MFLumpsum', MFLumpsumSchema);

export default MFLumpsumModel;
