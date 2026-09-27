  /* =========================================================
     KNOWLEDGE · render (library · article · chart · topic · rows)
     Data: KS (ks-data.js, generated). In Webflow every list below is a
     Collection List; the script only filters, highlights and draws the chart.
     ========================================================= */
  var LIB = 'observatory.html', ART = 'observation.html#', CHART = 'topics.html', TOP = 'topic.html#', MIS = 'mission-debrief.html#', SVCP = 'services.html#';
  var VIEW = $('#ks').dataset.view;
  var CAT = {}; KS.cats.forEach(function(c, i){ c.i = i; CAT[c.key] = c; });
  var TOPIC = {}; KS.topics.forEach(function(t){ TOPIC[t.slug] = t; });
  var INS = {}; KS.insights.forEach(function(x){ INS[x.slug] = x; });
  // services (Services CMS): name split like the hub, color + planet
  var SVC = {
    'webflow-development': { t1: 'Webflow', t2: 'development', c: '#146EF5', sum: 'Sites your team can actually edit. Planned, designed in Figma and built in Webflow from the ground up.' },
    'webgl-data': { t1: 'Interactive', t2: '3D + data', c: '#5eead4', sum: 'Interactive 3D and data in Webflow, fed by the CMS: things visitors can turn, zoom and use to decide.' },
    'motion': { t1: 'Motion +', t2: 'interaction', c: '#0AE448', sum: 'Scroll systems, drag physics and micro-interactions with easing tuned by hand.' },
    'branding': { t1: 'Logo +', t2: 'identity', c: '#FF6A3D', sum: 'Logos, color, type and brand rules built on a grid, so they hold up from a favicon to a billboard.' },
    'custom-deploys': { t1: 'Beyond', t2: 'Webflow', c: '#C9C7C0', sum: 'Coded sites in Astro or Next.js on Vercel, Netlify or Cloudflare, when Webflow is not the right fit.' },
    'cms-integrations': { t1: 'Content that', t2: 'syncs itself', c: '#8fb1ff', sum: 'Airtable, Google Sheets or any API piped into the Webflow CMS, with pages that build themselves.' },
    'design-systems': { t1: 'Tokens +', t2: 'type scales', c: '#7c5cff', sum: 'Variables, components and type scales that keep page ten as sharp as page one.' },
    'performance': { t1: 'Heavy visuals,', t2: 'fast pages', c: '#ffd166', sum: 'Lazy-loaded WebGL, reduced-motion fallbacks and a Lighthouse pass on every page.' }
  };
  // missions: the prototype set + Knowledge System (#04, live on staging)
  var MI4 = {};
  MISSIONS.forEach(function(m){ MI4[m.slug] = { no: m.no, name: m.name, client: m.client, sum: m.summary, planet: m.planet, c: m.brand.accent }; });
  MI4['knowledge-system'] = { no: '04', name: 'Knowledge System', client: 'Add-on · for any Webflow site', c: '#a597ff',
    sum: 'A connected content system for your site. Every service, project, answer and video links to the ideas it proves.',
    planet: { type: 'gas', colors: '#120e2a,#2a2263,#5b4bd6,#a597ff,#ece8ff', ring: '#a597ff,#4C8DFF,#2a2263', glow: 'rgba(165,151,255,.35)' } };

  var PSEED = 0;
  function planetIcon(p, cls){ return '<span class="ks-pl' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><span class="pwrap" data-planet="' + p.type + '" data-seed="' + (17 + (PSEED++) * 5) + '" data-colors="' + p.colors + '" data-spin="40" data-glow="' + p.glow + '"></span></span>'; }
  function svcIcon(s, cls){ return planetIcon(KS.svcPlanet[s], cls); }
  function misIcon(s, cls){ var p = MI4[s].planet; return planetIcon({ type: p.type, colors: p.colors, glow: p.glow }, cls); }
  function notesFor(slug){ return KS.insights.filter(function(x){ return x.topics.indexOf(slug) > -1; }); }
  function links(t){ return notesFor(t.slug).length + t.missions.filter(function(s){ return MI4[s]; }).length + t.services.length; }
  function chip(slug, extra){ var t = TOPIC[slug]; return '<a class="ks-chip" data-cat="' + t.category + '" href="' + TOP + t.slug + '"' + (extra || '') + '>' + esc(t.name) + '</a>'; }
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  function strip(h){ return h.replace(/<[^>]+>/g, ''); }
  // "Smooth scroll without the stutter: Lenis + GSAP" -> solid first half, outlined second half
  function splitTitle(t){ var m = t.match(/^(.+?[:.?])\s+(.+)$/); return m ? esc(m[1]) + ' <span class="t-outline">' + esc(m[2]) + '</span>' : esc(t); }
  function card(x, feat){
    return '<a class="ks-card ks-rv' + (feat ? ' is-feat' : '') + '" href="' + ART + x.slug + '" data-theme="' + x.theme + '" data-topics="' + x.topics.join(' ') + '" data-q="' + esc((x.title + ' ' + strip(x.answer) + ' ' + x.topics.map(function(s){ return TOPIC[s].name; }).join(' ')).toLowerCase()) + '">' +
      '<span class="ks-scan" aria-hidden="true"></span>' +
      '<div class="ks-card-top"><span><b>' + x.no + '</b> · ' + esc(x.themeName) + '</span><span>' + x.mins + ' min</span></div>' +
      (feat ? '<span class="ks-lab">Start here</span>' : '') +
      '<h3>' + esc(x.title) + '</h3><p>' + x.answer + '</p>' +
      '<div class="ks-card-foot"><div class="ks-tags">' + x.topics.map(function(s){ return '<span data-cat="' + TOPIC[s].category + '">' + esc(TOPIC[s].name) + '</span>'; }).join('') + '</div><span class="ks-go" aria-hidden="true">→</span></div></a>';
  }
  function hero(frame, crumb, extraCls, inner){
    return '<section class="dbh wrap ' + extraCls + '" id="hero" data-frame="' + frame + '"><div class="dbh-top"><div class="crumb mono">' + crumb + '</div><span class="ks-rec mono"><i aria-hidden="true"></i>Observatory · ' + KS.insights.length + ' observations · ' + KS.topics.length + ' topics</span></div>' + inner + '</section>';
  }
  function secHead(eyebrow, h, lede){ return '<div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">' + eyebrow + '</span><h2 class="h2 split">' + h + '</h2></div>' + (lede ? '<p class="lede">' + lede + '</p>' : '') + '</div>'; }
  function lightOpen(cls, frame, id){ return '<section class="wrap theme-light ks-sec ' + cls + '"' + (id ? ' id="' + id + '"' : '') + ' data-frame="' + frame + '"><div class="light-glow top" aria-hidden="true"></div><div class="light-bg" aria-hidden="true"></div>'; }
  function svcRow(s){ var v = SVC[s]; return '<li><a href="' + SVCP + s + '">' + svcIcon(s, 'is-lg') + '<div><h3>' + esc(v.t1) + ' <span class="t-outline">' + esc(v.t2) + '</span></h3><p>' + esc(v.sum) + '</p></div><span class="ks-go" aria-hidden="true">→</span></a></li>'; }
  function misCard(s, i){ var m = MI4[s]; if (!m) return ''; var p = m.planet;
    return '<a class="ks-mcard ks-rv" href="' + MIS + s + '" style="--pc:' + m.c + '"><div class="ks-mp"><div class="pwrap" data-planet="' + p.type + '" data-seed="' + (i * 7 + 5) + '" data-colors="' + p.colors + '"' + (p.ring ? ' data-ring="' + p.ring + '" data-tilt="-16"' : '') + ' data-spin="60" data-glow="' + p.glow + '" aria-hidden="true"></div></div>' +
      '<div><span class="mono">Mission ' + m.no + ' · ' + esc(m.client) + '</span><h3>' + esc(m.name) + '</h3><p>' + esc(m.sum) + '</p><em>Open the debrief →</em></div></a>';
  }
  function faqList(keys){ return '<div class="faq">' + keys.map(function(k){ var f = KS.faq[k]; return '<details><summary>' + esc(f[0]) + '<span class="pm" aria-hidden="true">+</span></summary><div class="a"><p>' + esc(f[1]) + '</p></div></details>'; }).join('') + '</div>'; }

  /* ---------- star chart geometry (shared by the chart and the topic mini-map) ---------- */
  var CENTER = { who: [200, 200], what: [650, 180], how: [1090, 210], watch: [190, 590], ideas: [700, 600], known: [1130, 580] };
  // hand-placed star slots per constellation: [dx, dy, label side] (reads as constellations, not a ring)
  var SHAPES = [[-120, -40, 'L'], [-10, -95, 'R'], [110, -30, 'R'], [80, 70, 'R'], [-30, 110, 'R'], [-130, 70, 'L']];
  var SIDE = {};
  var POS = {};
  KS.cats.forEach(function(c){
    var ts = KS.topics.filter(function(t){ return t.category === c.key; }), cx = CENTER[c.key];
    ts.forEach(function(t, i){ var s = SHAPES[i % 6]; POS[t.slug] = [cx[0] + s[0], cx[1] + s[1]]; SIDE[t.slug] = t.slug === 'philosophy-at-work' ? 'R' : s[2]; });
  });
  // cross-links: two topics that share a field note
  var XL = [];
  KS.insights.forEach(function(x){ for (var i = 0; i < x.topics.length; i++) for (var j = i + 1; j < x.topics.length; j++){ var a = x.topics[i], b = x.topics[j], k = a < b ? a + '|' + b : b + '|' + a; if (XL.indexOf(k) < 0) XL.push(k); } });
  function starR(t){ return 3 + Math.sqrt(links(t)) * 1.7; }
  function consPath(key){ var ts = KS.topics.filter(function(t){ return t.category === key; }); return 'M' + ts.map(function(t){ return POS[t.slug].join(' '); }).join(' L'); }

  var H = '', kind = VIEW;

  /* =========================================================
     LIBRARY  /insights
     ========================================================= */
  if (kind === 'library'){
    var used = {}; KS.insights.forEach(function(x){ x.topics.forEach(function(s){ used[s] = (used[s] || 0) + 1; }); });
    var usedList = Object.keys(used).sort(function(a, b){ return used[b] - used[a] || TOPIC[a].name.localeCompare(TOPIC[b].name); });
    var nBN = KS.insights.filter(function(x){ return x.theme === 'build-notes'; }).length;
    H += hero('field-notes', '<a href="' + HOME + '#top">/home</a> / <b>observatory</b>', 'ks-hero ks-ohero',
      '<div class="pwrap dbh-planet" data-planet="gas" data-seed="31" data-colors="#120e2a,#2a2263,#5b4bd6,#a597ff,#ece8ff" data-ring="#ffd9cc,#FF6A3D,#2a2263" data-tilt="-14" data-spin="70" data-glow="rgba(165,151,255,.35)" data-drag data-label="The Observatory"></div>' +
      '<div class="dbh-eyebrow mono">Observatory · notes from real builds, and the ideas behind them</div>' +
      '<h1 class="dbh-title"><span class="w">The</span> <span class="w t-outline">Observatory</span></h1>' +
      '<p class="dbh-sum">What I learn building sites, written down so you don\'t have to learn it the hard way. Organized by what it answers, not by when I wrote it.</p>' +
      '<form class="ks-ask" id="ksAsk" role="search" onsubmit="return false"><div class="ks-ask-h"><span>Ask the observatory</span><span><b id="ksAskN">' + KS.insights.length + '</b> observations in range</span></div>' +
        '<div class="ks-ask-row"><label for="ksQ" aria-hidden="true">&gt;</label><input id="ksQ" type="search" autocomplete="off" placeholder="What are you stuck on?" aria-label="Search the observatory"><button type="button" class="ks-ask-clear" id="ksQx" hidden>Clear</button></div>' +
        '<div class="ks-ask-q" aria-label="Common questions"><button type="button" data-q="scroll">Why does my scroll stutter?</button><button type="button" data-q="3d">Will 3D slow my site down?</button><button type="button" data-q="schema">How do I add schema?</button><button type="button" data-q="scope">The project keeps growing</button></div>' +
        '<div class="ks-ask-hit mono" id="ksHit" aria-live="polite"></div></form>' +
      '<div class="ks-hstats"><div><span>Observations</span><b>' + pad2(KS.insights.length) + '</b></div><div><span>Themes</span><b>02</b></div><div><span>Topics</span><b>' + KS.topics.length + '</b></div><div><span>Constellations</span><b>06</b></div></div>');

    H += '<section class="wrap ks-sec" id="library" data-frame="library">' + secHead('/log · ' + KS.insights.length + ' observations', 'Observation <span class="t-outline">log</span>', 'Two themes: build notes from real projects, and the ideas behind them. Filter by what you\'re working on.') +
      '<div class="ks-ctrl"><div class="ks-tabs" role="group" aria-label="Theme"><button type="button" data-theme="all" aria-pressed="true">All <b>' + KS.insights.length + '</b></button><button type="button" data-theme="build-notes" aria-pressed="false">Build notes <b>' + nBN + '</b></button><button type="button" data-theme="why-before-how" aria-pressed="false">Why before how <b>' + (KS.insights.length - nBN) + '</b></button></div>' +
        '<div class="ks-chips" role="group" aria-label="Topic">' + usedList.map(function(s, i){ return '<button type="button" class="ks-chip' + (i > 7 ? ' ks-more' : '') + '" data-cat="' + TOPIC[s].category + '" data-topic="' + s + '" aria-pressed="false">' + esc(TOPIC[s].name) + ' <b>' + used[s] + '</b></button>'; }).join('') + (usedList.length > 8 ? '<button type="button" class="ks-chip ks-morebtn" id="ksMore" aria-expanded="false">+ ' + (usedList.length - 8) + ' more topics</button>' : '') + '</div>' +
        '<div class="ks-readout"><span>Showing <b id="ksShown">' + KS.insights.length + '</b> of ' + KS.insights.length + ' · filter <b id="ksFilt">none</b></span><button type="button" id="ksReset" hidden>Clear filters ×</button></div></div>' +
      '<div class="ks-grid" id="ksGrid">' + KS.insights.map(function(x, i){ return card(x, i === 0); }).join('') + '</div>' +
      '<div class="ks-empty" id="ksEmpty"><b>No signal</b>Nothing matches yet. <button type="button" class="ks-ask-clear" data-reset>Clear filters</button></div></section>';

    H += lightOpen('ks-browse', 'browse-by-topic') + secHead('/topics · 6 constellations', 'Browse by <span class="t-outline">topic</span>', 'The same ' + KS.topics.length + ' words tag every observation, mission and service on this site. Pick one to see everything behind it.') +
      '<div class="ks-cats">' + KS.cats.map(function(c){
        var ts = KS.topics.filter(function(t){ return t.category === c.key; });
        return '<div class="ks-cat ks-rv" data-cat="' + c.key + '"><div class="ks-cat-h"><b>' + c.code + '</b><span>' + pad2(ts.length) + ' stars</span></div><h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + '</p><ul>' +
          ts.map(function(t){ return '<li><a href="' + TOP + t.slug + '">' + esc(t.name) + '<span>' + links(t) + (links(t) === 1 ? ' link' : ' links') + '</span></a></li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>' +
      '<div class="ks-cta-row"><a class="btn btn-primary magnetic" href="' + CHART + '"><span class="shine" aria-hidden="true"></span><span>Open the star chart</span><span class="arr" aria-hidden="true">→</span></a></div></section>';

  }

  /* =========================================================
     ARTICLE  /insights/[slug]
     ========================================================= */
  if (kind === 'article'){
    var hs = (location.hash || '').replace('#', ''), X = INS[hs] || KS.insights[0], XI = KS.insights.indexOf(X);
    var PREV = KS.insights[(XI - 1 + KS.insights.length) % KS.insights.length], NXT = KS.insights[(XI + 1) % KS.insights.length];
    var h2n = 0, toc = [];
    var bodyH = X.body.map(function(b){
      if (b.t === 'h2'){ h2n++; toc.push([b.id, strip(b.x).replace(/^\d+\.\s*/, '')]); return '<h2 id="' + b.id + '"><i>§' + pad2(h2n) + '</i><span>' + b.x.replace(/^\d+\.\s*/, '') + '</span></h2>'; }
      if (b.t === 'h3') return '<h3 id="' + b.id + '">' + b.x + '</h3>';
      if (b.t === 'p') return '<p>' + b.x + '</p>';
      if (b.t === 'quote') return '<blockquote>' + b.x + '</blockquote>';
      if (b.t === 'ol' || b.t === 'ul') return '<' + b.t + '>' + b.items.map(function(li){ return '<li>' + li + '</li>'; }).join('') + '</' + b.t + '>';
      if (b.t === 'code') return codeBlock(b.code, 'from the build');
      return '';
    }).join('');
    // related reading: most shared topics, then same theme
    var rel = KS.insights.filter(function(y){ return y !== X; }).map(function(y){ var s = y.topics.filter(function(t){ return X.topics.indexOf(t) > -1; }).length * 2 + (y.theme === X.theme ? 1 : 0); return [s, y]; })
      .sort(function(a, b){ return b[0] - a[0]; }).slice(0, 3).map(function(p){ return p[1]; });
    var mis = X.missions.filter(function(s){ return MI4[s]; });

    H += '<div class="ks-prog" id="ksProg" aria-hidden="true"></div>';
    H += hero('insight', '<a href="' + LIB + '">/observatory</a> / <a href="' + LIB + '#library">' + X.theme + '</a> / <b>' + X.no.toLowerCase() + '</b>', 'ks-ahero',
      '<div class="dbh-eyebrow mono">' + X.no + ' · ' + esc(X.themeName) + '</div>' +
      '<h1 class="dbh-title">' + splitTitle(X.title) + '</h1>' +
      '<div class="ks-chips">' + X.topics.map(function(s){ return chip(s); }).join('') + '</div>' +
      '<div class="ks-meta"><span>Read <b>' + X.mins + ' min</b></span><span>Words <b>' + X.words + '</b></span><span>By <b>Angelino Barajas</b></span></div>' +
      '<div class="ks-answer"><div class="ks-answer-l">The short answer<span>' + X.no + '</span></div><p>' + X.answer + '</p></div>');

    H += '<section class="wrap ks-sec ks-body" id="article" data-frame="article"><article class="ks-prose" id="ksProse">' + bodyH +
      '</article>' +
      '<aside class="ks-aside" aria-label="About this note">' +
        '<div class="ks-toc-box"><div class="ks-box-h"><span>On this page</span><b id="ksTocN">01 / ' + pad2(toc.length) + '</b></div><ol class="ks-toc" id="ksToc">' + toc.map(function(t, i){ return '<li><a href="#' + t[0] + '"><i>' + pad2(i + 1) + '</i><span>' + esc(t[1]) + '</span></a></li>'; }).join('') + '</ol><div class="ks-alt"><i id="ksAlt"></i></div></div>' +
        '<div><div class="ks-box-h"><span>Filed under</span><b>' + pad2(X.topics.length) + '</b></div><div class="ks-chips" style="margin-top:12px">' + X.topics.map(function(s){ return chip(s); }).join('') + '</div></div>' +
        (X.services.length ? '<div><div class="ks-box-h"><span>Related services</span><b>' + pad2(X.services.length) + '</b></div><ul class="ks-rel-s">' + X.services.map(function(s){ var v = SVC[s]; return v ? '<li><a href="' + SVCP + s + '">' + svcIcon(s) + esc(v.t1 + ' ' + v.t2) + '<span>→</span></a></li>' : ''; }).join('') + '</ul></div>' : '') +
        (mis.length ? '<div><div class="ks-box-h"><span>Shown in practice</span><b>' + pad2(mis.length) + '</b></div><ul class="ks-rel-s">' + mis.map(function(s){ var m = MI4[s]; return '<li><a href="' + MIS + s + '">' + misIcon(s) + esc(m.name) + '<span>M-' + m.no + '</span></a></li>'; }).join('') + '</ul></div>' : '') +
      '</aside></section>';

    H += lightOpen('ks-rel', 'related-reading') + secHead('/related · by shared topics', 'Related <span class="t-outline">reading</span>', '') +
      '<div class="ks-grid">' + rel.map(function(y){ return card(y); }).join('') + '</div>' +
      '<div class="ks-pager" style="margin-top:clamp(40px,5vw,70px)"><a href="' + ART + PREV.slug + '"><span>← Previous · ' + PREV.no + '</span><b>' + esc(PREV.title) + '</b></a><a href="' + ART + NXT.slug + '"><span>Next · ' + NXT.no + ' →</span><b>' + esc(NXT.title) + '</b></a></div></section>';
  }

  /* =========================================================
     STAR CHART  /topics
     ========================================================= */
  function chartSVG(){
    var g = '<g class="grid">';
    for (var gx = 0; gx <= 1200; gx += 100) g += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="720"/>';
    for (var gy = 0; gy <= 720; gy += 90) g += '<line x1="0" y1="' + gy + '" x2="1200" y2="' + gy + '"/>';
    g += '<circle cx="600" cy="360" r="230"/><circle cx="600" cy="360" r="420"/></g>';
    var xl = XL.map(function(k){ var p = k.split('|'), a = POS[p[0]], b = POS[p[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 40;
      return '<path class="xl" data-a="' + p[0] + '" data-b="' + p[1] + '" d="M' + a.join(' ') + ' Q' + mx + ' ' + my + ' ' + b.join(' ') + '"/>'; }).join('');
    var cons = KS.cats.map(function(c){ var cx = CENTER[c.key], top = Math.min.apply(null, KS.topics.filter(function(t){ return t.category === c.key; }).map(function(t){ return POS[t.slug][1]; }));
      return '<g data-cat="' + c.key + '"><path class="cl" d="' + consPath(c.key) + '"/><text class="cc" x="' + (cx[0] - 150) + '" y="' + (top - 50) + '">' + c.code + ' · ' + pad2(c.i + 1) + '</text><text class="cn" x="' + (cx[0] - 150) + '" y="' + (top - 26) + '">' + esc(c.name) + '</text></g>'; }).join('');
    var stars = KS.topics.map(function(t, i){ var p = POS[t.slug], r = starR(t), right = SIDE[t.slug] === 'R';
      return '<a href="' + TOP + t.slug + '" data-cat="' + t.category + '" data-slug="' + t.slug + '" aria-label="' + esc(t.name) + ', ' + links(t) + ' links">' +
        '<circle class="st-h" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r * 3.2) + '"/><circle class="st-r" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r + 5) + '"/>' +
        '<circle class="st' + (i % 3 ? '' : ' tw') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>' +
        '<text class="tl" x="' + (p[0] + (right ? r + 9 : -(r + 9))) + '" y="' + (p[1] + 4) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(t.name) + '</text></a>'; }).join('');
    return '<svg viewBox="-20 20 1420 760" role="img" aria-label="Star chart of ' + KS.topics.length + ' topics in six constellations">' + g + xl + cons + stars + '</svg>';
  }
  if (kind === 'chart'){
    var top0 = KS.topics.slice().sort(function(a, b){ return links(b) - links(a); })[0];
    H += hero('star-chart', '<a href="' + HOME + '#top">/home</a> / <a href="' + LIB + '">observatory</a> / <b>topics</b>', 'ks-hero ks-chero',
      '<div class="dbh-eyebrow mono">Topics · the shared vocabulary</div>' +
      '<h1 class="dbh-title"><span class="w">Star</span> <span class="w t-outline">chart</span></h1>' +
      '<p class="dbh-sum">' + KS.topics.length + ' ideas I keep coming back to, in six constellations. Pick a star to see every note, mission and service that proves it.</p>');
    H += '<section class="wrap ks-sec ks-chart-sec" id="chart" data-frame="star-chart-map"><div class="ks-chart"><div class="ks-chart-h"><span>Chart · ' + KS.topics.length + ' stars · ' + XL.length + ' shared-note routes</span><span>Star size = <b>links</b> · dashed = <b>shares a note</b></span></div>' +
      '<div class="ks-map" id="ksMap">' + chartSVG() + '</div>' +
      '<div class="ks-read" id="ksRead" aria-live="polite" data-cat="' + top0.category + '"></div>' +
      '<div class="ks-chart-f">' + KS.cats.map(function(c){ return '<span data-cat="' + c.key + '">' + c.code + ' · ' + esc(c.name) + '</span>'; }).join('') + '</div></div></section>';
    H += lightOpen('ks-browse', 'vocabulary', 'vocabulary') + secHead('/vocabulary · every star, listed', 'The <span class="t-outline">vocabulary</span>', 'The same list, for reading. Each word is a page.') +
      '<div class="ks-cats">' + KS.cats.map(function(c){
        var ts = KS.topics.filter(function(t){ return t.category === c.key; });
        return '<div class="ks-cat ks-rv" data-cat="' + c.key + '"><div class="ks-cat-h"><b>' + c.code + '</b><span>' + pad2(ts.length) + ' stars</span></div><h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + '</p><ul>' +
          ts.map(function(t){ return '<li><a href="' + TOP + t.slug + '">' + esc(t.name) + '<span>' + notesFor(t.slug).length + ' obs · ' + t.missions.filter(function(s){ return MI4[s]; }).length + ' missions</span></a></li>'; }).join('') + '</ul></div>';
      }).join('') + '</div></section>';
  }

  /* =========================================================
     TOPIC  /topics/[slug]
     ========================================================= */
  if (kind === 'topic'){
    var ts0 = (location.hash || '').replace('#', ''), T = TOPIC[ts0] || TOPIC['mobile-performance'], C = CAT[T.category];
    var tNotes = notesFor(T.slug), tMis = T.missions.filter(function(s){ return MI4[s]; }), tFaq = T.faq.filter(function(k){ return KS.faq[k]; });
    var sibs = KS.topics.filter(function(t){ return t.category === T.category; });
    // mini constellation: this category only, re-centered
    var cx0 = CENTER[T.category];
    var mini = '<svg viewBox="-250 -130 480 270" aria-hidden="true"><path class="cl" d="' + consPath(T.category).replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, function(_, x, y){ return (x - cx0[0]) + ' ' + (y - cx0[1]); }) + '"/>' +
      sibs.map(function(t){ var p = POS[t.slug], x = p[0] - cx0[0], y = p[1] - cx0[1], on = t === T, r = starR(t), R = SIDE[t.slug] === 'R';
        return '<g class="' + (on ? 'on' : '') + '">' + (on ? '<circle class="st-p" cx="' + x + '" cy="' + y + '" r="' + r + '"/><circle class="st-r" cx="' + x + '" cy="' + y + '" r="' + (r + 5) + '"/>' : '') + '<circle class="st" cx="' + x + '" cy="' + y + '" r="' + r + '"/><text class="tl" x="' + (R ? x + r + 7 : x - r - 7) + '" y="' + (y + 3) + '" text-anchor="' + (R ? 'start' : 'end') + '">' + esc(t.name) + '</text></g>'; }).join('') + '</svg>';

    H += hero('topic', '<a href="' + LIB + '">/observatory</a> / <a href="' + CHART + '">topics</a> / <b>' + T.slug + '</b>', 'ks-thero',
      '<div class="ks-mini" data-cat="' + T.category + '">' + mini + '</div>' +
      '<div class="dbh-eyebrow mono">' + C.code + ' · ' + esc(C.name) + ' · constellation ' + pad2(C.i + 1) + ' of 06</div>' +
      '<h1 class="dbh-title">' + (function(n){ var w = esc(n).split(' '); return w.length > 1 ? w.slice(0, -1).join(' ') + ' <span class="t-outline">' + w[w.length - 1] + '</span>' : '<span>' + w[0] + '</span>'; })(T.name) + '</h1>' +
      '<p class="dbh-sum">' + esc(T.definition) + '</p><span class="ks-def">Definition · part of the site vocabulary</span>' +
      '<div class="ks-tstats">' +
        [['Observations', tNotes.length, '#notes'], ['Missions', tMis.length, '#practice'], ['Services', T.services.length, '#services'], ['Questions', tFaq.length, '#questions']].map(function(s){ return s[1] ? '<a href="' + s[2] + '"><span>' + s[0] + '</span><b>' + pad2(s[1]) + '</b></a>' : '<div class="is-zero"><span>' + s[0] + '</span><b>00</b></div>'; }).join('') + '</div>');

    if (tMis.length) H += '<section class="wrap ks-sec" id="practice" data-frame="shown-in-practice">' + secHead('/missions · where it shipped', 'Shown in <span class="t-outline">practice</span>', 'Missions where ' + esc(T.name.toLowerCase()) + ' did real work.') + '<div class="ks-mis">' + tMis.map(misCard).join('') + '</div></section>';
    if (T.services.length) H += lightOpen('ks-svcs', 'related-services', 'services') + secHead('/services · ' + pad2(T.services.length), 'Related <span class="t-outline">services</span>', '') + '<ul class="ks-svc">' + T.services.map(svcRow).join('') + '</ul></section>';
    if (tNotes.length) H += '<section class="wrap ks-sec" id="notes" data-frame="field-notes">' + secHead('/observatory · ' + pad2(tNotes.length), 'Obser<span class="t-outline">vations</span>', '') + '<div class="ks-grid">' + tNotes.map(function(x){ return card(x); }).join('') + '</div></section>';
    if (tFaq.length) H += '<section class="wrap ks-sec" id="questions" data-frame="questions">' + secHead('/faq · ' + pad2(tFaq.length), 'Straight <span class="t-outline">answers</span>', '') + faqList(tFaq) + '</section>';
    H += '<section class="wrap ks-sec" id="nearby" data-frame="nearby-stars" style="padding-top:0">' + '<div class="ks-box-h" style="margin-bottom:18px"><span>Nearby stars · ' + esc(C.name) + '</span><a href="' + CHART + '" style="color:var(--signal);text-decoration:none">Full star chart →</a></div>' +
      '<div class="ks-near">' + sibs.filter(function(t){ return t !== T; }).map(function(t){ return chip(t.slug); }).join('') + '</div></section>';
  }

  /* =========================================================
     TEMPLATE ROWS (review page): what Mission, Service and Home pages gain
     ========================================================= */
  if (kind === 'rows'){
    var mS = '510-visuals', mT = ['creative-studios', 'interactive-3d', 'motion-scroll', 'mobile-performance', 'versioned-deploys', 'micro-interaction'];
    var mN = KS.insights.filter(function(x){ return x.missions.indexOf(mS) > -1; });
    var sS = 'motion', sT = KS.topics.filter(function(t){ return t.services.indexOf(sS) > -1; }), sN = KS.insights.filter(function(x){ return x.services.indexOf(sS) > -1; });
    H += hero('template-rows', '<a href="' + LIB + '">/observatory</a> / <b>template rows</b>', 'ks-hero',
      '<div class="dbh-eyebrow mono">Review · what the existing pages gain</div>' +
      '<h1 class="dbh-title"><span class="w">Linked</span> <span class="w t-outline">everywhere</span></h1>' +
      '<p class="dbh-sum">Tag an observation once and these rows fill themselves on the pages that already exist. Each one is a native Collection List; no page is edited by hand.</p>');
    H += '<section class="wrap ks-sec" data-frame="mission-template · above the next card"><div class="ks-spec"><span class="ks-spec-l">/work/510-visuals · new rows</span>' +
      '<div class="ks-filed"><span>Filed under</span>' + mT.map(function(s){ return chip(s); }).join('') + '</div>' +
      '<div class="ks-row-h"><h3>Observations from <span class="t-outline">this mission</span></h3><span class="mono">' + pad2(mN.length) + ' observations · Observatory where Missions contains this mission</span></div>' +
      '<div class="ks-grid">' + mN.slice(0, 3).map(function(x){ return card(x); }).join('') + '</div>' +
      '<p class="ks-note"><b>Webflow:</b> chips = nested list of this Mission\'s new <b>Topics</b> multi-reference. Notes = Collection List of Insights, filter <b>Missions contains Current Mission</b>, limit 3. Row hides when empty (Conditional visibility).</p></div></section>';
    H += lightOpen('', 'service-template · after the FAQ') + '<div class="ks-spec"><span class="ks-spec-l">/services/motion · new rows</span>' +
      '<div class="ks-filed"><span>Topics</span>' + sT.map(function(t){ return chip(t.slug); }).join('') + '</div>' +
      '<div class="ks-row-h"><h3>Further <span class="t-outline">reading</span></h3><span class="mono">' + pad2(sN.length) + ' observations · Observatory where Services contains this service</span></div>' +
      '<div class="ks-grid">' + sN.slice(0, 3).map(function(x){ return card(x); }).join('') + '</div>' +
      '<p class="ks-note"><b>Webflow:</b> zero new fields on Services (it\'s at the 60-field cap). Topics = list of Topics filtered <b>Services contains Current Service</b>; notes = Insights filtered the same way.</p></div></section>';
    H += '<section class="wrap ks-sec" data-frame="home · between FAQ and contact"><div class="ks-spec"><span class="ks-spec-l">/ (home) · new section</span>' +
      '<div class="ks-row-h"><div><span class="eyebrow">/incoming · 3 new signals</span><h3 style="margin-top:12px">Incoming <span class="t-outline">signals</span></h3></div><a class="btn btn-ghost magnetic" href="' + LIB + '"><span>Open the observatory</span><span class="arr" aria-hidden="true">→</span></a></div>' +
      '<div class="ks-grid">' + [KS.insights[0], KS.insights[3], KS.insights[7]].map(function(x){ return card(x); }).join('') + '</div>' +
      '<p class="ks-note"><b>Webflow:</b> Observatory list, filter <b>Featured on Home = on</b>, limit 3. Nav gains <b>Observatory</b>; footer gains Observatory + Star chart.</p></div></section>';
  }

  $('#ks').innerHTML = H;
  document.title = { library: 'The Observatory', article: (INS[(location.hash || '').replace('#', '')] || KS.insights[0]).title + ' · Observatory', chart: 'Star chart · Observatory', topic: 'Topic', rows: 'Knowledge · template rows' }[kind] + ' · Angelino Barajas';
  if (kind === 'topic') document.title = (TOPIC[(location.hash || '').replace('#', '')] || TOPIC['mobile-performance']).name + ' · Topics · Angelino Barajas';
