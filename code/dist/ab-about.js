/*! AB Portfolio · ab-about v0.33.1 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abAboutInit) return;
  window.__abAboutInit = true;
  /* ===== about/00-about.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-about] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, esc = AB.esc, pad2 = AB.pad2, hex = AB.hex, sf = AB.sf;

  /* =========================================================
     ABOUT (/about) · static page, copy lives in the Designer.
     This adds the decorative SVGs, the pilot planet's rings + moons, the crew badge on its lanyard,
     and the section interactions (statement, promises, flight log, Between launches cards).
     ========================================================= */
  var PAGE = $('.section_about-hero');
  if (!PAGE) return;
  function io(el, fn, opts){
    if (!el) return;
    if (!('IntersectionObserver' in window)){ fn(); return; }
    var o = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ fn(); o.disconnect(); } }, opts || { threshold: .4 });
    o.observe(el);
  }
  function keyAct(el, fn){ el.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fn(e); } }); }

  /* ---------- decorative SVGs into their Designer slots ---------- */
  var SIG = '<svg class="ab_sig" viewBox="0 0 300 90" role="img" aria-label="Signed, Angelino"><text x="6" y="62">Angelino</text><path class="ab_sig-line" d="M10 80 Q 150 90 280 64"/><path class="ab_sig-tail" d="M10 80 Q 150 90 280 64"/>' +
    '<g class="ab_sig-star"><circle r="2.6"/><path d="M0 -9 L1.3 -1.3 L9 0 L1.3 1.3 L0 9 L-1.3 1.3 L-9 0 L-1.3 -1.3 Z"/></g></svg>';
  var SIL = '<svg viewBox="0 0 100 110" aria-hidden="true"><circle cx="50" cy="36" r="22" fill="none" stroke="#8A8FA3" stroke-width="2" stroke-dasharray="4 4"/><path d="M8 108c4-26 22-40 42-40s38 14 42 40" fill="none" stroke="#8A8FA3" stroke-width="2" stroke-dasharray="4 4"/></svg>';
  var HEART = '<svg viewBox="0 0 8 7"><path d="M1 0h2v1h2V0h2v1h1v3H7v1H6v1H5v1H3V6H2V5H1V4H0V1h1z"/></svg>';
  var ICON = {
    book: '<path d="M6 8h11a4 4 0 0 1 4 4v22a3 3 0 0 0-3-3H6z"/><path d="M34 8H23a4 4 0 0 0-4 4v22a3 3 0 0 1 3-3h12z"/>',
    pen: '<path d="M8 32l4-12L26 6l8 8-14 14z"/><path d="M8 32l8-4"/><circle cx="21" cy="19" r="2"/>',
    code: '<path d="M14 12L5 20l9 8M26 12l9 8-9 8M22 8l-4 24"/>',
    orbit: '<circle cx="20" cy="20" r="6"/><ellipse cx="20" cy="20" rx="17" ry="7" transform="rotate(-20 20 20)"/>',
    flag: '<path d="M10 36V5M10 6h20l-5 7 5 7H10"/>'
  };
  $$('[data-about-sig]').forEach(function(s){ s.innerHTML = SIG; });
  $$('[data-about-sil]').forEach(function(s){ s.innerHTML = SIL; });
  $$('[data-about-mark]').forEach(function(s){ if (AB.markSVG) s.innerHTML = AB.markSVG({ cls: 'ab_badge_logo' }); });
  $$('[data-about-barcode]').forEach(function(s){ var h = ''; for (var i = 0; i < 30; i++){ var r = (i * 7919) % 11; h += '<i class="' + (r < 3 ? 'w' : r > 8 ? 'g' : '') + '"></i>'; } s.innerHTML = h; });
  $$('[data-tl-icon]').forEach(function(s){ var d = ICON[s.getAttribute('data-tl-icon')]; if (d) s.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5">' + d + '</svg>'; });
  $$('[data-tl-ship]').forEach(function(s){ s.innerHTML = '<svg viewBox="-12 -12 24 24"><rect x="-6" y="-6" width="12" height="12" fill="#FF6A3D" transform="rotate(45)"/><rect x="-2.5" y="-2.5" width="5" height="5" fill="#07080D" transform="rotate(45)"/></svg>'; });
  $$('[data-gm-hearts]').forEach(function(s){ s.innerHTML = HEART + HEART + HEART; });
  // a headshot dropped into the photo frame in the Designer replaces the placeholder; until then the script places the
  // astronaut portrait (Webflow asset, transparent background) over a small moving sky: two star layers drifting at
  // different speeds, a nebula glow, the odd shooting star (Designer step: drop the asset into the frame, the sky stays)
  var BADGE_IMG = 'https://cdn.prod.website-files.com/6ab5fe4a5ee75f9c981dc0be/6abb34929dc4c32cda9248fa_angelino-astronaut-badge.webp';
  $$('[data-badge-photo]').forEach(function(p){
    if (!$('img', p)) p.insertAdjacentHTML('afterbegin', '<img src="' + BADGE_IMG + '" alt="Angelino Barajas in an orange and white space suit" width="720" height="899" loading="lazy" decoding="async">');
    p.classList.add('has-photo');
    p.insertAdjacentHTML('afterbegin', '<div class="ab_badge_sky" aria-hidden="true"><i class="neb"></i><i class="st is-a"></i><i class="st is-b"></i><i class="shoot"></i></div>');
  });

  /* ---------- the pilot planet: an orange giant with a stack of rings and two moons (wife + son) ---------- */
  (function(){
    var P = $('[data-pilot-planet]');
    if (!P) return;
    if (!P.__body && AB.buildPlanet) AB.buildPlanet(P);
    var body = P.__body; if (!body) return;
    // extra thin rings outside the main band: [radius (x planet width), inner color, outer color, alpha, tilt offset]
    var RINGS = [[2.05, '#ffe6cf', '#ffb27a', .7, 0], [2.3, '#ff6a3d', '#ffd9b8', .55, 0], [2.62, '#ffb27a', '#ff6a3d', .42, 1], [2.95, '#ffe6cf', '#c2451a', .3, 2], [3.3, '#ff8a4c', '#ffe6cf', .18, 3]];
    var tilt = parseFloat(P.getAttribute('data-tilt')) || -17;
    function rgba(h, a){ return 'rgba(' + hex(h).join(',') + ',' + a + ')'; }
    RINGS.forEach(function(r){
      ['back', 'front'].forEach(function(side){
        var el = document.createElement('div'); el.className = 'pring pring-' + side + ' is-thin';
        el.style.setProperty('--rs', r[0]); el.style.setProperty('--tilt', (tilt + r[4]) + 'deg');
        el.style.setProperty('--t1', rgba(r[1], r[3])); el.style.setProperty('--t2', rgba(r[2], r[3] * .8));
        el.appendChild(document.createElement('i')); body.appendChild(el);
      });
    });
    // moons: kept in the planet's body so they follow a drag; they pass behind the planet on the far side
    var MOONS = [
      { cls: 'is-wife', tag: 'Moon · wife', rx: 1.55, ry: .5, rot: 30, size: .22, period: 14, phase: .2 },
      { cls: 'is-son', tag: 'Moon · son', rx: 1.12, ry: .36, rot: -8, size: .15, period: 8.5, phase: 2.4 }
    ].map(function(m){
      var el = document.createElement('div'); el.className = 'ab_moon ' + m.cls; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<span class="ab_moon_body"></span><span class="ab_moon_tag">' + m.tag + '</span>';
      el.style.width = el.style.height = (m.size * 100) + '%';
      body.appendChild(el); m.el = el; return m;
    });
    var t0 = Date.now();
    function place(t){
      var w = P.getBoundingClientRect().width || 100;
      MOONS.forEach(function(m){
        var a = m.phase + (reduce ? 0 : t / m.period * Math.PI * 2);
        var ex = Math.cos(a) * m.rx, ey = Math.sin(a) * m.ry, rr = m.rot * Math.PI / 180;
        var x = (ex * Math.cos(rr) - ey * Math.sin(rr)) * w, y = (ex * Math.sin(rr) + ey * Math.cos(rr)) * w;
        var front = Math.sin(a) > 0, s = .82 + .18 * (Math.sin(a) + 1) / 2;
        m.el.style.transform = 'translate(-50%,-50%) translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        m.el.style.zIndex = front ? 6 : 0;
      });
    }
    place(0);
    if (reduce) return;
    var visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(P);
    if (hasGsap) gsap.ticker.add(function(){ if (visible) place((Date.now() - t0) / 1000); });
    else (function loop(){ if (visible) place((Date.now() - t0) / 1000); requestAnimationFrame(loop); })();
  })();

  /* ---------- crew badge: hangs on its lanyard; drag it and it swoops back to hanging; tap to flip ---------- */
  (function(){
    var wrap = $('[data-badge-wrap]'), badge = $('[data-badge]'), rig = $('[data-badge-rig]'), strap = $('[data-badge-lanyard]');
    if (!wrap || !badge || !rig || !strap) return;
    var front = $('.ab_badge_face.is-front', badge), back = $('.ab_badge_face.is-back', badge), hint = $('[data-badge-hint]');
    if (hint) hint.textContent = coarse ? 'Tap to flip · swipe sideways to swing' : 'Click the badge to flip it · drag it to swing';
    badge.setAttribute('aria-label', 'Crew badge. Press Enter to flip it over, arrow keys to swing it.');
    function flip(){
      if (AB.quest) AB.quest('badge'); 
      badge.classList.toggle('is-flipped'); var f = badge.classList.contains('is-flipped');
      if (front) front.setAttribute('aria-hidden', f ? 'true' : 'false'); if (back) back.setAttribute('aria-hidden', f ? 'false' : 'true');
      if (f){ var s = back && $('.ab_sig', back); if (s) setTimeout(function(){ sigOn(s); }, 350); }
    }
    keyAct(badge, flip);

    /* geometry (wrap coordinates): the strap hangs from A; its clip holds the badge 18px below the rig's top center */
    var CLIP = 18, A, L, CX, TOP;
    function measure(){
      var cs = getComputedStyle(wrap);
      CX = wrap.clientWidth / 2; TOP = parseFloat(cs.paddingTop) || 80;
      A = { x: CX, y: -40 }; L = TOP + CLIP - A.y;
    }
    measure();
    // state: strap angle phi (rad, 0 = straight down), length r, and their velocities
    var S = { phi: 0, r: 0, w: 0, v: 0, held: false, running: false };
    S.r = L;
    function render(){
      var sin = Math.sin(S.phi), cos = Math.cos(S.phi);
      var ex = A.x + S.r * sin, ey = A.y + S.r * cos;             // strap end = the clip
      var th = S.phi + Math.max(-.35, Math.min(.35, S.w * .06));  // the badge lags a little behind the strap
      var x = ex - CX + CLIP * Math.sin(th), y = ey - TOP - CLIP * Math.cos(th);
      rig.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) rotate(' + (th * 180 / Math.PI).toFixed(3) + 'deg)';
      strap.style.height = S.r.toFixed(2) + 'px';
      strap.style.transform = 'rotate(' + (-S.phi * 180 / Math.PI).toFixed(3) + 'deg)';
    }
    function rest(){ S.phi = 0; S.w = 0; S.r = L; S.v = 0; rig.style.transform = ''; strap.style.transform = ''; strap.style.height = ''; wrap.classList.remove('is-live'); }
    // damped pendulum (angle) + springy strap (length), integrated in small steps
    var G = 15, DAMP = 1.5, K = 170, C = 13, last = 0;
    function step(){
      if (S.held || !S.running) return;
      var now = Date.now() / 1000, dt = Math.min(.05, last ? now - last : .016); last = now;
      var n = Math.ceil(dt / .004), h = dt / n;
      for (var i = 0; i < n; i++){
        S.w += (-G * Math.sin(S.phi) - DAMP * S.w) * h; S.phi += S.w * h;
        S.v += (-K * (S.r - L) - C * S.v) * h; S.r += S.v * h;
      }
      render();
      if (Math.abs(S.phi) < .002 && Math.abs(S.w) < .01 && Math.abs(S.r - L) < .3 && Math.abs(S.v) < .5){ S.running = false; rest(); stopTick(); }
    }
    var ticking = false;
    function startTick(){ last = 0; S.running = true; wrap.classList.add('is-live'); if (!ticking){ ticking = true; if (hasGsap) gsap.ticker.add(step); else (function loop(){ if (!ticking) return; step(); requestAnimationFrame(loop); })(); } }
    function stopTick(){ ticking = false; if (hasGsap) gsap.ticker.remove(step); }
    function release(){
      if (reduce){ S.held = false; if (hasGsap) gsap.to(S, { phi: 0, r: L, duration: .5, ease: 'power2.out', onUpdate: render, onComplete: rest }); else rest(); return; }
      S.held = false; startTick(); if (AB.quest) AB.quest('lanyard'); 
    }
    // keyboard: arrows give it a push
    badge.addEventListener('keydown', function(e){
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); if (reduce) return;
      measure(); S.w += e.key === 'ArrowLeft' ? -2.4 : 2.4; if (!S.running) startTick();
    });
    // pointer: drag from wherever you grabbed it; a short press without movement is a click (flip)
    var down = null, samples = [];
    badge.style.touchAction = coarse ? 'pan-y' : 'none';
    badge.addEventListener('pointerdown', function(e){
      if (e.button !== undefined && e.button !== 0) return;
      measure();
      var wr = wrap.getBoundingClientRect();
      var ex = A.x + S.r * Math.sin(S.phi), ey = A.y + S.r * Math.cos(S.phi);
      down = { x: e.clientX, y: e.clientY, ex: ex, ey: ey, wl: wr.left, wt: wr.top, moved: false, id: e.pointerId };
      samples = [];
    });
    badge.addEventListener('pointermove', function(e){
      // hover tilt + holo sheen (only while it hangs still)
      var r = badge.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      badge.style.setProperty('--mx', (px * 100) + '%'); badge.style.setProperty('--my', (py * 100) + '%');
      if (!down){ if (!reduce && !S.running && hasGsap) gsap.to(badge, { rotationY: (px - .5) * 16, rotationX: (.5 - py) * 12, duration: .5, ease: 'power2.out', overwrite: 'auto' }); return; }
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.moved){
        if (Math.abs(dx) + Math.abs(dy) < 6) return;
        down.moved = true; S.held = true; S.running = false; stopTick(); wrap.classList.add('is-live', 'is-held');
        try { badge.setPointerCapture(down.id); } catch (err){}
        if (hasGsap) gsap.to(badge, { rotationY: 0, rotationX: 0, duration: .3, overwrite: 'auto' });
      }
      var tx = down.ex + dx - A.x, ty = down.ey + dy - A.y;
      var r2 = Math.sqrt(tx * tx + ty * ty), max = L * 3.2;
      if (r2 > max) r2 = max + (r2 - max) * .15;                   // rubber band past the strap's stretch
      S.phi = Math.atan2(tx, ty); S.r = Math.max(L * .55, r2);
      var now = Date.now(); samples.push({ t: now, phi: S.phi, r: S.r }); if (samples.length > 6) samples.shift();
      render();
    });
    function up(e){
      if (!down) return;
      var moved = down.moved; down = null; wrap.classList.remove('is-held');
      if (!moved){ flip(); return; }
      // release velocity from the last few samples
      if (samples.length > 1){
        var a = samples[0], b = samples[samples.length - 1], dt = Math.max(.016, (b.t - a.t) / 1000);
        var dp = b.phi - a.phi; if (dp > Math.PI) dp -= 2 * Math.PI; if (dp < -Math.PI) dp += 2 * Math.PI;
        S.w = Math.max(-14, Math.min(14, dp / dt)); S.v = Math.max(-900, Math.min(900, (b.r - a.r) / dt));
      } else { S.w = 0; S.v = 0; }
      release();
    }
    badge.addEventListener('pointerup', up);
    // a cancelled press (the page scrolled under a finger) is never a flip
    badge.addEventListener('pointercancel', function(e){ if (down && !down.moved){ down = null; return; } up(e); });
    badge.addEventListener('lostpointercapture', function(e){ if (down && down.moved) up(e); });
    badge.addEventListener('pointerleave', function(){ if (!down && hasGsap) gsap.to(badge, { rotationY: 0, rotationX: 0, duration: 1, ease: 'elastic.out(1,.5)', overwrite: 'auto' }); });
    addEventListener('resize', function(){ if (!S.running && !S.held){ measure(); rest(); } });
    // arrives swinging in from above
    if (!reduce && hasGsap) gsap.from(wrap, { y: -120, rotation: -6, opacity: 0, duration: 1.6, ease: 'elastic.out(1,.55)', delay: .4, clearProps: 'transform,opacity' });
  })();

  /* ---------- signatures: the name writes itself, then a shooting star arcs under it and leaves the underline ---------- */
  // the underline is sized to the rendered name (Caveat), rising to the right like a meteor's path
  function sigFit(svg){
    var t = $('text', svg), line = $('.ab_sig-line', svg), tail = $('.ab_sig-tail', svg); if (!t || !line) return 0;
    var w = 200; try { w = t.getComputedTextLength() || w; } catch (e){}
    var x0 = 10, x1 = Math.min(294, 6 + w + 10), d = 'M' + x0 + ' 80 Q ' + (x0 + (x1 - x0) * .55).toFixed(1) + ' 90 ' + x1.toFixed(1) + ' 66';
    line.setAttribute('d', d); tail.setAttribute('d', d);
    var L = line.getTotalLength(); svg.__L = L;
    if (!svg.__drawn){ line.style.strokeDasharray = L; line.style.strokeDashoffset = L; }
    return L;
  }
  function sigOn(svg){
    if (svg.__on) return; svg.__on = true; svg.classList.add('on');
    var line = $('.ab_sig-line', svg), tail = $('.ab_sig-tail', svg), star = $('.ab_sig-star', svg);
    function finish(){ svg.__drawn = true; line.style.strokeDashoffset = 0; }
    if (reduce || !hasGsap){ sigFit(svg); finish(); return; }
    var go = function(){
      var L = sigFit(svg), TL = Math.min(70, L * .35), o = { p: 0 };
      tail.style.strokeDasharray = TL + ' ' + (L + TL);
      gsap.timeline({ delay: 1.5, onComplete: finish })
        .set([tail, star], { opacity: 1 })
        .to(o, { p: 1, duration: 1.05, ease: 'power2.in', onUpdate: function(){
          var at = o.p * L, pt = line.getPointAtLength(at);
          line.style.strokeDashoffset = L - at;
          tail.style.strokeDashoffset = TL - at;
          star.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') scale(' + (.5 + o.p * .6).toFixed(2) + ')');
        } })
        .to(star, { opacity: 0, duration: .5, ease: 'power2.out' })
        .to(tail, { opacity: 0, duration: .45, ease: 'power2.out' }, '<');
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
  }
  $$('.ab_sig').forEach(function(svg){ if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ sigFit(svg); }); else sigFit(svg); });
  $$('.section_about-ms .ab_sig').forEach(function(s){ if (reduce) sigOn(s); else io(s, function(){ sigOn(s); }, { threshold: .6 }); });

  /* ---------- mission statement: words light up as you scroll, then the heart beats ---------- */
  (function(){
    var ms = $('[data-ms]'); if (!ms) return;
    var parts = [];
    Array.prototype.slice.call(ms.childNodes).forEach(function(n){
      var hl = n.nodeType === 1 && n.classList.contains('ab_ms_hl');
      String(n.textContent).split(/(\s+)/).forEach(function(w){ if (w) parts.push({ w: w, hl: hl }); });
    });
    var said = ms.textContent.replace(/\s+/g, ' ').trim(); ms.removeAttribute('aria-label');
    ms.innerHTML = '<span class="ab_sr">' + esc(said) + '</span>' + parts.map(function(p){ return /^\s+$/.test(p.w) ? ' ' : '<span class="ab_ms_wd' + (p.hl ? ' is-hl' : '') + '" aria-hidden="true">' + esc(p.w) + '</span>'; }).join('') +
      '<svg class="ab_ms_heart" viewBox="0 0 16 14" aria-hidden="true"><path fill="currentColor" d="M2 0h4v2h4V0h4v2h2v5h-2v2h-2v2H6v-2H4V9H2V7H0V2h2z"/></svg>';
    var words = $$('.ab_ms_wd', ms), heart = $('.ab_ms_heart', ms);
    ms.classList.add('is-ready');
    if (reduce || !hasGsap || !window.ScrollTrigger){ words.forEach(function(w){ w.classList.add('on'); }); heart.classList.add('on'); return; }
    ScrollTrigger.create({ trigger: ms, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: function(st){
      var n = Math.round(st.progress * (words.length + 1));
      words.forEach(function(w, i){ w.classList.toggle('on', i < n); });
      heart.classList.toggle('on', n > words.length);
    } });
  })();

  /* ---------- promises tick in ---------- */
  (function(){
    var list = $('[data-promises]'); if (!list) return;
    var items = $$('.ab_promise', list);
    items.forEach(function(li){ var ck = $('.ab_promise_ck', li); if (ck) ck.innerHTML = '<svg viewBox="0 0 12 12"><path d="M2 6.5l2.6 2.5L10 3"/></svg>'; });
    io(list, function(){ items.forEach(function(li, i){ setTimeout(function(){ li.classList.add('is-on'); }, reduce ? 0 : 200 + i * 260); }); });
  })();

  /* ---------- flight log: the line fills, a ship rides it and lights each waypoint ---------- */
  (function(){
    var tl = $('[data-tl]'); if (!tl) return;
    var fill = $('.ab_tl_fill', tl), ship = $('[data-tl-ship]', tl), items = $$('.ab_tl_item', tl);
    tl.classList.add('is-ready');
    function set(p){
      var h = tl.offsetHeight - 12, y = 6 + h * p;
      if (fill) fill.style.transform = 'scaleY(' + p + ')';
      if (ship) ship.style.transform = 'translateY(' + y + 'px) rotate(' + (p * 720) + 'deg)';
      items.forEach(function(li){ var wp = $('.ab_tl_wp', li); li.classList.toggle('is-on', li.offsetTop + wp.offsetTop + 9 <= y + 2); });
    }
    if (reduce || !hasGsap || !window.ScrollTrigger){ set(1); return; }
    set(0);
    ScrollTrigger.create({ trigger: tl, start: 'top 65%', end: 'bottom 55%', scrub: .6, onUpdate: function(st){ set(st.progress); }, onRefresh: function(st){ set(st.progress); } });
  })();

  /* ---------- Interstellar: time dilation clocks (1 hour there = 7 years here) ---------- */
  (function(){
    var td = $('[data-td]'); if (!td) return;
    var here = 0, hover = false, vis = false, last = 0, elH = $('[data-td-here]', td), elE = $('[data-td-earth]', td);
    // the Endurance: a ring ship floating at the edge of the black hole; flying close pulls it in to the horizon
    var hole = $('.ab_planet.is-td', td), hintEl = $('.ab_off_hint', td);
    if (hintEl) hintEl.textContent = (coarse ? 'Tap' : 'Hover') + ' to fly the Endurance close · 1 hour there = 7 years here';
    if (hole){
      var mods = ''; for (var mi = 0; mi < 12; mi++) mods += '<rect x="-3" y="-15.5" width="6" height="4.2" rx=".6" transform="rotate(' + (mi * 30) + ')"/>';
      var orb = document.createElement('div'); orb.className = 'ab_td_orbit'; orb.setAttribute('aria-hidden', 'true');
      orb.innerHTML = '<div class="ab_td_ship"><svg viewBox="-20 -20 40 40"><g class="sp"><path d="M0 -12V12M-12 0H12" stroke="#8A8FA3" stroke-width="1"/><circle r="12.4" fill="none" stroke="#8A8FA3" stroke-width=".7"/><g fill="#F2F0EA">' + mods + '</g><circle r="3.2" fill="#F2F0EA"/><circle r="1.2" fill="#FF6A3D"/></g></svg></div>';
      hole.appendChild(orb);
      var orbR = function(){ var w = hole.offsetWidth || 180; orb.style.setProperty('--rf', Math.round(w * .66) + 'px'); orb.style.setProperty('--rc', Math.round(w * .4) + 'px'); };
      orbR(); addEventListener('resize', orbR);
      var orbRate = function(r){ if (!orb.getAnimations) return; orb.getAnimations().forEach(function(a){ if (hasGsap){ var o = { r: a.playbackRate }; gsap.to(o, { r: r, duration: 1.2, ease: 'power2.out', onUpdate: function(){ a.playbackRate = o.r; } }); } else a.playbackRate = r; }); };
      if (window.MutationObserver) new MutationObserver(function(){ var c = td.classList.contains('is-close'); orbRate(c ? 3.2 : 1); if (c && AB.quest) AB.quest('endurance'); }).observe(td, { attributes: true, attributeFilter: ['class'] });
      // side quest: near the horizon, five fast taps on the black hole fire the thrusters and the Endurance breaks free
      var taps = [], freeing = false, pushT = 0;
      function push(n){ orb.style.setProperty('--push', n); orb.classList.toggle('is-thrust', n > 0); }
      hole.addEventListener('click', function(e){
        if (!td.classList.contains('is-close') || freeing) return;
        e.stopPropagation();
        var now = Date.now(); taps = taps.filter(function(t){ return now - t < 2200; }); taps.push(now);
        // each tap fires the thrusters: the ship climbs a little further out; stop tapping and it sinks back
        push(Math.min(4, taps.length)); clearTimeout(pushT); pushT = setTimeout(function(){ taps = []; push(0); }, 2200);
        if (taps.length < 5) return;
        clearTimeout(pushT); taps = []; freeing = true; push(0); orb.classList.add('is-escape');
        toast('Full thrust. The Endurance broke free of the horizon.');
        if (AB.quest) AB.quest('escape');
        setTimeout(function(){ orb.classList.remove('is-escape'); freeing = false; }, 3200);
      });
    }
    // the score: flying close shows a play button; it opens the official track (Spotify embed) in a small player docked
    // to the corner, so it keeps playing while the visitor scrolls. Starts at 0:32 (Spotify decides what a logged-out
    // listener hears: often a preview clip)
    var viz = $('.ab_bento-card_viz.is-td', td) || td;
    // desktop only: phones (iPhone Safari especially) often won't let a page start Spotify's embed, so no button there
    var scoreOn = !coarse;
    var TRACK = 'spotify:track:6pWgRkpqVfxnj3WuIcJ7WP', START = 32;
    var play = document.createElement('button'); play.type = 'button'; play.className = 'abx-score';
    play.innerHTML = '<i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></i><span>Play the score</span>';
    play.setAttribute('aria-label', 'Play the Interstellar score, Cornfield Chase, from 0:32');
    // bottom-right corner of the card (phones: under the hint line)
    if (scoreOn) td.appendChild(play);
    // the player is built (hidden) the first time the visitor flies close, so a tap on Play starts it right away:
    // browsers only allow sound from a tap/click, and it has to reach the player while that tap still counts
    var dockEl = null, ctrl = null, seeked = false, want = false;
    function scoreDock(show){
      if (!dockEl){
        dockEl = document.createElement('div'); dockEl.className = 'ab_score'; dockEl.setAttribute('role', 'region'); dockEl.setAttribute('aria-label', 'Interstellar score player');
        dockEl.innerHTML = '<div class="ab_score_h"><span>Now playing · Interstellar</span><button type="button" class="ab_score_x" aria-label="Close the player">×</button></div><div class="ab_score_f"><div id="abScoreFrame"></div></div>';
        document.body.appendChild(dockEl);
        $('.ab_score_x', dockEl).addEventListener('click', function(){ want = false; if (ctrl) try { ctrl.pause(); } catch (e){} dockEl.classList.remove('is-on'); });
        var make = function(API){
          API.createController(document.getElementById('abScoreFrame'), { uri: TRACK, width: '100%', height: 80 }, function(c){
            ctrl = c;
            c.addListener('ready', function(){ if (want) try { c.play(); } catch (e){} });
            // full track (Spotify login): jump to 0:32. Logged-out listeners get a ~20s preview clip, which 0:32 would skip past: play it from its start
            c.addListener('playback_update', function(ev){ var d = ev && ev.data; if (seeked || !d || d.isPaused || !d.duration) return; seeked = true; if (d.duration > (START + 10) * 1000 && d.position < START * 1000) try { c.seek(START); } catch (e){} });
          });
        };
        if (window.__abSpotifyAPI) make(window.__abSpotifyAPI);
        else {
          window.onSpotifyIframeApiReady = function(API){ window.__abSpotifyAPI = API; make(API); };
          var s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true; document.head.appendChild(s);
        }
      }
      if (show) dockEl.classList.add('is-on');
    }
    if (scoreOn && window.MutationObserver) new MutationObserver(function(){ if (td.classList.contains('is-close')) scoreDock(false); }).observe(td, { attributes: true, attributeFilter: ['class'] });
    play.addEventListener('click', function(e){
      e.stopPropagation(); want = true; seeked = false;
      scoreDock(true);
      if (ctrl) try { ctrl.play(); } catch (err){}
    });
    // hover is mouse/pen only: a touch tap fires enter + leave before its click, and the leave would drop is-close
    // just before the black hole's thruster tap checks it (touch uses the click toggle below)
    td.addEventListener('pointerenter', function(e){ if (e.pointerType === 'touch') return; hover = true; td.classList.add('is-close'); });
    // leaving the card stops the score (Spotify's embed has no volume control, so it can't fade): pause + tuck the player away
    function hush(){ if (!dockEl || !dockEl.classList.contains('is-on')) return; want = false; if (ctrl) try { ctrl.pause(); } catch (e){} dockEl.classList.remove('is-on'); }
    td.addEventListener('pointerleave', function(e){ if (e.pointerType === 'touch') return; hover = false; td.classList.remove('is-close'); if (e.pointerType === 'mouse') hush(); });
    // touch: no hover, so it pauses once the card has scrolled off screen
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (!es[0].isIntersecting) hush(); }).observe(td);
    if (coarse) td.addEventListener('click', function(){ hover = !hover; td.classList.toggle('is-close', hover); });
    function fmtH(s){ s = Math.floor(s); return pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(s % 60); }
    function p3(n){ n = String(n); while (n.length < 3) n = '0' + n; return n; }
    function fmtE(s){ var h = s / 3600, y = Math.floor(h / 8766), d = Math.floor((h - y * 8766) / 24), hh = Math.floor(h % 24); return y + 'y ' + p3(d) + 'd ' + pad2(hh) + 'h'; }
    function tick(){
      if (!vis){ last = 0; return; }
      var t = Date.now(), dt = last ? Math.min(.1, (t - last) / 1000) : 0; last = t;
      here += dt * (hover ? 90 : 4);
      elH.textContent = fmtH(here); elE.textContent = fmtE(here * 61362);
      requestAnimationFrame(tick);
    }
    if (reduce){ elH.textContent = '01:00:00'; elE.textContent = '7y 000d 00h'; return; }
    new IntersectionObserver(function(es){ var was = vis; vis = es[0].isIntersecting; if (vis && !was) requestAnimationFrame(tick); }).observe(td);
  })();

  /* ---------- Between launches cards: spotlight + tilt from core (AB.cardFx), bookshelf included (Angelino, 2026-09-26) ---------- */
  if (AB.cardFx) $$('.section_about-off .ab_bento-card').forEach(AB.cardFx);

  /* ---------- crew of three, in 3D (prototypes/about-cards.html › crew3d, approved 2026-09-28):
     a tilted orbital plane; rings split into back/front halves around the sun, planets scale + layer by depth and are
     lit on the side facing the sun. Hover speeds the orbits up (eased rate, so nobody jumps), a mouse tilts the plane,
     off screen it stops, reduced motion gets one still frame. The Designer's CSS orbits are hidden (.is-3d). ---------- */
  (function(){
    var sys = $('.ab_crew_sys'); if (!sys) return;
    var box = sys.parentNode, card = sys.closest('.ab_bento-card') || box, NS = 'http://www.w3.org/2000/svg';
    var P = [
      { k: 'me', c: ['#bcd6ff', '#4a7fd6', '#1c2f5c'], r: .5, s: 20, T: 7, a0: .6 },
      { k: 'spouse', c: ['#e2d6ff', '#8b5cff', '#3a2381'], r: .86, s: 28, T: 12, a0: 3.6 },
      { k: 'kid', c: ['#d8ffe9', '#3fe08e', '#137a48'], moon: 1, r: 26, s: 11, T: 3, a0: 0 }
    ];
    var c3 = document.createElement('div'); c3.className = 'ab_crew3d'; c3.setAttribute('aria-hidden', 'true');
    c3.innerHTML = '<svg class="ab_c3_svg"><g></g><g></g></svg><div class="ab_c3_sun"></div><svg class="ab_c3_svg is-front"><g></g></svg>';
    sys.appendChild(c3); sys.classList.add('is-3d');
    var gs = c3.querySelectorAll('g'), floor = gs[0], back = gs[1], front = gs[2], sun = $('.ab_c3_sun', c3);
    P.forEach(function(p){ p.el = document.createElement('div'); p.el.className = 'ab_c3_pl is-' + p.k; p.el.style.width = p.el.style.height = p.s + 'px'; c3.appendChild(p.el); });
    function el(tag, a, parent){ var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); parent.appendChild(n); return n; }
    var ringB = [], ringF = [], grid = [], spokes = [], W, H, cx, cy, R, tilt = .42, tiltT = .42, yaw = 0, yawT = 0, i;
    for (i = 0; i < 2; i++){ ringB.push(el('path', { fill: 'none', stroke: 'rgba(11,12,20,.28)', 'stroke-dasharray': '3 4' }, back)); ringF.push(el('path', { fill: 'none', stroke: 'rgba(11,12,20,.5)', 'stroke-width': 1.3, 'stroke-dasharray': '3 4' }, front)); }
    for (i = 0; i < 4; i++) grid.push(el('ellipse', { fill: 'none', stroke: 'rgba(11,12,20,.06)' }, floor));
    for (i = 0; i < 8; i++) spokes.push(el('line', { stroke: 'rgba(11,12,20,.05)' }, floor));
    var glow = el('ellipse', { fill: 'rgba(255,106,61,.10)' }, floor);
    // short boxes (phone, ~230px) sit the system a little higher so the spouse's front arc + moon clear the legend
    function size(){
      W = box.clientWidth; H = box.clientHeight; cx = W / 2; cy = H * (H < 300 ? .46 : .5);
      R = Math.min(W * .46, H * .95);
      var ss = Math.max(28, Math.min(46, R * .24)); sun.style.width = sun.style.height = ss + 'px'; sun.style.left = (cx - ss / 2) + 'px'; sun.style.top = (cy - ss / 2) + 'px';
    }
    // elliptical half-ring: 0 = back (top half), 1 = front (bottom half)
    function half(r, f){ var ry = r * tilt; return 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + ry + ' 0 0 ' + (f ? 0 : 1) + ' ' + (cx + r) + ' ' + cy; }
    function drawRings(){
      for (var j = 0; j < 2; j++){ var r = P[j].r * R; ringB[j].setAttribute('d', half(r, 0)); ringF[j].setAttribute('d', half(r, 1)); }
      grid.forEach(function(g, j){ var r = R * (.28 + j * .24); g.setAttribute('cx', cx); g.setAttribute('cy', cy); g.setAttribute('rx', r); g.setAttribute('ry', r * tilt); });
      spokes.forEach(function(s, j){ var a = j * Math.PI / 4 + yaw, r = R * 1.02; s.setAttribute('x1', cx); s.setAttribute('y1', cy); s.setAttribute('x2', cx + Math.cos(a) * r); s.setAttribute('y2', cy + Math.sin(a) * r * tilt); });
      glow.setAttribute('cx', cx); glow.setAttribute('cy', cy + 2); glow.setAttribute('rx', R * .3); glow.setAttribute('ry', R * .3 * tilt);
    }
    function place(p, x, y, d){
      var k = 1 + d * .3, dx = cx - x, dy = cy - y, L = Math.sqrt(dx * dx + dy * dy) || 1;   // lit on the side facing the sun
      p.el.style.background = 'radial-gradient(circle at ' + (50 + dx / L * 26).toFixed(0) + '% ' + (50 + dy / L * 26).toFixed(0) + '%,' + p.c[0] + ',' + p.c[1] + ' 48%,' + p.c[2] + ')';
      p.el.style.transform = 'translate(' + (x - p.s / 2).toFixed(1) + 'px,' + (y - p.s / 2).toFixed(1) + 'px) scale(' + k.toFixed(3) + ')';
      p.el.style.zIndex = d > 0 ? 8 : 3;   // in front of the sun (5) and the front ring (6), or behind both
      p.el.style.boxShadow = '0 0 ' + (d > 0 ? 10 : 4) + 'px ' + (p.k === 'kid' ? 'rgba(63,224,142,.55)' : 'rgba(11,12,20,.12)');
      p.el.style.filter = d < 0 ? 'saturate(' + (1 + d * .35).toFixed(2) + ') brightness(' + (1 + d * .12).toFixed(2) + ')' : '';
    }
    var t = 0, rate = 1, rateT = 1, last = 0, vis = true, run = false;
    function draw(){
      drawRings();
      var sp = null;
      P.forEach(function(p){
        var a = p.a0 + t / p.T * Math.PI * 2 + (p.moon ? 0 : yaw), x, y;
        if (p.moon){
          var mr = p.r * sp.k; x = sp.x + Math.cos(a) * mr; y = sp.y + Math.sin(a) * mr * tilt;
          place(p, x, y, sp.d + Math.sin(a) * .18); p.el.style.zIndex = Math.sin(a) > 0 ? sp.z + 1 : sp.z - 1;
        } else {
          var r = p.r * R, d = Math.sin(a); x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r * tilt;
          place(p, x, y, d); sp = { x: x, y: y, d: d, k: 1 + d * .3, z: d > 0 ? 8 : 3 };
        }
      });
    }
    function frame(now){
      if (!vis){ run = false; return; }
      var dt = Math.min(.05, (now - last) / 1000); last = now;
      rate += (rateT - rate) * .06; tilt += (tiltT - tilt) * .08; yaw += (yawT - yaw) * .08;
      t += dt * rate; draw();
      requestAnimationFrame(frame);
    }
    function start(){ if (run || reduce) return; run = true; last = performance.now(); requestAnimationFrame(frame); }
    size(); draw();
    var rs = function(){ size(); draw(); };
    if (window.ResizeObserver) new ResizeObserver(rs).observe(box); else window.addEventListener('resize', rs);
    if (reduce) return;
    card.addEventListener('pointerenter', function(){ rateT = 2.2; });
    card.addEventListener('pointerleave', function(){ rateT = 1; tiltT = .42; yawT = 0; });
    card.addEventListener('pointermove', function(e){ if (e.pointerType !== 'mouse') return; var r = box.getBoundingClientRect(); tiltT = .28 + Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * .3; yawT = ((e.clientX - r.left) / r.width - .5) * .5; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis = es[0].isIntersecting; if (vis) start(); }).observe(box);
    else start();
  })();

  /* ---------- space facts (Designer list [data-about-facts]) + drag-to-spin planet ---------- */
  (function(){
    var el = $('[data-fact]'), more = $('[data-fact-more]');
    var FACTS = $$('[data-about-facts] p').map(function(p){ return [p.getAttribute('data-k') || '', p.textContent.trim()]; }).filter(function(f){ return f[1]; });
    if (el && FACTS.length){
      var fi = 0;
      var show = function(){ var f = FACTS[fi % FACTS.length]; el.innerHTML = (f[0] ? '<b>' + esc(f[0]) + '</b> ' : '') + esc(f[1]); if (!reduce && hasGsap) gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .45, ease: 'power2.out' }); };
      show();
      if (more){ var next = function(){ fi++; show(); }; more.addEventListener('click', next); keyAct(more, next); }
    }
    $$('[data-spin-drag]').forEach(function(p){
      var sx = 0, drag = false;
      p.style.touchAction = 'pan-y';
      p.addEventListener('pointerdown', function(e){ drag = true; sx = e.clientX; try { p.setPointerCapture(e.pointerId); } catch (err){} p.style.cursor = 'grabbing'; });
      p.addEventListener('pointermove', function(e){ if (!drag || !hasGsap) return; gsap.to(p, { rotation: (e.clientX - sx) * .5, duration: .3, overwrite: 'auto' }); });
      function end(){ if (!drag) return; drag = false; p.style.cursor = ''; if (AB.quest) AB.quest('spin');  if (hasGsap) gsap.to(p, { rotation: 0, duration: 1.4, ease: 'elastic.out(1,.4)', overwrite: 'auto' }); }
      p.addEventListener('pointerup', end); p.addEventListener('pointercancel', end);
    });
  })();

  /* ---------- philosophy: another question (Designer list [data-about-questions]) ----------
     Angelino's astronaut (logo/SVG/astronaut-1.svg, recolored to the site palette) floats on a tether from the card's
     corner. Scrolling nudges him (he can drift a little past the frame and settles back), he can be dragged and springs
     home, and every new question changes his visor's gradient, sweeps a glint across it and gives him a little spin. */
  (function(){
    var box = $('[data-ph]'), qT = $('[data-ph-q]'), qN = $('[data-ph-no]');
    var QS = $$('[data-about-questions] p').map(function(p){ return p.textContent.trim(); }).filter(Boolean);
    if (!box || !qT || !QS.length) return;
    var ASTRO = [["k","M106.47,87.78c1.85-4.63,2.98-7.4,3.39-8.33,2.31-5.16,5.92-9.04,10.82-11.64.18-.1.37-.17.58-.21l3.93-.86c.74-.16,1.5-.16,2.25,0l4.54.92s.05.02.08.03c14.98,7.45,11.29,22.21,6.74,34.97-.5,1.4-1.04,3.12-1.63,5.15-.35,1.19-.33,2.95.06,5.29,1.15,6.8.48,13.8-2.01,21.01-.24.69-.09,1.46.4,2.02,2.07,2.35,4.07,4.89,6,7.6,3.01,4.24,6.27,7,9.06,10.68,7.65,10.11,16,20.57,25.07,31.38,1.76,2.1,3.44,4.03,5.04,5.78,1.37,1.49,3.25,3.22,5.66,5.18,10.73,8.74,23.53,16.32,38.4,22.73,11.55,4.97,19.31,8.02,23.28,9.15.18.05.36.13.53.22,1.7.93,3.32,1.53,4.85,1.8.46.08.85-.36.69-.8-.79-2.23-1.98-4.94-3.56-8.13-1.19-2.41-2.26-5.13-3.21-8.18-2.43-7.77-4.15-15.36-5.14-22.77-.11-.81-.71-1.46-1.5-1.62-13.76-2.87-21.68-11.09-23.75-24.66-.79-5.17-.64-11.95.43-20.34,1.67-13.03,4.14-24.35,7.42-33.94,2.32-6.79,5.98-14.02,11.15-18.83,1.67-1.56,3.87-3.05,6.58-4.46.82-.43,1.99-.42,2.31-.66.09-.07.19-.16.31-.27.14-.13.32-.23.51-.28,4.55-1.23,9.06-1.58,13.51-1.07.54.06,1.08-.2,1.37-.66,1.28-2.06,1.86-4.36,3.13-6.57,5.33-9.28,10.96-17.5,16.89-24.66,12.63-15.26,27.84-27.45,45.64-36.58C348.18,4.94,371.34-.44,395.76.03c1.74.03,3.29.14,4.65.31,2.06.26,3.97-.02,6.25.2,16.68,1.57,32.74,5.53,48.17,11.87,24.67,10.13,45.43,25.96,62.26,47.49,12.51,15.99,21.28,32.99,26.32,50.98.89,3.21,2.3,9.8,4.23,19.75.44,2.27-.1,4.96,1.03,7.45.15.33.39.6.69.79.42.25.96.43,1.63.53.23.04.45.11.66.21,2.9,1.39,7.8,3.48,10.33,5.82,10.02,9.29,10.02,26.46,7.97,38.52-1.26,7.39-2.98,15.25-5.16,23.6-.85,3.27-1.96,6.45-3.32,9.55-2.3,5.23-3.74,8.28-4.32,9.14-2.45,3.6-5.43,7.15-8.96,10.64-.36.36-.2.98.29,1.12,3.75,1.07,6.97,2.03,9.64,2.9,4.33,1.4,8.37,3.37,12.14,5.9,6.71,4.53,10.71,11.41,12.24,19.26.73,3.77.88,8.65.44,14.62-.25,3.33-1.29,8.09-3.13,14.28-3.95,13.27-6.81,22.74-8.58,28.39-.19.59,0,1.24.48,1.64,16.35,13.81,30.49,29.54,42.41,47.17,15.47,22.87,28.12,47.88,36.7,74.6.01.04.02.08.03.13l.41,3.25c.1.78.56,1.46,1.23,1.85,6.76,3.95,13.6,10.19,20.53,18.7,8.4,10.33,14.96,18.8,19.69,25.41,2.79,3.92,5.12,8.41,6.97,13.47,1.31,3.56,1.55,8.71,1.03,11.87-.63,3.81-2.89,6.79-6.78,8.92-.61.33-.91,1.04-.73,1.71,1.51,5.61,1.9,9.58-.54,14.76-2.06,4.39-5.65,7.21-10.77,8.47-.93.23-1.62,1-1.76,1.94-1.65,10.94-12.65,15.84-22.42,11.16-.75-.36-1.66-.02-1.98.76-2.24,5.44-6.52,8.61-12.33,8.88-9.1.43-15.43-6.21-17.94-14.62-2.31-7.75-5.75-15.39-10.32-22.9-.06-.1-.65-1.11-1.77-3.02-.63-1.08-1.78-2.66-3.44-4.74-.32-.4-.96-.18-.97.33l-.16,5.36c-.01.42-.1.83-.25,1.21-.69,1.73-.57,3.11-1.07,4.6-3.5,10.43-14.24,20.93-25.65,12.77-3.73-2.67-6.33-6.39-7.79-11.14-.13-.41-.19-.84-.19-1.28v-9.27c0-.28.03-.55.09-.82l1.86-8.46c.02-.08.03-.16.03-.25v-3.42c0-.26-.04-.52-.13-.76-.99-2.71-.64-4.87-1.32-7.5-.53-2.06-.65-4.47-.35-7.22.39-3.57.82-6.01,1.27-7.31.64-1.86.87-3.31.68-4.36-.08-.42-.31-.79-.64-1.05-3.21-2.47-6.19-5.83-8.93-10.06-1.57-2.43-3.55-4.21-5.26-6.43-12.25-15.84-24.83-30.9-37.73-45.17-.47-.53-1.34-.32-1.53.37-.05.18-.52,1.62-1.4,4.31-2.29,6.99-4.7,13.85-7.21,20.59-1.17,3.15-2.52,7.11-4.05,11.9-1.11,3.49-2.55,7.42-4.33,11.79-.93,2.27-1.78,5.4-2.44,7.31-1.41,4.08-5.16,14.5-11.25,31.25-2.14,5.89-5.26,12.3-9.81,16.49-3.34,3.07-6.87,5.52-10.58,7.33-4.91,2.42-11.75,2.93-17.94,2.42-.62-.05-1.18.34-1.35.94-4.29,15.16-9.38,30.78-15.26,46.86-2.49,6.8-6.37,16.81-11.66,30.03-1.21,3.04-2.32,5.93-3.32,8.68-2.11,5.81-4.61,11.05-6.73,16.74-1.57,4.23-2.65,6.93-3.24,8.12-2.16,4.42-3.48,7.5-3.97,9.24-4.37,15.58-8.81,31.11-13.32,46.58-.29,1.01-1.2,3.75-2.73,8.22-.76,2.23-1.61,5.07-2.56,8.51-.06.21-.13.42-.22.61-1.39,3.32-2.07,5.54-2.02,6.65.43,11.73.53,18.55.3,20.47-.31,2.57-.58,4.94-.82,7.09-.16,1.43-.62,3.76-1.38,6.99-2.01,8.58-5.53,17.36-10.58,26.35-6.2,11.05-14.23,19.63-24.08,25.74-7.31,4.53-15.18,7.26-23.6,8.18-2.83.31-8.53.34-17.09.07-1.79-.05-3.16-1.06-4.95-.96-.34.02-.67-.02-.98-.13-1.52-.51-2.99-1-4.42-1.48-16.49-5.47-27.02-16.38-31.58-32.71-2.96-10.61-2.47-21.77,1.48-33.48,3.02-8.94,7.94-19.25,14.76-30.93.15-.27.24-.57.26-.87.33-5.09-.79-10.13-.97-15.18-.07-2.33-.33-7.47-.76-15.42-.86-15.71.02-33.47,2.63-53.29.27-2.09.7-4.75,1.27-8,.73-4.18,1.19-6.85,1.4-8.01.76-4.29,1.73-8.77,2.9-13.44,2.45-9.77,4.02-15.85,4.71-18.22,3.77-13.03,7.88-26.33,12.34-39.9.17-.53-.09-1.1-.61-1.3l-11.48-4.5c-.67-.26-1.43-.08-1.91.45-18.88,21.06-34.63,38.96-47.24,53.69-3.56,4.17-1.8,10.62-2.47,15.24-.55,3.83-.83,6.51-.82,8.02.04,5.3-.8,12.05-.93,19.32-.09,4.66-.39,10.22-.9,16.67-.25,3.07-.09,4.9.99,7.88,3.78,10.42,4.99,21.01,2.85,31.9-.67,3.39-2.41,7.52-5.24,12.4-4.23,7.29-8.28,13.35-12.15,18.16-3.61,4.49-5.43,6.75-5.46,6.78-3.19,3.57-7.51,7.87-12.96,12.89-2.89,2.67-5.85,4.92-8.88,6.77-3.84,2.34-7.1,4.16-9.79,5.46-5.67,2.75-14.36,5.03-21.01,5.64-6.97.64-13.95,0-20.93-1.91-7.24-1.99-13.41-5.2-18.5-9.63-9.39-8.16-14.73-18.86-16.04-32.1-.64-6.53.23-13,2.61-19.41,3.16-8.51,7.48-16.52,12.95-24.03,1.67-2.31,3.71-5.02,6.12-8.13.38-.49.49-1.13.3-1.72-2.05-6.41-4.25-13.68-6.61-21.81-4.83-16.61-7.62-33.32-8.39-50.13-.23-4.87.09-10.21.96-16.01.18-1.2-.02-2.69.16-4.01,1.97-14.23,6.55-28.45,13.73-42.64,3.55-7.01,7.22-13.59,11.01-19.74,15.2-24.6,32.04-47.47,50.53-68.61.71-.81,1.17-1.8,1.35-2.86,1.13-6.58,1.72-9.98,1.77-10.2,1.1-5.33,2.14-10.63,3.13-15.89.69-3.67,1.42-7.1,2.19-10.27,1.1-4.54,2-9.56,3.01-13.69,2.47-10.15,4.88-20.09,7.23-29.83,2.53-10.54,5.27-21.09,8.2-31.64.25-.89-.24-1.82-1.11-2.13-13.23-4.63-26.07-9.92-38.52-15.87-4.75-2.28-8.11-3.86-10.08-4.74-2.97-1.33-6.28-3.01-9.94-5.04-9.16-5.08-17.65-10.23-25.48-15.46-9.91-6.61-19.2-13.61-27.9-22.25-4.97-4.93-10.05-10.54-15.25-16.82-9.7-11.71-17.9-25.67-25.32-39.71-.54-1.03-2.52-5.16-5.93-12.41-2.09-4.44-3.71-8.19-4.86-11.26-2.51-6.69-3.94-10.53-4.28-11.52-1.19-3.4-1.76-6.54-1.73-9.41,0-.35-.12-.69-.34-.96-.33-.41-1.32-1.1-2.97-2.09-3.28-1.95-6.44-4.71-9.47-8.28-5.73-6.75-9.97-13.58-12.7-20.51-1.23-3.11-2.15-4.95-2.76-5.52-.93-.87-5.93-6.21-14.98-16.03-1.9-2.07-4.06-5-6.49-8.8-2.43-3.81-3.74-7.15-3.95-10.04-.53-7.31,3.34-15.52,11.46-16.41.65-.07,1.06-.74.83-1.35-.52-1.39-1.1-3.05-1.74-4.98-3.62-10.94,4.86-23.03,16.79-20.7.82.16,1.55-.55,1.41-1.38-.97-5.53.63-10.11,4.79-13.75,2.28-1.99,4.78-3.37,7.5-4.12,2.79-.77,5.58-.55,8.35.66,2.71,1.19,5.12,3.01,7.25,5.46.29.33.83.2.92-.23,1.17-5.31,4.41-9.31,9.72-12.01.37-.19.77-.32,1.18-.39,12.29-2.06,18.29,6.84,22.52,17.29,2.38,5.87,4.62,12.3,7.28,18.17.81,1.79,1.67,4.02,2.58,6.69.35,1.02,2.07,5.06,5.14,12.13.08.2.36.2.44,0h0Z"],["w","M266.49,93.45l1.49-2.99c.09-.19.08-.41-.04-.58-.68-1.01-.3-2.92,1.13-5.72,12.31-23.99,29.76-42.77,52.35-56.34,18.19-10.93,37.9-17.41,59.15-19.42,29.06-2.76,60.32,3.97,86.13,18.23,26.81,14.81,47.23,36.29,61.25,64.46,6.71,13.46,11.04,28.31,13.01,44.56.04.3-.21.56-.52.53-10.57-1.13-19.04,7.13-22.49,16.45-.1.25-.46.22-.51-.05-5.32-28.63-21.01-54.57-43.11-73.37-3.17-2.69-7.34-5.82-12.52-9.41-4.98-3.45-9.41-6.19-13.3-8.24-32.93-17.36-67.34-22.84-103.24-16.44-10.27,1.83-21.5,5.62-33.67,11.36-16.74,7.9-31.68,20.28-44.82,37.15-.05.07-.15.09-.23.04-.07-.05-.1-.14-.06-.22h0Z"],["w","M102.49,98.12c-7.51,4.28-15.08,10.42-18.4,17.98-2.5,5.69-3.79,13.1-1.73,18.91.1.3.3.55.56.72.72.46,1.78.49,3.17.1.54-.15.9-.66.85-1.22-1.27-13.65,3.83-23.83,15.32-30.54,1.32-.77,3.23-1.79,5.74-3.08,1.07-.55,1.85-1.53,2.16-2.69,1.51-5.85,3.44-11.32,5.79-16.4,2.16-4.65,4.93-7.75,9.87-8.21,3.51-.32,6.32,1.05,8.42,4.12,2.78,4.07,2.59,8.2,1.12,13.32-1.65,5.73-3.23,10.9-4.73,15.52-.43,1.31-.55,2.7-.35,4.06,1.4,9.55.96,18.79-4.74,26.8-2.1,2.95-4.83,5.12-6.91,7.3-.95.99-.93,2.56.05,3.52l.11.11c.92.92,2.39.97,3.36.12l8.86-7.7c.2-.18.52-.14.68.09l5.63,8.01c.16.23.18.52.05.77-1.51,2.89-2.36,4.45-2.53,4.69-8.95,12.58-21.92,22.13-35.9,28.41-6.27,2.81-11.61,4.78-16.03,5.91-4.73,1.21-10.39,1.71-16.98,1.52-.49,0-.91-.32-1.06-.78l-4.28-12.75c-.19-.56.17-1.16.75-1.27l11.62-2.12c.54-.1.93-.55.97-1.1.06-1.07-.16-2.08-.65-3.03-.2-.37-.58-.59-1-.57-6.08.3-9.48.46-10.19.49-5.31.17-12.29-5.93-15.46-9.54-6.19-7.07-10.85-14.73-13.98-22.97-.59-1.55-1.51-2.95-2.68-4.12-6.74-6.67-12.73-13.33-17.96-19.96-3.64-4.61-7.3-11.1-4.1-16.86,2.59-4.63,8.2-4.2,11.55-1.04,2.74,2.57,8.62,9.29,17.64,20.15.65.79,1.82.9,2.61.25l.77-.62c.92-.74,1.05-2.09.29-3-8.31-9.93-15.57-19.47-21.76-28.62-3.27-4.82-3.92-11.92,1.26-15.92,6.69-5.16,12.59,2.55,16.07,7.81.63.94,6.12,9.29,16.47,25.04.74,1.13,2.3,1.36,3.34.49l.1-.08c1.1-.93,1.34-2.53.56-3.74-6.73-10.45-13-20.74-18.79-30.89-3.97-6.96-4.76-16,4.43-18.92,4.51-1.43,8.68,1.74,11.11,5.38,4.66,7.01,7.52,13.63,11.17,20.4,3.27,6.04,5.5,11.51,8.04,16.56.57,1.13,2.01,1.5,3.05.77l.77-.54c.95-.67,1.29-1.92.81-2.98-3.98-8.67-7.7-17.05-11.16-25.15-1.36-3.18-2.24-6.46-2.63-9.85-.52-4.47,2.25-9.54,6.89-10.78,6.93-1.85,11.01,4.98,13.44,10.7,3.03,7.12,6.87,16.68,11.52,28.67,2.37,6.12,5.6,12.74,7.37,17.4.14.36-.01.76-.34.95h0Z"],["w","M354.09,73.73c12.28-1.55,17.71,13.8,6.57,19.89-.8.44-3.14,1.09-7.01,1.94-12.33,2.72-22.72,7.72-31.19,15-9.79,8.43-16.95,19.32-21.46,32.68-1.13,3.35-1.98,5.45-2.54,6.3-3.22,4.85-8.91,6.59-13.81,2.78-4.4-3.42-4.58-8.03-3.22-13.4,1.83-7.17,4-13.22,6.53-18.14,13.14-25.62,37.63-43.45,66.13-47.05h0Z"],["w","M243.89,182.78c-2.77-.62-5.53-1.51-8.27-2.68-6.21-2.66-8.62-8.14-10.49-14.34-1.36-4.5-1.16-10.66-.84-14.32.9-10.52,2.66-20.87,5.27-31.05,2.65-10.3,7.06-22.77,17.14-27.51,3.68-1.73,10.08-1.15,14.01-.58.41.06.65.5.48.88-12.23,27.69-18.89,58.52-16.64,89.03.03.36-.3.65-.66.57h0Z"],["w","M554.91,149.78c-5.54,3.88-9.45,9.13-11.74,15.75-5.75,16.68-9.23,33.81-10.44,51.39-.41,5.97.47,12.01,2.62,18.13.1.28-.06.59-.35.68-4.35,1.31-9.21,1.46-14.6.45-19.87-3.72-4.56-58.65-.51-70.98,2.26-6.88,8.95-22.79,17.74-22.72,1,0,3.16.56,6.49,1.64,4.78,1.56,8.38,3.18,10.79,4.87.27.2.27.6,0,.79h0Z"],["w","M142.38,155.44c11.82,14.71,17.87,22.25,18.14,22.6,6.28,7.96,11.65,14.33,16.11,19.11,1.75,1.88,3.32,3.46,4.7,4.74.24.23.3.59.15.88-3.22,6.14-7,12.38-11.34,18.71-8.61,12.58-18.33,24.73-29.15,36.44-3.65,3.95-8.54,8.07-11.18,10.47-2.62,2.37-5.45,4.41-8.5,6.14-.34.19-.75.17-1.07-.05-1.61-1.13-3.22-2.51-4.82-4.14-14.71-14.96-26.99-31.92-36.82-50.89-3.95-7.63-7.54-15-10.76-22.11-.15-.33.1-.7.46-.7,5.85.02,11.38-.63,16.59-1.96,15.25-3.89,29.95-11.24,41.88-21.54,5.91-5.1,10.92-11.11,15.26-17.68.08-.12.26-.13.35-.02h0Z"],["w","M249.7,190.43c0-.35.47-.47.62-.15,2,4.14,3.77,10.9,6.44,16,9.05,17.25,21.4,31.89,37.07,43.91,2.81,2.15,6.81,4.9,11.99,8.24,6.82,4.39,14.33,8.14,22.52,11.27,40.49,15.45,84.5,16.61,123.8-1.24,21.72-9.86,38.96-25.04,51.72-45.55.19-.31.67-.2.71.16.78,7.82,3.63,15.95,11.86,18.69.22.08.32.33.2.53-13.45,21.93-32.2,38-56.26,48.23-25.16,10.7-51.64,14.72-79.44,12.05-14.44-1.38-27.43-3.78-38.98-7.21-21.74-6.45-40.41-17.44-56-32.98-4.29-4.27-8.95-9.95-13.98-17.02-4.67-6.55-8.44-12.84-11.31-18.89-4.46-9.37-8.05-20.55-10.78-33.53-.08-.39-.14-1.23-.18-2.51h0Z"],["w","M260.89,241.16l-3.08.42c-.31.04-.57.26-.66.56-.83,2.62-1.26,4.62-1.31,6.01-.09,2.61-.46,7.05-1.1,13.3-.11,1.03.63,1.69,2.2,1.97l-1.98,4.23c-.16.35-.11.77.15,1.06.73.81,1.66,1.49,2.77,2.02.38.18.83.07,1.09-.25,3.95-4.92,6.7-9.69,11.24-14.44.19-.21.53-.2.71.03l6.33,7.83c.87,6.25,4.02,11.74,9.43,16.46,4.08,3.56,7,6.3,10.5,8.78,2.98,2.11,6.34,5.38,9.92,7.59,3.64,2.24,6.16,3.94,9.67,5.45,4.33,1.87,8.35,4.18,12.89,6.15,11.04,4.79,23.2,8.39,36.47,10.78,24.43,4.4,47.24,4.72,70.34,1.11,3.99-.63,6.71-1.24,8.15-1.83,4.55-1.87,8.83-3.52,12.82-4.95.92-.33,1.73-1.21,2.44-2.64.15-.31.47-.51.81-.51.25,0,.5.06.77.17l-4.85,11.35c-.35.83.11,1.77.98,2l2.44.64c.92.24,1.88-.26,2.2-1.15,6.03-16.54,16.87-29.51,33.38-36.25.31-.12.65-.17.98-.12,2.13.32,3.68.69,4.65,1.11,8.91,3.93,14.32,6.45,16.22,7.57,6.05,3.56,12.13,6.7,17.66,10.38,8.67,5.76,16.66,11.64,23.97,17.63.28.23.22.68-.12.82-4.47,1.81-8.87,4.28-13.22,7.4-21.46,15.43-36.64,35.6-45.54,60.49-1.11,3.11-2.23,7.44-3.37,13-.03.16-.2.24-.34.17l-27.36-13.65c-.91-.45-1.7-1.11-2.3-1.93-5.73-7.73-9.21-16.34-10.44-25.81-.22-1.72-1.94-2.82-3.6-2.29l-.08.03c-1.76.56-2.8,2.36-2.41,4.16,1.67,7.73,3.33,13.21,4.99,16.43-1.4,1.53-2.26,3.08-2.57,4.66-1.43,7.28-2.43,16.43-4.19,24.31-1.45,6.49-2.28,10.53-2.51,12.11-.33,2.31-.91,4.86-1.75,7.66-.63,2.1-1.11,4.67-1.43,7.71-.05.44-.18.86-.39,1.24-2.35,4.33-2.62,8.22-.82,11.65-7.27.83-13.62-1.28-19.06-6.34-3.37-3.14-6.22-6.62-8.38-11.37-3.79-8.35-8.31-16-15.84-21.37-.36-.25-.53-.69-.44-1.12,2.34-10.79,4.27-19.15,5.79-25.08,1.51-5.89,2.14-9.96,1.89-12.23-1.07-9.42-7.81-17.54-17.19-19.94-8.93-2.28-36.58-9.5-82.97-21.66-7.74-2.03-12.73-3.06-14.97-3.09-5.15-.09-9.95,1.42-14.4,4.53-5.02,3.5-8.16,7.46-9.42,11.88-2.77,9.69-4.99,19.69-7.58,29-4.32,15.55-8.59,33.54-12.08,46.61-.63,2.36-1.03,4.36-1.21,6-1.27,11.55,6.78,19.43,17.32,22.63,22.7,6.89,39.51,11.68,50.44,14.35.29.07,6.57,1.77,18.84,5.09,8.04,2.18,17.03,4.2,26.96,6.06,4.87.91,9.71.23,14.54-2.02,7.47-3.49,11-10.94,12.9-18.71.1-.41.65-.49.86-.12,3.16,5.65,6.94,10.87,11.34,15.66,9.44,10.29,22.19,15.63,36.05,17.2-.81,1.89-1.29,3.86-1.45,5.9-.25,3.25-.46,5.22-.61,5.91-1.31,5.71-2.23,9.87-2.78,12.48-.63,2.99-.32,5.36,3.24,5.49,6.95.24,13.37-.26,19.26-1.51-1.51,5.82-3.03,11.64-4.56,17.45-1.57,6.01-3.22,11.79-4.95,17.32-4.13,13.21-8.44,26-12.95,38.35-2.74,7.51-5.45,14.95-8.14,22.3-.78,2.14-1.56,3.92-2.35,5.33-.18.32-.48.55-.82.64-14.77,3.89-29.03,5.26-42.78,4.11-26.54-2.21-50.5-11.04-71.88-26.49-.21-.15-.3-.41-.23-.66,3.38-12.43,7.1-24.21,11.15-35.34.8-2.19,1.34-4.23,1.63-6.13.45-2.97-1.73-4.61-4.37-3.54-.26.11-.49.28-.67.5l-1.62,2c-.26.31-.69.44-1.08.32-7.83-2.42-13.35-4.8-16.57-7.13-8.15-5.89-15.25-13.13-21.29-21.72-1.97-2.8-5.59-8.59-10.86-17.37-.76-1.27-2.44-1.61-3.64-.75l-.2.14c-1.23.89-1.63,2.55-.92,3.9,5.98,11.4,12.55,21.26,19.71,29.58-1.41,2.27-2.72,4.56-3.93,6.88-.94,1.8-1.48,4-.81,5.74,1.2,3.13,3.25,7.05,6.15,11.74l-15.03,16.84c-.15.17-.43.13-.52-.08-1.36-3.09-3.1-6.29-5.23-9.6-10.04-15.59-22.26-28.26-36.66-38.02-17.14-11.62-34.92-19.29-55.26-20.58-.29-.02-.45-.35-.29-.59,8.26-12.27,17.08-24.24,26.46-35.89,2.68-3.33,7.27-8.66,13.76-16l14.41,7.72s.03.03.05.04l9.33,7.06c1.01.77,2.46.54,3.19-.49l.53-.75c.75-1.06.57-2.51-.42-3.35-4.53-3.85-9-7.13-13.4-9.84-3.79-2.33-7.69-3.51-11.7-3.54.39-3.05.9-6.36,1.53-9.91,2.87-16.09,5.41-28.77,7.6-38.06,3.83-16.25,6.37-26.97,7.61-32.15,2.35-9.77,6.81-26.04,13.38-48.79,3.18-11,8.07-23.89,11.39-32.67.15-.41.07-.86-.22-1.19-.89-1.01-2.16-1.6-3.79-1.77-.36-.04-.71.11-.93.4-1.06,1.38-1.94,2.95-2.64,4.7-1.88,4.73-3.63,8.96-5.26,12.68-5.1,1.75-9.4,2.8-12.9,3.16-11.17,1.14-22.63,1.7-34.38,1.67-.47,0-.73.23-.79.7-.06.49-.38.88-.96,1.16-11.69-5.44-23.05-11.51-34.08-18.22-3.77-2.3-7.51-4.86-11.21-7.69-.31-.23-.34-.68-.06-.95,7.98-7.77,15.78-16.1,23.39-24.97,9.65-11.25,19.27-24.39,28.85-39.42.42-.66,2.62-3.82,6.61-9.48.23-.33.67-.45,1.03-.28.83.38,1.62,1.16,2.62,1.69,12.27,6.47,25.78,12.4,40.52,17.79,5.65,2.07,11.1,3.73,16.36,4.98.49.11.92.67,1.29,1.67h0Z"],["w","M279.24,339.91c5.11,1.19,10.19,2.31,15.25,3.35,6.25,1.28,11.3,2.52,15.15,3.72,7.49,2.34,14.01,4.03,19.54,5.08,3.88.73,9.82,1.58,15.4,3.71,3.95,1.5,7.54,2.53,10.79,3.1,6.68,1.16,13.8,2.7,18.71,4.95,4.03,1.84,7.66,6.07,8.36,10.84.05.32.03.66-.04.98-1.12,4.61-2.26,8.89-3.42,12.82-.87,2.97-1.94,8.59-3.21,16.88-6.94,4.39-10.99,11.34-12.14,20.84-.67,5.56.78,10.14,4.36,13.73-1.94,3.15-3.18,5.96-3.73,8.45-1.04,4.69-1.86,7.94-2.45,9.77-.91,2.8-2.78,5.02-5.61,6.65-.05.03-.11.06-.17.08l-6.2,2.31c-28.44-6.92-57.64-14.96-87.6-24.13-6.38-1.95-9.32-6.88-9.76-13.45-.03-.49.01-.98.14-1.46,1.81-6.94,2.95-12.95,4.76-19.89,5.26-20.15,10.19-39.24,14.78-57.25,1.13-4.41,3.49-8.11,7.09-11.08h0Z"],["w","M559.26,464.04c-8.12-9.94-17.83-21.39-29.14-34.35-3.95-4.54-7.94-7.06-12.49-10.33-.3-.21-.45-.56-.41-.92.65-5.9,2.14-11.97,4.48-18.21,7.21-19.23,18.99-35.19,35.33-47.9,6.39-4.97,13.34-8.8,20.83-11.48.32-.11.67-.03.9.21,8.55,8.69,14.25,14.82,17.1,18.37,14.01,17.48,25.86,36.55,35.53,57.22.1.2-.06.43-.28.41-1.73-.16-3.48-.1-5.23.17-14.19,2.22-27.21,7.53-39.04,15.93-11.53,8.19-20.52,18.46-26.95,30.81-.13.24-.46.28-.63.07h0Z"],["w","M579.47,488.37c-.19.29-.61.31-.83.04l-13.87-17.13c-.41-.51-.48-1.2-.19-1.78,10.25-20.19,25.99-34.15,47.24-41.86,7.13-2.59,14.45-3.82,21.98-3.71.39.01.73.23.9.58,3.83,8.01,6.91,16.17,9.24,24.5.08.29-.14.58-.44.59-4.89.07-10.17,1.22-15.82,3.46-1.17.46-1.91,1.64-1.81,2.89v.06c.09,1.16,1.14,1.99,2.29,1.81.52-.08,2.24-.55,5.16-1.4,4.45-1.3,11.6-2.42,15.58.33,7.3,5.06,13.67,11.1,19.12,18.13,7.07,9.11,12.89,16.49,17.45,22.15,3.71,4.6,6.62,10.45,8.74,17.56.71,2.38.48,4.93-.63,7.15l-1.07,2.16c-.77,1.54-2.99,1.45-3.63-.15-2.77-6.95-7.74-14.73-14.89-23.35-.75-.9-2.08-1.04-2.99-.3l-.75.61c-.76.61-.88,1.72-.28,2.49,4.02,5.17,6.47,7.98,8.92,12.16,2.5,4.25,4.89,9.29,7.16,15.13,2.69,6.9,2.8,16.58-5.8,19.12-.37.11-.76-.11-.86-.48-3.47-12.77-9.88-25.13-19.21-37.08-.66-.86-1.9-1-2.74-.32l-.5.41c-.77.62-.94,1.72-.4,2.55,7.45,11.52,18.13,26.11,17.19,40.23-.56,8.58-9.74,11.8-15.63,5.56-.71-.75-1.24-2.17-1.59-4.28-2.02-12.13-7.74-22.21-13.81-33.08-.7-1.25-2.24-1.76-3.55-1.18l-.07.04c-1.23.55-1.69,2.06-.98,3.21,4.18,6.73,7.63,13.77,10.36,21.12,1.4,3.77,2.3,7.56,2.69,11.37.62,6.04-1.85,14.85-9.87,13.61-4.5-.7-8.04-4.84-9.44-9.07-3.45-10.35-7.36-19.1-11.72-26.27-2.76-4.53-6.3-10-10.75-12.47-1.31-.73-2.96-.46-3.98.65-1.24,1.34-1.94,2.93-2.09,4.78-.65,7.59-2.95,25.78-14.68,23.82-4.75-.79-7.38-5.49-8-9.81-.78-5.47,1.05-12.02,1.83-17.73.22-1.63.16-3.28-.16-4.89-2.01-10.08-2.37-22.1,4-30.7,1.73-2.33,3.43-4.6,5.1-6.8.28-.37.27-.89-.03-1.25-3.13-3.67-5.27-.97-7.9,1.7-1.11,1.13-2.44,2.84-3.99,5.12h0Z"],["w","M148.76,534.62c.18-.32.53-.51.9-.49,8,.5,15.7,1.89,23.1,4.16,2.87.89,7.61,2.73,14.22,5.53,15.03,6.37,28.44,16.34,39.91,27.83,7.78,7.8,14.03,16.19,18.74,25.17.27.51.22,1.13-.12,1.59-2.4,3.22-6.44,7.2-8.01,11.26-.15.36-.23.75-.26,1.15l-2.4,39.28c-.02.31-.16.59-.38.8-17.2,15.74-41.99,23.75-64.74,19.74-10.96-1.93-21.07-5.94-30.34-12.05-1.77-1.17-2.85-2.38-3.24-3.64-3.45-11.3-5.88-24.39-7.28-39.28-1.94-20.65,1.27-40.77,9.64-60.36,2.85-6.67,6.27-13.56,10.26-20.69h0Z"],["w","M408.93,644.36c-1.77,4.83-3.45,9.05-5.05,12.67-1.93,4.37-3.21,7.78-3.84,10.23-3.57,13.8-7.33,25.69-11.62,40.94-.23.78-.85,2.38-1.87,4.79-.22.51-.58.94-1.04,1.25-11.48,7.53-24.2,11.65-38.16,12.11-22.22.73-41.28-6.5-57.17-21.69-.51-.49-.82-1.16-.86-1.87-1.01-21.86.39-43.53,4.18-65.01,1.09-6.15,2.43-12.03,4.04-17.64.08-.28.41-.4.65-.24,7.96,5.13,14.3,8.86,19.02,11.19,22.41,11.11,45.45,16.34,69.12,15.68,5.28-.15,12.68-1.1,22.21-2.87.26-.05.48.21.39.46h0Z"],["w","M234.5,659.07c.16-.13.39-.01.38.19l-.87,14.14c0,.31.03.62.13.92,1.95,5.53,3.27,10.86,3.96,15.99.05.35-.01.69-.17,1-4.85,9.78-11.06,19.53-18.65,29.26-14.88,19.08-35.78,37.14-61.46,36.37-12.43-.37-24.62-5.68-32.96-14.92-1.6-1.77-2.87-5.82-3.27-8.28-1.37-8.41-.1-16.59,3.82-24.55,4.09-8.31,9.19-16.3,15.3-23.97.17-.22.5-.25.7-.06.99.91,1.99.97,3.02.17,1.13-.88,1.53-2.32.97-3.44-2.23-4.43-4.17-9.59-5.81-15.47-.07-.25.21-.46.43-.32,12.75,8.23,26.89,12.15,42.28,12.11,19.39-.05,36.79-6.43,52.2-19.14h0Z"],["w","M127.64,751.69c4.79,3.85,9.55,5.56,15.93,7.6,10.03,3.2,20.18,3.47,30.45.8,8.03-2.09,15-5.12,20.91-9.08,6.66-4.46,13.33-10.11,19.11-16.59,9.41-10.53,18.5-22.45,24.63-35.11.15-.31.6-.22.62.12.19,4.03-.68,7.97-2.62,11.81-7.84,15.5-18.49,29.27-31.95,41.3-2.37,2.11-6.51,4.98-12.42,8.59-20.2,12.32-50.13,10.87-64.99-9.12-.07-.09-.06-.22.03-.31.08-.08.21-.08.3-.01h0Z"],["w","M383.46,722.81c.3-.14.62.15.51.46l-4.67,13.07c-.21.58-.28,1.2-.19,1.81.31,2.39.56,6.07.77,11.04.14,3.37-1.04,5.42-2.3,8.37-4.19,9.86-8.49,18.6-12.9,26.22-6.61,11.41-16.16,21.34-28.68,26.8-13.69,5.96-30.31,4.66-43.48-1.96-8.59-4.32-17.6-12.7-19.42-22.51-.92-4.93-.46-10.45,1.37-16.56,3.36-11.19,6.36-17.18,12.23-29.26.28-.57.79-1.48,1.53-2.72.18-.29.5-.48.84-.5,3.52-.12,3.39-3.18,2.8-6.06-.69-3.34-1.05-5.45-1.08-6.34-.17-4.61-.38-8.15-.65-10.61-.04-.35.37-.55.63-.32,3.47,3.17,7.02,5.79,10.63,7.85,21.77,12.42,48.79,15.74,71.97,5.87,1.15-.49,4.52-2.04,10.09-4.65h0Z"],["w","M379.04,766.19c.05-.12.18-.18.3-.14l.07.02c.1.03.16.13.14.23-.89,4.3-2.12,8.44-3.67,12.41-5.37,13.75-12.42,25.91-23.65,35.38-16.03,13.53-39.15,15.4-57.73,6.72-7.28-3.4-13.03-8.9-16.89-15.94-.12-.21.15-.43.33-.27,17.79,15.26,42.06,19.64,63.21,9.06,8.82-4.41,16.14-10.65,21.95-18.74,6.25-8.68,11.56-18.26,15.94-28.73h0Z"],["o","M135.7,286.78l-10.84-7.67c-.61-.43-.6-1.35.03-1.76,4.71-3.11,8.94-6.5,12.7-10.17,8.6-8.38,16.63-17.47,24.08-27.27,7.92-10.41,15.92-21.68,23.14-34.03.25-.42.8-.54,1.21-.26l8.97,6.36c.37.26.47.76.24,1.14-15.19,25.21-33.05,48.26-53.56,69.13-1.29,1.31-2.9,2.8-4.83,4.47-.32.28-.79.31-1.14.06h0Z"],["o","M511.85,415.03l-9.59-5.54c-.38-.21-.6-.63-.57-1.06.18-3.11.65-6.11,1.42-9,3.95-15,11.04-29.32,21.06-41.11,2.25-2.65,3.87-5.33,6.59-7.85,2.86-2.64,7.66-7.85,11.6-10.89,6.35-4.91,13.03-8.63,20.74-12.51.38-.19.83-.12,1.14.16l9.98,9.18s.02.02.03.04l.41.56c.17.25.06.59-.23.68-2.45.75-5.69,2.22-9.73,4.43-6.04,3.29-10.25,7.1-16.92,12.24-1.07.83-3.57,3.32-7.52,7.48-14.23,15.01-23.53,32.67-27.9,52.96-.05.23-.31.34-.51.23h0Z"],["o","M152.41,529.09l7.42-12.85c.2-.34.58-.55.98-.53,10.37.55,20.2,2.81,29.47,6.8,6.4,2.75,11.64,5.15,15.72,7.2,1.81.91,4.76,2.72,8.86,5.43,6.35,4.18,11.63,8.95,17.34,13.52,4.22,3.38,6.36,7.1,10.14,11.1,6.26,6.63,10.96,15,15.21,22.75.19.35.16.78-.07,1.11l-7.26,10.25c-.25.36-.79.31-.98-.08-2.52-5.32-6.08-9.54-8.76-13.48-3.12-4.57-6.64-8.03-10.55-12.41-1.23-1.38-2.89-2.96-4.96-4.74-6.34-5.43-10.29-8.71-11.84-9.83-2.9-2.09-7.47-4.94-13.7-8.56-5.06-2.93-9.83-5.29-14.31-7.06-10.68-4.21-21.45-6.83-32.32-7.86-.37-.04-.57-.44-.39-.76h0Z"],["o","M417.58,623.3l-5.15,13.14c-.29.73-.9,1.3-1.65,1.55-3.89,1.25-9.61,2.48-17.17,3.7-3.67.59-7.51.82-11.52.67-23.68-.89-47.45-6.38-67.45-18-6.27-3.65-11.37-6.89-15.3-9.72-.39-.28-.57-.78-.45-1.24l3.52-13.44c.12-.43.62-.6.98-.34,8.15,5.97,14.18,9.13,25.35,14.57,5.2,2.53,9.85,4.42,13.95,5.66,7.65,2.31,13.62,3.82,17.91,4.53,18.53,3.04,38.41,3.4,56.47-1.66.34-.09.64.25.51.58h0Z"],["g","M486.15,209.27c-7.87.55-13.66-2.92-15.21-10.71-.65-3.27-.67-6.24-.06-8.89,3.19-13.77,4.8-20.68,4.81-20.73,1.93-8.79,3.08-14.19,11.61-16.1,7.67-1.73,10.07,2.58,10.34,9.34.15,3.97-.11,7.48-.79,10.51-1.34,5.96-2.14,9.79-3.45,14.98-1.81,7.16-2.82,11.6-3.01,13.31-.13,1.17-.82,3.41-2.09,6.7-.35.9-1.19,1.52-2.15,1.59h0Z"],["g","M492.78,434.32c-.23-.35-.44-.89-.63-1.63-.85-3.3-4.34-6.89-6.35-8.27-4.96-3.42-10.25-3.51-15.88-.28-.38.22-.85-.08-.81-.52.66-6.65,4.12-10.63,8.77-16.61.34-.44.58-.87.71-1.29.24-.77.69-1.08,1.36-.91.03.01.06.02.09.04l15.01,7.48c1.24.62,2.08,1.84,2.2,3.23.64,7.16-1.46,12.18-3.71,18.67-.11.34-.57.39-.76.09h0Z"],["g","M382.66,409.7c.78-.39,1.71-.31,2.4.21,1.64,1.23,3.72,2.67,6.23,4.31,5.21,3.4,9.84,9.99,13.68,15.54.81,1.17,2.2,3.8,4.16,7.89,5.06,10.55,13.95,16.55,25.11,20.24.35.12.57.47.51.84-.29,1.99-.46,4.61-.51,7.84-.08,4.74-1.44,8.51-3,12.77-.27.74-1.03,1.19-1.82,1.08-5-.72-9.6-2.4-13.79-5.03-5.68-3.57-12.76-8.52-16.38-14.35-1.71-2.77-3.73-5.7-6.06-8.81-5.35-7.15-7.2-16.14-18.24-17.29-1.64-.17-2.93-1.13-3.86-2.87-.16-.31-.26-.65-.28-1-.61-9.94,3.34-17.06,11.85-21.37h0Z"],["g","M478.06,433.08l-5.81-.59c-.72-.07-1.06-.93-.58-1.48l1.57-1.76c.99-1.02,2.38-1.56,3.8-1.46,6.07.42,9.61,3.45,10.63,9.1.51,2.81.73,5.05-.79,7.39-.28.43-.94.34-1.09-.16l-1.87-6.1s-.03-.11-.06-.16c-1.16-2.01-2.96-3.57-5.39-4.67-.13-.06-.26-.1-.41-.11h0Z"],["g","M433.29,479.88c3.28-6.2,4.02-13.4,4.19-20.68.02-.63.53-1.13,1.16-1.12,6.21.05,11.77-1.83,16.7-5.62,5.53-4.26,9.96-9.27,13.27-15.02.44-.77,1.3-1.21,2.18-1.12,6.84.67,11.59,4.04,14.24,10.11.16.38.18.8.06,1.19-.7,2.2-1.36,3.73-1.99,4.59-4.01,5.51-8.66,10.77-13.97,15.76-9.73,9.17-21.44,13.55-35.13,13.13-.62-.02-1-.68-.71-1.22h0Z"],["l","M542.19,232.61c-.2.16-.49.09-.61-.13-3.13-5.93-2.72-12.55-2.53-19.22.22-7.7,2.33-15.53,3.69-23.7,1.6-9.65,4.49-18.47,8.67-26.45,1.47-2.81,4.13-6.07,6.93-7.85.54-.34,1.26-.2,1.63.32,2.24,3.17,3.53,6.87,3.88,11.1.39,4.76.29,9.01-.32,12.74-2.32,14.28-4.42,25.01-9.66,37.78-2.5,6.08-6.39,11.22-11.68,15.41h0Z"],["l","M260.89,241.16l5.9,9.49c.15.24.11.56-.1.75-3.9,3.46-6.73,7.87-9.75,12.02-1.57-.28-2.31-.94-2.2-1.97.64-6.25,1.01-10.69,1.1-13.3.05-1.39.48-3.39,1.31-6.01.09-.3.35-.52.66-.56l3.08-.42h0Z"],["l","M562.6,250.21c.22.17.14.52-.13.57-8.91,1.76-15.48,10.38-18.22,18.3-3.43,9.93-6.52,19.3-9.26,28.1-.06.18-.27.26-.44.16-12.43-7.6-25.96-14.56-40.04-18.24-.56-.15-.71-.88-.24-1.23,12.39-9.31,22.19-21.11,29.35-34.21.25-.46.74-.72,1.25-.67,4.27.39,8.55.04,12.86-1.06.78-.2,1.61-.18,2.39.06,9.49,3.01,15.07,4.78,16.74,5.32,1.72.55,4.49,1.95,5.74,2.9h0Z"],["l","M564.67,319.15c-7.25-6.09-15.16-11.8-23.71-17.15-.46-.29-.67-.85-.52-1.37,2.79-9.55,5.54-18.42,8.23-26.59,2.55-7.71,5.85-13.78,12.3-17.46,5.55-3.18,9.65-1.95,12.28,3.69,2.73,5.82,3.79,11.31,3.19,16.47-.75,6.52-2.32,14.07-5.15,22.73-.96,2.93-2.89,9.41-5.8,19.43-.1.36-.54.49-.82.25h0Z"],["l","M277.25,263.9c2.75,2.28,5.23,4.53,7.45,6.74,2.37,2.36,4.09,3.94,5.14,4.74,5.2,3.96,8.72,6.9,13.29,9.41,3.45,1.9,7.15,4.97,10.71,6.63,9.44,4.41,16.49,7.36,21.16,8.85,7.29,2.33,15.66,4.45,25.13,6.38,8.29,1.68,12.91,1.99,23.17,2.93,14.86,1.37,30.96.34,48.31-3.09,14.89-2.93,28.36-7.48,40.41-13.65,2.31-1.19,7.23-4.21,14.75-9.08.36-.24.81-.3,1.22-.19l2.09.54c.36.1.36.6,0,.7-5.65,1.51-10.39,3.96-14.21,7.36-5.93,5.28-10.74,11.38-14.41,18.29-.27-.11-.52-.17-.77-.17-.34,0-.66.2-.81.51-.71,1.43-1.52,2.31-2.44,2.64-3.99,1.43-8.27,3.08-12.82,4.95-1.44.59-4.16,1.2-8.15,1.83-23.1,3.61-45.91,3.29-70.34-1.11-13.27-2.39-25.43-5.99-36.47-10.78-4.54-1.97-8.56-4.28-12.89-6.15-3.51-1.51-6.03-3.21-9.67-5.45-3.58-2.21-6.94-5.48-9.92-7.59-3.5-2.48-6.42-5.22-10.5-8.78-5.41-4.72-8.56-10.21-9.43-16.46h0Z"],["l","M234.6,309.35l-7.45,23.7c-.06.2-.27.31-.47.24-13.93-5.07-27.63-10.82-41.11-17.25.58-.28.9-.67.96-1.16.06-.47.32-.7.79-.7,11.75.03,23.21-.53,34.38-1.67,3.5-.36,7.8-1.41,12.9-3.16h0Z"],["l","M375.77,405.34c1.27-8.29,2.34-13.91,3.21-16.88,1.16-3.93,2.3-8.21,3.42-12.82.07-.32.09-.66.04-.98-.7-4.77-4.33-9-8.36-10.84-4.91-2.25-12.03-3.79-18.71-4.95-3.25-.57-6.84-1.6-10.79-3.1-5.58-2.13-11.52-2.98-15.4-3.71-5.53-1.05-12.05-2.74-19.54-5.08-3.85-1.2-8.9-2.44-15.15-3.72-5.06-1.04-10.14-2.16-15.25-3.35,2.53-2.08,5.28-3.37,8.27-3.87,2.24-.37,5.26-.05,9.06.98,25.35,6.88,47,12.51,64.95,16.89,9.81,2.39,17.27,4.29,22.4,5.69,5.55,1.51,9.06,3.05,10.52,4.6,2.28,2.43,3.84,5.25,4.69,8.44.47,1.73.2,4.9-.79,9.49-2.06,9.5-3.9,17.37-5.52,23.62-.1.37-.54.51-.83.26-4.88-4.16-10.83-3.33-16.22-.67h0Z"],["l","M441.64,451.78c-1.8-3.43-1.53-7.32.82-11.65.21-.38.34-.8.39-1.24.32-3.04.8-5.61,1.43-7.71.84-2.8,1.42-5.35,1.75-7.66.23-1.58,1.06-5.62,2.51-12.11,1.76-7.88,2.76-17.03,4.19-24.31.31-1.58,1.17-3.13,2.57-4.66,2.17,5.69,5.57,10.57,10.19,14.65.07.06.14.11.21.16l6.67,3.99c.62.37.79,1.2.37,1.79-1.89,2.62-4.01,5.82-6.36,9.61-4.02,6.47-5.17,13.43-3.45,20.87.23.98.02,2.02-.58,2.83-5.27,7.18-11.35,13.69-20.71,15.44h0Z"],["l","M504.2,418.48l12.11,8.58c.21.15.3.42.22.67-3.79,11.14-8.57,24.68-14.35,40.62-3.99,11-7.15,19.98-9.49,26.95-1.06,3.16-2.78,6.93-3.97,10.59-1.68,5.12-3.66,10.53-5.95,16.24-3.44,8.57-13.73,17.85-23.54,17.77-1.31,0-2.94.04-4.89.17-.27.02-.48-.23-.43-.49,1.35-6.61,3.73-13.29,4.83-18.89,1.09-5.52,2.62-10.52,4-17.07,2.28-10.81,4.13-19.17,5.56-25.09.23-.91.73-1.73,1.45-2.35,3.55-3.03,6.16-5.44,7.83-7.23,1.27-1.35,4.79-5.69,10.56-13.02,3.86-4.88,5.86-10.25,9.19-15.23,4.41-6.59,6.35-14.16,6.19-21.86,0-.35.39-.56.68-.36h0Z"],["l","M349.83,467.17l6.2-2.31c.06-.02.12-.05.17-.08,2.83-1.63,4.7-3.85,5.61-6.65.59-1.83,1.41-5.08,2.45-9.77.55-2.49,1.79-5.3,3.73-8.45,3.58,2.9,6.48,4.92,11.17,3.54.32-.09.66.02.87.28,1.25,1.59,2.06,3.03,2.43,4.34.1.35.1.72,0,1.07-2.76,9.64-4.06,17.19-14.01,20.36-4.49,1.42-13.72-1.05-18.62-2.33h0Z"],["l","M203.94,459.26c.91-.21,1.57-1.26,1.99-3.15,4.01.03,7.91,1.21,11.7,3.54,4.4,2.71,8.87,5.99,13.4,9.84.99.84,1.17,2.29.42,3.35l-.53.75c-.73,1.03-2.18,1.26-3.19.49l-9.33-7.06s-.04-.03-.05-.04l-14.41-7.72h0Z"],["l","M452.69,516.01c-5.89,1.25-12.31,1.75-19.26,1.51-3.56-.13-3.87-2.5-3.24-5.49.55-2.61,1.47-6.77,2.78-12.48.15-.69.36-2.66.61-5.91.16-2.04.64-4.01,1.45-5.9,8.73.39,17.08-1.45,25.05-5.52.4-.2.85.16.74.59l-8.13,33.2h0Z"],["l","M276.71,563.18c-2.9-4.69-4.95-8.61-6.15-11.74-.67-1.74-.13-3.94.81-5.74,1.21-2.32,2.52-4.61,3.93-6.88,3.87,4.2,8.13,7.93,12.76,11.2.22.15.25.46.07.66l-11.42,12.5h0Z"],["k","M286.34,396.79c11.13-.1,20.23,9.14,20.33,20.62.1,11.49-8.84,20.88-19.97,20.98-11.13.1-20.23-9.14-20.33-20.62-.1-11.49,8.84-20.88,19.97-20.97h0Z"],["k","M341,411c10.73,2.69,17.16,13.9,14.36,25.03-2.8,11.13-13.76,17.97-24.49,15.27-10.73-2.69-17.16-13.9-14.36-25.03,2.8-11.13,13.76-17.97,24.49-15.27h0Z"],["g","M278.23,378.61l5.18-19.74c.74-2.86,3.66-4.56,6.52-3.82l25.98,6.81c2.78.73,4.48,3.51,3.87,6.31l-4.54,20.58c-.66,3.01-3.72,4.83-6.68,3.98l-26.63-7.63c-2.79-.8-4.43-3.68-3.7-6.49h0Z"],["g","M361.47,402.32c-.35,1.42-1.66,2.39-3.12,2.3l-5.12-.31c-.09-.01-.17-.02-.26-.05-9.11-3.18-19.96-5.74-27.41-8.04-2.07-.64-2.89-1.98-2.45-4.03,1.9-8.85,3.77-16.39,5.6-22.64.52-1.78,1.84-2.54,3.95-2.28,3.38.42,6.38,1.06,9,1.91,8.04,2.61,15.33,4.49,21.86,5.62,2.27.4,3.49,1.71,3.67,3.94,0,.03,0,.07-.01.1l-5.71,23.48h0Z"],["g","M150.47,690.35c1.28-2.21,3.14-2.82,5.59-1.81,6.55,2.69,15.63,5.55,27.26,8.58,1.51.4,2.23,2.12,1.45,3.47l-.02.03c-.88,1.52-2.7,2.21-4.37,1.66-6.36-2.11-10.54-3.41-12.55-3.89-5.83-1.4-12.25-3.71-16.79-6.07-.72-.37-.98-1.27-.57-1.97h0Z"],["g","M340.83,753.28c1.11.94.46,2.78-1.1,3.16-1.16.29-2.54.35-4.13.18-10.38-1.11-20.77-4.08-29.39-7.73-1.06-.45-1.49-1.73-.92-2.73l.03-.04c.64-1.11,1.94-1.67,3.19-1.36,13.66,3.33,24.04,5.98,31.13,7.96.54.15.94.34,1.19.56h0Z"],["o","M338.92,416.2c7.92,1.51,13.05,9.45,11.47,17.73-1.58,8.29-9.28,13.78-17.19,12.27-7.92-1.51-13.05-9.45-11.47-17.73,1.58-8.29,9.28-13.78,17.19-12.27h0Z"],["l","M331.64,373c.22-.87,1.11-1.41,1.98-1.19l23.71,5.92c2.77.69,4.76,2.28,4.44,3.56l-4.01,16.1c-.32,1.28-2.82,1.75-5.59,1.06l-23.72-5.91c-.87-.22-1.4-1.1-1.19-1.98l4.38-17.56h0Z"],["b","M286.74,402.38c7.97.07,14.36,6.98,14.29,15.43-.07,8.45-6.59,15.24-14.55,15.17-7.97-.07-14.36-6.98-14.29-15.43.07-8.45,6.59-15.24,14.55-15.17h0Z"]];
    var FILL = { w: '#F7F6F1', o: '#FF6A3D', g: '#8A8FA3', b: '#4C8DFF', k: '#0B0C14', l: '#E4E1D8' };
    // visor palettes per question (the 404 visor's blue → navy → orange family)
    var VIS = [['#4c8dff', '#1d2350', '#ff6a3d'], ['#7c5cff', '#1d2350', '#ff9e80'], ['#5eead4', '#15304a', '#4c8dff'], ['#ffd166', '#2a1d50', '#ff6a3d'], ['#ff6a3d', '#1d2350', '#7c5cff'], ['#4c8dff', '#0f2a3a', '#5eead4'], ['#ff9e80', '#231d50', '#ffd166']];
    var VISOR = '<ellipse cx="386" cy="160" rx="124" ry="118" fill="url(#abpa-v)"/>';
    var paths = ASTRO.map(function(p, i){
      // the chest's second button goes signal green (the 404 suit's panel lights); everything else keeps its role
      var f = i === 46 ? '#3BE38A' : FILL[p[0]];
      // light-grey shading shapes get a hairline of their own color: without it the dark base shape shows through the
      // anti-aliased seam where they meet the white suit
      return '<path fill="' + f + '"' + (p[0] === 'l' || p[0] === 'g' ? ' stroke="' + f + '" stroke-width="2" stroke-linejoin="round"' : '') + ' d="' + p[1] + '"/>' + (i === 0 ? VISOR : '');
    }).join('');
    box.classList.add('is-astro');
    // deep space behind him (the badge's sky: nebula + two drifting star layers + the odd shooting star) and a far planet
    box.insertAdjacentHTML('afterbegin', '<div class="ab_badge_sky abpa-sky" aria-hidden="true"><i class="neb"></i><i class="st is-a"></i><i class="st is-b"></i><i class="shoot"></i><span class="abpa-far"><span class="ab_planet" data-planet="gas" data-seed="17" data-colors="#2a1d6b,#5b3fd1,#9d85ff,#e6ddff,#3a2a8a" data-ring="#ffd9b3,#ff9e6a,#8a4a2a" data-tilt="-16" data-spin="60" data-glow="rgba(124,92,255,.4)"></span></span></div>');
    var far = $('.abpa-far', box); if (AB.buildPlanet) AB.buildPlanet($('.ab_planet', far));
    box.insertAdjacentHTML('beforeend',
      '<div class="abpa-cordw" aria-hidden="true"><svg class="abpa-cord"><path class="c0"/><path class="c1"/><path class="c4"/><path class="c2"/><path class="c3"/></svg></div>' +
      '<div class="abpa" aria-hidden="true"><svg viewBox="0 0 701 833">' +
        '<defs><linearGradient id="abpa-v" x1="0" y1="0" x2="1" y2="1"><stop class="s0" offset="0" stop-color="#4c8dff"/><stop class="s1" offset=".55" stop-color="#1d2350"/><stop class="s2" offset="1" stop-color="#ff6a3d"/></linearGradient>' +
        '<clipPath id="abpa-c"><ellipse cx="386" cy="160" rx="124" ry="118"/></clipPath></defs>' +
        paths +
        '<g clip-path="url(#abpa-c)"><rect class="sweep" x="200" y="20" width="40" height="300" fill="#fff" opacity="0" transform="rotate(20 386 160)"/></g>' +
      '</svg></div>');
    var fig = $('.abpa', box), cord = $('.abpa-cord', box), cp = $$('.abpa-cord path', cord), stops = $$('.abpa stop', box);
    var card = box.closest('.ab_bento-card') || box;
    // state: offset from home (px), velocity, rotation; the tether rises from below the frame's bottom edge (its end is never seen)
    var S = { x: 0, y: 0, vx: 0, vy: 0, r: 0, vr: 0, t: 0, drag: false, px: 0, py: 0, ox: 0, oy: 0 }, FP = { y: 0, v: 0 };
    var HX = 565 / 701, HY = 300 / 833; // tether clip on his backpack, as a fraction of the drawing
    function geo(){ var b = box.getBoundingClientRect(), f = fig.getBoundingClientRect(); return { W: b.width, H: b.height, fw: fig.offsetWidth, fh: fig.offsetHeight, fl: fig.offsetLeft, ft: fig.offsetTop }; }
    function draw(){
      var g = S.free ? S.g0 : geo(), bob = reduce ? 0 : Math.sin(S.t * .9) * 5, x = S.x, y = S.y + bob, r = S.r + (reduce ? 0 : Math.sin(S.t * .55) * 3);
      if (!S.free){ S.g0 = g; fig.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + r.toFixed(2) + 'deg)'; }
      // attach point: rotate the backpack clip around the figure's centre
      var cx = g.fl + g.fw / 2, cy = g.ft + g.fh / 2, ax = g.fl + g.fw * HX - cx, ay = g.ft + g.fh * HY - cy, rr = r * Math.PI / 180;
      var P = [cx + x + ax * Math.cos(rr) - ay * Math.sin(rr), cy + y + ax * Math.sin(rr) + ay * Math.cos(rr)], A = [g.W * .86, g.H];
      // the tether comes out of the frame's bottom edge (a flat end on the edge line, as if it runs on behind it) and
      // curves to the backpack; it is never clipped, so it stays attached when he drifts past the frame
      var up = P[1] < A[1] - 20, L = Math.sqrt(Math.pow(P[0] - A[0], 2) + Math.pow(P[1] - A[1], 2)) || 1, slack = Math.max(0, 1 - L / (g.H * 1.2)) * 40;
      var c1y = up ? A[1] - Math.min(g.H * .32, L * .5) : A[1] + Math.min(60, L * .5), c2y = up ? P[1] + 70 : P[1] - 40;
      var d = 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + ' C ' + (A[0] + 6 + slack).toFixed(1) + ' ' + c1y.toFixed(1) + ', ' + (P[0] + 44 + slack * .5).toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + P[0].toFixed(1) + ' ' + P[1].toFixed(1);
      S.L = L;
      if (S.free){
        // snapped: the cut end whips back toward the frame edge and disappears
        var k = S.rec; if (k <= 0){ cord.style.display = 'none'; return; }
        var ex = A[0] + (S.cut[0] - A[0]) * k, ey = A[1] + (S.cut[1] - A[1]) * k;
        d = 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + ' Q ' + (A[0] + (ex - A[0]) * .5 + 30 * k).toFixed(1) + ' ' + (A[1] + (ey - A[1]) * .5).toFixed(1) + ', ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      }
      cp.forEach(function(p){ p.setAttribute('d', d); });
    }
    var last = performance.now(), sy = window.scrollY, on = true, run = false;
    function frame(now){
      var dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
      // scroll pushes him against the scroll direction (inertia), a spring brings him home
      var ny = window.scrollY, v = (ny - sy) / Math.max(dt, .001); sy = ny;
      if (!S.drag){
        S.vy += -Math.max(-2400, Math.min(2400, v)) * .026; S.vr += -v * .0012;
        S.vx += -S.x * 9 * dt * 6; S.vy += -S.y * 9 * dt * 6; S.vr += -S.r * 8 * dt * 6;
        var damp = Math.pow(.06, dt); S.vx *= damp; S.vy *= damp; S.vr *= damp;
        var sp = Math.sqrt(S.vx * S.vx + S.vy * S.vy), MAX = 900; if (sp > MAX){ S.vx *= MAX / sp; S.vy *= MAX / sp; }
        S.x += S.vx * dt; S.y += S.vy * dt; S.r += S.vr * dt;
      }
      // the far planet bounces on scroll too: less push, a looser spring, so it wobbles a beat after the astronaut
      FP.v += -Math.max(-2400, Math.min(2400, v)) * .012 - FP.y * 170 * dt; FP.v *= Math.pow(.25, dt); FP.y += FP.v * dt;
      far.style.transform = 'translate(' + (Math.sin(S.t * .15) * 8).toFixed(1) + 'px,' + (FP.y + Math.sin(S.t * .4) * 3).toFixed(1) + 'px)';
      if (S.free) S.rec = Math.max(0, S.rec - dt * 3.2);
      if (!S.gone) draw(); else if (S.rec > 0 || cord.style.display !== 'none') draw();
      if (on && !reduce) requestAnimationFrame(frame); else run = false;
    }
    function start(){ if (run || reduce) return; run = true; last = performance.now(); sy = window.scrollY; requestAnimationFrame(frame); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ on = es[0].isIntersecting; if (on) start(); }, { rootMargin: '120px' }).observe(box); else start();
    draw(); addEventListener('resize', draw);
    // drag him around; let go and the tether reels him home
    fig.style.touchAction = 'none';
    fig.addEventListener('pointerdown', function(e){ e.stopPropagation(); S.drag = true; S.moved = false; S.px = e.clientX; S.py = e.clientY; S.ox = S.x; S.oy = S.y; try { fig.setPointerCapture(e.pointerId); } catch (err){} fig.classList.add('is-held'); });
    fig.addEventListener('pointermove', function(e){
      if (!S.drag) return;
      var now = performance.now(), mdt = Math.max(8, now - (S.mt || now - 16)) / 1000; S.mt = now;
      S.pvx = (e.clientX - (S.lx == null ? e.clientX : S.lx)) / mdt; S.pvy = (e.clientY - (S.ly == null ? e.clientY : S.ly)) / mdt; S.lx = e.clientX; S.ly = e.clientY;
      var mx = e.clientX - S.px, my = e.clientY - S.py; if (Math.abs(mx) + Math.abs(my) > 4) S.moved = true; S.x = S.ox + mx; S.y = S.oy + my; S.r = mx * .06; draw();
      if (!reduce && S.L > box.offsetHeight * 1.6 + 60) snap(e);
    });
    // pulled too far: the tether snaps and he drifts off into space, slowly tumbling, until the page is reloaded.
    // He moves to a fixed layer on <body> first, so drifting past the page edge never adds a horizontal scrollbar.
    function snap(e){
      S.drag = false; S.free = true; S.rec = 1; fig.classList.remove('is-held');
      try { fig.releasePointerCapture(e.pointerId); } catch (err){}
      var g = geo(), r = fig.getBoundingClientRect(), cxv = r.left + r.width / 2, cyv = r.top + r.height / 2;
      S.cut = [g.fl + g.fw * HX + S.x, g.ft + g.fh * HY + S.y];
      var w = fig.offsetWidth, h = fig.offsetHeight;
      document.body.appendChild(fig);
      fig.classList.add('is-adrift');
      fig.style.cssText = 'position:fixed;left:' + (cxv - w / 2) + 'px;top:' + (cyv - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px;right:auto;z-index:60;pointer-events:none;margin:0';
      // keep the throw's direction, but never slower than a gentle drift away from the card
      var vx = S.pvx || 0, vy = S.pvy || 0, sp = Math.sqrt(vx * vx + vy * vy), dir = sp > 40 ? [vx / sp, vy / sp] : [cxv > innerWidth / 2 ? 1 : -1, -.4];
      sp = Math.max(160, Math.min(900, sp * .6));
      var F = { x: 0, y: 0, vx: dir[0] * sp, vy: dir[1] * sp, r: S.r, vr: (dir[0] >= 0 ? 1 : -1) * (30 + Math.random() * 30) }, lt = performance.now();
      (function drift(now){
        var dt = Math.min(.05, (now - lt) / 1000); lt = now;
        F.x += F.vx * dt; F.y += F.vy * dt; F.r += F.vr * dt; F.vx *= Math.pow(.97, dt); F.vy *= Math.pow(.97, dt);
        fig.style.transform = 'translate(' + F.x.toFixed(1) + 'px,' + F.y.toFixed(1) + 'px) rotate(' + F.r.toFixed(1) + 'deg)';
        var q = fig.getBoundingClientRect();
        if (q.right < -60 || q.left > innerWidth + 60 || q.bottom < -60 || q.top > innerHeight + 60){ fig.parentNode.removeChild(fig); S.gone = true; return; }
        requestAnimationFrame(drift);
      })(lt);
      if (AB.quest) AB.quest('untethered');
      start();
      // with him gone, the far planet drifts over and grows into the empty lower right of the window (the sky clips it)
      var W0 = box.clientWidth, H0 = box.clientHeight, big = Math.round(Math.min(W0 * .62, H0 * .66));
      gsap.to(far, { left: (W0 * .74 - big / 2) + 'px', bottom: (H0 * .2 - big / 2) + 'px', width: big + 'px', duration: 2.4, delay: .5, ease: 'power2.inOut',
        onComplete: probe });
    }
    function drop(){ if (!S.drag) return; S.drag = false; S.lx = S.ly = null; S.vx = S.vy = 0; S.vr = 0; fig.classList.remove('is-held'); if (AB.quest && S.moved) AB.quest('spin'); if (reduce){ S.x = S.y = S.r = 0; draw(); } }
    fig.addEventListener('pointerup', drop); fig.addEventListener('pointercancel', drop);
    fig.addEventListener('click', function(e){ if (S.moved) e.stopPropagation(); }, true);
    // epilogue: a probe drifts into the window, beams a short (funny) readout about the lost pilot, and leaves
    var LOST = ['Pilot adrift. Gargantua has him now.', 'Crew of three is a crew of two. Gargantua says thanks.', 'Signal lost. Last seen waving at Gargantua.', 'Tether snapped. Filing it under "why before how".'];
    function probe(){
      var sky = $('.abpa-sky', box); if (!sky) return;
      var W1 = box.clientWidth, H1 = box.clientHeight;
      sky.insertAdjacentHTML('beforeend', '<div class="abpa-probe"><svg class="sat-ico" viewBox="0 0 24 12"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg><i></i>' +
        '<span class="abpa-rx"><span><b>RX</b> · probe AB-02</span><em>' + esc(LOST[Math.floor(Math.random() * LOST.length)]) + '</em></span></div>');
      var pr = sky.lastChild, rx = $('.abpa-rx', pr), sm = H1 < 260, y0 = sm ? H1 * .5 : H1 * .46;
      gsap.timeline({ onComplete: function(){ pr.parentNode && pr.parentNode.removeChild(pr); } })
        .fromTo(pr, { x: -60, y: y0 + 30, rotation: 8 }, { x: W1 * (sm ? .06 : .16), y: y0, rotation: 0, duration: 1.8, ease: 'power2.out' })
        .fromTo(rx, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, '-=.2')
        .to(rx, { opacity: 0, duration: .35 }, '+=3.4')
        .to(pr, { x: W1 + 60, y: y0 - 40, rotation: -6, duration: 2, ease: 'power2.in' }, '-=.1');
    }
    function think(k){
      var v = VIS[k % VIS.length];
      if (reduce || !hasGsap){ stops.forEach(function(s, i){ s.setAttribute('stop-color', v[i]); }); return; }
      stops.forEach(function(s, i){ gsap.to(s, { attr: { 'stop-color': v[i] }, duration: .8, ease: 'power2.inOut' }); });
      gsap.fromTo($('.abpa .sweep', box), { attr: { x: 200 }, opacity: .5 }, { attr: { x: 560 }, opacity: 0, duration: .8, ease: 'power2.inOut' });
      S.vr += 60; S.vy -= 120; // a little spin and hop, the springs settle him
    }
    var qi = 0;
    function next(){
      qi = (qi + 1) % QS.length; if (qi === 0) if (AB.quest) AB.quest('questions');  if (qN) qN.textContent = 'Question ' + pad2(qi + 1);
      think(qi);
      if (reduce || !hasGsap || !window.ScrambleTextPlugin){ qT.textContent = QS[qi]; return; }
      gsap.to(qT, { duration: .8, scrambleText: { text: QS[qi], chars: '?!/_<>', speed: .6 } });
    }
    // tapping anywhere on the card asks the next question (links inside it still work)
    card.style.cursor = 'var(--hand, pointer)';
    card.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('a')) return; next(); }); keyAct(box, next);
  })();

  /* ---------- player one: click for XP, level up; the Konami code is a cheat ---------- */
  var LV = { n: 7, BOSS: 20, beaten: false, boss: null };
  (function(){
    var gm = $('[data-gm]'); if (!gm) return;
    var card = gm.closest('.ab_bento-card'), lvl = $('[data-gm-lvl]', gm), xpN = $('[data-gm-xpn]', gm), bar = $('[data-gm-xp]', gm), xp = 0;
    function p3(n){ n = String(n); while (n.length < 3) n = '0' + n; return n; }
    function gain(e){
      xp += 18 + Math.round(Math.random() * 14);
      if (e && e.clientX && hasGsap){
        var r = gm.getBoundingClientRect(), pop = document.createElement('span'); pop.className = 'ab_gm_pop'; pop.textContent = '+XP';
        pop.style.left = (e.clientX - r.left - 12) + 'px'; pop.style.top = (e.clientY - r.top - 20) + 'px'; gm.appendChild(pop);
        gsap.to(pop, { y: -30, opacity: 0, duration: .8, ease: 'steps(6)', onComplete: function(){ pop.parentNode && pop.parentNode.removeChild(pop); } });
      }
      if (xp >= 100){ xp -= 100; LV.n++; lvl.textContent = 'LV ' + pad2(LV.n); card.classList.remove('is-lvlup'); void card.offsetWidth; card.classList.add('is-lvlup');
        if (LV.n >= LV.BOSS && !LV.beaten && LV.boss){ toast('LV ' + pad2(LV.n) + ' · something huge is on the radar…'); setTimeout(LV.boss, 900); }
        else toast('Level up · LV ' + pad2(LV.n) + ' · new skill unlocked'); }
      bar.style.width = xp + '%'; xpN.textContent = 'XP ' + p3(xp);
    }
    gm.addEventListener('click', gain); keyAct(gm, function(){ gain(); });
    LV.el = lvl; LV.press = $('.ab_gm_press', gm);
  })();
  (function(){
    var K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], ki = 0;
    // keyboard: the classic code; phones: swipe it on the Player one screen (↑↑↓↓←→←→) and tap twice for B, A
    function step(k){ ki = k === K[ki] ? ki + 1 : (k === K[0] ? 1 : 0); if (ki < K.length) return; ki = 0; cheat(); }
    document.addEventListener('keydown', function(e){
      if (e.target && e.target.closest && e.target.closest('input, textarea, select, [data-badge]')) return;
      step(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    });
    var gmScreen = $('[data-gm]');
    if (gmScreen && 'ontouchstart' in window){
      // swipes that start on the little game screen never scroll the page (touch-action alone isn't enough on iOS)
      gmScreen.style.touchAction = 'none';
      var t0 = null, t1 = null, fbT = 0, press = LV.press, pressTxt = press ? press.textContent : '';
      var ARW = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', b: 'B', a: 'A' };
      // the "Press start" line echoes the code as it's entered, so it's clear which swipes counted
      function echo(ok){
        if (!press || LV.beaten) return;
        clearTimeout(fbT);
        press.style.animation = 'none';
        press.textContent = ki ? K.slice(0, ki).map(function(k){ return ARW[k]; }).join(' ') : (ok === false ? '✗ try again' : pressTxt);
        fbT = setTimeout(function(){ if (!LV.beaten){ press.textContent = pressTxt; press.style.animation = ''; } }, 2500);
      }
      function fin(){
        if (!t0) return; var end = t1 || t0, dx = end.x - t0.x, dy = end.y - t0.y; t0 = t1 = null;
        var before = ki, c0 = LV.cheated;
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) step(ki >= 8 ? (ki === 8 ? 'b' : 'a') : 'tap');
        else step(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp'));
        if (LV.cheated !== c0){ if (press){ clearTimeout(fbT); press.textContent = 'Cheat accepted'; } return; }
        echo(!(before > 0 && ki < before));
      }
      gmScreen.addEventListener('touchstart', function(e){ var t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; t1 = null; }, { passive: true });
      gmScreen.addEventListener('touchmove', function(e){ var t = e.touches[0]; t1 = { x: t.clientX, y: t.clientY }; if (e.cancelable) e.preventDefault(); }, { passive: false });
      gmScreen.addEventListener('touchend', function(e){ var t = e.changedTouches[0]; if (t) t1 = { x: t.clientX, y: t.clientY }; fin(); }, { passive: true });
      gmScreen.addEventListener('touchcancel', fin, { passive: true });
    }
    function cheat(){
      LV.cheated = Date.now(); LV.n += 30; if (LV.el) LV.el.textContent = 'LV ' + LV.n;
      toast('Cheat code accepted · +30 levels · warp drive overclocked');
      var o = document.createElement('div'); o.className = 'ab_konami'; o.innerHTML = '<b>+30 lives</b>'; document.body.appendChild(o);
      function done(){ if (o.parentNode) o.parentNode.removeChild(o); }
      if (reduce || !hasGsap){ setTimeout(done, 1500); return; }
      gsap.timeline({ onComplete: done }).from(o.firstChild, { scale: .4, opacity: 0, duration: .5, ease: 'back.out(2)' }).to(o.firstChild, { opacity: 0, y: -40, duration: .6, delay: .8 });
      if (sf && sf.state) gsap.timeline().to(sf.state, { warp: .8, duration: .5, ease: 'power2.in' }).to(sf.state, { warp: 0, duration: 1.2, ease: 'power2.out' });
      if (AB.quest) AB.quest('konami'); 
      // the cheat also skips straight to the boss
      if (!LV.beaten && LV.boss) setTimeout(LV.boss, 1700);
    }
  })();

  /* ---------- bookshelf: knock a book off (colors + heights come from data attributes) ---------- */
  (function(){
    var shelf = $('[data-shelf]'); if (!shelf) return;
    var note = $('[data-shelf-note]', shelf), nt;
    // real titles on six spines (the rest stay genres): each lands on the spine that already fits it, keeps its color,
    // and gets enough height for the title; knocking it off shows title + author + a line
    var TITLES = {
      'Kid lit (shared)': ['The Little Prince', 'Antoine de Saint-Exupéry · A pilot, a small planet and what actually matters.', 186],
      'Epic fantasy': ['The Alchemist', 'Paulo Coelho · Follow the omens. Still do.', 206],
      'Zarathustra': ['Thus Spoke Zarathustra', 'Friedrich Nietzsche · Camel, lion, child: it became the scope creep note.', 214],
      'Philosophy': ["Plato's Republic", 'Plato · The cave became the note on what crawlers see.', 196],
      'Sci-fi': ['1984', 'George Orwell · Why plain, honest language matters.', 190],
      'Mind': ['Outliers', 'Malcolm Gladwell · Ten thousand hours, give or take.', 172]
    }, used = {};
    $$('[data-book]', shelf).forEach(function(b){
      var t = TITLES[b.getAttribute('data-g')];
      if (!t || used[t[0]]) return; used[t[0]] = true;
      b.setAttribute('data-g', t[0]); b.setAttribute('data-note', t[1]); b.setAttribute('data-h', String(Math.max(+b.getAttribute('data-h') || 0, t[2])));
      b.classList.add('is-title'); var lb = $('.ab_book_label', b); if (lb) lb.textContent = t[0];
    });
    // the current read sits pulled out with an orange bookmark; moved to the middle of the row because a phone only
    // shows the middle ~11 spines (the row is centered and clipped)
    var CURRENT = 'The Alchemist', all = $$('[data-book]', shelf), cur = all.filter(function(b){ return b.getAttribute('data-g') === CURRENT; })[0];
    if (cur){
      var mid = all[Math.floor(all.length / 2)];
      if (mid && mid !== cur) shelf.insertBefore(cur, mid);
      cur.classList.add('is-current'); cur.__cur = true;
      var rib = document.createElement('i'); rib.className = 'ab_book_ribbon'; rib.setAttribute('aria-hidden', 'true'); cur.appendChild(rib);
    }
    $$('[data-book]', shelf).forEach(function(b){
      var c = b.getAttribute('data-c'), h = b.getAttribute('data-h'), fg = b.getAttribute('data-fg');
      if (c) b.style.backgroundColor = c; if (h) b.style.height = h + 'px'; if (fg) b.style.color = fg;
      b.setAttribute('aria-label', (b.getAttribute('data-g') || 'Book') + (b.__cur ? ', reading it now' : '') + '. Knock it off the shelf.');
      function knock(){
        if (AB.quest) AB.quest('book'); 
        if (note){ note.innerHTML = '<b>' + esc(b.getAttribute('data-g') || '') + (b.__cur ? ' · reading now' : '') + '</b>' + esc(b.getAttribute('data-note') || 'Always one on the nightstand.'); note.classList.add('show'); clearTimeout(nt); nt = setTimeout(function(){ note.classList.remove('show'); }, 2600); }
        if (reduce || !hasGsap || b.__busy) return;
        b.__busy = true; b.classList.add('is-out');
        // a clean fall: nudge up, tip over the bottom-right corner (gravity: slow start, fast finish), a small rebound, rest,
        // then stand back up; one pivot the whole way so nothing jumps
        gsap.set(b, { transformOrigin: '100% 100%' });
        gsap.timeline({ onComplete: function(){ b.__busy = false; b.classList.remove('is-out'); gsap.set(b, { clearProps: 'transform' }); } })
          .to(b, { y: -10, duration: .16, ease: 'power2.out' })
          .to(b, { rotation: 74, y: 0, duration: .42, ease: 'power2.in' })
          .to(b, { rotation: 68, duration: .12, ease: 'power1.out' })
          .to(b, { rotation: 74, duration: .14, ease: 'power1.in' })
          .to(b, { rotation: 0, duration: .55, ease: 'power3.out', delay: 1.1 });
      }
      b.addEventListener('click', knock); keyAct(b, knock);
    });
    // hover by the pointer's x over each book's resting slot (offsetLeft ignores transforms), not by :hover on the book:
    // a lifted book used to slide out from under the cursor, drop, get hovered again and flicker between books
    var books = $$('[data-book]', shelf), hot = null;
    function setHot(h){
      if (h === hot) return;
      books.forEach(function(x){ x.classList.remove('is-hot', 'is-hot-l', 'is-hot-r'); });
      hot = h; if (!h) return;
      var i = books.indexOf(h); h.classList.add('is-hot');
      if (books[i - 1]) books[i - 1].classList.add('is-hot-l'); if (books[i + 1]) books[i + 1].classList.add('is-hot-r');
    }
    if (!coarse && !reduce){
      shelf.addEventListener('pointermove', function(e){
        if (e.pointerType !== 'mouse') return;
        var pick = null, op = books[0] && books[0].offsetParent, x = op ? e.clientX - op.getBoundingClientRect().left : 0;
        for (var i = 0; op && i < books.length; i++){ var b = books[i]; if (x >= b.offsetLeft - 2 && x <= b.offsetLeft + b.offsetWidth + 2){ pick = b; break; } }
        setHot(pick);
      });
      shelf.addEventListener('pointerleave', function(){ setHot(null); });
    }
  })();

  /* ===== about/10-boss.js ===== */
  /* =========================================================
     PLAYER ONE · secret: reach LV 20 (or enter the cheat) and the card opens a boss fight. Letterbox + a VS title card,
     then you fly it: arrows or WASD to move, Space to fire (phones: drag to fly, hold to fire). THE SCOPE CREEP drifts,
     fires aimed shots, telegraphs a beam you have to dodge, and enrages at half health (spread shots). Three shields;
     lose them and you retry. It all plays over a hyperspeed starfield (canvas). The last hit: the stars slow, the ship
     charges, mega beam, impact frames; then "You won", a short credits crawl, and the name finale (the two halves streak
     in from the sides and meet in the middle; the only place the name appears). Optional sound: all of it synthesized live (Web Audio), off until the visitor
     turns it on (remembered). Esc, the × button, or a tap at the end closes it.
     ========================================================= */
  (function(){
    // pixel sprites: one character per pixel
    var BOSS = [
      '......xxxxx......',
      '...xxxxxxxxxxx...',
      '..xxxxxxxxxxxxx..',
      '.xxxooxxxxxooxxx.',
      '.xxxooxxxxxooxxx.',
      'xxxxxxxxxxxxxxxxx',
      'xxx.xxxxxxxxx.xxx',
      'xx..xmmmmmmmx..xx',
      'x...xxxxxxxxx...x',
      '....xx.....xx....',
      '...xx.......xx...',
      '..xx.........xx..'
    ];
    var SHIP = [
      '.....o.....',
      '....oxo....',
      '....xwx....',
      '...xxxxx...',
      '..oxxxxxo..',
      '.ooxxxxxoo.',
      'oo..xxx..oo',
      '....f.f....',
      '.....f.....'
    ];
    var COL = { x: '#9b7dff', o: '#ff5a6a', m: '#07080d' }, SCOL = { x: '#F2F0EA', o: '#FF6A3D', w: '#4C8DFF', f: '#ffd166' };
    function sprite(rows, col, cls){
      var h = rows.length, w = rows[0].length, r = '';
      rows.forEach(function(row, y){ for (var x = 0; x < w; x++){ var c = row.charAt(x); if (col[c]) r += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + col[c] + '"/>'; } });
      return '<svg class="' + cls + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
    }
    // the crawl never names anyone: the name appears once, in the finale (ROLES above it)
    var CREDITS = [
      ['Starring', 'You, Player One'],
      ['Final boss', 'The Scope Creep'],
      ['Soundtrack', 'Synthesized live in your browser'],
      ['Built with', 'Figma · Webflow · GSAP · Lenis'],
      ['', 'No scope was harmed in the making of this website.']
    ];
    var ROLES = 'Game idea · Story · Pixel art · Code · Sound', NAME = ['Angelino', 'Barajas'];

    /* ---------- sound: a tiny synth (original chiptune loop + effects), silent until switched on ---------- */
    var SFX = (function(){
      var ctx = null, master = null, on = false, loopT = null, step = 0, VOL = .32;
      try { on = localStorage.getItem('ab:boss-sound') === '1'; } catch (e){}
      function init(){
        if (ctx) return ctx;
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = on ? VOL : 0; master.connect(ctx.destination);
        return ctx;
      }
      function live(){ return ctx && on; }
      function tone(type, f0, f1, dur, vol, delay){
        if (!live()) return;
        var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .03);
      }
      function noise(dur, vol, delay, lp){
        if (!live()) return;
        var t = ctx.currentTime + (delay || 0), n = Math.max(1, Math.floor(ctx.sampleRate * dur)), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        s.buffer = b; f.type = 'lowpass'; f.frequency.value = lp || 3000; g.gain.value = vol;
        s.connect(f); f.connect(g); g.connect(master); s.start(t);
      }
      // battle loop: driving bass + a minor arpeggio, 136 bpm (written for this page)
      var BASS = [55, 55, 65.41, 55, 49, 49, 58.27, 49], ARP = [440, 523.25, 659.25, 523.25, 392, 493.88, 587.33, 493.88];
      function loopStart(){
        if (loopT) return; var dt = 60 / 136 / 2; step = 0;
        loopT = setInterval(function(){
          if (!live()) return; var i = step % 8;
          tone('triangle', BASS[i], 0, dt * .95, .3);
          if (step % 2 === 0) tone('square', ARP[(step / 2 | 0) % 8], 0, dt * .6, .045);
          if (step % 4 === 2) noise(.05, .12, 0, 7000);
          if (step % 8 === 0) tone('sine', 110, 40, .18, .35);
          step++;
        }, dt * 1000);
      }
      function loopStop(){ clearInterval(loopT); loopT = null; }
      return {
        isOn: function(){ return on; },
        set: function(v){
          on = !!v; try { localStorage.setItem('ab:boss-sound', on ? '1' : '0'); } catch (e){}
          if (on && init() && ctx.state === 'suspended') ctx.resume();
          if (master) master.gain.setTargetAtTime(on ? VOL : 0, ctx.currentTime, .05);
        },
        start: function(){ if (on) { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); } },
        laser: function(){ tone('square', 1500, 280, .13, .07); },
        hit: function(){ noise(.12, .22, 0, 2600); tone('square', 190, 70, .14, .09); },
        roar: function(){ tone('sawtooth', 92, 38, 1.2, .22); tone('sawtooth', 95, 40, 1.2, .18); noise(1, .14, 0, 700); },
        charge: function(){ tone('sawtooth', 70, 1100, 1.25, .1); tone('square', 140, 2200, 1.25, .03); },
        beam: function(){ noise(.55, .32, 0, 1400); tone('sawtooth', 240, 50, .55, .16); },
        whoosh: function(){ noise(.35, .14, 0, 5000); },
        boom: function(){ noise(1.6, .6, 0, 900); tone('sine', 120, 28, 1.4, .55); tone('square', 60, 25, .9, .12); },
        blip: function(){ tone('square', 520, 260, .09, .05); },
        hurt: function(){ tone('square', 320, 60, .35, .12); noise(.25, .2, 0, 1800); },
        shing: function(){ tone('sine', 2200, 3400, .5, .09); tone('triangle', 3300, 5200, .35, .05, .04); noise(.18, .1, 0, 9000); },
        mega: function(){ noise(1.6, .5, 0, 1600); tone('sawtooth', 160, 30, 1.5, .22); tone('square', 80, 26, 1.5, .1); },
        fanfare: function(){ [523.25, 659.25, 783.99, 1046.5].forEach(function(f, i){ tone('square', f, 0, .18, .07, i * .13); }); tone('square', 783.99, 0, .22, .07, .6); tone('square', 1046.5, 0, .9, .09, .82); tone('triangle', 261.63, 0, 1.1, .12, .82); },
        loopStart: loopStart, loopStop: loopStop,
        close: function(){ loopStop(); if (ctx){ try { ctx.close(); } catch (e){} ctx = null; master = null; } }
      };
    })();

    // hyperspeed backdrop: stars rush out of a vanishing point behind the boss and streak longer the faster we go.
    // speed(v, dur) eases between cruise (~.5), full warp (3+) and a near stop (.1); one canvas on gsap's ticker.
    function warpField(o){
      var cv = document.createElement('canvas'), g = cv.getContext && cv.getContext('2d');
      if (!g) return { speed: function(){}, kill: function(){} };
      cv.className = 'ab_boss_warp'; cv.setAttribute('aria-hidden', 'true'); o.insertBefore(cv, o.firstChild); o.classList.add('is-warp');
      var TINT = ['242,240,234', '242,240,234', '242,240,234', '255,106,61', '155,125,255', '76,141,255'];
      var st = { v: .5 }, dpr = Math.min(2, window.devicePixelRatio || 1), w = 0, h = 0, f = 0, stars = [];
      function seed(s, far){ s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = far ? 1 : .05 + Math.random() * .95; s.c = TINT[Math.random() * TINT.length | 0]; return s; }
      function size(){
        w = o.clientWidth; h = o.clientHeight; f = Math.max(w, h) * .5; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        var n = Math.round(Math.min(460, Math.max(160, w * h / 3200)));
        while (stars.length < n) stars.push(seed({}, false));
        stars.length = n;
      }
      function tick(t, dms){
        var dt = Math.min(.05, (dms || 16) / 1000), vx = w * .5, vy = h * .34, trail = .012 + st.v * .05;
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h); g.lineCap = 'round';
        for (var i = 0; i < stars.length; i++){
          var s = stars[i]; s.z -= st.v * dt;
          if (s.z <= .02){ seed(s, true); continue; }
          var x1 = vx + s.x / s.z * f, y1 = vy + s.y / s.z * f;
          if (x1 < -30 || x1 > w + 30 || y1 < -30 || y1 > h + 30){ seed(s, true); continue; }
          var z0 = Math.min(1, s.z + trail), k = 1 - s.z;
          g.strokeStyle = 'rgba(' + s.c + ',' + (k * .9 + .1).toFixed(2) + ')'; g.lineWidth = .4 + k * 2.2;
          g.beginPath(); g.moveTo(vx + s.x / z0 * f, vy + s.y / z0 * f); g.lineTo(x1, y1); g.stroke();
        }
      }
      size(); addEventListener('resize', size); gsap.ticker.add(tick);
      return {
        speed: function(v, dur){ gsap.to(st, { v: v, duration: dur == null ? .8 : dur, ease: 'power2.inOut', overwrite: true }); },
        kill: function(){ gsap.ticker.remove(tick); removeEventListener('resize', size); gsap.killTweensOf(st); }
      };
    }

    var open = false;
    LV.boss = function(){
      if (open || LV.beaten) return; open = true;
      var lenis = AB.lenis, root = document.documentElement;
      var o = document.createElement('div'); o.className = 'ab_boss'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Boss fight: The Scope Creep'); o.tabIndex = -1;
      var HELP = coarse ? 'Drag to fly · hold to fire' : 'Arrows or WASD to fly · Space to fire';
      o.innerHTML = '<div class="ab_boss_stars" aria-hidden="true"></div>' +
        '<div class="ab_boss_ctl"><button type="button" class="ab_boss_snd" aria-pressed="false"></button><button type="button" class="ab_boss_x" aria-label="Close the boss fight">Skip ×</button></div>' +
        '<div class="ab_boss_hud"><span class="ab_boss_name">Boss · The Scope Creep</span><span class="ab_boss_hp"><i></i></span>' +
          '<span class="ab_boss_lives" aria-label="Shields">Shields <i></i><i></i><i></i></span></div>' +
        '<div class="ab_boss_arena">' + sprite(BOSS, COL, 'ab_boss_mon') + sprite(SHIP, SCOL, 'ab_boss_ship') + '<i class="ab_boss_beam" aria-hidden="true"></i><i class="ab_boss_mega" aria-hidden="true"></i></div>' +
        '<div class="ab_boss_dim" aria-hidden="true"></div>' +
        '<div class="ab_boss_vs" aria-hidden="true"><span class="ab_boss_vs-a">Player one</span><b>VS</b><span class="ab_boss_vs-b">The Scope Creep</span></div>' +
        '<div class="ab_boss_warn">Warning · boss approaching</div>' +
        '<div class="ab_boss_help" aria-live="polite">' + HELP + '</div>' +
        '<div class="ab_boss_over"><b>Mission failed</b><p>The Scope Creep got through your shields.</p><span>' + (coarse ? 'Tap' : 'Press Enter or tap') + ' to try again</span></div>' +
        '<div class="ab_boss_win"><b>You won</b><p>LV ' + LV.BOSS + ' · The Scope Creep is defeated. The project shipped on time, on budget, and nobody asked for “just one more thing.”</p></div>' +
        '<div class="ab_boss_crawl" aria-hidden="true"><div class="ab_boss_tilt"><div class="ab_boss_crawl-in">' +
          CREDITS.map(function(c){ return '<div class="ab_boss_cr">' + (c[0] ? '<small>' + esc(c[0]) + '</small>' : '') + '<span>' + esc(c[1]) + '</span></div>'; }).join('') +
          '</div></div></div>' +
        '<div class="ab_boss_fin" aria-hidden="true"><small>' + ROLES + '</small>' +
          '<div class="ab_boss_fin-name"><span class="is-l"><i></i><i></i><i></i>' + NAME[0] + '</span><span class="is-r"><i></i><i></i><i></i>' + NAME[1] + '</span></div>' +
          '<small class="ab_boss_fin-tap">Thanks for playing · tap anywhere to return</small></div>' +
        '<div class="ab_boss_bar is-t" aria-hidden="true"></div><div class="ab_boss_bar is-b" aria-hidden="true"></div>' +
        '<div class="ab_boss_flash" aria-hidden="true"></div>' +
        '<ul class="ab_sr">' + CREDITS.map(function(c){ return '<li>' + esc((c[0] ? c[0] + ': ' : '') + c[1]) + '</li>'; }).join('') + '<li>' + esc(ROLES + ': ' + NAME.join(' ')) + '</li></ul>';
      document.body.appendChild(o);
      if (lenis) lenis.stop(); root.style.overflow = 'hidden';
      var closeBtn = $('.ab_boss_x', o), sndBtn = $('.ab_boss_snd', o), prevFocus = document.activeElement, tl = null, ended = false, warp = null;
      function paintSnd(){ var on = SFX.isOn(); sndBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); sndBtn.innerHTML = (on ? '♪ Sound on' : '♪ Sound off'); sndBtn.setAttribute('aria-label', on ? 'Turn the sound off' : 'Turn the sound on'); }
      paintSnd();
      sndBtn.addEventListener('click', function(e){ e.stopPropagation(); SFX.set(!SFX.isOn()); paintSnd(); if (SFX.isOn() && tl && tl.__loop) SFX.loopStart(); o.focus({ preventScroll: true }); });
      SFX.start();

      var mon = $('.ab_boss_mon', o), ship = $('.ab_boss_ship', o), hp = $('.ab_boss_hp i', o), arena = $('.ab_boss_arena', o), beam = $('.ab_boss_beam', o), mega = $('.ab_boss_mega', o);
      var win = $('.ab_boss_win', o), crawl = $('.ab_boss_crawl', o), crawlIn = $('.ab_boss_crawl-in', o), warn = $('.ab_boss_warn', o);
      var bars = $$('.ab_boss_bar', o), vs = $('.ab_boss_vs', o), dim = $('.ab_boss_dim', o), flash = $('.ab_boss_flash', o), hud = $('.ab_boss_hud', o);
      var help = $('.ab_boss_help', o), over = $('.ab_boss_over', o), pips = $$('.ab_boss_lives i', o), nameEl = $('.ab_boss_name', o);

      /* ---------- the fight: a small real-time game on gsap's ticker ---------- */
      var running = false, isOver = false, keys = {}, touch = null, shots = [], foes = [];
      var W = 0, H = 0, SB = null, MB = null, sx = 0, sy = 0, tilt = 0, bx = 0, bt = 0, HPV = 100, lives = 3, inv = 0, cool = 0;
      var tAim = 0, tSpread = 0, tBeam = 0, beamSt = null, enraged = false, helpOn = false;
      var DMG = 2;
      function base(el){ var a = arena.getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left - a.left - (+gsap.getProperty(el, 'x') || 0), y: r.top - a.top - (+gsap.getProperty(el, 'y') || 0), w: r.width, h: r.height }; }
      function measure(){ W = arena.offsetWidth; H = arena.offsetHeight; SB = base(ship); MB = base(mon); }
      function shipC(){ return { x: SB.x + sx + SB.w / 2, y: SB.y + sy + SB.h * .55 }; }
      function bossBox(){ return { x: MB.x + bx + MB.w * .08, y: MB.y + MB.h * .05, w: MB.w * .84, h: MB.h * .8 }; }
      function place(el, x, y){ el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }
      function paintLives(){ pips.forEach(function(p, i){ p.classList.toggle('is-gone', i >= lives); }); }
      function clearBullets(){ shots.concat(foes).forEach(function(b){ b.el.remove(); }); shots = []; foes = []; }
      function hideBeam(){ beamSt = null; beam.classList.remove('is-tele', 'is-fire'); gsap.to(mon, { filter: 'brightness(1)', scale: 1, duration: .3 }); gsap.to(dim, { opacity: 0, duration: .3 }); }
      function hideHelp(){ if (!helpOn) return; helpOn = false; gsap.to(help, { opacity: 0, duration: .4 }); }

      function fire(){
        var c = shipC(), el = document.createElement('i'); el.className = 'ab_boss_laser'; arena.appendChild(el);
        var b = { el: el, x: c.x, y: SB.y + sy - 10 }; place(el, b.x, b.y); shots.push(b); SFX.laser();
      }
      function enemyShot(x, y, vx, vy){ var el = document.createElement('i'); el.className = 'ab_boss_blob'; arena.appendChild(el); var f = { el: el, x: x, y: y, vx: vx, vy: vy }; place(el, x, y); foes.push(f); }
      function aimed(){
        var c = shipC(), x = MB.x + bx + MB.w / 2, y = MB.y + MB.h * .85, dx = c.x - x, dy = c.y - y, d = Math.sqrt(dx * dx + dy * dy) || 1, v = enraged ? 380 : 300;
        enemyShot(x, y, dx / d * v, dy / d * v); SFX.blip();
      }
      function spread(){
        var x = MB.x + bx + MB.w / 2, y = MB.y + MB.h * .85, v = 250;
        for (var k = -2; k <= 2; k++){ var ang = Math.PI / 2 + k * .28; enemyShot(x, y, Math.cos(ang) * v, Math.sin(ang) * v); }
        SFX.blip();
      }
      function hurt(){
        if (inv > 0) return;
        lives--; inv = 1.5; paintLives(); SFX.hurt(); shake(16);
        ship.classList.add('is-hurt'); setTimeout(function(){ ship.classList.remove('is-hurt'); }, 1500);
        gsap.fromTo(dim, { opacity: .7 }, { opacity: 0, duration: .5 });
        if (lives <= 0) gameOver();
      }
      function damage(){
        HPV = Math.max(0, HPV - DMG); hit(Math.max(HPV, 0), false);
        if (!enraged && HPV <= 50){
          enraged = true; mon.classList.add('is-rage'); SFX.roar(); shake(24); nameEl.textContent = 'Boss · The Scope Creep · enraged';
          warn.textContent = 'Scope creep detected'; gsap.fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 5, yoyo: true, ease: 'steps(1)', onComplete: function(){ gsap.set(warn, { opacity: 0 }); } });
          tSpread = 1.2;
        }
        if (HPV <= 0) finish();
      }
      function tick(time, deltaMs){
        if (!running) return;
        var dt = Math.min(.05, (deltaMs || 16) / 1000);
        // pilot
        var spd = Math.max(260, W * .55), dx = 0, dy = 0;
        if (touch){
          var tx = touch.x - (SB.x + SB.w / 2), ty = touch.y - 80 - (SB.y + SB.h / 2), ddx = tx - sx, ddy = ty - sy, dd = Math.sqrt(ddx * ddx + ddy * ddy), step = spd * 1.6 * dt;
          if (dd > 1){ var k = Math.min(1, step / dd); sx += ddx * k; sy += ddy * k; dx = ddx / dd; }
        } else {
          dx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0); dy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
          if (dx && dy){ dx *= .7071; dy *= .7071; }
          sx += dx * spd * dt; sy += dy * spd * dt;
        }
        sx = Math.max(6 - SB.x, Math.min(W - SB.w - 6 - SB.x, sx));
        sy = Math.max(H * .4 - SB.y, Math.min(H - SB.h - 4 - SB.y, sy));
        tilt += ((dx || 0) * 14 - tilt) * Math.min(1, dt * 10);
        gsap.set(ship, { x: sx, y: sy, rotation: tilt });
        cool -= dt; inv -= dt;
        if ((keys.f || touch) && cool <= 0){ fire(); cool = .15; }
        // boss: drifts side to side, stands still while it charges the beam
        if (!beamSt){ bt += dt * (enraged ? 1.35 : .85); bx = Math.sin(bt) * Math.max(0, (W - MB.w) / 2 - 12) * .85; gsap.set(mon, { x: bx }); }
        tAim -= dt; tSpread -= dt; tBeam -= dt;
        if (tAim <= 0 && !beamSt){ aimed(); tAim = (enraged ? .8 : 1.3) + Math.random() * .35; }
        if (enraged && tSpread <= 0 && !beamSt){ spread(); tSpread = 3; }
        if (tBeam <= 0 && !beamSt){
          beamSt = { t: 0, x: MB.x + bx + MB.w / 2 }; tBeam = enraged ? 6.5 : 8.5;
          var top = MB.y + MB.h - 6; beam.style.left = beamSt.x + 'px'; beam.style.top = top + 'px'; beam.style.height = (H - top) + 'px';
          beam.classList.add('is-tele'); SFX.charge();
          gsap.to(mon, { filter: 'brightness(1.8) drop-shadow(0 0 26px #ff5a6a)', scale: 1.06, duration: .9, ease: 'power1.in' }); gsap.to(dim, { opacity: .45, duration: .5 });
        }
        if (beamSt){
          beamSt.t += dt;
          if (beamSt.t >= .95 && !beamSt.fired){ beamSt.fired = true; beam.classList.remove('is-tele'); beam.classList.add('is-fire'); SFX.beam(); shake(14); }
          if (beamSt.fired && Math.abs(shipC().x - beamSt.x) < 23 + SB.w * .22) hurt();
          if (beamSt.t >= 1.6) hideBeam();
        }
        // bullets
        var bb = bossBox(), i;
        for (i = shots.length - 1; i >= 0; i--){
          var s = shots[i]; s.y -= 950 * dt;
          if (s.x > bb.x && s.x < bb.x + bb.w && s.y > bb.y && s.y < bb.y + bb.h){ s.el.remove(); shots.splice(i, 1); damage(); if (!running) return; continue; }
          if (s.y < -40){ s.el.remove(); shots.splice(i, 1); continue; }
          place(s.el, s.x, s.y);
        }
        var c = shipC(), rr = SB.w * .26 + 6;
        for (i = foes.length - 1; i >= 0; i--){
          var f = foes[i]; f.x += f.vx * dt; f.y += f.vy * dt;
          var ex = f.x - c.x, ey = f.y - c.y;
          if (ex * ex + ey * ey < rr * rr){ f.el.remove(); foes.splice(i, 1); hurt(); if (!running) return; continue; }
          if (f.y > H + 30 || f.x < -30 || f.x > W + 30){ f.el.remove(); foes.splice(i, 1); continue; }
          place(f.el, f.x, f.y);
        }
      }
      function startGame(){
        measure(); sx = sy = 0; bx = 0; bt = 0; HPV = 100; lives = 3; inv = 0; cool = 0; enraged = false;
        tAim = 2.2; tSpread = 3; tBeam = 6; beamSt = null; keys = {}; touch = null;
        mon.classList.remove('is-rage'); nameEl.textContent = 'Boss · The Scope Creep'; hp.style.width = '100%'; paintLives();
        gsap.set(ship, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });
        helpOn = true; gsap.fromTo(help, { opacity: 0 }, { opacity: 1, duration: .4 });
        setTimeout(hideHelp, 5000);
        running = true; gsap.ticker.add(tick);
      }
      function stopGame(){ running = false; gsap.ticker.remove(tick); touch = null; keys = {}; }
      function gameOver(){
        stopGame(); isOver = true; clearBullets(); if (beamSt) hideBeam(); SFX.loopStop(); SFX.boom(); warp.speed(.12, 1.2);
        gsap.to(ship, { opacity: 0, scale: 1.8, duration: .5, ease: 'power2.out' });
        gsap.set(over, { visibility: 'visible' }); gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: .4, delay: .5 });
      }
      function retry(){
        if (!isOver) return; isOver = false;
        gsap.to(over, { opacity: 0, duration: .25, onComplete: function(){ gsap.set(over, { visibility: 'hidden' }); } });
        SFX.loopStart(); warp.speed(.55, 1); startGame();
      }

      /* ---------- input: arrows / WASD + Space, or drag (touch and mouse) ---------- */
      var KEYMAP = { arrowleft: 'l', a: 'l', arrowright: 'r', d: 'r', arrowup: 'u', w: 'u', arrowdown: 'd', s: 'd', ' ': 'f', spacebar: 'f' };
      function keyOf(e){ return KEYMAP[(e.key || '').toLowerCase()] || (e.code === 'Space' ? 'f' : null); }
      function onKey(e){
        if (e.key === 'Escape'){ close(); return; }
        var k = keyOf(e);
        if (isOver && (e.key === 'Enter' || k === 'f')){ e.preventDefault(); retry(); return; }
        if (!k) return;
        // the page is locked behind the fight: keep Space/arrows from scrolling or pressing a focused button
        e.preventDefault();
        if (running){ keys[k] = true; hideHelp(); }
      }
      function onKeyUp(e){ var k = keyOf(e); if (k){ keys[k] = false; e.preventDefault(); } }
      function onBlur(){ keys = {}; touch = null; }
      function onResize(){ if (running) measure(); }
      function pt(e){ var a = arena.getBoundingClientRect(); return { x: e.clientX - a.left, y: e.clientY - a.top }; }
      o.addEventListener('pointerdown', function(e){
        if (e.target.closest && e.target.closest('button')) return;
        if (isOver){ retry(); return; }
        if (!running) return;
        touch = pt(e); hideHelp(); try { o.setPointerCapture(e.pointerId); } catch (err){}
      });
      o.addEventListener('pointermove', function(e){ if (touch) touch = pt(e); });
      o.addEventListener('pointerup', function(){ touch = null; });
      o.addEventListener('pointercancel', function(){ touch = null; });
      document.addEventListener('keydown', onKey);
      document.addEventListener('keyup', onKeyUp);
      addEventListener('blur', onBlur); addEventListener('resize', onResize);

      function close(){
        if (!open) return; open = false; LV.beaten = true;
        stopGame(); clearBullets(); if (warp) warp.kill();
        if (tl) tl.kill(); document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKeyUp);
        removeEventListener('blur', onBlur); removeEventListener('resize', onResize);
        SFX.close(); if (hasGsap) gsap.globalTimeline.timeScale(1);
        if (lenis) lenis.start(); root.style.overflow = '';
        if (hasGsap && !reduce) gsap.to(o, { opacity: 0, duration: .4, onComplete: function(){ o.remove(); } }); else o.remove();
        if (LV.press){ LV.press.textContent = 'Boss defeated · GG'; LV.press.style.animation = 'none'; }
        if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e){}
      }
      closeBtn.addEventListener('click', function(e){ e.stopPropagation(); close(); });
      o.addEventListener('click', function(){ if (ended) close(); });
      // focus the dialog, not the Skip button, so Space fires instead of skipping
      o.focus({ preventScroll: true });

      if (reduce || !hasGsap){
        // no fight: straight to the result, credits as a still list
        o.classList.add('is-still'); crawlIn.appendChild($('.ab_boss_fin', o)); win.style.opacity = 1; crawl.style.opacity = 1; hp.style.width = '0%'; ended = true; if (AB.quest) AB.quest('boss'); return;
      }
      // we arrive at hyperspeed and drop to cruise when the boss shows up
      warp = warpField(o); warp.speed(3.4, 0);
      function shake(n){ gsap.fromTo(arena, { x: (Math.random() - .5) * n, y: (Math.random() - .5) * n }, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.25)' }); }
      function hit(pc, big){
        SFX.hit();
        gsap.fromTo(mon, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: .25 });
        shake(big ? 26 : 5);
        hp.style.width = pc + '%';
        var d = document.createElement('span'); d.className = 'ab_boss_dmg'; d.textContent = '-' + (8 + Math.round(Math.random() * 6)); arena.appendChild(d);
        var m = mon.getBoundingClientRect(), a = arena.getBoundingClientRect();
        gsap.fromTo(d, { x: m.left - a.left + m.width * (.2 + Math.random() * .6), y: m.top - a.top + m.height * .3, opacity: 1 }, { y: '-=40', opacity: 0, duration: .8, ease: 'steps(6)', onComplete: function(){ d.remove(); } });
      }
      function explode(){
        SFX.loopStop(); SFX.boom(); if (AB.quest) AB.quest('boss');
        var rects = $$('rect', mon);
        rects.forEach(function(r){ gsap.to(r, { x: (Math.random() - .5) * 34, y: (Math.random() - .3) * 30, opacity: 0, duration: 1.1 + Math.random() * .8, ease: 'power2.out' }); });
        gsap.fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'power2.out' });
        shake(40);
      }
      // energy gathers on the ship before the finisher
      function gather(c){
        for (var n = 0; n < 28; n++){
          var el = document.createElement('i'); el.className = 'ab_boss_spark'; arena.appendChild(el);
          var ang = Math.random() * Math.PI * 2, r = 140 + Math.random() * 220;
          gsap.fromTo(el, { x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r, opacity: 0, scale: 1.6 },
            { x: c.x, y: c.y, opacity: 1, scale: .4, duration: .5 + Math.random() * .5, delay: Math.random() * .5, ease: 'power3.in', onComplete: (function(e){ return function(){ e.remove(); }; })(el) });
        }
      }

      /* ---------- the finisher: the stars slow, the ship charges and drags the boss into line, a mega beam, impact frames ---------- */
      function finish(){
        stopGame(); clearBullets(); if (beamSt) hideBeam(); hp.style.width = '2%'; hideHelp();
        SFX.loopStop(); SFX.hit();
        var c = shipC(), shipTop = SB.y + sy;
        gsap.set(ship, { rotation: 0 });
        tl = gsap.timeline();
        tl.fromTo(flash, { opacity: .85 }, { opacity: 0, duration: .25 })
          .add(function(){ warp.speed(.08, .6); SFX.charge(); gsap.set(arena, { transformOrigin: c.x + 'px ' + c.y + 'px' }); gather(c); })
          .to(arena, { scale: 1.55, duration: 1.1, ease: 'power2.inOut' })
          .to(ship, { filter: 'brightness(2.2) drop-shadow(0 0 22px #FF6A3D)', duration: 1.1 }, '<')
          // the ship's lock drags the boss into its line of fire
          .to(mon, { x: c.x - MB.x - MB.w / 2, duration: 1.1, ease: 'power2.inOut' }, '<')
          .to(arena, { scale: 1, duration: .16, ease: 'power3.in' }, '+=.25')
          // fire: the beam runs from the ship to the top of the screen, straight through the boss
          .add(function(){
            mega.style.left = c.x + 'px'; mega.style.height = Math.max(0, shipTop + 6) + 'px';
            SFX.mega(); shake(34); warp.speed(3.6, .15);
          })
          .fromTo(mega, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .1, ease: 'power2.out' })
          // impact frames: silhouette, invert, silhouette
          .add(function(){ o.classList.add('is-impact'); })
          .add(function(){ o.classList.remove('is-impact'); o.classList.add('is-invert'); }, '+=.08')
          .add(function(){ o.classList.remove('is-invert'); o.classList.add('is-impact'); }, '+=.07')
          .add(function(){ o.classList.remove('is-impact'); hp.style.width = '0%'; }, '+=.09')
          .to(mega, { scaleX: .7, duration: .06, yoyo: true, repeat: 5, ease: 'steps(1)' })
          .add(explode, '+=.05')
          .add(function(){ warp.speed(.5, 1.6); }, '<')
          .to(mega, { scaleX: 0, opacity: 0, duration: .5, ease: 'power2.in' }, '<.2')
          .to(ship, { filter: 'brightness(1) drop-shadow(0 0 10px rgba(255,106,61,.6))', duration: .6 }, '<');
        outro(tl);
      }
      function outro(t){
        t.to(hud, { opacity: 0, duration: .4 }, '+=.5')
          .add(function(){ SFX.fanfare(); })
          .fromTo(win, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)', onStart: function(){ ended = true; } }, '<')
          .to(ship, { y: '-=40', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
          .to(win, { opacity: 0, y: -30, duration: .6 }, '+=3')
          .to(bars, { scaleY: 0, duration: .6, ease: 'power2.in' }, '<')
          .to(ship, { y: -innerHeight, duration: 1.4, ease: 'power2.in' }, '<')
          .to(crawl, { opacity: 1, duration: .5 }, '<')
          .fromTo(crawlIn, { yPercent: 0, y: function(){ return crawl.offsetHeight; } }, { yPercent: -100, y: function(){ return crawl.offsetHeight * .3; }, duration: 13, ease: 'none' })
          .to(crawl, { opacity: 0, duration: .6 }, '-=1.2');
        // finale: back to hyperspeed, the two halves of the name streak in from the sides and meet in the middle
        var fin = $('.ab_boss_fin', o), L = $('.is-l', fin), R = $('.is-r', fin), trails = $$('.ab_boss_fin-name i', fin), fsm = $$('small', fin);
        t.add(function(){ warp.speed(3.4, .7); SFX.whoosh(); })
          .set(fin, { visibility: 'visible' })
          .fromTo(fsm[0], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5 }, '+=.3')
          .fromTo(L, { x: function(){ return -innerWidth; }, skewX: -28 }, { x: 0, skewX: 0, duration: .6, ease: 'power4.in' }, '+=.15')
          .fromTo(R, { x: function(){ return innerWidth; }, skewX: 28 }, { x: 0, skewX: 0, duration: .6, ease: 'power4.in' }, '<')
          .add(function(){ SFX.boom(); SFX.fanfare(); gsap.fromTo(flash, { opacity: .7 }, { opacity: 0, duration: .9, ease: 'power2.out' }); warp.speed(.3, 2); })
          .to(trails, { scaleX: 0, opacity: 0, duration: .5, ease: 'power3.out' })
          .fromTo([L, R], { scaleX: 1.14, scaleY: .88 }, { scaleX: 1, scaleY: 1, duration: .7, ease: 'elastic.out(1,.35)' }, '<')
          .fromTo(fsm[1], { opacity: 0 }, { opacity: 1, duration: .6 }, '+=.4');
      }

      tl = gsap.timeline();
      // cold open: letterbox, VS title card
      tl.from(o, { opacity: 0, duration: .3 })
        .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: .6, ease: 'power3.out' })
        .add(function(){ SFX.roar(); })
        .fromTo($('.ab_boss_vs-a', vs), { xPercent: -120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .55, ease: 'power3.out' }, '<')
        .fromTo($('.ab_boss_vs-b', vs), { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .55, ease: 'power3.out' }, '<')
        .fromTo($('b', vs), { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(2)' }, '<.25')
        .to(vs, { opacity: 0, scale: 1.08, duration: .35 }, '+=1.1')
        // entrance: warning, the ship rises, the boss drops in as the camera pulls back
        .add(function(){ warp.speed(.55, 1.8); })
        .fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .12, repeat: 5, yoyo: true, ease: 'steps(1)' }, '<')
        .to(warn, { opacity: 0, duration: .2 })
        .fromTo(arena, { scale: 1.25 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, '<')
        .from(ship, { y: 160, opacity: 0, duration: .7, ease: 'power3.out' }, '<')
        .from(mon, { y: -320, duration: 1, ease: 'bounce.out' }, '<.15')
        .add(function(){ shake(22); }, '-=.35')
        .from(hud, { opacity: 0, y: -10, duration: .4 }, '<')
        .fromTo(hp, { width: '0%' }, { width: '100%', duration: .6, ease: 'steps(10)' })
        .add(function(){ tl.__loop = true; SFX.loopStart(); startGame(); });
    };
  })();

  /* ===== about/20-quests.js ===== */
  /* ---------- side quests log: a line on the Player one card ("Side quests") opens the list; every find ticks
     off live; all found turns the crew badge gold. Unfound quests show only a hint ---------- */
  (function(){
    var Q = AB.quest, gm = $('[data-gm]'); if (!Q || !gm) return;
    var card = gm.closest('.ab_bento-card'), copy = card && $('.ab_bento-card_copy', card); if (!copy) return;
    // on the card: a segmented progress bar (one segment per quest) and a live feed of the latest finds, with hints
    // for unfound quests cycling in the spare lines
    var qx = document.createElement('div'); qx.className = 'abx-qx';
    qx.innerHTML = '<div class="abx-qx_top"><span>Side quests</span><b></b></div><div class="abx-qx_bar" aria-hidden="true"></div><ul class="abx-qx_feed" aria-live="polite"></ul>';
    copy.appendChild(qx);
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'abx-qlog';
    copy.appendChild(btn);
    var panel = null, badge = $('[data-badge]'), prevFocus = null;
    function N(){ return Q.list.length; }
    function paintBtn(){ btn.innerHTML = '✦ Quest log · <b>' + Q.count() + '/' + N() + '</b>'; btn.setAttribute('aria-label', 'Open the side quest log, ' + Q.count() + ' of ' + N() + ' found'); }
    var FEED = 3, hintI = 0, found = {};
    try { found = JSON.parse(localStorage.getItem('ab:quests') || '{}') || {}; } catch (e){ found = {}; }
    function ago(t){ var m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? 'just now' : m < 60 ? m + 'm ago' : m < 1440 ? Math.round(m / 60) + 'h ago' : Math.round(m / 1440) + 'd ago'; }
    function paintQx(fresh){
      var n = Q.count(), N0 = N();
      $('.abx-qx_top b', qx).textContent = n + '/' + N0 + ' · ' + Math.round(n / N0 * 100) + '%';
      var bar = $('.abx-qx_bar', qx);
      if (bar.children.length !== N0) bar.innerHTML = Q.list.map(function(){ return '<i></i>'; }).join('');
      Q.list.forEach(function(q, i){ var seg = bar.children[i], on = Q.has(q[0]); seg.classList.toggle('is-on', on); seg.classList.toggle('is-new', q[0] === fresh); });
      // latest finds first (timestamps from the log), then hints for what is left
      var done = Q.list.filter(function(q){ return Q.has(q[0]); }).sort(function(a, b){ return (found[b[0]] || 0) - (found[a[0]] || 0); }).slice(0, Q.count() < N() ? FEED - 1 : FEED);
      var left = Q.list.filter(function(q){ return !Q.has(q[0]); }), rows = done.map(function(q){ return '<li class="is-done' + (q[0] === fresh ? ' is-new' : '') + '"><i>✓</i><span>' + esc(q[1]) + '</span><em>' + ago(found[q[0]] || Date.now()) + '</em></li>'; });
      for (var k = 0; rows.length < FEED && left.length; k++){ var h = left[(hintI + k) % left.length]; rows.push('<li class="is-hint"><i>◇</i><span>' + esc(h[2]) + '</span></li>'); if (k >= left.length - 1) break; }
      if (!rows.length) rows.push('<li class="is-hint"><i>✦</i><span>Every quest found. Badge: gold.</span></li>');
      $('.abx-qx_feed', qx).innerHTML = rows.join('');
      if (fresh && hasGsap && !reduce){ var nw = $('.abx-qx_feed li.is-new', qx); if (nw) gsap.from(nw, { x: -12, opacity: 0, duration: .5, ease: 'power3.out' }); }
    }
    // hints rotate while the card is on screen
    var hintT = null;
    function spin(on){ clearInterval(hintT); if (on && !reduce) hintT = setInterval(function(){ if (Q.count() < N()){ hintI++; var hs = $$('.abx-qx_feed li.is-hint', qx); if (hasGsap && hs.length) gsap.to(hs, { opacity: 0, duration: .25, onComplete: function(){ paintQx(); gsap.from($$('.abx-qx_feed li.is-hint', qx), { opacity: 0, y: 4, duration: .35 }); } }); else paintQx(); } }, 4200); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ spin(es[0].isIntersecting); }).observe(qx); else spin(true);
    function gold(){ if (badge) badge.classList.toggle('is-gold', Q.count() === N()); }
    function render(){
      if (!panel) return;
      var n = Q.count();
      $('.abx-qp_h span', panel).textContent = 'Side quests · ' + n + '/' + N();
      $('.abx-qp_bar i', panel).style.width = (n / N() * 100) + '%';
      $('.abx-qp_gold', panel).hidden = n !== N();
      $('.abx-qp_list', panel).innerHTML = Q.list.map(function(q){
        var d = Q.has(q[0]);
        return '<li class="' + (d ? 'is-done' : '') + '"><i aria-hidden="true">' + (d ? '✓' : '◇') + '</i><div><b>' + (d ? esc(q[1]) : 'Unknown quest') + '</b><span>' + esc(q[2]) + '</span></div></li>';
      }).join('');
    }
    function close(){ if (!panel) return; panel.classList.remove('is-on'); document.removeEventListener('keydown', onKey); if (AB.lenis) AB.lenis.start(); document.documentElement.style.overflow = ''; if (prevFocus) try { prevFocus.focus(); } catch (e){} }
    function onKey(e){ if (e.key === 'Escape') close(); }
    function open(){
      if (!panel){
        panel = document.createElement('div'); panel.className = 'abx-qp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Side quest log');
        panel.innerHTML = '<div class="abx-qp_box" data-lenis-prevent><div class="abx-qp_h"><span></span><button type="button" class="abx-qp_x" aria-label="Close the quest log">×</button></div>' +
          '<div class="abx-qp_t">Side quests</div><div class="abx-qp_note">Little things hidden around the site. Finds are saved in this browser.</div>' +
          '<div class="abx-qp_bar" aria-hidden="true"><i></i></div><div class="abx-qp_gold" hidden>Every side quest found. Your crew badge on this page just went gold. Thanks for playing, Player One.</div>' +
          '<ul class="abx-qp_list"></ul><button type="button" class="abx-qp_reset">Reset the log</button></div>';
        document.body.appendChild(panel);
        $('.abx-qp_x', panel).addEventListener('click', close);
        panel.addEventListener('click', function(e){ if (e.target === panel) close(); });
        $('.abx-qp_reset', panel).addEventListener('click', function(){ Q.reset(); toast('Quest log reset'); });
      }
      prevFocus = document.activeElement; render();
      panel.classList.add('is-on'); document.addEventListener('keydown', onKey);
      if (AB.lenis) AB.lenis.stop(); document.documentElement.style.overflow = 'hidden';
      setTimeout(function(){ var x = $('.abx-qp_x', panel); if (x) x.focus(); }, 60);
    }
    btn.addEventListener('click', function(e){ e.stopPropagation(); open(); });
    document.addEventListener('ab:quest', function(e){
      var id = e.detail && e.detail.id;
      try { found = JSON.parse(localStorage.getItem('ab:quests') || '{}') || {}; } catch (er){}
      paintBtn(); gold(); render(); paintQx(id);
    });
    paintBtn(); gold(); paintQx();
  })();

});
