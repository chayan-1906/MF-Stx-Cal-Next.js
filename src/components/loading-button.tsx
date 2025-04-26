import * as React from 'react';
import {Slot, Slottable} from '@radix-ui/react-slot';
import {cn} from '@/lib/utils';
import {Loader2} from 'lucide-react';
import {buttonVariants} from "@/components/ui/button";
import {ButtonProps} from "@/types";

/*const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer select-none",
    {
        variants: {
            variant: {
                default: "bg-primary dark:bg-primary-700 text-text-100 dark:text-text-900 hover:bg-primary/90 hover:text-text-100 dark:hover:text-text-900 shadow-xs",
                destructive: "bg-destructive hover:bg-destructive/80 text-text-100 dark:text-text-900 shadow-xs",
                outline: "bg-background hover:bg-primary text-text-900 hover:text-text-100 dark:hover:text-text-900 border border-input dark:border-none shadow-xs",
                secondary: 'bg-secondary bg-gradient-to-r from-secondary to-secondary-600 dark:to-secondary-700 text-text-100 dark:text-text-900',
                ghost: "hover:text-text-800",
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'size-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);*/

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, loading = false, children, disabled, variant, size, asChild = false, ...props}, ref,) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))} ref={ref} disabled={loading || disabled}{...props}>
                {loading && <Loader2 className={'size-5 animate-spin text-foreground'}/>}
                <Slottable>{children}</Slottable>
            </Comp>
        );
    },
)
LoadingButton.displayName = 'LoadingButton';

export {LoadingButton};
