import React from "react";
import {cn} from "@/lib/utils";

// TODO: for more than 1 param, create interface in types/index.ts
function StatusBadge({active}: { active: boolean }) {
    const textColor = active ? 'text-success-foreground' : 'text-destructive-foreground';
    const badgeBgColor = active ? 'bg-success' : 'bg-destructive';

    return (
        <div className={cn('rounded-full px-3 py-1 text-sm font-semibold capitalize', badgeBgColor, textColor)}>
            {active ? 'Active' : 'Inactive'}
        </div>
    );
}

export default StatusBadge;
