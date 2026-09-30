  /* ---------- base: helpers shared with the page bundles through window.AB ---------- */
  var AB = window.AB = window.AB || {};
  var hasGsap = !!window.gsap;
  // reduced motion = the system setting OR Calm mode (the visitor's own switch: footer bar / Shift+M, localStorage ab:calm).
  // Every bundle reads AB.reduce; html.ab-calm (set in the head by abwarpin, again here) mirrors the CSS reduced-motion rules (build.mjs)
  var sysReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, calm = false;
  try { calm = localStorage.getItem('ab:calm') === '1'; } catch (e){}
  if (calm) document.documentElement.classList.add('ab-calm');
  var reduce = sysReduce || calm;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function num(v, d){ var n = parseFloat(v); return isNaN(n) ? d : n; }
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad2(n){ return (n < 10 ? '0' : '') + n; }
  function hex(h){ h = h.trim().replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  // computed "rgb(r, g, b)" → "#rrggbb" (CMS Color fields reach the page as inline styles on hidden nodes)
  function rgbToHex(s){ var m = String(s || '').match(/\d+(\.\d+)?/g); if (!m || m.length < 3 || (m.length > 3 && +m[3] === 0)) return ''; return '#' + m.slice(0, 3).map(function(v){ var h = (+v | 0).toString(16); return h.length < 2 ? '0' + h : h; }).join(''); }
  function onView(el, fn, opts){ var io = new IntersectionObserver(function(es){ fn(es[0].isIntersecting); }, opts); io.observe(el); return io; }
  // big display titles: if the widest line/word can't fit the box (long words on a phone), shrink the font until it does (never under min)
  function fitWide(el, min){
    if (!el || el.__fit) return; el.__fit = true;
    function go(){
      el.style.fontSize = '';
      var cw = el.clientWidth, kids = el.children, w = 0, i;
      for (i = 0; i < kids.length; i++) if (kids[i].tagName !== 'BR') w = Math.max(w, kids[i].offsetWidth);
      w = Math.max(w, el.scrollWidth);
      if (cw && w > cw + 1) el.style.fontSize = Math.max(min || 24, Math.floor(parseFloat(getComputedStyle(el).fontSize) * cw / w * .98)) + 'px';
    }
    go(); var lw = innerWidth;
    addEventListener('resize', function(){ if (innerWidth !== lw){ lw = innerWidth; go(); } });
    if (document.fonts) document.fonts.ready.then(go);
  }
  AB.fitWide = fitWide;
  if (hasGsap){
    var plugins = [window.ScrollTrigger, window.Draggable, window.InertiaPlugin, window.SplitText, window.ScrambleTextPlugin, window.Flip].filter(Boolean);
    gsap.registerPlugin.apply(gsap, plugins);
  }

  /* ---------- site settings (CMS · Site Settings, hidden [data-settings-source] list) ---------- */
  // Webflow utility pages (404) can't hold Collection Lists, so every page with the site-data block caches it
  // (localStorage ab:site) and a page without it reads the cache, or fetches the Home page's block once.
  var SITE_KEY = 'ab:site', hasSiteData = !!$('[data-settings-source]');
  function readSettings(root){ var s = {}; $$('[data-settings-source] [data-field]', root).forEach(function(f){ var v = f.textContent.trim(); if (v) s[f.getAttribute('data-field')] = v; }); return s; }
  function readQuotes(root){
    return $$('[data-quote-source] .w-dyn-item', root).map(function(it){
      var g = function(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; };
      return { t: g('quote'), a: g('author'), c: g('context') };
    }).filter(function(q){ return q.t; });
  }
  // Glossary (CMS): Terms (auto-linked in copy) and Asides (a tip on one element, by CSS selector), read by core/23-tips
  function readGloss(root){
    return $$('[data-glossary-source] .w-dyn-item', root).map(function(it){
      var g = function(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; };
      return { n: g('name'), d: g('definition'), k: g('kind'), t: g('target') };
    }).filter(function(x){ return x.n && x.d; });
  }
  var hasGloss = !!$('[data-glossary-source]');
  var S0 = readSettings(), QUOTES = readQuotes(), GLOSS = readGloss(), siteCache = null;
  try { siteCache = JSON.parse(localStorage.getItem(SITE_KEY) || 'null'); } catch (e){}
  var cache = siteCache || {};
  if (hasSiteData){ cache.s = S0; cache.q = QUOTES; } else if (siteCache){ S0 = siteCache.s || {}; QUOTES = siteCache.q || []; }
  if (hasGloss) cache.g = GLOSS; else if (siteCache && siteCache.g) GLOSS = siteCache.g;
  if (hasSiteData || hasGloss){ try { localStorage.setItem(SITE_KEY, JSON.stringify(cache)); } catch (e){} }
  function bind(key, val){ if (!val) return; $$('[data-bind="' + key + '"]').forEach(function(e){ e.textContent = val; }); }
  // the nav status line gets a condensed availability ("Available Q4 2026" → "Booking Q4 ’26") so it fits beside the
  // clock, crew and Engines switch; the footer and mobile menu keep the full CMS wording
  function navAvail(t){ return t.replace(/^Available\b/i, 'Booking').replace(/\b20(\d\d)\b/, '’$1'); }
  var navAv = $('.ab_nav_status [data-bind="availability"]');
  if (navAv){ navAv.setAttribute('data-bind', 'availability-nav'); navAv.classList.add('ab_nav_avail'); navAv.textContent = navAvail(navAv.textContent.trim()); }
  function applySettings(){
    bind('availability', S0.availability);
    if (S0.availability) bind('availability-nav', navAvail(S0.availability));
    if (S0.availability) bind('availability-short', S0.availability.replace(/^Available\s*/i, ''));
    bind('tz-label', S0['tz-label']);
    bind('email', S0.email);
    $$('[data-social]').forEach(function(a){ var url = S0[a.getAttribute('data-social')]; if (url){ a.href = url; a.target = '_blank'; a.rel = 'noopener'; } });
  }
  applySettings();
  var designerEmail = $('[data-bind="email"]');
  if (!S0.email && designerEmail) S0.email = designerEmail.textContent.trim();
  var events = (S0['space-events'] || 'shooting,meteors,comets,satellites,flares,ufo').split(',').map(function(s){ return s.trim(); });
  // social links without a Site Settings URL: a hint (checked on click, so a late fetch can still fill them)
  $$('[data-social]').forEach(function(a){
    a.addEventListener('click', function(e){ if (S0[a.getAttribute('data-social')]) return; e.preventDefault(); toast('Add your profile links in Site Settings.'); });
  });
  if (((!hasSiteData && !siteCache) || (!hasGloss && !(siteCache && siteCache.g))) && window.fetch && window.DOMParser){
    fetch('/', { credentials: 'same-origin' }).then(function(r){ return r.ok ? r.text() : ''; }).then(function(html){
      if (!html) return;
      var doc = new DOMParser().parseFromString(html, 'text/html'), s = readSettings(doc), q = readQuotes(doc), g = readGloss(doc);
      if (!hasSiteData){ Object.keys(s).forEach(function(k){ S0[k] = s[k]; }); QUOTES.push.apply(QUOTES, q); cache.s = s; cache.q = q; applySettings(); }
      if (!hasGloss && g.length){ GLOSS.length = 0; GLOSS.push.apply(GLOSS, g); cache.g = g; if (AB.tip) AB.tip.refresh(); }
      try { localStorage.setItem(SITE_KEY, JSON.stringify(cache)); } catch (e){}
    })['catch'](function(){});
  }

  Object.assign(AB, { hasGsap: hasGsap, reduce: reduce, sysReduce: sysReduce, calm: calm, coarse: coarse, $: $, $$: $$, num: num, esc: esc, pad2: pad2, hex: hex, rgbToHex: rgbToHex, onView: onView, settings: S0, quotes: QUOTES, gloss: GLOSS });
