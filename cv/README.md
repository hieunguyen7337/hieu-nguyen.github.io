# CV

LaTeX source for the CV, plus the build scripts and the facts ledger the copy is drafted from.
The compiled PDFs are **not** kept here — they live in `../public/` so Astro serves them with the
site, and the download link in `src/components/Hero.astro` points at the default one via the
`asset()` helper.

## Three variants, one source

`Hieu_Nguyen_CV.tex` carries a single switch near the top:

```latex
\def\variant{ai}     % ai | data | fullstack
```

`\AI{...}`, `\DATA{...}`, `\FULL{...}` and `\NOTFULL{...}` wrap the blocks that differ. The
variants share the header, Experience below Plenarius, Projects & Awards, Education and
Volunteer; they differ in the Summary, the Skills lists and the Plenarius
bullets, and the Full Stack build drops the Cognilaw entry.

| Variant | Output | Angle |
|---|---|---|
| `ai` | `public/Hieu_Nguyen_CV.pdf` | Retrieval, evaluation, quantisation, agentic tooling |
| `data` | `public/Hieu_Nguyen_CV_Data.pdf` | PostgreSQL, indexing, query plans, vector storage |
| `fullstack` | `public/Hieu_Nguyen_CV_FullStack.pdf` | Go runtime, React islands, deliberate simplicity |

`ai` is the default download from the site. The other two are for direct application, not linked
from the site navigation.

## Building

```bash
bash cv/build.sh        # builds all three into cv/build/
python cv/pdfcheck.py   # verifies page count and per-variant content
```

`build.sh` rewrites only the switch line per variant (via `setvariant.py`, which fails loudly if
it does not match exactly once) and compiles with **tectonic**. `pdfcheck.py` then reads the
built PDFs — not the source — and asserts they are two pages, mutually distinct, and that each
variant marker appears only where it should. The failure this guards against is a broken rewrite
producing three identical files under three different names, which looks like success.

Copying into `public/` is deliberate and separate:

```bash
cp cv/build/Hieu_Nguyen_CV{,_Data,_FullStack}.pdf public/   # screen PDFs only
```

### Print versions

A second switch, `\def\medium{screen}` (`screen | print`), is orthogonal to the variant.
`build.sh` builds every variant twice, so `cv/build/` also holds `Hieu_Nguyen_CV_Print.pdf`,
`Hieu_Nguyen_CV_Data_Print.pdf` and `Hieu_Nguyen_CV_FullStack_Print.pdf` for black-and-white
printing: black headings and rules, dark-grey secondary text that survives a photocopy, black link
text, and the header's `Portfolio | LinkedIn | GitHub` labels spelled out as addresses, since on
paper a link label has nothing behind it. `\SCREEN{...}` and `\PRINT{...}` wrap the differences,
mirroring `\AI{...}`.

The print files are for printing locally and are **not** copied into `public/` -- hence the
explicit filenames in the `cp` above rather than a glob. `pdfcheck.py` holds them to two pages and
the same content markers as their screen twins, and reads the content streams to assert they
contain no non-grey colour operator; the screen files are asserted to contain colour, which is
what proves the detector fires at all.

### Toolchain

Tectonic 0.17.0, installed into an isolated conda environment (~294 MB, versus ~1 GB for a
MiKTeX install):

```bash
conda create -n tex -c conda-forge tectonic=0.17.0 -y
conda install -n tex -c conda-forge poppler -y   # pdftoppm / pdftotext, for inspecting output
```

`build.sh` looks for the binary at `$HOME/.conda/envs/tex/Library/bin/tectonic.exe`; override
with `TECTONIC=/path/to/tectonic`. Tectonic downloads the packages a document actually needs on
first run and caches them, so there is no full TeX Live tree.

CI does **not** compile the CV — the deploy workflow only runs `npm run build`. The PDFs in
`public/` are checked-in binaries. Editing the `.tex` does not change what visitors download
until `build.sh` is run and the output copied over.

Packages used: `geometry`, `fontenc`, `inputenc`, `lmodern`, `hyperref`, `enumitem`, `titlesec`,
`xcolor`, `array`, `tabularx`.

Keep the filenames stable: they are what recruiters see when they save the file, and changing one
silently breaks any link already shared.

## Where the words come from

Prose in the CV is not written directly. Per the repo's `CLAUDE.md`, it is drafted with
`agy --model=gemini-3.8-flash-high`, and this directory holds the scaffolding that makes that
safe to do for a document that will be read line by line.

**Not in the public repo:** `facts.md`, `prompts/` and `private-checks.json` are git-ignored.
They hold detail deliberately kept off public surfaces; keep your own copy.

- **`facts.md`** — the closed world. Every claim is tagged `VERIFIED` (with a source path on the
  `beta` branch), `NEEDS-CONFIRM`, or `DROPPED` with the reason. Nothing may enter the CV that is
  not in here. The `DROPPED` table is load-bearing: it records retired claims that would otherwise
  keep resurfacing.
- **`prompts/_brief.md`** — prepended to every prompt. Reader profile, register rules, and the
  `INSUFFICIENT FACTS:` escape hatch that gives the model a legitimate alternative to inventing.
- **`prompts/<artefact>.md`** — one task file per piece. Carries the fact IDs in scope, the
  length, and the angle. It restates no facts.
- **`prompts/run.sh <item>`** — concatenates brief + facts + task, calls `agy`, saves to
  `prompts/out/<item>.txt`.
- **`prompts/gate.sh <item>`** — the verification gate. Flags banned register words, explicitly
  retired claims, numbers absent from the ledger, and technical-looking tokens absent from the
  ledger.

### What the gate does and does not catch

It catches fabricated identifiers and figures. It cannot catch a true fact used wrongly, because
every token is legitimate — a reduced-precision rerank described for what is actually an exact
rescore passed it three times. It also cannot catch fabrication written in ordinary English: "80% accuracy" came
back as "80% accuracy on the held-out test set", and the ledger says nothing about a held-out
split.

So the order is: the ledger stops invention, the gate stops drift, and **a human read stops
misuse**. All three are necessary. Never paste generated copy without reading it.

## Files

| File | Purpose |
|---|---|
| `Hieu_Nguyen_CV.tex` | The source. CRLF line endings |
| `build.sh` | Builds all three variants |
| `setvariant.py` | Rewrites the variant switch; fails if it does not match once |
| `pdfcheck.py` | Verifies the built PDFs |
| `facts.md` | The facts ledger |
| `prompts/` | House brief, per-artefact prompts, runner, gate |
| `prompts/out/` | Generated copy (gitignored) |
| `build/` | Build output (gitignored) |
| `previous/` | Superseded PDFs, kept for reference |

## Note on `.tex` line endings

The source uses CRLF. A `$`-anchored `sed` expression will not match its lines, and bash heredocs
in this environment collapse a doubled backslash to a single one, which breaks naive patch
scripts against LaTeX macros. Write backslash-heavy helpers as files rather than heredocs; that
is why `setvariant.py` and `pdfcheck.py` exist as files.
