'use client';

import React, {useState} from "react";
import ToggleSIPView from "@/components/dashboard/ToggleSIPView";
import SIPCalendarView from "@/components/dashboard/SIPCalendarView";
import SIPListView from "@/components/dashboard/modals/SIPListView";
import {SIPViewProps} from "@/types";

function SIPView({mfSipsByDate, allMfSips}: SIPViewProps) {
    const [sipViewMode, setSipViewMode] = useState<'calendar' | 'list'>('calendar');

    return (
        <div className={'space-y-4'}>
            <ToggleSIPView sipViewMode={sipViewMode} setSipViewMode={setSipViewMode}/>
            {sipViewMode === 'calendar' && (
                <SIPCalendarView investments={mfSipsByDate}/>
            )}
            {sipViewMode === 'list' && (
                <SIPListView investments={allMfSips}/>
            )}
        </div>
    );
}

export default SIPView;
