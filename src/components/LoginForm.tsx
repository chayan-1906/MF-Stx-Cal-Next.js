'use client';

import React from "react";
import {doSocialLogin} from "@/app/actions";

function LoginForm() {
    return (
        <form action={doSocialLogin}>
            <button className={'bg-pink-400 py-1 px-3 rounded-md m-1 text-lg text-white'} type={'submit'} name={'action'} value={'google'}>Sign In with Google</button>
            <button className={'bg-teal-400 py-1 px-3 rounded-md m-1 text-lg text-white'} type={'submit'} name={'action'} value={'github'}>Sign In with GitHub</button>
        </form>
    );
}

export default LoginForm;
