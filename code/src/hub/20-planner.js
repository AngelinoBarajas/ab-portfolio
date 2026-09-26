  /* =========================================================
     PLOT A TRAJECTORY · main destination → up to 2 stops → launch (map + one planner panel that walks the steps)
     ========================================================= */
  var map = $('[data-hub-map]'), panel = $('[data-hub-planner]'), main = -1, stops = [];
  var EARTH = [5, 48], NS = 'http://www.w3.org/2000/svg';
  function pt(xy){ return [xy[0] * 10, xy[1] * 5.2]; }
  function arcD(a, b, bend){
    var A = pt(a), B = pt(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1];
    return 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + ' Q' + (mx - dy * bend).toFixed(1) + ' ' + (my + dx * bend).toFixed(1) + ' ' + B[0].toFixed(1) + ' ' + B[1].toFixed(1);
  }
  var itin = null, hint = null, ports = [];
  if (map){
    map.insertAdjacentHTML('beforeend', '<svg class="hb-map-svg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><g class="hb-arcs">' +
      ROUTES.map(function(r, k){ return '<path class="hb-arc" data-k="' + r.k + '" d="' + arcD(PORT[r.a], PORT[r.b], k % 2 ? .22 : -.22) + '"/>'; }).join('') +
      '</g><path class="hb-itin-path"/></svg>' +
      '<div class="hb-earth" style="left:' + EARTH[0] + '%;top:' + EARTH[1] + '%" aria-hidden="true"><i></i><span>Launch site · you</span></div>' +
      '<div class="hb-map-hint" aria-hidden="true"></div>');
    itin = $('.hb-itin-path', map); hint = $('.hb-map-hint', map);
    HUB.forEach(function(s){
      var xy = PORT[s.slug], b = document.createElement('button');
      b.type = 'button'; b.className = 'hb-port'; b.setAttribute('data-i', s.i); b.style.left = xy[0] + '%'; b.style.top = xy[1] + '%'; b.style.setProperty('--c', s.c);
      b.setAttribute('aria-label', s.code + ', ' + s.t1 + ' ' + s.t2); b.setAttribute('aria-pressed', 'false');
      b.appendChild(planetEl(s, 40 + s.i, 'hb-port-pl'));
      b.insertAdjacentHTML('beforeend', '<span class="hb-port-code">' + esc(s.code) + '</span><span class="hb-port-n">' + esc(s.short) + '</span><span class="hb-port-tag" aria-hidden="true"></span>');
      b.addEventListener('click', function(){ clickPort(s.i); });
      map.appendChild(b); ports.push(b);
    });
    onView(map, function(v){ if (v) $$('.hb-port-pl', map).forEach(build); }, { rootMargin: '600px' });
  }
  function sel(){ return main > -1 ? [main].concat(stops) : []; }
  function flownAll(list){ return FLIGHTS.filter(function(f){ return list.every(function(j){ return HUB[j].flown.indexOf(f.slug) > -1; }); }); }
  function why(a, b){ return WHY[pairKey(HUB[a].slug, HUB[b].slug)]; }
  function flownLinks(list){ return list.map(function(f){ return '<a href="' + misHref(f.slug) + '">' + esc(f.name) + '</a>'; }).join(' '); }
  function pickBtn(j){ var s = HUB[j]; return '<button type="button" data-pick="' + j + '" style="--c:' + s.c + '"' + (stops.length >= 2 && main > -1 ? ' disabled' : '') + '><i></i>' + esc(s.short) + ' <b>' + esc(s.code) + '</b></button>'; }

  var glided = false;
  function clickPort(i){
    if (main < 0){ main = i; }
    else if (i === main){ main = stops.length ? stops.shift() : -1; }
    else if (stops.indexOf(i) > -1){ stops.splice(stops.indexOf(i), 1); }
    else if (stops.length < 2){ stops.push(i); }
    else { toast('Two stops max · remove one first'); return; }
    drawPlan(true);
  }
  function drawPlan(animate){
    if (!map || !panel) return;
    var s = main > -1 ? HUB[main] : null, rec = s ? s.via.map(function(v){ return BY[v].i; }) : [];
    var step = main < 0 ? 1 : stops.length ? 3 : 2;
    $$('.ab_hub-step').forEach(function(li){ var n = +li.getAttribute('data-step'); li.classList.toggle('is-on', n === step); li.classList.toggle('is-done', n < step); });
    map.classList.toggle('has-main', main > -1);
    var side = innerWidth > 991, arr = side ? ' →' : ' ↓';
    hint.textContent = step === 1 ? 'Tap a planet, or pick in the panel' + arr : stops.length < 2 ? 'Next: add stops in the panel' + arr : 'Ready: launch from the panel' + arr;
    ports.forEach(function(p, j){
      var k = stops.indexOf(j), isRec = s && j !== main && k < 0 && rec.indexOf(j) > -1;
      p.classList.toggle('is-main', j === main); p.classList.toggle('is-stop', k > -1); p.classList.toggle('is-rec', !!isRec);
      p.classList.toggle('is-dim', !!s && j !== main && k < 0 && !isRec);
      $('.hb-port-tag', p).textContent = j === main ? 'Main' : k > -1 ? 'Stop ' + (k + 1) : isRec ? '+ Pairs well' : '';
      p.setAttribute('aria-pressed', j === main || k > -1);
    });
    var chosen = sel();
    $$('.hb-arc', map).forEach(function(a){
      var ks = a.getAttribute('data-k').split('|'), ai = BY[ks[0]].i, bi = BY[ks[1]].i;
      a.classList.toggle('is-lit', !!s && ((ai === main || bi === main) || (chosen.indexOf(ai) > -1 && chosen.indexOf(bi) > -1)));
    });
    // Earth → main → stops
    var d = '', from = EARTH;
    chosen.forEach(function(j, k){ var to = PORT[HUB[j].slug]; d += (k ? ' ' : '') + arcD(from, to, -.16); from = to; });
    if (d) itin.setAttribute('d', d); else itin.removeAttribute('d');
    itin.style.strokeDasharray = 'none';
    if (animate && d && !reduce && hasGsap){ var len = 0; try { len = itin.getTotalLength(); } catch (e){} if (len) gsap.fromTo(itin, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .9, ease: 'power2.out', onComplete: function(){ itin.style.strokeDasharray = 'none'; } }); }

    // the planner panel: one card that walks the steps
    var h = '<div class="hb-pl-h"><span>Trajectory · step ' + step + ' of 3</span>' + (s ? '<button type="button" data-reset>Start over</button>' : '') + '</div>';
    if (!s){
      h += '<div class="hb-pl-b is-next"><span class="hb-pl-tag">Next</span><p class="hb-pl-intro"><b>Where is the mission headed?</b> Pick the main destination: the one thing this project can\'t launch without. Tap a planet on the map, or pick here.</p>' +
        '<div class="hb-pl-pick">' + HUB.map(function(x){ return pickBtn(x.i); }).join('') + '</div></div>';
    } else {
      h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Main destination</span><span>AB-' + s.no + '</span></div><div class="hb-pl-main"><b>' + esc(s.code) + '</b><span>' + esc(s.t1 + ' ' + s.t2) + '<small>' + esc(s.best) + '</small></span></div></div>';
      h += '<div class="hb-pl-b' + (step === 2 ? ' is-next' : '') + '">' + (step === 2 ? '<span class="hb-pl-tag">Next</span>' : '') + '<div class="hb-pl-k"><span>Recommended stops · pair well with ' + esc(s.code) + '</span><span>' + stops.length + ' / 2</span></div><ul class="hb-pl-rec">' + rec.map(function(j){
          var o = HUB[j], inn = stops.indexOf(j) > -1, t = flownAll([main, j]);
          return '<li class="' + (inn ? 'is-in' : '') + '"><p><b>' + esc(o.short) + '.</b> ' + esc(why(main, j) || '') + '</p>' +
            '<button type="button" data-stop="' + j + '"' + (!inn && stops.length >= 2 ? ' disabled' : '') + '>' + (inn ? 'Remove' : '+ Add stop') + '</button>' +
            '<div class="hb-flown">' + (t.length ? 'Flown together · ' + flownLinks(t) : 'Not flown together yet') + '</div></li>';
        }).join('') + '</ul>';
      var others = HUB.filter(function(x){ return x.i !== main && rec.indexOf(x.i) < 0 && stops.indexOf(x.i) < 0; });
      if (others.length) h += '<div class="hb-pl-k" style="margin-top:16px"><span>Or any other stop</span></div><div class="hb-pl-pick">' + others.map(function(x){ return pickBtn(x.i); }).join('') + '</div>';
      h += '</div>';
      // the trajectory readout
      var legs = '<li style="--c:#1f6fb2"><b>Launch site · Earth</b><small>Your brief</small></li>' +
        '<li style="--c:' + s.c + '"><b>' + esc(s.short) + ' · ' + esc(s.code) + '</b><small>Main destination</small></li>';
      stops.forEach(function(j, k){
        var prev = k ? stops[k - 1] : main, w = why(prev, j) || why(main, j), o = HUB[j];
        legs += '<li style="--c:' + o.c + '" class="' + (w ? '' : 'is-custom') + '"><b>' + esc(o.short) + ' · ' + esc(o.code) + '</b><small>' + (w ? 'Stop ' + (k + 1) + ' · transfer orbit' : 'Stop ' + (k + 1) + ' · custom transfer, planned on the discovery call') + '</small>' + (w ? '<br>' + esc(w) : '') + '</li>';
      });
      var all = flownAll(chosen);
      h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Your trajectory</span><span>' + chosen.length + ' destination' + (chosen.length > 1 ? 's' : '') + '</span></div><ol class="hb-legs">' + legs + '</ol>' +
        '<div class="hb-flown" style="margin-top:14px">' + (all.length ? 'Flown before · ' + flownLinks(all) : 'No mission has flown this exact trajectory yet · yours could be first') + '</div></div>';
      h += '<div class="hb-pl-b' + (step === 3 ? ' is-next' : '') + '">' + (step === 3 ? '<span class="hb-pl-tag">Next</span>' : '') + '<div class="hb-pl-go">' +
        btnHTML('is-primary', '#flight', flightOpen() && fsel.join() === chosen.join() ? 'Fly it again' : 'Launch the flight plan', '→', ' data-launch') + '</div>' +
        '<p class="hb-pl-note">Your flight plan warps in below: six stages, re-plotted for this trajectory.</p></div>';
    }
    panel.innerHTML = h;
    if (animate && !reduce){ panel.classList.remove('is-ping'); void panel.offsetWidth; panel.classList.add('is-ping'); }
    if (animate && !side && step === 2 && !stops.length && !glided){ glided = true; setTimeout(function(){ goTo(panel, false, 80); }, 250); }
    $$('[data-pick]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.getAttribute('data-pick')); }); });
    $$('[data-stop]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.getAttribute('data-stop')); }); });
    var rs = $('[data-reset]', panel); if (rs) rs.addEventListener('click', function(){ main = -1; stops = []; drawPlan(false); });
    var go = $('[data-launch]', panel);
    if (go) go.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); launchFlight(); });
  }
