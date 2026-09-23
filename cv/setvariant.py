#!/usr/bin/env python
"""Copy the CV source, rewriting its variant switch and, optionally, its medium switch.

    python cv/setvariant.py <src.tex> <dest.tex> <ai|data|fullstack> [screen|print]

Exists as a file rather than a sed expression because the source uses CRLF line endings, which
defeat a "$" anchor, and because the pattern is full of backslashes that shell quoting mangles.
Exits non-zero unless exactly one switch line was rewritten -- a silent no-op here would build
three identical PDFs under three different names, which is the one failure that looks like
success. The medium switch gets the same guard: a no-op there ships a "print" PDF in colour.
"""
import io
import re
import sys

BACKSLASH = chr(92)
PATTERN = re.compile(re.escape(BACKSLASH + "def" + BACKSLASH + "variant") + r"\{[a-z]*\}")
VARIANTS = ("ai", "data", "fullstack")
MEDIUM_PATTERN = re.compile(re.escape(BACKSLASH + "def" + BACKSLASH + "medium") + r"\{[a-z]*\}")
MEDIA = ("screen", "print")


def rewrite(text, pattern, name, value, src):
    # A function replacement, not a string: re parses backslash escapes in a string
    # replacement, and these start with "\d".
    replacement = BACKSLASH + "def" + BACKSLASH + name + "{" + value + "}"
    out, n = pattern.subn(lambda _m: replacement, text)
    if n != 1:
        print("expected exactly 1 %s switch in %s, found %d" % (name, src, n), file=sys.stderr)
        return None
    return out


def main():
    if len(sys.argv) not in (4, 5):
        print(__doc__.strip(), file=sys.stderr)
        return 2
    src, dest, variant = sys.argv[1:4]
    medium = sys.argv[4] if len(sys.argv) == 5 else "screen"
    if medium not in MEDIA:
        print("unknown medium %r, expected one of %s" % (medium, ", ".join(MEDIA)),
              file=sys.stderr)
        return 2
    if variant not in VARIANTS:
        print("unknown variant %r, expected one of %s" % (variant, ", ".join(VARIANTS)),
              file=sys.stderr)
        return 2

    text = io.open(src, encoding="utf-8", newline="").read()
    out = rewrite(text, PATTERN, "variant", variant, src)
    if out is not None:
        out = rewrite(out, MEDIUM_PATTERN, "medium", medium, src)
    if out is None:
        return 1

    io.open(dest, "w", encoding="utf-8", newline="").write(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
