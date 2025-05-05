'use client';

import React, {useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {IoMdArrowDropdown} from "react-icons/io";
import {MonthlyOverviewProps} from "@/types";
import {MdOutlineWallet} from "react-icons/md";
import {TbArrowUpRight} from "react-icons/tb";
import {FiTarget} from "react-icons/fi";
import {HiOutlineCreditCard} from "react-icons/hi";

function MonthlyOverview({totals}: MonthlyOverviewProps) {
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
        <div className={'flex flex-col p-6 gap-6 shadow-lg rounded-lg bg-text-100'}>
            <div className={'flex flex-wrap justify-between items-center gap-2'}>
                <h1 className={'text-base md:text-lg lg:text-2xl font-semibold text-text-900'}>Monthly Overview</h1>

                {/*<div className={'relative w-32 md:w-44'} onClick={handleContainerClick}>
                    <Input ref={inputRef} type={'month'} value={displayValue} onChange={handleChange} className={'absolute inset-0 w-full h-full opacity-0 cursor-pointer'}/>

                    <div className={'w-full px-2 md:px-3 py-1 md:py-2 border border-input rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer'}>
                        <span className={'flex justify-between items-center text-text-900'}>
                          <span className={'text-sm md:text-base'}>{formatDisplay(displayValue)}</span>
                          <IoMdArrowDropdown className={'text-lg md:text-2xl'}/>
                        </span>
                    </div>
                </div>*/}
            </div>

            {/** total invested */}
            <div className={'flex flex-col gap-4 p-4 border rounded-xl text-text-900'}>
                <div className={'flex justify-between gap-2'}>
                    <div className={'flex flex-col'}>
                        <h1 className={'text-sm md:text-base text-purple-500 md:text-red-600'}>Total Invested</h1>
                        <h1 className={'text-lg md:text-xl font-bold'}>₹{totals.amountPaidThisMonth}</h1>
                    </div>

                    <div className={'flex flex-col items-end justify-center gap-2'}>
                        <div className={'border rounded-full p-2'}>
                            <MdOutlineWallet className={'text-lg md:text-2xl'}/>
                        </div>
                    </div>
                </div>
            </div>

            {/** total progress */}
            <div className={'flex flex-col gap-4 p-4 border rounded-xl text-text-900'}>
                <div className={'flex justify-between items-center w-full gap-2'}>
                    <div>
                        <h1 className={'text-sm md:text-base text-purple-500 md:text-red-600'}>Target Progress</h1>
                        <h1 className={'text-lg md:text-xl font-bold'}>₹{totals.amountPaidThisMonth} / ₹{totals.totalActiveSipAmount}</h1>
                        <h1 className={'text-xs'}>{Math.round((totals.amountPaidThisMonth / totals.totalActiveSipAmount) * 100)}% of monthly target</h1>
                    </div>

                    <div className={'flex flex-col'}>
                        <div className={'border rounded-full p-2'}>
                            <FiTarget className={'text-lg md:text-2xl'}/>
                        </div>
                    </div>
                </div>

                <div className={'bg-secondary-200 rounded-full'}>
                    <div className={'bg-secondary h-2.5 rounded-full'} style={{width: `${(totals.amountPaidThisMonth / totals.totalActiveSipAmount) * 100}%`}}/>
                </div>
            </div>

            {/** pending amount */}
            <div className={'flex flex-col gap-4 p-4 border rounded-xl text-text-900'}>
                <div className={'flex justify-between'}>
                    <div className={'flex flex-col'}>
                        <h1 className={'text-sm md:text-base text-purple-500 md:text-red-600'}>Pending Amount</h1>
                        <h1 className={'text-lg md:text-xl font-bold'}>₹{totals.amountRemainingThisMonth}</h1>
                    </div>

                    <div className={'flex flex-col items-end justify-center gap-2'}>
                        <div className={'border rounded-full p-2'}>
                            <HiOutlineCreditCard className={'text-lg md:text-2xl'}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthlyOverview;
