import React, {Children, cloneElement, isValidElement} from "react";
import {AppWrapperLayoutChildProps, AppWrapperLayoutProps} from "@/types";
import Navbar from "@/components/Navbar";
import {getUserDetailsFromToken} from "@/lib/db/user-storage";
import {getIsLoggedIn} from "@/app/actions";

async function AppWrapperLayout({children, className}: AppWrapperLayoutProps) {
    const {userId, email} = await getUserDetailsFromToken();
    const isLoggedIn = await getIsLoggedIn(userId, email);

    return (
        <div>
            <header>
                <Navbar isLoggedIn={isLoggedIn}/>
            </header>
            <main>
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
