'use client';

import React, {useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {IoMdArrowDropdown} from "react-icons/io";

function MonthlyOverview() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = useState<string>('');

    const handleContainerClick = () => inputRef.current?.showPicker();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDisplayValue(value);

        /*if (value && onChange) {
            const [year, month] = value.split('-').map(Number);
            onChange(value, month, year);
        }*/
    }

    const formatDisplay = (monthString: string) => {
        if (!monthString) return 'Select month';
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    }

    return (
        <div className={'flex justify-between items-center p-6 shadow-lg rounded-lg bg-text-100'}>
            <h1 className={'font-semibold text-text-900'}>Monthly Overview</h1>

            <div className={'relative w-44 cursor-pointer'} onClick={handleContainerClick}>
                <Input ref={inputRef} type={'month'} value={displayValue} onChange={handleChange} className={'absolute inset-0 w-full h-full opacity-0'}/>

                <div className={'w-full px-3 py-2 border border-input rounded-lg shadow-sm hover:shadow-md transition-all'}>
                    <span className={'flex justify-between items-center text-text-900'}>
                      <span>{formatDisplay(displayValue)}</span>
                      <IoMdArrowDropdown className={'text-2xl'}/>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MonthlyOverview;
