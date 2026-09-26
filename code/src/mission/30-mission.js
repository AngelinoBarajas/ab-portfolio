  /* =========================================================
     MISSION DEBRIEF · read the CMS item + its Collection Lists, then fill and animate the template
     ========================================================= */
  var SLUG = HERO_PLANET.getAttribute('data-slug');

  /* ---------- hidden mission (CMS switch "Hide from site") → back to the archive ---------- */
  // Webflow keeps conditionally hidden nodes in the DOM (class w-condition-invisible); the marker only counts when it's shown
  if ($('[data-mission-hidden]:not(.w-condition-invisible)')){ location.replace('/work'); return; }

  /* ---------- glossary ([[term]] in rich copy → tap/hover tips) ---------- */
  var GLOSS = {};
  $$('[data-glossary-source] .w-dyn-item').forEach(function(it){
    var n = txt('[data-field="name"]', it), d = txt('[data-field="definition"]', it); if (n) GLOSS[n] = d;
  });
  function rich(t){ return esc(t).replace(/\[\[([^\]]+)\]\]/g, function(_, term){ return GLOSS[term] ? '<button type="button" class="gl" data-term="' + esc(term) + '">' + esc(term) + '</button>' : esc(term); }); }
  $$('[data-rich]').forEach(function(p){ if (/\[\[/.test(p.textContent)) p.innerHTML = rich(p.textContent); });

  /* ---------- the mission switcher (Missions list, placeholders filtered out) ---------- */
  var LIST = $$('#mswitch .ab_mswitch_link').map(function(a, i){
    return { el: a, slug: a.getAttribute('data-slug'), name: txt('[data-field="name"]', a) || a.textContent.trim(), i: i, planet: a };
  });
  var MI = 0; LIST.forEach(function(m, i){ if (m.slug === SLUG) MI = i; });
  LIST.forEach(function(m, i){
    var no = $('[data-field="no"]', m.el); if (no) no.textContent = pad2(i + 1);
    if (m.slug === SLUG) m.el.setAttribute('aria-current', 'page');
    if (m.slug) m.el.setAttribute('href', '/work/' + m.slug);
  });
  var NO = pad2(MI + 1), TOTAL = pad2(Math.max(1, LIST.length));
  var NEXT = LIST.length > 1 ? LIST[(MI + 1) % LIST.length] : null;

  /* ---------- types (hero chips) → identity missions get their own wording ---------- */
  var TYPES = $$('[data-meta-types] .ab_meta_chip').map(function(c){ return c.textContent.trim(); }).filter(Boolean);
  var isLogo = TYPES.indexOf('Logo') > -1 || TYPES.indexOf('Branding') > -1;
  // a system mission (content system with no website of its own, e.g. the Knowledge System add-on)
  var isSystem = !isLogo && TYPES.indexOf('Content system') > -1 && TYPES.indexOf('Website') < 0;

  /* ---------- channels (Mission Channels list) ---------- */
  var CH = $$('[data-channels-source] .w-dyn-item').map(function(item, i){
    var it = $('[data-channel]', item) || item;
    var imgs = $$('img', it).filter(function(im){ return !im.classList.contains('w-dyn-bind-empty'); }).map(function(im){ return im.getAttribute('src') || ''; }).filter(function(s){ return s && !/placeholder/i.test(s); });
    var cid = it.getAttribute('data-id') || ('ch' + i);
    return { id: cid, kind: ({ sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable' })[cid] || (it.getAttribute('data-kind') || 'img').toLowerCase(), mode: (it.getAttribute('data-mode') || '').toLowerCase(),
      label: it.getAttribute('data-label') || ('Channel ' + (i + 1)), caption: it.getAttribute('data-caption') || '', src: imgs[0] || '', before: imgs[0] || '', after: imgs[1] || imgs[0] || '' };
  });
  var PINS = $$('[data-pins-source] .w-dyn-item').map(function(item){
    var it = $('[data-pin]', item) || item;
    var im = $('img', it), src = im && im.getAttribute('src');
    return { lat: +it.getAttribute('data-lat'), lng: +it.getAttribute('data-lng'), city: it.getAttribute('data-city') || '', title: it.getAttribute('data-title') || '', link: it.getAttribute('data-link') || '', img: src && !/placeholder/i.test(src) ? src : '' };
  }).filter(function(p){ return !isNaN(p.lat) && !isNaN(p.lng); });
  var M = { slug: SLUG, no: NO, channels: CH, mock: MOCKS[SLUG] || null, live: '' };

  /* ---------- counts + copy that depend on the item ---------- */
  function setAll(k, v){ $$('[data-mission="' + k + '"]').forEach(function(e){ e.textContent = v; }); }
  setAll('no', NO); setAll('total', TOTAL); setAll('channels', CH.length);
  setAll('systems', $$('#systems .ab_sys').length); setAll('solved', $$('#anoms .ab_anom').length);
  setAll('tools', $$('#stkOrbit .ab_stack_chip').length);
  if (isLogo){
    var ml = $('[data-mission-lede="monitor"]'); if (ml) ml.textContent = 'Switch channels to see the mark, its construction and where it lives.';
    var sl = $('[data-mission-lede="solved"]'); if (sl) sl.textContent = 'What the identity does for the people who run it and the people who visit it.';
    var sh = $('[data-mission-sys-h]'); if (sh) sh.innerHTML = 'Design <span class="t-outline">decisions</span>';
  }
  if (isSystem){
    var ml2 = $('[data-mission-lede="monitor"]'); if (ml2) ml2.textContent = 'Switch channels to watch the system connect, draft, publish and get found.';
    var sl2 = $('[data-mission-lede="solved"]'); if (sl2) sl2.textContent = 'What the system does for the people who run the site and the people who read it.';
    var sh2 = $('[data-mission-sys-h]'); if (sh2) sh2.innerHTML = 'System <span class="t-outline">parts</span>';
  }
  document.title = txt('#heroTitle') + ' · Mission debrief · Angelino Barajas';

  /* ---------- live links: hide them when the mission has no live URL ---------- */
  (function(){
    var any = false;
    $$('[data-mission-live]').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if (h && h !== '#' && !/^\/?$/.test(h)){ any = true; M.live = h; a.target = '_blank'; a.rel = 'noopener'; return; }
      if (a.classList.contains('ab_meta_live')){ var s = document.createElement('span'); s.className = a.className; s.innerHTML = a.innerHTML; a.parentNode.replaceChild(s, a); var ar = $('.ab_meta_live-arrow', s); if (ar) ar.remove(); }
      else a.remove();
    });
    var host = $('[data-mf="host"]'); if (host) host.textContent = M.live ? M.live.replace(/^https?:\/\//, '').replace(/\/$/, '') : isSystem ? 'Add-on · any Webflow site' : 'Self-initiated identity';
  })();

  /* ---------- palette (identity missions with a token set) ---------- */
  var PALETTE = { 'ab-identity': true };
  var pal = $('[data-mission-palette]');
  if (pal && PALETTE[SLUG]){
    pal.hidden = false;
    $$('.ab_swatch', pal).forEach(function(s){
      var hx = s.getAttribute('data-hex'), chip = $('.ab_swatch_chip', s); if (chip) chip.style.background = hx;
      s.addEventListener('click', function(){
        if (!reduce && hasGsap && chip) gsap.fromTo(chip, { scale: .9 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' });
        AB.copyText(hx, hx + ' copied ✓');
      });
    });
  } else if (pal) pal.remove();

  /* ---------- crew level: hero switch + a floating dock that follows the reader ---------- */
  (function(){
    var heroSw = $('[data-crew-switch]'), hint = $('#crewHint'), cur = 'cadet';
    var dock = document.createElement('div');
    dock.className = 'crew-dock'; dock.setAttribute('role', 'region'); dock.setAttribute('aria-label', 'Crew level');
    dock.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="mono">Crew level</span><div class="ab_switch" role="group" aria-label="Explanation depth"><span class="ab_switch_ind" aria-hidden="true"></span><button type="button" class="ab_switch_btn" data-lv="cadet" aria-pressed="true">Cadet</button><button type="button" class="ab_switch_btn" data-lv="eng" aria-pressed="false">Engineer</button></div>';
    document.body.appendChild(dock);
    var sws = [heroSw, $('.ab_switch', dock)].filter(Boolean);
    function paint(){
      sws.forEach(function(sw){
        var btns = $$('[data-lv]', sw), ind = $('.ab_switch_ind', sw);
        btns.forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lv') === cur ? 'true' : 'false'); });
        var on = btns.filter(function(b){ return b.getAttribute('data-lv') === cur; })[0];
        if (on && on.offsetWidth && ind){ ind.style.width = on.offsetWidth + 'px'; ind.style.transform = 'translateX(' + on.offsetLeft + 'px)'; }
      });
    }
    function set(lv, anim, fromDock){
      var prevY = null, anchor = null;
      // keep what the reader is looking at in place when content expands or collapses
      // the card nearest the reading line (35% down) is the anchor; whole sections only when no card is on screen
      if (anim){
        var line = innerHeight * .35, bd = 1e9;
        $$('.ab_anom, .ab_sys').forEach(function(el){
          var r = el.getBoundingClientRect(); if (r.bottom < 70 || r.top > innerHeight) return;
          var dd = r.top <= line && r.bottom >= line ? 0 : Math.min(Math.abs(r.top - line), Math.abs(r.bottom - line));
          if (dd < bd){ bd = dd; anchor = el; }
        });
        if (!anchor){ var secs = $$('main section'); for (var i = 0; i < secs.length; i++){ if (secs[i].getBoundingClientRect().bottom > line){ anchor = secs[i]; break; } } }
        if (anchor) prevY = anchor.getBoundingClientRect().top;
      }
      cur = lv; document.body.classList.toggle('eng', lv === 'eng'); paint();
      if (hint) hint.textContent = lv === 'eng' ? 'Technical breakdowns, stack details and code excerpts are on.' : 'Plain-English briefings. Switch to Engineer for the technical details.';
      try { localStorage.setItem('ab-crew', lv); } catch(e){}
      function keep(){ if (!anchor || prevY == null) return; var dy = anchor.getBoundingClientRect().top - prevY; if (Math.abs(dy) > 1){ if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(scrollY + dy, { immediate: true, force: true }); else scrollBy(0, dy); } }
      keep();
      // pins re-measure after the swap: hold the same card in place again afterwards
      if (anim && window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); keep(); }, 50);
      if (anim && fromDock) toast(lv === 'eng' ? 'Engineer mode · code excerpts on' : 'Cadet mode · plain-English briefings');
    }
    sws.forEach(function(sw){ $$('[data-lv]', sw).forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); set(b.getAttribute('data-lv'), true, sw.parentNode === dock); }); }); });
    var saved = 'cadet'; try { saved = localStorage.getItem('ab-crew') || 'cadet'; } catch(e){}
    set(saved); addEventListener('resize', paint); if (document.fonts) document.fonts.ready.then(paint);
    // the dock only rides along while there's level-dependent content left: once the last section with
    // cadet/engineer copy has scrolled away, it leaves (and comes back on the way up)
    var heroVis = true, footVis = false, pastLevels = false, crew = $('#crew'), foot = $('#siteFoot') || $('footer');
    var lvEls = $$('[data-eng-only], [data-cadet-only]'), lastLv = lvEls.length ? (lvEls[lvEls.length - 1].closest('section') || lvEls[lvEls.length - 1]) : null;
    function upd(){ var show = !heroVis && !footVis && !pastLevels; dock.classList.toggle('show', show); document.body.classList.toggle('dock-on', show); if (show) setTimeout(paint, 0); }
    if (crew) new IntersectionObserver(function(es){ heroVis = es[0].isIntersecting; upd(); }).observe(crew);
    if (foot) new IntersectionObserver(function(es){ footVis = es[0].isIntersecting; upd(); }, { rootMargin: '0px 0px -30% 0px' }).observe(foot);
    if (lastLv) new IntersectionObserver(function(es){ pastLevels = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; upd(); }, { rootMargin: '0px 0px -40% 0px' }).observe(lastLv);
  })();

  /* glossary tips: core/23-tips (AB.tip) handles the .gl buttons rich() makes */

  /* ---------- briefing: parameters (one per line in the CMS) ---------- */
  var PARAMS = txt('[data-field="params"]').split(/\n+/).map(function(s){ return s.trim(); }).filter(Boolean);
  (function(){
    var ul = $('#params'); if (!ul) return;
    ul.innerHTML = PARAMS.map(function(p, i){ return '<li><span>P-' + pad2(i + 1) + '</span><span class="ab_param_t">' + esc(p) + '</span></li>'; }).join('');
  })();

  var codeBlock = AB.codeBlock;
  function showBtn(id, label){ return '<button type="button" class="button is-ghost ab_mc-show" data-show="' + esc(id) + '"><span class="ab_button-label">' + label + '</span><span class="ab_button-arrow" aria-hidden="true">↑</span></button>'; }
  function hasCh(id){ return CH.some(function(c){ return c.id === id; }); }

  /* ---------- systems (accordion) ---------- */
  $$('#systems .ab_sys').forEach(function(s, i){
    var h = $('.ab_sys_h', s), b = $('.ab_sys_b', s), ix = $('.ab_sys_ix', s);
    if (ix) ix.textContent = 'SYS-' + pad2(i + 1);
    var snip = txt('[data-field="snippet"]', s), ch = txt('[data-field="channel"]', s), nm = txt('.ab_sys_nm', s);
    var cols = $$('.ab_sys_col', s);
    if (ch && hasCh(ch) && cols[0]) cols[0].insertAdjacentHTML('beforeend', showBtn(ch, 'Show on the monitor'));
    var eng = $('[data-eng-only]', s); if (eng && snip) eng.insertAdjacentHTML('beforeend', codeBlock(snip, nm));
    var cad = $('[data-cadet-only] .ab_sys_eng', s); if (cad && snip) cad.innerHTML = 'Switch Crew level to <strong>Engineer</strong> for the technical breakdown and a code excerpt.';
    function toggle(){
      var open = s.classList.toggle('is-open'); h.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (reduce || !hasGsap){ b.style.height = open ? 'auto' : '0px'; if (window.ScrollTrigger) ScrollTrigger.refresh(); return; }
      if (open){ var H = b.scrollHeight; gsap.fromTo(b, { height: 0 }, { height: H, duration: .6, ease: 'power3.out', onComplete: function(){ b.style.height = 'auto'; ScrollTrigger.refresh(); } }); gsap.fromTo($('.ab_sys_in', s), { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }); }
      else gsap.fromTo(b, { height: b.offsetHeight }, { height: 0, duration: .45, ease: 'power3.inOut', onComplete: function(){ ScrollTrigger.refresh(); } });
    }
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); } });
    if (i === 0){ s.classList.add('is-open'); h.setAttribute('aria-expanded', 'true'); b.style.height = 'auto'; }
  });

  /* ---------- problems solved ---------- */
  var WHO = { client: 'For the client', visitors: 'For visitors' };
  $$('#anoms .ab_anom').forEach(function(a, i){
    var ix = $('.ab_anom_ix', a); if (ix) ix.textContent = 'SOLVED-' + pad2(i + 1);
    var who = (txt('[data-field="who"]', a) || 'visitors').toLowerCase() === 'client' ? 'client' : 'visitors', w = $('.ab_anom_who', a);
    if (w){ w.textContent = WHO[who]; w.setAttribute('data-who', who); }
    var res = $('[data-anom-res]', a); if (res && !txt('.ab_anom_v', res)) res.remove();
    var eng = $('[data-eng-only]', a), snip = txt('[data-field="snippet"]', a), demo = txt('[data-field="demo"]', a);
    if (eng && !txt('.ab_anom_eng-p', a) && !snip) eng.remove();
    else if (eng && snip) eng.insertAdjacentHTML('beforeend', codeBlock(snip, (txt('.ab_anom_title', a) || 'excerpt').toLowerCase()));
    if (demo && hasCh(demo)){ var st = $('.ab_stamp', a); (st || a).insertAdjacentHTML(st ? 'beforebegin' : 'beforeend', showBtn(demo, 'See it on the monitor')); }
    if (reduce || !hasGsap || !window.ScrollTrigger) return;
    a.classList.add('pre');
    ScrollTrigger.create({ trigger: a, start: 'top 78%', once: true, onEnter: function(){
      gsap.delayedCall((i % 2) * .18, function(){
        a.classList.remove('pre');
        gsap.fromTo($('.ab_stamp', a), { scale: 2.2, opacity: 0, rotation: -18 }, { scale: 1, opacity: .9, rotation: -8, duration: .45, ease: 'back.out(2.2)' });
        gsap.fromTo(a, { x: -3 }, { x: 0, duration: .3, ease: 'elastic.out(1,.3)', delay: .35 });
      });
    } });
  });

  /* ---------- telemetry numbers (Mission Stats) ---------- */
  $$('#tel .ab_tel_item').forEach(function(t){
    var n = $('.ab_tel_n', t), v = n && n.getAttribute('data-count'), suf = txt('[data-field="suffix"]', t);
    if (!n || v == null) return;
    n.setAttribute('data-suffix', suf || '');
    if (v === '' || isNaN(+v)){ n.removeAttribute('data-count'); n.textContent = suf || '∞'; n.classList.remove('w-dyn-bind-empty'); t.classList.add('is-symbol'); }
    else n.textContent = v + (suf || '');
  });

  /* ---------- stack orbit (Tools the mission ran on) ---------- */
  (function(){
    var orbit = $('#stkOrbit'); if (!orbit) return;
    var TOOLC = { 'webflow': '#146EF5', 'client-first': '#4353FF', 'gsap': '#0AE448', 'three.js': '#FFFFFF', 'lenis': '#FF98A2', 'unicorn studio': '#7C5CFF', 'github': '#F0F6FC', 'd3': '#F9A03C', 'figma': '#A259FF', 'webflow cms': '#146EF5', 'finsweet': '#161616', 'claude': '#D97757', 'pen + paper': '#F2F0EA', 'photoshop': '#31A8FF', 'illustrator': '#FF9A00' };
    // color fallback when the chip's hidden color node isn't bound in the Designer
    $$('.ab_stack_chip', orbit).forEach(function(c){
      var cn = $('[data-field="color"]', c), nm = (c.getAttribute('data-name') || c.textContent).trim().toLowerCase();
      if (cn && !(cn.style.backgroundColor) && TOOLC[nm]) cn.style.backgroundColor = TOOLC[nm];
    });
    if (AB.orbit) AB.orbit(orbit, $('#stkReadout'));
  })();

  /* ---------- manifest (light bento) ---------- */
  (function(){
    var sec = $('[data-mission-manifest]'); if (!sec) return;
    var site = $('[data-mf="pages"]'), pages = (site && site.getAttribute('data-items') || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
    var db = $('[data-mf="collections"]'), cols = (db && db.getAttribute('data-items') || '').split(',').map(function(s){ return s.trim(); }).filter(Boolean);
    if (!pages.length && !cols.length && !PARAMS.length){ sec.remove(); return; }
    var pl = isLogo ? 'assets' : isSystem ? 'parts' : 'pages';
    function set(k, v){ var e = $('[data-mf="' + k + '"]', sec); if (e) e.textContent = v; return e; }
    set('pages-total', pages.length); set('pages-label', pl); set('pages-title', isLogo ? 'A full identity kit' : isSystem ? 'The whole system' : 'Every page, designed then built');
    var cnt = $('[data-mf="count"]', sec); if (cnt) cnt.setAttribute('data-to', pages.length);
    // identity missions: each asset tile shows a small piece of the site's design language instead of a page wireframe
    var MK = AB.markSVG ? AB.markSVG() : '';
    var ART = [
      [/sketch/i, '<span class="vx-sketch"><svg viewBox="0 0 110 50"><path d="M8 40L20 10 32 40M13 29H27M40 10V40M40 10H50C60 10 60 24 50 25H40M50 25C62 26 62 40 50 40H40"/><path class="x" d="M70 12L100 38M100 12L70 38"/></svg><b>v25</b></span>'],
      [/construction|grid/i, '<span class="vx-mark is-grid">' + (AB.markSVG ? AB.markSVG({ grid: true }) : '') + '</span>'],
      [/monogram|planet mono|^mark/i, '<span class="vx-mark">' + MK + '</span>'],
      [/lockup/i, '<span class="vx-lock"><i>' + MK + '</i><i class="lt">' + MK + '</i></span>'],
      [/color|token/i, '<span class="vx-sw"><i style="background:#07080D"></i><i style="background:#0E1020"></i><i style="background:#161A2E"></i><i style="background:#F2F0EA"></i><i style="background:#FF6A3D"></i><i style="background:#4C8DFF"></i></span>'],
      [/type/i, '<span class="vx-type"><b>Aa</b><em>Geist</em><code>01</code></span>'],
      [/button/i, '<span class="vx-btn"><b>Launch →</b></span>'],
      [/selection/i, '<span class="vx-sel"><i></i><b>Frame</b></span>'],
      [/frame label/i, '<span class="vx-fl"><b>▢ hero</b><i>1440 × 900</i></span>'],
      [/star|nebula/i, '<span class="vx-stars"></span>'],
      [/planet/i, '<span class="vx-planet"><i></i><b></b></span>'],
      [/warp/i, '<span class="vx-warp"><i></i><i></i><i></i><i></i><i></i></span>'],
      [/black hole/i, '<span class="vx-bh"><i></i></span>'],
      [/favicon|avatar/i, '<span class="vx-fav"><i>' + MK + '</i><b>' + MK + '</b></span>'],
      [/card|sticker/i, '<span class="vx-card"><i>' + MK + '</i><b>' + MK + '</b></span>']
    ];
    // system missions: each part drawn as a tiny piece of the system itself
    var SART = [
      [/vocab/i, '<span class="kx-chips"><b>Who you help</b><b class="on">Onboarding</b><b>Services</b><b>Pricing</b></span>'],
      [/topic/i, '<span class="kx-page"><em>Topic</em><b>Onboarding</b><i></i><i></i><i class="s"></i></span>'],
      [/library/i, '<span class="kx-grid"><i></i><i class="on"></i><i></i><i></i><i></i><i></i></span>'],
      [/article/i, '<span class="kx-art"><i></i><b></b><b></b><b class="s"></b></span>'],
      [/video|chapter/i, '<span class="kx-ch"><i></i><em><b>0:00</b><b class="on">6:38</b><b>10:05</b></em></span>'],
      [/demonstrat/i, '<span class="kx-graph"><svg viewBox="0 0 110 60"><path d="M55 30L18 12M55 30L18 48M55 30L92 12M55 30L92 48M55 30L55 6"/><circle class="on" cx="55" cy="30" r="7"/><circle cx="18" cy="12" r="4"/><circle cx="18" cy="48" r="4"/><circle cx="92" cy="12" r="4"/><circle cx="92" cy="48" r="4"/><circle cx="55" cy="6" r="3"/></svg></span>'],
      [/related/i, '<span class="kx-stack"><i></i><i></i><i class="on"></i></span>'],
      [/hub|index/i, '<span class="kx-hub"><i></i><i></i><i></i><i></i><i></i><i></i></span>'],
      [/voice/i, '<span class="kx-wave">' + [30, 60, 85, 45, 95, 70, 40, 80, 55, 35, 65, 90, 50, 25].map(function(h){ return '<i style="height:' + h + '%"></i>'; }).join('') + '</span>'],
      [/editorial|plan/i, '<span class="kx-chk"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span>'],
      [/review|approv/i, '<span class="kx-diff"><s>a plan in writing</s><ins>a one-page plan</ins><b>Approved ✓</b></span>'],
      [/schema|structured|json/i, '<span class="kx-json"><b>{</b> <em>"@type"</em>: <i>"Article"</i> <b>}</b></span>']
    ];
    function art(p){ var L = isSystem ? SART : ART; for (var i = 0; i < L.length; i++) if (L[i][0].test(p)) return L[i][1]; return ''; }
    if (site){
      site.innerHTML = pages.map(function(p, i){ var ax = isLogo || isSystem ? art(p) : ''; return '<div class="vs-t' + (ax ? ' is-art' : '') + '" style="--d:' + (i * .12) + 's" data-p="' + esc(p) + '">' + (ax ? '<div class="vs-w is-art">' + ax + '</div>' : '<div class="vs-w"><i></i><i></i><i class="s"></i><b></b></div>') + '<span>' + esc(p) + '</span><em>✓</em></div>'; }).join('') +
        '<span class="vs-cur" aria-hidden="true"><svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg></span>';
    }
    var plEl = $('[data-mf="planet"]', sec), ptype = HERO_PLANET.getAttribute('data-planet') || 'planet';
    set('planet-tag', txt('#heroTitle') + ' · ' + ptype);
    var fy = [txt('#hero [data-field="platform"]'), txt('#hero [data-field="year"]')].filter(Boolean).join(' · '); set('role-meta', fy);
    var big = set('no', NO); if (big) big.setAttribute('data-n', NO);
    var colLabel = $('[data-mf="collections-title"]', sec); if (colLabel){ colLabel.textContent = cols.length + ' ' + (isLogo ? 'systems' : 'collections'); var lab = colLabel.parentNode.querySelector('.ab_bento-card_label'); if (lab && isLogo) lab.textContent = 'Systems'; }
    if (db) db.innerHTML = cols.map(function(c, i){ return '<li style="--i:' + i + '"><i aria-hidden="true"></i><span>' + esc(c) + '</span><em aria-hidden="true">synced</em></li>'; }).join('');
    set('types-title', TYPES.length + ' disciplines');
    var tg = $('[data-mf="types"]', sec); if (tg) tg.innerHTML = TYPES.map(function(t){ return '<span class="mf-tag">' + esc(t) + '</span>'; }).join('');
    set('params-title', 'All ' + PARAMS.length + ' met');
    var ck = $('[data-mf="params"]', sec); if (ck) ck.innerHTML = PARAMS.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('');
    set('status', txt('#hero [data-field="status"]') || 'Shipped');
    var stc = $('.ab_mf_status', sec); if (stc) stc.insertAdjacentHTML('afterbegin', '<svg class="mf-radar" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="90"/><path d="M100 10v180M10 100h180"/><g class="sweep"><path d="M100 100L100 10A90 90 0 0 1 163.6 36.4Z"/></g><rect class="blip" x="136" y="58" width="6" height="6"/></svg>');
    // pages tick in, counter, a cursor that tours the tiles
    $$('.ab_mf_site, .ab_mf_db, .ab_mf_chk', sec).forEach(function(v){
      if (reduce){ v.classList.add('on'); return; }
      new IntersectionObserver(function(es, io){ if (es[0].isIntersecting){ v.classList.add('on'); io.disconnect(); if (v.classList.contains('ab_mf_site')) siteTour(v); } }, { threshold: .35 }).observe(v);
    });
    if (reduce && cnt) cnt.textContent = pages.length;
    function siteTour(v){
      var tiles = $$('.vs-t', v), cur = $('.vs-cur', v);
      if (cnt && hasGsap){ var o = { n: 0 }; gsap.to(o, { n: pages.length, duration: tiles.length * .12 + .6, ease: 'power1.out', delay: .3, onUpdate: function(){ cnt.textContent = Math.round(o.n); } }); }
      if (!cur || !hasGsap) return;
      var k = 0, hover = false;
      v.addEventListener('pointerenter', function(){ hover = true; tiles.forEach(function(x){ x.classList.remove('is-tour'); }); gsap.to(cur, { opacity: 0, duration: .2 }); });
      v.addEventListener('pointerleave', function(){ hover = false; });
      function step(){
        if (!hover && tiles.length){ var t = tiles[k % tiles.length]; k++; tiles.forEach(function(x){ x.classList.remove('is-tour'); });
          gsap.to(cur, { x: t.offsetLeft + t.offsetWidth * .62, y: t.offsetTop + t.offsetHeight * .55, opacity: 1, duration: .7, ease: 'power2.inOut', onComplete: function(){ if (!hover) t.classList.add('is-tour'); } }); }
        setTimeout(step, 1700);
      }
      setTimeout(step, tiles.length * 120 + 900);
    }
    // draggable tags, spin the specimen (card spotlight + tilt: core AB.cardFx; covers cards added later too)
    if (AB.cardFx) $$('.ab_bento-card.is-mf', sec).forEach(AB.cardFx);
    if (canDrag) $$('.mf-tag', sec).forEach(function(t){
      Draggable.create(t, { type: 'x,y', bounds: t.closest('.ab_bento-card'), zIndexBoost: true, onRelease: function(){ gsap.to(t, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.45)', delay: .15 }); } });
    });
    if (plEl && hasGsap){ var sx = 0, drag = false;
      plEl.addEventListener('pointerdown', function(e){ drag = true; sx = e.clientX; plEl.setPointerCapture(e.pointerId); });
      plEl.addEventListener('pointermove', function(e){ if (drag) gsap.to(plEl, { rotation: (e.clientX - sx) * .4, duration: .3 }); });
      plEl.addEventListener('pointerup', function(){ drag = false; gsap.to(plEl, { rotation: 0, duration: 1.2, ease: 'elastic.out(1,.4)' }); });
    }
  })();

  /* ---------- crew-debrief quote ---------- */
  (function(){
    var sec = $('[data-mission-quote]'); if (!sec) return;
    if (!txt('.ab_dbq_text', sec)){ sec.remove(); return; }
    var by = $('[data-by]', sec); if (by) by.textContent = by.getAttribute('data-by') || by.textContent;
  })();

  /* ---------- next mission (next in the switcher's order) ---------- */
  (function(){
    var slot = $('#nextSlot'); if (!slot || !NEXT) { if (slot) slot.closest('section').remove(); return; }
    var p = NEXT.el, attrs = ['planet', 'colors', 'ring', 'glow'].map(function(k){ var v = p.getAttribute('data-' + k); return v ? ' data-' + k + '="' + esc(v) + '"' : ''; }).join('');
    slot.innerHTML = '<a class="ab_next-card" href="' + esc(p.getAttribute('href') || ('/work/' + NEXT.slug)) + '" data-next-card=""><div class="ab_next-card_content"><div class="ab_next-card_eyebrow text-style-mono">Next mission · ' + pad2(NEXT.i + 1) + ' / ' + TOTAL + '</div><h2 class="ab_next-card_title">' + esc(NEXT.name) + '</h2><div class="ab_next-card_go">Engage warp <span aria-hidden="true">→</span></div></div>' +
      '<div class="ab_planet is-next"' + attrs + ' data-seed="' + (NEXT.i * 7 + 3) + '" data-spin="60" aria-hidden="true"></div></a>';
    var card = $('.ab_next-card', slot), pl = $('.ab_planet', card);
    if (pl && buildPlanet) buildPlanet(pl);
    if (AB.nextCard) AB.nextCard(card);
    card.addEventListener('click', function(e){ if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); AB.go(card.getAttribute('href')); });
  })();

  /* ---------- hero: drag the planet, entrance ---------- */
  (function(){
    var hero = $('#hero'); if (!hero) return;
    if (canDrag) $$('[data-drag]', hero).forEach(function(el){
      var back;
      function schedule(){ if (back) back.kill(); back = gsap.delayedCall(6, function(){ gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1,.55)' }); }); }
      Draggable.create(el, { type: 'x,y', bounds: hero, inertia: true, edgeResistance: .7,
        onPress: function(){ if (back) back.kill(); gsap.to(el, { scale: 1.04, duration: .2 }); },
        onRelease: function(){ gsap.to(el, { scale: 1, duration: .3 }); },
        onDragEnd: schedule, onThrowComplete: schedule });
      if (nudge) nudge(el, schedule);
    });
    if (hasGsap && !reduce){
      gsap.from('#heroTitle', { yPercent: 30, opacity: 0, duration: 1.1, ease: 'expo.out', delay: .15 });
      gsap.from('.ab_dbh_eyebrow, .ab_dbh_sum, .ab_crew, .ab_meta, #hero .ab_planet', { opacity: 0, y: 20, duration: .9, stagger: .06, delay: .4, ease: 'power3.out' });
    }
  })();
