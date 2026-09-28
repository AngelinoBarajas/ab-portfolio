/* Flight computer (Services template, replaces "Under the hood") · PROTOTYPE 2026-09-28
   Loaded after ab-core + ab-services on a copy of the staging page. Rebuilds #hood as a console:
   code (lines light up) + a viewport that shows what the code does, Run ▸ to replay, channels per program.
   Snippet notes are trailing `@key` comments:  // @y Note   ·   /* @y Note * /   ·   <!-- @y Note -->
   The script strips them from the shown/copied code and a program's timeline calls fc.cue('y'). */
(window.Webflow = window.Webflow || []).push(function(){
  if (window.__abFlightInit) return; window.__abFlightInit = true;
  var AB = window.AB; if (!AB || !AB.ready) return;
  var $ = AB.$, $$ = AB.$$, esc = AB.esc, pad2 = AB.pad2, reduce = AB.reduce, hasGsap = AB.hasGsap;
  var sec = $('#hood'); if (!sec || !hasGsap) return;
  var HERO = $('[data-service-planet]');
  var SLUG = (HERO && HERO.getAttribute('data-slug')) || location.pathname.split('/').pop().replace('.html', '');
  var CODE = { 'webflow-development': 'WFD', 'webgl-data': 'I3D', 'motion': 'MTN', 'branding': 'BRD', 'custom-deploys': 'BYD', 'cms-integrations': 'CMS', 'design-systems': 'DSY', 'performance': 'PRF' };

  /* ---------- highlighter (same token rules as core/37-code.js) ---------- */
  function lang(c){ var t = c.trim(); if (t.charAt(0) === '<') return 'html'; if (/^(\/\*|:root|[.#@a-z][^{(=]*\{)/i.test(t) && !/function|var |=>/.test(t)) return 'css'; return 'js'; }
  function hl(code, lg){
    var re = lg === 'css' ? /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|vh|vw|rem|em|%|s|ms|fr)?)|(--[\w-]+|[a-z-]+(?=\s*:))|(@media|!important)/g
      : lg === 'html' ? /(<!--[\s\S]*?-->)|("[^"]*")|(\b\d+\.?\d*\b)|(<\/?[\w-]+|\/?>)|([\w-]+(?==))/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+\.?\d*\b)|(\b(?:var|function|return|if|else|for|new|true|false|null|this|typeof|continue|break)\b)|(\b(?:window|document|Math|Object)\b)/g;
    var out = '', last = 0, m, cls = ['c', 's', 'n', 'k', 'g'];
    while ((m = re.exec(code))){ out += esc(code.slice(last, m.index)); for (var g = 1; g <= 5; g++) if (m[g] != null){ out += '<i class="t-' + cls[g - 1] + '">' + esc(m[0]) + '</i>'; break; } last = re.lastIndex; }
    return out + esc(code.slice(last));
  }
  var NOTE_RE = /\s*(?:\/\/|\/\*|<!--)\s*@([\w-]+)\s+(.*?)\s*(?:\*\/|-->)?\s*$/;
  function parse(src){
    var lines = [], notes = {};
    src.replace(/^\s*\n|\s+$/g, '').split('\n').forEach(function(l, i){
      var m = l.match(NOTE_RE);
      if (m){ notes[m[1]] = { line: i, text: m[2] }; l = l.slice(0, m.index); }
      lines.push(l);
    });
    return { lines: lines, notes: notes, clean: lines.join('\n') };
  }

  /* =========================================================
     PROGRAMS (per service slug). In Webflow, CH 01's code comes from the Services "Code" field
     (notes as @comments) and CH 02+ from a small "Flight programs" collection; the visuals live here.
     ========================================================= */
  var P = {};
  function rep(s, n){ var o = ''; while (n--) o += s; return o; }

  /* ---------- motion · CH 01 reveal ---------- */
  P.reveal = {
    label: 'Reveal', cap: 'reveal · with a reduced-motion guard',
    code: "if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { // @guard First, respect the visitor: anyone who asks for less motion gets the content straight away.\n" +
      "  gsap.from('.fade-up', { // @from Every card marked .fade-up animates FROM these values to where the layout already put it.\n" +
      "    y: 40, opacity: 0, stagger: .08, // @y Each card starts 40px low and invisible, a beat after the one before.\n" +
      "    ease: 'expo.out', // @ease The feel: a fast start and a soft landing (the curve on the right).\n" +
      "    scrollTrigger: { trigger: '.fade-up', start: 'top 85%' } // @trigger Nothing moves until the cards scroll up to 85% of the screen.\n" +
      "  });\n}",
    tools: [{ k: 'slow', label: 'Slow-mo 3×', on: true }, { k: 'rm', label: 'Reduced motion', on: false }],
    build: function(st, fc){
      st.innerHTML = '<div class="mv"><div class="mv-frame"><div class="mv-url"><i></i><i></i><i></i><span>yourbrand.com</span></div><div class="mv-vp">' +
        '<div class="mv-page"><div class="mv-hero"><i></i><i></i><i class="s"></i></div><div class="mv-grid"><div class="mv-row ghosts">' + rep('<div class="mv-ghost"></div>', 4) + '</div>' +
        '<div class="mv-row cards">' + rep('<div class="mv-card"><b></b><i></i><i></i></div>', 4) + '</div></div><div class="mv-more"></div></div>' +
        '<div class="mv-line"><span>start: top 85%</span></div><span class="fc-flag"></span></div></div>' +
        '<div class="mv-ease"><span>ease · expo.out</span><svg viewBox="-6 -6 112 112"><path d="M0 100H100M0 0H100" stroke="rgba(255,255,255,.12)" fill="none"/><path class="c" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle class="d" r="4" fill="#FF6A3D"/></svg><span class="p">progress 0.00</span></div></div>';
      var vp = $('.mv-vp', st), page = $('.mv-page', st), cards = $$('.mv-card', st), ghosts = $$('.mv-ghost', st), line = $('.mv-line', st), flag = $('.fc-flag', st);
      var E = gsap.parseEase('expo.out'), d = '', dot = $('.mv-ease .d', st), pr = $('.mv-ease .p', st);
      for (var i = 0; i <= 40; i++) d += (i ? 'L' : 'M') + (i * 2.5) + ' ' + (100 - E(i / 40) * 100).toFixed(1);
      $('.mv-ease .c', st).setAttribute('d', d);
      function geo(){ // the 85% line, and how far the page must scroll for the cards' top to reach it
        var h = vp.clientHeight, y85 = h * .85, top = $('.mv-grid', st).offsetTop + 18;
        line.style.top = y85 + 'px';
        return Math.max(0, top - y85 + 26);
      }
      function reset(){
        gsap.killTweensOf([page, cards, ghosts, flag, dot]);
        gsap.set(page, { y: 0 }); gsap.set(cards, { y: 0, opacity: 1 }); gsap.set(ghosts, { opacity: 0 }); gsap.set(flag, { opacity: 0 });
        cards.forEach(function(c){ c.classList.remove('sel'); }); line.classList.remove('hit');
        gsap.set(dot, { attr: { cx: 0, cy: 100 } }); pr.textContent = 'progress 0.00';
        geo();
      }
      reset();
      return {
        reset: reset,
        play: function(){
          var k = fc.tool('slow') ? 3 : 1, rm = fc.tool('rm'), dist = geo(), tl = gsap.timeline();
          gsap.set(cards, { opacity: 0 });
          tl.call(fc.cue, ['guard'])
            .call(function(){ flag.className = 'fc-flag ' + (rm ? 'skip' : 'ok'); flag.textContent = rm ? 'reduce → skip the animation' : 'no preference → animate'; })
            .to(flag, { opacity: 1, duration: .25 }).to({}, { duration: 1.3 });
          if (rm){
            tl.to(flag, { opacity: 0, duration: .2 }).to(page, { y: -dist, duration: 1, ease: 'power2.inOut' }).set(cards, { opacity: 1 }).to({}, { duration: .6 });
            return tl;
          }
          tl.to(flag, { opacity: 0, duration: .2 })
            .call(fc.cue, ['from']).set(cards, { opacity: 1 }).call(function(){ cards.forEach(function(c){ c.classList.add('sel'); }); })
            .to(page, { y: -Math.min(dist, 40), duration: .6, ease: 'power2.out' }).to({}, { duration: 1.1 })
            .call(fc.cue, ['y']).to(ghosts, { opacity: 1, duration: .3 })
            .to(cards, { y: 40, opacity: 0, duration: .6, ease: 'power2.in', stagger: .06 }).to({}, { duration: 1 })
            .call(function(){ cards.forEach(function(c){ c.classList.remove('sel'); }); })
            .call(fc.cue, ['trigger']).to(page, { y: -dist, duration: 1.4, ease: 'power2.inOut' }).call(function(){ line.classList.add('hit'); })
            .call(fc.cue, ['ease'])
            .to(cards, { y: 0, opacity: 1, duration: .5 * k, ease: 'expo.out', stagger: .08 * k })
            .fromTo({ p: 0 }, { p: 0 }, { p: 1, duration: .5 * k, ease: 'none', onUpdate: function(){ var p = this.targets()[0].p; gsap.set(dot, { attr: { cx: p * 100, cy: 100 - E(p) * 100 } }); pr.textContent = 'progress ' + E(p).toFixed(2); } }, '<')
            .to(ghosts, { opacity: 0, duration: .6 }, '>-.1').call(function(){ line.classList.remove('hit'); });
          return tl;
        }
      };
    }
  };

  /* ---------- motion · CH 02 easing ---------- */
  var EASES = ['expo.out', 'power3.inOut', 'back.out(2)', 'elastic.out(1, 0.4)', 'bounce.out', 'none'];
  P.ease = {
    label: 'Easing', cap: 'easing · tuned by hand',
    code: function(fc){ return "gsap.to('.ship', { // @target One element: the ship.\n  x: 280, // @x It travels 280px to the right.\n  duration: 1.2, // @dur The trip always takes 1.2 seconds.\n  ease: '" + (fc.val('ease') || 'expo.out') + "' // @ease The ease is the whole feel. Same distance, same time: pick another below and watch the spacing change.\n});"; },
    edit: 'ease',
    tools: EASES.map(function(e, i){ return { k: 'ease', v: e, label: e.replace('(1, 0.4)', '').replace('(2)', ''), on: !i }; }),
    build: function(st, fc){
      st.innerHTML = '<div class="ez"><div class="ez-graph"><svg viewBox="-6 -40 212 180"><path class="ax" d="M0 100H200M0 0H200" stroke="rgba(255,255,255,.14)" fill="none" stroke-dasharray="3 4"/><text x="204" y="3" fill="#8A8FA3" font-size="9" font-family="JetBrains Mono,monospace">280px</text><text x="204" y="103" fill="#8A8FA3" font-size="9" font-family="JetBrains Mono,monospace">0</text><path class="c" fill="none" stroke="#FF6A3D" stroke-width="2"/><circle class="d" r="5" fill="#FF6A3D"/></svg></div>' +
        '<div class="ez-track"><svg class="ez-ship" viewBox="-12 -12 24 24"><rect x="-7" y="-7" width="14" height="14" fill="#FF6A3D" transform="rotate(45)"/><rect x="-3" y="-3" width="6" height="6" fill="#07080D" transform="rotate(45)"/></svg><div class="ez-dist"><span>x: 280</span></div></div>' +
        '<div class="ez-timer"><i></i></div><div class="ez-read"><span>t <b class="t">0.00 s</b></span><span>x <b class="x">0 px</b></span></div></div>';
      var track = $('.ez-track', st), ship = $('.ez-ship', st), dot = $('.d', st), curve = $('.c', st), dist = $('.ez-dist', st), timer = $('.ez-timer i', st), tt = $('.t', st), tx = $('.x', st);
      function draw(){
        var E = gsap.parseEase(fc.val('ease') || 'expo.out'), d = '';
        for (var i = 0; i <= 80; i++){ var t = i / 80; d += (i ? 'L' : 'M') + (t * 200).toFixed(1) + ' ' + (100 - E(t) * 100).toFixed(1); }
        curve.setAttribute('d', d); return E;
      }
      function reset(){
        gsap.killTweensOf([ship, dot, dist, timer]);
        $$('.ez-mark', track).forEach(function(m){ m.remove(); });
        draw(); gsap.set(ship, { x: 0 }); gsap.set(dot, { attr: { cx: 0, cy: 100 } }); gsap.set(dist, { opacity: 0 }); gsap.set(timer, { scaleX: 0 });
        tt.textContent = '0.00 s'; tx.textContent = '0 px';
      }
      reset();
      return {
        reset: reset,
        play: function(){
          var E = draw(), W = track.clientWidth - 26, tl = gsap.timeline(), o = { p: 0 }, marks = 0;
          tl.call(fc.cue, ['target']).fromTo(ship, { scale: 1 }, { scale: 1.5, duration: .25, yoyo: true, repeat: 3, ease: 'power1.inOut' }).to({}, { duration: .5 })
            .call(fc.cue, ['x']).to(dist, { opacity: 1, duration: .3 }).to({}, { duration: 1.1 })
            .call(fc.cue, ['dur']).to(timer, { scaleX: 1, duration: .8, ease: 'none' }).set(timer, { scaleX: 0 }).to({}, { duration: .5 })
            .call(fc.cue, ['ease']).to(dist, { opacity: .35, duration: .3 })
            .to(o, { p: 1, duration: 1.2, ease: 'none', onUpdate: function(){
              var e = E(o.p), x = 13 + e * W;
              gsap.set(ship, { x: e * W }); gsap.set(dot, { attr: { cx: o.p * 200, cy: 100 - e * 100 } });
              tt.textContent = (o.p * 1.2).toFixed(2) + ' s'; tx.textContent = Math.round(e * 280) + ' px';
              // a mark every 1/15 s: bunched marks = slow, spread marks = fast
              while (marks <= Math.floor(o.p * 18)){ var m = document.createElement('i'); m.className = 'ez-mark'; m.style.left = (13 + E(marks / 18) * W) + 'px'; track.appendChild(m); marks++; }
            } }).to({}, { duration: .4 });
          return tl;
        }
      };
    }
  };

  /* ---------- interactive 3D + data · CMS rows become globe pins ---------- */
  var CITIES = [['New York', 40.7, -74.0], ['Las Vegas', 36.2, -115.1], ['London', 51.5, -0.1], ['Tokyo', 35.7, 139.7]];
  var MORE = [['Mexico City', 19.4, -99.1], ['Paris', 48.9, 2.4], ['Sydney', -33.9, 151.2], ['Cape Town', -33.9, 18.4]];
  P.pins = {
    label: 'CMS → globe', cap: '3d scene · data from the cms',
    code: "document.querySelectorAll('[data-globe-city]').forEach(function(el){ // @query Find every CMS item on the page that has a city.\n" +
      "  pins.push({ // @push Each one becomes a pin on the globe.\n" +
      "    lat: parseFloat(el.dataset.globeLat), // @lat Its coordinates come straight from the item's fields...\n" +
      "    lng: parseFloat(el.dataset.globeLng),\n" +
      "    title: el.dataset.globeTitle // @title ...and so does its label. Add an item in the CMS and the globe updates. No code change.\n" +
      "  });\n});",
    tools: [{ k: 'add', label: '+ Add a CMS item', act: true }],
    build: function(st, fc){
      st.innerHTML = '<div class="gb"><div class="gb-cms"><div class="gb-cap">CMS · Cities · <b class="n">0</b> items</div><div class="gb-rows"></div></div>' +
        '<div class="gb-globe"><canvas></canvas><div class="gb-count">pins.length = <b>0</b></div></div></div>';
      var rowsBox = $('.gb-rows', st), n = $('.gb-cap .n', st), cnt = $('.gb-count b', st), c = $('canvas', st), host = st.closest('.fc-view');
      var S = 300, dp = Math.min(2, window.devicePixelRatio || 1); c.width = c.height = S * dp;
      var ctx = c.getContext('2d'), W = c.width, R = W * .42, rot = 0, tilt = .35, spinV = 0, pins = [], vis = false, busy = false, data = CITIES.slice(), extra = 0;
      var grid = []; for (var la = -80; la <= 80; la += 8) for (var lo = -180; lo < 180; lo += 8) grid.push([la, lo]);
      function Pj(la, lo){ var p = la * Math.PI / 180, l = lo * Math.PI / 180 + rot, x = Math.cos(p) * Math.sin(l), y = Math.sin(p), z = Math.cos(p) * Math.cos(l); return [W / 2 + x * R, W / 2 - (y * Math.cos(tilt) - z * Math.sin(tilt)) * R, y * Math.sin(tilt) + z * Math.cos(tilt)]; }
      function draw(){
        ctx.clearRect(0, 0, W, W);
        ctx.fillStyle = '#F2F0EA';
        grid.forEach(function(q){ var p = Pj(q[0], q[1]); if (p[2] < 0) return; ctx.globalAlpha = .08 + p[2] * .45; ctx.fillRect(p[0], p[1], 1.6 * dp, 1.6 * dp); });
        ctx.globalAlpha = 1; ctx.font = (10 * dp) + 'px JetBrains Mono, monospace';
        var now = performance.now();
        pins.forEach(function(q, i){
          var p = Pj(q[1], q[2]); if (p[2] < .02) return;
          ctx.globalAlpha = Math.min(1, p[2] * 3) * q.a;
          ctx.fillStyle = '#FF6A3D'; ctx.beginPath(); ctx.arc(p[0], p[1], 4 * dp, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,106,61,.5)'; ctx.lineWidth = 1.5 * dp; ctx.beginPath(); ctx.arc(p[0], p[1], (8 + (now / 70 + i * 9) % 12) * dp, 0, 7); ctx.stroke();
          if (q.label){ ctx.fillStyle = '#F2F0EA'; ctx.fillText(q[0], p[0] + 9 * dp, p[1] - 7 * dp); }
        });
        ctx.globalAlpha = 1;
      }
      // canvas px -> px inside the viewport pane (for the flying dot)
      function toHost(p){ var r = c.getBoundingClientRect(), h = host.getBoundingClientRect(); return [r.left - h.left + p[0] / W * r.width, r.top - h.top + p[1] / W * r.height]; }
      function rowHTML(q){ return '<div class="gb-row"><b>' + esc(q[0]) + '</b><span>' + q[1].toFixed(1) + ', ' + q[2].toFixed(1) + '</span></div>'; }
      function reset(){
        gsap.killTweensOf($$('.gb-row', st)); $$('.gb-dot', host).forEach(function(d){ d.remove(); });
        pins = []; rowsBox.innerHTML = data.map(rowHTML).join(''); n.textContent = data.length; cnt.textContent = '0'; busy = false; draw();
      }
      // one item: highlight its row, read lat/lng, fly a dot to its spot (the globe turns to face it), label it
      function item(tl, i){
        var q = data[i], row = $$('.gb-row', rowsBox)[i];
        tl.call(function(){ $$('.gb-row', rowsBox).forEach(function(r){ r.classList.remove('on', 'hot'); }); row.classList.add('on'); })
          .call(fc.cue, ['push']).to({}, { duration: .35 })
          .call(fc.cue, ['lat']).call(function(){ row.classList.add('hot'); }).to({}, { duration: .5 });
        var o = { p: 0 }, dot, from, target = -q[2] * Math.PI / 180 - .35, start;
        tl.call(function(){
          dot = document.createElement('i'); dot.className = 'gb-dot'; host.appendChild(dot);
          var rr = row.getBoundingClientRect(), h = host.getBoundingClientRect(); from = [rr.right - h.left - 20, rr.top - h.top + rr.height / 2];
          start = rot; target = start + (((target - start) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // shortest turn
        }).to(o, { p: 1, duration: .9, ease: 'power2.inOut', onUpdate: function(){
          rot = start + (target - start) * o.p;
          var to = toHost(Pj(q[1], q[2])), x = from[0] + (to[0] - from[0]) * o.p, y = from[1] + (to[1] - from[1]) * o.p - Math.sin(o.p * Math.PI) * 40;
          dot.style.left = x + 'px'; dot.style.top = y + 'px';
          if (!vis || reduce) draw();
        } }).call(function(){
          dot.remove(); var pin = [q[0], q[1], q[2]]; pin.a = 1; pins.push(pin); cnt.textContent = pins.length;
          row.classList.remove('on', 'hot'); row.classList.add('done');
        }).call(fc.cue, ['title']).call(function(){ pins[pins.length - 1].label = true; }).to({}, { duration: .45 });
      }
      if (!reduce) gsap.ticker.add(function(t, dt){ if (!vis) return; if (!busy) rot += dt * .00025 + spinV; spinV *= .94; draw(); });
      if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis = es[0].isIntersecting; }).observe(c); else vis = true;
      var lastX = null;
      c.addEventListener('pointerdown', function(e){ lastX = e.clientX; c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointermove', function(e){ if (lastX === null) return; var dx = e.clientX - lastX; lastX = e.clientX; rot += dx * .012; spinV = dx * .002; draw(); });
      c.addEventListener('pointerup', function(){ lastX = null; });
      reset();
      return {
        reset: reset,
        play: function(){
          var tl = gsap.timeline({ onComplete: function(){ busy = false; } }); busy = true;
          tl.call(fc.cue, ['query'])
            .call(function(){ $$('.gb-row', rowsBox).forEach(function(r, i){ setTimeout(function(){ r.classList.add('found'); }, i * 140); }); }).to({}, { duration: 1.2 });
          data.forEach(function(q, i){ item(tl, i); });
          return tl;
        },
        // tool: add one more CMS item and run the loop for it only
        act: function(k, btn){
          if (busy || extra >= MORE.length) return;
          var q = MORE[extra++]; data.push(q); rowsBox.insertAdjacentHTML('beforeend', rowHTML(q)); n.textContent = data.length;
          var row = rowsBox.lastChild; row.classList.add('found');
          if (extra >= MORE.length){ btn.disabled = true; btn.textContent = 'Demo collection full'; }
          busy = true; var tl = gsap.timeline({ onComplete: function(){ busy = false; fc.done(); } });
          tl.call(fc.cue, ['query']).to({}, { duration: .6 }); item(tl, data.length - 1);
          fc.running(tl);
        }
      };
    }
  };

  /* ---------- design systems · tokens drive a whole page ---------- */
  var SIGS = [['#FF6A3D', 'Signal'], ['#4C8DFF', 'Blue'], ['#7C5CFF', 'Violet'], ['#0AE448', 'Green']];
  P.tokens = {
    label: 'Tokens', cap: 'tokens · fluid type',
    code: function(fc){ return ":root {\n  --signal: " + (fc.val('sig') || '#FF6A3D') + "; /* @signal One accent color. Every button, link and highlight reads it, so a rebrand is one line. */\n" +
      "  --space-m: clamp(1rem, 2vw, 1.5rem); /* @space Spacing that grows with the screen, between a floor (16px) and a ceiling (24px). */\n" +
      "  --h1: clamp(3.25rem, 10.5vw, 11.25rem); /* @h1 The headline scales with the screen width: never under 52px, never over 180px. No breakpoints to babysit. */\n}"; },
    edit: 'sig',
    tools: SIGS.map(function(s, i){ return { k: 'sig', v: s[0], label: '<i class="sw" style="background:' + s[0] + '"></i>' + s[1], on: !i }; }),
    build: function(st, fc){
      st.innerHTML = '<div class="ds"><div class="ds-ruler"><span>Screen</span><b class="w">1440px</b><input class="ds-range" type="range" min="360" max="1440" step="1" value="1440" aria-label="Screen width"></div>' +
        '<div class="ds-screen"><div class="ds-page"><div class="ds-nav"><i></i><span class="ds-btn">Book a call</span></div><h3 class="ds-h1">Built to <span>launch</span></h3><div class="ds-p"><i></i><i></i></div>' +
        '<div class="ds-cards"><div class="ds-card"><b></b><i></i><i></i></div><div class="ds-card"><b></b><i></i><i></i></div><div class="ds-card"><b></b><i></i><i></i></div></div><span class="ds-btn" style="align-self:flex-start">Start a project</span></div></div>' +
        '<div class="ds-read"><span data-r="sig"><i class="ds-sw"></i>--signal <b class="sig">#FF6A3D</b></span><span data-r="sp">--space-m <b class="sp">24px</b></span><span data-r="h1">--h1 <b class="h1">151px</b></span></div></div>';
      var screen = $('.ds-screen', st), page = $('.ds-page', st), range = $('.ds-range', st), o = { w: 1440 };
      function hot(k){ $$('.ds-read span', st).forEach(function(s){ s.classList.toggle('hot', s.getAttribute('data-r') === k); }); }
      function sig(){ var v = fc.val('sig') || '#FF6A3D'; st.style.setProperty('--sig', v); $('.sig', st).textContent = v; }
      function layout(){
        var w = Math.round(o.w), sp = Math.max(16, Math.min(24, w * .02)), h1 = Math.max(52, Math.min(180, w * .105)), s = screen.clientWidth / 1440;
        page.style.width = w + 'px'; page.style.setProperty('--sp', sp + 'px'); page.style.setProperty('--h1', h1 + 'px');
        page.style.transform = 'scale(' + s + ')';
        $('.w', st).textContent = w + 'px'; $('.sp', st).textContent = Math.round(sp) + 'px'; $('.h1', st).textContent = Math.round(h1) + 'px';
        range.value = w;
      }
      range.addEventListener('input', function(){ gsap.killTweensOf(o); o.w = +range.value; layout(); hot('h1'); fc.cue('h1'); });
      addEventListener('resize', layout);
      function reset(){ gsap.killTweensOf(o); page.classList.remove('show-sp'); hot(''); sig(); o.w = 1440; layout(); }
      reset();
      return {
        reset: reset, redraw: function(){ sig(); hot('sig'); },
        play: function(){
          var tl = gsap.timeline(), btns = $$('.ds-btn, .ds-card b, .ds-h1 span', st);
          tl.call(fc.cue, ['signal']).call(function(){ hot('sig'); })
            .fromTo(btns, { filter: 'brightness(1)' }, { filter: 'brightness(1.6)', duration: .2, yoyo: true, repeat: 3, stagger: .03 }).to({}, { duration: 1 })
            .call(fc.cue, ['space']).call(function(){ hot('sp'); page.classList.add('show-sp'); }).to({}, { duration: 1.8 })
            .call(function(){ page.classList.remove('show-sp'); })
            .call(fc.cue, ['h1']).call(function(){ hot('h1'); })
            .to(o, { w: 390, duration: 2.2, ease: 'power2.inOut', onUpdate: layout })
            .to(o, { w: 1440, duration: 2.2, ease: 'power2.inOut', onUpdate: layout }, '+=.5')
            .to(o, { w: 1024, duration: 1, ease: 'power2.out', onUpdate: layout }, '+=.3');
          return tl;
        }
      };
    }
  };

  var BY_SLUG = { motion: ['reveal', 'ease'], 'webgl-data': ['pins'], 'design-systems': ['tokens'] };
  var LIST = (BY_SLUG[SLUG] || []).map(function(k){ return P[k]; });
  if (!LIST.length) return;

  /* =========================================================
     CONSOLE
     ========================================================= */
  var no = $('.ab_sv_rail_link.is-on .ab_sv_rail_no');
  var ID = 'AB-' + (no ? no.textContent.trim() : '0?') + ' · ' + (CODE[SLUG] || 'SVC') + ' · Flight computer';
  var fl = $('.ab_frame-label', sec); if (fl) fl.textContent = '▢ flight-computer'; sec.setAttribute('data-frame', 'flight-computer');
  var inner = $('.padding-section-medium', sec) || sec;
  inner.innerHTML = '<div class="fc">' +
    '<div class="fc-head"><div class="fc-copy"><div class="text-style-eyebrow">/engineer · flight computer</div>' +
    '<h2 class="heading-style-h2 is-hood" id="hood-h">Flight <span class="t-outline">computer</span></h2>' +
    '<p class="ab_sec-h_lede text-size-lede">The code that flies this service. Run a program and watch what each line does.</p>' +
    '<div class="fc-hint"><span><b>◆</b> Hover a marked line</span><span><b>▸</b> Run to replay</span></div></div>' +
    (LIST.length > 1 ? '<div class="fc-chans" role="tablist" aria-label="Programs">' + LIST.map(function(p, i){ return '<button type="button" class="fc-chan" role="tab" aria-selected="' + (!i) + '"><i>CH ' + pad2(i + 1) + '</i>' + esc(p.label) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
    '<div class="fc-mon" data-state="idle"><div class="fc-bar"><span class="rec"><span>FC</span></span><span class="fc-id">' + esc(ID) + '</span><span class="fc-state">Standby</span><span class="fc-tc">T+00:00.0</span></div>' +
    '<div class="fc-body"><div class="fc-code"><div class="fc-cap"><span class="cb-l">JS</span><span class="cb-n"></span><button type="button" class="cb-copy">Copy</button></div><pre class="fc-pre"><code></code></pre></div>' +
    '<div class="fc-view"><div class="scan" aria-hidden="true"></div><div class="vig" aria-hidden="true"></div><div class="roll" aria-hidden="true"></div><i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i><div class="osd"></div><div class="fc-stage"></div></div></div>' +
    '<div class="fc-foot"><button type="button" class="fc-run"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 0l9 5-9 5z"/></svg><span>Run program</span></button><div class="fc-note" aria-live="polite"><b></b><span></span></div><div class="fc-tools"></div></div></div></div>';

  var mon = $('.fc-mon', inner), body = $('.fc-body', inner), codeEl = $('.fc-pre code', inner), stage = $('.fc-stage', inner), osd = $('.osd', inner);
  var noteB = $('.fc-note b', inner), noteS = $('.fc-note span', inner), tools = $('.fc-tools', inner), runBtn = $('.fc-run', inner), stateEl = $('.fc-state', inner), tcEl = $('.fc-tc', inner);
  var cur = null, inst = null, parsed = null, tl = null, t0 = 0, vals = {}, flags = {}, idx = 0, booted = false;

  var fc = {
    tool: function(k){ return !!flags[k]; },
    val: function(k){ return vals[k]; },
    cue: function(key){
      var n = parsed && parsed.notes[key]; if (!n) return;
      $$('.fc-ln', codeEl).forEach(function(l, i){ l.classList.toggle('on', i === n.line); });
      note(n);
    },
    running: function(t){ setState('run'); tl = t; t0 = performance.now(); },
    done: function(){ setState('done'); }
  };
  function note(n){ noteB.textContent = 'Line ' + pad2(n.line + 1); noteS.textContent = n.text; if (!reduce) gsap.fromTo(noteS, { opacity: 0, x: 6 }, { opacity: 1, x: 0, duration: .3 }); }
  function setState(s){ mon.setAttribute('data-state', s); stateEl.textContent = s === 'run' ? 'Running' : s === 'done' ? 'Complete' : 'Standby'; runBtn.lastChild.textContent = s === 'done' ? 'Run again' : 'Run program'; }
  gsap.ticker.add(function(){ if (mon.getAttribute('data-state') !== 'run') return; var s = (performance.now() - t0) / 1000; tcEl.textContent = 'T+' + pad2(Math.floor(s / 60)) + ':' + pad2(Math.floor(s % 60)) + '.' + Math.floor(s * 10 % 10); });

  function render(){
    var src = typeof cur.code === 'function' ? cur.code(fc) : cur.code, lg = lang(src);
    parsed = parse(src);
    var html = hl(parsed.clean, lg).split('\n'), lineOf = {};
    Object.keys(parsed.notes).forEach(function(k){ lineOf[parsed.notes[k].line] = k; });
    codeEl.innerHTML = html.map(function(h, i){
      var k = lineOf[i];
      return '<span class="fc-ln' + (k ? ' has-note' : '') + (cur.edit && k === 'ease' || cur.edit && k === 'signal' ? ' is-edit' : '') + '"' + (k ? ' tabindex="0" data-k="' + k + '"' : '') + '><b>' + pad2(i + 1) + '</b><span>' + (h || ' ') + '</span></span>';
    }).join('');
    $('.cb-l', inner).textContent = lg.toUpperCase(); $('.cb-n', inner).textContent = cur.cap;
  }
  // hover / focus a marked line: its note (and the line) light up
  function peek(e){
    var l = e.target.closest && e.target.closest('.fc-ln.has-note'); if (!l || mon.getAttribute('data-state') === 'run') return;
    fc.cue(l.getAttribute('data-k'));
  }
  codeEl.addEventListener('pointerover', peek); codeEl.addEventListener('focusin', peek);
  // Copy gives the clean code (notes stripped); core's .cb-copy handler reads the <code> inside .cb, so handle it here
  $('.cb-copy', inner).addEventListener('click', function(e){
    e.stopPropagation(); var b = this, t = parsed ? parsed.clean : '';
    function ok(){ b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function(){ b.textContent = 'Copy'; b.classList.remove('ok'); }, 1400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, ok); else ok();
  });

  function typeIn(){
    var ls = $$('.fc-ln', codeEl); if (reduce) return 0;
    ls.forEach(function(l){ l.classList.add('is-typing'); });
    ls.forEach(function(l, i){
      var sp = l.lastChild, n = Math.max(4, Math.min(40, sp.textContent.length));
      gsap.fromTo(sp, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: n * .012, ease: 'steps(' + n + ')', delay: i * .14, onStart: function(){ l.classList.remove('is-typing'); }, clearProps: 'clipPath' });
    });
    return ls.length * .14 + .4;
  }

  function toolsFor(){
    tools.innerHTML = '';
    (cur.tools || []).forEach(function(t){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'fc-tool'; b.innerHTML = t.label;
      if (!t.act) b.setAttribute('aria-pressed', String(!!t.on));
      if (t.v != null){ if (t.on) vals[t.k] = t.v; }
      else if (!t.act) flags[t.k] = !!t.on;
      b.addEventListener('click', function(){
        if (t.act){ if (inst.act) inst.act(t.k, b); return; }
        if (t.v != null){ $$('.fc-tool', tools).forEach(function(x){ if (x.__k === t.k) x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true'); vals[t.k] = t.v; render(); if (inst.redraw) inst.redraw(); }
        else { flags[t.k] = !flags[t.k]; b.setAttribute('aria-pressed', String(flags[t.k])); }
        run();
      });
      b.__k = t.k; tools.appendChild(b);
    });
  }

  function load(i, first){
    if (tl) tl.kill(); tl = null;
    idx = i; cur = LIST[i]; vals = {}; flags = {};
    toolsFor(); render();
    osd.textContent = 'CH ' + pad2(i + 1) + ' · ' + cur.label;
    inst = cur.build(stage, fc);
    setState('idle'); tcEl.textContent = 'T+00:00.0';
    var first1 = parsed.notes[Object.keys(parsed.notes)[0]]; noteB.textContent = 'Ready'; noteS.textContent = 'Press Run, or hover a marked line.';
    if (!first){ body.classList.remove('is-switch'); void body.offsetWidth; body.classList.add('is-switch'); var d = typeIn(); setTimeout(run, d * 1000); }
    return first1;
  }
  function run(){
    if (tl) tl.kill();
    inst.reset();
    $$('.fc-ln', codeEl).forEach(function(l){ l.classList.remove('on'); });
    var t = inst.play();
    fc.running(t);
    t.eventCallback('onComplete', function(){ setState('done'); });
    if (reduce){ t.progress(1); setState('done'); var ks = Object.keys(parsed.notes); fc.cue(ks[ks.length - 1]); }
  }
  runBtn.addEventListener('click', run);
  $$('.fc-chan', inner).forEach(function(b, i){
    b.addEventListener('click', function(){
      if (i === idx) return;
      $$('.fc-chan', inner).forEach(function(x, j){ x.setAttribute('aria-selected', String(j === i)); });
      load(i);
    });
  });

  load(0, true);
  // boot when the console scrolls into view: type the code in, then run once
  function boot(){ if (booted) return; booted = true; var d = typeIn(); setTimeout(run, d * 1000 + 300); }
  if ('IntersectionObserver' in window){ var io = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ boot(); io.disconnect(); } }, { threshold: .35 }); io.observe(mon); }
  else boot();
  if (/[?&]fc=run/.test(location.search)) boot();
});
