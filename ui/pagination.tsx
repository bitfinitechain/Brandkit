'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from './button';
import { cn } from './lib/cn';

// Numbered pagination — one definition for the three that existed.
//
// explorer/components/Pagination.tsx, ckstats/src/components/Pagination.tsx and
// analytics/components/ops/EntityPager.tsx were three implementations of one
// design. The page-number maths was already IDENTICAL in the first two, down to
// the window size and where the ellipses land; they differed only in how a page
// is reached and how a button is drawn. So the maths moves here once and the two
// navigation models both become props.
//
// WHY BOTH MODELS. A server-rendered list changes page by URL, so its pages have
// to be real links: middle-clickable, shareable, and back/forward means what it
// says. A list already in the browser changes page in state, and turning that
// into a navigation would throw away a render for a slice it already holds.
// Neither is the "right" one, so `href` and `onPage` are alternatives and the
// component renders anchors or buttons to match.

export type PaginationProps = {
    /** 1-based. */
    page: number;
    pages: number;
    /** URL for a page. Renders real links. Give this OR onPage. */
    href?: (page: number) => string;
    /** State change for a page. Renders buttons. Give this OR href. */
    onPage?: (page: number) => void;
    /** How many pages either side of the current one before an ellipsis. */
    window?: number;
    className?: string;
    /** Names the nav for a screen reader when a page carries more than one. */
    label?: string;
};

/**
 * The page numbers to draw: 1 … c-1 c c+1 … N.
 *
 * Exported because it is the part worth testing and the part that was duplicated.
 * Under eight pages every number is shown, which is where the two originals
 * agreed and is worth keeping: an ellipsis that hides one page is worse than the
 * page.
 */
export function paginationRange(page: number, pages: number, w = 1): (number | 'gap')[] {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const out: (number | 'gap')[] = [1];
    if (page - w > 2) out.push('gap');
    const start = Math.max(2, page - w);
    const end = Math.min(pages - 1, page + w);
    for (let i = start; i <= end; i++) out.push(i);
    if (page + w < pages - 1) out.push('gap');
    out.push(pages);
    return out;
}

export function Pagination({
    page, pages, href, onPage, window: w = 1, className, label = 'Pagination',
}: PaginationProps) {
    // One page is not a choice, so there is nothing to render. Zero pages means
    // an empty list, which its own empty state should be explaining instead.
    if (pages <= 1) return null;

    const go = (p: number) => Math.min(Math.max(1, p), pages);
    const items = paginationRange(page, pages, w);

    // A disabled anchor is not a thing, so the ends render as disabled buttons
    // in href mode rather than links that go nowhere.
    const step = (to: number, dir: 'prev' | 'next', disabled: boolean) => {
        const icon = dir === 'prev' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />;
        const aria = dir === 'prev' ? 'Previous page' : 'Next page';
        if (disabled || !href) {
            return (
                <Button variant="outline" size="sm" aria-label={aria} disabled={disabled}
                        onClick={onPage ? () => onPage(go(to)) : undefined}>
                    {icon}
                </Button>
            );
        }
        return (
            <Button asChild variant="outline" size="sm">
                <a href={href(go(to))} aria-label={aria}>{icon}</a>
            </Button>
        );
    };

    const num = (p: number) => {
        const current = p === page;
        const cls = 'min-w-9 font-mono tabular-nums';
        // aria-current, not just a fill: the current page has to be announced,
        // and colour alone does not survive a screen reader or a print.
        if (href && !current) {
            return (
                <Button key={p} asChild variant="outline" size="sm" className={cls}>
                    <a href={href(p)}>{p}</a>
                </Button>
            );
        }
        return (
            <Button key={p} variant={current ? 'default' : 'outline'} size="sm" className={cls}
                    aria-current={current ? 'page' : undefined}
                    onClick={!current && onPage ? () => onPage(p) : undefined}
                    disabled={current && !onPage && !href}>
                {p}
            </Button>
        );
    };

    return (
        <nav aria-label={label} className={cn('flex flex-wrap items-center justify-center gap-1.5 py-4', className)}>
            {step(page - 1, 'prev', page <= 1)}
            {items.map((it, i) =>
                it === 'gap'
                    ? <span key={`gap${i}`} aria-hidden="true" className="w-9 select-none text-center text-muted-foreground">…</span>
                    : num(it),
            )}
            {step(page + 1, 'next', page >= pages)}
        </nav>
    );
}
