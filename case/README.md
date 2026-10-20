# The running case, as data

**Synthetic data for a fictional insurer. No real insurer, policyholder or claim is behind any row.**

The AI Product Design storyline follows one case through all eight parts. A mid-size Benelux non-life
insurer wants small home-contents and buildings claims that are clear and covered paid the same day.
Its head of claims owns the decision. The case's numbers are synthetic, picked so that the arithmetic
is easy to see. This folder turns them into a claims table. You can check every number, change an
assumption and see what moves.

## Run it

Python 3.10 or later, standard library only. The seed is fixed, so the same file comes out every time.

```
python3 -I case/generate.py --sample   # writes case/claims.csv (80,000 rows, ~10 MB) and claims-sample.csv
python3 -I case/check.py               # recomputes the case's numbers; exits 1 if one does not hold
python3 -I -m unittest discover -s case -t case
```

`claims.csv` is generated, not committed: at about 10 MB it is too big to read on GitHub. The first 200
rows are in [`claims-sample.csv`](claims-sample.csv). The latest check result is in
[`check-output.txt`](check-output.txt). A test keeps both current. After you change the generator,
run `python3 -I case/check.py > case/check-output.txt` and `generate.py --sample` again.

## What the check covers

For each number, the check prints **what the case says**, **what the data gives** and whether the two
match. A number matches if it is within 5%. Where the case states an exact rule, such as the
€1,000 cap or the stage 1 gate, it must match exactly.

| Section | Numbers | Used in |
|---|---|---|
| Scale and amounts | 80,000 claims, 68,000 small; 55/30/15% bands; three in four under €1,000; median ≈ €350; 8 days to settle | Parts 1, 2, 3, 5 |
| What claims turn out to be | 86% valid and covered, 10% not covered, 4% fraud or exaggerated; "pay everything" is 86% accurate | Part 3 (3.1) |
| The desk today | €2.49M handling; half the fraud paid, ≈ €952,000; 585 wrong denials at ≈ €350 each | Part 1 (1.1, 1.2) |
| The rule | 30% of small claims; 408 wrong, ≈ €61,000; ≈ €748,000 desk time saved | Part 2 (2.1) |
| The threshold | P × amount < €23; cut-offs at €150, €400, €1,000; model adds 20%, 50% automatic; nothing over €1,000 paid automatically; the 3,000-claim verified set | Part 3 (3.1, 3.2) |
| The value case | €779,000 assisted, €25,000 audit, €1.689M gross, €1.339M net, 8-month payback; the 35% sensitivity; the stage 1 gate; the fraud breaker | Part 7 (7.1) |

**Assumed numbers** are the case's own choices: the hourly rate, the handling minutes, the build and
run costs, the cost of a wrong denial. The check prints them as *assumed* so you can trace every
figure in the value case, but data cannot confirm them. A claims professional should check them
(running case, open check 3).

## What the data shows that the arithmetic cannot

The last part of the check is for information, not pass or fail. Each line is something only a
claim-by-claim table can show.

- **The fast track makes its own errors.** On the automatic slice it pays about €195,000 that is not
  owed. Today's desk pays about €20,000 of fraud on those same claims, and the fast track avoids
  about €110,000 of wrong denials. The net is about **€65,000 a year more** in error cost. The value
  case keeps error cost flat, so this lowers net to about €1.27M. That is well within the case's
  €238,000 breaker, which is why shadow mode measures fraud paid first.
- **The labels show only half the fraud.** Recorded labels show 2% fraud, because fraud is known only
  where the fraud desk looked. The truth is 4%, and the verified set shows it. A model trained on
  recorded labels learns which claims the fraud desk chose to look at.
- **Leakage looks brilliant.** `fraud_referral` predicts the recorded fraud label almost perfectly
  (AUC 0.99) because it is how that label was made, after triage. Against the truth it scores 0.74,
  and at triage time it does not exist yet.
- **The habit is in the history.** The desk refers valid claims written in French or English to the
  fraud desk about three times as often as Dutch ones, while true fraud is the same in every language.
  Part 6 compares referral rates by language and region for exactly this reason.

