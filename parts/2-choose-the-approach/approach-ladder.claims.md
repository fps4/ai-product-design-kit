---
item: 19
title: Approach ladder card — filled in for the claims case
part: 2 · Choose the approach
episodes: 2.1 Start at the bottom of the ladder · 2.2 Assistant, workflow, agent
forms: PDF + PPTX
version: claims case
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Zinkevich, Rules of Machine Learning (Google) · Schluntz & Zhang, Building effective agents (Anthropic, 2024) · running case (synthetic)
---

# Approach ladder card — the claims case

> *A worked example — a fictional mid-size non-life insurer, synthetic numbers.* The insurer receives
> 68,000 small home-contents (inboedel) and buildings (opstal) claims a year; a claims handler reads
> every one, at 40 minutes each. The proposal: pay small, clear, covered claims the same day. Blank
> card: [`approach-ladder.md`](./approach-ladder.md).

## Side 1 · The ladder, for this case

| Rung | Used here? | For what | Why this rung, and not the one below |
|---|---|---|---|
| **4 · Adapted model** | **No — not yet** | — | Nothing on the scorecard needs it. It would come up only if the foundation model, given the right conditions version and good instructions, kept missing clauses that only the insurer's own wording explains |
| **3 · Foundation model through an API** | **Yes** | Read the description and the photos; find the clause in the right version of the policy conditions (polisvoorwaarden); draft the letter | The input is free text, documents and images — not tables. Rungs 1 and 2 cannot read them. It **proposes; it never decides** |
| **2 · Classical model** | **Yes** | Score each remaining claim: how likely is it to be not genuine or not covered? | Claim history, policy data and claim type are tables the insurer already has. The rule cannot weigh them together; a foundation model is not needed for tables |
| **1 · Rule** | **Yes — first slice** | *Pay glass and small single-item claims under €300 for policyholders with no claim in three years* | Bottom rung: nothing to beat yet. Takes **30%** of small claims (≈ 20,400); about 2% wrong (≈ 408 × €150 ≈ **€61,000 a year** paid that should not have been) against ≈ **€748,000** of handler time saved. Wrong more often than a model would be, and still the right choice for the slice. Becomes the baseline the model must beat (Part 3) |

Contrast, where the case does not show it: estimating **car damage from photos**, where reading the
image *is* the decision — there the higher rungs earn their place.

## Side 2 · The claims product, step by step

| Step of the product | Rung chosen | Why not the rung below? | Assistant · workflow · agent? | What it may do by itself | Owner |
|---|---|---|---|---|---|
| Small simple claims (glass, single item < €300, no claim in 3 years) | 1 · Rule | Bottom rung | Workflow | Pay, under the rule's three conditions | Head of claims |
| Read the claim and photos; find the policy and its conditions version | 3 · Foundation model (API) | Free text and images; rungs 1–2 cannot read them | Workflow (AI step) | Nothing: shows what it found to the handler | Claims product team |
| Coverage check: is this damage covered by this policy? | 3 · Foundation model (API) | Needs the clause in the right version of the conditions | Workflow (AI step) | Nothing: a suggestion with the clause quoted | Claims product team |
| Score: not genuine or not covered? | 2 · Classical model | Rule cannot weigh history, policy and type together | Workflow (AI step) | Nothing: the score goes to the route | Head of claims (threshold, Part 3) |
| Route: automatic payment, handler, loss adjuster, fraud desk | 1 · Rule (the threshold) | The route is a business rule on the score | Workflow | Send the claim on | Head of claims |
| **Automatic payment** (small, covered, low score, ≤ €1,000) | — (no model: it acts on the route) | — | **Workflow that acts by itself → gets the agent's controls** | **Pay up to €1,000 per claim, a daily cap, this policyholder only** | Head of claims (cap); claims IT (identity) |
| Draft the letter | 3 · Foundation model (API) | Writing is the work | **Assistant** | Nothing: the handler reads and sends | Claims team lead |
| Denial | — | — | Never automatic | Nothing: a handler decides, always | Head of claims |
| Vendor triage module (licensed, switched off) | 3, bought | Not yet shown on the scorecard | *Sold as* "an agent that handles the claim end to end" → **ask the agent questions first** | Nothing until it has an owner and answers | *Unowned — name one (Part 1)* |

## The three words, in this product

- **Assistant:** the letter drafter. The handler acts.
- **Workflow:** rule → coverage check → score → route. The path is written in advance; the AI does
  steps inside it.
- **Where the workflow acts by itself:** the automatic payment. It gets the agent's controls — a
  fast-track identity that may pay up to €1,000, for this policyholder only, and a person on every
  denial. *The control follows who acts, not what the vendor calls it.*
- **Agent, if bought:** the vendor's triage module would choose its own steps. What can it read? What
  can it change? Who approves its actions? How is it switched off?

## Answers for the next proposal

1. **Which rung, and why not the one below?** Rule for the first 30%; classical model for the score;
   foundation model only for reading, the clause and the letter. No adapted model.
2. **What did the rung below fail on?** The rule cannot read text or weigh history (Part 3 scorecard
   will show by how much); rungs 1–2 cannot read documents or photos at all.
3. **Which of the three?** Assistant (letter) · workflow (the route) · one step that acts by itself
   (payment).
4. **Where does it act by itself, and what limits it?** Payments up to €1,000, daily cap, this
   policyholder only — enforced in the payments interface, not in the model's instructions.
5. **Build, buy or API per layer?** Rule and route: build, in the claims system. Score: build.
   Foundation model: API through the platform's model gateway. Triage module: bought, switched off —
   needs an owner and the vendor question list (Part 1) before anything else.

---

*All case numbers are synthetic: 68,000 small claims; rule slice 30% (20,400); ≈ 2% wrong at ≈ €150
(≈ €61,000 a year); handler time for the slice 20,400 × 40 min × €55/h ≈ €748,000; automatic-payment cap
€1,000. Sources as on the blank card.*
