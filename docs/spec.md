---
title: whosigns — specification (AI Product Design kit)
status: draft
date: 2026-10-07
related:
  - ./decisions/0001-git-native-no-service.md
  - ./decisions/0002-teams-never-individuals.md
  - ./decisions/0003-the-approved-object-is-a-spec-version-in-git.md
  - ./decisions/0004-interoperate-with-spec-formats-and-maestro.md
---

# whosigns — specification

## 1. Why

Part 8 of the storyline *AI Product Design* — *Building it with agents, from personal copilot to
organizational capability*, the paper's four Part 8 moves — argues four things an engineering
organization can act on:

1. AI raised individual output; delivery as a system did not keep up, and instability rose. **Measure
   it on your own estate before you argue about it.**
2. The cost of a vague requirement moved from a question to a confident wrong build. **Make the brief
   precise, and check it mechanically.**
3. Review of large AI-written diffs is weak evidence. **Limit change size, and put the checks in the
   path, not in a queue.**
4. The human decision belongs on something reviewable. **Approve the spec version; gate the code
   against it; keep the record.**

Readers agree with this and then ask *"how do I start on Monday?"* The kit is that answer, in a form
an engineering lead can adopt without a budget, a vendor or a platform team.

## 2. Who it is for

| User | Uses | Needs |
|---|---|---|
| **Engineering lead** | Measure, Gate | A before/after picture of their own teams in an afternoon; controls enforced in tooling, not guidelines |
| **Product Owner / analyst** | Brief | A template and a checker that tells them, in plain words, what an agent would have to guess |
| **Architecture / delivery lead** | Gate, Evidence | Size and approval rules as code across repositories; an answer to *"who approved which version, and what was built against it?"* |
| **Risk / audit (reader, not user)** | Evidence | A per-release record mapped to the change-management obligations they already audit |
| **Coding agents** | Brief (agent instructions) | A rule to stop and ask when a domain fact is missing |

## 3. Invariants

These hold in every part and every release. A change that breaks one is rejected at review.

| # | Invariant | Why |
|---|---|---|
| I-1 | **Nothing leaves the organization.** The kit runs in the user's CI or on their laptop, reads their git host with their token, and writes files. No telemetry, no hosted service | ADR-0001 |
| I-2 | **No output identifies an individual.** Aggregates are per team; a group smaller than `min_group_size` (default 5 authors) is suppressed. No per-person table, export or debug mode | ADR-0002; AI Act Annex III 4(b) |
| I-3 | **Deterministic checks only.** No model call in `lint`, `gate` or `evidence` | A gate must be explainable and repeatable |
| I-4 | **Only humans approve.** An account that is a bot, a GitHub App, or listed in `agents:` never satisfies an approval requirement. The kit never approves anything itself | Paper Part 8, *approve the spec, gate the code*, rule 1 |
| I-5 | **Unknown is reported as unknown.** If a metric's source is not configured or not available, the report says so; it never estimates or substitutes | Paper, *What this does not claim* |
| I-6 | **Each part works alone.** Measure needs no brief; Brief needs no gate; Gate works without Evidence | Adoption in any order |
| I-7 | **Read-only by default.** `measure`, `lint` and `evidence` need read scopes only. `gate` writes only a check run and, optionally, one PR comment | Least privilege |

## 4. Scope

**In (v1):** GitHub (cloud and Enterprise Server) · TypeScript CLI `whosigns` on Node 20 or later, and a GitHub Action ·
Markdown + JSON outputs · repository and organization ruleset templates.

**Out (v1):** GitLab and Bitbucket (designed for — adapters later) · a dashboard or web UI · storing
history anywhere except files the user keeps · scoring or ranking people · LLM-based review · being a
metrics platform (LinearB, Faros, DX exist) · being a spec authoring tool (spec-kit, OpenSpec exist).

---

## 5. Part 1 — Measure

### 5.1 What it does

