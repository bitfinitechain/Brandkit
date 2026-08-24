import * as React from 'react';

import { cn } from './lib/cn';
import { Wordmark } from './wordmark';

// 230px navigation rail: brand lockup, then grouped items under mono labels.
//
// The brand is <Wordmark />, not a fourth hand-rolled BIT/FINITE. The design
// reference inlines the lockup because a static HTML prototype has nothing to
// import; in this package it would be the same duplication the footer comment
// warns about, and the one that already drifted three times.
export interface SidebarItem {
    label: React.ReactNode;
    /** Present = a real <a>. Absent = a <button> that calls onSelect. */
    href?: string;
    onSelect?: () => void;
    active?: boolean;
    /** Small trailing count. Formatted by the caller — the rail does not do units. */
    badge?: React.ReactNode;
    disabled?: boolean;
}

export interface SidebarGroup {
    title?: React.ReactNode;
    items: SidebarItem[];
}

export interface SidebarProps extends React.ComponentProps<'nav'> {
    groups: SidebarGroup[];
    /** Suffix beside the wordmark — "explorer", "pool", "analytics". */
    suffix?: string;
    /** Replace the default lockup entirely. */
    brand?: React.ReactNode;
}

function Item({ item }: { item: SidebarItem }) {
    const cls = cn(
        'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40',
        item.active
            ? 'bg-card font-semibold text-foreground'
            : 'font-normal text-muted-foreground hover:bg-card hover:text-foreground',
        item.disabled && 'pointer-events-none opacity-50',
    );

    const body = (
        <>
            {/* The dot is the active marker. It stays in the layout when inactive so
                labels do not shift by 13px as you move between items. */}
            <span
                aria-hidden="true"
                className={cn('h-[5px] w-[5px] shrink-0 rounded-full', item.active ? 'bg-primary' : 'bg-transparent')}
            />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge != null ? (
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">{item.badge}</span>
            ) : null}
        </>
    );

    // A rail entry that changes the page is a link: middle-click, open-in-new-tab
    // and "copy link address" all work, and none of them do on a button.
    return item.href ? (
        <a href={item.href} aria-current={item.active ? 'page' : undefined} className={cls}>
            {body}
        </a>
    ) : (
        <button type="button" onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} disabled={item.disabled} className={cls}>
            {body}
        </button>
    );
}

export function Sidebar({ groups, suffix, brand, className, ...props }: SidebarProps) {
    return (
        <nav
            aria-label="Sidebar"
            className={cn('flex w-[230px] flex-col gap-1 border-r border-border bg-background px-2.5 py-4 text-foreground', className)}
            {...props}
        >
            <span className="px-2.5 pb-3.5 pt-1">
                {brand ?? <Wordmark suffix={suffix} size="sm" />}
            </span>
            {groups.map((g, gi) => (
                <React.Fragment key={gi}>
                    {g.title ? (
                        <span className="px-2.5 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            {g.title}
                        </span>
                    ) : null}
                    {g.items.map((it, ii) => <Item key={ii} item={it} />)}
                </React.Fragment>
            ))}
        </nav>
    );
}

export default Sidebar;
