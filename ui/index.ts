// Public surface of @bitfinitechain/brandkit.
//
// One entry point rather than deep paths, so an app writes
//   import { Wordmark, Stat } from '@bitfinitechain/brandkit';
// and the package can move files around without breaking every consumer.
//
// CSS is NOT imported here. A component's styles ship as a stylesheet the app
// imports once from its own globals (`@import "@bitfinitechain/brandkit/styles.css"`),
// because bundling CSS into a JS import order that four different apps control
// is how you get a component whose styles win in one app and lose in another.
export { Wordmark } from './wordmark';
export { Stat, StatGrid } from './stat';
export { ThemeToggle, type ThemeToggleProps } from './theme-toggle';
export { AppHeader, type AppHeaderProps } from './app-header';
export { SocialLinks, BFX_SOCIALS, type SocialLinksProps, type SocialKey } from './social-links';
export { Footer, type FooterProps, type FooterColumn, type FooterLink } from './footer';
// ThemeProvider is NOT here on purpose — it imports next-themes, which analytics
// does not have. Subpath: '@bitfinitechain/brandkit/ui/theme-provider'.
export { DataTable, DataRow, DataEmpty } from './data-table';
export { cn } from './lib/cn';
