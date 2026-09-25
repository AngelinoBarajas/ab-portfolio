  /* =========================================================
     PROCESS · interactions
     ========================================================= */
  (function(){
    var page = $('.pr-page'); if (!page) return;
    var cur = 0, KEY = 'ab:dest';
    try { var saved = +localStorage.getItem(KEY); if (saved >= 0 && saved < DEST.length) cur = saved; } catch (e){}

    // swap a planet's look in place (keeps its Draggable + position)
    function repaint(el, d, seed){
      el.innerHTML = ''; el.__built = false; el.__body = null;
      el.setAttribute('data-planet', d.p[0]); el.setAttribute('data-colors', d.p[1]); el.setAttribute('data-glow', d.p[3]); el.setAttribute('data-seed', seed);
      if (d.p[2]){ el.setAttribute('data-ring', d.p[2]); el.setAttribute('data-tilt', '-16'); } else { el.removeAttribute('data-ring'); }
      buildPlanet(el);
    }

    /* ---------- pick a destination: everything re-plots ---------- */
    function pick(i, quiet){
      cur = i; var d = DEST[i];
      try { localStorage.setItem(KEY, i); } catch (e){}
      page.style.setProperty('--dest', d.c);
      $$('.pr-dest').forEach(function(b, j){ b.classList.toggle('is-on', j === i); b.setAttribute('aria-checked', j === i); });
      $$('.pr-chip').forEach(function(b, j){ b.setAttribute('aria-pressed', j === i); });
      $('#prHeroDest').textContent = d.short; $('#prPanelShort').textContent = d.short; $('#prFormDest').textContent = d.short;
      $('#prDestField').value = d.t1 + ' ' + d.t2;
      $('#prPanelT').innerHTML = '<span>' + esc(d.t1) + '</span><span class="t-outline">' + esc(d.t2) + '</span>';
      $('#prPanelS').textContent = d.sum;
      $('#prPanelPlan').innerHTML = d.plan.map(function(p, k){ return '<li>Stage 0' + (k + 1) + '<b>' + esc(p) + '</b></li>'; }).join('');
      $('#prPanelLink').href = SVC + d.slug;
      var hp = $('#prHeroPlanet'); hp.setAttribute('data-label', 'Destination · ' + d.short); repaint(hp, d, 11 + i);
      // route legs + "flown before" links
      $$('.pr-wp').forEach(function(w, k){
        $('.pr-leg-h', w).textContent = 'For ' + d.short;
        var t = $('.pr-leg-t', w);
        if (quiet || reduce || !hasGsap) t.textContent = d.legs[k];
        else gsap.to(t, { duration: .6, scrambleText: { text: d.legs[k], chars: 'lowerCase', speed: .6 }, delay: k * .04 });
        var a = $('.pr-flown', w);
        if (d.flown){ a.classList.remove('is-none'); a.href = MIS + d.flown[0]; a.innerHTML = 'See ' + STAGES[k].flown + ' · ' + esc(d.flown[1]) + ' <span aria-hidden="true">→</span>'; }
        else { a.classList.add('is-none'); a.removeAttribute('href'); a.textContent = 'No mission flown here yet · yours could be first'; }
      });
      // timeline presets for this destination
      d.eta.forEach(function(v, f){ setFactor(f, v); });
      eta(quiet);
      if (!quiet) toast('Course plotted · ' + d.t1 + ' ' + d.t2);
    }
    $$('.pr-dest').forEach(function(b){
      b.addEventListener('click', function(){ pick(+b.dataset.i); });
      b.addEventListener('keydown', function(e){
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!n) return;
        e.preventDefault(); var j = (cur + n + DEST.length) % DEST.length; pick(j); $$('.pr-dest')[j].focus();
      });
    });
    $$('.pr-chip').forEach(function(b){ b.addEventListener('click', function(){ pick(+b.dataset.i); }); });

    /* ---------- what moves the timeline ---------- */
    var fv = FACTORS.map(function(){ return 1; });
    function setFactor(f, v){ fv[f] = v; $$('.pr-seg button[data-f="' + f + '"]').forEach(function(b){ b.setAttribute('aria-pressed', +b.dataset.v === v); }); }
    var arc = $('#prArc'), arcLen = arc.getTotalLength(); arc.style.strokeDasharray = arcLen; arc.style.strokeDashoffset = arcLen;
    var BUCKETS = [
      ['Short hop', 'Fewer moving parts and fewer stops. The route goes almost straight from brief to launch.'],
      ['Standard orbit', 'A full route with every waypoint. Most missions fly this one.'],
      ['Deep-space mission', 'More stops, more people and more custom pieces. Worth it, and planned for from day one.']
    ];
    function eta(instant){
      var total = fv.reduce(function(a, b){ return a + b; }, 0), max = FACTORS.length * 2, r = total / max;
      var b = r < .34 ? 0 : r < .67 ? 1 : 2;
      $('#prEtaT').textContent = BUCKETS[b][0]; $('#prEtaP').textContent = BUCKETS[b][1];
      $('#prAdds').innerHTML = fv.map(function(v, f){ return v === 2 ? '<span>+ ' + FACTORS[f].k + '</span>' : ''; }).join('') || '<span style="border-color:var(--hair2);color:var(--dust)">Nothing stretching it</span>';
      var off = arcLen * (1 - Math.max(.04, r)), rot = -90 + 180 * r;
      if (instant || reduce || !hasGsap){ arc.style.strokeDashoffset = off; $('#prNeedle').setAttribute('transform', 'rotate(' + rot + ' 150 150)'); }
      else { arc.style.strokeDashoffset = off; gsap.to('#prNeedle', { rotation: rot, svgOrigin: '150 150', duration: .9, ease: 'elastic.out(1,.6)' }); }
    }
    $$('.pr-seg button').forEach(function(btn){ btn.addEventListener('click', function(){ setFactor(+btn.dataset.f, +btn.dataset.v); eta(); }); });

    /* ---------- the route: path, ship, pinned horizontal flight ---------- */
    var track = $('#prTrack'), svg = $('#prPath'), line = $('#prLine'), lit = $('#prLit'), ship = $('#prShip'), pad = $('#prPad');
    var wps = $$('.pr-wp'), nodes = $$('.pr-node'), hudN = $('#prHudN'), hudL = $('#prHudL'), countEl = $('#prCount');
    var pts = [], len = 0, st = null, wide = false, lastK = -2;
    function layout(){
      wide = innerWidth > 860;
      wps.forEach(function(w){ w.style.left = w.style.top = ''; });
      $$('.pr-node').forEach(function(n){ n.style.left = n.style.top = ''; });
      if (!wide){ track.style.width = ''; return; }
      var h = track.offsetHeight, step = Math.max(380, innerWidth * .3), x0 = Math.min(260, innerWidth * .18);
      var W = x0 + step * STAGES.length + innerWidth * .35;
      track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
      // the path waves inside a top band; every card hangs below its waypoint on a dashed tether
      var CARD_TOP = 200;
      pts = [[x0 * .45, 110]];
      STAGES.forEach(function(s, i){ pts.push([x0 + step * i + step * .35, i % 2 ? 140 : 60]); });
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 1; i < pts.length; i++){ var p = pts[i - 1], q = pts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
      d += ' S' + (W - 40) + ' 100 ' + W + ' 80';
      line.setAttribute('d', d); lit.setAttribute('d', d); len = line.getTotalLength();
      lit.style.strokeDasharray = len; lit.style.strokeDashoffset = len;
      pad.style.left = pts[0][0] + 'px'; pad.style.top = pts[0][1] + 'px';
      wps.forEach(function(w, i){
        var p = pts[i + 1];
        w.style.left = (p[0] - 48) + 'px'; w.style.top = CARD_TOP + 'px';
        w.style.setProperty('--ny', (p[1] - CARD_TOP) + 'px');
        nodes[i].style.left = '48px'; nodes[i].style.top = (p[1] - CARD_TOP) + 'px';
      });
    }
    function fly(prog){
      if (wide){
        var at = Math.max(0, Math.min(1, prog)) * len, p = line.getPointAtLength(at), p2 = line.getPointAtLength(Math.min(len, at + 2));
        ship.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI) + 'deg)';
        lit.style.strokeDashoffset = len - at;
        var k = -1; pts.slice(1).forEach(function(q, i){ if (p.x >= q[0] - 4) k = i; });
        stage(k);
      }
    }
    function stage(k){
      if (k === lastK) return; lastK = k;
      wps.forEach(function(w, i){ w.classList.toggle('is-on', i <= k); nodes[i].classList.toggle('is-on', i <= k); });
      var t = 6 - (k + 1);
      hudN.textContent = 'T−' + t; hudL.textContent = k < 0 ? 'On the pad' : STAGES[k].code + (k === 5 ? ' · liftoff' : '');
      countEl.innerHTML = 'T<b>−</b>' + t;
    }
    function build(){
      if (st){ st.kill(); st = null; gsap.set(track, { x: 0 }); }
      layout();
      if (!hasGsap || !window.ScrollTrigger) return;
      if (wide){
        var dist = function(){ return track.scrollWidth - innerWidth + 40; };
        st = ScrollTrigger.create({ trigger: '#route', start: 'top top', end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
          onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); fly(self.progress * 1.02); } });
        fly(0);
      } else {
        // vertical: the ship slides down the rail, waypoints light as they cross the middle
        st = ScrollTrigger.create({ trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true,
          onUpdate: function(self){ ship.style.transform = ''; ship.style.top = (self.progress * (track.offsetHeight - 40)) + 'px';
            var k = -1, mid = innerHeight * .6; wps.forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); stage(k); } });
      }
    }
    var rsT; addEventListener('resize', function(){ clearTimeout(rsT); rsT = setTimeout(function(){ build(); ScrollTrigger.refresh(); }, 250); });

    /* ---------- crew: boxes tick in as the lists scroll into view ---------- */
    $$('.pr-crew-col').forEach(function(col){
      var lis = $$('li', col);
      if (reduce || !('IntersectionObserver' in window)){ lis.forEach(function(li){ li.classList.add('is-on'); }); return; }
      var io = new IntersectionObserver(function(es){ if (!es[0].isIntersecting) return; io.disconnect(); lis.forEach(function(li, i){ setTimeout(function(){ li.classList.add('is-on'); }, 160 * i); }); }, { threshold: .5 });
      io.observe(col);
    });

    /* ---------- FAQ: one open at a time ---------- */
    $$('.pr-faq details').forEach(function(d){ d.addEventListener('toggle', function(){ if (d.open) $$('.pr-faq details').forEach(function(o){ if (o !== d) o.open = false; }); }); });

    /* ---------- launch form (prototype: no network; Webflow Forms posts it on the live page) ---------- */
    var form = $('#prForm');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = form.email.value.trim(), err = $('#prErr');
      if (!form.name.value.trim()){ err.textContent = 'Add your name so I know who to call.'; form.name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err.textContent = 'That email looks off. Mind checking it?'; form.email.focus(); return; }
      err.textContent = '';
      function done(){ form.classList.add('is-sent'); toast('Mission request sent · ' + DEST[cur].short); }
      if (reduce || !hasGsap){ done(); return; }
      gsap.timeline().set('#prRocket', { opacity: 1, y: 0 }).to('#prRocket', { y: -form.offsetHeight - 160, duration: 1.1, ease: 'power2.in' }).add(done, '-=.35').set('#prRocket', { opacity: 0 });
    });

    // anchors inside the page (hero CTAs, panel) scroll through Lenis
    $$('.pr-page a[href^="#"]').forEach(function(a){ a.addEventListener('click', function(e){ var t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); if (lenis) lenis.scrollTo(t, { offset: -20 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }); });

    // test-only (headless shots): ?at=<frame> hides the sections above it; ?p=0..1 sets the flight position
    var shot = document.documentElement.getAttribute('data-shot');
    if (shot){
      var q = new URLSearchParams(location.search), hide = true;
      $$('#process > section').forEach(function(s){ if (s.dataset.frame === shot) hide = false; if (hide) s.style.display = 'none'; });
      if (q.get('p')) setTimeout(function(){ var p = +q.get('p'); if (st) st.disable(false); gsap.set(track, { x: -(track.scrollWidth - innerWidth + 40) * p }); fly(p); }, 1500);
      if (q.get('d')) setTimeout(function(){ pick(+q.get('d'), true); }, 300);
    }
    // the chart sits right under the hero: build its planets now instead of waiting for the lazy observer
    $$('.pr-dest .pwrap, #prPad .pwrap').forEach(function(el){ buildPlanet(el); });
    pick(cur, true);
    // after fonts + planets settle
    setTimeout(build, 60);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  })();
