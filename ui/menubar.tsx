'use client';

import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from './lib/cn';
import { menuContent, menuItem, menuItemIndented, menuLabel, menuSeparator, menuShortcut, menuIndicator } from './lib/menu-classes';

/** An application menu bar. Adapted from shadcn/ui (MIT). Same surface as the other menus. */
export const Menubar = ({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) => (
    <MenubarPrimitive.Root data-slot="menubar"
        className={cn('flex h-9 items-center gap-1 rounded-lg border border-border bg-card p-1', className)} {...props} />
);
export const MenubarMenu = MenubarPrimitive.Menu;
export const MenubarGroup = MenubarPrimitive.Group;
export const MenubarSub = MenubarPrimitive.Sub;
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

export function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
    return (
        <MenubarPrimitive.Trigger
            className={cn('flex select-none items-center rounded-md px-2 py-1 text-sm font-medium outline-none',
                          'focus:bg-accent data-[state=open]:bg-accent', className)}
            {...props} />
    );
}

export function MenubarContent({ className, align = 'start', sideOffset = 8, ...props }: React.ComponentProps<typeof MenubarPrimitive.Content>) {
    return (
        <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content align={align} sideOffset={sideOffset} className={cn(menuContent, className)} {...props} />
        </MenubarPrimitive.Portal>
    );
}

export function MenubarItem({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Item> & { inset?: boolean }) {
    return <MenubarPrimitive.Item className={cn(menuItem, inset && menuItemIndented, className)} {...props} />;
}
export function MenubarCheckboxItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
    return (
        <MenubarPrimitive.CheckboxItem className={cn(menuItem, menuItemIndented, className)} {...props}>
            <span className={menuIndicator}><MenubarPrimitive.ItemIndicator><Check className="size-4" /></MenubarPrimitive.ItemIndicator></span>
            {children}
        </MenubarPrimitive.CheckboxItem>
    );
}
export function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
    return (
        <MenubarPrimitive.RadioItem className={cn(menuItem, menuItemIndented, className)} {...props}>
            <span className={menuIndicator}><MenubarPrimitive.ItemIndicator><Circle className="size-2 fill-current" /></MenubarPrimitive.ItemIndicator></span>
            {children}
        </MenubarPrimitive.RadioItem>
    );
}
export function MenubarLabel({ className, inset, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label> & { inset?: boolean }) {
    return <MenubarPrimitive.Label className={cn(menuLabel, inset && menuItemIndented, className)} {...props} />;
}
export function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
    return <MenubarPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}
export function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
    return <span className={cn(menuShortcut, className)} {...props} />;
}
export function MenubarSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { inset?: boolean }) {
    return (
        <MenubarPrimitive.SubTrigger className={cn(menuItem, 'data-[state=open]:bg-accent', inset && menuItemIndented, className)} {...props}>
            {children}<ChevronRight className="ml-auto size-4" />
        </MenubarPrimitive.SubTrigger>
    );
}
export function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
    return <MenubarPrimitive.SubContent className={cn(menuContent, className)} {...props} />;
}
