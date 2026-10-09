---
title: "0002: Measure reports teams, never individuals"
summary: "Every metric is aggregated per team and suppressed below a minimum group size (default 5 authors). There is no per-person output, export or debug mode. Evidence records name approvers, because an audit record must, and nothing else."
status: proposed
date: 2026-10-07
related:
  - ./0001-git-native-no-service.md
---

## Context

The fastest way to destroy the value of delivery measurement is to turn it into a scoreboard of
people. It changes behaviour (smaller, safer, meaningless PRs), it destroys trust in the survey
half, and it is the use the paper argues against: the problem is in the system, not the individual.

There is also a legal edge. Under the EU AI Act, AI systems used to monitor or evaluate the
performance and behaviour of workers are high-risk (Annex III point 4(b)). The kit is not an AI
system, but readers will combine its output with agent telemetry, and a per-developer table is
exactly the artifact that drifts into that use. In the Netherlands, works councils (OR) have a say in
systems that monitor staff performance.

## Decision

**Aggregates only.** Metrics are grouped by team (CODEOWNERS, GitHub teams, or an explicit map).

**Suppression.** Any aggregate covering fewer than `min_group_size` distinct authors (default 5) is
replaced by `—(n<5)`. The AI-assisted vs unassisted split is shown only when both groups qualify.

**No escape hatch.** No flag, log level or debug output prints logins, names or emails from Measure.
A test scans every output file for every login present in the input.

**Evidence is different, deliberately.** An approval record names the approver: that is its purpose
(EU DORA RTS 2024/1774 Art. 17(1)(b) asks for independent approval to be evidenced). Authors are
recorded by kind (human or agent) unless the user opts in to names.

## Consequences

- Small teams get little from Measure until they lower the threshold, which they can do knowingly in
  their own config — the default protects people who did not choose.
- The kit cannot answer "which developer uses AI most". That is intended.
