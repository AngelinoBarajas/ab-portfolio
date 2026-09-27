# Knowledge System on this site: integration plan (prototype, waiting on Angelino's OK)

2026-09-26. The Knowledge System stops being only a case study (#04) and becomes how this site works: a shared vocabulary (Topics), a library of answers (Insights), and rows on the existing pages that fill themselves from tags. Nothing is in Webflow yet.

## 1. What to review (prototypes)

Serve `prototypes/` (the `ab-proto` launch entry, port 4420) and open:

| Page | Prototype | Webflow page | What it is |
|---|---|---|---|
| Insights library | `insights.html` | `/insights` (static) | "Field notes" hero with an **Ask the library** search console, themed library (Build notes · Why before how) with topic filters, Browse-by-topic grid (light), "How these get written" (Voice Kit + approval gate, told honestly) |
| Article template | `insight.html#<slug>` | `/insights/[slug]` (Insights template) | Answer-first: title, topic chips, **The short answer** panel, prose with § headings and code blocks, sticky "On this page" + altitude bar, Filed under, Related services, Shown in practice, Related reading (light), previous / next |
| Star chart | `topics.html` | `/topics` (static) | The vocabulary as six constellations; stars sized by links; hover/focus a star to read it (touch: first tap reads, second opens); dashed routes = topics that share a note. Phones get the list only. The full vocabulary list (real links) sits below |
| Topic template | `topic.html#<slug>` | `/topics/[slug]` (Topics template) | Definition as the lede (DefinedTerm), mini-constellation, counts, Shown in practice (mission planets), Related services (light), Field notes, Straight answers (FAQs), Nearby stars. Empty sections hide |
| Template rows | `ks-rows.html` | (review only) | What Mission, Service and Home pages gain |

Also: **Insights** joins the nav (before Contact) and the footer gains Insights + Topics (shown on these pages only for now).

Content: the 10 drafts render in full with a **Draft** badge and their review notes (prototype only). None is approved yet, so none will be imported until you mark it `status: approved`.

Regenerate after editing drafts or the vocabulary: `python prototypes/_parts/ks_data.py && python prototypes/_parts/assemble.py ks-library ks-article ks-chart ks-topic ks-rows`.

## 2. The vocabulary (needs your sign-off)

`cms/seed/_draft-topics.json`: **27 topics in 6 categories** (the CKS categories, in your voice):

| Code | Category | Terms |
|---|---|---|
| WHO | Who I build for | Creative studios · Service businesses · Mission-led teams · Agencies + partners |
| WHAT | What I build | Webflow CMS · Interactive 3D · Motion + scroll · Brand identity · Design systems |
| HOW | How it gets built | Discovery · Prototyping · Custom code · Versioned deploys · Handoff |
| WATCH | What I watch for | Mobile performance · Tap vs hover · Reduced motion · Crawlable links · Scope creep · Perceived speed |
| IDEAS | Why before how | Philosophy at work · Science of time · Asking better questions · Saying no |
| KNOWN | Known for | Search + AI answers · Knowledge System · Micro-interaction |

Each has a one-sentence definition (shown on its page and in the chart). The draft articles' free-form tags are mapped onto these (e.g. "Lenis", "GSAP", "Smooth scroll" → Motion + scroll). Tools (GSAP, Lenis, Three.js…) stay in the **Tools** collection, not the vocabulary.

## 3. CMS model

| Collection | Status | Fields |
|---|---|---|
| **Topics** (new) | 27 items | Name, Slug, Category (Option: 6), Definition (plain), Services (multi-ref → Services), Sort, Meta description |
| **Insights** (new) | import approved only | Name, Slug, Theme (Option: Build notes / Why before how), Short answer (plain, 1 paragraph), Body (Rich text), Topics (multi-ref), Services (multi-ref), Missions (multi-ref), Related reading (multi-ref → Insights, optional override), Video URL, Duration, Chapters (plain, `0:00 \| Title` lines), Reading time (number), Featured on Home (switch), Review status (Option: Draft / In review / Approved), Meta description, Social image |
| **Missions** | +1 field | Topics (multi-ref) (34 → 35 fields) |
| **FAQ** | +1 field | Topics (multi-ref) (4 → 5), so topic pages list their questions |
| **Services** | **no change** | At the 60-field cap. The relation lives on Topics (`Topic.services`); service pages list Topics and Insights *filtered by* "Services contains Current Service" |

How each list is built natively (no script-only links):

- **Topic page**: Missions list filtered *Topics contains Current Topic*; Insights list the same; FAQ list the same; Services = the Topic's own multi-ref. Nearby stars = Topics filtered *Category = Current Category* (the current one is dimmed by the script).
- **Insight page**: chips, services, missions = the item's multi-refs. Related reading = the manual multi-ref when set; otherwise a same-theme list (limit 3) and the script hides the current item.
- **Mission page**: Filed under = Mission's Topics; Field notes = Insights filtered *Missions contains Current Mission*.
- **Service page**: Topics filtered *Services contains Current Service*; Insights the same.
- **Library**: one Collection List of Insights (max 100 per list, fine for years). Theme tabs, topic filter and Ask search run in the script over `data-theme` / `data-topics` attributes; without the script every card still shows and links.
- **Star chart**: Topics lists grouped by category (the crawlable index). The script draws the SVG from a hidden `ab_cms-source` list (topic slug, category, counts).
- Card topic chips are nested lists (Insight → Topics), 3 per card.

Webflow limits checked: 20 Collection Lists per page (topic page uses 6), nested lists only through multi-refs (fine), Components can't hold lists (rows are page-level, as with the Mission cards).

## 4. Structured data (same fields, `seo/jsonld/`)

- Insight: `BlogPosting` (headline, description = Short answer, author `#person`, `about` → each Topic's `DefinedTerm` @id, `mentions` → Services/Missions), `BreadcrumbList`. Template head code, as in the Services template.
- Topic: `DefinedTerm` (name, description = Definition, `inDefinedTermSet` → `/topics#set`) + `FAQPage` when it has questions (list rendered as JSON in an Embed inside the FAQ list).
- `/topics`: `DefinedTermSet` + `CollectionPage`. `/insights`: `CollectionPage` + `ItemList`.
- `make_jsonld.py` gains the three types; pushed at launch with the rest.

## 5. How new notes get written (Voice Kit + approval gate, on your own site)

1. Notes from real builds (like this session's) → a draft in `content/insights/drafts/` in your voice (the 10 drafts are the voice sample).
2. You review in the file: edit, then `status: approved`. Anything else never reaches Webflow.
3. The import script creates the Insight as a Webflow **draft** with Review status Approved; you publish it from the Editor. Two gates, both yours.

The "How these get written" section says publicly that notes are drafted with AI help and edited and approved by you. **Say if you'd rather not disclose that**; the section can drop step 02.

## 6. Build steps (after your OK)

1. CMS: create Topics + Insights (slug-named fields, then rename), add Topics to Missions and FAQ; import the 27 Topics; tag the 4 real Missions and 25 FAQs (mapping already in the seed); import only **approved** Insights.
2. Pages: `/insights` + `/topics` static pages and the two templates via the WHTML method (build HTML → `prep.py` → builder → rebind), Designer steps for the list filters the API can't set.
3. Rows on Mission template, Services template and Home ("From the library"); Nav + Footer links (component edits).
4. Code: `ab-knowledge` JS + CSS (library filters/search, article TOC/progress, chart, topic mini-map), ES5, init guard, reduced motion; tag, SRI check, register; page scripts on the four pages.
5. JSON-LD templates; SEO titles/descriptions for the new pages; OG card (`og/build.py`, library planet).
6. Check on staging (webflow.io only), then stop for your OK.

## 7. Decisions for you

1. **Vocabulary**: OK the 27 terms, categories and definitions, or edit them in `_draft-topics.json`.
2. **Drafts**: mark the ones you approve (`status: approved`); nothing imports otherwise.
3. **Nav**: add "Insights" to the main nav (6 links), or keep it in the footer only.
4. **AI disclosure** in "How these get written": keep or drop.
5. **Home section** "From the library" (3 featured notes): yes / no.
6. **Aguirre** is noindex; it's tagged under Service businesses and Search + AI answers. Keep it on topic pages or leave it off until it's public.

Doesn't clash with `docs/kip-cks-mission-plan.md`: kip and CKS would just get Topics tags when they're built.
