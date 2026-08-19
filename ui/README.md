# Brandkit UI

Components we own, shared across projects the same way the design skill is: a
canonical copy here, pushed out by `skills/sync.sh`. Each copy is a **generated
artifact** stamped with a pointer home — edit here, never in a consuming repo.

These are *not* shadcn components. shadcn primitives (button, badge, tooltip,
popover) are vendored per-repo by its CLI and can be re-fetched at any time.
These are ours, they encode defects we have already shipped and fixed, and they
have no upstream to fall back to.

## What is here, and what it replaced

| component | replaced |
|---|---|
| `stat.tsx` — `Stat`, `StatGrid` | 5 near-identical stat tiles (`Kpi`, `StatCell`, `Stat`, `Mini`, plus the status page's own) |
| `theme-toggle.tsx` — `ThemeToggle` | 4 theme buttons that had drifted into two different-looking controls |
| `data-table.tsx` — `DataTable`, `DataRow`, `DataEmpty` | 7 grid-table implementations (`CardTable`/`CardTRow`, `TableWrap`/`THead`/`TRow`, `ERow`/`BRow`) |

Those numbers are the reason these exist. The five stat tiles had already
drifted — only some carried a tone, only some had a sub-line, and **not one of
them could express "degraded"**, which is why a miner with half its workers
offline rendered in the healthy colour. `ERow` and `BRow` were byte-identical
apart from a grid-template string.

## Prerequisites — the contract

A consuming repo must provide all three, or these will not compile and will not
theme. `skills/sync.sh` checks for the first and skips the repo if it is absent.

**1. `cn()` at `@/lib/utils`** — `twMerge(clsx(...))`, so a caller's class beats a
variant's instead of fighting it on specificity.

**2. Tailwind v4 with `@theme inline`** mapping these token names. `inline`
matters: without it Tailwind emits a second indirection and opacity modifiers
break through an alias.

```css
@theme inline {
  --color-fg: var(--fg);       --color-fg2: var(--fg2);
  --color-mut: var(--mut);     --color-line: var(--line);
  --color-cardbg: var(--cardbg);
  --color-acc: var(--acc);     --color-ok: var(--ok);
  --color-warn: var(--warn);   --color-bad: var(--bad);
  --radius-lg: var(--r);       --radius-sm: var(--r2);
  --font-mono: …;
}
```

**3. Two UI modes, if you want them.** `--r`/`--r2` are read through the radius
scale, so `rounded-lg` is 14px in a rounded mode and 0 in a flat one with no
conditional at the call site. A project with one mode just sets them to fixed
values — nothing here assumes two.

Optional: `.ops-only-sm`, the utility that reveals the scroll affordance at the
width where these tables actually overflow. Without it the affordance is always
visible, which is harmless but noisy.

## Why these are worth copying rather than re-deriving

`DataTable` bakes in every containment lesson this codebase has paid for, so a
call site cannot forget one:

- `overscroll-behavior-x: contain` on the scroller — otherwise a sideways fling
  at the end of a wide table chains into page navigation;
- `min-w-0` on the wrapper — a grid or flex child defaults to `min-width: auto`
  and will not shrink below its content, which silently disables the scroller;
- `width: auto; min-width: <min>` inside, never `width: 100%`, which crushes the
  table back and squashes the columns;
- an affordance when it scrolls — a silent scroller reads as truncated data,
  which is how an admin once reported three of seven columns as "missing";
- `tabular-nums`, so a column of figures does not shift as it updates;
- a navigable row renders as an `<a>`, not a `div` with `onClick`, so it is
  focusable and openable in a new tab.

`Stat` carries the tone vocabulary — `ok` / `warn` / `bad` / `accent` / `muted` —
whose absence was itself the bug: a tile that cannot say "degraded" forces every
partial failure into either "fine" or "down".

## Updating

Edit here, then `bash skills/sync.sh`. Verify across **both UI modes and both
themes** before pushing — every theming bug found in this codebase was invisible
in one combination and obvious in another.

## The colour contract

A component here may only use these colour names. All four apps define every one
of them; each app chooses its own values behind them.

    background   foreground        card      card-foreground
    popover      popover-foreground primary  primary-foreground
    secondary    secondary-foreground muted  muted-foreground
    accent       accent-foreground  destructive  destructive-foreground
    border       input              ring
    success      warning

The last two are the contract's only addition to the shadcn set — shadcn has
`destructive` but no success or warning, and every one of our apps needed them.
Analytics calls them `--ok`/`--warn` internally and aliases them; the other three
already used `--success`/`--warning`.

**Why this is enforced rather than documented.** `stat.tsx` shipped written
against `bg-cardbg`, `border-line`, `text-fg`, `text-acc` — names that exist only
in analytics. Installed anywhere else it would have rendered with no background,
no border and inherited text, while the build passed and the page loaded.
Nothing would have reported it. `scripts/check-contract.sh` fails on any colour
name outside the list above, because a component in here is a promise that it
works in all four apps.

Adding a name means adding it to this list **and** defining it in all four apps
first. A component that ships ahead of its token is invisible breakage.

## Packaging

Consumed as `@bitfinitechain/brandkit`. Source `.tsx` ships as-is — there is no
build step and therefore no stale artifact — so a consuming app needs two lines:

    // next.config.ts
    transpilePackages: ['@bitfinitechain/brandkit'],

    /* globals.css — Tailwind v4 does not scan node_modules, so without this a
       class used only inside a component is never generated */
    @source "../node_modules/@bitfinitechain/brandkit/ui";

Components import `cn` from `./lib/cn` inside the package, never from
`@/lib/utils`. That alias is the consuming app's and does not exist under
node_modules; each app still keeps its own copy for its own code and for the
shadcn primitives it vendors.

## Presentational, not stateful

`ThemeToggle` takes `theme` and `onToggle` rather than reading either itself.
Three apps drive theme through `next-themes`; analytics through its own
`bfx-ops-ui` key and a pre-paint script on `<html>`. A component that imported
`next-themes` could never ship to analytics without replacing a working theme
system, so the component owns the button and each app keeps its own wiring.

That is the general rule here: share the thing that was actually duplicated. The
button was copied four times. The state management never was — it differs for
reasons, and forcing it into one shape would be a migration disguised as a
component.
