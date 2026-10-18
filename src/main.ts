// whosigns commands. Only `measure` is built so far (spec §5, milestone M0). The executable is cli.ts.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { ConfigError, loadConfig, type MeasureConfig } from './config.js';
import { fetchPulls, GitHubClient, GitHubError, listRepos, resolveToken } from './github.js';
import { computeTeams } from './metrics.js';
import { buildJson, buildMarkdown, buildReadout, VERSION, type ReportInput } from './report.js';
import type { Period, PullRecord } from './types.js';

const HELP = `whosigns ${VERSION}

Usage:
  whosigns measure --baseline YYYY-MM-DD..YYYY-MM-DD --current YYYY-MM-DD..YYYY-MM-DD
                   [--config whosigns.yml] [--out report]

Reads pull requests from GitHub with your own read-only token (WHOSIGNS_TOKEN, GITHUB_TOKEN,
or \`gh auth token\`) and writes, per team, a before/after report and a one-page readout:
  <out>/measure-<date>.md   <out>/measure-<date>.json   <out>/readout-<date>.md

Nothing leaves your machine except the read requests to your git host. No person is named.
`;

export class UsageError extends Error {}

export function parsePeriod(text: string, label: Period['label']): Period {
  const m = /^(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})$/.exec(text);
  if (!m) throw new UsageError(`--${label} must look like 2026-07-01..2026-09-30`);
  const start = new Date(`${m[1]}T00:00:00Z`);
  const lastDay = new Date(`${m[2]}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(lastDay.getTime())) throw new UsageError(`--${label}: not a valid date`);
  if (lastDay < start) throw new UsageError(`--${label}: the end is before the start`);
  const end = new Date(lastDay.getTime() + 24 * 3_600_000);
  return { label, start, end, text };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function measure(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      config: { type: 'string', default: 'whosigns.yml' },
      baseline: { type: 'string' },
      current: { type: 'string' },
      out: { type: 'string', default: 'report' },
    },
  });
  if (!values.baseline || !values.current) throw new UsageError('--baseline and --current are both required');
  const periods: [Period, Period] = [parsePeriod(values.baseline, 'baseline'), parsePeriod(values.current, 'current')];
  if (periods[0].end > periods[1].start) throw new UsageError('the baseline must end before the current period starts');

  const config: MeasureConfig = loadConfig(values.config!);
  const log = (msg: string) => process.stderr.write(`${msg}\n`);
  const client = new GitHubClient(config.apiUrl, resolveToken(), log);

  const repos = await listRepos(client, config);
  if (repos.length === 0) throw new ConfigError('no repositories matched the configuration');
  const since = new Date(periods[0].start.getTime() - config.lookbackDays * 24 * 3_600_000);
  const prs: PullRecord[] = [];
  for (const repo of repos) {
    log(`reading ${repo}`);
    prs.push(...(await fetchPulls(client, repo, since, config)));
  }

  const input: ReportInput = {
    config,
    periods,
    repos,
    teams: computeTeams(prs, periods, config),
    sizePartialPrs: prs.filter((p) => p.sizePartial).length,
  };
  mkdirSync(values.out!, { recursive: true });
  const stamp = today();
  const files: Array<[string, string]> = [
    [join(values.out!, `measure-${stamp}.json`), buildJson(input)],
    [join(values.out!, `measure-${stamp}.md`), buildMarkdown(input)],
    [join(values.out!, `readout-${stamp}.md`), buildReadout(input)],
  ];
  for (const [path, body] of files) {
    writeFileSync(path, body);
    log(`wrote ${path}`);
  }
}

export async function main(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;
  try {
    if (!command || command === '--help' || command === '-h' || command === 'help') {
      process.stdout.write(HELP);
      return 0;
    }
    if (command === '--version' || command === '-v') {
      process.stdout.write(`${VERSION}\n`);
      return 0;
    }
    if (command === 'measure') {
      await measure(rest);
      return 0;
    }
    throw new UsageError(`unknown command "${command}"; only \`measure\` is built so far`);
  } catch (err) {
    if (err instanceof UsageError || err instanceof ConfigError || err instanceof GitHubError) {
      process.stderr.write(`whosigns: ${err.message}\n`);
      return 2;
    }
    if (err instanceof TypeError && /parseArgs|Unknown option/.test(String(err))) {
      process.stderr.write(`whosigns: ${err.message}\n`);
      return 2;
    }
    throw err;
  }
}
