import {z} from "zod";

export const loginSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({message: 'Invalid email address'}),
    code: z.string().min(6, {message: 'Code must be of 6-digit'}).max(6, {message: 'Code must be of 6-digit'}),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
    name: z.string().min(1, {message: 'Name is required!'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long!'}).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
            message: 'Password must include uppercase, lowercase, number, and special character (@$!%*?&#)!'
        },
    ),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export type {LoginSchema, SignUpSchema}
