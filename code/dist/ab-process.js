/*! AB Portfolio · ab-process v0.8.1 · github.com/AngelinoBarajas/ab-portfolio */
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
  var DEST = $$('[data-dest-source] .w-dyn-item').map(function(it){
    function f(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; }
    var slug = f('slug');
    return {
      slug: slug, t1: f('title-1'), t2: f('title-2'), name: f('name'), short: f('short-name') || f('name'), sum: f('summary'), c: DOT[slug] || '#FF6A3D',
      p: [(f('planet-type') || 'gas').toLowerCase(), f('planet-colors'), f('planet-ring'), f('planet-glow') || 'transparent'],
      plan: [f('stage-1'), f('stage-2'), f('stage-3'), f('stage-4')].filter(Boolean),
      legs: [1, 2, 3, 4, 5, 6].map(function(n){ return f('process-leg-' + n); }),
      eta: (f('timeline-preset') || '1,1,1,1,1,1').split(',').map(function(v){ return Math.max(0, Math.min(2, parseInt(v, 10) || 0)); }),
      ex: f('example-slug') ? [f('example-slug'), f('example-name')] : null
    };
  }).filter(function(d){ return d.slug; });

  var cur = 0, KEY = 'ab:dest';
  try { var saved = localStorage.getItem(KEY); DEST.forEach(function(d, i){ if (d.slug === saved) cur = i; }); } catch (e){}

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
  var chart = $('[data-chart]'), ORB = [0.36, 0.52, 0.68, 0.84], dests = [];
  if (chart && DEST.length){
    ORB.forEach(function(r){ var o = document.createElement('span'); o.className = 'abp-orbit'; o.style.width = o.style.height = (r * 100) + '%'; chart.appendChild(o); });
    var spin = document.createElement('div'); spin.className = 'abp-spin'; chart.appendChild(spin);
    var step = 360 / DEST.length;
    DEST.forEach(function(d, i){
      var r = ORB[i % 4] / 2 * 100, a = (i * step + (i % 2 ? step * .45 : 0) - 90) * Math.PI / 180, s = [46, 52, 60, 66][i % 4];
      var b = document.createElement('button'); b.type = 'button'; b.className = 'abp-dest'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.setAttribute('aria-label', d.t1 + ' ' + d.t2); b.style.left = (50 + Math.cos(a) * r).toFixed(2) + '%'; b.style.top = (50 + Math.sin(a) * r).toFixed(2) + '%'; b.style.setProperty('--s', s + 'px');
      b.innerHTML = '<span class="abp-counter"><span class="abp-pl ab_planet"></span><span class="abp-sel" aria-hidden="true"></span><span class="abp-tag">' + esc(d.short) + '</span></span>';
      var pl = $('.abp-pl', b); planetAttrs(pl, d, 20 + i); if (AB.buildPlanet) AB.buildPlanet(pl);
      b.addEventListener('click', function(){ pick(i); });
      b.addEventListener('keydown', function(e){
        var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (!n) return;
        e.preventDefault(); var j = (cur + n + DEST.length) % DEST.length; pick(j); dests[j].focus();
      });
      spin.appendChild(b); dests.push(b);
    });
  }

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
  if (track){ track.insertBefore(svg, track.firstChild); track.appendChild(pad); track.appendChild(ship); if (AB.buildPlanet) AB.buildPlanet($('.abp-pad-pl', pad)); }

  /* ---------- pick a destination: everything re-plots ---------- */
  function pick(i, quiet){
    if (!DEST.length) return;
    cur = i; var d = DEST[i];
    try { localStorage.setItem(KEY, d.slug); } catch (e){}
    root.style.setProperty('--dest', d.c);
    dests.forEach(function(b, j){ b.classList.toggle('is-on', j === i); b.setAttribute('aria-checked', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    $$('.abp-chip').forEach(function(b, j){ b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    $$('[data-dest-short]').forEach(function(e){ e.textContent = d.short; });
    var field = $('[data-dest-field]'); if (field) field.value = d.name;
    var title = $('[data-dest-title]'); if (title) title.innerHTML = '<span class="ab_chart_title-a">' + esc(d.t1) + '</span> <span class="ab_chart_title-b t-outline">' + esc(d.t2) + '</span>';
    var sum = $('[data-dest-sum]'); if (sum && d.sum) sum.textContent = d.sum;
    var plan = $('[data-dest-plan]'); if (plan && d.plan.length) plan.innerHTML = d.plan.map(function(p, k){ return '<div class="ab_chart_plan-item"><div class="ab_chart_plan-no">Stage 0' + (k + 1) + '</div><div class="ab_chart_plan-name">' + esc(p) + '</div></div>'; }).join('');
    var link = $('[data-dest-link]'); if (link) link.href = '/services/' + d.slug;
    var hp = $('[data-process-planet]'); if (hp){ hp.setAttribute('data-label', 'Destination · ' + d.short); if (!quiet || i !== 0) repaint(hp, d, 11 + i); }
    wps.forEach(function(w, k){
      var lab = $('[data-leg-label]', w); if (lab) lab.textContent = 'For ' + d.short;
      var t = $('[data-leg]', w);
      if (t && d.legs[k]){
        if (quiet || reduce || !hasGsap || !window.ScrambleTextPlugin) t.textContent = d.legs[k];
        else gsap.to(t, { duration: .6, scrambleText: { text: d.legs[k], chars: 'lowerCase', speed: .6 }, delay: k * .04 });
      }
      var a = $('[data-flown]', w); if (!a) return;
      var what = a.getAttribute('data-flown-what') || 'it';
      if (d.ex){ a.classList.remove('is-none'); a.href = '/work/' + d.ex[0]; a.removeAttribute('aria-disabled'); a.textContent = 'See ' + what + ' · ' + d.ex[1] + ' →'; }
      else { a.classList.add('is-none'); a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.textContent = 'No mission flown here yet · yours could be first'; }
    });
    d.eta.forEach(function(v, f){ setFactor(f, v); });
    eta(quiet);
    if (!quiet && toast) toast('Course plotted · ' + d.t1 + ' ' + d.t2);
  }

  /* ---------- what moves the timeline ---------- */
  var segs = $$('.ab_eta_seg'), fv = segs.map(function(){ return 1; });
  var BUCKETS = $$('[data-eta-buckets] .ab_eta_bucket').map(function(b){ var t = $('.ab_eta_bucket-t', b), p = $('.ab_eta_bucket-p', b); return [t ? t.textContent : '', p ? p.textContent : '']; });
  var dial = $('[data-gauge]');
  if (dial) dial.innerHTML = '<svg viewBox="0 0 300 170"><path class="abp-arc" d="M30 150 A120 120 0 0 1 270 150"/><path class="abp-arc-on" d="M30 150 A120 120 0 0 1 270 150"/>' +
    '<g class="abp-needle"><line x1="150" y1="150" x2="150" y2="52"/><circle cx="150" cy="150" r="7"/></g>' +
    '<text class="abp-tickl" x="18" y="168">' + esc((BUCKETS[0] || ['Short hop'])[0]) + '</text><text class="abp-tickl" x="150" y="18" text-anchor="middle">' + esc((BUCKETS[1] || ['Standard orbit'])[0]) + '</text><text class="abp-tickl" x="282" y="168" text-anchor="end">Deep space</text></svg>';
  var arc = dial && $('.abp-arc-on', dial), needle = dial && $('.abp-needle', dial), arcLen = arc ? arc.getTotalLength() : 0;
  if (arc){ arc.style.strokeDasharray = arcLen; arc.style.strokeDashoffset = arcLen; }
  segs.forEach(function(seg, f){
    seg.setAttribute('data-factor', f);
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
      var on = fv.map(function(v, f){ return v === 2 ? '<span class="abp-add">+ ' + esc(names[f]) + '</span>' : ''; }).join('');
      adds.innerHTML = on || '<span class="abp-add is-none">Nothing stretching it</span>';
    }
    if (!arc) return;
    var rot = -90 + 180 * r; arc.style.strokeDashoffset = arcLen * (1 - Math.max(.04, r));
    if (instant || reduce || !hasGsap) needle.setAttribute('transform', 'rotate(' + rot + ' 150 150)');
    else gsap.to(needle, { rotation: rot, svgOrigin: '150 150', duration: .9, ease: 'elastic.out(1,.6)' });
  }

  /* ---------- the flight: pinned sideways (≥768) or a vertical rail (phones) ---------- */
  var hudN = $('[data-hud-n]'), hudL = $('[data-hud-l]'), countN = $('[data-count-n]');
  var pts = [], len = 0, st = null, wide = false, lastK = -2, CARD_TOP = 200;
  function layout(){
    if (!track) return;
    wide = innerWidth > 767;
    wps.forEach(function(w, i){ w.style.left = w.style.top = ''; w.style.removeProperty('--ny'); if (nodes[i]) nodes[i].style.left = nodes[i].style.top = ''; });
    ship.style.transform = ship.style.top = '';
    if (!wide){ track.style.width = ''; return; }
    var step = Math.max(380, innerWidth * .3), x0 = Math.min(260, innerWidth * .18), W = x0 + step * wps.length + innerWidth * .35, h = track.offsetHeight;
    track.style.width = W + 'px'; svg.setAttribute('width', W); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + h);
    pts = [[x0 * .45, 110]];
    wps.forEach(function(w, i){ pts.push([x0 + step * i + step * .35, i % 2 ? 140 : 60]); });
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++){ var p = pts[i - 1], q = pts[i], mx = (p[0] + q[0]) / 2; d += ' C' + mx + ' ' + p[1] + ' ' + mx + ' ' + q[1] + ' ' + q[0] + ' ' + q[1]; }
    d += ' S' + (W - 40) + ' 100 ' + W + ' 80';
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
      var dist = function(){ return track.scrollWidth - innerWidth + 40; };
      st = ScrollTrigger.create({ trigger: '.section_process-route', start: 'top top', end: function(){ return '+=' + dist(); }, pin: true, scrub: reduce ? true : .6, invalidateOnRefresh: true,
        onUpdate: function(self){ gsap.set(track, { x: -dist() * self.progress }); fly(self.progress * 1.02); } });
      fly(0);
    } else {
      st = ScrollTrigger.create({ trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: true,
        onUpdate: function(self){ ship.style.top = (self.progress * (track.offsetHeight - 40)) + 'px';
          var k = -1, mid = innerHeight * .6; wps.forEach(function(w, i){ if (w.getBoundingClientRect().top < mid) k = i; }); stage(k); } });
    }
  }
  var rsT, lastW = innerWidth;
  addEventListener('resize', function(){ if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rsT); rsT = setTimeout(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250); });

  /* ---------- crew: boxes tick in as the lists scroll into view ---------- */
  $$('.ab_crew_tick').forEach(function(t){ t.innerHTML = '<svg viewBox="0 0 12 12"><path d="M1.5 6.5l3 3 6-7"/></svg>'; });
  $$('.ab_crew_col').forEach(function(col){
    var lis = $$('.ab_crew_item', col);
    if (reduce || !('IntersectionObserver' in window)){ lis.forEach(function(li){ li.classList.add('is-on'); }); return; }
    var io = new IntersectionObserver(function(es){ if (!es[0].isIntersecting) return; io.disconnect(); lis.forEach(function(li, i){ setTimeout(function(){ li.classList.add('is-on'); }, 160 * i); }); }, { threshold: .4 });
    io.observe(col);
  });

  /* ---------- launch form: destination chips (Webflow Forms posts it) ---------- */
  var chips = $('[data-chips]');
  if (chips && DEST.length){
    chips.innerHTML = DEST.map(function(d, i){ return '<button type="button" class="abp-chip" data-i="' + i + '" aria-pressed="false" style="--c:' + d.c + '"><i aria-hidden="true"></i>' + esc(d.short) + '</button>'; }).join('');
    $$('.abp-chip', chips).forEach(function(b){ b.addEventListener('click', function(){ pick(+b.getAttribute('data-i')); }); });
  }
  var form = $('.ab_launch_form form');
  if (form){
    var panel = $('.ab_launch_form'), rk = document.createElement('div'); rk.className = 'abp-rocket'; rk.setAttribute('aria-hidden', 'true');
    rk.innerHTML = '<svg viewBox="0 0 40 80"><path d="M20 2 C30 14 32 34 30 52 H10 C8 34 10 14 20 2 Z" fill="#F2F0EA"/><circle cx="20" cy="26" r="5" fill="#4C8DFF"/><path d="M10 44 L2 60 L10 56 Z M30 44 L38 60 L30 56 Z" fill="#8A8FA3"/><path d="M13 54 L20 78 L27 54 Z" fill="#FF6A3D"/></svg>';
    panel.appendChild(rk);
    form.addEventListener('submit', function(){
      // let Webflow post it; the rocket is decoration
      var rocket = $('.abp-rocket'); if (!rocket || reduce || !hasGsap) return;
      gsap.timeline().set(rocket, { opacity: 1, y: 0 }).to(rocket, { y: -form.offsetHeight - 160, duration: 1.1, ease: 'power2.in' }).set(rocket, { opacity: 0 });
    });
  }

  // restore the last destination silently (no scramble, no toast)
  if (DEST.length) pick(cur, true);
  else eta(true);
  setTimeout(build, 60);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ build(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });

});
