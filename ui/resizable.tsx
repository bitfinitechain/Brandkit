'use client';

import * as React from 'react';
import { GripVertical } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { cn } from './lib/cn';

/**
 * Panels a reader can resize. Adapted from shadcn/ui (MIT).
 *
 * Written against react-resizable-panels v4, which renamed PanelGroup to Group
 * and PanelResizeHandle to Separator, and takes `orientation` where the old API
 * took `direction`. The shadcn recipe still targets the v3 names; the exported
 * names here keep the shadcn shape so a caller copying from those docs finds
 * what they expect, and only the inside had to change.
 */
export function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
    return (
        <Group
            data-slot="resizable-panel-group"
            className={cn('flex size-full data-[orientation=vertical]:flex-col', className)}
            {...props}
        />
    );
}

export const ResizablePanel = Panel;

export function ResizableHandle({
    withHandle, className, ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
    return (
        <Separator
            data-slot="resizable-handle"
            className={cn(
                'relative flex items-center justify-center bg-border',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
                'data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full',
                'data-[orientation=horizontal]:h-full data-[orientation=horizontal]:w-px',
                className,
            )}
            {...props}
        >
            {/* Without the grip a 1px line is a target nobody can find. */}
            {withHandle ? (
                <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-card">
                    <GripVertical className="size-2.5 text-muted-foreground" />
                </div>
            ) : null}
        </Separator>
    );
}
