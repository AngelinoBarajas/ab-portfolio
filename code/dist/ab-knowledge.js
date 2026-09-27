/*! AB Portfolio · ab-knowledge v0.26.0 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abKnowledgeInit) return;
  window.__abKnowledgeInit = true;
  /* ===== knowledge/00-data.js ===== */
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

  /* ===== knowledge/10-library.js ===== */
  /* ---------- topic index: group the native topic links ([data-ks-catwrap]) into the six constellations ---------- */
  (function(){
    var wrap = $('[data-ks-catwrap]'); if (!wrap) return;
    var links_ = $$('a[data-ks-t]', wrap); if (!links_.length) return;
    var cols = CATS.map(function(c){
      var ts = links_.filter(function(a){ return catKey(a.getAttribute('data-cat')) === c.key; });
      var box = document.createElement('div'); box.className = 'ab_ks-cat'; box.setAttribute('data-cat', c.key);
      box.innerHTML = '<div class="ab_ks-cat_h"><b>' + c.code + '</b><span>' + pad2(ts.length) + ' stars</span></div><h3 class="ab_ks-cat_t">' + esc(c.name) + '</h3><p class="ab_ks-cat_p">' + esc(c.blurb) + '</p><ul class="ab_ks-cat_ul"></ul>';
      var ul = $('ul', box);
      ts.forEach(function(a){
        var t = TOPIC[a.getAttribute('data-slug')], li = document.createElement('li');
        a.setAttribute('data-cat', c.key);
        var n = t ? (VIEW === 'chart' ? notesFor(t.slug).length + ' obs · ' + misCount(t) + ' missions' : links(t) + (links(t) === 1 ? ' link' : ' links')) : '';
        var meta = document.createElement('span'); meta.className = 'ab_ks-tlink_m'; meta.textContent = n;
        a.appendChild(meta); li.appendChild(a); ul.appendChild(li);
      });
      return box;
    });
    var grid_ = document.createElement('div'); grid_.className = 'ab_ks-cats';
    cols.forEach(function(c){ grid_.appendChild(c); });
    wrap.innerHTML = ''; wrap.appendChild(grid_);
    reveal(wrap);
  })();

  /* ---------- /observatory: ask box, stats, theme + topic filters over the native cards ---------- */
  if (VIEW === 'library') (function(){
    var gridEl = $('[data-ks-grid]'), cards = $$('[data-ks-card]'), items = cards.map(function(a){ return item(a); });
    var ask = $('[data-ks-ask]'), ctrl = $('[data-ks-ctrl]'), empty = $('[data-ks-empty]'), stats = $('[data-ks-hstats]');
    if (!gridEl || !cards.length) return;
    // featured first card when nothing is filtered
    var nBN = OBS.filter(function(o){ return o.themeKey === 'build-notes'; }).length;
    var used = {}; OBS.forEach(function(o){ o.topics.forEach(function(s){ used[s] = (used[s] || 0) + 1; }); });
    var usedList = Object.keys(used).filter(function(s){ return TOPIC[s]; }).sort(function(a, b){ return used[b] - used[a] || TOPIC[a].name.localeCompare(TOPIC[b].name); });

    if (stats) stats.innerHTML = [['Observations', pad2(OBS.length)], ['Themes', '02'], ['Topics', pad2(TOPICS.length)], ['Constellations', '06']]
      .map(function(s){ return '<div class="ab_ks-hstat"><span>' + s[0] + '</span><b>' + s[1] + '</b></div>'; }).join('');
    if (ask) ask.innerHTML = '<div class="ab_ks-ask_h"><span>Ask the observatory</span><span><b data-ks-askn="">' + OBS.length + '</b> observations in range</span></div>' +
      '<div class="ab_ks-ask_row"><label for="ksQ" aria-hidden="true">&gt;</label><input id="ksQ" type="search" autocomplete="off" placeholder="What are you stuck on?" aria-label="Search the observatory"><button type="button" class="ab_ks-ask_x" data-ks-qx="" hidden>Clear</button></div>' +
      '<div class="ab_ks-ask_q" aria-label="Common questions"><button type="button" data-q="scroll">Why does my scroll stutter?</button><button type="button" data-q="3d">Will 3D slow my site down?</button><button type="button" data-q="schema">How do I add schema?</button><button type="button" data-q="scope">The project keeps growing</button></div>' +
      '<div class="ab_ks-ask_hit" data-ks-hit="" aria-live="polite"></div>';
    if (ctrl) ctrl.innerHTML = '<div class="ab_ks-tabs" role="group" aria-label="Theme"><button type="button" data-theme="all" aria-pressed="true">All <b>' + OBS.length + '</b></button><button type="button" data-theme="build-notes" aria-pressed="false">Build notes <b>' + nBN + '</b></button><button type="button" data-theme="why-before-how" aria-pressed="false">Why before how <b>' + (OBS.length - nBN) + '</b></button></div>' +
      '<div class="ab_ks-chips" role="group" aria-label="Topic">' + usedList.map(function(s, i){ return '<button type="button" class="ab_ks-chip' + (i > 7 ? ' is-more' : '') + '" data-cat="' + TOPIC[s].cat + '" data-topic="' + s + '" aria-pressed="false">' + esc(TOPIC[s].name) + ' <b>' + used[s] + '</b></button>'; }).join('') +
        (usedList.length > 8 ? '<button type="button" class="ab_ks-chip is-morebtn" data-ks-more="" aria-expanded="false">+ ' + (usedList.length - 8) + ' more topics</button>' : '') + '</div>' +
      '<div class="ab_ks-readout"><span>Showing <b data-ks-shown="">' + OBS.length + '</b> of ' + OBS.length + ' · filter <b data-ks-filt="">none</b></span><button type="button" data-ks-reset="" hidden>Clear filters ×</button></div>';
    if (empty) empty.innerHTML = '<b>No signal</b>Nothing observed on that yet. <button type="button" class="ab_ks-ask_x" data-ks-reset2="">Clear filters</button>';

    // search text per card: title, answer, topic names
    cards.forEach(function(a){ var o = OB[a.getAttribute('data-slug')] || {}; a.__q = ((o.name || '') + ' ' + (o.answer || '') + ' ' + (o.topics || []).map(function(s){ return TOPIC[s] ? TOPIC[s].name : ''; }).join(' ')).toLowerCase(); a.__theme = o.themeKey; a.__topics = o.topics || []; });
    var st = { theme: 'all', topic: '', q: '' }, q = $('#ksQ');
    var hasFlip = hasGsap && window.Flip && !reduce;
    function apply(){
      var state = hasFlip ? Flip.getState(items) : null, shown = 0, first = null, words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      cards.forEach(function(a, i){
        var ok = (st.theme === 'all' || a.__theme === st.theme) && (!st.topic || a.__topics.indexOf(st.topic) > -1) && words.every(function(w){ return a.__q.indexOf(w) > -1; });
        items[i].classList.toggle('is-hid', !ok); if (ok){ shown++; if (!first) first = a; }
      });
      var plain = st.theme === 'all' && !st.topic && !words.length;
      items.forEach(function(it, i){ it.classList.toggle('is-feat', plain && i === 0); });
      if (hasFlip) Flip.from(state, { duration: .55, ease: 'power3.inOut', absolute: true, stagger: .02,
        onEnter: function(els){ return gsap.fromTo(els, { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .4 }); },
        onLeave: function(els){ return gsap.to(els, { opacity: 0, scale: .96, duration: .25 }); } });
      $$('[data-ks-shown], [data-ks-askn]').forEach(function(n){ n.textContent = shown; });
      var fl = []; if (st.theme !== 'all') fl.push(st.theme.replace(/-/g, ' ')); if (st.topic) fl.push(TOPIC[st.topic].name); if (words.length) fl.push('"' + st.q + '"');
      var ft = $('[data-ks-filt]'); if (ft) ft.textContent = fl.length ? fl.join(' + ') : 'none';
      var rs = $('[data-ks-reset]'); if (rs) rs.hidden = !fl.length;
      var qx = $('[data-ks-qx]'); if (qx) qx.hidden = !st.q;
      if (empty) empty.classList.toggle('is-on', !shown);
      var hit = $('[data-ks-hit]');
      if (hit) hit.innerHTML = words.length ? (first ? 'Best match <b>›</b> <a href="' + first.getAttribute('href') + '">' + esc(txt(first, '.ab_ks-card_h')) + '</a>' + (shown > 1 ? ' <span>+ ' + (shown - 1) + ' more below</span>' : '') : 'Nothing observed on that yet. <a href="/contact">Ask me directly →</a>') : '';
    }
    $$('.ab_ks-tabs button').forEach(function(b){ b.addEventListener('click', function(){ st.theme = b.getAttribute('data-theme'); $$('.ab_ks-tabs button').forEach(function(x){ x.setAttribute('aria-pressed', x === b); }); apply(); }); });
    $$('[data-topic]', ctrl).forEach(function(b){ b.addEventListener('click', function(){ st.topic = st.topic === b.getAttribute('data-topic') ? '' : b.getAttribute('data-topic'); $$('[data-topic]', ctrl).forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-topic') === st.topic); }); apply(); }); });
    var more = $('[data-ks-more]');
    if (more) more.addEventListener('click', function(){ var on = !ctrl.classList.contains('is-all'); ctrl.classList.toggle('is-all', on); more.setAttribute('aria-expanded', on); more.textContent = on ? '− fewer topics' : '+ ' + (usedList.length - 8) + ' more topics'; });
    var qt;
    if (q) q.addEventListener('input', function(){ clearTimeout(qt); qt = setTimeout(function(){ st.q = q.value.trim(); apply(); }, 120); });
    $$('.ab_ks-ask_q button').forEach(function(b){ b.addEventListener('click', function(){ q.value = b.getAttribute('data-q'); st.q = q.value; apply(); q.focus(); }); });
    function reset(){ st = { theme: 'all', topic: '', q: '' }; if (q) q.value = ''; $$('.ab_ks-tabs button').forEach(function(x, i){ x.setAttribute('aria-pressed', i === 0); }); $$('[data-topic]', ctrl).forEach(function(x){ x.setAttribute('aria-pressed', 'false'); }); apply(); }
    $$('[data-ks-reset], [data-ks-reset2], [data-ks-qx]').forEach(function(b){ b.addEventListener('click', reset); });
    apply();
    reveal(gridEl.parentNode);
  })();

  /* ---------- Home › Incoming signals: native cards, just reveal them ---------- */
  if (ROW === 'home') reveal($('[data-ks-row="home"]'));

  /* ===== knowledge/20-article.js ===== */
  /* ---------- /observatory/[slug]: the article ---------- */
  if (VIEW === 'article') (function(){
    var X = OB[CUR_SLUG] || { slug: CUR_SLUG, topics: [] };
    var curTopics = $$('[data-ks-src="cur-topics"] [data-ks-t]').map(function(n){ return n.getAttribute('data-slug'); });
    X.topics = curTopics.length ? curTopics : X.topics;

    // title: "Smooth scroll without the stutter: Lenis + GSAP" → solid first half, outlined second half
    var h1 = $('[data-ks-title]');
    if (h1){ var m = h1.textContent.match(/^(.+?[:.?])\s+(.+)$/); h1.innerHTML = m ? '<span class="ab_dbh_word">' + esc(m[1]) + '</span> <span class="ab_dbh_word t-outline">' + esc(m[2]) + '</span>' : '<span class="ab_dbh_word">' + esc(h1.textContent) + '</span>'; }
    var ans = $('[data-ks-answer]'); if (ans && ans.textContent.indexOf('`') > -1) ans.innerHTML = ticks(ans.textContent);
    var achips = $('[data-ks-achips]'); if (achips) achips.innerHTML = X.topics.map(function(s){ return chip(s); }).join('');

    // prose: § numbers + ids on h2, code panels from <pre><code data-lang>
    var rt = $('[data-ks-rt]'), toc = [];
    if (rt){
      $$('h2', rt).forEach(function(h, i){
        var t = h.textContent.replace(/^\d+\.\s*/, ''), id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        h.id = id; h.innerHTML = '<i>§' + pad2(i + 1) + '</i><span>' + esc(t) + '</span>'; toc.push([id, t]);
      });
      $$('pre', rt).forEach(function(pre){
        var code = pre.textContent.replace(/\n$/, '');
        var wrap = document.createElement('div'); wrap.innerHTML = AB.codeBlock ? AB.codeBlock(code, 'from the build') : '<pre><code>' + esc(code) + '</code></pre>';
        pre.parentNode.replaceChild(wrap.firstChild, pre);
      });
      $$('a[href]', rt).forEach(function(a){ var h = a.getAttribute('href'); if (/^https?:/.test(h) && h.indexOf(location.host) < 0){ a.target = '_blank'; a.rel = 'noopener'; } });
    }

    // aside: on this page, filed under, related services (planets), shown in practice (planets)
    var aside = $('[data-ks-aside]'), cMis = $$('[data-ks-src="missions"] [data-ks-m]').map(function(n){ return MI[n.getAttribute('data-slug')]; }).filter(Boolean);
    if (aside){
      aside.innerHTML =
        (toc.length ? '<div class="ab_ks-box is-toc"><div class="ab_ks-box_h"><span>On this page</span><b data-ks-tocn="">01 / ' + pad2(toc.length) + '</b></div><ol class="ab_ks-toc">' + toc.map(function(t, i){ return '<li><a href="#' + t[0] + '"><i>' + pad2(i + 1) + '</i><span>' + esc(t[1]) + '</span></a></li>'; }).join('') + '</ol><div class="ab_ks-alt"><i data-ks-alt=""></i></div></div>' : '') +
        (X.topics.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Filed under</span><b>' + pad2(X.topics.length) + '</b></div><div class="ab_ks-chips">' + X.topics.map(function(s){ return chip(s); }).join('') + '</div></div>' : '') +
        (SVC.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Related services</span><b>' + pad2(SVC.length) + '</b></div><ul class="ab_ks-rel_s">' + SVC.map(function(s){ return '<li><a href="' + s.href + '">' + planet(s, PSEED++) + '<span class="ab_ks-rel_n">' + esc(s.t1 + ' ' + s.t2) + '</span><span class="ab_ks-rel_x">→</span></a></li>'; }).join('') + '</ul></div>' : '') +
        (cMis.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Shown in practice</span><b>' + pad2(cMis.length) + '</b></div><ul class="ab_ks-rel_s">' + cMis.map(function(m){ return '<li><a href="' + m.href + '">' + planet(m, PSEED++) + '<span class="ab_ks-rel_n">' + esc(m.name) + '</span><span class="ab_ks-rel_x">M-' + m.no + '</span></a></li>'; }).join('') + '</ul></div>' : '');
      buildPlanets(aside);
    }

    // related reading: most shared topics, then same theme
    var rel = OBS.filter(function(y){ return y.slug !== X.slug; }).map(function(y){
      var s = y.topics.filter(function(t){ return X.topics.indexOf(t) > -1; }).length * 2 + (y.themeKey === (X.themeKey || '') ? 1 : 0); return [s, y];
    }).sort(function(a, b){ return b[0] - a[0]; }).slice(0, 3).map(function(p){ return p[1]; });
    var relEl = $('[data-ks-rel]'); if (relEl){ relEl.innerHTML = grid(rel); reveal(relEl); }
    var xi = -1; OBS.forEach(function(o, i){ if (o.slug === X.slug) xi = i; });
    var pager = $('[data-ks-pager]');
    if (pager && xi > -1 && OBS.length > 1){
      var P = OBS[(xi - 1 + OBS.length) % OBS.length], N = OBS[(xi + 1) % OBS.length];
      pager.innerHTML = '<a href="' + P.href + '"><span>← Previous · ' + esc(P.code) + '</span><b>' + esc(P.name) + '</b></a><a href="' + N.href + '"><span>Next · ' + esc(N.code) + ' →</span><b>' + esc(N.name) + '</b></a>';
    }

    // reading progress + TOC state
    var prog = $('[data-ks-prog]'), prose = $('[data-ks-prose]'), tocA = $$('.ab_ks-toc a'), heads = tocA.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }), alt = $('[data-ks-alt]'), tocN = $('[data-ks-tocn]');
    var ticking = false;
    function onScroll(){
      ticking = false; if (!prose) return;
      var r = prose.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .35 - r.top) / Math.max(1, r.height - innerHeight * .35)));
      if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')'; if (alt) alt.style.width = (p * 100).toFixed(1) + '%';
      var cur = 0; heads.forEach(function(h, i){ if (h && h.getBoundingClientRect().top < innerHeight * .3) cur = i; });
      tocA.forEach(function(a, i){ a.classList.toggle('is-on', i === cur); });
      if (tocN) tocN.textContent = pad2(cur + 1) + ' / ' + pad2(tocA.length);
    }
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
    tocA.forEach(function(a){ a.addEventListener('click', function(e){ var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return; e.preventDefault(); if (AB.lenis) AB.lenis.scrollTo(t, { offset: -100 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }); });
    document.title = (h1 ? h1.textContent : 'Observation') + ' · Observatory · Angelino Barajas';
  })();

  /* ===== knowledge/30-chart.js ===== */
  /* ---------- star chart geometry (shared by /topics and the topic page mini-map) ---------- */
  var CENTER = { who: [200, 200], what: [650, 180], how: [1090, 210], watch: [190, 590], ideas: [700, 600], known: [1130, 580] };
  // hand-placed star slots per constellation: [dx, dy, label side]
  var SHAPES = [[-120, -40, 'L'], [-10, -95, 'R'], [110, -30, 'R'], [80, 70, 'R'], [-30, 110, 'R'], [-130, 70, 'L']];
  var POS = {}, SIDE = {};
  CATS.forEach(function(c){
    TOPICS.filter(function(t){ return t.cat === c.key; }).forEach(function(t, i){
      var s = SHAPES[i % 6], cx = CENTER[c.key]; POS[t.slug] = [cx[0] + s[0], cx[1] + s[1]];
      SIDE[t.slug] = t.slug === 'philosophy-at-work' ? 'R' : s[2]; // one hand-tuned label (it collides with Reduced motion)
    });
  });
  var XL = [];
  OBS.forEach(function(x){ for (var i = 0; i < x.topics.length; i++) for (var j = i + 1; j < x.topics.length; j++){ var a = x.topics[i], b = x.topics[j]; if (!POS[a] || !POS[b]) continue; var k = a < b ? a + '|' + b : b + '|' + a; if (XL.indexOf(k) < 0) XL.push(k); } });
  function starR(t){ return 3 + Math.sqrt(links(t)) * 1.7; }
  function consPath(key, dx, dy){ var ts = TOPICS.filter(function(t){ return t.cat === key && POS[t.slug]; }); return ts.length ? 'M' + ts.map(function(t){ return (POS[t.slug][0] - (dx || 0)) + ' ' + (POS[t.slug][1] - (dy || 0)); }).join(' L') : ''; }

  if (VIEW === 'chart') (function(){
    var mount = $('[data-ks-chart]'); if (!mount || !TOPICS.length) return;
    // the grid is a tiling pattern over a huge rect, so it never ends when the view is panned past the chart
    var g = '<defs><pattern id="abKsGrid" width="100" height="90" patternUnits="userSpaceOnUse"><path class="gp" d="M100 0H0V90"/></pattern></defs>' +
      '<g class="grid"><rect x="-5000" y="-4000" width="11400" height="8800" fill="url(#abKsGrid)"/><circle cx="660" cy="390" r="230"/><circle cx="660" cy="390" r="440"/><circle cx="660" cy="390" r="760"/>';
    // faint background stars across the whole pannable area (deterministic, so every visit looks the same)
    var sd = 7; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; }
    for (var bs = 0; bs < 260; bs++){ var bx = -1400 + rnd() * 4200, by = -700 + rnd() * 2200, br = rnd(); g += '<circle class="bg-st" cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + (br < .85 ? .8 : 1.4) + '" opacity="' + (.15 + rnd() * .35).toFixed(2) + '"/>'; }
    g += '</g>';
    var xl = XL.map(function(k){ var p = k.split('|'), a = POS[p[0]], b = POS[p[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 40;
      return '<path class="xl" data-a="' + p[0] + '" data-b="' + p[1] + '" d="M' + a.join(' ') + ' Q' + mx + ' ' + my + ' ' + b.join(' ') + '"/>'; }).join('');
    var cons = CATS.map(function(c){
      var ys = TOPICS.filter(function(t){ return t.cat === c.key && POS[t.slug]; }).map(function(t){ return POS[t.slug][1]; }); if (!ys.length) return '';
      var top = Math.min.apply(null, ys), cx = CENTER[c.key];
      return '<g data-cat="' + c.key + '"><path class="cl" d="' + consPath(c.key) + '"/><text class="cc" x="' + (cx[0] - 150) + '" y="' + (top - 50) + '">' + c.code + ' · ' + pad2(c.i + 1) + '</text><text class="cn" x="' + (cx[0] - 150) + '" y="' + (top - 26) + '">' + esc(c.name) + '</text></g>';
    }).join('');
    var stars = TOPICS.filter(function(t){ return POS[t.slug]; }).map(function(t, i){
      var p = POS[t.slug], r = starR(t), right = SIDE[t.slug] === 'R';
      return '<a href="' + URL_T + t.slug + '" data-cat="' + t.cat + '" data-slug="' + t.slug + '" aria-label="' + esc(t.name) + ', ' + links(t) + ' links">' +
        '<circle class="st-h" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r * 3.2) + '"/><circle class="st-r" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r + 5) + '"/>' +
        '<circle class="st' + (i % 3 ? '' : ' tw') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>' +
        '<text class="tl" x="' + (p[0] + (right ? r + 9 : -(r + 9))) + '" y="' + (p[1] + 4) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(t.name) + '</text></a>';
    }).join('');
    mount.innerHTML = '<div class="ab_ks-chart" data-lenis-prevent-wheel=""><div class="ab_ks-chart_h"><span>Chart · ' + TOPICS.length + ' stars · ' + XL.length + ' shared-observation routes</span><span>Star size = <b>links</b> · dashed = <b>shares an observation</b></span></div>' +
      '<div class="ab_ks-map" data-ks-map=""><svg viewBox="-110 20 1510 760" role="img" aria-label="Star chart of ' + TOPICS.length + ' topics in six constellations">' + g + xl + cons + stars + '</svg></div>' +
      '<div class="ab_ks-read" data-ks-read="" data-lenis-prevent="" aria-live="polite"></div>' +
      '<div class="ab_ks-chart_f" role="group" aria-label="Fly to a constellation"><span class="ab_ks-chart_fl">Fly to</span>' + CATS.map(function(c){ return '<button type="button" class="ab_ks-chip is-cons" data-cat="' + c.key + '" aria-pressed="false"><b>' + c.code + '</b>' + esc(c.name) + '</button>'; }).join('') + '</div></div>';

    var map = $('[data-ks-map]', mount), read = $('[data-ks-read]', mount), links_ = $$('a', map), xls = $$('.xl', map), sel = null, lastType = 'mouse';
    function show(a){
      if (sel === a) return; sel = a;
      var t = TOPIC[a.getAttribute('data-slug')], c = CAT[t.cat], n = notesFor(t.slug), ms = misFor(t.slug), near = {};
      xls.forEach(function(l){ var on = l.getAttribute('data-a') === t.slug || l.getAttribute('data-b') === t.slug; l.classList.toggle('is-on', on); if (on){ near[l.getAttribute('data-a')] = 1; near[l.getAttribute('data-b')] = 1; } });
      links_.forEach(function(s){ s.classList.toggle('is-on', s === a); s.classList.toggle('is-near', !!near[s.getAttribute('data-slug')] && s !== a); });
      map.classList.add('is-dim');
      read.setAttribute('data-cat', t.cat);
      read.innerHTML = '<span class="ab_ks-read_c">' + c.code + ' · ' + esc(c.name) + '</span><h3 class="ab_ks-read_t">' + esc(t.name) + '</h3><p class="ab_ks-read_p">' + esc(t.def) + '</p>' +
        '<dl class="ab_ks-read_dl"><div><dt>Observed</dt><dd>' + pad2(n.length) + '</dd></div><div><dt>Missions</dt><dd>' + pad2(misCount(t)) + '</dd></div><div><dt>Services</dt><dd>' + pad2(t.services.length) + '</dd></div></dl>' +
        (n.length ? '<ul class="ab_ks-read_ul">' + n.slice(0, 3).map(function(x){ return '<li><i>' + esc(x.code) + '</i><a href="' + x.href + '">' + esc(x.name) + '</a></li>'; }).join('') + '</ul>' : '<p class="ab_ks-read_none">No observations on this one yet. It still tags missions and services.</p>') +
        btn(URL_T + t.slug, 'Open topic');
    }
    document.addEventListener('pointerdown', function(e){ lastType = e.pointerType || 'mouse'; }, true);
    links_.forEach(function(a){
      a.addEventListener('pointerenter', function(e){ if (e.pointerType !== 'touch') show(a); });
      a.addEventListener('focus', function(){ show(a); });
      // touch: first tap reads the star, the second opens it (a tap fires enter + leave too, so hover ignores touch)
      a.addEventListener('click', function(e){ if (lastType === 'touch' && sel !== a){ e.preventDefault(); show(a); } });
    });
    var top = links_.slice().sort(function(x, y){ return links(TOPIC[y.getAttribute('data-slug')]) - links(TOPIC[x.getAttribute('data-slug')]); })[0];
    if (top) show(top);

    /* ---------- pan + zoom: drag to pan, pinch or Ctrl/⌘ + wheel to zoom, +/−/reset buttons, double-click zooms in.
       Plain wheel still scrolls the page (the chart never traps it). Works on the SVG viewBox, so labels stay crisp. ---------- */
    var svg = $('svg', map), V0 = { x: -110, y: 20, w: 1510, h: 760 }, v = { x: V0.x, y: V0.y, w: V0.w, h: V0.h }, MAXZ = 4;
    var ui = document.createElement('div'); ui.className = 'ab_ks-zoom';
    ui.innerHTML = '<button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="reset" aria-label="Reset view">⟲</button><span class="ab_ks-zoom_z" aria-hidden="true">1.0×</span>';
    map.appendChild(ui);
    var hint = document.createElement('div'); hint.className = 'ab_ks-zoom_hint'; hint.textContent = (AB.coarse ? 'Drag to pan · pinch to zoom' : 'Drag to pan · Ctrl + scroll or double-click to zoom'); map.appendChild(hint);
    var zl = $('.ab_ks-zoom_z', ui);
    function clamp(){
      v.w = Math.max(V0.w / MAXZ, Math.min(V0.w, v.w)); v.h = v.w * V0.h / V0.w;
      // pan is free at any zoom, but at least ~40% of the chart stays in frame so you can't get lost in empty space
      v.x = Math.max(V0.x - v.w * .6, Math.min(V0.x + V0.w - v.w * .4, v.x)); v.y = Math.max(V0.y - v.h * .6, Math.min(V0.y + V0.h - v.h * .4, v.y));
    }
    function apply(){ clamp(); svg.setAttribute('viewBox', v.x.toFixed(1) + ' ' + v.y.toFixed(1) + ' ' + v.w.toFixed(1) + ' ' + v.h.toFixed(1)); var z = V0.w / v.w; zl.textContent = z.toFixed(1) + '×'; map.classList.toggle('is-zoomed', z > 1.01); map.classList.toggle('is-moved', z > 1.01 || Math.abs(v.x - V0.x) > 2 || Math.abs(v.y - V0.y) > 2); }
    // screen point → chart units
    function toChart(cx, cy){ var r = svg.getBoundingClientRect(); return { x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h, fx: (cx - r.left) / r.width, fy: (cy - r.top) / r.height }; }
    function zoomAt(f, cx, cy, animate){
      var p = cx == null ? { x: v.x + v.w / 2, y: v.y + v.h / 2, fx: .5, fy: .5 } : toChart(cx, cy);
      var nw = Math.max(V0.w / MAXZ, Math.min(V0.w, v.w / f)), nh = nw * V0.h / V0.w, to = { x: p.x - p.fx * nw, y: p.y - p.fy * nh, w: nw, h: nh };
      if (animate && hasGsap && !reduce){ gsap.to(v, { x: to.x, y: to.y, w: to.w, h: to.h, duration: .45, ease: 'power3.out', onUpdate: apply, overwrite: true }); }
      else { v.x = to.x; v.y = to.y; v.w = to.w; v.h = to.h; apply(); }
    }
    ui.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b) return; var z = b.getAttribute('data-z');
      if (z === 'reset'){ if (hasGsap && !reduce) gsap.to(v, { x: V0.x, y: V0.y, w: V0.w, h: V0.h, duration: .5, ease: 'power3.out', onUpdate: apply, overwrite: true }); else { v = { x: V0.x, y: V0.y, w: V0.w, h: V0.h }; apply(); } }
      else zoomAt(z === 'in' ? 1.6 : 1 / 1.6, null, null, true);
    });
    // Ctrl/⌘ + wheel and trackpad pinch (arrives as ctrl+wheel) zoom; plain wheel is left to the page
    map.addEventListener('wheel', function(e){ if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); e.stopPropagation(); zoomAt(Math.exp(-e.deltaY * .0025), e.clientX, e.clientY); }, { passive: false });
    map.setAttribute('data-lenis-prevent-wheel', '');
    map.addEventListener('dblclick', function(e){ e.preventDefault(); zoomAt(1.8, e.clientX, e.clientY, true); });
    // drag to pan (mouse, pen, one finger) + two-finger pinch; a drag never counts as a click on a star
    var pts = {}, start = null, moved = false, pinch = null;
    function count(){ return Object.keys(pts).length; }
    svg.addEventListener('pointerdown', function(e){
      if (e.button && e.button !== 0) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = false;
      if (count() === 1) start = { cx: e.clientX, cy: e.clientY, x: v.x, y: v.y };
      if (count() === 2){ var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]]; pinch = { d: Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)), w: v.w }; }
    });
    addEventListener('pointermove', function(e){
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (count() === 2 && pinch){
        var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]], d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        if (d > 0){ zoomAt(v.w / (pinch.w * pinch.d / d), (a.x + b.x) / 2, (a.y + b.y) / 2); moved = true; }
        return;
      }
      if (!start) return;
      var dx = e.clientX - start.cx, dy = e.clientY - start.cy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      if (!moved){ moved = true; map.classList.add('is-panning'); try { svg.setPointerCapture(e.pointerId); } catch (x) {} }
      var r = svg.getBoundingClientRect();
      v.x = start.x - dx / r.width * v.w; v.y = start.y - dy / r.height * v.h; apply();
    });
    function up(e){
      if (!pts[e.pointerId]) return; delete pts[e.pointerId];
      if (count() < 2) pinch = null;
      if (!count()){ start = null; map.classList.remove('is-panning'); }
    }
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
    // swallow the click that ends a drag, so panning over a star doesn't open it
    map.addEventListener('click', function(e){ if (moved){ e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    // keyboard: + / − / 0 while the chart has focus
    map.tabIndex = -1;

    /* ---------- legend chips: fly to a constellation (zoom in on it and read its best-linked star); again = reset ---------- */
    var chips = $$('.ab_ks-chart_f [data-cat]', mount);
    function flyTo(to){ if (hasGsap && !reduce) gsap.to(v, { x: to.x, y: to.y, w: to.w, h: to.h, duration: .8, ease: 'power3.inOut', onUpdate: apply, overwrite: true }); else { v.x = to.x; v.y = to.y; v.w = to.w; v.h = to.h; apply(); } }
    chips.forEach(function(b){
      b.addEventListener('click', function(){
        var key = b.getAttribute('data-cat'), on = b.getAttribute('aria-pressed') !== 'true';
        chips.forEach(function(x){ x.setAttribute('aria-pressed', x === b && on); });
        map.classList.toggle('is-focus', on); map.setAttribute('data-focus', on ? key : '');
        if (!on){ flyTo({ x: V0.x, y: V0.y, w: V0.w, h: V0.h }); return; }
        var c = CENTER[key], w = V0.w / 2.3, h = w * V0.h / V0.w;
        flyTo({ x: c[0] - w * .5 + 20, y: c[1] - h * .5 - 25, w: w, h: h });
        var best = links_.filter(function(a){ return a.getAttribute('data-cat') === key; }).sort(function(x, y){ return links(TOPIC[y.getAttribute('data-slug')]) - links(TOPIC[x.getAttribute('data-slug')]); })[0];
        if (best) show(best);
      });
    });
    // the reset button also clears the focused constellation
    ui.querySelector('[data-z="reset"]').addEventListener('click', function(){ chips.forEach(function(x){ x.setAttribute('aria-pressed', 'false'); }); map.classList.remove('is-focus'); map.setAttribute('data-focus', ''); });
    map.addEventListener('keydown', function(e){ if (e.key === '+' || e.key === '=') zoomAt(1.6, null, null, true); else if (e.key === '-') zoomAt(1 / 1.6, null, null, true); else if (e.key === '0') ui.querySelector('[data-z="reset"]').click(); });
  })();

  /* ===== knowledge/40-topic.js ===== */
  /* ---------- /topics/[slug]: the topic page ---------- */
  if (VIEW === 'topic') (function(){
    var T = TOPIC[CUR_SLUG]; if (!T) return;
    if (CUR.getAttribute('data-cat')) T.cat = catKey(CUR.getAttribute('data-cat'));
    var C = CAT[T.cat], tNotes = notesFor(T.slug), tMis = misFor(T.slug) /* Topic › Missions (nested list on this template's Topics source) */, tFaq = FAQ.filter(function(q){ return q.topics.indexOf(T.slug) > -1; });
    var sibs = TOPICS.filter(function(t){ return t.cat === T.cat; });

    var eb = $('[data-ks-eyebrow]'); if (eb) eb.textContent = C.code + ' · ' + C.name + ' · constellation ' + pad2(C.i + 1) + ' of 06';
    var h1 = $('[data-ks-title]');
    if (h1){ var w = h1.textContent.trim().split(' '); h1.innerHTML = w.length > 1 ? '<span class="ab_dbh_word">' + esc(w.slice(0, -1).join(' ')) + '</span> <span class="ab_dbh_word t-outline">' + esc(w[w.length - 1]) + '</span>' : '<span class="ab_dbh_word">' + esc(w[0]) + '</span>'; }

    // mini constellation: this category only, re-centered on its center
    var mini = $('[data-ks-mini]'), cx0 = CENTER[T.cat];
    if (mini && POS[T.slug]){
      mini.setAttribute('data-cat', T.cat);
      mini.innerHTML = '<svg viewBox="-250 -130 480 270" aria-hidden="true"><path class="cl" d="' + consPath(T.cat, cx0[0], cx0[1]) + '"/>' +
        sibs.map(function(t){ var p = POS[t.slug]; if (!p) return ''; var x = p[0] - cx0[0], y = p[1] - cx0[1], on = t === T, r = starR(t), R = SIDE[t.slug] === 'R';
          return '<g class="' + (on ? 'is-on' : '') + '">' + (on ? '<circle class="st-p" cx="' + x + '" cy="' + y + '" r="' + r + '"/><circle class="st-r" cx="' + x + '" cy="' + y + '" r="' + (r + 5) + '"/>' : '') +
            '<circle class="st" cx="' + x + '" cy="' + y + '" r="' + r + '"/><text class="tl" x="' + (R ? x + r + 7 : x - r - 7) + '" y="' + (y + 3) + '" text-anchor="' + (R ? 'start' : 'end') + '">' + esc(t.name) + '</text></g>'; }).join('') + '</svg>';
    }
    var stats = $('[data-ks-tstats]');
    if (stats) stats.innerHTML = [['Observations', tNotes.length, '#notes'], ['Missions', tMis.length, '#practice'], ['Services', SVC.length, '#services'], ['Questions', tFaq.length, '#questions']]
      .map(function(s){ return s[1] ? '<a class="ab_ks-tstat" href="' + s[2] + '"><span>' + s[0] + '</span><b>' + pad2(s[1]) + '</b></a>' : '<div class="ab_ks-tstat is-zero"><span>' + s[0] + '</span><b>00</b></div>'; }).join('');

    var el;
    if ((el = $('[data-ks-practice]')) && tMis.length){
      el.innerHTML = '<div class="ab_ks-mis">' + tMis.map(function(m){
        return '<a class="ab_ks-mcard" href="' + m.href + '">' + planet(m, PSEED++, 'is-mp') + '<div><span class="ab_ks-mcard_k">Mission ' + m.no + ' · ' + esc(m.client) + '</span><h3 class="ab_ks-mcard_h">' + esc(m.name) + '</h3><p class="ab_ks-mcard_p">' + esc(m.sum) + '</p><em class="ab_ks-mcard_go">Open the debrief →</em></div></a>';
      }).join('') + '</div>'; buildPlanets(el); reveal(el);
    } else hideSec('[data-ks-sec="practice"]');
    if ((el = $('[data-ks-services]')) && SVC.length){
      el.innerHTML = '<ul class="ab_ks-svc">' + SVC.map(function(s){
        return '<li class="ab_ks-svc_row"><a href="' + s.href + '">' + planet(s, PSEED++, 'is-lg') + '<div><h3 class="ab_ks-svc_h">' + esc(s.t1) + ' <span class="t-outline">' + esc(s.t2) + '</span></h3><p class="ab_ks-svc_p">' + esc(s.sum) + '</p></div><span class="ab_ks-go" aria-hidden="true">→</span></a></li>';
      }).join('') + '</ul>'; buildPlanets(el); reveal(el);
    } else hideSec('[data-ks-sec="services"]');
    if ((el = $('[data-ks-notes]')) && tNotes.length){ el.innerHTML = grid(tNotes); reveal(el); } else hideSec('[data-ks-sec="notes"]');
    if ((el = $('[data-ks-faq]')) && tFaq.length){
      el.innerHTML = '<div class="ab_ks-faq">' + tFaq.map(function(q){ return '<details class="ab_ks-faq_i"><summary><span>' + esc(q.q) + '</span><span class="ab_ks-faq_pm" aria-hidden="true">+</span></summary><p>' + esc(q.a) + '</p></details>'; }).join('') + '</div>';
      $$('details', el).forEach(function(d){ d.addEventListener('toggle', function(){ d.classList.toggle('is-open', d.open); if (AB.lenis && AB.lenis.resize) AB.lenis.resize(); }); });
    } else hideSec('[data-ks-sec="questions"]');
    if ((el = $('[data-ks-near]'))){
      el.innerHTML = '<div class="ab_ks-box_h is-near"><span>Nearby stars · ' + esc(C.name) + '</span><a href="/topics">Full star chart →</a></div><div class="ab_ks-chips">' +
        sibs.filter(function(t){ return t !== T; }).map(function(t){ return chip(t.slug); }).join('') + '</div>';
    }
    document.title = T.name + ' · Topics · Angelino Barajas';
  })();

  /* ===== knowledge/50-rows.js ===== */
  /* ---------- rows on existing templates: Mission (observations from this mission), Service (further reading) ---------- */
  if (ROW === 'mission' || ROW === 'service') (function(){
    var sec = $('[data-ks-row]'), filed = $('[data-ks-filed]'), mount = $('[data-ks-rownotes]');
    var topics = ROW === 'mission'
      ? $$('[data-ks-src="cur-topics"] [data-ks-t]').map(function(n){ return n.getAttribute('data-slug'); })
      : TOPICS.filter(function(t){ return t.services.indexOf(CUR_SLUG) > -1; }).map(function(t){ return t.slug; });
    var notes = OBS.filter(function(o){ return (ROW === 'mission' ? o.missions : o.services).indexOf(CUR_SLUG) > -1; });
    if (!notes.length && !topics.length){ sec.style.display = 'none'; return; }
    if (filed) filed.innerHTML = topics.length ? '<span class="ab_ks-filed_l">' + (ROW === 'mission' ? 'Filed under' : 'Topics') + '</span>' + topics.map(function(s){ return chip(s); }).join('') : '';
    if (mount){
      if (notes.length){ mount.innerHTML = grid(notes.slice(0, 3)) + (notes.length > 3 ? '<div class="ab_ks-cta">' + btn('/observatory', 'All ' + notes.length + ' observations') + '</div>' : ''); reveal(mount); }
      else { var h = $('.ab_sec-h', sec); if (h) h.style.display = 'none'; }
    }
  })();

  /* ===== knowledge/60-schema.js ===== */
  /* ---------- structured data from the same fields the page shows (BlogPosting, DefinedTerm + FAQPage, collections).
     Rendered JSON-LD is read by Google; the native template versions for the Designer are in seo/jsonld/. ---------- */
  (function(){
    if (!VIEW) return;
    var O = location.origin, PERSON = { '@id': O + '/#person' }, SET = O + '/topics#vocabulary', data = null;
    function term(slug){ var t = TOPIC[slug]; return t ? { '@type': 'DefinedTerm', '@id': O + URL_T + t.slug + '#term', name: t.name, url: O + URL_T + t.slug, inDefinedTermSet: SET } : null; }
    function crumbs(list){ return { '@type': 'BreadcrumbList', itemListElement: list.map(function(c, i){ return { '@type': 'ListItem', position: i + 1, name: c[0], item: O + c[1] }; }) }; }
    if (VIEW === 'article'){
      var X = OB[CUR_SLUG]; if (!X) return;
      var desc = $('meta[name="description"]');
      data = [{ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': O + X.href + '#article', url: O + X.href, headline: X.name,
        description: X.answer.replace(/`/g, ''), abstract: X.answer.replace(/`/g, ''), author: PERSON, publisher: PERSON, inLanguage: 'en-US',
        isPartOf: { '@type': 'Blog', '@id': O + '/observatory#blog', name: 'The Observatory' },
        about: X.topics.map(term).filter(Boolean), timeRequired: X.mins ? 'PT' + X.mins + 'M' : undefined,
        mentions: SVC.map(function(s){ return { '@type': 'Service', '@id': O + s.href + '#service', name: s.name }; }) },
        crumbs([['Home', '/'], ['Observatory', '/observatory'], [X.name, X.href]])];
      if (!desc) data[0].description = X.answer;
    }
    if (VIEW === 'topic'){
      var T = TOPIC[CUR_SLUG]; if (!T) return;
      var t = term(T.slug); t['@context'] = 'https://schema.org'; t.description = T.def;
      data = [t, crumbs([['Home', '/'], ['Topics', '/topics'], [T.name, URL_T + T.slug]])];
      var qs = FAQ.filter(function(q){ return q.topics.indexOf(T.slug) > -1; });
      if (qs.length) data.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs.map(function(q){ return { '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }; }) });
    }
    if (VIEW === 'chart') data = { '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': SET, name: 'Site vocabulary', url: O + '/topics',
      hasDefinedTerm: TOPICS.map(function(t){ var d = term(t.slug); d.description = t.def; delete d.inDefinedTermSet; return d; }) };
    if (VIEW === 'library') data = { '@context': 'https://schema.org', '@type': 'Blog', '@id': O + '/observatory#blog', name: 'The Observatory', url: O + '/observatory', author: PERSON,
      blogPost: OBS.map(function(o){ return { '@type': 'BlogPosting', '@id': O + o.href + '#article', headline: o.name, url: O + o.href }; }) };
    if (!data) return;
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-ks-jsonld', '');
    s.text = JSON.stringify(data); document.head.appendChild(s);
  })();

});
