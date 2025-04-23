'use client';

import React from "react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import modalKeys from "@/lib/modalKeys";
import {DashboardHeaderProps} from "@/types";

function DashboardHeader({userId}: DashboardHeaderProps) {
    const [userIdd, setUserIdd] = React.useState("");
    const [openModalKey, setOpenModalKey] = React.useState("");

    const handleOpen = () => {
        setUserIdd(userId ?? '');
        setOpenModalKey(modalKeys.addUpdateMFSIP);
    }

    return (
        <div className={'flex w-full gap-4 justify-between'}>

            <h1 className={'text-3xl font-bold text-text-900 tracking-wide'}>Investment Dashboard</h1>
            <div className={'flex gap-2'}>
                {/*<Button variant={'outline'} onClick={() => (onOpen(''), setOpenModalKey(modalKeys.addUpdateMFSIP))}>*/}
                <Button variant={'outline'} onClick={handleOpen}>
                    <PlusCircle/>
                    Add SIP
                </Button>
                <Button>
                    <PlusCircle/>
                    Add Lumpsum
                </Button>
            </div>
        </div>
    );
}

export default DashboardHeader;
