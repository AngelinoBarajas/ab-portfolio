# kip + CKS missions: plan (draft, waiting on Angelino's OK)

Two new Missions on the Mission template, written the same way as the Knowledge System plan. Both are self-initiated concept products with hand-coded sites hosted on Hostinger. The content is ready to import:

- `cms/seed/_draft-new-missions.json`: the two Missions items plus the Services `missions` updates and three new Tools.
- `cms/seed/_draft-new-missions-content.json`: 12 Mission Channels, 12 Systems, 10 Problems Solved and 8 Stats.

Sources: the built sites (`kip/`, `cks/`), their scripts (every snippet is real code from them) and the Design canvas "kip + CKS case-study designs".

## 1. Identity

| Field | kip | CKS |
|---|---|---|
| Number / sort | **05** | **06** (placeholders move to 07–09) |
| Client | Concept product · self-initiated | Product site · for the Knowledge System add-on |
| Types | App, UI/UX, Branding, Website | Website, Content system, Design system, Development |
| Platform | Hand-coded · Hostinger | Hand-coded · Hostinger |
| Status | Live (once uploaded) | Live (once uploaded) |
| Services | Logo + brand identity · Motion + interaction · Interactive 3D + data · Custom deploys | Advanced CMS integrations · Design systems · Custom deploys |
| Stack | GSAP, SVG*, Hostinger*, Claude | GSAP, Canvas API*, Webflow CMS, Hostinger*, Claude |
| Planet | gas · apricot / butter / navy / mint | ice · ink / cobalt / teal / saffron / coral |
| Next mission | cks | 510-visuals |

\* new Tools items. Cut "Claude" from either stack if you'd rather not show it.

**How the two relate to Knowledge System (#04).** #04 shows how the system works inside a client site. CKS is the product site that sells it. The CKS copy points back to #04 once ("the system itself is its own case study") so they read as a pair, not a repeat.

## 2. Monitor channels

| Mission | # | Channel id | Kind | Name | What it needs |
|---|---|---|---|---|---|
| kip | 1 | `live-kip` | **live-site (new)** | Live app tour | The hosted `tour.html` URL |
| kip | 2 | `design` | figma | Design → build | `MOCKS.kip.els` + comment (below) |
| kip | 3 | `mobile` | phone | Shift handoff | `MOCKS.kip.mobile` scene (below) |
| kip | 4 | `night` | mobile | 3am mode | **Loop** (ready): scroll into night mode on a phone, 10s |
| kip | 5 | `report` | img | Pediatrician report | **Loop** (ready): range and categories change, the report rebuilds, 12s |
| kip | 6 | `cast` | img | The village | **Loop** (ready): the characters breathe and bob, 6.5s |
| cks | 1 | `live-styles` | **live-site (new)** | Live style lab | The hosted `styles.html` URL |
| cks | 2 | `live-voice` | **live-site (new)** | Live Voice Kit | The hosted `voice-kit.html` URL |
| cks | 3 | `design` | figma | Design → build | `MOCKS.cks.els` + comment (below) |
| cks | 4 | `skins` | img | Five sites, one set | **Loop** (ready): the switcher runs through all five sites, 10s |
| cks | 5 | `publish` | img | Publish once | **Loop** (ready): the entry types itself, gets tagged and publishes, 11.5s |
| cks | 6 | `mobile` | mobile | On a phone | **Loop** (ready): scrolling the home page on a phone, 11.5s |

**Animated channels.** All six image channels are now loops recorded from the real sites, with an orange cursor showing each click. They're in `prototypes/img/` as `*-anim.webp` (animated WebP, 0.9–3 MB each, under Webflow's 4 MB image limit), with an MP4 of each beside it.
- Landscape loops are 1600 × 1000; phone loops are 468 × 1012.
- The last half second of each loop fades into its first frame, so the loop has no visible jump.
- Animated WebP plays in a plain `<img>`, so the `img` and `mobile` kinds need no new markup.

**Reduced motion.** Each channel's `image` is the loop and its `image-2` is the matching still (the `kip-ch-*.webp` / `cks-ch-*.webp` files from before, 2400 × 1500 or phone size). One change in `30-mission.js`, where channels are read: `src` becomes `imgs[1] || imgs[0]` when `prefers-reduced-motion: reduce` matches or `navigator.connection.saveData` is on. It already reads the second image as the `wipe` kind's `after`, so the field is there.

**If Webflow flattens the WebP.** Webflow may compress an uploaded animated WebP into a single frame. Check one upload first. If it flattens, serve the loops from the repo on jsDelivr, the same way `10-mocks.js` already serves prototype images, and leave `image` empty in the CMS.

