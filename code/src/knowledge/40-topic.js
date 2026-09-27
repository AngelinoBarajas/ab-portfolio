  /* ---------- /topics/[slug]: the topic page ---------- */
  if (VIEW === 'topic') (function(){
    var T = TOPIC[CUR_SLUG]; if (!T) return;
    if (CUR.getAttribute('data-cat')) T.cat = catKey(CUR.getAttribute('data-cat'));
    var C = CAT[T.cat], tNotes = notesFor(T.slug), tMis = MIS /* the Missions list on this template resolves to the topic's own Missions field */, tFaq = FAQ.filter(function(q){ return q.topics.indexOf(T.slug) > -1; });
    var sibs = TOPICS.filter(function(t){ return t.cat === T.cat; });

    var eb = $('[data-ks-eyebrow]'); if (eb) eb.textContent = C.code + ' · ' + C.name + ' · constellation ' + pad2(C.i + 1) + ' of 06';
    var h1 = $('[data-ks-title]');
    if (h1){ var w = h1.textContent.trim().split(' '); h1.innerHTML = w.length > 1 ? '<span class="ab_dbh_word">' + esc(w.slice(0, -1).join(' ')) + '</span> <span class="ab_dbh_word t-outline">' + esc(w[w.length - 1]) + '</span>' : '<span class="ab_dbh_word">' + esc(w[0]) + '</span>'; }

    // mini constellation: this category only, re-centered on its center
    var mini = $('[data-ks-mini]'), cx0 = CENTER[T.cat];
    if (mini && POS[T.slug]){
      mini.setAttribute('data-cat', T.cat);
      mini.innerHTML = '<svg viewBox="-250 -130 480 270" aria-hidden="true"><path class="cl" d="' + consPath(T.cat, cx0[0], cx0[1]) + '"/>' +
        sibs.map(function(t){ var p = POS[t.slug]; if (!p) return ''; var x = p[0] - cx0[0], y = p[1] - cx0[1], on = t === T, r = starR(t), R = SIDE[t.slug] === 'R';
          return '<g class="' + (on ? 'is-on' : '') + '">' + (on ? '<circle class="st-p" cx="' + x + '" cy="' + y + '" r="' + r + '"/><circle class="st-r" cx="' + x + '" cy="' + y + '" r="' + (r + 5) + '"/>' : '') +
            '<circle class="st" cx="' + x + '" cy="' + y + '" r="' + r + '"/><text class="tl" x="' + (R ? x + r + 7 : x - r - 7) + '" y="' + (y + 3) + '" text-anchor="' + (R ? 'start' : 'end') + '">' + esc(t.name) + '</text></g>'; }).join('') + '</svg>';
    }
    var stats = $('[data-ks-tstats]');
    if (stats) stats.innerHTML = [['Observations', tNotes.length, '#notes'], ['Missions', tMis.length, '#practice'], ['Services', SVC.length, '#services'], ['Questions', tFaq.length, '#questions']]
      .map(function(s){ return s[1] ? '<a class="ab_ks-tstat" href="' + s[2] + '"><span>' + s[0] + '</span><b>' + pad2(s[1]) + '</b></a>' : '<div class="ab_ks-tstat is-zero"><span>' + s[0] + '</span><b>00</b></div>'; }).join('');

    var el;
    if ((el = $('[data-ks-practice]')) && tMis.length){
      el.innerHTML = '<div class="ab_ks-mis">' + tMis.map(function(m){
        return '<a class="ab_ks-mcard" href="' + m.href + '">' + planet(m, PSEED++, 'is-mp') + '<div><span class="ab_ks-mcard_k">Mission ' + m.no + ' · ' + esc(m.client) + '</span><h3 class="ab_ks-mcard_h">' + esc(m.name) + '</h3><p class="ab_ks-mcard_p">' + esc(m.sum) + '</p><em class="ab_ks-mcard_go">Open the debrief →</em></div></a>';
      }).join('') + '</div>'; buildPlanets(el); reveal(el);
    } else hideSec('[data-ks-sec="practice"]');
    if ((el = $('[data-ks-services]')) && SVC.length){
      el.innerHTML = '<ul class="ab_ks-svc">' + SVC.map(function(s){
        return '<li class="ab_ks-svc_row"><a href="' + s.href + '">' + planet(s, PSEED++, 'is-lg') + '<div><h3 class="ab_ks-svc_h">' + esc(s.t1) + ' <span class="t-outline">' + esc(s.t2) + '</span></h3><p class="ab_ks-svc_p">' + esc(s.sum) + '</p></div><span class="ab_ks-go" aria-hidden="true">→</span></a></li>';
      }).join('') + '</ul>'; buildPlanets(el); reveal(el);
    } else hideSec('[data-ks-sec="services"]');
    if ((el = $('[data-ks-notes]')) && tNotes.length){ el.innerHTML = grid(tNotes); reveal(el); } else hideSec('[data-ks-sec="notes"]');
    if ((el = $('[data-ks-faq]')) && tFaq.length){
      el.innerHTML = '<div class="ab_ks-faq">' + tFaq.map(function(q){ return '<details class="ab_ks-faq_i"><summary><span>' + esc(q.q) + '</span><span class="ab_ks-faq_pm" aria-hidden="true">+</span></summary><p>' + esc(q.a) + '</p></details>'; }).join('') + '</div>';
      $$('details', el).forEach(function(d){ d.addEventListener('toggle', function(){ d.classList.toggle('is-open', d.open); if (AB.lenis && AB.lenis.resize) AB.lenis.resize(); }); });
    } else hideSec('[data-ks-sec="questions"]');
    if ((el = $('[data-ks-near]'))){
      el.innerHTML = '<div class="ab_ks-box_h is-near"><span>Nearby stars · ' + esc(C.name) + '</span><a href="/topics">Full star chart →</a></div><div class="ab_ks-chips">' +
        sibs.filter(function(t){ return t !== T; }).map(function(t){ return chip(t.slug); }).join('') + '</div>';
    }
    document.title = T.name + ' · Topics · Angelino Barajas';
  })();
