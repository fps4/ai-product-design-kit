// Reads pull requests from GitHub (cloud or Enterprise Server) over GraphQL, read-only (spec I-7).
// The token is the user's own; it is never logged or written.

import { execFileSync } from 'node:child_process';
import { globToRegExp, normaliseLogin, type MeasureConfig } from './config.js';
import type { Actor, ActorKind, PullRecord, Review, ReviewState } from './types.js';

export class GitHubError extends Error {}

export function resolveToken(): string {
  const env = process.env.WHOSIGNS_TOKEN ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (env) return env;
  try {
    const token = execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (token) return token;
  } catch {
    // gh not installed or not logged in; fall through
  }
  throw new GitHubError('no token: set WHOSIGNS_TOKEN or GITHUB_TOKEN (read-only scopes are enough), or log in with `gh auth login`');
}

type Json = Record<string, any>;

export class GitHubClient {
  constructor(
    private readonly apiUrl: string,
    private readonly token: string,
    private readonly log: (msg: string) => void = () => {},
  ) {}

  async query(query: string, variables: Json): Promise<Json> {
    for (let attempt = 1; ; attempt++) {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { authorization: `bearer ${this.token}`, 'content-type': 'application/json', 'user-agent': 'whosigns' },
        body: JSON.stringify({ query, variables }),
      });
      if (res.status === 403 || res.status === 429 || res.status >= 500) {
        if (attempt >= 4) throw new GitHubError(`GitHub returned ${res.status} after ${attempt} attempts`);
        const retryAfter = Number(res.headers.get('retry-after'));
        const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2000 * attempt;
        this.log(`GitHub returned ${res.status}; retrying in ${Math.round(waitMs / 1000)}s`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      if (res.status === 401) throw new GitHubError('GitHub rejected the token (401)');
      const body = (await res.json()) as Json;
      if (body.errors?.length) {
        throw new GitHubError(`GitHub: ${body.errors.map((e: Json) => e.message).join('; ')}`);
      }
      return body.data as Json;
    }
  }
}

const ORG_REPOS = `
query($org: String!, $cursor: String) {
  organization(login: $org) {
    repositories(first: 100, after: $cursor, orderBy: {field: NAME, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes { nameWithOwner name isArchived }
    }
  }
}`;

