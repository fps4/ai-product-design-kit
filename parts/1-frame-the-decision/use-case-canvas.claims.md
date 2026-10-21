---
item: 1
title: Use-case canvas — filled in for the claims example
part: 1 · Frame the decision
episodes: 1.1 Fund one decision, not more seats · 1.2 Picking the first one
forms: PDF + DOCX (this Markdown is the source)
version: claims case
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Decision frame after Agrawal, Gans & Goldfarb, *Prediction Machines* (2018), paraphrased. All numbers are from the storyline's running case and are synthetic
---

# Use-case canvas — fast-tracking small home-contents claims

> **A worked example — synthetic numbers.** A mid-size non-life insurer in the Benelux, fictional.
> No real insurer, product or figure is described. The blank canvas is `use-case-canvas.md`.

## 1 · The decision

| | Fast-track small home-contents claims |
|---|---|
| **The decision** | Pay, pay part, deny, or investigate a small home-contents (inboedel) or buildings (opstal) claim |
| **The prediction it lacks** | *Is it covered* by this policy, in the version of the conditions this policyholder holds? *Is it genuine?* |
| **The judgement** | A wrong payment costs the amount; a wrong denial costs a complaint and sometimes the customer; a slow payment costs both goodwill and handling. The head of claims sets the balance — later, as the threshold (Part 3) |
| **The action** | A payment, a letter naming the clause, or a referral to the fraud desk or a loss adjuster |
| **Where the time goes today** | Most of the 40 minutes go to finding the policy, the right version of its conditions and the claim history — all already in the systems. **The prediction is the slow part** |

## 2 · Owner, process, data

| | |
|---|---|
| **Owner of the outcome** | The head of claims |
| **The process** | Claim reported (portal, app, broker) → read → coverage and history checked → decide → pay or write → close. Claims department, fraud desk, payments |
| **The data it needs** | Claims and their outcomes, policies, the policy conditions per product generation (three versions), photos and descriptions. Owned by claims and by the product team (conditions) |
| **Systems to integrate** | The claims system and the policy administration; payments is the step that gets the controls (Part 4) |

## 3 · The baseline: today's desk, errors included *(synthetic)*

| | |
|---|---|
| **Volume** | 68,000 small claims a year (up to €2,500), out of 80,000 property claims |
| **Handling** | 40 min × €55/h → 45,333 h → **≈ €2,493,000 a year** |
| **Wait** | Median **8 working days** to settle |
| **Wrong yes** | Half of the 2,720 fraudulent small claims are paid, at €700 too much on average → 1,360 × €700 ≈ **€952,000 a year** |
| **Wrong no** | 1% of valid, covered claims denied → 585 claims × ≈ €350 (complaint handling €165 + one in four households leaving, €185) ≈ **€205,000 a year** |
| **Total today** | ≈ €2,493,000 + €952,000 + €205,000 ≈ **€3,650,000 a year**, and an eight-day wait |

*The AI has to beat this desk — not perfection.*

## 4 · Value and feasibility — three candidates, scored separately

| Candidate | Value | Feasibility | Decision |
|---|---|---|---|
| **A · Fast-track small home-contents claims** | **High** — handling, wait and both kinds of error at once | **High** — see the six checks below | **First** |
| **B · A chatbot answering "where is my claim?"** | **Medium** — people ask because settlement takes eight days; fix the wait and most questions go away | **High** | **Waits** — revisit after A has shortened the wait |
| **C · Fraud scoring on every claim, large ones included** | **High** | **Low** — fraud is known only where the fraud desk chose to look; a score that can accuse a customer needs the strictest care (Part 6) | **Waits** — until A has produced checked outcomes to learn from |

Feasibility of A, check by check:

| | | Evidence |
|---|---|---|
| An owner with budget who wants the result | Yes | The head of claims |
| A process, not one person's task | Yes | The whole small-claims desk |
| The data exists, and someone owns it | Partly | In the systems; past outcomes are biased labels, so a set of claims is re-checked by hand (Part 3) |
| A result you can measure, against the baseline | Yes | Handling hours, fraud paid, wrong denials, days to settle |
| Bounded risk | Yes | Small amounts; automatic payment capped at €1,000; no denial and no fraud accusation without a person (Part 5); not a high-risk use under the AI Act as we read it (Part 6) |
| One or two systems | Partly | Two to read and write; payments needs its own controls (Part 4) |

## 5 · Risk, and the budget beyond the model

| | |
|---|---|
| **What harms someone if it is wrong** | An honest policyholder denied or delayed; a customer treated as a suspect; fraud paid |
| **What must never be automatic** | A denial. A fraud accusation |
| **Budget lines** | Re-checking claims to make a verified set of outcomes · the policy-conditions knowledge, per version · integration with the claims system and payments · the scorecard and testing · running cost per claim · support and a monthly audit after go-live · the model. Amounts come from the stage 1 value case (Part 7) |

## 6 · The decision on this page

| | |
|---|---|
| **First, or waits?** | **A goes first** |
| **Why B and C wait** | B: the wait causes the questions. C: no reliable labels yet, and the highest fairness risk |
| **Next gate** | Stage 1, *worth doing?* — a two-week value case. Go if the net saving is above €1 million a year at 35% automation (Part 7) |
| **Signed by** | The head of claims |
