import mongoose, {Document, Schema} from "mongoose";
import crypto from 'crypto';

export interface MFSIP extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    externalId: string;
    fundName: string;
    fundCode?: string;
    schemeName: string;
    folioNo: string;
    amount: number;
    dayOfMonth: number;
    active: boolean;
    startDate: Date;
    endDate?: Date;
    notes?: string;
    category: 'equity' | 'debt' | 'liquid';
}

const MFSIPSchema: Schema<MFSIP> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is required'],
        ref: 'User',
    },
    externalId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomBytes(16).toString('hex'),
    },
    fundName: {
        type: String,
        required: [true, 'Fund name is required'],
        trim: true,
    },
    fundCode: {
        type: String,
        required: false,
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
    dayOfMonth: {
        type: Number,
        required: [true, 'Day of month is required'],
        min: [1, 'Day must be at least 1'],
        max: [31, 'Day cannot exceed 31'],
    },
    active: {
        type: Boolean,
        required: [true, 'Active is required'],
        default: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required'],
    },
    endDate: {
        type: Date,
        required: false,
        default: null,
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

const MFSIPModel = mongoose.models.MFSIP || mongoose.model<MFSIP>('MFSIP', MFSIPSchema);

export default MFSIPModel;
