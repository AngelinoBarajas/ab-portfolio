# Session handoff (2026-09-29, mobile + About session closed: v0.32.3 on staging; next: Mission bundle review, knowledge template CSS drift, Designer tidy-ups)

Read this first in a new chat, then `CLAUDE.md`, `docs/progress.md` and `docs/webflow-build-notes.md`.

## Calm mode (2026-09-29, v0.33.0) · verified on staging

- **What:** the visitor's own reduced-motion switch. Footer bar "Calm mode · Off/On" (next to Layout grid, also shown on touch) + **Shift+M**; stored in `localStorage ab:calm`, applied on reload. Same effect as the device setting (a device asking for reduced motion shows "On (device setting)", locked).
- **How:** `core/00-base.js` `AB.reduce = system || calm` (+ `AB.sysReduce`, `AB.calm`), so every bundle follows it; `html.ab-calm` set before first paint by head script **`abwarpin` 0.5.0** (also skips the first-visit warp). `build.mjs` `calmMirror()` copies every `@media (prefers-reduced-motion:reduce)` block under `:where(html.ab-calm)` (no added specificity) and scopes `no-preference` blocks with `:where(html:not(.ab-calm))`. Toggle in `core/20-ui.js`, styles in `ab-core.css`.
- **Live:** ab-core JS + CSS **v0.33.0**, abwarpin **0.5.0** (site scripts order unchanged). Verified: toggle on → reload, Lenis off, 0 GSAP tweens, CSS keyframes off, persists on /about, /services/motion, /observatory; Shift+M back off; no console errors. Backup: `backups/2026-09-29-v0.33.0-calm-before.txt`.
- **Follow-up:** page CSS bundles (about, hub, services, process, contact, knowledge, 404) were built at v0.33.0 with the calm mirror but their page-head `<link>`s were NOT bumped (their source is otherwise unchanged since the live versions, so bumping to v0.33.0 is safe). Their few page-level reduced-motion rules (shelf, hub, etc.) ignore Calm mode until then. `mission/20-scenes.js` + `vendor/aguirre-case-map.js` read `AB.reduce` in source but ship with the next ab-mission release (item 1 below).
- Field note draft **18** (`content/insights/drafts/18-designers-hardest-audience.md`, status draft) names Calm mode; not imported.

## Next session

