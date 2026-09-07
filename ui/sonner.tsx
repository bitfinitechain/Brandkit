'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';

/**
 * Transient messages. Adapted from shadcn/ui (MIT), on sonner.
 *
 * shadcn's own Toast was retired in favour of this, so this is the current
 * shape rather than the deprecated one.
 *
 * Colours come from the kit's tokens rather than sonner's defaults, so a toast
 * matches the app it interrupts, and the theme follows next-themes so it is
 * correct in both without the caller passing anything.
 *
 * A toast is the wrong home for anything the user must act on or might need
 * again: it disappears, and it is announced once. Use Alert for those.
 */
export function Toaster({ ...props }: ToasterProps) {
    const { theme = 'system' } = useTheme();
    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            style={{
                '--normal-bg': 'var(--card)',
                '--normal-text': 'var(--foreground)',
                '--normal-border': 'var(--border)',
            } as React.CSSProperties}
            {...props}
        />
    );
}

export { toast };
