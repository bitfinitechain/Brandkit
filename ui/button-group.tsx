import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/cn';

/**
 * Buttons that act as one control. Adapted from shadcn/ui (MIT).
 *
 * The group owns the corners and the shared borders so the children do not have
 * to know they are in a group, which is what every hand-rolled toolbar gets
 * wrong: it rounds each button and leaves a double hairline down the seams.
 */
const buttonGroupVariants = cva(
    'flex w-fit items-stretch [&>*]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*:focus-visible]:z-10',
    {
        variants: {
            orientation: {
                horizontal: 'flex-row [&>*:not(:first-child)]:-ml-px',
                vertical:
                    'flex-col [&>*:not(:first-child)]:-mt-px [&>*:first-child]:rounded-t-lg [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-b-lg [&>*:last-child]:rounded-t-none',
            },
        },
        defaultVariants: { orientation: 'horizontal' },
    },
);

export interface ButtonGroupProps extends React.ComponentProps<'div'>, VariantProps<typeof buttonGroupVariants> {}

export function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
    return (
        <div data-slot="button-group" role="group"
             className={cn(buttonGroupVariants({ orientation }), className)} {...props} />
    );
}

/** A non-interactive label wedged into the group, for a unit or a prefix. */
export function ButtonGroupText({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="button-group-text"
             className={cn('flex items-center gap-2 border border-border bg-panel2 px-3 text-sm text-muted-foreground', className)}
             {...props} />
    );
}

export { buttonGroupVariants };
