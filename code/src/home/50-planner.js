
  /* ---------- launch: mission planner (native Webflow form #planner) ---------- */
  (function(){
    var form = $('#planner'); if (!form) return;
    var launchBtn = $('#launchBtn'), launchLabel = $('#launchLabel'), countT = [];
    function resetLaunch(){ countT.forEach(clearTimeout); countT = []; if (launchLabel) launchLabel.textContent = 'Launch mission'; }
    if (launchBtn){
      launchBtn.addEventListener('mouseenter', function(){
        if (reduce) return; resetLaunch();
        ['T−3', 'T−2', 'T−1', 'Liftoff'].forEach(function(s, i){ countT.push(setTimeout(function(){ launchLabel.textContent = s; }, 220 + i * 380)); });
      });
      launchBtn.addEventListener('mouseleave', resetLaunch);
    }
    var wrap = form.parentNode, doneEl = $('.w-form-done', wrap);
    var path = $('#plPath'), done = $('#plDone'), rocket = $('#plRocket'), ringsB = $('#plRingsB'), ringsF = $('#plRingsF'), moons = $('#plMoons'), read = $('#plRead');
    var destEl = $('#plDestEl'), dps = $$('.ab_planet[data-k]', destEl);
    var chips = $$('.ab_planner_chip', form), bud = $('#plBud'), budOut = $('#plBudOut');
    var BUD = ['<$5k', '$5–10k', '$10–25k', '$25k+'], WIN = ['ASAP', '1–2 months', '3+ months', 'Flexible'];
    var fType = $('#plTypesField'), fBud = $('#plBudField'), fBrief = $('#plBriefField');
    chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
    var sg = $('.pl-stars', form), s = '';
    if (sg){ for (var i = 0; i < 60; i++) s += '<circle cx="' + (Math.random() * 560).toFixed(1) + '" cy="' + (Math.random() * 190).toFixed(1) + '" r="' + (Math.random() < .1 ? 1 : .45) + '" fill="#fff" opacity="' + (.15 + Math.random() * .55).toFixed(2) + '"/>'; sg.innerHTML = s; }
    function radios(){ return $$('input[name="Launch window"]', form); }
    function ensureWindow(){ if (!$('input[name="Launch window"]:checked', form)){ var r = radios()[1] || radios()[0]; if (r) r.checked = true; } }
    ensureWindow();
    function state(){
      var sel = chips.map(function(c, k){ return c.getAttribute('aria-pressed') === 'true' ? k : -1; }).filter(function(k){ return k > -1; });
      var chk = $('input[name="Launch window"]:checked', form), w = chk ? num(chk.getAttribute('data-i'), 1) : 1, b = Math.round(num(bud.value, 2));
      return { sel: sel, types: sel.map(function(k){ return chips[k].textContent.trim(); }), cols: sel.map(function(k){ return chips[k].getAttribute('data-c'); }), w: w, b: b };
    }
    var cur = { x: 330, y: 70, r: 16 }, st0 = null;
    function arc(cx, cy, rx, ry, top){ return 'M' + (cx - rx).toFixed(1) + ' ' + cy.toFixed(1) + ' A' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 0 ' + (top ? 1 : 0) + ' ' + (cx + rx).toFixed(1) + ' ' + cy.toFixed(1); }
    function brief(){ var st = state(); return 'Mission brief\nName: ' + ($('#plName').value || '-') + '\nEmail: ' + ($('#plEmail').value || '-') + '\nMission type: ' + (st.types.join(', ') || '-') + '\nLaunch window: ' + WIN[st.w] + '\nBudget: ' + BUD[st.b] + '\nAbout: ' + ($('#plMsg').value || '-'); }
    function fillHidden(){ var st = state(); if (fType) fType.value = st.types.join(', '); if (fBud) fBud.value = BUD[st.b]; if (fBrief) fBrief.value = brief(); }
    function draw(anim){
      var st = state(), n = st.sel.length; st0 = st;
      // window = distance, types = planet (first pick) + moons (the rest), budget = rings
      var X = [290, 370, 462, 410][st.w], Y = [92, 70, 58, 46][st.w], R = 14 + Math.min(n, 4) * 3.2;
      var lift = st.w === 3 ? 150 : 96 + st.w * 12, cx = (56 + X) / 2;
      var d = 'M78 144 Q ' + cx + ' ' + (Y - lift * .35) + ' ' + (X - R - 10) + ' ' + (Y + 3);
      path.setAttribute('d', d); done.setAttribute('d', d);
      path.style.strokeDasharray = st.w === 3 ? '1.5 7' : '';
      var k = n ? String(st.sel[0]) : 'none';
      dps.forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-k') === k); });
      var to = { x: X, y: Y, r: R };
      if (anim && hasGsap && !reduce) gsap.to(cur, { x: to.x, y: to.y, r: to.r, duration: .8, ease: 'elastic.out(1,.65)', overwrite: true, onUpdate: place });
      else { cur = to; place(); }
      budOut.textContent = BUD[st.b]; bud.setAttribute('aria-valuetext', BUD[st.b]); bud.style.setProperty('--p', (st.b / 3 * 100) + '%');
      read.innerHTML = n ? 'Flight plan · <b>' + esc(st.types.join(' + ')) + '</b> · T−' + esc(WIN[st.w]) + ' · orbit ' + esc(BUD[st.b]) : 'Flight plan · choose a mission type';
      fillHidden();
      if (!form.classList.contains('is-flying')) parkRocket();
    }
    function place(){
      destEl.style.left = (cur.x / 560 * 100) + '%'; destEl.style.top = (cur.y / 190 * 100) + '%'; destEl.style.width = (cur.r * 2 / 560 * 100) + '%';
      var st = st0 || state(), b = '', f = '', col = st.cols.length ? st.cols : ['#8a8fa3'];
      for (var k = 1; k <= st.b; k++){
        var rx = cur.r + 6 + k * 7, ry = rx * .26, c = col[(k - 1) % col.length], tr = ' transform="rotate(-14 ' + cur.x.toFixed(1) + ' ' + cur.y.toFixed(1) + ')" stroke="' + c + '"';
        b += '<path d="' + arc(cur.x, cur.y, rx, ry, true) + '"' + tr + '/>'; f += '<path d="' + arc(cur.x, cur.y, rx, ry, false) + '"' + tr + ' opacity="' + (.9 - k * .15) + '"/>';
      }
      ringsB.innerHTML = b; ringsF.innerHTML = f;
    }
    // extra mission types orbit as small moons
    var mt = 0;
    function moonTick(){
      var st = st0; if (!st) return; var extra = st.cols.slice(1), out = '';
      extra.forEach(function(c, i){ var a = mt * (0.6 + i * .15) + i * 2.1, rx = cur.r + 14 + i * 6, x = cur.x + Math.cos(a) * rx, y = cur.y + Math.sin(a) * rx * .3; var front = Math.sin(a) > 0; out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (front ? 2.8 : 2.2) + '" fill="' + c + '" opacity="' + (front ? 1 : .35) + '"/>'; });
      moons.innerHTML = out;
    }
    if (hasGsap && !reduce){ var vis = false; onView(form, function(x){ vis = x; }); gsap.ticker.add(function(t, dt){ if (!vis) return; mt += dt * .0012; moonTick(); }); }
    else moonTick();
    function parkRocket(){ var L = path.getTotalLength(), p0 = path.getPointAtLength(0), p1 = path.getPointAtLength(6); rocket.setAttribute('transform', 'translate(' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ') rotate(' + (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI).toFixed(1) + ')'); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L; done.style.opacity = 0; }
    chips.forEach(function(c){ c.style.setProperty('--c', c.getAttribute('data-c')); c.addEventListener('click', function(){ c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); draw(true); if (hasGsap && !reduce) gsap.fromTo(c, { scale: .95 }, { scale: 1, duration: .45, ease: 'elastic.out(1,.4)' }); }); });
    radios().forEach(function(r){ r.addEventListener('change', function(){ draw(true); }); });
    bud.addEventListener('input', function(){ draw(true); });
    $$('#plName, #plEmail, #plMsg').forEach(function(inp){ inp.addEventListener('input', fillHidden); });
    var copyBtn = $('#plCopy');
    if (copyBtn) copyBtn.addEventListener('click', function(){ AB.copyText(brief(), 'Flight plan copied ✓', function(){ toast('Copy failed, select the text instead.'); }); });

    // submit: validate, fly the rocket, then hand the real submit to Webflow Forms
    var cleared = false;
    form.addEventListener('submit', function(e){
      if (cleared){ cleared = false; fillHidden(); return; } // second pass: Webflow's handler takes it from here
      e.preventDefault(); e.stopPropagation();
      if (form.classList.contains('is-flying')) return;
      var st = state();
      if (!st.types.length){ var cc = $('#plTypes'); cc.classList.remove('is-shake'); void cc.offsetWidth; cc.classList.add('is-shake'); toast('Pick at least one mission type.'); chips[0].focus(); return; }
      var em = $('#plEmail'); if (em.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){ em.focus(); toast('That email address looks off.'); return; }
      fillHidden();
      var sent = $('#plSentTxt'); if (sent) sent.textContent = 'Flight plan: ' + st.types.join(' + ') + ', ' + WIN[st.w].toLowerCase() + ', ' + BUD[st.b] + '. I’ll reply within one business day with next steps.';
      function release(){
        form.classList.remove('is-flying');
        var id = $('#plId'); if (id) id.textContent = 'MSN-07 · logged';
        cleared = true;
        if (form.requestSubmit) form.requestSubmit(launchBtn || undefined);
        else if (window.jQuery) window.jQuery(form).trigger('submit');
        else { cleared = false; form.submit(); }
      }
      if (reduce || !hasGsap){ release(); return; }
      form.classList.add('is-flying'); done.style.opacity = 1;
      var L = path.getTotalLength(), o = { t: 0 }, fl = $('.ab_planner_flame', launchBtn);
      gsap.timeline()
        .to(launchBtn, { x: '+=3', duration: .05, repeat: 5, yoyo: true }).to(fl, { opacity: 1, duration: .1 }, '<')
        .to(o, { t: 1, duration: 1.8, ease: 'power2.inOut', onUpdate: function(){
          var p = path.getPointAtLength(o.t * L), q = path.getPointAtLength(Math.min(L, o.t * L + 2));
          rocket.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI).toFixed(1) + ') scale(' + (1 - o.t * .35).toFixed(3) + ')');
          done.style.strokeDashoffset = L * (1 - o.t);
        } })
        .to(destEl, { scale: 1.18, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' })
        .add(function(){ gsap.fromTo(sf.state, { warp: .4 }, { warp: 0, duration: 1, ease: 'power2.out' }); })
        .set(fl, { opacity: 0 }).add(release);
    });

    // success panel (Webflow's .w-form-done): animate in when Webflow shows it; "Plot another mission" brings the form back
    if (doneEl && hasGsap && !reduce && window.MutationObserver){
      new MutationObserver(function(){
        if (getComputedStyle(doneEl).display !== 'none' && !doneEl.__shown){ doneEl.__shown = true; gsap.from($$('.ab_planner_sent-inner > *', doneEl), { y: 16, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out' }); }
      }).observe(doneEl, { attributes: true, attributeFilter: ['style'] });
    }
    var resetBtn = $('#plReset');
    if (resetBtn) resetBtn.addEventListener('click', function(){
      form.reset(); chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); ensureWindow();
      if (doneEl){ doneEl.style.display = 'none'; doneEl.__shown = false; }
      form.style.display = '';
      var id = $('#plId'); if (id) id.textContent = 'MSN-07 · unassigned';
      draw(false); resetLaunch();
    });
    draw(false);
  })();
