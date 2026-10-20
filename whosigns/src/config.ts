// Loads the `measure:` block of whosigns.yml and fills in defaults (spec §5.2).

import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

export interface MarkerConfig {
  authorIsAgent: boolean;
  coAuthorTrailers: boolean;
  assistedByTrailer: boolean;
  labels: string[];
  branchPrefixes: string[];
}

export type TeamsConfig = { kind: 'repo' } | { kind: 'map'; map: Record<string, string>; fallback: string | null };

export type RepoSource = { kind: 'list'; repos: string[] } | { kind: 'org'; org: string; include: string[]; exclude: string[] };

export interface MeasureConfig {
  apiUrl: string;
  repos: RepoSource;
  teams: TeamsConfig;
  minGroupSize: number;
  thresholdLines: number;
  sizeExclude: string[];
  agents: string[];
  markers: MarkerConfig;
  deploymentsSource: string;
  failuresSource: string;
  lookbackDays: number;
}

export const DEFAULT_AGENTS = [
  'copilot',
  'copilot-swe-agent',
  'copilot-pull-request-reviewer',
  'claude',
  'devin-ai-integration',
  'chatgpt-codex-connector',
  'openai-codex',
  'cursor',
  'cursor-agent',
  'google-labs-jules',
  'gemini-code-assist',
  'coderabbitai',
  'sweep-ai',
  'aider',
];

export const DEFAULT_SIZE_EXCLUDE = [
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/poetry.lock',
  '**/Pipfile.lock',
  '**/uv.lock',
  '**/Cargo.lock',
  '**/go.sum',
  '**/composer.lock',
  '**/Gemfile.lock',
  '**/*.min.js',
  '**/__snapshots__/**',
  '**/*.snap',
];

export const DEFAULT_MARKERS: MarkerConfig = {
  authorIsAgent: true,
  coAuthorTrailers: true,
  assistedByTrailer: true,
  labels: ['ai-assisted', 'ai-generated', 'agent'],
  branchPrefixes: ['copilot/', 'codex/', 'claude/', 'cursor/', 'devin/', 'jules/'],
};

export class ConfigError extends Error {}

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function strings(v: unknown, key: string): string[] {
  if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
    throw new ConfigError(`${key} must be a list of strings`);
  }
  return v as string[];
}

function positiveInt(v: unknown, key: string): number {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) {
    throw new ConfigError(`${key} must be a whole number of at least 1`);
  }
  return v;
}

const NOT_YET = new Set(['codeowners', 'github-teams']);

