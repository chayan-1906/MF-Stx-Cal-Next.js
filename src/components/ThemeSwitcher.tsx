'use client';

import {useTheme} from "next-themes";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue} from "@/components/ui/select";
import {capitalize} from "@/lib/utils";
import {MdComputer} from "react-icons/md";
import {TiWeatherSunny} from "react-icons/ti";
import {AiOutlineMoon} from "react-icons/ai";

function ThemeSwitcher() {
    const {theme, setTheme} = useTheme();

    return (
        <div className={'flex items-center'}>
            <Select value={theme} onValueChange={(key) => setTheme(key)}>
                <SelectTrigger className={'w-32 text-text-900'}>
                    <SelectValue placeholder={capitalize(theme)}/>
                </SelectTrigger>
                <SelectContent className={'bg-background'}>
                    <SelectGroup>
                        <SelectLabel>Theme</SelectLabel>
                        <SelectSeparator/>
                        <SelectItem value={'system'}>
                            <MdComputer className={'text-text-900 group-hover:text-primary-foreground'}/> System
                        </SelectItem>
                        <SelectItem value={'light'}>
                            <TiWeatherSunny className={'text-text-900 group-hover:text-primary-foreground'}/> Light
                        </SelectItem>
                        <SelectItem value={'dark'}>
                            <AiOutlineMoon className={'text-text-900 group-hover:text-primary-foreground'}/> Dark</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}

export default ThemeSwitcher;
