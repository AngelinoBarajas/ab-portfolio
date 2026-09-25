
  /* ---------- orbit (Tools Collection List → chips on two rings) ---------- */
  (function(){
    var orbit = $('#orbit'); if (!orbit) return;
    var chips = $$('.ab_stack_chip', orbit); if (!chips.length) return;
    var ICONS = {
      layout: '<rect x="2" y="3" width="12" height="10"/><path d="M2 6h12M6 6v7"/>',
      motion: '<path d="M2 12c3 0 3-8 6-8s3 8 6 8"/>',
      scroll: '<rect x="5" y="2" width="6" height="12"/><path d="M8 5v3"/>',
      pen: '<path d="M3 13l2-6 5-4 3 3-4 5-6 2z"/><path d="M8.5 4.5l3 3"/>',
      cube: '<path d="M8 2l5 3v6l-5 3-5-3V5z"/><path d="M8 8l5-3M8 8L3 5M8 8v6"/>',
      chart: '<circle cx="4" cy="11" r="1.5"/><circle cx="8" cy="5" r="1.5"/><circle cx="12" cy="9" r="1.5"/><path d="M4.8 9.7l2.4-3.4M9.2 6l1.7 1.8"/>',
      tag: '<path d="M5 4L2 8l3 4M11 4l3 4-3 4M9.5 3L6.5 13"/>',
      spark: '<path d="M8 2v4M8 10v4M2 8h4M10 8h4M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"/>',
      branch: '<circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="5.5" r="1.5"/><path d="M4 5v6M12 7c0 2.5-3 3-7.5 4"/>'
    };
    function lum(hx){ var c = hex(hx); return (c[0] * .299 + c[1] * .587 + c[2] * .114) / 255; }
    // real brand logo when we have one (LOGOS, by tool name), else the generic Icon option
    function iconTile(c, extra){
      var color = c.__color, logo = LOGOS[c.__name.toLowerCase()], t = document.createElement('span');
      t.className = 'ci' + (logo ? ' is-logo' : '') + (extra ? ' ' + extra : ''); t.setAttribute('aria-hidden', 'true');
      t.style.setProperty('--tc', color); t.style.setProperty('--ti', lum(color) > .6 ? '#07080D' : '#ffffff');
      t.innerHTML = logo ? '<svg viewBox="0 0 24 24"><path d="' + logo + '"/></svg>' : '<svg viewBox="0 0 16 16">' + (ICONS[c.getAttribute('data-icon')] || ICONS.spark) + '</svg>';
      return t;
    }
    // the first ~40% (at least 4) ride the inner ring, the rest the outer (the CMS has no ring field)
    var nInner = Math.max(4, Math.round(chips.length * .4));
    chips.forEach(function(c, i){
      var cn = $('[data-field="color"]', c);
      c.__color = (cn && cn.style.backgroundColor && rgbToHex(getComputedStyle(cn).backgroundColor)) || '#FF6A3D';
      c.__ring = i < nInner ? 'inner' : 'outer';
      c.__name = c.getAttribute('data-name') || c.textContent.trim();
    });
    var readout = $('#toolReadout');
    var rt = readout && $('.ab_stack_readout-text', readout); if (rt) rt.textContent = chips.length + ' tools · 2 orbits';
    function showTool(c){
      if (!readout) return;
      var old = $('.ci, .ab_stack_ci', readout), t = iconTile(c, 'ab_stack_ci');
      if (old) old.parentNode.replaceChild(t, old);
      $('.ab_stack_readout-title', readout).textContent = c.__name;
      $('.ab_stack_readout-text', readout).textContent = (c.getAttribute('data-use') || '') + ' · ' + c.__ring + ' orbit';
      readout.style.borderColor = c.__color;
    }
    chips.forEach(function(c){
      c.style.setProperty('--tc', c.__color);
      c.insertBefore(iconTile(c), c.firstChild);
      c.setAttribute('aria-label', c.__name + ': ' + (c.getAttribute('data-use') || ''));
      ['pointerenter', 'focus', 'pointerdown'].forEach(function(ev){ c.addEventListener(ev, function(){ showTool(c); }); });
    });
    if (!hasGsap) return;
    var inner = chips.filter(function(c){ return c.__ring === 'inner'; }), outer = chips.filter(function(c){ return c.__ring === 'outer'; });
    var bodies = [];
    [inner, outer].forEach(function(set, ri){ set.forEach(function(c, i){ bodies.push({ el: c, ring: ri, a: (i / set.length) * Math.PI * 2 + ri * .4, sp: ri ? -0.00012 : 0.0002, mode: 'orbit' }); }); });
    function orbitPos(b){ var s = orbit.offsetWidth, rx = b.ring ? s * .46 : s * .30, ry = b.ring ? s * .415 : s * .27; return { x: Math.cos(b.a) * rx, y: Math.sin(b.a) * ry }; }
    bodies.forEach(function(b){
      gsap.set(b.el, { xPercent: -50, yPercent: -50 });
      var p = orbitPos(b); gsap.set(b.el, { x: p.x, y: p.y });
      if (window.Draggable) Draggable.create(b.el, { type: 'x,y', inertia: true, zIndexBoost: true,
        onPress: function(){ b.mode = 'held'; b.el.classList.add('is-held'); },
        onRelease: function(){ b.el.classList.remove('is-held'); if (!this.tween || !this.tween.isActive()) b.mode = 'return'; },
        onThrowComplete: function(){ b.mode = 'return'; } });
    });
    var orbitVisible = false;
    onView(orbit, function(x){ orbitVisible = x; });
    gsap.ticker.add(function(time, dt){
      if (!orbitVisible) return;
      bodies.forEach(function(b){
        if (!reduce) b.a += b.sp * dt;
        if (b.mode === 'held') return;
        var p = orbitPos(b);
        if (b.mode === 'return'){
          var cx = gsap.getProperty(b.el, 'x'), cy = gsap.getProperty(b.el, 'y'), nx = cx + (p.x - cx) * .06, ny = cy + (p.y - cy) * .06;
          gsap.set(b.el, { x: nx, y: ny });
          if (Math.abs(nx - p.x) < .8 && Math.abs(ny - p.y) < .8) b.mode = 'orbit';
        } else gsap.set(b.el, { x: p.x, y: p.y });
      });
    });
  })();

  /* ---------- altitude meter (page scroll → Earth-to-Moon) ---------- */
  (function(){
    if (!hasGsap) return;
    AB.inject('<div class="ab_alt" aria-hidden="true"><div class="ab_alt-fill" id="altFill"></div><div class="ab_alt-lab" id="altLab">ALT 0 km</div></div>');
    var altFill = $('#altFill'), altLab = $('#altLab'), nf = new Intl.NumberFormat('en-US');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function(self){
      var p = self.progress; altFill.style.height = (p * 100) + '%'; altLab.style.bottom = (p * 100) + '%';
      altLab.textContent = p > .995 ? 'ALT 384,400 km · Moon reached' : 'ALT ' + nf.format(Math.round(p * 384400)) + ' km';
    } });
  })();

  /* ---------- transmission (Quotes via the site-data block) ---------- */
  (function(){
    var box = $('#iq'); if (!box || !QUOTES.length) return;
    var textEl = $('#iqText'), byEl = $('#iqBy'), idx = 0, scrub;
    $('#iqTotal').textContent = pad2(QUOTES.length);
    function render(i, reveal){
      var q = QUOTES[i]; idx = i;
      $('#iqIdx').textContent = pad2(i + 1);
      textEl.classList.toggle('long', q.t.length > 80);
      textEl.innerHTML = ''; q.t.split(/\s+/).forEach(function(w){ var s = document.createElement('span'); s.className = 'qw'; s.textContent = w; textEl.appendChild(s); textEl.appendChild(document.createTextNode(' ')); });
      byEl.textContent = q.a + ' · ' + q.c;
      var words = $$('.qw', textEl);
      if (reduce || !hasGsap) return;
      if (reveal === 'scrub'){
        // reveal once when the quote comes into view (robust to pinned sections above changing the page height)
        gsap.set(words, { opacity: .12, y: 10 }); gsap.set(byEl, { opacity: 0 });
        scrub = ScrollTrigger.create({ trigger: box, start: 'top 78%', once: true, onEnter: function(){
          gsap.to(words, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' });
          gsap.to(byEl, { opacity: 1, duration: .6, delay: .4 });
        } });
      } else {
        gsap.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
        gsap.fromTo(byEl, { opacity: 0 }, { opacity: 1, duration: .5, delay: .3 });
      }
    }
    render(0, 'scrub');
    $('#iqNext').addEventListener('click', function(){
      if (scrub){ scrub.kill(); scrub = null; }
      render((idx + 1) % QUOTES.length, 'pop');
    });
  })();
