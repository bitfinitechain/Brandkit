import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A rule between things.
 *
 * Adapted from shadcn/ui (MIT), without the Radix dependency: a separator is a
 * div with a border and one ARIA role, and pulling in a package for that is not
 * a trade worth making.
 *
 * Decorative by default, which is the honest reading for most rules: they group
 * visually and add nothing to the reading order. Set `decorative={false}` only
 * when the rule genuinely separates two SECTIONS a screen reader should be told
 * about.
 */
export interface SeparatorProps extends React.ComponentProps<'div'> {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
}

export function Separator({
    orientation = 'horizontal', decorative = true, className, ...props
}: SeparatorProps) {
    return (
        <div
            data-slot="separator"
            role={decorative ? 'none' : 'separator'}
            aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
            className={cn('shrink-0 bg-border',
                          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
            {...props}
        />
    );
}
