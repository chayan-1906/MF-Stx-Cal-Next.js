import * as React from "react"

import {cn} from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
          "text-text-900 file:text-primary-foreground placeholder:text-text border border-input flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-input focus-visible:ring-input focus-visible:ring-2",
          "aria-invalid:ring-destructive aria-invalid:border-destructive",
          "min-h-24 w-full rounded-md px-3 py-2",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
