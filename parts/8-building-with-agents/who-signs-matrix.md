---
item: 9
title: "\"Who signs\" decision matrix"
part: 8 · Building it with agents (also 5 · Design for people, 6 · Risk and governance)
episodes: [8.5]
forms: [PDF, DOCX]
version: blank
companion: who-signs-matrix.claims.md (filled in for the running case)
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Paper Move 8 · Delegated Regulation (EU) 2024/1774 Art. 17(1) · Parasuraman & Manzey 2010 (automation bias)"
---

# Who signs?

*For every decision about an AI product — the work that builds it and the decisions it makes once it
runs — one line: who may propose it, who approves it, what that person actually sees, how the system
stops anyone skipping the step, and what record is kept. Fill it in with the sponsor, the Product
Owner, the engineering lead and whoever owns compliance, in one meeting.*

**Three rules apply to every line.**

1. **Agents author. Humans decide.** An agent may propose anything; it has no way to approve anything.
2. **Whoever drafted it cannot accept it.** Four-eyes and maker-checker extend to a non-human maker,
   and to the person who asked the agent.
3. **Approve what a person can review.** If nobody could realistically read what they approved, the
   approval is not evidence. Approve the smaller thing — the brief version, the threshold version —
   and let checks hold the rest to it.

## A. Building it

| Decision | Who may propose | Who approves (not the proposer) | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| The brief, as an approved version | | | | | |
| A change to the code | | | | | |
| A change larger than the size limit | | | | | |
| An emergency change | | | | | |
| A release to production | | | | | |
| Giving an agent access to a system | | | | | |

## B. What the product decides

| Decision | Who may propose | Who approves | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| The threshold (operating point) | | | | | |
| A limit or cap on what it may do alone | | | | | |
| The automation level of each step | | | | | |
| A new model or rule version going live | | | | | |
| Switching it off | | | | | |
| A decision the system may never make alone | | | | | |

## C. Keeping it running

| Decision | Who may propose | Who approves | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| A new entry, or a closed one, in the risk register | | | | | |
| Acting on a monitoring alert (drift, error rate, complaints) | | | | | |

## The test

For any change in production, can someone answer within minutes: **who approved which version, and
what was built against it?** If not, which line above is missing its record?

## Obligations you may already have

*Not legal advice. Map each line to the rule you already work under.*

| Rule | What it asks | Lines it touches |
|---|---|---|
| Four-eyes, maker-checker (internal policy) | A second person approves | All |
| EU DORA, Delegated Regulation (EU) 2024/1774 Art. 17(1)(b) — financial entities in scope | *"mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes"* | A |
| GDPR Art. 22 — decisions based solely on automated processing | A person can intervene; the person affected can express a view and contest | B |
| Sector or association codes | *(your own)* | |
