import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseConfig, globToRegExp, type MeasureConfig } from '../src/config.js';
import { normalisePull } from '../src/github.js';
import { parsePeriod } from '../src/main.js';
import { computeTeams, distribution, hasHumanApproval, isAiAssisted, isSuppressed, reviewedOnlyByBots, type CohortMetrics, type QueueMetrics } from '../src/metrics.js';
import { buildJson, buildMarkdown, buildReadout, type ReportInput } from '../src/report.js';
import type { Actor, PullRecord, Review } from '../src/types.js';

const BASE = parsePeriod('2025-01-01..2025-03-31', 'baseline');
const CUR = parsePeriod('2026-07-01..2026-09-30', 'current');
const PERIODS: [typeof BASE, typeof CUR] = [BASE, CUR];

function config(extra = ''): MeasureConfig {
  return parseConfig(`measure:\n  repos: [acme/one, acme/two, acme/three]\n  teams:\n    map: {acme/one: Payments, acme/two: Payments, acme/three: Search}\n${extra}`);
}

const human = (login: string): Actor => ({ login, kind: 'human' });
const bot = (login: string): Actor => ({ login, kind: 'bot' });
const agent = (login: string): Actor => ({ login, kind: 'agent' });
const at = (iso: string) => new Date(iso);
const review = (iso: string, reviewer: Actor, state: Review['state'] = 'APPROVED'): Review => ({ at: at(iso), reviewer, state });

let seq = 0;
function pr(p: Partial<PullRecord> & { author: Actor | null }): PullRecord {
  seq += 1;
  const createdAt = p.createdAt ?? at('2026-07-10T09:00:00Z');
  return {
    repo: 'acme/one',
    number: seq,
    createdAt,
    readyAt: createdAt,
    mergedAt: at('2026-07-11T09:00:00Z'),
    closedAt: null,
    coAuthors: [],
    trailerNames: [],
    assistedTrailer: false,
    labels: [],
    headRef: 'feature/x',
    linesChanged: 120,
    sizePartial: false,
    reviews: [],
    ...p,
  };
}

/** n PRs in a period, each by a different human, reviewed by a different human. */
function teamOf(n: number, repo: string, merged: string, extra: Partial<PullRecord> = {}): PullRecord[] {
  return Array.from({ length: n }, (_, i) =>
    pr({
      repo,
      author: human(`${repo}-dev${i}`),
      createdAt: at(`${merged}T08:00:00Z`),
      readyAt: at(`${merged}T08:00:00Z`),
      mergedAt: at(`${merged}T20:00:00Z`),
      reviews: [review(`${merged}T12:00:00Z`, human(`${repo}-rev${i}`))],
      ...extra,
    }),
  );
}

function report(prs: PullRecord[], cfg = config()): ReportInput {
  return {
    config: cfg,
    periods: PERIODS,
    repos: ['acme/one', 'acme/three', 'acme/two'],
    teams: computeTeams(prs, PERIODS, cfg),
    sizePartialPrs: 0,
  };
}

test('A-1.1 unconfigured deployments are reported as unknown, not estimated', () => {
  const prs = [...teamOf(6, 'acme/one', '2025-02-01'), ...teamOf(6, 'acme/one', '2026-08-01'), ...teamOf(6, 'acme/three', '2026-08-01')];
  const md = buildMarkdown(report(prs));
  assert.match(md, /Deployment frequency: unknown \(source not configured\)/);
  assert.match(md, /PR size p50/);
  assert.match(md, /Pickup time p50/);
  assert.match(md, /Merged without human approval/);
  assert.match(md, /Reviewed only by bots/);
  assert.match(md, /AI-assisted share/);
  assert.match(md, /Average waiting/);
});

test('A-1.2 a team with four distinct authors in a period is suppressed', () => {
  const prs = [...teamOf(4, 'acme/three', '2026-08-01'), ...teamOf(6, 'acme/one', '2026-08-01')];
  const teams = computeTeams(prs, PERIODS, config());
  const search = teams.find((t) => t.team === 'Search')!;
  assert.ok(isSuppressed(search.current.merged));
  assert.ok(isSuppressed(search.current.queue));
  const md = buildMarkdown(report(prs));
  const section = md.split('## Search')[1]!.split('\n## ')[0]!;
  assert.match(section, /—\(n<5\)/);
  assert.doesNotMatch(section, /\(n=\d+\)/);
});

