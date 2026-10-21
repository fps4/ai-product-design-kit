---
item: 1
title: Use-case canvas
part: 1 · Frame the decision
episodes: 1.1 Fund one decision, not more seats · 1.2 Picking the first one
forms: PDF + DOCX (this Markdown is the source)
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: The decision frame (prediction · judgement · action) follows Agrawal, Gans & Goldfarb, *Prediction Machines* (2018), paraphrased. The rest is the storyline's own (paper, Part 1, *fund one use case, not more seats*)
---

# Use-case canvas

**One page to choose and frame the first AI use case.** Fill it in with the people who own the
decision, not about them. If a box stays empty, that is the finding.

*Example in the margin: refunds for online orders that arrived damaged (a retailer). The filled-in
version for the insurance example is `use-case-canvas.claims.md`.*

## 1 · The decision

| | Your use case | Example (margin) |
|---|---|---|
| **The decision** — what someone decides, again and again | | Refund, replace, or ask for the item back |
| **The prediction it lacks** — the information missing when they decide | | Did it really arrive damaged? Is this customer's history normal? |
| **The judgement** — what each outcome is worth, and who sets that | | A wrong refund costs the item; a wrong refusal costs the customer. The head of customer service sets the balance |
| **The action** — what happens after, and who or what does it | | Refund to the card, send a replacement, open a return |
| **Where the time goes today** — is the prediction the slow or expensive part? | | Agents look up the order, the photos and the history in three screens |

*If you cannot fill in the decision, the prediction and the action, it is not yet a use case.*

## 2 · Owner, process, data

| | Your use case | Example (margin) |
|---|---|---|
| **Owner of the outcome** — a person with budget who wants the result (not the owner of a tool) | | Head of customer service |
| **The process** — the steps it changes, and the teams in them | | Contact → check → decide → pay → close |
| **The data it needs** — where it is, and who owns and keeps it current | | Orders, delivery scans, photos, customer history; owned by e-commerce and logistics |
| **Systems to integrate** — aim for one or two, not ten | | Order system (read), payments (write) |

## 3 · The baseline: today's process, errors included

| | Your use case | Example (margin) |
|---|---|---|
| **Volume** — how often, per year | | |
| **Handling** — time per case × cost per hour | | |
| **Wait** — time from request to outcome | | |
| **Wrong yes** — what it costs when today's process says yes and should not | | Refunds for items that were fine |
| **Wrong no** — what it costs when today's process says no and should not | | Complaints handled, customers who leave |
| **Total today, per year** | | |

*Compare the AI with this row, not with perfection.*

## 4 · Value and feasibility — score them separately, never add them up

| Value | Score (high · medium · low) | Why |
|---|---|---|
| Money or time saved against the baseline | | |
| Errors avoided against the baseline | | |
| What the customer or user notices | | |

| Feasibility — can it go live? | Yes · partly · no | Evidence |
|---|---|---|
| An **owner** with budget who wants the result | | |
| A **process**, not one person's task | | |
| The **data exists**, and someone owns it | | |
| A **result you can measure**, against today's baseline | | |
| **Bounded risk** — reversible, a person approves consequential actions, not a high-risk use (Part 6) | | |
| **One or two systems** to integrate | | |

*High value, low feasibility is a research project. Low value, high feasibility is a demo.*

## 5 · Risk, and the budget beyond the model

| | Your use case |
|---|---|
| **What harms someone if it is wrong** — and who is harmed | |
| **What must never be automatic** | |
| **Budget lines** — data work · integration · scorecard and testing · running cost per use · support after go-live · the model (usually the smallest line) | |

## 6 · The decision on this page

| | |
|---|---|
| **First, or waits?** | |
| **If it waits — why, in one line** | |
| **Next gate and date** — the go / change / stop decision, and what it will be made on | |
| **Signed by** (the owner of the outcome) | |
