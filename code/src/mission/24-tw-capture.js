  /* =========================================================
     TOPICWEAVE · VOICE KIT (channel tw-capture)
     A coded replica of the Capture phone prototype (cks-v3 app/mobile.html) in its phone frame, with the
     Voice Kit idea beside it ("Capture, not homework."):
       Record : tap the mic, a live waveform and timer, the transcript types in
       Review : it comes back as a draft in the speaker's words, topic tags arrive one by one
       Publish: Approve, then Publish; the draft card lands on the topic page beside the phone, a thread between
     The mic/stop and Approve buttons are live: they jump to that phase and hold the loop.
     Content is the prototype's own example data (app/mobile.html, app/data.js): "Prototype · sample data".
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, C = T.C, q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';
    var run = X.run, end = X.end, type = X.type;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
    // offset of el inside root, in root's own (unscaled) pixels
    function rel(el, root){ var x = 0, y = 0, n = el; while (n && n !== root){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; }

    var MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
    var TABS = '<nav class="tw-cap-tabs" aria-hidden="true">' +
      '<span class="on">' + MIC + 'Capture</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2.6-8h12.8L21 13v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/></svg>Inbox</span>' +
      '<span><i>2</i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12l3 3 5-6"/></svg>Review</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>Pulse</span></nav>';
    // the prototype's own example: the Friday handoff memo, its draft and its tags (colors from app/data.js)
    var SAY = '“…the partner closes on Thursday, and the invoice goes out Friday from someone the client has never heard of. That’s where it starts to go wrong…”';
    var TITLE = 'Every complaint starts at a handoff';
    var TAGS = [['Client handoffs', '#EF5B3F', 1], ['Client onboarding', '#9B87F5', 1], ['Professional firms', '#B18CFF', 0], ['Journey mapping', '#139E8A', 0]];
    var NOTES = [['01', 'Talk', 'A memo after a call. Two minutes is plenty.'], ['02', 'In your words', 'The draft starts from your own sentences, tagged from your vocabulary.'], ['03', 'You approve', 'Nothing publishes until you say so. That’s the rule, not a setting.']];
    var WCOL = ['#9B87F5', '#EF5B3F', '#139E8A', '#4F7BFF'];

    SCENE.add('tw-capture', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      // phone at the prototype's native size (390×800), scaled into place
      var ph = P ? { k: .72, x: (640 - 390 * .72) / 2, y: 10 } : { k: .86, x: (1200 - 390 * .86) / 2, y: (750 - 800 * .86) / 2 };
      var cd = P ? { x: 40, y: 618, w: 560, h: 124 } : { x: 836, y: 196, w: 330, h: 360 };
      st.innerHTML =
        '<div class="tw-cap-bg"></div>' +
        '<svg class="tw-cap-thr" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        (P ? '' : '<div class="tw-cap-notes"><p class="tw-cap-eye">Voice Kit · Topicweave Capture</p><h3>Capture, not homework.</h3><ol>' +
          NOTES.map(function(n, i){ return '<li data-i="' + i + '"><b>' + n[0] + '</b><strong>' + esc(n[1]) + '</strong><span>' + esc(n[2]) + '</span></li>'; }).join('') + '</ol></div>') +
        '<div class="tw-cap-phone" style="left:' + ph.x + 'px;top:' + ph.y + 'px;transform:scale(' + ph.k + ')"><div class="tw-cap-screen">' +
          '<div class="tw-cap-island"></div><div class="tw-cap-status"><span>9:41</span><span>●●● ⌁ ▮</span></div>' +
          // home
          '<section class="tw-cap-sc" data-sc="home"><p class="tw-cap-sub">Good morning</p><h2>What’s on your mind?</h2>' +
            '<button type="button" class="tw-cap-mic" aria-label="Record a voice memo (jumps to Record)">' + MIC + '</button>' +
            '<p class="tw-cap-q">Tap and talk. Two minutes is plenty.</p>' +
            '<div class="tw-cap-mini"><b>2</b><p>drafts waiting for your review</p></div></section>' +
          // recording
          '<section class="tw-cap-sc" data-sc="rec"><p class="tw-cap-sub">Recording · simulated</p><h2>“What do new clients get wrong?”</h2>' +
            '<canvas class="tw-cap-wave" aria-hidden="true"></canvas><div class="tw-cap-timer">1:14</div>' +
            '<div class="tw-cap-field tw-cap-live"><p class="tw-cap-lab"><i></i>Live transcript</p><p class="tw-cap-say"></p></div>' +
            '<button type="button" class="tw-cap-stop" aria-label="Record again (jumps to Record)"></button></section>' +
          // matching
          '<section class="tw-cap-sc" data-sc="work"><div class="tw-cap-spin"><svg viewBox="0 0 120 120" aria-hidden="true"><line x1="20" y1="40" x2="100" y2="40" stroke="#EF5B3F"/><line x1="20" y1="80" x2="100" y2="80" stroke="#139E8A"/><line x1="40" y1="20" x2="40" y2="100" stroke="#9B87F5"/><line x1="80" y1="20" x2="80" y2="100" stroke="#2F5BEA"/></svg><p>Transcribing and matching<br>to your vocabulary…</p></div></section>' +
          // the draft, in the speaker's words
          '<section class="tw-cap-sc" data-sc="draft"><p class="tw-cap-sub">Draft · from your voice memo · 2:14</p><h2>' + esc(TITLE) + '</h2>' +
            '<div class="tw-cap-read"><p>We’ve read a lot of client complaints over the years. Almost every one of them started at a handoff, the moment work passed from one person to another.</p>' +
            '<p>The partner closes the deal. Then someone new sends the first invoice, and nobody has told the client who that person is.</p></div>' +
            '<div class="tw-cap-field"><p class="tw-cap-lab">Suggested tags · from your vocabulary</p><div class="tw-cap-tags">' +
              TAGS.map(function(t){ return '<span class="tw-cap-tag' + (t[2] ? ' on' : '') + '" style="--c:' + t[1] + '"><i></i>' + esc(t[0]) + '</span>'; }).join('') + '</div></div>' +
            '<div class="tw-cap-cta"><button type="button" class="tw-cap-ok">Approve</button></div></section>' +
          // published
          '<section class="tw-cap-sc" data-sc="done"><div class="tw-cap-done"><div class="tw-cap-tick">✓</div><h2>Published.</h2><p>The library, two topic pages and their related rows updated.</p></div></section>' +
          TABS + '<div class="tw-cap-toast"></div><div class="tw-cap-touch"></div>' +
        '</div></div>' +
        // the topic page on the site
        '<div class="tw-cap-site' + (P ? ' is-p' : '') + '" style="left:' + cd.x + 'px;top:' + cd.y + 'px;width:' + cd.w + 'px;height:' + cd.h + 'px">' + T.bar('yoursite.com/topics/client-handoffs') +
          '<div class="tw-cap-pg"><div class="tw-cap-pgh"><p class="tw-cap-eye"><i style="background:#EF5B3F"></i>Topic · What you watch for</p><h4>Client handoffs</h4><em class="tw-cap-pill">Draft in review</em></div>' +
          '<div class="tw-cap-pgl"><p class="tw-cap-lab">Reading list</p><div class="tw-cap-row tw-cap-new"><b>' + esc(TITLE) + '</b><span>New</span></div>' +
          (P ? '' : '<div class="tw-cap-row"><b>Why handoffs fail on Friday afternoons</b></div><p class="tw-cap-lab">Related topics</p><div class="tw-cap-rel"><span style="--c:#9B87F5"><i></i>Client onboarding</span><span style="--c:#B18CFF"><i></i>Professional firms</span></div>') + '</div></div></div>' +
        '<div class="tw-cap-fly"><b>' + esc(TITLE) + '</b><span><i style="background:#EF5B3F"></i>Client handoffs <i style="background:#9B87F5"></i>Client onboarding</span></div>' +
        '<p class="tw-cap-proto">Prototype · sample data</p>' +
        '<div class="fg-fade"></div>';

      var phone = q(st, '.tw-cap-phone'), scr = q(st, '.tw-cap-screen'), scs = qa(st, '.tw-cap-sc'), mic = q(st, '.tw-cap-mic'), stop = q(st, '.tw-cap-stop');
      var cv = q(st, '.tw-cap-wave'), timer = q(st, '.tw-cap-timer'), say = q(st, '.tw-cap-say'), reads = qa(st, '.tw-cap-read p'), tags = qa(st, '.tw-cap-tag'), okB = q(st, '.tw-cap-ok');
      var cta = q(st, '.tw-cap-cta'), toast = q(st, '.tw-cap-toast'), touch = q(st, '.tw-cap-touch'), site = q(st, '.tw-cap-site'), pill = q(st, '.tw-cap-pill'), nrow = q(st, '.tw-cap-new');
      var fly = q(st, '.tw-cap-fly'), notes = qa(st, '.tw-cap-notes li'), svg = q(st, '.tw-cap-thr'), fade = q(st, '.fg-fade'), lab = q(st, '.tw-cap-live .tw-cap-lab'), nkids = qa(nrow, 'b, span');

      function show(id){ scs.forEach(function(s){ s.classList.toggle('on', s.getAttribute('data-sc') === id); }); }
      function note(i){ notes.forEach(function(n, k){ n.classList.toggle('on', k === i); }); }
      function msg(s){ toast.textContent = s || ''; toast.classList.toggle('on', !!s); }
      function setPub(on){ site.classList.toggle('live', on); nrow.classList.toggle('wait', !on); pill.textContent = on ? 'Published' : 'Draft in review'; }

      // the waveform, drawn from the timeline (no loop of its own)
      var cx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), CW = 350, CH = 120;
      cv.width = CW * dpr; cv.height = CH * dpr;
      function wave(s, amp){
        cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, CW, CH); cx.lineWidth = 3; cx.lineCap = 'round';
        for (var i = 0, n = 46; i < n; i++){
          var x = (i + .5) * (CW / n), env = Math.sin(i / (n - 1) * Math.PI);
          var a = Math.max(1.5, env * (.2 + .8 * Math.abs(Math.sin(i * .5 + s * 5) * Math.sin(i * .17 - s * 3))) * CH * .45 * amp);
          cx.strokeStyle = WCOL[i % 4]; cx.beginPath(); cx.moveTo(x, CH / 2 - a); cx.lineTo(x, CH / 2 + a); cx.stroke();
        }
      }
      function clock(s){ s = Math.floor(s); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }

      // stage geometry: phone-local points → stage
      function sp(el, fx, fy){ var r = rel(el, phone); return { x: ph.x + (r.x + r.w * fx) * ph.k, y: ph.y + (r.y + r.h * fy) * ph.k }; }
      function stp(el, fx, fy){ var r = rel(el, st); return { x: r.x + r.w * fx, y: r.y + r.h * fy }; }
      var h2d = q(st, '[data-sc="done"] h2');
      var a = P ? { x: ph.x + 195 * ph.k, y: ph.y + 800 * ph.k - 4 } : { x: ph.x + 390 * ph.k - 4, y: sp(h2d, 1, .5).y };
      var b = P ? stp(nrow, .3, 0) : stp(nrow, 0, .5);
      var thr = document.createElementNS(NS, 'path');
      thr.setAttribute('d', P ? X.curve(a, { x: b.x, y: b.y - 2 }, true) : X.curve(a, { x: b.x - 2, y: b.y }));
      thr.setAttribute('class', 'tw-cap-ln'); svg.appendChild(thr);
      var L = (thr.getTotalLength ? thr.getTotalLength() : 400) + 2; thr.style.strokeDasharray = L; thr.style.strokeDashoffset = L;
      var dots = [a, b].map(function(p){ var c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 4); c.setAttribute('class', 'tw-cap-dot'); svg.appendChild(c); return c; });
      var fs = sp(h2d, 0, 0), fw = 300 * ph.k; fs.x += 22 * ph.k;   // the card lifts off the draft's headline, then lands in the reading list
      var fe = stp(nrow, 0, 0);

      // a fingertip on the glass
      function press(R, el, t){
        var r = rel(el, scr);
        R.tl.set(touch, { x: r.x + r.w / 2 - 22, y: r.y + r.h / 2 - 22 }, t - .01)
          .fromTo(touch, { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: .18, immediateRender: false }, t)
          .to(touch, { autoAlpha: 0, scale: .8, duration: .25 }, t + .3);
        X.click(R, el, t + .12);
      }

      var R = run(sc, function(){
        show('home'); note(0); msg(''); setPub(false); okB.textContent = 'Approve'; timer.textContent = '1:14'; wave(0, .15);
        lab.classList.remove('on');
      }), tl = R.tl;
      tl.set(fade, { autoAlpha: 0 }, 0).set(touch, { autoAlpha: 0 }, 0).set(fly, { autoAlpha: 0, x: fs.x, y: fs.y, width: fw, scale: 1 }, 0)
        .set(thr, { strokeDashoffset: L }, 0).set(dots, { autoAlpha: 0 }, 0).set(nkids, { autoAlpha: 0 }, 0)
        .set(reads, { autoAlpha: 0 }, 0).set(tags, { autoAlpha: 0 }, 0).set(cta, { autoAlpha: 0 }, 0);

      /* 1 · Record */
      tl.addLabel('record', 0);
      tl.fromTo(phone, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .05);
      press(R, mic, 1.7);
      R.at(1.95, function(){ show('rec'); lab.classList.add('on'); });
      var w = { s: 0, a: .15 };
      tl.fromTo(w, { s: 0, a: .15 }, { s: 5, a: 1, duration: 5, ease: 'none', immediateRender: false, onUpdate: function(){ wave(w.s, Math.min(1, w.a * 3)); timer.textContent = clock(74 + w.s * 1.6); } }, 2);
      type(R, say, SAY, 2.5, 4);
      press(R, stop, 7.1);
      R.at(7.3, function(){ show('work'); lab.classList.remove('on'); });

      /* 2 · Review */
      tl.addLabel('review', 8.1);
      R.at(8.1, function(){ show('draft'); note(1); });
      tl.fromTo(reads, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .3, immediateRender: false }, 8.4);
      tags.forEach(function(g, i){ tl.fromTo(g, { autoAlpha: 0, y: 6, scale: .92 }, { autoAlpha: 1, y: 0, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, 9.5 + i * .5); });
      tl.fromTo(cta, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, 11.6);
      var restAt = 12.5;

      /* 3 · Publish */
      tl.addLabel('publish', 13.1);
      R.at(13.1, function(){ note(2); });
      press(R, okB, 13.5);
      R.at(13.7, function(){ okB.textContent = 'Publish'; msg('Approved. Publish is unlocked.'); });
      press(R, okB, 14.7);
      R.at(14.9, function(){ msg(''); show('done'); setPub(true); });
      tl.fromTo(fly, { autoAlpha: 0, x: fs.x, y: fs.y, scale: 1 }, { autoAlpha: 1, y: fs.y - 10, duration: .3, immediateRender: false }, 14.9)
        .to(fly, { x: fe.x, y: fe.y, width: nrow.offsetWidth, duration: .9, ease: 'power2.inOut' }, 15.25)
        .to(fly, { autoAlpha: 0, duration: .2 }, 16.15)
        .fromTo(nkids, { autoAlpha: 0, y: -4 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, 16.05)
        .to(dots[0], { autoAlpha: 1, duration: .2 }, 15.2)
        .to(thr, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, 15.25)
        .to(dots[1], { autoAlpha: 1, duration: .2 }, 16.1);
      end(sc, R, 20.2, restAt, [{ t: 'Record', at: 'record' }, { t: 'Review', at: 'review' }, { t: 'Publish', at: 'publish' }]);

      // interactive: the mic/stop and Approve jump to their phase, play it through, then hold
      var hop = null;
      function jump(label, to){
        if (hop) hop.kill();
        if (sc.hold) sc.hold();
        tl.seek(tl.labels[label]); if (sc.onSeek) sc.onSeek();
        hop = tl.tweenTo(to, { ease: 'none' });
      }
      tap(mic, function(){ jump('record', 7); });
      tap(stop, function(){ jump('record', 7); });
      tap(okB, function(){ jump('publish', 17.7); });
      // the play button or a phase chip takes the loop back
      sc.capHop = function(){ if (hop){ hop.kill(); hop = null; } };
      if (!sc.capL){ sc.capL = true; sc.view.addEventListener('click', function(e){ var t = e.target; if (sc.capHop && t.closest && t.closest('.scn-ctl')) sc.capHop(); }, true); }
    });
  })();
