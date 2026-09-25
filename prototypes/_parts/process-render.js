  /* =========================================================
     PROCESS · the flight planner (static page; copy lives in the Designer)
     One route, eight destinations: pick a service on the star chart and the page re-plots.
     ========================================================= */
  var WORK = 'work-index.html', SVC = 'services.html#', MIS = 'mission-debrief.html#';
  // the six stages every mission flies (same as Home's mission sequence)
  var STAGES = [
    { code: 'Pre-flight', name: 'Discovery call', copy: 'A call to learn your goals, your audience and what a win looks like.', get: 'Creative brief', you: 'Share your goals, sites you like and any brand files.', flown: 'the brief' },
    { code: 'Flight plan', name: 'Alignment', copy: 'Scope, timeline and content plan agreed before any pixels move.', get: 'Plan + dates', you: 'Sign off on scope and dates.', flown: 'the plan' },
    { code: 'Payload', name: 'Brand + assets', copy: 'Logo, color, type, content and data, gathered or made, then turned into tokens.', get: 'Brand kit + tokens', you: 'Send what you have, or tell me to make it.', flown: 'the brand kit' },
    { code: 'Test flight', name: 'Prototype', copy: 'The key pieces, working and clickable, reviewed together before the build.', get: 'Clickable prototype', you: 'Two rounds of feedback, live or async.', flown: 'the prototype' },
    { code: 'Assembly', name: 'Build', copy: 'The real thing: built, wired to your content and tested on real devices.', get: 'Staging link', you: 'Load content and test on your own devices.', flown: 'the build' },
    { code: 'Launch', name: 'Deploy', copy: 'Go live, connect analytics and hand over a guide so your team owns it.', get: 'Live + handoff', you: 'Celebrate. Then tell people.', flown: 'the live result' }
  ];
  // the eight destinations (Services CMS): planet, flight plan and the destination-specific leg at each stage
  var DEST = [
    { slug: 'webflow-development', t1: 'Webflow', t2: 'development', short: 'Website', c: '#146EF5', p: ['gas', '#0d2a66,#146EF5,#8fb8ff,#e8f0ff,#1d2350', '#cfe0ff,#146EF5,#0d2a66', 'rgba(20,110,245,.4)'],
      sum: 'Sites your team can actually edit. Planned, designed in Figma and built in Webflow from the ground up.',
      plan: ['Discovery', 'Plan + design', 'Build', 'Launch + handoff'], flown: ['daniel-aguirre-law', 'Daniel Aguirre Law'], eta: [1, 1, 1, 1, 1, 0],
      legs: ['Goals, audience and what the site has to do.', 'Sitemap, content plan and wireframes, signed off before design.', 'Brand, copy and photos gathered, then turned into design tokens.', 'Key pages designed in Figma and clicked through as a prototype.', 'Built in Webflow from the ground up: components, CMS, motion.', 'QA, a Lighthouse pass, launch day and a walkthrough for your team.'] },
    { slug: 'webgl-data', t1: 'Interactive', t2: '3D + data', short: 'Interactive 3D', c: '#5eead4', p: ['ice', '#0f1a1d,#1c2227,#37535a,#5a8a94,#b8c9cc', '#5eead4,#37535a,#1c2227', 'rgba(94,234,212,.4)'],
      sum: 'Interactive 3D and data in Webflow, fed by the CMS: things visitors can turn, zoom and use to decide.',
      plan: ['Data audit', 'Prototype', 'Build + wire', 'Tune'], flown: ['510-visuals', '510 Visuals'], eta: [0, 1, 0, 2, 2, 0],
      legs: ['What visitors should understand, and what data or models you already have.', 'Data audit: where it lives, what it should show, what the scene is for.', 'Models, product shots, datasets or locations, cleaned up for the web.', 'A rough, working 3D prototype to react to early, on your own phone.', 'Styled, interactive and reading from your CMS, so new items update the scene.', 'Performance, mobile gestures and fallbacks tuned, then handed off.'] },
    { slug: 'motion', t1: 'Motion +', t2: 'interaction', short: 'Motion', c: '#0AE448', p: ['gas', '#0a3d22,#0AE448,#9dffc2,#e9fff1,#073d20', '', 'rgba(10,228,72,.35)'],
      sum: 'Scroll systems, drag physics and micro-interactions with easing tuned by hand.',
      plan: ['Moments', 'Prototype', 'Refine', 'Harden'], flown: ['510-visuals', '510 Visuals'], eta: [0, 0, 0, 2, 0, 0],
      legs: ['What the site should feel like, and where visitors get stuck or bored.', 'Pick the two or three moments where motion earns its keep.', 'Easing, timing and states defined as a small motion system.', 'Rough versions tried on real devices before anything is polished.', 'Timing and easing tuned by hand until it feels right.', 'Reduced motion, performance and mobile checks, then shipped.'] },
    { slug: 'branding', t1: 'Logo +', t2: 'identity', short: 'Brand', c: '#FF6A3D', p: ['gas', '#3b1f12,#a44a1f,#ff8a4c,#ffd29a,#6b2b16', '#ffd29a,#ff6a3d,#6b2b16', 'rgba(255,106,61,.4)'],
      sum: 'Logos, color, type and brand rules built on a grid, so they hold up from a favicon to a billboard.',
      plan: ['Discovery', 'Directions', 'Refine', 'System'], flown: ['ab-identity', 'AB Identity'], eta: [0, 1, 2, 0, 0, 1],
      legs: ['Who you are, who you serve and what you want to feel like.', 'Scope the kit: mark, color, type and everywhere it has to live.', 'Sketches, references and your existing assets gathered.', 'Two or three distinct directions to react to.', 'One direction, refined on a grid and tested from favicon to billboard.', 'Guidelines, files and assets, ready to use on day one.'] },
    { slug: 'custom-deploys', t1: 'Beyond', t2: 'Webflow', short: 'Custom build', c: '#C9C7C0', p: ['rocky', '#1b1b1f,#3a3a44,#8a8fa3,#e9eaf0', '', 'rgba(242,240,234,.25)'],
      sum: 'Coded sites in Astro or Next.js on Vercel, Netlify or Cloudflare, when Webflow is not the right fit.',
      plan: ['Fit check', 'Design', 'Build', 'Ship'], flown: null, eta: [2, 1, 1, 1, 2, 1],
      legs: ['What you are building, and whether a coded build is actually the right call.', 'Stack, hosting and integrations chosen, with a plan for who edits what.', 'Content, brand and data sources lined up.', 'Designed in Figma first, same as any mission.', 'Components, content and integrations built and wired.', 'Deploy pipeline, monitoring and a handoff.'] },
    { slug: 'cms-integrations', t1: 'Content that', t2: 'syncs itself', short: 'CMS sync', c: '#8fb1ff', p: ['ice', '#1d2350,#3f4fa8,#8fb1ff,#e9d9ff', '#9fe8ff,#3f4fa8,#1d2350', 'rgba(143,177,255,.4)'],
      sum: 'Airtable, Google Sheets or any API piped into the Webflow CMS, with pages that build themselves.',
      plan: ['Map the content', 'Model it', 'Connect', 'Test'], flown: ['knowledge-system', 'Knowledge System'], eta: [1, 2, 0, 0, 2, 1],
      legs: ['What content you have, where it lives and who updates it.', 'Map the content: collections, fields and how they connect.', 'Source data cleaned up: Airtable, Sheets or an API.', 'A test sync on a few items and one template, to check the model.', 'Sync the source and wire the templates, filters and references.', 'Edge cases, limits and editor training, then it runs on its own.'] },
    { slug: 'design-systems', t1: 'Tokens +', t2: 'type scales', short: 'Design system', c: '#7c5cff', p: ['terra', '#2b1f5c,#7c5cff,#b8a6ff,#e9d9ff,#1d2350', '', 'rgba(124,92,255,.4)'],
      sum: 'Variables, components and type scales that keep page ten as sharp as page one.',
      plan: ['Audit', 'Tokens', 'Components', 'Document'], flown: ['ab-identity', 'AB Identity'], eta: [1, 0, 1, 0, 0, 2],
      legs: ['Where the brand and product drift, and who has to use the system.', 'Audit what exists and agree what the system covers.', 'Tokens: color, type, spacing and motion, defined once.', 'Core components built in Figma and tried on a real page.', 'Components built in Webflow with the same names as Figma.', 'Rules and examples your team can follow, plus a walkthrough.'] },
    { slug: 'performance', t1: 'Heavy visuals,', t2: 'fast pages', short: 'Performance', c: '#ffd166', p: ['rocky', '#3b1f12,#a44a1f,#ff8a4c,#ffd29a', '', 'rgba(255,209,102,.35)'],
      sum: 'Lazy-loaded WebGL, reduced-motion fallbacks and a Lighthouse pass on every page.',
      plan: ['Measure', 'Prioritize', 'Fix', 'Verify'], flown: ['daniel-aguirre-law', 'Daniel Aguirre Law'], eta: [1, 0, 0, 1, 0, 0],
      legs: ['Which pages feel slow, and for whom.', 'Baseline scores and real-device recordings.', 'Prioritize what visitors actually feel first.', 'Fix one heavy page end to end and measure it.', 'Images, scripts, loading and motion fixed across the site.', 'Measure again and write up what changed.'] }
  ];
  // what moves the timeline (no numbers: every mission gets real dates after the discovery call)
  var FACTORS = [
    { k: 'Scope', q: 'How big is it?', o: ['A few pages', 'A full site', 'A platform'] },
    { k: 'Content', q: 'Is the copy ready?', o: ['Ready to go', 'Partly there', 'From zero'] },
    { k: 'Brand', q: 'Is the brand set?', o: ['Ready', 'Needs a refresh', 'From scratch'] },
    { k: '3D + motion', q: 'Anything custom?', o: ['None', 'A few moments', 'A signature piece'] },
    { k: 'Data', q: 'Where does content live?', o: ['Static', 'In a CMS', 'Synced sources'] },
    { k: 'Sign-off', q: 'Who makes the call?', o: ['One person', 'Two or three', 'A committee'] }
  ];
  var FAQS = [
    ['How long does a mission take?', 'It depends on the scope. After the discovery call you get a flight plan with a date for every stage, so you always know what is next and when it lands.'],
    ['How is pricing worked out?', 'Every mission gets a fixed quote once the scope is clear, broken down by stage. The mission planner shows the budget ranges most projects fall into.'],
    ['What do you need from me?', 'A clear brief, one person who can make the call, your content (or a plan for it) and feedback at each checkpoint. The "Your part" line on every stage spells it out.'],
    ['I don\'t have copy or photos yet. Is that a problem?', 'No. That is what the payload stage is for. I can write the copy, source or art-direct photos, or plan the build around what is still coming.'],
    ['How many rounds of changes do I get?', 'Two rounds of feedback on the prototype, live or async, plus fixes during the build. A bigger change of direction gets planned in, not squeezed in.'],
    ['What happens after launch?', 'You get a walkthrough and a written guide, and your team owns the site, the files and the code. If you want help after launch, we plan that too.']
  ];
  var BUDGETS = ['< $20k', '$20–40k', '$40–60k', '$60–80k', '$80–100k', 'Not sure yet'];
  var prTick = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 6.5l3 3 6-7"/></svg>';
  function planetAttrs(d, seed){ return 'data-planet="' + d.p[0] + '" data-seed="' + seed + '" data-colors="' + d.p[1] + '"' + (d.p[2] ? ' data-ring="' + d.p[2] + '" data-tilt="-16"' : '') + ' data-spin="50" data-glow="' + d.p[3] + '"'; }

  var H = '';
  // 1 · hero: the countdown
  H += '<section class="dbh wrap pr-hero" id="hero" data-frame="launch-sequence">' +
    '<div class="dbh-top"><div class="crumb mono"><a href="' + HOME + '#top">/home</a> / <b>process</b></div><span class="pr-rec mono"><i aria-hidden="true"></i>Mission control · live</span></div>' +
    '<div class="pwrap pr-hero-planet" id="prHeroPlanet" ' + planetAttrs(DEST[0], 11) + ' data-drag data-label="Destination · ' + DEST[0].short + '"></div>' +
    '<div class="pr-hgrid"><div>' +
      '<div class="dbh-eyebrow mono">Flight plan · every mission</div>' +
      '<h1 class="dbh-title" id="heroTitle"><span class="w">The flight</span> <span class="w t-outline">plan</span></h1>' +
      '<p class="dbh-sum">Six stages, every time. Pick where you\'re headed and the route re-plots: the stages stay the same, the work inside them changes.</p>' +
      '<div class="pr-hcta"><a class="btn btn-primary magnetic" href="#chart"><span class="shine" aria-hidden="true"></span><span>Pick a destination</span><span class="arr" aria-hidden="true">↓</span></a><a class="btn btn-ghost magnetic" href="#launch"><span>Plan a mission</span></a></div>' +
    '</div>' +
    '<div class="pr-count selectable" data-name="Countdown / T-minus" aria-label="Countdown to launch"><span class="pr-count-n" id="prCount">T<b>−</b>6</span>' +
      '<div class="pr-count-l"><span>Countdown to launch</span><span><i class="pr-dot"></i>Destination · <b id="prHeroDest">' + DEST[0].short + '</b></span></div></div>' +
    '</div></section>';

  // 2 · star chart
  var ORB = [0.36, 0.52, 0.68, 0.84];
  H += '<section class="wrap pr-stars" id="chart" data-frame="star-chart">' +
    '<div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/destinations · ' + DEST.length + ' services</span><h2 class="h2 split">Pick a <span class="t-outline">destination</span></h2></div><p class="lede">Every service is a planet. Pick one and the rest of this page re-plots the route for it.</p></div>' +
    '<div class="pr-chart-grid"><div class="pr-chart" id="prChart" role="radiogroup" aria-label="Destinations">' +
      ORB.map(function(r){ return '<span class="pr-orbit" style="width:' + (r * 100) + '%;height:' + (r * 100) + '%"></span>'; }).join('') +
      '<div class="pr-sun" aria-hidden="true"><span>You · the brief</span></div>' +
      '<div class="pr-spin">' + DEST.map(function(d, i){
        var r = ORB[i % 4] / 2 * 100, a = (i * 45 + (i % 2 ? 20 : 0) - 90) * Math.PI / 180, s = [46, 52, 60, 66][i % 4];
        return '<button type="button" class="pr-dest' + (i === 0 ? ' is-on' : '') + '" role="radio" aria-checked="' + (i === 0) + '" data-i="' + i + '" style="left:' + (50 + Math.cos(a) * r).toFixed(2) + '%;top:' + (50 + Math.sin(a) * r).toFixed(2) + '%;--s:' + s + 'px" aria-label="' + esc(d.t1 + ' ' + d.t2) + '">' +
          '<span class="pr-counter"><span class="pr-pl pwrap" ' + planetAttrs(d, 20 + i) + '></span><span class="pr-sel" aria-hidden="true"></span><span class="pr-tag">' + esc(d.short) + '</span></span></button>';
      }).join('') + '</div>' +
    '</div>' +
    '<aside class="pr-panel selectable" data-name="Panel / destination" aria-live="polite"><div class="pr-panel-h"><span>Destination locked</span><b id="prPanelShort">' + DEST[0].short + '</b></div>' +
      '<div class="pr-panel-b"><h3 class="pr-panel-t" id="prPanelT"><span>' + DEST[0].t1 + '</span><span class="t-outline">' + DEST[0].t2 + '</span></h3>' +
      '<p class="pr-panel-s" id="prPanelS">' + DEST[0].sum + '</p>' +
      '<ol class="pr-panel-legs" id="prPanelPlan"></ol>' +
      '<div class="pr-panel-a"><a class="btn btn-ghost magnetic" id="prPanelLink" href="' + SVC + DEST[0].slug + '" target="_blank" rel="noopener"><span>Service page</span><span class="arr" aria-hidden="true">→</span></a><a class="btn btn-primary magnetic" href="#route"><span class="shine" aria-hidden="true"></span><span>Plot the course</span><span class="arr" aria-hidden="true">↓</span></a></div></div></aside>' +
    '</div></section>';

  // 3 · trajectory (cards filled by fillRoute)
  H += '<section class="pr-traj" id="route" data-frame="trajectory"><div class="wrap"><div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/trajectory · 6 waypoints</span><h2 class="h2 split">The <span class="t-outline">route</span></h2></div><p class="lede">Scroll to fly it. Each waypoint shows what happens, what you get and what I need from you.</p></div></div>' +
    '<div class="pr-track-wrap"><div class="pr-hud" id="prHud"><b id="prHudN">T−6</b><span id="prHudL">On the pad</span></div><div class="pr-track" id="prTrack">' +
      '<svg class="pr-path" id="prPath" aria-hidden="true"><path class="pr-line" id="prLine"/><path class="pr-lit" id="prLit"/></svg>' +
      '<div class="pr-launchpad" id="prPad" aria-hidden="true"><div class="pwrap" data-planet="terra" data-seed="7" data-colors="#0b2a4a,#1f6fb2,#3fa66b,#a88b5c,#f2f0ea" data-spin="80" data-glow="rgba(76,141,255,.35)"></div><span>Earth · your brief</span></div>' +
      '<div class="pr-ship" id="prShip" aria-hidden="true"><svg viewBox="0 0 44 44"><path class="pr-flame" d="M6 22 L-8 17 L-4 22 L-8 27 Z" fill="#FF6A3D"/><path d="M6 14 H26 L40 22 L26 30 H6 Z" fill="#F2F0EA"/><path d="M14 14 L10 6 H18 L22 14 Z M14 30 L10 38 H18 L22 30 Z" fill="#8A8FA3"/><circle cx="28" cy="22" r="3.5" fill="#4C8DFF"/></svg></div>' +
      STAGES.map(function(s, i){
        return '<div class="pr-wp" data-wp="' + i + '"><span class="pr-node" aria-hidden="true"></span><article class="pr-card selectable" data-name="Waypoint / ' + s.code.toLowerCase() + '">' +
          '<div class="pr-card-c"><span><b>T−' + (5 - i) + '</b> · ' + s.code + '</span><span>' + (i + 1) + ' / 6</span></div>' +
          '<h3>' + s.name + '</h3><p>' + s.copy + '</p>' +
          '<div class="pr-leg"><small class="pr-leg-h">For ' + DEST[0].short + '</small><span class="pr-leg-t"></span></div>' +
          '<dl><div><dt>You get</dt><dd>' + s.get + '</dd></div><div><dt>Your part</dt><dd>' + s.you + '</dd></div></dl>' +
          '<a class="pr-flown" href="#" target="_blank" rel="noopener"></a></article></div>';
      }).join('') +
    '</div></div></section>';

  // 4 · crew roles (light)
  var ME = ['Plan the route and keep the dates', 'Design and build every piece', 'Write the code and host it on GitHub', 'Tell you early when something changes', 'Hand over the keys, the guide and the files'];
  var YOU = ['Share the brief and the sites you like', 'Pick one person to make the call', 'Send content, or tell me to make it', 'Give feedback at each checkpoint', 'Tell people when it launches'];
  function list(a){ return '<ul>' + a.map(function(t){ return '<li><span class="pr-tick">' + prTick + '</span><span>' + t + '</span></li>'; }).join('') + '</ul>'; }
  H += '<section class="wrap theme-light pr-crew" data-frame="crew-roles"><div class="light-glow top" aria-hidden="true"></div><div class="light-glow bot" aria-hidden="true"></div><div class="light-bg" aria-hidden="true"></div>' +
    '<div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/crew · who does what</span><h2 class="h2 split">Crew <span class="t-outline">roles</span></h2></div><p class="lede">Two seats in the cockpit. Here is who flies what, so nothing falls between them.</p></div>' +
    '<div class="pr-crew-grid"><div class="pr-crew-col selectable" data-name="Card / mission-control"><h3>Mission control <small>Me</small></h3>' + list(ME) + '</div>' +
      '<div class="pr-link" aria-hidden="true"><span>Comms open</span></div>' +
      '<div class="pr-crew-col selectable" data-name="Card / crew"><h3>Crew <small>You</small></h3>' + list(YOU) + '</div></div>' +
    '<div class="pr-comms"><b>Comms</b><span>Updates at every waypoint</span><span>A shared board you can check any time</span><span>A real person on the other end</span></div>' +
    '</section>';

  // 5 · what moves the timeline
  H += '<section class="wrap pr-eta" id="eta" data-frame="timeline"><div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/eta · no guesses</span><h2 class="h2 split">What moves the <span class="t-outline">timeline</span></h2></div><p class="lede">Every mission gets real dates after the discovery call. These are the things that stretch or shorten the route.</p></div>' +
    '<div class="pr-eta-grid"><div class="pr-factors" id="prFactors">' + FACTORS.map(function(f, i){
      return '<div class="pr-factor"><div class="pr-factor-n">' + f.k + '<b>' + f.q + '</b></div><div class="pr-seg" role="group" aria-label="' + f.k + '">' + f.o.map(function(o, j){ return '<button type="button" data-f="' + i + '" data-v="' + j + '" aria-pressed="false">' + o + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>' +
    '<div class="pr-gauge selectable" data-name="Gauge / route length" aria-live="polite"><svg viewBox="0 0 300 170"><path class="pr-arc" d="M30 150 A120 120 0 0 1 270 150"/><path class="pr-arc-on" id="prArc" d="M30 150 A120 120 0 0 1 270 150"/>' +
      '<g id="prNeedle"><line x1="150" y1="150" x2="150" y2="52" stroke="#F2F0EA" stroke-width="2"/><circle cx="150" cy="150" r="7" fill="#F2F0EA"/></g>' +
      '<text class="pr-tickl" x="18" y="168">Short hop</text><text class="pr-tickl" x="150" y="18" text-anchor="middle">Standard orbit</text><text class="pr-tickl" x="282" y="168" text-anchor="end">Deep space</text></svg>' +
      '<div class="pr-gauge-o"><b id="prEtaT">Standard orbit</b><p id="prEtaP"></p></div><div class="pr-adds" id="prAdds"></div>' +
      '<div class="pr-note">Not a quote · real dates come with the flight plan</div></div>' +
    '</div></section>';

  // 6 · FAQ
  H += '<section class="wrap pr-faq" data-frame="faq"><div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/faq · before we fly</span><h2 class="h2 split">Flight <span class="t-outline">checks</span></h2></div><p class="lede">The questions most crews ask before launch.</p></div>' +
    '<div class="faq">' + FAQS.map(function(f){ return '<details class="selectable" data-name="FAQ / item"><summary>' + esc(f[0]) + '<span class="pm" aria-hidden="true">+</span></summary><p>' + esc(f[1]) + '</p></details>'; }).join('') + '</div></section>';

  // 7 · launch: plan this mission, on this page
  H += '<section class="wrap pr-launch" id="launch" data-frame="launch"><div class="pr-launch-grid"><div class="pr-launch-copy">' +
      '<span class="eyebrow">/launch · plan this mission</span><h2 class="h2 split">Ready for <span class="t-outline">launch?</span></h2>' +
      '<p class="lede">Tell me where you\'re headed. You\'ll hear back with a time for the discovery call, and the countdown starts there.</p>' +
      '<ul><li><b>01</b>Pick a destination (it follows the star chart)</li><li><b>02</b>Tell me what you\'re launching</li><li><b>03</b>We book the discovery call</li></ul></div>' +
    '<form class="pr-form selectable" data-name="Form / mission request" id="prForm" novalidate><div class="pr-form-h"><span>Mission request</span><span>Destination · <b id="prFormDest">' + DEST[0].short + '</b></span></div>' +
      '<div class="pr-form-b"><div><span class="pr-fl" id="prChipsL">Destination</span><div class="pr-chips" role="group" aria-labelledby="prChipsL">' + DEST.map(function(d, i){ return '<button type="button" class="pr-chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '" style="--c:' + d.c + '"><i aria-hidden="true"></i>' + esc(d.short) + '</button>'; }).join('') + '</div></div>' +
      '<div class="pr-row2"><label><span class="pr-fl">Name</span><input class="pr-in" name="name" autocomplete="name" required></label><label><span class="pr-fl">Email</span><input class="pr-in" type="email" name="email" autocomplete="email" required></label></div>' +
      '<label><span class="pr-fl">Budget</span><select class="pr-in" name="budget">' + BUDGETS.map(function(b, i){ return '<option' + (i === 1 ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></label>' +
      '<label><span class="pr-fl">What are you launching?</span><textarea class="pr-in" name="brief" placeholder="A few lines about the project, the audience and the date you have in mind."></textarea></label>' +
      '<input type="hidden" name="destination" id="prDestField" value="' + DEST[0].t1 + ' ' + DEST[0].t2 + '"><div class="pr-err" id="prErr" role="alert"></div>' +
      '<button class="btn btn-primary magnetic" type="submit"><span class="shine" aria-hidden="true"></span><span>Launch the mission</span><span class="arr" aria-hidden="true">→</span></button></div>' +
      '<div class="pr-sent" role="status"><div><b>Transmission received</b><p>Talk soon. The countdown starts with the discovery call.</p></div></div>' +
      '<svg class="pr-rocket" id="prRocket" viewBox="0 0 40 80" aria-hidden="true"><path d="M20 2 C30 14 32 34 30 52 H10 C8 34 10 14 20 2 Z" fill="#F2F0EA"/><circle cx="20" cy="26" r="5" fill="#4C8DFF"/><path d="M10 44 L2 60 L10 56 Z M30 44 L38 60 L30 56 Z" fill="#8A8FA3"/><path d="M13 54 L20 78 L27 54 Z" fill="#FF6A3D"/></svg>' +
    '</form></div></section>';

  $('#process').innerHTML = H;
  document.title = 'Process · The flight plan · Angelino Barajas';
