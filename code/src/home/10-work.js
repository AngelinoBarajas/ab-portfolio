
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
    // CKS: the hero loom from cks-src/js/cks.js, scaled down (fewer threads, smaller wave), no pointer parting
    function miniLoom(cv, host){
      var TH = ['#F2A93B', '#EF5B3F', '#139E8A', '#2F5BEA', '#EDE6DA'], seed = 5, bands = [];
      function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
      [[0, 5], [4, 3], [2, 6], [4, 2], [3, 5], [1, 3], [4, 2], [0, 4]].forEach(function(b){ for (var k = 0; k < b[1]; k++) bands.push({ col: TH[b[0]], j: rnd() * 2 - 1 }); });
      var ctx = cv.getContext('2d'), w = 0, h = 0, t = 7.3, raf = 0, running = false, last = 0;
      function size(){ var dpr = Math.min(window.devicePixelRatio || 1, 2); w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      function draw(){
        if (!w || !h) return;
        var n = bands.length, sp = 5.5, ww = 4, gap = 8, cx0 = w * .74, tilt = -.42, half = n * sp / 2, rows = Math.ceil(h / gap) + 2, X = [], r, i, y, col;
        ctx.clearRect(0, 0, w, h);
        for (r = 0; r < rows; r++){ y = r * gap; for (i = 0; i < n; i++) X[r * n + i] = cx0 + (i * sp - half) + (y - h * .3) * tilt + 24 * Math.sin(y * .011 + t * .32) + 5 * Math.sin(y * .034 - t * .55 + i * .045) + bands[i].j * .8; }
        ctx.lineWidth = ww; var by = {};
        for (i = 0; i < n; i++) (by[bands[i].col] = by[bands[i].col] || []).push(i);
        for (col in by){ ctx.strokeStyle = col; ctx.beginPath(); by[col].forEach(function(i){ ctx.moveTo(X[i], -gap); for (var r = 0; r < rows; r++) ctx.lineTo(X[r * n + i], r * gap); }); ctx.stroke(); }
        ctx.fillStyle = 'rgba(11,27,43,.16)';
        for (r = 0; r < rows; r++) for (i = 0; i < n; i++) if (((i + r) & 3) >= 2) ctx.fillRect(X[r * n + i] - ww / 2, r * gap - 2, ww, 4);
        ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(11,27,43,.26)'; ctx.beginPath();
        for (r = 0; r < rows; r++){ y = r * gap + .5; var x = 0; for (i = 0; i < n; i++){ var xc = X[r * n + i]; if (((i + r) & 3) < 2){ var a = xc - ww / 2 - .5; if (a > x){ ctx.moveTo(x, y); ctx.lineTo(a, y); } x = xc + ww / 2 + .5; } } if (x < w){ ctx.moveTo(x, y); ctx.lineTo(w, y); } }
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.22)';
        for (r = 0; r < rows; r++) for (i = 0; i < n; i++) if (((i + r) & 3) === 0) ctx.fillRect(X[r * n + i] - ww / 2 + .6, r * gap - gap * .5, 1.2, gap);
        // veils in the paper color so the title and summary stay crisp: from the left, and up from the bottom
        var g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(247,245,240,1)'); g.addColorStop(.4, 'rgba(247,245,240,.9)'); g.addColorStop(.62, 'rgba(247,245,240,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        var g2 = ctx.createLinearGradient(0, h * .32, 0, h); g2.addColorStop(0, 'rgba(247,245,240,0)'); g2.addColorStop(.45, 'rgba(247,245,240,.94)'); g2.addColorStop(1, 'rgba(247,245,240,1)');
        ctx.fillStyle = g2; ctx.fillRect(0, h * .32, w, h * .68);
      }
      function tick(now){ if (!running) return; t += Math.min(64, now - last) / 1000; last = now; draw(); raf = requestAnimationFrame(tick); }
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
        else if (slug === 'cks'){
          // a small version of the CKS hero loom (cks-src/js/cks.js), drifting behind the title
          var lc = document.createElement('canvas'); lc.className = 'ab_board_loom'; lc.setAttribute('aria-hidden', 'true');
          lc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';
          inner.appendChild(lc); f.__loom = lc;
        }
        else if (slug === 'kip'){
          // kip's deeper tangerine with white text, and three caregivers hopping in place (kip press-kit SVGs; Sam, Nana,
          // Rosa: blue, yellow and green read on tangerine, Ari's orange wouldn't)
          inner.style.setProperty('--fbg', '#E85F2A'); inner.style.setProperty('--ffg', '#FFFFFF'); f.__bg = '#E85F2A';
          var ar = document.createElement('div'); ar.className = 'ab_board_kip'; ar.setAttribute('aria-hidden', 'true');
          ar.style.cssText = 'position:absolute;right:24px;top:26px;display:flex;gap:10px;align-items:flex-end;z-index:0';
          ar.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="24" y="8" width="72" height="108" rx="36" fill="#6FA8FF"/><path d="M52 10c2-8 12-8 14-2" fill="none" stroke="#6FA8FF" stroke-width="6" stroke-linecap="round"/><path d="M44 44h10M66 44h10" stroke="#1E1B2E" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="42" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="78" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="49" cy="56" r="4.6" fill="#1E1B2E"/><circle cx="71" cy="56" r="4.6" fill="#1E1B2E"/><path d="M52 67 Q60 79 68 67 Z" fill="#1E1B2E"/></svg><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="22" r="13" fill="#FFC94A"/><path d="M8 114C8 58 28 32 60 32s52 26 52 82Z" fill="#FFC94A"/><ellipse cx="38" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="82" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="45" cy="72" r="4.6" fill="#1E1B2E"/><circle cx="75" cy="72" r="4.6" fill="#1E1B2E"/><path d="M53 85 Q60 92 67 85" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/><circle cx="45" cy="72" r="10" fill="none" stroke="#1E1B2E" stroke-width="2.8"/><circle cx="75" cy="72" r="10" fill="none" stroke="#1E1B2E" stroke-width="2.8"/><path d="M55 72h10" stroke="#1E1B2E" stroke-width="2.8"/></svg><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 24c-6-12 0-20 10-22 2 10-2 18-10 22Z" fill="#2E9E76"/><path d="M60 24c-4-10-14-12-22-8 4 8 12 11 22 8Z" fill="#5FD3A8"/><path d="M20 58c0-24 14-34 40-34s40 10 40 34v20c0 26-14 36-40 36S20 104 20 78Z" fill="#5FD3A8"/><ellipse cx="40" cy="76" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="80" cy="76" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="47" cy="66" r="4.6" fill="#1E1B2E"/><circle cx="73" cy="66" r="4.6" fill="#1E1B2E"/><path d="M53 79 Q60 86 67 79" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/></svg>';
          [].forEach.call(ar.children, function(s){ s.style.cssText = 'flex:none;width:58px;height:58px;overflow:visible;transform-origin:50% 100%'; });
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
        var sb = document.createElement('div'); sb.className = 'ab_board_fsub'; sb.textContent = f.getAttribute('data-summary') || ''; inner.appendChild(sb);
        f.appendChild(inner);
        if (f.__loom || f.__hop){ [t, sb, op].forEach(function(n){ n.style.position = n === op ? 'absolute' : 'relative'; n.style.zIndex = '1'; }); }
        if (f.__loom) miniLoom(f.__loom, f);
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
