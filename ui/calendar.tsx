'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from './lib/cn';
import { buttonVariants } from './button';

/**
 * A month grid. Adapted from shadcn/ui (MIT), on react-day-picker.
 *
 * A calendar is a real table of buttons with roving focus and a live-announced
 * month, which is why this is a library rather than a grid of divs.
 */
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-4',
                month: 'flex flex-col gap-4',
                caption_label: 'text-sm font-medium',
                nav: 'flex items-center gap-1',
                button_previous: cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-7'),
                button_next: cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-7'),
                month_grid: 'w-full border-collapse',
                weekdays: 'flex',
                weekday: 'w-8 rounded-md text-[11px] font-normal text-muted-foreground',
                week: 'flex w-full mt-1',
                day: 'relative p-0 text-center text-sm',
                day_button: cn(buttonVariants({ variant: 'ghost' }), 'size-8 p-0 font-normal aria-selected:opacity-100'),
                selected: 'bg-primary text-primary-foreground rounded-md',
                today: 'bg-accent text-accent-foreground rounded-md',
                outside: 'text-muted-foreground opacity-50',
                disabled: 'text-muted-foreground opacity-50',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...rest }) =>
                    orientation === 'left'
                        ? <ChevronLeft className="size-4" {...rest} />
                        : <ChevronRight className="size-4" {...rest} />,
            }}
            {...props}
        />
    );
}
