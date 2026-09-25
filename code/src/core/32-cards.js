  /* ---------- bento cards site-wide: orange cursor spotlight (ab-core.css .ab_bento-card::before reads --mx/--my)
     + a gentle 3D tilt. One place for every bento (Home services, Services "What's included", Mission manifest, About).
     No tilt while a button is held, over draggable bits (.mf-tag, planets), or on a card marked [data-no-tilt]. ---------- */
  function cardFx(c){
    if (!c || c.__fx) return; c.__fx = true;
    c.addEventListener('pointermove', function(e){
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
      if (reduce || !hasGsap || coarse || e.buttons || c.hasAttribute('data-no-tilt')) return;
      if (e.target.closest && e.target.closest('.mf-tag, .ab_planet')) return;
      gsap.to(c, { rotationY: (x - .5) * 5, rotationX: (.5 - y) * 5, transformPerspective: 1000, duration: .5, ease: 'power2.out', overwrite: 'auto' });
    });
    c.addEventListener('pointerleave', function(){ if (hasGsap) gsap.to(c, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)', overwrite: 'auto' }); });
    c.addEventListener('pointerdown', function(){ if (hasGsap) gsap.to(c, { rotationY: 0, rotationX: 0, duration: .3, overwrite: 'auto' }); });
  }
  $$('.ab_bento-card').forEach(cardFx);
  Object.assign(AB, { cardFx: cardFx });
