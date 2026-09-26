  /* =========================================================
     CONTACT · interactions
     ========================================================= */
  (function(){
    var page = $('.ct-page'); if (!page) return;
    var hero = $('#channel'), form = $('#ctForm'), band = $('#ctBand'), needle = $('#ctNeedle'), aim = $('#ctAim');
    var marks = $$('.ct-mark'), chips = $$('.ct-chip'), wave = $('#ctWave'), packet = $('#ctPacket');
    var cur = 0, freq = STATIONS[0].f, energy = 0, noise = 0, bump = null, tw = null;


    /* ---------- tuner ---------- */
    function nearest(f){ var b = 0; STATIONS.forEach(function(s, i){ if (Math.abs(s.f - f) < Math.abs(STATIONS[b].f - f)) b = i; }); return b; }
    function setFreq(f){
      freq = Math.max(F0, Math.min(F1, f));
      needle.style.left = fPct(freq) + '%';
      $('#ctFreq').textContent = freq.toFixed(1); $('#ctScopeF').textContent = freq.toFixed(1) + ' MHz';
      var d = Math.abs(STATIONS[nearest(freq)].f - freq);
      noise = Math.min(1, d / 1.2);
    }
    function pick(i, quiet){
      cur = i; var s = STATIONS[i];
      page.style.setProperty('--ch', s.c);
      chips.forEach(function(b, j){ b.setAttribute('aria-pressed', j === i); });
      marks.forEach(function(m, j){ m.classList.toggle('is-on', j === i); });
      $('#ctCh').textContent = 'CH-0' + (i + 1); $('#ctReason').value = s.v; $('#ctSentF').textContent = s.f.toFixed(1);
      $('#ctMsgL').textContent = s.l; $('#ctMsg').placeholder = s.ph; $('#ctHint').innerHTML = s.hint;
      noise = 0;
      if (quiet || reduce || !hasGsap){ setFreq(s.f); }
      else { var o = { f: freq }; if (tw) tw.kill(); tw = gsap.to(o, { f: s.f, duration: .55, ease: 'power3.out', onUpdate: function(){ setFreq(o.f); }, onComplete: function(){ noise = 0; lock(); } }); }
      meter();
    }
    chips.forEach(function(b){ b.addEventListener('click', function(){ pick(+b.dataset.i); }); });
    // drag the needle along the band; static between stations, snaps on release
    var dragging = false;
    function fromX(x){ var r = band.getBoundingClientRect(); return F0 + (F1 - F0) * Math.max(0, Math.min(1, (x - r.left) / r.width)); }
    band.addEventListener('pointerdown', function(e){ dragging = true; band.classList.add('is-drag'); band.setPointerCapture(e.pointerId); if (tw) tw.kill(); setFreq(fromX(e.clientX)); energy = Math.max(energy, .4); });
    band.addEventListener('pointermove', function(e){ if (!dragging) return; setFreq(fromX(e.clientX)); var n = nearest(freq); $('#ctFreq').textContent = freq.toFixed(1); marks.forEach(function(m, j){ m.classList.toggle('is-on', j === n && noise < .35); }); });
    function release(){ if (!dragging) return; dragging = false; band.classList.remove('is-drag'); pick(nearest(freq)); }
    band.addEventListener('pointerup', release); band.addEventListener('pointercancel', release);

    /* ---------- signal meter: fills as the transmission gets readable ---------- */
    var bars = $$('#ctMeter i'), WORDS = ['No signal', 'Faint', 'Weak', 'Fair', 'Strong', 'Locked'];
    function score(){
      var m = form.Message.value.trim().length;
      return 1 + (form.Name.value.trim() ? 1 : 0) + (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email.value.trim()) ? 1 : 0) + (m >= 8 ? 1 : 0) + (m >= 60 ? 1 : 0);
    }
    function meter(){ var n = score(); bars.forEach(function(b, i){ b.classList.toggle('is-on', i < n); }); $('#ctMeterT').textContent = WORDS[n]; }
    $$('.ct-in', form).forEach(function(inp){ inp.addEventListener('input', function(){ energy = Math.min(1.2, energy + .18); meter(); $('#ctErr').textContent = ''; }); });

    /* ---------- the dish: aims at the cursor, scans slowly on touch ---------- */
    var ang = -14, target = -14, az = $('#ctAz'), pointerSeen = false;
    function setAim(a){ ang = a; aim.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' 390 330)'); az.textContent = 'az ' + Math.round(208 + a) + '°'; }
    if (!coarse) hero.addEventListener('pointermove', function(e){
      var svg = $('.ct-dish'), m = svg.getScreenCTM(); if (!m) return;
      var px = m.a * 390 + m.c * 330 + m.e, py = m.b * 390 + m.d * 330 + m.f;
      var deg = Math.atan2(e.clientY - py, e.clientX - px) * 180 / Math.PI;   // 180 = straight left
      var rel = deg > 0 ? deg - 180 : deg + 180;                              // 0 = straight left, negative = up
      target = Math.max(-40, Math.min(22, rel)); pointerSeen = true;
    });
    // rings: pulse out along the cone
    function rings(n){
      if (reduce || !hasGsap) return;
      gsap.fromTo($$('.ct-rings path').slice(0, n || 3), { x: 0, scale: .6, opacity: .9, transformOrigin: '50% 50%' }, { x: -760, scale: 3.2, opacity: 0, duration: 1.5, ease: 'power2.out', stagger: .16 });
    }
    function lock(){ rings(1); energy = Math.max(energy, .6); }

    /* ---------- oscilloscope ---------- */
    var N = 160, t = 0, running = false, visible = true, last = 0;
    function draw(){
      var A = 5 + energy * 26, d = '';
      for (var i = 0; i <= N; i++){
        var x = i / N * 1000, env = Math.sin(Math.PI * i / N);
        var y = A * env * (Math.sin(x * .031 + t * 2.2) + .45 * Math.sin(x * .083 - t * 3.3));
        if (noise > .02) y += (Math.random() - .5) * 70 * noise * env;
        if (bump) y += bump.a * Math.exp(-Math.pow((x - bump.x) / 34, 2)) * Math.sin(x * .25 - t * 18);
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (50 + y).toFixed(1);
      }
      wave.setAttribute('d', d);
    }
    function loop(now){
      if (!running) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now; t += dt;
      energy += (0 - energy) * Math.min(1, dt * 1.4);
      if (!pointerSeen) target = -14 + Math.sin(t * .35) * 9;
      setAim(ang + (target - ang) * Math.min(1, dt * 4));
      draw();
      requestAnimationFrame(loop);
    }
    function run(on){ if (on === running) return; running = on; last = 0; if (on) requestAnimationFrame(loop); }
    if (reduce){ draw(); setAim(-14); }
    else {
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; run(visible && !document.hidden); }).observe(hero);
      document.addEventListener('visibilitychange', function(){ run(visible && !document.hidden); });
      run(true);
    }

    /* ---------- transmit (prototype: no network; Webflow Forms posts it on the live page) ---------- */
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var err = $('#ctErr'), email = form.Email.value.trim();
      if (!form.Name.value.trim()){ err.textContent = 'Add your name so I know who\'s calling.'; form.Name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err.textContent = 'That email looks off. Mind checking it?'; form.Email.focus(); return; }
      if (form.Message.value.trim().length < 2){ err.textContent = 'Add a line or two so the signal has something to carry.'; form.Message.focus(); return; }
      err.textContent = '';
      function done(){ form.classList.add('is-sent'); toast('Signal received · ' + STATIONS[cur].f.toFixed(1) + ' · ' + STATIONS[cur].k); $('#ctAgain').focus({ preventScroll: true }); }
      if (reduce || !hasGsap){ done(); return; }
      $('#ctGoL').textContent = 'Transmitting…';
      // the packet rides the scope from the form to the dish, then the dish fires
      var sw = $('#ctScopeWrap').getBoundingClientRect(), fr = form.getBoundingClientRect(), dr = $('.ct-dish').getBoundingClientRect();
      var x0 = (fr.left + fr.width * .5 - sw.left) / sw.width * 1000, x1 = Math.min(1000, (dr.left + dr.width * .4 - sw.left) / sw.width * 1000);
      bump = { x: x0, a: 0 };
      gsap.timeline({ onComplete: function(){ bump = null; $('#ctGoL').textContent = 'Transmit'; } })
        .set(packet, { opacity: 1, left: (x0 / 10) + '%' })
        .to(bump, { a: 26, duration: .2 }, 0)
        .to(bump, { x: x1, duration: 1, ease: 'power2.inOut' }, 0)
        .to(packet, { left: (x1 / 10) + '%', duration: 1, ease: 'power2.inOut' }, 0)
        .to(packet, { opacity: 0, scale: 2.2, duration: .25 }, .95)
        .add(function(){ energy = 1.2; rings(3); }, .95)
        .add(done, 1.35).set(packet, { scale: 1 });
    });
    $('#ctAgain').addEventListener('click', function(){ form.reset(); form.classList.remove('is-sent'); pick(cur, true); meter(); form.Name.focus(); });

    /* ---------- other channels ---------- */
    $('#ctEmail').addEventListener('click', function(){
      var em = S0.email;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(em).then(function(){ toast('Copied to clipboard ✓'); }, function(){ toast(em); }); else toast(em);
    });
    var clk = $('#ctClock'); function tick(){ clk.textContent = fmt.format(new Date()); } tick(); setInterval(tick, 15000);
    $$('.ct-social a').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); toast('Add your profile links in Site Settings.'); }); });
    $$('[data-station]').forEach(function(a){ a.addEventListener('click', function(e){
      e.preventDefault(); var i = +a.dataset.station;
      function go(){ pick(i); setTimeout(function(){ form.Message.focus({ preventScroll: true }); }, 700); }
      if (lenis) lenis.scrollTo(form, { offset: -120, onComplete: go }); else { form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); go(); }
    }); });

    /* ---------- entry: /contact#call (Nav + hub "Book a call") preselects the voice channel ---------- */
    var start = location.hash === '#call' ? 1 : 0;
    var shot = document.documentElement.getAttribute('data-shot');
    if (shot){ var hide = true; $$('#contact > section').forEach(function(s){ if (s.dataset.frame === shot) hide = false; if (hide) s.style.display = 'none'; }); }
    pick(start, true); meter();
  })();
