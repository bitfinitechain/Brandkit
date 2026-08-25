// Catmull-Rom through the points, emitted as cubic beziers.
//
// A polyline through noisy chain data reads as jagged noise; this keeps the curve
// ON every real sample instead of smoothing them away, which a plain bezier fit
// would do. That distinction matters for a chain explorer: the peaks and troughs
// are the data, not artefacts to be filtered.
//
// This lives in ui/lib rather than inside line-chart.tsx because it has to be
// importable from server components. line-chart.tsx is 'use client', and analytics'
// charts.tsx deliberately is not — importing the curve from a client module would
// drag every server component that renders a chart into the client bundle. A pure
// function with no directive can be shared by both.
//
// One definition, two renderers: Brandkit's LineChart and analytics' AreaChart draw
// the same curve because they call this, not because someone kept two copies in
// step. The second copy is how they drift.
export function smoothPath(pts: ReadonlyArray<readonly [number, number]>): string {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M${pts[0][0]} ${pts[0][1]}`;
    let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
}

export default smoothPath;
