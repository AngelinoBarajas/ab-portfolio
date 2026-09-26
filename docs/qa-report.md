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