test('A-1.3 approval only by the Copilot reviewer bot is not human approval', () => {
  const p = pr({ author: human('alice'), reviews: [review('2026-07-10T12:00:00Z', bot('copilot-pull-request-reviewer[bot]'))] });
  assert.equal(hasHumanApproval(p), false);
  assert.equal(reviewedOnlyByBots(p), true);
});

test('A-1.4 a co-author approving is not human approval', () => {
  const p = pr({ author: agent('Copilot'), coAuthors: [human('bob')], reviews: [review('2026-07-10T12:00:00Z', human('bob'))] });
  assert.equal(hasHumanApproval(p), false);
  const q = pr({ author: agent('Copilot'), coAuthors: [human('bob')], reviews: [review('2026-07-10T12:00:00Z', human('carol'))] });
  assert.equal(hasHumanApproval(q), true);
});

test('A-1.5 no output contains a login seen in the input', () => {
  const prs = [
    ...teamOf(6, 'acme/one', '2025-02-01'),
    ...teamOf(6, 'acme/one', '2026-08-01'),
    ...teamOf(6, 'acme/three', '2026-08-01', { coAuthors: [agent('claude')], trailerNames: ['claude'] }),
  ];
  const input = report(prs);
  const outputs = [buildJson(input), buildMarkdown(input), buildReadout(input)].join('\n');
  const logins = new Set<string>();
  for (const p of prs) {
    if (p.author) logins.add(p.author.login);
    for (const a of p.coAuthors) logins.add(a.login);
    for (const r of p.reviews) logins.add(r.reviewer.login);
  }
  for (const login of logins) {
    if (login === 'claude') continue; // an agent name that is also in the configured marker list
    assert.ok(!outputs.includes(login), `output contains ${login}`);
  }
});

test('A-1.6 two runs on the same data give byte-identical JSON', () => {
  const make = () => [...teamOf(6, 'acme/one', '2025-02-01'), ...teamOf(7, 'acme/two', '2026-08-01'), ...teamOf(5, 'acme/three', '2026-08-01')];
  seq = 0;
  const a = buildJson(report(make()));
  seq = 0;
  const b = buildJson(report(make()));
  assert.equal(a, b);
});

test('pickup, review elapsed and size are computed per merged PR', () => {
  const prs = teamOf(5, 'acme/one', '2026-08-01', { linesChanged: 500 });
  const t = computeTeams(prs, PERIODS, config()).find((x) => x.team === 'Payments')!;
  const m = t.current.merged as CohortMetrics;
  assert.equal(m.merged_prs, 5);
  assert.equal(m.pickup_hours!.p50, 4);
  assert.equal(m.review_elapsed_hours!.p50, 8);
  assert.equal(m.share_over_threshold_pct, 100);
  assert.equal(m.merged_without_human_approval_pct, 0);
});

test('the queue counts PRs still waiting for a first human review at period end', () => {
  const waiting = Array.from({ length: 5 }, (_, i) =>
    pr({ author: human(`w${i}`), createdAt: at('2026-09-29T00:00:00Z'), readyAt: at('2026-09-29T00:00:00Z'), mergedAt: null }),
  );
  const t = computeTeams(waiting, PERIODS, config()).find((x) => x.team === 'Payments')!;
  const q = t.current.queue as QueueMetrics;
  assert.equal(q.waiting_at_end, 5);
  assert.equal(q.waiting_at_end_age_hours!.p50, 48);
  // five PRs waiting for the last 2 of 92 days
  assert.equal(q.average_waiting, Math.round((5 * 2 * 10) / 92) / 10);
});

