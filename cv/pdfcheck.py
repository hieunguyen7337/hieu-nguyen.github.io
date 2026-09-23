#!/usr/bin/env python
"""Verify the built CV PDFs: page count, each variant's own content, and print-medium ink.

    python cv/pdfcheck.py

Three PDFs built from one source with a switch line is exactly the setup where a broken rewrite
produces three identical files under three different names. That failure is invisible unless the
PDFs themselves are inspected, so this reads the built artefacts rather than the source.

No third-party dependency: pip is unavailable in this environment, so the Flate streams are
inflated with zlib and the text operators read directly.
"""
import json
import os
import re
import sys
import zlib

BUILD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")

# (label, marker, expected-in) -- markers chosen to be unique to one variant's copy.
# Keep markers long. norm() strips spaces and punctuation, so a two-character marker will
# collide with a letter pair inside an unrelated word and report a failure that is not real.
MARKERS = [
    ("Cognilaw role", "Cognilaw", {"ai", "data"}),
    ("AI: retrieval evaluation", "evaluation across retrieval configurations", {"ai"}),
    ("Data: pagination bug", "pagination correctness bug", {"data"}),
    ("Full: client-side islands", "client-side islands", {"fullstack"}),
    ("Full: seven dependencies", "seven direct", {"fullstack"}),
    ("AgentCamp presentation", "AgentCamp", {"ai", "data", "fullstack"}),
    ("awards section", "UNSW National", {"ai", "data", "fullstack"}),
    ("mock interview events", "mock interview", {"ai", "data", "fullstack"}),
    ("AI engineer opener", "AI engineer", {"ai"}),
    # Renamed on owner instruction 2026-09-23. The old heading is asserted absent, since
    # "Volunteer" alone would also match it.
    ("volunteer heading", "Volunteer", {"ai", "data", "fullstack"}),
    ("no old leadership heading", "Leadership & Volunteering", set()),
    # The role-line descriptor was removed on owner instruction (F10): the AI Summary already
    # describes the product in the same words, and the organisation name now links to
    # plenarius.org instead, which does the same job for nothing. Asserted ABSENT so a later
    # edit cannot quietly reintroduce the duplication.
    ("no Plenarius role descriptor", "Open research platform for academic papers", set()),
    ("no Cognilaw part-time label", "Part-time", set()),
    # Cost corrected twice on 2026-09-22 (F6.3): $20 -> A$46 -> US$43, the last being Hetzner
    # plus Cloudflare combined. A wrong number in front of a bank is the cheapest possible own
    # goal, so both superseded figures are asserted absent, not merely replaced.
    ("corrected cost figure", "US$43", {"ai", "fullstack"}),
    ("no stale $20 cost", "$20 a month", set()),
    ("no stale $20 cost (per)", "$20 per month", set()),
    ("no superseded A$46 cost", "A$46", set()),
    # Removed from Skills on owner instruction; it stays in the first CTO bullet only.
    ("no recommendation skill entry", "recommendation systems", set()),
    # Owner-directed skills trim (F10). Full Stack keeps "React islands" on purpose: its Summary
    # argues the islands point, so plain "React" there would contradict the variant's own pitch.
    ("no retrieval evaluation skill", "retrieval evaluation", set()),
    ("React islands kept on Full Stack only", "React islands", {"fullstack"}),
    # Papers are live (F6.2) and carry the scale signal; claims are not (F6.1, F8), so the
    # claims figure must stay out even though it is the larger number.
    ("papers corpus figure", "200,000 papers", {"ai", "data"}),
    # FPT's production-engineering claim is the only counter-evidence to the observability gap
    # the ledger records (F8). It lost visibility once as a trailing participle, which is why
    # this marker exists; the owner-directed single bullet (F10) keeps it as its own sentence,
    # so the claim survives the merge. Assert the sentence, not the bullet count.
    ("FPT MLOps sentence", "CI/CD and production monitoring", {"ai", "data", "fullstack"}),
    # The owner asked for a stack line on every project. SafeMind's and Capture the Narrative's
    # were capability-level placeholders until 2026-09-22; these assert the real stacks (F7.13)
    # survive, since a placeholder is exactly what a later regeneration would restore.
    ("workflow platform stack", "LangGraph", {"ai", "data", "fullstack"}),
    # The contract-validation and eval-coverage claims are the two things in this entry that
    # speak to the reader's own stated priorities (specification over generation, TDD). They
    # were missing from the description for three rounds while sitting in F7.1 the whole time.
    ("workflow contract validation", "Pydantic GraphSpec contract", {"ai", "data", "fullstack"}),
    ("workflow eval coverage", "eval coverage", {"ai", "data", "fullstack"}),
    ("SafeMind stack", "Flask, OpenAI API, MongoDB", {"ai", "data", "fullstack"}),
    ("Capture the Narrative stack", "multi-agent simulation, AWS EC2", {"ai", "data", "fullstack"}),
    # The cloud line carries, in descending order of evidence: Azure Functions (F7.2, production
    # at FPT), AWS EC2/S3 (F7.9, a competition deployment) and the Plenarius estate (F6.11).
    # "Azure Functions" is the only established form -- bare "Azure" overclaims the platform's
    # breadth, so the generation gate blocks it; here the compound itself is asserted present.
    ("cloud skills line", "Cloud & infrastructure", {"ai", "data", "fullstack"}),
    ("Azure service-scoped", "Azure (Functions, Cosmos DB)", {"ai", "data", "fullstack"}),
    # MongoDB earns its place from two independent instances -- Cosmos DB's Mongo API at FPT
    # (F7.2) and real MongoDB in SafeMind (F7.10). It sits on the language line, never fused
    # with Cosmos DB into one claim; the two are operationally different things (F8).
    ("MongoDB skill", "MongoDB", {"ai", "data", "fullstack"}),
    ("no blurred Mongo/Cosmos claim", "MongoDB (Cosmos", set()),
    # Inheriting the platform and replacing it is a different claim from replacing your own work.
    # Owner-supplied wording (F10) -- these three assert the supplied text is still in place, so
    # a later regeneration that reverts an owner decision fails the build rather than shipping.
    ("Plenarius inheritance", "Inherited a PHP-based platform", {"ai"}),
    ("owner-directed cost figure", "8-vCPU server for roughly", {"ai"}),
    ("owner-directed Cognilaw bullet", "response-quality metrics", {"ai", "data"}),
    # Invented churn metrics proposed 2026-09-22; they conflict with F7.7's 80% accuracy.
    ("no invented churn recall", "recall@top10", set()),
    ("no invented churn lift", "lift over random", set()),
    # The ledger puts full-time industry at 3 years 2 months and says to use dates, not a
    # headline number. A tenure claim is the easiest thing to inflate by accident.
    # Overridden for the AI Summary only, by owner instruction 2026-09-23 (F10): "4 years of
    # experience" is the owner's own wording, asserted present there and absent elsewhere. (A
    # "4+" ban cannot be expressed here: norm() strips the "+", so it would match this text.)
    ("owner-directed tenure (AI summary)", "4 years of experience", {"ai"}),
    ("Jarvis removed", "Jarvis", set()),
    ("Practice skill line gone", "Practice:", set()),
    ("quantisation != precision", "precision improvement", set()),
    ("no location line", "Brisbane, Australia", set()),
    ("no TypeScript", "TypeScript", set()),
]

