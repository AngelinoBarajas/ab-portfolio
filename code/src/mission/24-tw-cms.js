  /* =========================================================
     TOPICWEAVE · TAG ONCE (channel tw-cms)
     A coded replica of the CMS panel prototype (cks-v3 app/cms.html): a generic CMS editor with the Topicweave
     panel beside it, joined to "Five parts, one shared vocabulary" (src/how-it-works.html): tag once and the
     entry shows up everywhere it belongs.
       Entry     : the cursor types a title, the panel reads the draft and suggests topics from the vocabulary
       Tag       : two suggestions accepted, thread-colored chips land in the Related topics field
       Publish   : threads draw from the entry to a topic page, a related-reading list and the JSON-LD,
                   which fills in (Article + about DefinedTerms built from the picked tags)
       Topic page: the topic page's piece count ticks up
     Live: a suggested topic toggles (holds the loop, the JSON-LD and the pages update); Publish replays.
     Content is the prototype's own example data (app/cms.html, app/data.js): "Prototype · sample data".
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, C = T.C, q = K.q, qa = K.qa, esc = K.esc;
    var run = X.run, end = X.end, type = X.type, pos = X.pos, move = X.move, click = X.click;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    var TITLE = 'Every complaint starts at a handoff', SLUG = 'every-complaint-starts-at-a-handoff';
    // the prototype's three suggestions (app/cms.html), counts and pieces from app/data.js
    var TOP = [
      { n: 'Client handoffs', c: C.coral, cat: 'What you watch for', m: 'strong match', pages: 3, slug: 'client-handoffs',
        list: ['Why handoffs fail on Friday afternoons'], rel: ['Why handoffs fail on Friday afternoons', 'insights/why-handoffs-fail', 'The first 30 days decide the next three years'],
        links: [['Topic page: Client handoffs', '+1 piece'], ['Related reading on 2 insights', 'auto']] },
      { n: 'Client onboarding', c: C.lilac, cat: 'Ideas', m: 'strong match', pages: 7, slug: 'client-onboarding',
        list: ['Onboarding is a design problem', 'The first 30 days decide the next three years'], rel: ['The first 30 days decide the next three years', 'insights/the-first-30-days', 'Onboarding is a design problem'],
        links: [['Topic page: Client onboarding', '+1 piece'], ['Riverside Clinic · related reading', 'auto'], ['Library · For new clients', 'auto']] },
      { n: 'Professional firms', c: C.teal, cat: 'Who you help', m: 'possible', pages: 4, slug: 'professional-firms',
        list: ['Hale & Partners onboarding'], rel: ['Hale & Partners onboarding', 'work/hale-partners-onboarding', 'Onboarding is a design problem'],
        links: [['Topic page: Professional firms', '+1 piece']] }
    ];
    var PICK = [0, 1];
    // JSON-LD syntax colors: keys lilac, strings teal (the prototype's pre)
    function hl(s){
      var out = '', last = 0, re = /"[^"]*"/g, m;
      while ((m = re.exec(s))){ var key = /^\s*:/.test(s.slice(re.lastIndex)); out += esc(s.slice(last, m.index)) + '<span class="' + (key ? 'k' : 's') + '">' + esc(m[0]) + '</span>'; last = re.lastIndex; }
      return out + esc(s.slice(last));
    }

    SCENE.add('tw-cms', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var ED = P ? { x: 20, y: 44, w: 600, h: 384, f: 330 } : { x: 28, y: 52, w: 640, h: 648, f: 360 };
      var RC = P ? { top: [20, 466, 290, 164], rel: [20, 644, 290, 136], ld: [330, 466, 290, 314] }
                 : { top: [756, 52, 420, 196], rel: [756, 262, 420, 128], ld: [756, 404, 420, 296] };
      function box(r){ return 'left:' + r[0] + 'px;top:' + r[1] + 'px;width:' + r[2] + 'px;height:' + r[3] + 'px'; }
      function fld(lab, inner, cls){ return '<div class="tw-cm-f' + (cls ? ' ' + cls : '') + '"><label>' + lab + '</label>' + inner + '</div>'; }

      st.innerHTML = '<div class="tw-cm-bg"></div>' +
        '<div class="tw-cm-lab"><b>Topicweave inside your CMS</b><span>Prototype · sample data</span></div>' +
        '<svg class="tw-cm-svg" width="' + sc.SW + '" height="' + sc.SH + '" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-cm-ed" style="left:' + ED.x + 'px;top:' + ED.y + 'px;width:' + ED.w + 'px;height:' + ED.h + 'px;grid-template-columns:' + ED.f + 'px 1fr">' +
          '<div class="tw-cm-bar"><span class="tw-cm-dots"><i></i><i></i><i></i></span><b>Insights</b><span class="tw-cm-path">/ New item</span><em class="tw-cm-pill">Draft</em><button type="button" class="tw-cm-pub">Publish</button></div>' +
          '<div class="tw-cm-form">' +
            fld('Name', '<div class="tw-cm-in tw-cm-ti"><b></b><u></u></div>') +
            fld('Slug', '<div class="tw-cm-in tw-cm-sl"><b></b></div>') +
            fld('Related topics <span>· multi-reference</span>', '<div class="tw-cm-ref"></div>') +
            (P ? '' : fld('Short summary', '<div class="tw-cm-in tw-cm-ml">Almost every client complaint starts when work passes from one person to another.</div>')) +
            fld('Body', '<div class="tw-cm-rt"><p>We’ve read a lot of client complaints over the years. Every single one we can remember started at a <span>handoff</span>, the moment work passed from one person to another.</p>' +
              (P ? '' : '<p>The fix is rarely a new system. It’s one <span>short email on day two</span>: here’s who you’ll hear from next, and why. We send it for every client now.</p>') + '</div>', 'tw-cm-body') +
          '</div>' +
          '<aside class="tw-cm-pn" aria-label="Topicweave panel"><div class="tw-cm-ph">' + T.ICON + '<b>Topicweave</b><span>Example Studio</span></div>' +
            '<div class="tw-cm-blk tw-cm-sugs"><h3>Suggested topics<span>from your vocabulary</span></h3><p class="tw-cm-wait">Suggestions appear as you write.</p>' +
              TOP.map(function(t, i){ return '<div class="tw-cm-sug" style="--c:' + t.c + '"><i></i><span>' + esc(t.n) + '<small>' + t.m + '</small></span><button type="button" data-i="' + i + '" aria-pressed="false">Add</button></div>'; }).join('') + '</div>' +
            '<div class="tw-cm-blk"><h3 class="tw-cm-ch">Once published, it connects to</h3><div class="tw-cm-conn"></div></div>' +
            (P ? '' : '<div class="tw-cm-blk"><h3>Before you publish</h3><div class="tw-cm-ok">Title is a sentence in your voice</div><div class="tw-cm-ok">No words from your never list</div><div class="tw-cm-warn tw-cm-chk">No topic tagged yet</div></div>') +
          '</aside></div>' +
        '<div class="tw-cm-card tw-cm-top" style="' + box(RC.top) + '"><div class="tw-cm-url"></div><div class="tw-cm-th1"><div><em class="tw-cm-cat"></em><b class="tw-cm-tn"></b></div><div class="tw-cm-cnt"><b>3</b><span>pieces</span><i>+1</i></div></div>' +
          '<div class="tw-cm-rl"><div class="tw-cm-new"><span>' + esc(TITLE) + '</span><em>New</em></div><div class="tw-cm-base"></div></div><div class="tw-cm-also"></div></div>' +
        '<div class="tw-cm-card tw-cm-rel" style="' + box(RC.rel) + '"><div class="tw-cm-url"></div><b class="tw-cm-rt2"></b><em class="tw-cm-sub">Related reading</em>' +
          '<div class="tw-cm-rl"><div class="tw-cm-new"><span>' + esc(TITLE) + '</span><em>New</em></div></div></div>' +
        '<div class="tw-cm-card tw-cm-ld" style="' + box(RC.ld) + '"><div class="tw-cm-ldh"><span>JSON-LD · built from your tags</span><i></i></div><p class="tw-cm-ldw">Fills in when you publish.</p><pre></pre></div>' +
        X.cursor('a', 'You') + '<div class="fg-fade"></div>';

      var svg = q(st, '.tw-cm-svg'), ed = q(st, '.tw-cm-ed'), ti = q(st, '.tw-cm-ti b'), sl = q(st, '.tw-cm-sl b'), refBox = q(st, '.tw-cm-ref');
      var pill = q(st, '.tw-cm-pill'), pub = q(st, '.tw-cm-pub'), wait = q(st, '.tw-cm-wait'), sugs = qa(st, '.tw-cm-sug'), sugB = qa(st, '.tw-cm-sug button');
      var conn = q(st, '.tw-cm-conn'), connH = q(st, '.tw-cm-ch'), chk = q(st, '.tw-cm-chk');
      var top = q(st, '.tw-cm-top'), rel = q(st, '.tw-cm-rel'), ldc = q(st, '.tw-cm-ld'), pre = q(ldc, 'pre'), ldw = q(ldc, '.tw-cm-ldw');
      var cnt = q(top, '.tw-cm-cnt b'), plus = q(top, '.tw-cm-cnt i'), news = qa(st, '.tw-cm-new'), cur = q(st, '.cur.a'), cards = qa(st, '.tw-cm-card');

      // state: which topics are tagged, published yet, counted yet
      var sel = [false, false, false], was = [false, false, false], published = false, counted = false;
      function picked(){ var a = []; sel.forEach(function(s, i){ if (s) a.push(i); }); return a; }
      function ld(){
        var pk = picked(), L = [['{']];
        if (!P) L.push(['  "@context": "https://schema.org",']);
        L.push(['  "@type": "Article",'], ['  "headline": "' + TITLE + '",'], ['  "about": [' + (pk.length ? '' : ']')]);
        pk.forEach(function(i, n){
          var t = TOP[i], last = n === pk.length - 1;
          if (P) L.push(['    { "@type": "DefinedTerm",', t.c], ['      "name": "' + t.n + '",', t.c], ['      "url": "/topics/' + t.slug + '" }' + (last ? '' : ','), t.c]);
          else L.push(['    { "@type": "DefinedTerm", "name": "' + t.n + '",', t.c], ['      "url": "/topics/' + t.slug + '" }' + (last ? '' : ','), t.c]);
        });
        if (pk.length) L.push(['  ]']);
        L.push(['}']);
        return L.map(function(l){ return '<span' + (l[1] ? ' class="hot" style="--c:' + l[1] + '"' : '') + '>' + hl(l[0]) + '</span>'; }).join('\n');
      }
      function base(){ var pk = picked(); return pk.length ? TOP[pk[0]].pages : 0; }
      function render(){
        var pk = picked();
        st.className = st.className.replace(/\s*tw-s\d/g, '') + pk.map(function(i){ return ' tw-s' + i; }).join('');
        sugB.forEach(function(b, i){ b.textContent = sel[i] ? 'Added' : 'Add'; b.classList.toggle('on', sel[i]); b.setAttribute('aria-pressed', sel[i] ? 'true' : 'false'); });
        refBox.innerHTML = pk.length ? pk.map(function(i){ return '<span class="tw-cm-chip' + (was[i] ? '' : ' is-in') + '" style="--c:' + TOP[i].c + '">' + esc(TOP[i].n) + '</span>'; }).join('')
          : '<span class="tw-cm-emp">No topics yet. Accept a suggestion from Topicweave →</span>';
        was = sel.slice();
        connH.textContent = published ? 'Connected to' : 'Once published, it connects to';
        conn.innerHTML = pk.length ? pk.map(function(i){ return TOP[i].links.map(function(l){ return '<div style="--c:' + TOP[i].c + '"><i></i>' + esc(l[0]) + '<span>' + (published ? (l[1] === 'auto' ? 'linked' : 'added') : l[1]) + '</span></div>'; }).join(''); }).join('')
          : '<div class="tw-cm-none">Nothing yet<span>add a topic</span></div>';
        if (chk){ chk.className = pk.length ? 'tw-cm-ok tw-cm-chk' : 'tw-cm-warn tw-cm-chk'; chk.textContent = pk.length ? pk.length + ' topic' + (pk.length > 1 ? 's' : '') + ' tagged' : 'No topic tagged yet'; }
        pill.textContent = published ? 'Published' : 'Draft'; pill.classList.toggle('on', published);
        // the topic page and related reading follow the first tagged topic
        var t = pk.length ? TOP[pk[0]] : null;
        top.classList.toggle('is-none', !t); rel.classList.toggle('is-none', !t);
        q(top, '.tw-cm-url').textContent = 'yoursite.com/topics/' + (t ? t.slug : '…');
        q(top, '.tw-cm-cat').textContent = t ? 'Topic page · ' + t.cat : 'Topic page';
        q(top, '.tw-cm-tn').textContent = t ? t.n : 'Tag a topic to give it a home';
        top.style.setProperty('--c', t ? t.c : C.ash); rel.style.setProperty('--c', t ? t.c : C.ash);
        cnt.textContent = t ? base() + (counted ? 1 : 0) : '0';
        q(top, '.tw-cm-base').innerHTML = t ? t.list.slice(0, 1).map(function(x){ return '<div><span>' + esc(x) + '</span></div>'; }).join('') : '';
        var also = pk.slice(1).map(function(i){ return TOP[i].n + ' (' + (TOP[i].pages + (counted ? 1 : 0)) + ')'; });
        q(top, '.tw-cm-also').textContent = published && also.length ? 'Also updated: ' + also.join(', ') : '';
        q(rel, '.tw-cm-url').textContent = 'yoursite.com/' + (t ? t.rel[1] : '…');
        q(rel, '.tw-cm-rt2').textContent = t ? t.rel[0] : 'No related pages yet';
        pre.innerHTML = ld();
      }

      // threads: one strand per topic to each of the three places, shown only for tagged topics
      var ths = [], knots = [];
      var eb = ED.y + ED.h, er = ED.x + ED.w, by = ED.y + 18;
      [top, rel, ldc].forEach(function(card, j){
        var r = j === 0 ? RC.top : j === 1 ? RC.rel : RC.ld, kx, ky;
        TOP.forEach(function(t, k){
          var o = (k - 1) * 6, a, b, d;
          if (P){
            if (j === 1){ var gx = 320 + o, gy = r[1] + r[3] / 2 + o; d = 'M' + gx + ' ' + eb + 'L' + gx + ' ' + (gy - 18) + 'Q' + gx + ' ' + gy + ' ' + (r[0] + r[2] + 2) + ' ' + gy; kx = r[0] + r[2]; ky = r[1] + r[3] / 2; }
            else { a = { x: r[0] + r[2] / 2 + o * 1.4, y: eb }; b = { x: a.x, y: r[1] - 2 }; d = X.curve(a, b, true); kx = r[0] + r[2] / 2; ky = r[1]; }
          } else {
            a = { x: er, y: by + o }; b = { x: r[0] - 2, y: (j === 2 ? r[1] + 40 : r[1] + r[3] / 2) + o }; d = X.curve(a, b, false); kx = r[0]; ky = b.y - o;
          }
          var p = X.path(svg, d, 'tw-cm-th k' + k); p.style.stroke = t.c; ths.push({ p: p, j: j, k: k });
        });
        var kn = K.mk('div', 'tw-cm-knot'); kn.style.left = kx + 'px'; kn.style.top = ky + 'px'; st.appendChild(kn); knots.push(kn);
      });

      var R = run(sc, function(){
        sel = [false, false, false]; was = sel.slice(); published = false; counted = false;
        st.classList.add('is-typing'); wait.textContent = 'Suggestions appear as you write.'; wait.classList.remove('is-busy');
        render();
      }), tl = R.tl;

      // 1 · entry
      tl.addLabel('entry', 0);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 420 : 300, y: sc.SH + 30 }, 0)
        .set(sugs, { autoAlpha: 0, y: 6 }, 0).set(wait, { autoAlpha: 1 }, 0).set(news, { autoAlpha: 0, height: 0 }, 0)
        .set(pre, { '--f': 0 }, 0).set(ldw, { autoAlpha: 1 }, 0).set(plus, { autoAlpha: 0 }, 0).set(knots, { autoAlpha: 0, scale: .4 }, 0);
      ths.forEach(function(o){ X.hide(R, o.p); });
      tl.fromTo([ed].concat(cards), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .1);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .45);
      move(R, cur, pos(st, q(st, '.tw-cm-ti'), .25, .6), .45, .65); click(R, q(st, '.tw-cm-ti'), 1.12);
      var t = type(R, ti, TITLE, 1.2);
      type(R, sl, SLUG, 1.2, t - 1.2);
      R.at(t + .1, function(){ wait.textContent = 'Reading the draft…'; wait.classList.add('is-busy'); });
      tl.to(wait, { autoAlpha: 0, duration: .2 }, t + .6);
      tl.to(sugs, { autoAlpha: 1, y: 0, duration: .35, stagger: .14 }, t + .7);
      t += 1.5;

      // 2 · tag
      tl.addLabel('tag', t);
      R.at(t, function(){ st.classList.remove('is-typing'); });
      PICK.forEach(function(k, i){
        var b = sugB[k], tt = t + i * .95;
        move(R, cur, pos(st, b, .5, .6), tt, .55); click(R, b, tt + .58);
        R.at(tt + .62, function(){ sel[k] = true; render(); });
      });
      t += PICK.length * .95 + .35;

      // 3 · publish
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .6), t, .6); click(R, pub, t + .62);
      R.at(t + .66, function(){ published = true; render(); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1);
      ths.forEach(function(o){ X.draw(R, o.p, t + .75 + o.j * .28 + o.k * .07, .75); });
      knots.forEach(function(kn, j){ tl.to(kn, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, t + 1.45 + j * .28); });
      tl.to(news, { autoAlpha: 1, height: 'auto', duration: .4, stagger: .28, ease: 'power2.out' }, t + 1.5);
      tl.to(ldw, { autoAlpha: 0, duration: .2 }, t + 1.85);
      tl.to(pre, { '--f': 1, duration: 1.3, ease: 'steps(16)' }, t + 1.95);
      t += 3.6;

      // 4 · the topic page counts the new piece
      tl.addLabel('count', t);
      tl.fromTo(top, { boxShadow: '0 0 0 1px rgba(155,135,245,0)' }, { boxShadow: '0 0 0 1px rgba(155,135,245,.9), 0 0 40px rgba(155,135,245,.35)', duration: .35, yoyo: true, repeat: 1, immediateRender: false }, t);
      var o = { v: 0 };
      tl.fromTo(o, { v: 0 }, { v: 1, duration: .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ if (picked().length) cnt.textContent = base() + Math.round(o.v); } }, t + .1);
      tl.fromTo(plus, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'back.out(2)', immediateRender: false }, t + .3);
      R.at(t + .72, function(){ counted = true; render(); });

      end(sc, R, t + 5, t + 1.6, [{ t: 'Entry', at: 'entry' }, { t: 'Tag', at: 'tag' }, { t: 'Publish', at: 'publish' }, { t: 'Topic page', at: 'count' }]);
      var done = tl.labels.count + 1;

      // live: a suggestion toggles the tag (jumping to the published state first), the JSON-LD and pages follow
      sugB.forEach(function(b, i){ tap(b, function(){
        if (sc.hold) sc.hold();
        if (!counted){ tl.seek(done); if (sc.onSeek) sc.onSeek(); }
        sel[i] = !sel[i]; render();
        ldc.classList.remove('is-flash'); void ldc.offsetWidth; ldc.classList.add('is-flash');
      }); });
      tap(pub, function(){ tl.seek(tl.labels.publish + .5); if (sc.onSeek) sc.onSeek(); if (sc.resume) sc.resume(); });
    });
  })();
