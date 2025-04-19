'use client';

import React, {useState} from "react";
import {useForm} from 'react-hook-form';
import {LoginSchema, loginSchema} from "@/lib/formValidationSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {APP_NAME} from "@/lib/config";
import {cn} from "@/lib/utils";
import {Lock, Mail} from "lucide-react";
import {useRouter} from "next/navigation";
import {doCredentialLogin} from "@/app/actions";

function LoginForm() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });
    const {register, handleSubmit, formState: {errors}} = form;
    const [globalError, setGlobalError] = useState<string>('');
    const router = useRouter();

    const onSubmit = async (values: LoginSchema) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const result = await doCredentialLogin(values);
            if (result?.message) {
                setGlobalError(result.message);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    }

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
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className={'flex flex-col px-6 gap-5'}>
                        <h1 className={'text-red-400'}>{globalError}</h1>

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
                        <FormField control={form.control} name={'code'}
                                       render={({field}) => (
                                           <FormItem>
                                               <FormLabel htmlFor={field.name} className={'text-text'}>Verification Code</FormLabel>
                                               <FormControl>
                                                   <div className={'relative'}>
                                                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                           <Lock className={'size-5 text-gray-400'}/>
                                                       </div>
                                                       <Input {...field} id={field.name} value={field.value ?? ''} type={'number'}
                                                              className={'pl-10 text-text'} onChange={(e) => field.onChange(e)}/>
                                                   </div>
                                               </FormControl>
                                               <FormMessage/>
                                           </FormItem>
                                       )}
                        />

                        <Button type={'submit'} name={'action'} value={'credentials'} className={'cursor-pointer'}>Sign In</Button>
                    </form>
                </Form>

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
