# Session handoff (2026-09-25, end of the Work page session)

Read this first in a new chat, then `CLAUDE.md`, `docs/progress.md` and `docs/webflow-build-notes.md`.

## Where things stand

| Step | Status |
|---|---|
| 1. GitHub repo | ✅ Public: github.com/AngelinoBarajas/ab-portfolio (`main`) |
| 2. Site | ✅ AB Portfolio `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io). Home page `6ab5fe4b5ee75f9c981dc0cb`. Published to **webflow.io only** (no custom domain). |
| 3. Variables + fonts | ✅ 38 variables (37 from tokens + `Neutral / Glass`); 4 custom variable fonts (Archivo with wdth axis). IDs in `docs/webflow-ids.md` |
| 4. CMS | ✅ 13 collections, 149 items, all references resolved. IDs in `docs/webflow-cms-ids.json` |
| 3b. Global styles | ✅ 29 classes + tag styles (Body, H1–H6, p) |
| 5. Components | 🟡 Nav, Footer, Frame label, Bento card, FAQ item, **Next card** (no props yet) done (group "Global"). Mission card is a page-level Collection item (nested Types list rules out a component). Remaining: code block, crew dock |
| 6. Pages | 🟡 Home ✅ **approved** by Angelino. **Work** (`/work`, page `6ab6853da89bdfd5de03324d`) built + on staging, waiting on 3 Designer steps + his OK. Remaining: Mission template, Services template, About, 404 |
| 7. Custom code | 🟡 `ab-core` (JS + CSS), `ab-home`, `ab-work` all on staging at **v0.2.1**. Build/deploy steps in `code/README.md`; notes in `docs/webflow-build-notes.md` (Custom code part 1, v0.2.x) |

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

## Next session

1. **Work: Angelino's 3 Designer steps** (details in `docs/webflow-build-notes.md` › Work › Designer steps): nested *Types* list in the card (filters depend on it), 3 card brand-color bindings, optional cover visibility. Then re-check filtering on staging and ask for his **OK on Work**.
2. Then the **Mission template** (`/work/[slug]`, template page `6ab602e48e2fa6779570a308`): reuse `ab_dbh_*` / `ab_meta_*` for the hero, add props to the **Next card** component (eyebrow, title lines, link, planet attributes bound to *Next mission*), crew dock component, new `ab-mission` bundle (`code/src/mission/`, add it to `build.mjs`). Board frames and Work cards already link to `/work/<slug>` (404 until then).
3. **Metrics (Home Statement)**: Angelino will send the three numbers + labels later. Don't invent them; when they arrive, update `.ab_metric_number` text + `data-count` and `.ab_metric_label` on page `6ab5fe4b5ee75f9c981dc0cb`, publish webflow.io only.

## Home review edits already done (v0.1.4, from `ab-portfolio-hp-edits.docx`)

Hero drag cue · altitude meter readable on light sections · planner readout under the visual · tool brand logos + new Photoshop/Illustrator/Lightroom Tools items · mobile: giant planet higher, work deck swipes, footer planets scattered, selection tags hidden (cursor under the word) · dot field tighter · less map-focused copy (hero lede, WebGL bento card, footer line + service link) · board frame colors fixed (Designer bindings) and new hidden `brand-accent` node drives preview pin colors. Full list: `docs/webflow-build-notes.md` › v0.1.4.

Possible follow-ups he may raise: Tools list order (the 3 new Adobe items sort first and take the inner ring; set a sort in the Designer or a script order), the Services CMS item `webgl-data` still named "Globes, maps + 3D" (update with the Services template), and the heading-span effect classes / `#plRead` position that the script patches (cleaner in the Designer).

## Open items for Angelino

- **Work Designer steps** (3, see Next session) and his **OK on Work**.
- **Metrics numbers** for the Statement section (deferred by him, 2026-09-25).
- Confirm the Forms notification email in Site settings.

- Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, headshot, `[X–Y weeks]`).
- Check the Lincoln Center / ON NYC pin coordinates (both on the generic NYC point).
- Verify footer letter-spacing and wordmark width on the first staging preview.
