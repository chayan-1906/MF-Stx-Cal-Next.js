import * as React from 'react';
import {Slot, Slottable} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';
import {Loader2} from 'lucide-react';

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer select-none",
    {
        variants: {
            variant: {
                default: "bg-primary dark:bg-primary-700 text-text-100 dark:text-text-900 hover:bg-primary/70 hover:text-text-100 dark:hover:text-text-900 shadow-xs",
                destructive: "bg-destructive dark:bg-destructive/60 hover:bg-destructive/90 dark:hover:bg-destructive/80 text-text-100 dark:text-text-900 shadow-xs",
                outline: "bg-background dark:bg-primary-700 hover:bg-primary text-text-100 dark:text-text-900 hover:text-text-100 dark:hover:text-text-900 border border-input dark:border-none shadow-xs",
                secondary: 'bg-gradient-to-r from-secondary to-secondary-600 dark:to-secondary-700 text-text-100 dark:text-text-900 hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
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
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {className, loading = false, children, disabled, variant, size, asChild = false, ...props},
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className={'mr-2 size-5 animate-spin text-text'}/>}
                <Slottable>{children}</Slottable>
            </Comp>
        );
    },
);
LoadingButton.displayName = 'LoadingButton';

export {LoadingButton, buttonVariants};
