import React from "react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";

function DashboardHeader() {
    return (
        <div className={'flex w-full gap-4 justify-between'}>
            <h1 className={'text-3xl font-bold text-text-900 tracking-wide'}>Investment Dashboard</h1>
            <div className={'flex gap-2'}>
                <Button variant={'outline'}>
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
