  /* =========================================================
     LAUNCH CONTROL · the manifest monitor, launch keys, telemetry, diagnostics chips and the launch pass
     ========================================================= */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';
  var cur = -1, now = -1;
  var screen = $('[data-hub-screen]'), mon = $('[data-hub-mon]'), board = $('[data-hub-board]');
  function rnd(seed){ var s = seed; return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function hash(t){ var h = 7; for (var k = 0; k < t.length; k++) h = (h * 31 + t.charCodeAt(k)) % 100003; return h; }
  // manifest readout per column (phosphor characters): mission · destination · transfer · orbit · status
  var COLS = [{ k: 'flight', n: 5, h: 'Mission' }, { k: 'dest', n: 14, h: 'Destination' }, { k: 'via', n: 7, h: 'Transfer' }, { k: 'gate', n: 5, h: 'Orbit' }, { k: 'status', n: 13, h: 'Status' }];
  function baseStatusText(s){ return s.slug === 'custom-deploys' ? 'ON REQUEST' : 'STANDBY'; }
  function boardText(s){ return { flight: 'AB-' + s.no, dest: s.short.toUpperCase(), via: s.via.map(function(v){ return BY[v].code; }).join(' '), gate: s.p[0].toUpperCase(), status: baseStatusText(s) }; }
  function cells(t, n){ var o = ''; for (var k = 0; k < n; k++) o += '<span class="hb-fl" aria-hidden="true">' + esc((t.charAt(k) || ' ').replace(' ', ' ')) + '</span>'; return o; }
  function cellRow(t){ return COLS.map(function(c){ return '<span class="hb-cell hb-c-' + c.k + '" data-col="' + c.k + '" style="--n:' + c.n + '">' + cells(t[c.k], c.n) + '</span>'; }).join(''); }

  /* ---------- the manifest rows (Designer Collection List items) get their cells, row button and Explore link ---------- */
  var rows = [];
  $$('[data-hub-row]').forEach(function(r){
    var s = BY[r.getAttribute('data-slug')];
    if (!s){ r.style.display = 'none'; return; }
    r.style.setProperty('--c', s.c);
    var go = $('[data-hub-go]', r);
    if (go){ go.href = SVC + s.slug; go.removeAttribute('aria-current'); go.classList.remove('w--current'); go.setAttribute('aria-label', 'Explore the ' + s.t1 + ' ' + s.t2 + ' service'); }
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hb-row-b'; b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', 'Mission AB-' + s.no + ', ' + s.t1 + ' ' + s.t2 + '. Arm it and print the launch pass.');
    var wrap = document.createElement('span'); wrap.style.display = 'contents';
    wrap.innerHTML = '<span class="hb-cur" aria-hidden="true">&gt;</span>' + cellRow(boardText(s));
    r.insertBefore(b, r.firstChild); r.insertBefore(wrap, go || null);
    r.__i = s.i; rows[s.i] = r;
  });
  rows = rows.filter(Boolean);
  if (screen){
    var scr = $('[data-hub-rows]', screen);
    var head = document.createElement('div'); head.className = 'hb-cols'; head.setAttribute('aria-hidden', 'true');
    head.innerHTML = '<span class="hb-c-cur"></span>' + COLS.map(function(c){ return '<span class="hb-c-' + c.k + '" style="--n:' + c.n + '">' + c.h + '</span>'; }).join('') + '<span class="hb-c-go">Service</span>';
    if (scr) scr.insertBefore(head, scr.firstChild);
    screen.insertAdjacentHTML('beforeend', '<div class="scan" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="roll" aria-hidden="true"></div>' +
      '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span>' +
      '<div class="osd" aria-hidden="true">CH 01 · Manifest</div>');
    screen.classList.add('is-built');
  }
  // launch keys 01-0N (console)
  var keysBox = $('[data-hub-keys]');
  if (keysBox) keysBox.innerHTML = HUB.map(function(s){
    return '<button type="button" class="hb-key" data-i="' + s.i + '" style="--c:' + s.c + '" aria-pressed="false" aria-label="Arm AB-' + s.no + ', ' + esc(s.short) + '"><span class="k">' + s.no + '</span><span>' + esc(s.code) + '</span><i aria-hidden="true"></i></button>';
  }).join('');
  var sws = $$('.hb-key');
  // the planets that peek out from behind the monitor
  if (board){
    var peeks = document.createElement('div'); peeks.className = 'hb-peeks'; peeks.setAttribute('aria-hidden', 'true');
    HUB.forEach(function(s){ var p = planetEl(s, 60 + s.i, 'hb-peek'); p.setAttribute('data-i', s.i); peeks.appendChild(p); });
    board.insertBefore(peeks, board.firstChild);
  }
  var peekEls = $$('.hb-peek');

  /* ---------- phosphor readout: size the characters to the screen ---------- */
  function units(row, skipStatus){
    var n = 0, cols = 0;
    $$('.hb-cell', row).forEach(function(c){ if (c.offsetParent !== null && !(skipStatus && c.getAttribute('data-col') === 'status')){ n += +c.style.getPropertyValue('--n'); cols++; } });
    return { n: n, cols: cols };
  }
  var callRow = $('[data-hub-call]');
  if (callRow && callRow.hasAttribute('aria-label')) callRow.setAttribute('role', 'img');
  function tileSize(){
    if (screen && rows[0]){
      var u = units(rows[0]), go = $('.ab_hub-go', rows[0]), goW = go ? go.offsetWidth : 0, list = $('[data-hub-rows]', screen), w = (list ? list.clientWidth : screen.clientWidth) - 36 - goW;
      // cells + cursor + the gaps between them; the labeled Explore button keeps its own width
      var cw = w / (u.n + 1 + (u.cols + 1.6) * .9);
      screen.style.setProperty('--cw', Math.max(8, Math.min(22, Math.floor(cw * 10) / 10)) + 'px');
    }
    if (callRow && callRow.firstChild){
      var phone = innerWidth <= 700, cu = units(callRow, phone), cwid = Math.min(callRow.parentNode.parentNode.clientWidth, 900) - 52;
      var cc = cwid / (cu.n + 1.6 + (cu.cols + 1) * .9);
      callRow.style.setProperty('--cw', Math.max(8, Math.min(16, Math.floor(cc * 10) / 10)) + 'px');
    }
    // after a print the pass keeps GSAP's transform (same tilt); drop it on resize so each breakpoint's tilt applies
    var ps = $('[data-hub-pass]'); if (ps && hasGsap && !gsap.isTweening(ps)) gsap.set(ps, { clearProps: 'transform' });
    hang();
  }
  // the pass hangs into the trajectory section: that section's top padding follows the pass's real height
  function hang(){
    var print = $('[data-hub-print]'), sec = $('.section_hub-map'); if (!print || !sec) return;
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
  function setCell(cell, t, delay){
    if (!cell) return;
    $$('.hb-fl', cell).forEach(function(f, k){ var ch = (t.charAt(k) || ' ').toUpperCase(); if (f.textContent === ch || (ch === ' ' && f.textContent === ' ')) return; glitchTo(f, ch, 2 + Math.floor(Math.random() * 4), (delay || 0) + k * 16); });
  }
  function rowOf(i){ return rows.filter(function(r){ return r.__i === i; })[0]; }
  function status(i, t, delay){ var r = rowOf(i); if (r) setCell($('.hb-c-status', r), t, delay); }
  function baseStatus(i){ return baseStatusText(HUB[i]); }
  function syncStates(){
    rows.forEach(function(r){ var j = r.__i; r.classList.toggle('is-on', j === cur); r.classList.toggle('is-now', j === now); $('.hb-row-b', r).setAttribute('aria-pressed', j === cur); });
    sws.forEach(function(s, j){ s.setAttribute('aria-pressed', j === cur); s.classList.toggle('is-now', j === now); });
    tele();
  }
  // side console telemetry follows the armed launch
  function tset(k, v, cls){ var n = $('[data-tele="' + k + '"]'); if (!n) return; n.textContent = v; if (cls != null) n.className = 'ab_tele_v ' + cls; }
  function tele(){
    var s = HUB[cur]; if (!s) return;
    tset('n', 'AB-' + s.no); tset('d', s.code); tset('o', s.p[0].toUpperCase()); tset('t', s.via.length);
    var pri = cur === now; tset('s', pri ? 'PRIORITY' : s.slug === 'custom-deploys' ? 'ON REQUEST' : 'GO', pri ? 'is-pri' : 'is-ok');
  }
  // the prompt line types itself out
  var promptEl = $('[data-hub-prompt]'), promptT;
  function prompt(t){
    if (!promptEl) return;
    clearTimeout(promptT);
    if (reduce){ promptEl.textContent = '> ' + t; return; }
    var full = '> ' + t, k = 0;
    (function type(){ promptEl.textContent = full.slice(0, k); if (k++ < full.length) promptT = setTimeout(type, 18); })();
  }

  /* ---------- launch pass ---------- */
  var pass = $('[data-hub-pass]');
  if (pass){
    pass.insertAdjacentHTML('afterbegin', '<span class="brk tl" aria-hidden="true"></span><span class="brk tr" aria-hidden="true"></span><span class="brk bl" aria-hidden="true"></span><span class="brk br" aria-hidden="true"></span><span class="hb-glare" aria-hidden="true"></span>');
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
  var ORBIT = { gas: 'Gas giant', ice: 'Ice giant', rocky: 'Rocky world', terra: 'Terra world', lava: 'Lava world' };
  function pset(k, v, html){ var n = $('[data-pass="' + k + '"]', pass); if (!n) return n; if (html) n.innerHTML = v; else n.textContent = v; return n; }
  function fillPass(s, skipHero){
    if (!pass) return;
    pass.style.setProperty('--c', s.c);
    pset('flight', 'AB-' + s.no); pset('code', s.code); pset('code2', s.code); pset('flight2', 'AB-' + s.no);
    pset('title', '<span class="ab_hub-pass_t1">' + esc(s.t1) + '</span> <span class="ab_hub-pass_t2 t-outline">' + esc(s.t2) + '</span>', true);
    pset('sum', s.sum); pset('best', s.best); pset('orbit', ORBIT[s.p[0]] || s.p[0]);
    pset('via', s.via.map(function(v){ return BY[v].short; }).join(' · ') || 'Direct');
    pset('tools', s.tools.map(function(t){ return '<span class="ab_chip is-tool">' + esc(t) + '</span>'; }).join(''), true);
    var link = $('[data-pass="link"]', pass); if (link) link.href = SVC + s.slug;
    var stub = $('[data-pass="stub"]', pass); if (stub){ stub.href = SVC + s.slug; stub.setAttribute('aria-label', 'Explore the ' + s.t1 + ' ' + s.t2 + ' service'); }
    pset('qr', qr(s.slug), true);
    repaint($('[data-pass="planet"]', pass), s, 80 + s.i);
    if (!skipHero) heroPlanet(s);
  }
  function heroPlanet(s){
    var hp = $('[data-hub-planet]'); if (!hp) return;
    hp.setAttribute('data-label', 'Go for launch · ' + s.short);
    if (hp.getAttribute('aria-label')) hp.setAttribute('aria-label', 'Draggable planet: Go for launch · ' + s.short);
    repaint(hp, s, 11 + s.i);
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
    if (!pass) return;
    if (quiet || reduce || !hasGsap){ fillPass(s); hang(); return; }
    mon.classList.add('is-printing');
    gsap.killTweensOf(pass);
    // transform only: the pass slides back up into the slot, is refilled while hidden, then feeds out smoothly.
    // .ab_hub-print clips everything above the slot, so no clip-path is animated (it repaints the drop shadow every frame)
    gsap.timeline({ onComplete: function(){ mon.classList.remove('is-printing'); later(function(){ if (cur === i) heroPlanet(s); }); prompt('AB-' + s.no + ' PASS PRINTED · EXPLORE THE SERVICE FROM THE PASS'); } })
      .to(pass, { yPercent: -100, y: -30, rotationX: 12, rotationY: 0, duration: prev > -1 ? .32 : 0, ease: 'power2.in' })
      .add(function(){ fillPass(s, true); hang(); })
      .to(pass, { yPercent: 0, y: 0, rotationX: 0, duration: 1, ease: 'power3.out', delay: .06 });
  }

  // glass pieces (launch slate, crew logbook) tilt toward the pointer like the site's cards (AB.cardFx),
  // with a glare that follows it; --tx/--ty let children (badges) drift against the tilt. skip() pauses the tilt (printing, page turns)
  function glass(el, skip){
    if (!el) return;
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
  rows.forEach(function(r, n){
    var i = r.__i, b = $('.hb-row-b', r);
    b.addEventListener('click', function(){ print(i); });
    b.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
      e.preventDefault(); $('.hb-row-b', rows[(n + d + rows.length) % rows.length]).focus();
    });
    if (!coarse){
      r.addEventListener('mouseenter', function(){ peek(i); });
      r.addEventListener('mouseleave', function(){ peek(-1); });
    }
  });
  sws.forEach(function(s, i){ s.addEventListener('click', function(){ print(i); }); });
  glass(pass, function(){ return mon && mon.classList.contains('is-printing'); });
  function peek(i){
    if (!board) return;
    peekEls.forEach(function(p, j){
      if (j === i){ var rr = rowOf(i).getBoundingClientRect(), wr = board.getBoundingClientRect(); p.style.setProperty('--y', (rr.top - wr.top + rr.height / 2) + 'px'); if (!p.__built) build(p); }
      p.classList.toggle('is-on', j === i);
    });
  }

  /* ---------- diagnostics: the matching launch goes PRIORITY GO ---------- */
  var chips = $$('.ab_chip.is-diag');
  chips.forEach(function(c){
    var s = BY[c.getAttribute('data-slug')], reset = c.classList.contains('is-reset');
    if (!s && !reset){ c.style.display = 'none'; return; }
    c.setAttribute('role', 'button'); c.tabIndex = 0; if (!reset) c.setAttribute('aria-pressed', 'false');
    function pick(){
      var i = reset ? -1 : s.i, was = now, old = cur;
      chips.forEach(function(x){ if (!x.classList.contains('is-reset') && x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', x === c); });
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
    }
    c.addEventListener('click', pick);
    c.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
  });

  /* ---------- clock ---------- */
  var clockEl = $('[data-hub-clock]');
  function tick(){ if (!clockEl) return; try { clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: AB.settings.timezone || undefined }); } catch (e){ clockEl.textContent = new Date().toTimeString().slice(0, 5); } }
  tick(); setInterval(tick, 15000);

  /* ---------- first paint: the manifest types in ---------- */
  tileSize(); addEventListener('resize', tileSize); addEventListener('load', hang);
  if (window.ResizeObserver && pass){ new ResizeObserver(function(){ hang(); }).observe(pass); }
  if (!reduce){
    rows.forEach(function(r, n){
      var t = boardText(HUB[r.__i]);
      COLS.forEach(function(c){ var cell = $('.hb-c-' + c.k, r); $$('.hb-fl', cell).forEach(function(f){ f.textContent = ' '; }); setCell(cell, c.k === 'status' && r.__i === 0 ? 'GO FOR LAUNCH' : t[c.k], 500 + n * 90); });
    });
  }
  print(0, true);
  if (reduce) status(0, 'GO FOR LAUNCH');
  prompt('AB-01 ARMED · CLICK A LAUNCH FOR ITS PASS · EXPLORE OPENS THE SERVICE');
