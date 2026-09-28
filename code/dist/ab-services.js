/*! AB Portfolio · ab-services v0.30.6 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abServicesInit) return;
  window.__abServicesInit = true;
  /* ===== services/00-service.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-services] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, esc = AB.esc, pad2 = AB.pad2, rgbToHex = AB.rgbToHex, nudge = AB.nudge, buildPlanet = AB.buildPlanet;
  var canDrag = hasGsap && !!window.Draggable;

  /* =========================================================
     SERVICES TEMPLATE (/services/[slug]) · Webflow renders the CMS content;
     this adds the title split, rail state, icons, reveals, related missions, code block and next service
     ========================================================= */
  var HERO_PLANET = $('[data-service-planet]');
  if (!HERO_PLANET) return;
  var SLUG = HERO_PLANET.getAttribute('data-slug') || (location.pathname.split('/').pop() || '');
  function txt(sel, root){ var n = $(sel, root); return n ? n.textContent.trim() : ''; }
  function inView(els, fn, opts){
    if (!('IntersectionObserver' in window) || reduce){ els.forEach(function(el, i){ fn(el, i); }); return; }
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ fn(e.target, els.indexOf(e.target)); io.unobserve(e.target); } }); }, opts || { threshold: .35 });
    els.forEach(function(el){ io.observe(el); });
  }
  function set(k, v){ $$('[data-sv="' + k + '"]').forEach(function(e){ e.textContent = v; }); }

  // rail dot colors: the CMS "Rail dot color" is a Color field the API can't bind; a hidden
  // [data-field=dot] node (Designer: Background color = Rail dot color) wins when present
  var DOT = { 'webflow-development': '#146EF5', 'webgl-data': '#5eead4', 'motion': '#0AE448', 'branding': '#FF6A3D',
    'custom-deploys': '#C9C7C0', 'cms-integrations': '#8fb1ff', 'design-systems': '#7c5cff', 'performance': '#ffd166' };

  /* ---------- hero: title lines (Title line 1 + outline line 2), numbers, rail ---------- */
  var NAME = txt('#heroTitle');
  (function(){
    var h = $('#heroTitle'), t1 = txt('[data-field="title-1"]'), t2 = txt('[data-field="title-2"]');
    if (h && t1){ h.setAttribute('aria-label', NAME); h.innerHTML = '<span class="ab_dbh_word" aria-hidden="true">' + esc(t1) + '</span> ' + (t2 ? '<span class="ab_dbh_word t-outline" aria-hidden="true">' + esc(t2) + '</span>' : ''); }
    set('name', NAME);
    document.title = NAME + ' · Services · Angelino Barajas';
    // long lines (DEVELOPMENT, interaction, Heavy visuals,) shrink to fit the page column; short ones keep the
    // Designer size. offsetWidth ignores the drag-toy transforms, so a thrown word doesn't skew it; resize covers
    // phone rotation (an address-bar resize keeps the width, so nothing changes).
    if (!h) return;
    var box = h.closest('.container-large') || h.parentNode, raf = 0;
    function fit(){
      raf = 0;
      var room = box.getBoundingClientRect().right - h.getBoundingClientRect().left;
      // each line stays ONE line (a line with a space, "Content that", used to wrap into a 3rd/4th line)
      $$('.ab_dbh_word', h).forEach(function(w){
        w.style.fontSize = ''; w.style.maxWidth = 'none'; w.style.whiteSpace = 'nowrap';
        var need = w.offsetWidth, fs = parseFloat(getComputedStyle(w).fontSize);
        if (room > 0 && need > room) w.style.fontSize = Math.floor(fs * room / need * .98) + 'px';
      });
    }
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    addEventListener('resize', function(){ if (!raf) raf = requestAnimationFrame(fit); });
  })();

  var RAIL = $$('#svRail .ab_sv_rail_link').map(function(a, i){
    var slug = a.getAttribute('data-slug') || '';
    a.setAttribute('href', '/services/' + slug);
    var no = $('.ab_sv_rail_no', a); if (no) no.textContent = pad2(i + 1);
    var dotNode = $('[data-field="dot"]', a), c = (dotNode && rgbToHex(getComputedStyle(dotNode).backgroundColor)) || DOT[slug] || '#8A8FA3';
    a.style.setProperty('--pc', c); a.style.setProperty('--pg', c + '66');
    if (slug === SLUG){ a.classList.add('is-on'); a.setAttribute('aria-current', 'page'); }
    return { el: a, slug: slug, name: txt('.ab_sv_rail_name', a), i: i };
  });
  // the rail lists every service once the Designer source is "Services" (the API can only make it "Pairs with"):
  // until then the current service isn't in it, and numbering + next service fall back gracefully
  var CUR = RAIL.filter(function(r){ return r.slug === SLUG; })[0];
  var TOTAL = RAIL.length;
  if (CUR){ set('no', pad2(CUR.i + 1)); set('total', pad2(TOTAL)); }
  else { var eb = $('.ab_dbh_eyebrow'); if (eb) eb.innerHTML = 'Service · <span data-sv="name">' + esc(NAME) + '</span>'; }
  (function(){ var on = CUR && CUR.el, rail = $('#svRail'); if (on && rail) rail.scrollLeft = Math.max(0, on.offsetLeft - 24); })();
  // the rail scrolls sideways when it's wider than the column: fading edges + a nudging arrow say so; the arrow scrolls it
  (function(){
    var rail = $('#svRail'); if (!rail || !rail.parentNode) return;
    var wrap = document.createElement('div'); wrap.className = 'sv-rail-wrap'; rail.parentNode.insertBefore(wrap, rail); wrap.appendChild(rail);
    // the wrapper takes over the rail's outer margins (so the arrow centers on the chips), and moving the rail reset its scroll
    var rcs = getComputedStyle(rail); wrap.style.marginTop = rcs.marginTop; wrap.style.marginBottom = rcs.marginBottom; rail.style.marginTop = rail.style.marginBottom = '0px';
    if (CUR && CUR.el) rail.scrollLeft = Math.max(0, CUR.el.offsetLeft - 24);
    var more = document.createElement('button'); more.type = 'button'; more.className = 'sv-rail-more'; more.setAttribute('aria-label', 'Scroll to more services');
    more.innerHTML = '<span aria-hidden="true">→</span>'; wrap.appendChild(more);
    function upd(){
      var over = rail.scrollWidth > rail.clientWidth + 4, end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
      wrap.classList.toggle('is-over', over); wrap.classList.toggle('is-end', end); wrap.classList.toggle('is-start', rail.scrollLeft <= 4);
    }
    more.addEventListener('click', function(){
      var end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
      rail.scrollTo({ left: end ? 0 : rail.scrollLeft + rail.clientWidth * .75, behavior: reduce ? 'auto' : 'smooth' });
    });
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); setTimeout(upd, 600);
  })();

  $$('.ab_sv_pair').forEach(function(a){ var s = a.getAttribute('data-slug'); if (s) a.setAttribute('href', '/services/' + s); });
  (function(){ var p = $('[data-sv-pairs]'); if (p && !$('.ab_sv_pair', p)) p.innerHTML = '<p class="ab_meta_value">Works on its own</p>'; })();

  /* ---------- hero: drag the planet, entrance ---------- */
  (function(){
    var hero = $('#hero'); if (!hero) return;
    HERO_PLANET.setAttribute('data-seed', String((CUR ? CUR.i : 3) * 11 + 5));
    if (!HERO_PLANET.getAttribute('data-ring')) HERO_PLANET.removeAttribute('data-ring'); else HERO_PLANET.setAttribute('data-tilt', '-16');
    if (canDrag) $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: schedule, onThrowComplete: schedule });
      if (nudge) nudge(el, schedule);
    });
    if (hasGsap && !reduce){
      gsap.from('#heroTitle .ab_dbh_word', { yPercent: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', delay: .15 });
      gsap.from('.ab_dbh_eyebrow, .ab_dbh_sum, .ab_sv_cta, .ab_meta, .ab_sv_rail', { opacity: 0, y: 20, duration: .9, stagger: .06, delay: .4, ease: 'power3.out' });
    }
  })();

  /* ===== services/10-sections.js ===== */
  /* ---------- problems solved: strike the anomaly, reveal the fix ---------- */
  var SOLVES = $$('.ab_sv_s').filter(function(c){
    if (!txt('.ab_sv_s_h', c) && !txt('.ab_sv_s_p', c)){ c.remove(); return false; }
    var p = $('.ab_sv_s_p', c); if (p && !$('span', p)) p.innerHTML = '<span>' + esc(p.textContent.trim()) + '</span>';
    return true;
  });
  inView(SOLVES, function(c, i){
    setTimeout(function(){ c.classList.add('on'); setTimeout(function(){ var b = $('.ab_sv_s_before', c); if (b) b.textContent = '● Fixed'; }, reduce ? 0 : 900); }, reduce ? 0 : i * 220);
  }, { threshold: .5 });

  /* ---------- what's included: icons from the CMS option, checks tick in ---------- */
  var ICON = {
    map: '<path d="M6 10l10-4 12 4 10-4v28l-10 4-12-4-10 4z"/><path d="M16 6v28M28 10v28"/>',
    pen: '<path d="M8 36l4-12L28 8l8 8-16 16z"/><path d="M8 36l8-4"/><circle cx="23" cy="19" r="2"/>',
    layout: '<rect x="5" y="7" width="34" height="30"/><path d="M5 15h34M17 15v22"/>',
    db: '<ellipse cx="22" cy="10" rx="14" ry="5"/><path d="M8 10v24c0 3 6 5 14 5s14-2 14-5V10M8 22c0 3 6 5 14 5s14-2 14-5"/>',
    motion: '<path d="M4 34C14 34 16 10 26 10s10 10 14 10"/><circle cx="26" cy="10" r="3"/>',
    book: '<path d="M6 8h11a4 4 0 0 1 4 4v24a3 3 0 0 0-3-3H6z"/><path d="M38 8H27a4 4 0 0 0-4 4v24a3 3 0 0 1 3-3h12z"/>',
    globe: '<circle cx="22" cy="22" r="16"/><path d="M6 22h32M22 6c6 6 6 26 0 32M22 6c-6 6-6 26 0 32"/>',
    sync: '<path d="M34 16A13 13 0 0 0 10 14M10 28a13 13 0 0 0 24 2"/><path d="M34 8v8h-8M10 36v-8h8"/>',
    cursor: '<path d="M10 6v26l7-6 5 11 5-2-5-11h9z"/>',
    gauge: '<path d="M6 30a16 16 0 1 1 32 0"/><path d="M22 30l8-10"/><circle cx="22" cy="30" r="2.5"/>',
    branch: '<circle cx="12" cy="10" r="4"/><circle cx="12" cy="34" r="4"/><circle cx="32" cy="16" r="4"/><path d="M12 14v16M32 20c0 8-12 6-18 12"/>',
    spark: '<path d="M22 4l4 14 14 4-14 4-4 14-4-14-14-4 14-4z"/>',
    hand: '<path d="M14 22V10a3 3 0 0 1 6 0v10M20 18V7a3 3 0 0 1 6 0v11M26 18v-7a3 3 0 0 1 6 0v14c0 8-5 13-12 13-5 0-8-3-11-8l-4-7a3 3 0 0 1 5-3l4 5"/>',
    eye: '<path d="M4 22s7-12 18-12 18 12 18 12-7 12-18 12S4 22 4 22z"/><circle cx="22" cy="22" r="5"/>',
    code: '<path d="M15 12L5 22l10 10M29 12l10 10-10 10M25 8l-6 28"/>',
    palette: '<path d="M22 5a17 17 0 1 0 0 34c3 0 3-3 2-5s0-5 3-5h5a7 7 0 0 0 7-7c0-10-8-17-17-17z"/><circle cx="13" cy="20" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="29" cy="13" r="2"/>',
    grid: '<rect x="6" y="6" width="13" height="13"/><rect x="25" y="6" width="13" height="13"/><rect x="6" y="25" width="13" height="13"/><rect x="25" y="25" width="13" height="13"/>',
    type: '<path d="M8 10V6h28v4M22 6v32M16 38h12"/>'
  };
  var CAPS = $$('.ab_bento-card.is-sv').filter(function(c){
    if (!txt('.ab_bento-card_title', c)){ var cell = c.closest('.ab_bento_cell'); (cell || c).remove(); return false; }
    return true;
  });
  CAPS.forEach(function(c){
    var ic = $('[data-sv-icon]', c), k = ic ? (ic.getAttribute('data-sv-icon') || '').toLowerCase() : '';
    if (ic) ic.innerHTML = '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || ICON.spark) + '</svg>';
    var ck = $('.ab_sv_dl_ck', c); if (ck) ck.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.6 2.5L10 3"/></svg>';
  });
  set('deliver-count', String(CAPS.length));
  (function(){
    var grid = $('.ab_bento_grid.is-included'); if (!grid || !CAPS.length) return;
    inView([grid], function(){ CAPS.forEach(function(c, i){ setTimeout(function(){ c.classList.add('on'); }, reduce ? 0 : 250 + i * 180); }); }, { threshold: .25 });
  })();

  /* ---------- flight plan: the line fills left to right, the ship lights each stage ---------- */
  (function(){
    var plan = $('#svPlan'); if (!plan) return;
    var st = $$('.ab_sv_plan_item', plan).filter(function(li){ if (!txt('.ab_sv_plan_h', li)){ li.remove(); return false; } return true; });
    set('plan-count', String(st.length));
    plan.insertAdjacentHTML('beforeend', '<svg class="ab_sv_plan_ship" viewBox="-12 -12 24 24" aria-hidden="true"><rect x="-6" y="-6" width="12" height="12" fill="#FF6A3D" transform="rotate(45)"/><rect x="-2.5" y="-2.5" width="5" height="5" fill="#07080D" transform="rotate(45)"/></svg>');
    var fill = $('.ab_sv_plan_fill', plan), ship = $('.ab_sv_plan_ship', plan);
    function setP(p){
      var w = plan.offsetWidth, x = w * p, flat = !fill || getComputedStyle(fill).display === 'none';
      if (fill) fill.style.transform = 'scaleX(' + p + ')';
      if (ship) ship.style.transform = 'translateX(' + x + 'px) rotate(' + (p * 540) + 'deg)';
      st.forEach(function(li){ li.classList.toggle('on', flat || p >= .999 || li.offsetLeft + 24 <= x + 4); });
    }
    if (reduce || !window.ScrollTrigger){ setP(1); if (!reduce && !window.ScrollTrigger) inView(st, function(li){ li.classList.add('on'); }); return; }
    setP(0);
    ScrollTrigger.create({ trigger: plan, start: 'top 80%', end: 'bottom 45%', scrub: .6, onUpdate: function(s){ setP(s.progress); }, onRefresh: function(s){ setP(s.progress); } });
    // stacked layout (tablet/phone) has no line: light each stage as it scrolls in
    inView(st, function(li){ if (fill && getComputedStyle(fill).display === 'none') li.classList.add('on'); });
  })();

  /* ---------- under the hood: the CMS snippet as a highlighted code block ---------- */
  (function(){
    var sec = $('#hood'), slot = $('#svCode'), code = $('[data-field="code"]');
    var src = code ? code.textContent.replace(/^\s*\n|\s+$/g, '') : '';
    if (!sec) return;
    // no CMS snippet (Branding): keep the section when GSAP is here, 30-flight fills it with its own program
    if (!src || !AB.codeBlock){ if (!hasGsap) sec.remove(); return; }
    slot.innerHTML = AB.codeBlock(src, txt('[data-field="code-label"]') || 'excerpt');
  })();

  /* ---------- FAQ count ---------- */
  set('faq-count', String($$('#svFaq .ab_faq_item').length));
  (function(){ var f = $('#faq'); if (f && !$('#svFaq .ab_faq_item')) f.remove(); })();

  /* ===== services/15-tiles.js ===== */
  /* ---------- what's included: two tiles stand out per service. The first wears this service's planet colors
     (from its rail chip), the fifth goes dark; the rest stay light ---------- */
  (function(){
    var tiles = $$('.ab_bento-card.is-sv'); if (tiles.length < 2) return;
    var chip = CUR && CUR.el, cols = ((chip && chip.getAttribute('data-colors')) || '').split(',').map(function(c){ return c.trim(); }).filter(Boolean);
    var t0 = tiles[0];
    if (cols.length >= 3){
      t0.classList.add('sv-planet');
      t0.style.setProperty('--p0', cols[0]); t0.style.setProperty('--p1', cols[1]); t0.style.setProperty('--p2', cols[2]);
      t0.style.setProperty('--pg', (chip.getAttribute('data-glow') || 'rgba(255,255,255,.2)'));
    } else t0.classList.add('sv-ink');
    if (tiles[4]) tiles[4].classList.add('sv-ink');
  })();

  /* ===== services/20-missions.js ===== */
  /* ---------- related missions: the Work page's own cards, cloned by slug ----------
     The template's hidden Missions list (the service's "Related missions") gives the slugs; the cards
     come from /work so they match the archive exactly (tags, brand colors, cover image), then
     AB.missionCard adds covers, number, status and link the same way ab-work does. */
  (function(){
    var grid = $('#svMissions'); if (!grid) return;
    grid.setAttribute('role', 'list');
    var slugs = $$('[data-related-source] .w-dyn-item [data-field="slug"]').map(function(p){ return p.textContent.trim(); }).filter(Boolean);
    function empty(n){
      if (n >= 3) return;
      var nm = NAME ? NAME.toLowerCase() : 'this';
      grid.insertAdjacentHTML('beforeend', '<div class="ab_mission-card is-empty"><a class="ab_sv_empty" href="/#launch">' +
        '<span class="ab_sv_empty_k text-style-mono">Mission ' + pad2(n + 1) + ' · unassigned</span>' +
        '<h3 class="ab_sv_empty_h">Yours could be ' + (n ? 'next' : 'first') + '</h3>' +
        '<p class="ab_sv_empty_p">Have something that needs ' + esc(nm) + '? Let’s plot it.</p>' +
        '<span class="ab_mission-card_go text-style-mono">Plan a mission <span class="ab_mission-card_arrow" aria-hidden="true">→</span></span></a></div>');
    }
    function count(n){ set('missions-n', String(n)); set('missions-count', n ? n + ' logged' : 'Yours could be first'); }
    function done(cards){
      cards.forEach(function(card, i){
        grid.appendChild(card);
        if (AB.missionCard) AB.missionCard(card, i);
        var pl = $('.ab_planet', card); if (pl && buildPlanet) buildPlanet(pl);
        var a = $('[data-card-link]', card); if (a && AB.addSel && !a.__sel) AB.addSel(a);
        if (a && a.__sel){ var tag = $('.sel-tag', a.__sel); if (tag) tag.textContent = 'Frame / ' + (a.getAttribute('data-slug') || ''); }
        // spotlight + gentle tilt
        card.addEventListener('pointermove', function(e){
          var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (x * 100) + '%'); card.style.setProperty('--my', (y * 100) + '%');
          if (!reduce && hasGsap && !coarse) gsap.to(card, { rotationY: (x - .5) * 6, rotationX: (.5 - y) * 6, transformPerspective: 1000, duration: .5, ease: 'power2.out' });
        });
        card.addEventListener('pointerleave', function(){ if (hasGsap) gsap.to(card, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)' }); });
      });
      $$('[data-ph]', grid).forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); toast('Placeholder mission · the debrief lands when the project does.'); }); });
      count(cards.length); empty(cards.length);
      if (hasGsap && !reduce && cards.length) gsap.fromTo(grid.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'expo.out', clearProps: 'transform,opacity' });
      if (window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 60);
    }
    count(slugs.length);
    if (!slugs.length || !window.fetch || !window.DOMParser){ done([]); return; }
    fetch('/work', { credentials: 'same-origin' }).then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); }).then(function(html){
      var doc = new DOMParser().parseFromString(html, 'text/html'), by = {};
      $$('.ab_mission-card', doc).forEach(function(c){ var a = c.querySelector('[data-card-link]'); if (a) by[a.getAttribute('data-slug')] = c; });
      done(slugs.filter(function(s){ return by[s]; }).map(function(s){ return document.importNode(by[s], true); }));
    }).catch(function(){ done([]); });
  })();

  /* ---------- next service: the next one in the rail order ---------- */
  (function(){
    var slot = $('#nextSlot'); if (!slot) return;
    var NEXT = CUR ? RAIL[(CUR.i + 1) % RAIL.length] : RAIL[0];
    if (!NEXT || NEXT === CUR){ slot.closest('section').remove(); return; }
    var p = NEXT.el, attrs = ['planet', 'colors', 'ring', 'glow'].map(function(k){ var v = p.getAttribute('data-' + k); return v ? ' data-' + k + '="' + esc(v) + '"' : ''; }).join('');
    var eyebrow = CUR ? 'Next service · ' + pad2(NEXT.i + 1) + ' / ' + pad2(TOTAL) : 'Pairs with';
    slot.innerHTML = '<a class="ab_next-card" href="/services/' + esc(NEXT.slug) + '" data-next-card=""><div class="ab_next-card_content"><div class="ab_next-card_eyebrow text-style-mono">' + eyebrow + '</div><h2 class="ab_next-card_title">' + esc(NEXT.name) + '</h2><div class="ab_next-card_go">Warp to it <span aria-hidden="true">→</span></div></div>' +
      '<div class="ab_planet is-next"' + attrs + ' data-seed="' + (NEXT.i * 11 + 5) + '" data-spin="60" aria-hidden="true"></div></a>';
    var card = $('.ab_next-card', slot), pl = $('.ab_planet', card);
    if (pl && buildPlanet) buildPlanet(pl);
    if (AB.nextCard) AB.nextCard(card);
  })();

  /* ===== services/30-flight.js ===== */
  /* ---------- flight computer (replaces "Under the hood"): a console with the code on the left and a viewport
     that runs it on the right; lines light up in sync, notes come from trailing `@key` comments in the snippet.
     Staging review (2026-09-28): programs exist for motion, webgl-data and design-systems only; other services keep
     the plain code block from 10-sections. Own IIFE: an early return must not end the bundle. ---------- */
  (function(){
  var $ = AB.$, $$ = AB.$$, esc = AB.esc, pad2 = AB.pad2, reduce = AB.reduce, hasGsap = AB.hasGsap;
  var sec = $('#hood'); if (!sec || !hasGsap) return;
  var HERO = $('[data-service-planet]');
  var SLUG = (HERO && HERO.getAttribute('data-slug')) || location.pathname.split('/').pop().replace('.html', '');
  var CODE = { 'webflow-development': 'WFD', 'webgl-data': 'I3D', 'motion': 'MTN', 'branding': 'BRD', 'custom-deploys': 'BYD', 'cms-integrations': 'CMS', 'design-systems': 'DSY', 'performance': 'PRF' };

  /* ---------- highlighter (same token rules as core/37-code.js) ---------- */
  function lang(c){ var t = c.trim(); if (t.charAt(0) === '<') return 'html'; if (/^(\/\*|:root|[.#@a-z][^{(=]*\{)/i.test(t) && !/function|var |=>/.test(t)) return 'css'; return 'js'; }
  function hl(code, lg){
    var re = lg === 'css' ? /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|vh|vw|rem|em|%|s|ms|fr)?)|(--[\w-]+|[a-z-]+(?=\s*:))|(@media|!important)/g
      : lg === 'html' ? /(<!--[\s\S]*?-->)|("[^"]*")|(\b\d+\.?\d*\b)|(<\/?[\w-]+|\/?>)|([\w-]+(?==))/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|(\b(?:var|function|return|if|else|for|new|true|false|null|this|typeof|continue|break)\b)|(\b(?:window|document|Math|Object)\b)/g;
    var out = '', last = 0, m, cls = ['c', 's', 'n', 'k', 'g'];
    while ((m = re.exec(code))){ out += esc(code.slice(last, m.index)); for (var g = 1; g <= 5; g++) if (m[g] != null){ out += '<i class="t-' + cls[g - 1] + '">' + esc(m[0]) + '</i>'; break; } last = re.lastIndex; }
    return out + esc(code.slice(last));
  }
  var NOTE_RE = /\s*(?:\/\/|\/\*|<!--)\s*@([\w-]+)\s+(.*?)\s*(?:\*\/|-->)?\s*$/;
  function parse(src){
    var lines = [], notes = {};
    src.replace(/^\s*\n|\s+$/g, '').split('\n').forEach(function(l, i){
      var m = l.match(NOTE_RE);
      if (m){ notes[m[1]] = { line: i, text: m[2] }; l = l.slice(0, m.index); }
      lines.push(l);
    });
    return { lines: lines, notes: notes, clean: lines.join('\n') };
  }

  /* =========================================================
     PROGRAMS (per service slug). In Webflow, CH 01's code comes from the Services "Code" field
     (notes as @comments) and CH 02+ from a small "Flight programs" collection; the visuals live here.
     ========================================================= */
  var P = {};
  function rep(s, n){ var o = ''; while (n--) o += s; return o; }

  /* ---------- motion · CH 01 reveal ---------- */
  P.reveal = {
    label: 'Reveal', cap: 'reveal · with a reduced-motion guard',
    code: "if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { // @guard First, respect the visitor: anyone who asks for less motion gets the content straight away.\n" +
      "  gsap.from('.fade-up', { // @from Every card marked .fade-up animates FROM these values to where the layout already put it.\n" +
      "    y: 40, opacity: 0, stagger: .08, // @y Each card starts 40px low and invisible, a beat after the one before.\n" +
      "    ease: 'expo.out', // @ease The feel: a fast start and a soft landing (the curve on the right).\n" +
      "    scrollTrigger: { trigger: '.fade-up', start: 'top 85%' } // @trigger Nothing moves until the cards scroll up to 85% of the screen.\n" +
      "  });\n}",
    tools: [{ k: 'slow', label: 'Slow-mo 3×', on: true }, { k: 'rm', label: 'Reduced motion', on: false }],
    build: function(st, fc){
      st.innerHTML = '<div class="mv"><div class="mv-frame"><div class="mv-url"><i></i><i></i><i></i><span>yourbrand.com</span></div><div class="mv-vp">' +
        '<div class="mv-page"><div class="mv-hero"><i></i><i></i><i class="s"></i></div><div class="mv-grid"><div class="mv-row ghosts">' + rep('<div class="mv-ghost"></div>', 4) + '</div>' +
        '<div class="mv-row cards">' + rep('<div class="mv-card"><b></b><i></i><i></i></div>', 4) + '</div></div><div class="mv-more"></div></div>' +
        '<div class="mv-line"><span>start: top 85%</span></div><span class="fc-flag"></span></div></div>' +
        '<div class="mv-ease"><span>ease · expo.out</span><svg viewBox="-6 -6 112 112"><path d="M0 100H100M0 0H100" stroke="rgba(255,255,255,.12)" fill="none"/><path class="c" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle class="d" r="4" fill="#FF6A3D"/></svg><span class="p">progress 0.00</span></div></div>';
      var vp = $('.mv-vp', st), page = $('.mv-page', st), cards = $$('.mv-card', st), ghosts = $$('.mv-ghost', st), line = $('.mv-line', st), flag = $('.fc-flag', st);
      var E = gsap.parseEase('expo.out'), d = '', dot = $('.mv-ease .d', st), pr = $('.mv-ease .p', st);
      for (var i = 0; i <= 40; i++) d += (i ? 'L' : 'M') + (i * 2.5) + ' ' + (100 - E(i / 40) * 100).toFixed(1);
      $('.mv-ease .c', st).setAttribute('d', d);
      function geo(){ // the 85% line, and how far the page must scroll for the cards' top to reach it
        var h = vp.clientHeight, y85 = h * .85, top = $('.mv-grid', st).offsetTop + 18;
        line.style.top = y85 + 'px';
        return Math.max(0, top - y85 + 26);
      }
      function reset(){
        gsap.killTweensOf([page, cards, ghosts, flag, dot]);
        gsap.set(page, { y: 0 }); gsap.set(cards, { y: 0, opacity: 1 }); gsap.set(ghosts, { opacity: 0 }); gsap.set(flag, { opacity: 0 });
        cards.forEach(function(c){ c.classList.remove('sel'); }); line.classList.remove('hit');
        gsap.set(dot, { attr: { cx: 0, cy: 100 } }); pr.textContent = 'progress 0.00';
        geo();
      }
      reset();
      return {
        reset: reset,
        play: function(){
          var k = fc.tool('slow') ? 3 : 1, rm = fc.tool('rm'), dist = geo(), tl = gsap.timeline();
          gsap.set(cards, { opacity: 0 });
          tl.call(fc.cue, ['guard'])
            .call(function(){ flag.className = 'fc-flag ' + (rm ? 'skip' : 'ok'); flag.textContent = rm ? 'reduce → skip the animation' : 'no preference → animate'; })
            .to(flag, { opacity: 1, duration: .25 }).to({}, { duration: 1.3 });
          if (rm){
            tl.to(flag, { opacity: 0, duration: .2 }).to(page, { y: -dist, duration: 1, ease: 'power2.inOut' }).set(cards, { opacity: 1 }).to({}, { duration: .6 });
            return tl;
          }
          tl.to(flag, { opacity: 0, duration: .2 })
            .call(fc.cue, ['from']).set(cards, { opacity: 1 }).call(function(){ cards.forEach(function(c){ c.classList.add('sel'); }); })
            .to(page, { y: -Math.min(dist, 40), duration: .6, ease: 'power2.out' }).to({}, { duration: 1.1 })
            .call(fc.cue, ['y']).to(ghosts, { opacity: 1, duration: .3 })
            .to(cards, { y: 40, opacity: 0, duration: .6, ease: 'power2.in', stagger: .06 }).to({}, { duration: 1 })
            .call(function(){ cards.forEach(function(c){ c.classList.remove('sel'); }); })
            .call(fc.cue, ['trigger']).to(page, { y: -dist, duration: 1.4, ease: 'power2.inOut' }).call(function(){ line.classList.add('hit'); })
            .call(fc.cue, ['ease'])
            .to(cards, { y: 0, opacity: 1, duration: .5 * k, ease: 'expo.out', stagger: .08 * k })
            .fromTo({ p: 0 }, { p: 0 }, { p: 1, duration: .5 * k, ease: 'none', onUpdate: function(){ var p = this.targets()[0].p; gsap.set(dot, { attr: { cx: p * 100, cy: 100 - E(p) * 100 } }); pr.textContent = 'progress ' + E(p).toFixed(2); } }, '<')
            .to(ghosts, { opacity: 0, duration: .6 }, '>-.1').call(function(){ line.classList.remove('hit'); });
          return tl;
        }
      };
    }
  };

  /* ---------- motion · CH 02 easing ---------- */
  var EASES = ['expo.out', 'power3.inOut', 'back.out(2)', 'elastic.out(1, 0.4)', 'bounce.out', 'none'];
  P.ease = {
    label: 'Easing', cap: 'easing · tuned by hand',
    code: function(fc){ return "gsap.to('.ship', { // @target One element: the ship.\n  x: 280, // @x It travels 280px to the right.\n  duration: 1.2, // @dur The trip always takes 1.2 seconds.\n  ease: '" + (fc.val('ease') || 'expo.out') + "' // @ease The ease is the whole feel. Same distance, same time: pick another below and watch the spacing change.\n});"; },
    edit: 'ease', editLine: 'ease',
    tools: EASES.map(function(e, i){ return { k: 'ease', v: e, label: e.replace('(1, 0.4)', '').replace('(2)', ''), on: !i }; }),
    build: function(st, fc){
      st.innerHTML = '<div class="ez"><div class="ez-graph"><svg viewBox="-6 -40 212 180"><path class="ax" d="M0 100H200M0 0H200" stroke="rgba(255,255,255,.14)" fill="none" stroke-dasharray="3 4"/><text x="204" y="3" fill="#8A8FA3" font-size="9" font-family="JetBrains Mono,monospace">280px</text><text x="204" y="103" fill="#8A8FA3" font-size="9" font-family="JetBrains Mono,monospace">0</text><path class="c" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle class="d" r="5" fill="#FF6A3D"/></svg></div>' +
        '<div class="ez-track"><svg class="ez-ship" viewBox="-12 -12 24 24"><rect x="-7" y="-7" width="14" height="14" fill="#FF6A3D" transform="rotate(45)"/><rect x="-3" y="-3" width="6" height="6" fill="#07080D" transform="rotate(45)"/></svg><div class="ez-dist"><span>x: 280</span></div></div>' +
        '<div class="ez-timer"><i></i></div><div class="ez-read"><span>t <b class="t">0.00 s</b></span><span>x <b class="x">0 px</b></span></div></div>';
      var track = $('.ez-track', st), ship = $('.ez-ship', st), dot = $('.d', st), curve = $('.c', st), dist = $('.ez-dist', st), timer = $('.ez-timer i', st), tt = $('.t', st), tx = $('.x', st);
      function draw(){
        var E = gsap.parseEase(fc.val('ease') || 'expo.out'), d = '';
        for (var i = 0; i <= 80; i++){ var t = i / 80; d += (i ? 'L' : 'M') + (t * 200).toFixed(1) + ' ' + (100 - E(t) * 100).toFixed(1); }
        curve.setAttribute('d', d); return E;
      }
      function reset(){
        gsap.killTweensOf([ship, dot, dist, timer]);
        $$('.ez-mark', track).forEach(function(m){ m.remove(); });
        draw(); gsap.set(ship, { x: 0 }); gsap.set(dot, { attr: { cx: 0, cy: 100 } }); gsap.set(dist, { opacity: 0 }); gsap.set(timer, { scaleX: 0 });
        tt.textContent = '0.00 s'; tx.textContent = '0 px';
      }
      reset();
      return {
        reset: reset,
        play: function(){
          var E = draw(), W = track.clientWidth - 26, tl = gsap.timeline(), o = { p: 0 }, marks = 0;
          tl.call(fc.cue, ['target']).fromTo(ship, { scale: 1 }, { scale: 1.5, duration: .25, yoyo: true, repeat: 3, ease: 'power1.inOut' }).to({}, { duration: .5 })
            .call(fc.cue, ['x']).to(dist, { opacity: 1, duration: .3 }).to({}, { duration: 1.1 })
            .call(fc.cue, ['dur']).to(timer, { scaleX: 1, duration: .8, ease: 'none' }).set(timer, { scaleX: 0 }).to({}, { duration: .5 })
            .call(fc.cue, ['ease']).to(dist, { opacity: .35, duration: .3 })
            .to(o, { p: 1, duration: 1.2, ease: 'none', onUpdate: function(){
              var e = E(o.p), x = 13 + e * W;
              gsap.set(ship, { x: e * W }); gsap.set(dot, { attr: { cx: o.p * 200, cy: 100 - e * 100 } });
              tt.textContent = (o.p * 1.2).toFixed(2) + ' s'; tx.textContent = Math.round(e * 280) + ' px';
              // a mark every 1/15 s: bunched marks = slow, spread marks = fast
              while (marks <= Math.floor(o.p * 18)){ var m = document.createElement('i'); m.className = 'ez-mark'; m.style.left = (13 + E(marks / 18) * W) + 'px'; track.appendChild(m); marks++; }
            } }).to({}, { duration: .4 });
          return tl;
        }
      };
    }
  };

  /* ---------- interactive 3D + data · CMS rows become globe pins ---------- */
  var CITIES = [['New York', 40.7, -74.0], ['Las Vegas', 36.2, -115.1], ['London', 51.5, -0.1], ['Tokyo', 35.7, 139.7]];
  var MORE = [['Mexico City', 19.4, -99.1], ['Paris', 48.9, 2.4], ['Sydney', -33.9, 151.2], ['Cape Town', -33.9, 18.4]];
  P.pins = {
    label: 'CMS → globe', cap: '3d scene · data from the cms',
    code: "document.querySelectorAll('[data-globe-city]').forEach(function(el){ // @query Find every CMS item on the page that has a city.\n" +
      "  pins.push({ // @push Each one becomes a pin on the globe.\n" +
      "    lat: parseFloat(el.dataset.globeLat), // @lat Its coordinates come straight from the item's fields...\n" +
      "    lng: parseFloat(el.dataset.globeLng),\n" +
      "    title: el.dataset.globeTitle // @title ...and so does its label. Add an item in the CMS and the globe updates. No code change.\n" +
      "  });\n});",
    tools: [{ k: 'add', label: '+ Add a CMS item', act: true }],
    build: function(st, fc){
      st.innerHTML = '<div class="gb"><div class="gb-cms"><div class="gb-cap">CMS · Cities · <b class="n">0</b> items</div><div class="gb-rows"></div></div>' +
        '<div class="gb-globe"><canvas></canvas><div class="gb-count">pins.length = <b>0</b></div></div></div>';
      var rowsBox = $('.gb-rows', st), n = $('.gb-cap .n', st), cnt = $('.gb-count b', st), c = $('canvas', st), host = st.closest('.fc-view');
      var S = 300, dp = Math.min(2, window.devicePixelRatio || 1); c.width = c.height = S * dp;
      var ctx = c.getContext('2d'), W = c.width, R = W * .42, rot = 0, tilt = .35, spinV = 0, pins = [], vis = false, busy = false, data = CITIES.slice(), extra = 0;
      var grid = []; for (var la = -80; la <= 80; la += 8) for (var lo = -180; lo < 180; lo += 8) grid.push([la, lo]);
      function Pj(la, lo){ var p = la * Math.PI / 180, l = lo * Math.PI / 180 + rot, x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l); return [W / 2 + x * R, W / 2 - (y * Math.cos(tilt) - z * Math.sin(tilt)) * R, y * Math.sin(tilt) + z * Math.cos(tilt)]; }
      function draw(){
        ctx.clearRect(0, 0, W, W);
        ctx.fillStyle = '#F2F0EA';
        grid.forEach(function(q){ var p = Pj(q[0], q[1]); if (p[2] < 0) return; ctx.globalAlpha = .08 + p[2] * .45; ctx.fillRect(p[0], p[1], 1.6 * dp, 1.6 * dp); });
        ctx.globalAlpha = 1; ctx.font = (10 * dp) + 'px JetBrains Mono, monospace';
        var now = performance.now();
        pins.forEach(function(q, i){
          var p = Pj(q[1], q[2]); if (p[2] < .02) return;
          ctx.globalAlpha = Math.min(1, p[2] * 3) * q.a;
          ctx.fillStyle = '#FF6A3D'; ctx.beginPath(); ctx.arc(p[0], p[1], 4 * dp, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,106,61,.5)'; ctx.lineWidth = 1.5 * dp; ctx.beginPath(); ctx.arc(p[0], p[1], (8 + (now / 70 + i * 9) % 12) * dp, 0, 7); ctx.stroke();
          if (q.label){ ctx.fillStyle = '#F2F0EA'; ctx.fillText(q[0], p[0] + 9 * dp, p[1] - 7 * dp); }
        });
        ctx.globalAlpha = 1;
      }
      // canvas px -> px inside the viewport pane (for the flying dot)
      function toHost(p){ var r = c.getBoundingClientRect(), h = host.getBoundingClientRect(); return [r.left - h.left + p[0] / W * r.width, r.top - h.top + p[1] / W * r.height]; }
      function rowHTML(q){ return '<div class="gb-row"><b>' + esc(q[0]) + '</b><span>' + q[1].toFixed(1) + ', ' + q[2].toFixed(1) + '</span></div>'; }
      function reset(){
        gsap.killTweensOf($$('.gb-row', st)); $$('.gb-dot', host).forEach(function(d){ d.remove(); });
        pins = []; rowsBox.innerHTML = data.map(rowHTML).join(''); n.textContent = data.length; cnt.textContent = '0'; busy = false; draw();
      }
      // one item: highlight its row, read lat/lng, fly a dot to its spot (the globe turns to face it), label it
      function item(tl, i){
        var q = data[i], row = $$('.gb-row', rowsBox)[i];
        tl.call(function(){ $$('.gb-row', rowsBox).forEach(function(r){ r.classList.remove('on', 'hot'); }); row.classList.add('on'); })
          .call(fc.cue, ['push']).to({}, { duration: .35 })
          .call(fc.cue, ['lat']).call(function(){ row.classList.add('hot'); }).to({}, { duration: .5 });
        var o = { p: 0 }, dot, from, target = -q[2] * Math.PI / 180 - .35, start;
        // set-up lives in onStart (not a .call before the tween): a coarse or throttled tick could run the first onUpdate
        // before a separate call, and the flight read an undefined start point
        tl.to(o, { p: 1, duration: .9, ease: 'power2.inOut', onStart: function(){
          if (dot) dot.remove(); dot = document.createElement('i'); dot.className = 'gb-dot'; host.appendChild(dot);
          var rr = row.getBoundingClientRect(), h = host.getBoundingClientRect(); from = [rr.right - h.left - 20, rr.top - h.top + rr.height / 2];
          start = rot; target = start + (((target - start) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // shortest turn
        }, onUpdate: function(){
          if (!from) return;
          rot = start + (target - start) * o.p;
          var to = toHost(Pj(q[1], q[2])), x = from[0] + (to[0] - from[0]) * o.p, y = from[1] + (to[1] - from[1]) * o.p - Math.sin(o.p * Math.PI) * 40;
          dot.style.left = x + 'px'; dot.style.top = y + 'px';
          if (!vis || reduce) draw();
        } }).call(function(){
          dot.remove(); var pin = [q[0], q[1], q[2]]; pin.a = 1; pins.push(pin); cnt.textContent = pins.length;
          row.classList.remove('on', 'hot'); row.classList.add('done');
        }).call(fc.cue, ['title']).call(function(){ pins[pins.length - 1].label = true; }).to({}, { duration: .45 });
      }
      if (!reduce) gsap.ticker.add(function(t, dt){ if (!vis) return; if (!busy) rot += dt * .00025 + spinV; spinV *= .94; draw(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis = es[0].isIntersecting; }).observe(c); else vis = true;
      var lastX = null;
      c.addEventListener('pointerdown', function(e){ lastX = e.clientX; c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointermove', function(e){ if (lastX === null) return; var dx = e.clientX - lastX; lastX = e.clientX; rot += dx * .012; spinV = dx * .002; draw(); });
      c.addEventListener('pointerup', function(){ lastX = null; });
      reset();
      return {
        reset: reset,
        play: function(){
          var tl = gsap.timeline({ onComplete: function(){ busy = false; } }); busy = true;
          tl.call(fc.cue, ['query'])
            .call(function(){ $$('.gb-row', rowsBox).forEach(function(r, i){ setTimeout(function(){ r.classList.add('found'); }, i * 140); }); }).to({}, { duration: 1.2 });
          data.forEach(function(q, i){ item(tl, i); });
          return tl;
        },
        // tool: add one more CMS item and run the loop for it only
        act: function(k, btn){
          if (busy || extra >= MORE.length) return;
          var q = MORE[extra++]; data.push(q); rowsBox.insertAdjacentHTML('beforeend', rowHTML(q)); n.textContent = data.length;
          var row = rowsBox.lastChild; row.classList.add('found');
          if (extra >= MORE.length){ btn.disabled = true; btn.textContent = 'Demo collection full'; }
          busy = true; var tl = gsap.timeline({ onComplete: function(){ busy = false; fc.done(); } });
          tl.call(fc.cue, ['query']).to({}, { duration: .6 }); item(tl, data.length - 1);
          fc.running(tl);
        }
      };
    }
  };

  /* ---------- design systems · tokens drive a whole page ---------- */
  var SIGS = [['#FF6A3D', 'Signal'], ['#4C8DFF', 'Blue'], ['#7C5CFF', 'Violet'], ['#0AE448', 'Green']];
  P.tokens = {
    label: 'Tokens', cap: 'tokens · fluid type',
    code: function(fc){ return ":root {\n  --signal: " + (fc.val('sig') || '#FF6A3D') + "; /* @signal One accent color. Every button, link and highlight reads it, so a rebrand is one line. */\n" +
      "  --space-m: clamp(1rem, 2vw, 1.5rem); /* @space Spacing that grows with the screen, between a floor (16px) and a ceiling (24px). */\n" +
      "  --h1: clamp(3.25rem, 10.5vw, 11.25rem); /* @h1 The headline scales with the screen width: never under 52px, never over 180px. No breakpoints to babysit. */\n}"; },
    edit: 'sig', editLine: 'signal',
    tools: SIGS.map(function(s, i){ return { k: 'sig', v: s[0], label: '<i class="sw" style="background:' + s[0] + '"></i>' + s[1], on: !i }; }),
    build: function(st, fc){
      st.innerHTML = '<div class="ds"><div class="ds-ruler"><span>Screen</span><b class="w">1440px</b><input class="ds-range" type="range" min="360" max="1440" step="1" value="1440" aria-label="Screen width"></div>' +
        '<div class="ds-screen"><div class="ds-page"><div class="ds-nav"><i></i><span class="ds-btn">Book a call</span></div><h3 class="ds-h1">Built to <span>launch</span></h3><div class="ds-p"><i></i><i></i></div>' +
        '<div class="ds-cards"><div class="ds-card"><b></b><i></i><i></i></div><div class="ds-card"><b></b><i></i><i></i></div><div class="ds-card"><b></b><i></i><i></i></div></div><span class="ds-btn" style="align-self:flex-start">Start a project</span></div></div>' +
        '<div class="ds-read"><span data-r="sig"><i class="ds-sw"></i>--signal <b class="sig">#FF6A3D</b></span><span data-r="sp">--space-m <b class="sp">24px</b></span><span data-r="h1">--h1 <b class="h1">151px</b></span></div></div>';
      var screen = $('.ds-screen', st), page = $('.ds-page', st), range = $('.ds-range', st), o = { w: 1440 };
      function hot(k){ $$('.ds-read span', st).forEach(function(s){ s.classList.toggle('hot', s.getAttribute('data-r') === k); }); }
      function sig(){ var v = fc.val('sig') || '#FF6A3D'; st.style.setProperty('--sig', v); $('.sig', st).textContent = v; }
      function layout(){
        var w = Math.round(o.w), sp = Math.max(16, Math.min(24, w * .02)), h1 = Math.max(52, Math.min(180, w * .105)), s = screen.clientWidth / 1440;
        page.style.width = w + 'px'; page.style.setProperty('--sp', sp + 'px'); page.style.setProperty('--h1', h1 + 'px');
        page.style.transform = 'scale(' + s + ')';
        $('.w', st).textContent = w + 'px'; $('.sp', st).textContent = Math.round(sp) + 'px'; $('.h1', st).textContent = Math.round(h1) + 'px';
        range.value = w;
      }
      range.addEventListener('input', function(){ gsap.killTweensOf(o); o.w = +range.value; layout(); hot('h1'); fc.cue('h1'); });
      addEventListener('resize', layout);
      function reset(){ gsap.killTweensOf(o); page.classList.remove('show-sp'); hot(''); sig(); o.w = 1440; layout(); }
      reset();
      return {
        reset: reset, redraw: function(){ sig(); hot('sig'); },
        play: function(){
          var tl = gsap.timeline(), btns = $$('.ds-btn, .ds-card b, .ds-h1 span', st);
          tl.call(fc.cue, ['signal']).call(function(){ hot('sig'); })
            .fromTo(btns, { filter: 'brightness(1)' }, { filter: 'brightness(1.6)', duration: .2, yoyo: true, repeat: 3, stagger: .03 }).to({}, { duration: 1 })
            .call(fc.cue, ['space']).call(function(){ hot('sp'); page.classList.add('show-sp'); }).to({}, { duration: 1.8 })
            .call(function(){ page.classList.remove('show-sp'); })
            .call(fc.cue, ['h1']).call(function(){ hot('h1'); })
            .to(o, { w: 390, duration: 2.2, ease: 'power2.inOut', onUpdate: layout })
            .to(o, { w: 1440, duration: 2.2, ease: 'power2.inOut', onUpdate: layout }, '+=.5')
            .to(o, { w: 1024, duration: 1, ease: 'power2.out', onUpdate: layout }, '+=.3');
          return tl;
        }
      };
    }
  };

  /* ---------- webflow development · the Client-First wrapper stack, box by box ---------- */
  P.struct = {
    flow: true, // phones: the stage grows with its content
    label: 'Structure', cap: 'client-first structure',
    code: '<section class="section_hero"> <!-- @section One section per band of the page, named for what it holds. -->\n' +
      '  <div class="padding-global"> <!-- @gutter The side gutters: set once, the same on every page. -->\n' +
      '    <div class="container-large"> <!-- @container A max width, so lines stay readable on a big screen. -->\n' +
      '      <div class="padding-section-large"> <!-- @vertical Top and bottom spacing from one shared scale. -->\n' +
      '        <h1 class="heading-style-h1">Built to be edited</h1> <!-- @heading The look is a class, so anyone can reuse it later without touching code. -->\n' +
      '      </div>\n    </div>\n  </div>\n</section>',
    build: function(st, fc){
      var K = ['section', 'gutter', 'container', 'vertical', 'heading'], N = ['section_hero', 'padding-global', 'container-large', 'padding-section-large', 'heading-style-h1'];
      st.innerHTML = '<div class="wf"><div class="wf-tree"><div class="wf-cap">Navigator</div>' + N.map(function(n, i){ return '<button type="button" class="wf-row" data-k="' + K[i] + '" style="padding-left:' + (10 + i * 12) + 'px"><i></i>' + n + '</button>'; }).join('') + '</div>' +
        '<div class="wf-canvas">' + K.map(function(k, i){ return '<div class="wf-b wf-' + k + '" data-k="' + k + '" data-label="' + N[i] + '">'; }).join('') + '<span>Built to be edited</span>' + rep('</div>', K.length) + '</div></div>';
      var rows = $$('.wf-row', st), boxes = $$('.wf-b', st), head = $('.wf-heading span', st);
      function on(k){
        var at = K.indexOf(k);
        rows.forEach(function(r){ r.classList.toggle('on', r.getAttribute('data-k') === k); });
        boxes.forEach(function(b, i){ b.classList.toggle('on', i === at); b.classList.toggle('seen', i < at); });
      }
      rows.forEach(function(r){ r.addEventListener('click', function(){ var k = r.getAttribute('data-k'); on(k); fc.cue(k); gsap.set(head, { opacity: 1 }); }); });
      function reset(){ on(''); boxes.forEach(function(b){ b.classList.remove('seen'); }); gsap.set(head, { opacity: 0, y: 8 }); }
      reset();
      return {
        reset: reset,
        play: function(){
          var tl = gsap.timeline();
          K.forEach(function(k, i){
            tl.call(fc.cue, [k]).call(on, [k]);
            if (k === 'heading') tl.to(head, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' });
            tl.to({}, { duration: i === K.length - 1 ? .8 : 1.5 });
          });
          return tl;
        }
      };
    }
  };

  /* ---------- custom deploys · content files → filter drafts → sort → push ---------- */
  var FILES = [['apollo.md', 2024, false], ['voyager.md', 2026, false], ['gemini.md', 2025, true], ['cassini.md', 2025, false], ['juno.md', 2026, true]];
  P.deploy = {
    flow: true, // phones: the stage grows with its content
    label: 'Build + deploy', cap: 'astro · content collection',
    code: "import { getCollection } from 'astro:content'; // @import The missions live as plain content files in the repo; Astro reads them when it builds.\n\n" +
      "const missions = (await getCollection('missions')) // @get Load every mission file...\n" +
      "  .filter(function (m) { return !m.data.draft; }) // @draft ...leave out the drafts (tap a file to toggle one)...\n" +
      "  .sort(function (a, b) { return b.data.year - a.data.year; }); // @sort ...and put the newest first. One push, and the site rebuilds itself.",
    build: function(st, fc){
      st.innerHTML = '<div class="dp"><div class="dp-col"><div class="dp-cap">content/missions</div><div class="dp-files"></div></div>' +
        '<div class="dp-col"><div class="dp-cap">missions · <b class="n">0</b></div><div class="dp-out"></div></div><div class="dp-term"></div></div>';
      var files = $('.dp-files', st), out = $('.dp-out', st), n = $('.dp-cap .n', st), term = $('.dp-term', st), RH = 30;
      function fileRows(){
        files.innerHTML = FILES.map(function(f, i){ return '<button type="button" class="dp-f' + (f[2] ? ' is-draft' : '') + '" data-i="' + i + '"><b>' + f[0] + '</b><span>' + f[1] + '</span><em>draft</em></button>'; }).join('');
        $$('.dp-f', files).forEach(function(b){ b.addEventListener('click', function(){ var f = FILES[+b.getAttribute('data-i')]; f[2] = !f[2]; fileRows(); fc.run(); }); });
      }
      function reset(){
        gsap.killTweensOf($$('.dp-o', out)); fileRows(); out.innerHTML = ''; out.style.height = (FILES.length * RH) + 'px'; n.textContent = '0'; term.innerHTML = '';
      }
      reset();
      return {
        reset: reset,
        play: function(){
          var tl = gsap.timeline(), rows = [];
          tl.call(fc.cue, ['import']).call(function(){ $$('.dp-f', files).forEach(function(b, i){ setTimeout(function(){ b.classList.add('lit'); }, i * 120); }); }).to({}, { duration: 1.3 })
            .call(fc.cue, ['get']).call(function(){
              out.innerHTML = FILES.map(function(f, i){ return '<div class="dp-o' + (f[2] ? ' is-draft' : '') + '" style="top:' + (i * RH) + 'px"><b>' + f[0].replace('.md', '') + '</b><span>' + f[1] + '</span></div>'; }).join('');
              rows = $$('.dp-o', out).map(function(el, i){ return { el: el, f: FILES[i] }; }); n.textContent = rows.length;
              gsap.from(out.children, { opacity: 0, x: -14, duration: .35, stagger: .08 });
            }).to({}, { duration: 1.4 })
            .call(fc.cue, ['draft']).call(function(){
              rows.forEach(function(r){ if (r.f[2]) r.el.classList.add('drop'); });
              gsap.to(rows.filter(function(r){ return r.f[2]; }).map(function(r){ return r.el; }), { opacity: 0, x: 14, duration: .4, delay: .5 });
              rows = rows.filter(function(r){ return !r.f[2]; });
              rows.forEach(function(r, i){ gsap.to(r.el, { top: i * RH, duration: .5, delay: .9, ease: 'power2.inOut' }); });
              n.textContent = rows.length;
            }).to({}, { duration: 1.9 })
            .call(fc.cue, ['sort']).call(function(){
              rows.slice().sort(function(a, b){ return b.f[1] - a.f[1]; }).forEach(function(r, i){ gsap.to(r.el, { top: i * RH, duration: .6, ease: 'power2.inOut' }); });
            }).to({}, { duration: 1 });
          var L = ['<span class="hi">$</span> git push origin main', '→ building with Astro', '<span class="ok">✓</span> ', '<span class="ok">✓</span> live at <span class="hi">yourbrand.com</span>'];
          L.forEach(function(l, i){ tl.call(function(){ term.insertAdjacentHTML('beforeend', '<div>' + (i === 2 ? l + rows.length + ' mission' + (rows.length === 1 ? '' : 's') + ' built' : l) + '</div>'); }).to({}, { duration: .5 }); });
          return tl;
        }
      };
    }
  };

  /* ---------- CMS integrations · one sheet row becomes a CMS item ---------- */
  function slugify(t){ return String(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  P.sync = {
    flow: true, // phones: the stage grows with its content
    label: 'Sheet → CMS', cap: 'sync · sheet row to cms item',
    code: "function toItem(row) { // @row One spreadsheet row comes in (edit its title on the left)...\n  return {\n    fieldData: {\n" +
      "      name: row.title, // @name ...its title becomes the item's name,\n" +
      "      slug: slugify(row.title), // @slug a clean URL slug is made from it automatically,\n" +
      "      'service-types': row.services.split(',') // @types and a comma list becomes real tags the CMS can filter by.\n    }\n  };\n}",
    build: function(st, fc){
      st.innerHTML = '<div class="sy"><div class="sy-sheet"><div class="sy-cap">Sheet · Projects</div><div class="sy-grid"><span class="h">A · title</span><span class="h">B · services</span>' +
        '<input class="sy-in" type="text" value="Spring Launch Party!" maxlength="40" aria-label="Row title (edit it)"><span class="sy-sv">Webflow, Motion, Branding</span></div></div>' +
        '<div class="sy-arrow" aria-hidden="true">→</div>' +
        '<div class="sy-item"><div class="sy-cap">CMS · new item <i class="sy-ok">✓ synced</i></div><div class="sy-f"><em>Name</em><b class="nm"></b></div><div class="sy-f"><em>Slug</em><b class="sl"></b></div><div class="sy-f"><em>Service types</em><b class="sy-chips"></b></div></div></div>';
      var inp = $('.sy-in', st), grid = $('.sy-grid', st), nm = $('.nm', st), sl = $('.sl', st), chips = $('.sy-chips', st), item = $('.sy-item', st), t;
      inp.addEventListener('input', function(){ clearTimeout(t); t = setTimeout(fc.run, 700); });
      function reset(){ nm.textContent = ''; sl.textContent = ''; chips.innerHTML = ''; grid.classList.remove('on'); item.classList.remove('done'); $$('.sy-f', st).forEach(function(f){ f.classList.remove('on'); }); }
      function typeTo(el, text, tl){ var o = { p: 0 }; tl.to(o, { p: 1, duration: Math.min(1.2, .25 + text.length * .03), ease: 'none', onUpdate: function(){ el.textContent = text.slice(0, Math.round(o.p * text.length)); } }); }
      function field(i){ $$('.sy-f', st).forEach(function(f, j){ f.classList.toggle('on', j === i); }); }
      reset();
      return {
        reset: reset,
        play: function(){
          var title = inp.value.trim() || 'Untitled', tl = gsap.timeline();
          tl.call(fc.cue, ['row']).call(function(){ grid.classList.add('on'); }).to({}, { duration: 1.1 })
            .call(fc.cue, ['name']).call(field, [0]); typeTo(nm, title, tl); tl.to({}, { duration: .7 })
            .call(fc.cue, ['slug']).call(field, [1]); typeTo(sl, slugify(title) || 'untitled', tl); tl.to({}, { duration: .7 })
            .call(fc.cue, ['types']).call(field, [2]);
          'Webflow, Motion, Branding'.split(',').forEach(function(sv){ tl.call(function(){ chips.insertAdjacentHTML('beforeend', '<i>' + esc(sv.trim()) + '</i>'); gsap.from(chips.lastChild, { scale: .6, opacity: 0, duration: .3, ease: 'back.out(3)' }); }).to({}, { duration: .35 }); });
          tl.call(function(){ field(-1); item.classList.add('done'); }).to({}, { duration: .5 });
          return tl;
        }
      };
    }
  };

  /* ---------- performance · a heavy scene that loads late and rests off screen ---------- */
  P.lazy = {
    flow: true, // phones: the stage grows with its content
    label: 'Lazy 3D', cap: 'lazy webgl · pause off-screen',
    code: "new IntersectionObserver(function (entries) { // @watch Watch whether the 3D scene is on screen.\n" +
      "  var on = entries[0].isIntersecting;\n" +
      "  if (on && !scene) scene = initGlobe(); // @lazy Nothing heavy loads until the visitor actually scrolls to it.\n" +
      "  if (scene) on ? scene.play() : scene.pause(); // @pause Off screen it stops drawing: no battery or CPU spent on what nobody sees.\n" +
      "}).observe(document.querySelector('.globe'));",
    tools: [{ k: 'eager', label: 'Load it all up front', on: false }],
    build: function(st, fc){
      st.innerHTML = '<div class="lz"><div class="lz-frame"><div class="mv-url"><i></i><i></i><i></i><span>yourbrand.com</span></div><div class="lz-vp"><div class="lz-page">' +
        '<div class="lz-bars"><i></i><i></i><i class="s"></i></div><div class="lz-bars"><i class="s"></i><i class="s"></i></div>' +
        '<div class="lz-globe"><canvas></canvas><span class="lz-ph">not loaded</span></div><div class="lz-bars"><i class="s"></i><i class="s"></i><i class="s"></i></div><div class="lz-bars"><i></i><i class="s"></i></div></div></div></div>' +
        '<div class="lz-read"><div>Scene <b class="s">not loaded</b></div><div>Drawing <b class="d">no</b></div><div>Frames drawn <b class="f">0</b></div><div class="lz-cpu"><span>Work</span><i><b></b></i></div></div></div>';
      var lz = $('.lz', st), vp = $('.lz-vp', st), page = $('.lz-page', st), gl = $('.lz-globe', st), c = $('canvas', st), ph = $('.lz-ph', st);
      var sS = $('.lz-read .s', st), sD = $('.lz-read .d', st), sF = $('.lz-read .f', st), cpu = $('.lz-cpu b', st);
      var ctx = c.getContext('2d'), S = 120, loaded = false, running = false, frames = 0, rot = 0, vis = false, pts = [];
      c.width = c.height = S * 2;
      for (var la = -75; la <= 75; la += 15) for (var lo = -180; lo < 180; lo += 15) pts.push([la * Math.PI / 180, lo * Math.PI / 180]);
      function draw(){
        ctx.clearRect(0, 0, S * 2, S * 2); ctx.fillStyle = '#F2F0EA';
        pts.forEach(function(q){ var l = q[1] + rot, x = Math.cos(q[0]) * Math.sin(l), y = Math.sin(q[0]), z = Math.cos(q[0]) * Math.cos(l); if (z < 0) return; ctx.globalAlpha = .2 + z * .8; ctx.fillRect(S + x * S * .86, S - y * S * .86, 3, 3); });
        ctx.globalAlpha = 1;
      }
      function state(){ sS.textContent = loaded ? 'loaded' : 'not loaded'; sD.textContent = running ? 'yes' : (loaded ? 'paused' : 'no'); gl.classList.toggle('is-on', loaded); cpu.style.transform = 'scaleX(' + (running ? .82 : .04) + ')'; lz.classList.toggle('is-busy', running); }
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis = es[0].isIntersecting; }).observe(st); else vis = true;
      gsap.ticker.add(function(t, dt){ if (!vis || !running) return; rot += dt * .0012; frames++; if (frames % 2) draw(); sF.textContent = frames; });
      function reset(){ gsap.killTweensOf(page); gsap.set(page, { y: 0 }); loaded = fc.tool('eager'); running = loaded; frames = 0; sF.textContent = '0'; gl.classList.remove('seen'); if (loaded) draw(); else ctx.clearRect(0, 0, S * 2, S * 2); state(); }
      reset();
      return {
        reset: reset,
        play: function(){
          var eager = fc.tool('eager'), into = function(){ return gl.offsetTop - vp.clientHeight / 2 + gl.offsetHeight / 2; }, past = function(){ return gl.offsetTop + gl.offsetHeight + 10; };
          var tl = gsap.timeline();
          tl.call(fc.cue, ['watch']).call(function(){ gl.classList.add('seen'); }).to({}, { duration: 1.2 })
            .to(page, { y: function(){ return -into(); }, duration: 1.4, ease: 'power2.inOut' })
            .call(fc.cue, ['lazy']).call(function(){ if (!loaded){ loaded = true; draw(); } running = true; state(); }).to({}, { duration: 2 })
            .to(page, { y: function(){ return -past(); }, duration: 1.4, ease: 'power2.inOut' })
            .call(fc.cue, ['pause']).call(function(){ running = eager; state(); if (eager) sD.textContent = 'yes, off screen'; }).to({}, { duration: 1.6 });
          return tl;
        }
      };
    }
  };

  /* ---------- branding · four tokens carry the identity (the site's own AB mark) ---------- */
  P.brand = {
    flow: true, // phones: the stage grows with its content
    label: 'Brand tokens', cap: 'brand · tokens',
    code: function(fc){ return ":root {\n  --brand-accent: " + (fc.val('acc') || '#FF6A3D') + "; /* @accent One accent, used sparingly: the planet in the mark, buttons, links. */\n" +
      "  --brand-ink: #0B0C14; /* @ink The dark everything sits on. */\n" +
      "  --brand-type: 'Archivo', sans-serif; /* @type One typeface family carries the whole voice. */\n" +
      "  --mark-space: 0.5em; /* @space The mark always keeps this much empty room around it. */\n}"; },
    edit: 'acc', editLine: 'accent',
    tools: SIGS.map(function(s, i){ return { k: 'acc', v: s[0], label: '<i class="sw" style="background:' + s[0] + '"></i>' + s[1], on: !i }; }),
    build: function(st, fc){
      var mk = AB.markSVG ? AB.markSVG({ cls: 'br-svg', grid: true }) : '', small = AB.markSVG ? AB.markSVG({ cls: 'br-svg' }) : '';
      st.innerHTML = '<div class="br"><div class="br-mark">' + mk + '<span class="br-sp" aria-hidden="true"></span></div>' +
        '<div class="br-apps"><div class="br-card">' + small + '<b>Angelino Barajas</b><span>Designer + developer</span><em>barajasdsgn.com</em></div>' +
        '<div class="br-bar">' + small + '<i></i><i></i><i></i><span class="br-btn">Book a call</span></div></div></div>';
      var br = $('.br', st), gs = $$('.br-mark .lg-g', st), marks = $$('.lg-m path', st), sp = $('.br-sp', st), card = $('.br-card', st), bar = $('.br-bar', st);
      function acc(){ br.style.setProperty('--acc', fc.val('acc') || '#FF6A3D'); }
      function reset(){
        acc(); gsap.killTweensOf(gs.concat(marks, [sp, card, bar]));
        gs.forEach(function(g){ var L = g.getTotalLength ? g.getTotalLength() : 600; g.style.strokeDasharray = L; g.style.strokeDashoffset = L; });
        gsap.set(marks, { opacity: .15 }); gsap.set(sp, { opacity: 0 }); br.classList.remove('is-ink', 'is-type', 'is-acc');
      }
      reset();
      return {
        reset: reset, redraw: acc,
        play: function(){
          var tl = gsap.timeline();
          tl.to(gs, { strokeDashoffset: 0, duration: 1.1, stagger: .06, ease: 'power2.inOut' })
            .to(marks, { opacity: 1, duration: .5, stagger: .12 }, '-=.3')
            .call(fc.cue, ['accent']).call(function(){ br.classList.add('is-acc'); }).to({}, { duration: 1.4 })
            .call(fc.cue, ['ink']).call(function(){ br.classList.add('is-ink'); }).to({}, { duration: 1.3 })
            .call(fc.cue, ['type']).call(function(){ br.classList.add('is-type'); }).from([card, bar], { y: 10, opacity: .4, duration: .5, stagger: .1 }).to({}, { duration: 1 })
            .call(fc.cue, ['space']).to(sp, { opacity: 1, duration: .4 }).to({}, { duration: 1.4 });
          return tl;
        }
      };
    }
  };

  var BY_SLUG = { motion: ['reveal', 'ease'], 'webgl-data': ['pins'], 'design-systems': ['tokens'], 'webflow-development': ['struct'], 'custom-deploys': ['deploy'], 'cms-integrations': ['sync'], 'performance': ['lazy'], 'branding': ['brand'] };
  var LIST = (BY_SLUG[SLUG] || []).map(function(k){ return P[k]; });
  if (!LIST.length) return;

  /* =========================================================
     CONSOLE
     ========================================================= */
  var no = $('.ab_sv_rail_link.is-on .ab_sv_rail_no');
  var ID = 'AB-' + (no ? no.textContent.trim() : '0?') + ' · ' + (CODE[SLUG] || 'SVC') + ' · Flight computer';
  var fl = $('.ab_frame-label', sec); if (fl) fl.textContent = '▢ flight-computer'; sec.setAttribute('data-frame', 'flight-computer');
  var inner = $('.padding-section-medium', sec) || sec;
  inner.innerHTML = '<div class="fc">' +
    '<div class="fc-head"><div class="fc-copy"><div class="text-style-eyebrow">/engineer · flight computer</div>' +
    '<h2 class="heading-style-h2 is-hood" id="hood-h">Flight <span class="t-outline">computer</span></h2>' +
    '<p class="ab_sec-h_lede text-size-lede">The code that flies this service. Run a program and watch what each line does.</p>' +
    '<div class="fc-hint"><span><b>◆</b> Hover a marked line</span><span><b>▸</b> Run to replay</span></div></div>' +
    (LIST.length > 1 ? '<div class="fc-chans" role="tablist" aria-label="Programs">' + LIST.map(function(p, i){ return '<button type="button" class="fc-chan" role="tab" aria-selected="' + (!i) + '"><i>CH ' + pad2(i + 1) + '</i>' + esc(p.label) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
    '<div class="fc-mon" data-state="idle"><div class="fc-bar"><span class="rec"><span>FC</span></span><span class="fc-id">' + esc(ID) + '</span><span class="fc-state">Standby</span><span class="fc-tc">T+00:00.0</span></div>' +
    '<div class="fc-body"><div class="fc-code"><div class="fc-cap"><span class="cb-l">JS</span><span class="cb-n"></span><button type="button" class="cb-copy">Copy</button></div><pre class="fc-pre"><code></code></pre></div>' +
    '<div class="fc-view"><div class="scan" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="roll" aria-hidden="true"></div><i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i><div class="osd"></div><div class="fc-stage"></div></div></div>' +
    '<div class="fc-foot"><button type="button" class="fc-run"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0l9 5-9 5z"/></svg><span>Run program</span></button><div class="fc-note" aria-live="polite"><b></b><span></span></div><div class="fc-tools"></div></div></div></div>';

  var mon = $('.fc-mon', inner), body = $('.fc-body', inner), codeEl = $('.fc-pre code', inner), stage = $('.fc-stage', inner), osd = $('.osd', inner);
  var noteB = $('.fc-note b', inner), noteS = $('.fc-note span', inner), tools = $('.fc-tools', inner), runBtn = $('.fc-run', inner), stateEl = $('.fc-state', inner), tcEl = $('.fc-tc', inner);
  var cur = null, inst = null, parsed = null, tl = null, t0 = 0, vals = {}, flags = {}, idx = 0, booted = false;

  var fc = {
    tool: function(k){ return !!flags[k]; },
    val: function(k){ return vals[k]; },
    cue: function(key){
      var n = parsed && parsed.notes[key]; if (!n) return;
      $$('.fc-ln', codeEl).forEach(function(l, i){ l.classList.toggle('on', i === n.line); });
      note(n);
    },
    running: function(t){ setState('run'); tl = t; t0 = performance.now(); },
    done: function(){ setState('done'); }
  };
  function note(n){ noteB.textContent = 'Line ' + pad2(n.line + 1); noteS.textContent = n.text; if (!reduce) gsap.fromTo(noteS, { opacity: 0, x: 6 }, { opacity: 1, x: 0, duration: .3 }); }
  function setState(s){ mon.setAttribute('data-state', s); stateEl.textContent = s === 'run' ? 'Running' : s === 'done' ? 'Complete' : 'Standby'; runBtn.lastChild.textContent = s === 'done' ? 'Run again' : 'Run program'; }
  gsap.ticker.add(function(){ if (mon.getAttribute('data-state') !== 'run') return; var s = (performance.now() - t0) / 1000; tcEl.textContent = 'T+' + pad2(Math.floor(s / 60)) + ':' + pad2(Math.floor(s % 60)) + '.' + Math.floor(s * 10 % 10); });

  function render(){
    var src = typeof cur.code === 'function' ? cur.code(fc) : cur.code, lg = lang(src);
    parsed = parse(src);
    var html = hl(parsed.clean, lg).split('\n'), lineOf = {};
    Object.keys(parsed.notes).forEach(function(k){ lineOf[parsed.notes[k].line] = k; });
    codeEl.innerHTML = html.map(function(h, i){
      var k = lineOf[i];
      return '<span class="fc-ln' + (k ? ' has-note' : '') + (k && cur.editLine === k ? ' is-edit' : '') + '"' + (k ? ' tabindex="0" data-k="' + k + '"' : '') + '><b>' + pad2(i + 1) + '</b><span>' + (h || ' ') + '</span></span>';
    }).join('');
    $('.cb-l', inner).textContent = lg.toUpperCase(); $('.cb-n', inner).textContent = cur.cap;
  }
  // hover / focus a marked line: its note (and the line) light up
  function peek(e){
    var l = e.target.closest && e.target.closest('.fc-ln.has-note'); if (!l || mon.getAttribute('data-state') === 'run') return;
    fc.cue(l.getAttribute('data-k'));
  }
  codeEl.addEventListener('pointerover', peek); codeEl.addEventListener('focusin', peek);
  // Copy gives the clean code (notes stripped); core's .cb-copy handler reads the <code> inside .cb, so handle it here
  $('.cb-copy', inner).addEventListener('click', function(e){
    e.stopPropagation(); var b = this, t = parsed ? parsed.clean : '';
    function ok(){ b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function(){ b.textContent = 'Copy'; b.classList.remove('ok'); }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, ok); else ok();
  });

  function typeIn(){
    var ls = $$('.fc-ln', codeEl); if (reduce) return 0;
    ls.forEach(function(l){ l.classList.add('is-typing'); });
    ls.forEach(function(l, i){
      var sp = l.lastChild, n = Math.max(4, Math.min(40, sp.textContent.length));
      gsap.fromTo(sp, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: n * .012, ease: 'steps(' + n + ')', delay: i * .14, onStart: function(){ l.classList.remove('is-typing'); }, clearProps: 'clipPath' });
    });
    return ls.length * .14 + .4;
  }

  function toolsFor(){
    tools.innerHTML = '';
    (cur.tools || []).forEach(function(t){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'fc-tool'; b.innerHTML = t.label;
      if (!t.act) b.setAttribute('aria-pressed', String(!!t.on));
      if (t.v != null){ if (t.on) vals[t.k] = t.v; }
      else if (!t.act) flags[t.k] = !!t.on;
      b.addEventListener('click', function(){
        if (t.act){ if (inst.act) inst.act(t.k, b); return; }
        if (t.v != null){ $$('.fc-tool', tools).forEach(function(x){ if (x.__k === t.k) x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); vals[t.k] = t.v; render(); if (inst.redraw) inst.redraw(); }
        else { flags[t.k] = !flags[t.k]; b.setAttribute('aria-pressed', String(flags[t.k])); }
        run();
      });
      b.__k = t.k; tools.appendChild(b);
    });
  }

  function load(i, first){
    if (tl) tl.kill(); tl = null;
    idx = i; cur = LIST[i]; vals = {}; flags = {};
    toolsFor(); render();
    osd.textContent = 'CH ' + pad2(i + 1) + ' · ' + cur.label;
    stage.classList.toggle('is-flow', !!cur.flow);
    inst = cur.build(stage, fc);
    setState('idle'); tcEl.textContent = 'T+00:00.0';
    var first1 = parsed.notes[Object.keys(parsed.notes)[0]]; noteB.textContent = 'Ready'; noteS.textContent = 'Press Run, or hover a marked line.';
    if (!first){ body.classList.remove('is-switch'); void body.offsetWidth; body.classList.add('is-switch'); var d = typeIn(); setTimeout(run, d * 1000); }
    return first1;
  }
  function run(){
    if (tl) tl.kill();
    inst.reset();
    $$('.fc-ln', codeEl).forEach(function(l){ l.classList.remove('on'); });
    var t = inst.play();
    fc.running(t);
    // chain, don't replace: a program's own onComplete (the globe clears its busy flag there) must still run,
    // or its tools (+ Add a CMS item) stay locked after the first run
    var own = t.eventCallback('onComplete');
    t.eventCallback('onComplete', function(){ if (own) own.apply(this, arguments); setState('done'); });
    if (reduce){ t.progress(1); setState('done'); var ks = Object.keys(parsed.notes); fc.cue(ks[ks.length - 1]); }
  }
  runBtn.addEventListener('click', run);
  fc.run = run; // programs re-run themselves after an in-viewport edit (deploy drafts, sheet row)
  $$('.fc-chan', inner).forEach(function(b, i){
    b.addEventListener('click', function(){
      if (i === idx) return;
      $$('.fc-chan', inner).forEach(function(x, j){ x.setAttribute('aria-selected', String(j === i)); });
      load(i);
    });
  });

  load(0, true);
  // boot when the console scrolls into view: type the code in, then run once
  function boot(){ if (booted) return; booted = true; var d = typeIn(); setTimeout(run, d * 1000 + 300); }
  if ('IntersectionObserver' in window){ var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ boot(); io.disconnect(); } }, { threshold: .35 }); io.observe(mon); }
  else boot();
  if (/[?&]fc=run/.test(location.search)) boot();
  })();

});
