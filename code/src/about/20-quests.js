  /* ---------- side quests log: a line on the Player one card ("Side quests") opens the list; every find ticks
     off live; all found turns the crew badge gold. Unfound quests show only a hint ---------- */
  (function(){
    var Q = AB.quest, gm = $('[data-gm]'); if (!Q || !gm) return;
    var card = gm.closest('.ab_bento-card'), copy = card && $('.ab_bento-card_copy', card); if (!copy) return;
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'abx-qlog';
    copy.appendChild(btn);
    var panel = null, badge = $('[data-badge]'), prevFocus = null;
    function N(){ return Q.list.length; }
    function paintBtn(){ btn.innerHTML = '✦ Quest log · <b>' + Q.count() + '/' + N() + '</b>'; btn.setAttribute('aria-label', 'Open the side quest log, ' + Q.count() + ' of ' + N() + ' found'); }
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
    document.addEventListener('ab:quest', function(){ paintBtn(); gold(); render(); });
    paintBtn(); gold();
  })();
