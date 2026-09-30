
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
     data-planet: gas | storm | rocky | ice | lava | terra | desert | ocean | toxic | crystal | blackhole | wormhole
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
        } else if (type === 'storm'){ // banded giant with three swirling storms (the swirl rotates the sample point)
          var su = x / W, sv = v, k2;
          for (k2 = 0; k2 < 3; k2++){
            var sx0 = hash(k2, 11, seed), sy0 = .28 + hash(k2, 12, seed) * .44, rad = .05 + hash(k2, 13, seed) * .06;
            var ddx = su - sx0; ddx -= Math.round(ddx); var ddy = (sv - sy0) * .5, dd = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dd < rad){ var sw2 = Math.pow(1 - dd / rad, 2) * 4 * (k2 % 2 ? -1 : 1), ca = Math.cos(sw2), sa = Math.sin(sw2); su = sx0 + ddx * ca - ddy * sa; sv = sy0 + (ddx * sa + ddy * ca) * 2; }
          }
          var wq = fbm(su * P, sv * 5, P, seed, 3);
          c = ramp(cols, (fbm(su * 2, sv * 12 + wq * 2.2, 2, seed + 9, 4) - .5) * 2.8 + .5);
        } else if (type === 'desert'){ // wind-combed dunes, dark rock fields, thin frost caps
          var dn = fbm(u * 1.5, v * 3, 12, seed, 4), dune = Math.sin((u * 2 + v * 3 + dn * 3.2) * Math.PI * 2);
          c = ramp(cols.slice(0, 3), Math.max(0, Math.min(1, .5 + dune * .18 + (dn - .5) * 1.1)));
          var rk = fbm(u * 2, v * 4, 16, seed + 4, 4); if (rk > .6) c = mix(c, cols[3] || cols[0], Math.min(.8, (rk - .6) * 4));
          if (lat > .86) c = mix(c, [245, 240, 232], Math.min(.7, (lat - .86) * 5));
        } else if (type === 'ocean'){ // a water world: island chains, shallows, heavy swirling cloud
          var ld = fbm(u * 1.5, v * 3, 12, seed, 5), q0 = fbm(u, v * 3, P, seed + 2, 2);
          c = ld > .6 ? mix(cols[2], cols[3] || cols[2], Math.min(1, (ld - .6) * 5)) : ld > .55 ? mix(cols[1], cols[2], .35) : mix(cols[0], cols[1], Math.min(1, ld * 1.7));
          var cw = fbm(u * 2 + q0 * 1.4, v * 6, 16, seed + 7, 4); if (cw > .54) c = mix(c, [255, 255, 255], Math.min(.85, (cw - .54) * 3.5));
          if (lat > .88) c = mix(c, [240, 248, 255], Math.min(.8, (lat - .88) * 6));
        } else if (type === 'toxic'){ // domain-warped marbling, like a poisoned atmosphere
          var q1 = fbm(u, v * 2, P, seed, 3), q2 = fbm(u + 1.7, v * 2 + 3.1, P, seed + 1, 3);
          c = ramp(cols, Math.max(0, Math.min(1, (fbm(u + q1 * 3, v * 2 + q2 * 3, P, seed + 2, 4) - .3) * 2.2)));
        } else if (type === 'crystal'){ // faceted cells with lit edges (wrapped Voronoi, 12 x 6 cells)
          var gx = x / W * 12, gy = v * 6, ix = Math.floor(gx), iy = Math.floor(gy), d1 = 9, d2 = 9, cid = 0, a2, b2;
          for (a2 = -1; a2 <= 1; a2++) for (b2 = -1; b2 <= 1; b2++){
            var cxi = ix + a2, cyi = iy + b2, wx = ((cxi % 12) + 12) % 12;
            var ex = gx - (cxi + hash(wx, cyi, seed)), ey = gy - (cyi + hash(wx, cyi, seed + 3)), dq = ex * ex + ey * ey;
            if (dq < d1){ d2 = d1; d1 = dq; cid = hash(wx, cyi, seed + 5); } else if (dq < d2) d2 = dq;
          }
          var eg = Math.sqrt(d2) - Math.sqrt(d1);
          c = ramp(cols.slice(0, Math.max(2, cols.length - 1)), cid); c = mix(c, [0, 0, 0], .18 * (1 - Math.min(1, eg * 3)));
          if (eg < .06) c = mix(c, cols[cols.length - 1], 1 - eg / .06);
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
  /* ---------- random planets: a type + a color harmony (analogous / complementary / triad) per call ----------
     AB.planetLook(rnd?) -> { type, colors, ring, tilt, open, glow, seed }; AB.applyPlanetLook(el, look) writes the data
     attributes (call before buildPlanet, or clear __built to rebuild). Designer planets and service colors keep theirs. */
  var TYPES = ['gas', 'gas', 'storm', 'storm', 'rocky', 'ice', 'lava', 'terra', 'desert', 'ocean', 'toxic', 'crystal'];
  // ring styles (data-ring-style, CSS .is-ring-*): classic bands, one thin bright band, a wide dusty sheet, two rings with a gap, many fine bands
  var RINGS = ['classic', 'classic', 'thin', 'wide', 'double', 'banded'];
  function hsl(h, s, l){
    h = ((h % 360) + 360) % 360 / 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    function f(t){ t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; }
    return '#' + [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(function(v){ var x = Math.round(v * 255).toString(16); return x.length < 2 ? '0' + x : x; }).join('');
  }
  function planetLook(rnd){
    rnd = rnd || Math.random;
    function R(a, b){ return a + rnd() * (b - a); }
    var t = TYPES[rnd() * TYPES.length | 0], h = rnd() * 360, sc = rnd(), h2 = sc < .33 ? h + R(20, 45) : sc < .66 ? h + 180 + R(-20, 20) : h + 120, c;
    if (t === 'gas' || t === 'storm') c = [hsl(h, R(.35, .7), R(.12, .2)), hsl(h, R(.4, .7), R(.35, .45)), hsl(h2, R(.4, .8), R(.6, .72)), hsl(h, R(.2, .5), R(.85, .93)), hsl(h2, R(.3, .6), R(.25, .35))];
    else if (t === 'rocky') c = [hsl(h, R(.05, .28), R(.3, .4)), hsl(h, R(.05, .28), R(.52, .64)), hsl(h, R(.05, .2), R(.13, .2))];
    else if (t === 'ice') c = [hsl(h, R(.3, .6), R(.9, .95)), hsl(h, R(.4, .7), R(.66, .76)), hsl(h2, R(.4, .6), R(.38, .48))];
    else if (t === 'lava') c = [hsl(h, R(.2, .4), R(.04, .08)), hsl(h, R(.3, .5), R(.12, .18)), hsl(h2, .95, R(.5, .58)), hsl(h2 + 25, .95, R(.72, .8))];
    else if (t === 'terra') c = [hsl(h, R(.5, .7), R(.14, .22)), hsl(h, R(.5, .7), R(.3, .4)), hsl(h2, R(.3, .55), R(.28, .38)), hsl(h2 + 30, R(.2, .4), R(.45, .55)), '#f2f0ea'];
    else if (t === 'desert') c = [hsl(h, R(.3, .6), R(.3, .38)), hsl(h, R(.4, .65), R(.5, .6)), hsl(h + 15, R(.4, .7), R(.72, .82)), hsl(h2, R(.1, .3), R(.16, .24))];
    else if (t === 'ocean') c = [hsl(h, R(.5, .8), R(.1, .18)), hsl(h, R(.5, .8), R(.32, .42)), hsl(h2, R(.3, .6), R(.32, .42)), hsl(h2 + 20, R(.2, .5), R(.55, .65))];
    else if (t === 'toxic') c = [hsl(h, R(.5, .8), R(.07, .13)), hsl(h, R(.6, .9), R(.3, .4)), hsl(h2, R(.7, 1), R(.55, .65)), hsl(h2 + 30, R(.6, .9), R(.8, .9))];
    else c = [hsl(h, R(.4, .7), R(.18, .28)), hsl(h, R(.5, .8), R(.42, .52)), hsl(h2, R(.5, .8), R(.6, .7)), hsl(h, R(.2, .5), R(.92, .97))];
    var ring = (t === 'gas' || t === 'storm') ? rnd() < .7 : rnd() < .28, gl = hex(c[Math.min(2, c.length - 1)]);
    return { type: t, colors: c.join(','), seed: 1 + (rnd() * 998 | 0), tilt: Math.round((6 + rnd() * 26) * (rnd() < .2 ? 1 : -1)), open: +(.16 + rnd() * .14).toFixed(2),
      ringStyle: RINGS[rnd() * RINGS.length | 0],
      ring: ring ? [hsl(h2, R(.2, .5), R(.8, .9)), hsl(h, R(.3, .6), R(.55, .65)), hsl(h, R(.3, .5), R(.25, .35))].join(',') : '', glow: 'rgba(' + gl.join(',') + ',.4)' };
  }
  function applyPlanetLook(el, L){
    el.setAttribute('data-planet', L.type); el.setAttribute('data-colors', L.colors); el.setAttribute('data-seed', L.seed); el.setAttribute('data-glow', L.glow);
    if (L.ring){ el.setAttribute('data-ring', L.ring); el.setAttribute('data-tilt', L.tilt); el.setAttribute('data-open', L.open); el.setAttribute('data-ring-style', L.ringStyle || 'classic'); }
    else { el.removeAttribute('data-ring'); el.removeAttribute('data-ring-style'); }
  }

  /* ---------- wormhole (data-planet="wormhole"): a glass sphere showing another galaxy through it. It lenses the real
     starfield (sf reads LENSES: stars bend around it into an Einstein ring), wobbles like jelly and sends ripples out on
     hover with a note ("They put it there."), and a click falls through to a random page of the site. ---------- */
  var LENSES = [];
  // the far side, drawn from a fixed seed so every size is the same picture: the ball uses 320–512px, the fall a 1536–2048px
  // canvas (crisp at 5x zoom). Star and dust sizes scale with W so the two read alike when they swap.
  function farCanvas(W){
    var cv = document.createElement('canvas'); cv.width = cv.height = W; var x = cv.getContext('2d'), i, r, k = W / 512, sd = 7;
    function rnd(){ sd = (sd + 0x6D2B79F5) | 0; var t = Math.imul(sd ^ (sd >>> 15), 1 | sd); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    var g = x.createRadialGradient(W * .5, W * .5, 0, W * .5, W * .5, W * .72);
    g.addColorStop(0, '#1c2a52'); g.addColorStop(.45, '#0d1330'); g.addColorStop(1, '#03040a'); x.fillStyle = g; x.fillRect(0, 0, W, W);
    // nebula veils: a warm, a cold and a violet one
    [['255,176,110', .32, .3, .34], ['110,190,255', .7, .66, .4], ['190,140,255', .22, .78, .26]].forEach(function(n){
      var ng = x.createRadialGradient(W * n[1], W * n[2], 0, W * n[1], W * n[2], W * n[3]); ng.addColorStop(0, 'rgba(' + n[0] + ',.34)'); ng.addColorStop(1, 'rgba(' + n[0] + ',0)');
      x.fillStyle = ng; x.fillRect(0, 0, W, W);
    });
    // a spiral galaxy on the far side (two log-spiral arms)
    var gs = W * .2, dot = 1.2 * Math.max(1, k * .75);
    x.save(); x.translate(W * .6, W * .42); x.rotate(-.5); x.scale(1, .55);
    var core = x.createRadialGradient(0, 0, 0, 0, 0, gs * .5); core.addColorStop(0, 'rgba(255,240,215,.95)'); core.addColorStop(1, 'rgba(255,200,150,0)'); x.fillStyle = core; x.beginPath(); x.arc(0, 0, gs * .5, 0, 7); x.fill();
    for (i = 0; i < 900; i++){ var tt = rnd() * 3.2, rr = gs * .12 * Math.exp(tt * .55), an = tt * 2 + (i % 2) * Math.PI + (rnd() - .5) * .5;
      x.fillStyle = 'rgba(' + (rnd() < .5 ? '200,220,255' : '255,225,190') + ',' + (.25 + rnd() * .6) + ')'; x.fillRect(Math.cos(an) * rr, Math.sin(an) * rr, dot, dot); }
    x.restore();
    for (i = 0; i < 700; i++){ r = (rnd() < .9 ? .6 + rnd() * .7 : 1.4 + rnd() * 1.2) * Math.max(1, k * .75);
      x.fillStyle = 'rgba(' + (rnd() < .2 ? '255,214,180' : rnd() < .3 ? '190,215,255' : '255,255,255') + ',' + (.35 + rnd() * .65) + ')'; x.beginPath(); x.arc(rnd() * W, rnd() * W, r, 0, 7); x.fill(); }
    return cv;
  }
  function farSide(W){ return farCanvas(W).toDataURL('image/jpeg', .88); }

  function wormLinks(){
    var here = location.pathname.replace(/\/$/, '') || '/', seen = {}, out = [];
    $$('a[href]').forEach(function(a){
      var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (e){ return; }
      if (u.origin !== location.origin || /\.[a-z0-9]{2,4}$/i.test(u.pathname)) return;
      var pth = u.pathname.replace(/\/$/, '') || '/'; if (pth === here || seen[pth]) return; seen[pth] = 1; out.push(pth);
    });
    return out.length ? out : ['/', '/work', '/services', '/process', '/about', '/observatory', '/contact'].filter(function(x){ return x !== here; });
  }
  function buildWormhole(el){
    el.classList.add('is-wormhole');
    var sz = el.getBoundingClientRect().width || 200, armed = 0;
    el.style.setProperty('--sz', sz + 'px');
    var body = document.createElement('div'); body.className = 'pbody'; el.appendChild(body); el.__body = body;
    body.innerHTML = '<div class="wh-halo"></div><div class="wh-rip"><i></i><i></i><i></i></div>' +
      '<div class="wh-ball"><div class="wh-far"><i class="is-a"></i><i class="is-b"></i></div><div class="wh-lens"></div><div class="wh-glass"></div></div>';
    var tip = document.createElement('span'); tip.className = 'wh-tip'; tip.setAttribute('aria-hidden', 'true');
    tip.innerHTML = '<b>Looks like a wormhole.</b><span>They put it there.</span><em>' + (coarse ? 'Tap again to fall through' : 'Click to fall through') + ' &rarr;</em>';
    el.appendChild(tip);
    el.removeAttribute('aria-hidden'); el.setAttribute('role', 'link'); el.tabIndex = 0; el.setAttribute('aria-label', 'Wormhole: fall through to a random page of this site');
    var farTx = '';
    var paint = function(){ farTx = farSide(sz > 240 ? 512 : 320); $$('.wh-far i', body).forEach(function(i){ i.style.backgroundImage = 'url(' + farTx + ')'; }); body.classList.add('on'); };
    if ('requestIdleCallback' in window) requestIdleCallback(paint, { timeout: 800 }); else setTimeout(paint, 30);
    var lens = { el: $('.wh-ball', body), b: 0, to: 0 }; LENSES.push(lens);
    function hot(on){ el.classList.toggle('is-hot', on); if (!el.classList.contains('is-go')) lens.to = on ? 1 : 0; }
    function fall(){
      if (el.classList.contains('is-go')) return;
      var list = wormLinks(), url = list[Math.random() * list.length | 0];
      el.classList.add('is-go'); lens.to = 3;
      var fresh = AB.quest ? AB.quest('wormhole') : false;
      try { sessionStorage.setItem('ab:wormhole', fresh ? 'new' : '1'); } catch (e){}
      if (reduce || !hasGsap || !AB.go){ location.href = url; return; }
      tunnel(url);
    }
    // falling in: the wormhole pulls in and flares out while the starfield goes to hyperspeed around it (warp centered on the
    // hole), then AB.go fades the page to black and loads the next one. No image hand-off and no CSS filter on the ball
    // (a filter re-rasterizes its layers and flashed it black for a frame or two), so nothing can redraw.
    function tunnel(url){
      var ball = $('.wh-ball', body), r = ball.getBoundingClientRect();
      if (sf && sf.state){ sf.state.cx = r.left + r.width / 2; sf.state.cy = r.top + r.height / 2; }
      gsap.timeline()
        .to(ball, { scale: .86, duration: .16, ease: 'power2.out' })
        .to(ball, { scale: 1.12, opacity: 0, duration: .45, ease: 'power2.in' })
        .to(el.querySelector('.wh-halo'), { scale: 2.2, opacity: 0, duration: .45, ease: 'power2.in' }, '<')
        .to(sf && sf.state ? sf.state : {}, { warp: .6, duration: .6, ease: 'power2.in' }, '<-.1')
        .add(function(){ AB.go(url); }, '-=.15');
    }
    el.addEventListener('pointerenter', function(e){ if (e.pointerType !== 'touch') hot(true); });
    el.addEventListener('pointerleave', function(e){ if (e.pointerType !== 'touch') hot(false); });
    el.addEventListener('focus', function(){ hot(true); }); el.addEventListener('blur', function(){ hot(false); });
    el.addEventListener('click', function(e){
      e.preventDefault();
      // touch: the first tap wakes it (wobble + note), a second tap within 4 s falls through
      if (coarse && Date.now() - armed > 4000){ armed = Date.now(); hot(true); setTimeout(function(){ if (Date.now() - armed >= 3900) hot(false); }, 4000); return; }
      fall();
    });
    el.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fall(); } });
  }

  function buildPlanet(el){
    if (el.__built) return; el.__built = true;
    var type = el.getAttribute('data-planet') || 'gas';
    if (type === 'wormhole'){ buildWormhole(el); return; }
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
      el.className = el.className.replace(/\s*is-ring-\w+/g, '');
      if (ds.ringStyle && ds.ringStyle !== 'classic') el.classList.add('is-ring-' + ds.ringStyle);
      ['back', 'front'].forEach(function(side){ var r = document.createElement('div'); r.className = 'pring pring-' + side; r.appendChild(document.createElement('i')); pbody.appendChild(r); });
    }
    if (!el.hasAttribute('aria-hidden') && !el.hasAttribute('role')){
      if (ds.label && el.hasAttribute('data-drag')){ el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'Draggable planet: ' + ds.label); el.tabIndex = 0; }
      else el.setAttribute('aria-hidden', 'true');
    }
    var paint = function(){ var W = sz > 160 ? 512 : sz > 70 ? 256 : 128; tex.style.setProperty('--tex', 'url(' + makeTexture(type, cols, seed, W) + ')'); requestAnimationFrame(function(){ tex.classList.add('on'); }); };
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
      dpr = coarse ? 1 : Math.min(window.devicePixelRatio || 1, 1.5); w = innerWidth; h = innerHeight;
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
      var sy = window.scrollY, cx = state.cx != null ? state.cx : w / 2, cy = state.cy != null ? state.cy : h / 2, wp = state.warp, LS = [];
      // wormholes on screen: point-lens each star (r' = (r + sqrt(r^2 + 4 th^2)) / 2) with a smooth falloff; hover swells th and makes it ring
      LENSES.forEach(function(o){
        o.b += (o.to - o.b) * (dt ? Math.min(1, dt * 4) : 1);
        var r = o.el.getBoundingClientRect(); if (!r.width || r.bottom < -200 || r.top > h + 200) return;
        var R = r.width / 2, th = R * (1.06 + o.b * .22 + (o.b > .05 ? Math.sin(time * .011) * .05 * Math.min(1, o.b) : 0));
        LS.push({ x: r.left + R, y: r.top + R, t: th, a: th * 3, z: th * 7 });
      });
      for (var i = 0; i < stars.length; i++){
        var s = stars[i], dp = depth[s.l];
        if (wp > 0.01){
          var dx0 = s.x - cx, dy0 = s.y - cy;
          s.x += dx0 * wp * 0.06 * (s.l + 1); s.y += dy0 * wp * 0.06 * (s.l + 1);
          if (s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50){ s.x = cx + (Math.random() - .5) * w * .3; s.y = cy + (Math.random() - .5) * h * .3; }
        }
        var px = s.x + mx * dp * 60, py = ((s.y - sy * dp) % h + h) % h + my * dp * 40;
        var al = reduce ? s.a : s.a * (0.72 + 0.28 * Math.sin(time * 0.0018 + s.t));
        for (var li = 0; li < LS.length; li++){
          var Lq = LS[li], ldx = px - Lq.x, ldy = py - Lq.y, ld2 = ldx * ldx + ldy * ldy;
          if (ld2 > Lq.z * Lq.z) continue;
          var ldd = Math.sqrt(ld2) || .001, nd = (ldd + Math.sqrt(ld2 + 4 * Lq.t * Lq.t)) / 2, ff = ldd < Lq.a ? 1 : 1 - (ldd - Lq.a) / (Lq.z - Lq.a);
          nd = ldd + (nd - ldd) * ff * ff * (3 - 2 * ff); px = Lq.x + ldx / ldd * nd; py = Lq.y + ldy / ldd * nd;
          var ring = (nd - Lq.t * 1.04) / (Lq.t * .22); al = Math.min(1, al * (1 + 1.1 * Math.exp(-ring * ring)));
        }
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
      // the first page of a visit (head script sets 'first') drops out of hyperspace slower: the stars hold at full streak, then settle
      var first = flag === 'first';
      var out = function(){ out = null; gsap.timeline().to(flash, { opacity: 0, duration: first ? 1.1 : .6, ease: 'power2.out' }, first ? .35 : .05).to(sf.state, { warp: 0, duration: first ? 2.4 : 1.1, ease: first ? 'expo.out' : 'power2.out' }, first ? .25 : 0); };
      // arriving at an anchor (/#launch): the first jump lands short while late layout grows above the target, so the
      // fade showed the sections in between (About → Home testimonials). Stay covered until 30-motion re-aims (AB.arrived)
      var hid = location.hash.length > 1 ? location.hash.slice(1) : '', tgt = null;
      try { tgt = hid && document.getElementById(decodeURIComponent(hid)); } catch (e){}
      if (tgt){ AB.arrived = function(){ if (out) out(); }; setTimeout(AB.arrived, 1800); }
      else out();
    } else html.classList.remove('ab-warp-in');
    // back/forward cache: a page restored mid-warp would keep its flash up
    addEventListener('pageshow', function(e){ if (e.persisted && flash){ if (hasGsap) gsap.set(flash, { opacity: 0 }); else flash.style.opacity = 0; flash.style.pointerEvents = ''; sf.state.warp = 0; } });
  })();

  Object.assign(AB, { planetLook: planetLook, applyPlanetLook: applyPlanetLook });
  Object.assign(AB, { toast: toast, copyText: copyText, fmt: fmt, buildPlanet: buildPlanet, planets: planets, sf: sf, warp: warp, go: go, inject: inject });
