'use client';

import * as React from 'react';

import { cn } from './lib/cn';

// A read-only value with a Copy button — stratum URLs, bfx: addresses, txids.
//
// 'use client' because the clipboard and the confirmation state are both browser
// concerns. Everything else in this package renders on the server.
//
// The value is a <code> that truncates rather than wraps. These strings have no
// break opportunity, so wrapping them produces a ragged two-line block that is
// harder to read and impossible to align; and nobody reads a txid off the screen
// anyway — they copy it, which is what the button is for.
export interface CopyFieldProps extends Omit<React.ComponentProps<'div'>, 'onCopy'> {
    value: string;
    label?: React.ReactNode;
    /** Milliseconds the button stays in its confirmed state. */
    confirmMs?: number;
    onCopied?: (value: string) => void;
}

export function CopyField({
    value, label, confirmMs = 1600, onCopied, className, ...props
}: CopyFieldProps) {
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Clearing on unmount matters: copy, navigate away, and a setState on a dead
    // component is a warning in dev and a leak in a long-lived dashboard tab.
    React.useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            // Insecure origin, denied permission, or no clipboard API. Say nothing
            // and stay in the resting state rather than claiming a copy that did
            // not happen — the value is on screen and selectable either way.
            return;
        }
        setCopied(true);
        onCopied?.(value);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), confirmMs);
    };

    return (
        <div className={cn('flex w-full flex-col gap-1.5', className)} {...props}>
            {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
            <div className="flex w-full items-stretch overflow-hidden rounded-lg border border-border bg-background">
                <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5 font-mono text-[13px] text-foreground">
                    {value}
                </code>
                <button
                    type="button"
                    onClick={copy}
                    // The label already reads "Copy"/"Copied", so aria-label would be
                    // duplicate noise. aria-live announces the change for a screen
                    // reader that is not watching the button.
                    aria-live="polite"
                    className={cn(
                        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border-l border-border bg-card px-3.5 text-xs font-semibold transition-colors',
                        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40',
                        copied ? 'text-success' : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {copied ? 'Copied ✓' : 'Copy'}
                </button>
            </div>
        </div>
    );
}

export default CopyField;
