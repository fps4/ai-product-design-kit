"""Recompute the running case's numbers from the claims file, and say where they hold.

    python3 -I case/check.py [case/claims.csv]

Each line: what the case says, what the data gives, and whether it is within tolerance (5% unless the
case states an exact rule). Lines marked "assumed" are inputs the case chooses, not results; they are
printed so every number in the value case can be traced. Exits 1 if any check fails.
"""

from __future__ import annotations

import csv
import statistics
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Assumptions (running case, "The numbers" and Part 7). Not checkable against data.
RATE = 55.0                 # EUR per handler hour, fully loaded
DESK_MIN = 40               # minutes per small claim today
ASSISTED_MIN = 25           # minutes with AI help
COST_PER_LOOK = 23.0        # 25 min at EUR 55/h, rounded; the threshold's right-hand side
CAP = 1_000.0               # automatic-payment cap
AUDIT_SHARE = 0.02          # of automatic claims, re-checked at desk time
COMPLAINT_H, LEAVE_SHARE, CUSTOMER_VALUE = 3, 0.25, 740.0
BUILD, RUN = 900_000.0, 350_000.0
VERIFIED_H = 1.0            # hours to re-check one claim properly
TOL = 0.05


def eur(x: float) -> str:
    return f"EUR {x:,.0f}"


def pct(x: float) -> str:
    return f"{100 * x:.1f}%"


class Report:
    def __init__(self) -> None:
        self.lines: list[tuple[str, str, str, str]] = []
        self.failed = 0

    def section(self, title: str) -> None:
        self.lines.append(("", "", "", ""))
        self.lines.append((f"## {title}", "", "", ""))

    def check(self, what: str, says: float, gives: float, fmt=eur, tol: float = TOL,
              says_text: str | None = None) -> None:
        ok = abs(gives - says) <= tol * abs(says) if says else gives == 0
        self.failed += not ok
        self.lines.append((what, says_text or fmt(says), fmt(gives), "ok" if ok else "FAIL"))

    def exact(self, what: str, says: str, gives: str, ok: bool) -> None:
        self.failed += not ok
        self.lines.append((what, says, gives, "ok (exact)" if ok else "FAIL"))

    def note(self, what: str, says: str, gives: str, status: str) -> None:
        self.lines.append((what, says, gives, status))

    def render(self) -> str:
        w = [max(len(l[i]) for l in self.lines if not l[0].startswith("## ")) for i in range(4)]
        out = [f"{'':{w[0]}}  {'case says':>{w[1]}}  {'data gives':>{w[2]}}  status"]
        for a, b, c, d in self.lines:
            if a.startswith("## ") or not a:
                out.append(a)
            else:
                out.append(f"{a:{w[0]}}  {b:>{w[1]}}  {c:>{w[2]}}  {d}")
        return "\n".join(out)


def auc(scores: list[float], positive: list[bool]) -> float:
    """Area under the ROC curve, by ranks (ties averaged)."""
    order = sorted(range(len(scores)), key=lambda i: scores[i])
    ranks = [0.0] * len(scores)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and scores[order[j + 1]] == scores[order[i]]:
            j += 1
        for k in range(i, j + 1):
            ranks[order[k]] = (i + j) / 2 + 1
        i = j + 1
    n_pos = sum(positive)
    n_neg = len(positive) - n_pos
    rank_sum = sum(r for r, p in zip(ranks, positive) if p)
    return (rank_sum - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)


def value_case(n_small: int, n_auto: int) -> dict[str, float]:
    today = n_small * DESK_MIN / 60 * RATE
    assisted = (n_small - n_auto) * ASSISTED_MIN / 60 * RATE
    audit = AUDIT_SHARE * n_auto * DESK_MIN / 60 * RATE
    gross = today - assisted - audit
    net = gross - RUN
    return {"today": today, "assisted": assisted, "audit": audit, "proposed": assisted + audit,
            "gross": gross, "net": net, "payback_months": 12 * BUILD / net}


