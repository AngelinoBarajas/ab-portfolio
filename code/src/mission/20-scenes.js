  /* =========================================================
     MISSION CONTROL SCENES
     figma : a coded Figma file that goes wireframe → design → review → build → live
     phone : a coded phone running the mobile layout, with the decisions behind it
     sketch: AB Identity, pen + paper iterations (v01 → v25), rejects crossed out, the winner circled
     vector: AB Identity, the mark traced in a coded Illustrator (pen tool, Pathfinder, token colors, export)
     Both are drawn on a fixed stage (1200×750, or 640×800 on phones) and scaled to fit.
     ========================================================= */
  var SCENE = (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scenes = {}, active = null, EXT = {};
    function mk(tag, cls, html){ var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function q(r, s){ return r.querySelector(s); }
    function qa(r, s){ return Array.prototype.slice.call(r.querySelectorAll(s)); }
    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var ICON_PAUSE = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1" width="2.5" height="8"/><rect x="6" y="1" width="2.5" height="8"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';

    function mount(view, c, M){
      if (!M.mock) return;
      var sc = { id: c.id, kind: c.kind, view: view, c: c, M: M, inView: false, paused: false, started: false };
      scenes[c.id] = sc;
      build(sc);
      if (window.ResizeObserver) new ResizeObserver(function(){
        var p = view.clientHeight > view.clientWidth * 1.02;
        if (p !== sc.portrait){ var t = sc.tl ? sc.tl.time() : 0; if (sc.tl) sc.tl.kill(); build(sc); if (sc.started) { sc.tl.seek(Math.min(t, sc.tl.duration() - .1)); if (sc.onSeek) sc.onSeek(); } sync(sc); }
        else fit(sc);
      }).observe(view);
      new IntersectionObserver(function(es){ sc.inView = es[0].isIntersecting; sync(sc); }, { rootMargin: '100px' }).observe(view);
    }
    function build(sc){
      var v = sc.view; sc.portrait = v.clientHeight > v.clientWidth * 1.02;
      sc.SW = sc.portrait ? 640 : 1200; sc.SH = sc.portrait ? 800 : 750;
      qa(v, '.stg-w,.scn-ctl').forEach(function(n){ n.parentNode.removeChild(n); });
      var w = mk('div', 'stg-w'); sc.stg = mk('div', 'stg' + (sc.portrait ? ' is-p' : '') + ' stg-' + sc.kind);
      sc.stg.style.width = sc.SW + 'px'; sc.stg.style.height = sc.SH + 'px';
      sc.stg.style.setProperty('--acc', sc.M.mock.accent || '#FF6A3D');
      w.appendChild(sc.stg); v.appendChild(w);
      (EXT[sc.kind] || ({ figma: buildFigma, phone: buildPhone, flow: buildFlow, exploded: buildExplode, cms: buildCms, sketch: buildSketch, vector: buildVector })[sc.kind])(sc);
      fit(sc);
    }
    function fit(sc){
      var v = sc.view, W = v.clientWidth, H = v.clientHeight; if (!W || !H) return;
      var k = Math.min(W / sc.SW, H / sc.SH); sc.k = k;
      sc.stg.style.transform = 'translate(' + (W - sc.SW * k) / 2 + 'px,' + (H - sc.SH * k) / 2 + 'px) scale(' + k + ')';
    }
    function sync(sc){
      if (!sc.tl) return;
      var go = sc.id === active && sc.inView && !sc.paused && !reduce;
      if (go){ if (!sc.started){ sc.started = true; sc.tl.restart(); } else if (sc.tl.paused()) sc.tl.play(); }
      else if (!sc.tl.paused()) sc.tl.pause();
      if (reduce && sc.id === active && !sc.started){ sc.started = true; sc.tl.seek(sc.restAt || sc.tl.duration() - .5).pause(); if (sc.onSeek) sc.onSeek(); }
    }
    function activate(id){ active = id; Object.keys(scenes).forEach(function(k){ sync(scenes[k]); }); }

    // real-size overlay: play/pause + optional phase chips
    function controls(sc, phases){
      var box = mk('div', 'scn-ctl' + (phases ? '' : ' is-top')), pp = mk('button', 'scn-pp', reduce ? ICON_PLAY : ICON_PAUSE), chips = [];
      pp.type = 'button'; pp.setAttribute('aria-label', reduce ? 'Play animation' : 'Pause animation');
      if (reduce) sc.paused = true;
      pp.addEventListener('click', function(){
        sc.paused = !sc.paused; if (!sc.paused && reduce && sc.tl){ sc.tl.play(); }
        pp.innerHTML = sc.paused ? ICON_PLAY : ICON_PAUSE; pp.setAttribute('aria-label', sc.paused ? 'Play animation' : 'Pause animation');
        if (sc.paused) sc.tl.pause(); else { sc.started = true; sc.tl.play(); }
      });
      box.appendChild(pp);
      (phases || []).forEach(function(p, i){
        var b = mk('button', 'scn-ph', '<i></i>' + esc(p.t)); b.type = 'button';
        b.addEventListener('click', function(){ sc.started = true; sc.tl.seek(p.at); if (sc.onSeek) sc.onSeek(); if (!sc.paused) sc.tl.play(); mark(); });
        box.appendChild(b); chips.push(b);
      });
      function mark(){
        if (!chips.length) return; var t = sc.tl.time(), idx = 0;
        phases.forEach(function(p, i){ if (t >= sc.tl.labels[p.at] - .02) idx = i; });
        chips.forEach(function(b, i){ b.classList.toggle('on', i === idx); b.setAttribute('aria-pressed', i === idx ? 'true' : 'false'); });
      }
      sc.tl.eventCallback('onUpdate', mark); mark();
      sc.view.appendChild(box);
    }

    /* ---------------- FIGMA → BUILD ---------------- */
    var ICO = {
      frame: '<svg viewBox="0 0 12 12"><path d="M3.5 0v12M8.5 0v12M0 3.5h12M0 8.5h12"/></svg>',
      text: '<svg viewBox="0 0 12 12"><path d="M2 2.5h8M6 2.5V11"/></svg>',
      img: '<svg viewBox="0 0 12 12"><rect x="1" y="2" width="10" height="8"/><path d="M1 8.5l3-2.8 3 2.8 1.6-1.4L11 9"/></svg>',
      comp: '<svg viewBox="0 0 12 12"><path d="M6 .8l2.3 2.3L6 5.4 3.7 3.1zM6 6.6l2.3 2.3L6 11.2 3.7 8.9zM.8 6l2.3-2.3L5.4 6 3.1 8.3zM11.2 6L8.9 3.7 6.6 6l2.3 2.3z"/></svg>',
      rect: '<svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9"/></svg>'
    };
    var TOOLS = ['<path d="M3 2l9 5-4 1.2L6.5 13z"/>', '<path d="M4 1v14M11 1v14M1 4h14M1 11h14"/>', '<rect x="2.5" y="3.5" width="11" height="9"/>', '<path d="M3 13l2.5-1 6.5-6.5-1.5-1.5L4 10.5zM10 4l2-2 2 2-2 2"/>', '<path d="M3 3.5h10M8 3.5V13"/>', '<path d="M5 8V3.5a1 1 0 012 0V7m0-2.5a1 1 0 012 0V7m0-1.5a1 1 0 012 0V9c0 3-2 4.5-4 4.5S4.5 12.5 3.5 11L2 8.5a1 1 0 011.6-1.1L5 9"/>', '<path d="M2.5 3.5h11v7H7l-3 2.5v-2.5H2.5z"/>'];
    function wire(e){
      var k = e.wire || 'block', s, i, n;
      if (k === 'img') return '<div class="wf wf-img"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 0L100 100M100 0L0 100"/></svg><span>Image</span></div>';
      if (k === 'nav') return '<div class="wf wf-nav"><i></i><b></b><b></b><b></b><b></b><em></em></div>';
      if (k === 'btn') return '<div class="wf wf-btn"><i></i></div>';
      if (k.indexOf('lines') === 0){ n = +k.split(':')[1] || 3; s = '<div class="wf wf-lines' + (k.indexOf('big') > 0 ? ' big' : '') + '">'; for (i = 0; i < n; i++) s += '<i style="width:' + (i === n - 1 ? 58 : 96 - i * 5) + '%"></i>'; return s + '</div>'; }
      if (k.indexOf('row') === 0){ n = +k.split(':')[1] || 3; s = '<div class="wf wf-row">'; for (i = 0; i < n; i++) s += '<i></i>'; return s + '</div>'; }
      return '<div class="wf wf-block"></div>';
    }
    function buildFigma(sc){
      var m = sc.M.mock, P = sc.portrait, st = sc.stg, els = m.els;
      var cx = P ? 0 : 220, cy = 40, cw = P ? 640 : 740, ch = P ? 560 : 710;
      var fs = Math.min((cw - 70) / 1000, (ch - 100) / 625), fx = cx + (cw - 1000 * fs) / 2, fy = cy + (ch - 625 * fs) / 2 + 12;
      var bar = 34, fs2 = P ? .62 : Math.min(1.2, (750 - bar - 8) / 625), fx2 = (sc.SW - 1000 * fs2) / 2, fy2 = P ? (sc.SH - 625 * fs2) / 2 + bar / 2 : bar + 4;
      var zoom = Math.round(fs * 1000 / 1440 * 100);
      st.innerHTML =
        '<div class="fg-canvas"></div>' +
        '<div class="ff" style="width:1000px;height:625px"><div class="ff-lab">' + ICO.frame + esc(m.frame) + '</div><div class="ff-bg" style="background:' + m.bg + '"></div>' +
          els.map(function(e){ return '<div class="fe" data-id="' + e.id + '" style="left:' + e.x + 'px;top:' + e.y + 'px;width:' + e.w + 'px;height:' + e.h + 'px"><div class="wfw">' + wire(e) + '</div><div class="hi">' + e.html + '</div></div>'; }).join('') +
          '<div class="ff-grid">' + new Array(13).join('<i></i>') + '</div>' +
          '<div class="fsel"><i style="left:0;top:0"></i><i style="left:100%;top:0"></i><i style="left:0;top:100%"></i><i style="left:100%;top:100%"></i><b></b></div></div>' +
        '<div class="fg-br" style="left:' + fx2 + 'px;width:' + 1000 * fs2 + 'px;height:' + bar + 'px"><span class="d"></span><span class="d"></span><span class="d"></span><span class="url"><svg viewBox="0 0 10 12" aria-hidden="true"><rect x="1" y="5" width="8" height="6" rx="1"/><path d="M3 5V3.5a2 2 0 014 0V5"/></svg>' + esc(m.url) + '</span><span class="live">● Live</span></div>' +
        '<div class="fg-top"><span class="fg-menu"><i></i><i></i><i></i></span><span class="fg-tools">' + TOOLS.map(function(t, i){ return '<i class="' + (i === 0 ? 'on' : '') + '"><svg viewBox="0 0 16 16">' + t + '</svg></i>'; }).join('') + '</span>' +
          '<span class="fg-file"><em>' + esc(m.team || 'Angelino Barajas') + ' / </em>' + esc(m.file) + ' <small>▾</small></span>' +
          '<span class="fg-right"><span class="fg-avs"><span class="fg-av" style="background:#FF6A3D">AB</span><span class="fg-av" style="background:#3BE38A">C</span></span><span class="fg-share">Share</span><span class="fg-zoom">' + zoom + '%</span></span></div>' +
        '<div class="fg-left"><div class="fg-tabs"><b>Layers</b><span>Assets</span></div><div class="fg-page"><span>Pages</span><b>' + esc(m.page || 'Homepage') + '</b></div><div class="fg-sub">Layers</div><ul class="fg-layers"><li data-i="-1"><i>' + ICO.frame + '</i>' + esc(m.frame) + '</li>' +
          els.map(function(e, i){ return '<li class="ch" data-i="' + i + '"><i>' + (ICO[e.icon] || ICO.rect) + '</i>' + esc(e.name) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="fg-rp"><div class="fg-tabs"><b>Design</b><span>Prototype</span></div>' +
          '<div class="fg-sec"><div class="fg-h" data-k="type">Frame</div><div class="fg-g"><span><em>X</em><b data-k="x">0</b></span><span><em>Y</em><b data-k="y">0</b></span><span><em>W</em><b data-k="w">1440</b></span><span><em>H</em><b data-k="h">900</b></span></div></div>' +
          '<div class="fg-sec"><div class="fg-h">Fill</div><div class="fg-fill"><i data-k="sw"></i><b data-k="fill">FFFFFF</b><em>100%</em></div></div>' +
          '<div class="fg-sec fg-txt"><div class="fg-h">Text</div><div class="fg-row"><b data-k="font">Inter</b></div><div class="fg-g"><span><b data-k="weight">Bold</b></span><span><b data-k="size">96</b></span><span><em>LH</em><b data-k="lh">Auto</b></span><span><em>LS</em><b data-k="ls">0%</b></span></div></div>' +
          '<div class="fg-sec fg-exp"><div class="fg-h">Export <span>+</span></div></div></div>' +
        (m.comment ? '<div class="fg-cm"><span class="cm-pin">C</span><div class="cm-card"><div class="cm-msg"><b>' + esc(m.comment.by || 'Client') + '</b><p>' + esc(m.comment.text) + '</p></div><div class="cm-msg cm-reply"><b>Angelino</b><p>' + esc(m.comment.reply) + '</p></div><span class="cm-ok">✓ Resolved</span></div></div>' : '') +
        '<div class="cur b"><svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg><span class="nm">' + esc((m.comment && m.comment.by) || 'Client') + '</span></div>' +
        '<div class="cur a"><svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg><span class="nm">Angelino</span></div>' +
        '<div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';

      var ff = q(st, '.ff'), fsel = q(st, '.fsel'), badge = q(fsel, 'b'), top = q(st, '.fg-top'), left = q(st, '.fg-left'), right = q(st, '.fg-rp'), canvas = q(st, '.fg-canvas'),
        grid = q(st, '.ff-grid'), lab = q(st, '.ff-lab'), ffbg = q(st, '.ff-bg'), br = q(st, '.fg-br'), toast = q(st, '.fg-toast'), fade = q(st, '.fg-fade'), cm = q(st, '.fg-cm'),
        curA = q(st, '.cur.a'), curB = q(st, '.cur.b'), his = qa(ff, '.hi'), wfs = qa(ff, '.wfw'), pops = qa(ff, '.pop'), rows = qa(left, 'li');
      function set(k, v){ var n = q(right, '[data-k="' + k + '"]'); if (n) n.textContent = v; }
      function panel(i){
        rows.forEach(function(li){ li.classList.toggle('on', +li.dataset.i === i); });
        var e = i >= 0 ? els[i] : null, pr = e ? (e.props || {}) : { fill: m.bg };
        right.classList.toggle('is-empty', i < -1);
        set('type', e ? (e.type || 'Layer') : 'Frame');
        set('x', e ? Math.round(e.x * 1.44) : 0); set('y', e ? Math.round(e.y * 1.44) : 0);
        set('w', e ? Math.round(e.w * 1.44) : 1440); set('h', e ? Math.round(e.h * 1.44) : 900);
        set('fill', (pr.fill || '—').replace('#', '')); q(right, '[data-k="sw"]').style.background = /^#/.test(pr.fill || '') ? pr.fill : 'repeating-linear-gradient(45deg,#666 0 3px,#444 3px 6px)';
        q(right, '.fg-txt').style.display = pr.font ? '' : 'none';
        if (pr.font){ set('font', pr.font); set('weight', pr.weight || 'Regular'); set('size', pr.size || '16'); set('lh', pr.lh || 'Auto'); set('ls', pr.ls || '0%'); }
      }
      function hot(id, on){ var n = q(ff, '.fe[data-id="' + id + '"]'); if (n) n.classList.toggle('is-hot', on); }
      function toastTxt(t, ok){ q(toast, 'span').textContent = t; toast.classList.toggle('ok', !!ok); }
      function pt(e, f){ f = f || [fx, fy, fs]; return { x: f[0] + (e.x + e.w * .55) * f[2], y: f[1] + (e.y + e.h * .55) * f[2] }; }

      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ panel(-2); badge.textContent = ''; toastTxt(''); els.forEach(function(e){ hot(e.id, false); }); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };

      // initial state
      tl.addLabel('wire', 0);
      at(.01, reset);
      tl.set(ff, { x: fx, y: fy, scale: fs, transformOrigin: '0 0' }, 0)
        .set(curA, { x: sc.SW * .8, y: sc.SH * .78 }, 0).set(curB, { x: sc.SW + 60, y: sc.SH * .25 }, 0)
        .set(q(curA, '.nm'), { autoAlpha: 1 }, 0)
        .set(fsel, { opacity: 0, left: 0, top: 0, width: 1000, height: 625 }, 0)
        .set(ffbg, { opacity: 0 }, 0).set(his, { clipPath: 'inset(0% 100% 0% 0%)' }, 0).set(wfs, { opacity: 1 }, 0)
        .set([top, left, right], { x: 0, y: 0, opacity: 1 }, 0).set([grid, lab], { opacity: 1 }, 0).set(canvas, { opacity: 1 }, 0)
        .set([br, toast, fade], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0);
      if (pops.length) tl.set(pops, { scale: 0, opacity: 0 }, 0);
      if (cm) tl.set(cm, { autoAlpha: 0 }, 0).set(qa(cm, '.cm-reply,.cm-ok'), { autoAlpha: 0 }, 0);

      // 01 wireframe: select the frame
      tl.to(curA, { x: fx + 60 * fs, y: fy - 16, duration: 1, ease: 'power2.inOut' }, .5);
      at(1.45, function(){ panel(-1); badge.textContent = '1440 × 900'; });
      tl.to(fsel, { opacity: 1, duration: .15 }, 1.45);
      // 02 design: fill the frame, then style each layer
      tl.addLabel('design', 2.1);
      tl.to(ffbg, { opacity: 1, duration: .7, ease: 'power2.out' }, 2.1);
      var t = 2.7;
      els.forEach(function(e, i){
        var p = pt(e);
        tl.to(curA, { x: p.x, y: p.y, duration: .6, ease: 'power2.inOut' }, t);
        tl.to(fsel, { left: e.x, top: e.y, width: e.w, height: e.h, duration: .3, ease: 'power3.out' }, t + .55);
        at(t + .55, function(){ panel(i); badge.textContent = Math.round(e.w * 1.44) + ' × ' + Math.round(e.h * 1.44); });
        tl.to(his[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: .65, ease: 'power2.inOut' }, t + .8);
        tl.to(wfs[i], { opacity: 0, duration: .4 }, t + .95);
        t += 1.4;
      });
      // 03 review: a client comment, a reply, resolved
      tl.addLabel('review', t);
      tl.to(fsel, { opacity: 0, duration: .2 }, t);
      at(t, function(){ panel(-2); });
      if (cm){
        var ce = els.filter(function(e){ return e.id === m.comment.on; })[0] || els[0];
        var cp = { x: fx + (ce.x + ce.w * .8) * fs, y: fy + (ce.y + 10) * fs };
        if (cp.x > sc.SW - 300) cm.classList.add('flip');
        tl.set(cm, { x: cp.x, y: cp.y }, t);
        tl.to(curB, { x: cp.x + 6, y: cp.y - 4, duration: .9, ease: 'power2.inOut' }, t);
        tl.fromTo(cm, { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, t + .9);
        tl.to(curA, { x: cp.x - 30, y: cp.y + 70, duration: .7, ease: 'power2.inOut' }, t + 1.8);
        tl.to(q(cm, '.cm-reply'), { autoAlpha: 1, duration: .35 }, t + 2.5);
        tl.to(q(cm, '.cm-ok'), { autoAlpha: 1, duration: .3 }, t + 3.5);
        tl.to(cm, { autoAlpha: 0, scale: .85, duration: .3 }, t + 4.5);
        tl.to(curB, { x: sc.SW + 60, y: sc.SH * .15, duration: .8, ease: 'power2.in' }, t + 4.3);
        t += 5;
      } else t += .6;
      // 04 build: the Figma chrome falls away and the frame becomes the site
      tl.addLabel('build', t);
      at(t, function(){ toastTxt('Handing off to Webflow…'); });
      tl.to(toast, { autoAlpha: 1, duration: .3 }, t);
      tl.to(top, { y: -60, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to(left, P ? { opacity: 0, duration: .3 } : { x: -240, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to(right, P ? { y: 220, duration: .6, ease: 'power3.in' } : { x: 260, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to([grid, lab], { opacity: 0, duration: .3 }, t + .5);
      tl.to(canvas, { opacity: 0, duration: .6 }, t + .7);
      tl.to(ff, { x: fx2, y: fy2, scale: fs2, duration: 1.1, ease: 'power3.inOut' }, t + .9);
      tl.fromTo(br, { autoAlpha: 0, y: fy2 - bar + 14 }, { autoAlpha: 1, y: fy2 - bar, duration: .5, ease: 'power2.out', immediateRender: false }, t + 1.8);
      at(t + 2.1, function(){ toastTxt('Published · ' + m.url, true); });
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 3.6);
      t += 2.5;
      // 05 live: real hover states and live data
      tl.addLabel('live', t);
      sc.restAt = t + 1.5;
      tl.to(q(curA, '.nm'), { autoAlpha: 0, duration: .2 }, t);
      var he = els.filter(function(e){ return e.id === m.hover; })[0];
      if (he){
        var hp = pt(he, [fx2, fy2, fs2]);
        tl.to(curA, { x: hp.x, y: hp.y, duration: .9, ease: 'power2.inOut' }, t + .2);
        at(t + 1.1, function(){ hot(he.id, true); });
        at(t + 3.4, function(){ hot(he.id, false); });
        tl.to(curA, { x: hp.x + 90, y: hp.y + 60, duration: .8, ease: 'power2.inOut' }, t + 3.3);
      }
      if (pops.length) tl.to(pops, { scale: 1, opacity: 1, duration: .45, stagger: .09, ease: 'back.out(3)' }, t + .4);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5);
      tl.set({}, {}, t + 5.5);
      sc.tl = tl;
      tl.progress(0).pause();
      controls(sc, [{ t: 'Wireframe', at: 'wire' }, { t: 'Design', at: 'design' }, { t: 'Review', at: 'review' }, { t: 'Build', at: 'build' }, { t: 'Live', at: 'live' }]);
    }

    /* ---------------- PHONE ---------------- */
    function buildPhone(sc){
      var mm = sc.M.mock.mobile, P = sc.portrait, st = sc.stg, PW = 316, PH = 660, px = P ? (640 - PW) / 2 : 250, py = P ? 20 : 45;
      var fg = mm.statusFg || '#fff';
      st.innerHTML = '<div class="pn-bg"></div>' +
        '<div class="ph" style="left:' + px + 'px;top:' + py + 'px;width:' + PW + 'px;height:' + PH + 'px"><i class="ph-btn b1"></i><i class="ph-btn b2"></i><i class="ph-btn b3"></i><i class="ph-btn b4"></i>' +
          '<div class="ph-scr" style="background:' + mm.bg + '"><div class="ph-view">' + mm.html + '</div>' + (mm.nav || '') + '<div class="ph-menu">' + (mm.menu || '') + '</div>' +
          '<div class="ph-status" style="color:' + fg + ';background:' + mm.bg + '"><b>9:41</b><span><svg viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx=".6"/><rect x="5" y="5" width="3" height="6" rx=".6"/><rect x="10" y="2.5" width="3" height="8.5" rx=".6"/><rect x="15" y="0" width="3" height="11" rx=".6"/></svg><svg viewBox="0 0 16 11"><path d="M8 10.5L5.6 8a3.4 3.4 0 014.8 0zM3.4 5.8a6.5 6.5 0 019.2 0l-1.5 1.5a4.4 4.4 0 00-6.2 0zM1 3.4a9.9 9.9 0 0114 0l-1.5 1.5a7.8 7.8 0 00-11 0z"/></svg><svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="8" rx="1.6"/><rect x="23.5" y="4" width="1.8" height="4" rx=".8" opacity=".5"/></svg></span></div>' +
          '<div class="ph-isl"></div><div class="ph-home" style="background:' + fg + '"></div><span class="ph-tap"></span></div></div>' +
        (P ? '<div class="pn-cap"><span class="n"></span><div><b></b><p></p></div></div>'
           : '<svg class="pn-lead" viewBox="0 0 1200 750" aria-hidden="true"><path d=""/><circle r="5"/></svg><div class="pn-notes"><div class="pn-h">Mobile decisions</div>' + mm.notes.map(function(n, i){ return '<div class="pn-n" data-i="' + i + '"><span class="n">' + ('0' + (i + 1)).slice(-2) + '</span><div><b>' + esc(n.t) + '</b><p>' + esc(n.d) + '</p></div></div>'; }).join('') + '</div>');

      var ph = q(st, '.ph'), scr = q(st, '.ph-scr'), view = q(st, '.ph-view'), tap = q(st, '.ph-tap'), notes = qa(st, '.pn-n'), lead = q(st, '.pn-lead'), cap = q(st, '.pn-cap');
      var screenH = PH - 20, maxS = Math.max(0, view.scrollHeight - screenH), cur = 0;
      function offs(n){ var x = 0, y = 0, inView = false; while (n && n !== scr){ if (n === view) inView = true; x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x: x, y: y, inView: inView }; }
      function langSwap(es){ qa(scr, '[data-es]').forEach(function(n){ if (!n.hasAttribute('data-en')) n.setAttribute('data-en', n.textContent); n.textContent = es ? n.getAttribute('data-es') : n.getAttribute('data-en'); }); }
      function note(i){
        if (P){ var n = mm.notes[i]; cap.classList.toggle('on', !!n); if (n){ q(cap, '.n').textContent = ('0' + (i + 1)).slice(-2); q(cap, 'b').textContent = n.t; q(cap, 'p').textContent = n.d; } return; }
        notes.forEach(function(el, k){ el.classList.toggle('on', k === i); });
        var el = notes[i]; lead.classList.toggle('on', !!el); if (!el) return;
        var ny = el.offsetTop + el.parentNode.offsetTop + el.offsetHeight / 2, nx = el.parentNode.offsetLeft - 10, sx = px + PW + 10;
        q(lead, 'path').setAttribute('d', 'M' + sx + ' ' + ny + 'H' + nx); var c = q(lead, 'circle'); c.setAttribute('cx', sx); c.setAttribute('cy', ny);
      }
      function reset(){ ph.className = 'ph'; langSwap(false); note(-1); }
      var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .4 }), t = 0;
      tl.call(reset, null, .01); tl.set(view, { y: 0 }, 0); tl.set(tap, { autoAlpha: 0 }, 0);
      t = .6;
      mm.steps.forEach(function(s){
        if (s.note != null) tl.call(note, [s.note], t);
        if (s.scroll != null){
          var target = s.scroll === 0 ? 0 : Math.min(maxS, Math.max(0, offs(q(view, s.scroll)).y - (s.off || 110)));
          tl.to(view, { y: -target, duration: .95, ease: 'power2.inOut' }, t); cur = target; t += 1;
        }
        if (s.tap){
          var n = q(scr, s.tap);
          if (n){ var o = offs(n); var tx = o.x + n.offsetWidth / 2, ty = o.y + n.offsetHeight / 2 - (o.inView ? cur : 0);
            tl.set(tap, { x: tx, y: ty }, t);
            tl.fromTo(tap, { scale: .3, autoAlpha: .95 }, { scale: 1.5, autoAlpha: 0, duration: .6, ease: 'power2.out', immediateRender: false }, t);
            t += .15; }
          tl.call(function(s){ if (s.toggle){ ph.classList.toggle(s.toggle); if (s.toggle === 'es') langSwap(ph.classList.contains('es')); } if (s.add) ph.classList.add(s.add); if (s.remove) ph.classList.remove(s.remove); }, [s], t);
          t += .4;
        } else if (s.add || s.remove){ tl.call(function(s){ if (s.add) ph.classList.add(s.add); if (s.remove) ph.classList.remove(s.remove); }, [s], t); }
        t += s.hold == null ? .8 : s.hold;
      });
      tl.set({}, {}, t);
      sc.tl = tl; sc.restAt = .7;
      tl.progress(0).pause();
      controls(sc, null);
    }


    /* ---------------- SERVICE MAP (FigJam board → designed process) ---------------- */
    var CURSOR = '<svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg>';
    function buildFlow(sc){
      var f = sc.M.mock.flow, P = sc.portrait, st = sc.stg, G = f.groups, nodes = [];
      // layout: landscape = one row of six; portrait = one row per group
      G.forEach(function(g, gi){ g.steps.forEach(function(s, si){
        var n = { g: gi, t: s, i: nodes.length };
        if (P){ n.w = 250; n.h = 92; n.x = 50 + si * 290; n.y = 110 + gi * 158; }
        else { n.w = 150; n.h = 112; n.x = 75 + n.i * 180; n.y = 170; }
        nodes.push(n);
      }); });
      var arrows = '', brackets = '';
      for (var i = 0; i < nodes.length - 1; i++){
        var a = nodes[i], b = nodes[i + 1];
        if (!P || a.g === b.g) arrows += '<path class="fl-ar" d="M' + (a.x + a.w + 6) + ' ' + (a.y + a.h / 2) + 'H' + (b.x - 10) + '"/><path class="fl-ah" d="M' + (b.x - 16) + ' ' + (b.y + b.h / 2 - 5) + 'l6 5-6 5"/>';
        else arrows += '<path class="fl-ar" d="M' + (a.x + a.w / 2) + ' ' + (a.y + a.h + 6) + 'C' + (a.x + a.w / 2) + ' ' + (a.y + a.h + 40) + ' ' + (b.x + b.w / 2) + ' ' + (b.y - 60) + ' ' + (b.x + b.w / 2) + ' ' + (b.y - 34) + '"/><path class="fl-ah" d="M' + (b.x + b.w / 2 - 5) + ' ' + (b.y - 38) + 'l5 6 5-6"/>';
      }
      G.forEach(function(g, gi){
        var ns = nodes.filter(function(n){ return n.g === gi; }), x0 = ns[0].x + 20, x1 = ns[ns.length - 1].x + ns[ns.length - 1].w - 20, below = !P && gi === 1;
        var y = below ? ns[0].y + ns[0].h : ns[0].y, d = below ? 30 : -30;
        brackets += '<path class="fl-br" d="M' + x0 + ' ' + (y + d / 5) + 'V' + (y + d) + 'H' + x1 + 'V' + (y + d / 5) + '"/><text class="fl-bt" x="' + (x0 + x1) / 2 + '" y="' + (y + d + (below ? 28 : -12)) + '" text-anchor="middle">' + esc(g.name.toUpperCase()) + '</text>';
      });
      var panelTop = P ? 590 : 400;
      st.innerHTML = '<div class="fl-board"></div><div class="fl-dark"></div>' +
        '<div class="fl-title"><span>' + ICO.frame + '</span>' + esc(f.file) + '</div>' +
        '<svg class="fl-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '">' + brackets + arrows + '<circle class="fl-pulse" r="6"/></svg>' +
        nodes.map(function(n){ return '<div class="fn" data-g="' + n.g + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.w + 'px;height:' + n.h + 'px"><div class="fn-w"><b>' + esc(n.t) + '</b></div><div class="fn-h"><span>' + ('0' + (n.i + 1)).slice(-2) + '</span><svg viewBox="0 0 60 62">' + G[n.g].solid + '</svg><b>' + esc(n.t) + '</b></div></div>'; }).join('') +
        '<div class="fl-panel" style="top:' + panelTop + 'px"><div class="fl-ico"><svg viewBox="0 0 60 62"></svg></div><div class="fl-txt"><span class="fl-k"></span><h4></h4><ul></ul></div></div>' +
        '<div class="fl-dock">' + TOOLS.slice(0, 5).map(function(t){ return '<i><svg viewBox="0 0 16 16">' + t + '</svg></i>'; }).join('') + '<i class="st"></i><i class="st c2"></i><i class="st c3"></i></div>' +
        '<div class="cur a">' + CURSOR + '<span class="nm">Angelino</span></div><div class="fg-fade"></div>';
      var fns = qa(st, '.fn'), wires = qa(st, '.fn-w'), his = qa(st, '.fn-h'), ars = qa(st, '.fl-ar,.fl-ah'), brs = qa(st, '.fl-br'), bts = qa(st, '.fl-bt'),
        dark = q(st, '.fl-dark'), dock = q(st, '.fl-dock'), panel = q(st, '.fl-panel'), pulse = q(st, '.fl-pulse'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade');
      ars.concat(brs).forEach(function(p){ var L = p.getTotalLength ? p.getTotalLength() : 200; p.style.strokeDasharray = L; p.dataset.len = L; });
      function show(gi){
        fns.forEach(function(n){ n.classList.toggle('on', +n.dataset.g === gi); });
        var g = G[gi]; if (!g){ return; }
        q(panel, '.fl-k').textContent = ('0' + (gi + 1)).slice(-2) + ' · ' + g.steps.join(' → ');
        q(panel, 'h4').textContent = g.name; q(panel, 'ul').innerHTML = g.copy.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('');
        q(panel, '.fl-ico svg').innerHTML = g.solid;
      }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ show(-1); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('map', 0); at(.01, reset);
      tl.set(st, { '--ink': '#1e1e1e', '--line': '#1e1e1e' }, 0).set(dark, { opacity: 0 }, 0).set(fns, { scale: 0, opacity: 0 }, 0).set(wires, { opacity: 1 }, 0).set(his, { opacity: 0 }, 0)
        .set(ars.concat(brs), { strokeDashoffset: function(i, el){ return el.dataset.len; } }, 0).set(bts, { opacity: 0 }, 0).set(dock, { autoAlpha: 1, y: 0 }, 0)
        .set(panel, { autoAlpha: 0, y: 20 }, 0).set(pulse, { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0).set(curA, { x: sc.SW * .5, y: sc.SH * .85 }, 0).set(q(curA, '.nm'), { autoAlpha: 1 }, 0);
      // 01 map: stickies go down, arrows and brackets are drawn
      var t = .4;
      nodes.forEach(function(n, i){
        tl.to(curA, { x: n.x + n.w * .6, y: n.y + n.h * .6, duration: .35, ease: 'power2.inOut' }, t);
        tl.to(fns[i], { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2.2)' }, t + .3);
        t += .45;
      });
      tl.to(ars, { strokeDashoffset: 0, duration: .5, stagger: .06, ease: 'power2.out' }, t);
      tl.to(brs, { strokeDashoffset: 0, duration: .6, stagger: .15 }, t + .5);
      tl.to(bts, { opacity: 1, duration: .3, stagger: .15 }, t + .8);
      t += 2;
      // 02 design: the board becomes the 5 TEN process section
      tl.addLabel('design', t);
      tl.to(dock, { autoAlpha: 0, y: 30, duration: .4 }, t);
      tl.to(dark, { opacity: 1, duration: .8, ease: 'power2.inOut' }, t);
      tl.to(st, { '--ink': f.fg, '--line': f.accent, duration: .8 }, t);
      tl.to(his, { opacity: 1, duration: .5, stagger: .08 }, t + .3);
      tl.to(wires, { opacity: 0, duration: .5, stagger: .08 }, t + .3);
      var pts = nodes.map(function(n){ return { x: n.x + n.w / 2, y: n.y + n.h / 2 }; });
      function pulseRun(t0){ tl.set(pulse, { attr: { cx: pts[0].x, cy: pts[0].y }, autoAlpha: 1 }, t0); pts.slice(1).forEach(function(p, k){ tl.to(pulse, { attr: { cx: p.x, cy: p.y }, duration: .32, ease: 'none' }, t0 + k * .32); }); tl.to(pulse, { autoAlpha: 0, duration: .2 }, t0 + (pts.length - 1) * .32); }
      pulseRun(t + 1.2);
      t += 3.2;
      // 03 each stage opens its detail
      G.forEach(function(g, gi){
        var n = nodes.filter(function(n){ return n.g === gi; })[0];
        tl.addLabel('g' + gi, t);
        tl.to(curA, { x: n.x + n.w * .5, y: n.y + n.h * .7, duration: .6, ease: 'power2.inOut' }, t);
        at(t + .6, function(){ show(gi); });
        tl.fromTo(panel, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out', immediateRender: false }, t + .6);
        tl.to(panel, { autoAlpha: 0, y: -10, duration: .3 }, t + 3.6);
        t += 3.9;
      });
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t);
      tl.set({}, {}, t + .5);
      sc.tl = tl; sc.restAt = t - 3.9 + 1.2; tl.progress(0).pause();
      controls(sc, [{ t: 'Map', at: 'map' }, { t: 'Design', at: 'design' }].concat(G.map(function(g, i){ return { t: g.name, at: 'g' + i }; })));
    }

    /* ---------------- GLOBE RENDER (exploded layers) ---------------- */
    function buildExplode(sc){
      var e = sc.M.mock.explode, P = sc.portrait, st = sc.stg, IW = 1600, IH = 955;
      var PW = P ? 600 : 900, PH = PW * IH / IW, X = P ? 20 : 270, Y = P ? 150 : (750 - PH) / 2;
      function px(p){ return p[0] / IW * 100 + '%'; } function py(p){ return p[1] / IH * 100 + '%'; }
      var L = [
        { k: 'Background', d: 'Section · ' + e.bg, html: '<div class="ex-bg" style="background:radial-gradient(60% 70% at 55% 45%,#262a33,' + e.bg + ' 70%)"></div>' },
        { k: 'Globe mesh', d: 'Three.js points on a sphere', html: '<img src="' + e.img + '" alt="" style="position:absolute;inset:0;width:100%;height:100%">' },
        { k: 'Project pins', d: 'Projects CMS · lat / lng', html: e.pins.map(function(p){ return '<span class="ex-pin" style="left:' + px(p) + ';top:' + py(p) + '"></span>'; }).join('') },
        { k: 'Arcs + leaders', d: 'HQ links and label lines', html: '<svg viewBox="0 0 ' + IW + ' ' + IH + '" preserveAspectRatio="none">' + e.arcs.map(function(a){ return '<path d="' + a + '"/>'; }).join('') + e.leaders.map(function(a){ return '<path class="ld" d="' + a + '"/>'; }).join('') + '</svg><span class="ex-hq" style="left:' + px(e.hq) + ';top:' + py(e.hq) + '">5 TEN HQ</span>' },
        { k: 'Preview card', d: 'Hover UI from the same CMS item', html: '<div class="ex-card" style="left:' + px(e.card.at) + ';top:' + py(e.card.at) + '"><div class="im" style="background-image:url(' + e.card.img + ')"></div><b>' + esc(e.card.title) + '</b><span>' + esc(e.card.city) + '</span><em>View project →</em></div><span class="ex-cue">Drag to explore · click a pin</span>' }
      ];
      st.innerHTML = '<div class="ex-sc"><div class="ex-rig" style="left:' + X + 'px;top:' + Y + 'px;width:' + PW + 'px;height:' + PH + 'px">' +
        L.map(function(l, i){ return '<div class="ex-l l' + i + '">' + l.html + '<span class="ex-tag"><b>L' + i + '</b> ' + esc(l.k) + '</span></div>'; }).join('') + '</div></div>' +
        '<div class="ex-hud"><div class="ex-h">Layers · ' + esc(e.frame) + '</div>' + L.slice().reverse().map(function(l, r){ var i = L.length - 1 - r; return '<div class="ex-row" data-i="' + i + '"><span>L' + i + '</span><div><b>' + esc(l.k) + '</b><em>' + esc(l.d) + '</em></div></div>'; }).join('') + '</div>' +
        '<div class="cur a">' + CURSOR + '</div><div class="fg-fade"></div>';
      var rig = q(st, '.ex-rig'), ls = qa(st, '.ex-l'), tags = qa(st, '.ex-tag'), rows = qa(st, '.ex-row'), card = q(st, '.ex-card'), cue = q(st, '.ex-cue'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade'), pins = qa(st, '.ex-pin');
      function hl(i){ rows.forEach(function(r){ r.classList.toggle('on', +r.dataset.i === i); }); }
      var gap = P ? 70 : 105;
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      sc.onSeek = function(){ var now = tl.time(); hl(-1); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('comp', 0); at(.01, function(){ hl(-1); });
      tl.set(rig, { rotationX: 0, rotationZ: 0, scale: 1, x: 0, y: 0 }, 0).set(ls, { z: 0, opacity: 1 }, 0).set(tags, { autoAlpha: 0 }, 0).set(card, { autoAlpha: 0, scale: .9 }, 0).set(cue, { autoAlpha: 1 }, 0)
        .set(fade, { autoAlpha: 0 }, 0).set(curA, { x: sc.SW * .85, y: sc.SH * .9, autoAlpha: 0 }, 0).set(pins, { scale: 1 }, 0);
      tl.fromTo(pins, { scale: 0 }, { scale: 1, duration: .4, stagger: .06, ease: 'back.out(3)', immediateRender: false }, .3);
      var t = 1.8;
      tl.addLabel('explode', t);
      tl.to(cue, { autoAlpha: 0, duration: .3 }, t);
      tl.to(card, { autoAlpha: 1, scale: 1, duration: .4 }, t);
      tl.to(rig, { rotationX: P ? 50 : 54, rotationZ: -26, scale: P ? .7 : .62, x: P ? 0 : -30, y: P ? 40 : -55, duration: 1.6, ease: 'power3.inOut' }, t);
      tl.to(ls, { z: function(i){ return (i - 2) * gap; }, duration: 1.6, ease: 'power3.inOut' }, t);
      tl.to(tags, { autoAlpha: 1, duration: .4, stagger: .08 }, t + 1.2);
      t += 2.2;
      tl.addLabel('layers', t);
      for (var i = 1; i < L.length; i++){ (function(i){
        at(t, function(){ hl(i); });
        tl.to(ls.filter(function(l, k){ return k !== i && k !== 0; }), { opacity: .22, duration: .35 }, t);
        tl.to(ls[i], { opacity: 1, z: (i - 2) * gap + 40, duration: .35 }, t);
        tl.to(ls[i], { z: (i - 2) * gap, duration: .35 }, t + 1.2);
        t += 1.5;
      })(i); }
      at(t, function(){ hl(-1); });
      tl.to(ls, { opacity: 1, duration: .3 }, t);
      tl.to(tags, { autoAlpha: 0, duration: .3 }, t + .2);
      tl.to(card, { autoAlpha: 0, duration: .3 }, t + .2);
      tl.to(rig, { rotationX: 0, rotationZ: 0, scale: 1, x: 0, y: 0, duration: 1.4, ease: 'power3.inOut' }, t + .3);
      tl.to(ls, { z: 0, duration: 1.4, ease: 'power3.inOut' }, t + .3);
      t += 1.9;
      tl.addLabel('live', t);
      var pin = e.pins[e.card.pin], cx = X + pin[0] / IW * PW, cy = Y + pin[1] / IH * PH;
      tl.set(curA, { autoAlpha: 1 }, t);
      tl.to(curA, { x: cx, y: cy, duration: 1, ease: 'power2.inOut' }, t);
      tl.fromTo(card, { autoAlpha: 0, scale: .85 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + 1);
      tl.to(pins[e.card.pin], { scale: 1.8, duration: .3 }, t + 1);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 3.8);
      tl.set({}, {}, t + 4.3);
      sc.tl = tl; sc.restAt = 3.6; tl.progress(0).pause();
      controls(sc, [{ t: 'Composite', at: 'comp' }, { t: 'Explode', at: 'explode' }, { t: 'Layers', at: 'layers' }, { t: 'Live', at: 'live' }]);
    }


    /* ---------------- CMS → PIN (Webflow Editor adds a case, the map updates) ---------------- */
    function buildCms(sc){
      var c = sc.M.mock.cms, P = sc.portrait, st = sc.stg;
      var ed = P ? { l: 0, t: 0, w: 640, h: 370 } : { l: 0, t: 0, w: 440, h: 750 }, pv = P ? { l: 0, t: 370, w: 640, h: 430 } : { l: 440, t: 0, w: 760, h: 750 };
      var mapW = P ? 330 : 430, mapH = mapW * 490 / 740;
      st.innerHTML =
        '<div class="cm-ed" style="left:' + ed.l + 'px;top:' + ed.t + 'px;width:' + ed.w + 'px;height:' + ed.h + 'px">' +
          '<div class="cm-bar"><span class="cm-logo">W</span><span>' + esc(c.site) + '</span><em>CMS</em></div>' +
          '<div class="cm-crumb">Collections › <b>' + esc(c.collection) + '</b> › <span class="cm-new">New item</span></div>' +
          '<div class="cm-fields">' + c.fields.map(function(f, i){ return '<label class="cm-f' + (f.wide ? ' wide' : '') + (f.area ? ' area' : '') + '"><span>' + esc(f.k) + (f.req ? ' <i>*</i>' : '') + '</span><div class="cm-in' + (f.select ? ' dd' : '') + '" data-i="' + i + '"><b></b><u></u></div></label>'; }).join('') + '</div>' +
          '<div class="cm-act"><span class="cm-draft">Save as draft</span><span class="cm-pub">Publish</span></div></div>' +
        '<div class="cm-pv" style="left:' + pv.l + 'px;top:' + pv.t + 'px;width:' + pv.w + 'px;height:' + pv.h + 'px">' +
          '<div class="cm-url"><span class="d"></span><span class="d"></span><span class="d"></span><span class="u">' + esc(c.url) + '</span></div>' +
          '<div class="cm-home"><div class="ch-nav"><b>' + esc(c.site) + '</b><span class="lk">' + c.nav.map(function(n){ return '<span>' + esc(n) + '</span>'; }).join('') + '</span><span class="r"><em>EN | ES</em><i>Free consultation</i></span></div>' +
          '<div class="ch-grid"><div class="ch-l"><div class="ch-eye"><i></i>' + esc(c.eyebrow) + '</div><h3>' + esc(c.title) + '</h3><p>' + esc(c.body) + '</p><span class="ch-btn">' + esc(c.cta) + '</span>' +
            '<div class="ch-stats">' + c.stats.map(function(s, i){ return '<div><b data-s="' + i + '" style="color:' + (s.c || '#1a2840') + '">' + s.v + '</b><span>' + esc(s.k) + '</span></div>'; }).join('') + '</div></div>' +
            '<div class="ch-r"><div class="cm-map" style="width:' + mapW + 'px;height:' + mapH + 'px">' +
              '<span class="cm-newpin" style="left:' + c.pin[0] + '%;top:' + c.pin[1] + '%"><i></i></span>' +
              '<div class="cm-card" style="left:' + c.pin[0] + '%;top:' + c.pin[1] + '%"><span>' + esc(c.cardKicker) + '</span><b>' + esc(c.cardTitle) + '</b><em>' + esc(c.cardMeta) + '</em></div></div>' +
            '<div class="ch-chips"><span class="cm-badge">All cases · <b>' + c.stats[0].v + '</b></span>' + c.chips.map(function(x){ return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div></div></div></div>' +
        '<div class="cur a">' + CURSOR + '<span class="nm">Firm staff</span></div><div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';
      var ins = qa(st, '.cm-in'), vals = qa(st, '.cm-in b'), pub = q(st, '.cm-pub'), newTag = q(st, '.cm-new'), pin = q(st, '.cm-newpin'), card = q(st, '.cm-card'), toast = q(st, '.fg-toast'), fade = q(st, '.fg-fade'), curA = q(st, '.cur.a'),
        statEls = qa(st, '[data-s]'), badge = q(st, '.cm-badge b');
      function center(el){ var r = 0, t = 0, n = el; while (n && n !== st){ r += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; } return { x: r + el.offsetWidth * .5, y: t + el.offsetHeight * .6 }; }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ ins.forEach(function(n){ n.classList.remove('focus', 'done'); }); pub.classList.remove('hit'); newTag.textContent = 'New item'; q(toast, 'span').textContent = ''; toast.classList.remove('ok'); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('add', 0); at(.01, reset);
      tl.set(vals, { textContent: '' }, 0).set([pin, card, toast, fade], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(curA, { x: ed.w * .7, y: ed.t + 60 }, 0);
      c.stats.forEach(function(s, i){ tl.set(statEls[i], { textContent: s.v }, 0); }); tl.set(badge, { textContent: c.stats[0].v }, 0);
      var t = .5;
      tl.addLabel('fill', t);
      c.fields.forEach(function(f, i){
        var p = center(ins[i]), o = { n: 0 };
        tl.to(curA, { x: p.x, y: p.y, duration: .45, ease: 'power2.inOut' }, t);
        at(t + .4, function(){ ins.forEach(function(n, k){ n.classList.toggle('focus', k === i); if (k < i) n.classList.add('done'); }); });
        var dur = f.select ? .01 : Math.min(1.1, .04 * f.v.length + .2);
        tl.fromTo(o, { n: 0 }, { n: f.v.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function(){ vals[i].textContent = f.v.slice(0, Math.round(o.n)); } }, t + .5 + (f.select ? .3 : 0));
        if (i === 0) at(t + .5 + dur, function(){ newTag.textContent = f.v; });
        t += .6 + dur + (f.select ? .4 : .15);
      });
      at(t, function(){ ins.forEach(function(n){ n.classList.remove('focus'); n.classList.add('done'); }); });
      tl.addLabel('publish', t + .2);
      var pp = center(pub);
      tl.to(curA, { x: pp.x, y: pp.y, duration: .6, ease: 'power2.inOut' }, t + .2);
      at(t + .85, function(){ pub.classList.add('hit'); q(toast, 'span').textContent = 'Publishing to ' + c.url + '…'; toast.classList.remove('ok'); });
      tl.to(toast, { autoAlpha: 1, duration: .25 }, t + .85);
      at(t + 2, function(){ q(toast, 'span').textContent = 'Published · 1 item live'; toast.classList.add('ok'); });
      t += 2.3;
      tl.addLabel('live', t);
      tl.fromTo(pin, { autoAlpha: 0, y: -60, scale: .4 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'bounce.out', immediateRender: false }, t);
      c.stats.forEach(function(s, i){ if (s.to == null) return; var o = { v: parseFloat(s.v) }; tl.fromTo(o, { v: parseFloat(s.v) }, { v: parseFloat(s.to), duration: .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ statEls[i].textContent = Math.round(o.v) + (/%/.test(s.v) ? '%' : ''); if (i === 0) badge.textContent = Math.round(o.v); } }, t + .6); });
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 1.2);
      var mp = q(st, '.cm-map'), mpo = center(mp), pinPt = { x: mpo.x - mp.offsetWidth * .5 + mp.offsetWidth * c.pin[0] / 100, y: mpo.y - mp.offsetHeight * .6 + mp.offsetHeight * c.pin[1] / 100 };
      tl.to(curA, { x: pinPt.x + 4, y: pinPt.y + 4, duration: .8, ease: 'power2.inOut' }, t + 1.1);
      tl.fromTo(card, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + 1.9);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5);
      tl.set({}, {}, t + 5.5);
      sc.tl = tl; sc.restAt = t + 2.5; tl.progress(0).pause();
      controls(sc, [{ t: 'New item', at: 'add' }, { t: 'Fill', at: 'fill' }, { t: 'Publish', at: 'publish' }, { t: 'Live', at: 'live' }]);
    }

    /* ---------------- SKETCHES (AB Identity · pen + paper iterations) ---------------- */
    var PENCIL = '<svg viewBox="0 0 40 40"><path d="M6 34l4-12L28 4l8 8-18 18z" fill="#f2c14e" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 34l4-12 8 8z" fill="#ead7b5" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 34l2-6 4 4z" fill="#2b2b2b"/><path d="M24 8l8 8" stroke="#2b2b2b" stroke-width="1.5"/></svg>';
    var SK_A = 'M28 122L58 28L88 122M40 88H76', SK_B = 'M108 28V122M108 28H138C168 28 168 72 138 74H108M138 74C176 76 176 122 138 122H108';
    var SKETCHES = [
      { v: 'v01', note: 'too plain', no: true, d: [SK_A, SK_B] },
      { v: 'v04', note: 'orbit = cliché?', no: true, d: [SK_A, SK_B, 'M14 104C30 50 172 18 188 44C200 66 140 112 36 116C18 117 12 110 14 104'] },
      { v: 'v09', note: 'planet floats, disconnected', no: true, d: ['M20 110L38 50L56 110M28 88H48', 'M100 42C120 42 132 58 132 76S118 108 100 108 68 94 68 76 80 42 100 42', 'M58 92C80 70 150 48 146 60S104 96 62 98', 'M150 50V110M150 50H166C184 50 184 78 166 80H150M166 80C188 82 188 110 166 110H150'] },
      { v: 'v13', note: 'planet as the A. closer!', d: ['M40 126L84 24L128 126', 'M84 52C100 52 110 64 110 78S100 104 84 104 58 92 58 78 68 52 84 52', 'M34 100C60 84 150 56 154 66S116 96 48 104', 'M140 60V126M140 60H156C172 60 172 90 156 92H140M156 92C176 94 176 126 156 126H140'] },
      { v: 'v19', note: 'ring through both letters', d: ['M22 124L56 28L90 124', 'M108 28V124M108 28H138C166 28 166 72 138 74H108M138 74C174 76 174 124 138 124H108', 'M96 50C110 50 122 62 122 76S110 102 96 102 70 90 70 76 82 50 96 50', 'M40 108C70 88 170 50 176 60S130 96 50 112'] },
      { v: 'v25', note: 'this one ✓', win: true, mark: true }
    ];
    function buildSketch(sc){
      var P = sc.portrait, st = sc.stg, M = AB.MARK, fid = 'skr-' + sc.id;
      var cols = P ? 2 : 3, cw = P ? 250 : 320, ch = P ? 188 : 240, gx = P ? 20 : 34, gy = P ? 46 : 58, x0 = P ? 60 : 72, y0 = P ? 118 : 128, k = cw / 200;
      var cells = SKETCHES.map(function(s, i){ return { s: s, x: x0 + (i % cols) * (cw + gx), y: y0 + Math.floor(i / cols) * (ch + gy) }; });
      st.innerHTML = '<div class="sk-paper"></div><svg class="sk-defs" width="0" height="0" aria-hidden="true"><filter id="' + fid + '"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter></svg>' +
        '<div class="sk-title">AB mark · explorations</div><div class="sk-count">iterations: <b>1</b></div>' +
        cells.map(function(c, i){
          // stroke widths in user units (non-scaling-stroke broke the dash-draw inside the scaled cells)
          var sw = 'stroke-width:' + (2.2 / k).toFixed(2), swm = 'stroke-width:' + (2.2 / (k * .367)).toFixed(2);
          var s = c.s, inner = s.mark ? '<g transform="translate(10 30) scale(.367)"><path class="sk-l" style="' + swm + '" d="' + M.a + '"/><path class="sk-l" style="' + swm + '" d="' + M.planet + '"/><path class="sk-l" style="' + swm + '" d="' + M.b + '"/></g>' :
            s.d.map(function(d){ return '<path class="sk-l" style="' + sw + '" d="' + d + '"/>'; }).join('');
          return '<div class="sk-cell" data-i="' + i + '" style="left:' + c.x + 'px;top:' + c.y + 'px;width:' + cw + 'px;height:' + ch + 'px">' +
            '<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet"><g filter="url(#' + fid + ')">' + inner +
            (s.no ? '<path class="sk-x" style="stroke-width:' + (3.2 / k).toFixed(2) + '" d="M16 16L184 134M184 16L16 134"/>' : '') + '</g></svg>' +
            '<span class="sk-v">' + s.v + '</span><span class="sk-note">' + esc(s.note) + '</span></div>';
        }).join('') +
        '<svg class="sk-hi" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"><path class="sk-ring" filter="url(#' + fid + ')" d=""/></svg>' +
        '<div class="sk-pen">' + PENCIL + '</div><div class="fg-fade"></div>';
      var pen = q(st, '.sk-pen'), fade = q(st, '.fg-fade'), cnt = q(st, '.sk-count b'), ring = q(st, '.sk-ring'), cellEls = qa(st, '.sk-cell');
      // the orange circle around the winner, drawn around its cell
      var wc = cells[cells.length - 1], rx = cw * .56, ry = ch * .52, cx = wc.x + cw / 2, cy = wc.y + ch / 2;
      ring.setAttribute('d', 'M' + (cx - rx) + ' ' + (cy + 6) + 'C' + (cx - rx) + ' ' + (cy - ry) + ' ' + (cx + rx) + ' ' + (cy - ry - 8) + ' ' + (cx + rx) + ' ' + cy + 'S' + (cx - rx * .4) + ' ' + (cy + ry + 10) + ' ' + (cx - rx - 6) + ' ' + (cy - 4));
      var lines = [];
      cellEls.forEach(function(el, i){
        var c = cells[i], sk = c.s;
        qa(el, '.sk-l').forEach(function(p){
          var L = (p.getTotalLength ? p.getTotalLength() : 300) + 3; // +3: no round-cap dot while hidden p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
          var sx = sk.mark ? .367 * k : k, ox = c.x + (sk.mark ? 10 * k : 0) + (cw - 200 * k) / 2, oy = c.y + (sk.mark ? 30 * k : 0) + (ch - 150 * k) / 2;
          lines.push({ p: p, L: L, cell: i, map: function(pt){ return { x: ox + pt.x * sx, y: oy + pt.y * sx }; } });
        });
      });
      var xs = qa(st, '.sk-x'); xs.forEach(function(p){ var L = (p.getTotalLength ? p.getTotalLength() : 420) + 4; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.len = L; });
      var RL = (ring.getTotalLength ? ring.getTotalLength() : 1200) + 4; ring.style.strokeDasharray = RL; ring.style.strokeDashoffset = RL;
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function setN(n){ cnt.textContent = n; }
      sc.onSeek = function(){ var now = tl.time(); setN(1); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('sketch', 0); at(.01, function(){ setN(1); });
      tl.set(lines.map(function(l){ return l.p; }), { strokeDashoffset: function(i){ return lines[i].L; } }, 0).set(xs, { strokeDashoffset: function(i, el){ return el.dataset.len; } }, 0)
        .set(ring, { strokeDashoffset: RL }, 0).set(qa(st, '.sk-note,.sk-v'), { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0).set(pen, { autoAlpha: 1, x: sc.SW * .5, y: sc.SH + 40 }, 0);
      var t = .3, NUM = [1, 4, 9, 13, 19, 25];
      cellEls.forEach(function(el, i){
        if (i === 3) tl.addLabel('iterate', t);
        lines.filter(function(l){ return l.cell === i; }).forEach(function(l){
          var d = Math.max(.28, Math.min(.75, l.L / 420)), o = { v: 0 };
          var p0 = l.map(l.p.getPointAtLength ? l.p.getPointAtLength(0) : { x: 0, y: 0 });
          tl.to(pen, { x: p0.x - 6, y: p0.y - 34, duration: .2, ease: 'power2.inOut' }, t);
          tl.to(l.p, { strokeDashoffset: 0, duration: d, ease: 'none' }, t + .2);
          tl.fromTo(o, { v: 0 }, { v: 1, duration: d, ease: 'none', immediateRender: false, onUpdate: function(){ if (!l.p.getPointAtLength) return; var pt = l.map(l.p.getPointAtLength(o.v * l.L)); gsap.set(pen, { x: pt.x - 6, y: pt.y - 34 }); } }, t + .2);
          t += d + .22;
        });
        (function(n){ at(t, function(){ setN(n); }); })(NUM[i]);
        tl.to(qa(el, '.sk-v,.sk-note'), { autoAlpha: 1, duration: .3 }, t);
        t += .25;
      });
      // pick: cross out the rejects, circle the winner
      tl.addLabel('pick', t);
      tl.to(pen, { autoAlpha: 0, duration: .3 }, t);
      tl.to(xs, { strokeDashoffset: 0, duration: .45, stagger: .25, ease: 'power2.in' }, t + .2);
      tl.to(ring, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, t + 1.2);
      at(t + 2.3, function(){ cellEls[cellEls.length - 1].classList.add('is-win'); });
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5.2);
      tl.set({}, {}, t + 5.7);
      sc.tl = tl; sc.restAt = t + 3; tl.progress(0).pause();
      controls(sc, [{ t: 'Sketch', at: 'sketch' }, { t: 'Iterate', at: 'iterate' }, { t: 'Pick', at: 'pick' }]);
    }

    /* ---------------- ILLUSTRATOR (AB Identity · trace, pathfinder, color, export) ---------------- */
    var PEN_NIB = '<svg viewBox="0 0 24 24"><path d="M3 21l3-9 9-9 6 6-9 9z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9.5" cy="14.5" r="1.6" fill="#111"/><path d="M3 21l5.5-5.5" stroke="#111" stroke-width="1.2"/></svg>';
    var AI_TOOLS = ['<path d="M5 3l12 7-5 1.5L9 17z"/>', '<path d="M5 3l12 7-5 1.5L9 17z" fill="none"/>', '<path d="M4 20l3-9 9-9 5 5-9 9z"/>', '<path d="M4 16c4-10 12-10 16 0"/>', '<path d="M5 5h14M12 5v14"/>', '<rect x="4" y="5" width="16" height="14"/>', '<ellipse cx="12" cy="12" rx="8" ry="6"/>', '<path d="M4 18L20 6M9 6h11v11"/>', '<circle cx="9" cy="10" r="5"/><circle cx="15" cy="14" r="5"/>'];
    function buildVector(sc){
      var P = sc.portrait, st = sc.stg, M = AB.MARK, SW = sc.SW, SH = sc.SH, fid = 'aiR-' + sc.id;
      var panelW = P ? 0 : 250, cvX = 44, cvW = SW - cvX - panelW, top = 62 + 26;
      var artW = P ? 540 : 700, artH = P ? 330 : 430, artX = cvX + (cvW - artW) / 2, artY = P ? 250 : top + 70;
      var s = (artW * (P ? .88 : .8)) / 490.16, mx = artX + (artW - 490.16 * s) / 2, my = artY + (artH - 241.75 * s) / 2;
      var names = ['A stroke', 'Planet + ring', 'B'], keys = ['a', 'planet', 'b'];
      st.innerHTML = '<div class="ai-bar"><b>Ai</b><span>File</span><span>Edit</span><span>Object</span><span>Type</span><span>Select</span><span>Effect</span><span>View</span><span>Window</span></div>' +
        '<div class="ai-ctl"><span class="ai-ctl-k">Path</span><span>Stroke <i>1 pt</i></span><span>Opacity <i>100%</i></span><span class="ai-mode">Pen tool</span></div>' +
        '<div class="ai-tools">' + AI_TOOLS.map(function(p, i){ return '<i class="ai-t' + (i === 2 ? ' pen' : i === 0 ? ' sel' : '') + '"><svg viewBox="0 0 24 24">' + p + '</svg></i>'; }).join('') + '<i class="ai-fs"><b class="f"></b><b class="s"></b></i></div>' +
        '<div class="ai-canvas" style="left:' + cvX + 'px;top:' + top + 'px;width:' + cvW + 'px"><div class="ai-doc">ab-logo.ai @ 100% (RGB/Preview)</div></div>' +
        '<div class="ai-art" style="left:' + artX + 'px;top:' + artY + 'px;width:' + artW + 'px;height:' + artH + 'px"><span>ab-logo</span></div>' +
        (P ? '' : '<div class="ai-panels"><div class="ai-p"><div class="ai-ph">Layers</div>' + names.slice().reverse().map(function(n){ return '<div class="ai-l"><i></i><b></b>' + n + '</div>'; }).join('') + '<div class="ai-l is-tpl"><i></i><b></b>Sketch v25 (template)</div></div>' +
          '<div class="ai-p"><div class="ai-ph">Pathfinder</div><div class="ai-pf"><i></i><i class="minus"></i><i></i><i></i></div></div>' +
          '<div class="ai-p"><div class="ai-ph">Swatches · tokens</div><div class="ai-sw"><i style="background:#07080D"></i><i style="background:#0E1020"></i><i style="background:#161A2E"></i><i class="star" style="background:#F2F0EA"></i><i style="background:#FF6A3D"></i><i style="background:#4C8DFF"></i></div></div></div>') +
        '<svg class="ai-svg" viewBox="0 0 ' + SW + ' ' + SH + '" aria-hidden="true"><defs><filter id="' + fid + '"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter></defs>' +
        '<g transform="translate(' + mx + ' ' + my + ') scale(' + s + ')"><g class="ai-tpl" filter="url(#' + fid + ')">' + keys.map(function(k){ return '<path d="' + M[k] + '"/>'; }).join('') + '</g>' +
        '<g class="ai-mark">' + keys.map(function(k){ return '<path class="ai-p-' + k + '" d="' + M[k] + '"/>'; }).join('') + '</g></g>' +
        '<g class="ai-anch"></g><rect class="ai-bbox" x="' + (mx - 6) + '" y="' + (my - 6) + '" width="' + (490.16 * s + 12) + '" height="' + (241.75 * s + 12) + '"/></svg>' +
        '<div class="ai-dlg"><div class="ai-dlg-h">Export for Screens</div><div class="ai-dlg-r"><span>ab-logo.svg</span><em>SVG · 5.4 KB</em></div><div class="ai-dlg-r"><span>favicon-32.png</span><em>PNG · 32 px</em></div><div class="ai-dlg-b"><b>Export Artboard</b></div></div>' +
        '<div class="ai-toast">Exported ✓</div>' +
        '<div class="ai-pen">' + PEN_NIB + '</div><div class="cur a">' + CURSOR + '</div><div class="fg-fade"></div>';
      var svg = q(st, '.ai-svg'), anch = q(st, '.ai-anch'), paths = qa(st, '.ai-mark path'), tpl = q(st, '.ai-tpl'), bbox = q(st, '.ai-bbox'), art = q(st, '.ai-art');
      var pen = q(st, '.ai-pen'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade'), dlg = q(st, '.ai-dlg'), toast = q(st, '.ai-toast'), mode = q(st, '.ai-mode');
      var layers = qa(st, '.ai-l'), minus = q(st, '.ai-pf .minus'), star = q(st, '.ai-sw .star'), dlgBtn = q(st, '.ai-dlg-b b');
      function toStage(pt){ return { x: mx + pt.x * s, y: my + pt.y * s }; }
      // anchor points + a few bezier handles along each path
      var PATHS = paths.map(function(p, i){
        var L = p.getTotalLength ? p.getTotalLength() : 800, n = i === 1 ? 16 : 10, pts = [];
        for (var j = 0; j <= n; j++){ var a = p.getPointAtLength ? p.getPointAtLength(L * j / n) : { x: 0, y: 0 }; pts.push(toStage(a)); }
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'ai-an'); anch.appendChild(g);
        g.innerHTML = pts.map(function(pt, j){
          var h = '';
          if (i === 1 && j % 4 === 2 && pts[j + 1]){ var dx = pts[j + 1].x - pts[j - 1].x, dy = pts[j + 1].y - pts[j - 1].y, dl = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / dl * 22, uy = dy / dl * 22;
            h = '<g class="ai-h"><path d="M' + (pt.x - ux) + ' ' + (pt.y - uy) + 'L' + (pt.x + ux) + ' ' + (pt.y + uy) + '"/><circle cx="' + (pt.x - ux) + '" cy="' + (pt.y - uy) + '" r="2.6"/><circle cx="' + (pt.x + ux) + '" cy="' + (pt.y + uy) + '" r="2.6"/></g>'; }
          return '<g class="ai-a" data-j="' + j + '">' + h + '<rect x="' + (pt.x - 3.5) + '" y="' + (pt.y - 3.5) + '" width="7" height="7"/></g>';
        }).join('');
        p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
        return { p: p, L: L, pts: pts, dots: qa(g, '.ai-a') };
      });
      function center(el){ var r = 0, t = 0, n = el; while (n && n !== st){ r += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; } return { x: r + el.offsetWidth * .5, y: t + el.offsetHeight * .55 }; }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ st.classList.remove('is-filled', 'is-color', 'is-sel'); if (minus) minus.classList.remove('hit'); if (star) star.classList.remove('hit'); if (dlgBtn) dlgBtn.classList.remove('hit'); layers.forEach(function(l){ l.classList.remove('on'); }); if (mode) mode.textContent = 'Pen tool'; }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('trace', 0); at(.01, reset);
      tl.set(paths, { strokeDashoffset: function(i){ return PATHS[i].L; }, fillOpacity: 0, strokeOpacity: 1 }, 0).set(qa(anch, '.ai-a'), { autoAlpha: 0 }, 0).set(anch, { autoAlpha: 1 }, 0)
        .set(tpl, { autoAlpha: 0 }, 0).set(bbox, { autoAlpha: 0 }, 0).set([dlg, toast], { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0)
        .set(pen, { autoAlpha: 0 }, 0).set(curA, { autoAlpha: 1, x: SW * .5, y: SH * .9 }, 0);
      tl.to(tpl, { autoAlpha: .45, duration: .6 }, .2);
      if (layers.length) at(.3, function(){ layers[layers.length - 1].classList.add('on'); });
      tl.to(curA, { autoAlpha: 0, duration: .2 }, .6).to(pen, { autoAlpha: 1, duration: .2 }, .6);
      var t = .8;
      PATHS.forEach(function(o, i){
        var d = i === 1 ? 2.6 : 1.5, prog = { v: 0 };
        tl.to(o.p, { strokeDashoffset: 0, duration: d, ease: 'none' }, t);
        tl.fromTo(prog, { v: 0 }, { v: 1, duration: d, ease: 'none', immediateRender: false, onUpdate: function(){ if (!o.p.getPointAtLength) return; var pt = toStage(o.p.getPointAtLength(prog.v * o.L)); gsap.set(pen, { x: pt.x - 3, y: pt.y - 21 }); } }, t);
        tl.fromTo(o.dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .18, stagger: d / o.dots.length, ease: 'back.out(3)', immediateRender: false }, t);
        (function(li){ if (layers[li]) at(t + d, function(){ layers[li].classList.add('on'); }); })(layers.length - 2 - i);
        t += d + .25;
      });
      // pathfinder: select all, Minus Front → solid shapes with real cuts
      tl.addLabel('pathfinder', t);
      tl.to(pen, { autoAlpha: 0, duration: .2 }, t).to(curA, { autoAlpha: 1, duration: .2 }, t);
      at(t + .1, function(){ st.classList.add('is-sel'); if (mode) mode.textContent = 'Selection · 3 paths'; });
      tl.to(bbox, { autoAlpha: 1, duration: .25 }, t + .1);
      if (minus){ var mp = center(minus); tl.to(curA, { x: mp.x, y: mp.y, duration: .7, ease: 'power2.inOut' }, t + .3); at(t + 1.05, function(){ minus.classList.add('hit'); }); }
      tl.to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: .6, stagger: .12 }, t + 1.15);
      tl.to(anch, { autoAlpha: 0, duration: .4 }, t + 1.3);
      tl.to(tpl, { autoAlpha: 0, duration: .4 }, t + 1.3);
      at(t + 1.15, function(){ st.classList.add('is-filled'); });
      t += 2.2;
      // color: the site's tokens, artboard to Void, mark to Starlight
      tl.addLabel('color', t);
      if (star){ var sp = center(star); tl.to(curA, { x: sp.x, y: sp.y, duration: .7, ease: 'power2.inOut' }, t); }
      at(t + .75, function(){ if (star) star.classList.add('hit'); st.classList.add('is-color'); if (mode) mode.textContent = 'Fill · Starlight #F2F0EA'; });
      tl.to(bbox, { autoAlpha: 0, duration: .3 }, t + 1.6);
      t += 2.2;
      // export
      tl.addLabel('export', t);
      tl.fromTo(dlg, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .35, ease: 'power3.out', immediateRender: false }, t);
      if (dlgBtn){ var bp = center(dlgBtn); tl.to(curA, { x: bp.x, y: bp.y, duration: .7, ease: 'power2.inOut' }, t + .5); at(t + 1.25, function(){ dlgBtn.classList.add('hit'); }); }
      tl.to(dlg, { autoAlpha: 0, duration: .3 }, t + 1.5);
      tl.fromTo(toast, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + 1.6);
      tl.to(curA, { autoAlpha: 0, duration: .3 }, t + 2);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 4.4);
      tl.set({}, {}, t + 4.9);
      sc.tl = tl; sc.restAt = t - .5; tl.progress(0).pause();
      controls(sc, [{ t: 'Trace', at: 'trace' }, { t: 'Pathfinder', at: 'pathfinder' }, { t: 'Color', at: 'color' }, { t: 'Export', at: 'export' }]);
    }

    // other scene files (21-knowledge.js) register builders here and share the helpers
    function add(kind, fn){ EXT[kind] = fn; }
    return { mount: mount, activate: activate, add: add, get: function(id){ return scenes[id]; },
      kit: { mk: mk, q: q, qa: qa, esc: esc, controls: controls, CURSOR: CURSOR, reduce: reduce } };
  })();

