  /* =========================================================
     YOUR FLIGHT PLAN · the trajectory warps into the Process route, right here on the page.
     The six stage cards are Designer elements; legs, path, launch pad, ship and touchdown planet are script-built.
     ========================================================= */
  var fsec = $('[data-hub-flight]'), track = fsec ? $('[data-fl-track]', fsec) : null, fst = null, fsel = [], fpts = [], flen = 0, fwide = false, fk = -2, landed = false;
  var wps = track ? $$('.ab_hub-wp', track) : [];
  var SHIP = '<svg viewBox="0 0 44 44"><path class="hbf-flame" d="M6 22 L-8 17 L-4 22 L-8 27 Z" fill="#FF6A3D"/><path d="M6 14 H26 L40 22 L26 30 H6 Z" fill="#F2F0EA"/><path d="M14 14 L10 6 H18 L22 14 Z M14 30 L10 38 H18 L22 30 Z" fill="#8A8FA3"/><circle cx="28" cy="22" r="3.5" fill="#4C8DFF"/></svg>';
  function flightOpen(){ return !!fsec && fsec.classList.contains('is-open'); }
  function fset(k, v){ var n = fsec && $('[data-fl="' + k + '"]', fsec); if (n) n.textContent = v; }
  // header links: clone them so core's same-page anchor warp doesn't also fire
  function own$(sel, fn){ var a = fsec && $(sel, fsec); if (!a) return; var b = a.cloneNode(true); a.parentNode.replaceChild(b, a); b.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(); }); }
  own$('[data-fl-edit]', function(){ goTo($('#trajectory'), false, 20); });
  own$('[data-fl-abort]', abortFlight);

  function fill(sel){
    var m = HUB[sel[0]], st = sel.slice(1).map(function(j){ return HUB[j]; });
    var fm = flownAll(sel)[0] || (m.flown.length ? FBY[m.flown[0]] : null);
    var names = st.length ? ', with ' + (st.length > 1 ? 'stops at ' : 'a stop at ') + st.map(function(o){ return o.short; }).join(' and ') : '';
    fsec.style.setProperty('--c', m.c);
    fset('codes', sel.map(function(j){ return HUB[j].code; }).join(' + '));
    fset('lede', 'Six stages, re-plotted for ' + m.short + names + '. Scroll to fly it.');
    fset('n', 'T−6'); fset('l', 'On the pad');
    $$('.hbf-path, .hbf-pad, .hbf-ship, .hbf-dock', track).forEach(function(n){ n.parentNode.removeChild(n); });
    track.classList.toggle('has-2', st.length > 1);
    wps.forEach(function(w, i){
      w.classList.remove('is-on');
      $('[data-fl-legs]', w).innerHTML = '<div class="hbf-leg" style="--lc:' + m.c + '"><small>For ' + esc(m.short) + '</small>' + esc(m.legs[i] || '') + '</div>' +
        st.map(function(o){ return '<div class="hbf-leg is-stop" style="--lc:' + o.c + '"><small>+ Stop · ' + esc(o.short) + '</small>' + esc(o.legs[i] || '') + '</div>'; }).join('');
      var a = $('[data-fl-flown]', w), what = a ? a.getAttribute('data-flown-what') : '';
      if (a){
        a.classList.toggle('is-none', !fm);
        if (fm){ a.href = misHref(fm.slug); a.innerHTML = 'See ' + esc(what) + ' · ' + esc(fm.name) + ' <span aria-hidden="true">→</span>'; a.removeAttribute('aria-disabled'); }
        else { a.removeAttribute('href'); a.textContent = 'No mission flown here yet · yours could be first'; a.setAttribute('aria-disabled', 'true'); }
      }
    });
    track.insertAdjacentHTML('afterbegin', '<svg class="hbf-path" aria-hidden="true"><path class="hbf-line"/><path class="hbf-lit"/></svg>' +
      '<div class="hbf-pad" aria-hidden="true"><span class="ab_planet" data-planet="terra" data-seed="7" data-colors="#0b2a4a,#1f6fb2,#3fa66b,#a88b5c,#f2f0ea" data-spin="80" data-glow="rgba(76,141,255,.35)"></span><span>Earth · your brief</span></div>' +
      '<div class="hbf-ship" aria-hidden="true">' + SHIP + '</div>');
    var dock = document.createElement('div'); dock.className = 'hbf-dock';
    dock.innerHTML = '<span class="hbf-shock" aria-hidden="true"></span>' +
      st.map(function(o, k){ return '<span class="hbf-moon" style="--c:' + o.c + ';--a:' + (k * 150 + 25) + 'deg" aria-hidden="true"><i></i><em>' + esc(o.code) + '</em></span>'; }).join('') +
      '<div class="hbf-live"><span>Touchdown · ' + esc(m.code) + '</span><b>Mission <span class="t-outline">live</span></b>' +
      '<div class="hbf-live-a">' + btnHTML('is-primary', PROC + '#launch', 'Request this mission', '→', ' data-req') + btnHTML('is-ghost', '/contact#call', 'Book a call') + btnHTML('is-ghost is-replot', '#trajectory', 'Re-plot route', '↺', ' data-replot') + '</div></div>';
    dock.insertBefore(planetEl(m, 90, 'hbf-dock-pl'), dock.children[1] || null);
    track.appendChild(dock);
    $$('.ab_planet', track).forEach(build);
    // the Process page reads ab:dest (main first, then stops) and pre-fills its star chart + form
    // re-plot: warp back up to the planner on this page (the trajectory stays set; the flight plan stays below until relaunched)
    $('[data-replot]', dock).addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); warp(function(){ goTo($('#trajectory'), true, 20); }, true); });
    $('[data-req]', dock).addEventListener('click', function(){ try { localStorage.setItem('ab:dest', fsel.map(function(j){ return HUB[j].slug; }).join(',')); } catch (err){} });
  }
  function flayout(){
    if (!track) return;
    fwide = innerWidth > 860;
    wps.forEach(function(w){ w.style.left = w.style.top = ''; });
    var dock = $('.hbf-dock', track); if (!dock) return;
    // "Mission live" + its buttons: under the planet (absolute) on wide screens, in the flow after it on phones so nothing is clipped
    var live = $('.hbf-live', track);
    if (live){ if (fwide){ if (live.parentNode !== dock) dock.appendChild(live); } else if (live.parentNode !== track) track.appendChild(live); }
    if (!fwide){ track.style.width = ''; dock.style.left = dock.style.top = ''; return; }
    var h = track.offsetHeight, step = Math.max(360, innerWidth * .28), x0 = Math.min(240, innerWidth * .16);
    var dockX = x0 + step * STAGES.length + innerWidth * .22, W = dockX + innerWidth * .45, CARD_TOP = 150;
    var svg = $('.hbf-path', track), line = $('.hbf-line', track), lit = $('.hbf-lit', track);
    track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
    fpts = [[x0 * .45, 84]];
    STAGES.forEach(function(s, i){ fpts.push([x0 + step * i + step * .35, i % 2 ? 112 : 46]); });
    fpts.push([dockX, 84]);
    var d = 'M' + fpts[0][0] + ' ' + fpts[0][1];
    for (var i = 1; i < fpts.length; i++){ var p = fpts[i - 1], q = fpts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
    line.setAttribute('d', d); lit.setAttribute('d', d); flen = line.getTotalLength();
    lit.style.strokeDasharray = flen; lit.style.strokeDashoffset = flen;
    var pad = $('.hbf-pad', track); pad.style.left = fpts[0][0] + 'px'; pad.style.top = fpts[0][1] + 'px';
    dock.style.left = dockX + 'px'; dock.style.top = '84px';
    wps.forEach(function(w, i){
      var q = fpts[i + 1], node = $('.ab_hub-wp_node', w);
      w.style.left = (q[0] - 48) + 'px'; w.style.top = CARD_TOP + 'px';
      w.style.setProperty('--ny', (q[1] - CARD_TOP) + 'px');
      node.style.left = '48px'; node.style.top = (q[1] - CARD_TOP) + 'px';
    });
  }
  function fstage(k){
    if (k === fk) return; fk = k;
    wps.forEach(function(w, i){ w.classList.toggle('is-on', i <= k); });
    fset('n', 'T−' + Math.max(0, 5 - k));
    fset('l', k < 0 ? 'On the pad' : (STAGES[k] ? STAGES[k].code : '') + (k === 5 ? ' · liftoff' : ''));
  }
  function land(on){
    if (on === landed) return; landed = on;
    fsec.classList.toggle('is-landed', on);
    if (!on) return;
    fset('n', 'T+0'); fset('l', 'Touchdown');
    if (reduce || !hasGsap) return;
    var dock = $('.hbf-dock', track), cols = sel().map(function(j){ return HUB[j].c; }).concat(['#FF6A3D', '#F2F0EA']);
    if (!cols.length || !dock) return;
    for (var n = 0; n < 34; n++){
      var b = document.createElement('i'); b.className = 'hbf-bit'; b.style.background = cols[n % cols.length]; dock.appendChild(b);
      var a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 160;
      gsap.fromTo(b, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r - 40, rotation: Math.random() * 540, opacity: 0, duration: 1.2 + Math.random() * .6, ease: 'power2.out', onComplete: function(){ var t = this.targets()[0]; if (t.parentNode) t.parentNode.removeChild(t); } });
    }
  }
  function ffly(prog){
    if (!fwide) return;
    var line = $('.hbf-line', track), ship = $('.hbf-ship', track), lit = $('.hbf-lit', track); if (!line) return;
    // the ship stops at the planet's surface, not its center
    var at = Math.max(0, Math.min(1, prog)) * (flen - 92), p = line.getPointAtLength(at), p2 = line.getPointAtLength(Math.min(flen, at + 2));
    ship.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI) + 'deg)';
    lit.style.strokeDashoffset = flen - at;
    var k = -1; fpts.slice(1, 1 + STAGES.length).forEach(function(q, i){ if (p.x >= q[0] - 4) k = i; });
    if (prog < .97) fstage(k);
    land(prog >= .99);
  }
  function fbuild(){
    if (fst){ fst.kill(true); fst = null; }
    if (!track || !hasGsap) return;
    gsap.set(track, { x: 0 }); fk = -2; landed = false; fsec.classList.remove('is-landed');
    flayout();
    if (!window.ScrollTrigger) return;
    if (fwide){
      var dist = function(){ return track.scrollWidth - innerWidth + 40; };
      fst = ScrollTrigger.create({ trigger: fsec, start: 'top top', end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
        onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); ffly(self.progress * 1.02); } });
      ffly(0);
      window.__abMissionST = fst; // core holds the nav steady inside this range
    } else {
      // phones: the route is a vertical rail; stages light as they cross the middle, touchdown when the planet shows
      fst = ScrollTrigger.create({ trigger: track, start: 'top 60%', endTrigger: $('.hbf-dock', track) || track, end: 'bottom 75%', scrub: true,
        onUpdate: function(self){ var k = -1, mid = innerHeight * .6; wps.forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); fstage(k); land(self.progress > .98); } });
    }
  }
  // hyperspace: streaks rush out from the center, the page swaps underneath, the streaks fade
  var warpEl = null;
  function warp(mid, back){
    if (reduce || !hasGsap){ mid(); return; }
    if (!warpEl){
      warpEl = document.createElement('div'); warpEl.className = 'hb-warp'; warpEl.setAttribute('aria-hidden', 'true');
      var h = ''; for (var n = 0; n < 70; n++) h += '<i style="--a:' + Math.round(Math.random() * 360) + 'deg;--d:' + (Math.random() * .25).toFixed(2) + 's;--l:' + (30 + Math.random() * 50).toFixed(0) + 'vmax"></i>';
      warpEl.innerHTML = h + '<b></b>'; document.body.appendChild(warpEl);
    }
    warpEl.classList.remove('is-on'); warpEl.classList.toggle('is-back', !!back); void warpEl.offsetWidth; warpEl.classList.add('is-on');
    setTimeout(mid, 480);
    setTimeout(function(){ warpEl.classList.remove('is-on'); }, 1150);
  }
  // abort: warp back out, drop the pinned route, land on the planner with the trajectory still set
  function abortFlight(){
    warp(function(){
      if (fst){ fst.kill(true); fst = null; }
      window.__abMissionST = null;
      fsec.classList.remove('is-open', 'is-landed'); fsel = []; landed = false; fk = -2;
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      goTo($('#trajectory'), true, 20);
      drawPlan(false);
      toast('Mission aborted · back to the planner');
    }, true);
  }
  function launchFlight(){
    var chosen = sel(); if (!chosen.length || !fsec) return;
    fsel = chosen.slice();
    warp(function(){
      fill(fsel); fsec.classList.add('is-open');
      fbuild();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      goTo(fsec, true);
      drawPlan(false);
      toast('Flight plan plotted · ' + fsel.map(function(j){ return HUB[j].code; }).join(' + '));
    });
  }
  // width changes only on touch screens: the phone address bar resizes the height while scrolling and a rebuild reset the route
  var frT, frW = innerWidth; addEventListener('resize', function(){ if (!flightOpen() || (coarse && innerWidth === frW)) return; frW = innerWidth; clearTimeout(frT); frT = setTimeout(function(){ fbuild(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250); });

  drawPlan(false);
  // test-only: ?fly=0,5,2 launches that trajectory; ?p=0..1 sets the flight position
  (function(){
    var q = location.search.match(/[?&]fly=([\d,]+)/); if (!q || !fsec) return;
    var ids = q[1].split(',').map(Number).filter(function(j){ return HUB[j]; }); if (!ids.length) return;
    main = ids[0]; stops = ids.slice(1, 3); drawPlan(false);
    fsel = sel(); fill(fsel); fsec.classList.add('is-open');
    var pm = location.search.match(/[?&]p=([\d.]+)/), pr = pm ? +pm[1] : 0;
    setTimeout(function(){ fbuild(); if (window.ScrollTrigger) ScrollTrigger.refresh(); if (fst && fwide){ gsap.set(track, { x: -(track.scrollWidth - innerWidth + 40) * pr }); ffly(pr * 1.02); } }, 400);
  })();