def run(path: Path) -> Report:
    with path.open(newline="") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        r["amount"] = float(r["amount_eur"])
        r["excess"] = float(r["sim_excess_eur"])
    small = [r for r in rows if r["small"] == "1"]
    n_all, n = len(rows), len(small)
    bad = lambda r: r["sim_truth"] != "valid"
    rep = Report()

    rep.section("Scale and amounts")
    rep.exact("Property claims a year", "80,000", f"{n_all:,}", n_all == 80_000)
    rep.exact("Small claims (up to EUR 2,500)", "68,000", f"{n:,}", n == 68_000)
    rep.check("All claims under EUR 500", 0.55, sum(r["amount"] < 500 for r in rows) / n_all, pct)
    rep.check("All claims EUR 500-2,500", 0.30,
              sum(500 <= r["amount"] <= 2_500 for r in rows) / n_all, pct)
    rep.check("All claims above EUR 2,500", 0.15, sum(r["amount"] > 2_500 for r in rows) / n_all, pct)
    rep.check("Small claims under the EUR 1,000 cap", 0.75,
              sum(r["amount"] <= CAP for r in small) / n, pct, says_text="about 3 in 4")
    rep.check("Median small claim", 350, statistics.median(r["amount"] for r in small))
    rep.check("Median days to settle today", 8,
              statistics.median(int(r["days_to_settle_today"]) for r in small), lambda x: f"{x:g} days")

    rep.section("What small claims turn out to be")
    for kind, share in (("valid", 0.86), ("not_covered", 0.10), ("fraud", 0.04)):
        k = sum(r["sim_truth"] == kind for r in small)
        rep.check(f"{kind.replace('_', ' ').capitalize()}", share * n, k, lambda x: f"{x:,.0f}")
    rep.check('"Pay everything" accuracy', 0.86, sum(not bad(r) for r in small) / n, pct)

    rep.section("The desk today (Part 1 baseline)")
    hours = n * DESK_MIN / 60
    rep.check("Handling hours (40 min a claim)", 45_333, hours, lambda x: f"{x:,.0f} h")
    rep.check("Handling cost (EUR 55/h)", 2_493_000, hours * RATE)
    fraud = [r for r in small if r["sim_truth"] == "fraud"]
    fraud_paid = [r for r in fraud if r["desk_decision"] == "pay"]
    rep.check("Fraudulent claims paid (half)", 1_360, len(fraud_paid), lambda x: f"{x:,.0f}")
    rep.check("Average overpaid per fraud paid", 700,
              sum(r["excess"] for r in fraud_paid) / len(fraud_paid))
    desk_fraud_cost = sum(r["excess"] for r in fraud_paid)
    rep.check("Fraud paid a year", 952_000, desk_fraud_cost)
    valid = [r for r in small if r["sim_truth"] == "valid"]
    denied = [r for r in valid if r["desk_decision"] == "deny"]
    rep.check("Valid claims wrongly denied (1%)", 585, len(denied), lambda x: f"{x:,.0f}")
    per_denial = COMPLAINT_H * RATE + LEAVE_SHARE * CUSTOMER_VALUE
    rep.check("Cost of one wrong denial", 350, per_denial)
    rep.check("Wrong denials a year", 205_000, len(denied) * per_denial)
    nc_paid = sum(r["sim_truth"] == "not_covered" and r["desk_decision"] == "pay" for r in small)
    rep.note("Uncovered claims paid by the desk", "not stated", f"{nc_paid}", "assumed 0")

    rep.section("Part 2: the rule (glass or single item, under EUR 300, no claim in 3 years)")
    rule = [r for r in small if r["rule_eligible"] == "1"]
    rep.check("Rule slice share", 0.30, len(rule) / n, pct)
    rule_bad = [r for r in rule if bad(r)]
    rep.check("Rule slice wrong", 408, len(rule_bad), lambda x: f"{x:,.0f}",
              says_text=f"408 ({pct(408 / 20_400)})")
    rep.check("Paid by the rule that should not be", 61_000, sum(r["excess"] for r in rule_bad))
    rep.check("Desk time saved on the slice", 748_000, len(rule) * DESK_MIN / 60 * RATE)

    rep.section("Part 3: the threshold  P(bad) x amount < EUR 23, cap EUR 1,000")
    rep.check("Cost of one assisted look (25 min)", COST_PER_LOOK, ASSISTED_MIN / 60 * RATE)
    for amount, says in ((150, 0.15), (400, 0.06), (1_000, 0.02)):
        rep.check(f"Score cut-off for a EUR {amount:,} claim", says, COST_PER_LOOK / amount,
                  lambda x: f"{x:.3f}", tol=0.20)
    model = [r for r in small if r["rule_eligible"] == "0" and r["amount"] <= CAP
             and float(r["model_score"]) * r["amount"] < COST_PER_LOOK]
    auto = rule + model
    rep.check("Automatic by the model (further 20%)", 0.20, len(model) / n, pct)
    rep.check("Automatic in total (50%)", 34_000, len(auto), lambda x: f"{x:,.0f}")
    rep.exact("Largest automatic payment", "<= EUR 1,000", eur(max(r["amount"] for r in auto)),
              max(r["amount"] for r in auto) <= CAP)
    verified = [r for r in small if r["verified_set"] == "1"]
    rep.check("Verified set", 3_000, len(verified), lambda x: f"{x:,.0f}")
    rep.check("Verified set cost (1 h a claim)", 165_000, len(verified) * VERIFIED_H * RATE)

    rep.section("Part 7: the value case, from the data's automatic share")
    vc = value_case(n, len(auto))
    rep.check("Assisted handling (25 min)", 779_000, vc["assisted"])
    rep.check("Audit of 2% of automatic claims", 25_000, vc["audit"])
    rep.check("Proposed handling, total", 804_000, vc["proposed"])
    rep.check("Gross saving", 1_689_000, vc["gross"])
    rep.check("Net (after EUR 350,000 a year to run)", 1_339_000, vc["net"])
    rep.check("Payback on EUR 900,000", 8, vc["payback_months"], lambda x: f"{x:.1f} months", tol=0.10)
    sens = value_case(n, round(0.35 * n))
    rep.check("If 35% automatic: assisted", 1_013_000, sens["assisted"])
    rep.check("If 35% automatic: audit", 17_000, sens["audit"])
    rep.check("If 35% automatic: saving", 1_463_000, sens["gross"])
    rep.check("If 35% automatic: net", 1_113_000, sens["net"])
    rep.check("If 35% automatic: payback", 10, sens["payback_months"], lambda x: f"{x:.1f} months",
              tol=0.10)
    rep.exact("Stage 1 gate: saving above EUR 1M at 35%", "go", "go" if sens["gross"] > 1e6 else "stop",
              sens["gross"] > 1e6)
    breaker = 0.25 * desk_fraud_cost
    rep.check("Breaker: fraud paid up a quarter", 238_000, breaker)
    rep.check("Net after the breaker", 1_100_000, vc["net"] - breaker)
    for what, value in (("Hourly rate", "EUR 55"), ("Minutes per claim today / assisted", "40 / 25"),
                        ("Build, once", "EUR 900,000"), ("Run, a year", "EUR 350,000"),
                        ("Complaint hours, leavers, customer value", "3 h, 25%, EUR 740")):
        rep.note(what, value, "-", "assumed")

    # What the data shows that the arithmetic cannot. Information, not checks.
    rep.section("What the data shows that the arithmetic cannot (information)")
    ft_fraud = sum(r["excess"] for r in auto if r["sim_truth"] == "fraud")
    ft_nc = sum(r["excess"] for r in auto if r["sim_truth"] == "not_covered")
    desk_on_slice = sum(r["excess"] for r in auto if r["sim_truth"] == "fraud" and r["desk_decision"] == "pay")
    denials_avoided = sum(1 for r in auto if r["sim_truth"] == "valid" and r["desk_decision"] == "deny")
    change = ft_fraud + ft_nc - desk_on_slice - denials_avoided * per_denial
    rep.note("Automatic slice: wrong claims paid", "-", f"{sum(bad(r) for r in auto):,} of {len(auto):,}",
             pct(sum(bad(r) for r in auto) / len(auto)))
    rep.note("Automatic slice: fraud + uncovered paid", "-", eur(ft_fraud + ft_nc),
             "before the 2% audit")
    rep.note("Same claims at the desk today: fraud paid", "-", eur(desk_on_slice), "")
    rep.note("Wrong denials the fast track avoids", "-",
             f"{denials_avoided} = {eur(denials_avoided * per_denial)}", "")
    rep.note("Net change in error cost", "kept flat", eur(change),
             f"vs breaker {eur(breaker)}; net {eur(vc['net'] - change)}")
    recorded_fraud = sum(r["label_recorded"] == "fraud" for r in small)
    rep.note("Fraud share: recorded labels vs truth", "4%",
             f"{pct(recorded_fraud / n)} recorded", "labels see only what the fraud desk looked at")
    vfraud = sum(r["verified_label"] == "fraud" for r in verified)
    rep.note("Fraud share on the verified set", "4%", pct(vfraud / len(verified)), "the set sees the truth")
    referral = [float(r["fraud_referral"]) for r in small]
    rep.note("AUC, fraud_referral -> recorded fraud label", "-",
             f"{auc(referral, [r['label_recorded'] == 'fraud' for r in small]):.2f}",
             "looks brilliant: the field is set after triage (leakage)")
    rep.note("AUC, fraud_referral -> true fraud", "-",
             f"{auc(referral, [r['sim_truth'] == 'fraud' for r in small]):.2f}",
             "and it misses the fraud nobody looked at")
    rep.note("AUC, model_score -> not genuine or not covered", "-",
             f"{auc([float(r['model_score']) for r in small], [bad(r) for r in small]):.2f}", "")
    for lang in ("nl", "fr", "en"):
        group = [r for r in small if r["description_language"] == lang]
        ref = sum(r["fraud_referral"] == "1" and r["sim_truth"] == "valid" for r in group)
        true_fraud = sum(r["sim_truth"] == "fraud" for r in group) / len(group)
        rep.note(f"Language {lang}: valid claims referred / true fraud", "-",
                 f"{pct(ref / len(group))} / {pct(true_fraud)}", "Part 6 fairness check")
    return rep


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    path = Path(argv[0]) if argv else HERE / "claims.csv"
    if not path.exists():
        print(f"{path} not found; run case/generate.py first", file=sys.stderr)
        return 2
    rep = run(path)
    print(f"Checked: {path.name}")
    print(rep.render())
    print()
    print(f"{rep.failed} check(s) failed" if rep.failed else "All checks hold.")
    return 1 if rep.failed else 0


if __name__ == "__main__":
    sys.exit(main())
