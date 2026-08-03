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
