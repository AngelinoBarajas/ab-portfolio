  /* =========================================================
     PLAYER ONE · secret: reach LV 20 (or enter the cheat) and the card opens a boss fight. Letterbox + a VS title card,
     then you fly it: arrows or WASD to move, Space to fire (phones: drag to fly, hold to fire). THE SCOPE CREEP drifts,
     fires aimed shots, telegraphs a beam you have to dodge, and enrages at half health (spread shots). Three shields;
     lose them and you retry. It all plays over a hyperspeed starfield (canvas). The last hit: the stars slow, the ship
     charges, mega beam, impact frames; then "You won", a short credits crawl, and the name finale (the two halves streak
     in from the sides and meet in the middle; the only place the name appears). Optional sound: all of it synthesized live (Web Audio), off until the visitor
     turns it on (remembered). Esc, the × button, or a tap at the end closes it.
     ========================================================= */
  (function(){
    // pixel sprites: one character per pixel
    var BOSS = [
      '......xxxxx......',
      '...xxxxxxxxxxx...',
      '..xxxxxxxxxxxxx..',
      '.xxxooxxxxxooxxx.',
      '.xxxooxxxxxooxxx.',
      'xxxxxxxxxxxxxxxxx',
      'xxx.xxxxxxxxx.xxx',
      'xx..xmmmmmmmx..xx',
      'x...xxxxxxxxx...x',
      '....xx.....xx....',
      '...xx.......xx...',
      '..xx.........xx..'
    ];
    var SHIP = [
      '.....o.....',
      '....oxo....',
      '....xwx....',
      '...xxxxx...',
      '..oxxxxxo..',
      '.ooxxxxxoo.',
      'oo..xxx..oo',
      '....f.f....',
      '.....f.....'
    ];
    var COL = { x: '#9b7dff', o: '#ff5a6a', m: '#07080d' }, SCOL = { x: '#F2F0EA', o: '#FF6A3D', w: '#4C8DFF', f: '#ffd166' };
    function sprite(rows, col, cls){
      var h = rows.length, w = rows[0].length, r = '';
      rows.forEach(function(row, y){ for (var x = 0; x < w; x++){ var c = row.charAt(x); if (col[c]) r += '<rect x="' + x + '" y="' + y + '" width="1.02" height="1.02" fill="' + col[c] + '"/>'; } });
      return '<svg class="' + cls + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
    }
    // the crawl never names anyone: the name appears once, in the finale (ROLES above it)
    var CREDITS = [
      ['Starring', 'You, Player One'],
      ['Final boss', 'The Scope Creep'],
      ['Soundtrack', 'Synthesized live in your browser'],
      ['Built with', 'Figma · Webflow · GSAP · Lenis'],
      ['', 'No scope was harmed in the making of this website.']
    ];
    var ROLES = 'Game idea · Story · Pixel art · Code · Sound', NAME = ['Angelino', 'Barajas'];

    /* ---------- sound: a tiny synth (original chiptune loop + effects), silent until switched on ---------- */
    var SFX = (function(){
      var ctx = null, master = null, on = false, loopT = null, step = 0, VOL = .32;
      try { on = localStorage.getItem('ab:boss-sound') === '1'; } catch (e){}
      function init(){
        if (ctx) return ctx;
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
        ctx = new AC(); master = ctx.createGain(); master.gain.value = on ? VOL : 0; master.connect(ctx.destination);
        return ctx;
      }
      function live(){ return ctx && on; }
      function tone(type, f0, f1, dur, vol, delay){
        if (!live()) return;
        var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .03);
      }
      function noise(dur, vol, delay, lp){
        if (!live()) return;
        var t = ctx.currentTime + (delay || 0), n = Math.max(1, Math.floor(ctx.sampleRate * dur)), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        s.buffer = b; f.type = 'lowpass'; f.frequency.value = lp || 3000; g.gain.value = vol;
        s.connect(f); f.connect(g); g.connect(master); s.start(t);
      }
      // battle loop: driving bass + a minor arpeggio, 136 bpm (written for this page)
      var BASS = [55, 55, 65.41, 55, 49, 49, 58.27, 49], ARP = [440, 523.25, 659.25, 523.25, 392, 493.88, 587.33, 493.88];
      function loopStart(){
        if (loopT) return; var dt = 60 / 136 / 2; step = 0;
        loopT = setInterval(function(){
          if (!live()) return; var i = step % 8;
          tone('triangle', BASS[i], 0, dt * .95, .3);
          if (step % 2 === 0) tone('square', ARP[(step / 2 | 0) % 8], 0, dt * .6, .045);
          if (step % 4 === 2) noise(.05, .12, 0, 7000);
          if (step % 8 === 0) tone('sine', 110, 40, .18, .35);
          step++;
        }, dt * 1000);
      }
      function loopStop(){ clearInterval(loopT); loopT = null; }
      return {
        isOn: function(){ return on; },
        set: function(v){
          on = !!v; try { localStorage.setItem('ab:boss-sound', on ? '1' : '0'); } catch (e){}
          if (on && init() && ctx.state === 'suspended') ctx.resume();
          if (master) master.gain.setTargetAtTime(on ? VOL : 0, ctx.currentTime, .05);
        },
        start: function(){ if (on) { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); } },
        laser: function(){ tone('square', 1500, 280, .13, .07); },
        hit: function(){ noise(.12, .22, 0, 2600); tone('square', 190, 70, .14, .09); },
        roar: function(){ tone('sawtooth', 92, 38, 1.2, .22); tone('sawtooth', 95, 40, 1.2, .18); noise(1, .14, 0, 700); },
        charge: function(){ tone('sawtooth', 70, 1100, 1.25, .1); tone('square', 140, 2200, 1.25, .03); },
        beam: function(){ noise(.55, .32, 0, 1400); tone('sawtooth', 240, 50, .55, .16); },
        whoosh: function(){ noise(.35, .14, 0, 5000); },
        boom: function(){ noise(1.6, .6, 0, 900); tone('sine', 120, 28, 1.4, .55); tone('square', 60, 25, .9, .12); },
        blip: function(){ tone('square', 520, 260, .09, .05); },
        hurt: function(){ tone('square', 320, 60, .35, .12); noise(.25, .2, 0, 1800); },
        shing: function(){ tone('sine', 2200, 3400, .5, .09); tone('triangle', 3300, 5200, .35, .05, .04); noise(.18, .1, 0, 9000); },
        mega: function(){ noise(1.6, .5, 0, 1600); tone('sawtooth', 160, 30, 1.5, .22); tone('square', 80, 26, 1.5, .1); },
        fanfare: function(){ [523.25, 659.25, 783.99, 1046.5].forEach(function(f, i){ tone('square', f, 0, .18, .07, i * .13); }); tone('square', 783.99, 0, .22, .07, .6); tone('square', 1046.5, 0, .9, .09, .82); tone('triangle', 261.63, 0, 1.1, .12, .82); },
        loopStart: loopStart, loopStop: loopStop,
        close: function(){ loopStop(); if (ctx){ try { ctx.close(); } catch (e){} ctx = null; master = null; } }
      };
    })();

    // hyperspeed backdrop: stars rush out of a vanishing point behind the boss and streak longer the faster we go.
    // speed(v, dur) eases between cruise (~.5), full warp (3+) and a near stop (.1); one canvas on gsap's ticker.
    function warpField(o){
      var cv = document.createElement('canvas'), g = cv.getContext && cv.getContext('2d');
      if (!g) return { speed: function(){}, kill: function(){} };
      cv.className = 'ab_boss_warp'; cv.setAttribute('aria-hidden', 'true'); o.insertBefore(cv, o.firstChild); o.classList.add('is-warp');
      var TINT = ['242,240,234', '242,240,234', '242,240,234', '255,106,61', '155,125,255', '76,141,255'];
      var st = { v: .5 }, dpr = Math.min(2, window.devicePixelRatio || 1), w = 0, h = 0, f = 0, stars = [];
      function seed(s, far){ s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = far ? 1 : .05 + Math.random() * .95; s.c = TINT[Math.random() * TINT.length | 0]; return s; }
      function size(){
        w = o.clientWidth; h = o.clientHeight; f = Math.max(w, h) * .5; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        var n = Math.round(Math.min(460, Math.max(160, w * h / 3200)));
        while (stars.length < n) stars.push(seed({}, false));
        stars.length = n;
      }
      function tick(t, dms){
        var dt = Math.min(.05, (dms || 16) / 1000), vx = w * .5, vy = h * .34, trail = .012 + st.v * .05;
        g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h); g.lineCap = 'round';
        for (var i = 0; i < stars.length; i++){
          var s = stars[i]; s.z -= st.v * dt;
          if (s.z <= .02){ seed(s, true); continue; }
          var x1 = vx + s.x / s.z * f, y1 = vy + s.y / s.z * f;
          if (x1 < -30 || x1 > w + 30 || y1 < -30 || y1 > h + 30){ seed(s, true); continue; }
          var z0 = Math.min(1, s.z + trail), k = 1 - s.z;
          g.strokeStyle = 'rgba(' + s.c + ',' + (k * .9 + .1).toFixed(2) + ')'; g.lineWidth = .4 + k * 2.2;
          g.beginPath(); g.moveTo(vx + s.x / z0 * f, vy + s.y / z0 * f); g.lineTo(x1, y1); g.stroke();
        }
      }
      size(); addEventListener('resize', size); gsap.ticker.add(tick);
      return {
        speed: function(v, dur){ gsap.to(st, { v: v, duration: dur == null ? .8 : dur, ease: 'power2.inOut', overwrite: true }); },
        kill: function(){ gsap.ticker.remove(tick); removeEventListener('resize', size); gsap.killTweensOf(st); }
      };
    }

    var open = false;
    LV.boss = function(){
      if (open || LV.beaten) return; open = true;
      var lenis = AB.lenis, root = document.documentElement;
      var o = document.createElement('div'); o.className = 'ab_boss'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Boss fight: The Scope Creep'); o.tabIndex = -1;
      var HELP = coarse ? 'Drag to fly · hold to fire' : 'Arrows or WASD to fly · Space to fire';
      o.innerHTML = '<div class="ab_boss_stars" aria-hidden="true"></div>' +
        '<div class="ab_boss_ctl"><button type="button" class="ab_boss_snd" aria-pressed="false"></button><button type="button" class="ab_boss_x" aria-label="Close the boss fight">Skip ×</button></div>' +
        '<div class="ab_boss_hud"><span class="ab_boss_name">Boss · The Scope Creep</span><span class="ab_boss_hp"><i></i></span>' +
          '<span class="ab_boss_lives" aria-label="Shields">Shields <i></i><i></i><i></i></span></div>' +
        '<div class="ab_boss_arena">' + sprite(BOSS, COL, 'ab_boss_mon') + sprite(SHIP, SCOL, 'ab_boss_ship') + '<i class="ab_boss_beam" aria-hidden="true"></i><i class="ab_boss_mega" aria-hidden="true"></i></div>' +
        '<div class="ab_boss_dim" aria-hidden="true"></div>' +
        '<div class="ab_boss_vs" aria-hidden="true"><span class="ab_boss_vs-a">Player one</span><b>VS</b><span class="ab_boss_vs-b">The Scope Creep</span></div>' +
        '<div class="ab_boss_warn">Warning · boss approaching</div>' +
        '<div class="ab_boss_help" aria-live="polite">' + HELP + '</div>' +
        '<div class="ab_boss_over"><b>Mission failed</b><p>The Scope Creep got through your shields.</p><span>' + (coarse ? 'Tap' : 'Press Enter or tap') + ' to try again</span></div>' +
        '<div class="ab_boss_win"><b>You won</b><p>LV ' + LV.BOSS + ' · The Scope Creep is defeated. The project shipped on time, on budget, and nobody asked for “just one more thing.”</p></div>' +
        '<div class="ab_boss_crawl" aria-hidden="true"><div class="ab_boss_tilt"><div class="ab_boss_crawl-in">' +
          CREDITS.map(function(c){ return '<div class="ab_boss_cr">' + (c[0] ? '<small>' + esc(c[0]) + '</small>' : '') + '<span>' + esc(c[1]) + '</span></div>'; }).join('') +
          '</div></div></div>' +
        '<div class="ab_boss_fin" aria-hidden="true"><small>' + ROLES + '</small>' +
          '<div class="ab_boss_fin-name"><span class="is-l"><i></i><i></i><i></i>' + NAME[0] + '</span><span class="is-r"><i></i><i></i><i></i>' + NAME[1] + '</span></div>' +
          '<small class="ab_boss_fin-tap">Thanks for playing · tap anywhere to return</small></div>' +
        '<div class="ab_boss_bar is-t" aria-hidden="true"></div><div class="ab_boss_bar is-b" aria-hidden="true"></div>' +
        '<div class="ab_boss_flash" aria-hidden="true"></div>' +
        '<ul class="ab_sr">' + CREDITS.map(function(c){ return '<li>' + esc((c[0] ? c[0] + ': ' : '') + c[1]) + '</li>'; }).join('') + '<li>' + esc(ROLES + ': ' + NAME.join(' ')) + '</li></ul>';
      document.body.appendChild(o);
      if (lenis) lenis.stop(); root.style.overflow = 'hidden';
      var closeBtn = $('.ab_boss_x', o), sndBtn = $('.ab_boss_snd', o), prevFocus = document.activeElement, tl = null, ended = false, warp = null;
      function paintSnd(){ var on = SFX.isOn(); sndBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); sndBtn.innerHTML = (on ? '♪ Sound on' : '♪ Sound off'); sndBtn.setAttribute('aria-label', on ? 'Turn the sound off' : 'Turn the sound on'); }
      paintSnd();
      sndBtn.addEventListener('click', function(e){ e.stopPropagation(); SFX.set(!SFX.isOn()); paintSnd(); if (SFX.isOn() && tl && tl.__loop) SFX.loopStart(); o.focus({ preventScroll: true }); });
      SFX.start();

      var mon = $('.ab_boss_mon', o), ship = $('.ab_boss_ship', o), hp = $('.ab_boss_hp i', o), arena = $('.ab_boss_arena', o), beam = $('.ab_boss_beam', o), mega = $('.ab_boss_mega', o);
      var win = $('.ab_boss_win', o), crawl = $('.ab_boss_crawl', o), crawlIn = $('.ab_boss_crawl-in', o), warn = $('.ab_boss_warn', o);
      var bars = $$('.ab_boss_bar', o), vs = $('.ab_boss_vs', o), dim = $('.ab_boss_dim', o), flash = $('.ab_boss_flash', o), hud = $('.ab_boss_hud', o);
      var help = $('.ab_boss_help', o), over = $('.ab_boss_over', o), pips = $$('.ab_boss_lives i', o), nameEl = $('.ab_boss_name', o);

      /* ---------- the fight: a small real-time game on gsap's ticker ---------- */
      var running = false, isOver = false, keys = {}, touch = null, shots = [], foes = [];
      var W = 0, H = 0, SB = null, MB = null, sx = 0, sy = 0, tilt = 0, bx = 0, bt = 0, HPV = 100, lives = 3, inv = 0, cool = 0;
      var tAim = 0, tSpread = 0, tBeam = 0, beamSt = null, enraged = false, helpOn = false;
      var DMG = 2;
      function base(el){ var a = arena.getBoundingClientRect(), r = el.getBoundingClientRect(); return { x: r.left - a.left - (+gsap.getProperty(el, 'x') || 0), y: r.top - a.top - (+gsap.getProperty(el, 'y') || 0), w: r.width, h: r.height }; }
      function measure(){ W = arena.offsetWidth; H = arena.offsetHeight; SB = base(ship); MB = base(mon); }
      function shipC(){ return { x: SB.x + sx + SB.w / 2, y: SB.y + sy + SB.h * .55 }; }
      function bossBox(){ return { x: MB.x + bx + MB.w * .08, y: MB.y + MB.h * .05, w: MB.w * .84, h: MB.h * .8 }; }
      function place(el, x, y){ el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }
      function paintLives(){ pips.forEach(function(p, i){ p.classList.toggle('is-gone', i >= lives); }); }
      function clearBullets(){ shots.concat(foes).forEach(function(b){ b.el.remove(); }); shots = []; foes = []; }
      function hideBeam(){ beamSt = null; beam.classList.remove('is-tele', 'is-fire'); gsap.to(mon, { filter: 'brightness(1)', scale: 1, duration: .3 }); gsap.to(dim, { opacity: 0, duration: .3 }); }
      function hideHelp(){ if (!helpOn) return; helpOn = false; gsap.to(help, { opacity: 0, duration: .4 }); }

      function fire(){
        var c = shipC(), el = document.createElement('i'); el.className = 'ab_boss_laser'; arena.appendChild(el);
        var b = { el: el, x: c.x, y: SB.y + sy - 10 }; place(el, b.x, b.y); shots.push(b); SFX.laser();
      }
      function enemyShot(x, y, vx, vy){ var el = document.createElement('i'); el.className = 'ab_boss_blob'; arena.appendChild(el); var f = { el: el, x: x, y: y, vx: vx, vy: vy }; place(el, x, y); foes.push(f); }
      function aimed(){
        var c = shipC(), x = MB.x + bx + MB.w / 2, y = MB.y + MB.h * .85, dx = c.x - x, dy = c.y - y, d = Math.sqrt(dx * dx + dy * dy) || 1, v = enraged ? 380 : 300;
        enemyShot(x, y, dx / d * v, dy / d * v); SFX.blip();
      }
      function spread(){
        var x = MB.x + bx + MB.w / 2, y = MB.y + MB.h * .85, v = 250;
        for (var k = -2; k <= 2; k++){ var ang = Math.PI / 2 + k * .28; enemyShot(x, y, Math.cos(ang) * v, Math.sin(ang) * v); }
        SFX.blip();
      }
      function hurt(){
        if (inv > 0) return;
        lives--; inv = 1.5; paintLives(); SFX.hurt(); shake(16);
        ship.classList.add('is-hurt'); setTimeout(function(){ ship.classList.remove('is-hurt'); }, 1500);
        gsap.fromTo(dim, { opacity: .7 }, { opacity: 0, duration: .5 });
        if (lives <= 0) gameOver();
      }
      function damage(){
        HPV = Math.max(0, HPV - DMG); hit(Math.max(HPV, 0), false);
        if (!enraged && HPV <= 50){
          enraged = true; mon.classList.add('is-rage'); SFX.roar(); shake(24); nameEl.textContent = 'Boss · The Scope Creep · enraged';
          warn.textContent = 'Scope creep detected'; gsap.fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 5, yoyo: true, ease: 'steps(1)', onComplete: function(){ gsap.set(warn, { opacity: 0 }); } });
          tSpread = 1.2;
        }
        if (HPV <= 0) finish();
      }
      function tick(time, deltaMs){
        if (!running) return;
        var dt = Math.min(.05, (deltaMs || 16) / 1000);
        // pilot
        var spd = Math.max(260, W * .55), dx = 0, dy = 0;
        if (touch){
          var tx = touch.x - (SB.x + SB.w / 2), ty = touch.y - 80 - (SB.y + SB.h / 2), ddx = tx - sx, ddy = ty - sy, dd = Math.sqrt(ddx * ddx + ddy * ddy), step = spd * 1.6 * dt;
          if (dd > 1){ var k = Math.min(1, step / dd); sx += ddx * k; sy += ddy * k; dx = ddx / dd; }
        } else {
          dx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0); dy = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
          if (dx && dy){ dx *= .7071; dy *= .7071; }
          sx += dx * spd * dt; sy += dy * spd * dt;
        }
        sx = Math.max(6 - SB.x, Math.min(W - SB.w - 6 - SB.x, sx));
        sy = Math.max(H * .4 - SB.y, Math.min(H - SB.h - 4 - SB.y, sy));
        tilt += ((dx || 0) * 14 - tilt) * Math.min(1, dt * 10);
        gsap.set(ship, { x: sx, y: sy, rotation: tilt });
        cool -= dt; inv -= dt;
        if ((keys.f || touch) && cool <= 0){ fire(); cool = .15; }
        // boss: drifts side to side, stands still while it charges the beam
        if (!beamSt){ bt += dt * (enraged ? 1.35 : .85); bx = Math.sin(bt) * Math.max(0, (W - MB.w) / 2 - 12) * .85; gsap.set(mon, { x: bx }); }
        tAim -= dt; tSpread -= dt; tBeam -= dt;
        if (tAim <= 0 && !beamSt){ aimed(); tAim = (enraged ? .8 : 1.3) + Math.random() * .35; }
        if (enraged && tSpread <= 0 && !beamSt){ spread(); tSpread = 3; }
        if (tBeam <= 0 && !beamSt){
          beamSt = { t: 0, x: MB.x + bx + MB.w / 2 }; tBeam = enraged ? 6.5 : 8.5;
          var top = MB.y + MB.h - 6; beam.style.left = beamSt.x + 'px'; beam.style.top = top + 'px'; beam.style.height = (H - top) + 'px';
          beam.classList.add('is-tele'); SFX.charge();
          gsap.to(mon, { filter: 'brightness(1.8) drop-shadow(0 0 26px #ff5a6a)', scale: 1.06, duration: .9, ease: 'power1.in' }); gsap.to(dim, { opacity: .45, duration: .5 });
        }
        if (beamSt){
          beamSt.t += dt;
          if (beamSt.t >= .95 && !beamSt.fired){ beamSt.fired = true; beam.classList.remove('is-tele'); beam.classList.add('is-fire'); SFX.beam(); shake(14); }
          if (beamSt.fired && Math.abs(shipC().x - beamSt.x) < 23 + SB.w * .22) hurt();
          if (beamSt.t >= 1.6) hideBeam();
        }
        // bullets
        var bb = bossBox(), i;
        for (i = shots.length - 1; i >= 0; i--){
          var s = shots[i]; s.y -= 950 * dt;
          if (s.x > bb.x && s.x < bb.x + bb.w && s.y > bb.y && s.y < bb.y + bb.h){ s.el.remove(); shots.splice(i, 1); damage(); if (!running) return; continue; }
          if (s.y < -40){ s.el.remove(); shots.splice(i, 1); continue; }
          place(s.el, s.x, s.y);
        }
        var c = shipC(), rr = SB.w * .26 + 6;
        for (i = foes.length - 1; i >= 0; i--){
          var f = foes[i]; f.x += f.vx * dt; f.y += f.vy * dt;
          var ex = f.x - c.x, ey = f.y - c.y;
          if (ex * ex + ey * ey < rr * rr){ f.el.remove(); foes.splice(i, 1); hurt(); if (!running) return; continue; }
          if (f.y > H + 30 || f.x < -30 || f.x > W + 30){ f.el.remove(); foes.splice(i, 1); continue; }
          place(f.el, f.x, f.y);
        }
      }
      function startGame(){
        measure(); sx = sy = 0; bx = 0; bt = 0; HPV = 100; lives = 3; inv = 0; cool = 0; enraged = false;
        tAim = 2.2; tSpread = 3; tBeam = 6; beamSt = null; keys = {}; touch = null;
        mon.classList.remove('is-rage'); nameEl.textContent = 'Boss · The Scope Creep'; hp.style.width = '100%'; paintLives();
        gsap.set(ship, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });
        helpOn = true; gsap.fromTo(help, { opacity: 0 }, { opacity: 1, duration: .4 });
        setTimeout(hideHelp, 5000);
        running = true; gsap.ticker.add(tick);
      }
      function stopGame(){ running = false; gsap.ticker.remove(tick); touch = null; keys = {}; }
      function gameOver(){
        stopGame(); isOver = true; clearBullets(); if (beamSt) hideBeam(); SFX.loopStop(); SFX.boom(); warp.speed(.12, 1.2);
        gsap.to(ship, { opacity: 0, scale: 1.8, duration: .5, ease: 'power2.out' });
        gsap.set(over, { visibility: 'visible' }); gsap.fromTo(over, { opacity: 0 }, { opacity: 1, duration: .4, delay: .5 });
      }
      function retry(){
        if (!isOver) return; isOver = false;
        gsap.to(over, { opacity: 0, duration: .25, onComplete: function(){ gsap.set(over, { visibility: 'hidden' }); } });
        SFX.loopStart(); warp.speed(.55, 1); startGame();
      }

      /* ---------- input: arrows / WASD + Space, or drag (touch and mouse) ---------- */
      var KEYMAP = { arrowleft: 'l', a: 'l', arrowright: 'r', d: 'r', arrowup: 'u', w: 'u', arrowdown: 'd', s: 'd', ' ': 'f', spacebar: 'f' };
      function keyOf(e){ return KEYMAP[(e.key || '').toLowerCase()] || (e.code === 'Space' ? 'f' : null); }
      function onKey(e){
        if (e.key === 'Escape'){ close(); return; }
        var k = keyOf(e);
        if (isOver && (e.key === 'Enter' || k === 'f')){ e.preventDefault(); retry(); return; }
        if (!k) return;
        // the page is locked behind the fight: keep Space/arrows from scrolling or pressing a focused button
        e.preventDefault();
        if (running){ keys[k] = true; hideHelp(); }
      }
      function onKeyUp(e){ var k = keyOf(e); if (k){ keys[k] = false; e.preventDefault(); } }
      function onBlur(){ keys = {}; touch = null; }
      function onResize(){ if (running) measure(); }
      function pt(e){ var a = arena.getBoundingClientRect(); return { x: e.clientX - a.left, y: e.clientY - a.top }; }
      o.addEventListener('pointerdown', function(e){
        if (e.target.closest && e.target.closest('button')) return;
        if (isOver){ retry(); return; }
        if (!running) return;
        touch = pt(e); hideHelp(); try { o.setPointerCapture(e.pointerId); } catch (err){}
      });
      o.addEventListener('pointermove', function(e){ if (touch) touch = pt(e); });
      o.addEventListener('pointerup', function(){ touch = null; });
      o.addEventListener('pointercancel', function(){ touch = null; });
      document.addEventListener('keydown', onKey);
      document.addEventListener('keyup', onKeyUp);
      addEventListener('blur', onBlur); addEventListener('resize', onResize);

      function close(){
        if (!open) return; open = false; LV.beaten = true;
        stopGame(); clearBullets(); if (warp) warp.kill();
        if (tl) tl.kill(); document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKeyUp);
        removeEventListener('blur', onBlur); removeEventListener('resize', onResize);
        SFX.close(); if (hasGsap) gsap.globalTimeline.timeScale(1);
        if (lenis) lenis.start(); root.style.overflow = '';
        if (hasGsap && !reduce) gsap.to(o, { opacity: 0, duration: .4, onComplete: function(){ o.remove(); } }); else o.remove();
        if (LV.press){ LV.press.textContent = 'Boss defeated · GG'; LV.press.style.animation = 'none'; }
        if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e){}
      }
      closeBtn.addEventListener('click', function(e){ e.stopPropagation(); close(); });
      o.addEventListener('click', function(){ if (ended) close(); });
      // focus the dialog, not the Skip button, so Space fires instead of skipping
      o.focus({ preventScroll: true });

      if (reduce || !hasGsap){
        // no fight: straight to the result, credits as a still list
        o.classList.add('is-still'); crawlIn.appendChild($('.ab_boss_fin', o)); win.style.opacity = 1; crawl.style.opacity = 1; hp.style.width = '0%'; ended = true; if (AB.quest) AB.quest('boss'); return;
      }
      // we arrive at hyperspeed and drop to cruise when the boss shows up
      warp = warpField(o); warp.speed(3.4, 0);
      function shake(n){ gsap.fromTo(arena, { x: (Math.random() - .5) * n, y: (Math.random() - .5) * n }, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.25)' }); }
      function hit(pc, big){
        SFX.hit();
        gsap.fromTo(mon, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: .25 });
        shake(big ? 26 : 5);
        hp.style.width = pc + '%';
        var d = document.createElement('span'); d.className = 'ab_boss_dmg'; d.textContent = '-' + (8 + Math.round(Math.random() * 6)); arena.appendChild(d);
        var m = mon.getBoundingClientRect(), a = arena.getBoundingClientRect();
        gsap.fromTo(d, { x: m.left - a.left + m.width * (.2 + Math.random() * .6), y: m.top - a.top + m.height * .3, opacity: 1 }, { y: '-=40', opacity: 0, duration: .8, ease: 'steps(6)', onComplete: function(){ d.remove(); } });
      }
      function explode(){
        SFX.loopStop(); SFX.boom(); if (AB.quest) AB.quest('boss');
        var rects = $$('rect', mon);
        rects.forEach(function(r){ gsap.to(r, { x: (Math.random() - .5) * 34, y: (Math.random() - .3) * 30, opacity: 0, duration: 1.1 + Math.random() * .8, ease: 'power2.out' }); });
        gsap.fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'power2.out' });
        shake(40);
      }
      // energy gathers on the ship before the finisher
      function gather(c){
        for (var n = 0; n < 28; n++){
          var el = document.createElement('i'); el.className = 'ab_boss_spark'; arena.appendChild(el);
          var ang = Math.random() * Math.PI * 2, r = 140 + Math.random() * 220;
          gsap.fromTo(el, { x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r, opacity: 0, scale: 1.6 },
            { x: c.x, y: c.y, opacity: 1, scale: .4, duration: .5 + Math.random() * .5, delay: Math.random() * .5, ease: 'power3.in', onComplete: (function(e){ return function(){ e.remove(); }; })(el) });
        }
      }

      /* ---------- the finisher: the stars slow, the ship charges and drags the boss into line, a mega beam, impact frames ---------- */
      function finish(){
        stopGame(); clearBullets(); if (beamSt) hideBeam(); hp.style.width = '2%'; hideHelp();
        SFX.loopStop(); SFX.hit();
        var c = shipC(), shipTop = SB.y + sy;
        gsap.set(ship, { rotation: 0 });
        tl = gsap.timeline();
        tl.fromTo(flash, { opacity: .85 }, { opacity: 0, duration: .25 })
          .add(function(){ warp.speed(.08, .6); SFX.charge(); gsap.set(arena, { transformOrigin: c.x + 'px ' + c.y + 'px' }); gather(c); })
          .to(arena, { scale: 1.55, duration: 1.1, ease: 'power2.inOut' })
          .to(ship, { filter: 'brightness(2.2) drop-shadow(0 0 22px #FF6A3D)', duration: 1.1 }, '<')
          // the ship's lock drags the boss into its line of fire
          .to(mon, { x: c.x - MB.x - MB.w / 2, duration: 1.1, ease: 'power2.inOut' }, '<')
          .to(arena, { scale: 1, duration: .16, ease: 'power3.in' }, '+=.25')
          // fire: the beam runs from the ship to the top of the screen, straight through the boss
          .add(function(){
            mega.style.left = c.x + 'px'; mega.style.height = Math.max(0, shipTop + 6) + 'px';
            SFX.mega(); shake(34); warp.speed(3.6, .15);
          })
          .fromTo(mega, { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .1, ease: 'power2.out' })
          // impact frames: silhouette, invert, silhouette
          .add(function(){ o.classList.add('is-impact'); })
          .add(function(){ o.classList.remove('is-impact'); o.classList.add('is-invert'); }, '+=.08')
          .add(function(){ o.classList.remove('is-invert'); o.classList.add('is-impact'); }, '+=.07')
          .add(function(){ o.classList.remove('is-impact'); hp.style.width = '0%'; }, '+=.09')
          .to(mega, { scaleX: .7, duration: .06, yoyo: true, repeat: 5, ease: 'steps(1)' })
          .add(explode, '+=.05')
          .add(function(){ warp.speed(.5, 1.6); }, '<')
          .to(mega, { scaleX: 0, opacity: 0, duration: .5, ease: 'power2.in' }, '<.2')
          .to(ship, { filter: 'brightness(1) drop-shadow(0 0 10px rgba(255,106,61,.6))', duration: .6 }, '<');
        outro(tl);
      }
      function outro(t){
        t.to(hud, { opacity: 0, duration: .4 }, '+=.5')
          .add(function(){ SFX.fanfare(); })
          .fromTo(win, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)', onStart: function(){ ended = true; } }, '<')
          .to(ship, { y: '-=40', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
          .to(win, { opacity: 0, y: -30, duration: .6 }, '+=3')
          .to(bars, { scaleY: 0, duration: .6, ease: 'power2.in' }, '<')
          .to(ship, { y: -innerHeight, duration: 1.4, ease: 'power2.in' }, '<')
          .to(crawl, { opacity: 1, duration: .5 }, '<')
          .fromTo(crawlIn, { yPercent: 0, y: function(){ return crawl.offsetHeight; } }, { yPercent: -100, y: function(){ return crawl.offsetHeight * .3; }, duration: 13, ease: 'none' })
          .to(crawl, { opacity: 0, duration: .6 }, '-=1.2');
        // finale: back to hyperspeed, the two halves of the name streak in from the sides and meet in the middle
        var fin = $('.ab_boss_fin', o), L = $('.is-l', fin), R = $('.is-r', fin), trails = $$('.ab_boss_fin-name i', fin), fsm = $$('small', fin);
        t.add(function(){ warp.speed(3.4, .7); SFX.whoosh(); })
          .set(fin, { visibility: 'visible' })
          .fromTo(fsm[0], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5 }, '+=.3')
          // each half starts just past its screen edge (layout offsets: transforms don't move them), so the whole flight shows
          .fromTo(L, { x: function(){ return -(L.offsetLeft + L.offsetWidth) - 60; }, skewX: -28 }, { x: 0, skewX: 0, duration: .75, ease: 'power3.in' }, '+=.15')
          .fromTo(R, { x: function(){ return innerWidth - R.offsetLeft + 60; }, skewX: 28 }, { x: 0, skewX: 0, duration: .75, ease: 'power3.in' }, '<')
          .add(function(){ SFX.boom(); SFX.fanfare(); gsap.fromTo(flash, { opacity: .7 }, { opacity: 0, duration: .9, ease: 'power2.out' }); warp.speed(.3, 2); })
          .to(trails, { scaleX: 0, opacity: 0, duration: .5, ease: 'power3.out' })
          .fromTo([L, R], { scaleX: 1.14, scaleY: .88 }, { scaleX: 1, scaleY: 1, duration: .7, ease: 'elastic.out(1,.35)' }, '<')
          .fromTo(fsm[1], { opacity: 0 }, { opacity: 1, duration: .6 }, '+=.4');
      }

      tl = gsap.timeline();
      // cold open: letterbox, VS title card
      tl.from(o, { opacity: 0, duration: .3 })
        .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: .6, ease: 'power3.out' })
        .add(function(){ SFX.roar(); })
        .fromTo($('.ab_boss_vs-a', vs), { xPercent: -120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .55, ease: 'power3.out' }, '<')
        .fromTo($('.ab_boss_vs-b', vs), { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: .55, ease: 'power3.out' }, '<')
        .fromTo($('b', vs), { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(2)' }, '<.25')
        .to(vs, { opacity: 0, scale: 1.08, duration: .35 }, '+=1.1')
        // entrance: warning, the ship rises, the boss drops in as the camera pulls back
        .add(function(){ warp.speed(.55, 1.8); })
        .fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .12, repeat: 5, yoyo: true, ease: 'steps(1)' }, '<')
        .to(warn, { opacity: 0, duration: .2 })
        .fromTo(arena, { scale: 1.25 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, '<')
        .from(ship, { y: 160, opacity: 0, duration: .7, ease: 'power3.out' }, '<')
        .from(mon, { y: -320, duration: 1, ease: 'bounce.out' }, '<.15')
        .add(function(){ shake(22); }, '-=.35')
        .from(hud, { opacity: 0, y: -10, duration: .4 }, '<')
        .fromTo(hp, { width: '0%' }, { width: '100%', duration: .6, ease: 'steps(10)' })
        .add(function(){ tl.__loop = true; SFX.loopStart(); startGame(); });
    };
  })();
