# Webflow build notes

What exists in Webflow, how it deviates from the prototypes/spec, and what still needs a Designer hand. Update as the build moves.

## Global classes (all colors, fonts and scale sizes are linked Webflow variables)

| Group | Classes |
|---|---|
| Structure | `page-wrapper` (overflow-x clip), `main-wrapper` (`<main id="top">`), `padding-global` (Layout / Gutter), `container-large` (Layout / Max Width), `padding-section-medium` (Section / Padding), `padding-section-large` (Section / Padding Large), `hide` |
| Headings | `heading-style-display`, `-h1`, `-h2`, `-statement`, `-h3` (Archivo, weight/stretch/line-height/tracking per `tokens.json`, margins 0) |
| Text | `text-size-lede`, `-regular` (lh 1.6), `-small`, `-micro`, `text-style-eyebrow`, `text-style-mono`, `text-color-primary/secondary/tertiary/signal/alert`, `text-align-center` |
| Buttons | `button` + `is-primary` / `is-ghost` (hover → Signal). `is-primary.is-nav`, `is-ghost.is-email` combos. Child spans: `ab_button-shine`, `ab_button-label`, `ab_button-arrow` |
| Theme | `theme-light` → Color collection set to **Light** mode on the class |
| Data | `ab_cms-source` (display none) for hidden CMS source lists |

## Components (group "Global")

| Component | ID | Root |
|---|---|---|
| Nav | `2a7d17af-8058-c7e5-40b8-743eb5d45bac` | `ab_nav_wrapper` → `header.ab_nav_component#nav` + `div.ab_menu_component#mmenu[hidden]` |
| Footer | `b6135eba-84f0-865b-6ee0-af875233bbb3` | `footer.ab_footer_component#siteFoot` |
| Frame label | `5d641863-5988-1bae-9f2b-70af591564ae` | `span.ab_frame-label[data-frame-label]`, first child of every `section[data-frame]`; script fills the text |
| Bento card | `d012e1f2-818c-a09d-53d6-c1f113664fc0` | `article.ab_bento-card` (variants **Light** = base, **Dark** = Color mode Dark on the root). Props: Label, Title, Text, Tools, Show tools, Link, Link label (→ `aria-label`), Visual (→ `data-visual`), Card name (→ `data-name`). Goes inside a page-level `ab_bento_cell` (`is-xl` / `is-tall` set the grid span) |
| FAQ item | `fb86f6fa-74e4-ed04-8f8c-2753ef458549` | `details.ab_faq_item` › `summary.ab_faq_summary` + `p.ab_faq_answer`. Props: Question, Answer (bound to FAQ fields inside a Collection List) |

Script hooks kept from the prototypes: `#nav`, `#menuBtn` (real `<button>`), `#mmenu`, `#clock`, `[data-bind="availability|tz-label|email"]`, `[data-scramble]`, `[data-cta]`, `#feed`, `#feedCount`, `#footQ`, `#footQBy`, `#toTop[data-magnetic]`, `#footEmail[data-copy-email]`, `[data-social="linkedin|behance|github|dribbble"]`, `#footClock`, `#wordmark`, `#gridToggle`, `.ab_planet[data-planet …]`.

## Site data block (every page)

Webflow Components **can't contain CMS Collection Lists**, so the CMS data the nav/footer need lives in a hidden page-level block right after the Footer instance:

```
div.ab_cms-source[data-site-data][aria-hidden]
  Collection List (Quotes)         .ab_cms-source[data-quote-source]   → item: [data-field=quote|author|context]
  Collection List (Site Settings)  .ab_cms-source[data-settings-source] (limit 1) → item: [data-field=availability|timezone|tz-label|email|headline|space-events|linkedin|behance|github|dribbble]
```

`ab-core.js` reads `[data-settings-source] [data-field]` to fill `[data-bind]` spans and social hrefs, and `[data-quote-source]` items for the rotator. Built on Home; each new page gets the same block.

## Deviations from the prototypes / spec

- **Breakpoints:** prototype media queries (1100, 860, 700, 620, 520, 420px) map to Webflow's 991 / 767 / 479. The nav collapses to the menu button at ≤991 (prototype: ≤860). The 1100px "hide the clock" rule moves to `ab-core.css`.
- **Section padding:** tokens say `clamp(64px,9vw,120px)`; the prototype CSS uses `clamp(72px,11vw,150px)`. Classes follow the tokens.
- **New variable** `Color / Neutral / Glass` (Dark `rgba(14,16,32,.78)`, Light `rgba(251,250,246,.78)`) for the nav bar and feed console, so no raw rgba lives in classes.
- **Component-specific sizes** (nav link 13px, button 14px, menu links `clamp(40px,12vw,76px)`, black-hole `clamp(320px,46vw,720px)` math) are raw values on the component classes. The token scale covers type roles and layout, not every one-off.
- **To `ab-core.css` (step 7)** because the Designer can't express them: button shine/sweep `::before`, primary button offset shadow (`box-shadow` with a variable color gets flattened by the MCP), `-webkit-backdrop-filter`, nav link hover diamond/underline, footer link bullet, feed-console corner ticks + `::before` label, `.ab_menu_component` clip-path reveal + gradient, blink/keyframe animations, `::selection`, `:focus-visible`, `text-wrap: balance`, the 1100px clock rule, wordmark letter styling.

## Tag styles (done 2026-09-25)

Body (All Pages): Void background, Text / Primary, Font / Body, Text / Body, line height 1.6 (set by Angelino + MCP). H1–H6 and paragraph margins 0. All Links not created (every link class sets its own color).
Note: the MCP can edit tag styles (`style_name: "body"`, `"h2"`…) only after they exist; it can't change classes on the Body element.

## Home page (built 2026-09-25, awaiting Angelino's OK)

`main-wrapper` › hero · work · statement (about) · services (light bento) · process · transmission · stack · testimonials · faq · contact. Source files and the prototype → Webflow hook map: `webflow/build/home/` (`class-map.md`). Converter: `webflow/build/prep.py` (shorthand expansion, var aliases, rebind actions).

| Section | CMS | Notes |
|---|---|---|
| Hero | none | 3 draggable planets, badge SVG in an Embed (WHTML lowercases `textPath`), satellite SVG as DOM |
| Work | Missions (Featured on, sort asc) | frames carry CMS-bound `data-*` attributes; brand colors in two hidden nodes (Designer step) |
| Statement | none | metrics static (Mission Stats are per mission) |
| Services | none (static) | 8 Bento card instances + page-level planet card. Services CMS has no span/visual/headline fields and the Home copy is curated, so the bento stays static; links go to `/services/[slug]` |
| Process | none (static) | stacked list is the no-JS layout; panel + trajectory shells hidden until the script adds `is-wide` / `is-vert` |
| Transmission | Quotes (via site-data block) | first quote as fallback text |
| Stack | Tools (Icon ≠ code → 9 tools) | chips are real buttons; ring assignment moves to the script |
| Testimonials | none | placeholders (no Testimonials collection) |
| FAQ | FAQ (Scope = Homepage, sort asc) | FAQ item component in the list item |
| Contact | none | native Webflow form; fields in an Embed inside the form (+ scoped style) |

### MCP findings this session
- **Attribute values can be bound** (CMS text/number/option fields and component props) by sending the raw shape through `static_json`: `{"name":"data-slug","value":{"sourceType":"cms","collectionId":…,"fieldId":…}}` / `{"sourceType":"prop","propId":…}`. The typed `value_binding` form is rejected. Color fields can't bind to attributes or text.
- WHTML: only `:hover/:focus/:active` pseudos (others via `update_style` pseudo, e.g. `first-child`); creates classes from CSS rules even without matching markup; **drops the space in `N% at`** inside gradients (fixed by `update_style`); lowercases camelCase SVG tags (use an Embed); `<button>` → href-less Link (rebuilt as DOM buttons); adds a duplicate `href` attribute to links and `class` attributes to DOM elements (removed); a `<span>` can't take a CMS text binding (Div Block can).
- Collection List settings: sort direction `ascending`/`descending`; Switch filter `isOn`/`isOff`; Option filter `equals`/`doesNotEqual` with the **option ID**; link to the current item's template page = `static_link {mode:"page", to:<template page id>}` inside the Collection List (`mode:"collectionPage"` published a raw ID as the href).
- Component instances inside a Collection item bind props to CMS with `type:"bindable", binding_source_type:"cms"`.

### Fix 2026-09-25: mobile menu covered the page
`.ab_menu_component` had `display:flex`, which overrides the `hidden` attribute (the prototype's global `[hidden]{display:none!important}` isn't in Webflow). Now the class is `display:none` and the combo `.ab_menu_component.is-open` is `display:flex`; the menu script must add/remove `is-open`. To edit the menu in the Designer, add `is-open` temporarily.

### Staging publish 2026-09-25 (webflow.io only)
Checked the published HTML: all 10 sections, 3 board frames with CMS `data-*`, 9 tool chips, 4 FAQ items, color nodes carry inline CMS colors. Fixed after the first publish: board frame href (see above) and the form's selection label moved from `data-name` to **`data-sel-name`** (Webflow uses the form's `data-name` as the Forms-inbox name; the selection-box script must read `data-sel-name` on the form).

