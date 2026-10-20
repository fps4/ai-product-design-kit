---
item: 20
title: Automation and failure card
part: 5 · Design for people
episodes: 5.1 Design for the day it is wrong · 5.2 Automation is a dial
forms: PDF (A4 landscape, two sides) + DOCX
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Amershi et al., Guidelines for Human-AI Interaction (CHI 2019) · Google PAIR, People + AI Guidebook · Parasuraman & Riley, Humans and Automation (Human Factors, 1997) · Parasuraman & Manzey, Complacency and Bias in Human Use of Automation (Human Factors, 2010)
filled_in: automation-and-failure-card.claims.md
---

# Automation and failure card

**For one AI use case: how much the system does at each step before a person looks, who approves, and
what happens on the day it is wrong.** Fill it in with the Product Owner, the business owner and
someone who does the work today. One card per use case; one row per step.

> *Example in the margin* lines come from the filled-in card for a fictional insurer fast-tracking
> small property claims (synthetic numbers). Delete them when you fill in your own.

**Use case:** ______________________ **Business owner:** ______________________
**Product Owner:** ______________________ **Date / version:** __________

---

## Side 1 · The dial, per step

Automation is a dial, not a switch. Set it **per step**, not for the whole product. Three positions:

- **Automatic** — the system acts; a person can see what it did and correct it.
- **Suggestion** — the system proposes; a person decides.
- **Person decides** — the system may prepare, but never decides. Mark it **locked** if it must
  never move towards automatic.

The rule for setting it: **the harder an action is to undo, and the more it harms the person it lands
on, the further the dial turns towards a person.**

| # | Step (what happens) | If it is wrong: who is harmed, and can it be undone? | Level | Who approves at this level | Locked? |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |

*Example in the margin:* "Denial · a policyholder entitled to the money is refused; undone only by
complaint · **Person decides** · handler, always · **locked**."

**"Nobody approves each one" is a valid answer** for an automatic step — but then name who approves
the rule behind it (the threshold, the cap, the version), and how often it is audited.

---

## Side 1 · The day it is wrong, per step

For every step above, answer three questions. A step without answers is not ready to go live.

| # | **Visible?** What does the employee see when it is wrong? What does the customer see? | **Cheap to fix?** How is it corrected, by whom, in how many steps? | **Does it teach?** Where does the correction go — and is it checked before the system learns from it? |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |

*Example in the margin:* "Coverage check · the quoted clause is the wrong one, visible at a glance ·
handler picks the right clause, one click · the correction is checked and added to the verified test
set."

**Explain with something a person can check** — the clause, the document, the rule that fired. A
confidence score or a list of model features gives the person nothing to check on the day it is wrong.

**Tell people when it was automatic**, and give them one step to reach a person:
- What the customer is told: ______________________
- How they reach a person, and how fast they get an answer: ______________________

---

## Side 2 · Test with errors in

A design tested only on correct output has not been tested. People who check output that is usually
right stop checking — training and instructions do not prevent it (Parasuraman & Manzey, 2010).
**A very high agreement rate is a warning, not a result.**

Before launch, run one **seeded-error week**:

| | |
|---|---|
| Which step is tested | |
| What the seeded items are | Past cases that are **already settled**, with a known-wrong suggestion attached — so a miss harms nobody |
| How many, mixed into how many real items | |
| Who knows | The team is told a test week is coming, not which items are seeded |
| What counts as *caught* | |
| Catch rate agreed **before** the week | ______ % · agreed by: ______________________ |
| If the catch rate is not reached | Do not launch the step at this level. Change the screen (show the evidence before the suggestion, make the check one click), then run the week again |
| Who runs it | |

*Example in the margin:* "Coverage check · past claims with the wrong clause quoted · catch rate set
by the head of claims · run by the handlers' team lead."

---

## Side 2 · What you measure — the interaction, not only the model

| Measure | Definition for this use case | Where it comes from | Reported to | How often |
|---|---|---|---|---|
| Acceptance rate | Share of suggestions accepted unchanged | | | |
| Override rate, with reason | Share of suggestions changed or rejected; the reason picked from a short list | | | |
| Edit distance | How much people change a drafted text before sending it | | | |
| Contest rate | Share of automatic decisions the customer asks a person to look at | | | |
| Complaints | Complaints about this process, internal and to the complaints body | | | |
| Time to decision | From the customer's request to the outcome | | | |
| Audit findings | Errors found in a sample of automatic decisions | | | |

When a rate moves, you should be able to say **why**. A falling override rate is good news only if
the system got better — not if people stopped looking.

---

## Sign-off

| | Name | Date |
|---|---|---|
| Levels and approvers proposed by (Product Owner) | | |
| Levels signed by (business owner) | | |
| Seeded-error week run by | | |
| Next review of this card | | |

---

*AI Product Design · Part 5 · faridgurbanov.com · CC BY 4.0. Built on: Amershi et al., Guidelines for
Human-AI Interaction (CHI 2019); Google PAIR, People + AI Guidebook; Parasuraman & Riley (1997);
Parasuraman & Manzey (2010). Not legal advice.*
