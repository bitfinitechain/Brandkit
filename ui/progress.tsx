import * as React from 'react';

import { cn } from './lib/cn';
import { chartToneClass, type ChartTone } from './sparkline';

/**
 * A determinate progress bar.
 *
 * Adapted from shadcn/ui (MIT), without the Radix dependency: this is a div, a
 * fill and three ARIA attributes, and Radix adds nothing a bar needs.
 *
 * Deviations from upstream:
 *
 *  1. Tones, shared with the charts, so a bar and a sparkline that mean the same
 *     thing are the same colour.
 *  2. `indeterminate` for "working, length unknown". Three apps had a bar with a
 *     made-up percentage in exactly that case, which is a number the reader has
 *     no reason to doubt and no way to check.
 *  3. It sets aria-valuenow / min / max. Every hand-rolled copy was a bare div,
 *     which is invisible to a screen reader.
 */
export interface ProgressProps extends React.ComponentProps<'div'> {
    /** 0..100. Ignored when indeterminate. */
    value?: number;
    tone?: ChartTone;
    /** Bar height in px. Default 6. */
    height?: number;
    /** Working, but the length is not known. */
    indeterminate?: boolean;
    /** What is progressing. Required for a screen reader to say anything useful. */
    label?: string;
}

export function Progress({
    value = 0, tone = 'accent', height = 6, indeterminate, label, className, ...props
}: ProgressProps) {
    const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    return (
        <div
            data-slot="progress"
            role="progressbar"
            aria-label={label}
            aria-valuemin={indeterminate ? undefined : 0}
            aria-valuemax={indeterminate ? undefined : 100}
            aria-valuenow={indeterminate ? undefined : Math.round(pct)}
            className={cn('w-full overflow-hidden rounded-pill bg-track', chartToneClass[tone], className)}
            style={{ height }}
            {...props}
        >
            <div
                data-slot="progress-fill"
                className={cn('h-full rounded-pill bg-current',
                              indeterminate ? 'bfx-progress-indeterminate w-2/5' : 'transition-[width] duration-200')}
                style={indeterminate ? undefined : { width: `${pct}%` }}
            />
        </div>
    );
}
