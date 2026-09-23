// Verify the built site against the facts ledger.
//
//   npm run build && node scripts/sitecheck.mjs
//
// The counterpart to cv/pdfcheck.py, and it exists for the same reason that one does: three
// hyperlinks once vanished from the CV in a rewrite and nobody noticed, because nothing checked
// for their absence. Most of the assertions below are NEGATIVE -- a claim that was removed for a
// reason and must not quietly return. A positive-only check would pass a site that had silently
// reverted every correction.
//
// Ledger references (cv/facts.md) are given per rule so a future failure can be traced to the
// fact that motivated it, rather than looking like an arbitrary string ban.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIST = join(ROOT, 'dist');
const BASE = '/hieu-nguyen.github.io';

// ── Claims that were removed on purpose. Any reappearance is a regression. ──────────────────
const FORBIDDEN = [
  // The inverted claim. Quantisation trades precision away; it does not improve it. (F7.6)
  ['precision improvement', 'F7.6 - quantisation does not improve precision'],
  ['precision by 20%', 'F7.6 - same inversion, the older phrasing'],

  // Sound AI is a platform in the mould of LandingAI, not built on it, and the comparison is
  // kept off written surfaces entirely. (F7.2)
  ['Landing AI', 'F7.2 - comparison stays off written surfaces'],
  ['LandingAI', 'F7.2 - comparison stays off written surfaces'],

  // Volume figure the owner declined to confirm. No call volume is recorded anywhere. (F8)
  ['millions of customer calls', 'F8 - unconfirmed volume claim'],

  // House style, and the ledger value. (F1.9, CLAUDE.md)
  ['6.5 / 7.0', 'F1.9 - the GPA is 6.54, not 6.5'],

  // Cognilaw ended June 2026. (F1.4)
  ['Currently at Cognilaw', 'F1.4 - role ended June 2026'],
  ['January 2026 – Present', 'F1.4 - role ended June 2026'],

  // Superseded cost figures. The current one is roughly US$43 a month. (F6.3)
  ['$20 a month', 'F6.3 - superseded cost'],
  ['$20 per month', 'F6.3 - superseded cost'],
  ['A$46', 'F6.3 - superseded intermediate cost'],

  // Never claimed anywhere. (F8)
  ['TypeScript', 'F8 - none in the repo'],
  ['Kubernetes', 'F8 - not used, no honest claim to make'],
  ['waitlist', 'F8 - no evidence, dropped'],
  ['Startmate', 'F8 - no public trace, dropped'],

  // PHP is not gone; it is load-bearing as the test harness. (F8)
  ['PHP is gone', 'F8 - say "no PHP in the request path"'],
  ['fully migrated out', 'F8 - say "no PHP in the request path"'],

  // Invented detail found on the site and removed during the 2026-09-23 pass.
  ['knowledge graphs', 'F7.5 - records structured output, not knowledge graphs'],
  ['drug discovery', 'F7.5 - invented downstream application'],
  ['Extra Tree Regression', 'F7.7 - Extra Trees, and a classification task'],
  ['early warning signals', 'F7.7 - invented business outcome'],
  ['food preferences', 'F7.11 - feature appears nowhere in the ledger'],
  ['paperwork to minutes', 'F7.10 - "to minutes" is an added figure'],
  ['occlusion', 'F7.4 - performance claim that was never measured'],

  // Tenure matches the CV's AI Summary, owner-directed 2026-09-23 (F10). The old figure
  // described the Vietnam work alone; the new one is the whole career.
  ['3+ years', 'F10 - tenure is now "4 years of experience", matching the CV'],
];

// The public-ceiling rules (F12) -- model and vendor names, internal evaluation and index-size
// figures, the claims-tier count -- cannot be listed here: this repo is public, so the list
// would publish exactly what it keeps off the site. They live in the git-ignored
// cv/private-checks.json, loaded when present.
const PRIVATE = join(ROOT, 'cv', 'private-checks.json');
const privateLoaded = existsSync(PRIVATE);
if (privateLoaded) {
  FORBIDDEN.push(...JSON.parse(readFileSync(PRIVATE, 'utf8')).site_forbidden);
}

// Register rules, checked on the portfolio page only.
//
// These are about promotional voice, and they are scoped because the blog is not written in that
// voice. The blog post already on the site contains "LLMs already robust to this signal" -- the
// precise technical sense of the word, insensitive to an input, not marketing puffery. Banning
// it there would mean rewriting published technical prose to satisfy a rule aimed at hero copy.
// The factual rules above stay global: a blog post must not claim Cognilaw is current either.
const REGISTER_PAGES = ['index.html'];
const REGISTER = [
  [/\bpassionate\b/i, 'passionate'],
  [/\bcutting-edge\b/i, 'cutting-edge'],
  [/\bleveraging\b/i, 'leveraging'],
  [/\bworld-class\b/i, 'world-class'],
  [/\bseamless(ly)?\b/i, 'seamless'],
  [/\brobust(ly|ness)?\b/i, 'robust'],
];

// Allowed only inside an exact compound. Bare "Azure" claims a breadth of the platform that has
// never been established; only Functions and Cosmos DB are. (F8, F7.2)
const QUALIFIED = [
  ['azure', ['azure functions', 'azure cosmos db']],
];

