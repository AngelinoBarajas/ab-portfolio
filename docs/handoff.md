# Session handoff (2026-09-25)

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
| 7. Custom code | 🟡 Part 1 done 2026-09-25: site-wide `ab-core` (JS + CSS) + Home `ab-home`, on staging (core v0.1.2, home v0.1.3). Build/deploy steps in `code/README.md`; what was re-pointed and the deviations in `docs/webflow-build-notes.md` › Custom code, part 1. **Waiting on Angelino's OK for Home**, then pages resume with Work (each page gets its own bundle) |

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

## Deferred to step 7 (`code/src/ab-core.css` + `ab-core.js`)

Listed in `docs/webflow-build-notes.md` → "To ab-core.css". Scripts read the `[data-site-data]` block for Site Settings + Quotes.

## Next session

- If Angelino OK'd Home: build **Work** (Mission archive) per the build order, then `ab-work` bundle (`code/src/work/`, add it to `build.mjs`), same deploy steps.
- If he flagged Home issues: fix in `code/src/`, bump the version, rebuild, tag, re-register (same display name, new version), publish webflow.io only.
- `/work/<slug>` 404s until the Mission template is built; board frames already link there.

## Open items for Angelino

- **Home OK** (stop point, now with the custom code live on staging). Please look at it in a real browser: the starfield, lazy planets and animation feel couldn't be checked from the hidden browser pane. The 3 Designer steps are done (reload, color bindings, form renamed "Mission Planner"; ID restored to `planner`). Still confirm the Forms notification email in Site settings.

- Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, headshot, `[X–Y weeks]`).
- Check the Lincoln Center / ON NYC pin coordinates (both on the generic NYC point).
- Verify footer letter-spacing and wordmark width on the first staging preview.
