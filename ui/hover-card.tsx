'use client';

import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

import { cn } from './lib/cn';

/**
 * A preview that opens on hover. Adapted from shadcn/ui (MIT).
 *
 * Pointer only, by nature: it never opens on touch and it is not focusable, so
 * whatever it shows must be a PREVIEW of something reachable another way, never
 * the only place a fact appears. Use Hint or Tooltip for an explanation.
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export function HoverCardContent({ className, align = 'center', sideOffset = 4, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
    return (
        <HoverCardPrimitive.Portal>
            <HoverCardPrimitive.Content
                data-slot="hover-card-content" align={align} sideOffset={sideOffset}
                className={cn('bfx-pop z-50 w-64 rounded-lg border border-border bg-card p-4 text-sm shadow-lg outline-none', className)}
                {...props} />
        </HoverCardPrimitive.Portal>
    );
}
