/* AB Portfolio vendor copy of the 510 Visuals production globe (code backup/globe.js, 2026-09-25).
   Loaded lazily by ab-mission.js for the "Live globe" monitor channel. Two portfolio patches, marked [AB]:
   - a pin's link comes from data-globe-link when present (else the original /projects/<slug>)
   - the fallback CTA href is window.__globeCtaHref (the mission's live URL) instead of /projects */
/* ============================================
   510 VISUALS — Globe Three.js Component
   Target: .globe_canvas-wrapper, .globe-hero_canvas-wrapper
   Dependencies: Three.js r128 (loaded below)
   Safe to remove: Yes — delete this + preview HTML
   Changed: 2026-04-06 — Refactored to factory pattern;
            supports multiple instances (.globe_canvas-wrapper
            for compact teaser, .globe-hero_canvas-wrapper for
            full-width hero section). Each wrapper gets its own
            independent globe instance. Guard moved from global
            window flag to per-element flag.
   ============================================ */

(function () {
  if (window.THREE) return initGlobes();
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  s.onload = initGlobes;
  document.head.appendChild(s);
})();

function initGlobes() {
  window.Webflow ||= [];
  window.Webflow.push(function () {

    // Inject shared preview card once
    if (!document.getElementById('globe-preview')) {
      var pvHTML = '<div id="globe-preview"><button type="button" class="gp-close" aria-label="Close">×</button><img class="gp-img" src="" alt=""><div class="gp-body"><div class="gp-loc"></div><div class="gp-title"></div><a class="gp-cta" href="#"><span class="gp-cta-label">View Project</span><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h8M6 2l3 3-3 3"/></svg></a></div></div>';
      var d = document.createElement('div');
      d.innerHTML = pvHTML;
      document.body.appendChild(d.firstChild);
    }

    // Inject shared 5TEN popup card once
    if (!document.getElementById('globe-510-preview')) {
      var arrowSvg = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h8M6 2l3 3-3 3"/></svg>';
      var pv510HTML = '<div id="globe-510-preview"><button type="button" class="gp510-close" aria-label="Close">×</button><div class="gp510-body"><div class="gp510-loc"></div><div class="gp510-title">5TEN VISUALS</div><div class="gp510-actions"><a class="gp510-cta" href="/contact">Contact' + arrowSvg + '</a><a class="gp510-cta" href="/about">About' + arrowSvg + '</a></div></div></div>';
      var d2 = document.createElement('div');
      d2.innerHTML = pv510HTML;
      document.body.appendChild(d2.firstChild);
    }

    // Inject shared 5TEN badge styles once
    if (!document.getElementById('globe-badge-styles')) {
      var bs = document.createElement('style');
      bs.id = 'globe-badge-styles';
      bs.textContent = [
        '.globe_510-leaders{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;overflow:visible}',
        '.globe_510-leader-line{stroke:#5eead4;stroke-width:1.5;fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:4 4;filter:drop-shadow(0 0 4px rgba(94,234,212,0.55));transition:opacity 180ms ease-out}',
        '.globe_510-leader-dot{fill:#5eead4;filter:drop-shadow(0 0 4px rgba(94,234,212,0.7));transition:opacity 180ms ease-out}',
        '.globe_510-badge{display:inline-flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;pointer-events:none;cursor:pointer;height:62px;padding:10px 20px;box-sizing:border-box;background:rgba(28,34,39,0.82);border:1px solid rgba(55,83,90,0.55);border-radius:6px;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);z-index:5;opacity:0;transform:translate(-50%,-50%) scale(var(--gb-s,1));transition:opacity 180ms ease-out,background 200ms ease,border-color 200ms ease;will-change:transform,left,top,opacity}',
        '.globe_510-badge.is-hero{height:76px;padding:10px 20px}',
        '.globe_510-badge:hover{background:rgba(90,138,148,0.4);border-color:rgba(184,201,204,0.35)}',
        '.globe_510-badge img{flex-shrink:0;height:100%;width:auto;max-width:none !important;display:block}',
        '.globe_510-badge span{display:flex;align-items:center;justify-content:center;color:#eaff00;font-weight:700;font-size:12px;letter-spacing:0.08em;text-shadow:0 0 8px rgba(234,255,0,0.75)}',
        '#globe-510-preview{position:fixed;z-index:2147483647;pointer-events:none;opacity:0;transform:translate(-50%,-100%) translateY(-8px);transition:opacity 180ms ease,transform 180ms ease;min-width:220px;padding:14px 16px;background:rgba(28,34,39,0.96);border:1px solid rgba(55,83,90,0.55);border-radius:8px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 12px 40px rgba(0,0,0,0.55),0 0 0 1px rgba(234,255,0,0.08)}',
        '#globe-510-preview.is-visible{opacity:1;pointer-events:auto;transform:translate(-50%,-100%) translateY(-14px)}',
        '#globe-510-preview .gp510-loc{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(184,201,204,0.4);margin-bottom:5px;font-weight:500}',
        '#globe-510-preview .gp510-title{font-size:14px;color:#d0e0e3;font-weight:600;margin-bottom:12px;letter-spacing:0.02em}',
        '#globe-510-preview .gp510-actions{display:flex;gap:8px}',
        '#globe-510-preview .gp510-cta{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#d0e0e3;background:rgba(55,83,90,0.35);border:1px solid rgba(55,83,90,0.5);border-radius:6px;text-decoration:none;transition:all 0.2s ease}',
        '#globe-510-preview .gp510-cta:hover{background:rgba(90,138,148,0.4);border-color:rgba(184,201,204,0.35);color:#fff}',
        '#globe-510-preview .gp510-cta svg{width:10px;height:10px;flex-shrink:0}',
        '#globe-preview .gp-cluster-list{display:none;flex-direction:column;gap:4px;max-height:260px;overflow-y:auto;margin-top:6px}',
        '#globe-preview.is-cluster .gp-cluster-list{display:flex}',
        '#globe-preview .gp-cluster-heading{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:rgba(184,201,204,0.5);font-weight:500;margin-top:10px;padding-top:10px;border-top:1px solid rgba(55,83,90,0.25)}',
        '#globe-preview .gp-cluster-item{display:flex;align-items:center;gap:10px;padding:7px 8px;background:rgba(55,83,90,0.12);border:1px solid rgba(55,83,90,0.22);border-radius:6px;text-decoration:none;color:#d0e0e3;transition:background .2s ease,border-color .2s ease}',
        '#globe-preview .gp-cluster-item:hover{background:rgba(90,138,148,0.3);border-color:rgba(184,201,204,0.3)}',
        '#globe-preview .gp-cluster-item img{width:36px;height:36px;object-fit:cover;border-radius:4px;flex-shrink:0}',
        '#globe-preview .gp-cluster-thumb{width:36px;height:36px;border-radius:4px;background:rgba(55,83,90,0.3);flex-shrink:0}',
        '#globe-preview .gp-cluster-item .gp-cluster-title{flex:1;font-size:12px;font-weight:500;line-height:1.3;color:#d0e0e3;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '#globe-preview .gp-cluster-item svg{width:10px;height:10px;color:#5a8a94;flex-shrink:0;transition:transform .2s,color .2s}',
        '#globe-preview .gp-cluster-item:hover svg{color:#b8c9cc;transform:translateX(3px)}',
        '#globe-preview .gp-close{position:absolute;top:8px;right:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;color:#d0e0e3;background:rgba(20,26,30,0.7);border:1px solid rgba(55,83,90,0.5);border-radius:50%;cursor:pointer;padding:0;z-index:3;transition:background .2s ease,border-color .2s ease,color .2s ease;-webkit-appearance:none;appearance:none;font-family:inherit}',
        '#globe-preview .gp-close:hover{background:rgba(90,138,148,0.4);border-color:rgba(184,201,204,0.35);color:#fff}',
        '#globe-510-preview .gp510-close{position:absolute;top:6px;right:6px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:16px;line-height:1;color:#d0e0e3;background:rgba(20,26,30,0.7);border:1px solid rgba(55,83,90,0.5);border-radius:50%;cursor:pointer;padding:0;transition:background .2s ease,border-color .2s ease,color .2s ease;-webkit-appearance:none;appearance:none;font-family:inherit}',
        '#globe-510-preview .gp510-close:hover{background:rgba(90,138,148,0.4);border-color:rgba(184,201,204,0.35);color:#fff}',
        '@media (max-width:600px){',
        '#globe-preview{width:auto !important;max-width:calc(100vw - 24px) !important;min-width:260px}',
        '#globe-510-preview{min-width:0;width:auto;max-width:calc(100vw - 24px)}',
        '.globe_510-badge{height:52px;padding:8px 14px}',
        '.globe_510-badge.is-hero{height:62px;padding:8px 16px}',
        '#globe-preview .gp-close{width:32px;height:32px;font-size:20px;top:10px;right:10px}',
        '#globe-510-preview .gp510-close{width:30px;height:30px;font-size:18px;top:8px;right:8px}',
        '}'
      ].join('');
      document.head.appendChild(bs);
    }

    // Wire shared popup behavior (close X + scroll-to-dismiss + auto-timeout) — once per page
    if (!window.__tenGlobePopupBehaviorBound) {
      window.__tenGlobePopupBehaviorBound = true;
      var pv = document.getElementById('globe-preview');
      var pv510 = document.getElementById('globe-510-preview');
      var AUTO_DISMISS_MS = 6000;
      var SCROLL_DISMISS_PX = 30;
      var SETTLE_MS = 250;

      function dismissPv() { if (pv) pv.classList.remove('is-visible', 'is-cluster'); }
      function dismiss510() { if (pv510) pv510.classList.remove('is-visible'); }

      // X close buttons
      var pvClose = pv && pv.querySelector('.gp-close');
      if (pvClose) {
        pvClose.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); dismissPv(); });
      }
      var pv510Close = pv510 && pv510.querySelector('.gp510-close');
      if (pv510Close) {
        pv510Close.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); dismiss510(); });
      }

      // Track open-state per popup; observe class mutations so we don't have to touch existing show/hide paths
      var pvOpenedAt = 0, pvScrollY = 0, pvAutoTimer = null;
      var p5OpenedAt = 0, p5ScrollY = 0, p5AutoTimer = null;
      function getScrollY() { return window.scrollY || window.pageYOffset || 0; }

      if (pv && window.MutationObserver) {
        new MutationObserver(function () {
          if (pv.classList.contains('is-visible')) {
            pvOpenedAt = Date.now();
            pvScrollY = getScrollY();
            if (pvAutoTimer) clearTimeout(pvAutoTimer);
            pvAutoTimer = setTimeout(function () {
              if (pv.classList.contains('is-visible')) dismissPv();
            }, AUTO_DISMISS_MS);
          } else if (pvAutoTimer) {
            clearTimeout(pvAutoTimer); pvAutoTimer = null;
          }
        }).observe(pv, { attributes: true, attributeFilter: ['class'] });
      }
      if (pv510 && window.MutationObserver) {
        new MutationObserver(function () {
          if (pv510.classList.contains('is-visible')) {
            p5OpenedAt = Date.now();
            p5ScrollY = getScrollY();
            if (p5AutoTimer) clearTimeout(p5AutoTimer);
            p5AutoTimer = setTimeout(function () {
              if (pv510.classList.contains('is-visible')) dismiss510();
            }, AUTO_DISMISS_MS);
          } else if (p5AutoTimer) {
            clearTimeout(p5AutoTimer); p5AutoTimer = null;
          }
        }).observe(pv510, { attributes: true, attributeFilter: ['class'] });
      }

      // Scroll-to-dismiss — works on mouse wheel + touch + Lenis (all trigger window scroll)
      window.addEventListener('scroll', function () {
        var now = Date.now(), y = getScrollY();
        if (pv && pv.classList.contains('is-visible') && (now - pvOpenedAt) > SETTLE_MS && Math.abs(y - pvScrollY) > SCROLL_DISMISS_PX) dismissPv();
        if (pv510 && pv510.classList.contains('is-visible') && (now - p5OpenedAt) > SETTLE_MS && Math.abs(y - p5ScrollY) > SCROLL_DISMISS_PX) dismiss510();
      }, { passive: true });
    }

    // Read CMS data once — shared across all instances
    function readCMS() {
      var items = document.querySelectorAll('.globe_cms-item');
      var projects = [];
      items.forEach(function (el) {
        var lat = parseFloat(el.getAttribute('data-globe-lat'));
        var lng = parseFloat(el.getAttribute('data-globe-lng'));
        if (isNaN(lat) || isNaN(lng)) return;
        var imgEl = el.querySelector('.globe_cms-img');
        projects.push({
          city: el.getAttribute('data-globe-city') || '',
          region: '',
          lat: lat, lng: lng,
          title: el.getAttribute('data-globe-title') || '',
          img: imgEl ? imgEl.getAttribute('src') : '',
          slug: el.getAttribute('data-globe-link') || ('/projects/' + (el.getAttribute('data-globe-slug') || '')), // [AB]
          hasCaseStudy: el.getAttribute('data-globe-has-case-study') !== 'false'
        });
      });
      return projects;
    }

    var CMS_PROJECTS = readCMS();

    // Find all globe wrappers and init one instance each
    var wrappers = document.querySelectorAll('.globe_canvas-wrapper, .globe-hero_canvas-wrapper');
    wrappers.forEach(function (wrapper) {
      if (wrapper.__tenGlobeInit) return;
      wrapper.__tenGlobeInit = true;

      // Determine if this is the hero variant
      var isHero = wrapper.classList.contains('globe-hero_canvas-wrapper');

      createGlobeInstance(wrapper, isHero, CMS_PROJECTS);
    });

  });
}

