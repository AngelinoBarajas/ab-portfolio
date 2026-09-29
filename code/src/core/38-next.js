  /* ---------- next cards (.ab_next-card): HUD corners, streaks, spotlight + tilt, a ship that flies to the planet on hover ---------- */
  var nextCount = 0;
  function nextCard(card){
    if (!card || card.__nx) return; card.__nx = true; var ci = nextCount++;
    // multi-word names break onto two balanced lines so the title never runs under the planet
    var tt = $('.ab_next-card_title', card);
    if (tt && !tt.children.length){
      var w = tt.textContent.trim().split(/\s+/);
      if (w.length > 1){
        var cut = 1, best = 1e9;
        for (var wi = 1; wi < w.length; wi++){ var dd = Math.abs(w.slice(0, wi).join(' ').length - w.slice(wi).join(' ').length); if (dd < best){ best = dd; cut = wi; } }
        tt.setAttribute('aria-label', w.join(' '));
        tt.innerHTML = esc(w.slice(0, cut).join(' ')) + '<br>' + esc(w.slice(cut).join(' '));
      }
    }
    fitWide(tt, 26); // one long word (INTERACTIVE, INTEGRATIONS) must fit the card on a phone
    var NS = 'http://www.w3.org/2000/svg', planet = $('.ab_planet', card), go = $('.ab_next-card_go', card);
    card.insertAdjacentHTML('afterbegin', '<span class="nx-grid" aria-hidden="true"></span><span class="nx-c tl" aria-hidden="true"></span><span class="nx-c tr" aria-hidden="true"></span><span class="nx-c bl" aria-hidden="true"></span><span class="nx-c br" aria-hidden="true"></span>' +
      '<span class="nx-hud" aria-hidden="true"><span>RA <b>' + (4 + ci * 3) + 'h ' + (21 + ci * 7) + 'm</b></span><span>DEC <b>+' + (12 + ci * 5) + '°</b></span><span>ETA <b class="nx-eta">T−00:10</b></span></span>' +
      '<span class="nx-streaks" aria-hidden="true">' + [8, 22, 35, 48, 61, 74, 88].map(function(t, i){ return '<i style="top:' + t + '%;--d:' + (0.7 + (i % 3) * .25) + 's;--dl:' + (i * .13).toFixed(2) + 's;width:' + (14 + (i % 4) * 6) + '%"></i>'; }).join('') + '</span>');
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'nx-svg'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path class="nx-path"/><path class="nx-done"/><g class="nx-ship"><path class="fl" d="M-11 -2.4 L-23 0 L-11 2.4 Z"/><rect x="-11" y="-4" width="16" height="8" fill="#F2F0EA"/><path d="M5 -4 L13 0 L5 4 Z" fill="#FF6A3D"/><path d="M-9.5 -4 L-6.4 -8.8 L-3.2 -4 Z M-9.5 4 L-6.4 8.8 L-3.2 4 Z" fill="#FF6A3D"/></g>';
    card.appendChild(svg);
    var path = $('.nx-path', svg), done = $('.nx-done', svg), ship = $('.nx-ship', svg), eta = $('.nx-eta', card), L = 0, tw = null, big = matchMedia('(min-width: 992px)');
    // desktop: a big planet rising from the bottom-right corner (CSS places it by --nx-sz), sized off the card's height
    // so short mission cards and the tall Work card show the same slice of sphere; set before the planet builds (texture size)
    function size(){
      if (!planet) return;
      if (big.matches){
        var S = Math.round(Math.max(520, Math.min(card.offsetHeight * 1.9, card.offsetWidth * .56, 880))), W = card.clientWidth, H = card.clientHeight, cx = W + S * .04, cy = H + S * .06, R = S / 2, dx = 0;
        card.style.setProperty('--nx-sz', S + 'px');
        // long titles (ADVANCED CMS / INTEGRATIONS) reach the sphere: slide it right toward clearing each line, by at most S/10 so it stays big (the copy sits above it)
        if (tt){
          var rg = document.createRange(), cr = card.getBoundingClientRect(), rs, i, ey, ex; rg.selectNodeContents(tt); rs = rg.getClientRects();
          for (i = 0; i < rs.length; i++){ ey = cy - (rs[i].bottom - cr.top); if (ey < R){ ex = cx - Math.sqrt(R * R - ey * ey); dx = Math.max(dx, rs[i].right - cr.left + 24 - ex); } }
        }
        card.style.setProperty('--nx-dx', Math.round(Math.min(dx, S * .1)) + 'px');
      } else { card.style.removeProperty('--nx-sz'); card.style.removeProperty('--nx-dx'); }
      if (planet.__built) planet.style.setProperty('--sz', planet.offsetWidth + 'px');
    }
    function layout(){
      if (!go) return;
      var r = card.getBoundingClientRect(), g = go.getBoundingClientRect(), pr = planet ? planet.getBoundingClientRect() : { left: r.right - 120, top: r.top + 40, width: 80, height: 80 };
      var x0 = g.right - r.left + 16, y0 = g.top - r.top + g.height / 2, x1 = pr.left - r.left + pr.width * .1, y1 = pr.top - r.top + pr.height * .5, dx, d;
      var pcx = pr.left - r.left + pr.width / 2, pcy = pr.top - r.top + pr.height / 2;
      // centre off the card (desktop corner planet): land on the visible upper-left of the sphere, not its hidden middle
      if (pcx > r.width || pcy > r.height){ x1 = pcx - pr.width * .3; y1 = Math.max(40, pcy - pr.height * .3); }
      dx = x1 - x0;
      svg.setAttribute('viewBox', '0 0 ' + r.width + ' ' + r.height);
      if (dx >= 140){
        // room to fly: launch beside the button, lift, then drop onto the planet (the swing scales with the distance)
        d = 'M' + x0 + ' ' + y0 + ' C ' + (x0 + dx * .35) + ' ' + (y0 + Math.min(40, dx * .15)) + ', ' + (x0 + dx * .6) + ' ' + (y1 - Math.min(90, dx * .3)) + ', ' + x1 + ' ' + y1;
      } else {
        // the planet sits right beside the button (narrow cards): launch from under the button and skim the card's floor up to it
        var bx = g.left - r.left + 10, by = Math.min(r.height - 12, g.bottom - r.top + 16), ex = pr.left - r.left + pr.width * .5, ey = Math.min(pr.bottom - r.top - pr.height * .12, r.height - 14), sx = ex - bx;
        d = 'M' + bx + ' ' + by + ' C ' + (bx + sx * .45) + ' ' + (by + 6) + ', ' + (ex - sx * .12) + ' ' + (by + 4) + ', ' + ex + ' ' + ey;
      }
      path.setAttribute('d', d); done.setAttribute('d', d); L = path.getTotalLength(); done.style.strokeDasharray = L + ' ' + (L + 20); done.style.strokeDashoffset = L;
    }
    // size only on load/resize/fonts: on hover the title slides 14px, which must not nudge the planet
    function relayout(){ size(); layout(); }
    relayout(); addEventListener('resize', relayout); if (document.fonts) document.fonts.ready.then(relayout);
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
      if (planet) tw.to(planet, { scale: big.matches ? 1.03 : 1.08, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' }, '<');
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
  }
  $$('.ab_next-card').forEach(nextCard);
  $$('.ab_dbh_title').forEach(function(t){ fitWide(t, 30); }); // hero titles (Launch / CONTROL) stay inside the screen
  AB.nextCard = nextCard; // page bundles call this for cards they build (Mission next-mission)
