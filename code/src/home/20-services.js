
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
      // background stars scattered evenly (R2 sequence); (k * 97) % 290 stepped 1px every third star and drew three vertical lines
      var bg = ''; for (var k = 1; k <= 26; k++) bg += '<circle class="bg" cx="' + (5 + (k * .7548776 % 1) * 280).toFixed(1) + '" cy="' + (6 + (k * .5698403 % 1) * 138).toFixed(1) + '" r="' + (k % 4 ? .7 : 1.1) + '"/>';
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
