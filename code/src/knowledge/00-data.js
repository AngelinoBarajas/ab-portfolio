  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-knowledge] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, hasGsap = AB.hasGsap, esc = AB.esc;

  /* =========================================================
     KNOWLEDGE SYSTEM · the Observatory (/observatory, /observatory/[slug], /topics, /topics/[slug])
     + the rows it adds to the Mission template, the Services template and Home.
     Webflow holds the real content (h1s, short answers, rich-text bodies, cards, topic links). This bundle reads the
     hidden CMS source lists ([data-ks-src] › records with data-ks-t / -o / -m / -sv / -f and nested refs) and builds
     the interactive layers: ask box, filters, star chart, related rows, planets, TOC. Every CMS link keeps a real href.
     ========================================================= */
  var vEl = $('[data-ks-view]'), rEl = $('[data-ks-row]');
  var VIEW = vEl ? vEl.getAttribute('data-ks-view') : '', ROW = rEl ? rEl.getAttribute('data-ks-row') : '';
  if (!VIEW && !ROW) return;

  // the six constellations (Topics › Category option names → keys, codes, tints)
  var CATS = [
    { key: 'who', code: 'WHO', name: 'Who I build for', blurb: 'The people and teams the work is for.' },
    { key: 'what', code: 'WHAT', name: 'What I build', blurb: 'The things that end up on the site.' },
    { key: 'how', code: 'HOW', name: 'How it gets built', blurb: 'The steps and habits behind every build.' },
    { key: 'watch', code: 'WATCH', name: 'What I watch for', blurb: 'The problems I check for before anything ships.' },
    { key: 'ideas', code: 'IDEAS', name: 'Why before how', blurb: 'Ideas from philosophy and science that shape the work.' },
    { key: 'known', code: 'KNOWN', name: 'Known for', blurb: 'The signature pieces people ask about.' }
  ];
  var CAT = {}; CATS.forEach(function(c, i){ c.i = i; CAT[c.key] = c; CAT[c.name.toLowerCase()] = c; });
  function catKey(v){ var c = CAT[String(v || '').trim().toLowerCase()]; return c ? c.key : 'what'; }
  // service accent colors (Color fields can't bind; same map as ab-process / ab-hub)
  var DOT = { 'webflow-development': '#146EF5', 'webgl-data': '#5eead4', motion: '#0AE448', branding: '#FF6A3D', 'custom-deploys': '#C9C7C0', 'cms-integrations': '#8fb1ff', 'design-systems': '#7c5cff', performance: '#ffd166' };
  var URL_T = '/topics/', URL_O = '/observatory/', URL_M = '/work/', URL_S = '/services/';

  function txt(root, sel){ var n = sel ? $(sel, root) : root; return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function f(root, k){ return txt(root, '[data-f="' + k + '"]') || txt(root, '[data-field="' + k + '"]'); }
  function item(n){ return n.closest('.w-dyn-item') || n.parentNode; }
  function refs(it, attr){ var out = []; $$('[' + attr + ']', it).forEach(function(r){ var v = r.getAttribute(attr); if (v && out.indexOf(v) < 0) out.push(v); }); return out; }
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  // `code` in plain-text fields → <code>
  function ticks(s){ return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }

  /* ---------- the model, read once from every source on the page ---------- */
  var TOPIC = {}, TOPICS = [];
  function addTopic(slug, o){
    if (!slug) return null;
    var t = TOPIC[slug];
    if (!t){ t = TOPIC[slug] = { slug: slug, name: '', cat: 'what', def: '', services: [], missions: [] }; TOPICS.push(t); }
    if (o.name && !t.name) t.name = o.name;
    if (o.cat) t.cat = catKey(o.cat);
    if (o.def && !t.def) t.def = o.def;
    if (o.services && o.services.length) t.services = o.services;
    if (o.missions && o.missions.length) t.missions = o.missions;
    return t;
  }
  $$('[data-ks-t]').forEach(function(n){
    var it = item(n);
    addTopic(n.getAttribute('data-slug'), { name: f(n, 'name'), cat: n.getAttribute('data-cat') || f(n, 'category'), def: f(n, 'definition'), services: refs(it, 'data-ks-s'), missions: refs(it, 'data-ks-tm') });
  });
  // topic refs nested in observations / cards also carry name + category
  $$('[data-ks-ot][data-cat], .ab_ks-tag[data-slug]').forEach(function(n){
    addTopic(n.getAttribute('data-ks-ot') || n.getAttribute('data-slug'), { name: txt(n), cat: n.getAttribute('data-cat') });
  });

  var OBS = [], OB = {};
  function addObs(o){ if (!o.slug || OB[o.slug]) return; OB[o.slug] = o; OBS.push(o); }
  $$('[data-ks-o]').forEach(function(n){
    var it = item(n);
    addObs({ slug: n.getAttribute('data-slug'), code: f(n, 'code'), theme: n.getAttribute('data-theme') || '', mins: n.getAttribute('data-mins') || '', name: f(n, 'name'), answer: f(n, 'answer'),
      topics: refs(it, 'data-ks-ot'), services: refs(it, 'data-ks-os'), missions: refs(it, 'data-ks-om') });
  });
  // native cards (/observatory grid, Home) are a source too
  $$('[data-ks-card]').forEach(function(a){
    var it = item(a);
    addObs({ slug: a.getAttribute('data-slug'), code: f(a, 'code'), theme: a.getAttribute('data-theme') || f(a, 'theme'), mins: f(a, 'reading-time'), name: f(a, 'name'), answer: f(a, 'short-answer'),
      topics: $$('.ab_ks-tag[data-slug]', it).map(function(t){ return t.getAttribute('data-slug'); }), services: [], missions: [] });
  });
  OBS.forEach(function(o){ o.themeKey = /why/i.test(o.theme) ? 'why-before-how' : 'build-notes'; o.href = URL_O + o.slug; });

  var MIS = [], MI = {};
  $$('[data-ks-m]').forEach(function(n){
    var slug = n.getAttribute('data-slug'); if (!slug || MI[slug]) return;
    var m = MI[slug] = { slug: slug, no: pad2(parseInt(n.getAttribute('data-no'), 10) || 0), planet: (n.getAttribute('data-planet') || 'gas').toLowerCase(), colors: n.getAttribute('data-colors') || '', glow: n.getAttribute('data-glow') || 'transparent',
      name: f(n, 'name'), client: f(n, 'client'), sum: f(n, 'summary'), topics: refs(item(n), 'data-ks-mt'), href: URL_M + slug };
    MIS.push(m);
  });
  var SVC = [], SV = {};
  $$('[data-ks-sv]').forEach(function(n){
    var slug = n.getAttribute('data-slug'); if (!slug || SV[slug]) return;
    var s = SV[slug] = { slug: slug, planet: (n.getAttribute('data-planet') || 'gas').toLowerCase(), colors: n.getAttribute('data-colors') || '', glow: n.getAttribute('data-glow') || 'transparent',
      name: f(n, 'name'), t1: f(n, 't1'), t2: f(n, 't2'), sum: f(n, 'summary'), c: DOT[slug] || '#FF6A3D', href: URL_S + slug };
    SVC.push(s);
  });
  var FAQ = [];
  $$('[data-ks-f]').forEach(function(n){ FAQ.push({ q: f(n, 'q'), a: f(n, 'a'), topics: refs(item(n), 'data-ks-ft') }); });

  var CUR = $('[data-ks-current]'), CUR_SLUG = CUR ? CUR.getAttribute('data-slug') : '';

  function notesFor(slug){ return OBS.filter(function(o){ return o.topics.indexOf(slug) > -1; }); }
  // Topic › Missions is the source of truth (a mission's nested topic list stops at 5 items); fall back to Mission › Topics
  function misFor(slug){ var t = TOPIC[slug]; return t && t.missions.length ? MIS.filter(function(m){ return t.missions.indexOf(m.slug) > -1; }) : MIS.filter(function(m){ return m.topics.indexOf(slug) > -1; }); }
  function misCount(t){ return t.missions.length || misFor(t.slug).length; }
  function links(t){ return notesFor(t.slug).length + misCount(t) + t.services.length; }

  /* ---------- markup shared by every view (classes styled in ab-knowledge.css) ---------- */
  function chip(slug, tag){
    var t = TOPIC[slug]; if (!t) return '';
    return '<a class="ab_ks-chip" data-cat="' + t.cat + '" href="' + URL_T + t.slug + '"' + (tag || '') + '>' + esc(t.name) + '</a>';
  }
  function card(o){
    return '<a class="ab_ks-card is-built" href="' + o.href + '" data-ks-card="" data-slug="' + o.slug + '" data-theme="' + esc(o.theme) + '">' +
      '<span class="ab_ks-scan" aria-hidden="true"></span>' +
      '<div class="ab_ks-card_top"><div class="ab_ks-card_code"><div class="ab_ks-card_no">' + esc(o.code) + '</div><div class="ab_ks-card_sep">·</div><div class="ab_ks-card_theme">' + esc(o.theme) + '</div></div>' +
      '<div class="ab_ks-card_min"><div class="ab_ks-card_mins">' + esc(o.mins) + '</div><div class="ab_ks-card_minl">min</div></div></div>' +
      '<h3 class="ab_ks-card_h">' + esc(o.name) + '</h3><p class="ab_ks-card_p">' + ticks(o.answer) + '</p>' +
      '<div class="ab_ks-card_foot"><div class="ab_ks-tags">' + o.topics.map(function(s){ var t = TOPIC[s]; return t ? '<span class="ab_ks-tag" data-cat="' + t.cat + '">' + esc(t.name) + '</span>' : ''; }).join('') + '</div>' +
      '<div class="ab_ks-go" aria-hidden="true">→</div></div></a>';
  }
  function grid(list){ return '<div class="ab_ks-grid is-built">' + list.map(card).join('') + '</div>'; }
  function planet(p, seed, cls){
    return '<span class="ab_ks-pl' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><span class="ab_planet is-ks-icon" data-planet="' + esc(p.planet) + '" data-seed="' + seed + '" data-colors="' + esc(p.colors) + '" data-spin="40" data-glow="' + esc(p.glow) + '"></span></span>';
  }
  var PSEED = 17;
  // ringless planet icons: built after they're in the DOM (core only collects planets present at load)
  function buildPlanets(root){
    $$('.ab_planet.is-ks-icon', root).forEach(function(p){ if (AB.buildPlanet) AB.buildPlanet(p); });
  }
  function btn(href, label){ return '<a class="button is-primary" href="' + href + '"><span class="ab_button-shine"></span><span class="ab_button-label">' + esc(label) + '</span><span class="ab_button-arrow" aria-hidden="true">→</span></a>'; }
  function hideSec(sel){ var s = $(sel); if (s) s.style.display = 'none'; }
  // cards in the /observatory grid and Home: pull the nested tag list into the card, fix the href (see build notes: the
  // template link resolves to the static page when both share a slug), normalize category keys
  function wireNativeCards(){
    $$('[data-ks-card]:not(.is-built)').forEach(function(a){
      var it = item(a), slug = a.getAttribute('data-slug'), list = $('[data-ks-taglist]', it), slot = $('[data-ks-tags]', a);
      if (slug) a.setAttribute('href', URL_O + slug);
      a.removeAttribute('aria-current'); a.classList.remove('w--current');
      if (list && slot) slot.appendChild(list);
      $$('.ab_ks-tag', it).forEach(function(t){ t.setAttribute('data-cat', catKey(t.getAttribute('data-cat'))); });
      var p = $('.ab_ks-card_p', a); if (p && p.textContent.indexOf('`') > -1) p.innerHTML = ticks(p.textContent);
    });
    $$('a[data-ks-t]').forEach(function(a){ var s = a.getAttribute('data-slug'); if (s) a.setAttribute('href', URL_T + s); a.removeAttribute('aria-current'); a.classList.remove('w--current'); });
  }
  wireNativeCards();
  $$('[data-ks-n="obs"]').forEach(function(n){ if (OBS.length) n.textContent = OBS.length; });
  $$('[data-ks-n="topics"]').forEach(function(n){ if (TOPICS.length) n.textContent = TOPICS.length; });

  // reveals for script-built blocks (cards, rows)
  function reveal(root){
    var els = $$('.ab_ks-card, .ab_ks-mcard, .ab_ks-cat, .ab_ks-svc_row', root);
    if (reduce || !('IntersectionObserver' in window)){ els.forEach(function(e){ e.classList.add('is-in'); }); return; }
    els.forEach(function(e){ e.classList.add('ab_ks-rv'); });
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (!e.isIntersecting) return; var el = e.target, d = (Array.prototype.indexOf.call(el.parentNode.children, el) % 3) * 80; setTimeout(function(){ el.classList.add('is-in'); }, d); io.unobserve(el); }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function(e){ io.observe(e); });
  }
