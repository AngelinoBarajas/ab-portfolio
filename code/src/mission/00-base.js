  /* ---------- shared helpers from ab-core.js ---------- */
  var AB = window.AB;
  if (!AB || !AB.ready){ if (window.console) console.warn('[ab-mission] ab-core.js must load first'); return; }
  var $ = AB.$, $$ = AB.$$, reduce = AB.reduce, coarse = AB.coarse, hasGsap = AB.hasGsap;
  var toast = AB.toast, warp = AB.warp, sf = AB.sf, esc = AB.esc, pad2 = AB.pad2, rgbToHex = AB.rgbToHex, nudge = AB.nudge, buildPlanet = AB.buildPlanet;
  var canDrag = hasGsap && !!window.Draggable;
  // only on the Missions template (the hero planet carries the mission's slug)
  var HERO_PLANET = $('#hero .ab_planet[data-slug]');
  if (!HERO_PLANET) return;
  // vendor scripts (510 globe, Aguirre case map) ship from this repo at the same tag as this bundle: derive the base from our own <script src>
  var VENDOR = (function(){
    var s = $('script[src*="/code/dist/ab-mission"]');
    return s ? s.src.replace(/code\/dist\/[^\/]*$/, 'code/vendor/') : 'https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@main/code/vendor/';
  })();
  function txt(sel, root){ var n = $(sel, root); return n ? n.textContent.trim() : ''; }
  function loadScript(src){ return new Promise(function(res, rej){ var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.body.appendChild(s); }); }
