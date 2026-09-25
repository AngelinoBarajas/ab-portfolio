# Build spec

## Sitemap

| Page | Webflow type | Slug | Prototype | Sections (in order) |
|---|---|---|---|---|
| Home | Static | `/` | `home.html` | hero, work, about, services (light bento), process, transmission, stack, testimonials, faq, contact (Mission planner) |
| Work | Static + Missions collection list | `/work` | `work-index.html` | mission-archive (hero + meta), missions (sticky filter bar, grid/list toggle, preview on hover), next-mission |
| Mission | Missions template | `/work/[slug]` | `mission-debrief.html` | debrief (hero), mission-control (monitor channels), briefing, palette (logo missions only), systems, problems-solved, manifest (light bento), telemetry + stack orbit, crew-debrief (quote), next-mission |
| Service | Services template | `/services/[slug]` | `services.html` | service (hero + service rail), problems-solved, whats-included (light bento), flight-plan, related-missions, under-the-hood (only if Code is set), faq, next-service |
| About | Static | `/about` | `about.html` | pilot-dossier (crew badge), mission-statement, flight-log, off-duty (light bento), next-mission |
| 404 | Utility | `/404` | `404.html` | signal-lost |
| Process | Static + Services list | `/process` | `process.html` | launch-sequence (countdown hero), star-chart (Services CMS), trajectory (pinned route), crew-roles (light), timeline, faq, launch (form) |

Every page shares: nav, mobile menu, starfield canvas + nebula + grain layers, layout-grid overlay (Shift+G), cursor HUD, toast, black hole footer.

Primary nav: Work (`/work`) · Services (`/#capabilities`) · Process (`/process`) · About (`/about`) · Contact (`/#launch`). Footer service links point at `/services/[slug]`.

## Components (build once, reuse)

| Component | Class | Notes |
|---|---|---|
| Nav | `ab_nav` | Fixed, hides on scroll down. Status dot, live clock and availability bound to Site Settings. Mobile menu with a planet. |
| Footer | `ab_footer` | Transmission quote (Quotes collection), link columns, copy-email button, wordmark, foot bar. Black hole zone at the very bottom: draggable planets, `feed-console` frame, nova after 7 planets. |
| Section frame label | `ab_frame-label` | Figma-style "▢ name W × H" label on every `section[data-frame]` (script fills it). |
| Selection box | `ab_sel` | Figma selection outline + W × H tag on `.selectable` hover (script-injected). |
| Planet | `ab_planet` | Empty div with `data-planet`, `data-colors`, `data-ring`, `data-tilt`, `data-spin`, `data-glow`, `data-seed`, optional `data-drag`. Rendered by the planets script. Bind attributes to CMS fields on templates. |
| Button | `button` + `is-primary` / `is-ghost` | Square, 56px tall, shine sweep on primary, magnetic on hover. |
| Bento card | `ab_bento-card` | Light and dark (`is-dark`) variants, spotlight + tilt on hover, `data-span` sizes (`xl`, `tall`, `full`). |
| Mission card | `ab_mission-card` | Cover (image / mark / brand / app / site), number, planet peeking up on hover, tags, status chip (live / shipped / placeholder). |
| Next card | `ab_next-card` | HUD corners, grid, RA/DEC/ETA readout, hyperspace streaks, a ship that flies to the planet on hover. Used for next mission, next service, CTA. |
| FAQ item | `ab_faq` | `details/summary`, eased open/close, one open at a time. |
| Code block | `ab_code` | Language label, name, copy button, simple highlighter. |
| Crew dock | `ab_crew-dock` | Floating Cadet/Engineer toggle on mission pages. |

## Light sections

Wrap in `section_[name] theme-light` and set the **Light** variable mode on that wrapper. The curved top/bottom edge and the cursor-reactive dot field are script-driven (`.light-bg`).

## CMS binding notes

- Template heroes: title from `title-1` / `title-2` (Services) or `name` (Missions). The outline word is a separate span with class `t-outline`.
- Planet attributes bind to `planet-*` fields. Brand color fields feed inline CSS custom properties on the cover (`--cbg`, `--cfg`, `--cac`).
- Mission Channels, Systems, Problems Solved, Stats and Globe Pins are nested collection lists on the Mission template, filtered by `mission = current item`.
- Service `missions` multi-reference drives Related missions. If fewer than 3, show the "Yours could be first" card (conditional visibility).
- Work index filter chips come from Mission Types. Filtering is client-side in the prototype; Finsweet CMS Filter is an option if the list grows.
