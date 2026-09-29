  /* ---------- back to top: a small probe in the bottom-right once the visitor is 1.5 screens down (pages over 2.5 screens).
     Click fires its thruster and flies home (Lenis when it runs). Phones: it only shows while scrolling UP, so it never
     sits on the copy while reading. Reduced motion: no thruster, instant jump ---------- */
  (function(){
    if ($('.ab_top')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ab_top'; b.setAttribute('aria-label', 'Return to orbit (back to the top of the page)');
    b.innerHTML = '<span class="ab_top-craft" aria-hidden="true"><svg class="sat-ico ab_top-ico" viewBox="0 0 24 18"><path class="sa" d="M9.5 4l2.5-2.5 2.5 2.5"/><path class="sp" d="M1 9.5h6v5H1zM17 9.5h6v5h-6z"/><path class="sa" d="M7 12h3M14 12h3"/><rect class="sb" x="10" y="8.5" width="4" height="7"/></svg><i class="ab_top-fl"></i></span><span class="ab_top-lab" aria-hidden="true">Return to orbit</span>';
    document.body.appendChild(b);
    var html = document.documentElement, phone = matchMedia('(max-width: 767px)'), lastY = scrollY, shown = false, busy = false, raf = 0, tmo = 0, kb = false, inFoot = false, foot = $('.ab_footer_component');
    function set(on){ if (on !== shown){ shown = on; b.classList.toggle('on', on); } }
    function land(){
      if (!busy) return; busy = false; clearTimeout(tmo); b.classList.remove('is-launch'); set(false);
      // keyboard users land on the nav, not on a button that just vanished
      if (kb){ var f = $('#nav a[href], #nav button'); if (f) f.focus({ preventScroll: true }); }
    }
    function check(){
      raf = 0; var y = scrollY, vh = innerHeight, dy = y - lastY; lastY = y;
      if (busy){ if (y < 4) land(); return; }
      if (inFoot || y < vh * 1.5 || html.scrollHeight < vh * 2.5 || html.classList.contains('menu-open')) set(false);
      else if (!phone.matches) set(true);
      else if (dy < -4) set(true); else if (dy > 4) set(false);
    }
    addEventListener('scroll', function(){ if (!raf) raf = requestAnimationFrame(check); }, { passive: true });
    addEventListener('resize', check);
    // the footer has its own Return to orbit and draggable planets near the corner: step aside once it fills the lower half
    if (foot) onView(foot, function(v){ inFoot = v; check(); }, { rootMargin: '0px 0px -50% 0px' });
    b.addEventListener('click', function(e){
      if (busy) return; busy = true; kb = e.detail === 0; var lenis = AB.lenis;
      tmo = setTimeout(land, 3000); // a scroll that never arrives (blocked by an overlay) must not leave it stuck
      if (reduce){ if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); land(); return; }
      // thruster lights and the probe climbs off while the site's warp covers the screen; the jump to the top happens
      // under the flash, so the visitor comes out of the warp already home (same warp as the page transitions)
      b.classList.add('is-launch');
      var W = AB.warp || (typeof warp === 'function' ? warp : null);
      function home(){ if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); land(); }
      if (W) setTimeout(function(){ W(home); }, 120); else setTimeout(function(){ if (lenis) lenis.scrollTo(0, { duration: 1.3, force: true }); else scrollTo({ top: 0, behavior: 'smooth' }); }, 160);
    });
    check();
  })();
