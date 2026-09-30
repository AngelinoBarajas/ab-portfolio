  /* ---------- logo: the AB monogram is inlined (from logo/AB Logo v2.svg) so it can draw itself ----------
     Nav + footer links carry the Webflow Image (.ab_logo-img, the no-JS fallback); this swaps in the SVG.
     Intro (once per logo): the mark warps in from a point while the planet arrives as a solid sphere spinning on its
     ring axis (front-side meridians, easing to a stop), then its core opens and it settles into the regular hollow
     planet; the letters draw + fill as before (CSS, see ab-core.css "logo"). The sphere layer fades on a CSS clock
     and is removed after, so a throttled tab never strands it. Hover pulls the letters toward the planet like a small
     black hole. The footer copy plays when it scrolls into view. */
  (function(){
    function svg(){ return markSVG({ cls: 'ab_logo-svg' }); }
    // planet construction (logo units): center 240,121, r 98, core 68, ring axis 21.5°
    var CX = 240, CY = 121, R = 98, CORE = 68, AX = 21.5, uid = 0;
    function sphere(s){
      var pl = $('.lg-planet', s); if (!pl) return;
      var id = 'abls' + (++uid), NS = 'http://www.w3.org/2000/svg', g = document.createElementNS(NS, 'g'), i, mer = '';
      for (i = 0; i < 8; i++) mer += '<path class="lg-mer"/>';
      g.setAttribute('class', 'lg-sph'); g.setAttribute('aria-hidden', 'true');
      g.innerHTML = '<defs><clipPath id="' + id + 'c"><circle cx="' + CX + '" cy="' + CY + '" r="' + R + '"/></clipPath>' +
        '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="490.16" height="241.75"><rect width="490.16" height="241.75" fill="#fff"/><circle class="lg-core" cx="' + CX + '" cy="' + CY + '" r="' + CORE + '" fill="#000"/></mask>' +
        '<radialGradient id="' + id + 'g" cx="36%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>' +
        '<g mask="url(#' + id + 'm)"><g clip-path="url(#' + id + 'c)"><circle class="lg-body" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>' +
        '<g transform="rotate(' + AX + ' ' + CX + ' ' + CY + ')">' + mer +
          '<ellipse class="lg-lat" cx="' + CX + '" cy="' + CY + '" rx="' + R + '" ry="' + (R * .28) + '"/>' +
          '<ellipse class="lg-lat" cx="' + CX + '" cy="' + (CY - R * .55) + '" rx="' + (R * .83) + '" ry="' + (R * .22) + '"/>' +
          '<ellipse class="lg-lat" cx="' + CX + '" cy="' + (CY + R * .55) + '" rx="' + (R * .83) + '" ry="' + (R * .22) + '"/></g>' +
        '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="url(#' + id + 'g)"/></g></g>';
      pl.parentNode.insertBefore(g, pl);
      var ms = $$('.lg-mer', g), t0 = 0, raf = 0;
      function ease(x){ return 1 - Math.pow(1 - x, 3); }
      function frame(now){
        if (!t0) t0 = now;
        var t = (now - t0) / 1000, ph = ease(Math.min(1, t / 2.3)) * 540;
        ms.forEach(function(e, k){
          var l = (ph + k * 22.5) * Math.PI / 180, sn = Math.sin(l), cs = Math.cos(l);
          if (cs <= 0){ e.setAttribute('d', ''); return; }
          e.setAttribute('d', 'M' + CX + ' ' + (CY - R) + 'A' + (Math.abs(sn) * R).toFixed(2) + ' ' + R + ' 0 0 ' + (sn > 0 ? 1 : 0) + ' ' + CX + ' ' + (CY + R));
          e.style.opacity = (.35 + .65 * cs).toFixed(2);
        });
        if (t < 2.7) raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
      // the CSS fade (ab-logo-sph) ends at 2.6 s; drop the layer after it whatever the rAF did
      setTimeout(function(){ cancelAnimationFrame(raf); if (g.parentNode) g.parentNode.removeChild(g); }, 2900);
    }
    function play(s){ s.classList.add('is-draw'); sphere(s); }
    $$('.ab_nav_logo').forEach(function(a){
      var img = $('img', a); if (!img || $('.ab_logo-svg', a)) return;
      img.insertAdjacentHTML('beforebegin', svg()); img.style.display = 'none';
      var s = $('.ab_logo-svg', a);
      // Home: the nav mark is signal orange (you're at base); other pages keep it white
      if (location.pathname === '/' && !a.closest('footer, .ab_footer_brand')) a.classList.add('is-home');
      $$('path', s).forEach(function(p){ var L = p.getTotalLength ? Math.ceil(p.getTotalLength()) : 2000; p.style.setProperty('--len', L); });
      if (reduce) return;
      var inFooter = !!a.closest('footer, .ab_footer_brand');
      if (!inFooter || !('IntersectionObserver' in window)){ play(s); return; }
      var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ play(s); io.disconnect(); } }, { threshold: .6 });
      io.observe(a);
    });
  })();
