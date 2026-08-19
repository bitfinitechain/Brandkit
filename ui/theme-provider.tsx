'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Our next-themes configuration, in one place.
//
// Three apps mounted this with byte-identical props — attribute="class",
// defaultTheme="dark", enableSystem, disableTransitionOnChange — which is four
// decisions repeated three times and three chances to change one of them by
// accident. They are defaults here now, still overridable per app.
//
// NOT exported from the package index, and that is deliberate. This is the one
// component with a dependency the whole platform does not share: analytics
// drives theme through its own `bfx-ops-ui` key and a pre-paint script and has
// no next-themes at all. An index export pulls the whole module graph, so
// analytics would have had to install a library it never uses just to import a
// Wordmark. Reach it by subpath instead:
//
//     import { ThemeProvider } from '@bitfinitechain/brandkit/ui/theme-provider';
//
// disableTransitionOnChange is the one worth keeping: without it every element
// with a colour transition animates on theme flip, so the whole page smears
// rather than switching.
export function ThemeProvider({
    children,
    attribute = 'class',
    defaultTheme = 'dark',
    enableSystem = true,
    disableTransitionOnChange = true,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
            disableTransitionOnChange={disableTransitionOnChange}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;