// ─────────────────────────────────────────────
// Factory — one call per wrapper element
// ─────────────────────────────────────────────
function createGlobeInstance(wrapper, isHero, CMS_PROJECTS) {

  // Decode base64 continent dots (binary int16 pairs)
  function decodeDots(b64) {
    var bin = atob(b64);
    var buf = new ArrayBuffer(bin.length);
    var raw = new Uint8Array(buf);
    for (var i = 0; i < bin.length; i++) raw[i] = bin.charCodeAt(i);
    var view = new DataView(buf);
    var dots = [];
    for (var i = 0; i < buf.byteLength; i += 4)
      dots.push([view.getInt16(i, true) / 100, view.getInt16(i + 2, true) / 100]);
    return Promise.resolve(dots);
  }

  var DOTS_B64 = "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";

  var PAL = {
    light: 0xb8c9cc, mid: 0x37535a, dark: 0x1c2227,
    accent: 0x5a8a94, glow: 0x4a7580, bright: 0xd0e0e3,
    amber: 0xeaff00, amberMid: 0xd4e600,
    teal: 0x2dd4bf, tealGlow: 0x5eead4
  };
  var BROOKLYN = { city: "Brooklyn", region: "NY", lat: 40.6782, lng: -73.9442, type: "HQ", offset: { x: 110, y: -90 } };
  var SHENZHEN = { city: "Shenzhen", region: "China", lat: 22.5431, lng: 114.0579, type: "hero", offset: { x: 110, y: -90 } };
  var BELGIUM  = { city: "Brussels", region: "Belgium", lat: 50.8503, lng: 4.3517, type: "HQ", offset: { x: 110, y: -90 } };

  decodeDots(DOTS_B64).then(function (LAND_DOTS) {

    // Append Antarctica — base dataset stops around -60° lat, so polar cap is missing.
    // Generate a uniform-density dot grid from -62° down to -85° lat. Longitude step
    // scales with 1/cos(lat) so density stays roughly even on the sphere surface.
    (function () {
      var step = 2.4; // ° lat between rings — tuned to match neighbouring continent density
      for (var lat = -62; lat >= -85; lat -= step) {
        var c = Math.cos(lat * Math.PI / 180);
        var lngStep = step / Math.max(0.18, c);
        for (var lng = -180; lng < 180; lng += lngStep) LAND_DOTS.push([lat, lng]);
      }
      // Single anchor dot near pole so the cap closes visually
      LAND_DOTS.push([-89, 0]);
    })();

    var W = wrapper.clientWidth, H = wrapper.clientHeight;
    var canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);

    // ── Interaction hint ──────────────────────────
    // Hero variant: hint is injected by the section HTML (styled separately)
    // Compact variant: inject inline as before
    var hint = null, hintDismissed = false;
    if (!isHero) {
      hint = document.createElement('div');
      hint.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.5;margin-right:6px;vertical-align:middle"><path d="M12 2v8M8 6l4-4 4 4"/><circle cx="12" cy="18" r="4"/><path d="M12 14v-1"/></svg>Drag to rotate &middot; Scroll to zoom';
      hint.style.cssText = 'position:absolute;bottom:16px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:1px;color:rgba(184,201,204,0.35);z-index:3;pointer-events:none;transition:opacity 0.6s ease;white-space:nowrap';
      wrapper.appendChild(hint);
    }

    function dismissHint() {
      if (hintDismissed) return;
      hintDismissed = true;
      // Hero hint is the external .globe-hero_cue element
      if (isHero) {
        var cue = wrapper.closest('.section_globe-hero')
          ? wrapper.closest('.section_globe-hero').querySelector('.globe-hero_cue')
          : null;
        if (cue) { cue.style.opacity = '0'; setTimeout(function () { cue.style.display = 'none'; }, 800); }
      } else {
        if (hint) { hint.style.opacity = '0'; setTimeout(function () { hint.remove(); }, 800); }
      }
    }

    // ── Renderer ──────────────────────────────────
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();

    // Hero camera sits further back so the hemisphere fills the canvas
    var startZ = isHero ? 2.6 : 2.2;
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, isHero ? 0.2 : 0.4, startZ);

    scene.add(new THREE.AmbientLight(PAL.mid, 0.4));
    var fl = new THREE.DirectionalLight(PAL.light, 0.5); fl.position.set(2, 2, 3); scene.add(fl);
    var bl = new THREE.DirectionalLight(PAL.mid, 0.3); bl.position.set(-3, -1, -2); scene.add(bl);
    var rl = new THREE.PointLight(PAL.accent, 0.6, 10); rl.position.set(-3, 1, 1); scene.add(rl);

    var globeGroup = new THREE.Group();
    scene.add(globeGroup);
    var R = 1;

    // Atmosphere
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.12, 64, 64), new THREE.ShaderMaterial({
      vertexShader: 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 vN;void main(){float d=dot(vN,vec3(0,0,1));float i=pow(0.5-d,4.0)*0.3;if(i<0.01)discard;gl_FragColor=vec4(0.345,0.525,0.58,i);}',
      blending: THREE.AdditiveBlending, side: THREE.BackSide, transparent: true, depthWrite: false
    })));

    // Dark core
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.994, 64, 64), new THREE.MeshBasicMaterial({ color: 0x1c2227 })));

    function ll2v(lat, lng, r) {
      var phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    }

    // Continent dots
    var dP = new Float32Array(LAND_DOTS.length * 3), dC = new Float32Array(LAND_DOTS.length * 3);
    var cA = new THREE.Color(PAL.mid), cB = new THREE.Color(PAL.light), cX = new THREE.Color(PAL.accent);
    LAND_DOTS.forEach(function (d, i) {
      var v = ll2v(d[0], d[1], R);
      dP[i * 3] = v.x; dP[i * 3 + 1] = v.y; dP[i * 3 + 2] = v.z;
      var rn = Math.random(), c = rn > 0.85 ? cB : rn > 0.6 ? cX : cA;
      dC[i * 3] = c.r; dC[i * 3 + 1] = c.g; dC[i * 3 + 2] = c.b;
    });
    var dG = new THREE.BufferGeometry();
    dG.setAttribute('position', new THREE.BufferAttribute(dP, 3));
    dG.setAttribute('color', new THREE.BufferAttribute(dC, 3));
    globeGroup.add(new THREE.Points(dG, new THREE.PointsMaterial({ size: 0.011, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true })));

    // Graticule
    var gMat = new THREE.LineBasicMaterial({ color: PAL.mid, transparent: true, opacity: 0.18 });
    for (var lat = -60; lat <= 60; lat += 30) {
      var p = []; for (var lng = -180; lng <= 180; lng += 4) p.push(ll2v(lat, lng, R * 1.001));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), gMat));
    }
    for (var lng2 = -180; lng2 < 180; lng2 += 30) {
      var p2 = []; for (var lat2 = -90; lat2 <= 90; lat2 += 4) p2.push(ll2v(lat2, lng2, R * 1.001));
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p2), gMat));
    }

    // Pins
    var pinGroup = new THREE.Group(), pinMeshes = [], pulseRings = [];
    function createPin(loc, idx) {
      var pos = ll2v(loc.lat, loc.lng, R * 1.004);
      var isHQ = loc.type === 'HQ', isHeroPin = loc.type === 'hero';
      var coreR = isHQ ? 0.014 : isHeroPin ? 0.012 : 0.009;
      var pinColor = isHQ ? PAL.tealGlow : PAL.teal;
      var core = new THREE.Mesh(new THREE.CircleGeometry(coreR, 24), new THREE.MeshBasicMaterial({ color: pinColor, side: THREE.DoubleSide }));
      core.position.copy(pos); core.lookAt(pos.clone().multiplyScalar(2)); pinGroup.add(core);
      var hitbox = new THREE.Mesh(new THREE.SphereGeometry(isHQ ? 0.05 : isHeroPin ? 0.045 : 0.04, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.position.copy(pos); hitbox.userData = Object.assign({}, loc, { _idx: idx }); pinGroup.add(hitbox);
      if (!isHQ && !isHeroPin) pinMeshes.push(hitbox); // HQ/hero use the 5TEN badge for interaction
      var ri = coreR + 0.004, ro = ri + (isHQ ? 0.003 : 0.002);
      var ring = new THREE.Mesh(new THREE.RingGeometry(ri, ro, 32), new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: isHQ ? 0.5 : 0.35, side: THREE.DoubleSide }));
      ring.position.copy(pos); ring.lookAt(pos.clone().multiplyScalar(2)); pinGroup.add(ring);
      var glowR = isHQ ? 0.04 : isHeroPin ? 0.035 : 0.025;
      var glow = new THREE.Mesh(new THREE.SphereGeometry(glowR, 16, 16), new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: 0.15 }));
      glow.position.copy(pos); glow.userData = { isGlow: true, baseR: glowR }; pinGroup.add(glow);
      var beamDir = pos.clone().normalize(), beamLen = isHQ ? 0.12 : isHeroPin ? 0.1 : 0.07;
      var beamEnd = pos.clone().add(beamDir.clone().multiplyScalar(beamLen));
      var beam = new THREE.Line(new THREE.BufferGeometry().setFromPoints([pos.clone(), beamEnd]), new THREE.LineBasicMaterial({ color: pinColor, transparent: true, opacity: isHQ ? 0.5 : 0.3 }));
      pinGroup.add(beam);
      var tipDot = new THREE.Mesh(new THREE.SphereGeometry(isHQ ? 0.008 : 0.005, 8, 8), new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: 0.6 }));
      tipDot.position.copy(beamEnd); pinGroup.add(tipDot);
      var po = ro + 0.005, pi2 = po + (isHQ ? 0.004 : 0.003);
      var pulse = new THREE.Mesh(new THREE.RingGeometry(po, pi2, 32), new THREE.MeshBasicMaterial({ color: pinColor, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
      pulse.position.copy(pos); pulse.lookAt(pos.clone().multiplyScalar(2)); pulse.userData = { isPulse: true }; pinGroup.add(pulse); pulseRings.push(pulse);
    }
    // Deduplicate CMS projects by proximity — one pin per location cluster
    var CLUSTER_DEG = 0.6; // ~65km at NYC latitude
    var CMS_CLUSTERS = [];
    CMS_PROJECTS.forEach(function (p) {
      var existing = null;
      for (var ci = 0; ci < CMS_CLUSTERS.length; ci++) {
        var c = CMS_CLUSTERS[ci];
        if (Math.abs(c.lat - p.lat) < CLUSTER_DEG && Math.abs(c.lng - p.lng) < CLUSTER_DEG) { existing = c; break; }
      }
      if (existing) { existing.projects.push(p); }
      else { CMS_CLUSTERS.push({ lat: p.lat, lng: p.lng, city: p.city, region: p.region, projects: [p] }); }
    });

    // If HQ coincides with a CMS cluster, skip rendering a separate HQ pin and anchor
    // the 5TEN badge/leader to the cluster centroid. Keeps "one pin per location."
    function mergeHubWithCluster(hub) {
      for (var ci = 0; ci < CMS_CLUSTERS.length; ci++) {
        var c = CMS_CLUSTERS[ci];
        if (Math.abs(c.lat - hub.lat) < CLUSTER_DEG && Math.abs(c.lng - hub.lng) < CLUSTER_DEG) {
          hub.lat = c.lat; hub.lng = c.lng; hub._mergedCluster = c;
          return true;
        }
      }
      return false;
    }
    var bklnMerged = mergeHubWithCluster(BROOKLYN);
    var shzMerged = mergeHubWithCluster(SHENZHEN);
    var belMerged = mergeHubWithCluster(BELGIUM);
    if (!bklnMerged) createPin(BROOKLYN, -1);
    if (!shzMerged) createPin(SHENZHEN, -2);
    if (!belMerged) createPin(BELGIUM, -3);
    CMS_CLUSTERS.forEach(function (c, i) {
      var first = c.projects[0];
      var clusterLoc = {
        lat: c.lat, lng: c.lng, city: first.city, region: first.region,
        _cluster: c.projects,
        title: c.projects.length === 1 ? first.title : (c.projects.length + ' PROJECTS'),
        img: c.projects.length === 1 ? first.img : '',
        slug: c.projects.length === 1 ? first.slug : ''
      };
      createPin(clusterLoc, i);
    });
    globeGroup.add(pinGroup);

    // Always-visible 5TEN badges over HQ + Shenzhen (HTML overlay, projected each frame)
    if (getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';
    // Dedicated 5TEN stacked logo for globe HQ badges (uploaded to Webflow Assets).
    // Hardcoded so the badge doesn't accidentally pick up the navbar logo if that's swapped later.
    var logoSrc = 'https://cdn.prod.website-files.com/69cdf5b5f534b6b5bb6e6851/69e9a1ee4289a9a8fb6d086d_5_TEN_stacked-svg.svg';
    var badges = [];
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var leadersSvg = document.createElementNS(SVG_NS, 'svg');
    leadersSvg.setAttribute('class', 'globe_510-leaders');
    wrapper.appendChild(leadersSvg);
    var preview510 = document.getElementById('globe-510-preview');
    var pv510Timer = null;
    function show510(loc, rect) {
      if (!preview510) return;
      clearTimeout(pv510Timer);
      var locEl = preview510.querySelector('.gp510-loc');
      if (locEl) locEl.textContent = (loc.city + (loc.region ? ', ' + loc.region : '')).toUpperCase();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top;
      preview510.style.left = cx + 'px';
      preview510.style.top = cy + 'px';
      preview510.classList.add('is-visible');
      // Measure resolved bounds (popup uses translate(-50%,-100%) translateY(-14px)) and nudge into viewport
      requestAnimationFrame(function () {
        var pad = 12;
        var pvW = preview510.offsetWidth, pvH = preview510.offsetHeight;
        var renderL = cx - pvW / 2, renderR = cx + pvW / 2, renderT = cy - pvH - 14;
        var adjX = 0, adjY = 0;
        if (renderL < pad) adjX = pad - renderL;
        else if (renderR > innerWidth - pad) adjX = (innerWidth - pad) - renderR;
        if (renderT < pad) adjY = pad - renderT;
        if (adjX || adjY) {
          preview510.style.left = (cx + adjX) + 'px';
          preview510.style.top = (cy + adjY) + 'px';
        }
      });
    }
    function hide510() {
      clearTimeout(pv510Timer);
      pv510Timer = setTimeout(function () {
        preview510 && preview510.classList.remove('is-visible');
      }, 200);
    }
    if (preview510 && !preview510.__ten510Bound) {
      preview510.__ten510Bound = true;
      preview510.addEventListener('mouseenter', function () { clearTimeout(pv510Timer); preview510.classList.add('is-visible'); });
      preview510.addEventListener('mouseleave', hide510);
      // Tap/click outside dismisses (mobile + desktop)
      document.addEventListener('click', function (e) {
        if (preview510.classList.contains('is-visible') &&
            !e.target.closest('.globe_510-badge') &&
            !e.target.closest('#globe-510-preview')) {
          hide510();
        }
      });
    }
    function makeBadge(loc) {
      var b = document.createElement('div');
      b.className = 'globe_510-badge' + (isHero ? ' is-hero' : '');
      if (logoSrc) {
        var img = document.createElement('img');
        img.alt = '5TEN';
        var applyImgDims = function () {
          var nw = img.naturalWidth, nh = img.naturalHeight;
          if (nw <= 0 || nh <= 0) return;
          var frameH = b.offsetHeight;
          if (frameH <= 0) return;
          var contentH = frameH - 2 - 20; // 1px border each side + 10px padding each side
          if (contentH <= 0) return;
          var newH = contentH + 'px';
          var newW = (contentH * (nw / nh)) + 'px';
          if (img.style.height !== newH || img.style.width !== newW) {
            img.style.setProperty('height', newH, 'important');
            img.style.setProperty('width', newW, 'important');
            img.style.setProperty('max-width', 'none', 'important');
            img.style.aspectRatio = nw + ' / ' + nh;
          }
        };
        img.addEventListener('load', applyImgDims);
        img.addEventListener('error', function () { b.innerHTML = '<span>510</span>'; });
        img.src = logoSrc;
        b.appendChild(img);
        if (img.complete && img.naturalWidth > 0) applyImgDims();
        // Recompute on viewport change so media-query frame-height shifts stay in sync
        window.addEventListener('resize', applyImgDims);
      } else {
        b.innerHTML = '<span>510</span>';
      }
      b.addEventListener('mouseenter', function () { show510(loc, b.getBoundingClientRect()); });
      b.addEventListener('mouseleave', hide510);
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (preview510 && preview510.classList.contains('is-visible')) hide510();
        else show510(loc, b.getBoundingClientRect());
      });
      wrapper.appendChild(b);
      var line = document.createElementNS(SVG_NS, 'polyline');
      line.setAttribute('class', 'globe_510-leader-line');
      leadersSvg.appendChild(line);
      var dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('class', 'globe_510-leader-dot');
      dot.setAttribute('r', '3');
      leadersSvg.appendChild(dot);
      badges.push({ el: b, loc: loc, line: line, dot: dot });
    }
    makeBadge(BROOKLYN);
    makeBadge(SHENZHEN);
    makeBadge(BELGIUM);

    // Arcs
    var arcGroup = new THREE.Group(), arcs = [];
    function makeArc(start, end, hero, isStatic) {
      var sv = ll2v(start.lat, start.lng, R * 1.008), ev = ll2v(end.lat, end.lng, R * 1.008);
      var dist = sv.distanceTo(ev);
      var mid = new THREE.Vector3().addVectors(sv, ev).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(R + dist * (hero ? 0.4 : 0.28));
      var curve = new THREE.QuadraticBezierCurve3(sv, mid, ev);
      var nPts = hero ? 120 : 80, pts = curve.getPoints(nPts);
      var geom = new THREE.BufferGeometry().setFromPoints(pts);
      var glowGeom = new THREE.BufferGeometry().setFromPoints(pts);
      if (isStatic) { geom.setDrawRange(0, nPts); glowGeom.setDrawRange(0, nPts); }
      else { geom.setDrawRange(0, 0); glowGeom.setDrawRange(0, 0); }
      var glowLine = new THREE.Line(glowGeom, new THREE.LineBasicMaterial({ color: PAL.tealGlow, transparent: true, opacity: hero ? 0.22 : 0.12 })); arcGroup.add(glowLine);
      var line = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: hero ? PAL.tealGlow : PAL.teal, transparent: true, opacity: hero ? 0.75 : 0.5 })); arcGroup.add(line);
      var td = new THREE.Mesh(new THREE.SphereGeometry(hero ? 0.006 : 0.004, 10, 10), new THREE.MeshBasicMaterial({ color: PAL.tealGlow, transparent: true, opacity: 0 })); arcGroup.add(td);
      var tdGlow = new THREE.Mesh(new THREE.SphereGeometry(hero ? 0.018 : 0.012, 10, 10), new THREE.MeshBasicMaterial({ color: PAL.teal, transparent: true, opacity: 0 })); arcGroup.add(tdGlow);
      return { line: line, geom: geom, glowLine: glowLine, glowGeom: glowGeom, curve: curve, td: td, tdGlow: tdGlow, nPts: nPts, hero: hero, isStatic: !!isStatic, progress: Math.random() * 2.2, speed: hero ? 0.0015 : (0.002 + Math.random() * 0.003) };
    }
    // HQ ↔ HQ lines: constantly visible (static). Brooklyn ↔ Shenzhen ↔ Belgium triangle.
    arcs.push(makeArc(BROOKLYN, SHENZHEN, true, true));
    arcs.push(makeArc(BROOKLYN, BELGIUM, true, true));
    arcs.push(makeArc(SHENZHEN, BELGIUM, true, true));
    // CMS project arcs: animated, start from Brooklyn
    CMS_CLUSTERS.forEach(function (c) {
      if (BROOKLYN._mergedCluster === c) return; // skip self-arc when HQ merged with this cluster
      arcs.push(makeArc(BROOKLYN, { lat: c.lat, lng: c.lng }, false, false));
    });
    globeGroup.add(arcGroup);

    // Preview card (shared element — only one exists in DOM)
    var preview = document.getElementById('globe-preview');
    var pvImg = preview.querySelector('.gp-img'), pvLoc = preview.querySelector('.gp-loc'),
      pvTitle = preview.querySelector('.gp-title'), pvCta = preview.querySelector('.gp-cta');
    var hoveredProj = null, hoveringPin = false, mouseOnCard = false, dismissTimer = null;

    function showPreview(proj, sx, sy) {
      if (!proj.title && !proj._cluster) return;
      var cluster = proj._cluster || [proj];
      var primary = cluster[0];
      var others = cluster.slice(1);
      pvImg.src = primary.img || '';
      pvImg.style.display = primary.img ? 'block' : 'none';
      pvTitle.textContent = primary.title || '';
      var pvCtaLabel = pvCta.querySelector('.gp-cta-label');
      if (primary.hasCaseStudy) {
        pvCta.href = primary.slug || '#';
        if (pvCtaLabel) pvCtaLabel.textContent = 'View Project';
      } else {
        pvCta.href = window.__globeCtaHref || '/projects'; // [AB]
        if (pvCtaLabel) pvCtaLabel.textContent = 'Explore Projects';
      }
      pvLoc.textContent = primary.city + (primary.region ? ', ' + primary.region : '');
      if (others.length > 0) {
        preview.classList.add('is-cluster');
        var listEl = preview.querySelector('.gp-cluster-list');
        if (!listEl) {
          listEl = document.createElement('div');
          listEl.className = 'gp-cluster-list';
          preview.querySelector('.gp-body').appendChild(listEl);
        }
        listEl.innerHTML = '<div class="gp-cluster-heading">Other projects here</div>';
        others.forEach(function (p) {
          var a = document.createElement('a');
          a.className = 'gp-cluster-item';
          a.href = p.hasCaseStudy ? (p.slug || '#') : (window.__globeCtaHref || '/projects'); // [AB]
          var thumb = p.img ? '<img src="' + p.img + '" alt="">' : '<div class="gp-cluster-thumb"></div>';
          a.innerHTML = thumb + '<span class="gp-cluster-title">' + p.title + '</span><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h8M6 2l3 3-3 3"/></svg>';
          listEl.appendChild(a);
        });
      } else {
        preview.classList.remove('is-cluster');
      }
      var pad = 12;
      var pvW = preview.offsetWidth || 240;
      var pvH = preview.offsetHeight || 280;
      var l = sx + 20, t = sy - 80;
      if (l + pvW > innerWidth - pad) l = sx - pvW - 20;
      if (l < pad) l = pad;
      if (l + pvW > innerWidth - pad) l = innerWidth - pvW - pad; // fallback clamp
      if (t + pvH > innerHeight - pad) t = innerHeight - pvH - pad;
      if (t < pad) t = pad;
      preview.style.left = l + 'px'; preview.style.top = t + 'px';
      preview.classList.add('is-visible'); hoveredProj = proj;
    }
    function hidePreview() { preview.classList.remove('is-visible'); hoveredProj = null; hoveringPin = false; }
    function startDismiss() { cancelDismiss(); dismissTimer = setTimeout(function () { dismissTimer = null; hoveringPin = false; hidePreview(); }, 600); }
    function cancelDismiss() { if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null; } }
    function dismissPreview() { cancelDismiss(); hoveringPin = false; hidePreview(); }

    // Mouse / drag
    var mouse = { x: 0, y: 0 }, ray = new THREE.Raycaster();
    var dragging = false, dragX = 0, dragY = 0, velX = 0, velY = 0, isRecentering = false;

    // Filter raycast hits to pins on the visible hemisphere only — back-side pins
    // are occluded by the globe sphere but raycaster doesn't know that.
    // Test: dot product of pin's outward normal (pinWorldPos - globeCenter) with
    // camera direction (cameraPos - globeCenter). > 0 means same hemisphere as camera.
    var _pinNormal = new THREE.Vector3();
    var _camDir = new THREE.Vector3();
    var _globeCenter = new THREE.Vector3();
    var _pinWorldPos = new THREE.Vector3();
    function firstVisibleHit(hits) {
      if (!hits.length) return null;
      globeGroup.getWorldPosition(_globeCenter);
      _camDir.copy(camera.position).sub(_globeCenter).normalize();
      for (var i = 0; i < hits.length; i++) {
        hits[i].object.getWorldPosition(_pinWorldPos);
        _pinNormal.copy(_pinWorldPos).sub(_globeCenter).normalize();
        if (_pinNormal.dot(_camDir) > 0.05) return hits[i];
      }
      return null;
    }

    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (dragging) { velY = (e.clientX - dragX) * 0.0008; velX = (e.clientY - dragY) * 0.0008; dragX = e.clientX; dragY = e.clientY; if (hoveredProj && !mouseOnCard) dismissPreview(); return; }
      ray.setFromCamera(mouse, camera);
      var hits = ray.intersectObjects(pinMeshes);
      var hit = firstVisibleHit(hits);
      if (hit) {
        var p = hit.object.userData; cancelDismiss(); hoveringPin = true;
        if (hoveredProj && hoveredProj !== p) hidePreview();
        if (hoveredProj !== p) showPreview(p, e.clientX, e.clientY);
        canvas.style.cursor = 'pointer';
      } else {
        if (hoveredProj && !mouseOnCard && !dismissTimer) startDismiss();
        canvas.style.cursor = 'grab';
      }
    });
    canvas.addEventListener('mousedown', function (e) { dragging = true; dragX = e.clientX; dragY = e.clientY; canvas.style.cursor = 'grabbing'; dismissHint(); });
    canvas.addEventListener('mouseup', function () { dragging = false; canvas.style.cursor = 'grab'; });
    canvas.addEventListener('mouseleave', function () { dragging = false; if (!mouseOnCard) startDismiss(); });
    preview.addEventListener('mouseenter', function () { mouseOnCard = true; cancelDismiss(); hoveringPin = true; });
    preview.addEventListener('mouseleave', function () { mouseOnCard = false; startDismiss(); });

    // Touch — drag + tap-to-reveal pin preview
    var tX = 0, tY = 0, tStartX = 0, tStartY = 0, tStartTime = 0, tMoved = false;
    canvas.addEventListener('touchstart', function (e) {
      e.preventDefault();
      dragging = true;
      tX = e.touches[0].clientX; tY = e.touches[0].clientY;
      tStartX = tX; tStartY = tY; tStartTime = Date.now(); tMoved = false;
      dismissHint();
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (dragging) {
        velY = (e.touches[0].clientX - tX) * 0.003;
        velX = (e.touches[0].clientY - tY) * 0.003;
        tX = e.touches[0].clientX; tY = e.touches[0].clientY;
        if (Math.abs(tX - tStartX) > 6 || Math.abs(tY - tStartY) > 6) tMoved = true;
      }
    }, { passive: false });
    canvas.addEventListener('touchend', function (e) {
      dragging = false;
      if (!tMoved && (Date.now() - tStartTime) < 300 && e.changedTouches.length === 1) {
        var lt = e.changedTouches[0];
        var rect = canvas.getBoundingClientRect();
        mouse.x = ((lt.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((lt.clientY - rect.top) / rect.height) * 2 + 1;
        ray.setFromCamera(mouse, camera);
        var hits = ray.intersectObjects(pinMeshes);
        var hit = firstVisibleHit(hits);
        if (hit) {
          cancelDismiss();
          hoveringPin = true;
          showPreview(hit.object.userData, lt.clientX, lt.clientY);
        } else if (hoveredProj) {
          dismissPreview();
        }
      }
    });

    // Scroll zoom
    var zoomTarget = startZ;
var ZOOM_MIN = isHero ? 1.6 : 1.4, ZOOM_MAX = startZ;
function onWheel(e) { if (!dragging && canvas.style.cursor !== 'pointer') return; e.preventDefault(); e.stopPropagation(); zoomTarget += e.deltaY * 0.001; zoomTarget = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomTarget)); dismissHint(); }
wrapper.addEventListener('wheel', onWheel, { passive: false });
canvas.addEventListener('wheel', onWheel, { passive: false });

    // Pinch zoom
    var lastPinchDist = 0;
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) { var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY; lastPinchDist = Math.sqrt(dx * dx + dy * dy); }
    }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY, dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist > 0) { zoomTarget += (lastPinchDist - dist) * 0.005; zoomTarget = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomTarget)); }
        lastPinchDist = dist;
      }
    }, { passive: true });

    // Animate
    var t = 0;
    function loop() {
      requestAnimationFrame(loop); t += 0.016;
      camera.position.z += (zoomTarget - camera.position.z) * 0.08;
      if (!dragging && !hoveringPin && !isRecentering) { globeGroup.rotation.y += 0.00025; velX *= 0.96; velY *= 0.96; }
      globeGroup.rotation.y += velY;
      globeGroup.rotation.x += velX;
      arcs.forEach(function (a) {
        if (a.isStatic) {
          // Static HQ ↔ HQ line — fully drawn, constant opacity, no traveling dot
          a.geom.setDrawRange(0, a.nPts);
          a.glowGeom.setDrawRange(0, a.nPts);
          a.line.material.opacity = 0.55;
          a.glowLine.material.opacity = 0.18;
          a.td.material.opacity = 0;
          a.tdGlow.material.opacity = 0;
          return;
        }
        a.progress += a.speed; if (a.progress > 2.2) a.progress = 0;
        var draw = Math.min(a.progress, 1), trail = Math.max(0, a.progress - (a.hero ? 0.7 : 0.5));
        var s = Math.floor(trail * a.nPts), c = Math.floor(draw * a.nPts) - s;
        a.geom.setDrawRange(s, Math.max(0, c)); a.glowGeom.setDrawRange(s, Math.max(0, c));
        if (a.progress < 1) { var pos = a.curve.getPoint(draw); a.td.position.copy(pos); a.td.material.opacity = 0.95; a.tdGlow.position.copy(pos); a.tdGlow.material.opacity = a.hero ? 0.25 : 0.15; }
        else { var fade = Math.max(0, 1 - (a.progress - 1) * 2.5); a.td.material.opacity = fade; a.tdGlow.material.opacity = fade * (a.hero ? 0.25 : 0.15); }
        var bOp = a.hero ? 0.8 : 0.55, glowOp = a.hero ? 0.25 : 0.15;
        a.line.material.opacity = a.progress < 1 ? bOp : Math.max(0, bOp - (a.progress - 1) * 1.2);
        a.glowLine.material.opacity = a.progress < 1 ? glowOp : Math.max(0, glowOp - (a.progress - 1) * 1.2);
      });
      pulseRings.forEach(function (p) { var s = 1 + Math.sin(t * 1.5) * 0.6; p.scale.set(s, s, 1); p.material.opacity = 0.1 + Math.sin(t * 1.5) * 0.15; });
      pinGroup.children.forEach(function (child) {
        if (child.geometry && child.geometry.type === 'CircleGeometry') { var pulse = 0.6 + Math.sin(t * 1.0 + child.position.x * 5) * 0.4; child.material.opacity = pulse; }
        if (child.geometry && child.geometry.type === 'RingGeometry' && !child.userData.isPulse) { var pulse = 0.15 + Math.sin(t * 1.2 + child.position.y * 4) * 0.25; child.material.opacity = pulse; }
        if (child.userData && child.userData.isGlow) { var pulse = 0.08 + Math.sin(t * 1.0 + child.position.z * 6) * 0.12; child.material.opacity = pulse; var gs = 1 + Math.sin(t * 0.8 + child.position.x * 3) * 0.3; child.scale.set(gs, gs, gs); }
      });
      // Project 5TEN badges + leader lines to screen-space each frame; hide when on back hemisphere
      if (badges.length) {
        var wW = wrapper.clientWidth, wH = wrapper.clientHeight;
        var camDir = camera.position.clone().normalize();
        var badgeHalfH = isHero ? 45 : 33;
        badges.forEach(function (bd) {
          var world = ll2v(bd.loc.lat, bd.loc.lng, R * 1.004);
          world.applyMatrix4(globeGroup.matrixWorld);
          var facing = world.clone().normalize().dot(camDir);
          var opacity = facing > 0.22 ? 1 : Math.max(0, (facing - 0.05) / 0.17);
          bd.el.style.opacity = opacity;
          bd.el.style.pointerEvents = opacity >= 0.95 ? 'auto' : 'none';
          if (bd.line) bd.line.style.opacity = opacity * 0.9;
          if (bd.dot) bd.dot.style.opacity = opacity;
          if (opacity <= 0) return;
          var proj = world.clone().project(camera);
          var px = (proj.x * 0.5 + 0.5) * wW;  // pin screen pos
          var py = (-proj.y * 0.5 + 0.5) * wH;
          // Scale badge offset down on narrow wrappers so it doesn't clip off the edge
          var offsetScale = wW < 480 ? 0.5 : (wW < 768 ? 0.75 : 1);
          var ox = ((bd.loc.offset && bd.loc.offset.x) || 0) * offsetScale;
          var oy = ((bd.loc.offset && bd.loc.offset.y) || 0) * offsetScale;
          var bx = px + ox, by = py + oy;       // badge center
          var scale = Math.max(0.6, 1 - proj.z * 0.3);
          bd.el.style.left = bx + 'px';
          bd.el.style.top = by + 'px';
          bd.el.style.setProperty('--gb-s', scale);
          if (bd.line && bd.dot) {
            if (ox === 0 && oy === 0) {
              bd.line.setAttribute('points', '');
              bd.dot.setAttribute('cx', -9999);
            } else {
              var endX = bx, endY = by + badgeHalfH;  // badge bottom center
              var elbowY = endY + 22;                 // 22px below badge
              var elbowX = bx;                        // vertically aligned with badge
              bd.line.setAttribute('points', px + ',' + py + ' ' + elbowX + ',' + elbowY + ' ' + endX + ',' + endY);
              bd.dot.setAttribute('cx', px);
              bd.dot.setAttribute('cy', py);
            }
          }
        });
      }
      renderer.render(scene, camera);
    }
    loop();

    // ResizeObserver
    var resizeTimeout;
    var ro = new ResizeObserver(function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        var w = wrapper.clientWidth, h = wrapper.clientHeight;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
          renderer.setSize(w, h);
          canvas.style.width = w + 'px';
          canvas.style.height = h + 'px';
        }
      }, 100);
    });
    ro.observe(wrapper);

    // North America framing — set initial + re-center on scroll into view
    var NA_ROT_Y = 0.1, NA_ROT_X = isHero ? 0.3 : 0.35;
    globeGroup.rotation.y = NA_ROT_Y;
    globeGroup.rotation.x = NA_ROT_X;

    function recenterToNA() {
      if (isRecentering || dragging) return;
      isRecentering = true;
      velX = 0; velY = 0;
      var startY = globeGroup.rotation.y, startX = globeGroup.rotation.x;
      // shortest-path Y delta
      var dY = NA_ROT_Y - startY;
      while (dY > Math.PI) dY -= 2 * Math.PI;
      while (dY < -Math.PI) dY += 2 * Math.PI;
      var dX = NA_ROT_X - startX;
      if (Math.abs(dY) < 0.005 && Math.abs(dX) < 0.005) { isRecentering = false; return; }
      if (window.gsap) {
        window.gsap.to(globeGroup.rotation, {
          y: startY + dY, x: NA_ROT_X, duration: 1.2, ease: 'power3.inOut',
          onComplete: function () { isRecentering = false; }
        });
      } else {
        var t0 = performance.now(), dur = 1200;
        (function step() {
          var k = Math.min(1, (performance.now() - t0) / dur);
          var ea = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          globeGroup.rotation.y = startY + dY * ea;
          globeGroup.rotation.x = startX + dX * ea;
          if (k < 1) requestAnimationFrame(step);
          else isRecentering = false;
        })();
      }
    }

    var naIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) recenterToNA(); });
    }, { threshold: 0.35 });
    naIO.observe(wrapper);

  }).catch(function (e) { console.warn('Globe init failed:', e); });
}
