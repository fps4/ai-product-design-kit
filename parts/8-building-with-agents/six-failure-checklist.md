---
item: 3
title: Six-failure checklist
part: 8 · Building it with agents
episodes: [8.1, 8.3]
forms: [PDF, DOCX, Markdown]
version: blank
companion: brief-template.md · brief-template.claims.md
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Paper Part 8, *make the brief precise enough to build from* · kit docs/spec.md §6.2 (lint rules B1–B6)"
---

# The six ways a brief fails

*Run every brief through these six questions before it goes to a team that uses agents. Each failure
is a domain fact the model cannot know — a volume, an interface, a limit, a rule. Current models are
good at smoothing over vague wording; they cannot supply a missing fact. So the check is not "is it
well written?" but "is anything missing that someone would have had to ask?"*

| # | Failure | Ask | Missing if… | What the agent does instead | In the claims example |
|---|---|---|---|---|---|
| 1 | **Unstated scale** | How many, how often, how fast? | There is no number, and no "n/a" with a reason | Builds for the data it sees in testing — often a thousand rows | "Up to 68,000 small claims a year; same-day payment file" |
| 2 | **Implied integration** | Which systems does it touch, and where is each one's interface written down? | A system is named without a link to its contract | Invents a plausible interface that does not exist | Claims system, policy administration, payments interface, decision log — each with its contract |
| 3 | **Absent error case** | What happens when something fails — a system down, wrong input, a limit reached? | Every acceptance criterion describes the happy path | Swallows failures silently | "Payments interface down: the claim waits, a handler is alerted, it is paid once" |
| 4 | **Unstated invariant** | What must stay true — never twice, never out of order, never above a limit? | Money, orders, identity or sequence are involved, and nothing says what must hold | Retries, and you get duplicates: two events, two payments | "One payment per claim line; idempotent on the claim-line key" |
| 5 | **No metric** | How will we know afterwards that it helped? | No measure, or a measure with neither a baseline nor a way to get one | Something ships. Nobody can say whether it helped | "Share of automatic payments later reversed, contested or found fraudulent" |
| 6 | **Buried compliance** | What may be stored, logged, shown or sent — and under which rule? | Personal, financial or regulated data is involved and no rule is stated | Logs it, in plain text | "No name or IBAN in plain text in the log; no automatic denial" |

## How to use it

- **The Product Owner** runs it before handing the brief over. **The engineering lead** reads the
  answers and names any fact that is still missing. Ten minutes per brief.
- **A "no" is not a failure of the author.** It is a question the team would otherwise have asked —
  or an agent would have answered for you.
- **Track restarts** — work thrown away because the agent took the wrong path — as a signal of missing
  context, not as a discipline problem. If restarts fall, the checklist is working.
- **An assistant can help** write the brief and find the gaps (see *PO copilot instructions*). The six
  questions are still the check; do not hand the check to the same assistant that wrote the draft.

## For the team's agents

Paste this into the instruction file your coding agents read (`AGENTS.md`, `CLAUDE.md`, Copilot
instructions, or your tool's equivalent):

> Work only from a brief whose status is `approved`. Do not invent domain facts — volumes, interfaces,
> thresholds, invariants, data rules. If one is missing, stop, add it to `open_questions` in the brief,
> and say so in the change description. Reference the brief and its version in every change. Keep
> each change under the size limit; split the work instead.

## For teams that use `whosigns`

`whosigns lint` will run the same six checks on a brief kept as a file (rules B1–B6, kit
`docs/spec.md` §6.2). It is specified, not built. It finds what is **missing**, not what is **wrong**:
a brief can pass all six and still describe the wrong thing.
