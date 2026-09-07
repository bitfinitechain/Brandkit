#!/usr/bin/env bash
#
# Push the canonical skills in this directory out to each project's
# .claude/skills/ so Claude Code can load them per-repo.
#
# Copies, not symlinks: a symlink into a sibling checkout does not survive a
# clone, and the copies must work for anyone who checks out one repo alone.
# Each copy is therefore a GENERATED artifact and is stamped as such — we have
# been bitten twice by a definition that existed in two places and drifted
# (the Role union across three files, Earnings across two), so the header tells
# an editor where the real file is before they change the wrong one.
#
# Usage:  bash skills/sync.sh            # sync to the standard set
#         bash skills/sync.sh ../foo     # sync to specific repos instead
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BRANDKIT="$(dirname "$HERE")"
SIBLINGS="$(dirname "$BRANDKIT")"

TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=(
    "$SIBLINGS/bitfinite-analytics"
    "$SIBLINGS/bitfinite-explorer"
    "$SIBLINGS/bitfinite-web"
    "$SIBLINGS/ckstats-bfx"
    "$SIBLINGS/bitfinite-wallet"
    "$SIBLINGS/bitfinite-webwallet"
  )
fi

STAMP="<!-- GENERATED — do not edit here.
     Canonical: Brandkit/skills/web-design-guidelines/SKILL.md
     Update that file, then run: bash skills/sync.sh -->"

