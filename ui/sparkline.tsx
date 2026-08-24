import * as React from 'react';

import { cn } from './lib/cn';

// A 120x32 trend line with a dot on the latest point.
//
// Three apps had grown their own — explorer's Sparkline, analytics' charts.ts and
// the pep tenant's copy — with different stroke widths and no shared idea of what
// a tone meant. This is the one shape.
//
// Colour comes from `currentColor` via a text-* class rather than a hex prop, so
// the line follows the theme and the token bridge like every other component here.
export type ChartTone = 'accent' | 'ok' | 'warn' | 'bad' | 'muted';

export const chartToneClass: Record<ChartTone, string> = {
    accent: 'text-primary',
    ok: 'text-success',
    warn: 'text-warning',
    bad: 'text-destructive',
    muted: 'text-muted-foreground',
};

const W = 120;
const H = 32;
const PAD = 3; // keeps the 2px stroke and the r2.5 dot inside the box

export interface SparklineProps extends React.ComponentProps<'span'> {
    data: number[];
    tone?: ChartTone;
    /** Draw the dot on the last point. Off for dense table cells. */
    showLast?: boolean;
}

export function Sparkline({ data, tone = 'accent', showLast = true, className, ...props }: SparklineProps) {
    const pts = React.useMemo(() => {
        if (!data || data.length === 0) return [];
        const lo = Math.min(...data);
        const hi = Math.max(...data);
        // A flat series has no range to normalise against; dividing by zero would
        // put every point at NaN and render nothing at all. Draw it down the middle.
        const span = hi - lo || 1;
        const stepX = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0;
        return data.map((v, i) => [
            PAD + i * stepX,
            hi === lo ? H / 2 : H - PAD - ((v - lo) / span) * (H - PAD * 2),
        ] as const);
    }, [data]);

    if (pts.length === 0) return null;

    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    const [lx, ly] = pts[pts.length - 1];

    return (
        <span
            className={cn('inline-block h-8 w-[120px] align-middle', chartToneClass[tone], className)}
            {...props}
        >
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-full w-full" aria-hidden="true">
                <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {showLast ? <circle cx={lx} cy={ly} r={2.5} fill="currentColor" /> : null}
            </svg>
        </span>
    );
}

export default Sparkline;
