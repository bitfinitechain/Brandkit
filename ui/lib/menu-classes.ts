/**
 * The shared look of every menu surface in the kit.
 *
 * Dropdown, context menu, menubar and the command palette are four different
 * behaviours wearing one design. Upstream repeats these strings in each file,
 * which is how four menus end up with three paddings; here they are written
 * once and imported.
 */
export const menuContent =
    'bfx-pop z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg';

export const menuItem =
    'relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none ' +
    'transition-colors focus:bg-accent focus:text-accent-foreground ' +
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0';

export const menuItemDestructive =
    'text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive';

/** Indented, to leave room for the check or the dot. */
export const menuItemIndented = 'pl-8';

export const menuLabel = 'px-2 py-1.5 text-xs font-medium text-muted-foreground';
export const menuSeparator = '-mx-1 my-1 h-px bg-border';
export const menuShortcut = 'ml-auto font-mono text-xs tracking-widest text-muted-foreground';
/** The box a check or a radio dot sits in, inside an indented item. */
export const menuIndicator = 'absolute left-2 flex size-4 items-center justify-center';
