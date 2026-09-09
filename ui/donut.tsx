import * as React from 'react';

import { cn } from './lib/cn';
import { chartToneClass, type ChartTone } from './sparkline';

// Ring chart with a centre figure and a legend beside it.
//
// r48 / stroke 14 on a 120 box, from the design reference. Segments use
// pathLength=100 so each arc is written as a percentage, and rotate(-90) starts
// the first one at twelve o'clock instead of three.
export interface DonutSegment {
    label: React.ReactNode;
    value: number;
    tone?: ChartTone;
    /** Categorical colour, overriding `tone`. A token, never a hex. See BarChart. */
    color?: string;
}

export interface DonutProps extends React.ComponentProps<'div'> {
    segments: DonutSegment[];
    centerValue?: React.ReactNode;
    centerLabel?: React.ReactNode;
    /** Hide the legend when the ring sits in a tile that labels itself. */
    showLegend?: boolean;
}

const ORDER: ChartTone[] = ['accent', 'ok', 'warn', 'bad', 'muted'];

export function Donut({
    segments, centerValue, centerLabel, showLegend = true, className, ...props
}: DonutProps) {
    const total = segments.reduce((n, s) => n + (s.value > 0 ? s.value : 0), 0);

    // Offsets accumulate, so they are computed once here rather than in the map —
    // a running total inside a render callback is the kind of thing that survives
    // until someone reorders the array.
    const arcs = React.useMemo(() => {
        let acc = 0;
        return segments.map((s, i) => {
            const pct = total > 0 ? (Math.max(0, s.value) / total) * 100 : 0;
            const arc = { ...s, pct, offset: -acc, tone: s.tone ?? ORDER[i % ORDER.length] };
            acc += pct;
            return arc;
        });
    }, [segments, total]);

    return (
        <div className={cn('flex items-center gap-6 text-foreground', className)} {...props}>
            <div className="relative w-[130px] shrink-0">
                <svg viewBox="0 0 120 120" className="block w-full" aria-hidden="true">
                    <circle cx={60} cy={60} r={48} fill="none" stroke="currentColor" strokeWidth={14} className="text-border" />
                    {arcs.map((a, i) => (
                        <circle
                            key={i}
                            cx={60}
                            cy={60}
                            r={48}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={14}
                            pathLength={100}
                            strokeDasharray={`${a.pct} 100`}
                            strokeDashoffset={a.offset}
                            transform="rotate(-90 60 60)"
                            className={cn('bfx-arc', a.color ? '' : chartToneClass[a.tone])}
                            style={a.color ? { color: a.color } : undefined}
                        />
                    ))}
                </svg>
                {(centerValue ?? centerLabel) ? (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-[20px] font-bold leading-[1.1] tabular-nums text-foreground">{centerValue}</span>
                        {centerLabel ? (
                            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{centerLabel}</span>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {showLegend ? (
                <div className="flex min-w-0 flex-col gap-2">
                    {arcs.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            <span
                                className={cn('h-2 w-2 shrink-0 rounded-full bg-current', a.color ? '' : chartToneClass[a.tone])}
                                style={a.color ? { color: a.color } : undefined}
                                aria-hidden="true"
                            />
                            <span className="min-w-0 truncate text-muted-foreground">{a.label}</span>
                            <span className="ml-auto font-mono tabular-nums text-foreground">{a.pct.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default Donut;
