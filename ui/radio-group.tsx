'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * One of several. Adapted from shadcn/ui (MIT).
 *
 * Radix here rather than native inputs, unlike Checkbox: a radio GROUP has
 * roving-tabindex behaviour (one tab stop, arrows to move) that native radios
 * only get when they share a name and a form, and that is easy to get wrong.
 */
export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-2.5', className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            data-slot="radio-group-item"
            className={cn(
                'aspect-square size-4 shrink-0 rounded-full border border-border bg-card text-primary outline-none',
                'transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/40',
                'data-[state=checked]:border-primary disabled:cursor-not-allowed disabled:opacity-50', className)}
            {...props}
        >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle className="size-2 fill-primary text-primary" />
            </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
    );
}
