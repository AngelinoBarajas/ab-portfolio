  /* ---------- problems solved: strike the anomaly, reveal the fix ---------- */
  var SOLVES = $$('.ab_sv_s').filter(function(c){
    if (!txt('.ab_sv_s_h', c) && !txt('.ab_sv_s_p', c)){ c.remove(); return false; }
    var p = $('.ab_sv_s_p', c); if (p && !$('span', p)) p.innerHTML = '<span>' + esc(p.textContent.trim()) + '</span>';
    return true;
  });
  inView(SOLVES, function(c, i){
    setTimeout(function(){ c.classList.add('on'); setTimeout(function(){ var b = $('.ab_sv_s_before', c); if (b) b.textContent = '● Fixed'; }, reduce ? 0 : 900); }, reduce ? 0 : i * 220);
  }, { threshold: .5 });

  /* ---------- what's included: icons from the CMS option, checks tick in ---------- */
  var ICON = {
    map: '<path d="M6 10l10-4 12 4 10-4v28l-10 4-12-4-10 4z"/><path d="M16 6v28M28 10v28"/>',
    pen: '<path d="M8 36l4-12L28 8l8 8-16 16z"/><path d="M8 36l8-4"/><circle cx="23" cy="19" r="2"/>',
    layout: '<rect x="5" y="7" width="34" height="30"/><path d="M5 15h34M17 15v22"/>',
    db: '<ellipse cx="22" cy="10" rx="14" ry="5"/><path d="M8 10v24c0 3 6 5 14 5s14-2 14-5V10M8 22c0 3 6 5 14 5s14-2 14-5"/>',
    motion: '<path d="M4 34C14 34 16 10 26 10s10 10 14 10"/><circle cx="26" cy="10" r="3"/>',
    book: '<path d="M6 8h11a4 4 0 0 1 4 4v24a3 3 0 0 0-3-3H6z"/><path d="M38 8H27a4 4 0 0 0-4 4v24a3 3 0 0 1 3-3h12z"/>',
    globe: '<circle cx="22" cy="22" r="16"/><path d="M6 22h32M22 6c6 6 6 26 0 32M22 6c-6 6-6 26 0 32"/>',
    sync: '<path d="M34 16A13 13 0 0 0 10 14M10 28a13 13 0 0 0 24 2"/><path d="M34 8v8h-8M10 36v-8h8"/>',
    cursor: '<path d="M10 6v26l7-6 5 11 5-2-5-11h9z"/>',
    gauge: '<path d="M6 30a16 16 0 1 1 32 0"/><path d="M22 30l8-10"/><circle cx="22" cy="30" r="2.5"/>',
    branch: '<circle cx="12" cy="10" r="4"/><circle cx="12" cy="34" r="4"/><circle cx="32" cy="16" r="4"/><path d="M12 14v16M32 20c0 8-12 6-18 12"/>',
    spark: '<path d="M22 4l4 14 14 4-14 4-4 14-4-14-14-4 14-4z"/>',
    hand: '<path d="M14 22V10a3 3 0 0 1 6 0v10M20 18V7a3 3 0 0 1 6 0v11M26 18v-7a3 3 0 0 1 6 0v14c0 8-5 13-12 13-5 0-8-3-11-8l-4-7a3 3 0 0 1 5-3l4 5"/>',
    eye: '<path d="M4 22s7-12 18-12 18 12 18 12-7 12-18 12S4 22 4 22z"/><circle cx="22" cy="22" r="5"/>',
    code: '<path d="M15 12L5 22l10 10M29 12l10 10-10 10M25 8l-6 28"/>',
    palette: '<path d="M22 5a17 17 0 1 0 0 34c3 0 3-3 2-5s0-5 3-5h5a7 7 0 0 0 7-7c0-10-8-17-17-17z"/><circle cx="13" cy="20" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="29" cy="13" r="2"/>',
    grid: '<rect x="6" y="6" width="13" height="13"/><rect x="25" y="6" width="13" height="13"/><rect x="6" y="25" width="13" height="13"/><rect x="25" y="25" width="13" height="13"/>',
    type: '<path d="M8 10V6h28v4M22 6v32M16 38h12"/>'
  };
  var CAPS = $$('.ab_bento-card.is-sv').filter(function(c){
    if (!txt('.ab_bento-card_title', c)){ var cell = c.closest('.ab_bento_cell'); (cell || c).remove(); return false; }
    return true;
  });
  CAPS.forEach(function(c){
    var ic = $('[data-sv-icon]', c), k = ic ? (ic.getAttribute('data-sv-icon') || '').toLowerCase() : '';
    if (ic) ic.innerHTML = '<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || ICON.spark) + '</svg>';
    var ck = $('.ab_sv_dl_ck', c); if (ck) ck.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.6 2.5L10 3"/></svg>';
  });
  set('deliver-count', String(CAPS.length));
  (function(){
    var grid = $('.ab_bento_grid.is-included'); if (!grid || !CAPS.length) return;
    inView([grid], function(){ CAPS.forEach(function(c, i){ setTimeout(function(){ c.classList.add('on'); }, reduce ? 0 : 250 + i * 180); }); }, { threshold: .25 });
  })();

  /* ---------- flight plan: the line fills left to right, the ship lights each stage ---------- */
  (function(){
    var plan = $('#svPlan'); if (!plan) return;
    var st = $$('.ab_sv_plan_item', plan).filter(function(li){ if (!txt('.ab_sv_plan_h', li)){ li.remove(); return false; } return true; });
    set('plan-count', String(st.length));
    plan.insertAdjacentHTML('beforeend', '<svg class="ab_sv_plan_ship" viewBox="-12 -12 24 24" aria-hidden="true"><rect x="-6" y="-6" width="12" height="12" fill="#FF6A3D" transform="rotate(45)"/><rect x="-2.5" y="-2.5" width="5" height="5" fill="#07080D" transform="rotate(45)"/></svg>');
    var fill = $('.ab_sv_plan_fill', plan), ship = $('.ab_sv_plan_ship', plan);
    function setP(p){
      var w = plan.offsetWidth, x = w * p, flat = !fill || getComputedStyle(fill).display === 'none';
      if (fill) fill.style.transform = 'scaleX(' + p + ')';
      if (ship) ship.style.transform = 'translateX(' + x + 'px) rotate(' + (p * 540) + 'deg)';
      st.forEach(function(li){ li.classList.toggle('on', flat || p >= .999 || li.offsetLeft + 24 <= x + 4); });
    }
    if (reduce || !window.ScrollTrigger){ setP(1); if (!reduce && !window.ScrollTrigger) inView(st, function(li){ li.classList.add('on'); }); return; }
    setP(0);
    ScrollTrigger.create({ trigger: plan, start: 'top 80%', end: 'bottom 45%', scrub: .6, onUpdate: function(s){ setP(s.progress); }, onRefresh: function(s){ setP(s.progress); } });
    // stacked layout (tablet/phone) has no line: light each stage as it scrolls in
    inView(st, function(li){ if (fill && getComputedStyle(fill).display === 'none') li.classList.add('on'); });
  })();

  /* ---------- under the hood: the CMS snippet as a highlighted code block ---------- */
  (function(){
    var sec = $('#hood'), slot = $('#svCode'), code = $('[data-field="code"]');
    var src = code ? code.textContent.replace(/^\s*\n|\s+$/g, '') : '';
    if (!sec) return;
    if (!src || !AB.codeBlock){ sec.remove(); return; }
    slot.innerHTML = AB.codeBlock(src, txt('[data-field="code-label"]') || 'excerpt');
  })();

  /* ---------- FAQ count ---------- */
  set('faq-count', String($$('#svFaq .ab_faq_item').length));
  (function(){ var f = $('#faq'); if (f && !$('#svFaq .ab_faq_item')) f.remove(); })();
