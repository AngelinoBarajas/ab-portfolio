  /* ---------- Tools orbit + transmission (moved from ab-home 2026-10-06: both sections now live on About;
     each block skips itself when its section is not on the page) ---------- */
  /* ---------- orbit (Tools Collection List → chips on two rings), shared system in ab-core ---------- */
  // built when it comes within a screen of the viewport (perf pass 2026-10-04); the orbit box is sized by CSS
  if ($('#orbit')) AB.near($('#orbit'), function(){ AB.orbit($('#orbit'), $('#toolReadout')); });

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
