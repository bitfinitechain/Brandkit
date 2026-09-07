'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { cn } from './lib/cn';

/**
 * A scrolling box with a styled bar. Adapted from shadcn/ui (MIT).
 *
 * Worth saying when NOT to use it: a plain `overflow-y-auto` is lighter and
 * keeps the platform's own scrollbar, which is what most of our panels want.
 * This is for the cases where the native bar is genuinely in the way, such as a
 * short menu where a full-width bar eats the padding.
 */
export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
    return (
        <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn('relative overflow-hidden', className)} {...props}>
            <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}

export function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={cn('flex touch-none select-none p-px transition-colors',
                          orientation === 'vertical' ? 'h-full w-2.5 border-l border-l-transparent' : 'h-2.5 flex-col border-t border-t-transparent',
                          className)}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-pill bg-border" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}
