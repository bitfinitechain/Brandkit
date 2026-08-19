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
report() { echo "  $1"; bad=$((bad + 1)); }

# Comments are stripped: a comment naming a class we moved AWAY from is exactly
# the documentation we want people to keep writing.
strip() { perl -0777 -pe 's{/\*.*?\*/}{}gs; s{//[^\n]*}{}g' "$1"; }
SRC=$(find ui -name '*.tsx' -o -name '*.ts' | sort)

# ---- 1. colour utilities outside the contract ----
for f in $SRC; do
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    line="${hit%%:*}"; cls="${hit#*:}"; name="${cls#*-}"
    grep -qw -- "$name" <<<"$CONTRACT" && continue
    grep -qw -- "$name" <<<"$NON_COLOUR" && continue
    case "$name" in */*) continue ;; esac     # opacity modifier, app's business
    report "off-contract   $cls  $f:$line"
  done <<<"$(strip "$f" | grep -noE '\b(bg|text|border|ring|fill|stroke|divide|outline|from|via|to)-[a-z][a-z0-9-]*')"
done

# ---- 2. arbitrary values reaching for a variable we do not own ----
# This is what the first version missed: `bg-[var(--hov)]` never matched the
# regex above, because that regex requires a letter after the prefix. --hov is
# analytics-only, so the highlight silently vanished in the other three apps.
for f in $SRC; do
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    line="${hit%%:*}"; expr="${hit#*:}"
    var=$(sed -E 's/.*var\(--([a-z0-9-]+).*/\1/' <<<"$expr")
    case "$var" in bfx-*) continue ;; esac
    grep -qw -- "$var" <<<"$CONTRACT" && continue
    report "unknown var    $expr  $f:$line"
  done <<<"$(strip "$f" | grep -noE '\[[a-z-]*var\(--[a-z0-9-]+\)\]')"
done

# ---- 3. class names borrowed from a consuming app ----
# ops-/hl-/fx-/dn-/ov- are analytics' own families. A component using one renders
# correctly there and unstyled everywhere else, which is the whole failure this
# file exists to stop. Ours are bfx-*.
for f in $SRC; do
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    report "app-only class  ${hit#*:}  $f:${hit%%:*}"
  done <<<"$(strip "$f" | grep -noE '\b(ops|hl|fx|dn|ov|sum|node|st)-[a-z][a-z0-9-]*')"
done

# ---- 4. font sizes off the Brandkit scale ----
SCALE=$(grep -oE -- '--bfx-text-[0-9]+:\s*[0-9]+px' tokens/tokens.css | grep -oE '[0-9]+px$' | sort -u)
for f in $SRC; do
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    px=$(grep -oE '[0-9.]+px' <<<"${hit#*:}")
    grep -qx "$px" <<<"$SCALE" && continue
    report "off-scale size  ${hit#*:}  $f:${hit%%:*}"
  done <<<"$(strip "$f" | grep -noE 'text-\[[0-9.]+px\]')"
done

if [ "$bad" -gt 0 ]; then
    echo
    echo "$bad finding(s). A component here is a promise that it works in all four"
    echo "apps, so it may only use names every app defines:"
    echo "$CONTRACT" | tr -s ' \n' ' ' | fold -s -w 72 | sed 's/^/  /'
    echo
    echo "Adding a name means adding it to ui/README.md AND defining it in all"
    echo "four apps first — a component that ships ahead of its token is invisible"
    echo "breakage: the build passes, the page loads, the styling is simply absent."
    exit 1
fi
echo "contract: clean — colours, vars, classes and sizes all resolve in all four apps"
