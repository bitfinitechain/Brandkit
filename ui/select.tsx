import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "./lib/cn"

// A native <select> wearing the shadcn field styling.
//
// NOT shadcn's Select, deliberately. That one is a Radix listbox — nine more
// files, another dependency, and a popover that has to be positioned. The five
// selects in this dashboard are short static lists (interval, page size, role)
// where the platform control is better: it is keyboard-accessible for free, uses
// the native picker on a phone, and cannot get out of sync with the page scroll.
//
// What it borrows from shadcn is the FIELD: same height, radius, border, focus
// ring and disabled treatment as Input, so a select and a text field sitting
// next to each other line up. That is the actual goal — one visual language,
// not one implementation.
function Select({
    className,
    children,
    ...props
}: React.ComponentProps<"select">) {
    return (
        <div className="relative inline-flex w-full">
            <select
                data-slot="select"
                className={cn(
                    "h-10 w-full appearance-none rounded-md border border-border bg-panel2 pl-3 pr-9 text-sm text-fg",
                    "transition-[color,box-shadow] outline-none",
                    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            {/* pointer-events-none so the chevron never eats a click meant for the
                control underneath it. */}
            <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-mut"
                aria-hidden="true"
            />
        </div>
    )
}

export { Select }
