"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"


// Promoted from bitfinite-analytics, where it had been living as a local copy.
// It is the shadcn file with our tokens on it and it was already shared by more
// than one app (explorer carries its own Radix tooltip), which is the definition
// of something that belongs here rather than there.
//
// The import path is the one change: `@/lib/utils` is an alias only the consuming
// app defines, and a shared component cannot depend on a path its consumer has to
// invent. See ui/lib/cn.ts.

// Adapted from shadcn/ui (MIT). No deviations — this is the upstream file.
//
// Radix supplies what a hand-rolled `{open && <div>}` does not: aria-expanded and
// aria-controls wired to the panel, the panel keyed to the trigger, Space/Enter
// handling, and --radix-collapsible-content-height for an animatable open. The
// pattern this replaces in Watchlist was a plain button toggling a sibling div,
// which announced nothing to a screen reader about what the button controlled or
// whether it was open.
//
// The animation lives in globals.css (.collapsible-panel) rather than here so the
// keyframes sit with the rest of the app's motion and respect the reduced-motion
// block already in that file.
//
// NOTE for anyone auditing the ARIA: `aria-controls` is absent while the panel is
// CLOSED and appears when it opens. That is deliberate upstream behaviour
// (`context.open ? contentId : undefined`) — the content is unmounted when closed,
// and pointing aria-controls at an id that is not in the document is itself an
// ARIA violation. Verified in production: open it resolves to a real element,
// closed it is gone. Do not "fix" this by force-mounting the panel.

function Collapsible({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
    return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
    return (
        <CollapsiblePrimitive.CollapsibleTrigger
            data-slot="collapsible-trigger"
            {...props}
        />
    )
}

function CollapsibleContent({
    ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
    return (
        <CollapsiblePrimitive.CollapsibleContent
            data-slot="collapsible-content"
            {...props}
        />
    )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