test('AI-assisted markers: agent co-author, trailer, label and branch prefix', () => {
  const c = config();
  assert.equal(isAiAssisted(pr({ author: human('a'), coAuthors: [agent('copilot')] }), c.markers, c.agents), true);
  assert.equal(isAiAssisted(pr({ author: human('a'), trailerNames: ['claude'] }), c.markers, c.agents), true);
  assert.equal(isAiAssisted(pr({ author: human('a'), trailerNames: ['claudette smith'] }), c.markers, c.agents), false);
  assert.equal(isAiAssisted(pr({ author: human('a'), labels: ['ai-assisted'] }), c.markers, c.agents), true);
  assert.equal(isAiAssisted(pr({ author: human('a'), headRef: 'copilot/fix-123' }), c.markers, c.agents), true);
  assert.equal(isAiAssisted(pr({ author: human('a') }), c.markers, c.agents), false);
});

test('normalisePull: draft readiness, co-author trailers, size exclusions, bots', () => {
  const c = config();
  const node = {
    number: 7,
    createdAt: '2026-07-01T08:00:00Z',
    mergedAt: '2026-07-02T08:00:00Z',
    closedAt: '2026-07-02T08:00:00Z',
    isDraft: false,
    headRefName: 'feature/y',
    additions: 30,
    deletions: 10,
    author: { login: 'alice', __typename: 'User' },
    labels: { nodes: [{ name: 'AI-Assisted' }] },
    files: { totalCount: 2, nodes: [{ path: 'src/a.ts', additions: 20, deletions: 5 }, { path: 'package-lock.json', additions: 10, deletions: 5 }] },
    reviews: { nodes: [{ state: 'APPROVED', submittedAt: '2026-07-01T12:00:00Z', author: { login: 'copilot-pull-request-reviewer', __typename: 'Bot' } }, { state: 'PENDING', submittedAt: null, author: { login: 'dave', __typename: 'User' } }] },
    commits: { nodes: [{ commit: { message: 'Fix\n\nCo-authored-by: Claude <noreply@anthropic.com>\nCo-authored-by: Bob <123+bob@users.noreply.github.com>', authors: { nodes: [{ user: { login: 'alice' } }] } } }] },
    timelineItems: { nodes: [{ createdAt: '2026-07-01T10:00:00Z' }] },
  };
  const p = normalisePull(node, 'acme/one', c);
  assert.equal(p.linesChanged, 25);
  assert.equal(p.readyAt!.toISOString(), '2026-07-01T10:00:00.000Z');
  assert.deepEqual(p.trailerNames, ['claude', 'bob']);
  assert.deepEqual(p.coAuthors, [{ login: 'bob', kind: 'human' }]);
  assert.equal(p.reviews.length, 1);
  assert.equal(p.reviews[0]!.reviewer.kind, 'agent');
  assert.deepEqual(p.labels, ['ai-assisted']);
});

test('config: defaults, unbuilt team modes and bad input', () => {
  const c = parseConfig('measure:\n  repos: [acme/one]\n');
  assert.equal(c.minGroupSize, 5);
  assert.equal(c.thresholdLines, 400);
  assert.equal(c.teams.kind, 'repo');
  assert.equal(c.deploymentsSource, 'none');
  assert.throws(() => parseConfig('measure:\n  repos: [acme/one]\n  teams: codeowners\n'), /not built yet/);
  assert.throws(() => parseConfig('measure:\n  repos: [nope]\n'), /owner\/name/);
  assert.throws(() => parseConfig('other: 1\n'), /measure/);
});

test('glob and percentile helpers', () => {
  assert.ok(globToRegExp('**/package-lock.json').test('package-lock.json'));
  assert.ok(globToRegExp('**/package-lock.json').test('web/package-lock.json'));
  assert.ok(globToRegExp('**/__snapshots__/**').test('src/__snapshots__/a.snap'));
  assert.ok(!globToRegExp('*.min.js').test('dist/a.min.js'));
  assert.deepEqual(distribution([1, 2, 3, 4, 100]), { n: 5, p50: 3, p75: 4, p90: 100 });
  assert.equal(distribution([]), null);
});

test('periods: inclusive end date and validation', () => {
  const p = parsePeriod('2026-07-01..2026-09-30', 'current');
  assert.equal(p.end.toISOString(), '2026-10-01T00:00:00.000Z');
  assert.throws(() => parsePeriod('2026-09-30..2026-07-01', 'current'), /before the start/);
});
