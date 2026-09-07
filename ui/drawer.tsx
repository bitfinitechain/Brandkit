'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from './lib/cn';

/**
 * A sheet you can drag. Adapted from shadcn/ui (MIT), on vaul.
 *
 * Sheet is the desktop shape; this is the touch one, with a grab handle and a
 * drag-to-dismiss gesture. Pick by input, not by taste.
 */
export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export function DrawerOverlay({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
    return <DrawerPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-black/55', className)} {...props} />;
}

export function DrawerContent({ className, children, ...props }: React.ComponentProps<typeof DrawerPrimitive.Content>) {
    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                data-slot="drawer-content"
                className={cn(
                    'fixed z-50 flex h-auto flex-col border border-border bg-card',
                    'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:rounded-t-xl',
                    'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:rounded-b-xl',
                    'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm',
                    'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm',
                    className,
                )}
                {...props}
            >
                {/* The handle is what tells a thumb this is draggable. */}
                <div className="mx-auto mt-3 hidden h-1.5 w-16 shrink-0 rounded-pill bg-border group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
                {children}
            </DrawerPrimitive.Content>
        </DrawerPortal>
    );
}

export function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="drawer-header" className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />;
}
export function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="drawer-footer" className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}
export function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
    return <DrawerPrimitive.Title className={cn('text-base font-semibold', className)} {...props} />;
}
export function DrawerDescription({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Description>) {
    return <DrawerPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
