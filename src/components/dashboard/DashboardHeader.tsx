'use client';

import React from "react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import modalKeys from "@/lib/modalKeys";
import MFSIPFormModal from "@/components/mutual-funds/modals/MFSIPFormModal";
import {DashboardHeaderProps} from "@/types";
import {isStringInvalid} from "@/lib/utils";
import {useModal} from "@/components/ui/responsive-modal";

function DashboardHeader({userId}: DashboardHeaderProps) {
    const {onOpen, onClose, setOpenModalKey} = useModal();

    return (
        <div className={'flex w-full gap-4 justify-between'}>
            {!isStringInvalid(userId) && (
                <MFSIPFormModal userId={userId!} openModalKey={modalKeys.addUpdateMFSIP}/>
            )}

            <h1 className={'text-3xl font-bold text-text-900 tracking-wide'}>Investment Dashboard</h1>
            <div className={'flex gap-2'}>
                <Button variant={'outline'} onClick={() => (onOpen(''), setOpenModalKey(modalKeys.addUpdateMFSIP))}>
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
