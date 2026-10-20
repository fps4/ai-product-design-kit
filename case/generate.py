"""Generate the running case as data: one year of property claims at a fictional insurer.

Synthetic. No real insurer, policyholder or claim is behind any row. The shape is chosen so that
the case's numbers (running case, AI Product Design) come out of the data, not to match a market.

    python3 -I case/generate.py            # writes case/claims.csv
    python3 -I case/generate.py --sample   # also writes case/claims-sample.csv (first 200 rows)

Standard library only; the same seed gives the same file.
"""

from __future__ import annotations

import argparse
import csv
import math
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 20261020
HERE = Path(__file__).resolve().parent

# --- Scale and amounts (running case, "The numbers") ------------------------------------------

N_SMALL = 68_000          # up to EUR 2,500, handled at the desk
N_LARGE = 12_000          # above EUR 2,500, go to a loss adjuster; out of scope

# Cumulative share of small claims at each amount (EUR). Between knots the amount is log-uniform.
#   55% of all 80,000 claims are under 500   -> 44,000 of the 68,000 small ones
#   about three in four small claims are under the EUR 1,000 cap; the median is about EUR 350
SMALL_CDF = [(40, 0.0), (350, 0.5), (500, 44_000 / 68_000), (1_000, 0.75), (2_500, 1.0)]
LARGE_CDF = [(2_500, 0.0), (10_000, 0.8), (60_000, 1.0)]

# --- What the claims turn out to be ------------------------------------------------------------

# Targets per group: rule slice (the three-line rule of Part 2) and the rest of the small claims.
#   overall: 10% not covered (6,800), 4% fraudulent or exaggerated (2,720)
#   the rule slice is about 2% wrong (408 of 20,400)
TARGET = {
    True: {"fraud": 80, "not_covered": 328},             # rule slice
    False: {"fraud": 2_720 - 80, "not_covered": 6_800 - 328},
}

LATENT_SD = 1.38  # spread of what the data cannot see (how each claim really is)
MODEL_NOISE_SD = 0.85     # how far the model's view is from the truth, on the log-odds scale
FABRICATED_SHARE = 0.25 # of fraud: invented outright (the rest is an exaggerated real loss)

# --- The desk today ----------------------------------------------------------------------------

DESK_FRAUD_PAID_SHARE = 0.5     # half the fraud is paid
DESK_WRONG_DENIAL_SHARE = 0.01  # 1% of valid, covered claims are denied
VERIFIED_SET = 3_000

CONTENTS_PERILS = {
    "accidental_damage": 0.38, "theft": 0.22, "water": 0.16, "electrical": 0.06,
    "glass": 0.06, "storm": 0.06, "fire": 0.06,
}
BUILDINGS_PERILS = {
    "water": 0.35, "storm": 0.25, "glass": 0.20, "fire": 0.08,
    "accidental_damage": 0.07, "theft": 0.05,
}
LANGUAGES = {"nl": 0.68, "fr": 0.22, "en": 0.06, "de": 0.02, "other": 0.02}
REGIONS = [f"R{i:02d}" for i in range(1, 13)]


def sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    e = math.exp(x)
    return e / (1.0 + e)


def logit(p: float) -> float:
    p = min(max(p, 1e-9), 1 - 1e-9)
    return math.log(p / (1 - p))


def quantile(cdf: list[tuple[float, float]], u: float) -> float:
    for (x0, c0), (x1, c1) in zip(cdf, cdf[1:]):
        if u <= c1:
            t = 0.0 if c1 == c0 else (u - c0) / (c1 - c0)
            return math.exp(math.log(x0) + t * (math.log(x1) - math.log(x0)))
    return cdf[-1][0]


def stratified(rng: random.Random, n: int) -> list[float]:
    """n uniforms, one per 1/n stratum, shuffled: the band shares come out exactly."""
    us = [(i + rng.random()) / n for i in range(n)]
    rng.shuffle(us)
    return us


def pick(rng: random.Random, weights: dict[str, float]) -> str:
    return rng.choices(list(weights), weights=list(weights.values()))[0]


def solve_intercept(base: list[float], target: float) -> float:
    """The intercept a for which sum(sigmoid(a + b)) == target, by bisection."""
    lo, hi = -30.0, 30.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if sum(sigmoid(mid + b) for b in base) < target:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def pav(values: list[float], weights: list[float]) -> list[float]:
    """Pool adjacent violators: the non-decreasing fit to values (calibration)."""
    blocks: list[list[float]] = []  # [mean, weight, count]
    for v, w in zip(values, weights):
        blocks.append([v, w, 1])
        while len(blocks) > 1 and blocks[-2][0] > blocks[-1][0]:
            m2, w2, n2 = blocks.pop()
            m1, w1, n1 = blocks.pop()
            blocks.append([(m1 * w1 + m2 * w2) / (w1 + w2), w1 + w2, n1 + n2])
    out: list[float] = []
    for m, _, n in blocks:
        out.extend([m] * n)
    return out


