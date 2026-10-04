  /* =========================================================
     TOPICWEAVE · ROADMAP (channel tw-roadmap)
     The v3 Roadmap page (cks-v3/src/roadmap.html): five build phases on a rail, a thread advancing knot to
     knot; each phase's real prototype screen slides into a glass frame with its title and one line from the page.
     Screens are the page's own dark screenshots (code/vendor/topicweave/roadmap/), loaded on first play.
     Click a phase on the rail to jump to it and hold.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var pth = X.path, hide = X.hide, draw = X.draw, run = X.run, end = X.end;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    // [label, title, one line from the page, screenshot, what it delivers (handoff build plan), short chip]
    var PH = [
      ['Phase 0 · Now', 'The groundwork.', 'Sign-in, a workspace for each site, and the connections everything else stands on: your CMS and Google Search Console.', 'connections-dark.webp', ['Sign-in', 'Workspaces', 'CMS + Search Console'], 'Groundwork'],
      ['Phase 1 · With the first beta sites', 'Prove it works.', 'Your vocabulary imported from the site, link health checked every night, Search Console grouped by your topics, and a plain-language email on the 1st.', 'topics-dark.webp', ['Vocabulary import', 'Link health', 'Topic report', 'Monthly email'], 'Prove it'],
      ['Phase 2', 'Keep the library growing.', 'A review queue with a before and after and one-click undo, drafts in your voice from the Voice Kit, search ideas, and capture by email.', 'review-dark.webp', ['Review queue', 'Voice Kit drafts', 'Search ideas', 'Email capture'], 'Grow'],
      ['Phase 3', 'See what assistants see.', 'A cookieless counter for visits sent by ChatGPT, Perplexity, Claude and Gemini, a monthly assistant sample, and Topicweave Capture on your phone.', 'ai-dark.webp', ['AI visit counter', 'Assistant sample', 'Capture on a phone'], 'Measure'],
      ['Phase 4', 'Beyond one site.', 'The panel inside your CMS editor, a WordPress connector, and one login for agencies running Topicweave for their own clients.', 'cms-dark.webp', ['CMS panel', 'WordPress', 'Agency login'], 'Widen']
    ];

    SCENE.add('tw-roadmap', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg, N = PH.length;
      // rail: vertical on the left (landscape), horizontal under the frame (portrait)
      var F = P ? { x: 20, y: 112, w: 600, ih: 360 } : { x: 420, y: 104, w: 740, ih: 448 };
      var knots = PH.map(function(p, i){ return P ? { x: 60 + i * 130, y: 628 } : { x: 62, y: 196 + i * 110 }; });
      var html = '<div class="tw-rm-bg"></div>' +
        '<div class="tw-rm-head"><span>Roadmap</span><h3>Where Topicweave is headed.</h3></div>' +
        '<svg class="tw-rm-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-rm-rail">' + PH.map(function(p, i){
          var k = knots[i];
          return '<button type="button" class="tw-rm-k" data-i="' + i + '" style="left:' + k.x + 'px;top:' + k.y + 'px" aria-label="' + esc(p[0] + ': ' + p[1]) + '"><i></i><span>' + esc(P ? 'Phase ' + i : p[0]) + '</span><b>' + esc(p[1]) + '</b></button>';
        }).join('') + '</div>' +
        '<div class="tw-rm-frame" style="left:' + F.x + 'px;top:' + F.y + 'px;width:' + F.w + 'px">' +
          '<div class="tw-rm-shots" style="height:' + F.ih + 'px">' + PH.map(function(p, i){
            return '<div class="tw-rm-shot" data-i="' + i + '"><img alt="" data-src="' + esc(p[3]) + '" decoding="async">' + (i === 3 ? '<img class="tw-rm-phone" alt="" data-src="phone-dark.webp" decoding="async">' : '') + '</div>';
          }).join('') + '<em class="tw-rm-tag">Prototype · sample data</em></div>' +
          '<div class="tw-rm-caps">' + PH.map(function(p, i){
            return '<div class="tw-rm-cap" data-i="' + i + '"><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b><p>' + esc(p[2]) + '</p><div class="tw-rm-chips">' + p[4].map(function(c){ return '<i>' + esc(c) + '</i>'; }).join('') + '</div></div>';
          }).join('') + '</div>' +
        '</div><div class="fg-fade"></div>';
      st.innerHTML = html;
      var svg = q(st, '.tw-rm-svg'), ks = qa(st, '.tw-rm-k'), shots = qa(st, '.tw-rm-shot'), caps = qa(st, '.tw-rm-cap'), imgs = qa(st, '.tw-rm-shot img'), head = q(st, '.tw-rm-head');
      // the base track (a faint hairline) and the thread, one segment per step, swaying between knots
      var segs = [], base = '';
      for (var i = 1; i < N; i++){
        var a = knots[i - 1], b = knots[i], sw = (i % 2 ? 1 : -1) * 12, d;
        if (P){ var mx = (a.x + b.x) / 2; d = 'M' + a.x + ' ' + a.y + 'C' + mx + ' ' + (a.y + sw) + ' ' + mx + ' ' + (b.y - sw) + ' ' + b.x + ' ' + b.y; }
        else { var my = (a.y + b.y) / 2; d = 'M' + a.x + ' ' + a.y + 'C' + (a.x + sw) + ' ' + my + ' ' + (b.x - sw) + ' ' + my + ' ' + b.x + ' ' + b.y; }
        base += d;
        segs.push(d);
      }
      var tr = document.createElementNS('http://www.w3.org/2000/svg', 'path'); tr.setAttribute('d', base); tr.setAttribute('class', 'tw-rm-track'); svg.appendChild(tr);
      // the thread comes in from above / the left before the first knot
      var k0 = knots[0], lead = pth(svg, P ? 'M' + (k0.x - 44) + ' ' + (k0.y - 18) + 'C' + (k0.x - 24) + ' ' + (k0.y - 18) + ' ' + (k0.x - 20) + ' ' + k0.y + ' ' + k0.x + ' ' + k0.y : 'M' + (k0.x - 18) + ' ' + (k0.y - 50) + 'C' + (k0.x - 18) + ' ' + (k0.y - 26) + ' ' + k0.x + ' ' + (k0.y - 24) + ' ' + k0.x + ' ' + k0.y, 'tw-rm-thr');
      var thr = segs.map(function(d, i){ var p = pth(svg, d, 'tw-rm-thr'); p.style.stroke = T.WEAVE[(i + 1) % 4]; return p; });
      lead.style.stroke = T.WEAVE[0];
      // images load the first time the scene plays (never at build)
      function load(){ imgs.forEach(function(im){ if (!im.getAttribute('src')) im.setAttribute('src', T.asset('roadmap/' + im.getAttribute('data-src'))); }); }
      function mark(n){ ks.forEach(function(k, i){ k.classList.toggle('done', i < n); k.classList.toggle('on', i === n); k.setAttribute('aria-current', i === n ? 'step' : 'false'); }); }
      var R = run(sc, function(){ mark(-1); }), tl = R.tl;
      R.at(.01, load);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(shots.concat(caps), { autoAlpha: 0 }, 0);
      [lead].concat(thr).forEach(function(p){ hide(R, p); });
      tl.fromTo(head, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .1);
      tl.fromTo(ks, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, stagger: .08, immediateRender: false }, .25);
      tl.fromTo(q(st, '.tw-rm-frame'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .3);
      var t = .8, HOLD = 4.2, phases = [];
      PH.forEach(function(p, i){
        tl.addLabel('p' + i, t);
        phases.push({ t: P ? 'P' + i : p[5], at: 'p' + i });
        draw(R, i ? thr[i - 1] : lead, t, .8);
        (function(n){ R.at(t + .75, function(){ mark(n); }); })(i);
        if (i) {
          tl.to(shots[i - 1], { autoAlpha: 0, x: -40, duration: .45, ease: 'power2.in' }, t + .3);
          tl.to(caps[i - 1], { autoAlpha: 0, y: -8, duration: .3 }, t + .3);
        }
        tl.fromTo(shots[i], { autoAlpha: 0, x: 60, scale: 1.02 }, { autoAlpha: 1, x: 0, scale: 1, duration: .7, ease: 'power3.out', immediateRender: false }, t + .7);
        tl.fromTo(caps[i], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, t + .9);
        tl.fromTo(qa(caps[i], '.tw-rm-chips i'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .1, immediateRender: false }, t + 1.2);
        if (i === 3) tl.fromTo(q(shots[i], '.tw-rm-phone'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: false }, t + 1.5);
        t += HOLD;
      });
      end(sc, R, t + .4, tl.labels.p0 + 2.6, phases);
      // interactive: a phase on the rail jumps there (its screen in place) and holds
      ks.forEach(function(k, i){ tap(k, function(){ if (sc.hold) sc.hold(); load(); tl.seek(tl.labels['p' + i] + 2.4); if (sc.onSeek) sc.onSeek(); }); });
    });
  })();
