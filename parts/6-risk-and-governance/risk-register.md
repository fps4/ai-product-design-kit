---
item: 21
title: AI product risk register
part: "6 · Risk and governance"
episodes: "6.1 Risk follows the use, not the model"
forms: XLSX + DOCX (this Markdown is the source)
version: blank
licence: "CC BY 4.0 · AI Product Design · faridgurbanov.com"
status: "Draft v0.1 · 2026-10-20"
sources: "Reg. (EU) 2024/1689 (AI Act) Annex III, Art. 4, Art. 50 · GDPR Art. 22 · NIST AI RMF 1.0 · ISO/IEC 42001 · Mitchell et al. 2019 (model cards) · Gebru et al. 2018 (datasheets)"
---

# AI product risk register

**One page per AI product.** The sponsor owns it. Privacy and compliance review it. Fill it in the
day the use case gets a name, not the week before go-live. A filled-in example for an insurer's
claims fast track is in [`risk-register.claims.md`](./risk-register.claims.md).

*Not legal advice. It records where your risks are and who owns each one; it does not tell you what
the law requires of you.*

## 1. The product

| | |
|---|---|
| Product | *What it does, in one sentence a customer would understand* |
| Decision it makes or supports | *e.g. "pay, deny or investigate a claim"* |
| Owner (sponsor) | *A named person, not a department* |
| Reviewers | *Privacy officer · compliance · security · works council, if staff are monitored* |
| Register last reviewed | *Date* |

## 2. The tier, by use

Answer by **what the system is used for**, not by which model it uses.

| Question | Answer | Why |
|---|---|---|
| Is the use on the AI Act's **prohibited** list? | *Yes / no* | |
| Is the use on the AI Act's **high-risk** list (Annex III), or a safety component of a regulated product (Annex I)? | *Yes / no — name the point* | *e.g. life and health insurance pricing is listed; property claims handling is not* |
| Does it **talk to people or generate text** they will read? | *Yes / no* | *Transparency duties may apply* |
| Does it make a decision **solely by automated means** that significantly affects a person? | *Yes / no* | *If yes: who intervenes, how does the person contest it?* |
| Does any output **evaluate staff**? | *Yes / no* | *Rating individual workers' performance is a high-risk use* |
| Which **sector rules and supervisor expectations** apply? | *List* | *e.g. a sector code of conduct, the supervisor's opinion on AI* |
| Which **obligations do you already hold** that this touches? | *List* | *e.g. change approval, data protection, outsourcing* |

**Tier:** *one line.* **The nearest use on the other side of the line:** *one line — it shows where the
boundary is.*

## 3. The risks

Non-model risks first. One row per risk; a risk without an owner is not in the register yet.

| # | Risk | Kind | Where it shows | Control | Owner | Evidence it works | Review |
|---|---|---|---|---|---|---|---|
| 1 | *The data, the workflow or the owner* | Non-model | *Which step* | *What stops it* | *Name* | *What is measured or logged* | *Date or trigger* |
| 2 | *A decision that harms a person, made by the system alone* | Oversight | | | | | |
| 3 | *People not knowing they deal with AI* | Transparency | | | | | |
| 4 | *Different outcomes for groups, or their proxies (postcode, language, age of account)* | Fairness | | | | | |
| 5 | *Personal or special-category data used beyond its purpose* | Privacy | | | | | |
| 6 | *Limits that live only in a prompt* | Security | | | | | |
| 7 | *The world moves; the model does not* | Drift | | | | | |
| 8 | *Staff rated by the system's data* | Workforce | | | | | |
| … | | | | | | | |

**Kinds to cover at least once:** non-model (data, workflow, owner) · oversight · transparency ·
fairness · privacy · security · drift · workforce.

## 4. What the model and the data are for

| | |
|---|---|
| Intended use | *What it is for* |
| Not for | *What it must not be used for — the nearest use on the other side of the line* |
| Evaluated on | *Which set, overall and per group; link to the scorecard* |
| Data | *Where it came from, who labelled it, its known biases* |

## 5. Review

| Date | Who | What changed | Next review |
|---|---|---|---|
| | | | |

*Check before you finish:* every row has a named owner and a review date · the tier has a reason ·
limits in row 6 are enforced by a system, not by instructions · the fairness comparison is in the
monthly report, not only here.
