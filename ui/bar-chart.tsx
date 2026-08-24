import * as React from 'react';

import { cn } from './lib/cn';
import { chartToneClass, type ChartTone } from './sparkline';

// Column chart: value label above each bar, category label below, hairline baseline.
//
// Heights are percentages of the tallest bar rather than of the value range, so a
// series of 98/99/100 reads as three nearly-equal columns instead of the dramatic
// staircase a min-max scale would invent. Bars are compared against each other,
// not against their own spread.
export interface BarDatum {
    label: React.ReactNode;
    value: number;
    /** Printed above the bar. Pass a formatted string; the chart does not guess units. */
    valueLabel?: React.ReactNode;
    tone?: ChartTone;
}

// 'title' is omitted from the div props on purpose: on an element that is the
// HTML tooltip attribute and only takes a string, so a ReactNode heading would
// not type-check against it.
export interface BarChartProps extends Omit<React.ComponentProps<'div'>, 'title'> {
    data: BarDatum[];
    title?: React.ReactNode;
    tone?: ChartTone;
    /** Plot area height in px, excluding the labels above and below. */
    height?: number;
}

export function BarChart({
    data, title, tone = 'accent', height = 150, className, ...props
}: BarChartProps) {
    const max = Math.max(0, ...data.map((d) => (Number.isFinite(d.value) ? d.value : 0)));

    return (
        <div className={cn('w-full text-foreground', className)} {...props}>
            {title ? (
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</div>
            ) : null}
            <div className="flex items-end gap-2.5 border-b border-border" style={{ height }}>
                {data.map((d, i) => {
                    // A zero max would divide by zero; an all-zero series is legitimate
                    // (a pool that found nothing today) and should draw a flat floor
                    // rather than vanish or NaN out of the layout.
                    const pct = max > 0 ? Math.max(0, d.value) / max * 100 : 0;
                    return (
                        <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                            <span className="whitespace-nowrap font-mono text-[10px] tabular-nums text-muted-foreground">
                                {d.valueLabel ?? d.value}
                            </span>
                            <div
                                className={cn(
                                    'w-full max-w-[44px] rounded-t bg-current transition-[height] duration-[400ms] ease-out hover:opacity-80 motion-reduce:transition-none',
                                    chartToneClass[d.tone ?? tone],
                                )}
                                style={{ height: `${pct}%` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-1.5 flex gap-2.5">
                {data.map((d, i) => (
                    <span
                        key={i}
                        className="min-w-0 flex-1 truncate text-center font-mono text-[10px] tracking-[0.05em] text-muted-foreground"
                    >
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default BarChart;
