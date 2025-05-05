'use client';

import React, {useCallback, useRef, useState} from "react";
import {SIPCalenderViewProps} from "@/types";
import {cn, formatNumber, getOrdinal, isListEmpty} from "@/lib/utils";
import {MFSIP} from "@/models/MFSIP";
import {TbCalendarMonth} from "react-icons/tb";
import Link from "next/link";
import routes from "@/lib/routes";
import {useRouter} from "next/navigation";
import CategoryBadge from "@/components/CategoryBadge";
import {Button} from "@/components/ui/button";
import {MdOutlineModeEditOutline} from "react-icons/md";
import DeleteMFSIPModal from "@/components/dashboard/modals/DeleteMFSIPModal";
import {nuqsModalKeys} from "@/lib/modalKeys";
import {IoMdTrash} from "react-icons/io";
import {useModal} from "@/components/ui/custom/custom-modal";

function SIPCalendarView({investments}: SIPCalenderViewProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>();
    const [selectedSips, setSelectedSips] = useState<MFSIP[]>([]);
    const detailViewRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const trClasses = '';
    const tdHeadingClasses = 'pr-2 font-semibold text-text-900 text-sm';
    const tdValueClasses = 'text-primary font-medium text-sm';

    const {openModalId, onOpen, openModalKey, setOpenModalKey} = useModal();

    const handleDateSelection = useCallback((day: number, sips: MFSIP[]) => {
        setSelectedDay(day);
        setSelectedSips(sips);
        setTimeout(() => {
            const element = detailViewRef.current;
            if (element) {
                // const offset = isListEmpty(sips) ? 200 : 200;
                const offset = 200;
                const top = element.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({top, behavior: 'smooth'});
            }
        }, 0);
    }, []);

    return (
        <div className={'flex flex-col p-6 shadow-lg rounded-lg bg-text-100 gap-4'}>
            <h1 className={'text-base md:text-lg lg:text-2xl font-semibold text-text-900'}>SIP Calendar</h1>

            {/** calendar view */}
            <div className={'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-4 select-none'}>
                {investments.map(({dayOfMonth, count, sips}) => (
                    <div key={dayOfMonth} onClick={() => handleDateSelection(dayOfMonth, sips)}
                         className={cn('relative flex flex-col justify-center items-center min-h-20 p-4 gap-2 rounded-lg bg-text-200 cursor-pointer hover:bg-text-300 hover:transition-all hover:duration-300', selectedDay === dayOfMonth && 'bg-text-300')}>
                        <h1 className={'text-text-900'}>{dayOfMonth}</h1>
                        <p className={cn('absolute top-2 left-2 px-2 py-1 rounded-full bg-secondary text-xs font-bold', count === 0 && 'hidden')}>{count}</p>
                    </div>
                ))}
            </div>

            {/** detailed view */}
            <div ref={detailViewRef} className={cn('', !selectedDay && 'hidden')}>
                {!isListEmpty(selectedSips) ? (
                    <div className={'flex flex-col gap-2'}>
                        <h1 className={'text-text-900 font-semibold'}>SIPs for {getOrdinal(selectedDay)}</h1>
                        <div className={cn('gap-2', selectedSips.length > 2 ? 'grid grid-cols-2' : 'flex')}>
                            {selectedSips.map(({mfSipId, fundName, schemeName, folioNo, amount, category, externalId}) => (
                                <div key={mfSipId} className={'flex flex-1 gap-2 justify-between items-center border border-text-900 rounded-lg p-4'}>
                                    <div className={'hidden sm:flex w-full'}>
                                        <div className={'flex gap-4 items-center w-full'}>
                                            <div className={cn('p-3 bg-text rounded-full', 'hidden sm:flex')}>
                                                <TbCalendarMonth className={'text-xl'}/>
                                            </div>
                                            <div className={'flex flex-col'}>
                                                <div className={'flex items-center gap-2 sm:gap-4'}>
                                                    <h1 className={'text-primary font-bold tracking-wider'}>{fundName}</h1>
                                                    <CategoryBadge category={category}/>
                                                </div>
                                                <h1 className={'text-text-800 text-sm'}>{schemeName}</h1>
                                                <h1 className={'text-text-800 text-sm'}>{folioNo}</h1>
                                                {/*<h1 className={'text-rose-400 text-xs'}>{externalId}</h1>*/}
                                            </div>
                                        </div>

                                        <div className={'flex flex-col items-center gap-2'}>
                                            <div className={'flex gap-2'}>
                                                <Link href={routes.updateMfSipPath(externalId)}>
                                                    <MdOutlineModeEditOutline className={'size-5 text-text-900 cursor-pointer'}/>
                                                </Link>
                                                <DeleteMFSIPModal mfSipId={mfSipId || ''} openModalKey={nuqsModalKeys.deleteMfFund} selectedSips={selectedSips} setSelectedSips={setSelectedSips}/>
                                                <IoMdTrash className={'size-5 text-destructive cursor-pointer'} onClick={() => {
                                                    onOpen(mfSipId);
                                                    setOpenModalKey(nuqsModalKeys.deleteMfFund);
                                                }}/>
                                            </div>
                                            <h1 className={'text-secondary font-bold'}>₹{formatNumber(amount)}</h1>
                                        </div>
                                    </div>

                                    {/** table view for <sm devices */}
                                    <div className={'flex flex-col sm:hidden w-full gap-2'}>
                                        <table className={''}>
                                            <tbody>
                                            {/** fund name */}
                                            <tr className={trClasses}>
                                                <td className={tdHeadingClasses}>Fund Name:</td>
                                                <td className={tdValueClasses}>{fundName}</td>
                                            </tr>

                                            {/** scheme name */}
                                            <tr className={trClasses}>
                                                <td className={tdHeadingClasses}>Scheme Name:</td>
                                                <td className={tdValueClasses}>{schemeName}</td>
                                            </tr>

                                            {/** folio no */}
                                            <tr className={trClasses}>
                                                <td className={tdHeadingClasses}>Folio No:</td>
                                                <td className={tdValueClasses}>{folioNo}</td>
                                            </tr>

                                            {/** amount */}
                                            <tr className={trClasses}>
                                                <td className={tdHeadingClasses}>Amount:</td>
                                                <td className={tdValueClasses}>₹{amount}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <div className={'flex gap-2 justify-center'}>
                                            <Link href={routes.updateMfSipPath(externalId)}>
                                                <Button variant={'secondary'}>Update</Button>
                                            </Link>
                                            <Button variant={'destructive'} onClick={() => {
                                                onOpen(mfSipId);
                                                setOpenModalKey(nuqsModalKeys.deleteMfFund);
                                            }}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <h1 className={'text-text-800 text-base sm:text-lg md:text-xl font-semibold text-center'}>No SIPs found for {getOrdinal(selectedDay)}</h1>
                )}
            </div>
        </div>
    );
}

export default SIPCalendarView;
