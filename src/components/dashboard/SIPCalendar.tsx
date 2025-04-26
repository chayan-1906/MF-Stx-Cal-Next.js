'use client';

import React, {useCallback, useState} from "react";
import {SIPCalenderProps} from "@/types";
import {cn, formatNumber, getOrdinal, isListEmpty} from "@/lib/utils";
import {MFSIP} from "@/models/MFSIP";
import {TbCalendarMonth} from "react-icons/tb";

function SIPCalendar({investments}: SIPCalenderProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>();
    const [selectedSips, setSelectedSips] = useState<MFSIP[]>([]);

    const handleDateSelection = useCallback((day: number, sips: MFSIP[]) => {
        setSelectedDay(day);
        setSelectedSips(sips);
    }, []);

    return (
        <div className={'flex flex-col p-6 shadow-lg rounded-lg bg-text-100 gap-4'}>
            <h1 className={'font-semibold text-text-900'}>SIP Calendar</h1>

            {/** calendar view */}
            <div className={'grid grid-cols-7 gap-4 select-none'}>
                {investments.map(({dayOfMonth, count, sips}) => (
                    <div key={dayOfMonth} onClick={() => handleDateSelection(dayOfMonth, sips)}
                         className={cn('flex flex-col justify-center items-center h-20 p-4 gap-2 rounded-lg bg-text-200 cursor-pointer hover:bg-text-300 hover:transition-all hover:duration-300', selectedDay === dayOfMonth && 'bg-text-300')}>
                        <h1 className={'text-text-900'}>{dayOfMonth}</h1>
                        <p className={cn('px-2 py-1 rounded-full bg-text text-foreground text-xs', count === 0 && 'hidden')}>{count}</p>
                    </div>
                ))}
            </div>

            {/** detailed view */}
            <div className={cn('', !selectedDay && 'hidden')}>
                {!isListEmpty(selectedSips) ? (
                    <div className={'flex flex-col gap-2'}>
                        <h1 className={'text-text-900 font-semibold'}>SIPs for {getOrdinal(selectedDay)}</h1>
                        <div className={cn('gap-2', selectedSips.length > 2 ? 'grid grid-cols-2' : 'flex')}>
                            {selectedSips.map(({mfSipId, fundName, schemeName, amount, category, externalId}) => (
                                <div key={mfSipId} className={'flex flex-1 justify-between items-center border border-text-900 rounded-lg p-4'}>
                                    <div className={'flex gap-4 items-center'}>
                                        {/*<div className={'px-4 py-3 bg-text rounded-full'}>{dayOfMonth}</div>*/}
                                        <div className={'p-3 bg-text rounded-full'}>
                                            <TbCalendarMonth className={'text-xl'}/>
                                        </div>
                                        <div className={'flex flex-col'}>
                                            <h1 className={'text-primary font-bold tracking-wider'}>{fundName}</h1>
                                            <div className={'flex gap-2 text-text-800 text-sm'}>
                                                <h1 className={''}>{schemeName}</h1>
                                                <h1>•</h1>
                                                <h1 className={'capitalize'}>{category}</h1>
                                            </div>
                                            <h1 className={'text-rose-400 text-xs'}>{externalId}</h1>
                                        </div>
                                    </div>
                                    <h1 className={'text-secondary font-bold'}>₹{formatNumber(amount)}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <h1 className={'text-text-800'}>No SIPs for {getOrdinal(selectedDay)}</h1>
                )}
            </div>
        </div>
    );
}

export default SIPCalendar;
