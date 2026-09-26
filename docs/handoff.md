# Session handoff (2026-09-26, end of the 404 + Process page session)

Read this first in a new chat, then `CLAUDE.md`, `docs/progress.md` and `docs/webflow-build-notes.md`.

## Where things stand

| Step | Status |
|---|---|
| 1. GitHub repo | ✅ Public: github.com/AngelinoBarajas/ab-portfolio (`main`) |
| 2. Site | ✅ AB Portfolio `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io). Home page `6ab5fe4b5ee75f9c981dc0cb`. Published to **webflow.io only** (no custom domain). |
| 3. Variables + fonts | ✅ 38 variables (37 from tokens + `Neutral / Glass`); 4 custom variable fonts (Archivo with wdth axis). IDs in `docs/webflow-ids.md` |
| 4. CMS | ✅ 13 collections, all references resolved. IDs in `docs/webflow-cms-ids.json`. Added this session: Tools › **Pen + paper**, Mission Channels › Aguirre **Site plan**, AB Identity **Sketches** + **Illustrator** |
| 3b. Global styles | ✅ 29 classes + tag styles (Body, H1–H6, p) |
| 5. Components | 🟡 Nav, Footer, Frame label, Bento card, FAQ item, **Next card** (no props yet) done (group "Global"). Mission card is a page-level Collection item (nested Types list rules out a component). Remaining: code block, crew dock |
| 6. Pages | 🟡 Approved 2026-09-25: Home, Work, Mission template, Services template, Knowledge System mission, About, **404** (utility page `6ab6e4a645ff2d1bd12b1c3e`). **Process** (`/process`, page `6ab701e2df00b2e38832af5b`, new page) built + on staging v0.9.0, **awaiting OK + tweaks**. Next new page: **Services hub** |
| 7. Custom code | 🟡 Live on staging: `ab-core` JS **v0.8.1** + CSS **v0.9.0** · `ab-home` **v0.9.0** · `ab-process` JS + CSS **v0.9.0** · `ab-404` JS v0.7.0 + CSS v0.7.1 · `ab-about` JS + CSS v0.6.2 · `ab-mission` JS v0.5.1 + CSS v0.5.0 · `ab-work` + `ab-services` (+ CSS) v0.4.0 · head inline script `abwarpin` 0.3.2. Build/deploy steps in `code/README.md`; per-version notes in `docs/webflow-build-notes.md` (up to v0.9.0) |
| 8. Brand | ✅ New **AB planet monogram** (`logo/ab-logo.svg`, asset `6ab6bba8167f1da71a4bf9a8`) in Nav + Footer; inlined + animated by `core/22-logo.js` (warp spin-in, fill; black-hole hover; no glow). One geometry source: `AB.markSVG` / `AB.MARK` in `core/21-mark.js`. Favicon/webclip PNGs in `logo/` (upload pending) |

Home Navigator now: `Body > page-wrapper > [Nav] · main-wrapper <main id="top"> (hero · work · statement · services · process · transmission · stack · testimonials · faq · contact) · [Footer] · Site data (hidden CMS sources)`. Section-by-section notes: `docs/webflow-build-notes.md` › Home; prototype → Webflow hook map for the step 7 scripts: `webflow/build/home/class-map.md`.

## Agreed working rules (from Angelino)

- Stop for OK after each page (and after each checkpoint in CLAUDE.md).
- Ask before deleting anything or publishing.
- Real Webflow variables only in classes; Client-First naming; `ab_` for custom components.
- US spelling in all copy (seed copy was converted).
- Build remaining components in context on their first page (approved approach).

## Build method that works (see `webflow/build/`)

1. Pull the section's HTML + CSS from `prototypes/*.html` (CSS lives in one `<style>` block; section markers `/* ---------- name ---------- */`).
2. Rename classes to Client-First / `ab_`, write `webflow/build/<page>/<section>.html` + `.css`. In the CSS use short aliases (`var(--dust)`, `var(--display)`…) and normal shorthands.
3. `python webflow/build/prep.py <page>/<section>` → `out/<section>.whtml.json` (expanded CSS for the builder) + `out/<section>.rebind.json` (`update_style` actions: variable links, font families, and any `:first-child`-type rules WHTML refuses).
4. Insert with `data_whtml_builder` (Webflow breakpoints 991/767/479 only; no keyframes; pseudos limited to hover/focus/active), then send the rebind actions.
5. Replace any `<button>` with a `DOM` element (`dom_tag: button`); WHTML makes href-less links.
6. Snapshot with `element_snapshot_tool` (empty divs show as big placeholder boxes; that's Designer-only).
7. Re-read the tree after any failed call (a failed build can still create elements).
8. Components can't contain CMS Collection Lists; keep CMS sources page-level (`ab_cms-source`) and put CMS-driven cards inside page-level Collection Lists.
9. CMS-driven `data-*` attributes: bind with the raw `static_json` shape (see build notes › MCP findings). Color fields can't bind; carry them in a hidden node and bind its style in the Designer.
10. SVGs with camelCase tags (`textPath`, gradients) go in an HTML Embed. After every WHTML insert, strip duplicate `href` (links) and `class` (styled DOM) attributes, and re-check gradients for `N%at`.
11. WHTML **drops classes that have no CSS rule** (e.g. a bare `ab_mission-card_year`): give every class at least one rule, or hook the script on a `data-*` attribute instead. Text inside a DOM `<button>`: create the button with `data_element_builder` (type DOM), then WHTML a `<span>` into it.
12. `data_element_builder` errors can still create elements ("id is a reserved attribute name" did); DOM ids go through `set_dom_id`. A page with no custom code yet needs `set_page_scripts` (not `add_page_script`, which 404s).

13. **Bindings in bulk**: mark CMS-bound elements with `data-field="<field slug>"` in the build HTML, dump the page with `get_all_elements`, then `python webflow/build/services/bind.py <dump>` writes every text + attribute binding (collection taken from the nearest list's source). 55 bindings in two calls.
14. **Seeing coded scenes without the browser pane**: build a harness page from `code/dist/ab-mission.js` (the `SCENE` IIFE + `window.__scenes` hook), seek the timeline to set times and screenshot with headless Chrome (each run needs its own `--user-data-dir`). Scripts: the session scratchpad `harness.js` / `shoot.py` pattern; recreate as needed.
15. On a CMS template, a list sourced from a collection the item multi-references renders only the item's references (no filter needed). A self-reference (Services › Pairs with) makes an "all services" list impossible from the API (Designer step).

## Known MCP limits hit this session

- Size variables: `custom_value` (clamp/calc) always errors; static fallback + Angelino pasted clamp().
- Can't rename variable modes; Color base mode renamed to "Dark" by hand.
- CMS field slugs come from displayName: create with the slug as the name, then rename.
- Number fields are integer-only (lat/lng are PlainText).
- `box-shadow` with a variable color collapses; keep those in `ab-core.css`.
- Tag styles writable only after they exist; the API can't touch classes on the Body element.

## Custom code: how it's wired (details in `code/README.md`)

- Source `code/src/` (`core/` site-wide, `home/` Home, `ab-core.css`) → `cd code && npm run build` → `dist/*.prod.js|css` + `dist/sri.json`. ES5 syntax is checked at build.
- Deploy: bump `code/package.json` version, build, commit, `git tag -a vX.Y.Z`, push main + tag, **curl the jsDelivr copy and compare sha384 to `sri.json`** (purge if a new tag 404s), then Webflow MCP `data_scripts_tool`: `register_hosted_script` with the **same display name** (`ABCore` / `ABHome`) and the new version (`update_registered_script` 404s), `add_site_script` / `add_page_script` with that version, `set_site_freeform_code` head `<link>` for the CSS. Publish **webflow.io only** (`publishToWebflowSubdomain: true, customDomains: []`).
- Never name builds `*.min.js`: jsDelivr served its own minified copy for one and the SRI failed.
- Current live versions: all **v0.1.4**. Site scripts (footer, in order): gsap, gsapscrolltrigger, gsapdraggable, gsapinertia, gsapsplittext, gsapscrambletext, gsapflip, lenis, abcore. Home page script: abhome.
- Testing: the in-app browser pane is usually hidden, which freezes rAF, IntersectionObserver and screenshots. Shim rAF onto setTimeout + `gsap.ticker.sleep(); gsap.ticker.wake();` and verify with DOM checks; for reduced motion serve a copy of the staging HTML with a `matchMedia` override (worked via a `code-test` python http.server entry in the session launch.json). Don't submit the planner for real in tests (stub `form.requestSubmit`); the launch button stays disabled until Webflow's Turnstile finishes.

## This session (2026-09-25) in one list

- **Mission template approved** after round-1 fixes: 5 Designer filters verified (the MCP reads them back as `filters: []`: check rendered counts instead), manifest selection boxes, crew dock hides after level content + toast above it, warp **page transitions site-wide** (`AB.go`, `abwarpin` head script, no flash-back), globe render from the current globe, every website mission's monitor = Live · Design → build · Mobile · FigJam ideation · Globe layers / CMS.
- **Services template built** (v0.4.0): 8 sections, 55 text + 9 attribute bindings generated by `webflow/build/services/bind.py`, related missions cloned from `/work`, `AB.missionCard` + `AB.codeBlock` moved into core. Next-service spacing fixed.
- **Brand**: new logo (see step 8), warp spin-in intro, construction grid measured from the artwork.
- **AB Identity mission rebuilt around the new mark**: copy, Construction/The mark/On light/Applications channels, new coded **Sketches** + **Illustrator** scenes, 15 design-language manifest tiles, tools = Pen + paper/Photoshop/Illustrator, stats 25 iterations · 128 oz coffee · ∞ hours.
- **Next cards** split multi-word names onto two balanced lines (site-wide).
- Services › WebGL title → "Interactive / 3D + data".

## This session (2026-09-25, second half) in one list

- **Knowledge System mission** built + approved (`/work/knowledge-system`, #04; placeholders now 05–07): 7 coded monitor scenes (`code/src/mission/21-knowledge.js`), system-style manifest tiles, 7 systems, 5 problems, 4 stats, generic client throughout. Featured on the Home board with a knowledge-graph preview. Plan: `docs/knowledge-system-plan.md`.
- **Home metrics** (his numbers): 4,365 lines of custom code · 12 hours/month saved · 39 caffeinated drinks, with line icons (`data-metric-icon`).
- **Hero toys site-wide** (`core/39-herodrag.js`): title words + hero planet draggable on Work/Services/Mission, "Drag me" cue (key `ab:toys`). Mission titles stay solid (no outline word) — his call.
- **Orbit logos**: Webflow CMS, Claude (new Tools item), Finsweet (hand-drawn {F).
- **Services template approved**: rail now = all 8 services (new Designer list + MCP move); Navigator section names fixed.

## This session (2026-09-25, About page) in one list

- **About page built + approved** (`/about`, v0.6.0 → v0.6.2). Details and MCP findings: `docs/webflow-build-notes.md` › About page. Page was created as a duplicate of Work (Nav, Footer, site-data block came along), then the Work sections were removed.
- Crew badge on a lanyard with **pendulum physics** (drag, swoop back, flip on click, arrow keys); badge uses the new AB mark.
- **Pilot planet**: orange, 5 extra thin rings, two moons (wife violet, son green); big in the hero background (Angelino's call after trying it docked on the lanyard).
- Section renamed **Between launches** (was off-duty). *Thus Spoke Zarathustra* on the badge back + a leaning book on the shelf.
- **Bento spotlight + tilt site-wide**: `core/32-cards.js` (`AB.cardFx`) on every `.ab_bento-card`; Home/Mission copies removed.
- Crew-of-three orbits: hover speed-up via `playbackRate` (no jump).
- **Home planner**: budget `<$20k · $20–40k · $40–60k · $60–80k · $80–100k` + **Complete knowledge system** add-on (own `Add-ons` form field). The script applies it; the Designer embed still has the old markup (new markup in `webflow/build/home/planner-fields.embed.html`).
- Core: footer black-hole game scoped to `#siteFoot`.
- Testing method that worked: download the staging HTML, swap the jsDelivr tags for local `dist/` builds (+ an rAF→setTimeout shim via `?shim`), serve it with a `python -m http.server` launch entry, test in the browser pane, then tag + deploy. Screenshots of lower sections often time out in the pane; DOM checks cover it.

## This session (2026-09-25, 404 page) in one list

- **404 built** (`signal-lost`), v0.7.0/0.7.1: details + MCP findings in `docs/webflow-build-notes.md` › 404 page. Utility pages can't hold Collection Lists → core caches site data (`ab:site`).
- **Drag cue on every hero** with draggables (Angelino's ask): `AB.dragCue`, one key per hero type.
- **Copy direction (Angelino):** stop leaning on "building globes"; position the work as interactive 3D that's useful to clients and visitors. **Applied + published 2026-09-25** (his OK): About log lede + waypoint 04, Home WebGL bento Text prop + FAQ home-1, Services › webgl-data summary / solve 1 / deliverable 1 / stage 2 / code label, Tools › Three.js use. Seeds + build sources updated to match. 510 Visuals mission copy stays (it really is a globe). Keep new copy on this line: interactive 3D that's useful to clients and visitors.

## This session (2026-09-25/26, Process page) in one list

- **New Process page** `/process` ("flight planner": one route, eight destinations). Prototype `prototypes/process.html` (assembled from `prototypes/_parts/` by `_parts/assemble.py`), approved, built in Webflow (v0.8.0), then: v0.8.2 phone rail/rocket alignment, **v0.9.0 mission stops** (main + up to 2 stops, "+ More than three" field in the form). Details + MCP findings: `docs/webflow-build-notes.md` › Process page, v0.8.x, v0.9.0. **Still awaiting Angelino's OK**; he wants to review + tweak it next.
- Sections: countdown hero (T−6 → T−0) · star chart (Services CMS → planets; panel; stops) · pinned sideways route (6 waypoints; vertical rail on phones) · crew roles (light) · what moves the timeline (dials + gauge, no numbers) · FAQ (6 FAQ item components) · launch form (native Webflow form, fields in an Embed: `webflow/build/process/form-fields.embed.html`).
- **Services CMS** gained: Short name, Process leg 1–6, Timeline preset, Process example (Reference → Missions). Filled for all 8.
- **Site-wide**: Nav, mobile menu, Footer "Process" → `/process`; Home process section has "See the full flight plan →".
- **Both forms**: budget "Not sure yet · still scouting" (Process select option; Home planner chip under the slider).
- **Drag cue** (`AB.dragCue`) now per visit (sessionStorage), on every hero with draggables (v0.8.1). Home's old `ab:dragged` localStorage flag had hidden it forever.
- **Copy**: "interactive 3D that's useful to clients/visitors" instead of "building globes" (About, Home bento + FAQ, Services › webgl-data, Tools › Three.js). 510 Visuals keeps its globe copy.
- **404** approved (v0.7.0/0.7.1): utility pages can't hold CMS lists → core caches site data (`ab:site`) and fetches `/` once if needed.

## Next session

1. **Process page review + tweaks** (Angelino): walk it with him at 1440 / 1024 / 390, apply his tweaks the same way (source in `code/src/process/00-process.js`, `code/src/ab-process.css`, Designer copy/classes via `webflow/build/process/make.py`), bump + deploy, stop for his OK. Known candidates: crew section top spacing (inherits the light-section padding), whether the "flown before" link should match mission combinations (needs a hidden Missions list with their Services), the form's name in Webflow (still "Email Form").
2. **New page: Services hub** (`/services`, static; a static page can share a slug with a collection, like `/work`). Same pipeline as Process: plan + divergence gate → HTML prototype in `prototypes/` (reuse the About/Process shell via a `_parts` assembler) → his OK → Webflow build → code → staging checks → stop for OK. The Services collection (8 items: title 1/2, summary, best for, planet, tools, pairs with, missions, FAQ, stages, deliverables, process legs…) is the data source. Then repoint Nav "Services" (now `/#capabilities`) and the footer service column heading to `/services`.
3. Then **step 8 QA** (every page vs its prototype at 1440 / 1024 / 390, console, horizontal scroll, reduced motion, Lighthouse, links + warp transitions). Ask before any publish beyond webflow.io.
4. Offered, not decided: stronger Interstellar "Hover to fly close" on About.

## Home review edits already done (v0.1.4, from `ab-portfolio-hp-edits.docx`)

Hero drag cue · altitude meter readable on light sections · planner readout under the visual · tool brand logos + new Photoshop/Illustrator/Lightroom Tools items · mobile: giant planet higher, work deck swipes, footer planets scattered, selection tags hidden (cursor under the word) · dot field tighter · less map-focused copy (hero lede, WebGL bento card, footer line + service link) · board frame colors fixed (Designer bindings) and new hidden `brand-accent` node drives preview pin colors. Full list: `docs/webflow-build-notes.md` › v0.1.4.

Possible follow-ups he may raise: Tools list order (the 3 new Adobe items sort first and take the inner ring; set a sort in the Designer or a script order), the Services CMS item `webgl-data` still named "Globes, maps + 3D" (update with the Services template), and the heading-span effect classes / `#plRead` position that the script patches (cleaner in the Designer).

## Open items for Angelino

- **Process form name**: Designer › the Process form › Form settings › Name (it's "Email Form"; the MCP can't rename forms). Nothing depends on its ID.
- **Forms notification email**: confirm in Site settings › Forms (Home planner + Process form both post there).

- **Headshot**: drop an Image into `.ab_badge_photo` (About hero › badge › front face); CSS fills the 4:5 frame.
- **Planner embed** (optional): swap the Home planner fields embed for `webflow/build/home/planner-fields.embed.html` so the Designer matches what the script does.

- **Favicon + webclip**: Site settings › General › upload `logo/favicon-32.png` + `logo/webclip-256.png`.
- **Review copy** written this session: AB Identity (summary, captions, system/problem text, sketch notes, stats labels), Aguirre *Site plan* board, Services WebGL title. AB Identity handoff line still says "One Figma library…".

- **Metrics numbers** for the Statement section (deferred by him, 2026-09-25).
- Confirm the Forms notification email in Site settings.

- Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, headshot, `[X–Y weeks]`).
- Check the Lincoln Center / ON NYC pin coordinates (both on the generic NYC point).
- Verify footer letter-spacing and wordmark width on the first staging preview.
