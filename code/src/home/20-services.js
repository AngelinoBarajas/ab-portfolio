
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
      var lo = 0, hi = 1;
      function Y(val){ return 108 - (val - lo) / (hi - lo) * 96; }
      function play(){
        var E = gsap.parseEase(eases[ei]), d = '';
        lo = 0; hi = 1; for (var j = 0; j <= 100; j++){ var ev = E(j / 100); lo = Math.min(lo, ev); hi = Math.max(hi, ev); }
        $('path', v).setAttribute('d', 'M0 ' + Y(0) + 'H200M0 ' + Y(1) + 'H200');
        for (var i = 0; i <= 60; i++){ var t = i / 60; d += (i ? 'L' : 'M') + (t * 200).toFixed(1) + ' ' + Y(E(t)).toFixed(1); }
        cv.setAttribute('d', d); btn.textContent = eases[ei] + ' ↻';
        var o = { t: 0 }; if (tw) tw.kill();
        tw = gsap.to(o, { t: 1, duration: 1.6, ease: 'none', repeat: -1, repeatDelay: .6, onUpdate: function(){ var e = E(o.t); dt.setAttribute('cx', o.t * 200); dt.setAttribute('cy', Y(e)); sq.style.bottom = ((e - lo) / (hi - lo) * (tr.clientHeight - 14)) + 'px'; } });
        if (reduce) tw.progress(1).pause();
      }
      function next(){ ei = (ei + 1) % eases.length; play(); }
      btn.addEventListener('click', next); $('svg', v).addEventListener('click', next); $('svg', v).style.cursor = 'pointer';
      play();
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
