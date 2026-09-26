  /* =========================================================
     SERVICES HUB · interactions
     ========================================================= */
  (function(){
    var page = $('.hb-page'); if (!page) return;
    var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
    var cur = -1, now = -1;
    var screen = $('#hbScreen'), rows = $$('.hb-row'), sws = $$('.hb-key');
    function rnd(seed){ var s = seed; return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
    function hash(t){ var h = 7; for (var k = 0; k < t.length; k++) h = (h * 31 + t.charCodeAt(k)) % 100003; return h; }

    /* ---------- phosphor readout: size the characters to the screen ---------- */
    function units(row, skipStatus){
      var n = 0, cols = 0;
      $$('.hb-cell', row).forEach(function(c){ if (c.offsetParent !== null && !(skipStatus && c.dataset.col === 'status')){ n += +c.style.getPropertyValue('--n'); cols++; } });
      return { n: n, cols: cols };
    }
    function tileSize(){
      if (screen){
        var u = units(rows[0]), goW = $('.hb-go', rows[0]).offsetWidth, w = $('#hbRows').clientWidth - 18 - goW;
        // cells + cursor + the gaps between them; the labeled Explore button keeps its own width
        var cw = w / (u.n + 1 + (u.cols + 1.6) * .9);
        screen.style.setProperty('--cw', Math.max(8, Math.min(22, Math.floor(cw * 10) / 10)) + 'px');
      }
      var call = $('.hb-call-row');
      if (call){
        var phone = innerWidth <= 700, cu = units(call, phone), cwid = Math.min(call.parentNode.parentNode.clientWidth, 900) - 52;
        var cc = cwid / (cu.n + 1.6 + (cu.cols + 1) * .9);
        call.style.setProperty('--cw', Math.max(8, Math.min(16, Math.floor(cc * 10) / 10)) + 'px');
      }
      // after a print the pass keeps GSAP's transform (same tilt); drop it on resize so each breakpoint's tilt applies
      var ps = $('#hbPass'); if (ps && hasGsap && !gsap.isTweening(ps)) gsap.set(ps, { clearProps: 'transform' });
      hang();
    }
    // the pass hangs into the trajectory section: that section's top padding follows the pass's real height
    function hang(){
      var print = $('#hbPrint'), sec = $('.hb-map-sec'); if (!print || !sec) return;
      // the wrapper's layout box (the pass's own rect includes its print transform)
      var over = print.getBoundingClientRect().bottom + 6 - sec.getBoundingClientRect().top;
      sec.style.paddingTop = Math.round(Math.max(0, over) + Math.max(64, Math.min(130, innerWidth * .09))) + 'px';
    }
    // digital scramble: each character cycles through glyphs, then lands
    function glitchTo(el, ch, steps, delay){
      ch = ch === ' ' ? ' ' : ch;
      if (el.textContent === ch && !steps) return;
      if (reduce){ el.textContent = ch; return; }
      var k = 0;
      setTimeout(function step(){
        if (k < steps){ el.textContent = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); el.classList.add('is-glitch'); k++; setTimeout(step, 38); }
        else { el.textContent = ch; el.classList.remove('is-glitch'); }
      }, delay || 0);
    }
    function setCell(cell, txt, delay){
      $$('.hb-fl', cell).forEach(function(t, k){ var ch = (txt.charAt(k) || ' ').toUpperCase(); if ((t.textContent === ch) || (ch === ' ' && t.textContent === ' ')) return; glitchTo(t, ch, 2 + Math.floor(Math.random() * 4), (delay || 0) + k * 16); });
    }
    function status(i, txt, delay){ setCell($('.hb-c-status', rows[i]), txt, delay); }
    function baseStatus(i){ return baseStatusText(HUB[i]); }
    function syncStates(){
      rows.forEach(function(r, j){ r.classList.toggle('is-on', j === cur); r.classList.toggle('is-now', j === now); $('.hb-row-b', r).setAttribute('aria-pressed', j === cur); });
      sws.forEach(function(s, j){ s.setAttribute('aria-pressed', j === cur); s.classList.toggle('is-now', j === now); });
      tele();
    }
    // side console telemetry follows the armed launch
    function tele(){
      var s = HUB[cur]; if (!s || !$('#hbTeleN')) return;
      $('#hbTeleN').textContent = 'AB-' + s.no; $('#hbTeleD').textContent = s.code; $('#hbTeleO').textContent = s.p[0].toUpperCase(); $('#hbTeleT').textContent = s.via.length;
      var st = $('#hbTeleS'), pri = cur === now; st.textContent = pri ? 'PRIORITY' : s.slug === 'custom-deploys' ? 'ON REQUEST' : 'GO'; st.className = pri ? 'is-pri' : 'ok';
    }
    // the prompt line types itself out
    var promptT;
    function prompt(txt){
      var el = $('#hbPrompt'); if (!el) return;
      clearTimeout(promptT);
      if (reduce){ el.textContent = '> ' + txt; return; }
      var full = '> ' + txt, k = 0;
      (function type(){ el.textContent = full.slice(0, k); if (k++ < full.length) promptT = setTimeout(type, 18); })();
    }

    /* ---------- launch pass ---------- */
    function repaint(el, s, seed){
      el.innerHTML = ''; el.__built = false; el.__body = null;
      el.setAttribute('data-planet', s.p[0]); el.setAttribute('data-colors', s.p[1]); el.setAttribute('data-glow', s.p[3]); el.setAttribute('data-seed', seed);
      if (s.p[2]){ el.setAttribute('data-ring', s.p[2]); el.setAttribute('data-tilt', '-16'); } else el.removeAttribute('data-ring');
      buildPlanet(el);
    }
    // a pixel "scan to board" code, seeded by the slug (decorative)
    function qr(slug){
      var r = rnd(hash(slug)), N = 21, o = '';
      function finder(x0, y0){ return '<path d="M' + x0 + ' ' + y0 + 'h7v7h-7z M' + (x0 + 1) + ' ' + (y0 + 1) + 'v5h5v-5z M' + (x0 + 2) + ' ' + (y0 + 2) + 'h3v3h-3z" fill-rule="evenodd"/>'; }
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++){
        var inF = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        if (!inF && r() > .52) o += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
      return '<svg viewBox="0 0 21 21" shape-rendering="crispEdges">' + finder(0, 0) + finder(14, 0) + finder(0, 14) + o + '</svg>';
    }
    function fillPass(s, skipHero){
      var pass = $('#hbPass'); pass.style.setProperty('--c', s.c);
      $('#hbPFlight').textContent = 'AB-' + s.no; $('#hbPCode').textContent = s.code;
      $('#hbPT').innerHTML = '<span>' + esc(s.t1) + '</span><span class="t-outline">' + esc(s.t2) + '</span>';
      $('#hbPS').textContent = s.sum; $('#hbPBest').textContent = s.best;
      $('#hbPGate').textContent = { gas: 'Gas giant', ice: 'Ice giant', rocky: 'Rocky world', terra: 'Terra world' }[s.p[0]];
      $('#hbPVia').textContent = s.via.map(function(v){ return BY[v].short; }).join(' · ');
      $('#hbPTools').innerHTML = s.tools.map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('');
      $('#hbPTL').href = SVC + s.slug;
      var stub = $('#hbPStub'); stub.href = SVC + s.slug; stub.setAttribute('aria-label', 'Board the launch: ' + s.t1 + ' ' + s.t2 + ' service page');
      $('#hbSCode').textContent = s.code; $('#hbSFlight').textContent = 'AB-' + s.no;
      $('#hbSQr').innerHTML = qr(s.slug);
      repaint($('#hbPPlanet'), s, 80 + s.i);
      if (!skipHero) heroPlanet(s);
    }
    function heroPlanet(s){
      var hp = $('#hbHeroPlanet'); if (hp){ hp.setAttribute('data-label', 'Go for launch · ' + s.short); repaint(hp, s, 11 + s.i); }
    }
    // heavy work (planet textures) waits until the pass has settled, so the landing frame stays smooth
    function later(fn){ setTimeout(function(){ if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 600 }); else fn(); }, 250); }
    function print(i, quiet){
      if (i === cur) return;
      var prev = cur; cur = i; var s = HUB[i];
      syncStates();
      if (prev > -1 && prev !== now) status(prev, baseStatus(prev));
      if (i !== now) status(i, 'GO FOR LAUNCH', 60);
      if (!quiet) prompt('AB-' + s.no + ' ' + s.short.toUpperCase() + ' ARMED · PRINTING LAUNCH PASS');
      var pass = $('#hbPass'), board = $('.hb-board');
      if (quiet || reduce || !hasGsap){ fillPass(s); hang(); return; }
      board.classList.add('is-printing');
      gsap.killTweensOf(pass);
      // transform only: the pass slides back up into the slot, is refilled while hidden, then feeds out smoothly.
      // .hb-print clips everything above the slot, so no clip-path is animated (it repaints the drop shadow every frame)
      gsap.timeline({ onComplete: function(){ board.classList.remove('is-printing'); later(function(){ if (cur === i) heroPlanet(s); }); prompt('AB-' + s.no + ' PASS PRINTED · EXPLORE THE SERVICE FROM THE PASS'); } })
        .to(pass, { yPercent: -100, y: -30, rotationX: 12, rotationY: 0, duration: prev > -1 ? .32 : 0, ease: 'power2.in' })
        .add(function(){ fillPass(s, true); hang(); })
        .to(pass, { yPercent: 0, y: 0, rotationX: 0, duration: 1, ease: 'power3.out', delay: .06 });
    }

    // glass pieces (launch slate, crew logbook) tilt toward the pointer like the site's cards (AB.cardFx),
    // with a glare that follows it; --tx/--ty let children (badges) drift against the tilt. skip() pauses the tilt (printing, page turns)
    function glass(el, skip){
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect(), gx = (e.clientX - r.left) / r.width, gy = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (gx * 100) + '%'); el.style.setProperty('--my', (gy * 100) + '%'); el.style.setProperty('--gx', (gx - .5).toFixed(3));
        if (reduce || !hasGsap || coarse || e.buttons || skip()) return;
        el.style.setProperty('--tx', ((.5 - gx) * 8).toFixed(1) + 'px'); el.style.setProperty('--ty', ((.5 - gy) * 6).toFixed(1) + 'px');
        gsap.to(el, { rotationY: (gx - .5) * 6, rotationX: (.5 - gy) * 6, transformPerspective: 1000, duration: .5, ease: 'power2.out', overwrite: 'auto' });
      });
      el.addEventListener('pointerleave', function(){ el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); if (hasGsap && !skip()) gsap.to(el, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)', overwrite: 'auto' }); });
      el.addEventListener('pointerdown', function(){ if (hasGsap && !skip()) gsap.to(el, { rotationY: 0, rotationX: 0, duration: .3, overwrite: 'auto' }); });
    }
    /* ---------- screen rows + launch keys ---------- */
    rows.forEach(function(r, i){
      var b = $('.hb-row-b', r);
      b.addEventListener('click', function(){ print(i); });
      b.addEventListener('keydown', function(e){
        var n = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!n) return;
        e.preventDefault(); $('.hb-row-b', rows[(i + n + rows.length) % rows.length]).focus();
      });
      if (!coarse){
        r.addEventListener('mouseenter', function(){ peek(i); });
        r.addEventListener('mouseleave', function(){ peek(-1); });
      }
    });
    sws.forEach(function(s, i){ s.addEventListener('click', function(){ print(i); }); });
    glass($('#hbPass'), function(){ return $('.hb-board').classList.contains('is-printing'); });
    function peek(i){
      var wrap = $('.hb-board-wrap');
      $$('.hb-peek').forEach(function(p, j){
        if (j === i){ var rr = rows[i].getBoundingClientRect(), wr = wrap.getBoundingClientRect(); p.style.setProperty('--y', (rr.top - wr.top + rr.height / 2) + 'px'); }
        p.classList.toggle('is-on', j === i);
      });
    }

    /* ---------- diagnostics: the matching launch goes PRIORITY GO ---------- */
    $$('.hb-chip').forEach(function(c){
      c.addEventListener('click', function(){
        var i = +c.dataset.i, was = now, old = cur;
        $$('.hb-chip').forEach(function(x){ if (!x.classList.contains('is-reset')) x.setAttribute('aria-pressed', x === c); });
        now = i;
        if (i > -1){
          if (old > -1 && old !== i) status(old, baseStatus(old));
          if (was > -1 && was !== i && was !== old) status(was, baseStatus(was));
          status(i, 'PRIORITY GO', 60);
          cur = -1; print(i, false);
          prompt('DIAGNOSTIC MATCH · AB-' + HUB[i].no + ' ' + HUB[i].short.toUpperCase() + ' · PRIORITY GO');
          toast('Priority go · ' + HUB[i].t1 + ' ' + HUB[i].t2);
        } else {
          if (was > -1) status(was, was === cur ? 'GO FOR LAUNCH' : baseStatus(was));
          prompt('ALL CLEAR · SELECT A LAUNCH TO ARM');
        }
        syncStates();
      });
    });

    /* ---------- clock ---------- */
    function tick(){ try { $('#hbClock').textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: S0.timezone }); } catch (e){} }
    tick(); setInterval(tick, 15000);

    /* ---------- first paint: the manifest types in ---------- */
    tileSize(); addEventListener('resize', tileSize); addEventListener('load', hang);
    if (!reduce){
      rows.forEach(function(r, i){
        var t = boardText(HUB[i]);
        COLS.forEach(function(c){ var cell = $('.hb-c-' + c.k, r); $$('.hb-fl', cell).forEach(function(f){ f.textContent = ' '; }); setCell(cell, c.k === 'status' && i === 0 ? 'GO FOR LAUNCH' : t[c.k], 500 + i * 90); });
      });
    }
    print(0, true);
    if (reduce) status(0, 'GO FOR LAUNCH');
    prompt('AB-01 ARMED · CLICK A LAUNCH FOR ITS PASS · EXPLORE OPENS THE SERVICE');

    /* ---------- plot a trajectory: main destination → up to 2 stops → launch ---------- */
    var map = $('#hbMap'), main = -1, stops = [];
    var EARTH = [5, 48];
    function pt(xy){ return [xy[0] * 10, xy[1] * 5.2]; }
    function arcD(a, b, bend){
      var A = pt(a), B = pt(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1];
      return 'M' + A[0].toFixed(1) + ' ' + A[1].toFixed(1) + ' Q' + (mx - dy * bend).toFixed(1) + ' ' + (my + dx * bend).toFixed(1) + ' ' + B[0].toFixed(1) + ' ' + B[1].toFixed(1);
    }
    $('#hbArcs').innerHTML = ROUTES.map(function(r, k){ return '<path class="hb-arc" data-k="' + r.k + '" d="' + arcD(PORT[r.a], PORT[r.b], k % 2 ? .22 : -.22) + '"/>'; }).join('');
    function sel(){ return main > -1 ? [main].concat(stops) : []; }
    function flownAll(list){ return FLIGHTS.filter(function(f){ return list.every(function(j){ return HUB[j].flown.indexOf(f.slug) > -1; }); }); }
    function why(a, b){ return WHY[pairKey(HUB[a].slug, HUB[b].slug)]; }
    function flownLinks(list){ return list.map(function(f){ return '<a href="' + misHref(f.slug) + '">' + esc(f.name) + '</a>'; }).join(' '); }
    function pickBtn(j){ var s = HUB[j]; return '<button type="button" data-pick="' + j + '" style="--c:' + s.c + '"' + (stops.length >= 2 && main > -1 ? ' disabled' : '') + '><i></i>' + esc(s.short) + ' <b>' + s.code + '</b></button>'; }

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
      var s = main > -1 ? HUB[main] : null, rec = s ? s.via.map(function(v){ return BY[v].i; }) : [];
      var step = main < 0 ? 1 : stops.length ? 3 : 2;
      $$('#hbSteps li').forEach(function(li){ var n = +li.dataset.step; li.classList.toggle('is-on', n === step); li.classList.toggle('is-done', n < step); });
      map.classList.toggle('has-main', main > -1);
      var side = innerWidth > 991, arr = side ? ' →' : ' ↓';
      $('#hbHint').textContent = step === 1 ? 'Tap a planet, or pick in the panel' + arr : stops.length < 2 ? 'Next: add stops in the panel' + arr : 'Ready: launch from the panel' + arr;
      $$('.hb-port').forEach(function(p, j){
        var k = stops.indexOf(j), isRec = s && j !== main && k < 0 && rec.indexOf(j) > -1;
        p.classList.toggle('is-main', j === main); p.classList.toggle('is-stop', k > -1); p.classList.toggle('is-rec', !!isRec);
        p.classList.toggle('is-dim', !!s && j !== main && k < 0 && !isRec);
        $('.hb-port-tag', p).textContent = j === main ? 'Main' : k > -1 ? 'Stop ' + (k + 1) : isRec ? '+ Pairs well' : '';
        p.setAttribute('aria-pressed', j === main || k > -1);
      });
      var chosen = sel();
      $$('.hb-arc').forEach(function(a){
        var ks = a.getAttribute('data-k').split('|'), ai = BY[ks[0]].i, bi = BY[ks[1]].i;
        a.classList.toggle('is-lit', !!s && ((ai === main || bi === main) || (chosen.indexOf(ai) > -1 && chosen.indexOf(bi) > -1)));
      });
      // Earth → main → stops
      var d = '', from = EARTH;
      chosen.forEach(function(j, k){ var to = PORT[HUB[j].slug]; d += (k ? ' ' : '') + arcD(from, to, -.16); from = to; });
      var path = $('#hbItinPath'); path.setAttribute('d', d); path.style.strokeDasharray = 'none';
      if (animate && d && !reduce && hasGsap){ var len = 0; try { len = path.getTotalLength(); } catch (e){} if (len) gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: .9, ease: 'power2.out', onComplete: function(){ path.style.strokeDasharray = 'none'; } }); }

      // the planner panel: one card that walks the steps
      var h = '<div class="hb-pl-h"><span>Trajectory · step ' + step + ' of 3</span>' + (s ? '<button type="button" data-reset>Start over</button>' : '') + '</div>';
      if (!s){
        h += '<div class="hb-pl-b is-next"><span class="hb-pl-tag mono">Next</span><p class="hb-pl-intro"><b>Where is the mission headed?</b> Pick the main destination: the one thing this project can\'t launch without. Tap a planet on the map, or pick here.</p>' +
          '<div class="hb-pl-pick">' + HUB.map(function(x){ return pickBtn(x.i); }).join('') + '</div></div>';
      } else {
        h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Main destination</span><span>AB-' + s.no + '</span></div><div class="hb-pl-main"><b>' + s.code + '</b><span>' + esc(s.t1 + ' ' + s.t2) + '<small>' + esc(s.best) + '</small></span></div></div>';
        h += '<div class="hb-pl-b' + (step === 2 ? ' is-next' : '') + '">' + (step === 2 ? '<span class="hb-pl-tag mono">Next</span>' : '') + '<div class="hb-pl-k"><span>Recommended stops · pair well with ' + s.code + '</span><span>' + stops.length + ' / 2</span></div><ul class="hb-pl-rec">' + rec.map(function(j){
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
          '<li style="--c:' + s.c + '"><b>' + esc(s.short) + ' · ' + s.code + '</b><small>Main destination</small></li>';
        stops.forEach(function(j, k){
          var prev = k ? stops[k - 1] : main, w = why(prev, j) || why(main, j), o = HUB[j];
          legs += '<li style="--c:' + o.c + '" class="' + (w ? '' : 'is-custom') + '"><b>' + esc(o.short) + ' · ' + o.code + '</b><small>' + (w ? 'Stop ' + (k + 1) + ' · transfer orbit' : 'Stop ' + (k + 1) + ' · custom transfer, planned on the discovery call') + '</small>' + (w ? '<br>' + esc(w) : '') + '</li>';
        });
        var all = flownAll(chosen);
        h += '<div class="hb-pl-b"><div class="hb-pl-k"><span>Your trajectory</span><span>' + chosen.length + ' destination' + (chosen.length > 1 ? 's' : '') + '</span></div><ol class="hb-legs">' + legs + '</ol>' +
          '<div class="hb-flown" style="margin-top:14px">' + (all.length ? 'Flown before · ' + flownLinks(all) : 'No mission has flown this exact trajectory yet · yours could be first') + '</div></div>';
        h += '<div class="hb-pl-b' + (step === 3 ? ' is-next' : '') + '">' + (step === 3 ? '<span class="hb-pl-tag mono">Next</span>' : '') + '<div class="hb-pl-go"><a class="btn btn-primary magnetic" id="hbItinGo" href="#flight"><span class="shine" aria-hidden="true"></span><span>' + (fsec && !fsec.hidden && fsel.join() === chosen.join() ? 'Fly it again' : 'Launch the flight plan') + '</span><span class="arr" aria-hidden="true">→</span></a></div>' +
          '<p class="hb-pl-note">Your flight plan warps in below: six stages, re-plotted for this trajectory.</p></div>';
      }
      var panel = $('#hbPlanner'); panel.innerHTML = h;
      if (animate && !reduce){ panel.classList.remove('is-ping'); void panel.offsetWidth; panel.classList.add('is-ping'); }
      if (animate && !side && step === 2 && !stops.length && !glided){ glided = true; setTimeout(function(){ goTo(panel, false, 80); }, 250); }
      $$('[data-pick]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.dataset.pick); }); });
      $$('[data-stop]', panel).forEach(function(b){ b.addEventListener('click', function(){ clickPort(+b.dataset.stop); }); });
      var rs = $('[data-reset]', panel); if (rs) rs.addEventListener('click', function(){ main = -1; stops = []; drawPlan(false); });
      var go = $('#hbItinGo', panel);
      if (go) go.addEventListener('click', function(e){ e.preventDefault(); launchFlight(); });
    }
    $$('.hb-port').forEach(function(p){ p.addEventListener('click', function(){ clickPort(+p.dataset.i); }); });
    drawPlan(false);

    /* ---------- your flight plan: the trajectory warps into the Process route, right here on the page ---------- */
    var fsec = $('#flight'), fst = null, fsel = [], fpts = [], flen = 0, fwide = false, fk = -2, landed = false;
    var SHIP = '<svg viewBox="0 0 44 44"><path class="hbf-flame" d="M6 22 L-8 17 L-4 22 L-8 27 Z" fill="#FF6A3D"/><path d="M6 14 H26 L40 22 L26 30 H6 Z" fill="#F2F0EA"/><path d="M14 14 L10 6 H18 L22 14 Z M14 30 L10 38 H18 L22 30 Z" fill="#8A8FA3"/><circle cx="28" cy="22" r="3.5" fill="#4C8DFF"/></svg>';
    function flightHTML(sel){
      var m = HUB[sel[0]], st = sel.slice(1).map(function(j){ return HUB[j]; });
      var fm = flownAll(sel)[0] || (m.flown.length ? FBY[m.flown[0]] : null);
      var names = st.length ? ', with ' + (st.length > 1 ? 'stops at ' : 'a stop at ') + st.map(function(o){ return esc(o.short); }).join(' and ') : '';
      return '<div class="wrap hbf-head"><div class="section-head" style="margin:0"><span class="eyebrow">/flight plan · ' + sel.map(function(j){ return HUB[j].code; }).join(' + ') + '</span><h2 class="h2">Your flight <span class="t-outline">plan</span></h2><p class="lede">Six stages, re-plotted for ' + esc(m.short) + names + '. Scroll to fly it.</p></div>' +
        '<div class="hbf-acts"><button type="button" class="btn btn-ghost magnetic" data-edit><span>Edit trajectory</span><span class="arr" aria-hidden="true">↑</span></button>' +
        '<button type="button" class="btn btn-ghost magnetic hbf-abort" data-abort><span>Abort mission</span><span class="arr" aria-hidden="true">✕</span></button></div></div>' +
        '<div class="hbf-wrap"><div class="hbf-hud mono" aria-live="polite"><b id="hbfN">T−6</b><span id="hbfL">On the pad</span></div><div class="hbf-track' + (st.length > 1 ? ' has-2' : '') + '" id="hbfTrack" style="--c:' + m.c + '">' +
          '<svg class="hbf-path" id="hbfPath" aria-hidden="true"><path class="hbf-line" id="hbfLine"/><path class="hbf-lit" id="hbfLit"/></svg>' +
          '<div class="hbf-pad" id="hbfPad" aria-hidden="true"><div class="pwrap" data-planet="terra" data-seed="7" data-colors="#0b2a4a,#1f6fb2,#3fa66b,#a88b5c,#f2f0ea" data-spin="80" data-glow="rgba(76,141,255,.35)"></div><span>Earth · your brief</span></div>' +
          '<div class="hbf-ship" id="hbfShip" aria-hidden="true">' + SHIP + '</div>' +
          STAGES.map(function(s, i){
            return '<div class="hbf-wp"><span class="hbf-node" aria-hidden="true"></span><article class="hbf-card">' +
              '<div class="hbf-card-c"><span><b>T−' + (5 - i) + '</b> · ' + s.code + '</span><span>' + (i + 1) + ' / 6</span></div>' +
              '<h3>' + s.name + '</h3><p>' + s.copy + '</p>' +
              '<div class="hbf-leg" style="--lc:' + m.c + '"><small>For ' + esc(m.short) + '</small>' + esc(LEGS[m.slug][i]) + '</div>' +
              st.map(function(o){ return '<div class="hbf-leg is-stop" style="--lc:' + o.c + '"><small>+ Stop · ' + esc(o.short) + '</small>' + esc(LEGS[o.slug][i]) + '</div>'; }).join('') +
              '<dl><div><dt>You get</dt><dd>' + s.get + '</dd></div><div><dt>Your part</dt><dd>' + s.you + '</dd></div></dl>' +
              (fm ? '<a class="hbf-flown" href="' + misHref(fm.slug) + '">See ' + s.flown + ' · ' + esc(fm.name) + ' <span aria-hidden="true">→</span></a>' : '<span class="hbf-flown is-none">No mission flown here yet · yours could be first</span>') +
            '</article></div>';
          }).join('') +
          '<div class="hbf-dock" id="hbfDock"><span class="hbf-shock" aria-hidden="true"></span><div class="pwrap hbf-dock-pl" ' + hubPlanet(m, 90) + ' aria-hidden="true"></div>' +
            st.map(function(o, k){ return '<span class="hbf-moon" style="--c:' + o.c + ';--a:' + (k * 150 + 25) + 'deg" aria-hidden="true"><i></i><em>' + o.code + '</em></span>'; }).join('') +
            '<div class="hbf-live"><span class="mono">Touchdown · ' + m.code + '</span><b>Mission <span class="t-outline">live</span></b>' +
            '<div class="hbf-live-a"><a class="btn btn-primary magnetic" href="' + PROC + '#launch" data-req><span class="shine" aria-hidden="true"></span><span>Request this mission</span><span class="arr" aria-hidden="true">→</span></a><a class="btn btn-ghost magnetic" href="' + HOME + '#launch"><span>Book a call</span></a></div></div></div>' +
        '</div></div>';
    }
    function flayout(){
      var track = $('#hbfTrack'); if (!track) return;
      fwide = innerWidth > 860;
      $$('.hbf-wp', track).forEach(function(w){ w.style.left = w.style.top = ''; });
      var dock = $('#hbfDock');
      if (!fwide){ track.style.width = ''; dock.style.left = dock.style.top = ''; return; }
      var h = track.offsetHeight, step = Math.max(360, innerWidth * .28), x0 = Math.min(240, innerWidth * .16);
      var dockX = x0 + step * STAGES.length + innerWidth * .22, W = dockX + innerWidth * .45, CARD_TOP = 150;
      var svg = $('#hbfPath'), line = $('#hbfLine'), lit = $('#hbfLit');
      track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
      fpts = [[x0 * .45, 84]];
      STAGES.forEach(function(s, i){ fpts.push([x0 + step * i + step * .35, i % 2 ? 112 : 46]); });
      fpts.push([dockX, 84]);
      var d = 'M' + fpts[0][0] + ' ' + fpts[0][1];
      for (var i = 1; i < fpts.length; i++){ var p = fpts[i - 1], q = fpts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
      line.setAttribute('d', d); lit.setAttribute('d', d); flen = line.getTotalLength();
      lit.style.strokeDasharray = flen; lit.style.strokeDashoffset = flen;
      var pad = $('#hbfPad'); pad.style.left = fpts[0][0] + 'px'; pad.style.top = fpts[0][1] + 'px';
      dock.style.left = dockX + 'px'; dock.style.top = '84px';
      $$('.hbf-wp', track).forEach(function(w, i){
        var p = fpts[i + 1];
        w.style.left = (p[0] - 48) + 'px'; w.style.top = CARD_TOP + 'px';
        w.style.setProperty('--ny', (p[1] - CARD_TOP) + 'px');
        $('.hbf-node', w).style.left = '48px'; $('.hbf-node', w).style.top = (p[1] - CARD_TOP) + 'px';
      });
    }
    function fstage(k){
      if (k === fk) return; fk = k;
      $$('.hbf-wp').forEach(function(w, i){ w.classList.toggle('is-on', i <= k); });
      $('#hbfN').textContent = 'T−' + Math.max(0, 5 - k);
      $('#hbfL').textContent = k < 0 ? 'On the pad' : STAGES[k].code + (k === 5 ? ' · liftoff' : '');
    }
    function land(on){
      if (on === landed) return; landed = on;
      fsec.classList.toggle('is-landed', on);
      if (!on) return;
      $('#hbfN').textContent = 'T+0'; $('#hbfL').textContent = 'Touchdown';
      if (reduce || !hasGsap) return;
      var dock = $('#hbfDock'), cols = sel().map(function(j){ return HUB[j].c; }).concat(['#FF6A3D', '#F2F0EA']);
      for (var n = 0; n < 34; n++){
        var b = document.createElement('i'); b.className = 'hbf-bit'; b.style.background = cols[n % cols.length]; dock.appendChild(b);
        var a = Math.random() * Math.PI * 2, r = 90 + Math.random() * 160;
        gsap.fromTo(b, { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: Math.cos(a) * r, y: Math.sin(a) * r - 40, rotation: Math.random() * 540, opacity: 0, duration: 1.2 + Math.random() * .6, ease: 'power2.out', onComplete: function(){ this.targets()[0].remove(); } });
      }
    }
    function ffly(prog){
      if (!fwide) return;
      var line = $('#hbfLine'), ship = $('#hbfShip'), lit = $('#hbfLit');
      // the ship stops at the planet's surface, not its center
      var at = Math.max(0, Math.min(1, prog)) * (flen - 92), p = line.getPointAtLength(at), p2 = line.getPointAtLength(Math.min(flen, at + 2));
      ship.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI) + 'deg)';
      lit.style.strokeDashoffset = flen - at;
      var k = -1; fpts.slice(1, 7).forEach(function(q, i){ if (p.x >= q[0] - 4) k = i; });
      if (prog < .97) fstage(k);
      land(prog >= .99);
    }
    function fbuild(){
      if (fst){ fst.kill(true); fst = null; }
      var track = $('#hbfTrack'); if (!track) return;
      gsap.set(track, { x: 0 }); fk = -2; landed = false; fsec.classList.remove('is-landed');
      flayout();
      if (!hasGsap || !window.ScrollTrigger) return;
      if (fwide){
        var dist = function(){ return track.scrollWidth - innerWidth + 40; };
        fst = ScrollTrigger.create({ trigger: fsec, start: 'top top', end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
          onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); ffly(self.progress * 1.02); } });
        ffly(0);
        window.__abMissionST = fst;
      } else {
        // phones: the route is a vertical rail; stages light as they cross the middle, touchdown when the planet shows
        fst = ScrollTrigger.create({ trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true,
          onUpdate: function(self){ var k = -1, mid = innerHeight * .6; $$('.hbf-wp').forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); fstage(k); land(self.progress > .98); } });
      }
    }
    // Lenis gets a number, not an element (element targets misfire with transformed/pinned content)
    function goTo(el, instant, off){ var y = el.getBoundingClientRect().top + scrollY - (off == null ? 0 : off); try { if (lenis){ lenis.scrollTo(y, { immediate: !!instant }); return; } } catch (e){} window.scrollTo({ top: y, behavior: instant || reduce ? 'auto' : 'smooth' }); }
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
        fsec.hidden = true; fsec.innerHTML = ''; fsel = []; landed = false; fk = -2; fsec.classList.remove('is-landed');
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        goTo($('#trajectory'), true, 20);
        drawPlan(false);
        toast('Mission aborted · back to the planner');
      }, true);
    }
    function launchFlight(){
      var chosen = sel(); if (!chosen.length) return;
      fsel = chosen.slice();
      warp(function(){
        fsec.innerHTML = flightHTML(fsel); fsec.hidden = false;
        $$('.pwrap', fsec).forEach(function(el){ buildPlanet(el); });
        $('[data-edit]', fsec).addEventListener('click', function(){ goTo($('#trajectory'), false, 20); });
        $('[data-abort]', fsec).addEventListener('click', abortFlight);
        $('[data-req]', fsec).addEventListener('click', function(){ try { localStorage.setItem('ab:dest', String(fsel[0])); } catch (err){} });
        fbuild();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        goTo(fsec, true);
        drawPlan(false);
        toast('Flight plan plotted · ' + fsel.map(function(j){ return HUB[j].code; }).join(' + '));
      });
    }
    var frT; addEventListener('resize', function(){ if (fsec.hidden) return; clearTimeout(frT); frT = setTimeout(function(){ fbuild(); ScrollTrigger.refresh(); }, 250); });

    // test-only (headless shots): ?fly=0,5,2 launches that trajectory; ?p=0..1 sets the flight position; ?at=flight-plan hides the sections above it
    (function(){
      var q = new URLSearchParams(location.search); if (!q.get('fly')) return;
      var ids = q.get('fly').split(',').map(Number); main = ids[0]; stops = ids.slice(1); drawPlan(false);
      fsel = sel(); fsec.innerHTML = flightHTML(fsel); fsec.hidden = false;
      if (document.documentElement.getAttribute('data-shot') === 'flight-plan') $$('#hub > section').forEach(function(x){ if (x !== fsec && x.compareDocumentPosition(fsec) & 4) x.style.display = 'none'; });
      $$('.pwrap', fsec).forEach(function(el){ buildPlanet(el); });
      setTimeout(function(){ fbuild(); var pr = +(q.get('p') || 0); if (fst) fst.disable(false); var tr = $('#hbfTrack'); gsap.set(tr, { x: -(tr.scrollWidth - innerWidth + 40) * pr }); ffly(pr * 1.02); }, 400);
    })();

    /* ---------- crew logbook: one spread per mission, patches sewn on ---------- */
    var pp = $('#hbPP'), spread = 0, seen = false, busy = false;
    function logLine(f){
      var l1 = ('AB SPACEPORT // CREW LOG // MISSION ' + f.no + ' // ' + f.name.toUpperCase() + ' //////////////////////////////').slice(0, 46);
      var l2 = ('PATCHES ' + (f.svc.length ? f.svc.map(function(s){ return s.code; }).join(' ') : 'NONE') + ' // 2026 //////////////////////////////').slice(0, 46);
      return esc(l1) + '<br>' + esc(l2);
    }
    var SLOTS = [[27, 17], [73, 20], [27, 51], [73, 54], [27, 85], [73, 87]];
    function fillSpread(k){
      var f = FLIGHTS[k], ph = f.status === 'Placeholder';
      pp.style.setProperty('--mc', f.c);
      $('#hbPPL').innerHTML = '<div class="hb-pp-no"><span>Mission ' + f.no + '</span><span>Crew logbook</span></div>' +
        '<h3 class="hb-pp-name">' + esc(f.name) + '</h3><p class="hb-pp-client">' + esc(f.client) + '</p>' +
        '<dl class="hb-pp-dl"><div><dt>Status</dt><dd' + (ph ? ' class="is-ph"' : '') + '>' + esc(f.status) + '</dd></div><div><dt>Patches</dt><dd>' + f.svc.length + ' service' + (f.svc.length === 1 ? '' : 's') + '</dd></div></dl>' +
        '<a class="hb-pp-open" href="' + misHref(f.slug) + '">' + (ph ? 'See the archive' : 'Open the debrief') + ' <span aria-hidden="true">→</span></a>' +
        '<div class="hb-pp-mrz" aria-hidden="true">' + logLine(f) + '</div>';
      var r = rnd(hash(f.slug));
      $('#hbPPR').innerHTML = '<div class="hb-pp-r-h"><span>Patches earned</span><span>' + pad(k + 1) + '</span></div><div class="hb-patches">' +
        (f.svc.length ? f.svc.map(function(s, j){
          var sl = SLOTS[j % SLOTS.length], x = sl[0] + (r() - .5) * 6, y = sl[1] + (r() - .5) * 4, rot = Math.round((r() - .5) * 22);
          return '<a class="hb-patch" href="' + SVC + s.slug + '" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;--r:' + rot + 'deg;--c:' + s.c + '" aria-label="' + esc(s.t1 + ' ' + s.t2) + ' service"><small>Verified</small><b>' + s.code + '</b><em>' + esc(s.short) + '</em></a>';
        }).join('') : '<p class="hb-pp-none">No patches yet</p>') + '</div>';
      $('#hbPPN').textContent = pad(k + 1) + ' / ' + pad(FLIGHTS.length);
    }
    // page turns: nothing re-animates (the glare + tilt follow the pointer instead)
    function sew(){}
    function turn(n){
      if (busy) return;
      var k = (spread + n + FLIGHTS.length) % FLIGHTS.length;
      var sheet = $('#hbPPTurn'), flat = innerWidth <= 700;
      if (reduce || !hasGsap || flat){
        spread = k; fillSpread(k);
        if (flat && hasGsap && !reduce) gsap.fromTo(pp, { x: n * 30, opacity: .3 }, { x: 0, opacity: 1, duration: .35, ease: 'power2.out', onComplete: sew }); else sew();
        return;
      }
      busy = true;
      sheet.classList.toggle('is-back', n < 0);
      gsap.timeline({ onComplete: function(){ busy = false; gsap.set(sheet, { opacity: 0, rotationY: 0 }); sew(); } })
        .set(sheet, { opacity: 1, rotationY: 0 })
        .to(sheet, { rotationY: n > 0 ? -90 : 90, duration: .32, ease: 'power2.in' })
        .add(function(){ spread = k; fillSpread(k); })
        .to(sheet, { rotationY: n > 0 ? -180 : 180, opacity: 0, duration: .32, ease: 'power2.out' });
    }
    glass(pp, function(){ return busy; });
    $('#hbPrev').addEventListener('click', function(){ turn(-1); });
    $('#hbNext').addEventListener('click', function(){ turn(1); });
    pp.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); turn(1); } else if (e.key === 'ArrowLeft'){ e.preventDefault(); turn(-1); } });
    var sx = null;
    pp.addEventListener('pointerdown', function(e){ if (e.target.closest('a')) return; sx = e.clientX; });
    addEventListener('pointerup', function(e){ if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1); });
    fillSpread(0);
    onView(pp, function(v){ if (v && !seen){ seen = true; sew(); } });

    /* ---------- final call: the last line types in when it scrolls into view ---------- */
    var call = $('.hb-call-row'), called = false;
    if (!reduce){ $$('.hb-fl', call).forEach(function(f){ f.dataset.ch = f.textContent; f.textContent = ' '; }); }
    onView(call, function(v){
      if (!v || called || reduce) return; called = true;
      $$('.hb-cell', call).forEach(function(cell, c){ $$('.hb-fl', cell).forEach(function(f, k){ glitchTo(f, f.dataset.ch === ' ' ? ' ' : f.dataset.ch, 3 + Math.floor(Math.random() * 4), c * 120 + k * 24); }); });
    });
  })();
