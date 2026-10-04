# Topicweave mission release (was CKS) · prepared 2026-10-04, NOT released

The CKS mission becomes **Topicweave** (renamed 2026-10-01, v3 site in `X:/Claude-Skills/case-study-sites/cks-v3`).
Everything below is built and tested locally; nothing is committed, tagged, written to Webflow or published.
Release only after Angelino's OK and after the perf chat's release (v0.33.44 tagged 2026-10-04, commit 5d55fc7, not yet in Webflow). Ours: v0.33.45 (fetch tags first to confirm).

## What changed (code/src, mission bundle only)
- `mission/23-tw-base.js`: the Topicweave kit (`SCENE.kit.tw`): v3 colors, the real logo + mark SVGs, Fraunces + Inter Tight loader,
  and `weave()`, an ES5 port of the v3 thread cloth (`js/site.js` sheetWeave): radial cover + waving band.
- Six coded scenes, `mission/24-tw-*.js`: `tw-loom` (the loom: mark → scattered → tag once → connected → woven → night),
  `tw-plan` (dark FigJam board, 12 v3 decisions, 4 threads), `tw-app` (dashboard prototype: overview, topics, map, health),
  `tw-capture` (Voice Kit phone: record → review → publish), `tw-cms` (CMS tagging → topic page, related reading, JSON-LD),
  `tw-roadmap` (five phases beside real prototype screenshots, `code/vendor/topicweave/roadmap/`, 176 KB, loaded on first play).
- `mission/10-mocks.js`: `MOCKS.topicweave` (Figma hero + phone in the v3 look); `MOCKS.cks` stays as an alias until the slug change is live.
- `mission/40-monitor.js`: Topicweave channel changes knit the cloth from the pressed tab, then unravel onto the new channel.
- `mission/45-tw-page.js`: a strip of cloth knits in at each top-level section boundary as it comes on screen (still under reduced motion).
- `mission/30-mission.js`: `tw-*` channel ids are their own kind; manifest tiles for `topicweave`/`cks` in black + lilac.
- Removed `mission/22-cks.js` and the old CKS CSS (kept the `.cx-live*` rules the live-site feature uses). Styles: the TOPICWEAVE
  section at the end of `ab-mission.css`.
- Bundle: ab-mission.prod.js ~241 KB (was 225 KB). Tested with `.tw-test/harness.py` (local, git-excluded): all 8 channels,
  reduced motion, portrait stage, full page; no console errors.

## CMS (staged in `cms/topicweave/release.json`, apply at release)
Mission item rename + slug `topicweave`, copy, brand fields, stack (Figma, Canvas API, SVG, Claude, Hostinger), 8 channels,
6 systems, 5 problems, 4 stats, the Observatory link, the Canvas API tool line. Cover + social image from `og/topicweave_cover.py`
(screenshots of the v3 site's own code). `after_pass` (planet colors) waits for the perf pass.

## Release order
1. `git fetch --tags`; take the next free tag. `npm run build`; commit only `src/mission`, `src/ab-mission.css`, `vendor/topicweave`,
   `dist/ab-mission.*` and their `sri.json` keys (+ this doc, `cms/topicweave`, `og/topicweave_cover.py`). Tag, push, purge jsDelivr, hash-check.
2. Re-register ABMission (same display name, new version) on the Missions template.
3. Upload the cover + OG assets, then apply `release.json` (update_collection_items by id; the Observatory body: read, swap the one link, write back).
4. Angelino: 301 `/work/cks` → `/work/topicweave` (Site settings › Publishing); bump the ab-mission CSS `<link>` in the Missions template head (Designer).
5. Live link stays empty (Angelino 2026-10-04) until topicweave.com is deployed; set live-url then.
6. Publish barajasdsgn.com + www + webflow.io together; verify /work/topicweave, the 301, the 4 other missions' chips, /services lists.
7. After the perf pass (perf chat or here): `home/10-work.js:105` match `'topicweave'` (Home card loom), `about/00-about.js:296` badge
   sticker 'CKS' → Topicweave + colors; then the new planet (`after_pass`).
