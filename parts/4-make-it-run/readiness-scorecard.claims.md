---
item: 4
title: Readiness scorecard — the claims fast track, before the pilot
part: 4 · Make it run (gates 1–2 also in Part 3; gate 8 in Part 6)
episodes: 4.2 Why pilots stay pilots
forms: Word + PDF (built from this source)
version: claims case
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: AI Product Design paper, Move 3 · the running case, Parts 3, 4 and 6
---

# Readiness scorecard — the claims fast track

> **A worked example — synthetic numbers.** A mid-size non-life insurer in the Benelux, fictional. A
> claims handler reads every small home-contents claim by hand; the head of claims wants the clear
> ones paid the same day. The blank version is [`readiness-scorecard.md`](./readiness-scorecard.md).

**Use case:** pay small, clear, covered home-contents and buildings claims automatically (fast track)
· **Business owner:** head of claims
**Run:** ☒ before the pilot ☐ before go-live · **Run by:** the architect, with the claims IT lead

## The eight gates

Status: **Pass** · **Work** (budgeted, with an owner and a date) · **Stop**.

| # | Gate | What we found | Owner | Status | Work, and where it is budgeted |
|---|---|---|---|---|---|
| 1 | **Data owner and currency** | Past decisions are not ground truth: handlers paid most small claims unchecked, and fraud is known only where the fraud desk looked. The verified set (3,000 re-checked claims) had no owner. Policy conditions exist in three versions — three product generations — with no effective dates in the policy administration | Head of claims (verified set); product team (conditions) | **Work** | Verified set ≈ €165,000, in the build cost (stage 2). Effective dates added to the conditions versions (stage 2) |
| 2 | **Permissions at the moment it answers** | The coverage check and the letter drafter are handed this policyholder's policy and claims only. Claim notes can hold health details (*"I fell"*), which are special-category data; the notes are passed only through the gateway, under the data agreement | Security; privacy officer | **Pass** | Closed in Part 3 — re-check before go-live |
| 3 | **Integration contracts** | Policy administration (read), claims system (write) and fraud registers (read) have written interfaces. **Payments (write) did not:** the €1,000 cap, one payment per claim line, and stopping a payment before the bank file existed only in the design | Finance IT (payments); claims IT | **Work** | Payments contract written and built as the first change of the automatic-payment path (Part 8 brief); stage 2 |
| 4 | **A scorecard and a threshold** | Scorecard in euros: fraud paid, uncovered claims paid, valid claims delayed, valid claims denied. Baselines: today's desk and the rule. Threshold: pay automatically if *P(not genuine or not covered) × amount < €23*; cap €1,000 | Product Owner (scorecard); head of claims (threshold, signed as version 1) | **Pass** | — |
| 5 | **Cost per use and expected volume** | Model calls ≈ €0.05 per claim × 68,000 small claims a year ≈ €3,400 a year. The model is the cheapest part: the €350,000 a year to run it is people, platform and the audit sample | Product Owner | **Pass** | — |
| 6 | **Support** | After an automatic payment, the policyholder can click *"ask a person"*. Who answers, and within a day, was not arranged. Letters must name the complaint route (Kifid in NL, the Ombudsman in BE) | Claims team lead | **Work** | Rota in the claims team; each answered question becomes a verified label (stage 3, shadow mode) |
| 7 | **Exit** | Nobody had asked. Switching the fast track off must work within the hour — revoke the fast-track identity, every claim routes to the desk — and the desk must be ready to take the claims back | Head of claims; claims IT | **Work** | Switch-off drill during shadow mode, before any automatic payment (stage 3) |
| 8 | **Compliance** | Not on the AI Act's high-risk list as we read it — Annex III covers life and health pricing, not property claims. No denial without a person, so no harmful decision is solely automated. The Dutch insurers' binding ethical framework covers claims handling, fraud and straight-through processing and requires a register entry. As a Solvency II insurer, EU DORA's change rules apply | Compliance officer; privacy officer | **Work** | Register entry and the privacy review, before stage 3 (Part 6) |

## Decision

| | |
|---|---|
| Gates passed | **3 of 8** (2, 4, 5) |
| Gates with budgeted work | **5** (1, 3, 6, 7, 8) — the verified set (≈ €165,000) and the payments contract are already in the €900,000 build; the rest is people's time in stages 2 and 3 |
| Gates that stop it | **0** |
| **Decision** | ☐ Go ☒ **Go to the pilot (shadow mode: suggestions shown, nothing automatic), with the work above budgeted** ☐ Stop |
| Signed — business owner | head of claims |
| Signed — architecture | the architect |

**Next run:** before go-live of the first automatic payments — the rule slice — after six weeks of
shadow mode. Gates 6 and 7 must pass on evidence from the drill and the rota, not on a plan.

---

*A worked example. The insurer is fictional, the numbers are synthetic (case numbers from the running
case), and the roles are not real people. The compliance row states our reading, not legal advice.
AI Product Design, Part 4 · faridgurbanov.com · CC BY 4.0.*

<!-- Evidence behind gate 8: A14 (Annex III 5(c), CONFIRMED), A11 (GDPR Art. 22, CONFIRMED — watch the
Digital Omnibus), NL-28/NL-29 (Verbond Ethisch Kader, CONFIRMED), RS-4 (DORA scope, CONFIRMED). -->
