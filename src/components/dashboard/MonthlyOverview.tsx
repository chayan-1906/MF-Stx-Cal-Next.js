'use client';

import React, {useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import {IoMdArrowDropdown} from "react-icons/io";
import {MonthlyOverviewProps} from "@/types";
import {ArrowUpRight, CreditCard, Target, Wallet} from "lucide-react";

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
            <div className={'flex justify-between items-center'}>
                <h1 className={'font-semibold text-text-900'}>Monthly Overview</h1>

                <div className={'relative w-44'} onClick={handleContainerClick}>
                    <Input ref={inputRef} type={'month'} value={displayValue} onChange={handleChange} className={'absolute inset-0 w-full h-full opacity-0 cursor-pointer'}/>

                    <div className={'w-full px-3 py-2 border border-input rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer'}>
                    <span className={'flex justify-between items-center text-text-900'}>
                      <span>{formatDisplay(displayValue)}</span>
                      <IoMdArrowDropdown className={'text-2xl'}/>
                    </span>
                    </div>
                </div>
            </div>

            {/** total invested */}
            <div className={'flex flex-col gap-4 p-4 border rounded-xl text-text-900'}>
                <div className={'flex justify-between'}>
                    <div className={'flex flex-col'}>
                        <h1>Total Invested</h1>
                        <h1 className={'text-xl font-bold'}>₹{totals.amountPaidThisMonth}</h1>
                        <h1 className={'text-xs text-rose-400 font-bold'}>SIP: TODO</h1>
                    </div>
                    <div className={'flex flex-col items-end justify-center gap-2'}>
                        <div className={'border rounded-full p-2'}>
                            <Wallet size={16}/>
                        </div>
                        <h1 className={'text-xs text-rose-400 font-bold'}>Lumpsum: TODO</h1>
                    </div>
                </div>
            </div>

            {/** total progress */}
            <div className={'flex flex-col gap-4 p-4 border rounded-xl text-text-900'}>
                <div className={'flex justify-between items-center w-full'}>
                    <div>
                        <h1>Target Progress</h1>
                        <h1 className={'text-xl font-bold'}>₹{totals.amountPaidThisMonth} / ₹{totals.totalActiveSipAmount}</h1>
                        <h1 className={'text-xs'}>{Math.round((totals.amountPaidThisMonth / totals.totalActiveSipAmount) * 100)}% of monthly target</h1>
                    </div>

                    <div className={'flex flex-col'}>
                        <div className={'border rounded-full p-2'}>
                            <Target size={16}/>
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
                        <h1>Pending Amount</h1>
                        <h1 className={'text-xl font-bold'}>₹{totals.amountRemainingThisMonth}</h1>
                        <div className={'flex gap-1 text-xs text-rose-400 font-bold'}>
                            <span>View upcoming SIPs: TODO</span>
                            <ArrowUpRight size={16}/>
                        </div>
                    </div>
                    <div className={'flex flex-col items-end justify-center'}>
                        <div className={'border rounded-full p-2'}>
                            <CreditCard size={16}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MonthlyOverview;
