# design-sync notes — @bitfinitechain/brandkit

Repo-specific gotchas. Read before any re-sync.

## Setup that is NOT in git and must be redone per clone

- **`node_modules/@bitfinitechain/brandkit` self-link.** `cfg.tokensPkg` resolves
  under `node_modules`, so the package must be able to find itself or
  `tokens/tokens.css` never ships and the bundle goes out with an empty
  `tokens/`. Recreate with:
  `mkdir -p node_modules/@bitfinitechain && ln -sfn ../.. node_modules/@bitfinitechain/brandkit`
- **Converter deps**: `(cd .ds-sync && npm i esbuild ts-morph @types/react playwright@1.58.0 @tailwindcss/cli@4)`.
  npm on purpose — the converter dir is deliberately isolated from the repo's pnpm.

## The styling layer is generated, and the sync is wrong without it

**Run `bash .design-sync/build-styles.sh` before every `package-build.mjs`.**

Brandkit's components are Tailwind + shadcn semantic names (`bg-primary`,
`text-primary-foreground`, `--border`). Brandkit ships **neither**: its own
`tokens/tokens.css` defines the `--bfx-*` primitives only, and its header says
outright that each app maps those onto its own semantic names. So the library
cannot render standalone — Button and Input came out blank until this was fixed,
and every design built from an unstyled bundle would be wrong.

`bitfinite-web/src/app/globals.css` is the real mapping and already carries
`@source ".../brandkit/ui"`, so compiling it ships what we actually built rather
than anything invented. The script adds a second `@source` for the LOCAL
`Brandkit/ui`, because the app's own `@source` points at a pinned GitHub tarball
in `node_modules` that can lag this working copy.

## Converter gotchas hit on the first sync

- **`[ZERO_MATCH]` on the first build.** Component discovery reads PascalCase
  exports from a `.d.ts` tree, and Brandkit has no `dist/` (no build script —
  only `check:contract` and `typecheck`). Fixed with an explicit
  `cfg.componentSrcMap` of all 28 exports. **If a component is added to
  `ui/index.ts`, it must be added to `componentSrcMap` too or it silently will
  not sync.** A real build emitting `.d.ts` would remove this whole class of
  problem and is worth considering.
- **`cfg.cssEntry` is appended VERBATIM** into `_ds_bundle.css` — it is not an
  import graph. `ui/styles.css` is an `@import`-only stub, so pointing at it
  shipped four dangling `@import`s and zero real CSS. cssEntry must be a file
  whose *content* is the stylesheet.
- **`cfg.tokensGlob` is ignored unless `cfg.tokensPkg` is set**, and it resolves
  under `node_modules` (hence the self-link). It takes ONE glob, so tokens and
  component CSS cannot both come through it.
- **`ThemeProvider` is deliberately excluded.** `ui/index.ts` omits it on purpose
  ("it imports next-themes, which analytics does not have"). Adding it to
  `componentSrcMap` drags `next-themes` into the bundle. Left out — honour the
  library's own decision.
- **`process is not defined` on every preview.** `Footer` imports `next/link`,
  which reads `process.env.__NEXT_*` at module scope. Fixed with
  `.design-sync/process-shim.js` via `cfg.extraEntries`. The shim's side effect
  hangs off an **exported** binding on purpose: the generated `.bundle-entry.mjs`
  re-exports extras with `export * from`, and a module exporting nothing gets
  tree-shaken away before it runs.
- **playwright must be 1.58.0** — it pins chromium-1208, which is what this
  machine has cached. Latest (1.62) pins 1234 and fails with
  "Executable doesn't exist" rather than downloading.

## Known render warns

All current warns are unauthored previews rendering thin, which is the floor
card working as designed — not defects. Re-check them only after a preview is
authored for that component:

- `[RENDER_BLANK]` AppHeader, Badge, Footer, Input
- `[RENDER_THIN]` ThemeToggle

## Where this run stopped

First sync, 2026-09-03. Build and validate are clean (`✓ bundle is complete`,
28 components, 36 exports).

**The bundle was uploaded BY HAND, not by this tooling.** DesignSync could not
authorise from this session — it runs under the VSCode extension on the Agent
SDK, which the tool treats as non-interactive, so it refused rather than
prompting. `/design-login` was not available either. The user created the
project and added `ds-bundle/`'s contents manually.

Project: https://claude.ai/design/p/5407ec64-0688-45e2-8a53-f33fd00a7d25
`cfg.projectId` is pinned to it so the next run adopts this project instead of
creating a duplicate and orphaning it.

**Nothing about that project has been verified from here** — not its type, not
its file list, not that the cards registered. The first authorised run should
`list_files` it before trusting the anchor, and treat a surprising diff as the
manual upload having missed or added files rather than as drift.

All 28 components ship fully functional with prop contracts and usage notes;
13 are on floor cards because preview authoring was stopped as not worth the
cost while the upload path was closed. Authored previews carry forward, so a
later run resumes exactly here.

To pick this up: authorise, then §1 creates a project and the run goes down the
incremental path. Nothing here needs redoing — but re-run `build-styles.sh`
first, and recreate the node_modules self-link if this is a fresh clone.

## Re-sync risks

- **`.design-sync/brandkit-styles.css` is generated and committed.** It goes
  stale whenever `bitfinite-web/src/app/globals.css`, `Brandkit/tokens/tokens.css`
  or any `ui/*.css` changes. Always regenerate; never hand-edit.
- **It couples Brandkit's sync to bitfinite-web.** If that app is restructured or
  its globals.css moves, `build-styles.sh` breaks. It hardcodes
  `../bitfinite-web`, so the two repos must stay siblings.
- **`componentSrcMap` is a full enumeration**, so it rots on every component add
  or rename. Check it against `ui/index.ts` on each re-sync.
- **The Tailwind layer is bitfinite-web's**, so it carries that app's look. If
  ckstats or analytics diverge meaningfully, a design built from this bundle will
  follow web rather than them.
