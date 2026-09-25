  /* ---------- base: helpers shared with the page bundles through window.AB ---------- */
  var AB = window.AB = window.AB || {};
  var hasGsap = !!window.gsap;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  if (hasGsap){
    var plugins = [window.ScrollTrigger, window.Draggable, window.InertiaPlugin, window.SplitText, window.ScrambleTextPlugin, window.Flip].filter(Boolean);
    gsap.registerPlugin.apply(gsap, plugins);
  }

  /* ---------- site settings (CMS · Site Settings, hidden [data-settings-source] list) ---------- */
  var S0 = {};
  $$('[data-settings-source] [data-field]').forEach(function(f){ var v = f.textContent.trim(); if (v) S0[f.getAttribute('data-field')] = v; });
  function bind(key, val){ if (!val) return; $$('[data-bind="' + key + '"]').forEach(function(e){ e.textContent = val; }); }
  bind('availability', S0.availability);
  if (S0.availability) bind('availability-short', S0.availability.replace(/^Available\s*/i, ''));
  bind('tz-label', S0['tz-label']);
  bind('email', S0.email);
  if (!S0.email){ var eb = $('[data-bind="email"]'); if (eb) S0.email = eb.textContent.trim(); }
  var events = (S0['space-events'] || 'shooting,meteors,comets,satellites,flares,ufo').split(',').map(function(s){ return s.trim(); });
  // social links: real URLs from Site Settings, else a hint
  $$('[data-social]').forEach(function(a){
    var url = S0[a.getAttribute('data-social')];
    if (url){ a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    else a.addEventListener('click', function(e){ e.preventDefault(); toast('Add your profile links in Site Settings.'); });
  });

  /* ---------- quotes (CMS · Quotes, hidden [data-quote-source] list) ---------- */
  var QUOTES = $$('[data-quote-source] .w-dyn-item').map(function(it){
    var g = function(k){ var n = $('[data-field="' + k + '"]', it); return n ? n.textContent.trim() : ''; };
    return { t: g('quote'), a: g('author'), c: g('context') };
  }).filter(function(q){ return q.t; });

  Object.assign(AB, { hasGsap: hasGsap, reduce: reduce, coarse: coarse, $: $, $$: $$, num: num, esc: esc, pad2: pad2, hex: hex, rgbToHex: rgbToHex, onView: onView, settings: S0, quotes: QUOTES });
