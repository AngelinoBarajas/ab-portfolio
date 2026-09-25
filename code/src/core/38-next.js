  /* ---------- next cards (.ab_next-card): HUD corners, streaks, spotlight + tilt, a ship that flies to the planet on hover ---------- */
  $$('.ab_next-card').forEach(function(card, ci){
    var NS = 'http://www.w3.org/2000/svg', planet = $('.ab_planet', card), go = $('.ab_next-card_go', card);
    card.insertAdjacentHTML('afterbegin', '<span class="nx-grid" aria-hidden="true"></span><span class="nx-c tl" aria-hidden="true"></span><span class="nx-c tr" aria-hidden="true"></span><span class="nx-c bl" aria-hidden="true"></span><span class="nx-c br" aria-hidden="true"></span>' +
      '<span class="nx-hud" aria-hidden="true"><span>RA <b>' + (4 + ci * 3) + 'h ' + (21 + ci * 7) + 'm</b></span><span>DEC <b>+' + (12 + ci * 5) + '°</b></span><span>ETA <b class="nx-eta">T−00:10</b></span></span>' +
      '<span class="nx-streaks" aria-hidden="true">' + [8, 22, 35, 48, 61, 74, 88].map(function(t, i){ return '<i style="top:' + t + '%;--d:' + (0.7 + (i % 3) * .25) + 's;--dl:' + (i * .13).toFixed(2) + 's;width:' + (14 + (i % 4) * 6) + '%"></i>'; }).join('') + '</span>');
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'nx-svg'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path class="nx-path"/><path class="nx-done"/><g class="nx-ship"><path class="fl" d="M-11 -2.4 L-23 0 L-11 2.4 Z"/><rect x="-11" y="-4" width="16" height="8" fill="#F2F0EA"/><path d="M5 -4 L13 0 L5 4 Z" fill="#FF6A3D"/><path d="M-9.5 -4 L-6.4 -8.8 L-3.2 -4 Z M-9.5 4 L-6.4 8.8 L-3.2 4 Z" fill="#FF6A3D"/></g>';
    card.appendChild(svg);
    var path = $('.nx-path', svg), done = $('.nx-done', svg), ship = $('.nx-ship', svg), eta = $('.nx-eta', card), L = 0, tw = null;
    function layout(){
      if (!go) return;
      var r = card.getBoundingClientRect(), g = go.getBoundingClientRect(), pr = planet ? planet.getBoundingClientRect() : { left: r.right - 120, top: r.top + 40, width: 80, height: 80 };
      var x0 = g.right - r.left + 16, y0 = g.top - r.top + g.height / 2, x1 = pr.left - r.left + pr.width * .1, y1 = pr.top - r.top + pr.height * .5;
      svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
      var d = 'M' + x0 + ' ' + y0 + ' C ' + (x0 + (x1 - x0) * .35) + ' ' + (y0 + 40) + ', ' + (x0 + (x1 - x0) * .6) + ' ' + (y1 - 90) + ', ' + x1 + ' ' + y1;
      path.setAttribute('d', d); done.setAttribute('d', d); L = path.getTotalLength(); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L;
    }
    layout(); addEventListener('resize', layout); if (document.fonts) document.fonts.ready.then(layout);
    card.addEventListener('pointerenter', function(){
      layout(); if (!hasGsap || reduce) return;
      if (tw) tw.kill(); var o = { t: 0 };
      tw = gsap.timeline()
        .set(ship, { opacity: 1 })
        .to(o, { t: 1, duration: 1.6, ease: 'power2.inOut', onUpdate: function(){
          var p = path.getPointAtLength(o.t * L), q = path.getPointAtLength(Math.min(L, o.t * L + 2));
          ship.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + (Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI).toFixed(1) + ') scale(' + (1 - o.t * .4).toFixed(2) + ')');
          done.style.strokeDashoffset = L * (1 - o.t); eta.textContent = 'T−00:' + pad2(Math.max(0, Math.round(10 * (1 - o.t))));
        } })
        .to(ship, { opacity: 0, duration: .2 });
      if (planet) tw.to(planet, { scale: 1.08, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' }, '<');
    });
    card.addEventListener('pointerleave', function(){
      if (!hasGsap) return;
      if (tw) tw.kill(); gsap.set(ship, { opacity: 0 }); done.style.strokeDashoffset = L; eta.textContent = 'T−00:10';
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: .8, ease: 'elastic.out(1,.6)' });
      if (planet) gsap.to(planet, { x: 0, y: 0, duration: .8, ease: 'power3.out' });
    });
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%'); card.style.setProperty('--my', (y * 100) + '%');
      if (reduce || !hasGsap || coarse) return;
      gsap.to(card, { rotationY: (x - .5) * 4, rotationX: (.5 - y) * 4, transformPerspective: 1200, duration: .6, ease: 'power2.out' });
      if (planet) gsap.to(planet, { x: (x - .5) * 30, y: (y - .5) * 20, duration: .8, ease: 'power2.out' });
    });
  });
