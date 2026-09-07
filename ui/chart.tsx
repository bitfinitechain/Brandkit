'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from './lib/cn';

/**
 * The recharts wrapper. Adapted from shadcn/ui (MIT).
 *
 * recharts is an OPTIONAL peer dependency: nothing else in this kit imports it,
 * so an app that never renders a Chart never installs it. That matters here
 * more than it does upstream, because four BFX apps already draw their charts
 * with Sparkline, LineChart, BarChart, Donut and Gauge, which are ours, token
 * driven and have no dependencies at all. Reach for those first; this is for
 * the shapes they do not cover.
 *
 * What the wrapper adds over bare recharts is the thing worth having: colours
 * come from a config keyed by series, injected as CSS variables, so a chart
 * follows the theme instead of carrying hexes.
 */
export interface ChartConfig {
    [key: string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
        /** A CSS colour. Use a token: 'var(--primary)', not a hex. */
        color?: string;
    };
}

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

export function useChart() {
    const ctx = React.useContext(ChartContext);
    if (!ctx) throw new Error('useChart must be used inside <ChartContainer>');
    return ctx;
}

export function ChartContainer({
    id, className, children, config, ...props
}: React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;
    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-slot="chart"
                data-chart={chartId}
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid_line]:stroke-border [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
                    className,
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

/** Series colours as CSS variables, scoped to this chart. */
export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
    const coloured = Object.entries(config).filter(([, v]) => v.color);
    if (!coloured.length) return null;
    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `[data-chart=${id}] {\n${coloured.map(([k, v]) => `  --color-${k}: ${v.color};`).join('\n')}\n}`,
            }}
        />
    );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;

/** The tooltip body, on the kit's popover surface. */
export function ChartTooltipContent({
    active, payload, label, className, hideLabel,
}: {
    active?: boolean;
    payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>;
    label?: React.ReactNode;
    className?: string;
    hideLabel?: boolean;
}) {
    const { config } = useChart();
    if (!active || !payload?.length) return null;
    return (
        <div className={cn('grid min-w-32 gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-lg', className)}>
            {!hideLabel && label ? <div className="font-medium text-foreground">{label}</div> : null}
            {payload.map((item, i) => {
                const key = item.dataKey ?? item.name ?? String(i);
                return (
                    <div key={i} className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-2 shrink-0 rounded-[2px]" style={{ background: item.color }} />
                        <span className="text-muted-foreground">{config[key]?.label ?? item.name}</span>
                        <span className="ml-auto font-mono tabular-nums text-foreground">{item.value}</span>
                    </div>
                );
            })}
        </div>
    );
}

/** The legend, matching the tooltip. */
export function ChartLegendContent({
    payload, className,
}: { payload?: Array<{ value?: string; color?: string; dataKey?: string }>; className?: string }) {
    const { config } = useChart();
    if (!payload?.length) return null;
    return (
        <div className={cn('flex flex-wrap items-center justify-center gap-4 pt-3', className)}>
            {payload.map((item, i) => {
                const key = item.dataKey ?? item.value ?? String(i);
                return (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span aria-hidden="true" className="size-2 shrink-0 rounded-[2px]" style={{ background: item.color }} />
                        {config[key]?.label ?? item.value}
                    </div>
                );
            })}
        </div>
    );
}
