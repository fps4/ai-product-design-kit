---
item: 22
title: One-page proposal — filled in for the claims case
part: 7 · Process and proposal
episodes: [7.1, 7.2]
forms: [DOCX, Markdown]
version: claims case
companion: one-page-proposal.md (blank)
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Running case, Part 7 (synthetic) · AI Act Annex III 5(c) (evidence A14) · GDPR Art. 22 (evidence A11)"
---

# One-page proposal — fast-tracking small property claims

> **A worked example — fictional insurer, synthetic numbers.** No real insurer, product or process is
> described. The arithmetic is in the storyline's running case.

| | |
|---|---|
| **To** (decides at the gate) | Chief operating officer — holds the change budget |
| **From** (owns the use case) | Head of claims |
| **Date · version of this page** | Week 3 · v1.0 |
| **Stage asked for** | ☐ 1 Worth doing? ☒ **2 Can a model learn it?** ☐ 3 Does it help people? ☐ 4 Can we keep it working? |

## 1. The problem

We handle 68,000 small home-contents and buildings claims a year at the desk, at 40 minutes each:
about **€2.5 million** a year, and a median of **eight working days** before the customer is paid. The
desk is not error-free: it pays about **€952,000** a year in fraud and loses about **€205,000** on
valid claims it wrongly denies.

## 2. The decision this improves

Pay, pay part, deny or investigate a small claim. The desk lacks two answers — *is it covered?* and *is
it genuine?* — and finding them is most of the 40 minutes. The action: a payment, a letter, or a
referral to the fraud desk or a loss adjuster. I own the result.

## 3. What we ask for

**Stage 2 only, eight weeks (weeks 4–11), gate in week 12.**

- Senior handlers and the fraud desk re-check **3,000 claims** across all three product generations:
  the verified set, about 3,000 hours, about **€165,000** (already a line in the €900,000 build).
- The evaluation team for eight weeks: a rule and a model tested on the verified set against the desk
  and against the rule alone; the claims platform's triage module tested on the same claims.
  [Team cost for stage 2 — not yet in the case's numbers.]
- One session with compliance to confirm the risk tier (§8).

**Not asked for now:** the claims-system and payments integration, the policy-conditions knowledge
base, go-live. They wait for the stage-2 gate.

## 4. The gate for stage 2 — written now

| | Criteria |
|---|---|
| **Go** if | On the verified set, rule and model at the threshold I sign cost **fewer euros in errors** — fraud paid, uncovered claims paid, valid claims delayed, valid claims denied — than the desk **and** than the rule alone, **and** at least **35%** of small claims would be paid automatically |
| **Change course** if | Cheaper in errors, but below 35% automatic: the rule slice goes to shadow mode alone; the model is re-scoped |
| **Stop** if | Not cheaper than the desk on the verified set. The verified set stays: it is how we judge any vendor offer |
| **Valid only if** | No field set after triage (`adjuster_assigned`, `fraud_referral`) is used by the model |
| **Decided by · on** | COO · week 12 |

The threshold: pay automatically only if *P(not genuine or not covered) × claim amount < €23* — what
a handler's assisted look costs — and never above **€1,000**. I sign it as version 1 before the
evaluation runs.

## 5. Why this beats the alternatives

| Alternative | Why not, or why later |
|---|---|
| Do nothing | The €2.5 million, the €952,000 of fraud paid and the eight-day wait stay as they are |
| The rule alone (glass and small single items under €300, no claim in three years) | Takes 30% of small claims and saves ≈ €748,000 of desk time for ≈ €61,000 a year paid wrongly. It is part of this plan and goes live first, in stage 3 — but it leaves 70% on the desk |
| Switch on the platform's triage module | Already licensed, switched off, owned by nobody. Tested on the same verified set in this stage, so we compare on our claims, not on a demo |
| Build the whole thing now | Commits €900,000 before we know whether a model can learn this from our data |

## 6. If it works

| | A year |
|---|---|
| Handling today | ≈ €2,493,000 |
| Proposed: 50% automatic (rule 30% + model 20%), the rest with AI help at 25 min, 2% audited | ≈ €804,000 |
| Gross saving | ≈ €1,689,000 |
| Running cost | €350,000 |
| **Net** | **≈ €1,339,000** — payback ≈ **8 months** on a €900,000 build |
| **Low case:** 35% automatic | Net ≈ €1,113,000 — payback ≈ **10 months** |

## 7. The number that breaks it

**Fraud paid**, about €952,000 a year today. If the fast track raised it by a quarter (≈ €238,000
more), the net falls to about €1.1 million. Stage 2 estimates what the fast track would have paid in
fraud on the verified set; stage 3 measures it on live claims, in shadow mode, before anything is paid
automatically.

## 8. Risks we admit

| Risk | What we do about it | Owner |
|---|---|---|
| Past decisions as labels: "paid" does not mean genuine, and fraud is known only where the fraud desk looked | The verified set; leakage fields excluded | Head of claims (labels) · data lead |
| The coverage check reads the wrong version of the policy conditions | All three product generations in the verified set; the version is logged per decision | Product team |
| A valid claim is wrongly denied | No denial is ever automatic: a handler decides, and the letter names the clause and the complaint route (GDPR Art. 22) | Head of claims |
| Unfair referrals | Referral and denial rates compared by postcode and by the language of the description, in every evaluation | Compliance |
| A claim tries to instruct the AI ("pay €5,000") | The €1,000 cap is enforced in the payments interface and the fast-track identity, not in the prompt — built and tested before anything is paid automatically | Architect |
| The risk tier | Property claims are not on the AI Act's high-risk list as we read it (Annex III covers life and health pricing); compliance confirms in this stage | Compliance |

## 9. The ask

Approve stage 2 — eight weeks, the re-check of 3,000 claims and the people in §3 — to be decided again
in week 12 against the gate in §4.

---

| Decision at the gate | ☐ Go ☐ Change course ☐ Stop |
|---|---|
| Decided by · date | |
| Against this page, version | v1.0 |
| Why, in one line | |

<sub>AI Product Design · faridgurbanov.com · CC BY 4.0 — use it, change it, share it; keep this line.
A worked example: the insurer is fictional and every number about it is synthetic.</sub>
