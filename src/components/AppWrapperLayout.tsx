import React, {Children, cloneElement, isValidElement} from "react";
import {AppWrapperLayoutChildProps, AppWrapperLayoutProps} from "@/types";
import Navbar from "@/components/Navbar";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import {getIsLoggedIn} from "@/app/actions";
import {isStringInvalid} from "@/lib/utils";

async function AppWrapperLayout({children, className}: AppWrapperLayoutProps) {
    const {userId, email, name, picture} = await getUserDetailsFromToken();
    const isLoggedIn = await getIsLoggedIn(userId, email);

    /*if (!isLoggedIn) {
        return null;
    }*/

    return (
        <div className={'flex flex-col min-h-screen overflow-x-hidden px-6 md:px-20 mx-auto '}>
            {isLoggedIn && (
                <header>
                    <Navbar isLoggedIn={isLoggedIn} name={name} picture={picture}/>
                </header>
            )}
            <main className={'mt-24'}>
                {Children.map(children, (child) => {
                    if (isValidElement<AppWrapperLayoutChildProps>(child) && typeof child.type !== 'string') {
                        return cloneElement(child, {isLoggedIn, userId, email});
                    }
                    return child;
                })}
            </main>
        </div>
    );
}

export default AppWrapperLayout;
