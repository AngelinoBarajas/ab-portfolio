# Knowledge System mission: plan (draft for Angelino's OK, 2026-09-25)

A new Missions item on the Mission template. Sources read: the Aguirre client portal (`aguirre-content-system-portal_8.html`), `5TEN_next-phase.html`, `5TEN_build-map.md`, the Aguirre resources build spec + handoff, the `connected-content-system` skill.

**Generic client.** Everything on the page is written for a generic client ("your site", "your firm", `yoursite.com`). No Aguirre or 5 TEN names, terms, articles, prices or numbers show in the copy or the scenes. The scenes use neutral example content that fits any service business (see each channel).

## 1. Identity

| Field | Proposal |
|---|---|
| Name | **Knowledge System** |
| Slug | `knowledge-system` |
| Client | `Add-on · for any Webflow site` |
| Role | Strategist + designer + developer |
| Year | 2026 |
| Platform | Webflow CMS · portable |
| Status | **In orbit** (offered and being installed, not a finished public site) |
| Number / sort | **04**, after AB Identity. Placeholders move to 05–07 |
| Types | Content system, CMS, Development (existing Mission Types, no new ones) |
| Services (related) | Advanced CMS integrations, Webflow development, Design systems |
| Stack (Tools) | Webflow CMS, Client-First, Finsweet, GitHub + **new Tools item "Claude"** (icon `spark`) for the Voice Kit drafting |
| Cover | kind **Image**: a still of the knowledge-graph scene, rendered headless and uploaded |
| Live URL | empty (no public page of its own) |
| Featured on Home board | off (it has no live site to preview) |