`whosigns measure` reads pull requests, reviews, commits and deployments for a set of repositories over two
periods and writes a team-level before/after report.

```
whosigns measure --config whosigns.yml --baseline 2025-01-01..2025-03-31 --current 2026-07-01..2026-09-30
  → report/measure-2026-10-07.md
  → report/measure-2026-10-07.json
  → report/readout-2026-10-07.md     the one-page readout for the sponsor (Loop 1)
```

### 5.2 Configuration (`whosigns.yml`, `measure:` block)

| Key | Meaning | Default |
|---|---|---|
| `repos` | list or `org:<name>` with include/exclude globs | — (required) |
| `teams` | `repo` (each repository is a team), an explicit `map` of repo → team with an optional `default`, and later `codeowners` (map by CODEOWNERS of touched paths) or `github-teams` | `repo` — changed from `codeowners` on 2026-10-17: an explicit map needs no extra API calls or scopes, and CODEOWNERS is open question 3 |
| `min_group_size` | suppress any aggregate with fewer distinct authors | `5` |
| `size.threshold_lines` | the "too large to review" line | `400` |
| `size.exclude` | globs not counted (lockfiles, generated code, snapshots) | common lockfiles |
| `ai_assisted.markers` | how a PR is classified AI-assisted: commit trailers (`Co-authored-by:` matching listed agents, `Assisted-by:`), PR labels, author is an agent account | listed defaults, all editable |
| `agents` | accounts and trailer names that are agents | common coding agents |
| `deployments.source` | `deployments-api`, `workflow:<name>`, `releases`, or `none` | `none` |
| `failures.source` | `label:<name>` on PRs/issues within `window_days` after a deploy, `revert-commits`, or `none` | `none` |
| `lookback_days` | how far before the baseline to read PRs, so PRs opened earlier and merged inside it count | `90` |
| `github.api_url` | GraphQL endpoint, for GitHub Enterprise Server | `https://api.github.com/graphql` |

### 5.3 Metrics

All per team, per period, with the delta. Time metrics report p50 / p75 / p90.

| Metric | Definition (printed in the report) | Paper move |
|---|---|---|
| PR size | lines added + deleted, excluding `size.exclude` | 7 |
| Share over threshold | % of merged PRs above `size.threshold_lines` | 7 |
| Pickup time | ready-for-review (or creation) → first review event by a human non-author | 7 |
| Review elapsed | first human review → merge. **Elapsed time, not effort** | 7 |
| Merged without human approval | % of merged PRs with no approving review by a human who is not an author or co-author | 7, 8 |
| Reviewed only by bots | % of merged PRs whose only reviews are from bots/agents | 7 |
| AI-assisted share | % of merged PRs matching `ai_assisted.markers` — **with the markers used, and a note that unmarked AI use is invisible** | 9 |
| All of the above, split AI-assisted vs not | only when both groups meet `min_group_size` | 7 |
| Deployment frequency | deployments per week from `deployments.source` | 9 |
| Lead time | first commit of a PR → first deployment containing its merge commit | 9 |
| Change failure rate | deployments followed by a failure signal within `window_days` ÷ deployments | 9 |
| Rework (optional) | share of lines changed that modify lines < 21 days old | 9 |
| Waiting at period end | ready PRs with no review yet by a human non-author, still open at the end of the period, with how long they had waited | 7, 9 |
| Average waiting | the time-weighted average number of PRs waiting for a first human review during the period: the queue in front of review (added 2026-10-17 for Loop 1) | 7, 9 |

### 5.4 The report

- **Header, always:** periods, repos, teams, `min_group_size`, every definition above, which sources
  were `none`, and three caveats: *association, not cause* · *AI-assisted detection sees only marked
  use* · *both logs and surveys are biased — read with the survey* (DORA measurement guidance).
- **Body:** one table per team; suppressed cells shown as `—(n<5)`; unknown shown as `unknown
  (source not configured)`.
- **Footer:** "questions to ask your team" — three prompts generated from the largest deltas, never
  conclusions.
