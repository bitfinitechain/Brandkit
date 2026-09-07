import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A person, as a picture or their initials.
 *
 * Adapted from shadcn/ui (MIT) as ONE component rather than upstream's three
 * (Avatar / AvatarImage / AvatarFallback). The three-part API exists to let a
 * caller compose, and every use we have is the same composition: try the
 * picture, fall back to initials. Collapsing it removes the state machine that
 * every hand-rolled copy got wrong, which was showing a broken-image glyph
 * instead of the fallback.
 *
 * The image is decorative: the name is already in the fallback and usually
 * beside it, so alt text would be read twice.
 */
export interface AvatarProps extends React.ComponentProps<'span'> {
    /** Picture URL. A load failure falls back to initials rather than showing a gap. */
    src?: string | null;
    /** Used for the initials and the accessible name. */
    name?: string;
    /** Diameter in px. Default 30, the header size. */
    size?: number;
}

const initials = (name?: string) =>
    (name || '?').trim().split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export function Avatar({ src, name, size = 30, className, ...props }: AvatarProps) {
    const [failed, setFailed] = React.useState(false);
    const show = src && !failed;
    return (
        <span
            data-slot="avatar"
            title={name}
            className={cn(
                'inline-grid shrink-0 place-items-center overflow-hidden rounded-full border border-border',
                'bg-primary font-mono text-[12px] font-semibold text-primary-foreground select-none',
                className,
            )}
            style={{ width: size, height: size }}
            {...props}
        >
            {show
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={src} alt="" width={size} height={size}
                       onError={() => setFailed(true)}
                       className="size-full object-cover" />
                : initials(name)}
        </span>
    );
}