def generate(seed: int = SEED) -> list[dict]:
    rng = random.Random(seed)
    year = date(2025, 1, 1)
    rows: list[dict] = []

    amounts = [quantile(SMALL_CDF, u) for u in stratified(rng, N_SMALL)]
    amounts += [quantile(LARGE_CDF, u) for u in stratified(rng, N_LARGE)]

    for i, amount in enumerate(amounts):
        small = i < N_SMALL
        amount = round(amount, 2)
        p_buildings = 0.12 if amount < 350 else 0.25 if amount < 1_000 else 0.5 if small else 0.6
        product = "buildings" if rng.random() < p_buildings else "contents"
        peril = pick(rng, BUILDINGS_PERILS if product == "buildings" else CONTENTS_PERILS)
        if product == "contents" and peril in ("theft", "accidental_damage", "electrical"):
            single_item = rng.random() < (0.9 if amount < 500 else 0.6)
        else:
            single_item = rng.random() < (0.35 if amount < 500 else 0.1)
        prior = 0 if rng.random() < 0.9 else (1 if rng.random() < 0.75 else 2)
        received = year + timedelta(days=rng.randrange(365))
        if rng.random() < 0.04:
            age_days = rng.randrange(10, 90)                    # policy started recently
        else:
            age_days = int(90 + rng.expovariate(1 / 2_600))
        policy_start = received - timedelta(days=age_days)
        generation = "G1" if policy_start.year < 2016 else "G2" if policy_start.year < 2022 else "G3"
        rule = small and (peril == "glass" or single_item) and amount < 300 and prior == 0
        rows.append({
            "claim_id": f"C{i + 1:06d}",
            "received_date": received.isoformat(),
            "small": int(small),
            "product": product,
            "product_generation": generation,
            "peril": peril,
            "amount_eur": f"{amount:.2f}",
            "policy_start": policy_start.isoformat(),
            "prior_claims_3y": prior,
            "single_item": int(single_item),
            "channel": "broker" if rng.random() < 0.3 else "portal",
            "description_language": pick(rng, LANGUAGES),
            "postcode_region": rng.choice(REGIONS),
            "rule_eligible": int(rule),
            "_amount": amount, "_age": age_days, "_rule": rule,
            "_z_fr": rng.gauss(0, LATENT_SD), "_z_nc": rng.gauss(0, LATENT_SD),
        })

    # What each claim really is. Two hidden propensities, from what the data shows plus what it
    # cannot (the latent part). Description language and region have no effect on the truth.
    def fraud_base(r: dict) -> float:
        p = r["peril"]
        return (1.0 * (p == "theft") + 0.4 * (p == "accidental_damage") + 0.3 * (p == "electrical")
                - 1.0 * (p == "glass") - 0.5 * (p == "storm")
                + 0.7 * math.log(r["_amount"] / 350) + 0.6 * r["prior_claims_3y"]
                + 1.6 * (r["_age"] < 90) + r["_z_fr"])

    def cover_base(r: dict) -> float:
        p, g = r["peril"], r["product_generation"]
        return (0.9 * (p == "storm" and g == "G1") + 0.6 * (p == "water")
                + 0.5 * (p == "theft" and not int(r["single_item"])) + 0.4 * (g == "G1")
                + 0.9 * math.log(r["_amount"] / 350) + r["_z_nc"])

    small_rows = [r for r in rows if r["small"]]
    for group in (True, False):
        members = [r for r in small_rows if r["_rule"] == group]
        fb = [fraud_base(r) for r in members]
        cb = [cover_base(r) for r in members]
        a_fr = solve_intercept(fb, TARGET[group]["fraud"])
        a_nc = solve_intercept(cb, TARGET[group]["not_covered"])
        for r, f, c in zip(members, fb, cb):
            r["_p_fr"] = sigmoid(a_fr + f)
            r["_p_nc"] = min(sigmoid(a_nc + c), 0.98 - r["_p_fr"])
            r["_p_bad"] = r["_p_fr"] + r["_p_nc"]
            r["sim_truth"] = "valid"
        # Draw exactly the target counts, each claim with odds in line with its propensity
        # (weighted sampling without replacement), so the case's totals hold for any seed.
        for kind, key in (("fraud", "_p_fr"), ("not_covered", "_p_nc")):
            pool = [r for r in members if r["sim_truth"] == "valid"]
            ranked = sorted(pool, key=lambda r: rng.random() ** (1 / r[key]), reverse=True)
            for r in ranked[:TARGET[group][kind]]:
                r["sim_truth"] = kind

    # Large claims: not part of the case; a fixed mix so the file is whole.
    for r in rows:
        if not r["small"]:
            u = rng.random()
            r["sim_truth"] = "fraud" if u < 0.05 else "not_covered" if u < 0.15 else "valid"
            r["_p_bad"] = None

    # The model's score: the truth seen through noise, then calibrated (as a team would on the
    # verified set), so that a score of 0.05 means about 5 in 100 such claims are bad.
    noisy = [(logit(r["_p_bad"]) + rng.gauss(0, MODEL_NOISE_SD), r) for r in small_rows]
    noisy.sort(key=lambda t: t[0])
    calibrated = pav([r["_p_bad"] for _, r in noisy], [1.0] * len(noisy))
    for (_, r), s in zip(noisy, calibrated):
        r["model_score"] = f"{s:.4f}"
    for r in rows:
        r.setdefault("model_score", "")

    # What is not owed in each claim.
    for r in rows:
        a = r["_amount"]
        if r["sim_truth"] == "valid":
            excess = 0.0
        elif r["sim_truth"] == "not_covered":
            excess = a
        else:
            excess = a if rng.random() < FABRICATED_SHARE else a * rng.uniform(0.35, 0.75)
        r["sim_excess_eur"] = f"{excess:.2f}"

    # The desk today: pays half the fraud, wrongly denies 1% of valid claims, catches every
    # uncovered claim. Fraud is known only where the fraud desk looked.
    valid = [r for r in small_rows if r["sim_truth"] == "valid"]
    fraud = [r for r in small_rows if r["sim_truth"] == "fraud"]
    wrongly_denied = {r["claim_id"] for r in rng.sample(valid, round(DESK_WRONG_DENIAL_SHARE * len(valid)))}
    fraud_paid = {r["claim_id"] for r in rng.sample(fraud, round(DESK_FRAUD_PAID_SHARE * len(fraud)))}
    for r in rows:
        cid, truth = r["claim_id"], r["sim_truth"]
        if not r["small"]:
            decision, referral, adjuster = "adjuster", 0, 1
        elif truth == "valid":
            decision = "deny" if cid in wrongly_denied else "pay"
            # The desk refers descriptions not in Dutch more often. The truth does not differ.
            referral = int(rng.random() < (0.008 if r["description_language"] == "nl" else 0.025))
            adjuster = int(rng.random() < 0.015)
        elif truth == "not_covered":
            decision, referral, adjuster = "deny", 0, int(rng.random() < 0.08)
        else:
            if cid in fraud_paid:
                decision, referral, adjuster = "pay", 0, int(rng.random() < 0.02)
            else:
                decision, referral, adjuster = "deny", 1, int(rng.random() < 0.3)
        r["desk_decision"] = decision
        r["desk_paid_eur"] = r["amount_eur"] if decision == "pay" else "0.00"
        r["fraud_referral"] = referral
        r["adjuster_assigned"] = adjuster
        if decision == "pay":
            r["label_recorded"] = "paid"
        elif decision == "deny":
            r["label_recorded"] = "fraud" if referral else "not_covered"
        else:
            r["label_recorded"] = ""
        days = math.exp(math.log(8) + rng.gauss(0, 0.45)) + (15 if referral else 0)
        r["days_to_settle_today"] = max(1, round(days)) if r["small"] else ""

    verified = {r["claim_id"] for r in rng.sample(small_rows, VERIFIED_SET)}
    for r in rows:
        r["verified_set"] = int(r["claim_id"] in verified)
        r["verified_label"] = r["sim_truth"] if r["verified_set"] else ""

    return rows


COLUMNS = [
    "claim_id", "received_date", "small", "product", "product_generation", "peril", "amount_eur",
    "policy_start", "prior_claims_3y", "single_item", "channel", "description_language",
    "postcode_region", "rule_eligible", "model_score", "desk_decision", "desk_paid_eur",
    "fraud_referral", "adjuster_assigned", "label_recorded", "days_to_settle_today",
    "verified_set", "verified_label", "sim_truth", "sim_excess_eur",
]


def write(rows: list[dict], path: Path, limit: int | None = None) -> None:
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS, extrasaction="ignore", lineterminator="\n")
        w.writeheader()
        for r in rows[:limit] if limit else rows:
            w.writerow(r)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--out", type=Path, default=HERE / "claims.csv")
    ap.add_argument("--sample", action="store_true", help="also write claims-sample.csv (200 rows)")
    args = ap.parse_args()
    rows = generate()
    write(rows, args.out)
    if args.sample:
        write(rows, HERE / "claims-sample.csv", limit=200)
    print(f"wrote {len(rows):,} claims to {args.out}")


if __name__ == "__main__":
    main()
