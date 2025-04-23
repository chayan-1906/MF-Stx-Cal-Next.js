'use client';

import {useCallback, useState} from "react";
import type {MFSIP} from "@/models/MFSIP";
import MFSIPForm from "@/components/mutual-funds/MFSIPForm";
import {PencilIcon, TrashIcon} from "lucide-react";
import axios from "axios";
import apis from "@/lib/apis";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

function MFSIP({userId, mfSips}: { userId: string; mfSips: MFSIP[] }) {
    // const [mfSips, setMfSips] = useState<MFSIP[]>([]);
    const [mfSipToBeEdited, setMfSipToBeEdited] = useState<MFSIP | null>(null);
    const router = useRouter();

    /*const getAllMFSIPs = useCallback(async () => {
        const getAllMFSIPsResponse = (await axios.get<ApiResponse>(apis.getAllMFSIPsApi())).data;
        if (getAllMFSIPsResponse.success) {
            setMfSips(getAllMFSIPsResponse.data.mfSips);
        } else {
            toast(getAllMFSIPsResponse.message, {type: 'error'});
        }
    }, []);

    useEffect(() => {
        getAllMFSIPs();
    }, [getAllMFSIPs]);*/

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
            {mfSips.map((mfSip) => (
                <div key={mfSip.externalId} className={'px-3 rounded-md'}>
                    <div className={'flex justify-between gap-4'}>
                        <div>
                            <h1 className={'text-success font-bold text-xl'}>{mfSip.fundName}</h1>
                            <p className={'text-primary'}>({mfSip.schemeName}) -- ₹{mfSip.amount} {new Intl.DateTimeFormat('en-GB').format(new Date(mfSip.startDate))}</p>
                        </div>
                        <div className={'flex gap-6'}>
                            <PencilIcon className={'text-primary-foreground'} onClick={() => {
                                console.log(mfSip);
                                setMfSipToBeEdited(mfSip);
                            }}/>
                            <TrashIcon className={'text-destructive'} onClick={() => deleteMfSip(mfSip)}/>
                        </div>
                    </div>
                </div>
            ))}

            {mfSipToBeEdited && (
                <MFSIPForm userId={userId} mfSip={mfSipToBeEdited}/>
            )}
        </div>
    );
}

export default MFSIP;
