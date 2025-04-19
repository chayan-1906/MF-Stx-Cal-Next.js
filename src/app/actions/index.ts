'use server';

import routes from "@/lib/routes";
import {AuthError} from "next-auth";
import {auth, signIn, signOut} from "@/auth";
import {LoginSchema} from "@/lib/formValidationSchemas";
import {redirect} from "next/navigation";

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

export async function handleGoogleLogin() {
    await signIn('google', {redirectTo: "/"});
}

export async function doLogout() {
    await signOut();
}

export async function getSession() {
    const session = await auth();
    if (!session || !session.user) {
        redirect(routes.loginPath());
    }
    return session;
}
