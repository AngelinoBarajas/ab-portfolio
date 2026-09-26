/*! AB Portfolio · ab-hub v0.21.3 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abHubInit) return;
  window.__abHubInit = true;
  /* ===== hub/00-data.js ===== */
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

  /* ===== hub/10-board.js ===== */
  /* =========================================================
     LAUNCH CONTROL · the manifest monitor, launch keys, telemetry, diagnostics chips and the launch pass
     ========================================================= */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
  var cur = -1, now = -1;
  var screen = $('[data-hub-screen]'), mon = $('[data-hub-mon]'), board = $('[data-hub-board]');
  function rnd(seed){ var s = seed; return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function hash(t){ var h = 7; for (var k = 0; k < t.length; k++) h = (h * 31 + t.charCodeAt(k)) % 100003; return h; }
  // manifest readout per column (phosphor characters): mission · destination · transfer · orbit · status
  var COLS = [{ k: 'flight', n: 5, h: 'Mission' }, { k: 'dest', n: 14, h: 'Destination' }, { k: 'via', n: 7, h: 'Transfer' }, { k: 'gate', n: 5, h: 'Orbit' }, { k: 'status', n: 13, h: 'Status' }];
  function baseStatusText(s){ return s.slug === 'custom-deploys' ? 'ON REQUEST' : 'STANDBY'; }
  function boardText(s){ return { flight: 'AB-' + s.no, dest: s.short.toUpperCase(), via: s.via.map(function(v){ return BY[v].code; }).join(' '), gate: s.p[0].toUpperCase(), status: baseStatusText(s) }; }
  function cells(t, n){ var o = ''; for (var k = 0; k < n; k++) o += '<span class="hb-fl" aria-hidden="true">' + esc((t.charAt(k) || ' ').replace(' ', ' ')) + '</span>'; return o; }
  function cellRow(t){ return COLS.map(function(c){ return '<span class="hb-cell hb-c-' + c.k + '" data-col="' + c.k + '" style="--n:' + c.n + '">' + cells(t[c.k], c.n) + '</span>'; }).join(''); }

  /* ---------- the manifest rows (Designer Collection List items) get their cells, row button and Explore link ---------- */
  var rows = [];
  $$('[data-hub-row]').forEach(function(r){
    var s = BY[r.getAttribute('data-slug')];
    if (!s){ r.style.display = 'none'; return; }
    r.style.setProperty('--c', s.c);
    var go = $('[data-hub-go]', r);
    if (go){ go.href = SVC + s.slug; go.removeAttribute('aria-current'); go.classList.remove('w--current'); go.setAttribute('aria-label', 'Explore the ' + s.t1 + ' ' + s.t2 + ' service'); }
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hb-row-b'; b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', 'Mission AB-' + s.no + ', ' + s.t1 + ' ' + s.t2 + '. Arm it and print the launch pass.');
    var wrap = document.createElement('span'); wrap.style.display = 'contents';
    wrap.innerHTML = '<span class="hb-cur" aria-hidden="true">&gt;</span>' + cellRow(boardText(s));
    r.insertBefore(b, r.firstChild); r.insertBefore(wrap, go || null);
    r.__i = s.i; rows[s.i] = r;
  });
  rows = rows.filter(Boolean);
  if (screen){
    var scr = $('[data-hub-rows]', screen);
    var head = document.createElement('div'); head.className = 'hb-cols'; head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<span class="hb-c-cur"></span>' + COLS.map(function(c){ return '<span class="hb-c-' + c.k + '" style="--n:' + c.n + '">' + c.h + '</span>'; }).join('') + '<span class="hb-c-go">Service</span>';
    if (scr) scr.insertBefore(head, scr.firstChild);
    screen.insertAdjacentHTML('beforeend', '<div class="scan" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="roll" aria-hidden="true"></div>' +
      '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<div class="osd" aria-hidden="true">CH 01 · Manifest</div>');
    screen.classList.add('is-built');
  }
  // launch keys 01-0N (console)
  var keysBox = $('[data-hub-keys]');
  if (keysBox) keysBox.innerHTML = HUB.map(function(s){
    return '<button type="button" class="hb-key" data-i="' + s.i + '" style="--c:' + s.c + '" aria-pressed="false" aria-label="Arm AB-' + s.no + ', ' + esc(s.short) + '"><span class="k">' + s.no + '</span><span>' + esc(s.code) + '</span><i aria-hidden="true"></i></button>';
  }).join('');
  var sws = $$('.hb-key');
  // the planets that peek out from behind the monitor
  if (board){
    var peeks = document.createElement('div'); peeks.className = 'hb-peeks'; peeks.setAttribute('aria-hidden', 'true');
    HUB.forEach(function(s){ var p = planetEl(s, 60 + s.i, 'hb-peek'); p.setAttribute('data-i', s.i); peeks.appendChild(p); });
    board.insertBefore(peeks, board.firstChild);
  }
  var peekEls = $$('.hb-peek');

  /* ---------- phosphor readout: size the characters to the screen ---------- */
  function units(row, skipStatus){
    var n = 0, cols = 0;
    $$('.hb-cell', row).forEach(function(c){ if (c.offsetParent !== null && !(skipStatus && c.getAttribute('data-col') === 'status')){ n += +c.style.getPropertyValue('--n'); cols++; } });
    return { n: n, cols: cols };
  }
  var callRow = $('[data-hub-call]');
  if (callRow && callRow.hasAttribute('aria-label')) callRow.setAttribute('role', 'img');
  function tileSize(){
    if (screen && rows[0]){
      var u = units(rows[0]), go = $('.ab_hub-go', rows[0]), goW = go ? go.offsetWidth : 0, list = $('[data-hub-rows]', screen), w = (list ? list.clientWidth : screen.clientWidth) - 36 - goW;
      // cells + cursor + the gaps between them; the labeled Explore button keeps its own width
      var cw = w / (u.n + 1 + (u.cols + 1.6) * .9);
      screen.style.setProperty('--cw', Math.max(8, Math.min(22, Math.floor(cw * 10) / 10)) + 'px');
    }
    if (callRow && callRow.firstChild){
      var phone = innerWidth <= 700, cu = units(callRow, phone), cwid = Math.min(callRow.parentNode.parentNode.clientWidth, 900) - 52;
      var cc = cwid / (cu.n + 1.6 + (cu.cols + 1) * .9);
      callRow.style.setProperty('--cw', Math.max(8, Math.min(16, Math.floor(cc * 10) / 10)) + 'px');
    }
    // after a print the pass keeps GSAP's transform (same tilt); drop it on resize so each breakpoint's tilt applies
    var ps = $('[data-hub-pass]'); if (ps && hasGsap && !gsap.isTweening(ps)) gsap.set(ps, { clearProps: 'transform' });
    hang();
  }
  // the pass hangs into the trajectory section: that section's top padding follows the pass's real height
  function hang(){
    var print = $('[data-hub-print]'), sec = $('.section_hub-map'); if (!print || !sec) return;
    // the wrapper's layout box (the pass's own rect includes its print transform)
    var over = print.getBoundingClientRect().bottom + 6 - sec.getBoundingClientRect().top;
    sec.style.paddingTop = Math.round(Math.max(0, over) + Math.max(64, Math.min(130, innerWidth * .09))) + 'px';
  }
  // digital scramble: each character cycles through glyphs, then lands
  function glitchTo(el, ch, steps, delay){
    ch = ch === ' ' ? ' ' : ch;
    if (el.textContent === ch && !steps) return;
    if (reduce){ el.textContent = ch; return; }
    var k = 0;
    setTimeout(function step(){
      if (k < steps){ el.textContent = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); el.classList.add('is-glitch'); k++; setTimeout(step, 38); }
      else { el.textContent = ch; el.classList.remove('is-glitch'); }
    }, delay || 0);
  }
  function setCell(cell, t, delay){
    if (!cell) return;
    $$('.hb-fl', cell).forEach(function(f, k){ var ch = (t.charAt(k) || ' ').toUpperCase(); if (f.textContent === ch || (ch === ' ' && f.textContent === ' ')) return; glitchTo(f, ch, 2 + Math.floor(Math.random() * 4), (delay || 0) + k * 16); });
  }
  function rowOf(i){ return rows.filter(function(r){ return r.__i === i; })[0]; }
  function status(i, t, delay){ var r = rowOf(i); if (r) setCell($('.hb-c-status', r), t, delay); }
  function baseStatus(i){ return baseStatusText(HUB[i]); }
  function syncStates(){
    rows.forEach(function(r){ var j = r.__i; r.classList.toggle('is-on', j === cur); r.classList.toggle('is-now', j === now); $('.hb-row-b', r).setAttribute('aria-pressed', j === cur); });
    sws.forEach(function(s, j){ s.setAttribute('aria-pressed', j === cur); s.classList.toggle('is-now', j === now); });
    tele();
  }
  // side console telemetry follows the armed launch
  function tset(k, v, cls){ var n = $('[data-tele="' + k + '"]'); if (!n) return; n.textContent = v; if (cls != null) n.className = 'ab_tele_v ' + cls; }
  function tele(){
    var s = HUB[cur]; if (!s) return;
    tset('n', 'AB-' + s.no); tset('d', s.code); tset('o', s.p[0].toUpperCase()); tset('t', s.via.length);
    var pri = cur === now; tset('s', pri ? 'PRIORITY' : s.slug === 'custom-deploys' ? 'ON REQUEST' : 'GO', pri ? 'is-pri' : 'is-ok');
  }
  // the prompt line types itself out
  var promptEl = $('[data-hub-prompt]'), promptT;
  function prompt(t){
    if (!promptEl) return;
    clearTimeout(promptT);
    if (reduce){ promptEl.textContent = '> ' + t; return; }
    var full = '> ' + t, k = 0;
    (function type(){ promptEl.textContent = full.slice(0, k); if (k++ < full.length) promptT = setTimeout(type, 18); })();
  }

  /* ---------- launch pass ---------- */
  var pass = $('[data-hub-pass]');
  if (pass){
    pass.insertAdjacentHTML('afterbegin', '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span><span class="hb-glare" aria-hidden="true"></span>');
  }
  // a pixel "scan to board" code, seeded by the slug (decorative)
  function qr(slug){
    var r = rnd(hash(slug)), N = 21, o = '';
    function finder(x0, y0){ return '<path d="M' + x0 + ' ' + y0 + 'h7v7h-7z M' + (x0 + 1) + ' ' + (y0 + 1) + 'v5h5v-5z M' + (x0 + 2) + ' ' + (y0 + 2) + 'h3v3h-3z" fill-rule="evenodd"/>'; }
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++){
      var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inF && r() > .52) o += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg viewBox="0 0 21 21" shape-rendering="crispEdges">' + finder(0, 0) + finder(14, 0) + finder(0, 14) + o + '</svg>';
  }
  var ORBIT = { gas: 'Gas giant', ice: 'Ice giant', rocky: 'Rocky world', terra: 'Terra world', lava: 'Lava world' };
  function pset(k, v, html){ var n = $('[data-pass="' + k + '"]', pass); if (!n) return n; if (html) n.innerHTML = v; else n.textContent = v; return n; }
  function fillPass(s, skipHero){
    if (!pass) return;
    pass.style.setProperty('--c', s.c);
    pset('flight', 'AB-' + s.no); pset('code', s.code); pset('code2', s.code); pset('flight2', 'AB-' + s.no);
    pset('title', '<span class="ab_hub-pass_t1">' + esc(s.t1) + '</span> <span class="ab_hub-pass_t2 t-outline">' + esc(s.t2) + '</span>', true);
    pset('sum', s.sum); pset('best', s.best); pset('orbit', ORBIT[s.p[0]] || s.p[0]);
    pset('via', s.via.map(function(v){ return BY[v].short; }).join(' · ') || 'Direct');
    pset('tools', s.tools.map(function(t){ return '<span class="ab_chip is-tool">' + esc(t) + '</span>'; }).join(''), true);
    var link = $('[data-pass="link"]', pass); if (link) link.href = SVC + s.slug;
    var stub = $('[data-pass="stub"]', pass); if (stub){ stub.href = SVC + s.slug; stub.setAttribute('aria-label', 'Explore the ' + s.t1 + ' ' + s.t2 + ' service'); }
    pset('qr', qr(s.slug), true);
    repaint($('[data-pass="planet"]', pass), s, 80 + s.i);
    if (!skipHero) heroPlanet(s);
  }
  function heroPlanet(s){
    var hp = $('[data-hub-planet]'); if (!hp) return;
    hp.setAttribute('data-label', 'Go for launch · ' + s.short);
    if (hp.getAttribute('aria-label')) hp.setAttribute('aria-label', 'Draggable planet: Go for launch · ' + s.short);
    repaint(hp, s, 11 + s.i);
  }
  // heavy work (planet textures) waits until the pass has settled, so the landing frame stays smooth
  function later(fn){ setTimeout(function(){ if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 600 }); else fn(); }, 250); }
  function print(i, quiet){
    if (i === cur) return;
    var prev = cur; cur = i; var s = HUB[i];
    syncStates();
    if (prev > -1 && prev !== now) status(prev, baseStatus(prev));
    if (i !== now) status(i, 'GO FOR LAUNCH', 60);
    if (!quiet) prompt('AB-' + s.no + ' ' + s.short.toUpperCase() + ' ARMED · PRINTING LAUNCH PASS');
    if (!pass) return;
    if (quiet || reduce || !hasGsap){ fillPass(s); hang(); return; }
    mon.classList.add('is-printing');
    gsap.killTweensOf(pass);
    // transform only: the pass slides back up into the slot, is refilled while hidden, then feeds out smoothly.
    // .ab_hub-print clips everything above the slot, so no clip-path is animated (it repaints the drop shadow every frame)
    gsap.timeline({ onComplete: function(){ mon.classList.remove('is-printing'); later(function(){ if (cur === i) heroPlanet(s); }); prompt('AB-' + s.no + ' PASS PRINTED · EXPLORE THE SERVICE FROM THE PASS'); } })
      .to(pass, { yPercent: -100, y: -30, rotationX: 12, rotationY: 0, duration: prev > -1 ? .32 : 0, ease: 'power2.in' })
      .add(function(){ fillPass(s, true); hang(); })
      .to(pass, { yPercent: 0, y: 0, rotationX: 0, duration: 1, ease: 'power3.out', delay: .06 });
  }

  // glass pieces (launch slate, crew logbook) tilt toward the pointer like the site's cards (AB.cardFx),
  // with a glare that follows it; --tx/--ty let children (badges) drift against the tilt. skip() pauses the tilt (printing, page turns)
  function glass(el, skip){
    if (!el) return;
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect(), gx = (e.clientX - r.left) / r.width, gy = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (gx * 100) + '%'); el.style.setProperty('--my', (gy * 100) + '%'); el.style.setProperty('--gx', (gx - .5).toFixed(3));
      if (reduce || !hasGsap || coarse || e.buttons || skip()) return;
      el.style.setProperty('--tx', ((.5 - gx) * 8).toFixed(1) + 'px'); el.style.setProperty('--ty', ((.5 - gy) * 6).toFixed(1) + 'px');
      gsap.to(el, { rotationY: (gx - .5) * 6, rotationX: (.5 - gy) * 6, transformPerspective: 1000, duration: .5, ease: 'power2.out', overwrite: 'auto' });
    });
    el.addEventListener('pointerleave', function(){ el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); if (hasGsap && !skip()) gsap.to(el, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)', overwrite: 'auto' }); });
    el.addEventListener('pointerdown', function(){ if (hasGsap && !skip()) gsap.to(el, { rotationY: 0, rotationX: 0, duration: .3, overwrite: 'auto' }); });
  }

  /* ---------- screen rows + launch keys ---------- */
  rows.forEach(function(r, n){
    var i = r.__i, b = $('.hb-row-b', r);
    b.addEventListener('click', function(){ print(i); });
    b.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
      e.preventDefault(); $('.hb-row-b', rows[(n + d + rows.length) % rows.length]).focus();
    });
    if (!coarse){
      r.addEventListener('mouseenter', function(){ peek(i); });
      r.addEventListener('mouseleave', function(){ peek(-1); });
    }
  });
  sws.forEach(function(s, i){ s.addEventListener('click', function(){ print(i); }); });
  glass(pass, function(){ return mon && mon.classList.contains('is-printing'); });
  function peek(i){
    if (!board) return;
    peekEls.forEach(function(p, j){
      if (j === i){ var rr = rowOf(i).getBoundingClientRect(), wr = board.getBoundingClientRect(); p.style.setProperty('--y', (rr.top - wr.top + rr.height / 2) + 'px'); if (!p.__built) build(p); }
      p.classList.toggle('is-on', j === i);
    });
  }

  /* ---------- diagnostics: the matching launch goes PRIORITY GO ---------- */
  var chips = $$('.ab_chip.is-diag');
  chips.forEach(function(c){
    var s = BY[c.getAttribute('data-slug')], reset = c.classList.contains('is-reset');
    if (!s && !reset){ c.style.display = 'none'; return; }
    c.setAttribute('role', 'button'); c.tabIndex = 0; if (!reset) c.setAttribute('aria-pressed', 'false');
    function pick(){
      var i = reset ? -1 : s.i, was = now, old = cur;
      chips.forEach(function(x){ if (!x.classList.contains('is-reset') && x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', x === c); });
      now = i;
      if (i > -1){
        if (old > -1 && old !== i) status(old, baseStatus(old));
        if (was > -1 && was !== i && was !== old) status(was, baseStatus(was));
        status(i, 'PRIORITY GO', 60);
        cur = -1; print(i, false);
        prompt('DIAGNOSTIC MATCH · AB-' + HUB[i].no + ' ' + HUB[i].short.toUpperCase() + ' · PRIORITY GO');
        toast('Priority go · ' + HUB[i].t1 + ' ' + HUB[i].t2);
      } else {
        if (was > -1) status(was, was === cur ? 'GO FOR LAUNCH' : baseStatus(was));
        prompt('ALL CLEAR · SELECT A LAUNCH TO ARM');
      }
      syncStates();
    }
    c.addEventListener('click', pick);
    c.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
  });

  /* ---------- clock ---------- */
  var clockEl = $('[data-hub-clock]');
  function tick(){ if (!clockEl) return; try { clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: AB.settings.timezone || undefined }); } catch (e){ clockEl.textContent = new Date().toTimeString().slice(0, 5); } }
  tick(); setInterval(tick, 15000);

  /* ---------- first paint: the manifest types in ---------- */
  tileSize(); addEventListener('resize', tileSize); addEventListener('load', hang);
  if (window.ResizeObserver && pass){ new ResizeObserver(function(){ hang(); }).observe(pass); }
  if (!reduce){
    rows.forEach(function(r, n){
      var t = boardText(HUB[r.__i]);
      COLS.forEach(function(c){ var cell = $('.hb-c-' + c.k, r); $$('.hb-fl', cell).forEach(function(f){ f.textContent = ' '; }); setCell(cell, c.k === 'status' && r.__i === 0 ? 'GO FOR LAUNCH' : t[c.k], 500 + n * 90); });
    });
  }
  print(0, true);
  if (reduce) status(0, 'GO FOR LAUNCH');
  prompt('AB-01 ARMED · CLICK A LAUNCH FOR ITS PASS · EXPLORE OPENS THE SERVICE');

  /* ===== hub/20-planner.js ===== */
  /* =========================================================
     PLOT A TRAJECTORY · main destination → up to 2 stops → launch (map + one planner panel that walks the steps)
     ========================================================= */
  var map = $('[data-hub-map]'), panel = $('[data-hub-planner]'), main = -1, stops = [];
  var EARTH = [5, 48], NS = 'http://www.w3.org/2000/svg';
  function pt(xy){ return [xy[0] * 10, xy[1] * 5.2]; }
  function arcD(a, b, bend){
    var A = pt(a), B = pt(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1];
    return 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + ' Q' + (mx - dy * bend).toFixed(1) + ' ' + (my + dx * bend).toFixed(1) + ' ' + B[0].toFixed(1) + ' ' + B[1].toFixed(1);
  }
  var itin = null, hint = null, ports = [];
  if (map){
    map.insertAdjacentHTML('beforeend', '<svg class="hb-map-svg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><g class="hb-arcs">' +
      ROUTES.map(function(r, k){ return '<path class="hb-arc" data-k="' + r.k + '" d="' + arcD(PORT[r.a], PORT[r.b], k % 2 ? .22 : -.22) + '"/>'; }).join('') +
      '</g><path class="hb-itin-path"/></svg>' +
      '<div class="hb-earth" style="left:' + EARTH[0] + '%;top:' + EARTH[1] + '%" aria-hidden="true"><i></i><span>Launch site · you</span></div>' +
      '<div class="hb-map-hint" aria-hidden="true"></div>');
    itin = $('.hb-itin-path', map); hint = $('.hb-map-hint', map);
    HUB.forEach(function(s){
      var xy = PORT[s.slug], b = document.createElement('button');
      b.type = 'button'; b.className = 'hb-port'; b.setAttribute('data-i', s.i); b.style.left = xy[0] + '%'; b.style.top = xy[1] + '%'; b.style.setProperty('--c', s.c);
      b.setAttribute('aria-label', s.code + ', ' + s.t1 + ' ' + s.t2); b.setAttribute('aria-pressed', 'false');
      b.appendChild(planetEl(s, 40 + s.i, 'hb-port-pl'));
      b.insertAdjacentHTML('beforeend', '<span class="hb-port-code">' + esc(s.code) + '</span><span class="hb-port-n">' + esc(s.short) + '</span><span class="hb-port-tag" aria-hidden="true"></span>');
      b.addEventListener('click', function(){ clickPort(s.i); });
      map.appendChild(b); ports.push(b);
    });
    onView(map, function(v){ if (v) $$('.hb-port-pl', map).forEach(build); }, { rootMargin: '600px' });
  }
  function sel(){ return main > -1 ? [main].concat(stops) : []; }
  function flownAll(list){ return FLIGHTS.filter(function(f){ return list.every(function(j){ return HUB[j].flown.indexOf(f.slug) > -1; }); }); }
  function why(a, b){ return WHY[pairKey(HUB[a].slug, HUB[b].slug)]; }
  function flownLinks(list){ return list.map(function(f){ return '<a href="' + misHref(f.slug) + '">' + esc(f.name) + '</a>'; }).join(' '); }
  function pickBtn(j){ var s = HUB[j]; return '<button type="button" data-pick="' + j + '" style="--c:' + s.c + '"' + (stops.length >= 2 && main > -1 ? ' disabled' : '') + '><i></i>' + esc(s.short) + ' <b>' + esc(s.code) + '</b></button>'; }

  function clickPort(i){
    if (main < 0){ main = i; }
    else if (i === main){ main = stops.length ? stops.shift() : -1; }
    else if (stops.indexOf(i) > -1){ stops.splice(stops.indexOf(i), 1); }
    else if (stops.length < 2){ stops.push(i); }
    else { toast('Two stops max · remove one first'); return; }
    drawPlan(true);
  }
  function drawPlan(animate){
    if (!map || !panel) return;
    var s = main > -1 ? HUB[main] : null, rec = s ? s.via.map(function(v){ return BY[v].i; }) : [];
    var step = main < 0 ? 1 : stops.length ? 3 : 2;
    $$('.ab_hub-step').forEach(function(li){ var n = +li.getAttribute('data-step'); li.classList.toggle('is-on', n === step); li.classList.toggle('is-done', n < step); });
    map.classList.toggle('has-main', main > -1);
    var side = innerWidth > 991, arr = side ? ' →' : ' ↓';
    // phones keep the reader on the map (no scroll to the panel), so the hint says stops can be tapped right here too
    hint.textContent = step === 1 ? 'Tap a planet, or pick in the panel' + arr : stops.length < 2 ? (side ? 'Next: add stops in the panel' + arr : 'Next: tap a planet to add a stop') : 'Ready: launch from the panel' + arr;
    ports.forEach(function(p, j){
      var k = stops.indexOf(j), isRec = s && j !== main && k < 0 && rec.indexOf(j) > -1;
      p.classList.toggle('is-main', j === main); p.classList.toggle('is-stop', k > -1); p.classList.toggle('is-rec', !!isRec);
      p.classList.toggle('is-dim', !!s && j !== main && k < 0 && !isRec);
      $('.hb-port-tag', p).textContent = j === main ? 'Main' : k > -1 ? 'Stop ' + (k + 1) : isRec ? '+ Pairs well' : '';
      p.setAttribute('aria-pressed', j === main || k > -1);
    });
    var chosen = sel();
    $$('.hb-arc', map).forEach(function(a){
      var ks = a.getAttribute('data-k').split('|'), ai = BY[ks[0]].i, bi = BY[ks[1]].i;
      a.classList.toggle('is-lit', !!s && ((ai === main || bi === main) || (chosen.indexOf(ai) > -1 && chosen.indexOf(bi) > -1)));
    });
    // Earth → main → stops
    var d = '', from = EARTH;
    chosen.forEach(function(j, k){ var to = PORT[HUB[j].slug]; d += (k ? ' ' : '') + arcD(from, to, -.16); from = to; });
    if (d) itin.setAttribute('d', d); else itin.removeAttribute('d');
    itin.style.strokeDasharray = 'none';
    if (animate && d && !reduce && hasGsap){ var len = 0; try { len = itin.getTotalLength(); } catch (e){} if (len) gsap.fromTo(itin, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .9, ease: 'power2.out', onComplete: function(){ itin.style.strokeDasharray = 'none'; } }); }

    // the planner panel: one card that walks the steps
    var h = '<div class="hb-pl-h"><span>Trajectory · step ' + step + ' of 3</span>' + (s ? '<button type="button" data-reset>Start over</button>' : '') + '</div>';
    if (!s){
      h += '<div class="hb-pl-b is-next"><span class="hb-pl-tag">Next</span><p class="hb-pl-intro"><b>Where is the mission headed?</b> Pick the main destination: the one thing this project can\'t launch without. Tap a planet on the map, or pick here.</p>' +
        '<div class="hb-pl-pick">' + HUB.map(function(x){ return pickBtn(x.i); }).join('') + '</div></div>';
    } else {
      h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Main destination</span><span>AB-' + s.no + '</span></div><div class="hb-pl-main"><b>' + esc(s.code) + '</b><span>' + esc(s.t1 + ' ' + s.t2) + '<small>' + esc(s.best) + '</small></span></div></div>';
      h += '<div class="hb-pl-b' + (step === 2 ? ' is-next' : '') + '">' + (step === 2 ? '<span class="hb-pl-tag">Next</span>' : '') + '<div class="hb-pl-k"><span>Recommended stops · pair well with ' + esc(s.code) + '</span><span>' + stops.length + ' / 2</span></div><ul class="hb-pl-rec">' + rec.map(function(j){
          var o = HUB[j], inn = stops.indexOf(j) > -1, t = flownAll([main, j]);
          return '<li class="' + (inn ? 'is-in' : '') + '"><p><b>' + esc(o.short) + '.</b> ' + esc(why(main, j) || '') + '</p>' +
            '<button type="button" data-stop="' + j + '"' + (!inn && stops.length >= 2 ? ' disabled' : '') + '>' + (inn ? 'Remove' : '+ Add stop') + '</button>' +
            '<div class="hb-flown">' + (t.length ? 'Flown together · ' + flownLinks(t) : 'Not flown together yet') + '</div></li>';
        }).join('') + '</ul>';
      var others = HUB.filter(function(x){ return x.i !== main && rec.indexOf(x.i) < 0 && stops.indexOf(x.i) < 0; });
      if (others.length) h += '<div class="hb-pl-k" style="margin-top:16px"><span>Or any other stop</span></div><div class="hb-pl-pick">' + others.map(function(x){ return pickBtn(x.i); }).join('') + '</div>';
      h += '</div>';
      // the trajectory readout
      var legs = '<li style="--c:#1f6fb2"><b>Launch site · Earth</b><small>Your brief</small></li>' +
        '<li style="--c:' + s.c + '"><b>' + esc(s.short) + ' · ' + esc(s.code) + '</b><small>Main destination</small></li>';
      stops.forEach(function(j, k){
        var prev = k ? stops[k - 1] : main, w = why(prev, j) || why(main, j), o = HUB[j];
        legs += '<li style="--c:' + o.c + '" class="' + (w ? '' : 'is-custom') + '"><b>' + esc(o.short) + ' · ' + esc(o.code) + '</b><small>' + (w ? 'Stop ' + (k + 1) + ' · transfer orbit' : 'Stop ' + (k + 1) + ' · custom transfer, planned on the discovery call') + '</small>' + (w ? '<br>' + esc(w) : '') + '</li>';
      });
      var all = flownAll(chosen);
      h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Your trajectory</span><span>' + chosen.length + ' destination' + (chosen.length > 1 ? 's' : '') + '</span></div><ol class="hb-legs">' + legs + '</ol>' +
        '<div class="hb-flown" style="margin-top:14px">' + (all.length ? 'Flown before · ' + flownLinks(all) : 'No mission has flown this exact trajectory yet · yours could be first') + '</div></div>';
      h += '<div class="hb-pl-b' + (step === 3 ? ' is-next' : '') + '">' + (step === 3 ? '<span class="hb-pl-tag">Next</span>' : '') + '<div class="hb-pl-go">' +
        btnHTML('is-primary', '#flight', flightOpen() && fsel.join() === chosen.join() ? 'Fly it again' : 'Launch the flight plan', '→', ' data-launch') + '</div>' +
        '<p class="hb-pl-note">Your flight plan warps in below: six stages, re-plotted for this trajectory.</p></div>';
    }
    panel.innerHTML = h;
    if (animate && !reduce){ panel.classList.remove('is-ping'); void panel.offsetWidth; panel.classList.add('is-ping'); }
    $$('[data-pick]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.getAttribute('data-pick')); }); });
    $$('[data-stop]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.getAttribute('data-stop')); }); });
    var rs = $('[data-reset]', panel); if (rs) rs.addEventListener('click', function(){ main = -1; stops = []; drawPlan(false); });
    var go = $('[data-launch]', panel);
    if (go) go.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); launchFlight(); });
  }

  /* ===== hub/30-flight.js ===== */
  /* =========================================================
     YOUR FLIGHT PLAN · the trajectory warps into the Process route, right here on the page.
     The six stage cards are Designer elements; legs, path, launch pad, ship and touchdown planet are script-built.
     ========================================================= */
  var fsec = $('[data-hub-flight]'), track = fsec ? $('[data-fl-track]', fsec) : null, fst = null, fsel = [], fpts = [], flen = 0, fwide = false, fk = -2, landed = false;
  var wps = track ? $$('.ab_hub-wp', track) : [];
  var SHIP = '<svg viewBox="0 0 44 44"><path class="hbf-flame" d="M6 22 L-8 17 L-4 22 L-8 27 Z" fill="#FF6A3D"/><path d="M6 14 H26 L40 22 L26 30 H6 Z" fill="#F2F0EA"/><path d="M14 14 L10 6 H18 L22 14 Z M14 30 L10 38 H18 L22 30 Z" fill="#8A8FA3"/><circle cx="28" cy="22" r="3.5" fill="#4C8DFF"/></svg>';
  function flightOpen(){ return !!fsec && fsec.classList.contains('is-open'); }
  function fset(k, v){ var n = fsec && $('[data-fl="' + k + '"]', fsec); if (n) n.textContent = v; }
  // header links: clone them so core's same-page anchor warp doesn't also fire
  function own$(sel, fn){ var a = fsec && $(sel, fsec); if (!a) return; var b = a.cloneNode(true); a.parentNode.replaceChild(b, a); b.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(); }); }
  own$('[data-fl-edit]', function(){ goTo($('#trajectory'), false, 20); });
  own$('[data-fl-abort]', abortFlight);

  function fill(sel){
    var m = HUB[sel[0]], st = sel.slice(1).map(function(j){ return HUB[j]; });
    var fm = flownAll(sel)[0] || (m.flown.length ? FBY[m.flown[0]] : null);
    var names = st.length ? ', with ' + (st.length > 1 ? 'stops at ' : 'a stop at ') + st.map(function(o){ return o.short; }).join(' and ') : '';
    fsec.style.setProperty('--c', m.c);
    fset('codes', sel.map(function(j){ return HUB[j].code; }).join(' + '));
    fset('lede', 'Six stages, re-plotted for ' + m.short + names + '. Scroll to fly it.');
    fset('n', 'T−6'); fset('l', 'On the pad');
    $$('.hbf-path, .hbf-pad, .hbf-ship, .hbf-dock', track).forEach(function(n){ n.parentNode.removeChild(n); });
    track.classList.toggle('has-2', st.length > 1);
    wps.forEach(function(w, i){
      w.classList.remove('is-on');
      $('[data-fl-legs]', w).innerHTML = '<div class="hbf-leg" style="--lc:' + m.c + '"><small>For ' + esc(m.short) + '</small>' + esc(m.legs[i] || '') + '</div>' +
        st.map(function(o){ return '<div class="hbf-leg is-stop" style="--lc:' + o.c + '"><small>+ Stop · ' + esc(o.short) + '</small>' + esc(o.legs[i] || '') + '</div>'; }).join('');
      var a = $('[data-fl-flown]', w), what = a ? a.getAttribute('data-flown-what') : '';
      if (a){
        a.classList.toggle('is-none', !fm);
        if (fm){ a.href = misHref(fm.slug); a.innerHTML = 'See ' + esc(what) + ' · ' + esc(fm.name) + ' <span aria-hidden="true">→</span>'; a.removeAttribute('aria-disabled'); }
        else { a.removeAttribute('href'); a.textContent = 'No mission flown here yet · yours could be first'; a.setAttribute('aria-disabled', 'true'); }
      }
    });
    track.insertAdjacentHTML('afterbegin', '<svg class="hbf-path" aria-hidden="true"><path class="hbf-line"/><path class="hbf-lit"/></svg>' +
      '<div class="hbf-pad" aria-hidden="true"><span class="ab_planet" data-planet="terra" data-seed="7" data-colors="#0b2a4a,#1f6fb2,#3fa66b,#a88b5c,#f2f0ea" data-spin="80" data-glow="rgba(76,141,255,.35)"></span><span>Earth · your brief</span></div>' +
      '<div class="hbf-ship" aria-hidden="true">' + SHIP + '</div>');
    var dock = document.createElement('div'); dock.className = 'hbf-dock';
    dock.innerHTML = '<span class="hbf-shock" aria-hidden="true"></span>' +
      st.map(function(o, k){ return '<span class="hbf-moon" style="--c:' + o.c + ';--a:' + (k * 150 + 25) + 'deg" aria-hidden="true"><i></i><em>' + esc(o.code) + '</em></span>'; }).join('') +
      '<div class="hbf-live"><span>Touchdown · ' + esc(m.code) + '</span><b>Mission <span class="t-outline">live</span></b>' +
      '<div class="hbf-live-a">' + btnHTML('is-primary', PROC + '#launch', 'Request this mission', '→', ' data-req') + btnHTML('is-ghost', '/contact#call', 'Book a call') + btnHTML('is-ghost is-replot', '#trajectory', 'Re-plot route', '↺', ' data-replot') + '</div></div>';
    dock.insertBefore(planetEl(m, 90, 'hbf-dock-pl'), dock.children[1] || null);
    track.appendChild(dock);
    $$('.ab_planet', track).forEach(build);
    // the Process page reads ab:dest (main first, then stops) and pre-fills its star chart + form
    // re-plot: warp back up to the planner on this page (the trajectory stays set; the flight plan stays below until relaunched)
    $('[data-replot]', dock).addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); warp(function(){ goTo($('#trajectory'), true, 20); }, true); });
    $('[data-req]', dock).addEventListener('click', function(){ try { localStorage.setItem('ab:dest', fsel.map(function(j){ return HUB[j].slug; }).join(',')); } catch (err){} });
  }
  function flayout(){
    if (!track) return;
    fwide = innerWidth > 860;
    wps.forEach(function(w){ w.style.left = w.style.top = ''; });
    var dock = $('.hbf-dock', track); if (!dock) return;
    // "Mission live" + its buttons: under the planet (absolute) on wide screens, in the flow after it on phones so nothing is clipped
    var live = $('.hbf-live', track);
    if (live){ if (fwide){ if (live.parentNode !== dock) dock.appendChild(live); } else if (live.parentNode !== track) track.appendChild(live); }
    if (!fwide){ track.style.width = ''; dock.style.left = dock.style.top = ''; return; }
    var h = track.offsetHeight, step = Math.max(360, innerWidth * .28), x0 = Math.min(240, innerWidth * .16);
    var dockX = x0 + step * STAGES.length + innerWidth * .22, W = dockX + innerWidth * .45, CARD_TOP = 150;
    var svg = $('.hbf-path', track), line = $('.hbf-line', track), lit = $('.hbf-lit', track);
    track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
    fpts = [[x0 * .45, 84]];
    STAGES.forEach(function(s, i){ fpts.push([x0 + step * i + step * .35, i % 2 ? 112 : 46]); });
    fpts.push([dockX, 84]);
    var d = 'M' + fpts[0][0] + ' ' + fpts[0][1];
    for (var i = 1; i < fpts.length; i++){ var p = fpts[i - 1], q = fpts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
    line.setAttribute('d', d); lit.setAttribute('d', d); flen = line.getTotalLength();
    lit.style.strokeDasharray = flen; lit.style.strokeDashoffset = flen;
    var pad = $('.hbf-pad', track); pad.style.left = fpts[0][0] + 'px'; pad.style.top = fpts[0][1] + 'px';
    dock.style.left = dockX + 'px'; dock.style.top = '84px';
    wps.forEach(function(w, i){
      var q = fpts[i + 1], node = $('.ab_hub-wp_node', w);
      w.style.left = (q[0] - 48) + 'px'; w.style.top = CARD_TOP + 'px';
      w.style.setProperty('--ny', (q[1] - CARD_TOP) + 'px');
      node.style.left = '48px'; node.style.top = (q[1] - CARD_TOP) + 'px';
    });
  }
  function fstage(k){
    if (k === fk) return; fk = k;
    wps.forEach(function(w, i){ w.classList.toggle('is-on', i <= k); });
    fset('n', 'T−' + Math.max(0, 5 - k));
    fset('l', k < 0 ? 'On the pad' : (STAGES[k] ? STAGES[k].code : '') + (k === 5 ? ' · liftoff' : ''));
  }
  function land(on){
    if (on === landed) return; landed = on;
    fsec.classList.toggle('is-landed', on);
    if (!on) return;
    fset('n', 'T+0'); fset('l', 'Touchdown');
    if (reduce || !hasGsap) return;
    var dock = $('.hbf-dock', track), cols = sel().map(function(j){ return HUB[j].c; }).concat(['#FF6A3D', '#F2F0EA']);
    if (!cols.length || !dock) return;
    for (var n = 0; n < 34; n++){
      var b = document.createElement('i'); b.className = 'hbf-bit'; b.style.background = cols[n % cols.length]; dock.appendChild(b);
      var a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 160;
      gsap.fromTo(b, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r - 40, rotation: Math.random() * 540, opacity: 0, duration: 1.2 + Math.random() * .6, ease: 'power2.out', onComplete: function(){ var t = this.targets()[0]; if (t.parentNode) t.parentNode.removeChild(t); } });
    }
  }
  function ffly(prog){
    if (!fwide) return;
    var line = $('.hbf-line', track), ship = $('.hbf-ship', track), lit = $('.hbf-lit', track); if (!line) return;
    // the ship stops at the planet's surface, not its center
    var at = Math.max(0, Math.min(1, prog)) * (flen - 92), p = line.getPointAtLength(at), p2 = line.getPointAtLength(Math.min(flen, at + 2));
    ship.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI) + 'deg)';
    lit.style.strokeDashoffset = flen - at;
    var k = -1; fpts.slice(1, 1 + STAGES.length).forEach(function(q, i){ if (p.x >= q[0] - 4) k = i; });
    if (prog < .97) fstage(k);
    land(prog >= .99);
  }
  function fbuild(){
    if (fst){ fst.kill(true); fst = null; }
    if (!track || !hasGsap) return;
    gsap.set(track, { x: 0 }); fk = -2; landed = false; fsec.classList.remove('is-landed');
    flayout();
    if (!window.ScrollTrigger) return;
    if (fwide){
      var dist = function(){ return track.scrollWidth - innerWidth + 40; };
      fst = ScrollTrigger.create({ trigger: fsec, start: 'top top', end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
        onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); ffly(self.progress * 1.02); } });
      ffly(0);
      window.__abMissionST = fst; // core holds the nav steady inside this range
    } else {
      // phones: the route is a vertical rail; stages light as they cross the middle, touchdown when the planet shows
      fst = ScrollTrigger.create({ trigger: track, start: 'top 60%', endTrigger: $('.hbf-dock', track) || track, end: 'bottom 75%', scrub: true,
        onUpdate: function(self){ var k = -1, mid = innerHeight * .6; wps.forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); fstage(k); land(self.progress > .98); } });
    }
  }
  // hyperspace: streaks rush out from the center, the page swaps underneath, the streaks fade
  var warpEl = null;
  function warp(mid, back){
    if (reduce || !hasGsap){ mid(); return; }
    if (!warpEl){
      warpEl = document.createElement('div'); warpEl.className = 'hb-warp'; warpEl.setAttribute('aria-hidden', 'true');
      var h = ''; for (var n = 0; n < 70; n++) h += '<i style="--a:' + Math.round(Math.random() * 360) + 'deg;--d:' + (Math.random() * .25).toFixed(2) + 's;--l:' + (30 + Math.random() * 50).toFixed(0) + 'vmax"></i>';
      warpEl.innerHTML = h + '<b></b>'; document.body.appendChild(warpEl);
    }
    warpEl.classList.remove('is-on'); warpEl.classList.toggle('is-back', !!back); void warpEl.offsetWidth; warpEl.classList.add('is-on');
    setTimeout(mid, 480);
    setTimeout(function(){ warpEl.classList.remove('is-on'); }, 1150);
  }
  // abort: warp back out, drop the pinned route, land on the planner with the trajectory still set
  function abortFlight(){
    warp(function(){
      if (fst){ fst.kill(true); fst = null; }
      window.__abMissionST = null;
      fsec.classList.remove('is-open', 'is-landed'); fsel = []; landed = false; fk = -2;
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      goTo($('#trajectory'), true, 20);
      drawPlan(false);
      toast('Mission aborted · back to the planner');
    }, true);
  }
  function launchFlight(){
    var chosen = sel(); if (!chosen.length || !fsec) return;
    fsel = chosen.slice();
    warp(function(){
      fill(fsel); fsec.classList.add('is-open');
      fbuild();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      goTo(fsec, true);
      drawPlan(false);
      toast('Flight plan plotted · ' + fsel.map(function(j){ return HUB[j].code; }).join(' + '));
    });
  }
  // width changes only on touch screens: the phone address bar resizes the height while scrolling and a rebuild reset the route
  var frT, frW = innerWidth; addEventListener('resize', function(){ if (!flightOpen() || (coarse && innerWidth === frW)) return; frW = innerWidth; clearTimeout(frT); frT = setTimeout(function(){ fbuild(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250); });

  drawPlan(false);
  // test-only: ?fly=0,5,2 launches that trajectory; ?p=0..1 sets the flight position
  (function(){
    var q = location.search.match(/[?&]fly=([\d,]+)/); if (!q || !fsec) return;
    var ids = q[1].split(',').map(Number).filter(function(j){ return HUB[j]; }); if (!ids.length) return;
    main = ids[0]; stops = ids.slice(1, 3); drawPlan(false);
    fsel = sel(); fill(fsel); fsec.classList.add('is-open');
    var pm = location.search.match(/[?&]p=([\d.]+)/), pr = pm ? +pm[1] : 0;
    setTimeout(function(){ fbuild(); if (window.ScrollTrigger) ScrollTrigger.refresh(); if (fst && fwide){ gsap.set(track, { x: -(track.scrollWidth - innerWidth + 40) * pr }); ffly(pr * 1.02); } }, 400);
  })();

  /* ===== hub/40-log.js ===== */
  /* =========================================================
     CREW LOGBOOK · one spread per mission (Missions CMS, number order), a patch for every service that flew on it
     ========================================================= */
  var pp = $('[data-hub-log]'), ctl = $('[data-log-ctl]'), spread = 0, busy = false;
  if (pp && FLIGHTS.length){
    pp.tabIndex = 0; pp.setAttribute('aria-roledescription', 'logbook'); pp.setAttribute('aria-label', 'Crew logbook. Use the arrow keys to turn the page.');
    pp.insertAdjacentHTML('beforeend', '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<span class="hb-glare" aria-hidden="true"></span><div class="hb-pp-page is-l"></div><div class="hb-pp-page is-r"></div><div class="hb-pp-turn" aria-hidden="true"></div>');
    if (ctl) ctl.innerHTML = '<button type="button" class="hb-pp-btn" data-log-prev aria-label="Previous mission">←</button><span class="hb-pp-ctl-n" data-log-n>01 / ' + pad(FLIGHTS.length) + '</span><button type="button" class="hb-pp-btn" data-log-next aria-label="Next mission">→</button>';
    var pageL = $('.hb-pp-page.is-l', pp), pageR = $('.hb-pp-page.is-r', pp), sheet = $('.hb-pp-turn', pp), nEl = $('[data-log-n]');
    var logLine = function(f){
      var l1 = ('AB SPACEPORT // CREW LOG // MISSION ' + f.no + ' // ' + f.name.toUpperCase() + ' //////////////////////////////').slice(0, 46);
      var l2 = ('PATCHES ' + (f.svc.length ? f.svc.map(function(s){ return s.code; }).join(' ') : 'NONE') + ' // ' + new Date().getFullYear() + ' //////////////////////////////').slice(0, 46);
      return esc(l1) + '<br>' + esc(l2);
    };
    var SLOTS = [[27, 17], [73, 20], [27, 51], [73, 54], [27, 85], [73, 87]];
    var htmlL = function(k){
      var f = FLIGHTS[k], ph = /placeholder/i.test(f.status);
      return '<div class="hb-pp-no"><span>Mission ' + esc(f.no) + '</span><span>Crew logbook</span></div>' +
        '<h3 class="hb-pp-name">' + esc(f.name) + '</h3><p class="hb-pp-client">' + esc(f.client) + '</p>' +
        '<dl class="hb-pp-dl"><div><dt>Status</dt><dd' + (ph ? ' class="is-ph"' : '') + '>' + esc(f.status) + '</dd></div><div><dt>Patches</dt><dd>' + f.svc.length + ' service' + (f.svc.length === 1 ? '' : 's') + '</dd></div></dl>' +
        '<a class="hb-pp-open" href="' + misHref(f.slug) + '">' + (ph ? 'See the archive' : 'Open the debrief') + ' <span aria-hidden="true">→</span></a>' +
        '<div class="hb-pp-mrz" aria-hidden="true">' + logLine(f) + '</div>';
    };
    var htmlR = function(k){
      var f = FLIGHTS[k], r = rnd(hash(f.slug));
      return '<div class="hb-pp-r-h"><span>Patches earned</span><span>' + pad(k + 1) + '</span></div><div class="hb-patches">' +
        (f.svc.length ? f.svc.map(function(s, j){
          var sl = SLOTS[j % SLOTS.length], x = sl[0] + (r() - .5) * 6, y = sl[1] + (r() - .5) * 4;
          return '<a class="hb-patch" href="' + SVC + s.slug + '" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;--c:' + s.c + '" aria-label="' + esc(s.t1 + ' ' + s.t2) + ' service"><small>Verified</small><b>' + esc(s.code) + '</b><em>' + esc(s.short) + '</em></a>';
        }).join('') : '<p class="hb-pp-none">No patches yet</p>') + '</div>';
    };
    var meta = function(k){ pp.style.setProperty('--mc', FLIGHTS[k].c); if (nEl) nEl.textContent = pad(k + 1) + ' / ' + pad(FLIGHTS.length); };
    var fillSpread = function(k){ pageL.innerHTML = htmlL(k); pageR.innerHTML = htmlR(k); meta(k); };
    // page turns: a real two-sided sheet. Its front is the page being turned (identical to the page under it, so nothing pops),
    // its back is the next mission's facing page; the page underneath already shows the new content. Desktop turns on the
    // spine (side to side), phones on the line between the stacked pages (top to bottom). Nothing swaps mid-turn.
    var turn = function(n){
      if (busy) return;
      var k = (spread + n + FLIGHTS.length) % FLIGHTS.length, flat = innerWidth <= 700, fwd = n > 0;
      if (reduce || !hasGsap){ spread = k; fillSpread(k); return; }
      busy = true;
      var under = fwd ? pageR : pageL, over = fwd ? pageL : pageR, back = fwd ? htmlL(k) : htmlR(k);
      sheet.classList.toggle('is-back', !fwd);
      if (flat){ sheet.style.top = under.offsetTop + 'px'; sheet.style.height = under.offsetHeight + 'px'; sheet.style.bottom = 'auto'; }
      else sheet.style.top = sheet.style.height = sheet.style.bottom = '';
      sheet.innerHTML = '<div class="hb-pp-page ' + (fwd ? 'is-r' : 'is-l') + ' hb-pp-face">' + under.innerHTML + '</div>' +
        '<div class="hb-pp-page ' + (fwd ? 'is-l' : 'is-r') + ' hb-pp-face is-rev">' + back + '</div>';
      under.innerHTML = fwd ? htmlR(k) : htmlL(k);
      spread = k; meta(k);
      var ax = flat ? 'rotationX' : 'rotationY', from = { rotationX: 0, rotationY: 0 }, to = { duration: .8, ease: 'power2.inOut',
        onComplete: function(){ over.innerHTML = back; sheet.classList.remove('is-on'); sheet.innerHTML = ''; gsap.set(sheet, { rotationX: 0, rotationY: 0 }); busy = false; } };
      to[ax] = flat ? (fwd ? 180 : -180) : (fwd ? -180 : 180);
      sheet.classList.add('is-on');
      gsap.fromTo(sheet, from, to);
    };
    glass(pp, function(){ return busy; });
    var prevB = $('[data-log-prev]'), nextB = $('[data-log-next]');
    if (prevB) prevB.addEventListener('click', function(){ turn(-1); });
    if (nextB) nextB.addEventListener('click', function(){ turn(1); });
    pp.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); turn(1); } else if (e.key === 'ArrowLeft'){ e.preventDefault(); turn(-1); } });
    var sx = null;
    pp.addEventListener('pointerdown', function(e){ if (e.target.closest('a')) return; sx = e.clientX; });
    addEventListener('pointerup', function(e){ if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1); });
    fillSpread(0);

    // brand accents: the Work page's cards carry each mission's accent (a Designer-bound Color on a hidden node)
    var CKEY = 'ab:mission-accents';
    var applyAccents = function(m){ FLIGHTS.forEach(function(f){ if (m[f.slug]) f.c = m[f.slug]; }); pp.style.setProperty('--mc', FLIGHTS[spread].c); };
    var cached = null; try { cached = JSON.parse(sessionStorage.getItem(CKEY) || 'null'); } catch (e){}
    if (cached) applyAccents(cached);
    else if (window.fetch && window.DOMParser) onView(pp, function(v){
      if (!v || cached) return; cached = {};
      fetch(WORK, { credentials: 'same-origin' }).then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
        if (!html) return;
        var doc = new DOMParser().parseFromString(html, 'text/html'), m = {};
        $$('[data-card-link][data-slug]', doc).forEach(function(a){
          var item = a.closest('.w-dyn-item') || a.parentNode, n = item && $('[data-field="brand-accent"]', item);
          var hx = n && (n.getAttribute('style') || '').match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/i);
          if (hx) m[a.getAttribute('data-slug')] = hx[0];
        });
        try { sessionStorage.setItem(CKEY, JSON.stringify(m)); } catch (e){}
        applyAccents(m);
      })['catch'](function(){});
    }, { rootMargin: '800px' });
  }

  /* ---------- final call: one more line on a small monitor, typed in when it scrolls into view ---------- */
  if (callRow){
    var CALL = { flight: 'AB-' + pad(HUB.length + 1), dest: 'CUSTOM CHARTER', via: 'ANY', gate: 'TBD', status: 'ON REQUEST' };
    callRow.innerHTML = '<span class="hb-cur" aria-hidden="true">&gt;</span>' + cellRow(CALL) + '<i class="hb-caret" aria-hidden="true"></i>';
    callRow.setAttribute('aria-label', 'Mission ' + CALL.flight + ', custom charter, any transfer, orbit to be decided, on request');
    tileSize();
    var called = false;
    if (!reduce) $$('.hb-fl', callRow).forEach(function(f){ f.setAttribute('data-ch', f.textContent); f.textContent = ' '; });
    onView(callRow, function(v){
      if (!v || called || reduce) return; called = true;
      $$('.hb-cell', callRow).forEach(function(cell, c){ $$('.hb-fl', cell).forEach(function(f, k){ glitchTo(f, f.getAttribute('data-ch') === ' ' ? ' ' : f.getAttribute('data-ch'), 3 + Math.floor(Math.random() * 4), c * 120 + k * 24); }); });
    });
  }

});
