'use client';

import React, {useCallback, useEffect, useRef, useState} from "react";
import {useForm} from 'react-hook-form';
import {EmailFormValues, emailSchema, NameFormValues, nameSchema, OtpFormValues, otpSchema} from "@/lib/formValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {APP_NAME} from "@/lib/config";
import {Mail} from "lucide-react";
import {doCredentialLogin, handleGoogleLogin} from "@/app/actions";
import axios from "axios";
import apis from "@/lib/apis";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import Image from "next/image";
import {FaArrowRight} from "react-icons/fa";
import {LoadingButton} from "@/components/loading-button";
import {cn} from "@/lib/utils";
import {Button} from "./ui/button";
import {MdAccountCircle} from "react-icons/md";
import {useRouter} from "next/navigation";
import routes from "@/lib/routes";

type AuthMethod = 'email' | 'otp' | 'name';

function LoginForm() {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [isLoading, setIsLoading] = useState(false);
    const firstInputRef = useRef<HTMLInputElement>(null);
    const [showCode, setShowCode] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
    });
    const {register: registerEmail, handleSubmit: handleSubmitEmailForm, formState: {errors: errorsEmail, isValid: isValidEmail}} = emailForm;

    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ['', '', '', '', '', ''],
        },
    });
    const {register: registerOtp, handleSubmit: handleSubmitOtpForm, formState: {errors: errorsOtp, isValid: isValidOtp}} = otpForm;

    const nameForm = useForm<NameFormValues>({
        resolver: zodResolver(nameSchema),
    });
    const {register: registerName, handleSubmit: handleSubmitNameForm, formState: {errors: errorsName, isValid: isValidName}} = nameForm;

    const email = emailForm.watch('email');
    const code = otpForm.watch('otp').join('');
    const name = nameForm.watch('name');

    const sendVerificationCode = async () => {
        setIsLoading(true);
        otpForm.reset({otp: ['', '', '', '', '', '']});
        const sendCodeResponse = await axios.post<ApiResponse>(apis.sendCodeApi(), {email});

        setIsLoading(false);
        if (sendCodeResponse.data.success) {
            setAuthMethod('otp');
            toast('Code sent to your email', {type: 'success'});
        } else {
            toast('Something went wrong', {type: 'error'});
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            // If pasting multiple digits
            const digits = value.split('').slice(0, 6);
            const newOtp = [...otpForm.getValues().otp];

            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = digit;
                }
            });

            otpForm.setValue('otp', newOtp);

            // Move focus to appropriate input
            const nextIndex = Math.min(index + digits.length, 5);
            if (nextIndex < 6) {
                document.getElementById(`otp-${nextIndex}`)?.focus();
            }
        } else {
            // Normal single digit input
            const newOtp = [...otpForm.getValues().otp];
            newOtp[index] = value;
            otpForm.setValue('otp', newOtp);

            // Move focus to next input
            if (value !== '' && index < 5) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            const currentOtp = otpForm.getValues().otp;
            if (currentOtp[index] === '' && index > 0) {
                document.getElementById(`otp-${index - 1}`)?.focus();
            }
        }
        // Handle left arrow
        else if (e.key === 'ArrowLeft' && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
        // Handle right arrow
        else if (e.key === 'ArrowRight' && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    }

    const onOtpSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await doCredentialLogin({email, code});
            if (result.response.success) {
                toast(result.response.message, {type: 'success'});

                const getUserResponse = await axios.get(apis.checkUserNameApi(email));
                if (getUserResponse.data.code === 'nameExists') {
                    router.replace(routes.homePath());
                } else if (getUserResponse.data.code === 'missingName') {
                    setAuthMethod('name');
                } else {
                    toast(getUserResponse.data.message, {type: 'error'});
                }
            } else {
                toast(result.response.message, {type: 'error'});
            }
        } catch (error) {
            console.log('error in verifying code:', error);
            toast('Something went wrong', {type: 'error'});
        } finally {
            setIsLoading(false);
        }
    }, [code, email, router]);

    const onNameSubmit = async () => {
        setIsLoading(true);
        const updateUserResponse = await axios.put<ApiResponse>(apis.updateUserApi(), {name, email});

        setIsLoading(false);
        if (updateUserResponse.data.success) {
            await fetch('/api/auth/session', {credentials: 'include'});
            console.log('User updated and session refreshed');
            router.replace(routes.homePath());
        } else {
            toast(updateUserResponse.data.message, {type: 'error'});
        }
    }

    /** autoFocus in 1st otp input * name input field */
    useEffect(() => {
        console.log('authMethod:', authMethod);
        if (authMethod === 'otp') {
            firstInputRef.current?.focus();
        } else if (authMethod === 'name') {
            nameInputRef.current?.focus();
        }

        if (authMethod !== 'otp') {
            otpForm.reset({otp: ['', '', '', '', '', '']});
        }
    }, [authMethod, otpForm]);

    useEffect(() => {
        if (authMethod === 'otp' && code.length === 6) {
            onOtpSubmit();
        }
    }, [authMethod, code, onOtpSubmit]);

    return (
        <div className={'flex items-center justify-center p-4 fixed inset-0 bg-primary-200 dark:bg-primary-900'}>
            <div
                className={'flex flex-col gap-4 w-full max-w-md bg-background rounded-xl overflow-hidden shadow-2xl shadow-primary-400 dark:shadow-black dark:drop-shadow-2xl drop-shadow-primary-400'}>
                {/** header */}
                <div className={'flex items-center justify-center mt-2 gap-1 sm:gap-2 px-3 select-none'}>
                    <Image src={'/assets/images/logo.svg'} alt={'logo'} height={32} width={32}/>
                    <h2 className={'mt-3 text-xl font-bold text-center text-text-900 tracking-wide'}>Welcome to {APP_NAME}</h2>
                </div>

                <hr className={'flex-1 border-slate-200 dark:border-slate-700'}/>

                {/** email form */}
                <Form {...emailForm}>
                    <form onSubmit={handleSubmitEmailForm(sendVerificationCode)} className={cn('flex flex-col px-6 gap-5', authMethod !== 'email' && 'hidden')}>
                        {/** email */}
                        <FormField control={emailForm.control} name={'email'}
                                   render={({field}) => (
                                       <FormItem>
                                           <FormLabel htmlFor={field.name} className={''}>Email address</FormLabel>
                                           <FormControl>
                                               <div className={'relative'}>
                                                   <div className={'absolute inset-y-0 left-0 pl-3 flex items-center'}>
                                                       <Mail className={'size-5 text-gray-400'}/>
                                                   </div>
                                                   <Input {...field} id={field.name} value={field.value ?? ''} type={'email'} autoFocus placeholder={'john.doe@gmail.com'} className={'pl-10'}
                                                          onChange={(e) => field.onChange(e)}/>
                                               </div>
                                           </FormControl>
                                           <FormMessage/>
                                       </FormItem>
                                   )}
                        />

                        <LoadingButton variant={'default'} loading={isLoading} type={'submit'} className={'flex gap-2 hover:gap-4 transition-all duration-300'}>
                            Send Verification Code
                            <FaArrowRight/>
                        </LoadingButton>
                    </form>
                </Form>

                {/** otp form */}
                <Form {...otpForm}>
                    <form onSubmit={handleSubmitOtpForm(onOtpSubmit)} className={cn('flex flex-col px-6 gap-5', authMethod !== 'otp' && 'hidden')}>
                        <FormField control={otpForm.control} name={'otp'}
                                   render={({field}) => (
                                       <FormItem>
                                           <div className={'flex justify-between mb-2 text-text text-sm'}>
                                               <FormLabel>Verification code</FormLabel>
                                               <FormLabel>Sent to {email}</FormLabel>
                                           </div>

                                           <FormControl>
                                               <div className={'flex gap-2 justify-between mb-2'}>
                                                   {Array.from({length: 6}).map((_, index) => (
                                                       <Input
                                                           key={index}
                                                           id={`otp-${index}`}
                                                           ref={index === 0 ? firstInputRef : null}
                                                           type={showCode ? 'text' : 'password'}
                                                           maxLength={6}
                                                           value={field.value[index]}
                                                           placeholder={!showCode ? '•' : (index + 1).toString()}
                                                           onChange={(e) => handleOtpChange(index, e.target.value)}
                                                           onKeyDown={(e) => handleKeyDown(index, e)}
                                                           className={'text-center text-xl font-bold p-2'}
                                                       />
                                                   ))}
                                               </div>
                                           </FormControl>
                                           {errorsOtp.otp?.length && (
                                               <p className={'mt-1 text-sm font-medium text-accent'}>{errorsOtp.otp[0]?.message}</p>
                                           )}

                                           <div className={'flex justify-between gap-4 mt-2'}>
                                               <Button type={'button'} variant={'link'} disabled={isLoading} className={'p-0 h-auto'} onClick={sendVerificationCode}>
                                                   Resend code
                                               </Button>
                                               <Button type={'button'} variant={'link'} className={'p-0 h-auto hover:no-underline'}
                                                       onClick={() => setShowCode(!showCode)}>
                                                   {showCode ? 'Hide' : 'Show'} Code
                                               </Button>
                                           </div>
                                       </FormItem>
                                   )}
                        />

                        <LoadingButton variant={'default'} loading={isLoading} type={'submit'} className={'flex gap-2 hover:gap-4 transition-all duration-300'}>
                            Verify
                            <FaArrowRight/>
                        </LoadingButton>

                        <Button type={'button'} variant={'link'} onClick={() => setAuthMethod('email')} className={'self-center'}>Use different email</Button>
                    </form>
                </Form>

                {/** name form */}
                <Form {...nameForm}>
                    <form onSubmit={handleSubmitNameForm(onNameSubmit)} className={cn('flex flex-col px-6 gap-5', authMethod !== 'name' && 'hidden')}>
                        {/** name */}
                        <FormField control={nameForm.control} name={'name'}
                                   render={({field}) => (
                                       <FormItem>
                                           <FormLabel htmlFor={field.name} className={''}>Name</FormLabel>
                                           <FormControl>
                                               <div className={'relative'}>
                                                   <div className={'absolute inset-y-0 left-0 pl-3 flex items-center'}>
                                                       <MdAccountCircle className={'size-5 text-gray-400'}/>
                                                   </div>
                                                   <Input {...field} id={field.name} ref={nameInputRef} value={field.value ?? ''} autoFocus placeholder={'John Doe'}
                                                          className={'pl-10'} onChange={(e) => field.onChange(e)}/>
                                               </div>
                                           </FormControl>
                                           <FormMessage/>
                                       </FormItem>
                                   )}
                        />

                        <LoadingButton variant={'default'} loading={isLoading} type={'submit'} className={'flex gap-2 hover:gap-4 transition-all duration-300'}>
                            Let's get started
                            <FaArrowRight/>
                        </LoadingButton>

                        <Button variant={'link'} type={'button'} className={'self-end'} onClick={() => router.replace(routes.homePath())}>Skip</Button>
                    </form>
                </Form>

                {/** or continue with */}
                <div className={'flex items-center gap-4 px-6'}>
                    <hr className={'flex-1 border-text'}/>
                    <p className={'text-text-800'}>Or continue with</p>
                    <hr className={'flex-1 border-text'}/>
                </div>

                {/** oauths */}
                <div className={'grid grid-cols-2 gap-3 px-6 pb-6'}>
                    <button type={'button'}
                            className={'w-full inline-flex justify-center items-center py-2 px-4 gap-2 border border-primary rounded-md shadow-sm shadow-primary-200 bg-white text-sm font-medium text-slate-700 cursor-pointer'}
                            onClick={handleGoogleLogin}>
                        <Image src={'/assets/images/google.svg'} alt={'google'} height={20} width={20}/>
                        Google
                    </button>

                    <button type={'button'}
                            className={'w-full inline-flex justify-center items-center py-2 px-4 gap-2 border border-primary rounded-md shadow-sm shadow-primary-200 bg-white text-sm font-medium text-slate-700 cursor-pointer'}>
                        <Image src={'/assets/images/apple.svg'} alt={'google'} height={20} width={20}/>
                        Apple
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
