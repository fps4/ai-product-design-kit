---
item: 3
title: Brief template
part: 8 · Building it with agents
episodes: [8.1, 8.3]
forms: [DOCX, Markdown]
version: blank
companion: six-failure-checklist.md · brief-template.claims.md (filled in for the running case)
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Paper Part 8, *make the brief precise enough to build from* (the four parts, the six failures) · Google DORA, State of AI-assisted Software Development 2025 (user-centric focus)"
---

# Brief template

*One brief per piece of work handed to a team that uses agents. Precise enough that a reviewer and an
agent can act on it without coming back to you. The Product Owner writes and owns it; engineering
points out the facts that are missing.*

*An agent does not ask. It guesses. Every empty line below is a guess you have allowed. If a line
does not apply, write **n/a** and the reason — that is a decision, an empty line is not.*

| | |
|---|---|
| **Title** | *What is being built, in one line a business reader understands.* |
| **Owner** | *The person who answers questions about this brief, and who approves its final version.* |
| **Version** | *Draft · proposed · approved (who, when). An approved version is not edited; a change is a new version.* |

## 1. User — who, in what situation

| | |
|---|---|
| **Who** | *A role, not "users". Who acts, and on whose behalf?* |
| **Situation** | *What they are doing when they need this, and what happens today instead.* |

## 2. Constraint — what must stay true

| | *Fill in* | *If you leave it out, the agent…* |
|---|---|---|
| **Scale** | *How many, how often, how fast. A number.* | *builds for whatever it sees in testing* |
| **Timing** | *By when must it be done, each time?* | *picks its own* |
| **Systems it touches** | *Each system by name, with a link to its interface contract. A system without a contract is a guess.* | *invents a plausible interface* |
| **What must never happen twice, or out of order** | *Payments, orders, identities, sequences.* | *retries, and you get duplicates* |
| **Data** | *None · personal · special category · financial · regulated.* | — |
| **Rules about the data** | *What may be stored, logged, shown, sent — and the rule or law behind it.* | *logs it, in plain text* |
| **Limits set by the business** | *Thresholds, caps, amounts — and who set them, in which version.* | *chooses a number* |

## 3. Acceptance criteria — observable, testable, falsifiable

*Write each one as GIVEN … WHEN … THEN …. At least one must describe what happens when something
fails: a system is down, the input is wrong, a limit is reached. These become the tests the work must
pass before anyone reviews it.*

1. GIVEN … WHEN … THEN …
2. GIVEN … WHEN … THEN …
3. *(the error case)* GIVEN … WHEN … fails THEN …

## 4. Success metric — how you will know afterwards that it worked

| | |
|---|---|
| **Measure** | *One number that would change if this worked.* |
| **Baseline** | *Its value today, or how and when you will measure it.* |
| **Target** | *The value that would count as success — agreed now, not after the result.* |

## Before it goes to the team

| | |
|---|---|
| **Switching it off** | *How to undo or stop it, and how fast.* |
| **Open questions** | *Facts you do not have yet. The team's agents are told to add to this list rather than guess.* |
| **Checked against the six failures** | *Date, and who checked — see the checklist.* |

---

## For teams that use `whosigns`

The same brief can be kept as a file next to the code, with the fields above as YAML front matter, so
`whosigns lint` can check it for the six failures (specified, not yet built — kit `docs/spec.md` §6).
The filled-in example in [`brief-template.claims.md`](./brief-template.claims.md) shows both forms.

```yaml
---
id:
title:
status: draft            # draft | proposed | approved — approval is recorded in git
user:
  who:
  situation:
constraint:
  scale:                 # a number, or "n/a: <reason>"
  timing:
  integrations:
    - system:
      contract:          # required for every named system
  data: []               # none | personal | special | financial | regulated
  compliance:
  invariants: []         # required when money, identity or ordering is involved
acceptance:
  - GIVEN … WHEN … THEN …
metric:
  measure:
  baseline:
  target:
rollback:
open_questions: []
---
```
