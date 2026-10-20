---
item: 13
title: Control map
part: "6 · Risk and governance"
episodes: "6.2 You already have this obligation"
forms: PDF (this Markdown is the source)
version: blank
licence: "CC BY 4.0 · AI Product Design · faridgurbanov.com"
status: "Draft v0.1 · 2026-10-20"
sources: "Reg. (EU) 2022/2554 (EU DORA) Art. 2 · Commission Delegated Reg. (EU) 2024/1774 Art. 17 · GDPR Art. 22 · Reg. (EU) 2024/1689 (AI Act) as amended by Reg. (EU) 2026/1744"
---

# Control map

**Where identity, approval and the record sit in one AI workflow, mapped to obligations you already
hold.** Start from those obligations, not from a new AI policy. One page per workflow. A filled-in
example for an insurer's claims fast track is in [`control-map.claims.md`](./control-map.claims.md).

*Not legal advice. It shows where the controls sit and which obligation each one helps you evidence;
whether an obligation applies to you is for your compliance and legal people.*

## 1. The workflow

| | |
|---|---|
| Workflow | *e.g. "small claims paid automatically", or "the payment path, built with coding agents"* |
| AI inside the product, AI building it, or both? | |
| Owner | |
| Obligations you already hold | *e.g. EU DORA change management (if you are in its scope), data protection, sector codes, supervisor expectations* |

## 2. Three questions first

| Question | Answer | Who answers |
|---|---|---|
| **Identity.** Which identities does the AI act under, and can any of them approve anything? | *Must be "no" by design, not by agreement* | Engineering lead |
| **Approval.** Who approves a change, and are they independent of whoever requested it and whoever — or whatever — built it? | | Change manager |
| **Record.** For a change in production, can you show who approved which version, and what was built against it, within minutes? | | Compliance |

## 3. The map

The nine layers of the reference architecture (Part 4). For each, the control that sits there, the
obligation it helps evidence, and what it produces.

| Layer | Control here | Obligation it helps evidence | Evidence produced | Owner |
|---|---|---|---|---|
| Channel | | | | |
| Orchestration | | | | |
| Model access | | | | |
| Knowledge and retrieval | | | | |
| Tools and integration | | | | |
| Identity and permissions | | | | |
| Human approval | | | | |
| Evaluation | | | | |
| Observability and cost | | | | |

## 4. Two signatures

Business decisions inside the product (a threshold, a cap) and the change that puts them live are
signed separately.

| | What is signed | By whom | Held as |
|---|---|---|---|
| **Business decision** | *What should be true — e.g. the threshold, version n* | *The business owner* | *An immutable version* |
| **Change approval** | *That the change putting it live was controlled* | *An approver independent of the requester and the implementer* | *The change record* |
| **The link** | *Which release carries which version* | *Automatic* | *Release record* |

## 5. Gaps

| Gap | Owner | Closed by |
|---|---|---|
| | | |

*Check before you finish:* no AI or bot identity can satisfy an approval · every layer with a control
has an owner · the record links an approved version to the change built against it.
