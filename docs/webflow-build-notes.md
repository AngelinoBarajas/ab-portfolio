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
