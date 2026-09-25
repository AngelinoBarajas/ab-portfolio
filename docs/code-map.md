# Code map

Generated from the section markers inside each prototype. Use it to split the prototype code into Webflow custom code.

**Placement rule:** a module used on 4+ pages goes in **Site settings > Custom code (footer)**; a module used on 1-3 pages goes in that **page's (or template's) footer custom code**. Anything Webflow can do natively (layout, typography, colors, hover states, simple interactions) is rebuilt with classes and variables, not ported as CSS.

Every script follows the 510 Visuals standards: ES5 only (var, function(){}), `window.Webflow.push`, an `__ab<Name>Init` guard, and a `prefers-reduced-motion` check. GSAP 3.13 + ScrollTrigger + SplitText + Draggable + InertiaPlugin + ScrambleText + Flip and Lenis load once, site-wide.

## Scripts

| Module | Pages | Placement |
|---|---|---|
| site settings (CMS) | home, mission-debrief, work-index, about, 404, services | Site-wide |
| toast | home, mission-debrief, work-index, about, 404, services | Site-wide |
| clock + viewport | home, mission-debrief, work-index, about, 404, services | Site-wide |
| star texture for text fills | home, mission-debrief, work-index, about, 404, services | Site-wide |
| selection UI | home, mission-debrief, work-index, about, 404, services | Site-wide |
| lenis | home, mission-debrief, work-index, about, 404, services | Site-wide |
| nav hide on scroll | home, mission-debrief, work-index, about, 404, services | Site-wide |
| nav: mark the section in view | home, mission-debrief, work-index, about, 404, services | Site-wide |
| scramble + magnetic | home, mission-debrief, work-index, about, 404, services | Site-wide |
| hero toys (anything with data-drag in the hero) | home | Page |
| planets: parallax (data-parallax = px of travel) | home, mission-debrief, work-index, about, 404, services | Site-wide |
| planets: idle float + bounce that reacts to scroll speed | home, mission-debrief, work-index, about, 404, services | Site-wide |
| reveals | home, mission-debrief, work-index, about, 404, services | Site-wide |
| services bento: spotlight + tilt | home | Page |
| bento visuals (Services · data-visual) | home | Page |
| light sections: smooth arc on the top and bottom edge | home, mission-debrief, work-index, about, 404, services | Site-wide |
| light sections: dot field that reacts to the cursor | home, mission-debrief, work-index, about, 404, services | Site-wide |
| FAQ: eased open / close, one open at a time | home, services | Page |
| feed the black hole: tidal stretch while dragging, spaghettification on capture | home, mission-debrief, work-index, about, 404, services | Site-wide |
| click pulse in empty space | home, mission-debrief, work-index, about, 404, services | Site-wide |
| metrics | home, mission-debrief, work-index, about, 404, services | Site-wide |
| capability tilt | home | Page |
| mission sequence (Process Steps) | home | Page |
| orbit (Tools) | home | Page |
| altitude meter | home | Page |
| launch: mission planner | home | Page |
| board interactions (desktop/tablet) or swipe deck (phones) | home | Page |
| quotes (CMS · Quotes) | home, mission-debrief, work-index, about, 404, services | Site-wide |
| footer | home, mission-debrief, work-index, about, 404, services | Site-wide |
| mobile menu | home, mission-debrief, work-index, about, 404, services | Site-wide |
| touch wording | home, mission-debrief, work-index, about, 404, services | Site-wide |
| hero headline: on phones + tablets, size it so the longest word spans the column | home, mission-debrief, work-index, about, 404, services | Site-wide |
| footer horizon: arc sits just above the bottom bar so its text lands inside the planet | home, mission-debrief, work-index, about, 404, services | Site-wide |
| cursor readout | home, mission-debrief, work-index, about, 404, services | Site-wide |
| STARFIELD + SPACE EVENTS | home, mission-debrief, work-index, about, 404, services | Site-wide |
| WORK BOARD — built from Projects items | home | Page |
| FIGMA → BUILD | mission-debrief | Page |
| PHONE | mission-debrief | Page |
| SERVICE MAP (FigJam board → designed process) | mission-debrief | Page |
| GLOBE RENDER (exploded layers) | mission-debrief | Page |
| CMS → PIN (Webflow Editor adds a case, the map updates) | mission-debrief | Page |
| monitor | mission-debrief | Page |
| systems accordion | mission-debrief, work-index, about, 404, services | Site-wide |
| stack orbit (same system as the homepage tools orbit) | mission-debrief, work-index, about, 404, services | Site-wide |
| manifest: pages tick in on scroll | mission-debrief, work-index, about, 404, services | Site-wide |
| anomalies: RESOLVED stamps slam in | mission-debrief, work-index, about, 404, services | Site-wide |
| palette: tap to copy | mission-debrief, work-index, about, 404, services | Site-wide |
| next-mission cards: HUD, streaks, spotlight + tilt, a ship that flies to the planet on hover | mission-debrief, work-index, about, 404, services | Site-wide |
| MISSION DEBRIEF · render the template from the CMS item | mission-debrief, work-index, about, 404, services | Site-wide |
| MISSION DEBRIEF · interactions | mission-debrief, work-index, about, 404, services | Site-wide |
| MISSION ARCHIVE · render the Work index from the Missions collection | work-index | Page |
| MISSION ARCHIVE · interactions | work-index | Page |
| ABOUT · pilot dossier (static page; copy lives in the Designer) | about | Page |
| ABOUT · interactions | about | Page |
| 404 · signal lost (Webflow: the 404 utility page) | 404 | Page |
| 404 · interactions | 404 | Page |
| SERVICES · render the template from the CMS item | services | Page |
| SERVICES · interactions | services | Page |

