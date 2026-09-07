'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';

import { cn } from './lib/cn';

/**
 * A one-time code, one box per digit. Adapted from shadcn/ui (MIT).
 *
 * The whole thing is ONE input behind the boxes, which is what makes paste,
 * autofill and the iOS SMS suggestion work. Six separate inputs look identical
 * and break all three.
 */
export function InputOTP({ className, containerClassName, ...props }: React.ComponentProps<typeof OTPInput> & { containerClassName?: string }) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
            className={cn('disabled:cursor-not-allowed', className)}
            {...props}
        />
    );
}

export function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="input-otp-group" className={cn('flex items-center', className)} {...props} />;
}

export function InputOTPSlot({ index, className, ...props }: React.ComponentProps<'div'> & { index: number }) {
    const context = React.useContext(OTPInputContext);
    const slot = context?.slots[index];
    return (
        <div
            data-slot="input-otp-slot"
            data-active={slot?.isActive}
            className={cn(
                'relative flex size-9 items-center justify-center border-y border-r border-border text-sm',
                'first:rounded-l-lg first:border-l last:rounded-r-lg',
                'transition-all data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/40',
                className,
            )}
            {...props}
        >
            {slot?.char}
            {slot?.hasFakeCaret ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="bfx-caret h-4 w-px bg-foreground" />
                </div>
            ) : null}
        </div>
    );
}

export function InputOTPSeparator(props: React.ComponentProps<'div'>) {
    return <div data-slot="input-otp-separator" role="separator" {...props}><Minus className="size-4 text-muted-foreground" /></div>;
}
