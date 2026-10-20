---
title: "0005: One kit for the whole storyline; whosigns becomes one folder in it"
summary: "The repository was the engineering half of the nine-move series. The series became the eight-part AI Product Design storyline, and its rule is that no part is published without its download. So the repository becomes the home of every part's downloads (Markdown sources, CC BY 4.0), a runnable copy of the running case, and whosigns as the Part 8 tool (MIT). Renamed from copilot-to-capability-kit to ai-product-design-kit."
status: accepted
date: 2026-10-20
related:
  - ./0001-git-native-no-service.md
---

## Context

The kit was specified on 2026-10-07 as the engineering half of *From Personal Copilot to
Organizational Capability*, a series of nine moves for engineering leads and Product Owners. On
2026-10-19 the series became the main storyline on the site, *AI Product Design*, in eight parts
following the field's established structure, with the original nine-move material as Part 8. Most of
the new readers are sponsors and Product Owners, who download a canvas, not a CLI.

The storyline's defence against the AI-course market is its downloads: each part leaves the reader
with their own canvas, scorecard, register or readout, filled in on their own case. Those downloads
had no home. They were rows in a plan in the author's private notes.

The running case, a fictional insurer fast-tracking small property claims, is quoted with dozens of
synthetic numbers across the parts. They were checked by hand.

## Decision

1. **One repository for the storyline's tools**, renamed `ai-product-design-kit`. Three folders:
   - `parts/<n>-<slug>/`: each part's downloads as Markdown, blank and, where marked, filled in for the
     case (`*.claims.md`). The PDF, DOCX, XLSX and PPTX on the site are built from these sources.
   - `case/`: synthetic claims data with a fixed seed and a script that recomputes every case number
     the storyline quotes, and fails if one no longer holds.
   - `whosigns/`: the TypeScript package, renamed `@fps4/whosigns`. The CLI, config and check names
     are unchanged.
2. **Two licences, by folder.** Code is MIT; content is CC BY 4.0, with the line *AI Product Design ·
   faridgurbanov.com*.
3. **The invariants in [`../spec.md`](../spec.md) §3 still bind whosigns.** The downloads add their
   own rules (README, *Rules for every item*): usable alone, editable, tool-neutral, no figure without a
   source, not legal advice.
4. ADR-0001 to 0004 stay as they are; they are about whosigns.

## Consequences

- Sponsors find the downloads and engineers find the tool in the same place, behind one link per part.
- The case numbers are tested, not only checked. A change to the case that breaks a quoted number
  fails CI before it reaches an episode.
- The GitHub Action path becomes `fps4/ai-product-design-kit/whosigns/gate@v1` when Gate is built.
- Two licences in one repository need the README and the LICENSE files to say which applies where.
- The old name keeps working on GitHub as a redirect; `@fps4/copilot-to-capability-kit` was never
  published, so nothing outside needs to change.

## Alternatives considered

- **Keep the repository for engineering only and rename it `whosigns`.** Simple, but leaves the
  downloads for Parts 1–7 without a home and without version history.
- **Two repositories**, one for the downloads and the case, one for whosigns. Cleaner licences, but
  two things to keep up for one author, and Part 8 split across them.
