
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
    /* the receiving dish (wide screens): it turns toward each new transmission's source, the waveform is noise while
       the quote decodes and settles into a clean carrier, and the readout names the source */
    var dish = (function(){
      var inner = $('.ab_transmission_inner'); if (!inner) return null;
      var el = document.createElement('div'); el.className = 'abt-dish'; el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<svg class="abt-sky" viewBox="0 0 400 400"><defs><linearGradient id="abtBowl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4060"/><stop offset="1" stop-color="#12152a"/></linearGradient></defs>' +
        '<path class="abt-ground" d="M20 386H380"/><path class="abt-beam" d="M0 0L0 0"/>' +
        '<g class="abt-src"><circle class="abt-ring" r="10"/><circle class="abt-ring is-2" r="10"/><circle class="abt-star" r="3.2"/></g>' +
        '<path class="abt-mount" d="M166 386L200 300L234 386M178 356H222"/><rect class="abt-base" x="150" y="382" width="100" height="6"/>' +
        '<g class="abt-bowl"><path class="abt-bowl-b" d="M122 282Q200 340 278 282Q200 306 122 282Z"/><path class="abt-rim" d="M122 282Q200 306 278 282"/>' +
        '<path class="abt-strut" d="M136 290L200 214M264 290L200 214"/><rect class="abt-feed" x="195" y="206" width="10" height="12"/><circle class="abt-rx" cx="200" cy="212" r="3"/><circle class="abt-hub" cx="200" cy="300" r="5"/></g></svg>' +
        '<div class="abt-read"><div class="abt-read-k"><span>RX</span><b class="abt-src-t"></b></div><svg class="abt-wave" viewBox="0 0 300 48" preserveAspectRatio="none"><path d="M0 24H300"/></svg>' +
        '<div class="abt-read-k"><span>Decoded</span><b class="abt-pct">000%</b></div><i class="abt-bar"><i></i></i></div>';
      inner.appendChild(el);
      var bowl = $('.abt-bowl', el), src = $('.abt-src', el), beam = $('.abt-beam', el), wave = $('.abt-wave path', el), pct = $('.abt-pct', el), bar = $('.abt-bar i', el), srcT = $('.abt-src-t', el);
      var st = { noise: 0, dec: 1, ang: 0 }, sx = 300, sy = 70, t = 0, running = false;
      function feed(){ var a = st.ang * Math.PI / 180, dx = 0, dy = -88; return [200 + dx * Math.cos(a) - dy * Math.sin(a), 300 + dx * Math.sin(a) + dy * Math.cos(a)]; }
      function draw(){
        var f = feed(), d = '';
        beam.setAttribute('d', 'M' + sx.toFixed(1) + ' ' + sy.toFixed(1) + 'L' + f[0].toFixed(1) + ' ' + f[1].toFixed(1));
        bowl.setAttribute('transform', 'rotate(' + st.ang.toFixed(2) + ' 200 300)');
        for (var x = 0; x <= 300; x += 5){ var e = Math.sin(x / 300 * Math.PI), y = 24 + Math.sin(x * .09 + t * 3) * 7 * e + (Math.random() - .5) * 34 * st.noise * e; d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1); }
        wave.setAttribute('d', d);
        var p = Math.round(st.dec * 100); pct.textContent = (p < 10 ? '00' : p < 100 ? '0' : '') + p + '%'; bar.style.transform = 'scaleX(' + st.dec + ')';
      }
      if (hasGsap && !reduce) gsap.ticker.add(function(time, dt){ if (!running) return; t += dt / 1000; draw(); });
      return {
        on: function(v){ running = v; },
        tune: function(q, dur){
          srcT.textContent = q.c || q.a;
          sx = 60 + Math.random() * 280; sy = 26 + Math.random() * 110;
          src.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
          var ang = Math.max(-55, Math.min(55, Math.atan2(sx - 200, 300 - sy) * 180 / Math.PI));
          if (!hasGsap || reduce){ st.ang = ang; st.noise = 0; st.dec = 1; t = 0; draw(); return; }
          gsap.killTweensOf(st);
          gsap.to(st, { ang: ang, duration: 1.1, ease: 'power3.inOut' });
          gsap.fromTo(st, { noise: 1, dec: 0 }, { noise: 0, dec: 1, duration: dur, ease: 'power1.in', delay: .15 });
          el.classList.remove('is-rx'); void el.offsetWidth; el.classList.add('is-rx');
          draw();
        }
      };
    })();
    function render(i, reveal){
      var q = QUOTES[i]; idx = i;
      $('#iqIdx').textContent = pad2(i + 1);
      textEl.classList.toggle('long', q.t.length > 80);
      textEl.innerHTML = ''; q.t.split(/\s+/).forEach(function(w, k){ if (k) textEl.appendChild(document.createTextNode(' ')); var s = document.createElement('span'); s.className = 'qw'; s.textContent = w; textEl.appendChild(s); });
      byEl.textContent = q.a + ' · ' + q.c;
      if (dish) dish.tune(q, reveal === 'scrub' ? 1.6 : .6 + q.t.split(/\s+/).length * .05);
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
        if (window.ScrambleTextPlugin) words.forEach(function(w, k){ var txt = w.textContent; gsap.fromTo(w, { opacity: .35 }, { opacity: 1, duration: .5, delay: k * .05, scrambleText: { text: txt, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+', speed: .6, revealDelay: .15 } }); });
        else gsap.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
        gsap.fromTo(byEl, { opacity: 0 }, { opacity: 1, duration: .5, delay: .3 + words.length * .05 });
      }
    }
    render(0, 'scrub');
    function next(){ if (scrub){ scrub.kill(); scrub = null; } render((idx + 1) % QUOTES.length, 'pop'); }
    // transmissions change by themselves while the section is on screen (paused on hover); longer quotes stay up longer
    var auto = null, seen = false, held = false;
    function queue(){ clearTimeout(auto); if (reduce || !hasGsap || !seen || held || QUOTES.length < 2) return; auto = setTimeout(function(){ next(); queue(); }, 4200 + QUOTES[idx].t.length * 30); }
    onView(box, function(x){ seen = x; if (dish) dish.on(x); if (x) queue(); else clearTimeout(auto); });
    box.addEventListener('mouseenter', function(){ held = true; clearTimeout(auto); });
    box.addEventListener('mouseleave', function(){ held = false; queue(); });
    $('#iqNext').addEventListener('click', function(){ next(); queue(); });
  })();
