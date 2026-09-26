/*! AB Portfolio · ab-core v0.9.2 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abCoreInit) return;
  window.__abCoreInit = true;
  /* ===== core/00-base.js ===== */
  /* ---------- base: helpers shared with the page bundles through window.AB ---------- */
  var AB = window.AB = window.AB || {};
  var hasGsap = !!window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function num(v, d){ var n = parseFloat(v); return isNaN(n) ? d : n; }
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  function hex(h){ h = h.trim().replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  // computed "rgb(r, g, b)" → "#rrggbb" (CMS Color fields reach the page as inline styles on hidden nodes)
  function rgbToHex(s){ var m = String(s || '').match(/\d+(\.\d+)?/g); if (!m || m.length < 3 || (m.length > 3 && +m[3] === 0)) return ''; return '#' + m.slice(0, 3).map(function(v){ var h = (+v | 0).toString(16); return h.length < 2 ? '0' + h : h; }).join(''); }
  function onView(el, fn, opts){ var io = new IntersectionObserver(function(es){ fn(es[0].isIntersecting); }, opts); io.observe(el); return io; }
  if (hasGsap){
    var plugins = [window.ScrollTrigger, window.Draggable, window.InertiaPlugin, window.SplitText, window.ScrambleTextPlugin, window.Flip].filter(Boolean);
    gsap.registerPlugin.apply(gsap, plugins);
  }

  /* ---------- site settings (CMS · Site Settings, hidden [data-settings-source] list) ---------- */
  // Webflow utility pages (404) can't hold Collection Lists, so every page with the site-data block caches it
  // (localStorage ab:site) and a page without it reads the cache, or fetches the Home page's block once.
  var SITE_KEY = 'ab:site', hasSiteData = !!$('[data-settings-source]');
  function readSettings(root){ var s = {}; $$('[data-settings-source] [data-field]', root).forEach(function(f){ var v = f.textContent.trim(); if (v) s[f.getAttribute('data-field')] = v; }); return s; }
  function readQuotes(root){
    return $$('[data-quote-source] .w-dyn-item', root).map(function(it){
      var g = function(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; };
      return { t: g('quote'), a: g('author'), c: g('context') };
    }).filter(function(q){ return q.t; });
  }
  var S0 = readSettings(), QUOTES = readQuotes(), siteCache = null;
  try { siteCache = JSON.parse(localStorage.getItem(SITE_KEY) || 'null'); } catch (e){}
  if (hasSiteData){ try { localStorage.setItem(SITE_KEY, JSON.stringify({ s: S0, q: QUOTES })); } catch (e){} }
  else if (siteCache){ S0 = siteCache.s || {}; QUOTES = siteCache.q || []; }
  function bind(key, val){ if (!val) return; $$('[data-bind="' + key + '"]').forEach(function(e){ e.textContent = val; }); }
  function applySettings(){
    bind('availability', S0.availability);
    if (S0.availability) bind('availability-short', S0.availability.replace(/^Available\s*/i, ''));
    bind('tz-label', S0['tz-label']);
    bind('email', S0.email);
    $$('[data-social]').forEach(function(a){ var url = S0[a.getAttribute('data-social')]; if (url){ a.href = url; a.target = '_blank'; a.rel = 'noopener'; } });
  }
  applySettings();
  var designerEmail = $('[data-bind="email"]');
  if (!S0.email && designerEmail) S0.email = designerEmail.textContent.trim();
  var events = (S0['space-events'] || 'shooting,meteors,comets,satellites,flares,ufo').split(',').map(function(s){ return s.trim(); });
  // social links without a Site Settings URL: a hint (checked on click, so a late fetch can still fill them)
  $$('[data-social]').forEach(function(a){
    a.addEventListener('click', function(e){ if (S0[a.getAttribute('data-social')]) return; e.preventDefault(); toast('Add your profile links in Site Settings.'); });
  });
  if (!hasSiteData && !siteCache && window.fetch && window.DOMParser){
    fetch('/', { credentials: 'same-origin' }).then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
      if (!html) return;
      var doc = new DOMParser().parseFromString(html, 'text/html'), s = readSettings(doc), q = readQuotes(doc);
      Object.keys(s).forEach(function(k){ S0[k] = s[k]; });
      QUOTES.push.apply(QUOTES, q);
      try { localStorage.setItem(SITE_KEY, JSON.stringify({ s: s, q: q })); } catch (e){}
      applySettings();
    })['catch'](function(){});
  }

  Object.assign(AB, { hasGsap: hasGsap, reduce: reduce, coarse: coarse, $: $, $$: $$, num: num, esc: esc, pad2: pad2, hex: hex, rgbToHex: rgbToHex, onView: onView, settings: S0, quotes: QUOTES });

  /* ===== core/10-space.js ===== */

  /* ---------- space layers + global UI (script-only, injected once per page) ---------- */
  function inject(html){ var d = document.createElement('div'); d.innerHTML = html; var el = d.firstChild; document.body.appendChild(el); return el; }
  function injectFirst(html){ var d = document.createElement('div'); d.innerHTML = html; var el = d.firstChild; document.body.insertBefore(el, document.body.firstChild); return el; }
  injectFirst('<div class="ab_warp-flash" id="warpFlash" aria-hidden="true"></div>');
  injectFirst('<div class="ab_grain" aria-hidden="true"></div>');
  injectFirst('<canvas class="ab_stars" id="stars" aria-hidden="true"></canvas>');
  injectFirst('<div class="ab_nebula" aria-hidden="true"></div>');
  var toastEl = inject('<div class="ab_toast" id="toast" role="status" aria-live="polite"></div>');
  var lgrid = inject('<div class="ab_lgrid" id="lgrid" aria-hidden="true"><div class="ab_lgrid-inner">' + new Array(13).join('<i></i>') + '</div></div>');

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function(){ toastEl.classList.remove('show'); }, 2600); }
  function copyText(t, okMsg, failFn){
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){ toast(okMsg); }, failFn || function(){ toast(t); });
    else if (failFn) failFn(); else toast(t);
  }

  /* ---------- clock + viewport ---------- */
  var fmt;
  try { fmt = new Intl.DateTimeFormat('en-US', { timeZone: S0.timezone || 'America/New_York', hour: 'numeric', minute: '2-digit' }); }
  catch (err){ fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }); }
  var clocks = $$('#clock, #footClock');
  function tick(){ var t = fmt.format(new Date()); clocks.forEach(function(c){ c.textContent = t; }); }
  tick(); setInterval(tick, 15000);
  var vpEl = $('#vpSize');
  function vp(){ if (vpEl) vpEl.textContent = innerWidth + ' × ' + innerHeight; }
  vp(); addEventListener('resize', vp);

  /* ---------- star texture for text fills (--starfill) ---------- */
  (function(){
    var c = document.createElement('canvas'); c.width = c.height = 220; var x = c.getContext('2d');
    for (var i = 0; i < 80; i++){
      var px = Math.random() * 220, py = Math.random() * 220, r = Math.random() < .08 ? 1.6 : .4 + Math.random() * .8;
      x.fillStyle = 'rgba(255,255,255,' + (.45 + Math.random() * .55) + ')';
      [[0, 0], [220, 0], [-220, 0], [0, 220], [0, -220]].forEach(function(o){ x.beginPath(); x.arc(px + o[0], py + o[1], r, 0, 7); x.fill(); });
    }
    document.documentElement.style.setProperty('--starfill', 'url(' + c.toDataURL() + ')');
  })();

  /* =========================================================
     PLANETS — procedural textures from data attributes on .ab_planet
     data-planet: gas | rocky | ice | lava | terra | blackhole
     data-colors, data-ring, data-tilt, data-open, data-spin, data-glow, data-seed, data-drag, data-parallax
     ========================================================= */
  function mix(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function ramp(cols, t){ t = Math.max(0, Math.min(.9999, t)) * (cols.length - 1); var i = Math.floor(t); return mix(cols[i], cols[i + 1], t - i); }
  function hash(i, j, s){ var h = (i * 374761393 + j * 668265263 + s * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
  function vnoise(x, y, px, s){
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px;
    var a = hash(x0, yi, s), b = hash(x1, yi, s), c = hash(x0, yi + 1, s), d = hash(x1, yi + 1, s);
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, px, s, oct){ var t = 0, amp = .5, f = 1, n = 0; for (var o = 0; o < oct; o++){ t += amp * vnoise(x * f, y * f, px * f, s + o); n += amp; amp *= .5; f *= 2; } return t / n; }
  var DEFAULTS = {
    gas: '#2b1d4f,#5a3f8e,#c68fbf,#3a2f6b,#f0b48a', rocky: '#6b6258,#9a8c7a,#433c35', ice: '#e3f2ff,#9cc3ee,#5a7fb8',
    lava: '#140807,#3a1510,#ff6a3d,#ffd27a', terra: '#0e3a5c,#1e6e8c,#3f8f4a,#a88b5c,#f2f0ea'
  };
  function makeTexture(type, cols, seed, W){
    var H = W / 2, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data, P = 8;
    for (var y = 0; y < H; y++){
      var v = y / H, lat = Math.abs(v - .5) * 2;
      for (var x = 0; x < W; x++){
        var u = x / W * P, c, k = (y * W + x) * 4;
        if (type === 'gas'){
          var warp = fbm(u, v * 4, P, seed, 3);
          var band = fbm(u * .25, v * 9 + warp * 1.8, 2, seed + 9, 4);
          c = ramp(cols, (band - .5) * 2.4 + .5);
          var sx = (x / W - .3), sy = (v - .62) * 2.2, st = sx * sx * 40 + sy * sy * 40;
          if (st < 1) c = mix(c, cols[cols.length - 1], (1 - st) * .7);
        } else if (type === 'rocky'){
          var n = fbm(u * 1.5, v * 3, 12, seed, 5);
          c = ramp(cols.slice(0, 2), n); c = mix(c, cols[2] || cols[0], Math.max(0, .45 - n) * 1.2);
        } else if (type === 'ice'){
          var sw = fbm(u, v * 3, P, seed + 3, 3);
          var n2 = fbm(u * .5, v * 7 + sw * .7, 4, seed, 4);
          c = ramp(cols.slice(0, 3), .15 + n2 * .55 + (v - .5) * .25);
          c = mix(c, cols[0], .18 * Math.sin(v * Math.PI * 5 + sw * 2) + .18);
          if (lat > .7) c = mix(c, [255, 255, 255], Math.min(.55, (lat - .7) * 1.8));
        } else if (type === 'lava'){
          var r = 1 - Math.abs(fbm(u * 1.5, v * 2.8, 12, seed, 5) * 2 - 1);
          c = ramp(cols.slice(0, 2), fbm(u, v * 2, P, seed + 5, 3));
          if (r > .86){ var g = Math.min(1, (r - .86) * 8); c = mix(c, ramp(cols.slice(2), g), g); }
        } else { // terra
          var land = fbm(u * 1.25, v * 2.4, 10, seed, 5), cloud = fbm(u * 2, v * 5, P * 2, seed + 7, 4);
          c = land > .52 ? mix(cols[2], cols[3], Math.min(1, (land - .52) * 4)) : mix(cols[0], cols[1], land * 1.6);
          if (lat > .82) c = mix(c, cols[4], Math.min(1, (lat - .82) * 6));
          if (cloud > .56) c = mix(c, [255, 255, 255], Math.min(.8, (cloud - .56) * 4));
        }
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    if (type === 'rocky'){ // craters, wrapped in x
      for (var i = 0; i < 26; i++){
        var cx = hash(i, 1, seed) * W, cy = (hash(i, 2, seed) * .8 + .1) * H, cr = 2 + hash(i, 3, seed) * W * .035;
        [cx, cx - W, cx + W].forEach(function(xx){
          ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.arc(xx, cy, cr, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = Math.max(1, cr * .18); ctx.beginPath(); ctx.arc(xx - cr * .12, cy - cr * .12, cr, Math.PI * .9, Math.PI * 1.7); ctx.stroke();
        });
      }
    }
    return cv.toDataURL('image/jpeg', .9);
  }
  function buildPlanet(el){
    if (el.__built) return; el.__built = true;
    var type = el.getAttribute('data-planet') || 'gas';
    if (type === 'blackhole'){
      var bh = document.createElement('div'); bh.className = 'pbody'; el.appendChild(bh); el.__body = bh;
      bh.innerHTML = '<div class="bh-flash"></div><div class="bh-glow"></div><div class="bh-disk back"><i></i></div><div class="bh-lens"><i></i></div><div class="bh-core"></div><div class="bh-disk front"><i></i></div>';
      el.setAttribute('aria-hidden', 'true');
      return;
    }
    var ds = el.dataset;
    var cols = (ds.colors || DEFAULTS[type] || DEFAULTS.gas).split(',').map(hex);
    var seed = num(ds.seed, 1);
    var sphere = document.createElement('div'); sphere.className = 'sphere';
    var tex = document.createElement('div'); tex.className = 'tex'; sphere.appendChild(tex);
    // instant stand-in: the planet's own colors as bands, so it never shows as a black disc
    sphere.style.setProperty('--base', 'linear-gradient(170deg,' + cols.map(function(c, i){ return 'rgb(' + c.map(Math.round).join(',') + ') ' + Math.round(i / Math.max(1, cols.length - 1) * 100) + '%'; }).join(',') + ')');
    var sz = el.getBoundingClientRect().width || 100;
    el.style.setProperty('--sz', sz + 'px');
    var spin = num(ds.spin, 40);
    el.style.setProperty('--spin', Math.abs(spin) + 's'); if (spin < 0) el.style.setProperty('--dir', 'reverse');
    if (ds.glow) el.style.setProperty('--glow', ds.glow);
    var pbody = document.createElement('div'); pbody.className = 'pbody'; el.appendChild(pbody); el.__body = pbody;
    pbody.appendChild(sphere);
    if (ds.ring){
      var rc = ds.ring.split(',').map(function(h){ return 'rgba(' + hex(h).join(',') + ','; });
      el.style.setProperty('--r1', rc[0] + '.75)'); el.style.setProperty('--r2', (rc[1] || rc[0]) + '.45)'); el.style.setProperty('--r3', (rc[2] || rc[0]) + '.6)');
      el.style.setProperty('--tilt', num(ds.tilt, -14) + 'deg'); el.style.setProperty('--open', num(ds.open, .24));
      ['back', 'front'].forEach(function(side){ var r = document.createElement('div'); r.className = 'pring pring-' + side; r.appendChild(document.createElement('i')); pbody.appendChild(r); });
    }
    if (!el.hasAttribute('aria-hidden') && !el.hasAttribute('role')){
      if (ds.label && el.hasAttribute('data-drag')){ el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'Draggable planet: ' + ds.label); el.tabIndex = 0; }
      else el.setAttribute('aria-hidden', 'true');
    }
    var paint = function(){ var W = sz > 160 ? 512 : sz > 70 ? 256 : 128; tex.style.backgroundImage = 'url(' + makeTexture(type, cols, seed, W) + ')'; requestAnimationFrame(function(){ tex.classList.add('on'); }); };
    if ('requestIdleCallback' in window) requestIdleCallback(paint, { timeout: 800 }); else setTimeout(paint, 30);
  }
  var planets = $$('.ab_planet[data-planet]');
  var pio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ buildPlanet(e.target); pio.unobserve(e.target); } }); }, { rootMargin: '1400px' });
  planets.forEach(function(p){ if (p.hasAttribute('data-drag')) p.classList.add('is-drag'); if (p.closest('#hero')) buildPlanet(p); else pio.observe(p); });
  addEventListener('resize', function(){ planets.forEach(function(p){ if (p.__built) p.style.setProperty('--sz', p.getBoundingClientRect().width + 'px'); }); });

  /* =========================================================
     STARFIELD + SPACE EVENTS (Site Settings · Space events)
     ========================================================= */
  var sf = (function(){
    var c = $('#stars'), ctx = c.getContext('2d');
    var w, h, dpr, stars = [], mx = 0, my = 0, tmx = 0, tmy = 0, state = { warp: 0 }, running = true, last = 0, active = [];
    var depth = [0.03, 0.09, 0.2], size = [0.55, 0.9, 1.45];
    var on = function(k){ return events.indexOf(k) > -1; };
    var rnd = function(a, b){ return a + Math.random() * (b - a); };
    var timers = { shooting: rnd(2, 5), meteors: rnd(6, 12), comets: rnd(14, 24), satellites: rnd(8, 16), flares: rnd(3, 6), ufo: rnd(50, 90) };
    var gaps = { shooting: [5, 11], meteors: [11, 22], comets: [45, 75], satellites: [22, 38], flares: [4, 9], ufo: [120, 200] };
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(900, Math.round(w * h / 2400)); stars = [];
      for (var i = 0; i < n; i++){
        var d = Math.random(), l = d < .62 ? 0 : d < .9 ? 1 : 2, r = Math.random();
        stars.push({ x: Math.random() * w, y: Math.random() * h, l: l, r: size[l] * (0.7 + Math.random() * 0.6), a: 0.35 + Math.random() * 0.6, t: Math.random() * 6.28, c: r < .12 ? '207,214,255' : r < .2 ? '255,226,204' : '255,255,255' });
      }
      if (reduce) draw(0, 0);
    }
    function edgeStart(){ var fromLeft = Math.random() < .5; return { x: fromLeft ? rnd(-100, w * .4) : rnd(w * .6, w + 100), y: rnd(-60, h * .35), dir: fromLeft ? 1 : -1 }; }
    function spawn(type){
      var s = edgeStart(), a, i;
      if (type === 'shooting'){ a = rnd(.35, .7); active.push({ type: type, x: s.x, y: s.y, vx: Math.cos(a) * s.dir * rnd(900, 1300), vy: Math.sin(a) * rnd(900, 1300), life: 0, dur: rnd(.6, 1), len: rnd(90, 170) }); }
      if (type === 'meteors'){
        var n = Math.random() < .25 ? 3 : 1;
        for (i = 0; i < n; i++){ a = rnd(.45, .75); var sp = rnd(420, 620);
          active.push({ type: type, x: s.x + i * 60 * -s.dir, y: s.y - i * 40, vx: Math.cos(a) * s.dir * sp, vy: Math.sin(a) * sp, life: -i * .35, dur: rnd(1.6, 2.4), size: rnd(2.2, 3.6), sparks: [] }); }
      }
      if (type === 'comets'){ var y0 = rnd(h * .08, h * .45), dir = Math.random() < .5 ? 1 : -1; active.push({ type: type, x: dir > 0 ? -80 : w + 80, y: y0, vx: dir * rnd(70, 110), vy: rnd(8, 24), life: 0, dur: (w + 160) / 90 + 2 }); }
      if (type === 'satellites'){ var d2 = Math.random() < .5 ? 1 : -1; active.push({ type: type, x: d2 > 0 ? -10 : w + 10, y: rnd(h * .05, h * .6), vx: d2 * rnd(40, 70), vy: rnd(-8, 8), life: 0, dur: (w + 20) / 40 }); }
      if (type === 'flares' && stars.length){ var st = stars[(Math.random() * stars.length) | 0]; active.push({ type: type, star: st, life: 0, dur: 1.3 }); }
      if (type === 'ufo'){ var d4 = Math.random() < .5 ? 1 : -1; active.push({ type: type, x0: d4 > 0 ? -40 : w + 40, y: rnd(h * .12, h * .35), dir: d4, life: 0, dur: 3.2, hold: rnd(.35, .65) }); }
    }
    function starPos(s, sy){ var dp = depth[s.l]; return [s.x + mx * dp * 60, ((s.y - sy * dp) % h + h) % h + my * dp * 40]; }
    function drawEvents(dt, time, sy){
      for (var i = active.length - 1; i >= 0; i--){
        var e = active[i]; e.life += dt;
        if (e.life < 0) continue;
        if (e.life > e.dur){ active.splice(i, 1); continue; }
        var p = e.life / e.dur;
        if (e.type === 'shooting'){
          e.x += e.vx * dt; e.y += e.vy * dt;
          var m = Math.hypot(e.vx, e.vy), ux = e.vx / m, uy = e.vy / m, fade = Math.sin(p * Math.PI);
          var g = ctx.createLinearGradient(e.x, e.y, e.x - ux * e.len, e.y - uy * e.len);
          g.addColorStop(0, 'rgba(255,255,255,' + fade + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x - ux * e.len, e.y - uy * e.len); ctx.stroke();
        } else if (e.type === 'meteors'){
          e.x += e.vx * dt; e.y += e.vy * dt;
          var m2 = Math.hypot(e.vx, e.vy), ux2 = e.vx / m2, uy2 = e.vy / m2, f2 = Math.min(1, p * 5) * Math.min(1, (1 - p) * 3), L = 190 + e.size * 30;
          var nx = -uy2, ny = ux2, tx = e.x - ux2 * L, ty = e.y - uy2 * L;
          var g2 = ctx.createLinearGradient(e.x, e.y, tx, ty);
          g2.addColorStop(0, 'rgba(255,244,230,' + f2 + ')'); g2.addColorStop(.18, 'rgba(255,170,90,' + .85 * f2 + ')'); g2.addColorStop(.55, 'rgba(255,106,61,' + .35 * f2 + ')'); g2.addColorStop(1, 'rgba(255,106,61,0)');
          ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(e.x + nx * e.size, e.y + ny * e.size); ctx.lineTo(tx, ty); ctx.lineTo(e.x - nx * e.size, e.y - ny * e.size); ctx.closePath(); ctx.fill();
          var hg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 6); hg.addColorStop(0, 'rgba(255,250,240,' + f2 + ')'); hg.addColorStop(.3, 'rgba(255,190,120,' + .6 * f2 + ')'); hg.addColorStop(1, 'rgba(255,106,61,0)');
          ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(e.x, e.y, e.size * 6, 0, 7); ctx.fill();
          if (Math.random() < .6) e.sparks.push({ x: e.x, y: e.y, vx: -e.vx * .08 + rnd(-30, 30), vy: -e.vy * .08 + rnd(-30, 30), l: 0 });
          for (var q = e.sparks.length - 1; q >= 0; q--){ var sp = e.sparks[q]; sp.l += dt; if (sp.l > .6){ e.sparks.splice(q, 1); continue; } sp.x += sp.vx * dt; sp.y += sp.vy * dt; ctx.fillStyle = 'rgba(255,190,120,' + (1 - sp.l / .6) * f2 + ')'; ctx.fillRect(sp.x, sp.y, 1.4, 1.4); }
        } else if (e.type === 'comets'){
          e.x += e.vx * dt; e.y += e.vy * dt;
          var f3 = Math.min(1, p * 6) * Math.min(1, (1 - p) * 6), dx = -Math.sign(e.vx), tailL = 320;
          [[0, 1, 'rgba(200,225,255,'], [.18, .6, 'rgba(160,190,255,']].forEach(function(t){
            var ex = e.x + dx * tailL, ey = e.y - tailL * (.12 + t[0]);
            var g3 = ctx.createLinearGradient(e.x, e.y, ex, ey); g3.addColorStop(0, t[2] + .55 * f3 * t[1] + ')'); g3.addColorStop(1, t[2] + '0)');
            ctx.fillStyle = g3; ctx.beginPath(); ctx.moveTo(e.x, e.y - 3); ctx.lineTo(ex, ey - 16); ctx.lineTo(ex, ey + 16); ctx.lineTo(e.x, e.y + 3); ctx.closePath(); ctx.fill();
          });
          var cg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 22); cg.addColorStop(0, 'rgba(255,255,255,' + f3 + ')'); cg.addColorStop(.25, 'rgba(200,225,255,' + .6 * f3 + ')'); cg.addColorStop(1, 'rgba(160,190,255,0)');
          ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(e.x, e.y, 22, 0, 7); ctx.fill();
        } else if (e.type === 'satellites'){
          e.x += e.vx * dt; e.y += e.vy * dt;
          ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillRect(e.x, e.y, 1.6, 1.6);
          if ((time / 1000) % 1.2 < .12){ ctx.fillStyle = 'rgba(255,80,60,.95)'; ctx.beginPath(); ctx.arc(e.x + .8, e.y + .8, 2.2, 0, 7); ctx.fill(); }
        } else if (e.type === 'flares'){
          var sp2 = starPos(e.star, sy), f4 = Math.sin(p * Math.PI), L2 = 4 + f4 * 14;
          ctx.strokeStyle = 'rgba(255,255,255,' + .8 * f4 + ')'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(sp2[0] - L2, sp2[1]); ctx.lineTo(sp2[0] + L2, sp2[1]); ctx.moveTo(sp2[0], sp2[1] - L2); ctx.lineTo(sp2[0], sp2[1] + L2); ctx.stroke();
          var fg = ctx.createRadialGradient(sp2[0], sp2[1], 0, sp2[0], sp2[1], 6); fg.addColorStop(0, 'rgba(255,255,255,' + f4 + ')'); fg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(sp2[0], sp2[1], 6, 0, 7); ctx.fill();
        } else if (e.type === 'ufo'){
          var t1 = e.life, xIn = w * (e.dir > 0 ? .3 : .7), ux3;
          if (t1 < 1) ux3 = e.x0 + (xIn - e.x0) * (1 - Math.pow(1 - t1, 3));
          else if (t1 < 1 + e.hold * 2) ux3 = xIn + Math.sin((t1 - 1) * 20) * 1.5;
          else { var t2 = (t1 - 1 - e.hold * 2) / (e.dur - 1 - e.hold * 2); ux3 = xIn + e.dir * t2 * t2 * w * 1.2; }
          var uy3 = e.y + Math.sin(t1 * 4) * 3;
          if (t1 > 1 && t1 < 1 + e.hold * 2){ var bg = ctx.createLinearGradient(ux3, uy3, ux3, uy3 + 70); bg.addColorStop(0, 'rgba(160,255,200,.35)'); bg.addColorStop(1, 'rgba(160,255,200,0)'); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(ux3 - 5, uy3 + 3); ctx.lineTo(ux3 + 5, uy3 + 3); ctx.lineTo(ux3 + 18, uy3 + 70); ctx.lineTo(ux3 - 18, uy3 + 70); ctx.closePath(); ctx.fill(); }
          ctx.fillStyle = 'rgba(200,210,230,.9)'; ctx.beginPath(); ctx.ellipse(ux3, uy3, 14, 4, 0, 0, 7); ctx.fill();
          ctx.fillStyle = 'rgba(160,255,200,.8)'; ctx.beginPath(); ctx.ellipse(ux3, uy3 - 3, 6, 4, 0, Math.PI, 0); ctx.fill();
          if ((time / 150 | 0) % 2){ ctx.fillStyle = '#FF6A3D'; ctx.fillRect(ux3 - 9, uy3 - 1, 2, 2); ctx.fillRect(ux3 + 7, uy3 - 1, 2, 2); }
        }
      }
    }
    function draw(time, dt){
      ctx.clearRect(0, 0, w, h);
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      var sy = window.scrollY, cx = w / 2, cy = h / 2, wp = state.warp;
      for (var i = 0; i < stars.length; i++){
        var s = stars[i], dp = depth[s.l];
        if (wp > 0.01){
          var dx0 = s.x - cx, dy0 = s.y - cy;
          s.x += dx0 * wp * 0.06 * (s.l + 1); s.y += dy0 * wp * 0.06 * (s.l + 1);
          if (s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50){ s.x = cx + (Math.random() - .5) * w * .3; s.y = cy + (Math.random() - .5) * h * .3; }
        }
        var px = s.x + mx * dp * 60, py = ((s.y - sy * dp) % h + h) % h + my * dp * 40;
        var al = reduce ? s.a : s.a * (0.72 + 0.28 * Math.sin(time * 0.0018 + s.t));
        if (wp > 0.01){
          var dx = px - cx, dy = py - cy, k = wp * 0.12 * (s.l + 1);
          ctx.strokeStyle = 'rgba(' + s.c + ',' + al + ')'; ctx.lineWidth = s.r;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - dx * k, py - dy * k); ctx.stroke();
        } else { ctx.fillStyle = 'rgba(' + s.c + ',' + al + ')'; ctx.fillRect(px, py, s.r, s.r); }
      }
      if (!reduce && dt){
        Object.keys(timers).forEach(function(k){ if (!on(k)) return; timers[k] -= dt; if (timers[k] <= 0){ spawn(k); timers[k] = rnd(gaps[k][0], gaps[k][1]); } });
        drawEvents(dt, time, sy);
      }
    }
    function loop(t){ var dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t; if (running) draw(t, dt); requestAnimationFrame(loop); }
    resize(); addEventListener('resize', resize);
    if (!reduce) requestAnimationFrame(loop);
    addEventListener('pointermove', function(e){ tmx = e.clientX / w - .5; tmy = e.clientY / h - .5; });
    document.addEventListener('visibilitychange', function(){ running = !document.hidden; last = 0; });
    if (reduce) addEventListener('scroll', function(){ draw(0, 0); }, { passive: true });
    return { state: state, spawn: spawn };
  })();
  window.__abSpace = sf; // handy for testing: __abSpace.spawn('meteors')

  function warp(done){
    var flash = $('#warpFlash');
    if (!hasGsap || reduce){ if (done) done(); return; }
    gsap.timeline()
      .to(sf.state, { warp: 1, duration: .55, ease: 'power3.in' })
      .to(flash, { opacity: .85, duration: .2 }, '-=.15')
      .add(function(){ if (done) done(); })
      .to(flash, { opacity: 0, duration: .5 })
      .to(sf.state, { warp: 0, duration: .9, ease: 'power2.out' }, '<');
  }

  /* ---------- page transitions: warp out, and the next page arrives out of the warp ---------- */
  var WARP_IN = 'ab:warp-in';
  // leaving: warp in and HOLD on the fully covered screen (warp() fades back out, which showed the old page
  // again while the next one loaded); the next page starts covered and fades in
  function go(href){
    try { sessionStorage.setItem(WARP_IN, '1'); } catch(e){}
    var flash = $('#warpFlash');
    if (!hasGsap || reduce || !flash){ location.href = href; return; }
    flash.style.pointerEvents = 'auto';
    gsap.timeline()
      .to(sf.state, { warp: 1, duration: .55, ease: 'power3.in' })
      .to(flash, { opacity: 1, duration: .25 }, '-=.2')
      .add(function(){ location.href = href; });
  }
  (function arrive(){
    var html = document.documentElement, flag = null;
    try { flag = sessionStorage.getItem(WARP_IN); sessionStorage.removeItem(WARP_IN); } catch(e){}
    var flash = $('#warpFlash');
    if (flag && hasGsap && !reduce && flash){
      gsap.set(flash, { opacity: 1 }); sf.state.warp = 1;
      html.classList.remove('ab-warp-in');
      gsap.timeline().to(flash, { opacity: 0, duration: .6, ease: 'power2.out' }, .05).to(sf.state, { warp: 0, duration: 1.1, ease: 'power2.out' }, 0);
    } else html.classList.remove('ab-warp-in');
    // back/forward cache: a page restored mid-warp would keep its flash up
    addEventListener('pageshow', function(e){ if (e.persisted && flash){ if (hasGsap) gsap.set(flash, { opacity: 0 }); else flash.style.opacity = 0; flash.style.pointerEvents = ''; sf.state.warp = 0; } });
  })();

  Object.assign(AB, { toast: toast, copyText: copyText, fmt: fmt, buildPlanet: buildPlanet, planets: planets, sf: sf, warp: warp, go: go, inject: inject });

  /* ===== core/20-ui.js ===== */

  /* ---------- selection UI ([data-selectable]: Figma-style box, handles, name + size tags) ---------- */
  function addSel(el){
    var s = document.createElement('div'); s.className = 'sel'; s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<i class="tl"></i><i class="tc"></i><i class="tr"></i><i class="ml"></i><i class="mr"></i><i class="bl"></i><i class="bc"></i><i class="br"></i><span class="sel-tag"></span><span class="sel-size"></span>';
    // forms use data-sel-name (their data-name is the Webflow Forms inbox name)
    s.querySelector('.sel-tag').textContent = el.getAttribute('data-sel-name') || el.getAttribute('data-name') || 'Frame';
    el.appendChild(s);
    function size(){ s.querySelector('.sel-size').textContent = el.getAttribute('data-size') || (Math.round(el.offsetWidth) + ' × ' + Math.round(el.offsetHeight)); }
    size(); el.addEventListener('mouseenter', size);
    el.__sel = s;
    return s;
  }
  $$('[data-selectable]:not(.t-select)').forEach(addSel);

  // text decorations, added after a heading's reveal so SplitText never splits them
  function decorate(root){
    $$('.t-select', root).forEach(function(el){
      if (el.__dec) return; el.__dec = true;
      var s = addSel(el);
      if (!$('.sel-cur')){ var cur = document.createElement('div'); cur.className = 'sel-cur'; cur.innerHTML = '<svg width="18" height="22" viewBox="0 0 18 22"><path d="M1 1 L1 18 L6 13.5 L9.5 21 L12.5 19.5 L9 12.5 L16 12.5 Z" fill="#FF6A3D" stroke="#07080D" stroke-width="1.2"/></svg><span>Angelino</span>'; s.appendChild(cur); }
      setTimeout(function(){ el.classList.add('is-selected'); }, 300);
    });
    $$('.t-orbit', root).forEach(function(el){
      if (el.__dec) return; el.__dec = true;
      var o = document.createElement('i'); o.className = 'orb'; o.setAttribute('aria-hidden', 'true'); o.appendChild(document.createElement('b')); el.appendChild(o);
    });
  }

  /* ---------- Figma-style frame names on sections (component Frame label) ---------- */
  $$('section[data-frame]').forEach(function(sec){
    var l = $('[data-frame-label]', sec);
    if (!l){ l = document.createElement('span'); l.className = 'ab_frame-label'; l.setAttribute('aria-hidden', 'true'); sec.insertBefore(l, sec.firstChild); }
    function upd(){ l.textContent = '▢ ' + sec.getAttribute('data-frame') + '   ' + sec.offsetWidth + ' × ' + sec.offsetHeight; }
    upd(); addEventListener('resize', upd); setTimeout(upd, 1500);
  });

  /* ---------- layout grid overlay (Shift+G, footer toggle) ---------- */
  var gbtn = $('#gridToggle');
  function toggleGrid(){ var on = !lgrid.classList.contains('on'); lgrid.classList.toggle('on', on); if (gbtn) gbtn.setAttribute('aria-pressed', on); toast(on ? 'Layout grid on · 12 columns · 24px gutter' : 'Layout grid off'); }
  if (gbtn){
    if (!gbtn.hasAttribute('tabindex')) gbtn.tabIndex = 0;
    gbtn.setAttribute('aria-pressed', 'false');
    gbtn.addEventListener('click', toggleGrid);
    gbtn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleGrid(); } });
  }
  document.addEventListener('keydown', function(e){ if (e.shiftKey && (e.key === 'G' || e.key === 'g') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); toggleGrid(); } });

  /* ---------- copy the email ([data-copy-email]) ---------- */
  $$('[data-copy-email]').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      var src = $('[data-bind="email"]', b) || b, t = S0.email || src.textContent.trim();
      copyText(t, 'Copied to clipboard ✓', function(){ var r = document.createRange(); r.selectNodeContents(src); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Selected. Press Ctrl/Cmd + C to copy.'); });
    });
  });

  /* ---------- cursor readout (HUD) ---------- */
  (function(){
    if (coarse) return;
    inject('<div class="ab_hud" id="hud" aria-hidden="true"><span class="ab_hud-k">X</span><span id="hudX">0000</span><span class="ab_hud-k">Y</span><span id="hudY">0000</span><span class="ab_hud-sec" id="hudSec">hero</span></div>');
    var hx = $('#hudX'), hy = $('#hudY'), hs = $('#hudSec'), px = 0, py = 0, dirty = false;
    var secs = $$('section[data-frame], #hero, #siteFoot');
    function p4(n){ n = String(n); while (n.length < 4) n = '0' + n; return n; }
    addEventListener('pointermove', function(e){ px = e.clientX; py = e.clientY; dirty = true; }, { passive: true });
    addEventListener('scroll', function(){ dirty = true; }, { passive: true });
    (function frame(){
      if (dirty){
        dirty = false; var ay = Math.round(py + scrollY);
        hx.textContent = p4(Math.round(px)); hy.textContent = p4(ay);
        var name = 'space';
        for (var i = 0; i < secs.length; i++){ var r = secs[i].getBoundingClientRect(); if (py >= r.top && py <= r.bottom){ name = secs[i].getAttribute('data-frame') || (secs[i].id === 'hero' ? 'hero' : 'footer'); } }
        hs.textContent = name;
      }
      requestAnimationFrame(frame);
    })();
  })();

  Object.assign(AB, { addSel: addSel, decorate: decorate });

  /* ===== core/21-mark.js ===== */
  /* ---------- the AB planet monogram (logo/ab-logo.svg): one source for every surface ----------
     AB.markSVG({ cls, grid, dims }) → nav/footer logo, Work card "Mark" cover, Home board preview, the AB Identity
     monitor channels (build / grid / light) and the Applications mockups. Paths: lg-a (the A's stroke),
     lg-planet (planet + ring, also the A's right leg), lg-b. Construction (logo units, 490.16 × 241.75): planet
     centered at 240,121 on the cap-height midline, r 98 with a 68 core, ring on a 21.5° axis. */
  var MARK = { a: "M75.02,202.12c-.23-.51-.42-1.03-.55-1.55-1.4-5.03,1.1-10.58,4.69-15.7,1.61-2.32,3.46-4.55,5.26-6.61,5.43-6.24,12.69-13.56,20.36-21.34l.75-2.51,11.82-39.51c1.65-5.15,3.28-10.61,4.92-16.33,1.65-5.75,3.22-11.29,4.75-16.7,1.51-5.37,2.74-10.18,3.69-14.41h2.81c.93,3.29,1.99,7.09,3.16,11.44,1.17,4.29,2.32,8.67,3.5,13.08.01.02.01.05.02.07.25.96.5,1.9.75,2.84,0,0,0-.01,0-.02.31-1.23.64-2.45,1-3.66,5.47-18.49,15.98-35.18,30.56-48.19,4.24-3.79,8.74-7.19,13.45-10.2.68-.43,1.37-.86,2.05-1.27.2-.12.39-.23.59-.35.35-.21.7-.41,1.05-.61,0,0,0,0,0,0L178.49,0h-90.3L0,241.75h79.41l9.76-32.61c-7.32-.11-12.07-2.47-14.15-7.02Z", b: "M483.84,145.81c-4.21-8.18-9.79-14.58-16.7-19.13-6.9-4.58-14.58-7.81-23-9.67v-1.4c7.25-2.11,13.93-5.34,20.02-9.66,6.09-4.35,11.01-10.27,14.77-17.76,3.74-7.49,5.61-17.1,5.61-28.79s-3.04-22.02-9.13-30.95c-6.09-8.89-14.18-15.87-24.25-20.9-10.07-5.03-21.2-7.55-33.39-7.55h-230.76l9.78,26.79s.03-.01.04-.02c1.18-.56,2.37-1.1,3.57-1.62,13-5.68,27.11-8.67,41.53-8.67,3.76,0,7.56.2,11.32.61,23.01,2.48,44,12.2,60.73,28.13,7.39,5.78,12.49,9.09,19.56,11.17.11.04.74.19,2.29.19,5.1,0,13.7-1.64,23.47-3.78,3.33-.73,6.8-1.51,10.31-2.3,17.46-3.95,35.49-8.04,48.18-8.04,8.29,0,13.67,1.76,16.94,5.5,1.55,1.77,2.24,4.06,1.94,6.46-.88,7.19-10.49,14.5-37.61,33.36-.2.15-.42.29-.65.45-17.81,12.37-37.93,26.35-52.23,39.84-.08,1.32-.2,2.68-.35,4-.44,4.06-1.11,8.06-2.01,12h49.72c3.5,0,6.61.82,9.31,2.45,2.69,1.63,4.8,3.92,6.32,6.87,1.53,2.91,2.29,6.15,2.29,9.63,0,7.52-1.65,13.13-4.92,16.88-3.29,3.74-7.62,5.63-13,5.63h-59.03v-16.16c-5.76,10.99-13.49,20.95-22.93,29.36-11.58,10.34-25.16,17.88-39.75,22.22-1.25.37-2.52.72-3.78,1.05-.01,0-.03.01-.04.01l7.2,19.74h144.68c13.11,0,24.95-2.69,35.49-8.1,10.54-5.37,18.97-12.86,25.3-22.47,6.32-9.61,9.48-20.85,9.48-33.74s-2.1-23.42-6.32-31.63Z", planet: "M430.06,52.02c-2.11-2.4-6.48-3.35-12.27-3.35-14.89,0-39.14,6.29-58.49,10.47-9.63,2.08-18.03,3.64-23.47,3.64-1.62,0-2.99-.14-4.02-.45-8.15-2.37-13.95-6.19-21.9-12.42-15.1-14.47-34.93-24.24-57.33-26.67-3.59-.38-7.15-.56-10.65-.56-13.9,0-27.26,2.94-39.41,8.3-1.2.52-2.39,1.07-3.56,1.65-.01.01-.03.01-.04.02-1.28.62-2.56,1.29-3.81,1.98-.44.24-.88.47-1.32.73-.66.37-1.33.75-1.98,1.14-.42.24-.84.5-1.25.75-.13.08-.26.16-.39.24-.75.48-1.5.95-2.23,1.44-21.79,14.41-37.72,37.37-42.56,64.71-.26,1.45-.49,2.92-.68,4.4-.11.77-.2,1.54-.28,2.31-.49,4.53-.66,9.04-.54,13.48-.22.27-.45.56-.68.84-.43.53-.86,1.06-1.3,1.58-2.69,3.25-5.54,6.5-8.46,9.73-2.57,2.84-5.19,5.66-7.84,8.44-3.56,3.76-7.16,7.46-10.7,11.06-.64.65-1.28,1.3-1.92,1.95-3.59,3.65-7.09,7.18-10.4,10.55-.54.55-1.06,1.1-1.59,1.64h-.01c-4.48,4.6-8.54,8.87-11.9,12.72-13.24,15.16-10.32,20.62.66,20.62.42,0,.84-.01,1.28-.02.37-.02.74-.04,1.13-.06,2.26-.13,4.78-.46,7.51-.93.46-.08.93-.16,1.41-.25,10.79-2.02,24.56-6.24,38.23-11.07,3.13-1.12,6.26-2.24,9.34-3.4,3.45-1.29,6.86-2.59,10.17-3.9.53-.2,1.06-.41,1.59-.62,2.01-.78,3.97-1.57,5.88-2.34.6-.25,1.19-.49,1.78-.73,12.27-5.01,22.12-9.43,26.23-11.55,1.59-.82,3.19-1.65,4.79-2.5.02,0,.04-.02.06-.03,8.45-4.41,16.94-9.01,25.43-13.68.9-.49,1.79-.99,2.68-1.48,1.09-.6,2.17-1.21,3.26-1.81.05-.03.12-.06.17-.09.55-.3,1.1-.61,1.66-.92,1.1-.61,2.2-1.22,3.3-1.83,1.26-.7,2.52-1.4,3.78-2.1.02-.01.03-.02.05-.03,1.15-.63,2.3-1.28,3.45-1.92,2.91-1.63,5.83-3.25,8.73-4.87,19.37-10.81,38.35-21.38,55.87-30.9,19.24-10.43,34.92-19.03,51.78-27.15,10.31-4.95,21.08-9.71,33.38-14.6,8.05-3.19,12.31-4.63,13.5-4.63,2.25,0-6.71,5.23-21.84,13.47-10.87,5.93-18.38,9.63-25.04,12.93-7.2,3.59-13.43,6.7-21.83,11.64-6.76,3.97-13.06,7.82-18.16,11.14l-.03.02-.14.09c-2.69,1.76-5.03,3.36-6.93,4.75-1.52,1.12-2.37,2.44-2.75,4.34-.15.73-.23,1.55-.26,2.48v1.22c-.04,2.13-.16,4.28-.39,6.44-3.09,28.53-23.59,50.94-49.78,57.79-1.27.32-2.55.62-3.84.88-.01,0-.03.01-.04.01-1.42.28-2.85.51-4.3.71-1.27.17-2.54.3-3.83.39-.65.06-1.3.09-1.95.12-.58.02-1.18.04-1.77.04-.39.02-.78.02-1.17.02-.9,0-1.8-.02-2.7-.06-1.08-.04-2.16-.11-3.24-.21-.44-.03-.9-.08-1.35-.13,0,0-.25-.03-.7-.09-.32-.04-.63-.1-.94-.14-4.3-.65-16.1-2.85-23.81-8.24l-32.24,20.66h-.02l7.34,41.93h82.22l-8.74-23.95c1.25-.21,2.49-.44,3.73-.69,1.4-.29,2.8-.6,4.19-.96.02,0,.04,0,.06-.01,1.26-.32,2.52-.66,3.76-1.03,29.81-8.74,54.2-31.37,64.82-61.14,1.16-3.22,2.14-6.52,2.96-9.9,1-4.12,1.73-8.35,2.2-12.67.23-2.06.38-4.08.47-6.14,12.99-12.64,31.32-25.8,48.08-37.48,24.6-17.18,45.83-31.19,41.84-35.76ZM239.07,131.17c-1.19.62-2.35,1.24-3.49,1.85-.01.01-.03.01-.04.02-1.3.67-2.56,1.34-3.82,1.97-1.14.59-2.25,1.15-3.35,1.71-.49.24-.98.49-1.47.73-.07.03-.15.07-.22.11-1.06.51-2.09,1-3.11,1.48-.93.43-1.85.85-2.76,1.26-1.49.68-2.94,1.31-4.35,1.9-11.91,4.95-21.45,7.29-28.52,7.29-2.76,0-5.14-.36-7.13-1.06-4.77-10.54-6.85-22.43-5.52-34.76,1.9-17.57,10.4-32.8,22.77-43.52.82-.72,1.65-1.41,2.5-2.06.2-.17.41-.33.61-.48.51-.4,1.03-.78,1.56-1.16.31-.22.62-.45.93-.67.74-.51,1.5-1.01,2.26-1.5,1.22-.78,2.46-1.52,3.73-2.22.01-.02.03-.02.04-.03,1.15-.63,2.31-1.23,3.5-1.79,8.79-4.2,18.56-6.52,28.77-6.52,2.41,0,4.84.12,7.28.4,25.08,2.7,45.43,18.87,54.65,40.54-25.41,14.06-47.07,26.97-64.82,36.51Z" };
  function markPaths(){ return '<path class="lg-a" style="--i:0" d="' + MARK.a + '"/><path class="lg-planet" style="--i:1" d="' + MARK.planet + '"/><path class="lg-b" style="--i:2" d="' + MARK.b + '"/>'; }
  function markSVG(o){
    o = o || {};
    var grid = o.grid ? '<g class="lg-grid" fill="none">' +
      '<path class="lg-g" d="M-24 0H514M-24 241.75H514M-24 121H514"/>' +
      '<circle class="lg-g" cx="240" cy="121" r="98"/><circle class="lg-g" cx="240" cy="121" r="68"/>' +
      '<path class="lg-g" d="M45 198L435 44"/><path class="lg-g" d="M-12 272L104 -30"/><path class="lg-g" d="M240 -24V266"/></g>' : '';
    var dims = o.dims ? '<g class="lg-d">' +
      '<text x="-22" y="-8">CAP 241.75</text><text x="352" y="-8">⌀ 196 · CORE 136</text><text class="is-hot" x="392" y="30">RING 21.5°</text><text x="-22" y="115">MIDLINE</text></g>' : '';
    return '<svg class="' + (o.cls || 'ab_mark') + '" viewBox="' + (o.grid ? '-30 -30 550 302' : '0 0 490.16 241.75') + '" aria-hidden="true" focusable="false">' +
      grid + dims + '<g class="lg-m">' + markPaths() + '</g></svg>';
  }
  Object.assign(AB, { MARK: MARK, markSVG: markSVG });

  /* ===== core/22-logo.js ===== */
  /* ---------- logo: the AB monogram is inlined (from logo/ab-logo.svg) so it can draw itself ----------
     Nav + footer links carry the Webflow Image (.ab_logo-img, the no-JS fallback); this swaps in the SVG.
     The outline warps in (spins in from a point), fills, then a slow glow pulse (all CSS, see ab-core.css "logo"); hover pulls the letters
     toward the planet like a small black hole. The footer copy draws when it scrolls into view. */
  (function(){
    function svg(){ return markSVG({ cls: 'ab_logo-svg' }); }
    $$('.ab_nav_logo').forEach(function(a){
      var img = $('img', a); if (!img || $('.ab_logo-svg', a)) return;
      img.insertAdjacentHTML('beforebegin', svg()); img.style.display = 'none';
      var s = $('.ab_logo-svg', a);
      $$('path', s).forEach(function(p){ var L = p.getTotalLength ? Math.ceil(p.getTotalLength()) : 2000; p.style.setProperty('--len', L); });
      if (reduce) return;
      var inFooter = !!a.closest('footer, .ab_footer_brand');
      if (!inFooter || !('IntersectionObserver' in window)){ s.classList.add('is-draw'); return; }
      var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ s.classList.add('is-draw'); io.disconnect(); } }, { threshold: .6 });
      io.observe(a);
    });
  })();

  /* ===== core/30-motion.js ===== */

  /* ---------- lenis (smooth scroll on the GSAP ticker) ---------- */
  var lenis = null;
  if (hasGsap && !reduce && window.Lenis){
    lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToTarget(t){
    if (lenis) lenis.scrollTo(t, { offset: -70, immediate: true });
    else if (typeof t === 'number') window.scrollTo(0, t);
    else t.scrollIntoView();
    if (window.ScrollTrigger) ScrollTrigger.update();
  }
  // same-page anchors (#work, /#launch on Home): warp, then jump. stopPropagation keeps Webflow's own smooth scroll out of it
  $$('a[href*="#"]').forEach(function(a){
    if (a.hasAttribute('data-board-frame') || a.hasAttribute('data-social') || a.hasAttribute('data-copy-email')) return;
    var raw = a.getAttribute('href') || '';
    if (a.hash.length < 2 || a.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || !/^(\/?#|\/[^#]*#)/.test(raw)) return;
    a.addEventListener('click', function(e){
      var id = decodeURIComponent(a.hash.slice(1)), t = document.getElementById(id); if (!t) return;
      e.preventDefault(); e.stopPropagation();
      var top = id === 'top';
      warp(function(){ scrollToTarget(top ? 0 : t); });
    });
  });

  // links to another page on the site warp out first (same effect as Return to orbit). Handlers that already
  // took the click (board frames, cards, the next card) call AB.go themselves; data-no-warp opts a link out
  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var raw = a.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#' || /^(mailto|tel|javascript|sms):/i.test(raw)) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-warp') || a.origin !== location.origin) return;
    if (a.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && a.search === location.search) return;
    e.preventDefault();
    AB.go(a.href);
  });

  function nudge(el, after){
    el.addEventListener('keydown', function(e){
      var m = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
      if (!m || !hasGsap) return; e.preventDefault();
      gsap.to(el, { x: '+=' + m[0], y: '+=' + m[1], duration: .25, ease: 'power2.out', onComplete: after });
    });
  }
  Object.assign(AB, { lenis: lenis, scrollToTarget: scrollToTarget, nudge: nudge });

  (function(){
    if (!hasGsap) return;

    /* ---------- nav hide on scroll ---------- */
    var nav = $('#nav'), lastY = 0;
    if (nav) addEventListener('scroll', function(){
      var y = scrollY;
      var ms = window.__abMissionST, inPin = ms && y >= ms.start - 10 && y <= ms.end + 10;
      nav.classList.toggle('is-hidden', !inPin && y > 300 && y > lastY + 4);
      if (inPin) nav.classList.remove('is-hidden');
      if (y < lastY - 4 || y < 300) nav.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });

    /* ---------- nav: mark the section in view ---------- */
    $$('.ab_nav_link').forEach(function(a){
      if (a.hash.length < 2 || a.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) return;
      var sec = document.getElementById(a.hash.slice(1)); if (!sec) return;
      ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: function(self){ a.classList.toggle('is-active', self.isActive); } });
    });

    /* ---------- scramble + magnetic ---------- */
    $$('[data-scramble]').forEach(function(a){
      var txt = a.textContent;
      a.addEventListener('mouseenter', function(){ if (!reduce) gsap.to(a, { duration: .6, scrambleText: { text: txt, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#_/', speed: .6 } }); });
    });
    if (!coarse && !reduce){
      $$('[data-magnetic]').forEach(function(el){
        var qx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
        el.addEventListener('pointermove', function(e){ var r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
        el.addEventListener('pointerleave', function(){ qx(0); qy(0); });
      });
    }

    /* ---------- planets: parallax (data-parallax = px of travel) ---------- */
    if (!reduce) $$('.ab_planet[data-parallax]').forEach(function(p){
      gsap.to(p, { y: num(p.getAttribute('data-parallax'), -80) * (innerWidth < 768 ? .3 : 1), ease: 'none', scrollTrigger: { trigger: p.closest('section') || p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---------- planets: idle float + bounce that reacts to scroll speed ---------- */
    if (!reduce){
      var bouncers = [];
      planets.forEach(function(p, i){
        if (p.closest('.ab_planner_viz')) return;
        var tries = 0;
        (function hook(){
          if (!p.__body){ if (tries++ < 60) setTimeout(hook, 100); return; }
          var b = p.__body, size = p.getBoundingClientRect().width || 100, weight = gsap.utils.clamp(.45, 1.6, 140 / size);
          gsap.to(b, { yPercent: gsap.utils.random(-3, 3), rotation: gsap.utils.random(-2, 2), duration: gsap.utils.random(3, 5.5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .3 });
          bouncers.push({ w: weight, qy: gsap.quickTo(b, 'y', { duration: 1.3, ease: 'elastic.out(1, 0.32)' }), qs: gsap.quickTo(b, 'scaleY', { duration: 1, ease: 'elastic.out(1, 0.4)' }), qx: gsap.quickTo(b, 'scaleX', { duration: 1, ease: 'elastic.out(1, 0.4)' }), last: 0 });
        })();
      });
      var lastScroll = scrollY, vel = 0;
      gsap.ticker.add(function(){
        var v = lenis ? lenis.velocity : (scrollY - lastScroll); lastScroll = scrollY;
        vel += (v - vel) * .25;
        bouncers.forEach(function(b){
          var ty = gsap.utils.clamp(-46, 46, -vel * 2.4 * b.w);
          if (Math.abs(ty - b.last) < .4) return; b.last = ty;
          var sq = Math.min(.07, Math.abs(vel) * .0025 * b.w);
          b.qy(ty); b.qs(1 - sq); b.qx(1 + sq * .6);
        });
      });
    }

    /* ---------- reveals ([data-split] headings, .t-signal scramble) ---------- */
    if (!reduce){
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function(){
        $$('[data-split]').forEach(function(el){
          var split = SplitText.create(el, { type: 'lines', mask: 'lines' });
          gsap.from(split.lines, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: function(){ split.revert(); decorate(el); } });
        });
        ScrollTrigger.refresh();
      });
      $$('.t-signal').forEach(function(el){
        var txt = el.textContent;
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function(){ gsap.fromTo(el, { scrambleText: { text: '', chars: '' } }, { duration: 1.4, scrambleText: { text: txt, chars: '░▒▓<>/_#', revealDelay: .2, speed: .5 } }); } });
      });
    } else decorate(document);

    /* ---------- metric icons ([data-metric-icon] on a metric: code | clock | cup), drawn in the signal color ---------- */
    var MICON = {
      code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
      cup: '<path d="M4 9h12v5a6 6 0 0 1-6 6a6 6 0 0 1-6-6z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 2.5c-1 1.2 1 2.3 0 3.5M12 2.5c-1 1.2 1 2.3 0 3.5"/>'
    };
    $$('[data-metric-icon]').forEach(function(m){
      var k = m.getAttribute('data-metric-icon'); if (!MICON[k] || $('.ab_metric_icon', m)) return;
      m.insertAdjacentHTML('afterbegin', '<span class="ab_metric_icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + MICON[k] + '</svg></span>');
      if (reduce) return;
      var ps = $$('.ab_metric_icon path, .ab_metric_icon circle', m);
      ps.forEach(function(p){ var L = p.getTotalLength ? p.getTotalLength() : 60; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      ScrollTrigger.create({ trigger: m, start: 'top 90%', once: true, onEnter: function(){ gsap.to(ps, { strokeDashoffset: 0, duration: 1.2, stagger: .15, ease: 'power2.inOut' }); } });
    });

    /* ---------- metrics ([data-count]) ---------- */
    $$('[data-count]').forEach(function(el){
      var o = { v: 0 };
      if (reduce) return;
      // target read on enter: page bundles may update data-count after this runs (Work sets it from the CMS list)
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function(){
        var raw = el.getAttribute('data-count'); if (raw == null || raw === '' || isNaN(+raw)) return;
        var target = +raw, suf = el.getAttribute('data-suffix') || '';
        gsap.fromTo(o, { v: 0 }, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: function(){ var n = Math.round(o.v); el.textContent = (target >= 1000 ? n.toLocaleString('en-US') : n) + suf; } });
      } });
    });

    /* ---------- FAQ: eased open / close, one open at a time ---------- */
    (function(){
      var items = $$('.ab_faq_item'), refreshT;
      function refresh(){ clearTimeout(refreshT); refreshT = setTimeout(function(){ ScrollTrigger.refresh(); }, 60); }
      function close(d){
        var a = $('.ab_faq_answer', d); d.classList.remove('is-open');
        if (reduce || !a){ d.open = false; refresh(); return; }
        gsap.to(a, { height: 0, opacity: 0, paddingBottom: 0, duration: .45, ease: 'power3.inOut', overwrite: true,
          onComplete: function(){ d.open = false; gsap.set(a, { clearProps: 'height,opacity,paddingBottom' }); refresh(); } });
      }
      function open(d){
        var a = $('.ab_faq_answer', d); d.open = true; d.classList.add('is-open');
        if (reduce || !a){ refresh(); return; }
        gsap.set(a, { clearProps: 'height,paddingBottom,opacity' });
        var H = a.getBoundingClientRect().height;
        gsap.fromTo(a, { height: 0, opacity: 0, paddingBottom: 0 }, { height: H, opacity: 1, paddingBottom: 26, duration: .6, ease: 'power3.out', overwrite: true,
          onComplete: function(){ gsap.set(a, { clearProps: 'height,paddingBottom' }); refresh(); } });
        gsap.fromTo(a, { y: -8 }, { y: 0, duration: .6, ease: 'power3.out' });
      }
      items.forEach(function(d){
        var s = $('.ab_faq_summary', d); if (!s) return;
        s.addEventListener('click', function(e){
          e.preventDefault();
          if (d.classList.contains('is-open')) close(d);
          else { items.forEach(function(o){ if (o !== d && o.classList.contains('is-open')) close(o); }); open(d); }
        });
      });
    })();

    /* ---------- light sections: smooth arc on the top and bottom edge ---------- */
    function arcClip(bg){
      var W = bg.offsetWidth, H = bg.offsetHeight, a = Math.max(24, Math.min(80, W * .05));
      bg.style.clipPath = "path('M0 " + a + " Q " + W / 2 + " " + (-a) + " " + W + " " + a + " L " + W + " " + (H - a) + " Q " + W / 2 + " " + (H + a) + " 0 " + (H - a) + " Z')";
    }
    /* ---------- light sections: dot field that reacts to the cursor ---------- */
    $$('.ab_light-bg').forEach(function(bg){
      arcClip(bg); if (window.ResizeObserver) new ResizeObserver(function(){ arcClip(bg); }).observe(bg);
      var c = document.createElement('canvas'); bg.appendChild(c);
      var ctx = c.getContext('2d'), W, H, dots = [], GAP = 24, mx = -9999, my = -9999, vis = false, live = 0, ripples = [];
      function size(){ W = bg.offsetWidth; H = bg.offsetHeight; c.width = W; c.height = H; dots = []; for (var y = GAP / 2; y < H; y += GAP) for (var x = GAP / 2; x < W; x += GAP) dots.push({ x: x, y: y, ox: 0, oy: 0, s: 0 }); draw(); }
      function draw(){
        ctx.clearRect(0, 0, W, H); var R = 170, moving = false, now = performance.now();
        ripples = ripples.filter(function(rp){ return now - rp.t < 1600; }); if (ripples.length) moving = true;
        for (var i = 0; i < dots.length; i++){
          var d = dots[i], dx = d.x - mx, dy = d.y - my, tx = 0, ty = 0, ts = 0;
          if (dx > -R && dx < R && dy > -R && dy < R){ var dist = Math.sqrt(dx * dx + dy * dy); if (dist < R){ var f = 1 - dist / R, push = f * f * 24; tx = dx / (dist || 1) * push; ty = dy / (dist || 1) * push; ts = f; } }
          for (var q = 0; q < ripples.length; q++){ var rp = ripples[q], age = now - rp.t, RR = age * .8, rdx = d.x - rp.x, rdy = d.y - rp.y, dd = Math.sqrt(rdx * rdx + rdy * rdy), del = dd - RR;
            if (del > -70 && del < 70){ var kk = (1 - Math.abs(del) / 70) * (1 - age / 1600); tx += rdx / (dd || 1) * kk * 18; ty += rdy / (dd || 1) * kk * 18; if (kk > ts) ts = kk; } }
          if (d.s > .001 || ts){
            d.ox += (tx - d.ox) * .32; d.oy += (ty - d.oy) * .32; d.s += (ts - d.s) * .32; // .14 trailed the cursor
            if (Math.abs(d.ox - tx) > .05 || Math.abs(d.s - ts) > .005) moving = true;
          }
          var r = 1.2 + d.s * 2.6;
          ctx.fillStyle = d.s > .03 ? 'rgba(255,106,61,' + (.2 + d.s * .7).toFixed(3) + ')' : 'rgba(11,12,20,.14)';
          ctx.fillRect(d.x + d.ox - r / 2, d.y + d.oy - r / 2, r, r);
        }
        return moving;
      }
      function loop(){ if (!vis){ live = 0; return; } var m = draw(); if (m || live > 0){ live--; requestAnimationFrame(loop); } else live = 0; }
      function kick(){ var was = live; live = 20; if (was <= 0) requestAnimationFrame(loop); }
      bg.__ripple = function(cx, cy){ if (reduce) return; var r = bg.getBoundingClientRect(); ripples.push({ x: cx - r.left, y: cy - r.top, t: performance.now() }); kick(); live = 100; };
      size(); addEventListener('resize', size);
      onView(bg.parentNode, function(x){ vis = x; if (!x){ mx = my = -9999; } });
      if (!reduce && !coarse){
        var lastE = null;
        var track = function(e){
          if (!vis || !e) return;
          var r = bg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, a = -(gsap.getProperty(bg, 'rotation') || 0) * Math.PI / 180;
          var px = e.clientX - cx, py = e.clientY - cy;
          mx = px * Math.cos(a) - py * Math.sin(a) + W / 2; my = px * Math.sin(a) + py * Math.cos(a) + H / 2; kick();
        };
        addEventListener('pointermove', function(e){ lastE = e; track(e); }, { passive: true });
        bg.parentNode.addEventListener('pointerleave', function(){ mx = my = -9999; kick(); });
        addEventListener('scroll', function(){ track(lastE); }, { passive: true });
      }
    });

    /* ---------- click pulse in empty space ---------- */
    if (!reduce){
      var NOPULSE = 'a,button,input,textarea,select,label,details,[role="button"],form,.ab_bento-card,.ab_board_component,.ab_stack_chip,.ab_planet,.ab_hero_badge,.ab_hero_sat,[data-drag],.ab_process_panel,.ab_process_traj,.ab_quote,.wl,.ab_nav_component,.ab_stack_readout,.ab_hero_title .w';
      document.addEventListener(coarse ? 'click' : 'pointerdown', function(e){
        if (e.button !== 0 || (e.target.closest && e.target.closest(NOPULSE))) return;
        ['a', 'b', 'c'].forEach(function(k){ var r = document.createElement('span'); r.className = 'cpulse ' + k; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(function(){ r.remove(); }, 1300); });
        var d = document.createElement('span'); d.className = 'cpulse-dot'; d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 600);
        var lsec = e.target.closest && e.target.closest('.theme-light'); if (lsec){ var lb = $('.ab_light-bg', lsec); if (lb && lb.__ripple) lb.__ripple(e.clientX, e.clientY); }
      });
    }
  })();

  /* ===== core/32-cards.js ===== */
  /* ---------- bento cards site-wide: orange cursor spotlight (ab-core.css .ab_bento-card::before reads --mx/--my)
     + a gentle 3D tilt. One place for every bento (Home services, Services "What's included", Mission manifest, About).
     No tilt while a button is held, over draggable bits (.mf-tag, planets), or on a card marked [data-no-tilt]. ---------- */
  function cardFx(c){
    if (!c || c.__fx) return; c.__fx = true;
    c.addEventListener('pointermove', function(e){
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
      if (reduce || !hasGsap || coarse || e.buttons || c.hasAttribute('data-no-tilt')) return;
      if (e.target.closest && e.target.closest('.mf-tag, .ab_planet')) return;
      gsap.to(c, { rotationY: (x - .5) * 5, rotationX: (.5 - y) * 5, transformPerspective: 1000, duration: .5, ease: 'power2.out', overwrite: 'auto' });
    });
    c.addEventListener('pointerleave', function(){ if (hasGsap) gsap.to(c, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)', overwrite: 'auto' }); });
    c.addEventListener('pointerdown', function(){ if (hasGsap) gsap.to(c, { rotationY: 0, rotationX: 0, duration: .3, overwrite: 'auto' }); });
  }
  $$('.ab_bento-card').forEach(cardFx);
  Object.assign(AB, { cardFx: cardFx });

  /* ===== core/35-orbit.js ===== */

  /* ---------- tool logos (Simple Icons, CC0 · 24×24 paths), keyed by the lowercased CMS tool name ---------- */
  // Tools without an entry (Client-First, Lenis, Unicorn Studio…) fall back to the generic Icon option.
  var LOGOS = {
    'figma': 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z',
    'd3': 'M13.312 12C13.312 5.718 8.22.625 1.937.625H0v5h1.938c3.521 0 6.375 2.854 6.375 6.375s-2.854 6.375-6.375 6.375H0v5h1.938c6.281 0 11.374-5.093 11.374-11.375zM24 7.563C24 3.731 20.893.625 17.062.625h-8a13.4154 13.4154 0 0 1 4.686 5h3.314c1.069 0 1.938.868 1.938 1.938 0 1.07-.869 1.938-1.938 1.938h-1.938c.313 1.652.313 3.348 0 5h1.938c1.068 0 1.938.867 1.938 1.938s-.869 1.938-1.938 1.938h-3.314a13.4154 13.4154 0 0 1-4.686 5h8c1.621 0 3.191-.568 4.438-1.605 2.943-2.45 3.346-6.824.895-9.77A6.9459 6.9459 0 0 0 24 7.563z',
    'github': 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    'three.js': 'M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z',
    'gsap': 'M9.83,7.59C10.647,7.595 11.267,7.828 11.672,8.282C12.055,8.713 12.239,9.336 12.219,10.132L12.205,10.193C12.197,10.211 12.185,10.229 12.17,10.243C12.14,10.272 12.099,10.288 12.057,10.288L10.398,10.288C10.29,10.288 10.199,10.2 10.199,10.093C10.199,9.669 10.071,9.435 9.809,9.383L9.689,9.372C9.347,9.372 9.125,9.583 9.119,9.951C9.112,10.361 9.344,10.734 10.004,11.374C10.872,12.19 11.221,12.913 11.204,13.867C11.177,15.411 10.127,16.41 8.531,16.41C7.716,16.41 7.093,16.191 6.678,15.761C6.258,15.324 6.066,14.683 6.106,13.855C6.108,13.813 6.125,13.772 6.155,13.743C6.185,13.714 6.226,13.698 6.267,13.698L7.983,13.698C8.007,13.699 8.03,13.705 8.052,13.715C8.073,13.726 8.092,13.741 8.107,13.76C8.12,13.775 8.129,13.793 8.135,13.813C8.14,13.832 8.141,13.853 8.137,13.873C8.118,14.171 8.171,14.394 8.288,14.518C8.363,14.598 8.469,14.639 8.599,14.639C8.916,14.639 9.102,14.414 9.109,14.024C9.115,13.687 9.007,13.39 8.427,12.792C7.676,12.058 7.003,11.3 7.024,10.108C7.037,9.416 7.311,8.784 7.798,8.327C8.312,7.845 9.014,7.59 9.83,7.59ZM4.047,7.618C4.794,7.612 5.381,7.842 5.789,8.303C6.221,8.79 6.44,9.524 6.441,10.485C6.44,10.527 6.422,10.567 6.392,10.597C6.362,10.626 6.322,10.643 6.28,10.643L4.479,10.643C4.448,10.642 4.417,10.629 4.395,10.607C4.373,10.584 4.361,10.553 4.36,10.522C4.346,9.899 4.172,9.576 3.828,9.538L3.757,9.534C3.067,9.535 2.66,10.472 2.444,10.992C2.142,11.719 1.988,12.507 2.018,13.293C2.033,13.659 2.092,14.173 2.438,14.386C2.746,14.575 3.185,14.45 3.451,14.24C3.716,14.031 3.93,13.669 4.02,13.339C4.033,13.293 4.033,13.258 4.021,13.241C4.015,13.233 4.003,13.229 3.989,13.226L3.485,13.222C3.461,13.222 3.436,13.216 3.414,13.206C3.392,13.196 3.372,13.181 3.356,13.162C3.344,13.148 3.335,13.13 3.331,13.112C3.327,13.093 3.327,13.074 3.331,13.056L3.647,11.682C3.663,11.611 3.726,11.558 3.804,11.548L3.804,11.545L6.839,11.545C6.846,11.545 6.854,11.545 6.86,11.546C6.939,11.556 6.995,11.63 6.994,11.71L6.994,11.714L6.678,13.085C6.661,13.163 6.583,13.22 6.494,13.22L6.113,13.22C6.1,13.22 6.086,13.225 6.075,13.233C6.064,13.241 6.056,13.253 6.052,13.266C5.7,14.46 5.223,15.282 4.594,15.775C4.058,16.195 3.399,16.391 2.517,16.391C1.725,16.391 1.191,16.136 0.738,15.633C0.14,14.967 -0.107,13.879 0.043,12.566C0.313,10.103 1.589,7.618 4.047,7.618ZM21.016,7.75C23.026,7.75 24.03,8.662 23.999,10.461C23.962,12.569 22.678,14.119 20.745,14.477C20.47,14.527 20.191,14.547 19.912,14.545L18.978,14.541C18.963,14.541 18.948,14.547 18.937,14.558C18.926,14.568 18.92,14.583 18.92,14.598C18.92,14.608 18.922,14.618 18.928,14.627C18.933,14.636 18.941,14.643 18.95,14.648L19.744,15.062C19.809,15.096 19.835,15.153 19.82,15.226C19.815,15.249 19.618,16.139 19.613,16.159C19.596,16.237 19.533,16.282 19.442,16.282L17.739,16.282C17.715,16.282 17.69,16.277 17.668,16.267C17.646,16.257 17.626,16.241 17.61,16.223C17.598,16.208 17.589,16.191 17.585,16.173C17.58,16.155 17.581,16.135 17.585,16.116L19.481,7.875C19.5,7.789 19.581,7.751 19.653,7.751L21.016,7.75ZM17.273,7.762C17.292,7.77 17.31,7.781 17.324,7.795C17.338,7.81 17.351,7.828 17.358,7.847C17.366,7.866 17.369,7.886 17.369,7.906L17.358,16.119C17.361,16.138 17.36,16.158 17.355,16.177C17.35,16.196 17.34,16.213 17.328,16.228C17.313,16.245 17.295,16.259 17.274,16.268C17.254,16.277 17.232,16.282 17.21,16.281L15.397,16.281C15.377,16.282 15.356,16.277 15.337,16.27C15.318,16.262 15.3,16.25 15.286,16.236C15.272,16.221 15.26,16.204 15.253,16.185C15.245,16.166 15.241,16.146 15.241,16.125L15.28,15.328C15.282,15.241 15.28,15.217 15.229,15.211L15.161,15.209L13.447,15.209C13.323,15.209 13.314,15.22 13.27,15.334L12.914,16.191C12.882,16.252 12.818,16.281 12.722,16.281L10.927,16.281C10.818,16.281 10.74,16.173 10.781,16.072L14.499,7.873C14.524,7.824 14.562,7.75 14.648,7.75L17.214,7.75C17.234,7.75 17.254,7.754 17.273,7.762ZM15.5,9.985C15.492,9.953 15.466,9.956 15.445,9.998C15.43,10.028 15.416,10.06 15.405,10.091L14.121,13.274C14.114,13.294 14.109,13.31 14.105,13.322C14.104,13.328 14.103,13.335 14.104,13.341C14.105,13.347 14.108,13.353 14.111,13.358C14.115,13.363 14.12,13.367 14.126,13.37C14.131,13.373 14.137,13.376 14.143,13.376L15.215,13.39C15.334,13.38 15.34,13.374 15.352,13.253C15.354,13.21 15.506,10.022 15.5,9.985ZM20.112,9.582C20.097,9.582 20.083,9.588 20.072,9.599C20.061,9.609 20.055,9.624 20.054,9.639C20.054,9.649 20.057,9.659 20.062,9.668C20.068,9.677 20.075,9.685 20.084,9.69C20.097,9.697 20.869,10.104 20.926,10.135C20.968,10.158 20.969,10.198 20.955,10.267C20.948,10.298 20.415,12.642 20.416,12.644C20.419,12.647 20.435,12.655 20.515,12.655L20.551,12.655C21.446,12.619 21.934,11.561 21.952,10.534C21.961,9.979 21.772,9.638 21.429,9.588L21.358,9.582L20.112,9.582Z',
    'webflow': 'm24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z',
    'webflow cms': 'm24 4.515-7.658 14.97H9.149l3.205-6.204h-.144C9.566 16.713 5.621 18.973 0 19.485v-6.118s3.596-.213 5.71-2.435H0V4.515h6.417v5.278l.144-.001 2.622-5.277h4.854v5.244h.144l2.72-5.244H24Z',
    'claude': 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
    // Finsweet has no Simple Icons entry: its {F mark, drawn to match
    'finsweet': 'M9 4.5C7.1 4.5 6 5.5 6 7.4v2.2c0 .9-.4 1.4-1.4 1.4H4v2h.6c1 0 1.4.5 1.4 1.4v2.2c0 1.9 1.1 2.9 3 2.9h.6v-2h-.4c-.8 0-1.1-.4-1.1-1.2v-2.2c0-1.1-.5-1.9-1.4-2.1.9-.2 1.4-1 1.4-2.1V7.7c0-.8.3-1.2 1.1-1.2h.4v-2zM12.5 5H20v2.6h-4.7v3.2h4.2v2.6h-4.2V19h-2.8z',
    'photoshop': 'M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z',
    'illustrator': 'M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z',
    'lightroom': 'M19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-6.99 16.389c0 .051-.029.09-.06.121-.03.02-.06.029-.101.029H6.26c-.11 0-.16-.061-.16-.18V6.44c-.01-.07.04-.13.11-.14h2c.05-.01.11.03.11.08v8.43h4.62c.101 0 .131.049.11.14l-.29 1.739zm6.25-7.859v1.95c0 .08-.05.11-.16.11-.649-.04-1.3.08-1.89.34-.2.09-.39.21-.54.37v5.1c0 .1-.04.14-.13.14h-1.95c-.08.01-.15-.04-.16-.119V11.14c0-.24 0-.49-.01-.75s-.01-.52-.02-.78c-.01-.22-.03-.44-.061-.66-.01-.05.02-.1.07-.11.01-.01.02-.01.04 0h1.75c.1 0 .18.07.21.16.04.07.07.15.08.23.02.1.039.21.05.31.01.11.021.23.021.36.299-.35.66-.64 1.069-.86.46-.25.97-.37 1.49-.36.069-.01.13.04.14.11.001.01.001.02.001.04z'
  };

  /* ---------- orbit: chips (.ab_stack_chip) on two rings around a planet; Home tools + Mission stack ---------- */
  function orbitSystem(orbit, readout){
    if (!orbit) return;
    var chips = $$('.ab_stack_chip', orbit); if (!chips.length) return;
    var ICONS = {
      layout: '<rect x="2" y="3" width="12" height="10"/><path d="M2 6h12M6 6v7"/>',
      motion: '<path d="M2 12c3 0 3-8 6-8s3 8 6 8"/>',
      scroll: '<rect x="5" y="2" width="6" height="12"/><path d="M8 5v3"/>',
      pen: '<path d="M3 13l2-6 5-4 3 3-4 5-6 2z"/><path d="M8.5 4.5l3 3"/>',
      cube: '<path d="M8 2l5 3v6l-5 3-5-3V5z"/><path d="M8 8l5-3M8 8L3 5M8 8v6"/>',
      chart: '<circle cx="4" cy="11" r="1.5"/><circle cx="8" cy="5" r="1.5"/><circle cx="12" cy="9" r="1.5"/><path d="M4.8 9.7l2.4-3.4M9.2 6l1.7 1.8"/>',
      tag: '<path d="M5 4L2 8l3 4M11 4l3 4-3 4M9.5 3L6.5 13"/>',
      spark: '<path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/>',
      branch: '<circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="5.5" r="1.5"/><path d="M4 5v6M12 7c0 2.5-3 3-7.5 4"/>'
    };
    function lum(hx){ var c = hex(hx); return (c[0] * .299 + c[1] * .587 + c[2] * .114) / 255; }
    // real brand logo when we have one (LOGOS, by tool name), else the generic Icon option
    function iconTile(c, extra){
      var color = c.__color, logo = LOGOS[c.__name.toLowerCase()], t = document.createElement('span');
      t.className = 'ci' + (logo ? ' is-logo' : '') + (extra ? ' ' + extra : ''); t.setAttribute('aria-hidden', 'true');
      t.style.setProperty('--tc', color); t.style.setProperty('--ti', lum(color) > .6 ? '#07080D' : '#ffffff');
      t.innerHTML = logo ? '<svg viewBox="0 0 24 24"><path d="' + logo + '"/></svg>' : '<svg viewBox="0 0 16 16">' + (ICONS[c.getAttribute('data-icon')] || ICONS.spark) + '</svg>';
      return t;
    }
    // the first ~40% (at least 4) ride the inner ring, the rest the outer (the CMS has no ring field)
    var nInner = chips.length <= 3 ? chips.length : Math.max(Math.min(4, chips.length), Math.round(chips.length * .4)), nRings = nInner < chips.length ? 2 : 1;
    chips.forEach(function(c, i){
      var cn = $('[data-field="color"]', c);
      c.__color = (cn && cn.style.backgroundColor && rgbToHex(getComputedStyle(cn).backgroundColor)) || '#FF6A3D';
      c.__ring = i < nInner ? 'inner' : 'outer';
      c.__name = c.getAttribute('data-name') || c.textContent.trim();
    });
    var rt = readout && $('.ab_stack_readout-text', readout); if (rt) rt.textContent = chips.length + ' tools · ' + nRings + ' orbit' + (nRings > 1 ? 's' : '');
    function showTool(c){
      if (!readout) return;
      var old = $('.ci, .ab_stack_ci', readout), t = iconTile(c, 'ab_stack_ci');
      if (old) old.parentNode.replaceChild(t, old);
      $('.ab_stack_readout-title', readout).textContent = c.__name;
      $('.ab_stack_readout-text', readout).textContent = (c.getAttribute('data-use') || '') + ' · ' + c.__ring + ' orbit';
      readout.style.borderColor = c.__color;
    }
    chips.forEach(function(c){
      c.style.setProperty('--tc', c.__color);
      c.insertBefore(iconTile(c), c.firstChild);
      c.setAttribute('aria-label', c.__name + ': ' + (c.getAttribute('data-use') || ''));
      ['pointerenter', 'focus', 'pointerdown'].forEach(function(ev){ c.addEventListener(ev, function(){ showTool(c); }); });
    });
    if (!hasGsap) return;
    var inner = chips.filter(function(c){ return c.__ring === 'inner'; }), outer = chips.filter(function(c){ return c.__ring === 'outer'; });
    var bodies = [];
    [inner, outer].forEach(function(set, ri){ set.forEach(function(c, i){ bodies.push({ el: c, ring: ri, a: (i / set.length) * Math.PI * 2 + ri * .4, sp: ri ? -0.00012 : 0.0002, mode: 'orbit' }); }); });
    function orbitPos(b){ var s = orbit.offsetWidth, rx = b.ring ? s * .46 : s * .30, ry = b.ring ? s * .415 : s * .27; return { x: Math.cos(b.a) * rx, y: Math.sin(b.a) * ry }; }
    bodies.forEach(function(b){
      gsap.set(b.el, { xPercent: -50, yPercent: -50 });
      var p = orbitPos(b); gsap.set(b.el, { x: p.x, y: p.y });
      if (window.Draggable) Draggable.create(b.el, { type: 'x,y', inertia: true, zIndexBoost: true,
        onPress: function(){ b.mode = 'held'; b.el.classList.add('is-held'); },
        onRelease: function(){ b.el.classList.remove('is-held'); if (!this.tween || !this.tween.isActive()) b.mode = 'return'; },
        onThrowComplete: function(){ b.mode = 'return'; } });
    });
    var orbitVisible = false;
    onView(orbit, function(x){ orbitVisible = x; });
    gsap.ticker.add(function(time, dt){
      if (!orbitVisible) return;
      bodies.forEach(function(b){
        if (!reduce) b.a += b.sp * dt;
        if (b.mode === 'held') return;
        var p = orbitPos(b);
        if (b.mode === 'return'){
          var cx = gsap.getProperty(b.el, 'x'), cy = gsap.getProperty(b.el, 'y'), nx = cx + (p.x - cx) * .06, ny = cy + (p.y - cy) * .06;
          gsap.set(b.el, { x: nx, y: ny });
          if (Math.abs(nx - p.x) < .8 && Math.abs(ny - p.y) < .8) b.mode = 'orbit';
        } else gsap.set(b.el, { x: p.x, y: p.y });
      });
    });
  }
  AB.orbit = orbitSystem;


  /* ===== core/36-missions.js ===== */
  /* ---------- mission cards (Work archive + Services related missions): covers, colors, number, status, link ----------
     The card markup is the Work page's Missions Collection item (.ab_mission-card); Services clones those cards from /work. */
  // cover art for missions without a cover image (cover kind Mark / Brand / App / Site)
  function coverHTML(m){
    var word = esc((m.name.split(/\s+/)[0] || '').toUpperCase()), rest = esc(m.name.split(/\s+/).slice(1).join(' '));
    if (m.kind === 'mark') return markSVG({ grid: true });
    if (m.kind === 'brand') return '<div class="cb-bag"><i></i><b>' + word + '</b><span>' + (rest ? rest + ' · ' : '') + 'Est. ' + esc(m.year) + '</span></div><div class="cb-bag two"><i></i><b>' + word + '</b><span>Single origin</span></div>';
    if (m.kind === 'app') return '<div class="ca-ph"><div class="ca-top"><b>Today</b><i></i></div><div class="ca-ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16"/></svg><span>12<small>day streak</small></span></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div></div><div class="ca-ph back"><div class="ca-top"><b>Classes</b></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div></div>';
    if (m.kind === 'site') return '<div class="cs-nav"><b>' + word + '</b><i></i><i></i><i></i></div><div class="cs-grid"><div class="cs-h">Buildings that<br>hold the light.</div><div class="cs-img"></div><div class="cs-img b"></div><div class="cs-img c"></div></div>';
    return '';
  }
  function cardTxt(sel, root){ var n = $(sel, root); return n ? n.textContent.trim() : ''; }
  function cardColor(node, prop){ return node ? rgbToHex(getComputedStyle(node)[prop]) : ''; }

  function missionCard(card, i){
    var a = $('[data-card-link]', card), cv = $('.ab_mission-card_cv', card), img = $('img', cv);
    var m = {
      el: card, a: a, cv: cv, i: i,
      slug: a.getAttribute('data-slug') || '', name: cardTxt('.ab_mission-card_title', card), client: cardTxt('.ab_mission-card_client', card),
      year: cardTxt('[data-card="year"]', card), status: a.getAttribute('data-status') || cardTxt('[data-card="status"]', card),
      kind: (a.getAttribute('data-cover-kind') || '').toLowerCase(),
      types: $$('.ab_mission-card_tag', card).map(function(t){ return t.textContent.trim(); }).filter(Boolean)
    };
    m.placeholder = /placeholder/i.test(m.status); m.live = /live/i.test(m.status);
    m.no = pad2(i + 1);
    // brand colors come from hidden nodes whose style is bound to the CMS Color fields in the Designer
    var bg = cardColor($('[data-field="brand-bg"]', card), 'backgroundColor'), fg = cardColor($('[data-field="brand-fg"]', card), 'color'), ac = cardColor($('[data-field="brand-accent"]', card), 'backgroundColor');
    cv.style.setProperty('--cbg', bg || '#161a2e'); cv.style.setProperty('--cfg', fg || '#F2F0EA'); cv.style.setProperty('--cac', ac || '#FF6A3D');
    // cover: the bound image when there is one, otherwise drawn from the cover kind
    var hasImg = img && img.getAttribute('src') && !/placeholder/i.test(img.getAttribute('src')) && !img.closest('.w-condition-invisible');
    if (hasImg){ m.kind = 'img'; img.alt = ''; }
    else { if (img) img.remove(); if (!m.kind || m.kind === 'image') m.kind = 'site'; cv.insertAdjacentHTML('beforeend', coverHTML(m)); }
    cv.classList.add('is-' + m.kind);
    // number, planet seed, status chip, link
    var no = $('.ab_mission-card_no', card); if (no) no.textContent = m.no;
    var pl = $('.ab_planet', card); if (pl){ pl.setAttribute('data-seed', i * 7 + 3); if (!pl.getAttribute('data-ring')) pl.removeAttribute('data-ring'); else pl.setAttribute('data-tilt', '-16'); if (!pl.getAttribute('data-glow')) pl.setAttribute('data-glow', 'transparent'); }
    var st = $('.ab_status', card); if (st) st.setAttribute('data-state', m.placeholder ? 'phd' : m.live ? 'live' : 'ship');
    card.setAttribute('data-types', m.types.join('|'));
    if (a.__sel){ var tag = $('.sel-tag', a.__sel); if (tag) tag.textContent = 'Frame / ' + m.slug; }
    if (m.placeholder){
      card.classList.add('is-ph'); a.setAttribute('href', '#'); a.setAttribute('data-ph', '');
      a.setAttribute('aria-label', m.name + ' (placeholder)');
      var go = $('.ab_mission-card_go', card); if (go) go.innerHTML = 'Debrief pending <span class="ab_mission-card_arrow" aria-hidden="true">→</span>';
    } else {
      a.setAttribute('href', '/work/' + m.slug); a.setAttribute('aria-label', m.name + ', open the mission debrief');
    }
    return m;
  }
  Object.assign(AB, { missionCard: missionCard });

  /* ===== core/37-code.js ===== */
  /* ---------- code blocks (CMS snippets on the Mission template systems/problems and the Services "under the hood"; one Copy handler site-wide) ---------- */
  function codeLang(c){ var t = c.trim(); if (t.charAt(0) === '<') return 'html'; if (/^(\/\*|:root|[.#@a-z][^{(=]*\{)/i.test(t) && !/function|var |=>/.test(t)) return 'css'; return 'js'; }
  function hl(code, lang){
    var re = lang === 'css' ? /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|vh|vw|rem|em|%|s|ms|fr)?)|(--[\w-]+|[a-z-]+(?=\s*:))|(@media|!important)/g
      : lang === 'html' ? /(<!--[\s\S]*?-->)|("[^"]*")|(\b\d+\.?\d*\b)|(<\/?[\w-]+|\/?>)|([\w-]+(?==))/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|(\b(?:var|function|return|if|else|for|new|true|false|null|this|typeof|continue|break)\b)|(\b(?:window|document|Math|Object)\b)/g;
    var out = '', last = 0, m, cls = ['c', 's', 'n', 'k', 'g'];
    while ((m = re.exec(code))){ out += esc(code.slice(last, m.index)); for (var g = 1; g <= 5; g++) if (m[g] != null){ out += '<i class="t-' + cls[g - 1] + '">' + esc(m[0]) + '</i>'; break; } last = re.lastIndex; }
    return out + esc(code.slice(last));
  }
  function codeBlock(code, label){ var lang = codeLang(code); return '<figure class="cb"><figcaption><span class="cb-l">' + lang.toUpperCase() + '</span><span class="cb-n">' + esc(label || 'excerpt') + '</span><button type="button" class="cb-copy">Copy</button></figcaption><pre><code>' + hl(code, lang) + '</code></pre></figure>'; }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.cb-copy'); if (!b) return;
    var t = b.closest('.cb').querySelector('code').textContent;
    function done(){ b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function(){ b.textContent = 'Copy'; b.classList.remove('ok'); }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, done); else done();
  });
  Object.assign(AB, { codeBlock: codeBlock });

  /* ===== core/38-next.js ===== */
  /* ---------- next cards (.ab_next-card): HUD corners, streaks, spotlight + tilt, a ship that flies to the planet on hover ---------- */
  var nextCount = 0;
  function nextCard(card){
    if (!card || card.__nx) return; card.__nx = true; var ci = nextCount++;
    // multi-word names break onto two balanced lines so the title never runs under the planet
    var tt = $('.ab_next-card_title', card);
    if (tt && !tt.children.length){
      var w = tt.textContent.trim().split(/\s+/);
      if (w.length > 1){
        var cut = 1, best = 1e9;
        for (var wi = 1; wi < w.length; wi++){ var dd = Math.abs(w.slice(0, wi).join(' ').length - w.slice(wi).join(' ').length); if (dd < best){ best = dd; cut = wi; } }
        tt.setAttribute('aria-label', w.join(' '));
        tt.innerHTML = esc(w.slice(0, cut).join(' ')) + '<br>' + esc(w.slice(cut).join(' '));
      }
    }
    var NS = 'http://www.w3.org/2000/svg', planet = $('.ab_planet', card), go = $('.ab_next-card_go', card);
    card.insertAdjacentHTML('afterbegin', '<span class="nx-grid" aria-hidden="true"></span><span class="nx-c tl" aria-hidden="true"></span><span class="nx-c tr" aria-hidden="true"></span><span class="nx-c bl" aria-hidden="true"></span><span class="nx-c br" aria-hidden="true"></span>' +
      '<span class="nx-hud" aria-hidden="true"><span>RA <b>' + (4 + ci * 3) + 'h ' + (21 + ci * 7) + 'm</b></span><span>DEC <b>+' + (12 + ci * 5) + '°</b></span><span>ETA <b class="nx-eta">T−00:10</b></span></span>' +
      '<span class="nx-streaks" aria-hidden="true">' + [8, 22, 35, 48, 61, 74, 88].map(function(t, i){ return '<i style="top:' + t + '%;--d:' + (0.7 + (i % 3) * .25) + 's;--dl:' + (i * .13).toFixed(2) + 's;width:' + (14 + (i % 4) * 6) + '%"></i>'; }).join('') + '</span>');
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'nx-svg'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path class="nx-path"/><path class="nx-done"/><g class="nx-ship"><path class="fl" d="M-11 -2.4 L-23 0 L-11 2.4 Z"/><rect x="-11" y="-4" width="16" height="8" fill="#F2F0EA"/><path d="M5 -4 L13 0 L5 4 Z" fill="#FF6A3D"/><path d="M-9.5 -4 L-6.4 -8.8 L-3.2 -4 Z M-9.5 4 L-6.4 8.8 L-3.2 4 Z" fill="#FF6A3D"/></g>';
    card.appendChild(svg);
    var path = $('.nx-path', svg), done = $('.nx-done', svg), ship = $('.nx-ship', svg), eta = $('.nx-eta', card), L = 0, tw = null;
    function layout(){
      if (!go) return;
      var r = card.getBoundingClientRect(), g = go.getBoundingClientRect(), pr = planet ? planet.getBoundingClientRect() : { left: r.right - 120, top: r.top + 40, width: 80, height: 80 };
      var x0 = g.right - r.left + 16, y0 = g.top - r.top + g.height / 2, x1 = pr.left - r.left + pr.width * .1, y1 = pr.top - r.top + pr.height * .5;
      svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
      var d = 'M' + x0 + ' ' + y0 + ' C ' + (x0 + (x1 - x0) * .35) + ' ' + (y0 + 40) + ', ' + (x0 + (x1 - x0) * .6) + ' ' + (y1 - 90) + ', ' + x1 + ' ' + y1;
      path.setAttribute('d', d); done.setAttribute('d', d); L = path.getTotalLength(); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L;
    }
    layout(); addEventListener('resize', layout); if (document.fonts) document.fonts.ready.then(layout);
    card.addEventListener('pointerenter', function(){
      layout(); if (!hasGsap || reduce) return;
      if (tw) tw.kill(); var o = { t: 0 };
      tw = gsap.timeline()
        .set(ship, { opacity: 1 })
        .to(o, { t: 1, duration: 1.6, ease: 'power2.inOut', onUpdate: function(){
          var p = path.getPointAtLength(o.t * L), q = path.getPointAtLength(Math.min(L, o.t * L + 2));
          ship.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI).toFixed(1) + ') scale(' + (1 - o.t * .4).toFixed(2) + ')');
          done.style.strokeDashoffset = L * (1 - o.t); eta.textContent = 'T−00:' + pad2(Math.max(0, Math.round(10 * (1 - o.t))));
        } })
        .to(ship, { opacity: 0, duration: .2 });
      if (planet) tw.to(planet, { scale: 1.08, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' }, '<');
    });
    card.addEventListener('pointerleave', function(){
      if (!hasGsap) return;
      if (tw) tw.kill(); gsap.set(ship, { opacity: 0 }); done.style.strokeDashoffset = L; eta.textContent = 'T−00:10';
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: .8, ease: 'elastic.out(1,.6)' });
      if (planet) gsap.to(planet, { x: 0, y: 0, duration: .8, ease: 'power3.out' });
    });
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%'); card.style.setProperty('--my', (y * 100) + '%');
      if (reduce || !hasGsap || coarse) return;
      gsap.to(card, { rotationY: (x - .5) * 4, rotationX: (.5 - y) * 4, transformPerspective: 1200, duration: .6, ease: 'power2.out' });
      if (planet) gsap.to(planet, { x: (x - .5) * 30, y: (y - .5) * 20, duration: .8, ease: 'power2.out' });
    });
  }
  $$('.ab_next-card').forEach(nextCard);
  AB.nextCard = nextCard; // page bundles call this for cards they build (Mission next-mission)

  /* ===== core/39-herodrag.js ===== */
  /* ---------- hero toys site-wide: on every page hero except Home (which has its own), the H1's words
     and the hero planet can be thrown around like Home's, and drift back after a few seconds.
     Runs after the page bundles (setTimeout 0), since Services rebuilds its title lines and Mission fills its own. ---------- */
  (function(){
    if (!hasGsap || !window.Draggable) return;
    setTimeout(function(){
      var hero = $('#hero'), title = $('#heroTitle');
      if (!hero || !title || $('.ab_hero_component') || title.hasAttribute('data-drag-ready')) return;
      title.setAttribute('data-drag-ready', '');
      if (!title.getAttribute('aria-label')) title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
      // Work + Services titles are lines of .ab_dbh_word (keep them whole: outline/star effects live on the line);
      // a plain title (Mission) is split into word spans
      var items = $$('.ab_dbh_word', title);
      if (!items.length){
        var words = title.textContent.trim().split(/\s+/); title.innerHTML = '';
        words.forEach(function(w, i){ var s = document.createElement('span'); s.className = 'w'; s.textContent = w; title.appendChild(s); if (i < words.length - 1) title.appendChild(document.createTextNode(' ')); });
        items = $$('.w', title);
      }
      items.forEach(function(el){ el.classList.add('is-toy'); el.setAttribute('aria-hidden', 'true'); el.tabIndex = 0; });
      var planet = $('.ab_planet[data-drag]', hero);
      if (planet && !planet.hasAttribute('data-parallax')) items.push(planet);
      items.forEach(function(el){
        var back;
        function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
        Draggable.create(el, { type: 'x,y', bounds: hero, inertia: !!window.InertiaPlugin, edgeResistance: .7, zIndexBoost: false,
          onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
          onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
          onDragEnd: schedule, onThrowComplete: schedule });
        nudge(el, schedule);
      });
      AB.dragCue({ host: title.parentNode, first: items[0], items: items });
    }, 0);
  })();

  /* ---------- drag cue (every hero with draggables): until something on THIS hero is dragged, the first draggable
     tugs and a "Drag me" hand chip points at it, 3 times, 10 s apart. One sessionStorage key per hero type
     (ab:toys:work|services|mission|about|404, Home keeps ab:dragged), so dragging on one page doesn't hide it on the others; per visit, so it comes back next time.
     opts: host (positioned box the chip sits in), first (element it points at), items (presses that end it),
     key (optional), at ('mid' default = over the first item, 'end' = at its right edge), tug (degrees). ---------- */
  function heroKind(){
    if ($('.section_lost')) return '404';
    var p = location.pathname.split('/').filter(Boolean);
    if (!p.length) return 'home';
    return p.length > 1 ? (p[0] === 'work' ? 'mission' : p[0]) : p[0];
  }
  AB.dragCue = function(o){
    var KEY = o.key || 'ab:toys:' + heroKind(), done = false, first = o.first, host = o.host;
    if (!hasGsap || !first || !host) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch (e){}
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var hint = document.createElement('div'); hint.className = 'ab_drag-hint'; hint.setAttribute('aria-hidden', 'true'); hint.style.opacity = 0;
    hint.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5v-1a1.5 1.5 0 0 1 3 0V12m0-6a1.5 1.5 0 0 1 3 0v6m0-3.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L3.4 15a1.6 1.6 0 0 1 2.6-1.9L8 15.5"/></svg><span>Drag me</span>';
    host.appendChild(hint);
    function stop(){
      if (done) return; done = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e){}
      gsap.killTweensOf(first, 'rotation'); gsap.killTweensOf(hint); gsap.set(first, { rotation: 0 });
      gsap.to(hint, { opacity: 0, duration: .3, onComplete: function(){ hint.remove(); } });
    }
    (o.items || [first]).forEach(function(el){ el.addEventListener('pointerdown', stop, { once: true }); });
    function place(){
      var c = host.getBoundingClientRect(), r = first.getBoundingClientRect();
      hint.style.left = (o.at === 'end' ? r.right - c.left - 10 : r.left - c.left + Math.min(r.width * .6, 220)) + 'px';
      hint.style.top = (r.top - c.top - (o.at === 'end' ? 6 : 30)) + 'px';
    }
    var shown = 0;
    function go(){
      if (done || shown++ >= 3) return;
      place();
      if (reduce){ gsap.set(hint, { opacity: 1 }); gsap.delayedCall(4, function(){ if (!done) gsap.to(hint, { opacity: 0, duration: .3 }); }); return; }
      gsap.timeline()
        .fromTo(hint, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' })
        .to(hint, { x: -6, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 3 }, '<.1')
        .to(first, { rotation: o.tug || -4, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 3, onComplete: function(){ if (!done) gsap.set(first, { rotation: 0 }); } }, '<')
        .to(hint, { opacity: 0, duration: .4 }, '+=1.6');
      gsap.delayedCall(10, go);
    }
    gsap.delayedCall(o.delay || 2.6, go);
    addEventListener('resize', function(){ if (!done) place(); });
    return { stop: stop };
  };

  /* ===== core/40-footer.js ===== */

  /* ---------- quotes: reserve the tallest quote's height so swapping never shifts the page ---------- */
  function reserve(el, texts, sizeByLength){
    if (!el || !texts.length) return;
    var c = el.cloneNode(false), max = 0; c.removeAttribute('id'); c.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;min-height:0;width:' + el.getBoundingClientRect().width + 'px';
    el.parentNode.appendChild(c);
    texts.forEach(function(t){ if (sizeByLength) c.classList.toggle('long', t.length > 80); c.textContent = t; max = Math.max(max, c.getBoundingClientRect().height); });
    c.remove(); el.style.minHeight = Math.ceil(max) + 'px';
  }
  function reserveAll(){ var qt = QUOTES.map(function(q){ return q.t; }); reserve($('#iqText'), qt, true); reserve($('#footQ'), qt); }
  reserveAll(); addEventListener('resize', reserveAll);
  if (document.fonts) document.fonts.ready.then(function(){ reserveAll(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });

  /* ---------- footer: rotating transmission, wordmark ---------- */
  (function(){
    var fq = $('#footQ'), fby = $('#footQBy'), fi = 0;
    function year(c){ var m = String(c).match(/(\d{4})\s*$/); return m ? m[1] : c; }
    if (fq && fby && QUOTES.length > 1) setInterval(function(){
      if (document.hidden) return;
      fi = (fi + 1) % QUOTES.length; var q = QUOTES[fi], by = q.a + ', ' + year(q.c);
      if (reduce || !hasGsap){ fq.textContent = q.t; fby.textContent = by; return; }
      gsap.to(fq, { duration: 1.4, scrambleText: { text: q.t, chars: '░▒▓<>/_#', speed: .6, revealDelay: .2 } });
      gsap.to(fby, { duration: .8, scrambleText: { text: by, chars: 'lowerCase', speed: .6 } });
    }, 9000);

    // wordmark: scale to fit the row; letters rise toward the cursor, click to launch one
    var wm = $('#wordmark'); if (!wm) return;
    function fitWM(){ wm.style.fontSize = '100px'; var p = wm.parentNode, r = p.clientWidth - parseFloat(getComputedStyle(p).paddingLeft) * 2; wm.style.fontSize = Math.min(200, 100 * r / wm.scrollWidth * .995) + 'px'; }
    var txt = wm.textContent.trim(); wm.setAttribute('aria-label', txt); wm.textContent = '';
    txt.split(/\s+/).forEach(function(word, wi, arr){
      var ws = document.createElement('span'); ws.className = 'wl-word';
      word.split('').forEach(function(ch){ var s = document.createElement('span'); s.className = 'wl'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch; ws.appendChild(s); });
      wm.appendChild(ws);
      if (wi < arr.length - 1){ var sp = document.createElement('span'); sp.className = 'wl-sp'; sp.innerHTML = '&nbsp;'; wm.appendChild(sp); }
    });
    fitWM(); addEventListener('resize', fitWM); if (document.fonts) document.fonts.ready.then(fitWM);
    addEventListener('load', function(){ fitWM(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    var letters = $$('.wl', wm);
    if (reduce || !hasGsap) return;
    var qy = letters.map(function(l){ return gsap.quickTo(l, 'y', { duration: .6, ease: 'elastic.out(1,.45)' }); });
    var foot = $('#siteFoot') || wm.parentNode;
    foot.addEventListener('pointermove', function(e){
      letters.forEach(function(l, i){
        if (l.__flying) return;
        var r = l.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = Math.hypot(e.clientX - cx, (e.clientY - cy) * 1.4), f = Math.max(0, 1 - d / 260);
        qy[i](-f * 46); l.classList.toggle('hot', f > .35);
      });
    });
    foot.addEventListener('pointerleave', function(){ letters.forEach(function(l, i){ if (!l.__flying){ qy[i](0); l.classList.remove('hot'); } }); });
    letters.forEach(function(l){
      l.addEventListener('click', function(){
        if (l.__flying) return; l.__flying = true; l.classList.add('lit');
        gsap.timeline({ onComplete: function(){ l.__flying = false; l.classList.remove('lit'); } })
          .to(l, { y: 10, duration: .12, ease: 'power2.out' })
          .to(l, { y: -innerHeight * .9, rotation: gsap.utils.random(-30, 30), duration: .9, ease: 'power3.in' })
          .set(l, { y: 160, rotation: 0, opacity: 0 })
          .to(l, { y: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1,.5)', delay: .5 });
      });
    });
  })();

  /* ---------- feed the black hole: tidal stretch while dragging, spaghettification on capture ---------- */
  (function(){
    // the footer's own black hole (About's Interstellar card has one too, earlier in the page)
    var foot = $('#siteFoot') || document, bhw = $('.ab_planet[data-planet="blackhole"]', foot), feedPlanets = $$('.ab_planet.is-feed');
    if (!bhw || !feedPlanets.length || !hasGsap || !window.Draggable) return;
    var count = 0, grow = 1, countEl = $('#feedCount'), NOVA = 7, novae = 0;
    feedPlanets.forEach(function(p){ p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', 'Planet. Press Enter to send it into the black hole.'); });
    function setCount(n){ count = n; if (countEl) countEl.textContent = n; }
    function bhCenter(){ var core = $('.bh-core', bhw) || bhw, r = core.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: bhw.getBoundingClientRect().width }; }
    function center(el){ var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    // critical mass: the black hole goes nova, throws the planets back out, then re-forms
    function nova(){
      novae++; setCount(0);
      var zone = bhw.parentNode, b = bhCenter(), zr = zone.getBoundingClientRect();
      toast(novae === 1 ? 'Critical mass. The black hole went nova.' : 'Nova ×' + novae + '. It keeps coming back.');
      if (reduce){ gsap.fromTo(bhw, { opacity: 0 }, { opacity: 1, duration: .6, delay: .4 }); grow = 1; gsap.set(bhw, { scale: 1 }); return; }
      var ring = document.createElement('div'), flash = document.createElement('div');
      ring.className = 'bh-shock'; flash.className = 'bh-nova';
      ring.style.left = flash.style.left = (b.x - zr.left) + 'px'; ring.style.top = flash.style.top = (b.y - zr.top) + 'px';
      zone.appendChild(flash); zone.appendChild(ring);
      gsap.timeline({ onComplete: function(){ ring.remove(); flash.remove(); } })
        .to(bhw, { x: '+=6', duration: .04, repeat: 11, yoyo: true, ease: 'none' })
        .to(bhw, { scale: grow * 1.25, duration: .25, ease: 'power2.in' }, 0)
        .add(function(){ gsap.fromTo(sf.state, { warp: .9 }, { warp: 0, duration: 2.2, ease: 'power3.out' }); })
        .fromTo(flash, { scale: .2, opacity: 1 }, { scale: 3.2, opacity: 0, duration: 1.6, ease: 'expo.out' })
        .fromTo(ring, { scale: .1, opacity: 1 }, { scale: 6, opacity: 0, duration: 1.8, ease: 'expo.out' }, '<')
        .to(bhw, { scale: 0, opacity: 0, duration: .35, ease: 'power3.in' }, '<')
        .add(function(){
          feedPlanets.forEach(function(p){ var c = center(p), dx = c.x - b.x, dy = c.y - b.y, d = Math.hypot(dx, dy) || 1;
            gsap.fromTo(p, { x: 0, y: 0 }, { x: dx / d * 90, y: dy / d * 60, rotation: gsap.utils.random(-90, 90), duration: .7, ease: 'power3.out', yoyo: true, repeat: 1, repeatDelay: .3, onComplete: function(){ gsap.set(p, { rotation: 0 }); } }); });
          document.documentElement.classList.add('is-quake'); setTimeout(function(){ document.documentElement.classList.remove('is-quake'); }, 500);
        }, '<')
        .set(bhw, { x: 0 })
        .add(function(){ grow = 1; })
        .fromTo(bhw, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'elastic.out(1,.45)' }, '+=1.4');
    }
    function tidal(p){
      var b = bhCenter(), c = center(p), dx = b.x - c.x, dy = b.y - c.y, d = Math.hypot(dx, dy), infl = b.w * 2.4;
      if (d < infl){ var f = 1 - d / infl; gsap.set(p, { rotation: Math.atan2(dy, dx) * 180 / Math.PI, scaleX: 1 + f * f * 1.6, scaleY: 1 - f * f * .45 }); }
      else gsap.set(p, { rotation: 0, scaleX: 1, scaleY: 1 });
      return { d: d, b: b };
    }
    function home(p, drag){ gsap.to(p, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'elastic.out(1,.55)', onComplete: function(){ if (drag) drag.enable(); } }); }
    function consume(p, drag){
      if (drag) drag.disable();
      var b = bhCenter(), c = center(p), r0 = Math.hypot(c.x - b.x, c.y - b.y), a0 = Math.atan2(c.y - b.y, c.x - b.x), o = { t: 0 };
      var core = $('.bh-core', bhw), rh = core ? core.getBoundingClientRect().width / 2 : 20;
      var done = function(){
        setCount(count + 1);
        var fl = $('.bh-flash', bhw); if (fl && !reduce) gsap.fromTo(fl, { opacity: .95, scale: .6 }, { opacity: 0, scale: 1.3, duration: .9, ease: 'power2.out' });
        grow = Math.min(1.35, grow + .05); gsap.to(bhw, { scale: grow, duration: .8, ease: 'elastic.out(1,.5)' });
        if (count >= NOVA) nova();
        else toast(count === 1 ? 'Spaghettified.' : count === 3 ? '3 planets in. It is getting heavier.' : count === NOVA - 1 ? 'Critical mass is close. One more…' : 'Spaghettified. ×' + count);
        gsap.set(p, { x: 0, y: 0, rotation: 0, scaleX: 0, scaleY: 0, opacity: 1 });
        gsap.to(p, { scaleX: 1, scaleY: 1, duration: 1, delay: 2.2, ease: 'elastic.out(1,.5)', onComplete: function(){ if (drag) drag.enable(); } });
      };
      if (reduce){ gsap.to(p, { opacity: 0, duration: .3, onComplete: done }); return; }
      gsap.to(o, { t: 1, duration: 1.7, ease: 'power2.in', onUpdate: function(){
        var t = o.t, bn = bhCenter(), cn = center(p), rr = rh + Math.max(0, r0 - rh) * Math.pow(1 - t, 1.3), aa = a0 + t * Math.PI * 3.2;
        if (Math.random() < .55){ var sp = document.createElement('span'); sp.className = 'bh-trail'; sp.style.left = cn.x + 'px'; sp.style.top = cn.y + 'px'; document.body.appendChild(sp); setTimeout(function(){ sp.remove(); }, 700); }
        var tx = bn.x + Math.cos(aa) * rr, ty = bn.y + Math.sin(aa) * rr;
        gsap.set(p, { x: gsap.getProperty(p, 'x') + (tx - cn.x), y: gsap.getProperty(p, 'y') + (ty - cn.y),
          rotation: aa * 180 / Math.PI + 180 - t * 40, scaleX: 1 + t * t * 7, scaleY: Math.max(.04, 1 - t * .96), opacity: t > .78 ? Math.max(0, (1 - t) / .22) : 1 });
      }, onComplete: done });
    }
    feedPlanets.forEach(function(p){
      var drag = Draggable.create(p, { type: 'x,y', zIndexBoost: true,
        onDrag: function(){ tidal(p); },
        onRelease: function(){ var t = tidal(p); if (t.d < t.b.w * 1.3) consume(p, this); else home(p, this); } })[0];
      p.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); if (drag.enabled()) consume(p, drag); } });
    });
  })();

  /* ---------- mobile menu (Nav component: .ab_menu_component#mmenu, combo is-open = display:flex) ---------- */
  (function(){
    var btn = $('#menuBtn'), menu = $('#mmenu'); if (!btn || !menu) return;
    var links = $$('.ab_menu_link', menu), isOpen = false, nav = $('#nav');
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mmenu'); btn.setAttribute('aria-label', 'Open menu');
    var MX = 0, MY = 0;
    function setOrigin(){ var r = btn.getBoundingClientRect(); MX = r.left + r.width / 2; MY = r.top + r.height / 2; }
    function circ(rad){ return 'circle(' + rad + 'px at ' + MX + 'px ' + MY + 'px)'; }
    function radius(){ return Math.hypot(Math.max(MX, innerWidth - MX), Math.max(MY, innerHeight - MY)) + 40; }
    var anim = hasGsap && !reduce;
    function open(){
      if (isOpen) return; isOpen = true; setOrigin();
      menu.hidden = false; menu.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Close menu');
      if (lenis) lenis.stop(); document.documentElement.style.overflow = 'hidden'; if (nav) nav.classList.remove('is-hidden');
      if (!anim){ if (links[0]) links[0].focus(); return; }
      gsap.fromTo(menu, { clipPath: circ(0) }, { clipPath: circ(radius()), duration: .8, ease: 'power3.inOut', onComplete: function(){ gsap.set(menu, { clearProps: 'clipPath' }); } });
      gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .07, delay: .2, ease: 'expo.out' });
      gsap.fromTo($$('.ab_menu_tag, .ab_menu_foot', menu), { opacity: 0 }, { opacity: 1, duration: .6, delay: .45 });
      gsap.fromTo(sf.state, { warp: .35 }, { warp: 0, duration: 1.1, ease: 'power2.out' });
      setTimeout(function(){ if (links[0]) links[0].focus({ preventScroll: true }); }, 300);
    }
    function close(focusBtn){
      if (!isOpen) return; isOpen = false; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu');
      if (lenis) lenis.start(); document.documentElement.style.overflow = '';
      var fin = function(){ menu.classList.remove('is-open'); menu.hidden = true; gsap.set(menu, { clearProps: 'clipPath' }); if (focusBtn) btn.focus(); };
      if (!anim){ menu.classList.remove('is-open'); menu.hidden = true; if (focusBtn) btn.focus(); return; }
      setOrigin(); gsap.fromTo(menu, { clipPath: circ(radius()) }, { clipPath: circ(0), duration: .55, ease: 'power3.inOut', onComplete: fin });
    }
    btn.addEventListener('click', function(){ if (isOpen) close(true); else open(); });
    links.forEach(function(a){ a.addEventListener('click', function(){ close(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && isOpen) close(true); });
    addEventListener('resize', function(){ if (innerWidth > 991 && isOpen) close(false); });
  })();

  /* ---------- touch wording ---------- */
  if (coarse){
    var rb = $('#toolReadout .ab_stack_readout-title'); if (rb) rb.textContent = 'Tap a tool';
    var wh = $('.ab_footer_wordmark-hint'); if (wh) wh.textContent = 'Tap a letter to launch it.';
    var fh = $('.ab_footer_feed-hint'); if (fh) fh.textContent = 'Feed the black hole · drag a planet into it';
  }

  AB.ready = true;

});
