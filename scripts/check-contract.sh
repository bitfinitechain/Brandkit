#!/usr/bin/env bash
# ============================================================================
# Fails if a shared component uses a colour name the consuming apps do not all
# define.
#
# This exists because of a defect that shipped and stayed invisible. `stat.tsx`
# was written against `bg-cardbg`, `border-line`, `text-fg`, `text-acc` — names
# that exist ONLY in analytics. Installed in explorer, web or ckstats it would
# have rendered with no background, no border and inherited text, while the build
# passed and the page loaded. Nothing would have told anyone.
#
# That is the worst shape a bug can take in a shared library: correct where the
# author tested, silently wrong everywhere else. A component in here is a promise
# that it works in every app, so the promise gets checked.
#
# The contract is the shadcn semantic set, which all four apps already defined,
# plus a status trio because shadcn has `destructive` but no success or warning.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

CONTRACT="background foreground card card-foreground popover popover-foreground
primary primary-foreground secondary secondary-foreground muted muted-foreground
accent accent-foreground destructive destructive-foreground border input ring
success warning"

# Utilities that take a colour. `border-b` and `text-left` are not colours, so a
# name is only a finding when it is not one of Tailwind's own non-colour values.
NON_COLOUR="left right center justify start end top bottom middle baseline
wrap nowrap balance pretty ellipsis clip auto none inherit current transparent
b t l r x y s e sm base lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl 9xl xs"

bad=0
while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    file="${hit%%:*}"; rest="${hit#*:}"; line="${rest%%:*}"; cls="${rest##*:}"
    name="${cls#*-}"
    grep -qw -- "$name" <<<"$CONTRACT" && continue
    grep -qw -- "$name" <<<"$NON_COLOUR" && continue
    # arbitrary values and opacity modifiers are the app's business, not ours
    case "$name" in \[*|*/*) continue ;; esac
    echo "  off-contract  $cls  $file:$line"
    bad=$((bad + 1))
done <<<"$(grep -rnoE '\b(bg|text|border|ring|fill|stroke|divide|outline|shadow|from|via|to)-[a-z][a-z0-9-]*' ui --include='*.tsx' 2>/dev/null)"

if [ "$bad" -gt 0 ]; then
    echo
    echo "$bad off-contract colour name(s)."
    echo "A component here must only use names every app defines:"
    echo "$CONTRACT" | tr -s ' \n' ' ' | fold -s -w 72 | sed 's/^/  /'
    echo
    echo "If a component genuinely needs a new one, add it to the contract in"
    echo "ui/README.md AND define it in all four apps first — otherwise the"
    echo "component renders unstyled in the apps that lack it, silently."
    exit 1
fi
echo "contract: clean — every colour name is defined in all four apps"
