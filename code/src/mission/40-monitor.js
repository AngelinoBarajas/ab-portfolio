  /* =========================================================
     MISSION CONTROL monitor · views built from the Mission Channels list
     ========================================================= */
  (function(){
    var screen = $('#screen'), chans = $('#chans'); if (!screen || !CH.length) { var sec = $('#monitor'); if (sec && !CH.length) sec.remove(); return; }
    // the AB planet monogram (AB.markSVG in core): build/grid show the construction grid, grid adds its measurements
    function markSVG(mode){ return AB.markSVG({ grid: mode !== 'light' && mode !== 'plain', dims: mode === 'grid' }); }
    function smallMark(color){ var M = AB.MARK; return '<svg viewBox="0 0 490.16 241.75" aria-hidden="true"><g fill="' + color + '"><path d="' + M.a + '"/><path d="' + M.planet + '"/><path d="' + M.b + '"/></g></svg>'; }
    function channelView(c){
      // (a mobile still/loop centers its phone inline too, so it doesn't wait on a stylesheet release)
      var v = '<div class="view ' + c.kind + (c.mode === 'light' ? ' light' : '') + '" data-ch="' + esc(c.id) + '" data-kind="' + c.kind + '" role="tabpanel" aria-label="' + esc(c.label) + '"' + (c.kind === 'mobile' ? ' style="display:grid;place-items:center"' : '') + '>';
      if (c.kind === 'img') v += c.src ? '<img class="full" src="' + esc(c.src) + '" alt="' + esc(c.caption) + '" loading="lazy">' : '';
      else if (c.kind === 'mobile') v += '<div class="phone-f"><div><img src="' + esc(c.src) + '" alt="' + esc(c.caption) + '" loading="lazy"></div></div>';
      else if (c.kind === 'wipe') v += '<div class="wipe"><img src="' + esc(c.before) + '" alt="Design file"><img class="aft" src="' + esc(c.after) + '" alt="Built site"><span class="hdl"><i>⇆</i></span><span class="lab l">Design</span><span class="lab r">Build</span></div>';
      else if (c.kind === 'live-globe') v += '<div class="boot">Booting globe…</div>';
      else if (c.kind === 'live-map') v += '<div class="boot">Booting map engine…</div>';
      else if (c.kind === 'logo') v += markSVG(c.mode);
      else if (c.kind === 'apps') v += '<div class="app"><div class="tab">' + smallMark('#F2F0EA') + '<span>Angelino Barajas</span></div>Favicon · 16px</div>' +
        '<div class="app"><div class="av">' + smallMark('#F2F0EA') + '</div>Avatar</div>' +
        '<div class="app"><div class="card" tabindex="0"><div><div class="f">' + smallMark('#F2F0EA') + '</div><div class="b"><b>Angelino Barajas</b>Webflow designer + developer</div></div></div>Card · hover to flip</div>' +
        '<div class="app"><div class="stk">' + smallMark('#0B0C14') + '</div>Sticker</div>';
      return v + '</div>';
    }
    var TYPE = { 'live-globe': 'Live', 'live-map': 'Live', 'wipe': 'Compare', 'mobile': 'Phone', 'img': 'Still', 'logo': 'Vector', 'apps': 'Mockups', 'figma': 'Build', 'phone': 'Phone', 'flow': 'Plan', 'exploded': 'Layers', 'cms': 'CMS', 'sketch': 'Sketch', 'vector': 'Vector', 'graph': 'Graph', 'library': 'Library', 'voice': 'AI + you', 'setup': 'CMS', 'video': 'Video', 'schema': 'Schema', 'portable': 'Model',
      'tw-loom': 'Play', 'tw-plan': 'Plan', 'tw-app': 'Explore', 'tw-capture': 'Phone', 'tw-cms': 'Try it', 'tw-roadmap': 'Phases' };
    var KIND = { 'live-globe': 'LIVE · three.js r128', 'live-map': 'LIVE · d3 v7', 'wipe': 'COMPARE · figma ↔ webflow', 'figma': 'MOCKUP · figma → webflow', 'phone': 'MOCKUP · mobile', 'flow': 'MOCKUP · figjam → build', 'exploded': 'BREAKDOWN · layers', 'cms': 'MOCKUP · cms → site', 'mobile': 'STILL · mobile', 'img': 'STILL', 'logo': 'VECTOR · svg', 'apps': 'MOCKUPS', 'sketch': 'SKETCH · pen + paper', 'vector': 'MOCKUP · illustrator', 'graph': 'MOCKUP · knowledge graph', 'library': 'MOCKUP · insights library', 'voice': 'MOCKUP · voice kit → review', 'setup': 'MOCKUP · cms → site', 'video': 'MOCKUP · video + chapters', 'schema': 'MOCKUP · json-ld → search + ai', 'portable': 'MOCKUP · content model',
      'tw-loom': 'DEMO · the loom, canvas', 'tw-plan': 'FIGJAM · ideation → wireframes → build', 'tw-app': 'DEMO · dashboard prototype', 'tw-capture': 'DEMO · voice kit, phone app', 'tw-cms': 'DEMO · cms → site + json-ld', 'tw-roadmap': 'ROADMAP · five phases' };
    screen.innerHTML = CH.map(channelView).join('') + '<div class="scan"></div><div class="roll"></div><div class="vig"></div><canvas class="noise" id="noise" width="160" height="100"></canvas>' +
      '<i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i><div class="osd" id="osd">CH 1</div>';
    // a recorded loop of the real site (MOCKS[slug].img) is labeled as a recording, not a still
    CH.forEach(function(c){ if (c.loop){ TYPE['loop-' + c.kind] = 'Loop'; KIND['loop-' + c.kind] = 'LOOP · recorded from the site' + (c.kind === 'mobile' ? ' · phone' : ''); } });
    function tk(c){ return c.loop ? 'loop-' + c.kind : c.kind; }
    chans.innerHTML = CH.map(function(c, i){ return '<button type="button" role="tab" data-ch="' + esc(c.id) + '" aria-selected="' + (i ? 'false' : 'true') + '"><span class="k">' + (i + 1) + '</span><span>' + esc(c.label) + '</span><span class="t">' + (TYPE[tk(c)] || '') + '</span></button>'; }).join('');
    chans.style.setProperty('--n', CH.length);
    var views = $$('.view', screen), chBtns = $$('button', chans), osd = $('#osd'), monLabel = $('#monLabel'), monCap = $('#monCap'), monKind = $('#monKind');
    // coded scenes need this mission's mockup spec for that kind; one broken scene never stops the monitor
    var NEED = { figma: 'els', phone: 'mobile', flow: 'flow', exploded: 'explode', cms: 'cms', sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable',
      'tw-loom': 'tw', 'tw-plan': 'tw', 'tw-app': 'tw', 'tw-capture': 'tw', 'tw-cms': 'tw', 'tw-roadmap': 'tw' };
    views.forEach(function(v, k){
      var c = CH[k], key = NEED[c.kind]; if (!key) return;
      if (!(M.mock && M.mock[key])){ v.innerHTML = '<div class="boot">Mockup coming soon</div>'; return; }
      try { SCENE.mount(v, c, M); } catch(err){ if (window.console) console.warn('[ab-mission] scene', c.id, err); v.innerHTML = '<div class="boot">Mockup unavailable</div>'; }
    });
    var noise = $('#noise'), nctx = noise.getContext('2d'), curCh = 0, booted = {}, monVisible = false;
    function staticBurst(){
      if (reduce || !hasGsap) return;
      var o = { t: 0 };
      gsap.fromTo(noise, { opacity: .9 }, { opacity: 0, duration: .38, ease: 'power2.in' });
      gsap.to(o, { t: 1, duration: .38, onUpdate: function(){ var img = nctx.createImageData(160, 100), d = img.data; for (var i = 0; i < d.length; i += 4){ var v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } nctx.putImageData(img, 0, 0); } });
      gsap.fromTo(screen, { filter: 'brightness(2) saturate(0)' }, { filter: 'brightness(1) saturate(1)', duration: .45, ease: 'power2.out', clearProps: 'filter' });
    }
    var seenCh = {};
    // the cloth for Topicweave channel changes (23-tw-base.js), on its own layer above the views
    var TWV = null, lastPt = null;
    if (M.mock && M.mock.tw && SCENE.kit.tw && !reduce){ var twl = document.createElement('div'); twl.className = 'tw-sw'; twl.setAttribute('aria-hidden', 'true'); screen.appendChild(twl); TWV = SCENE.kit.tw.weave(twl, { mode: 'radial', durIn: .42, durOut: .6, grid: 14 }); }
    chans.addEventListener('pointerdown', function(e){ lastPt = { x: e.clientX, y: e.clientY, t: Date.now() }; });
    function setCh(i, silent){
      i = (i + CH.length) % CH.length; var c = CH[i]; curCh = i;
      seenCh[i] = true; if (CH.length > 1 && Object.keys(seenCh).length >= CH.length && AB.quest) AB.quest('channels');
      // Topicweave: the site's thread cloth knits over the screen from the tab you pressed, then unravels onto the new channel
      var woven = !silent && TWV && !reduce;
      function show(){ views.forEach(function(v, k){ v.classList.toggle('on', k === i); }); }
      if (woven){ var sr = screen.getBoundingClientRect(), pt = lastPt && lastPt.t > Date.now() - 800 ? [lastPt.x - sr.left, lastPt.y - sr.top] : [sr.width / 2, sr.height / 2]; TWV(true, pt, function(){ if (curCh === i) show(); TWV(false); }); }
      else show();
      chBtns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      monLabel.textContent = c.label; monCap.textContent = c.caption; monKind.textContent = KIND[tk(c)] || '';
      $('#tCh').textContent = (i + 1) + ' / ' + CH.length;
      $('#tSrc').textContent = c.kind.indexOf('live') === 0 ? 'Live code' : liveOn(c) ? 'Live site' : c.loop ? 'Recording' : /^tw-/.test(c.kind) ? 'Coded demo' : c.kind === 'wipe' ? 'Figma + site' : /^(figma|phone|flow|exploded|cms|sketch|vector|graph|library|voice|setup|video|schema|portable)$/.test(c.kind) ? 'Mockup' : c.kind === 'logo' || c.kind === 'apps' ? 'Vector' : 'Screenshot';
      if (liveOn(c)){ monKind.textContent = 'LIVE · ' + LIVE.host; chBtns[i].querySelector('.t').textContent = 'Live'; }
      osd.textContent = 'CH ' + (i + 1) + ' · ' + c.label;
      if (!silent){ if (!woven) staticBurst(); if (!reduce && hasGsap) gsap.fromTo(osd, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 3, yoyo: true }); }
      boot(c, views[i]);
      if (c.kind === 'logo') logoAnim(views[i], c.mode);
      SCENE.activate(c.id);
    }
    chBtns.forEach(function(b, i){ b.addEventListener('click', function(){ if (i !== curCh) setCh(i); }); });
    // "Show on the monitor" buttons in systems + problems
    document.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-show]'); if (!b) return;
      e.preventDefault();
      var i = -1; CH.forEach(function(c, k){ if (i < 0 && c.id === b.getAttribute('data-show')) i = k; }); if (i < 0) return;
      var go = function(){ setCh(i); }, mon = $('#monitor');
      if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(mon, { offset: -80, duration: 1.2, onComplete: go }); else { mon.scrollIntoView({ behavior: 'smooth' }); setTimeout(go, 600); }
    });
    new IntersectionObserver(function(es){ monVisible = es[0].isIntersecting; if (monVisible) boot(CH[curCh], views[curCh]); }, { rootMargin: '200px' }).observe(screen);
    document.addEventListener('keydown', function(e){
      if (!monVisible || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      var n = parseInt(e.key, 10); if (n >= 1 && n <= CH.length && n - 1 !== curCh) setCh(n - 1);
    });
    // timecode + frame rate
    if (hasGsap) (function(){
      var tc = $('#monTC'), fpsEl = $('#tFps'), t0 = performance.now(), acc = 0, frames = 0;
      gsap.ticker.add(function(time, dt){
        if (!monVisible) return;
        frames++; acc += dt;
        if (acc > 500){ fpsEl.textContent = Math.round(frames * 1000 / acc) + ' fps'; frames = 0; acc = 0; }
        var s = (performance.now() - t0) / 1000, f = Math.floor((s % 1) * 24);
        tc.textContent = pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(Math.floor(s) % 60) + ':' + pad2(f);
      });
    })();
    // design → build wipe
    $$('.wipe', screen).forEach(function(w){
      var p = 50, drag = false;
      function set(x){ var r = w.getBoundingClientRect(); p = Math.max(0, Math.min(100, (x - r.left) / r.width * 100)); w.style.setProperty('--p', p + '%'); w.setAttribute('aria-valuenow', Math.round(p)); }
      w.addEventListener('pointerdown', function(e){ drag = true; w.setPointerCapture(e.pointerId); set(e.clientX); });
      w.addEventListener('pointermove', function(e){ if (drag) set(e.clientX); });
      w.addEventListener('pointerup', function(){ drag = false; });
      w.tabIndex = 0; w.setAttribute('role', 'slider'); w.setAttribute('aria-label', 'Compare design and build'); w.setAttribute('aria-valuemin', 0); w.setAttribute('aria-valuemax', 100);
      w.addEventListener('keydown', function(e){ var d = { ArrowLeft: -5, ArrowRight: 5 }[e.key]; if (!d) return; e.preventDefault(); p = Math.max(0, Math.min(100, p + d)); w.style.setProperty('--p', p + '%'); w.setAttribute('aria-valuenow', Math.round(p)); });
    });
    // live channels: the real production code, loaded on first view (vendor copies in this repo)
    function boot(c, view){
      if (liveOn(c) && monVisible) liveSite(c, view);
      if (booted[c.id] || !view.classList.contains('on') || (!monVisible && c.kind.indexOf('live') === 0)) return;
      var bootEl = $('.boot', view);
      if (c.kind === 'live-globe'){
        booted[c.id] = true;
        var data = document.createElement('div'); data.className = 'globe_cms-data'; data.hidden = true;
        data.innerHTML = PINS.map(function(p, i){ return '<div class="globe_cms-item" data-globe-lat="' + p.lat + '" data-globe-lng="' + p.lng + '" data-globe-city="' + esc(p.city) + '" data-globe-title="' + esc(p.title) + '" data-globe-slug="p' + i + '"' + (p.link ? ' data-globe-link="' + esc(p.link) + '"' : ' data-globe-has-case-study="false"') + '><img class="globe_cms-img" src="' + esc(p.img) + '" alt=""></div>'; }).join('');
        document.body.appendChild(data);
        var w = document.createElement('div'); w.className = 'globe-hero_canvas-wrapper'; view.appendChild(w);
        var cue = document.createElement('div'); cue.className = 'globe-cue'; cue.textContent = 'Drag to explore · Click + Scroll to zoom'; view.appendChild(cue);
        window.__globeCtaHref = M.live || '';
        loadScript(VENDOR + '510-globe.js').then(function(){ setTimeout(function(){ if (bootEl) bootEl.classList.add('gone'); }, 900); })
          .catch(function(){ if (bootEl) bootEl.textContent = 'Live demo unavailable'; });
      }
      if (c.kind === 'live-map'){
        booted[c.id] = true;
        var types = ['Asylum', 'Family-Based', 'Removal Defense', 'Work Visa', 'Humanitarian'];
        var m = document.createElement('div'); m.className = 'case-map is-fill';
        m.innerHTML = '<div class="case-map_canvas-wrap" id="canvasWrap"><div class="map_loading" id="loadingMsg"></div><canvas class="map_canvas" id="mapCanvas"></canvas>' +
          '<button class="map_zoom-reset" id="zoomReset" aria-label="Reset view" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 3 3 3 3 9"/><polyline points="15 3 21 3 21 9"/><polyline points="3 15 3 21 9 21"/><polyline points="21 15 21 21 15 21"/></svg></button>' +
          '<div class="map_hint"><span>Hover a pin to preview · Click for details</span></div>' +
          '<div class="pin-tooltip" id="pinTooltip"><span class="pin-tooltip-type" id="pinTooltipType"></span><span class="pin-tooltip-outcome" id="pinTooltipOutcome"></span></div>' +
          '<div class="popup" id="popup"><div class="popup-rule"></div><div class="popup-body" id="popup-body"></div></div></div>' +
          '<div class="hero_filters"><span class="hero_filters-label">Filter by</span><button type="button" class="filter_chip is-active" data-type="all">All cases</button>' + types.map(function(t){ return '<button type="button" class="filter_chip" data-type="' + t + '">' + t + '</button>'; }).join('') + '</div>';
        view.appendChild(m);
        window.__daMapNoLinks = true;
        loadScript(VENDOR + 'aguirre-case-map.js').then(function(){ setTimeout(function(){ if (bootEl) bootEl.classList.add('gone'); }, 1400); })
          .catch(function(){ if (bootEl) bootEl.textContent = 'Live demo unavailable'; });
      }
    }
    // logo channels: the mark draws itself on its grid
    function logoAnim(view, mode){
      var svg = $('svg', view); if (!svg) return;
      if (reduce || !hasGsap) return;
      var gs = $$('.lg-g', view), mk = $('.lg-m', view), ps = $$('.lg-m path', view), dm = $('.lg-d', view);
      gsap.killTweensOf([gs, mk, ps, dm]);
      gs.forEach(function(g){ var L = g.getTotalLength ? g.getTotalLength() : 600; gsap.fromTo(g, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay: Math.random() * .3 }); });
      if (dm) gsap.fromTo(dm, { opacity: 0 }, { opacity: 1, duration: .5, delay: .9 });
      // the mark warps in from a point, spinning, as an outline, then fills
      var d = gs.length ? .6 : .1;
      gsap.fromTo(mk, { scale: .05, rotation: -720, opacity: 0, svgOrigin: '240 121' }, { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: d });
      gsap.fromTo(ps, { fillOpacity: 0, stroke: 'currentColor', strokeWidth: 5, strokeOpacity: 1 }, { fillOpacity: 1, strokeOpacity: 0, duration: .6, stagger: .12, ease: 'power2.out', delay: d + .9 });
    }
    /* live sites: a mission whose real site isn't up yet (mock.live) runs coded demos; once the site answers
       (M.liveCheck in 30-mission), the live channels show the real page in an iframe, the coded demo one tap away.
       Phones keep the demo (battery + data) and get a link out instead. */
    var LIVE = null;
    function liveOn(c){ return !!(LIVE && LIVE.ok && LIVE.pages[c.id]); }
    function liveSite(c, view){
      if (view.__live) return; view.__live = true;
      var url = LIVE.base + LIVE.pages[c.id], sc = SCENE.get(c.id);
      if (coarse){ view.insertAdjacentHTML('beforeend', '<a class="cx-open" href="' + esc(url) + '" target="_blank" rel="noopener">Open the live site ↗</a>'); return; }
      var box = document.createElement('div'); box.className = 'cx-live';
      box.innerHTML = '<iframe title="' + esc(c.label) + ', live on ' + esc(LIVE.host) + '" src="' + esc(url) + '" loading="lazy" referrerpolicy="no-referrer"></iframe>';
      var bar = document.createElement('div'); bar.className = 'cx-live-bar';
      bar.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener"><i></i>Live · ' + esc(LIVE.host) + ' ↗</a><button type="button">Show the coded demo</button>';
      view.appendChild(box); view.appendChild(bar);
      var fr = $('iframe', box), btn = $('button', bar);
      // the page renders at desktop width, scaled down to the screen
      function fit(){ var W = view.clientWidth, H = view.clientHeight; if (!W) return; var k = Math.min(1, W / 1280); fr.style.width = W / k + 'px'; fr.style.height = H / k + 'px'; fr.style.transform = 'scale(' + k + ')'; }
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(view);
      // one class flips between the real page and the coded demo (which pauses while hidden)
      function show(live){ view.classList.toggle('is-live', live); btn.textContent = live ? 'Show the coded demo' : 'Show the live site'; if (sc){ if (live && sc.hold) sc.hold(); if (!live && sc.resume) sc.resume(); } }
      btn.addEventListener('click', function(){ show(!view.classList.contains('is-live')); });
      show(true);
    }
    if (M.liveCheck) M.liveCheck.then(function(ok){
      if (!ok) return;
      var L = M.mock.live; LIVE = { ok: true, base: L.base, pages: L.pages || {}, host: L.base.replace(/^https?:\/\//, '').replace(/\/$/, '') };
      CH.forEach(function(c, k){ if (liveOn(c)){ var t = chBtns[k].querySelector('.t'); if (t) t.textContent = 'Live'; } });
      setCh(curCh, true);
    });
    setCh(0, true);
  })();
