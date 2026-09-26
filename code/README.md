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
3. Webflow MCP (`data_scripts_tool`): `register_hosted_script` with the **same display name** and the new version (`update_registered_script` returns 404), then `add_site_script` / `add_page_script` with that version. CSS: `set_site_freeform_code` head `<link>` with the new URL + integrity.
4. Publish to **webflow.io only** and re-test.

Minified files are named `*.prod.js` / `*.prod.css`, not `*.min.*`: for a `.min.js` path jsDelivr may serve its own on-the-fly minified build instead of the committed file, which breaks SRI (hit on v0.1.0).

## Bundles

| File | Loads | Where |
|---|---|---|
| `ab-core.prod.css` | from `src/ab-core.css` (short aliases → Webflow variable names) | Site settings › Custom code › Head (`<link>`) |
| GSAP 3.13 (+ ScrollTrigger, Draggable, InertiaPlugin, SplitText, ScrambleText, Flip), Lenis 1.3.26 | jsDelivr npm | Site scripts, footer, in that order |
| `ab-core.prod.js` | `src/core/*.js` | Site scripts, footer, after Lenis |
| `ab-home.prod.js` | `src/home/*.js` | Home page scripts, footer |
| `ab-work.prod.js` | `src/work/*.js` | Work page (Mission archive) scripts, footer. Registered script `abwork` |
| `ab-mission` / `ab-services` / `ab-about` (+ `.css`) | `src/mission`, `src/services`, `src/about` | Mission template / Services template / About page footer + page head `<link>` |
| `ab-404.prod.js` + `ab-404.prod.css` | `src/404/`, `src/ab-404.css` | 404 utility page footer script `ab404` + page head `<link>` |
| `ab-process.prod.js` + `ab-process.prod.css` | `src/process/`, `src/ab-process.css` | Process page footer script `abprocess` + page head `<link>` |
| `ab-hub.prod.js` + `ab-hub.prod.css` | `src/hub/`, `src/ab-hub.css` | Services hub (`/services`) footer script `abhub` + page head `<link>` |

Each bundle is one `window.Webflow.push` with one `__ab<Name>Init` guard; modules share a scope and every animation checks `prefers-reduced-motion`. `ab-core` exposes helpers to page bundles on `window.AB` (`$`, `$$`, `toast`, `warp`, `lenis`, `buildPlanet`, `settings`, `quotes`, `decorate`, `nudge`…), so a page bundle must load after it.

`ab-core` injects the script-only layers (nebula, starfield canvas, grain, warp flash, toast, layout grid, cursor HUD); the Home bundle injects the altitude meter.
