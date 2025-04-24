'use client';

import React, {useCallback, useState} from "react";
import type {MFSIP} from "@/models/MFSIP";
import {PencilIcon, TrashIcon} from "lucide-react";
import axios from "axios";
import apis from "@/lib/apis";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import AddUpdateMFSIPFormModal from "@/components/dashboard/modals/AddUpdateMFSIPFormModal";
import {useAddUpdateMFSIPModal} from "@/components/dashboard/hooks/useAddUpdateMFSIPModal";

function MFSIP({userId, mfSips}: { userId: string; mfSips: MFSIP[] }) {
    const [mfSipToBeEdited, setMfSipToBeEdited] = useState<MFSIP | null>(null);
    const router = useRouter();
    const {open: openUpdateModal, isOpen: isUpdateOpen, close: closeUpdateModal} = useAddUpdateMFSIPModal('123');

    const deleteMfSip = useCallback(async (mfSip: MFSIP) => {
        try {
            const deleteMfSipResponse = (await axios.delete<ApiResponse>(apis.deleteMFSIPByIdApi(mfSip.mfSipId ?? ''))).data;
            if (deleteMfSipResponse.success) {
                toast(deleteMfSipResponse.message, {type: 'success'});
                router.refresh();
            } else {
                toast(deleteMfSipResponse.message, {type: 'error'});
            }
        } catch (error) {
            toast('Something went wrong', {type: 'error'});
        }
    }, [router]);

    return (
        <div className={'mt-6 p-6 bg-secondary-900 rounded-lg space-y-5'}>
            <AddUpdateMFSIPFormModal userId={userId} mfSipId={'123'} mfSip={mfSipToBeEdited}/>
            {mfSips.map((mfSip) => (
                <div key={mfSip.externalId} className={'px-3 rounded-md'}>
                    <div className={'flex justify-between gap-4'}>
                        <div>
                            <h1 className={'text-success font-bold text-xl'}>{mfSip.fundName}</h1>
                            <p className={'text-primary'}>({mfSip.schemeName}) -- ₹{mfSip.amount} {new Intl.DateTimeFormat('en-GB').format(new Date(mfSip.startDate))}</p>
                        </div>
                        <div className={'flex gap-6'}>
                            <PencilIcon className={'text-primary-foreground cursor-pointer'} onClick={async () => {
                                console.log('setting mfSip', mfSip);
                                setMfSipToBeEdited(mfSip);
                                await openUpdateModal('update');
                            }}/>
                            <TrashIcon className={'text-destructive'} onClick={() => deleteMfSip(mfSip)}/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MFSIP;
