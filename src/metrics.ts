// Team-level metrics per period (spec §5.3), plus the review queue that Loop 1 asks about.
// Every aggregate carries the number of distinct human authors behind it and is suppressed below
// `min_group_size` (spec I-2). Nothing returned from here contains a login.

import { normaliseLogin, teamFor, type MarkerConfig, type MeasureConfig } from './config.js';
import type { Actor, Period, PullRecord, Review } from './types.js';

export const ALL_TEAMS = 'All teams';

export interface Distribution {
  n: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface CohortMetrics {
  merged_prs: number;
  merged_per_week: number;
  pr_size_lines: Distribution | null;
  share_over_threshold_pct: number | null;
  pickup_hours: Distribution | null;
  review_elapsed_hours: Distribution | null;
  merged_without_human_approval_pct: number | null;
  reviewed_only_by_bots_pct: number | null;
  ai_assisted_share_pct: number | null;
}

export interface QueueMetrics {
  /** Ready PRs still waiting for a first human review when the period ended. */
  waiting_at_end: number;
  waiting_at_end_age_hours: Distribution | null;
  /** Average number of PRs waiting for a first human review at any moment in the period. */
  average_waiting: number;
}

export type Suppressed = { suppressed: true; authors_below: number };

export interface PeriodMetrics {
  merged: CohortMetrics | Suppressed;
  queue: QueueMetrics | Suppressed;
  ai_assisted: CohortMetrics | Suppressed | null;
  not_ai_assisted: CohortMetrics | Suppressed | null;
}

export interface TeamResult {
  team: string;
  baseline: PeriodMetrics;
  current: PeriodMetrics;
}

const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

/** Nearest-rank percentile: deterministic, and always a value that occurred. */
export function distribution(values: number[]): Distribution | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)]!;
  return { n: sorted.length, p50: round1(at(50)), p75: round1(at(75)), p90: round1(at(90)) };
}

function pct(part: number, whole: number): number | null {
  return whole === 0 ? null : round1((100 * part) / whole);
}

function inPeriod(d: Date | null, p: Period): boolean {
  return d !== null && d >= p.start && d < p.end;
}

/** Author and co-authors: the people a PR is "by". */
function involved(pr: PullRecord): Actor[] {
  return pr.author ? [pr.author, ...pr.coAuthors] : [...pr.coAuthors];
}

function isInvolved(pr: PullRecord, login: string): boolean {
  return involved(pr).some((a) => a.login === login);
}

function humanAuthors(prs: PullRecord[]): Set<string> {
  const out = new Set<string>();
  for (const pr of prs) for (const a of involved(pr)) if (a.kind === 'human') out.add(a.login);
  return out;
}

/** A review counts as human review when a human who is neither author nor co-author gave it. */
function isHumanReview(pr: PullRecord, r: Review): boolean {
  return r.reviewer.kind === 'human' && !isInvolved(pr, r.reviewer.login);
}

export function firstHumanReview(pr: PullRecord): Review | null {
  return pr.reviews.find((r) => isHumanReview(pr, r)) ?? null;
}

export function hasHumanApproval(pr: PullRecord): boolean {
  const before = pr.mergedAt ?? new Date(8.64e15);
  return pr.reviews.some((r) => r.state === 'APPROVED' && r.at <= before && isHumanReview(pr, r));
}

export function reviewedOnlyByBots(pr: PullRecord): boolean {
  return pr.reviews.length > 0 && pr.reviews.every((r) => r.reviewer.kind !== 'human');
}