- **Readout (added 2026-10-17):** a separate one-page Markdown file for the sponsor, pre-filled with the
  whole-organization figures, with *[Fill in]* sections for the cost, the one change proposed and who
  has to say yes. `parts/8-building-with-agents/readout-assistant.md` holds tool-neutral instructions for drafting it
  from the JSON, which names no person. See [`loop-1.md`](./loop-1.md).

### 5.5 The survey

`parts/8-building-with-agents/team-pulse-survey.md`: eight questions, anonymous, aggregated per team (same `min_group_size`):
perceived speed; time spent reviewing AI-written code; confidence that reviews catch problems in AI
code; trust in AI output; how often agents build the wrong thing from a brief; how often you had to
redo agent work; whether size limits would help; one open question. Ships as Markdown and as an import
file for common form tools. `whosigns measure --survey results.csv` places the aggregates beside the log
metrics.

### 5.6 Acceptance

- A-1.1 Given a config with three repositories and `deployments.source: none`, the report contains
  every PR metric and states *"Deployment frequency: unknown (source not configured)"*.
- A-1.2 Given a team with four distinct authors in a period, every cell for that team-period shows
  `—(n<5)`.
- A-1.3 Given a PR approved only by `copilot-pull-request-reviewer[bot]`, it counts as *merged without
  human approval* and *reviewed only by bots*.
- A-1.4 Given a PR whose sole approver is also a `Co-authored-by` on one of its commits, it counts as
  *merged without human approval*.
- A-1.5 No file written by `measure` contains a GitHub login, name or email. (Tested by scanning the
  output for every login seen in the input.)
- A-1.6 Two runs on the same data produce byte-identical JSON.

---

## 6. Part 2 — Brief

### 6.1 The template (`parts/8-building-with-agents/brief-template.md`)

Markdown with YAML front-matter. The four parts of the paper, broken into the fields the checks need.

```yaml
---
id: export-orders-csv
title: Export orders as CSV for finance
status: draft            # draft | proposed | approved — approval is set by git, see Part 4
user:
  who: Finance controller
  situation: month-end close, needs all orders of the period in one file
constraint:
  scale: up to 4M orders per month; export completes in < 10 min      # or "n/a: <reason>"
  timing: available by 08:00 on the 1st working day
  integrations:
    - system: ERP order service
      contract: https://…/openapi.yaml#/orders     # required for every named system
  data: [personal]                                 # none | personal | special | financial | regulated
  compliance: AVG — no customer names in the file; access logged
  invariants:
    - an order appears exactly once per export      # required when money, identity or ordering is involved
acceptance:
  - GIVEN a closed period WHEN finance runs the export THEN every order appears once
  - GIVEN the ERP is unavailable WHEN the export runs THEN it fails visibly and nothing partial is sent
metric:
  measure: hours spent by finance on month-end reconciliation
  baseline: 6h
  target: 2h
rollback: disable the export flag; previous manual process remains
open_questions: []
---

Free text: context, background, links. The checks read the front-matter, not this body.
```

### 6.2 The linter (`whosigns lint <path…>`)

Six deterministic rules, one per failure in the six-failure table of the paper's Part 8
(*make the brief precise enough to build from*). Each finding has an id, the field, a
plain-language message for the author, and what an agent would otherwise do.

| Rule | Fails when | Message (example) |
|---|---|---|
| `B1 unstated-scale` | `constraint.scale` absent, or present without a number or a stated `n/a: reason` | *"No volume or timing. An agent will build for whatever data it sees in testing — often 1,000 rows."* |
| `B2 implied-integration` | a system is named in `constraint.integrations` (or matched in `title`/`acceptance` against a configured system list) without `contract` | *"ERP order service is named but its interface is not. An agent will invent a plausible one."* |
| `B3 absent-error-case` | no acceptance criterion whose WHEN/THEN describes failure, unavailability, invalid input or timeout | *"Only the happy path is described. An agent will swallow failures silently."* |
| `B4 unstated-invariant` | `data` includes `financial`, or acceptance/title mentions payment, order, account, identity, sequence — and `invariants` is empty | *"Money/ordering is involved but nothing says what must stay true. Expect duplicates."* |
| `B5 metric-free` | `metric` absent, or missing `measure`, or neither `baseline`+`target` nor a stated method | *"Something will ship and nobody will be able to say whether it helped."* |
| `B6 buried-compliance` | `data` includes `personal`, `special` or `regulated` and `compliance` is empty | *"Personal data is involved and no rule about it is stated. An agent may log it in plain text."* |

