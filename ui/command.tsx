'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from './lib/cn';
import { Dialog, DialogContent } from './dialog';
import { menuContent, menuItem, menuLabel, menuSeparator, menuShortcut } from './lib/menu-classes';

/** A searchable command palette. Adapted from shadcn/ui (MIT), on cmdk. */
export function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive data-slot="command"
            className={cn('flex size-full flex-col overflow-hidden rounded-lg bg-card text-foreground', className)}
            {...props} />
    );
}

/** The palette in a modal, which is how it is nearly always used. */
export function CommandDialog({ children, title = 'Command palette', description = 'Search for a command to run', ...props }: React.ComponentProps<typeof Dialog> & { title?: string; description?: string }) {
    return (
        <Dialog {...props}>
            <DialogContent className="overflow-hidden p-0" showClose={false} aria-label={title} aria-description={description}>
                <Command className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:border-border">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

export function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
    return (
        <div data-slot="command-input-wrapper" cmdk-input-wrapper="" className="flex h-11 items-center gap-2 px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <CommandPrimitive.Input
                className={cn('flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50', className)}
                {...props} />
        </div>
    );
}

export function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
    return <CommandPrimitive.List className={cn('max-h-80 scroll-py-1 overflow-y-auto overflow-x-hidden p-1', className)} {...props} />;
}

export function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground" {...props} />;
}

export function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return <CommandPrimitive.Group className={cn('overflow-hidden text-foreground [&_[cmdk-group-heading]]:' + menuLabel.replace(/ /g, ' [&_[cmdk-group-heading]]:'), className)} {...props} />;
}

export function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            className={cn(menuItem, 'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground', className)}
            {...props} />
    );
}

export function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return <CommandPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}

export function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return <span className={cn(menuShortcut, className)} {...props} />;
}

export { menuContent as commandContentClass };
