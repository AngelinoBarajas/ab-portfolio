  /* =========================================================
     SERVICES HUB · launch control (static page; Services CMS is the data source)
     A spaceship dashboard: the CRT manifest is the index, arming a launch prints a launch pass,
     the trajectory planner builds a multi-stop mission, the crew logbook shows where each service has flown.
     ========================================================= */
  var WORK = 'work-index.html', SVC = 'services.html#', MIS = 'mission-debrief.html#', PROC = 'process.html';
  // Services CMS (sort order). code = airport code, via = Pairs with, flown = Related missions
  var HUB = [
    { slug: 'webflow-development', code: 'WFD', t1: 'Webflow', t2: 'development', short: 'Website', c: '#146EF5', p: ['gas', '#0d2a66,#146EF5,#8fb8ff,#e8f0ff,#1d2350', '#cfe0ff,#146EF5,#0d2a66', 'rgba(20,110,245,.4)'],
      sum: 'Sites your team can actually edit. Planned, designed in Figma and built in Webflow from the ground up, with clean classes, a CMS that makes sense and motion that survives a copy edit.',
      best: 'Marketing sites, portfolios, studios', tools: ['Webflow', 'Client-First', 'GSAP', 'Figma'], via: ['cms-integrations', 'motion'],
      flown: ['510-visuals', 'daniel-aguirre-law', 'knowledge-system', 'halcyon-architects'], problem: 'Every text change needs a developer.' },
    { slug: 'webgl-data', code: 'I3D', t1: 'Interactive', t2: '3D + data', short: 'Interactive 3D', c: '#5eead4', p: ['ice', '#0f1a1d,#1c2227,#37535a,#5a8a94,#b8c9cc', '#5eead4,#37535a,#1c2227', 'rgba(94,234,212,.4)'],
      sum: 'Interactive 3D and data in Webflow, fed by the CMS: product viewers, explorable spaces, maps and charts visitors can turn, zoom and use to decide.',
      best: 'Studios, firms and brands with reach', tools: ['Three.js', 'D3', 'Webflow', 'GitHub'], via: ['cms-integrations', 'performance'],
      flown: ['510-visuals', 'daniel-aguirre-law'], problem: 'Your reach is a paragraph nobody reads.' },
    { slug: 'motion', code: 'MTN', t1: 'Motion +', t2: 'interaction', short: 'Motion', c: '#0AE448', p: ['gas', '#0a3d22,#0AE448,#9dffc2,#e9fff1,#073d20', '', 'rgba(10,228,72,.35)'],
      sum: 'Scroll systems, drag physics and micro-interactions with easing tuned by hand. Motion that explains, rewards and makes a site feel alive, without getting in the way.',
      best: 'Launches, portfolios, product stories', tools: ['GSAP', 'Lenis', 'Webflow', 'Figma'], via: ['webflow-development', 'performance'],
      flown: ['510-visuals', 'daniel-aguirre-law', 'ab-identity'], problem: 'The site is static and forgettable.' },
    { slug: 'branding', code: 'BRD', t1: 'Logo +', t2: 'identity', short: 'Brand', c: '#FF6A3D', p: ['gas', '#3b1f12,#a44a1f,#ff8a4c,#ffd29a,#6b2b16', '#ffd29a,#ff6a3d,#6b2b16', 'rgba(255,106,61,.4)'],
      sum: 'Logos, color, type and brand rules built on a grid, so they hold up from a favicon to a billboard, and give your website something real to stand on.',
      best: 'New ventures, rebrands, founders', tools: ['Figma', 'Illustrator', 'Brand guidelines'], via: ['design-systems', 'webflow-development'],
      flown: ['ab-identity', 'northwind-roasters'], problem: 'The logo falls apart at small sizes.' },
    { slug: 'custom-deploys', code: 'BYD', t1: 'Beyond', t2: 'Webflow', short: 'Custom build', c: '#C9C7C0', p: ['rocky', '#1b1b1f,#3a3a44,#8a8fa3,#e9eaf0', '', 'rgba(242,240,234,.25)'],
      sum: 'Coded sites in Astro or Next.js, deployed on Vercel, Netlify or Cloudflare, for the projects where Webflow is not the right fit. Same care, different engine.',
      best: 'Apps, heavy data, custom backends', tools: ['Astro', 'Next.js', 'Vercel', 'GitHub'], via: ['webgl-data', 'performance'],
      flown: [], problem: 'Webflow can\'t do what you need.' },
    { slug: 'cms-integrations', code: 'CMS', t1: 'Content that', t2: 'syncs itself', short: 'CMS sync', c: '#8fb1ff', p: ['ice', '#1d2350,#3f4fa8,#8fb1ff,#e9d9ff', '#9fe8ff,#3f4fa8,#1d2350', 'rgba(143,177,255,.4)'],
      sum: 'Airtable, Google Sheets or any API piped into the Webflow CMS, with filters, multi-references and pages that build themselves. The connected content system behind the site.',
      best: 'Directories, catalogs, content hubs', tools: ['Webflow CMS', 'Airtable', 'Finsweet', 'APIs'], via: ['webflow-development', 'webgl-data'],
      flown: ['510-visuals', 'daniel-aguirre-law', 'knowledge-system', 'halcyon-architects'], problem: 'Content lives in five places.' },
    { slug: 'design-systems', code: 'DSY', t1: 'Tokens +', t2: 'type scales', short: 'Design system', c: '#7c5cff', p: ['terra', '#2b1f5c,#7c5cff,#b8a6ff,#e9d9ff,#1d2350', '', 'rgba(124,92,255,.4)'],
      sum: 'Variables, components and type scales that keep page ten as sharp as page one, in Figma and in Webflow, named the same in both.',
      best: 'Growing sites and teams', tools: ['Figma', 'Webflow variables', 'Client-First'], via: ['branding', 'webflow-development'],
      flown: ['ab-identity', 'daniel-aguirre-law', 'knowledge-system', 'pulse-fitness'], problem: 'Every new page drifts a little further.' },
    { slug: 'performance', code: 'PRF', t1: 'Heavy visuals,', t2: 'fast pages', short: 'Performance', c: '#ffd166', p: ['rocky', '#3b1f12,#a44a1f,#ff8a4c,#ffd29a', '', 'rgba(255,209,102,.35)'],
      sum: 'Lazy-loaded WebGL, reduced-motion fallbacks and a Lighthouse pass on every page. Ambitious visuals that still load fast on a phone on the train.',
      best: 'Visual-heavy sites, existing builds', tools: ['Lighthouse', 'WebPageTest', 'GSAP', 'Webflow'], via: ['webgl-data', 'motion'],
      flown: ['510-visuals', 'daniel-aguirre-law'], problem: 'The site is beautiful and slow.' }
  ];
  // Missions CMS (number order): name, client, status, brand accent. Placeholders link to the archive.
  var FLIGHTS = [
    { slug: '510-visuals', no: '01', name: '510 Visuals', client: '5 TEN · Brooklyn Navy Yard', status: 'Live', c: '#5eead4' },
    { slug: 'daniel-aguirre-law', no: '02', name: 'Daniel Aguirre Law', client: 'Law Firm of Daniel Aguirre · Wallingford, CT', status: 'Live', c: '#891E2D' },
    { slug: 'ab-identity', no: '03', name: 'AB Identity', client: 'Angelino Barajas · self-initiated', status: 'Shipped', c: '#FF6A3D' },
    { slug: 'knowledge-system', no: '04', name: 'Knowledge System', client: 'Add-on · for any Webflow site', status: 'In orbit', c: '#a597ff' },
    { slug: 'northwind-roasters', no: '05', name: 'Northwind Roasters', client: 'Placeholder · small-batch coffee', status: 'Placeholder', c: '#e0a45e' },
    { slug: 'pulse-fitness', no: '06', name: 'Pulse Fitness', client: 'Placeholder · boutique studio app', status: 'Placeholder', c: '#4cf2a0' },
    { slug: 'halcyon-architects', no: '07', name: 'Halcyon Architects', client: 'Placeholder · architecture studio', status: 'Placeholder', c: '#c2412d' }
  ];
  // why two services fly well together (one line per Pairs-with route)
  var WHY = {
    'cms-integrations|webflow-development': 'Pages that build themselves from the content you already keep.',
    'motion|webflow-development': 'Motion hooks onto the same classes, so it survives a copy edit.',
    'cms-integrations|webgl-data': 'New CMS items show up in the scene without touching code.',
    'performance|webgl-data': 'Heavy 3D that still loads fast on a phone.',
    'motion|performance': 'Smooth on a flagship and on a five-year-old phone.',
    'branding|design-systems': 'The brand becomes tokens, so every page inherits it.',
    'branding|webflow-development': 'A brand with somewhere real to live on day one.',
    'custom-deploys|webgl-data': 'When the scene needs its own app or a custom backend.',
    'custom-deploys|performance': 'Coded builds, measured the same way.',
    'design-systems|webflow-development': 'Figma and Webflow named the same, so nothing drifts.'
  };
  // the six stages every mission flies (same as the Process page) + each service's leg at every stage (Services CMS: Process leg 1–6)
  var STAGES = [
    { code: 'Pre-flight', name: 'Discovery call', copy: 'A call to learn your goals, your audience and what a win looks like.', get: 'Creative brief', you: 'Share your goals, sites you like and any brand files.', flown: 'the brief' },
    { code: 'Flight plan', name: 'Alignment', copy: 'Scope, timeline and content plan agreed before any pixels move.', get: 'Plan + dates', you: 'Sign off on scope and dates.', flown: 'the plan' },
    { code: 'Payload', name: 'Brand + assets', copy: 'Logo, color, type, content and data, gathered or made, then turned into tokens.', get: 'Brand kit + tokens', you: 'Send what you have, or tell me to make it.', flown: 'the brand kit' },
    { code: 'Test flight', name: 'Prototype', copy: 'The key pieces, working and clickable, reviewed together before the build.', get: 'Clickable prototype', you: 'Two rounds of feedback, live or async.', flown: 'the prototype' },
    { code: 'Assembly', name: 'Build', copy: 'The real thing: built, wired to your content and tested on real devices.', get: 'Staging link', you: 'Load content and test on your own devices.', flown: 'the build' },
    { code: 'Launch', name: 'Deploy', copy: 'Go live, connect analytics and hand over a guide so your team owns it.', get: 'Live + handoff', you: 'Celebrate. Then tell people.', flown: 'the live result' }
  ];
  var LEGS = {
    'webflow-development': ['Goals, audience and what the site has to do.', 'Sitemap, content plan and wireframes, signed off before design.', 'Brand, copy and photos gathered, then turned into design tokens.', 'Key pages designed in Figma and clicked through as a prototype.', 'Built in Webflow from the ground up: components, CMS, motion.', 'QA, a Lighthouse pass, launch day and a walkthrough for your team.'],
    'webgl-data': ['What visitors should understand, and what data or models you already have.', 'Data audit: where it lives, what it should show, what the scene is for.', 'Models, product shots, datasets or locations, cleaned up for the web.', 'A rough, working 3D prototype to react to early, on your own phone.', 'Styled, interactive and reading from your CMS, so new items update the scene.', 'Performance, mobile gestures and fallbacks tuned, then handed off.'],
    'motion': ['What the site should feel like, and where visitors get stuck or bored.', 'Pick the two or three moments where motion earns its keep.', 'Easing, timing and states defined as a small motion system.', 'Rough versions tried on real devices before anything is polished.', 'Timing and easing tuned by hand until it feels right.', 'Reduced motion, performance and mobile checks, then shipped.'],
    'branding': ['Who you are, who you serve and what you want to feel like.', 'Scope the kit: mark, color, type and everywhere it has to live.', 'Sketches, references and your existing assets gathered.', 'Two or three distinct directions to react to.', 'One direction, refined on a grid and tested from favicon to billboard.', 'Guidelines, files and assets, ready to use on day one.'],
    'custom-deploys': ['What you are building, and whether a coded build is actually the right call.', 'Stack, hosting and integrations chosen, with a plan for who edits what.', 'Content, brand and data sources lined up.', 'Designed in Figma first, same as any mission.', 'Components, content and integrations built and wired.', 'Deploy pipeline, monitoring and a handoff.'],
    'cms-integrations': ['What content you have, where it lives and who updates it.', 'Map the content: collections, fields and how they connect.', 'Source data cleaned up: Airtable, Sheets or an API.', 'A test sync on a few items and one template, to check the model.', 'Sync the source and wire the templates, filters and references.', 'Edge cases, limits and editor training, then it runs on its own.'],
    'design-systems': ['Where the brand and product drift, and who has to use the system.', 'Audit what exists and agree what the system covers.', 'Tokens: color, type, spacing and motion, defined once.', 'Core components built in Figma and tried on a real page.', 'Components built in Webflow with the same names as Figma.', 'Rules and examples your team can follow, plus a walkthrough.'],
    'performance': ['Which pages feel slow, and for whom.', 'Baseline scores and real-device recordings.', 'Prioritize what visitors actually feel first.', 'Fix one heavy page end to end and measure it.', 'Images, scripts, loading and motion fixed across the site.', 'Measure again and write up what changed.']
  };
  // stations on the trajectory map (% of the map box), laid out so the transfer orbits don't tangle
  var PORT = { 'webflow-development': [40, 46], 'webgl-data': [70, 16], 'motion': [52, 80], 'branding': [18, 74], 'custom-deploys': [90, 44], 'cms-integrations': [66, 52], 'design-systems': [24, 18], 'performance': [82, 82] };
  var BY = {}; HUB.forEach(function(s, i){ s.i = i; s.no = pad(i + 1); BY[s.slug] = s; });
  var FBY = {}; FLIGHTS.forEach(function(f){ FBY[f.slug] = f; f.svc = HUB.filter(function(s){ return s.flown.indexOf(f.slug) > -1; }); });
  function pairKey(a, b){ return [a, b].sort().join('|'); }
  var ROUTES = []; HUB.forEach(function(s){ s.via.forEach(function(v){ var k = pairKey(s.slug, v); if (!ROUTES.some(function(r){ return r.k === k; })) ROUTES.push({ k: k, a: s.slug, b: v }); }); });
  function misHref(slug){ return FBY[slug] && FBY[slug].status === 'Placeholder' ? WORK : MIS + slug; }
  function hubPlanet(s, seed, extra){ return 'data-planet="' + s.p[0] + '" data-seed="' + seed + '" data-colors="' + s.p[1] + '"' + (s.p[2] ? ' data-ring="' + s.p[2] + '" data-tilt="-16"' : '') + ' data-spin="50" data-glow="' + s.p[3] + '"' + (extra || ''); }
  // manifest readout per column (phosphor characters): mission · destination · transfer · orbit · status
  var COLS = [{ k: 'flight', n: 5, h: 'Mission' }, { k: 'dest', n: 14, h: 'Destination' }, { k: 'via', n: 7, h: 'Transfer' }, { k: 'gate', n: 5, h: 'Orbit' }, { k: 'status', n: 13, h: 'Status' }];
  function baseStatusText(s){ return s.slug === 'custom-deploys' ? 'ON REQUEST' : 'STANDBY'; }
  function boardText(s){ return { flight: 'AB-' + s.no, dest: s.short.toUpperCase(), via: s.via.map(function(v){ return BY[v].code; }).join(' '), gate: s.p[0].toUpperCase(), status: baseStatusText(s) }; }
  function cells(txt, n){ var o = ''; for (var k = 0; k < n; k++) o += '<span class="hb-fl" aria-hidden="true">' + esc((txt.charAt(k) || ' ').replace(' ', ' ')) + '</span>'; return o; }

  var H = '';
  // 1 · hero: launch control. An old-school ship dashboard: CRT manifest + switch console + pass printer
  H += '<section class="dbh wrap hb-hero" id="hero" data-frame="launch-control">' +
    '<div class="dbh-top"><div class="crumb mono"><a href="' + HOME + '#top">/home</a> / <b>services</b></div><span class="hb-rec mono"><i aria-hidden="true"></i>AB spaceport · pads open</span></div>' +
    '<div class="pwrap hb-hero-planet" id="hbHeroPlanet" ' + hubPlanet(HUB[0], 11) + ' data-drag data-label="Go for launch · ' + HUB[0].short + '"></div>' +
    '<div class="hb-hgrid"><div><div class="dbh-eyebrow mono">Services · ' + HUB.length + ' launches on the manifest</div>' +
      '<h1 class="dbh-title hb-title"><span class="w">Launch</span> <span class="w t-outline">control</span></h1></div>' +
      '<p class="dbh-sum hb-sum">Eight destinations, one pilot. Arm the launch your site needs and mission control prints your launch pass.</p></div>' +
    '<div class="hb-sym"><span class="hb-sym-l mono" id="hbSymL"><i aria-hidden="true"></i>Run diagnostics · what\'s wrong right now?</span><div class="hb-sym-chips" role="group" aria-labelledby="hbSymL">' +
      HUB.map(function(s){ return '<button type="button" class="hb-chip" data-i="' + s.i + '" aria-pressed="false">' + esc(s.problem) + '</button>'; }).join('') +
      '<button type="button" class="hb-chip is-reset" data-i="-1">All clear</button></div></div>' +
    '<div class="hb-board-wrap"><div class="hb-peeks" aria-hidden="true">' + HUB.map(function(s){ return '<div class="hb-peek pwrap" data-i="' + s.i + '" ' + hubPlanet(s, 60 + s.i) + '></div>'; }).join('') + '</div>' +
    // mission control: the same monitor + side console as the mission debrief
    '<div class="mc hb-mc"><div class="mon hb-board selectable" data-name="Monitor / launch manifest">' +
      '<div class="mon-bar mono"><span class="rec">Live · <span class="hb-wide">launch </span>manifest</span><span class="tc"><span id="hbClock">--:--</span> <span data-bind="tz-label">ET</span><span class="hb-wide"> · ' + HUB.length + ' launches</span></span></div>' +
      '<div class="screen hb-screen" id="hbScreen"><div class="hb-scr-in">' +
        '<div class="hb-cols mono" aria-hidden="true"><span class="hb-c-cur"></span>' + COLS.map(function(c){ return '<span class="hb-c-' + c.k + '" style="--n:' + c.n + '">' + c.h + '</span>'; }).join('') + '<span class="hb-c-go">Service</span></div>' +
        '<ol class="hb-rows mono" id="hbRows">' + HUB.map(function(s){
          var t = boardText(s);
          return '<li class="hb-row" data-i="' + s.i + '" style="--c:' + s.c + '">' +
            '<button type="button" class="hb-row-b" aria-pressed="false" aria-label="Mission AB-' + s.no + ', ' + esc(s.t1 + ' ' + s.t2) + '. Arm it and print the launch pass."></button>' +
            '<span class="hb-cur" aria-hidden="true">&gt;</span>' +
            COLS.map(function(c){ return '<span class="hb-cell hb-c-' + c.k + '" data-col="' + c.k + '" style="--n:' + c.n + '">' + cells(t[c.k], c.n) + '</span>'; }).join('') +
            '<a class="hb-go" href="' + SVC + s.slug + '" aria-label="Explore the ' + esc(s.t1 + ' ' + s.t2) + ' service"><span class="hb-go-t">Explore</span><span aria-hidden="true">→</span></a>' +
            '<span class="hb-row-sum sr">' + esc(s.t1 + ' ' + s.t2) + ': ' + esc(s.sum) + '</span></li>';
        }).join('') + '</ol></div>' +
        '<div class="scan" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="roll" aria-hidden="true"></div>' +
        '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
        '<div class="osd" aria-hidden="true">CH 01 · Manifest</div>' +
      '</div>' +
      '<div class="mon-cap"><span class="hb-prompt" id="hbPrompt">&gt; Click a launch to print its pass</span><span class="mono">AB-OS 2.6</span></div>' +
      '<div class="hb-slot" aria-hidden="true"><span></span><em class="mono">Pass printer</em></div>' +
    '</div>' +
    '<div class="console hb-console">' +
      '<div class="panel"><div class="panel-h mono"><span>Launch keys</span><span>01–' + pad(HUB.length) + '</span></div><div class="hb-keys" role="group" aria-label="Arm a launch">' + HUB.map(function(s){
          return '<button type="button" class="hb-key" data-i="' + s.i + '" style="--c:' + s.c + '" aria-pressed="false" aria-label="Arm AB-' + s.no + ', ' + esc(s.short) + '"><span class="k">' + s.no + '</span><span class="hb-key-c">' + s.code + '</span><i aria-hidden="true"></i></button>';
        }).join('') + '</div></div>' +
      '<div class="panel"><div class="panel-h mono"><span>Telemetry</span><span id="hbTeleN">AB-01</span></div><div class="tele">' +
        '<div><span>Destination</span><b id="hbTeleD">' + HUB[0].code + '</b></div><div><span>Orbit</span><b id="hbTeleO">' + HUB[0].p[0].toUpperCase() + '</b></div>' +
        '<div><span>Transfers</span><b id="hbTeleT">' + HUB[0].via.length + '</b></div><div><span>Status</span><b class="ok" id="hbTeleS">GO</b></div></div></div>' +
    '</div></div></div>' +
    // 2 · the launch pass: a translucent data slate that slides out of the monitor's slot
    '<div class="hb-print" id="hbPrint" aria-live="polite"><article class="hb-pass selectable" data-name="Slate / launch-pass" id="hbPass">' +
      '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<span class="hb-glare" aria-hidden="true"></span>' +
      '<div class="hb-pass-main">' +
        '<div class="hb-pass-top mono"><span class="hb-pass-ok">Cleared for launch</span><span>Launch pass · <b id="hbPFlight">AB-01</b></span></div>' +
        '<div class="hb-pass-route mono"><span><small>Launch site</small><b>EARTH</b></span><span class="hb-pass-arc" aria-hidden="true"><i></i><span class="hb-pass-planet pwrap" id="hbPPlanet"></span><i></i></span><span class="is-to"><small>Destination</small><b id="hbPCode">WFD</b></span></div>' +
        '<a class="hb-pass-tl" id="hbPTL" href="' + SVC + HUB[0].slug + '"><h2 class="hb-pass-t" id="hbPT"></h2><span class="hb-pass-tl-arr mono" aria-hidden="true">Open service →</span></a>' +
        '<p class="hb-pass-s" id="hbPS"></p>' +
        '<dl class="hb-pass-f"><div><dt>Crew seat</dt><dd id="hbPBest"></dd></div><div><dt>Orbit class</dt><dd id="hbPGate"></dd></div><div><dt>Transfers</dt><dd id="hbPVia"></dd></div><div><dt>Payload</dt><dd>6 deliverables · 4 stages</dd></div></dl>' +
        '<div class="hb-pass-tools" id="hbPTools"></div>' +
      '</div>' +
      '<div class="hb-pass-stub"><span class="hb-stub-t mono">Service briefing</span><span class="hb-stub-qr" id="hbSQr" aria-hidden="true"></span>' +
        '<span class="hb-stub-f mono"><b id="hbSCode">WFD</b> · <span id="hbSFlight">AB-01</span></span>' +
        '<a class="btn btn-primary magnetic hb-stub-go" id="hbPStub" href="' + SVC + HUB[0].slug + '"><span class="shine" aria-hidden="true"></span><span>Explore service</span><span class="arr" aria-hidden="true">→</span></a></div>' +
    '</article></div>' +
    '</section>';

  // 3 · plot a trajectory: main destination → stops → launch (light; the map bleeds to the left edge)
  H += '<section class="theme-light hb-map-sec" id="trajectory" data-frame="trajectory-planner"><div class="light-glow top" aria-hidden="true"></div><div class="light-glow bot" aria-hidden="true"></div><div class="light-bg" aria-hidden="true"></div>' +
    '<div class="wrap hb-map-head"><div class="section-head" style="margin:0"><span class="eyebrow">/trajectory · ' + ROUTES.length + ' transfer orbits</span><h2 class="h2 split">Plot a <span class="t-outline">trajectory</span></h2></div>' +
      '<div class="hb-map-side"><p class="lede">Most missions stop at more than one planet. Set your main destination, add up to two stops, and send the whole trajectory to the flight planner.</p>' +
      '<ol class="hb-steps mono" id="hbSteps"><li data-step="1"><b>1</b>Main destination</li><li data-step="2"><b>2</b>Stops · up to 2</li><li data-step="3"><b>3</b>Launch</li></ol></div></div>' +
    '<div class="hb-plan"><div class="hb-map" id="hbMap"><svg class="hb-map-svg" id="hbMapSvg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><g id="hbArcs"></g><path class="hb-itin-path" id="hbItinPath" /></svg>' +
      '<div class="hb-earth" style="left:5%;top:48%" aria-hidden="true"><i></i><span class="mono">Launch site · you</span></div>' +
      '<div class="hb-map-hint mono" id="hbHint" aria-hidden="true"></div>' +
      HUB.map(function(s){ var xy = PORT[s.slug]; return '<button type="button" class="hb-port" data-i="' + s.i + '" style="left:' + xy[0] + '%;top:' + xy[1] + '%;--c:' + s.c + '" aria-label="' + esc(s.code + ', ' + s.t1 + ' ' + s.t2) + '"><span class="hb-port-pl pwrap" ' + hubPlanet(s, 40 + s.i) + '></span><span class="hb-port-code mono">' + s.code + '</span><span class="hb-port-n mono">' + esc(s.short) + '</span><span class="hb-port-tag mono" aria-hidden="true"></span></button>'; }).join('') +
    '</div>' +
    '<aside class="hb-planner selectable" data-name="Panel / trajectory" id="hbPlanner" aria-live="polite"></aside></div>' +
    '</section>';

  // 3b · your flight plan: the Process route, re-plotted for the trajectory; appears (warps in) on launch
  H += '<section class="hb-flight" id="flight" data-frame="flight-plan" hidden aria-label="Your flight plan"></section>';

  // 4 · crew logbook: mission patches for every service that flew
  H += '<section class="wrap hb-pp-sec" id="patches" data-frame="crew-logbook"><div class="hb-pp-grid">' +
    '<div class="section-head hb-pp-head"><span class="eyebrow">/crew logbook · ' + FLIGHTS.length + ' missions</span><h2 class="h2 split">Mission <span class="t-outline">patches</span></h2>' +
      '<p class="lede">Every mission earns a patch for each service that flew on it. Tap a patch to open the service, or the page to open the mission.</p>' +
      '<div class="hb-pp-ctl"><button type="button" class="hb-pp-btn" id="hbPrev" aria-label="Previous mission">←</button><span class="mono" id="hbPPN">01 / ' + pad(FLIGHTS.length) + '</span><button type="button" class="hb-pp-btn" id="hbNext" aria-label="Next mission">→</button></div></div>' +
    '<div class="hb-pp selectable" data-name="Object / crew-logbook" id="hbPP" tabindex="0" aria-roledescription="logbook" aria-label="Crew logbook. Use the arrow keys to turn the page.">' +
      '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<span class="hb-glare" aria-hidden="true"></span>' +
      '<div class="hb-pp-page is-l" id="hbPPL"></div><div class="hb-pp-page is-r" id="hbPPR"></div><div class="hb-pp-turn" id="hbPPTurn" aria-hidden="true"></div>' +
    '</div></div></section>';

  // 5 · final call: one more line on a small monitor
  var CALL = { flight: 'AB-09', dest: 'CUSTOM CHARTER', via: 'ANY', gate: 'TBD', status: 'ON REQUEST' };
  H += '<section class="wrap hb-call" data-frame="final-call"><div class="mon hb-call-mon"><div class="hb-call-row mono" aria-label="Mission AB-09, custom charter, orbit to be decided, on request"><span class="hb-cur" aria-hidden="true">&gt;</span>' +
      COLS.map(function(c){ return '<span class="hb-cell hb-c-' + c.k + '" data-col="' + c.k + '" style="--n:' + c.n + '">' + cells(CALL[c.k], c.n) + '</span>'; }).join('') + '<i class="hb-caret" aria-hidden="true"></i></div></div>' +
    '<div class="hb-call-b"><h2 class="h2 split">Not on the <span class="t-outline">manifest?</span></h2>' +
      '<div class="hb-call-a"><p class="lede">Custom charters launch too. Plot it on the star chart, or tell me where you\'re headed.</p>' +
      '<div class="hb-call-btns"><a class="btn btn-ghost magnetic" href="' + PROC + '#chart"><span>Plot it with me</span><span class="arr" aria-hidden="true">→</span></a><a class="btn btn-primary magnetic" href="' + HOME + '#launch"><span class="shine" aria-hidden="true"></span><span>Book a call</span><span class="arr" aria-hidden="true">→</span></a></div></div></div>' +
    '</section>';

  $('#hub').innerHTML = H;
  document.title = 'Services · Launch control · Angelino Barajas';
