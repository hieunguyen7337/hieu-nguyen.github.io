# CLAUDE.md

Personal portfolio for Hieu Nguyen. Static build, deployed to GitHub Pages via
`.github/workflows/deploy.yml` on push to `main`.

Note the `base: '/hieu-nguyen.github.io'` in `astro.config.mjs` — every local URL carries that
prefix. Use the `asset()` helper from `src/utils/asset.ts` for anything in `public/`; never
hardcode a leading-slash path.

## Writing text content — use agy / Gemini 3.8 Flash (High)

**All user-facing prose on this site is drafted with the `agy` CLI on `gemini-3.8-flash-high`,
not written directly.** The owner's rationale is that this model benchmarks higher on writing
quality.

This covers:

- the About paragraph (`src/components/About.astro`) and hero copy (`src/components/Hero.astro`)
- every `description` field in `src/data/projects.ts` and `src/data/experience.ts`
- blog post body copy in `src/content/blog/`
- `title` / `description` meta text in `src/layouts/Base.astro` and page frontmatter

It does **not** cover code, component markup, Tailwind classes, config, commit messages, or
replies in chat. Write those directly.

### Invocation

```bash
agy --model=gemini-3.8-flash-high -p="$(cat prompt.txt)"
```

Flag syntax is load-bearing (verified against agy v1.2.5, still correct on v1.2.8):

- `-p` consumes the **next token** as its value. So never put another flag immediately after it:
  `agy -p --model=X 'prompt'` makes `-p` swallow `--model=X` and the real prompt is dropped.
  `agy` catches this case and errors rather than failing silently.
- These all work: `agy --model=X -p 'prompt'`, `agy -p 'prompt' --model=X`, `agy -p='prompt'`.
  Prefer `--model=X -p='...'` — it is unambiguous regardless of what else is on the line.
- Effort is part of the model ID (`-high` / `-medium` / `-low`). There is a separate `--effort`
  flag but it is not needed when the ID already specifies the level.
- **Tell it not to use tools.** From v1.2.8 a long prompt full of file paths makes it try to
  read them, and in headless mode that permission cannot be prompted for, so the run is
  auto-denied and produces *nothing*:
  `jetski: no output produced — a tool required the "command" permission`. The CV and site
  briefs now open with an explicit "do not use tools, the paths are provenance" line. Do not
  reach for `--dangerously-skip-permissions` here; it auto-approves every tool for the run.
- Multi-line prompts: write to a file first, then `-p="$(cat ...)"`.
- Expect ~11s for a trivial prompt, ~18s for a paragraph rewrite.

### Prompting notes

Give it the current text, the specific problems to fix, and hard constraints — length, Australian
/ British spelling (`specialising`, `optimisation`), and the plain non-boastful register the site
uses. Tell it to output **only** the finished text, no preamble.

Two observed failure modes, both of which need a human check before anything is pasted in:

1. **It invents plausible specifics to satisfy a "be concrete" instruction.** Asked for a Calimac
   description, it produced "citation graph indexing" and "collaboration tooling" — features that
   were never in the brief. Fact-check every concrete noun, number and capability it returns
   against something real before it goes on the site.
2. **It drops sentences it judges weak.** Often the right call, but that is a content decision,
   not a copy-edit.

Give it only facts you can stand behind, and treat anything specific it adds as a claim to verify,
not a gift.

## Content structure

- `src/data/projects.ts` — projects. `tier` and badge `color` are unions in the file's own types.
- `src/data/experience.ts` — experience timeline + education.
- `src/content/blog/` — blog posts, schema enforced in `src/content/config.ts`.
- `public/` — images, referenced by path relative to `public/`.

## CV

`cv/` holds the LaTeX source, the build scripts and the facts ledger. **Read `cv/README.md`
before touching anything in there.**

Three variants build from one source via a single `\def\variant{...}` switch: `ai` (the default
download), `data` and `fullstack`.

```bash
bash cv/build.sh        # all three, screen + print -> cv/build/
python cv/pdfcheck.py   # verify page count, per-variant content, print ink
cp cv/build/Hieu_Nguyen_CV{,_Data,_FullStack}.pdf public/   # screen PDFs only
```

The toolchain is **tectonic** in an isolated conda env (`conda create -n tex -c conda-forge
tectonic`), roughly 294 MB rather than a full TeX distribution. `build.sh` expects it at
`$HOME/.conda/envs/tex/Library/bin/tectonic.exe`; override with `TECTONIC=`.

CI does not compile the CV — the deploy workflow only runs `npm run build`. The PDFs in `public/`
are checked-in binaries, so **editing the `.tex` does not change what visitors download** until
`build.sh` runs and the output is copied over. Never imply the site's CV is current on the
strength of a `.tex` edit alone.

Copy into `public/` as a separate deliberate step, not from `build.sh`. The `*_Print.pdf`
black-and-white builds stay in `cv/build/` and are never shipped; a `cp cv/build/*.pdf` glob
would ship them. Superseded PDFs go to `cv/previous/`.

### CV copy is generated, and gated

Prose in the CV follows the agy/Gemini rule above, with extra scaffolding because every line
will be read closely: `cv/facts.md` is a closed-world ledger every prompt reads from,
`cv/prompts/_brief.md` is prepended to each prompt, and `cv/prompts/gate.sh` checks output
against the ledger.

The ledger, the prompts and `cv/private-checks.json` are **git-ignored and local only** -- this
repo is public and they hold detail deliberately kept off every public surface. Nothing backs them
up but this machine, so keep a copy elsewhere.

The gate catches invented identifiers and figures. It does **not** catch a true fact used wrongly,
nor fabrication phrased in ordinary English — both have happened. Always read generated copy
before it lands.

## House style

- Australian / British spelling throughout.
- Concrete and specific over promotional. Name the system, the scale, the result. Avoid
  "passionate", "cutting-edge", "leveraging".
- Metrics keep their real precision (GPA is 6.54, not 6.5).
