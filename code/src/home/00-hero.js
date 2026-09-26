  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-home] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, num = AB.num, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, warp = AB.warp, lenis = AB.lenis, sf = AB.sf, S0 = AB.settings, QUOTES = AB.quotes;
  var buildPlanet = AB.buildPlanet, hex = AB.hex, rgbToHex = AB.rgbToHex, onView = AB.onView, esc = AB.esc, pad2 = AB.pad2, nudge = AB.nudge;
  var canDrag = hasGsap && !!window.Draggable;

  /* ---------- text effects on heading spans (the Webflow spans carry no effect class) ---------- */
  [['#work-h', 't-outline'], ['#cap-h', 't-outline'], ['#log-h', 't-outline'], ['#orbit-h', 't-orbit'], ['#launch-h', 't-stars']].forEach(function(m){
    var h = $(m[0]); if (!h) return;
    $$('span', h).forEach(function(s){ if (s.parentNode === h && !s.className) s.classList.add(m[1]); });
  });
  if (reduce || !hasGsap) AB.decorate(document);

  /* ---------- hero headline (Site Settings · Headline): words become draggable; *word* = accent, ~word~ = outline ---------- */
  var ht = $('#heroTitle');
  if (ht){
    var head = S0.headline || ht.textContent.trim();
    ht.setAttribute('aria-label', head.replace(/[*~]/g, ''));
    ht.innerHTML = '';
    head.split(/\s+/).forEach(function(w){
      var s = document.createElement('span'); s.className = 'w'; s.setAttribute('data-drag', ''); s.setAttribute('data-snap', ''); s.tabIndex = 0;
      if (/^\*.*\*$/.test(w)){ s.classList.add('accent'); w = w.slice(1, -1); }
      if (/^~.*~$/.test(w)){ s.classList.add('t-outline'); w = w.slice(1, -1); }
      s.textContent = w; ht.appendChild(s);
    });
  }

  /* ---------- hero headline: on phones + tablets, size it so the longest word spans the column ---------- */
  (function(){
    if (!ht) return;
    var fitW = 0;
    function fitHero(e){
      // the size depends on width only: a phone's address bar showing/hiding (height-only resize) must not refresh ScrollTrigger
      if (e && e.type === 'resize' && innerWidth === fitW) return; fitW = innerWidth;
      if (innerWidth >= 1100){ ht.style.fontSize = ''; return; }
      var ws = $$('.w', ht), avail = ht.clientWidth; ht.style.fontSize = '100px';
      var widest = Math.max.apply(null, ws.map(function(w){ return w.getBoundingClientRect().width / ((hasGsap && gsap.getProperty(w, 'scaleX')) || 1); }));
      ht.style.fontSize = Math.min(170, Math.floor(100 * avail * .985 / widest)) + 'px';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    fitHero(); addEventListener('resize', fitHero); if (document.fonts) document.fonts.ready.then(fitHero);
  })();

  /* ---------- hero entrance ---------- */
  if (hasGsap && !reduce){
    gsap.from('#heroTitle .w', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .09, delay: .15 });
    gsap.from('.ab_hero_bottom > *, .ab_hero_meta, #hero .ab_planet, .ab_hero_badge, .ab_hero_sat', { opacity: 0, y: 20, duration: .9, stagger: .06, delay: .5, ease: 'power3.out' });
  }

  /* ---------- hero toys (anything with data-drag in the hero) ---------- */
  var hero = $('#hero');
  var badge = $('.ab_hero_badge'), sat = $('#sat');
  if (badge){ badge.tabIndex = 0; badge.setAttribute('aria-label', 'Draggable badge: design and build, established 2026'); }
  if (sat){ sat.tabIndex = 0; sat.setAttribute('aria-label', 'Satellite. Please do not drag it.'); }
  if (hero && canDrag){
    $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: schedule, onThrowComplete: schedule });
      nudge(el, schedule);
    });
    // badge: rotating text ring, a tiny moon orbiting the core, spins up on hover
    if (badge && !reduce){
      var ringTw = gsap.to($('.ring', badge), { rotation: 360, svgOrigin: '60 60', duration: 20, ease: 'none', repeat: -1 });
      var moonTw = gsap.to($('.moonorbit', badge), { rotation: -360, svgOrigin: '60 60', duration: 6, ease: 'none', repeat: -1 });
      gsap.to($('.core', badge), { scale: .8, svgOrigin: '60 60', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      badge.addEventListener('pointerenter', function(){ gsap.to([ringTw, moonTw], { timeScale: 6, duration: .5 }); });
      badge.addEventListener('pointerleave', function(){ gsap.to([ringTw, moonTw], { timeScale: 1, duration: 1.2 }); });
    }
  }
  if (sat && canDrag){
    // satellite idles: slow drift and roll, separate from the drag transform
    if (!reduce) gsap.to($('.ab_hero_sat-body', sat), { y: -7, rotation: 8, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    var satDrags = 0, satGone = false;
    // keep the satellite in open space: default spot, else the first gap that doesn't overlap anything
    var placeSat = function(){
      if (innerWidth <= 767) return;
      sat.style.top = ''; sat.style.right = '';
      var blockers = $$('#heroTitle .w, #hero .ab_planet, .ab_hero_bottom > *, .ab_hero_meta > *, .ab_hero_badge');
      var hits = function(){ var s = sat.getBoundingClientRect(); return blockers.some(function(e){ var r = e.getBoundingClientRect(); return !(r.right < s.left - 8 || r.left > s.right + 8 || r.bottom < s.top - 8 || r.top > s.bottom + 8); }); };
      var spots = [['', ''], ['104px', '22vw'], ['104px', '8vw'], ['104px', '34vw'], ['170px', '6vw'], ['150px', '44vw'], ['210px', '30vw']];
      for (var i = 0; i < spots.length; i++){ sat.style.top = spots[i][0]; sat.style.right = spots[i][1]; if (!hits()) return; }
      sat.style.top = ''; sat.style.right = '';
    };
    placeSat(); setTimeout(placeSat, 1800); addEventListener('resize', placeSat); if (document.fonts) document.fonts.ready.then(placeSat);
    Draggable.create(sat, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .5,
      onDragStart: function(){ gsap.to(sat, { rotation: gsap.utils.random(-40, 40), duration: .4 }); },
      onDragEnd: function(){
        satDrags++;
        if (satDrags === 1) toast('It says do not drag.');
        if (satDrags === 3) toast('Seriously. It is load-bearing.');
        if (satDrags >= 5 && !satGone){
          satGone = true; this.disable(); var d = this;
          toast('You had one job.');
          gsap.to(sat, { x: innerWidth, y: -300, rotation: 720, duration: 2.6, ease: 'power2.in', onComplete: function(){
            gsap.set(sat, { x: -innerWidth, y: 200, rotation: -200 });
            gsap.to(sat, { x: 0, y: 0, rotation: 0, duration: 3, delay: 3, ease: 'power3.out', onComplete: function(){ satDrags = 0; satGone = false; d.enable(); } });
          } });
        }
      } });
    nudge(sat);
  }

  /* ---------- drag cue: until someone drags something, a word tugs and a "drag me" hand appears (AB.dragCue in core) ---------- */
  (function(){
    var comp = $('.ab_hero_component'), first = $('#heroTitle .w');
    if (!comp || !first || !canDrag || !AB.dragCue) return;
    // any press on a draggable hero thing counts as "found it"
    AB.dragCue({ host: comp, first: first, items: $$('[data-drag], #sat', hero), key: 'ab:dragged', at: 'end', tug: -5 });
  })();