- Keyword lists and the system list are configuration (`lint:` block), in English and Dutch by default.
- Output: human-readable text, and JSON findings in the shape maestro specs-service's evaluator
  `endpoint` adapter accepts (ADR-0004), so the same rules can gate a brief there.
- Exit code: `0` clean, `1` findings, `2` invalid file. `--warn` reports without failing.
- **Not** checked: whether the content is *right*. The linter finds what is missing, not what is wrong.

### 6.3 Agent instructions (snippet in `parts/8-building-with-agents/six-failure-checklist.md`)

A short block to paste into `AGENTS.md` / `CLAUDE.md` / Copilot instructions:

> Work only from a brief in `briefs/` whose status is `approved`. Do not invent domain facts —
> volumes, interfaces, thresholds, invariants, data rules. If one is missing, stop, add it to
> `open_questions` in the brief, and say so in the PR. Reference the brief in every PR as
> `Spec: briefs/<file>@<blob-sha>`. Keep each PR under the size limit; split work instead.

### 6.4 Acceptance

- A-2.1 The example brief above passes all six rules.
- A-2.2 Removing `constraint.integrations[0].contract` produces exactly one finding, `B2`, naming the system.
- A-2.3 A brief with `data: [personal]` and empty `compliance` produces `B6`.
- A-2.4 Every rule has a passing and a failing fixture, and the message text is covered by a snapshot.
- A-2.5 `whosigns lint --format maestro` output validates against the specs-service evaluator schema.

---

## 7. Part 3 — Gate

### 7.1 The Action (`fps4/ai-product-design-kit/whosigns/gate@v1`)

Runs on `pull_request` (opened, synchronize, ready_for_review, labeled) and `pull_request_review`
(submitted, dismissed). Publishes one required check, `whosigns/gate`, with a summary of every rule.

| Rule | Passes when | Configurable |
|---|---|---|
| `G1 size` | lines changed (excluding `size.exclude`) ≤ `size.limit` | limit (default 400); an `oversize-approved` label counts only if applied by a human who is not an author |
| `G2 spec-reference` | the PR body or a commit trailer contains `Spec: <path>@<blob-sha>`, the file exists at that blob, and that blob is an **approved version** (Part 4 definition) | which paths require a spec (default all except `docs/**`, dependency bumps) |
| `G3 human-approval` | at least `approvals` approving reviews (default 1) on the **current head**, each by an account that is a human (not bot, not App, not in `agents`) and is **not** the PR author, a commit author, or a `Co-authored-by` on any commit | approvals count |
| `G4 agent-authored` | if the author or any co-author is an agent, G3 also requires the approver to be a CODEOWNER of a touched path | on/off |
| `G5 brief-lint` (optional) | the referenced brief has no `lint` findings | on/off |

- Results are explained in plain words in the check summary, e.g. *"G3: the only approval is from
  @alice, who is a co-author of commit 3f2a1c. Someone who did not write this change must approve."*
- The Action cannot stop a merge by itself. **Rulesets do.** The kit ships the rulesets that make
  `whosigns/gate` required.

### 7.2 Ruleset templates (`rulesets/`)

JSON for `gh api` / organization rulesets: require pull request · 1 approval · dismiss stale approvals
on push · require approval of the most recent push · require status check `whosigns/gate` · block force
push and deletion · optional code-owner review. A short guide explains bypass actors and why each one
should be named and few — the kit can detect a bypass after the fact (Part 4) but not prevent it.

