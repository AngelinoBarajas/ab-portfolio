/*! AB Portfolio · ab-process v0.33.69 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abProcessInit) return;
  window.__abProcessInit = true;
  /* ===== process/00-process.js ===== */
  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-process] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, hasGsap = AB.hasGsap, toast = AB.toast, esc = AB.esc;

  /* =========================================================
     PROCESS (/process) · the flight planner. Copy lives in the Designer; the eight destinations come from
     the hidden Services list ([data-dest-source], fields: short name, legs 1-6, timeline preset, example mission).
     Pick a planet on the star chart and the page re-plots: hero planet + countdown label, panel, route legs +
     "flown before" links, timeline dials, form destination. The route is a pinned sideways flight (≥768px) or a
     vertical rail (phones). Default content in the Designer = the first destination (Website).
     ========================================================= */
  var page = $('.section_process-chart');
  if (!page) return;
  var root = document.documentElement;
  // rail/chip colors per service (Color fields can't bind to text/attributes); unknown slugs fall back to signal
  var DOT = { 'webflow-development': '#146EF5', 'webgl-data': '#5eead4', motion: '#0AE448', branding: '#FF6A3D', 'custom-deploys': '#C9C7C0', 'cms-integrations': '#8fb1ff', 'design-systems': '#7c5cff', performance: '#ffd166' };

  /* ---------- destinations from the CMS ---------- */
  // missions switched to "Hide from site" (hidden list [data-hidden-missions]) never show as a "flown before" example
  var HIDDEN = $$('[data-hidden-missions] .w-dyn-item [data-field="slug"]').map(function(n){ return n.textContent.trim(); });
  var DEST = $$('[data-dest-source] .w-dyn-item').map(function(it){
    function f(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; }
    var slug = f('slug');
    return {
      slug: slug, t1: f('title-1'), t2: f('title-2'), name: f('name'), short: f('short-name') || f('name'), sum: f('summary'), c: DOT[slug] || '#FF6A3D',
      p: [(f('planet-type') || 'gas').toLowerCase(), f('planet-colors'), f('planet-ring'), f('planet-glow') || 'transparent'],
      plan: [f('stage-1'), f('stage-2'), f('stage-3'), f('stage-4')].filter(Boolean),
      legs: [1, 2, 3, 4, 5, 6].map(function(n){ return f('process-leg-' + n); }),
      eta: (f('timeline-preset') || '1,1,1,1,1,1').split(',').map(function(v){ return Math.max(0, Math.min(2, parseInt(v, 10) || 0)); }),
      ex: f('example-slug') && HIDDEN.indexOf(f('example-slug')) < 0 ? [f('example-slug'), f('example-name')] : null
    };
  }).filter(function(d){ return d.slug; });

  // the mission: sel[0] = main destination, sel[1..] = extra stops (3 at most; more goes in the form's "More than three")
  var MAX_STOPS = 3, sel = [0], adding = false, KEY = 'ab:dest';
  try {
    var saved = (localStorage.getItem(KEY) || '').split(','), got = [];
    saved.forEach(function(sl){ DEST.forEach(function(d, i){ if (d.slug === sl && got.indexOf(i) < 0 && got.length < MAX_STOPS) got.push(i); }); });
    if (got.length) sel = got;
  } catch (e){}

  function planetAttrs(el, d, seed){
    el.setAttribute('data-planet', d.p[0]); el.setAttribute('data-colors', d.p[1]); el.setAttribute('data-glow', d.p[3]); el.setAttribute('data-seed', seed); el.setAttribute('data-spin', '50');
    if (d.p[2]){ el.setAttribute('data-ring', d.p[2]); el.setAttribute('data-tilt', '-16'); } else el.removeAttribute('data-ring');
  }
  // swap a planet's look in place (keeps its Draggable + position)
  function repaint(el, d, seed){
    if (!AB.buildPlanet) return;
    el.innerHTML = ''; el.__built = false; el.__body = null;
    planetAttrs(el, d, seed); AB.buildPlanet(el);
  }

  /* ---------- star chart ---------- */
  // phone-size charts: the planets spread outward, clear of the sun and its label
  var chart = $('[data-chart]'), ORB = chart && chart.clientWidth < 520 ? [0.5, 0.64, 0.78, 0.92] : [0.36, 0.52, 0.68, 0.84], dests = [], chartSat = null;
  if (chart && DEST.length){
    ORB.forEach(function(r){ var o = document.createElement('span'); o.className = 'abp-orbit'; o.style.width = o.style.height = (r * 100) + '%'; chart.appendChild(o); });
    var spin = document.createElement('div'); spin.className = 'abp-spin'; chart.appendChild(spin);
    // the mission's flight path: sun → main → stops (inside the spinning layer, so it turns with the planets)
    var routeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); routeSvg.setAttribute('class', 'abp-chart-route'); routeSvg.setAttribute('viewBox', '0 0 100 100'); routeSvg.setAttribute('preserveAspectRatio', 'none'); routeSvg.setAttribute('aria-hidden', 'true');
    var routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path'); routeSvg.appendChild(routePath); spin.appendChild(routeSvg);
    var step = 360 / DEST.length;
    chart.setAttribute('role', 'group');
    DEST.forEach(function(d, i){
      var r = ORB[i % 4] / 2 * 100, a = (i * step + (i % 2 ? step * .45 : 0) - 90) * Math.PI / 180, s = [46, 52, 60, 66][i % 4];
      var b = document.createElement('button'); b.type = 'button'; b.className = 'abp-dest'; b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', d.t1 + ' ' + d.t2); b.style.left = (50 + Math.cos(a) * r).toFixed(2) + '%'; b.style.top = (50 + Math.sin(a) * r).toFixed(2) + '%'; b.style.setProperty('--s', s + 'px');
      b.__x = 50 + Math.cos(a) * r; b.__y = 50 + Math.sin(a) * r;
      b.innerHTML = '<span class="abp-counter"><span class="abp-pl ab_planet"></span><span class="abp-sel" aria-hidden="true"></span><span class="abp-tag">' + esc(d.short) + '</span><span class="abp-stopno" aria-hidden="true"></span></span>';
      var pl = $('.abp-pl', b); planetAttrs(pl, d, 20 + i); if (AB.buildPlanet) AB.buildPlanet(pl);
      b.addEventListener('click', function(){ chartPick(i); });
      b.addEventListener('keydown', function(e){
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!n) return;
        e.preventDefault(); var j = (i + n + DEST.length) % DEST.length; dests[j].focus();
      });
      spin.appendChild(b); dests.push(b);
    });
    // the Knowledge System add-on as a satellite on the outer orbit (upper right, in the open sky): not a stop,
    // clicking it toggles the add-on, same state as the form chip; the small satellite then circles the main planet
    var kr = ORB[3] / 2 * 100, ka = (chart.clientWidth < 520 ? -55 : -32) * Math.PI / 180;
    chartSat = document.createElement('button'); chartSat.type = 'button'; chartSat.className = 'abp-kssat'; chartSat.setAttribute('aria-pressed', 'false');
    chartSat.setAttribute('aria-label', 'KNS, Knowledge system add-on');
    chartSat.style.left = (50 + Math.cos(ka) * kr).toFixed(2) + '%'; chartSat.style.top = (50 + Math.sin(ka) * kr).toFixed(2) + '%';
    chartSat.innerHTML = '<span class="abp-counter"><span class="abp-kssat-body"><svg class="sat-ico " viewBox="0 0 24 12" aria-hidden="true"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg></span><span class="abp-tag">KNS · Knowledge system</span><span class="abp-kssat-state">+ Add-on</span></span>';
    chartSat.addEventListener('click', function(){ toggleKs(chartSat); });
    spin.appendChild(chartSat);
  }
  // panel: the stops list + "Add a stop" (script UI; the destination copy itself comes from the CMS)
  var panelBody = $('.ab_chart_panel-body'), stopsBox = null, addBtn = null;
  if (panelBody && DEST.length){
    stopsBox = document.createElement('div'); stopsBox.className = 'abp-stops'; stopsBox.setAttribute('aria-live', 'polite');
    var sumEl = $('[data-dest-sum]', panelBody); panelBody.insertBefore(stopsBox, sumEl ? sumEl.nextSibling : null);
    var acts = $('.ab_chart_actions', panelBody);
    addBtn = document.createElement('button'); addBtn.type = 'button'; addBtn.className = 'abp-add-stop';
    if (acts) acts.insertBefore(addBtn, acts.firstChild);
    addBtn.addEventListener('click', function(){
      if (sel.length >= MAX_STOPS){ if (toast) toast('Three stops max here · add the rest in the form'); return; }
      adding = !adding; render(true);
      if (adding && toast) toast('Pick a planet to add it as a stop');
    });
  }
  // chart click: normally switches the main destination; in "add a stop" mode it adds one
  function chartPick(i){
    var at = sel.indexOf(i);
    if (adding){
      adding = false;
      if (at > -1){ if (toast) toast(DEST[i].short + ' is already on the route'); render(true); return; }
      sel.push(i); render(false, 'Stop added · ' + DEST[i].short); return;
    }
    if (at === 0) return;
    if (at > 0) sel.splice(at, 1);
    sel[0] = i; render(false, 'Course plotted · ' + DEST[i].t1 + ' ' + DEST[i].t2);
  }
  function removeStop(i){ var at = sel.indexOf(i); if (at < 0 || sel.length < 2) return; sel.splice(at, 1); render(false, 'Stop removed · ' + DEST[i].short); }
  function makeMain(i){ var at = sel.indexOf(i); if (at < 1) return; sel.splice(at, 1); sel.unshift(i); render(false, 'Main destination · ' + DEST[i].short); }

  /* ---------- route: path, ship, launch pad ---------- */
  var track = $('[data-route-track]'), wps = $$('.ab_route_wp', track), nodes = wps.map(function(w){ return $('.ab_route_node', w); });
  var STAGE_CODES = wps.map(function(w){ var t = $('.ab_route_card-top', w); return t ? t.textContent.replace(/T−\d\s*·\s*/, '').replace(/\s*\d\s*\/\s*\d\s*$/, '').trim() : ''; });
  var SVGNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'abp-path'); svg.setAttribute('aria-hidden', 'true');
  var line = document.createElementNS(SVGNS, 'path'); line.setAttribute('class', 'abp-line');
  var lit = document.createElementNS(SVGNS, 'path'); lit.setAttribute('class', 'abp-lit');
  svg.appendChild(line); svg.appendChild(lit);
  var pad = document.createElement('div'); pad.className = 'abp-pad'; pad.setAttribute('aria-hidden', 'true');
  pad.innerHTML = '<div class="ab_planet abp-pad-pl" data-planet="terra" data-seed="7" data-colors="#0b2a4a,#1f6fb2,#3fa66b,#a88b5c,#f2f0ea" data-spin="80" data-glow="rgba(76,141,255,.35)"></div><span>Earth · your brief</span>';
  var ship = document.createElement('div'); ship.className = 'abp-ship'; ship.setAttribute('aria-hidden', 'true');
  ship.innerHTML = '<svg viewBox="0 0 44 44"><path class="abp-flame" d="M6 22 L-8 17 L-4 22 L-8 27 Z" fill="#FF6A3D"/><path d="M6 14 H26 L40 22 L26 30 H6 Z" fill="#F2F0EA"/><path d="M14 14 L10 6 H18 L22 14 Z M14 30 L10 38 H18 L22 30 Z" fill="#8A8FA3"/><circle cx="28" cy="22" r="3.5" fill="#4C8DFF"/></svg>';
  // touchdown: the mission's main destination waits at the end of the route (stops orbit it as moons); landing sets off a small celebration
  // touchdown buttons: the same site buttons as the /services touchdown (primary + two ghosts)
  function dockBtn(kind, href, label, arrow, attrs){
    return '<a class="button ' + kind + '" href="' + href + '"' + (attrs || '') + '>' + (kind.indexOf('is-primary') > -1 ? '<span class="ab_button-shine"></span>' : '') +
      '<span class="ab_button-label">' + label + '</span>' + (arrow ? '<span class="ab_button-arrow" aria-hidden="true">' + arrow + '</span>' : '') + '</a>';
  }
  var dock = document.createElement('div'); dock.className = 'abp-dock';
  dock.innerHTML = '<div class="abp-dock-sys" aria-hidden="true"><div class="abp-dock-moons"></div><div class="ab_planet abp-dock-pl"></div><div class="abp-burst"></div></div>' +
    '<div class="abp-dock-txt"><div class="abp-dock-l">Touchdown · <span data-dest-short>Website</span></div><div class="abp-dock-h">Mission <span class="t-outline">live</span></div><div class="abp-dock-acts">' + dockBtn('is-primary', '#launch', 'Request this mission', '→', ' data-dock-go') + dockBtn('is-ghost', '/contact#call', 'Book a call') + dockBtn('is-ghost', '#chart', 'Re-plot route', '↺', ' data-dock-go') + '</div></div>';
  var dockPl = $('.abp-dock-pl', dock), moons = $('.abp-dock-moons', dock), lastDock = -1;
  // touchdown links are script-built (core binds same-page anchors at load), so they warp + jump here: back to the star chart, or on to the form
  $$('[data-dock-go]', dock).forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault(); e.stopPropagation();
      if (AB.warp && AB.scrollToTarget) AB.warp(function(){ AB.scrollToTarget(t); }); else t.scrollIntoView();
    });
  });
  if (track){ track.insertBefore(svg, track.firstChild); track.appendChild(pad); track.appendChild(dock); track.appendChild(ship); if (AB.buildPlanet) AB.buildPlanet($('.abp-pad-pl', pad)); }

  /* ---------- render the mission (main + stops): everything re-plots ---------- */
  var lastMain = 0, lastLegs = [];
  function render(quiet, msg){
    if (!DEST.length) return;
    var i = sel[0], d = DEST[i], stops = sel.slice(1).map(function(k){ return DEST[k]; });
    var label = d.short + (stops.length ? ' +' + stops.length : '');
    try { localStorage.setItem(KEY, sel.map(function(k){ return DEST[k].slug; }).join(',')); } catch (e){}
    root.style.setProperty('--dest', d.c);
    // chart: main = selection box, stops = numbered dashed boxes, path sun → main → stops
    dests.forEach(function(b, j){
      var at = sel.indexOf(j);
      b.classList.toggle('is-on', at === 0); b.classList.toggle('is-stop', at > 0);
      b.setAttribute('aria-pressed', at > -1 ? 'true' : 'false');
      b.setAttribute('aria-label', DEST[j].t1 + ' ' + DEST[j].t2 + (at === 0 ? ', main destination' : at > 0 ? ', stop ' + (at + 1) : ''));
      var no = $('.abp-stopno', b); if (no) no.textContent = at > 0 ? String(at + 1) : '';
    });
    if (chart) chart.classList.toggle('is-adding', adding);
    if (routePath) routePath.setAttribute('d', 'M50 50' + sel.map(function(k){ return ' L' + dests[k].__x.toFixed(2) + ' ' + dests[k].__y.toFixed(2); }).join(''));
    // text hooks
    $$('[data-dest-short]').forEach(function(e){ e.textContent = label; });
    var title = $('[data-dest-title]'); if (title) title.innerHTML = '<span class="ab_chart_title-a">' + esc(d.t1) + '</span> <span class="ab_chart_title-b t-outline">' + esc(d.t2) + '</span>';
    var sum = $('[data-dest-sum]'); if (sum && d.sum) sum.textContent = d.sum;
    var plan = $('[data-dest-plan]'); if (plan && d.plan.length) plan.innerHTML = d.plan.map(function(p, k){ return '<div class="ab_chart_plan-item"><div class="ab_chart_plan-no">Stage 0' + (k + 1) + '</div><div class="ab_chart_plan-name">' + esc(p) + '</div></div>'; }).join('');
    var link = $('[data-dest-link]'); if (link) link.href = '/services/' + d.slug;
    // panel stops: each with a service link, "make main" and remove
    if (stopsBox){
      stopsBox.innerHTML = (stops.length || sel[0] !== 0 ? '<button type="button" class="abp-reset" data-reset="">↺ Reset route</button>' : '') + (stops.length ? '<div class="abp-stops-h">Stops on this mission</div>' : '') + sel.slice(1).map(function(k, n){
        var s = DEST[k];
        return '<div class="abp-stop" style="--c:' + s.c + '"><i aria-hidden="true"></i><span class="abp-stop-n">' + (n + 2) + '</span><a href="/services/' + esc(s.slug) + '">' + esc(s.t1 + ' ' + s.t2) + '</a>' +
          '<button type="button" class="abp-stop-b" data-main="' + k + '" aria-label="Make ' + esc(s.short) + ' the main destination">Main</button>' +
          '<button type="button" class="abp-stop-b is-x" data-remove="' + k + '" aria-label="Remove ' + esc(s.short) + '">×</button></div>';
      }).join('');
      // back to the default route: the first destination alone (stops cleared)
      var rst = $('[data-reset]', stopsBox); if (rst) rst.addEventListener('click', function(){ sel = [0]; setMore(false); render(false, 'Route reset · ' + DEST[0].short); });
      $$('[data-main]', stopsBox).forEach(function(b){ b.addEventListener('click', function(){ makeMain(+b.getAttribute('data-main')); }); });
      $$('[data-remove]', stopsBox).forEach(function(b){ b.addEventListener('click', function(){ removeStop(+b.getAttribute('data-remove')); }); });
    }
    if (addBtn){
      addBtn.hidden = sel.length >= MAX_STOPS && !adding;
      addBtn.textContent = adding ? 'Pick a planet… (cancel)' : '+ Add a stop';
      addBtn.classList.toggle('is-on', adding);
    }
    if (dockPl){
      if (i !== lastDock){ repaint(dockPl, d, 21 + i); lastDock = i; }
      moons.innerHTML = stops.map(function(s, n){ return '<i style="--c:' + s.c + ';--o:' + (1.3 + n * .22) + ';--t:' + (10 + n * 6) + 's"></i>'; }).join('');
    }
    var hp = $('[data-process-planet]'); if (hp){ hp.setAttribute('data-label', 'Destination · ' + d.short); if (i !== lastMain) repaint(hp, d, 11 + i); lastMain = i; }
    // route: main leg in full, each stop adds a compact line; "flown before" = main's example, else a stop's
    var ex = d.ex; if (!ex) stops.forEach(function(s){ if (!ex && s.ex) ex = s.ex; });
    wps.forEach(function(w, k){
      var lab = $('[data-leg-label]', w); if (lab) lab.textContent = 'For ' + d.short;
      var t = $('[data-leg]', w);
      if (t && d.legs[k] && lastLegs[k] !== d.legs[k]){
        if (quiet || reduce || !hasGsap || !window.ScrambleTextPlugin) t.textContent = d.legs[k];
        else gsap.to(t, { duration: .6, scrambleText: { text: d.legs[k], chars: 'lowerCase', speed: .6 }, delay: k * .04 });
        lastLegs[k] = d.legs[k];
      }
      var legBox = t && t.parentNode, extra = legBox && $('.abp-leg-extra', legBox);
      if (legBox && !extra){ extra = document.createElement('div'); extra.className = 'abp-leg-extra'; legBox.appendChild(extra); }
      if (extra) extra.innerHTML = stops.map(function(s){ return s.legs[k] ? '<div class="abp-leg-stop" style="--c:' + s.c + '"><b>+ ' + esc(s.short) + '</b> · ' + esc(s.legs[k]) + '</div>' : ''; }).join('');
      var a = $('[data-flown]', w); if (!a) return;
      var what = a.getAttribute('data-flown-what') || 'it';
      if (ex){ a.classList.remove('is-none'); a.href = '/work/' + ex[0]; a.removeAttribute('aria-disabled'); a.textContent = 'See ' + what + ' · ' + ex[1] + ' →'; }
      else { a.classList.add('is-none'); a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.textContent = 'No mission flown here yet · yours could be first'; }
    });
    // timeline: the highest preset per factor across the mission; every extra stop stretches the scope one notch
    var comb = d.eta.map(function(v, f){ var m = v; stops.forEach(function(s){ if (s.eta[f] > m) m = s.eta[f]; }); return m; });
    if (comb.length) comb[0] = Math.min(2, comb[0] + stops.length);
    comb.forEach(function(v, f){ setFactor(f, v); });
    eta(quiet);
    syncForm();
    if (!quiet && msg && toast) toast(msg);
    // stops change card heights: re-fit the route (after the scramble has settled)
    if (!quiet && typeof build === 'function'){ clearTimeout(render.__t); render.__t = setTimeout(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 700); }
  }

  /* ---------- what moves the timeline ---------- */
  // each factor has its own color (service palette, same hues as the chips); a picked option fills with it and the
  // gauge arc blends the colors of every factor that stretches the route, weighted by how far it stretches it
  var ETA_C = ['#146EF5', '#ffd166', '#FF6A3D', '#0AE448', '#5eead4', '#7c5cff'], ETA_T = ['#fff', '#07080d', '#07080d', '#07080d', '#07080d', '#fff'];
  var segs = $$('.ab_eta_seg'), fv = segs.map(function(){ return 1; });
  var BUCKETS = $$('[data-eta-buckets] .ab_eta_bucket').map(function(b){ var t = $('.ab_eta_bucket-t', b), p = $('.ab_eta_bucket-p', b); return [t ? t.textContent : '', p ? p.textContent : '']; });
  var dial = $('[data-gauge]'), gauge = dial && dial.parentNode, SVGN = 'http://www.w3.org/2000/svg';
  // console dial: inner tick ring (majors on the bucket lines), blended arc, a light pulse riding the lit arc, glowing needle
  function ticks(){
    var s = '';
    for (var k = 0; k <= 30; k++){
      var t = k / 30, a = Math.PI * (1 - t), mj = k % 5 === 0 || k === 10 || k === 20, r1 = mj ? 96 : 100, r2 = 106;
      s += '<line class="abp-tk' + (mj ? ' is-mj' : '') + (k === 10 || k === 20 ? ' is-zone' : '') + '" data-t="' + t.toFixed(3) + '" x1="' + (150 + Math.cos(a) * r1).toFixed(1) + '" y1="' + (150 - Math.sin(a) * r1).toFixed(1) + '" x2="' + (150 + Math.cos(a) * r2).toFixed(1) + '" y2="' + (150 - Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    return s;
  }
  if (dial){
    var stopsHtml = ''; for (var gi = 0; gi < 8; gi++) stopsHtml += '<stop offset="0" stop-color="#FF6A3D"/>';
    dial.innerHTML = '<svg viewBox="0 0 300 170"><defs><linearGradient id="abpArcG" gradientUnits="userSpaceOnUse" x1="23" y1="0" x2="277" y2="0" color-interpolation="linearRGB">' + stopsHtml + '</linearGradient>' +
      '<radialGradient id="abpFace" cx="150" cy="150" r="140" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' +
      '<path class="abp-face" d="M10 150 A140 140 0 0 1 290 150 Z"/><g class="abp-ticks">' + ticks() + '</g>' +
      '<path class="abp-arc" d="M30 150 A120 120 0 0 1 270 150"/><path class="abp-arc-on" d="M30 150 A120 120 0 0 1 270 150"/><path class="abp-arc-pulse" d="M30 150 A120 120 0 0 1 270 150"/>' +
      '<g class="abp-needle"><g class="abp-needle-j"><line x1="150" y1="150" x2="150" y2="62"/><circle class="abp-hub-r" cx="150" cy="150" r="11"/><circle cx="150" cy="150" r="6"/></g></g>' +
      '<text class="abp-tickl" x="18" y="168">' + esc((BUCKETS[0] || ['Short hop'])[0]) + '</text><text class="abp-tickl" x="150" y="12" text-anchor="middle">' + esc((BUCKETS[1] || ['Standard orbit'])[0]) + '</text><text class="abp-tickl" x="282" y="168" text-anchor="end">Deep space</text></svg>';
    // instrument chrome: status strip with a live readout, corner brackets + rivets, scanlines
    gauge.classList.add('abp-console');
    var cTop = document.createElement('div'); cTop.className = 'abp-con-top'; cTop.setAttribute('aria-hidden', 'true');
    cTop.innerHTML = '<span class="abp-con-led"></span><span class="abp-con-name">Route length</span><span class="abp-con-read">RNG <b>050</b>%</span>';
    gauge.insertBefore(cTop, dial);
    var cDeco = document.createElement('div'); cDeco.className = 'abp-con-deco'; cDeco.setAttribute('aria-hidden', 'true'); gauge.appendChild(cDeco);
  }
  var arc = dial && $('.abp-arc-on', dial), pulse = dial && $('.abp-arc-pulse', dial), needle = dial && $('.abp-needle', dial), jit = dial && $('.abp-needle-j', dial);
  var gStops = dial ? $$('#abpArcG stop', dial) : [], tks = dial ? $$('.abp-tk', dial) : [], readN = dial && $('.abp-con-read b', gauge);
  var arcLen = arc ? arc.getTotalLength() : 0, gs = { r: 0 }, lastGc = '';
  segs.forEach(function(s, f){ gs['w' + f] = 1; });
  if (arc){ arc.style.strokeDasharray = arcLen; arc.style.strokeDashoffset = arcLen; arc.setAttribute('stroke', 'url(#abpArcG)'); }
  if (pulse){ pulse.style.strokeDasharray = '12 ' + Math.ceil(arcLen * 2); pulse.style.strokeDashoffset = arcLen; }
  // arc position t (0..1 along the semicircle) → gradient offset (the gradient runs along x, the arc is x = 150 - 120cos(πt))
  function gOff(t){ return (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, t)))) / 2 * 240 / 254 + 7 / 254; }
  // repaint from the tweened state: arc length, color stops (one band per stretching factor, blended between centers),
  // lit ticks, readout, and --gc (the color at the needle) for the needle glow + LED
  function paintArc(){
    if (!arc) return;
    var r = Math.max(.04, gs.r), tot = 0, cum = 0, st = [];
    segs.forEach(function(s, f){ tot += gs['w' + f]; });
    segs.forEach(function(s, f){ var w = gs['w' + f]; if (w > .01) st.push([(cum + w / 2) / tot * r, ETA_C[f]]); cum += w; });
    if (!st.length) st = [[0, '#8A8FA3']];
    var list = [[0, st[0][1]]].concat(st, [[r, st[st.length - 1][1]]]);
    gStops.forEach(function(n, k){ var p = list[Math.min(k, list.length - 1)]; n.setAttribute('offset', gOff(p[0]).toFixed(4)); n.setAttribute('stop-color', p[1]); });
    arc.style.strokeDashoffset = arcLen * (1 - r);
    tks.forEach(function(t){ t.classList.toggle('is-lit', +t.getAttribute('data-t') <= r + .001); });
    if (readN) readN.textContent = ('00' + Math.round(gs.r * 100)).slice(-3);
    var gc = st[st.length - 1][1]; if (gc !== lastGc && gauge){ gauge.style.setProperty('--gc', gc); lastGc = gc; }
  }
  segs.forEach(function(seg, f){
    seg.setAttribute('data-factor', f);
    var fac = seg.parentNode; if (fac){ fac.style.setProperty('--c', ETA_C[f % 6]); fac.style.setProperty('--tc', ETA_T[f % 6]); }
    $$('.ab_eta_opt', seg).forEach(function(o, v){
      o.setAttribute('role', 'button'); o.tabIndex = 0; o.setAttribute('aria-pressed', 'false');
      function go(){ setFactor(f, v); eta(); }
      o.addEventListener('click', go);
      o.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
    });
  });
  function setFactor(f, v){ if (!segs[f]) return; fv[f] = v; $$('.ab_eta_opt', segs[f]).forEach(function(o, j){ o.setAttribute('aria-pressed', j === v ? 'true' : 'false'); }); }
  function eta(instant){
    if (!segs.length) return;
    var total = fv.reduce(function(a, b){ return a + b; }, 0), r = total / (segs.length * 2), b = r < .34 ? 0 : r < .67 ? 1 : 2, bk = BUCKETS[b];
    var tt = $('[data-eta-title]'), tp = $('[data-eta-text]'), adds = $('[data-eta-adds]');
    if (bk && tt) tt.textContent = bk[0]; if (bk && tp) tp.textContent = bk[1];
    if (adds){
      var names = segs.map(function(s){ var n = s.parentNode && $('.ab_eta_factor-name', s.parentNode); return n ? n.firstChild.textContent.trim() : ''; });
      var on = fv.map(function(v, f){ return v === 2 ? '<span class="abp-add" style="--c:' + ETA_C[f % 6] + '">+ ' + esc(names[f]) + '</span>' : ''; }).join('');
      adds.innerHTML = on || '<span class="abp-add is-none">Nothing stretching it</span>';
    }
    if (gauge) gauge.setAttribute('data-bucket', b);
    if (!arc) return;
    var rot = -90 + 180 * r, to = { r: r };
    fv.forEach(function(v, f){ to['w' + f] = v; });
    if (instant || reduce || !hasGsap){ for (var k in to) gs[k] = to[k]; paintArc(); needle.setAttribute('transform', 'rotate(' + rot + ' 150 150)'); return; }
    to.duration = .9; to.ease = 'power3.out'; to.overwrite = true; to.onUpdate = paintArc;
    gsap.to(gs, to);
    gsap.to(needle, { rotation: rot, svgOrigin: '150 150', duration: .9, ease: 'elastic.out(1,.6)' });
  }
  // idle life while on screen: the needle hums (small random wobble), a light pulse runs up the lit arc
  if (dial && hasGsap && !reduce){
    var pl = { p: 0 };
    var hum = gsap.to(jit, { rotation: function(){ return (Math.random() - .5) * 2.6; }, svgOrigin: '150 150', duration: .45, ease: 'sine.inOut', repeat: -1, repeatRefresh: true, paused: true });
    var run = gsap.to(pl, { p: 1, duration: 2.4, ease: 'power1.inOut', repeat: -1, repeatDelay: 1.3, paused: true, onUpdate: function(){
      var fill = arcLen * Math.max(.04, gs.r); pulse.style.strokeDashoffset = -(pl.p * Math.max(0, fill - 12)); pulse.style.opacity = Math.sin(pl.p * Math.PI).toFixed(3);
    } });
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ var v = es[0].isIntersecting; if (v){ hum.play(); run.play(); } else { hum.pause(); run.pause(); } }).observe(dial);
    else { hum.play(); run.play(); }
  }
  /* ---------- the flight: pinned sideways (≥768) or a vertical rail (phones) ---------- */
  var hudN = $('[data-hud-n]'), hudL = $('[data-hud-l]'), countN = $('[data-count-n]');
  var pts = [], len = 0, st = null, wide = false, lastK = -2, CARD_TOP = 200, pinOver = 0, routeSec = $('.section_process-route'), trackW = 0, landed = false, lastBurst = 0, D = 240;
  function layout(){
    if (!track) return;
    wide = innerWidth > 767;
    wps.forEach(function(w, i){ w.style.left = w.style.top = ''; w.style.removeProperty('--ny'); if (nodes[i]) nodes[i].style.left = nodes[i].style.top = ''; });
    ship.style.transform = ship.style.top = '';
    dock.style.left = dock.style.top = ''; dock.style.removeProperty('--dock');
    track.style.height = '';
    if (!wide){ track.style.width = ''; trackW = 0; if (dockPl) dockPl.style.setProperty('--sz', dockPl.getBoundingClientRect().width + 'px'); return; }
    // fit the pinned flight to the viewport: the path band above the cards shrinks (200 → 140px) so every card shows
    // whole; on very short screens the pin starts a little later (the heading slides up, the cards stay in view)
    var tallest = 0; wps.forEach(function(w){ tallest = Math.max(tallest, w.offsetHeight); });
    var above = routeSec ? track.getBoundingClientRect().top - routeSec.getBoundingClientRect().top : 0;
    CARD_TOP = Math.round(Math.max(140, Math.min(200, innerHeight - 28 - above - tallest)));
    pinOver = Math.max(0, Math.round(above + CARD_TOP + tallest + 28 - innerHeight));
    track.style.height = (CARD_TOP + tallest + 40) + 'px';
    var f = CARD_TOP / 200;
    var step = Math.max(380, innerWidth * .3), x0 = Math.min(260, innerWidth * .18), h = track.offsetHeight;
    // the finale: last card on the left of the screen, the destination planet right of center at 58% (was 70%: it sat far right)
    var lastX = x0 + step * (wps.length - 1) + step * .35, viewL = lastX - 72, W = viewL + innerWidth - 40;
    D = Math.round(Math.max(150, Math.min(280, innerWidth * .2, h - 190)));
    var xp = viewL + innerWidth * .58, dTop = Math.max(10, Math.round((h - D - 130) / 2)), yc = dTop + D / 2;
    dock.style.setProperty('--dock', D + 'px'); dock.style.left = Math.round(xp - 170) + 'px'; dock.style.top = dTop + 'px';
    if (dockPl) dockPl.style.setProperty('--sz', D + 'px');
    trackW = W; track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
    pts = [[x0 * .45, 110 * f]];
    wps.forEach(function(w, i){ pts.push([x0 + step * i + step * .35, (i % 2 ? 140 : 60) * f]); });
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++){ var p = pts[i - 1], q = pts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
    // final leg: descend to the destination and stop just short of its surface
    var q = pts[pts.length - 1], lx = xp - D / 2 - 18, mx2 = (q[0] + lx) / 2;
    d += ' C' + mx2 + ' ' + q[1] + ' ' + mx2 + ' ' + yc + ' ' + lx + ' ' + yc;
    line.setAttribute('d', d); lit.setAttribute('d', d); len = line.getTotalLength();
    lit.style.strokeDasharray = len; lit.style.strokeDashoffset = len;
    pad.style.left = pts[0][0] + 'px'; pad.style.top = pts[0][1] + 'px';
    wps.forEach(function(w, i){
      var p = pts[i + 1];
      w.style.left = (p[0] - 48) + 'px'; w.style.top = CARD_TOP + 'px'; w.style.setProperty('--ny', (p[1] - CARD_TOP) + 'px');
      if (nodes[i]){ nodes[i].style.left = '48px'; nodes[i].style.top = (p[1] - CARD_TOP) + 'px'; }
    });
  }
  function fly(prog){
    if (!wide || !len) return;
    var at = Math.max(0, Math.min(1, prog)) * len, p = line.getPointAtLength(at), p2 = line.getPointAtLength(Math.min(len, at + 2));
    ship.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) rotate(' + (Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI) + 'deg)';
    lit.style.strokeDashoffset = len - at;
    var k = -1; pts.slice(1).forEach(function(q, i){ if (p.x >= q[0] - 4) k = i; });
    stage(k);
    land(at >= len - 2);
  }
  function land(on){
    if (on === landed) return; landed = on;
    dock.classList.toggle('is-landed', on); ship.classList.toggle('is-landed', on); if (on && AB.quest) AB.quest('touchdown');
    if (hudL) hudL.textContent = on ? 'Touchdown' : lastK < 0 ? 'On the pad' : (STAGE_CODES[lastK] || '') + (lastK === wps.length - 1 ? ' · liftoff' : '');
    if (on && Date.now() - lastBurst > 1500){ lastBurst = Date.now(); burst(); }
  }
  // confetti in the mission's colors + a shockwave ring (CSS); skipped for reduced motion
  function burst(){
    var b = $('.abp-burst', dock); if (!b || reduce || !hasGsap) return;
    b.innerHTML = '';
    var cols = sel.map(function(k){ return DEST[k] ? DEST[k].c : ''; }).filter(Boolean).concat(['#FF6A3D', '#F2F0EA']);
    for (var n = 0; n < 34; n++){
      var sp = document.createElement('i'); sp.style.background = cols[n % cols.length]; if (n % 3 === 0) sp.className = 'is-strip';
      b.appendChild(sp);
      var a = Math.random() * Math.PI * 2, r = D * (.6 + Math.random() * .7);
      gsap.fromTo(sp, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 },
        { x: Math.cos(a) * r, y: Math.sin(a) * r * .8 + D * .25, rotation: Math.random() * 540 - 270, opacity: 0, scale: .4, duration: 1.2 + Math.random() * .7, ease: 'power3.out', delay: Math.random() * .12 });
    }
    setTimeout(function(){ if (!landed) b.innerHTML = ''; }, 2200);
  }
  function stage(k){
    if (k === lastK) return; lastK = k;
    wps.forEach(function(w, i){ w.classList.toggle('is-on', i <= k); if (nodes[i]) nodes[i].classList.toggle('is-on', i <= k); });
    var t = wps.length - (k + 1);
    if (hudN) hudN.textContent = 'T−' + t;
    if (hudL) hudL.textContent = k < 0 ? 'On the pad' : (STAGE_CODES[k] || '') + (k === wps.length - 1 ? ' · liftoff' : '');
    if (countN) countN.textContent = t;
  }
  function build(){
    if (!track) return;
    if (st){ st.kill(); st = null; if (hasGsap) gsap.set(track, { x: 0 }); }
    layout();
    if (!hasGsap || !window.ScrollTrigger) return;
    if (wide){
      var dist = function(){ return (trackW || track.scrollWidth) - innerWidth + 40; };
      st = ScrollTrigger.create({ trigger: '.section_process-route', start: function(){ return 'top+=' + pinOver + ' top'; }, end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
        onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); fly(self.progress * 1.02); } });
      fly(0);
    } else {
      st = ScrollTrigger.create({ trigger: track, start: 'top 60%', end: 'bottom 80%', scrub: true,
        onUpdate: function(self){ ship.style.top = (self.progress * (track.offsetHeight - 40)) + 'px';
          var k = -1, mid = innerHeight * .6; wps.forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); stage(k); land(self.progress > .97); } });
    }
  }
  // desktop re-fits on height changes too; phones ignore them (the URL bar resizes the viewport while scrolling)
  var rsT, lastW = innerWidth, lastH = innerHeight;
  addEventListener('resize', function(){ if (innerWidth === lastW && (!wide || innerHeight === lastH)) return; lastW = innerWidth; lastH = innerHeight; clearTimeout(rsT); rsT = setTimeout(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250); });

  /* ---------- crew: boxes tick in as the lists scroll into view ---------- */
  /* ---------- crew: a satellite on orbit above the two cards. When it passes over a card it drops a signal cone,
     the card's edge lights and its checklist re-ticks. Drag it and it springs back to its orbit. The comms bar gets
     a live waveform. Paused off screen ---------- */
  (function(){
    var link = $('.ab_crew_link'), grid = link && link.parentNode, bar = $('.ab_crew_comms'); if (!link) return;
    var cols = $$('.ab_crew_col', grid);
    var orbit = document.createElement('div'); orbit.className = 'abp-sat-orbit'; orbit.setAttribute('aria-hidden', 'true');
    orbit.innerHTML = '<div class="abp-sat"><span class="abp-sat-cone"></span><svg class="sat-ico " viewBox="0 0 24 12" aria-hidden="true"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg></div>';
    grid.appendChild(orbit); grid.classList.add('has-sat');
    var sat = $('.abp-sat', orbit), cone = $('.abp-sat-cone', orbit);
    function ping(col){
      col.classList.remove('is-ping'); void col.offsetWidth; col.classList.add('is-ping');
      var lis = $$('.ab_crew_item', col);
      lis.forEach(function(li, i){ li.classList.remove('is-on'); setTimeout(function(){ li.classList.add('is-on'); }, 140 + 110 * i); });
    }
    if (!hasGsap || reduce){ sat.style.left = '50%'; return; }
    // the orbit: glides back and forth across the section (easing at each end, always on screen) with a slow bob and
    // roll; a card is pinged each time the satellite crosses its middle, in either direction
    var o = { p: 0 }, dragging = false, hit = [], W = 0;
    function measure(){ W = grid.clientWidth; }
    // width can read 0 at startup (layout not settled yet), so re-measure on view and fall back to a live read
    function posX(p){ if (!W) measure(); return 8 + Math.max(0, W - 84 - 16) * p; } // 84 = satellite width
    // phones: the cards stack, so the satellite (smaller) travels down the right side from above the first card to
    // the gap above the second, and back; each card is pinged at its stop
    var mq = window.matchMedia ? matchMedia('(max-width: 767px)') : null;
    function stacked(){ return !!(mq && mq.matches); }
    function pos(p){ if (!stacked()) return [posX(p), 0]; if (!W) measure(); return [Math.max(0, W - 60 - 12), (cols[1] ? cols[1].offsetTop : 0) * p]; } // 60 = phone satellite width
    measure(); addEventListener('resize', measure);
    var loop = gsap.to(o, { p: 1, duration: 10, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true, onRepeat: function(){ hit = []; }, onUpdate: function(){
      if (dragging) return;
      var xy = pos(o.p), x = xy[0], st = stacked(), y = xy[1] + Math.sin(o.p * Math.PI * 4) * (st ? 4 : 6), rot = Math.sin(o.p * Math.PI * 2) * 6;
      gsap.set(sat, { x: x, y: y, rotation: rot });
      cols.forEach(function(col, i){
        var mid = col.offsetLeft + col.offsetWidth / 2, near = st ? (i === 0 ? o.p < .04 : o.p > .96) : Math.abs(x + 42 - mid) < col.offsetWidth * .28;
        if (near && !hit[i]){ hit[i] = true; ping(col); cone.classList.add('is-on'); setTimeout(function(){ cone.classList.remove('is-on'); }, 1400); }
      });
    } });
    if (window.Draggable){
      Draggable.create(sat, { type: 'x,y', bounds: grid.parentNode, inertia: !!window.InertiaPlugin,
        onPress: function(){ dragging = true; cone.classList.remove('is-on'); },
        onRelease: function(){ var d = this; gsap.delayedCall(.6, function(){ gsap.to(sat, { x: pos(o.p)[0], y: pos(o.p)[1], rotation: 0, duration: 1.2, ease: 'elastic.out(1,.5)', onComplete: function(){ dragging = false; } }); }); } });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (es[0].isIntersecting){ measure(); loop.play(); } else loop.pause(); }).observe(grid);
    else loop.play();
  })();
  /* ---------- comms bar: the COMMS chip sits over a small signal scope (same look as the /contact signal line: dashed
     center line, a glowing wave that tapers at both ends, a packet riding it now and then); the updates run to the
     right. The scope steps through the service colors, one channel at a time. Runs only while on screen ---------- */
  (function(){
    var bar = $('.ab_crew_comms'); if (!bar) return;
    var lab = $('.ab_crew_comms-label', bar), items = Array.prototype.slice.call(bar.children).filter(function(n){ return n !== lab; });
    var l = document.createElement('div'); l.className = 'abp-comms-l';
    l.innerHTML = '<div class="abp-comms-top"><i class="abp-comms-dot" aria-hidden="true"></i><span class="abp-comms-ch" aria-hidden="true">CH <b>01</b></span></div>' +
      '<div class="abp-scope" aria-hidden="true"><svg viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="abp-scope-grid" d="M0 50 H1000"/><path class="abp-scope-wave" d="M0 50 H1000"/></svg><span class="abp-packet"></span></div>';
    var r = document.createElement('div'); r.className = 'abp-comms-r';
    items.forEach(function(n){ r.appendChild(n); });
    var topRow = l.firstChild; if (lab) topRow.insertBefore(lab, topRow.firstChild);
    bar.insertBefore(l, bar.firstChild); bar.appendChild(r); bar.classList.add('abp-comms');
    var wave = $('.abp-scope-wave', l), packet = $('.abp-packet', l), chN = $('.abp-comms-ch b', l);
    var CH = ['#FF6A3D', '#146EF5', '#5eead4', '#0AE448', '#7c5cff', '#ffd166'], ch = 0;
    l.style.setProperty('--ch', CH[0]);
    var N = 120, t = 0, bump = null, nextBump = 1.6, nextCh = 7, running = false, last = 0;
    function draw(){
      var d = '';
      for (var i = 0; i <= N; i++){
        var x = i / N * 1000, env = Math.sin(Math.PI * i / N);
        var y = 13 * env * (Math.sin(x * .031 + t * 2.2) + .45 * Math.sin(x * .083 - t * 3.3));
        if (bump) y += bump.a * Math.exp(-Math.pow((x - bump.x) / 40, 2)) * Math.sin(x * .12 - t * 14) * env;
        d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + (50 + y).toFixed(1);
      }
      wave.setAttribute('d', d);
    }
    function loop(now){
      if (!running) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now; t += dt;
      // a packet crosses every few seconds, dragging a bump in the wave with it
      if (!bump && t > nextBump) bump = { x: 0, a: 26 };
      if (bump){ bump.x += dt * 620; packet.style.left = (bump.x / 10) + '%'; packet.style.opacity = Math.min(1, Math.sin(Math.PI * Math.min(1, bump.x / 1000)) * 1.6).toFixed(2);
        if (bump.x > 1000){ bump = null; packet.style.opacity = 0; nextBump = t + 2.8 + Math.random() * 2.4; } }
      if (t > nextCh){ ch = (ch + 1) % CH.length; l.style.setProperty('--ch', CH[ch]); if (chN) chN.textContent = '0' + (ch + 1); nextCh = t + 7; }
      draw();
      requestAnimationFrame(loop);
    }
    function go(on){ if (on === running) return; running = on; last = 0; if (on) requestAnimationFrame(loop); }
    if (reduce){ draw(); return; }
    var vis = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis = es[0].isIntersecting; go(vis && !document.hidden); }).observe(bar);
    document.addEventListener('visibilitychange', function(){ go(vis && !document.hidden); });
    go(true);
  })();
  // the Crew card (you) is one of a kind: an aurora border in the service colors that drifts slowly, starting at a
  // different angle for every visitor, a soft wash and a gradient checklist
  var youCard = $$('.ab_crew_col')[1];
  if (youCard){ youCard.classList.add('abp-you'); youCard.style.setProperty('--you-d', '-' + (Math.random() * 18).toFixed(2) + 's'); }

  $$('.ab_crew_tick').forEach(function(t){ t.innerHTML = '<svg viewBox="0 0 12 12"><path d="M1.5 6.5l3 3 6-7"/></svg>'; });
  $$('.ab_crew_col').forEach(function(col){
    var lis = $$('.ab_crew_item', col);
    if (reduce || !('IntersectionObserver' in window)){ lis.forEach(function(li){ li.classList.add('is-on'); }); return; }
    var io = new IntersectionObserver(function(es){ if (!es[0].isIntersecting) return; io.disconnect(); lis.forEach(function(li, i){ setTimeout(function(){ li.classList.add('is-on'); }, 160 * i); }); }, { threshold: .4 });
    io.observe(col);
  });

  /* ---------- launch form: destination chips (Webflow Forms posts it) ---------- */
  // multi-select: the first pick is the main destination; up to 3 here, "More than three" opens a field for the rest
  var KS_KEY = 'ab:ks', ks = false, ksChip = null, ksField = null, ksSat = null;
  try { ks = localStorage.getItem(KS_KEY) === '1'; } catch (e){}
  var KS_ICON = '<svg class="sat-ico abp-ks-ico" viewBox="0 0 24 12" aria-hidden="true"><path class="sp" d="M1 3.5h6v5H1zM17 3.5h6v5h-6z"/><path class="sa" d="M7 6h3M14 6h3"/><rect class="sb" x="10" y="2.5" width="4" height="7"/></svg>';
  // the satellite follows the main destination (moved into its counter-rotating layer, so it stays upright)
  function toggleKs(from){
    ks = !ks; try { localStorage.setItem(KS_KEY, ks ? '1' : ''); } catch (e){}
    syncKs(); if (toast) toast(ks ? 'Add-on · KNS · Knowledge system' : 'Add-on removed');
    if (from && hasGsap && !reduce) gsap.fromTo(from, { scale: .92 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)', clearProps: 'scale' });
  }
  function syncKs(){
    if (ksChip) ksChip.setAttribute('aria-pressed', ks ? 'true' : 'false');
    if (chartSat){ chartSat.setAttribute('aria-pressed', ks ? 'true' : 'false'); chartSat.classList.toggle('is-on', ks); var stt = $('.abp-kssat-state', chartSat); if (stt) stt.textContent = ks ? 'Add-on · on' : '+ Add-on'; }
    if (ksField) ksField.value = ks ? 'KNS · Knowledge system' : '';
    if (!dests.length) return;
    if (!ksSat){ ksSat = document.createElement('span'); ksSat.className = 'abp-ks'; ksSat.setAttribute('aria-hidden', 'true'); ksSat.innerHTML = '<span class="abp-ks-orb">' + KS_ICON + '</span>'; }
    var host = $('.abp-counter', dests[sel[0]]); if (host && ksSat.parentNode !== host) host.appendChild(ksSat);
    ksSat.classList.toggle('is-on', ks);
    // the flight plan cards carry a small KNS flag while the add-on rides along
    $$('.ab_route_card-top').forEach(function(top){
      var f = $('.abp-ks-flag', top);
      if (!f){ f = document.createElement('span'); f.className = 'abp-ks-flag'; f.title = 'KNS · Knowledge system rides along'; f.innerHTML = KS_ICON + 'KNS'; top.insertBefore(f, top.lastElementChild); }
      f.hidden = !ks;
    });
    // touchdown: the same satellite orbits the landed planet when the add-on rides along
    var dsys = $('.abp-dock-sys');
    if (dsys){
      var dks = $('.abp-dock-ks', dsys);
      if (!dks){ dks = document.createElement('div'); dks.className = 'abp-dock-ks'; dks.innerHTML = '<i>' + KS_ICON + '</i>'; dsys.appendChild(dks); }
      dks.classList.toggle('is-on', ks);
    }
  }
  var chips = $('[data-chips]'), moreBox = $('[data-more]'), moreChip = null;
  if (chips && DEST.length){
    chips.innerHTML = DEST.map(function(d, i){ return '<button type="button" class="abp-chip" data-i="' + i + '" aria-pressed="false" style="--c:' + d.c + '"><i aria-hidden="true"></i>' + esc(d.short) + '<span class="abp-chip-main">Main</span></button>'; }).join('') +
      (moreBox ? '<button type="button" class="abp-chip is-more" aria-pressed="false" aria-controls="abpMore">+ More than three</button>' : '');
    $$('.abp-chip[data-i]', chips).forEach(function(b){ b.addEventListener('click', function(){
      var i = +b.getAttribute('data-i'), at = sel.indexOf(i);
      if (at > -1){
        if (sel.length < 2){ if (toast) toast('Keep at least one destination'); return; }
        sel.splice(at, 1); render(false, 'Stop removed · ' + DEST[i].short); return;
      }
      if (sel.length >= MAX_STOPS){ setMore(true); if (toast) toast('Three stops max here · list the rest below'); return; }
      sel.push(i); render(false, 'Stop added · ' + DEST[i].short);
    }); });
    moreChip = $('.abp-chip.is-more', chips);
    // the Knowledge System add-on (same as the Home planner): rides along with any route, drawn as a satellite
    // circling the main destination on the star chart; posted in its own "Add-ons" field
    var ksRow = document.createElement('div'); ksRow.className = 'abp-addons';
    ksRow.innerHTML = '<span class="abp-addon-label">Add-on</span><button type="button" class="abp-chip is-addon" data-ks="" aria-pressed="false" style="--c:#FFD29A">' + KS_ICON + 'KNS · Knowledge system</button>';
    chips.parentNode.insertBefore(ksRow, chips.nextSibling);
    ksChip = $('[data-ks]', ksRow);
    var fm = chips.closest('form');
    if (fm && !$('input[name="Add-ons"]', fm)){ ksField = document.createElement('input'); ksField.type = 'hidden'; ksField.name = 'Add-ons'; ksField.value = ''; fm.appendChild(ksField); }
    ksChip.addEventListener('click', function(){ toggleKs(ksChip); });
    if (moreChip) moreChip.addEventListener('click', function(){ setMore(moreChip.getAttribute('aria-pressed') !== 'true'); });
  }
  function setMore(on){
    if (!moreBox || !moreChip) return;
    moreChip.setAttribute('aria-pressed', on ? 'true' : 'false'); moreBox.hidden = !on;
    if (on){ var ta = $('textarea', moreBox); if (ta) setTimeout(function(){ ta.focus(); }, 50); }
  }
  function syncForm(){
    $$('.abp-chip[data-i]').forEach(function(b){
      var at = sel.indexOf(+b.getAttribute('data-i'));
      b.setAttribute('aria-pressed', at > -1 ? 'true' : 'false'); b.classList.toggle('is-main', at === 0 && sel.length > 1);
    });
    syncKs();
    var field = $('[data-dest-field]');
    if (field) field.value = sel.map(function(k, n){ return DEST[k].name + (n === 0 && sel.length > 1 ? ' (main)' : ''); }).join(', ');
  }
  var form = $('.ab_launch_form form');
  // budget bands = the pricing tiers (same list as the Home planner in home/50-planner.js). The Designer embed
  // (webflow/build/process/form-fields.embed.html) carries the same options; this keeps an older embed in line.
  (function(){
    var bs = form && $('select[name="Budget"]', form); if (!bs) return;
    var B = ['Under $6.5k', '$6.5–12k', '$12–22k', '$22–40k', '$40k+', 'Not sure yet · still scouting'];
    if ([].map.call(bs.options, function(o){ return o.text; }).join('|') !== B.join('|')){
      bs.innerHTML = B.map(function(b, i){ return '<option' + (i === 2 ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('');
    }
    if (!$('.abp-est', form)){ var n = document.createElement('span'); n.className = 'abp-fl abp-est'; n.style.cssText = 'margin:8px 0 0;text-transform:none;letter-spacing:.04em'; n.textContent = 'Estimates only. Your quote is fixed once we scope the project together.'; bs.parentNode.appendChild(n); }
  })();
  if (form){
    var panel = $('.ab_launch_form'), rk = document.createElement('div'); rk.className = 'abp-rocket'; rk.setAttribute('aria-hidden', 'true');
    rk.innerHTML = '<svg viewBox="0 0 40 80"><path d="M20 2 C30 14 32 34 30 52 H10 C8 34 10 14 20 2 Z" fill="#F2F0EA"/><circle cx="20" cy="26" r="5" fill="#4C8DFF"/><path d="M10 44 L2 60 L10 56 Z M30 44 L38 60 L30 56 Z" fill="#8A8FA3"/><path d="M13 54 L20 78 L27 54 Z" fill="#FF6A3D"/></svg>';
    panel.appendChild(rk);
    // missing data: core/43-validate (inline line per field + a summary above the button); an invalid submit stops here,
    // before Webflow's handler (delegated on document) ever sees it
    var fq = function(n){ return form.querySelector('[name="' + n + '"]'); }, pBtn = $('[type="submit"]', form);
    var chk = AB.formCheck && AB.formCheck(form, { btn: pBtn, at: pBtn, rules: [
      { el: fq('Name'), name: 'name', need: 'Add your name so I know who’s calling.' },
      { el: fq('Email'), name: 'email', need: 'I need an email to radio back.', bad: 'That email looks off. Mind checking it?' }
    ] });
    form.addEventListener('submit', function(e){
      if (chk && !chk.ok()){ e.preventDefault(); e.stopPropagation(); return; }
      // let Webflow post it; the rocket is decoration
      var rocket = $('.abp-rocket'); if (!rocket || reduce || !hasGsap) return;
      gsap.timeline().set(rocket, { opacity: 1, y: 0 }).to(rocket, { y: -form.offsetHeight - 160, duration: 1.1, ease: 'power2.in' }).set(rocket, { opacity: 0 });
    });
  }

  // hero countdown: it lets the pointer through to the planet behind it, so :hover never fires; show its Figma frame
  // when the pointer is over its box instead (not while something is being dragged)
  var cnt = $('.ab_count[data-selectable]'), heroSec = $('.section_process-hero');
  if (cnt && heroSec && window.matchMedia && matchMedia('(hover: hover)').matches){
    heroSec.addEventListener('pointermove', function(e){
      var r = cnt.getBoundingClientRect(), on = !e.buttons && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (on !== cnt.classList.contains('is-hover')){
        cnt.classList.toggle('is-hover', on);
        var sz = on && $('.sel-size', cnt); if (sz && !cnt.getAttribute('data-size')) sz.textContent = Math.round(cnt.offsetWidth) + ' × ' + Math.round(cnt.offsetHeight);
        if (AB.tip){ if (on) AB.tip.show(cnt); else AB.tip.hide(cnt); }
      }
    });
    heroSec.addEventListener('pointerleave', function(){ cnt.classList.remove('is-hover'); if (AB.tip) AB.tip.hide(cnt); });
  }

  // restore the last mission silently (no scramble, no toast)
  if (DEST.length) render(true);
  else eta(true);
  setTimeout(build, 60);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });

});
