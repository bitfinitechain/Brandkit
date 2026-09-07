import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from './lib/cn';

/**
 * A row in a list: a leading glyph, a title with a description, a trailing bit.
 *
 * Adapted from shadcn/ui (MIT). It is the shape half our lists already are, and
 * having it named stops the next one being another hand-rolled flex row with
 * its own padding.
 */
export function Item({ asChild, className, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'div';
    return (
        <Comp data-slot="item"
              className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors', className)}
              {...props} />
    );
}

export function ItemMedia({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="item-media"
             className={cn('flex shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4', className)}
             {...props} />
    );
}

export function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="item-content" className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)} {...props} />;
}

export function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="item-title" className={cn('truncate font-medium text-foreground', className)} {...props} />;
}

export function ItemDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="item-description" className={cn('truncate text-muted-foreground', className)} {...props} />;
}

export function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="item-actions" className={cn('flex shrink-0 items-center gap-1.5', className)} {...props} />;
}
