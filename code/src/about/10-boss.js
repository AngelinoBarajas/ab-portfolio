  /* =========================================================
     PLAYER ONE · secret: reach LV 20 (or enter the cheat) and the card opens a boss fight. Letterbox + a VS title card,
     your ship takes down THE SCOPE CREEP (it charges a beam, you barrel-roll past it), a slow-motion final shot,
     "You won", then a credits crawl. Optional sound: all of it synthesized live (Web Audio), off until the visitor
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
    var CREDITS = [
      ['A game by', 'Angelino Barajas'],
      ['Pilot · designer · developer', 'Angelino Barajas'],
      ['Crew', 'Two moons: wife + son'],
      ['Fuel', 'Coffee. A lot of coffee.'],
      ['Currently reading', 'Thus Spoke Zarathustra'],
      ['Favorite film', 'Interstellar'],
      ['Final boss', 'The Scope Creep'],
      ['Built with', 'Figma · Webflow · GSAP · Lenis'],
      ['Special thanks', 'You, Player One'],
      ['', 'No scope was harmed in the making of this website.']
    ];

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
        fanfare: function(){ [523.25, 659.25, 783.99, 1046.5].forEach(function(f, i){ tone('square', f, 0, .18, .07, i * .13); }); tone('square', 783.99, 0, .22, .07, .6); tone('square', 1046.5, 0, .9, .09, .82); tone('triangle', 261.63, 0, 1.1, .12, .82); },
        loopStart: loopStart, loopStop: loopStop,
        close: function(){ loopStop(); if (ctx){ try { ctx.close(); } catch (e){} ctx = null; master = null; } }
      };
    })();

    var open = false;
    LV.boss = function(){
      if (open || LV.beaten) return; open = true;
      var lenis = AB.lenis, root = document.documentElement;
      var o = document.createElement('div'); o.className = 'ab_boss'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Boss fight: The Scope Creep');
      o.innerHTML = '<div class="ab_boss_stars" aria-hidden="true"></div>' +
        '<div class="ab_boss_ctl"><button type="button" class="ab_boss_snd" aria-pressed="false"></button><button type="button" class="ab_boss_x" aria-label="Close the boss fight">Skip ×</button></div>' +
        '<div class="ab_boss_hud"><span class="ab_boss_name">Boss · The Scope Creep</span><span class="ab_boss_hp"><i></i></span></div>' +
        '<div class="ab_boss_arena">' + sprite(BOSS, COL, 'ab_boss_mon') + sprite(SHIP, SCOL, 'ab_boss_ship') + '<i class="ab_boss_beam" aria-hidden="true"></i></div>' +
        '<div class="ab_boss_dim" aria-hidden="true"></div>' +
        '<div class="ab_boss_vs" aria-hidden="true"><span class="ab_boss_vs-a">Player one</span><b>VS</b><span class="ab_boss_vs-b">The Scope Creep</span></div>' +
        '<div class="ab_boss_warn">Warning · boss approaching</div>' +
        '<div class="ab_boss_win"><b>You won</b><p>LV ' + LV.BOSS + ' · The Scope Creep is defeated. The project shipped on time, on budget, and nobody asked for “just one more thing.”</p></div>' +
        '<div class="ab_boss_crawl" aria-hidden="true"><div class="ab_boss_tilt"><div class="ab_boss_crawl-in">' +
          CREDITS.map(function(c){ return '<div class="ab_boss_cr">' + (c[0] ? '<small>' + esc(c[0]) + '</small>' : '') + '<span>' + esc(c[1]) + '</span></div>'; }).join('') +
          '<div class="ab_boss_cr is-end"><span>The end</span><small>Tap anywhere to return</small></div></div></div></div>' +
        '<div class="ab_boss_bar is-t" aria-hidden="true"></div><div class="ab_boss_bar is-b" aria-hidden="true"></div>' +
        '<div class="ab_boss_flash" aria-hidden="true"></div>' +
        '<ul class="ab_sr">' + CREDITS.map(function(c){ return '<li>' + esc((c[0] ? c[0] + ': ' : '') + c[1]) + '</li>'; }).join('') + '</ul>';
      document.body.appendChild(o);
      if (lenis) lenis.stop(); root.style.overflow = 'hidden';
      var closeBtn = $('.ab_boss_x', o), sndBtn = $('.ab_boss_snd', o), prevFocus = document.activeElement, tl = null, ended = false;
      function paintSnd(){ var on = SFX.isOn(); sndBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); sndBtn.innerHTML = (on ? '♪ Sound on' : '♪ Sound off'); sndBtn.setAttribute('aria-label', on ? 'Turn the sound off' : 'Turn the sound on'); }
      paintSnd();
      sndBtn.addEventListener('click', function(e){ e.stopPropagation(); SFX.set(!SFX.isOn()); paintSnd(); if (SFX.isOn() && tl && tl.__loop) SFX.loopStart(); });
      SFX.start();
      function close(){
        if (!open) return; open = false; LV.beaten = true;
        if (tl) tl.kill(); document.removeEventListener('keydown', onKey);
        SFX.close(); if (hasGsap) gsap.globalTimeline.timeScale(1);
        if (lenis) lenis.start(); root.style.overflow = '';
        if (hasGsap && !reduce) gsap.to(o, { opacity: 0, duration: .4, onComplete: function(){ o.remove(); } }); else o.remove();
        if (LV.press){ LV.press.textContent = 'Boss defeated · GG'; LV.press.style.animation = 'none'; }
        if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e){}
      }
      function onKey(e){ if (e.key === 'Escape') close(); }
      document.addEventListener('keydown', onKey);
      closeBtn.addEventListener('click', function(e){ e.stopPropagation(); close(); });
      o.addEventListener('click', function(){ if (ended) close(); });
      closeBtn.focus();

      var mon = $('.ab_boss_mon', o), ship = $('.ab_boss_ship', o), hp = $('.ab_boss_hp i', o), arena = $('.ab_boss_arena', o), beam = $('.ab_boss_beam', o);
      var win = $('.ab_boss_win', o), crawl = $('.ab_boss_crawl', o), crawlIn = $('.ab_boss_crawl-in', o), warn = $('.ab_boss_warn', o);
      var bars = $$('.ab_boss_bar', o), vs = $('.ab_boss_vs', o), dim = $('.ab_boss_dim', o), flash = $('.ab_boss_flash', o), hud = $('.ab_boss_hud', o);
      if (reduce || !hasGsap){
        // no fight: straight to the result, credits as a still list
        o.classList.add('is-still'); win.style.opacity = 1; crawl.style.opacity = 1; hp.style.width = '0%'; ended = true; if (AB.quest) AB.quest('boss'); return;
      }
      function shake(n){ gsap.fromTo(arena, { x: (Math.random() - .5) * n, y: (Math.random() - .5) * n }, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.25)' }); }
      function shot(){
        var a = arena.getBoundingClientRect(), s = ship.getBoundingClientRect(), m = mon.getBoundingClientRect();
        var b = document.createElement('i'); b.className = 'ab_boss_laser'; arena.appendChild(b);
        var x = s.left - a.left + s.width / 2, y0 = s.top - a.top, y1 = m.top - a.top + m.height * .6;
        SFX.laser();
        gsap.fromTo(b, { x: x, y: y0 }, { y: y1, duration: .28, ease: 'none', onComplete: function(){ b.remove(); } });
      }
      function hit(pc, big){
        SFX.hit();
        gsap.fromTo(mon, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: .25 });
        shake(big ? 26 : 10);
        hp.style.width = pc + '%';
        var d = document.createElement('span'); d.className = 'ab_boss_dmg'; d.textContent = '-' + (8 + Math.round(Math.random() * 6)); arena.appendChild(d);
        var m = mon.getBoundingClientRect(), a = arena.getBoundingClientRect();
        gsap.fromTo(d, { x: m.left - a.left + m.width * (.2 + Math.random() * .6), y: m.top - a.top + m.height * .3, opacity: 1 }, { y: '-=40', opacity: 0, duration: .8, ease: 'steps(6)', onComplete: function(){ d.remove(); } });
      }
      function blob(dx){
        var a = arena.getBoundingClientRect(), m = mon.getBoundingClientRect(), s = ship.getBoundingClientRect();
        var b = document.createElement('i'); b.className = 'ab_boss_blob'; arena.appendChild(b);
        gsap.fromTo(b, { x: m.left - a.left + m.width / 2, y: m.bottom - a.top }, { x: s.left - a.left + s.width / 2, y: s.top - a.top + 10, duration: .55, ease: 'power1.in', onComplete: function(){ b.remove(); } });
        gsap.to(ship, { x: dx, duration: .3, ease: 'power2.out', delay: .18 });
      }
      // the boss charges a beam straight down its center line; the ship barrel-rolls out of it
      function beamAttack(t){
        t.add(function(){ SFX.charge(); })
          .to(dim, { opacity: .6, duration: .5 }, '<')
          .to(mon, { filter: 'brightness(1.8) drop-shadow(0 0 26px #ff5a6a)', scale: 1.06, duration: 1.1, ease: 'power1.in' }, '<')
          .add(function(){
            var a = arena.getBoundingClientRect(), m = mon.getBoundingClientRect();
            gsap.set(beam, { left: m.left - a.left + m.width / 2, top: m.bottom - a.top - 6, height: a.bottom - m.bottom + 6 });
          })
          .add(function(){ SFX.beam(); SFX.whoosh(); })
          .fromTo(beam, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: .12, ease: 'power2.out' })
          .to(ship, { x: 96, rotationY: 360, duration: .45, ease: 'power2.out' }, '<')
          .add(function(){ shake(18); })
          .to(beam, { scaleX: 0, opacity: 0, duration: .35, ease: 'power2.in' }, '+=.25')
          .to(mon, { filter: 'brightness(1)', scale: 1, duration: .4 }, '<')
          .to(dim, { opacity: 0, duration: .4 }, '<')
          .to(ship, { x: 0, rotationY: 0, duration: .45, ease: 'power2.inOut' }, '+=.1');
      }
      function explode(){
        SFX.loopStop(); SFX.boom(); if (AB.quest) AB.quest('boss');
        var rects = $$('rect', mon);
        rects.forEach(function(r){ gsap.to(r, { x: (Math.random() - .5) * 34, y: (Math.random() - .3) * 30, opacity: 0, duration: 1.1 + Math.random() * .8, ease: 'power2.out' }); });
        gsap.fromTo(flash, { opacity: 1 }, { opacity: 0, duration: 1.2, ease: 'power2.out' });
        shake(40);
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
        .fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .12, repeat: 5, yoyo: true, ease: 'steps(1)' })
        .to(warn, { opacity: 0, duration: .2 })
        .fromTo(arena, { scale: 1.25 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, '<')
        .from(ship, { y: 160, opacity: 0, duration: .7, ease: 'power3.out' }, '<')
        .from(mon, { y: -320, duration: 1, ease: 'bounce.out' }, '<.15')
        .add(function(){ shake(22); }, '-=.35')
        .from(hud, { opacity: 0, y: -10, duration: .4 }, '<')
        .fromTo(hp, { width: '0%' }, { width: '100%', duration: .6, ease: 'steps(10)' })
        .add(function(){ tl.__loop = true; SFX.loopStart(); });
      var HP = 100;
      for (var n = 0; n < 10; n++){
        (function(n){
          var last = n === 9;
          if (last) tl.add(function(){ gsap.globalTimeline.timeScale(.3); o.classList.add('is-slow'); }, '+=.2');
          tl.add(shot, '+=' + (n ? .32 : .3));
          tl.add(function(){ HP = Math.max(0, 100 - (n + 1) * 10); hit(HP, last); }, '+=.28');
          if (last) tl.add(function(){ gsap.globalTimeline.timeScale(1); o.classList.remove('is-slow'); }, '+=.05');
          if (n === 2 || n === 7) tl.add(function(){ blob(n === 7 ? 50 : -50); }, '+=.05').to(ship, { x: 0, duration: .3, ease: 'power2.out' }, '+=.5');
          if (n === 5) beamAttack(tl);
        })(n);
      }
      tl.add(explode, '+=.25')
        .to(hud, { opacity: 0, duration: .4 }, '+=.5')
        .add(function(){ SFX.fanfare(); })
        .fromTo(win, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)', onStart: function(){ ended = true; } }, '<')
        .to(ship, { y: -40, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
        .to(win, { opacity: 0, y: -30, duration: .6 }, '+=3')
        .to(bars, { scaleY: 0, duration: .6, ease: 'power2.in' }, '<')
        .to(ship, { y: -innerHeight, duration: 1.4, ease: 'power2.in' }, '<')
        .to(crawl, { opacity: 1, duration: .5 }, '<')
        .fromTo(crawlIn, { yPercent: 0, y: function(){ return crawl.offsetHeight; } }, { yPercent: -100, y: function(){ return crawl.offsetHeight * .35; }, duration: 22, ease: 'none', onComplete: function(){ ended = true; } });
    };
  })();
