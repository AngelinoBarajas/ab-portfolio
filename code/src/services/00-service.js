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
