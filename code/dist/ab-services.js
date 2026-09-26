/*! AB Portfolio · ab-services v0.14.0 · github.com/AngelinoBarajas/ab-portfolio */
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
    if (!src || !AB.codeBlock){ sec.remove(); return; }
    slot.innerHTML = AB.codeBlock(src, txt('[data-field="code-label"]') || 'excerpt');
  })();

  /* ---------- FAQ count ---------- */
  set('faq-count', String($$('#svFaq .ab_faq_item').length));
  (function(){ var f = $('#faq'); if (f && !$('#svFaq .ab_faq_item')) f.remove(); })();

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

});
