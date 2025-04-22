'use client';

import {useState} from "react";
import type {MFSIP} from "@/models/MFSIP";
import MFSIPForm from "@/components/mutual-funds/MFSIPForm";
import {PencilIcon} from "lucide-react";

function MFSIP({userId, mfSips}: { userId: string; mfSips: MFSIP[] }) {
    // const [mfSips, setMfSips] = useState<MFSIP[]>([]);
    const [mfSipToBeEdited, setMfSipToBeEdited] = useState<MFSIP | null>(null);

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

    return (
        <div className={'mt-6 p-6 bg-secondary-900 rounded-lg space-y-5'}>
            {mfSips.map((mfSip) => (
                <div key={mfSip.externalId} className={'px-3 rounded-md'}>
                    <div className={'flex justify-between gap-4'}>
                        <div>
                            <h1 className={'text-success font-bold text-xl'}>{mfSip.fundName}</h1>
                            <p className={'text-primary'}>({mfSip.schemeName}) -- ₹{mfSip.amount} {new Intl.DateTimeFormat('en-GB').format(new Date(mfSip.startDate))}</p>
                        </div>
                        <PencilIcon className={'text-primary-foreground'} onClick={() => {
                            console.log(mfSip);
                            setMfSipToBeEdited(mfSip);
                        }}/>
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
