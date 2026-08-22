import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "./lib/cn"

// Adapted from shadcn/ui (MIT). Deviations from upstream:
//
//  1. `rounded-full` became `rounded-pill`, a scale entry wired to --rb. A fully
//     round badge is correct in cards mode and wrong in ledger, where every other
//     corner is square — upstream has no concept of a second UI mode, so the one
//     hardcoded radius was the single thing standing between this component and
//     working in both. Nothing else needed changing, which is the useful result.
//  2. Four ops tones added to the variant group (accent/ok/warn/bad). Additive:
//     upstream's six variants are untouched, so a component copied from the docs
//     still behaves as documented.
//  3. A `mono` size, because the status pills across this dashboard are mono,
//     uppercase and letterspaced — that is the house style for a pill, and having
//     it as a variant is what lets ~27 hand-written copies collapse into one name.
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-pill border border-transparent whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // ops tones — hairline box, tinted text, no fill. Reads as a status marker
        // rather than a button, which is what these actually are.
        accent: "border-acc text-accink",
        ok: "border-ok/45 text-ok",
        warn: "border-warn/45 text-warn",
        bad: "border-bad/45 text-bad",
        muted: "border-line text-mut",
      },
      size: {
        default: "px-2 py-0.5 text-xs font-medium",
        mono: "px-[7px] py-[3px] font-mono text-[9.5px] font-bold tracking-[.1em] uppercase leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
