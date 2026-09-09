# Charts, by shape

Pick the shape from the **question the reader is asking**, not from what looks
good in the space available. The wrong shape is not a style problem: it makes a
true dataset say something false, and no amount of polish fixes it.

Two families here, and the order matters.

**Native** — ours, token driven, no dependencies. `Sparkline`, `LineChart`,
`BarChart`, `Donut`, `Gauge`. **Reach for these first.**

**Recharts-backed** — `Radial`, and anything built on `chart.tsx`. These pull in
`recharts`, an optional peer dependency, so they earn their place only by
drawing a shape the native set cannot. An app that never renders one never
installs it.

---

## The table

| Question | Shape | Component | Family |
|---|---|---|---|
| One value against a real ceiling | **arc gauge** | `Gauge` | native |
| How is the whole split? (2-5 parts) | **ring / pie** | `Donut` | native |
| How is the whole split, parts on a shared scale? | **radial bars** | `Radial` | recharts |
| Which category is bigger? | **columns** | `BarChart` | native |
| How did it change over time? | **line / area** | `LineChart` | native |
| Trend, inline, no axes needed | **sparkline** | `Sparkline` | native |
| Progress toward a known end | **bar meter** | `Progress` | native |

---

## The rules that actually decide it

**A ceiling must exist before you draw an arc or a ring.** The test: can you
name the total, and does reaching it mean something? Supply against cap passes.
Height, hashrate and difficulty fail — they have no maximum, and a ring around
them invents one.

**One value is a gauge, not a ring of one slice.** `Gauge` reads faster and does
not imply a set of parts that is not there.

**Ring or radial, never both for the same data.** `Donut` compares slices of one
circle; `Radial` compares arcs on separate radii against a shared angular scale.
Pick by whether the parts should be read against each other (`Donut`) or each
against the total (`Radial`).

**Arc length is not comparable across radii.** An inner and an outer arc of the
same angle have very different lengths, so `Radial` flatters small categories.
Where one category dominates — and especially where that category is
"unknown" — use columns, which are honest about it.

**Five is the ceiling for any part-of-whole.** Past that the arcs get thin, the
labels collide and the palette runs out. Roll the tail into "Other".

**Never a dual axis.** Two measures of different scale means two charts, small
multiples, or indexing both to a common base.

---

## Grouping: one shape family per card

**Columns and arcs do not share a card.** A reader scanning a dashboard groups
by silhouette before they read a single label, so a card holding a bar chart
above a ring reads as two unrelated things stacked, and the eye has to
re-anchor halfway down it.

Two families, and a card belongs to exactly one:

| family | shapes |
|---|---|
| **rectilinear** | `BarChart`, `Progress`, `LineChart`, `Sparkline` |
| **circular** | `Gauge`, `Donut`, `Radial` |

Within a family, inline is good: a gauge beside a radial reads as one group
because the silhouettes rhyme. Across families, split the card.

**Order the rows by what leads the story, not by size.** Where one category
dominates a comparison, the columns go first and full width, because that
dominant bar is usually the finding. The circular readouts follow.

A stat tile with a number and no plot is neutral and sits with either.

---

## Colour

Tones are **semantic first**: `ok`, `warn` and `bad` mean good, warning and
critical, so they are never series colours. Categories use the dedicated ramp,
`--chart-1` to `--chart-4` plus `--chart-other`, which is why a part-of-whole
caps at four named categories and a roll-up.

**The ramp is measured, not chosen.** Every stop sits inside the OKLCH lightness
band for its mode, clears the chroma floor and 3:1 on its surface, and clears
the colour-blind separation target against its neighbours. Re-run the check
before changing one: a stop that looks better alone routinely collapses a CVD
pair.

**Never paint a category `bad`.** A hardware brand or a wallet cohort rendered
red reads as an alert, and the reader believes it before they read the legend.

**Muted is a meaning, not a leftover.** Use it for the bucket that is *not* a
finding — unrecognised, unnamed, other — so the eye does not rank it alongside
the real categories.

**Colour follows the entity, never its rank.** If a filter changes how many
series are shown, the survivors keep their colours. A palette assigned by
position repaints the whole chart when one series drops out.

---

## Labels

The chart carries its own explanation. A legend with names and percentages
removes the need for a caption repeating them in prose, and a caption that
repeats the chart is text the reader has to get past to reach the data.

State the denominator once, near the figure — "of 41 workers" — and let the
shape do the rest.
