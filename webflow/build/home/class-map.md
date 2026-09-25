# Home: prototype → Webflow map (for step 7 code)

Built 2026-09-25 from `prototypes/home.html`. Every section is `section.section_<name>` › `padding-global` › `container-large` › (`padding-section-large` | own padding). Files here: `<section>.html/.css` are what was sent to `data_whtml_builder` (after `python ../prep.py home/<section>`); `planner-*.html` are the form pieces and embeds.

## Script hooks that changed

| Prototype | Webflow | Script change needed |
|---|---|---|
| `#mmenu[hidden]` (shown by removing `hidden`) | `.ab_menu_component#mmenu` is `display:none`; combo **`is-open`** = `display:flex` (Nav component) | menu script toggles `.is-open` (keep `hidden`/`aria-expanded` in sync). A class `display` beats the `hidden` attribute, so relying on `hidden` alone left the menu covering the page |
| `.split` on headings | `[data-split]` | select by attribute |
| `.selectable` | `[data-selectable]` (+ `data-name`) | select by attribute |
| `.magnetic` | `[data-magnetic]` | select by attribute |
| injected `span.frame-label` | real `span.ab_frame-label[data-frame-label]` (component **Frame label**) as first child of every `section[data-frame]` | fill the existing span instead of creating one |
| `.pwrap` | `.ab_planet` (+ `is-hero-giant`, `is-hero-moon`, `is-hero-ice`, `is-statement`, `is-services`, `is-orbit`, `is-testimonials`, `is-planner-earth`, `is-planner-dest`) | planet renderer targets `.ab_planet[data-planet]` |
| `.hero-title` `#heroTitle` | `h1.ab_hero_title.heading-style-display#heroTitle` | none (words still built as `.w`) |
| `.badge` / `#sat` | `.ab_hero_badge` (SVG in an Embed, `svg.ab_badge-svg`) / `.ab_hero_sat#sat` | selectors |
| `#board .frame` (static `<a>`s) | Collection List `[data-board-source]` (Missions, Featured = on, sort asc) › item › `a.ab_board_frame[data-board-frame][data-slug][data-name][data-summary][data-number][data-status][data-cover][data-font]` › `.ab_board_fname` + hidden `.ab_cms-source` › `[data-field=brand-bg]`, `[data-field=brand-fg]` | build frames from these attributes; read colors with `getComputedStyle(node).backgroundColor` / `.color` (see Designer step 2). No `data-x/y/w/h`, `data-preview`, `data-pins` in CMS: auto-place, and pick the preview from `data-slug`/`data-cover` |
| slot frame `.frame.is-slot` | `.ab_board_frame.is-slot` › `.ab_board_frame-inner.is-slot` (static, last) | none |
| `.frame-inner`, `.ftitle`, `.fsub`, `.fname` | `.ab_board_frame-inner`, `.ab_board_ftitle`, `.ab_board_fsub`, `.ab_board_fname` | script-built frames must use these classes (they exist in Webflow) |
| `#zOut/#zIn/#zFit/#zPct/#minimap/#mv/#layers/#viewport/#world/#fakeCursor/#youTag/#boardCoords/#projCount` | same IDs | none |
| `#capabilities .cap[data-span][data-visual]` | `.ab_bento_cell(.is-xl/.is-tall)` › `article.ab_bento-card[data-visual][data-name]` (component **Bento card**, Dark variant), planet card = page-level `article.ab_bento-card.is-planet[data-visual=planet]` | spotlight/tilt + visuals target `.ab_bento-card` and `.ab_bento-card_viz` |
| `.mission` `#log` | `section.section_process#log` | state classes (`is-wide`, `is-vert`) go on `.section_process` |
| `.traj` SVG | Embed inside `.ab_process_traj` (`svg.ab_process_traj-svg`, inner classes unchanged: `ahead`, `done`, `wps`, `ship`, `flame`, `traj-tag`) | selector for the root SVG |
| `.mission-panel`, `.mp-*` IDs | `.ab_process_panel` + same IDs (`mpNum`, `mpCode`, `mpTitle`, `mpCopy`, `mpDeliv`, `mpYou`, `mpCheck`, `mpBar`, `mpPct`, `mpPrev`, `mpNext`) | `mpBar` is a div now (was `<i>`) |
| `.mission-steps li[data-*]` | `ol.ab_process_steps` › `li.ab_process_step[data-code][data-deliverable][data-you][data-check]` | selectors; `is-on` state class unchanged |
| `.interlude` `#iq #iqText #iqBy #iqIdx #iqTotal #iqNext` | `section.section_transmission` + same IDs (`#iqBy` is a div, was `<footer>`) | none |
| `#orbit .chip[data-ring][data-color][data-icon][data-use]` | Collection List `[data-tools-source]` (Tools, Icon ≠ code) › item › `button.ab_stack_chip[data-tool][data-icon][data-use][data-name]` › `.ab_stack_chip-name` + hidden `[data-field=color]` | no `data-ring` in CMS: first 4 inner, rest outer; color via computed style of the hidden node |
| `#toolReadout .ci` | `#toolReadout .ab_stack_ci` | selector |
| `.faq details` | Collection List (FAQ, Scope = Homepage, sort asc) › component **FAQ item** `details.ab_faq_item` › `summary.ab_faq_summary` › div + `.ab_faq_icon`; `p.ab_faq_answer` | selectors |
| `#emailBtn #emailText .cp` | `button.button.is-ghost.is-email#emailBtn[data-copy-email]` › `#emailText[data-bind=email]` + `.ab_footer_email-copy` | none |
| `form.planner[data-name]` selection tag | `form#planner[data-sel-name]` | selection-box script: use `data-sel-name` before `data-name` (the form's `data-name` is Webflow's inbox name) |
| `form.planner#planner` | **native Webflow form** `form.ab_planner#planner` in `.ab_planner_wrap` | see below |