export function parseConfig(text: string): MeasureConfig {
  const root: unknown = parse(text);
  if (!isObj(root) || !isObj(root.measure)) {
    throw new ConfigError('whosigns.yml needs a `measure:` block');
  }
  const m = root.measure;

  let repos: RepoSource;
  if (typeof m.repos === 'string' && m.repos.startsWith('org:')) {
    repos = { kind: 'org', org: m.repos.slice(4), include: [], exclude: [] };
  } else if (isObj(m.repos) && typeof m.repos.org === 'string') {
    repos = {
      kind: 'org',
      org: m.repos.org,
      include: m.repos.include === undefined ? [] : strings(m.repos.include, 'repos.include'),
      exclude: m.repos.exclude === undefined ? [] : strings(m.repos.exclude, 'repos.exclude'),
    };
  } else if (Array.isArray(m.repos)) {
    const list = strings(m.repos, 'repos');
    for (const r of list) {
      if (!/^[\w.-]+\/[\w.-]+$/.test(r)) throw new ConfigError(`repos: "${r}" is not owner/name`);
    }
    if (list.length === 0) throw new ConfigError('repos is empty');
    repos = { kind: 'list', repos: list };
  } else {
    throw new ConfigError('repos is required: a list of owner/name, `org:<name>`, or {org, include, exclude}');
  }

  let teams: TeamsConfig = { kind: 'repo' };
  if (m.teams === undefined || m.teams === 'repo') {
    teams = { kind: 'repo' };
  } else if (typeof m.teams === 'string' && NOT_YET.has(m.teams)) {
    throw new ConfigError(`teams: ${m.teams} is specified but not built yet; use \`repo\` or a \`map\``);
  } else if (isObj(m.teams) && isObj(m.teams.map)) {
    const map: Record<string, string> = {};
    for (const [repo, team] of Object.entries(m.teams.map)) {
      if (typeof team !== 'string') throw new ConfigError(`teams.map["${repo}"] must be a team name`);
      map[repo] = team;
    }
    const fallback = m.teams.default;
    if (fallback !== undefined && typeof fallback !== 'string') throw new ConfigError('teams.default must be a team name');
    teams = { kind: 'map', map, fallback: fallback ?? null };
  } else {
    throw new ConfigError('teams must be `repo` or {map: {owner/name: team}, default: team}');
  }

  const size = isObj(m.size) ? m.size : {};
  const ai = isObj(m.ai_assisted) && isObj(m.ai_assisted.markers) ? m.ai_assisted.markers : {};
  const markers: MarkerConfig = {
    authorIsAgent: ai.author_is_agent === undefined ? DEFAULT_MARKERS.authorIsAgent : Boolean(ai.author_is_agent),
    coAuthorTrailers: ai.co_author_trailers === undefined ? DEFAULT_MARKERS.coAuthorTrailers : Boolean(ai.co_author_trailers),
    assistedByTrailer: ai.assisted_by_trailer === undefined ? DEFAULT_MARKERS.assistedByTrailer : Boolean(ai.assisted_by_trailer),
    labels: ai.labels === undefined ? DEFAULT_MARKERS.labels : strings(ai.labels, 'ai_assisted.markers.labels'),
    branchPrefixes:
      ai.branch_prefixes === undefined ? DEFAULT_MARKERS.branchPrefixes : strings(ai.branch_prefixes, 'ai_assisted.markers.branch_prefixes'),
  };

  const source = (block: unknown, key: string): string => {
    if (block === undefined) return 'none';
    if (!isObj(block) || typeof block.source !== 'string') throw new ConfigError(`${key}.source must be a string`);
    return block.source;
  };

  const github = isObj(m.github) ? m.github : {};
  const apiUrl = typeof github.api_url === 'string' ? github.api_url : 'https://api.github.com/graphql';

  return {
    apiUrl,
    repos,
    teams,
    minGroupSize: m.min_group_size === undefined ? 5 : positiveInt(m.min_group_size, 'min_group_size'),
    thresholdLines: size.threshold_lines === undefined ? 400 : positiveInt(size.threshold_lines, 'size.threshold_lines'),
    sizeExclude: size.exclude === undefined ? DEFAULT_SIZE_EXCLUDE : strings(size.exclude, 'size.exclude'),
    agents: (m.agents === undefined ? DEFAULT_AGENTS : strings(m.agents, 'agents')).map(normaliseLogin),
    markers,
    deploymentsSource: source(m.deployments, 'deployments'),
    failuresSource: source(m.failures, 'failures'),
    lookbackDays: m.lookback_days === undefined ? 90 : positiveInt(m.lookback_days, 'lookback_days'),
  };
}

export function loadConfig(path: string): MeasureConfig {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new ConfigError(`cannot read ${path}`);
  }
  return parseConfig(text);
}

/** `Foo[bot]` and `foo` are the same account for matching purposes. */
export function normaliseLogin(login: string): string {
  return login.toLowerCase().replace(/\[bot\]$/, '');
}

/** The team a repository's PRs count towards, or null when the repo is not mapped. */
export function teamFor(teams: TeamsConfig, repo: string): string | null {
  if (teams.kind === 'repo') return repo;
  return teams.map[repo] ?? teams.fallback;
}

/** Minimal glob: `**` spans directories, `*` and `?` do not. */
export function globToRegExp(glob: string): RegExp {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]!;
    if (c === '*' && glob[i + 1] === '*') {
      if (glob[i + 2] === '/') {
        re += '(?:.*/)?';
        i += 2;
      } else {
        re += '.*';
        i += 1;
      }
    } else if (c === '*') {
      re += '[^/]*';
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}
