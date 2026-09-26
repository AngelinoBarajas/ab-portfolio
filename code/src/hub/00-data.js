  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-hub] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, hasGsap = AB.hasGsap, coarse = AB.coarse, toast = AB.toast, esc = AB.esc, pad = AB.pad2, onView = AB.onView;

  /* =========================================================
     SERVICES HUB (/services) · launch control. Copy lives in the Designer; the eight launches come from the hidden
     Services list ([data-dest-source]: titles, short name, summary, best for, first problem, planet, Process legs 1-6,
     nested Tools / Pairs with / Related missions) + the Hub manifest list (launch code, pair "why" notes) + the
     Missions list (logbook). The monitor manifest, launch pass, trajectory planner, flight plan and logbook are built
     from that data. Default content in the Designer = the first launch (Webflow development).
     ========================================================= */
  var page = $('.section_hub-hero');
  if (!page) return;
  var SVC = '/services/', MIS = '/work/', WORK = '/work', PROC = '/process', HOME = '/';
  // service colors (Color fields can't bind to text/attributes); unknown slugs fall back to signal
  var DOT = { 'webflow-development': '#146EF5', 'webgl-data': '#5eead4', motion: '#0AE448', branding: '#FF6A3D', 'custom-deploys': '#C9C7C0', 'cms-integrations': '#8fb1ff', 'design-systems': '#7c5cff', performance: '#ffd166' };
  function txt(n){ return n ? n.textContent.trim() : ''; }
  // a field of this item, not of a nested list inside it
  function own(root, k){ var ns = $$('[data-field="' + k + '"]', root); for (var i = 0; i < ns.length; i++) if (!ns[i].closest('[data-list]')) return txt(ns[i]); return ''; }
  // multi-line PlainText (pair notes) renders with <br>: read the lines from the markup
  function lines(n){
    if (!n) return [];
    var d = document.createElement('div'); d.innerHTML = n.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
    return d.textContent.split(/\n+/).map(function(l){ return l.trim(); }).filter(Boolean);
  }

  /* ---------- Hub manifest (launch codes + pair notes) ---------- */
  var MAN = {};
  $$('[data-manifest-fields]').forEach(function(m){
    var s = txt($('[data-field="service-slug"]', m));
    if (s) MAN[s] = { code: txt($('[data-field="code"]', m)), notes: lines($('[data-field="pair-notes"]', m)) };
  });

  /* ---------- Services (sort order) ---------- */
  var HUB = $$('[data-dest-fields]').map(function(root){
    var slug = own(root, 'slug'), m = MAN[slug] || {}, name = own(root, 'name');
    function list(n, k){ return $$('[data-list="' + n + '"] [data-field="' + k + '"]', root).map(txt).filter(Boolean); }
    return {
      slug: slug, name: name, code: (m.code || slug.replace(/[^a-z]/g, '').slice(0, 3)).toUpperCase(), notes: m.notes || [],
      t1: own(root, 'title-1') || name, t2: own(root, 'title-2'), short: own(root, 'short-name') || name, c: DOT[slug] || '#FF6A3D',
      p: [(own(root, 'planet-type') || 'gas').toLowerCase(), own(root, 'planet-colors'), own(root, 'planet-ring'), own(root, 'planet-glow') || 'transparent'],
      sum: own(root, 'summary'), best: own(root, 'best-for'), problem: own(root, 'solve-1-problem'),
      tools: list('tools', 'tool'), via: list('pairs', 'slug'), flown: list('missions', 'slug'),
      legs: [1, 2, 3, 4, 5, 6].map(function(n){ return own(root, 'process-leg-' + n); })
    };
  }).filter(function(s){ return s.slug; });
  if (!HUB.length) return;
  var BY = {}; HUB.forEach(function(s, i){ s.i = i; s.no = pad(i + 1); BY[s.slug] = s; });
  HUB.forEach(function(s){ s.via = s.via.filter(function(v){ return BY[v] && v !== s.slug; }); });
  function pairKey(a, b){ return [a, b].sort().join('|'); }
  // why two services fly well together: "other-slug | sentence" lines in each service's manifest entry
  var WHY = {};
  HUB.forEach(function(s){ s.notes.forEach(function(l){ var k = l.indexOf('|'); if (k < 0) return; var o = l.slice(0, k).trim(), w = l.slice(k + 1).trim(); if (BY[o] && w && !WHY[pairKey(s.slug, o)]) WHY[pairKey(s.slug, o)] = w; }); });
  var ROUTES = []; HUB.forEach(function(s){ s.via.forEach(function(v){ var k = pairKey(s.slug, v); if (!ROUTES.some(function(r){ return r.k === k; })) ROUTES.push({ k: k, a: s.slug, b: v }); }); });

  /* ---------- Missions (number order): the logbook; brand accents come from /work (Color fields can't bind) ---------- */
  var FLIGHTS = $$('[data-log-fields]').map(function(m){
    var f = function(k){ return txt($('[data-field="' + k + '"]', m)); };
    return { slug: f('slug'), no: pad(parseInt(f('number'), 10) || 0), name: f('name'), client: f('client'), status: f('status') || 'Live', c: '#FF6A3D' };
  }).filter(function(f){ return f.slug; });
  var FBY = {}; FLIGHTS.forEach(function(f){ FBY[f.slug] = f; f.svc = HUB.filter(function(s){ return s.flown.indexOf(f.slug) > -1; }); });
  function misHref(slug){ return FBY[slug] && /placeholder/i.test(FBY[slug].status) ? WORK : MIS + slug; }

  /* ---------- the six stages (Designer cards in the flight plan) ---------- */
  var STAGES = $$('.ab_hub-wp').map(function(w){
    return { code: w.getAttribute('data-stage') || '', name: txt($('.ab_hub-wp_title', w)), flown: $('[data-fl-flown]', w) ? $('[data-fl-flown]', w).getAttribute('data-flown-what') : '' };
  });

  // stations on the trajectory map (% of the map box), laid out so the transfer orbits don't tangle; new services get a free spot
  var PORT = { 'webflow-development': [40, 46], 'webgl-data': [70, 16], motion: [52, 80], branding: [18, 74], 'custom-deploys': [90, 44], 'cms-integrations': [66, 52], 'design-systems': [24, 18], performance: [82, 82] };
  var SPARE = [[30, 88], [88, 18], [12, 30], [60, 30], [48, 14], [34, 60]];
  HUB.forEach(function(s){ if (!PORT[s.slug]) PORT[s.slug] = SPARE.shift() || [50, 50]; });

  function planetAttrs(el, s, seed){
    el.setAttribute('data-planet', s.p[0]); el.setAttribute('data-colors', s.p[1]); el.setAttribute('data-glow', s.p[3]); el.setAttribute('data-seed', seed); el.setAttribute('data-spin', '50');
    if (s.p[2]){ el.setAttribute('data-ring', s.p[2]); el.setAttribute('data-tilt', '-16'); } else el.removeAttribute('data-ring');
  }
  function planetEl(s, seed, cls){ var el = document.createElement('span'); el.className = 'ab_planet ' + (cls || ''); planetAttrs(el, s, seed); el.setAttribute('aria-hidden', 'true'); return el; }
  // swap a planet's look in place (keeps its Draggable + position)
  function repaint(el, s, seed){
    if (!el || !AB.buildPlanet) return;
    el.innerHTML = ''; el.__built = false; el.__body = null;
    planetAttrs(el, s, seed); AB.buildPlanet(el);
  }
  function build(el){ if (AB.buildPlanet) AB.buildPlanet(el); }
  // Lenis gets a number, not an element (element targets misfire with transformed/pinned content)
  function goTo(el, instant, off){ var y = el.getBoundingClientRect().top + scrollY - (off == null ? 0 : off); try { if (AB.lenis){ AB.lenis.scrollTo(y, { immediate: !!instant }); return; } } catch (e){} window.scrollTo({ top: y, behavior: instant || reduce ? 'auto' : 'smooth' }); }
  function btnHTML(kind, href, label, arrow, attrs){
    return '<a class="button ' + kind + '" href="' + href + '"' + (attrs || '') + '>' + (kind.indexOf('is-primary') > -1 ? '<span class="ab_button-shine"></span>' : '') +
      '<span class="ab_button-label">' + label + '</span>' + (arrow ? '<span class="ab_button-arrow" aria-hidden="true">' + arrow + '</span>' : '') + '</a>';
  }
  $$('[data-hub-count]').forEach(function(n){ n.textContent = HUB.length; });
  // the Designer trims the leading space of the monitor bar's " · 8 launches"
  $$('.ab_mon_tc .ab_hub-wide').forEach(function(n){ n.textContent = ' · ' + HUB.length + ' launches'; });
  $$('[data-hub-count2]').forEach(function(n){ n.textContent = pad(HUB.length); });
  $$('[data-hub-routes]').forEach(function(n){ n.textContent = ROUTES.length; });
  $$('[data-log-count]').forEach(function(n){ n.textContent = FLIGHTS.length; });
