---
title: "Loop 1 — Is review our bottleneck?"
summary: "An engineering lead measures the queue in front of human review on their own repositories in about an hour, takes a one-page readout to their sponsor, and proposes one experiment."
status: draft
date: 2026-10-17
---

# Loop 1 — Is review our bottleneck?

Many organizations that adopt coding agents produce more code, and the time to merge it grows. One
study across 718 firms found time from pull request to merge up 49% with no measurable rise in
finished work (Chen & Stratton, 2026, working paper). This loop checks whether that is happening in
**your** teams, with your own data, and turns the answer into a decision.

| Step | Who | Time | Output |
|---|---|---|---|
| 1. Measure | Engineering lead | ~1 hour | `measure-<date>.md`, `.json` |
| 2. Write the readout | Engineering lead | ~30 min | `readout-<date>.md`, one page |
| 3. Propose one experiment | Lead, with the sponsor | one meeting | a filled-in [experiment card](../templates/experiment-card.md) |
| 4. Run it, measure again | The teams in it | 4–8 weeks | the same report, for the experiment period |

## 1. Measure

**You need:** Node 20 or later, read access to the repositories, and a token.

- **Token:** a GitHub fine-grained personal access token with **read-only** access to the
  repositories: *Metadata*, *Pull requests* and *Contents*, all read. Set it as `WHOSIGNS_TOKEN`.
  If you use the GitHub CLI and are logged in, `whosigns` uses `gh auth token` instead.
- **Config:** copy [`whosigns.example.yml`](../whosigns.example.yml) to `whosigns.yml`, list the
  repositories, and group them into teams.
- **Periods:** a quarter before broad AI use, and a recent quarter.

```
npx @fps4/copilot-to-capability-kit measure --baseline 2025-01-01..2025-03-31 --current 2026-07-01..2026-09-30
```

*(Until the package is published: clone this repository, `npm install && npm run build`, then
`node dist/src/cli.js measure …`.)*

**What stays where.** The tool reads your git host with your token and writes three files in
`report/`. Nothing else leaves your machine: no service, no telemetry. No file names or ranks a person.
Any figure covering fewer than five distinct human authors is not shown. In the Netherlands, check
with your works council before measuring teams, even at team level.

**What to look at first.**

- *Pickup time*: how long a ready pull request waits for its first human review.
- *Average waiting*: how many pull requests are waiting for a first human review at any moment. This
  is the queue. If arrivals grow and reviewers do not, it grows.
- *Waiting at period end*: what is in the queue now, and for how long.
- *PR size* and *share over threshold*: large changes are slow to review and weakly reviewed.
- *Merged without human approval*: changes nobody but their authors, bots or agents looked at.

## 2. Write the readout

`readout-<date>.md` is pre-filled with the numbers. Write the three sections marked *[Fill in]* in
your own words: what the waiting costs in your setting, the one change you propose, and who has to say
yes. If you want help, [`templates/readout-assistant.md`](../templates/readout-assistant.md) has
instructions for any approved assistant; paste it with the JSON, which names no person.

## 3. Propose one experiment

One change, tested on a few teams with others as comparison. Some that fit this loop:

| If the report shows | An experiment to consider |
|---|---|
| A growing queue, pickup time up | A limit on agent-written pull requests waiting for human review, per reviewer. When the limit is reached, agents stop opening new ones until reviews catch up |
| Larger pull requests | A hard size limit before a pull request can be opened or merged, enforced in tooling |
| More merges without human approval | Require one approving review from a human who did not write or co-author the change, on the repositories where it matters most |
| Little change at all | Ask the teams why. Unmarked AI use is invisible here; the survey may tell you more than the logs |

These are options, not recommendations. The [experiment card](../templates/experiment-card.md) makes
you decide, before you start, what result would make you stop and what would count as success.

## 4. Run it and measure again

Run `whosigns measure` with the experiment period as `--current` and the period before it as
`--baseline`, for the teams in it and the teams for comparison. Then decide: keep, change and run
again, or stop. Record who decided.

## What this loop does not tell you

- **Cause.** The report shows association. Other things changed too.
- **All AI use.** Only marked use is visible: agent accounts, `Co-authored-by` or `Assisted-by`
  trailers, labels, branch prefixes.
- **Delivery outcomes.** Deployments, lead time and change failure rate are not measured yet.
- **Anything about a person.** That is by design (ADR-0002), and the report must not be used to.
