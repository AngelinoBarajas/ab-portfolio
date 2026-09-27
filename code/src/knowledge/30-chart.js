  /* ---------- star chart geometry (shared by /topics and the topic page mini-map) ---------- */
  var CENTER = { who: [200, 200], what: [650, 180], how: [1090, 210], watch: [190, 590], ideas: [700, 600], known: [1130, 580] };
  // hand-placed star slots per constellation: [dx, dy, label side]
  var SHAPES = [[-120, -40, 'L'], [-10, -95, 'R'], [110, -30, 'R'], [80, 70, 'R'], [-30, 110, 'R'], [-130, 70, 'L']];
  var POS = {}, SIDE = {};
  CATS.forEach(function(c){
    TOPICS.filter(function(t){ return t.cat === c.key; }).forEach(function(t, i){
      var s = SHAPES[i % 6], cx = CENTER[c.key]; POS[t.slug] = [cx[0] + s[0], cx[1] + s[1]];
      SIDE[t.slug] = t.slug === 'philosophy-at-work' ? 'R' : s[2]; // one hand-tuned label (it collides with Reduced motion)
    });
  });
  var XL = [];
  OBS.forEach(function(x){ for (var i = 0; i < x.topics.length; i++) for (var j = i + 1; j < x.topics.length; j++){ var a = x.topics[i], b = x.topics[j]; if (!POS[a] || !POS[b]) continue; var k = a < b ? a + '|' + b : b + '|' + a; if (XL.indexOf(k) < 0) XL.push(k); } });
  function starR(t){ return 3 + Math.sqrt(links(t)) * 1.7; }
  function consPath(key, dx, dy){ var ts = TOPICS.filter(function(t){ return t.cat === key && POS[t.slug]; }); return ts.length ? 'M' + ts.map(function(t){ return (POS[t.slug][0] - (dx || 0)) + ' ' + (POS[t.slug][1] - (dy || 0)); }).join(' L') : ''; }

  if (VIEW === 'chart') (function(){
    var mount = $('[data-ks-chart]'); if (!mount || !TOPICS.length) return;
    // the grid is a tiling pattern over a huge rect, so it never ends when the view is panned past the chart
    var g = '<defs><pattern id="abKsGrid" width="100" height="90" patternUnits="userSpaceOnUse"><path class="gp" d="M100 0H0V90"/></pattern></defs>' +
      '<g class="grid"><rect x="-5000" y="-4000" width="11400" height="8800" fill="url(#abKsGrid)"/><circle cx="660" cy="390" r="230"/><circle cx="660" cy="390" r="440"/><circle cx="660" cy="390" r="760"/>';
    // faint background stars across the whole pannable area (deterministic, so every visit looks the same)
    var sd = 7; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; }
    for (var bs = 0; bs < 260; bs++){ var bx = -1400 + rnd() * 4200, by = -700 + rnd() * 2200, br = rnd(); g += '<circle class="bg-st" cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + (br < .85 ? .8 : 1.4) + '" opacity="' + (.15 + rnd() * .35).toFixed(2) + '"/>'; }
    g += '</g>';
    var xl = XL.map(function(k){ var p = k.split('|'), a = POS[p[0]], b = POS[p[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 40;
      return '<path class="xl" data-a="' + p[0] + '" data-b="' + p[1] + '" d="M' + a.join(' ') + ' Q' + mx + ' ' + my + ' ' + b.join(' ') + '"/>'; }).join('');
    var cons = CATS.map(function(c){
      var ys = TOPICS.filter(function(t){ return t.cat === c.key && POS[t.slug]; }).map(function(t){ return POS[t.slug][1]; }); if (!ys.length) return '';
      var top = Math.min.apply(null, ys), cx = CENTER[c.key];
      return '<g data-cat="' + c.key + '"><path class="cl" d="' + consPath(c.key) + '"/><text class="cc" x="' + (cx[0] - 150) + '" y="' + (top - 50) + '">' + c.code + ' · ' + pad2(c.i + 1) + '</text><text class="cn" x="' + (cx[0] - 150) + '" y="' + (top - 26) + '">' + esc(c.name) + '</text></g>';
    }).join('');
    var stars = TOPICS.filter(function(t){ return POS[t.slug]; }).map(function(t, i){
      var p = POS[t.slug], r = starR(t), right = SIDE[t.slug] === 'R';
      return '<a href="' + URL_T + t.slug + '" data-cat="' + t.cat + '" data-slug="' + t.slug + '" aria-label="' + esc(t.name) + ', ' + links(t) + ' links">' +
        '<circle class="st-h" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r * 3.2) + '"/><circle class="st-r" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r + 5) + '"/>' +
        '<circle class="st' + (i % 3 ? '' : ' tw') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>' +
        '<text class="tl" x="' + (p[0] + (right ? r + 9 : -(r + 9))) + '" y="' + (p[1] + 4) + '" text-anchor="' + (right ? 'start' : 'end') + '">' + esc(t.name) + '</text></a>';
    }).join('');
    mount.innerHTML = '<div class="ab_ks-chart" data-lenis-prevent-wheel=""><div class="ab_ks-chart_h"><span>Chart · ' + TOPICS.length + ' stars · ' + XL.length + ' shared-observation routes</span><span>Star size = <b>links</b> · dashed = <b>shares an observation</b></span></div>' +
      '<div class="ab_ks-map" data-ks-map=""><svg viewBox="-110 20 1510 760" role="img" aria-label="Star chart of ' + TOPICS.length + ' topics in six constellations">' + g + xl + cons + stars + '</svg></div>' +
      '<div class="ab_ks-read" data-ks-read="" data-lenis-prevent="" aria-live="polite"></div>' +
      '<div class="ab_ks-chart_f" role="group" aria-label="Fly to a constellation"><span class="ab_ks-chart_fl">Fly to</span>' + CATS.map(function(c){ return '<button type="button" class="ab_ks-chip is-cons" data-cat="' + c.key + '" aria-pressed="false"><b>' + c.code + '</b>' + esc(c.name) + '</button>'; }).join('') + '</div></div>';

    var map = $('[data-ks-map]', mount), read = $('[data-ks-read]', mount), links_ = $$('a', map), xls = $$('.xl', map), sel = null, lastType = 'mouse';
    function show(a){
      if (sel === a) return; sel = a;
      var t = TOPIC[a.getAttribute('data-slug')], c = CAT[t.cat], n = notesFor(t.slug), ms = misFor(t.slug), near = {};
      xls.forEach(function(l){ var on = l.getAttribute('data-a') === t.slug || l.getAttribute('data-b') === t.slug; l.classList.toggle('is-on', on); if (on){ near[l.getAttribute('data-a')] = 1; near[l.getAttribute('data-b')] = 1; } });
      links_.forEach(function(s){ s.classList.toggle('is-on', s === a); s.classList.toggle('is-near', !!near[s.getAttribute('data-slug')] && s !== a); });
      map.classList.add('is-dim');
      read.setAttribute('data-cat', t.cat);
      read.innerHTML = '<span class="ab_ks-read_c">' + c.code + ' · ' + esc(c.name) + '</span><h3 class="ab_ks-read_t">' + esc(t.name) + '</h3><p class="ab_ks-read_p">' + esc(t.def) + '</p>' +
        '<dl class="ab_ks-read_dl"><div><dt>Observed</dt><dd>' + pad2(n.length) + '</dd></div><div><dt>Missions</dt><dd>' + pad2(misCount(t)) + '</dd></div><div><dt>Services</dt><dd>' + pad2(t.services.length) + '</dd></div></dl>' +
        (n.length ? '<ul class="ab_ks-read_ul">' + n.slice(0, 3).map(function(x){ return '<li><i>' + esc(x.code) + '</i><a href="' + x.href + '">' + esc(x.name) + '</a></li>'; }).join('') + '</ul>' : '<p class="ab_ks-read_none">No observations on this one yet. It still tags missions and services.</p>') +
        btn(URL_T + t.slug, 'Open topic');
    }
    document.addEventListener('pointerdown', function(e){ lastType = e.pointerType || 'mouse'; }, true);
    links_.forEach(function(a){
      a.addEventListener('pointerenter', function(e){ if (e.pointerType !== 'touch') show(a); });
      a.addEventListener('focus', function(){ show(a); });
      // touch: first tap reads the star, the second opens it (a tap fires enter + leave too, so hover ignores touch)
      a.addEventListener('click', function(e){ if (lastType === 'touch' && sel !== a){ e.preventDefault(); show(a); } });
    });
    var top = links_.slice().sort(function(x, y){ return links(TOPIC[y.getAttribute('data-slug')]) - links(TOPIC[x.getAttribute('data-slug')]); })[0];
    if (top) show(top);

    /* ---------- pan + zoom: drag to pan, pinch or Ctrl/⌘ + wheel to zoom, +/−/reset buttons, double-click zooms in.
       Plain wheel still scrolls the page (the chart never traps it). Works on the SVG viewBox, so labels stay crisp. ---------- */
    var svg = $('svg', map), V0 = { x: -110, y: 20, w: 1510, h: 760 }, v = { x: V0.x, y: V0.y, w: V0.w, h: V0.h }, MAXZ = 4;
    var ui = document.createElement('div'); ui.className = 'ab_ks-zoom';
    ui.innerHTML = '<button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="reset" aria-label="Reset view">⟲</button><span class="ab_ks-zoom_z" aria-hidden="true">1.0×</span>';
    map.appendChild(ui);
    var hint = document.createElement('div'); hint.className = 'ab_ks-zoom_hint'; hint.textContent = (AB.coarse ? 'Drag to pan · pinch to zoom' : 'Drag to pan · Ctrl + scroll or double-click to zoom'); map.appendChild(hint);
    var zl = $('.ab_ks-zoom_z', ui);
    function clamp(){
      v.w = Math.max(V0.w / MAXZ, Math.min(V0.w, v.w)); v.h = v.w * V0.h / V0.w;
      // pan is free at any zoom, but at least ~40% of the chart stays in frame so you can't get lost in empty space
      v.x = Math.max(V0.x - v.w * .6, Math.min(V0.x + V0.w - v.w * .4, v.x)); v.y = Math.max(V0.y - v.h * .6, Math.min(V0.y + V0.h - v.h * .4, v.y));
    }
    function apply(){ clamp(); svg.setAttribute('viewBox', v.x.toFixed(1) + ' ' + v.y.toFixed(1) + ' ' + v.w.toFixed(1) + ' ' + v.h.toFixed(1)); var z = V0.w / v.w; zl.textContent = z.toFixed(1) + '×'; map.classList.toggle('is-zoomed', z > 1.01); map.classList.toggle('is-moved', z > 1.01 || Math.abs(v.x - V0.x) > 2 || Math.abs(v.y - V0.y) > 2); }
    // screen point → chart units
    function toChart(cx, cy){ var r = svg.getBoundingClientRect(); return { x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h, fx: (cx - r.left) / r.width, fy: (cy - r.top) / r.height }; }
    function zoomAt(f, cx, cy, animate){
      var p = cx == null ? { x: v.x + v.w / 2, y: v.y + v.h / 2, fx: .5, fy: .5 } : toChart(cx, cy);
      var nw = Math.max(V0.w / MAXZ, Math.min(V0.w, v.w / f)), nh = nw * V0.h / V0.w, to = { x: p.x - p.fx * nw, y: p.y - p.fy * nh, w: nw, h: nh };
      if (animate && hasGsap && !reduce){ gsap.to(v, { x: to.x, y: to.y, w: to.w, h: to.h, duration: .45, ease: 'power3.out', onUpdate: apply, overwrite: true }); }
      else { v.x = to.x; v.y = to.y; v.w = to.w; v.h = to.h; apply(); }
    }
    ui.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b) return; var z = b.getAttribute('data-z');
      if (z === 'reset'){ if (hasGsap && !reduce) gsap.to(v, { x: V0.x, y: V0.y, w: V0.w, h: V0.h, duration: .5, ease: 'power3.out', onUpdate: apply, overwrite: true }); else { v = { x: V0.x, y: V0.y, w: V0.w, h: V0.h }; apply(); } }
      else zoomAt(z === 'in' ? 1.6 : 1 / 1.6, null, null, true);
    });
    // Ctrl/⌘ + wheel and trackpad pinch (arrives as ctrl+wheel) zoom; plain wheel is left to the page
    map.addEventListener('wheel', function(e){ if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); e.stopPropagation(); zoomAt(Math.exp(-e.deltaY * .0025), e.clientX, e.clientY); }, { passive: false });
    map.setAttribute('data-lenis-prevent-wheel', '');
    map.addEventListener('dblclick', function(e){ e.preventDefault(); zoomAt(1.8, e.clientX, e.clientY, true); });
    // drag to pan (mouse, pen, one finger) + two-finger pinch; a drag never counts as a click on a star
    var pts = {}, start = null, moved = false, pinch = null;
    function count(){ return Object.keys(pts).length; }
    svg.addEventListener('pointerdown', function(e){
      if (e.button && e.button !== 0) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = false;
      if (count() === 1) start = { cx: e.clientX, cy: e.clientY, x: v.x, y: v.y };
      if (count() === 2){ var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]]; pinch = { d: Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)), w: v.w }; }
    });
    addEventListener('pointermove', function(e){
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (count() === 2 && pinch){
        var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]], d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        if (d > 0){ zoomAt(v.w / (pinch.w * pinch.d / d), (a.x + b.x) / 2, (a.y + b.y) / 2); moved = true; }
        return;
      }
      if (!start) return;
      var dx = e.clientX - start.cx, dy = e.clientY - start.cy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      if (!moved){ moved = true; map.classList.add('is-panning'); try { svg.setPointerCapture(e.pointerId); } catch (x) {} }
      var r = svg.getBoundingClientRect();
      v.x = start.x - dx / r.width * v.w; v.y = start.y - dy / r.height * v.h; apply();
    });
    function up(e){
      if (!pts[e.pointerId]) return; delete pts[e.pointerId];
      if (count() < 2) pinch = null;
      if (!count()){ start = null; map.classList.remove('is-panning'); }
    }
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
    // swallow the click that ends a drag, so panning over a star doesn't open it
    map.addEventListener('click', function(e){ if (moved){ e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    // keyboard: + / − / 0 while the chart has focus
    map.tabIndex = -1;

    /* ---------- legend chips: fly to a constellation (zoom in on it and read its best-linked star); again = reset ---------- */
    var chips = $$('.ab_ks-chart_f [data-cat]', mount);
    function flyTo(to){ if (hasGsap && !reduce) gsap.to(v, { x: to.x, y: to.y, w: to.w, h: to.h, duration: .8, ease: 'power3.inOut', onUpdate: apply, overwrite: true }); else { v.x = to.x; v.y = to.y; v.w = to.w; v.h = to.h; apply(); } }
    chips.forEach(function(b){
      b.addEventListener('click', function(){
        var key = b.getAttribute('data-cat'), on = b.getAttribute('aria-pressed') !== 'true';
        chips.forEach(function(x){ x.setAttribute('aria-pressed', x === b && on); });
        map.classList.toggle('is-focus', on); map.setAttribute('data-focus', on ? key : '');
        if (!on){ flyTo({ x: V0.x, y: V0.y, w: V0.w, h: V0.h }); return; }
        var c = CENTER[key], w = V0.w / 2.3, h = w * V0.h / V0.w;
        flyTo({ x: c[0] - w * .5 + 20, y: c[1] - h * .5 - 25, w: w, h: h });
        var best = links_.filter(function(a){ return a.getAttribute('data-cat') === key; }).sort(function(x, y){ return links(TOPIC[y.getAttribute('data-slug')]) - links(TOPIC[x.getAttribute('data-slug')]); })[0];
        if (best) show(best);
      });
    });
    // the reset button also clears the focused constellation
    ui.querySelector('[data-z="reset"]').addEventListener('click', function(){ chips.forEach(function(x){ x.setAttribute('aria-pressed', 'false'); }); map.classList.remove('is-focus'); map.setAttribute('data-focus', ''); });
    map.addEventListener('keydown', function(e){ if (e.key === '+' || e.key === '=') zoomAt(1.6, null, null, true); else if (e.key === '-') zoomAt(1 / 1.6, null, null, true); else if (e.key === '0') ui.querySelector('[data-z="reset"]').click(); });
  })();
