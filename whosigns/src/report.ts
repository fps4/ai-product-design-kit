// Writes the team report (spec §5.4) as JSON and Markdown, and the one-page readout for the sponsor
// (Loop 1). The JSON carries no run timestamp, so two runs on the same data are byte-identical (A-1.6).

import type { MeasureConfig } from './config.js';
import { ALL_TEAMS, isSuppressed, type CohortMetrics, type Distribution, type PeriodMetrics, type QueueMetrics, type TeamResult } from './metrics.js';
import type { Period } from './types.js';

export const VERSION = '0.1.0';

export interface ReportInput {
  config: MeasureConfig;
  periods: [Period, Period];
  repos: string[];
  teams: TeamResult[];
  sizePartialPrs: number;
}

const CAVEATS = [
  'Association, not cause. Many things changed between the two periods besides AI use.',
  'AI-assisted detection sees only marked use. AI used without a marker (an agent account, a trailer, a label or a branch prefix) is invisible here.',
  'Both logs and surveys are biased. Read this beside what your teams say, not instead of it (DORA measurement guidance).',
];

export const DEFINITIONS: Array<[string, string]> = [
  ['Merged PRs', 'Pull requests merged in the period. All PR metrics below are about this group.'],
  ['PR size', 'Lines added plus deleted, without files matching `size.exclude` (lockfiles, generated code, snapshots).'],
  ['Share over threshold', 'Share of merged PRs larger than `size.threshold_lines`, the size beyond which review gets weak.'],
  ['Pickup time', 'From ready for review (or creation) to the first review by a human who is not an author or co-author.'],
  ['Review elapsed', 'From that first human review to merge. Elapsed time, not effort.'],
  ['Merged without human approval', 'Share of merged PRs with no approving review, before merge, by a human who is not an author or co-author. Bots and agents never count.'],
  ['Reviewed only by bots', 'Share of merged PRs whose only reviews came from bots or agents.'],
  ['AI-assisted share', 'Share of merged PRs that match the AI-assisted markers listed above.'],
  ['Waiting at period end', 'Ready PRs that had no human review yet and were still open when the period ended, with how long they had waited.'],
  ['Average waiting', 'The average number of PRs waiting for a first human review at any moment in the period: the queue in front of review.'],
];

function sourceLine(name: string, source: string): string {
  if (source === 'none') return `${name}: unknown (source not configured)`;
  return `${name}: unknown (source "${source}" is not supported in this version yet)`;
}

function unknownLines(config: MeasureConfig): string[] {
  return [
    sourceLine('Deployment frequency', config.deploymentsSource),
    sourceLine('Lead time', config.deploymentsSource),
    sourceLine('Change failure rate', config.failuresSource),
    'Rework: unknown (not available in this version)',
  ];
}

function markerSummary(config: MeasureConfig): string[] {
  const m = config.markers;
  const out: string[] = [];
  if (m.authorIsAgent) out.push('author or co-author is an account listed in `agents`');
  if (m.coAuthorTrailers) out.push('a `Co-authored-by:` trailer names a listed agent');
  if (m.assistedByTrailer) out.push('an `Assisted-by:` or `Generated-by:` trailer');
  if (m.labels.length) out.push(`a label: ${m.labels.join(', ')}`);
  if (m.branchPrefixes.length) out.push(`a branch prefix: ${m.branchPrefixes.join(', ')}`);
  return out;
}

export function buildJson(input: ReportInput): string {
  const { config, periods, repos, teams } = input;
  const doc = {
    tool: 'whosigns measure',
    version: VERSION,
    periods: { baseline: periods[0].text, current: periods[1].text },
    repos,
    teams_mode: config.teams.kind,
    min_group_size: config.minGroupSize,
    size_threshold_lines: config.thresholdLines,
    ai_assisted_markers: markerSummary(config),
    unknown: unknownLines(config),
    caveats: CAVEATS,
    notes: { prs_with_partial_size: input.sizePartialPrs },
    teams: teams.map((t) => ({ team: t.team, baseline: t.baseline, current: t.current })),
  };
  return `${JSON.stringify(doc, null, 2)}\n`;
}