**The new `live-site` kind.** It's the same idea as `live-globe`: the real thing running inside the monitor. It follows the Knowledge System pattern, so the channel id picks it and nothing changes in the CMS schema:
- `30-mission.js` maps the ids `live-kip`, `live-styles` and `live-voice` to the kind `live-site`.
- `MOCKS[slug].live[id]` holds the page URL.
- `40-monitor.js` adds the iframe only when the channel is first selected and on screen (the existing `booted` logic), with `title`, `loading="lazy"` and `referrerpolicy="no-referrer"`.
- TYPE is `Live`. KIND reads `LIVE · hosted site`.
- If the iframe fails to load within 6 seconds, it falls back to the channel's still.
- On phones, the monitor shows the still plus an "Open the live site" link instead of the iframe, to save battery and data.

**Figma scene comments.** Both are review notes, not client quotes, since neither project has a client:
- kip, on the characters: *"At avatar size the caregivers blur into one orange blob."* Reply: *"Gave every character its own silhouette, not just its own color."*
- CKS, on the hero: *"The headline fights the loom for attention."* Reply: *"Faded the weave behind the copy and pushed the pattern right."*

The CKS note is the real fix from this build. The kip note restates the shape-first decision behind the characters, so reword it if you'd rather keep that scene to things that literally happened.

**kip phone scene** (`MOCKS.kip.mobile`, four notes, scripted taps):
1. **One shared log.** The Today timeline, with faces on every entry.
2. **Someone else logged it.** Nana's bottle drops in at the top.
3. **The handoff.** A tap on the "Rosa started her shift" banner opens the since-you-left card.
4. **Start informed.** A tap on "Start my shift", then back to Today.

The markup comes straight from the app screens (Today and Handoff), inlined the same way the 510 scene is.

## 3. Mission Systems (6 each)

| kip | Channel | CKS | Channel |
|---|---|---|---|
| The village, drawn | cast | The loom | design |
| A log that feels live | live-kip | Same components, any brand | skins |
| Roles, not all-or-nothing | — | Bring your own brand | live-styles |
| Shift handoff | mobile | Publish once, watch it connect | publish |
| Patterns, never diagnoses | report | Voice Kit with a real gate | live-voice |
| A report the doctor can read | report | Honest by design | — |

Engineer lines use existing Glossary terms: SVG, Reduced motion, Variables and JSON-LD. No new Glossary items are needed.

## 4. Problems solved (5 each)

| kip | CKS |
|---|---|
| `WHO-FED-HER-LAST` · one log instead of a group chat | `LOOKS-BOLTED-ON` · prove it matches before the call |
| `ALL-OR-NOTHING` · share what each person needs | `SOUNDS-COMPLICATED` · make the mechanism obvious |
| `THE-3AM-HANDOFF` · shift changes without lost details | `NO-TIME-TO-WRITE` · writing help without the dread |
| `SCARY-NUMBERS` · notice changes without the panic | `NO-SNAKE-OIL` · earn trust by not overselling |
| `DOCTOR-VISIT` · walk into the checkup prepared | `CASE-STUDY-VS-SALES` · one link that sells the install (who: client) |

## 5. Manifest

| | kip | CKS |
|---|---|---|
| Pages | Home, Village, Insights + export, App tour, Pricing | Home, How it works, Styles, Voice Kit, Pricing |
| Second row | 9 app screens: Today, Log a feed, Village, Invite, Insights, Export, Night, Handoff, Milestones | Five personalities, Knowledge graph, Publish demo, Voice Kit pipeline |

kip's second row fits the identity-style `ART` tiles (one glyph per screen). CKS stays on the normal page tiles.

## 6. Telemetry (honest; nothing measured is claimed)

| kip | | CKS | |
|---|---|---|---|
| 9 | app screens designed | 5 | site personalities, one component set |
| 6 | characters, one per caregiver plus June | 23 | design tokens per personality |
| 4 | caregiver roles | 4 | content models shown |
| 0 | invented reviews, ratings or user counts | 1 | outcome number on the site, and it's real |

## 7. What I need from you

1. **OK or edits** on the copy in the two draft files. Names, stats and the "Claude" stack item are the likeliest edits.
2. **The Hostinger URLs** once both sites are up. They go into `live-url` and the three `live-site` channels.
3. **Covers.** I'd use the kip hero (phone plus characters) and the CKS hero (loom). I can render both at your cover size once you confirm it.

## 8. Build steps (after your OK)

1. CMS: 3 Tools, 2 Missions (numbered 05 and 06; renumber placeholders to 07–09), Services `missions` updates, 12 Channels, 12 Systems, 10 Problems and 8 Stats. Upload one loop to test that Webflow keeps the animation, then the six loops, six stills and two covers (or use jsDelivr for the loops; see section 2).
2. Code: add the reduced-motion still swap (30-mission `src`), add the `live-site` kind (30-mission id map, 40-monitor boot + fallback + phone link, TYPE/KIND labels); add `MOCKS.kip` (els, mobile) and `MOCKS.cks` (els, live URLs); add the manifest ART tiles for kip. ES5, init guard, reduced motion.
3. Check every scene in the harness at landscape and portrait, then deploy (build, tag, SRI check) to **webflow.io only**.
4. Check `/work/kip` and `/work/cks` on staging (monitor, systems, problems, manifest, stats, next cards, Work grid, service pages), then stop for your OK.
