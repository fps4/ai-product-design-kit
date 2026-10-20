---
item: 5
title: Vendor question list — filled in for the switched-off triage module
part: 1 · Frame the decision
episodes: 1.3 Build, buy, or the AI you already switched on (later cut)
forms: PDF + DOCX (this Markdown is the source)
version: claims case
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: The storyline's running case. The insurer, its claims platform and its vendor are fictional; the answers are invented to show what a useful answer — and a missing one — looks like
---

# Vendor question list — the claims platform's AI triage module

> **A worked example.** A mid-size non-life insurer, fictional. Its claims platform includes an AI
> triage module, already licensed and switched off, that nobody owns. The head of claims asks the
> questions before anyone switches it on. The blank list is `vendor-question-list.md`.

**The feature:** AI triage module **In:** the claims platform (licensed, switched off) **Asked by:**
the head of claims, with the platform administrator and the data protection officer

| # | Question | Answer (from the vendor's documentation and account manager) | Our note |
|---|---|---|---|
| | **What it reads** | | |
| 1 | Which of our data does it read? | Claim description, photos and attachments, policy data and claim history held in the platform | Claim notes can hold health details ("I fell") — special-category data. Must be in the data agreement |
| 2 | Where is it processed, and by whom? | In the EU; the language model runs at a named cloud provider as sub-processor | **Open** — the sub-processor is not yet in our contract |
| 3 | Is our data used to train the vendor's models? | "Not by default"; an opt-in exists for "product improvement" | Keep the opt-in off; get "no training" in writing |
| | **What it changes** | | |
| 4 | What can it change or trigger? | Sets a priority, routes the claim to a queue, drafts a letter — and, in a separate setting, **approves a claim below an amount the administrator sets** | The approval setting makes it an **agent**. It pays out money |
| 5 | What is on by default, and who can switch it on? | Triage and routing on once the module is on; approval off. Any platform administrator can switch it on | **Finding:** one administrator could start automatic payments. Restrict and log the setting |
| | **Who approves** | | |
| 6 | What does a person approve, before or after? | Routing: no approval. Approval below the amount: none per claim | Not acceptable as is. Denials must never be automatic; payments need a cap and an audit sample (Part 5) |
| 7 | Can a person see why? | A score and the top three "factors" | Does not quote the policy clause. A handler cannot see whether the coverage check read the right conditions |
| | **How it is evaluated** | | |
| 8 | Tested on whose data, against what baseline? | Accuracy reported on "pooled data from several European insurers" | **Open** — not tested on our claims or against our desk. Ask to run it on our re-checked set (Part 3) |
| 9 | What do we see when it is wrong? | Overrides are logged in the platform | Export of the log: **open** |
| 10 | How are model changes announced? | In the release notes of the platform's quarterly release | No test window. Ask for one; it touches payments |
| | **What each use costs** | | |
| 11 | What does one use cost at our volume? | Included in the current licence up to a volume tier; a per-claim fee above it | **Open** — ask for the tier and the fee, then put a cost per claim in the value case (Part 7) |
| | **How you leave** | | |
| 12 | Can we switch it off and export? | Can be switched off at any time; export "on request" | Fallback to the desk is what we do today. Export format: **open** |

## After the answers

| | |
|---|---|
| **Owner** | The head of claims — for the outcome. The platform administrator keeps the settings, and no longer decides them |
| **Assistant, workflow or agent?** | Routing is a **workflow**; the letter drafter is an **assistant**; the approval setting is an **agent** and stays off |
| **Decision** | **Keep off for now.** It becomes one of the options for candidate A — build, buy, or switch this on (episode 1.3) |
| **What it must pass first** | The scorecard on our re-checked claims, against the desk and the simple rule (Part 3); the readiness gates (Part 4) |
| **Review date** | After stage 1 of the value case (Part 7) |