**Live on webflow.io (verified 2026-09-29 04:35 ET, API + 10 pages at 1440 and 390, no page errors, no horizontal overflow, after Angelino's own Designer publish):** ab-core JS + CSS **v0.32.0** (site-wide; head script `abwarpin` 0.4.0), ab-home **v0.32.0** (+ knowledge 0.25.5), ab-about JS + CSS **v0.32.3**, ab-contact JS + CSS **v0.32.0**, ab-process JS + CSS **v0.32.0**, ab-hub JS 0.30.3 + CSS 0.30.8, ab-services JS **0.30.9** + CSS **0.30.10** (+ knowledge 0.25.5 on the template), ab-knowledge JS + CSS **0.31.0** on /observatory (/topics still 0.30.0), ab-mission JS 0.28.6 + CSS 0.26.5, ab-work JS 0.26.1, ab-404 JS 0.14.0 + CSS 0.7.1. Home hero cue is now Designer text "↗ Go ahead, throw it." (he typed it). Webflow asset `6abb34929dc4c32cda9248fa` = his astronaut portrait (badge).

Open, most blocking first:
1. **ab-mission not released since 0.28.6 / CSS 0.26.5.** `src/mission/22-cks.js` (CKS demo: on-brand empty-input message) and `src/ab-mission.css` carry changes since those versions, and ab-mission.css has ~35 lines of changes from earlier sessions nobody reviewed this session. The Missions template head holds a Designer-bound `robots` meta, so its CSS `<link>` can't be rewritten through the API ([[lesson_webflow-head-with-bound-field-no-api-rewrite]]): review the CSS diff, then bump the link in the Designer (Page settings › Custom code) and the script by API.
2. **Knowledge CSS drift:** Home, the Services template and the Missions template load `ab-knowledge.css` 0.25.5; the Observatory + Topics templates were 0.25.5 at the last check; /topics JS is 0.30.0. Nothing visibly broken, but five-plus releases behind.
3. **Small Designer tidy-ups (Angelino, reload the Designer tab first: a stale tab republishes old custom code):** delete the period in "↗ Go ahead, throw it." (it sits next to the "·"); optionally drop the astronaut portrait asset into the badge frame `[data-badge-photo]` (script places it until then); `docs/designer-steps.md` › J1/J2, I1, H1–H6, G5/G6/G8, Nav `ture`.
4. **Small code items:** the Return to orbit thruster `.ab_top-fl` animates `height` (switch to `transform: scaleY`); planner Name became required by script (`home/50-planner.js` rule) — undo if he wants it optional; Turnstile loads on `requestIdleCallback`, so on a busy phone the submit can stay disabled a while (the form layer shows a pre-flight note); watch it on a real phone.
5. **Still waiting from before:** optional "Flight programs" collection (2b); Mission Types Sort not renumbered (the only Sort field left at 1–12).

**Before touching code:** `git pull`; tags are shared with parallel sessions: `git fetch --tags && git tag --sort=-v:refname | head -1` (**v0.32.3** at the end of this session). **v0.28.7 is a stray tag**: never reuse it. After tagging, poll jsDelivr for the tag before purging and hashing. To test local dist against staging, strip `integrity` from the HTML and drop the response `Link` header ([[lesson_webflow-link-header-sri-local-test]]).

## Latest (2026-09-29, v0.32.1 → v0.32.3) · verified on staging 2026-09-29
Live: ab-about JS + CSS **v0.32.3** (v0.32.3: no planet rebuild after it grows, at his ask; the zoomed texture reads fine). Tether SVG overflow needs two classes (`.abpa-cordw .abpa-cord`, Webflow's `svg:not(:root){overflow:hidden}` reset). After a snap the far planet grows into the lower right (rebuilt at the new size), then probe AB-02 flies through the sky with a random readout (`LOST` lines), then leaves.

## Latest (2026-09-29, v0.31.4 → v0.32.0) · verified on staging 2026-09-29
Live: ab-core JS + CSS **v0.32.0**, ab-home **v0.32.0**, ab-about JS + CSS **v0.32.0**, ab-contact JS + CSS **v0.32.0**, ab-process JS + CSS **v0.32.0**. Not shipped: ab-mission (CKS demo message; its template head has a Designer-bound robots meta, and ab-mission.css carries unreviewed changes since 0.26.5).
- About › Why before how: his astronaut (`logo/SVG/astronaut-1.svg`, recolored; paths embedded in `about/00-about.js`) on a flat tether from the frame's bottom edge (never clipped), deep-space viz (badge sky + a builder planet that bounces on scroll), scroll inertia + drag with a speed-capped spring; pulled past 1.6× the frame + 60px the tether snaps and he drifts off on a fixed layer until reload; he paints over the card copy/neighbors (viz z 5, card z 3). Grey shading paths carry a same-color 2-unit stroke (base-shape seams).
- About bookshelf: hover picked by pointer x over each book's offsetLeft slot (`is-hot`, `is-hot-l/-r`), no :hover flicker; knock = lift, power2.in tip to 74°, small rebound, rest, power3.out back.
- Forms: `core/43-validate.js` (`AB.formCheck`), inline "◆ MISSING / SIGNAL CHECK" lines, "◆ HOLD LAUNCH / HOLD TRANSMISSION" summary, pre-flight note while Webflow's Turnstile keeps the submit disabled; planner Name now required by script; reduced-motion requestSubmit deferred (it never posted before).
- Return to orbit probe (`core/42-top.js`): label "Return to orbit", click plays the site warp and jumps home under the flash. Next-card planets back to their Designer size (v0.31.0 enlargement removed). Home meter waypoint stacked on a second line. Contact: the CSS mask on `.abc-dish` (it clipped the beam: masks clip overflow) replaced by an SVG mask on `.abc-cone` only.

## Latest (2026-09-28, v0.31.3) · verified on staging 2026-09-28
Live: ab-about JS + CSS **v0.31.3**. Crew badge photo: his astronaut portrait (Webflow asset `6abb34929dc4c32cda9248fa`, 720×899 WebP, transparent) placed by script when the Designer frame has no <img> (`BADGE_IMG` in `about/00-about.js`), over `.ab_badge_sky` (nebula glow, two star strips sliding by transform, a shooting star every 9 s; static under reduced motion). Designer step (optional): drop the asset into `[data-badge-photo]`; the sky stays.

## Latest (2026-09-28, v0.31.1 → v0.31.2) · verified on staging 2026-09-28
Live: ab-about JS + CSS **v0.31.2** (v0.31.2: arm + shoulders removed at his ask; the helmet sits on its collar ring at the viz bottom, viewBox 160×128, xMidYMax, max-width 88%). Philosophy card: the thinking helmet in the 404 astronaut's flat style (`about/00-about.js` › philosophy; `.is-ph.is-helm`, `.abph-h`): a bust flush to the viz bottom, visor gradient shifts per question (7 palettes), glint sweep, thought bubble, nod; idle float/tilt paused off screen; the old `.ab_ph_mark` is hidden. Thinker v1/v2 prototypes rejected.

## Latest (2026-09-28, v0.31.0) · verified on staging 2026-09-28
Live: ab-core JS + CSS **v0.31.0**, ab-home JS **v0.31.0** (+ knowledge 0.25.5), ab-about JS + CSS **v0.31.0**, ab-knowledge JS + CSS **v0.31.0** on /observatory only (/topics + templates unchanged), ab-contact CSS **v0.31.0**. Backup: `backups/2026-09-28-v0.31.0-before.txt`.
- About crew: `crew3d` in `about/00-about.js` (tilted plane, depth scale, sun-side lighting, pointer tilt; `.ab_crew_sys.is-3d` hides the Designer orbits; legend kept). Bookshelf: depth, `CURRENT` = The Alchemist (moved to the middle so phones see it), hover lean via custom properties, `.is-out` drops the transition.
- Next card ≥992px: planet 1.9× card height (520–880px), centre past the bottom-right corner; `layout()` aims the ship at the visible upper-left; ringed planets lose their ring off-card. `core/38-next.js` › size().
- Back to top: `core/42-top.js` (`.ab_top`), after 1.5 screens on pages > 2.5 screens; phones show on scroll up; hidden with the mobile menu open and when the footer fills the lower half.
- Observatory drones: parking spot stored as an offset from the planet, beam `transformOrigin 0% 50%`, everything re-placed in a gsap.ticker per drone; packets travel by `left` %. RX readout hidden ≤767px.
- Home meter: Gargantua distance (1.5B km, squared falloff, Miller's planet at 46–54%, "Event horizon" at the end), fills from the top, black hole dot at the foot.
- Home Field notes compact chart: background stars R2-scattered. Contact: `input.button.is-primary:hover` background fill; `.abc-dish` bottom mask fade.
- Forms validation layer in progress.

## Latest (2026-09-28, v0.30.12) · verified on staging 2026-09-28
Live: ab-about CSS **v0.30.12** (JS 0.29.17). `.section_about-off .padding-section-medium{padding-top:0}`: first content 300→180px desktop, 174→110px phone (matches Home › Services + service Further reading).
In progress (not shipped): Home Field notes compact chart star scatter (`home/20-services.js` › observatoryCompact bg, R2 sequence) is edited in src but uncommitted; About card redesign prototype at `prototypes/about-cards.html` (3D crew orbit + low-poly Thinker in an orange helmet).

## Latest (2026-09-28, v0.30.11) · verified on staging 2026-09-28
Live: ab-core CSS **v0.30.11** (JS 0.30.9). Home minis ≤767px: `.ab_bento-card.is-mini{flex:0 0 auto;padding:22px}` (flex 1 1 0 + centered content ran the month chips / bubble to 4–6px from the edge; now 23px).

## Latest (2026-09-28, v0.30.10) · verified on staging 2026-09-28
Live: ab-services CSS **v0.30.10** (JS 0.30.9). Service Further reading (`[data-ks-row="service"]`, theme-light curve) no longer doubles its top padding: `.ab_ks-pad{padding-top:0}` scoped to the service row only (Home + mission rows have no curve padding and keep theirs). First content 180→110px on a phone, 310→180px on desktop.

## Latest (2026-09-28, v0.30.9 · mobile pass 1) · verified on staging 2026-09-28
Live: ab-core JS + CSS **v0.30.9**, ab-services JS + CSS **v0.30.9** (Services template), ab-process JS + CSS **v0.30.9**. Backup: `backups/2026-09-28-v0.30.9-before.txt`.
- Flight computer foot reserves the longest note's height (`sizeNote()` in `services/30-flight.js`); ≤479px the Run button takes its own full-width row under the note.
- Next-service card: the `.nx-c.br` corner was stretched to the whole card by the Branding program's bare `.br{width:100%;height:100%}` in ab-services.css. Branding rules now scoped `.fc-stage .br`. ≤479px the card is one column with the planet absolute bottom-right; `(hover:none)` drops the sticky 14px title shift.
- `AB.fitWide(el, min)` (core 00-base): shrinks a display title only when its widest line overflows; applied to every `.ab_dbh_title` and `.ab_next-card_title`. Desktop titles unchanged (checked 7 pages at 1440).
- Home Custom deploys terminal ≤479px: window dots hidden, tabs tighter (242px, fits at 360).
- /process star chart on charts <520px: orbits 0.5/0.64/0.78/0.92 (was 0.36–0.84), planets `--ps:.66`, KNS satellite at −55°.
- Test harness note: to test local dist against staging, strip `integrity` from the HTML AND drop the response `Link` header (Webflow sends preload hints carrying the old SRI).

## Latest (2026-09-28, v0.30.1 → v0.30.8) · verified on staging 2026-09-28
Live: ab-core CSS **v0.30.5** (JS 0.30.0), ab-home **v0.30.5**, ab-process JS **v0.30.7** + CSS **v0.30.6**, ab-hub JS **v0.30.3**.
- v0.30.8 the core selection box (`.sel`, appended inside every `[data-selectable]`) collapsed to a line on the gauge: `.abp-console>*:not(.abp-con-deco){position:relative}` also hit it. Excluded `.sel` there and in two older ab-hub child rules. Any new `X > *{position:relative}` rule on a selectable card must add `:not(.sel)`.
- v0.30.6 /process gauge console: brackets, rivets, grid and scanlines moved inside the bezel (`.abp-con-deco` inset 7px; the rivets sat on the inner bezel line and the grid ran over the frame, so the border looked broken) · v0.30.7 /process touchdown planet lands at 58% of the screen at the end of the route (was 70%, `xp` in `layout()`)
- v0.30.1 tokens card keeps a fixed size across themes · v0.30.2 COMMS scope set into a small instrument module · v0.30.3 launch pass lifts when it scrolls or prints under a still mouse (settle check after scroll/print) · v0.30.5 the dish became a satellite (hero-satellite parts): the signal dot appears, it drifts a little toward it and turns, then locks on (beam, lock ring, "Locked"); frequency color per quote from the /process COMMS palette (CH 01–06); quote scramble slowed (1.6 s per word, 0.14 s stagger) and auto-advance lengthened to match · v0.30.4 Home transmission: a receiving dish beside the quote (≥1200px; turns to each quote's source, noisy waveform settles as it decodes, RX source + Decoded % readout; the quote reserves the dish's column), quote marks ride on the first/last word so the closing mark can't wrap alone.

## Latest (2026-09-28, v0.30.0 tweak batch) · verified on staging 2026-09-28
Live: ab-core JS **v0.30.0** + CSS **v0.30.1** (tokens card keeps a fixed size across themes), ab-home, ab-process JS v0.30.0 + CSS **v0.30.2** (COMMS scope in a small instrument module), ab-hub JS + CSS, ab-knowledge JS + CSS (/observatory, /topics + both templates; Home still loads knowledge 0.25.5), ab-contact CSS all **v0.30.0**; head script `abwarpin` **0.4.0**. Backup of replaced heads: `backups/2026-09-28-v0.30.0-before.txt`.
- **First visit warps in** (abwarpin 0.4.0 sets `ab:warp-in=first` once per session; core arrive() plays a slower drop out of hyperspace).
- **Home:** Reply time card = slow conic orange→peach aura + twinkling sparks; easing dot is HTML (no stretch); planner route centered (Earth at 110,138); board layers zoom to their frame (~126%), same layer again = fit; fake cursor waits while zoomed; CMS card sources colored (Airtable gold, Sheets green, API violet), packets turn Webflow blue on arrival, "+1 item"; Design systems card = token set re-skinning a card/button/type scale (AB · Nova · Terra, auto every 3.2 s, clickable); nav logo orange on Home; badge Est. 1987 + services lede (script, Designer steps J1/J2); transmission auto-advances (4.2 s + 30 ms/char, pauses on hover/off screen) with a scramble plot-in; 6 book quotes added to the Quotes CMS (11 total, also in the footer rotator).
- **Contact:** Other channels email = mono lowercase address + Copy, full width; cells 2×2 at 992–1439.
- **/observatory:** research drones fly in, beam a field note (real codes/titles) to the planet, fly off (7–12 s, max 2). Browse-by-topic + /topics vocabulary headroom removed (`.section_ks-browse .ab_ks-pad{padding-top:0}`).
- **/topics star chart:** six distinct constellation shapes, glowing titles with code lines + brackets, per-category nebulae, zoom controls bottom-right.
- **/process:** Crew card has a turning service-color gradient border + gradient ticks; COMMS bar = chip + contact-style scope stacked left, updates right; route-length rows each own a color, gauge arc blends the chosen colors, instrument-panel face-lift, needle wobble + arc pulse.
- **/services hub:** launch pass grows (~1.12) and centers on desktop hover, tilt applies once lifted; touch/narrow/reduced motion unchanged.
- **CMS:** field note WB-09 AOL Hometown dates (around 2000; shut down Oct 31, 2008). All Sort fields ×10 (213 items; backup `backups/2026-09-28-sort-before.json`).

## Latest (2026-09-28, v0.29.17) · verified on staging 2026-09-28

- **About bookshelf:** six spines carry real titles (script: `about/00-about.js` › bookshelf TITLES), each on the genre spine that fits and keeping its color: The Little Prince (Kid lit), The Alchemist (Epic fantasy), Thus Spoke Zarathustra (Zarathustra), Plato's Republic (Philosophy), 1984 (first Sci-fi), Outliers (Mind). Knocking one off shows title + author + a line. ab-about JS + CSS **v0.29.17**. Optional Designer step: move the titles into the Designer elements (data-g / data-note / label) and drop the script map.

## Latest (2026-09-28, v0.29.14 → v0.29.16) · verified on staging 2026-09-28

Live: ab-core CSS **v0.29.16** (JS v0.29.10), ab-home **v0.29.16**.
- **v0.29.16:** the minis have their own looks: "Now booking" is a light card with the quarter's months (this month lit green, past ones struck, an upcoming quarter outlines its first month as next); "Reply time" is signal orange with a typing bubble. Tap/click the planet card (not a drag) to morph it into a new planet (8 looks: type, palette, ring, seed; tags update).
- **Field notes chart:** the beam draws each constellation as it passes going right and erases them in reverse coming back (hover speeds the scan; it no longer reveals all at once).
- **Home bento:** Custom deploys is one row again with two mini cards under it (`.is-minis` cell): "Now booking" reads the nav's CMS-bound `[data-bind="availability"]` (Q4 2026 today) → /contact#call, and "Reply time · < 1 business day" → /contact. Order: Webflow + 3D / Custom deploys · Motion · Planet / minis · Brand · Trajectory / Field notes (wide) · CMS / Systems · Performance (wide). Light cards run down the middle column.

## Latest (2026-09-28, v0.29.8 → v0.29.11) · verified on staging 2026-09-28

Live: ab-core JS + CSS **v0.29.10**, ab-home **v0.29.8**, ab-process JS + CSS **v0.29.11**, ab-hub JS + CSS **v0.29.9**.
- **Planets spin on the compositor** (core): `.tex::before` is a strip of two texture tiles sliding by transform (`--tex` set by `buildPlanet`), replacing the `background-position` animation that repainted every frame. Fixed the choppy scroll by the big About › "Always looking up" planet. Core JS + CSS must ship together (old JS + new CSS draws doubled textures).
- **Mobile:** bento cards can't outgrow their column (Custom deploys terminal ran off screen); HQ home button in the mobile menu (small, above the destinations); Crew satellite on phones is 60px and travels down between the stacked cards, and its layer sits above a tapped card (z 12 > selected z 8).
- **Plot a trajectory** card: diagonal route bottom left → top right over a full HTML starfield.
- **KNS flag** on the flight plan cards of both route scrollers (/process, /services).
- **COMMS wave:** seamless 240-unit irregular tile as a mask, 9s loop, one service color at a time with slow fades (56s cycle, orange first); fills the label's row on phones.
- **v0.29.12–13 (core CSS):** on narrow phones (<480px) the big menu links scale to `min(45px, 9vw)` so OBSERVATORY fits (checked 360 + 390px); HQ button sits higher with more room above WORK. Core CSS is v0.29.13, core JS v0.29.10.

## Latest (2026-09-28, v0.29.3 → v0.29.7) · verified on staging 2026-09-28

Live: ab-core JS **v0.29.2**, core CSS **v0.29.6**, ab-home **v0.29.7**, ab-process JS + CSS **v0.29.7**, ab-hub JS + CSS **v0.29.7**, ab-contact CSS **v0.29.4**.
- **One satellite glyph** (`.sat-ico` in core CSS: two panels on arms + a solid body; size/color per context via `--sat`) for every add-on chip, orbiting satellite, clickable satellite and the Crew satellite.
- **KNS · Knowledge system** add-on (localStorage `ab:ks`, shared by Home planner, /process form + star chart, /services map + panel): clickable satellite on the /process chart and the /services map (not a stop); when on, a small satellite orbits the main planet and both touchdown planets. Form value "KNS · Knowledge system".
- **Touchdowns match:** /process now uses the /services buttons (Request this mission · Book a call · Re-plot route), 14px gaps, green "Touchdown" label.
- **Chips:** Home planner look everywhere (square fills, color border + 14% tint); /services pick chips too; contact stations keep round dots (pick one).
- **Home:** Custom deploys is the tall bento card with a code → deploy terminal (index.html, site.css, app.js, then the deploy log; scenes padded to one height); Field notes beam spans the panel and glides back and forth; Performance shows six meters in two columns.
- **Crew satellite** glides back and forth (yoyo).

## Latest (2026-09-28, v0.29.2) · verified on staging 2026-09-28

Live: ab-core JS + CSS **v0.29.2**, ab-home **v0.29.2**, ab-process JS + CSS **v0.29.2**, ab-knowledge JS **v0.29.2** (/observatory + Observatory/Topics templates) and CSS **v0.29.2** on /observatory. Everything else as in v0.29 below.
- **Nav "you are here":** the current section keeps its orange underline + diamond; detail pages mark their parent (/work/x → Work, /services/x → Services, /observatory/x + /topics → Observatory), bar and menu ("You are here").
- **Crew roles:** the relay node is gone; a satellite orbits above the two cards, drops a signal cone on the one below (edge lights, list re-ticks), draggable and springs back. COMMS bar waveform kept.
- **Home bento:** Webflow + 3D / Motion (tall) · Planet · Trajectory / Deploys · Brand / Field notes (wide) · CMS / Systems · Performance (wide). Order set by script (`20-services.js` › bento layout).
- **Observatory:** newest first by default (the CMS list is oldest first, the script flips it) + "Newest first ↓ / Oldest first ↑" toggle + "Hyperjump to a random note" (picks from what the filters show, warps via AB.go).
- **Field notes:** 14 cross-links added across notes 03, 04, 06, 08, 09, 10, 11, 12, 14, 16, 17 (drafts are the source; CMS bodies byte-checked against the importer output).

## Latest (2026-09-28, v0.29 batch) · verified on staging 2026-09-28

Live on webflow.io: ab-core JS + CSS **v0.29.0**, ab-home **v0.29.1**, ab-process JS + CSS **v0.29.1**, ab-knowledge JS **v0.29.0** (/observatory, Observatory + Topics templates; Home/Services/Mission templates + /topics still 0.25.5) and CSS **v0.29.0** on /observatory, ab-services JS + CSS **v0.29.0**, ab-about JS + CSS **v0.29.0**, ab-hub CSS + ab-contact CSS **v0.29.0** (their JS unchanged). Mission CSS still v0.26.5 (Designer-bound head). Backups of the replaced links: `backups/2026-09-28-v0.29.0-heads-before.txt`.

- **Fixes:** Observatory filter no longer lets the list collapse while Flip runs (holds the height until the cards land; the light section used to ride up over the cards). Flight computer "+ Add a CMS item" works (run() overwrote the program's onComplete, so `busy` stuck), and the globe fly-in sets up in `onStart`.
- **/process:** "+ Complete knowledge system" add-on chip (like the Home planner): posts an "Add-ons" field, draws a satellite round the main planet. "↺ Reset route" on the destination panel. Crew roles: comms signal (dark square relay node with corner brackets, dish follows the cursor, packets TX/RX, receiving card edge lights, pulse down the link, waveform in the COMMS bar).
- **Home bento:** planet + new "Plot a trajectory" card (→ /services#trajectory) both tall like the 3D card; Field notes `is-wide` beside Custom deploys with a wide star chart + signal log (fetches /observatory for all notes once on screen; compact chart under 560px).
- **About › Player one:** quest progress bar (one segment per quest) + live feed of finds and hints.
- **Spacesuit glove cursor** site-wide: `--hand` in ab-core.css, every `cursor:pointer` → `var(--hand,pointer)`.
- **Observatory:** field notes 16 + 17 imported (WB-09 less-is-a-bore, WB-10 mercury-gemini-apollo); CKS mission id added to `docs/webflow-cms-ids.json`.
- **Open:** nothing checked at tablet/phone widths yet for the new Home layout, Crew satellite or Player one feed. (The Observatory topic-chip "dead zone" was on Angelino's end: gone on re-test, 2026-09-28.)

## Latest (2026-09-28, Services depth session) · verified on staging 2026-09-28

Live on webflow.io: ab-core JS + CSS **v0.28.12** (site-wide), ab-services JS + CSS **v0.28.9** (Services template), ab-mission JS **v0.28.6** (Missions template; mission CSS still v0.26.5). Full record: `docs/webflow-build-notes.md` › Services depth.

- **Flight computer** replaces "Under the hood" on all 8 service pages (`code/src/services/30-flight.js`, `ab-services.css`): a mission-control console with the code on the left (lines light up in sync; notes from trailing `@key` comments; Copy strips them) and a viewport that acts the code out, Run ▸, channels, tools. Programs: Motion (Reveal + Easing), Interactive 3D (CMS rows → globe pins), Design systems (tokens), Webflow dev (Client-First structure), Custom deploys (Astro build + deploy), CMS integrations (sheet row → item), Performance (lazy 3D), Branding (brand tokens on the real AB mark; its snippet lives in the script, the CMS Code field is empty). Prototype source: `prototypes/fc/`.
- **Fixes (v0.28.6):** kip Design → build headline font; footer email fit; light-section dot grid re-measures; warp arrival at an anchor holds the cover until the page lands.
- **Layout grid (v0.28.10–v0.28.12):** Shift+G overlay matches the page (gutters outside the max width, 16px column gap); card rows moved onto it (Webflow classes `ab_sv_plan`, `ab_arc_grid`, `ab_quotes` column gap → 16px via API; `div.ab_ks-grid` in core CSS); toast reads the live values. Audit of 14 page types: every card row 0px off at 1440.
- Backups of the code fields overwritten this session: `backups/` (site head, Services template head), untracked.

## Latest (2026-09-28, kip debrief session) · verified on staging 2026-09-28

- **kip mission debrief (#06) live on webflow.io** (`/work/kip`), awaiting Angelino's review. Plan: `docs/kip-cks-mission-plan.md` (kip column). Record: `docs/webflow-build-notes.md` › kip mission debrief.
- **Code:** ab-mission JS **v0.28.2** on the Mission template (ab-mission CSS still **v0.26.5**: the template head also holds the Designer-bound robots meta, so it wasn't rewritten through the API). Observatory: ab-knowledge CSS **v0.27.9** on `/observatory`, JS **0.27.8** on `/observatory` + Topics/Observatory templates.
- **Designer step for Angelino (one element):** Mission template › Briefing › `.ab_brief_side`: duplicate the hidden `div.ab_cms-source` (data-field="params"), bind it to **Benefits**, set its attribute to `data-field="benefits"`. The script then lists the four benefits under Mission parameters (reuses the parameters' classes, no CSS needed). Reload the Designer first (API writes this session).
- **Also this session:** mission order 510 → CKS → kip → Knowledge System → AB Identity; placeholders hidden; all five on the Home board (ab-home v0.28.3); 510 card = globe section; **placeholder testimonials (replace before launch)**; site email angelino@barajasdsgn.com via Site settings. Designer steps waiting: `docs/designer-steps.md` › **H** (statement planet, Benefits source, email fallback text, optional mission CSS link, placeholder quotes). Home board frames for CKS (mini loom) + kip (hopping faces) animated in ab-home **v0.28.4**.
- **kip OG image settled** (2026-09-28): the 73,576-byte `kip-src/img/og-kip.png` (headline, six characters, "A concept baby log for everyone who helps") everywhere; the older 67,806-byte variant was overwritten by the kip rebuild (kip-site has no git). kip items Angelino signed off: "that's all fine".
- **Final state (end of session, all verified on staging):** ab-home **v0.28.5** (Observatory bento card, animated CKS loom + kip hopping faces on the board), ab-mission JS **v0.28.2**, ab-knowledge CSS **v0.27.9** / JS **0.27.8**. Mission order 510 → CKS → kip → Knowledge System → AB Identity; placeholders hidden; CKS + kip copy rewritten as product pitches. Angelino accepted the kip open items as they are (site plan, Figma note, kip-site dose wording): nothing pending on kip except the Designer steps in H.

## Latest (2026-09-27/28, Designer steps session) · verified on staging 2026-09-28

- **Designer steps done + verified:** A (every CMS collection link renders its real `/<folder>/<slug>` in raw HTML: Observatory cards, Home signals, topic links, Home board, /work cards, Services rail + Pairs + hub Explore, Mission switcher), B (Observatory/Topics/Missions/Services template SEO + OG; Observatory/Topics og:image via template head `<meta>`), C1 robots meta (noindex on the 4 hidden/placeholder missions), D1 (Work cover alt from CMS), E1–E3 (forms renamed *Launch Brief* / *Contact Channel*, notification email confirmed), F1 favicon + webclip, F2 (subdomain indexing Off, auto sitemap On: sitemap only serves on a custom domain), N (mobile menu fits 320–991px, `/slug` stacked under each word, scrolls from the top on short phones), G1 (CMS field names Title Case), G2, G3 (hidden `h2.ab_sr` "Missions" on /work, badge line → text, footer Services column with all 8 services), G9, G10. G4 + G7 skipped.
- **Code (all live):** core JS **0.27.0** (shared form success: no layout jump, beacon + scan reveal on every form) · core CSS **0.27.4** (mobile-menu pill, rich-text code blocks full width) · home + contact **0.27.0** · mission **0.27.1** (Shipped probe drifts) · services JS **0.27.3** (hero title lines fit on one line) + CSS **0.27.4** (card selection frame not clipped, square rail arrow, masked rail fade). Records: `docs/webflow-build-notes.md` from "Designer steps session".
- **Content:** 5 new Observatory notes live (WB-04 Plato's cave, WB-05 Ship of Theseus, WB-06 Amor fati, WB-07 Descartes' doubt, WB-08 Cartesian star chart; drafts 11–15). Home hero lede, footer line and Home meta rewritten (general "websites", field notes on the how and the why). Service names Title Case in the CMS. Star chart stays hidden on phones (his call).
- **Traps learned:** a Designer Page-settings Save overwrites custom code written by the API (reload the Designer after API writes); Webflow parses `{{…}}` in custom code and publishes it empty; `.w-richtext figure` is capped at 60%; a Text Block of inline links can't take new links (typing extends the neighbor); "+ Add Field" inserts at the cursor (check the raw tag); the Designer can show Overflow Visible while publishing hidden (use a code override); after a publish wait ~20 s before checking.

## Latest (2026-09-27, CKS debrief) · verified on staging 2026-09-27

- **CKS mission debrief (#05) live on webflow.io** (`/work/cks`), awaiting Angelino's review. Verified: ab-mission JS **v0.27.1** (v0.27.1 = the Designer-steps session's shipped-probe drift on top of this session's v0.26.6), ab-mission CSS **v0.26.5**, ab-core **v0.27.0** (still carries the Test flight code), ab-work **v0.26.1**. Full record: `docs/webflow-build-notes.md` › CKS mission debrief (+ review round 1, manifest tiles + orbit).
- **Monitor (8 channels):** Style lab `cks-styles` · Design → build · On a phone · Site plan `cks-plan` (CKS's own FigJam weave, not the shared board) · Woven on scroll · Grow the map · Sketch tool · Publish once. Coded + interactive (`code/src/mission/22-cks.js`); Style lab + Sketch swap to the real getcks.io pages once `getcks.io/favicon.svg` answers (404 today). Launch day: only flip Missions › CKS › Status to Live. If the site lives under `/cks/`, change `MOCKS.cks.live.base`.
- **All debriefs changed:** manifest page tiles draw each page, looks per mission in `30-mission.js` `TSTYLE` (build: 510 + Aguirre · woven: CKS · blueprint: fallback); status card = orbit (in orbit circles, live transmits, shipped drifts with a flag); telemetry word units drawn small. **Figma is first in every real mission's stack.**
- **Test flight** Mission Type (proof of concept): badge on cards, filter chip on /work, hero chip, Glossary term; not counted as a discipline. CKS has it; give it to kip.
- **Debrief rules from Angelino** (memory `feedback_mission-debrief-rules`): unique site plan per debrief (510, Aguirre, Knowledge System still on the shared board), never "generated"/"one Python script" (say coded by hand after ideation + wireframes), By the numbers = what it does for a prospect.
- **Open:** Angelino's review of `/work/cks`; kip debrief (#06, plan in `docs/kip-cks-mission-plan.md`; CKS half superseded by what shipped); unique site plans for 510 / Aguirre / Knowledge System; `cms/seed/_draft-new-missions*.json` CKS entries are stale drafts (Webflow is the source of truth).

## Where things stand

| Step | Status |
|---|---|
| 1. GitHub repo | ✅ Public: github.com/AngelinoBarajas/ab-portfolio (`main`) |
| 2. Site | ✅ AB Portfolio `6ab5fe4a5ee75f9c981dc0be` (ab-portfolio-723a30.webflow.io). Home page `6ab5fe4b5ee75f9c981dc0cb`. Published to **webflow.io only** (no custom domain). |
| 3. Variables + fonts | ✅ 38 variables (37 from tokens + `Neutral / Glass`); 4 custom variable fonts (Archivo with wdth axis). IDs in `docs/webflow-ids.md` |
| 4. CMS | ✅ 14 collections (+ **Hub manifest**: launch codes + pair notes, because Services is at Webflow's 60-field cap), all references resolved. IDs in `docs/webflow-cms-ids.json`. Added this session: Tools › **Pen + paper**, Mission Channels › Aguirre **Site plan**, AB Identity **Sketches** + **Illustrator** |
| 3b. Global styles | ✅ 29 classes + tag styles (Body, H1–H6, p) |
| 5. Components | 🟡 Nav, Footer, Frame label, Bento card, FAQ item, **Next card** (no props yet) done (group "Global"). Mission card is a page-level Collection item (nested Types list rules out a component). Remaining: code block, crew dock |
| 6. Pages | 🟡 Approved 2026-09-25: Home, Work, Mission template, Services template, Knowledge System mission, About, **404** (utility page `6ab6e4a645ff2d1bd12b1c3e`). **Process** (`/process`, page `6ab701e2df00b2e38832af5b`) **approved 2026-09-26**. **Services hub** (`/services`, page `6ab74df0ae2408ea9be939c7`): built from the approved prototype, **approved 2026-09-26** |
| 7. Custom code | 🟡 Live on staging: `ab-core` JS + CSS **v0.11.0** (site-wide; monitor decor + `.ab_chip` + nav hide hysteresis) · `ab-hub` JS **v0.12.0** + CSS v0.11.0 (Services hub) · `ab-contact` JS **v0.12.0** + CSS **v0.12.1** (Contact) · `ab-mission` JS v0.10.0 + CSS **v0.11.0** · `ab-home` v0.9.0 · `ab-process` JS + CSS v0.10.0 · `ab-404` JS v0.7.0 + CSS v0.7.1 · `ab-about` JS + CSS v0.6.2 · `ab-work` + `ab-services` (+ CSS) v0.4.0 · head inline script `abwarpin` 0.3.2. Build/deploy steps in `code/README.md`; per-version notes in `docs/webflow-build-notes.md` |
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
- Deploy: bump `code/package.json` version, build, commit, `git tag -a vX.Y.Z`, push main + tag, **curl the jsDelivr copy and compare sha384 to `sri.json`**. Then `register_hosted_script` (same display name, new version) + `add_site_script` / `add_page_script`; CSS `<link>` in site/page head. Publish **webflow.io only** (`publishToWebflowSubdomain: true, customDomains: []`).
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

## This session (2026-09-26, Process review + site-wide tips) in one list

- **Process approved** after his tweaks: v0.9.1 route cards fit the viewport (path band shrinks, pin starts later on short screens) · v0.9.2 **touchdown finale** (route ends at the main destination planet, stops as moons, rocket lands, shockwave + confetti, "Mission live" + CTA), hero planet ~3× behind the countdown, launch form frame unclipped · v0.9.3 hero planet draggable again (pointer passthrough on the hero grid) · v0.9.4 countdown Figma frame on hover (hover proxy).
- **Site-wide tips approved** (v0.10.0–v0.10.2): CMS **Glossary** gained Kind (Term/Aside) + Target (selector); 15 new terms + 16 witty asides; hidden Glossary list in every page's site-data block; `core/23-tips.js` (`AB.tip`) auto-links terms (first per section, one per paragraph, body copy only) and attaches asides (✦, selection blue). Mission tip code moved to core. Details: build notes › Site-wide tips.
- Lessons: lowering a draggable's z-index under a full-width text layer kills the drag; `pointer-events:none` on a `[data-selectable]` frame kills its hover box (memory: lesson_z-index-drop-kills-drag). Headless Chrome shots of these pages come back blank; DOM measurements in the pane are the check.

## This session (2026-09-26, Services hub prototype) in one list

- **Services hub prototype approved**: `prototypes/services-hub.html` ("Launch control", spaceport theme). **The spec + Webflow build map are at the top of `docs/services-hub-plan.md`** (history of review rounds 2–5 below it). Sections: hero with draggable planet + Run diagnostics chips → mission-control monitor manifest (Explore buttons, launch keys, telemetry) → launch-pass glass slate printed from the monitor → Plot a trajectory (3-step planner + map) → in-page **flight plan** that warps in (Process route, touchdown, Abort mission warps it out) → crew logbook with digital badges → final call.
- `_parts/assemble.py` now builds **both** Process and the hub (`python prototypes/_parts/assemble.py [hub|process]`) and points every prototype Services link (nav, mobile menu, footer heading) at `services-hub.html`. Test-only URL hooks on the hub: `?shim`, `?at=flight-plan`, `?fly=0,5,2&p=0.45`.
- **Site-wide bug found**: the nav hide-on-scroll flickered because Lenis eases out in tiny steps. Fixed with hysteresis in `code/src/core/30-motion.js` + the prototype shell (`prototypes/about.html`). Built locally only; **not tagged or deployed** (live core stays v0.10.2).
- Nothing was pushed to Webflow and nothing was published this session. The session's files are **not committed** yet (prototype, `_parts/hub.*`, plan doc, docs, core source + dist).
- Lessons (memory): [[lesson-lenis-scroll-anchoring-jump]], [[lesson-backdrop-filter-under-3d-animation]], [[lesson-nav-hide-scroll-hysteresis-lenis]], [[lesson-headless-chrome-min-width]], [[lesson-overflow-clip-on-maxwidth-section]].

## This session (2026-09-26, Services hub Webflow build) in one list

- Committed the prototype session (`c66b953`), then built **`/services`** in Webflow from the approved prototype (static page, duplicate of Process; Process sections removed). Full record: `docs/webflow-build-notes.md` › Services hub.
- **Real Webflow elements** for all copy; Services Collection Lists drive the diagnostics chips and manifest rows; hidden lists (Services with nested Tools / Pairs with / Related missions, Hub manifest, Missions) feed the script. Bindings in bulk with `webflow/build/hub/bind.py`.
- **CMS**: Services is at the 60-field cap → new **Hub manifest** collection (Service ref, Launch code, Pair notes), 8 items. Knowledge System added to Webflow development + Design systems › Related missions (matches the prototype).
- **Code v0.11.0**: new `ab-hub` bundle + CSS; core gained the monitor decor + `.ab_chip` styles (out of `ab-mission.css`) and the nav hide hysteresis. jsDelivr SRI verified; registered `abcore` 0.11.0 + `abhub` 0.11.0; site/page/Mission-template CSS links updated.
- **Links**: Nav, mobile menu, footer Navigate › Services → `/services`; footer Services column heading is now a link.
- **4 Glossary asides** (Priority go, Launch manifest, Abort mission, Custom charter): approved as written.
- **Angelino approved the Services hub 2026-09-26** ("looks good").
- Published to **webflow.io only**. Verified local-dist + staging at 1440 / 1024 / 390: no console errors, no horizontal scroll, all interactions; Mission + Process regression clean.
- MCP finding worth keeping: a Collection List nested inside a Collection item with source `{collectionId}` renders the item's own multi-ref (works via MCP).

## This session (2026-09-26, Contact prototype) in one list

- Direction + divergence gate decided with Angelino: `docs/contact-plan.md` (general door, "Open a channel" concept, reason stations + Name/Email/Message, links split by intent).
- Prototype `prototypes/contact.html` (`_parts/contact.*`, `assemble.py contact`; assemble now points shell Contact links at contact.html and Book a call at contact.html#call). Verified 1440/1024/375: no horizontal scroll, tuner/drag/validation/transmit/`#call` work. **Awaiting his approval**; nothing pushed to Webflow.

## This session (2026-09-26, Contact page Webflow build) in one list

- **Prototype approved** (headline "Come *in*" in the shared hero style; dish on a faded cliff; button spacing). Built `/contact` in Webflow (duplicate of About): hero console with a native Webflow Form (Embed fields), hidden stations list, light "other channels" section. Record: `docs/webflow-build-notes.md` › Contact page.
- **Code v0.12.0**: new `ab-contact` JS + CSS (SRI verified, registered `abcontact`); `ab-hub` 0.12.0 (flight-dock Book a call → `/contact#call`). Core unchanged (v0.11.0).
- **Links**: Nav/mobile/Footer Contact → `/contact`; Nav + hub Book a call → `/contact#call`; Plan-a-mission CTAs stay on `/#launch`.
- **3 Glossary asides drafted** (Signal strength, Same desk, Voice channel), live on staging for his review.
- Published **webflow.io only**; verified 1440 / 1024 / 390, no console errors, no horizontal scroll; hub + Home regression clean. v0.12.1 fixed the clipped beam. **Approved 2026-09-26** (page + asides).
- For step 8 QA: inner pages show no nav active marker (core only styles `.is-active`; Webflow's `w--current` is unstyled).

## This session (2026-09-26, step 8 QA) in one list

- **Contact page + 3 asides approved.**
- **QA audit** (`docs/qa-report.md`): 22 URLs × 1440/1024/390 clean (console, horizontal scroll, init); reduced motion clean; warp OK; no visual regressions; copy clean.
- **v0.13.0 live on staging**: a11y fixes (Lighthouse a11y now 91–100), `webgl-data` renamed "Interactive 3D + data", perf fixes (Home init split, no per-frame layout reads, planet float pauses off screen, starfield 1x on touch, preconnect + Archivo preload). Perf scores ~unchanged (LCP ≈ 5 s held by the sync script chain + font swap): 3 remaining levers offered.
- **SEO**: Home title/description, OG mirroring, hub description trimmed (staging). JSON-LD drafted for launch (`{{DOMAIN}}`) + Designer steps in `docs/seo-plan.md`.
- MCP finding: registered scripts accept only `data-*` attributes (no `defer`).

- Deferred loading (freeform footer code) was tried (perf 47–74) and **reverted** at Angelino's ask: scripts are back in Webflow's registry as before; v0.13.0 fixes kept.

- **Button audit** (all 22 URLs): fixed the Services template breadcrumb (→ `/services`) and `#top` on the 404 (core **v0.13.1**, registry as before). Details in `docs/qa-report.md`.

- **Aguirre hidden** (switch on) and **client removal made one-step**: Hide from site now covers every surface (runbook `docs/remove-a-client.md`; Webflow blocks Unpublish on referenced items). v0.14.0. Work breadcrumb /home → /#work kept (his call).

## This session (2026-09-26, mobile review batches 1-5) in one list

- Batches logged in `docs/webflow-build-notes.md` › Mobile review batch 1-5 (v0.15.0 → v0.19.1). All published to webflow.io only, each awaiting Angelino's OK.
- Home: drag cue clamps on screen; planner no longer jumps (address-bar resize re-measured the process pin); bento CTAs → /work, /process (Start a project stays /#launch).
- Services hub: diagnostics grid, pass prints under the monitor (console hidden on phones), planner no auto-scroll, flight header + touchdown fit, two-sided logbook page turns (all sizes), final call layout, Re-plot route at touchdown.
- Process: countdown as a compact clock, smaller chart planets, centered touchdown + Re-plot route, sticky compact timeline gauge on phones.
- About: badge hint, shooting-star signature, flight log icons, the Endurance on the Interstellar card, philosophy tap-anywhere, LV 20 boss fight + credits.
- Contact / debriefs / service pages: see batch 5.
- Testing note: the local-dist test server can't be added this session (auto mode blocked editing the shared launch.json); staging was the test bed.

- Follow-ups v0.20.0 – v0.22.0: Interstellar score player (Cornfield Chase via Spotify embed), cinematic boss fight with synthesized sound, service rail/tile fixes, bookshelf tilt, mobile menu "You are here". Live: core JS 0.19.0 + core CSS 0.22.0, about 0.22.0 (CSS 0.21.6), services 0.21.2.

## This session (2026-09-26, mobile review wrap-up + side quests) in one list

- Mobile review batches 1-5 + follow-ups shipped (v0.15.0 → v0.23.4), all on webflow.io only; every item is logged in `docs/webflow-build-notes.md` (Mobile review batch 1-5, then the version notes after them). Angelino's last word: record it and move on to SEO.
- **Side quests** (v0.23.0+): 16 easter eggs logged per browser (`core/24-quests.js`, `AB.quest('id')`), quest log on About › Player one (`about/20-quests.js`), gold crew badge at 16/16, aside twinkles (`core/23-tips.js`). New egg: Endurance escape (5 fast taps on the black hole while close). Cheat code works by swipe on phones (Player one game screen; the screen echoes the input).
- **About extras**: Interstellar score (Spotify embed of "Cornfield Chase", desktop only, pauses on hover-off / scroll-away), cinematic boss fight with synthesized sound (toggle, off by default), bookshelf tilts.
- **Site-wide**: mobile menu marks the current page ("You are here"); cross-page anchors (`/#launch`, `/process#launch`) re-aim after layout settles; crew dock hides under the open menu; Next-card rocket path handles tight cards.
- Lessons (memory): script-made class names collided with Designer classes (`is-planet`, `ab_td_play`): prefix script classes (`abx-`, `sv-`, `hb-`); address-bar resize + innerHeight pins jump content; Webflow 429s after several publishes in a row (wait a minute).
- Open for Angelino's review: the boss credits copy (`about/10-boss.js`) and the quest titles/hints (`core/24-quests.js`).

## This session (2026-09-26, SEO + schema pass, touch fix, playable boss) in one list

- **SEO pass** (full record: `docs/seo-plan.md`): audit of every page + both templates; approved titles/descriptions live on staging (Work, Services, Process, About); OG images on every static page and the Services template.
- **OG cards** made by `og/build.py` with the site's own planet code (Home giant / Work archive / Services hub planets) + an AB Identity social image drawn by `AB.markSVG`. Assets: og-site `6ab8149fe5d9f17124004a93`, og-work `6ab814a0d770c2fa20d32575`, og-services `6ab814a1ceb091fbb0a8b148`, og-ab-identity `6ab814a242efee0d9ed421e6`.
- **Missions CMS** gained **Meta description**, **Robots** (`noindex` on Aguirre + the 3 placeholders) and **Social image** (JPEG 1200×630 per real mission). Cover alts (510, Aguirre) + 6 globe-pin alts filled.
- **JSON-LD** for every page type in `seo/jsonld/` (`python seo/make_jsonld.py [https://domain]`); pushed at launch. Designer steps in `docs/seo-plan.md` §6 (template SEO bindings + head code, crawlable mission links, form names, sitemap on).
- **v0.23.5**: Interstellar thrusters work on touch (hover handlers ignore touch pointers).
- **v0.24.0 / v0.24.1**: the boss fight is playable (arrows/WASD + Space; drag + hold on phones; aimed shots, dodgeable beam, enrage + spread, 3 shields, retry) with an anime finisher (pilot cut-in, 必殺技 · FINAL DEPLOY, mega beam, impact frames). Build notes › v0.24.0.
- **10 Insights drafts** for review: `content/insights/drafts/` (README has the table). Not in Webflow.

## Designer steps: mostly done (2026-09-27/28), see "Next session" at the top

The checklist is `docs/designer-steps.md`; sections A, B, E, F, N and G1/G2/G3/G9/G10 are done and verified; C (JSON-LD) moved to launch; the rest is listed at the top of this file.

Knowledge System status: **live on staging at ab-knowledge v0.25.5** (all 7 pages), reviewed + approved by Angelino 2026-09-27 (hover scan, pan/zoom star chart, chip legend, card title wrap).

## Previous: integrate the Knowledge System into this site

**2026-09-27: BUILT + published to webflow.io (awaiting Angelino's review).** Named **the Observatory** (`/observatory`, `/observatory/[slug]`, `/topics`, `/topics/[slug]`), Home section **Incoming signals**, no AI disclosure, no Aguirre relations. ab-knowledge **v0.25.3** (now v0.25.5). Full record + Designer steps: `docs/webflow-build-notes.md` › Knowledge System. Earlier: Plan + decisions: `docs/knowledge-integration-plan.md`. Prototypes: `prototypes/insights.html`, `insight.html#<slug>`, `topics.html`, `topic.html#<slug>`, `ks-rows.html` (parts `_parts/ks*`, data from `_parts/ks_data.py`). Draft vocabulary: `cms/seed/_draft-topics.json`. Nothing in Webflow yet.

Angelino wants the complete Knowledge System integrated into the AB Portfolio and styled on brand. Start by reading:

1. `docs/knowledge-system-plan.md` (the model: Topics vocabulary in 6 categories, Insights library, Related Topics on existing collections, FAQs, video-first entries, JSON-LD from the same fields, Voice Kit + approval gate).
2. `X:/Claude-Skills/cks-site/` (the hand-coded Knowledge System product site: index, how-it-works, voice-kit, pricing, styles) for the pieces to carry over, and `docs/kip-cks-mission-plan.md` (another session's draft for the kip + CKS missions, still waiting on Angelino's OK; don't clash with it).
3. `content/insights/drafts/` (10 articles waiting for his review; import only the ones marked `approved`).

Constraints to plan around: Services is at the 60-field cap (Related Topics on Services may need the Hub-manifest trick: a side collection); Webflow Components can't hold Collection Lists; every CMS-driven link must be a real `href` (Current page / reference), not script-only; noindex/sitemap flags need the paid plan; follow the page-pipeline stages (prototype first, his OK, then Webflow), design in the site's language (void/deep panels, Figma-canvas frame labels, one orange accent, planets).

Still open before launch: Designer steps in `docs/seo-plan.md` §6, placeholders (email, socials, testimonials, `[X–Y weeks]`, headshot, favicon), the domain, then the launch swaps in `docs/seo-plan.md` §4–5 and the publish.

Live on staging: core JS **0.23.3** + core CSS **0.23.3**; home 0.23.0, hub JS 0.23.0 (CSS 0.17.1), process JS 0.23.0 (CSS 0.17.1), about JS **0.24.1** (CSS 0.24.0), contact 0.19.0, mission JS 0.23.0 (CSS 0.19.0), services JS 0.21.2 (CSS 0.21.2), work 0.4.0, 404 0.14.0. All via the registry (+ CSS `<link>` with SRI in site/page heads).

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
