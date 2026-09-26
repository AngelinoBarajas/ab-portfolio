/*! AB Portfolio · ab-404 v0.9.2 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__ab404Init) return;
  window.__ab404Init = true;
  /* ===== 404/00-lost.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-404] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, pad2 = AB.pad2;

  /* =========================================================
     404 · signal lost (Webflow's 404 utility page). Copy lives in the Designer.
     This fills the requested path, draws the astronaut, and runs the toys: planet 0 (throw it, it springs back),
     the astronaut (floats, talks, can be thrown, drifts home), the telemetry clock, the radar pings
     (the third one "finds" the page in the footer black hole) and the 1–4 route hotkeys.
     ========================================================= */
  var hero = $('.section_lost');
  if (!hero) return;
  document.title = '404 · Signal lost · Angelino Barajas';

  // the path that wasn't found (Webflow serves the 404 at the requested URL)
  var REQ = (location.pathname || '/').replace(/\/+$/, '') || '/';
  if (REQ === '/404') REQ = '/mission-to-nowhere';
  $$('[data-lost-path]', hero).forEach(function(el){ el.textContent = el.getAttribute('data-lost-path') === 'bare' ? REQ.replace(/^\//, '') : REQ; });

  var astroSVG = '<svg viewBox="0 0 120 150" aria-hidden="true">' +
    '<defs><linearGradient id="lvis" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4c8dff"/><stop offset=".55" stop-color="#1d2350"/><stop offset="1" stop-color="#ff6a3d"/></linearGradient></defs>' +
    '<path d="M86 96 C 112 104, 118 128, 100 138 S 70 146, 78 128" fill="none" stroke="#8A8FA3" stroke-width="3" stroke-dasharray="1 5" stroke-linecap="round"/>' +
    '<rect x="30" y="52" width="60" height="50" rx="10" fill="#C9C7C0"/>' +
    '<rect x="38" y="58" width="48" height="52" rx="14" fill="#F2F0EA"/>' +
    '<rect x="16" y="62" width="26" height="14" rx="7" fill="#F2F0EA" transform="rotate(-28 29 69)"/>' +
    '<rect x="80" y="64" width="26" height="14" rx="7" fill="#F2F0EA" transform="rotate(22 93 71)"/>' +
    '<circle cx="14" cy="56" r="7" fill="#C9C7C0"/><circle cx="106" cy="80" r="7" fill="#C9C7C0"/>' +
    '<rect x="44" y="102" width="15" height="30" rx="7" fill="#F2F0EA" transform="rotate(8 51 117)"/>' +
    '<rect x="64" y="102" width="15" height="30" rx="7" fill="#F2F0EA" transform="rotate(-12 71 117)"/>' +
    '<rect x="44" y="126" width="18" height="10" rx="4" fill="#8A8FA3" transform="rotate(8 51 131)"/><rect x="64" y="126" width="18" height="10" rx="4" fill="#8A8FA3" transform="rotate(-12 71 131)"/>' +
    '<rect x="48" y="74" width="26" height="16" rx="3" fill="#0E1020"/><circle cx="54" cy="82" r="2.4" fill="#3BE38A"/><circle cx="61" cy="82" r="2.4" fill="#FF6A3D"/><rect x="66" y="80" width="5" height="4" fill="#4C8DFF"/>' +
    '<rect x="78" y="60" width="8" height="8" fill="#FF6A3D"/>' +
    '<circle cx="62" cy="36" r="30" fill="#F2F0EA"/><circle cx="62" cy="36" r="30" fill="none" stroke="#C9C7C0" stroke-width="3"/>' +
    '<ellipse cx="64" cy="38" rx="21" ry="17" fill="url(#lvis)"/>' +
    '<path d="M50 30 Q 56 24 66 25" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".75"/><circle cx="74" cy="44" r="2" fill="#fff" opacity=".6"/>' +
    '<rect x="58" y="3" width="3" height="8" fill="#C9C7C0"/><circle cx="59.5" cy="3" r="3" fill="#FF6A3D"/>' +
  '</svg>';
  var fig = $('[data-astro-art]', hero);
  if (fig) fig.innerHTML = astroSVG;

  // planet zero: built now (not lazily) since it's the page's hero
  var pz = $('[data-lost-planet]', hero);
  if (pz && AB.buildPlanet) AB.buildPlanet(pz);

  // entrance
  if (hasGsap && !reduce){
    gsap.from('.ab_lost_digit', { yPercent: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .12, delay: .15, clearProps: 'transform,opacity' });
    gsap.from('.ab_lost_zero', { scale: .2, opacity: 0, rotation: -90, duration: 1.4, ease: 'elastic.out(1,.6)', delay: .35, clearProps: 'transform,opacity' });
    gsap.from('.ab_route', { x: -24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .07, delay: .6, clearProps: 'transform,opacity' });
    gsap.from('.ab_lsig', { y: 30, opacity: 0, duration: .9, ease: 'power3.out', delay: .5, clearProps: 'transform,opacity' });
  }

  var canDrag = hasGsap && !!window.Draggable;
  // planet zero: throw it, it springs back into the 404
  if (pz && canDrag){
    var pzBack = function(){ gsap.to(pz, { x: 0, y: 0, rotation: 0, duration: 1.6, ease: 'elastic.out(1,.45)', delay: .5 }); };
    Draggable.create(pz, { type: 'x,y', inertia: !!window.InertiaPlugin, bounds: hero, zIndexBoost: true,
      onPress: function(){ gsap.killTweensOf(pz); }, onDragEnd: pzBack, onThrowComplete: pzBack });
    // a resize (phone rotation) can leave it clamped off the ring by the old bounds: send it home
    var rsT;
    addEventListener('resize', function(){ clearTimeout(rsT); rsT = setTimeout(function(){ var d = Draggable.get(pz); if (!d || !d.isDragging) gsap.to(pz, { x: 0, y: 0, duration: .6, ease: 'power3.out' }); }, 200); });
  }

  // astronaut: floats, can be grabbed and thrown, drifts home again, talks
  var astro = $('[data-astro]', hero), say = $('[data-astro-say]', hero);
  var LINES = ['Houston, I think<br>we took a wrong turn.', 'Is this the way<br>to the homepage?', 'Pretty sure this was<br>a page yesterday.', 'Wheeee!', 'Okay, okay,<br>I’m going.', 'Tell mission control<br>I said hi.', 'Have you tried<br>route 1?'];
  var li = 0, sayT;
  function speak(txt){ if (!say) return; say.innerHTML = txt || LINES[li++ % LINES.length]; say.classList.add('is-show'); clearTimeout(sayT); sayT = setTimeout(function(){ say.classList.remove('is-show'); }, 2600); }
  if (astro && fig){
    if (hasGsap && !reduce){
      gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
        .to(fig, { y: -16, rotation: 8, duration: 3.2 })
        .to(fig, { y: 10, rotation: -6, duration: 3.6 });
      gsap.to(astro, { x: '+=40', duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    setTimeout(function(){ speak(LINES[0]); li = 1; }, reduce ? 300 : 1600);
    if (canDrag){
      var home;
      var drift = function(){ home = gsap.delayedCall(4, function(){ gsap.to(astro, { x: 0, y: 0, duration: 5, ease: 'sine.inOut' }); gsap.to(fig, { rotation: 0, duration: 5, ease: 'sine.inOut' }); }); };
      Draggable.create(astro, { type: 'x,y', inertia: !!window.InertiaPlugin, bounds: hero, edgeResistance: .6,
        onPress: function(){ gsap.killTweensOf(astro); if (home) home.kill(); speak(); },
        onDrag: function(){ gsap.set(fig, { rotation: Math.max(-40, Math.min(40, this.deltaX * 2)) }); },
        onRelease: function(){ if (!reduce) gsap.to(fig, { rotation: gsap.utils.random(-180, 180), duration: 2.4, ease: 'power2.out' }); },
        onThrowComplete: drift, onDragEnd: function(){ if (!this.tween) drift(); } });
    }
    astro.addEventListener('click', function(){ if (coarse || !canDrag) speak(); });
  }

  // "Drag me" cue on planet zero (the same cue every hero with draggables gets: AB.dragCue in core)
  var zero = $('.ab_lost_zero', hero);
  if (canDrag && pz && zero && AB.dragCue) AB.dragCue({ host: zero, first: pz, items: [pz, astro].filter(Boolean), at: 'end', tug: -12 });

  // telemetry: time since last contact
  var t0 = Date.now(), lastEl = $('[data-tele-last]', hero);
  if (lastEl) setInterval(function(){ var s = Math.floor((Date.now() - t0) / 1000); lastEl.textContent = pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(s % 60); }, 1000);

  // radar: ping for the missing page (the third ping finds it)
  var radar = $('[data-radar]', hero), pings = 0, found = false;
  var KNOWN = ['/work', '/about', '/services/webflow-development', '/work/510-visuals', '/services/motion', '/work/daniel-aguirre-law', '/services/branding', '/work/ab-identity', '/services/webgl-data'];
  function rm(el){ if (el.parentNode) el.parentNode.removeChild(el); }
  function blip(x, y, cls, label){
    var b = document.createElement('span'); b.className = 'lblip' + (cls ? ' ' + cls : ''); b.style.left = x + '%'; b.style.top = y + '%'; if (label) b.title = label;
    radar.appendChild(b); void b.offsetWidth; b.classList.add('show'); setTimeout(function(){ rm(b); }, 3300);
  }
  function ping(e){
    var r = radar.getBoundingClientRect(), x = e && e.clientX ? (e.clientX - r.left) / r.width * 100 : 50, y = e && e.clientY ? (e.clientY - r.top) / r.height * 100 : 50;
    var p = document.createElement('span'); p.className = 'ping'; p.style.left = x + '%'; p.style.top = y + '%'; radar.appendChild(p);
    if (reduce || !hasGsap) setTimeout(function(){ rm(p); }, 400);
    else gsap.fromTo(p, { scale: 1, opacity: 1 }, { scale: 14, opacity: 0, duration: 1.4, ease: 'power2.out', onComplete: function(){ rm(p); } });
    pings++;
    var pe = $('[data-tele-pings]', hero); if (pe) pe.textContent = pings;
    for (var i = 0; i < 3; i++){ var a = Math.random() * Math.PI * 2, d = 12 + Math.random() * 32; blip(50 + Math.cos(a) * d, 50 + Math.sin(a) * d, '', KNOWN[(pings * 3 + i) % KNOWN.length]); }
    if (!found && pings >= 3){
      found = true; blip(50, 92, 'is-lost');
      var st = $('[data-tele-st]', hero); if (st){ st.textContent = 'Signal found'; st.classList.add('is-ok'); }
      var xy = $('[data-tele-xy]', hero); if (xy) xy.textContent = 'Event horizon';
      toast('Found it. The page fell into the black hole at the bottom of this page.');
      speak('Told you it was<br>the black hole.');
    } else if (!found) toast('Ping ' + pings + ' · only known pages answering · keep scanning');
  }
  if (radar){
    radar.addEventListener('click', ping);
    radar.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ping(); } });
  }

  // hotkeys 1–4 take a route (the click goes through the site-wide warp)
  document.addEventListener('keydown', function(e){
    var ae = document.activeElement;
    if (e.metaKey || e.ctrlKey || e.altKey || (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName))) return;
    var a = $('.ab_route[data-key="' + e.key + '"]', hero); if (!a) return;
    a.focus(); a.classList.add('is-go'); setTimeout(function(){ a.click(); }, 220);
  });

});
