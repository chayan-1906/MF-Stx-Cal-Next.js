'use server';

import {AuthError} from "next-auth";
import {signIn, signOut} from "@/auth";
import {ApiResponse} from "@/types/ApiResponse";

export async function doCredentialLogin({email, code}: { email: string; code: string }): Promise<{ response: ApiResponse }> {
    try {
        await signIn('credentials', {
            email,
            code,
            redirect: false,
            // redirectTo: BASE_URL + routes.homePath(),
            // callbackUrl: routes.homePath(),
        });
        return {
            response: {
                code: 'loggedIn',
                success: true,
                message: 'Successfully logged in',
            },
        };
    } catch (error) {
        if (error instanceof AuthError) {
            console.log('error type:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        response: {
                            code: 'invalidCred',
                            success: false,
                            message: 'Invalid credentials',
                        }
                    };
                case 'AccessDenied':
                    return {
                        response: {
                            code: 'accessDenied',
                            success: false,
                            message: 'Access denied',
                        }
                    };
                case 'Verification':
                    return {
                        response: {
                            code: 'verificationFailed',
                            success: false,
                            message: 'Verification failed',
                        }
                    };
                case 'CallbackRouteError':
                    if (error.cause?.err?.message === 'missingEmailCode') {
                        return {
                            response: {
                                code: 'missingEmailCode',
                                success: false,
                                message: 'Email & code must be valid',
                            }
                        };
                    } else if (error.cause?.err?.message === 'expiredCode') {
                        return {
                            response: {
                                code: 'expiredCode',
                                success: false,
                                message: 'Code has been expired',
                            }
                        };
                    } else if (error.cause?.err?.message === 'invalidCode') {
                        return {
                            response: {
                                code: 'invalidCode',
                                success: false,
                                message: 'Invalid code',
                            }
                        };
                    }
                    return {
                        response: {
                            code: 'wrongCallbackRoute',
                            success: false,
                            message: 'Wrong callback route',
                        }
                    };
                default:
                    return {
                        response: {
                            code: 'unknownError',
                            success: false,
                            message: 'Something went wrong',
                        }
                    };
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
