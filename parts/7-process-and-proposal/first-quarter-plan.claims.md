---
item: 10
title: First-quarter plan — filled in for the claims case
part: 7 · Process and proposal
episodes: [7.2]
forms: [PDF, DOCX]
version: claims case
companion: first-quarter-plan.md (blank)
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Running case, Parts 1–8 (synthetic) · AI Act Annex III 5(c) (evidence A14) · GDPR Art. 22 (evidence A11)"
---

# First-quarter plan — fast-tracking small property claims

> **A worked example — fictional insurer, synthetic numbers.** The twelve weeks cover stages 1 and 2:
> the value case and the verified set. Stage 3 (shadow mode) is the next ask.

| | Who |
|---|---|
| **Use case** | Pay, pay part, deny or investigate small home-contents and buildings claims (up to €2,500); fast-track the small, clear, covered ones |
| **Sponsor** — owns the plan | Head of claims |
| **Decides at the gates** | Chief operating officer (holds the change budget) |
| **Architecture** | Claims domain architect |
| **Product Owner** | Product Owner, claims |
| **Engineering lead** | Lead of the claims IT team |
| Also needed | Senior handlers and the fraud desk (the re-check) · product team (policy conditions) · data lead · compliance |

## The twelve weeks

| Weeks | Head of claims (sponsor) | Claims architect | Product Owner, claims | Claims IT lead |
|---|---|---|---|---|
| **1** | Names the decision and owns it. Prices today's desk (1): ≈ €2.5M handling, ≈ €952,000 fraud paid, ≈ €205,000 wrong denials, 8 working days. Asks the system administrators what AI is already switched on: the claims platform's **triage module**, licensed and off, nobody owns it (1). **Books the re-check of 3,000 claims** for weeks 4–11 — ≈ 3,000 hours of senior handlers and the fraud desk | Readiness gates on the fast track (4): who owns the verified labels, who keeps the conditions versions current, the payments interface contract, who answers a contested payment, switch-off within the hour. Risk tier with compliance (6): property claims are not on the AI Act's high-risk list as we read it. Approach (2): a rule for the first slice, a classical model for the rest, a language model only to read and draft | Writes the brief for the stage-2 work (8): the extract of past claims and the evaluation. Constraint: no field set after triage (`adjuster_assigned`, `fraud_referral`) | Baselines the claims IT team's review queue and delivery metrics (8) — before coding agents touch the payment path |
| **2–3** — stage 1, value case | Value case with finance (7): ≈ €2,493,000 today → ≈ €804,000; net ≈ €1,339,000, payback ≈ 8 months; at 35% automatic, net ≈ €1,113,000, ≈ 10 months. Names the number that breaks it: **fraud paid**. Writes the one-page proposal for stage 2 | Draws the claims flow on the nine layers (4); marks the gateway, the fast-track identity and the decision log as reusable by the travel claims desk | Drafts the scorecard (3): what counts as wrong, and what each costs — a wrong denial ≈ €350, a handler's assisted look ≈ €23. Baselines: the desk and the rule | Size limit and checks before review in the claims repositories (8) |
| **End of week 3** | **Stage-1 gate** (COO): go if the saving is above €1M a year at 35% automation → ≈ €1.1M net: **go**. Stage 2 approved on the one-page proposal | | | |
| **4–11** — stage 2, verified set and offline evaluation | Signs the threshold as version 1 before the evaluation runs: pay automatically only if *P(not genuine or not covered) × amount < €23*, never above €1,000 (3, 8). Reviews the fraud-paid estimate every two weeks | Rule and model tested on the verified set against the desk and the rule alone; the triage module tested on the same claims (2, 3). Fairness: referral and denial rates by postcode and by the language of the description (6). One risk register with owners and review dates (6) | Automation level per step (5): reading automatic; coverage a suggestion quoting the clause; small covered low-score claims up to €1,000 automatic later; **no denial ever automatic**; no automatic fraud accusation. Approves the evaluation specification on the record (8) | Measures the review queue again; keeps or stops each change made in weeks 2–3 (8) |
| | Senior handlers and the fraud desk: **3,000 claims re-checked**, all three product generations — the verified set (≈ €165,000) | | | |
| **12** | **Stage-2 gate** (COO): go if rule and model at the signed threshold cost fewer euros in errors than the desk and the rule alone, at ≥ 35% automatic. If go, the next ask: **stage 3, six weeks of shadow mode** — nothing paid automatically, fraud paid measured first | Prepares the shadow-mode setup: suggestions shown to handlers, decision log on | Writes the stage-3 gate: override, contest and complaint rates | Readout of the delivery metrics to the head of claims |

## The gates

| Gate | Question | Go if… (written before the stage) | Decided by | Week |
|---|---|---|---|---|
| Stage 1 | Worth doing? | The saving is above €1M a year at 35% automation | COO | 3 |
| Stage 2 | Can a model learn it? | Rule and model cost fewer euros in errors than the desk and than the rule alone, on the verified set, at ≥ 35% automatic; no field set after triage used | COO | 12 |
| Next ask | Does it help people? (stage 3, shadow mode, 6 weeks) | Override, contest and complaint rates hold; fraud paid by the would-be fast track within the agreed limit | COO | 18 |

## Check at week 3 and week 12

- [x] Every cell has a name, an output and a date.
- [x] Each gate was written before its stage, and the decision is recorded next to it.
- [x] The number that breaks the case — fraud paid — is named, and stages 2 and 3 measure it first.
- [x] Nothing is called "done" because a demo looked good: stage 2 is judged on 3,000 claims somebody
  checked.

<sub>AI Product Design · faridgurbanov.com · CC BY 4.0 — use it, change it, share it; keep this line.
A worked example: the insurer is fictional and every number about it is synthetic.</sub>
