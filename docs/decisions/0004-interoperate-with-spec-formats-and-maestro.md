---
title: "0004: Interoperate with spec-kit, OpenSpec and maestro; invent as little as possible"
summary: "The brief template is the paper's four parts as YAML front-matter, but the kit will read OpenSpec requirement/scenario blocks and spec-kit spec files rather than ask teams to convert. Acceptance criteria use GIVEN/WHEN/THEN. Lint findings use the shape maestro specs-service's evaluator endpoint accepts, and evidence records align with its decision record."
status: proposed
date: 2026-10-07
related:
  - ./0003-the-approved-object-is-a-spec-version-in-git.md
---

## Context

Spec-driven development already has tools: GitHub's spec-kit and Fission-AI's OpenSpec are folder
conventions and prompt workflows that many teams using agents have adopted. They help authoring; by
design they have no independent approval and no gate. maestro specs ADR-0018 reached the same
conclusion for that service: interoperate, do not adopt.

A kit that demands its own format loses every team that already chose one, and the paper's argument
is not about the format. It is about the four parts being present, a human approving a fixed version,
and the code being held to it.

## Decision

1. **Own template, minimal.** The brief template is the four parts plus the fields the six checks
   need. Acceptance criteria are GIVEN/WHEN/THEN (EARS-style statements allowed).
2. **Read the others (later milestone).** Importers map spec-kit `spec.md` sections and OpenSpec
   requirement/scenario blocks onto the four parts; the linter then runs on the mapped result and
   reports fields the source format has no place for.
3. **Speak maestro.** `whosigns lint --format maestro` emits findings in the specs-service evaluator
   `endpoint` response shape, so the same rules can gate a brief there. Evidence fields (approved
   version, accountable human, independence) follow the specs-service decision record, so a team can
   move from the kit to the service without losing its history's meaning.

## Consequences

- The kit stays small: no authoring workflow, no prompts, no folder convention beyond `briefs/`.
- Mapping other formats is lossy; the linter makes the loss visible instead of hiding it.
