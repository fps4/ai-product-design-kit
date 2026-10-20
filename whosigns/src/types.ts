// Shared types for `whosigns measure`.
//
// Logins exist only in memory, inside `Actor`. Nothing that holds an `Actor` is ever written to a
// file (spec I-2, ADR-0002); outputs are built from counts and durations only.

export type ActorKind = 'human' | 'agent' | 'bot';

export interface Actor {
  login: string;
  kind: ActorKind;
}

export type ReviewState = 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED';

export interface Review {
  at: Date;
  reviewer: Actor;
  state: ReviewState;
}

/** One pull request, normalised from the git host. */
export interface PullRecord {
  repo: string;
  number: number;
  createdAt: Date;
  /** First time the PR was ready for review; creation time if never a draft; null if still a draft. */
  readyAt: Date | null;
  mergedAt: Date | null;
  closedAt: Date | null;
  /** null when the author account was deleted. */
  author: Actor | null;
  /** Commit authors and co-authors other than the PR author, resolved to accounts. */
  coAuthors: Actor[];
  /** Lower-cased names from `Co-authored-by:` trailers. */
  trailerNames: string[];
  /** An `Assisted-by:` or `Generated-by:` trailer is present. */
  assistedTrailer: boolean;
  labels: string[];
  headRef: string;
  /** Lines added + deleted, without files matching `size.exclude`. */
  linesChanged: number;
  /** More files than the host returned; exclusions were applied to the files returned only. */
  sizePartial: boolean;
  reviews: Review[];
}

export interface Period {
  label: 'baseline' | 'current';
  /** Inclusive. */
  start: Date;
  /** Exclusive: the day after the last day given on the command line. */
  end: Date;
  /** As given, for the report: YYYY-MM-DD..YYYY-MM-DD. */
  text: string;
}
