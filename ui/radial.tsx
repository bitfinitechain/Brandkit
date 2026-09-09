'use client';

import * as React from 'react';
import { RadialBar, RadialBarChart, PolarAngleAxis, PolarGrid } from 'recharts';

import { cn } from './lib/cn';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './chart';

/**
 * Concentric radial bars — the one part-of-whole shape the kit could not draw.
 *
 * WHY THIS EXISTS AND THE OTHERS DO NOT. Sparkline, LineChart, BarChart, Donut
 * and Gauge are ours: token driven, dependency free, and they cover magnitude,
 * change over time, part-of-whole and a single value against a ceiling. This
 * one pulls in recharts, so it earns its place only by drawing a shape they
 * cannot: several categories as separate ARCS on a shared angular scale, where
 * each one is read against the same total rather than against the tallest bar.
 *
 * WHEN TO REACH FOR IT, and when not to:
 *
 *   USE IT for two to five categories that sum to something meaningful, where
 *   the reader's question is "how is the whole split" and the categories have
 *   no natural order.
 *
 *   DO NOT use it for a single value — that is Gauge, which is one arc and
 *   reads faster.
 *
 *   DO NOT use it for a category comparison where one bar dominates. Arc length
 *   on different radii is not comparable by eye: an inner arc and an outer arc
 *   of the same angle have very different lengths, so a radial flatters small
 *   categories and understates large ones. Columns are honest there.
 *
 *   DO NOT use it for more than five. The rings get thin, the labels collide,
 *   and the palette runs out before the data does.
 *
 * innerRadius leaves a real hole rather than the tightest one that fits: the
 * centre figure sits in it, and at a smaller radius the innermost arc runs
 * underneath the text.
 *
 * PolarAngleAxis is fixed to a 0-100 domain rather than letting recharts infer
 * it from the data. Inferred, the largest category would always sweep the full
 * circle whatever its share, which reads as "100%" and is the single most
 * misleading thing this chart can do.
 */
export interface RadialSlice {
    key: string;
    label: string;
    value: number;
}

export interface RadialProps extends Omit<React.ComponentProps<'div'>, 'title'> {
    data: RadialSlice[];
    /** Chart-tone CSS variables, keyed by slice key. See ChartConfig. */
    config: ChartConfig;
    /** Printed in the middle. Pass the total, or the figure the chart is about. */
    centerValue?: React.ReactNode;
    centerLabel?: React.ReactNode;
    size?: number;
}

export function Radial({
    data, config, centerValue, centerLabel, size = 200, className, ...props
}: RadialProps) {
    const total = data.reduce((n, d) => n + (d.value > 0 ? d.value : 0), 0);

    // Shares, not raw counts: every arc is then read against the same 0-100
    // angular scale, which is the whole point of the form.
    // `name` is what ChartTooltipContent falls back to: it resolves a label from
    // config[dataKey], and dataKey here is the shared "value", so without a name
    // every slice's tooltip would read the same.
    const rows = data.map((d) => ({
        key: d.key,
        name: d.label,
        label: d.label,
        value: total > 0 ? (Math.max(0, d.value) / total) * 100 : 0,
        count: d.value,
        fill: `var(--color-${d.key})`,
    }));

    return (
        <div className={cn('relative', className)} style={{ width: size }} {...props}>
            <ChartContainer config={config} className="mx-auto aspect-square" style={{ width: size }}>
                <RadialBarChart
                    data={rows}
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="46%"
                    outerRadius="100%"
                    barSize={11}
                >
                    <PolarGrid gridType="circle" radialLines={false} stroke="none" />
                    {/* Domain pinned: see the note above on why inferring it lies. */}
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    {/* The track must be given a token. Bare `background` is
                        recharts' own near-white default, which on a dark surface
                        paints four bright rings that outshout the data sitting on
                        top of them. */}
                    <RadialBar
                        dataKey="value"
                        background={{ fill: 'var(--color-border)' }}
                        cornerRadius={4}
                    />
                </RadialBarChart>
            </ChartContainer>
            {(centerValue ?? centerLabel) ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-[20px] font-bold leading-[1.1] tabular-nums text-foreground">
                        {centerValue}
                    </span>
                    {centerLabel ? (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                            {centerLabel}
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default Radial;
