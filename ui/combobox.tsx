'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from './lib/cn';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';

/**
 * A select you can type into.
 *
 * shadcn documents Combobox as a RECIPE rather than a component: popover plus
 * command, assembled by hand at each call site. Shipping the assembly is the
 * point of a design system, so this is the recipe with a props API, and the
 * parts are still exported if a caller needs to build something else.
 */
export interface ComboboxOption { value: string; label: string; disabled?: boolean }

export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    /** Text in the search box. */
    searchPlaceholder?: string;
    /** Shown when nothing matches. Say what would match, not just "no results". */
    empty?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export function Combobox({
    options, value, onValueChange, placeholder = 'Select…',
    searchPlaceholder = 'Search…', empty = 'Nothing matches that.', disabled, className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const selected = options.find((o) => o.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled}
                        className={cn('w-full justify-between font-normal', !selected && 'text-muted-foreground', className)}>
                    {selected?.label ?? placeholder}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{empty}</CommandEmpty>
                        <CommandGroup>
                            {options.map((o) => (
                                <CommandItem
                                    key={o.value}
                                    value={o.label}
                                    disabled={o.disabled}
                                    onSelect={() => { onValueChange?.(o.value); setOpen(false); }}
                                >
                                    <Check className={cn('size-4', o.value === value ? 'opacity-100' : 'opacity-0')} />
                                    {o.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
