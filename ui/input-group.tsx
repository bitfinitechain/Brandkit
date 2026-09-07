import * as React from 'react';

import { cn } from './lib/cn';

/**
 * An input with something attached: a prefix, a unit, a button.
 *
 * Adapted from shadcn/ui (MIT). The group carries the border and the focus
 * ring, and the input inside gives both up, so the whole thing lights up as one
 * control instead of drawing a ring around the middle of itself.
 */
export function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-group"
            className={cn(
                'flex w-full items-center gap-2 rounded-lg border border-border bg-panel2 px-3',
                'transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/40',
                'has-[input[aria-invalid=true]]:border-destructive',
                // The input inside surrenders its own chrome to the group.
                '[&_input]:h-9 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-0 [&_input]:shadow-none [&_input]:outline-none [&_input]:focus-visible:ring-0',
                className,
            )}
            {...props}
        />
    );
}

/** Text or an icon pinned inside the group. Never focusable: it is not a control. */
export function InputGroupAddon({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span data-slot="input-group-addon"
              className={cn('flex shrink-0 select-none items-center gap-1.5 text-sm text-muted-foreground [&>svg]:size-4', className)}
              {...props} />
    );
}
