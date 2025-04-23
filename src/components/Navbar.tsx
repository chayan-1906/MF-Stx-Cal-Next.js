import React from "react";
import {NavbarProps} from "@/types";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import routes from "@/lib/routes";
import {doLogout} from "@/app/actions";
import {APP_NAME} from "@/lib/config";

async function Navbar({isLoggedIn}: NavbarProps) {
    return (
        <nav className={'shadow-sm sticky top-0 bg-background'}>
            <div className={'flex justify-between items-center py-3 container mx-auto'}>
                <Link href={routes.homePath()} className={'flex items-center gap-2 select-none'}>
                    <Image src={'/assets/images/logo.svg'} alt={'logo'} height={32} width={32}/>
                    <h2 className={'mt-3 text-xl font-bold text-center text-primary tracking-wide'}>{APP_NAME}</h2>
                </Link>
                {!isLoggedIn ? (
                    <Link href={routes.loginPath()}>
                        <Button variant={'default'}>Sign In</Button>
                    </Link>
                ) : (
                    <form action={doLogout}>
                        <Button variant={'destructive'}>
                            Sign Out
                        </Button>
                    </form>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
