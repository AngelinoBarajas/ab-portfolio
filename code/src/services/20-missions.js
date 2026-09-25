  /* ---------- related missions: the Work page's own cards, cloned by slug ----------
     The template's hidden Missions list (the service's "Related missions") gives the slugs; the cards
     come from /work so they match the archive exactly (tags, brand colors, cover image), then
     AB.missionCard adds covers, number, status and link the same way ab-work does. */
  (function(){
    var grid = $('#svMissions'); if (!grid) return;
    var slugs = $$('[data-related-source] .w-dyn-item [data-field="slug"]').map(function(p){ return p.textContent.trim(); }).filter(Boolean);
    function empty(n){
      if (n >= 3) return;
      var nm = NAME ? NAME.toLowerCase() : 'this';
      grid.insertAdjacentHTML('beforeend', '<div class="ab_mission-card is-empty"><a class="ab_sv_empty" href="/#launch">' +
        '<span class="ab_sv_empty_k text-style-mono">Mission ' + pad2(n + 1) + ' · unassigned</span>' +
        '<h3 class="ab_sv_empty_h">Yours could be ' + (n ? 'next' : 'first') + '</h3>' +
        '<p class="ab_sv_empty_p">Have something that needs ' + esc(nm) + '? Let’s plot it.</p>' +
        '<span class="ab_mission-card_go text-style-mono">Plan a mission <span class="ab_mission-card_arrow" aria-hidden="true">→</span></span></a></div>');
    }
    function count(n){ set('missions-n', String(n)); set('missions-count', n ? n + ' logged' : 'Yours could be first'); }
    function done(cards){
      cards.forEach(function(card, i){
        grid.appendChild(card);
        if (AB.missionCard) AB.missionCard(card, i);
        var pl = $('.ab_planet', card); if (pl && buildPlanet) buildPlanet(pl);
        var a = $('[data-card-link]', card); if (a && AB.addSel && !a.__sel) AB.addSel(a);
        if (a && a.__sel){ var tag = $('.sel-tag', a.__sel); if (tag) tag.textContent = 'Frame / ' + (a.getAttribute('data-slug') || ''); }
        // spotlight + gentle tilt
        card.addEventListener('pointermove', function(e){
          var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (x * 100) + '%'); card.style.setProperty('--my', (y * 100) + '%');
          if (!reduce && hasGsap && !coarse) gsap.to(card, { rotationY: (x - .5) * 6, rotationX: (.5 - y) * 6, transformPerspective: 1000, duration: .5, ease: 'power2.out' });
        });
        card.addEventListener('pointerleave', function(){ if (hasGsap) gsap.to(card, { rotationY: 0, rotationX: 0, duration: .8, ease: 'elastic.out(1,.6)' }); });
      });
      $$('[data-ph]', grid).forEach(function(a){ a.addEventListener('click', function(e){ e.preventDefault(); toast('Placeholder mission · the debrief lands when the project does.'); }); });
      count(cards.length); empty(cards.length);
      if (hasGsap && !reduce && cards.length) gsap.fromTo(grid.children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'expo.out', clearProps: 'transform,opacity' });
      if (window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 60);
    }
    count(slugs.length);
    if (!slugs.length || !window.fetch || !window.DOMParser){ done([]); return; }
    fetch('/work', { credentials: 'same-origin' }).then(function(r){ if (!r.ok) throw new Error(r.status); return r.text(); }).then(function(html){
      var doc = new DOMParser().parseFromString(html, 'text/html'), by = {};
      $$('.ab_mission-card', doc).forEach(function(c){ var a = c.querySelector('[data-card-link]'); if (a) by[a.getAttribute('data-slug')] = c; });
      done(slugs.filter(function(s){ return by[s]; }).map(function(s){ return document.importNode(by[s], true); }));
    }).catch(function(){ done([]); });
  })();

  /* ---------- next service: the next one in the rail order ---------- */
  (function(){
    var slot = $('#nextSlot'); if (!slot) return;
    var NEXT = CUR ? RAIL[(CUR.i + 1) % RAIL.length] : RAIL[0];
    if (!NEXT || NEXT === CUR){ slot.closest('section').remove(); return; }
    var p = NEXT.el, attrs = ['planet', 'colors', 'ring', 'glow'].map(function(k){ var v = p.getAttribute('data-' + k); return v ? ' data-' + k + '="' + esc(v) + '"' : ''; }).join('');
    var eyebrow = CUR ? 'Next service · ' + pad2(NEXT.i + 1) + ' / ' + pad2(TOTAL) : 'Pairs with';
    slot.innerHTML = '<a class="ab_next-card" href="/services/' + esc(NEXT.slug) + '" data-next-card=""><div class="ab_next-card_content"><div class="ab_next-card_eyebrow text-style-mono">' + eyebrow + '</div><h2 class="ab_next-card_title">' + esc(NEXT.name) + '</h2><div class="ab_next-card_go">Warp to it <span aria-hidden="true">→</span></div></div>' +
      '<div class="ab_planet is-next"' + attrs + ' data-seed="' + (NEXT.i * 11 + 5) + '" data-spin="60" aria-hidden="true"></div></a>';
    var card = $('.ab_next-card', slot), pl = $('.ab_planet', card);
    if (pl && buildPlanet) buildPlanet(pl);
    if (AB.nextCard) AB.nextCard(card);
  })();
