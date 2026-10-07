# kip mission relaunch (kipvillage.com) · v0.33.62 + v0.33.64 · LIVE 2026-10-07

The `/work/kip` debrief (#03) rewritten for the new one-page kip site with the interactive 3D house (kipvillage.com, launched
2026-10-06, repo AngelinoBarajas/kip-one). Story, numbers and renders: `X:/Claude-Skills/kip-site/debrief-kit/README.md`.
Pattern: `docs/topicweave-release.md`. CMS copy as applied: `cms/kip/release.json` (approved by Angelino 2026-10-06).

## Decisions (Angelino, 2026-10-06)
- **Figma first, for real:** a kip ideation file was built from the real material, since none existed:
  "kip — ideation" `Nhlxla9IeUsZ3Fz1sgQajt` (4 boards: cast + real iteration notes, house wireframe room → feature,
  one-page + phone wireframes, 5 phone screens). His original chibi reference image was never saved; the cast board
  describes the iterations in words (add the reference if he sends it).
- **Signature planet:** June's head is the planet, the rings are the crib mobile spinning (his idea). Her head is the real
  3D character, shot on the live scene against its hidden green `Booth June` at 4x DPR (Nursery opened via emitEvent,
  booth recolored to #00ff00 at runtime, happy frame picked) → `code/vendor/kip/june-head.webp` (373×357). Moving the
  Spline play camera from the runtime does nothing (the page drives it); open a room instead.
- **8 channels:** kipvillage.com (live iframe, still underneath, "Show the screenshot"), The house, Design → build,
  Site plan (`kip-plan`, coded), 3am mode, Double-dose catch, On phones, The village.
- **By the numbers:** 1 scroll (was 12 pages) · 5 rooms · 9 characters · 88 tappable things. Stack: Figma, Spline (new
  Tools item `6ac58fda1dd1650694084858`), Claude, GitHub, Hostinger.
- **Home board card:** Sam, June and Nana's 3D portraits hop instead of the flat SVG faces (v0.33.64). Board line set.

## What changed
- v0.33.62 (ab-mission JS): `mission/25-kip-plan.js` (new), `35-signature.js` (SIG.kip + image `ready` hook),
  `10-mocks.js` (MOCKS.kip rewritten), `30-mission.js` (kip-* kinds, `c.vid`, still-only entries aren't loops, Spline
  color), `40-monitor.js` (MP4 loop videos play only on the showing channel while on screen; live toggle label).
  Assets: `code/vendor/kip/` (june-head, hero-house, cast/*.webp 112px), `prototypes/img/kip2-ch-*` + `kip2-cover.webp`.
- v0.33.64 (ab-home JS): `home/10-work.js` kip frame → 3D portraits (built on v0.33.63; transmission stays in core).
- Loops recorded from the live site by `X:/Claude-Skills/kip-site/debrief-kit/record/record_loops.py`. Desktop WebPs
  are size-capped and blocky (the camera never rests), so desktop loops play their MP4; WebP stays as the file of record.

## Staged in Webflow (2026-10-07 00:18–00:20 UTC), NOT published
- Missions template scripts [abknowledge 0.33.39, abmission 0.33.62]; Home [abhome 0.33.64, abknowledge 0.33.39].
  Backup: `backups/2026-10-06-v0.33.62-64-page-scripts-before.txt`.
- CMS: Spline tool (created, ready to publish); kip mission (copy, live-url, platform, stack, cover re-hosted from
  jsDelivr, Board line); 8 channels, 6 systems, 5 problems, 4 stats (ids in release.json). Social image unchanged
  (old og-kip) until the OG proposal.
- Verified locally (`.kip-test/harness.py`, git-excluded): all 8 channels at 1440, phone channel at 390, reduced
  motion (stills, no video), live iframe; Home card at 1440 + 390; Topicweave Solved cards 0px jolt with 0.33.62.

## Published 2026-10-07 (screen-hopping chat's site publish with Angelino's OK, together with his Home → About move)
Verified live on barajasdsgn.com at 1440 + 390: ab-mission v0.33.62 + ab-core v0.33.63, kip signature planet (3 mounts), 8 channels (LIVE / LOOP / BUILD / PLAN), live link kipvillage.com, stats 1/5/9/88, new summary, house loop video plays; Home ab-home v0.33.64 with the 3 portraits; no console errors. Flight manual: changelog v0.33.62 + v0.33.64, histories (kip debrief, Home work board), feature card mission-kip rewritten.
Phone note: at 390 June's planet overlaps the switcher's next chip a little (hero planet position on phones).

### Publish checklist (as planned)
The other chats have staged work too (v0.33.63 Home edits; his Home → About Designer move must land first). One publish
for all, barajasdsgn.com + www + webflow.io. After: verify /work/kip live (8 channels, planet, live link), Home card,
/work cards, /services pages listing kip; then add v0.33.62 + v0.33.64 to the Flight manual changelog + histories
("kip debrief", "Home work board").

## Still open (proposed one at a time)
- OG image for /work/kip (old og-kip.png shows the flat characters).
- About crew-badge kip patch (planet colors only today; could carry June).
- Services: kip now has 3D; consider adding it to Interactive 3D's missions.
- `core/35-orbit.js` LOGOS has no Spline icon (falls back to the generic one); core belongs to the other chats.
