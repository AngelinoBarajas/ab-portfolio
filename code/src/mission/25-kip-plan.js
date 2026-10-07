  /* =========================================================
     KIP · SITE PLAN (channel kip-plan)
     The plan behind kipvillage.com, drawn as a blueprint: the cutaway house goes down in chalk lines, then the cursor
     visits each room, the room fills with its feature color and its card types in with the real 3D cast (the site's
     own portraits, vendor/kip/cast/), lit with its room on hover. The house rules from the build land last,
     then the rooms light up one by one. Hover a card (or a room) to trace it; click a card to hold it.
     Room bounds are the Spline scene's own (kip3d handoff: Entry −1200..−500, Living −500..400, Kitchen 400..1200
     downstairs; Nursery −1200..0, Study 0..1200 upstairs; floors 0 / 735 / 1460, ridge ~2110).
     Styles are injected from here, so the scene ships with the script alone (the Missions template head is Designer-only).
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.ks) return;
    var X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var pth = X.path, hide = X.hide, draw = X.draw, type = X.type, move = X.move, run = X.run, end = X.end, cursor = X.cursor;
    var NS = 'http://www.w3.org/2000/svg';
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    var CREAM = '#FFF4E6', NIGHT = '#14204F', H = "'Baloo 2','Arial Rounded MT Bold',ui-rounded,sans-serif", B = "'Nunito Sans',system-ui,sans-serif";
    // [room, x0, x1, y0, y1, fill, feature, what happens there, cast]
    var ROOMS = [
      ['Entry', -1200, -500, 0, 735, '#6FA8FF', 'Roles + shift handoff', 'Ari hands June to Grandpa. He sees everything since he left.', ['ari', 'grandpa']],
      ['Living', -500, 400, 0, 735, '#FFC94A', 'Milestones', 'Nana caught the first smile. Saved for the whole village.', ['nana']],
      ['Kitchen', 400, 1200, 0, 735, '#FF7A45', 'Shared log', 'Rosa goes to log vitamin D. Ari already did, so kip asks first.', ['rosa']],
      ['Nursery', -1200, 0, 735, 1460, '#2D3E8C', '3am mode', 'Opening it turns the whole scene to night. Jo logs the 3:07 bottle.', ['jo', 'june']],
      ['Study', 0, 1200, 735, 1460, '#5FD3A8', 'Pediatrician report', 'Sam builds a read-only report. Dr. Patel reads the patterns.', ['sam', 'patel']]
    ];
    var RULES = ['Characters always fully visible', 'Nothing between a room and the camera', 'Tap a room, poke anything'];

    if (!document.getElementById('kp-css')){
      var css = document.createElement('style'); css.id = 'kp-css';
      css.textContent =
        '.stg-kip-plan{background:' + NIGHT + ';font-family:' + B + ';color:' + CREAM + ';overflow:hidden}' +
        '.stg-kip-plan .kp-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,244,230,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,244,230,.07) 1px,transparent 1px),linear-gradient(rgba(255,244,230,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,244,230,.035) 1px,transparent 1px);background-size:100px 100px,100px 100px,20px 20px,20px 20px}' +
        '.stg-kip-plan .kp-file{position:absolute;left:24px;top:18px;display:flex;align-items:center;gap:10px;font:700 13px ' + B + '}' +
        '.stg-kip-plan .kp-file i{width:22px;height:22px;border-radius:7px;background:#FF7A45;display:grid;place-items:center;font:800 13px/1 ' + H + ';color:' + CREAM + ';font-style:normal}' +
        '.stg-kip-plan .kp-file em{font:600 10px ' + B + ';letter-spacing:.1em;text-transform:uppercase;opacity:.55;font-style:normal;border:1px solid rgba(255,244,230,.3);border-radius:999px;padding:3px 8px}' +
        '.stg-kip-plan .kp-cap{position:absolute;font:800 22px/1.1 ' + H + ';color:' + CREAM + '}' +
        '.stg-kip-plan svg{position:absolute;left:0;top:0;overflow:visible}' +
        '.stg-kip-plan .kp-ln{fill:none;stroke:' + CREAM + ';stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}' +
        '.stg-kip-plan .kp-ln.thin{stroke-width:1.4;opacity:.6}' +
        '.stg-kip-plan .kp-room{transition:opacity .25s}' +
        '.stg-kip-plan .kp-rl{position:absolute;font:800 16px/1 ' + H + ';color:#1E1B2E;white-space:nowrap}.stg-kip-plan .kp-rl.dk{color:' + CREAM + '}' +
        '.stg-kip-plan .kp-moon{position:absolute;color:#FFC94A;font:16px/1 sans-serif}' +
        '.stg-kip-plan .kp-card{position:absolute;display:flex;gap:12px;align-items:center;background:' + CREAM + ';color:#1E1B2E;border-radius:16px;padding:10px 14px 10px 12px;box-shadow:inset 0 2px 0 rgba(255,255,255,.8),inset 0 -3px 0 rgba(30,27,46,.08),0 8px 18px rgba(0,0,0,.28);transition:transform .25s,box-shadow .25s;cursor:pointer}' +
        '.stg-kip-plan .kp-card .bar{position:absolute;left:0;top:12px;bottom:12px;width:5px;border-radius:0 4px 4px 0;background:var(--c)}' +
        '.stg-kip-plan .kp-card .tx{flex:1;min-width:0}' +
        '.stg-kip-plan .kp-card b{display:block;font:800 17px/1.15 ' + H + '}' +
        '.stg-kip-plan .kp-card b span{color:var(--d);font-weight:800}' +
        '.stg-kip-plan .kp-card p{margin:3px 0 0;font:400 12.5px/1.35 ' + B + ';color:#4A4560}' +
        '.stg-kip-plan .kp-card .who{display:flex;flex:none}' +
        '.stg-kip-plan .kp-card .who img{width:44px;height:44px;border-radius:50%;display:block;margin-left:-10px;filter:drop-shadow(0 2px 3px rgba(30,27,46,.25))}' +
        '.stg-kip-plan .kp-card .who img:first-child{margin-left:0}' +
        '.stg-kip-plan .kp-rule{position:absolute;display:flex;align-items:center;gap:8px;font:700 12.5px ' + B + ';color:' + CREAM + ';border:1.5px solid rgba(255,244,230,.4);border-radius:999px;padding:7px 14px 7px 10px;white-space:nowrap}' +
        '.stg-kip-plan .kp-rule i{width:8px;height:8px;border-radius:50%;background:#FF7A45}' +
        '.stg-kip-plan.kp-hl .kp-card:not(.hl){opacity:.45}.stg-kip-plan.kp-hl .kp-room:not(.hl){opacity:.25}' +
        '.stg-kip-plan .kp-card.hl{transform:translateX(-6px) scale(1.02);box-shadow:inset 0 2px 0 rgba(255,255,255,.8),0 12px 26px rgba(0,0,0,.4)}' +
        '.stg-kip-plan.is-p .kp-card{padding:7px 10px 7px 10px;gap:9px;border-radius:13px}.stg-kip-plan.is-p .kp-card b{font-size:14px}.stg-kip-plan.is-p .kp-card p{font-size:10.5px;margin-top:1px}' +
        '.stg-kip-plan.is-p .kp-card .who img{width:34px;height:34px;margin-left:-8px}.stg-kip-plan.is-p .kp-rl{font-size:12px}.stg-kip-plan.is-p .kp-rule{font-size:10.5px;padding:5px 10px 5px 8px}' +
        '.stg-kip-plan .fg-fade{background:' + NIGHT + '}' +
        '.stg-kip-plan .cur.a path{fill:#FF7A45}.stg-kip-plan .cur.a .nm{background:#FF7A45;color:' + CREAM + '}';
      document.head.appendChild(css);
    }

    SCENE.add('kip-plan', function(sc){
      var P = sc.portrait, st = sc.stg;
      // house units → stage px: s = scale, (OX, GY) = house center at ground level
      // the monitor's own controls cover the bottom ~70px of the stage, so everything sits above that
      var L = P ? { s: .19, OX: 320, GY: 448, cx: 22, cy: 464, cw: 596, ch: 50, cg: 6, cap: null }
                : { s: .2, OX: 330, GY: 610, cx: 680, cy: 104, cw: 492, ch: 88, cg: 12, cap: [680, 60] };
      function X_(x){ return L.OX + x * L.s; } function Y_(y){ return L.GY - y * L.s; }
      var html = '<div class="kp-grid"></div><div class="kp-file"><i>k</i><b>kip — Site plan</b><em>FigJam</em></div>' +
        '<svg class="kp-fill" width="' + sc.SW + '" height="' + sc.SH + '" aria-hidden="true"></svg>' +
        '<svg class="kp-draw" width="' + sc.SW + '" height="' + sc.SH + '" aria-hidden="true"></svg>';
      ROOMS.forEach(function(r, i){
        var lx = X_(r[1]) + 10, ly = Y_(r[4]) + 10;
        html += '<div class="kp-rl' + (r[0] === 'Nursery' ? ' dk' : '') + '" data-r="' + i + '" style="left:' + lx + 'px;top:' + ly + 'px" data-t="' + esc(r[0]) + '"></div>';
        var y = L.cy + i * (L.ch + L.cg), dark = r[0] === 'Nursery' ? '#2D3E8C' : r[0] === 'Living' ? '#86610E' : r[0] === 'Kitchen' ? '#A8461F' : r[0] === 'Entry' ? '#2D55A3' : '#1E6F55';
        html += '<div class="kp-card" data-r="' + i + '" style="left:' + L.cx + 'px;top:' + y + 'px;width:' + L.cw + 'px;height:' + L.ch + 'px;--c:' + (r[0] === 'Nursery' ? '#6F86E8' : r[5]) + ';--d:' + dark + '"><i class="bar"></i>' +
          '<div class="tx"><b><span>' + esc(r[0]) + '</span> · <em class="ft" style="font-style:normal" data-t="' + esc(r[6]) + '"></em></b>' + (P ? '' : '<p>' + esc(r[7]) + '</p>') + '</div>' +
          '<span class="who">' + r[8].map(function(n){ return '<img alt="" data-src="' + n + '">'; }).join('') + '</span></div>';
      });
      // the nursery's night sky
      var nm = ROOMS[3];
      html += '<div class="kp-moon" style="left:' + (X_(nm[2]) - 46) + 'px;top:' + (Y_(nm[4]) + 12) + 'px">☾</div>';
            RULES.forEach(function(t, i){ html += '<div class="kp-rule" data-k="' + i + '"><i></i>' + esc(t) + '</div>'; });
      if (L.cap) html += '<div class="kp-cap" style="left:' + L.cap[0] + 'px;top:' + L.cap[1] + 'px">Every room demonstrates one feature.</div>';
      html += cursor('a', 'Angelino') + '<div class="fg-fade"></div>';
      st.innerHTML = html;

      var fill = q(st, '.kp-fill'), dr = q(st, '.kp-draw'), cards = qa(st, '.kp-card'), labels = qa(st, '.kp-rl'), rules = qa(st, '.kp-rule'),
        cur = q(st, '.cur.a'), moon = q(st, '.kp-moon'), cap = q(st, '.kp-cap'), file = q(st, '.kp-file');
      // rules: stacked top left, beside the roof (portrait: one row under the file bar)
      var rxp = 22;
      rules.forEach(function(r, i){ if (P){ r.style.left = rxp + 'px'; r.style.top = '52px'; rxp += r.offsetWidth + 6; } else { r.style.left = '28px'; r.style.top = (64 + i * 38) + 'px'; } });
      // portraits load on first play
      var loaded = false;
      function loadImgs(){ if (loaded) return; loaded = true; qa(st, '.who img').forEach(function(im){ im.src = VENDOR + 'kip/cast/' + im.getAttribute('data-src') + '.webp'; }); }

      // room fills (under the chalk); hovering a card lights its room
      var rooms = [];
      ROOMS.forEach(function(r, i){
        var re = document.createElementNS(NS, 'rect');
        re.setAttribute('x', X_(r[1])); re.setAttribute('y', Y_(r[4])); re.setAttribute('width', (r[2] - r[1]) * L.s); re.setAttribute('height', (r[4] - r[3]) * L.s);
        re.setAttribute('fill', r[5]); re.setAttribute('fill-opacity', '.92'); re.setAttribute('class', 'kp-room'); re.setAttribute('data-r', i);
        fill.appendChild(re); rooms.push(re);
      });
      // the chalk drawing: walls, floors, partitions, roof, chimney, attic window, ground, two trees
      var gx0 = X_(-1200), gx1 = X_(1200);
      var lines = [
        'M' + gx0 + ' ' + Y_(0) + 'L' + gx0 + ' ' + Y_(1460) + 'L' + gx1 + ' ' + Y_(1460) + 'L' + gx1 + ' ' + Y_(0),
        'M' + gx0 + ' ' + Y_(735) + 'L' + gx1 + ' ' + Y_(735),
        'M' + X_(-500) + ' ' + Y_(0) + 'L' + X_(-500) + ' ' + Y_(735) + 'M' + X_(400) + ' ' + Y_(0) + 'L' + X_(400) + ' ' + Y_(735) + 'M' + X_(0) + ' ' + Y_(735) + 'L' + X_(0) + ' ' + Y_(1460),
        'M' + X_(-1330) + ' ' + Y_(1430) + 'L' + X_(0) + ' ' + Y_(2110) + 'L' + X_(1330) + ' ' + Y_(1430),
        'M' + X_(700) + ' ' + Y_(1800) + 'L' + X_(700) + ' ' + Y_(2050) + 'L' + X_(860) + ' ' + Y_(2050) + 'L' + X_(860) + ' ' + Y_(1720),
        'M' + (X_(0) + 60 * L.s) + ' ' + Y_(1720) + 'A' + 60 * L.s + ' ' + 60 * L.s + ' 0 1 1 ' + (X_(0) + 60 * L.s - .1) + ' ' + Y_(1720)
      ];
      var chalk = lines.map(function(d){ return pth(dr, d, 'kp-ln'); });
      var ground = pth(dr, 'M' + X_(-1550) + ' ' + Y_(0) + 'L' + X_(1550) + ' ' + Y_(0), 'kp-ln');
      var trees = [[-1430, 1], [1430, -1]].map(function(t){ var x = X_(t[0]), r = 150 * L.s; return pth(dr, 'M' + x + ' ' + Y_(0) + 'L' + x + ' ' + Y_(380) + 'M' + (x + r) + ' ' + (Y_(380) - r) + 'A' + r + ' ' + r + ' 0 1 1 ' + (x + r - .1) + ' ' + (Y_(380) - r - .1), 'kp-ln thin'); });
      var marks = qa(st, '[data-r]');
      function light(k){
        st.classList.toggle('kp-hl', k != null);
        marks.forEach(function(e){ e.classList.toggle('hl', k != null && e.getAttribute('data-r') === String(k)); });
      }
      cards.forEach(function(c){
        var k = +c.getAttribute('data-r');
        c.addEventListener('pointerenter', function(){ light(k); });
        c.addEventListener('pointerleave', function(){ if (!sc.paused) light(null); });
        tap(c, function(){ if (sc.hold) sc.hold(); light(k); });
      });
      rooms.forEach(function(re){ var k = +re.getAttribute('data-r'); re.style.pointerEvents = 'auto'; re.addEventListener('pointerenter', function(){ light(k); }); re.addEventListener('pointerleave', function(){ if (!sc.paused) light(null); }); });
      fill.style.pointerEvents = 'none';

      var R = run(sc, function(){ light(null); loadImgs(); }), tl = R.tl;
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0)
        .set(rooms.concat(cards, labels, rules, [moon]), { autoAlpha: 0 }, 0);
      if (cap) tl.set(cap, { autoAlpha: 0 }, 0);
      chalk.concat([ground], trees).forEach(function(p){ hide(R, p); });
      // 1 · the house goes down in chalk
      tl.addLabel('house', .2);
      tl.fromTo(file, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, .15);
      draw(R, ground, .3, .7);
      chalk.forEach(function(p, i){ draw(R, p, .5 + i * .28, .7); });
      trees.forEach(function(p, i){ draw(R, p, 1.6 + i * .2, .6); });
      tl.to(cur, { autoAlpha: 1, duration: .2 }, 2.1);
      // 2 · room by room: fill, label, card
      var t = 2.3;
      tl.addLabel('rooms', t);
      ROOMS.forEach(function(r, i){
        var cx2 = (X_(r[1]) + X_(r[2])) / 2, cy2 = (Y_(r[3]) + Y_(r[4])) / 2;
        move(R, cur, { x: cx2, y: cy2 }, t, .45);
        tl.fromTo(rooms[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, immediateRender: false }, t + .4);
        tl.fromTo(labels[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, immediateRender: false }, t + .45);
        type(R, labels[i], r[0], t + .45, .3);
        if (i === 3) tl.fromTo(moon, { autoAlpha: 0, rotation: -30 }, { autoAlpha: 1, rotation: 0, duration: .5, ease: 'back.out(2)', immediateRender: false }, t + .55);
        tl.fromTo(cards[i], { autoAlpha: 0, x: P ? 0 : 24, y: P ? 12 : 0, scale: .96 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .4, ease: 'back.out(1.6)', immediateRender: false }, t + .6);
        var ft = q(cards[i], '.ft'); type(R, ft, r[6], t + .75, .4);
        t += P ? 1 : 1.1;
      });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      // 3 · the house rules
      t += .2; tl.addLabel('rules', t);
      if (cap) tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
      rules.forEach(function(r, i){ tl.fromTo(r, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, t + .3 + i * .25); });
      t += 1.4;
      // 4 · each room lights up in turn
      tl.addLabel('tour', t);
      [0, 1, 2, 3, 4].forEach(function(k, i){ R.at(t + i * 1, function(){ light(k); }); });
      R.at(t + 5.1, function(){ light(null); });
      end(sc, R, t + 6.2, t - .4, [{ t: 'House', at: 'house' }, { t: 'Rooms', at: 'rooms' }, { t: 'Rules', at: 'rules' }, { t: 'Tour', at: 'tour' }]);
    });
  })();
