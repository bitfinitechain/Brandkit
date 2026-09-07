'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from './lib/cn';

/**
 * Tabs. Adapted from shadcn/ui (MIT).
 *
 * These are REAL ARIA tabs: one panel visible, arrow keys move between them.
 * In-page section switching that is really navigation should be links, not
 * this. The analytics chain breadcrumb is the example of the difference.
 */
export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />;
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List data-slot="tabs-list"
            className={cn('inline-flex w-fit items-center justify-center gap-1 rounded-lg border border-border bg-panel2 p-1', className)}
            {...props} />
    );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger data-slot="tabs-trigger"
            className={cn(
                'inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium',
                'text-muted-foreground transition-colors outline-none',
                'data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                'focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50',
                '[&_svg]:size-4', className)}
            {...props} />
    );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}