synced=0
for skill in "$HERE"/*/; do
  name="$(basename "$skill")"
  [ -f "$skill/SKILL.md" ] || continue
  for target in "${TARGETS[@]}"; do
    [ -d "$target" ] || { printf '  skip   %-22s (no such repo)\n' "$(basename "$target")"; continue; }
    dest="$target/.claude/skills/$name"
    mkdir -p "$dest"
    # Stamp goes after the YAML frontmatter so the block stays parseable.
    awk -v stamp="$STAMP" '
      NR==1 && $0=="---" { print; infm=1; next }
      infm && $0=="---"   { print; print ""; print stamp; infm=0; next }
      { print }
    ' "$skill/SKILL.md" > "$dest/SKILL.md"
    printf '  synced %-22s <- %s\n' "$(basename "$target")" "$name"
    synced=$((synced + 1))
  done
done

echo "==> $synced skill copy(ies) written"

# ── Brandkit UI components ──────────────────────────────────────────────────
# Same copy-in model as the skills, with one extra rule: a component that needs
# the contract in ui/README.md (cn() at lib/utils, the @theme inline token
# mapping) is SKIPPED in a repo that has not been bridged, rather than handed
# over and breaking that repo's build. Components with no such dependency go
# everywhere — see the per-file gate below.
#
# Only the files Brandkit owns are copied. shadcn primitives (button, badge,
# tooltip, popover) live in the same directory but are vendored per-repo by its
# own CLI, and clobbering those with a stale copy is exactly the silent overwrite
# the header stamp exists to warn about.
UI_DIR="$BRANDKIT/ui"
ui_synced=0
# The gate below used to be per-REPO: no lib/utils.ts meant the whole ui/
# directory was skipped. But the dependency is per-COMPONENT — wordmark.tsx
# imports nothing but React, while stat.tsx and data-table.tsx need cn() and cva.
# So the coarse gate kept the single most brand-critical component out of three
# of the four apps, and all three went on hand-rolling their own lockup until
# they disagreed about which half of the word carries the accent. Gate each file
# on what it actually imports.
if [ -d "$UI_DIR" ]; then
  for target in "${TARGETS[@]}"; do
    name="$(basename "$target")"
    [ -d "$target" ] || continue
    # Follow the repo's own layout rather than assuming a root components/ —
    # web and ckstats keep theirs under src/, and a second components/ tree at
    # the root would be invisible to their path aliases.
    if [ -d "$target/src/components" ]; then dest="$target/src/components/ui"
    else dest="$target/components/ui"; fi
    # React components only. bitfinite-wallet is Flutter and bitfinite-webwallet
    # is Vue/Quasar — a .tsx is dead weight in both. The old per-repo bridge gate
    # excluded them by accident; now that the gate is per-file, say it on purpose.
    if ! grep -qE '"react"[[:space:]]*:' "$target/package.json" 2>/dev/null; then
      printf '  skip   %-22s (not a React app)\n' "$name"
      continue
    fi
    mkdir -p "$dest"
    # Check each dependency separately. cn() and cva are two different things and
    # a repo can have one without the other — ckstats has src/lib/utils.ts but no
    # class-variance-authority, so treating "has lib/utils.ts" as "is bridged"
    # shipped it a component it could not compile.
    wrote=0; skipped=""
    for f in "$UI_DIR"/*.tsx; do
      [ -e "$f" ] || continue
      base="$(basename "$f")"
      # A component only travels to a repo that can COMPILE it.
      #
      # This used to name the awkward dependencies one at a time - cva, then
      # next-themes, then recharts - and each was added the day a vendored file
      # broke a consumer's build. Once the kit grew Radix-backed components the
      # list was hopeless: analytics gained twenty files importing packages it
      # has never installed, and tsc failed on every one.
      #
      # So the gate reads the imports instead of guessing them. Every bare
      # module a component imports has to be in the target's package.json, with
      # the exception of what every BFX app has by construction (react, next,
      # lucide-react) and the package's own relative imports.
      #
      # A skipped component is not lost: the app imports it from
      # '@bitfinitechain/brandkit', where pnpm resolves the package's OWN
      # dependencies. Vendoring is the fallback, not the contract.
      need=""
      # Both quote styles: the files promoted from shadcn use double quotes and
      # the ones written here use single, and a gate that reads only one of them
      # waves the other straight through.
      for mod in $(grep -oE "from ['\"][^.@/][^'\"]*['\"]|from ['\"]@[^/'\"]+/[^'\"]+['\"]" "$f" \
                   | sed -E "s/^from ['\"]//; s/['\"]$//" | sort -u); do
        case "$mod" in
          react|react-dom|react/*|react-dom/*|next|next/*|lucide-react) continue ;;
        esac
        grep -q "\"$mod\"" "$target/package.json" 2>/dev/null || need="$need $mod"
      done
      if [ -n "$need" ]; then skipped="$skipped $base($(echo $need | tr ' ' ','))"; continue; fi
      {
        echo "// GENERATED — do not edit here."
        echo "// Canonical: Brandkit/ui/$base   ·   update there, then: bash skills/sync.sh"
        cat "$f"
      } > "$dest/$base"
      wrote=$((wrote + 1)); ui_synced=$((ui_synced + 1))
    done

    # A component whose SIBLING was skipped cannot compile either.
    #
    # Combobox is popover plus command, and DatePicker is popover plus calendar;
    # both survived the import gate because their own dependencies are fine, and
    # both then failed on "cannot find module './command'". So this runs to a
    # fixpoint: drop anything importing a sibling that is not there, and repeat,
    # because dropping one can orphan the next.
    changed=1
    while [ "$changed" -eq 1 ]; do
      changed=0
      for g in "$dest"/*.tsx; do
        [ -e "$g" ] || continue
        gbase="$(basename "$g")"
        for sib in $(grep -oE "from '\./[a-z0-9-]+'" "$g" | sed "s|^from './||; s|'$||" | sort -u); do
          [ -f "$dest/$sib.tsx" ] && continue
          [ -f "$UI_DIR/$sib.tsx" ] || continue      # not a component: leave it alone
          rm -f "$g"
          skipped="$skipped $gbase(needs $sib)"
          wrote=$((wrote - 1)); ui_synced=$((ui_synced - 1))
          changed=1
          break
        done
      done
    done
    # The package's internal helpers travel with the components that import them.
    # Missing this is a build break, not a style regression: a synced stat.tsx
    # importing './lib/cn' against an app that has no ui/lib/ simply fails to
    # resolve.
    if [ "$wrote" -gt 0 ] && [ -d "$UI_DIR/lib" ]; then
      mkdir -p "$dest/lib"
      for f in "$UI_DIR"/lib/*.ts; do
        [ -e "$f" ] || continue
        base="$(basename "$f")"
        {
          echo "// GENERATED — do not edit here."
          echo "// Canonical: Brandkit/ui/lib/$base   ·   update there, then: bash skills/sync.sh"
          cat "$f"
        } > "$dest/lib/$base"
      done
    fi

    # Stylesheets that belong to those components travel with them.
    for f in "$UI_DIR"/*.css; do
      [ -e "$f" ] || continue
      base="$(basename "$f")"
      [ -f "$dest/${base%.css}.tsx" ] || continue     # only if its component landed
      {
        echo "/* GENERATED — do not edit here."
        echo "   Canonical: Brandkit/ui/$base   ·   update there, then: bash skills/sync.sh */"
        cat "$f"
      } > "$dest/$base"
    done
    printf '  synced %-22s %s component(s)%s\n' "$name" "$wrote" \
      "$([ -n "$skipped" ] && echo " · skipped:$skipped — see Brandkit/ui/README.md")"
  done
fi
echo "==> $ui_synced ui component copy(ies) written"
echo "    Canonical lives in Brandkit; edit there and re-run this script."
