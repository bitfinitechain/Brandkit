'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from './lib/cn';

/** Sections that open one at a time. Adapted from shadcn/ui (MIT). */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('border-b border-border last:border-b-0', className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                className={cn('flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium',
                              'transition-all outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40',
                              'disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180', className)}
                {...props}
            >
                {children}
                <ChevronDown className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content className="bfx-accordion overflow-hidden text-sm" {...props}>
            <div className={cn('pb-4 pt-0 text-muted-foreground', className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}
