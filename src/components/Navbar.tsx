import React from "react";
import {NavbarProps} from "@/types";
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import routes from "@/lib/routes";
import {doLogout} from "@/app/actions";
import {APP_NAME} from "@/lib/config";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import {cn} from "@/lib/utils";

async function Navbar({isLoggedIn}: NavbarProps) {
    return (
        <nav className={'fixed top-0 left-0 right-0 w-full px-6 md:px-20 py-1 md:py-3 z-50 bg-background border-b-2 border-secondary'}>
            <div className={'flex justify-between items-center py-3 mx-auto'}>
                <Link href={routes.homePath()} className={'flex items-center gap-2 select-none'}>
                    <Image src={'/assets/images/logo.svg'} alt={'logo'} height={32} width={32}/>
                    <h2 className={cn('mt-3 text-xl font-bold text-center text-primary tracking-wide', 'hidden sm:flex')}>{APP_NAME}</h2>
                </Link>
                {!isLoggedIn ? (
                    <Button variant={'default'} asChild>
                        <Link href={routes.loginPath()}>Sign In</Link>
                    </Button>
                ) : (
                    <form action={doLogout}>
                        <Button variant={'destructive'}>Sign Out</Button>
                    </form>
                )}

                <ThemeSwitcher/>
            </div>
        </nav>
    );
}

export default Navbar;
