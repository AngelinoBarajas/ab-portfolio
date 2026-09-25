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

## Designer steps for Angelino (the MCP can't reach tag styles)

Select **Body (All Pages)** in the Style selector and set:
- Background: `Neutral / Void` · Text color: `Text / Primary` · Font: `Font / Body` · Size: `Text / Body` · Line height 1.6

Then **All H1–H6 Headings**: margin top/bottom 0 · **All Paragraphs**: margin 0 · **All Links**: color inherit.
