# Step 8 QA report (2026-09-26, staging ab-portfolio-723a30.webflow.io)

Scope: every page (22 URLs: 7 static incl. 404, 8 service items, 7 mission items) at 1440 / 1024 / 390, console, horizontal scroll, bundle init, reduced motion, Lighthouse (mobile), links + warp transitions, visual regression vs the approved pages, copy sweep.

## Passed

| Check | Result |
|---|---|
| Console errors | 0 on all 22 URLs at all 3 widths (the 404 page's own 404 status is expected) |
| Horizontal scroll | none on any URL at 1440 / 1024 / 390 (real `scrollTo` test) |
| Bundles | core + the right page bundle initialize on every URL; one `<h1>` per page |
| Reduced motion | all 9 templates: `AB.reduce` on, no content left invisible (Mission's hidden items are inactive monitor channels / unselected manifest tiles, same as with motion) |
| Warp transitions | page → page warp navigates and the arrival flash clears; `/contact#call` preselects Book a call |
| Visual regression | heroes of Home, Work, About, Process, Services hub, Mission, Service, Contact, 404 match their approved state |
| Copy | no UK spellings, no stale "Globes, maps", no Webflow default text; no duplicate script loads; all images have alt |
| Status codes | every page 200; all 7 mission items + 8 service items resolve |

## Findings

### A. Accessibility (code fixes, Lighthouse a11y 83–96)
1. **Hero toy words** (site-wide `core/39-herodrag` + Home hero): `aria-hidden="true"` **and** `tabindex="0"` → keyboard focus lands on hidden text (6 pages). Fix: words `tabindex="-1"` (still draggable by pointer); the hero planet stays keyboard-nudgeable.
2. **Footer wordmark** `div#wordmark` has `aria-label` without a role (every page). Fix: `role="img"`. Same pattern on Home statement `p.ab_ms_big` and hub `[data-hub-call]` row.
3. **Work archive cards** `role="listitem"` without a `role="list"` parent (the filter script's container). Fix in `ab-work`.
4. **About level switch** `<a aria-pressed>` (links can't be pressed). Fix: `role="button"` on the 2 switch buttons (MCP attribute).
5. **Hub Explore links** too small/close for touch at 390. Fix: min 24px target in `ab-hub.css`.
6. Heading order (Home promise cards, Work card titles are `h3` before any `h2`): minor, Designer tag change if wanted.
7. Contrast flags are mostly reveal states (words dimmed until scrolled to), decorative Figma frame labels and About's upcoming-waypoint cards: by design, no change proposed.
8. **Nav active marker** missing on inner pages (core styles only `.is-active`; Webflow's `w--current` unstyled). Fix: style `.ab_nav_link.w--current` like `.is-active` in `ab-core.css`.

### B. Crawlability / SEO (pre-launch)
1. **Mission links exist only after JS**: Home board frames render `href="detail_work"` (a 404) and Work cards `href="/work"`; scripts set the real `/work/<slug>`. Crawlers find no mission pages except Daniel Aguirre Law. Fix (Designer): select the Home board frame link and the Work card link → Link settings → *Current Missions page* (MCP-set collection links render the literal slug).
2. **Sitemap off**: `/sitemap.xml` returns the 404 page. Site settings › SEO › Auto-generate sitemap (not reachable by the MCP).
3. **Titles / meta**: Home has no meta description and the title "AB Portfolio"; the Mission and Services **templates** have no SEO title/description (tabs show the right title only after JS); several static pages have no OG. Proposed: an SEO pass with `seo-schema-builder` (template titles bound to CMS fields, descriptions, OG image, JSON-LD).
4. Staging is `noindex` (webflow.io default), which is why Lighthouse SEO reads 54–66; not a launch blocker.

### C. Performance (Lighthouse mobile: Home 39, Mission 50, Services item 52, Process 53, About 55, Hub 60, Work 63, Contact 72)
LCP 4.4–5.7 s, TBT 90–1,450 ms (Home worst: 9.1 s main-thread work, 1.9 s JS boot), CLS ≤ 0.054, weight ~450 KB. Best-practices 100 everywhere. The cost is the always-on scenes (starfield, procedural planets, orbit, bento visuals) initializing at load on a throttled phone. Options, from cheap to bigger: defer non-hero scene builds to idle / first scroll, cap canvas DPR on phones, skip the starfield and footer planets on low-power devices, preload the display font, lazy-init Home's bento visuals. **Needs Angelino's call** (every option trades some first-load motion for speed).

### D. Copy / content
1. Services › `webgl-data` CMS **Name** is still "WebGL + data" (hero shows "Interactive 3D + data"); it feeds the browser tab title and form values. Fix: rename the item to "Interactive 3D + data".
2. Known placeholders (his inputs): email `hello@[your-domain]`, socials, testimonials (`[Name]` + quote on Home), Home FAQ `[X–Y weeks]`, headshot, favicon + webclip upload, metrics numbers.
3. Designer: rename the Process and Contact forms ("Email Form"); confirm the Forms notification email.

## Decisions (Angelino, 2026-09-26)

- Fix batch **A1–A5, A8 + D1: apply all.**
- Performance: **defer + cap** (keep every effect; non-hero scenes at first scroll/idle, cap canvas resolution on phones, preload the display font; target 70+ mobile).
- Then the **SEO pass** (seo-schema-builder); Angelino does the 2 Designer collection-link settings + the sitemap toggle.

## Results after v0.13.0 (staging, Lighthouse mobile, 2026-09-26)

| Page | Perf (was) | A11y (was) | Best practices | LCP | TBT |
|---|---|---|---|---|---|
| Home | 45 (39) | 96 (93) | 100 | 5.3 s | 1,180 ms |
| About | 53 (55) | 91 (84) | 100 | 5.1 s | 700 ms |
| Contact | 70 (72) | 100 (96) | 100 | 4.7 s | 50 ms |
| Process | 56 (53) | 97 (90) | 100 | 5.3 s | 470 ms |
| Services hub | 57 (60) | 97 (86) | 100 | 5.7 s | 400 ms |
| Service item | 56 (52) | 96 (84) | 100 | 5.1 s | 570 ms |
| Work | 70 (63) | 95 (88) | 100 | 5.0 s | 90 ms |
| Mission | 44 (50) | 96 (83) | 100 | 6.2 s | 780 ms |

- Every a11y fix verified on the published pages; no console errors, no horizontal scroll, all bundles init.
- Performance moved within Lighthouse's run-to-run noise (±6): the per-frame + DPR + split fixes help real devices (smoother, less battery) more than the lab score. The lab score is held by **LCP ≈ 5 s**, which is first paint waiting on Webflow's jQuery + webflow.js + the synchronous GSAP/Lenis/core chain, then the display-font swap.
- Remaining levers (need Angelino's call): (1) load the bundles from freeform footer code with `defer` instead of Webflow's script registry (registry rejects `defer`; local A/B −0.7 s FCP); (2) size the hero titles in CSS so the font swap / Home fit doesn't create a late LCP; (3) Mission: start the monitor scenes after first paint (heaviest template, 44).
- SEO scores stay 54–66 on staging only because webflow.io is `noindex`.

## After deferred loading (Angelino chose "Defer via footer code", 2026-09-26)

All bundles now load from freeform footer code with `defer` (details: build notes › Deferred script loading). Staging re-check: 22 URLs at 1440 + 7 at 390, every bundle + Lenis initialize, ScrollTrigger counts unchanged, no horizontal scroll, no new console errors.

| Page | Perf: QA start → v0.13 → deferred | LCP | TBT |
|---|---|---|---|
| Home | 39 → 45 → **47** | 5.4 s | 960 ms |
| About | 55 → 53 → **53** | 5.1 s | 680 ms |
| Contact | 72 → 70 → **73** | 4.7 s | 90 ms |
| Process | 53 → 56 → **62** | 5.0 s | 390 ms |
| Services hub | 60 → 57 → **62** | 5.6 s | 300 ms |
| Service item | 52 → 56 → **57** | 5.1 s | 590 ms |
| Work | 63 → 70 → **74** | 4.8 s | 110 ms |
| Mission | 50 → 44 → **49** | 6.1 s | 610 ms |

First paint is still ~4 s in the lab: what's left in front of it is Webflow's own synchronous jQuery + webflow.js and the render-blocking CSS (Webflow's + `ab-core.css`, 67 KB), which the site can't defer. Remaining levers: CSS-sized hero titles (late LCP from the font swap / Home fit) and starting Mission's monitor scenes after first paint. Lab numbers use a throttled mid-range phone; real devices on Wi-Fi/5G are much faster.

**Reverted (2026-09-26):** Angelino chose to keep Webflow's script registry ("everything through jsDelivr like before"); the deferred numbers above no longer apply, the v0.13.0 column does.

## Button audit (2026-09-26, staging, after scripts ran)

Every visible link / button / submit on all 22 URLs, read after the page scripts set their hrefs.

- **Nav + footer**: identical on every page. Contact → `/contact`, Book a call → `/contact#call`, Work/Services/Process/About → their pages, footer services → `/services/<slug>`, footer Services heading → `/services`.
- **All internal targets load (200) and every `#section` target exists** on its page (22 targets checked).
- **External**: 510visuals.com and danielaguirre.law both 200. Note: danielaguirre.law currently serves the firm's holding page until the attorney signs off, so the Aguirre mission's "Live" link lands there.
- **Intent**: every Plan a mission / Start a project / Plot the course / planner CTA → the Home planner (`/#launch`) or the Process form; Book a call → `/contact#call`; service/mission cards → the right item pages. Home "See the work ↓" and Process "Plot the course ↓" are in-page jumps by design.
- **`#` links with a script handler** (by design): email copy, social links (toast until Site Settings has URLs), placeholder mission cards (toast), Mission Cadet/Engineer switch (verified: toggles, no jump).

**Fixed:**
1. Services template breadcrumb "services" went to `/#capabilities` (Home) → now the Services hub `/services` (Designer link + `webflow/build/services/make.py`).
2. 404 page: the footer "back to top" logo pointed at a `#top` that page doesn't have → core v0.13.1 treats `#top` as scroll-to-top everywhere.

**Left as is (flag to Angelino):** the Work page breadcrumb "/home" goes to `/#work` (Home's work board) while every other "/home" goes to `/`.

## Re-check at v0.33.27 (live webflow.io, Lighthouse 13 mobile, 2026-09-30)

Median of 3 runs per page (Home: 2 runs, the first failed to launch). Perf column: median (v0.13.0).

| Page | Perf | A11y | Best practices | SEO* | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | 48 (45) | 97 | 100 | 63 | 5.2 s | 876 ms | 0 |
| About | 50 (53) | 95 | 100 | 66 | 5.8 s | 607 ms | 0 |
| Contact | 72 (70) | 100 | 100 | 63 | 4.4 s | 116 ms | 0 |
| Process | 59 (56) | 97 | 100 | 63 | 5.3 s | 374 ms | 0.001 |
| Services hub | 69 (57) | 97 | 100 | 63 | 4.9 s | 96 ms | 0.001 |
| Service item (`webgl-data`) | 63 (56) | 91 | 100 | 66 | 4.8 s | 378 ms | 0.004 |
| Work | 67 (70) | 97 | 100 | 66 | 5.4 s | 85 ms | 0 |
| Mission (`cks`) | 57 (44) | 95 | 100 | 63 | 8.8 s | 0 ms | 0 |
| Observatory (new) | 53 | 100 | 100 | 63 | 4.5 s | 173 ms | **0.400** |
| Observatory article (new) | 70 | 96 | 100 | 63 | 4.9 s | 103 ms | 0 |
| Topics (new) | 69 | 100 | 100 | 63 | 4.6 s | 78 ms | 0.130 (1 of 3 runs) |

\* SEO still reads low because webflow.io is `noindex`.

- **Observatory CLS 0.40** (2 of 3 runs): `section#library` (the observation log, 8,816 px tall on a phone) shifts after load. This is the one real regression; it alone costs ~15 perf points.
- **Topics CLS 0.13** (1 of 3 runs): the `section#vocabulary` light-bg canvas resizes after first paint.
- **Mission LCP 8.8 s with 0 ms TBT** in 2 of 3 runs: first paint itself lands at 8.5 s while the network finishes by ~1.3 s and the main thread is idle. Consistent with content held hidden by a timed intro/reveal rather than load cost; needs a look.

### Follow-up diagnosis (2026-09-30)

- **Observatory CLS: fixed, shipped v0.33.28** (live re-check: CLS 0.001, perf 70/70/71). Cause: the hero's ask box and stats row are empty Webflow divs that the library script fills; `:empty{display:none}` collapsed them, so ~430 px (phone) appeared after first paint and pushed `#library` down. Fix: while `:empty`, `visibility:hidden` + a `min-height` equal to the filled height at each wrap step (swept 300–1000 px: ask 312/295/252/209/167, stats 268/135/68). Verified by serving the local build over the live page (4× CPU, 3 runs each): 360 0.398 → 0.001, 390 0.389 → 0.001, 412 0.397 → 0.001, 768 0.352 → 0, 1440 0.075 → 0.002. Both boxes exist only on `/observatory`.
- **Mission LCP 8.8 s: not a real delay.** Lighthouse's *observed* FCP/LCP was 1.7–2.3 s (same as About); 8.5 s is its simulated estimate. Nothing on the page is held hidden. The simulation is driven by the same ~19 synchronous head scripts/styles on every page; the only lever is the deferred-footer loading that was reverted on 2026-09-26.

## Layout jumps site-wide + Home/About (v0.33.29 / v0.33.30, 2026-09-30)

Desktop + CMS pages had jumps the phone-only Lighthouse pass missed. Causes and fixes:

| Page · width | Cause | Fix | CLS live before → after |
|---|---|---|---|
| About · 1440 | summary re-wrapped 3 → 2 lines when Geist swapped in; the centered hero + badge moved | Geist preload + metric-matched fallback | 0.24 → 0.007 |
| Services hub · 1024/1440 | diagnostics chips (JetBrains Mono) wrapped to a 3rd row in the sans-serif fallback | mono fallback = Courier New (same advance) | 0.14 / 0.12 → 0.004 / 0.005 |
| Home · 1024 | font swaps | both fallbacks | 0.33 → 0.047 |
| /topics · all | title words block → inline-block when the hero toys start; star chart built 0 → 613px | start inline-block; chart mount holds its height | 0.38 (1024) / 0.27 (1440) / 0.13 (phone) → ≤ 0.002 |
| Topic pages · phones | mini chart + stats grid + 2-line eyebrow injected into the hero (+450px) | reserved | 0.20 → 0.001 |
| Topic pages w/o missions · 1024 | script hides "Shown in practice" after paint | **Designer P1** (visibility *Missions is set*) | 0.07 → 0.11 (now visible because the hero no longer jumps first) |

Lighthouse mobile after (median of 3, live): Home **54** (48), About **66** (50), Services hub **70** (69), /topics **74** (69), topic page **72**, Observatory **69**; CLS 0.000–0.001 on all. Home TBT 876 → 604 ms. Starfield: the wormhole lens was re-measured every frame; v0.33.30 measures it only near the screen (live had ~190 reads/s after scrolling past it, now 0). Home's remaining ~350 ms forced reflow is charged to whichever code measures first after the load-time animations write; reducing it means fewer layout-affecting animations during load.

## Live on barajasdsgn.com (Lighthouse 13.5, 2026-10-04, after v0.33.43)

Mobile = median of 3 runs (all 3 in brackets), desktop = 1 run. SEO is 100 on every page now that the domain is indexable (staging read 63–66 because webflow.io is noindex).

| Page | Perf (mobile, median of 3) | A11y | Best practices | SEO | LCP | TBT | CLS | Perf (desktop) |
|---|---|---|---|---|---|---|---|---|
| / | 47 (46/47/49) | 97 | 100 | 100 | 4.8 s | 1264 ms | 0.000 | 97 |
| /about | 48 (47/48/49) | 95 | 100 | 100 | 5.2 s | 901 ms | 0.000 | 79 |
| /contact | 73 (71/73/74) | 100 | 100 | 100 | 4.3 s | 187 ms | 0.000 | 98 |
| /process | 55 (48/55/60) | 97 | 100 | 100 | 4.2 s | 847 ms | 0.000 | 94 |
| /services | 73 (63/73/73) | 97 | 100 | 100 | 4.2 s | 191 ms | 0.000 | 97 |
| /services/webgl-data | 51 (47/51/52) | 91 | 100 | 100 | 4.5 s | 1111 ms | 0.000 | 95 |
| /work | 70 (68/70/71) | 97 | 100 | 100 | 5.1 s | 109 ms | 0.000 | 97 |
| /work/cks | 59 (36/59/59) | 95 | 100 | 100 | 7.9 s | 0 ms | 0.000 | 82 |
| /observatory | 66 (64/66/68) | 100 | 100 | 100 | 4.2 s | 413 ms | 0.000 | 97 |
| /observatory/simpsons-bart-sells-his-soul-web-design | 71 (56/71/77) | 96 | 100 | 100 | 4.9 s | 125 ms | 0.000 | 97 |
| /topics | 77 (68/77/78) | 100 | 100 | 100 | 4.3 s | 74 ms | 0.001 | 98 |
| /topics/webflow-cms | 76 (70/76/79) | 100 | 100 | 100 | 4.2 s | 189 ms | 0.001 | 97 |

/ a11y: color-contrast,label-content-name-mismatch
/about a11y: color-contrast,heading-order,label-content-name-mismatch
/process a11y: color-contrast,label-content-name-mismatch
/services a11y: color-contrast,label-content-name-mismatch
/services/webgl-data a11y: aria-required-children,color-contrast
/work a11y: color-contrast
/work/cks a11y: color-contrast,heading-order
/observatory/simpsons-bart-sells-his-soul-web-design a11y: color-contrast

Notes: vs 09-30 (staging), Home 54 → 47 and About 66 → 48 on mobile, both from TBT (Home 604 → 1264 ms, About ~600 → 901 ms). Candidates: ABIdleDeadline (2s deadline makes every requestIdleCallback run inside the measured window, incl. Turnstile on Home) and About now loading ab-knowledge JS + CSS for Featured reads. Mission LCP 7.9 s is Lighthouse's simulated estimate (observed ~2 s, see Follow-up diagnosis). A11y failures are pre-existing (contrast on dim mono labels, label/name mismatch on icon links, heading order on About + mission, aria-required-children on the webgl-data service).

## Mobile performance pass v0.33.44 (local A/B, 2026-10-04)

Live barajasdsgn.com HTML served from localhost; only the AB bundles differ (base = v0.33.43 sources, new = v0.33.44; the mission bundle kept at base for both). Lighthouse 13.5 mobile. Local scores read lower than live (uncompressed local files), so compare the two columns, not against the live table above. Live re-check after publishing: pending Angelino's OK.

| Page | Perf base → v0.33.44 | TBT base → v0.33.44 | Runs |
|---|---|---|---|
| / | 43 → **62** | 801 → 115 ms | 5 + 5 |
| /about | 38 → **60** | 1043 → 72 ms | 5 + 5 |
| /process | 42 → **66** | 1191 → 74 ms | 2 + 2 |
| /services | 59 → 64 | 298 → 140 ms | 2 + 2 |
| /services/webgl-data | 59 → 62 | 198 → 104 ms | 2 + 2 |
| /work | 63 → 69 | 292 → 62 ms | 2 + 2 |
| /work/cks | 56 → 56 | 0 → 0 ms | 2 + 2 |
| /observatory | 55 → 59 | 378 → 244 ms | 2 + 2 |
| /observatory/simpsons-… | 65 → 65 | 88 → 54 ms | 2 + 2 |
| /topics | 64 → 65 | 100 → 85 ms | 2 + 2 |
| /topics/webflow-cms | 63 → 65 | 168 → 44 ms | 2 + 2 |
| /contact | 67 → 68 | 155 → 92 ms | 2 + 2 |

CLS identical to base on every page. What changed and why: build notes › Mobile performance pass.

## Live after v0.33.44 (barajasdsgn.com, Lighthouse 13.5, 2026-10-04, published 12:16 UTC)

Mobile median of 3 (all 3 in brackets), desktop 1 run. Before = the 2026-10-04 table above.

| Page | Mobile before → after | TBT before → after | CLS | Desktop before → after |
|---|---|---|---|---|
| / | 47 → **76** (75/76/77) | 1264 → 82 ms | 0.027 | 97 → 99 |
| /about | 48 → **72** (63/72/72) | 901 → 66 ms | 0.003 | 79 → 96 |
| /contact | 73 → 81 | 187 → 34 ms | 0.034 | 98 → 98 |
| /process | 55 → 79 | 847 → 136 ms | 0.001 | 94 → 98 |
| /services | 73 → 75 | 191 → 213 ms | 0.021 | 97 → 98 |
| /services/webgl-data | 51 → 75 | 1111 → 240 ms | 0.003 | 95 → 98 |
| /work | 70 → 81 | 109 → 62 ms | 0.001 | 97 → 98 |
| /work/cks (now 301 → /work/topicweave) | 59 → 58 | 0 → 246 ms | **0.245** (1 of 3) | 82 → 97 |
| /observatory | 66 → 77 | 413 → 176 ms | 0.001 | 97 → 98 |
| /observatory/simpsons-… | 71 → 76 | 125 → 57 ms | 0.037 | 97 → 98 |
| /topics | 77 → 80 | 74 → 86 ms | 0.001 | 98 → 98 |
| /topics/webflow-cms | 76 → 81 | 189 → 49 ms | 0.001 | 97 → 98 |

**Incident:** the site publish also shipped the Topicweave chat's CMS changes that were staged in Webflow at 12:14 (mission renamed, slug cks → topicweave, old URL 301s). The live mission page runs the old ab-mission bundle against the renamed item; its hero title/summary shift (0.245 in 1 of 3 runs). Handed to the Topicweave chat + Angelino. Small CLS on Home (0.027, hero bottom) and Contact (0.034, form row) are the init-after-first-paint race noted in the build notes.

## Live re-check (barajasdsgn.com, Lighthouse 13.5, 2026-10-04 afternoon, after v0.33.51 + knowledge alignment)

Mobile median of 3 (all 3 in brackets), desktop 1 run. Columns: morning before perf pass → right after v0.33.44 → now.

| Page | Mobile | TBT now | CLS now | Desktop now |
|---|---|---|---|---|
| / | 47 → 76 → **72** (67/72/75) | 121 ms | 0.000 | 97 |
| /about | 48 → 72 → **68** (64/68/72) | 101 ms | 0.000 | 96 |
| /contact | 73 → 81 → **75** (68/75/78) | 56 ms | 0.000 | 98 |
| /process | 55 → 79 → **76** (72/76/80) | 66 ms | 0.000 | 98 |
| /services | 73 → 75 → **77** (63/77/77) | 74 ms | 0.000 | 98 |
| /services/webgl-data | 51 → 75 → **74** (71/74/75) | 137 ms | 0.000 | 98 |
| /work | 70 → 81 → **73** (71/73/80) | 45 ms | 0.001 | 97 |
| /work/topicweave (was /work/cks) | 59 → 58 → **61** (45/61/61) | 0 ms | 0.000 | 96 |
| /observatory | 66 → 77 → **76** (67/76/77) | 180 ms | 0.001 | 98 |
| /observatory/simpsons-… | 71 → 76 → **74** (73/74/76) | 57 ms | 0.037 | 98 |
| /topics | 77 → 80 → **77** (71/77/79) | 45 ms | 0.001 | 98 |
| /topics/webflow-cms | 76 → 81 → **76** (75/76/78) | 68 ms | 0.000 | 98 |

Within run-to-run noise of the post-pass table (spreads of 5–14 points inside one page's 3 runs); blocking time stays 45–180 ms everywhere (was up to 1,264 ms). CLS 0 on 10 of 12 pages, incl. Home and Contact (0.027 / 0.034 this morning). Topicweave's 7.0 s LCP with 0 ms TBT is Lighthouse's simulated estimate (same pattern as the old /work/cks). New a11y flag on Topicweave: `target-size` (from the mission chat's v0.33.49–51 work); otherwise the same pre-existing contrast / label flags.

**Tap targets fixed (v0.33.52, Topicweave chat):** `.scn-ctl` buttons on the mission monitor are now at least 24 x 24 (`all:unset` was beating `.scn-pp`'s size). Live re-check of /work/topicweave (3 runs): `target-size` passes, a11y 93 → **96** (only the pre-existing color-contrast flag left), perf 48/61/61.
