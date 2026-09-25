
  /* ---------- lenis (smooth scroll on the GSAP ticker) ---------- */
  var lenis = null;
  if (hasGsap && !reduce && window.Lenis){
    lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToTarget(t){
    if (lenis) lenis.scrollTo(t, { offset: -70, immediate: true });
    else if (typeof t === 'number') window.scrollTo(0, t);
    else t.scrollIntoView();
    if (window.ScrollTrigger) ScrollTrigger.update();
  }
  // same-page anchors (#work, /#launch on Home): warp, then jump. stopPropagation keeps Webflow's own smooth scroll out of it
  $$('a[href*="#"]').forEach(function(a){
    if (a.hasAttribute('data-board-frame') || a.hasAttribute('data-social') || a.hasAttribute('data-copy-email')) return;
    var raw = a.getAttribute('href') || '';
    if (a.hash.length < 2 || a.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || !/^(\/?#|\/[^#]*#)/.test(raw)) return;
    a.addEventListener('click', function(e){
      var id = decodeURIComponent(a.hash.slice(1)), t = document.getElementById(id); if (!t) return;
      e.preventDefault(); e.stopPropagation();
      var top = id === 'top';
      warp(function(){ scrollToTarget(top ? 0 : t); });
    });
  });

  // links to another page on the site warp out first (same effect as Return to orbit). Handlers that already
  // took the click (board frames, cards, the next card) call AB.go themselves; data-no-warp opts a link out
  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var raw = a.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#' || /^(mailto|tel|javascript|sms):/i.test(raw)) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-warp') || a.origin !== location.origin) return;
    if (a.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && a.search === location.search) return;
    e.preventDefault();
    AB.go(a.href);
  });

  function nudge(el, after){
    el.addEventListener('keydown', function(e){
      var m = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[e.key];
      if (!m || !hasGsap) return; e.preventDefault();
      gsap.to(el, { x: '+=' + m[0], y: '+=' + m[1], duration: .25, ease: 'power2.out', onComplete: after });
    });
  }
  Object.assign(AB, { lenis: lenis, scrollToTarget: scrollToTarget, nudge: nudge });

  (function(){
    if (!hasGsap) return;

    /* ---------- nav hide on scroll ---------- */
    var nav = $('#nav'), lastY = 0;
    if (nav) addEventListener('scroll', function(){
      var y = scrollY;
      var ms = window.__abMissionST, inPin = ms && y >= ms.start - 10 && y <= ms.end + 10;
      nav.classList.toggle('is-hidden', !inPin && y > 300 && y > lastY + 4);
      if (inPin) nav.classList.remove('is-hidden');
      if (y < lastY - 4 || y < 300) nav.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });

    /* ---------- nav: mark the section in view ---------- */
    $$('.ab_nav_link').forEach(function(a){
      if (a.hash.length < 2 || a.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) return;
      var sec = document.getElementById(a.hash.slice(1)); if (!sec) return;
      ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: function(self){ a.classList.toggle('is-active', self.isActive); } });
    });

    /* ---------- scramble + magnetic ---------- */
    $$('[data-scramble]').forEach(function(a){
      var txt = a.textContent;
      a.addEventListener('mouseenter', function(){ if (!reduce) gsap.to(a, { duration: .6, scrambleText: { text: txt, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#_/', speed: .6 } }); });
    });
    if (!coarse && !reduce){
      $$('[data-magnetic]').forEach(function(el){
        var qx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), qy = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
        el.addEventListener('pointermove', function(e){ var r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * .25); qy((e.clientY - r.top - r.height / 2) * .35); });
        el.addEventListener('pointerleave', function(){ qx(0); qy(0); });
      });
    }

    /* ---------- planets: parallax (data-parallax = px of travel) ---------- */
    if (!reduce) $$('.ab_planet[data-parallax]').forEach(function(p){
      gsap.to(p, { y: num(p.getAttribute('data-parallax'), -80) * (innerWidth < 768 ? .3 : 1), ease: 'none', scrollTrigger: { trigger: p.closest('section') || p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* ---------- planets: idle float + bounce that reacts to scroll speed ---------- */
    if (!reduce){
      var bouncers = [];
      planets.forEach(function(p, i){
        if (p.closest('.ab_planner_viz')) return;
        var tries = 0;
        (function hook(){
          if (!p.__body){ if (tries++ < 60) setTimeout(hook, 100); return; }
          var b = p.__body, size = p.getBoundingClientRect().width || 100, weight = gsap.utils.clamp(.45, 1.6, 140 / size);
          gsap.to(b, { yPercent: gsap.utils.random(-3, 3), rotation: gsap.utils.random(-2, 2), duration: gsap.utils.random(3, 5.5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * .3 });
          bouncers.push({ w: weight, qy: gsap.quickTo(b, 'y', { duration: 1.3, ease: 'elastic.out(1, 0.32)' }), qs: gsap.quickTo(b, 'scaleY', { duration: 1, ease: 'elastic.out(1, 0.4)' }), qx: gsap.quickTo(b, 'scaleX', { duration: 1, ease: 'elastic.out(1, 0.4)' }), last: 0 });
        })();
      });
      var lastScroll = scrollY, vel = 0;
      gsap.ticker.add(function(){
        var v = lenis ? lenis.velocity : (scrollY - lastScroll); lastScroll = scrollY;
        vel += (v - vel) * .25;
        bouncers.forEach(function(b){
          var ty = gsap.utils.clamp(-46, 46, -vel * 2.4 * b.w);
          if (Math.abs(ty - b.last) < .4) return; b.last = ty;
          var sq = Math.min(.07, Math.abs(vel) * .0025 * b.w);
          b.qy(ty); b.qs(1 - sq); b.qx(1 + sq * .6);
        });
      });
    }

    /* ---------- reveals ([data-split] headings, .t-signal scramble) ---------- */
    if (!reduce){
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(function(){
        $$('[data-split]').forEach(function(el){
          var split = SplitText.create(el, { type: 'lines', mask: 'lines' });
          gsap.from(split.lines, { yPercent: 110, duration: 1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: function(){ split.revert(); decorate(el); } });
        });
        ScrollTrigger.refresh();
      });
      $$('.t-signal').forEach(function(el){
        var txt = el.textContent;
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function(){ gsap.fromTo(el, { scrambleText: { text: '', chars: '' } }, { duration: 1.4, scrambleText: { text: txt, chars: '░▒▓<>/_#', revealDelay: .2, speed: .5 } }); } });
      });
    } else decorate(document);

    /* ---------- metrics ([data-count]) ---------- */
    $$('[data-count]').forEach(function(el){
      var o = { v: 0 };
      if (reduce) return;
      // target read on enter: page bundles may update data-count after this runs (Work sets it from the CMS list)
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function(){
        var target = +el.getAttribute('data-count');
        gsap.fromTo(o, { v: 0 }, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: function(){ el.textContent = Math.round(o.v); } });
      } });
    });

    /* ---------- FAQ: eased open / close, one open at a time ---------- */
    (function(){
      var items = $$('.ab_faq_item'), refreshT;
      function refresh(){ clearTimeout(refreshT); refreshT = setTimeout(function(){ ScrollTrigger.refresh(); }, 60); }
      function close(d){
        var a = $('.ab_faq_answer', d); d.classList.remove('is-open');
        if (reduce || !a){ d.open = false; refresh(); return; }
        gsap.to(a, { height: 0, opacity: 0, paddingBottom: 0, duration: .45, ease: 'power3.inOut', overwrite: true,
          onComplete: function(){ d.open = false; gsap.set(a, { clearProps: 'height,opacity,paddingBottom' }); refresh(); } });
      }
      function open(d){
        var a = $('.ab_faq_answer', d); d.open = true; d.classList.add('is-open');
        if (reduce || !a){ refresh(); return; }
        gsap.set(a, { clearProps: 'height,paddingBottom,opacity' });
        var H = a.getBoundingClientRect().height;
        gsap.fromTo(a, { height: 0, opacity: 0, paddingBottom: 0 }, { height: H, opacity: 1, paddingBottom: 26, duration: .6, ease: 'power3.out', overwrite: true,
          onComplete: function(){ gsap.set(a, { clearProps: 'height,paddingBottom' }); refresh(); } });
        gsap.fromTo(a, { y: -8 }, { y: 0, duration: .6, ease: 'power3.out' });
      }
      items.forEach(function(d){
        var s = $('.ab_faq_summary', d); if (!s) return;
        s.addEventListener('click', function(e){
          e.preventDefault();
          if (d.classList.contains('is-open')) close(d);
          else { items.forEach(function(o){ if (o !== d && o.classList.contains('is-open')) close(o); }); open(d); }
        });
      });
    })();

    /* ---------- light sections: smooth arc on the top and bottom edge ---------- */
    function arcClip(bg){
      var W = bg.offsetWidth, H = bg.offsetHeight, a = Math.max(24, Math.min(80, W * .05));
      bg.style.clipPath = "path('M0 " + a + " Q " + W / 2 + " " + (-a) + " " + W + " " + a + " L " + W + " " + (H - a) + " Q " + W / 2 + " " + (H + a) + " 0 " + (H - a) + " Z')";
    }
    /* ---------- light sections: dot field that reacts to the cursor ---------- */
    $$('.ab_light-bg').forEach(function(bg){
      arcClip(bg); if (window.ResizeObserver) new ResizeObserver(function(){ arcClip(bg); }).observe(bg);
      var c = document.createElement('canvas'); bg.appendChild(c);
      var ctx = c.getContext('2d'), W, H, dots = [], GAP = 24, mx = -9999, my = -9999, vis = false, live = 0, ripples = [];
      function size(){ W = bg.offsetWidth; H = bg.offsetHeight; c.width = W; c.height = H; dots = []; for (var y = GAP / 2; y < H; y += GAP) for (var x = GAP / 2; x < W; x += GAP) dots.push({ x: x, y: y, ox: 0, oy: 0, s: 0 }); draw(); }
      function draw(){
        ctx.clearRect(0, 0, W, H); var R = 170, moving = false, now = performance.now();
        ripples = ripples.filter(function(rp){ return now - rp.t < 1600; }); if (ripples.length) moving = true;
        for (var i = 0; i < dots.length; i++){
          var d = dots[i], dx = d.x - mx, dy = d.y - my, tx = 0, ty = 0, ts = 0;
          if (dx > -R && dx < R && dy > -R && dy < R){ var dist = Math.sqrt(dx * dx + dy * dy); if (dist < R){ var f = 1 - dist / R, push = f * f * 24; tx = dx / (dist || 1) * push; ty = dy / (dist || 1) * push; ts = f; } }
          for (var q = 0; q < ripples.length; q++){ var rp = ripples[q], age = now - rp.t, RR = age * .8, rdx = d.x - rp.x, rdy = d.y - rp.y, dd = Math.sqrt(rdx * rdx + rdy * rdy), del = dd - RR;
            if (del > -70 && del < 70){ var kk = (1 - Math.abs(del) / 70) * (1 - age / 1600); tx += rdx / (dd || 1) * kk * 18; ty += rdy / (dd || 1) * kk * 18; if (kk > ts) ts = kk; } }
          if (d.s > .001 || ts){
            d.ox += (tx - d.ox) * .32; d.oy += (ty - d.oy) * .32; d.s += (ts - d.s) * .32; // .14 trailed the cursor
            if (Math.abs(d.ox - tx) > .05 || Math.abs(d.s - ts) > .005) moving = true;
          }
          var r = 1.2 + d.s * 2.6;
          ctx.fillStyle = d.s > .03 ? 'rgba(255,106,61,' + (.2 + d.s * .7).toFixed(3) + ')' : 'rgba(11,12,20,.14)';
          ctx.fillRect(d.x + d.ox - r / 2, d.y + d.oy - r / 2, r, r);
        }
        return moving;
      }
      function loop(){ if (!vis){ live = 0; return; } var m = draw(); if (m || live > 0){ live--; requestAnimationFrame(loop); } else live = 0; }
      function kick(){ var was = live; live = 20; if (was <= 0) requestAnimationFrame(loop); }
      bg.__ripple = function(cx, cy){ if (reduce) return; var r = bg.getBoundingClientRect(); ripples.push({ x: cx - r.left, y: cy - r.top, t: performance.now() }); kick(); live = 100; };
      size(); addEventListener('resize', size);
      onView(bg.parentNode, function(x){ vis = x; if (!x){ mx = my = -9999; } });
      if (!reduce && !coarse){
        var lastE = null;
        var track = function(e){
          if (!vis || !e) return;
          var r = bg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, a = -(gsap.getProperty(bg, 'rotation') || 0) * Math.PI / 180;
          var px = e.clientX - cx, py = e.clientY - cy;
          mx = px * Math.cos(a) - py * Math.sin(a) + W / 2; my = px * Math.sin(a) + py * Math.cos(a) + H / 2; kick();
        };
        addEventListener('pointermove', function(e){ lastE = e; track(e); }, { passive: true });
        bg.parentNode.addEventListener('pointerleave', function(){ mx = my = -9999; kick(); });
        addEventListener('scroll', function(){ track(lastE); }, { passive: true });
      }
    });

    /* ---------- click pulse in empty space ---------- */
    if (!reduce){
      var NOPULSE = 'a,button,input,textarea,select,label,details,[role="button"],form,.ab_bento-card,.ab_board_component,.ab_stack_chip,.ab_planet,.ab_hero_badge,.ab_hero_sat,[data-drag],.ab_process_panel,.ab_process_traj,.ab_quote,.wl,.ab_nav_component,.ab_stack_readout,.ab_hero_title .w';
      document.addEventListener(coarse ? 'click' : 'pointerdown', function(e){
        if (e.button !== 0 || (e.target.closest && e.target.closest(NOPULSE))) return;
        ['a', 'b', 'c'].forEach(function(k){ var r = document.createElement('span'); r.className = 'cpulse ' + k; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(function(){ r.remove(); }, 1300); });
        var d = document.createElement('span'); d.className = 'cpulse-dot'; d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 600);
        var lsec = e.target.closest && e.target.closest('.theme-light'); if (lsec){ var lb = $('.ab_light-bg', lsec); if (lb && lb.__ripple) lb.__ripple(e.clientX, e.clientY); }
      });
    }
  })();
