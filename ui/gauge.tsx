import * as React from 'react';

import { cn } from './lib/cn';
import { chartToneClass, type ChartTone } from './sparkline';

// A 270-degree arc with the figure in the middle.
//
// The arc path and its 75px radius are fixed from the design reference; the sweep
// is expressed with pathLength=100 so the dash maths is a plain percentage and
// does not have to know the arc's real length in user units.
const ARC = 'M 46.97 143.03 A 75 75 0 1 1 153.03 143.03';

export interface GaugeProps extends React.ComponentProps<'div'> {
    /** 0-100. Values outside are clamped rather than allowed to overdraw the arc. */
    value: number;
    /** What to print in the middle. Defaults to the rounded value. */
    display?: React.ReactNode;
    unit?: React.ReactNode;
    label?: React.ReactNode;
    tone?: ChartTone | 'auto';
    /**
     * Where `auto` changes colour. Defaults to the design's 70/90.
     *
     * `auto` assumes HIGHER IS WORSE — utilisation, saturation, load — because that
     * is what a threshold gauge is usually watching. For a metric where high is
     * good (pool luck, uptime) pass an explicit tone; the component cannot infer
     * the direction and guessing it silently would colour a healthy number red.
     */
    thresholds?: { warn: number; bad: number };
}

export function Gauge({
    value, display, unit, label, tone = 'auto',
    thresholds = { warn: 70, bad: 90 },
    className, ...props
}: GaugeProps) {
    const v = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
    const resolved: ChartTone =
        tone !== 'auto' ? tone : v >= thresholds.bad ? 'bad' : v >= thresholds.warn ? 'warn' : 'ok';

    return (
        <div
            className={cn('inline-flex w-[180px] flex-col items-center gap-1 text-foreground', className)}
            {...props}
        >
            <div className="relative w-full">
                <svg viewBox="0 0 200 158" className="block w-full" aria-hidden="true">
                    <path d={ARC} fill="none" stroke="currentColor" strokeWidth={12} strokeLinecap="round" className="text-border" />
                    <path
                        d={ARC}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={12}
                        strokeLinecap="round"
                        pathLength={100}
                        strokeDasharray={`${v} 100`}
                        className={cn('bfx-arc', chartToneClass[resolved])}
                    />
                </svg>
                {/* pt-3 offsets the open bottom of the arc so the figure reads as
                    centred in the ring rather than in the bounding box. */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-3">
                    <span className="font-mono text-[24px] font-bold leading-[1.1] tabular-nums text-foreground">
                        {display ?? Math.round(v)}
                    </span>
                    {unit ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{unit}</span>
                    ) : null}
                </div>
            </div>
            {label ? (
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
            ) : null}
        </div>
    );
}

export default Gauge;
