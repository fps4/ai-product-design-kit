---
item: 9
title: "\"Who signs\" decision matrix — filled in for the running case"
part: 8 · Building it with agents
episodes: [8.5]
forms: [PDF, DOCX]
version: claims case
companion: who-signs-matrix.md (blank)
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Running case, Parts 3, 5, 6, 8 (see case/README.md) · Delegated Regulation (EU) 2024/1774 Art. 17(1)"
---

# Who signs? — the claims fast track

> **Example.** The insurer is fictional; roles are typical of a mid-size non-life insurer, not taken
> from a real one. It is a Solvency II insurer, so EU DORA's change rules apply to it.

## A. Building it

| Decision | Who may propose | Who approves (not the proposer) | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| The brief, as an approved version | Product Owner, fast track; an agent may draft | Head of claims | The brief: four parts, one or two pages | The approved version is a fixed version; code changes must name it | Brief version, approver, date |
| A change to the code | An engineer or a coding agent | An engineer in the claims IT team who did not write or co-write the change, and did not ask the agent for it | The change (under the size limit), its tests from the acceptance criteria, the brief version it names | Branch rules: no merge without that approval on the latest version of the change; agent and bot accounts cannot approve | Change, brief version, approver, checks passed |
| A change larger than the size limit | Engineer | Claims IT lead, if not an author | Why it cannot be split | A required size check; only a non-author can grant the exception | The exception and who granted it |
| An emergency change | On-call engineer | Claims IT lead, after the fact, within 5 working days | What changed and why | Listed as an exception until approved | The after-the-fact approval |
| A release to production | Claims IT lead | Change manager (IT risk) | The changes in it and the brief versions they name | Release pipeline needs the change manager's approval | Release, its changes, their brief versions |
| Giving an agent access to a system | Platform team | Claims IT lead and the system owner | What the agent may read and change | Agent identities are separate accounts with a named sponsor; no payment or approval rights | Agent, sponsor, rights, review date |

## B. What the product decides

| Decision | Who may propose | Who approves | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| The threshold: pay if P(not genuine or not covered) × amount < €23 | Product Owner with the data scientist, from the scorecard | **Head of claims** | The scorecard: errors and what each costs, at the proposed operating point (synthetic numbers, Part 3) | The code reads the current signed threshold version; it holds no copy of its own | Threshold version, signer, date; every payment logs the version it used |
| The cap: at most €1,000 per claim | Product Owner | **Head of claims** | The value case and the fraud exposure at that cap (Part 7) | Enforced in the payments interface as well as in the fast track — a claim text cannot talk it higher | Cap version, signer, date |
| The automation level of each step | Product Owner | Head of claims, with the fraud desk lead for the fraud score | The automation and failure card (Part 5) | Steps not marked automatic need a handler's action in the claims system | Card version |
| A new model or rule version going live | Data scientist | Head of claims (business), after the claims IT lead's technical sign-off | The scorecard re-run on the verified set, against the version in use | The decision log refuses payments from a model version not signed off | Model version, scorecard result, both signers |
| Switching it off | Anyone on the claims or IT on-call rota | Nobody — it takes effect at once; the head of claims is told | — | One setting; every claim then goes to a handler | When, who, why |
| Refusing or cutting a claim | — | **Never automatic.** A claims handler decides | The claim, the clause, the history | The fast track has no refuse or cut action | The handler's decision, as today |
| Referring a claim to the fraud desk | The model may suggest | A claims handler decides to refer | The reasons shown, never the score alone | A score is not shown to the policyholder or used as an accusation | Referral, by whom |

## C. Keeping it running

| Decision | Who may propose | Who approves | What they look at | What stops it being skipped | Record kept |
|---|---|---|---|---|---|
| A new entry, or a closed one, in the risk register | Anyone | Head of claims (owner), with compliance | The register entry: risk, owner, control, review date (Part 6) | Quarterly review on the claims management agenda | Register version |
| Acting on a monitoring alert (fraud paid, reversals, complaints, referral rates by postcode or language) | Product Owner | Head of claims | The monthly 2% audit and the alert | An alert above its limit lowers the cap or stops the fast track until signed off | Alert, decision, signer |

## The test, on this case

The internal auditor picks one automatic payment that later proved fraudulent. Within minutes, the
insurer can show: the model version and score, the threshold version and who signed it, the cap
version, the conditions version checked, and the release and code changes that built that path —
each approved by someone who did not write it.