## Mission planner (native form)

- Submits to Webflow Forms. Named fields: `Mission types` (hidden, `#plTypesField`), `Launch window` (radios, values are text: ASAP / 1–2 months / 3+ months / Flexible, index in `data-i`), `Budget` (hidden, `#plBudField`), `Name`, `Email` (**required**, prototype had it optional), `Mission`, `Flight plan` (hidden, `#plBriefField`).
- The script must: fill the three hidden inputs before submit, read the window index from `data-i`, and **not** `preventDefault` the real submit (run the rocket animation, then let Webflow post). Success = Webflow's `.w-form-done` (`.ab_planner_sent`, never set `display` on it); `#plSentTxt`, `#plReset` live there. Copy flight plan (`#plCopy`) keeps the clipboard fallback.
- Field styles live in a scoped `<style>` inside the field embed (`planner-fields.style.css`), using the Webflow variable CSS names, so the form is styled before `ab-core.css` ships.
- SVG layers: `#plViz` (base embed, `.ab_planner_layer`) and `.pl-top` (top embed, `.ab_planner_layer.is-top`); IDs `plPath`, `plDone`, `plRingsB`, `plRingsF`, `plMoons`, `plRocket` unchanged. Destination planets `.ab_planet.is-planner-dest[data-k]`, script toggles `.on`.

## Still for ab-core.css (Designer can't express)

Pseudo-elements, descendant/state selectors, keyframes and script-built inner markup:
frame label hover + light-section position; hero `.w` word spans, badge SVG text/orbit styles, satellite beacon blink + label hover; planet internals (`.sphere`, `.pring`, drag states); board script-built frame internals (`.fopen`, `.pv`, serif titles, layer buttons, minimap `.m`, `you` tag visible state); text effects `t-outline`, `t-stars`, `t-select` (+ `.sel`), `t-orbit`, `t-signal`; light-section arc clip + dot canvas; bento spotlight `::before`, tilt, hover `translate`, card-hover link border, all `.v-*` visuals; Process `is-wide`/`is-vert` layouts, waypoint labels, check list items, steps timeline `::before` + markers + `is-on`; transmission live-dot blink, curly quotes `::before/::after`, `.long`, byline rule, `text-wrap: balance`; tool chip hover glow (`--tc`), `.ci` icons, `is-held`; FAQ marker reset, open state, icon hover; planner `is-flying`, `is-shake`, SVG internals, dest `.on`, flame; ghost-button star fill, light-section button hovers, `::selection`, `:focus-visible`, reduced-motion overrides.
