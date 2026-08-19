import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/cn';

// The header bar: the shell, not its contents.
//
// Three apps drew this and produced two treatments — web and ckstats a blurred
// translucent bar, explorer an opaque one — and explorer alone used the correct
// element. `<nav>` for the whole bar says the brand and the account controls are
// navigation, which they are not; a <header> CONTAINING a <nav> is what this is.
// Sharing the shell fixes the semantics once instead of three times.
//
// The middle is `children` and carries no wrapper, which is a correction: the
// first version wrapped it in a <nav>, and then the real headers turned out to
// arrange their middles three different ways — explorer centres a chain search,
// web and ckstats run a link row. Wrapping a search box in <nav> is the same
// class of mistake this component exists to fix. Apps put <nav> where it belongs.
//
// What IS shared: the rule, the track, the minimum height, sticky and blur, and
// brand-left / actions-right. Also `below`, because every one of the three keeps
// its mobile menu inside the header under the main row, and a single fixed-height
// row had nowhere to put it.
const appHeader = cva('w-full border-b border-border', {
    variants: {
        // Translucent needs the blur: without backdrop-filter support the bar is
        // simply 95% opaque, which is why the fallback is stated rather than left
        // to chance.
        surface: {
            solid: 'bg-background',
            blur: 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        },
        sticky: { true: 'sticky top-0 z-50', false: '' },
    },
    defaultVariants: { surface: 'blur', sticky: true },
});

export interface AppHeaderProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof appHeader> {
    /** Logo and lockup. */
    brand: React.ReactNode;
    /** The middle of the bar. Deliberately unopinionated — see the note below. */
    children?: React.ReactNode;
    /** Theme toggle, account, sign-in — pushed to the far edge. */
    actions?: React.ReactNode;
    /** Expanded content UNDER the row: the mobile menu, a secondary search.
        All three headers have one, and a single fixed row could not hold it. */
    below?: React.ReactNode;
    /** Content track. Matches --bfx-track; analytics runs its own narrower one. */
    maxWidth?: number | string;
}

export function AppHeader({
    brand, children, actions, below, surface, sticky, maxWidth = 1600, className, ...props
}: AppHeaderProps) {
    return (
        <header className={cn(appHeader({ surface, sticky }), className)} {...props}>
            <div
                className="mx-auto flex min-h-16 items-center gap-4 px-4 sm:px-6 md:px-10"
                style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
            >
                {/* min-w-0 so a long lockup shrinks rather than pushing the row wider
                    than the viewport — the overflow that put 834px of header inside a
                    768px tablet. */}
                <div className="flex min-w-0 shrink items-center gap-3">{brand}</div>
                {children}
                {actions && <div className="ml-auto flex shrink-0 items-center gap-3">{actions}</div>}
            </div>
            {below && (
                <div
                    className="mx-auto px-4 sm:px-6 md:px-10"
                    style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
                >
                    {below}
                </div>
            )}
        </header>
    );
}

export default AppHeader;
