  /* =========================================================
     TOPICWEAVE PAGE SEAMS (mission topicweave only)
     The v3 site ties its sections together with threads; here every section boundary gets a strip of the site's
     cloth (K.tw.weave, band mode) that knits in from alternating sides as it reaches the screen and unravels
     once it has left the screen. The wave only runs while a strip is on screen; reduced motion: woven, still.
     ========================================================= */
  (function(){
    var T = SCENE.kit && SCENE.kit.tw; if (!T || !(M.mock && M.mock.tw) || !window.IntersectionObserver) return;
    // the page's top-level sections (each carries data-frame), not the hero and not sections nested inside them
    var secs = $$('section[data-frame]').filter(function(s){ return s.id !== 'hero' && !s.parentNode.closest('section'); });
    secs.forEach(function(sec, i){
      if (sec.offsetHeight < 80) return;
      var seam = document.createElement('div'); seam.className = 'tw-seam'; seam.setAttribute('aria-hidden', 'true');
      sec.classList.add('tw-seam-host'); sec.insertBefore(seam, sec.firstChild);
      var cloth = T.weave(seam, { mode: 'band', from: i % 2 ? 'right' : 'left', grid: 14, len: 10 });
      if (reduce){ cloth.set(true); return; }
      // knits as it comes on screen (a little inside the edge, so it's seen), unravels once it's gone
      new IntersectionObserver(function(es){ cloth(es[0].isIntersecting); }, { rootMargin: '-8% 0px -8% 0px' }).observe(seam);
    });
  })();
