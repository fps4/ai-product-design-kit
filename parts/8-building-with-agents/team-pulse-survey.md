---
item: 12
title: Team pulse survey
part: 8 · Building it with agents
episodes: [8.6, 8.2]
forms: [Markdown, form-tool import (to build)]
version: blank
companion: kit docs/spec.md §5.5 (whosigns measure --survey, specified, not built) · experiment-card.md
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: "Paper Move 9 · DORA, Choosing measurement frameworks to fit your organizational goals (2025)"
---

# Team pulse survey

*Eight questions, anonymous, read per team beside the delivery numbers. Logs show what happened;
people tell you why. Neither is objective alone — DORA's measurement guidance warns that it is a
common misconception that logs-based metrics are objective.*

## Rules

- **Anonymous.** No name, no login, no email collected. Turn off anything in the form tool that
  records who answered.
- **Per team, never per person.** Results are shown only for a team with **five or more** answers.
  Below five, the team's answers are merged into "other teams" or not shown.
- **Free text is read, not published.** Summarise the open question in themes; never quote a line
  that could identify who wrote it.
- **Same questions, same time of the period.** Ask in the last two weeks of the baseline quarter and of
  the current quarter, or at the start and end of an experiment.
- **Say why you ask, and what you will do with it.** Share the team results with the team first.
- **In the Netherlands, involve the works council** before measuring teams, even at team level.
  <!-- TO CONFIRM: evidence R10 (WOR Art. 27(1)(l)) -->

## The questions

*Scale for questions 1–7: 1 = strongly disagree · 2 · 3 · 4 · 5 = strongly agree, plus "does not apply
to me". Ask about the last four weeks.*

| # | Question | Reads beside |
|---|---|---|
| 1 | **Speed.** "Our team delivers working changes faster than a year ago." | Lead time, throughput |
| 2 | **Review load.** "Reviewing AI-written changes takes a large part of my week." | Pickup time, the review queue |
| 3 | **Review confidence.** "When I approve an AI-written change, I am confident our review would have caught a real problem in it." | Merged without human approval, change size |
| 4 | **Trust.** "I trust the code AI tools produce for our work without checking it line by line." | Change failure rate |
| 5 | **Briefs.** "Agents or AI tools often build something other than what was meant, because the brief left something out." | Restarts, rework |
| 6 | **Redo.** "I often have to redo or throw away AI-written work." | Rework rate |
| 7 | **Size.** "A hard limit on the size of a change would make our reviews better." | Share of changes over the limit |
| 8 | **Open.** "What is the one thing that slows our team down most right now?" | — |

## Reading the results

- **Put each answer beside its number.** A team that feels faster (1) while its queue grows tells you
  something neither shows alone.
- **Watch question 3 against question 2.** High review load and low confidence is the review
  bottleneck as people feel it.
- **Watch question 4 for both ends.** Very low trust wastes the tools; very high trust with low review
  confidence is automation bias.
- **Compare a team with itself over time**, not teams with each other. Teams differ in work, not only in
  practice.
- **Association, not cause.** Many things change in a quarter.

## Results table (per team)

| Team | Answers | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Themes from Q8 |
|---|---|---|---|---|---|---|---|---|---|
| *(team)* | *(n ≥ 5)* | *(median, and share 4–5)* | | | | | | | |
| *Other teams (merged, n < 5 each)* | | | | | | | | | |
