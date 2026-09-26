  /* =========================================================
     CREW LOGBOOK · one spread per mission (Missions CMS, number order), a patch for every service that flew on it
     ========================================================= */
  var pp = $('[data-hub-log]'), ctl = $('[data-log-ctl]'), spread = 0, busy = false;
  if (pp && FLIGHTS.length){
    pp.tabIndex = 0; pp.setAttribute('aria-roledescription', 'logbook'); pp.setAttribute('aria-label', 'Crew logbook. Use the arrow keys to turn the page.');
    pp.insertAdjacentHTML('beforeend', '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<span class="hb-glare" aria-hidden="true"></span><div class="hb-pp-page is-l"></div><div class="hb-pp-page is-r"></div><div class="hb-pp-turn" aria-hidden="true"></div>');
    if (ctl) ctl.innerHTML = '<button type="button" class="hb-pp-btn" data-log-prev aria-label="Previous mission">←</button><span class="hb-pp-ctl-n" data-log-n>01 / ' + pad(FLIGHTS.length) + '</span><button type="button" class="hb-pp-btn" data-log-next aria-label="Next mission">→</button>';
    var pageL = $('.hb-pp-page.is-l', pp), pageR = $('.hb-pp-page.is-r', pp), sheet = $('.hb-pp-turn', pp), nEl = $('[data-log-n]');
    var logLine = function(f){
      var l1 = ('AB SPACEPORT // CREW LOG // MISSION ' + f.no + ' // ' + f.name.toUpperCase() + ' //////////////////////////////').slice(0, 46);
      var l2 = ('PATCHES ' + (f.svc.length ? f.svc.map(function(s){ return s.code; }).join(' ') : 'NONE') + ' // ' + new Date().getFullYear() + ' //////////////////////////////').slice(0, 46);
      return esc(l1) + '<br>' + esc(l2);
    };
    var SLOTS = [[27, 17], [73, 20], [27, 51], [73, 54], [27, 85], [73, 87]];
    var htmlL = function(k){
      var f = FLIGHTS[k], ph = /placeholder/i.test(f.status);
      return '<div class="hb-pp-no"><span>Mission ' + esc(f.no) + '</span><span>Crew logbook</span></div>' +
        '<h3 class="hb-pp-name">' + esc(f.name) + '</h3><p class="hb-pp-client">' + esc(f.client) + '</p>' +
        '<dl class="hb-pp-dl"><div><dt>Status</dt><dd' + (ph ? ' class="is-ph"' : '') + '>' + esc(f.status) + '</dd></div><div><dt>Patches</dt><dd>' + f.svc.length + ' service' + (f.svc.length === 1 ? '' : 's') + '</dd></div></dl>' +
        '<a class="hb-pp-open" href="' + misHref(f.slug) + '">' + (ph ? 'See the archive' : 'Open the debrief') + ' <span aria-hidden="true">→</span></a>' +
        '<div class="hb-pp-mrz" aria-hidden="true">' + logLine(f) + '</div>';
    };
    var htmlR = function(k){
      var f = FLIGHTS[k], r = rnd(hash(f.slug));
      return '<div class="hb-pp-r-h"><span>Patches earned</span><span>' + pad(k + 1) + '</span></div><div class="hb-patches">' +
        (f.svc.length ? f.svc.map(function(s, j){
          var sl = SLOTS[j % SLOTS.length], x = sl[0] + (r() - .5) * 6, y = sl[1] + (r() - .5) * 4;
          return '<a class="hb-patch" href="' + SVC + s.slug + '" style="left:' + x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;--c:' + s.c + '" aria-label="' + esc(s.t1 + ' ' + s.t2) + ' service"><small>Verified</small><b>' + esc(s.code) + '</b><em>' + esc(s.short) + '</em></a>';
        }).join('') : '<p class="hb-pp-none">No patches yet</p>') + '</div>';
    };
    var meta = function(k){ pp.style.setProperty('--mc', FLIGHTS[k].c); if (nEl) nEl.textContent = pad(k + 1) + ' / ' + pad(FLIGHTS.length); };
    var fillSpread = function(k){ pageL.innerHTML = htmlL(k); pageR.innerHTML = htmlR(k); meta(k); };
    // page turns: a real two-sided sheet. Its front is the page being turned (identical to the page under it, so nothing pops),
    // its back is the next mission's facing page; the page underneath already shows the new content. Desktop turns on the
    // spine (side to side), phones on the line between the stacked pages (top to bottom). Nothing swaps mid-turn.
    var turn = function(n){
      if (busy) return;
      var k = (spread + n + FLIGHTS.length) % FLIGHTS.length, flat = innerWidth <= 700, fwd = n > 0;
      if (reduce || !hasGsap){ spread = k; fillSpread(k); return; }
      busy = true;
      var under = fwd ? pageR : pageL, over = fwd ? pageL : pageR, back = fwd ? htmlL(k) : htmlR(k);
      sheet.classList.toggle('is-back', !fwd);
      if (flat){ sheet.style.top = under.offsetTop + 'px'; sheet.style.height = under.offsetHeight + 'px'; sheet.style.bottom = 'auto'; }
      else sheet.style.top = sheet.style.height = sheet.style.bottom = '';
      sheet.innerHTML = '<div class="hb-pp-page ' + (fwd ? 'is-r' : 'is-l') + ' hb-pp-face">' + under.innerHTML + '</div>' +
        '<div class="hb-pp-page ' + (fwd ? 'is-l' : 'is-r') + ' hb-pp-face is-rev">' + back + '</div>';
      under.innerHTML = fwd ? htmlR(k) : htmlL(k);
      spread = k; meta(k);
      var ax = flat ? 'rotationX' : 'rotationY', from = { rotationX: 0, rotationY: 0 }, to = { duration: .8, ease: 'power2.inOut',
        onComplete: function(){ over.innerHTML = back; sheet.classList.remove('is-on'); sheet.innerHTML = ''; gsap.set(sheet, { rotationX: 0, rotationY: 0 }); busy = false; } };
      to[ax] = flat ? (fwd ? 180 : -180) : (fwd ? -180 : 180);
      sheet.classList.add('is-on');
      gsap.fromTo(sheet, from, to);
    };
    glass(pp, function(){ return busy; });
    var prevB = $('[data-log-prev]'), nextB = $('[data-log-next]');
    if (prevB) prevB.addEventListener('click', function(){ turn(-1); });
    if (nextB) nextB.addEventListener('click', function(){ turn(1); });
    pp.addEventListener('keydown', function(e){ if (e.key === 'ArrowRight'){ e.preventDefault(); turn(1); } else if (e.key === 'ArrowLeft'){ e.preventDefault(); turn(-1); } });
    var sx = null;
    pp.addEventListener('pointerdown', function(e){ if (e.target.closest('a')) return; sx = e.clientX; });
    addEventListener('pointerup', function(e){ if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) turn(dx < 0 ? 1 : -1); });
    fillSpread(0);

    // brand accents: the Work page's cards carry each mission's accent (a Designer-bound Color on a hidden node)
    var CKEY = 'ab:mission-accents';
    var applyAccents = function(m){ FLIGHTS.forEach(function(f){ if (m[f.slug]) f.c = m[f.slug]; }); pp.style.setProperty('--mc', FLIGHTS[spread].c); };
    var cached = null; try { cached = JSON.parse(sessionStorage.getItem(CKEY) || 'null'); } catch (e){}
    if (cached) applyAccents(cached);
    else if (window.fetch && window.DOMParser) onView(pp, function(v){
      if (!v || cached) return; cached = {};
      fetch(WORK, { credentials: 'same-origin' }).then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
        if (!html) return;
        var doc = new DOMParser().parseFromString(html, 'text/html'), m = {};
        $$('[data-card-link][data-slug]', doc).forEach(function(a){
          var item = a.closest('.w-dyn-item') || a.parentNode, n = item && $('[data-field="brand-accent"]', item);
          var hx = n && (n.getAttribute('style') || '').match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/i);
          if (hx) m[a.getAttribute('data-slug')] = hx[0];
        });
        try { sessionStorage.setItem(CKEY, JSON.stringify(m)); } catch (e){}
        applyAccents(m);
      })['catch'](function(){});
    }, { rootMargin: '800px' });
  }

  /* ---------- final call: one more line on a small monitor, typed in when it scrolls into view ---------- */
  if (callRow){
    var CALL = { flight: 'AB-' + pad(HUB.length + 1), dest: 'CUSTOM CHARTER', via: 'ANY', gate: 'TBD', status: 'ON REQUEST' };
    callRow.innerHTML = '<span class="hb-cur" aria-hidden="true">&gt;</span>' + cellRow(CALL) + '<i class="hb-caret" aria-hidden="true"></i>';
    callRow.setAttribute('aria-label', 'Mission ' + CALL.flight + ', custom charter, any transfer, orbit to be decided, on request');
    tileSize();
    var called = false;
    if (!reduce) $$('.hb-fl', callRow).forEach(function(f){ f.setAttribute('data-ch', f.textContent); f.textContent = ' '; });
    onView(callRow, function(v){
      if (!v || called || reduce) return; called = true;
      $$('.hb-cell', callRow).forEach(function(cell, c){ $$('.hb-fl', cell).forEach(function(f, k){ glitchTo(f, f.getAttribute('data-ch') === ' ' ? ' ' : f.getAttribute('data-ch'), 3 + Math.floor(Math.random() * 4), c * 120 + k * 24); }); });
    });
  }
