---
title: "0001: The kit runs in git and CI; there is no service"
summary: "Every part is a CLI or a GitHub Action that reads the user's git host with the user's token and writes files. No hosted service, no database, no account, no telemetry. The governed-service path already exists in maestro; this kit is for the reader who will not deploy one to try an idea."
status: proposed
date: 2026-10-07
related:
  - ./0003-the-approved-object-is-a-spec-version-in-git.md
  - ./0004-interoperate-with-spec-formats-and-maestro.md
---

## Context

The paper's readers are Product Owners and engineering leads. The question they ask after reading it
is how to start on Monday. maestro answers the governance question properly — specs-service, the
spine, runtime-service — but it is an operations engine on AWS with an identity service, a tenant
repository and Terraform. Nobody deploys that to test whether PR size matters in their teams.

Data sensitivity points the same way. Pull-request history, review behaviour and deployment data
are internal, and in the EU, data about how individual workers perform is sensitive. Sending it to a
hosted service is a procurement and privacy conversation before it is a technical one.

## Decision

**Git and CI are the runtime.** The kit ships as an npm CLI and a GitHub Action. It reads with the
user's token and writes Markdown and JSON files the user keeps. It stores no history of its own;
before/after comparisons are computed from the git host's own history.

**No telemetry, ever.** Not opt-in, not anonymous.

**State lives in git.** The approved spec version is a git blob (ADR-0003); the evidence record is a
file attached to a release. Nothing the kit asserts needs the kit running to be checked.

## Consequences

- Adoption is a workflow file and a config file. A reader can run `measure` on a laptop in an hour.
- The kit cannot enforce anything git and the git host cannot: admins can bypass rulesets. The kit
  detects and reports bypasses after the fact; it does not pretend to prevent them.
- Long-term trend storage, cross-organization dashboards and alerting are out of scope. A user who
  needs them has outgrown the kit, and maestro or a commercial tool is the next step.
