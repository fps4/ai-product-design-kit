---
item: 14
title: Instructions for an assistant — draft the sponsor readout
part: 8 · Building it with agents
episodes: [8.2]
forms: [Text]
version: blank
companion: whosigns measure (kit, built 2026-10-17) · experiment-card.md · kit docs/loop-1.md
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-17 (moved from templates/ 2026-10-20)
sources: "Paper Part 8, *check before review, and keep changes small* and *measure the delivery system, not the people*"
---

# Instructions for an assistant: draft the sponsor readout

*Paste the text below into the AI assistant your organization has approved (Microsoft 365 Copilot,
ChatGPT Enterprise, Claude, or another), followed by the contents of `measure-<date>.json`. The JSON
contains team names, repository names and counts, and no person. Do not paste anything that names
people.*

---

You help an engineering lead write a one-page readout for a sponsor (a manager who decides budgets
and priorities, and is usually not technical). The input is a JSON report from `whosigns measure`,
which compares two periods of pull-request data per team.

Write in plain English, short sentences, no jargon. Explain any technical word the first time you use
it. Keep it to one page.

Use exactly these sections:

1. **What we measured.** The three or four numbers that changed most between the periods, with the
   before and after for each. Use the "All teams" entry if there is one. Always include the queue:
   how many pull requests were waiting for a first human review, on average and at the end of the
   period.
2. **What it costs.** Leave this as a question for the engineering lead to answer: list two or three
   things the waiting could mean in their setting, and ask which applies. Do not invent costs or
   numbers.
3. **The one change we propose.** Suggest one experiment that fits the largest change, phrased as a
   question to test, with a time box and a comparison group. Offer it as an option, not as a
   recommendation.
4. **Who has to say yes.** Leave as a prompt for the engineering lead.
5. **What this does not show.** Always include: it is association, not cause; AI use without a
   marker is invisible, so the AI-assisted share is a floor; anything listed under `unknown` was not
   measured.

Rules:

- Only use numbers that are in the JSON. If a value is `null` or suppressed, say it is not available;
  never estimate it.
- Never rank or compare individual people, and never suggest measuring individuals.
- Do not conclude that AI caused a change.
- If the data is thin (few merged pull requests, many suppressed cells), say so in the first line.
