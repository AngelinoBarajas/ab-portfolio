  /* ---------- rows on existing templates: Mission (observations from this mission), Service (further reading) ---------- */
  if (ROW === 'mission' || ROW === 'service') (function(){
    var sec = $('[data-ks-row]'), filed = $('[data-ks-filed]'), mount = $('[data-ks-rownotes]');
    var topics = ROW === 'mission'
      ? $$('[data-ks-src="cur-topics"] [data-ks-t]').map(function(n){ return n.getAttribute('data-slug'); })
      : TOPICS.filter(function(t){ return t.services.indexOf(CUR_SLUG) > -1; }).map(function(t){ return t.slug; });
    var notes = OBS.filter(function(o){ return (ROW === 'mission' ? o.missions : o.services).indexOf(CUR_SLUG) > -1; });
    if (!notes.length && !topics.length){ sec.style.display = 'none'; return; }
    if (filed) filed.innerHTML = topics.length ? '<span class="ab_ks-filed_l">' + (ROW === 'mission' ? 'Filed under' : 'Topics') + '</span>' + topics.map(function(s){ return chip(s); }).join('') : '';
    if (mount){
      if (notes.length){ mount.innerHTML = grid(notes.slice(0, 3)) + (notes.length > 3 ? '<div class="ab_ks-cta">' + btn('/observatory', 'All ' + notes.length + ' observations') + '</div>' : ''); reveal(mount); }
      else { var h = $('.ab_sec-h', sec); if (h) h.style.display = 'none'; }
    }
  })();
