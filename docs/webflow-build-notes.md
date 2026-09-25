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

## Custom code, part 1 (2026-09-25): site-wide + Home

Source `code/src/` → `code/dist/` (`code/README.md` has the build/deploy steps). Live on staging: `ab-core` JS + CSS at **v0.1.2**, `ab-home` at **v0.1.3**.

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
