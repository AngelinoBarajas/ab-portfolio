  /* ---------- topic index: group the native topic links ([data-ks-catwrap]) into the six constellations ---------- */
  (function(){
    var wrap = $('[data-ks-catwrap]'); if (!wrap) return;
    var links_ = $$('a[data-ks-t]', wrap); if (!links_.length) return;
    var cols = CATS.map(function(c){
      var ts = links_.filter(function(a){ return catKey(a.getAttribute('data-cat')) === c.key; });
      var box = document.createElement('div'); box.className = 'ab_ks-cat'; box.setAttribute('data-cat', c.key);
      box.innerHTML = '<div class="ab_ks-cat_h"><b>' + c.code + '</b><span>' + pad2(ts.length) + ' stars</span></div><h3 class="ab_ks-cat_t">' + esc(c.name) + '</h3><p class="ab_ks-cat_p">' + esc(c.blurb) + '</p><ul class="ab_ks-cat_ul"></ul>';
      var ul = $('ul', box);
      ts.forEach(function(a){
        var t = TOPIC[a.getAttribute('data-slug')], li = document.createElement('li');
        a.setAttribute('data-cat', c.key);
        var n = t ? (VIEW === 'chart' ? notesFor(t.slug).length + ' obs · ' + misCount(t) + ' missions' : links(t) + (links(t) === 1 ? ' link' : ' links')) : '';
        var meta = document.createElement('span'); meta.className = 'ab_ks-tlink_m'; meta.textContent = n;
        a.appendChild(meta); li.appendChild(a); ul.appendChild(li);
      });
      return box;
    });
    var grid_ = document.createElement('div'); grid_.className = 'ab_ks-cats';
    cols.forEach(function(c){ grid_.appendChild(c); });
    wrap.innerHTML = ''; wrap.appendChild(grid_);
    reveal(wrap);
  })();

  /* ---------- /observatory: ask box, stats, theme + topic filters over the native cards ---------- */
  if (VIEW === 'library') (function(){
    var gridEl = $('[data-ks-grid]'), cards = $$('[data-ks-card]'), items = cards.map(function(a){ return item(a); });
    var ask = $('[data-ks-ask]'), ctrl = $('[data-ks-ctrl]'), empty = $('[data-ks-empty]'), stats = $('[data-ks-hstats]');
    if (!gridEl || !cards.length) return;
    // newest first: the CMS list arrives oldest first (Sort field), so flip it; the readout toggle flips it back.
    // cards[] and items[] stay paired and in DOM order (apply() pairs them by index)
    var newest = true, itemBox = items[0].parentNode;
    function arrange(){ items.forEach(function(it){ itemBox.appendChild(it); }); }
    cards.reverse(); items.reverse(); arrange();
    // featured first card when nothing is filtered
    var nBN = OBS.filter(function(o){ return o.themeKey === 'build-notes'; }).length;
    var used = {}; OBS.forEach(function(o){ o.topics.forEach(function(s){ used[s] = (used[s] || 0) + 1; }); });
    var usedList = Object.keys(used).filter(function(s){ return TOPIC[s]; }).sort(function(a, b){ return used[b] - used[a] || TOPIC[a].name.localeCompare(TOPIC[b].name); });

    if (stats) stats.innerHTML = [['Observations', pad2(OBS.length)], ['Themes', '02'], ['Topics', pad2(TOPICS.length)], ['Constellations', '06']]
      .map(function(s){ return '<div class="ab_ks-hstat"><span>' + s[0] + '</span><b>' + s[1] + '</b></div>'; }).join('');
    if (ask) ask.innerHTML = '<div class="ab_ks-ask_h"><span>Ask the observatory</span><span><b data-ks-askn="">' + OBS.length + '</b> observations in range</span></div>' +
      '<div class="ab_ks-ask_row"><label for="ksQ" aria-hidden="true">&gt;</label><input id="ksQ" type="search" autocomplete="off" placeholder="What are you stuck on?" aria-label="Search the observatory"><button type="button" class="ab_ks-ask_x" data-ks-qx="" hidden>Clear</button></div>' +
      '<div class="ab_ks-ask_q" aria-label="Common questions"><button type="button" data-q="scroll">Why does my scroll stutter?</button><button type="button" data-q="3d">Will 3D slow my site down?</button><button type="button" data-q="schema">How do I add schema?</button><button type="button" data-q="scope">The project keeps growing</button></div>' +
      '<div class="ab_ks-ask_hit" data-ks-hit="" aria-live="polite"></div>';
    if (ctrl) ctrl.innerHTML = '<div class="ab_ks-tabs" role="group" aria-label="Theme"><button type="button" data-theme="all" aria-pressed="true">All <b>' + OBS.length + '</b></button><button type="button" data-theme="build-notes" aria-pressed="false">Build notes <b>' + nBN + '</b></button><button type="button" data-theme="why-before-how" aria-pressed="false">Why before how <b>' + (OBS.length - nBN) + '</b></button></div>' +
      '<div class="ab_ks-chips" role="group" aria-label="Topic">' + usedList.map(function(s, i){ return '<button type="button" class="ab_ks-chip' + (i > 7 ? ' is-more' : '') + '" data-cat="' + TOPIC[s].cat + '" data-topic="' + s + '" aria-pressed="false">' + esc(TOPIC[s].name) + ' <b>' + used[s] + '</b></button>'; }).join('') +
        (usedList.length > 8 ? '<button type="button" class="ab_ks-chip is-morebtn" data-ks-more="" aria-expanded="false">+ ' + (usedList.length - 8) + ' more topics</button>' : '') + '</div>' +
      '<div class="ab_ks-readout"><span>Showing <b data-ks-shown="">' + OBS.length + '</b> of ' + OBS.length + ' · filter <b data-ks-filt="">none</b></span><span class="ab_ks-readout_r"><button type="button" data-ks-sort="" aria-label="Sort: newest first. Switch to oldest first">Newest first ↓</button><button type="button" data-ks-reset="" hidden>Clear filters ×</button></span></div>';
    if (empty) empty.innerHTML = '<b>No signal</b>Nothing observed on that yet. <button type="button" class="ab_ks-ask_x" data-ks-reset2="">Clear filters</button>';

    // search text per card: title, answer, topic names
    cards.forEach(function(a){ var o = OB[a.getAttribute('data-slug')] || {}; a.__q = ((o.name || '') + ' ' + (o.answer || '') + ' ' + (o.topics || []).map(function(s){ return TOPIC[s] ? TOPIC[s].name : ''; }).join(' ')).toLowerCase(); a.__theme = o.themeKey; a.__topics = o.topics || []; });
    var st = { theme: 'all', topic: '', q: '' }, q = $('#ksQ');
    var hasFlip = hasGsap && window.Flip && !reduce;
    function apply(){
      var state = hasFlip ? Flip.getState(items) : null, shown = 0, first = null, words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      // Flip's absolute:true lifts every card out of flow, so the list collapsed to 0 for the whole tween and the
      // section below jumped up, then snapped back. Hold the list at its old height and ease it to the new one.
      // A quick second click lands mid-tween: the state above already caught the cards where they are, so finish the
      // running flip (back in flow) before measuring, or the new height would read as 0.
      var box = items[0].parentNode, h0 = box.offsetHeight;
      if (hasFlip){ Flip.killFlipsOf(items, true); gsap.killTweensOf(box); box.style.height = ''; }
      cards.forEach(function(a, i){
        var ok = (st.theme === 'all' || a.__theme === st.theme) && (!st.topic || a.__topics.indexOf(st.topic) > -1) && words.every(function(w){ return a.__q.indexOf(w) > -1; });
        items[i].classList.toggle('is-hid', !ok); if (ok){ shown++; if (!first) first = a; }
      });
      var plain = st.theme === 'all' && !st.topic && !words.length;
      items.forEach(function(it, i){ it.classList.toggle('is-feat', plain && i === 0); });
      // Growing: open to the new height at once (new cards fade in at their final spots, so an easing box let them sit over
      // the section below). Shrinking: hold the old height until the cards have landed, then close the gap. Never clear it on the height tween's own clock: the stagger + enter/leave fades outlast it, and the list
      // dropped to 0 for the tail of the flip (the light section below rode up over the cards).
      var h1 = hasFlip ? box.offsetHeight : 0;
      if (hasFlip) gsap.set(box, { height: Math.max(h0, h1) });
      if (hasFlip) Flip.from(state, { duration: .55, ease: 'power3.inOut', absolute: true, stagger: .02,
        onComplete: function(){ gsap.killTweensOf(box); if (h1 < h0) gsap.fromTo(box, { height: h0 }, { height: h1, duration: .4, ease: 'power2.inOut', clearProps: 'height' }); else box.style.height = ''; },
        onEnter: function(els){ return gsap.fromTo(els, { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .4 }); },
        onLeave: function(els){ return gsap.to(els, { opacity: 0, scale: .96, duration: .25 }); } });
      $$('[data-ks-shown], [data-ks-askn]').forEach(function(n){ n.textContent = shown; });
      var fl = []; if (st.theme !== 'all') fl.push(st.theme.replace(/-/g, ' ')); if (st.topic) fl.push(TOPIC[st.topic].name); if (words.length) fl.push('"' + st.q + '"');
      var ft = $('[data-ks-filt]'); if (ft) ft.textContent = fl.length ? fl.join(' + ') : 'none';
      var rs = $('[data-ks-reset]'); if (rs) rs.hidden = !fl.length;
      var qx = $('[data-ks-qx]'); if (qx) qx.hidden = !st.q;
      if (empty) empty.classList.toggle('is-on', !shown);
      var hit = $('[data-ks-hit]');
      if (hit) hit.innerHTML = words.length ? (first ? 'Best match <b>›</b> <a href="' + first.getAttribute('href') + '">' + esc(txt(first, '.ab_ks-card_h')) + '</a>' + (shown > 1 ? ' <span>+ ' + (shown - 1) + ' more below</span>' : '') : 'Nothing observed on that yet. <a href="/contact">Ask me directly →</a>') : '';
    }
    $$('.ab_ks-tabs button').forEach(function(b){ b.addEventListener('click', function(){ st.theme = b.getAttribute('data-theme'); $$('.ab_ks-tabs button').forEach(function(x){ x.setAttribute('aria-pressed', x === b); }); apply(); }); });
    $$('[data-topic]', ctrl).forEach(function(b){ b.addEventListener('click', function(){ st.topic = st.topic === b.getAttribute('data-topic') ? '' : b.getAttribute('data-topic'); $$('[data-topic]', ctrl).forEach(function(x){ x.setAttribute('aria-pressed', x.getAttribute('data-topic') === st.topic); }); apply(); }); });
    var more = $('[data-ks-more]');
    if (more) more.addEventListener('click', function(){ var on = !ctrl.classList.contains('is-all'); ctrl.classList.toggle('is-all', on); more.setAttribute('aria-expanded', on); more.textContent = on ? '− fewer topics' : '+ ' + (usedList.length - 8) + ' more topics'; });
    var qt;
    if (q) q.addEventListener('input', function(){ clearTimeout(qt); qt = setTimeout(function(){ st.q = q.value.trim(); apply(); }, 120); });
    $$('.ab_ks-ask_q button').forEach(function(b){ b.addEventListener('click', function(){ q.value = b.getAttribute('data-q'); st.q = q.value; apply(); q.focus(); }); });
    function reset(){ st = { theme: 'all', topic: '', q: '' }; if (q) q.value = ''; $$('.ab_ks-tabs button').forEach(function(x, i){ x.setAttribute('aria-pressed', i === 0); }); $$('[data-topic]', ctrl).forEach(function(x){ x.setAttribute('aria-pressed', 'false'); }); apply(); }
    $$('[data-ks-reset], [data-ks-reset2], [data-ks-qx]').forEach(function(b){ b.addEventListener('click', reset); });
    // sort toggle: newest / oldest first, cards glide to their new places (no absolute lift, so the list keeps its height)
    var sortBtn = $('[data-ks-sort]');
    if (sortBtn) sortBtn.addEventListener('click', function(){
      var state = hasFlip ? Flip.getState(items) : null;
      newest = !newest; cards.reverse(); items.reverse(); arrange();
      var plain = st.theme === 'all' && !st.topic && !st.q.trim();
      items.forEach(function(it, i){ it.classList.toggle('is-feat', plain && i === 0); });
      sortBtn.textContent = newest ? 'Newest first ↓' : 'Oldest first ↑';
      sortBtn.setAttribute('aria-label', 'Sort: ' + (newest ? 'newest' : 'oldest') + ' first. Switch to ' + (newest ? 'oldest' : 'newest') + ' first');
      if (state) Flip.from(state, { duration: .6, ease: 'power3.inOut', stagger: .015 });
    });
    // random jump: warp to a note picked from what the filters show (or any note when nothing is showing)
    if (ctrl){
      var jump = document.createElement('button'); jump.type = 'button'; jump.className = 'ab_ks-jump';
      jump.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.6 4.2 4.4.3-3.4 2.8 1.1 4.3L8 10.7l-3.7 2.4 1.1-4.3L2 6l4.4-.3z"/></svg>Hyperjump to a random note';
      var tabs = $('.ab_ks-tabs', ctrl); (tabs ? tabs.parentNode : ctrl).insertBefore(jump, tabs ? tabs.nextSibling : ctrl.firstChild);
      jump.addEventListener('click', function(){
        var pool = cards.filter(function(a, i){ return !items[i].classList.contains('is-hid'); }); if (!pool.length) pool = cards;
        var here = location.pathname, pick = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1) while (pick.getAttribute('href') === here) pick = pool[Math.floor(Math.random() * pool.length)];
        if (AB.toast) AB.toast('Plotting a hyperjump · ' + txt(pick, '.ab_ks-card_h'));
        var go = function(){ if (AB.go) AB.go(pick.href); else location.href = pick.href; };
        if (hasGsap && !reduce){ gsap.to(jump, { x: 6, duration: .08, yoyo: true, repeat: 5, onComplete: go }); } else go();
      });
    }
    apply();
    reveal(gridEl.parentNode);
  })();

  /* ---------- Home › Incoming signals: native cards, just reveal them ---------- */
  if (ROW === 'home') reveal($('[data-ks-row="home"]'));
