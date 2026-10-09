---
title: "0003: The approved object is a brief's git blob, approved by a brief-only pull request"
summary: "A spec is approved when a pull request that changes only brief files merges with an approving review from a human who did not write it. The approved version is the file's git blob SHA at that merge. Code pull requests reference `path@blob`; the gate checks the blob was approved; the evidence record links approval to change by that hash."
status: proposed
date: 2026-10-07
related:
  - ./0001-git-native-no-service.md
  - ./0004-interoperate-with-spec-formats-and-maestro.md
---

## Context

The paper's §7 moves the human decision from the code diff to the specification: approve a small,
structured, immutable version; gate the code against it; record who approved which version and what
was built against it. maestro's specs-service does this with immutable versions in a service and a
named human deciding at a gate. Its own open item is the last link — the change built against an
approved version (maestro specs ADR-0016 proposes the git-native path).

Without a service, the question is what in git is (1) immutable, (2) approved by an identifiable
human, independently of the author, and (3) referenceable from a code change.

## Decision

**Immutable: the blob SHA.** A git blob SHA is a hash of the file's content. The approved bytes cannot
change without the SHA changing.

**Approved: a brief-only pull request.** The approval is a merged PR that touches only brief paths,
with an approving review on the head by a human who is not an author or co-author of its commits.
Keeping brief PRs separate from code PRs keeps the approval about the brief — the reviewable object —
and not about a diff.

**Referenced: `Spec: path@blob`.** Code PRs carry the reference in the body or a commit trailer. The
gate (G2) resolves it and checks the blob is an approved version.

**Recorded: the evidence file.** `whosigns evidence` joins approvals and changes on the blob SHA.

## Consequences

- No new store, and the evidence can be re-derived from git history by anyone with read access.
- A brief edit after approval produces a new blob and needs a new approval. Typo fixes cost a review;
  that is the price of immutability, and the same price specs-service charges.
- Approval strength equals the git host's identity and ruleset strength. Bypasses are reported as
  exceptions, not prevented.
- Readers who outgrow this move to specs-service, where the version, the decision and the decider's
  packet live in a service of record. The record shapes are aligned (ADR-0004).
