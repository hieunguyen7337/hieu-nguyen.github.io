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

  // Disagreements with the CV removed in the 2026-09-25 parity pass. The CV PARITY section below
  // checks what must be present; these catch the specific old wording coming back.
  ['Samsung factory floors', 'F7.2 - one platform on a Samsung factory floor, as on the CV'],
  ['a major telecom', 'F1.6/F7.3 - the call analysis ran at Viettel Post, as on the CV'],
  ['Built and evaluated', 'F10 - the CV says the Cognilaw pipeline was evaluated and improved'],
  ['Ha Noi', 'the CV spells it "University of Science and Technology of Hanoi"'],
  ['degree, Artificial Intelligence', 'the CV names it "Master of Artificial Intelligence"'],
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
// "Azure (Functions, Cosmos DB)" is the service-scoped form F8 prescribes for a skills list.
const QUALIFIED = [
  ['azure', ['azure functions', 'azure cosmos db', 'azure (functions, cosmos db)']],
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

// ── CV parity. ──────────────────────────────────────────────────────────────────────────────
// The site and the CV must not disagree (cv/prompts/_brief_site.md). Restating the CV here would
// drift the first time the CV changed, so the AI variant -- the default download the hero links --
// is read straight from the .tex, and each of its facts is required in the matching part of the
// homepage: every Experience role's title, organisation, dates and bullets inside that role's own
// card; each Skills item; project titles, awards and stacks; degrees, institutions and grade; the
// Volunteer entries; and every hyperlink. The site may say more than the CV. It may not say less,
// or say it differently.
const TEX = join(ROOT, 'cv', 'Hieu_Nguyen_CV.tex');
const SELF = 'https://hieunguyen7337.github.io/hieu-nguyen.github.io';
const MONTHS = {
  Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
  Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December',
};
// One macro argument, allowing one level of nested braces (an \href inside a \role argument).
const ARG = String.raw`\{((?:[^{}]|\{[^{}]*\})*)\}`;

// Drop every \name{...} block, or keep only its body: how \AI{}, \DATA{} and \PRINT{} select.
function macro(src, name, keep) {
  const open = `\\${name}{`;
  let out = '';
  let i = 0;
  for (let at = src.indexOf(open); at >= 0; at = src.indexOf(open, i)) {
    out += src.slice(i, at);
    let depth = 1;
    let j = at + open.length;
    for (; j < src.length && depth; j++) {
      if (src[j] === '\\') j++;
      else if (src[j] === '{') depth++;
      else if (src[j] === '}') depth--;
    }
    if (keep) out += src.slice(at + open.length, j - 1);
    i = j;
  }
  return out + src.slice(i);
}

// LaTeX source to the text a reader sees.
function detex(s) {
  return s
    .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\text(?:tt|bf|it)\{([^}]*)\}/g, '$1')
    .replace(/\\([%$&#_])/g, '$1')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const fullMonths = (s) => s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => MONTHS[m]);
// Case and whitespace are presentation: the CV's "GPA 6.54/7.0" is "GPA 6.54 / 7.0" here.
const loose = (s) => s.toLowerCase().replace(/\s+/g, '');
const splitTop = (s) => {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && !depth) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  return [...out, cur.trim()].map((x) => x.replace(/\.$/, '')).filter(Boolean);
};

function text(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function readCv() {
  let tex = readFileSync(TEX, 'utf8').replace(/\r\n/g, '\n');
  tex = tex.slice(tex.indexOf('\\begin{document}'));
  tex = tex.replace(/(?<!\\)%[^\n]*/g, '');
  for (const n of ['DATA', 'FULL', 'PRINT']) tex = macro(tex, n, false);
  for (const n of ['AI', 'NOTFULL', 'SCREEN']) tex = macro(tex, n, true);
  const sections = {};
  const parts = tex.split(/\\section\{([^}]*)\}/);
  for (let k = 1; k < parts.length; k += 2) sections[detex(parts[k])] = parts[k + 1];
  const links = [...tex.matchAll(/\\href\{([^}]*)\}/g)].map((m) => m[1]);
  return { sections, links };
}

const items = (src) =>
  [...src.matchAll(/\\item\s+([\s\S]*?)(?=\\item\b|\\end\{itemize\})/g)].map((m) => detex(m[1]));

function cvParity(html) {
  const { sections: cv, links } = readCv();
  const problems = [];
  let checked = 0;
  const need = (hay, needle, what) => {
    checked++;
    if (!hay.includes(loose(needle))) problems.push(`${what}: "${needle}"`);
  };
  const section = (id) => {
    const m = html.match(new RegExp(`<section[^>]*\\bid="${id}"[\\s\\S]*?</section>`));
    return m ? m[0] : '';
  };
  const cards = (id) => section(id).split('class="timeline-item').slice(1).map((c) => loose(text(c)));
  // Skills and stacks are chips, matched whole: a substring test would let "Go" pass on "Google".
  const chips = (id) => new Set([...section(id).matchAll(/<span[^>]*>([^<]*)<\/span>/g)].map((m) => loose(text(m[1]))));
  const needChip = (set, chip, what) => {
    checked++;
    if (!set.has(loose(chip))) problems.push(`${what}: no chip "${chip}"`);
  };

  // Section headings. The CV's Summary and Skills are the site's About.
  const HEADINGS = { Experience: 'Experience', 'Projects & Awards': 'Projects', Education: 'Education', Volunteer: 'Volunteer' };
  for (const [cvName, siteName] of Object.entries(HEADINGS)) {
    checked++;
    if (!(cvName in cv)) problems.push(`CV has no "${cvName}" section - update HEADINGS`);
    else if (!new RegExp(`<h2[^>]*>\\s*${siteName}\\s*</h2>`).test(html))
      problems.push(`no "${siteName}" section heading for the CV's "${cvName}"`);
  }

  // Experience: each role in its own card, with its dates and every bullet.
  const roleRe = new RegExp(String.raw`\\role${ARG}\s*${ARG}\s*${ARG}`);
  const expCards = cards('experience');
  const roles = (cv.Experience ?? '').split(/(?=\\role\{)/).filter((c) => roleRe.test(c));
  if (!roles.length) problems.push('parsed no Experience roles from the .tex - parser out of date');
  for (const chunk of roles) {
    const [, t, d, o] = chunk.match(roleRe);
    const [title, org, period] = [detex(t), detex(o), fullMonths(detex(d))];
    checked++;
    const card = expCards.find((c) => c.includes(loose(title)) && c.includes(loose(org)));
    if (!card) {
      problems.push(`Experience: no card for "${title}" at "${org}"`);
      continue;
    }
    need(card, period, `${org}: dates`);
    for (const b of items(chunk)) need(card, b, `${org}: bullet`);
  }

  // Volunteer: same, and the CV's closing "progressing from X (Mon--Mon YYYY)" clause is a role
  // line of its own on the site.
  const volCards = cards('volunteer');
  const volRe = new RegExp(String.raw`\\volunteer${ARG}\s*${ARG}\s*${ARG}\s*${ARG}`, 'g');
  const vols = [...(cv.Volunteer ?? '').matchAll(volRe)];
  if (!vols.length) problems.push('parsed no Volunteer entries from the .tex - parser out of date');
  for (const [, t, d, o, x] of vols) {
    const [title, org, period] = [detex(t), detex(o), fullMonths(detex(d))];
    checked++;
    const card = volCards.find((c) => c.includes(loose(title)) && c.includes(loose(org)));
    if (!card) {
      problems.push(`Volunteer: no card for "${title}" at "${org}"`);
      continue;
    }
    need(card, period, `${org}: dates`);
    let detail = detex(x);
    const earlier = detail.match(/,\s*(?:progressing|stepping up) from ([A-Z][A-Za-z ]*?) \((\w{3})–(\w{3}) (\d{4})\)\.?$/);
    if (earlier) {
      const [clause, was, m1, m2, y] = earlier;
      need(card, was, `${org}: earlier role`);
      need(card, `${MONTHS[m1]} ${y} – ${MONTHS[m2]} ${y}`, `${org}: earlier role dates`);
      detail = detail.slice(0, -clause.length) + '.';
    }
    need(card, detail, `${org}: detail`);
    checked++;
    if (expCards.some((c) => c.includes(loose(org))))
      problems.push(`"${org}" is under Experience; the CV files it under Volunteer`);
  }

  // Skills: every item, in About.
  const about = loose(text(section('about')));
  const aboutChips = chips('about');
  const skillLines = items(cv.Skills ?? '');
  if (!skillLines.length) problems.push('parsed no Skills lines from the .tex - parser out of date');
  for (const line of skillLines) {
    const [label, list] = [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1)];
    need(about, label, 'Skills category');
    for (const s of splitTop(list)) needChip(aboutChips, s, `Skills (${label})`);
  }

  // Projects & Awards: title, each part of the award line, each stack item.
  const projects = loose(text(section('projects')));
  const projectChips = chips('projects');
  const projRe = new RegExp(String.raw`\\project${ARG}\s*${ARG}\s*${ARG}`, 'g');
  const projs = [...(cv['Projects & Awards'] ?? '').matchAll(projRe)];
  if (!projs.length) problems.push('parsed no Projects from the .tex - parser out of date');
  for (const [, t, a, s] of projs) {
    const title = detex(t);
    need(projects, title, 'Project');
    for (const part of a.split(/\\enspace\s*\|\s*\\enspace/)) need(projects, detex(part), `${title}: award`);
    for (const st of splitTop(detex(s))) needChip(projectChips, st, `${title}: stack`);
  }

  // Education: degree, institution, grade, and dates (year-only on the CV, so months are optional).
  const edu = loose(text(section('education')));
  const eduRoles = [...(cv.Education ?? '').matchAll(new RegExp(roleRe.source, 'g'))];
  if (!eduRoles.length) problems.push('parsed no Education entries from the .tex - parser out of date');
  for (const [, t, d, o] of eduRoles) {
    need(edu, detex(t), 'Education: degree');
    for (const part of o.split(/\\enspace\s*\|\s*\\enspace/)) need(edu, detex(part), 'Education');
    const years = detex(d).match(/^(\d{4}) – (\d{4})$/);
    if (years) {
      checked++;
      if (!new RegExp(`(?:[a-z]+)?${years[1]}–(?:[a-z]+)?${years[2]}`).test(edu))
        problems.push(`Education: no period ${years[1]} – ${years[2]}`);
    }
  }

  // Every hyperlink on the CV, bar the one pointing back at this site.
  for (const url of links) {
    if (url.startsWith(SELF)) continue;
    checked++;
    if (!html.includes(`href="${url}"`)) problems.push(`CV link not on the site: ${url}`);
  }

  return { problems, checked };
}

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

  console.log('\nCV PARITY (AI variant of cv/Hieu_Nguyen_CV.tex vs index.html)');
  const { problems, checked } = cvParity(pages.get('index.html') ?? '');
  failures += problems.length;
  for (const p of problems) console.log(`  FAIL  ${p}`);
  if (!problems.length) console.log(`  ok    all ${checked} CV fact(s) present where the CV puts them`);

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