### Deviations (Home)
- Board background uses Neutral / Void instead of the prototype's one-off `#0A0B14`.
- Planet/badge positions are relative to `container-large` (the prototype's wrap included the gutter), a gutter-width offset at most.
- Bento breakpoints: prototype 1100 / 620 → Webflow 991 (2 columns) / 479 (1 column).
- Planner email is required (it's a live form now); launch-window values are text for the Forms inbox.
- US spelling in Process copy (colors, organized) and the branding card (color).

### Designer steps for Angelino (MCP can't)
1. Reload the Designer: the Tools/FAQ/Missions lists show "no items" in the open tab (items were imported through the API after it loaded).
2. Color bindings inside Collection Lists: Work board item › hidden `[data-field=brand-bg]` → Background color = *Brand background*, `[data-field=brand-fg]` → Text color = *Brand foreground*; Stack chip › hidden `[data-field=color]` → Background color = *Brand color*.
3. ~~Form settings: rename the form~~ ✅ done 2026-09-25 ("Mission Planner"). ⚠️ Renaming a form makes Webflow reset its ID to `wf-form-<Name>`; the ID was set back to `planner` (the script's hook). Re-check the ID after any future rename.

Steps 1–2 also done by Angelino 2026-09-25 (Designer reloaded, 3 dynamic color bindings set via Element settings › Dynamic style settings › Get BG/Text Color from <Collection>). The MCP can't read dynamic style bindings back; verify on staging.

## Work page (built 2026-09-25, awaiting Angelino's OK)

Page `6ab6853da89bdfd5de03324d` (`/work`; a static page can share the `work` slug with the Missions collection). `main-wrapper` › hero (`section_arc-hero`) · missions (`section_arc`) · next-mission (`section_arc-cta`), then Footer + the site-data block. Source files and the prototype → Webflow map: `webflow/build/work/` (`class-map.md`).

| Section | CMS | Notes |
|---|---|---|
| Hero | none (counts from the list) | `ab_dbh_*` + `ab_meta_*` classes, reusable for the Mission template hero. Meta values filled by `ab-work` from the cards; Designer text is the fallback |
| Missions | Mission Types (Filter chip = on, sort asc) for chips; Missions (sort asc) for cards | card = Collection item `.ab_mission-card` › `.ab_mission-card_inner` (content) + an **empty overlay link** `.ab_mission-card_link` (Webflow refuses a Collection List inside a Link block, so the link can't wrap the tags); link carries `data-slug/name/status/cover-kind`, planet carries `data-planet/colors/ring/glow`, cover Image bound to *Cover*. List view rows are built by the script from the cards |
| Next mission | none | component **Next card** (`4b1e1337-5942-b371-9cd3-f2df9f140923`, group Global), no props yet |

CMS change: new Switch field **Filter chip** (`filter-chip`, `80a08003679946064ca0a03df42cfd64`) on Mission Types; on for Website, Branding, Logo, Design, Development, App, UI/UX, WebGL (the prototype's core list). Mission Types `sort` re-ordered to that chip order (the 4 non-chip types 9–12).

### Designer steps for Angelino (Work)
Steps 1–2 **done by Angelino 2026-09-25**, verified on staging: all 18 color nodes carry the right Missions values (not *Next mission*), covers pick them up, tags match the CMS on all 6 cards, chip counts correct, *Development* filter → 510, Aguirre, Halcyon (3 of 6). Step 3 optional, still open.

1. **Card tags**: in the Missions list card, `.ab_mission-card_inner › .ab_mission-card_body › .ab_mission-card_tags` › add a Collection List sourced from the card's *Types* field; item = Text Block bound to *Name*, class `ab_mission-card_tag`; give the nested wrapper/list/item the class `ab_arc_chip-list`. Filtering needs these tags (until then the bar shows only "All"). Verified with simulated tags: Branding → AB Identity + Northwind, count "Showing 2 of 6".
2. **Card brand colors**: hidden `[data-field=brand-bg]` → BG = *Brand background*, `[data-field=brand-fg]` → Text = *Brand foreground*, `[data-field=brand-accent]` → BG = *Brand accent* (top group, not *Next mission*). Until then covers use the fallback navy/orange.
3. **Cover image visibility** (optional): bind the card Image's visibility to *Cover* is set. The script already removes empty images.

### Deviations (Work)
- Chips come from Mission Types with *Filter chip* on (prototype: hard-coded core list). Counts and zero-count hiding are script-side.
- List view is script-built from the cards (no second Collection List, which would need a second nested Types list).
- Drawn covers (Mark / Brand / App / Site) are injected by cover kind; the Brand cover word is the first word of the mission name, subline = rest of the name + "Est. <year>"; the Site cover headline is fixed placeholder copy.
- Card link binds to the Missions template; the script sets `/work/<slug>` (placeholders get `#` + a toast).
- Prototype opened debriefs/home in a new tab; Webflow keeps the same tab (warp, then navigate).

## Mission template (built 2026-09-25, awaiting Designer filters + Angelino's OK)

Template page `6ab602e48e2fa6779570a308` (`/work/[slug]`). `main-wrapper` › hero (`section_dbh`) · monitor · briefing · palette (identity missions only) · systems · problems solved · manifest (light bento) · telemetry + stack · crew-debrief quote · next mission, then Footer + site-data (+ Glossary and Globe Pins sources). Build files: `webflow/build/mission/`. Code: `ab-mission` bundle + `ab-mission.css` (template head `<link>`), vendor scripts in `code/vendor/`.

| Section | CMS | Notes |
|---|---|---|
| Hero | current item: name, summary, slug, client, role, year, platform, status, live URL, planet fields, number | switcher = Missions list (Hide from site off, Status ≠ Placeholder, sort asc); Types chips = Mission Types list, which **rendered only the current mission's types without a Designer step** (same for the Tools stack list). Hidden marker `[data-mission-hidden]` visible when *Hide from site* is on → script redirects to `/work` |
| Monitor | Mission Channels (hidden source list, `data-id/kind/mode/label/caption` + 2 images) | views, channel buttons, scenes (mockup specs keyed by slug in `code/src/mission/10-mocks.js`), live globe/map load `code/vendor/*` on first view |
| Briefing | objective (cadet/engineer), params (one per line) | `[[term]]` → glossary tips from the Glossary list |
| Systems / Problems / Stats | Mission Systems / Problems Solved / Mission Stats lists (sort asc) | snippets become code blocks; channel/demo ids add "Show on the monitor" buttons |
| Manifest | manifest pages / collections (comma lists), handoff, role, types, params, status | script-built tiles, collections, tags, checks, radar |
| Telemetry + stack | Stats list + Tools list | shared `AB.orbit` (moved to core) |
| Quote / Next | quote + quote-by; next = next mission in the switcher order | next card built by script, HUD via `AB.nextCard` |

New CMS fields: **Missions › Hide from site** (`hide-from-site`, Switch; Work grid + Home board filter it out) and **Mission Channels › Channel ID** (`channel-id`: live, design, mobile, plan, shot, page, mark, grid, invert, apps).

### Designer steps for Angelino (Mission template)
The MCP can't write "Mission **equals Current Mission**" filters (probed: rejects every current-item value). In each list's settings › Filter › **Mission** · **Equals** · **Current Mission**:
1. Monitor › hidden `[data-channels-source]` list (Mission Channels)
2. Systems list (Mission Systems)
3. Problems solved list (Problems Solved)
4. Telemetry numbers list (Mission Stats)
5. Site data › `[data-pins-source]` list (Globe Pins)
Until these are set every mission page shows all missions' channels/systems/problems/stats.
Optional: Page settings › SEO title bound to *Name* (the script sets the tab title, crawlers see the static one); chip color binding for the stack (`[data-field=color]`, BG = Tools › Color); a fallback color map covers today's tools.

### Deviations (Mission)
- Next mission comes from the switcher order (510 → Aguirre → AB Identity → 510), not the *Next mission* reference field (same chain today).
- Crew dock is script-injected (build spec listed it as a component; it's body-level UI).
- Palette + type specimens are static Designer content shown only for `ab-identity`.
- Live demos: patched vendor copies (globe links use `data-globe-link` or the mission's live URL; the case map drops "Read full case" links via `window.__daMapNoLinks`).
- Coded scene mockups (figma/phone/flow/exploded/cms) are data in the bundle keyed by slug, not CMS; a channel whose mockup is missing shows "Mockup coming soon".

## Services template (built 2026-09-25, awaiting the rail Designer step + Angelino's OK)

Template page `6ab602e4e41add8af5e28b6c` (`/services/[slug]`). `page-wrapper` › [Nav] · `main-wrapper#top` › hero (`section_dbh`) · problems solved · what's included (light bento) · flight plan · related missions · under the hood · FAQ · next service · [Footer] · site data (Settings + Quotes). Build files: `webflow/build/services/` (`make.py` writes the section html/css and runs `prep.py`; `bind.py` turns a `get_all_elements` dump into the text + attribute binding operations from the `data-field` markers). Code: `ab-services` bundle + `ab-services.css` (template head `<link>`), v0.4.0.

| Section | CMS | Notes |
|---|---|---|
| Hero | current item: name (h1 + Discipline), summary, best for, slug, title 1/2 (hidden), planet type/colors/ring/glow (attributes) | h1 is bound to *Name* (SEO); the script splits it into *Title line 1* + outline *Title line 2*. Tools = Tools list, Pairs with = Services list (both resolve to the item's multi-refs), Related missions count from the script |
| Rail | Services list (sort asc), link to the template, `data-slug/planet/colors/ring/glow` bound | ⚠️ resolves to **Pairs with** until the Designer step below. Dot colors: per-slug map in the script (Color fields can't bind); optional hidden `[data-field=dot]` wins |
| Problems solved | solve 1–3 problem / heading / answer | empty solves are removed |
| What's included | deliverable 1–6 + description + icon (`data-sv-icon`, option name) | icons drawn by the script from the option; empty cells removed |
| Flight plan | stage 1–4 + description | line fill + ship scrubbed on scroll (≥992), stages light up as they scroll in (stacked) |
| Related missions | hidden Missions list (resolves to the item's *Related missions*) → slugs | cards are **cloned from `/work`** (same markup, tags, brand colors, cover image) and set up by `AB.missionCard` (moved into core from `ab-work`); fewer than 3 → a "Yours could be next/first" card |
| Under the hood | code label + code (hidden) | `AB.codeBlock` (moved into core); section removed when the service has no code (Branding) |
| FAQ | FAQ list (resolves to the item's *FAQ*) › FAQ item component, props bound | open/close from `ab-core` |
| Next service | next in rail order | `AB.nextCard`; falls back to the first paired service while the rail is Pairs with |

CMS change: Services › *WebGL + data* title 1/2 → "Interactive" / "3D + data" (was "Globes, maps" / "+ 3D"). Summary unchanged.

### Designer step for Angelino (Services template)
1. **Rail = all services**: select the Collection List inside `#svRail` (hero, under the meta row) › Settings › **Source** › pick the **Services** collection (not *Pairs with*). The API can't: any Services-sourced list on this template resolves to *Pairs with*, and `curatedItemIds` is refused ("only on lists connected directly to a collection"). Until then the rail shows the 2 paired services, the eyebrow reads "Service · <name>" without numbers, and Next service is a paired one.
2. Optional: rail dot colors from the CMS: in the rail item add a hidden div `[data-field=dot]` with Background color = *Rail dot color* (the script prefers it over its built-in map).

### MCP finding: multi-ref resolution on template pages
A Collection List on a CMS template whose source is collection X renders **only the current item's references** when the template's collection has a (single) MultiReference field to X, with no filter and the stored source still `{collectionId}`. Works for Tools, Missions, FAQ here (and Mission Types / Tools on the Mission template). A self-reference (Services › *Pairs with*) means a Services list can't list all services from the API.

### v0.4.0 (2026-09-25)
- New bundle `ab-services` (`code/src/services/`: service, sections, missions) + `ab-services.css`; registered `abservices`, applied with `set_page_scripts` (page had no custom code).
- Core: `36-missions.js` (`AB.missionCard`, `AB.markSVG`: covers, colors, number, status, link, from `ab-work`), `37-code.js` (`AB.codeBlock` + the single Copy handler, from `ab-mission`); `.cb` CSS moved to `ab-core.css`. Work + Mission re-tested on staging (6 cards/covers/links, 9 code blocks, monitor 5 channels, next card), no console errors.
- Tested on staging: webflow-development (4 tools, 2 pairs, 3 related incl. the Halcyon placeholder, 6 icons, 4 stages + ship, code block, 3 FAQ, next card, planet), branding (no hood, 2 related + "next" card), custom-deploys (0 related → "first"). No console errors. Motion not watched (pane hidden).

## Custom code, part 1 (2026-09-25): site-wide + Home

Source `code/src/` → `code/dist/` (`code/README.md` has the build/deploy steps). Live on staging: core JS/CSS, home, mission JS/CSS **v0.4.2**; work + services v0.4.0 (core JS + CSS, home, work, mission + mission CSS).

| What | Where in Webflow |
|---|---|
| `ab-core.prod.css` `<link>` + integrity | Site settings › Custom code › Head (freeform) |
| GSAP 3.13 + ScrollTrigger, Draggable, InertiaPlugin, SplitText, ScrambleText, Flip; Lenis 1.3.26; `ab-core.prod.js` | Registered hosted scripts, applied site-wide, footer, in that order (IDs `gsap`, `gsapscrolltrigger`, `gsapdraggable`, `gsapinertia`, `gsapsplittext`, `gsapscrambletext`, `gsapflip`, `lenis`, `abcore`) |
| `ab-home.prod.js` | Registered hosted script `abhome`, applied to Home, footer |

How the prototype code was re-pointed (per `webflow/build/home/class-map.md`):
- Settings + Quotes come from the hidden `[data-settings-source]` / `[data-quote-source]` lists (empty CMS fields keep the Designer text, e.g. the placeholder email).
- Script-only layers are **injected** by `ab-core` (nebula, starfield canvas, grain, warp flash, toast, layout grid, cursor HUD) and by `ab-home` (altitude meter), so pages don't carry them in the Designer.
- Board frames: the script sets `href="/work/<slug>"` (fixes the `detail_work` href), reads brand colors from the two hidden nodes' inline styles, auto-places frames (first three hand-placed), picks previews by slug (510 → globe, Aguirre → map, cover "Mark" → logo mark). Frames open with a warp, then navigate. `/work/<slug>` still 404s until the Mission template exists.
- Tools: color from the hidden `[data-field=color]` node, first 4 chips on the inner ring.
- Planner: validates (≥1 type, email), fills the three hidden fields, flies the rocket, then calls `requestSubmit()` so Webflow Forms posts it (Webflow's handler is delegated on `document`; the first pass stops propagation). Success is Webflow's `.w-form-done`; "Plot another mission" restores the form.
- Menu: toggles `.is-open` (+ `hidden`, `aria-expanded`), clip-path circle reveal.
- Anchors (`#work`, `/#launch`…) warp then jump through Lenis; `stopPropagation` keeps Webflow's own smooth-scroll out.

### Deviations / notes
- **Heading effect classes**: the spans in `#work-h`, `#cap-h`, `#log-h` (→ `t-outline`), `#orbit-h` (→ `t-orbit`), `#launch-h` (→ `t-stars`) have no class in Webflow, so `ab-home` adds them by heading ID. Cleaner later: add the class to each span in the Designer.
- **FAQ open/close** lives in `ab-core` (code-map said page-level) because Services uses it too.
- **Hero headline fit** lives in `ab-home` (code-map said site-wide): it sizes the Home `.w` word spans only.
- **Footer phone fix**: `ab-core.css` makes the last footer column span the row at ≤767 (the email button overflowed a half-width column at 390).
- **Lora** (serif title on the Aguirre frame) isn't a loaded font; it falls back to Georgia.
- The prototype's `.horizon` footer glow has no element in the Webflow footer, so that script was dropped.
- Quote order follows the CMS list (Houston first); the static fallback text is Tsiolkovsky. Set the Quotes list sort in the Designer if the order matters.
- The launch button starts `disabled` (`w-form-loading`) until Webflow's Turnstile check finishes: that's Webflow's bot protection, not the script.

### Testing (2026-09-25)
Staging at 1440 / 1024 / 390: no console errors, no horizontal overflow (after the footer fix), all 9 bento visuals built, process wide+pinned (1440/1024) / vertical (390), board canvas (desktop) / swipe deck (390), orbit, quotes, metrics, wordmark, menu open/close + scroll lock, FAQ, layout grid, planner flow (with the final submit stubbed, so no test entry in the Forms inbox). Reduced motion (JS path, via a `matchMedia` override on a copy of the staging HTML): no Lenis, no pin, no splits, everything visible, FAQ + process buttons work.
Not verified visually: the browser pane was hidden, which freezes `requestAnimationFrame` and IntersectionObserver, so lazy planets, the starfield and animation feel need a look in a real browser.

### Fix 2026-09-25: board tiles showed no text
The hidden `[data-field=brand-bg]` node was first bound to Brand *foreground*, then to **Next mission › Brand background** (the dropdown shows both as "Brand background"). Result: text the same color as the tile, then every tile wearing its next mission's color. Now bound to the Mission's own Brand background (fixed by Angelino, verified on staging). When binding colors inside a Collection List, pick the field from the **top group**, not a reference group.

### v0.1.3 (2026-09-25): globe pins in the mission accent
Board previews draw pins in the mission's Brand accent: 510 Visuals teal `#5eead4` (Aguirre map already used `#891E2D`). The value is a per-slug fallback in `code/src/home/10-work.js`; to make it CMS-driven, add a third hidden div `[data-field=brand-accent]` in the board item's `ab_cms-source` with Get BG Color → **Brand accent** (top group), and the script uses it. Only `ab-home` moved to v0.1.3; `ab-core` JS/CSS stay on v0.1.2.

### v0.1.4 (2026-09-25): Home review edits (Angelino's hp-edits doc)
- **Hero drag cue:** until a visitor drags something, the first headline word tugs and a "Drag me" hand chip appears (3 times, 10 s apart); remembered in `localStorage` `ab:dragged`.
- **Altitude meter:** label is a dark chip and the track is darker, so it reads on the light Services section.
- **Planner:** the flight-plan readout moved under the visual (script moves `#plRead`, class `is-below`), so it wraps instead of being cut off and no longer crowds Earth. Cleaner later: move `#plRead` below `.ab_planner_viz` in the Designer.
- **Tools orbit:** real brand logos (Simple Icons, CC0) for Figma, D3, GitHub, Three.js, GSAP, Webflow, Photoshop, Illustrator, Lightroom (`code/src/home/35-logos.js`, keyed by tool name); Client-First, Lenis, Unicorn Studio have no public logo there and keep the generic icon. **New Tools items:** Photoshop, Illustrator, Lightroom. The inner ring takes ~40% of the chips; the readout count follows the list.
- **Mobile:** hero giant planet starts at top 44px; the work deck swipes (frames had `touch-action:none`); footer feed planets scattered instead of an arc; text-selection boxes hide their name tag and the "Angelino" cursor sits under the word's end.
- **Dot field** follows the cursor more tightly (easing .14 → .32).
- **Brand accent:** hidden `[data-field=brand-accent]` node added to the board item by Angelino (BG = Brand accent); globe/map pins use it.
- **Copy (less map-focused):** hero lede, WebGL bento card (title "Interactive 3D, fed by the CMS"), footer brand line and footer service link "Interactive 3D + data". The Services CMS item for `webgl-data` still says "Globes, maps + 3D"; update it when the Services template is built.

### v0.2.0 / v0.2.1 (2026-09-25): Work page
- New bundle `ab-work` (`code/src/work/00-archive.js`), registered script `abwork`, applied to the Work page footer (the page had no custom-code block, so `add_page_script` 404'd; `set_page_scripts` created it).
- `ab-core`: next-card HUD/streaks/ship moved in as `core/38-next.js` (site-wide, `.ab_next-card`); metrics read `data-count` on enter, so page bundles can set it from the CMS.
- `ab-core.css`: debrief hero, archive bar states, mission card covers + status chip, list rows, next-card internals.
- **v0.2.0 shipped a broken `ab-core.css`**: a cleanup regex left an unclosed `@media (max-width:991px){@media (max-width:767px){`, which silently swallowed every rule after it (Work covers unstyled, and the reduced-motion block on every page). Fixed in v0.2.1, and `build.mjs` now fails the build on unbalanced braces.
- Tested on staging (1024 + 390): no console errors, no horizontal scroll, 6 cards with covers/numbers/links, placeholders toast, list/grid switch, sticky bar, Home unchanged (board, bento, metrics).

### v0.3.0 / v0.3.1 (2026-09-25): Mission template
- New bundle `ab-mission` (`code/src/mission/`: base, mocks, scenes, mission, monitor) + `ab-mission.css` (built by the generalized `css(name)` in `build.mjs`); vendor copies `code/vendor/510-globe.js`, `code/vendor/aguirre-case-map.js`, loaded from the same tag as the bundle (base derived from the bundle's own `<script src>`).
- Core: orbit system moved from `ab-home` to `core/35-orbit.js` (`AB.orbit(orbitEl, readoutEl)`, ≤3 chips ride one ring); next-card effect is `AB.nextCard(el)`.
- v0.3.1: scene mounting guarded (a channel without a mockup for this mission shows a note instead of throwing), switcher hrefs set to `/work/<slug>` (the list's page link rendered `/work`).
- jsDelivr sometimes 404s a brand-new tag for a few files; purge + re-check before registering (`purge.jsdelivr.net/gh/...`).

### v0.3.2 (2026-09-25): Mission review round 1 (Angelino)
- **Designer filters** (Mission = Current Mission) set by Angelino on all 5 lists, verified on staging: 510 5/6/5/4 + 10 pins, Aguirre 4→5/5/5/4 + 0 pins, AB Identity 4/3/4/3 + 0 pins. The MCP reads these filters back as `filters: []`; check the rendered page, not the settings.
- **Website missions share one monitor order:** Live · Design → build · Mobile · FigJam ideation (`flow`, channel id `plan`) · layered globe (`exploded`) or CMS input (`cms`). New Mission Channels item **Aguirre › Site plan** (sort 4, Case results moved to 5); its board is `MOCKS['daniel-aguirre-law'].flow` (Plan / Design / Build, copy from the mission's own brief). A new website mission needs the same five channels + the matching mocks.
- **Globe render** now uses `prototypes/img/510-globe-mesh.webp`: the current vendor globe shot headless at 1600 × 955 on its default view (pins/arcs off); overlay pins/arcs are the CMS pins projected with the same camera. Mock images load from the `v0.3.2` tag.
- **Manifest selection box**: `.ab_bento-card.is-mf > *{position:relative}` also caught `.sel` (collapsed to a 2px line); now `> :not(.sel)`.
- **Crew dock** hides once the last section with cadet/engineer copy (Problems solved) has scrolled past, returns on the way up; the level toast sits above the dock (`body.dock-on .ab_toast`).
- **Page transitions:** every same-site link to another page warps out (the Return-to-orbit effect) via a delegated click in `core/30-motion.js` → `AB.go(href)`; the next page arrives out of the warp (`sessionStorage ab:warp-in`). First-paint cover: registered inline head script `abwarpin` sets `html.ab-warp-in` (1.5 s failsafe) + `html.ab-warp-in body::after` in `ab-core.css`. Opt a link out with `data-no-warp`. Skips new-tab, modifier clicks, mailto/tel, downloads, same-page anchors (those keep their own warp).
- **v0.3.3:** status card (`.ab_mf_status`) was `overflow:hidden` to crop the radar, which clipped its selection box; the radar now crops itself (`clip-path`) and the card overflows.
- **v0.3.4:** page links no longer use `warp()` (it fades back out, so the old page showed again while the next one loaded). `AB.go` warps to a full cover (`#warpFlash` opacity 1) and holds; the next page starts fully covered (head cover + flash at 1) and fades in. Live: `ab-core` JS/CSS + `ab-mission.css` v0.3.4; `ab-home`/`ab-work`/`ab-mission` JS v0.3.2; `abwarpin` 0.3.2.

### v0.4.1 (2026-09-25): new AB logo
- `logo/ab-logo.svg` (AB monogram with a ringed planet) uploaded as asset `6ab6bba8167f1da71a4bf9a8`; the "AB" text in the **Nav** and **Footer** components' `.ab_nav_logo` links replaced by an Image (`.ab_logo-img`, 24px tall, the no-JS fallback). `.ab_nav_logo` is now `inline-flex`.
- `core/22-logo.js` inlines the SVG (3 paths: `lg-a`, `lg-planet`, `lg-b`) and hides the img: outline draws on (stroke-dash), fills, then an orange glow pulse; hover pulls A and B toward the planet (black-hole). Pure CSS keyframes (`ab-core.css` › logo), so a paused/hidden tab never leaves it invisible. Footer copy draws when scrolled into view; reduced motion = static glow. Frames: `logo/logo-animation-frames.png`.
- Favicon + webclip made from the logo on the site's dark bg: `logo/favicon-32.png`, `logo/webclip-256.png` (Site settings upload is a Designer step; the API can't).

### v0.4.2 (2026-09-25): warp-in logo + AB Identity on the new mark
- **Logo intro**: the outline warps in (scale .05 → 1 with a 720° spin, slight blur), then the pieces fill and the orange glow pulses. Hover = black-hole pull. Frames: `logo/logo-animation-frames.png`.
- **`core/21-mark.js`**: one source for the planet monogram, `AB.markSVG({ cls, grid, dims })` + `AB.MARK` paths. Construction (logo units 490.16 × 241.75, measured from the artwork): planet centered at 240,121 on the cap-height midline, r 98 around a 68 core, ring on a 21.5° axis. Preview: `logo/logo-construction.png`.
- The old orbit mark is gone everywhere: Work card cover "Mark" (grid + black-hole hover), Home board preview (AB Identity frame), AB Identity monitor channels (The mark: grid draws, mark warps in + fills + glows; Construction: with measurements; On light) and the Applications mockups (favicon tab, avatar, card, sticker).
- **CMS (AB Identity)**: summary, engineer objective, params line 1, manifest pages, channel captions (The mark, Construction), system "The orbit mark" → "The planet monogram" (slug `ab-identity-the-planet-monogram`, new copy + the real warp CSS as its snippet), problem "One mark from favicon to billboard" fix/result/engineer. Copy describes only the mark's geometry and what was built; Angelino to review wording.
- Live: core JS/CSS, home, mission JS/CSS v0.4.2; work + services v0.4.0.

### v0.4.3 – v0.4.5 (2026-09-25): AB Identity mission, round 2
- **Monitor**: two new coded channels first — **Sketches** (`channel-id` `sketch`: notebook page, pencil draws six iterations v01→v25, rejects crossed out, winner circled, "iterations: 25") and **Illustrator** (`vector`: coded Illustrator, sketch as template, pen tool traces the mark with anchors + handles, Pathfinder, token colors, Export for Screens). Order: Sketches, Illustrator, The mark, Construction, On light, Applications. The CMS *kind* option can't gain values via the API, so these items use kind `logo` and the **channel id** picks the scene (`30-mission.js`). Scenes live in `20-scenes.js` (`buildSketch`, `buildVector`); previews: `logo/identity-sketch-scene.png`, `logo/identity-illustrator-scene.png`.
- **Manifest**: 15 assets (planet monogram, sketch iterations, construction grid, lockups, color tokens, type roles, square buttons, selection UI, frame labels, starfield + nebula, procedural planets, warp transitions, black hole footer, favicon + avatar, cards + stickers) + 5 systems. Identity missions draw each tile from the site's design language (`ART` map in the manifest block; `.vx-*` in `ab-mission.css`) instead of page wireframes. Preview: `logo/identity-manifest-tiles.png`. The old `.vs-w i/b`, `.vs-t span/em` rules are now scoped so they don't hit the art.
- **Tools**: new Tools item **Pen + paper** (icon pen); AB Identity stack = Pen + paper, Photoshop, Illustrator; platform "Illustrator + Photoshop". Home tools list gained a second filter (Name ≠ "Pen + paper") so it stays off the Home orbit.
- **Stats**: iterations created 25 · oz of coffee along the way 128 · hours of endless tweaking ∞ (empty value + suffix "∞"). Core counter now keeps `data-suffix` and skips non-numbers; the mission script un-hides empty-bound numbers (`w-dyn-bind-empty`).
- **Logo**: glow pulse removed everywhere (nav, footer, monitor); intro is warp-in + fill only.
- **Selection boxes**: hovered/selected `[data-selectable]` gets z-index 8; `.ab_pal` / `.ab_typespec` rise on hover so token cards' boxes aren't covered by the type specimens.
- Live: core JS/CSS v0.4.4, mission JS v0.4.5 + CSS v0.4.4, home v0.4.2, work + services v0.4.0.

### v0.5.0 (2026-09-25): Knowledge System mission + site-wide hero toys + Home metrics
- **New mission `knowledge-system`** (#04, status In orbit, Types Content system · CMS · Development; placeholders renumbered 05–07; AB Identity › Next mission → Knowledge System → 510). Generic client throughout (`yoursite.com`, "Your Company"): no client names or facts. Plan + decisions: `docs/knowledge-system-plan.md`.
- **7 coded monitor scenes** in `code/src/mission/21-knowledge.js`: graph, library, voice, setup, video, schema, portable. CMS channels use kind `cms`; the **channel id** picks the scene (`30-mission.js` map). Registered through a new `SCENE.add(kind, fn)` hook + `SCENE.kit` helpers in `20-scenes.js`. The scene runner's `onSeek` rewinds silently, resets class state, then replays to the current time **with events** (seek() suppresses callbacks, so typed text stayed blank after a phase chip). Scene previews: the session harness (`shoot.py`: headless Chrome, `--virtual-time-budget`, transitions off).
- **System missions** (`isSystem` = Content system type without Website): own monitor/solved ledes, "System parts" heading, manifest title "The whole system", "parts" label and a `SART` tile set (`.kx-*` in `ab-mission.css`).
- CMS: new Tools item **Claude** (spark, #D97757; it now shows on the Home orbit too), Glossary AEO / JSON-LD / multi-reference / Finsweet, Services › Advanced CMS integrations › Related missions gains Knowledge System. Cover = `prototypes/img/ks-cover.webp` (graph scene still).
- Stats: 12 hours a month saved (Angelino's number) · 15 min Voice Kit · 4 schema types · 0 unapproved drafts.
- **Hero toys site-wide** (`core/39-herodrag.js`): on every `#hero` except Home, `.ab_dbh_word` lines (Work, Services) or the split words of a plain title (Mission) and the hero planet (`[data-drag]`, not parallax ones) drag inside the hero and spring back after 6 s. Runs on `setTimeout 0` after the page bundles.
- **Home metrics** (Angelino's numbers): 4,365 lines of custom code · 12 hours/month saved · 39 caffeinated drinks. `data-metric-icon="code|clock|cup"` on each `.ab_metric` → core draws a line icon that strokes in on scroll; the counter formats ≥1000 with a thousands separator.
- Live: core JS/CSS + mission JS/CSS **v0.5.0**; home v0.4.2, work + services v0.4.0 unchanged. Staging checked: 7 channels/7 systems/5 problems/4 stats on the mission (filters hold), Work shows 7 cards with the KS cover, Services related missions include it, no console errors.

### v0.5.1 – v0.5.2 (2026-09-25): orbit logos, Home board, hero drag fixes
- Stack orbit: real logos for **Webflow CMS** (Webflow mark), **Claude** (Simple Icons) and **Finsweet** (its {F mark, drawn by hand; not in Simple Icons) in `core/35-orbit.js`; mission-page color fallbacks for Webflow CMS #146EF5, Finsweet #161616, Claude #D97757, Pen + paper, Photoshop, Illustrator (`30-mission.js` TOOLC).
- **Knowledge System featured** on the Home board (Selected work, 4th frame): `home/10-work.js` draws a small knowledge-graph preview (`.ab_kg`, lines draw on a loop, static under reduced motion).
- v0.5.2: the page-hero H1 covered the hero planet, so the planet never got the drag. `.ab_dbh_title[data-drag-ready]{pointer-events:none}` with the word toys `pointer-events:auto`. Page heroes now get Home's "Drag me" cue (hand chip + first-word tug, 3 times, 10 s apart) under their own key `ab:toys`.
- Live: core JS/CSS **v0.5.2**, home + mission JS v0.5.1, mission CSS v0.5.0, work + services v0.4.0.

### 2026-09-25: Services rail = all services (done)
The old rail list was locked to *Pairs with* (Source shows a lock on a template list tied to a self-reference). Angelino added a new Collection List inside `#svRail` in the Designer and picked **Services** under *CMS Collections*; the MCP then moved the rail link into it (all 6 bindings survived: slug, planet type/colors/ring/glow, name), gave wrapper/list/item `ab_arc_chip-list`, sorted by `sort` ascending, and removed the old list. Verified on staging: 8 services numbered 01–08, eyebrow "Service 08 / 08", next service wraps to 01. Also: the 7 Services sections got Navigator display names (they showed as "Section").
Lesson: a Collection List can't be added inside another list, and an unconnected new list refuses children ("Connect this Collection List…"): pick the source first.

## About page (built 2026-09-25, awaiting Angelino's OK)

Page `6ab6d8aa86c563fd3f8b64a4` (`/about`, static; created as a duplicate of Work so Nav, Footer and the site-data block came along, then the Work sections were removed). `main-wrapper` › hero · mission statement · flight log · **Between launches** (light bento; renamed from "off-duty" by Angelino) · next mission, then Footer + site data. Build files: `webflow/build/about/` (`make.py` writes the section html/css and runs `prep.py`). Code: `ab-about` bundle + `ab-about.css` (page head `<link>`), v0.6.0. No CMS beyond Site Settings (availability).

| Section | Notes |
|---|---|
| Hero (`section_about-hero`) | reuses `ab_dbh_*`, `ab_crumb`, `ab_meta`. Crew badge = `ab_badge_*` (page-level, not a component). **Lanyard physics** (Angelino's ask): drag the badge anywhere, the strap (`[data-badge-lanyard]`) stretches from its anchor to the clip, and on release a damped pendulum + springy strap swing it back to hanging; a short press flips it; arrow keys push it; touch uses `pan-y` so vertical swipes still scroll. Badge logo = `AB.markSVG` (new monogram). |
| Pilot planet | Angelino's brief: orange, lots of rings, two moons for his wife and son. `.ab_planet.is-dbh.is-pilot` (gas, orange ramp, tilt 16) + 5 thin rings (`.pring.is-thin`) and two moons (`.ab_moon.is-wife` violet, `.is-son` green; pass behind the planet on the far side; "Moon · wife/son" tags on hover) built by `ab-about`. Big background planet (Angelino's call, v0.6.2): `left:44%`, `top:clamp(180px,21vw,320px)`, `width:clamp(200px,21vw,360px)`, z 1 behind the title + badge (tablet: right -30px / 240px; phone: right -40px / 170px). The hero grid passes pointers through its empty space (`ab-about.css`) so the planet can still be dragged there. |
| Mission statement | words split + scroll-lit by the script from the Designer paragraph (`.ab_ms_hl` spans = orange words); heart; signature SVG injected into `[data-about-sig]`; promises tick in (`.is-on`). |
| Flight log | `ab_tl_*`; even cards carry the `is-right` combo (no nth-child in the Designer); ship + icons injected; fill/ship scrubbed by ScrollTrigger. |
| Between launches | `ab_bento_grid is-about`; dark cards = `ab_bento-card is-dark` (combo with Color mode = Dark). Facts and philosophy questions are hidden Designer lists (`[data-about-facts] p[data-k]`, `[data-about-questions] p`); books carry `data-g/c/h/fg/note`. Shelf now has *Zarathustra* leaning out (Angelino is re-reading *Thus Spoke Zarathustra*; also on the badge back). |
| Next mission | the Next card instance was **unlinked on this page only** ("Need a pilot?", violet ringed planet); the component itself is unchanged. |

MCP notes this build:
- WHTML combo selectors must match the element's **whole class chain**: `.ab_planet.is-pilot` on an element with `ab_planet is-dbh is-pilot` created a stray `.is-pilot-parent.is-pilot` style (removed) and left the real chain empty.
- Gradients with `N% at` were mangled again (`60%at`); those backgrounds live in `ab-about.css`.
- `set_attributes` with `id` fails ("internal error"); use `set_dom_id`.
- A WHTML insert needs a single root element.
- Core fix: the footer black-hole game now looks up its black hole inside `#siteFoot` (About has a second one in the Interstellar card).

### v0.6.0 (2026-09-25)
- New `ab-about` (JS + CSS), core black-hole scoping, Home planner: budget scale `<$20k · $20–40k · $40–60k · $60–80k · $80–100k` (default $20–40k) and a **Complete knowledge system** add-on chip (own `Add-ons` hidden field, in the brief, the readout and the sent text; a small linked-node satellite orbits the destination). The script sets the scale/ticks and adds the chip + field when the Home embed lacks them; `webflow/build/home/planner-fields.embed.html` has the new markup for the next embed update.
- Live: core JS/CSS **v0.6.0**, home JS v0.6.0, about JS/CSS v0.6.0; mission v0.5.1/0.5.0, work + services v0.4.0 unchanged.
- Tested: local copy of staging with the dist builds (drag/swing/settle, docking at 1440/1024/390), then staging at 1440/1024/390: no console errors, no horizontal scroll, planner fields verified without submitting. IntersectionObserver reveals (promises, signature, clocks) are frozen in the hidden pane, so they were not seen running.

### v0.6.1 – v0.6.2 (2026-09-25): About review round 1
- Crew of three: hover used to swap `animation-duration`, which re-computes progress and made the orbits jump; now the script eases `playbackRate` 1 → 2.2 (Web Animations API).
- Pilot planet undocked and made big in the background (see the table above).
- **Bento spotlight + tilt site-wide**: new `core/32-cards.js` (`AB.cardFx`) binds every `.ab_bento-card` (Home 9, Mission manifest 7, Services "What's included" 6, About 6). The Home and Mission copies were removed; `[data-no-tilt]` keeps a card flat (About bookshelf). Services "What's included" had no spotlight before.
- Live: core JS/CSS, home, mission JS and about JS/CSS **v0.6.2**; mission CSS v0.5.0, work + services v0.4.0 unchanged. Staging: no console errors on Home, Mission, Services, About; planet checked at 1440 / 900 / 390.

## 404 page (built 2026-09-25, awaiting Angelino's OK)

Webflow 404 utility page `6ab6e4a645ff2d1bd12b1c3e` (not in the Data API page list: open it in the Designer and read `get_current_page`). `page-wrapper` › [Nav] · `main-wrapper` › `section_lost` (Navigator "Signal lost", `data-frame="signal-lost"`) · [Footer]. Build files: `webflow/build/404/` (`make.py` → `lost.html/css` → `prep.py`). Code: `ab-404` JS + CSS (page footer script `ab404` + page head `<link>`).

| Part | Notes |
|---|---|
| Top row | reuses `ab_dbh_top`, `ab_crumb*`, `ab_rec` + new combo `is-alert` (Status / Alert) |
| Big 404 | decorative `div.ab_lost_404[aria-hidden]` (digits + `ab_lost_zero` › ring + `.ab_planet.is-lost` + "Drag me" tag). The page h1 is "Lost in space" (`heading-style-h2`, `#lostTitle`); prototype had h1 = 404 |
| Astronaut | `ab_astro` › `[data-astro-art]` (SVG injected) + bubble + hint |
| Routes | `nav.ab_routes` › 4 `ab_route` links (`/`, `/work`, `/about`, `/#launch`), keys 1–4; fill/hover colors in `ab-404.css` |
| Telemetry | `aside.ab_lsig` › radar (`[data-radar]`, role button) + 2×2 `ab_lsig_cell` readout; radar KNOWN list = real slugs |

MCP findings:
- **Utility pages can't hold Collection Lists** ("Dynamic elements are not allowed in page"), so no site-data block. Core v0.7.0 caches Site Settings + Quotes in `localStorage` `ab:site` on every page that has the block; a page without it reads the cache, or fetches `/` once and parses the block (verified on staging with an empty cache: 5 quotes, availability from the CMS).
- Utility pages DO accept registered page scripts (`set_page_scripts`) and page head freeform code.
- `set_dom_id` on `main-wrapper` / the section fails with "[Conflict] … component map" (value-independent; the h1 id worked before the Nav/Footer instances were inserted). Nothing uses them here. Optional Designer step: main `#top`, section `#hero`.
- `insert_component_instance` works on the utility page; `data_element_builder` `after` a component instance errors ("Cannot insert elements directly into a component instance"): append to the parent instead.

### v0.7.0 – v0.7.1 (2026-09-25)
- New `ab-404` bundle. Core: site-data cache (above); **drag cue on every hero** via `AB.dragCue` (`core/39-herodrag.js`) with one key per hero type (`ab:toys:work|services|mission|about|404`; Home keeps `ab:dragged`), so dragging on one page no longer hides the cue on the others. Home's cue now uses the helper.
- v0.7.1: `.ab_lost_zero{z-index:2}` so the cue chip isn't hidden behind the second 4.
- Live: core JS/CSS + home JS **v0.7.0**, 404 JS v0.7.0 + CSS v0.7.1; about v0.6.2, mission v0.5.1/0.5.0, work + services v0.4.0 unchanged.
- Tested: local dist copy (1440/1024/390, reduced motion via matchMedia override, resize reset), then staging 1440/1024/390: no horizontal scroll, planet centered, radar finds the page on ping 3, no console errors other than the page's own 404 status. Per-hero cue verified: About shows it after Work was dragged; Work stays quiet.

## Process page (built 2026-09-25, approved by Angelino 2026-09-26)

Page `6ab701e2df00b2e38832af5b` (`/process`, static; duplicate of About, About sections removed). New page Angelino asked for: one route, eight destinations. Prototype `prototypes/process.html` (assembled from `prototypes/_parts/` by `_parts/assemble.py`). Build files `webflow/build/process/` (`make.py`, `form-fields.embed.html`). Code `ab-process` JS + CSS v0.8.0 (page footer script `abprocess` + head `<link>`).

| Section | Notes |
|---|---|
| Hero (`section_process-hero#hero`) | reuses `ab_dbh_*`, `ab_crumb`, `ab_rec` + new combo `ab_rec_dot.is-live`; planet `.ab_planet.is-dbh.is-process` (repainted to the picked destination); countdown `ab_count_*` (T−6 → T−0 as the route flies; the page's type moment); title stepped down in `ab-process.css` |
| Star chart (`#chart`) | planets + orbits script-built from the hidden **Services** list (`[data-dest-source]`, Navigator "Services · star chart source", inside the site-data block); panel `ab_chart_panel` with `[data-dest-*]` hooks |
| Route (`#route`) | 6 static `ab_route_wp` cards (Website legs as default text); path/ship/launch pad script-built; pinned sideways ≥768, vertical rail ≤767 |
| Crew roles | light section (`theme-light` + `ab_light-*`), ticks injected |
| Timeline (`#eta`) | 6 factors, options are Designer spans (`ab_eta_opt`) the script turns into buttons; gauge SVG injected; bucket copy in a hidden Designer list (`[data-eta-buckets]`). No numbers (Angelino: depends on scope) |
| FAQ | 6 **FAQ item component** instances with props (static, not CMS: the FAQ Scope option can't gain "Process" via the API) |
| Launch (`#launch`) | native Webflow Form, fields in an Embed (`form-fields.embed.html`): destination chips (script), Name, Email, Budget, Brief, hidden `Destination`. Success/fail text themed |

CMS (Services): new fields **Short name**, **Process leg 1–6**, **Timeline preset** (six 0–2 numbers), **Process example** (Reference → Missions; custom-deploys has none → "yours could be first"). Filled for all 8. IDs in `docs/webflow-cms-ids.json`. Reference sub-field text binding (`ref:::field`) used for the example slug/name.

Site-wide: Nav, mobile menu and Footer "Process" links → `/process` (stray duplicate `href` attributes removed). Home process section gained "See the full flight plan →" (`ab_process_more`).

MCP findings: `set_dom_id` fails with "[Conflict] … component map" on any page with component instances (hero re-inserted via WHTML with `id="hero"` instead; WHTML ids work). Rate limits (429) hit after ~50 writes in a row: pace the calls. Embed code key = `code`. Form success/fail inner divs don't take `set_text` (WHTML new text in, remove the default).

Designer steps for Angelino: rename the form (Form settings › Name, it's "Email Form"; the script doesn't depend on its ID). Optional: shorter crew section top spacing (inherits the light-section padding like About).

### v0.8.0 (2026-09-25)
- New `ab-process` bundle. Destination saved in `localStorage` `ab:dest` (restored silently). Core unchanged (v0.7.0).
- Tested: local copy of staging with the dist build at 1440 / 1024 / 390 (headless shots + DOM checks), re-plot for all fields, custom-deploys empty example, silent restore; then staging 1440 / 1024 / 390: no console errors, no horizontal scroll, nav links, Home link.

### v0.8.1 (2026-09-25): drag cue per visit
- Angelino: no drag cue on Home. The cue worked; his browser had `ab:dragged` in localStorage (set the first time he dragged on Home, back in v0.1.4), so it never showed again. `AB.dragCue` now remembers in **sessionStorage**: the cue shows on every hero each visit until something on that hero is dragged. Core JS v0.8.1 (CSS stays v0.7.0). Verified on staging with the old flag set.

### v0.8.2 (2026-09-25): Process phone rail
- Rocket sat ~10px right of the dashed rail on phones (rail center 11px, diamonds 10px, rocket 20px). Rail `left:9px`, rocket `left:-7px`: all on one 10px center line. Only `ab-process.css` changed (page head link v0.8.2); prototype source updated too. Verified on staging at 390.

### v0.9.0 (2026-09-25): mission stops + "not sure yet" budget
- **Process · stops** (Angelino: clients often need several services): main destination + up to 2 stops. Planet click still switches the main; "+ Add a stop" (panel) then a planet adds one; the form chips are multi-select (first = Main badge). Chart draws a dashed flight path sun → main → stops (inside the spinning layer), stops get numbered dashed boxes; the panel lists stops (service link, Main, ×). Route cards keep the main leg and add a compact line per stop. Timeline presets combine (highest per factor, scope +1 per extra stop). "Flown before" = main's example, else a stop's. Track grows to fit taller cards. Saved as `ab:dest` = comma list of slugs.
- **Process form**: 4th pick opens "+ More than three" → `More services` textarea; hidden field renamed **Destinations** (e.g. "Webflow development (main), Logo + brand identity"). Budget option "Not sure yet · still scouting". Embed source `webflow/build/process/form-fields.embed.html`.
- **Home planner**: "Not sure yet · still scouting" chip under the budget ticks (script-injected): overrides the slider (dimmed), dashed ghost ring, "orbit TBD" readout, `Budget` field + brief carry it; moving the slider turns it off. Styles in `ab-core.css`.
- Live: core CSS + ab-home + ab-process JS/CSS **v0.9.0**; core JS v0.8.1. Tested locally (all stop flows, max 3 + More, make main/remove, restore, track fit, planner chip) and on staging 1440/390, no console errors.

### v0.9.1 (2026-09-26): route cards never cut off on desktop
- Angelino: the pinned route cut off the bottom of the cards (1440×800: cards ended at 862px). The route now fits the viewport: the path band above the cards shrinks from 200px to 140px as needed (`CARD_TOP` computed in `layout()`, path/pad y values scale with it), and when even that isn't enough (short screens, cards with stops) the pin starts later (`start: 'top+=' + pinOver + ' top'`) so the heading slides up and the cards stay whole. Desktop top padding follows viewport height (`clamp(48px,8vh,120px)` ≥768 in `ab-process.css`). Desktop re-fits on height-only resizes too.
- Measured (card bottom / viewport): 1440×800 772/800 (heading fully visible), 1280×720 691/720, 1024×768 739/768, 1920×1080 unchanged (200px band), 1440×800 with 2 stops (489px cards) 772/800. Phones unchanged (vertical rail).
- Live: `ab-process` JS + CSS **v0.9.1** (core JS v0.8.1, core CSS + ab-home v0.9.0 unchanged). Staging verified at 1440 / 1024 / 390, no console errors, no horizontal scroll. Prototype `_parts/process-ix.js` not changed (still the fixed 200px band).
- Testing note: headless Chrome screenshots of this page come back blank (even with the rAF shim and `.ab_warp-flash` hidden); DOM measurements in the pane were used instead.

### v0.9.2 (2026-09-26): touchdown finale, bigger hero planet, launch frame
- **Touchdown** (Angelino: "something at the end after deploy… celebratory"): the route now ends at the mission's **main destination planet** (`.abp-dock`, repainted with the destination on every re-plot; stops orbit it as dashed moons in their colors). The last leg descends to it and the rocket stops at the surface; at the end of the pin: HUD "Touchdown", shockwave ring (CSS), 34 confetti bits in the mission colors + orange/white (GSAP, skipped for reduced motion), "Mission **live**" fades up, "Plan this mission →" (#launch) appears. Track width now ends with the last card on the left and the planet at 70% of the screen (`trackW` drives the pin distance so confetti can't change it). Phones: dock is a row after the last card (110px planet), lands when the rail ends.
- **Hero planet ~3×** (Designer combo `.ab_planet.is-dbh.is-process`): desktop `left 55% · top clamp(110px,9vw,150px) · width clamp(220px,25vw,400px) · z 1` (was 54% / clamp(170px,14vw,220px) / clamp(80px,8vw,130px) / z 5); phone `right -40px · top 64px · width 150px` (was -28 / 92 / 104). `.ab_count` z-index 2 (Designer) + `pointer-events:none` (ab-process.css) so the planet sits behind the countdown and stays draggable through it.
- **Launch form frame**: `.ab_launch_form` had overflow hidden, which clipped its selection frame (handles, name tag, size label). Overflow removed in the Designer; the submit rocket now flies up out of the card instead of being cut at its edge.
- Live: `ab-process` JS + CSS **v0.9.2**. Local test 1440 / 1024 (with 2 stops) / 390, then staging 1440 / 1024 / 390: no console errors, no horizontal scroll, landing + HUD verified. Build sources `webflow/build/process/hero.css` + `launch.css` synced. Prototype not updated.

### v0.9.3 (2026-09-26): hero planet draggable again
- Angelino: the hero planet stopped dragging after v0.9.2. Cause: `.ab_process-hero_grid` has z-index 4 and spans the hero; the old planet (z 5) sat above it, the new one (z 1, behind the countdown) sits under it. A z-index can't fix it (the countdown lives inside the grid), so pointer passthrough in `ab-process.css`: grid, `.ab_count` and the crumb/REC row (`.ab_dbh_top`, its links excepted) `pointer-events:none`; the copy column keeps it; on phones (where the copy column overlaps the planet) only its toys, buttons and links take it.
- Verified hit-testing 25/25 points on the planet at 1440 / 1024 / 390, title toys + crumb + both buttons still clickable, simulated drags move the planet on staging (mouse at 1440, touch at 390). No console errors. Lesson: lowering a draggable's z-index under a full-width text layer silently kills the drag; check `elementFromPoint` on it after any z change.

### v0.9.4 (2026-09-26): countdown frame on hover again
- Angelino: the Figma frame on the T−6 countdown (`data-selectable`, "Countdown / T-minus") was gone. v0.9.3's `pointer-events:none` on `.ab_count` meant `:hover` never fired. Fix: a hover proxy in `00-process.js` toggles `.ab_count.is-hover` while the pointer is inside its box (hover devices only, not while a button is held); CSS `.ab_count.is-hover>.sel` shows the frame. The planet stays draggable through it (drag verified from the overlap zone). Staging 1440: frame shows on hover, hides away, drag works, no console errors.
- Other selectable frames that pass the pointer through would need the same proxy; so far only this one.

## Site-wide tips (v0.10.0 – v0.10.2, 2026-09-26)

Angelino liked the Mission glossary popup and asked for more "on things you think would be nice… technical, funny or witty". Draft list approved as written ("i like them all").

- **CMS · Glossary** is now the single source: new fields **Kind** (Option: Term / Aside; empty = Term) and **Target** (PlainText CSS selector, asides only). +15 Terms (Webflow, WebGL, GSAP, Figma, Client-First, Variables, Component, Lighthouse, API, Handoff, Breakpoint, Lenis, Rive, Reduced motion, Discovery call), +16 Asides (nav cursors / availability / logo, Home coffee + lines metrics, planner "Not sure yet", footer black hole + Shift+G, Process T-minus / REC / Earth pad / touchdown, About Zarathustra badge line + pilot planet, 404 signal lost, Mission crew level). Finsweet definition generalized. 42 items. Edit/add tips in the CMS; no code change needed.
- **Hidden Glossary list** (`[data-glossary-source]`, fields `name/definition/kind/target` as `data-field` divs) added to the site-data block on Home, Work, About, Process, Services template; Mission template's existing list gained kind + target. 404 reads the `ab:site` cache (`g`), or fetches Home once.
- **Code**: `core/23-tips.js` (`AB.tip`: show/hide/link/refresh). Terms auto-link on the first mention per section, max one per paragraph, only in body copy (p, li, lede, `*_text/-text/_desc/-desc/_sum`), never in headings, links, buttons, forms, chips/tags, hidden sources or script-rewritten text (`data-leg`, `data-dest-*`, `data-bind`, `data-split`). Asides: hover (180ms delay), focus, tap on touch (not on links/buttons/draggables); targets with `pointer-events:none` (black hole, countdown) open by pointer position (planets: inner 30% circle). Asides show a ✦ and the selection blue; terms keep the orange. Mission's own tip code + `.gl` CSS removed (moved to core). Process: REC hoverable ≥768, touchdown planet takes the pointer.
- Crew-level aside text differs from the approved draft: the Mission "crew dock" is the Cadet/Engineer switch, not crew faces, so the line is "Cadet keeps it plain English. Engineer shows the wiring. Switch anytime, no clearance needed."
- Live: core JS + CSS **v0.10.2**, ab-mission JS + CSS **v0.10.0**, ab-process JS + CSS **v0.10.0**. Verified on staging: every aside on its page (Home 8, About 2 + logo, 404, Mission crew + terms, Process 4), term auto-links per page, phone tap open/close, planet drag intact, no horizontal scroll, no console errors (the only 404s were test URLs).
- Adding an aside later: CMS item with Kind = Aside, Target = a selector that exists on the page (check with `document.querySelector` in the console). Adding a term: Kind = Term (or empty); it links wherever the word appears in body copy.


## Services hub (built 2026-09-26, approved by Angelino 2026-09-26)

Page `6ab74df0ae2408ea9be939c7` (`/services`, static; duplicate of Process, Process sections removed; Webflow allows it next to the `/services/[slug]` template, both return 200). Prototype `prototypes/services-hub.html` ("Launch control"). Build files `webflow/build/hub/` (`make.py` → section html/css + `prep.py`; `bind.py` turns a `get_all_elements` dump into text/attribute/link bindings). Code `ab-hub` JS + CSS **v0.11.0** (page footer script `abhub` + head `<link>`).

| Section | Webflow | Script (ab-hub) |
|---|---|---|
| Hero (`section_hub-hero#hero`) | reuses `ab_dbh*`, `ab_crumb*`, `ab_rec` (+ `ab_rec_dot.is-live`), combos `.ab_dbh.is-hub` / `.ab_dbh_title.is-hub` / `.ab_dbh_sum.is-hub`, planet `.ab_planet.is-dbh.is-hub[data-hub-planet]`; diagnostics chips = Services Collection List (`solve-1-problem`, `data-slug`) + static "All clear" | chips → role=button, PRIORITY GO, hero planet repaint |
| Monitor | `.ab_mc.is-hub` › `.ab_mon.is-hub` (bar, `.ab_screen.is-hub` › `.ab_hub-scr` › Services Collection List of `.ab_hub-row` [name, summary (sr-only), Explore link], `.ab_mon_cap` prompt, `.ab_hub-slot`) + `.ab_console.is-hub` (keys box, telemetry `data-tele`) | phosphor cells + column heads, row buttons, Explore hrefs `/services/<slug>`, launch keys, peek planets, CRT decor, clock, typed prompt |
| Launch pass (`.ab_hub-print` › `article.ab_hub-pass`) | real elements with `data-pass` hooks, default = Webflow development | refilled per launch, print animation, glass tilt + glare, brackets, QR |
| Trajectory (`section_hub-map.theme-light#trajectory`) | head + step pills `.ab_hub-step`; empty `.ab_hub-map` + `aside.ab_hub-planner` | map (arcs = Pairs with, Earth, stations), planner state machine, launch |
| Flight plan (`section_hub-flight#flight`) | head (Edit / Abort buttons) + 6 stage cards `.ab_hub-wp` (Process copy); hidden until `.is-open` (ab-hub.css) | legs per stop, flown links, path/pad/ship/dock, pin + touchdown, warp in/out (`hb-warp`) |
| Crew logbook (`section_hub-log#patches`) | head + empty `.ab_hub-log` / `.ab_hub-log_ctl` | spreads, badges, page turns, controls; brand accents parsed from `/work` card markup (sessionStorage `ab:mission-accents`) |
| Final call (`section_hub-call`) | `.ab_mon.is-call` › `.ab_hub-call_row` + heading/copy/buttons | AB-09 cells typed in on view |

**Data (hidden lists in the site-data block):** Services source (from Process, Navigator "Services · hub + planner source") gained `best-for`, `solve-1-problem` and three **nested lists**: `[data-list=tools]` (Tools), `[data-list=pairs]` (Services = Pairs with), `[data-list=missions]` (Missions = Related missions). New lists: **Hub manifest** (`[data-manifest-source]`: service slug via `service:::slug`, `code`, `pair-notes`) and **Missions** (`[data-log-source]`, sort number asc: slug, number, name, client, status).

**CMS:** Services hit Webflow's **60-field cap**, so the launch code + pair "why" lines live in a new collection **Hub manifest** (`6ab74ea1e8e50b019e128d17`: Service (Reference), Launch code, Pair notes = `other-slug | sentence` per line), 8 items. Services › Related missions: Knowledge System added to Webflow development + Design systems (as in the approved prototype). IDs in `docs/webflow-cms-ids.json`.

**Core v0.11.0:** monitor decor (`.scan .vig .roll .brk .osd`, screws, REC dot, tabular numbers) moved from `ab-mission.css` to `ab-core.css`; `.ab_chip` states in core; nav hide-on-scroll hysteresis (`30-motion.js`). Mission CSS re-linked at v0.11.0 (decor removed there).

**Site-wide links:** Nav "Services", mobile menu Services, footer Navigate › Services → `/services`; footer Services column heading is now a link (`.ab_footer_heading.text-style-mono.is-link`).

**Glossary asides (approved as written):** Priority go (`.ab_hub-sym_label`), Launch manifest (`.ab_mon.is-hub .ab_mon_rec`), Abort mission (`.button.is-abort`), Custom charter (`.ab_hub-call_row`).

**MCP findings:** (1) A Collection List **nested inside a Collection item**, source `{collectionId: X}` only, renders the item's own multi-ref to X (Tools, Pairs with, Related missions all verified on the published page); the `{collectionId, fieldId}` form stays broken. (2) A static page can take the slug of a collection's URL folder (`/services` next to `/services/[slug]`). (3) `static_link {mode:"page", to:<template id>}` inside a list on a *static* page rendered `/services` (the static page), not `/services/<slug>`: the script sets the Explore hrefs. (4) WHTML trims a leading space in a span (" · 8 launches"); fixed in script. (5) Duplicating a page does **not** copy its custom code.

**Testing:** local-dist harness (staging HTML + local `dist`, `?shim`, `?hide=<css>` to bring lower sections to the top for headless shots since scrolled headless shots render blank, `?rm` reduced motion, `?fly=0,5,2&p=0.45`), then staging 1440 / 1024 / 390: no console errors, no horizontal scroll; arm/print, diagnostics, planner → launch → pin → abort, logbook turns, reduced motion; Mission monitor + Process regression clean.

## Contact page (built 2026-09-26, approved by Angelino 2026-09-26)

Page `6ab75d8abdfdf7aa5d9e7c2d` (`/contact`, static; duplicate of About, About sections removed). Prototype `prototypes/contact.html` (parts `prototypes/_parts/contact.*`), plan + divergence gate `docs/contact-plan.md`. Build files `webflow/build/contact/` (`make.py` → hero/others html+css → `prep.py`; `form-fields.embed.html`). Code `ab-contact` JS + CSS **v0.12.0** (page footer script `abcontact` + head `<link>`).

| Section | Webflow | Script (ab-contact) |
|---|---|---|
| Hero (`section_contact-hero#channel`) | reuses `ab_dbh*`, `ab_crumb*`, `ab_rec` (+ `is-live`), combos `.ab_dbh.is-contact`, `.ab_dbh_eyebrow.text-style-mono.is-contact`, `.ab_dbh_title.is-contact` ("Come" + outline "in"), `.ab_dbh_sum.is-contact`; `ab_ct-grid` (areas copy / side / form), `ab_ct-steps`; console `ab_ct-form[data-ct-form]` › head (CH + meter) + native **Webflow Form** (fields in an Embed) | dish + cliff + cone into `[data-ct-dish]`, signal line + packet into `[data-ct-scope]`, tuner band, station chips, meter bars, transmit, success toast, "Open another channel" |
| Stations | hidden Designer list `ab_ct-stations[data-ct-stations]` › 6 × `ab_ct-station` (`data-f` freq, `data-c` color, `data-v` Reason value; children `data-k` chip label, `data-l` message label, `data-ph` placeholder, `data-hint` hint html) | read on load; the whole page re-tints via `--ch` |
| Other channels (`section_contact-else.theme-light`) | `ab_ct-cells` (email = `button is-ghost is-email is-contact` + `data-copy-email`; Book a call = `[data-ct-station="1"]` → `#channel`; availability/tz `data-bind`; clock `[data-ct-clock]`; socials `ab_footer_link[data-social]`), scoping banner `ab_ct-route` (→ `/#launch`, `/process#launch`) | clock; Book a call tunes to 103.8 after core's anchor warp |

**Form:** fields Name, Email, Message, hidden **Reason** (station value). Success/fail are themed WHTML blocks (`ab_ct-sent*`, `ab_ct-fail`); the script validates, flies the packet, then `requestSubmit()` hands it to Webflow (same pattern as the Home planner). Webflow form name is still "Email Form" (MCP can't rename): Designer step.

**Links (split by intent, Angelino 2026-09-26):** Nav Contact, mobile menu Contact, Footer Navigate › Contact → Contact page (page link, `w--current`); Nav "Book a call", hub final-call "Book a call", hub flight-dock "Book a call" (`ab-hub` 30-flight.js) → `/contact#call`. Every "Plan a mission" / "Start a project" / "Plot the course" CTA and 404 route 4 stay on `/#launch`. `#call` also works as an in-page hash change (Book a call clicked while already on /contact).

**Glossary asides (approved as written):** Signal strength (`.ab_ct-meter`), Same desk (`.abc-go-n`), Voice channel (`[data-ct-station]`).

**Findings:** stray duplicate `href` attributes again on WHTML links and on the Nav/Footer component links (a leftover `href="/#launch"` attribute would override a new link setting: remove it with every repoint). `ab_dbh_word` is `display:block` site-wide; Contact sets it `inline-block` in `ab-contact.css` (one line on desktop; inline-block, not inline, so the hero drag transforms still work). Core styles the nav active state only with `.is-active` (same-page sections), so inner pages show no active marker though Webflow sets `w--current`: logged for step 8 QA.

**Testing:** local-dist harness (staging HTML + local `dist/ab-contact.*`, `?shim`), then staging 1440 / 1024 / 390: no console errors, no horizontal scroll; tuner (chips + drag snap), validation, meter, transmit (submit stubbed, no test entry), success + reset, `#call` on load and in-page, aside hover. Services hub + Home regression clean.

### v0.12.1 (2026-09-26): dish beam no longer clipped

The beam stopped at the dish SVG box on staging (fine in the prototype): Webflow's reset `svg:not(:root){overflow:hidden}` (0,1,1) beat `.abc-dish{overflow:visible}` (0,1,0). Now `.ab_ct-dish .abc-dish` / `.ab_ct-scope .abc-scope`. CSS link on the page → v0.12.1; JS stays on the registered 0.12.0 (only the banner differs).

## Step 8 QA fixes (v0.13.0, 2026-09-26)

Report + decisions: `docs/qa-report.md`. Live: `ab-core` JS + CSS, `ab-home`, `ab-about`, `ab-services`, `ab-hub` JS + CSS **v0.13.0** (others unchanged: work 0.4.0, mission 0.10.0 / CSS 0.11.0, process 0.10.0, 404 0.7.0, contact 0.12.0 / CSS 0.12.1).

- **a11y:** hero toy words `tabindex=-1` (they're `aria-hidden`; the planet stays keyboard-nudgeable) · footer `#wordmark` `role=img` · About statement: sr-only text (`.ab_sr` in core) instead of `aria-label` on a `<p>` · hub `[data-hub-call]` `role=img` · Services template related-missions grid `role=list` · hub Explore links min 24px on phones · Mission level switch (`.ab_switch_btn`, Designer attribute) `role=button` · nav: `.ab_nav_link.w--current` shows the active marker (inner pages).
- **CMS:** Services `webgl-data` Name → "Interactive 3D + data" (seed too). The Home bento kicker "WebGL + data" is static copy, left as approved.
- **Perf:** site head gained `preconnect` (jsDelivr) + `preload` of the Archivo woff2 (`webflow-files-prod...fastly.net/.../Archivo-Variable.woff2`; update it if the font asset is replaced) · Home bundle built with `split` (each module after `00-hero` runs as its own task via MessageChannel; later modules must not share top-level names) · planet idle float pauses off screen · bounce ticker reads Lenis velocity, no per-frame `scrollY` · Home easing card measures once and pauses off screen · starfield 1x canvas on touch devices.
- **MCP finding:** registered scripts accept only `data-*` attributes (`defer`/`async` → 400 `bad_request`). Deferring the bundles would mean loading them from freeform footer code instead of the registry (local A/B: FCP −0.7 s). Not done; offered to Angelino.
- Backups before the head/script writes: `webflow/backup/site-head.live-2026-09-26.bak`, `site-scripts.live-2026-09-26.json`.

### Deferred script loading (2026-09-26, Angelino's call after QA)

The script registry can't take `defer`, so every bundle moved to freeform footer code as `<script defer src integrity crossorigin>`:
**Site settings › Footer**: GSAP 3.13 (gsap, ScrollTrigger, Draggable, InertiaPlugin, SplitText, ScrambleTextPlugin, Flip) → Lenis 1.3.26 → `ab-core` v0.13.0. **Each page footer**: its bundle (Home/About/Services template/hub v0.13.0, Work 0.4.0, Process 0.10.0, Contact 0.12.0, 404 0.7.0, Mission template 0.10.0). Registry: only `abwarpin` (header). All page registered scripts cleared. Rendered order verified on staging: Webflow jQuery + webflow.js (sync) → 10 deferred scripts in order. Deploy procedure updated in `code/README.md` (no more `register_hosted_script`).

**Reverted the same day (Angelino: "everything through jsDelivr like before")**: back to registered scripts (site: GSAP ×7, Lenis, `abwarpin`, `abcore` 0.13.0; pages: their bundles at the current versions), freeform footers cleared. The v0.13.0 fixes stay. Verified on staging: 9 templates init core + page bundle + Lenis, no `defer` tags.

## Client removal via "Hide from site" (v0.14.0, 2026-09-26)

Angelino: hide Aguirre for now, and make any client removable easily. Runbook: `docs/remove-a-client.md`.
- **Unpublish doesn't work** for a mission: Webflow returns 409 while any published item references it (26 for Aguirre: channels, systems, stats, problems, 6 Services, 510's next mission). So the **Hide from site** switch is the control; its help text now says so.
- Made the switch reach everything: hub Missions logbook list filter `hide-from-site isOff` (MCP) · Process: new hidden list `[data-hidden-missions]` in the site-data block (Missions, filter `isOn`, slug `data-field="slug"`) and `ab-process` skips hidden examples · Home testimonials rebuilt as a Missions Collection List (sort `sort` asc, filters `hide-from-site isOff` + `quote isSet`; blockquote bound to Client quote, caption Text Block bound to Quote by; static figures removed; `home/05-quotes.js` drops empties and hides the section when none are left; list wrappers `display:contents` in core CSS) · Process route default links neutral ("See a mission like this →" /work) · 404 radar labels without missions. Services related missions and the mission switcher/next card were already covered (cloned from /work; filtered switcher).
- CMS: Aguirre `hide-from-site` on; Webflow development + Performance Process example → 510 Visuals; 510 next mission → AB Identity.
- Live: core JS 0.13.1 / CSS **0.14.0**, `ab-home`, `ab-process`, `ab-404` **0.14.0**. Verified on staging (11 pages after scripts): no visible Aguirre text or links, testimonials = 5 TEN only, Process examples = 510, `/work/daniel-aguirre-law` → `/work`.
