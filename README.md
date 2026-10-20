# AI Product Design — the kit

**The downloads, the runnable case and the tool behind the storyline *AI Product Design: from a costly
decision to an AI product people trust* (faridgurbanov.com, links added when published).**

Each part of the storyline ends with something to use in your own meeting next week, without the
author in the room. This repository is where those things live, in a form you can read, change and
take apart:

| Folder | What it is | For | Licence |
|---|---|---|---|
| [`parts/`](parts/) | **The downloads**, one folder per part: canvases, cards, templates, registers. Each ships **blank**, and most also **filled in** for the running case (`*.claims.md`). Markdown is the source; the PDF, DOCX, XLSX and PPTX on the site are built from it | Sponsors, Product Owners, architects, compliance | CC BY 4.0 |
| [`case/`](case/) | **The running case as data**: synthetic claims for a fictional insurer, and a script that recomputes every number the storyline quotes | Anyone who wants to check the arithmetic or try another threshold | Code MIT · text CC BY 4.0 |
| [`whosigns/`](whosigns/) | **The engineering tool for Part 8**: measure the review queue, check a brief, gate a change, keep the evidence. Runs in your git host and CI; nothing leaves your organization | Engineering leads | MIT |

## The parts and their downloads

| Part | Downloads (toolkit number) |
|---|---|
| [1 · Frame the decision](parts/1-frame-the-decision/) | Use-case canvas (1) · vendor question list (5) |
| [2 · Choose the approach](parts/2-choose-the-approach/) | Approach ladder card (19) · glossary cards, EN and NL (6) |
| [3 · Data and evaluation](parts/3-data-and-evaluation/) | Scorecard template (8) |
| [4 · Make it run](parts/4-make-it-run/) | Reference architecture (2) · readiness scorecard (4) |
| [5 · Design for people](parts/5-design-for-people/) | Automation and failure card (20) |
| [6 · Risk and governance](parts/6-risk-and-governance/) | AI product risk register (21) · control map (13) |
| [7 · Process and proposal](parts/7-process-and-proposal/) | One-page proposal (22) · first-quarter plan (10) |
| [8 · Building it with agents](parts/8-building-with-agents/) | Brief template and six-failure checklist (3) · PO copilot instructions (7) · who-signs matrix (9) · size-limit rules (11) · team pulse survey (12) · review-bottleneck readout (14, with `whosigns measure`) · experiment card (16) |

The full index, with status per item, is in [`parts/README.md`](parts/README.md).

## The running case

One fictional mid-size non-life insurer in the Benelux wants small home-contents and buildings claims
paid the same day instead of after eight working days. The head of claims owns it. Every part shows
its step on that case, and every filled-in download uses the case's numbers, labelled *synthetic*.
The insurer is not a real company and the data is not real data. Real market facts appear in the
storyline beside the case, with their sources, and never inside its arithmetic.

## Rules for every item

1. **Usable alone.** One page where possible; no account, no sign-up.
2. **Editable.** You can change it for your own meeting; that is the point.
3. **Tool-neutral.** Nothing depends on one vendor's assistant.
4. **No figure without a source.** Case numbers are synthetic and say so; any real figure names its
   source.
5. **Not legal advice.** The risk and control items point at obligations; your counsel decides.

## whosigns

**`whosigns measure` is built** (Loop 1, *Is review our bottleneck?*): pull-request metrics, the queue
in front of human review, team aggregation with suppression below five people, a before/after report
and a one-page readout. Brief, Gate and Evidence are specification. See
[`whosigns/README.md`](whosigns/README.md), the specification in [`docs/spec.md`](docs/spec.md) and
the decisions in [`docs/decisions/`](docs/decisions/).

```
cd whosigns && npm install && npm run build
WHOSIGNS_TOKEN=<read-only token> node dist/src/cli.js measure \
  --config whosigns.yml --baseline 2025-01-01..2025-03-31 --current 2026-07-01..2026-09-30
```

For a governed specification service with immutable versions and a verifiable audit record, see
[maestro](https://github.com/fps4/maestro); whosigns is its git-native, lightweight counterpart.

## Status

Draft, private, for review (2026-10-20). Nothing is published; the storyline publishes one part at a
time, and a part is not published without its downloads. This repository was
`copilot-to-capability-kit` until 2026-10-20 — see
[ADR-0005](docs/decisions/0005-one-kit-for-the-storyline.md).

This is shared in the open, not a product with support.

## Licence

- Code (`whosigns/`, `case/*.py`): MIT — see [LICENSE](LICENSE).
- Everything else (the downloads, the case description, the docs): CC BY 4.0 — see
  [LICENSE-CONTENT.md](LICENSE-CONTENT.md). Keep the line *AI Product Design · faridgurbanov.com* when
  you share an adapted version.
