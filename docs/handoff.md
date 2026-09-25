# Session handoff (2026-09-25, end of the Services template + brand session)

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
| 6. Pages | 🟡 Home ✅, Work ✅, Mission template ✅ approved. **Services template** (`/services/[slug]`, page `6ab602e4e41add8af5e28b6c`) built + on staging, waiting on 1 Designer step (rail source) + his OK. Remaining: About, 404 |
| 7. Custom code | 🟡 Live on staging: `ab-core` JS **v0.4.6** + CSS v0.4.4 · `ab-mission` JS v0.4.5 + CSS v0.4.4 · `ab-home` v0.4.2 · `ab-work` + `ab-services` (+ CSS) v0.4.0 · head inline script `abwarpin` 0.3.2. Build/deploy steps in `code/README.md`; per-version notes in `docs/webflow-build-notes.md` (v0.3.2 → v0.4.6) |
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

## Next session

1. **New mission debrief: the Knowledge System add-on** (brief below, from Angelino 2026-09-25). A new Missions item + its channels, systems, problems, stats, manifest, coded monitor scenes; then publish webflow.io only and stop for his OK.
2. Still open from before (don't block on them): Services rail Designer step + his OK on the Services template → then **About**, **404**; favicon/webclip upload; Metrics numbers.

### Brief: Knowledge System mission (Angelino's words, keep every point)
- built for Webflow CMS natively, but can be adapted to any platform
- how it connects all the knowledge and content on your site, and how that elevates SEO, AEO, etc.
- gives you the foundation for insights/blogs
- the voice kit, and how it can use AI as a partner to help you develop meaningful content that is in your voice and approved/reviewed by you before it's live
- how easy it is to set up and update
- how you can integrate video with it
- any other highlights worthy of adding

Source material (read before writing copy; never invent client facts or numbers):
- `X:/Claude-Skills/code backup/5 TEN/5TEN_next-phase.html` — plan, content strategy, **Voice Kit**, investment (client-facing)
- `X:/Claude-Skills/code backup/5 TEN/5TEN_build-map.md` — Connected Content System build map (Topics, Essays, video URL/duration/chapters, conditional video)
- `X:/Claude-Skills/code backup/daniel-aguirre/builds/resources-page-build-spec.md` — Aguirre's connected content system (Topics/Insights, 58-term vocabulary, tagging, topic template)
- `X:/Claude-Skills/code backup/daniel-aguirre/content/demo-insights-articles.md`, `.../daniel-aguirre/_HANDOFF.md`
- the `connected-content-system` skill (strategy + architecture)

## Home review edits already done (v0.1.4, from `ab-portfolio-hp-edits.docx`)

Hero drag cue · altitude meter readable on light sections · planner readout under the visual · tool brand logos + new Photoshop/Illustrator/Lightroom Tools items · mobile: giant planet higher, work deck swipes, footer planets scattered, selection tags hidden (cursor under the word) · dot field tighter · less map-focused copy (hero lede, WebGL bento card, footer line + service link) · board frame colors fixed (Designer bindings) and new hidden `brand-accent` node drives preview pin colors. Full list: `docs/webflow-build-notes.md` › v0.1.4.

Possible follow-ups he may raise: Tools list order (the 3 new Adobe items sort first and take the inner ring; set a sort in the Designer or a script order), the Services CMS item `webgl-data` still named "Globes, maps + 3D" (update with the Services template), and the heading-span effect classes / `#plRead` position that the script patches (cleaner in the Designer).

## Open items for Angelino

- **Services template**: rail Collection List (`#svRail`) › Source › **Services** (Designer; the API resolves it to *Pairs with*), then his OK.
- **Favicon + webclip**: Site settings › General › upload `logo/favicon-32.png` + `logo/webclip-256.png`.
- **Review copy** written this session: AB Identity (summary, captions, system/problem text, sketch notes, stats labels), Aguirre *Site plan* board, Services WebGL title. AB Identity handoff line still says "One Figma library…".

- **Mission template**: 5 Designer filters, then his OK.
- **Metrics numbers** for the Statement section (deferred by him, 2026-09-25).
- Confirm the Forms notification email in Site settings.

- Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, headshot, `[X–Y weeks]`).
- Check the Lincoln Center / ON NYC pin coordinates (both on the generic NYC point).
- Verify footer letter-spacing and wordmark width on the first staging preview.