# Absence checks whose needles are themselves private -- the claims-tier figure, model names,
# internal evaluation and index figures. Listing them here would publish exactly what they keep
# off the CV, since this repo is public. They live in the git-ignored private-checks.json.
PRIVATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "private-checks.json")
if os.path.exists(PRIVATE):
    with open(PRIVATE, encoding="utf-8") as fh:
        MARKERS += [(label, needle, set()) for label, needle in json.load(fh)["cv_absent"]]
    PRIVATE_LOADED = True
else:
    PRIVATE_LOADED = False

# Hyperlink targets, checked separately from MARKERS because they live in /URI annotation
# objects rather than in the text streams -- every text marker above is blind to them. A link
# can disappear in a rewrite without changing one visible character, which is exactly what
# happened: the CV that preceded the 2026-09-21 rebuild carried the FPT patent release, the
# Cognilaw site and the pose repo, and all three were silently lost.
#
# Substring match against the URL. Keep fragments distinctive: a bare domain can appear inside
# an unrelated longer URL.
LINKS = [
    ("portfolio", "hieunguyen7337.github.io", {"ai", "data", "fullstack"}),
    ("LinkedIn", "linkedin.com/in/", {"ai", "data", "fullstack"}),
    ("GitHub profile", "github.com/hieunguyen7337", {"ai", "data", "fullstack"}),
    ("Plenarius product", "plenarius.org", {"ai", "data", "fullstack"}),
    # Cognilaw is dropped from the Full Stack variant, so its link must go with it.
    ("Cognilaw site", "cognilawai.com", {"ai", "data"}),
    # Third-party confirmation of the strongest credential on the CV, on the awarding company's
    # own newsroom. If one link survives a future rewrite, it should be this one.
    ("FPT patent release", "fpt-achieves-us-patent", {"ai", "data", "fullstack"}),
    ("pose estimation repo", "trt_pose_edited", {"ai", "data", "fullstack"}),
    ("workflow platform repo", "AI_Agent_Local_Workflow_PLatform", {"ai", "data", "fullstack"}),
    # SafeMind's repo is private -- an anonymous request to it returns 404. A dead link on a CV
    # is worse than no link, so this asserts it stays out.
    ("no private SafeMind repo", "Tanda_Hackathon", set()),
]

