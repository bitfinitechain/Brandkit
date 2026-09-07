import * as React from 'react';

import { cn } from './lib/cn';
import { Label } from './label';

/**
 * A labelled form control with its description and error.
 *
 * Adapted from shadcn/ui (MIT). The reason to use it over a bare Label: it
 * WIRES the parts up. The description and the error get ids, the control gets
 * aria-describedby and aria-invalid, and the error is a live region. Doing that
 * by hand is the step that gets skipped, which is how a form ends up showing a
 * red message no screen reader ever announces.
 */
export interface FieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
    label?: React.ReactNode;
    description?: React.ReactNode;
    /** Present means invalid: it sets aria-invalid on the control and announces. */
    error?: React.ReactNode;
    /** Receives the ids to wire onto the control. */
    children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => React.ReactNode;
}

export function Field({ label, description, error, children, className, ...props }: FieldProps) {
    const id = React.useId();
    const descId = description ? `${id}-description` : undefined;
    const errId = error ? `${id}-error` : undefined;
    const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

    return (
        <div data-slot="field" className={cn('flex flex-col gap-2', className)} {...props}>
            {label ? <Label htmlFor={id}>{label}</Label> : null}
            {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
            {description ? (
                <p id={descId} data-slot="field-description" className="text-sm text-muted-foreground">{description}</p>
            ) : null}
            {error ? (
                <p id={errId} data-slot="field-error" role="alert" className="text-sm text-destructive">{error}</p>
            ) : null}
        </div>
    );
}
