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
