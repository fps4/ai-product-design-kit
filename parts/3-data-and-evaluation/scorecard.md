---
item: 8
title: Scorecard
part: 3 · Data and evaluation
episodes: 3.1 The threshold is a business decision · 3.2 A demo is not evidence
forms: DOCX (this page) + XLSX (the threshold sheet and the re-run log)
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Elkan (2001), cost-sensitive decisions · Lakkaraju et al. (2017), selective labels · Kaufman et al. (2012), leakage · Perry et al. (2023) — all paraphrased
---

# Scorecard

*Fill this in **before** anyone builds. A threshold agreed before the work is a commitment; the same
threshold discussed afterwards is a negotiation. If a section cannot be filled in, the work is not
ready to start. Examples in the margin are from the claims case (`scorecard.claims.md`).*

**Use case:** ……………………  **Owner (business):** ……………………  **Product Owner:** ……………………
**Version:** ……  **Date:** ……

## 1. The decision

| | |
|---|---|
| **What the system decides by itself** | *e.g. pay a small claim automatically* |
| **What it only proposes** | *e.g. a coverage check, with the clause quoted* |
| **What it never does, at any score** | *e.g. deny a claim; accuse anyone of fraud* |

## 2. The cases that matter

List the kinds of case it will see, including the hard and the rare ones. A case type nobody listed
is a case type nobody tested.

| Kind of case | How common | Why it is hard | Must be in the verified set? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

*Margin: by amount band, by type (glass, water, theft), the rare outcomes (fraud, not covered), the
documents with versions, inputs that try to give it instructions.*

## 3. What counts as wrong, and what it costs

One row per kind of mistake. Price them with finance. A cost you cannot estimate is written as a
range, not left out.

| Mistake | What it costs, per case | Who carries the cost | Unacceptable at any price? |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |

*Margin: accuracy rewards the majority answer. If most cases are fine, "approve everything" scores
well and costs a fortune. Count money, not hits.*

## 4. The baselines it must beat

Measure each on the **same cases** as the system. Today's process is not perfect; write down its
errors too.

| | Today's process | The simplest rule | "Do nothing" / "approve everything" |
|---|---|---|---|
| Description | | | |
| Cost of each mistake in §3, per year | | | |
| Handling cost per year | | | |
| Time to a decision | | | |

## 5. The threshold

| | |
|---|---|
| **The rule** | *e.g. act automatically when chance of being wrong × amount < cost of a person looking* |
| **Why this line** | *Which prices in §3 it follows from* |
| **Hard limits regardless of score** | *e.g. an amount cap* |
| **Version and date** | |
| **Signed by (business owner)** | |

Changing the threshold is a new version with a new signature, recorded in §8.

## 6. The verified set

Past decisions are not the truth: you only know the outcome of the cases someone chose to look at, and
labels carry the habits of whoever made them.

| | |
|---|---|
| **Size** | |
| **How it is sampled** | *Across the kinds of case in §2; enough of the rare ones to count* |
| **Who re-checks it** | |
| **Cost, and which budget** | |
| **Owner, and how often it is refreshed** | |
| **Fields removed because they are written after the decision** | |

## 7. The go-live bar

Written now. The system goes live only if, on the verified set:

| Condition | Measured how | Bar |
|---|---|---|
| Total cost of mistakes (§3) lower than each baseline (§4) | | |
| No case in the "never" list (§1) | Rule-based check | Zero |
| Hard limits (§5) never exceeded | Rule-based check | Zero |
| The value the business case needs | | |

## 8. Re-run log

Re-run the scorecard on **every** change: model, prompt, rule, threshold, data, or a new version of
the documents it reads. Make the checks rule-based where you can.

| Date | What changed | Version | Result against the bar | Decision | Signed by |
|---|---|---|---|---|---|
| | Baselines measured, before the build | — | | | |
| | | | | | |

## 9. Signatures

| Role | Name | Date |
|---|---|---|
| Business owner — the threshold and the bar | | |
| Product Owner — the scorecard | | |
| Finance — the prices in §3 | | |
| Owner of the verified set | | |
