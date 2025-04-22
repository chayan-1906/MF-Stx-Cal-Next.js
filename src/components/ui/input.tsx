import * as React from "react"

import {cn} from "@/lib/utils"

function Input({className, type, ...props}: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "text-text-900 file:text-foreground placeholder:text-text-300 placeholder:dark:text-text-600 selection:bg-primary selection:text-primary-foreground border border-primary-700 flex h-9 w-full min-w-0 rounded-md dark:bg-primary-700 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-primary-300 focus-visible:ring-primary-300 focus-visible:ring-2",
                "aria-invalid:ring-accent aria-invalid:border-accent",
                className
            )}
            {...props}
        />
    )
}

export {Input}
