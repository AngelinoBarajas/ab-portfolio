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

## Mobile review batch 1: Home (v0.15.0, 2026-09-26, awaiting Angelino's OK)

- **Drag cue off screen on phones**: `AB.dragCue` (`core/39-herodrag.js`) anchored the tag at the end of the first title word, which on phones ends at the column edge. The tag is now clamped inside the host and viewport (8px gutter); its arrow follows the anchor via `--ax` (`ab-core.css` `.ab_drag-hint::after`). Site-wide, so every hero cue benefits.
- **Bento CTA row** (Webflow links, MCP `set_link` page links): See the work → Work page, How I work → Process page (All services was already `/services`). Start a project went to Contact briefly, then back to `#launch` (the Home planner) at Angelino's call, 2026-09-26.
- **Planner jumped while scrolling (phones)**: the address bar showing/hiding is a height-only `resize`. Home `fitHero` called `ScrollTrigger.refresh()` on every resize, and the Home process pin length was `innerHeight × 2.6`, so every toggle resized the pin spacer by ~2.6× the bar height and everything below it (the planner) jumped. Fix: `fitHero` ignores height-only resizes; the pin length uses a viewport height that only updates when the width changes on touch devices (`pinH` in `home/30-process.js`); core sets `ScrollTrigger.config({ ignoreMobileResize: true })`.
- Verified on staging at 375 (height 812 → 740: planner position, page height and pin end unchanged), 1024, 1440: no console errors, no horizontal scroll.

## Mobile review batch 2: Services hub (v0.16.0 / CSS v0.16.1, 2026-09-26, awaiting Angelino's OK)

All in `ab-hub` (JS 0.16.0, CSS 0.16.1); phones = `max-width:700px` unless noted.
- **Diagnostics chips**: a two-column grid of wrapping tiles instead of the sideways scroller; All clear spans both columns. Every option is visible at the top.
- **Launch pass visible on phones**: the side console (launch keys + telemetry) is hidden on phones; the manifest rows arm the same launches and the pass carries the telemetry. The pass now prints directly under the monitor's slot.
- **Planner no longer scrolls**: removed the auto-glide to the panel after the first main pick (it pulled readers off the map). The map hint on phones says "Next: tap a planet to add a stop".
- **Flight plan header**: `.ab_hub-flight_acts` wraps inside the column (Edit + Abort each full width); Abort was 440px on a 375 screen.
- **Touchdown (≤860)**: planet 140px, centered on screen (`left:-18px` offsets the rail padding); the "Mission live" block + buttons move out of the dock into the flow after it (`flayout`), so Book a call is no longer clipped by the section; 64px between planet and label so the stop moons clear it; landing fires when the planet's bottom reaches 75% of the viewport (`endTrigger` dock).
- **Flight resize**: on touch screens the route only rebuilds when the width changes (the address bar used to reset it mid-scroll).
- **Logbook on phones**: the page turn is back, top to bottom: the sheet hinges on the line between the stacked pages (`rotationX`; forward lifts the lower page, back drops the upper one). Replaces the sideways slide.
- **Final call**: the monitor spans the column, ON REQUEST lines up under AB-09, buttons stack full width with Book a call first.
- Verified on staging: 375 (all 8 items), 1024 + 1440 (wide route, rotateY page turn, console + chip row unchanged): no console errors, no horizontal scroll. jsDelivr served "file not found" for a few seconds after the v0.16.1 tag; retry before comparing SRI.

## Mobile review batch 3: Process + re-plot + logbook (v0.17.0 / v0.17.1, 2026-09-26, awaiting Angelino's OK)

Phones = `max-width:767px` in `ab-process.css`.
- **Hero countdown**: on phones the T−6 block moves above the title (`order:-1`) as a compact mission clock (78px number, meta stacked) beside the planet, instead of trailing the two CTAs.
- **Star chart**: planet size = `--s × --ps` (`.abp-dest` `--sz`); `--ps` .85 ≤767, .72 ≤479. Desktop 1.
- **Touchdown (phones)**: column layout, 150px planet centered on screen (`margin-left:-20px` offsets the rail padding), text + links centered; lands at `end: 'bottom 80%'` so the links are on screen when it lands.
- **Timeline gauge (phones)**: the grid becomes a flex column, the gauge moves first and sticks under the nav (`top:84px`) as a compact 2-column readout (dial · bucket title + 3-line text, adds below; note + tick labels hidden), so the needle is in view while tapping the dials.
- **Re-plot route** at every touchdown: Process dock link `#chart`, hub Mission live button `#trajectory`. Script-built links bind their own warp + jump (core only binds anchors present at load); the hub keeps the trajectory set.
- **Logbook turns (hub, all sizes)**: two-sided sheet. Front = a copy of the page being turned, back = the next mission's facing page, the page underneath is already the new one; nothing swaps mid-turn, no fade. `rotationY` on the spine (desktop), `rotationX` on the page line (phones, pages forced equal with `grid-template-rows:1fr 1fr`). 0.8s `power2.inOut`.
- Verified on staging 375 + 1440: no console errors, no horizontal scroll.

## Mobile review batch 4: About + Next cards (v0.18.0, 2026-09-26, awaiting Angelino's OK)

- **Badge hint** (phones): wraps and centers inside the screen; touch copy "Tap to flip · swipe sideways to swing".
- **Signature underline** (all sizes, mission statement + badge back): the path is sized to the rendered "Angelino" (`getComputedTextLength`, after fonts) and arcs up to the right; a shooting star (glowing head + short tail, `ab_sig-star` / `ab_sig-tail`) draws it 1.5s after the name writes itself.
- **Flight log icons** (phones): top-right corner, tag + title padded clear of it.
- **Interstellar**: the Endurance (12-module ring ship, SVG) orbits at the black hole's edge; "fly close" (hover / tap) pulls it in to the horizon and speeds its orbit (WAAPI `playbackRate`) while the near clock races. Hint: "Hover/Tap to fly the Endurance close · 1 hour there = 7 years here".
- **Philosophy**: a tap anywhere on the card asks the next question (links excepted).
- **Player one secret** (`about/10-boss.js`): LV 20 (or the Konami cheat) opens a full-screen pixel boss fight: The Scope Creep drops in, 10 shots drain its HP, it fires back three times, explodes; "You won" + win line; then a credits crawl (tilted via a wrapper: GSAP clears the individual `rotate` property on elements it animates). Skip ×, Esc, or a tap after the crawl closes it; the card then reads "Boss defeated · GG". Reduced motion: a still result + credits list. **Credits copy for Angelino's review** (in the file's `CREDITS` array).
- **Next cards** (core `38-next.js`, site-wide): when the planet sits close to the Go button (< 140px, e.g. phones), the rocket launches from under the button and skims the card's floor up to the planet; otherwise the old arc with its swing scaled to the distance.

## Mobile review batch 5: Contact, debriefs, service pages (v0.19.0 / v0.19.1, 2026-09-26, awaiting Angelino's OK)

- **Anchor landing (core, site-wide)**: arriving with a hash (`/#launch`, `/process#launch`) landed ~1,500px short because pins and late layout grow the page after the browser's jump. Core re-aims at 150ms / 900ms / 2s after load (ScrollTrigger refresh + `scrollToTarget`) unless the visitor has scrolled. Fixes Contact "Open the mission planner".
- **Contact**: the signal line (`[data-ct-scope]`) moves into the form under the tuner on phones (`.is-inform`, moved back ≥768); "See the flight plan" → Process page (was `/process#launch`, the form).
- **Debriefs**: crew dock hides while the mobile menu is open (core sets `html.menu-open`); channel selector on phones = an even row of keys (number + type), all on screen; P-03 fixed (param text in `.ab_param_t`, so a glossary tip button isn't its own grid cell); Cadet/Engineer toggle anchors the Solved/System card nearest the reading line (35%) and re-anchors after the ScrollTrigger refresh (the card stays put: measured 250 → 250 → 250).
- **Service pages**: the rail gets fading edges + a nudging → button (scrolls it; flips to ← at the end) in `.sv-rail-wrap`; the wrapper takes the rail's margins; the current service's chip is scrolled into view after wrapping (moving an element resets its scrollLeft). "What's included": tile 1 wears the service's planet colors (from its rail chip `data-colors`, with an orbit ring), tile 5 is dark.
- Verified on staging at 375: no console errors, no horizontal scroll.

## Follow-ups after batch 5 (v0.20.0 – v0.21.3, 2026-09-26, awaiting Angelino's OK)

- **Interstellar score** (About): flying close shows a round play button in the black hole's center (`.abx-score`; `ab_td_play` collided with an existing Designer class). It opens "Cornfield Chase" (Spotify track `6pWgRkpqVfxnj3WuIcJ7WP`, Angelino's pick) in a player docked bottom-left (`.ab_score`, Spotify iFrame API), seeking to 0:32 once playback starts. The player is built hidden on the first fly-close so the tap reaches it while it still counts as a user gesture. Browsers never allow sound without a tap; logged-out Spotify listeners get Spotify's preview.
- **Boss fight, cinematic + sound** (v0.21.0): letterbox bars, "Player one VS The Scope Creep" title card, camera pull-back + shake, the boss charges a beam (screen dims) and the ship barrel-rolls past it, slow motion (global timeScale .3) on the final shot, white-out explosion, fanfare. Sound is synthesized live (Web Audio: original battle loop, laser, hit, roar, charge, beam, boom, fanfare), toggle in the corner, off by default, remembered (`ab:boss-sound`). Skip restores timeScale and closes the audio context.
- **Service pages**: rail arrow + fades above the rail (the rail is z 4 in the Designer); standout tiles renamed `sv-planet` / `sv-ink` (`is-planet` collided with a Webflow combo that sets padding 0), light checkbox on the dark tiles.
- **Lesson**: script-made class names must be unique on this site: `is-planet` and `ab_td_play` both already existed as Designer classes and silently restyled the new elements. Prefix script-only classes (`abx-`, `sv-`, `hb-`).

