import {z} from "zod";

/** AUTH */
export const loginSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({message: 'Invalid email address'}),
    code: z.string().min(6, {message: 'Code must be of 6-digit'}).max(6, {message: 'Code must be of 6-digit'}),
});

export const emailSchema = z.object({
    email: z.string().email({message: 'Valid email address required'}),
});
type EmailFormValues = z.infer<typeof emailSchema>;

export const otpSchema = z.object({
    otp: z.array(z.string().length(1, {message: 'Verification code required'})).length(6),
});
type OtpFormValues = z.infer<typeof otpSchema>;

export const nameSchema = z.object({
    name: z.string().trim().min(2, {message: 'Name must contain at least 2 characters'}).optional().or(z.literal('')),
});
type NameFormValues = z.infer<typeof nameSchema>;

/** MF FUND */
export const mfFundSchema = z.object({
    userId: z.string().min(1, {message: 'Invalid User ID'}),
    mfFundId: z.string().optional(),
    fundName: z.string().trim().min(2, {message: 'Fund Name must be at least 2 characters'}),
    fundCode: z.string().trim().nullable().optional(),
    schemeName: z.string().trim().min(1, {message: 'Scheme name is required'}),
    folioNo: z.string().trim().min(1, {message: 'Folio no is required'}),
    notes: z.string().trim().nullable().optional(),
    category: z.enum(['equity', 'debt', 'liquid'], {message: 'Category must be valid'}).nullable(),
});
type MFFundFormValues = z.infer<typeof mfFundSchema>;

/** MF SIP */
export const mfSipSchema = z.object({
    userId: z.string().min(1, {message: 'Invalid User ID'}),
    mfSipId: z.string().optional(),
    mfFundId: z.string().min(1, {message: 'Invalid Fund ID'}),
    fundName: z.string().trim().min(2, {message: 'Fund Name must be at least 2 characters'}),
    fundCode: z.string().trim().nullable().optional(),
    schemeName: z.string().trim().min(1, {message: 'Scheme name is required'}),
    folioNo: z.string().trim().min(1, {message: 'Folio no is required'}),
    amount: z.number().min(1, {message: 'Amount must be at least ₹1'}),
    dayOfMonth: z.number().min(1, {message: 'Day must be at least 1'}).max(31, {message: 'Day cannot exceed 31'}),
    active: z.boolean().default(true).optional(),
    startDate: z.date(),
    endDate: z.date().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    category: z.enum(['equity', 'debt', 'liquid'], {message: 'Category must be valid'}).nullable(),
}).refine((data) => !data.endDate || (data.endDate && data.endDate > data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
});
type MFSIPFormValues = z.infer<typeof mfSipSchema>;

/** MF Lumpsum */
export const mfLumpsumSchema = z.object({
    userId: z.string().min(1, {message: 'Invalid User ID'}),
    mfLumpsumId: z.string().optional(),
    mfFundId: z.string().min(1, {message: 'Invalid Fund ID'}),
    fundName: z.string().trim().min(2, {message: 'Fund Name must be at least 2 characters'}),
    fundCode: z.string().trim().nullable().optional(),
    schemeName: z.string().trim().min(1, {message: 'Scheme name is required'}),
    folioNo: z.string().trim().min(1, {message: 'Folio no is required'}),
    amount: z.number().min(1, {message: 'Amount must be at least ₹1'}),
    date: z.date(),
    notes: z.string().trim().nullable().optional(),
    category: z.enum(['equity', 'debt', 'liquid'], {message: 'Category must be valid'}).nullable(),
}).refine((data) => !data.date || data.date <= new Date(), {
    message: 'Date must not be in the future',
    path: ['date'],
});
type MFLumpsumFormValues = z.infer<typeof mfLumpsumSchema>;

export type {EmailFormValues, OtpFormValues, NameFormValues, MFFundFormValues, MFSIPFormValues, MFLumpsumFormValues}
