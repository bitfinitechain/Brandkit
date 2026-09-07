import * as React from 'react';

import { cn } from './lib/cn';

/**
 * An on/off switch.
 *
 * Adapted from shadcn/ui (MIT), as a BUTTON rather than a Radix primitive.
 * `role="switch"` with `aria-checked` is exactly what the pattern is, and a
 * button gives keyboard support, focus and activation without a package.
 *
 * A switch takes effect IMMEDIATELY; that is what separates it from a checkbox,
 * which is a value you submit later. Use a checkbox in a form.
 */
export interface SwitchProps extends Omit<React.ComponentProps<'button'>, 'onChange' | 'value'> {
    checked: boolean;
    onCheckedChange?: (checked: boolean) => void;
    /** Required: a switch with no name is an unlabelled toggle. */
    label: string;
}

export function Switch({ checked, onCheckedChange, label, className, disabled, ...props }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            title={label}
            disabled={disabled}
            data-slot="switch"
            onClick={() => onCheckedChange?.(!checked)}
            className={cn(
                'inline-flex h-5 w-9 shrink-0 items-center rounded-pill border border-transparent p-0.5',
                'transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
                checked ? 'bg-primary' : 'bg-track',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span
                aria-hidden="true"
                className={cn('size-4 rounded-full bg-background shadow-sm transition-transform',
                              checked ? 'translate-x-4' : 'translate-x-0')}
            />
        </button>
    );
}
