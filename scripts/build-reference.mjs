#!/usr/bin/env node
/**
 * Generate the public component reference from ui/*.tsx.
 *
 * The page at bitfinitechain.org/brandkit said "Generated from Brandkit/ui/*.tsx
 * at v1.7.0" while the kit was at v1.14.2, and listed 21 of 58 components. It
 * was never generated: the line was aspirational and the file was written by
 * hand seven releases earlier, so it drifted the moment anything shipped.
 *
 * So it is generated now, and the version stamp comes from package.json and git
 * rather than from a human remembering. Everything the source can answer is read
 * out of the source: the summary, the shadcn attribution, the cva variants, the
 * exported symbols and the "how it differs from upstream" note.
 *
 * The DEMOS are the exception. They are hand-built markup that mimics each
 * component with plain HTML, because this page must render without React, and
 * nothing can derive them. Existing ones are carried across by id; a component
 * without one simply has no demo rather than a fake.
 *
 *   node scripts/build-reference.mjs ../bitfinite-web/public/brandkit.html
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2];
if (!out) { console.error('usage: build-reference.mjs <output.html>'); process.exit(2); }

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();

// ---- what belongs where -----------------------------------------------------
// Ordered by what a reader is looking for, not alphabetically. A component not
// named here lands in Other, which is the signal to come and place it.
const GROUPS = [
    ['Primitives',  ['button', 'button-group', 'toggle', 'toggle-group', 'badge', 'card', 'separator', 'kbd', 'avatar', 'aspect-ratio', 'skeleton', 'spinner', 'progress']],
    ['Forms',       ['input', 'input-group', 'input-otp', 'textarea', 'label', 'field', 'checkbox', 'radio-group', 'switch', 'slider', 'select', 'native-select', 'combobox', 'calendar', 'date-picker']],
    ['Data',        ['stat', 'data-table', 'table', 'copy-field', 'empty-state', 'item', 'pagination', 'typography']],
    ['Charts',      ['sparkline', 'line-chart', 'bar-chart', 'donut', 'gauge', 'chart']],
    ['Overlays',    ['dialog', 'alert-dialog', 'sheet', 'drawer', 'popover', 'tooltip', 'hover-card', 'dropdown-menu', 'context-menu', 'command', 'sonner', 'alert']],
    ['Navigation',  ['app-header', 'sidebar', 'footer', 'breadcrumb', 'tabs', 'menubar', 'navigation-menu']],
    ['Layout',      ['accordion', 'collapsible', 'scroll-area', 'resizable', 'carousel']],
    ['Brand',       ['wordmark', 'social-links']],
    ['Theming',     ['theme-provider', 'theme-toggle', 'direction']],
];

// Components that are not importable from the package root, and why.
const SUBPATH = {
    'theme-provider': 'next-themes',
    'chart': 'recharts',
    'sonner': 'next-themes + sonner',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

/** PascalCase display name from a file stem, with the ones that are not a simple join. */
const SPECIAL = { sonner: 'Toaster', typography: 'Prose', 'native-select': 'NativeSelect', 'input-otp': 'InputOTP' };
const nameOf = (stem) => SPECIAL[stem] ?? stem.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');

function parse(stem) {
    const src = readFileSync(path.join(root, 'ui', `${stem}.tsx`), 'utf8');

    // The leading block or line comment is the component's own description.
    let doc = '';
    const block = src.match(/\/\*\*([\s\S]*?)\*\//);
    if (block) doc = block[1].split('\n').map((l) => l.replace(/^\s*\*ature?/, '').replace(/^\s*\*ം?/, '').replace(/^\s*\*\s?/, '')).join('\n').trim();
    if (!doc) {
        const lines = src.split('\n');
        const start = lines.findIndex((l) => l.startsWith('//') && !l.includes('GENERATED') && !l.includes('Canonical'));
        if (start !== -1) {
            const buf = [];
            for (let i = start; i < lines.length && lines[i].startsWith('//'); i++) buf.push(lines[i].replace(/^\/\/\s?/, ''));
            doc = buf.join('\n').trim();
        }
    }

    // The attribution is rendered on its own line, so it comes off the summary
    // where a file puts both in one paragraph. Otherwise the page reads
    // "Buttons that act as one control. Adapted from shadcn/ui (MIT)." and then
    // says "Adapted from shadcn/ui (MIT)." again directly underneath.
    const summary = (doc.split(/\n\s*\n/)[0] || '')
        .replace(/\s+/g, ' ')
        .replace(/\s*Adapted from shadcn\/ui \(MIT\)[.,]?\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const rest = doc.split(/\n\s*\n/).slice(1).join(' ').replace(/\s+/g, ' ').trim();
    const adapted = /Adapted from shadcn\/ui \(MIT\)/.test(src);

    // cva variant groups, read out of the source so the page cannot promise an
    // API the code does not have.
    const variants = [];
    const cva = src.match(/cva\(\s*[\s\S]*?variants:\s*\{([\s\S]*?)\n\s{4,8}\},/);
    if (cva) {
        for (const m of cva[1].matchAll(/^\s{6,}([a-zA-Z]+):\s*\{([\s\S]*?)^\s{6,}\},/gm)) {
            const keys = [...m[2].matchAll(/^\s*["']?([a-zA-Z0-9_-]+)["']?\s*:/gm)].map((k) => k[1]);
            if (keys.length) variants.push([m[1], keys]);
        }
    }

    // Exported symbols, for the "what you can import" line.
    const exported = new Set();
    for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|const)\s+([A-Za-z0-9_]+)/g)) exported.add(m[1]);
    for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
        for (const part of m[1].split(',')) {
            const n = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim();
            if (n && !/^type$/.test(n)) exported.add(n);
        }
    }
    return { stem, name: nameOf(stem), summary, rest, adapted, variants, exported: [...exported].sort() };
}

// ---- carry the hand-built demos across --------------------------------------
const previous = readFileSync(out, 'utf8');
const demos = {};
for (const m of previous.matchAll(/<section class="c" id="([a-z0-9-]+)">([\s\S]*?)<\/section>/g)) {
    // The closing tag is put back before matching, and the whitespace is \s*
    // rather than \n?. Both matter and both were wrong: this reorders sections,
    // so a component with no variants and no deviations ends with its demo, and
    // a lookahead that needed something AFTER the demo could never match it on a
    // second pass. Twelve demos vanished the second time it ran. A generator
    // that damages its own output is worse than one that never ran.
    const d = (m[2] + '</section>').match(/<div class="c-demo">[\s\S]*?<\/div>\s*(?=<div class="c-sub"|<details|<\/section>|<p class=)/);
    if (d) demos[m[1]] = d[0].trim();
}

const stems = readdirSync(path.join(root, 'ui')).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, ''));
const placed = new Set(GROUPS.flatMap(([, list]) => list));
const other = stems.filter((s) => !placed.has(s));
const groups = other.length ? [...GROUPS, ['Other', other]] : GROUPS;

