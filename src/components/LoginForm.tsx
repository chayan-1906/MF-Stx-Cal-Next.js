'use client';

import React, {useEffect, useState} from "react";
import {useForm} from 'react-hook-form';
import {LoginSchema, loginSchema} from "@/lib/formValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {APP_NAME} from "@/lib/config";
import {cn} from "@/lib/utils";
import {Eye, EyeOff, Lock, Mail} from "lucide-react";
import {doSocialLogin} from "@/app/actions";

function LoginForm() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });
    const {register, handleSubmit, formState: {errors}} = form;
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const password = form.watch('password');

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return 'bg-gray-200';
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-yellow-500';
            case 3:
                return 'bg-blue-500';
            case 4:
                return 'bg-green-500';
            default:
                return 'bg-gray-200';
        }
    };

    /*const onSubmit = async (data: LoginSchema) => {
        try {
            const response = await axios.post<ApiResponse>(apis.loginApi(), {
                username: param.username,
                code: data.code,
            });
            toast(response.data.message, {type: 'success'});
            router.replace(routes.loginPath());
        } catch (error: any) {
            console.error('Error in sign up', error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? 'Error registering';
            toast(errorMessage, {type: 'error'});
        }
    }*/

    // calculate password strength
    useEffect(() => {
        const calculateStrength = (value: string) => {
            let score = 0;
            if (!value) return 0;

            // Base criteria (max 3 points)
            if (value.length > 7) score += 1; // Length > 7
            if (/[A-Z]/.test(value)) score += 1; // Uppercase
            if (/[a-z]/.test(value)) score += 1; // Lowercase
            if (/[0-9]/.test(value)) score += 1; // Numbers

            // Cap base score at 3
            score = Math.min(score, 3);

            // Only allow score of 4 if special character is present and base score is 3
            const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
            if (hasSpecialChar && score === 3) {
                score = 4;
            }

            return score;
        }

        setPasswordStrength(calculateStrength(password));
    }, [password]);

    return (
        <div className={'flex items-center justify-center p-4 fixed inset-0 bg-primary-200 dark:bg-primary-900'}>
            <div
                className={'flex flex-col gap-4 w-full max-w-md bg-background rounded-xl overflow-hidden shadow-2xl shadow-primary-400 dark:shadow-black dark:drop-shadow-2xl drop-shadow-primary-400'}>
                {/** header */}
                <div className={'flex flex-col gap-1 py-2'}>
                    <h2 className={'px-6 my-2 text-xl font-bold text-center text-text tracking-wide'}>Welcome to {APP_NAME}</h2>

                    <hr className={'flex-1 border-slate-200 dark:border-slate-700'}/>

                    {/** tabs */}
                    <div className={'w-full max-w-md mx-auto'}>
                        <div className={'relative flex py-3 border-b border-slate-200 dark:border-slate-700'}>
                            <button className={cn('relative flex-1 font-medium text-sm cursor-pointer z-10 transition-colors duration-300', activeTab === 'login' ? 'text-primary' : 'text-text')}
                                    onClick={() => setActiveTab('login')}>
                                Sign In
                            </button>
                            <button
                                className={cn('relative flex-1 font-medium text-sm cursor-pointer z-10 transition-colors duration-300', activeTab === 'register' ? 'text-primary' : 'text-text')}
                                onClick={() => setActiveTab('register')}>
                                Create Account
                            </button>
                            <div className={cn('absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-in-out', activeTab === 'login' ? 'left-0 w-1/2' : 'left-1/2 w-1/2')}/>
                        </div>
                    </div>
                </div>

                {/** form */}
                {activeTab === 'login' ? (
                    <Form {...form}>
                        {/*<form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col px-6 gap-5'}>*/}
                        <form action={doSocialLogin} className={'flex flex-col px-6 gap-5'}>
                            {/** email */}
                            <FormField control={form.control} name={'email'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Email address</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Mail className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={'email'} autoFocus placeholder={'john.doe@gmail.com'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                            />

                            {/** password */}
                            <FormField control={form.control} name={'password'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Password</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Lock className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={showPassword ? 'text' : 'password'} autoFocus placeholder={'••••••••'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                       <div className={'absolute inset-y-0 right-0 pr-3 flex items-center'}>
                                                           <button type={'button'} onClick={() => setShowPassword(!showPassword)} className={'text-gray-400 hover:text-gray-500 focus:outline-none'}>
                                                               {showPassword ? (
                                                                   <EyeOff className={'size-5'}/>
                                                               ) : (
                                                                   <Eye className={'size-5'}/>
                                                               )}
                                                           </button>
                                                       </div>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                            />

                            <Button type={'submit'} name={'action'} value={'credentials'}>Sign In</Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...form}>
                        {/*<form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col px-6 gap-5'}>*/}
                        <form action={doSocialLogin} className={'flex flex-col px-6 gap-5'}>
                            {/** email */}
                            <FormField control={form.control} name={'email'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Email address</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Mail className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={'email'} autoFocus placeholder={'john.doe@gmail.com'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                            />

                            {/** email */}
                            <FormField control={form.control} name={'email'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Email address</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Mail className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={'email'} autoFocus placeholder={'john.doe@gmail.com'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                            />

                            {/** password */}
                            <FormField control={form.control} name={'password'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Password</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Lock className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={showPassword ? 'text' : 'password'} autoFocus placeholder={'••••••••'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                       <div className={'absolute inset-y-0 right-0 pr-3 flex items-center'}>
                                                           <button type={'button'} onClick={() => setShowPassword(!showPassword)} className={'text-gray-400 hover:text-gray-500 focus:outline-none'}>
                                                               {showPassword ? (
                                                                   <EyeOff className={'size-5'}/>
                                                               ) : (
                                                                   <Eye className={'size-5'}/>
                                                               )}
                                                           </button>
                                                       </div>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                            />
                            <div>
                                <div className={'w-full h-1 bg-gray-200 rounded-full overflow-hidden'}>
                                    <div className={`h-full ${getPasswordStrengthColor()}`} style={{width: `${passwordStrength * 25}%`}}/>
                                </div>
                                <p className={'text-xs text-gray-500 mt-1'}>
                                    {passwordStrength === 0 && 'Use at least 8 characters with uppercase, numbers, and special characters'}
                                    {passwordStrength === 1 && 'Password is weak'}
                                    {passwordStrength === 2 && 'Password is fair'}
                                    {passwordStrength === 3 && 'Password is good'}
                                    {passwordStrength === 4 && 'Password is strong'}
                                </p>
                            </div>

                            <Button type={'submit'}>Sign In</Button>
                        </form>
                    </Form>
                )}


                {/** or continue with */}
                <div className={'flex items-center gap-4 px-6'}>
                    <hr className={'flex-1 border-text'}/>
                    <p className={'text-text'}>Or continue with</p>
                    <hr className={'flex-1 border-text'}/>
                </div>

                {/** oauths */}
                <div className={'grid grid-cols-2 gap-3 px-6 pb-6'}>
                    <button type={'button'}
                            className={'w-full inline-flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm shadow-primary-200 bg-white text-sm font-medium text-slate-700 cursor-pointer'}>
                        <svg className={'size-5 mr-2'} viewBox={'0 0 24 24'} xmlns={'http://www.w3.org/2000/svg'}>
                            <path d={'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'} fill={'#4285F4'}/>
                            <path d={'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'} fill={'#34A853'}/>
                            <path d={'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'} fill={'#FBBC05'}/>
                            <path d={'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'} fill={'#EA4335'}/>
                        </svg>
                        Google
                    </button>

                    <button type={'button'}
                            className={'w-full inline-flex justify-center items-center py-2 px-4 border border-primary rounded-md shadow-sm shadow-primary-200 bg-white text-sm font-medium text-slate-700 cursor-pointer'}>
                        <svg className={'size-5 mr-2'} viewBox={'0 0 24 24'} xmlns={'http://www.w3.org/2000/svg'}>
                            <path
                                d={'M16.52 18.34c-.83 1.58-1.7 3.12-3.05 3.14-1.33.02-1.76-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.3-1.7-3.14-3.28-1.71-3.17-1.9-6.9-.8-8.9.78-1.41 2.16-2.3 3.66-2.33 1.32-.03 2.57.9 3.39.9.82 0 2.36-1.11 3.98-.95.68.03 2.58.28 3.8 2.08-.1.06-2.27 1.35-2.25 4 .02 3.14 2.75 4.23 2.77 4.25-.02.07-.42 1.44-1.38 2.83l-.02.03z'}
                                fill={'#000'}/>
                            <path d={'M12.8 5.5c.69-.86 1.15-2 1.02-3.17-1.06.05-2.28.73-3 1.61-.66.76-1.25 1.96-1.1 3.11 1.17.09 2.35-.62 3.08-1.55z'} fill={'#000'}/>
                        </svg>
                        Apple
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