## v0.21.4 – v0.22.0 (2026-09-26, awaiting Angelino's OK)

- **Interstellar play button**: bottom-right corner of the card on wide screens (≥1200); under the hint line below that (the corner overlapped the text at 1024).
- **Score actually plays**: logged-out Spotify listeners get a 19.8s preview; seeking to 0:32 jumped past its end and it stopped instantly. Now 0:32 only when the full track is available (duration > 42s), the preview plays from its start. Verified with a real click: position ticks 0 → 9.5s.
- **Boss credits**: tap anywhere closes from the moment "You won" shows (was only after the 22s crawl).
- **Bookshelf** now tilts like the other Between launches cards (the `data-no-tilt` exclusion is gone).
- **Mobile menu current page** (core CSS): the Contact link's orange combo (`is-contact`) is neutralized; the current page (`w--current`) is orange with a "You are here" tag. Desktop nav already marks `w--current`.

## v0.22.1 – v0.22.3 (2026-09-26)

- **Score stops when you leave**: the Spotify embed has no volume control (no fade possible), so leaving the card with the mouse pauses it and tucks the player away; scrolling the card off screen does the same on every device. Verified with a real click + hover-off: playing at 7.3s → paused at 7.6s.
- **Score is desktop only**: touch devices (`AB.coarse`) get no play button and no preloaded player (iPhone Safari often won't start another site's embed from a page tap; it played in phone-emulated Chrome but couldn't be verified on a real iPhone).
- **Menu "You are here"**: the tag replaces the current link's `/path` and the row wraps, so long names (Services) put it under the name instead of off screen.
- Publishing: Webflow returned 429 after several publishes within a few minutes; waiting ~1 minute and retrying worked.

## Side quests (v0.23.0, 2026-09-26, awaiting Angelino's OK)

- **Core `24-quests.js`** (`AB.quest('id')`): 16 easter eggs, logged per browser in `localStorage` `ab:quests`. A find toasts "✦ Side quest complete · Title · n/16" 2.4s after the egg's own toast; the first find adds "Side quests are logged on About › Player one"; 16/16 adds the gold-badge line. `AB.quest.list / has / count / reset`, event `ab:quest`.
- **Quests + where they fire**: boss (boss explodes) · konami (cheat) · badge (flip) · lanyard (drag release) · book (knock) · endurance (fly close) · escape (NEW: near the horizon, 5 taps on the black hole within 2.2s: the Endurance boosts out past the disk, `.ab_td_orbit.is-escape`) · spin (spin-drag) · questions (every philosophy question, wraps to Q1) · satellite (Home sat flies off) · toys (drag a hero word: Home + core herodrag) · blackhole (footer `consume`) · channels (every channel on one mission monitor) · diagnostics (hub chip) · touchdown (Process or hub landing) · aside (any ✦ aside opens). Titles/hints in `core/24-quests.js` (copy for Angelino's review).
- **Quest log** (`about/20-quests.js`): "✦ Quest log · n/16" under the Player one card copy opens a retro panel: progress bar, found quests with title ✓, unfound as "Unknown quest" + hint, "Reset the log". All 16: the crew badge turns gold (`.ab_badge.is-gold`) + panel message.
- **Aside twinkles** (core `23-tips.js`): every 5–10s a ✦ sparkles at a corner of one aside that's on screen (not in hidden tabs, not while a tip or the menu is open, not for reduced motion).
- Verified on staging 375: log 0 → 4/16 live (badge, book, endurance, escape), 16 rows, gold at 16/16, reset, 3 twinkles in 16s, hub diagnostics logs cross-page, no console errors.
- **v0.23.1**: Konami code by swipe on touch devices: on the Player one game screen (`[data-gm]`, `touch-action:none`), swipe ↑ ↑ ↓ ↓ ← → ← → then tap twice (B, A). Quest hint says so. Verified with synthetic touches at 375: LV 07 → 37, boss opens, quest logged. (Synthetic TouchEvents without `targetTouches` make Lenis throw in the test; real touches don't.)
- **v0.23.2**: Endurance thrusters fixed. The tap pulse scaled `.ab_td_orbit` with GSAP, which replaced its CSS rotation (the ship jumped around), and `.ab_td_orbit.is-escape .ab_td_ship` lost to the fly-close rule (`[data-td].is-close …`, higher specificity), so the escape never showed. Now each tap sets `--push` (ship climbs 9px per tap with an engine glow, `.is-thrust`), the 5th breaks free (escape rule now scoped to `[data-td]`), untouched taps sink back after 2.2s. Measured (transitions off): 65 → 74 → 83 → 92 → 101 → 205 (escape) → 65.
- **v0.23.3**: twinkles were hard to spot. Asides are sparse (Home: 6 in ~24,000px) and usually only the nav logo was on screen, so sparkles landed on a tiny nav corner (or empty space while the nav was hidden), small and pale on light sections. Now: gold ✦ 22px + two small companions with a dark outline and orange glow (readable on light and dark); content asides first: each twinkles as it scrolls into view (IntersectionObserver, once) and one on screen sparkles every 3-6s; nav asides only occasionally and only while the nav shows. Measured at 1440 on Home's metrics: 3 bursts in 11s, on the metric corners.
- **v0.23.4**: mobile cheat code hardened. Vertical swipes on the game screen could become a page scroll on a real phone (touch-action alone isn't reliable on iOS) and drop the swipe. Now a non-passive `touchmove` preventDefaults on `[data-gm]`, `touchcancel` still counts the swipe (last touchmove point), and the "Press start" line echoes the entry (↑ ↑ ↓ … B), "✗ try again" on a wrong swipe, "Cheat accepted" at the end. Verified at 375 with full touch sequences: echo correct, wrong swipe resets, boss opens, quest logged, no console errors.

### v0.23.5 (2026-09-26): Interstellar thrusters on touch

On phones a tap fires `pointerenter` then `pointerleave` before `click`; the leave handler removed `is-close`, so the black hole's thruster tap always saw the card as not close (and the card toggle flipped it back). Hover handlers now ignore `pointerType === "touch"`; touch uses the click toggle only. Verified on staging with simulated touch taps: thrust on tap 1, escape on tap 5, card tap flies back out. Registered `ababout` 0.23.5 (SRI checked), published webflow.io only.

### v0.24.0 / v0.24.1 (2026-09-26): playable boss fight + anime finisher

`about/10-boss.js`: after the VS card and entrance, the fight is a real-time game on `gsap.ticker`. Arrows or WASD fly, Space fires (held = auto-fire, 0.15 s cooldown); phones drag to fly (ship sits 80px above the finger) and fire while touching. The dialog takes focus (not the Skip button) so Space never skips. Boss: 100 HP, 2 per hit (v0.24.1; 3 made a perfect run ~5 s), drifts side to side, aimed shots, a telegraphed beam (0.95 s flicker, then 0.6 s live column), enrages at 50% (red/gold recolor via `rect[fill]` selectors, "Scope creep detected", 5-shot spread). Three shields with 1.5 s invulnerability; losing them shows "Mission failed", Enter/Space/tap retries. The last hit plays the finisher: freeze frame, speed lines, a diagonal anime cut-in of the pilot (SVG helmet, one sharp eye, visor planet, AB mark, パイロット / ANGELINO), camera push onto the ship with gathering sparks while the boss is dragged into line, 必殺技 · FINAL DEPLOY title, a mega beam, impact frames (silhouette / invert / silhouette), then the old explosion, "You won" and credits. New synth sounds: blip, hurt, shing, mega. Reduced motion keeps the still result + credits.

Testing: the pane stops delivering rAF when hidden; shim rAF onto setTimeout + `gsap.ticker.sleep(); gsap.ticker.wake();`, then drive it with synthetic keydown/keyup and PointerEvents (pointerType touch). For the finisher, serve `dist/ab-about.js` with `DMG = 34`.

## Knowledge System · the Observatory (built 2026-09-27, published to webflow.io, awaiting Angelino's review)

Plan + decisions: `docs/knowledge-integration-plan.md`. Prototypes: `prototypes/observatory.html`, `observation.html`, `topics.html`, `topic.html`, `ks-rows.html` (parts `_parts/ks*`). Build files: `webflow/build/knowledge/` (`make.py` → `prep.py`). Code: `ab-knowledge` JS + CSS **v0.25.5** (`code/src/knowledge/`, `code/src/ab-knowledge.css`), page footer script `abknowledge` + head `<link>` on 7 pages.

| Page | Webflow | Script (ab-knowledge) |
|---|---|---|
| `/observatory` (page `6ab88dfc86c563fd3fd8e914`, dup of Contact) | hero (`section_ks-hero`, `ab_dbh.is-ks`), observation log = native Collection List of Observatory (card link + code/theme/min/name/short answer bound; nested Topics tag list beside the card), browse-by-topic = Topics list (link + name/category/definition; nested Services + Missions refs), hidden Missions source | ask box, stats, theme tabs + topic chips + search (GSAP Flip), featured card, cards get tags moved in + hrefs fixed, topic index grouped into 6 constellations, JSON-LD Blog |
| `/topics` (page `6ab88dfdea14ac23bad4f6f3`) | hero, chart mount, vocabulary = Topics list (nested Services + Missions refs), hidden Missions + Observatory sources | star chart (SVG, hover/focus readout, touch = tap to read, tap again to open), **pan + zoom** (drag, pinch, Ctrl/⌘+wheel, dblclick, +/−/⟲, keys + − 0), JSON-LD DefinedTermSet. Chart hidden ≤767px (list only) |
| Observatory template `/observatory/[slug]` (`6ab88c3cea14ac23bad4586d`) | hero: code, theme, h1 = Name, reading time, short answer; **Rich Text = Body**; hidden: current topics, services, missions (resolve to the item's refs), all observations (nested topics w/ category) | title split into `.ab_dbh_word` halves (core hero toys keep them), chips, § headings + TOC + progress, `<pre><code>` → `AB.codeBlock`, sidebar with ringless planet icons, related reading (shared topics), prev/next, JSON-LD BlogPosting |
| Topics template `/topics/[slug]` (`6ab88c3ca4f6b80de4d1820d`) | hero: name, category, definition; sections practice/services/notes/questions/nearby (mounts); hidden: all topics (nested Missions refs), services (resolve to the topic's), missions, observations, FAQs (each with nested topic refs) | mini constellation, stats, mission cards with planets, service rows, cards, FAQ, nearby chips; empty sections hide; JSON-LD DefinedTerm + FAQPage |
| Mission template | new section `section_ks-row` above Next mission (`data-ks-row="mission"`): Filed under + Observations from this mission; hidden: Topics (= mission's), all observations (nested missions + topics) | row hides when empty (Aguirre) |
| Services template | new light section `section_ks-row` before Next service (`data-ks-row="service"`): Topics + Further reading; hidden: all topics (nested services), all observations (nested services + topics) | shows 3 + "All N observations" button |
| Home | new section Incoming signals before Contact: Observatory list, filter Featured on Home = on, limit 3, same card + nested tags | reveal |
| Nav / Footer components | Observatory link before Contact (desktop + mobile menu); Footer Navigate + Observatory, Star chart | — |

**CMS:** Topics (`6ab88c3ca4f6b80de4d18207`: category option, definition, services, **missions**, sort, meta) · Observatory (`6ab88c3cea14ac23bad45867`: code, theme, short-answer, body, topics, services, missions, reading-time, featured-on-home, sort, meta) · Missions + FAQ gained `topics`. Imported with `cms/import/knowledge_payloads.py` (approved drafts only). IDs in `docs/webflow-cms-ids.json`.

**MCP findings:** (1) **Nested Collection Lists show 5 items max** → 510 Visuals' 12 topics were cut to 5; the Topic › Missions mirror field is the source of truth for topic pages (keep both sides tagged). (2) A Collection List can't sit inside a Link Block (card tags live beside the card; script moves them in). (3) Links to a template from a static page that shares its folder slug (`/observatory`, `/topics`) render the static page URL; the script rewrites hrefs, Designer fix below. (4) A template with no content serves 404 (FAQ/Glossary templates still do). (5) Adding a multi-ref field later doesn't make an existing list on that template resolve to it (needed a nested list). (6) WHTML trims spaces around inline blocks (meta line, crumbs: CSS margins). (7) Rich Text field keeps `<pre><code data-lang>` from the API.

**Deviations:** visual styling of every `ab_ks-*` class lives in `ab-knowledge.css` (WHTML stubs only) so cards look plain in the Designer. Category tints are data colors. JSON-LD is emitted by the script from the page data (native template head versions are a Designer step).

### Designer steps for Angelino (Observatory)
1. **Crawlable card links**: `/observatory` › observation card Link Block → *Current Observation page*; `/observatory` + `/topics` topic index links → *Current Topic page* (today the HTML href is `/observatory` / `/topics`; the script fixes it for people).
2. **Template SEO**: Observatory template › SEO title `[Name] · Observatory · Angelino Barajas`, description `[Meta description]`; Topics template › `[Name] · Topics · Angelino Barajas`, `[Meta description]`. OG "same as SEO" + og-site image.
3. Optional: rename CMS field display names to Title Case (API created them lowercase).

### v0.25.4 – v0.25.5 (2026-09-27, Angelino review)
- Card hover scan: transform sweep on the compositor, always ends invisible (background-position sweep froze mid-card).
- Star chart: pans at any zoom (clamped so ~40% of the chart stays in frame), tiling grid pattern + background stars so the grid never ends; readout panel no longer resizes the frame (`contain:size` ≥992px, long titles ellipsized); legend = constellation chips that fly/zoom to a constellation and fade the others (click again or ⟲ to reset).
- Mission cards on topic pages: names wrap/fit (`overflow-wrap:anywhere`, smaller clamp).

### Designer steps session (2026-09-27)
- **A1 done**: the Designer link picker calls it *Type: Collection page › Page: Current Observation* (not "Current Observatory"). Setting it in the Designer made the `/observatory` cards render `/observatory/<slug>` in the raw HTML, even though the static page shares the template's folder slug. So MCP finding (3) is an MCP limitation, not a Webflow one.
- The Home *Incoming signals* list is a separate Collection List with its own `ab_ks-card` link: it still renders `/observatory` and needs the same fix (added as A1b).
- Mobile menu clipped **Observatory**: `.ab_menu_link` `clamp(40px,12vw,76px)` + a `/path` label makes 537px on a 343px content width; the menu is `overflow:hidden` and anchored to the bottom (`justify-content:flex-end`), so short screens also clip the top rows. Tested fix: `clamp(28px,9.4vw,76px)`, hide `.ab_menu_link-path` ≤479, `overflow-y:auto` + `justify-content:safe flex-end`; fits at 375×812 and 320×568 (scrolls 47px). Added as section N in designer-steps.
- **Section A done** (A1, A1b, A2, A3, A4, A5a–c, A6): every native Collection List link now renders its real `/<folder>/<slug>` href in the raw HTML (checked per slug on staging). Pattern: Settings › Link Block settings › *Type: Collection page* › *Page: Current <Item>*; this works even for lists on a static page that shares the template's folder slug, so the MCP's `static_link` was the only thing broken. The scripts' href rewrites are now redundant but harmless.
- Script-built links with no native element (Services related-mission cards cloned from `/work`, Mission Next card) need no Designer step: the clones inherit the fixed `/work` hrefs; the mission switcher (A6) gives each mission page crawlable links to every mission.
- **B1/B2 verified**: observation + topic pages render `<title>[Name] · Observatory|Topics · Angelino Barajas`, description = Meta description, og/twitter title + description copied.
- **Template OG image = CMS Image fields only.** On a Collection template the Designer's *Open Graph image* is a dropdown of the collection's Image fields; Observatory and Topics have none, so it's empty. Fix chosen: `<meta property="og:image" content="…og-site.jpg">` in each template's head field via `set_page_freeform_code` (a `<meta>` in a page head **was accepted** here, unlike the Aguirre 406). Backups: `webflow/backup/{observatory,topics}-template-head.live-2026-09-27.bak`.
- ⚠️ **A Designer Page-settings Save overwrites an API write to the same page's custom code.** The og:image write landed and read back, then Angelino saved B1/B2 in the already-open Page settings and both head fields reverted to the stale copy. Rule: write page custom code via the MCP only after the Designer is done with that page's settings (or have the Designer reloaded first), and re-read the field right before publishing.
- **5 new observations imported + published to webflow.io** (drafts 11–15, approved by Angelino 2026-09-27): WB-04 Plato's cave (`platos-cave-crawlers-raw-html`), WB-05 Ship of Theseus (`ship-of-theseus-brand-redesign`), WB-06 Amor fati (`amor-fati-webflow-limits`), WB-07 Descartes' doubt (`descartes-method-of-doubt-publish-then-check`), WB-08 Cartesian star chart (`cartesian-coordinates-star-chart`). Item IDs `6ab8b6c1d03fec1a12705b0d/0f/11/13/15`. Topic mappings in `cms/seed/_draft-topics.json` › `insight_topics` 11–15. Verified: 5× 200, template title + og:image, cards on `/observatory` with real hrefs, no console errors.
- Importer gotchas: `knowledge_payloads.py observatory` rebuilds **every** approved draft, so filter to the new `sort` numbers before `create_collection_items` or the first 10 get duplicated. The Short answer field is plain text: a short answer that starts with `*italics*` stays lowercase after the emphasis is stripped, and a Markdown link shows raw brackets. Keep links in the body.
- **B3/B4 verified** (7 missions: `[Name] · Mission debrief · Angelino Barajas`, Meta description, Social image as og:image; 8 services: `[Name] · Services · Angelino Barajas`, Summary). Placeholder missions without a Social image output `og:image content=""` (harmless while noindex). Tip: after a publish, wait ~20 s before checking or you read the previous version.
- **C1 robots**: `<meta name="robots" content="[Robots]">` live; `noindex` on Daniel Aguirre Law + the 3 placeholders only. Gotcha: "+ Add Field" inserts at the cursor. The first try put the chip in `name=`, so it published `name="noindex"`. Check the raw tag, not just "it saved".
- **`{{DOMAIN}}` can't go in Webflow custom code**: Webflow parses `{{ }}` as its variable syntax and publishes it empty (escape is `{\{ }}`). The Missions/Services template JSON-LD moved to launch (paste from `seo/jsonld/launch/` after `make_jsonld.py <domain>`).
- **Copy update (Angelino, 2026-09-27)**: Home hero lede → *I design and build websites people remember: interactive 3D driven by real data, motion you can grab, and field notes on the how and the why.* (general, no platform; "Webflow" stays in the meta line above the title). Footer brand line → *Webflow designer and developer building sites with gravity, and writing field notes on how they're built and why they work.* Home meta/OG → *Webflow sites with gravity: interactive 3D useful to clients and visitors, CMS-wired content, and build notes on the how and the why in the Observatory.* Verified on staging.

## CKS mission debrief · #05 (v0.26.0 – v0.26.1, 2026-09-27, published to webflow.io, awaiting Angelino's review)

The debrief of the getcks.io product site (v2, 8 pages, source `X:/Claude-Skills/case-study-sites/cks-src`). Separate from the Knowledge System debrief (#04), which explains the system itself.

- **CMS**: Missions › `cks` (#05, sort 5, status In orbit, live URL https://getcks.io, cover + social image rendered from the real hero). Placeholders renumbered 06–08. 8 Mission Channels, 6 Systems, 5 Problems, 4 Stats (slugs `cks-*`). New Tools: Hostinger, Canvas API. Services › missions: CKS added to CMS integrations, Design systems, Custom deploys (its first mission), Motion.
- **Test flight** (Angelino's ask: tag proofs of concept, space-themed): new Mission Type `test-flight` (Filter chip on) + Glossary Term. `core/36-missions.js` `AB.testFlight` turns the chip into a dashed badge with a rocket, adds a cover stamp on cards; `work/00-archive.js` badges the filter chip and leaves it out of the Disciplines count; `30-mission.js` keeps it out of the hero discipline count. kip should get it too when it lands.
- **Monitor** (8 channels): Style lab `cks-styles` · Design → build `design` (figma) · On a phone `mobile` (phone) · Site plan `plan` (flow) · Woven on scroll `cks-story` · Grow the map `cks-map` · Sketch tool `cks-sketch` · Publish once `cks-publish`. Channel ids starting `cks-` are their own scene kind (`30-mission.js`); CMS kind is `cms`.
- **Scenes** (`code/src/mission/22-cks.js`): ported from the site's own code (skins.json tokens, story.js frame(), graph.js ring layout + relax, sketch.js vocab + matching, publish-demo JSON-LD). All interactive: pick a site, step buttons + drag rail, hover/click/drag/search/grow-your-own on the map, sample switcher + step jumps in the sketch, topic chips + Publish replay. A visitor taking over holds the loop (`sc.hold`, play resumes). Fonts load from Google Fonts on first CKS scene; scenes rebuild once Schibsted Grotesk arrives (`SCENE.kit.rebuild`).
- **Live switch**: `MOCKS.cks.live` = base `https://getcks.io/`, probe `favicon.svg`. `30-mission` loads the favicon as an `<img>` (cached per session); once it answers, `40-monitor` shows the real `styles.html` / `sketch.html` in an iframe at 1280 wide scaled to the screen, with "Show the coded demo" to flip back; phones get an "Open the live site" link. Until then the hero status reads "Launching soon" and the live links stay hidden. **If the site deploys under `/cks/`** (build.py's SITE_BASE), change `base` in `10-mocks.js`.
- **On launch day**: nothing to deploy for the monitor. Flip Missions › CKS › Status to Live if you want the green Live chip.
- Test harness: session scratchpad `harness/make.py` (staging KS page → CKS channels + local dist, `shots.html?ch=N&t=T` for headless shots, `cks-live.html` points the probe at a local copy of the site).
- **v0.26.2 – v0.26.4 (same day, Angelino's review round 1):** mock fonts unquoted (a double-quoted family inside `style="..."` ended the attribute, so the figma + phone buttons wrapped). **Each debrief gets its own site plan, starting with CKS**: `cks-plan` scene (FigJam stickies on CKS paper, Plan / Design / Build lanes, four threads woven through the decisions, hover to trace, click to lift); the shared `flow` board stays for 510 + Aguirre until they get theirs. Copy rule: say "coded by hand after ideation and wireframes", never "generated" or "one Python script". **By the numbers = what it does for a prospect**, sourced from the CKS site itself (6 hrs drafting from the calculator's default example, 12 hrs/month self-editing claim, 15 min Voice Kit, 5 min sketch). Telemetry word units get a non-breaking space. **Figma is first in every real mission's stack** (ideation phase), added to 510, Aguirre, AB Identity, Knowledge System, CKS.
- **v0.26.5 – v0.26.6 (all debriefs):** manifest page tiles draw a tiny version of each page from its name (hero, grid, three price tiers, dated rows, form, steps, swatches, waveform, stickies…) in one of three looks per mission, set in `30-mission.js` `TSTYLE`: **build** (dashed wireframe fills with brand colors tile by tile: 510, Aguirre), **woven** (CKS paper + a thread seam stitched tile to tile), **blueprint** (fallback). Identity/system missions keep their art tiles. Status card = **orbit** (`orbitCard`): the mission's planet colors, a probe on a tilted orbit that passes behind the planet; `is-live` transmits signal rings, `is-shipped` is parked with a flag, anything else circles. Classes are `mfo-*` (a bare `.orb` collided with an existing site rule). Telemetry word units (hrs, min) render small beside the number (`.ab_tel_u`) with the bundle's own count-up.

### v0.27.0 – v0.27.1 (2026-09-27): form success without a jump, Shipped probe drifts
- **Forms (core `41-forms.js` + `ab-core.css` `.abx-*`)**: every native `.w-form` keeps its height on success. The submit (capture phase, also the scripts' `requestSubmit()` second pass) records the form height; when Webflow shows `.w-form-done` the block gets `min-height` = that height and inline `display:flex` (column, centered), so nothing below moves. Shared reveal: square orange beacon ping (`.abx-sig`), 1px orange scan line (`.abx-scan`), copy rises in (GSAP stagger); failures slide in under the form. Reduced motion: no ping/scan/stagger, lock kept. Home planner + Contact dropped their own stagger (Contact keeps its toast). Measured before: Process 783 → 313 (−470px), Home ~−560px; after: 0 on all three (live test on staging with the submit blocked at the wrapper, no entries sent, no console errors).
- Test trick: Webflow's form handler is delegated on `document` (`$(document).on('submit', '.w-form form')`), so a bubble-phase `preventDefault + stopPropagation` on the `.w-form` wrapper lets the form's own listeners run and never submits. Don't guard on `document` capture: it also blocks the form's listeners.
- **Forms renamed**: Process → *Launch Brief* (`wf-form-Launch-Brief`), Contact → *Contact Channel* (`wf-form-Contact-Channel`); nothing referenced the old `email-form` IDs.
- **Mission status card**: Shipped probe no longer parked; drifts at .2 rad/s (In orbit .6, Live .9), flag kept, reduced motion still parked (Angelino's call). ab-mission **v0.27.1** (the CKS session owns the line from v0.27.2).
- Live: core JS + CSS **0.27.0**, home **0.27.0**, contact **0.27.0**, mission **0.27.1** (order abmission, abknowledge). Backups `webflow/backup/*pre-v0.27.0*`.

### Mobile menu fit (2026-09-28) + core v0.27.2
- Problem: `.ab_menu_link` `clamp(40px,12vw,76px)` + `/path` label = 537px for OBSERVATORY on a 343px phone (clipped); the menu was `justify-content:flex-end; overflow:hidden`, so short screens also lost the top rows under the nav.
- Fix (Designer, Angelino): size `clamp(26px,9vw,76px)`; Tablet ↓ rows stack (word over `/slug`, gap 6px); `.is-open` combo gets Align Y Top + Overflow Auto; `ab_menu_tag` margin-top auto (the "safe flex-end" trick without code: bottom-anchored when it fits, scrolls from the top when not); `data-lenis-prevent` on `#mmenu`. Core **v0.27.2**: `@media (max-width:991px){.ab_menu_link.w--current::after{align-self:flex-start}}` so the pill sits under the word.
- Designer gotchas hit: an inherited `clamp()` font size displays as "0 PX" on smaller breakpoints; Flex "Justify" is labeled **Align Y** for a vertical flex; a Text Span greys out top/bottom margin until Display is Block; Flex controls only appear while Display is Flex (styling the `is-open` combo avoids toggling the base); remove the combo from the element afterwards (the script adds it).
- **Star chart on phones: decided no** (Angelino 2026-09-28). `/topics` keeps the list only at ≤767px (`.section_ks-chart{display:none}`).

### v0.27.3 – v0.27.4 (2026-09-28): service titles fit, card frames, rail arrow + fade, code blocks
- **Service names → Title Case** in the CMS (API, slugs unchanged): *Webflow Development, Interactive 3D + Data, Motion + Interaction, Logo + Brand Identity, Custom Deploys, Advanced CMS Integrations, Design Systems, Performance*. `<title>`, rail, hub, cards follow; hero lines come from Title line 1/2 (unchanged, uppercase in CSS). Short names (Website, CMS sync…) left as tags.
- **Footer Services column rebuilt** (G3): the old one was a Text Block of inline links (typing next to an inline link extends that link); duplicated the Navigate `nav` column instead → `nav[aria-label=services]` with 8 page links. Static links to CMS items warn "renaming this item's slug will break the link": keep service slugs stable.
- **Services hero title fit** (ab-services **v0.27.3**, `00-service.js`): each title line stays one line (`white-space:nowrap`, `max-width:none`) and shrinks only if wider than the room from the title's left edge to `.container-large`'s right edge (×.98). Refits on `fonts.ready` and resize. Before: DEVELOPMENT ran 241px off at 1640 / 146px on a phone; *Interactive* 90px off on a phone; *Content that* / *Heavy visuals,* wrapped into 3–4 lines. Verified all 8 at 320–1640.
- **G10 / card frame**: Webflow kept publishing `.ab_sv_s{overflow:hidden}` although the Designer showed Visible (no custom property); code override `.ab_sv_solve .ab_sv_s{overflow:visible}` so the `.sel` frame (inset −1px, handles −5px) isn't clipped.
- **Rail arrow + fade** (ab-services **v0.27.4**): arrow = 38px square chip pinned `top:2px` to the chip row (was a 34px circle 2px off-center); rail `padding-right:46px` while scrollable so the last chip clears it (8px gap at the end). Fade = `mask-image` on the rail (`--fl` 32px once scrolled, `--fr` 88px while more to see) instead of a `var(--void)` overlay that read as a hard black bar over the starfield (desktop + phone).
- **Code blocks in Observatory articles** (ab-core CSS **v0.27.4**): Webflow's `.w-richtext figure{max-width:60%}` capped `figure.cb` (473 of 789px desktop, 203 of 339 phone); `.w-richtext figure.cb{max-width:none;width:100%}`.
- Live: core CSS **0.27.4** (JS 0.27.0), services JS **0.27.3** + CSS **0.27.4**. Backups `webflow/backup/*pre-v0.27.{3,4}*`. Design hook: `.t-stars` starfield text effect ignored as gradient-text (brand effect).

### v0.27.5 · Observatory hero title fits phones (2026-09-28, kip session, verified on staging)
- **Bug (Angelino):** on phones the hero word OBSERVATORY ran off the right edge. It is ~9.2em wide, and the Designer's 46px floor on `.ab_dbh_title` made it 424px in a 288–398px column (clipped by `section_ks-hero` `overflow-x:clip`).
- **Fix:** `ab-knowledge.css`: `@media (max-width:479px){.ab_dbh.is-ks .ab_dbh_title.is-ks{font-size:min(46px,calc((100vw - 2rem) / 9.5))}}` (30px at 320, 37.7px at 390, 46px from 480 up). Scoped to the Observatory wrapper (`ab_dbh is-ks`), so `/topics` (`is-ks-chart`, "Star chart" already fits) stays at 46px.
- **Shipped on `/observatory` only:** page head `<link>` → ab-knowledge.prod.css **v0.27.5** (SRI checked against the CDN). The other 6 pages still load v0.25.5; the only difference is this rule, which matches nothing on them. Backup: `webflow/backup/observatory-head.live-2026-09-28.bak`. Written via the API: reload the Designer before saving that page's settings.
- Verified on webflow.io at 320/375/390/430/479/768/1440: word fits its column, no sideways scroll, no console errors.

### v0.27.6 – v0.27.9 · Observatory phone fixes (2026-09-28, kip session, all verified on webflow.io)
- **v0.27.6 CSS, record line** (dot · Observatory · 15 observations · 27 topics): one ~359px flex row; below 480 the pieces squashed, broke mid-piece and ran off. ≤479: `font-size:min(12px,calc((100vw - 2rem - 24px) / 29))`, `letter-spacing:.1em`, `white-space:nowrap` → one line at 320–479 (9.1px at 320, 11.5px at 390).
- **v0.27.7 JS, topic + article titles**: at the Designer's 48px, 8–15 of the 42 topic/article titles overflowed on phones ("performance" 458px in a 358px column). `fitTitle()` in `knowledge/00-data.js` (called from `20-article.js` / `40-topic.js` after the halves split) shrinks a half only when its longest unbreakable piece (split at spaces and after hyphens) is wider than the column; others keep 48px. Re-fits after fonts load and on resize. Checked all 42 pages at 320/390/430: 0 overflow, smallest 29px.
- **v0.27.8 JS, filter stutter**: Flip `absolute:true` lifted every card out of flow, so `.ab_ks-grid` read 0px for the whole tween and `section_ks-browse` jumped up, then snapped back. `apply()` now captures state, finishes any running flip (`Flip.killFlipsOf(items, true)`) and tweens the list from its old height to the new one (`clearProps:'height'`). Measured: 2292 → 724px eased, no 0-height frame, double clicks included.
- **v0.27.9 CSS, theme tabs**: All · Build notes · Why before how need ~391px; on phones the third wrapped and left an empty bordered gap. ≤479: full-width flex row, tabs share it, `font-size:min(12px,calc((100vw - 2rem) / 30))`.
- **Where it's loaded:** `/observatory` head `<link>` ab-knowledge.prod.css **v0.27.9**; `abknowledge` script **0.27.8** on `/observatory`, the Topics template and the Observatory template. `/topics` + the other Knowledge pages still load v0.25.5 CSS/JS (nothing in these changes applies to them). Written via the API: reload the Designer before saving those pages' settings.

## kip mission debrief · #06 (v0.28.0 – v0.28.2, 2026-09-28, published to webflow.io, awaiting Angelino's review)

The debrief of the kip concept site (v2, 12 pages, source `X:/Claude-Skills/kip-site/kip-src`, upload copy `../kip`; no live URL yet).

- **CMS**: Missions › `kip` (item `6aba889079ae9bdb448a106d`, #06, sort 6, In orbit, Test flight, cover + social image imported from jsDelivr URLs). Placeholders renumbered 07–09. CKS › Next mission → kip; kip → 510 Visuals. New field **Missions › Benefits** (plain text, one per line; `benefits`). New Tool **SVG**. Services › missions: kip added to Branding, Motion, Custom deploys (not Interactive 3D: kip has no 3D). 8 Channels, 6 Systems, 5 Problems, 4 Stats (slugs `kip-*`).
- **Monitor (8)**: Try it, as anyone `try` · One Tuesday `story` · Design → build `design` (figma, `MOCKS.kip.els`) · Shift handoff `mobile` (phone, `MOCKS.kip.mobile`, copy from the app tour's Today + Handoff screens) · 3am mode `night` (mobile) · Roles `roles` · Report `report` · The village `cast`.
- **Loops from the repo, not the CMS**: `MOCKS.kip.img` maps channel id → [loop, still] on jsDelivr `@v0.28.0/prototypes/img/` (Webflow can't flatten them). `30-mission.js` fills `c.src` from it when the CMS image is empty; reduced motion or Save-Data shows the still. Loops are labeled **LOOP · recorded from the site** / source **Recording** (`c.loop`). Recorded with Playwright + Chrome screencast (orange cursor, 15 fps, last 0.5 s fades into frame 0, WebP ≤ 3.9 MB + MP4); stills taken in a second pass with the cursor hidden.
- **Other code**: `mock.fontCss` (a mission's mock scenes can load their own Google Fonts; kip: Baloo 2 + Nunito Sans). `isLogo` now requires no Website/App type (kip is branded but a site + app; only AB Identity keeps the identity wording). Mobile-kind channels center their phone (inline style + `.view.mobile` CSS for the next stylesheet release). `TSTYLE.kip` build look (cream/ink/tangerine).
- **Figma comment** is the real v2 fix: the sample log's Tylenol dose read like dosing advice → vitamin D, as directed.
- **Copy (Angelino, 2026-09-28)**: summary, cadet objective and meta rewritten as a product pitch (the rotation of caregivers, the ambition), still labeled a concept; no invented numbers.
- Verified at 1440 + 390: all 8 channels load (loops 1600×1000 / 468×1012), both coded scenes run, no console errors; 510 / AB Identity / Knowledge System / CKS unchanged; kip on /work, the switcher, CKS next card and its three service pages; title, description, og:image, no robots.

### Same session, later (2026-09-28): order, placeholders, board, quotes, email
- **Mission order** (Angelino): 510 Visuals 01 → CKS 02 → kip 03 → Knowledge System 04 → AB Identity 05 (number + sort), Next mission chained in that order, AB Identity → 510. Daniel Aguirre Law 06 (hidden). Placeholders hidden (**Hide from site** on, 07–09).
- **Home board**: CKS + kip now **Featured on homepage** (all five on the board). ab-home **v0.28.3** draws their frames (CKS woven mark; kip's Ari, Nana, Rosa from the press-kit SVGs).
- **510 card image**: the 510visuals.com homepage globe section ("From Brooklyn to the World"), captured with Playwright (wheel-scroll into place: the site's pinned sections make scrollTo land elsewhere), `prototypes/img/510-globe-cover.webp`.
- **Testimonials**: placeholder quotes (bylines end in "(placeholder)") on 510, CKS, kip, Knowledge System so Incoming shows four cards. **Replace or clear before launch.**
- **Email**: Site settings › Email = angelino@barajasdsgn.com; every `[data-bind="email"]` (menu, footer, contact) fills from it. The Designer fallback text in those elements still reads hello@[your-domain] in the raw HTML.
- **Statement planet (Designer step, not done)**: tested by injection, values for `.ab_planet.is-statement`: base width `clamp(150px,27vw,410px)`, right `calc(clamp(150px,27vw,410px) * .62)`, top `14%`; Mobile landscape and below: width `clamp(200px,52vw,330px)`, right `-8vw`, top `3%`.
- **CKS copy** (Angelino, same day): summary, cadet objective and meta rewritten around what the product does (one vocabulary connects the site; Voice Kit, nothing published without approval); Engineer objective unchanged.
- **ab-home v0.28.4**: board frames animate: CKS = a mini version of the getcks.io hero loom (ported from `cks-src/js/cks.js`, veiled so the text stays crisp); kip = tangerine `#E85F2A`, white text, Sam/Nana/Rosa hopping (Web Animations, staggered); both pause off screen / hidden tab, still under reduced motion; on the phone deck the faces center and scale 1.3.
- **ab-home v0.28.5**: Home "What I build" bento gets a colorful **Observatory** card (gradient blue → violet → signal, animated six-constellation star chart, chip flips Build notes / Why before how, hover lights every constellation) placed after Custom deploys; the Marks card drops to one row so every row stays full. Script-built for now; Designer step H6 makes it native.

## Services depth · Flight computer + fixes + layout grid (v0.28.6 – v0.28.12, 2026-09-28, published to webflow.io, awaiting Angelino's review of the animations)

Plan: Angelino's two ideas (spacecraft name + more oomph for "Under the hood"; more code + visuals/animations like the Home bento) became one section, **Flight computer**. Prototyped on staging copies for 3 services (`prototypes/fc/`, served by the `ab-proto` launch entry, port 4420), design approved; the last 5 went straight to Webflow at his call.

**Flight computer** (`code/src/services/30-flight.js`, own IIFE because an early `return` would end the whole ab-services bundle; CSS appended to `ab-services.css`):

| Part | How |
|---|---|
| Console | `.fc` › head (eyebrow, H2, lede, chip hints, channel tabs) + `.fc-mon` (bar: REC, `AB-0N · CODE · Flight computer`, state lamp, timecode) › `.fc-body` (`.fc-code` bordered panel + `.fc-view` with core `.scan .vig .roll .brk .osd`) › `.fc-foot` (Run, note chip, tools) |
| Notes | trailing `// @key text`, `/* @key text */`, `<!-- @key text -->` in the snippet; stripped from display + Copy; `fc.cue(key)` lights the line and shows the note; hover/focus a marked line to read it |
| Programs | `P.<name> = { label, cap, code (string or fn(fc)), tools, edit/editLine, flow, build(stage, fc) → { reset, play → gsap timeline, redraw?, act? } }`; `BY_SLUG` maps service → programs; `fc.run` re-runs after an in-viewport edit |
| Per service | motion: reveal + ease · webgl-data: pins · design-systems: tokens · webflow-development: struct · custom-deploys: deploy · cms-integrations: sync · performance: lazy · branding: brand |
| Boot | IntersectionObserver (35%) → code types in → runs once; Run replays; reduced motion jumps to the end state |
| Phones | `flow: true` programs get `.fc-stage.is-flow` (in-flow stage that grows) below 768px |
| Branding | no CMS Code → `10-sections` now keeps `#hood` when GSAP is present (`if (!hasGsap) sec.remove()`) |

The code shown is each program's own annotated copy, not the CMS Code field (the CMS text has no `@` notes). Content rule kept: demo data only (cities, space-probe file names, "yourbrand.com"), no client claims.

**Fixes v0.28.6** (core + mission): (1) kip mock `H = "'Baloo 2',…"`: an unquoted family with a bare number is invalid CSS, so the whole `font` shorthand was dropped (headline rendered as body text). (2) Footer email label lowercase + `.ab_footer_grid` last column `minmax(290px,1.5fr)` at 992–1439px: uppercase + tracking made it wider than its column at every width, clipping "Copy". (3) `.ab_light-bg` dot field: the ResizeObserver only re-clipped; now it also re-measures the canvas (early return when unchanged). Sections that fill after load (Observatory row) stretched the canvas ~1.7× and offset the cursor ring. (4) Warp arrival with a hash: `10-space` arrive() holds `#warpFlash` until `AB.arrived()` (called by the 30-motion re-aim) or 1.8 s; the fade used to reveal the page short of the target (About › Need a pilot showed the Home testimonials).

**Layout grid** (v0.28.10–12): `.ab_lgrid` padding = gutter, `.ab_lgrid-inner` max width only (was max width *including* the gutter: columns ~33px inside the content at 1440); column gap 24 → 16px. Card rows set to a 16px column gap: Webflow classes `ab_sv_plan` (18), `ab_arc_grid` (20), `ab_quotes` (20) via `update_style` (row gaps unchanged); `div.ab_ks-grid{column-gap:16px}` in ab-core.css (ab-knowledge.css is pinned per page, v0.25.5 on most, and the Missions template head can't be rewritten by API). Toast built from computed values: "12 columns · 16px gap · 48px margins · 1360px max". Audit (14 page types, looking through `display:contents` list wrappers): card rows 0px off. Not changed on purpose: gapless strips (`ab_meta`, `ab_tel-grid`, `ab_metrics`, `ab_ks-cats`, `ab_ks-tstats`, `ab_ct-cells`) and 2-column splits (`ab_brief`, `ab_contact_grid`, `ab_crew_grid`, `ab_process_panel`, ...).

**Deploy notes:** registered ABCore 0.28.6 / 0.28.12, ABMission 0.28.6, ABServices 0.28.8 / 0.28.9; site head + Services template head `<link>`s rewritten after reading them (backups in `backups/`). v0.28.7 is a stray tag (a failed command chain tagged the docs commit). jsDelivr cached a 404 for a file requested before its tag existed: purge it. Testing: local harness = staging HTML + local dist (strip `integrity` on swapped tags; it precedes `src`), headless Chrome `--virtual-time-budget` + a probe that clicks Run and advances `gsap.globalTimeline.time()`; headless stops rendering frames after load, so ResizeObserver/rAF behavior after load can't be tested there.

## v0.29 session (2026-09-28): fixes, KNS add-on, satellites, bento, field notes (v0.29.0 → v0.29.17)

All on webflow.io only, each release verified on the CDN (SRI) and in the live HTML. Detail per release: `docs/handoff.md` › Latest blocks.

**Root causes worth keeping**
- **Observatory white curve over the cards:** GSAP Flip `absolute:true` lifts every card out of flow, so the list collapsed to 0 and the light section rode up. v0.27.8 held the height but released it on the height tween's own 0.55 s clock while the staggered Flip ran ~0.85 s+. Fix (v0.29.0): release in Flip's `onComplete`; shrinking waits for the cards to land, growing opens at once.
- **Flight computer "+ Add a CMS item" dead:** `run()` called `tl.eventCallback('onComplete', …)`, which REPLACES the program's own onComplete (the globe's `busy = false`). Fix: chain the existing callback. The globe fly-in also read an undefined start point when a coarse tick rendered the tween before a preceding `.call()`; setup moved to the tween's `onStart`. [[lesson_gsap-eventcallback-replaces]]
- **Choppy scroll at About › "Always looking up":** every planet spun its texture with `background-position` keyframes = a main-thread repaint every frame; the big 512 px planet made it visible. Fix (v0.29.9, core): `.tex::before` strip two tiles wide sliding by `transform`, texture passed as `--tex`. Core JS + CSS must ship together (old JS + new CSS draws doubled textures). [[lesson_background-position-spin-repaints]]
- **Custom deploys card ran off screen on mobile:** grid/flex items default to `min-width:auto`, so the terminal's nowrap lines widened the card past its column. Fix: `min-width:0` on bento cells/cards/viz, the terminal clips.
- **Crew satellite vanished when a card was tapped:** a selected card gets `z-index:8`; the satellite layer was 4. Now 12.
- **Radar beam cut off / popped back:** the beam lived inside the letterboxed SVG; moved to an HTML overlay mapped onto the chart and turned into a yoyo. Constellations draw on the way out and erase on the way back (v0.29.14).
- **Headless testing notes:** Chrome headless can't go below 500 px (use the pane's device emulation for phone widths); rAF stalls when idle, so step GSAP with `gsap.ticker.sleep()` + `gsap.updateRoot(t)`; terminal output showed "é" as "�" (display only: pasting it into a CMS write would have corrupted the text, so CMS bodies went through as `\u00e9` escapes and were byte-compared after).

**What shipped (short):** nav "you are here" (parent section on detail pages); spacesuit-glove cursor (`--hand`); one satellite glyph everywhere (`.sat-ico`); KNS · Knowledge system add-on (localStorage `ab:ks`) across Home planner, /process form + star chart + touchdown, /services map + panel + touchdown, KNS flags on both route scrollers; matching touchdowns; form chips unified (Home planner highlight); /process reset route + Crew satellite (yoyo, phone path); COMMS wave (seamless irregular tile, slow single-color fades); Home bento reshuffle (minis: Now booking from the CMS availability, Reply time; tap-to-morph planet; trajectory card; code → deploy terminal; wide Field notes chart + signal log; six performance meters); Player one quest bar + feed; Observatory newest-first + sort toggle + Hyperjump; 14 cross-links between notes; notes 16 (WB-09) + 17 (WB-10) imported (via a parallel session); HQ button in the mobile menu; menu links scale on narrow phones; About bookshelf titles.

Sort fields renumbered ×10 (2026-09-28) so new items can go in between; backup in backups/2026-09-28-sort-before.json.


## v0.30 session (2026-09-28): tweak batch v0.30.0 → v0.30.5, verified on staging

Ran as four parallel agents (Observatory/Topics, Process, Services hub, CMS sort) + the main thread (Home, Contact, core); agents edited only their own bundle's src, the main thread built, tagged and deployed once. Full list of changes: `docs/handoff.md` › Latest v0.30.0 and v0.30.1–v0.30.5.

Root causes and non-obvious fixes:
- **Contact email clipped:** the address was uppercase display type in a quarter-width cell (~190px of content at 1024). Fix: mono lowercase label + `.ab_ct-cells` 2×2 at 992–1439 (`ab-contact.css`).
- **Easing dot stretched:** a `<circle>` inside an SVG with `preserveAspectRatio="none"` scales with the card. The dot is now an HTML element positioned in % over the plot (`home/20-services.js` easing, `.v-ease .dt`).
- **Tokens card grew between themes:** each theme changes font family and scale, so the card and ramp resized. Fixed-height boxes (`.v-sys_card` 122px, `.v-sys_ramp` 36px), heading `nowrap` + ellipsis (v0.30.1).
- **Browse-by-topic / vocabulary headroom:** the light section already clears its curved top with 180px padding; the Webflow `.ab_ks-pad` added another `clamp(70px,9vw,130px)`. `.section_ks-browse .ab_ks-pad{padding-top:0}`.
- **Launch pass didn't lift after scrolling to it:** the lift only started from `pointerenter` + a 180ms dwell, and was refused while scrolling (<150ms) or printing, with no retry. When the pass scrolls under a still mouse there's no new pointer event. Fix: `settle()` re-checks the last pointer position against the pass once scrolling stops (200ms debounce) and when the print finishes (`AB.hubPassSettle`), retrying while either is still moving (v0.30.3).
- **Closing quote mark alone on a line:** the quote is split into inline-block word spans with a space after every word (including the last), and the marks were `::before/::after` on the paragraph, so a break could fall between the last word and the mark. Marks moved onto the first/last `.qw` (`:has(.qw)` turns the paragraph's off), no trailing space (v0.30.4).
- **Transmission satellite (v0.30.4 dish → v0.30.5 satellite):** `home/40-stack.js` builds it inside the rotator; `tune(q, dur)` per quote: dot fades in (0.1s) → seek + drift ≤30px toward it and turn (0.7–2.0s) → lock at 2s (beam, lock ring, "Locked") → noise settles; `--fq` cycles the /process COMMS palette. The quote reserves the column (`.ab_transmission_quote{padding-right:…}` ≥1200px): at 1280 the widest line had cleared the dish by 2px before.
- **First-visit warp:** `abwarpin` 0.4.0 (registered inline, head) sets `ab:warp-in=first` once per session (`ab:seen`); `core/10-space.js` arrive() plays the slower version for `first`. Failsafe 2.5s.
- **Services lede + badge:** Designer text, swapped by script only while the old text is present (Designer steps J1/J2).
- **Gauge frame looked broken (v0.30.6):** `.abp-con-deco` sat at `inset:0`, so its corner rivets landed on the 6px inset bezel line and its 24px grid ran over the frame. Moved to `inset:7px` (brackets/rivets repositioned inside).
- **Touchdown too far right (v0.30.7):** `layout()` put the destination at `viewL + innerWidth * .7`; now `.58`.
- **Selection box collapsed to a line (v0.30.8):** core appends `.sel` (the Figma-style box) inside every `[data-selectable]`; `.abp-console>*:not(.abp-con-deco){position:relative}` also matched it. Added `:not(.sel)` there and to two older ab-hub child rules (`.hb-pp-page > *`, `.hb-patch > *`).
- **jsDelivr served a cached 404 for v0.30.7** right after tagging even though `package.json` at the tag already answered 200: poll the exact file's hash, purging until it matches ([[lesson_jsdelivr-caches-404-before-tag]]).
- **CMS:** 6 book quotes (Quotes collection, `name` = quote); WB-09 body AOL Hometown dates; every Sort field ×10 (backup `backups/2026-09-28-sort-before.json`; Mission Types not done).

Testing: the browser pane was hidden (rAF + IO frozen) and plain `chrome --headless --screenshot` returned black frames after a scroll; Playwright with the installed Chrome (`channel='chrome'`) worked for everything (`scratchpad/t/pwh.py` pattern: load, scroll via Lenis `immediate`, wait, evaluate, screenshot). [[lesson_headless-screenshot-use-playwright]]

## Mobile + About session (2026-09-28 → 29): v0.30.9 → v0.32.3, verified on staging

Rapid phone-screenshot bug reports, each shipped as a patch tag to webflow.io; two agents ran in parallel for v0.31.0 (About: crew + bookshelf; core: next-card + probe) and one for the forms layer (v0.32.0), main thread built/tagged/deployed. Full per-release list: `docs/handoff.md` › Latest v0.30.9 … v0.32.3. Root causes worth keeping:
- **Next-card bottom-right corner filled the card (v0.30.9):** class-name collision, the card's `.nx-c.br` corner vs the Branding program's bare `.br{width:100%;height:100%}` in ab-services.css. Scoped to `.fc-stage .br`. Short class names in page CSS need a parent scope.
- **Flight computer foot grew with each note:** content-height footer; now reserves the tallest note (`sizeNote()`); phones stack Run under the note.
- **Doubled top padding on light sections (v0.30.10, v0.30.12):** the section's own curve padding + the inner `ab_ks-pad` / `padding-section-medium`. Only the curved variants get the inner padding zeroed (`[data-ks-row="service"]`, `.section_about-off`); Home/mission ks-rows have no curve padding and keep theirs.
- **Field-notes stars in three columns:** `(k * 97) % 290` steps +1px every 3rd star (97·3 = 291). R2 low-discrepancy sequence now.
- **Observatory drone beam off target:** gsap rotates around the element centre by default, so the zero-height beam wrapper swung off the drone; `transformOrigin: '0% 50%'`, parking spot stored as an offset from the planet, everything re-placed each tick.
- **Contact dish/beam cut off (v0.31.0 → fixed v0.32.0):** a CSS `mask-image` on the `<svg>` clips everything painted outside its box ([[lesson_css-mask-clips-overflow]]); SVG `<mask>` on the cone polygon only.
- **Transmit hover orange on orange:** it's `<input type=submit>`, which can't host the `::before` fill; real background fill for `input.button.is-primary`.
- **"The button just doesn't submit":** Webflow's Cloudflare Turnstile keeps every form submit `disabled` until its token arrives (loaded on `requestIdleCallback`); a disabled button fires no click. `core/43-validate.js` listens on pointerup/Enter anyway and shows inline "◆ MISSING / SIGNAL CHECK", a "◆ HOLD LAUNCH" summary, or a pre-flight note ([[lesson_webflow-turnstile-disabled-submit]]). Also fixed: under reduced motion, `requestSubmit()` inside the submit handler was ignored, so the form never posted.
- **Bookshelf hover jitter:** `:hover` lift moved the book out from under the pointer (loop). Hover is now chosen by pointer x against each book's `offsetLeft` slot.
- **Astronaut tether clipped / detached:** Webflow's `svg:not(:root){overflow:hidden}` reset beat the one-class `overflow:visible` (two classes now); the cord starts on the frame's bottom edge (flat cap) and is never clipped. Rounding the astronaut SVG path numbers to 1 decimal merged adjacent numbers (`.05.02` → `.1` + `0` = `.10`): keep source precision when compacting path data.
- **Grey seams on the recolored astronaut:** the dark base silhouette shows through anti-aliased edges between shading and suit shapes; shading paths get a same-color 2-unit stroke.
- **Local-dist test harness:** stripping `integrity` from the HTML wasn't enough; Webflow's `Link` preload header still carried the SRI ([[lesson_webflow-link-header-sri-local-test]]).
- **Designer publish after API writes:** Angelino published from the Designer after a reload; verified every head/script stayed on today's versions ([[lesson_webflow-designer-save-overwrites-api-code]]).

## Boss fight → logo v2 → wormhole session (2026-09-29 → 30): v0.33.7 → v0.33.19, verified on staging

Shipped alongside the parallel Engines/Calm-mode chat (it owned v0.33.0–v0.33.6; the two chats announced every tag to each other). Every release: pull, build, commit only the released bundles, patch only their `sri.json` keys, tag, CDN hash check, register + apply by API, publish webflow.io only, headless re-check on the live site. Per-release detail: `docs/handoff.md` › Hidden boss fight, Logo v2, Planets/wormhole/drifters, and the session summary there.
- **v0.33.7 About boss fight:** canvas hyperspeed starfield (`warpField()`), anime cut-in removed, credits end with ANGELINO / BARAJAS streaking in from both sides (the only place the name appears). Headless test hook: serve unminified `ab-about.js` with `var DMG = 2;` raised plus an rAF autopilot that re-sends keydowns every frame (the dialog's blur handler clears held keys).
- **v0.33.8 Logo v2** (`logo/AB Logo v2.svg`): `AB.MARK` a/leg/b/planet, orange planet everywhere; the nav intro spins the planet in as a sphere (8 front-side meridians, 540° ease-out) whose core opens into the mark. Identity debrief scenes trace four paths. Favicon/webclip PNGs regenerated; fallback asset `6abc73b3d5dccb4f1a7f29ad` uploaded.
- **v0.33.9–v0.33.11 Planets:** `AB.planetLook` generator (11 surface types, color harmonies, 5 ring styles), the wormhole planet type (glass lens, point-lensed starfield, jelly hover, random-page fall, side quest), drifter planets on every page; v0.33.11 water-drop outline.
- **v0.33.12–v0.33.15 the fall:** tunnel → hi-res tunnel → matched hand-off, all rejected ("redraw"); v0.33.15 pull-in + hyperspeed + fade. Root causes: a CSS `filter` tween flashed the ball black ([[lesson_css-filter-tween-flashes-black]]); any image hand-off reads as a redraw unless every transform matches.
- **v0.33.16–v0.33.19:** stronger + slower ripples (mask was clipping the crest), magnetic hover, quest #18 `untethered`, probes spiral in ("signal lost"), pop-in on view, back-button return (`pageshow` persisted, [[lesson_bfcache-restores-mid-transition]]), phones: behind the text with taps passing through, 36px from the right. The ball's CSS animation owns its transform, so script scales go on `.pbody` ([[lesson_css-animation-beats-inline-transform]]). ab-mission.css v0.33.16 (diff since 0.26.5 reviewed) went live through Angelino's Designer paste (bound robots meta in that head).

## Field notes + reel + mobile grid session (2026-09-30): notes 18–22, v0.33.27, verified on staging

**Field notes (CMS, Observatory `6ab88c3cea14ac23bad45867`):** 18 WB-11 `designers-hardest-audience-maximalist-website` (`6abc991f9763e61d603df4c9`), 19 WB-12 `alchemist-design-trends-going-home` (`6abca0931c00b7bb8e50ee7f`), 20 WB-13 `interstellar-love-design-message-across-time` (`6abca0931c00b7bb8e50ee81`), 21 WB-14 `warren-robinett-easter-eggs-hidden-details` (`6abca4adc0a32505c2c0e078`), 22 BN-08 `hidden-boss-fight-webflow-build` (`6abca4adc0a32505c2c0e07a`). All 200 and listed. Importer notes: `knowledge_payloads.py` numbers `sort` 1..N but live sorts are ×10 since 09-28, so multiply before `create_collection_items` (18 → 180); run it with `PYTHONIOENCODING=utf-8` (cp1252 console crashes on →); add each note's topics to `_draft-topics.json` › `insight_topics` first; codes come from counting approved drafts per theme. Note 19 carries Angelino's story (minimal trend chasing incl. his own portfolio, WoW/Warcraft III guild signatures, the "home" moment); his first Photoshop was a hacked copy, deliberately left out. Note 20 hints at the family details without naming them. 21/22 went straight to live at his ask (Robinett history written from memory, unverified against sources).

**v0.33.27 (ab-core JS + CSS):** the footer `#gridToggle` was hidden on phones by its Designer class `ab_footer_grid-toggle`; the Engines footer button shares that class and was already shown by `@media (pointer:coarse)` in ab-core.css, so the grid button got the same kind of override (`#gridToggle.ab_footer_grid-toggle{display:inline}` under `(pointer:coarse),(max-width:991px)`), with no Designer step. On touch, `20-ui.js` strips "· Shift+G" from its text nodes. Mobile menu: `.ab_menu_grid` switch after Engines; `toggleGrid()` syncs its aria-pressed/On/Off; turning it on clicks `#menuBtn` to close the menu (the overlay sits under it). Tested with local dist (intercepted HTML, integrity + Link header stripped), then live at 390 and 1440. Core CSS jumped 0.33.19 → 0.33.27; `git diff v0.33.19 HEAD -- code/src/ab-core.css` confirmed nothing else rides along.

**Reel + film (`reel/`, excluded via `.git/info/exclude`, not deployed):** captures with Playwright + CDP screencast (`cap.py`, scenes `sA`–`sE.py`), compositor `editor.html` (render(t), frame by frame), `render.py` (21.6 s quest-log reel), `life.js` (the growing-up timelapse, all canvas: 10 eras, same room, growth/slouch/joy, look-alike games and posters, push into the monitor), `film.py` (66 s film: timelapse → site with link clicks, no HUD), `gen_audio.py` / `gen_audio2.py` (synthesized soundtracks). Deliverables: `AB-Portfolio-Highlight-Reel.mp4`, `AB-Portfolio-Film.mp4` (+ `-phone` copies under 30 MB for his phone). Root causes worth keeping: screencast frames come at CSS-viewport size (force DSF with a Chrome flag: [[lesson_cdp-screencast-dip-size]]); parallel captures dropped to 5–25 fps (record one at a time); canvas `toDataURL` is tainted by file:// images (screenshot instead); `Math.pow(negative, .8)` = NaN in the motion-trail ghost at t<0 broke `createLinearGradient`; the timelapse→site seam popped until the last half of the push fades the exact site frame in full screen (life frame index `(t-PUSH0)*30+20` = part 2's first E frame 66); captions over busy footage need panels; site overlays (selection boxes, toasts) show in captures.

## Page speed session (2026-09-30): v0.33.28 → v0.33.30, verified on staging

Lighthouse mobile re-check of 11 live pages (table + diagnosis in `docs/qa-report.md`), then every layout jump found at 412/1024/1440 fixed. Live: ab-core JS **v0.33.30** + CSS **v0.33.29**, site head preloads Geist next to Archivo, ab-knowledge CSS **v0.33.29** on /observatory, /topics and both knowledge templates. Backups `backups/2026-09-30-v0.33.28-observatory-head-before.txt`, `backups/2026-09-30-v0.33.29-before.txt`. Root causes worth keeping:
- **`:empty{display:none}` on script-filled boxes** (v0.33.28): the Observatory ask box + stats row appeared ~430 px tall after first paint (CLS 0.40, perf 53). `:empty` now holds `visibility:hidden` + the filled `min-height` per wrap step ([[lesson_empty-display-none-causes-cls]]).
- **Font swaps re-wrapped text** (v0.33.29): Webflow's font variables end in plain `sans-serif`; About's summary went 3 → 2 lines and the centered hero moved (0.24), the hub's mono chips wrapped to a third row (0.12). `ab-core.css` re-declares `--_typography---font--body` / `--_typography---font--mono` / `--mono` with "Geist Fallback" (Arial, size-adjust 102.47%) and "JetBrains Mono Fallback" (Courier New, same advance) ([[lesson_font-swap-cls-metric-fallback]]).
- **Hero toys change `display`**: `.is-toy` makes title words inline-block after load; on /topics "STAR CHART" painted on two lines then one. Knowledge titles now start inline-block.
- **Script-built blocks** (/topics star chart 0 → 613 px; topic hero mini chart, stats, 2-line eyebrow): reserved with `:empty` min-heights, container units (`.container-large:has(> .ab_ks-chartwrap){container-type:inline-size}`) and `aspect-ratio:480/270`.
- **Starfield lens** (v0.33.29/30): the wormhole rect was read in the draw loop after GSAP wrote (~400 ms forced reflow on Home), and after the wormhole was built it was read ~190×/s for the rest of the visit. Now read at the front of GSAP's tick and only while an IntersectionObserver says it's within 200 px of the screen. The remaining Home reflow (~350 ms) is load-animation layout work charged to whichever code reads first.
- **Mission's 8.8 s LCP was Lighthouse's simulation**, not a hidden-content bug: observed paint 1.7–2.3 s (compare `metrics.observedLargestContentfulPaint` first).
- Left for the Designer: **P1/P2** (Topics template visibility *Missions is set* / *Services is set*): the script hides empty sections after paint (topic pages without missions 0.11 at ~1024 px).
- Tested before shipping by routing jsDelivr bundles to local `dist/`; the template CSS jump (0.25.5 → 0.33.29) was screenshot-diffed on 8 pages at 390/1440 ([[lesson_cls-test-desktop-and-cms-pages]]).


## Field note 23 (2026-10-01): staging

Field note **23** (WB-15 `ai-creative-tool-taste`, item `6abe830205920582ee7be3c7`, sort 230) written, approved and published to webflow.io 2026-10-01: AI as a creative tool, paste-up → desktop publishing → AI, taste as the part AI can't hold. At his ask the note does **not** say AI wrote the site's code (AI is described only as doing bulk work: CMS entries, refining, bug hunting), and client moments are hinted at, not named. Topics philosophy-at-work / brand-identity / design-systems. Page 200, listed on /observatory, 4 cross-links (notes 14, 16, 19, 22) 200. Next free Observatory: WB-16 / BN-09, sort 240, draft 24.
Importer: added `"23"` to `_draft-topics.json` › insight_topics, removed YAML quotes from the title (the parser keeps them literally), filtered the payload to sort 23 → 230, created staged with isDraft false, then `publish_site` with `publishToWebflowSubdomain: true` (no custom domains on this site).

## Mobile performance pass (2026-10-04): v0.33.44 (ab-core JS, ab-home, ab-about)

Goal: lift Home (47) and About (48) mobile without changing how anything looks. Measured with a local A/B harness (live barajasdsgn.com HTML served from localhost, only the AB bundles swapped to the local build; Lighthouse 13.5 mobile, 5 runs) plus throttled traces (4x CPU, 412 px). Local scores run lower than live (uncompressed local files), so compare base vs new only.

| Page | Perf base → new (median of 5) | TBT base → new | CLS |
|---|---|---|---|
| Home | 43 → **62** (61/62/61/62/62) | 801 → **115 ms** | unchanged |
| About | 38 → **60** (60/62/60/60/61) | 1043 → **72 ms** | unchanged |

What each cost was and what changed (all site-wide helpers are on `AB`, `core/00-base.js`):
- **`AB.near(el, fn)`** builds a piece once it is within a screen of the viewport (every side). Used only where the build can't change any box: About's Interstellar clocks, crew 3D, philosophy astronaut (`nearCard`), the Home tools orbit, footer planet Draggables, `[data-split]` heading splits (the ones in range at fonts.ready still split at once), and planet **texture painting** (watched by the planet's section, because a planet hanging off the side of a page that clips sideways overflow never counts as near itself: About's wife moon).
- **Not near-built, on purpose:** Home's bento visuals and About's bookshelf set their own card heights when they build (services section +560 px on a phone). Built lazily, a `/#launch` arrival landed 560 px off and scrolling up jumped (shift 0.78). They build at load again, but each Home visual is its own split step (`__steps`) and the shelf runs in its own task (`AB.soon`).
- **`AB.ambient(fn)`**: loops that run on their own start once the page is interactive (load + 1.2 s, or the first pointerdown/keydown/wheel/touchstart/scroll). Home hero badge spin + satellite bob, About moon orbit, drifter planets. The timer start runs one piece per task; an input runs them all at once.
- **`AB.lazyDrag(el, vars)`**: hero toys (Home words, planets, badge, satellite; every other page's hero words + planet via `core/39-herodrag`) get Draggable's inline styles at load (`touch-action:none`, `cursor:grab`, `user-select:none`) and their Draggable at ambient start. A press before then starts ambient in the capture phase, so the same press already reaches the new Draggable (tested touch + mouse at 150 ms and 1.6 s after load).
- **Texture worker** (`core/10-space.js`): `makeTexture` split into `drawTexture(canvas, …)`; where the browser has `OffscreenCanvas`, a Blob-URL worker runs the same functions (shipped by their own minified names) and returns a JPEG Blob → `blob:` URL. Byte-identical to the main-thread JPEGs on Home/About/Process/Work. One hero planet's texture was a 150–250 ms main-thread task even on a fast laptop; this was the bimodal About score (42 vs 60 depending on whether first paint landed before it). No OffscreenCanvas (older iOS, Playwright WebKit) or any worker error → made on the main thread as before.
- **Forced layouts per frame:** About's pilot planet read `getBoundingClientRect()` every frame for the moons (the top cost of About's load); Home's orbit read `offsetWidth` per chip per frame. Both cached (ResizeObserver).
- Badge back face (wear + 4 patch planets) builds at ambient, or at the first hover/focus/flip.
- Home trajectory visual: nearest-point search every 4 units then refined (was ~500 `getPointAtLength` calls); same three results.
- Removed the Process step's own `ScrollTrigger.refresh()` (the bundle refreshes after its last step; ScrollTrigger's own load refresh also runs).

Verified: section boxes before/after scrolling identical to base on all 12 pages at 412 + 1440 (incl. `/#launch` landing position), layout shifts while scrolling no worse than base, no new console errors, every planet textured after a scroll-through, badge back identical when flipped 300 ms after load, side-by-side screenshots of every changed piece.
Known, not from this pass: Home's init runs in jQuery's ready timer *after* first paint, so the hero title fit / nav "Booking" text can register as a ~0.02 shift when a frame lands in between (seen in local Lighthouse runs, live measured 0).

**v0.33.46 (2026-10-04, live):** after the Topicweave slug change (cks → topicweave, shipped by the Topicweave chat as v0.33.45) the Home work card lost its loom preview (`home/10-work.js` matched `slug === 'cks'`); it now matches `topicweave` with `cks` as fallback. About badge mission patch renamed CKS → Topicweave (fits the 84 px patch). Verified live at 1440 + 412.
