'use client';

import {Button} from "@/components/ui/button";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import apis from "@/lib/apis";
import type {MFSIP} from "@/models/MFSIP";
import {ApiResponse} from "@/types/ApiResponse";
import {toast} from "react-toastify";

function MFSIP() {
    const [mfSips, setMfSips] = useState<MFSIP[]>([]);

    const addMFSIP = useCallback(async () => {
        await axios.post(apis.addMFSIPApi(), {
            "fundName": "Fund Name 4",
            "fundCode": "fundName4",
            "amount": 2300,
            "dayOfMonth": 3,
            "active": true,
            "startDate": "2022-03-11T00:00:00",
            "endDate": "2024-02-01T00:00:00",
            "notes": "Sample note for Fund 4...",
            "category": "equity",
        });
    }, []);

    const getAllMFSIPs = useCallback(async () => {
        const getAllMFSIPsResponse = (await axios.get<ApiResponse>(apis.getAllMFSIPsApi())).data;
        if (getAllMFSIPsResponse.success) {
            setMfSips(getAllMFSIPsResponse.data.mfSips);
        } else {
            toast(getAllMFSIPsResponse.message, {type: 'error'});
        }
    }, []);

    useEffect(() => {
        getAllMFSIPs();
    }, [getAllMFSIPs]);

    return (
        <div className={'mt-6 p-6 bg-secondary-800 rounded-lg space-y-5'}>
            <Button onClick={addMFSIP}>Add MFSIP</Button>
            {mfSips.map((mfSip) => (
                <div key={mfSip.externalId} className={'px-3 rounded-md'}>
                    <h1>{mfSip.fundName} ({mfSip.fundCode}) -- ₹{mfSip.amount} {new Intl.DateTimeFormat('en-GB').format(new Date(mfSip.startDate))}</h1>
                </div>
            ))}
        </div>
    );
}

export default MFSIP;
