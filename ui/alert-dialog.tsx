'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from './lib/cn';
import { buttonVariants } from './button';

/**
 * A modal that demands an answer. Adapted from shadcn/ui (MIT).
 *
 * Different from Dialog in the one way that matters: it cannot be dismissed by
 * clicking away or pressing Escape, and it is announced as alertdialog. Use it
 * for destructive confirmations and nothing else, because a modal you cannot
 * escape is a modal you resent.
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay data-slot="alert-dialog-overlay"
                                      className={cn('bfx-overlay fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]', className)}
                                      {...props} />
    );
}

export function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                data-slot="alert-dialog-content"
                className={cn(
                    'bfx-pop fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4',
                    'rounded-xl border border-border bg-card p-6 shadow-lg',
                    className,
                )}
                {...props}
            />
        </AlertDialogPortal>
    );
}

export function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="alert-dialog-header" className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div data-slot="alert-dialog-footer"
             className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
    );
}

export function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title data-slot="alert-dialog-title"
                                    className={cn('text-base font-semibold', className)} {...props} />
    );
}

export function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description data-slot="alert-dialog-description"
                                          className={cn('text-sm text-muted-foreground', className)} {...props} />
    );
}

export function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
    return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />;
}

export function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
    return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} {...props} />;
}
