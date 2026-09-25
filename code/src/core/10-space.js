
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
