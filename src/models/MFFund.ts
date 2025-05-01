import mongoose, {Document, Schema} from "mongoose";
import crypto from 'crypto';

export interface MFFund extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    mfFundId?: string;
    externalId: string;
    fundName: string;
    fundCode?: string;
    schemeName: string;
    folioNo: string;
    notes?: string;
    category: 'equity' | 'debt' | 'liquid';
}

const MFFundSchema: Schema<MFFund> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is required'],
        ref: 'User',
    },
    mfFundId: {
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
        validate: {
            validator: (value: string) => /^[A-Za-z0-9/-]{8,20}$/.test(value),
            message: 'Invalid folio number format',
        },
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
}, {timestamps: true});

MFFundSchema.index({fundName: 1, schemeName: 1}, {unique: true});

MFFundSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.mfFundId = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const MFFundModel = mongoose.models.MFFund || mongoose.model<MFFund>('MFFund', MFFundSchema);
console.log('MFFundModel registered');

export default MFFundModel;
