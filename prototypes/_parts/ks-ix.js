  /* =========================================================
     KNOWLEDGE · interactions
     Every link works without this script; it only filters, highlights and animates.
     ========================================================= */
  (function(){
    var page = $('.ks-page'); if (!page) return;
    var view = page.dataset.view;
    // test-only (?at=<frame>): hide the sections above that frame for headless shots
    var shot = document.documentElement.getAttribute('data-shot');
    if (shot){ var hit = false; $$('#ks > *').forEach(function(s){ if (s.dataset.frame === shot) hit = true; if (!hit && s.tagName === 'SECTION') s.style.display = 'none'; }); }

    // hash routes (article + topic templates stand in for /insights/[slug] and /topics/[slug])
    if (view === 'article' || view === 'topic') addEventListener('hashchange', function(){ if (!document.getElementById(location.hash.slice(1))) location.reload(); });

    /* ---------- reveals ---------- */
    var rv = $$('.ks-rv');
    if (reduce || !('IntersectionObserver' in window)) rv.forEach(function(el){ el.classList.add('is-in'); });
    else { var rio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ var el = e.target, d = (Array.prototype.indexOf.call(el.parentNode.children, el) % 3) * 80; setTimeout(function(){ el.classList.add('is-in'); }, d); rio.unobserve(el); } }); }, { rootMargin: '0px 0px -8% 0px' }); rv.forEach(function(el){ rio.observe(el); }); }

    /* ---------- FAQ (details) ---------- */
    $$('.faq details').forEach(function(d){ d.addEventListener('toggle', function(){ d.classList.toggle('is-open', d.open); }); });

    /* ---------- library: theme + topic + ask ---------- */
    if (view === 'library'){
      var grid = $('#ksGrid'), cards = $$('.ks-card', grid), q = $('#ksQ'), st = { theme: 'all', topic: '', q: '' };
      var hasFlip = hasGsap && window.Flip && !reduce;
      function apply(scroll){
        var flipState = hasFlip ? Flip.getState(cards) : null, shown = 0, first = null;
        var words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
        cards.forEach(function(c){
          var ok = (st.theme === 'all' || c.dataset.theme === st.theme) && (!st.topic || c.dataset.topics.split(' ').indexOf(st.topic) > -1) &&
            words.every(function(w){ return c.dataset.q.indexOf(w) > -1; });
          c.classList.toggle('is-hid', !ok); if (ok){ shown++; if (!first) first = c; c.classList.add('is-in'); }
        });
        // the first visible card is the featured one, only when nothing is filtered
        var plain = st.theme === 'all' && !st.topic && !words.length;
        cards.forEach(function(c, i){ c.classList.toggle('is-feat', plain && i === 0); });
        if (hasFlip) Flip.from(flipState, { duration: .55, ease: 'power3.inOut', absolute: true, stagger: .02, onEnter: function(els){ return gsap.fromTo(els, { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .4 }); }, onLeave: function(els){ return gsap.to(els, { opacity: 0, scale: .96, duration: .25 }); } });
        $('#ksShown').textContent = shown; $('#ksAskN').textContent = shown;
        var f = []; if (st.theme !== 'all') f.push(st.theme.replace(/-/g, ' ')); if (st.topic) f.push(TOPIC[st.topic].name); if (words.length) f.push('"' + st.q + '"');
        $('#ksFilt').textContent = f.length ? f.join(' + ') : 'none';
        $('#ksReset').hidden = !f.length; $('#ksQx').hidden = !st.q;
        $('#ksEmpty').classList.toggle('on', !shown);
        var hit = $('#ksHit');
        hit.innerHTML = words.length ? (first ? 'Best match <b>›</b> <a href="' + first.getAttribute('href') + '">' + esc(first.querySelector('h3').textContent) + '</a>' + (shown > 1 ? ' <span>+ ' + (shown - 1) + ' more below</span>' : '') : 'Nothing observed on that yet. <a href="contact.html">Ask me directly →</a>') : '';
        if (scroll && hasGsap && lenis) lenis.scrollTo('#library', { offset: -90 });
      }
      $$('.ks-tabs button').forEach(function(b){ b.addEventListener('click', function(){ st.theme = b.dataset.theme; $$('.ks-tabs button').forEach(function(x){ x.setAttribute('aria-pressed', x === b); }); apply(); }); });
      $$('.ks-ctrl [data-topic]').forEach(function(b){ b.addEventListener('click', function(){ st.topic = st.topic === b.dataset.topic ? '' : b.dataset.topic; $$('.ks-ctrl [data-topic]').forEach(function(x){ x.setAttribute('aria-pressed', x.dataset.topic === st.topic); }); apply(); }); });
      var more = $('#ksMore'); if (more) more.addEventListener('click', function(){ var on = !$('.ks-ctrl').classList.contains('is-all'); $('.ks-ctrl').classList.toggle('is-all', on); more.setAttribute('aria-expanded', on); more.textContent = on ? '− fewer topics' : '+ ' + $$('.ks-more').length + ' more topics'; });
      var qt; q.addEventListener('input', function(){ clearTimeout(qt); qt = setTimeout(function(){ st.q = q.value.trim(); apply(); }, 120); });
      $$('.ks-ask-q button').forEach(function(b){ b.addEventListener('click', function(){ q.value = b.dataset.q; st.q = b.dataset.q; apply(); q.focus(); }); });
      function reset(){ st = { theme: 'all', topic: '', q: '' }; q.value = ''; $$('.ks-tabs button').forEach(function(x, i){ x.setAttribute('aria-pressed', i === 0); }); $$('.ks-ctrl [data-topic]').forEach(function(x){ x.setAttribute('aria-pressed', 'false'); }); apply(); }
      $('#ksQx').addEventListener('click', reset); $('#ksReset').addEventListener('click', reset); $$('[data-reset]').forEach(function(b){ b.addEventListener('click', reset); });

    }

    /* ---------- article: progress, TOC, altitude ---------- */
    if (view === 'article'){
      var prog = $('#ksProg'), prose = $('#ksProse'), tocA = $$('#ksToc a'), heads = tocA.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }), alt = $('#ksAlt'), tocN = $('#ksTocN');
      function onScroll(){
        var r = prose.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .35 - r.top) / (r.height - innerHeight * .35)));
        prog.style.transform = 'scaleX(' + p.toFixed(4) + ')'; alt.style.width = (p * 100).toFixed(1) + '%';
        var cur = 0; heads.forEach(function(h, i){ if (h && h.getBoundingClientRect().top < innerHeight * .3) cur = i; });
        tocA.forEach(function(a, i){ a.classList.toggle('on', i === cur); });
        if (tocN) tocN.textContent = pad(cur + 1) + ' / ' + pad(tocA.length);
      }
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
      tocA.forEach(function(a){ a.addEventListener('click', function(e){ var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return; e.preventDefault(); if (lenis) lenis.scrollTo(t, { offset: -100 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', location.pathname + location.search + location.hash); }); });
    }

    /* ---------- star chart: hover/focus reads a star; touch taps twice to open ---------- */
    if (view === 'chart'){
      var map = $('#ksMap'), read = $('#ksRead'), stars = $$('#ksMap a'), xls = $$('#ksMap .xl'), sel = null, lastType = 'mouse';
      function show(a){
        if (sel === a) return; sel = a;
        var t = TOPIC[a.dataset.slug], c = CAT[t.category], n = notesFor(t.slug), ms = t.missions.filter(function(s){ return MI4[s]; });
        var near = {}; xls.forEach(function(l){ var on = l.dataset.a === t.slug || l.dataset.b === t.slug; l.classList.toggle('on', on); if (on){ near[l.dataset.a] = 1; near[l.dataset.b] = 1; } });
        stars.forEach(function(s){ s.classList.toggle('on', s === a); s.classList.toggle('near', !!near[s.dataset.slug] && s !== a); });
        map.classList.add('dim');
        read.dataset.cat = t.category;
        read.innerHTML = '<span class="ks-read-c">' + c.code + ' · ' + esc(c.name) + '</span><h3>' + esc(t.name) + '</h3><p>' + esc(t.definition) + '</p>' +
          '<dl><div><dt>Observed</dt><dd>' + pad(n.length) + '</dd></div><div><dt>Missions</dt><dd>' + pad(ms.length) + '</dd></div><div><dt>Services</dt><dd>' + pad(t.services.length) + '</dd></div></dl>' +
          (n.length ? '<ul>' + n.slice(0, 3).map(function(x){ return '<li><i>' + x.no + '</i>' + esc(x.title) + '</li>'; }).join('') + '</ul>' : '<p style="color:var(--dust);font-size:13px">No notes on this one yet. It still tags missions and services.</p>') +
          '<a class="btn btn-primary" href="' + TOP + t.slug + '"><span class="shine" aria-hidden="true"></span><span>Open topic</span><span class="arr" aria-hidden="true">→</span></a>';
      }
      document.addEventListener('pointerdown', function(e){ lastType = e.pointerType || 'mouse'; }, true);
      stars.forEach(function(a){
        a.addEventListener('pointerenter', function(e){ if (e.pointerType !== 'touch') show(a); });
        a.addEventListener('focus', function(){ show(a); });
        a.addEventListener('click', function(e){ if (lastType === 'touch' && sel !== a){ e.preventDefault(); show(a); } });
      });
      var top = stars.slice().sort(function(x, y){ return links(TOPIC[y.dataset.slug]) - links(TOPIC[x.dataset.slug]); })[0];
      show(top);
    }
  })();
