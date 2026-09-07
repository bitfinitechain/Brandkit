'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from './lib/cn';
import { menuContent, menuItem, menuItemDestructive, menuItemIndented, menuLabel, menuSeparator, menuShortcut, menuIndicator } from './lib/menu-classes';

/**
 * The right-click menu. Adapted from shadcn/ui (MIT).
 *
 * Same surface as DropdownMenu by construction, different trigger. Remember it
 * is unreachable on touch and by keyboard alone, so whatever it offers must
 * also be reachable somewhere else.
 */
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content className={cn(menuContent, className)} {...props} />
        </ContextMenuPrimitive.Portal>
    );
}

export function ContextMenuItem({ className, inset, variant, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { inset?: boolean; variant?: 'default' | 'destructive' }) {
    return (
        <ContextMenuPrimitive.Item
            className={cn(menuItem, inset && menuItemIndented, variant === 'destructive' && menuItemDestructive, className)}
            {...props} />
    );
}

export function ContextMenuCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
    return (
        <ContextMenuPrimitive.CheckboxItem className={cn(menuItem, menuItemIndented, className)} {...props}>
            <span className={menuIndicator}>
                <ContextMenuPrimitive.ItemIndicator><Check className="size-4" /></ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    );
}

export function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    return (
        <ContextMenuPrimitive.RadioItem className={cn(menuItem, menuItemIndented, className)} {...props}>
            <span className={menuIndicator}>
                <ContextMenuPrimitive.ItemIndicator><Circle className="size-2 fill-current" /></ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    );
}

export function ContextMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Label> & { inset?: boolean }) {
    return <ContextMenuPrimitive.Label className={cn(menuLabel, inset && menuItemIndented, className)} {...props} />;
}
export function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return <ContextMenuPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}
export function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return <span className={cn(menuShortcut, className)} {...props} />;
}
export function ContextMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & { inset?: boolean }) {
    return (
        <ContextMenuPrimitive.SubTrigger className={cn(menuItem, 'data-[state=open]:bg-accent', inset && menuItemIndented, className)} {...props}>
            {children}
            <ChevronRight className="ml-auto size-4" />
        </ContextMenuPrimitive.SubTrigger>
    );
}
export function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    return <ContextMenuPrimitive.SubContent className={cn(menuContent, className)} {...props} />;
}
