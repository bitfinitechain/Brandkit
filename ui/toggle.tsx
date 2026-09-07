'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/cn';

/**
 * A button that stays pressed. Adapted from shadcn/ui (MIT).
 *
 * Different from Switch: a toggle is a formatting-style control that applies
 * immediately and reads as a button, and it is announced with aria-pressed
 * rather than as a switch.
 */
const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors outline-none ' +
    'hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 ' +
    'disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground ' +
    '[&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: { default: 'bg-transparent', outline: 'border border-border bg-transparent' },
            size: { default: 'h-9 min-w-9 px-2', sm: 'h-8 min-w-8 px-1.5', lg: 'h-10 min-w-10 px-2.5' },
        },
        defaultVariants: { variant: 'default', size: 'default' },
    },
);

export interface ToggleProps
    extends React.ComponentProps<typeof TogglePrimitive.Root>, VariantProps<typeof toggleVariants> {}

export function Toggle({ className, variant, size, ...props }: ToggleProps) {
    return <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size }), className)} {...props} />;
}

export { toggleVariants };
