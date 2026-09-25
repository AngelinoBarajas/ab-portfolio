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
    }, 0);
  })();
