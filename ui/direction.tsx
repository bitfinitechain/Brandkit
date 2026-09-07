'use client';

import * as DirectionPrimitive from '@radix-ui/react-direction';

/**
 * Reading direction for every Radix primitive below it. Adapted from
 * shadcn/ui (MIT).
 *
 * Nothing in BFX ships right-to-left today. It is here so that the day one
 * does, direction is a provider at the root rather than a hunt through every
 * menu and slider for a hardcoded left.
 */
export const DirectionProvider = DirectionPrimitive.Provider;
