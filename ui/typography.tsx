import * as React from 'react';

import { cn } from './lib/cn';

/**
 * Long-form prose, on the house type scale.
 *
 * shadcn documents Typography as a page of example markup rather than shipping
 * a component. That is fine for a docs site and useless for us: the whole point
 * here is that a release note or a help page does not get its own hand-set
 * heading sizes. This is the scale as one wrapper, applied to whatever HTML it
 * is given.
 *
 * Sizes come from the Brandkit scale, so `pnpm check:type` in the apps keeps
 * passing over anything rendered inside it.
 */
export function Prose({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="prose"
            className={cn(
                'text-sm leading-relaxed text-foreground',
                '[&_p]:my-3 [&_p]:text-muted-foreground',
                '[&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight',
                '[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight',
                '[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold',
                '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5',
                '[&_li]:my-1 [&_li]:text-muted-foreground',
                '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
                '[&_code]:rounded [&_code]:bg-panel2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]',
                '[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground',
                '[&_hr]:my-6 [&_hr]:border-border',
                '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
                className,
            )}
            {...props}
        />
    );
}