# (variant, medium, file). Every MARKER and LINK applies to both media: a print build is the
# same CV with different ink, so its content must match its screen twin's.
FILES = [
    ("ai", "screen", "Hieu_Nguyen_CV.pdf"),
    ("data", "screen", "Hieu_Nguyen_CV_Data.pdf"),
    ("fullstack", "screen", "Hieu_Nguyen_CV_FullStack.pdf"),
    ("ai", "print", "Hieu_Nguyen_CV_Print.pdf"),
    ("data", "print", "Hieu_Nguyen_CV_Data_Print.pdf"),
    ("fullstack", "print", "Hieu_Nguyen_CV_FullStack_Print.pdf"),
]

# Text that must appear only in one medium. On paper a link label is a word with nothing
# behind it, so the print header spells the addresses out; the screen header keeps the labels.
MEDIUM_MARKERS = [
    ("header GitHub address", "github.com/hieunguyen7337", {"print"}),
    ("header LinkedIn address", "linkedin.com/in/hieu-nguyen", {"print"}),
    ("Plenarius address", "Calimac) | plenarius.org", {"print"}),
]

# A PDF colour operator with its operands: "r g b rg" (fill) / "RG" (stroke), "c m y k k" / "K",
# and the generic "sc"/"scn" forms.
COLOUR_OPS = re.compile(
    rb"((?:-?[0-9]*\.?[0-9]+\s+){3,4})(rg|RG|k|K|scn|SCN|sc|SC)(?![A-Za-z])")


def chromatic(blob):
    """Colour operators whose value is not a neutral grey. Empty means black and white.

    This is what makes "print" a checked property rather than a trusted switch: a medium
    rewrite that silently no-ops would build a colour PDF under a _Print name.
    """
    bad = []
    for m in COLOUR_OPS.finditer(blob):
        vals = [float(v) for v in m.group(1).split()]
        op = m.group(2).decode()
        if op in ("k", "K"):
            if len(vals) != 4:
                continue
            neutral = vals[0] == vals[1] == vals[2] == 0
        else:
            neutral = len(set(vals[-3:])) == 1
        if not neutral:
            bad.append("%s %s" % (" ".join("%g" % v for v in vals), op))
    return bad


def inflate(path):
    raw = open(path, "rb").read()
    chunks = []
    for m in re.finditer(b"stream\r?\n", raw):
        start = m.end()
        end = raw.find(b"endstream", start)
        if end < 0:
            continue
        try:
            chunks.append(zlib.decompress(raw[start:end]))
        except zlib.error:
            pass
    return raw, b"".join(chunks)


def text_of(blob):
    r"""Pull literal strings out of the content stream's text operators.

    Handles PDF octal escapes (\ddd). Without that, a TeX ligature -- emitted as \034 for "fi"
    -- decodes as the three characters "034" and silently breaks any search for a word
    containing it, which is most words with "fi" or "fl" in them.
    """
    text = blob.decode("latin-1")
    parts, buf = [], []
    depth = i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch == chr(92) and depth:
            nxt = text[i + 1] if i + 1 < n else ""
            if nxt.isdigit():
                j = i + 1
                octal = ""
                while j < n and len(octal) < 3 and text[j] in "01234567":
                    octal += text[j]
                    j += 1
                buf.append(chr(int(octal, 8)))
                i = j
                continue
            buf.append({"n": chr(10), "r": chr(13), "t": chr(9)}.get(nxt, nxt))
            i += 2
            continue
        if ch == "(":
            depth += 1
            if depth == 1:
                buf = []
                i += 1
                continue
        elif ch == ")":
            depth -= 1
            if depth <= 0:
                depth = 0
                parts.append("".join(buf))
                i += 1
                continue
        if depth:
            buf.append(ch)
        i += 1
    # Joined with no separator: a TJ array splits a word across strings to apply kerning, so
    # "Cognilaw" is emitted as (Cognila)(w). Callers normalise before matching.
    return "".join(parts)


LIGATURES = {
    # Unicode presentation forms, for text that arrives already decoded.
    "ﬀ": "ff", "ﬁ": "fi", "ﬂ": "fl", "ﬃ": "ffi", "ﬄ": "ffl",
    # T1 (Cork) font slots, which is how they actually appear in this document's streams.
    chr(0x1B): "ff", chr(0x1C): "fi", chr(0x1D): "fl", chr(0x1E): "ffi", chr(0x1F): "ffl",
}


