'use client';

import {Button} from "@/components/ui/button";
import {useCallback} from "react";
import {doLogout} from "@/app/actions";
import axios from "axios";
import apis from "@/lib/apis";

function DeleteAccount() {
    const deleteAccount = useCallback(async () => {
        await axios.delete(apis.deleteAccountApi());
        await doLogout();
    }, []);

    return (
        <Button variant={'destructive'} className={'my-2 py-1 px-3 rounded-md'} onClick={deleteAccount}>Delete Account</Button>
    );
}

export default DeleteAccount;
