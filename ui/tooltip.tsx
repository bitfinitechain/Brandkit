"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "./lib/cn"


// Promoted from bitfinite-analytics, where it had been living as a local copy.
// It is the shadcn file with our tokens on it and it was already shared by more
// than one app (explorer carries its own Radix tooltip), which is the definition
// of something that belongs here rather than there.
//
// The import path is the one change: `@/lib/utils` is an alias only the consuming
// app defines, and a shared component cannot depend on a path its consumer has to
// invent. See ui/lib/cn.ts.

// Adapted from shadcn/ui (MIT). Three deliberate deviations from upstream, each
// recorded so that a future `shadcn add` overwriting this file is recognisable
// rather than silent:
//
//  1. Surface. Upstream paints the tooltip `bg-foreground text-background` — an
//     inverted body colour, which is dark in a light theme. This uses the popover
//     surface instead, so it follows the theme like every other panel.
//
//     It was briefly wired to --tipbg/--tipfg to match the chart tooltips. That
//     was matching the wrong sibling. --tipbg is dark in BOTH themes, so in light
//     mode the hint rendered as a dark chip on a light page; worse, <Hint> falls
//     back to a Popover on touch, so the same explanation was a dark chip on
//     desktop and a white card on a phone. A chart tooltip is a one-line value
//     readout floating over a plot and is correctly an inverted chip; a hint is a
//     paragraph of prose and belongs on a card. Different things, different
//     surfaces — the chart tooltip in OverviewInterval keeps --tipbg.
//  2. Motion. Upstream leans on animate-in / fade-in-0 / zoom-in-95, which come
//     from the tw-animate-css plugin. We do not install it, so those classes
//     compiled to nothing — present in the markup, absent from the stylesheet,
//     and invisible unless you diff the built CSS. Rather than take another
//     dependency the enter/exit now lives in globals.css keyed on
//     [data-slot=tooltip-content], driven by our --ease-out/--dur-fast tokens and
//     already covered by the global prefers-reduced-motion rule.
//  3. Width and delay. A tooltip is capped against the viewport rather than left
//     to grow, and opens after a beat instead of instantly (upstream ships 0),
//     which otherwise fires every tooltip you sweep the pointer across.
//
// It does NOT open on touch — that is Radix behaviour, not a styling gap, and no
// amount of configuration changes it. Anything that must reach a phone goes
// through <Hint>, which swaps to a popover on a coarse pointer.
function TooltipProvider({
  delayDuration = 150,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          "z-50 w-fit max-w-[min(19rem,calc(100vw-1.5rem))] origin-(--radix-tooltip-content-transform-origin)",
          "rounded-md border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-balance text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        {children}
        {/* The arrow is a square rotated 45°, so border-b/border-r are the two
            edges that end up facing outward — without them the arrow reads as an
            unbordered tab stuck to a bordered card, which is only visible in
            light mode where the border actually contrasts. */}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] border-r border-b border-border bg-popover fill-popover" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
