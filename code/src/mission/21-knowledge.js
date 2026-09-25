  /* =========================================================
     KNOWLEDGE SYSTEM SCENES (mission knowledge-system; the channel id picks the scene)
     graph    : a vocabulary, one new entry tagged three times, every link built from those tags
     library  : a dated blog feed becomes a themed library; filter; an answer-first article
     voice    : Voice Kit inputs → voice profile → AI draft → your edits → approved → published
     setup    : one-time setup, then a CMS entry that updates the library, a topic and a service
     video    : a video link + chapter lines become a chaptered player with a written twin
     schema   : JSON-LD from the same fields, a search result, an AI answer citing the page
     portable : the same model in the Webflow CMS, WordPress, Sanity and Markdown
     Example content is generic on purpose ("Your Company", yoursite.com): no client facts.
     ========================================================= */
  (function(){
    var K = SCENE.kit, mk = K.mk, q = K.q, qa = K.qa, esc = K.esc, CURSOR = K.CURSOR, NS = 'http://www.w3.org/2000/svg';
    var SITE = 'yoursite.com', CO = 'Your Company';

    // position of an element inside the (unscaled) stage
    function pos(st, el, fx, fy){
      var x = 0, y = 0, n = el;
      while (n && n !== st){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x: x + el.offsetWidth * (fx == null ? .5 : fx), y: y + el.offsetHeight * (fy == null ? .5 : fy) };
    }
    // a looping timeline whose class/text callbacks replay correctly when a phase chip seeks
    function run(sc, reset){
      var tl = gsap.timeline({ paused: true, repeat: -1 });
      function at(t, fn){ tl.call(fn, null, t); }
      // seek() suppresses callbacks, so typed text and counters would stay blank after a phase chip:
      // rewind silently, reset the class state, then replay up to now WITH events (tweens + calls fire in order)
      sc.onSeek = function(){
        var now = tl.time(); tl.seek(0, true); reset(); tl.seek(now, false);
      };
      at(.005, reset);
      return { tl: tl, at: at };
    }
    function end(sc, R, t, restAt, phases){
      var fade = q(sc.stg, '.fg-fade');
      R.tl.to(fade, { autoAlpha: 1, duration: .45 }, t).set({}, {}, t + .5);
      sc.tl = R.tl; sc.restAt = restAt; R.tl.progress(0).pause();
      K.controls(sc, phases);
    }
    function type(R, el, str, t, dur){
      var o = { n: 0 };
      R.tl.set(el, { textContent: '' }, 0);
      R.tl.fromTo(o, { n: 0 }, { n: str.length, duration: dur || Math.min(1.6, .035 * str.length + .15), ease: 'none', immediateRender: false,
        onUpdate: function(){ el.textContent = str.slice(0, Math.round(o.n)); } }, t);
      return t + (dur || Math.min(1.6, .035 * str.length + .15));
    }
    function count(R, el, from, to, t, dur, suf, noInit){
      var o = { v: from };
      if (!noInit) R.tl.set(el, { textContent: from + (suf || '') }, 0);
      R.tl.fromTo(o, { v: from }, { v: to, duration: dur || .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ el.textContent = Math.round(o.v) + (suf || ''); } }, t);
    }
    function path(svg, d, cls){
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls || 'ks-ln'); svg.appendChild(p);
      var L = (p.getTotalLength ? p.getTotalLength() : 400) + 2; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p._L = L;
      return p;
    }
    function hide(R, p){ R.tl.set(p, { strokeDashoffset: p._L }, 0); }
    function draw(R, p, t, d){ R.tl.to(p, { strokeDashoffset: 0, duration: d || .5, ease: 'power2.inOut' }, t); }
    function curve(a, b, vert){
      if (vert){ var my = (a.y + b.y) / 2; return 'M' + a.x + ' ' + a.y + 'C' + a.x + ' ' + my + ' ' + b.x + ' ' + my + ' ' + b.x + ' ' + b.y; }
      var mx = (a.x + b.x) / 2; return 'M' + a.x + ' ' + a.y + 'C' + mx + ' ' + a.y + ' ' + mx + ' ' + b.y + ' ' + b.x + ' ' + b.y;
    }
    function click(R, el, t){ R.tl.to(el, { scale: .93, duration: .08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t); }
    function move(R, cur, p, t, d){ R.tl.to(cur, { x: p.x, y: p.y, duration: d || .6, ease: 'power2.inOut' }, t); }
    function cursor(cls, name){ return '<div class="cur ' + cls + '">' + CURSOR + (name ? '<span class="nm">' + esc(name) + '</span>' : '') + '</div>'; }
    function head(t, s){ return '<div class="ks-top"><b>' + esc(t) + '</b>' + (s ? '<span>' + esc(s) + '</span>' : '') + '</div>'; }
    var CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg>';
    var LOCK = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1"/><path d="M4 5.5V4a2 2 0 014 0v1.5"/></svg>';

    /* ---------------- 1 · KNOWLEDGE GRAPH ---------------- */
    var CATS = [['Who you help', ['New clients', 'Growing teams', 'Families']], ['Services', ['Consulting', 'Planning', 'Ongoing care']],
      ['How it works', ['Onboarding', 'Timelines', 'Pricing']], ['What you watch for', ['Deadlines', 'Budget', 'Common mistakes']],
      ['Ideas', ['Clarity', 'Trust', 'Long-term value']], ['Known for', ['Hard cases', 'Fast answers', 'Plain English']]];
    SCENE.add('graph', function(sc){
      var P = sc.portrait, st = sc.stg;
      var cat = P ? { x: 26, y: 66, w: 190, h: 134, cols: 3, gx: 11, gy: 10 } : { x: 36, y: 92, w: 226, h: 160, cols: 2, gx: 18, gy: 18 };
      var card = P ? { x: 170, y: 364, w: 300, h: 150 } : { x: 556, y: 262, w: 270, h: 206 };
      var nd = P ? { x: 26, y: 574, w: 288, h: 56, cols: 2, gx: 12, gy: 10 } : { x: 880, y: 104, w: 286, h: 74, cols: 1, gx: 0, gy: 16 };
      var NODES = [['S', 'Service page', 'Consulting'], ['T', 'Topic page', 'Onboarding'], ['P', 'Project', 'Case study 01'], ['P', 'Project', 'Case study 02'], ['?', 'FAQ', 'What does it cost?'], ['?', 'FAQ', 'What should I bring?']];
      var TAG = [[0, 0], [1, 0], [2, 0]];
      // tagged categories sit next to the card so their lines never cross another box
      var ORDER = P ? [3, 4, 5, 0, 1, 2] : [4, 0, 3, 1, 5, 2];
      function box(o, i){ return 'left:' + (o.x + (i % o.cols) * (o.w + o.gx)) + 'px;top:' + (o.y + Math.floor(i / o.cols) * (o.h + o.gy)) + 'px;width:' + o.w + 'px;height:' + o.h + 'px'; }
      st.innerHTML = '<div class="ks-bg"></div>' + head('Knowledge graph', SITE) +
        '<svg class="ks-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        ORDER.map(function(ci, i){ var c = CATS[ci]; return '<div class="ks-cat" style="' + box(cat, i) + '"><em>0' + (i + 1) + '</em><b>' + esc(c[0]) + '</b><div>' + c[1].map(function(t, j){ return '<span class="ks-term" data-k="' + ci + ':' + j + '">' + esc(t) + '</span>'; }).join('') + '</div></div>'; }).join('') +
        '<div class="ks-card" style="left:' + card.x + 'px;top:' + card.y + 'px;width:' + card.w + 'px;height:' + card.h + 'px"><em>New insight</em><b>How long does onboarding take?</b>' +
          '<div class="ks-tags">' + TAG.map(function(k){ return '<span>' + esc(CATS[k[0]][1][k[1]]) + '</span>'; }).join('') + '</div><div class="ks-cnt">links built <i>0</i> · by hand <i>0</i></div></div>' +
        NODES.map(function(n, i){ return '<div class="ks-node" style="' + box(nd, i) + '"><i>' + n[0] + '</i><span><em>' + n[1] + '</em><b>' + esc(n[2]) + '</b></span><u>+ linked</u></div>'; }).join('') +
        '<div class="ks-cap">Tagged once. Linked everywhere.</div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var svg = q(st, '.ks-svg'), cats = qa(st, '.ks-cat'), cardEl = q(st, '.ks-card'), tags = qa(st, '.ks-tags span'), nodes = qa(st, '.ks-node'), cap = q(st, '.ks-cap'), cur = q(st, '.cur.a'), cnt = qa(st, '.ks-cnt i')[0];
      var terms = TAG.map(function(k){ return q(st, '[data-k="' + k[0] + ':' + k[1] + '"]'); });
      var tagLines = terms.map(function(el, i){
        // landscape: leave from the category box's outer edge (the term sits inside it), level with the term
        var a = P ? pos(st, el, .5, 1) : { x: cat.x + cat.cols * cat.w + (cat.cols - 1) * cat.gx, y: pos(st, el, 1, .5).y }, b = P ? { x: card.x + card.w * (.25 + i * .25), y: card.y } : { x: card.x, y: card.y + card.h * (.3 + i * .2) };
        return path(svg, curve(a, b, P), 'ks-ln on');
      });
      var nodeLines = nodes.map(function(el, i){
        if (P){
          // portrait: out of the card's side, down the margin, into the node's outer edge (never across another node)
          var L = i % 2 === 0, ay = card.y + card.h * (.3 + Math.floor(i / 2) * .22), ax = L ? card.x : card.x + card.w, e = L ? 8 : sc.SW - 8, bp = pos(st, el, L ? 0 : 1, .5);
          return path(svg, 'M' + ax + ' ' + ay + 'C' + e + ' ' + ay + ' ' + e + ' ' + bp.y + ' ' + bp.x + ' ' + bp.y, 'ks-ln');
        }
        return path(svg, curve({ x: card.x + card.w, y: card.y + card.h * (.2 + i * .12) }, pos(st, el, 0, .5)), 'ks-ln');
      });
      if (P) cap.style.cssText = 'top:' + (card.y + card.h + 14) + 'px;bottom:auto;left:50%;right:auto;transform:translateX(-50%);white-space:nowrap';
      var R = run(sc, function(){ cnt.textContent = '0'; terms.forEach(function(e){ e.classList.remove('on'); }); nodes.forEach(function(e){ e.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('vocab', 0);
      tagLines.concat(nodeLines).forEach(function(p){ hide(R, p); });
      tl.set(cats, { autoAlpha: 0, y: 14 }, 0).set(nodes, { autoAlpha: 0 }, 0).set([cardEl, cap, tags], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0)
        .set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0);
      tl.to(cats, { autoAlpha: 1, y: 0, duration: .5, stagger: .18, ease: 'power3.out' }, .2);
      tl.to(nodes, { autoAlpha: .4, duration: .5, stagger: .06 }, 1.2);
      var t = 2.6;
      tl.addLabel('tag', t);
      tl.fromTo(cardEl, { autoAlpha: 0, y: -24, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .55, ease: 'back.out(1.6)', immediateRender: false }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t + .3);
      t += .6;
      terms.forEach(function(el, i){
        move(R, cur, pos(st, el, .55, .7), t, .6); click(R, el, t + .6);
        (function(n){ R.at(t + .65, function(){ el.classList.add('on'); cnt.textContent = n; }); })(i + 1);
        tl.fromTo(tags[i], { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2.4)', immediateRender: false }, t + .7);
        draw(R, tagLines[i], t + .7, .5);
        t += 1.35;
      });
      tl.set(cnt, { textContent: '0' }, 0);
      tl.addLabel('connect', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      nodeLines.forEach(function(p, i){ draw(R, p, t + .2 + i * .22, .45); (function(el){ R.at(t + .6 + i * .22, function(){ el.classList.add('on'); }); })(nodes[i]); });
      tl.to(nodes, { autoAlpha: 1, duration: .3, stagger: .22 }, t + .45);
      count(R, cnt, 3, 9, t + .5, 1.3, '', true);
      R.at(t + 1.85, function(){ cnt.textContent = '9'; });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2);
      end(sc, R, t + 6.4, t + 3, [{ t: 'Vocabulary', at: 'vocab' }, { t: 'Tag', at: 'tag' }, { t: 'Connect', at: 'connect' }]);
    });

    /* ---------------- 2 · INSIGHTS LIBRARY ---------------- */
    var LIB = [['Getting started', 'What a first meeting covers', 'What we ask, what to bring, and what happens next.', 1],
      ['Process', 'How long does onboarding take?', 'The honest answer, step by step.', 1],
      ['Pricing', 'Pricing, explained', 'What drives the cost, and where it can flex.', 0],
      ['Common questions', 'Consulting vs. a one-off project: which fits?', 'Two ways to work together, compared.', 0],
      ['Process', 'What happens in week one', 'Listening first, then a plan in writing.', 1],
      ['Pricing', 'Is ongoing care worth it?', 'When a monthly plan pays for itself.', 0],
      ['Common questions', 'The five mistakes we see most', 'And how to avoid every one of them.', 1],
      ['Getting started', 'What to prepare before you call', 'A short list that saves a week.', 0]];
    var FEED = [['Mar 3, 2021', 'We moved offices!'], ['Nov 18, 2021', 'Holiday hours'], ['Jun 9, 2022', 'Meet the team'], ['Jan 30, 2023', 'Our thoughts on the new year'], ['Aug 14, 2024', 'Company news']];
    SCENE.add('library', function(sc){
      var P = sc.portrait, st = sc.stg;
      var g = P ? { x: 26, y: 222, w: 286, h: 124, cols: 2, gx: 16, gy: 14 } : { x: 40, y: 214, w: 262, h: 206, cols: 4, gx: 24, gy: 24 };
      function gp(i){ return { x: g.x + (i % g.cols) * (g.w + g.gx), y: g.y + Math.floor(i / g.cols) * (g.h + g.gy) }; }
      var THEMES = ['All', 'Getting started', 'Process', 'Pricing', 'Common questions'];
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-feed"><div class="ks-feed-h">Blog <i>before · a dated feed</i></div>' + FEED.map(function(f){ return '<div class="ks-feed-r"><em>' + f[0] + '</em><b>' + esc(f[1]) + '</b><span>Company news</span></div>'; }).join('') + '</div>' +
        '<div class="ks-lib-h"><em>Insights</em><b>Answers, not a feed.</b></div>' +
        '<div class="ks-chips">' + THEMES.map(function(t, i){ return '<span class="ks-chip' + (i ? '' : ' on') + '">' + esc(t) + '</span>'; }).join('') + '</div>' +
        LIB.map(function(c, i){ var p = gp(i); return '<div class="ks-lc" data-th="' + esc(c[0]) + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + g.w + 'px;height:' + g.h + 'px"><em>' + esc(c[0]) + '</em><b>' + esc(c[1]) + '</b><p>' + esc(c[2]) + '</p><span>' + (c[3] ? 'Watch · Read →' : 'Read →') + '</span></div>'; }).join('') +
        '<div class="ks-art"><div class="ks-art-c">Insights › Pricing</div><h4>Pricing, explained</h4>' +
          '<div class="ks-ans"><i>The answer, first · what search + AI quote</i><p>Most projects are priced by scope, not by the hour. Three things move the number: how much we build, how fast you need it, and how much support you want after launch.</p></div><div class="ks-lines"><i></i><i></i><i></i><i></i></div>' +
          '<div class="ks-rel"><em>Related service</em><span>Consulting</span></div>' +
          '<div class="ks-rel"><em>Shown in practice</em><span>Case study 01</span><span>Case study 02</span></div>' +
          '<div class="ks-rel"><em>Related reading</em><span>Is ongoing care worth it?</span><span>What a first meeting covers</span></div>' +
          '<div class="ks-cta"><b>Have a question like this one?</b><span>Book a call →</span></div></div>' +
        cursor('a', 'Visitor') + '<div class="fg-fade"></div>';
      var cta = q(st, '.ks-cta'), feed = q(st, '.ks-feed'), rows = qa(st, '.ks-feed-r'), hdr = q(st, '.ks-lib-h'), chips = qa(st, '.ks-chip'), cards = qa(st, '.ks-lc'), art = q(st, '.ks-art'), rels = qa(st, '.ks-rel'), ans = q(st, '.ks-ans'), cur = q(st, '.cur.a');
      var R = run(sc, function(){ chips.forEach(function(c, i){ c.classList.toggle('on', i === 0); }); cards.forEach(function(c){ c.classList.remove('hot'); }); });
      var tl = R.tl;
      tl.addLabel('library', 0);
      tl.set([hdr, chips, cards, art], { autoAlpha: 0 }, 0).set(cards, { x: 0, y: 0, scale: 1 }, 0).set([feed, rows], { autoAlpha: 1, y: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0)
        .set(cur, { autoAlpha: 0, x: sc.SW * .6, y: sc.SH + 30 }, 0).set(ans, { '--hl': 0 }, 0);
      tl.to(rows, { autoAlpha: .25, x: -12, duration: .4, stagger: .1 }, 1.6).to(feed, { autoAlpha: 0, duration: .35 }, 2.3);
      tl.fromTo(hdr, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, 2.5);
      tl.to(chips, { autoAlpha: 1, duration: .3, stagger: .06 }, 2.7);
      tl.fromTo(cards, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, ease: 'power3.out', immediateRender: false }, 2.9);
      var t = 4.8;
      tl.addLabel('filter', t);
      var chip = chips[3];
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      move(R, cur, pos(st, chip, .5, .7), t, .7); click(R, chip, t + .7);
      R.at(t + .75, function(){ chips.forEach(function(c){ c.classList.toggle('on', c === chip); }); });
      var k = 0;
      cards.forEach(function(c, i){
        if (c.getAttribute('data-th') === 'Pricing'){ var from = gp(i), to = gp(k++); tl.to(c, { x: to.x - from.x, y: to.y - from.y, duration: .6, ease: 'power3.inOut' }, t + .85); }
        else tl.to(c, { autoAlpha: 0, scale: .9, duration: .35 }, t + .8);
      });
      t += 2.2;
      tl.addLabel('answer', t);
      var target = cards[2];
      move(R, cur, { x: g.x + g.w * .5, y: g.y + g.h * .5 }, t, .6);
      R.at(t + .55, function(){ target.classList.add('hot'); });
      click(R, target, t + .65);
      tl.fromTo(art, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'power3.out', immediateRender: false }, t + .9);
      tl.to(cur, { autoAlpha: 0, duration: .2 }, t + .9);
      tl.to(ans, { '--hl': 1, duration: .6 }, t + 1.6);
      tl.fromTo(rels.concat(cta), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .35, immediateRender: false }, t + 2.4);
      end(sc, R, t + 7, t + 4, [{ t: 'Library', at: 'library' }, { t: 'Filter', at: 'filter' }, { t: 'Answer', at: 'answer' }]);
    });

    /* ---------------- 3 · VOICE KIT ---------------- */
    SCENE.add('voice', function(sc){
      var P = sc.portrait, st = sc.stg;
      var kit = P ? { x: 20, y: 58, w: 600, h: 250 } : { x: 30, y: 70, w: 370, h: 630 }, doc = P ? { x: 20, y: 324, w: 600, h: 460 } : { x: 424, y: 70, w: 746, h: 630 };
      var SAMPLE = 'Most people come to us after a bad first try. We listen first, then tell you plainly what will work.';
      var PARAS = ['Most clients are up and running in about two weeks. Here is what happens first, and what we need from you.',
        'Week one is listening. We ask about your goals, your deadlines and what went wrong last time, then we put a plan in writing.',
        'Week two, the work starts. You get one contact, a shared timeline and a short check-in every Friday.'];
      var bars = ''; for (var i = 0; i < (P ? 22 : 30); i++) bars += '<i style="--h:' + (22 + Math.round(Math.abs(Math.sin(i * 1.7) * 60 + Math.sin(i * .6) * 20))) + '%"></i>';
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-kit" style="left:' + kit.x + 'px;top:' + kit.y + 'px;width:' + kit.w + 'px;height:' + kit.h + 'px">' +
          '<div class="ks-kit-h"><b>Voice Kit</b><span>10–15 minutes</span></div><div class="ks-steps">' +
          '<div class="ks-step"><em>1 · Something you\'ve written</em><div class="ks-ta"><b></b><u></u></div></div>' +
          '<div class="ks-step"><em>2 · Your voice, out loud</em><div class="ks-rec"><span class="ks-dot"></span><div class="ks-wave">' + bars + '</div><code>0:00</code></div></div>' +
          '<div class="ks-step"><em>3 · Preferences</em><div class="ks-prefs"><span>I</span><span data-p="1">We</span><span>Mix</span></div><div class="ks-prefs"><span data-p="1">Warm</span><span>Balanced</span><span>Precise</span></div></div></div>' +
          '<div class="ks-prof"><em>Voice profile</em><ul><li>Speaks as <b>“we”</b></li><li>Warm, plain, short sentences</li><li>Explains before it sells</li><li>Never says <s>leverage</s> <s>seamless</s></li></ul></div></div>' +
        '<div class="ks-doc" style="left:' + doc.x + 'px;top:' + doc.y + 'px;width:' + doc.w + 'px;height:' + doc.h + 'px">' +
          '<div class="ks-doc-bar"><b>Draft · How long does onboarding take?</b><span class="ks-st">Draft</span><span class="ks-ok">Approve</span><span class="ks-pub">' + LOCK + 'Publish</span></div>' +
          '<div class="ks-ai"><i>✦</i><span>Claude · drafting from your voice profile</span></div>' +
          '<div class="ks-gen"><em>Generic AI</em><s>Unlock a seamless, best-in-class onboarding experience tailored to your unique needs!</s></div>' +
          '<div class="ks-body">' + PARAS.map(function(p, i){ return '<p data-i="' + i + '"></p>'; }).join('') + '</div>' +
          '<div class="ks-cm"><b>You</b>Say the Friday call is optional.</div></div>' +
        '<div class="ks-cap">Nothing goes live without your OK.</div><div class="fg-toast"><i></i><span></span></div>' + cursor('b', 'You') + '<div class="fg-fade"></div>';
      var ta = q(st, '.ks-ta b'), taCur = q(st, '.ks-ta u'), steps = qa(st, '.ks-step'), dot = q(st, '.ks-dot'), waveBars = qa(st, '.ks-wave i'), recT = q(st, '.ks-rec code'), prefs = qa(st, '[data-p]'), prof = q(st, '.ks-prof');
      var ps = qa(st, '.ks-body p'), ai = q(st, '.ks-ai'), gen = q(st, '.ks-gen'), stEl = q(st, '.ks-st'), ok = q(st, '.ks-ok'), pub = q(st, '.ks-pub'), cm = q(st, '.ks-cm'), cap = q(st, '.ks-cap'), toast = q(st, '.fg-toast'), cur = q(st, '.cur.b');
      var R = run(sc, function(){
        prefs.forEach(function(p){ p.classList.remove('on'); }); dot.classList.remove('rec'); taCur.style.display = '';
        stEl.textContent = 'Draft'; stEl.className = 'ks-st'; ok.classList.remove('done'); ok.textContent = 'Approve'; pub.classList.remove('on'); q(toast, 'span').textContent = ''; toast.classList.remove('ok');
        var p1 = ps[1]; if (p1.getAttribute('data-ed')){ p1.textContent = PARAS[1]; p1.removeAttribute('data-ed'); }
      });
      var tl = R.tl;
      tl.addLabel('capture', 0);
      tl.set([prof, ai, gen, cm, cap, toast], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(steps, { autoAlpha: .35 }, 0).set(waveBars, { scaleY: .12 }, 0)
        .set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: kit.x + kit.w * .6, y: kit.y + kit.h + 20 }, 0).set(ok, { autoAlpha: 0 }, 0);
      tl.to(steps[0], { autoAlpha: 1, duration: .3 }, .2);
      var t = type(R, ta, SAMPLE, .5, 2.2);
      R.at(t, function(){ taCur.style.display = 'none'; });
      tl.to(steps[1], { autoAlpha: 1, duration: .3 }, t);
      R.at(t + .2, function(){ dot.classList.add('rec'); });
      tl.to(waveBars, { scaleY: 1, duration: .18, stagger: { each: .05, from: 'start' }, ease: 'power2.out' }, t + .3);
      tl.set(recT, { textContent: '0:00' }, 0);
      // show the recording time as m:ss
      tl.to({}, { duration: 1.6, onUpdate: function(){ var s = Math.round(this.progress() * 192); recT.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); } }, t + .3);
      R.at(t + 2, function(){ dot.classList.remove('rec'); });
      t += 2.1;
      tl.to(steps[2], { autoAlpha: 1, duration: .3 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      prefs.forEach(function(p, i){ move(R, cur, pos(st, p, .6, .7), t + .2 + i * .8, .5); (function(el){ R.at(t + .75 + i * .8, function(){ el.classList.add('on'); }); })(p); click(R, p, t + .7 + i * .8); });
      t += 1.9;
      tl.addLabel('draft', t);
      tl.to(steps, { autoAlpha: .3, duration: .4 }, t);
      tl.fromTo(prof, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'back.out(1.6)', immediateRender: false }, t + .2);
      tl.to(cur, { autoAlpha: 0, duration: .2 }, t);
      tl.to(ai, { autoAlpha: 1, duration: .3 }, t + .8);
      tl.to(gen, { autoAlpha: 1, duration: .3 }, t + 1);
      tl.to(gen, { '--x': 1, duration: .4 }, t + 1.9); tl.set(gen, { '--x': 0 }, 0);
      tl.to(gen, { autoAlpha: .45, duration: .3 }, t + 2.3);
      t += 2.4;
      PARAS.forEach(function(s, i){ t = type(R, ps[i], s, t, Math.min(1.8, .02 * s.length + .3)) + .15; });
      tl.addLabel('review', t);
      R.at(t, function(){ stEl.textContent = 'In review'; stEl.className = 'ks-st rv'; });
      tl.to(ok, { autoAlpha: 1, duration: .3 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      var p1 = ps[1];
      move(R, cur, pos(st, p1, .85, .8), t + .1, .7);
      R.at(t + .9, function(){ p1.setAttribute('data-ed', '1'); p1.innerHTML = esc(PARAS[1].replace(/ put a plan in writing\.$/, '')) + ' <s>put a plan in writing.</s> <ins>send you a one-page plan.</ins>'; });
      move(R, cur, pos(st, ps[2], .9, .5), t + 1.6, .6);
      tl.fromTo(cm, { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .35, immediateRender: false }, t + 2.25);
      move(R, cur, pos(st, ok, .5, .7), t + 3.1, .6); click(R, ok, t + 3.7);
      R.at(t + 3.75, function(){ ok.classList.add('done'); ok.textContent = 'Approved ✓'; stEl.textContent = 'Approved'; stEl.className = 'ks-st ap'; pub.classList.add('on'); });
      t += 4.1;
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .7), t, .6); click(R, pub, t + .6);
      R.at(t + .65, function(){ q(toast, 'span').textContent = 'Published · approved by you'; toast.classList.add('ok'); });
      tl.fromTo(toast, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + .65);
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 1.2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1.4);
      end(sc, R, t + 5.2, t + 2, [{ t: 'Capture', at: 'capture' }, { t: 'Draft', at: 'draft' }, { t: 'Review', at: 'review' }, { t: 'Publish', at: 'publish' }]);
    });

    /* ---------------- 4 · SET UP ONCE, UPDATE IN MINUTES ---------------- */
    SCENE.add('setup', function(sc){
      var P = sc.portrait, st = sc.stg;
      var ed = P ? { l: 0, t: 0, w: 640, h: 380 } : { l: 0, t: 0, w: 440, h: 750 }, pv = P ? { l: 16, t: 392, w: 608, h: 396 } : { l: 468, t: 34, w: 704, h: 680 };
      var FIELDS = [{ k: 'Name', v: 'What a first meeting covers', wide: 1, req: 1 }, { k: 'Theme', v: 'Getting started', select: 1 }, { k: 'Topics', v: 'New clients · Onboarding · Consulting', select: 1 },
        { k: 'Video URL', v: 'youtube.com/watch?v=a1b2c3', wide: 1 }, { k: 'Summary', v: 'What we ask, what to bring, and what happens next.', wide: 1, area: 1 }];
      var SETUP = ['Vocabulary signed off · 6 categories', 'Topics + Insights collections', 'Existing pages tagged', 'Templates: library, article, topic pages', 'Schema, sitemap + internal links'];
      var ph = P ? 118 : 206;
      function page(url, title, body, badge){ return '<div class="ks-pg"><div class="ks-pg-u"><i></i><i></i><i></i><span>' + url + '</span><b class="ks-upd">Updated</b></div><div class="ks-pg-b"><em>' + title + '</em>' + body + '</div>' + (badge || '') + '</div>'; }
      var libCards = ''; for (var i = 0; i < 9; i++) libCards += '<i' + (i === 8 ? ' class="new"' : '') + '></i>';
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-setup"><div class="ks-setup-h"><b>One-time setup</b><span>done once, by me</span></div>' + SETUP.map(function(s){ return '<div class="ks-row"><i>' + CHECK + '</i>' + esc(s) + '</div>'; }).join('') + '<div class="ks-setup-f">Then your team only ever fills in a form.</div></div>' +
        '<div class="ks-entry"><div class="cm-ed" style="left:' + ed.l + 'px;top:' + ed.t + 'px;width:' + ed.w + 'px;height:' + ed.h + 'px">' +
          '<div class="cm-bar"><span class="cm-logo">W</span><span>' + SITE + '</span><em>CMS</em></div>' +
          '<div class="cm-crumb">Collections › <b>Insights</b> › <span class="cm-new">New item</span></div>' +
          '<div class="cm-fields">' + FIELDS.map(function(f, i){ return '<label class="cm-f' + (f.wide ? ' wide' : '') + (f.area ? ' area' : '') + '"><span>' + esc(f.k) + (f.req ? ' <i>*</i>' : '') + '</span><div class="cm-in' + (f.select ? ' dd' : '') + '" data-i="' + i + '"><b></b><u></u></div></label>'; }).join('') + '</div>' +
          '<div class="cm-act"><span class="cm-draft">Save as draft</span><span class="cm-pub">Publish</span></div></div>' +
          '<div class="ks-pvs" style="left:' + pv.l + 'px;top:' + pv.t + 'px;width:' + pv.w + 'px;height:' + pv.h + 'px">' +
            page(SITE + '/insights', 'Insights', '<div class="ks-mini">' + libCards + '</div><span class="ks-n"><b>8</b> answers</span>') +
            page(SITE + '/topics/onboarding', 'Topic · Onboarding', '<ul class="ks-li"><li>How long does onboarding take?</li><li>What happens in week one</li><li class="new">What a first meeting covers</li></ul>') +
            page(SITE + '/services/consulting', 'Service · Consulting', '<div class="ks-rr"><em>From the library</em><span>Pricing, explained</span><span>Is ongoing care worth it?</span><span class="new">What a first meeting covers</span></div>') +
          '</div><div class="ks-zero">Code written: <b>0 lines</b></div></div>' +
        cursor('a', 'Your team') + '<div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';
      qa(st, '.ks-pg').forEach(function(p){ p.style.height = ph + 'px'; });
      var setup = q(st, '.ks-setup'), rows = qa(st, '.ks-row'), sf = q(st, '.ks-setup-f'), entry = q(st, '.ks-entry'), ins = qa(st, '.cm-in'), vals = qa(st, '.cm-in b'), pub = q(st, '.cm-pub'), newTag = q(st, '.cm-new');
      var pages = qa(st, '.ks-pg'), upd = qa(st, '.ks-upd'), news = qa(st, '.ks-pvs .new'), nEl = q(st, '.ks-n b'), zero = q(st, '.ks-zero'), cur = q(st, '.cur.a'), toast = q(st, '.fg-toast');
      var R = run(sc, function(){ rows.forEach(function(r){ r.classList.remove('on'); }); ins.forEach(function(n){ n.classList.remove('focus', 'done'); }); pub.classList.remove('hit'); newTag.textContent = 'New item'; q(toast, 'span').textContent = ''; toast.classList.remove('ok'); pages.forEach(function(p){ p.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('setup', 0);
      tl.set([entry, sf, toast, zero, upd, news], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(setup, { autoAlpha: 1, scale: 1 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: ed.w * .7, y: 60 }, 0);
      tl.fromTo(setup, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', immediateRender: false }, .1);
      rows.forEach(function(r, i){ R.at(.8 + i * .55, function(){ r.classList.add('on'); }); });
      tl.to(sf, { autoAlpha: 1, duration: .4 }, .8 + rows.length * .55);
      var t = 1.4 + rows.length * .55 + 1.2;
      tl.to(setup, { autoAlpha: 0, scale: .96, duration: .4 }, t - .4);
      tl.addLabel('entry', t);
      tl.to(entry, { autoAlpha: 1, duration: .4 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t + .2);
      t += .5;
      FIELDS.forEach(function(f, i){
        move(R, cur, pos(st, ins[i], .5, .6), t, .45);
        (function(n){ R.at(t + .4, function(){ ins.forEach(function(x, k){ x.classList.toggle('focus', k === n); if (k < n) x.classList.add('done'); }); }); })(i);
        var d = f.select ? .01 : Math.min(1, .03 * f.v.length + .2);
        type(R, vals[i], f.v, t + .5 + (f.select ? .25 : 0), d);
        if (i === 0) R.at(t + .5 + d, function(){ newTag.textContent = FIELDS[0].v; });
        t += .6 + d + (f.select ? .35 : .12);
      });
      R.at(t, function(){ ins.forEach(function(x){ x.classList.remove('focus'); x.classList.add('done'); }); });
      move(R, cur, pos(st, pub, .5, .6), t + .1, .55);
      R.at(t + .7, function(){ pub.classList.add('hit'); q(toast, 'span').textContent = 'Publishing…'; });
      tl.to(toast, { autoAlpha: 1, duration: .25 }, t + .7);
      R.at(t + 1.6, function(){ q(toast, 'span').textContent = 'Published · 3 pages updated'; toast.classList.add('ok'); });
      t += 1.9;
      tl.addLabel('connects', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 1.4);
      pages.forEach(function(p, i){
        (function(el){ R.at(t + i * .7, function(){ el.classList.add('on'); }); })(p);
        tl.fromTo(upd[i], { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)', immediateRender: false }, t + i * .7);
        tl.fromTo(news[i], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + .15 + i * .7);
      });
      count(R, nEl, 8, 9, t + .15, .3);
      tl.fromTo(zero, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2.4);
      end(sc, R, t + 6.4, t + 3, [{ t: 'Set up once', at: 'setup' }, { t: 'Add an entry', at: 'entry' }, { t: 'It connects', at: 'connects' }]);
    });

    /* ---------------- 5 · VIDEO WITH CHAPTERS ---------------- */
    SCENE.add('video', function(sc){
      var P = sc.portrait, st = sc.stg;
      var fp = P ? { x: 20, y: 56, w: 600, h: 236 } : { x: 30, y: 70, w: 360, h: 630 }, pg = P ? { x: 20, y: 306, w: 600, h: 480 } : { x: 414, y: 70, w: 756, h: 630 };
      var CH = [['0:00', 'The short answer', 0], ['2:14', 'What happens first', 134], ['6:38', 'Common mistakes', 398], ['10:05', 'When to call us', 605]], DUR = 760;
      var vh = P ? 200 : 318;
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-fp" style="left:' + fp.x + 'px;top:' + fp.y + 'px;width:' + fp.w + 'px;height:' + fp.h + 'px"><div class="ks-fp-h">CMS · Insight</div>' +
          '<label>Video URL</label><div class="ks-in" data-f="url"><b></b></div><label>Duration</label><div class="ks-in sm" data-f="dur"><b></b></div>' +
          '<label>Chapters <i>one per line: time | title</i></label><div class="ks-in area" data-f="ch">' + CH.map(function(c){ return '<b class="ln"></b>'; }).join('') + '</div></div>' +
        '<div class="ks-page" style="left:' + pg.x + 'px;top:' + pg.y + 'px;width:' + pg.w + 'px;height:' + pg.h + 'px"><div class="ks-page-c">Insights › Process</div><h4>How long does onboarding take?</h4>' +
          '<div class="ks-vid" style="height:' + vh + 'px"><div class="ks-pl"><div class="ks-pl-art"></div><span class="ks-play"></span><div class="ks-pl-t"></div><div class="ks-bar"><i></i>' + CH.map(function(c){ return '<u style="left:' + (c[2] / DUR * 100) + '%"></u>'; }).join('') + '</div><code><span>0:00</span> / <em></em></code></div>' +
            '<div class="ks-chs">' + CH.map(function(c){ return '<span><b>' + c[0] + '</b>' + esc(c[1]) + '</span>'; }).join('') + '</div></div>' +
          '<div class="ks-twin"><em>Written twin · what search + AI can read</em><p><b>The short answer:</b> about two weeks. Week one is listening and a written plan; week two, the work starts.</p><p>Most delays come from three things: missing access, unclear owners and a moving deadline. Here is how we avoid each one.</p><p>If you are already behind, call us first. A short conversation usually saves a week.</p></div></div>' +
        '<div class="ks-cap">No video yet? The page leads with the text.</div>' + cursor('a', 'Your team') + '<div class="fg-fade"></div>';
      var url = q(st, '[data-f="url"] b'), dur = q(st, '[data-f="dur"] b'), lns = qa(st, '[data-f="ch"] .ln'), vid = q(st, '.ks-vid'), pl = q(st, '.ks-pl'), chips = qa(st, '.ks-chs span'), ticks = qa(st, '.ks-bar u'), bar = q(st, '.ks-bar i'), tc = q(st, '.ks-pl code span'), td = q(st, '.ks-pl code em'), plT = q(st, '.ks-pl-t'), twin = q(st, '.ks-twin'), cap = q(st, '.ks-cap'), cur = q(st, '.cur.a'), urlIn = q(st, '[data-f="url"]');
      var R = run(sc, function(){ chips.forEach(function(c){ c.classList.remove('on'); }); pl.classList.remove('has'); urlIn.classList.remove('focus'); twin.classList.remove('hl'); tc.textContent = '0:00'; plT.textContent = ''; });
      var tl = R.tl;
      tl.addLabel('link', 0);
      tl.set([chips, ticks, cap], { autoAlpha: 0 }, 0).set(vid, { height: vh, autoAlpha: 1 }, 0).set(bar, { scaleX: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: fp.x + fp.w * .5, y: fp.y + fp.h + 30 }, 0).set(td, { textContent: '' }, 0);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .2);
      move(R, cur, pos(st, urlIn, .6, .6), .2, .6);
      R.at(.8, function(){ urlIn.classList.add('focus'); });
      var t = type(R, url, 'youtube.com/watch?v=a1b2c3', .9, 1);
      R.at(t + .1, function(){ pl.classList.add('has'); urlIn.classList.remove('focus'); });
      t = type(R, dur, '12:40', t + .4, .4);
      R.at(t, function(){ td.textContent = '12:40'; });
      t += .6;
      tl.addLabel('chapters', t);
      CH.forEach(function(c, i){ t = type(R, lns[i], c[0] + ' | ' + c[1], t, .7) + .05; tl.fromTo([chips[i], ticks[i]], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t - .1); });
      var ch = chips[2];
      move(R, cur, pos(st, ch, .5, .7), t + .2, .7); click(R, ch, t + .9);
      R.at(t + .95, function(){ chips.forEach(function(c){ c.classList.toggle('on', c === ch); }); tc.textContent = '6:38'; plT.textContent = '▶  Common mistakes'; });
      tl.to(bar, { scaleX: CH[2][2] / DUR, duration: .5, ease: 'power2.out' }, t + .95);
      t += 2.6;
      tl.addLabel('twin', t);
      R.at(t, function(){ twin.classList.add('hl'); });
      t += 2.2;
      move(R, cur, pos(st, urlIn, .9, .6), t, .7);
      R.at(t + .7, function(){ urlIn.classList.add('focus'); });
      var o = { n: 1 }, S = 'youtube.com/watch?v=a1b2c3';
      tl.fromTo(o, { n: 1 }, { n: 0, duration: .6, ease: 'none', immediateRender: false, onUpdate: function(){ url.textContent = S.slice(0, Math.round(o.n * S.length)); } }, t + .8);
      R.at(t + 1.4, function(){ pl.classList.remove('has'); });
      tl.to(vid, { height: 0, autoAlpha: 0, duration: .6, ease: 'power3.inOut' }, t + 1.5);
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 2);
      end(sc, R, t + 5.4, t - 1.5, [{ t: 'Paste a link', at: 'link' }, { t: 'Chapters', at: 'chapters' }, { t: 'Written twin', at: 'twin' }]);
    });

    /* ---------------- 6 · SCHEMA + ANSWER ENGINES ---------------- */
    var JSONLD = [['<script type="application/ld+json">', 'tg'], ['{', ''], ['  "@context": "https://schema.org",', ''], ['  "@type": "Article",', 'ty'],
      ['  "headline": "How long does onboarding take?",', 'f', '← Name'], ['  "description": "The honest answer, step by step.",', 'f', '← Summary'],
      ['  "about": [', ''], ['    { "@type": "DefinedTerm", "name": "Onboarding" },', 'f', '← Topics'], ['    { "@type": "DefinedTerm", "name": "Consulting" }', 'f', ''], ['  ],', ''],
      ['  "video": { "@type": "VideoObject" },', 'f', '← Video URL'], ['  "publisher": {', ''], ['    "@type": "Organization", "name": "' + CO + '",', 'ty'],
      ['    "sameAs": ["linkedin.com/company/…"]', ''], ['  }', ''], ['}', ''], ['</' + 'script>', 'tg']];
    SCENE.add('schema', function(sc){
      var P = sc.portrait, st = sc.stg;
      var cd = P ? { x: 20, y: 54, w: 600, h: 396 } : { x: 30, y: 70, w: 590, h: 630 }, rt = P ? { x: 20, y: 462, w: 600, h: 290 } : { x: 646, y: 70, w: 524, h: 630 };
      function hl(s){ return esc(s).replace(/(&quot;[@\w]+&quot;)(:)/g, '<i class="k">$1</i>$2').replace(/: (&quot;[^&]*?&quot;)/g, ': <i class="s">$1</i>'); }
      st.innerHTML = '<div class="ks-bg"></div><div class="ks-ill">Illustration</div>' +
        '<div class="ks-code" style="left:' + cd.x + 'px;top:' + cd.y + 'px;width:' + cd.w + 'px;height:' + cd.h + 'px"><div class="ks-code-h"><b>JSON-LD</b><span>generated from the CMS entry</span></div><pre>' +
          JSONLD.map(function(l){ return '<span class="ks-cl ' + l[1] + '">' + hl(l[0]) + (l[2] ? '<em>' + l[2] + '</em>' : '') + '</span>'; }).join('') + '</pre>' +
          '<div class="ks-types"><span>Article</span><span>DefinedTerm</span><span>FAQPage</span><span>Organization</span></div></div>' +
        '<div class="ks-rt" style="left:' + rt.x + 'px;top:' + rt.y + 'px;width:' + rt.w + 'px;height:' + rt.h + 'px">' +
          '<div class="ks-serp"><div class="ks-q"><i></i><b></b></div><div class="ks-res"><div class="ks-res-s"><i>Y</i><span><b>' + CO + '</b><em>' + SITE + ' › insights › onboarding</em></span></div>' +
            '<h5>How long does onboarding take? | ' + CO + '</h5><p>The short answer: about two weeks. Week one is listening and a written plan; week two, the work starts…</p>' +
            '<div class="ks-faq"><span>What happens in week one?</span><span>Do I need to prepare anything?</span></div></div></div>' +
          '<div class="ks-chat"><div class="ks-u">How long does onboarding usually take with a consultant?</div><div class="ks-a"><i>✦</i><p></p><div class="ks-src"><em>Sources</em><span>' + SITE + '/insights/onboarding</span><span>' + SITE + '/faq</span></div></div></div></div>' +
        '<div class="fg-fade"></div>';
      var lines = qa(st, '.ks-cl'), types = qa(st, '.ks-types span'), serp = q(st, '.ks-serp'), qb = q(st, '.ks-q b'), res = q(st, '.ks-res'), faq = qa(st, '.ks-faq span'), chat = q(st, '.ks-chat'), u = q(st, '.ks-u'), a = q(st, '.ks-a'), ap = q(st, '.ks-a p'), src = qa(st, '.ks-src span');
      var R = run(sc, function(){ src.forEach(function(s){ s.classList.remove('on'); }); lines.forEach(function(l){ l.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('data', 0);
      tl.set(lines, { clipPath: 'inset(0 100% 0 0)' }, 0).set([types, serp, res, faq, chat, u, a], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      var t = .3;
      lines.forEach(function(l, i){ var d = .12 + l.textContent.length * .006; tl.to(l, { clipPath: 'inset(0 0% 0 0)', duration: d, ease: 'none' }, t); if (l.classList.contains('f')) (function(el){ R.at(t + d, function(){ el.classList.add('on'); }); })(l); t += d + .03; });
      tl.fromTo(types, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .15, immediateRender: false }, t + .1);
      t += 1.4;
      tl.addLabel('search', t);
      tl.to(serp, { autoAlpha: 1, duration: .3 }, t);
      t = type(R, qb, 'how long does onboarding take', t + .3, 1.1);
      tl.fromTo(res, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + .3);
      tl.fromTo(faq, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .2, immediateRender: false }, t + .8);
      t += 2.6;
      tl.addLabel('answers', t);
      if (P) tl.to(serp, { autoAlpha: 0, duration: .35 }, t);
      tl.to(chat, { autoAlpha: 1, duration: .3 }, t + (P ? .3 : 0));
      tl.fromTo(u, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, t + .3);
      tl.to(a, { autoAlpha: 1, duration: .3 }, t + .9);
      var A = 'Most consultants take one to two weeks. ' + CO + ' describes a two-week start: a listening week that ends with a written plan, then the work begins in week two.';
      t = type(R, ap, A, t + 1.1, 2.4);
      R.at(t + .3, function(){ src[0].classList.add('on'); });
      tl.fromTo(src, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .2, immediateRender: false }, t + .1);
      end(sc, R, t + 5, t + 1, [{ t: 'Structured data', at: 'data' }, { t: 'Search', at: 'search' }, { t: 'AI answers', at: 'answers' }]);
    });

    /* ---------------- 7 · PORTABLE ---------------- */
    var PLAT = [
      ['Webflow CMS', 'rows', [['Name', 'Plain text'], ['Slug', 'Slug'], ['Theme', 'Option'], ['Topics', 'Multi-reference → Topics', 1], ['Video URL', 'Link'], ['Chapters', 'Plain text']]],
      ['WordPress', 'code', ["register_post_type( 'insight', [ 'public' => true ] );", "register_taxonomy( 'topic',", "  [ 'insight', 'page', 'project' ] );", "// video_url, chapters: custom fields"], [1, 2]],
      ['Sanity', 'code', ["defineType({ name: 'insight', type: 'document', fields: [", "  { name: 'title', type: 'string' },", "  { name: 'topics', type: 'array',", "    of: [{ type: 'reference', to: [{ type: 'topic' }] }] },", "  { name: 'videoUrl', type: 'url' }", "]})"], [2, 3]],
      ['Markdown', 'code', ['---', 'title: How long does onboarding take?', 'theme: Process', 'topics: [onboarding, consulting, new-clients]', 'video: youtube.com/watch?v=a1b2c3', '---'], [3]]
    ];
    SCENE.add('portable', function(sc){
      var P = sc.portrait, st = sc.stg;
      var dg = P ? { y: 70, h: 200 } : { y: 78, h: 190 }, tb = P ? 300 : 300, pn = P ? { x: 20, y: 350, w: 600, h: 320 } : { x: 150, y: 350, w: 900, h: 270 };
      var NODE = ['Topics', 'Insights', 'Pages + projects'];
      var nx = P ? [70, 250, 430] : [230, 510, 790], nw = P ? 150 : 190, ny = dg.y + 60;
      st.innerHTML = '<div class="ks-bg"></div>' + head('One model, any platform', 'built natively for Webflow') +
        '<svg class="ks-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        NODE.map(function(n, i){ return '<div class="ks-mn" style="left:' + nx[i] + 'px;top:' + ny + 'px;width:' + nw + 'px">' + esc(n) + '</div>'; }).join('') +
        '<div class="ks-tabs" style="top:' + tb + 'px">' + PLAT.map(function(p){ return '<span>' + esc(p[0]) + '</span>'; }).join('') + '</div>' +
        PLAT.map(function(p){
          var inner = p[1] === 'rows' ? '<div class="ks-wf">' + p[2].map(function(r){ return '<div' + (r[2] ? ' class="hl"' : '') + '><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>'
            : '<pre>' + p[2].map(function(l, i){ return '<span' + (p[3].indexOf(i) > -1 ? ' class="hl"' : '') + '>' + esc(l) + '</span>'; }).join('') + '</pre>';
          return '<div class="ks-pn" style="left:' + pn.x + 'px;top:' + pn.y + 'px;width:' + pn.w + 'px;height:' + pn.h + 'px">' + inner + '</div>';
        }).join('') +
        '<div class="ks-cap">Built natively for Webflow. The model travels.</div><div class="fg-fade"></div>';
      var svg = q(st, '.ks-svg'), mns = qa(st, '.ks-mn'), tabs = qa(st, '.ks-tabs span'), pns = qa(st, '.ks-pn'), cap = q(st, '.ks-cap');
      var mh = mns[0].offsetHeight, cy = ny + mh / 2, ls = [];
      for (var i = 0; i < 2; i++){ ls.push(path(svg, 'M' + (nx[i] + nw + 8) + ' ' + cy + 'H' + (nx[i + 1] - 8), 'ks-ln on')); }
      ls.push(path(svg, 'M' + (nx[0] + nw / 2) + ' ' + (ny + mh + 6) + 'C' + (nx[0] + nw / 2) + ' ' + (ny + mh + 60) + ' ' + (nx[2] + nw / 2) + ' ' + (ny + mh + 60) + ' ' + (nx[2] + nw / 2) + ' ' + (ny + mh + 6), 'ks-ln on'));
      var lab = mk('div', 'ks-ref', 'references'); lab.style.left = (P ? 320 : 600) + 'px'; lab.style.top = (ny + mh + 42) + 'px'; st.appendChild(lab);
      var R = run(sc, function(){ tabs.forEach(function(x){ x.classList.remove('on'); }); });
      var tl = R.tl;
      ls.forEach(function(p){ hide(R, p); });
      tl.set([mns, pns, cap, lab], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      tl.fromTo(mns, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .2, immediateRender: false }, .2);
      ls.forEach(function(p, i){ draw(R, p, .9 + i * .3, .5); });
      tl.to(lab, { autoAlpha: 1, duration: .3 }, 1.8);
      var t = 2.2;
      PLAT.forEach(function(p, i){
        tl.addLabel('p' + i, t);
        (function(n){ R.at(t, function(){ tabs.forEach(function(x, k){ x.classList.toggle('on', k === n); }); }); })(i);
        tl.fromTo(pns[i], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
        tl.fromTo(qa(pns[i], '.hl'), { '--g': 0 }, { '--g': 1, duration: .5, immediateRender: false }, t + .6);
        tl.to(mns[0], { boxShadow: '0 0 0 3px var(--acc)', duration: .3, yoyo: true, repeat: 1 }, t + .6);
        if (i < PLAT.length - 1) tl.to(pns[i], { autoAlpha: 0, y: -8, duration: .3 }, t + 2.6);
        t += 2.9;
      });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t - 2.4);
      end(sc, R, t + 1.6, t - 1.5, PLAT.map(function(p, i){ return { t: p[0].replace(' CMS', ''), at: 'p' + i }; }));
    });
  })();
