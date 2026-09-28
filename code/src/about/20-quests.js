  /* ---------- side quests log: a line on the Player one card ("Side quests") opens the list; every find ticks
     off live; all found turns the crew badge gold. Unfound quests show only a hint ---------- */
  (function(){
    var Q = AB.quest, gm = $('[data-gm]'); if (!Q || !gm) return;
    var card = gm.closest('.ab_bento-card'), copy = card && $('.ab_bento-card_copy', card); if (!copy) return;
    // on the card: a segmented progress bar (one segment per quest) and a live feed of the latest finds, with hints
    // for unfound quests cycling in the spare lines
    var qx = document.createElement('div'); qx.className = 'abx-qx';
    qx.innerHTML = '<div class="abx-qx_top"><span>Side quests</span><b></b></div><div class="abx-qx_bar" aria-hidden="true"></div><ul class="abx-qx_feed" aria-live="polite"></ul>';
    copy.appendChild(qx);
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'abx-qlog';
    copy.appendChild(btn);
    var panel = null, badge = $('[data-badge]'), prevFocus = null;
    function N(){ return Q.list.length; }
    function paintBtn(){ btn.innerHTML = '✦ Quest log · <b>' + Q.count() + '/' + N() + '</b>'; btn.setAttribute('aria-label', 'Open the side quest log, ' + Q.count() + ' of ' + N() + ' found'); }
    var FEED = 3, hintI = 0, found = {};
    try { found = JSON.parse(localStorage.getItem('ab:quests') || '{}') || {}; } catch (e){ found = {}; }
    function ago(t){ var m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? 'just now' : m < 60 ? m + 'm ago' : m < 1440 ? Math.round(m / 60) + 'h ago' : Math.round(m / 1440) + 'd ago'; }
    function paintQx(fresh){
      var n = Q.count(), N0 = N();
      $('.abx-qx_top b', qx).textContent = n + '/' + N0 + ' · ' + Math.round(n / N0 * 100) + '%';
      var bar = $('.abx-qx_bar', qx);
      if (bar.children.length !== N0) bar.innerHTML = Q.list.map(function(){ return '<i></i>'; }).join('');
      Q.list.forEach(function(q, i){ var seg = bar.children[i], on = Q.has(q[0]); seg.classList.toggle('is-on', on); seg.classList.toggle('is-new', q[0] === fresh); });
      // latest finds first (timestamps from the log), then hints for what is left
      var done = Q.list.filter(function(q){ return Q.has(q[0]); }).sort(function(a, b){ return (found[b[0]] || 0) - (found[a[0]] || 0); }).slice(0, Q.count() < N() ? FEED - 1 : FEED);
      var left = Q.list.filter(function(q){ return !Q.has(q[0]); }), rows = done.map(function(q){ return '<li class="is-done' + (q[0] === fresh ? ' is-new' : '') + '"><i>✓</i><span>' + esc(q[1]) + '</span><em>' + ago(found[q[0]] || Date.now()) + '</em></li>'; });
      for (var k = 0; rows.length < FEED && left.length; k++){ var h = left[(hintI + k) % left.length]; rows.push('<li class="is-hint"><i>◇</i><span>' + esc(h[2]) + '</span></li>'); if (k >= left.length - 1) break; }
      if (!rows.length) rows.push('<li class="is-hint"><i>✦</i><span>Every quest found. Badge: gold.</span></li>');
      $('.abx-qx_feed', qx).innerHTML = rows.join('');
      if (fresh && hasGsap && !reduce){ var nw = $('.abx-qx_feed li.is-new', qx); if (nw) gsap.from(nw, { x: -12, opacity: 0, duration: .5, ease: 'power3.out' }); }
    }
    // hints rotate while the card is on screen
    var hintT = null;
    function spin(on){ clearInterval(hintT); if (on && !reduce) hintT = setInterval(function(){ if (Q.count() < N()){ hintI++; var hs = $$('.abx-qx_feed li.is-hint', qx); if (hasGsap && hs.length) gsap.to(hs, { opacity: 0, duration: .25, onComplete: function(){ paintQx(); gsap.from($$('.abx-qx_feed li.is-hint', qx), { opacity: 0, y: 4, duration: .35 }); } }); else paintQx(); } }, 4200); }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ spin(es[0].isIntersecting); }).observe(qx); else spin(true);
    function gold(){ if (badge) badge.classList.toggle('is-gold', Q.count() === N()); }
    function render(){
      if (!panel) return;
      var n = Q.count();
      $('.abx-qp_h span', panel).textContent = 'Side quests · ' + n + '/' + N();
      $('.abx-qp_bar i', panel).style.width = (n / N() * 100) + '%';
      $('.abx-qp_gold', panel).hidden = n !== N();
      $('.abx-qp_list', panel).innerHTML = Q.list.map(function(q){
        var d = Q.has(q[0]);
        return '<li class="' + (d ? 'is-done' : '') + '"><i aria-hidden="true">' + (d ? '✓' : '◇') + '</i><div><b>' + (d ? esc(q[1]) : 'Unknown quest') + '</b><span>' + esc(q[2]) + '</span></div></li>';
      }).join('');
    }
    function close(){ if (!panel) return; panel.classList.remove('is-on'); document.removeEventListener('keydown', onKey); if (AB.lenis) AB.lenis.start(); document.documentElement.style.overflow = ''; if (prevFocus) try { prevFocus.focus(); } catch (e){} }
    function onKey(e){ if (e.key === 'Escape') close(); }
    function open(){
      if (!panel){
        panel = document.createElement('div'); panel.className = 'abx-qp'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Side quest log');
        panel.innerHTML = '<div class="abx-qp_box" data-lenis-prevent><div class="abx-qp_h"><span></span><button type="button" class="abx-qp_x" aria-label="Close the quest log">×</button></div>' +
          '<div class="abx-qp_t">Side quests</div><div class="abx-qp_note">Little things hidden around the site. Finds are saved in this browser.</div>' +
          '<div class="abx-qp_bar" aria-hidden="true"><i></i></div><div class="abx-qp_gold" hidden>Every side quest found. Your crew badge on this page just went gold. Thanks for playing, Player One.</div>' +
          '<ul class="abx-qp_list"></ul><button type="button" class="abx-qp_reset">Reset the log</button></div>';
        document.body.appendChild(panel);
        $('.abx-qp_x', panel).addEventListener('click', close);
        panel.addEventListener('click', function(e){ if (e.target === panel) close(); });
        $('.abx-qp_reset', panel).addEventListener('click', function(){ Q.reset(); toast('Quest log reset'); });
      }
      prevFocus = document.activeElement; render();
      panel.classList.add('is-on'); document.addEventListener('keydown', onKey);
      if (AB.lenis) AB.lenis.stop(); document.documentElement.style.overflow = 'hidden';
      setTimeout(function(){ var x = $('.abx-qp_x', panel); if (x) x.focus(); }, 60);
    }
    btn.addEventListener('click', function(e){ e.stopPropagation(); open(); });
    document.addEventListener('ab:quest', function(e){
      var id = e.detail && e.detail.id;
      try { found = JSON.parse(localStorage.getItem('ab:quests') || '{}') || {}; } catch (er){}
      paintBtn(); gold(); render(); paintQx(id);
    });
    paintBtn(); gold(); paintQx();
  })();
