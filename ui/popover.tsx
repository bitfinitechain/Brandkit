"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "./lib/cn"


// Promoted from bitfinite-analytics, where it had been living as a local copy.
// It is the shadcn file with our tokens on it and it was already shared by more
// than one app (explorer carries its own Radix tooltip), which is the definition
// of something that belongs here rather than there.
//
// The import path is the one change: `@/lib/utils` is an alias only the consuming
// app defines, and a shared component cannot depend on a path its consumer has to
// invent. See ui/lib/cn.ts.

// Adapted from shadcn/ui (MIT). Deviations from upstream:
//  1. The animate-in / fade-in-0 / zoom-in-95 classes were removed. They belong to
//     the tw-animate-css plugin, which is not installed here, so they compiled to
//     nothing. Enter/exit is in globals.css on [data-slot=popover-content].
//  2. Width is capped against the viewport. `w-72` alone is 288px, which overflows
//     a 390px screen once the collision padding is counted.
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn(
          "z-50 w-72 max-w-[calc(100vw-1.5rem)] origin-(--radix-popover-content-transform-origin)",
          "rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
