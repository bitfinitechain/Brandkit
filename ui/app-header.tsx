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
// Contents stay per app on purpose. A mega-menu, a chain search, mining tabs and
// an operator console are not variants of one component, and forcing them into
// one prop shape would produce something worse than four honest headers. What
// was actually duplicated is the bar: its height, its rule, its track, and the
// brand / nav / actions arrangement inside it.
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
    /** Primary navigation. Rendered inside a real <nav>, so it is skippable. */
    nav?: React.ReactNode;
    /** Theme toggle, account, sign-in — pushed to the far edge. */
    actions?: React.ReactNode;
    /** Content track. Matches --bfx-track; analytics runs its own narrower one. */
    maxWidth?: number | string;
}

export function AppHeader({
    brand, nav, actions, surface, sticky, maxWidth = 1600, className, ...props
}: AppHeaderProps) {
    return (
        <header className={cn(appHeader({ surface, sticky }), className)} {...props}>
            <div
                className="mx-auto flex h-16 items-center gap-4 px-4 sm:px-6 md:px-10"
                style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
            >
                {/* min-w-0 so a long lockup shrinks rather than pushing the row
                    wider than the viewport — the overflow that put 834px of header
                    inside a 768px tablet. */}
                <div className="flex min-w-0 shrink items-center gap-3">{brand}</div>
                {nav && <nav className="flex min-w-0 items-center gap-5 lg:gap-8">{nav}</nav>}
                {actions && <div className="ml-auto flex shrink-0 items-center gap-3">{actions}</div>}
            </div>
        </header>
    );
}

export default AppHeader;
