'use server';

import routes from "@/lib/routes";
import {AuthError} from "next-auth";
import {signIn, signOut} from "@/auth";
import {LoginSchema} from "@/lib/formValidationSchemas";
import {redirect} from "next/navigation";

// const Providers = {Credentials: 'credentials', Google: 'google', GitHub: 'apple', Facebook: 'facebook'} as const;
// type AuthProvider = (typeof Providers)[keyof typeof Providers];
// const validProviders = new Set<AuthProvider>(Object.values(Providers));
const validProviders = new Set<string>(["credentials", "google", "apple"]);

export async function doCredentialLogin(loginSchema: LoginSchema): Promise<{ message?: string }> {
    try {
        await signIn('credentials', {
            name: loginSchema.name || 'default name value, todo delete',
            email: loginSchema.email,
            code: loginSchema.code,
            redirectTo: routes.homePath(),
        });
        return {message: 'Signed in successfully'};
    } catch (error) {
        if (error instanceof AuthError) {
            console.log('error type:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return {message: 'Invalid credentials'};
                case 'AccessDenied':
                    return {message: 'Access denied'};
                case 'Verification':
                    return {message: 'Verification failed'};
                case 'CallbackRouteError':
                    if (error.cause?.err?.message === 'missingEmailCode') {
                        return {message: 'Email & code must be valid'};
                    } else if (error.cause?.err?.message === 'missingName') {
                        return {message: 'Name is required'};
                    } else if (error.cause?.err?.message === 'expiredCode') {
                        return {message: 'Code has been expired'};
                    } else if (error.cause?.err?.message === 'invalidCode') {
                        return {message: 'Invalid code'};
                    }
                    return {message: 'Wrong callback route'};
                default:
                    return {message: 'Something went wrong'};
            }
        }
        throw error;
    }
}

export async function doLogout() {
    try {
        await signOut({redirect: false}); // Sign out without automatic redirect
        redirect(routes.loginPath()); // Manually redirect to login page
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Failed to log out');
    }
}
