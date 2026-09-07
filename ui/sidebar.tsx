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
    /** 16px glyph, shown in both states. It is the WHOLE target when collapsed. */
    icon?: React.ReactNode;
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
    /**
     * Icon-only rail: 56px instead of 230px.
     *
     * Labels, group titles, dots and badges are hidden, and every item carries a
     * `title` so the name is still reachable: a collapsed rail that loses its
     * accessible names is a rail nobody can use.
     */
    collapsed?: boolean;
    /** Rendered above the groups, for a collapse control or anything else. */
    header?: React.ReactNode;
}

/** The label as a string, for `title` and the accessible name when collapsed. */
function textOf(node: React.ReactNode): string | undefined {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    return undefined;
}

function Item({ item, collapsed }: { item: SidebarItem; collapsed?: boolean }) {
    const cls = cn(
        'flex w-full items-center rounded-lg text-left text-[13px] transition-colors',
        // Collapsed, the icon IS the target, so it centres and the horizontal
        // padding goes. Expanded keeps the original geometry exactly.
        collapsed ? 'justify-center gap-0 px-0 py-2' : 'gap-2 px-2.5 py-2',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40',
        item.active
            ? 'bg-card font-semibold text-foreground'
            : 'font-normal text-muted-foreground hover:bg-card hover:text-foreground',
        item.disabled && 'pointer-events-none opacity-50',
    );

    const name = textOf(item.label);

    const body = (
        <>
            {/* The dot is the active marker. It stays in the layout when inactive so
                labels do not shift by 13px as you move between items. Collapsed,
                there is no label to shift and the dot would crowd the icon. */}
            {!collapsed && (
                <span
                    aria-hidden="true"
                    className={cn('h-[5px] w-[5px] shrink-0 rounded-full', item.active ? 'bg-primary' : 'bg-transparent')}
                />
            )}
            {item.icon ? <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">{item.icon}</span> : null}
            {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
            {!collapsed && item.badge != null ? (
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">{item.badge}</span>
            ) : null}
            {/* Collapsed, the visible text is gone but the name must not be. */}
            {collapsed && name ? <span className="sr-only">{name}</span> : null}
        </>
    );

    // A rail entry that changes the page is a link: middle-click, open-in-new-tab
    // and "copy link address" all work, and none of them do on a button.
    return item.href ? (
        <a href={item.href} title={name} aria-current={item.active ? 'page' : undefined} className={cls}>
            {body}
        </a>
    ) : (
        <button type="button" title={name} onClick={item.onSelect} aria-current={item.active ? 'page' : undefined} disabled={item.disabled} className={cls}>
            {body}
        </button>
    );
}

export function Sidebar({ groups, suffix, brand, collapsed, header, className, ...props }: SidebarProps) {
    return (
        <nav
            aria-label="Sidebar"
            className={cn(
                // border-box is load-bearing: the rail declares a width AND has
                // padding and a 1px border, so without it the column renders 21px
                // wider than the number says and the content beside it shifts.
                'box-border flex flex-col gap-1 border-r border-border bg-background text-foreground',
                collapsed ? 'w-14 px-1.5 py-4' : 'w-[230px] px-2.5 py-4',
                className,
            )}
            {...props}
        >
            {header}
            {/* No brand when collapsed: a 56px column cannot hold a lockup, and a
                cropped one reads as a broken image rather than a mark. */}
            {!collapsed && (brand !== undefined || suffix !== undefined) ? (
                <span className="px-2.5 pb-3.5 pt-1">
                    {brand ?? <Wordmark suffix={suffix} size="sm" />}
                </span>
            ) : null}
            {groups.map((g, gi) => (
                <React.Fragment key={gi}>
                    {/* The group title is what separates one group from the next.
                        Collapsed there is no title, so without this the groups run
                        together as one undifferentiated column of glyphs. */}
                    {collapsed && gi > 0 ? (
                        <span aria-hidden="true" className="mx-2 my-1.5 border-t border-border" />
                    ) : null}
                    {g.title && !collapsed ? (
                        <span className="px-2.5 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                            {g.title}
                        </span>
                    ) : null}
                    {g.items.map((it, ii) => <Item key={ii} item={it} collapsed={collapsed} />)}
                </React.Fragment>
            ))}
        </nav>
    );
}

export default Sidebar;
