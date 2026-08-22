import * as React from "react"

import { cn } from "./lib/cn"

// Adapted from shadcn/ui (MIT). Deviations from upstream:
//
//  1. Padding is px-5 py-4, not py-6 with px-6 on the slots. Upstream's spacing is
//     tuned for a marketing card holding a paragraph; this dashboard puts ~40 cards
//     on a screen and the hand-written ones it replaces were 20px/22px. Matching
//     those means the component can be swapped in without every page growing.
//  2. `gap-6` became `gap-3` for the same reason.
//  3. No `shadow-sm`. Surfaces here are separated by --line, not elevation; the one
//     exception is popovers, which use --bfx-elev-popover. A card with a drop shadow
//     would be the only raised thing on the page.
//
// Radius is left as upstream's rounded-xl on purpose: the Tailwind radius scale in
// globals.css maps --radius-xl to var(--r), so the shadcn class name already
// resolves to this app's token. Nothing to override.

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-3 rounded-xl border border-border px-5 py-4",
                className
            )}
            {...props}
        />
    )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn("flex flex-col gap-1", className)}
            {...props}
        />
    )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn("font-semibold leading-none", className)}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="card-content" className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("flex items-center", className)}
            {...props}
        />
    )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
