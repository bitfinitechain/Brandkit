import * as React from 'react';

import { cn } from './lib/cn';

/**
 * A semantic table. Adapted from shadcn/ui (MIT).
 *
 * DataTable in this kit is the opinionated one: a card with a header row, a
 * swipe hint and its own grid. This is the plain primitive underneath, for when
 * you want real <table> semantics and nothing else. Reach for DataTable first.
 *
 * The wrapper scrolls rather than squashing, because a table that squashes
 * drops the column that identifies the row.
 */
export function Table({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div data-slot="table-container" className="relative w-full overflow-x-auto overscroll-x-contain">
            <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    );
}

export function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead data-slot="table-header" className={cn('[&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
    return (
        <tfoot data-slot="table-footer"
               className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
    );
}

export function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr data-slot="table-row"
            className={cn('border-b border-border transition-colors hover:bg-accent data-[state=selected]:bg-muted', className)}
            {...props} />
    );
}

export function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th data-slot="table-head"
            className={cn('h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground', className)}
            {...props} />
    );
}

export function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return (
        <td data-slot="table-cell" className={cn('whitespace-nowrap p-3 align-middle', className)} {...props} />
    );
}

export function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return <caption data-slot="table-caption" className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />;
}
