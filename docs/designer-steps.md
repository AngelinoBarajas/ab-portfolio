# Designer steps: everything the MCP can't do (consolidated 2026-09-27)

One checklist for every pending Designer step, merged from `docs/webflow-build-notes.md` (per-page "Designer steps" sections), `docs/seo-plan.md` §6 and the open items in `docs/handoff.md`. Tick each box as it's done and verified on **webflow.io** (staging only: `publishToWebflowSubdomain: true, customDomains: []`).

How to run it: one step at a time. Claude gives the exact Navigator path + clicks, Angelino does it, then Claude checks the published HTML on `ab-portfolio-723a30.webflow.io` (links in raw HTML, `<title>`, meta, JSON-LD) before moving on. Publishing is asked for each time.

Already done (don't redo): Home color bindings, Work card tags + brand colors, the 5 Mission template "Mission = Current Mission" filters, Services rail = all services, Mission Planner form rename (ID kept `planner`).

---

## A. Crawlable links (highest SEO value)
Today these hrefs are fixed by script only; crawlers see the wrong URL. For each: select the Link Block › Settings (gear) › Link type **Collection page / Current … page** (or the reference field).

- [ ] **A1. Observatory cards**: page `/observatory` › `section_ks-library` › Collection List › item › observation card Link Block (`ab_ks-card`) → *Current Observation page*. Raw HTML should then read `/observatory/<slug>` (now `/observatory`).
- [ ] **A2. Topic index links**: `/observatory` topic chips/index links and `/topics` › topic index item link → *Current Topic page* (now render `/topics`).
- [ ] **A3. Home board frame**: Home › work board › Missions list item › frame link → *Current Missions page* (renders `detail_work`, a 404).
- [ ] **A4. Work mission card**: `/work` › Missions list › `ab_mission-card` link → *Current Missions page* (renders `/work`).
- [ ] **A5. Services related-mission card**: Services template › related missions list › card link → *Current Missions page*.
- [ ] **A6. Mission Next card**: Missions template › Next card link → *Next mission* field.
- Note: MCP-set collection links render the literal slug; these must be set in the Designer. Links from the static `/observatory` / `/topics` pages to their own-folder templates were the ones rendering the static URL; if A1/A2 still render wrong after setting, report it (script keeps working meanwhile).

## B. Template SEO + Open Graph (Page settings of each template)
- [ ] **B1. Observatory template**: SEO title `[Name] · Observatory · Angelino Barajas`, description `[Meta description]`; OG title/description "Same as SEO", OG image = og-site image.
- [ ] **B2. Topics template**: `[Name] · Topics · Angelino Barajas`, `[Meta description]`; OG same as SEO + og-site image.
- [ ] **B3. Missions template**: `[Name] · Mission debrief · Angelino Barajas`, `[Meta description]`; OG same as SEO, OG image = **Social image** field.
- [ ] **B4. Services template**: `[Name] · Services · Angelino Barajas`, `[Summary]`; OG same as SEO (OG image already og-services).

## C. Template head code (Page settings › Custom code › Inside `<head>`)
Back up the current field first (paste into `webflow/backup/`). Insert each `[Field]` with "+ Add field".
- [ ] **C1. Missions template**: `<meta name="robots" content="[Robots]">` then the block in `seo/jsonld/mission-template.head.html`.
- [ ] **C2. Services template**: `seo/jsonld/services-template.head.html`.
- Keep `{{DOMAIN}}` until launch (launch versions in `seo/jsonld/launch/`). Observatory/Topics JSON-LD is emitted by ab-knowledge; a native template version is optional later.

## D. Images + alt
- [ ] **D1. Work card cover** Image › Settings › Alt text → from CMS (cover alt / name).
- [ ] **D2. Headshot**: About hero › badge › front face › `.ab_badge_photo` › add Image (4:5); CSS fills the frame and hides the silhouette. (Needs the photo from Angelino.)

## E. Forms
- [ ] **E1. Process form**: Form settings › Name (now "Email Form"). Script doesn't use its ID.
- [ ] **E2. Contact form**: same rename. After any rename re-check the form ID (Webflow resets it to `wf-form-<Name>`; Contact's script hooks: check `docs/webflow-build-notes.md` › Contact before renaming).
- [ ] **E3. Forms notification email**: Site settings › Forms › confirm the address (Home planner, Process, Contact all post there).

## F. Site settings
- [ ] **F1. Favicon + webclip**: Site settings › General › upload `logo/favicon-32.png` + `logo/webclip-256.png`.
- [ ] **F2. SEO**: Auto-generate sitemap **on**; Disable Webflow subdomain indexing **on** (staging stays out of Google). Canonical + robots.txt wait for launch (`seo-plan.md` §5).

## G. Optional cleanups (do if time allows)
- [ ] G1. Observatory/Topics CMS field display names → Title Case (API made them lowercase).
- [ ] G2. Work card cover Image visibility bound to *Cover is set* (script already removes empty images).
- [ ] G3. Work card name H3 → H2; About badge h3s → Text Block; footer Services column + Motion, Design systems, Performance.
- [ ] G4. Home planner: swap the fields embed for `webflow/build/home/planner-fields.embed.html`; move `#plRead` below `.ab_planner_viz` (script does it now).
- [ ] G5. Home heading spans: add `t-outline` to spans in `#work-h`, `#cap-h`, `#log-h`; `t-orbit` in `#orbit-h`; `t-stars` in `#launch-h` (script adds them now).
- [ ] G6. Sorts: Tools list order (3 Adobe items sort first), Quotes list order.
- [ ] G7. 404 page: `main-wrapper` id `top`, section id `hero` (MCP hits a component-map conflict).
- [ ] G8. Mission template: Tools stack chip color binding (`[data-field=color]` BG = Tools › Color); Services rail dot `[data-field=dot]` BG = *Rail dot color*.
- [ ] G9. Process crew section: shorter top spacing.

## Not Designer (content Angelino supplies)
Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, `[X–Y weeks]`), metrics numbers, pin coordinates (Lincoln Center / ON NYC), copy review (AB Identity, Aguirre site-plan board, Services WebGL title).
