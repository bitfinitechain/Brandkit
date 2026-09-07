import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A form label.
 *
 * Adapted from shadcn/ui (MIT), without the Radix dependency: `<label htmlFor>`
 * is already the platform's answer and Radix's version adds only a click
 * forwarder for non-native controls.
 *
 * `peer-disabled` styling is kept from upstream, which is the part worth having:
 * a label that stays black above a greyed-out field reads as enabled.
 */
export function Label({ className, ...props }: React.ComponentProps<'label'>) {
    return (
        <label
            data-slot="label"
            className={cn(
                'flex select-none items-center gap-2 text-sm font-medium leading-none text-foreground',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className,
            )}
            {...props}
        />
    );
}
