import mongoose, {Document, Schema} from "mongoose";
import crypto from 'crypto';

export interface MFLumpsum extends Document {
    userId: mongoose.Schema.Types.ObjectId;
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
    mfLumpsumId: {
        type: String,
        required: false,
        default: null,
    },
    externalId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomUUID(),
    },
    fundName: {
        type: String,
        required: [true, 'Fund name is required'],
        trim: true,
    },
    fundCode: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },
    schemeName: {
        type: String,
        required: [true, 'Scheme name is required'],
        trim: true,
    },
    folioNo: {
        type: String,
        required: [true, 'Folio no is required'],
        trim: true,
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
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['equity', 'debt', 'liquid'],
    },
});

MFLumpsumSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.mfSipId = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const MFLumpsumModel = mongoose.models.MFSIP || mongoose.model<MFLumpsum>('MFSIP', MFLumpsumSchema);

export default MFLumpsumModel;
