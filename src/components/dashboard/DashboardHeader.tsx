'use client';

import React from "react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {DashboardHeaderProps} from "@/types";
import Link from "next/link";
import routes from "@/lib/routes";

function DashboardHeader({userId}: DashboardHeaderProps) {
    return (
        <div className={'flex w-full gap-4 justify-between items-center'}>
            <h1 className={'text-lg md:text-xl lg:text-3xl font-bold text-text-900 lg:tracking-wide'}>Investment Dashboard</h1>
            <div className={'flex gap-2'}>
                {/*<Button variant={'outline'} onClick={() => (onOpen(''), setOpenModalKey(modalKeys.addUpdateMFSIP))}>*/}
                <Button variant={'outline'} asChild>
                    <Link href={routes.addMfSipPath()}>
                        <PlusCircle/> Add SIP
                    </Link>
                </Button>
                <Button asChild>
                    <Link href={routes.addMfLumpsumPath()}>
                        <PlusCircle/> Add Lumpsum
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default DashboardHeader;
