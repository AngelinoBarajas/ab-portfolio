# Session handoff (2026-09-25, end of the custom-code session)

Read this first in a new chat, then `CLAUDE.md`, `docs/progress.md` and `docs/webflow-build-notes.md`.

## Where things stand

| Step | Status |
|---|---|
| 1. GitHub repo | ✅ Public: github.com/AngelinoBarajas/ab-portfolio (`main`) |
| 2. Site | ✅ AB Portfolio `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io). Home page `6ab5fe4b5ee75f9c981dc0cb`. Published to **webflow.io only** (no custom domain). |
| 3. Variables + fonts | ✅ 38 variables (37 from tokens + `Neutral / Glass`); 4 custom variable fonts (Archivo with wdth axis). IDs in `docs/webflow-ids.md` |
| 4. CMS | ✅ 13 collections, 149 items, all references resolved. IDs in `docs/webflow-cms-ids.json` |
| 3b. Global styles | ✅ 29 classes + tag styles (Body, H1–H6, p) |
| 5. Components | 🟡 Nav, Footer, Frame label, Bento card, FAQ item done (group "Global"). Remaining: mission card, next card, code block, crew dock, built on the first page that uses each |
| 6. Pages | 🟡 Home built + on staging (ab-portfolio-723a30.webflow.io, 2026-09-25). Remaining: Work, Mission template, Services template, About, 404 |
| 7. Custom code | 🟡 Part 1 done 2026-09-25: site-wide `ab-core` (JS + CSS) + Home `ab-home`, on staging at v0.1.4 (Home review edits applied; metrics copy still open). Build/deploy steps in `code/README.md`; what was re-pointed and the deviations in `docs/webflow-build-notes.md` › Custom code, part 1. **Waiting on Angelino's OK for Home**, then pages resume with Work (each page gets its own bundle) |

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

1. **Metrics (Statement section) — waiting on Angelino.** He wants more meaningful numbers than 11 / 14 / 2 (ideas he floated: characters of custom code, number of Unicorn Studio scenes; others offered: CMS items powering the interactive pieces, sites shipped). **Don't invent figures**: ask for the three numbers + labels, then update each `.ab_metric_number` text **and** its `data-count` attribute (the count-up animates to `data-count`) plus `.ab_metric_label`, via `data_element_tool` on page `6ab5fe4b5ee75f9c981dc0cb`. Publish webflow.io only.
2. Then his **OK for Home**, then build **Work** (Mission archive) per the build order, with a new `ab-work` bundle (`code/src/work/`, add `await bundle('work', 'ab-work', '__abWorkInit')` to `build.mjs`), same deploy steps.
3. `/work/<slug>` 404s until the Mission template is built; board frames already link there.

## Home review edits already done (v0.1.4, from `ab-portfolio-hp-edits.docx`)

Hero drag cue · altitude meter readable on light sections · planner readout under the visual · tool brand logos + new Photoshop/Illustrator/Lightroom Tools items · mobile: giant planet higher, work deck swipes, footer planets scattered, selection tags hidden (cursor under the word) · dot field tighter · less map-focused copy (hero lede, WebGL bento card, footer line + service link) · board frame colors fixed (Designer bindings) and new hidden `brand-accent` node drives preview pin colors. Full list: `docs/webflow-build-notes.md` › v0.1.4.

Possible follow-ups he may raise: Tools list order (the 3 new Adobe items sort first and take the inner ring; set a sort in the Designer or a script order), the Services CMS item `webgl-data` still named "Globes, maps + 3D" (update with the Services template), and the heading-span effect classes / `#plRead` position that the script patches (cleaner in the Designer).

## Open items for Angelino

- **Metrics numbers** for the Statement section (see Next session).
- **Home OK** (stop point, now with the custom code live on staging). Please look at it in a real browser: the starfield, lazy planets and animation feel couldn't be checked from the hidden browser pane. The 3 Designer steps are done (reload, color bindings, form renamed "Mission Planner"; ID restored to `planner`). Still confirm the Forms notification email in Site settings.

- Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, headshot, `[X–Y weeks]`).
- Check the Lincoln Center / ON NYC pin coordinates (both on the generic NYC point).
- Verify footer letter-spacing and wordmark width on the first staging preview.