let nav = '', main = '', total = 0, symbols = 0;
for (const [group, list] of groups) {
    const present = list.filter((s) => stems.includes(s));
    if (!present.length) continue;
    nav += `<div class="n-g">${esc(group)}</div>\n`;
    main += `<h2 class="g" id="g-${group.toLowerCase()}">${esc(group)}</h2>\n`;
    for (const stem of present) {
        const c = parse(stem);
        total += 1; symbols += c.exported.length;
        nav += `<a class="n-i" href="#${stem}">${esc(c.name)}</a>\n`;
        const imp = SUBPATH[stem] ? `@bitfinitechain/brandkit/ui/${stem}` : '@bitfinitechain/brandkit';
        main += `<section class="c" id="${stem}">\n`;
        main += `<div class="c-h"><h3>${esc(c.name)}</h3><code class="c-imp">${esc(imp)}</code></div>\n`;
        if (c.summary) main += `<p class="c-sum">${esc(c.summary)}</p>\n`;
        if (SUBPATH[stem]) main += `<p class="c-attr">Subpath import: it needs ${esc(SUBPATH[stem])}, which not every app installs.</p>\n`;
        if (c.adapted) main += `<p class="c-attr">Adapted from shadcn/ui (MIT).</p>\n`;
        if (c.exported.length) main += `<p class="c-ex">${c.exported.map((e) => `<code>${esc(e)}</code>`).join(' ')}</p>\n`;
        if (demos[stem]) main += `${demos[stem]}\n`;
        if (c.variants.length) {
            main += `<div class="c-sub">Variants</div><div class="v">`;
            for (const [k, vals] of c.variants) {
                main += `<div class="v-row"><span class="v-k">${esc(k)}</span><span class="v-v">${vals.map((v) => `<code>${esc(v)}</code>`).join(' ')}</span></div>`;
            }
            main += `</div>\n`;
        }
        if (c.rest) main += `<details class="c-why"><summary>How it differs from upstream</summary><p>${esc(c.rest)}</p></details>\n`;
        main += `</section>\n`;
    }
}

const lede = `    <div class="lede">
      <h1>Component reference</h1>
      <p>Every component in <code>@bitfinitechain/brandkit</code>: ${total} of them, ${symbols} exported
         symbols.</p>
      <p class="note">Generated from <code>Brandkit/ui/*.tsx</code> at v${esc(pkg.version)} (${esc(sha)})
         by <code>scripts/build-reference.mjs</code>. The summaries, variants and exported symbols are
         read out of the source, so this page cannot promise an API the code does not have. The
         rendered examples are hand-built from each component's own classes and token values. They
         are a faithful likeness, not the live component, so treat the source as the authority if the
         two ever disagree.</p>
    </div>
`;

const head = previous.slice(0, previous.indexOf('<nav class="idx"'));
const tail = previous.slice(previous.indexOf('</main>'));
const stamped = head.replace(/<span class="v">[^<]*<\/span>/, `<span class="v">v${esc(pkg.version)} · ${esc(sha)}</span>`);

writeFileSync(out, `${stamped}<nav class="idx" aria-label="Components">\n${nav}</nav>\n  <main>\n${lede}${main}  ${tail}`);
console.log(`brandkit reference: ${total} components, ${symbols} symbols, v${pkg.version} (${sha})`);
console.log(`  demos carried across: ${Object.keys(demos).length}`);
console.log(`  written: ${out}`);
