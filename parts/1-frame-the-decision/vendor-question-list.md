---
item: 5
title: Vendor question list
part: 1 · Frame the decision
episodes: 1.3 Build, buy, or the AI you already switched on (later cut)
forms: PDF + DOCX (this Markdown is the source)
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: The storyline's own (paper, Part 1, Move 1 — *know what is already switched on*; Part 2, Move 2)
---

# Vendor question list

**Before you switch on an AI feature in software you already pay for — or buy a new one.** Many
organizations get their first widely used AI this way: inside the office suite, the CRM, the service
desk, the ERP or a sector platform, switched on by whoever administers it. Ask these first. Write the
answer down, with who gave it and when. *"We don't know yet"* is an answer; leave it visible.

**The feature:** ______________________ **In:** ______________________ **Asked by / on:** ______________

| # | Question | Why it matters | Answer (source, date) | A good answer looks like |
|---|---|---|---|---|
| | **What it reads** | | | |
| 1 | Which of our data does it read — fields, documents, attachments, images? | Everything it reads can end up in an answer, a log or a training set | | A list, per data type, that you can check against your data classification |
| 2 | Where is that data processed and stored, and by whom (sub-processors)? | Data protection and, in financial services, outsourcing and third-party rules | | Named locations and sub-processors, in the contract |
| 3 | Is our data used to train or improve the vendor's models? | You may be giving away what makes you different | | No, by default and in writing |
| | **What it changes** | | | |
| 4 | What can it change or trigger in our systems — fields, statuses, messages, payments? | A feature that reads is an assistant; one that acts is an agent, and needs controls | | A list of actions, each one possible to switch off on its own |
| 5 | Which of those actions are on by default, and who can switch them on? | The riskiest setting is often one administrator's tick box | | Off by default; switching on is logged and restricted |
| | **Who approves** | | | |
| 6 | Which actions does a person approve before they happen, and which after? | Decides who is accountable when it is wrong | | You can set it per action and per amount |
| 7 | Can a person see why it suggested what it did? | Without it, people either follow blindly or ignore it | | The evidence it used is shown with the suggestion |
| | **How it is evaluated** | | | |
| 8 | How was it tested, on whose data, and against what baseline? | A vendor's accuracy on other customers' data says little about yours | | A test you can run on your own cases, against your current process |
| 9 | What do we see when it is wrong, and how is that logged? | You need the errors to improve it and to answer complaints | | Every suggestion and override is logged, and you can export the log |
| 10 | How are model changes announced, and can we test them before they reach us? | A silent model update changes your product | | Advance notice, a test window, and version numbers in the log |
| | **What each use costs** | | | |
| 11 | What does one use cost — per call, per case, per seat, per tier — at our volume? | Licences hide the running cost until usage grows | | A cost per case you can put in the business case |
| | **How you leave** | | | |
| 12 | Can we switch it off without breaking the process, and export our data, rules and logs? | You need a way back to the desk, and your history | | A switch, a tested fallback, an export in a standard format |

## After the answers

| | |
|---|---|
| **Owner** — the person accountable for this feature's outcome (not its administrator) | |
| **Assistant, workflow or agent?** (Part 2) | |
| **Decision** — switch on · keep off · switch on for a test only · replace | |
| **What it must pass first** — the scorecard (Part 3) and readiness gates (Part 4) | |
| **Review date** | |
