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
