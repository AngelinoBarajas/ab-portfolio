# Work (Mission archive): prototype → Webflow map

Built 2026-09-25 from `prototypes/work-index.html` (the prototype renders everything from a JS data object; Webflow renders the cards from the Missions collection and `ab-work.js` adds the rest). Page `6ab6853da89bdfd5de03324d`, slug `/work`. Files here: `<section>.html/.css` were sent to `data_whtml_builder` after `python ../prep.py work/<section>`.

Navigator: `Body > page-wrapper > [Nav] · main-wrapper <main id="top"> (hero · missions · next-mission) · [Footer] · Site data (hidden CMS sources)`.

| Prototype | Webflow | Notes |
|---|---|---|
| `section.dbh.arc-hero#hero` | `section.section_arc-hero#hero[data-frame=mission-archive]` › `padding-global` › `container-large` › `.ab_dbh` | `ab_dbh_*` classes are meant for the Mission template hero too |
| `.pwrap.dbh-planet[data-drag]` | `.ab_planet.is-dbh[data-drag]` | drag + spring-back in `ab-work` |
| `.crumb`, `.dbh-eyebrow`, `.dbh-title .w`, `.dbh-sum` | `.ab_crumb` (+`_link`, `_current`), `.ab_dbh_eyebrow`, `h1.ab_dbh_title#heroTitle` › `span.ab_dbh_word` (+`t-outline`), `p.ab_dbh_sum` | eyebrow blink square is a `::before` in `ab-core.css` |
| `dl.meta > div > dt/dd` | `.ab_meta` › `.ab_meta_item` › `.ab_meta_label` / `.ab_meta_value` | values carry `[data-arc=total|total-pad|real|live|types|years]`; the script fills them from the list. Static fallbacks in the Designer. Availability = `[data-bind=availability-short]` |
| `.arc-bar#arcBar` | `.ab_arc_bar#arcBar` | sticky; `is-stuck` / `nav-on` states in `ab-core.css` |
| `.af[data-type]` buttons (built from types in use) | static `button.ab_arc_chip[data-type=all]` + Collection List **Mission Types** (Filter chip = on, sort asc) › `button.ab_arc_chip[data-type=<Name>]` › `[data-field=name]` + `span.ab_arc_chip-count` | wrapper, list and item all carry `ab_arc_chip-list` (`display:contents`). Counts come from the cards; chips with 0 missions hide |
| `.crew-sw.arc-view` | `.ab_switch#arcView` › `span.ab_switch_ind` + `button.ab_switch_btn[data-view=grid|list]` | same pill will serve the crew dock |
| `#arcGrid article.mcard` | Collection List **Missions** (sort asc) `#arcGrid.ab_arc_grid-wrap` › `.ab_arc_grid` (list) › `.ab_mission-card` (item) › `a.ab_mission-card_link[data-card-link][data-selectable][data-slug][data-name][data-status][data-cover-kind]` | the item is the card (filter/Flip/tilt act on it) |
| `.mc-cover` / `.mc-cv` | `.ab_mission-card_cover` › `.ab_mission-card_cv` (+ cover image), `.ab_mission-card_no`, `.ab_mission-card_ph`, `.ab_planet.is-card[data-planet|colors|ring|glow]` | script adds `is-img|is-mark|is-brand|is-app|is-site` and the drawn covers; brand colors → `--cbg/--cfg/--cac` from the hidden `[data-field=brand-*]` nodes |
| `.mc-body` | `.ab_mission-card_body` › `.ab_mission-card_top` (client + `[data-card=year]`), `h3.ab_mission-card_title`, `p.ab_mission-card_sum`, `.ab_mission-card_tags` (nested Types list, Designer step) › `.ab_mission-card_tag`, `.ab_mission-card_foot` › `.ab_status` (`data-state` set by script) + `.ab_mission-card_go` | |
| `#arcList .al-row` | `.ab_arc_list#arcList[hidden]`, rows **built by the script** from the cards (`al-*` classes in `ab-core.css`) | a second Collection List would need a second nested Types list; the rows are a view of the same data |
| `#arcPeek`, `#arcEmpty` | `.ab_arc_peek#arcPeek`, `p.ab_arc_empty#arcEmpty[hidden]` | peek clones the card cover |
| `section.arc-cta a.next` | `section.section_arc-cta[data-frame=next-mission]` › `.ab_arc-cta` › `a.ab_next-card[data-next-card]` › `.ab_next-card_content` (`_eyebrow`, `h2._title`, `._go`) + `.ab_planet.is-next` | HUD/streaks/ship injected by `ab-core` (`core/38-next.js`), so every next card on later pages gets them. Eyebrow number set by `ab-work` |

## Designer steps (MCP can't)

1. **Mission card tags**: inside `.ab_mission-card_tags`, add a Collection List → source *Types* (the multi-reference field of the current Mission). In its item, a Text Block bound to *Name* with class `ab_mission-card_tag`. Give the nested list wrapper, list and item the class `ab_arc_chip-list` (display: contents) so the tags flow in the flex row. The filters read these tags, so filtering only works after this step.
2. **Card brand colors** (same as the Home board): in the card's hidden `.ab_cms-source`, `[data-field=brand-bg]` → Background color = *Brand background*, `[data-field=brand-fg]` → Text color = *Brand foreground*, `[data-field=brand-accent]` → Background color = *Brand accent*. Pick the fields from the **top group**, not *Next mission*.
3. **Cover image**: inside `.ab_mission-card_cv`, the Image bound to *Cover* (class `ab_mission-card_img`), conditional visibility *Cover is set*. (If the MCP managed it, only check it.)
