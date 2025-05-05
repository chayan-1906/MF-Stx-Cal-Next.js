import React from "react";
import {SIPListViewProps} from "@/types";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import Link from "next/link";
import routes from "@/lib/routes";
import {cn} from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import {useModal} from "@/components/ui/custom/custom-modal";
import {nuqsModalKeys} from "@/lib/modalKeys";
import DeleteMFSIPModal from "@/components/dashboard/modals/DeleteMFSIPModal";
import {MdOutlineModeEditOutline} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";

function SIPListView({investments}: SIPListViewProps) {
    const {openModalId, onOpen, openModalKey, setOpenModalKey} = useModal();

    return (
        <div className={'flex flex-col p-6 shadow-lg rounded-lg bg-text-100 gap-4'}>
            <Table className={''}>
                <TableHeader className={''}>
                    <TableRow className={'uppercase text-text-900'}>
                        <TableHead className={'font-bold'}>Scheme Name</TableHead>
                        <TableHead className={cn('font-bold', 'hidden sm:flex items-center')}>Folio No</TableHead>
                        <TableHead className={'font-bold'}>Amount</TableHead>
                        <TableHead className={'font-bold'}>Day</TableHead>
                        <TableHead className={cn('font-bold', 'hidden sm:flex items-center')}>Status</TableHead>
                        <TableHead className={'font-bold text-center'}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {investments.map(({mfFundId, mfSipId, externalId, fundName, schemeName, folioNo, amount, dayOfMonth, active, category}, index) => (
                        <TableRow key={index} className={cn('text-text-900 hover:bg-card hover:text-text-900 border-0', index % 2 === 0 ? 'bg-text-200' : '')}>
                            {/*<TableCell>{mfSipId}</TableCell>*/}
                            <TableCell className={'font-medium'}>{schemeName}</TableCell>
                            <TableCell className={'hidden sm:table-cell'}>{folioNo}</TableCell>
                            <TableCell>₹{amount}</TableCell>
                            <TableCell className={''}>{dayOfMonth}</TableCell>
                            <TableCell className={'hidden sm:table-cell'}>
                                <div className={cn('items-center flex')}>
                                    <StatusBadge active={active}/>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className={'flex justify-center items-center gap-8'}>
                                    <Link href={routes.updateMfSipPath(externalId)}>
                                        <MdOutlineModeEditOutline className={'size-5 text-text-900 cursor-pointer'}/>
                                    </Link>
                                    <DeleteMFSIPModal mfSipId={mfSipId || ''} openModalKey={nuqsModalKeys.deleteMfFund}/>
                                    <IoMdTrash className={'size-5 text-destructive cursor-pointer'} onClick={() => {
                                        onOpen(mfSipId);
                                        setOpenModalKey(nuqsModalKeys.deleteMfFund);
                                    }}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default SIPListView;
