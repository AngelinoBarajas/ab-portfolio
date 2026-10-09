
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
    // the flight-plan readout lives under the visual (full width, wraps), not inside it next to Earth
    var viz = $('.ab_planner_viz', form);
    if (read && viz && viz.contains(read)){ viz.parentNode.insertBefore(read, viz.nextSibling); read.classList.add('is-below'); read.setAttribute('aria-live', 'polite'); }
    var bud = $('#plBud'), budOut = $('#plBudOut');
    // budget bands follow the pricing tiers (Launch from $6.5k, Orbit $12k, Deep space $22k); keep the same count,
    // the rings are drawn from the band's position. Same list in the /process form (process/00-process.js + embed).
    var BUD = ['Under $6.5k', '$6.5–12k', '$12–22k', '$22–40k', '$40k+'], MAXB = BUD.length - 1, WIN = ['ASAP', '1–2 months', '3+ months', 'Flexible'];
    // the budget scale lives here (the Designer embed may carry an older one): slider range, ticks, default
    bud.max = MAXB; bud.value = 2;
    var ticks = $('.ab_planner_ticks', form); if (ticks) ticks.innerHTML = BUD.map(function(b){ return '<span style="white-space:nowrap">' + esc(b.replace('Under ', '<')) + '</span>'; }).join('');
    // line the labels up under the slider stops: one equal column per band, and the range inset so its 18px
    // square thumb stops at each column's center (space-between drifted, worst at the ends)
    if (ticks){
      var nB = BUD.length, half = (50 / nB) + '%';
      ticks.style.display = 'grid'; ticks.style.gridTemplateColumns = 'repeat(' + nB + ',1fr)'; ticks.style.textAlign = 'center';
      bud.style.width = 'calc(' + (100 - 100 / nB) + '% + 18px)'; bud.style.marginLeft = 'calc(' + half + ' - 9px)';
    }
    if (ticks && !$('.ab_planner_est', form)){ var est = document.createElement('p'); est.className = 'ab_planner_est text-style-mono'; est.style.cssText = 'margin:10px 0 0;font-size:11px;letter-spacing:.08em;color:var(--dust)'; est.textContent = 'Estimates only. Your quote is fixed once we scope the project together.'; ticks.parentNode.insertBefore(est, ticks.nextSibling); }
    // budget: "not sure yet" overrides the slider (people still scouting what to spend); moving the slider turns it off
    var UNSURE = 'Not sure yet · still scouting', unsureBtn = $('.ab_planner_chip.is-unsure', form);
    if (!unsureBtn && ticks){ unsureBtn = document.createElement('button'); unsureBtn.type = 'button'; unsureBtn.className = 'ab_planner_chip is-unsure'; unsureBtn.setAttribute('aria-pressed', 'false'); unsureBtn.textContent = UNSURE; ticks.parentNode.insertBefore(unsureBtn, ticks.nextSibling); }
    // add-ons ride along with any mission type; the Knowledge System add-on is added here if the embed lacks it
    var typesRow = $('#plTypes');
    if (typesRow && !$('[data-addon]', form)){
      var ad = document.createElement('div'); ad.className = 'ab_planner_addons';
      ad.innerHTML = '<span class="ab_planner_addon-label">Add-on</span><button type="button" class="ab_planner_chip is-addon" data-addon="KNS · Knowledge system" data-c="#FFD29A" aria-pressed="false">KNS · Knowledge system</button>';
      typesRow.parentNode.insertBefore(ad, typesRow.nextSibling);
    }
    if (!$('#plAddonsField', form) && typesRow){ var hf = document.createElement('input'); hf.type = 'hidden'; hf.name = 'Add-ons'; hf.id = 'plAddonsField'; hf.value = ''; typesRow.parentNode.appendChild(hf); }
    var chips = $$('.ab_planner_chip:not([data-addon]):not(.is-unsure)', form), addons = $$('.ab_planner_chip[data-addon]', form);
    // add-ons wear the Knowledge-system satellite icon (the same one as the /process form)
    addons.forEach(function(c){ c.setAttribute('data-addon', 'KNS · Knowledge system'); if (!$('svg', c)) c.textContent = 'KNS · Knowledge system'; if (!$('svg', c)) c.insertAdjacentHTML('afterbegin', '<svg class="sat-ico ab-ks-ico" viewBox="0 0 24 12" aria-hidden="true"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg>'); });
    var fType = $('#plTypesField'), fBud = $('#plBudField'), fBrief = $('#plBriefField'), fAdd = $('#plAddonsField');
    chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
    var ol = $('.pl-orbitlines ellipse', form); if (ol){ ol.setAttribute('cx', 110); ol.setAttribute('cy', 138); ol.setAttribute('transform', 'rotate(-14 110 138)'); }
    var sg = $('.pl-stars', form), s = '';
    if (sg){ for (var i = 0; i < 60; i++) s += '<circle cx="' + (Math.random() * 560).toFixed(1) + '" cy="' + (Math.random() * 190).toFixed(1) + '" r="' + (Math.random() < .1 ? 1 : .45) + '" fill="#fff" opacity="' + (.15 + Math.random() * .55).toFixed(2) + '"/>'; sg.innerHTML = s; }
    function radios(){ return $$('input[name="Launch window"]', form); }
    function ensureWindow(){ if (!$('input[name="Launch window"]:checked', form)){ var r = radios()[1] || radios()[0]; if (r) r.checked = true; } }
    ensureWindow();
    function state(){
      var sel = chips.map(function(c, k){ return c.getAttribute('aria-pressed') === 'true' ? k : -1; }).filter(function(k){ return k > -1; });
      var chk = $('input[name="Launch window"]:checked', form), w = chk ? num(chk.getAttribute('data-i'), 1) : 1, b = Math.round(num(bud.value, 2));
      var add = addons.filter(function(c){ return c.getAttribute('aria-pressed') === 'true'; }).map(function(c){ return c.getAttribute('data-addon'); });
      var un = !!(unsureBtn && unsureBtn.getAttribute('aria-pressed') === 'true'); b = Math.min(b, MAXB);
      return { sel: sel, types: sel.map(function(k){ return chips[k].textContent.trim(); }), cols: sel.map(function(k){ return chips[k].getAttribute('data-c'); }), w: w, b: un ? 0 : b, bl: un ? UNSURE : BUD[b], unsure: un, add: add };
    }
    var cur = { x: 330, y: 70, r: 16 }, st0 = null;
    function arc(cx, cy, rx, ry, top){ return 'M' + (cx - rx).toFixed(1) + ' ' + cy.toFixed(1) + ' A' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 0 ' + (top ? 1 : 0) + ' ' + (cx + rx).toFixed(1) + ' ' + cy.toFixed(1); }
    function brief(){ var st = state(); return 'Mission brief\nName: ' + ($('#plName').value || '-') + '\nEmail: ' + ($('#plEmail').value || '-') + '\nMission type: ' + (st.types.join(', ') || '-') + '\nLaunch window: ' + WIN[st.w] + '\nBudget: ' + st.bl + '\nAdd-ons: ' + (st.add.join(', ') || '-') + '\nAbout: ' + ($('#plMsg').value || '-'); }
    function fillHidden(){ var st = state(); if (fType) fType.value = st.types.join(', '); if (fBud) fBud.value = st.bl; if (fAdd) fAdd.value = st.add.join(', '); if (fBrief) fBrief.value = brief(); }
    // pricing estimate under the mission types (core/46-pricing.js): chip label → Services slug; it also moves the
    // budget slider to the matching band until the visitor sets the budget themselves
    var SLUGS = { 'Website': 'webflow-development', 'Branding + logo': 'branding', 'Motion + interaction': 'motion', 'WebGL + 3D': 'webgl-data', 'CMS + integrations': 'cms-integrations', 'Web app': 'custom-deploys' };
    var estBox = null, budPicked = false;
    if (AB.estimate && typesRow){ estBox = document.createElement('div'); estBox.setAttribute('data-est', ''); var after = $('.ab_planner_addons', form) || typesRow; after.parentNode.insertBefore(estBox, after.nextSibling); }
    function syncEst(){
      if (!estBox) return;
      var types = chips.filter(function(c){ return c.getAttribute('aria-pressed') === 'true'; }).map(function(c){ return SLUGS[c.textContent.trim()]; }).filter(Boolean);
      var r = AB.estimate(types), un = !!(unsureBtn && unsureBtn.getAttribute('aria-pressed') === 'true');
      estBox.innerHTML = AB.estimateHTML(r, { note: false });
      if (r && !budPicked && !un) bud.value = Math.min(r.band, MAXB);
    }
    function draw(anim){
      syncEst();
      var st = state(), n = st.sel.length; st0 = st;
      // window = distance, types = planet (first pick) + moons (the rest), budget = rings
      // Earth sits at (110,138) and the destinations reach x 450, so the route is centered in the 560 frame (was 56 → 462)
      var X = [300, 365, 450, 405][st.w], Y = [96, 78, 66, 54][st.w], R = 14 + Math.min(n, 4) * 3.2;
      var lift = st.w === 3 ? 140 : 90 + st.w * 12, cx = (110 + X) / 2;
      var d = 'M131 132 Q ' + cx + ' ' + (Y - lift * .35) + ' ' + (X - R - 10) + ' ' + (Y + 3);
      path.setAttribute('d', d); done.setAttribute('d', d);
      path.style.strokeDasharray = st.w === 3 ? '1.5 7' : '';
      var k = n ? String(st.sel[0]) : 'none';
      dps.forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-k') === k); });
      var to = { x: X, y: Y, r: R };
      if (anim && hasGsap && !reduce) gsap.to(cur, { x: to.x, y: to.y, r: to.r, duration: .8, ease: 'elastic.out(1,.65)', overwrite: true, onUpdate: place });
      else { cur = to; place(); }
      budOut.textContent = st.unsure ? 'Not sure yet' : st.bl; bud.setAttribute('aria-valuetext', st.bl); bud.classList.toggle('is-unsure', st.unsure); if (!st.unsure) bud.style.setProperty('--p', (st.b / MAXB * 100) + '%');
      read.innerHTML = n ? 'Flight plan · <b>' + esc(st.types.join(' + ')) + '</b> · T−' + esc(WIN[st.w]) + ' · orbit ' + esc(st.unsure ? 'TBD' : st.bl) + (st.add.length ? ' · <b>+ ' + esc(st.add.join(' + ').toLowerCase()) + '</b>' : '') : 'Flight plan · choose a mission type';
      fillHidden();
      if (!form.classList.contains('is-flying')) parkRocket();
      if (reduce || !hasGsap) moonTick();
    }
    function place(){
      destEl.style.left = (cur.x / 560 * 100) + '%'; destEl.style.top = (cur.y / 190 * 100) + '%'; destEl.style.width = (cur.r * 2 / 560 * 100) + '%';
      var st = st0 || state(), b = '', f = '', col = st.cols.length ? st.cols : ['#8a8fa3'];
      for (var k = 1; k <= st.b; k++){
        var rx = cur.r + 6 + k * 7, ry = rx * .26, c = col[(k - 1) % col.length], tr = ' transform="rotate(-14 ' + cur.x.toFixed(1) + ' ' + cur.y.toFixed(1) + ')" stroke="' + c + '"';
        b += '<path d="' + arc(cur.x, cur.y, rx, ry, true) + '"' + tr + '/>'; f += '<path d="' + arc(cur.x, cur.y, rx, ry, false) + '"' + tr + ' opacity="' + (.9 - k * .15) + '"/>';
      }
      if (st.unsure){ var grx = cur.r + 13, gtr = ' transform="rotate(-14 ' + cur.x.toFixed(1) + ' ' + cur.y.toFixed(1) + ')" stroke="' + col[0] + '" stroke-dasharray="2 4"'; b += '<path d="' + arc(cur.x, cur.y, grx, grx * .26, true) + '"' + gtr + ' opacity=".6"/>'; f += '<path d="' + arc(cur.x, cur.y, grx, grx * .26, false) + '"' + gtr + ' opacity=".6"/>'; }
      ringsB.innerHTML = b; ringsF.innerHTML = f;
    }
    // extra mission types orbit as small moons
    var mt = 0;
    function moonTick(){
      var st = st0; if (!st) return; var extra = st.cols.slice(1), out = '';
      extra.forEach(function(c, i){ var a = mt * (0.6 + i * .15) + i * 2.1, rx = cur.r + 14 + i * 6, x = cur.x + Math.cos(a) * rx, y = cur.y + Math.sin(a) * rx * .3; var front = Math.sin(a) > 0; out += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (front ? 2.8 : 2.2) + '" fill="' + c + '" opacity="' + (front ? 1 : .35) + '"/>'; });
      // the Knowledge System add-on: a small linked-node satellite on a wide orbit
      if (st.add && st.add.length){
        var a2 = mt * .45 + 1, R2 = cur.r + 34, sx = cur.x + Math.cos(a2) * R2, sy = cur.y + Math.sin(a2) * R2 * .32, op = Math.sin(a2) > 0 ? .95 : .45;
        out += '<g opacity="' + op + '" transform="translate(' + (sx - 7.2).toFixed(1) + ' ' + (sy - 3.6).toFixed(1) + ') scale(.6)"><path d="M1 3.5h6v5H1zM17 3.5h6v5h-6z" fill="none" stroke="#FFD29A" stroke-width="1.3" vector-effect="non-scaling-stroke"/><path d="M7 6h3M14 6h3" stroke="#FFD29A" stroke-width="1.3" vector-effect="non-scaling-stroke"/><rect x="10" y="2.5" width="4" height="7" fill="#FFD29A"/></g>';
      }
      moons.innerHTML = out;
    }
    if (hasGsap && !reduce){ var vis = false; onView(form, function(x){ vis = x; }); gsap.ticker.add(function(t, dt){ if (!vis) return; mt += dt * .0012; moonTick(); }); }
    else moonTick();
    function parkRocket(){ var L = path.getTotalLength(), p0 = path.getPointAtLength(0), p1 = path.getPointAtLength(6); rocket.setAttribute('transform', 'translate(' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ') rotate(' + (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI).toFixed(1) + ')'); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L; done.style.opacity = 0; }
    chips.concat(addons).forEach(function(c){ c.style.setProperty('--c', c.getAttribute('data-c')); c.addEventListener('click', function(){ c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); draw(true); if (hasGsap && !reduce) gsap.fromTo(c, { scale: .95 }, { scale: 1, duration: .45, ease: 'elastic.out(1,.4)' }); }); });
    radios().forEach(function(r){ r.addEventListener('change', function(){ draw(true); }); });
    bud.addEventListener('input', function(){ budPicked = true; if (unsureBtn) unsureBtn.setAttribute('aria-pressed', 'false'); draw(true); });
    if (unsureBtn) unsureBtn.addEventListener('click', function(){ unsureBtn.setAttribute('aria-pressed', unsureBtn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); draw(true); });
    $$('#plName, #plEmail, #plMsg').forEach(function(inp){ inp.addEventListener('input', fillHidden); });
    var copyBtn = $('#plCopy');
    if (copyBtn) copyBtn.addEventListener('click', function(){ AB.copyText(brief(), 'Flight plan copied ✓', function(){ toast('Copy failed, select the text instead.'); }); });

    // submit: validate (core/43-validate: inline messages + summary), fly the rocket, then hand the real submit to Webflow Forms
    if (typesRow){ typesRow.setAttribute('role', 'group'); var lg = $('.ab_planner_legend', typesRow.closest('fieldset') || form); if (lg){ lg.id = lg.id || 'plTypesL'; typesRow.setAttribute('aria-labelledby', lg.id); } }
    var fchk = AB.formCheck && AB.formCheck(form, { btn: launchBtn, rules: [
      { el: typesRow, box: typesRow, name: 'mission type', need: 'Pick at least one mission type.', test: function(){ return state().types.length ? '' : 'need'; } },
      { el: $('#plName'), name: 'name', need: 'Add your name so I know who’s calling.' },
      { el: $('#plEmail'), name: 'email', need: 'I need an email to radio back.', bad: 'That email looks off. Mind checking it?' }
    ] });
    var cleared = false;
    form.addEventListener('submit', function(e){
      if (cleared){ cleared = false; fillHidden(); return; } // second pass: Webflow's handler takes it from here
      e.preventDefault(); e.stopPropagation();
      if (form.classList.contains('is-flying')) return;
      if (fchk && !fchk.ok()) return;
      var st = state();
      fillHidden();
      var sent = $('#plSentTxt'); if (sent) sent.textContent = 'Flight plan: ' + st.types.join(' + ') + ', ' + WIN[st.w].toLowerCase() + ', ' + (st.unsure ? 'budget to be scouted together' : st.bl) + (st.add.length ? ', plus ' + st.add.join(' + ').toLowerCase() : '') + '. I’ll reply within one business day with next steps.';
      function release(){
        form.classList.remove('is-flying');
        var id = $('#plId'); if (id) id.textContent = 'MSN-07 · logged';
        cleared = true;
        if (form.requestSubmit) form.requestSubmit(launchBtn || undefined);
        else if (window.jQuery) window.jQuery(form).trigger('submit');
        else { cleared = false; form.submit(); }
      }
      if (reduce || !hasGsap){ setTimeout(release, 0); return; } // a requestSubmit() inside this submit event is ignored
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

    // success panel (Webflow's .w-form-done): core/41-forms keeps the form's height and plays the shared reveal;
    // "Plot another mission" brings the form back
    var resetBtn = $('#plReset');
    if (resetBtn) resetBtn.addEventListener('click', function(){
      form.reset(); if (fchk) fchk.reset(); chips.concat(addons).forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); ensureWindow(); bud.value = 2; budPicked = false;
      if (doneEl) doneEl.style.display = 'none';
      form.style.display = '';
      var id = $('#plId'); if (id) id.textContent = 'MSN-07 · unassigned';
      draw(false); resetLaunch();
    });
    draw(false);
  })();
