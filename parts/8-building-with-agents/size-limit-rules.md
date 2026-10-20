---
item: 11
title: Size-limit and required-check rules
part: 8 · Building it with agents
episodes: [8.4]
forms: [PDF (this page), JSON (ruleset templates — to build)]
version: blank
companion: kit docs/spec.md §7 (whosigns gate, G1–G5; ruleset templates) — specified, not built
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com · the workflow snippet is MIT
status: Draft v0.1 · 2026-10-20
sources: "Cohen / SmartBear 2006 (Cisco case study) · Kemerer & Paulk 2009 · LinearB 2026 Software Engineering Benchmarks · Google DORA, ROI of AI-assisted Software Development 2026"
---

# Keep changes small, and check them before review

*One page for the engineering lead. Two settings: a hard limit on the size of a change, and the checks
a change must pass before a person is asked to review it. Both enforced in tooling, not in a
guideline.*

## Why

- The largest published case study of peer code review, 2,500 reviews at Cisco, found that beyond
  **400 lines** the ability to find defects diminishes (SmartBear, vendor-run). A peer-reviewed study
  on separate data found reviewing at **200 lines an hour or less** effective (Kemerer & Paulk, 2009).
- In LinearB's 2026 benchmarks, the top quarter of AI-assisted pull requests is **408 lines or more**,
  against 157 for unassisted ones (vendor data, 8.1 million pull requests).
- So a quarter of AI-assisted changes are now above the size where review was found to get weaker.
  That is a synthesis of two published facts, not either source's finding.

A change nobody could realistically review has no accountable owner, whatever the approval record
says. **The size limit is a governance control, not only a flow metric.**

## The rules

| Rule | Setting | Why |
|---|---|---|
| **Size limit** | At most **400 lines** changed (added + deleted), not counting lockfiles and generated files. Larger work is split | Review is the check; keep it a check |
| **Exceptions** | Only a person who did not write the change may allow a larger one, and the exception is recorded | An author cannot waive their own limit |
| **Checks before review** | Tests that encode the brief's acceptance criteria · static analysis with agreed thresholds · a coverage floor. A person is asked to review only after they pass | The agent's definition of done becomes *passing the brief's tests*, not *code that runs* |
| **Approval** | At least one approval by a person who is not an author or co-author, on the latest version of the change; approvals are dismissed when new commits arrive; agent and bot accounts never count | Separation of duties survives the agent |
| **Context before writing** | The brief, its constraints and the decision history are handed to the agent before it starts | Fewer guesses, smaller fixes |

DORA's 2026 report lists the same kind of controls: *"nonoptional checkpoints and pre-commit hooks
paired with static analysis"*, and a shift *"from manual checkpoints to automated nonoptional security
and quality gates"*.

## Setting it today on GitHub

GitHub has no built-in size limit, so the limit is a check that runs on every pull request, and a
ruleset makes the check required.

**1. The size check** — `.github/workflows/size.yml`. It counts every line, lockfiles included; the
`whosigns gate` check (specified, not built) will exclude generated files and allow recorded
exceptions.

```yaml
name: size
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
permissions: {}
jobs:
  size:
    runs-on: ubuntu-latest
    steps:
      - name: Check the size of the change
        env:
          ADDED: ${{ github.event.pull_request.additions }}
          DELETED: ${{ github.event.pull_request.deletions }}
          LIMIT: "400"
        run: |
          total=$((ADDED + DELETED))
          echo "Lines changed: $total (limit $LIMIT)"
          if [ "$total" -gt "$LIMIT" ]; then
            echo "::error::$total lines changed; the limit is $LIMIT. Split this into smaller changes."
            exit 1
          fi
```

**2. The ruleset** — repository or organization *Settings → Rules → Rulesets*, on the default branch:

- Require a pull request before merging, with **1** required approval.
- Dismiss stale pull request approvals when new commits are pushed.
- Require approval of the most recent reviewable push.
- Require status checks to pass: `size`, your test job, your static-analysis job.
- Block force pushes and deletion.
- Keep the bypass list short and named. Anyone on it can skip every rule above.

**Other git hosts.** GitLab and Bitbucket have merge-request approval rules, including preventing
approval by the author and by people who added commits; check your version's documentation. The size
check is a pipeline job on any host.

## How you will know it worked

- The share of changes above the limit falls towards zero.
- Time waiting for review falls.
- Change failure rate does not rise as AI use grows.

Measure all three per team, before and after, with `whosigns measure` (kit) — never per person.

## Not covered here

- **Who may approve what beyond code** — see the *"Who signs" decision matrix*.
- **Tying a change to the approved brief version** — `whosigns gate` rule G2, specified, not built.
