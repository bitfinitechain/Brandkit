import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A key on a keyboard. Adapted from shadcn/ui (MIT).
 *
 * `<kbd>` is the right element and carries the meaning on its own, so this is
 * only the house treatment: mono, a hairline box, and a slightly raised ground
 * so it reads as a key rather than as code.
 */
export function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
    return (
        <kbd
            data-slot="kbd"
            className={cn(
                'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-panel2 px-1.5',
                'font-mono text-[11px] font-medium text-muted-foreground',
                className,
            )}
            {...props}
        />
    );
}