### 7.3 Acceptance

- A-3.1 A 520-line PR fails `G1`; adding `oversize-approved` by the author does not change the result; by
  a non-author human it passes.
- A-3.2 A PR referencing `briefs/x.md@<sha>` where that blob was never approved fails `G2` and names the
  approved versions that do exist.
- A-3.3 A PR approved only by a bot fails `G3`. A PR approved by a co-author fails `G3`.
- A-3.4 After a new push, a previous approval no longer satisfies `G3`.
- A-3.5 The Action needs only `checks: write`, `pull-requests: read`, `contents: read`.

---

## 8. Part 4 — Evidence

### 8.1 The approved object

A spec is approved **in git, by a pull request that changes only brief files** (ADR-0003):

- the PR touches only paths under `briefs/` (configurable);
- it is merged with at least one approving review, on the head, by a human who is not an author or
  co-author of the brief change;
- the **approved version** is the brief file's **git blob SHA** at the merge commit. Blob SHAs are
  content hashes, so the approved bytes cannot change without a new SHA.

A brief changed later is a new version that needs a new approval. Code PRs reference a blob SHA, so they
are tied to exactly the version that was approved.

### 8.2 Records

`whosigns evidence` writes JSON (and a Markdown summary) for a range — typically one release:

```json
{
  "release": { "tag": "v2.4.0", "commit": "9c1e…", "deployed_at": "2026-10-03T09:12:00Z" },
  "spec_approvals": [{
    "path": "briefs/export-orders-csv.md", "blob": "b7d0…",
    "pr": 812, "merge_commit": "51aa…", "merged_at": "2026-09-28T14:02:00Z",
    "authors": [{ "kind": "human" }, { "kind": "agent", "name": "claude" }],
    "approvers": [{ "kind": "human", "login": "…" }],
    "independent": true, "lint_findings": []
  }],
  "changes": [{
    "pr": 830, "merge_commit": "77f3…", "spec_refs": ["briefs/export-orders-csv.md@b7d0…"],
    "lines_changed": 214, "authors": [{ "kind": "agent" }, { "kind": "human" }],
    "approvers": [{ "kind": "human", "login": "…" }],
    "gate": { "G1": "pass", "G2": "pass", "G3": "pass" }, "checks": { "ci": "success", "sast": "success" }
  }],
  "exceptions": [{ "pr": 841, "reason": "merged with whosigns/gate failing" }]
}
```

- **Named approvers are intended here** (unlike Measure): an audit record must say who approved.
  Authors are recorded by kind only by default (`--authors names` to include them).
- `exceptions` lists everything that does not meet the rules: merged with the gate failing or missing,
  no spec reference, emergency changes awaiting after-the-fact approval, and admin bypasses where the
  ruleset API exposes them.
- Optional: attach the JSON to the GitHub release and sign it with an artifact attestation.

### 8.3 Emergency changes

A PR labelled `emergency` (by a human) may merge with `G2` failing. It appears in `exceptions` until a
brief describing it is approved within `emergency.review_days` (default 5), after which the evidence
shows the after-the-fact approval — mirroring RTS 2024/1774 Art. 17(1)(f)–(h).

### 8.4 Mapping to EU DORA RTS 2024/1774, Art. 17(1) — `docs/regulatory-mapping.md`

| Art. 17(1) | Requirement (summary) | What the kit provides | What it does not |
|---|---|---|---|
| (a) | verification that ICT security requirements are met | CI and security-scan check results per change, in `changes[].checks` | the scans themselves |
| (b) | independence of approval from request and implementation | approver ≠ author/co-author, agents never approve — for both the spec and the code; `independent: true/false` recorded | organizational independence above the repository |
| (c) | roles and responsibilities; changes specified, planned, tested, QA'd in a controlled manner | the brief (specified), rulesets and CODEOWNERS snapshot (roles), required checks (controlled testing) | test adequacy |
| (d) | documentation: purpose, scope, timeline, expected outcomes | brief `user`, `constraint`, `metric`; PR and release timestamps | — |
| (e) | fall-back procedures | brief `rollback` field | testing the rollback |
| (f)–(h) | emergency changes, post-hoc approval, impact on security measures | `emergency` path and `exceptions` | impact assessment |

