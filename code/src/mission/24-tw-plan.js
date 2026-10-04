  /* =========================================================
     TOPICWEAVE · SITE PLAN (channel tw-plan)
     The ideation board on a dark FigJam canvas: three lanes (Plan / Design / Build) of stickies typed in by a
     cursor, then four threads woven through one sticky per lane. Every sticky is a real v3 decision
     (cks-v3/docs/handoff.md + qa-log.md). Hover a thread in the legend (or a sticky) to trace it; click a sticky
     to bring it forward.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var pth = X.path, hide = X.hide, draw = X.draw, type = X.type, move = X.move, run = X.run, end = X.end, cursor = X.cursor;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    // lanes of stickies: [name, subtitle, [[title (≤ 6 words), one line of detail]]]
    var PL = [
      ['Plan', 'what the site has to do', [
        ['Rename CKS to Topicweave', 'A free name: USPTO clear, topicweave.com and .io registered.'],
        ['Be known for what you know', 'Everything you know, connected, in your own words.'],
        ['Every round checked on a phone', 'Notes from my phone and laptop; every fix checked at 390 and 1440.'],
        ['Join the beta, pricing TBD', 'Installs by hand at a beta price, for honest feedback.']]],
      ['Design', 'the look, locked Oct 1', [
        ['The loom is the signature', 'About 1,700 threads re-weave into a shape per section.'],
        ['Lilac replaces saffron', 'No more mustard: the mark’s bar and one thread go #9B87F5.'],
        ['Sample data, labeled on screen', 'Every prototype screen says Example data. No fake numbers.'],
        ['Glass tiles for the phone nav', 'The mark, the theme switch and a three-bar branded menu.']]],
      ['Build', 'coded by hand, no framework', [
        ['Plain HTML, CSS and JS', 'Coded by hand from the wireframes. No framework.'],
        ['Prototypes before the app', 'Four clickable prototypes get approved before Phase 0.'],
        ['Page-change cloth on phones only', 'Desktop gets a plain fade; the full cloth was too much on big screens.'],
        ['One cloth, site to prototypes', 'The prototypes reuse the site’s own weave code.']]]
    ];
    // four ideas that run through the decisions: [name, color, sticky column per lane]
    var TH = [['The weave', T.WEAVE[0], [1, 0, 3]], ['One identity', T.WEAVE[1], [0, 1, 0]], ['Show, don’t promise', T.WEAVE[2], [3, 2, 1]], ['Phones first', T.WEAVE[3], [2, 3, 2]]];

    SCENE.add('tw-plan', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var L = P ? { x: 16, w: 608, top: 84, h: 200, gap: 10, sw: 138, sh: 138, sx: 10, sy: 48, step: 148 }
                : { x: 36, w: 1128, top: 62, h: 198, gap: 18, sw: 214, sh: 136, sx: 64, sy: 50, step: 272 };
      function laneY(i){ return L.top + i * (L.h + L.gap); }
      function stick(li, ci){ return { x: L.x + L.sx + ci * L.step, y: laneY(li) + L.sy }; }
      // threads run down each note's left edge, so a stitch over the note never crosses its text
      function center(li, ci){ var p = stick(li, ci); return { x: p.x + 11, y: p.y + L.sh / 2 }; }
      var html = '<div class="tw-pl-bg"></div><div class="tw-pl-file">' + T.ICON + '<b>Topicweave — Site plan</b><em>FigJam</em></div>' +
        '<div class="tw-pl-tools"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="tw-pl-cap">Four threads run through every decision.</div>' +
        '<svg class="tw-pl-thr" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>';
      PL.forEach(function(ln, li){
        html += '<div class="tw-pl-lane" style="left:' + L.x + 'px;top:' + laneY(li) + 'px;width:' + L.w + 'px;height:' + L.h + 'px"><span><b>0' + (li + 1) + ' · ' + ln[0] + '</b>' + esc(ln[1]) + '</span></div>';
        ln[2].forEach(function(n, ci){
          var p = stick(li, ci), th = [];
          TH.forEach(function(t, k){ if (t[2][li] === ci) th.push(k); });
          html += '<div class="tw-pl-st" data-l="' + li + '" data-th="' + th.join(' ') + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + L.sw + 'px;height:' + L.sh + 'px;--c:' + TH[th[0]][1] + ';--r:' + ((li * 4 + ci) % 3 - 1) * 1.1 + 'deg"><b data-t="' + esc(n[0]) + '"></b><p>' + esc(n[1]) + '</p><em>Angelino</em></div>';
        });
      });
      html += '<svg class="tw-pl-over" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-pl-leg">' + TH.map(function(t, i){ return '<button type="button" data-th="' + i + '" style="--c:' + t[1] + '"><i></i>' + esc(t[0]) + '</button>'; }).join('') + '</div>' +
        cursor('a', 'Angelino') + '<div class="fg-fade"></div>';
      st.innerHTML = html;
      var svg = q(st, '.tw-pl-thr'), over = q(st, '.tw-pl-over'), lanes = qa(st, '.tw-pl-lane'), sts = qa(st, '.tw-pl-st'), leg = qa(st, '.tw-pl-leg button'), cap = q(st, '.tw-pl-cap'), cur = q(st, '.cur.a');
      // each thread: in from the top, through its three stickies (swaying as it goes), out at the bottom
      var paths = [], stitches = [];
      TH.forEach(function(t, ti){
        var pts = [{ x: center(0, t[2][0]).x + (ti % 2 ? 26 : -26), y: L.top - 14 }].concat(t[2].map(function(c, li){ return center(li, c); }));
        var last = pts[pts.length - 1]; pts.push({ x: last.x + (ti % 2 ? -26 : 26), y: laneY(2) + L.h + 12 });
        var d = 'M' + pts[0].x + ' ' + pts[0].y;
        for (var k = 1; k < pts.length; k++){ var a = pts[k - 1], b = pts[k], my = (a.y + b.y) / 2, sw = (k % 2 ? 1 : -1) * (ti % 2 ? 22 : -22); d += 'C' + (a.x + sw) + ' ' + my + ' ' + (b.x - sw) + ' ' + my + ' ' + b.x + ' ' + b.y; }
        var p = pth(svg, d, 'tw-pl-t'); p.style.stroke = t[1]; p.setAttribute('data-th', ti); paths.push(p);
        // over / under: on alternate stickies the thread is stitched across the face of the note
        t[2].forEach(function(c, li){ if ((li + ti) % 2) return; var m = center(li, c), s = pth(over, 'M' + m.x + ' ' + (m.y - L.sh / 2 - 8) + 'L' + m.x + ' ' + (m.y + L.sh / 2 + 8), 'tw-pl-t is-over'); s.style.stroke = t[1]; s.setAttribute('data-th', ti); stitches.push(s); });
      });
      var marks = qa(st, '[data-th]');
      function light(k){
        st.classList.toggle('pl-hl', k != null);
        marks.forEach(function(e){ var ks = (e.getAttribute('data-th') || '').split(' '); e.classList.toggle('hl', k != null && ks.indexOf(String(k)) > -1); });
      }
      leg.forEach(function(b){
        b.addEventListener('pointerenter', function(){ light(+b.getAttribute('data-th')); });
        b.addEventListener('pointerleave', function(){ if (!sc.paused) light(null); });
        tap(b, function(){ if (sc.hold) sc.hold(); light(+b.getAttribute('data-th')); });
      });
      sts.forEach(function(s){
        s.addEventListener('pointerenter', function(){ var k = s.getAttribute('data-th'); if (k) light(+k.split(' ')[0]); });
        s.addEventListener('pointerleave', function(){ light(null); });
        tap(s, function(){ if (sc.hold) sc.hold(); var on = !s.classList.contains('big'); sts.forEach(function(o){ o.classList.remove('big'); }); s.classList.toggle('big', on); });
      });
      var R = run(sc, function(){ light(null); sts.forEach(function(s){ s.classList.remove('big'); }); paths.concat(stitches).forEach(function(p){ p.classList.remove('woven'); }); }), tl = R.tl;
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0).set(sts.concat(leg, [cap], lanes), { autoAlpha: 0 }, 0);
      paths.concat(stitches).forEach(function(p){ hide(R, p); });
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .3);
      var t = .3, names = ['plan', 'design', 'build'];
      PL.forEach(function(ln, li){
        tl.addLabel(names[li], t);
        tl.fromTo(lanes[li], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
        t += .3;
        sts.filter(function(s){ return +s.getAttribute('data-l') === li; }).forEach(function(s, ci){
          var p = stick(li, ci);
          move(R, cur, { x: p.x + L.sw * .5, y: p.y + L.sh * .45 }, t, .45);
          tl.fromTo(s, { autoAlpha: 0, scale: .7, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + .4);
          var b = q(s, 'b'); type(R, b, b.getAttribute('data-t'), t + .55, .55);
          t += P ? .75 : .85;
        });
        t += .25;
      });
      tl.addLabel('weave', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      paths.forEach(function(p, i){
        draw(R, p, t + i * .7, 1.1);
        stitches.filter(function(s){ return s.getAttribute('data-th') === String(i); }).forEach(function(s){ draw(R, s, t + i * .7 + .8, .3); });
        tl.fromTo(leg[i], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + i * .7 + .3);
      });
      t += paths.length * .7 + 1.2;
      R.at(t, function(){ paths.concat(stitches).forEach(function(p){ p.classList.add('woven'); }); });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
      [0, 1, 2, 3].forEach(function(k, i){ R.at(t + .8 + i * 1.1, function(){ light(k); }); });
      R.at(t + 5.2, function(){ light(null); });
      end(sc, R, t + 6.4, t + .6, [{ t: 'Plan', at: 'plan' }, { t: 'Design', at: 'design' }, { t: 'Build', at: 'build' }, { t: 'Weave', at: 'weave' }]);
    });
  })();
