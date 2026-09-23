#!/usr/bin/env bash
# Build the three CV variants, each for screen and for black-and-white print, from one source.
#
#   bash cv/build.sh
#
# The source carries one \def\variant{...} line and one \def\medium{...} line. This script
# rewrites both per build, compiles with tectonic, and writes the PDFs into cv/build/. Copying
# the screen PDFs into public/ is a separate, deliberate step -- public/ is what the site
# serves. The *_Print.pdf files are for printing locally and are not shipped.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TECTONIC="${TECTONIC:-$HOME/.conda/envs/tex/Library/bin/tectonic.exe}"
SRC="$ROOT/cv/Hieu_Nguyen_CV.tex"
OUT="$ROOT/cv/build"

[ -x "$TECTONIC" ] || { echo "tectonic not found at $TECTONIC" >&2; exit 1; }
mkdir -p "$OUT"

build() {
  variant="$1"; name="$2"; medium="${3:-screen}"
  work="$OUT/.$name"
  mkdir -p "$work"
  python "$ROOT/cv/setvariant.py" "$SRC" "$work/$name.tex" "$variant" "$medium"
  "$TECTONIC" -X compile --outdir "$work" --keep-logs "$work/$name.tex" >/dev/null 2>"$work/$name.err" \
    || { echo "FAILED: $variant"; tail -25 "$work/$name.err" >&2; exit 1; }
  mv "$work/$name.pdf" "$OUT/$name.pdf"
  printf '  %-34s %7s bytes\n' "$name.pdf" "$(wc -c < "$OUT/$name.pdf")"
}

echo "Building three variants x two media with $("$TECTONIC" --version)"
build ai        Hieu_Nguyen_CV
build data      Hieu_Nguyen_CV_Data
build fullstack Hieu_Nguyen_CV_FullStack
build ai        Hieu_Nguyen_CV_Print           print
build data      Hieu_Nguyen_CV_Data_Print      print
build fullstack Hieu_Nguyen_CV_FullStack_Print print
echo "Done -> cv/build/"
