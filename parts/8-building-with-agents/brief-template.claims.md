---
item: 3
title: Brief template — filled in for the running case
part: 8 · Building it with agents
episodes: [8.1]
forms: [DOCX, Markdown]
version: claims case
companion: brief-template.md (blank) · six-failure-checklist.md
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Running case, Part 8 (see case/README.md) · AI Product Design, Part 8 (*make the brief precise enough to build from*)"
---

# Brief — automatic payment of small claims (fast track)

> **Example.** The insurer is fictional and every number is synthetic. It shows what a filled-in
> brief looks like; it is not a real insurer's design.

| | |
|---|---|
| **Title** | Pay small, clear, covered home-contents and buildings claims automatically, the same day |
| **Owner** | Head of claims (business); Product Owner, claims fast track (brief) |
| **Version** | v3 · proposed 2026-11-04 · to be approved by the head of claims. The threshold and the cap it uses are their own signed versions (see the "who signs" matrix) |

## 1. User

| | |
|---|---|
| **Who** | The claims fast track, acting for the head of claims |
| **Situation** | A policyholder has reported a small claim through the portal or a broker. The rule or the model has marked it clear and covered. Today a claims handler (schadebehandelaar) reads every one by hand; the median small claim waits 8 working days to be settled |

## 2. Constraint

| | |
|---|---|
| **Scale** | Up to 68,000 small claims a year (up to €2,500). About half are expected on the fast track — about 34,000 automatic payments a year (synthetic) |
| **Timing** | A claim marked clear before 15:00 is in the same day's payment file |
| **Systems it touches** | Claims system — `contracts/claims-api-v4.yaml#/claims/{id}/decision` · Policy administration — `contracts/policy-api-v2.yaml#/policies/{id}/conditions` (returns the conditions **version** the policyholder holds) · Payments interface — `contracts/payments-v3.yaml#/payment-orders` · Decision log — `contracts/decision-log-v1.yaml#/entries` |
| **What must never happen twice, or out of order** | One payment per claim line. A payment order is idempotent: sending it again with the same claim-line key never creates a second payment |
| **Data** | Personal · financial |
| **Rules about the data** | The decision log holds the claim number, never the name or the IBAN in plain text. No automatic denial: the fast track may pay or route to a handler, never refuse or cut a claim (a refusal is a decision a person makes — our reading of GDPR Art. 22; confirm with the data protection officer). Every change to this path is approved by someone other than whoever requested or built it (EU DORA, Delegated Regulation 2024/1774 Art. 17; the insurer is a Solvency II insurer) |
| **Limits set by the business** | At most **€1,000** per claim. Pay only if P(not genuine or not covered) × amount < **€23**. Both are signed by the head of claims as versions; the code reads the current signed version and never holds its own copy. The cap is enforced in the payments interface as well, not only in this path |

## 3. Acceptance criteria

1. GIVEN a claim line already paid WHEN a second payment request for the same line arrives THEN it is
   refused and logged, and no second payment order is created.
2. GIVEN a claim of €1,000.01 WHEN it is marked clear THEN it goes to a handler and is not paid
   automatically.
3. GIVEN a claim of €400 with P = 0.05 WHEN it is scored THEN it is paid (0.05 × €400 = €20 < €23);
   GIVEN the same claim with P = 0.06 THEN it goes to a handler (€24 ≥ €23).
4. GIVEN an automatic payment WHEN it is made THEN the decision log holds the rule or model version,
   the score, the threshold version and the policy conditions version.
5. GIVEN an automatic payment not yet in the bank file WHEN a handler stops it THEN it is not sent, and
   the claim returns to the handler's queue.
6. *(error case)* GIVEN the payments interface is unavailable WHEN a payment is due THEN the claim
   stays in the fast-track queue, a handler is alerted after 30 minutes, and when the interface returns
   the payment is sent once.
7. *(error case)* GIVEN the policy administration cannot return the conditions version WHEN a claim is
   checked THEN it goes to a handler; it is never checked against another version.
8. GIVEN any automatic payment WHEN the policyholder is told THEN the message says it was paid
   automatically and how to reach a person in one click.

## 4. Success metric

| | |
|---|---|
| **Measure** | Share of automatic payments later reversed, contested or found fraudulent |
| **Baseline** | Measured in shadow mode before go-live, on the verified set of 3,000 re-checked claims (synthetic, running case Part 3) |
| **Target** | Set by the head of claims in the scorecard before the work (Part 3), and checked every month on a 2% audit of automatic payments |

## Before it goes to the team

| | |
|---|---|
| **Switching it off** | One setting stops the fast track within the hour; every claim then goes to a handler, as today |
| **Open questions** | Which products' conditions are in scope in the first release (three product generations exist)? · Does the broker channel get the same message to the policyholder? |
| **Checked against the six failures** | 2026-11-04, Product Owner with the claims IT lead |

---

## The same brief as a file, for `whosigns lint`

```yaml
---
id: fast-track-payment
title: Pay small, clear, covered property claims automatically, the same day
status: proposed
user:
  who: Claims fast track, acting for the head of claims
  situation: small home-contents or buildings claim marked clear and covered; today a handler reads every one
constraint:
  scale: up to 68000 small claims a year; about 34000 automatic payments a year (synthetic)
  timing: claims marked clear before 15:00 are in the same day's payment file
  integrations:
    - system: claims system
      contract: contracts/claims-api-v4.yaml#/claims/{id}/decision
    - system: policy administration
      contract: contracts/policy-api-v2.yaml#/policies/{id}/conditions
    - system: payments interface
      contract: contracts/payments-v3.yaml#/payment-orders
    - system: decision log
      contract: contracts/decision-log-v1.yaml#/entries
  data: [personal, financial]
  compliance: >-
    no name or IBAN in plain text in the decision log; no automatic denial or cut, only pay or route
    to a handler; changes approved independently of request and build (EU DORA RTS 2024/1774 Art. 17)
  invariants:
    - one payment per claim line; payment orders are idempotent on the claim-line key
    - no automatic payment above the signed cap (EUR 1,000, threshold version from the signed register)
    - a claim is checked only against the conditions version the policyholder holds
acceptance:
  - GIVEN a claim line already paid WHEN a second payment request arrives THEN it is refused and logged
  - GIVEN a claim of 1000.01 WHEN it is marked clear THEN it goes to a handler
  - GIVEN an automatic payment WHEN it is made THEN the log holds model, score, threshold and conditions versions
  - GIVEN a payment not yet in the bank file WHEN a handler stops it THEN it is not sent
  - GIVEN the payments interface is unavailable WHEN a payment is due THEN the claim waits, a handler is alerted, and it is sent once
  - GIVEN the conditions version cannot be found WHEN a claim is checked THEN it goes to a handler
metric:
  measure: share of automatic payments later reversed, contested or found fraudulent
  baseline: shadow mode on the verified set of 3000 claims
  target: set by the head of claims in the scorecard; checked monthly on a 2% audit
rollback: one setting stops the fast track within the hour; all claims go to handlers
open_questions:
  - which product generations are in scope in release 1
  - broker channel message to the policyholder
---
```
