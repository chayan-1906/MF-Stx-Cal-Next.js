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
import {doCredentialLogin, handleGoogleLogin} from "@/app/actions";
import axios from "axios";
import apis from "@/lib/apis";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import Image from "next/image";

function LoginForm() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });
    const {register, handleSubmit, formState: {errors}} = form;
    const [globalError, setGlobalError] = useState<string>('');
    const router = useRouter();

    const onSubmit = async (values: LoginSchema) => {
        try {
            const result = await doCredentialLogin(values);
            if (result?.message) {
                setGlobalError(result.message);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    }

    const sendVerificationCode = async () => {
        const sendCodeResponse = await axios.post<ApiResponse>(apis.sendCodeApi(), {
            email: form.watch('email'),
        });

        if (sendCodeResponse.data.success) {
            toast('Code sent to your email', {type: 'success'});
        } else {
            toast('Something went wrong', {type: 'error'});
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

                        <button type={'button'} className={'self-end text-sm rounded-md border border-primary px-3 py-1 cursor-pointer'} onClick={sendVerificationCode}>
                            Send Code
                        </button>

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
