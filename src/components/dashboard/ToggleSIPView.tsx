import React, {useCallback} from 'react';
import {ToggleSIPViewProps} from "@/types";
import {FiCalendar} from "react-icons/fi";
import {CiFilter} from "react-icons/ci";
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

function ToggleSIPView({sipViewMode, setSipViewMode}: ToggleSIPViewProps) {
    const {resolvedTheme} = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const commonClasses = 'flex gap-1 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer';

    const toggleViewMode = useCallback((mode: 'calendar' | 'list') => {
        setSipViewMode(mode);
    }, [setSipViewMode]);

    return (
        <div className={'flex items-center p-6 gap-1 shadow-lg rounded-lg bg-text-100'}>
            <div className={cn(commonClasses, sipViewMode === 'calendar' && 'bg-primary', !isDarkMode && sipViewMode !== 'calendar' && 'text-text-900')} onClick={() => toggleViewMode('calendar')}>
                <FiCalendar className={'size-5'}/>
                <span>Calendar View</span>
            </div>

            <div className={cn(commonClasses, sipViewMode === 'list' && 'bg-primary', !isDarkMode && sipViewMode !== 'list' && 'text-text-900')} onClick={() => toggleViewMode('list')}>
                <CiFilter className={'size-6'}/>
                <span>List View</span>
            </div>
        </div>
    );
}

export default ToggleSIPView;