def norm(s):
    for lig, plain in LIGATURES.items():
        s = s.replace(lig, plain)
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def uris(raw, blob):
    r"""Every /URI target in the document, from the raw bytes and the inflated streams.

    hyperref writes link targets as /URI (...) inside annotation dictionaries. Those are not
    text operators, so text_of() never sees them -- which is the whole reason this exists.
    Annotations are usually outside the compressed streams, but object streams can carry them,
    so both are scanned.
    """
    found = []
    for src in (raw, blob):
        for m in re.finditer(b"/URI\\s*\\(([^)]*)\\)", src):
            u = m.group(1).decode("latin-1")
            if u not in found:
                found.append(u)
    return found


def pages(raw, blob):
    # /Count also appears on font and outline objects, so it overcounts. Count page objects.
    n = len(re.findall(b"/Type\\s*/Page(?![s])", raw + blob))
    if n:
        return n
    counts = [int(x) for x in re.findall(b"/Count[^0-9]{0,3}([0-9]+)", raw + blob)]
    return max(counts) if counts else 0


def main():
    if not os.path.isdir(BUILD):
        print("no build directory: run bash cv/build.sh first", file=sys.stderr)
        return 1

    texts, links, colour, failures = {}, {}, {}, 0
    print("%-10s %-7s %-36s %6s %9s  %s" % ("VARIANT", "MEDIUM", "FILE", "PAGES", "BYTES", "INK"))
    print("-" * 84)
    for variant, medium, name in FILES:
        key = (variant, medium)
        path = os.path.join(BUILD, name)
        if not os.path.exists(path):
            print("MISSING: " + path, file=sys.stderr)
            failures += 1
            continue
        raw, blob = inflate(path)
        texts[key] = text_of(blob)
        links[key] = uris(raw, blob)
        colour[key] = chromatic(blob)
        n = pages(raw, blob)
        flag = "" if n <= 2 else "   <-- over two pages"
        if n > 2:
            failures += 1
        ink = "colour" if colour[key] else "grey"
        # Print must be grey. Screen must be colour -- which also proves the detector works,
        # since a detector that never fires would pass every print file.
        if (medium == "print") != (ink == "grey"):
            failures += 1
            ink += "  <-- wrong for " + medium
            if medium == "print":
                ink += " (" + ", ".join(sorted(set(colour[key]))[:3]) + ")"
        print("%-10s %-7s %-36s %6d %9d  %s%s" % (variant, medium, name, n, len(raw), ink, flag))

    # three identical files is the failure this check exists for -- compared within a medium,
    # since a print file legitimately differs from its screen twin in the header.
    print()
    for medium in ("screen", "print"):
        group = [v for k, v in texts.items() if k[1] == medium]
        if len(set(group)) != len(group):
            print("FAIL: two or more %s PDFs have identical text -- the variant switch did not "
                  "apply" % medium)
            failures += 1
        else:
            print("distinct content (%s): yes (all three differ)" % medium)

    heads = ["%s/%s" % (v, "scr" if m == "screen" else "prt") for v, m, _ in FILES]
    row_fmt = "%-32s " + " ".join(["%-11s"] * len(FILES))

    def table(title, rows, found, wanted):
        bad = 0
        print()
        print(row_fmt % tuple([title] + heads))
        print("-" * (33 + 12 * len(FILES)))
        for label, needle, expect in rows:
            row = []
            for variant, medium, _ in FILES:
                got = found((variant, medium), needle)
                ok = got == wanted(variant, medium, expect)
                if not ok:
                    bad += 1
                row.append(("yes" if got else "-") + ("" if ok else " !!"))
            print(row_fmt % tuple([label] + row))
        return bad

    failures += table("MARKER", MARKERS,
                      lambda k, m: norm(m) in norm(texts.get(k, "")),
                      lambda v, m, e: v in e)
    failures += table("LINK", LINKS,
                      lambda k, f: any(f in u for u in links.get(k, [])),
                      lambda v, m, e: v in e)
    failures += table("MEDIUM", MEDIUM_MARKERS,
                      lambda k, m: norm(m) in norm(texts.get(k, "")),
                      lambda v, m, e: m in e)

    print()
    if failures:
        print("CHECK: %d problem(s)." % failures)
        return 1
    if not PRIVATE_LOADED:
        print("WARNING: cv/private-checks.json not found -- private absence checks skipped.")
    print("CHECK: all six PDFs are correct.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