export function isAiAssisted(pr: PullRecord, markers: MarkerConfig, agents: string[]): boolean {
  if (markers.authorIsAgent && involved(pr).some((a) => a.kind === 'agent')) return true;
  if (markers.coAuthorTrailers) {
    const names = agents.map(normaliseLogin);
    const wordMatch = (trailer: string) => names.some((n) => new RegExp(`(^|[^a-z0-9])${escape(n)}([^a-z0-9]|$)`).test(trailer));
    if (pr.trailerNames.some(wordMatch)) return true;
  }
  if (markers.assistedByTrailer && pr.assistedTrailer) return true;
  const labels = markers.labels.map((l) => l.toLowerCase());
  if (pr.labels.some((l) => labels.includes(l))) return true;
  if (markers.branchPrefixes.some((p) => pr.headRef.startsWith(p))) return true;
  return false;
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cohort(prs: PullRecord[], period: Period, config: MeasureConfig): CohortMetrics {
  const weeks = (period.end.getTime() - period.start.getTime()) / WEEK;
  const pickup: number[] = [];
  const elapsed: number[] = [];
  for (const pr of prs) {
    const first = firstHumanReview(pr);
    if (!first || !pr.readyAt || !pr.mergedAt) continue;
    if (first.at > pr.mergedAt) continue; // reviewed only after merge: no pickup before merge
    pickup.push(Math.max(0, first.at.getTime() - pr.readyAt.getTime()) / HOUR);
    elapsed.push(Math.max(0, pr.mergedAt.getTime() - first.at.getTime()) / HOUR);
  }
  const n = prs.length;
  return {
    merged_prs: n,
    merged_per_week: round1(n / weeks),
    pr_size_lines: distribution(prs.map((p) => p.linesChanged)),
    share_over_threshold_pct: pct(prs.filter((p) => p.linesChanged > config.thresholdLines).length, n),
    pickup_hours: distribution(pickup),
    review_elapsed_hours: distribution(elapsed),
    merged_without_human_approval_pct: pct(prs.filter((p) => !hasHumanApproval(p)).length, n),
    reviewed_only_by_bots_pct: pct(prs.filter(reviewedOnlyByBots).length, n),
    ai_assisted_share_pct: pct(prs.filter((p) => isAiAssisted(p, config.markers, config.agents)).length, n),
  };
}

/** When a PR stopped waiting for a first human review: that review, or closing, whichever came first. */
function waitEnd(pr: PullRecord): Date | null {
  const first = firstHumanReview(pr);
  const closed = pr.mergedAt ?? pr.closedAt;
  if (first && closed) return first.at < closed ? first.at : closed;
  return first?.at ?? closed;
}

function queue(prs: PullRecord[], period: Period): { metrics: QueueMetrics; considered: PullRecord[] } {
  const span = period.end.getTime() - period.start.getTime();
  let waitingTime = 0;
  const ages: number[] = [];
  const considered: PullRecord[] = [];
  for (const pr of prs) {
    if (!pr.readyAt) continue;
    const from = pr.readyAt.getTime();
    const end = waitEnd(pr);
    const to = end ? end.getTime() : Number.POSITIVE_INFINITY;
    const overlap = Math.min(to, period.end.getTime()) - Math.max(from, period.start.getTime());
    if (overlap <= 0) continue;
    considered.push(pr);
    waitingTime += overlap;
    if (from < period.end.getTime() && to >= period.end.getTime()) {
      ages.push((period.end.getTime() - from) / HOUR);
    }
  }
  return {
    metrics: {
      waiting_at_end: ages.length,
      waiting_at_end_age_hours: distribution(ages),
      average_waiting: round1(waitingTime / span),
    },
    considered,
  };
}

function guard<T>(prs: PullRecord[], min: number, build: () => T): T | Suppressed {
  if (prs.length === 0) return build(); // nothing to identify; report the empty period as such
  const authors = humanAuthors(prs).size;
  return authors < min ? { suppressed: true, authors_below: min } : build();
}

function periodMetrics(prs: PullRecord[], period: Period, config: MeasureConfig): PeriodMetrics {
  const merged = prs.filter((p) => inPeriod(p.mergedAt, period));
  const q = queue(prs, period);
  const ai = merged.filter((p) => isAiAssisted(p, config.markers, config.agents));
  const notAi = merged.filter((p) => !isAiAssisted(p, config.markers, config.agents));
  const min = config.minGroupSize;
  // The split is shown only when both groups qualify (spec §5.3, ADR-0002).
  const splitAllowed = humanAuthors(ai).size >= min && humanAuthors(notAi).size >= min;
  return {
    merged: guard(merged, min, () => cohort(merged, period, config)),
    queue: guard(q.considered, min, () => q.metrics),
    ai_assisted: splitAllowed ? cohort(ai, period, config) : ai.length ? { suppressed: true, authors_below: min } : null,
    not_ai_assisted: splitAllowed ? cohort(notAi, period, config) : notAi.length ? { suppressed: true, authors_below: min } : null,
  };
}

export function computeTeams(prs: PullRecord[], periods: [Period, Period], config: MeasureConfig): TeamResult[] {
  const byTeam = new Map<string, PullRecord[]>();
  for (const pr of prs) {
    const team = teamFor(config.teams, pr.repo);
    if (team === null) continue;
    byTeam.set(team, [...(byTeam.get(team) ?? []), pr]);
  }
  const names = [...byTeam.keys()].sort((a, b) => a.localeCompare(b));
  const mapped = names.flatMap((t) => byTeam.get(t)!);
  const groups: Array<[string, PullRecord[]]> = names.map((t) => [t, byTeam.get(t)!]);
  if (names.length > 1) groups.push([ALL_TEAMS, mapped]);
  const [baseline, current] = periods;
  return groups.map(([team, list]) => ({
    team,
    baseline: periodMetrics(list, baseline, config),
    current: periodMetrics(list, current, config),
  }));
}

export function isSuppressed(x: unknown): x is Suppressed {
  return typeof x === 'object' && x !== null && (x as Suppressed).suppressed === true;
}
