---
item: 6
title: Begrippenkaarten — zeggen / betekenen / vragen
part: 2 · Kies de aanpak (Choose the approach)
episodes: 2.2 Assistant, workflow, agent (en de hele reeks)
forms: PDF, EN + NL (één kaart per begrip, 3 × 3 per pagina)
version: 'NL — English in glossary-cards.md'
licence: CC BY 4.0 · AI Product Design · faridgurbanov.com
status: Draft v0.1 · 2026-10-20 · Dutch to be checked by a native speaker
sources: Terms and plain meanings from the AI Product Design terminology; workflow / agent distinction after Schluntz & Zhang, Building effective agents (Anthropic, 2024); ladder after Zinkevich, Rules of Machine Learning (Google)
---

# Begrippenkaarten — zeggen / betekenen / vragen

*Eenentwintig begrippen die je hoort in AI-voorstellen en gesprekken met leveranciers. **Zeggen:** wat
je hoort. **Betekenen:** wat het in gewone woorden is. **Vragen:** de vraag die er een besluit van
maakt.* Begin met de eerste drie; die bepalen welke controles gelden. English:
[`glossary-cards.md`](./glossary-cards.md).

## De drie woorden

| # | Zeggen | Betekenen | Vragen |
|---|---|---|---|
| 1 | **Assistent**, copilot | AI die één persoon helpt bij het werk. De persoon leest het resultaat en handelt | *Wie controleert het concept voordat het de deur uitgaat — en heeft die daar tijd voor?* |
| 2 | **Workflow**, AI-automatisering | Een vast proces, vooraf vastgelegd, met een AI-stap erin | *Welke stap is de AI, en hoe scoort die op onze scorekaart?* |
| 3 | **Agent**, agentic AI | AI die zelf de volgende stappen kiest en die uitvoert in je systemen | *Wat mag hij lezen, wat mag hij wijzigen, wie keurt zijn acties goed, en hoe zetten we hem uit?* |
| 4 | **Autonoom**, end-to-end | Niemand kijkt voordat het systeem handelt — in elk geval bij een deel van de gevallen | *Welke acties gebeuren zonder dat iemand kijkt, en wat begrenst ze?* |

## De ladder

| # | Zeggen | Betekenen | Vragen |
|---|---|---|---|
| 5 | **Regelgebaseerd**, bedrijfsregels | Een paar regels die iemand kan lezen en aanpassen | *Hebben we eerst een regel geprobeerd? Wat ging daar mis?* |
| 6 | **Machine-learningmodel**, voorspellend model | Leert een score uit tabellen met eerdere gevallen | *Van welke eerdere gevallen heeft het geleerd, en wie bepaalde wat de juiste uitkomst was?* |
| 7 | **Foundation model**, LLM, generatieve AI | Een groot algemeen model, afgenomen als dienst; leest en schrijft tekst, leest beelden | *Waarom niet iets eenvoudigers — waar faalde de trede eronder op?* |
| 8 | **Fine-tuned**, eigen model | Het algemene model verder getraind op je eigen materiaal. Zelden het antwoord | *Wat lukte er niet met instructies en documenten, op de scorekaart?* |
| 9 | **"Getraind op jullie data"** | Bijna altijd onjuist. Het krijgt fragmenten van je documenten op het moment dat het antwoordt | *Is het getraind op onze data, of zoekt het dingen op? Waar gaat onze data naartoe?* |

## Kennis en antwoorden

| # | Zeggen | Betekenen | Vragen |
|---|---|---|---|
| 10 | **RAG**, kennisbank | Het systeem zoekt op het moment van antwoorden in je eigen documenten | *Welke versie van het document leest het, en mag de vrager die zien?* |
| 11 | **Hallucinatie** | Vol overtuiging fout | *Hoe vaak, op onze gevallen — en wat ziet de gebruiker als het gebeurt?* |
| 12 | **Contextvenster** | Hoeveel het tegelijk kan onthouden | *Wat gebeurt er met het deel dat niet past?* |

## Meten

| # | Zeggen | Betekenen | Vragen |
|---|---|---|---|
| 13 | **Nauwkeurigheid**, 95% accuraat | Het aandeel dat goed is — dat kan de duurste fouten verbergen | *Nauwkeurig vergeleken met wat? Wat kost elke soort fout ons?* |
| 14 | **Evals**, benchmark | Een scorekaart die je afspreekt vóórdat je bouwt | *Is het onze scorekaart, op onze gevallen, afgesproken vóór de demo?* |
| 15 | **Nulmeting**, baseline | Hoe goed het huidige proces het doet, fouten inbegrepen | *Wat doet het huidige proces fout, en wat kost dat?* |
| 16 | **Drempelwaarde**, betrouwbaarheidsscore | De grens waar het stopt met zelf beslissen, bepaald door wat elke fout kost | *Wie tekent voor de drempel, en kan die veranderen zonder hen?* |
| 17 | **Drift** | De wereld veranderde; het model niet | *Wie merkt het, hoe, en hoe snel?* |

## In gebruik

| # | Zeggen | Betekenen | Vragen |
|---|---|---|---|
| 18 | **Human in the loop** | Een mens keurt goed voordat het systeem handelt | *Wat voorkomt dat die goedkeuring een stempel wordt?* |
| 19 | **Guardrails**, vangrails | De grenzen van wat het mag doen of zeggen | *Zitten de grenzen in het systeem dat het aanroept, of alleen in de instructies?* |
| 20 | **Tokens**, gebruikskosten | Wat het kost elke keer dat iemand het gebruikt | *Wat kost één keer gebruiken, en wat is dat bij ons volume?* |
| 21 | **Integraties**, connectoren, MCP, API | Hoe het met je systemen verbonden is | *Welke systemen, lezen of schrijven, en onder wiens identiteit?* |

---

*In een overleg:* kies de drie of vier kaarten die bij het voorstel op tafel passen en leg ze neer
voordat de leverancier begint. Kaart 3 eerst.

*Bronnen:* gewone betekenissen uit de AI Product Design-terminologie. Het onderscheid workflow / agent
volgt E. Schluntz & B. Zhang, *Building effective agents* (Anthropic, 2024). De ladder (kaarten 5–8)
volgt M. Zinkevich, *Rules of Machine Learning* (Google).
