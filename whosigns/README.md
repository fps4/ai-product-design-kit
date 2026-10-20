# whosigns

**Measure, brief, gate and evidence for teams that build with AI agents — in your own repository, in
a day, with no service to run.** Part of the [AI Product Design kit](../README.md); the engineering
tool for Part 8, *Building it with agents*.

AI made writing code cheap and left checking it expensive. whosigns is four small parts, each usable
on its own, that run in git and CI.

| Part | Command / artifact | Answers | Paper move |
|---|---|---|---|
| **Measure** | `whosigns measure` | Did delivery change as AI adoption rose? PR size, time in review, merges with no human review, lead time, change failure rate — per team, before vs after | 9 |
| **Brief** | `brief.md` template · `whosigns lint` · agent instructions | Is this brief precise enough that an agent will not guess? Six deterministic checks | 6 |
| **Gate** | GitHub Action `whosigns gate` · ruleset templates | Is this change small enough to review, tied to an approved spec, and approved by a human who did not write it? | 7, 8 |
| **Evidence** | `whosigns evidence` · release asset | Who approved which spec version, when, and which change was built against it? Mapped to EU DORA RTS Art. 17 | 8 |

## Principles

1. **Runs where the work is.** Git and CI only. No service, no database, no account, no data leaves
   your organization.
2. **Teams, never individuals.** No output names or ranks a person.
3. **Deterministic.** No model in any check. Every finding is explainable in one sentence and gives the
   same answer twice.
4. **Humans approve.** Bots and agents never count as approvers, and the tool itself approves nothing.
5. **Unknown stays unknown.** Missing data is reported as missing, never estimated.

## Status

**`whosigns measure` is built (2026-10-17)** for Loop 1, *Is review our bottleneck?* (episode 8.2):
PR metrics, the queue in front of human review, team aggregation with suppression, a before/after
report and a one-page readout for the sponsor. See [`../docs/loop-1.md`](../docs/loop-1.md). Brief,
Gate, Evidence and the deployment metrics in Measure are still specification
([`../docs/spec.md`](../docs/spec.md)). The PO- and lead-facing pieces — the brief template, the
six-failure checklist, the size-limit rules, the pulse survey, the readout instructions and the
experiment card — are downloads in [`../parts/8-building-with-agents/`](../parts/8-building-with-agents/).

```
npm install && npm run build
WHOSIGNS_TOKEN=<read-only token> node dist/src/cli.js measure \
  --config whosigns.yml --baseline 2025-01-01..2025-03-31 --current 2026-07-01..2026-09-30
```

Copy [`whosigns.example.yml`](whosigns.example.yml) to `whosigns.yml` first.

## Licence

MIT — see [LICENSE](../LICENSE).
