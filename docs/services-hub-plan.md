# Services hub (`/services`): **prototype APPROVED 2026-09-26** → Webflow build next

**Read this block first.** Everything below it is the history (the original "Departures" concept, then review rounds 2–5). Where the history and this block disagree, this block wins.

## Final page (what to build)

Prototype: `prototypes/services-hub.html` (frozen; assembled by `python prototypes/_parts/assemble.py hub` from the About shell + `_parts/hub.css`, `hub-render.js`, `hub-ix.js`). Title "Launch control". Theme: spaceport. Section order:

| # | Section | Behavior | Data |
|---|---|---|---|
| 1 | **Hero · Launch control** | Crumb + "AB spaceport · pads open"; title Launch / outline control; lede; **draggable hero planet** = the armed launch's planet (repainted on print). **Run diagnostics** chips (each service's first problem + "All clear"): the match goes PRIORITY GO and prints its pass. | Services: sort, short name, solve 1 problem, planet fields |
| 1a | **Mission-control monitor** (same `.mc/.mon/.screen/.panel/.tele` look as the Mission debrief) | Manifest on the screen: `> AB-0N · DESTINATION · TRANSFER (pairs codes) · ORBIT (planet type) · STATUS` + a labeled **Explore →** button per row (goes to `/services/[slug]`). Characters scramble digitally on change; armed row = orange channel-selected style; STANDBY / GO FOR LAUNCH (green) / PRIORITY GO (orange blink) / ON REQUEST. Caption line = typed prompt. Pass-printer slot under the monitor. Side console: **Launch keys** 01–08 (key buttons + lamps) + **Telemetry** (destination, orbit, transfers, status). ≤1200px the console stacks under the monitor. Hover a row → its planet peeks out past the monitor's right edge. | Services: name, short name, code (new), pairs with, planet type, slug |
| 2 | **Launch pass = translucent data slate** | Prints (slides) out of the slot, as wide as the slot (78% of the monitor column), straight; glass (backdrop blur), brackets, service-color glowing top edge; pointer **tilt + glare** (paused while printing). Launch site EARTH → planet → DESTINATION code; title 1 / outline title 2 (links to the service); summary; cells Crew seat / Orbit class / Transfers / Payload; tool chips; stub "Service briefing" pixel code + **Explore service** button. Hangs over the next section; that section's top padding is measured from it. | Services: title 1/2, summary, best for, tools, pairs with, planet |
| 3 | **Plot a trajectory** (light, map bleeds left) | Step pills (Main destination · Stops up to 2 · Launch) + hint chip against the panel ("… in the panel →/↓"). Map: 8 stations (codes), transfer arcs = Pairs with; main = orange ring + MAIN, stops numbered, recommended = spinning dashed ring "+ Pairs well", others dimmed; orange path Earth → main → stops. **One planner panel** walks the steps (pick chips → recommended stops with why + flown-together + Add stop, "Or any other stop" → trajectory readout with a reason per leg + missions that flew every selected service → **Launch the flight plan**). NEXT marker (orange bar + tag) on the block to use next; panel pings on each map pick; phones glide to the panel once. Map is sticky beside the tall panel (≥992). Scroll anchoring off on the page. | Services: pairs with, related missions; per-pair "why" lines (10, see WHY in hub-render.js: new CMS field or a small collection) |
| 3b | **Your flight plan** (hidden until launch; warps in) | Hyperspace warp (streaks + flash), section fills + page jumps to it. The Process route re-plotted: Earth pad, rocket on the lit path, 6 stage cards (main leg + a dashed line per stop, "See the … · mission →"), T-minus HUD, **touchdown** on the main planet (stops orbit as moons), shockwave + confetti, "Mission live" + Request this mission (→ Process form with `ab:dest`) / Book a call. Header: lede, **Edit trajectory ↑** + **Abort mission ✕** (reverse warp, section hidden, pin killed, back to the planner with the trajectory kept) at the far right. Pinned sideways ≥861, vertical rail on phones; nav held steady during the pin (`__abMissionST`). | Services: Process leg 1–6 (existing fields), Process example; STAGES copy (same as Process page) |
| 4 | **Crew logbook · Mission patches** | Glass slab (no backdrop blur here: perf), mission brand-color glow bar, brackets, dashed fold; pointer **tilt + glare**; spreads per mission (← → / arrow keys / swipe; 3D page turn). Left: mission no, name, client, status, patches count, Open the debrief, log line. Right: **digital hexagon badges** (service-color fill, white mono code, "Verified" dot), a few px parallax against the tilt; no re-animation on page turns. | Missions (number order) + Services › related missions (inverted per mission) |
| 5 | **Final call** | Small monitor line `> AB-09 CUSTOM CHARTER ANY TBD ON REQUEST` types in; "Not on the manifest?" + Plot it with me (→ /process#chart) / Book a call. | none |

## Webflow build map (for the next chat)

- **Page**: static `/services` (duplicate About or Process, remove their sections; site-data block + Nav + Footer come along). Services collection = data source; mark bound elements with `data-field` and bind in bulk (`webflow/build/services/bind.py` pattern).
- **CMS additions**: Services › **Code** (3 letters: WFD I3D MTN BRD BYD CMS DSY PRF). Per-pair **why** lines: simplest = a PlainText field per service holding "slug|why" lines, or a small "Service pairs" collection. Knowledge System is already a Missions item (the prototype's stand-in includes it).
- **Native vs code**: rows, pass content, planner copy, stage cards, logbook text = real Webflow elements bound to the CMS (hidden per-row pass content copied into the slate by code, or one bound slate per row). Code bundle **`ab-hub`** (JS + CSS) for: scramble readout + armed/priority states, print animation, peek planets, trajectory map + planner state machine, flight route (reuse `ab-process` route logic where possible), warp in/out, logbook turns + badges, glass tilt/glare.
- **Shared CSS to move site-wide** (`ab-core.css`): the mission-control monitor/console styles (`.mc .mon .screen .scan .vig .roll .brk .osd .mon-cap .panel .tele`, today only in the Mission bundle) and the square mono chip style.
- **Core change waiting to ship**: `code/src/core/30-motion.js` nav hide-on-scroll hysteresis (built into `code/dist`, **not tagged/deployed**; live core is v0.10.2). Ship it with the hub's core bump.
- **Perf rules learned here**: no backdrop-filter under anything that animates in 3D; no mix-blend-mode overlays on animated panels; badges/sheets get `will-change`; hand Lenis pixel numbers, not elements; no `overflow` clip on hero sections holding planets.
- **Glossary asides** (add to the CMS at build): PRIORITY GO status, the manifest monitor, Abort mission, AB-09 "Gate TBD"-style charter line. Draft copy at build time, Angelino approves.
- **Links**: Nav "Services" (now `/#capabilities`), mobile menu, footer Services column heading → `/services`.
- **Test**: local-dist method (staging HTML + local builds), headless shots with the prototype-style hooks (`?at=<frame>`, `?fly=0,5,2&p=0.45`), then jsDelivr + SRI, webflow.io only, 1440 / 1024 / 390, no console errors.

---

# History

## Original plan (2026-09-25)

Stage 1–2 of page-pipeline: concept + divergence gate. Angelino said "start" without answering the three questions, so the proposed defaults were used: a row click **prints the pass**, the **passport stays**, **airport codes stay**.

**Prototype:** `prototypes/services-hub.html`, assembled by `python prototypes/_parts/assemble.py hub` from the About shell + `_parts/hub.css`, `hub-render.js`, `hub-ix.js` (the assembler now builds both Process and the hub; it also points every Services nav/menu/footer link at the hub and makes the footer Services heading a link).

Prototype notes (differences from the plan above):
- Symptom chips sit **above** the board so the pass prints straight out of the board's slot. On phones they're a swipeable strip.
- On phones the title splits into DEPAR / TURES, the board keeps Flight + Destination + a status lamp, and the pass planet moves into the route line (EARTH · planet · WFD).
- The route map section's top padding is measured from the hanging pass (`hang()`), so the pass never covers the heading at any width.
- Itinerary → `/process#launch`: the prototype writes `ab:dest` as the main's index (what the Process prototype reads); the live Process reads a comma list of slugs, so the Webflow build writes slugs.
- Knowledge System (#04) added to the Missions stand-in (live CMS has it); placeholders 05–07 link to the archive.
- Glossary asides aren't in the prototype (core-only feature); added at the Webflow build.

## Concept: "Departures"

The hub is a **spaceport terminal**. The site already calls a project a *mission*, the process a *flight plan*, the form a *launch*. The hub is where you choose a flight. Nothing else on the site uses this language: Home has the light capabilities bento, Process has the orbiting star chart, Work has the mission deck, About has the badge. So the hub doesn't show services as planets on a chart or as a card grid. It shows them as a **departures board**, then a **route map**, then a **passport**.

Each service stays a planet (its CMS planet shows up on the boarding pass and at its airport on the map), so it still feels like the same universe.

## Sections (5)

| # | Section | What it does | Data (Services CMS) |
|---|---|---|---|
| 1 | **Departures board** (the hero) | A big split-flap board with 8 rows. Columns: Flight `AB-01…08` · Destination (short name) · Via (pairs with) · Gate (planet type: GAS / ICE / ROCKY / TERRA) · Status. It flaps in on load. Above it: crumb + REC, small title "Departures", one-line lede. Under it, **"What's wrong right now?"** with 8 symptom chips (each service's first problem, e.g. "The site is beautiful and slow."). Pick one and the board re-flaps: that row goes to **NOW BOARDING** and the others to ON TIME. Hovering a row makes its planet peek out past the board's right edge. | sort, name, short name, pairs with, planet type/colors, solve 1 problem, slug |
| 2 | **Boarding pass** (printed from the board) | Picking a row **prints a boarding pass**. It slides out of a slot under the board and hangs over the edge of the next section. Main part: planet, `AB-0N`, title 1 + outline title 2, summary, "Seat: best for", tool logos, "6 deliverables · 4 stages". Tear-off stub: **Board this flight →** (goes to `/services/[slug]` with the warp). Starts on flight AB-01. On phones the pass prints inline under the chosen row. | title 1/2, summary, best for, tools, deliverables (count), stages (count), planet |
| 3 | **Connecting flights** (light, full-bleed) | An airline-magazine route map on a dot grid, drawn flat like print, not orbits. 8 airports (planets as little map pins, IATA-style codes like WFD, I3D, MTN, BRD, BYD, CMS, DSY, PRF). Arcs show **Pairs with**. Click an airport and its routes light up, with a note on why they fly together. **Build an itinerary**: pick up to 3 airports and "Plan this itinerary →" goes to `/process#launch` with them already picked (writes `ab:dest`, which Process restores). Also **"Flown together"**: missions that used that pairing, as small linked tags. | pairs with, related missions, slug |
| 4 | **Passport** (flight log) | A passport open to a spread you can flip through (drag, arrows or swipe). Each spread is one mission, with **ink stamps** for the services it used. Stamps slam in with a little ink bleed as the spread comes into view. A stamp links to its service, the spread links to its mission. Reads as proof: "these services have flown real missions". | Services › related missions, flipped in code so it's grouped by mission (+ mission name/number/brand color from the site-data cache) |
| 5 | **Final call** (short CTA) | "Can't find your gate?" Two ways out: the Process star chart ("plot it with me") and the contact form. It uses the flight board's type at a smaller size, one row: `AB-09 · YOURS · CUSTOM CHARTER · GATE TBD · ON REQUEST`. | none |

No FAQ, no testimonials, no card grid. Every service's FAQ already lives on its own page.

## Divergence gate

| Declaration | How this page meets it |
|---|---|
| **Sequence deviation** | The hero *is* the index (the board replaces hero + 3-up service grid). Details are merged into it as a printed pass instead of 8 cards. FAQ and testimonials are cut. Proof comes as passport stamps, not a case-study slider. |
| **Structural break** | The boarding pass hangs over the edge from section 1 into section 2. Planets peek past the board's edge. The route map is full-bleed with no container. Stamps are rotated and overlap the passport gutter. |
| **Type moment** | **Split-flap characters** (JetBrains Mono on flip tiles, each letter in its own hinged cell). Used only on the board and the one-row final call echo, nowhere else on the site. |
| **Rhythm variation** | Tall, dark hero board (about 100vh plus the hanging pass) → full-bleed light map with no vertical padding at its edges → compact passport (about 70vh, centered object) → a single-row CTA strip. No two sections share height or padding. |

## Copy direction (drafts, refined in the prototype)

- Hero title "Departures", lede: *"Eight destinations, one pilot. Pick where your site needs to go."*
- Symptom prompt: *"What's wrong right now?"* / reset: *"Just browsing"*
- Map heading: *"Connecting flights"*. Sub: *"Most missions stop at more than one planet. These routes fly well together."*
- Passport heading: *"Stamped"*. Sub: *"Where these services have already flown."*
- Final call: *"Can't find your gate?"*
- Interactive 3D copy keeps to the agreed line: useful to clients and visitors, no "building globes".

## Glossary asides (proposed; added to the CMS at build)

- Board status NOW BOARDING: *"No, you won't miss it. This flight waits for you."*
- Split-flap board: *"Real ones clack. This one's quieter and never needs a mechanic."*
- Gate TBD on the final call: *"Custom charters get a gate the moment you tell me where you're going."*
- Passport cover: *"No photo required. I've seen your site already."* (maybe; could read as cheeky)

## How it maps to Webflow (stage 4 preview)

- **Static page** `/services` (a static page can share a slug with a collection, like `/work`). Duplicate About → remove its sections (the Process method).
- **Board rows = a Services Collection List** (sort asc) with real bound text (flight number from sort, short name, planet type, problem). Split-flap is a code layer that animates the bound text. The rows link to the template.
- **Boarding pass**: each board row holds its own pass (real, bound Webflow elements, hidden). Code moves the active one into the slot. Pairs with / Tools = nested lists in the row.
- **Map + passport**: drawn in code from `data-*` on the same list (slugs, pairs, missions) plus the site-data cache for mission names and colors. Real text links stay in the DOM as a fallback.
- **Code bundle `ab-hub`** (JS + CSS): flap engine, pass print, map arcs + itinerary, passport flip + stamps. Reuses core: planets, `AB.go`, `AB.tip`, `AB.dragCue` (passport drag), reduced motion (flaps just swap text, no stamp slam).
- **Risk**: 2–3 nested lists (Tools, Pairs with, Missions) inside one list on a static page. Webflow allows it but caps nested items. Fallback: read pairs/missions from the `ab:site` cache and keep only Tools nested.
- Then: Nav "Services" `/#capabilities` → `/services`, mobile menu, footer service column heading → `/services`.

## Questions for Angelino

1. Board row click: **print the pass** (proposed; the stub links to the page) or go straight to `/services/[slug]`?
2. Keep the **passport** section, or cut it to keep the page shorter (map → final call)?
3. Airport codes (WFD, I3D, MTN, BRD, BYD, CMS, DSY, PRF): fun, or too cute?

## Round 2 (Angelino, 2026-09-25): spaceport, CRT dashboard, clearer planner

Feedback: too airplane-y; switchboard instead of flippers ("like a monitor you click, an old-school spaceship dashboard"); the itinerary was confusing but worth fleshing out. Changes in the prototype:
- **Hero = Launch control.** Title "Launch / control". Airport words swapped for spaceport ones: Flight → Mission, Via → Transfer, Gate → Orbit, statuses STANDBY / GO FOR LAUNCH / PRIORITY GO / ON REQUEST. Diagnostics chips ("Run diagnostics · what's wrong right now?", reset "All clear"). Hero planet (draggable) = the armed launch's planet.
- **Dashboard.** A metal console with screws; a curved amber-phosphor **CRT** (scanlines, vignette, flicker, boot animation) shows the manifest; characters scramble digitally instead of flipping; the armed row is inverse video; a typed prompt line at the bottom. Under the screen: 8 **toggle switches + lamps** (one per launch, clickable), two dials, and the pass printer slot. This replaces the split-flap type moment.
- **Launch pass** (was boarding pass): Launch site → Destination, Crew seat, Orbit class, Transfers, Payload; stub "Cleared for launch · Board the launch →".
- **Plot a trajectory** (was Connecting flights): a 3-step planner. Step pills (Main destination · Stops up to 2 · Launch) + a hint chip on the map. One panel next to the map walks the steps: pick the main (map or chips) → recommended stops (its Pairs with, each with why + flown-together + Add) or any other stop → the trajectory readout (Earth → main → stops, a reason per leg or "custom transfer", missions that flew every selected service) → "Launch it in the flight planner". Map: main = orange ring + MAIN tag, stops numbered, recommended = spinning dashed ring + "+ Pairs well", others dimmed; orange path Earth → main → stops.
- **Crew logbook · Mission patches** (was passport stamps): embroidered patches (circle/shield, stitched edge) that drop in and settle.
- **Final call**: "Not on the manifest?" with the AB-09 line on a small CRT.

## Round 3 (Angelino): dashboard in the site's mission-control style

- The metal amber CRT looked out of place. The manifest now uses the **Mission debrief monitor**: `.mc` grid, `.mon` frame + REC/timecode bar, `.screen` with `.scan/.vig/.roll`, corner brackets, `CH 01 · Manifest` OSD, `.mon-cap` caption (holds the typed prompt), pass printer slot under the monitor. Site colors: soft/dust text, armed row = the orange channel-selected style, GO in telemetry green, PRIORITY blinks orange.
- The toggle switches + dials became a **side console**: "Launch keys" panel (8 key-numbered buttons with lamps, styled like the mission channel buttons) + a **Telemetry** panel (Destination, Orbit, Transfers, Status) for the armed launch.
- Webflow note: `.mc/.mon/.screen/.panel/.tele/.chans` styles live in the Mission bundle today; the hub build needs them site-wide (move to `ab-core.css`) or duplicated in the hub CSS.
- Print motion (rounds 2b/2c): transform-only feed (no clip-path, no stepped ease), pass refilled while hidden, hero planet repaint deferred to idle after landing, section padding eased.

## Round 4 (Angelino): data slate, in-page flight plan, clearer service links

- **Launch pass → translucent data slate**: dark glass (blur), hairline border, monitor-style corner brackets, service-color glowing top edge, one holographic sheen on landing. As wide as the printer slot (78% of the monitor; the console column is excluded), straight (no tilt). Stub = "Service briefing" pixel code + **Explore the service** button; the title is a link too ("Open service →"). ≤1200px the stub moves under the details. Feed = slide + slight tilt-to-flat, transform only.
- **Launch the flight plan stays on the page**: a hyperspace warp (streaks + flash) plays, the hidden `#flight` section fills and the page jumps to it under the warp. It's the Process route re-plotted for the trajectory: Earth pad, rocket on the lit path, 6 stage cards (main leg + a dashed line per stop, "See the … · mission" link), T-minus HUD, then **touchdown** on the main planet (stops orbit as moons), shockwave + confetti, "Mission live" + Request this mission / Book a call. "Edit trajectory ↑" goes back; the planner button becomes "Fly it again". Phones: vertical rail. Data: `STAGES` + `LEGS` (Services CMS Process leg 1–6).
- **Explore is obvious**: every manifest row has a labeled "Explore →" button (column "Service"); prompt line says "Click a launch for its pass · Explore opens the service".
- Test hook for headless shots: `?shim&at=flight-plan&fly=0,5,2&p=0.45`.

- Hero planet was sliced at the hero section's edge on wide screens (the section had `overflow-x:clip` but is a max-width `.wrap`). Removed; the body already clips horizontal overflow. Webflow: no overflow clip on `section_*` heroes that hold planets.

## Round 5 (Angelino)
- Logbook restyled as the glass slab (brand-color glow bar per mission, brackets, dashed center fold, sheen on every page turn). Patches → **digital badges** (hexagon / rounded-square glass tiles, service-color edge + glow, mono code, green 'Verified' dot, scanlines; they pop + flicker on).
- Explore buttons: screen sizing measures the real Explore width; slate column widened, label 'Explore service'. ≤1200px the side console stacks under the monitor (screen characters stay readable).
- Nav hide-on-scroll jitter fixed with hysteresis in **core/30-motion.js** (site-wide, ships with the next core deploy) and the prototype shell; the flight pin registers as `__abMissionST` so the nav holds still while flying.
- Picking a main no longer jumps the page: scroll anchoring off on the hub (it fought Lenis when the planner grew); the map is sticky beside the tall planner (≥992px).
- Flight plan header: lede under the heading, Edit trajectory at the far right.
- Logbook page-turn stutter: removed the logbook's backdrop-filter (the 3D turn re-blurred it every frame) and the blend-mode scanlines (logbook + slate); badges now have one drop-shadow + will-change so the pop/flicker moves a cached layer; turn sheet + sheen have will-change. Webflow: avoid backdrop-filter under anything that animates in 3D.
- Chips: every rounded pill on the hub is now the site's square mono chip (Process `.pr-chip` / Home `.pl-chip` style): diagnostics, planner picks, step pills, map hint, planet tags, Add stop; planner card + stop rows squared too.
- Badges: smaller (78–100px), all hexagons, fill tinted with the service color (white code), and they no longer re-animate on page turns (only the sheen sweeps).
- Planner guidance: the map hint sits against the panel and points at it (→ desktop, ↓ when stacked): 'Tap a planet, or pick in the panel' → 'Next: add stops in the panel' → 'Ready: launch from the panel'. The block to use next gets an orange bar + blinking NEXT tag; the panel pings (orange ring) whenever a map pick changes it; phones glide to the panel once after the first pick. `goTo` now hands Lenis a pixel number (element targets sent the page to the top).
- Logbook: the fixed sweep sheen is gone. Pointer-driven instead: 3D tilt like `AB.cardFx` (±3°, elastic return, off while dragging / touch / reduced motion), a glare layer (white + orange spotlight at the cursor, holographic band whose angle follows the pointer), and badges drift a few px against the tilt (`translate`). Webflow: reuse `AB.cardFx` + a glare pseudo.
- Slate gets the same pointer tilt + glare (shared `glass(el, skip)` helper; paused while the pass prints, landing sheen removed).
- **Abort mission ✕** in the flight plan header (next to Edit trajectory, far right): reverse warp (streaks collapse inward), the flight section empties + hides, its pin is killed, the page lands on the planner with the trajectory still selected; relaunch works.
