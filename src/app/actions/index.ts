'use server';

import routes from "@/lib/routes";
import {dbConnect} from "@/lib/db";
import UserModel from "@/models/User";
import OtpModel from "@/models/Otp";
import bcrypt from "bcryptjs";
import axios from "axios";
import {ApiResponse} from "@/types/ApiResponse";
import apis from "@/lib/apis";
import {BASE_URL} from "@/lib/config";
import {signIn} from "next-auth/react";
import {toast} from "react-toastify";

// const Providers = {Credentials: 'credentials', Google: 'google', GitHub: 'apple', Facebook: 'facebook'} as const;
// type AuthProvider = (typeof Providers)[keyof typeof Providers];
// const validProviders = new Set<AuthProvider>(Object.values(Providers));
const validProviders = new Set<string>(["credentials", "google", "apple"]);

export async function doSocialLogin(formData: FormData): Promise<{ error?: string }> {
    const action = formData.get("action");
    console.log("action:", action);
    if (typeof action === "string" && validProviders.has(action)) {
        if (action === "credentials") {
            try {
                await signIn("credentials", {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    code: formData.get("code"),
                    redirect: false,
                }).then((response) => {
                    if (response?.error) {
                        console.error('error in customHandleSubmit:', response.error);
                        const parsedError = JSON.parse(JSON.parse(response.error).message);
                        console.log(parsedError);
                        return parsedError;
                    } else {
                        return {
                            code: 'registered',
                            success: true,
                            message: 'User registered successfully',
                            data: {
                                user: response,
                            },
                        } as ApiResponse;
                    }
                });

                /*const signInResult = await signIn("credentials", {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    code: formData.get("code"),
                    redirect: false,
                });
                console.log("signInResult (full):", JSON.stringify(signInResult, null, 2));
                console.log('type of signInResult:', typeof signInResult);

                if (typeof signInResult === 'string') {
                    console.log("signIn returned URL:", signInResult);
                    const email = formData.get("email") as string;
                    const code = formData.get("code") as string;
                    const name = formData.get("name") as string;

                    if (!email || !code) {
                        return {
                            error: JSON.stringify({
                                code: 'missingCredentials',
                                success: false,
                                message: "Email and code are required",
                            }),
                        };
                    }

                    await dbConnect();
                    const user = await UserModel.findOne({email});
                    if (!user && !name) {
                        return {
                            error: JSON.stringify({
                                code: "missingName",
                                success: false,
                                message: "Name is required",
                            }),
                        };
                    }

                    const storedOtp = await OtpModel.findOne({email});
                    if (!storedOtp) {
                        return {
                            error: JSON.stringify({
                                code: "codeNotFound",
                                success: false,
                                message: "No code found",
                            }),
                        };
                    }

                    if (new Date() > new Date(storedOtp.codeExpiry)) {
                        await OtpModel.deleteOne({email});
                        return {
                            error: JSON.stringify({
                                code: "expiredCode",
                                success: false,
                                message: "Code has been expired",
                            }),
                        };
                    }

                    const isValid = await bcrypt.compare(code, storedOtp.hashedOtp);
                    if (!isValid) {
                        return {
                            error: JSON.stringify({
                                code: "invalidCode",
                                success: false,
                                message: "Invalid verification code",
                            }),
                        };
                    }

                    return {
                        error: JSON.stringify({
                            code: "unknownError",
                            success: false,
                            message: "Something went wrong",
                        }),
                    };
                }

                if (signInResult?.ok) {
                    console.log("signIn success:", signInResult);
                    return {
                        error: JSON.stringify({
                            code: "authenticated",
                            success: true,
                            message: "User authenticated",
                        }),
                    };
                } else if (signInResult?.error) {
                    console.log("signIn error:", signInResult.error);
                    return {error: signInResult.error};
                } else {
                    console.log("signIn unexpected response:", signInResult);
                    return {
                        error: JSON.stringify({
                            code: "unknownError",
                            success: false,
                            message: "Something went wrong",
                        }),
                    };
                }*/
            } catch (error: any) {
                console.error("signIn error:", error);
                return {
                    error: JSON.stringify({
                        code: "unknownError",
                        success: false,
                        message: "Something went wrong",
                    }),
                };
            }
        } else {
            await signIn(action, {redirectTo: "/dashboard"});
            return {};
        }
    } else {
        console.error("Invalid or missing action:", action);
        return {
            error: JSON.stringify({
                code: "invalidProvider",
                success: false,
                message: "Invalid authentication provider",
            }),
        };
    }
}

export async function doLogout() {
    await signOut({redirectTo: routes.loginPath()});
}
