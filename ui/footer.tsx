import * as React from 'react';
import Link from 'next/link';
import { cn } from './lib/cn';

// The site footer. Three apps had one; all three opened with a byte-identical
// <footer className="border-t border-border bg-muted/50">, then diverged into
// 89, 91 and 129 lines of the same shape — a brand column, then link columns,
// then a bottom rule.
//
// All three also hand-rolled the lockup one more time. The header wordmarks were
// unified earlier and these were missed, so `BIT<span>FINITE</span>` survived in
// exactly three places: here. Passing `brand` as a node lets each app render the
// shared <Wordmark /> and finally retire the last copies.
//
// Links are DATA rather than children. That is what makes three footers one
// component: the columns differ in content (explorer and ckstats carry three,
// web five) but never in treatment, and treatment is the part that drifts.

export interface FooterLink {
    label: string;
    href: string;
    /** Opens in a new tab, with the rel that has to accompany it. */
    external?: boolean;
}

export interface FooterColumn {
    title: string;
    links?: FooterLink[];
    /** For a column that is not a link list — the social row, a form, a note. */
    content?: React.ReactNode;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    /** Lockup, blurb and contact lines — the first column. */
    brand?: React.ReactNode;
    columns?: FooterColumn[];
    /** Copyright, legal, build stamp. Sits under a rule. */
    bottom?: React.ReactNode;
    maxWidth?: number | string;
}

function FooterAnchor({ link }: { link: FooterLink }) {
    const cls = 'hover:text-primary transition-colors';
    // A real <a> for anything leaving the app: next/link prefetching a third
    // party is pointless, and the noopener/noreferrer pair has to travel with
    // target="_blank" rather than be remembered at each call site.
    return link.external ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>{link.label}</a>
    ) : (
        <Link href={link.href} className={cls}>{link.label}</Link>
    );
}

export function Footer({ brand, columns = [], bottom, maxWidth = 1600, className, ...props }: FooterProps) {
    // The brand column occupies one cell, so the grid is columns + 1 when a brand
    // is present. Explicit values because Tailwind cannot see a computed class.
    const cells = (brand ? 1 : 0) + columns.length;
    const cols = cells >= 5 ? 'md:grid-cols-5' : cells === 4 ? 'md:grid-cols-4' : cells === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

    return (
        <footer className={cn('border-t border-border bg-muted/50', className)} {...props}>
            <div
                className="mx-auto px-6 py-12 md:px-10"
                style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
            >
                <div className={cn('grid grid-cols-1 gap-8', cols)}>
                    {brand && <div className="min-w-0">{brand}</div>}
                    {columns.map((c) => (
                        <div key={c.title} className="min-w-0">
                            <h3 className="mb-4 font-semibold">{c.title}</h3>
                            {c.links && (
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {c.links.map((l) => (
                                        <li key={`${l.label}-${l.href}`}><FooterAnchor link={l} /></li>
                                    ))}
                                </ul>
                            )}
                            {c.content}
                        </div>
                    ))}
                </div>
                {bottom && (
                    <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
                        {bottom}
                    </div>
                )}
            </div>
        </footer>
    );
}

export default Footer;
