import * as React from 'react';

import { cn } from './lib/cn';

// The "nothing here yet" panel.
//
// It exists because an empty table and a broken one look identical, and every BFX
// app had learned that the hard way separately: the pool tab rendered zero rows
// while it was still connecting, the workers list showed a bare header when a
// miner had simply never authorised, and neither said which it was. The design
// guidelines require three states on every async surface — loading, empty, error —
// and this is the middle one.
//
// Deliberately not a Card: it is flatter, centred, and carries an optional single
// action. Anything richer than a title, a sentence and one button is a page, not
// an empty state.
export interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
    title: React.ReactNode;
    /** One or two sentences. Say what is missing AND how to make it appear. */
    body?: React.ReactNode;
    /** Label for the single call to action. Omit for a stateless message. */
    action?: React.ReactNode;
    onAction?: () => void;
    /** Rendered above the title. Keep it a plain glyph — this is not a hero. */
    icon?: React.ReactNode;
}

export function EmptyState({
    title, body, action, onAction, icon, className, ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-5 py-8 text-center',
                className,
            )}
            {...props}
        >
            {icon ? <span aria-hidden="true" className="mb-1 text-muted-foreground">{icon}</span> : null}
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {body ? (
                // 46ch, not a pixel width: the measure should follow the type, and a
                // sentence that runs the full width of a wide card is unreadable.
                <span className="max-w-[46ch] text-[13px] leading-relaxed text-muted-foreground">{body}</span>
            ) : null}
            {action ? (
                <button
                    type="button"
                    onClick={onAction}
                    className="mt-2.5 inline-flex h-8 items-center rounded-lg bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-[0.92] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40"
                >
                    {action}
                </button>
            ) : null}
        </div>
    );
}

export default EmptyState;
