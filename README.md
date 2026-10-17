# copilot-to-capability-kit

**Measure, brief, gate and evidence for teams that build with AI agents — in your own repository, in
a day, with no service to run.**

AI made writing code cheap and left checking it expensive. This kit is the engineering half of the
series *From Personal Copilot to Organizational Capability* and its paper of nine moves (links added
when published): four small parts, each usable on its own, that run in
git and CI. The CLI is `whosigns`.

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
4. **Humans approve.** Bots and agents never count as approvers, and the kit itself approves nothing.
5. **Unknown stays unknown.** Missing data is reported as missing, never estimated.

## Status

**`whosigns measure` is built (2026-10-17) for Loop 1, *Is review our bottleneck?*:** PR metrics,
the queue in front of human review, team aggregation with suppression, a before/after report and a
one-page readout for the sponsor. See [`docs/loop-1.md`](docs/loop-1.md). The rest (Brief, Gate,
Evidence, and deployment metrics in Measure) is still specification; the rest of the build stays
paused while the series pilot runs. Start with [`docs/spec.md`](docs/spec.md); decisions are in
[`docs/decisions/`](docs/decisions/).

```
npm install && npm run build
WHOSIGNS_TOKEN=<read-only token> node dist/src/cli.js measure \
  --config whosigns.yml --baseline 2025-01-01..2025-03-31 --current 2026-07-01..2026-09-30
```

This is a reference implementation shared in the open, not a product with support. For a governed
specification service with immutable versions and a verifiable audit record, see
[maestro](https://github.com/fps4/maestro) — the kit is its git-native, lightweight counterpart, and
the two share a finding format and a decision-record shape.

## Licence

MIT — see [LICENSE](LICENSE).