export async function listRepos(client: GitHubClient, config: MeasureConfig): Promise<string[]> {
  if (config.repos.kind === 'list') return [...config.repos.repos].sort();
  const { org, include, exclude } = config.repos;
  const inc = include.map(globToRegExp);
  const exc = exclude.map(globToRegExp);
  const out: string[] = [];
  let cursor: string | null = null;
  do {
    const data = await client.query(ORG_REPOS, { org, cursor });
    const conn = data.organization?.repositories;
    if (!conn) throw new GitHubError(`organization ${org} not found or not visible to this token`);
    for (const r of conn.nodes as Json[]) {
      if (r.isArchived) continue;
      if (inc.length && !inc.some((re) => re.test(r.name))) continue;
      if (exc.some((re) => re.test(r.name))) continue;
      out.push(r.nameWithOwner);
    }
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (cursor);
  return out.sort();
}

const PULLS = `
query($owner: String!, $name: String!, $cursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequests(first: 25, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        number createdAt mergedAt closedAt isDraft headRefName additions deletions
        author { login __typename }
        labels(first: 20) { nodes { name } }
        files(first: 100) { totalCount nodes { path additions deletions } }
        reviews(first: 100) { nodes { state submittedAt author { login __typename } } }
        commits(first: 100) { nodes { commit { message authors(first: 10) { nodes { user { login } } } } } }
        timelineItems(first: 10, itemTypes: [READY_FOR_REVIEW_EVENT]) { nodes { ... on ReadyForReviewEvent { createdAt } } }
      }
    }
  }
}`;

/** Fetches PRs created on or after `since`, newest first, until older ones appear. */
export async function fetchPulls(
  client: GitHubClient,
  repo: string,
  since: Date,
  config: MeasureConfig,
): Promise<PullRecord[]> {
  const [owner, name] = repo.split('/');
  const out: PullRecord[] = [];
  let cursor: string | null = null;
  for (;;) {
    const data = await client.query(PULLS, { owner, name, cursor });
    const conn = data.repository?.pullRequests;
    if (!conn) throw new GitHubError(`repository ${repo} not found or not visible to this token`);
    let reachedOlder = false;
    for (const node of conn.nodes as Json[]) {
      if (new Date(node.createdAt) < since) {
        reachedOlder = true;
        break;
      }
      out.push(normalisePull(node, repo, config));
    }
    if (reachedOlder || !conn.pageInfo.hasNextPage) return out;
    cursor = conn.pageInfo.endCursor;
  }
}

export function classifyActor(login: string, typename: string | undefined, agents: Set<string>): ActorKind {
  if (agents.has(normaliseLogin(login))) return 'agent';
  if (typename === 'Bot' || login.endsWith('[bot]')) return 'bot';
  return 'human';
}

const TRAILER = /^co-authored-by:\s*(.*?)\s*<([^>]*)>\s*$/gim;
const NOREPLY = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i;
const ASSISTED = /^(?:assisted-by|generated-by):/im;

/** Turns one GraphQL pull-request node into a PullRecord. Exported for tests. */
export function normalisePull(node: Json, repo: string, config: MeasureConfig): PullRecord {
  const agents = new Set(config.agents);
  const actor = (a: Json | null | undefined): Actor | null =>
    a?.login ? { login: a.login, kind: classifyActor(a.login, a.__typename, agents) } : null;

  const author = actor(node.author);
  const coAuthors = new Map<string, Actor>();
  const trailerNames: string[] = [];
  let assistedTrailer = false;
  for (const c of node.commits?.nodes ?? []) {
    const commit = c.commit ?? {};
    for (const a of commit.authors?.nodes ?? []) {
      const login: string | undefined = a.user?.login;
      if (login && login !== author?.login) {
        coAuthors.set(login, { login, kind: classifyActor(login, undefined, agents) });
      }
    }
    const message: string = commit.message ?? '';
    for (const match of message.matchAll(TRAILER)) {
      trailerNames.push((match[1] ?? '').toLowerCase());
      const noreply = NOREPLY.exec(match[2] ?? '');
      const login = noreply?.[1];
      if (login && login !== author?.login) {
        coAuthors.set(login, { login, kind: classifyActor(login, undefined, agents) });
      }
    }
    if (ASSISTED.test(message)) assistedTrailer = true;
  }

  const excluded = config.sizeExclude.map(globToRegExp);
  const files: Json[] = node.files?.nodes ?? [];
  const isExcluded = (path: string) => excluded.some((re) => re.test(path));
  const fileCount: number = node.files?.totalCount ?? files.length;
  const sizePartial = fileCount > files.length;
  let linesChanged: number;
  if (sizePartial) {
    const excludedLines = files.filter((f) => isExcluded(f.path)).reduce((s, f) => s + f.additions + f.deletions, 0);
    linesChanged = (node.additions ?? 0) + (node.deletions ?? 0) - excludedLines;
  } else {
    linesChanged = files.filter((f) => !isExcluded(f.path)).reduce((s, f) => s + f.additions + f.deletions, 0);
  }

  const reviews: Review[] = [];
  for (const r of node.reviews?.nodes ?? []) {
    const reviewer = actor(r.author);
    if (!reviewer || !r.submittedAt || r.state === 'PENDING') continue;
    reviews.push({ at: new Date(r.submittedAt), reviewer, state: r.state as ReviewState });
  }
  reviews.sort((a, b) => a.at.getTime() - b.at.getTime());

  const readyEvents: Date[] = (node.timelineItems?.nodes ?? [])
    .filter((e: Json) => e?.createdAt)
    .map((e: Json) => new Date(e.createdAt))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());
  const createdAt = new Date(node.createdAt);
  let readyAt: Date | null;
  if (readyEvents.length) readyAt = readyEvents[0]!;
  else readyAt = node.isDraft ? null : createdAt;

  return {
    repo,
    number: node.number,
    createdAt,
    readyAt,
    mergedAt: node.mergedAt ? new Date(node.mergedAt) : null,
    closedAt: node.closedAt ? new Date(node.closedAt) : null,
    author,
    coAuthors: [...coAuthors.values()].sort((a, b) => a.login.localeCompare(b.login)),
    trailerNames,
    assistedTrailer,
    labels: (node.labels?.nodes ?? []).map((l: Json) => String(l.name).toLowerCase()),
    headRef: node.headRefName ?? '',
    linesChanged: Math.max(0, linesChanged),
    sizePartial,
    reviews,
  };
}
