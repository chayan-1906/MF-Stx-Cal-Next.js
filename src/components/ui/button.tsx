import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva} from "class-variance-authority"
import {cn} from "@/lib/utils"
import {ButtonProps} from "@/types";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:border-destructive cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-primary-700 hover:bg-primary/95 text-primary-foreground hover:text-primary-foreground shadow-xs",
        destructive: "bg-destructive hover:bg-destructive/80 text-destructive-foreground shadow-xs",
        outline: "bg-background hover:bg-background/70 text-text-900 border border-input shadow-xs",
        secondary: 'bg-secondary bg-gradient-to-r from-secondary to-secondary-600 dark:to-secondary-700 text-secondary-foreground',
        ghost: "text-text-900 hover:text-text-800",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({className, variant, size, asChild = false, ...props}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
      <Comp data-slot="button" className={cn(buttonVariants({variant, size, className}))} {...props}/>
  );
}

export { Button, buttonVariants }
