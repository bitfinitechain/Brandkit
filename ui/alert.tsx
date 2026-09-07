import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/cn';

/**
 * A message about the page, not about a field.
 *
 * Adapted from shadcn/ui (MIT). Deviations from upstream:
 *
 *  1. The four ops tones (ok / warn / bad / accent) replace upstream's lone
 *     `destructive`, and each is a tinted box with a matching hairline rather
 *     than tinted text on the page ground. Three apps had built the same tinted
 *     box by hand with three different mixes.
 *  2. The role follows the tone. `bad` and `warn` are `alert`, which interrupts;
 *     everything else is `status`, which does not. A success note that seizes a
 *     screen reader mid-sentence is a bug, and upstream leaves the choice to the
 *     caller, which means it gets left at the default.
 *
 * Status is never colour alone: pass an `icon`, and the title carries the word.
 */
const alertVariants = cva(
    'relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5',
    {
        variants: {
            variant: {
                default: 'border-border bg-card text-foreground',
                accent: 'border-primary/40 bg-primary/8 text-foreground [&>svg]:text-primary',
                ok: 'border-success/40 bg-success/8 text-foreground [&>svg]:text-success',
                warn: 'border-warning/45 bg-warning/10 text-foreground [&>svg]:text-warning',
                bad: 'border-destructive/45 bg-destructive/8 text-foreground [&>svg]:text-destructive',
            },
        },
        defaultVariants: { variant: 'default' },
    },
);

export interface AlertProps extends React.ComponentProps<'div'>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, role, ...props }: AlertProps) {
    // Interrupt only for the two tones that are actually urgent.
    const implied = variant === 'bad' || variant === 'warn' ? 'alert' : 'status';
    return (
        <div data-slot="alert" role={role ?? implied} className={cn(alertVariants({ variant }), className)} {...props} />
    );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="alert-title"
             className={cn('col-start-2 min-h-4 font-medium tracking-tight', className)} {...props} />
    );
}

export function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="alert-description"
             className={cn('col-start-2 grid justify-items-start gap-1 text-sm leading-relaxed text-muted-foreground', className)}
             {...props} />
    );
}

export { alertVariants };
