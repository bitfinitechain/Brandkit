'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

import { cn } from './lib/cn';
import { toggleVariants } from './toggle';

/**
 * Toggles that belong together. Adapted from shadcn/ui (MIT).
 *
 * The variant is set on the GROUP and read by the children through context, so
 * a group cannot end up half outlined. Upstream does the same; it is worth
 * keeping because it is the bit that stops the seams drifting.
 */
const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({ size: 'default', variant: 'default' });

export function ToggleGroup({
    className, variant, size, children, ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
    return (
        <ToggleGroupPrimitive.Root
            data-slot="toggle-group"
            className={cn('flex w-fit items-center rounded-lg', className)}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
    );
}

export function ToggleGroupItem({
    className, children, variant, size, ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) {
    const ctx = React.useContext(ToggleGroupContext);
    return (
        <ToggleGroupPrimitive.Item
            data-slot="toggle-group-item"
            className={cn(
                toggleVariants({ variant: ctx.variant ?? variant, size: ctx.size ?? size }),
                'min-w-0 flex-1 shrink-0 rounded-none first:rounded-l-lg last:rounded-r-lg',
                className,
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
}
