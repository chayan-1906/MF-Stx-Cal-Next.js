import {z} from "zod";

export const loginSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({message: 'Invalid email address'}),
    code: z.string().min(6, {message: 'Code must be of 6-digit'}).max(6, {message: 'Code must be of 6-digit'}),
});

export const emailSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email address'}),
});
type EmailFormValues = z.infer<typeof emailSchema>;

export const otpSchema = z.object({
    otp: z.array(z.string().length(1, {message: 'Verification code required'})).length(6),
});
type OtpFormValues = z.infer<typeof otpSchema>;

export const nameSchema = z.object({
    name: z.string().trim().min(2, {message: 'Name must be at least 2 characters'}).optional().or(z.literal('')),
});
type NameFormValues = z.infer<typeof nameSchema>;

export type {EmailFormValues, OtpFormValues, NameFormValues}
