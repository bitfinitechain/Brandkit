#!/usr/bin/env bash
#
# Push the canonical platform tokens out to each app.
#
# Same shape as skills/sync.sh, and for the same reason: copies, not symlinks —
# a symlink into a sibling checkout does not survive a clone, and each copy must
# work for anyone who checks out one repo alone. Every copy is a GENERATED
# artifact and is stamped as such, so an editor is told where the real file is
# before they change the wrong one.
#
# The apps do NOT share semantic tokens, only primitives. Each app's globals.css
# maps --bfx-* onto its own names. That mapping is hand-written per app and this
# script never touches it.
#
# Usage:  bash tokens/sync.sh            # sync to the standard set
#         bash tokens/sync.sh --check    # verify copies are current (CI / pre-commit)
#         bash tokens/sync.sh ../foo     # sync to specific repos instead
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BRANDKIT="$(dirname "$HERE")"
SIBLINGS="$(dirname "$BRANDKIT")"
SRC="$HERE/tokens.css"
REL="styles/bfx-tokens.css"          # destination, relative to each repo root

CHECK=0
ARGS=()
for a in "$@"; do
  if [ "$a" = "--check" ]; then CHECK=1; else ARGS+=("$a"); fi
done

TARGETS=("${ARGS[@]+"${ARGS[@]}"}")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=(
    "$SIBLINGS/bitfinite-web"
    "$SIBLINGS/bitfinite-explorer"
    "$SIBLINGS/ckstats-bfx"
    "$SIBLINGS/bitfinite-analytics"
  )
fi

stamp() {
  printf '/* GENERATED — do not edit here.\n   Canonical: Brandkit/tokens/tokens.css\n   Update that file, then run: bash tokens/sync.sh\n*/\n'
  cat "$SRC"
}

rc=0
for repo in "${TARGETS[@]}"; do
  name="$(basename "$repo")"
  if [ ! -d "$repo" ]; then
    printf '  %-22s SKIP (no such directory)\n' "$name"
    continue
  fi
  dest="$repo/$REL"
  if [ "$CHECK" = "1" ]; then
    if [ -f "$dest" ] && stamp | diff -q - "$dest" >/dev/null 2>&1; then
      printf '  %-22s up to date\n' "$name"
    else
      printf '  %-22s STALE — run: bash tokens/sync.sh\n' "$name"
      rc=1
    fi
  else
    mkdir -p "$(dirname "$dest")"
    stamp > "$dest"
    printf '  %-22s -> %s\n' "$name" "$REL"
  fi
done

exit $rc
