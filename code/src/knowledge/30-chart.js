  /* ---------- star chart geometry (shared by /topics and the topic page mini-map) ---------- */
  var CENTER = { who: [200, 215], what: [650, 190], how: [1080, 225], watch: [205, 595], ideas: [690, 610], known: [1070, 590] };
  // each constellation has its own figure: star slots [dx, dy] in the order topics fill them + the lines between slots.
  // A line only draws when both of its stars exist, so a 3-star constellation still reads as its shape.
  var FIG = {
    who: { n: 'dipper', p: [[-10, -8], [108, -20], [118, 70], [0, 84], [-78, -44], [-148, -74]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5]], s: ['T', 'R', 'R', 'B', 'T', 'L'] },
    what: { n: 'cassiopeia', p: [[-140, -45], [-72, 58], [-5, -22], [66, 66], [138, -52], [30, -100]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]], s: ['L', 'B', 'R', 'B', 'R', 'R'] },
    how: { n: 'cross', p: [[0, 0], [-128, -12], [122, -22], [4, -100], [-6, 104], [-150, 52]], e: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5]], s: ['R', 'L', 'R', 'R', 'R', 'L'] },
    watch: { n: 'zigzag', p: [[-160, 82], [-88, -58], [-22, 38], [40, -70], [100, 38], [150, -55]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]], s: ['B', 'T', 'B', 'T', 'B', 'T'] },
    ideas: { n: 'loop', p: [[-128, 30], [-86, -62], [8, -92], [104, -54], [128, 40], [10, 92]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]], s: ['L', 'L', 'T', 'R', 'R', 'B'] },
    known: { n: 'arrowhead', p: [[118, -4], [-2, -92], [8, 88], [-42, -2], [-148, 4], [-112, -64]], e: [[0, 1], [0, 2], [0, 3], [3, 4], [4, 5]], s: ['R', 'R', 'R', 'B', 'L', 'L'] }
  };
  // seeded jitter per constellation: hand-drawn feel, identical on every visit
  var jsd = 11; function jr(){ jsd = (jsd * 16807) % 2147483647; return jsd / 2147483647 - .5; }
  Object.keys(FIG).forEach(function(k){ FIG[k].p.forEach(function(s){ s[0] = Math.round(s[0] + jr() * 22); s[1] = Math.round(s[1] + jr() * 18); }); });
  var POS = {}, SIDE = {}, SLOT = {};
  CATS.forEach(function(c){
    var fg = FIG[c.key], cx = CENTER[c.key];
    TOPICS.filter(function(t){ return t.cat === c.key; }).forEach(function(t, i){
      // more than six stars: extra ones sit just outside the figure (it never breaks, it just grows)
      var s = fg.p[i % fg.p.length], ring = Math.floor(i / fg.p.length), k = 1 + ring * .35;
      POS[t.slug] = [cx[0] + s[0] * k, cx[1] + s[1] * k]; SLOT[t.slug] = i;
      SIDE[t.slug] = ring ? (s[0] < 0 ? 'L' : 'R') : fg.s[i]; // label side per slot: L / R / T(op) / B(ottom)
    });
  });
  var XL = [];
  OBS.forEach(function(x){ for (var i = 0; i < x.topics.length; i++) for (var j = i + 1; j < x.topics.length; j++){ var a = x.topics[i], b = x.topics[j]; if (!POS[a] || !POS[b]) continue; var k = a < b ? a + '|' + b : b + '|' + a; if (XL.indexOf(k) < 0) XL.push(k); } });
  // label anchor for a star at x,y with radius r: [x, y, text-anchor]
  function lbl(x, y, r, side, gap){ gap = gap || 9; return side === 'T' ? [x, y - r - gap + 1, 'middle'] : side === 'B' ? [x, y + r + gap + 9, 'middle'] : side === 'R' ? [x + r + gap, y + 4, 'start'] : [x - r - gap, y + 4, 'end']; }
  function starR(t){ return 3 + Math.sqrt(links(t)) * 1.7; }
  // the constellation's figure as one path (segments between the stars that exist), optionally re-centered
  function consPath(key, dx, dy){
    var ts = TOPICS.filter(function(t){ return t.cat === key && POS[t.slug]; }), at = {}, d = '';
    ts.forEach(function(t){ at[SLOT[t.slug]] = POS[t.slug]; });
    FIG[key].e.forEach(function(e){ var a = at[e[0]], b = at[e[1]]; if (a && b) d += 'M' + (a[0] - (dx || 0)) + ' ' + (a[1] - (dy || 0)) + ' L' + (b[0] - (dx || 0)) + ' ' + (b[1] - (dy || 0)) + ' '; });
    return d.trim();
  }

  if (VIEW === 'chart') (function(){
    var mount = $('[data-ks-chart]'); if (!mount || !TOPICS.length) return;
    // the grid is a tiling pattern over a huge rect, so it never ends when the view is panned past the chart
    var g = '<defs><filter id="abKsGlow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="5"/></filter><pattern id="abKsGrid" width="100" height="90" patternUnits="userSpaceOnUse"><path class="gp" d="M100 0H0V90"/></pattern></defs>' +
      '<g class="grid"><rect x="-5000" y="-4000" width="11400" height="8800" fill="url(#abKsGrid)"/><circle cx="660" cy="390" r="230"/><circle cx="660" cy="390" r="440"/><circle cx="660" cy="390" r="760"/>';
    // faint background stars across the whole pannable area (deterministic, so every visit looks the same)
    var sd = 7; function rnd(){ sd = (sd * 16807) % 2147483647; return sd / 2147483647; }
    for (var bs = 0; bs < 260; bs++){ var bx = -1400 + rnd() * 4200, by = -700 + rnd() * 2200, br = rnd(); g += '<circle class="bg-st" cx="' + bx.toFixed(0) + '" cy="' + by.toFixed(0) + '" r="' + (br < .85 ? .8 : 1.4) + '" opacity="' + (.15 + rnd() * .35).toFixed(2) + '"/>'; }
    g += '</g>';
    var xl = XL.map(function(k){ var p = k.split('|'), a = POS[p[0]], b = POS[p[1]], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 40;
      return '<path class="xl" data-a="' + p[0] + '" data-b="' + p[1] + '" d="M' + a.join(' ') + ' Q' + mx + ' ' + my + ' ' + b.join(' ') + '"/>'; }).join('');
    // each constellation: a faint nebula in its color, the figure, then a title plate centered above it
    // (mono code line with a diamond + star count, the name with a soft glow, bracket rule sized to the name after render)
    var cons = CATS.map(function(c){
      var ts = TOPICS.filter(function(t){ return t.cat === c.key && POS[t.slug]; }); if (!ts.length) return '';
      var ys = ts.map(function(t){ return POS[t.slug][1]; }), top = Math.min.apply(null, ys), cx = CENTER[c.key], ty = top - 40;
      return '<g data-cat="' + c.key + '" data-fig="' + FIG[c.key].n + '"><path class="cl" d="' + consPath(c.key) + '"/>' +
        '<g class="ct" transform="translate(' + cx[0] + ' ' + ty + ')"><path class="cb" d=""/><text class="cc" y="-32" text-anchor="middle">◆ ' + c.code + ' · ' + pad2(c.i + 1) + ' · ' + pad2(ts.length) + ' STARS</text>' +
        '<text class="cn cn-g" text-anchor="middle" aria-hidden="true">' + esc(c.name) + '</text><text class="cn" text-anchor="middle">' + esc(c.name) + '</text></g></g>';
    }).join('');
    // nebulae sit under everything (routes included); the gradient lives inside the group so its stops read --kc
    var nebs = CATS.map(function(c){ var cx = CENTER[c.key], id = 'abKsNb-' + c.key;
      return '<g class="nbg" data-cat="' + c.key + '"><radialGradient id="' + id + '"><stop class="nb0" offset="0"/><stop class="nb1" offset="1"/></radialGradient><ellipse class="nb" cx="' + cx[0] + '" cy="' + (cx[1] - 10) + '" rx="240" ry="170" fill="url(#' + id + ')"/></g>'; }).join('');
    var stars = TOPICS.filter(function(t){ return POS[t.slug]; }).map(function(t, i){
      var p = POS[t.slug], r = starR(t), L = lbl(p[0], p[1], r, SIDE[t.slug]);
      return '<a href="' + URL_T + t.slug + '" data-cat="' + t.cat + '" data-slug="' + t.slug + '" aria-label="' + esc(t.name) + ', ' + links(t) + ' links">' +
        '<circle class="st-h" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r * 3.2) + '"/><circle class="st-r" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (r + 5) + '"/>' +
        '<circle class="st' + (i % 3 ? '' : ' tw') + '" cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '"/>' +
        '<text class="tl" x="' + L[0] + '" y="' + L[1] + '" text-anchor="' + L[2] + '">' + esc(t.name) + '</text></a>';
    }).join('');
    mount.innerHTML = '<div class="ab_ks-chart" data-lenis-prevent-wheel=""><div class="ab_ks-chart_h"><span>Chart · ' + TOPICS.length + ' stars · ' + XL.length + ' shared-observation routes</span><span>Star size = <b>links</b> · dashed = <b>shares an observation</b></span></div>' +
      '<div class="ab_ks-map" data-ks-map=""><svg viewBox="-110 20 1510 760" role="img" aria-label="Star chart of ' + TOPICS.length + ' topics in six constellations">' + g + nebs + xl + cons + stars + '</svg></div>' +
      '<div class="ab_ks-read" data-ks-read="" data-lenis-prevent="" aria-live="polite"></div>' +
      '<div class="ab_ks-chart_f" role="group" aria-label="Fly to a constellation"><span class="ab_ks-chart_fl">Fly to</span>' + CATS.map(function(c){ return '<button type="button" class="ab_ks-chip is-cons" data-cat="' + c.key + '" aria-pressed="false"><b>' + c.code + '</b>' + esc(c.name) + '</button>'; }).join('') + '</div></div>';

    // size each title's brackets to its name (again once the display font lands, it's much wider than the fallback)
    function brackets(){ $$('.ct', mount).forEach(function(g){ var n = $('.cn:not(.cn-g)', g), hw = 0; try { hw = n.getComputedTextLength() / 2; } catch (x) {} if (!hw) return;
      $('.cb', g).setAttribute('d', 'M' + (-hw - 8) + ' -19H' + (-hw - 16) + 'V6H' + (-hw - 8) + 'M' + (hw + 8) + ' -19H' + (hw + 16) + 'V6H' + (hw + 8)); }); }
    brackets(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(brackets);
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
