# AB Portfolio — Webflow build

Angelino Barajas' portfolio. A space-themed site with a Figma-canvas UI, one orange accent (#FF6A3D) and a lot of micro-interaction. The design is finished and lives in `prototypes/`. This repo holds everything needed to rebuild it in Webflow properly, plus the custom code the Webflow site loads.

## Ground rules

- **The prototypes are the spec.** Open them in a browser (`npx serve prototypes` or any static server) and match them. Do not redesign.
- **Real Webflow variables, not hard-coded values.** Every color, font, size and spacing value comes from the variables in `tokens/tokens.json`. Classes reference variables. No raw hex codes in classes.
- **Client-First naming** (`section_`, `padding-global`, `container-large`, `heading-style-h2`, `text-size-*`, `button`, `is-*` combo classes). Custom components use the `ab_` prefix, e.g. `ab_nav`, `ab_bento`, `ab_next-card`, `ab_planet`.
- **Designer first.** Anything Webflow can do natively (layout, type, color, hover states, simple interactions) is built with classes. Custom code only for what Webflow can't do: procedural planets, starfield, globe, drag physics, scroll systems, warp transitions, black hole footer.
- **Custom code standards** (same as the 510 Visuals site): ES5 only (`var`, `function(){}`, no arrow functions, template literals, optional chaining or `??`), wrapped in `window.Webflow.push`, one `window.__ab<Name>Init` guard per script, a `prefers-reduced-motion` check in every animation, `-webkit-backdrop-filter` before `backdrop-filter`. Load GSAP 3.13 (+ ScrollTrigger, SplitText, Draggable, InertiaPlugin, ScrambleTextPlugin, Flip) and Lenis **once**, site-wide.
- **Placeholders are fine.** Anything in `[brackets]` or marked placeholder stays as-is; Angelino replaces it later (see `docs/placeholders.md`). Never invent real client facts.
- **Ask before destructive actions** in Webflow (deleting pages, collections, styles or variables) and before publishing the site.

## Tools

- **Webflow MCP** (official). Designer tools need the Webflow MCP Bridge app open in the Designer for the target site. Use Designer tools for variables, styles, components and page structure; Data API tools for CMS collections, items and custom code.
- **GitHub.** This repo. Custom scripts in `code/` are served to Webflow from GitHub via jsDelivr (`https://cdn.jsdelivr.net/gh/<owner>/ab-portfolio@<tag>/code/dist/<file>.js`). The repo must be public for jsDelivr, or use Webflow's hosted custom code for small scripts instead. Tag a release for each deploy so the URL is versioned.

## Build order (check off in `docs/progress.md` as you go)

1. **Site.** Find or create the Webflow site **"AB Portfolio"**. Confirm the site ID with Angelino before writing to it.
2. **Variables** from `tokens/tokens.json`: collections Color (modes **Dark (base)** and **Light**), Typography, Size, Spacing. Load the Google Fonts (Archivo variable with width axis, Geist, JetBrains Mono, Caveat).
3. **Global styles.** Body, headings, Client-First utility classes, `button` (+ `is-primary`, `is-ghost`), `text-style-eyebrow`, `heading-style-*`. Light sections use the Light variable mode on a `theme-light` wrapper.
4. **CMS.** Create collections from `cms/schema.json` in the listed order, then import `cms/seed/*.json`. References in seed files use slugs (`"mission": "510-visuals"`) and FAQ `_key`s; resolve them to item IDs after the target items exist. Skip `_placeholder`/`_key`/`_id` helper keys (they're notes, not fields).
5. **Components.** Nav (with the mobile menu), black hole footer, next-mission card, bento card, mission card, FAQ item, section frame label. Build once, reuse everywhere.
6. **Pages** in this order: Home → Work (Mission archive, `/work`) → Mission template (`/work/[slug]`) → Services template (`/services/[slug]`) → About → 404.
7. **Custom code.** Split the prototype scripts into modules in `code/src/` using `docs/code-map.md`. Build to `code/dist/`, push, tag, then add the `<script>` tags in Webflow (site-wide footer vs page/template footer). Webflow reads CMS values through `data-` attributes on elements, the same way the prototypes read their data objects.
8. **QA.** Compare each page against its prototype at 1440, 1024 and 390 wide. No console errors, no horizontal scroll, reduced motion works, Lighthouse pass. Then ask Angelino before publishing.

## Files

| Path | What |
|---|---|
| `prototypes/*.html` | The approved designs (self-contained; linked to each other locally) |
| `prototypes/img/` | Images the prototypes use |
| `tokens/tokens.json` | Webflow variables: names, values per mode, what each is for |
| `tokens/tokens.css` | Same colors as CSS custom properties, for custom-code embeds only |
| `cms/schema.json` | CMS collections and fields |
| `cms/seed/*.json` | Content for every collection (real where known, placeholder where not) |
| `docs/build-spec.md` | Sitemap, components, page sections, class naming |
| `docs/code-map.md` | Every script and CSS section in the prototypes, and where it goes in Webflow |
| `docs/placeholders.md` | Everything Angelino still has to supply |
| `docs/progress.md` | Build checklist, update as you go |
| `code/` | Custom scripts for Webflow (`src/` → `dist/`) |