## Columns

One row per claim for one year. Columns starting with `sim_` are what only the simulation knows. In
real life you would know them only for the verified set.

| Column | Meaning |
|---|---|
| `claim_id` | `C000001`… |
| `received_date` | 2025 |
| `small` | 1 if up to €2,500 (in scope); 0 for the 12,000 that go to a loss adjuster |
| `product` | `contents` (inboedel) or `buildings` (opstal) |
| `product_generation` | `G1` (policies before 2016), `G2` (2016–2021), `G3` (2022 on): three versions of the policy conditions |
| `peril` | accidental_damage, theft, water, electrical, glass, storm, fire |
| `amount_eur` | amount claimed |
| `policy_start` | the policy's start date; about 4% started less than 90 days before the claim |
| `prior_claims_3y` | claims in the last three years |
| `single_item` | 1 if one item (a TV, a phone, a bike) |
| `channel` | `portal` or `broker` |
| `description_language` | language of the claim description: nl, fr, en, de, other |
| `postcode_region` | R01–R12, synthetic regions |
| `rule_eligible` | 1 if the Part 2 rule applies: glass or single item, under €300, no claim in three years |
| `model_score` | the model's P(not genuine or not covered), calibrated; small claims only |
| `desk_decision` | what today's desk did: `pay`, `deny`, or `adjuster` (large claims) |
| `desk_paid_eur` | what the desk paid |
| `fraud_referral` | 1 if sent to the fraud desk. **Set after triage: leakage** |
| `adjuster_assigned` | 1 if a loss adjuster was sent. **Set after triage: leakage** |
| `label_recorded` | what the claims table says today: `paid`, `not_covered`, `fraud` |
| `days_to_settle_today` | working days to settle at the desk |
| `verified_set` | 1 for the 3,000 claims re-checked by senior handlers and the fraud desk |
| `verified_label` | the true outcome, on the verified set only |
| `sim_truth` | the true outcome: `valid` (covered and genuine), `not_covered`, `fraud` (invented or exaggerated) |
| `sim_excess_eur` | the part of the amount that is not owed: all of it for uncovered or invented claims, part of it for exaggerated ones |

## How it is made

- **Amounts** follow the case's bands exactly. Inside each band the amounts are spread evenly on a
  log scale. Buildings claims are more likely at higher amounts.
- **The truth** comes from two hidden propensities per claim, one for fraud and one for not covered.
  Each mixes what the table shows with a hidden part it does not. For fraud: theft, a higher amount,
  earlier claims, a policy that started recently. For not covered: storm or water damage, the oldest
  conditions. The hidden part stands for everything a model cannot see. The
  case's totals are drawn exactly (6,800 not covered, 2,720 fraud; 408 wrong in the rule slice), and
  each claim's chance follows its propensities. **Description language and region have no effect on
  the truth.**
- **The model's score** is the true propensity seen through noise, then calibrated by isotonic
  regression, as a team would do on the verified set. Its AUC is about 0.81: good enough to pay a
  fifth of small claims below the threshold, and wrong on about 1 in 20 of those. That quality was
  tuned so that the threshold gives the case's 20%. It is not a claim about what a real model would
  reach.
- **The desk** pays exactly half the fraud, chosen at random, and denies exactly 1% of valid claims. It
  catches every uncovered claim, which the case assumes and does not state. The desk also refers
  valid claims to the fraud desk, more often when they are not written in Dutch.

## Limits

- The amount bands imply a distribution with a step: the case's 55/30/15 split, a median of €350 and
  three in four under €1,000 cannot all come from one smooth distribution. A single log-normal fitted
  to the first two puts 87% under €1,000. Read it as two groups of claims: many small contents claims
  and a hump of buildings claims between €1,000 and €2,500.
- One year, one seed, no seasons, no fraud rings, no change over time. Drift (Part 6) is not
  simulated.
- Not a benchmark. Do not compare a real model against these numbers.

Licence: CC BY 4.0, like the rest of the kit's content.
