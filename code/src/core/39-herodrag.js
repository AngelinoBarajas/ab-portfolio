  /* ---------- hero toys site-wide: on every page hero except Home (which has its own), the H1's words
     and the hero planet can be thrown around like Home's, and drift back after a few seconds.
     Runs after the page bundles (setTimeout 0), since Services rebuilds its title lines and Mission fills its own. ---------- */
  (function(){
    if (!hasGsap || !window.Draggable) return;
    setTimeout(function(){
      var hero = $('#hero'), title = $('#heroTitle');
      if (!hero || !title || $('.ab_hero_component') || title.hasAttribute('data-drag-ready')) return;
      title.setAttribute('data-drag-ready', '');
      if (!title.getAttribute('aria-label')) title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
      // Work + Services titles are lines of .ab_dbh_word (keep them whole: outline/star effects live on the line);
      // a plain title (Mission) is split into word spans
      var items = $$('.ab_dbh_word', title);
      if (!items.length){
        var words = title.textContent.trim().split(/\s+/); title.innerHTML = '';
        words.forEach(function(w, i){ var s = document.createElement('span'); s.className = 'w'; s.textContent = w; title.appendChild(s); if (i < words.length - 1) title.appendChild(document.createTextNode(' ')); });
        items = $$('.w', title);
      }
      items.forEach(function(el){ el.classList.add('is-toy'); el.setAttribute('aria-hidden', 'true'); el.tabIndex = 0; });
      var planet = $('.ab_planet[data-drag]', hero);
      if (planet && !planet.hasAttribute('data-parallax')) items.push(planet);
      items.forEach(function(el){
        var back;
        function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
        Draggable.create(el, { type: 'x,y', bounds: hero, inertia: !!window.InertiaPlugin, edgeResistance: .7, zIndexBoost: false,
          onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
          onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
          onDragEnd: schedule, onThrowComplete: schedule });
        nudge(el, schedule);
      });
      AB.dragCue({ host: title.parentNode, first: items[0], items: items });
    }, 0);
  })();

  /* ---------- drag cue (every hero with draggables): until something on THIS hero is dragged, the first draggable
     tugs and a "Drag me" hand chip points at it, 3 times, 10 s apart. One localStorage key per hero type
     (ab:toys:work|services|mission|about|404, Home keeps ab:dragged), so dragging on one page doesn't hide it on the others.
     opts: host (positioned box the chip sits in), first (element it points at), items (presses that end it),
     key (optional), at ('mid' default = over the first item, 'end' = at its right edge), tug (degrees). ---------- */
  function heroKind(){
    if ($('.section_lost')) return '404';
    var p = location.pathname.split('/').filter(Boolean);
    if (!p.length) return 'home';
    return p.length > 1 ? (p[0] === 'work' ? 'mission' : p[0]) : p[0];
  }
  AB.dragCue = function(o){
    var KEY = o.key || 'ab:toys:' + heroKind(), done = false, first = o.first, host = o.host;
    if (!hasGsap || !first || !host) return;
    try { if (localStorage.getItem(KEY)) return; } catch (e){}
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var hint = document.createElement('div'); hint.className = 'ab_drag-hint'; hint.setAttribute('aria-hidden', 'true'); hint.style.opacity = 0;
    hint.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5v-1a1.5 1.5 0 0 1 3 0V12m0-6a1.5 1.5 0 0 1 3 0v6m0-3.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L3.4 15a1.6 1.6 0 0 1 2.6-1.9L8 15.5"/></svg><span>Drag me</span>';
    host.appendChild(hint);
    function stop(){
      if (done) return; done = true;
      try { localStorage.setItem(KEY, '1'); } catch (e){}
      gsap.killTweensOf(first, 'rotation'); gsap.killTweensOf(hint); gsap.set(first, { rotation: 0 });
      gsap.to(hint, { opacity: 0, duration: .3, onComplete: function(){ hint.remove(); } });
    }
    (o.items || [first]).forEach(function(el){ el.addEventListener('pointerdown', stop, { once: true }); });
    function place(){
      var c = host.getBoundingClientRect(), r = first.getBoundingClientRect();
      hint.style.left = (o.at === 'end' ? r.right - c.left - 10 : r.left - c.left + Math.min(r.width * .6, 220)) + 'px';
      hint.style.top = (r.top - c.top - (o.at === 'end' ? 6 : 30)) + 'px';
    }
    var shown = 0;
    function go(){
      if (done || shown++ >= 3) return;
      place();
      if (reduce){ gsap.set(hint, { opacity: 1 }); gsap.delayedCall(4, function(){ if (!done) gsap.to(hint, { opacity: 0, duration: .3 }); }); return; }
      gsap.timeline()
        .fromTo(hint, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, ease: 'power2.out' })
        .to(hint, { x: -6, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 3 }, '<.1')
        .to(first, { rotation: o.tug || -4, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 3, onComplete: function(){ if (!done) gsap.set(first, { rotation: 0 }); } }, '<')
        .to(hint, { opacity: 0, duration: .4 }, '+=1.6');
      gsap.delayedCall(10, go);
    }
    gsap.delayedCall(o.delay || 2.6, go);
    addEventListener('resize', function(){ if (!done) place(); });
    return { stop: stop };
  };
