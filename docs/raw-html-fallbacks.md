# Raw-HTML fallbacks (what crawlers see before scripts run)

Found 2026-10-09 during the humanizer review. Visitors never see these: the bundles rewrite them on load. But
crawlers and AI tools that don't run JavaScript (GPTBot, ClaudeBot, Perplexity, most link previews) read the
Webflow HTML as published, and some of that text is wrong.

Rule going forward: **static text that a script overwrites must still be true on its own.** Bind it to the CMS
field the script reads, or write it so it holds for every item.

## Wrong today (fix)

| Where | Raw HTML says | Live (after scripts) | Fix |
|---|---|---|---|
| Mission template · palette section `[data-mission-palette]` | AB Identity's six tokens + type roles, on **every** mission | removed except on AB Identity | New Missions Switch **Show palette** (on for AB Identity only); bind the section's Visibility to it. Webflow drops conditionally hidden elements from template HTML (verified: `[data-mission-hidden]` is absent on visible missions), so kip/510 stop shipping it. Script unchanged (it already removes or shows `pal`). |
| Mission template · `[data-mf="host"]` | "Self-initiated identity" on every mission (510 Visuals is client work) | live domain / "Add-on · any Webflow site" / "Product site · in beta" / "Self-initiated identity" | Set static text to "Where it lives" (true label for all); script still fills the value. |
| Mission template · problem cards `.ab_anom_who` | "For visitors" on every card | "For the client" / "For visitors" per the problem's **For** option | Bind text to Problems Solved › **For** (option: client / visitors). |
| Mission template · `.ab_anom_ix` | "SOLVED-01" on every card | SOLVED-01…05 | Static "Solved". |
| Mission template · `[data-mission="no"]`, `[data-mf="no"]` | 01 on every mission | 01–05 | Bind to Missions › **Mission number**. |
| Mission template · `[data-mission="total"]` | 03 | 05 | Static "05" (update when a mission is added or hidden; see checklist). |
| Mission template · `[data-mf="role-meta"]` | "Platform · Year" | e.g. "Webflow · 2026" | Bind to Missions › **Platform**. |
| Mission template · `[data-mf="planet-tag"]` | "Mission · planet" | "kip · gas" | Bind to Missions › **Name**. |
| Mission template · `[data-mf="collections-title"]` / `types-title` / `params-title` | "0 collections" / "0 disciplines" / "All met" | "5 collections" / "4 disciplines" / "All 5 met" | Static "Collections" / "Disciplines" / "Parameters met". |
| Mission template · `#monCap` | "Channel caption." | the current channel's caption | Static "Mission control". |
| Service template · `[data-sv="missions-count"]` | "Yours could be first" on every service | "N logged" | Static "Missions logged" (script still says "Yours could be first" when a service has none). |
| Service template · `[data-sv="missions-n"]` | 0 | 1–4 | Static "" if the element allows it, else leave (eyebrow reads "/missions · related"). |
| Service template · `[data-sv="no"]` / `total` | 01 / 08 | 01–08 / 08 | `no` can't bind (Services has no number field); leave. |
| Home · `#projCount` | 3 flagship builds | 5 | Static 5. |
| Work · `[data-arc]` counters, `#arcCount`, next card | 06 / 6 / 3 real / 2 live / 12 types / 2025–2026 / Showing 6 of 6 / Mission 07 | 05 / 5 / 5 / 1 / 11 / 2026 / Showing 5 of 5 / Mission 06 | Static values = today's live values. |
| Services hub · `[data-log-count]` | 7 | 5 | Static 5. |
| Observatory · `[data-ks-n="obs"]` (hero + /log eyebrow) | 10 | 32 | Static 32. |

Counters that are UI state, not claims (clock `--:--`, zoom 100%, `X 0 · Y 0`, `feedCount 0`, T-minus labels,
`1 / 5` channel readout, timecode, XP/level): leave.

## Checklist when content changes

Adding, hiding or removing a **mission**: Work counters, Home `#projCount`, Services hub log count, mission
template `total`. Publishing a **field note**: Observatory obs count. (Or accept a stale fallback: the visible
page is always right; only no-JS readers see the old number.)
