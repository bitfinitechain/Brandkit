import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * The platform's select.
 *
 * Adapted from shadcn/ui (MIT). Select in this kit is the styled listbox; this
 * is the native element with the house chrome on it, and it is the better
 * choice on touch, where the OS picker beats any custom menu.
 *
 * The chevron is drawn by the wrapper because appearance-none removes the one
 * the platform draws.
 */
export function NativeSelect({ className, children, ...props }: React.ComponentProps<'select'>) {
    return (
        <span data-slot="native-select" className="relative inline-flex w-full items-center">
            <select
                className={cn(
                    'h-9 w-full appearance-none rounded-lg border border-border bg-panel2 pl-3 pr-8 text-sm text-foreground',
                    'transition-[color,box-shadow] outline-none',
                    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40',
                    'aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 size-4 text-muted-foreground" />
        </span>
    );
}
