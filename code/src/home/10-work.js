
  /* =========================================================
     WORK BOARD — frames come from the Missions Collection List ([data-board-frame] + CMS data-*)
     ========================================================= */
  (function(){
    var board = $('#board'), world = $('#world'); if (!board || !world) return;
    var frames = $$('.ab_board_frame', world);
    var cms = frames.filter(function(f){ return !f.classList.contains('is-slot'); });
    var pc = $('#projCount'); if (pc) pc.textContent = cms.length;
    // hand-placed spots for the first missions (board coordinates); later items auto-place in rows of three
    var LAYOUT = [[90, 110, 480, 330], [660, 230, 470, 320], [1220, 90, 440, 300]];
    // previews picked from the slug (the CMS has no preview/pin fields). pinColor = the mission's Brand accent;
    // an optional hidden [data-field=brand-accent] node (BG color bound to Brand accent) overrides it from the CMS
    var PREVIEW = {
      '510-visuals': { type: 'globe', pinColor: '#5eead4', pins: '40.7,-74;40.76,-73.98;36.17,-115.14;35.47,-97.52;37.54,-77.43;34.05,-118.24;24.71,46.68' },
      'daniel-aguirre-law': { type: 'map', pinColor: '#891E2D', pinHome: '#A88B5C', pins: '41.46,-72.82;31,-97.5;36.7,-119.4;32.7,-83.4;40.9,-77.8;35.5,-79.4;28.6,-82.4;42.9,-75.5;39.3,-111.7;34.3,-111.7;37.5,-78.8;42.3,-71.8;40,-89.2;47.4,-120.5' }
    };
    function colorOf(node, prop){
      if (!node) return '';
      var inline = prop === 'bg' ? node.style.backgroundColor : node.style.color;
      if (!inline) return '';
      return rgbToHex(getComputedStyle(node)[prop === 'bg' ? 'backgroundColor' : 'color']);
    }
    // run an animation only while its frame is on screen and the tab is visible
    function whileSeen(el, on, off){
      var seen = false;
      function sync(){ (seen && !document.hidden) ? on() : off(); }
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ seen = es[0].isIntersecting; sync(); }).observe(el); else { seen = true; sync(); }
      document.addEventListener('visibilitychange', sync);
    }
    // Topicweave: the v3 hero loom's opening, scaled down (mission/24-tw-loom.js › mark, 2026-10-04). Short fibers in the four
    // weave colors fly in from outside the card and weave the Topicweave mark (its bar geometry, over/under crossings
    // included), then keep streaming slowly along the bars; a few bone fibers drift loose. Black card, black veils so the
    // white title stays crisp. Runs only while the card is on screen; reduced motion gets the woven mark, still.
    function twLoom(cv, host){
      var TAU = Math.PI * 2, HP = Math.PI / 2, LIL = 0, COR = 1, TEA = 2, COB = 3, BONE = 4;
      var COLS = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff', '#E9E6DF'];
      var MARK = []; // 24-unit box: x0, y0, x1, y1, horizontal
      MARK[COR] = [2.5, 6.53, 21.5, 10.75, true]; MARK[TEA] = [2.5, 13.25, 21.5, 17.47, true];
      MARK[LIL] = [6.53, 2.5, 10.75, 21.5, false]; MARK[COB] = [13.25, 2.5, 17.47, 21.5, false];
      // lilac over coral · coral over cobalt · teal over lilac · cobalt over teal
      function under(c, gx, gy){
        if (c === COR) return gx > 6.53 && gx < 10.75;
        if (c === COB) return gy > 6.53 && gy < 10.75;
        if (c === LIL) return gy > 13.25 && gy < 17.47;
        if (c === TEA) return gx > 13.25 && gx < 17.47;
        return false;
      }
      var N = 440, seed = 20260930, i;
      function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      var F = [];
      for (i = 0; i < N; i++){ var v = rnd(); F.push({ c: v < .12 ? BONE : Math.min(3, Math.floor((v - .12) / .22)), r1: rnd(), r2: rnd(), r3: rnd(), r4: rnd(), r5: rnd() }); }
      var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1, t = 0, raf = 0, running = false, last = 0, intro = reduce ? 9 : 0;
      function size(){ dpr = Math.min(window.devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      function c01(x){ return x < 0 ? 0 : x > 1 ? 1 : x; }
      function draw(){
        if (!w || !h) return;
        var deck = w / h < 1, CX = deck ? w * .5 : w * .74, CY = deck ? h * .3 : h * .37, RU = Math.min(w, h) * (deck ? .32 : .42), L = Math.max(7, RU * .11);
        var buckets = {}, k, f, x, y, a, al, tw, tilt = Math.sin(t * .25) * .05, cs = Math.cos(tilt), sn = Math.sin(tilt);
        for (i = 0; i < N; i++){
          f = F[i];
          if (f.c === BONE){
            x = (f.r1 * 2 - 1) * 1.6 + Math.sin(t * .07 + f.r3 * 9) * .08; y = (f.r2 * 2 - 1) * 1.1 + Math.cos(t * .06 + f.r4 * 9) * .08;
            a = f.r3 * Math.PI + t * .05 * (f.r5 - .5); al = .3 * (.5 + .5 * f.r5);
          } else {
            var b = MARK[f.c], along = (f.r1 + t * .035 * (f.c % 2 ? 1 : -1) * (.8 + f.r4 * .4)) % 1, wob = Math.sin(along * 9 + t * 1.1 + f.c) * .24, gx, gy;
            if (along < 0) along += 1;
            if (b[4]){ gx = b[0] + (b[2] - b[0]) * along; gy = b[1] + .35 + (b[3] - b[1] - .7) * f.r2 + wob; a = 0; }
            else { gy = b[1] + (b[3] - b[1]) * along; gx = b[0] + .35 + (b[2] - b[0] - .7) * f.r2 + wob; a = HP; }
            var ux = (gx - 12) / 11.2, uy = (gy - 12) / 11.2;
            x = ux * cs - uy * sn; y = ux * sn + uy * cs; a += tilt + (f.r3 - .5) * .3; al = under(f.c, gx, gy) ? .2 : 1;
          }
          // the intro: each fiber flies in from outside the card at its own moment
          var p = 1 - Math.pow(1 - c01((intro - .15 - f.r1 * 1.5) / 1.15), 3);
          if (p < 1){
            var th = f.r5 * TAU, far = 1.9 + f.r2 * 1.2, sx = Math.cos(th) * far * (w / RU) * .5, sy = Math.sin(th) * far * (h / RU) * .5, sw = Math.sin(p * Math.PI) * .25;
            x = sx + (x - sx) * p + Math.sin(f.r2 * 30 + intro * 2) * sw; y = sy + (y - sy) * p + Math.cos(f.r4 * 30 + intro * 2) * sw;
            a = f.r3 * Math.PI + (a - f.r3 * Math.PI) * p; al = .35 + (al - .35) * p;
          }
          var X = CX + x * RU, Y = CY + y * RU;
          tw = reduce ? 1 : .8 + .2 * Math.sin(t * 1.7 + f.r5 * 30);
          al *= tw * c01(Math.min(X, w - X, Y, h - Y) / 30);
          if (al < .03) continue;
          k = f.c + '|' + Math.max(1, Math.min(8, Math.round(al * 8)));
          var hl = L * (.7 + f.r3 * .6) * .5;
          (buckets[k] = buckets[k] || []).push(X, Y, Math.cos(a) * hl, Math.sin(a) * hl);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
        ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.5, RU / 70);
        for (k in buckets){
          var s = k.split('|'), q = buckets[k]; ctx.strokeStyle = COLS[+s[0]]; ctx.globalAlpha = +s[1] / 8; ctx.beginPath();
          for (var j = 0; j < q.length; j += 4){ ctx.moveTo(q[j] - q[j + 2], q[j + 1] - q[j + 3]); ctx.lineTo(q[j] + q[j + 2], q[j + 1] + q[j + 3]); }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        // black veils under the title and summary: from the left (wide card), and up from the bottom
        if (!deck){ var g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(.38, 'rgba(0,0,0,.55)'); g.addColorStop(.56, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
        var g2 = ctx.createLinearGradient(0, h * .45, 0, h); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(.5, 'rgba(0,0,0,.88)'); g2.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = g2; ctx.fillRect(0, h * .45, w, h * .55);
      }
      function tick(now){ if (!running) return; var dt = Math.min(64, now - last) / 1000; last = now; t += dt; intro += dt; draw(); raf = requestAnimationFrame(tick); }
      size(); draw();
      if (window.ResizeObserver) new ResizeObserver(function(){ size(); draw(); }).observe(cv);
      if (reduce) return;
      whileSeen(host, function(){ if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(tick); }, function(){ running = false; cancelAnimationFrame(raf); });
    }
    // kip: each face hops in place on its own beat (squash, jump, land)
    function hop(box, host){
      if (reduce || !box.animate) return;
      var anims = [].map.call(box.children, function(s, k){
        return s.animate([
          { transform: 'translateY(0) scale(1,1)' }, { transform: 'translateY(0) scale(1.1,.9)', offset: .14 },
          { transform: 'translateY(-22px) scale(.95,1.06)', offset: .42 }, { transform: 'translateY(0) scale(1,1)', offset: .66 },
          { transform: 'translateY(0) scale(1.06,.94)', offset: .76 }, { transform: 'translateY(0) scale(1,1)' }
        ], { duration: 1300 + k * 170, delay: k * 260, iterations: Infinity, easing: 'ease-in-out' });
      });
      whileSeen(host, function(){ anims.forEach(function(a){ a.play(); }); }, function(){ anims.forEach(function(a){ a.pause(); }); });
    }
    var maxY = 0, autoI = 0;
    frames.forEach(function(f, i){
      var slot = f.classList.contains('is-slot'), L = !slot && LAYOUT[i];
      var W = slot ? (f.offsetWidth || 420) : (L ? L[2] : 440), H = slot ? num(f.getAttribute('data-h'), f.offsetHeight || 230) : (L ? L[3] : 300), x, y;
      if (L){ x = L[0]; y = L[1]; maxY = Math.max(maxY, y + H); }
      else { x = 90 + (autoI % 3) * 540; y = maxY + 90 + Math.floor(autoI / 3) * 380; autoI++; }
      f.__pos = { x: x, y: y, w: W, h: H };
      f.style.left = x + 'px'; f.style.top = y + 'px'; f.style.width = W + 'px'; f.style.height = H + 'px';
      var slug = f.getAttribute('data-slug') || 'frame';
      if (!slot){
        var name = f.getAttribute('data-name') || slug, cover = (f.getAttribute('data-cover') || '').toLowerCase();
        f.setAttribute('href', '/work/' + slug);
        f.setAttribute('aria-label', 'Open the ' + name + ' case study');
        var bg = colorOf($('[data-field="brand-bg"]', f), 'bg'), fg = colorOf($('[data-field="brand-fg"]', f), 'fg');
        var inner = document.createElement('div'); inner.className = 'ab_board_frame-inner';
        inner.style.setProperty('--fbg', bg || '#1c1e24'); inner.style.setProperty('--ffg', fg || '#ffffff');
        f.__bg = bg || '#1c1e24';
        var pv = PREVIEW[slug];
        if (pv){
          var cv = document.createElement('canvas'); cv.className = 'pv'; cv.setAttribute('aria-hidden', 'true'); inner.appendChild(cv);
          var acc = colorOf($('[data-field="brand-accent"]', f), 'bg');
          f.__pv = { type: pv.type, pins: pv.pins, pinHome: pv.pinHome, pinColor: acc || pv.pinColor };
        }
        else if (cover === 'mark'){
          var mk = document.createElement('div'); mk.className = 'pv'; mk.setAttribute('aria-hidden', 'true'); mk.style.cssText = 'position:absolute;right:22px;top:26px;width:170px';
          mk.innerHTML = AB.markSVG({ grid: true });
          inner.appendChild(mk);
        }
        else if (slug === 'topicweave' || slug === 'cks'){
          // Topicweave (was CKS; slug changed 2026-10-04, old one kept as a fallback): the v3 site's black with white type,
          // and its hero loom weaving the mark behind the title (twLoom)
          inner.style.setProperty('--fbg', '#000000'); inner.style.setProperty('--ffg', '#FFFFFF'); f.__bg = '#000000';
          var lc = document.createElement('canvas'); lc.className = 'ab_board_loom'; lc.setAttribute('aria-hidden', 'true');
          lc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';
          inner.appendChild(lc); f.__loom = lc;
        }
        else if (slug === 'kip'){
          // kip's deeper tangerine with white text, and three of June's village hopping in place: the real 3D portraits from
          // kipvillage.com (code/vendor/kip/cast/, Angelino 2026-10-06). Sam, June and Nana: their mint, butter and rose circles read on tangerine
          inner.style.setProperty('--fbg', '#E85F2A'); inner.style.setProperty('--ffg', '#FFFFFF'); f.__bg = '#E85F2A';
          var ar = document.createElement('div'); ar.className = 'ab_board_kip'; ar.setAttribute('aria-hidden', 'true');
          ar.style.cssText = 'position:absolute;right:24px;top:26px;display:flex;gap:10px;align-items:flex-end;z-index:0';
          var KV = (function(){ var s = document.querySelector('script[src*="/code/dist/ab-home"]'); return s ? s.src.replace(/code\/dist\/[^\/]*$/, 'code/vendor/') : 'https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@main/code/vendor/'; })();
          ar.innerHTML = ['sam', 'june', 'nana'].map(function(n){ return '<img src="' + KV + 'kip/cast/' + n + '.webp" alt="" loading="lazy" decoding="async" width="112" height="112">'; }).join('');
          [].forEach.call(ar.children, function(s){ s.style.cssText = 'flex:none;width:64px;height:64px;display:block;transform-origin:50% 100%;filter:drop-shadow(0 4px 6px rgba(30,27,46,.25))'; });
          // phone deck (≤767, frames 4:5): centered and larger, clear of the Open case button, like the deck's canvas previews
          var mq = window.matchMedia('(max-width: 767px)');
          var place = function(){ var d = mq.matches; ar.style.left = d ? '50%' : 'auto'; ar.style.right = d ? 'auto' : '24px'; ar.style.top = d ? '24%' : '26px'; ar.style.transform = d ? 'translateX(-50%) scale(1.3)' : ''; ar.style.transformOrigin = '50% 0'; };
          place(); if (mq.addEventListener) mq.addEventListener('change', place);
          inner.appendChild(ar); f.__hop = ar;
        }
        else if (slug === 'knowledge-system'){
          // a tiny knowledge graph: one entry in the middle, its tags and the pages they link, lines drawing on a loop
          var kg = document.createElement('div'); kg.className = 'pv ab_kg'; kg.setAttribute('aria-hidden', 'true');
          var N = [[40, 30], [40, 90], [40, 150], [200, 22], [212, 90], [200, 158]], ln = '', nd = '';
          N.forEach(function(p, k){ ln += '<path style="--k:' + k + '" d="M120 90C' + (p[0] > 120 ? 160 : 80) + ' 90 ' + (p[0] > 120 ? 160 : 80) + ' ' + p[1] + ' ' + p[0] + ' ' + p[1] + '"/>'; nd += '<rect x="' + (p[0] - (p[0] > 120 ? 0 : 34)) + '" y="' + (p[1] - 9) + '" width="34" height="18" rx="3"/>'; });
          kg.innerHTML = '<svg viewBox="0 0 250 180">' + ln + nd + '<rect class="c" x="92" y="72" width="56" height="36" rx="5"/></svg>';
          inner.appendChild(kg);
        }
        var op = document.createElement('span'); op.className = 'ab_board_fopen'; op.textContent = 'Open case →'; inner.appendChild(op);
        var t = document.createElement('div'); t.className = 'ab_board_ftitle' + (/lora|serif/i.test(f.getAttribute('data-font') || '') ? ' is-serif' : ''); t.textContent = name; inner.appendChild(t);
        var sb = document.createElement('div'); sb.className = 'ab_board_fsub'; sb.textContent = f.getAttribute('data-board-line') || f.getAttribute('data-summary') || ''; inner.appendChild(sb); // Board line (short, Home only) beats Summary
        f.appendChild(inner);
        if (f.__loom || f.__hop){ [t, sb, op].forEach(function(n){ n.style.position = n === op ? 'absolute' : 'relative'; n.style.zIndex = '1'; }); }
        if (f.__loom) twLoom(f.__loom, f);
        if (f.__hop) hop(f.__hop, f);
      }
      if (f.__sel) $('.sel-tag', f.__sel).textContent = 'Frame / ' + slug;
    });

    // previews
    function parsePins(str){ return (str || '').split(';').filter(Boolean).map(function(p){ var a = p.split(','); return [+a[0], +a[1]]; }); }
    function rgba(hx, a){ return 'rgba(' + hex(hx).join(',') + ',' + a + ')'; }
    function globePreview(c, pins, pcol){
      pcol = pcol || '#FF6A3D';
      var S = 230, dp = 2; c.width = S * dp; c.height = S * dp; c.style.width = S + 'px'; c.style.height = S + 'px';
      var ctx = c.getContext('2d'), W = c.width, R = W * .42, rot = 0, visible = false, pts = [];
      for (var la = -80; la <= 80; la += 10) for (var lo = -180; lo < 180; lo += 10) pts.push([la, lo]);
      function proj(la, lo){ var p = la * Math.PI / 180, l = lo * Math.PI / 180 + rot, x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l), tl = .35, y2 = y * Math.cos(tl) - z * Math.sin(tl), z2 = y * Math.sin(tl) + z * Math.cos(tl); return [W / 2 + x * R, W / 2 - y2 * R, z2]; }
      function draw(){
        ctx.clearRect(0, 0, W, W);
        var g = ctx.createRadialGradient(W * .4, W * .38, R * .1, W / 2, W / 2, R); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, W / 2, R, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(W / 2, W / 2, R, 0, 7); ctx.stroke();
        for (var i = 0; i < pts.length; i++){ var p = proj(pts[i][0], pts[i][1]); if (p[2] < 0) continue; ctx.fillStyle = 'rgba(255,255,255,' + (0.15 + p[2] * .5) + ')'; ctx.fillRect(p[0], p[1], 3, 3); }
        pins.forEach(function(pn){ var p = proj(pn[0], pn[1]); if (p[2] < .05) return; ctx.fillStyle = pcol; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(pcol, .45); ctx.beginPath(); ctx.arc(p[0], p[1], 18, 0, 7); ctx.stroke(); });
      }
      onView(c, function(x){ visible = x; });
      draw();
      if (!reduce && hasGsap) gsap.ticker.add(function(t, dt){ if (!visible) return; rot += dt * .00035; draw(); });
    }
    function mapPreview(c, pins, pv){
      var Wd = 300, Hd = 170, dp = 2; c.width = Wd * dp; c.height = Hd * dp; c.style.width = Wd + 'px'; c.style.height = Hd + 'px';
      var ctx = c.getContext('2d'), pcol = pv.pinColor || '#891E2D', home = pv.pinHome || pcol;
      var mask = ['....#######.......................#####.', '...##########.................########..', '..##############............##########..', '..###############################.#####.', '.#####################################..', '.####################################...', '######################################..', '#####################################...', '.###################################....', '..#################################.....', '...###############################......', '....##########.....##############.......', '......######........#########.###.......', '.......###...........######...###.......', '......................###.....###.......', '..............................##........'];
      var cols = mask[0].length, rows = mask.length, cw = c.width / cols, rh = c.height / rows, visible = false, t0 = performance.now();
      function xy(p){ return [(p[1] + 125) / 59 * c.width, (50 - p[0]) / 26 * c.height]; }
      function draw(t){
        ctx.clearRect(0, 0, c.width, c.height);
        for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) if (mask[r][q] === '#'){ ctx.fillStyle = 'rgba(26,50,92,.28)'; ctx.beginPath(); ctx.arc(q * cw + cw / 2, r * rh + rh / 2, Math.min(cw, rh) * .28, 0, 7); ctx.fill(); }
        pins.forEach(function(p, i){
          var P = xy(p), k = ((t - t0) / 1600 + i * .17) % 1;
          ctx.strokeStyle = pcol; ctx.globalAlpha = (1 - k) * .6; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(P[0], P[1], 9 + k * 22, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
          ctx.fillStyle = i === 0 ? home : pcol; ctx.beginPath(); ctx.arc(P[0], P[1], 8, 0, 7); ctx.fill();
        });
      }
      onView(c, function(x){ visible = x; });
      draw(t0);
      if (!reduce && hasGsap) gsap.ticker.add(function(){ if (visible) draw(performance.now()); });
    }
    frames.forEach(function(f){
      var cv = $('canvas.pv', f); if (!cv || !f.__pv) return;
      if (f.__pv.type === 'globe') globePreview(cv, parsePins(f.__pv.pins), f.__pv.pinColor);
      if (f.__pv.type === 'map') mapPreview(cv, parsePins(f.__pv.pins), f.__pv);
    });

    function openFrame(f, e){
      if (f.classList.contains('is-slot')){ if (e) e.preventDefault(); var t = $('#launch'); if (t) warp(function(){ AB.scrollToTarget(t); }); return; }
      if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return; // new tab: let the browser handle it
      if (e) e.preventDefault();
      var href = f.getAttribute('href');
      AB.go(href);
    }

    if (!hasGsap){ frames.forEach(function(f){ f.addEventListener('click', function(e){ if (f.classList.contains('is-slot')) openFrame(f, e); }); }); return; }

    /* ---------- phones: swipe deck ---------- */
    if (innerWidth < 768){
      board.classList.add('is-deck');
      frames.forEach(function(f){ f.addEventListener('click', function(e){ openFrame(f, e); }); });
      var dots = document.createElement('div'); dots.className = 'ab_deck-dots';
      frames.forEach(function(f){ var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show ' + (f.getAttribute('data-slug') || 'frame')); b.addEventListener('click', function(){ world.scrollTo({ left: f.offsetLeft - (world.clientWidth - f.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' }); }); dots.appendChild(b); });
      board.parentNode.insertBefore(dots, board.nextSibling);
      var help = $('.ab_board_help'); if (help) help.innerHTML = '<div>Swipe the deck · tap a frame to open it</div>';
      // the tilt goes on each frame's inner layer, never the frame: iOS Safari re-snaps a scroll-snap target whose style
      // changes mid-swipe (the deck jumped back to the same card). The selection only changes when the centered card does.
      var tilts = frames.map(function(f){ return $('.ab_board_frame-inner', f); }), cur = -1;
      var update = function(){
        var mid = world.scrollLeft + world.clientWidth / 2, best = 0, bd = 1e9;
        frames.forEach(function(f, i){
          var c = f.offsetLeft + f.offsetWidth / 2, off = (c - mid) / world.clientWidth, a = Math.abs(off);
          if (a < bd){ bd = a; best = i; }
          // the vanishing point stays at the middle of the deck (the old perspective on the scroller), not each card's own
          var D = (c - mid).toFixed(1);
          if (!reduce && tilts[i]) tilts[i].style.transform = 'translateX(' + (-D) + 'px) perspective(900px) translateX(' + D + 'px) rotateY(' + (-off * 28) + 'deg) scale(' + (1 - Math.min(a, 1) * .1) + ')';
        });
        if (best === cur) return; cur = best;
        frames.forEach(function(f, i){
          f.classList.toggle('is-selected', i === best);
          // the size tag was measured before the deck laid the frames out (it read 0 × 0)
          var sz = i === best && f.__sel && $('.sel-size', f.__sel); if (sz && !f.getAttribute('data-size')) sz.textContent = Math.round(f.offsetWidth) + ' × ' + Math.round(f.offsetHeight);
        });
        $$('button', dots).forEach(function(b, i){ b.classList.toggle('on', i === best); });
      };
      // iOS Safari fallback: some iPhones never scroll the deck natively. If a sideways drag hasn't moved it after 10px,
      // the script drags it with the finger (snap off so WebKit doesn't fight each write), then glides to a card: a flick
      // goes one card that way, a slow drag settles on the nearest. Where native swiping works this never kicks in.
      var center = function(i){ var f = frames[Math.max(0, Math.min(frames.length - 1, i))]; world.scrollTo({ left: f.offsetLeft - (world.clientWidth - f.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' }); };
      var g = null, snapBack = 0;
      world.addEventListener('touchstart', function(e){
        if (e.touches.length > 1){ g = null; return; }
        var t = e.touches[0]; clearTimeout(snapBack);
        g = { x: t.clientX, y: t.clientY, sl: world.scrollLeft, from: cur < 0 ? 0 : cur, dir: 0, man: false, lx: t.clientX, lt: Date.now(), vx: 0 };
      }, { passive: true });
      world.addEventListener('touchmove', function(e){
        if (!g) return;
        var t = e.touches[0], dx = t.clientX - g.x, dy = t.clientY - g.y, now = Date.now();
        if (!g.dir && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) g.dir = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (g.dir !== 'x') return;
        if (now > g.lt){ g.vx = .7 * g.vx + .3 * (t.clientX - g.lx) / (now - g.lt); g.lx = t.clientX; g.lt = now; }
        if (!g.man && Math.abs(dx) > 10 && Math.abs(world.scrollLeft - g.sl) < 2){ g.man = true; world.style.scrollSnapType = 'none'; g.x = t.clientX + (world.scrollLeft - g.sl); }
        if (g.man) world.scrollLeft = g.sl - (t.clientX - g.x);
      }, { passive: true });
      var end = function(){
        if (!g) return; var m = g; g = null; if (!m.man) return;
        var mid = world.scrollLeft + world.clientWidth / 2, near = 0, bd = 1e9;
        frames.forEach(function(f, i){ var d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid); if (d < bd){ bd = d; near = i; } });
        var to = Math.abs(m.vx) > .3 ? m.from + (m.vx < 0 ? 1 : -1) : near;
        center(to);
        snapBack = setTimeout(function(){ world.style.scrollSnapType = ''; }, reduce ? 0 : 800);
      };
      world.addEventListener('touchend', end, { passive: true }); world.addEventListener('touchcancel', end, { passive: true });
      var raf = 0; world.addEventListener('scroll', function(){ if (!raf) raf = requestAnimationFrame(function(){ raf = 0; update(); }); }, { passive: true });
      update(); addEventListener('resize', function(){ cur = -1; update(); });
      if (!reduce) ScrollTrigger.create({ trigger: board, start: 'top 85%', once: true, onEnter: function(){ gsap.from(frames, { x: 80, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', clearProps: 'transform,opacity' }); } });
      return;
    }

    /* ---------- desktop / tablet: pan, zoom, drag frames, layers, minimap, a second cursor ---------- */
    var viewport = $('#viewport'), zPct = $('#zPct'), coords = $('#boardCoords'), layers = $('#layers'), mm = $('#minimap'), mv = $('#mv');
    var S = 1, lastFrameDrag = 0, lastInteract = 0;
    var bb = frames.reduce(function(a, f){ var p = f.__pos; return { l: Math.min(a.l, p.x), t: Math.min(a.t, p.y), r: Math.max(a.r, p.x + p.w), b: Math.max(a.b, p.y + p.h) }; }, { l: 1e9, t: 1e9, r: -1e9, b: -1e9 });
    var WW = bb.r + 120, WH = bb.b + 120; world.style.width = WW + 'px'; world.style.height = WH + 'px';
    var MMS = Math.min(150 / WW, 90 / WH);
    frames.forEach(function(f){
      var slug = f.getAttribute('data-slug');
      if (layers){ var b = document.createElement('button'); b.type = 'button'; b.textContent = '▢ ' + slug; b.setAttribute('data-target', slug); layers.appendChild(b); }
      if (mm && mv){
        var m = document.createElement('div'); m.className = 'm';
        m.style.left = f.__pos.x * MMS + 'px'; m.style.top = f.__pos.y * MMS + 'px'; m.style.width = f.__pos.w * MMS + 'px'; m.style.height = f.__pos.h * MMS + 'px';
        if (f.classList.contains('is-slot')){ m.style.background = 'transparent'; m.style.border = '1px dashed rgba(255,255,255,.22)'; } else m.style.background = f.__bg;
        mm.insertBefore(m, mv); f.__m = m;
      }
    });
    function updateMM(){
      var x = gsap.getProperty(world, 'x'), y = gsap.getProperty(world, 'y');
      if (mv){
        mv.style.left = (-x / S) * MMS + 'px'; mv.style.top = (-y / S) * MMS + 'px';
        mv.style.width = (viewport.offsetWidth / S) * MMS + 'px'; mv.style.height = (viewport.offsetHeight / S) * MMS + 'px';
      }
      if (coords) coords.textContent = 'X ' + Math.round(-x / S) + ' · Y ' + Math.round(-y / S);
      frames.forEach(function(f){ if (f.__m) f.__m.style.transform = 'translate(' + gsap.getProperty(f, 'x') * MMS + 'px,' + gsap.getProperty(f, 'y') * MMS + 'px)'; });
    }
    function fit(animate){
      var vw = viewport.offsetWidth, vh = viewport.offsetHeight, bw = bb.r - bb.l + 120, bh = bb.b - bb.t + 120;
      var ns = Math.max(.3, Math.min(1, Math.min(vw / bw, vh / bh)));
      var nx = (vw - bw * ns) / 2 - (bb.l - 60) * ns, ny = (vh - bh * ns) / 2 - (bb.t - 60) * ns;
      S = ns; zPct.textContent = Math.round(S * 100) + '%';
      gsap.to(world, { scale: S, x: nx, y: ny, duration: animate ? .8 : 0, ease: 'power3.inOut', onUpdate: updateMM, onComplete: updateMM });
    }
    function zoomTo(ns){
      ns = Math.max(.3, Math.min(1.6, ns));
      var vw = viewport.offsetWidth / 2, vh = viewport.offsetHeight / 2, x = gsap.getProperty(world, 'x'), y = gsap.getProperty(world, 'y');
      var nx = vw - (vw - x) * (ns / S), ny = vh - (vh - y) * (ns / S);
      S = ns; zPct.textContent = Math.round(S * 100) + '%';
      gsap.to(world, { scale: S, x: nx, y: ny, duration: .45, ease: 'power3.out', onUpdate: updateMM });
    }
    gsap.set(world, { transformOrigin: '0 0' }); fit(false);
    addEventListener('resize', function(){ fit(false); });
    $('#zIn').addEventListener('click', function(){ zoomTo(S + .15); });
    $('#zOut').addEventListener('click', function(){ zoomTo(S - .15); });
    var focused = null; // the layer the board is zoomed in on
    $('#zFit').addEventListener('click', function(){ focused = null; fit(true); });
    viewport.addEventListener('wheel', function(e){ if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); e.stopPropagation(); zoomTo(S * (e.deltaY > 0 ? .92 : 1.08)); }, { passive: false });

    Draggable.create(world, { type: coarse ? 'x' : 'x,y', trigger: viewport, inertia: true, dragClickables: false, allowNativeTouchScrolling: true,
      clickableTest: function(el){ return !!(el.closest && el.closest('.ab_board_frame')); },
      onPress: function(){ lastInteract = Date.now(); }, onDrag: updateMM, onThrowUpdate: updateMM });

    function select(f){
      frames.forEach(function(o){ o.classList.toggle('is-selected', o === f); });
      if (layers) $$('button', layers).forEach(function(b){ b.classList.toggle('is-on', b.getAttribute('data-target') === f.getAttribute('data-slug')); });
    }
    frames.forEach(function(f){
      Draggable.create(f, { type: 'x,y', inertia: true, allowNativeTouchScrolling: coarse,
        onPress: function(){ lastInteract = Date.now(); select(f); },
        onDragStart: function(){ gsap.to(f, { rotation: gsap.utils.random(-2, 2), duration: .3 }); },
        onDrag: updateMM, onThrowUpdate: updateMM,
        onDragEnd: function(){ lastFrameDrag = Date.now(); gsap.to(f, { rotation: 0, duration: .5 }); } });
      f.addEventListener('click', function(e){
        if (Date.now() - lastFrameDrag < 250){ e.preventDefault(); return; }
        openFrame(f, e);
      });
    });
    if (layers) $$('button', layers).forEach(function(b){
      b.addEventListener('click', function(){
        var f = frames.filter(function(x){ return x.getAttribute('data-slug') === b.getAttribute('data-target'); })[0]; if (!f) return;
        select(f); lastInteract = Date.now();
        // a layer zooms in on its frame (~126%, less if the frame wouldn't fit); the same layer again zooms back out to fit
        var slug = b.getAttribute('data-target');
        if (focused === slug){ focused = null; fit(true); return; }
        focused = slug;
        var vw = viewport.offsetWidth, vh = viewport.offsetHeight, ns = Math.max(.3, Math.min(1.26, vw * .9 / f.offsetWidth, vh * .9 / f.offsetHeight));
        var cx = (f.offsetLeft + gsap.getProperty(f, 'x') + f.offsetWidth / 2) * ns, cy = (f.offsetTop + gsap.getProperty(f, 'y') + f.offsetHeight / 2) * ns;
        S = ns; zPct.textContent = Math.round(S * 100) + '%';
        gsap.to(world, { scale: S, x: vw / 2 - cx, y: vh / 2 - cy, duration: .9, ease: 'power3.inOut', onUpdate: updateMM, onComplete: updateMM });
      });
    });

    var you = $('#youTag');
    if (you && !coarse){
      viewport.addEventListener('pointermove', function(e){ var r = viewport.getBoundingClientRect(); gsap.set(you, { x: e.clientX - r.left + 14, y: e.clientY - r.top + 10 }); you.style.opacity = 1; lastInteract = Date.now(); });
      viewport.addEventListener('pointerleave', function(){ you.style.opacity = 0; });
    }

    // "Angelino" cursor visits frames in CMS order
    var fake = $('#fakeCursor'), oi = 0, boardVisible = false;
    if (fake){
      gsap.set(fake, { x: 60, y: 60 });
      onView(board, function(x){ boardVisible = x; });
      var wander = function(){
        if (reduce){ gsap.set(fake, { opacity: 0 }); return; }
        if (!boardVisible || focused || Date.now() - lastInteract < 5000){ gsap.to(fake, { opacity: .25, duration: .3 }); gsap.delayedCall(1.5, wander); return; }
        gsap.to(fake, { opacity: 1, duration: .3 });
        var f = frames[oi++ % frames.length], vr = viewport.getBoundingClientRect(), r = f.getBoundingClientRect();
        var tx = gsap.utils.clamp(10, vr.width - 110, r.left - vr.left + r.width * gsap.utils.random(.35, .7)), ty = gsap.utils.clamp(10, vr.height - 40, r.top - vr.top + r.height * gsap.utils.random(.3, .7));
        gsap.to(fake, { x: tx, y: ty, duration: gsap.utils.random(1.2, 1.9), ease: 'power2.inOut', onComplete: function(){
          if (Date.now() - lastInteract < 5000){ gsap.delayedCall(1.5, wander); return; }
          select(f);
          var dx = gsap.utils.random(-24, 24), dy = gsap.utils.random(-14, 14), cx = gsap.getProperty(f, 'x'), cy = gsap.getProperty(f, 'y');
          if (Math.abs(cx + dx) > 80) dx = -dx;
          if (Math.abs(cy + dy) > 50) dy = -dy;
          gsap.to(f, { x: '+=' + dx, y: '+=' + dy, duration: .8, delay: .35, ease: 'power2.inOut', onUpdate: updateMM });
          gsap.to(fake, { x: '+=' + dx * S, y: '+=' + dy * S, duration: .8, delay: .35, ease: 'power2.inOut' });
          gsap.delayedCall(2.4, wander);
        } });
      };
      gsap.delayedCall(2, wander);
    }
    updateMM();
  })();
