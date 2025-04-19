/*import {doLogout} from "@/app/actions";

function Logout() {
    return (
        <form action={doLogout}>
            <button className={'bg-accent my-2 text-white py-1 px-3 rounded-md'} type={'submit'}>Logout</button>
        </form>
    );
}

export default Logout;*/

'use client';

import {doLogout} from "@/app/actions";
import {useForm} from "react-hook-form";

function Logout() {
    const form = useForm();
    const {register, handleSubmit, formState: {errors}} = form;

    const onLogout = async () => {
        try {
            await doLogout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onLogout)}>
            <button className={'bg-accent my-2 text-white py-1 px-3 rounded-md cursor-pointer'} type={'submit'}>Logout</button>
        </form>
    );
}

export default Logout;
