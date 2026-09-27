  /* ---------- /observatory/[slug]: the article ---------- */
  if (VIEW === 'article') (function(){
    var X = OB[CUR_SLUG] || { slug: CUR_SLUG, topics: [] };
    var curTopics = $$('[data-ks-src="cur-topics"] [data-ks-t]').map(function(n){ return n.getAttribute('data-slug'); });
    X.topics = curTopics.length ? curTopics : X.topics;

    // title: "Smooth scroll without the stutter: Lenis + GSAP" → solid first half, outlined second half
    var h1 = $('[data-ks-title]');
    if (h1){ var m = h1.textContent.match(/^(.+?[:.?])\s+(.+)$/); h1.innerHTML = m ? '<span class="ab_dbh_word">' + esc(m[1]) + '</span> <span class="ab_dbh_word t-outline">' + esc(m[2]) + '</span>' : '<span class="ab_dbh_word">' + esc(h1.textContent) + '</span>'; }
    var ans = $('[data-ks-answer]'); if (ans && ans.textContent.indexOf('`') > -1) ans.innerHTML = ticks(ans.textContent);
    var achips = $('[data-ks-achips]'); if (achips) achips.innerHTML = X.topics.map(function(s){ return chip(s); }).join('');

    // prose: § numbers + ids on h2, code panels from <pre><code data-lang>
    var rt = $('[data-ks-rt]'), toc = [];
    if (rt){
      $$('h2', rt).forEach(function(h, i){
        var t = h.textContent.replace(/^\d+\.\s*/, ''), id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        h.id = id; h.innerHTML = '<i>§' + pad2(i + 1) + '</i><span>' + esc(t) + '</span>'; toc.push([id, t]);
      });
      $$('pre', rt).forEach(function(pre){
        var code = pre.textContent.replace(/\n$/, '');
        var wrap = document.createElement('div'); wrap.innerHTML = AB.codeBlock ? AB.codeBlock(code, 'from the build') : '<pre><code>' + esc(code) + '</code></pre>';
        pre.parentNode.replaceChild(wrap.firstChild, pre);
      });
      $$('a[href]', rt).forEach(function(a){ var h = a.getAttribute('href'); if (/^https?:/.test(h) && h.indexOf(location.host) < 0){ a.target = '_blank'; a.rel = 'noopener'; } });
    }

    // aside: on this page, filed under, related services (planets), shown in practice (planets)
    var aside = $('[data-ks-aside]'), cMis = $$('[data-ks-src="missions"] [data-ks-m]').map(function(n){ return MI[n.getAttribute('data-slug')]; }).filter(Boolean);
    if (aside){
      aside.innerHTML =
        (toc.length ? '<div class="ab_ks-box is-toc"><div class="ab_ks-box_h"><span>On this page</span><b data-ks-tocn="">01 / ' + pad2(toc.length) + '</b></div><ol class="ab_ks-toc">' + toc.map(function(t, i){ return '<li><a href="#' + t[0] + '"><i>' + pad2(i + 1) + '</i><span>' + esc(t[1]) + '</span></a></li>'; }).join('') + '</ol><div class="ab_ks-alt"><i data-ks-alt=""></i></div></div>' : '') +
        (X.topics.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Filed under</span><b>' + pad2(X.topics.length) + '</b></div><div class="ab_ks-chips">' + X.topics.map(function(s){ return chip(s); }).join('') + '</div></div>' : '') +
        (SVC.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Related services</span><b>' + pad2(SVC.length) + '</b></div><ul class="ab_ks-rel_s">' + SVC.map(function(s){ return '<li><a href="' + s.href + '">' + planet(s, PSEED++) + '<span class="ab_ks-rel_n">' + esc(s.t1 + ' ' + s.t2) + '</span><span class="ab_ks-rel_x">→</span></a></li>'; }).join('') + '</ul></div>' : '') +
        (cMis.length ? '<div class="ab_ks-box"><div class="ab_ks-box_h"><span>Shown in practice</span><b>' + pad2(cMis.length) + '</b></div><ul class="ab_ks-rel_s">' + cMis.map(function(m){ return '<li><a href="' + m.href + '">' + planet(m, PSEED++) + '<span class="ab_ks-rel_n">' + esc(m.name) + '</span><span class="ab_ks-rel_x">M-' + m.no + '</span></a></li>'; }).join('') + '</ul></div>' : '');
      buildPlanets(aside);
    }

    // related reading: most shared topics, then same theme
    var rel = OBS.filter(function(y){ return y.slug !== X.slug; }).map(function(y){
      var s = y.topics.filter(function(t){ return X.topics.indexOf(t) > -1; }).length * 2 + (y.themeKey === (X.themeKey || '') ? 1 : 0); return [s, y];
    }).sort(function(a, b){ return b[0] - a[0]; }).slice(0, 3).map(function(p){ return p[1]; });
    var relEl = $('[data-ks-rel]'); if (relEl){ relEl.innerHTML = grid(rel); reveal(relEl); }
    var xi = -1; OBS.forEach(function(o, i){ if (o.slug === X.slug) xi = i; });
    var pager = $('[data-ks-pager]');
    if (pager && xi > -1 && OBS.length > 1){
      var P = OBS[(xi - 1 + OBS.length) % OBS.length], N = OBS[(xi + 1) % OBS.length];
      pager.innerHTML = '<a href="' + P.href + '"><span>← Previous · ' + esc(P.code) + '</span><b>' + esc(P.name) + '</b></a><a href="' + N.href + '"><span>Next · ' + esc(N.code) + ' →</span><b>' + esc(N.name) + '</b></a>';
    }

    // reading progress + TOC state
    var prog = $('[data-ks-prog]'), prose = $('[data-ks-prose]'), tocA = $$('.ab_ks-toc a'), heads = tocA.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }), alt = $('[data-ks-alt]'), tocN = $('[data-ks-tocn]');
    var ticking = false;
    function onScroll(){
      ticking = false; if (!prose) return;
      var r = prose.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .35 - r.top) / Math.max(1, r.height - innerHeight * .35)));
      if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')'; if (alt) alt.style.width = (p * 100).toFixed(1) + '%';
      var cur = 0; heads.forEach(function(h, i){ if (h && h.getBoundingClientRect().top < innerHeight * .3) cur = i; });
      tocA.forEach(function(a, i){ a.classList.toggle('is-on', i === cur); });
      if (tocN) tocN.textContent = pad2(cur + 1) + ' / ' + pad2(tocA.length);
    }
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
    tocA.forEach(function(a){ a.addEventListener('click', function(e){ var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return; e.preventDefault(); if (AB.lenis) AB.lenis.scrollTo(t, { offset: -100 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }); });
    document.title = (h1 ? h1.textContent : 'Observation') + ' · Observatory · Angelino Barajas';
  })();
