import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A checkbox.
 *
 * Adapted from shadcn/ui (MIT), but built on the NATIVE input rather than Radix.
 * That is a deliberate departure and worth the sentence: Radix's version exists
 * to allow a fully custom box, and the price is a package plus a hidden input
 * plus a controlled/uncontrolled contract. A native checkbox is keyboard
 * accessible, announces its own state, participates in a form, and supports the
 * indeterminate flag for free. The only thing it does not give you is the tick,
 * and `appearance-none` plus a background mask buys that back.
 *
 * `indeterminate` is a DOM property, not an attribute, so it has to be set on
 * the element; the ref effect below is the whole reason this is not one line.
 */
export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
    indeterminate?: boolean;
}

export function Checkbox({ indeterminate, className, ref, ...props }: CheckboxProps) {
    const inner = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inner.current as HTMLInputElement);
    React.useEffect(() => {
        if (inner.current) inner.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
        <input
            ref={inner}
            type="checkbox"
            data-slot="checkbox"
            className={cn(
                'peer size-4 shrink-0 appearance-none rounded-[4px] border border-border bg-card',
                'transition-[background-color,border-color,box-shadow]',
                'checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary',
                // The tick and the dash, drawn as masks so they inherit the fill
                // and stay crisp at any zoom.
                'bg-center bg-no-repeat checked:bg-[length:12px] indeterminate:bg-[length:10px]',
                'checked:bg-[image:var(--bfx-tick)] indeterminate:bg-[image:var(--bfx-dash)]',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}
