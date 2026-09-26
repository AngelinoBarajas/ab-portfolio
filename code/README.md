# Custom code

`src/` holds the source modules (split from the prototypes per `docs/code-map.md`); `dist/` holds what Webflow loads from jsDelivr. Never edit `dist/` by hand.

## Build + deploy

```
cd code
npm install        # once (acorn + terser)
npm run build      # src → dist, ES5 syntax check, minify, dist/sri.json
```

1. Bump `version` in `package.json`, build, commit, `git tag -a vX.Y.Z`, push `main` and the tag.
2. Check the CDN copy matches `dist/sri.json` before touching Webflow (a new tag can 404 for a minute; purge with `https://purge.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@vX.Y.Z/code/dist/<file>`).
3. Webflow MCP (`data_scripts_tool`), **since 2026-09-26 no script registry** (it can't take `defer`): JS loads from freeform footer code as `<script defer src="…@vX.Y.Z/code/dist/<file>.prod.js" integrity="<sri>" crossorigin="anonymous">`. `ab-core` + GSAP + Lenis live in **Site settings › Footer** (`set_site_freeform_code` footer, in that order); each page bundle in its **page footer** (`set_page_freeform_code` footer). Every one must stay `defer`: a non-deferred page bundle would run before the deferred core and bail out. Only the tiny `abwarpin` stays registered (header, it must run before first paint). CSS: `<link>` in site/page head as before. Read the block first: every freeform write replaces it.
4. Publish to **webflow.io only** and re-test.

Registered (hosted) scripts only take `data-*` attributes: `defer`/`async` are rejected (400). `bundle(dir, out, guard, { split: true })` runs every module after the first as its own task (Home).

Minified files are named `*.prod.js` / `*.prod.css`, not `*.min.*`: for a `.min.js` path jsDelivr may serve its own on-the-fly minified build instead of the committed file, which breaks SRI (hit on v0.1.0).

## Bundles

| File | Loads | Where |
|---|---|---|
| `ab-core.prod.css` | from `src/ab-core.css` (short aliases → Webflow variable names) | Site settings › Custom code › Head (`<link>`) |
| GSAP 3.13 (+ ScrollTrigger, Draggable, InertiaPlugin, SplitText, ScrambleText, Flip), Lenis 1.3.26 | jsDelivr npm | Site footer code (deferred, SRI), first | Site scripts, footer, in that order |
| `ab-core.prod.js` | `src/core/*.js` | Site footer code (deferred), after Lenis |
| `ab-home.prod.js` | `src/home/*.js` | Home page footer code (deferred) |
| `ab-work.prod.js` | `src/work/*.js` | Work page (Mission archive) footer code (deferred) |
| `ab-mission` / `ab-services` / `ab-about` (+ `.css`) | `src/mission`, `src/services`, `src/about` | Mission template / Services template / About page footer code (deferred) + page head `<link>` |
| `ab-404.prod.js` + `ab-404.prod.css` | `src/404/`, `src/ab-404.css` | 404 utility page footer code (deferred) + page head `<link>` |
| `ab-process.prod.js` + `ab-process.prod.css` | `src/process/`, `src/ab-process.css` | Process page footer code (deferred) + page head `<link>` |
| `ab-hub.prod.js` + `ab-hub.prod.css` | `src/hub/`, `src/ab-hub.css` | Services hub (`/services`) page footer code (deferred) + page head `<link>` |

Each bundle is one `window.Webflow.push` with one `__ab<Name>Init` guard; modules share a scope and every animation checks `prefers-reduced-motion`. `ab-core` exposes helpers to page bundles on `window.AB` (`$`, `$$`, `toast`, `warp`, `lenis`, `buildPlanet`, `settings`, `quotes`, `decorate`, `nudge`…), so a page bundle must load after it.

`ab-core` injects the script-only layers (nebula, starfield canvas, grain, warp flash, toast, layout grid, cursor HUD); the Home bundle injects the altitude meter.
