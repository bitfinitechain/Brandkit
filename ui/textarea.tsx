import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A multi-line field. Adapted from shadcn/ui (MIT); the geometry matches Input
 * so the two sit together in a form without a seam.
 */
export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'flex min-h-16 w-full rounded-lg border border-border bg-panel2 px-3 py-2 text-sm text-foreground',
                'placeholder:text-muted-foreground field-sizing-content',
                'transition-[color,box-shadow] outline-none',
                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/30',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}
