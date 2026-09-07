'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * A panel that slides in from an edge. Adapted from shadcn/ui (MIT).
 *
 * It is Dialog with a different geometry, which is exactly how upstream builds
 * it: same focus trap, same inert background, same Escape. The `side` prop is
 * the whole difference.
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

const sides = {
    top: 'inset-x-0 top-0 border-b bfx-sheet--top',
    bottom: 'inset-x-0 bottom-0 border-t bfx-sheet--bottom',
    left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm bfx-sheet--left',
    right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm bfx-sheet--right',
} as const;

export function SheetContent({
    className, children, side = 'right', showClose = true, ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: keyof typeof sides; showClose?: boolean }) {
    return (
        <SheetPortal>
            <SheetPrimitive.Overlay data-slot="sheet-overlay"
                                    className="bfx-overlay fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]" />
            <SheetPrimitive.Content
                data-slot="sheet-content"
                className={cn('fixed z-50 flex flex-col gap-4 border-border bg-card p-6 shadow-lg', sides[side], className)}
                {...props}
            >
                {children}
                {showClose ? (
                    <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
                        <X className="size-4" />
                        <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                ) : null}
            </SheetPrimitive.Content>
        </SheetPortal>
    );
}

export function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sheet-header" className={cn('flex flex-col gap-1.5', className)} {...props} />;
}
export function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="sheet-footer" className={cn('mt-auto flex flex-col gap-2', className)} {...props} />;
}
export function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
    return <SheetPrimitive.Title className={cn('text-base font-semibold', className)} {...props} />;
}
export function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
    return <SheetPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
