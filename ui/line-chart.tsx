'use client';

import * as React from 'react';

import { cn } from './lib/cn';
import { smoothPath } from './lib/smooth-path';
import { chartToneClass, type ChartTone } from './sparkline';

// Smoothed line with a gradient fade underneath and a hover crosshair.
//
// 'use client' for the pointer tracking. The readout is the point of the whole
// thing: the guidelines require a chart to give a value and a timestamp on hover,
// not just a shape, so the hover state is part of the component rather than
// something each app bolts on.
const W = 600;
const H = 200;
const TOP = 10;
const BOTTOM = 170;      // the baseline gridline; the fade runs to here
const GRID = [50, 110, 170];

export interface LinePoint {
    /** Printed in the readout on hover. Pass a formatted timestamp or label. */
    label?: React.ReactNode;
    value: number;
}

export interface LineChartProps extends Omit<React.ComponentProps<'div'>, 'onSelect' | 'title'> {
    data: LinePoint[];
    title?: React.ReactNode;
    tone?: ChartTone;
    /** Formats the hovered value. Defaults to the raw number. */
    format?: (value: number, point: LinePoint, index: number) => React.ReactNode;
}

export function LineChart({
    data, title, tone = 'accent', format, className, ...props
}: LineChartProps) {
    // Unique per instance. The design reference hardcodes the gradient id, which
    // works until a page renders two charts — then both resolve url(#id) to the
    // first one and the second chart inherits the wrong fill.
    const gradientId = React.useId().replace(/:/g, '');
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [hover, setHover] = React.useState<number | null>(null);

    const pts = React.useMemo(() => {
        const vals = data.map((d) => (Number.isFinite(d.value) ? d.value : 0));
        if (vals.length === 0) return [] as ReadonlyArray<readonly [number, number]>;
        const lo = Math.min(...vals);
        const hi = Math.max(...vals);
        const span = hi - lo || 1;
        const stepX = vals.length > 1 ? W / (vals.length - 1) : 0;
        return vals.map((v, i) => [
            i * stepX,
            hi === lo ? (TOP + BOTTOM) / 2 : BOTTOM - ((v - lo) / span) * (BOTTOM - TOP),
        ] as const);
    }, [data]);

    const linePath = React.useMemo(() => smoothPath(pts), [pts]);
    const areaPath = pts.length ? `${linePath} L${W} ${BOTTOM} L0 ${BOTTOM} Z` : '';

    const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const el = svgRef.current;
        if (!el || pts.length === 0) return;
        const r = el.getBoundingClientRect();
        // Map client px back into viewBox units — the SVG scales to its container,
        // so the raw offset is not the coordinate the path was drawn in.
        const x = ((e.clientX - r.left) / r.width) * W;
        let best = 0;
        for (let i = 1; i < pts.length; i++) {
            if (Math.abs(pts[i][0] - x) < Math.abs(pts[best][0] - x)) best = i;
        }
        setHover(best);
    };

    const active = hover != null ? data[hover] : undefined;

    return (
        <div className={cn('relative w-full text-foreground', className)} {...props}>
            <div className="mb-2.5 flex items-baseline gap-3">
                {title ? (
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{title}</span>
                ) : null}
                {active ? (
                    <span className={cn('font-mono text-[13px] font-semibold tabular-nums', chartToneClass[tone])} aria-live="polite">
                        {format ? format(active.value, active, hover as number) : active.value}
                        {active.label ? <span className="ml-2 text-muted-foreground">{active.label}</span> : null}
                    </span>
                ) : null}
            </div>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className={cn('block w-full', chartToneClass[tone])}
                onPointerMove={onMove}
                onPointerLeave={() => setHover(null)}
                role="img"
                aria-label={typeof title === 'string' ? title : 'chart'}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                </defs>
                {GRID.map((y) => (
                    <line key={y} x1={0} y1={y} x2={W} y2={y} stroke="currentColor" strokeWidth={1} className="text-border" />
                ))}
                {areaPath ? <path d={areaPath} fill={`url(#${gradientId})`} /> : null}
                {linePath ? (
                    <path d={linePath} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                ) : null}
                {/* The latest value keeps a marker whether or not anyone is hovering.
                    Per LineChart.dc.html, which draws this circle outside the hover
                    branch — the endpoint is where the eye goes first, and a line that
                    just stops has no "you are here". Hidden while hovering so the two
                    markers never sit on top of each other at the right-hand edge. */}
                {pts.length && hover == null ? (
                    <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill="currentColor" />
                ) : null}
                {hover != null && pts[hover] ? (
                    <>
                        <line
                            x1={pts[hover][0]} y1={TOP} x2={pts[hover][0]} y2={BOTTOM}
                            stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" className="text-muted-foreground"
                        />
                        {/* Two discs rather than a stroked one: the outer takes the page
                            colour and the inner the tone, so both are plain currentColor
                            against a token class — the same way social-links paints its
                            marks. A stroke would have needed the token as a raw
                            var(--background), which is the one thing no other component
                            here does. */}
                        <circle cx={pts[hover][0]} cy={pts[hover][1]} r={6.5} fill="currentColor" className="text-background" />
                        <circle cx={pts[hover][0]} cy={pts[hover][1]} r={4.5} fill="currentColor" />
                    </>
                ) : null}
            </svg>
        </div>
    );
}

export default LineChart;
