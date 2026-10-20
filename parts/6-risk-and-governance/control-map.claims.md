---
item: 13
title: Control map — filled in for the claims fast track
part: "6 · Risk and governance"
episodes: "6.2 You already have this obligation"
forms: PDF (this Markdown is the source)
version: claims case
licence: "CC BY 4.0 · AI Product Design · faridgurbanov.com"
status: "Draft v0.1 · 2026-10-20"
sources: "Reg. (EU) 2022/2554 (EU DORA) Art. 2(1)(n), 2(3)(b) · Commission Delegated Reg. (EU) 2024/1774 Art. 17(1) · GDPR Art. 22 · Reg. (EU) 2024/1689 (AI Act) Annex III 4(b) and 5(c), Art. 4, Art. 50, as amended by Reg. (EU) 2026/1744 · Verbond van Verzekeraars, Toelichting Ethisch Kader 2025 · EIOPA-BoS-25-360"
---

# Control map — the claims fast track

> **A worked example.** The insurer is fictional — a mid-size non-life insurer under Solvency II, so in
> scope of EU DORA (Reg. (EU) 2022/2554, Art. 2(1)(n); the very small insurers outside Solvency II are
> excluded by Art. 2(3)(b)). Labels such as *threshold v3* are illustrations. Not legal advice. Blank
> version: [`control-map.md`](./control-map.md).

## 1. The workflow

| | |
|---|---|
| Workflow | Small, clear, covered property claims up to €1,000 paid automatically; the rest suggested to a handler. The payment path is built by the claims IT team with coding agents |
| AI inside the product, AI building it, or both? | **Both** |
| Owner | Head of claims (the product) · claims IT lead (the build) |
| Obligations already held | **EU DORA** change management — Delegated Reg. 2024/1774 Art. 17 · **GDPR** (AVG), incl. Art. 22 on solely automated decisions · **Verbond Ethisch Kader** (binding on members; claims handling, fraud and straight-through processing in scope; a register of in-scope applications) · **EIOPA opinion** on AI governance, applying existing law and EU DORA to AI that is not high-risk <!-- re-check against the EIOPA original (evidence EU-8, EU-11) --> · **AI Act** only where it applies: not high-risk (Annex III 5(c) covers life and health pricing only); Art. 4 AI literacy applies to every deployer; Art. 50 transparency <!-- TO CONFIRM: A12 --> |

## 2. Three questions first

| Question | Answer | Who answers |
|---|---|---|
| **Identity** | In the product: a *claims fast-track* identity that can pay up to €1,000 per claim, within a daily cap, for this policyholder only — it cannot deny, refer or change its own limits. In the build: coding agents open changes under their own accounts; **those accounts cannot approve or merge**, enforced by the repository's rules | Claims IT lead |
| **Approval** | Every change — code, model, prompt, rule, threshold, conditions version — is approved by someone independent of whoever requested it and whoever built it. An agent or bot approval never counts | Change manager |
| **Record** | For any automatic payment: the decision log names the rule or model version, score, threshold version and conditions version. For any release: which approved versions it carries, and who approved them | Compliance |

## 3. The map

| Layer | Control here | Obligation it helps evidence | Evidence produced | Owner |
|---|---|---|---|---|
| **Channel** — portal, app, brokers | The payment notice says it was automatic; one click reaches a person; letters name the clause and the complaint route (Kifid) | GDPR Art. 22(3): human intervention, express a view, contest · AI Act Art. 50 <!-- TO CONFIRM: A12 --> | Notice wording, versioned; contest log | Head of claims |
| **Orchestration** — rule → coverage check → score → route | Only *pay* is automatic; denials, cuts and fraud referrals always route to a handler | GDPR Art. 22(1) — the harmful decision is never solely automated · Verbond framework (straight-through processing in scope) | Route rules, versioned; query: zero automatic denials | Head of claims |
| **Model access** — the platform's model gateway | One gateway; the data agreement covers personal and special-category data; no training on claim notes | GDPR <!-- TO CONFIRM: add an evidence row for Art. 9 --> · EU DORA Art. 17 for changes to the gateway | Data agreement on file; gateway change records | Platform team · privacy officer |
| **Knowledge and retrieval** — conditions per version | The coverage check reads the conditions version **this policyholder holds**; a new version is a change | EU DORA Art. 17(1)(c): changes *"tested and finalised in a controlled manner"* — *our reading* for content held as a system setting | Conditions versions with change records | Product manager home |
| **Tools and integration** — policy admin (read), claims (write), payments (write) | The €1,000 cap, the daily cap and *one payment per claim line* enforced in the payments interface, not in the prompt | EIOPA: compensating measures for AI that reads text and images <!-- re-check EU-11 --> · prompt injection <!-- TO CONFIRM: A13 --> | Interface tests in every release, incl. an injected-text claim | Claims IT lead · security architect |
| **Identity and permissions** | Fast-track identity with fixed limits; agent accounts in the build cannot approve | EU DORA Art. 17(1)(b): independence of the functions that approve changes from those that request and implement them | Identity configuration; repository rules | Security architect |
| **Human approval** | Two signatures (section 4); independent change approval for every release | EU DORA Art. 17(1)(b) · Verbond framework | Signed threshold versions; change records | Head of claims · change manager |
| **Evaluation** | The verified set re-run on every change of model, prompt, rule, threshold or conditions version; the result attached to the change | EU DORA Art. 17(1)(a) security requirements verified, (c) *"effective quality assurance"* · EIOPA <!-- re-check EU-11 --> | Scorecard run per change | Product Owner, claims |
| **Observability and cost** — the decision log | Per decision: versions, score, outcome; switch-off to the desk within the hour; reports per team, never per handler | EU DORA Art. 17(1)(d) documentation, (e) fall-back procedures · GDPR Art. 22(3) contest · AI Act Annex III 4(b) avoided — no rating of individual handlers · Verbond register | Decision log; tested switch-off; monthly report | Claims IT lead · head of claims |

## 4. Two signatures

| | What is signed | By whom | Held as |
|---|---|---|---|
| **Business decision** | Threshold v3 (*P(not genuine or not covered) × amount < €23*) and the €1,000 cap | Head of claims | Immutable version in the specification store |
| **Change approval** | That release 2026.11, which puts threshold v3 live, was requested, built, tested and approved in a controlled way | A change approver independent of claims (the requester) and claims IT (the implementer) | Change record |
| **The link** | Release 2026.11 carries threshold v3 and the conditions versions of all three product generations | Automatic, from the build | Release record |

The head of claims decides *what should be true*; the change approver confirms *the change was
controlled*. Neither replaces the other.

## 5. Gaps

| Gap | Owner | Closed by |
|---|---|---|
| The release record does not yet link a threshold version to the release that uses it | Claims IT lead | Before go-live of the automatic slice |
| Conditions versions are changed in a content tool outside the change process | Product manager home · change manager | Before shadow mode |
| The works council has not yet agreed the team-level reports <!-- TO CONFIRM: R10 --> | Head of claims · HR | Before go-live |

*Not legal advice. Article texts and their verification status are in the evidence register of the AI
Product Design storyline.*
