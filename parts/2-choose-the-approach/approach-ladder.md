---
item: 19
title: Approach ladder card
part: 2 · Choose the approach
episodes: 2.1 Start at the bottom of the ladder · 2.2 Assistant, workflow, agent
forms: PDF + PPTX
version: blank
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20
sources: Zinkevich, Rules of Machine Learning (Google), rules #1 and #3 · Schluntz & Zhang, Building effective agents (Anthropic, 2024)
---

# Approach ladder card

*Start at the bottom. Climb a rung only when the one below fails on the scorecard — a measured
result, not a preference.* Filled-in example: [`approach-ladder.claims.md`](./approach-ladder.claims.md).

## Side 1 · The ladder

| Rung | What it is | Data it needs | Cost each time it runs | Explaining a decision | Skills to build and run | Climb from here when… |
|---|---|---|---|---|---|---|
| **4 · Adapted model** | A foundation model trained further on your own material | Large, clean, labelled examples of your own; a new round each time the base model changes | High to build; per use like rung 3 | Hardest: two layers of training to account for | ML engineers, training data, evaluation per release | — the top. Ask whether rung 3 with better instructions or documents was really tried |
| **3 · Foundation model through an API** | A large general model used as a service; reads and writes text, reads images | Few or no labels to start; your documents, at the moment it answers; a scorecard to test it | Paid per use; grows with the length of what it reads | Hard: it can say why, but its answer to *why* is also generated | Engineers who build with it, evaluation, a data agreement with the provider | …your own material is so specific that instructions and documents are not enough, *on the scorecard* |
| **2 · Classical model** | Learns a score from tables: history, amounts, types | Labelled history — past cases with the right outcome | Close to nothing | Moderate: which inputs moved the score | Data scientist, data engineer, someone to monitor it | …the input is open text, documents or images, not tables |
| **1 · Rule** | A few lines someone can read and change | None to start; the expert who knows the cases | Nothing | Easy: the rule is the explanation | The process expert and whoever maintains the system | …the rule grows to dozens of lines, or its errors cost more than a model would |

*Rule of thumb for the shape of the problem:* tables favour rung 2; open-ended text, documents and
images favour rung 3. One product often uses several rungs, one per step.

## Side 2 · Your product, step by step

*Break the product into steps first. Then place each step on a rung, and say which of the three it
is.*

| Step of the product | Rung chosen | Why not the rung below? *(the scorecard result)* | Assistant · workflow · agent? | What it may do by itself | Owner |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
| | | | | | |

> *Margin example (claims case):* **Small simple claims** → rung 1, rule · *bottom rung — nothing to
> beat yet; the rule becomes the baseline* · workflow · *pays up to €300 under the rule's three
> conditions* · head of claims.

## The three words

| | **Assistant** | **Workflow with an AI step** | **Agent** |
|---|---|---|---|
| Who acts | The person | The process, on a path written in advance | The AI, choosing its own next steps |
| What can go wrong | A wrong draft the person did not check | A wrong classification passed downstream | A wrong action taken, at scale |
| Main control | The person's judgement and a usage policy | A scorecard on the AI step | Limited permissions and human approval of consequential actions |

**Where a workflow acts by itself** — pays, sends, changes a record with no person looking — that
step gets the agent's controls. *The control follows who acts, not what the vendor calls it.*

## Questions for the next proposal

1. Which rung is each step on, and why not the one below?
2. What did the rung below fail on — which row of the scorecard?
3. Which of the three is each step: assistant, workflow or agent?
4. Where does the system act by itself, and what limits that action?
5. Build, buy or API — decided per layer? A bought module still needs your scorecard, permissions and
   approval rules.

---

*Sources:* M. Zinkevich, *Rules of Machine Learning* (Google for Developers): rule #1 *"Don't be afraid
to launch a product without machine learning"*, rule #3 *"Choose machine learning over a complex
heuristic"*. E. Schluntz & B. Zhang, *Building effective agents* (Anthropic, 19 December 2024): workflows
follow predefined paths; agents direct their own process and tool use. The *assistant* column and the
cost ranges are this card's own synthesis.
