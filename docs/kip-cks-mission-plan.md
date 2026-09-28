# kip + CKS missions: plan (draft, waiting on Angelino's OK)

Two new Missions on the Mission template, written the same way as the Knowledge System plan. Both are self-initiated concept products with hand-coded sites hosted on Hostinger. The content is ready to import:

- `cms/seed/_draft-new-missions.json`: the kip Mission item plus its Services `missions` additions and new Tools.
- `cms/seed/_draft-new-missions-content.json`: kip's 8 Mission Channels, 6 Systems, 5 Problems Solved and 4 Stats (plus the old CKS drafts).

**CKS column: superseded.** CKS shipped as #05 from its v2 site (8 channels, coded scenes, live switch). Webflow is the source of truth for it; the record is `docs/webflow-build-notes.md` › CKS mission debrief. The CKS cells below are the pre-v2 draft, kept for history only.

**kip column: updated for kip v2 (2026-09-28).** Sources: `kip-site/kip-v2-case-study-notes.md`, `kip-site/qa/v2-qa.md`, and the built site in `kip-site/kip/` (every snippet is copied from its `js/` files). Debrief rules applied: Figma first in the stack, Test flight type, no "generated" or build-script wording, "patterns, not diagnoses".

## 1. Identity

| Field | kip | CKS |
|---|---|---|
| Number / sort | **06** (CKS took 05; placeholders move to 07–09) | **06** (placeholders move to 07–09) |
| Client | Concept product · self-initiated | Product site · for the Knowledge System add-on |
| Types | App, UI/UX, Branding, Website, **Test flight** | Website, Content system, Design system, Development |
| Platform | Hand-coded · Hostinger | Hand-coded · Hostinger |
| Status | In orbit (Live once uploaded) | Live (once uploaded) |
| Services | Logo + brand identity · Motion + interaction · Interactive 3D + data · Custom deploys | Advanced CMS integrations · Design systems · Custom deploys |
| Stack | **Figma**, GSAP, SVG*, Hostinger, Claude | GSAP, Canvas API*, Webflow CMS, Hostinger*, Claude |
| Planet | gas · apricot / butter / navy / mint | ice · ink / cobalt / teal / saffron / coral |
| Next mission | 510-visuals (and CKS's next becomes kip) | 510-visuals |

\* new Tools items. Hostinger already exists (added with CKS), so kip only adds **SVG**. Cut "Claude" from the stack if you'd rather not show it.

**How the two relate to Knowledge System (#04).** #04 shows how the system works inside a client site. CKS is the product site that sells it. kip has no link to either; it's the product-design mission.

## 2. Monitor channels

| Mission | # | Channel id | Kind | Name | What it needs |
|---|---|---|---|---|---|
| kip | 1 | `live-kip` | **live-site (new)** | Live app | The hosted **`try.html`** URL (was `tour.html`): pick a person, log, flip 3am mode |
| kip | 2 | `story` | img | One Tuesday, five people | **New loop** (recorded): the home ribbon scrubbed from 6:10 am to 3:11 am (20 entries, 5 people), 13s |
| kip | 3 | `design` | figma | Design → build | `MOCKS.kip.els` + comment (below) |
| kip | 4 | `mobile` | phone | Shift handoff | `MOCKS.kip.mobile` scene (below), unchanged |
| kip | 5 | `night` | mobile | 3am mode | **Re-recorded** on `try.html` at phone width: 3am mode, Feed, Back to daytime, 9s |
| kip | 6 | `roles` | img | Nana sees what Nana needs | **New loop** (recorded): Nana's log meds + full history, then Rosa's charts, 8.5s |
| kip | 7 | `report` | img | Pediatrician report | **Re-recorded**: 7 days → 4 weeks → since birth, all off (empty state), Feeds back on, 13s |
| kip | 8 | `cast` | img | The village | **Loop** (ready, unchanged): the characters breathe and bob, 6.5s |
| cks | 1 | `live-styles` | **live-site (new)** | Live style lab | The hosted `styles.html` URL |
| cks | 2 | `live-voice` | **live-site (new)** | Live Voice Kit | The hosted `voice-kit.html` URL |
| cks | 3 | `design` | figma | Design → build | `MOCKS.cks.els` + comment (below) |
| cks | 4 | `skins` | img | Five sites, one set | **Loop** (ready): the switcher runs through all five sites, 10s |
| cks | 5 | `publish` | img | Publish once | **Loop** (ready): the entry types itself, gets tagged and publishes, 11.5s |
| cks | 6 | `mobile` | mobile | On a phone | **Loop** (ready): scrolling the home page on a phone, 11.5s |

kip goes from 6 to 8 channels, the same count CKS shipped with. **Still missing: kip's own site plan.** The debrief rule is one site-plan scene per mission in the project's own look (CKS got `cks-plan`). kip has none yet; it would be a 9th channel, or replace `cast`. Your call.

**Animated channels.** The image channels are loops recorded from the real site, with an orange cursor showing each click. They're in `prototypes/img/` as `*-anim.webp` (animated WebP, under Webflow's 4 MB image limit), with an MP4 of each beside it.
- Landscape loops are 1600 × 1000; phone loops are 468 × 1012.
- The last half second of each loop fades into its first frame, so the loop has no visible jump.
- Recorded 2026-09-28 from a local copy of `kip-site/kip` (no live URL yet). Sizes: story 3.7 MB, report 2.2 MB, roles 1.6 MB, night 0.7 MB.
- **`roles` re-recorded 2026-09-28 after the kip site fix:** Rosa's charts used to render below her phone's bottom edge. The switchable rows (charts, photos) now sit above the log list, the list fades off the bottom like a scrolling screen, and the bezel is drawn over the content (`kip-src/village.body.html` + `kip.css`, rebuilt).
- Animated WebP plays in a plain `<img>`, so the `img` and `mobile` kinds need no new markup.
- kip v2 files: `kip-ch-story-*`, `kip-ch-roles-*` (new), `kip-ch-night-*`, `kip-ch-report-*` (replaced; the v1 versions are kept as `kip-ch-night-v1*` / `kip-ch-report-v1*`), `kip-ch-cast-*` (unchanged).

**Reduced motion.** Each channel's `image` is the loop and its `image-2` is the matching still (`kip-ch-*.webp`, 2400 × 1500 or 672 × 1452 for phones). One change in `30-mission.js`, where channels are read: `src` becomes `imgs[1] || imgs[0]` when `prefers-reduced-motion: reduce` matches or `navigator.connection.saveData` is on. It already reads the second image as the `wipe` kind's `after`, so the field is there.

**If Webflow flattens the WebP.** Webflow may compress an uploaded animated WebP into a single frame. Check one upload first. If it flattens, serve the loops from the repo on jsDelivr, the same way `10-mocks.js` already serves prototype images, and leave `image` empty in the CMS.

**The `live-site` channel for kip.** CKS solved this as a live switch: `MOCKS.cks.live` = `{ base, probe, pages }`, the probe loads as an `<img>`, and only once it answers does `40-monitor` swap the iframe in (coded demo until then, "Open the live site" link on phones). kip should reuse it: `MOCKS.kip.live = { base: '<kip URL>/', probe: 'img/kit/kip-mark.svg', pages: { 'live-kip': 'try.html' } }`. **kip has no `favicon.svg`** (its favicon is an inline data URI), so the probe must be a real file; `img/kit/kip-mark.svg` exists. Until the site is up, `live-kip` shows its still (or a coded replica, if you want one like CKS's).

**Figma scene comments.** Both are review notes, not client quotes, since neither project has a client:
- kip, on the characters: *"At avatar size the caregivers blur into one orange blob."* Reply: *"Gave every character its own silhouette, not just its own color."*
- CKS, on the hero: *"The headline fights the loom for attention."* Reply: *"Faded the weave behind the copy and pushed the pattern right."*

The kip note restates the shape-first decision behind the characters, so reword it if you'd rather keep that scene to things that literally happened. A v2 note that did happen, if you prefer it: *"'Tylenol · 1.25 ml' for an 8-week-old reads like dosing advice."* Reply: *"Every example dose is now vitamin D, as directed."*

**kip phone scene** (`MOCKS.kip.mobile`, four notes, scripted taps, unchanged by v2):
1. **One shared log.** The Today timeline, with faces on every entry.
2. **Someone else logged it.** Nana's bottle drops in at the top.
3. **The handoff.** A tap on the "Rosa started her shift" banner opens the since-you-left card.
4. **Start informed.** A tap on "Start my shift", then back to Today.

The markup comes straight from the app screens (Today and Handoff), inlined the same way the 510 scene is.

## 3. Mission Systems (6 each)

| kip | Channel | CKS | Channel |
|---|---|---|---|
| **A day on one ribbon** (new) | story | The loom | design |
| **Try it, as anyone** (new, replaces *A log that feels live*) | live-kip | Same components, any brand | skins |
| **Roles you can see** (new, replaces *Roles, not all-or-nothing*) | roles | Bring your own brand | live-styles |
| **A report that prints** (new, replaces *A report the doctor can read*) | report | Publish once, watch it connect | publish |
| Patterns, not diagnoses (rewritten for the Try it pattern note) | live-kip | Voice Kit with a real gate | live-voice |
| The village, drawn (snippet updated) | cast | Honest by design | — |

Cut from kip: *A log that feels live* (Try it does it better) and *Shift handoff* (the story's four handoff cards and Try it's handoff banner carry it; `mobile` still shows it). Held in reserve, if you'd rather swap one in: **Dark mode as a token swap** and **Honest by design** (the early-access inputs have no `name` attributes, so even a no-JS submit carries nothing).

Engineer lines use existing Glossary terms: SVG, Reduced motion. No new Glossary items are needed.

## 4. Problems solved (5 each)

| kip | CKS |
|---|---|
| `WHO-FED-HER-LAST` · one log instead of a group chat | `LOOKS-BOLTED-ON` · prove it matches before the call |
| `THE-3AM-HANDOFF` · shift changes without lost details | `SOUNDS-COMPLICATED` · make the mechanism obvious |
| **`DID-SHE-GET-HER-VITAMIN-D`** · no double doses (new) | `NO-TIME-TO-WRITE` · writing help without the dread |
| `ALL-OR-NOTHING` · share what each person needs | `NO-SNAKE-OIL` · earn trust by not overselling |
| **`COMING-SOON-BADGES`** · a concept that doesn't pretend (new, who: client) | `CASE-STUDY-VS-SALES` · one link that sells the install (who: client) |

Moved out to make room: `DOCTOR-VISIT` (the report system covers it) and `SCARY-NUMBERS` (the patterns system covers it). Not used: `PAGES-DRIFT-APART`, because its fix is "one source folder and a build script", which breaks the no-build-script wording rule.

## 5. Manifest

| | kip | CKS |
|---|---|---|
| Pages | **Home, Try it, Village, Insights, App tour, Pricing, Privacy, Questions, Early access, What's new, About, 404** (12) | Home, How it works, Styles, Voice Kit, Pricing |
| Second row | 9 app screens: Today, Log a feed, Village, Invite, Insights, Export, Night, Handoff, Milestones | Five personalities, Knowledge graph, Publish demo, Voice Kit pipeline |

kip's second row fits the identity-style `ART` tiles (one glyph per screen). Optional, like CKS's v2 row: add the five demos (Day ribbon, Try it, Role builder, Report builder, Who sees what).

## 6. Benefits for the people using kip (added 2026-09-28)

What the app is designed to do for parents and caregivers. kip is a concept, so these are design promises, each one demonstrated on the site, never measured results.

| Benefit | Shown by |
|---|---|
| Know who fed her last without texting anyone: every entry carries the face of whoever logged it | story, Try it |
| Start every shift caught up: a handoff card lists what happened since you last had the phone | story, Try it |
| No accidental double doses: before logging vitamin D, kip shows who already gave it today and asks | Try it |
| Share only what each person needs: Nana logs feeds without seeing the med history; alerts stay with the parents | roles |
| Log at 3am without waking up: dim, warm screen and huge buttons; a feed is one tap | night |
| Notice changes calmly: plain-sentence patterns, not diagnoses; the pediatrician decides what they mean | Try it |
| Walk into checkups prepared: a report to print or share, with every dose and who gave it | report |

**On the page:** the first four go in as plain statements, no numbers attached, in a new **Benefits** list in the briefing beside Mission parameters (seed field `benefits`, one per line). That needs one new plain-text CMS field on Missions and a small render in `30-mission.js`, the same way `params` renders. The other three stay in the problem cards' "Result" lines and the systems. The plain-English objective also names them. One old result line said the next caregiver is informed "in five seconds"; nothing backs that number, so it now says "without a phone call".

1. Know who fed her last without texting anyone: every entry carries the face of whoever logged it
2. Start every shift caught up: a handoff card shows what happened since you last had the phone
3. No accidental double doses: kip shows who already gave vitamin D today and asks before logging another
4. Share only what each person needs: Nana logs feeds without seeing the med history, and alerts stay with the parents

## 7. Telemetry (honest; counts of things on the site, nothing measured about users)

| kip | | CKS | |
|---|---|---|---|
| 12 | pages, including the 404 | 5 | site personalities, one component set |
| 5 | interactive demos you can try | 23 | design tokens per personality |
| 0 | bytes sent by any demo or form | 4 | content models shown |
| 0 | app-store badges, reviews, ratings or press logos | 1 | outcome number on the site, and it's real |

Spare: **20** entries on one day's ribbon, from 5 people. (Benefit-style numbers like "1 tap to log a feed at 3am" were tried and dropped: benefits read better as statements.)

## 8. What I need from you

1. **OK or edits** on the kip copy in the two draft files.
2. **The kip URL** once it's up. It goes into `live-url` and `MOCKS.kip.live.base`.
3. **Covers.** I'd use the kip hero (phone plus characters). I can render it at the cover size once you confirm.
4. **Decisions:** the benefits and stats (sections 6 and 7), site plan (section 2), the Figma comment (section 2).

## 9. Build steps (after your OK)

1. CMS: Missions › new plain-text field **Benefits**; Tools › SVG; Missions › kip (#06, sort 6, Test flight, In orbit); CKS › Next mission → kip; Services `missions` additions; 8 Channels, 6 Systems, 5 Problems, 4 Stats (slugs `kip-*`). Upload one loop to test that Webflow keeps the animation, then the loops, stills and the cover (or use jsDelivr for the loops; see section 2).
2. Code: render Benefits as a list in the briefing (like params); the reduced-motion still swap (30-mission `src`); `MOCKS.kip` (els, mobile, `live` with the kip probe); map `live-kip` onto the CKS live-switch path; the manifest ART tiles for kip. ES5, init guard, reduced motion.
3. Check every scene in the harness at landscape and portrait, then deploy (build, tag, SRI check) to **webflow.io only**.
4. Check `/work/kip` on staging (monitor, systems, problems, manifest, stats, next cards, Work grid, service pages), then stop for your OK.
