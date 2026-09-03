#!/usr/bin/env bash
# Regenerate .design-sync/brandkit-styles.css — the stylesheet the sync ships.
#
# WHY THIS EXISTS: Brandkit's components are Tailwind + shadcn semantic names
# (bg-primary, --border). Brandkit ships neither; its own tokens.css defines the
# --bfx-* primitives only, and each app maps them onto semantic names. So the
# library cannot render standalone, and a design built from it would come out
# unstyled. bitfinite-web's globals.css is the real mapping, and already carries
# an @source for Brandkit's ui/, so compiling it is shipping what we built.
#
# RUN THIS BEFORE EVERY package-build.mjs. Its output is cfg.cssEntry.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB="$(cd "$HERE/../bitfinite-web" && pwd)"
CLI="$HERE/.ds-sync/node_modules/.bin/tailwindcss"

[ -x "$CLI" ] || { echo "missing $CLI — run: (cd $HERE/.ds-sync && npm i @tailwindcss/cli@4)"; exit 1; }
[ -f "$WEB/src/app/globals.css" ] || { echo "missing $WEB/src/app/globals.css"; exit 1; }

# Temp input beside globals.css so its relative @imports resolve. The extra
# @source scans the LOCAL Brandkit ui/: the app's own @source points into
# node_modules, at a pinned tarball that can lag this working copy.
IN="$WEB/src/app/.ds-sync-input.css"
trap 'rm -f "$IN"' EXIT
printf '@import "./globals.css";\n@source "%s/ui";\n' "$HERE" > "$IN"
"$CLI" -i "$IN" -o "$HERE/.design-sync/brandkit-styles.css"
echo "wrote .design-sync/brandkit-styles.css ($(wc -c < "$HERE/.design-sync/brandkit-styles.css") bytes)"
