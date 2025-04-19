import {auth} from "@/auth";
import Image from "next/image";
import React from "react";
import {redirect} from "next/navigation";
import routes from "@/lib/routes";
import Logout from "@/components/Logout";

async function Home() {
    const session = await auth();

    console.log('session:', session);

    if (!session?.user) {
        redirect(routes.loginPath());
    }

    return (
        <div className={'bg-background text-text'}>
            <h1 className={'text-4xl font-black text-primary-600'}>HOME PAGE</h1>

            <h1>Name - {session?.user?.name}</h1>
            <h1>Email - {session?.user?.email}</h1>
            {session?.user?.image && (
                <Image src={session?.user?.image || ''} alt={session?.user?.name || ''} height={72} width={72} className={'rounded-full'}/>
            )}

            <Logout/>
        </div>
    );
}

export default Home;
