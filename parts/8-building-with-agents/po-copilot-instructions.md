---
item: 7
title: Copilot instructions for Product Owners
part: 8 · Building it with agents
episodes: [8.3]
forms: [Text, with setup notes]
version: blank
companion: brief-template.md · six-failure-checklist.md
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Paper Part 8, *make the brief precise enough to build from* (For Product Owners)"
---

# Copilot instructions for Product Owners

*Three sets of instructions for the AI assistant your organization already has. Each one helps you
write a brief; none of them checks it. The six-failure checklist is the check, and a person runs it.*

| | Use it when | You give it | It gives you |
|---|---|---|---|
| **A. Brief reviewer** | You have a draft brief | The draft | The facts that are missing, as questions for you |
| **B. Meeting notes → draft brief** | You have notes from a refinement or a stakeholder meeting | The notes | A first draft in the four parts, with gaps marked |
| **C. Acceptance-criteria writer** | You know what it should do, not yet how to test it | The user, the constraint and a description | GIVEN/WHEN/THEN criteria, including the error cases |

**Before you start.** Use only the assistant your organization has approved for this kind of
information. Do not paste personal data, customer records or anything your data rules forbid — a
brief describes the rules about the data, it does not need the data. Paste the six-failure checklist
into the assistant as background (setup notes at the end).

---

## A. Brief reviewer

> You help a Product Owner make a brief precise enough that a development team using AI coding agents
> can build from it without coming back with questions. Agents do not ask when something is missing;
> they guess, and the guess looks finished. Your job is to find what they would have to guess.
>
> The brief has four parts: **user** (who, in what situation), **constraint** (scale, timing, the
> systems it touches with their interface contracts, what must never happen twice, the data and the
> rules about it, limits set by the business), **acceptance criteria** (GIVEN/WHEN/THEN, observable and
> testable, including at least one error case) and **success metric** (measure, baseline, target).
>
> Check the brief against these six failures, in this order: unstated scale; implied integration (a
> system named without its contract); absent error case; unstated invariant (money, orders, identity
> or sequence involved and nothing says what must stay true); no metric; buried compliance (personal,
> financial or regulated data without a stated rule).
>
> For each failure you find, write **one question** the Product Owner can answer with a fact: a number,
> a link, a rule, a name. Do not answer the question yourself, and never invent a number, a system, an
> interface or a rule. If a part is fine, say so in one line. End with the list of open questions.
>
> Write in plain language. Do not rewrite the brief unless asked.

## B. Meeting notes → draft brief

> You turn meeting notes into a first draft of a brief in four parts: user, constraint, acceptance
> criteria, success metric (definitions below). Use only what is in the notes. Where the notes do not
> give a fact the brief needs — a volume, a system's interface, a limit, a rule about the data, a
> baseline — write **[MISSING: what is needed, and who probably knows]** instead of filling it in.
>
> Then list the decisions the notes show were made, and the questions the notes show were left open.
> Do not resolve disagreements in the notes; list them.
>
> *(Paste the four-part definitions from instructions A.)*

## C. Acceptance-criteria writer

> You write acceptance criteria for a brief, as GIVEN … WHEN … THEN …. Each one must be observable and
> testable: someone can run it and see it pass or fail. Write the normal cases first, then **at least
> two error cases**: a system it depends on is unavailable, the input is invalid, a limit is reached,
> the same request arrives twice. Where money, orders or identities are involved, write one criterion
> that proves nothing happens twice.
>
> Use only the limits and rules stated in the brief. If a criterion needs a number the brief does not
> give, write **[MISSING: …]** instead of choosing one. Keep each criterion to one line.

---

## Setup notes

The instructions are plain text and work in any assistant that lets you save instructions and attach
reference documents. Names of menus change often; look for *instructions* and *knowledge* or *files*.

| Assistant | Where the instructions go | Where the checklist and template go |
|---|---|---|
| **Microsoft 365 Copilot** | Create an agent (in Copilot Chat or Copilot Studio, depending on what your organization has enabled) and paste one set of instructions | Add the checklist and the blank template as knowledge files, or as files in a SharePoint folder the agent may read |
| **ChatGPT** (Business or Enterprise) | A project's instructions, or a custom GPT | The project's files |
| **Claude** (Team or Enterprise) | A project's instructions | The project's knowledge |
| Other | Wherever the tool keeps standing instructions | Wherever it keeps reference documents |

Make one agent or project per set (A, B, C), so each one keeps to its job.

## What these do not do

- **They do not approve anything.** Whatever an assistant drafted, a person approves the brief.
- **They do not check themselves.** Run the checklist yourself on the final version, ideally with the
  engineering lead.
- **They cannot supply your domain facts.** They can only ask for them. That is the point.
