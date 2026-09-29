/*! AB Portfolio · ab-home v0.30.11 · github.com/AngelinoBarajas/ab-portfolio */
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
  // Est. 1987: designing since birth (Angelino's call). The ring text lives in a Designer embed; set here until it's edited there
  if (badge){ badge.tabIndex = 0; badge.setAttribute('aria-label', 'Draggable badge: design and build, established 1987'); var btp = $('textPath', badge); if (btp) btp.textContent = btp.textContent.replace(/Est\.\s*\d{4}/, 'Est. 1987'); }
  if (sat){ sat.tabIndex = 0; sat.setAttribute('aria-label', 'Satellite. Please do not drag it.'); }
  if (hero && canDrag){
    $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: function(){ schedule(); if (AB.quest) AB.quest('toys'); }, onThrowComplete: schedule });
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
          satGone = true; this.disable(); var d = this; if (AB.quest) AB.quest('satellite'); 
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

  });
  __steps.push(function(){
  /* ===== home/20-services.js ===== */

  /* ---------- Observatory card: a colorful bento card for the field notes (articles + build notes).
     The "marks on a grid" card drops to one row and this card takes the freed cell below it, right after
     Custom deploys, so auto-placement keeps every row full. A native Designer card ([data-visual="observatory"])
     wins: then the script only draws its visual. ---------- */
  // services lede (Designer text): the new line until it's edited in the Designer (docs/designer-steps.md › J2)
  $$('#capabilities .ab_section-lede').forEach(function(p){ if (/one planet you can throw/i.test(p.textContent)) p.textContent = 'Eight services, one orbit: everything a site needs to launch, grow and keep working long after day one.'; });

  (function(){
    var grid = $('#capabilities .ab_bento_grid'); if (!grid) return;
    var brand = $('[data-name="Card / branding"]', grid), deploys = $('[data-name="Card / deploys"]', grid);
    if (brand && brand.parentNode.classList.contains('is-tall')) brand.parentNode.classList.remove('is-tall');
    // Planet card + Plot a trajectory: short one-row cards; the layout itself is set by the reorder below
    var spec = $('[data-name="Card / specimen"]', grid);
    if (spec && !$('[data-visual="trajectory"]', grid)){
      spec.parentNode.classList.remove('is-tall');
      var tc = document.createElement('div'); tc.className = 'ab_bento_cell';
      tc.innerHTML = '<article data-name="Card / trajectory" data-selectable="" data-visual="trajectory" class="ab_bento-card is-trajectory" style="background:#0E1020;border-color:rgba(242,240,234,.12);color:#F2F0EA">' +
        '<div class="ab_bento-card_viz" style="background:#07080D;border-color:rgba(242,240,234,.1)"></div>' +
        '<div class="ab_bento-card_copy"><div class="ab_bento-card_label text-style-mono" style="color:rgba(242,240,234,.6)">Mission planner</div>' +
        '<h3 class="ab_bento-card_title" style="color:#F2F0EA">Plot a trajectory</h3>' +
        '<p class="ab_bento-card_text" style="color:rgba(242,240,234,.75)">Pick a destination, add stops, watch the route draw.</p></div>' +
        '<a aria-label="Plot a trajectory: the mission planner" href="/services#trajectory" class="ab_bento-card_link" style="color:#F2F0EA;border-color:rgba(242,240,234,.45)">↗</a></article>';
      spec.parentNode.parentNode.insertBefore(tc, spec.parentNode.nextSibling);
      selFrame(tc.firstChild, 'Card / trajectory');
    }
    var obsCard = $('[data-visual="observatory"]', grid); if (obsCard) obsCard.closest('.ab_bento_cell').classList.add('is-wide');
    if (obsCard || !deploys) return;
    var cell = document.createElement('div'); cell.className = 'ab_bento_cell';
    cell.innerHTML = '<article data-name="Card / observatory" data-selectable="" data-visual="observatory" class="ab_bento-card is-observatory" style="background:linear-gradient(135deg,#4C8DFF 0%,#7C5CFF 48%,#FF6A3D 100%);border-color:transparent;color:#fff">' +
      '<div class="ab_bento-card_viz" style="background:rgba(7,8,13,.28);border-color:rgba(255,255,255,.22)"></div>' +
      '<div class="ab_bento-card_copy"><div class="ab_bento-card_label text-style-mono" style="color:rgba(255,255,255,.8)">The Observatory</div>' +
      '<h3 class="ab_bento-card_title" style="color:#fff">Field notes from real builds</h3>' +
      '<p class="ab_bento-card_text" style="color:rgba(255,255,255,.88)">Articles on the how and the why: build notes from real projects and the ideas behind them, linked by topic.</p></div>' +
      '<a aria-label="The Observatory: articles and field notes" href="/observatory" class="ab_bento-card_link" style="color:#fff;border-color:rgba(255,255,255,.6)">↗</a></article>';
    cell.classList.add('is-wide');
    deploys.parentNode.parentNode.insertBefore(cell, deploys.parentNode.nextSibling);
    selFrame(cell.firstChild, 'Card / observatory');
    // the same selection frame core gives every [data-selectable] (core ran before this bundle)
    function selFrame(card, tag){
      var s = document.createElement('div'); s.className = 'sel'; s.setAttribute('aria-hidden', 'true');
      s.innerHTML = '<i class="tl"></i><i class="tc"></i><i class="tr"></i><i class="ml"></i><i class="mr"></i><i class="bl"></i><i class="bc"></i><i class="br"></i><span class="sel-tag">' + tag + '</span><span class="sel-size"></span>';
      card.appendChild(s); card.__sel = s;
      card.addEventListener('mouseenter', function(){ $('.sel-size', s).textContent = Math.round(card.offsetWidth) + ' × ' + Math.round(card.offsetHeight); });
      if (AB.cardFx) AB.cardFx(card);
    }
  })();

  /* ---------- bento layout (6 tracks, dense): tall and wide cards zig-zag so every row is full
       Webflow (4×2) · 3D (2×2)
       Custom deploys · Motion · Planet / two minis (availability + reply time) · Brand · Trajectory
       (dark cards on the outside columns, the light ones make a middle spine)
       Field notes (4) · CMS
       Systems · Performance (4)
     Tablet/phone fall back to Webflow's 2- and 1-column rules for is-tall / is-wide ---------- */
  (function(){
    var grid = $('#capabilities .ab_bento_grid'); if (!grid) return;
    function cell(n){ var c = $('[data-name="Card / ' + n + '"]', grid); return c && c.closest('.ab_bento_cell'); }
    // two mini cards share the slot under Custom deploys (stacked, together as tall as the Motion card): quick,
    // useful signals with a small effect. Availability reads the nav's CMS-bound line so it never goes stale
    var minis = cell('availability');
    if (!minis){
      var av = $('[data-bind="availability"]'), when = av ? av.textContent.replace(/^\s*available\s*/i, '').trim() : '';
      minis = document.createElement('div'); minis.className = 'ab_bento_cell is-minis';
      // the quarter as three months (Q4 → OCT NOV DEC); this month is lit, earlier ones are spent
      var qm = /Q([1-4])\s*(\d{4})?/i.exec(when), MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], now = new Date(), months = '';
      if (qm){ var q0 = (+qm[1] - 1) * 3, yr = +(qm[2] || now.getFullYear()); for (var mi = 0; mi < 3; mi++){ var m = q0 + mi, st = (yr === now.getFullYear() && m === now.getMonth()) ? ' is-now' : (yr < now.getFullYear() || (yr === now.getFullYear() && m < now.getMonth())) ? ' is-past' : ''; months += '<span class="mini-m' + st + '">' + MON[m] + '</span>'; }
        if (months.indexOf('is-now') < 0 && months.indexOf('is-past') < 0) months = months.replace('class="mini-m"', 'class="mini-m is-next"'); }
      minis.innerHTML =
        '<article data-name="Card / availability" data-selectable="" class="ab_bento-card is-mini is-book"><div class="mini-k"><span><i class="mini-dot" aria-hidden="true"></i>Now booking</span>' + (months ? '<span class="mini-months" aria-hidden="true">' + months + '</span>' : '') + '</div>' +
          '<h3 class="ab_bento-card_title">' + esc(when || 'New missions') + '</h3><p class="mini-p">Taking on new missions. Discovery calls are 30 minutes.</p>' +
          '<a class="ab_bento-card_link" href="/contact#call" aria-label="Book a discovery call">↗</a></article>' +
        '<article data-name="Card / reply" data-selectable="" class="ab_bento-card is-mini is-reply"><span class="mini-aura" aria-hidden="true"><i></i></span><span class="mini-sparks" aria-hidden="true"><b style="left:62%;top:18%;--d:0s;--s:1"></b><b style="left:84%;top:34%;--d:0.9s;--s:0.7"></b><b style="left:74%;top:62%;--d:1.7s;--s:0.55"></b><b style="left:90%;top:78%;--d:0.4s;--s:0.85"></b><b style="left:48%;top:12%;--d:2.3s;--s:0.5"></b><b style="left:34%;top:82%;--d:1.2s;--s:0.6"></b><b style="left:12%;top:20%;--d:2.8s;--s:0.45"></b></span><div class="mini-k"><span>Reply time</span><span class="mini-bubble" aria-hidden="true"><i></i><i></i><i></i></span></div>' +
          '<h3 class="ab_bento-card_title">&lt; 1 business day</h3><p class="mini-p">A real person on the other end, not a ticket queue.</p>' +
          '<a class="ab_bento-card_link" href="/contact" aria-label="Send a message">↗</a></article>';
      $$('.ab_bento-card', minis).forEach(function(c){ if (AB.cardFx) AB.cardFx(c); });
    }
    var order = ['deploys', 'motion', 'specimen', 'availability', 'branding', 'trajectory', 'observatory', 'cms-integrations', 'systems', 'performance'].map(function(n){ return n === 'availability' ? minis : cell(n); });
    if (order.some(function(c){ return !c; })) return;
    var set = { observatory: 'is-wide', performance: 'is-wide' };
    ['deploys', 'motion', 'specimen', 'availability', 'branding', 'trajectory', 'observatory', 'cms-integrations', 'systems', 'performance'].forEach(function(n, i){
      var c = order[i]; if (n !== 'availability') c.classList.remove('is-tall', 'is-wide', 'is-half');
      if (set[n]) c.classList.add(set[n]);
      grid.appendChild(c);
    });
  })();

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
      v.innerHTML = '<span class="cap-tag" style="left:16px;top:14px">FIG. 01 · DRAG · TAP TO MORPH</span><span class="cap-tag t-tilt" style="right:16px;bottom:14px">RING TILT −18°</span><span class="cap-tag t-seed" style="left:16px;bottom:14px">SEED 42</span>' +
        '<div class="ab_planet is-drag" data-planet="gas" data-seed="42" data-colors="#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c" data-ring="#f0e6ff,#9a8cd6,#4d4488" data-tilt="-18" data-spin="50" data-glow="rgba(143,177,255,.45)" data-label="Specimen planet" data-drag></div>';
      var pw = $('.ab_planet', v); buildPlanet(pw);
      // tap / click (not a drag) morphs it into a new planet: new type, palette, ring and seed, rebuilt mid-shrink
      var LOOKS = [
        ['gas', '#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c', 'rgba(143,177,255,.45)'], ['gas', '#3a1d10,#b8552a,#f2a65a,#fde3c0,#5c2a14', 'rgba(242,166,90,.4)'],
        ['ice', '#0f2a3a,#3f8fa8,#9fe8ff,#eaffff', 'rgba(159,232,255,.4)'], ['lava', '#140807,#3a1510,#ff6a3d,#ffd27a', 'rgba(255,106,61,.45)'],
        ['rocky', '#1a1a1f,#4a4550,#8a8290,#c9c2cc', 'rgba(201,194,204,.25)'], ['terra', '#0e3a5c,#1e6e8c,#3f8f4a,#a88b5c,#f2f0ea', 'rgba(76,141,255,.35)'],
        ['gas', '#12301f,#1f7a4a,#5eead4,#d8fff2,#0c2418', 'rgba(94,234,212,.4)'], ['ice', '#2a1d4a,#7c5cff,#c4b5ff,#f4efff', 'rgba(124,92,255,.4)']
      ], look = 0, busy = false, tSeed = $('.t-seed', v), tTilt = $('.t-tilt', v);
      function morph(){
        if (busy) return; busy = true;
        look = (look + 1 + Math.floor(Math.random() * (LOOKS.length - 1))) % LOOKS.length;
        var L = LOOKS[look], seed = 1 + Math.floor(Math.random() * 998), ring = L[0] === 'gas' || Math.random() < .35, tilt = -8 - Math.floor(Math.random() * 22);
        function swap(){
          pw.innerHTML = ''; pw.__built = false; pw.__body = null;
          pw.setAttribute('data-planet', L[0]); pw.setAttribute('data-colors', L[1]); pw.setAttribute('data-glow', L[2]); pw.setAttribute('data-seed', seed);
          if (ring){ var c = L[1].split(','); pw.setAttribute('data-ring', [c[c.length - 2] || c[1], c[1], c[0]].join(',')); pw.setAttribute('data-tilt', tilt); } else pw.removeAttribute('data-ring');
          buildPlanet(pw);
          if (tSeed) tSeed.textContent = 'SEED ' + seed;
          if (tTilt) tTilt.textContent = ring ? 'RING TILT −' + Math.abs(tilt) + '°' : 'NO RING';
          if (AB.quest) AB.quest('spin');
        }
        if (!hasGsap || reduce){ swap(); busy = false; return; }
        gsap.timeline({ onComplete: function(){ busy = false; } })
          .to(pw, { scale: .55, filter: 'brightness(2.2) blur(6px)', duration: .35, ease: 'power2.in' })
          .call(swap)
          .to(pw, { scale: 1, filter: 'brightness(1) blur(0px)', duration: .9, ease: 'elastic.out(1,.55)', clearProps: 'filter' });
      }
      if (!canDrag){ pw.addEventListener('click', morph); return; }
      var back;
      function sched(){ if (back) back.kill(); back = gsap.delayedCall(4, function(){ gsap.to(pw, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.5)' }); }); }
      Draggable.create(pw, { type: 'x,y', bounds: v, inertia: true, edgeResistance: .6, minimumMovement: 4,
        onPress: function(){ if (back) back.kill(); }, onClick: morph, onDragEnd: sched, onThrowComplete: sched });
      nudge(pw, sched);
    },
    easing: function(v){
      if (!hasGsap) return;
      var eases = ['expo.out', 'power3.inOut', 'elastic.out(1,0.4)', 'back.out(2.2)', 'bounce.out'], ei = 0;
      v.innerHTML = '<div class="v-ease"><div class="v-plot"><svg viewBox="0 0 200 120" preserveAspectRatio="none"><path d="M0 110H200M0 10H200" stroke="currentColor" stroke-opacity=".15" fill="none" vector-effect="non-scaling-stroke"/><path class="cv" fill="none" stroke="#FF6A3D" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><i class="dt" aria-hidden="true"></i></div><div class="track"><i></i></div></div><button type="button">expo.out ↻</button>';
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
        tw = gsap.to(o, { t: 1, duration: 1.6, ease: 'none', repeat: -1, repeatDelay: .6, onUpdate: function(){ var e = E(o.t); dt.style.left = (o.t * 100) + '%'; dt.style.top = (Y(e) / 120 * 100) + '%'; sq.style.bottom = ((e - lo) / (hi - lo) * (trH - 14)) + 'px'; } });
        if (reduce) tw.progress(1).pause(); else if (!seen) tw.pause();
      }
      function next(){ ei = (ei + 1) % eases.length; play(); }
      btn.addEventListener('click', next); $('.v-plot', v).addEventListener('click', next); $('svg', v).style.cursor = 'var(--hand, pointer)';
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
      // code → deploy: the editor types index.html, site.css and app.js, then the terminal runs the whole deploy.
      // Every scene is padded to the same number of lines, so the card never changes height between scenes
      var ok = '<span class="ok">✓</span> ', ind = '&nbsp;&nbsp;';
      var SC = [
        { tab: 'index.html', lines: ['<span class="k">&lt;main</span> <span class="a">class</span>=<span class="s">"page"</span><span class="k">&gt;</span>', ind + '<span class="k">&lt;h1</span> <span class="a">class</span>=<span class="s">"hero"</span><span class="k">&gt;</span>Built to launch<span class="k">&lt;/h1&gt;</span>', ind + '<span class="k">&lt;a</span> <span class="a">class</span>=<span class="s">"btn"</span> <span class="a">href</span>=<span class="s">"/start"</span><span class="k">&gt;</span>Start<span class="k">&lt;/a&gt;</span>', '<span class="k">&lt;/main&gt;</span>', '<span class="k">&lt;script</span> <span class="a">src</span>=<span class="s">"app.js"</span> <span class="a">defer</span><span class="k">&gt;&lt;/script&gt;</span>'] },
        { tab: 'site.css', lines: ['<span class="k">:root</span> { <span class="a">--signal</span>: <span class="s">#FF6A3D</span>; }', '<span class="k">.hero</span> { <span class="a">font-size</span>: <span class="s">clamp(3rem, 8vw, 8rem)</span>; }', '<span class="k">.btn</span> { <span class="a">background</span>: <span class="s">var(--signal)</span>; }', '<span class="k">@media</span> (prefers-reduced-motion: reduce) {', ind + '<span class="k">*</span> { <span class="a">animation</span>: <span class="s">none</span>; }', '}'] },
        { tab: 'app.js', lines: ['<span class="c">// motion that survives a copy edit</span>', '<span class="a">gsap</span>.from(<span class="s">\'.hero\'</span>, { y: <span class="s">40</span>, opacity: <span class="s">0</span> });', '<span class="k">document</span>.querySelectorAll(<span class="s">\'.btn\'</span>)', ind + '.forEach(<span class="k">function</span> (b) {', ind + ind + 'b.addEventListener(<span class="s">\'click\'</span>, launch);', ind + '});'] },
        { tab: 'terminal', term: true, lines: ['<span class="hi">$</span> git push origin main', '→ building site with Astro', ind + ok + '14 pages · 3 collections', ind + ok + 'images optimized · −62%', ok + 'build complete in 8.4s', '→ running checks', ind + ok + 'Lighthouse 98 · 100 · 100 · 100', ind + ok + 'links 212 / 212', ind + ok + 'reduced motion respected', '→ deploying to the edge', ind + ok + '31 regions warm', ind + ok + 'CDN purged · v1.4.2 tagged', ok + 'live at <span class="hi">yourbrand.com</span>', ok + '0 errors · 0 warnings', '<span class="hi">$</span> <span class="cur"></span>'] }
      ];
      var N = Math.max.apply(null, SC.map(function(x){ return x.lines.length; }));
      v.innerHTML = '<div class="v-term"><div class="bar"><i></i><i></i><i></i><span class="tabs">' + SC.map(function(x, i){ return '<span data-t="' + i + '">' + x.tab + '</span>'; }).join('') + '</span></div><div class="out"></div></div>';
      var out = $('.out', v), tabs = $$('.tabs span', v), vis = false, running = false, timers = [];
      function scene(k){
        var x = SC[k], html = '';
        tabs.forEach(function(t, i){ t.classList.toggle('on', i === k); });
        for (var i = 0; i < N; i++) html += '<div class="ln">' + (x.lines[i] || '&nbsp;') + '</div>';
        out.innerHTML = html; out.classList.toggle('is-term', !!x.term);
        var rows = $$('.ln', out).slice(0, x.lines.length);
        rows.forEach(function(r){ r.style.visibility = 'hidden'; });
        return rows;
      }
      function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
      function run(){
        if (running) return; running = true;
        var k = 0;
        (function next(){
          if (!vis){ running = false; return; }
          var rows = scene(k), i = 0, step = SC[k].term ? 300 : 230;
          (function nx(){
            if (i < rows.length){
              var r = rows[i++]; r.style.visibility = 'visible';
              // type each line in (stepped reveal), terminal lines just appear like output
              if (hasGsap && !SC[k].term){ var n = Math.max(6, Math.min(40, r.textContent.length)); gsap.fromTo(r, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: n * .014, ease: 'steps(' + n + ')', clearProps: 'clipPath' }); }
              later(nx, step);
            } else {
              var hold = SC[k].term ? 3800 : 900; k = (k + 1) % SC.length;
              later(next, hold);
            }
          })();
        })();
      }
      if (reduce){ scene(3).forEach(function(r){ r.style.visibility = 'visible'; }); return; }
      scene(0);
      onView(v, function(x){ vis = x; if (x) run(); else { timers.forEach(clearTimeout); timers = []; running = false; } });
    },
    pipeline: function(v){
      // any source, one shape: each source's packet leaves in its own color and lands in Webflow blue
      var SRC = [['Airtable', '#E8A400'], ['Sheets', '#0F9D58'], ['API', '#7C5CFF']];
      v.innerHTML = '<div class="v-pipe"><div class="node src">' + SRC.map(function(s, i){ return '<span style="--c:' + s[1] + '"><b></b>' + s[0] + '</span>'; }).join('') + '</div><div class="node hook">Webhook</div><div class="node dst">Webflow CMS<em>+1 item</em></div>' +
        '<div class="line">' + SRC.map(function(s, i){ return '<i style="--c:' + s[1] + ';--dy:' + ((i - 1) * 33) + 'px;animation-delay:' + (i * .8).toFixed(1) + 's"></i>'; }).join('') + '</div></div>';
    },
    tokens: function(v){
      // one set of tokens skins every component: the same card, button and type scale re-themed three ways
      var T = [
        { n: 'AB', brand: '#FF6A3D', surf: '#0B0C14', ink: '#F2F0EA', rad: 0, scale: 1.333, font: 'var(--_typography---font--display)' },
        { n: 'Nova', brand: '#7C5CFF', surf: '#F1EDFF', ink: '#1A1530', rad: 14, scale: 1.2, font: 'var(--_typography---font--body)' },
        { n: 'Terra', brand: '#0AA35A', surf: '#FFF6E6', ink: '#1E2A1F', rad: 6, scale: 1.25, font: 'Georgia, serif' }
      ], ti = 0;
      v.innerHTML = '<div class="v-sys"><div class="v-sys_tabs">' + T.map(function(t, i){ return '<button type="button" data-i="' + i + '">' + t.n + '</button>'; }).join('') + '<span class="v-sys_n">tokens → components</span></div>' +
        '<div class="v-sys_body"><dl class="v-sys_tok"></dl><div class="v-sys_ui"><div class="v-sys_card"><small>Case study</small><strong>Mission report</strong><p>One edit, every page.</p><span class="v-sys_btn">Launch →</span></div>' +
        '<div class="v-sys_ramp"><span>Aa</span><span>Aa</span><span>Aa</span><span>Aa</span></div></div></div></div>';
      var root = $('.v-sys', v), dl = $('.v-sys_tok', v), tabs = $$('.v-sys_tabs button', v), seen = false, timer = null;
      function apply(i){
        var t = T[i]; ti = i;
        root.style.setProperty('--b', t.brand); root.style.setProperty('--s', t.surf); root.style.setProperty('--k', t.ink);
        root.style.setProperty('--r', t.rad + 'px'); root.style.setProperty('--f', t.font); root.style.setProperty('--x', t.scale);
        dl.innerHTML = [['brand', '<i style="background:' + t.brand + '"></i>' + t.brand], ['surface', '<i style="background:' + t.surf + '"></i>' + t.surf], ['radius', t.rad + 'px'], ['scale', '× ' + t.scale]].map(function(r){ return '<div><dt>--' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
        tabs.forEach(function(b, k){ b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      }
      function loop(){ clearTimeout(timer); if (reduce || !seen) return; timer = setTimeout(function(){ apply((ti + 1) % T.length); loop(); }, 3200); }
      tabs.forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); apply(+b.getAttribute('data-i')); loop(); }); });
      apply(0); onView(root, function(x){ seen = x; if (x) loop(); else clearTimeout(timer); });
    },
    observatory: function(v){
      // wide card (two cards across): a full star chart + a live signal log of real notes; narrow: the compact chart
      if (v.clientWidth < 560) return VIZ.observatoryCompact(v);
      var C = [
        { k: 'WHO', c: '#FFD166', p: [[38, 62], [76, 40], [110, 72], [84, 102]] }, { k: 'WHAT', c: '#5eead4', p: [[168, 42], [204, 64], [238, 46], [262, 74]] },
        { k: 'HOW', c: '#ffffff', p: [[316, 72], [348, 42], [386, 62], [418, 38], [466, 60]] }, { k: 'WATCH', c: '#8fb1ff', p: [[56, 160], [94, 142], [130, 172], [104, 198]] },
        { k: 'IDEAS', c: '#FF9E80', p: [[206, 150], [242, 182], [280, 156], [304, 192]] }, { k: 'KNOWN', c: '#c4b5ff', p: [[366, 152], [404, 178], [442, 152], [484, 176]] }
      ], W = 520, H = 220, NS = 'http://www.w3.org/2000/svg';
      var grid = ''; for (var gx = 52; gx < W; gx += 52) grid += '<path d="M' + gx + ' 0V' + H + '"/>'; for (var gy = 44; gy < H; gy += 44) grid += '<path d="M0 ' + gy + 'H' + W + '"/>';
      var bg = ''; for (var k = 0; k < 60; k++) bg += '<circle cx="' + ((k * 83) % W) + '" cy="' + ((k * 47) % H) + '" r="' + (k % 6 ? .6 : 1.1) + '"/>';
      v.innerHTML = '<div class="v-obsw" style="position:relative;width:100%;height:100%;min-height:190px;display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:14px;padding:14px">' +
        '<div class="v-obsw-chart" style="position:relative;min-width:0;min-height:0"><i class="beam" aria-hidden="true" style="position:absolute;top:-14px;bottom:-14px;left:0;width:2px;background:rgba(255,255,255,.6);box-shadow:0 0 10px rgba(255,255,255,.5);pointer-events:none;will-change:transform"><b style="position:absolute;top:0;bottom:0;right:100%;width:56px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.16));transform-origin:100% 50%"></b></i>' +
        '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible" aria-hidden="true">' +
        '<g stroke="rgba(255,255,255,.07)" stroke-width="1">' + grid + '</g><g fill="rgba(255,255,255,.45)">' + bg + '</g><g class="lk"></g>' +
        C.map(function(g, i){ return '<g class="cst" data-i="' + i + '"><path d="M' + g.p.map(function(q){ return q.join(' '); }).join('L') + '" fill="none" stroke="' + g.c + '" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>' +
          g.p.map(function(q){ return '<circle class="st" cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="' + g.c + '"/>'; }).join('') +
          '<text x="' + g.p[0][0] + '" y="' + (g.p[0][1] - 10) + '" fill="' + g.c + '" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.5" opacity=".85">' + g.k + '</text></g>'; }).join('') +
        '</svg></div>' +
        '<div class="v-log" style="display:flex;flex-direction:column;gap:8px;min-width:0;font-family:var(--mono);color:#fff">' +
          '<div style="display:flex;justify-content:space-between;gap:8px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;opacity:.8"><span>Signal log</span><span class="n">— notes</span></div>' +
          '<ul class="rows" style="list-style:none;margin:0;padding:0;display:grid;gap:6px;flex:1;align-content:start"></ul>' +
          '<span class="chip" style="align-self:flex-start;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border:1px solid rgba(255,255,255,.45);background:rgba(7,8,13,.25)">BN · Build notes</span></div></div>';
      var svg = $('svg', v), stars = $$('.st', v), paths = $$('.cst path', v), rowsEl = $('.rows', v), chip = $('.chip', v), nEl = $('.n', v), lk = $('.lk', v), card = v.closest('.ab_bento-card');
      // notes: the Home cards now, the full Observatory list once the card is on screen
      var notes = $$('[data-ks-card]').map(function(a){ return { code: txt(a, '[data-field="code"]'), t: txt(a, '.ab_ks-card_h') || a.getAttribute('data-slug'), th: a.getAttribute('data-theme') || '' }; }).filter(function(n){ return n.code; }), at = 0, fetched = false;
      function txt(el, sel){ var n = $(sel, el); return n ? n.textContent.trim() : ''; }
      function rowHTML(n, on){ return '<li style="display:flex;gap:8px;align-items:baseline;min-width:0;font-size:11px;line-height:1.35;padding:6px 8px;background:' + (on ? 'rgba(255,255,255,.14)' : 'rgba(7,8,13,.22)') + ';border-left:2px solid ' + (on ? '#fff' : 'transparent') + '"><b style="font-weight:500;flex:none;opacity:.9">' + esc(n.code) + '</b><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:' + (on ? 1 : .72) + '">' + esc(n.t) + '</span></li>'; }
      function paintLog(fresh){
        if (!notes.length) return;
        nEl.textContent = notes.length + ' notes';
        var out = ''; for (var i = 0; i < Math.min(4, notes.length); i++) out += rowHTML(notes[(at + i) % notes.length], !i);
        rowsEl.innerHTML = out;
        var cur = notes[at % notes.length]; chip.textContent = /why/i.test(cur.th) || /^WB/.test(cur.code) ? 'WB · Why before how' : 'BN · Build notes';
        if (fresh && hasGsap && !reduce) gsap.from(rowsEl.firstChild, { x: -10, opacity: 0, duration: .45, ease: 'power3.out' });
      }
      function loadAll(){
        if (fetched || !window.fetch || !window.DOMParser) return; fetched = true;
        fetch('/observatory').then(function(r){ return r.ok ? r.text() : ''; }).then(function(h){
          if (!h) return; var d = new DOMParser().parseFromString(h, 'text/html');
          var all = [].slice.call(d.querySelectorAll('[data-ks-card]')).map(function(a){ return { code: txt(a, '[data-field="code"]'), t: txt(a, '.ab_ks-card_h') || a.getAttribute('data-slug'), th: a.getAttribute('data-theme') || '' }; }).filter(function(n){ return n.code; });
          // newest first: highest number, WB and BN interleaved by number
          all.sort(function(a, b){ return (parseInt(b.code.replace(/\D/g, ''), 10) || 0) - (parseInt(a.code.replace(/\D/g, ''), 10) || 0); });
          if (all.length){ notes = all; at = 0; paintLog(); }
        }).catch(function(){});
      }
      paintLog();
      if (reduce || !hasGsap){ loadAll(); return; }
      paths.forEach(function(p){ var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      gsap.set(stars, { transformOrigin: '50% 50%', opacity: .35 });
      // the beam glides back and forth across the whole panel (easing at each end, its glow trailing behind it);
      // constellations draw in on the first pass and stay, stars flare each time it crosses them
      var box = $('.v-obsw-chart', v), beam = $('.beam', v), glow = $('.beam b', v), o = { x: 0 }, drawn = [], lastX = 0;
      function toPx(x){ var w = box.clientWidth, h = box.clientHeight, k = Math.min(w / W, h / H) || 0; return (w - W * k) / 2 + x * k; }
      var sweep = gsap.to(o, { x: W, duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true, onUpdate: function(){
        var dir = o.x >= lastX ? 1 : -1; lastX = o.x;
        gsap.set(beam, { x: toPx(o.x) }); glow.style.transform = 'scaleX(' + dir + ')';
        stars.forEach(function(st){ var d = Math.abs(+st.getAttribute('cx') - o.x); st.style.opacity = d < 18 ? 1 : Math.max(.35, +(st.style.opacity || .35) - .01); st.setAttribute('r', d < 18 ? 4.6 : 3); });
        // going right the beam draws each constellation as it reaches it; coming back it erases them in reverse,
        // so every pass redraws the chart (nothing pops in all at once)
        C.forEach(function(g, i){
          var gx = g.p[0][0];
          if (dir > 0 && !drawn[i] && o.x > gx){ drawn[i] = true; gsap.to(paths[i], { strokeDashoffset: 0, duration: .9, ease: 'power2.out', overwrite: true }); }
          else if (dir < 0 && drawn[i] && o.x < g.p[g.p.length - 1][0]){ drawn[i] = false; gsap.to(paths[i], { strokeDashoffset: paths[i].getTotalLength(), duration: .9, ease: 'power2.in', overwrite: true }); }
        });
      } });
      // signal arcs: a link between two constellations with a dot riding it (topics connect notes across groups)
      function cen(g){ var x = 0, y = 0; g.p.forEach(function(q){ x += q[0]; y += q[1]; }); return [x / g.p.length, y / g.p.length]; }
      var arcT = null;
      function arc(){
        var a = Math.floor(Math.random() * 6), b = (a + 1 + Math.floor(Math.random() * 5)) % 6, p0 = cen(C[a]), p1 = cen(C[b]);
        var mx = (p0[0] + p1[0]) / 2, my = Math.min(p0[1], p1[1]) - 40, d = 'M' + p0[0] + ' ' + p0[1] + 'Q' + mx + ' ' + my + ' ' + p1[0] + ' ' + p1[1];
        var path = document.createElementNS(NS, 'path'); path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', C[b].c); path.setAttribute('stroke-width', '1'); path.setAttribute('stroke-dasharray', '3 4'); path.setAttribute('opacity', '.7');
        var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('r', '2.6'); dot.setAttribute('fill', '#fff'); lk.appendChild(path); lk.appendChild(dot);
        var L = path.getTotalLength(), q = { t: 0 };
        gsap.timeline({ onComplete: function(){ path.remove(); dot.remove(); } })
          .from(path, { opacity: 0, duration: .3 })
          .to(q, { t: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: function(){ var pt = path.getPointAtLength(q.t * L); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); } }, 0)
          .to([path, dot], { opacity: 0, duration: .5 }, '+=.3');
      }
      var logT = null;
      onView(v, function(x){
        if (x){ loadAll(); sweep.play(); arcT = setInterval(arc, 2600); logT = setInterval(function(){ at = (at + 1) % Math.max(1, notes.length); paintLog(true); }, 3600); }
        else { sweep.pause(); clearInterval(arcT); clearInterval(logT); }
      });
      // hover: the scan speeds up and fires a signal arc (it no longer reveals everything at once)
      if (card){ card.addEventListener('pointerenter', function(){ sweep.timeScale(1.8); arc(); }); card.addEventListener('pointerleave', function(){ sweep.timeScale(1); }); }
    },
    observatoryCompact: function(v){
      // a tiny star chart: six constellations (the Observatory's topic groups) draw in turn; a chip flips between the two themes
      var C = [
        { c: '#FFD166', p: [[22, 34], [44, 22], [62, 40], [48, 58]] }, { c: '#5eead4', p: [[98, 20], [120, 34], [140, 24]] },
        { c: '#ffffff', p: [[176, 44], [196, 26], [218, 38], [236, 22]] }, { c: '#8fb1ff', p: [[40, 104], [62, 90], [84, 110], [70, 128]] },
        { c: '#FF9E80', p: [[128, 96], [150, 116], [172, 100]] }, { c: '#c4b5ff', p: [[206, 90], [228, 110], [250, 94], [268, 116]] }
      ];
      var bg = ''; for (var k = 0; k < 26; k++) bg += '<circle class="bg" cx="' + ((k * 97) % 290 + 5) + '" cy="' + ((k * 53) % 140 + 6) + '" r="' + (k % 4 ? .7 : 1.1) + '"/>';
      v.innerHTML = '<div class="v-obs" style="position:relative;width:100%;height:100%;min-height:150px;display:flex;flex-direction:column;justify-content:center;gap:10px;padding:14px">' +
        '<svg viewBox="0 0 290 150" style="width:100%;height:auto;display:block;overflow:visible" aria-hidden="true"><g fill="rgba(255,255,255,.5)">' + bg + '</g>' +
        C.map(function(g, i){ return '<g class="cst" data-i="' + i + '"><path d="M' + g.p.map(function(q){ return q.join(' '); }).join('L') + '" fill="none" stroke="' + g.c + '" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>' +
          g.p.map(function(q){ return '<circle class="st" cx="' + q[0] + '" cy="' + q[1] + '" r="2.6" fill="' + g.c + '"/>'; }).join('') + '</g>'; }).join('') + '</svg>' +
        '<span class="chip" style="align-self:flex-start;font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:5px 9px;border:1px solid rgba(255,255,255,.45);color:#fff;background:rgba(7,8,13,.25)">BN · Build notes</span></div>';
      var paths = $$('.cst path', v), stars = $$('.st', v), chip = $('.chip', v), card = v.closest('.ab_bento-card'), vis = false;
      if (reduce || !hasGsap) return;
      paths.forEach(function(p){ var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      gsap.set(stars, { scale: 0, transformOrigin: '50% 50%' });
      var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
      C.forEach(function(g, i){
        var grp = $$('.cst[data-i="' + i + '"] .st', v), p = paths[i], at = i * .75;
        tl.to(grp, { scale: 1, duration: .35, stagger: .08, ease: 'back.out(3)' }, at).to(p, { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, at + .1);
        if (i === 2) tl.call(function(){ chip.textContent = 'WB · Why before how'; }, null, at);
      });
      tl.to(paths, { opacity: .25, duration: .8 }, '+=1.4').to(stars, { scale: 0, duration: .4, stagger: .02 }, '<.4')
        .call(function(){ chip.textContent = 'BN · Build notes'; paths.forEach(function(p){ p.style.strokeDashoffset = p.getTotalLength(); p.style.opacity = .9; }); });
      gsap.to(stars, { opacity: .55, duration: 1.2, repeat: -1, yoyo: true, stagger: { each: .23, from: 'random' }, ease: 'sine.inOut' });
      onView(v, function(x){ vis = x; x ? tl.play() : tl.pause(); });
      if (card) card.addEventListener('pointerenter', function(){ gsap.to(paths, { strokeDashoffset: 0, opacity: 1, duration: .6 }); gsap.to(stars, { scale: 1.2, duration: .4, stagger: .02, yoyo: true, repeat: 1 }); });
    },
    trajectory: function(v){
      // a diagonal route: Earth bottom left, three service planets climbing to the top right (picked fresh each loop),
      // each lights up as the rocket arrives, and the ETA counts up. Same palette as the planner on /services.
      // The starfield is an HTML layer over the whole panel, so it fills the card whatever its shape
      var SV = [['Website', '#146EF5'], ['3D', '#5eead4'], ['Motion', '#0AE448'], ['Brand', '#FF6A3D'], ['CMS', '#8fb1ff'], ['System', '#7c5cff'], ['Speed', '#ffd166'], ['Deploy', '#C9C7C0']];
      var PT = [[96, 92, 7], [178, 60, 9], [262, 26, 11]], E = [20, 118], NS = 'http://www.w3.org/2000/svg';
      var bg = ''; for (var k = 0; k < 90; k++){ var sz = k % 9 ? 1 : 2; bg += '<i style="left:' + ((k * 37.3) % 100).toFixed(1) + '%;top:' + ((k * 61.7) % 100).toFixed(1) + '%;width:' + sz + 'px;height:' + sz + 'px;opacity:' + (k % 4 ? .35 : .8) + '"></i>'; }
      var d = 'M' + E[0] + ' ' + E[1] + ' Q 44 78 ' + PT[0][0] + ' ' + PT[0][1] + ' Q 134 104 ' + PT[1][0] + ' ' + PT[1][1] + ' Q 206 18 ' + PT[2][0] + ' ' + PT[2][1];
      v.innerHTML = '<div class="v-traj" style="position:relative;width:100%;height:100%;min-height:150px;display:flex;align-items:center;justify-content:center;padding:10px 12px;overflow:hidden">' +
        '<span class="v-traj-stars" aria-hidden="true">' + bg + '</span>' +
        '<svg viewBox="0 0 290 136" style="position:relative;width:100%;height:100%;max-height:190px;display:block;overflow:visible" aria-hidden="true">' +
        '<path class="ghost" d="' + d + '" fill="none" stroke="rgba(242,240,234,.22)" stroke-width="1" stroke-dasharray="2 3"/>' +
        '<path class="done" d="' + d + '" fill="none" stroke="#FF6A3D" stroke-width="1.4"/>' +
        '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="6" fill="#4C8DFF"/><circle cx="' + (E[0] - 2) + '" cy="' + (E[1] - 2) + '" r="2.4" fill="#fff" opacity=".35"/>' +
        '<text x="' + (E[0] + 10) + '" y="' + (E[1] + 3) + '" class="lb">EARTH</text>' +
        PT.map(function(q, i){ return '<g class="pl" data-i="' + i + '"><circle class="ring" cx="' + q[0] + '" cy="' + q[1] + '" r="' + (q[2] + 4) + '" fill="none" stroke-width="1"/><circle class="body" cx="' + q[0] + '" cy="' + q[1] + '" r="' + q[2] + '"/>' +
          '<circle cx="' + (q[0] - q[2] * .3) + '" cy="' + (q[1] - q[2] * .3) + '" r="' + (q[2] * .45) + '" fill="#fff" opacity=".22"/><text class="lb nm" x="' + q[0] + '" y="' + (q[1] + q[2] + 11) + '" text-anchor="middle"></text></g>'; }).join('') +
        '<g class="rk"><path d="M5 0 L-4 -3.4 L-2 0 L-4 3.4 Z" fill="#F2F0EA"/><path d="M-2.4 0 L-7 -1.4 L-7 1.4 Z" fill="#FF6A3D"/></g>' +
        '<text class="lb eta" x="4" y="10">ETA 00 WK</text></svg></div>';
      var svg = $('svg', v), done = $('.done', v), rk = $('.rk', v), eta = $('.eta', v), pls = $$('.pl', v), L = done.getTotalLength();
      $$('.lb', v).forEach(function(t){ t.setAttribute('fill', 'rgba(242,240,234,.6)'); t.setAttribute('font-family', 'JetBrains Mono, monospace'); t.setAttribute('font-size', '7'); t.setAttribute('letter-spacing', '.8'); });
      var at = [0, 0, 0]; // path length at each planet
      (function(){ var best = [1e9, 1e9, 1e9]; for (var l = 0; l <= L; l += 1){ var pt = done.getPointAtLength(l); PT.forEach(function(q, i){ var dd = Math.hypot(pt.x - q[0], pt.y - q[1]); if (dd < best[i]){ best[i] = dd; at[i] = l; } }); } })();
      function pick(){
        var pool = SV.slice(), out = []; for (var i = 0; i < 3; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        pls.forEach(function(g, i){ $('.body', g).setAttribute('fill', 'rgba(242,240,234,.14)'); $('.ring', g).setAttribute('stroke', out[i][1]); $('.ring', g).style.opacity = 0; $('.nm', g).textContent = out[i][0].toUpperCase(); g.__c = out[i][1]; });
      }
      function place(l){ var a = done.getPointAtLength(Math.max(0, l)), b = done.getPointAtLength(Math.min(L, l + 1)); rk.setAttribute('transform', 'translate(' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ') rotate(' + (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1) + ')'); }
      function arrive(i){ var g = pls[i]; $('.body', g).setAttribute('fill', g.__c); if (hasGsap && !reduce) gsap.fromTo($('.ring', g), { opacity: 1, scale: .6, transformOrigin: '50% 50%' }, { opacity: 0, scale: 1.8, duration: .9, ease: 'power2.out' }); }
      pick(); done.style.strokeDasharray = L; done.style.strokeDashoffset = L; place(0);
      if (reduce || !hasGsap){ done.style.strokeDashoffset = 0; place(L - 1); pls.forEach(function(g, i){ arrive(i); }); eta.textContent = 'ETA 08 WK'; return; }
      var o = { l: 0 }, tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .2, onRepeat: pick });
      tl.set(o, { l: 0 }).set(done, { strokeDashoffset: L, opacity: 1 }).set(rk, { opacity: 1 });
      var prev = 0;
      at.forEach(function(len, i){
        tl.to(o, { l: len, duration: 1 + (len - prev) / 60, ease: 'power1.inOut', onUpdate: function(){ place(o.l); done.style.strokeDashoffset = L - o.l; eta.textContent = 'ETA ' + ('0' + Math.round(o.l / L * 8)).slice(-2) + ' WK'; } })
          .call(arrive, [i]).to({}, { duration: .45 });
        prev = len;
      });
      tl.to({}, { duration: 1.4 }).to([done, rk], { opacity: 0, duration: .4 });
      onView(v, function(x){ x ? tl.play() : tl.pause(); });
      var card = v.closest('.ab_bento-card'); if (card) card.addEventListener('pointerenter', function(){ tl.timeScale(1.8); }); if (card) card.addEventListener('pointerleave', function(){ tl.timeScale(1); });
    },
    meters: function(v){
      // six readings (two columns when the card is wide): loading, stability, response, motion, audit, access
      var M = [['LCP', .72, '&lt; 2.5 s'], ['CLS', .9, '&lt; 0.1'], ['INP', .84, '&lt; 200 ms'], ['Motion', 1, '60 fps'], ['Lighthouse', .98, '98 / 100'], ['A11y', 1, '100 / 100']];
      v.innerHTML = '<div class="v-meter">' + M.map(function(m){ return '<div><span>' + m[0] + '</span><b><i style="--v:' + m[1] + '"></i></b><span>' + m[2] + '</span></div>'; }).join('') + '</div>';
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
        var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'wp'); g.style.cursor = 'var(--hand, pointer)';
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
    /* the receiving satellite (wide screens): it floats, searches while the quote decodes, then locks onto the new
       transmission's source; the frequency takes the /process COMMS colors, one per quote, and the readout names the source */
    var dish = (function(){
      var inner = $('.ab_transmission_inner'); if (!inner) return null;
      var FQ = ['#FF6A3D', '#146EF5', '#5eead4', '#0AE448', '#7c5cff', '#ffd166'];
      var el = document.createElement('div'); el.className = 'abt-dish'; el.setAttribute('aria-hidden', 'true');
      var grid = '', k;
      for (k = 1; k < 4; k++) grid += 'M' + (70 + k * 22.5) + ' 236v28M' + (240 + k * 22.5) + ' 236v28';
      el.innerHTML = '<svg class="abt-sky" viewBox="0 0 400 400"><path class="abt-beam" d="M0 0L0 0"/>' +
        '<g class="abt-src"><circle class="abt-ring" r="10"/><circle class="abt-ring is-2" r="10"/><circle class="abt-star" r="3.2"/></g>' +
        '<g class="abt-sat"><path class="abt-arm" d="M160 250H180M220 250H240"/>' +
        '<rect class="abt-panel" x="70" y="236" width="90" height="28"/><rect class="abt-panel" x="240" y="236" width="90" height="28"/><path class="abt-grid" d="' + grid + 'M70 250H160M240 250H330"/>' +
        '<rect class="abt-body" x="180" y="226" width="40" height="50"/><rect class="abt-band" x="180" y="226" width="40" height="9"/>' +
        '<path class="abt-mast" d="M200 226V206"/><path class="abt-ant" d="M184 208Q200 190 216 208Z"/><circle class="abt-rx" cx="200" cy="196" r="3.5"/><circle class="abt-lock" cx="200" cy="196" r="4"/>' +
        '<circle class="abt-led" cx="200" cy="266" r="2.4"/></g></svg>' +
        '<div class="abt-read"><div class="abt-read-k"><span>RX</span><b class="abt-src-t"></b></div><svg class="abt-wave" viewBox="0 0 300 48" preserveAspectRatio="none"><path d="M0 24H300"/></svg>' +
        '<div class="abt-read-k"><span class="abt-stat">Seeking</span><b class="abt-ch">CH 01</b></div>' +
        '<div class="abt-read-k"><span>Decoded</span><b class="abt-pct">000%</b></div><i class="abt-bar"><i></i></i></div>';
      inner.appendChild(el);
      var sat = $('.abt-sat', el), src = $('.abt-src', el), beam = $('.abt-beam', el), wave = $('.abt-wave path', el), pct = $('.abt-pct', el), bar = $('.abt-bar i', el), srcT = $('.abt-src-t', el), stat = $('.abt-stat', el), chEl = $('.abt-ch', el);
      var st = { noise: 0, dec: 1, ang: 0, seek: 0, beam: 1, mx: 0, my: 0 }, sx = 300, sy = 70, t = 0, running = false, n = 0;
      function draw(){
        // float: a slow bob and sway (a little restless while it hunts), plus the drift toward the current signal
        var fx = st.mx + Math.sin(t * .5) * (4 + st.seek * 6), fy = st.my + Math.sin(t * .8) * (5 + st.seek * 4), wob = Math.sin(t * .7) * 2 + Math.sin(t * 2.3) * 5 * st.seek;
        var a = (st.ang + wob) * Math.PI / 180, dy = -54;
        var px = 200 + fx - dy * Math.sin(a), py = 250 + fy + dy * Math.cos(a);
        sat.setAttribute('transform', 'translate(' + fx.toFixed(2) + ' ' + fy.toFixed(2) + ') rotate(' + (st.ang + wob).toFixed(2) + ' 200 250)');
        beam.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + 'L' + px.toFixed(1) + ' ' + py.toFixed(1)); beam.style.opacity = (st.beam * .8).toFixed(2);
        var d = '';
        for (var x = 0; x <= 300; x += 5){ var e = Math.sin(x / 300 * Math.PI), y = 24 + Math.sin(x * .09 + t * 3) * 7 * e + (Math.random() - .5) * 34 * st.noise * e; d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1); }
        wave.setAttribute('d', d);
        var p = Math.round(st.dec * 100); pct.textContent = (p < 10 ? '00' : p < 100 ? '0' : '') + p + '%'; bar.style.transform = 'scaleX(' + st.dec + ')';
      }
      if (hasGsap && !reduce) gsap.ticker.add(function(time, dt){ if (!running) return; t += dt / 1000; draw(); });
      return {
        on: function(v){ running = v; },
        tune: function(q, dur){
          var c = FQ[n % FQ.length], ch = (n % FQ.length) + 1; n++;
          el.style.setProperty('--fq', c); chEl.textContent = 'CH 0' + ch; srcT.textContent = q.c || q.a;
          sx = 50 + Math.random() * 300; sy = 24 + Math.random() * 100;
          src.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
          var ang = Math.max(-40, Math.min(40, Math.atan2(sx - 200, 250 - sy) * 180 / Math.PI));
          // it drifts a little toward the signal (a fraction of the way, clamped) as it turns to face it
          var mx = Math.max(-30, Math.min(30, (sx - 200) * .14)), my = Math.max(-22, Math.min(10, (sy - 250) * .1));
          if (!hasGsap || reduce){ st.ang = ang; st.mx = mx; st.my = my; st.noise = 0; st.dec = 1; st.seek = 0; st.beam = 1; t = 0; stat.textContent = 'Locked'; el.classList.add('is-lock'); draw(); return; }
          gsap.killTweensOf(st); gsap.killTweensOf(src); el.classList.remove('is-lock'); stat.textContent = 'Signal';
          // 1) the signal dot shows up  2) the satellite notices, drifts toward it and turns  3) it grabs the frequency
          var lockAt = 2, settle = Math.max(1.2, dur - lockAt);
          gsap.timeline()
            .to(st, { beam: 0, noise: 1, duration: .3, ease: 'power2.out' }, 0)
            .fromTo(src, { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power2.out' }, .1)
            .to(st, { seek: 1, duration: .4 }, .6)
            .add(function(){ stat.textContent = 'Seeking'; }, .7)
            .to(st, { ang: ang, mx: mx, my: my, duration: 1.3, ease: 'power2.inOut' }, .7)
            .to(st, { seek: 0, duration: .5 }, lockAt - .3)
            .to(st, { beam: 1, duration: .35 }, lockAt)
            .add(function(){ stat.textContent = 'Locked'; el.classList.remove('is-lock'); void el.offsetWidth; el.classList.add('is-lock'); }, lockAt + .1)
            .to(st, { noise: 0, duration: settle, ease: 'power2.out' }, lockAt)
            .fromTo(st, { dec: 0 }, { dec: 1, duration: lockAt + settle - .2, ease: 'none' }, .2);
        }
      };
    })();
    function render(i, reveal){
      var q = QUOTES[i]; idx = i;
      $('#iqIdx').textContent = pad2(i + 1);
      textEl.classList.toggle('long', q.t.length > 80);
      textEl.innerHTML = ''; q.t.split(/\s+/).forEach(function(w, k){ if (k) textEl.appendChild(document.createTextNode(' ')); var s = document.createElement('span'); s.className = 'qw'; s.textContent = w; textEl.appendChild(s); });
      byEl.textContent = q.a + ' · ' + q.c;
      if (dish) dish.tune(q, reveal === 'scrub' ? 2.6 : 1.6 + q.t.split(/\s+/).length * .14);
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
        // the next transmission plots in like the INCOMING label: each word decodes from noise, left to right
        gsap.set(words, { opacity: 1, y: 0 });
        if (window.ScrambleTextPlugin) words.forEach(function(w, k){ var txt = w.textContent; gsap.fromTo(w, { opacity: .35 }, { opacity: 1, duration: 1.6, delay: .3 + k * .14, ease: 'none', scrambleText: { text: txt, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+', speed: .25, revealDelay: .7 } }); });
        else gsap.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
        gsap.fromTo(byEl, { opacity: 0 }, { opacity: 1, duration: .5, delay: 1.2 + words.length * .14 });
      }
    }
    render(0, 'scrub');
    function next(){ if (scrub){ scrub.kill(); scrub = null; } render((idx + 1) % QUOTES.length, 'pop'); }
    // transmissions change by themselves while the section is on screen (paused on hover); longer quotes stay up longer
    var auto = null, seen = false, held = false;
    function queue(){ clearTimeout(auto); if (reduce || !hasGsap || !seen || held || QUOTES.length < 2) return; auto = setTimeout(function(){ next(); queue(); }, 5200 + QUOTES[idx].t.length * 30 + QUOTES[idx].t.split(/\s+/).length * 140); }
    onView(box, function(x){ seen = x; if (dish) dish.on(x); if (x) queue(); else clearTimeout(auto); });
    box.addEventListener('mouseenter', function(){ held = true; clearTimeout(auto); });
    box.addEventListener('mouseleave', function(){ held = false; queue(); });
    $('#iqNext').addEventListener('click', function(){ next(); queue(); });
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
      ad.innerHTML = '<span class="ab_planner_addon-label">Add-on</span><button type="button" class="ab_planner_chip is-addon" data-addon="KNS · Knowledge system" data-c="#FFD29A" aria-pressed="false">KNS · Knowledge system</button>';
      typesRow.parentNode.insertBefore(ad, typesRow.nextSibling);
    }
    if (!$('#plAddonsField', form) && typesRow){ var hf = document.createElement('input'); hf.type = 'hidden'; hf.name = 'Add-ons'; hf.id = 'plAddonsField'; hf.value = ''; typesRow.parentNode.appendChild(hf); }
    var chips = $$('.ab_planner_chip:not([data-addon]):not(.is-unsure)', form), addons = $$('.ab_planner_chip[data-addon]', form);
    // add-ons wear the Knowledge-system satellite icon (the same one as the /process form)
    addons.forEach(function(c){ c.setAttribute('data-addon', 'KNS · Knowledge system'); if (!$('svg', c)) c.textContent = 'KNS · Knowledge system'; if (!$('svg', c)) c.insertAdjacentHTML('afterbegin', '<svg class="sat-ico ab-ks-ico" viewBox="0 0 24 12" aria-hidden="true"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg>'); });
    var fType = $('#plTypesField'), fBud = $('#plBudField'), fBrief = $('#plBriefField'), fAdd = $('#plAddonsField');
    chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
    var ol = $('.pl-orbitlines ellipse', form); if (ol){ ol.setAttribute('cx', 110); ol.setAttribute('cy', 138); ol.setAttribute('transform', 'rotate(-14 110 138)'); }
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
      // Earth sits at (110,138) and the destinations reach x 450, so the route is centered in the 560 frame (was 56 → 462)
      var X = [300, 365, 450, 405][st.w], Y = [96, 78, 66, 54][st.w], R = 14 + Math.min(n, 4) * 3.2;
      var lift = st.w === 3 ? 140 : 90 + st.w * 12, cx = (110 + X) / 2;
      var d = 'M131 132 Q ' + cx + ' ' + (Y - lift * .35) + ' ' + (X - R - 10) + ' ' + (Y + 3);
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
        out += '<g opacity="' + op + '" transform="translate(' + (sx - 7.2).toFixed(1) + ' ' + (sy - 3.6).toFixed(1) + ') scale(.6)"><path d="M1 3.5h6v5H1zM17 3.5h6v5h-6z" fill="none" stroke="#FFD29A" stroke-width="1.3" vector-effect="non-scaling-stroke"/><path d="M7 6h3M14 6h3" stroke="#FFD29A" stroke-width="1.3" vector-effect="non-scaling-stroke"/><rect x="10" y="2.5" width="4" height="7" fill="#FFD29A"/></g>';
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

    // success panel (Webflow's .w-form-done): core/41-forms keeps the form's height and plays the shared reveal;
    // "Plot another mission" brings the form back
    var resetBtn = $('#plReset');
    if (resetBtn) resetBtn.addEventListener('click', function(){
      form.reset(); chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); ensureWindow(); bud.value = 1;
      if (doneEl) doneEl.style.display = 'none';
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
