import React from "react";
import {cn} from "@/lib/utils";

// TODO: for more than 1 param, create interface in types/index.ts
function CategoryBadge({category}: { category: 'equity' | 'debt' | 'liquid' }) {
    let textColor = 'text-neutral-500';
    let badgeBgColor = 'bg-neutral-100';

    if (category === 'equity') {
        badgeBgColor = 'bg-primary-200';
        textColor = 'text-primary-900';
    } else if (category === 'debt') {
        badgeBgColor = 'bg-accent-100';
        textColor = 'text-accent-800';
    } else if (category === 'liquid') {
        badgeBgColor = 'bg-secondary-100';
        textColor = 'text-secondary-800';
    }

    return (
        <div className={cn('rounded-full px-3 py-1 text-sm font-semibold capitalize', badgeBgColor, textColor)}>
            {category}
        </div>
    );
}

export default CategoryBadge;
