/*! AB Portfolio · ab-home v0.17.0 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abHomeInit) return;
  window.__abHomeInit = true;
  var __steps = [];
  /* ===== home/00-hero.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-home] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, num = AB.num, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, warp = AB.warp, lenis = AB.lenis, sf = AB.sf, S0 = AB.settings, QUOTES = AB.quotes;
  var buildPlanet = AB.buildPlanet, hex = AB.hex, rgbToHex = AB.rgbToHex, onView = AB.onView, esc = AB.esc, pad2 = AB.pad2, nudge = AB.nudge;
  var canDrag = hasGsap && !!window.Draggable;

  /* ---------- text effects on heading spans (the Webflow spans carry no effect class) ---------- */
  [['#work-h', 't-outline'], ['#cap-h', 't-outline'], ['#log-h', 't-outline'], ['#orbit-h', 't-orbit'], ['#launch-h', 't-stars']].forEach(function(m){
    var h = $(m[0]); if (!h) return;
    $$('span', h).forEach(function(s){ if (s.parentNode === h && !s.className) s.classList.add(m[1]); });
  });
  if (reduce || !hasGsap) AB.decorate(document);

  /* ---------- hero headline (Site Settings · Headline): words become draggable; *word* = accent, ~word~ = outline ---------- */
  var ht = $('#heroTitle');
  if (ht){
    var head = S0.headline || ht.textContent.trim();
    ht.setAttribute('aria-label', head.replace(/[*~]/g, ''));
    ht.innerHTML = '';
    head.split(/\s+/).forEach(function(w){
      var s = document.createElement('span'); s.className = 'w'; s.setAttribute('data-drag', ''); s.setAttribute('data-snap', ''); s.tabIndex = 0;
      if (/^\*.*\*$/.test(w)){ s.classList.add('accent'); w = w.slice(1, -1); }
      if (/^~.*~$/.test(w)){ s.classList.add('t-outline'); w = w.slice(1, -1); }
      s.textContent = w; ht.appendChild(s);
    });
  }

  /* ---------- hero headline: on phones + tablets, size it so the longest word spans the column ---------- */
  (function(){
    if (!ht) return;
    var fitW = 0;
    function fitHero(e){
      // the size depends on width only: a phone's address bar showing/hiding (height-only resize) must not refresh ScrollTrigger
      if (e && e.type === 'resize' && innerWidth === fitW) return; fitW = innerWidth;
      if (innerWidth >= 1100){ ht.style.fontSize = ''; return; }
      var ws = $$('.w', ht), avail = ht.clientWidth; ht.style.fontSize = '100px';
      var widest = Math.max.apply(null, ws.map(function(w){ return w.getBoundingClientRect().width / ((hasGsap && gsap.getProperty(w, 'scaleX')) || 1); }));
      ht.style.fontSize = Math.min(170, Math.floor(100 * avail * .985 / widest)) + 'px';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    fitHero(); addEventListener('resize', fitHero); if (document.fonts) document.fonts.ready.then(fitHero);
  })();

  /* ---------- hero entrance ---------- */
  if (hasGsap && !reduce){
    gsap.from('#heroTitle .w', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .09, delay: .15 });
    gsap.from('.ab_hero_bottom > *, .ab_hero_meta, #hero .ab_planet, .ab_hero_badge, .ab_hero_sat', { opacity: 0, y: 20, duration: .9, stagger: .06, delay: .5, ease: 'power3.out' });
  }

  /* ---------- hero toys (anything with data-drag in the hero) ---------- */
  var hero = $('#hero');
  var badge = $('.ab_hero_badge'), sat = $('#sat');
  if (badge){ badge.tabIndex = 0; badge.setAttribute('aria-label', 'Draggable badge: design and build, established 2026'); }
  if (sat){ sat.tabIndex = 0; sat.setAttribute('aria-label', 'Satellite. Please do not drag it.'); }
  if (hero && canDrag){
    $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: schedule, onThrowComplete: schedule });
      nudge(el, schedule);
    });
    // badge: rotating text ring, a tiny moon orbiting the core, spins up on hover
    if (badge && !reduce){
      var ringTw = gsap.to($('.ring', badge), { rotation: 360, svgOrigin: '60 60', duration: 20, ease: 'none', repeat: -1 });
      var moonTw = gsap.to($('.moonorbit', badge), { rotation: -360, svgOrigin: '60 60', duration: 6, ease: 'none', repeat: -1 });
      gsap.to($('.core', badge), { scale: .8, svgOrigin: '60 60', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      badge.addEventListener('pointerenter', function(){ gsap.to([ringTw, moonTw], { timeScale: 6, duration: .5 }); });
      badge.addEventListener('pointerleave', function(){ gsap.to([ringTw, moonTw], { timeScale: 1, duration: 1.2 }); });
    }
  }
  if (sat && canDrag){
    // satellite idles: slow drift and roll, separate from the drag transform
    if (!reduce) gsap.to($('.ab_hero_sat-body', sat), { y: -7, rotation: 8, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    var satDrags = 0, satGone = false;
    // keep the satellite in open space: default spot, else the first gap that doesn't overlap anything
    var placeSat = function(){
      if (innerWidth <= 767) return;
      sat.style.top = ''; sat.style.right = '';
      var blockers = $$('#heroTitle .w, #hero .ab_planet, .ab_hero_bottom > *, .ab_hero_meta > *, .ab_hero_badge');
      var hits = function(){ var s = sat.getBoundingClientRect(); return blockers.some(function(e){ var r = e.getBoundingClientRect(); return !(r.right < s.left - 8 || r.left > s.right + 8 || r.bottom < s.top - 8 || r.top > s.bottom + 8); }); };
      var spots = [['', ''], ['104px', '22vw'], ['104px', '8vw'], ['104px', '34vw'], ['170px', '6vw'], ['150px', '44vw'], ['210px', '30vw']];
      for (var i = 0; i < spots.length; i++){ sat.style.top = spots[i][0]; sat.style.right = spots[i][1]; if (!hits()) return; }
      sat.style.top = ''; sat.style.right = '';
    };
    placeSat(); setTimeout(placeSat, 1800); addEventListener('resize', placeSat); if (document.fonts) document.fonts.ready.then(placeSat);
    Draggable.create(sat, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .5,
      onDragStart: function(){ gsap.to(sat, { rotation: gsap.utils.random(-40, 40), duration: .4 }); },
      onDragEnd: function(){
        satDrags++;
        if (satDrags === 1) toast('It says do not drag.');
        if (satDrags === 3) toast('Seriously. It is load-bearing.');
        if (satDrags >= 5 && !satGone){
          satGone = true; this.disable(); var d = this;
          toast('You had one job.');
          gsap.to(sat, { x: innerWidth, y: -300, rotation: 720, duration: 2.6, ease: 'power2.in', onComplete: function(){
            gsap.set(sat, { x: -innerWidth, y: 200, rotation: -200 });
            gsap.to(sat, { x: 0, y: 0, rotation: 0, duration: 3, delay: 3, ease: 'power3.out', onComplete: function(){ satDrags = 0; satGone = false; d.enable(); } });
          } });
        }
      } });
    nudge(sat);
  }

  /* ---------- drag cue: until someone drags something, a word tugs and a "drag me" hand appears (AB.dragCue in core) ---------- */
  (function(){
    var comp = $('.ab_hero_component'), first = $('#heroTitle .w');
    if (!comp || !first || !canDrag || !AB.dragCue) return;
    // any press on a draggable hero thing counts as "found it"
    AB.dragCue({ host: comp, first: first, items: $$('[data-drag], #sat', hero), key: 'ab:dragged', at: 'end', tug: -5 });
  })();

  __steps.push(function(){
  /* ===== home/05-quotes.js ===== */
  /* ---------- testimonials: Missions › Client quote (the Designer list filters out Hide from site). A mission
     without a quote drops out; with no quotes left the whole section hides, so a removed client leaves no trace. ---------- */
  (function(){
    var sec = $('.section_testimonials'); if (!sec) return;
    $$('.ab_quotes .w-dyn-item', sec).forEach(function(it){
      var q = $('.ab_quote_text', it);
      if (!q || !q.textContent.trim() || q.classList.contains('w-dyn-bind-empty')) it.parentNode.removeChild(it);
    });
    if (!$('.ab_quotes .ab_quote', sec)) sec.style.display = 'none';
  })();

  });
  __steps.push(function(){
  /* ===== home/10-work.js ===== */

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
      var update = function(){
        var mid = world.scrollLeft + world.clientWidth / 2, best = 0, bd = 1e9;
        frames.forEach(function(f, i){
          var c = f.offsetLeft + f.offsetWidth / 2, off = (c - mid) / world.clientWidth, a = Math.abs(off);
          if (a < bd){ bd = a; best = i; }
          if (!reduce) f.style.transform = 'rotateY(' + (-off * 28) + 'deg) scale(' + (1 - Math.min(a, 1) * .1) + ')';
        });
        frames.forEach(function(f, i){ f.classList.toggle('is-selected', i === best); });
        $$('button', dots).forEach(function(b, i){ b.classList.toggle('on', i === best); });
      };
      var raf = 0; world.addEventListener('scroll', function(){ if (!raf) raf = requestAnimationFrame(function(){ raf = 0; update(); }); }, { passive: true });
      update(); addEventListener('resize', update);
      if (!reduce) ScrollTrigger.create({ trigger: board, start: 'top 85%', once: true, onEnter: function(){ gsap.from(frames, { x: 80, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', clearProps: 'opacity' }); } });
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
    $('#zFit').addEventListener('click', function(){ fit(true); });
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
        var cx = (f.offsetLeft + gsap.getProperty(f, 'x') + f.offsetWidth / 2) * S, cy = (f.offsetTop + gsap.getProperty(f, 'y') + f.offsetHeight / 2) * S;
        gsap.to(world, { x: viewport.offsetWidth / 2 - cx, y: viewport.offsetHeight / 2 - cy, duration: .8, ease: 'power3.inOut', onUpdate: updateMM });
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
        if (!boardVisible || Date.now() - lastInteract < 5000){ gsap.to(fake, { opacity: .25, duration: .3 }); gsap.delayedCall(1.5, wander); return; }
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

  });
  __steps.push(function(){
  /* ===== home/20-services.js ===== */

  /* ---------- services bento (spotlight + tilt come from core AB.cardFx) ---------- */
  var cards = $$('#capabilities .ab_bento-card');
  if (hasGsap && !coarse && !reduce && cards.length){
    gsap.from(cards, { y: 40, opacity: 0, duration: .9, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.ab_bento_grid', start: 'top 85%', once: true } });
  }

  /* ---------- bento visuals (card data-visual → .ab_bento-card_viz) ---------- */
  var VIZ = {
    navigator: function(v){
      var rows = [['section_services', 0], ['padding-global', 1], ['container-large', 2], ['services_component', 3], ['services_content', 4], ['heading-style-h2', 5], ['button-group', 5], ['services_visual', 4]];
      v.innerHTML = '<div class="v-nav"><div class="v-tree">' + rows.map(function(r, i){ return '<div data-r="' + i + '" style="padding-left:' + (12 + r[1] * 12) + 'px">' + r[0] + '</div>'; }).join('') + '</div>' +
        '<div class="v-wire"><div data-i="0" data-label="section_services"><div data-i="1" data-label="padding-global"><div data-i="2" data-label="container-large"><div data-i="3" data-label="services_component" class="row">' +
        '<div data-i="4" data-label="services_content"><div data-i="5" data-label="heading-style-h2"><div class="bar"></div><div class="bar" style="width:70%"></div></div><div class="bar s"></div><div class="bar s" style="width:40%"></div><div data-i="6" data-label="button-group" class="btns"><i></i><i></i></div></div>' +
        '<div data-i="7" data-label="services_visual" class="map"></div></div></div></div></div></div></div>';
      var k = 3, vis = false, rowsEl = $$('[data-r]', v), boxes = $$('[data-i]', v), hold = 0;
      function step(){ rowsEl.forEach(function(r){ r.classList.toggle('on', +r.getAttribute('data-r') === k); }); boxes.forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-i') === k); }); }
      step(); onView(v, function(x){ vis = x; });
      if (!reduce) setInterval(function(){ if (!vis || Date.now() < hold) return; k = (k + 1) % rows.length; step(); }, 1300);
      rowsEl.forEach(function(r){ r.addEventListener('pointerenter', function(){ k = +r.getAttribute('data-r'); hold = Date.now() + 3000; step(); }); });
      boxes.forEach(function(b){ b.addEventListener('pointerover', function(e){ if (e.target.closest('[data-i]') !== b) return; k = +b.getAttribute('data-i'); hold = Date.now() + 3000; step(); }); });
    },
    globe: function(v){
      v.innerHTML = '<div class="v-globe"><canvas></canvas></div>';
      var c = $('canvas', v), S = 240, dp = 2; c.width = S * dp; c.height = S * dp; c.style.width = S + 'px'; c.style.maxWidth = '100%'; c.style.height = 'auto'; c.style.cursor = 'grab';
      var ctx = c.getContext('2d'), W = c.width, R = W * .44, rot = 0, vis = false, pts = [], tilt = .4, ink = getComputedStyle(v).color || '#0B0C14', spinV = 0;
      for (var la = -80; la <= 80; la += 8) for (var lo = -180; lo < 180; lo += 8) pts.push([la, lo]);
      var pins = [[40.7, -74], [36.2, -115.1], [35.5, -97.5], [41.5, -72.8], [31, -97.5], [51.5, -.1], [24.7, 46.7], [35.7, 139.7]];
      function P(la, lo){ var p = la * Math.PI / 180, l = lo * Math.PI / 180 + rot, x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l); return [W / 2 + x * R, W / 2 - (y * Math.cos(tilt) - z * Math.sin(tilt)) * R, y * Math.sin(tilt) + z * Math.cos(tilt)]; }
      function draw(){
        ctx.clearRect(0, 0, W, W); ctx.fillStyle = ink;
        pts.forEach(function(q){ var p = P(q[0], q[1]); if (p[2] < 0) return; ctx.globalAlpha = .12 + p[2] * .55; ctx.fillRect(p[0], p[1], 2.4, 2.4); });
        ctx.globalAlpha = 1;
        pins.forEach(function(q, i){ var p = P(q[0], q[1]); if (p[2] < .05) return; ctx.fillStyle = '#FF6A3D'; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(255,106,61,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p[0], p[1], 12 + (performance.now() / 60 + i * 9) % 14, 0, 7); ctx.stroke(); });
      }
      draw(); onView(c, function(x){ vis = x; });
      if (!reduce && hasGsap) gsap.ticker.add(function(t, dt){ if (!vis) return; rot += dt * .0004 + spinV; spinV *= .94; draw(); });
      var lastX = null;
      c.addEventListener('pointerdown', function(e){ lastX = e.clientX; c.setPointerCapture(e.pointerId); c.style.cursor = 'grabbing'; });
      c.addEventListener('pointermove', function(e){ if (lastX === null) return; var dx = e.clientX - lastX; lastX = e.clientX; rot += dx * .012; spinV = dx * .002; if (reduce || !hasGsap) draw(); });
      c.addEventListener('pointerup', function(){ lastX = null; c.style.cursor = 'grab'; });
      c.style.touchAction = 'pan-y';
    },
    planet: function(v){
      v.classList.add('v-planet');
      v.innerHTML = '<span class="cap-tag" style="left:16px;top:14px">FIG. 01 · DRAG ME</span><span class="cap-tag" style="right:16px;bottom:14px">RING TILT −18°</span><span class="cap-tag" style="left:16px;bottom:14px">SEED 42</span>' +
        '<div class="ab_planet is-drag" data-planet="gas" data-seed="42" data-colors="#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c" data-ring="#f0e6ff,#9a8cd6,#4d4488" data-tilt="-18" data-spin="50" data-glow="rgba(143,177,255,.45)" data-label="Specimen planet" data-drag></div>';
      var pw = $('.ab_planet', v); buildPlanet(pw);
      if (!canDrag) return;
      var back;
      function sched(){ if (back) back.kill(); back = gsap.delayedCall(4, function(){ gsap.to(pw, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.5)' }); }); }
      Draggable.create(pw, { type: 'x,y', bounds: v, inertia: true, edgeResistance: .6,
        onPress: function(){ if (back) back.kill(); }, onDragEnd: sched, onThrowComplete: sched });
      nudge(pw, sched);
    },
    easing: function(v){
      if (!hasGsap) return;
      var eases = ['expo.out', 'power3.inOut', 'elastic.out(1,0.4)', 'back.out(2.2)', 'bounce.out'], ei = 0;
      v.innerHTML = '<div class="v-ease"><svg viewBox="0 0 200 120" preserveAspectRatio="none"><path d="M0 110H200M0 10H200" stroke="currentColor" stroke-opacity=".15" fill="none" vector-effect="non-scaling-stroke"/><path class="cv" fill="none" stroke="#FF6A3D" stroke-width="2" vector-effect="non-scaling-stroke"/><circle class="dt" r="5" fill="#FF6A3D"/></svg><div class="track"><i></i></div></div><button type="button">expo.out ↻</button>';
      var cv = $('.cv', v), dt = $('.dt', v), sq = $('.track i', v), btn = $('button', v), tr = $('.track', v), tw;
      var lo = 0, hi = 1, trH = 0, seen = true;
      function measure(){ trH = tr.clientHeight; }
      measure(); addEventListener('resize', measure);
      function Y(val){ return 108 - (val - lo) / (hi - lo) * 96; }
      function play(){
        var E = gsap.parseEase(eases[ei]), d = '';
        lo = 0; hi = 1; for (var j = 0; j <= 100; j++){ var ev = E(j / 100); lo = Math.min(lo, ev); hi = Math.max(hi, ev); }
        $('path', v).setAttribute('d', 'M0 ' + Y(0) + 'H200M0 ' + Y(1) + 'H200');
        for (var i = 0; i <= 60; i++){ var t = i / 60; d += (i ? 'L' : 'M') + (t * 200).toFixed(1) + ' ' + Y(E(t)).toFixed(1); }
        cv.setAttribute('d', d); btn.textContent = eases[ei] + ' ↻';
        var o = { t: 0 }; if (tw) tw.kill();
        tw = gsap.to(o, { t: 1, duration: 1.6, ease: 'none', repeat: -1, repeatDelay: .6, onUpdate: function(){ var e = E(o.t); dt.setAttribute('cx', o.t * 200); dt.setAttribute('cy', Y(e)); sq.style.bottom = ((e - lo) / (hi - lo) * (trH - 14)) + 'px'; } });
        if (reduce) tw.progress(1).pause(); else if (!seen) tw.pause();
      }
      function next(){ ei = (ei + 1) % eases.length; play(); }
      btn.addEventListener('click', next); $('svg', v).addEventListener('click', next); $('svg', v).style.cursor = 'pointer';
      play();
      if (!reduce && window.IntersectionObserver) onView(v, function(on){ seen = on; if (!tw) return; if (on){ measure(); tw.resume(); } else tw.pause(); });
    },
    logo: function(v){
      v.innerHTML = '<div class="v-logo"><svg viewBox="-110 -110 220 220">' +
        '<circle class="g" r="100"/><circle class="g" r="61.8"/><circle class="g" r="38.2"/><circle class="g" cx="61.8" r="38.2"/><circle class="g" cx="-38.2" cy="-38.2" r="23.6"/>' +
        '<path class="g" d="M-110 0H110M0 -110V110M-78 -78L78 78M-78 78L78 -78"/>' +
        '<path class="m" d="M 0 -61.8 A 61.8 61.8 0 1 0 61.8 0"/><g class="orbit"><rect class="sq" x="47" y="-15" width="30" height="30"/></g></svg>' +
        '<span class="spec">GRID Ø 200 · 1 : 1.618<br>STROKE 12 · SQUARE 30</span><div class="chips"><i style="background:#FF6A3D"></i><i style="background:#0B0C14"></i><i style="background:#F2F0EA"></i><b>Aa</b></div></div>';
      var gs = $$('.g', v), m = $('.m', v), orb = $('.orbit', v), card = v.closest('.ab_bento-card');
      if (reduce || !hasGsap){ gs.forEach(function(g){ g.style.strokeDasharray = '3 3'; }); return; }
      gs.forEach(function(g){ var L = g.getTotalLength(); g.style.strokeDasharray = L; g.style.strokeDashoffset = L; });
      var Lm = m.getTotalLength(); m.style.strokeDasharray = Lm; m.style.strokeDashoffset = Lm;
      gsap.set(orb, { scale: 0, svgOrigin: '62 0' });
      ScrollTrigger.create({ trigger: v, start: 'top 85%', once: true, onEnter: function(){
        gsap.timeline()
          .to(gs, { strokeDashoffset: 0, duration: 1.4, stagger: .08, ease: 'power2.inOut', onComplete: function(){ gs.forEach(function(g){ g.style.strokeDasharray = '3 3'; g.style.strokeDashoffset = 0; }); } })
          .to(m, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' }, '-=.6')
          .to(orb, { scale: 1, duration: .6, ease: 'back.out(3)' }, '-=.2');
      } });
      if (card) card.addEventListener('pointerenter', function(){ gsap.fromTo(orb, { rotation: 0 }, { rotation: -360, svgOrigin: '0 0', duration: 1.6, ease: 'power3.inOut' }); });
    },
    terminal: function(v){
      var lines = ['<span class="hi">$</span> git push origin main', '→ building site with Astro', '<span class="ok">✓</span> build complete', '→ deploying to the edge', '<span class="ok">✓</span> live at <span class="hi">yourbrand.com</span>'];
      v.innerHTML = '<div class="v-term"><div class="bar"><i></i><i></i><i></i></div><div class="out"></div></div>';
      var out = $('.out', v), vis = false, running = false;
      // every line is always in the layout; typing only toggles visibility, so the card never changes height
      out.innerHTML = lines.map(function(l){ return '<div class="ln">' + l + '</div>'; }).join('') + '<div class="ln"><span class="cur"></span></div>';
      var rows = $$('.ln', out);
      function run(){
        if (running) return; running = true;
        rows.forEach(function(r){ r.style.visibility = 'hidden'; });
        var i = 0;
        (function nx(){ if (i < rows.length){ rows[i++].style.visibility = 'visible'; setTimeout(nx, 520); } else setTimeout(function(){ running = false; if (vis) run(); }, 4200); })();
      }
      onView(v, function(x){ vis = x; if (x && !reduce) run(); });
    },
    pipeline: function(v){
      v.innerHTML = '<div class="v-pipe"><div class="node src"><span>Airtable</span><span>Sheets</span><span>API</span></div><div class="node">Webhook</div><div class="node dst">Webflow CMS</div><div class="line"><i></i><i></i><i></i></div></div>';
    },
    tokens: function(v){
      v.innerHTML = '<div class="v-tok">' + ['#07080D', '#161A2E', '#F2F0EA', '#FF6A3D', '#4C8DFF', '#7C5CFF'].map(function(c){ return '<i style="background:' + c + '" title="' + c + '"></i>'; }).join('') + '<div class="ramp"><span>Aa</span><span>Aa</span><span>Aa</span><span>Aa</span></div></div>';
    },
    meters: function(v){
      v.innerHTML = '<div class="v-meter"><div><span>LCP</span><b><i style="--v:.72"></i></b><span>&lt; 2.5 s</span></div><div><span>CLS</span><b><i style="--v:.9"></i></b><span>&lt; 0.1</span></div><div><span>Motion</span><b><i style="--v:1"></i></b><span>60 fps</span></div></div>';
      if (!reduce && hasGsap) ScrollTrigger.create({ trigger: v, start: 'top 85%', once: true, onEnter: function(){ gsap.from($$('.v-meter b i', v), { scaleX: 0, duration: 1.2, stagger: .15, ease: 'power3.out' }); } });
    }
  };
  $$('.ab_bento-card[data-visual]').forEach(function(card){ var f = VIZ[card.getAttribute('data-visual')], v = $('.ab_bento-card_viz', card); if (f && v) f(v); });

  });
  __steps.push(function(){
  /* ===== home/30-process.js ===== */

  /* ---------- mission sequence (Process: 6 static steps → pinned flight path) ---------- */
  (function initMission(){
    var mission = $('#log'); if (!mission || !hasGsap) return;
    // embedded viewers can report a 0-size viewport at load: wait for a real size before picking the layout
    if (innerWidth < 100 || innerHeight < 100){ var once = function(){ if (innerWidth < 100 || innerHeight < 100) return; removeEventListener('resize', once); initMission(); ScrollTrigger.refresh(); }; addEventListener('resize', once); return; }
    var modeOf = function(){ return innerWidth > 900 ? 'wide' : 'narrow'; }, mode0 = modeOf(), rzT;
    // pin length from a viewport height that only updates when the width changes: on phones the address bar
    // resizes innerHeight while scrolling, and a longer/shorter pin made everything below (the planner) jump
    var pinW = innerWidth, pinH = innerHeight, touch = matchMedia('(pointer: coarse)').matches;
    addEventListener('resize', function(){
      if (!touch || innerWidth !== pinW){ pinW = innerWidth; pinH = innerHeight; }
      clearTimeout(rzT); rzT = setTimeout(function(){ if (modeOf() !== mode0) location.reload(); }, 400);
    });
    var lis = $$('.ab_process_step', mission);
    if (!lis.length) return;
    var steps = lis.map(function(li){
      var t = $('.ab_process_step-title', li), p = $('.ab_process_step-text', li);
      return { name: t ? t.textContent.trim() : '', code: li.getAttribute('data-code') || '', copy: p ? p.textContent.trim() : '', deliv: li.getAttribute('data-deliverable') || '', you: li.getAttribute('data-you') || '', check: (li.getAttribute('data-check') || '').split('|').filter(Boolean) };
    });
    var N = steps.length, wide = innerWidth > 900, vert = !wide && innerHeight >= 560 && !reduce;
    var list = $('.ab_process_steps', mission);
    if (!wide && !vert){
      lis.forEach(function(li){ ScrollTrigger.create({ trigger: li, start: 'top 70%', onEnter: function(){ li.classList.add('is-on'); }, onLeaveBack: function(){ li.classList.remove('is-on'); } }); });
      var rail = document.createElement('div'); rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = '<i class="rail-fill"></i><span class="rail-ship"><svg viewBox="-32 -12 50 24"><path class="flame" d="M-14 -3 L-30 0 L-14 3 Z"/><rect x="-14" y="-5" width="20" height="10" fill="#F2F0EA"/><path d="M6 -5 L16 0 L6 5 Z" fill="#FF6A3D"/><path d="M-12 -5 L-8 -11 L-4 -5 Z M-12 5 L-8 11 L-4 5 Z" fill="#FF6A3D"/><rect x="-4" y="-2" width="4" height="4" fill="#07080D"/></svg></span>';
      list.appendChild(rail);
      var fill = $('.rail-fill', rail), rship = $('.rail-ship', rail);
      ScrollTrigger.create({ trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: reduce ? false : .6, onUpdate: function(self){ var pc = (self.progress * 100) + '%'; fill.style.height = pc; rship.style.top = pc; } });
      return;
    }
    var NS = 'http://www.w3.org/2000/svg', svg, wrap, ahead, done, ship, wpsG, L;
    var F = steps.map(function(s, i){ return .06 + i * (.88 / (N - 1)); });
    var SNAP = F.map(function(f){ return (f - F[0]) / (F[N - 1] - F[0]); });
    var wps = [], labels = [], proxy = { p: 0 };
    if (vert){
      // ---- vertical flight path for phones and tablets ----
      mission.classList.add('is-vert');
      var panel = $('.ab_process_panel', mission), vg = document.createElement('div'), vt = document.createElement('div');
      vg.className = 'vgrid'; vt.className = 'vtraj'; panel.parentNode.insertBefore(vg, panel); vg.appendChild(vt); vg.appendChild(panel);
      vt.innerHTML = '<svg class="vsvg"><defs><linearGradient id="vStartBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fe0ff"/><stop offset=".5" stop-color="#1e6e8c"/><stop offset="1" stop-color="#0b2f4d"/></linearGradient><linearGradient id="vEndBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd29a"/><stop offset=".55" stop-color="#e0703e"/><stop offset="1" stop-color="#5a2412"/></linearGradient></defs><circle class="vstart" r="9" fill="url(#vStartBody)" style="filter:drop-shadow(0 0 8px rgba(92,200,255,.6))"/><g class="vend" style="filter:drop-shadow(0 0 10px rgba(255,106,61,.55))"><circle r="11" fill="url(#vEndBody)"/><ellipse rx="19" ry="4.5" fill="none" stroke="#ffd29a" stroke-opacity=".7" stroke-width="1.5" transform="rotate(-14)"/></g>' +
        '<path class="ahead"/><path class="done"/><g class="wps"></g>' + $('.ab_process_traj-svg .ship', mission).outerHTML + '</svg>';
      svg = $('svg', vt); ahead = $('.ahead', svg); done = $('.done', svg); ship = $('.ship', svg); wpsG = $('.wps', svg);
      steps.forEach(function(s, i){
        var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'wp'); g.style.cursor = 'pointer';
        g.innerHTML = '<circle class="pulse" r="11"/><circle class="ring" r="11"/><text class="wp-n" text-anchor="middle" dy="3.2">' + pad2(i + 1) + '</text>';
        g.addEventListener('click', function(){ go(i); }); wpsG.appendChild(g); wps.push(g);
      });
      var layoutV = function(){
        var W = vt.clientWidth, H = vt.clientHeight, cx = W / 2, y0 = 30, y3 = H - 34, xa = W * .2, xb = W * .8, dy = (y3 - y0) / 7;
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        var d = 'M ' + cx + ' ' + y0 + ' C ' + xa + ' ' + (y0 + dy) + ', ' + xa + ' ' + (y0 + dy * 1.5) + ', ' + xa + ' ' + (y0 + dy * 2.3) +
          ' S ' + xb + ' ' + (y0 + dy * 3.6) + ', ' + xb + ' ' + (y0 + dy * 4.4) + ' S ' + cx + ' ' + (y3 - dy * .4) + ', ' + cx + ' ' + y3;
        ahead.setAttribute('d', d); done.setAttribute('d', d); L = ahead.getTotalLength();
        done.style.strokeDasharray = L;
        $('.vstart', svg).setAttribute('cx', cx); $('.vstart', svg).setAttribute('cy', y0 - 16);
        $('.vend', svg).setAttribute('transform', 'translate(' + cx + ' ' + (y3 + 20) + ')');
        wps.forEach(function(g, i){ var pt = ahead.getPointAtLength(F[i] * L); g.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')'); });
      };
      layoutV();
      addEventListener('resize', function(){ layoutV(); setP(proxy.p); });
    } else {
      mission.classList.add('is-wide');
      svg = $('.ab_process_traj-svg', mission); wrap = $('.ab_process_traj', mission);
      ahead = $('.ahead', svg); done = $('.done', svg); ship = $('.ship', svg); wpsG = $('.wps', svg); L = ahead.getTotalLength();
      done.style.strokeDasharray = L; done.style.strokeDashoffset = L;
      steps.forEach(function(s, i){
        var pt = ahead.getPointAtLength(F[i] * L), g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'wp'); g.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
        g.innerHTML = '<circle class="pulse" r="10"/><circle class="ring" r="10"/><rect class="core" x="-3.5" y="-3.5" width="7" height="7"/>';
        wpsG.appendChild(g); wps.push(g);
        var b = document.createElement('button'); b.type = 'button'; b.className = 'wp-label';
        b.innerHTML = pad2(i + 1) + ' · ' + esc(s.code) + '<b>' + esc(s.name) + '</b>';
        b.style.left = (pt.x / 1200 * 100) + '%';
        var above = pt.y > 150; b.style.top = above ? 'calc(' + (pt.y / 280 * 100) + '% - 64px)' : 'calc(' + (pt.y / 280 * 100) + '% + 16px)';
        b.addEventListener('click', function(){ go(i); });
        wrap.appendChild(b); labels.push(b);
      });
      wrap.removeAttribute('aria-hidden');
    }
    function setShip(frac){
      var l = frac * L, a = ahead.getPointAtLength(Math.max(0, l - 1)), b = ahead.getPointAtLength(Math.min(L, l + 1)), p = ahead.getPointAtLength(l);
      var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      ship.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + ang + ')');
      done.style.strokeDashoffset = L - l;
    }
    var cur = -1, ticks = [];
    var el = { num: $('#mpNum'), code: $('#mpCode'), title: $('#mpTitle'), copy: $('#mpCopy'), deliv: $('#mpDeliv'), you: $('#mpYou'), check: $('#mpCheck'), bar: $('#mpBar'), pct: $('#mpPct'), prev: $('#mpPrev'), next: $('#mpNext') };
    function setStage(i){
      if (i === cur) return; cur = i; var s = steps[i];
      wps.forEach(function(w, k){ w.classList.toggle('done', k < i); w.classList.toggle('active', k === i); });
      labels.forEach(function(b, k){ b.classList.toggle('active', k === i); });
      el.num.textContent = pad2(i + 1); el.code.textContent = s.code.toUpperCase();
      el.title.textContent = s.name; el.copy.textContent = s.copy; el.deliv.textContent = s.deliv; el.you.textContent = s.you;
      el.check.innerHTML = s.check.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('');
      ticks.forEach(clearTimeout); ticks = [];
      $$('li', el.check).forEach(function(li, k){ ticks.push(setTimeout(function(){ li.classList.add('done'); }, reduce ? 0 : 350 + k * 320)); });
      el.prev.disabled = i === 0; el.next.disabled = i === N - 1;
      if (!reduce){
        gsap.fromTo([el.title, el.copy, el.deliv, el.you], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out', overwrite: true });
        gsap.to(el.title, { duration: .6, scrambleText: { text: s.name, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: .8 } });
      }
    }
    function setP(p){
      var frac = F[0] + p * (F[N - 1] - F[0]); setShip(frac);
      var i = 0; for (var k = 0; k < N; k++) if (frac >= F[k] - .02) i = k;
      setStage(i); el.bar.style.width = (p * 100) + '%'; el.pct.textContent = Math.round(p * 100) + '%';
    }
    var st = null;
    setP(0);
    if (!reduce){
      st = ScrollTrigger.create({ trigger: mission, start: 'top top', end: function(){ return '+=' + Math.round(pinH * 2.6); }, pin: true, refreshPriority: 10,
        snap: { snapTo: SNAP, duration: { min: .25, max: .7 }, delay: .12, ease: 'power2.inOut' },
        onToggle: function(self){ var nav = $('#nav'); if (self.isActive && nav) nav.classList.remove('is-hidden'); },
        onUpdate: function(self){ gsap.to(proxy, { p: self.progress, duration: .45, ease: 'power2.out', overwrite: true, onUpdate: function(){ setP(proxy.p); } }); } });
      window.__abMissionST = st;
      ScrollTrigger.refresh();
    }
    function go(i){
      i = Math.max(0, Math.min(N - 1, i));
      if (st){ var y = st.start + (st.end - st.start) * SNAP[i]; if (lenis) lenis.scrollTo(y, { duration: 1.3 }); else window.scrollTo({ top: y, behavior: 'smooth' }); }
      else gsap.to(proxy, { p: SNAP[i], duration: reduce ? 0 : 1, ease: 'power2.inOut', onUpdate: function(){ setP(proxy.p); } });
    }
    el.prev.addEventListener('click', function(){ go(cur - 1); });
    el.next.addEventListener('click', function(){ go(cur + 1); });
  })();

  });
  __steps.push(function(){
  /* ===== home/40-stack.js ===== */

  /* ---------- orbit (Tools Collection List → chips on two rings), shared system in ab-core ---------- */
  AB.orbit($('#orbit'), $('#toolReadout'));

  /* ---------- altitude meter (page scroll → Earth-to-Moon) ---------- */
  (function(){
    if (!hasGsap) return;
    AB.inject('<div class="ab_alt" aria-hidden="true"><div class="ab_alt-fill" id="altFill"></div><div class="ab_alt-lab" id="altLab">ALT 0 km</div></div>');
    var altFill = $('#altFill'), altLab = $('#altLab'), nf = new Intl.NumberFormat('en-US');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function(self){
      var p = self.progress; altFill.style.height = (p * 100) + '%'; altLab.style.bottom = (p * 100) + '%';
      altLab.textContent = p > .995 ? 'ALT 384,400 km · Moon reached' : 'ALT ' + nf.format(Math.round(p * 384400)) + ' km';
    } });
  })();

  /* ---------- transmission (Quotes via the site-data block) ---------- */
  (function(){
    var box = $('#iq'); if (!box || !QUOTES.length) return;
    var textEl = $('#iqText'), byEl = $('#iqBy'), idx = 0, scrub;
    $('#iqTotal').textContent = pad2(QUOTES.length);
    function render(i, reveal){
      var q = QUOTES[i]; idx = i;
      $('#iqIdx').textContent = pad2(i + 1);
      textEl.classList.toggle('long', q.t.length > 80);
      textEl.innerHTML = ''; q.t.split(/\s+/).forEach(function(w){ var s = document.createElement('span'); s.className = 'qw'; s.textContent = w; textEl.appendChild(s); textEl.appendChild(document.createTextNode(' ')); });
      byEl.textContent = q.a + ' · ' + q.c;
      var words = $$('.qw', textEl);
      if (reduce || !hasGsap) return;
      if (reveal === 'scrub'){
        // reveal once when the quote comes into view (robust to pinned sections above changing the page height)
        gsap.set(words, { opacity: .12, y: 10 }); gsap.set(byEl, { opacity: 0 });
        scrub = ScrollTrigger.create({ trigger: box, start: 'top 78%', once: true, onEnter: function(){
          gsap.to(words, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' });
          gsap.to(byEl, { opacity: 1, duration: .6, delay: .4 });
        } });
      } else {
        gsap.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
        gsap.fromTo(byEl, { opacity: 0 }, { opacity: 1, duration: .5, delay: .3 });
      }
    }
    render(0, 'scrub');
    $('#iqNext').addEventListener('click', function(){
      if (scrub){ scrub.kill(); scrub = null; }
      render((idx + 1) % QUOTES.length, 'pop');
    });
  })();

  });
  __steps.push(function(){
  /* ===== home/50-planner.js ===== */

  /* ---------- launch: mission planner (native Webflow form #planner) ---------- */
  (function(){
    var form = $('#planner'); if (!form) return;
    var launchBtn = $('#launchBtn'), launchLabel = $('#launchLabel'), countT = [];
    function resetLaunch(){ countT.forEach(clearTimeout); countT = []; if (launchLabel) launchLabel.textContent = 'Launch mission'; }
    if (launchBtn){
      launchBtn.addEventListener('mouseenter', function(){
        if (reduce) return; resetLaunch();
        ['T−3', 'T−2', 'T−1', 'Liftoff'].forEach(function(s, i){ countT.push(setTimeout(function(){ launchLabel.textContent = s; }, 220 + i * 380)); });
      });
      launchBtn.addEventListener('mouseleave', resetLaunch);
    }
    var wrap = form.parentNode, doneEl = $('.w-form-done', wrap);
    var path = $('#plPath'), done = $('#plDone'), rocket = $('#plRocket'), ringsB = $('#plRingsB'), ringsF = $('#plRingsF'), moons = $('#plMoons'), read = $('#plRead');
    var destEl = $('#plDestEl'), dps = $$('.ab_planet[data-k]', destEl);
    // the flight-plan readout lives under the visual (full width, wraps), not inside it next to Earth
    var viz = $('.ab_planner_viz', form);
    if (read && viz && viz.contains(read)){ viz.parentNode.insertBefore(read, viz.nextSibling); read.classList.add('is-below'); read.setAttribute('aria-live', 'polite'); }
    var bud = $('#plBud'), budOut = $('#plBudOut');
    var BUD = ['<$20k', '$20–40k', '$40–60k', '$60–80k', '$80–100k'], MAXB = BUD.length - 1, WIN = ['ASAP', '1–2 months', '3+ months', 'Flexible'];
    // the budget scale lives here (the Designer embed may carry an older one): slider range, ticks, default
    bud.max = MAXB; bud.value = 1;
    var ticks = $('.ab_planner_ticks', form); if (ticks) ticks.innerHTML = BUD.map(function(b){ return '<span>' + esc(b) + '</span>'; }).join('');
    // budget: "not sure yet" overrides the slider (people still scouting what to spend); moving the slider turns it off
    var UNSURE = 'Not sure yet · still scouting', unsureBtn = $('.ab_planner_chip.is-unsure', form);
    if (!unsureBtn && ticks){ unsureBtn = document.createElement('button'); unsureBtn.type = 'button'; unsureBtn.className = 'ab_planner_chip is-unsure'; unsureBtn.setAttribute('aria-pressed', 'false'); unsureBtn.textContent = UNSURE; ticks.parentNode.insertBefore(unsureBtn, ticks.nextSibling); }
    // add-ons ride along with any mission type; the Knowledge System add-on is added here if the embed lacks it
    var typesRow = $('#plTypes');
    if (typesRow && !$('[data-addon]', form)){
      var ad = document.createElement('div'); ad.className = 'ab_planner_addons';
      ad.innerHTML = '<span class="ab_planner_addon-label">Add-on</span><button type="button" class="ab_planner_chip is-addon" data-addon="Complete knowledge system" data-c="#FFD29A" aria-pressed="false">+ Complete knowledge system</button>';
      typesRow.parentNode.insertBefore(ad, typesRow.nextSibling);
    }
    if (!$('#plAddonsField', form) && typesRow){ var hf = document.createElement('input'); hf.type = 'hidden'; hf.name = 'Add-ons'; hf.id = 'plAddonsField'; hf.value = ''; typesRow.parentNode.appendChild(hf); }
    var chips = $$('.ab_planner_chip:not([data-addon]):not(.is-unsure)', form), addons = $$('.ab_planner_chip[data-addon]', form);
    var fType = $('#plTypesField'), fBud = $('#plBudField'), fBrief = $('#plBriefField'), fAdd = $('#plAddonsField');
    chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
    var sg = $('.pl-stars', form), s = '';
    if (sg){ for (var i = 0; i < 60; i++) s += '<circle cx="' + (Math.random() * 560).toFixed(1) + '" cy="' + (Math.random() * 190).toFixed(1) + '" r="' + (Math.random() < .1 ? 1 : .45) + '" fill="#fff" opacity="' + (.15 + Math.random() * .55).toFixed(2) + '"/>'; sg.innerHTML = s; }
    function radios(){ return $$('input[name="Launch window"]', form); }
    function ensureWindow(){ if (!$('input[name="Launch window"]:checked', form)){ var r = radios()[1] || radios()[0]; if (r) r.checked = true; } }
    ensureWindow();
    function state(){
      var sel = chips.map(function(c, k){ return c.getAttribute('aria-pressed') === 'true' ? k : -1; }).filter(function(k){ return k > -1; });
      var chk = $('input[name="Launch window"]:checked', form), w = chk ? num(chk.getAttribute('data-i'), 1) : 1, b = Math.round(num(bud.value, 2));
      var add = addons.filter(function(c){ return c.getAttribute('aria-pressed') === 'true'; }).map(function(c){ return c.getAttribute('data-addon'); });
      var un = !!(unsureBtn && unsureBtn.getAttribute('aria-pressed') === 'true'); b = Math.min(b, MAXB);
      return { sel: sel, types: sel.map(function(k){ return chips[k].textContent.trim(); }), cols: sel.map(function(k){ return chips[k].getAttribute('data-c'); }), w: w, b: un ? 0 : b, bl: un ? UNSURE : BUD[b], unsure: un, add: add };
    }
    var cur = { x: 330, y: 70, r: 16 }, st0 = null;
    function arc(cx, cy, rx, ry, top){ return 'M' + (cx - rx).toFixed(1) + ' ' + cy.toFixed(1) + ' A' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 0 ' + (top ? 1 : 0) + ' ' + (cx + rx).toFixed(1) + ' ' + cy.toFixed(1); }
    function brief(){ var st = state(); return 'Mission brief\nName: ' + ($('#plName').value || '-') + '\nEmail: ' + ($('#plEmail').value || '-') + '\nMission type: ' + (st.types.join(', ') || '-') + '\nLaunch window: ' + WIN[st.w] + '\nBudget: ' + st.bl + '\nAdd-ons: ' + (st.add.join(', ') || '-') + '\nAbout: ' + ($('#plMsg').value || '-'); }
    function fillHidden(){ var st = state(); if (fType) fType.value = st.types.join(', '); if (fBud) fBud.value = st.bl; if (fAdd) fAdd.value = st.add.join(', '); if (fBrief) fBrief.value = brief(); }
    function draw(anim){
      var st = state(), n = st.sel.length; st0 = st;
      // window = distance, types = planet (first pick) + moons (the rest), budget = rings
      var X = [290, 370, 462, 410][st.w], Y = [92, 70, 58, 46][st.w], R = 14 + Math.min(n, 4) * 3.2;
      var lift = st.w === 3 ? 150 : 96 + st.w * 12, cx = (56 + X) / 2;
      var d = 'M78 144 Q ' + cx + ' ' + (Y - lift * .35) + ' ' + (X - R - 10) + ' ' + (Y + 3);
      path.setAttribute('d', d); done.setAttribute('d', d);
      path.style.strokeDasharray = st.w === 3 ? '1.5 7' : '';
      var k = n ? String(st.sel[0]) : 'none';
      dps.forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-k') === k); });
      var to = { x: X, y: Y, r: R };
      if (anim && hasGsap && !reduce) gsap.to(cur, { x: to.x, y: to.y, r: to.r, duration: .8, ease: 'elastic.out(1,.65)', overwrite: true, onUpdate: place });
      else { cur = to; place(); }
      budOut.textContent = st.unsure ? 'Not sure yet' : st.bl; bud.setAttribute('aria-valuetext', st.bl); bud.classList.toggle('is-unsure', st.unsure); if (!st.unsure) bud.style.setProperty('--p', (st.b / MAXB * 100) + '%');
      read.innerHTML = n ? 'Flight plan · <b>' + esc(st.types.join(' + ')) + '</b> · T−' + esc(WIN[st.w]) + ' · orbit ' + esc(st.unsure ? 'TBD' : st.bl) + (st.add.length ? ' · <b>+ ' + esc(st.add.join(' + ').toLowerCase()) + '</b>' : '') : 'Flight plan · choose a mission type';
      fillHidden();
      if (!form.classList.contains('is-flying')) parkRocket();
      if (reduce || !hasGsap) moonTick();
    }
    function place(){
      destEl.style.left = (cur.x / 560 * 100) + '%'; destEl.style.top = (cur.y / 190 * 100) + '%'; destEl.style.width = (cur.r * 2 / 560 * 100) + '%';
      var st = st0 || state(), b = '', f = '', col = st.cols.length ? st.cols : ['#8a8fa3'];
      for (var k = 1; k <= st.b; k++){
        var rx = cur.r + 6 + k * 7, ry = rx * .26, c = col[(k - 1) % col.length], tr = ' transform="rotate(-14 ' + cur.x.toFixed(1) + ' ' + cur.y.toFixed(1) + ')" stroke="' + c + '"';
        b += '<path d="' + arc(cur.x, cur.y, rx, ry, true) + '"' + tr + '/>'; f += '<path d="' + arc(cur.x, cur.y, rx, ry, false) + '"' + tr + ' opacity="' + (.9 - k * .15) + '"/>';
      }
      if (st.unsure){ var grx = cur.r + 13, gtr = ' transform="rotate(-14 ' + cur.x.toFixed(1) + ' ' + cur.y.toFixed(1) + ')" stroke="' + col[0] + '" stroke-dasharray="2 4"'; b += '<path d="' + arc(cur.x, cur.y, grx, grx * .26, true) + '"' + gtr + ' opacity=".6"/>'; f += '<path d="' + arc(cur.x, cur.y, grx, grx * .26, false) + '"' + gtr + ' opacity=".6"/>'; }
      ringsB.innerHTML = b; ringsF.innerHTML = f;
    }
    // extra mission types orbit as small moons
    var mt = 0;
    function moonTick(){
      var st = st0; if (!st) return; var extra = st.cols.slice(1), out = '';
      extra.forEach(function(c, i){ var a = mt * (0.6 + i * .15) + i * 2.1, rx = cur.r + 14 + i * 6, x = cur.x + Math.cos(a) * rx, y = cur.y + Math.sin(a) * rx * .3; var front = Math.sin(a) > 0; out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (front ? 2.8 : 2.2) + '" fill="' + c + '" opacity="' + (front ? 1 : .35) + '"/>'; });
      // the Knowledge System add-on: a small linked-node satellite on a wide orbit
      if (st.add && st.add.length){
        var a2 = mt * .45 + 1, R2 = cur.r + 34, sx = cur.x + Math.cos(a2) * R2, sy = cur.y + Math.sin(a2) * R2 * .32, op = Math.sin(a2) > 0 ? .95 : .45;
        out += '<g opacity="' + op + '" stroke="#FFD29A" stroke-width=".8" fill="#FFD29A"><path d="M' + (sx - 4).toFixed(1) + ' ' + (sy + 2).toFixed(1) + 'L' + sx.toFixed(1) + ' ' + (sy - 3).toFixed(1) + 'L' + (sx + 4).toFixed(1) + ' ' + (sy + 2).toFixed(1) + 'Z" fill="none"/>' +
          '<circle cx="' + (sx - 4).toFixed(1) + '" cy="' + (sy + 2).toFixed(1) + '" r="1.4"/><circle cx="' + sx.toFixed(1) + '" cy="' + (sy - 3).toFixed(1) + '" r="1.8"/><circle cx="' + (sx + 4).toFixed(1) + '" cy="' + (sy + 2).toFixed(1) + '" r="1.4"/></g>';
      }
      moons.innerHTML = out;
    }
    if (hasGsap && !reduce){ var vis = false; onView(form, function(x){ vis = x; }); gsap.ticker.add(function(t, dt){ if (!vis) return; mt += dt * .0012; moonTick(); }); }
    else moonTick();
    function parkRocket(){ var L = path.getTotalLength(), p0 = path.getPointAtLength(0), p1 = path.getPointAtLength(6); rocket.setAttribute('transform', 'translate(' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ') rotate(' + (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI).toFixed(1) + ')'); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L; done.style.opacity = 0; }
    chips.concat(addons).forEach(function(c){ c.style.setProperty('--c', c.getAttribute('data-c')); c.addEventListener('click', function(){ c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); draw(true); if (hasGsap && !reduce) gsap.fromTo(c, { scale: .95 }, { scale: 1, duration: .45, ease: 'elastic.out(1,.4)' }); }); });
    radios().forEach(function(r){ r.addEventListener('change', function(){ draw(true); }); });
    bud.addEventListener('input', function(){ if (unsureBtn) unsureBtn.setAttribute('aria-pressed', 'false'); draw(true); });
    if (unsureBtn) unsureBtn.addEventListener('click', function(){ unsureBtn.setAttribute('aria-pressed', unsureBtn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); draw(true); });
    $$('#plName, #plEmail, #plMsg').forEach(function(inp){ inp.addEventListener('input', fillHidden); });
    var copyBtn = $('#plCopy');
    if (copyBtn) copyBtn.addEventListener('click', function(){ AB.copyText(brief(), 'Flight plan copied ✓', function(){ toast('Copy failed, select the text instead.'); }); });

    // submit: validate, fly the rocket, then hand the real submit to Webflow Forms
    var cleared = false;
    form.addEventListener('submit', function(e){
      if (cleared){ cleared = false; fillHidden(); return; } // second pass: Webflow's handler takes it from here
      e.preventDefault(); e.stopPropagation();
      if (form.classList.contains('is-flying')) return;
      var st = state();
      if (!st.types.length){ var cc = $('#plTypes'); cc.classList.remove('is-shake'); void cc.offsetWidth; cc.classList.add('is-shake'); toast('Pick at least one mission type.'); chips[0].focus(); return; }
      var em = $('#plEmail'); if (em.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){ em.focus(); toast('That email address looks off.'); return; }
      fillHidden();
      var sent = $('#plSentTxt'); if (sent) sent.textContent = 'Flight plan: ' + st.types.join(' + ') + ', ' + WIN[st.w].toLowerCase() + ', ' + (st.unsure ? 'budget to be scouted together' : st.bl) + (st.add.length ? ', plus ' + st.add.join(' + ').toLowerCase() : '') + '. I’ll reply within one business day with next steps.';
      function release(){
        form.classList.remove('is-flying');
        var id = $('#plId'); if (id) id.textContent = 'MSN-07 · logged';
        cleared = true;
        if (form.requestSubmit) form.requestSubmit(launchBtn || undefined);
        else if (window.jQuery) window.jQuery(form).trigger('submit');
        else { cleared = false; form.submit(); }
      }
      if (reduce || !hasGsap){ release(); return; }
      form.classList.add('is-flying'); done.style.opacity = 1;
      var L = path.getTotalLength(), o = { t: 0 }, fl = $('.ab_planner_flame', launchBtn);
      gsap.timeline()
        .to(launchBtn, { x: '+=3', duration: .05, repeat: 5, yoyo: true }).to(fl, { opacity: 1, duration: .1 }, '<')
        .to(o, { t: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: function(){
          var p = path.getPointAtLength(o.t * L), q = path.getPointAtLength(Math.min(L, o.t * L + 2));
          rocket.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI).toFixed(1) + ') scale(' + (1 - o.t * .35).toFixed(3) + ')');
          done.style.strokeDashoffset = L * (1 - o.t);
        } })
        .to(destEl, { scale: 1.18, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' })
        .add(function(){ gsap.fromTo(sf.state, { warp: .4 }, { warp: 0, duration: 1, ease: 'power2.out' }); })
        .set(fl, { opacity: 0 }).add(release);
    });

    // success panel (Webflow's .w-form-done): animate in when Webflow shows it; "Plot another mission" brings the form back
    if (doneEl && hasGsap && !reduce && window.MutationObserver){
      new MutationObserver(function(){
        if (getComputedStyle(doneEl).display !== 'none' && !doneEl.__shown){ doneEl.__shown = true; gsap.from($$('.ab_planner_sent-inner > *', doneEl), { y: 16, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out' }); }
      }).observe(doneEl, { attributes: true, attributeFilter: ['style'] });
    }
    var resetBtn = $('#plReset');
    if (resetBtn) resetBtn.addEventListener('click', function(){
      form.reset(); chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); ensureWindow(); bud.value = 1;
      if (doneEl){ doneEl.style.display = 'none'; doneEl.__shown = false; }
      form.style.display = '';
      var id = $('#plId'); if (id) id.textContent = 'MSN-07 · unassigned';
      draw(false); resetLaunch();
    });
    draw(false);
  })();

  });
  (function(){
    var i = 0, ch = window.MessageChannel ? new MessageChannel() : null;
    function next(){ if (i >= __steps.length){ if (window.ScrollTrigger) ScrollTrigger.refresh(); return; } __steps[i++](); if (ch) ch.port2.postMessage(0); else setTimeout(next, 0); }
    if (ch) ch.port1.onmessage = next;
    next();
  })();
});
