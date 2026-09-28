/*! AB Portfolio · ab-about v0.28.12 · github.com/AngelinoBarajas/ab-portfolio */
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
      function end(){ if (!drag) return; drag = false; p.style.cursor = ''; if (AB.quest) AB.quest('spin');  if (hasGsap) gsap.to(p, { rotation: 0, duration: 1.4, ease: 'elastic.out(1,.4)', overwrite: 'auto' }); }
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
      qi = (qi + 1) % QS.length; if (qi === 0) if (AB.quest) AB.quest('questions');  if (qN) qN.textContent = 'Question ' + pad2(qi + 1);
      if (reduce || !hasGsap || !window.ScrambleTextPlugin){ qT.textContent = QS[qi]; return; }
      gsap.to(qT, { duration: .8, scrambleText: { text: QS[qi], chars: '?!/_<>', speed: .6 } });
      if (mark) gsap.fromTo(mark, { rotation: -20 }, { rotation: 0, duration: .8, ease: 'elastic.out(1,.4)' });
    }
    // tapping anywhere on the card asks the next question (links inside it still work)
    var phCard = box.closest('.ab_bento-card') || box;
    phCard.style.cursor = 'var(--hand, pointer)';
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
    $$('[data-book]', shelf).forEach(function(b){
      var c = b.getAttribute('data-c'), h = b.getAttribute('data-h'), fg = b.getAttribute('data-fg');
      if (c) b.style.backgroundColor = c; if (h) b.style.height = h + 'px'; if (fg) b.style.color = fg;
      b.setAttribute('aria-label', (b.getAttribute('data-g') || 'Book') + '. Knock it off the shelf.');
      function knock(){
        if (AB.quest) AB.quest('book'); 
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

  /* ===== about/10-boss.js ===== */
  /* =========================================================
     PLAYER ONE · secret: reach LV 20 (or enter the cheat) and the card opens a boss fight. Letterbox + a VS title card,
     then you fly it: arrows or WASD to move, Space to fire (phones: drag to fly, hold to fire). THE SCOPE CREEP drifts,
     fires aimed shots, telegraphs a beam you have to dodge, and enrages at half health (spread shots). Three shields;
     lose them and you retry. The last hit plays an anime-style finisher (cut-in, move name, mega beam, impact frames),
     then "You won" and a credits crawl. Optional sound: all of it synthesized live (Web Audio), off until the visitor
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
    var CREDITS = [
      ['A game by', 'Angelino Barajas'],
      ['Pilot · designer · developer', 'Angelino Barajas'],
      ['Crew', 'Two moons: wife + son'],
      ['Fuel', 'Coffee. A lot of coffee.'],
      ['Currently reading', 'Thus Spoke Zarathustra'],
      ['Favorite film', 'Interstellar'],
      ['Final boss', 'The Scope Creep'],
      ['Built with', 'Figma · Webflow · GSAP · Lenis'],
      ['Special thanks', 'You, Player One'],
      ['', 'No scope was harmed in the making of this website.']
    ];

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

    // anime cut-in art: the pilot's helmet up close, one sharp eye behind the visor, the AB mark on the shell
    function pilotArt(){
      var mark = AB.markSVG ? AB.markSVG({ cls: 'ab_boss_pilot-mark' }).replace('<svg ', '<svg x="160" y="262" width="80" height="40" ') : '';
      return '<svg class="ab_boss_pilot" viewBox="0 0 420 320" aria-hidden="true">' +
        '<defs><linearGradient id="abxVisor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2f55"/><stop offset=".55" stop-color="#0b0c14"/><stop offset="1" stop-color="#1d2350"/></linearGradient></defs>' +
        // shell + ink outline, hard cel shadow on the right
        '<circle cx="200" cy="176" r="150" fill="#F2F0EA" stroke="#07080d" stroke-width="9"/>' +
        '<path d="M318 86a150 150 0 0 1-40 226a172 172 0 0 0 40-226z" fill="#c9c7c0"/>' +
        '<path d="M60 124c40-70 150-92 238-44" fill="none" stroke="#FF6A3D" stroke-width="16" stroke-linecap="round"/>' +
        // visor
        '<path d="M70 150c10-44 60-66 138-66s132 22 142 62c8 34-10 78-54 92c-40 13-130 14-176 0c-40-12-58-50-50-88z" fill="url(#abxVisor)" stroke="#07080d" stroke-width="8"/>' +
        // the eye: angled brow, heavy upper lid, orange iris, two highlights
        '<path d="M150 132l84 18" stroke="#F2F0EA" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M146 170c22-20 64-24 94-4" fill="none" stroke="#F2F0EA" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M156 170c10 22 58 26 76 2" fill="#07080d"/>' +
        '<circle cx="196" cy="176" r="17" fill="#FF6A3D"/><circle cx="196" cy="178" r="8" fill="#07080d"/>' +
        '<circle cx="190" cy="170" r="5" fill="#fff"/><circle cx="203" cy="184" r="2.4" fill="#fff"/>' +
        // visor reflections: two glass streaks and a ringed planet
        '<path d="M98 132l40-34M112 150l52-46" stroke="rgba(255,255,255,.35)" stroke-width="7" stroke-linecap="round"/>' +
        '<circle cx="296" cy="200" r="15" fill="#FF6A3D" opacity=".85"/><ellipse cx="296" cy="200" rx="30" ry="7" fill="none" stroke="#ffd166" stroke-width="3" opacity=".8" transform="rotate(-18 296 200)"/>' +
        // speed hatching on the shadow side
        '<path d="M330 120l40-12M338 150l48-8M340 182l52 0M336 214l46 10" stroke="#07080d" stroke-width="5" stroke-linecap="round"/>' +
        mark +
        '<g class="ab_boss_glint"><path d="M190 146l4 20 20 4-20 4-4 20-4-20-20-4 20-4z" fill="#fff"/></g>' +
        '</svg>';
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
        '<div class="ab_boss_cut" aria-hidden="true"><div class="ab_boss_lines"></div>' +
          '<div class="ab_boss_panel"><div class="ab_boss_panel-in">' + pilotArt() + '<div class="ab_boss_panel-tx"><small>パイロット</small><b>Angelino</b></div></div></div>' +
          '<div class="ab_boss_move"><small>必殺技</small><b>Final deploy</b></div></div>' +
        '<div class="ab_boss_win"><b>You won</b><p>LV ' + LV.BOSS + ' · The Scope Creep is defeated. The project shipped on time, on budget, and nobody asked for “just one more thing.”</p></div>' +
        '<div class="ab_boss_crawl" aria-hidden="true"><div class="ab_boss_tilt"><div class="ab_boss_crawl-in">' +
          CREDITS.map(function(c){ return '<div class="ab_boss_cr">' + (c[0] ? '<small>' + esc(c[0]) + '</small>' : '') + '<span>' + esc(c[1]) + '</span></div>'; }).join('') +
          '<div class="ab_boss_cr is-end"><span>The end</span><small>Tap anywhere to return</small></div></div></div></div>' +
        '<div class="ab_boss_bar is-t" aria-hidden="true"></div><div class="ab_boss_bar is-b" aria-hidden="true"></div>' +
        '<div class="ab_boss_flash" aria-hidden="true"></div>' +
        '<ul class="ab_sr">' + CREDITS.map(function(c){ return '<li>' + esc((c[0] ? c[0] + ': ' : '') + c[1]) + '</li>'; }).join('') + '</ul>';
      document.body.appendChild(o);
      if (lenis) lenis.stop(); root.style.overflow = 'hidden';
      var closeBtn = $('.ab_boss_x', o), sndBtn = $('.ab_boss_snd', o), prevFocus = document.activeElement, tl = null, ended = false;
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
        stopGame(); isOver = true; clearBullets(); if (beamSt) hideBeam(); SFX.loopStop(); SFX.boom();
        gsap.to(ship, { opacity: 0, scale: 1.8, duration: .5, ease: 'power2.out' });
        gsap.set(over, { visibility: 'visible' }); gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: .4, delay: .5 });
      }
      function retry(){
        if (!isOver) return; isOver = false;
        gsap.to(over, { opacity: 0, duration: .25, onComplete: function(){ gsap.set(over, { visibility: 'hidden' }); } });
        SFX.loopStart(); startGame();
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
        stopGame(); clearBullets();
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
        o.classList.add('is-still'); win.style.opacity = 1; crawl.style.opacity = 1; hp.style.width = '0%'; ended = true; if (AB.quest) AB.quest('boss'); return;
      }
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

      /* ---------- the finisher: an anime cut-in, the move name, a mega beam and impact frames ---------- */
      function finish(){
        stopGame(); clearBullets(); if (beamSt) hideBeam(); hp.style.width = '2%'; hideHelp();
        SFX.loopStop(); SFX.hit();
        var cut = $('.ab_boss_cut', o), lines = $('.ab_boss_lines', o), panel = $('.ab_boss_panel', o), move = $('.ab_boss_move', o);
        var c = shipC(), shipTop = SB.y + sy;
        gsap.set(ship, { rotation: 0 });
        tl = gsap.timeline();
        tl.add(function(){ o.classList.add('is-freeze'); })
          .fromTo(flash, { opacity: .85 }, { opacity: 0, duration: .25 })
          .set(cut, { visibility: 'visible' })
          .fromTo(lines, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .25, ease: 'power2.out' }, '<')
          .add(function(){ SFX.shing(); }, '<')
          .fromTo(panel, { xPercent: -115 }, { xPercent: 0, duration: .38, ease: 'power4.out' }, '<')
          .fromTo($('.ab_boss_panel-tx', o), { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: 'back.out(2.5)' }, '-=.08')
          .fromTo($('.ab_boss_glint', o), { scale: 0, opacity: 0, rotation: -60, transformOrigin: '190px 166px' }, { scale: 1.4, opacity: 1, rotation: 30, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=.15')
          .to(panel, { xPercent: 115, duration: .26, ease: 'power4.in' }, '+=.5')
          .to(lines, { opacity: 0, duration: .2 }, '<')
          .add(function(){ o.classList.remove('is-freeze'); SFX.charge(); gsap.set(arena, { transformOrigin: c.x + 'px ' + c.y + 'px' }); gather(c); })
          .to(arena, { scale: 1.55, duration: 1.1, ease: 'power2.inOut' })
          .to(ship, { filter: 'brightness(2.2) drop-shadow(0 0 22px #FF6A3D)', duration: 1.1 }, '<')
          // the ship's lock drags the boss into its line of fire
          .to(mon, { x: c.x - MB.x - MB.w / 2, duration: 1.1, ease: 'power2.inOut' }, '<')
          .fromTo(move, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: .32, ease: 'back.out(2)' }, '-=.35')
          .add(function(){ SFX.blip(); shake(8); }, '<')
          .to(move, { opacity: 0, scale: .92, duration: .2 }, '+=.8')
          .to(arena, { scale: 1, duration: .16, ease: 'power3.in' }, '<')
          // fire: the beam runs from the ship to the top of the screen, straight through the boss
          .add(function(){
            mega.style.left = c.x + 'px'; mega.style.height = Math.max(0, shipTop + 6) + 'px';
            SFX.mega(); shake(34);
          })
          .fromTo(mega, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .1, ease: 'power2.out' })
          // impact frames: silhouette, invert, silhouette
          .add(function(){ o.classList.add('is-impact'); })
          .add(function(){ o.classList.remove('is-impact'); o.classList.add('is-invert'); }, '+=.08')
          .add(function(){ o.classList.remove('is-invert'); o.classList.add('is-impact'); }, '+=.07')
          .add(function(){ o.classList.remove('is-impact'); hp.style.width = '0%'; }, '+=.09')
          .to(mega, { scaleX: .7, duration: .06, yoyo: true, repeat: 5, ease: 'steps(1)' })
          .add(explode, '+=.05')
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
          .fromTo(crawlIn, { yPercent: 0, y: function(){ return crawl.offsetHeight; } }, { yPercent: -100, y: function(){ return crawl.offsetHeight * .35; }, duration: 22, ease: 'none', onComplete: function(){ ended = true; } });
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
        .fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .12, repeat: 5, yoyo: true, ease: 'steps(1)' })
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
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'abx-qlog';
    copy.appendChild(btn);
    var panel = null, badge = $('[data-badge]'), prevFocus = null;
    function N(){ return Q.list.length; }
    function paintBtn(){ btn.innerHTML = '✦ Quest log · <b>' + Q.count() + '/' + N() + '</b>'; btn.setAttribute('aria-label', 'Open the side quest log, ' + Q.count() + ' of ' + N() + ' found'); }
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
    document.addEventListener('ab:quest', function(){ paintBtn(); gold(); render(); });
    paintBtn(); gold();
  })();

});
