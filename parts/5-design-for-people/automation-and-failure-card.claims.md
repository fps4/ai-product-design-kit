---
item: 20
title: Automation and failure card — filled in for the claims case
part: 5 · Design for people
episodes: 5.1 Design for the day it is wrong · 5.2 Automation is a dial
forms: PDF (A4 landscape, two sides) + DOCX
version: claims case
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Amershi et al., Guidelines for Human-AI Interaction (CHI 2019) · Google PAIR, People + AI Guidebook · Parasuraman & Riley, Humans and Automation (Human Factors, 1997) · Parasuraman & Manzey, Complacency and Bias in Human Use of Automation (Human Factors, 2010) · Ombudsman van de Verzekeringen, Jaarverslag 2025 (suspicion and sanctions)
blank: automation-and-failure-card.md
---

# Automation and failure card — fast-tracking small property claims

> **A worked example — the insurer is fictional, the numbers synthetic.** A mid-size non-life
> insurer where a claims handler reads every small home-contents claim by hand, and the head of claims
> wants the clear ones paid the same day. The blank card is
> [`automation-and-failure-card.md`](./automation-and-failure-card.md).

**Use case:** Fast track for small home-contents and buildings claims (up to €2,500)
**Business owner:** Head of claims **Product Owner:** Product Owner, claims
**Date / version:** v0.1, before shadow mode

---

## Side 1 · The dial, per step

Positions: **Automatic** · **Suggestion** · **Person decides** (*locked* = must never move towards
automatic). The rule: the harder an action is to undo, and the more it harms the person it lands on,
the further the dial turns towards a person.

| # | Step | If it is wrong: who is harmed, and can it be undone? | Level | Who approves at this level | Locked? |
|---|---|---|---|---|---|
| 1 | Read the claim and photos; find the policy and the right version of its conditions (polisvoorwaarden) | Every later step works from the wrong policy or the wrong conditions. Nobody is harmed yet; undone by re-linking before a decision | **Automatic**, shown to the handler | Nobody per claim. The product and claims teams own the conditions versions | No |
| 2 | Coverage check | A wrong clause leads to a wrong suggestion to pay or to deny. Undone while the handler decides | **Suggestion**, with the clause quoted | Handler (schadebehandelaar) | No |
| 3 | Small, covered, low-score claim up to €1,000 | A payment that should not have been made (fraud, or not covered). The insurer carries it, capped at €1,000 per claim; recovered only sometimes | **Automatic payment**; the policyholder is told it was automatic | Nobody per claim. The head of claims signs the threshold and the €1,000 cap as versions; 2% of automatic payments are audited | No — but the cap and threshold change only with the head of claims' signature |
| 4 | Other claims | A wrong pay, part-pay or deny suggestion. Undone while the handler decides | **Suggestion**, with a drafted letter | Handler | No |
| 5 | Denial | A policyholder entitled to the money is refused. Undone only if they complain | **Person decides** | Handler, always. The letter names the clause and the complaint route (Kifid in NL, the Ombudsman in BE) | **Locked** |
| 6 | Suspected fraud | An honest policyholder is treated as a suspect. Harm to them and to trust; hard to undo | **Person decides** — never an automatic accusation | Fraud desk investigates. The score is never shown to the policyholder | **Locked** |

---

## Side 1 · The day it is wrong, per step

| # | **Visible?** | **Cheap to fix?** | **Does it teach?** |
|---|---|---|---|
| 1 · Read and link | The handler sees the linked policy number and the conditions edition at the top of every claim. The policyholder sees nothing at this step | Handler re-links in one click | Every re-link is logged. A pattern of re-links on one product generation goes to the team that keeps the conditions versions current |
| 2 · Coverage check | The clause is quoted, with its edition. The wrong clause, or the wrong product generation, is visible at a glance — **the clause is the explanation** | Handler picks the right clause, or marks *"clause does not apply"*, in one click | The correction is checked by a senior handler and added to the verified set the system is tested on after every change |
| 3 · Automatic payment | The policyholder sees *"Paid automatically today"* and one button: *ask a person*. The insurer sees errors in the 2% audit sample | *Ask a person* reaches a handler, answered within a day. An audit finding goes to the claims team lead | The handler's outcome and every audit finding become verified labels. The fraud rate in the automatic slice is tracked month by month |
| 4 · Other claims | The handler sees the suggestion with what it rests on: the clause, the claim history items it used | Override in one click, with a reason from a short list; the drafted letter is edited before sending | Override reasons are reviewed monthly by the Product Owner. Letter edits show which paragraphs need a better template |
| 5 · Denial | The policyholder receives a letter, signed by a handler, naming the clause and the complaint route | A contested denial is reviewed by a **second** handler | The outcome of every contested denial becomes a verified label |
| 6 · Suspected fraud | Only the fraud desk sees the referral and the facts that triggered it. The policyholder sees normal handling; nothing that reads as an accusation unless the investigation finds facts | The fraud desk closes a referral as unfounded; the claim returns to normal handling with no extra delay | The investigation outcome becomes a label **in both directions** — found and not found. Without the *not found* labels, the system only learns where the fraud desk chose to look |

