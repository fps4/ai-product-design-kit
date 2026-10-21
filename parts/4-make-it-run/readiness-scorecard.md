---
item: 4
title: Readiness scorecard — eight gates before the pilot, and again before go-live
part: 4 · Make it run (gates 1–2 also in Part 3 · Data and evaluation; gate 8 in Part 6 · Risk and governance)
episodes: 4.2 Why pilots stay pilots · 3.3 The right version, for the right person
forms: Word + PDF (built from this source)
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: AI Product Design paper, Part 4, the readiness gates (*make the pilot able to go live*)
---

# Readiness scorecard

**Use it for:** deciding whether a pilot can ever go live — before you start it, not six months
after. Run it twice: **before the pilot**, and **before go-live**.

**The rule:** a gate that does not pass gets the work to pass it, **with a budget and an owner** — or
the pilot stops. There is no third option.

> This Markdown file is the source; the Word and PDF versions are built from it. A filled-in example
> — an insurer's claims fast track — is in
> [`readiness-scorecard.claims.md`](./readiness-scorecard.claims.md).

**Use case:** ____________________ **Business owner:** ____________________
**Run:** ☐ before the pilot ☐ before go-live **Date:** __________ **Run by (architecture):** __________

## The eight gates

Status: **Pass** · **Work** (budgeted, with an owner and a date) · **Stop**.

| # | Gate | Passes when you can show… | Red flags | Owner | Status | Work, cost, date |
|---|---|---|---|---|---|---|
| 1 | **Data owner and currency** | A named owner for every source it reads or learns from, and a date by which each is kept current | *"IT owns the data"*; several versions of the same document with no effective dates; past decisions used as ground truth without a re-checked sample | | | |
| 2 | **Permissions at the moment it answers** | It sees only what the person asking — and this case — are allowed to see, enforced when it answers | *"It's trained on our data"* (it is handed excerpts when it answers); one service account that can read everything; sensitive details in free-text notes nobody mapped | | | |
| 3 | **Integration contracts** | A written interface and an owner for every system it reads or changes, including the limits on what it may change | Write access *"for now"*; limits that exist only in the prompt; a system owner who has not been asked | | | |
| 4 | **A scorecard and a threshold** | The scorecard, the baseline it must beat, and the threshold below which it does not go live — signed before the work | Decided on a demo; accuracy as the only measure; a threshold to be agreed *"after the pilot"* | | | |
| 5 | **Cost per use and expected volume** | What one use costs, times the expected volume, and who pays | Cost known only from the first invoice; volume *"to be seen"* | | | |
| 6 | **Support** | Who gets the call when it is wrong, how fast they answer, and how a wrong answer is corrected — and what the correction teaches the system | *"The vendor supports it"*; no route from a complaint back to the team | | | |
| 7 | **Exit** | How it is switched off, how fast, and who does the work when it is off — tested in a drill | No off switch; the old process no longer has the people or the skills | | | |
| 8 | **Compliance** | Personal data, sector rules and the AI Act's risk tier checked and recorded, with an owner | *"Legal will look at it before go-live"*; the risk tier assumed, not written down | | | |

## Decision

| | |
|---|---|
| Gates passed | __ of 8 |
| Gates with budgeted work | __ — total cost € ______, in which stage: ______ |
| Gates that stop it | __ |
| **Decision** | ☐ Go ☐ Go, with the work above budgeted ☐ Stop |
| Signed — business owner | ____________________ date ________ |
| Signed — architecture | ____________________ date ________ |

Keep this page. A go-live decision comes with a record of the gates it passed — it is the first thing
an auditor or supervisor asks for.

---

*AI Product Design, Part 4 · faridgurbanov.com · CC BY 4.0. Not legal advice; gate 8 records that
the check was done, not its outcome.*
