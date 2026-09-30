# Designer steps: everything the MCP can't do (consolidated 2026-09-27)

One checklist for every pending Designer step, merged from `docs/webflow-build-notes.md` (per-page "Designer steps" sections), `docs/seo-plan.md` §6 and the open items in `docs/handoff.md`. Tick each box as it's done and verified on **webflow.io** (staging only: `publishToWebflowSubdomain: true, customDomains: []`).

How to run it: one step at a time. Claude gives the exact Navigator path + clicks, Angelino does it, then Claude checks the published HTML on `ab-portfolio-723a30.webflow.io` (links in raw HTML, `<title>`, meta, JSON-LD) before moving on. Publishing is asked for each time.

Already done (don't redo): Home color bindings, Work card tags + brand colors, the 5 Mission template "Mission = Current Mission" filters, Services rail = all services, Mission Planner form rename (ID kept `planner`).

## Open items at a glance (updated 2026-09-30, after v0.33.29)

**Before any of these: reload the Designer.** On 2026-09-30 the API rewrote the site head (Geist preload + ab-core CSS v0.33.29) and the heads of `/observatory`, `/topics`, the Topics template and the Observatory template (ab-knowledge CSS v0.33.29). A Page-settings Save from a tab opened earlier would put the old versions back.

Quickest wins first (each is a few clicks):
1. **P1** Topics template: show "Shown in practice" only when *Missions is set* (removes the last layout jump over 0.1). New.
2. **P2** Topics template: same for "Related services" (*Services is set*). New, optional.
3. **M2** About badge: "Training / Self-taught" → "Flight hours / 10,000+".
4. **J1 / J2** Home: hero badge year 1987, services lede text.
5. **H3** Email fallback text in Nav, Footer, Contact.
6. **L1 / L2** Logo v2 fallback image; favicon + webclip upload.
7. **I1** Services template "Flight computer" (steps 1, 3, 4, 5 + re-add the outline span).
8. **H1** Home statement planet size/position (values below).
9. **H2** Missions template Benefits field binding.
10. **G6 / G8** List sorts; Mission template color bindings.
11. **N** Nav tidy-ups (attribute `ture` → `true`).

Needs something from you first: **D2** headshot photo, **H5** real testimonials (before launch), **C2** Services JSON-LD (at launch). Your call: **G5** (recommended skip), **H6** (optional). **H4** is superseded by L3 (done).

---

## A. Crawlable links (highest SEO value)
Today these hrefs are fixed by script only; crawlers see the wrong URL. For each: select the Link Block › Settings (gear) › Link type **Collection page / Current … page** (or the reference field).

- [x] **A1. Observatory cards** (done 2026-09-27, verified: 10 cards render `/observatory/<slug>`): page `/observatory` › `section_ks-library` › Collection List › item › observation card Link Block (`ab_ks-card`) → *Current Observation page*. Raw HTML should then read `/observatory/<slug>` (now `/observatory`).
- [x] **A1b. Home Incoming signals cards** (done 2026-09-27, verified: 3 cards render `/observatory/<slug>`): Home › `section_ks-row` (#signals) › … › `ab_ks-item` › `ab_ks-card` → *Current Observation* (found 2026-09-27: 3 cards render `/observatory`).
- [x] **A2. Topic index links** (done 2026-09-27, verified: 27/27 on each page render `/topics/<slug>`): `/observatory` topic chips/index links and `/topics` › topic index item link → *Current Topic page* (now render `/topics`).
- [x] **A3. Home board frame** (done 2026-09-27, verified: 3 frames render `/work/<slug>`): Home › work board › Missions list item › frame link → *Current Missions page* (renders `detail_work`, a 404).
- [x] **A4. Work mission card** (done 2026-09-27, verified 6/6 `/work/<slug>`): `/work` › Missions list › `ab_mission-card` (item) › `ab_mission-card_link` → *Current Missions page* (renders `/work`).
- [x] ~~A5. Services related-mission card~~: not a Designer step. Those cards are cloned from `/work` by script (hidden list only supplies slugs), so they inherit A4's real hrefs. Replaced by A5a–c (found 2026-09-27):
- [x] **A5a. (done 2026-09-27, verified) Services template rail**: `section_dbh` › … › `ab_sv_rail` (#svRail) › list › item › `ab_sv_rail_link` → *Current Service* (8 render `/services`).
- [x] **A5b. (done 2026-09-27, verified) Services template Pairs with**: `section_dbh` › … › `ab_meta.is-service` › `ab_meta_item` › `ab_sv_pairs` › list › item › `ab_sv_pair` → *Current Service* (render `/services`).
- [x] **A5c. (done 2026-09-27, verified) Services hub Explore**: `/services` › `section_hub-hero` › … › `ab_hub-scr` › list › item › `ab_hub-row` › `ab_hub-go` → *Current Service* (8 render `/services`).
- [x] ~~A6. Mission Next card → Next mission field~~: not needed. The Next card is script-built inside the shared Next card component (no native link). Replaced by **A6. Missions template switcher** `ab_dbh_top` › `ab_mswitch` › list › item › `ab_mswitch_link` → *Current Mission* (done 2026-09-27, verified 3/3 `/work/<slug>` on each mission page).
- Note: MCP-set collection links render the literal slug; these must be set in the Designer. Links from the static `/observatory` / `/topics` pages to their own-folder templates were the ones rendering the static URL; if A1/A2 still render wrong after setting, report it (script keeps working meanwhile).

## B. Template SEO + Open Graph (Page settings of each template)
- [x] **B1. Observatory template** (done 2026-09-27, verified; OG image via template head `<meta>`, the Designer dropdown only lists CMS Image fields): SEO title `[Name] · Observatory · Angelino Barajas`, description `[Meta description]`; OG title/description "Same as SEO", OG image = og-site image.
- [x] **B2. Topics template** (done 2026-09-27, verified; OG image via head `<meta>`): `[Name] · Topics · Angelino Barajas`, `[Meta description]`; OG same as SEO + og-site image.
- [x] **B3. Missions template** (done 2026-09-27, verified 7/7; placeholders without a Social image emit an empty og:image, harmless while noindex): `[Name] · Mission debrief · Angelino Barajas`, `[Meta description]`; OG same as SEO, OG image = **Social image** field.
- [x] **B4. Services template** (done 2026-09-27, verified): `[Name] · Services · Angelino Barajas`, `[Summary]`; OG same as SEO (OG image already og-services).

## C. Template head code (Page settings › Custom code › Inside `<head>`)
Back up the current field first (paste into `webflow/backup/`). Insert each `[Field]` with "+ Add field".
- [x] **C1. Missions template** (robots meta done 2026-09-27, verified: `noindex` on exactly the 4 placeholder/hidden missions, empty on the 3 real ones; JSON-LD block **moved to launch**) : `<meta name="robots" content="[Robots]">` then the block in `seo/jsonld/mission-template.head.html`.
- [ ] **C2. Services template** (⏸ moved to launch): `seo/jsonld/services-template.head.html`.
- ⚠️ Webflow treats any `{{…}}` in custom code as its own variable and publishes it **empty** (the Designer warns: *invalid {{ variables }}*). So `{{DOMAIN}}` can't sit in a template head; paste the template JSON-LD at launch from `seo/jsonld/launch/` (generated with the real domain). Was: keep `{{DOMAIN}}` until launch (launch versions in `seo/jsonld/launch/`). Observatory/Topics JSON-LD is emitted by ab-knowledge; a native template version is optional later.

## D. Images + alt
- [x] **D1. Work card cover** (done 2026-09-27, verified: *Use alt text from asset* on a CMS-bound image outputs the CMS item's alt; cards without a cover stay empty) Image › Settings › Alt text → from CMS (cover alt / name).
- [ ] **D2. Headshot**: About hero › badge › front face › `.ab_badge_photo` › add Image (4:5); CSS fills the frame and hides the silhouette. (Needs the photo from Angelino.)

## E. Forms
- [x] **E1. Process form** → **Launch Brief** (done 2026-09-27, verified `wf-form-Launch-Brief`): Form settings › Name (now "Email Form"). Script doesn't use its ID.
- [x] **E2. Contact form** → **Contact Channel** (done 2026-09-27, verified `wf-form-Contact-Channel`; scripts find forms by container, not ID): same rename. After any rename re-check the form ID (Webflow resets it to `wf-form-<Name>`; Contact's script hooks: check `docs/webflow-build-notes.md` › Contact before renaming).
- [x] **E3. Forms notification email** (confirmed by Angelino 2026-09-28: test submissions arrived): Site settings › Forms › confirm the address (Home planner, Process, Contact all post there).

## F. Site settings
- [x] **F1. Favicon + webclip** (done 2026-09-28, verified: favicon 32/48, apple-touch 180, icons 192/512 all 200 PNG; the 512 is upscaled from the 256 webclip, re-upload a 512 export someday): Site settings › General › upload `logo/favicon-32.png` + `logo/webclip-256.png`.
- [x] **F2. SEO** (done 2026-09-28: Webflow subdomain indexing **Off** (the toggle reads "indexing … enabled" when On, so Off = staging blocked), Auto-generate sitemap **On**, crawlers + AI bots On, robots.txt empty, canonical-base toggle Off until launch. Verified: webflow.io `/robots.txt` = `Disallow: /`; `/sitemap.xml` 404s on webflow.io by design, it's served on custom domains only → check at launch): Auto-generate sitemap **on**; Disable Webflow subdomain indexing **on** (staging stays out of Google). Canonical + robots.txt wait for launch (`seo-plan.md` §5).

## N. Mobile nav fit (found 2026-09-27, done 2026-09-28, verified 320–991px)
- [x] **N1.** `ab_menu_link` (BASE) Size `clamp(26px, 9vw, 76px)` (was `clamp(40px, 12vw, 76px)`). Note: the Designer shows an inherited `clamp()` as "0 PX" on smaller breakpoints; set it on Desktop.
- [x] ~~N2. hide `ab_menu_link-path`~~ → replaced by Angelino's idea: **Tablet** `ab_menu_link` Direction Vertical, gap 6px (the `/slug` sits under the word). Core **v0.27.2** left-aligns the "You are here" pill on stacked rows.
- [x] **N3.** `ab_menu_component.is-open` (combo): Align Y **Top** + Overflow **Auto**; element attribute `data-lenis-prevent` (value typed `ture`, harmless: Lenis checks presence); `ab_menu_tag.text-style-mono` Display Block + Margin Top auto (Designer greys out vertical margin on an inline Text Span until it's Block). Result: bottom-anchored when it fits, scrolls from the top under the nav when it doesn't.
- [ ] Tidy-ups next time in the Nav: attribute value `ture` → `true`; `ab_menu_tag` margin/display are set at Mobile L only (move to Tablet if the 768–991 menu ever looks top-heavy; measured fine); leftover Mobile L `ab_menu_component { display: none }` (harmless).

## G. Optional cleanups (do if time allows)
- [x] G1. (done via API 2026-09-28: 19 fields on Observatory, Topics, FAQ › Topics, Missions › Topics; slugs unchanged) Observatory/Topics CMS field display names → Title Case (API made them lowercase).
- [x] G2. (done 2026-09-28, verified: /work outputs only the 3 real cover imgs; the condition lives behind the purple dot on Settings › Visibility) Work card cover Image visibility bound to *Cover is set* (script already removes empty images).
- [x] G3. (done 2026-09-28, changed plan: cards stay H3 because Services clones them under its "Related missions" H2; `/work` got a hidden `h2.ab_sr` "Missions" instead. About badge back title → Text Block. Footer Services column rebuilt from the Navigate column (the old one was a Text Block with inline links, can't add links reliably): `nav[aria-label=services]`, 8 links, all 200; static links to CMS items break if a service slug is renamed) Work card name H3 → H2; About badge h3s → Text Block; footer Services column + Motion, Design systems, Performance.
- [x] ~~G4~~ skipped 2026-09-28 (Angelino): the script already adds the add-on chip + hidden Add-ons field (submitted), ticks, "Not sure yet" and moves `#plRead`; the repo embed has drifted (no "Not sure yet"), and a re-paste risks a working form for no visible change. Home planner: swap the fields embed for `webflow/build/home/planner-fields.embed.html`; move `#plRead` below `.ab_planner_viz` (script does it now).
- [ ] G5. (pending Angelino's call; recommended **skip**: `home/00-hero.js:10` adds the classes to unclassed spans before anyone scrolls there, and the Designer canvas can't show the effects since it doesn't load our CSS) Home heading spans: add `t-outline` to spans in `#work-h`, `#cap-h`, `#log-h`; `t-orbit` in `#orbit-h`; `t-stars` in `#launch-h` (script adds them now).
- [ ] G6. Sorts: Tools list order (3 Adobe items sort first), Quotes list order.
- [x] ~~G7~~ skipped 2026-09-28: no-op (404 script finds `.section_lost` by class; hero toys need `#heroTitle`; core handles `#top` without an element). 404 page: `main-wrapper` id `top`, section id `hero` (MCP hits a component-map conflict).
- [ ] G8. Mission template: Tools stack chip color binding (`[data-field=color]` BG = Tools › Color); Services rail dot `[data-field=dot]` BG = *Rail dot color*.
- [x] G9. (done 2026-09-28: combo `section_process-crew.theme-light` Padding Top `clamp(40px, 6vw, 96px)`; space above the heading 299→243 desktop, 211→141 phone; first try landed in Margin, Alt-click cleared it) Process crew section: shorter top spacing. Source: shared `.theme-light` padding `clamp(110px,13vw,180px)` + margin `clamp(20px,4vw,48px)` on top of the inner `padding-section-medium` 64px (~194px above the content vs 64 elsewhere). Fix on the combo `section_process-crew.theme-light` only, never on `theme-light`.
- [x] G10. (Designer showed Visible but Webflow kept publishing `overflow:hidden`; fixed in code, ab-services v0.27.3 `.ab_sv_solve .ab_sv_s{overflow:visible}`, verified) Services template › Problems solved cards `ab_sv_s` (BASE) › Overflow **Visible** (found 2026-09-28: `overflow:hidden` clipped the hover selection frame, which sits at inset -1px with handles at -5px, so its border never showed; nothing else in the card extends past its edges; scanned 9 page types, only this one clips a `.sel`).

## H. Added 2026-09-28 (kip debrief session): do these in one sitting

**First:** reload the Designer. This session wrote page code and CMS through the API (Observatory head, Mission/Home/Knowledge scripts, CMS items), and a stale Page-settings Save would overwrite it.

- [ ] **H1. Home statement planet** (`/`, `section_statement` › `.ab_planet.is-statement`, the teal ringed planet next to "Build the part people screenshot"). Tested by injection on staging at 320–1440, nothing overflows:
  - **Desktop (base):** Width `clamp(150px, 27vw, 410px)` (was 24vw / 360px) · Right `calc(clamp(150px, 27vw, 410px) * 0.62)` (was × 0.7) · Top `14%` (was 8%). Result: ~12% bigger, lower, still clear of the headline.
  - **Mobile Landscape (applies down to phones):** Width `clamp(200px, 52vw, 330px)` · Right `-8vw` · Top `3%`. Result: bigger, bleeds off the top-right corner behind the heading, fills the empty space.
  - Verify: `/` at 1440 and 390 on staging; the headline must stay on top of the planet.
- [ ] **H2. Benefits list on missions** (Mission template › `section_briefing` › `ab_brief_side`): select the hidden `div.ab_cms-source` under the parameters list (attribute `data-field="params"`) › Duplicate › bind the copy's text to **Benefits** (new Missions field) › change its attribute to `data-field="benefits"`. The script lists the lines under Mission parameters as "Benefits for the people using it" (reuses the parameters' classes, no CSS). Verify: `/work/kip` shows B-01…B-04; other missions (Benefits empty) show nothing new.
- [ ] **H3. Email fallback text** → `angelino@barajasdsgn.com` in every `[data-bind="email"]` element: Nav component › mobile menu › `ab_menu_foot` span; Footer component › `#footEmail` button label; Contact page › email button label (`is-contact`). Visitors already see the right address (the script fills it from Site settings › Email); this fixes the raw HTML for crawlers and no-JS. Verify: `curl` any page, no `your-domain` left.
- [x] ~~**H4. (optional) Mission template stylesheet link**~~ superseded by L3 (v0.33.16, done 2026-09-30). (Page settings › Custom code › head, **keep the robots `<meta>` binding below it untouched**): change the ab-mission.css link to
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.28.4/code/dist/ab-mission.prod.css" integrity="sha384-cN5rSLnIcJZugZozlUAvBrBSrbndlU9JToeelXU0PfMzLKRObdozUwyRVaL0XHAS" crossorigin="anonymous">`
  (was v0.26.5). Nothing visible depends on it: the new mobile-channel centering and Benefits styling are inline in the script. Not done through the API because a full rewrite of that head block risks the Designer-bound robots field.
- [ ] **H6. (optional) Make the Observatory bento card native** (Home › `section_services` › `ab_bento_grid`). Today ab-home v0.28.5 builds it: it drops the Marks card (`Card / branding`) to one row by removing `is-tall` from its `ab_bento_cell`, and inserts an `ab_bento_cell` › `article.ab_bento-card.is-observatory` (`data-visual="observatory"`) right after Custom deploys. To make it native: in the Designer remove `is-tall` from the branding cell, duplicate the Design systems cell, move it right after Custom deploys, set `data-name="Card / observatory"` and `data-visual="observatory"`, background gradient `135deg #4C8DFF → #7C5CFF → #FF6A3D`, text white, label *The Observatory*, title *Field notes from real builds*, text *Articles on the how and the why: build notes from real projects and the ideas behind them, linked by topic.*, link `/observatory`. The script then only draws the star chart into it. Benefit: the card's copy is in the raw HTML (crawlers, no-JS) and editable in the Designer.
- [ ] **H5. (CMS, before launch) Placeholder testimonials**: Missions › 510 Visuals, CKS, kip, Knowledge System › Client quote + Quote by all end in "(placeholder)". Replace with real quotes or clear both fields (empty quotes drop out of Incoming automatically).

## I. Flight computer (Services depth session, design approved 2026-09-28)

- [ ] **I1. Rename "Under the hood" → "Flight computer"** · *PARTLY DONE (raw HTML, 2026-09-28): H2 text changed but the outline span is gone (re-add `computer` inside a `t-outline` span); steps 1, 3, 4, 5 still open.* (Services template › `section_sv-hood#hood`). **Ready (2026-09-28): all 8 services have a program since ab-services v0.28.9.** The script already shows the new text, so visitors see it today; this step puts it in the raw HTML (crawlers, no-JS).
  1. Navigator › `section_sv-hood` › … › `ab_sv_code_copy` › eyebrow `text-style-eyebrow`: `/engineer · under the hood` → `/engineer · flight computer`
  2. The H2 `#hood-h`: first text `Under the ` → `Flight `; the outline span (`t-outline`) `hood` → `computer`
  3. The lede `ab_sec-h_lede`: → `The code that flies this service. Run a program and watch what each line does.`
  4. The frame label span (`ab_frame-label`, first child of the section): `▢ under-the-hood` → `▢ flight-computer`
  5. Section Settings › Custom attributes: `data-frame` `under-the-hood` → `flight-computer` (keep the id `hood`: the script finds the section by it)
  6. Optional: Navigator display name "Under the hood" → "Flight computer"
  - Verify: `curl` `/services/performance` shows "Flight computer" in the raw HTML; `/services/motion` console still builds.

---

## J. Added 2026-09-28 (v0.30.0 tweak batch): text the script sets for now
- **J1 Home hero badge:** Home › hero › `.ab_hero_badge` HTML Embed: change `Est. 2026` → `Est. 1987` in the `<textPath>` and `established 2026` → `established 1987` in the aria-label. (`home/00-hero.js` rewrites it until then; source copy in `webflow/build/home/hero.html` is already updated.)
- **J2 Home services lede:** Home › `#capabilities` › `p.ab_section-lede`: replace "Eight services and one planet you can throw." with "Eight services, one orbit: everything a site needs to launch, grow and keep working long after day one." (`home/20-services.js` swaps it only while the old text is there.)

---

## Not Designer (content Angelino supplies)
Placeholders in `docs/placeholders.md` (email, socials, 4 pin images, testimonials, `[X–Y weeks]`), metrics numbers, pin coordinates (Lincoln Center / ON NYC), copy review (AB Identity, Aguirre site-plan board, Services WebGL title).

## Logo v2 (2026-09-30)
- [ ] **L1. Fallback logo image:** Nav component and Footer component › `.ab_nav_logo` › the Image (`.ab_logo-img`) › Settings › Replace image › asset `ab-logo-v2.svg`. Keep height 24px. (Only visitors without JavaScript see it; the script draws the live logo.)
- [ ] **L2. Favicon + webclip:** Site settings › General › upload `logo/favicon-32.png` (favicon) and `logo/webclip-512.png` (webclip; 256 also available).
- [x] **L3. Mission stylesheet v0.33.16** (done by Angelino, verified live 2026-09-30): Missions template › Page settings › Custom code › Inside <head> tag: replace ONLY the ab-mission.css `<link>` line (leave the robots meta with its binding untouched) with:
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.33.16/code/dist/ab-mission.prod.css" integrity="sha384-Kj06O2G+agmjZk1RihQOzoyU+4QJ+41lh91SUSZhRiBxOVsaEa5aG+Fke9CqtMJF" crossorigin="anonymous">`

## M. Bookshelf card dark (added 2026-09-30, bookshelf session)
- [x] **M1. Bookshelf card → dark** (done 2026-09-30 by MCP, verified live: `class="ab_bento-card is-shelf is-dark"`, bg rgb(14,16,32) like the Interstellar card. `set_style` fails with "styles not found" until the 3-class chain exists: created combo `is-dark` under [ab_bento-card, is-shelf] with the same two variables as `.ab_bento-card.is-dark`, then set_style worked. Steps below kept for reference): hard-refresh the Designer first. About page › Navigator › `section_about-off` › … › `ab_bento_cell is-full` › **Card / bookshelf** (`ab_bento-card is-shelf`, an `<article>`) › Style panel › Selector field › type `is-dark` › Enter (reuses the existing combo; don't create a new style or change any properties). The card turns navy like the Interstellar card; the text colors follow. Previewed 2026-09-30 by rewriting the class in the staging HTML: wood shelf + tesseract both read well on navy. Publish to webflow.io only, then Claude checks the HTML shows `class="ab_bento-card is-shelf is-dark"`.
- [ ] **M2. Flight hours text** (the API can't edit text inside Div Blocks; a script shows it meanwhile): About › hero › crew badge front › `ab_badge_fields` › 2nd `ab_badge_field`: double-click `ab_badge_dt` "Training" → **Flight hours**, `ab_badge_dd` "Self-taught" → **10,000+**. Same in the meta row under the badge (`ab_meta` › 3rd `ab_meta_item`: `ab_meta_label` → Flight hours, `ab_meta_value` → 10,000+). The hero sentence "self-taught designer and developer" stays unless Angelino says otherwise.

## P. Page speed session (added 2026-09-30, v0.33.29)
Context: v0.33.29 removed the layout jumps on load (details in `docs/qa-report.md`). One jump is left that CSS can't fix: on the 11 topics with no missions, the script hides the "Shown in practice" section after the page has painted, so everything below it moves up (CLS 0.11 at ~1024px, 0.05 at 1440). The Topics' own **Missions** field is filled on exactly the 16 topics that show the section and empty on the 11 that hide it (checked 2026-09-30), so Webflow can leave the section out before the page is sent.

- [ ] **P1. Hide "Shown in practice" when a topic has no missions.** Topics template › Navigator › `section#practice` (class `section_ks-topic`, attribute `data-ks-sec="practice"`, frame label `▢ shown-in-practice`) › Settings (gear) › **Visibility** › Conditions › **+ Add condition** › field **Missions** › **is set** › Save. Publish to webflow.io.
  - Verify (Claude): raw HTML of `/topics/agencies-partners` has no `data-ks-sec="practice"`; `/topics/webflow-cms` still has it with its 2 missions; CLS at 1024 under 0.1.
  - Keep in mind: a new topic only shows missions if its **Missions** field is filled (the script's fallback that also matched missions tagging the topic won't be reached for a hidden section).
- [ ] **P2. (optional) Same for "Related services".** Topics template › `section#services` (`data-ks-sec="services"`) › Visibility › **Services is set**. The 3 topics without services (Saying no, Science of time, Philosophy at work) are the 3 that hide it. It sits further down the page, so it doesn't cause a visible jump today; this just makes the HTML match what visitors see.
- Note, not a step: `ab-core.css` now re-declares the body and mono font variables (Geist / JetBrains Mono plus size-matched fallbacks). If you ever change the body or mono font in **Variables**, tell Claude so the fallback is updated too.
