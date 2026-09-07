import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * Where you are. Adapted from shadcn/ui (MIT).
 *
 * One deviation: the separator defaults to a 12px lucide chevron rather than a
 * "/" glyph. At this size a slash is three pixels of punctuation and reads as a
 * stray mark rather than a step in a path, which is the same conclusion the
 * analytics chain breadcrumb reached on its own.
 */
export function Breadcrumb(props: React.ComponentProps<'nav'>) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
    return (
        <ol data-slot="breadcrumb-list"
            className={cn('flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', className)}
            {...props} />
    );
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="breadcrumb-item" className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

export function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<'a'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'a';
    return (
        <Comp data-slot="breadcrumb-link"
              className={cn('transition-colors hover:text-foreground', className)} {...props} />
    );
}

/** The current page: not a link, and announced as the current one. */
export function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page"
              className={cn('font-normal text-foreground', className)} {...props} />
    );
}

export function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true"
            className={cn('[&>svg]:size-3', className)} {...props}>
            {children ?? <ChevronRight />}
        </li>
    );
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true"
              className={cn('flex size-9 items-center justify-center', className)} {...props}>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}