**Explained with something a person can check:** the clause and its edition (step 2), the history
items used (step 4), the facts behind a referral (step 6). No confidence scores on the handler's
screen; no score ever shown to the policyholder.

**Telling people when it was automatic:**
- Automatic payment: *"Your claim was checked and paid automatically today. Want a person to look at
  it? Ask a person."* Answered within a day.
- Letters drafted with AI help say so, and say a handler checked them.
  <!-- TO CONFIRM: wording against AI Act Art. 50 and its application date (evidence A12) -->

---

## Side 2 · Test with errors in

If handlers agree with 99% of the suggestions, that is a warning, not a result: it may be a rubber
stamp. Automation bias occurs in naive and expert users alike and is not prevented by training or
instructions (Parasuraman & Manzey, 2010).

| | |
|---|---|
| Which step is tested | Step 2, the coverage check — and step 4's suggestions on the same claims |
| What the seeded items are | **Past claims that are already settled**, each with a known-wrong suggestion: the wrong clause, a clause from the wrong product generation, or *covered* where the policy excluded it. A miss harms no policyholder |
| How many, mixed into how many real items | *To be set with the head of claims* |
| Who knows | The handlers are told a test week is coming during shadow mode, not which claims are seeded |
| What counts as *caught* | The handler overrides the suggestion, or flags it, before deciding |
| Catch rate agreed **before** the week | *To be set by the head of claims* — written down before the week starts |
| If the catch rate is not reached | The coverage check does not go live as a suggestion in this form. Show the clause **before** the suggestion, make *"clause does not apply"* one click, and run the week again |
| Who runs it | The handlers' team lead, with the Product Owner |

---

## Side 2 · What is measured — the interaction, not only the model

| Measure | Definition for this case | Where it comes from | Reported to | How often |
|---|---|---|---|---|
| Acceptance rate | Share of coverage and pay/deny suggestions the handler accepts unchanged | Claims system decision log | Product Owner | Weekly in shadow mode, then monthly |
| Override rate, with reason | Share of suggestions changed or rejected; reason from a short list (*wrong clause · wrong version · history missed · amount · other*) | Decision log | Product Owner, head of claims | Monthly |
| Edit distance | How much handlers change a drafted letter before sending | Letter tool | Product Owner | Monthly |
| Contest rate | Share of automatic payments where the policyholder pressed *ask a person* | Portal and claims system | Head of claims | Monthly |
| Complaints | Complaints about claims handling and payout for this product, internal and to Kifid or the Ombudsman | Complaints register | Head of claims | Monthly |
| Time to settlement | Median working days from report to payment. Today 8; same day for the automatic slice (synthetic) | Claims system | Head of claims | Monthly |
| Audit findings | Errors and fraud found in the 2% sample of automatic payments | Audit log | Head of claims, fraud desk | Monthly |

A falling override rate is good news only if the system got better. The seeded-error week, repeated,
is how you tell the difference.

---

## Sign-off

| | Name | Date |
|---|---|---|
| Levels and approvers proposed by | Product Owner, claims | |
| Levels signed by | Head of claims | |
| Seeded-error week run by | Handlers' team lead | |
| Next review of this card | Before the rule slice goes automatic (end of shadow mode) | |

---

*AI Product Design · Part 5 · faridgurbanov.com · CC BY 4.0. A worked example: the insurer is
fictional and the numbers are synthetic. Built on: Amershi et al. (CHI 2019); Google PAIR, People + AI
Guidebook; Parasuraman & Riley (1997); Parasuraman & Manzey (2010). Not legal advice.*
