  /* ---------- mission cards (Work archive + Services related missions): covers, colors, number, status, link ----------
     The card markup is the Work page's Missions Collection item (.ab_mission-card); Services clones those cards from /work. */
  function markSVG(){
    return '<svg viewBox="-120 -120 240 240" aria-hidden="true"><g class="lg-grid"><circle class="lg-g" r="100"/><circle class="lg-g" r="61.8"/><circle class="lg-g" r="38.2"/><circle class="lg-g" cx="61.8" r="38.2"/><circle class="lg-g" cx="-38.2" cy="-38.2" r="23.6"/><path class="lg-g" d="M-110 0H110M0 -110V110M-78 -78L78 78M-78 78L78 -78"/></g>' +
      '<g font-family="JetBrains Mono,monospace" font-size="6" fill="#4C8DFF"><text x="-104" y="-92">R 100</text><text x="-58" y="-50">R 61.8</text><text x="46" y="-40">R 38.2</text><text x="40" y="26" fill="#FF6A3D">30 × 30</text></g>' +
      '<path class="lg-m" d="M 0 -61.8 A 61.8 61.8 0 1 0 61.8 0"/><g class="lg-orbit"><rect class="lg-s" x="47" y="-15" width="30" height="30"/></g></svg>';
  }
  // cover art for missions without a cover image (cover kind Mark / Brand / App / Site)
  function coverHTML(m){
    var word = esc((m.name.split(/\s+/)[0] || '').toUpperCase()), rest = esc(m.name.split(/\s+/).slice(1).join(' '));
    if (m.kind === 'mark') return markSVG();
    if (m.kind === 'brand') return '<div class="cb-bag"><i></i><b>' + word + '</b><span>' + (rest ? rest + ' · ' : '') + 'Est. ' + esc(m.year) + '</span></div><div class="cb-bag two"><i></i><b>' + word + '</b><span>Single origin</span></div>';
    if (m.kind === 'app') return '<div class="ca-ph"><div class="ca-top"><b>Today</b><i></i></div><div class="ca-ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/><circle class="v" cx="20" cy="20" r="16"/></svg><span>12<small>day streak</small></span></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div></div><div class="ca-ph back"><div class="ca-top"><b>Classes</b></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div><div class="ca-row"><i></i><i></i></div></div>';
    if (m.kind === 'site') return '<div class="cs-nav"><b>' + word + '</b><i></i><i></i><i></i></div><div class="cs-grid"><div class="cs-h">Buildings that<br>hold the light.</div><div class="cs-img"></div><div class="cs-img b"></div><div class="cs-img c"></div></div>';
    return '';
  }
  function cardTxt(sel, root){ var n = $(sel, root); return n ? n.textContent.trim() : ''; }
  function cardColor(node, prop){ return node ? rgbToHex(getComputedStyle(node)[prop]) : ''; }

  function missionCard(card, i){
    var a = $('[data-card-link]', card), cv = $('.ab_mission-card_cv', card), img = $('img', cv);
    var m = {
      el: card, a: a, cv: cv, i: i,
      slug: a.getAttribute('data-slug') || '', name: cardTxt('.ab_mission-card_title', card), client: cardTxt('.ab_mission-card_client', card),
      year: cardTxt('[data-card="year"]', card), status: a.getAttribute('data-status') || cardTxt('[data-card="status"]', card),
      kind: (a.getAttribute('data-cover-kind') || '').toLowerCase(),
      types: $$('.ab_mission-card_tag', card).map(function(t){ return t.textContent.trim(); }).filter(Boolean)
    };
    m.placeholder = /placeholder/i.test(m.status); m.live = /live/i.test(m.status);
    m.no = pad2(i + 1);
    // brand colors come from hidden nodes whose style is bound to the CMS Color fields in the Designer
    var bg = cardColor($('[data-field="brand-bg"]', card), 'backgroundColor'), fg = cardColor($('[data-field="brand-fg"]', card), 'color'), ac = cardColor($('[data-field="brand-accent"]', card), 'backgroundColor');
    cv.style.setProperty('--cbg', bg || '#161a2e'); cv.style.setProperty('--cfg', fg || '#F2F0EA'); cv.style.setProperty('--cac', ac || '#FF6A3D');
    // cover: the bound image when there is one, otherwise drawn from the cover kind
    var hasImg = img && img.getAttribute('src') && !/placeholder/i.test(img.getAttribute('src')) && !img.closest('.w-condition-invisible');
    if (hasImg){ m.kind = 'img'; img.alt = ''; }
    else { if (img) img.remove(); if (!m.kind || m.kind === 'image') m.kind = 'site'; cv.insertAdjacentHTML('beforeend', coverHTML(m)); }
    cv.classList.add('is-' + m.kind);
    // number, planet seed, status chip, link
    var no = $('.ab_mission-card_no', card); if (no) no.textContent = m.no;
    var pl = $('.ab_planet', card); if (pl){ pl.setAttribute('data-seed', i * 7 + 3); if (!pl.getAttribute('data-ring')) pl.removeAttribute('data-ring'); else pl.setAttribute('data-tilt', '-16'); if (!pl.getAttribute('data-glow')) pl.setAttribute('data-glow', 'transparent'); }
    var st = $('.ab_status', card); if (st) st.setAttribute('data-state', m.placeholder ? 'phd' : m.live ? 'live' : 'ship');
    card.setAttribute('data-types', m.types.join('|'));
    if (a.__sel){ var tag = $('.sel-tag', a.__sel); if (tag) tag.textContent = 'Frame / ' + m.slug; }
    if (m.placeholder){
      card.classList.add('is-ph'); a.setAttribute('href', '#'); a.setAttribute('data-ph', '');
      a.setAttribute('aria-label', m.name + ' (placeholder)');
      var go = $('.ab_mission-card_go', card); if (go) go.innerHTML = 'Debrief pending <span class="ab_mission-card_arrow" aria-hidden="true">→</span>';
    } else {
      a.setAttribute('href', '/work/' + m.slug); a.setAttribute('aria-label', m.name + ', open the mission debrief');
    }
    return m;
  }
  Object.assign(AB, { markSVG: markSVG, missionCard: missionCard });
