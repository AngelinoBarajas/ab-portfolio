  /* =========================================================
     PLAYER ONE · secret: reach LV 20 (or enter the cheat) and the card opens a boss fight. Your ship takes down
     THE SCOPE CREEP, "You won" + a win line, then a credits crawl. Esc, the × button, or a tap at the end closes it.
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
    var open = false;
    LV.boss = function(){
      if (open || LV.beaten) return; open = true;
      var lenis = AB.lenis, root = document.documentElement;
      var o = document.createElement('div'); o.className = 'ab_boss'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', 'Boss fight: The Scope Creep');
      o.innerHTML = '<div class="ab_boss_stars" aria-hidden="true"></div>' +
        '<button type="button" class="ab_boss_x" aria-label="Close the boss fight">Skip ×</button>' +
        '<div class="ab_boss_hud"><span class="ab_boss_name">Boss · The Scope Creep</span><span class="ab_boss_hp"><i></i></span></div>' +
        '<div class="ab_boss_warn">Warning · boss approaching</div>' +
        '<div class="ab_boss_arena">' + sprite(BOSS, COL, 'ab_boss_mon') + sprite(SHIP, SCOL, 'ab_boss_ship') + '</div>' +
        '<div class="ab_boss_win"><b>You won</b><p>LV ' + LV.BOSS + ' · The Scope Creep is defeated. The project shipped on time, on budget, and nobody asked for “just one more thing.”</p></div>' +
        '<div class="ab_boss_crawl" aria-hidden="true"><div class="ab_boss_crawl-in">' +
          CREDITS.map(function(c){ return '<div class="ab_boss_cr">' + (c[0] ? '<small>' + esc(c[0]) + '</small>' : '') + '<span>' + esc(c[1]) + '</span></div>'; }).join('') +
          '<div class="ab_boss_cr is-end"><span>The end</span><small>Tap anywhere to return</small></div></div></div>' +
        '<ul class="ab_sr">' + CREDITS.map(function(c){ return '<li>' + esc((c[0] ? c[0] + ': ' : '') + c[1]) + '</li>'; }).join('') + '</ul>';
      document.body.appendChild(o);
      if (lenis) lenis.stop(); root.style.overflow = 'hidden';
      var closeBtn = $('.ab_boss_x', o), prevFocus = document.activeElement, tl = null, ended = false;
      function close(){
        if (!open) return; open = false; LV.beaten = true;
        if (tl) tl.kill(); document.removeEventListener('keydown', onKey);
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

      var mon = $('.ab_boss_mon', o), ship = $('.ab_boss_ship', o), hp = $('.ab_boss_hp i', o), arena = $('.ab_boss_arena', o);
      var win = $('.ab_boss_win', o), crawl = $('.ab_boss_crawl', o), crawlIn = $('.ab_boss_crawl-in', o), warn = $('.ab_boss_warn', o);
      if (reduce || !hasGsap){
        // no fight: straight to the result, credits as a still list
        o.classList.add('is-still'); win.style.opacity = 1; crawl.style.opacity = 1; hp.style.width = '0%'; ended = true; return;
      }
      function shot(){
        var a = arena.getBoundingClientRect(), s = ship.getBoundingClientRect(), m = mon.getBoundingClientRect();
        var b = document.createElement('i'); b.className = 'ab_boss_laser'; arena.appendChild(b);
        var x = s.left - a.left + s.width / 2, y0 = s.top - a.top, y1 = m.top - a.top + m.height * .6;
        gsap.fromTo(b, { x: x, y: y0 }, { y: y1, duration: .28, ease: 'none', onComplete: function(){ b.remove(); } });
      }
      function hit(pc){
        gsap.fromTo(mon, { filter: 'brightness(3)' }, { filter: 'brightness(1)', duration: .25 });
        gsap.fromTo(mon, { x: -6 }, { x: 0, duration: .3, ease: 'elastic.out(1,.3)' });
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
      function explode(){
        var rects = $$('rect', mon);
        rects.forEach(function(r){ gsap.to(r, { x: (Math.random() - .5) * 30, y: (Math.random() - .3) * 26, opacity: 0, duration: 1 + Math.random() * .6, ease: 'power2.out' }); });
        gsap.fromTo(o, { backgroundColor: '#F2F0EA' }, { backgroundColor: '#07080d', duration: .5 });
        gsap.fromTo(arena, { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1,.2)' });
      }
      tl = gsap.timeline();
      tl.from(o, { opacity: 0, duration: .35 })
        .fromTo(warn, { opacity: 0 }, { opacity: 1, duration: .12, repeat: 5, yoyo: true, ease: 'steps(1)' })
        .to(warn, { opacity: 0, duration: .2 })
        .from(ship, { y: 160, opacity: 0, duration: .7, ease: 'power3.out' }, '<')
        .from(mon, { y: -300, duration: 1, ease: 'bounce.out' }, '<.1')
        .from($('.ab_boss_hud', o), { opacity: 0, y: -10, duration: .4 }, '<.4')
        .fromTo(hp, { width: '0%' }, { width: '100%', duration: .6, ease: 'steps(10)' });
      var HP = 100;
      for (var n = 0; n < 10; n++){
        (function(n){
          tl.add(shot, '+=' + (n ? .32 : .3));
          tl.add(function(){ HP = Math.max(0, 100 - (n + 1) * 10); hit(HP); }, '+=.28');
          if (n === 2 || n === 5 || n === 8) tl.add(function(){ blob(n === 5 ? 50 : -50); }, '+=.05').to(ship, { x: 0, duration: .3, ease: 'power2.out' }, '+=.5');
        })(n);
      }
      tl.add(explode, '+=.2')
        .to($('.ab_boss_hud', o), { opacity: 0, duration: .4 }, '+=.4')
        .fromTo(win, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2)' })
        .to(ship, { y: -40, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, '<')
        .to(win, { opacity: 0, y: -30, duration: .6 }, '+=3')
        .to(crawl, { opacity: 1, duration: .5 }, '<')
        .fromTo(crawlIn, { yPercent: 0, y: function(){ return crawl.offsetHeight; } }, { yPercent: -100, y: function(){ return crawl.offsetHeight * .35; }, duration: 22, ease: 'none', onComplete: function(){ ended = true; } });
    };
  })();
