import * as React from "react"

import { cn } from "./lib/cn"

// Adapted from shadcn/ui (MIT). Deviations from upstream:
//
//  1. `h-9` became `h-10` and the text is 14px, matching the ten hand-written
//     inputs this replaces. Upstream's 36px is right for a compact form; the
//     address and label fields here sit beside a Watch button and read as a
//     search bar.
//  2. `rounded-md` left alone — the Tailwind radius scale maps it to var(--r2),
//     so the shadcn class already resolves to this app's token.
//  3. A `mono` prop. Addresses, txids and API keys are entered here and every
//     hand-rolled version set fontFamily: MONO; making it a prop is what stops
//     the eleventh one being written by hand.
function Input({
    className,
    type,
    mono,
    ...props
}: React.ComponentProps<"input"> & { mono?: boolean }) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-10 w-full min-w-0 rounded-md border border-border bg-panel2 px-3 py-1 text-sm text-fg",
                "placeholder:text-mut selection:bg-primary selection:text-primary-foreground",
                "transition-[color,box-shadow] outline-none",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
                mono && "font-mono",
                className
            )}
            {...props}
        />
    )
}

export { Input }
