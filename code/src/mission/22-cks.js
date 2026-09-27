  /* =========================================================
     CKS SCENES (mission cks; the channel id picks the scene)
     cks-styles : five site personalities, one component set; the tokens swap live. Click a site to take over.
     cks-story  : a scattered site gets woven, four states interpolated the way story.js does it. Steps + a draggable scroll rail.
     cks-map    : the knowledge map (graph.js layout): search, grow the map, tag, settle. Hover, click, drag, type, grow your own.
     cks-sketch : the sketch tool (sketch.js vocabularies + matching): pick a site, react to the vocabulary, see what connects.
     cks-publish: one entry published updates the library, a topic page, a project and the JSON-LD.
     The same demos run live on getcks.io; 40-monitor swaps the live ones in once the site answers.
     Example content is the CKS site's own (yoursite.com, sample firms): no client facts.
     ========================================================= */
  (function(){
    var K = SCENE.kit, X = K.ks; if (!X) return;
    var q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';
    var pos = X.pos, run = X.run, end = X.end, type = X.type, count = X.count, pth = X.path, hide = X.hide, draw = X.draw, click = X.click, move = X.move, cursor = X.cursor;
    var SAF = '#F2A93B', COR = '#EF5B3F', TEA = '#139E8A', COB = '#2F5BEA', OCH = '#C7832A', INK = '#0B1B2B';
    // the CKS mark, from the site's own header SVG
    var LOGO = '<svg class="cx-logo" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="5" rx="1.2" fill="#EF5B3F"/><rect x="2.5" y="13" width="19" height="5" rx="1.2" fill="#139E8A"/><rect x="6" y="2.5" width="5" height="19" rx="1.2" fill="#F2A93B" stroke="#fff" stroke-width="1.4"/><rect x="13" y="2.5" width="5" height="19" rx="1.2" fill="#2F5BEA" stroke="#fff" stroke-width="1.4"/><rect x="12.3" y="6" width="6.4" height="5" fill="#EF5B3F"/><path d="M12.3 6V11M18.7 6V11" stroke="#fff" stroke-width="1.4"/><rect x="5.3" y="13" width="6.4" height="5" fill="#139E8A"/><path d="M5.3 13V18M11.7 13V18" stroke="#fff" stroke-width="1.4"/></svg>';
    // the site's typefaces (and the five sample sites'), loaded once, only when a CKS scene is built.
    // Scenes measure their layout, so one built before Schibsted Grotesk arrived rebuilds itself once it has.
    var FP = null, FONTS_OK = false;
    function fonts(sc){
      if (!FP) FP = new Promise(function(done){
        function res(){ FONTS_OK = true; done(); }
        var l = document.createElement('link'); l.id = 'cx-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Newsreader:ital@1&family=Lora:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;600&family=Fredoka:wght@500;700&family=Nunito+Sans:wght@400;700;800&family=Archivo+Narrow:wght@400;500&family=IBM+Plex+Mono&display=swap';
        l.onload = function(){ (document.fonts ? document.fonts.load('700 12px "Schibsted Grotesk"') : Promise.resolve()).then(res, res); };
        l.onerror = function(){ res(); };
        document.head.appendChild(l);
        setTimeout(res, 5000);
      });
      // (fonts.check() can't tell: it reports true while the stylesheet itself is still loading)
      if (sc && !sc._fw && !FONTS_OK){ sc._fw = true; FP.then(function(){ if (K.rebuild) K.rebuild(sc); }); }
    }
    function bar(url){ return '<div class="cx-bar"><i></i><i></i><i></i><span>' + LOGO + esc(url) + '</span></div>'; }
    function c01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
    // typing into a real <input>: the value tweens, so seeking the timeline replays it
    function typeVal(R, inp, str, t, dur){
      var o = { n: 0 }; dur = dur || Math.min(1.6, .045 * str.length + .2);
      R.tl.fromTo(o, { n: 0 }, { n: str.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function(){ inp.value = str.slice(0, Math.round(o.n)); } }, t);
      return t + dur;
    }

    /* ---------------- 1 · STYLE LAB: five sites, one component set ---------------- */
    // content + the 21 tokens each personality sets (skins.json on the CKS site)
    var TK = ['bg', 'surface', 'ink', 'muted', 'accent', 'accent-2', 'on-accent', 'line', 'font-h', 'font-b', 'font-l', 'h-w', 'h-track', 'l-case', 'l-style', 'r-lg', 'r-sm', 'pad', 'gap', 'bw', 'shadow'];
    var SKINS = [
      { n: 'Counsel', kind: 'Law firm', sw: ['#F4EDE1', '#7A1F2B'], site: 'harlowreyes.law/expertise/succession-planning', brand: 'Harlow & Reyes', tl: 'Practice area', tp: 'Business succession planning',
        df: 'Deciding now who runs, owns and inherits the business later, in writing, while everyone still agrees.', mr: '3 related articles', mw: '5 matters', th: 'Owners & families · 6 min read',
        ins: 'The handshake is not the plan', dk: 'Why the partner who “just knows” the deal is the biggest risk in a family company.', rm: 'Read the article', rl: 'Related reading',
        rel: [['What a buy-sell agreement covers', 'Answer'], ['When to start succession talks', 'Video, 8 min'], ['Two owners, one exit', 'Article']],
        fq: 'When should we start planning succession?', fa: 'Earlier than feels necessary, while every owner still agrees on what happens next.',
        tk: ['#F4EDE1', 'rgba(255,252,246,0.72)', '#2A1A17', '#6E5A52', '#7A1F2B', '#C9A26B', '#FFF8EE', 'rgba(122,31,43,0.16)', "'Lora', Georgia, serif", "'Lora', Georgia, serif", "'Lora', Georgia, serif", '600', '-0.01em', 'none', 'italic', '14px', '999px', '22px', '14px', '1px', '0 1px 0 rgba(255,255,255,.8) inset, 0 12px 28px -18px rgba(74,20,28,.35)'] },
      { n: 'Studio', kind: 'Installation studio', sw: ['#101214', '#1FE0CB'], site: 'lumenfield.studio/thinking/light-as-material', brand: 'LUMEN FIELD', tl: 'Known for', tp: 'Light as a material',
        df: 'We specify light the way others specify steel: tested, engineered and built into the structure, never added at the end.', mr: '4 related essays', mw: '7 installs', th: 'Process · 9 min',
        ins: 'Every install starts as a failure log', dk: 'What six weeks of broken prototypes teach you that a render never will.', rm: 'Read', rl: 'Related thinking',
        rel: [['Commissioning at night', 'Essay'], ['Heat is the real enemy', 'Video, 12 min'], ['Designing for maintenance', 'Essay']],
        fq: 'How long does a permanent install take?', fa: 'Most run twelve to twenty weeks from brief to opening night.',
        tk: ['#0F1113', '#171A1D', '#ECEEEE', '#8C9496', '#1FE0CB', '#2A6DF4', '#04110F', 'rgba(236,238,238,0.12)', "'Space Grotesk', Arial, sans-serif", "'Space Grotesk', Arial, sans-serif", "'JetBrains Mono', monospace", '600', '-0.035em', 'uppercase', 'normal', '4px', '2px', '20px', '10px', '1px', '0 0 0 1px rgba(31,224,203,0.06), 0 20px 40px -24px rgba(0,0,0,.8)'] },
      { n: 'Bakehouse', kind: 'Neighborhood bakery', sw: ['#FFE9A8', '#E0402B'], site: 'crumbandco.com/learn/slow-fermentation', brand: 'Crumb & Co.', tl: 'How we bake', tp: 'Slow fermentation',
        df: 'Dough that rests for two days before it meets the oven. A longer rest means deeper flavor and a better crust.', mr: '3 related reads', mw: '6 loaves', th: 'Bread basics · 4 min read',
        ins: 'Why our sourdough takes two days', dk: 'The short version: time does the work that extra yeast can’t.', rm: 'Keep reading', rl: 'More to read',
        rel: [['Storing bread the right way', 'Guide'], ['Meet our miller', 'Video, 5 min'], ['What “heritage grain” means', 'Answer']],
        fq: 'Can I order loaves for a party?', fa: 'Yes. Give us three days’ notice, since the dough needs two of them to rest.',
        tk: ['#FFEFBF', '#FFF9E6', '#3B2313', '#7A5A3E', '#E0402B', '#F59E1B', '#FFF9E6', '#3B2313', "'Fredoka', 'Arial Rounded MT Bold', sans-serif", "'Nunito Sans', Arial, sans-serif", "'Fredoka', sans-serif", '700', '0em', 'none', 'normal', '22px', '999px', '20px', '14px', '2px', '4px 4px 0 #3B2313'] },
      { n: 'Atelier', kind: 'Architecture office', sw: ['#FFFFFF', '#111111'], site: 'ateliervos.eu/positions/adaptive-reuse', brand: 'Atelier Vos', tl: 'Position 04', tp: 'Adaptive reuse',
        df: 'The most sustainable building is usually the one already standing. We design the second life of existing structures.', mr: '05 texts', mw: '09 projects', th: 'Positions · 12 min',
        ins: 'Demolition is a design decision', dk: 'Every building we keep is a drawing we don’t need to make from scratch.', rm: 'Open text', rl: 'Related texts',
        rel: [['Measuring what’s already there', 'Text'], ['The grain store, one year on', 'Film, 14 min'], ['On keeping the stairs', 'Text']],
        fq: 'Can a listed building change use?', fa: 'Often, yes. We begin with a measured survey and an early talk with the heritage officer.',
        tk: ['#FFFFFF', '#FFFFFF', '#111111', '#6B6B6B', '#111111', '#D23C1E', '#FFFFFF', '#111111', "'Archivo Narrow', 'Arial Narrow', sans-serif", "'Archivo Narrow', 'Arial Narrow', sans-serif", "'IBM Plex Mono', monospace", '500', '-0.01em', 'uppercase', 'normal', '0px', '0px', '18px', '0px', '1px', 'none'] },
      { n: 'Clinic', kind: 'Physio practice', sw: ['#E7F3F0', '#23867B'], site: 'northsidephysio.com/conditions/lower-back-pain', brand: 'Northside Physio', tl: 'Conditions we treat', tp: 'Lower back pain',
        df: 'One of the most common reasons people come to see us. Most cases improve with the right kind of movement, rather than rest alone.', mr: '4 related guides', mw: '3 programs', th: 'Back & spine · 5 min read',
        ins: 'Why rest is rarely the whole answer', dk: 'What gentle, planned movement does for a sore back, and when to see someone.', rm: 'Read the guide', rl: 'Related guides',
        rel: [['Setting up a desk that helps', 'Guide'], ['Five-minute morning routine', 'Video, 6 min'], ['When to book a check-up', 'Answer']],
        fq: 'Do I need a referral to book?', fa: 'No. You can book directly. Bring any scans or letters you already have.',
        tk: ['#E9F4F1', '#FFFFFF', '#15373A', '#4F6D6E', '#23867B', '#8CC9BE', '#FFFFFF', 'rgba(21,55,58,0.12)', "'Nunito Sans', Arial, sans-serif", "'Nunito Sans', Arial, sans-serif", "'Nunito Sans', Arial, sans-serif", '750', '-0.015em', 'none', 'normal', '18px', '10px', '26px', '18px', '1px', '0 10px 30px -18px rgba(21,55,58,.35)'] }
    ];
    // the lines shown in the tokens panel: [token name, index into tk]
    var TOKLINES = [['color.bg', 0], ['color.accent', 4], ['font.heading', 8], ['radius.lg', 15], ['border.width', 19], ['space.pad', 17]];
    SCENE.add('cks-styles', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      st.innerHTML = '<div class="cx-bg"></div>' + bar('getcks.io/styles.html') +
        '<div class="cx-sty-l"><h4>Made to match any style.</h4><p>Same markup, same CMS fields. Only the site’s design variables change.</p>' +
          '<div class="cx-tabs" role="tablist" aria-label="Site personality">' + SKINS.map(function(s, i){ return '<button type="button" class="cx-tab" role="tab" data-i="' + i + '" style="--a:' + s.sw[0] + ';--b:' + s.sw[1] + '"><span class="sw"></span><span><b>' + esc(s.n) + '</b><small>' + esc(s.kind) + '</small></span></button>'; }).join('') + '</div>' +
          '<div class="cx-tok"><em>tokens.json</em>' + TOKLINES.map(function(l){ return '<div data-l="' + l[1] + '"><i>"' + l[0] + '"</i>: <b></b></div>'; }).join('') + '</div></div>' +
        '<div class="cx-frame"><div class="cx-skin">' +
          '<div class="cx-sbar"><span data-k="site"></span></div>' +
          '<div class="cx-snav"><b data-k="brand"></b><span class="cx-links"><i></i><i></i><i></i></span><span class="cx-sbtn">Contact</span></div>' +
          '<div class="cx-sgrid">' +
            '<div class="cx-card cx-topic"><em class="cx-lab" data-k="tl"></em><h5 data-k="tp"></h5><p data-k="df"></p><div class="cx-meta"><span data-k="mr"></span><span data-k="mw"></span></div></div>' +
            '<div class="cx-card cx-ins"><div class="cx-vis"><i></i><i></i><i></i></div><em class="cx-lab" data-k="th"></em><h6 data-k="ins"></h6><p data-k="dk"></p><span class="cx-more"><span data-k="rm"></span> →</span></div>' +
            '<div class="cx-card cx-rel"><em class="cx-lab" data-k="rl"></em>' + [0, 1, 2].map(function(i){ return '<div class="cx-row"><b data-k="r' + i + '"></b><span data-k="k' + i + '"></span></div>'; }).join('') + '</div>' +
            '<div class="cx-card cx-faq"><b data-k="fq"></b><p data-k="fa"></p></div>' +
          '</div></div></div>' +
        '<div class="cx-cap">Five examples. Yours will be the sixth.</div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var skin = q(st, '.cx-skin'), tabs = qa(st, '.cx-tab'), lines = qa(st, '.cx-tok div'), cur = q(st, '.cur.a'), txts = qa(skin, '[data-k]'), shown = -1;
      function apply(i, anim){
        var s = SKINS[i], prev = shown; shown = i;
        TK.forEach(function(k, j){ skin.style.setProperty('--sk-' + k, s.tk[j]); });
        skin.style.setProperty('--sk-l-track', s.tk[13] === 'uppercase' ? '.07em' : '0em');
        var map = { site: s.site, brand: s.brand, tl: s.tl, tp: s.tp, df: s.df, mr: s.mr, mw: s.mw, th: s.th, ins: s.ins, dk: s.dk, rm: s.rm, rl: s.rl, fq: s.fq, fa: s.fa };
        s.rel.forEach(function(r, k){ map['r' + k] = r[0]; map['k' + k] = r[1]; });
        txts.forEach(function(e){ e.textContent = map[e.getAttribute('data-k')]; });
        tabs.forEach(function(b, k){ b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        lines.forEach(function(l){
          var j = +l.getAttribute('data-l'), v = s.tk[j];
          q(l, 'b').textContent = '"' + (j === 8 ? v.split(',')[0].replace(/'/g, '') : v) + '"';
          l.classList.toggle('hot', prev > -1 && SKINS[prev].tk[j] !== v);
        });
        if (anim && !K.reduce && window.gsap){
          // the grid + nav wrappers, never the cards the timeline animates (overwrite would kill the loop's tweens)
          gsap.fromTo([q(skin, '.cx-snav'), q(skin, '.cx-sgrid')], { opacity: .2 }, { opacity: 1, duration: .5, stagger: .06, ease: 'power2.out', overwrite: true });
        }
      }
      // a visitor picks a site: the loop pauses and stays on their pick
      tabs.forEach(function(b, i){ tap(b, function(){ if (sc.hold) sc.hold(); apply(i, true); }); });
      apply(0, false);
      var R = run(sc, function(){ apply(0, false); }), tl = R.tl;
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 320 : 170, y: sc.SH + 30 }, 0);
      tl.fromTo(qa(st, '.cx-card'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .08, ease: 'power3.out', immediateRender: false }, .2);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .9);
      var t = 1.1;
      [1, 2, 3, 4, 0].forEach(function(i){
        move(R, cur, pos(st, tabs[i], P ? .5 : .3, .6), t, .7); click(R, tabs[i], t + .7);
        (function(k){ R.at(t + .75, function(){ apply(k, true); }); })(i);
        t += 3.1;
      });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t - 1.6);
      end(sc, R, t + .6, t - 2.2);
    });

    /* ---------------- 2 · WOVEN ON SCROLL: the home story ---------------- */
    // [kind, where it lived, title, topics, p0, p1, p2 (= p3)], positions in % of the board (story section markup)
    var STOPICS = [['t1', 'Client onboarding', SAF, 50, 40], ['t2', 'Journey mapping', TEA, 24, 71], ['t3', 'Client handoffs', COB, 76, 71]];
    var SCARDS = [
      ['Service', 'Services page', 'Onboarding redesign', 't1', [15, 12, -6], [15, 12, 0], [16, 21, 0]],
      ['Service', 'Services page', 'Client portal build', 't3', [33, 27, 5], [33, 27, 0], [50, 88, 0]],
      ['Project', 'Portfolio', 'Riverside Clinic intake', 't1 t2', [78, 10, 5], [78, 10, 0], [17, 48, 0]],
      ['Project', 'Portfolio', 'Hale & Partners', 't1 t3', [86, 31, -4], [86, 31, 0], [83, 48, 0]],
      ['Insight', 'Blog · 2023', 'Onboarding is a design problem', 't1', [21, 70, 3], [21, 70, 0], [50, 10, 0]],
      ['Insight', 'Blog · 2022', 'Why handoffs fail on Fridays', 't3', [45, 88, -5], [45, 88, 0], [83, 92, 0]],
      ['News', 'Blog · March', 'March update', '', [62, 62, 6], [62, 62, 0], [50, 63, 0]],
      ['Answer', 'FAQ page', 'How long does onboarding take?', 't1', [84, 80, -3], [84, 80, 0], [84, 21, 0]],
      ['Video', 'YouTube only', 'The first 30 days, in 9 minutes', 't2', [54, 40, -8], [54, 40, 0], [17, 92, 0]]
    ];
    var SSTEPS = [['Scattered', 'A services page, a portfolio and a blog that never mention each other.'], ['Name the ideas', 'A shared vocabulary names what you know, in your own words.'],
      ['Tag once', 'Each page gets tagged with the ideas it proves. One field, filled in once.'], ['Connected', 'Topic pages, related rows and structured data build themselves from those tags.']];
    SCENE.add('cks-story', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var B = P ? { x: 22, y: 170, w: 584, h: 540 } : { x: 452, y: 70, w: 700, h: 566 };
      var TC = { t1: SAF, t2: TEA, t3: COB };
      st.innerHTML = '<div class="cx-bg"></div>' + bar('getcks.io/#story') +
        '<div class="cx-st-copy"><h4>Most sites list what you do. Few show how it connects.</h4><ol class="cx-steps">' +
          SSTEPS.map(function(s, i){ return '<li><button type="button" data-s="' + i + '"><i></i><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></button></li>'; }).join('') +
          '</ol><p class="cx-hint">Scroll to weave it, or pick a step.</p></div>' +
        '<div class="cx-board" style="left:' + B.x + 'px;top:' + B.y + 'px;width:' + B.w + 'px;height:' + B.h + 'px"><svg class="cx-thr" viewBox="0 0 ' + B.w + ' ' + B.h + '" aria-hidden="true"></svg>' +
          STOPICS.map(function(t){ return '<div class="cx-sto" data-t="' + t[0] + '" style="--c:' + t[2] + '"><small>Topic</small>' + esc(t[1]) + '</div>'; }).join('') +
          SCARDS.map(function(c, i){ return '<div class="cx-sc' + (c[3] ? '' : ' is-loose') + '" data-i="' + i + '" data-tags="' + c[3] + '"><small>' + esc(c[0]) + '<em>' + esc(c[1]) + '</em></small>' + esc(c[2]) + '<span class="cx-tg">' + (c[3] ? c[3].split(' ').map(function(k){ return '<i style="--c:' + TC[k] + '"></i>'; }).join('') : '') + '</span></div>'; }).join('') +
        '</div>' +
        '<div class="cx-st-meta" style="left:' + B.x + 'px;top:' + (B.y + B.h + 14) + 'px;width:' + B.w + 'px"><p><b class="cx-cnt">0</b> links built from one field on each page</p><p class="cx-schema"><code>{ }</code> Structured data, from the same tags</p></div>' +
        '<div class="cx-rail" role="slider" tabindex="0" aria-label="Scroll the story" aria-valuemin="0" aria-valuemax="3"><i></i></div>' +
        '<div class="fg-fade"></div>';
      var board = q(st, '.cx-board'), svg = q(st, '.cx-thr'), cards = qa(st, '.cx-sc'), tops = qa(st, '.cx-sto'), stepB = qa(st, '.cx-steps button'), cnt = q(st, '.cx-cnt'), schema = q(st, '.cx-schema'), rail = q(st, '.cx-rail'), thumb = q(rail, 'i');
      function px(p){ return { x: p[0] / 100 * B.w, y: p[1] / 100 * B.h }; }
      var TP = {}; STOPICS.forEach(function(t){ TP[t[0]] = px([t[3], t[4]]); });
      tops.forEach(function(e, i){ var p = TP[STOPICS[i][0]]; e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; });
      // threads: from each tagged card's final place to its topic, bowed gently
      var TH = [];
      SCARDS.forEach(function(c, i){ if (!c[3]) return; c[3].split(' ').forEach(function(k){
        var a = px(c[6]), b = TP[k], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nx = -(b.y - a.y) * .12, ny = (b.x - a.x) * .12;
        var p = pth(svg, 'M' + a.x + ' ' + a.y + 'Q' + (mx + nx) + ' ' + (my + ny) + ' ' + b.x + ' ' + b.y, 'cx-ln');
        p.style.stroke = TC[k]; p.setAttribute('data-t', k); p.setAttribute('data-i', i); TH.push(p);
      }); });
      var state = -1, F = 0;
      // the story.js frame: every value at a (possibly fractional) state, so scrubbing interpolates
      function frame(f){
        F = f; var a = Math.floor(Math.min(f, 2.999)), k = f - a;
        function lerp(p, qq){ return p + (qq - p) * k; }
        cards.forEach(function(el, i){
          var c = SCARDS[i], Ps = [c[4], c[5], c[6], c[6]], A = Ps[a], Bq = Ps[a + 1], loose = !c[3];
          var o0 = a === 0 ? 1 : a === 1 ? .62 : 1, o1 = a + 1 === 1 ? .62 : (a + 1 === 3 && loose) ? .38 : 1;
          if (a === 2 && loose) o0 = .7; if (a === 1 && loose) o1 = .7;
          var p = px([lerp(A[0], Bq[0]), lerp(A[1], Bq[1])]);
          el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
          el.style.transform = 'translate(-50%,-50%) rotate(' + lerp(A[2] || 0, Bq[2] || 0) + 'deg)';
          el.style.opacity = lerp(o0, o1);
          el.style.setProperty('--tag', loose ? 0 : c01((f - 1.55) / .45));
          el.style.setProperty('--old', Math.max(0, 1 - f * 1.4));
        });
        var tin = c01((f - .45) / .55);
        tops.forEach(function(e, i){ var d = c01(tin * 1.4 - i * .2); e.style.opacity = d; e.style.transform = 'translate(-50%,-50%) scale(' + (.7 + .3 * d) + ')'; });
        var dk = c01((f - 2.15) / .8);
        TH.forEach(function(p, i){ var kk = c01(dk * 1.5 - i * .05); p.style.strokeDashoffset = p._L * (1 - kk); });
        cnt.textContent = Math.round(TH.length * dk);
        schema.style.opacity = c01((f - 2.65) / .35);
        thumb.style.top = (f / 3 * 100) + '%'; rail.setAttribute('aria-valuenow', Math.round(f));
        var s = Math.min(3, Math.max(0, Math.round(f - .1)));
        if (s !== state){ state = s; stepB.forEach(function(b, j){ b.classList.toggle('on', j === s); b.classList.toggle('done', j < s); b.setAttribute('aria-current', j === s ? 'step' : 'false'); }); }
      }
      // take over: step buttons ease to a state, the rail scrubs, a topic lights its threads
      var drive = { f: 0 };
      function goTo(f){ if (sc.hold) sc.hold(); drive.f = F; if (window.gsap && !K.reduce) gsap.to(drive, { f: f, duration: .8, ease: 'power2.inOut', overwrite: true, onUpdate: function(){ frame(drive.f); } }); else frame(f); }
      stepB.forEach(function(b, i){ tap(b, function(){ goTo(i); }); });
      var dragging = false;
      function scrub(e){ var r = rail.getBoundingClientRect(); frame(c01((e.clientY - r.top) / r.height) * 3); }
      rail.addEventListener('pointerdown', function(e){ dragging = true; if (sc.hold) sc.hold(); rail.setPointerCapture(e.pointerId); scrub(e); });
      rail.addEventListener('pointermove', function(e){ if (dragging) scrub(e); });
      rail.addEventListener('pointerup', function(){ dragging = false; });
      rail.addEventListener('keydown', function(e){ var d = { ArrowDown: .25, ArrowRight: .25, ArrowUp: -.25, ArrowLeft: -.25 }[e.key]; if (d == null) return; e.preventDefault(); if (sc.hold) sc.hold(); frame(Math.max(0, Math.min(3, F + d))); });
      function light(k){ board.classList.toggle('has-hl', !!k); cards.forEach(function(c){ c.classList.toggle('hl', !!k && (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + k + ' ') > -1); }); TH.forEach(function(p){ p.classList.toggle('hl', p.getAttribute('data-t') === k); }); tops.forEach(function(t){ t.classList.toggle('hl', t.getAttribute('data-t') === k); }); }
      tops.forEach(function(t){ t.addEventListener('pointerenter', function(){ light(t.getAttribute('data-t')); }); t.addEventListener('pointerleave', function(){ light(null); }); });
      frame(0);
      var o = { f: 0 }, R = run(sc, function(){ frame(0); }), tl = R.tl;
      function fr(){ frame(o.f); }
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(o, { f: 0 }, 0);
      tl.addLabel('s0', 0);
      tl.to(o, { f: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: fr }, 1.6).addLabel('s1', 1.6);
      tl.to(o, { f: 2, duration: 1.4, ease: 'power1.inOut', onUpdate: fr }, 4.4).addLabel('s2', 4.4);
      tl.to(o, { f: 3, duration: 1.9, ease: 'power1.inOut', onUpdate: fr }, 7.2).addLabel('s3', 7.2);
      end(sc, R, 13.6, 12);
    });

    /* ---------------- 3 · GROW THE MAP: the knowledge map ---------------- */
    // six topics (one per vocabulary category) and the pieces tagged with them: graph.js's whole "database"
    var GT = { t1: ['Professional firms', SAF, 'Who you help', 'Accounting, legal and advisory firms of five to fifty people, where the partners still do the selling.'],
      t2: ['Service design', COR, 'Services', 'Designing the whole experience of working with you, not just the screens a client happens to see.'],
      t3: ['Journey mapping', TEA, 'How it works', 'Walking every step a client takes, with the people who serve them, before anything is redesigned.'],
      t4: ['Client handoffs', COB, 'What you watch for', 'The moments work passes between people. Most client complaints start in one of them.'],
      t5: ['Client onboarding', OCH, 'Ideas', 'The first month with a new client is a product. Design it on purpose, or it designs itself.'],
      t6: ['Plain-language UX', INK, 'Known for', 'Forms, emails and portals that a tired person can understand the first time they read them.'] };
    var GP = { a1: ['Insight', 'Onboarding is a design problem'], a2: ['Insight', 'The first 30 days decide the next three years'], a3: ['Insight', 'Why handoffs fail on Friday afternoons'],
      a4: ['Video', 'What a journey map is really for'], q1: ['FAQ', 'How long does a redesign take?'], q2: ['FAQ', 'Do you work with small firms?'],
      p1: ['Project', 'Riverside Clinic intake'], p2: ['Project', 'Hale & Partners onboarding'], p3: ['Project', 'Northgate client portal'],
      s1: ['Service', 'Service design sprint'], s2: ['Service', 'Onboarding redesign'], s3: ['Service', 'Client portal build'] };
    var GE0 = { t1: ['a2', 'q2', 'p2', 'p3', 's1'], t2: ['a1', 'a3', 'p1', 's1', 'q1'], t3: ['a1', 'a4', 'p1', 's1'], t4: ['a3', 'p2', 's3', 'q1'], t5: ['a1', 'a2', 'p1', 's2'], t6: ['a4', 'p3', 's3', 'q2'] };
    var GICO = { Insight: '<svg viewBox="0 0 12 12"><path d="M2 2h8M2 5h8M2 8h5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>', Video: '<svg viewBox="0 0 12 12"><path d="M4 2.5v7l5.5-3.5z" fill="currentColor"/></svg>',
      FAQ: '<svg viewBox="0 0 12 12"><path d="M4.2 4.4a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="6" cy="9.6" r=".8" fill="currentColor"/></svg>',
      Project: '<svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>', Service: '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>' };
    var GROW = { id: 'g0', title: 'Every handoff needs an owner', tags: ['t4', 't2'] };
    SCENE.add('cks-map', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg, TOP = Object.keys(GT);
      var MA = P ? { x: 0, y: 176, w: 640, h: 624, rx: 128, ry: 132, ox: 238, oy: 262 } : { x: 0, y: 112, w: 1200, h: 638, rx: 250, ry: 142, ox: 462, oy: 250 };
      var CX = MA.w / 2, CY = MA.h / 2 + 4;
      var E = {}; TOP.forEach(function(t){ E[t] = GE0[t].slice(); });
      function node(id, cls, inner){ return '<button type="button" class="cx-gn ' + cls + '" data-id="' + id + '"' + inner + '</button>'; }
      st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/#graph') +
        '<div class="cx-gbar"><label class="cx-gs"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.6 12.6 17 17"/></svg><input type="search" placeholder="Find: handoff, portal, onboarding…" autocomplete="off" aria-label="Find a topic or page on the map"><em></em></label>' +
          '<span class="cx-tally"><b>12</b> pages · <b>26</b> links</span><button type="button" class="cx-growb" aria-pressed="false">+ Grow the map</button></div>' +
        '<form class="cx-grow" novalidate><label>New insight<input type="text" maxlength="60" autocomplete="off" placeholder="What’s the idea, in your words?"></label><fieldset><legend>Tag it with</legend>' +
          TOP.map(function(t){ return '<button type="button" class="cx-tc" data-t="' + t + '" aria-pressed="false" style="--c:' + GT[t][1] + '">' + esc(GT[t][0]) + '</button>'; }).join('') +
          '</fieldset><div class="cx-gogo"><button type="submit" class="cx-add">Add to the map</button><span class="cx-note">Adds to this monitor only. Nothing is saved.</span></div></form>' +
        '<div class="cx-gx" style="left:' + MA.x + 'px;top:' + MA.y + 'px;width:' + MA.w + 'px;height:' + MA.h + 'px"><div class="cx-gin"><svg class="cx-gthr" viewBox="0 0 ' + MA.w + ' ' + MA.h + '" aria-hidden="true"></svg>' +
          TOP.map(function(t){ return node(t, 'is-t', ' style="--c:' + GT[t][1] + '"><span class="k"></span>' + esc(GT[t][0])); }).join('') +
          Object.keys(GP).map(function(id){ return node(id, '', ' data-kind="' + GP[id][0] + '"><span class="k">' + GICO[GP[id][0]] + '</span>' + esc(GP[id][1])); }).join('') +
          node(GROW.id, 'is-new', ' data-kind="Insight"><span class="k">' + GICO.Insight + '</span>' + esc(GROW.title)) +
        '</div><p class="cx-ghint">Drag to pan · hover to follow a thread</p></div>' +
        '<div class="cx-ro"><em></em><b></b><p></p><div class="cx-ron"></div></div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var gx = q(st, '.cx-gx'), gin = q(st, '.cx-gin'), svg = q(st, '.cx-gthr'), N = {}, POS = {}, PATHS = [];
      qa(st, '.cx-gn').forEach(function(n){ N[n.getAttribute('data-id')] = n; });
      var inp = q(st, '.cx-gs input'), found = q(st, '.cx-gs em'), tally = qa(st, '.cx-tally b'), growB = q(st, '.cx-growb'), form = q(st, '.cx-grow'), title = q(form, 'input'), chips = qa(form, '.cx-tc'), add = q(form, '.cx-add');
      var ro = q(st, '.cx-ro'), cur = q(st, '.cur.a');
      function isT(id){ return !!GT[id]; }
      function topicsFor(id){ return isT(id) ? [id] : TOP.filter(function(t){ return E[t].indexOf(id) > -1; }); }
      function nm(id){ return isT(id) ? GT[id][0] : GP[id] ? GP[id][1] : (N[id].textContent || '').trim(); }
      function kind(id){ return N[id].getAttribute('data-kind') || 'Insight'; }
      function links(){ return TOP.reduce(function(n, t){ return n + E[t].length; }, 0); }
      /* layout: graph.js (topics on an inner ring, each piece at the circular mean of its topics, spread, then relaxed) */
      function angleOf(t){ return (-90 + TOP.indexOf(t) * 60) * Math.PI / 180; }
      function target(id){ var ts = topicsFor(id), vx = 0, vy = 0; ts.forEach(function(t){ vx += Math.cos(angleOf(t)); vy += Math.sin(angleOf(t)); }); return Math.sqrt(vx * vx + vy * vy) < .3 ? angleOf(ts[0]) + .35 : Math.atan2(vy, vx); }
      function ring(a){ return { x: CX + Math.cos(a) * MA.ox, y: CY + Math.sin(a) * MA.oy }; }
      function place(id){ if (isT(id)){ var a = angleOf(id); return { x: CX + Math.cos(a) * MA.rx, y: CY + Math.sin(a) * MA.ry }; } return ring(target(id)); }
      function spread(ids){
        var T = 2 * Math.PI, L = ids.map(function(id){ var a = target(id); return { id: id, a: (a % T + T) % T }; });
        L.sort(function(p, r){ return p.a - r.a; });
        var n = L.length, off = 0;
        L.forEach(function(p, i){ var d = p.a - i * T / n; off += Math.atan2(Math.sin(d), Math.cos(d)); }); off /= n;
        L.forEach(function(p, i){ var s = off + i * T / n, d = Math.atan2(Math.sin(s - p.a), Math.cos(s - p.a)); POS[p.id] = ring(p.a + d * .65); });
      }
      function relax(ids, fixed){
        var R2 = ids.map(function(id){ return { id: id, x: POS[id].x, y: POS[id].y, w: N[id].offsetWidth + 14, h: N[id].offsetHeight + 12, fix: isT(id) || !!(fixed && fixed[id]) }; });
        function clamp(r){ var nx = Math.max(r.w / 2 + 6, Math.min(MA.w - r.w / 2 - 6, r.x)), ny = Math.max(r.h / 2 + 6, Math.min(MA.h - r.h / 2 - 6, r.y)); r.ex = nx !== r.x; r.ey = ny !== r.y; r.x = nx; r.y = ny; }
        for (var it = 0; it < 260; it++){
          var moved = false;
          for (var i = 0; i < R2.length; i++) for (var j = i + 1; j < R2.length; j++){
            var a = R2[i], b = R2[j]; if (a.fix && b.fix) continue;
            var ox = (a.w + b.w) / 2 - Math.abs(a.x - b.x), oy = (a.h + b.h) / 2 - Math.abs(a.y - b.y);
            if (ox <= 0 || oy <= 0) continue;
            moved = true;
            var wa = a.fix ? 0 : (b.fix ? 1 : .5), wb = 1 - wa, useX = ox * .45 < oy;
            if ((a.ex || b.ex) && useX) useX = false;
            if ((a.ey || b.ey) && !useX && !(a.ex || b.ex)) useX = true;
            if (useX){ var sx = (a.x < b.x || (a.x === b.x && i < j) ? -1 : 1) * (ox + .5); a.x += sx * wa; b.x -= sx * wb; }
            else { var sy = (a.y < b.y || (a.y === b.y && i < j) ? -1 : 1) * (oy + .5); a.y += sy * wa; b.y -= sy * wb; }
            clamp(a); clamp(b);
          }
          if (!moved) break;
        }
        R2.forEach(function(r){ POS[r.id] = { x: r.x, y: r.y }; });
      }
      // nodes are centered on their point by CSS (translate: -50% -50%), so a late web font can't shift them
      function applyPos(id, p){ p = p || POS[id]; var n = N[id]; n.style.left = p.x.toFixed(1) + 'px'; n.style.top = p.y.toFixed(1) + 'px'; }
      function curve(a, b){ var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, qx = mx + (CX - mx) * .18, qy = my + (CY - my) * .18; return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'Q' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1); }
      function thread(t, id){ var p = pth(svg, curve(POS[t], POS[id]), 'cx-gl'); p.style.setProperty('--c', GT[t][1]); p.setAttribute('data-t', t); p.setAttribute('data-n', id); return p; }
      var BASE = Object.keys(N).filter(function(id){ return id !== GROW.id; });
      BASE.forEach(function(id){ POS[id] = place(id); });
      spread(BASE.filter(function(id){ return !isT(id); }));
      relax(BASE);
      BASE.forEach(function(id){ applyPos(id); });
      TOP.forEach(function(t){ E[t].forEach(function(id){ PATHS.push(thread(t, id)); }); });
      // the autoplay's new piece: starts between its topics, settles where the layout puts it (everything else holds still)
      var fixed = {}; BASE.forEach(function(id){ fixed[id] = 1; });
      GROW.tags.forEach(function(t){ E[t].push(GROW.id); });
      var gStart = { x: 0, y: 0 }; GROW.tags.forEach(function(t){ gStart.x += POS[t].x / GROW.tags.length; gStart.y += POS[t].y / GROW.tags.length; });
      POS[GROW.id] = place(GROW.id); relax(Object.keys(N), fixed);
      var gEnd = POS[GROW.id], gNode = N[GROW.id]; applyPos(GROW.id);
      var gPaths = GROW.tags.map(function(t){ return thread(t, GROW.id); });
      GROW.tags.forEach(function(t){ E[t].splice(E[t].indexOf(GROW.id), 1); });
      var grownOn = false;
      function setGrown(on){ grownOn = on; GROW.tags.forEach(function(t){ var k = E[t].indexOf(GROW.id); if (on && k < 0) E[t].push(GROW.id); if (!on && k > -1) E[t].splice(k, 1); }); }
      /* focus + readout (graph.js) */
      function kinds(t){ var c = { Insight: 0, Video: 0, Project: 0, Service: 0, FAQ: 0 }; E[t].forEach(function(x){ c[kind(x)]++; }); return c; }
      function readout(id){
        var ts = topicsFor(id); if (!ts.length) return;
        var t0 = ts[0], c = kinds(t0);
        q(ro, 'em').textContent = isT(id) ? 'Topic page · ' + GT[t0][2] : kind(id) + ' · tagged with ' + ts.length + ' topic' + (ts.length === 1 ? '' : 's');
        q(ro, 'b').textContent = nm(id);
        q(ro, 'p').textContent = isT(id) ? GT[t0][3] : 'Shows up on ' + ts.map(function(t){ return GT[t][0]; }).join(', ') + '.';
        q(ro, '.cx-ron').innerHTML = [['insights', c.Insight + c.Video], ['projects', c.Project], ['services', c.Service], ['answers', c.FAQ]].map(function(r){ return '<span><b>' + r[1] + '</b>' + r[0] + '</span>'; }).join('');
      }
      function focus(id){
        var ts = topicsFor(id), lit = {};
        ts.forEach(function(t){ lit[t] = 1; E[t].forEach(function(n){ if (isT(id) || n === id) lit[n] = 1; }); });
        gx.classList.toggle('has-focus', !!id);
        Object.keys(N).forEach(function(k){ var n = N[k]; n.classList.toggle('lit', !!lit[k]); n.classList.toggle('src', k === id); if (!isT(k)) n.style.setProperty('--c', lit[k] && ts[0] ? GT[ts[0]][1] : ''); });
        qa(svg, 'path').forEach(function(p){ var on = !!id && ts.indexOf(p.getAttribute('data-t')) > -1 && (isT(id) || p.getAttribute('data-n') === id); p.classList.toggle('on', on); if (on) svg.appendChild(p); });
        if (id) readout(id);
      }
      function unfocus(){ gx.classList.remove('has-focus'); Object.keys(N).forEach(function(k){ N[k].classList.remove('lit', 'src'); if (!isT(k)) N[k].style.removeProperty('--c'); }); qa(svg, 'path').forEach(function(p){ p.classList.remove('on'); }); readout('t5'); }
      function search(v){
        v = (v || '').trim().toLowerCase();
        if (v.length < 2){ found.textContent = ''; unfocus(); gx.classList.remove('is-search'); return; }
        var hit = Object.keys(N).filter(function(k){ return (N[k].style.visibility !== 'hidden' && !(k === GROW.id && !grownOn)) && nm(k).toLowerCase().indexOf(v) > -1; });
        gx.classList.add('is-search', 'has-focus');
        Object.keys(N).forEach(function(k){ N[k].classList.toggle('lit', hit.indexOf(k) > -1); N[k].classList.remove('src'); });
        qa(svg, 'path').forEach(function(p){ p.classList.toggle('on', hit.indexOf(p.getAttribute('data-t')) > -1 || hit.indexOf(p.getAttribute('data-n')) > -1); });
        found.textContent = hit.length + ' found';
        if (hit[0]) readout(hit[0]);
      }
      function setTally(p, l){ tally[0].textContent = p; tally[1].textContent = l; }
      function openForm(on){ form.classList.toggle('on', on); growB.setAttribute('aria-pressed', on ? 'true' : 'false'); }
      /* a visitor's own pieces (not part of the loop; the next loop clears them) */
      var mine = [];
      function growMine(){
        var tags = chips.filter(function(c){ return c.getAttribute('aria-pressed') === 'true'; }).map(function(c){ return c.getAttribute('data-t'); });
        var tt = (title.value || '').trim().slice(0, 60);
        if (!tt || !tags.length){ q(form, '.cx-note').textContent = !tt ? 'Give it a title first.' : 'Pick at least one topic.'; return; }
        var id = 'm' + (mine.length + 1), b = document.createElement('button');
        b.type = 'button'; b.className = 'cx-gn is-new is-mine'; b.setAttribute('data-id', id); b.setAttribute('data-kind', 'Insight');
        b.innerHTML = '<span class="k">' + GICO.Insight + '</span>' + esc(tt); gin.appendChild(b); N[id] = b; bind(id);
        tags.forEach(function(t){ E[t].push(id); });
        var fx = {}; Object.keys(POS).forEach(function(k){ fx[k] = 1; });
        var s0 = { x: 0, y: 0 }; tags.forEach(function(t){ s0.x += POS[t].x / tags.length; s0.y += POS[t].y / tags.length; });
        POS[id] = place(id); relax(Object.keys(POS).concat(id), fx);
        var e1 = POS[id], ps = tags.map(function(t){ return thread(t, id); });
        applyPos(id, s0); mine.push({ id: id, tags: tags, paths: ps });
        if (window.gsap && !K.reduce){
          gsap.fromTo(b, { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.6)' });
          gsap.to(b, { left: e1.x, top: e1.y, duration: .9, ease: 'power3.inOut', delay: .35 });
          ps.forEach(function(p, i){ gsap.to(p, { strokeDashoffset: 0, duration: .6, delay: 1.1 + i * .12 }); });
        } else { applyPos(id); ps.forEach(function(p){ p.style.strokeDashoffset = 0; }); }
        setTally(12 + (grownOn ? 1 : 0) + mine.length, links());
        title.value = ''; chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
        q(form, '.cx-note').textContent = 'Added. It found its place from its tags.'; openForm(false);
        setTimeout(function(){ focus(id); }, 900);
      }
      function clearMine(){ mine.forEach(function(m){ m.tags.forEach(function(t){ var k = E[t].indexOf(m.id); if (k > -1) E[t].splice(k, 1); }); m.paths.forEach(function(p){ p.remove(); }); N[m.id].remove(); delete N[m.id]; delete POS[m.id]; }); mine = []; }
      function bind(id){
        var n = N[id];
        n.addEventListener('pointerenter', function(){ if (!gx.classList.contains('is-search')) focus(id); });
        n.addEventListener('pointerleave', function(){ if (sc.paused || gx.classList.contains('is-search')) return; unfocus(); });
        tap(n, function(){ if (sc.hold) sc.hold(); focus(id); });
      }
      Object.keys(N).forEach(bind);
      inp.addEventListener('focus', function(){ if (sc.hold) sc.hold(); });
      inp.addEventListener('input', function(){ search(inp.value); });
      tap(growB, function(){ if (sc.hold) sc.hold(); openForm(!form.classList.contains('on')); if (form.classList.contains('on')) title.focus(); });
      title.addEventListener('focus', function(){ if (sc.hold) sc.hold(); });
      chips.forEach(function(c){ tap(c, function(){ if (sc.hold) sc.hold(); c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
      form.addEventListener('submit', function(e){ e.preventDefault(); if (sc.hold) sc.hold(); growMine(); });
      // drag to pan
      var pan = { x: 0, y: 0 }, drag = null;
      gx.addEventListener('pointerdown', function(e){ if (e.target.closest('.cx-gn')) return; drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; gx.setPointerCapture(e.pointerId); gx.classList.add('is-drag'); });
      gx.addEventListener('pointermove', function(e){ if (!drag) return; var k = sc.k || 1; pan.x = drag.px + (e.clientX - drag.x) / k; pan.y = drag.py + (e.clientY - drag.y) / k; gin.style.transform = 'translate(' + pan.x + 'px,' + pan.y + 'px)'; if (sc.hold && (Math.abs(e.clientX - drag.x) > 4)) sc.hold(); });
      gx.addEventListener('pointerup', function(){ drag = null; gx.classList.remove('is-drag'); });
      /* the loop */
      var nodesT = TOP.map(function(t){ return N[t]; }), nodesP = BASE.filter(function(id){ return !isT(id); }).map(function(id){ return N[id]; });
      var R = run(sc, function(){
        clearMine(); pan.x = pan.y = 0; gin.style.transform = '';
        setGrown(false); inp.value = ''; title.value = ''; found.textContent = ''; gx.classList.remove('is-search'); openForm(false);
        chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); q(form, '.cx-note').textContent = 'Adds to this monitor only. Nothing is saved.';
        unfocus(); setTally(12, 26);
      });
      var tl = R.tl;
      tl.addLabel('map', 0);
      PATHS.concat(gPaths).forEach(function(p){ hide(R, p); });
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0).set(gNode, { autoAlpha: 0, scale: .4, left: gStart.x, top: gStart.y }, 0);
      tl.fromTo(nodesT, { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .45, stagger: .08, ease: 'back.out(1.8)', immediateRender: false }, .2);
      tl.fromTo(nodesP, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, stagger: .04, immediateRender: false }, .7);
      PATHS.forEach(function(p, i){ draw(R, p, 1.1 + i * .035, .5); });
      count(R, tally[0], 0, 12, .7, .9); count(R, tally[1], 0, 26, 1.1, 1.2);
      var t = 3.2;
      tl.addLabel('search', t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      move(R, cur, pos(st, inp, .3, .7), t, .7); click(R, q(st, '.cx-gs'), t + .7);
      var te = typeVal(R, inp, 'hand', t + .9, .7);
      R.at(te + .05, function(){ search('hand'); });
      tl.set(inp, { value: '' }, 0);
      R.at(te + 2.4, function(){ inp.value = ''; search(''); });
      t = te + 2.8;
      tl.addLabel('grow', t);
      move(R, cur, pos(st, growB, .5, .6), t, .7); click(R, growB, t + .7);
      R.at(t + .75, function(){ openForm(true); });
      move(R, cur, pos(st, title, .3, .7), t + 1.1, .6);
      tl.set(title, { value: '' }, 0);
      t = typeVal(R, title, GROW.title, t + 1.8, 1.4);
      GROW.tags.forEach(function(k, i){ var c = q(form, '[data-t="' + k + '"]'); move(R, cur, pos(st, c, .5, .7), t + .2 + i * .9, .55); click(R, c, t + .75 + i * .9); R.at(t + .8 + i * .9, function(){ c.setAttribute('aria-pressed', 'true'); }); });
      t += .3 + GROW.tags.length * .9;
      move(R, cur, pos(st, add, .5, .6), t, .55); click(R, add, t + .55);
      R.at(t + .6, function(){ openForm(false); setGrown(true); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + .8);
      tl.to(gNode, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' }, t + .7);
      tl.to(gNode, { left: gEnd.x, top: gEnd.y, duration: 1, ease: 'power3.inOut' }, t + 1.2);
      gPaths.forEach(function(p, i){ draw(R, p, t + 2 + i * .15, .6); });
      count(R, tally[0], 12, 13, t + 2, .3, '', true); count(R, tally[1], 26, 28, t + 2, .6, '', true);
      R.at(t + 2.3, function(){ focus(GROW.id); });
      end(sc, R, t + 7.2, t + 4, [{ t: 'Map', at: 'map' }, { t: 'Search', at: 'search' }, { t: 'Grow', at: 'grow' }]);
    });

    /* ---------------- 4 · SKETCH YOUR SYSTEM: the sketch tool ---------------- */
    // sketch.js: each term is [label, keywords]; keywords are matched against page titles (US spelling here)
    var SKF = ['#F2A93B', '#EF5B3F', '#139E8A', '#2F5BEA', '#C7832A', '#0B1B2B'];
    var SKV = {
      law: [['Who you help', [['Family businesses', 'family business owner owners farm company'], ['Founders', 'founder founders cofounder'], ['Landlords', 'landlord landlords property'], ['Non-profits', 'nonprofit charity charities']]],
        ['Practice areas', [['Succession planning', 'succession exit retire retirement generation'], ['Buy-sell agreements', 'buysell buyout agreement agreements'], ['Commercial leases', 'lease leases commercial tenant'], ['Wills and trusts', 'will wills trust trusts estate'], ['Employment law', 'employment employee employees contract contracts hire']]],
        ['How you work', [['Fixed fees', 'fee fees fixed cost costs price'], ['Plain-language drafting', 'plain drafting language'], ['Kitchen-table meetings', 'meeting meetings kitchen consultation']]],
        ['What you watch for', [['Family disputes', 'dispute disputes conflict'], ['Tax on exit', 'tax taxes'], ['Key-person risk', 'risk keyperson']]],
        ['Ideas', [['The handshake is not the plan', 'handshake'], ['Start before you need to', 'start early when']]],
        ['Known for', [['Succession planning', 'succession generation'], ['Plain-language drafting', 'plain']]]],
      bakery: [['Who it’s for', [['Neighbors', 'neighbor neighbors neighbour neighbours neighborhood neighbourhood local community corner'], ['Cafés and restaurants', 'cafe cafes café cafés restaurant restaurants wholesale'], ['Weddings and parties', 'wedding weddings party parties celebration']]],
        ['What we bake', [['Sourdough', 'sourdough bread breads loaf loaves'], ['Pastries', 'pastry pastries croissant croissants bun buns'], ['Celebration cakes', 'cake cakes birthday celebration'], ['Wholesale bread', 'wholesale']]],
        ['How we make it', [['Long fermentation', 'ferment fermentation overnight'], ['Local flour', 'flour miller mill grain wheat'], ['Baked each morning', 'fresh daily']]],
        ['What we care about', [['Less waste', 'waste yesterday leftover leftovers'], ['Allergies and labels', 'allergy allergies allergen gluten glutenfree label labels']]],
        ['Ideas', [['Slow bread is better bread', 'slow'], ['Bread is a neighborhood thing', 'neighborhood neighbourhood']]],
        ['Known for', [['Sourdough', 'sourdough'], ['Morning buns', 'bun buns']]]],
      clinic: [['Who you help', [['Runners', 'runner runners running marathon'], ['Desk workers', 'desk office posture'], ['After surgery', 'surgery postop rehab']]],
        ['Treatments', [['Sports physio', 'sport sports physiotherapy injury'], ['Back and neck pain', 'neck pain backache'], ['Knee rehab', 'knee acl'], ['Pelvic health', 'pelvic']]],
        ['How it works', [['Movement assessment', 'assessment assess sessions'], ['Home exercise plans', 'exercise exercises stretch stretches home'], ['Online appointments', 'online video appointment appointments']]],
        ['What we watch for', [['Injuries that come back', 'recurring return again'], ['Pain that isn’t improving', 'improving persistent chronic']]],
        ['Ideas', [['Rest isn’t always the answer', 'rest'], ['Strength is the treatment', 'strength strong']]],
        ['Known for', [['Knee rehab', 'knee acl'], ['Runners', 'marathon runner runners']]]]
    };
    var SKS = {
      law: { n: 'Counsel', d: 'A law firm · 12 pages', sw: ['#F4EDE1', '#7A1F2B'], cut: 'Landlords', ren: ['Founders', 'Company founders'], pages: [
        ['Service', 'Succession planning'], ['Service', 'Commercial leases'], ['Service', 'Wills and trusts'], ['Service', 'Employment law'],
        ['Project', 'Passing the family farm to the next generation'], ['Project', 'A buyout between two founders'],
        ['Article', 'What a buy-sell agreement covers'], ['Article', 'When should owners start succession talks?'],
        ['Answer', 'How much does a will cost?'], ['Answer', 'Do you offer fixed fees?'],
        ['News', 'Office closed for the holidays'], ['News', 'A new partner joins the firm']] },
      bakery: { n: 'Bakehouse', d: 'A neighborhood bakery · 12 pages', sw: ['#FFF3D6', '#E0402B'], cut: 'Weddings and parties', ren: ['Neighbors', 'Regulars'], pages: [
        ['Product', 'Our breads'], ['Product', 'Celebration cakes'], ['Product', 'Wholesale for cafés'],
        ['Story', 'The corner café we’ve baked for since day one'],
        ['Article', 'Why we ferment for 36 hours'], ['Article', 'Meet our miller'], ['Article', 'What happens to yesterday’s bread'],
        ['Answer', 'Do you have gluten-free options?'], ['Answer', 'Can I order a cake for Saturday?'],
        ['News', 'Holiday opening hours'], ['News', 'We’re hiring a morning baker'], ['Page', 'About us']] },
      clinic: { n: 'Clinic', d: 'A physio practice · 12 pages', sw: ['#EAF5F2', '#23867B'], cut: 'Pain that isn’t improving', ren: ['Desk workers', 'Office workers'], pages: [
        ['Service', 'Sports physiotherapy'], ['Service', 'Pelvic health'], ['Service', 'Online appointments'],
        ['Story', 'Back to the marathon after ACL surgery'],
        ['Article', 'Why rest isn’t always the answer for back pain'], ['Article', 'Five desk stretches that actually help'], ['Article', 'What happens at your first assessment'],
        ['Answer', 'Do I need a referral?'], ['Answer', 'How many sessions will I need?'],
        ['News', 'Our new clinic in Eastside'], ['Page', 'Meet the team'], ['Page', 'Prices']] }
    };
    var STOP = ' a an the and or of for to in on at is are do does you your we our it its what who how why when which with can should i me my be by from this that they them after before about into than then there their so if as not up out new meet one five day us all ';
    function stem(w){ return w.toLowerCase().replace(/[’'.,!?:;()"“”]/g, '').replace(/-/g, '').replace(/(ies)$/, 'y').replace(/(ings|ing|es|s|ed)$/, ''); }
    function words(t){ return (t.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(function(w){ return w.toLowerCase(); }).filter(function(w){ return w.length > 2 && STOP.indexOf(' ' + w.replace(/[’']/g, '') + ' ') < 0; }).map(stem).filter(function(w){ return w.length > 2; }); }
    function hit(a, b){ return a === b || (a.length >= 5 && b.length >= 5 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); }
    var PRI = [1, 2, 0, 3, 4, 5];
    // sketch.js connect(): merge the same label across categories, tag each page with up to three terms
    function connect(key){
      var s = SKS[key], byLabel = {}, merged = [];
      SKV[key].forEach(function(f, fi){ f[1].forEach(function(t){
        if (t[0] === s.cut) return;
        var lab = t[0] === s.ren[0] ? s.ren[1] : t[0], k = lab.toLowerCase();
        if (!byLabel[k]){ byLabel[k] = { label: lab, fs: [], kw: [] }; merged.push(byLabel[k]); }
        var m = byLabel[k]; if (m.fs.indexOf(fi) < 0) m.fs.push(fi);
        t[1].split(' ').map(stem).forEach(function(w){ if (m.kw.indexOf(w) < 0) m.kw.push(w); });
      }); });
      var links = [], pages = s.pages.map(function(p, pi){
        var ws = words(p[1]), fd = [];
        merged.forEach(function(m, mi){ if (m.kw.some(function(k){ return ws.some(function(w){ return hit(w, k); }); })) fd.push(mi); });
        fd.sort(function(a, b){ return PRI.indexOf(merged[a].fs[0]) - PRI.indexOf(merged[b].fs[0]); });
        fd = fd.slice(0, 3); fd.forEach(function(mi){ links.push([pi, mi]); });
        return { type: p[0], title: p[1], terms: fd };
      });
      merged.forEach(function(m, mi){ m.n = links.filter(function(l){ return l[1] === mi; }).length; });
      return { pages: pages, terms: merged, links: links };
    }
    SCENE.add('cks-sketch', function(sc){
      fonts(sc);
      var st = sc.stg;
      if (!sc.skKey) sc.skKey = 'law';
      render(sc.skKey);
      function render(key){
        var P = sc.portrait, s = SKS[key], G = connect(key), V = SKV[key];
        var total = 0; V.forEach(function(f){ total += f[1].length; });
        var usedAll = G.terms.map(function(t, i){ return i; }).filter(function(i){ return G.terms[i].n > 0; }).sort(function(a, b){ return G.terms[b].n - G.terms[a].n; }), used = usedAll.slice(0, P ? 8 : 10);
        var conn = G.pages.filter(function(p){ return p.terms.length; }).length, empty = G.terms.filter(function(t){ return !t.n; }), strong = G.terms.filter(function(t){ return t.n >= 3; });
        var types = []; s.pages.forEach(function(p){ if (types.indexOf(p[0]) < 0) types.push(p[0]); });
        function chip(t, fi){ return '<span class="cx-vt" style="--c:' + SKF[fi] + '" data-l="' + esc(t[0]) + '"><b>' + esc(t[0]) + '</b></span>'; }
        function pageCard(p, pi){ return '<div class="cx-skp' + (p.terms.length ? '' : ' is-orphan') + '" data-p="' + pi + '"><small>' + esc(p.type) + '</small><b>' + esc(p.title) + '</b></div>'; }
        var Lc = [], Rc = []; G.pages.forEach(function(p, pi){ (pi % 2 ? Rc : Lc).push(pageCard(p, pi)); });
        st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/sketch.html') +
          '<div class="cx-sk-top"><ol class="cx-sks">' + [['Your site', 'Pick a sample'], ['Your vocabulary', 'Keep, cut or rename'], ['How it connects', 'Your pages, woven']].map(function(x, i){ return '<li><button type="button" data-go="' + i + '"><i>' + (i + 1) + '</i><span><b>' + x[0] + '</b><small>' + x[1] + '</small></span></button></li>'; }).join('') + '</ol>' +
            '<div class="cx-skpick"><em>Sample</em>' + Object.keys(SKS).map(function(k){ return '<button type="button" data-k="' + k + '" class="' + (k === key ? 'on' : '') + '" style="--a:' + SKS[k].sw[0] + ';--b:' + SKS[k].sw[1] + '"><span class="sw"></span>' + esc(SKS[k].n) + '</button>'; }).join('') + '</div></div>' +
          /* step 1 */
          '<div class="cx-skpan" data-pan="0"><h4>Start with a site.</h4><div class="cx-samples">' + Object.keys(SKS).map(function(k){ return '<div class="cx-sam' + (k === key ? ' is-me' : '') + '" style="--a:' + SKS[k].sw[0] + ';--b:' + SKS[k].sw[1] + '"><span class="sw"></span><span><b>' + esc(SKS[k].n) + '</b><small>' + esc(SKS[k].d) + '</small></span></div>'; }).join('') + '</div>' +
            '<p class="cx-sklab">Your site today <span>· nothing points anywhere else</span></p><div class="cx-silos">' + types.slice(0, P ? 4 : 5).map(function(ty){ return '<div class="cx-silo"><em>' + esc(ty) + '</em>' + s.pages.filter(function(p){ return p[0] === ty; }).map(function(p){ return '<span>' + esc(p[1]) + '</span>'; }).join('') + '</div>'; }).join('') + '</div>' +
            '<span class="cx-skbtn" data-b="0">Draft my vocabulary →</span></div>' +
          /* step 2 */
          '<div class="cx-skpan" data-pan="1"><h4>React to a strawman.</h4><p class="cx-skcnt"><b class="k">' + total + '</b> terms kept · <span class="c">0</span> cut · <span class="r">0</span> renamed</p><div class="cx-facets">' +
            V.map(function(f, fi){ return '<div class="cx-facet" style="--c:' + SKF[fi] + '"><em>' + esc(f[0]) + '</em><div>' + f[1].map(function(t){ return chip(t, fi); }).join('') + '</div></div>'; }).join('') +
            '</div><span class="cx-skbtn" data-b="1">Connect my pages →</span></div>' +
          /* step 3 */
          '<div class="cx-skpan" data-pan="2"><div class="cx-skstats">' +
            [[conn + '<small>/' + G.pages.length + '</small>', 'pages connect to your vocabulary'], [G.links.length, 'links built from tags alone'], [usedAll.length + '<small>/' + G.terms.length + '</small>', 'terms with a page behind them'], [G.pages.length - conn, 'page' + (G.pages.length - conn === 1 ? '' : 's') + ' with no match yet']].map(function(x){ return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>' +
            '<div class="cx-skmap"><svg class="cx-skthr" aria-hidden="true"></svg><div class="cx-skc l">' + Lc.join('') + '</div><div class="cx-skc t">' +
              used.map(function(ti){ var t = G.terms[ti]; return '<div class="cx-skt" data-t="' + ti + '" style="--c:' + SKF[t.fs[0]] + '"><span>' + t.fs.map(function(f){ return '<i style="--c:' + SKF[f] + '"></i>'; }).join('') + '</span>' + esc(t.label) + '<b>' + t.n + '</b></div>'; }).join('') +
            '</div><div class="cx-skc r">' + Rc.join('') + '</div></div>' +
            '<div class="cx-gaps">' +
              '<div><em>Not connected yet</em><p>' + G.pages.filter(function(p){ return !p.terms.length; }).map(function(p){ return esc(p.title); }).join(' · ') + '</p></div>' +
              '<div class="w"><em>Nothing behind these yet</em><p>' + empty.slice(0, 6).map(function(t){ return '<span style="--c:' + SKF[t.fs[0]] + '">' + esc(t.label) + '</span>'; }).join('') + '</p></div>' +
              '<div class="k"><em>Connects everywhere</em><p>' + (strong.length ? strong.map(function(t){ return '<span style="--c:' + SKF[t.fs[0]] + '">' + esc(t.label) + ' · ' + t.n + '</span>'; }).join('') : '<small>Nothing yet with three or more pages</small>') + '</p></div>' +
            '</div></div>' +
          cursor('a', 'You') + '<div class="fg-fade"></div>';
        var pans = qa(st, '.cx-skpan'), goB = qa(st, '.cx-sks button'), cur = q(st, '.cur.a'), me = q(st, '.cx-sam.is-me'), silos = qa(st, '.cx-silo'), btn = qa(st, '.cx-skbtn');
        var cutEl = q(st, '.cx-vt[data-l="' + s.cut + '"]'), renEl = q(st, '.cx-vt[data-l="' + s.ren[0] + '"]'), kept = q(st, '.cx-skcnt .k'), cutN = q(st, '.cx-skcnt .c'), renN = q(st, '.cx-skcnt .r');
        var facets = qa(st, '.cx-facet'), stats = qa(st, '.cx-skstats div'), map = q(st, '.cx-skmap'), svg = q(st, '.cx-skthr'), pcs = qa(st, '.cx-skp'), tms = qa(st, '.cx-skt'), gaps = qa(st, '.cx-gaps > div');
        // threads: page edge → term edge (drawn once the step-3 layout exists)
        svg.setAttribute('viewBox', '0 0 ' + map.offsetWidth + ' ' + map.offsetHeight);
        var TH = [];
        G.links.forEach(function(l){
          var pe = q(map, '.cx-skp[data-p="' + l[0] + '"]'), te = q(map, '.cx-skt[data-t="' + l[1] + '"]'); if (!pe || !te) return;
          var left = l[0] % 2 === 0, a = pos(map, pe, left ? 1 : 0, .5), b = pos(map, te, left ? 0 : 1, .5);
          var p = pth(svg, X.curve(a, b), 'cx-skl'); p.style.stroke = te.style.getPropertyValue('--c'); TH.push(p);
        });
        function show(i){ pans.forEach(function(p, k){ p.classList.toggle('on', k === i); }); goB.forEach(function(b, k){ b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); }); }
        var R = run(sc, function(){ show(0); if (cutEl) cutEl.classList.remove('cut'); if (renEl){ renEl.classList.remove('ed'); q(renEl, 'b').textContent = s.ren[0]; } kept.textContent = total; cutN.textContent = '0'; renN.textContent = '0'; if (me) me.classList.remove('on'); }), tl = R.tl;
        tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0);
        tl.addLabel('site', 0);
        tl.set(silos, { autoAlpha: 0 }, 0);
        tl.to(cur, { autoAlpha: 1, duration: .2 }, .5);
        move(R, cur, pos(st, me, .5, .6), .5, .8); click(R, me, 1.3);
        R.at(1.35, function(){ me.classList.add('on'); });
        tl.fromTo(silos, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .12, immediateRender: false }, 1.5);
        move(R, cur, pos(st, btn[0], .5, .6), 3, .7); click(R, btn[0], 3.7);
        var t = 3.9;
        tl.addLabel('vocab', t);
        R.at(t, function(){ show(1); });
        tl.fromTo(facets, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .08, immediateRender: false }, t + .1);
        if (cutEl){ move(R, cur, pos(st, cutEl, .5, .6), t + .9, .7); click(R, cutEl, t + 1.6); R.at(t + 1.65, function(){ cutEl.classList.add('cut'); kept.textContent = total - 1; cutN.textContent = '1'; }); }
        if (renEl){
          move(R, cur, pos(st, renEl, .5, .6), t + 2.4, .7); click(R, renEl, t + 3.1); click(R, renEl, t + 3.3);
          var rb = q(renEl, 'b'), o = { n: 0 };
          R.at(t + 3.4, function(){ renEl.classList.add('ed'); });
          tl.fromTo(o, { n: 0 }, { n: s.ren[1].length, duration: 1, ease: 'none', immediateRender: false, onUpdate: function(){ rb.textContent = s.ren[1].slice(0, Math.round(o.n)) || '|'; } }, t + 3.5);
          R.at(t + 4.6, function(){ renEl.classList.remove('ed'); rb.textContent = s.ren[1]; renN.textContent = '1'; });
        }
        move(R, cur, pos(st, btn[1], .5, .6), t + 5, .7); click(R, btn[1], t + 5.7);
        t += 5.9;
        tl.addLabel('connect', t);
        R.at(t, function(){ show(2); });
        tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
        tl.fromTo(stats, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .1, immediateRender: false }, t + .1);
        tl.fromTo(pcs, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, stagger: .04, immediateRender: false }, t + .4);
        tl.fromTo(tms, { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .3, stagger: .06, ease: 'back.out(2)', immediateRender: false }, t + .8);
        TH.forEach(function(p, i){ hide(R, p); draw(R, p, t + 1.2 + i * .06, .5); });
        tl.fromTo(gaps, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .2, immediateRender: false }, t + 1.6 + TH.length * .06);
        end(sc, R, t + 8, t + 5.5);
        // interactive: step buttons jump, a sample reloads the sketch for that site
        // (each lands on the moment that step is complete)
        goB.forEach(function(b, i){ tap(b, function(){ if (sc.hold) sc.hold(); tl.seek(tl.labels[['site', 'vocab', 'connect'][i]] + [2.8, 4.8, 4][i]); if (sc.onSeek) sc.onSeek(); }); });
        show(0);
        qa(st, '.cx-skpick button').forEach(function(b){ tap(b, function(){
          var k = b.getAttribute('data-k'); sc.skKey = k;
          if (sc.tl) sc.tl.kill(); qa(sc.view, '.scn-ctl').forEach(function(n){ n.remove(); });
          render(k); sc.paused = false; sc.started = true; sc.tl.restart();
        }); });
      }
    });

    /* ---------------- 5 · PUBLISH ONCE: one entry, the site does the rest ---------------- */
    var PT = [['Client onboarding', SAF], ['Service design', COR], ['Journey mapping', TEA], ['Client handoffs', COB], ['Plain-language UX', INK], ['Professional firms', OCH]];
    var PUB = { title: 'Onboarding is a design problem', theme: 'How we work', tags: [0, 1, 2], slug: 'onboarding-is-a-design-problem' };
    SCENE.add('cks-publish', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var json = [
        ['{', ''], ['  "@context": "https://schema.org",', ''], ['  "@graph": [{', ''], ['    "@type": "Article",', ''],
        ['    "headline": "' + PUB.title + '",', 'hot'], ['    "articleSection": "' + PUB.theme + '",', ''],
        ['    "about": [' + PUB.tags.map(function(i){ return '"' + PT[i][0] + '"'; }).join(', ') + '],', 'hot'],
        ['    "url": "https://yoursite.com/insights/' + PUB.slug + '"', ''], ['  },', '']
      ].concat(PUB.tags.map(function(i, k){ return ['  { "@type": "DefinedTerm", "name": "' + PT[i][0] + '" }' + (k < PUB.tags.length - 1 ? ',' : ''), 'hot']; })).concat([[']}', '']]);
      st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/#update') +
        '<div class="cx-ed"><div class="cx-edh"><span>Collections / <b>Insights</b> / New item</span><em class="cx-pill">Draft</em></div>' +
          '<label class="cx-f"><span>Title <i>Required</i></span><div class="cx-in cx-ti"><b></b><u></u></div></label>' +
          '<label class="cx-f cx-thm"><span>Theme</span><div class="cx-in cx-sel"><b>' + PUB.theme + '</b><i>▾</i></div></label>' +
          '<div class="cx-f"><span>Topics <i>Pick one or more</i></span><div class="cx-tps">' + PT.map(function(t, i){ return '<button type="button" class="cx-tp" data-i="' + i + '" aria-pressed="false" style="--c:' + t[1] + '">' + esc(t[0]) + '</button>'; }).join('') + '</div></div>' +
          '<div class="cx-f cx-vid"><span>Video URL <i>Optional</i></span><div class="cx-in"><b class="cx-ph">https://youtube.com/…</b></div></div>' +
          '<div class="cx-pubr"><button type="button" class="cx-pub">Publish</button><span class="cx-stl">Nothing is live until you publish.</span></div></div>' +
        '<div class="cx-pv cx-lib"><div class="cx-url">yoursite.com/insights</div><div class="cx-pvh"><b>The library</b><span><i>7</i> places</span></div><div class="cx-lcs">' +
          '<div class="cx-lc is-new"><em>How we work</em><b>' + PUB.title + '</b><span>Just now</span></div>' +
          [['How we work', 'What a journey map is really for', TEA], ['What you watch for', 'Why handoffs fail on Friday afternoons', COB], ['Ideas', 'The first 30 days decide the next three years', COR]].map(function(c){ return '<div class="cx-lc" style="--c:' + c[2] + '"><em>' + c[0] + '</em><b>' + c[1] + '</b><span>Read →</span></div>'; }).join('') +
        '</div></div>' +
        '<div class="cx-pv cx-top"><div class="cx-url">yoursite.com/topics/client-onboarding</div><b class="cx-pvt">Client onboarding</b><p>The first month with a new client is a product.</p><em>Reading list</em><div class="cx-rl"><div class="is-new">' + PUB.title + '<span>New</span></div><div>The first 30 days decide the next three years</div></div></div>' +
        '<div class="cx-pv cx-prj"><div class="cx-url">yoursite.com/work/riverside-clinic</div><b class="cx-pvt">Riverside Clinic intake</b><em>This project demonstrates</em><div class="cx-dem"><span style="--c:' + TEA + '">Journey mapping</span><span class="is-new" style="--c:' + SAF + '">Client onboarding</span><span class="is-new" style="--c:' + COR + '">Service design</span></div><em>Related reading</em><div class="cx-rl"><div class="is-new">' + PUB.title + '</div></div></div>' +
        '<div class="cx-code"><div class="cx-codeh"><span>JSON-LD · generated from the same fields</span><i></i></div><pre>' + json.map(function(l){ return '<span class="' + l[1] + '">' + esc(l[0]) + '</span>'; }).join('\n') + '</pre></div>' +
        '<div class="fg-toast"><i></i><span></span></div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var ti = q(st, '.cx-ti b'), tiCur = q(st, '.cx-ti u'), tps = qa(st, '.cx-tp'), pub = q(st, '.cx-pub'), pill = q(st, '.cx-pill'), stl = q(st, '.cx-stl'), sel = q(st, '.cx-sel');
      var libN = q(st, '.cx-lib .cx-pvh i'), newEls = qa(st, '.is-new'), lines = qa(st, '.cx-code pre span'), toast = q(st, '.fg-toast'), cur = q(st, '.cur.a'), pvs = qa(st, '.cx-pv, .cx-code');
      function setPub(on){ pill.textContent = on ? 'Published' : 'Draft'; pill.classList.toggle('live', on); stl.textContent = on ? 'Published · the library, a topic page and a project updated.' : 'Nothing is live until you publish.'; libN.textContent = on ? 8 : 7; }
      var R = run(sc, function(){ setPub(false); tps.forEach(function(b){ b.setAttribute('aria-pressed', 'false'); }); tiCur.style.display = ''; sel.classList.remove('on'); toast.classList.remove('ok'); q(toast, 'span').textContent = ''; }), tl = R.tl;
      tl.addLabel('write', 0);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 300 : 200, y: sc.SH + 30 }, 0).set(newEls, { autoAlpha: 0 }, 0).set(lines, { autoAlpha: 0 }, 0).set(toast, { autoAlpha: 0, xPercent: -50 }, 0);
      tl.fromTo(pvs, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .2);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .6);
      move(R, cur, pos(st, q(st, '.cx-ti'), .2, .6), .6, .7); click(R, q(st, '.cx-ti'), 1.3);
      var t = type(R, ti, PUB.title, 1.4, 1.5);
      move(R, cur, pos(st, sel, .5, .6), t + .2, .6); click(R, sel, t + .8); R.at(t + .85, function(){ sel.classList.add('on'); });
      t += 1.3;
      tl.addLabel('tag', t);
      PUB.tags.forEach(function(k, i){ var b = tps[k]; move(R, cur, pos(st, b, .5, .6), t + i * .85, .55); click(R, b, t + .55 + i * .85); R.at(t + .6 + i * .85, function(){ b.setAttribute('aria-pressed', 'true'); }); });
      t += PUB.tags.length * .85 + .3;
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .6), t, .6); click(R, pub, t + .6);
      R.at(t + .65, function(){ setPub(true); tiCur.style.display = 'none'; toast.classList.add('ok'); q(toast, 'span').textContent = 'Published · 4 places updated'; });
      tl.fromTo(toast, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + .7).to(toast, { autoAlpha: 0, duration: .3 }, t + 3.2);
      tl.fromTo(newEls, { autoAlpha: 0, y: -8, scale: .95 }, { autoAlpha: 1, y: 0, scale: 1, duration: .45, stagger: .22, ease: 'back.out(1.8)', immediateRender: false }, t + .9);
      tl.fromTo(lines, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: .15, stagger: .09, immediateRender: false }, t + 1.2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1.1);
      end(sc, R, t + 7, t + 4, [{ t: 'Write', at: 'write' }, { t: 'Tag', at: 'tag' }, { t: 'Publish', at: 'publish' }]);
      // interactive: topics toggle, Publish replays the publish (from wherever you are)
      tps.forEach(function(b){ tap(b, function(){ if (sc.hold) sc.hold(); b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
      tap(pub, function(){ tl.seek(tl.labels.publish + .5); if (sc.onSeek) sc.onSeek(); if (sc.resume) sc.resume(); });
    });
  })();
