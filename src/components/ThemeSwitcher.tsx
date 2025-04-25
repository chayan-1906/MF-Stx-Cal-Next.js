'use client';

import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";

function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();

    const toggleLightDark = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <div className={'flex items-center'}>
            <h1>{theme}</h1>
            <Button variant={'ghost'} onClick={toggleLightDark}>
                {theme === 'dark' ? (
                    <span className="flex items-center gap-3"><Sun/> Light Mode</span>
                ) : (
                    <span className="flex items-center gap-3"><Moon/> Dark Mode</span>
                )}
            </Button>
            <Button variant={'default'} onClick={() => setTheme('system')}>Use System Theme</Button>
        </div>
    );
}

export default ThemeSwitcher;
