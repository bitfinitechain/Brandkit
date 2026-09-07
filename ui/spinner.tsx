import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A busy indicator.
 *
 * Adapted from shadcn/ui (MIT). Deviations from upstream:
 *
 *  1. It carries its own accessible name. A bare spinning glyph tells a screen
 *     reader nothing, and every hand-rolled copy in our apps was an unlabelled
 *     `animate-spin` div. `label` is announced politely; pass null only when a
 *     neighbouring live region already says "loading".
 *  2. Under prefers-reduced-motion it stops spinning and stays visible, rather
 *     than disappearing: the fact that something is in progress is not decoration.
 */
export interface SpinnerProps extends React.ComponentProps<'span'> {
    /** Diameter in px. Matches the text it sits beside; 16 is the default. */
    size?: number;
    /** Announced to a screen reader. Pass null when something else already says it. */
    label?: string | null;
}

export function Spinner({ size = 16, label = 'Loading', className, ...props }: SpinnerProps) {
    return (
        <span
            data-slot="spinner"
            role={label ? 'status' : undefined}
            aria-live={label ? 'polite' : undefined}
            className={cn('inline-flex shrink-0 items-center justify-center align-middle text-current', className)}
            {...props}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="bfx-spinner">
                {/* The track, then the arc. Two strokes rather than a dashed circle
                    so the arc keeps a constant weight at any size. */}
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {label ? <span className="sr-only">{label}</span> : null}
        </span>
    );
}