States plainly: **not legal advice; evidence for the controls in the repository only; as strong as the
repository's admin controls.**

### 8.5 Acceptance

- A-4.1 A brief approved in PR #812 and referenced by PR #830 appears as one approval and one change
  linked by blob SHA.
- A-4.2 A code PR merged while `whosigns/gate` was failing appears in `exceptions`.
- A-4.3 A brief PR approved only by its co-author has `independent: false` and appears in `exceptions`.
- A-4.4 An `emergency` PR with no approved brief after 5 days appears in `exceptions` with the age.
- A-4.5 Running `whosigns evidence` twice for the same range produces identical JSON.

---

## 9. Packaging

- One npm package `@fps4/whosigns` (folder `whosigns/`) exposing `whosigns`; one composite/JS Action in the same
  repository; templates and rulesets as plain files.
- `whosigns init` writes `whosigns.yml`, `briefs/_template.md`, the agent-instructions snippet and a workflow file —
  nothing else.
- A demo repository with seeded history (good and bad PRs, a brief, an emergency change) so a reader
  can see every report without pointing the kit at their own code.

## 10. Milestones

Time-boxed: a milestone is built when the part of the storyline that uses it needs it.

| | Delivers | Gate to move on |
|---|---|---|
| **M0a — Measure, Loop 1 slice** (built 2026-10-17) | `whosigns measure`: PR metrics, the review queue, `repo` and `map` teams, suppression, Markdown + JSON report, readout; experiment card; A-1.1–A-1.6 as tests. **Not yet:** deployments, lead time, change failure rate, rework, the survey, `codeowners`/`github-teams` teams | Run on four fps4 repositories reads correctly (done, at `min_group_size: 1`); one peer reviewer runs it on their own repos |
| **M0 — Measure + Brief** (~1–2 days) | `whosigns measure` (PR metrics, team aggregation, suppression, report), survey template, brief template, `whosigns lint`, agent snippet | A-1.x and A-2.x pass; a report run on the fps4 repositories reads correctly; one peer reviewer runs `measure` on their own repos |
| **M1 — Gate** | Action with G1–G4, ruleset templates, demo repository | A-3.x pass; gate running on maestro and the kit itself |
| **M2 — Evidence** | `whosigns evidence`, emergency path, regulatory mapping | A-4.x pass; one regulated-sector reader reviews the mapping |
| Later | GitLab adapter · deployments from more sources · OpenSpec / spec-kit import (ADR-0004) | demand from a real user |

## 11. Open questions

1. **AI-assisted detection** depends on markers teams may not use. Is "marked use only" good enough for
   M0, or do we need a convention (an `Assisted-by:` trailer) promoted in the agent snippet?
2. **Deployments** are the weakest data source in most organizations. Which source covers most readers:
   Deployments API, a named workflow, or releases?
3. **Team mapping:** is CODEOWNERS a good enough default for a first run?
4. **Evidence and named approvers:** confirm with a regulated reader that recording approver logins
   (and only approvers) is what they need, and how long to keep the files.
5. **Name — decided 2026-10-09, repository renamed 2026-10-20.** Package `@fps4/whosigns` in the
   repository `ai-product-design-kit` (was `copilot-to-capability-kit`; see ADR-0005). CLI, config and
   check: `whosigns` (`whosigns.yml`, `whosigns/gate`), after the question *"Who signs?"* (episode 8.5). Replaces the working name `adk`, which collided with Google's Agent
   Development Kit. `whosigns` was free on npm on 2026-10-09; check GitHub Marketplace and PyPI before
   publishing.
