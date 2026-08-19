import * as React from 'react';
import { MessagesSquare } from 'lucide-react';
import { cn } from './lib/cn';

// The social row, and the canonical BFX URLs behind it.
//
// Three footers each carried these five links with the same three hand-inlined
// SVG paths — X, Telegram and Discord have no lucide equivalent, so every app
// pasted the vector. Changing a handle meant finding three files, and the marks
// could drift silently because nothing compares path data across repos.
//
// The URLs are brand facts, so they live here as defaults rather than being
// retyped per app. Override any of them per site if that ever stops being true.
//
// Bitcointalk is in the set deliberately: Discord and Telegram exist but are
// unstaffed, so the announcement thread is where support actually happens.
export const BFX_SOCIALS = {
    x: 'https://x.com/bitfinitechain',
    github: 'https://github.com/bitfinitechain',
    telegram: 'https://t.me/bitfinitechain',
    discord: 'https://discord.gg/8yjGUwQQcF',
    bitcointalk: 'https://bitcointalk.org/index.php?topic=5589136',
} as const;

export type SocialKey = keyof typeof BFX_SOCIALS;

const SVG = {
    x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
    discord: 'M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.197.373.291a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
} as const;

// GitHub is inlined rather than imported. lucide REMOVED its brand icons in
// v1 — Brandkit's own dev install pulled 1.32.0 and `Github` was simply gone,
// while the apps sit on 0.561 where it still exists. A peer range that allows
// both would let any app break this component by upgrading a dependency that
// has nothing to do with it. The path data is lucide 0.561's, so the mark is
// unchanged; it is a STROKE icon, unlike the three filled marks below.
const GITHUB_PATHS = [
    'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
    'M9 18c-4.51 2-5-2-7-2',
];

function StrokeMark({ paths, label }: { paths: readonly string[]; label: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
             strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true" role="img">
            <title>{label}</title>
            {paths.map((d) => <path key={d} d={d} />)}
        </svg>
    );
}

function Mark({ d, label }: { d: string; label: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true" role="img">
            <title>{label}</title>
            <path d={d} />
        </svg>
    );
}

export interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Which to show, in order. Defaults to all five. */
    only?: readonly SocialKey[];
    /** Per-site overrides for any handle that differs. */
    urls?: Partial<Record<SocialKey, string>>;
}

const LABEL: Record<SocialKey, string> = {
    x: 'X', github: 'GitHub', telegram: 'Telegram',
    discord: 'Discord', bitcointalk: 'Bitcointalk announcement thread',
};

export function SocialLinks({ only, urls, className, ...props }: SocialLinksProps) {
    const keys = (only ?? (Object.keys(BFX_SOCIALS) as SocialKey[]));
    return (
        <div className={cn('flex space-x-4', className)} {...props}>
            {keys.map((k) => (
                <a
                    key={k}
                    href={urls?.[k] ?? BFX_SOCIALS[k]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={LABEL[k]}
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    {k === 'github' ? <StrokeMark paths={GITHUB_PATHS} label={LABEL.github} />
                        : k === 'bitcointalk' ? <MessagesSquare className="w-5 h-5" aria-hidden="true" />
                        : <Mark d={SVG[k]} label={LABEL[k]} />}
                    <span className="sr-only">{LABEL[k]}</span>
                </a>
            ))}
        </div>
    );
}

export default SocialLinks;
