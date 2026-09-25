
  /* ---------- mission sequence (Process: 6 static steps → pinned flight path) ---------- */
  (function initMission(){
    var mission = $('#log'); if (!mission || !hasGsap) return;
    // embedded viewers can report a 0-size viewport at load: wait for a real size before picking the layout
    if (innerWidth < 100 || innerHeight < 100){ var once = function(){ if (innerWidth < 100 || innerHeight < 100) return; removeEventListener('resize', once); initMission(); ScrollTrigger.refresh(); }; addEventListener('resize', once); return; }
    var modeOf = function(){ return innerWidth > 900 ? 'wide' : 'narrow'; }, mode0 = modeOf(), rzT;
    addEventListener('resize', function(){ clearTimeout(rzT); rzT = setTimeout(function(){ if (modeOf() !== mode0) location.reload(); }, 400); });
    var lis = $$('.ab_process_step', mission);
    if (!lis.length) return;
    var steps = lis.map(function(li){
      var t = $('.ab_process_step-title', li), p = $('.ab_process_step-text', li);
      return { name: t ? t.textContent.trim() : '', code: li.getAttribute('data-code') || '', copy: p ? p.textContent.trim() : '', deliv: li.getAttribute('data-deliverable') || '', you: li.getAttribute('data-you') || '', check: (li.getAttribute('data-check') || '').split('|').filter(Boolean) };
    });
    var N = steps.length, wide = innerWidth > 900, vert = !wide && innerHeight >= 560 && !reduce;
    var list = $('.ab_process_steps', mission);
    if (!wide && !vert){
      lis.forEach(function(li){ ScrollTrigger.create({ trigger: li, start: 'top 70%', onEnter: function(){ li.classList.add('is-on'); }, onLeaveBack: function(){ li.classList.remove('is-on'); } }); });
      var rail = document.createElement('div'); rail.className = 'rail'; rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = '<i class="rail-fill"></i><span class="rail-ship"><svg viewBox="-32 -12 50 24"><path class="flame" d="M-14 -3 L-30 0 L-14 3 Z"/><rect x="-14" y="-5" width="20" height="10" fill="#F2F0EA"/><path d="M6 -5 L16 0 L6 5 Z" fill="#FF6A3D"/><path d="M-12 -5 L-8 -11 L-4 -5 Z M-12 5 L-8 11 L-4 5 Z" fill="#FF6A3D"/><rect x="-4" y="-2" width="4" height="4" fill="#07080D"/></svg></span>';
      list.appendChild(rail);
      var fill = $('.rail-fill', rail), rship = $('.rail-ship', rail);
      ScrollTrigger.create({ trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: reduce ? false : .6, onUpdate: function(self){ var pc = (self.progress * 100) + '%'; fill.style.height = pc; rship.style.top = pc; } });
      return;
    }
    var NS = 'http://www.w3.org/2000/svg', svg, wrap, ahead, done, ship, wpsG, L;
    var F = steps.map(function(s, i){ return .06 + i * (.88 / (N - 1)); });
    var SNAP = F.map(function(f){ return (f - F[0]) / (F[N - 1] - F[0]); });
    var wps = [], labels = [], proxy = { p: 0 };
    if (vert){
      // ---- vertical flight path for phones and tablets ----
      mission.classList.add('is-vert');
      var panel = $('.ab_process_panel', mission), vg = document.createElement('div'), vt = document.createElement('div');
      vg.className = 'vgrid'; vt.className = 'vtraj'; panel.parentNode.insertBefore(vg, panel); vg.appendChild(vt); vg.appendChild(panel);
      vt.innerHTML = '<svg class="vsvg"><defs><linearGradient id="vStartBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fe0ff"/><stop offset=".5" stop-color="#1e6e8c"/><stop offset="1" stop-color="#0b2f4d"/></linearGradient><linearGradient id="vEndBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd29a"/><stop offset=".55" stop-color="#e0703e"/><stop offset="1" stop-color="#5a2412"/></linearGradient></defs><circle class="vstart" r="9" fill="url(#vStartBody)" style="filter:drop-shadow(0 0 8px rgba(92,200,255,.6))"/><g class="vend" style="filter:drop-shadow(0 0 10px rgba(255,106,61,.55))"><circle r="11" fill="url(#vEndBody)"/><ellipse rx="19" ry="4.5" fill="none" stroke="#ffd29a" stroke-opacity=".7" stroke-width="1.5" transform="rotate(-14)"/></g>' +
        '<path class="ahead"/><path class="done"/><g class="wps"></g>' + $('.ab_process_traj-svg .ship', mission).outerHTML + '</svg>';
      svg = $('svg', vt); ahead = $('.ahead', svg); done = $('.done', svg); ship = $('.ship', svg); wpsG = $('.wps', svg);
      steps.forEach(function(s, i){
        var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'wp'); g.style.cursor = 'pointer';
        g.innerHTML = '<circle class="pulse" r="11"/><circle class="ring" r="11"/><text class="wp-n" text-anchor="middle" dy="3.2">' + pad2(i + 1) + '</text>';
        g.addEventListener('click', function(){ go(i); }); wpsG.appendChild(g); wps.push(g);
      });
      var layoutV = function(){
        var W = vt.clientWidth, H = vt.clientHeight, cx = W / 2, y0 = 30, y3 = H - 34, xa = W * .2, xb = W * .8, dy = (y3 - y0) / 7;
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        var d = 'M ' + cx + ' ' + y0 + ' C ' + xa + ' ' + (y0 + dy) + ', ' + xa + ' ' + (y0 + dy * 1.5) + ', ' + xa + ' ' + (y0 + dy * 2.3) +
          ' S ' + xb + ' ' + (y0 + dy * 3.6) + ', ' + xb + ' ' + (y0 + dy * 4.4) + ' S ' + cx + ' ' + (y3 - dy * .4) + ', ' + cx + ' ' + y3;
        ahead.setAttribute('d', d); done.setAttribute('d', d); L = ahead.getTotalLength();
        done.style.strokeDasharray = L;
        $('.vstart', svg).setAttribute('cx', cx); $('.vstart', svg).setAttribute('cy', y0 - 16);
        $('.vend', svg).setAttribute('transform', 'translate(' + cx + ' ' + (y3 + 20) + ')');
        wps.forEach(function(g, i){ var pt = ahead.getPointAtLength(F[i] * L); g.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')'); });
      };
      layoutV();
      addEventListener('resize', function(){ layoutV(); setP(proxy.p); });
    } else {
      mission.classList.add('is-wide');
      svg = $('.ab_process_traj-svg', mission); wrap = $('.ab_process_traj', mission);
      ahead = $('.ahead', svg); done = $('.done', svg); ship = $('.ship', svg); wpsG = $('.wps', svg); L = ahead.getTotalLength();
      done.style.strokeDasharray = L; done.style.strokeDashoffset = L;
      steps.forEach(function(s, i){
        var pt = ahead.getPointAtLength(F[i] * L), g = document.createElementNS(NS, 'g');
        g.setAttribute('class', 'wp'); g.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
        g.innerHTML = '<circle class="pulse" r="10"/><circle class="ring" r="10"/><rect class="core" x="-3.5" y="-3.5" width="7" height="7"/>';
        wpsG.appendChild(g); wps.push(g);
        var b = document.createElement('button'); b.type = 'button'; b.className = 'wp-label';
        b.innerHTML = pad2(i + 1) + ' · ' + esc(s.code) + '<b>' + esc(s.name) + '</b>';
        b.style.left = (pt.x / 1200 * 100) + '%';
        var above = pt.y > 150; b.style.top = above ? 'calc(' + (pt.y / 280 * 100) + '% - 64px)' : 'calc(' + (pt.y / 280 * 100) + '% + 16px)';
        b.addEventListener('click', function(){ go(i); });
        wrap.appendChild(b); labels.push(b);
      });
      wrap.removeAttribute('aria-hidden');
    }
    function setShip(frac){
      var l = frac * L, a = ahead.getPointAtLength(Math.max(0, l - 1)), b = ahead.getPointAtLength(Math.min(L, l + 1)), p = ahead.getPointAtLength(l);
      var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      ship.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + ang + ')');
      done.style.strokeDashoffset = L - l;
    }
    var cur = -1, ticks = [];
    var el = { num: $('#mpNum'), code: $('#mpCode'), title: $('#mpTitle'), copy: $('#mpCopy'), deliv: $('#mpDeliv'), you: $('#mpYou'), check: $('#mpCheck'), bar: $('#mpBar'), pct: $('#mpPct'), prev: $('#mpPrev'), next: $('#mpNext') };
    function setStage(i){
      if (i === cur) return; cur = i; var s = steps[i];
      wps.forEach(function(w, k){ w.classList.toggle('done', k < i); w.classList.toggle('active', k === i); });
      labels.forEach(function(b, k){ b.classList.toggle('active', k === i); });
      el.num.textContent = pad2(i + 1); el.code.textContent = s.code.toUpperCase();
      el.title.textContent = s.name; el.copy.textContent = s.copy; el.deliv.textContent = s.deliv; el.you.textContent = s.you;
      el.check.innerHTML = s.check.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('');
      ticks.forEach(clearTimeout); ticks = [];
      $$('li', el.check).forEach(function(li, k){ ticks.push(setTimeout(function(){ li.classList.add('done'); }, reduce ? 0 : 350 + k * 320)); });
      el.prev.disabled = i === 0; el.next.disabled = i === N - 1;
      if (!reduce){
        gsap.fromTo([el.title, el.copy, el.deliv, el.you], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .45, stagger: .05, ease: 'power2.out', overwrite: true });
        gsap.to(el.title, { duration: .6, scrambleText: { text: s.name, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', speed: .8 } });
      }
    }
    function setP(p){
      var frac = F[0] + p * (F[N - 1] - F[0]); setShip(frac);
      var i = 0; for (var k = 0; k < N; k++) if (frac >= F[k] - .02) i = k;
      setStage(i); el.bar.style.width = (p * 100) + '%'; el.pct.textContent = Math.round(p * 100) + '%';
    }
    var st = null;
    setP(0);
    if (!reduce){
      st = ScrollTrigger.create({ trigger: mission, start: 'top top', end: function(){ return '+=' + Math.round(innerHeight * 2.6); }, pin: true, refreshPriority: 10,
        snap: { snapTo: SNAP, duration: { min: .25, max: .7 }, delay: .12, ease: 'power2.inOut' },
        onToggle: function(self){ var nav = $('#nav'); if (self.isActive && nav) nav.classList.remove('is-hidden'); },
        onUpdate: function(self){ gsap.to(proxy, { p: self.progress, duration: .45, ease: 'power2.out', overwrite: true, onUpdate: function(){ setP(proxy.p); } }); } });
      window.__abMissionST = st;
      ScrollTrigger.refresh();
    }
    function go(i){
      i = Math.max(0, Math.min(N - 1, i));
      if (st){ var y = st.start + (st.end - st.start) * SNAP[i]; if (lenis) lenis.scrollTo(y, { duration: 1.3 }); else window.scrollTo({ top: y, behavior: 'smooth' }); }
      else gsap.to(proxy, { p: SNAP[i], duration: reduce ? 0 : 1, ease: 'power2.inOut', onUpdate: function(){ setP(proxy.p); } });
    }
    el.prev.addEventListener('click', function(){ go(cur - 1); });
    el.next.addEventListener('click', function(){ go(cur + 1); });
  })();
