---
item: 6
title: Glossary cards — say / mean / ask
part: 2 · Choose the approach
episodes: 2.2 Assistant, workflow, agent (used throughout the storyline)
forms: PDF, EN + NL (one card per term, printable 3 × 3 per page)
version: 'blank (EN) — Dutch in glossary-cards.nl.md'
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Terms and plain meanings from the AI Product Design terminology; workflow / agent distinction after Schluntz & Zhang, Building effective agents (Anthropic, 2024); ladder after Zinkevich, Rules of Machine Learning (Google)
---

# Glossary cards — say / mean / ask

*Twenty-one terms you will hear in AI proposals and vendor meetings. **Say:** what you will hear.
**Mean:** what it means in plain words. **Ask:** the question that turns it into a decision.* Start with
the first three; they decide which controls apply. Nederlands: [`glossary-cards.nl.md`](./glossary-cards.nl.md).

## The three words

| # | Say | Mean | Ask |
|---|---|---|---|
| 1 | **Assistant**, copilot | AI that helps one person while they work. The person reads the result and acts | *Who checks the draft before it leaves the building — and do they have time to?* |
| 2 | **Workflow**, AI automation | A fixed process, written in advance, with an AI step inside it | *Which step is the AI, and what is its score on our scorecard?* |
| 3 | **Agent**, agentic AI | AI that chooses its own next steps and takes them in your systems | *What can it read, what can it change, who approves its actions, and how do we switch it off?* |
| 4 | **Autonomous**, end to end | Nobody looks before it acts — at least for some cases | *Which actions happen with no person looking, and what limits them?* |

## The ladder

| # | Say | Mean | Ask |
|---|---|---|---|
| 5 | **Rule-based**, business rules | A few lines someone can read and change | *Have we tried a rule first? What did it get wrong?* |
| 6 | **Machine learning model**, predictive model | Learns a score from tables of past cases | *Which past cases did it learn from, and who decided what the right outcome was?* |
| 7 | **Foundation model**, LLM, generative AI | A large general model used as a service; reads and writes text, reads images | *Why not something simpler — what did the rung below fail on?* |
| 8 | **Fine-tuned**, custom model | The general model trained further on your own material. Rarely the answer | *What did instructions and documents fail to do, on the scorecard?* |
| 9 | **"Trained on your data"** | Almost always wrong. It is handed excerpts of your documents at the moment it answers | *Is it trained on our data, or does it look things up? Where does our data go?* |

## Knowledge and answers

| # | Say | Mean | Ask |
|---|---|---|---|
| 10 | **RAG**, grounded, knowledge base | The system looks things up in your own documents at the moment it answers | *Which version of the document does it read, and is the asker allowed to see it?* |
| 11 | **Hallucination** | Confidently wrong | *How often, on our cases — and what does the user see when it happens?* |
| 12 | **Context window** | How much it can hold in its head at once | *What happens to the part that does not fit?* |

## Measuring it

| # | Say | Mean | Ask |
|---|---|---|---|
| 13 | **Accuracy**, 95% accurate | The share it got right — which can hide the mistakes that cost most | *Accurate compared to what? What does each kind of mistake cost us?* |
| 14 | **Evals**, benchmark | A scorecard you agree before you build | *Is it our scorecard, on our cases, agreed before the demo?* |
| 15 | **Baseline** | How well today's process does, errors included | *What does today's process get wrong, and what does it cost?* |
| 16 | **Threshold**, confidence score | The line where it stops deciding by itself, set by what each mistake costs | *Who signs the threshold, and can it change without them?* |
| 17 | **Drift** | The world moved; the model did not | *Who notices, how, and how fast?* |

## Running it

| # | Say | Mean | Ask |
|---|---|---|---|
| 18 | **Human in the loop** | A person approves before it acts | *What stops the loop from becoming a rubber stamp?* |
| 19 | **Guardrails** | The limits on what it is allowed to do or say | *Are the limits in the system it calls, or only in its instructions?* |
| 20 | **Tokens**, inference cost | What it costs every time someone uses it | *What does one use cost, and what is it at our volume?* |
| 21 | **Integrations**, connectors, MCP, API | How it connects to your systems | *Which systems, read or write, and under whose identity?* |

---

*Use them in a meeting:* pick the three or four that match the proposal on the table and lay them out
before the vendor speaks. Card 3 first.

*Sources:* plain meanings from the AI Product Design terminology table. The workflow / agent line
follows E. Schluntz & B. Zhang, *Building effective agents* (Anthropic, 2024). The ladder (cards 5–8)
follows M. Zinkevich, *Rules of Machine Learning* (Google).
