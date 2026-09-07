'use client';

import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * Site navigation with dropdown panels. Adapted from shadcn/ui (MIT).
 *
 * Not the same thing as Sidebar, and not the same thing as a menu: this is for
 * a marketing-style header where a top-level item opens a panel of links.
 */
export function NavigationMenu({ className, children, viewport = true, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
    return (
        <NavigationMenuPrimitive.Root data-slot="navigation-menu"
            className={cn('relative flex max-w-max flex-1 items-center justify-center', className)} {...props}>
            {children}
            {viewport ? <NavigationMenuViewport /> : null}
        </NavigationMenuPrimitive.Root>
    );
}

export function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
    return <NavigationMenuPrimitive.List className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)} {...props} />;
}

export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuIndicator = NavigationMenuPrimitive.Indicator;

export const navigationMenuTriggerStyle = () =>
    'group inline-flex h-9 w-max items-center justify-center rounded-lg bg-transparent px-3 py-2 text-sm font-medium transition-colors hover:bg-accent focus:bg-accent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent';

export function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
    return (
        <NavigationMenuPrimitive.Trigger className={cn(navigationMenuTriggerStyle(), 'gap-1', className)} {...props}>
            {children}
            <ChevronDown className="relative top-px size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
        </NavigationMenuPrimitive.Trigger>
    );
}

export function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
    return (
        <NavigationMenuPrimitive.Content
            className={cn('left-0 top-0 w-full p-2 md:absolute md:w-auto', className)} {...props} />
    );
}

export function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
    return (
        <div className="absolute left-0 top-full flex justify-center">
            <NavigationMenuPrimitive.Viewport
                className={cn('relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]', className)}
                {...props} />
        </div>
    );
}

export function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
    return (
        <NavigationMenuPrimitive.Link
            className={cn('flex flex-col gap-1 rounded-md p-2 text-sm transition-colors hover:bg-accent focus:bg-accent focus:outline-none', className)}
            {...props} />
    );
}
