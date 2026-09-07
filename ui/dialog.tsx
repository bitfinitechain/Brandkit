'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * A modal. Adapted from shadcn/ui (MIT).
 *
 * Radix earns its place here in a way it does not for a checkbox: a modal has
 * to trap focus, restore it on close, mark the rest of the page inert and close
 * on Escape. That is the part hand-rolled modals get wrong, every time.
 *
 * The overlay and content animate through data-state, and both drop under
 * prefers-reduced-motion via the kit's stylesheet.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn('bfx-overlay fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]', className)}
            {...props}
        />
    );
}

export function DialogContent({
    className, children, showClose = true, ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    'bfx-pop fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4',
                    'rounded-xl border border-border bg-card p-6 shadow-lg',
                    className,
                )}
                {...props}
            >
                {children}
                {showClose ? (
                    <DialogPrimitive.Close
                        className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                    >
                        <X className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                ) : null}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="dialog-footer"
             className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
    );
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title data-slot="dialog-title"
                               className={cn('text-base font-semibold leading-none', className)} {...props} />
    );
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description data-slot="dialog-description"
                                     className={cn('text-sm text-muted-foreground', className)} {...props} />
    );
}