## Styles (CSS sections)

| Section | Pages | Rebuild as |
|---|---|---|
| space layers | home, mission-debrief, work-index, about, 404, services | Global classes |
| planets (data-planet) | home, mission-debrief, work-index, about, 404, services | Global classes |
| buttons | home, mission-debrief, work-index, about, 404, services | Global classes |
| nav | home, mission-debrief, work-index, about, 404, services | Global classes |
| hero | home, mission-debrief, work-index, about, 404, services | Global classes |
| selection UI | home, mission-debrief, work-index, about, 404, services | Global classes |
| work board | home, mission-debrief, work-index, about, 404, services | Global classes |
| statement | home, mission-debrief, work-index, about, 404, services | Global classes |
| capabilities: bento | home, mission-debrief, work-index, about, 404, services | Global classes |
| mission sequence (process) | home, mission-debrief, work-index, about, 404, services | Global classes |
| orbit | home, mission-debrief, work-index, about, 404, services | Global classes |
| quotes | home, mission-debrief, work-index, about, 404, services | Global classes |
| faq | home, mission-debrief, work-index, about, 404, services | Global classes |
| launch / footer | home, mission-debrief, work-index, about, 404, services | Global classes |
| contact: mission planner | home | Page classes |
| footer: black hole at the very bottom | home, mission-debrief, work-index, about, 404, services | Global classes |
| transmission (quotes) | home, mission-debrief, work-index, about, 404, services | Global classes |
| footer | home, mission-debrief, work-index, about, 404, services | Global classes |
| cursor readout | home, mission-debrief, work-index, about, 404, services | Global classes |
| global ui | home, mission-debrief, work-index, about, 404, services | Global classes |
| text effects | home, mission-debrief, work-index, about, 404, services | Global classes |
| mission control monitor | mission-debrief, work-index, about, 404, services | Global classes |
| briefing | mission-debrief, work-index, about, 404, services | Global classes |
| systems | mission-debrief, work-index, about, 404, services | Global classes |
| mission control scenes | mission-debrief, work-index, about, 404, services | Global classes |
| mission manifest (light bento) | mission-debrief, work-index, about, 404, services | Global classes |
| next-mission cards: HUD corners, hyperspace streaks, cursor spotlight, a ship that flies to the planet | mission-debrief, work-index, about, 404, services | Global classes |
| anomalies | mission-debrief, work-index, about, 404, services | Global classes |
| telemetry + stack | mission-debrief, work-index, about, 404, services | Global classes |
| palette / type (logo missions) | mission-debrief, work-index, about, 404, services | Global classes |
| debrief quote + next | mission-debrief, work-index, about, 404, services | Global classes |
| production map CSS (Daniel Aguirre Law, scoped to .case-map) | mission-debrief, work-index, about, 404, services | Global classes |