// ---- Markdown ----

const SUPPRESSED = (min: number) => `—(n<${min})`;

function dist(d: Distribution | null, unit: string): string {
  if (!d) return 'none';
  return `${fmt(d.p50)} / ${fmt(d.p75)} / ${fmt(d.p90)} ${unit} (n=${d.n})`;
}

function fmt(x: number): string {
  return Number.isInteger(x) ? String(x) : x.toFixed(1);
}

function val(x: number | null, unit = ''): string {
  return x === null ? 'none' : `${fmt(x)}${unit}`;
}

function delta(a: number | null | undefined, b: number | null | undefined, unit: string): string {
  if (a === null || a === undefined || b === null || b === undefined) return '';
  const d = Math.round((b - a) * 10) / 10;
  const sign = d > 0 ? '+' : '';
  return `${sign}${fmt(d)}${unit}`;
}

type Row = [label: string, base: string, cur: string, change: string];

const mergedCell = (m: CohortMetrics) => (m.merged_prs === 0 ? 'no PRs merged' : `${m.merged_prs} (${fmt(m.merged_per_week)}/week)`);

function cohortRows(b: CohortMetrics | null, c: CohortMetrics | null, min: number, bSup: boolean, cSup: boolean): Row[] {
  const cell = (sup: boolean, m: CohortMetrics | null, f: (m: CohortMetrics) => string) => (sup ? SUPPRESSED(min) : m ? f(m) : 'none');
  const ch = (f: (m: CohortMetrics) => number | null | undefined, unit: string) => (b && c ? delta(f(b), f(c), unit) : '');
  return [
    ['Merged PRs', cell(bSup, b, mergedCell), cell(cSup, c, mergedCell), ch((m) => m.merged_prs, '')],
    ['PR size p50 / p75 / p90', cell(bSup, b, (m) => dist(m.pr_size_lines, 'lines')), cell(cSup, c, (m) => dist(m.pr_size_lines, 'lines')), ch((m) => m.pr_size_lines?.p50, ' lines (p50)')],
    ['Share over threshold', cell(bSup, b, (m) => val(m.share_over_threshold_pct, '%')), cell(cSup, c, (m) => val(m.share_over_threshold_pct, '%')), ch((m) => m.share_over_threshold_pct, ' pts')],
    ['Pickup time p50 / p75 / p90', cell(bSup, b, (m) => dist(m.pickup_hours, 'h')), cell(cSup, c, (m) => dist(m.pickup_hours, 'h')), ch((m) => m.pickup_hours?.p50, ' h (p50)')],
    ['Review elapsed p50 / p75 / p90', cell(bSup, b, (m) => dist(m.review_elapsed_hours, 'h')), cell(cSup, c, (m) => dist(m.review_elapsed_hours, 'h')), ch((m) => m.review_elapsed_hours?.p50, ' h (p50)')],
    ['Merged without human approval', cell(bSup, b, (m) => val(m.merged_without_human_approval_pct, '%')), cell(cSup, c, (m) => val(m.merged_without_human_approval_pct, '%')), ch((m) => m.merged_without_human_approval_pct, ' pts')],
    ['Reviewed only by bots', cell(bSup, b, (m) => val(m.reviewed_only_by_bots_pct, '%')), cell(cSup, c, (m) => val(m.reviewed_only_by_bots_pct, '%')), ch((m) => m.reviewed_only_by_bots_pct, ' pts')],
    ['AI-assisted share', cell(bSup, b, (m) => val(m.ai_assisted_share_pct, '%')), cell(cSup, c, (m) => val(m.ai_assisted_share_pct, '%')), ch((m) => m.ai_assisted_share_pct, ' pts')],
  ];
}

