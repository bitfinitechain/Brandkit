'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from './lib/cn';

/** A range control. Adapted from shadcn/ui (MIT). Supports one thumb or two. */
export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
    // One thumb per value, so a range slider gets two without the caller asking.
    const count = Array.isArray(props.value ?? props.defaultValue) ? (props.value ?? props.defaultValue as number[]).length : 1;
    return (
        <SliderPrimitive.Root
            data-slot="slider"
            className={cn('relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50', className)}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-pill bg-track">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            {Array.from({ length: count }, (_, i) => (
                <SliderPrimitive.Thumb
                    key={i}
                    className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none"
                />
            ))}
        </SliderPrimitive.Root>
    );
}
