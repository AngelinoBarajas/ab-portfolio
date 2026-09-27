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
    var g = '<g class="grid">';
    for (var gx = 0; gx <= 1400; gx += 100) g += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="780"/>';
    for (var gy = 0; gy <= 780; gy += 90) g += '<line x1="0" y1="' + gy + '" x2="1400" y2="' + gy + '"/>';
    g += '<circle cx="660" cy="390" r="230"/><circle cx="660" cy="390" r="440"/></g>';
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
    mount.innerHTML = '<div class="ab_ks-chart"><div class="ab_ks-chart_h"><span>Chart · ' + TOPICS.length + ' stars · ' + XL.length + ' shared-observation routes</span><span>Star size = <b>links</b> · dashed = <b>shares an observation</b></span></div>' +
      '<div class="ab_ks-map" data-ks-map=""><svg viewBox="-110 20 1510 760" role="img" aria-label="Star chart of ' + TOPICS.length + ' topics in six constellations">' + g + xl + cons + stars + '</svg></div>' +
      '<div class="ab_ks-read" data-ks-read="" aria-live="polite"></div>' +
      '<div class="ab_ks-chart_f">' + CATS.map(function(c){ return '<span data-cat="' + c.key + '">' + c.code + ' · ' + esc(c.name) + '</span>'; }).join('') + '</div></div>';

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
  })();
