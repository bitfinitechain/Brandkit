import * as React from 'react';

import { cn } from './lib/cn';

/**
 * The loading state, as a shape.
 *
 * Adapted from shadcn/ui (MIT). Deviations from upstream:
 *
 *  1. The pulse is a SHEEN that travels, not an opacity throb. A throbbing block
 *     is hard to tell from a disabled one, and three of our apps had already
 *     drifted to their own version of a moving highlight.
 *  2. It drops entirely under prefers-reduced-motion rather than shortening.
 *     A skeleton is decoration around a wait; nobody needs it to move.
 *
 * The guidelines require three states on every async surface, and this is the
 * first: a skeleton must MIRROR the anatomy it replaces, so give it the width
 * and height of the thing that is coming, not a generic grey box.
 */
export interface SkeletonProps extends React.ComponentProps<'div'> {
    /** Draw it as a circle, for an avatar or a status dot. */
    circle?: boolean;
}

export function Skeleton({ circle, className, ...props }: SkeletonProps) {
    return (
        <div
            data-slot="skeleton"
            aria-hidden="true"
            className={cn('bfx-skeleton bg-muted', circle ? 'rounded-full' : 'rounded-md', className)}
            {...props}
        />
    );
}

/**
 * A block of skeleton lines, for paragraph-shaped content.
 *
 * The last line is short, because real text does not end flush.
 */
export function SkeletonText({ lines = 3, className, ...props }: React.ComponentProps<'div'> & { lines?: number }) {
    return (
        <div data-slot="skeleton-text" className={cn('flex flex-col gap-2', className)} {...props}>
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton key={i} className={cn('h-3.5', i === lines - 1 && 'w-3/5')} />
            ))}
        </div>
    );
}
