/*! AB Portfolio · ab-core v0.2.0 · github.com/AngelinoBarajas/ab-portfolio */
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
  var S0 = {};
  $$('[data-settings-source] [data-field]').forEach(function(f){ var v = f.textContent.trim(); if (v) S0[f.getAttribute('data-field')] = v; });
  function bind(key, val){ if (!val) return; $$('[data-bind="' + key + '"]').forEach(function(e){ e.textContent = val; }); }
  bind('availability', S0.availability);
  if (S0.availability) bind('availability-short', S0.availability.replace(/^Available\s*/i, ''));
  bind('tz-label', S0['tz-label']);
  bind('email', S0.email);
  if (!S0.email){ var eb = $('[data-bind="email"]'); if (eb) S0.email = eb.textContent.trim(); }
  var events = (S0['space-events'] || 'shooting,meteors,comets,satellites,flares,ufo').split(',').map(function(s){ return s.trim(); });
  // social links: real URLs from Site Settings, else a hint
  $$('[data-social]').forEach(function(a){
    var url = S0[a.getAttribute('data-social')];
    if (url){ a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else a.addEventListener('click', function(e){ e.preventDefault(); toast('Add your profile links in Site Settings.'); });
  });

  /* ---------- quotes (CMS · Quotes, hidden [data-quote-source] list) ---------- */
  var QUOTES = $$('[data-quote-source] .w-dyn-item').map(function(it){
    var g = function(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; };
    return { t: g('quote'), a: g('author'), c: g('context') };
  }).filter(function(q){ return q.t; });

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

  Object.assign(AB, { toast: toast, copyText: copyText, fmt: fmt, buildPlanet: buildPlanet, planets: planets, sf: sf, warp: warp, inject: inject });

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

    /* ---------- metrics ([data-count]) ---------- */
    $$('[data-count]').forEach(function(el){
      var o = { v: 0 };
      if (reduce) return;
      // target read on enter: page bundles may update data-count after this runs (Work sets it from the CMS list)
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function(){
        var target = +el.getAttribute('data-count');
        gsap.fromTo(o, { v: 0 }, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: function(){ el.textContent = Math.round(o.v); } });
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

  /* ===== core/38-next.js ===== */
  /* ---------- next cards (.ab_next-card): HUD corners, streaks, spotlight + tilt, a ship that flies to the planet on hover ---------- */
  $$('.ab_next-card').forEach(function(card, ci){
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
  });

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
    var bhw = $('.ab_planet[data-planet="blackhole"]'), feedPlanets = $$('.ab_planet.is-feed');
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
