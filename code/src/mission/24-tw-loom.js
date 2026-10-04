  /* =========================================================
     TOPICWEAVE · THE LOOM (channel tw-loom)
     A compact port of the v3 site's signature (cks-v3 js/loom.js): short thread fibers in the four weave
     colors fly in and weave the Topicweave mark (the loom's MARK bar geometry, over/under included) beside
     the Home hero, then re-weave through the shapes Home uses per section, each with that section's line:
       scatter (The problem) → threads (Tag once) → graph (Connected) → weave (Your CMS) → night sky
     Positions are a pure function of the timeline time (so phase chips seek cleanly); drawing happens in a
     tween's onUpdate, i.e. only while the scene plays. Click/tap sends a burst + ripple through the threads
     (CKSLoom.burst), a fine pointer parts them gently; both kick a short rAF only while the timeline is paused.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var TAU = Math.PI * 2, PI = Math.PI, HP = Math.PI / 2;
    var LIL = 0, COR = 1, TEA = 2, COB = 3, BONE = 4, WHITE = 5;
    var COLS = [T.C.lilac, T.C.coral, T.C.teal, T.C.cobalt, '#E9E6DF', '#f3f1ff'];
    var LEVELS = 8;
    function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
    function smooth(t){ return t * t * (3 - 2 * t); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    function fract(v){ return v - Math.floor(v); }
    function ease3(v){ return 1 - Math.pow(1 - v, 3); }
    function angleLerp(a, b, t){ var d = (b - a) % PI; if (d > HP) d -= PI; else if (d < -HP) d += PI; return a + d * t; }

    // ---- the loom's MARK (24-unit box, the 2026-10-02 logo) — x0, y0, x1, y1, horizontal ----
    var MARK = [];
    MARK[COR] = [2.5, 6.53, 21.5, 10.75, true];
    MARK[TEA] = [2.5, 13.25, 21.5, 17.47, true];
    MARK[LIL] = [6.53, 2.5, 10.75, 21.5, false];
    MARK[COB] = [13.25, 2.5, 17.47, 21.5, false];
    // lilac over coral · coral over cobalt · teal over lilac · cobalt over teal
    function under(c, gx, gy){
      if (c === COR) return gx > 6.53 && gx < 10.75;
      if (c === COB) return gy > 6.53 && gy < 10.75;
      if (c === LIL) return gy > 13.25 && gy < 17.47;
      if (c === TEA) return gx > 13.25 && gx < 17.47;
      return false;
    }
    // ---- Home's example content (cks-v3 loom.js label sets) ----
    var ISLES = [[-0.95, -0.72], [0.75, -0.9], [1.05, 0.45], [-0.55, 0.78], [0.1, -0.05]];
    var ISLE_N = ['Services page', 'Portfolio', 'Blog', 'FAQ', 'YouTube'];
    var PAGES = ['Services page', 'Riverside Clinic', 'Hale & Partners', 'Blog · 2023', 'FAQ', 'YouTube'];
    var TOPICS = ['Client onboarding', 'Journey mapping', 'Client handoffs'];
    var TLINKS = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2], [3, 0], [3, 2], [4, 0], [5, 1], [5, 2]];
    function py(k){ return -0.85 + (k / 5) * 1.7; }
    function ty(j){ return -0.6 + j * 0.6; }
    var HUBS = ['Professional firms', 'Service design', 'Journey mapping', 'Client handoffs', 'Client onboarding', 'Plain-language UX'];
    var EDGES = [];
    (function(){ for (var p = 0; p < 12; p++){ var a = Math.floor(p / 2); EDGES.push([p, a], [p, (a + 1) % 6]); if (p === 0 || p === 6) EDGES.push([p, (a + 3) % 6]); } })();
    function hubXY(k){ var a = -HP + (k / 6) * TAU; return [Math.cos(a) * 0.42, Math.sin(a) * 0.42]; }
    function pieceXY(p){ var a = -HP + ((p + 0.5) / 12) * TAU; return [Math.cos(a) * 0.98, Math.sin(a) * 0.98]; }
    var MOON = [0, -0.12, 0.3], BITE = [0.14, -0.2, 0.26];

    // ---- the story: one formation per phase, with Home's section line ----
    var PH = [
      { f: 'mark', chip: 'Mark', eb: 'Be known for what you know', h: 'Turn what you know into a site people and AI can follow.', hero: true },
      { f: 'scatter', chip: 'Scattered', eb: 'The problem', h: 'AI answers reward sites that connect the dots. Most don’t.' },
      { f: 'threads', chip: 'Tag once', eb: 'Step two', h: 'Tag once. Get real links.' },
      { f: 'graph', chip: 'Connected', eb: 'Step three', h: 'Then it connects itself.' },
      { f: 'weave', chip: 'Woven', eb: 'No lock-in', h: 'Built into your CMS. Works with your tools.', tags: [['Webflow CMS', LIL], ['WordPress', COB], ['Sanity', TEA], ['Markdown', COR]] },
      { f: 'sky', chip: 'Night', eb: 'While you get on with your day', h: 'It works while you don’t.', clock: '2:00 am' }
    ];
    var START = [0, 5.2, 10, 15, 19.8, 24.6], TR = 1.7, LOOP = 29.6, REST = 4.2;

    SCENE.add('tw-loom', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg, SW = sc.SW, SH = sc.SH;
      var CX = P ? 320 : 820, CY = P ? 505 : 378, RU = P ? 176 : 245; // the shape's stage: center + unit radius
      var N = P ? 340 : 600, reduce = K.reduce;
      var fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);

      // ---- DOM: night backdrop, canvas, brand, captions, chip labels, hint ----
      function chip(txt, col){ return '<span class="tw-lm-chip"><i style="background:' + COLS[col] + '"></i>' + esc(txt) + '</span>'; }
      function lab(ux, uy, txt, col, al){ return '<div class="tw-lm-lab tw-lm-' + al + '" style="left:' + Math.round(CX + ux * RU) + 'px;top:' + Math.round(CY + uy * RU) + 'px">' + chip(txt, col) + '</div>'; }
      var labs = ['', '', '', '', '', ''];
      labs[1] = ISLE_N.map(function(s, k){ return lab(ISLES[k][0], ISLES[k][1] + 0.34, s, k % 4, 'c'); }).join('');
      labs[2] = PAGES.map(function(s, k){ return lab(-0.9, py(k), s, k % 4, 'r'); }).join('') + TOPICS.map(function(s, j){ return lab(0.93, ty(j), s, [LIL, COR, TEA][j], 'l'); }).join('');
      labs[3] = HUBS.map(function(s, k){ var h = hubXY(k), d = Math.sqrt(h[0] * h[0] + h[1] * h[1]) || 1; return lab(h[0] + h[0] / d * 0.2, h[1] + h[1] / d * 0.16, s, (k + 1) % 4, 'c'); }).join('');
      st.innerHTML =
        '<div class="tw-lm-sky"></div><canvas class="tw-lm-cv" aria-hidden="true"></canvas>' +
        '<div class="tw-lm-brand">' + T.LOGO + '</div>' +
        (reduce ? '' : '<div class="tw-lm-hint">' + (fine ? 'Click the threads' : 'Tap the threads') + '</div>') +
        '<div class="tw-lm-copy">' + PH.map(function(p, i){
          return '<div class="tw-lm-cap' + (p.hero ? ' is-hero' : '') + '" data-p="' + i + '"><p class="tw-lm-eb">' + esc(p.eb) + '</p>' +
            (p.hero ? '<h3 class="tw-lm-h1">' : '<h3 class="tw-lm-h2">') + esc(p.h) + '</h3>' +
            (p.tags ? '<div class="tw-lm-tags">' + p.tags.map(function(g){ return chip(g[0], g[1]); }).join('') + '</div>' : '') +
            (p.clock ? '<p class="tw-lm-clock">' + esc(p.clock) + '</p>' : '') + '</div>';
        }).join('') + '</div>' +
        labs.map(function(s, i){ return s ? '<div class="tw-lm-labs" data-p="' + i + '">' + s + '</div>' : ''; }).join('') +
        '<div class="fg-fade"></div>';
      var cv = q(st, '.tw-lm-cv'), ctx = cv.getContext('2d'), caps = qa(st, '.tw-lm-cap'), lsets = qa(st, '.tw-lm-labs'), sky = q(st, '.tw-lm-sky'), hint = q(st, '.tw-lm-hint');
      var DS = Math.min(2, Math.max(1, (sc.k || 1) * (window.devicePixelRatio || 1)));
      cv.width = Math.round(SW * DS); cv.height = Math.round(SH * DS);

      // ---- threads ----
      var seed = 20260930;
      function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      function F32(){ return new Float32Array(N); }
      var R1 = F32(), R2 = F32(), R3 = F32(), R4 = F32(), R5 = F32(), SX = F32(), SY = F32(), SA = F32(), OX = F32(), OY = F32(), DX = F32(), DY = F32(), MX = F32(), MY = F32();
      var C = new Uint8Array(N), BK = new Int16Array(N), ORDER = new Int32Array(N), NB = COLS.length * LEVELS, CNT = new Int32Array(NB + 1), FILL = new Int32Array(NB + 1);
      var EXA = F32(), EYA = F32();
      var i, s3 = 104729;
      function r3(){ s3 = (s3 * 16807) % 2147483647; return s3 / 2147483647; }
      for (i = 0; i < N; i++){
        var v = rnd();
        C[i] = v < 0.1 ? BONE : Math.min(3, Math.floor((v - 0.1) / 0.225));
        R1[i] = rnd(); R2[i] = rnd(); R3[i] = rnd(); R4[i] = rnd(); R5[i] = rnd();
        // the intro: each fiber flies in from outside the stage
        var th = R5[i] * TAU, far = 1.9 + R2[i] * 1.2;
        SX[i] = Math.cos(th) * far * (SW / RU) * 0.5; SY[i] = Math.sin(th) * far * (SH / RU) * 0.5; SA[i] = R3[i] * PI;
        // the moon: a disc with a bite out of it
        var mx = 0, my = 0;
        for (var n = 0; n < 40; n++){ var a = r3() * TAU, rr = Math.sqrt(r3()) * MOON[2]; mx = MOON[0] + Math.cos(a) * rr; my = MOON[1] + Math.sin(a) * rr; if (Math.sqrt(Math.pow(mx - BITE[0], 2) + Math.pow(my - BITE[1], 2)) > BITE[2]) break; }
        MX[i] = mx; MY[i] = my;
      }

      // ---- formations (unit space, y down), ported from loom.js ----
      var o = [0, 0, 0, 0, 1], Pt = { x: 0, y: 0, a: 0 };
      function set(x, y, a, al, ln){ o[0] = x; o[1] = y; o[2] = a; o[3] = al; o[4] = ln == null ? 1 : ln; }
      function cubic(p0, p1, p2, p3, s){
        var m = 1 - s;
        Pt.x = m * m * m * p0[0] + 3 * m * m * s * p1[0] + 3 * m * s * s * p2[0] + s * s * s * p3[0];
        Pt.y = m * m * m * p0[1] + 3 * m * m * s * p1[1] + 3 * m * s * s * p2[1] + s * s * s * p3[1];
        var dx = 3 * m * m * (p1[0] - p0[0]) + 6 * m * s * (p2[0] - p1[0]) + 3 * s * s * (p3[0] - p2[0]);
        var dy = 3 * m * m * (p1[1] - p0[1]) + 6 * m * s * (p2[1] - p1[1]) + 3 * s * s * (p3[1] - p2[1]);
        Pt.a = Math.atan2(dy, dx);
      }
      function knot(i, cx, cy, rad, t, al){ var th = R1[i] * TAU + t * (R5[i] - 0.5) * 0.8, rr = rad * Math.sqrt(R2[i]); set(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, th + HP, al); }
      function drift(i, t, spread, al){
        set((R1[i] * 2 - 1) * spread + Math.sin(t * 0.07 + R3[i] * 9) * 0.08, (R2[i] * 2 - 1) * spread * 0.62 + Math.cos(t * 0.06 + R4[i] * 9) * 0.08,
          R3[i] * PI + t * 0.05 * (R5[i] - 0.5), al * (0.5 + 0.5 * R5[i]));
      }
      var F = {
        mark: function(i, t){
          var c = C[i]; if (c === BONE) return drift(i, t, P ? 1.7 : 2.4, 0.3);
          var b = MARK[c], along = fract(R1[i] + t * 0.035 * (c % 2 ? 1 : -1) * (0.8 + R4[i] * 0.4)), across = R2[i];
          var wob = Math.sin(along * 9 + t * 1.1 + c) * 0.24, gx, gy, a;
          if (b[4]){ gx = b[0] + (b[2] - b[0]) * along; gy = b[1] + 0.35 + (b[3] - b[1] - 0.7) * across + wob; a = 0; }
          else { gy = b[1] + (b[3] - b[1]) * along; gx = b[0] + 0.35 + (b[2] - b[0] - 0.7) * across + wob; a = HP; }
          var tilt = Math.sin(t * 0.25) * 0.05, x = (gx - 12) / 11.2, y = (gy - 12) / 11.2, cs = Math.cos(tilt), sn = Math.sin(tilt);
          set(x * cs - y * sn, x * sn + y * cs, a + tilt + (R3[i] - 0.5) * 0.3, under(c, gx, gy) ? 0.14 : 0.95, 1.2);
        },
        scatter: function(i, t){
          if (R4[i] < 0.34) return drift(i, t, P ? 1.7 : 2.3, 0.4);
          var k = i % 5, c = ISLES[k], th = R1[i] * TAU + t * 0.04 * (k % 2 ? 1 : -1), rr = 0.26 * Math.sqrt(R2[i]);
          set(c[0] + Math.cos(th) * rr, c[1] + Math.sin(th) * rr * 0.8, R3[i] * PI + t * 0.1, 0.75);
        },
        threads: function(i, t){
          if (R4[i] < 0.2){ var left = R3[i] < 0.62, k = left ? i % 6 : i % 3; return knot(i, left ? -0.8 : 0.8, left ? py(k) : ty(k), left ? 0.05 : 0.09, t, 0.9); }
          var e = TLINKS[i % TLINKS.length], y0 = py(e[0]), y1 = ty(e[1]);
          cubic([-0.8, y0], [-0.15, y0], [0.15, y1], [0.8, y1], fract(R1[i] + t * 0.05));
          var sp = (R2[i] - 0.5) * 0.035;
          set(Pt.x - Math.sin(Pt.a) * sp, Pt.y + Math.cos(Pt.a) * sp, Pt.a, 0.85);
        },
        graph: function(i, t){
          var r = R4[i], h, a, b;
          if (r < 0.2){ h = hubXY(i % 6); return knot(i, h[0], h[1], 0.1, t, 0.95); }
          if (r < 0.32){ h = pieceXY(i % 12); return knot(i, h[0], h[1], 0.045, t, 0.8); }
          var e = EDGES[i % EDGES.length]; a = pieceXY(e[0]); b = hubXY(e[1]);
          var mx = (a[0] + b[0]) / 2 * 0.9, my = (a[1] + b[1]) / 2 * 0.9;
          cubic(a, [mx, my], [mx, my], b, fract(R1[i] + t * 0.04 * (R5[i] < 0.5 ? 1 : -1)));
          set(Pt.x, Pt.y, Pt.a, 0.62);
        },
        weave: function(i, t){
          var c = C[i]; if (c === BONE) return drift(i, t, P ? 1.7 : 2.3, 0.3);
          var n = 9, vert = c === LIL || c === COB, j = i % n, lane = -0.88 + (j / (n - 1)) * 1.76, along = -0.95 + R1[i] * 1.9;
          var wave = Math.sin(along * 3 + t * 0.7 + j) * 0.03, x = vert ? lane + wave : along, y = vert ? along : lane + wave;
          var gx = Math.round((x + 0.88) / 0.22), gy = Math.round((y + 0.88) / 0.22);
          var near = Math.abs(x - (-0.88 + gx * 0.22)) < 0.06 && Math.abs(y - (-0.88 + gy * 0.22)) < 0.06, top = (gx + gy) % 2 === 0 ? vert : !vert;
          var yaw = Math.sin(t * 0.18) * 0.35, z = x * Math.sin(yaw), persp = 1 / (1 + z * 0.35);
          set(x * Math.cos(yaw) * persp, y * persp, vert ? HP : 0, near && !top ? 0.12 : 0.9);
        },
        sky: function(i, t){
          var g = i % 20;
          if (g < 8){ var nx = MX[i] + Math.sin(t * 0.6 + R3[i] * 9) * 0.004; return set(nx, MY[i], Math.atan2(MY[i] - MOON[1], nx - MOON[0]) + HP, 1, 1.05); }
          var x = (-CX + R3[i] * SW) / RU, y = (-CY + R5[i] * SH) / RU;
          var near = Math.sqrt(Math.pow(x - MOON[0], 2) + Math.pow(y - MOON[1], 2)) < MOON[2] + 0.1;
          if (g === 15){ // a shooting star every few seconds: a bright head with a fading tail
            var per = 4, k = Math.floor(t / per), ph = t - k * per, dur = 0.9, pr = clamp(ph / dur, 0, 1);
            var hs1 = fract(Math.sin(k * 12.9898 + 78.233) * 43758.5453), dir = hs1 < 0.5 ? -1 : 1, ang = 0.45 + hs1 * 0.2;
            var head = smooth(pr) * 0.9, d = Math.max(0, head - R1[i] * 0.32 * Math.min(1, pr * 3)), x0 = dir * 0.62, y0 = -0.75;
            return set(x0 + Math.cos(ang) * dir * d, y0 + Math.sin(ang) * d, Math.atan2(Math.sin(ang), Math.cos(ang) * dir), ph < dur ? (1 - R1[i]) * Math.sin(pr * PI) * 1.1 : 0, 0.9);
          }
          set(x, y, R2[i] * PI, near ? 0 : 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + R1[i] * 40)), 0.4);
        }
      };

      // ---- interaction state ----
      var mxp = -9999, myp = -9999, bAt = -1, bx = 0, by = 0, lastNow = 0, raf = 0;
      function toStage(e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * SW, (e.clientY - r.top) / r.height * SH]; }
      function idle(){ return !sc.tl || sc.tl.paused(); }
      // while the timeline is paused, a click or pointer still animates: a short rAF that stops once the threads settle
      function kick(){
        if (raf || !idle()) return;
        lastNow = 0;
        raf = requestAnimationFrame(function step(){
          raf = 0; if (!cv.isConnected || !idle()) return;
          var busy = render();
          if (busy) raf = requestAnimationFrame(step);
        });
      }
      if (!reduce){
        cv.addEventListener('pointerdown', function(e){
          var p = toStage(e); bx = p[0]; by = p[1]; bAt = performance.now();
          for (var i = 0; i < N; i++){
            var dx = DX[i] - bx, dy = DY[i] - by, d = Math.sqrt(dx * dx + dy * dy) || 1, f = 34 * (0.35 + R3[i]) * (1 - smooth(clamp(d / 620, 0, 1)));
            OX[i] += dx / d * f; OY[i] += dy / d * f;
          }
          if (hint) hint.classList.add('is-used');
          kick();
        });
        if (fine){
          cv.addEventListener('pointermove', function(e){ var p = toStage(e); mxp = p[0]; myp = p[1]; kick(); });
          cv.addEventListener('pointerleave', function(){ mxp = myp = -9999; });
        }
      }

      // ---- one frame at the timeline's current time ----
      var tl;
      function render(){
        if (!tl || !cv.isConnected) return false;
        var t = tl.time(), now = performance.now(), dt = lastNow ? clamp((now - lastNow) / 1000, 0, 0.05) : 0.016, FR = dt * 60;
        lastNow = now;
        var ph = 0; for (var k = 1; k < START.length; k++) if (t >= START[k]) ph = k;
        var loc = t - START[ph], fa = F[PH[ph].f], fb = null, bt = 1;
        if (ph > 0 && loc < TR){ fb = fa; fa = F[PH[ph - 1].f]; bt = loc / TR; }
        var nightA = PH[ph].f === 'sky', nightB = ph > 0 && PH[ph - 1].f === 'sky';
        var el = bAt > 0 ? (now - bAt) / 1000 : 9, ripOn = el < 1.6, busy = ripOn;
        var baseLen = P ? 11 : 12, copyEdge = P ? 300 : (ph === 0 ? 560 : 500);
        var i, ux, uy, ang, al, ln, ti;
        for (i = 0; i < N; i++){
          fa(i, t); ux = o[0]; uy = o[1]; ang = o[2]; al = o[3]; ln = o[4];
          var col = C[i];
          if (ph === 0){ // the intro: fly in from outside and settle into the mark, each fiber at its own moment
            var pi = ease3(clamp((t - 0.15 - R1[i] * 1.5) / 1.15, 0, 1));
            if (pi < 1){
              var sw = Math.sin(pi * PI) * 0.25;
              ux = lerp(SX[i], ux, pi) + Math.sin(R2[i] * 30 + t * 2) * sw; uy = lerp(SY[i], uy, pi) + Math.cos(R4[i] * 30 + t * 2) * sw;
              ang = angleLerp(SA[i], ang, pi); al = lerp(0.35, al, pi); ln = lerp(1.6, ln, pi);
            }
          } else if (fb){
            fb(i, t); ti = smooth(clamp(bt * 1.6 - R4[i] * 0.6, 0, 1));
            ux = lerp(ux, o[0], ti); uy = lerp(uy, o[1], ti); ang = angleLerp(ang, o[2], ti); al = lerp(al, o[3], ti); ln = lerp(ln, o[4], ti);
            var loose = Math.sin(ti * PI) * 0.18; ux += Math.sin(R1[i] * 40 + t) * loose; uy += Math.cos(R2[i] * 40 + t) * loose;
            if (nightA && ti > 0.5) col = WHITE;
          }
          if (nightA && !fb) col = WHITE;
          if (nightB && fb && ti < 0.5) col = WHITE;
          var x = CX + ux * RU, y = CY + uy * RU;
          // pointer: fibers part around the cursor; burst offsets ease back
          if (mxp > -999){
            var dx = x + OX[i] - mxp, dy = y + OY[i] - myp, d2 = dx * dx + dy * dy;
            if (d2 < 8100){ var dd = Math.sqrt(d2) || 1, f = (1 - dd / 90) * 4.2; OX[i] += dx / dd * f * FR; OY[i] += dy / dd * f * FR; busy = true; }
          }
          var dk = Math.pow(0.92, FR); OX[i] *= dk; OY[i] *= dk;
          if (OX[i] > 0.3 || OX[i] < -0.3 || OY[i] > 0.3 || OY[i] < -0.3) busy = true;
          x += OX[i]; y += OY[i]; DX[i] = x; DY[i] = y;
          // fade near the copy and the stage edges (loom.js mask(), simplified)
          var m = P ? clamp((y - copyEdge) / 80, 0.15, 1) : clamp((x - copyEdge) / 110, 0.15, 1);
          if (nightA && !fb) m = Math.max(m, 0.55);
          m *= clamp(Math.min(x, SW - x, y, SH - y) / 50, 0, 1);
          var tw = reduce ? 1 : 0.8 + 0.2 * Math.sin(t * 1.7 + R5[i] * 30), rip = 0;
          if (ripOn){ var rd = Math.sqrt((x - bx) * (x - bx) + (y - by) * (y - by)), fr = el * 620, q2 = (rd - fr) / 55; rip = Math.exp(-q2 * q2) * (1 - el / 1.6); }
          var alpha = Math.min(1, al * m * tw + rip * m);
          if (alpha < 0.03){ BK[i] = -1; continue; }
          BK[i] = col * LEVELS + clamp(Math.round(alpha * LEVELS), 1, LEVELS) - 1;
          var hl = baseLen * ln * (1 + rip * 1.5) * (0.7 + R3[i] * 0.6) * 0.5;
          EXA[i] = Math.cos(ang) * hl; EYA[i] = Math.sin(ang) * hl;
        }
        // draw: one stroke per color × opacity step
        ctx.setTransform(DS, 0, 0, DS, 0, 0); ctx.clearRect(0, 0, SW, SH);
        ctx.lineCap = 'round'; ctx.lineWidth = P ? 1.7 : 1.6;
        var b;
        for (b = 0; b <= NB; b++) CNT[b] = 0;
        for (i = 0; i < N; i++) if (BK[i] >= 0) CNT[BK[i] + 1]++;
        for (b = 0; b < NB; b++) CNT[b + 1] += CNT[b];
        for (b = 0; b <= NB; b++) FILL[b] = CNT[b];
        for (i = 0; i < N; i++) if (BK[i] >= 0) ORDER[FILL[BK[i]]++] = i;
        for (b = 0; b < NB; b++){
          if (CNT[b] === CNT[b + 1]) continue;
          ctx.strokeStyle = COLS[Math.floor(b / LEVELS)]; ctx.globalAlpha = ((b % LEVELS) + 1) / LEVELS; ctx.beginPath();
          for (var j = CNT[b]; j < CNT[b + 1]; j++){ i = ORDER[j]; ctx.moveTo(DX[i] - EXA[i], DY[i] - EYA[i]); ctx.lineTo(DX[i] + EXA[i], DY[i] + EYA[i]); }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        return busy;
      }

      // ---- the timeline ----
      var R = X.run(sc, function(){ lastNow = 0; });
      tl = R.tl;
      tl.set(caps.concat(lsets), { autoAlpha: 0 }, 0).set(sky, { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      var drv = { v: 0 };
      tl.to(drv, { v: 1, duration: LOOP + 0.5, ease: 'none', onUpdate: render }, 0);
      PH.forEach(function(p, n){
        var s = START[n], e = n < PH.length - 1 ? START[n + 1] : LOOP;
        tl.addLabel('p' + n, s);
        var c = caps[n], inner = qa(c, '.tw-lm-eb,h3,.tw-lm-tags,.tw-lm-clock'), at = n === 0 ? 1.2 : s + 0.55;
        tl.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, at);
        tl.fromTo(inner, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', immediateRender: false }, at);
        if (n < PH.length - 1) tl.to(c, { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power1.in' }, e - 0.35).set(c, { y: 0 }, e + 0.1);
        var ls = q(st, '.tw-lm-labs[data-p="' + n + '"]');
        if (ls){
          tl.fromTo(qa(ls, '.tw-lm-lab'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.06, immediateRender: false }, s + 1.3);
          tl.fromTo(ls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, s + 1.29);
          tl.to(ls, { autoAlpha: 0, duration: 0.3 }, e - 0.3);
        }
      });
      // night: the navy sky comes up behind the threads (the site's day-to-night section, at 2 am)
      tl.fromTo(sky, { autoAlpha: 0 }, { autoAlpha: 1, duration: TR, ease: 'power1.inOut', immediateRender: false }, START[5]);
      X.end(sc, R, LOOP, REST, PH.map(function(p, n){ return { t: p.chip, at: 'p' + n }; }));
      // seek() suppresses the driver's onUpdate: redraw after every chip / reduced-motion seek
      var os = sc.onSeek; sc.onSeek = function(){ os(); lastNow = 0; render(); };
      render();
    });
  })();
