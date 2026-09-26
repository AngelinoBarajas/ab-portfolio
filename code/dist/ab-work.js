/*! AB Portfolio · ab-work v0.13.0 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abWorkInit) return;
  window.__abWorkInit = true;
  /* ===== work/00-archive.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-work] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, warp = AB.warp, sf = AB.sf, S0 = AB.settings, esc = AB.esc, pad2 = AB.pad2, rgbToHex = AB.rgbToHex, nudge = AB.nudge;
  var canDrag = hasGsap && !!window.Draggable;

  /* =========================================================
     MISSION ARCHIVE · read the Missions Collection List (Webflow renders the cards;
     this adds covers, colors, numbers, filters, the list view and the motion)
     ========================================================= */
  var grid = $('#arcGrid');
  if (!grid) return;
  var list = $('#arcList'), peek = $('#arcPeek'), count = $('#arcCount'), empty = $('#arcEmpty'), filters = $('#arcFilters');
  var cards = $$('.ab_mission-card', grid);

  var M = cards.map(function(card, i){ return AB.missionCard(card, i); });
  var N = M.length;

  /* ---------- hero meta from the list ---------- */
  (function(){
    var types = {}, years = [], live = 0, real = 0;
    M.forEach(function(m){ m.types.forEach(function(t){ types[t] = (types[t] || 0) + 1; }); var y = parseInt(m.year, 10); if (y) years.push(y); if (m.live) live++; if (!m.placeholder) real++; });
    function set(k, v){ $$('[data-arc="' + k + '"]').forEach(function(e){ e.textContent = v; }); }
    set('total-pad', pad2(N)); set('real', real); set('live', live);
    var nt = Object.keys(types).length; if (nt) set('types', nt);
    if (years.length){ var y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years); set('years', y0 === y1 ? y0 : y0 + '–' + y1); }
    $$('[data-arc="total"]').forEach(function(e){ e.textContent = N; e.setAttribute('data-count', N); });
    // CTA card: the next free mission number
    $$('.section_arc-cta .ab_next-card_eyebrow').forEach(function(e){ e.textContent = 'Mission ' + pad2(N + 1) + ' · unassigned'; });
    M.typeCount = types;
  })();

  /* ---------- filter chips (Mission Types list, "Filter chip" on) ---------- */
  var chips = $$('.ab_arc_chip', filters);
  chips.forEach(function(c){
    var t = c.getAttribute('data-type'), n = t === 'all' ? N : (M.typeCount[t] || 0), b = $('.ab_arc_chip-count', c);
    if (b) b.textContent = n;
    if (!n && t !== 'all'){ var item = c.closest('.w-dyn-item') || c; item.style.display = 'none'; }
    c.setAttribute('aria-pressed', t === 'all' ? 'true' : 'false');
  });

  /* ---------- list view (built from the cards) ---------- */
  list.innerHTML = '<div class="al-head text-style-mono" aria-hidden="true"><span>No.</span><span>Mission</span><span>Client</span><span>Type</span><span>Year</span><span>Status</span></div>' + M.map(function(m){
    var k = m.placeholder ? 'phd' : m.live ? 'live' : 'ship';
    return '<a class="al-row' + (m.placeholder ? ' is-ph' : '') + '" href="' + m.a.getAttribute('href') + '"' + (m.placeholder ? ' data-ph' : '') + ' data-types="' + esc(m.types.join('|')) + '" data-i="' + m.i + '">' +
      '<span class="al-no">' + m.no + '</span><span class="al-name">' + esc(m.name) + '</span><span class="al-client">' + esc(m.client) + '</span><span class="al-types">' + esc(m.types.join(' · ')) + '</span><span class="al-year">' + esc(m.year) + '</span>' +
      '<span class="al-st"><span class="ab_status" data-state="' + k + '"><span class="ab_status_dot"></span>' + esc(m.placeholder ? 'Placeholder' : m.status) + '</span></span><span class="al-arr" aria-hidden="true">↗</span></a>';
  }).join('');
  var rows = $$('.al-row', list);

  /* ---------- filtering (Flip) ---------- */
  var view = 'grid', cur = 'all', hasFlip = hasGsap && !!window.Flip;
  function match(el){ return cur === 'all' || (el.getAttribute('data-types') || '').split('|').indexOf(cur) > -1; }
  function apply(anim){
    var set = view === 'grid' ? cards : rows, st = anim && hasFlip && !reduce ? Flip.getState(set) : null, n = 0;
    cards.concat(rows).forEach(function(el){ var on = match(el); el.classList.toggle('is-out', !on); if (on && (view === 'grid') === (cards.indexOf(el) > -1)) n++; });
    count.textContent = 'Showing ' + n + ' of ' + N; empty.hidden = n > 0;
    if (st) Flip.from(st, { duration: .65, ease: 'power3.inOut', scale: true, absolute: true, nested: true,
      onEnter: function(els){ return gsap.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .5, stagger: .05, ease: 'back.out(1.6)' }); },
      onLeave: function(els){ return gsap.to(els, { opacity: 0, scale: .85, duration: .3 }); },
      onComplete: function(){ if (window.ScrollTrigger) ScrollTrigger.refresh(); } });
    else if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  chips.forEach(function(c){ c.addEventListener('click', function(e){
    e.preventDefault();
    var t = c.getAttribute('data-type'); if (t === cur) return; cur = t;
    chips.forEach(function(x){ x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
    apply(true);
    if (sf && hasGsap && !reduce) gsap.fromTo(sf.state, { warp: .25 }, { warp: 0, duration: .8, ease: 'power2.out' });
  }); });

  /* ---------- grid / list switch ---------- */
  var vsw = $('#arcView'), vind = $('.ab_switch_ind', vsw), vbtns = $$('[data-view]', vsw);
  function paintV(){ var on = vbtns.filter(function(b){ return b.getAttribute('data-view') === view; })[0]; vbtns.forEach(function(b){ b.setAttribute('aria-pressed', b === on ? 'true' : 'false'); }); if (on && on.offsetWidth){ vind.style.width = on.offsetWidth + 'px'; vind.style.transform = 'translateX(' + on.offsetLeft + 'px)'; } }
  function setView(v, anim){
    if (v === view && anim) return; view = v; paintV();
    var show = v === 'grid' ? grid : list, hide = v === 'grid' ? list : grid;
    try { localStorage.setItem('ab-arc-view', v); } catch(e){}
    if (!anim || !hasGsap || reduce){ hide.hidden = true; show.hidden = false; apply(false); return; }
    gsap.to(hide, { opacity: 0, y: 12, duration: .25, onComplete: function(){
      hide.hidden = true; show.hidden = false; apply(false);
      var items = $$(v === 'grid' ? '.ab_mission-card:not(.is-out)' : '.al-row:not(.is-out)', show);
      gsap.fromTo(show, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .35 });
      gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .05, ease: 'power3.out', clearProps: 'opacity,transform' });
    } });
  }
  vbtns.forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); setView(b.getAttribute('data-view'), true); }); });
  var sv = 'grid'; try { sv = localStorage.getItem('ab-arc-view') || 'grid'; } catch(e){}
  view = null; setView(sv === 'list' ? 'list' : 'grid', false);
  addEventListener('resize', paintV); if (document.fonts) document.fonts.ready.then(paintV);

  /* ---------- cards: spotlight + tilt, the planet lifts out of the cover ---------- */
  cards.forEach(function(c){
    var pl = $('.ab_planet', c);
    c.addEventListener('pointermove', function(e){
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
      if (!reduce && hasGsap && !coarse){
        gsap.to(c, { rotationY: (x - .5) * 6, rotationX: (.5 - y) * 6, transformPerspective: 1000, duration: .5, ease: 'power2.out' });
        if (pl) gsap.to(pl, { x: (x - .5) * 18, y: (y - .5) * 12, duration: .6, ease: 'power2.out' });
      }
    });
    c.addEventListener('pointerleave', function(){ if (!hasGsap) return; gsap.to(c, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)' }); if (pl) gsap.to(pl, { x: 0, y: 0, duration: .8, ease: 'power3.out' }); });
  });
  if (hasGsap && !reduce && window.ScrollTrigger) ScrollTrigger.batch(cards, { start: 'top 90%', once: true, onEnter: function(b){ gsap.fromTo(b, { opacity: 0, y: 50, rotationX: -8 }, { opacity: 1, y: 0, rotationX: 0, transformPerspective: 900, duration: .9, stagger: .09, ease: 'expo.out', clearProps: 'opacity' }); } });

  /* ---------- list: a floating preview follows the cursor ---------- */
  if (!coarse && peek){
    var px = 0, py = 0, tx = 0, ty = 0, on = false;
    rows.forEach(function(r){
      var m = M[+r.getAttribute('data-i')];
      r.addEventListener('pointerenter', function(){
        var cv = m.cv.cloneNode(true); cv.style.transform = ''; cv.removeAttribute('data-selectable');
        peek.innerHTML = ''; peek.appendChild(cv); peek.insertAdjacentHTML('beforeend', '<span class="text-style-mono">' + m.no + ' · ' + esc(m.name) + '</span>');
        peek.classList.add('on'); on = true;
      });
      r.addEventListener('pointerleave', function(){ peek.classList.remove('on'); on = false; });
    });
    list.addEventListener('pointermove', function(e){ var r = list.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top + list.offsetTop; });
    if (hasGsap) gsap.ticker.add(function(){ if (!on && !peek.classList.contains('on')) return; px += (tx - px) * .18; py += (ty - py) * .18; peek.style.transform = 'translate(' + (px + 28) + 'px,' + (py - 90) + 'px) rotate(' + Math.max(-6, Math.min(6, (tx - px) * .08)) + 'deg)'; });
  }

  /* ---------- placeholders + real debriefs ---------- */
  $$('[data-ph]').forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); toast('Placeholder mission · the debrief ships when the project does.'); }); });
  $$('.ab_mission-card [data-card-link]:not([data-ph]), .al-row:not([data-ph])').forEach(function(a){
    a.addEventListener('click', function(e){
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault(); var href = a.getAttribute('href');
      AB.go(href);
    });
  });

  /* ---------- pinned filter bar: sentinel + IntersectionObserver, nav state via MutationObserver ---------- */
  (function(){
    var bar = $('#arcBar'), navEl = $('#nav'); if (!bar) return;
    var sent = document.createElement('div'); sent.className = 'arc-sent'; sent.setAttribute('aria-hidden', 'true'); bar.parentNode.insertBefore(sent, bar);
    new IntersectionObserver(function(es){ var e = es[0]; bar.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top < 20); }, { rootMargin: '-13px 0px 0px 0px', threshold: 0 }).observe(sent);
    function navState(){ bar.classList.toggle('nav-on', !(navEl && navEl.classList.contains('is-hidden'))); }
    navState(); if (navEl) new MutationObserver(navState).observe(navEl, { attributes: true, attributeFilter: ['class'] });
  })();

  /* ---------- hero: the archive planet can be dragged (springs home after 6 s) ---------- */
  var hero = $('#hero');
  if (hero && canDrag){
    $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: schedule, onThrowComplete: schedule });
      if (nudge) nudge(el, schedule);
    });
  }
  if (hasGsap && !reduce){
    gsap.from('#heroTitle .ab_dbh_word', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .09, delay: .15 });
    gsap.from('.ab_dbh_eyebrow, .ab_dbh_sum, .ab_meta, #hero .ab_planet', { opacity: 0, y: 20, duration: .9, stagger: .06, delay: .4, ease: 'power3.out' });
  }

});
