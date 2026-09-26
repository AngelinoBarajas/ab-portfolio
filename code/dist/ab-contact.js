/*! AB Portfolio · ab-contact v0.22.0 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abContactInit) return;
  window.__abContactInit = true;
  /* ===== contact/00-contact.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-contact] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, hasGsap = AB.hasGsap, coarse = AB.coarse, toast = AB.toast, esc = AB.esc;

  /* =========================================================
     CONTACT (/contact) · open a channel. The hero is the form: tune a frequency (the Reason field), write, transmit.
     Copy lives in the Designer: stations = hidden list [data-ct-stations] (freq, color, form value, chip label,
     message label, placeholder, hint). The form is a native Webflow Form (fields in an Embed); the script builds
     the tuner band + chips, the dish on its cliff, the signal line, the meter, and the transmit sequence, then
     hands the submit to Webflow Forms. /contact#call preselects Book a call (Nav + hub "Book a call").
     ========================================================= */
  var page = $('.section_contact-hero');
  if (!page) return;
  var ST = $$('[data-ct-stations] .ab_ct-station').map(function(s){
    var g = function(k){ var n = $('[data-' + k + ']', s); return n ? n : null; };
    return { f: parseFloat(s.getAttribute('data-f')) || 100, c: s.getAttribute('data-c') || '#FF6A3D', v: s.getAttribute('data-v') || '',
      k: g('k') ? g('k').textContent.trim() : '', l: g('l') ? g('l').textContent.trim() : '', ph: g('ph') ? g('ph').textContent.trim() : '',
      hint: g('hint') ? g('hint').innerHTML : '' };
  });
  if (!ST.length) return;
  var F0 = 100, F1 = 120;
  function fPct(f){ return ((f - F0) / (F1 - F0) * 100).toFixed(2); }

  /* ---------- the dish on its cliff (pivot 390,330; aims left, toward the form) ---------- */
  var dishMount = $('[data-ct-dish]');
  if (dishMount) dishMount.innerHTML = '<svg class="abc-dish" viewBox="0 0 600 720" aria-hidden="true">' +
    '<defs><linearGradient id="abcConeG" x1="1" x2="0" y1="0" y2="0"><stop offset="0" style="stop-color:var(--ch)" stop-opacity=".18"/><stop offset=".55" style="stop-color:var(--ch)" stop-opacity=".05"/><stop offset="1" style="stop-color:var(--ch)" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="abcFaceG" cx=".62" cy=".42" r=".75"><stop offset="0" stop-color="#262b48"/><stop offset="1" stop-color="#0b0d18"/></radialGradient>' +
      '<linearGradient id="abcBackG" x1="0" x2="1"><stop offset="0" stop-color="#1a1e34"/><stop offset="1" stop-color="#07080d"/></linearGradient>' +
      '<linearGradient id="abcCliffG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#171b33"/><stop offset=".45" stop-color="#0c0e1c"/><stop offset="1" stop-color="#07080d"/></linearGradient>' +
      '<linearGradient id="abcFadeG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".14" stop-color="#fff"/><stop offset=".34" stop-color="#000"/></linearGradient>' +
      '<mask id="abcCliffM" maskUnits="userSpaceOnUse" x="0" y="680" width="900" height="760"><rect x="0" y="680" width="900" height="760" fill="url(#abcFadeG)"/></mask></defs>' +
    '<g mask="url(#abcCliffM)"><path d="M236 712 L300 708 L420 711 L520 706 L640 710 L900 704 L900 1420 L60 1420 L92 1330 L70 1250 L118 1170 L104 1090 L150 1010 L138 930 L182 860 L170 790 L214 740 Z" fill="url(#abcCliffG)"/>' +
      '<g fill="none" stroke="rgba(255,255,255,.07)"><path d="M214 762 L330 752 L470 762 L620 754"/><path d="M176 880 L300 868 L420 882 L560 872 L720 880"/><path d="M142 1032 L280 1020 L430 1034 L600 1024"/><path d="M110 1190 L260 1178 L400 1192"/></g>' +
      '<path d="M236 712 L214 740 L170 790 L182 860 L138 930 L150 1010 L104 1090 L118 1170 L70 1250 L92 1330 L60 1420" fill="none" stroke="rgba(255,255,255,.14)"/>' +
      '<path d="M236 712 L300 708 L420 711 L520 706 L640 710 L900 704" fill="none" stroke="rgba(242,240,234,.38)" stroke-width="1.5"/>' +
      '<path d="M548 708 L560 694 L580 691 L596 706 Z M612 710 L620 702 L632 703 L638 710 Z" fill="#12152a" stroke="rgba(255,255,255,.18)"/></g>' +
    '<g fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.5"><path d="M362 470 L330 700 M418 470 L450 700 M362 470 H418"/><path d="M356 520 L436 590 M424 520 L344 590 M348 610 L440 680 M432 610 L340 680" stroke="rgba(255,255,255,.12)"/>' +
      '<path d="M372 470 L390 336 L408 470" stroke-width="3" stroke="rgba(255,255,255,.3)"/><rect x="300" y="700" width="180" height="10" fill="#0E1020"/></g>' +
    '<circle class="abc-beacon" cx="468" cy="694" r="3.5" fill="#FF6A3D"/>' +
    '<g class="abc-aim" transform="rotate(-14 390 330)">' +
      '<polygon class="abc-cone" points="120,330 -1400,-240 -1400,900" fill="url(#abcConeG)"/>' +
      '<g class="abc-rings" fill="none" stroke-width="3"><path d="M120 262 A 80 80 0 0 0 120 398"/><path d="M120 262 A 80 80 0 0 0 120 398"/><path d="M120 262 A 80 80 0 0 0 120 398"/></g>' +
      '<path d="M300 90 C 440 130 470 530 300 570 Z" fill="url(#abcBackG)" stroke="rgba(255,255,255,.18)"/>' +
      '<rect x="400" y="306" width="46" height="48" fill="#0E1020" stroke="rgba(255,255,255,.22)"/>' +
      '<ellipse cx="300" cy="330" rx="54" ry="240" fill="url(#abcFaceG)" stroke="#F2F0EA" stroke-width="2"/>' +
      '<g fill="none" stroke="rgba(255,255,255,.14)"><ellipse cx="300" cy="330" rx="38" ry="168"/><ellipse cx="300" cy="330" rx="20" ry="88"/><path d="M300 90 V570 M247 330 H353"/></g>' +
      '<g stroke="rgba(242,240,234,.55)" stroke-width="2"><path d="M296 100 L128 326 M296 560 L128 334 M300 330 H132"/></g>' +
      '<rect class="abc-feed" x="104" y="316" width="28" height="28"/><circle cx="118" cy="330" r="4" fill="#07080D"/>' +
    '</g></svg><span class="abc-dish-tag">Ground station AB-01 · <b data-ct-az>az 194°</b></span>';
  var aim = $('.abc-aim'), dish = $('.abc-dish'), az = $('[data-ct-az]');

  /* ---------- the signal line (full-bleed, bottom of the hero) ---------- */
  var scope = $('[data-ct-scope]');
  if (scope) scope.innerHTML = '<svg class="abc-scope" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="abc-grid" d="M0 50 H1000"/><path class="abc-wave" d="M0 50 H1000"/></svg>' +
    '<span class="abc-packet"></span><span class="abc-scope-l">Signal · <b data-ct-scopef>101.4 MHz</b></span>';
  var wave = $('.abc-wave'), packet = $('.abc-packet');
  // phones: the signal line moves into the form, right under the tuner, so its color change is seen while tuning
  (function(){
    var tuner = $('.abc-tuner'); if (!scope || !tuner) return;
    var home = scope.parentNode, next = scope.nextSibling;
    function place(){
      var phone = innerWidth <= 767;
      if (phone && scope.parentNode !== tuner.parentNode) tuner.parentNode.insertBefore(scope, tuner.nextSibling);
      else if (!phone && scope.parentNode !== home) home.insertBefore(scope, next && next.parentNode === home ? next : null);
      scope.classList.toggle('is-inform', phone);
    }
    place(); addEventListener('resize', place);
  })();

  /* ---------- form parts (fields live in the Embed inside the Webflow Form) ---------- */
  var box = $('[data-ct-form]'), form = box && $('form', box);
  var band = $('[data-ct-band]'), chipsEl = $('[data-ct-chips]'), hintEl = $('[data-ct-hint]'), msgL = $('[data-ct-msgl]'), msg = $('[data-ct-msg]');
  var reason = $('[data-ct-reason]'), err = $('[data-ct-err]'), freqEl = $('[data-ct-freq]'), chEl = $('[data-ct-ch]'), scopeF = $('[data-ct-scopef]');
  var needle = null, marks = [], chips = [];
  if (band){
    band.innerHTML = '<span class="abc-ticks"></span>' + ST.map(function(s){ return '<span class="abc-mark" style="left:' + fPct(s.f) + '%">' + s.f.toFixed(1) + '</span>'; }).join('') +
      '<span class="abc-needle" style="left:' + fPct(ST[0].f) + '%"></span>';
    needle = $('.abc-needle', band); marks = $$('.abc-mark', band);
  }
  if (chipsEl){
    chipsEl.innerHTML = ST.map(function(s, i){ return '<button type="button" class="abc-chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '" style="--c:' + s.c + '"><i aria-hidden="true"></i>' + esc(s.k) + '</button>'; }).join('');
    chips = $$('.abc-chip', chipsEl);
  }
  // meter: word + five bars
  var meterEl = $('[data-ct-meter]'), bars = [], meterT = null, WORDS = ['No signal', 'Faint', 'Weak', 'Fair', 'Strong', 'Locked'];
  if (meterEl){ meterEl.innerHTML = '<span class="abc-meter-t">No signal</span><i></i><i></i><i></i><i></i><i></i>'; meterT = $('.abc-meter-t', meterEl); bars = $$('i', meterEl); }

  var cur = 0, freq = ST[0].f, energy = 0, noise = 0, bump = null, tw = null;

  /* ---------- tuner ---------- */
  function nearest(f){ var b = 0; ST.forEach(function(s, i){ if (Math.abs(s.f - f) < Math.abs(ST[b].f - f)) b = i; }); return b; }
  function setFreq(f){
    freq = Math.max(F0, Math.min(F1, f));
    if (needle) needle.style.left = fPct(freq) + '%';
    if (freqEl) freqEl.textContent = freq.toFixed(1);
    if (scopeF) scopeF.textContent = freq.toFixed(1) + ' MHz';
    noise = Math.min(1, Math.abs(ST[nearest(freq)].f - freq) / 1.2);
  }
  function pick(i, quiet){
    cur = i; var s = ST[i];
    page.style.setProperty('--ch', s.c);
    chips.forEach(function(b, j){ b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    marks.forEach(function(m, j){ m.classList.toggle('is-on', j === i); });
    if (chEl) chEl.textContent = 'CH-0' + (i + 1);
    if (reason) reason.value = s.v;
    if (msgL) msgL.textContent = s.l;
    if (msg) msg.placeholder = s.ph;
    if (hintEl) hintEl.innerHTML = s.hint;
    noise = 0;
    if (quiet || reduce || !hasGsap) setFreq(s.f);
    else { var o = { f: freq }; if (tw) tw.kill(); tw = gsap.to(o, { f: s.f, duration: .55, ease: 'power3.out', onUpdate: function(){ setFreq(o.f); }, onComplete: function(){ noise = 0; rings(1); energy = Math.max(energy, .6); } }); }
    meter();
  }
  chips.forEach(function(b){ b.addEventListener('click', function(){ pick(+b.getAttribute('data-i')); }); });
  // drag the needle along the band: static between stations, snaps to the nearest on release
  if (band){
    var dragging = false;
    var fromX = function(x){ var r = band.getBoundingClientRect(); return F0 + (F1 - F0) * Math.max(0, Math.min(1, (x - r.left) / r.width)); };
    band.addEventListener('pointerdown', function(e){ dragging = true; band.classList.add('is-drag'); if (band.setPointerCapture) band.setPointerCapture(e.pointerId); if (tw) tw.kill(); setFreq(fromX(e.clientX)); energy = Math.max(energy, .4); });
    band.addEventListener('pointermove', function(e){ if (!dragging) return; setFreq(fromX(e.clientX)); var n = nearest(freq); marks.forEach(function(m, j){ m.classList.toggle('is-on', j === n && noise < .35); }); });
    var release = function(){ if (!dragging) return; dragging = false; band.classList.remove('is-drag'); pick(nearest(freq)); };
    band.addEventListener('pointerup', release); band.addEventListener('pointercancel', release);
  }

  /* ---------- signal meter: fills as the transmission gets readable ---------- */
  function field(n){ return form ? form.querySelector('[name="' + n + '"]') : null; }
  var fName = field('Name'), fEmail = field('Email'), EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function meter(){
    if (!bars.length) return;
    var m = msg ? msg.value.trim().length : 0;
    var n = 1 + (fName && fName.value.trim() ? 1 : 0) + (fEmail && EMAIL.test(fEmail.value.trim()) ? 1 : 0) + (m >= 8 ? 1 : 0) + (m >= 60 ? 1 : 0);
    bars.forEach(function(b, i){ b.classList.toggle('is-on', i < n); });
    if (meterT) meterT.textContent = WORDS[n];
  }
  [fName, fEmail, msg].forEach(function(inp){ if (inp) inp.addEventListener('input', function(){ energy = Math.min(1.2, energy + .18); meter(); if (err) err.textContent = ''; }); });

  /* ---------- the dish: aims at the cursor, scans slowly on touch ---------- */
  var ang = -14, target = -14, pointerSeen = false;
  function setAim(a){ ang = a; if (aim) aim.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' 390 330)'); if (az) az.textContent = 'az ' + Math.round(208 + a) + '°'; }
  if (!coarse && dish) page.addEventListener('pointermove', function(e){
    var m = dish.getScreenCTM(); if (!m) return;
    var px = m.a * 390 + m.c * 330 + m.e, py = m.b * 390 + m.d * 330 + m.f;
    var deg = Math.atan2(e.clientY - py, e.clientX - px) * 180 / Math.PI; // 180 = straight left
    var rel = deg > 0 ? deg - 180 : deg + 180;                             // 0 = straight left, negative = up
    target = Math.max(-40, Math.min(22, rel)); pointerSeen = true;
  });
  function rings(n){
    if (reduce || !hasGsap) return;
    gsap.fromTo($$('.abc-rings path').slice(0, n || 3), { x: 0, scale: .6, opacity: .9, transformOrigin: '50% 50%' }, { x: -760, scale: 3.2, opacity: 0, duration: 1.5, ease: 'power2.out', stagger: .16 });
  }

  /* ---------- the signal line: runs only while the hero is on screen ---------- */
  var N = 160, t = 0, running = false, visible = true, last = 0;
  function draw(){
    if (!wave) return;
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
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible = es[0].isIntersecting; run(visible && !document.hidden); }).observe(page);
    document.addEventListener('visibilitychange', function(){ run(visible && !document.hidden); });
    run(true);
  }

  /* ---------- transmit: validate, send the packet to the dish, then hand the real submit to Webflow Forms ---------- */
  if (form){
    var cleared = false, submitBtn = $('input[type="submit"], button[type="submit"]', form);
    var done = box ? $('.w-form-done', box) : null;
    form.addEventListener('submit', function(e){
      if (cleared){ cleared = false; return; } // second pass: Webflow's handler takes it from here
      e.preventDefault(); e.stopPropagation();
      if (form.classList.contains('is-sending')) return;
      var say = function(txt, el){ if (err) err.textContent = txt; if (el) el.focus(); };
      if (!fName || !fName.value.trim()) return say('Add your name so I know who’s calling.', fName);
      if (!fEmail || !EMAIL.test(fEmail.value.trim())) return say('That email looks off. Mind checking it?', fEmail);
      if (!msg || msg.value.trim().length < 2) return say('Add a line or two so the signal has something to carry.', msg);
      if (err) err.textContent = '';
      if (reason) reason.value = ST[cur].v;
      var sentF = done ? $('[data-ct-sentf]', done) : null; if (sentF) sentF.textContent = ST[cur].f.toFixed(1);
      function hand(){
        form.classList.remove('is-sending'); bump = null;
        cleared = true;
        if (form.requestSubmit) form.requestSubmit(submitBtn || undefined);
        else if (window.jQuery) window.jQuery(form).trigger('submit');
        else { cleared = false; form.submit(); }
      }
      if (reduce || !hasGsap || !scope || !packet){ hand(); return; }
      form.classList.add('is-sending');
      // the packet rides the signal line from the form to the dish, then the dish fires
      var sw = scope.getBoundingClientRect(), fr = box.getBoundingClientRect(), dr = dish ? dish.getBoundingClientRect() : sw;
      var x0 = Math.max(0, (fr.left + fr.width * .5 - sw.left) / sw.width * 1000), x1 = Math.min(1000, (dr.left + dr.width * .4 - sw.left) / sw.width * 1000);
      bump = { x: x0, a: 0 };
      gsap.timeline()
        .set(packet, { opacity: 1, left: (x0 / 10) + '%' })
        .to(bump, { a: 26, duration: .2 }, 0)
        .to(bump, { x: x1, duration: 1, ease: 'power2.inOut' }, 0)
        .to(packet, { left: (x1 / 10) + '%', duration: 1, ease: 'power2.inOut' }, 0)
        .to(packet, { opacity: 0, scale: 2.2, duration: .25 }, .95)
        .add(function(){ energy = 1.2; rings(3); }, .95)
        .set(packet, { scale: 1 }, 1.25)
        .add(hand, 1.3);
    });
    // success (Webflow's .w-form-done): toast + "Open another channel" brings the form back
    if (done && window.MutationObserver){
      new MutationObserver(function(){
        if (getComputedStyle(done).display !== 'none' && !done.__shown){
          done.__shown = true; if (toast) toast('Signal received · ' + ST[cur].f.toFixed(1) + ' · ' + ST[cur].k);
          if (hasGsap && !reduce) gsap.from($$('.ab_ct-sent > *', done), { y: 16, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out' });
        }
      }).observe(done, { attributes: true, attributeFilter: ['style'] });
    }
    var again = done ? $('[data-ct-again]', done) : null;
    if (again) again.addEventListener('click', function(e){
      e.preventDefault(); e.stopPropagation();
      form.reset(); done.style.display = 'none'; done.__shown = false; form.style.display = '';
      pick(cur, true); meter(); if (fName) fName.focus();
    });
  }

  /* ---------- other channels: "Tune to 103.8" and the local clock ---------- */
  // core's same-page anchor handler does the warp + jump to #channel; this only tunes in once it lands
  $$('[data-ct-station]').forEach(function(a){ a.addEventListener('click', function(){
    var i = +a.getAttribute('data-ct-station');
    setTimeout(function(){ pick(i); setTimeout(function(){ if (msg) msg.focus({ preventScroll: true }); }, 650); }, 450);
  }); });
  var clk = $('[data-ct-clock]');
  if (clk && AB.fmt){ var tick = function(){ clk.textContent = AB.fmt.format(new Date()); }; tick(); setInterval(tick, 15000); }

  /* ---------- entry: /contact#call preselects the voice channel ---------- */
  pick(location.hash === '#call' ? 1 : 0, true); meter();
  // already on /contact: the Nav "Book a call" only changes the hash, so tune in and bring the form up
  addEventListener('hashchange', function(){
    if (location.hash !== '#call' || !box) return;
    pick(1);
    if (AB.lenis) AB.lenis.scrollTo(box, { offset: -120 }); else box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function(){ if (msg) msg.focus({ preventScroll: true }); }, 800);
  });

});
