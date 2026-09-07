'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from './lib/cn';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * A date, chosen from a calendar.
 *
 * shadcn documents this as a RECIPE (popover plus calendar) rather than a
 * component. Shipping the assembly is the point of a design system, so this is
 * the recipe with a props API; the parts stay exported for anything else.
 *
 * The button shows the date in a stated format rather than toLocaleDateString,
 * because a locale-formatted date rendered on the server and again in the
 * browser is the classic hydration mismatch this platform has already paid for.
 */
export interface DatePickerProps {
    value?: Date;
    onValueChange?: (date: Date | undefined) => void;
    placeholder?: string;
    /** date-fns format. Default "d MMM yyyy", which is unambiguous everywhere. */
    dateFormat?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    value, onValueChange, placeholder = 'Pick a date', dateFormat = 'd MMM yyyy', disabled, className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" disabled={disabled}
                        className={cn('w-full justify-start gap-2 font-normal', !value && 'text-muted-foreground', className)}>
                    <CalendarIcon className="size-4" />
                    {value ? format(value, dateFormat) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(d) => { onValueChange?.(d); setOpen(false); }}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
