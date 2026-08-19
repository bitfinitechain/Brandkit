'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/cn';

// The theme button, shared. Four apps had four of these and they had drifted
// into two different-looking controls: web, explorer and ckstats render a
// borderless icon that cross-fades Sun and Moon, analytics a bordered 32px
// square showing one icon at a time to match its ops chrome. Same job, same
// brand, two appearances — which is what a shared component is for.
//
// It takes the theme and a handler rather than reading either itself. That is
// deliberate: three apps drive theme through next-themes and analytics through
// its own `bfx-ops-ui` key and a pre-paint script on <html>, and a component
// that imported next-themes could never ship to analytics without replacing a
// working theme system. The BUTTON is what was duplicated; the state never was.
//
// Both original implementations showed the CURRENT theme rather than the action,
// so that convention is kept — a Moon means you are in dark, not that clicking
// gets you there.
const themeToggle = cva(
    'inline-flex items-center justify-center transition-colors cursor-pointer ' +
    'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring',
    {
        variants: {
            variant: {
                // Marketing and public surfaces: no chrome until you reach for it.
                ghost: 'rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
                // Dense operator chrome, where a control needs an edge to read as
                // one control among several rather than as loose iconography.
                outline: 'rounded-md border border-border bg-secondary text-foreground hover:bg-muted',
            },
            size: { sm: 'size-8', md: 'size-9' },
        },
        defaultVariants: { variant: 'ghost', size: 'md' },
    },
);

export interface ThemeToggleProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'>,
        VariantProps<typeof themeToggle> {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle, variant, size, className, ...props }: ThemeToggleProps) {
    const dark = theme === 'dark';
    return (
        <button
            type="button"
            onClick={onToggle}
            // Icon-only, so the name has to come from somewhere. The title says
            // what will happen; the label says what the control is.
            aria-label="Toggle theme"
            title={dark ? 'Switch to light' : 'Switch to dark'}
            // Theme is resolved on the client, so the server render and the first
            // client render legitimately disagree for one frame.
            suppressHydrationWarning
            className={cn(themeToggle({ variant, size }), className)}
            {...props}
        >
            {dark ? <Moon size={16} strokeWidth={2} aria-hidden="true" />
                  : <Sun size={16} strokeWidth={2} aria-hidden="true" />}
        </button>
    );
}

export default ThemeToggle;