// ── Things that must be present. ────────────────────────────────────────────────────────────
const REQUIRED = [
  ['index.html', 'Plenarius', 'the current role must appear on the homepage'],
  ['index.html', 'CTO at Plenarius', 'hero subtitle'],
  ['index.html', 'Chief Technology Officer', 'timeline role title'],
  ['index.html', 'GPA 6.54 / 7.0', 'F1.9 - real precision'],
  ['index.html', 'Azure Functions', 'F7.2 - the Sound AI backend'],
  ['index.html', 'efficiency improvement', 'F7.6 - the corrected pose claim'],
  ['index.html', 'zero PHP in the request path', 'F8 - the exact phrasing the ledger mandates'],
  ['index.html', 'June 2026', 'F1.4 - Cognilaw is closed out'],
  ['index.html', 'US$43', 'F6.3 - currency written explicitly'],
  ['index.html', 'FM106', 'F7.10 - the real WorkCover template'],
  ['index.html', 'plenarius.org', 'the product link'],
  ['index.html', '4 years of experience', 'F10 - matches the CV AI Summary'],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// Strip <script> and <style> so bundled vendor code cannot trip a prose rule.
function prose(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

function main() {
  if (!existsSync(DIST)) {
    console.error('no dist/ - run `npm run build` first');
    return 1;
  }

  const files = walk(DIST);
  const htmlFiles = files.filter((f) => f.endsWith('.html'));
  if (!htmlFiles.length) {
    console.error('dist/ contains no HTML');
    return 1;
  }

  let failures = 0;
  const pages = new Map();
  for (const f of htmlFiles) {
    pages.set(relative(DIST, f).replace(/\\/g, '/'), prose(readFileSync(f, 'utf8')));
  }

  // 1. Forbidden claims, across every page.
  console.log('FORBIDDEN CLAIMS');
  for (const [needle, why] of FORBIDDEN) {
    const hits = [...pages.entries()].filter(([, html]) =>
      html.toLowerCase().includes(needle.toLowerCase()),
    );
    if (hits.length) {
      failures++;
      console.log(`  FAIL  "${needle}" in ${hits.map(([n]) => n).join(', ')}  (${why})`);
    }
  }
  if (!failures) console.log(`  ok    none of ${FORBIDDEN.length} present`);

  console.log('\nREGISTER (portfolio pages only)');
  const before = failures;
  for (const page of REGISTER_PAGES) {
    const html = pages.get(page);
    if (!html) continue;
    for (const [re, label] of REGISTER) {
      if (re.test(html)) {
        failures++;
        console.log(`  FAIL  "${label}" in ${page}  (house style - banned word)`);
      }
    }
  }
  if (failures === before) console.log(`  ok    none of ${REGISTER.length} banned words`);

  // 2. Terms legitimate only inside a compound.
  console.log('\nQUALIFIED TERMS');
  for (const [term, allowed] of QUALIFIED) {
    for (const [name, html] of pages) {
      const low = html.toLowerCase();
      const total = low.split(term).length - 1;
      const covered = allowed.reduce((n, a) => n + (low.split(a).length - 1), 0);
      if (total > covered) {
        failures++;
        console.log(
          `  FAIL  ${total - covered} bare use(s) of "${term}" in ${name} ` +
            `- only ${allowed.map((a) => `"${a}"`).join(' / ')} is established (F8)`,
        );
      }
    }
  }
  console.log('  ok    no bare "Azure"');

  // 3. Required content.
  console.log('\nREQUIRED CONTENT');
  for (const [page, needle, why] of REQUIRED) {
    const html = pages.get(page);
    if (!html) {
      failures++;
      console.log(`  FAIL  ${page} not built`);
      continue;
    }
    if (!html.includes(needle)) {
      failures++;
      console.log(`  FAIL  "${needle}" missing from ${page}  (${why})`);
    }
  }
  console.log(`  checked ${REQUIRED.length} marker(s)`);

  // 4. Every referenced local asset exists. A card whose screenshot 404s looks broken in
  //    exactly the place the site is trying to look strongest, and nothing else catches it.
  console.log('\nASSET REFERENCES');
  // Scan for the base path ANYWHERE, not just in src=/href=. The lightbox passes its images
  // through a data-gallery attribute holding HTML-escaped JSON, so a src/href-only scan silently
  // ignores every gallery image -- which a deliberately broken path proved: the check reported
  // all references resolving while pointing at a file that did not exist.
  const missing = new Set();
  const seen = new Set();
  const pattern = new RegExp(BASE.replace(/[.]/g, '\\.') + '/[^"\'\\s<>\\\\)]*', 'g');
  for (const [, html] of pages) {
    // Astro escapes the quotes inside data-gallery as &#34;. Decode them first so the quote acts
    // as a delimiter -- otherwise the path runs on and the later #-fragment split truncates it.
    const decoded = html.replace(/&#34;/g, '"').replace(/&quot;/g, '"');
    for (const m of decoded.matchAll(pattern)) {
      const rel = decodeURIComponent(m[0].slice(BASE.length + 1)).split(/[?#]/)[0];
      if (!rel || rel.endsWith('/')) continue; // a route, not a file
      seen.add(rel);
    }
  }
  for (const rel of seen) {
    // Either a real file, or a pretty-URL route backed by <dir>/index.html.
    if (existsSync(join(DIST, rel))) continue;
    if (existsSync(join(DIST, rel, 'index.html'))) continue;
    missing.add(rel);
  }
  const refs = seen.size;
  if (missing.size) {
    failures += missing.size;
    for (const m of missing) console.log(`  FAIL  referenced but not in dist/: ${m}`);
  } else {
    console.log(`  ok    all ${refs} local reference(s) resolve`);
  }

  console.log('');
  if (failures) {
    console.log(`SITECHECK: ${failures} problem(s).`);
    return 1;
  }
  if (!privateLoaded) {
    console.log('WARNING: cv/private-checks.json not found - public-ceiling checks skipped.');
  }
  console.log('SITECHECK: clean. Still read the page yourself before it ships.');
  return 0;
}

process.exit(main());