function queueRows(b: QueueMetrics | null, c: QueueMetrics | null, min: number, bSup: boolean, cSup: boolean): Row[] {
  const cell = (sup: boolean, m: QueueMetrics | null, f: (m: QueueMetrics) => string) => (sup ? SUPPRESSED(min) : m ? f(m) : 'none');
  const ch = (f: (m: QueueMetrics) => number | null | undefined, unit: string) => (b && c ? delta(f(b), f(c), unit) : '');
  return [
    ['Waiting at period end', cell(bSup, b, (m) => `${m.waiting_at_end}${m.waiting_at_end_age_hours ? `, waited ${dist(m.waiting_at_end_age_hours, 'h')}` : ''}`), cell(cSup, c, (m) => `${m.waiting_at_end}${m.waiting_at_end_age_hours ? `, waited ${dist(m.waiting_at_end_age_hours, 'h')}` : ''}`), ch((m) => m.waiting_at_end, '')],
    ['Average waiting', cell(bSup, b, (m) => fmt(m.average_waiting)), cell(cSup, c, (m) => fmt(m.average_waiting)), ch((m) => m.average_waiting, '')],
  ];
}

function table(rows: Row[], periods: [Period, Period]): string {
  const head = `| | Baseline ${periods[0].text} | Current ${periods[1].text} | Change |\n|---|---|---|---|`;
  return [head, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

function asCohort(x: CohortMetrics | { suppressed: true } | null): CohortMetrics | null {
  return x && !isSuppressed(x) ? (x as CohortMetrics) : null;
}

function asQueue(x: QueueMetrics | { suppressed: true }): QueueMetrics | null {
  return isSuppressed(x) ? null : (x as QueueMetrics);
}

interface Candidate {
  team: string;
  score: number;
  text: string;
}

/** Three prompts from the largest changes. Questions, never conclusions (spec §5.4). */
export function questions(teams: TeamResult[]): string[] {
  const out: Candidate[] = [];
  const rel = (a: number, b: number) => Math.abs(b - a) / Math.max(Math.abs(a), 1);
  for (const t of teams) {
    const b = asCohort(t.baseline.merged);
    const c = asCohort(t.current.merged);
    const qb = asQueue(t.baseline.queue);
    const qc = asQueue(t.current.queue);
    if (b?.pickup_hours && c?.pickup_hours) {
      out.push({ team: t.team, score: rel(b.pickup_hours.p50, c.pickup_hours.p50), text: `${t.team}: a typical PR now waits ${fmt(c.pickup_hours.p50)} h for a first human review (was ${fmt(b.pickup_hours.p50)} h). What is waiting longest, and who is it waiting for?` });
    }
    if (b?.pr_size_lines && c?.pr_size_lines) {
      out.push({ team: t.team, score: rel(b.pr_size_lines.p50, c.pr_size_lines.p50), text: `${t.team}: the typical PR is ${fmt(c.pr_size_lines.p50)} lines (was ${fmt(b.pr_size_lines.p50)}). Could the largest recent PR have been split, and what stopped it?` });
    }
    if (b && c && b.merged_without_human_approval_pct !== null && c.merged_without_human_approval_pct !== null) {
      out.push({ team: t.team, score: Math.abs(c.merged_without_human_approval_pct - b.merged_without_human_approval_pct) / 10, text: `${t.team}: ${fmt(c.merged_without_human_approval_pct)}% of merged PRs had no human approval (was ${fmt(b.merged_without_human_approval_pct)}%). Which of them should have had one?` });
    }
    if (qb && qc) {
      out.push({ team: t.team, score: rel(qb.average_waiting, qc.average_waiting), text: `${t.team}: on average ${fmt(qc.average_waiting)} PRs were waiting for a first human review at any moment (was ${fmt(qb.average_waiting)}). Who reviews, and how much of their week is that?` });
    }
    if (b && c && b.ai_assisted_share_pct !== null && c.ai_assisted_share_pct !== null) {
      out.push({ team: t.team, score: Math.abs(c.ai_assisted_share_pct - b.ai_assisted_share_pct) / 20, text: `${t.team}: ${fmt(c.ai_assisted_share_pct)}% of merged PRs are marked AI-assisted (was ${fmt(b.ai_assisted_share_pct)}%). Does that match what the team says it uses?` });
    }
  }
  out.sort((x, y) => y.score - x.score || x.text.localeCompare(y.text));
  return out.slice(0, 3).map((c) => c.text);
}

export function buildMarkdown(input: ReportInput): string {
  const { config, periods, repos, teams } = input;
  const min = config.minGroupSize;
  const lines: string[] = [];
  lines.push(`# Measure: ${periods[0].text} against ${periods[1].text}`, '');
  lines.push(`Generated by \`whosigns measure\` ${VERSION}. Teams only; no person is named or ranked. Aggregates with fewer than ${min} distinct human authors show \`${SUPPRESSED(min)}\`.`, '');
  lines.push('## Read this first', '');
  for (const c of CAVEATS) lines.push(`- ${c}`);
  lines.push('', '## What was measured', '');
  lines.push(`- **Periods:** baseline ${periods[0].text}, current ${periods[1].text}`);
  lines.push(`- **Repositories (${repos.length}):** ${repos.join(', ')}`);
  lines.push(`- **Teams:** ${config.teams.kind === 'repo' ? 'one per repository' : 'from the `teams.map` in whosigns.yml'}`);
  lines.push(`- **Size threshold:** ${config.thresholdLines} lines`);
  lines.push(`- **AI-assisted markers:** ${markerSummary(config).join('; ')}`);
  if (input.sizePartialPrs) {
    lines.push(`- **Note:** ${input.sizePartialPrs} PRs changed more than 100 files; size exclusions were applied to the first 100 only.`);
  }
  lines.push('', '**Not measured in this run:**', '');
  for (const u of unknownLines(config)) lines.push(`- ${u}`);
  lines.push('', '## Definitions', '', '| Metric | Definition |', '|---|---|');
  for (const [k, v] of DEFINITIONS) lines.push(`| ${k} | ${v} |`);

  for (const t of teams) {
    lines.push('', `## ${t.team}`, '');
    const bSup = isSuppressed(t.baseline.merged);
    const cSup = isSuppressed(t.current.merged);
    const rows = cohortRows(asCohort(t.baseline.merged), asCohort(t.current.merged), min, bSup, cSup);
    rows.push(...queueRows(asQueue(t.baseline.queue), asQueue(t.current.queue), min, isSuppressed(t.baseline.queue), isSuppressed(t.current.queue)));
    lines.push(table(rows, periods));
    lines.push('', ...splitSection(t, periods, min));
  }

  lines.push('', '## Questions to ask your team', '');
  const qs = questions(teams);
  if (qs.length === 0) lines.push('- Not enough unsuppressed data in both periods to suggest questions.');
  for (const q of qs) lines.push(`- ${q}`);
  lines.push('');
  return lines.join('\n');
}

function splitSection(t: TeamResult, periods: [Period, Period], min: number): string[] {
  const parts: Array<[string, (p: PeriodMetrics) => PeriodMetrics['ai_assisted']]> = [
    ['AI-assisted', (p) => p.ai_assisted],
    ['Not AI-assisted', (p) => p.not_ai_assisted],
  ];
  const shown = parts.some(([, f]) => [t.baseline, t.current].some((p) => { const x = f(p); return x !== null && !isSuppressed(x); }));
  if (!shown) {
    return [`*AI-assisted vs not: not shown, because in at least one period one of the two groups is empty or has fewer than ${min} distinct human authors.*`];
  }
  const out: string[] = [];
  for (const [label, f] of parts) {
    const b = f(t.baseline);
    const c = f(t.current);
    out.push(`**${label}**`, '');
    out.push(table(cohortRows(asCohort(b), asCohort(c), min, isSuppressed(b), isSuppressed(c)).slice(0, 7), periods), '');
  }
  return out;
}

// ---- The readout: one page the engineering lead takes to the sponsor (Loop 1) ----

export function buildReadout(input: ReportInput): string {
  const { periods, teams, config } = input;
  const min = config.minGroupSize;
  const whole = teams.find((t) => t.team === ALL_TEAMS) ?? teams[0];
  const lines: string[] = [];
  lines.push('# Is review our bottleneck?', '');
  lines.push(`*Readout for: [sponsor] · From: [engineering lead] · Periods: ${periods[0].text} against ${periods[1].text} · Source: \`whosigns measure\` on ${input.repos.length} repositories. Teams only; no person is named.*`, '');

  lines.push('## What we measured', '');
  if (!whole) {
    lines.push('No pull requests were found in the configured repositories and periods.');
  } else {
    const b = asCohort(whole.baseline.merged);
    const c = asCohort(whole.current.merged);
    const qb = asQueue(whole.baseline.queue);
    const qc = asQueue(whole.current.queue);
    const scope = whole.team === ALL_TEAMS ? 'Across all teams' : `For ${whole.team}`;
    if (!b || !c || !qb || !qc) {
      lines.push(`${scope}, one of the periods has fewer than ${min} distinct human authors, so the figures are suppressed. Lower \`min_group_size\` only if everyone measured agrees.`);
    } else {
      lines.push(`${scope}, comparing the two periods:`, '');
      lines.push('| | Before | Now |', '|---|---|---|');
      lines.push(`| PRs merged per week | ${fmt(b.merged_per_week)} | ${fmt(c.merged_per_week)} |`);
      const wait = (m: CohortMetrics) => (m.pickup_hours ? `${fmt(m.pickup_hours.p50)} h` : 'no human reviews');
      lines.push(`| Typical wait for a first human review (p50) | ${wait(b)} | ${wait(c)} |`);
      lines.push(`| PRs waiting for a first human review, on average | ${fmt(qb.average_waiting)} | ${fmt(qc.average_waiting)} |`);
      lines.push(`| Typical PR size (p50) | ${b.pr_size_lines ? `${fmt(b.pr_size_lines.p50)} lines` : 'none'} | ${c.pr_size_lines ? `${fmt(c.pr_size_lines.p50)} lines` : 'none'} |`);
      lines.push(`| PRs larger than ${config.thresholdLines} lines | ${val(b.share_over_threshold_pct, '%')} | ${val(c.share_over_threshold_pct, '%')} |`);
      lines.push(`| Merged with no human approval | ${val(b.merged_without_human_approval_pct, '%')} | ${val(c.merged_without_human_approval_pct, '%')} |`);
      lines.push(`| Marked AI-assisted | ${val(b.ai_assisted_share_pct, '%')} | ${val(c.ai_assisted_share_pct, '%')} |`);
      lines.push('', `At the end of the current period, **${qc.waiting_at_end} PRs** were ready and still waiting for a first human review.`);
    }
  }
  lines.push('', '## What it costs', '');
  lines.push('*[Fill in, in your own words: what the waiting means in your setting. Examples: features waiting for release, reviewers\' hours per week, context lost when a PR waits days. Use your numbers, not a benchmark.]*', '');
  lines.push('## The one change we propose', '');
  lines.push('*[One change, as an experiment, with the card attached (parts/8-building-with-agents/experiment-card.md in the kit). A common first one: a limit on agent-written PRs waiting for human review per reviewer, in two teams for six weeks, with the others as comparison.]*', '');
  lines.push('## Who has to say yes', '');
  lines.push('*[Name the role, not only the person: who approves the experiment, who owns the teams in it, and who decides at the end whether to keep it.]*', '');
  lines.push('## What this does not show', '');
  lines.push('- Association, not cause: other things changed between the periods too.');
  lines.push('- AI use without a marker is invisible; the AI-assisted share is a floor, not the real share.');
  lines.push('- Deployments, lead time and change failure rate were not measured in this run.');
  lines.push('- Nothing here rates a person, and it must not be used to.');
  lines.push('');
  return lines.join('\n');
}
