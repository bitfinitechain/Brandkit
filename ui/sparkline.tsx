import * as React from 'react';

import { cn } from './lib/cn';

// A trend line with a dot on the latest point: 120x32 by default, or the
// width of its container with `fill`.
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
    /**
     * Stretch to the container's width instead of the fixed 120px box.
     *
     * The reason the apps kept writing their own: a sparkline under a KPI or
     * beside a column wants the width it is given, and a fixed box cannot take
     * it. See the aspect note on the svg below for why filling is safe here.
     */
    fill?: boolean;
    /** Box height in px. Default 32. */
    height?: number;
    /**
     * What it plots.
     *
     * Given, the sparkline stops being decorative: it takes an accessible name
     * and a hover readout naming the range. Without it the chart is aria-hidden,
     * which is right when the number beside it already says everything.
     */
    label?: string;
}

export function Sparkline({
    data, tone = 'accent', showLast = true, fill, height = H, label, className, ...props
}: SparklineProps) {
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

    // Says the floor out loud: the plot is zoomed to the series, so the line
    // touching the bottom means "series minimum", not zero.
    const n = (v: number) => Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
    const tip = label
        ? `${label} · ${data.length} points · low ${n(Math.min(...data))} · high ${n(Math.max(...data))} · latest ${n(data[data.length - 1])}`
        : undefined;

    return (
        <span
            className={cn('relative align-middle', fill ? 'block w-full' : 'inline-block w-[120px]',
                          chartToneClass[tone], className)}
            style={{ height }}
            role={tip ? 'img' : undefined}
            aria-label={tip}
            aria-hidden={tip ? undefined : true}
            {...props}
        >
            {/* preserveAspectRatio="none", deliberately.
                A sparkline is a shape read for direction, not for angle, and the
                box it is given is whatever the layout has spare. Stretching the
                viewBox is how it fills that; `meet` would letterbox it inside a
                120:32 box and leave dead space either side, which is the bug the
                treemap had. The stroke is held at 2px by non-scaling-stroke, and
                the dot is a DOM element rather than an SVG circle so that it
                stays ROUND: a <circle> under a stretched viewBox is an ellipse,
                and every hand-rolled copy of this got that wrong. */}
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full">
                {tip ? <title>{tip}</title> : null}
                <path d={d} fill="none" stroke="currentColor" strokeWidth={2}
                      vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            {showLast ? (
                <span
                    aria-hidden="true"
                    className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                    style={{ left: `${(lx / W) * 100}%`, top: `${(ly / H) * 100}%` }}
                />
            ) : null}
        </span>
    );
}
