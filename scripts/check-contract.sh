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
# The contract is the shadcn semantic set, which all five apps already defined,
# plus a status trio because shadcn has `destructive` but no success or warning.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

CONTRACT="background foreground card card-foreground popover popover-foreground
primary primary-ink primary-foreground secondary secondary-foreground muted muted-foreground
accent accent-foreground destructive destructive-foreground border input ring
success warning"

# Utilities that take a colour. `border-b` and `text-left` are not colours, so a
# name is only a finding when it is not one of Tailwind's own non-colour values.
# white and black are Tailwind's own built-in colours, not tokens. An app cannot
# fail to define them, so flagging them was a false positive — it cost two of the
# eighteen findings and made the real ones easier to dismiss.
NON_COLOUR="left right center justify start end top bottom middle baseline
wrap nowrap balance pretty ellipsis clip auto none inherit current transparent
white black no-repeat repeat collapse separate hidden visible solid dashed dotted
b t l r x y s e sm base lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl 9xl xs"

# ---- the gap that used to live here is CLOSED (2026-09-23) -------------------
# `primary-ink` is the accent rendered as INK rather than as a fill, and it is in
# CONTRACT above now. `primary` is the fill; on a dark panel it measures 3.46:1
# and fails AA as text, which is why one name could never serve both roles.
#
# It moved out of this block by doing what this block asked for: web, explorer and
# ckstats each define --primary-ink (light blue-700, dark blue-500), trader-ui
# already did, and analytics aliases --color-primary-ink onto its own --acc-ink,
# the 65% mix that keeps every TENANT accent clearing AA in both themes. So all
# five apps define it and the list above still means "every app defines this".
#
# Nothing is tracked here now. Keep the block: the next missing contract name goes
# here rather than into CONTRACT, so CI stays green for everything else while the
# apps catch up. A check that is always red is a check nobody reads.
KNOWN_GAP=""

bad=0
report() { echo "  $1"; bad=$((bad + 1)); }

# Comments are stripped: a comment naming a class we moved AWAY from is exactly
# the documentation we want people to keep writing.
# Comments go, but their NEWLINES stay: the old version deleted block comments
# whole, so every reported line number after one was wrong and you could not
# jump to the finding. Arbitrary values go too, because a CSS property inside
# `transition-[background-color,border-color,box-shadow]` is not a class and was
# being reported as an off-contract `border-color`.
strip() { perl -0777 -pe 's{/\*.*?\*/}{"\n" x ($& =~ tr/\n//)}gse; s{//[^\n]*}{}g; s{\[[^\]]*\]}{}g' "$1"; }
SRC=$(find ui -name '*.tsx' -o -name '*.ts' | sort)

# ---- 1. colour utilities outside the contract ----
for f in $SRC; do
  while IFS= read -r hit; do
    [ -z "$hit" ] && continue
    line="${hit%%:*}"; cls="${hit#*:}"; name="${cls#*-}"
    # Tailwind puts a side or axis between the utility and its value:
    # border-l-transparent, border-b-0. Strip one so we test the VALUE, not
    # "l-transparent", which matches nothing and reads as a finding.
    case "$name" in b-*|t-*|l-*|r-*|x-*|y-*|s-*|e-*) name="${name#*-}" ;; esac
    # A bare number is a width, an offset or a scale step. Never a colour.
    case "$name" in ''|*[!0-9.]*) ;; *) continue ;; esac
    grep -qw -- "$name" <<<"$CONTRACT" && continue
    grep -qw -- "$name" <<<"$NON_COLOUR" && continue
    if grep -qw -- "$name" <<<"$KNOWN_GAP"; then
      echo "  known gap      $cls  $f:$line  (see KNOWN_GAP in this script)"
      continue
    fi
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
    echo "five apps first — a component that ships ahead of its token is invisible"
    echo "breakage: the build passes, the page loads, the styling is simply absent."
    exit 1
fi
echo "contract: clean — colours, vars, classes and sizes all resolve in all five apps"
