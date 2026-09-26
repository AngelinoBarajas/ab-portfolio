  /* ---------- tips (CMS · Glossary): Terms auto-link in copy, Asides attach to one element by CSS selector ---------- */
  // Terms: the first mention per section in body copy becomes a dashed-underline button (Mission copy can also mark
  // [[term]] by hand). Asides: witty or behind-the-scenes notes on elements (logo, metrics, black hole…), title with ✦.
  // Hover shows (hover devices), focus shows, tap toggles (touch; not on links, buttons or draggables). One tip at a time.
  var tipEl = document.createElement('div'); tipEl.className = 'gl-tip'; tipEl.id = 'abTip'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl);
  var TERMS = {}, ASIDES = [], tipCur = null, tipT = 0;
  function tipData(){
    TERMS = {}; ASIDES = []; passEls = null;
    (AB.gloss || []).forEach(function(g){
      if (/aside/i.test(g.k || '')){ if (g.t){ try { document.querySelector(g.t); ASIDES.push(g); } catch (e){} } }
      else TERMS[g.n] = g.d;
    });
  }
  function tipPlace(el){
    var r = el.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    var x = r.width > w ? r.left + (r.width - w) / 2 : r.left, y = r.bottom + 10;
    if (y + h > innerHeight - 8 && r.top - h - 10 > 8) y = r.top - h - 10;
    tipEl.style.left = Math.round(Math.max(12, Math.min(innerWidth - w - 12, x))) + 'px';
    tipEl.style.top = Math.round(Math.max(8, y)) + 'px';
  }
  function tipShow(el, title, text, aside){
    if (aside && AB.quest) AB.quest('aside');
    clearTimeout(tipT);
    tipEl.innerHTML = '<b>' + (aside ? '<i aria-hidden="true">✦</i> ' : '') + esc(title) + '</b>' + esc(text);
    tipEl.classList.toggle('is-aside', !!aside);
    tipPlace(el); tipEl.classList.add('show'); tipCur = el;
    if (el.matches && el.matches('button,a,[tabindex]')) el.setAttribute('aria-describedby', 'abTip');
  }
  function tipHide(){ clearTimeout(tipT); tipEl.classList.remove('show'); if (tipCur && tipCur.removeAttribute) tipCur.removeAttribute('aria-describedby'); tipCur = null; }
  // what a pointer/focus target shows: a term button, or the nearest element an aside targets
  function tipFor(t){
    if (!t || !t.closest) return null;
    var b = t.closest('.gl');
    if (b){ var term = b.getAttribute('data-term'); return TERMS[term] ? { el: b, title: term, text: TERMS[term] } : null; }
    for (var i = 0; i < ASIDES.length; i++){ var m = t.closest(ASIDES[i].t); if (m) return { el: m, title: ASIDES[i].n, text: ASIDES[i].d, aside: true }; }
    return null;
  }
  function tipOpen(f){ if (f) tipShow(f.el, f.title, f.text, f.aside); }
  if (!coarse){
    document.addEventListener('mouseover', function(e){
      var f = tipFor(e.target); if (!f){ return; } if (f.el === tipCur) return;
      clearTimeout(tipT); tipT = setTimeout(function(){ tipOpen(f); }, f.aside ? 180 : 0);
    });
    document.addEventListener('mouseout', function(e){
      var f = tipFor(e.target); if (!f) return;
      if (e.relatedTarget && f.el.contains(e.relatedTarget)) return;
      clearTimeout(tipT); if (tipCur === f.el) tipT = setTimeout(tipHide, 80);
    });
  }
  // asides on elements that let the pointer through (footer black hole, Process countdown): open by position instead
  // (planets: inside the circle), checked every 90ms while the mouse moves, never mid-drag
  var passEls = null, passAt = 0, passT = 0;
  function passList(){
    passEls = [];
    ASIDES.forEach(function(A){ $$(A.t).forEach(function(el){ if (getComputedStyle(el).pointerEvents === 'none') passEls.push({ el: el, a: A, round: el.classList.contains('ab_planet') }); }); });
    passAt = Date.now();
  }
  if (!coarse){
    document.addEventListener('mousemove', function(e){
      var now = Date.now(); if (now - passT < 90) return; passT = now;
      if (!passEls || now - passAt > 3000) passList();
      if (!passEls.length || e.buttons) return;
      var hit = null;
      for (var i = 0; i < passEls.length && !hit; i++){
        var r = passEls[i].el.getBoundingClientRect(); if (!r.width) continue;
        var inside = passEls[i].round ? Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width * .3
          : e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (inside) hit = passEls[i];
      }
      if (hit){ if (tipCur !== hit.el) tipShow(hit.el, hit.a.n, hit.a.d, true); }
      else if (tipCur && tipCur.__pass !== false){ for (var j = 0; j < passEls.length; j++){ if (passEls[j].el === tipCur){ tipHide(); break; } } }
    }, { passive: true });
  }
  document.addEventListener('focusin', function(e){ var f = tipFor(e.target); if (f && f.el === e.target) tipOpen(f); });
  document.addEventListener('focusout', function(){ tipHide(); });
  // grabbing a draggable (planet, black hole) or tapping elsewhere closes the tip
  document.addEventListener('pointerdown', function(e){ if (tipCur && !(e.target.closest && e.target.closest('.gl'))) tipHide(); }, true);
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.gl');
    if (b){ e.stopPropagation(); if (tipCur === b) tipHide(); else tipOpen(tipFor(b)); return; }
    if (!coarse) return;
    var f = tipFor(e.target);
    if (!f || (e.target.closest && e.target.closest('a,button,input,select,textarea,[data-drag],.is-drag'))) { tipHide(); return; }
    if (tipCur === f.el) tipHide(); else tipOpen(f);
  });
  addEventListener('scroll', function(){ if (tipCur) tipHide(); }, { passive: true });

  // auto-link: first mention of each term per section, at most one per paragraph, in body copy only (never headings, links, buttons, forms,
  // chips/tags, hidden CMS sources or text that scripts rewrite)
  var TIP_SKIP = 'a,button,h1,h2,h3,h4,h5,h6,label,input,textarea,select,code,pre,.gl,[data-no-gloss],[data-split],[data-leg],[data-dest-sum],[data-dest-title],[data-bind],[aria-hidden="true"],.w-dyn-bind-empty,[data-site-data],.ab_cms-source,.w-condition-invisible,.ab_toast,.gl-tip,[class*="chip"],[class*="_tag"],[class*="-tag"]';
  function tipRe(term){
    var e = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^A-Za-z0-9_-])(' + e + 's?)(?![A-Za-z0-9_-])', /[a-z]/.test(term) ? 'i' : '');
  }
  function tipLink(root){
    var names = Object.keys(TERMS).sort(function(a, b){ return b.length - a.length; }); if (!names.length) return;
    var res = names.map(function(n){ return [n, tipRe(n)]; });
    $$('p, li, .text-size-lede, [class*="_text"], [class*="-text"], [class*="_desc"], [class*="-desc"], [class*="_sum"]', root || $('main') || document.body).forEach(function(p){
      if ((p.closest && p.closest(TIP_SKIP)) || !p.getClientRects().length || $('div,p,ul,ol,section,article', p)) return;
      var sec = p.closest('section') || document.body, seen = sec.__glSeen;
      if (!seen){ seen = sec.__glSeen = {}; $$('.gl', sec).forEach(function(g){ seen[g.getAttribute('data-term')] = 1; }); }
      var walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null, false), nodes = [], n;
      while ((n = walker.nextNode())) if (!(n.parentNode.closest && n.parentNode.closest(TIP_SKIP))) nodes.push(n);
      // one link per paragraph keeps dense copy readable
      var linked = !!$('.gl', p);
      nodes.forEach(function(node){
        for (var i = 0; i < res.length && !linked; i++){
          var term = res[i][0]; if (seen[term]) continue;
          var m = res[i][1].exec(node.nodeValue); if (!m) continue;
          var start = m.index + m[1].length, word = m[2];
          var after = node.splitText(start); after.nodeValue = after.nodeValue.slice(word.length);
          var b = document.createElement('button'); b.type = 'button'; b.className = 'gl'; b.setAttribute('data-term', term); b.textContent = word;
          node.parentNode.insertBefore(b, after); seen[term] = 1; linked = true;
        }
      });
    });
  }
  tipData();
  AB.tip = {
    show: function(el){ for (var i = 0; i < ASIDES.length; i++){ if (el.matches && el.matches(ASIDES[i].t)){ tipShow(el, ASIDES[i].n, ASIDES[i].d, true); return; } } },
    hide: function(el){ if (!el || tipCur === el) tipHide(); },
    link: tipLink,
    refresh: function(){ tipData(); tipLink(); }
  };
  // after page scripts have written their copy (Mission [[terms]], Process legs…)
  setTimeout(function(){ tipLink(); }, 900);
  // twinkles: a hint there's something to hover / tap. An aside in the page twinkles as it scrolls into view, then one
  // on screen sparkles every 3-6s. The nav's asides (logo, clock) only get an occasional one, while the nav shows.
  // Skipped for reduced motion, in hidden tabs, while a tip or the menu is open
  if (!reduce) (function(){
    var navEl = document.getElementById('nav'), seen = [];
    function inNav(el){ return navEl && navEl.contains(el); }
    function navShown(){ return navEl && !navEl.classList.contains('is-hidden'); }
    function onScreen(el){ var r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4 && r.bottom > 80 && r.top < innerHeight - 30 && r.right > 0 && r.left < innerWidth ? r : null; }
    function targets(){
      var content = [], nav = [];
      ASIDES.forEach(function(a){ var els; try { els = document.querySelectorAll(a.t); } catch (e){ return; }
        for (var i = 0; i < els.length; i++){ var el = els[i], nv = inNav(el), r = nv ? (navShown() && el.getBoundingClientRect()) : onScreen(el);
          if (r && r.width > 4) (nv ? nav : content).push({ el: el, r: r }); } });
      return { content: content, nav: nav };
    }
    function blocked(){ return document.hidden || tipCur || document.documentElement.classList.contains('menu-open'); }
    function one(x, y, size, delay){
      var s = document.createElement('span'); s.className = 'ab-twinkle'; s.setAttribute('aria-hidden', 'true'); s.textContent = '✦';
      s.style.left = Math.round(Math.max(10, Math.min(innerWidth - 24, x))) + 'px'; s.style.top = Math.round(Math.max(10, Math.min(innerHeight - 24, y))) + 'px';
      s.style.fontSize = size + 'px'; s.style.animationDelay = delay + 's';
      document.body.appendChild(s); setTimeout(function(){ s.remove(); }, 1900 + delay * 1000);
    }
    function burst(r){
      var cx = Math.random() < .5 ? r.left : r.right, cy = Math.random() < .5 ? r.top : r.bottom;
      // corner of a tall/wide thing: pull it a little inside so it reads as belonging to it
      cx += (cx === r.left ? 1 : -1) * Math.min(14, r.width * .2); cy += (cy === r.top ? 1 : -1) * Math.min(12, r.height * .2);
      one(cx, cy, 22, 0);
      one(cx + (Math.random() < .5 ? -1 : 1) * (14 + Math.random() * 10), cy + (Math.random() < .5 ? -1 : 1) * (10 + Math.random() * 8), 11, .18);
      one(cx + (Math.random() < .5 ? -1 : 1) * (8 + Math.random() * 14), cy + (Math.random() < .5 ? -1 : 1) * (14 + Math.random() * 8), 9, .34);
    }
    function tick(){
      var t = targets(), pick = null;
      if (!blocked()){
        if (t.content.length) pick = t.content[Math.floor(Math.random() * t.content.length)];
        else if (t.nav.length && Math.random() < .3) pick = t.nav[Math.floor(Math.random() * t.nav.length)];
        if (pick) burst(pick.r);
      }
      setTimeout(tick, (t.content.length ? 3000 : 6000) + Math.random() * 3000);
    }
    setTimeout(tick, 2500);
    // an aside in the page twinkles right away the first time it scrolls into view
    if ('IntersectionObserver' in window) setTimeout(function(){
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){
        if (!e.isIntersecting || seen.indexOf(e.target) > -1) return; seen.push(e.target);
        setTimeout(function(){ var r = onScreen(e.target); if (r && !blocked()) burst(r); }, 350);
      }); }, { threshold: .4 });
      ASIDES.forEach(function(a){ try { Array.prototype.forEach.call(document.querySelectorAll(a.t), function(el){ if (!inNav(el)) io.observe(el); }); } catch (e){} });
    }, 1200);
  })();
