  /* ---------- logo: the AB monogram is inlined (from logo/ab-logo.svg) so it can draw itself ----------
     Nav + footer links carry the Webflow Image (.ab_logo-img, the no-JS fallback); this swaps in the SVG.
     The outline warps in (spins in from a point), fills, then a slow glow pulse (all CSS, see ab-core.css "logo"); hover pulls the letters
     toward the planet like a small black hole. The footer copy draws when it scrolls into view. */
  (function(){
    function svg(){ return markSVG({ cls: 'ab_logo-svg' }); }
    $$('.ab_nav_logo').forEach(function(a){
      var img = $('img', a); if (!img || $('.ab_logo-svg', a)) return;
      img.insertAdjacentHTML('beforebegin', svg()); img.style.display = 'none';
      var s = $('.ab_logo-svg', a);
      $$('path', s).forEach(function(p){ var L = p.getTotalLength ? Math.ceil(p.getTotalLength()) : 2000; p.style.setProperty('--len', L); });
      if (reduce) return;
      var inFooter = !!a.closest('footer, .ab_footer_brand');
      if (!inFooter || !('IntersectionObserver' in window)){ s.classList.add('is-draw'); return; }
      var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ s.classList.add('is-draw'); io.disconnect(); } }, { threshold: .6 });
      io.observe(a);
    });
  })();
