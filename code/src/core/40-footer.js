
  /* ---------- quotes: reserve the tallest quote's height so swapping never shifts the page ---------- */
  function reserve(el, texts, sizeByLength){
    if (!el || !texts.length) return;
    var c = el.cloneNode(false), max = 0; c.removeAttribute('id'); c.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;left:0;top:0;min-height:0;width:' + el.getBoundingClientRect().width + 'px';
    el.parentNode.appendChild(c);
    texts.forEach(function(t){ if (sizeByLength) c.classList.toggle('long', t.length > 80); c.textContent = t; max = Math.max(max, c.getBoundingClientRect().height); });
    c.remove(); el.style.minHeight = Math.ceil(max) + 'px';
  }
  function reserveAll(){ var qt = QUOTES.map(function(q){ return q.t; }); reserve($('#iqText'), qt, true); reserve($('#footQ'), qt); }
  reserveAll(); addEventListener('resize', reserveAll);
  if (document.fonts) document.fonts.ready.then(function(){ reserveAll(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });

  /* ---------- footer: rotating transmission, wordmark ---------- */
  (function(){
    var fq = $('#footQ'), fby = $('#footQBy'), fi = 0;
    function year(c){ var m = String(c).match(/(\d{4})\s*$/); return m ? m[1] : c; }
    if (fq && fby && QUOTES.length > 1) setInterval(function(){
      if (document.hidden) return;
      fi = (fi + 1) % QUOTES.length; var q = QUOTES[fi], by = q.a + ', ' + year(q.c);
      if (reduce || !hasGsap){ fq.textContent = q.t; fby.textContent = by; return; }
      gsap.to(fq, { duration: 1.4, scrambleText: { text: q.t, chars: '░▒▓<>/_#', speed: .6, revealDelay: .2 } });
      gsap.to(fby, { duration: .8, scrambleText: { text: by, chars: 'lowerCase', speed: .6 } });
    }, 9000);

    // wordmark: scale to fit the row; letters rise toward the cursor, click to launch one
    var wm = $('#wordmark'); if (!wm) return;
    function fitWM(){ wm.style.fontSize = '100px'; var p = wm.parentNode, r = p.clientWidth - parseFloat(getComputedStyle(p).paddingLeft) * 2; wm.style.fontSize = Math.min(200, 100 * r / wm.scrollWidth * .995) + 'px'; }
    var txt = wm.textContent.trim(); wm.setAttribute('role', 'img'); wm.setAttribute('aria-label', txt); wm.textContent = '';
    txt.split(/\s+/).forEach(function(word, wi, arr){
      var ws = document.createElement('span'); ws.className = 'wl-word';
      word.split('').forEach(function(ch){ var s = document.createElement('span'); s.className = 'wl'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch; ws.appendChild(s); });
      wm.appendChild(ws);
      if (wi < arr.length - 1){ var sp = document.createElement('span'); sp.className = 'wl-sp'; sp.innerHTML = '&nbsp;'; wm.appendChild(sp); }
    });
    fitWM(); addEventListener('resize', fitWM); if (document.fonts) document.fonts.ready.then(fitWM);
    addEventListener('load', function(){ fitWM(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    var letters = $$('.wl', wm);
    if (reduce || !hasGsap) return;
    var qy = letters.map(function(l){ return gsap.quickTo(l, 'y', { duration: .6, ease: 'elastic.out(1,.45)' }); });
    var foot = $('#siteFoot') || wm.parentNode;
    foot.addEventListener('pointermove', function(e){
      letters.forEach(function(l, i){
        if (l.__flying) return;
        var r = l.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, d = Math.hypot(e.clientX - cx, (e.clientY - cy) * 1.4), f = Math.max(0, 1 - d / 260);
        qy[i](-f * 46); l.classList.toggle('hot', f > .35);
      });
    });
    foot.addEventListener('pointerleave', function(){ letters.forEach(function(l, i){ if (!l.__flying){ qy[i](0); l.classList.remove('hot'); } }); });
    letters.forEach(function(l){
      l.addEventListener('click', function(){
        if (l.__flying) return; l.__flying = true; l.classList.add('lit');
        gsap.timeline({ onComplete: function(){ l.__flying = false; l.classList.remove('lit'); } })
          .to(l, { y: 10, duration: .12, ease: 'power2.out' })
          .to(l, { y: -innerHeight * .9, rotation: gsap.utils.random(-30, 30), duration: .9, ease: 'power3.in' })
          .set(l, { y: 160, rotation: 0, opacity: 0 })
          .to(l, { y: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1,.5)', delay: .5 });
      });
    });
  })();

  /* ---------- feed the black hole: tidal stretch while dragging, spaghettification on capture ---------- */
  (function(){
    // the footer's own black hole (About's Interstellar card has one too, earlier in the page)
    var foot = $('#siteFoot') || document, bhw = $('.ab_planet[data-planet="blackhole"]', foot), feedPlanets = $$('.ab_planet.is-feed');
    if (!bhw || !feedPlanets.length || !hasGsap || !window.Draggable) return;
    var count = 0, grow = 1, countEl = $('#feedCount'), NOVA = 7, novae = 0;
    feedPlanets.forEach(function(p){ p.tabIndex = 0; p.setAttribute('role', 'button'); p.setAttribute('aria-label', 'Planet. Press Enter to send it into the black hole.'); });
    function setCount(n){ count = n; if (countEl) countEl.textContent = n; }
    function bhCenter(){ var core = $('.bh-core', bhw) || bhw, r = core.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: bhw.getBoundingClientRect().width }; }
    function center(el){ var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    // critical mass: the black hole goes nova, throws the planets back out, then re-forms
    function nova(){
      novae++; setCount(0);
      var zone = bhw.parentNode, b = bhCenter(), zr = zone.getBoundingClientRect();
      toast(novae === 1 ? 'Critical mass. The black hole went nova.' : 'Nova ×' + novae + '. It keeps coming back.');
      if (reduce){ gsap.fromTo(bhw, { opacity: 0 }, { opacity: 1, duration: .6, delay: .4 }); grow = 1; gsap.set(bhw, { scale: 1 }); return; }
      var ring = document.createElement('div'), flash = document.createElement('div');
      ring.className = 'bh-shock'; flash.className = 'bh-nova';
      ring.style.left = flash.style.left = (b.x - zr.left) + 'px'; ring.style.top = flash.style.top = (b.y - zr.top) + 'px';
      zone.appendChild(flash); zone.appendChild(ring);
      gsap.timeline({ onComplete: function(){ ring.remove(); flash.remove(); } })
        .to(bhw, { x: '+=6', duration: .04, repeat: 11, yoyo: true, ease: 'none' })
        .to(bhw, { scale: grow * 1.25, duration: .25, ease: 'power2.in' }, 0)
        .add(function(){ gsap.fromTo(sf.state, { warp: .9 }, { warp: 0, duration: 2.2, ease: 'power3.out' }); })
        .fromTo(flash, { scale: .2, opacity: 1 }, { scale: 3.2, opacity: 0, duration: 1.6, ease: 'expo.out' })
        .fromTo(ring, { scale: .1, opacity: 1 }, { scale: 6, opacity: 0, duration: 1.8, ease: 'expo.out' }, '<')
        .to(bhw, { scale: 0, opacity: 0, duration: .35, ease: 'power3.in' }, '<')
        .add(function(){
          feedPlanets.forEach(function(p){ var c = center(p), dx = c.x - b.x, dy = c.y - b.y, d = Math.hypot(dx, dy) || 1;
            gsap.fromTo(p, { x: 0, y: 0 }, { x: dx / d * 90, y: dy / d * 60, rotation: gsap.utils.random(-90, 90), duration: .7, ease: 'power3.out', yoyo: true, repeat: 1, repeatDelay: .3, onComplete: function(){ gsap.set(p, { rotation: 0 }); } }); });
          document.documentElement.classList.add('is-quake'); setTimeout(function(){ document.documentElement.classList.remove('is-quake'); }, 500);
        }, '<')
        .set(bhw, { x: 0 })
        .add(function(){ grow = 1; })
        .fromTo(bhw, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'elastic.out(1,.45)' }, '+=1.4');
    }
    function tidal(p){
      var b = bhCenter(), c = center(p), dx = b.x - c.x, dy = b.y - c.y, d = Math.hypot(dx, dy), infl = b.w * 2.4;
      if (d < infl){ var f = 1 - d / infl; gsap.set(p, { rotation: Math.atan2(dy, dx) * 180 / Math.PI, scaleX: 1 + f * f * 1.6, scaleY: 1 - f * f * .45 }); }
      else gsap.set(p, { rotation: 0, scaleX: 1, scaleY: 1 });
      return { d: d, b: b };
    }
    function home(p, drag){ gsap.to(p, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'elastic.out(1,.55)', onComplete: function(){ if (drag) drag.enable(); } }); }
    function consume(p, drag){
      if (drag) drag.disable();
      var b = bhCenter(), c = center(p), r0 = Math.hypot(c.x - b.x, c.y - b.y), a0 = Math.atan2(c.y - b.y, c.x - b.x), o = { t: 0 };
      var core = $('.bh-core', bhw), rh = core ? core.getBoundingClientRect().width / 2 : 20;
      var done = function(){
        setCount(count + 1);
        var fl = $('.bh-flash', bhw); if (fl && !reduce) gsap.fromTo(fl, { opacity: .95, scale: .6 }, { opacity: 0, scale: 1.3, duration: .9, ease: 'power2.out' });
        grow = Math.min(1.35, grow + .05); gsap.to(bhw, { scale: grow, duration: .8, ease: 'elastic.out(1,.5)' });
        if (count >= NOVA) nova();
        else toast(count === 1 ? 'Spaghettified.' : count === 3 ? '3 planets in. It is getting heavier.' : count === NOVA - 1 ? 'Critical mass is close. One more…' : 'Spaghettified. ×' + count);
        gsap.set(p, { x: 0, y: 0, rotation: 0, scaleX: 0, scaleY: 0, opacity: 1 });
        gsap.to(p, { scaleX: 1, scaleY: 1, duration: 1, delay: 2.2, ease: 'elastic.out(1,.5)', onComplete: function(){ if (drag) drag.enable(); } });
      };
      if (reduce){ gsap.to(p, { opacity: 0, duration: .3, onComplete: done }); return; }
      gsap.to(o, { t: 1, duration: 1.7, ease: 'power2.in', onUpdate: function(){
        var t = o.t, bn = bhCenter(), cn = center(p), rr = rh + Math.max(0, r0 - rh) * Math.pow(1 - t, 1.3), aa = a0 + t * Math.PI * 3.2;
        if (Math.random() < .55){ var sp = document.createElement('span'); sp.className = 'bh-trail'; sp.style.left = cn.x + 'px'; sp.style.top = cn.y + 'px'; document.body.appendChild(sp); setTimeout(function(){ sp.remove(); }, 700); }
        var tx = bn.x + Math.cos(aa) * rr, ty = bn.y + Math.sin(aa) * rr;
        gsap.set(p, { x: gsap.getProperty(p, 'x') + (tx - cn.x), y: gsap.getProperty(p, 'y') + (ty - cn.y),
          rotation: aa * 180 / Math.PI + 180 - t * 40, scaleX: 1 + t * t * 7, scaleY: Math.max(.04, 1 - t * .96), opacity: t > .78 ? Math.max(0, (1 - t) / .22) : 1 });
      }, onComplete: done });
    }
    feedPlanets.forEach(function(p){
      var drag = Draggable.create(p, { type: 'x,y', zIndexBoost: true,
        onDrag: function(){ tidal(p); },
        onRelease: function(){ var t = tidal(p); if (t.d < t.b.w * 1.3) consume(p, this); else home(p, this); } })[0];
      p.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); if (drag.enabled()) consume(p, drag); } });
    });
  })();

  /* ---------- mobile menu (Nav component: .ab_menu_component#mmenu, combo is-open = display:flex) ---------- */
  (function(){
    var btn = $('#menuBtn'), menu = $('#mmenu'); if (!btn || !menu) return;
    var links = $$('.ab_menu_link', menu), isOpen = false, nav = $('#nav');
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'mmenu'); btn.setAttribute('aria-label', 'Open menu');
    var MX = 0, MY = 0;
    function setOrigin(){ var r = btn.getBoundingClientRect(); MX = r.left + r.width / 2; MY = r.top + r.height / 2; }
    function circ(rad){ return 'circle(' + rad + 'px at ' + MX + 'px ' + MY + 'px)'; }
    function radius(){ return Math.hypot(Math.max(MX, innerWidth - MX), Math.max(MY, innerHeight - MY)) + 40; }
    var anim = hasGsap && !reduce;
    function open(){
      if (isOpen) return; isOpen = true; setOrigin();
      menu.hidden = false; menu.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Close menu'); document.documentElement.classList.add('menu-open');
      if (lenis) lenis.stop(); document.documentElement.style.overflow = 'hidden'; if (nav) nav.classList.remove('is-hidden');
      if (!anim){ if (links[0]) links[0].focus(); return; }
      gsap.fromTo(menu, { clipPath: circ(0) }, { clipPath: circ(radius()), duration: .8, ease: 'power3.inOut', onComplete: function(){ gsap.set(menu, { clearProps: 'clipPath' }); } });
      gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .07, delay: .2, ease: 'expo.out' });
      gsap.fromTo($$('.ab_menu_tag, .ab_menu_foot', menu), { opacity: 0 }, { opacity: 1, duration: .6, delay: .45 });
      gsap.fromTo(sf.state, { warp: .35 }, { warp: 0, duration: 1.1, ease: 'power2.out' });
      setTimeout(function(){ if (links[0]) links[0].focus({ preventScroll: true }); }, 300);
    }
    function close(focusBtn){
      if (!isOpen) return; isOpen = false; btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu'); document.documentElement.classList.remove('menu-open');
      if (lenis) lenis.start(); document.documentElement.style.overflow = '';
      var fin = function(){ menu.classList.remove('is-open'); menu.hidden = true; gsap.set(menu, { clearProps: 'clipPath' }); if (focusBtn) btn.focus(); };
      if (!anim){ menu.classList.remove('is-open'); menu.hidden = true; if (focusBtn) btn.focus(); return; }
      setOrigin(); gsap.fromTo(menu, { clipPath: circ(radius()) }, { clipPath: circ(0), duration: .55, ease: 'power3.inOut', onComplete: fin });
    }
    btn.addEventListener('click', function(){ if (isOpen) close(true); else open(); });
    links.forEach(function(a){ a.addEventListener('click', function(){ close(false); }); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && isOpen) close(true); });
    addEventListener('resize', function(){ if (innerWidth > 991 && isOpen) close(false); });
  })();

  /* ---------- touch wording ---------- */
  if (coarse){
    var rb = $('#toolReadout .ab_stack_readout-title'); if (rb) rb.textContent = 'Tap a tool';
    var wh = $('.ab_footer_wordmark-hint'); if (wh) wh.textContent = 'Tap a letter to launch it.';
    var fh = $('.ab_footer_feed-hint'); if (fh) fh.textContent = 'Feed the black hole · drag a planet into it';
  }

  AB.ready = true;
