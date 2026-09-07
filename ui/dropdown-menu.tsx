'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from './lib/cn';
import { menuContent, menuItem, menuItemDestructive, menuItemIndented, menuLabel, menuSeparator, menuShortcut, menuIndicator } from './lib/menu-classes';

/**
 * A menu hung off a button. Adapted from shadcn/ui (MIT).
 *
 * Classes come from lib/menu-classes so this, ContextMenu and Menubar cannot
 * drift into three different menus.
 */
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset}
                                           className={cn(menuContent, className)} {...props} />
        </DropdownMenuPrimitive.Portal>
    );
}

export function DropdownMenuItem({ className, inset, variant, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean; variant?: 'default' | 'destructive' }) {
    return (
        <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item"
            className={cn(menuItem, inset && menuItemIndented, variant === 'destructive' && menuItemDestructive, className)}
            {...props} />
    );
}

export function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
    return (
        <DropdownMenuPrimitive.CheckboxItem className={cn(menuItem, menuItemIndented, className)} checked={checked} {...props}>
            <span className={menuIndicator}>
                <DropdownMenuPrimitive.ItemIndicator><Check className="size-4" /></DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

export function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
    return (
        <DropdownMenuPrimitive.RadioItem className={cn(menuItem, menuItemIndented, className)} {...props}>
            <span className={menuIndicator}>
                <DropdownMenuPrimitive.ItemIndicator><Circle className="size-2 fill-current" /></DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

export function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
    return <DropdownMenuPrimitive.Label className={cn(menuLabel, inset && menuItemIndented, className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    return <DropdownMenuPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}

export function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return <span className={cn(menuShortcut, className)} {...props} />;
}

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) {
    return (
        <DropdownMenuPrimitive.SubTrigger className={cn(menuItem, 'data-[state=open]:bg-accent', inset && menuItemIndented, className)} {...props}>
            {children}
            <ChevronRight className="ml-auto size-4" />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

export function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    return <DropdownMenuPrimitive.SubContent className={cn(menuContent, className)} {...props} />;
}
