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

echo "==> $synced copy(ies) written"
echo "    Canonical lives in Brandkit; edit there and re-run this script."