**Planet**: a violet "knowledge" gas giant, distinct from the other four.
- planet-type `gas` · colors `#120e2a,#2a2263,#5b4bd6,#a597ff,#ece8ff`
- ring `#a597ff,#4C8DFF,#2a2263` · glow `rgba(165,151,255,.35)`
- brand-bg `#0d0b1f` · brand-fg `#ece8ff` · brand-accent `#a597ff` (scenes' `--acc`) · accent-2 `#4C8DFF`

**Summary (hero)**
> A connected content system for your site. Every service, project, answer and video links to the ideas it proves, so people, Google and AI assistants can follow what you know. Built natively on the Webflow CMS and portable to any platform, with a Voice Kit that drafts in your voice and publishes nothing you haven't approved.

**Objective, cadet**: Turn a site that lists what you do into one that explains how it all connects, and make every new article strengthen everything already there.
**Objective, engineer**: A shared vocabulary as a Topics collection, multi-reference tags on every content type, templates that assemble their own related sections, JSON-LD generated from the same fields, and an AI drafting pipeline with a human approval gate.

**Params** (one per line, shown as "All N met")
1. Built on native Webflow CMS collections, no plugin lock-in
2. Tag an entry once; every related section builds itself
3. Nothing publishes without the client's approval
4. Every video has a written twin
5. The model ports to any CMS

**Handoff**: A signed-off vocabulary, templates that build themselves from tags, and a Voice Kit, so every draft already sounds like you.

**Quote**: none unless you want one of yours (don't want to invent one).

## 2. Monitor channels (coded animated scenes, like Sketches / Illustrator)

All six are new scene builders in `code/src/mission/21-knowledge.js` (kept out of `20-scenes.js`, which is already 668 lines), drawn on the same 1200×750 / 640×800 stage, with play/pause + phase chips, `prefers-reduced-motion` rest frames and the loop fade. CMS items use kind `cms` and the **channel id** picks the scene (same trick as `sketch`/`vector`). Visual language: the site's dark Figma-canvas UI, the mission's violet accent, the orange cursor.

| # | Channel id | Name | Phase chips | What plays |
|---|---|---|---|---|
| 1 | `graph` | Knowledge graph | Vocabulary · Tag · Connect | Six category rings fade in (Who you help · Services · How it works · What you watch for · Ideas · Known for) with starter terms. A new article card drops in, a cursor tags it with 3 terms, and edges light up to a service page, two projects and two FAQs. A counter ticks "links built: 0 → 9" and a caption reads "Tagged once. Linked everywhere." |
| 2 | `library` | Insights library | Library · Filter · Answer | A blog feed (dated posts) folds into a themed, dateless library grid. Theme chips filter it (FLIP). One card opens to an article page: answer-first paragraph highlighted ("the part AI quotes"), then "Related services", "Shown in practice" and "Related reading" rows filling from tags. |
| 3 | `voice` | Voice Kit | Capture · Draft · Review · Publish | Three kit inputs fill (a pasted writing sample, a voice-memo waveform recording, preference toggles "We / Warm"). They compress into a "Voice profile" card. An AI panel drafts an article line by line. Then **your review**: strike-throughs, a comment bubble, an inline edit by "You". A status pill moves Draft → In review → Approved; only then does the Publish button enable. Caption: "Nothing goes live without your OK." Side-by-side "generic AI" vs "in your voice" line for contrast. |
| 4 | `setup` | Set up once, update in minutes | Set up · Add an entry · It connects | A setup checklist ticks off (collections, vocabulary, templates, schema). Then a Webflow-style CMS editor: "New Insight" form fills (title, theme, topics multi-select, video URL), Publish. Cut to the site: the library gains a card, the topic page's "Related reading" count goes 2 → 3, a project page's "Related thinking" row updates. No code shown anywhere in the editor half. |
| 5 | `video` | Video with chapters | Paste a link · Chapters · Written twin | The CMS fields `Video URL`, `Duration`, `Chapters` (`0:00 \| The premise` lines) turn into a player with chapter chips; the cursor clicks a chip and the scrubber jumps. Below, the written twin scrolls in ("what the machines can quote"). Last beat: video field cleared → the page leads with the text and nothing looks broken. |
| 6 | `schema` | Schema + answer engines | Structured data · Search · AI answers | A code panel generates JSON-LD from the same fields (`Article`, `DefinedTerm`, `FAQPage`, `Organization` with `sameAs`). Then a generic search result with the page title/description, then an assistant-style answer card citing `yoursite.com/insights/...` as a source. Labeled "Illustration" on the stage, since no real result is being claimed. |

Channel captions (CMS `caption`) are one sentence each, same style as the others.

Optional 7th (say if you want it): `portable`: the same Topics / Insights / References model shown as a Webflow Collection, then the same shapes in WordPress, Sanity and Markdown front-matter. Otherwise "portable" lives in a system card and a manifest tile only.

## 3. Mission Systems (6)

| Name | Tag | Channel | Cadet line |
|---|---|---|---|
| The shared vocabulary | CMS · Topics | graph | 30–60 terms in six categories name what you do. Every page, project and article points to the same words. |
| Tag once, connect everywhere | Multi-reference | graph | Tag an entry with a few terms and its "related" sections, topic pages and hub fill themselves. |
| The Insights library | Filterable · evergreen | library | The blog becomes a library of answers, organized by theme instead of by date. |
| Voice Kit + approval gate | AI · review | voice | A 10–15 minute kit captures how you write and talk; AI drafts from it; you edit and approve every piece. |
| Video-first entries | Video · chapters | video | Paste a video link and chapters; the page leads with the film and keeps a written twin below it. |
| Structured data layer | JSON-LD · AEO | schema | The same fields generate the schema search engines and AI assistants read. |

Engineer lines + snippets: real code from the builds (the chapters parser from the 5 TEN build map, a JSON-LD template, a Collection List filter description). Glossary terms via `[[...]]`: AEO, JSON-LD, multi-reference, entity, schema (new Glossary items where missing).

## 4. Problems solved (5)

| Code | Who | Problem → fix → result (short) |
|---|---|---|
| `NOT-IN-THE-ANSWER` | client | AI assistants and search couldn't tell what the business actually knows → named concepts, connected to proof, in readable text → the site reads as a defined authority (honest wording: a compounding asset over months, not a ranking switch) |
| `BLOG-NOBODY-FINDS` | visitors | A dated feed buries the best answers → a themed, filterable library of evergreen answers → visitors find the answer, then the service behind it |
| `NO-TIME-TO-WRITE` | client | Writing takes a week nobody has, and generic AI copy sounds like everyone else → Voice Kit + AI drafts from your own material → you review instead of writing from a blank page, and nothing publishes without you |
| `UPDATES-NEED-A-DEV` | client | New content meant a developer → one CMS entry, tagged once → every link, list and schema updates on publish |
| `VIDEO-OFF-SITE` | visitors | Videos lived on YouTube, invisible to search → video-first entries with chapters and a written twin → people watch or read, and machines can quote it |

## 5. Manifest (tiles in the site's design language)

Uses the identity-style `ART` tiles (a small coded glyph per tile) via a new `isSystem` branch, title "The whole system" and label "parts" instead of "pages".

**Pages / parts (12)**: Shared vocabulary · Topic pages · Insights library · Article template (video-first) · "This demonstrates" sections · Related rows · Expertise hub · Voice Kit · Editorial plan · Review + approval · Structured data · Local foundation checklist

Tile art: node graph, category rings, filter chips, video frame with chapter ticks, tag chips, stacked related cards, hub index, waveform, checklist, diff with strike-through, `{ }` JSON, map pin.

**Collections (4)**: Topics · Insights · Related Topics (on existing collections) · FAQs

## 6. Telemetry (honest, no invented results)

Nothing measured yet (no ranking or traffic data), so the stats describe how the system works, not outcomes:

| Value | Label |
|---|---|
| 6 | vocabulary categories |
| 1 | CMS entry per article, every link builds itself |
| 15 | minutes (at most) to fill the Voice Kit |
| 0 | drafts published without your approval |

Real numbers you could give me instead: sites running it (2?), terms in the largest vocabulary (58), tags written on the first install (117), starter articles planned. Say which you're OK showing, even genericized.

## 7. Build steps (after OK)

1. CMS: Tools › Claude; Missions item (draft off, Hide from site off); 6 Mission Channels; 6 Systems; 5 Problems; 4 Stats; Glossary terms; renumber placeholders 05–07.
2. Code: `21-knowledge.js` scenes + `MOCKS['knowledge-system']`, 30-mission channel-id map, 40-monitor TYPE/KIND/NEED labels, manifest `isSystem` + ART tiles, CSS in `ab-mission.css`. ES5, reduced motion.
3. Harness screenshots of every scene at each phase (landscape + portrait); fix, then render the cover still.
4. Deploy v0.5.0: build, tag, push, verify jsDelivr sha384 vs `sri.json`, re-register `ABMission` (+ core if touched), publish **webflow.io only**.
5. Check `/work/knowledge-system` on staging (monitor, systems, manifest, stats, next card, Work grid card), then stop for your OK.

Designer step you'll probably need: none new, as long as the 5 "Mission = Current Mission" filters stay in place (they're per list, not per item).
