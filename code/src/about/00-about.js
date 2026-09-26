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
  // a headshot dropped into the photo frame in the Designer replaces the placeholder
  $$('[data-badge-photo]').forEach(function(p){ if ($('img', p)) p.classList.add('has-photo'); });

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
      S.held = false; startTick();
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
      if (window.MutationObserver) new MutationObserver(function(){ orbRate(td.classList.contains('is-close') ? 3.2 : 1); }).observe(td, { attributes: true, attributeFilter: ['class'] });
    }
    // the score: flying close shows a play button; it opens the official track (Spotify embed) in a small player docked
    // to the corner, so it keeps playing while the visitor scrolls. Starts at 0:32 (Spotify decides what a logged-out
    // listener hears: often a preview clip)
    var viz = $('.ab_bento-card_viz.is-td', td) || td;
    var TRACK = 'spotify:track:6pWgRkpqVfxnj3WuIcJ7WP', START = 32;
    var play = document.createElement('button'); play.type = 'button'; play.className = 'abx-score';
    play.innerHTML = '<i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></i><span>Play the score</span>';
    play.setAttribute('aria-label', 'Play the Interstellar score, Cornfield Chase, from 0:32');
    // bottom-right corner of the card (phones: under the hint line)
    td.appendChild(play);
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
    if (window.MutationObserver) new MutationObserver(function(){ if (td.classList.contains('is-close')) scoreDock(false); }).observe(td, { attributes: true, attributeFilter: ['class'] });
    play.addEventListener('click', function(e){
      e.stopPropagation(); want = true; seeked = false;
      scoreDock(true);
      if (ctrl) try { ctrl.play(); } catch (err){}
    });
    td.addEventListener('pointerenter', function(){ hover = true; td.classList.add('is-close'); });
    // leaving the card stops the score (Spotify's embed has no volume control, so it can't fade): pause + tuck the player away
    function hush(){ if (!dockEl || !dockEl.classList.contains('is-on')) return; want = false; if (ctrl) try { ctrl.pause(); } catch (e){} dockEl.classList.remove('is-on'); }
    td.addEventListener('pointerleave', function(e){ hover = false; td.classList.remove('is-close'); if (e.pointerType === 'mouse') hush(); });
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

  /* ---------- crew of three: hover speeds the orbits up smoothly (playbackRate, so nobody jumps to a new spot;
     changing animation-duration on hover re-computes the progress and the planets snap) ---------- */
  (function(){
    var sys = $('.ab_crew_sys'); if (!sys || reduce) return;
    var card = sys.closest('.ab_bento-card'), els = $$('.ab_crew_orbit, .ab_crew_moon', sys);
    if (!card || !els.length || !els[0].getAnimations) return;
    var sp = { r: 1 };
    function apply(){ els.forEach(function(el){ el.getAnimations().forEach(function(a){ a.playbackRate = sp.r; }); }); }
    function to(r){ if (hasGsap) gsap.to(sp, { r: r, duration: .8, ease: 'power2.out', overwrite: true, onUpdate: apply }); else { sp.r = r; apply(); } }
    card.addEventListener('pointerenter', function(){ to(2.2); });
    card.addEventListener('pointerleave', function(){ to(1); });
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
      function end(){ if (!drag) return; drag = false; p.style.cursor = ''; if (hasGsap) gsap.to(p, { rotation: 0, duration: 1.4, ease: 'elastic.out(1,.4)', overwrite: 'auto' }); }
      p.addEventListener('pointerup', end); p.addEventListener('pointercancel', end);
    });
  })();

  /* ---------- philosophy: another question (Designer list [data-about-questions]) ---------- */
  (function(){
    var box = $('[data-ph]'), qT = $('[data-ph-q]'), qN = $('[data-ph-no]'), mark = $('.ab_ph_mark');
    var QS = $$('[data-about-questions] p').map(function(p){ return p.textContent.trim(); }).filter(Boolean);
    if (!box || !qT || !QS.length) return;
    var qi = 0;
    function next(){
      qi = (qi + 1) % QS.length; if (qN) qN.textContent = 'Question ' + pad2(qi + 1);
      if (reduce || !hasGsap || !window.ScrambleTextPlugin){ qT.textContent = QS[qi]; return; }
      gsap.to(qT, { duration: .8, scrambleText: { text: QS[qi], chars: '?!/_<>', speed: .6 } });
      if (mark) gsap.fromTo(mark, { rotation: -20 }, { rotation: 0, duration: .8, ease: 'elastic.out(1,.4)' });
    }
    // tapping anywhere on the card asks the next question (links inside it still work)
    var phCard = box.closest('.ab_bento-card') || box;
    phCard.style.cursor = 'pointer';
    phCard.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('a')) return; next(); }); keyAct(box, next);
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
    document.addEventListener('keydown', function(e){
      if (e.target && e.target.closest && e.target.closest('input, textarea, select, [data-badge]')) return;
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key; ki = k === K[ki] ? ki + 1 : (k === K[0] ? 1 : 0);
      if (ki < K.length) return; ki = 0;
      LV.n += 30; if (LV.el) LV.el.textContent = 'LV ' + LV.n;
      toast('Cheat code accepted · +30 levels · warp drive overclocked');
      var o = document.createElement('div'); o.className = 'ab_konami'; o.innerHTML = '<b>+30 lives</b>'; document.body.appendChild(o);
      function done(){ if (o.parentNode) o.parentNode.removeChild(o); }
      if (reduce || !hasGsap){ setTimeout(done, 1500); return; }
      gsap.timeline({ onComplete: done }).from(o.firstChild, { scale: .4, opacity: 0, duration: .5, ease: 'back.out(2)' }).to(o.firstChild, { opacity: 0, y: -40, duration: .6, delay: .8 });
      if (sf && sf.state) gsap.timeline().to(sf.state, { warp: .8, duration: .5, ease: 'power2.in' }).to(sf.state, { warp: 0, duration: 1.2, ease: 'power2.out' });
      // the cheat also skips straight to the boss
      if (!LV.beaten && LV.boss) setTimeout(LV.boss, 1700);
    });
  })();

  /* ---------- bookshelf: knock a book off (colors + heights come from data attributes) ---------- */
  (function(){
    var shelf = $('[data-shelf]'); if (!shelf) return;
    var note = $('[data-shelf-note]', shelf), nt;
    $$('[data-book]', shelf).forEach(function(b){
      var c = b.getAttribute('data-c'), h = b.getAttribute('data-h'), fg = b.getAttribute('data-fg');
      if (c) b.style.backgroundColor = c; if (h) b.style.height = h + 'px'; if (fg) b.style.color = fg;
      b.setAttribute('aria-label', (b.getAttribute('data-g') || 'Book') + '. Knock it off the shelf.');
      function knock(){
        if (note){ note.innerHTML = '<b>' + esc(b.getAttribute('data-g') || '') + '</b>' + esc(b.getAttribute('data-note') || 'Always one on the nightstand.'); note.classList.add('show'); clearTimeout(nt); nt = setTimeout(function(){ note.classList.remove('show'); }, 2600); }
        if (reduce || !hasGsap || b.__busy) return;
        b.__busy = true; b.classList.add('is-out');
        gsap.timeline({ onComplete: function(){ b.__busy = false; b.classList.remove('is-out'); gsap.set(b, { clearProps: 'transform' }); } })
          .to(b, { y: -18, duration: .2, ease: 'power2.out' })
          .to(b, { rotation: 78, x: 14, y: 12, duration: .5, ease: 'bounce.out', transformOrigin: '100% 100%' })
          .to(b, { rotation: 0, x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.6)', delay: 1.1 });
      }
      b.addEventListener('click', knock); keyAct(b, knock);
    });
  })();
