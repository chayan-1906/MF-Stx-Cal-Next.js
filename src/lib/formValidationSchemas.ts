import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long!'}).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/, {
            message: 'Password must include uppercase, lowercase, number, and special character (@$!%*?&#)!'
        },
    ),
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
