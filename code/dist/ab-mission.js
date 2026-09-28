/*! AB Portfolio · ab-mission v0.29.17 · github.com/AngelinoBarajas/ab-portfolio */
window.Webflow = window.Webflow || [];
window.Webflow.push(function(){
  if (window.__abMissionInit) return;
  window.__abMissionInit = true;
  /* ===== mission/00-base.js ===== */
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

  /* ===== mission/10-mocks.js ===== */
  /* ---------- mockup specs per mission (monitor scenes: figma / phone / flow / exploded / cms), keyed by mission slug ---------- */
  // Images come from the repo's prototype folder on jsDelivr, pinned to a tag (immutable).
  var IMG = 'https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.3.2/prototypes/img/';
  /* =========================================================
     CMS STAND-IN · Mockup spec per mission (Missions → "Monitor mockup" code field)
     els: layers of the Figma frame, in a 1000 × 625 frame (1440 × 900 at 1×).
     mobile: the coded phone screen, its menu, the scripted taps, and the notes beside it.
     ========================================================= */
  var MOCKS = {
  '510-visuals': {
    file: '510 Visuals — Homepage', page: 'Homepage', frame: 'Desktop · BNY Space', url: '510-visuals.webflow.io',
    bg: '#1c1e24', accent: '#5eead4', hover: 'media',
    comment: { on: 'heading', by: 'Client', text: 'Can the headline feel even bigger? It should read like a billboard.', reply: 'Staggered it across three lines and let it run edge to edge.' },
    els: [
      { id: 'nav', name: 'Nav / pill', icon: 'comp', type: 'Component', x: 150, y: 18, w: 700, h: 38, wire: 'nav',
        props: { fill: '#0E0F12' },
        html: '<div style="height:100%;border-radius:19px;background:#0e0f12;display:flex;align-items:center;justify-content:space-between;padding:0 5px 0 18px;box-shadow:0 8px 24px rgba(0,0,0,.4)"><b style="font:600 11px Inter,sans-serif;letter-spacing:.3em;color:#fff">5TEN</b><span style="display:flex;gap:18px;font:500 7.5px Inter,sans-serif;letter-spacing:.14em;color:#9aa4a8"><span>ABOUT</span><span style="color:#fff">BNY SPACE</span><span>INSPIRATION</span><span>PROJECTS</span><span>SERVICES</span></span><span style="background:#c9dcdf;color:#111;font:600 7.5px Inter,sans-serif;letter-spacing:.14em;padding:10px 14px;border-radius:2px">CONTACT</span></div>' },
      { id: 'heading', name: 'H1 / Brooklyn Navy Yard', icon: 'text', type: 'Text', x: 150, y: 100, w: 470, h: 300, wire: 'lines:3:big',
        props: { fill: '#FFFFFF', font: 'Inter', weight: 'Bold', size: '120', lh: '112%', ls: '-2%' },
        html: '<div style="font:700 84px/1.12 Inter,sans-serif;letter-spacing:-.02em;color:#fff;white-space:nowrap"><div>BROOKLYN</div><div style="padding-left:40px">NAVY</div><div style="padding-left:96px">YARD</div></div>' },
      { id: 'intro', name: 'Intro / eyebrow + body', icon: 'text', type: 'Text', x: 650, y: 112, w: 210, h: 96, wire: 'lines:5',
        props: { fill: '#9AA4A8', font: 'Inter', weight: 'Regular', size: '14', lh: '150%' },
        html: '<div style="font:500 7.5px Inter,sans-serif;letter-spacing:.16em;color:#fff;margin-bottom:9px">BNY SPACE — LIVE STUDIO</div><p style="margin:0;font:400 10px/1.5 Inter,sans-serif;color:#9aa4a8">As part of our mission to inform and inspire, we have created a space at the Brooklyn Navy Yard (BNY) showcasing concepts of LED video and lighting elements.</p>' },
      { id: 'media', name: 'Video / studio reel', icon: 'img', type: 'Image', x: 505, y: 258, w: 320, h: 205, wire: 'img',
        props: { fill: 'Image' },
        html: '<div style="position:absolute;inset:0;border-radius:6px;overflow:hidden;background:#2a2d31 url(' + IMG + '510-p-oculus.webp) center/cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,30,36,.15),rgba(28,30,36,.72))"></div><span style="position:absolute;left:12px;top:10px;font:500 7px Inter,sans-serif;letter-spacing:.16em;color:#d0e0e3">01 — STUDIO REEL</span><span class="hv" style="position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border:1.5px solid rgba(255,255,255,.85);border-radius:50%;display:grid;place-items:center;color:#fff;font:12px Inter,sans-serif;background:rgba(0,0,0,.2)">&#9654;</span></div>' },
      { id: 'services', name: 'Row / process', icon: 'comp', type: 'Component', x: 150, y: 520, w: 700, h: 52, wire: 'row:3',
        props: { fill: '#D0E0E3', font: 'Inter', weight: 'Medium', size: '11', ls: '16%' },
        html: '<div style="height:100%;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #33373e;font:500 7.5px Inter,sans-serif;letter-spacing:.16em;color:#d0e0e3"><span style="padding-top:14px">01 · CONSULTING</span><span style="padding-top:14px">02 · ENGINEERING</span><span style="padding-top:14px">03 · EXECUTION</span></div>' }
    ],
    mobile: {
      bg: '#1c1e24', statusFg: '#fff',
      nav: '<div style="position:absolute;left:12px;right:12px;top:44px;height:36px;border-radius:18px;background:#0e0f12;display:flex;align-items:center;justify-content:space-between;padding:0 5px 0 16px;z-index:4;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.4)"><b style="font:600 10px Inter,sans-serif;letter-spacing:.3em">5TEN</b><span class="m-burger"><i></i><i></i><i></i></span></div>',
      menu: '<div style="position:absolute;inset:0;background:#0e0f12;padding:104px 22px 0;color:#fff;font-family:Inter,sans-serif"><span class="m-close" style="position:absolute;right:17px;top:48px;color:#fff">&#10005;</span>' +
        ['About', 'BNY Space', 'Inspiration', 'Projects', 'Services'].map(function(l, i){ return '<div style="font:700 25px/1 Inter,sans-serif;letter-spacing:-.01em;text-transform:uppercase;padding:12px 0;border-bottom:1px solid #22252b;' + (i === 1 ? 'color:#5eead4' : '') + '">' + l + '</div>'; }).join('') +
        '<div style="margin-top:22px;background:#c9dcdf;color:#111;font:600 9px Inter,sans-serif;letter-spacing:.16em;padding:14px;text-align:center">CONTACT</div></div>',
      html: '<div style="padding:100px 18px 40px;color:#d0e0e3;font-family:Inter,sans-serif">' +
        '<div style="font:500 7px Inter,sans-serif;letter-spacing:.16em;color:#fff">BNY SPACE — LIVE STUDIO</div>' +
        '<div class="m-h" style="font:700 44px/1.02 Inter,sans-serif;color:#fff;letter-spacing:-.02em;margin:10px 0 12px">BROOKLYN<br>NAVY<br>YARD</div>' +
        '<p style="font:400 10.5px/1.55 Inter,sans-serif;color:#9aa4a8;margin:0 0 16px">As part of our mission to inform and inspire, we have created a space at the Brooklyn Navy Yard showcasing concepts of LED video and lighting elements.</p>' +
        '<div class="m-media" style="position:relative;height:168px;border-radius:6px;overflow:hidden;background:#2a2d31 url(' + IMG + '510-p-oculus.webp) center/cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,30,36,.1),rgba(28,30,36,.7))"></div><span style="position:absolute;left:10px;top:9px;font:500 6.5px Inter,sans-serif;letter-spacing:.16em;color:#d0e0e3">01 — STUDIO REEL</span><span class="m-live" style="position:absolute;right:10px;top:8px;font:600 6.5px Inter,sans-serif;letter-spacing:.12em;color:#fff;background:rgba(0,0,0,.45);padding:3px 6px">&#9679; PLAYING · MUTED</span><span class="m-play" style="position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border:1.5px solid rgba(255,255,255,.85);border-radius:50%;display:grid;place-items:center;color:#fff;font-size:11px">&#9654;</span><i class="m-prog"></i></div>' +
        '<div style="margin:28px 0 12px;font:500 7px Inter,sans-serif;letter-spacing:.16em;color:#fff">OUR PROCESS</div>' +
        '<div class="m-shapes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
          [['Consult', '<path d="M30 8L52 20v24L30 56 8 44V20zM8 20l22 12 22-12M30 32v24"/>'], ['Engineer', '<path d="M30 6l22 26-22 26L8 32zM8 32h44M30 6v52"/>'], ['Execute', '<path d="M30 6l20 12v24L30 54 10 42V18zM30 6l-8 20h16zM10 18l12 8M50 18l-12 8M22 26l-12 16M38 26l12 16M22 26l8 28 8-28"/>']].map(function(s){ return '<div style="border:1px solid #2c3036;padding:12px 6px 10px;text-align:center"><svg viewBox="0 0 60 62" style="width:48px;height:50px;fill:none;stroke:#5eead4;stroke-width:1.2;stroke-linejoin:round">' + s[1] + '</svg><div style="font:500 6.5px Inter,sans-serif;letter-spacing:.14em;color:#9aa4a8;margin-top:6px">' + s[0].toUpperCase() + '</div></div>'; }).join('') +
        '</div>' +
        '<div style="margin-top:22px;display:grid;gap:0;border-top:1px solid #2c3036">' + ['CONSULTING', 'ENGINEERING', 'EXECUTION'].map(function(s, i){ return '<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #2c3036;font:500 7.5px Inter,sans-serif;letter-spacing:.16em;color:#d0e0e3"><span>0' + (i + 1) + ' · ' + s + '</span><span>&#8594;</span></div>'; }).join('') + '</div>' +
        '<div style="margin-top:24px;background:#c9dcdf;color:#111;font:600 8.5px Inter,sans-serif;letter-spacing:.16em;padding:14px;text-align:center">CONTACT</div></div>',
      notes: [
        { t: 'Menu folds into a pill', d: 'All the links sit behind one tap, so the headline gets the screen.' },
        { t: 'Type scales, shape stays', d: 'The headline shrinks to fit a phone but keeps its bold, stacked shape.' },
        { t: 'Video plays inline', d: 'Reels play muted inside the page instead of taking over the screen.' },
        { t: '3D swaps to drawings', d: 'The heavy WebGL shapes become light line drawings to save battery.' }
      ],
      steps: [
        { note: 0, hold: .5 }, { tap: '.m-burger', toggle: 'menu', hold: 1.7 }, { tap: '.m-close', toggle: 'menu', hold: .5 },
        { note: 1, hold: 1.8 },
        { note: 2, scroll: '.m-media', off: 120, hold: .3 }, { tap: '.m-play', add: 'playing', hold: 2.4 },
        { note: 3, scroll: '.m-shapes', off: 140, hold: 2.2 },
        { note: -1, scroll: 0, remove: 'playing', hold: .6 }
      ]
    }
  },
  'daniel-aguirre-law': {
    file: 'Aguirre Law — Homepage', page: 'Homepage', frame: 'Desktop · Hero', url: 'danielaguirre.law',
    bg: '#FCF6EC', accent: '#891E2D', hover: 'cta',
    comment: { on: 'heading', by: 'Client', text: 'Could the proof sit right next to the headline?', reply: 'Moved the live case map into the hero, beside the promise.' },
    els: [
      { id: 'nav', name: 'Nav / cream glass', icon: 'comp', type: 'Component', x: 40, y: 18, w: 920, h: 42, wire: 'nav',
        props: { fill: '#FFFDF8' },
        html: '<div style="height:100%;border-radius:21px;background:rgba(255,253,248,.85);border:1px solid rgba(26,40,64,.08);box-shadow:0 8px 24px rgba(26,40,64,.08);display:flex;align-items:center;justify-content:space-between;padding:0 5px 0 18px"><b style="font:600 13px Lora,Georgia,serif;color:#1a2840">Daniel Aguirre</b><span style="display:flex;gap:20px;font:500 9px Inter,sans-serif;color:#1a2840"><span>Practice Areas</span><span>Case Results</span><span>Insights</span><span>About</span></span><span style="display:flex;gap:10px;align-items:center"><span style="font:600 8px Inter,sans-serif;color:#A88B5C">EN | ES</span><span style="background:#1a2840;color:#fff;font:600 8.5px Inter,sans-serif;padding:10px 14px;border-radius:16px">Free consultation</span></span></div>' },
      { id: 'heading', name: 'H1 / Cases won', icon: 'text', type: 'Text', x: 50, y: 112, w: 420, h: 180, wire: 'lines:4:big',
        props: { fill: '#1A2840', font: 'Lora', weight: 'SemiBold', size: '64', lh: '105%', ls: '-1%' },
        html: '<div style="display:flex;align-items:center;gap:10px;font:500 8.5px Inter,sans-serif;letter-spacing:.2em;color:#A88B5C"><i style="width:22px;height:1px;background:#A88B5C"></i>PROVEN NATIONWIDE</div><div style="font:600 44px/1.05 Lora,Georgia,serif;color:#1a2840;margin-top:14px;letter-spacing:-.01em">Immigration cases won, family by family.</div>' },
      { id: 'body', name: 'Body / intro', icon: 'text', type: 'Text', x: 50, y: 308, w: 380, h: 76, wire: 'lines:4',
        props: { fill: '#4A5568', font: 'Inter', weight: 'Regular', size: '16', lh: '160%' },
        html: '<p style="margin:0;font:400 11.5px/1.6 Inter,sans-serif;color:#4a5568">From asylum hearings and family reunification to green-card approvals and removal defense, the firm represents individuals and families across the United States.</p>' },
      { id: 'cta', name: 'Button / consultation', icon: 'comp', type: 'Component', x: 50, y: 400, w: 210, h: 38, wire: 'btn',
        props: { fill: '#1A2840', font: 'Inter', weight: 'Medium', size: '15' },
        html: '<div class="hv" style="height:100%;border-radius:4px;background:#1a2840;color:#fff;font:500 10.5px Inter,sans-serif;display:flex;align-items:center;justify-content:center;gap:8px">Schedule a free consultation &#8594;</div>' },
      { id: 'stats', name: 'Row / stats', icon: 'comp', type: 'Component', x: 50, y: 462, w: 300, h: 50, wire: 'row:3',
        props: { fill: '#1A2840', font: 'Inter', weight: 'Bold', size: '28' },
        html: '<div style="display:flex;gap:34px;border-top:1px solid rgba(26,40,64,.12);padding-top:12px">' + [['15', 'CASES', '#1a2840'], ['11', 'STATES', '#1a2840'], ['98%', 'SUCCESS RATE', '#2f6b3f']].map(function(s){ return '<div><b style="font:700 20px Inter,sans-serif;color:' + s[2] + '">' + s[0] + '</b><div style="font:500 7px Inter,sans-serif;letter-spacing:.16em;color:#7a8190;margin-top:2px">' + s[1] + '</div></div>'; }).join('') + '</div>' },
      { id: 'map', name: 'Map / case results (D3)', icon: 'img', type: 'Embed', x: 500, y: 110, w: 470, h: 311, wire: 'img',
        props: { fill: 'Canvas · D3' },
        html: '<div style="position:absolute;inset:0;background:url(' + IMG + 'ag-map-crop.webp) center/100% 100% no-repeat">' + [[10.3, 10.8], [56, 27.3], [66.5, 37.3], [93.8, 26], [35.5, 46], [9.2, 60.6], [50.8, 71.4], [75, 64.7]].map(function(p){ return '<span class="pop" style="left:' + p[0] + '%;top:' + p[1] + '%"></span>'; }).join('') + '</div>' },
      { id: 'chips', name: 'Filter / case type', icon: 'comp', type: 'Component', x: 520, y: 450, w: 450, h: 28, wire: 'row:5',
        props: { fill: '#FFFFFF', font: 'Inter', weight: 'Medium', size: '13' },
        html: '<div style="display:flex;gap:6px;align-items:center;font:500 8.5px Inter,sans-serif;color:#1a2840"><span style="font-weight:600;letter-spacing:.16em;font-size:7px;color:#7a8190;margin-right:4px">FILTER BY</span>' + ['All cases', 'Asylum', 'Family-Based', 'Removal Defense', 'Work Visa'].map(function(c, i){ return '<span style="padding:7px 11px;border-radius:14px;' + (i ? 'background:#fff;border:1px solid rgba(26,40,64,.12)' : 'background:#1a2840;color:#fff') + '">' + c + '</span>'; }).join('') + '</div>' }
    ],
    mobile: {
      bg: '#FCF6EC', statusFg: '#1a2840',
      nav: '<div style="position:absolute;left:10px;right:10px;top:44px;height:38px;border-radius:19px;background:rgba(255,253,248,.9);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 6px 18px rgba(26,40,64,.1);display:flex;align-items:center;justify-content:space-between;padding:0 5px 0 14px;z-index:4;color:#1a2840"><b style="font:600 12px Lora,Georgia,serif">Daniel Aguirre</b><span style="display:flex;align-items:center;gap:6px"><span class="m-lang" style="font:600 8.5px Inter,sans-serif;letter-spacing:.06em;color:#A88B5C;padding:6px 9px;border:1px solid rgba(168,139,92,.4);border-radius:12px"><span class="en">EN</span> | <span class="es">ES</span></span><span class="m-burger"><i></i><i></i><i></i></span></span></div>',
      menu: '<div style="position:absolute;inset:0;background:#FCF6EC;padding:106px 22px 0;color:#1a2840"><span class="m-close" style="position:absolute;right:15px;top:49px;color:#1a2840">&#10005;</span>' +
        ['Practice Areas', 'Case Results', 'Insights', 'About'].map(function(l){ return '<div style="font:600 24px/1.1 Lora,Georgia,serif;padding:12px 0;border-bottom:1px solid rgba(26,40,64,.1)">' + l + '</div>'; }).join('') +
        '<div style="margin-top:22px;background:#1a2840;color:#fff;font:500 11px Inter,sans-serif;padding:14px;text-align:center;border-radius:6px">Free consultation</div></div>',
      html: '<div style="padding:104px 18px 40px;color:#1a2840;font-family:Inter,sans-serif">' +
        '<div style="display:flex;align-items:center;gap:8px;font:500 7.5px Inter,sans-serif;letter-spacing:.2em;color:#A88B5C"><i style="width:16px;height:1px;background:#A88B5C"></i><span data-es="RESULTADOS EN TODO EL PAÍS">PROVEN NATIONWIDE</span></div>' +
        '<div data-es="Casos de inmigración ganados, familia por familia." style="font:600 30px/1.08 Lora,Georgia,serif;margin:10px 0 12px;letter-spacing:-.01em">Immigration cases won, family by family.</div>' +
        '<p data-es="Desde audiencias de asilo y reunificación familiar hasta green cards y defensa contra la deportación, la firma representa a familias en todo Estados Unidos." style="font:400 10.5px/1.6 Inter,sans-serif;color:#4a5568;margin:0 0 16px">From asylum hearings and family reunification to green-card approvals and removal defense, the firm represents families across the United States.</p>' +
        '<div class="m-cta" data-es="Agende una consulta gratis →" style="height:44px;border-radius:6px;background:#1a2840;color:#fff;font:500 11px Inter,sans-serif;display:flex;align-items:center;justify-content:center">Schedule a free consultation →</div>' +
        '<div style="display:flex;gap:24px;margin:18px 0 18px;padding-top:12px;border-top:1px solid rgba(26,40,64,.12)">' + [['15', 'CASES', 'CASOS', '#1a2840'], ['11', 'STATES', 'ESTADOS', '#1a2840'], ['98%', 'SUCCESS RATE', 'TASA DE ÉXITO', '#2f6b3f']].map(function(s){ return '<div><b style="font:700 18px Inter,sans-serif;color:' + s[3] + '">' + s[0] + '</b><div data-es="' + s[2] + '" style="font:500 6.5px Inter,sans-serif;letter-spacing:.16em;color:#7a8190;margin-top:2px">' + s[1] + '</div></div>'; }).join('') + '</div>' +
        '<div class="m-map" style="position:relative;height:207px;margin:0 -8px;background:url(' + IMG + 'ag-map-crop.webp) center/100% 100% no-repeat">' +
          [[10.3, 10.8, 'p1'], [56, 27.3, 'p3'], [50.8, 71.4, 'p2'], [75, 64.7, 'p4']].map(function(p){ return '<span class="m-pin ' + p[2] + '" style="left:' + p[0] + '%;top:' + p[1] + '%"></span>'; }).join('') +
          '<div class="m-card" style="position:absolute;left:14%;top:18%;width:170px;background:rgba(255,253,248,.95);border:1px solid rgba(168,139,92,.35);border-radius:10px;padding:10px 12px;box-shadow:0 10px 24px rgba(26,40,64,.18);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)"><div style="font:600 6.5px Inter,sans-serif;letter-spacing:.16em;color:#A88B5C">SAMPLE CASE · ASYLUM</div><div style="font:600 14px Lora,Georgia,serif;color:#1a2840;margin:4px 0 6px">Asylum granted</div><div style="font:500 8.5px Inter,sans-serif;color:#891E2D">View the case &#8594;</div></div>' +
        '</div>' +
        '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:12px">' + ['All cases', 'Asylum', 'Family-Based', 'Removal Defense'].map(function(c, i){ return '<span style="padding:6px 10px;border-radius:14px;font:500 8.5px Inter,sans-serif;' + (i ? 'background:#fff;border:1px solid rgba(26,40,64,.12)' : 'background:#1a2840;color:#fff') + '">' + c + '</span>'; }).join('') + '</div>' +
        '</div>',
      notes: [
        { t: 'Headline first, map beneath', d: 'On a phone the promise comes first and the proof follows.' },
        { t: 'English or Spanish in one tap', d: 'The whole page switches language and remembers the choice.' },
        { t: 'A thumb-sized consult button', d: 'Full width and within easy reach of a thumb.' },
        { t: 'Tap a pin for the case', d: 'There is no hover on touch, so a tap opens the case card.' }
      ],
      steps: [
        { note: 0, hold: 1.6 },
        { note: 1, hold: .3 }, { tap: '.m-lang', toggle: 'es', hold: 2 }, { tap: '.m-lang', toggle: 'es', hold: .5 },
        { note: 2, hold: .2 }, { tap: '.m-cta', hold: 1.2 },
        { note: 3, scroll: '.m-map', off: 150, hold: .4 }, { tap: '.m-pin.p2', add: 'card', hold: 2.4 },
        { note: -1, scroll: 0, remove: 'card', hold: .6 }
      ]
    }
  }
  };
  (function(){
    var m = MOCKS['510-visuals'];
    var TET = '<path d="M30 8L52 20v24L30 56 8 44V20zM8 20l22 12 22-12M30 32v24"/>', OCT = '<path d="M30 6l22 26-22 26L8 32zM8 32h44M30 6v52"/>', ICO = '<path d="M30 6l20 12v24L30 54 10 42V18zM30 6l-8 20h16zM10 18l12 8M50 18l-12 8M22 26l-12 16M38 26l12 16M22 26l8 28 8-28"/>';
    m.flow = { file: '510 Visuals — Service map', fg: '#FFFFFF', accent: '#5eead4',
      groups: [
        { name: 'Consulting', steps: ['Design analysis', 'Visualization'], solid: TET,
          copy: ['Source creative product solutions through an extensive network of suppliers.', 'Research and development for complex display configs, fabrication processes and installation challenges.', 'Visualization and planning for content design, media playback and interactive elements.'] },
        { name: 'Engineering', steps: ['Systems design', 'Prototyping'], solid: OCT,
          copy: ['Structural, electrical and control systems engineered for each installation.', 'Prototypes and mock-ups prove the build before fabrication starts.'] },
        { name: 'Execution', steps: ['Fabrication', 'Installation'], solid: ICO,
          copy: ['Fabrication managed through a network of trusted partners.', 'On-site installation, commissioning and handover.'] }
      ] };
    // globe render: the current production globe (code/vendor/510-globe.js) shot at 1600 x 955 on its default
    // North America view with pins + arcs off; overlay points are those pins projected with the same camera
    m.explode = { frame: 'Globe hero', bg: '#1c1e24', img: IMG + '510-globe-mesh.webp',
      pins: [[566, 359], [617, 382], [782, 397], [970, 368], [970, 503], [988, 333]], hq: [988, 333],
      arcs: ['M989 332Q752 121 564 358', 'M989 332Q810 180 616 381', 'M989 332Q929 274 782 396', 'M989 332Q994 333 971 367', 'M989 332Q1042 361 971 503'],
      leaders: ['M988 333L1110 301V286', 'M988 333L1125 164'],
      card: { pin: 2, at: [796, 430], img: IMG + '510-p-virtual-sky.webp', title: 'Virtual Sky', city: 'Oklahoma City, OK' } };
  })();
  // FigJam ideation board → the designed plan (same scene as 510's service map; every website mission gets one)
  MOCKS['daniel-aguirre-law'].flow = { file: 'Daniel Aguirre Law — Site plan', fg: '#FCF6EC', accent: '#A88B5C',
    groups: [
      { name: 'Plan', steps: ['Site map', 'Content model'], solid: '<path d="M22 8h16v10H22zM8 42h14v10H8zM38 42h14v10H38zM30 18v12M15 42V30h30v12"/>',
        copy: ['Ten pages mapped first, from the homepage to contact, with practice areas and hubs as templates.', 'Case Results, Practice Areas, Insights and Topics planned as linked CMS collections the firm edits itself.'] },
      { name: 'Design', steps: ['Wireframes', 'Cream glass'], solid: '<path d="M8 10h44v42H8zM8 20h44M16 28h28M16 34h18M36 42h10v4H36z"/>',
        copy: ['Wireframes put the live case map in the hero, right beside the promise.', 'A warm cream-glass language, frosted cards with a thin gold line, so it never reads as a stock law firm.'] },
      { name: 'Build', steps: ['Webflow build', 'English / Spanish'], solid: '<path d="M22 18L10 31l12 13M38 18l12 13-12 13M34 12l-8 38"/>',
        copy: ['Built custom in Webflow on Client-First, with the D3 case map as the hero.', 'Everything works in English and Spanish, and the firm updates content without a developer.'] }
    ] };
  // AB Identity: the sketch + Illustrator scenes are fully coded (geometry from AB.MARK), they only need to exist
  MOCKS['ab-identity'] = { accent: '#FF6A3D', sketch: true, vector: true };
  // Knowledge System: seven coded scenes (21-knowledge.js), generic example content
  MOCKS['knowledge-system'] = { accent: '#a597ff', graph: true, library: true, voice: true, setup: true, video: true, schema: true, portable: true };
  // CKS: the product site for the Knowledge System. Six coded scenes (22-cks.js, key `cks`, incl. its own woven site plan)
  // plus figma + phone. `live`: once getcks.io answers (its favicon loads), the live channels show the real page.
  (function(){
    // the hero loom, redrawn as SVG: warp lines plus eight bands of weft threads in the four thread colors
    function loom(w, h, n){
      var c = ['#F2A93B', '#EF5B3F', '#139E8A', '#2F5BEA'], g = w * .62 / n, s = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;display:block" aria-hidden="true">', i, y;
      for (y = 6; y < h; y += 10) s += '<path d="M0 ' + y + 'H' + w + '" stroke="rgba(11,27,43,.13)" stroke-width=".7"/>';
      for (i = 0; i < n; i++){
        var xt = w * .36 + i * g, xb = w * .02 + i * g;
        s += '<path d="M' + xt.toFixed(1) + ' -6C' + (xt + w * .22).toFixed(1) + ' ' + (h * .38).toFixed(1) + ' ' + (xb - w * .12).toFixed(1) + ' ' + (h * .62).toFixed(1) + ' ' + xb.toFixed(1) + ' ' + (h + 6) + '" fill="none" stroke="' + c[Math.floor(i / (n / 8)) % 4] + '" stroke-width="' + (g * .62).toFixed(2) + '" stroke-dasharray="7 1.6"/>';
      }
      return s + '</svg>';
    }
    var LOGO = '<svg viewBox="0 0 24 24" style="width:18px;height:18px;display:block" aria-hidden="true"><rect x="2.5" y="6" width="19" height="5" rx="1.2" fill="#EF5B3F"/><rect x="2.5" y="13" width="19" height="5" rx="1.2" fill="#139E8A"/><rect x="6" y="2.5" width="5" height="19" rx="1.2" fill="#F2A93B" stroke="#fff" stroke-width="1.4"/><rect x="13" y="2.5" width="5" height="19" rx="1.2" fill="#2F5BEA" stroke="#fff" stroke-width="1.4"/><rect x="12.3" y="6" width="6.4" height="5" fill="#EF5B3F"/><path d="M12.3 6V11M18.7 6V11" stroke="#fff" stroke-width="1.4"/><rect x="5.3" y="13" width="6.4" height="5" fill="#139E8A"/><path d="M5.3 13V18M11.7 13V18" stroke="#fff" stroke-width="1.4"/></svg>';
    // unquoted on purpose: these go inside style="..." attributes, where a double quote would end the attribute
    var F = 'Schibsted Grotesk,Inter,sans-serif';
    function chip(t, c){ return '<span style="display:inline-flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;border:1px solid rgba(11,27,43,.14);font:600 8px ' + F + '"><i style="width:6px;height:6px;border-radius:50%;background:' + c + '"></i>' + t + '</span>'; }
    MOCKS.cks = {
      accent: '#EF5B3F', cks: true,
      live: { base: 'https://getcks.io/', probe: 'favicon.svg', pages: { 'cks-styles': 'styles.html', 'cks-sketch': 'sketch.html' } },
      file: 'CKS — Product site', page: 'Home', frame: 'Desktop · Hero', url: 'getcks.io',
      bg: '#F7F5F0', accent2: '#2F5BEA', hover: 'cta',
      comment: { on: 'heading', by: 'Review', text: 'The headline fights the loom for attention.', reply: 'Faded the weave behind the copy and pushed the pattern right.' },
      els: [
        { id: 'loom', name: 'Canvas / loom', icon: 'img', type: 'Embed', x: 470, y: 0, w: 530, h: 625, wire: 'img',
          props: { fill: 'Canvas · 2D' },
          html: '<div style="position:absolute;inset:0;overflow:hidden">' + loom(530, 625, 40) + '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#F7F5F0 0%,rgba(247,245,240,.6) 22%,rgba(247,245,240,0) 48%)"></div></div>' },
        { id: 'nav', name: 'Nav / header', icon: 'comp', type: 'Component', x: 30, y: 14, w: 940, h: 40, wire: 'nav',
          props: { fill: '#FFFFFF' },
          html: '<div style="height:100%;border-radius:10px;background:rgba(255,255,255,.94);box-shadow:0 1px 0 rgba(11,27,43,.08);display:flex;align-items:center;gap:22px;padding:0 6px 0 14px;font:600 9.5px ' + F + ';color:#0B1B2B">' + LOGO + '<b style="font:800 13px ' + F + ';margin-left:-14px">CKS</b><span>Product ▾</span><span>Resources ▾</span><span>Pricing</span><span style="margin-left:auto;padding:6px 10px;border:1px solid rgba(11,27,43,.14);border-radius:999px;color:#5F6B78;font-weight:500">Search · Ctrl K</span><span style="background:#0B1B2B;color:#fff;padding:9px 13px;border-radius:999px">Book an install</span></div>' },
        { id: 'heading', name: 'H1 / Turn what you know', icon: 'text', type: 'Text', x: 40, y: 104, w: 470, h: 250, wire: 'lines:4:big',
          props: { fill: '#0B1B2B', font: 'Schibsted Grotesk', weight: 'ExtraBold', size: '76', lh: '102%', ls: '-3.5%' },
          html: '<div style="font:800 51px/1.02 ' + F + ';letter-spacing:-.035em;color:#0B1B2B">Turn what you know into a site people and AI can follow.</div>' },
        { id: 'lede', name: 'Lede / what CKS does', icon: 'text', type: 'Text', x: 40, y: 368, w: 420, h: 92, wire: 'lines:5',
          props: { fill: '#3E4C5B', font: 'Schibsted Grotesk', weight: 'Regular', size: '18', lh: '155%' },
          html: '<p style="margin:0;font:400 11.5px/1.55 ' + F + ';color:#3E4C5B">Your point of view lives in your head, your decks and your calls. CKS captures it on your website, where clients can <em style="font-family:Newsreader,Georgia,serif">find it, learn from it and trust it</em>, tied together by one shared vocabulary.</p>' },
        { id: 'cta', name: 'Buttons / hero', icon: 'comp', type: 'Component', x: 40, y: 478, w: 320, h: 38, wire: 'btn',
          props: { fill: '#0B1B2B', font: 'Schibsted Grotesk', weight: 'Bold', size: '15' },
          html: '<div style="display:flex;gap:8px;height:100%"><span class="hv" style="flex:1;border-radius:999px;background:#0B1B2B;color:#fff;font:700 10px ' + F + ';display:flex;align-items:center;justify-content:center">See it match your site ›</span><span style="flex:1;border-radius:999px;border:1px solid rgba(11,27,43,.25);color:#0B1B2B;font:700 10px ' + F + ';display:flex;align-items:center;justify-content:center">Book an install ›</span></div>' },
        { id: 'entry', name: 'Card / one entry, tagged once', icon: 'comp', type: 'Component', x: 612, y: 400, w: 350, h: 180, wire: 'row:4',
          props: { fill: '#FFFFFF', font: 'Schibsted Grotesk', weight: 'Bold', size: '17' },
          html: '<div style="height:100%;background:#fff;border-radius:12px;box-shadow:0 30px 60px -30px rgba(11,27,43,.45),0 0 0 1px rgba(11,27,43,.1);padding:12px 14px;display:flex;flex-direction:column;gap:9px;font-family:' + F + '"><div style="display:flex;gap:8px;align-items:center;font:600 8.5px ' + F + ';color:#5F6B78"><b style="color:#0B1B2B">New insight</b>by you<span style="margin-left:auto;color:#0B6F61;background:#E3F4F1;border-radius:999px;padding:3px 8px">● Published</span></div><b style="font:800 15px ' + F + ';color:#0B1B2B">Onboarding is a design problem</b><div style="display:flex;gap:5px;flex-wrap:wrap">' + chip('Client onboarding', '#F2A93B') + chip('Service design', '#EF5B3F') + chip('Journey mapping', '#139E8A') + '</div><div style="margin-top:auto;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(11,27,43,.1);padding-top:8px">' + [['3', 'topic pages'], ['2', 'projects'], ['1', 'service'], ['9', 'links built']].map(function(s){ return '<div><b style="font:800 14px ' + F + ';color:#0B1B2B">' + s[0] + '</b><div style="font:500 7px ' + F + ';color:#5F6B78">' + s[1] + '</div></div>'; }).join('') + '</div></div>' }
      ],
      mobile: {
        bg: '#F7F5F0', statusFg: '#0B1B2B',
        nav: '<div class="cxm-nav" style="position:absolute;left:10px;right:10px;top:42px;height:38px;border-radius:12px;background:rgba(255,255,255,.94);box-shadow:0 6px 18px rgba(11,27,43,.1);display:flex;align-items:center;gap:8px;padding:0 8px 0 12px;z-index:4;color:#0B1B2B;transition:background .5s,color .5s">' + LOGO + '<b style="font:800 12px ' + F + '">CKS</b><span style="margin-left:auto;display:flex;gap:6px;align-items:center"><span style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(11,27,43,.14)"><svg viewBox="0 0 20 20" style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.6 12.6 17 17"/></svg></span><span class="m-theme" style="width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(11,27,43,.14)"><svg viewBox="0 0 20 20" style="width:12px;height:12px;fill:currentColor"><path d="M10 3a7 7 0 100 14 5.5 5.5 0 010-14z"/></svg></span><span class="m-burger"><i></i><i></i><i></i></span></span></div>',
        menu: '<div style="position:absolute;inset:0;background:#F7F5F0;padding:100px 22px 0;color:#0B1B2B;font-family:' + F + '"><span class="m-close" style="position:absolute;right:16px;top:50px">&#10005;</span>' +
          ['How it works', 'Styles', 'Voice Kit', 'Sketch your system', 'Pricing'].map(function(l){ return '<div style="font:800 22px/1 ' + F + ';letter-spacing:-.02em;padding:13px 0;border-bottom:1px solid rgba(11,27,43,.1)">' + l + '</div>'; }).join('') +
          '<div style="margin-top:22px;background:#0B1B2B;color:#fff;font:700 11px ' + F + ';padding:14px;text-align:center;border-radius:999px">Book an install</div></div>',
        html: '<div class="cxm" style="padding:88px 18px 40px">' +
          '<div class="cxm-loom">' + loom(300, 150, 28) + '</div>' +
          '<div style="font:800 29px/1.03 ' + F + ';letter-spacing:-.035em;margin-bottom:10px">Turn what you know into a site people and AI can follow.</div>' +
          '<p style="font:400 10.5px/1.55 ' + F + ';color:var(--i2);margin:0 0 14px">Your point of view lives in your head, your decks and your calls. CKS captures it on your website, tied together by one shared vocabulary.</p>' +
          '<div style="display:flex;gap:6px;margin-bottom:26px"><span style="flex:1;text-align:center;background:#0B1B2B;color:#fff;border-radius:999px;padding:11px 6px;font:700 9.5px ' + F + '">See it match your site</span><span style="flex:1;text-align:center;border:1px solid var(--l);border-radius:999px;padding:11px 6px;font:700 9.5px ' + F + '">Book an install</span></div>' +
          '<div class="m-story" style="font:800 19px/1.08 ' + F + ';letter-spacing:-.02em;margin-bottom:10px">Most sites list what you do. Few show how it connects.</div>' +
          '<div style="display:flex;gap:4px;margin-bottom:10px">' + ['Scattered', 'Name', 'Tag once', 'Connected'].map(function(s, i){ return '<span class="cxm-st s' + i + (i === 3 ? ' m-st3' : '') + '">' + s + '</span>'; }).join('') + '</div>' +
          '<div class="cxm-b"><svg viewBox="0 0 262 190" preserveAspectRatio="none"><path d="M55 40Q90 60 131 78" stroke="#F2A93B"/><path d="M205 40Q170 60 131 78" stroke="#F2A93B"/><path d="M55 150Q90 120 131 78" stroke="#F2A93B"/><path d="M205 150Q170 125 131 78" stroke="#139E8A"/></svg>' +
            '<span class="t" style="left:50%;top:41%;background:#F2A93B">Client onboarding</span>' +
            [['Onboarding redesign', 8, 12, 9, 12, -5], ['Riverside Clinic', 150, 18, 159, 12, 4], ['Onboarding is a design problem', 30, 118, 9, 128, 3], ['The first 30 days', 144, 132, 159, 128, -6]].map(function(c, i){ return '<span class="c cc' + i + '" style="left:' + c[1] + 'px;top:' + c[2] + 'px;transform:rotate(' + c[5] + 'deg)">' + c[0] + '</span>'; }).join('') + '</div>' +
          '<div class="m-map" style="font:800 19px/1.08 ' + F + ';letter-spacing:-.02em;margin:24px 0 10px">Follow the threads. Then add your own.</div>' +
          [['Client onboarding', '#C7832A', '4 pieces'], ['Service design', '#EF5B3F', '5 pieces'], ['Journey mapping', '#139E8A', '4 pieces'], ['Client handoffs', '#2F5BEA', '4 pieces']].map(function(t){ return '<div class="cxm-card" style="display:flex;align-items:center;gap:8px;padding:9px 10px;margin-bottom:6px;font:700 10px ' + F + '"><i style="width:9px;height:9px;border-radius:50%;background:' + t[1] + '"></i>' + t[0] + '<span style="margin-left:auto;font:500 8.5px ' + F + ';color:var(--i2)">' + t[2] + ' ›</span></div>'; }).join('') +
          '<div style="margin-top:22px;font:800 19px/1.08 ' + F + ';letter-spacing:-.02em;margin-bottom:10px">Three ways to install it.</div>' +
          [['Foundation', '#F2A93B', '$4,000'], ['Library', '#EF5B3F', '$9,000'], ['Full System', '#2F5BEA', '$16,000']].map(function(p){ return '<div class="cxm-card" style="padding:10px 12px;margin-bottom:6px;border-top:3px solid ' + p[1] + ';display:flex;justify-content:space-between;font:800 11px ' + F + '">' + p[0] + '<span style="font-weight:600;color:var(--i2)">From ' + p[2] + '</span></div>'; }).join('') +
          '</div>',
        notes: [
          { t: 'The loom rides above the headline', d: 'On a phone the weave becomes a band over the copy, so the headline never has to fight it.' },
          { t: 'Light or dark, one token swap', d: 'Every color is a variable, so dark mode is a swap at the top of the stylesheet, not a second design.' },
          { t: 'The story becomes step buttons', d: 'No pinned scroll on a small screen. Tap a step and the loose pages weave together.' },
          { t: 'The map turns into a list', d: 'Under 700px the knowledge map shows the same topics as a list you can tap through.' }
        ],
        steps: [
          { note: 0, hold: 1.8 },
          { note: 1, hold: .3 }, { tap: '.m-theme', toggle: 'dark', hold: 1.9 }, { tap: '.m-theme', toggle: 'dark', hold: .5 },
          { note: 2, scroll: '.m-story', off: 110, hold: .4 }, { tap: '.m-st3', add: 'woven', hold: 2.6 },
          { note: 3, scroll: '.m-map', off: 120, hold: 2.2 },
          { note: -1, scroll: 0, remove: 'woven', hold: .6 }
        ]
      }
    };
  })();
  // kip: a concept baby log (kip-site/kip). Figma frame = the home hero; phone = the Today screen and the shift handoff,
  // copy taken from the site's app screens. Image channels are recorded loops of the real site, served from this repo on
  // jsDelivr (`img`: channel id → [loop, still]); the loop plays unless reduced motion or Save-Data asks for the still.
  (function(){
    // the six characters, from the site's press-kit SVGs (kip-site/kip/img/kit)
    var KC = {
      ari: '<path d="M60 10C86 10 104 36 106 64c2 30-16 50-46 50S12 94 14 64C16 36 34 10 60 10Z" fill="#FF7A45"/><path d="M58 11c-4-9 4-15 12-11" fill="none" stroke="#FF7A45" stroke-width="7" stroke-linecap="round"/><ellipse cx="40" cy="72" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="80" cy="72" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="47" cy="62" r="4.6" fill="#1E1B2E"/><circle cx="73" cy="62" r="4.6" fill="#1E1B2E"/><path d="M53 75 Q60 82 67 75" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/>',
      sam: '<rect x="24" y="8" width="72" height="108" rx="36" fill="#6FA8FF"/><path d="M52 10c2-8 12-8 14-2" fill="none" stroke="#6FA8FF" stroke-width="6" stroke-linecap="round"/><path d="M44 44h10M66 44h10" stroke="#1E1B2E" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="42" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="78" cy="66" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="49" cy="56" r="4.6" fill="#1E1B2E"/><circle cx="71" cy="56" r="4.6" fill="#1E1B2E"/><path d="M52 67 Q60 79 68 67 Z" fill="#1E1B2E"/>',
      nana: '<circle cx="60" cy="22" r="13" fill="#FFC94A"/><path d="M8 114C8 58 28 32 60 32s52 26 52 82Z" fill="#FFC94A"/><ellipse cx="38" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="82" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="45" cy="72" r="4.6" fill="#1E1B2E"/><circle cx="75" cy="72" r="4.6" fill="#1E1B2E"/><path d="M53 85 Q60 92 67 85" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/><circle cx="45" cy="72" r="10" fill="none" stroke="#1E1B2E" stroke-width="2.8"/><circle cx="75" cy="72" r="10" fill="none" stroke="#1E1B2E" stroke-width="2.8"/><path d="M55 72h10" stroke="#1E1B2E" stroke-width="2.8"/>',
      rosa: '<path d="M60 24c-6-12 0-20 10-22 2 10-2 18-10 22Z" fill="#2E9E76"/><path d="M60 24c-4-10-14-12-22-8 4 8 12 11 22 8Z" fill="#5FD3A8"/><path d="M20 58c0-24 14-34 40-34s40 10 40 34v20c0 26-14 36-40 36S20 104 20 78Z" fill="#5FD3A8"/><ellipse cx="40" cy="76" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="80" cy="76" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><circle cx="47" cy="66" r="4.6" fill="#1E1B2E"/><circle cx="73" cy="66" r="4.6" fill="#1E1B2E"/><path d="M53 79 Q60 86 67 79" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/>',
      jo: '<g fill="#FF8FA3"><circle cx="38" cy="44" r="24"/><circle cx="82" cy="44" r="24"/><circle cx="60" cy="32" r="24"/><circle cx="30" cy="80" r="26"/><circle cx="90" cy="80" r="26"/><rect x="28" y="40" width="64" height="74" rx="30"/></g><ellipse cx="40" cy="76" rx="6" ry="3.6" fill="#FF7A45" opacity=".55"/><ellipse cx="80" cy="76" rx="6" ry="3.6" fill="#FF7A45" opacity=".55"/><path d="M42 68 Q47 61 52 68" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/><path d="M68 68 Q73 61 78 68" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/><path d="M53 79 Q60 86 67 79" fill="none" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round"/>',
      june: '<path d="M60 26c30 0 48 22 48 48s-18 40-48 40-48-14-48-40 18-48 48-48Z" fill="#FFF4E6" stroke="#1E1B2E" stroke-width="4"/><path d="M58 27c-8-10 0-20 10-16 6 3 2 10-3 8" fill="none" stroke="#1E1B2E" stroke-width="4" stroke-linecap="round"/><ellipse cx="39" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><ellipse cx="81" cy="82" rx="6" ry="3.6" fill="#FF8FA3" opacity=".55"/><path d="M41 71 Q46 76 51 71" fill="none" stroke="#1E1B2E" stroke-width="3.2" stroke-linecap="round"/><path d="M69 71 Q74 76 79 71" fill="none" stroke="#1E1B2E" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="60" cy="86" rx="3.2" ry="3.8" fill="#1E1B2E"/>'
    };
    function ch(n, s){ return '<svg viewBox="0 0 120 120" style="width:' + s + 'px;height:' + s + 'px;display:block;flex:none" aria-hidden="true">' + KC[n] + '</svg>'; }
    var MARK = '<svg viewBox="0 0 64 64" style="width:15px;height:15px;display:block" aria-hidden="true"><path d="M32 4C50 4 60 18 60 34S50 60 32 60 4 50 4 34 14 4 32 4Z" fill="#FF7A45"/><path d="M38 16a14 14 0 1 0 12 22 11 11 0 1 1-12-22Z" fill="#FFF4E6"/><circle cx="24" cy="40" r="3" fill="#1E1B2E"/></svg>';
    // unquoted on purpose: these go inside style="..." attributes
    // "Baloo 2" must be quoted: an unquoted family name with a bare number is invalid CSS and drops the whole font shorthand
    var H = "'Baloo 2','Arial Rounded MT Bold',ui-rounded,sans-serif", B = 'Nunito Sans,system-ui,sans-serif';
    var INK = '#1E1B2E', TAN = '#FF7A45', CREAM = '#FFF4E6', BUTTER = '#FFC94A', MINT = '#5FD3A8', SKY = '#6FA8FF', ROSE = '#FF8FA3';
    var LOOP = 'https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.28.0/prototypes/img/';
    // one log entry, as on the site: face, icon tint, what, who and when
    function entry(who, name, tint, what, when, cls){
      return '<div class="kxe' + (cls ? ' ' + cls : '') + '" style="display:flex;align-items:center;gap:8px;background:#fff;border:2px solid ' + INK + ';border-radius:14px;padding:6px 9px;margin-bottom:6px">' + ch(who, 26) +
        '<span style="display:flex;flex-direction:column;min-width:0"><b style="font:800 10.5px/1.2 ' + B + ';color:' + INK + '"><i style="display:inline-block;width:8px;height:8px;border-radius:3px;background:' + tint + ';margin-right:5px"></i>' + what + '</b><span style="font:400 8.5px/1.3 ' + B + ';color:#4A4560">logged by <b>' + name + '</b> · ' + when + '</span></span></div>';
    }
    var LOG = entry('nana', 'Nana', MINT, 'Diaper · wet', '1:52 pm') + entry('rosa', 'Rosa', '#14204F', 'Nap · 1h 40m', '11:30 am') + entry('sam', 'Sam', TAN, 'Breast · L 12m, R 9m', '11:05 am') + entry('ari', 'Ari', ROSE, 'Vitamin D · as directed', '9:02 am');
    MOCKS.kip = {
      accent: TAN,
      fontCss: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito+Sans:wght@400;700;800&display=swap',
      img: {
        story: [LOOP + 'kip-ch-story-anim.webp', LOOP + 'kip-ch-story.webp'],
        roles: [LOOP + 'kip-ch-roles-anim.webp', LOOP + 'kip-ch-roles.webp'],
        night: [LOOP + 'kip-ch-night-anim.webp', LOOP + 'kip-ch-night.webp'],
        report: [LOOP + 'kip-ch-report-anim.webp', LOOP + 'kip-ch-report.webp'],
        cast: [LOOP + 'kip-ch-cast-anim.webp', LOOP + 'kip-ch-cast.webp'],
        'try': [LOOP + 'kip-ch-try-anim.webp', LOOP + 'kip-ch-try.webp']
      },
      file: 'kip — Product site', page: 'Home', frame: 'Desktop · Hero', url: 'kip (concept)',
      bg: TAN, hover: 'cta',
      comment: { on: 'phone', by: 'Review', text: 'A Tylenol dose for an 8-week-old in the sample log reads like dosing advice.', reply: 'Every example dose is now vitamin D, as directed. The site shows patterns, never doses.' },
      els: [
        { id: 'blob', name: 'Shape / butter blob', icon: 'img', type: 'Vector', x: 590, y: 150, w: 360, h: 475, wire: 'img',
          props: { fill: BUTTER },
          html: '<div style="position:absolute;inset:0;background:' + BUTTER + ';border-radius:46% 54% 50% 50% / 55% 50% 50% 45%"></div>' },
        { id: 'nav', name: 'Nav / header', icon: 'comp', type: 'Component', x: 0, y: 0, w: 1000, h: 46, wire: 'nav',
          props: { fill: CREAM },
          html: '<div style="height:100%;background:' + CREAM + ';border-bottom:2px solid ' + INK + ';display:flex;align-items:center;gap:16px;padding:0 20px 0 26px;font:700 9px ' + B + ';color:' + INK + '">' + MARK + '<b style="font:800 15px ' + H + ';margin-left:-10px">kip</b><span style="margin-left:auto;background:' + BUTTER + ';border:2px solid ' + INK + ';border-radius:999px;padding:3px 9px">Home</span><span>Village</span><span>Insights</span><span>Try it</span><span>Pricing</span><span style="border:2px solid ' + INK + ';border-radius:999px;padding:3px 9px;font-weight:400">Search · Ctrl K</span><span style="background:' + INK + ';color:' + CREAM + ';border-radius:999px;padding:6px 11px">Try it yourself</span></div>' },
        { id: 'heading', name: 'H1 / One little log', icon: 'text', type: 'Text', x: 48, y: 96, w: 500, h: 204, wire: 'lines:3:big',
          props: { fill: INK, font: 'Baloo 2', weight: 'ExtraBold', size: '112', lh: '90%', ls: '-2.5%' },
          html: '<div style="font:800 64px/.92 ' + H + ';letter-spacing:-.025em;color:' + INK + '"><div>One little log.</div><div>The whole village</div><div>in it.</div></div>' },
        { id: 'lede', name: 'Lede / what kip does', icon: 'text', type: 'Text', x: 48, y: 320, w: 440, h: 74, wire: 'lines:4',
          props: { fill: INK, font: 'Nunito Sans', weight: 'Regular', size: '21', lh: '150%' },
          html: '<p style="margin:0;font:400 13px/1.5 ' + B + ';color:' + INK + '">kip keeps track of June’s feeds, naps, diapers and meds, with everyone who looks after her writing in the same place. So nobody has to text “did she eat?” at 2pm ever again.</p>' },
        { id: 'cta', name: 'Buttons / hero', icon: 'comp', type: 'Component', x: 48, y: 414, w: 330, h: 42, wire: 'btn',
          props: { fill: CREAM, font: 'Nunito Sans', weight: 'ExtraBold', size: '17' },
          html: '<div style="display:flex;gap:10px;height:100%"><span class="hv" style="flex:1;border-radius:999px;background:' + CREAM + ';color:' + INK + ';border:2px solid ' + INK + ';box-shadow:0 4px 0 ' + INK + ';font:800 10.5px ' + B + ';display:flex;align-items:center;justify-content:center">▶ Try it yourself</span><span style="flex:1;border-radius:999px;background:' + INK + ';color:' + CREAM + ';font:800 10.5px ' + B + ';display:flex;align-items:center;justify-content:center">Join early access</span></div>' },
        { id: 'note', name: 'Note / this is a concept', icon: 'text', type: 'Text', x: 48, y: 480, w: 440, h: 44, wire: 'lines:2',
          props: { fill: INK, font: 'Nunito Sans', weight: 'Bold', size: '15' },
          html: '<div style="display:flex;gap:9px;align-items:center;font:700 9.5px/1.4 ' + B + ';color:' + INK + '">' + ch('june', 30) + '<span>kip is a concept. There’s no app to download, just this site and a baby named June, who is 8 weeks old and made up.</span></div>' },
        { id: 'phone', name: 'Phone / Today screen', icon: 'comp', type: 'Component', x: 646, y: 84, w: 248, h: 541, wire: 'img',
          props: { fill: CREAM },
          html: '<div style="position:absolute;inset:0;background:' + INK + ';border-radius:38px 38px 0 0;padding:9px 9px 0"><div style="height:100%;background:' + CREAM + ';border-radius:30px 30px 0 0;padding:26px 12px 0;overflow:hidden">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' + ch('june', 32) + '<span><b style="display:block;font:800 15px/1 ' + H + ';color:' + INK + '">June</b><span style="font:400 8.5px ' + B + ';color:#4A4560">8 weeks, 2 days</span></span><span style="margin-left:auto;display:flex">' + ch('ari', 20) + ch('sam', 20) + ch('rosa', 20) + '</span></div>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px">' + [[TAN, 'Feed'], ['#14204F', 'Sleep'], [MINT, 'Diaper'], [ROSE, 'Med']].map(function(q){ return '<span style="text-align:center;font:800 7.5px ' + B + ';color:' + INK + '"><i style="display:block;height:30px;border-radius:10px;border:2px solid ' + INK + ';background:' + q[0] + ';margin-bottom:3px"></i>' + q[1] + '</span>'; }).join('') + '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px"><b style="font:800 12px ' + H + ';color:' + INK + '">Today</b><span style="font:400 8px ' + B + ';color:#4A4560">9 entries from 4 people</span></div>' +
            entry('nana', 'Nana', TAN, 'Bottle · 4 oz', '2:14 pm') + LOG + '</div></div>' }
      ],
      mobile: {
        bg: CREAM, statusFg: INK,
        html: '<style>' +
          '.kxm .kxe.kx-in{max-height:0;margin:0;padding-top:0;padding-bottom:0;border-width:0;opacity:0;overflow:hidden;transition:max-height .5s,margin .5s,padding .5s,opacity .4s}' +
          '.ph.kx-new .kxm .kxe.kx-in{max-height:60px;margin-bottom:6px;padding:6px 9px;border-width:2px;opacity:1}' +
          '.kxm .kx-ban{position:absolute;left:10px;right:10px;top:44px;z-index:5;transform:translateY(-140%);transition:transform .45s cubic-bezier(.3,1.4,.5,1)}' +
          '.ph.kx-banner .kxm .kx-ban{transform:none}' +
          '.kxm .kx-ho{position:absolute;inset:0;z-index:6;background:' + CREAM + ';padding:62px 16px 0;transform:translateY(100%);transition:transform .55s cubic-bezier(.2,.8,.2,1)}' +
          '.ph.kx-ho .kxm .kx-ho{transform:none}' +
          '</style>' +
          '<div class="kxm" style="padding:56px 14px 30px;font-family:' + B + ';color:' + INK + '">' +
            '<div style="display:flex;align-items:center;gap:9px;margin-bottom:12px">' + ch('june', 40) + '<span><b style="display:block;font:800 19px/1 ' + H + '">June</b><span style="font:400 10px ' + B + ';color:#4A4560">8 weeks, 2 days</span></span><span style="margin-left:auto;display:flex">' + ch('ari', 24) + ch('sam', 24) + ch('rosa', 24) + '</span></div>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">' + [[TAN, 'Feed'], ['#14204F', 'Sleep'], [MINT, 'Diaper'], [ROSE, 'Med']].map(function(q){ return '<span style="text-align:center;font:800 9px ' + B + '"><i style="display:block;height:44px;border-radius:14px;border:2px solid ' + INK + ';background:' + q[0] + ';margin-bottom:4px"></i>' + q[1] + '</span>'; }).join('') + '</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px"><b style="font:800 15px ' + H + '">Today</b><span style="font:400 9.5px ' + B + ';color:#4A4560">entries from 4 people</span></div>' +
            entry('nana', 'Nana', TAN, 'Bottle · 4 oz', '2:14 pm', 'kx-in') + LOG +
          '</div>',
        nav: '<div class="kxm"><div class="kx-ban" style="background:' + INK + ';color:' + CREAM + ';border-radius:16px;padding:9px 11px;display:flex;align-items:center;gap:9px;box-shadow:0 10px 24px rgba(30,27,46,.35);font-family:' + B + '">' + ch('rosa', 28) + '<span><b style="display:block;font:800 11px ' + B + '">Rosa started her shift</b><span style="font:400 9px ' + B + ';opacity:.8">Here’s what you missed. Tap to hand over.</span></span></div>' +
          '<div class="kx-ho">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">' + ch('rosa', 44) + '<b style="font:800 19px/1.1 ' + H + ';color:' + INK + '">Hi Rosa. Since you left:</b></div>' +
            '<p style="margin:0 0 12px;font:400 10px ' + B + ';color:#4A4560">Monday 6:10 pm to now, logged by Ari, Sam and Jo</p>' +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">' + [['2', 'feeds', TAN], ['1', 'nap', SKY], ['3', 'diapers', MINT]].map(function(s){ return '<div style="border:2px solid ' + INK + ';border-radius:14px;background:' + s[2] + ';padding:10px 8px;text-align:center;color:' + INK + '"><b style="display:block;font:800 24px/1 ' + H + '">' + s[0] + '</b><span style="font:700 9.5px ' + B + '">' + s[1] + '</span></div>'; }).join('') + '</div>' +
            '<div style="border:2px solid ' + INK + ';border-radius:14px;background:#fff;padding:10px 12px;margin-bottom:16px;font:400 10px ' + B + ';color:' + INK + '"><b style="display:block;font:800 11px ' + B + '">Last feed</b>11:05 by Sam</div>' +
            '<div class="kx-go" style="background:' + INK + ';color:' + CREAM + ';border-radius:999px;padding:13px;text-align:center;font:800 12px ' + B + '">Start my shift</div>' +
          '</div></div>',
        notes: [
          { t: 'One shared log', d: 'Every feed, nap and diaper carries the face of whoever logged it.' },
          { t: 'Someone else logged it', d: 'Nana’s bottle lands at the top of the same list everyone sees.' },
          { t: 'The handoff', d: 'When Rosa starts her shift, one tap shows everything since she left.' },
          { t: 'Start informed', d: 'She taps Start my shift and she’s caught up, with no phone call.' }
        ],
        steps: [
          { note: 0, hold: 1.8 },
          { note: 1, add: 'kx-new', hold: 2 },
          { note: 2, add: 'kx-banner', hold: 1.1 }, { tap: '.kx-ban', add: 'kx-ho', hold: 2.6 },
          { note: 3, tap: '.kx-go', remove: 'kx-ho', hold: .3 }, { remove: 'kx-banner', hold: 1.6 },
          { note: -1, remove: 'kx-new', hold: .6 }
        ]
      }
    };
  })();
  MOCKS['daniel-aguirre-law'].cms = {
    site: 'Daniel Aguirre Law', collection: 'Case Results', url: 'danielaguirre.law',
    eyebrow: 'PROVEN NATIONWIDE', title: 'Immigration cases won, family by family.',
    body: 'From asylum hearings and family reunification to green-card approvals and removal defense, the firm represents individuals and families across the United States.',
    cta: 'Schedule a free consultation →', nav: ['Practice Areas', 'Case Results', 'Insights', 'About'], chips: ['Asylum', 'Family-Based', 'Removal Defense'],
    fields: [
      { k: 'Name', v: 'Asylum granted — sample case', req: true, wide: true },
      { k: 'Case type', v: 'Asylum', select: true },
      { k: 'Outcome', v: 'Granted', select: true },
      { k: 'City', v: 'Phoenix' },
      { k: 'State', v: 'Arizona', select: true },
      { k: 'Summary', v: 'A family facing persecution was granted asylum after a full merits hearing.', wide: true, area: true }
    ],
    stats: [{ k: 'Cases', v: '15', to: 16 }, { k: 'States', v: '11', to: 12 }, { k: 'Success rate', v: '98%', c: '#2f6b3f' }],
    pin: [19, 63], cardKicker: 'Sample case · Asylum', cardTitle: 'Asylum granted', cardMeta: 'Phoenix, AZ · View the case →'
  };


  /* ===== mission/20-scenes.js ===== */
  /* =========================================================
     MISSION CONTROL SCENES
     figma : a coded Figma file that goes wireframe → design → review → build → live
     phone : a coded phone running the mobile layout, with the decisions behind it
     sketch: AB Identity, pen + paper iterations (v01 → v25), rejects crossed out, the winner circled
     vector: AB Identity, the mark traced in a coded Illustrator (pen tool, Pathfinder, token colors, export)
     Both are drawn on a fixed stage (1200×750, or 640×800 on phones) and scaled to fit.
     ========================================================= */
  var SCENE = (function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scenes = {}, active = null, EXT = {};
    function mk(tag, cls, html){ var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
    function q(r, s){ return r.querySelector(s); }
    function qa(r, s){ return Array.prototype.slice.call(r.querySelectorAll(s)); }
    function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var ICON_PAUSE = '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1" width="2.5" height="8"/><rect x="6" y="1" width="2.5" height="8"/></svg>';
    var ICON_PLAY = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1l7 4-7 4z"/></svg>';

    function mount(view, c, M){
      if (!M.mock) return;
      var sc = { id: c.id, kind: c.kind, view: view, c: c, M: M, inView: false, paused: false, started: false };
      scenes[c.id] = sc;
      build(sc);
      if (window.ResizeObserver) new ResizeObserver(function(){
        var p = view.clientHeight > view.clientWidth * 1.02;
        if (p !== sc.portrait){ var t = sc.tl ? sc.tl.time() : 0; if (sc.tl) sc.tl.kill(); build(sc); if (sc.started) { sc.tl.seek(Math.min(t, sc.tl.duration() - .1)); if (sc.onSeek) sc.onSeek(); } sync(sc); }
        else fit(sc);
      }).observe(view);
      new IntersectionObserver(function(es){ sc.inView = es[0].isIntersecting; sync(sc); }, { rootMargin: '100px' }).observe(view);
    }
    function build(sc){
      var v = sc.view; sc.portrait = v.clientHeight > v.clientWidth * 1.02;
      sc.SW = sc.portrait ? 640 : 1200; sc.SH = sc.portrait ? 800 : 750;
      qa(v, '.stg-w,.scn-ctl').forEach(function(n){ n.parentNode.removeChild(n); });
      var w = mk('div', 'stg-w'); sc.stg = mk('div', 'stg' + (sc.portrait ? ' is-p' : '') + ' stg-' + sc.kind);
      sc.stg.style.width = sc.SW + 'px'; sc.stg.style.height = sc.SH + 'px';
      sc.stg.style.setProperty('--acc', sc.M.mock.accent || '#FF6A3D');
      // a mission can bring its own typefaces for its mock scenes (kip: Baloo 2 + Nunito Sans), loaded once
      if (sc.M.mock.fontCss && !document.getElementById('mk-fonts')){ var fl = document.createElement('link'); fl.id = 'mk-fonts'; fl.rel = 'stylesheet'; fl.href = sc.M.mock.fontCss; document.head.appendChild(fl); }
      w.appendChild(sc.stg); v.appendChild(w);
      (EXT[sc.kind] || ({ figma: buildFigma, phone: buildPhone, flow: buildFlow, exploded: buildExplode, cms: buildCms, sketch: buildSketch, vector: buildVector })[sc.kind])(sc);
      fit(sc);
    }
    function fit(sc){
      var v = sc.view, W = v.clientWidth, H = v.clientHeight; if (!W || !H) return;
      var k = Math.min(W / sc.SW, H / sc.SH); sc.k = k;
      sc.stg.style.transform = 'translate(' + (W - sc.SW * k) / 2 + 'px,' + (H - sc.SH * k) / 2 + 'px) scale(' + k + ')';
    }
    function sync(sc){
      if (!sc.tl) return;
      var go = sc.id === active && sc.inView && !sc.paused && !reduce;
      if (go){ if (!sc.started){ sc.started = true; sc.tl.restart(); } else if (sc.tl.paused()) sc.tl.play(); }
      else if (!sc.tl.paused()) sc.tl.pause();
      if (reduce && sc.id === active && !sc.started){ sc.started = true; sc.tl.seek(sc.restAt || sc.tl.duration() - .5).pause(); if (sc.onSeek) sc.onSeek(); }
    }
    function activate(id){ active = id; Object.keys(scenes).forEach(function(k){ sync(scenes[k]); }); }

    // real-size overlay: play/pause + optional phase chips
    function controls(sc, phases){
      var box = mk('div', 'scn-ctl' + (phases ? '' : ' is-top')), pp = mk('button', 'scn-pp', reduce ? ICON_PLAY : ICON_PAUSE), chips = [];
      pp.type = 'button'; pp.setAttribute('aria-label', reduce ? 'Play animation' : 'Pause animation');
      if (reduce) sc.paused = true;
      pp.addEventListener('click', function(){
        sc.paused = !sc.paused; if (!sc.paused && reduce && sc.tl){ sc.tl.play(); }
        pp.innerHTML = sc.paused ? ICON_PLAY : ICON_PAUSE; pp.setAttribute('aria-label', sc.paused ? 'Play animation' : 'Pause animation');
        if (sc.paused) sc.tl.pause(); else { sc.started = true; sc.tl.play(); }
      });
      box.appendChild(pp);
      // a visitor taking over an interactive scene pauses the loop (the play button hands it back)
      sc.hold = function(){ sc.started = true; if (sc.paused) return; sc.paused = true; sc.tl.pause(); pp.innerHTML = ICON_PLAY; pp.setAttribute('aria-label', 'Play animation'); };
      sc.resume = function(){ sc.started = true; sc.paused = false; pp.innerHTML = ICON_PAUSE; pp.setAttribute('aria-label', 'Pause animation'); sc.tl.play(); };
      (phases || []).forEach(function(p, i){
        var b = mk('button', 'scn-ph', '<i></i>' + esc(p.t)); b.type = 'button';
        b.addEventListener('click', function(){ sc.started = true; sc.tl.seek(p.at); if (sc.onSeek) sc.onSeek(); if (!sc.paused) sc.tl.play(); mark(); });
        box.appendChild(b); chips.push(b);
      });
      function mark(){
        if (!chips.length) return; var t = sc.tl.time(), idx = 0;
        phases.forEach(function(p, i){ if (t >= sc.tl.labels[p.at] - .02) idx = i; });
        chips.forEach(function(b, i){ b.classList.toggle('on', i === idx); b.setAttribute('aria-pressed', i === idx ? 'true' : 'false'); });
      }
      sc.tl.eventCallback('onUpdate', mark); mark();
      sc.view.appendChild(box);
    }

    /* ---------------- FIGMA → BUILD ---------------- */
    var ICO = {
      frame: '<svg viewBox="0 0 12 12"><path d="M3.5 0v12M8.5 0v12M0 3.5h12M0 8.5h12"/></svg>',
      text: '<svg viewBox="0 0 12 12"><path d="M2 2.5h8M6 2.5V11"/></svg>',
      img: '<svg viewBox="0 0 12 12"><rect x="1" y="2" width="10" height="8"/><path d="M1 8.5l3-2.8 3 2.8 1.6-1.4L11 9"/></svg>',
      comp: '<svg viewBox="0 0 12 12"><path d="M6 .8l2.3 2.3L6 5.4 3.7 3.1zM6 6.6l2.3 2.3L6 11.2 3.7 8.9zM.8 6l2.3-2.3L5.4 6 3.1 8.3zM11.2 6L8.9 3.7 6.6 6l2.3 2.3z"/></svg>',
      rect: '<svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9"/></svg>'
    };
    var TOOLS = ['<path d="M3 2l9 5-4 1.2L6.5 13z"/>', '<path d="M4 1v14M11 1v14M1 4h14M1 11h14"/>', '<rect x="2.5" y="3.5" width="11" height="9"/>', '<path d="M3 13l2.5-1 6.5-6.5-1.5-1.5L4 10.5zM10 4l2-2 2 2-2 2"/>', '<path d="M3 3.5h10M8 3.5V13"/>', '<path d="M5 8V3.5a1 1 0 012 0V7m0-2.5a1 1 0 012 0V7m0-1.5a1 1 0 012 0V9c0 3-2 4.5-4 4.5S4.5 12.5 3.5 11L2 8.5a1 1 0 011.6-1.1L5 9"/>', '<path d="M2.5 3.5h11v7H7l-3 2.5v-2.5H2.5z"/>'];
    function wire(e){
      var k = e.wire || 'block', s, i, n;
      if (k === 'img') return '<div class="wf wf-img"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 0L100 100M100 0L0 100"/></svg><span>Image</span></div>';
      if (k === 'nav') return '<div class="wf wf-nav"><i></i><b></b><b></b><b></b><b></b><em></em></div>';
      if (k === 'btn') return '<div class="wf wf-btn"><i></i></div>';
      if (k.indexOf('lines') === 0){ n = +k.split(':')[1] || 3; s = '<div class="wf wf-lines' + (k.indexOf('big') > 0 ? ' big' : '') + '">'; for (i = 0; i < n; i++) s += '<i style="width:' + (i === n - 1 ? 58 : 96 - i * 5) + '%"></i>'; return s + '</div>'; }
      if (k.indexOf('row') === 0){ n = +k.split(':')[1] || 3; s = '<div class="wf wf-row">'; for (i = 0; i < n; i++) s += '<i></i>'; return s + '</div>'; }
      return '<div class="wf wf-block"></div>';
    }
    function buildFigma(sc){
      var m = sc.M.mock, P = sc.portrait, st = sc.stg, els = m.els;
      var cx = P ? 0 : 220, cy = 40, cw = P ? 640 : 740, ch = P ? 560 : 710;
      var fs = Math.min((cw - 70) / 1000, (ch - 100) / 625), fx = cx + (cw - 1000 * fs) / 2, fy = cy + (ch - 625 * fs) / 2 + 12;
      var bar = 34, fs2 = P ? .62 : Math.min(1.2, (750 - bar - 8) / 625), fx2 = (sc.SW - 1000 * fs2) / 2, fy2 = P ? (sc.SH - 625 * fs2) / 2 + bar / 2 : bar + 4;
      var zoom = Math.round(fs * 1000 / 1440 * 100);
      st.innerHTML =
        '<div class="fg-canvas"></div>' +
        '<div class="ff" style="width:1000px;height:625px"><div class="ff-lab">' + ICO.frame + esc(m.frame) + '</div><div class="ff-bg" style="background:' + m.bg + '"></div>' +
          els.map(function(e){ return '<div class="fe" data-id="' + e.id + '" style="left:' + e.x + 'px;top:' + e.y + 'px;width:' + e.w + 'px;height:' + e.h + 'px"><div class="wfw">' + wire(e) + '</div><div class="hi">' + e.html + '</div></div>'; }).join('') +
          '<div class="ff-grid">' + new Array(13).join('<i></i>') + '</div>' +
          '<div class="fsel"><i style="left:0;top:0"></i><i style="left:100%;top:0"></i><i style="left:0;top:100%"></i><i style="left:100%;top:100%"></i><b></b></div></div>' +
        '<div class="fg-br" style="left:' + fx2 + 'px;width:' + 1000 * fs2 + 'px;height:' + bar + 'px"><span class="d"></span><span class="d"></span><span class="d"></span><span class="url"><svg viewBox="0 0 10 12" aria-hidden="true"><rect x="1" y="5" width="8" height="6" rx="1"/><path d="M3 5V3.5a2 2 0 014 0V5"/></svg>' + esc(m.url) + '</span><span class="live">● Live</span></div>' +
        '<div class="fg-top"><span class="fg-menu"><i></i><i></i><i></i></span><span class="fg-tools">' + TOOLS.map(function(t, i){ return '<i class="' + (i === 0 ? 'on' : '') + '"><svg viewBox="0 0 16 16">' + t + '</svg></i>'; }).join('') + '</span>' +
          '<span class="fg-file"><em>' + esc(m.team || 'Angelino Barajas') + ' / </em>' + esc(m.file) + ' <small>▾</small></span>' +
          '<span class="fg-right"><span class="fg-avs"><span class="fg-av" style="background:#FF6A3D">AB</span><span class="fg-av" style="background:#3BE38A">C</span></span><span class="fg-share">Share</span><span class="fg-zoom">' + zoom + '%</span></span></div>' +
        '<div class="fg-left"><div class="fg-tabs"><b>Layers</b><span>Assets</span></div><div class="fg-page"><span>Pages</span><b>' + esc(m.page || 'Homepage') + '</b></div><div class="fg-sub">Layers</div><ul class="fg-layers"><li data-i="-1"><i>' + ICO.frame + '</i>' + esc(m.frame) + '</li>' +
          els.map(function(e, i){ return '<li class="ch" data-i="' + i + '"><i>' + (ICO[e.icon] || ICO.rect) + '</i>' + esc(e.name) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="fg-rp"><div class="fg-tabs"><b>Design</b><span>Prototype</span></div>' +
          '<div class="fg-sec"><div class="fg-h" data-k="type">Frame</div><div class="fg-g"><span><em>X</em><b data-k="x">0</b></span><span><em>Y</em><b data-k="y">0</b></span><span><em>W</em><b data-k="w">1440</b></span><span><em>H</em><b data-k="h">900</b></span></div></div>' +
          '<div class="fg-sec"><div class="fg-h">Fill</div><div class="fg-fill"><i data-k="sw"></i><b data-k="fill">FFFFFF</b><em>100%</em></div></div>' +
          '<div class="fg-sec fg-txt"><div class="fg-h">Text</div><div class="fg-row"><b data-k="font">Inter</b></div><div class="fg-g"><span><b data-k="weight">Bold</b></span><span><b data-k="size">96</b></span><span><em>LH</em><b data-k="lh">Auto</b></span><span><em>LS</em><b data-k="ls">0%</b></span></div></div>' +
          '<div class="fg-sec fg-exp"><div class="fg-h">Export <span>+</span></div></div></div>' +
        (m.comment ? '<div class="fg-cm"><span class="cm-pin">C</span><div class="cm-card"><div class="cm-msg"><b>' + esc(m.comment.by || 'Client') + '</b><p>' + esc(m.comment.text) + '</p></div><div class="cm-msg cm-reply"><b>Angelino</b><p>' + esc(m.comment.reply) + '</p></div><span class="cm-ok">✓ Resolved</span></div></div>' : '') +
        '<div class="cur b"><svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg><span class="nm">' + esc((m.comment && m.comment.by) || 'Client') + '</span></div>' +
        '<div class="cur a"><svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg><span class="nm">Angelino</span></div>' +
        '<div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';

      var ff = q(st, '.ff'), fsel = q(st, '.fsel'), badge = q(fsel, 'b'), top = q(st, '.fg-top'), left = q(st, '.fg-left'), right = q(st, '.fg-rp'), canvas = q(st, '.fg-canvas'),
        grid = q(st, '.ff-grid'), lab = q(st, '.ff-lab'), ffbg = q(st, '.ff-bg'), br = q(st, '.fg-br'), toast = q(st, '.fg-toast'), fade = q(st, '.fg-fade'), cm = q(st, '.fg-cm'),
        curA = q(st, '.cur.a'), curB = q(st, '.cur.b'), his = qa(ff, '.hi'), wfs = qa(ff, '.wfw'), pops = qa(ff, '.pop'), rows = qa(left, 'li');
      function set(k, v){ var n = q(right, '[data-k="' + k + '"]'); if (n) n.textContent = v; }
      function panel(i){
        rows.forEach(function(li){ li.classList.toggle('on', +li.dataset.i === i); });
        var e = i >= 0 ? els[i] : null, pr = e ? (e.props || {}) : { fill: m.bg };
        right.classList.toggle('is-empty', i < -1);
        set('type', e ? (e.type || 'Layer') : 'Frame');
        set('x', e ? Math.round(e.x * 1.44) : 0); set('y', e ? Math.round(e.y * 1.44) : 0);
        set('w', e ? Math.round(e.w * 1.44) : 1440); set('h', e ? Math.round(e.h * 1.44) : 900);
        set('fill', (pr.fill || '—').replace('#', '')); q(right, '[data-k="sw"]').style.background = /^#/.test(pr.fill || '') ? pr.fill : 'repeating-linear-gradient(45deg,#666 0 3px,#444 3px 6px)';
        q(right, '.fg-txt').style.display = pr.font ? '' : 'none';
        if (pr.font){ set('font', pr.font); set('weight', pr.weight || 'Regular'); set('size', pr.size || '16'); set('lh', pr.lh || 'Auto'); set('ls', pr.ls || '0%'); }
      }
      function hot(id, on){ var n = q(ff, '.fe[data-id="' + id + '"]'); if (n) n.classList.toggle('is-hot', on); }
      function toastTxt(t, ok){ q(toast, 'span').textContent = t; toast.classList.toggle('ok', !!ok); }
      function pt(e, f){ f = f || [fx, fy, fs]; return { x: f[0] + (e.x + e.w * .55) * f[2], y: f[1] + (e.y + e.h * .55) * f[2] }; }

      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ panel(-2); badge.textContent = ''; toastTxt(''); els.forEach(function(e){ hot(e.id, false); }); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };

      // initial state
      tl.addLabel('wire', 0);
      at(.01, reset);
      tl.set(ff, { x: fx, y: fy, scale: fs, transformOrigin: '0 0' }, 0)
        .set(curA, { x: sc.SW * .8, y: sc.SH * .78 }, 0).set(curB, { x: sc.SW + 60, y: sc.SH * .25 }, 0)
        .set(q(curA, '.nm'), { autoAlpha: 1 }, 0)
        .set(fsel, { opacity: 0, left: 0, top: 0, width: 1000, height: 625 }, 0)
        .set(ffbg, { opacity: 0 }, 0).set(his, { clipPath: 'inset(0% 100% 0% 0%)' }, 0).set(wfs, { opacity: 1 }, 0)
        .set([top, left, right], { x: 0, y: 0, opacity: 1 }, 0).set([grid, lab], { opacity: 1 }, 0).set(canvas, { opacity: 1 }, 0)
        .set([br, toast, fade], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0);
      if (pops.length) tl.set(pops, { scale: 0, opacity: 0 }, 0);
      if (cm) tl.set(cm, { autoAlpha: 0 }, 0).set(qa(cm, '.cm-reply,.cm-ok'), { autoAlpha: 0 }, 0);

      // 01 wireframe: select the frame
      tl.to(curA, { x: fx + 60 * fs, y: fy - 16, duration: 1, ease: 'power2.inOut' }, .5);
      at(1.45, function(){ panel(-1); badge.textContent = '1440 × 900'; });
      tl.to(fsel, { opacity: 1, duration: .15 }, 1.45);
      // 02 design: fill the frame, then style each layer
      tl.addLabel('design', 2.1);
      tl.to(ffbg, { opacity: 1, duration: .7, ease: 'power2.out' }, 2.1);
      var t = 2.7;
      els.forEach(function(e, i){
        var p = pt(e);
        tl.to(curA, { x: p.x, y: p.y, duration: .6, ease: 'power2.inOut' }, t);
        tl.to(fsel, { left: e.x, top: e.y, width: e.w, height: e.h, duration: .3, ease: 'power3.out' }, t + .55);
        at(t + .55, function(){ panel(i); badge.textContent = Math.round(e.w * 1.44) + ' × ' + Math.round(e.h * 1.44); });
        tl.to(his[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: .65, ease: 'power2.inOut' }, t + .8);
        tl.to(wfs[i], { opacity: 0, duration: .4 }, t + .95);
        t += 1.4;
      });
      // 03 review: a client comment, a reply, resolved
      tl.addLabel('review', t);
      tl.to(fsel, { opacity: 0, duration: .2 }, t);
      at(t, function(){ panel(-2); });
      if (cm){
        var ce = els.filter(function(e){ return e.id === m.comment.on; })[0] || els[0];
        var cp = { x: fx + (ce.x + ce.w * .8) * fs, y: fy + (ce.y + 10) * fs };
        if (cp.x > sc.SW - 300) cm.classList.add('flip');
        tl.set(cm, { x: cp.x, y: cp.y }, t);
        tl.to(curB, { x: cp.x + 6, y: cp.y - 4, duration: .9, ease: 'power2.inOut' }, t);
        tl.fromTo(cm, { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'back.out(2)', immediateRender: false }, t + .9);
        tl.to(curA, { x: cp.x - 30, y: cp.y + 70, duration: .7, ease: 'power2.inOut' }, t + 1.8);
        tl.to(q(cm, '.cm-reply'), { autoAlpha: 1, duration: .35 }, t + 2.5);
        tl.to(q(cm, '.cm-ok'), { autoAlpha: 1, duration: .3 }, t + 3.5);
        tl.to(cm, { autoAlpha: 0, scale: .85, duration: .3 }, t + 4.5);
        tl.to(curB, { x: sc.SW + 60, y: sc.SH * .15, duration: .8, ease: 'power2.in' }, t + 4.3);
        t += 5;
      } else t += .6;
      // 04 build: the Figma chrome falls away and the frame becomes the site
      tl.addLabel('build', t);
      at(t, function(){ toastTxt('Handing off to Webflow…'); });
      tl.to(toast, { autoAlpha: 1, duration: .3 }, t);
      tl.to(top, { y: -60, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to(left, P ? { opacity: 0, duration: .3 } : { x: -240, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to(right, P ? { y: 220, duration: .6, ease: 'power3.in' } : { x: 260, duration: .6, ease: 'power3.in' }, t + .5);
      tl.to([grid, lab], { opacity: 0, duration: .3 }, t + .5);
      tl.to(canvas, { opacity: 0, duration: .6 }, t + .7);
      tl.to(ff, { x: fx2, y: fy2, scale: fs2, duration: 1.1, ease: 'power3.inOut' }, t + .9);
      tl.fromTo(br, { autoAlpha: 0, y: fy2 - bar + 14 }, { autoAlpha: 1, y: fy2 - bar, duration: .5, ease: 'power2.out', immediateRender: false }, t + 1.8);
      at(t + 2.1, function(){ toastTxt('Published · ' + m.url, true); });
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 3.6);
      t += 2.5;
      // 05 live: real hover states and live data
      tl.addLabel('live', t);
      sc.restAt = t + 1.5;
      tl.to(q(curA, '.nm'), { autoAlpha: 0, duration: .2 }, t);
      var he = els.filter(function(e){ return e.id === m.hover; })[0];
      if (he){
        var hp = pt(he, [fx2, fy2, fs2]);
        tl.to(curA, { x: hp.x, y: hp.y, duration: .9, ease: 'power2.inOut' }, t + .2);
        at(t + 1.1, function(){ hot(he.id, true); });
        at(t + 3.4, function(){ hot(he.id, false); });
        tl.to(curA, { x: hp.x + 90, y: hp.y + 60, duration: .8, ease: 'power2.inOut' }, t + 3.3);
      }
      if (pops.length) tl.to(pops, { scale: 1, opacity: 1, duration: .45, stagger: .09, ease: 'back.out(3)' }, t + .4);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5);
      tl.set({}, {}, t + 5.5);
      sc.tl = tl;
      tl.progress(0).pause();
      controls(sc, [{ t: 'Wireframe', at: 'wire' }, { t: 'Design', at: 'design' }, { t: 'Review', at: 'review' }, { t: 'Build', at: 'build' }, { t: 'Live', at: 'live' }]);
    }

    /* ---------------- PHONE ---------------- */
    function buildPhone(sc){
      var mm = sc.M.mock.mobile, P = sc.portrait, st = sc.stg, PW = 316, PH = 660, px = P ? (640 - PW) / 2 : 250, py = P ? 20 : 45;
      var fg = mm.statusFg || '#fff';
      st.innerHTML = '<div class="pn-bg"></div>' +
        '<div class="ph" style="left:' + px + 'px;top:' + py + 'px;width:' + PW + 'px;height:' + PH + 'px"><i class="ph-btn b1"></i><i class="ph-btn b2"></i><i class="ph-btn b3"></i><i class="ph-btn b4"></i>' +
          '<div class="ph-scr" style="background:' + mm.bg + '"><div class="ph-view">' + mm.html + '</div>' + (mm.nav || '') + '<div class="ph-menu">' + (mm.menu || '') + '</div>' +
          '<div class="ph-status" style="color:' + fg + ';background:' + mm.bg + '"><b>9:41</b><span><svg viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx=".6"/><rect x="5" y="5" width="3" height="6" rx=".6"/><rect x="10" y="2.5" width="3" height="8.5" rx=".6"/><rect x="15" y="0" width="3" height="11" rx=".6"/></svg><svg viewBox="0 0 16 11"><path d="M8 10.5L5.6 8a3.4 3.4 0 014.8 0zM3.4 5.8a6.5 6.5 0 019.2 0l-1.5 1.5a4.4 4.4 0 00-6.2 0zM1 3.4a9.9 9.9 0 0114 0l-1.5 1.5a7.8 7.8 0 00-11 0z"/></svg><svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="17" height="8" rx="1.6"/><rect x="23.5" y="4" width="1.8" height="4" rx=".8" opacity=".5"/></svg></span></div>' +
          '<div class="ph-isl"></div><div class="ph-home" style="background:' + fg + '"></div><span class="ph-tap"></span></div></div>' +
        (P ? '<div class="pn-cap"><span class="n"></span><div><b></b><p></p></div></div>'
           : '<svg class="pn-lead" viewBox="0 0 1200 750" aria-hidden="true"><path d=""/><circle r="5"/></svg><div class="pn-notes"><div class="pn-h">Mobile decisions</div>' + mm.notes.map(function(n, i){ return '<div class="pn-n" data-i="' + i + '"><span class="n">' + ('0' + (i + 1)).slice(-2) + '</span><div><b>' + esc(n.t) + '</b><p>' + esc(n.d) + '</p></div></div>'; }).join('') + '</div>');

      var ph = q(st, '.ph'), scr = q(st, '.ph-scr'), view = q(st, '.ph-view'), tap = q(st, '.ph-tap'), notes = qa(st, '.pn-n'), lead = q(st, '.pn-lead'), cap = q(st, '.pn-cap');
      var screenH = PH - 20, maxS = Math.max(0, view.scrollHeight - screenH), cur = 0;
      function offs(n){ var x = 0, y = 0, inView = false; while (n && n !== scr){ if (n === view) inView = true; x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x: x, y: y, inView: inView }; }
      function langSwap(es){ qa(scr, '[data-es]').forEach(function(n){ if (!n.hasAttribute('data-en')) n.setAttribute('data-en', n.textContent); n.textContent = es ? n.getAttribute('data-es') : n.getAttribute('data-en'); }); }
      function note(i){
        if (P){ var n = mm.notes[i]; cap.classList.toggle('on', !!n); if (n){ q(cap, '.n').textContent = ('0' + (i + 1)).slice(-2); q(cap, 'b').textContent = n.t; q(cap, 'p').textContent = n.d; } return; }
        notes.forEach(function(el, k){ el.classList.toggle('on', k === i); });
        var el = notes[i]; lead.classList.toggle('on', !!el); if (!el) return;
        var ny = el.offsetTop + el.parentNode.offsetTop + el.offsetHeight / 2, nx = el.parentNode.offsetLeft - 10, sx = px + PW + 10;
        q(lead, 'path').setAttribute('d', 'M' + sx + ' ' + ny + 'H' + nx); var c = q(lead, 'circle'); c.setAttribute('cx', sx); c.setAttribute('cy', ny);
      }
      function reset(){ ph.className = 'ph'; langSwap(false); note(-1); }
      var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .4 }), t = 0;
      tl.call(reset, null, .01); tl.set(view, { y: 0 }, 0); tl.set(tap, { autoAlpha: 0 }, 0);
      t = .6;
      mm.steps.forEach(function(s){
        if (s.note != null) tl.call(note, [s.note], t);
        if (s.scroll != null){
          var target = s.scroll === 0 ? 0 : Math.min(maxS, Math.max(0, offs(q(view, s.scroll)).y - (s.off || 110)));
          tl.to(view, { y: -target, duration: .95, ease: 'power2.inOut' }, t); cur = target; t += 1;
        }
        if (s.tap){
          var n = q(scr, s.tap);
          if (n){ var o = offs(n); var tx = o.x + n.offsetWidth / 2, ty = o.y + n.offsetHeight / 2 - (o.inView ? cur : 0);
            tl.set(tap, { x: tx, y: ty }, t);
            tl.fromTo(tap, { scale: .3, autoAlpha: .95 }, { scale: 1.5, autoAlpha: 0, duration: .6, ease: 'power2.out', immediateRender: false }, t);
            t += .15; }
          tl.call(function(s){ if (s.toggle){ ph.classList.toggle(s.toggle); if (s.toggle === 'es') langSwap(ph.classList.contains('es')); } if (s.add) ph.classList.add(s.add); if (s.remove) ph.classList.remove(s.remove); }, [s], t);
          t += .4;
        } else if (s.add || s.remove){ tl.call(function(s){ if (s.add) ph.classList.add(s.add); if (s.remove) ph.classList.remove(s.remove); }, [s], t); }
        t += s.hold == null ? .8 : s.hold;
      });
      tl.set({}, {}, t);
      sc.tl = tl; sc.restAt = .7;
      tl.progress(0).pause();
      controls(sc, null);
    }


    /* ---------------- SERVICE MAP (FigJam board → designed process) ---------------- */
    var CURSOR = '<svg viewBox="0 0 16 20"><path d="M1.5 1.5v15.5l4.4-4.1 2.9 6.3 2.6-1.2-2.9-6.2 6-.3z"/></svg>';
    function buildFlow(sc){
      var f = sc.M.mock.flow, P = sc.portrait, st = sc.stg, G = f.groups, nodes = [];
      // layout: landscape = one row of six; portrait = one row per group
      G.forEach(function(g, gi){ g.steps.forEach(function(s, si){
        var n = { g: gi, t: s, i: nodes.length };
        if (P){ n.w = 250; n.h = 92; n.x = 50 + si * 290; n.y = 110 + gi * 158; }
        else { n.w = 150; n.h = 112; n.x = 75 + n.i * 180; n.y = 170; }
        nodes.push(n);
      }); });
      var arrows = '', brackets = '';
      for (var i = 0; i < nodes.length - 1; i++){
        var a = nodes[i], b = nodes[i + 1];
        if (!P || a.g === b.g) arrows += '<path class="fl-ar" d="M' + (a.x + a.w + 6) + ' ' + (a.y + a.h / 2) + 'H' + (b.x - 10) + '"/><path class="fl-ah" d="M' + (b.x - 16) + ' ' + (b.y + b.h / 2 - 5) + 'l6 5-6 5"/>';
        else arrows += '<path class="fl-ar" d="M' + (a.x + a.w / 2) + ' ' + (a.y + a.h + 6) + 'C' + (a.x + a.w / 2) + ' ' + (a.y + a.h + 40) + ' ' + (b.x + b.w / 2) + ' ' + (b.y - 60) + ' ' + (b.x + b.w / 2) + ' ' + (b.y - 34) + '"/><path class="fl-ah" d="M' + (b.x + b.w / 2 - 5) + ' ' + (b.y - 38) + 'l5 6 5-6"/>';
      }
      G.forEach(function(g, gi){
        var ns = nodes.filter(function(n){ return n.g === gi; }), x0 = ns[0].x + 20, x1 = ns[ns.length - 1].x + ns[ns.length - 1].w - 20, below = !P && gi === 1;
        var y = below ? ns[0].y + ns[0].h : ns[0].y, d = below ? 30 : -30;
        brackets += '<path class="fl-br" d="M' + x0 + ' ' + (y + d / 5) + 'V' + (y + d) + 'H' + x1 + 'V' + (y + d / 5) + '"/><text class="fl-bt" x="' + (x0 + x1) / 2 + '" y="' + (y + d + (below ? 28 : -12)) + '" text-anchor="middle">' + esc(g.name.toUpperCase()) + '</text>';
      });
      var panelTop = P ? 590 : 400;
      st.innerHTML = '<div class="fl-board"></div><div class="fl-dark"></div>' +
        '<div class="fl-title"><span>' + ICO.frame + '</span>' + esc(f.file) + '</div>' +
        '<svg class="fl-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '">' + brackets + arrows + '<circle class="fl-pulse" r="6"/></svg>' +
        nodes.map(function(n){ return '<div class="fn" data-g="' + n.g + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.w + 'px;height:' + n.h + 'px"><div class="fn-w"><b>' + esc(n.t) + '</b></div><div class="fn-h"><span>' + ('0' + (n.i + 1)).slice(-2) + '</span><svg viewBox="0 0 60 62">' + G[n.g].solid + '</svg><b>' + esc(n.t) + '</b></div></div>'; }).join('') +
        '<div class="fl-panel" style="top:' + panelTop + 'px"><div class="fl-ico"><svg viewBox="0 0 60 62"></svg></div><div class="fl-txt"><span class="fl-k"></span><h4></h4><ul></ul></div></div>' +
        '<div class="fl-dock">' + TOOLS.slice(0, 5).map(function(t){ return '<i><svg viewBox="0 0 16 16">' + t + '</svg></i>'; }).join('') + '<i class="st"></i><i class="st c2"></i><i class="st c3"></i></div>' +
        '<div class="cur a">' + CURSOR + '<span class="nm">Angelino</span></div><div class="fg-fade"></div>';
      var fns = qa(st, '.fn'), wires = qa(st, '.fn-w'), his = qa(st, '.fn-h'), ars = qa(st, '.fl-ar,.fl-ah'), brs = qa(st, '.fl-br'), bts = qa(st, '.fl-bt'),
        dark = q(st, '.fl-dark'), dock = q(st, '.fl-dock'), panel = q(st, '.fl-panel'), pulse = q(st, '.fl-pulse'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade');
      ars.concat(brs).forEach(function(p){ var L = p.getTotalLength ? p.getTotalLength() : 200; p.style.strokeDasharray = L; p.dataset.len = L; });
      function show(gi){
        fns.forEach(function(n){ n.classList.toggle('on', +n.dataset.g === gi); });
        var g = G[gi]; if (!g){ return; }
        q(panel, '.fl-k').textContent = ('0' + (gi + 1)).slice(-2) + ' · ' + g.steps.join(' → ');
        q(panel, 'h4').textContent = g.name; q(panel, 'ul').innerHTML = g.copy.map(function(c){ return '<li>' + esc(c) + '</li>'; }).join('');
        q(panel, '.fl-ico svg').innerHTML = g.solid;
      }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ show(-1); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('map', 0); at(.01, reset);
      tl.set(st, { '--ink': '#1e1e1e', '--line': '#1e1e1e' }, 0).set(dark, { opacity: 0 }, 0).set(fns, { scale: 0, opacity: 0 }, 0).set(wires, { opacity: 1 }, 0).set(his, { opacity: 0 }, 0)
        .set(ars.concat(brs), { strokeDashoffset: function(i, el){ return el.dataset.len; } }, 0).set(bts, { opacity: 0 }, 0).set(dock, { autoAlpha: 1, y: 0 }, 0)
        .set(panel, { autoAlpha: 0, y: 20 }, 0).set(pulse, { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0).set(curA, { x: sc.SW * .5, y: sc.SH * .85 }, 0).set(q(curA, '.nm'), { autoAlpha: 1 }, 0);
      // 01 map: stickies go down, arrows and brackets are drawn
      var t = .4;
      nodes.forEach(function(n, i){
        tl.to(curA, { x: n.x + n.w * .6, y: n.y + n.h * .6, duration: .35, ease: 'power2.inOut' }, t);
        tl.to(fns[i], { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2.2)' }, t + .3);
        t += .45;
      });
      tl.to(ars, { strokeDashoffset: 0, duration: .5, stagger: .06, ease: 'power2.out' }, t);
      tl.to(brs, { strokeDashoffset: 0, duration: .6, stagger: .15 }, t + .5);
      tl.to(bts, { opacity: 1, duration: .3, stagger: .15 }, t + .8);
      t += 2;
      // 02 design: the board becomes the 5 TEN process section
      tl.addLabel('design', t);
      tl.to(dock, { autoAlpha: 0, y: 30, duration: .4 }, t);
      tl.to(dark, { opacity: 1, duration: .8, ease: 'power2.inOut' }, t);
      tl.to(st, { '--ink': f.fg, '--line': f.accent, duration: .8 }, t);
      tl.to(his, { opacity: 1, duration: .5, stagger: .08 }, t + .3);
      tl.to(wires, { opacity: 0, duration: .5, stagger: .08 }, t + .3);
      var pts = nodes.map(function(n){ return { x: n.x + n.w / 2, y: n.y + n.h / 2 }; });
      function pulseRun(t0){ tl.set(pulse, { attr: { cx: pts[0].x, cy: pts[0].y }, autoAlpha: 1 }, t0); pts.slice(1).forEach(function(p, k){ tl.to(pulse, { attr: { cx: p.x, cy: p.y }, duration: .32, ease: 'none' }, t0 + k * .32); }); tl.to(pulse, { autoAlpha: 0, duration: .2 }, t0 + (pts.length - 1) * .32); }
      pulseRun(t + 1.2);
      t += 3.2;
      // 03 each stage opens its detail
      G.forEach(function(g, gi){
        var n = nodes.filter(function(n){ return n.g === gi; })[0];
        tl.addLabel('g' + gi, t);
        tl.to(curA, { x: n.x + n.w * .5, y: n.y + n.h * .7, duration: .6, ease: 'power2.inOut' }, t);
        at(t + .6, function(){ show(gi); });
        tl.fromTo(panel, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power3.out', immediateRender: false }, t + .6);
        tl.to(panel, { autoAlpha: 0, y: -10, duration: .3 }, t + 3.6);
        t += 3.9;
      });
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t);
      tl.set({}, {}, t + .5);
      sc.tl = tl; sc.restAt = t - 3.9 + 1.2; tl.progress(0).pause();
      controls(sc, [{ t: 'Map', at: 'map' }, { t: 'Design', at: 'design' }].concat(G.map(function(g, i){ return { t: g.name, at: 'g' + i }; })));
    }

    /* ---------------- GLOBE RENDER (exploded layers) ---------------- */
    function buildExplode(sc){
      var e = sc.M.mock.explode, P = sc.portrait, st = sc.stg, IW = 1600, IH = 955;
      var PW = P ? 600 : 900, PH = PW * IH / IW, X = P ? 20 : 270, Y = P ? 150 : (750 - PH) / 2;
      function px(p){ return p[0] / IW * 100 + '%'; } function py(p){ return p[1] / IH * 100 + '%'; }
      var L = [
        { k: 'Background', d: 'Section · ' + e.bg, html: '<div class="ex-bg" style="background:radial-gradient(60% 70% at 55% 45%,#262a33,' + e.bg + ' 70%)"></div>' },
        { k: 'Globe mesh', d: 'Three.js points on a sphere', html: '<img src="' + e.img + '" alt="" style="position:absolute;inset:0;width:100%;height:100%">' },
        { k: 'Project pins', d: 'Projects CMS · lat / lng', html: e.pins.map(function(p){ return '<span class="ex-pin" style="left:' + px(p) + ';top:' + py(p) + '"></span>'; }).join('') },
        { k: 'Arcs + leaders', d: 'HQ links and label lines', html: '<svg viewBox="0 0 ' + IW + ' ' + IH + '" preserveAspectRatio="none">' + e.arcs.map(function(a){ return '<path d="' + a + '"/>'; }).join('') + e.leaders.map(function(a){ return '<path class="ld" d="' + a + '"/>'; }).join('') + '</svg><span class="ex-hq" style="left:' + px(e.hq) + ';top:' + py(e.hq) + '">5 TEN HQ</span>' },
        { k: 'Preview card', d: 'Hover UI from the same CMS item', html: '<div class="ex-card" style="left:' + px(e.card.at) + ';top:' + py(e.card.at) + '"><div class="im" style="background-image:url(' + e.card.img + ')"></div><b>' + esc(e.card.title) + '</b><span>' + esc(e.card.city) + '</span><em>View project →</em></div><span class="ex-cue">Drag to explore · click a pin</span>' }
      ];
      st.innerHTML = '<div class="ex-sc"><div class="ex-rig" style="left:' + X + 'px;top:' + Y + 'px;width:' + PW + 'px;height:' + PH + 'px">' +
        L.map(function(l, i){ return '<div class="ex-l l' + i + '">' + l.html + '<span class="ex-tag"><b>L' + i + '</b> ' + esc(l.k) + '</span></div>'; }).join('') + '</div></div>' +
        '<div class="ex-hud"><div class="ex-h">Layers · ' + esc(e.frame) + '</div>' + L.slice().reverse().map(function(l, r){ var i = L.length - 1 - r; return '<div class="ex-row" data-i="' + i + '"><span>L' + i + '</span><div><b>' + esc(l.k) + '</b><em>' + esc(l.d) + '</em></div></div>'; }).join('') + '</div>' +
        '<div class="cur a">' + CURSOR + '</div><div class="fg-fade"></div>';
      var rig = q(st, '.ex-rig'), ls = qa(st, '.ex-l'), tags = qa(st, '.ex-tag'), rows = qa(st, '.ex-row'), card = q(st, '.ex-card'), cue = q(st, '.ex-cue'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade'), pins = qa(st, '.ex-pin');
      function hl(i){ rows.forEach(function(r){ r.classList.toggle('on', +r.dataset.i === i); }); }
      var gap = P ? 70 : 105;
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      sc.onSeek = function(){ var now = tl.time(); hl(-1); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('comp', 0); at(.01, function(){ hl(-1); });
      tl.set(rig, { rotationX: 0, rotationZ: 0, scale: 1, x: 0, y: 0 }, 0).set(ls, { z: 0, opacity: 1 }, 0).set(tags, { autoAlpha: 0 }, 0).set(card, { autoAlpha: 0, scale: .9 }, 0).set(cue, { autoAlpha: 1 }, 0)
        .set(fade, { autoAlpha: 0 }, 0).set(curA, { x: sc.SW * .85, y: sc.SH * .9, autoAlpha: 0 }, 0).set(pins, { scale: 1 }, 0);
      tl.fromTo(pins, { scale: 0 }, { scale: 1, duration: .4, stagger: .06, ease: 'back.out(3)', immediateRender: false }, .3);
      var t = 1.8;
      tl.addLabel('explode', t);
      tl.to(cue, { autoAlpha: 0, duration: .3 }, t);
      tl.to(card, { autoAlpha: 1, scale: 1, duration: .4 }, t);
      tl.to(rig, { rotationX: P ? 50 : 54, rotationZ: -26, scale: P ? .7 : .62, x: P ? 0 : -30, y: P ? 40 : -55, duration: 1.6, ease: 'power3.inOut' }, t);
      tl.to(ls, { z: function(i){ return (i - 2) * gap; }, duration: 1.6, ease: 'power3.inOut' }, t);
      tl.to(tags, { autoAlpha: 1, duration: .4, stagger: .08 }, t + 1.2);
      t += 2.2;
      tl.addLabel('layers', t);
      for (var i = 1; i < L.length; i++){ (function(i){
        at(t, function(){ hl(i); });
        tl.to(ls.filter(function(l, k){ return k !== i && k !== 0; }), { opacity: .22, duration: .35 }, t);
        tl.to(ls[i], { opacity: 1, z: (i - 2) * gap + 40, duration: .35 }, t);
        tl.to(ls[i], { z: (i - 2) * gap, duration: .35 }, t + 1.2);
        t += 1.5;
      })(i); }
      at(t, function(){ hl(-1); });
      tl.to(ls, { opacity: 1, duration: .3 }, t);
      tl.to(tags, { autoAlpha: 0, duration: .3 }, t + .2);
      tl.to(card, { autoAlpha: 0, duration: .3 }, t + .2);
      tl.to(rig, { rotationX: 0, rotationZ: 0, scale: 1, x: 0, y: 0, duration: 1.4, ease: 'power3.inOut' }, t + .3);
      tl.to(ls, { z: 0, duration: 1.4, ease: 'power3.inOut' }, t + .3);
      t += 1.9;
      tl.addLabel('live', t);
      var pin = e.pins[e.card.pin], cx = X + pin[0] / IW * PW, cy = Y + pin[1] / IH * PH;
      tl.set(curA, { autoAlpha: 1 }, t);
      tl.to(curA, { x: cx, y: cy, duration: 1, ease: 'power2.inOut' }, t);
      tl.fromTo(card, { autoAlpha: 0, scale: .85 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + 1);
      tl.to(pins[e.card.pin], { scale: 1.8, duration: .3 }, t + 1);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 3.8);
      tl.set({}, {}, t + 4.3);
      sc.tl = tl; sc.restAt = 3.6; tl.progress(0).pause();
      controls(sc, [{ t: 'Composite', at: 'comp' }, { t: 'Explode', at: 'explode' }, { t: 'Layers', at: 'layers' }, { t: 'Live', at: 'live' }]);
    }


    /* ---------------- CMS → PIN (Webflow Editor adds a case, the map updates) ---------------- */
    function buildCms(sc){
      var c = sc.M.mock.cms, P = sc.portrait, st = sc.stg;
      var ed = P ? { l: 0, t: 0, w: 640, h: 370 } : { l: 0, t: 0, w: 440, h: 750 }, pv = P ? { l: 0, t: 370, w: 640, h: 430 } : { l: 440, t: 0, w: 760, h: 750 };
      var mapW = P ? 330 : 430, mapH = mapW * 490 / 740;
      st.innerHTML =
        '<div class="cm-ed" style="left:' + ed.l + 'px;top:' + ed.t + 'px;width:' + ed.w + 'px;height:' + ed.h + 'px">' +
          '<div class="cm-bar"><span class="cm-logo">W</span><span>' + esc(c.site) + '</span><em>CMS</em></div>' +
          '<div class="cm-crumb">Collections › <b>' + esc(c.collection) + '</b> › <span class="cm-new">New item</span></div>' +
          '<div class="cm-fields">' + c.fields.map(function(f, i){ return '<label class="cm-f' + (f.wide ? ' wide' : '') + (f.area ? ' area' : '') + '"><span>' + esc(f.k) + (f.req ? ' <i>*</i>' : '') + '</span><div class="cm-in' + (f.select ? ' dd' : '') + '" data-i="' + i + '"><b></b><u></u></div></label>'; }).join('') + '</div>' +
          '<div class="cm-act"><span class="cm-draft">Save as draft</span><span class="cm-pub">Publish</span></div></div>' +
        '<div class="cm-pv" style="left:' + pv.l + 'px;top:' + pv.t + 'px;width:' + pv.w + 'px;height:' + pv.h + 'px">' +
          '<div class="cm-url"><span class="d"></span><span class="d"></span><span class="d"></span><span class="u">' + esc(c.url) + '</span></div>' +
          '<div class="cm-home"><div class="ch-nav"><b>' + esc(c.site) + '</b><span class="lk">' + c.nav.map(function(n){ return '<span>' + esc(n) + '</span>'; }).join('') + '</span><span class="r"><em>EN | ES</em><i>Free consultation</i></span></div>' +
          '<div class="ch-grid"><div class="ch-l"><div class="ch-eye"><i></i>' + esc(c.eyebrow) + '</div><h3>' + esc(c.title) + '</h3><p>' + esc(c.body) + '</p><span class="ch-btn">' + esc(c.cta) + '</span>' +
            '<div class="ch-stats">' + c.stats.map(function(s, i){ return '<div><b data-s="' + i + '" style="color:' + (s.c || '#1a2840') + '">' + s.v + '</b><span>' + esc(s.k) + '</span></div>'; }).join('') + '</div></div>' +
            '<div class="ch-r"><div class="cm-map" style="width:' + mapW + 'px;height:' + mapH + 'px">' +
              '<span class="cm-newpin" style="left:' + c.pin[0] + '%;top:' + c.pin[1] + '%"><i></i></span>' +
              '<div class="cm-card" style="left:' + c.pin[0] + '%;top:' + c.pin[1] + '%"><span>' + esc(c.cardKicker) + '</span><b>' + esc(c.cardTitle) + '</b><em>' + esc(c.cardMeta) + '</em></div></div>' +
            '<div class="ch-chips"><span class="cm-badge">All cases · <b>' + c.stats[0].v + '</b></span>' + c.chips.map(function(x){ return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div></div></div></div>' +
        '<div class="cur a">' + CURSOR + '<span class="nm">Firm staff</span></div><div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';
      var ins = qa(st, '.cm-in'), vals = qa(st, '.cm-in b'), pub = q(st, '.cm-pub'), newTag = q(st, '.cm-new'), pin = q(st, '.cm-newpin'), card = q(st, '.cm-card'), toast = q(st, '.fg-toast'), fade = q(st, '.fg-fade'), curA = q(st, '.cur.a'),
        statEls = qa(st, '[data-s]'), badge = q(st, '.cm-badge b');
      function center(el){ var r = 0, t = 0, n = el; while (n && n !== st){ r += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; } return { x: r + el.offsetWidth * .5, y: t + el.offsetHeight * .6 }; }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ ins.forEach(function(n){ n.classList.remove('focus', 'done'); }); pub.classList.remove('hit'); newTag.textContent = 'New item'; q(toast, 'span').textContent = ''; toast.classList.remove('ok'); }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('add', 0); at(.01, reset);
      tl.set(vals, { textContent: '' }, 0).set([pin, card, toast, fade], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(curA, { x: ed.w * .7, y: ed.t + 60 }, 0);
      c.stats.forEach(function(s, i){ tl.set(statEls[i], { textContent: s.v }, 0); }); tl.set(badge, { textContent: c.stats[0].v }, 0);
      var t = .5;
      tl.addLabel('fill', t);
      c.fields.forEach(function(f, i){
        var p = center(ins[i]), o = { n: 0 };
        tl.to(curA, { x: p.x, y: p.y, duration: .45, ease: 'power2.inOut' }, t);
        at(t + .4, function(){ ins.forEach(function(n, k){ n.classList.toggle('focus', k === i); if (k < i) n.classList.add('done'); }); });
        var dur = f.select ? .01 : Math.min(1.1, .04 * f.v.length + .2);
        tl.fromTo(o, { n: 0 }, { n: f.v.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function(){ vals[i].textContent = f.v.slice(0, Math.round(o.n)); } }, t + .5 + (f.select ? .3 : 0));
        if (i === 0) at(t + .5 + dur, function(){ newTag.textContent = f.v; });
        t += .6 + dur + (f.select ? .4 : .15);
      });
      at(t, function(){ ins.forEach(function(n){ n.classList.remove('focus'); n.classList.add('done'); }); });
      tl.addLabel('publish', t + .2);
      var pp = center(pub);
      tl.to(curA, { x: pp.x, y: pp.y, duration: .6, ease: 'power2.inOut' }, t + .2);
      at(t + .85, function(){ pub.classList.add('hit'); q(toast, 'span').textContent = 'Publishing to ' + c.url + '…'; toast.classList.remove('ok'); });
      tl.to(toast, { autoAlpha: 1, duration: .25 }, t + .85);
      at(t + 2, function(){ q(toast, 'span').textContent = 'Published · 1 item live'; toast.classList.add('ok'); });
      t += 2.3;
      tl.addLabel('live', t);
      tl.fromTo(pin, { autoAlpha: 0, y: -60, scale: .4 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7, ease: 'bounce.out', immediateRender: false }, t);
      c.stats.forEach(function(s, i){ if (s.to == null) return; var o = { v: parseFloat(s.v) }; tl.fromTo(o, { v: parseFloat(s.v) }, { v: parseFloat(s.to), duration: .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ statEls[i].textContent = Math.round(o.v) + (/%/.test(s.v) ? '%' : ''); if (i === 0) badge.textContent = Math.round(o.v); } }, t + .6); });
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 1.2);
      var mp = q(st, '.cm-map'), mpo = center(mp), pinPt = { x: mpo.x - mp.offsetWidth * .5 + mp.offsetWidth * c.pin[0] / 100, y: mpo.y - mp.offsetHeight * .6 + mp.offsetHeight * c.pin[1] / 100 };
      tl.to(curA, { x: pinPt.x + 4, y: pinPt.y + 4, duration: .8, ease: 'power2.inOut' }, t + 1.1);
      tl.fromTo(card, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + 1.9);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5);
      tl.set({}, {}, t + 5.5);
      sc.tl = tl; sc.restAt = t + 2.5; tl.progress(0).pause();
      controls(sc, [{ t: 'New item', at: 'add' }, { t: 'Fill', at: 'fill' }, { t: 'Publish', at: 'publish' }, { t: 'Live', at: 'live' }]);
    }

    /* ---------------- SKETCHES (AB Identity · pen + paper iterations) ---------------- */
    var PENCIL = '<svg viewBox="0 0 40 40"><path d="M6 34l4-12L28 4l8 8-18 18z" fill="#f2c14e" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 34l4-12 8 8z" fill="#ead7b5" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round"/><path d="M6 34l2-6 4 4z" fill="#2b2b2b"/><path d="M24 8l8 8" stroke="#2b2b2b" stroke-width="1.5"/></svg>';
    var SK_A = 'M28 122L58 28L88 122M40 88H76', SK_B = 'M108 28V122M108 28H138C168 28 168 72 138 74H108M138 74C176 76 176 122 138 122H108';
    var SKETCHES = [
      { v: 'v01', note: 'too plain', no: true, d: [SK_A, SK_B] },
      { v: 'v04', note: 'orbit = cliché?', no: true, d: [SK_A, SK_B, 'M14 104C30 50 172 18 188 44C200 66 140 112 36 116C18 117 12 110 14 104'] },
      { v: 'v09', note: 'planet floats, disconnected', no: true, d: ['M20 110L38 50L56 110M28 88H48', 'M100 42C120 42 132 58 132 76S118 108 100 108 68 94 68 76 80 42 100 42', 'M58 92C80 70 150 48 146 60S104 96 62 98', 'M150 50V110M150 50H166C184 50 184 78 166 80H150M166 80C188 82 188 110 166 110H150'] },
      { v: 'v13', note: 'planet as the A. closer!', d: ['M40 126L84 24L128 126', 'M84 52C100 52 110 64 110 78S100 104 84 104 58 92 58 78 68 52 84 52', 'M34 100C60 84 150 56 154 66S116 96 48 104', 'M140 60V126M140 60H156C172 60 172 90 156 92H140M156 92C176 94 176 126 156 126H140'] },
      { v: 'v19', note: 'ring through both letters', d: ['M22 124L56 28L90 124', 'M108 28V124M108 28H138C166 28 166 72 138 74H108M138 74C174 76 174 124 138 124H108', 'M96 50C110 50 122 62 122 76S110 102 96 102 70 90 70 76 82 50 96 50', 'M40 108C70 88 170 50 176 60S130 96 50 112'] },
      { v: 'v25', note: 'this one ✓', win: true, mark: true }
    ];
    function buildSketch(sc){
      var P = sc.portrait, st = sc.stg, M = AB.MARK, fid = 'skr-' + sc.id;
      var cols = P ? 2 : 3, cw = P ? 250 : 320, ch = P ? 188 : 240, gx = P ? 20 : 34, gy = P ? 46 : 58, x0 = P ? 60 : 72, y0 = P ? 118 : 128, k = cw / 200;
      var cells = SKETCHES.map(function(s, i){ return { s: s, x: x0 + (i % cols) * (cw + gx), y: y0 + Math.floor(i / cols) * (ch + gy) }; });
      st.innerHTML = '<div class="sk-paper"></div><svg class="sk-defs" width="0" height="0" aria-hidden="true"><filter id="' + fid + '"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter></svg>' +
        '<div class="sk-title">AB mark · explorations</div><div class="sk-count">iterations: <b>1</b></div>' +
        cells.map(function(c, i){
          // stroke widths in user units (non-scaling-stroke broke the dash-draw inside the scaled cells)
          var sw = 'stroke-width:' + (2.2 / k).toFixed(2), swm = 'stroke-width:' + (2.2 / (k * .367)).toFixed(2);
          var s = c.s, inner = s.mark ? '<g transform="translate(10 30) scale(.367)"><path class="sk-l" style="' + swm + '" d="' + M.a + '"/><path class="sk-l" style="' + swm + '" d="' + M.planet + '"/><path class="sk-l" style="' + swm + '" d="' + M.b + '"/></g>' :
            s.d.map(function(d){ return '<path class="sk-l" style="' + sw + '" d="' + d + '"/>'; }).join('');
          return '<div class="sk-cell" data-i="' + i + '" style="left:' + c.x + 'px;top:' + c.y + 'px;width:' + cw + 'px;height:' + ch + 'px">' +
            '<svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid meet"><g filter="url(#' + fid + ')">' + inner +
            (s.no ? '<path class="sk-x" style="stroke-width:' + (3.2 / k).toFixed(2) + '" d="M16 16L184 134M184 16L16 134"/>' : '') + '</g></svg>' +
            '<span class="sk-v">' + s.v + '</span><span class="sk-note">' + esc(s.note) + '</span></div>';
        }).join('') +
        '<svg class="sk-hi" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"><path class="sk-ring" filter="url(#' + fid + ')" d=""/></svg>' +
        '<div class="sk-pen">' + PENCIL + '</div><div class="fg-fade"></div>';
      var pen = q(st, '.sk-pen'), fade = q(st, '.fg-fade'), cnt = q(st, '.sk-count b'), ring = q(st, '.sk-ring'), cellEls = qa(st, '.sk-cell');
      // the orange circle around the winner, drawn around its cell
      var wc = cells[cells.length - 1], rx = cw * .56, ry = ch * .52, cx = wc.x + cw / 2, cy = wc.y + ch / 2;
      ring.setAttribute('d', 'M' + (cx - rx) + ' ' + (cy + 6) + 'C' + (cx - rx) + ' ' + (cy - ry) + ' ' + (cx + rx) + ' ' + (cy - ry - 8) + ' ' + (cx + rx) + ' ' + cy + 'S' + (cx - rx * .4) + ' ' + (cy + ry + 10) + ' ' + (cx - rx - 6) + ' ' + (cy - 4));
      var lines = [];
      cellEls.forEach(function(el, i){
        var c = cells[i], sk = c.s;
        qa(el, '.sk-l').forEach(function(p){
          var L = (p.getTotalLength ? p.getTotalLength() : 300) + 3; // +3: no round-cap dot while hidden p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
          var sx = sk.mark ? .367 * k : k, ox = c.x + (sk.mark ? 10 * k : 0) + (cw - 200 * k) / 2, oy = c.y + (sk.mark ? 30 * k : 0) + (ch - 150 * k) / 2;
          lines.push({ p: p, L: L, cell: i, map: function(pt){ return { x: ox + pt.x * sx, y: oy + pt.y * sx }; } });
        });
      });
      var xs = qa(st, '.sk-x'); xs.forEach(function(p){ var L = (p.getTotalLength ? p.getTotalLength() : 420) + 4; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.len = L; });
      var RL = (ring.getTotalLength ? ring.getTotalLength() : 1200) + 4; ring.style.strokeDasharray = RL; ring.style.strokeDashoffset = RL;
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function setN(n){ cnt.textContent = n; }
      sc.onSeek = function(){ var now = tl.time(); setN(1); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('sketch', 0); at(.01, function(){ setN(1); });
      tl.set(lines.map(function(l){ return l.p; }), { strokeDashoffset: function(i){ return lines[i].L; } }, 0).set(xs, { strokeDashoffset: function(i, el){ return el.dataset.len; } }, 0)
        .set(ring, { strokeDashoffset: RL }, 0).set(qa(st, '.sk-note,.sk-v'), { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0).set(pen, { autoAlpha: 1, x: sc.SW * .5, y: sc.SH + 40 }, 0);
      var t = .3, NUM = [1, 4, 9, 13, 19, 25];
      cellEls.forEach(function(el, i){
        if (i === 3) tl.addLabel('iterate', t);
        lines.filter(function(l){ return l.cell === i; }).forEach(function(l){
          var d = Math.max(.28, Math.min(.75, l.L / 420)), o = { v: 0 };
          var p0 = l.map(l.p.getPointAtLength ? l.p.getPointAtLength(0) : { x: 0, y: 0 });
          tl.to(pen, { x: p0.x - 6, y: p0.y - 34, duration: .2, ease: 'power2.inOut' }, t);
          tl.to(l.p, { strokeDashoffset: 0, duration: d, ease: 'none' }, t + .2);
          tl.fromTo(o, { v: 0 }, { v: 1, duration: d, ease: 'none', immediateRender: false, onUpdate: function(){ if (!l.p.getPointAtLength) return; var pt = l.map(l.p.getPointAtLength(o.v * l.L)); gsap.set(pen, { x: pt.x - 6, y: pt.y - 34 }); } }, t + .2);
          t += d + .22;
        });
        (function(n){ at(t, function(){ setN(n); }); })(NUM[i]);
        tl.to(qa(el, '.sk-v,.sk-note'), { autoAlpha: 1, duration: .3 }, t);
        t += .25;
      });
      // pick: cross out the rejects, circle the winner
      tl.addLabel('pick', t);
      tl.to(pen, { autoAlpha: 0, duration: .3 }, t);
      tl.to(xs, { strokeDashoffset: 0, duration: .45, stagger: .25, ease: 'power2.in' }, t + .2);
      tl.to(ring, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, t + 1.2);
      at(t + 2.3, function(){ cellEls[cellEls.length - 1].classList.add('is-win'); });
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 5.2);
      tl.set({}, {}, t + 5.7);
      sc.tl = tl; sc.restAt = t + 3; tl.progress(0).pause();
      controls(sc, [{ t: 'Sketch', at: 'sketch' }, { t: 'Iterate', at: 'iterate' }, { t: 'Pick', at: 'pick' }]);
    }

    /* ---------------- ILLUSTRATOR (AB Identity · trace, pathfinder, color, export) ---------------- */
    var PEN_NIB = '<svg viewBox="0 0 24 24"><path d="M3 21l3-9 9-9 6 6-9 9z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/><circle cx="9.5" cy="14.5" r="1.6" fill="#111"/><path d="M3 21l5.5-5.5" stroke="#111" stroke-width="1.2"/></svg>';
    var AI_TOOLS = ['<path d="M5 3l12 7-5 1.5L9 17z"/>', '<path d="M5 3l12 7-5 1.5L9 17z" fill="none"/>', '<path d="M4 20l3-9 9-9 5 5-9 9z"/>', '<path d="M4 16c4-10 12-10 16 0"/>', '<path d="M5 5h14M12 5v14"/>', '<rect x="4" y="5" width="16" height="14"/>', '<ellipse cx="12" cy="12" rx="8" ry="6"/>', '<path d="M4 18L20 6M9 6h11v11"/>', '<circle cx="9" cy="10" r="5"/><circle cx="15" cy="14" r="5"/>'];
    function buildVector(sc){
      var P = sc.portrait, st = sc.stg, M = AB.MARK, SW = sc.SW, SH = sc.SH, fid = 'aiR-' + sc.id;
      var panelW = P ? 0 : 250, cvX = 44, cvW = SW - cvX - panelW, top = 62 + 26;
      var artW = P ? 540 : 700, artH = P ? 330 : 430, artX = cvX + (cvW - artW) / 2, artY = P ? 250 : top + 70;
      var s = (artW * (P ? .88 : .8)) / 490.16, mx = artX + (artW - 490.16 * s) / 2, my = artY + (artH - 241.75 * s) / 2;
      var names = ['A stroke', 'Planet + ring', 'B'], keys = ['a', 'planet', 'b'];
      st.innerHTML = '<div class="ai-bar"><b>Ai</b><span>File</span><span>Edit</span><span>Object</span><span>Type</span><span>Select</span><span>Effect</span><span>View</span><span>Window</span></div>' +
        '<div class="ai-ctl"><span class="ai-ctl-k">Path</span><span>Stroke <i>1 pt</i></span><span>Opacity <i>100%</i></span><span class="ai-mode">Pen tool</span></div>' +
        '<div class="ai-tools">' + AI_TOOLS.map(function(p, i){ return '<i class="ai-t' + (i === 2 ? ' pen' : i === 0 ? ' sel' : '') + '"><svg viewBox="0 0 24 24">' + p + '</svg></i>'; }).join('') + '<i class="ai-fs"><b class="f"></b><b class="s"></b></i></div>' +
        '<div class="ai-canvas" style="left:' + cvX + 'px;top:' + top + 'px;width:' + cvW + 'px"><div class="ai-doc">ab-logo.ai @ 100% (RGB/Preview)</div></div>' +
        '<div class="ai-art" style="left:' + artX + 'px;top:' + artY + 'px;width:' + artW + 'px;height:' + artH + 'px"><span>ab-logo</span></div>' +
        (P ? '' : '<div class="ai-panels"><div class="ai-p"><div class="ai-ph">Layers</div>' + names.slice().reverse().map(function(n){ return '<div class="ai-l"><i></i><b></b>' + n + '</div>'; }).join('') + '<div class="ai-l is-tpl"><i></i><b></b>Sketch v25 (template)</div></div>' +
          '<div class="ai-p"><div class="ai-ph">Pathfinder</div><div class="ai-pf"><i></i><i class="minus"></i><i></i><i></i></div></div>' +
          '<div class="ai-p"><div class="ai-ph">Swatches · tokens</div><div class="ai-sw"><i style="background:#07080D"></i><i style="background:#0E1020"></i><i style="background:#161A2E"></i><i class="star" style="background:#F2F0EA"></i><i style="background:#FF6A3D"></i><i style="background:#4C8DFF"></i></div></div></div>') +
        '<svg class="ai-svg" viewBox="0 0 ' + SW + ' ' + SH + '" aria-hidden="true"><defs><filter id="' + fid + '"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter></defs>' +
        '<g transform="translate(' + mx + ' ' + my + ') scale(' + s + ')"><g class="ai-tpl" filter="url(#' + fid + ')">' + keys.map(function(k){ return '<path d="' + M[k] + '"/>'; }).join('') + '</g>' +
        '<g class="ai-mark">' + keys.map(function(k){ return '<path class="ai-p-' + k + '" d="' + M[k] + '"/>'; }).join('') + '</g></g>' +
        '<g class="ai-anch"></g><rect class="ai-bbox" x="' + (mx - 6) + '" y="' + (my - 6) + '" width="' + (490.16 * s + 12) + '" height="' + (241.75 * s + 12) + '"/></svg>' +
        '<div class="ai-dlg"><div class="ai-dlg-h">Export for Screens</div><div class="ai-dlg-r"><span>ab-logo.svg</span><em>SVG · 5.4 KB</em></div><div class="ai-dlg-r"><span>favicon-32.png</span><em>PNG · 32 px</em></div><div class="ai-dlg-b"><b>Export Artboard</b></div></div>' +
        '<div class="ai-toast">Exported ✓</div>' +
        '<div class="ai-pen">' + PEN_NIB + '</div><div class="cur a">' + CURSOR + '</div><div class="fg-fade"></div>';
      var svg = q(st, '.ai-svg'), anch = q(st, '.ai-anch'), paths = qa(st, '.ai-mark path'), tpl = q(st, '.ai-tpl'), bbox = q(st, '.ai-bbox'), art = q(st, '.ai-art');
      var pen = q(st, '.ai-pen'), curA = q(st, '.cur.a'), fade = q(st, '.fg-fade'), dlg = q(st, '.ai-dlg'), toast = q(st, '.ai-toast'), mode = q(st, '.ai-mode');
      var layers = qa(st, '.ai-l'), minus = q(st, '.ai-pf .minus'), star = q(st, '.ai-sw .star'), dlgBtn = q(st, '.ai-dlg-b b');
      function toStage(pt){ return { x: mx + pt.x * s, y: my + pt.y * s }; }
      // anchor points + a few bezier handles along each path
      var PATHS = paths.map(function(p, i){
        var L = p.getTotalLength ? p.getTotalLength() : 800, n = i === 1 ? 16 : 10, pts = [];
        for (var j = 0; j <= n; j++){ var a = p.getPointAtLength ? p.getPointAtLength(L * j / n) : { x: 0, y: 0 }; pts.push(toStage(a)); }
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'ai-an'); anch.appendChild(g);
        g.innerHTML = pts.map(function(pt, j){
          var h = '';
          if (i === 1 && j % 4 === 2 && pts[j + 1]){ var dx = pts[j + 1].x - pts[j - 1].x, dy = pts[j + 1].y - pts[j - 1].y, dl = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / dl * 22, uy = dy / dl * 22;
            h = '<g class="ai-h"><path d="M' + (pt.x - ux) + ' ' + (pt.y - uy) + 'L' + (pt.x + ux) + ' ' + (pt.y + uy) + '"/><circle cx="' + (pt.x - ux) + '" cy="' + (pt.y - uy) + '" r="2.6"/><circle cx="' + (pt.x + ux) + '" cy="' + (pt.y + uy) + '" r="2.6"/></g>'; }
          return '<g class="ai-a" data-j="' + j + '">' + h + '<rect x="' + (pt.x - 3.5) + '" y="' + (pt.y - 3.5) + '" width="7" height="7"/></g>';
        }).join('');
        p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
        return { p: p, L: L, pts: pts, dots: qa(g, '.ai-a') };
      });
      function center(el){ var r = 0, t = 0, n = el; while (n && n !== st){ r += n.offsetLeft; t += n.offsetTop; n = n.offsetParent; } return { x: r + el.offsetWidth * .5, y: t + el.offsetHeight * .55 }; }
      var tl = gsap.timeline({ paused: true, repeat: -1 }), calls = [];
      function at(t, fn){ tl.call(fn, null, t); calls.push({ t: t, fn: fn }); }
      function reset(){ st.classList.remove('is-filled', 'is-color', 'is-sel'); if (minus) minus.classList.remove('hit'); if (star) star.classList.remove('hit'); if (dlgBtn) dlgBtn.classList.remove('hit'); layers.forEach(function(l){ l.classList.remove('on'); }); if (mode) mode.textContent = 'Pen tool'; }
      sc.onSeek = function(){ var now = tl.time(); reset(); calls.forEach(function(c){ if (c.t <= now + .001) c.fn(); }); };
      tl.addLabel('trace', 0); at(.01, reset);
      tl.set(paths, { strokeDashoffset: function(i){ return PATHS[i].L; }, fillOpacity: 0, strokeOpacity: 1 }, 0).set(qa(anch, '.ai-a'), { autoAlpha: 0 }, 0).set(anch, { autoAlpha: 1 }, 0)
        .set(tpl, { autoAlpha: 0 }, 0).set(bbox, { autoAlpha: 0 }, 0).set([dlg, toast], { autoAlpha: 0 }, 0).set(fade, { autoAlpha: 0 }, 0)
        .set(pen, { autoAlpha: 0 }, 0).set(curA, { autoAlpha: 1, x: SW * .5, y: SH * .9 }, 0);
      tl.to(tpl, { autoAlpha: .45, duration: .6 }, .2);
      if (layers.length) at(.3, function(){ layers[layers.length - 1].classList.add('on'); });
      tl.to(curA, { autoAlpha: 0, duration: .2 }, .6).to(pen, { autoAlpha: 1, duration: .2 }, .6);
      var t = .8;
      PATHS.forEach(function(o, i){
        var d = i === 1 ? 2.6 : 1.5, prog = { v: 0 };
        tl.to(o.p, { strokeDashoffset: 0, duration: d, ease: 'none' }, t);
        tl.fromTo(prog, { v: 0 }, { v: 1, duration: d, ease: 'none', immediateRender: false, onUpdate: function(){ if (!o.p.getPointAtLength) return; var pt = toStage(o.p.getPointAtLength(prog.v * o.L)); gsap.set(pen, { x: pt.x - 3, y: pt.y - 21 }); } }, t);
        tl.fromTo(o.dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .18, stagger: d / o.dots.length, ease: 'back.out(3)', immediateRender: false }, t);
        (function(li){ if (layers[li]) at(t + d, function(){ layers[li].classList.add('on'); }); })(layers.length - 2 - i);
        t += d + .25;
      });
      // pathfinder: select all, Minus Front → solid shapes with real cuts
      tl.addLabel('pathfinder', t);
      tl.to(pen, { autoAlpha: 0, duration: .2 }, t).to(curA, { autoAlpha: 1, duration: .2 }, t);
      at(t + .1, function(){ st.classList.add('is-sel'); if (mode) mode.textContent = 'Selection · 3 paths'; });
      tl.to(bbox, { autoAlpha: 1, duration: .25 }, t + .1);
      if (minus){ var mp = center(minus); tl.to(curA, { x: mp.x, y: mp.y, duration: .7, ease: 'power2.inOut' }, t + .3); at(t + 1.05, function(){ minus.classList.add('hit'); }); }
      tl.to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: .6, stagger: .12 }, t + 1.15);
      tl.to(anch, { autoAlpha: 0, duration: .4 }, t + 1.3);
      tl.to(tpl, { autoAlpha: 0, duration: .4 }, t + 1.3);
      at(t + 1.15, function(){ st.classList.add('is-filled'); });
      t += 2.2;
      // color: the site's tokens, artboard to Void, mark to Starlight
      tl.addLabel('color', t);
      if (star){ var sp = center(star); tl.to(curA, { x: sp.x, y: sp.y, duration: .7, ease: 'power2.inOut' }, t); }
      at(t + .75, function(){ if (star) star.classList.add('hit'); st.classList.add('is-color'); if (mode) mode.textContent = 'Fill · Starlight #F2F0EA'; });
      tl.to(bbox, { autoAlpha: 0, duration: .3 }, t + 1.6);
      t += 2.2;
      // export
      tl.addLabel('export', t);
      tl.fromTo(dlg, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .35, ease: 'power3.out', immediateRender: false }, t);
      if (dlgBtn){ var bp = center(dlgBtn); tl.to(curA, { x: bp.x, y: bp.y, duration: .7, ease: 'power2.inOut' }, t + .5); at(t + 1.25, function(){ dlgBtn.classList.add('hit'); }); }
      tl.to(dlg, { autoAlpha: 0, duration: .3 }, t + 1.5);
      tl.fromTo(toast, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + 1.6);
      tl.to(curA, { autoAlpha: 0, duration: .3 }, t + 2);
      tl.to(fade, { autoAlpha: 1, duration: .45 }, t + 4.4);
      tl.set({}, {}, t + 4.9);
      sc.tl = tl; sc.restAt = t - .5; tl.progress(0).pause();
      controls(sc, [{ t: 'Trace', at: 'trace' }, { t: 'Pathfinder', at: 'pathfinder' }, { t: 'Color', at: 'color' }, { t: 'Export', at: 'export' }]);
    }

    // other scene files (21-knowledge.js) register builders here and share the helpers
    function add(kind, fn){ EXT[kind] = fn; }
    // rebuild in place, keeping the playhead (a scene measured before its web font arrived calls this once it has)
    function rebuild(sc){ var t = sc.tl ? sc.tl.time() : 0; if (sc.tl) sc.tl.kill(); build(sc); if (sc.started){ sc.tl.seek(Math.min(t, sc.tl.duration() - .1)); if (sc.onSeek) sc.onSeek(); } sync(sc); }
    return { mount: mount, activate: activate, add: add, get: function(id){ return scenes[id]; },
      kit: { mk: mk, q: q, qa: qa, esc: esc, controls: controls, CURSOR: CURSOR, reduce: reduce, rebuild: rebuild } };
  })();


  /* ===== mission/21-knowledge.js ===== */
  /* =========================================================
     KNOWLEDGE SYSTEM SCENES (mission knowledge-system; the channel id picks the scene)
     graph    : a vocabulary, one new entry tagged three times, every link built from those tags
     library  : a dated blog feed becomes a themed library; filter; an answer-first article
     voice    : Voice Kit inputs → voice profile → AI draft → your edits → approved → published
     setup    : one-time setup, then a CMS entry that updates the library, a topic and a service
     video    : a video link + chapter lines become a chaptered player with a written twin
     schema   : JSON-LD from the same fields, a search result, an AI answer citing the page
     portable : the same model in the Webflow CMS, WordPress, Sanity and Markdown
     Example content is generic on purpose ("Your Company", yoursite.com): no client facts.
     ========================================================= */
  (function(){
    var K = SCENE.kit, mk = K.mk, q = K.q, qa = K.qa, esc = K.esc, CURSOR = K.CURSOR, NS = 'http://www.w3.org/2000/svg';
    var SITE = 'yoursite.com', CO = 'Your Company';

    // position of an element inside the (unscaled) stage
    function pos(st, el, fx, fy){
      var x = 0, y = 0, n = el;
      while (n && n !== st){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x: x + el.offsetWidth * (fx == null ? .5 : fx), y: y + el.offsetHeight * (fy == null ? .5 : fy) };
    }
    // a looping timeline whose class/text callbacks replay correctly when a phase chip seeks
    function run(sc, reset){
      var tl = gsap.timeline({ paused: true, repeat: -1 });
      function at(t, fn){ tl.call(fn, null, t); }
      // seek() suppresses callbacks, so typed text and counters would stay blank after a phase chip:
      // rewind silently, reset the class state, then replay up to now WITH events (tweens + calls fire in order)
      sc.onSeek = function(){
        var now = tl.time(); tl.seek(0, true); reset(); tl.seek(now, false);
      };
      at(.005, reset);
      return { tl: tl, at: at };
    }
    function end(sc, R, t, restAt, phases){
      var fade = q(sc.stg, '.fg-fade');
      R.tl.to(fade, { autoAlpha: 1, duration: .45 }, t).set({}, {}, t + .5);
      sc.tl = R.tl; sc.restAt = restAt; R.tl.progress(0).pause();
      K.controls(sc, phases);
    }
    function type(R, el, str, t, dur){
      var o = { n: 0 };
      R.tl.set(el, { textContent: '' }, 0);
      R.tl.fromTo(o, { n: 0 }, { n: str.length, duration: dur || Math.min(1.6, .035 * str.length + .15), ease: 'none', immediateRender: false,
        onUpdate: function(){ el.textContent = str.slice(0, Math.round(o.n)); } }, t);
      return t + (dur || Math.min(1.6, .035 * str.length + .15));
    }
    function count(R, el, from, to, t, dur, suf, noInit){
      var o = { v: from };
      if (!noInit) R.tl.set(el, { textContent: from + (suf || '') }, 0);
      R.tl.fromTo(o, { v: from }, { v: to, duration: dur || .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ el.textContent = Math.round(o.v) + (suf || ''); } }, t);
    }
    function path(svg, d, cls){
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls || 'ks-ln'); svg.appendChild(p);
      var L = (p.getTotalLength ? p.getTotalLength() : 400) + 2; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p._L = L;
      return p;
    }
    function hide(R, p){ R.tl.set(p, { strokeDashoffset: p._L }, 0); }
    function draw(R, p, t, d){ R.tl.to(p, { strokeDashoffset: 0, duration: d || .5, ease: 'power2.inOut' }, t); }
    function curve(a, b, vert){
      if (vert){ var my = (a.y + b.y) / 2; return 'M' + a.x + ' ' + a.y + 'C' + a.x + ' ' + my + ' ' + b.x + ' ' + my + ' ' + b.x + ' ' + b.y; }
      var mx = (a.x + b.x) / 2; return 'M' + a.x + ' ' + a.y + 'C' + mx + ' ' + a.y + ' ' + mx + ' ' + b.y + ' ' + b.x + ' ' + b.y;
    }
    function click(R, el, t){ R.tl.to(el, { scale: .93, duration: .08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t); }
    function move(R, cur, p, t, d){ R.tl.to(cur, { x: p.x, y: p.y, duration: d || .6, ease: 'power2.inOut' }, t); }
    function cursor(cls, name){ return '<div class="cur ' + cls + '">' + CURSOR + (name ? '<span class="nm">' + esc(name) + '</span>' : '') + '</div>'; }
    function head(t, s){ return '<div class="ks-top"><b>' + esc(t) + '</b>' + (s ? '<span>' + esc(s) + '</span>' : '') + '</div>'; }
    var CHECK = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg>';
    var LOCK = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1"/><path d="M4 5.5V4a2 2 0 014 0v1.5"/></svg>';

    /* ---------------- 1 · KNOWLEDGE GRAPH ---------------- */
    var CATS = [['Who you help', ['New clients', 'Growing teams', 'Families']], ['Services', ['Consulting', 'Planning', 'Ongoing care']],
      ['How it works', ['Onboarding', 'Timelines', 'Pricing']], ['What you watch for', ['Deadlines', 'Budget', 'Common mistakes']],
      ['Ideas', ['Clarity', 'Trust', 'Long-term value']], ['Known for', ['Hard cases', 'Fast answers', 'Plain English']]];
    SCENE.add('graph', function(sc){
      var P = sc.portrait, st = sc.stg;
      var cat = P ? { x: 26, y: 66, w: 190, h: 134, cols: 3, gx: 11, gy: 10 } : { x: 36, y: 92, w: 226, h: 160, cols: 2, gx: 18, gy: 18 };
      var card = P ? { x: 170, y: 364, w: 300, h: 150 } : { x: 556, y: 262, w: 270, h: 206 };
      var nd = P ? { x: 26, y: 574, w: 288, h: 56, cols: 2, gx: 12, gy: 10 } : { x: 880, y: 104, w: 286, h: 74, cols: 1, gx: 0, gy: 16 };
      var NODES = [['S', 'Service page', 'Consulting'], ['T', 'Topic page', 'Onboarding'], ['P', 'Project', 'Case study 01'], ['P', 'Project', 'Case study 02'], ['?', 'FAQ', 'What does it cost?'], ['?', 'FAQ', 'What should I bring?']];
      var TAG = [[0, 0], [1, 0], [2, 0]];
      // tagged categories sit next to the card so their lines never cross another box
      var ORDER = P ? [3, 4, 5, 0, 1, 2] : [4, 0, 3, 1, 5, 2];
      function box(o, i){ return 'left:' + (o.x + (i % o.cols) * (o.w + o.gx)) + 'px;top:' + (o.y + Math.floor(i / o.cols) * (o.h + o.gy)) + 'px;width:' + o.w + 'px;height:' + o.h + 'px'; }
      st.innerHTML = '<div class="ks-bg"></div>' + head('Knowledge graph', SITE) +
        '<svg class="ks-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        ORDER.map(function(ci, i){ var c = CATS[ci]; return '<div class="ks-cat" style="' + box(cat, i) + '"><em>0' + (i + 1) + '</em><b>' + esc(c[0]) + '</b><div>' + c[1].map(function(t, j){ return '<span class="ks-term" data-k="' + ci + ':' + j + '">' + esc(t) + '</span>'; }).join('') + '</div></div>'; }).join('') +
        '<div class="ks-card" style="left:' + card.x + 'px;top:' + card.y + 'px;width:' + card.w + 'px;height:' + card.h + 'px"><em>New insight</em><b>How long does onboarding take?</b>' +
          '<div class="ks-tags">' + TAG.map(function(k){ return '<span>' + esc(CATS[k[0]][1][k[1]]) + '</span>'; }).join('') + '</div><div class="ks-cnt">links built <i>0</i> · by hand <i>0</i></div></div>' +
        NODES.map(function(n, i){ return '<div class="ks-node" style="' + box(nd, i) + '"><i>' + n[0] + '</i><span><em>' + n[1] + '</em><b>' + esc(n[2]) + '</b></span><u>+ linked</u></div>'; }).join('') +
        '<div class="ks-cap">Tagged once. Linked everywhere.</div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var svg = q(st, '.ks-svg'), cats = qa(st, '.ks-cat'), cardEl = q(st, '.ks-card'), tags = qa(st, '.ks-tags span'), nodes = qa(st, '.ks-node'), cap = q(st, '.ks-cap'), cur = q(st, '.cur.a'), cnt = qa(st, '.ks-cnt i')[0];
      var terms = TAG.map(function(k){ return q(st, '[data-k="' + k[0] + ':' + k[1] + '"]'); });
      var tagLines = terms.map(function(el, i){
        // landscape: leave from the category box's outer edge (the term sits inside it), level with the term
        var a = P ? pos(st, el, .5, 1) : { x: cat.x + cat.cols * cat.w + (cat.cols - 1) * cat.gx, y: pos(st, el, 1, .5).y }, b = P ? { x: card.x + card.w * (.25 + i * .25), y: card.y } : { x: card.x, y: card.y + card.h * (.3 + i * .2) };
        return path(svg, curve(a, b, P), 'ks-ln on');
      });
      var nodeLines = nodes.map(function(el, i){
        if (P){
          // portrait: out of the card's side, down the margin, into the node's outer edge (never across another node)
          var L = i % 2 === 0, ay = card.y + card.h * (.3 + Math.floor(i / 2) * .22), ax = L ? card.x : card.x + card.w, e = L ? 8 : sc.SW - 8, bp = pos(st, el, L ? 0 : 1, .5);
          return path(svg, 'M' + ax + ' ' + ay + 'C' + e + ' ' + ay + ' ' + e + ' ' + bp.y + ' ' + bp.x + ' ' + bp.y, 'ks-ln');
        }
        return path(svg, curve({ x: card.x + card.w, y: card.y + card.h * (.2 + i * .12) }, pos(st, el, 0, .5)), 'ks-ln');
      });
      if (P) cap.style.cssText = 'top:' + (card.y + card.h + 14) + 'px;bottom:auto;left:50%;right:auto;transform:translateX(-50%);white-space:nowrap';
      var R = run(sc, function(){ cnt.textContent = '0'; terms.forEach(function(e){ e.classList.remove('on'); }); nodes.forEach(function(e){ e.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('vocab', 0);
      tagLines.concat(nodeLines).forEach(function(p){ hide(R, p); });
      tl.set(cats, { autoAlpha: 0, y: 14 }, 0).set(nodes, { autoAlpha: 0 }, 0).set([cardEl, cap, tags], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0)
        .set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0);
      tl.to(cats, { autoAlpha: 1, y: 0, duration: .5, stagger: .18, ease: 'power3.out' }, .2);
      tl.to(nodes, { autoAlpha: .4, duration: .5, stagger: .06 }, 1.2);
      var t = 2.6;
      tl.addLabel('tag', t);
      tl.fromTo(cardEl, { autoAlpha: 0, y: -24, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .55, ease: 'back.out(1.6)', immediateRender: false }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t + .3);
      t += .6;
      terms.forEach(function(el, i){
        move(R, cur, pos(st, el, .55, .7), t, .6); click(R, el, t + .6);
        (function(n){ R.at(t + .65, function(){ el.classList.add('on'); cnt.textContent = n; }); })(i + 1);
        tl.fromTo(tags[i], { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2.4)', immediateRender: false }, t + .7);
        draw(R, tagLines[i], t + .7, .5);
        t += 1.35;
      });
      tl.set(cnt, { textContent: '0' }, 0);
      tl.addLabel('connect', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      nodeLines.forEach(function(p, i){ draw(R, p, t + .2 + i * .22, .45); (function(el){ R.at(t + .6 + i * .22, function(){ el.classList.add('on'); }); })(nodes[i]); });
      tl.to(nodes, { autoAlpha: 1, duration: .3, stagger: .22 }, t + .45);
      count(R, cnt, 3, 9, t + .5, 1.3, '', true);
      R.at(t + 1.85, function(){ cnt.textContent = '9'; });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2);
      end(sc, R, t + 6.4, t + 3, [{ t: 'Vocabulary', at: 'vocab' }, { t: 'Tag', at: 'tag' }, { t: 'Connect', at: 'connect' }]);
    });

    /* ---------------- 2 · INSIGHTS LIBRARY ---------------- */
    var LIB = [['Getting started', 'What a first meeting covers', 'What we ask, what to bring, and what happens next.', 1],
      ['Process', 'How long does onboarding take?', 'The honest answer, step by step.', 1],
      ['Pricing', 'Pricing, explained', 'What drives the cost, and where it can flex.', 0],
      ['Common questions', 'Consulting vs. a one-off project: which fits?', 'Two ways to work together, compared.', 0],
      ['Process', 'What happens in week one', 'Listening first, then a plan in writing.', 1],
      ['Pricing', 'Is ongoing care worth it?', 'When a monthly plan pays for itself.', 0],
      ['Common questions', 'The five mistakes we see most', 'And how to avoid every one of them.', 1],
      ['Getting started', 'What to prepare before you call', 'A short list that saves a week.', 0]];
    var FEED = [['Mar 3, 2021', 'We moved offices!'], ['Nov 18, 2021', 'Holiday hours'], ['Jun 9, 2022', 'Meet the team'], ['Jan 30, 2023', 'Our thoughts on the new year'], ['Aug 14, 2024', 'Company news']];
    SCENE.add('library', function(sc){
      var P = sc.portrait, st = sc.stg;
      var g = P ? { x: 26, y: 222, w: 286, h: 124, cols: 2, gx: 16, gy: 14 } : { x: 40, y: 214, w: 262, h: 206, cols: 4, gx: 24, gy: 24 };
      function gp(i){ return { x: g.x + (i % g.cols) * (g.w + g.gx), y: g.y + Math.floor(i / g.cols) * (g.h + g.gy) }; }
      var THEMES = ['All', 'Getting started', 'Process', 'Pricing', 'Common questions'];
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-feed"><div class="ks-feed-h">Blog <i>before · a dated feed</i></div>' + FEED.map(function(f){ return '<div class="ks-feed-r"><em>' + f[0] + '</em><b>' + esc(f[1]) + '</b><span>Company news</span></div>'; }).join('') + '</div>' +
        '<div class="ks-lib-h"><em>Insights</em><b>Answers, not a feed.</b></div>' +
        '<div class="ks-chips">' + THEMES.map(function(t, i){ return '<span class="ks-chip' + (i ? '' : ' on') + '">' + esc(t) + '</span>'; }).join('') + '</div>' +
        LIB.map(function(c, i){ var p = gp(i); return '<div class="ks-lc" data-th="' + esc(c[0]) + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + g.w + 'px;height:' + g.h + 'px"><em>' + esc(c[0]) + '</em><b>' + esc(c[1]) + '</b><p>' + esc(c[2]) + '</p><span>' + (c[3] ? 'Watch · Read →' : 'Read →') + '</span></div>'; }).join('') +
        '<div class="ks-art"><div class="ks-art-c">Insights › Pricing</div><h4>Pricing, explained</h4>' +
          '<div class="ks-ans"><i>The answer, first · what search + AI quote</i><p>Most projects are priced by scope, not by the hour. Three things move the number: how much we build, how fast you need it, and how much support you want after launch.</p></div><div class="ks-lines"><i></i><i></i><i></i><i></i></div>' +
          '<div class="ks-rel"><em>Related service</em><span>Consulting</span></div>' +
          '<div class="ks-rel"><em>Shown in practice</em><span>Case study 01</span><span>Case study 02</span></div>' +
          '<div class="ks-rel"><em>Related reading</em><span>Is ongoing care worth it?</span><span>What a first meeting covers</span></div>' +
          '<div class="ks-cta"><b>Have a question like this one?</b><span>Book a call →</span></div></div>' +
        cursor('a', 'Visitor') + '<div class="fg-fade"></div>';
      var cta = q(st, '.ks-cta'), feed = q(st, '.ks-feed'), rows = qa(st, '.ks-feed-r'), hdr = q(st, '.ks-lib-h'), chips = qa(st, '.ks-chip'), cards = qa(st, '.ks-lc'), art = q(st, '.ks-art'), rels = qa(st, '.ks-rel'), ans = q(st, '.ks-ans'), cur = q(st, '.cur.a');
      var R = run(sc, function(){ chips.forEach(function(c, i){ c.classList.toggle('on', i === 0); }); cards.forEach(function(c){ c.classList.remove('hot'); }); });
      var tl = R.tl;
      tl.addLabel('library', 0);
      tl.set([hdr, chips, cards, art], { autoAlpha: 0 }, 0).set(cards, { x: 0, y: 0, scale: 1 }, 0).set([feed, rows], { autoAlpha: 1, y: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0)
        .set(cur, { autoAlpha: 0, x: sc.SW * .6, y: sc.SH + 30 }, 0).set(ans, { '--hl': 0 }, 0);
      tl.to(rows, { autoAlpha: .25, x: -12, duration: .4, stagger: .1 }, 1.6).to(feed, { autoAlpha: 0, duration: .35 }, 2.3);
      tl.fromTo(hdr, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, 2.5);
      tl.to(chips, { autoAlpha: 1, duration: .3, stagger: .06 }, 2.7);
      tl.fromTo(cards, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, ease: 'power3.out', immediateRender: false }, 2.9);
      var t = 4.8;
      tl.addLabel('filter', t);
      var chip = chips[3];
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      move(R, cur, pos(st, chip, .5, .7), t, .7); click(R, chip, t + .7);
      R.at(t + .75, function(){ chips.forEach(function(c){ c.classList.toggle('on', c === chip); }); });
      var k = 0;
      cards.forEach(function(c, i){
        if (c.getAttribute('data-th') === 'Pricing'){ var from = gp(i), to = gp(k++); tl.to(c, { x: to.x - from.x, y: to.y - from.y, duration: .6, ease: 'power3.inOut' }, t + .85); }
        else tl.to(c, { autoAlpha: 0, scale: .9, duration: .35 }, t + .8);
      });
      t += 2.2;
      tl.addLabel('answer', t);
      var target = cards[2];
      move(R, cur, { x: g.x + g.w * .5, y: g.y + g.h * .5 }, t, .6);
      R.at(t + .55, function(){ target.classList.add('hot'); });
      click(R, target, t + .65);
      tl.fromTo(art, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'power3.out', immediateRender: false }, t + .9);
      tl.to(cur, { autoAlpha: 0, duration: .2 }, t + .9);
      tl.to(ans, { '--hl': 1, duration: .6 }, t + 1.6);
      tl.fromTo(rels.concat(cta), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .35, immediateRender: false }, t + 2.4);
      end(sc, R, t + 7, t + 4, [{ t: 'Library', at: 'library' }, { t: 'Filter', at: 'filter' }, { t: 'Answer', at: 'answer' }]);
    });

    /* ---------------- 3 · VOICE KIT ---------------- */
    SCENE.add('voice', function(sc){
      var P = sc.portrait, st = sc.stg;
      var kit = P ? { x: 20, y: 58, w: 600, h: 250 } : { x: 30, y: 70, w: 370, h: 630 }, doc = P ? { x: 20, y: 324, w: 600, h: 460 } : { x: 424, y: 70, w: 746, h: 630 };
      var SAMPLE = 'Most people come to us after a bad first try. We listen first, then tell you plainly what will work.';
      var PARAS = ['Most clients are up and running in about two weeks. Here is what happens first, and what we need from you.',
        'Week one is listening. We ask about your goals, your deadlines and what went wrong last time, then we put a plan in writing.',
        'Week two, the work starts. You get one contact, a shared timeline and a short check-in every Friday.'];
      var bars = ''; for (var i = 0; i < (P ? 22 : 30); i++) bars += '<i style="--h:' + (22 + Math.round(Math.abs(Math.sin(i * 1.7) * 60 + Math.sin(i * .6) * 20))) + '%"></i>';
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-kit" style="left:' + kit.x + 'px;top:' + kit.y + 'px;width:' + kit.w + 'px;height:' + kit.h + 'px">' +
          '<div class="ks-kit-h"><b>Voice Kit</b><span>10–15 minutes</span></div><div class="ks-steps">' +
          '<div class="ks-step"><em>1 · Something you\'ve written</em><div class="ks-ta"><b></b><u></u></div></div>' +
          '<div class="ks-step"><em>2 · Your voice, out loud</em><div class="ks-rec"><span class="ks-dot"></span><div class="ks-wave">' + bars + '</div><code>0:00</code></div></div>' +
          '<div class="ks-step"><em>3 · Preferences</em><div class="ks-prefs"><span>I</span><span data-p="1">We</span><span>Mix</span></div><div class="ks-prefs"><span data-p="1">Warm</span><span>Balanced</span><span>Precise</span></div></div></div>' +
          '<div class="ks-prof"><em>Voice profile</em><ul><li>Speaks as <b>“we”</b></li><li>Warm, plain, short sentences</li><li>Explains before it sells</li><li>Never says <s>leverage</s> <s>seamless</s></li></ul></div></div>' +
        '<div class="ks-doc" style="left:' + doc.x + 'px;top:' + doc.y + 'px;width:' + doc.w + 'px;height:' + doc.h + 'px">' +
          '<div class="ks-doc-bar"><b>Draft · How long does onboarding take?</b><span class="ks-st">Draft</span><span class="ks-ok">Approve</span><span class="ks-pub">' + LOCK + 'Publish</span></div>' +
          '<div class="ks-ai"><i>✦</i><span>Claude · drafting from your voice profile</span></div>' +
          '<div class="ks-gen"><em>Generic AI</em><s>Unlock a seamless, best-in-class onboarding experience tailored to your unique needs!</s></div>' +
          '<div class="ks-body">' + PARAS.map(function(p, i){ return '<p data-i="' + i + '"></p>'; }).join('') + '</div>' +
          '<div class="ks-cm"><b>You</b>Say the Friday call is optional.</div></div>' +
        '<div class="ks-cap">Nothing goes live without your OK.</div><div class="fg-toast"><i></i><span></span></div>' + cursor('b', 'You') + '<div class="fg-fade"></div>';
      var ta = q(st, '.ks-ta b'), taCur = q(st, '.ks-ta u'), steps = qa(st, '.ks-step'), dot = q(st, '.ks-dot'), waveBars = qa(st, '.ks-wave i'), recT = q(st, '.ks-rec code'), prefs = qa(st, '[data-p]'), prof = q(st, '.ks-prof');
      var ps = qa(st, '.ks-body p'), ai = q(st, '.ks-ai'), gen = q(st, '.ks-gen'), stEl = q(st, '.ks-st'), ok = q(st, '.ks-ok'), pub = q(st, '.ks-pub'), cm = q(st, '.ks-cm'), cap = q(st, '.ks-cap'), toast = q(st, '.fg-toast'), cur = q(st, '.cur.b');
      var R = run(sc, function(){
        prefs.forEach(function(p){ p.classList.remove('on'); }); dot.classList.remove('rec'); taCur.style.display = '';
        stEl.textContent = 'Draft'; stEl.className = 'ks-st'; ok.classList.remove('done'); ok.textContent = 'Approve'; pub.classList.remove('on'); q(toast, 'span').textContent = ''; toast.classList.remove('ok');
        var p1 = ps[1]; if (p1.getAttribute('data-ed')){ p1.textContent = PARAS[1]; p1.removeAttribute('data-ed'); }
      });
      var tl = R.tl;
      tl.addLabel('capture', 0);
      tl.set([prof, ai, gen, cm, cap, toast], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(steps, { autoAlpha: .35 }, 0).set(waveBars, { scaleY: .12 }, 0)
        .set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: kit.x + kit.w * .6, y: kit.y + kit.h + 20 }, 0).set(ok, { autoAlpha: 0 }, 0);
      tl.to(steps[0], { autoAlpha: 1, duration: .3 }, .2);
      var t = type(R, ta, SAMPLE, .5, 2.2);
      R.at(t, function(){ taCur.style.display = 'none'; });
      tl.to(steps[1], { autoAlpha: 1, duration: .3 }, t);
      R.at(t + .2, function(){ dot.classList.add('rec'); });
      tl.to(waveBars, { scaleY: 1, duration: .18, stagger: { each: .05, from: 'start' }, ease: 'power2.out' }, t + .3);
      tl.set(recT, { textContent: '0:00' }, 0);
      // show the recording time as m:ss
      tl.to({}, { duration: 1.6, onUpdate: function(){ var s = Math.round(this.progress() * 192); recT.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); } }, t + .3);
      R.at(t + 2, function(){ dot.classList.remove('rec'); });
      t += 2.1;
      tl.to(steps[2], { autoAlpha: 1, duration: .3 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      prefs.forEach(function(p, i){ move(R, cur, pos(st, p, .6, .7), t + .2 + i * .8, .5); (function(el){ R.at(t + .75 + i * .8, function(){ el.classList.add('on'); }); })(p); click(R, p, t + .7 + i * .8); });
      t += 1.9;
      tl.addLabel('draft', t);
      tl.to(steps, { autoAlpha: .3, duration: .4 }, t);
      tl.fromTo(prof, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'back.out(1.6)', immediateRender: false }, t + .2);
      tl.to(cur, { autoAlpha: 0, duration: .2 }, t);
      tl.to(ai, { autoAlpha: 1, duration: .3 }, t + .8);
      tl.to(gen, { autoAlpha: 1, duration: .3 }, t + 1);
      tl.to(gen, { '--x': 1, duration: .4 }, t + 1.9); tl.set(gen, { '--x': 0 }, 0);
      tl.to(gen, { autoAlpha: .45, duration: .3 }, t + 2.3);
      t += 2.4;
      PARAS.forEach(function(s, i){ t = type(R, ps[i], s, t, Math.min(1.8, .02 * s.length + .3)) + .15; });
      tl.addLabel('review', t);
      R.at(t, function(){ stEl.textContent = 'In review'; stEl.className = 'ks-st rv'; });
      tl.to(ok, { autoAlpha: 1, duration: .3 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      var p1 = ps[1];
      move(R, cur, pos(st, p1, .85, .8), t + .1, .7);
      R.at(t + .9, function(){ p1.setAttribute('data-ed', '1'); p1.innerHTML = esc(PARAS[1].replace(/ put a plan in writing\.$/, '')) + ' <s>put a plan in writing.</s> <ins>send you a one-page plan.</ins>'; });
      move(R, cur, pos(st, ps[2], .9, .5), t + 1.6, .6);
      tl.fromTo(cm, { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .35, immediateRender: false }, t + 2.25);
      move(R, cur, pos(st, ok, .5, .7), t + 3.1, .6); click(R, ok, t + 3.7);
      R.at(t + 3.75, function(){ ok.classList.add('done'); ok.textContent = 'Approved ✓'; stEl.textContent = 'Approved'; stEl.className = 'ks-st ap'; pub.classList.add('on'); });
      t += 4.1;
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .7), t, .6); click(R, pub, t + .6);
      R.at(t + .65, function(){ q(toast, 'span').textContent = 'Published · approved by you'; toast.classList.add('ok'); });
      tl.fromTo(toast, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + .65);
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 1.2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1.4);
      end(sc, R, t + 5.2, t + 2, [{ t: 'Capture', at: 'capture' }, { t: 'Draft', at: 'draft' }, { t: 'Review', at: 'review' }, { t: 'Publish', at: 'publish' }]);
    });

    /* ---------------- 4 · SET UP ONCE, UPDATE IN MINUTES ---------------- */
    SCENE.add('setup', function(sc){
      var P = sc.portrait, st = sc.stg;
      var ed = P ? { l: 0, t: 0, w: 640, h: 380 } : { l: 0, t: 0, w: 440, h: 750 }, pv = P ? { l: 16, t: 392, w: 608, h: 396 } : { l: 468, t: 34, w: 704, h: 680 };
      var FIELDS = [{ k: 'Name', v: 'What a first meeting covers', wide: 1, req: 1 }, { k: 'Theme', v: 'Getting started', select: 1 }, { k: 'Topics', v: 'New clients · Onboarding · Consulting', select: 1 },
        { k: 'Video URL', v: 'youtube.com/watch?v=a1b2c3', wide: 1 }, { k: 'Summary', v: 'What we ask, what to bring, and what happens next.', wide: 1, area: 1 }];
      var SETUP = ['Vocabulary signed off · 6 categories', 'Topics + Insights collections', 'Existing pages tagged', 'Templates: library, article, topic pages', 'Schema, sitemap + internal links'];
      var ph = P ? 118 : 206;
      function page(url, title, body, badge){ return '<div class="ks-pg"><div class="ks-pg-u"><i></i><i></i><i></i><span>' + url + '</span><b class="ks-upd">Updated</b></div><div class="ks-pg-b"><em>' + title + '</em>' + body + '</div>' + (badge || '') + '</div>'; }
      var libCards = ''; for (var i = 0; i < 9; i++) libCards += '<i' + (i === 8 ? ' class="new"' : '') + '></i>';
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-setup"><div class="ks-setup-h"><b>One-time setup</b><span>done once, by me</span></div>' + SETUP.map(function(s){ return '<div class="ks-row"><i>' + CHECK + '</i>' + esc(s) + '</div>'; }).join('') + '<div class="ks-setup-f">Then your team only ever fills in a form.</div></div>' +
        '<div class="ks-entry"><div class="cm-ed" style="left:' + ed.l + 'px;top:' + ed.t + 'px;width:' + ed.w + 'px;height:' + ed.h + 'px">' +
          '<div class="cm-bar"><span class="cm-logo">W</span><span>' + SITE + '</span><em>CMS</em></div>' +
          '<div class="cm-crumb">Collections › <b>Insights</b> › <span class="cm-new">New item</span></div>' +
          '<div class="cm-fields">' + FIELDS.map(function(f, i){ return '<label class="cm-f' + (f.wide ? ' wide' : '') + (f.area ? ' area' : '') + '"><span>' + esc(f.k) + (f.req ? ' <i>*</i>' : '') + '</span><div class="cm-in' + (f.select ? ' dd' : '') + '" data-i="' + i + '"><b></b><u></u></div></label>'; }).join('') + '</div>' +
          '<div class="cm-act"><span class="cm-draft">Save as draft</span><span class="cm-pub">Publish</span></div></div>' +
          '<div class="ks-pvs" style="left:' + pv.l + 'px;top:' + pv.t + 'px;width:' + pv.w + 'px;height:' + pv.h + 'px">' +
            page(SITE + '/insights', 'Insights', '<div class="ks-mini">' + libCards + '</div><span class="ks-n"><b>8</b> answers</span>') +
            page(SITE + '/topics/onboarding', 'Topic · Onboarding', '<ul class="ks-li"><li>How long does onboarding take?</li><li>What happens in week one</li><li class="new">What a first meeting covers</li></ul>') +
            page(SITE + '/services/consulting', 'Service · Consulting', '<div class="ks-rr"><em>From the library</em><span>Pricing, explained</span><span>Is ongoing care worth it?</span><span class="new">What a first meeting covers</span></div>') +
          '</div><div class="ks-zero">Code written: <b>0 lines</b></div></div>' +
        cursor('a', 'Your team') + '<div class="fg-toast"><i></i><span></span></div><div class="fg-fade"></div>';
      qa(st, '.ks-pg').forEach(function(p){ p.style.height = ph + 'px'; });
      var setup = q(st, '.ks-setup'), rows = qa(st, '.ks-row'), sf = q(st, '.ks-setup-f'), entry = q(st, '.ks-entry'), ins = qa(st, '.cm-in'), vals = qa(st, '.cm-in b'), pub = q(st, '.cm-pub'), newTag = q(st, '.cm-new');
      var pages = qa(st, '.ks-pg'), upd = qa(st, '.ks-upd'), news = qa(st, '.ks-pvs .new'), nEl = q(st, '.ks-n b'), zero = q(st, '.ks-zero'), cur = q(st, '.cur.a'), toast = q(st, '.fg-toast');
      var R = run(sc, function(){ rows.forEach(function(r){ r.classList.remove('on'); }); ins.forEach(function(n){ n.classList.remove('focus', 'done'); }); pub.classList.remove('hit'); newTag.textContent = 'New item'; q(toast, 'span').textContent = ''; toast.classList.remove('ok'); pages.forEach(function(p){ p.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('setup', 0);
      tl.set([entry, sf, toast, zero, upd, news], { autoAlpha: 0 }, 0).set(toast, { xPercent: -50 }, 0).set(setup, { autoAlpha: 1, scale: 1 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: ed.w * .7, y: 60 }, 0);
      tl.fromTo(setup, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'power3.out', immediateRender: false }, .1);
      rows.forEach(function(r, i){ R.at(.8 + i * .55, function(){ r.classList.add('on'); }); });
      tl.to(sf, { autoAlpha: 1, duration: .4 }, .8 + rows.length * .55);
      var t = 1.4 + rows.length * .55 + 1.2;
      tl.to(setup, { autoAlpha: 0, scale: .96, duration: .4 }, t - .4);
      tl.addLabel('entry', t);
      tl.to(entry, { autoAlpha: 1, duration: .4 }, t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t + .2);
      t += .5;
      FIELDS.forEach(function(f, i){
        move(R, cur, pos(st, ins[i], .5, .6), t, .45);
        (function(n){ R.at(t + .4, function(){ ins.forEach(function(x, k){ x.classList.toggle('focus', k === n); if (k < n) x.classList.add('done'); }); }); })(i);
        var d = f.select ? .01 : Math.min(1, .03 * f.v.length + .2);
        type(R, vals[i], f.v, t + .5 + (f.select ? .25 : 0), d);
        if (i === 0) R.at(t + .5 + d, function(){ newTag.textContent = FIELDS[0].v; });
        t += .6 + d + (f.select ? .35 : .12);
      });
      R.at(t, function(){ ins.forEach(function(x){ x.classList.remove('focus'); x.classList.add('done'); }); });
      move(R, cur, pos(st, pub, .5, .6), t + .1, .55);
      R.at(t + .7, function(){ pub.classList.add('hit'); q(toast, 'span').textContent = 'Publishing…'; });
      tl.to(toast, { autoAlpha: 1, duration: .25 }, t + .7);
      R.at(t + 1.6, function(){ q(toast, 'span').textContent = 'Published · 3 pages updated'; toast.classList.add('ok'); });
      t += 1.9;
      tl.addLabel('connects', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      tl.to(toast, { autoAlpha: 0, duration: .3 }, t + 1.4);
      pages.forEach(function(p, i){
        (function(el){ R.at(t + i * .7, function(){ el.classList.add('on'); }); })(p);
        tl.fromTo(upd[i], { autoAlpha: 0, scale: .7 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)', immediateRender: false }, t + i * .7);
        tl.fromTo(news[i], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + .15 + i * .7);
      });
      count(R, nEl, 8, 9, t + .15, .3);
      tl.fromTo(zero, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2.4);
      end(sc, R, t + 6.4, t + 3, [{ t: 'Set up once', at: 'setup' }, { t: 'Add an entry', at: 'entry' }, { t: 'It connects', at: 'connects' }]);
    });

    /* ---------------- 5 · VIDEO WITH CHAPTERS ---------------- */
    SCENE.add('video', function(sc){
      var P = sc.portrait, st = sc.stg;
      var fp = P ? { x: 20, y: 56, w: 600, h: 236 } : { x: 30, y: 70, w: 360, h: 630 }, pg = P ? { x: 20, y: 306, w: 600, h: 480 } : { x: 414, y: 70, w: 756, h: 630 };
      var CH = [['0:00', 'The short answer', 0], ['2:14', 'What happens first', 134], ['6:38', 'Common mistakes', 398], ['10:05', 'When to call us', 605]], DUR = 760;
      var vh = P ? 200 : 318;
      st.innerHTML = '<div class="ks-bg"></div>' +
        '<div class="ks-fp" style="left:' + fp.x + 'px;top:' + fp.y + 'px;width:' + fp.w + 'px;height:' + fp.h + 'px"><div class="ks-fp-h">CMS · Insight</div>' +
          '<label>Video URL</label><div class="ks-in" data-f="url"><b></b></div><label>Duration</label><div class="ks-in sm" data-f="dur"><b></b></div>' +
          '<label>Chapters <i>one per line: time | title</i></label><div class="ks-in area" data-f="ch">' + CH.map(function(c){ return '<b class="ln"></b>'; }).join('') + '</div></div>' +
        '<div class="ks-page" style="left:' + pg.x + 'px;top:' + pg.y + 'px;width:' + pg.w + 'px;height:' + pg.h + 'px"><div class="ks-page-c">Insights › Process</div><h4>How long does onboarding take?</h4>' +
          '<div class="ks-vid" style="height:' + vh + 'px"><div class="ks-pl"><div class="ks-pl-art"></div><span class="ks-play"></span><div class="ks-pl-t"></div><div class="ks-bar"><i></i>' + CH.map(function(c){ return '<u style="left:' + (c[2] / DUR * 100) + '%"></u>'; }).join('') + '</div><code><span>0:00</span> / <em></em></code></div>' +
            '<div class="ks-chs">' + CH.map(function(c){ return '<span><b>' + c[0] + '</b>' + esc(c[1]) + '</span>'; }).join('') + '</div></div>' +
          '<div class="ks-twin"><em>Written twin · what search + AI can read</em><p><b>The short answer:</b> about two weeks. Week one is listening and a written plan; week two, the work starts.</p><p>Most delays come from three things: missing access, unclear owners and a moving deadline. Here is how we avoid each one.</p><p>If you are already behind, call us first. A short conversation usually saves a week.</p></div></div>' +
        '<div class="ks-cap">No video yet? The page leads with the text.</div>' + cursor('a', 'Your team') + '<div class="fg-fade"></div>';
      var url = q(st, '[data-f="url"] b'), dur = q(st, '[data-f="dur"] b'), lns = qa(st, '[data-f="ch"] .ln'), vid = q(st, '.ks-vid'), pl = q(st, '.ks-pl'), chips = qa(st, '.ks-chs span'), ticks = qa(st, '.ks-bar u'), bar = q(st, '.ks-bar i'), tc = q(st, '.ks-pl code span'), td = q(st, '.ks-pl code em'), plT = q(st, '.ks-pl-t'), twin = q(st, '.ks-twin'), cap = q(st, '.ks-cap'), cur = q(st, '.cur.a'), urlIn = q(st, '[data-f="url"]');
      var R = run(sc, function(){ chips.forEach(function(c){ c.classList.remove('on'); }); pl.classList.remove('has'); urlIn.classList.remove('focus'); twin.classList.remove('hl'); tc.textContent = '0:00'; plT.textContent = ''; });
      var tl = R.tl;
      tl.addLabel('link', 0);
      tl.set([chips, ticks, cap], { autoAlpha: 0 }, 0).set(vid, { height: vh, autoAlpha: 1 }, 0).set(bar, { scaleX: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: fp.x + fp.w * .5, y: fp.y + fp.h + 30 }, 0).set(td, { textContent: '' }, 0);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .2);
      move(R, cur, pos(st, urlIn, .6, .6), .2, .6);
      R.at(.8, function(){ urlIn.classList.add('focus'); });
      var t = type(R, url, 'youtube.com/watch?v=a1b2c3', .9, 1);
      R.at(t + .1, function(){ pl.classList.add('has'); urlIn.classList.remove('focus'); });
      t = type(R, dur, '12:40', t + .4, .4);
      R.at(t, function(){ td.textContent = '12:40'; });
      t += .6;
      tl.addLabel('chapters', t);
      CH.forEach(function(c, i){ t = type(R, lns[i], c[0] + ' | ' + c[1], t, .7) + .05; tl.fromTo([chips[i], ticks[i]], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t - .1); });
      var ch = chips[2];
      move(R, cur, pos(st, ch, .5, .7), t + .2, .7); click(R, ch, t + .9);
      R.at(t + .95, function(){ chips.forEach(function(c){ c.classList.toggle('on', c === ch); }); tc.textContent = '6:38'; plT.textContent = '▶  Common mistakes'; });
      tl.to(bar, { scaleX: CH[2][2] / DUR, duration: .5, ease: 'power2.out' }, t + .95);
      t += 2.6;
      tl.addLabel('twin', t);
      R.at(t, function(){ twin.classList.add('hl'); });
      t += 2.2;
      move(R, cur, pos(st, urlIn, .9, .6), t, .7);
      R.at(t + .7, function(){ urlIn.classList.add('focus'); });
      var o = { n: 1 }, S = 'youtube.com/watch?v=a1b2c3';
      tl.fromTo(o, { n: 1 }, { n: 0, duration: .6, ease: 'none', immediateRender: false, onUpdate: function(){ url.textContent = S.slice(0, Math.round(o.n * S.length)); } }, t + .8);
      R.at(t + 1.4, function(){ pl.classList.remove('has'); });
      tl.to(vid, { height: 0, autoAlpha: 0, duration: .6, ease: 'power3.inOut' }, t + 1.5);
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + 2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 2);
      end(sc, R, t + 5.4, t - 1.5, [{ t: 'Paste a link', at: 'link' }, { t: 'Chapters', at: 'chapters' }, { t: 'Written twin', at: 'twin' }]);
    });

    /* ---------------- 6 · SCHEMA + ANSWER ENGINES ---------------- */
    var JSONLD = [['<script type="application/ld+json">', 'tg'], ['{', ''], ['  "@context": "https://schema.org",', ''], ['  "@type": "Article",', 'ty'],
      ['  "headline": "How long does onboarding take?",', 'f', '← Name'], ['  "description": "The honest answer, step by step.",', 'f', '← Summary'],
      ['  "about": [', ''], ['    { "@type": "DefinedTerm", "name": "Onboarding" },', 'f', '← Topics'], ['    { "@type": "DefinedTerm", "name": "Consulting" }', 'f', ''], ['  ],', ''],
      ['  "video": { "@type": "VideoObject" },', 'f', '← Video URL'], ['  "publisher": {', ''], ['    "@type": "Organization", "name": "' + CO + '",', 'ty'],
      ['    "sameAs": ["linkedin.com/company/…"]', ''], ['  }', ''], ['}', ''], ['</' + 'script>', 'tg']];
    SCENE.add('schema', function(sc){
      var P = sc.portrait, st = sc.stg;
      var cd = P ? { x: 20, y: 54, w: 600, h: 396 } : { x: 30, y: 70, w: 590, h: 630 }, rt = P ? { x: 20, y: 462, w: 600, h: 290 } : { x: 646, y: 70, w: 524, h: 630 };
      function hl(s){ return esc(s).replace(/(&quot;[@\w]+&quot;)(:)/g, '<i class="k">$1</i>$2').replace(/: (&quot;[^&]*?&quot;)/g, ': <i class="s">$1</i>'); }
      st.innerHTML = '<div class="ks-bg"></div><div class="ks-ill">Illustration</div>' +
        '<div class="ks-code" style="left:' + cd.x + 'px;top:' + cd.y + 'px;width:' + cd.w + 'px;height:' + cd.h + 'px"><div class="ks-code-h"><b>JSON-LD</b><span>generated from the CMS entry</span></div><pre>' +
          JSONLD.map(function(l){ return '<span class="ks-cl ' + l[1] + '">' + hl(l[0]) + (l[2] ? '<em>' + l[2] + '</em>' : '') + '</span>'; }).join('') + '</pre>' +
          '<div class="ks-types"><span>Article</span><span>DefinedTerm</span><span>FAQPage</span><span>Organization</span></div></div>' +
        '<div class="ks-rt" style="left:' + rt.x + 'px;top:' + rt.y + 'px;width:' + rt.w + 'px;height:' + rt.h + 'px">' +
          '<div class="ks-serp"><div class="ks-q"><i></i><b></b></div><div class="ks-res"><div class="ks-res-s"><i>Y</i><span><b>' + CO + '</b><em>' + SITE + ' › insights › onboarding</em></span></div>' +
            '<h5>How long does onboarding take? | ' + CO + '</h5><p>The short answer: about two weeks. Week one is listening and a written plan; week two, the work starts…</p>' +
            '<div class="ks-faq"><span>What happens in week one?</span><span>Do I need to prepare anything?</span></div></div></div>' +
          '<div class="ks-chat"><div class="ks-u">How long does onboarding usually take with a consultant?</div><div class="ks-a"><i>✦</i><p></p><div class="ks-src"><em>Sources</em><span>' + SITE + '/insights/onboarding</span><span>' + SITE + '/faq</span></div></div></div></div>' +
        '<div class="fg-fade"></div>';
      var lines = qa(st, '.ks-cl'), types = qa(st, '.ks-types span'), serp = q(st, '.ks-serp'), qb = q(st, '.ks-q b'), res = q(st, '.ks-res'), faq = qa(st, '.ks-faq span'), chat = q(st, '.ks-chat'), u = q(st, '.ks-u'), a = q(st, '.ks-a'), ap = q(st, '.ks-a p'), src = qa(st, '.ks-src span');
      var R = run(sc, function(){ src.forEach(function(s){ s.classList.remove('on'); }); lines.forEach(function(l){ l.classList.remove('on'); }); });
      var tl = R.tl;
      tl.addLabel('data', 0);
      tl.set(lines, { clipPath: 'inset(0 100% 0 0)' }, 0).set([types, serp, res, faq, chat, u, a], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      var t = .3;
      lines.forEach(function(l, i){ var d = .12 + l.textContent.length * .006; tl.to(l, { clipPath: 'inset(0 0% 0 0)', duration: d, ease: 'none' }, t); if (l.classList.contains('f')) (function(el){ R.at(t + d, function(){ el.classList.add('on'); }); })(l); t += d + .03; });
      tl.fromTo(types, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .15, immediateRender: false }, t + .1);
      t += 1.4;
      tl.addLabel('search', t);
      tl.to(serp, { autoAlpha: 1, duration: .3 }, t);
      t = type(R, qb, 'how long does onboarding take', t + .3, 1.1);
      tl.fromTo(res, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t + .3);
      tl.fromTo(faq, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .2, immediateRender: false }, t + .8);
      t += 2.6;
      tl.addLabel('answers', t);
      if (P) tl.to(serp, { autoAlpha: 0, duration: .35 }, t);
      tl.to(chat, { autoAlpha: 1, duration: .3 }, t + (P ? .3 : 0));
      tl.fromTo(u, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, t + .3);
      tl.to(a, { autoAlpha: 1, duration: .3 }, t + .9);
      var A = 'Most consultants take one to two weeks. ' + CO + ' describes a two-week start: a listening week that ends with a written plan, then the work begins in week two.';
      t = type(R, ap, A, t + 1.1, 2.4);
      R.at(t + .3, function(){ src[0].classList.add('on'); });
      tl.fromTo(src, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .2, immediateRender: false }, t + .1);
      end(sc, R, t + 5, t + 1, [{ t: 'Structured data', at: 'data' }, { t: 'Search', at: 'search' }, { t: 'AI answers', at: 'answers' }]);
    });

    /* ---------------- 7 · PORTABLE ---------------- */
    var PLAT = [
      ['Webflow CMS', 'rows', [['Name', 'Plain text'], ['Slug', 'Slug'], ['Theme', 'Option'], ['Topics', 'Multi-reference → Topics', 1], ['Video URL', 'Link'], ['Chapters', 'Plain text']]],
      ['WordPress', 'code', ["register_post_type( 'insight', [ 'public' => true ] );", "register_taxonomy( 'topic',", "  [ 'insight', 'page', 'project' ] );", "// video_url, chapters: custom fields"], [1, 2]],
      ['Sanity', 'code', ["defineType({ name: 'insight', type: 'document', fields: [", "  { name: 'title', type: 'string' },", "  { name: 'topics', type: 'array',", "    of: [{ type: 'reference', to: [{ type: 'topic' }] }] },", "  { name: 'videoUrl', type: 'url' }", "]})"], [2, 3]],
      ['Markdown', 'code', ['---', 'title: How long does onboarding take?', 'theme: Process', 'topics: [onboarding, consulting, new-clients]', 'video: youtube.com/watch?v=a1b2c3', '---'], [3]]
    ];
    SCENE.add('portable', function(sc){
      var P = sc.portrait, st = sc.stg;
      var dg = P ? { y: 70, h: 200 } : { y: 78, h: 190 }, tb = P ? 300 : 300, pn = P ? { x: 20, y: 350, w: 600, h: 320 } : { x: 150, y: 350, w: 900, h: 270 };
      var NODE = ['Topics', 'Insights', 'Pages + projects'];
      var nx = P ? [70, 250, 430] : [230, 510, 790], nw = P ? 150 : 190, ny = dg.y + 60;
      st.innerHTML = '<div class="ks-bg"></div>' + head('One model, any platform', 'built natively for Webflow') +
        '<svg class="ks-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        NODE.map(function(n, i){ return '<div class="ks-mn" style="left:' + nx[i] + 'px;top:' + ny + 'px;width:' + nw + 'px">' + esc(n) + '</div>'; }).join('') +
        '<div class="ks-tabs" style="top:' + tb + 'px">' + PLAT.map(function(p){ return '<span>' + esc(p[0]) + '</span>'; }).join('') + '</div>' +
        PLAT.map(function(p){
          var inner = p[1] === 'rows' ? '<div class="ks-wf">' + p[2].map(function(r){ return '<div' + (r[2] ? ' class="hl"' : '') + '><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('') + '</div>'
            : '<pre>' + p[2].map(function(l, i){ return '<span' + (p[3].indexOf(i) > -1 ? ' class="hl"' : '') + '>' + esc(l) + '</span>'; }).join('') + '</pre>';
          return '<div class="ks-pn" style="left:' + pn.x + 'px;top:' + pn.y + 'px;width:' + pn.w + 'px;height:' + pn.h + 'px">' + inner + '</div>';
        }).join('') +
        '<div class="ks-cap">Built natively for Webflow. The model travels.</div><div class="fg-fade"></div>';
      var svg = q(st, '.ks-svg'), mns = qa(st, '.ks-mn'), tabs = qa(st, '.ks-tabs span'), pns = qa(st, '.ks-pn'), cap = q(st, '.ks-cap');
      var mh = mns[0].offsetHeight, cy = ny + mh / 2, ls = [];
      for (var i = 0; i < 2; i++){ ls.push(path(svg, 'M' + (nx[i] + nw + 8) + ' ' + cy + 'H' + (nx[i + 1] - 8), 'ks-ln on')); }
      ls.push(path(svg, 'M' + (nx[0] + nw / 2) + ' ' + (ny + mh + 6) + 'C' + (nx[0] + nw / 2) + ' ' + (ny + mh + 60) + ' ' + (nx[2] + nw / 2) + ' ' + (ny + mh + 60) + ' ' + (nx[2] + nw / 2) + ' ' + (ny + mh + 6), 'ks-ln on'));
      var lab = mk('div', 'ks-ref', 'references'); lab.style.left = (P ? 320 : 600) + 'px'; lab.style.top = (ny + mh + 42) + 'px'; st.appendChild(lab);
      var R = run(sc, function(){ tabs.forEach(function(x){ x.classList.remove('on'); }); });
      var tl = R.tl;
      ls.forEach(function(p){ hide(R, p); });
      tl.set([mns, pns, cap, lab], { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      tl.fromTo(mns, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .2, immediateRender: false }, .2);
      ls.forEach(function(p, i){ draw(R, p, .9 + i * .3, .5); });
      tl.to(lab, { autoAlpha: 1, duration: .3 }, 1.8);
      var t = 2.2;
      PLAT.forEach(function(p, i){
        tl.addLabel('p' + i, t);
        (function(n){ R.at(t, function(){ tabs.forEach(function(x, k){ x.classList.toggle('on', k === n); }); }); })(i);
        tl.fromTo(pns[i], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
        tl.fromTo(qa(pns[i], '.hl'), { '--g': 0 }, { '--g': 1, duration: .5, immediateRender: false }, t + .6);
        tl.to(mns[0], { boxShadow: '0 0 0 3px var(--acc)', duration: .3, yoyo: true, repeat: 1 }, t + .6);
        if (i < PLAT.length - 1) tl.to(pns[i], { autoAlpha: 0, y: -8, duration: .3 }, t + 2.6);
        t += 2.9;
      });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t - 2.4);
      end(sc, R, t + 1.6, t - 1.5, PLAT.map(function(p, i){ return { t: p[0].replace(' CMS', ''), at: 'p' + i }; }));
    });

    // shared with the CKS scenes (22-cks.js)
    K.ks = { pos: pos, run: run, end: end, type: type, count: count, path: path, hide: hide, draw: draw, curve: curve, click: click, move: move, cursor: cursor };
  })();

  /* ===== mission/22-cks.js ===== */
  /* =========================================================
     CKS SCENES (mission cks; the channel id picks the scene)
     cks-styles : five site personalities, one component set; the tokens swap live. Click a site to take over.
     cks-story  : a scattered site gets woven, four states interpolated the way story.js does it. Steps + a draggable scroll rail.
     cks-map    : the knowledge map (graph.js layout): search, grow the map, tag, settle. Hover, click, drag, type, grow your own.
     cks-sketch : the sketch tool (sketch.js vocabularies + matching): pick a site, react to the vocabulary, see what connects.
     cks-publish: one entry published updates the library, a topic page, a project and the JSON-LD.
     The same demos run live on getcks.io; 40-monitor swaps the live ones in once the site answers.
     Example content is the CKS site's own (yoursite.com, sample firms): no client facts.
     ========================================================= */
  (function(){
    var K = SCENE.kit, X = K.ks; if (!X) return;
    var q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';
    var pos = X.pos, run = X.run, end = X.end, type = X.type, count = X.count, pth = X.path, hide = X.hide, draw = X.draw, click = X.click, move = X.move, cursor = X.cursor;
    var SAF = '#F2A93B', COR = '#EF5B3F', TEA = '#139E8A', COB = '#2F5BEA', OCH = '#C7832A', INK = '#0B1B2B';
    // the CKS mark, from the site's own header SVG
    var LOGO = '<svg class="cx-logo" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="5" rx="1.2" fill="#EF5B3F"/><rect x="2.5" y="13" width="19" height="5" rx="1.2" fill="#139E8A"/><rect x="6" y="2.5" width="5" height="19" rx="1.2" fill="#F2A93B" stroke="#fff" stroke-width="1.4"/><rect x="13" y="2.5" width="5" height="19" rx="1.2" fill="#2F5BEA" stroke="#fff" stroke-width="1.4"/><rect x="12.3" y="6" width="6.4" height="5" fill="#EF5B3F"/><path d="M12.3 6V11M18.7 6V11" stroke="#fff" stroke-width="1.4"/><rect x="5.3" y="13" width="6.4" height="5" fill="#139E8A"/><path d="M5.3 13V18M11.7 13V18" stroke="#fff" stroke-width="1.4"/></svg>';
    // the site's typefaces (and the five sample sites'), loaded once, only when a CKS scene is built.
    // Scenes measure their layout, so one built before Schibsted Grotesk arrived rebuilds itself once it has.
    var FP = null, FONTS_OK = false;
    function fonts(sc){
      if (!FP) FP = new Promise(function(done){
        function res(){ FONTS_OK = true; done(); }
        var l = document.createElement('link'); l.id = 'cx-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700;800&family=Newsreader:ital@1&family=Lora:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;600&family=Fredoka:wght@500;700&family=Nunito+Sans:wght@400;700;800&family=Archivo+Narrow:wght@400;500&family=IBM+Plex+Mono&family=Caveat:wght@500;700&display=swap';
        l.onload = function(){ (document.fonts ? document.fonts.load('700 12px "Schibsted Grotesk"') : Promise.resolve()).then(res, res); };
        l.onerror = function(){ res(); };
        document.head.appendChild(l);
        setTimeout(res, 5000);
      });
      // (fonts.check() can't tell: it reports true while the stylesheet itself is still loading)
      if (sc && !sc._fw && !FONTS_OK){ sc._fw = true; FP.then(function(){ if (K.rebuild) K.rebuild(sc); }); }
    }
    function bar(url){ return '<div class="cx-bar"><i></i><i></i><i></i><span>' + LOGO + esc(url) + '</span></div>'; }
    function c01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
    // typing into a real <input>: the value tweens, so seeking the timeline replays it
    function typeVal(R, inp, str, t, dur){
      var o = { n: 0 }; dur = dur || Math.min(1.6, .045 * str.length + .2);
      R.tl.fromTo(o, { n: 0 }, { n: str.length, duration: dur, ease: 'none', immediateRender: false, onUpdate: function(){ inp.value = str.slice(0, Math.round(o.n)); } }, t);
      return t + dur;
    }

    /* ---------------- 1 · STYLE LAB: five sites, one component set ---------------- */
    // content + the 21 tokens each personality sets (skins.json on the CKS site)
    var TK = ['bg', 'surface', 'ink', 'muted', 'accent', 'accent-2', 'on-accent', 'line', 'font-h', 'font-b', 'font-l', 'h-w', 'h-track', 'l-case', 'l-style', 'r-lg', 'r-sm', 'pad', 'gap', 'bw', 'shadow'];
    var SKINS = [
      { n: 'Counsel', kind: 'Law firm', sw: ['#F4EDE1', '#7A1F2B'], site: 'harlowreyes.law/expertise/succession-planning', brand: 'Harlow & Reyes', tl: 'Practice area', tp: 'Business succession planning',
        df: 'Deciding now who runs, owns and inherits the business later, in writing, while everyone still agrees.', mr: '3 related articles', mw: '5 matters', th: 'Owners & families · 6 min read',
        ins: 'The handshake is not the plan', dk: 'Why the partner who “just knows” the deal is the biggest risk in a family company.', rm: 'Read the article', rl: 'Related reading',
        rel: [['What a buy-sell agreement covers', 'Answer'], ['When to start succession talks', 'Video, 8 min'], ['Two owners, one exit', 'Article']],
        fq: 'When should we start planning succession?', fa: 'Earlier than feels necessary, while every owner still agrees on what happens next.',
        tk: ['#F4EDE1', 'rgba(255,252,246,0.72)', '#2A1A17', '#6E5A52', '#7A1F2B', '#C9A26B', '#FFF8EE', 'rgba(122,31,43,0.16)', "'Lora', Georgia, serif", "'Lora', Georgia, serif", "'Lora', Georgia, serif", '600', '-0.01em', 'none', 'italic', '14px', '999px', '22px', '14px', '1px', '0 1px 0 rgba(255,255,255,.8) inset, 0 12px 28px -18px rgba(74,20,28,.35)'] },
      { n: 'Studio', kind: 'Installation studio', sw: ['#101214', '#1FE0CB'], site: 'lumenfield.studio/thinking/light-as-material', brand: 'LUMEN FIELD', tl: 'Known for', tp: 'Light as a material',
        df: 'We specify light the way others specify steel: tested, engineered and built into the structure, never added at the end.', mr: '4 related essays', mw: '7 installs', th: 'Process · 9 min',
        ins: 'Every install starts as a failure log', dk: 'What six weeks of broken prototypes teach you that a render never will.', rm: 'Read', rl: 'Related thinking',
        rel: [['Commissioning at night', 'Essay'], ['Heat is the real enemy', 'Video, 12 min'], ['Designing for maintenance', 'Essay']],
        fq: 'How long does a permanent install take?', fa: 'Most run twelve to twenty weeks from brief to opening night.',
        tk: ['#0F1113', '#171A1D', '#ECEEEE', '#8C9496', '#1FE0CB', '#2A6DF4', '#04110F', 'rgba(236,238,238,0.12)', "'Space Grotesk', Arial, sans-serif", "'Space Grotesk', Arial, sans-serif", "'JetBrains Mono', monospace", '600', '-0.035em', 'uppercase', 'normal', '4px', '2px', '20px', '10px', '1px', '0 0 0 1px rgba(31,224,203,0.06), 0 20px 40px -24px rgba(0,0,0,.8)'] },
      { n: 'Bakehouse', kind: 'Neighborhood bakery', sw: ['#FFE9A8', '#E0402B'], site: 'crumbandco.com/learn/slow-fermentation', brand: 'Crumb & Co.', tl: 'How we bake', tp: 'Slow fermentation',
        df: 'Dough that rests for two days before it meets the oven. A longer rest means deeper flavor and a better crust.', mr: '3 related reads', mw: '6 loaves', th: 'Bread basics · 4 min read',
        ins: 'Why our sourdough takes two days', dk: 'The short version: time does the work that extra yeast can’t.', rm: 'Keep reading', rl: 'More to read',
        rel: [['Storing bread the right way', 'Guide'], ['Meet our miller', 'Video, 5 min'], ['What “heritage grain” means', 'Answer']],
        fq: 'Can I order loaves for a party?', fa: 'Yes. Give us three days’ notice, since the dough needs two of them to rest.',
        tk: ['#FFEFBF', '#FFF9E6', '#3B2313', '#7A5A3E', '#E0402B', '#F59E1B', '#FFF9E6', '#3B2313', "'Fredoka', 'Arial Rounded MT Bold', sans-serif", "'Nunito Sans', Arial, sans-serif", "'Fredoka', sans-serif", '700', '0em', 'none', 'normal', '22px', '999px', '20px', '14px', '2px', '4px 4px 0 #3B2313'] },
      { n: 'Atelier', kind: 'Architecture office', sw: ['#FFFFFF', '#111111'], site: 'ateliervos.eu/positions/adaptive-reuse', brand: 'Atelier Vos', tl: 'Position 04', tp: 'Adaptive reuse',
        df: 'The most sustainable building is usually the one already standing. We design the second life of existing structures.', mr: '05 texts', mw: '09 projects', th: 'Positions · 12 min',
        ins: 'Demolition is a design decision', dk: 'Every building we keep is a drawing we don’t need to make from scratch.', rm: 'Open text', rl: 'Related texts',
        rel: [['Measuring what’s already there', 'Text'], ['The grain store, one year on', 'Film, 14 min'], ['On keeping the stairs', 'Text']],
        fq: 'Can a listed building change use?', fa: 'Often, yes. We begin with a measured survey and an early talk with the heritage officer.',
        tk: ['#FFFFFF', '#FFFFFF', '#111111', '#6B6B6B', '#111111', '#D23C1E', '#FFFFFF', '#111111', "'Archivo Narrow', 'Arial Narrow', sans-serif", "'Archivo Narrow', 'Arial Narrow', sans-serif", "'IBM Plex Mono', monospace", '500', '-0.01em', 'uppercase', 'normal', '0px', '0px', '18px', '0px', '1px', 'none'] },
      { n: 'Clinic', kind: 'Physio practice', sw: ['#E7F3F0', '#23867B'], site: 'northsidephysio.com/conditions/lower-back-pain', brand: 'Northside Physio', tl: 'Conditions we treat', tp: 'Lower back pain',
        df: 'One of the most common reasons people come to see us. Most cases improve with the right kind of movement, rather than rest alone.', mr: '4 related guides', mw: '3 programs', th: 'Back & spine · 5 min read',
        ins: 'Why rest is rarely the whole answer', dk: 'What gentle, planned movement does for a sore back, and when to see someone.', rm: 'Read the guide', rl: 'Related guides',
        rel: [['Setting up a desk that helps', 'Guide'], ['Five-minute morning routine', 'Video, 6 min'], ['When to book a check-up', 'Answer']],
        fq: 'Do I need a referral to book?', fa: 'No. You can book directly. Bring any scans or letters you already have.',
        tk: ['#E9F4F1', '#FFFFFF', '#15373A', '#4F6D6E', '#23867B', '#8CC9BE', '#FFFFFF', 'rgba(21,55,58,0.12)', "'Nunito Sans', Arial, sans-serif", "'Nunito Sans', Arial, sans-serif", "'Nunito Sans', Arial, sans-serif", '750', '-0.015em', 'none', 'normal', '18px', '10px', '26px', '18px', '1px', '0 10px 30px -18px rgba(21,55,58,.35)'] }
    ];
    // the lines shown in the tokens panel: [token name, index into tk]
    var TOKLINES = [['color.bg', 0], ['color.accent', 4], ['font.heading', 8], ['radius.lg', 15], ['border.width', 19], ['space.pad', 17]];
    SCENE.add('cks-styles', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      st.innerHTML = '<div class="cx-bg"></div>' + bar('getcks.io/styles.html') +
        '<div class="cx-sty-l"><h4>Made to match any style.</h4><p>Same markup, same CMS fields. Only the site’s design variables change.</p>' +
          '<div class="cx-tabs" role="tablist" aria-label="Site personality">' + SKINS.map(function(s, i){ return '<button type="button" class="cx-tab" role="tab" data-i="' + i + '" style="--a:' + s.sw[0] + ';--b:' + s.sw[1] + '"><span class="sw"></span><span><b>' + esc(s.n) + '</b><small>' + esc(s.kind) + '</small></span></button>'; }).join('') + '</div>' +
          '<div class="cx-tok"><em>tokens.json</em>' + TOKLINES.map(function(l){ return '<div data-l="' + l[1] + '"><i>"' + l[0] + '"</i>: <b></b></div>'; }).join('') + '</div></div>' +
        '<div class="cx-frame"><div class="cx-skin">' +
          '<div class="cx-sbar"><span data-k="site"></span></div>' +
          '<div class="cx-snav"><b data-k="brand"></b><span class="cx-links"><i></i><i></i><i></i></span><span class="cx-sbtn">Contact</span></div>' +
          '<div class="cx-sgrid">' +
            '<div class="cx-card cx-topic"><em class="cx-lab" data-k="tl"></em><h5 data-k="tp"></h5><p data-k="df"></p><div class="cx-meta"><span data-k="mr"></span><span data-k="mw"></span></div></div>' +
            '<div class="cx-card cx-ins"><div class="cx-vis"><i></i><i></i><i></i></div><em class="cx-lab" data-k="th"></em><h6 data-k="ins"></h6><p data-k="dk"></p><span class="cx-more"><span data-k="rm"></span> →</span></div>' +
            '<div class="cx-card cx-rel"><em class="cx-lab" data-k="rl"></em>' + [0, 1, 2].map(function(i){ return '<div class="cx-row"><b data-k="r' + i + '"></b><span data-k="k' + i + '"></span></div>'; }).join('') + '</div>' +
            '<div class="cx-card cx-faq"><b data-k="fq"></b><p data-k="fa"></p></div>' +
          '</div></div></div>' +
        '<div class="cx-cap">Five examples. Yours will be the sixth.</div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var skin = q(st, '.cx-skin'), tabs = qa(st, '.cx-tab'), lines = qa(st, '.cx-tok div'), cur = q(st, '.cur.a'), txts = qa(skin, '[data-k]'), shown = -1;
      function apply(i, anim){
        var s = SKINS[i], prev = shown; shown = i;
        TK.forEach(function(k, j){ skin.style.setProperty('--sk-' + k, s.tk[j]); });
        skin.style.setProperty('--sk-l-track', s.tk[13] === 'uppercase' ? '.07em' : '0em');
        var map = { site: s.site, brand: s.brand, tl: s.tl, tp: s.tp, df: s.df, mr: s.mr, mw: s.mw, th: s.th, ins: s.ins, dk: s.dk, rm: s.rm, rl: s.rl, fq: s.fq, fa: s.fa };
        s.rel.forEach(function(r, k){ map['r' + k] = r[0]; map['k' + k] = r[1]; });
        txts.forEach(function(e){ e.textContent = map[e.getAttribute('data-k')]; });
        tabs.forEach(function(b, k){ b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        lines.forEach(function(l){
          var j = +l.getAttribute('data-l'), v = s.tk[j];
          q(l, 'b').textContent = '"' + (j === 8 ? v.split(',')[0].replace(/'/g, '') : v) + '"';
          l.classList.toggle('hot', prev > -1 && SKINS[prev].tk[j] !== v);
        });
        if (anim && !K.reduce && window.gsap){
          // the grid + nav wrappers, never the cards the timeline animates (overwrite would kill the loop's tweens)
          gsap.fromTo([q(skin, '.cx-snav'), q(skin, '.cx-sgrid')], { opacity: .2 }, { opacity: 1, duration: .5, stagger: .06, ease: 'power2.out', overwrite: true });
        }
      }
      // a visitor picks a site: the loop pauses and stays on their pick
      tabs.forEach(function(b, i){ tap(b, function(){ if (sc.hold) sc.hold(); apply(i, true); }); });
      apply(0, false);
      var R = run(sc, function(){ apply(0, false); }), tl = R.tl;
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 320 : 170, y: sc.SH + 30 }, 0);
      tl.fromTo(qa(st, '.cx-card'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .08, ease: 'power3.out', immediateRender: false }, .2);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .9);
      var t = 1.1;
      [1, 2, 3, 4, 0].forEach(function(i){
        move(R, cur, pos(st, tabs[i], P ? .5 : .3, .6), t, .7); click(R, tabs[i], t + .7);
        (function(k){ R.at(t + .75, function(){ apply(k, true); }); })(i);
        t += 3.1;
      });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t - 1.6);
      end(sc, R, t + .6, t - 2.2);
    });

    /* ---------------- 2 · WOVEN ON SCROLL: the home story ---------------- */
    // [kind, where it lived, title, topics, p0, p1, p2 (= p3)], positions in % of the board (story section markup)
    var STOPICS = [['t1', 'Client onboarding', SAF, 50, 40], ['t2', 'Journey mapping', TEA, 24, 71], ['t3', 'Client handoffs', COB, 76, 71]];
    var SCARDS = [
      ['Service', 'Services page', 'Onboarding redesign', 't1', [15, 12, -6], [15, 12, 0], [16, 21, 0]],
      ['Service', 'Services page', 'Client portal build', 't3', [33, 27, 5], [33, 27, 0], [50, 88, 0]],
      ['Project', 'Portfolio', 'Riverside Clinic intake', 't1 t2', [78, 10, 5], [78, 10, 0], [17, 48, 0]],
      ['Project', 'Portfolio', 'Hale & Partners', 't1 t3', [86, 31, -4], [86, 31, 0], [83, 48, 0]],
      ['Insight', 'Blog · 2023', 'Onboarding is a design problem', 't1', [21, 70, 3], [21, 70, 0], [50, 10, 0]],
      ['Insight', 'Blog · 2022', 'Why handoffs fail on Fridays', 't3', [45, 88, -5], [45, 88, 0], [83, 92, 0]],
      ['News', 'Blog · March', 'March update', '', [62, 62, 6], [62, 62, 0], [50, 63, 0]],
      ['Answer', 'FAQ page', 'How long does onboarding take?', 't1', [84, 80, -3], [84, 80, 0], [84, 21, 0]],
      ['Video', 'YouTube only', 'The first 30 days, in 9 minutes', 't2', [54, 40, -8], [54, 40, 0], [17, 92, 0]]
    ];
    var SSTEPS = [['Scattered', 'A services page, a portfolio and a blog that never mention each other.'], ['Name the ideas', 'A shared vocabulary names what you know, in your own words.'],
      ['Tag once', 'Each page gets tagged with the ideas it proves. One field, filled in once.'], ['Connected', 'Topic pages, related rows and structured data build themselves from those tags.']];
    SCENE.add('cks-story', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var B = P ? { x: 22, y: 170, w: 584, h: 540 } : { x: 452, y: 70, w: 700, h: 566 };
      var TC = { t1: SAF, t2: TEA, t3: COB };
      st.innerHTML = '<div class="cx-bg"></div>' + bar('getcks.io/#story') +
        '<div class="cx-st-copy"><h4>Most sites list what you do. Few show how it connects.</h4><ol class="cx-steps">' +
          SSTEPS.map(function(s, i){ return '<li><button type="button" data-s="' + i + '"><i></i><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></button></li>'; }).join('') +
          '</ol><p class="cx-hint">Scroll to weave it, or pick a step.</p></div>' +
        '<div class="cx-board" style="left:' + B.x + 'px;top:' + B.y + 'px;width:' + B.w + 'px;height:' + B.h + 'px"><svg class="cx-thr" viewBox="0 0 ' + B.w + ' ' + B.h + '" aria-hidden="true"></svg>' +
          STOPICS.map(function(t){ return '<div class="cx-sto" data-t="' + t[0] + '" style="--c:' + t[2] + '"><small>Topic</small>' + esc(t[1]) + '</div>'; }).join('') +
          SCARDS.map(function(c, i){ return '<div class="cx-sc' + (c[3] ? '' : ' is-loose') + '" data-i="' + i + '" data-tags="' + c[3] + '"><small>' + esc(c[0]) + '<em>' + esc(c[1]) + '</em></small>' + esc(c[2]) + '<span class="cx-tg">' + (c[3] ? c[3].split(' ').map(function(k){ return '<i style="--c:' + TC[k] + '"></i>'; }).join('') : '') + '</span></div>'; }).join('') +
        '</div>' +
        '<div class="cx-st-meta" style="left:' + B.x + 'px;top:' + (B.y + B.h + 14) + 'px;width:' + B.w + 'px"><p><b class="cx-cnt">0</b> links built from one field on each page</p><p class="cx-schema"><code>{ }</code> Structured data, from the same tags</p></div>' +
        '<div class="cx-rail" role="slider" tabindex="0" aria-label="Scroll the story" aria-valuemin="0" aria-valuemax="3"><i></i></div>' +
        '<div class="fg-fade"></div>';
      var board = q(st, '.cx-board'), svg = q(st, '.cx-thr'), cards = qa(st, '.cx-sc'), tops = qa(st, '.cx-sto'), stepB = qa(st, '.cx-steps button'), cnt = q(st, '.cx-cnt'), schema = q(st, '.cx-schema'), rail = q(st, '.cx-rail'), thumb = q(rail, 'i');
      function px(p){ return { x: p[0] / 100 * B.w, y: p[1] / 100 * B.h }; }
      var TP = {}; STOPICS.forEach(function(t){ TP[t[0]] = px([t[3], t[4]]); });
      tops.forEach(function(e, i){ var p = TP[STOPICS[i][0]]; e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; });
      // threads: from each tagged card's final place to its topic, bowed gently
      var TH = [];
      SCARDS.forEach(function(c, i){ if (!c[3]) return; c[3].split(' ').forEach(function(k){
        var a = px(c[6]), b = TP[k], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, nx = -(b.y - a.y) * .12, ny = (b.x - a.x) * .12;
        var p = pth(svg, 'M' + a.x + ' ' + a.y + 'Q' + (mx + nx) + ' ' + (my + ny) + ' ' + b.x + ' ' + b.y, 'cx-ln');
        p.style.stroke = TC[k]; p.setAttribute('data-t', k); p.setAttribute('data-i', i); TH.push(p);
      }); });
      var state = -1, F = 0;
      // the story.js frame: every value at a (possibly fractional) state, so scrubbing interpolates
      function frame(f){
        F = f; var a = Math.floor(Math.min(f, 2.999)), k = f - a;
        function lerp(p, qq){ return p + (qq - p) * k; }
        cards.forEach(function(el, i){
          var c = SCARDS[i], Ps = [c[4], c[5], c[6], c[6]], A = Ps[a], Bq = Ps[a + 1], loose = !c[3];
          var o0 = a === 0 ? 1 : a === 1 ? .62 : 1, o1 = a + 1 === 1 ? .62 : (a + 1 === 3 && loose) ? .38 : 1;
          if (a === 2 && loose) o0 = .7; if (a === 1 && loose) o1 = .7;
          var p = px([lerp(A[0], Bq[0]), lerp(A[1], Bq[1])]);
          el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
          el.style.transform = 'translate(-50%,-50%) rotate(' + lerp(A[2] || 0, Bq[2] || 0) + 'deg)';
          el.style.opacity = lerp(o0, o1);
          el.style.setProperty('--tag', loose ? 0 : c01((f - 1.55) / .45));
          el.style.setProperty('--old', Math.max(0, 1 - f * 1.4));
        });
        var tin = c01((f - .45) / .55);
        tops.forEach(function(e, i){ var d = c01(tin * 1.4 - i * .2); e.style.opacity = d; e.style.transform = 'translate(-50%,-50%) scale(' + (.7 + .3 * d) + ')'; });
        var dk = c01((f - 2.15) / .8);
        TH.forEach(function(p, i){ var kk = c01(dk * 1.5 - i * .05); p.style.strokeDashoffset = p._L * (1 - kk); });
        cnt.textContent = Math.round(TH.length * dk);
        schema.style.opacity = c01((f - 2.65) / .35);
        thumb.style.top = (f / 3 * 100) + '%'; rail.setAttribute('aria-valuenow', Math.round(f));
        var s = Math.min(3, Math.max(0, Math.round(f - .1)));
        if (s !== state){ state = s; stepB.forEach(function(b, j){ b.classList.toggle('on', j === s); b.classList.toggle('done', j < s); b.setAttribute('aria-current', j === s ? 'step' : 'false'); }); }
      }
      // take over: step buttons ease to a state, the rail scrubs, a topic lights its threads
      var drive = { f: 0 };
      function goTo(f){ if (sc.hold) sc.hold(); drive.f = F; if (window.gsap && !K.reduce) gsap.to(drive, { f: f, duration: .8, ease: 'power2.inOut', overwrite: true, onUpdate: function(){ frame(drive.f); } }); else frame(f); }
      stepB.forEach(function(b, i){ tap(b, function(){ goTo(i); }); });
      var dragging = false;
      function scrub(e){ var r = rail.getBoundingClientRect(); frame(c01((e.clientY - r.top) / r.height) * 3); }
      rail.addEventListener('pointerdown', function(e){ dragging = true; if (sc.hold) sc.hold(); rail.setPointerCapture(e.pointerId); scrub(e); });
      rail.addEventListener('pointermove', function(e){ if (dragging) scrub(e); });
      rail.addEventListener('pointerup', function(){ dragging = false; });
      rail.addEventListener('keydown', function(e){ var d = { ArrowDown: .25, ArrowRight: .25, ArrowUp: -.25, ArrowLeft: -.25 }[e.key]; if (d == null) return; e.preventDefault(); if (sc.hold) sc.hold(); frame(Math.max(0, Math.min(3, F + d))); });
      function light(k){ board.classList.toggle('has-hl', !!k); cards.forEach(function(c){ c.classList.toggle('hl', !!k && (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + k + ' ') > -1); }); TH.forEach(function(p){ p.classList.toggle('hl', p.getAttribute('data-t') === k); }); tops.forEach(function(t){ t.classList.toggle('hl', t.getAttribute('data-t') === k); }); }
      tops.forEach(function(t){ t.addEventListener('pointerenter', function(){ light(t.getAttribute('data-t')); }); t.addEventListener('pointerleave', function(){ light(null); }); });
      frame(0);
      var o = { f: 0 }, R = run(sc, function(){ frame(0); }), tl = R.tl;
      function fr(){ frame(o.f); }
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(o, { f: 0 }, 0);
      tl.addLabel('s0', 0);
      tl.to(o, { f: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: fr }, 1.6).addLabel('s1', 1.6);
      tl.to(o, { f: 2, duration: 1.4, ease: 'power1.inOut', onUpdate: fr }, 4.4).addLabel('s2', 4.4);
      tl.to(o, { f: 3, duration: 1.9, ease: 'power1.inOut', onUpdate: fr }, 7.2).addLabel('s3', 7.2);
      end(sc, R, 13.6, 12);
    });

    /* ---------------- 3 · GROW THE MAP: the knowledge map ---------------- */
    // six topics (one per vocabulary category) and the pieces tagged with them: graph.js's whole "database"
    var GT = { t1: ['Professional firms', SAF, 'Who you help', 'Accounting, legal and advisory firms of five to fifty people, where the partners still do the selling.'],
      t2: ['Service design', COR, 'Services', 'Designing the whole experience of working with you, not just the screens a client happens to see.'],
      t3: ['Journey mapping', TEA, 'How it works', 'Walking every step a client takes, with the people who serve them, before anything is redesigned.'],
      t4: ['Client handoffs', COB, 'What you watch for', 'The moments work passes between people. Most client complaints start in one of them.'],
      t5: ['Client onboarding', OCH, 'Ideas', 'The first month with a new client is a product. Design it on purpose, or it designs itself.'],
      t6: ['Plain-language UX', INK, 'Known for', 'Forms, emails and portals that a tired person can understand the first time they read them.'] };
    var GP = { a1: ['Insight', 'Onboarding is a design problem'], a2: ['Insight', 'The first 30 days decide the next three years'], a3: ['Insight', 'Why handoffs fail on Friday afternoons'],
      a4: ['Video', 'What a journey map is really for'], q1: ['FAQ', 'How long does a redesign take?'], q2: ['FAQ', 'Do you work with small firms?'],
      p1: ['Project', 'Riverside Clinic intake'], p2: ['Project', 'Hale & Partners onboarding'], p3: ['Project', 'Northgate client portal'],
      s1: ['Service', 'Service design sprint'], s2: ['Service', 'Onboarding redesign'], s3: ['Service', 'Client portal build'] };
    var GE0 = { t1: ['a2', 'q2', 'p2', 'p3', 's1'], t2: ['a1', 'a3', 'p1', 's1', 'q1'], t3: ['a1', 'a4', 'p1', 's1'], t4: ['a3', 'p2', 's3', 'q1'], t5: ['a1', 'a2', 'p1', 's2'], t6: ['a4', 'p3', 's3', 'q2'] };
    var GICO = { Insight: '<svg viewBox="0 0 12 12"><path d="M2 2h8M2 5h8M2 8h5" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>', Video: '<svg viewBox="0 0 12 12"><path d="M4 2.5v7l5.5-3.5z" fill="currentColor"/></svg>',
      FAQ: '<svg viewBox="0 0 12 12"><path d="M4.2 4.4a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="6" cy="9.6" r=".8" fill="currentColor"/></svg>',
      Project: '<svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>', Service: '<svg viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>' };
    var GROW = { id: 'g0', title: 'Every handoff needs an owner', tags: ['t4', 't2'] };
    SCENE.add('cks-map', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg, TOP = Object.keys(GT);
      var MA = P ? { x: 0, y: 176, w: 640, h: 624, rx: 128, ry: 132, ox: 238, oy: 262 } : { x: 0, y: 112, w: 1200, h: 638, rx: 250, ry: 142, ox: 462, oy: 250 };
      var CX = MA.w / 2, CY = MA.h / 2 + 4;
      var E = {}; TOP.forEach(function(t){ E[t] = GE0[t].slice(); });
      function node(id, cls, inner){ return '<button type="button" class="cx-gn ' + cls + '" data-id="' + id + '"' + inner + '</button>'; }
      st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/#graph') +
        '<div class="cx-gbar"><label class="cx-gs"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.6 12.6 17 17"/></svg><input type="search" placeholder="Find: handoff, portal, onboarding…" autocomplete="off" aria-label="Find a topic or page on the map"><em></em></label>' +
          '<span class="cx-tally"><b>12</b> pages · <b>26</b> links</span><button type="button" class="cx-growb" aria-pressed="false">+ Grow the map</button></div>' +
        '<form class="cx-grow" novalidate><label>New insight<input type="text" maxlength="60" autocomplete="off" placeholder="What’s the idea, in your words?"></label><fieldset><legend>Tag it with</legend>' +
          TOP.map(function(t){ return '<button type="button" class="cx-tc" data-t="' + t + '" aria-pressed="false" style="--c:' + GT[t][1] + '">' + esc(GT[t][0]) + '</button>'; }).join('') +
          '</fieldset><div class="cx-gogo"><button type="submit" class="cx-add">Add to the map</button><span class="cx-note">Adds to this monitor only. Nothing is saved.</span></div></form>' +
        '<div class="cx-gx" style="left:' + MA.x + 'px;top:' + MA.y + 'px;width:' + MA.w + 'px;height:' + MA.h + 'px"><div class="cx-gin"><svg class="cx-gthr" viewBox="0 0 ' + MA.w + ' ' + MA.h + '" aria-hidden="true"></svg>' +
          TOP.map(function(t){ return node(t, 'is-t', ' style="--c:' + GT[t][1] + '"><span class="k"></span>' + esc(GT[t][0])); }).join('') +
          Object.keys(GP).map(function(id){ return node(id, '', ' data-kind="' + GP[id][0] + '"><span class="k">' + GICO[GP[id][0]] + '</span>' + esc(GP[id][1])); }).join('') +
          node(GROW.id, 'is-new', ' data-kind="Insight"><span class="k">' + GICO.Insight + '</span>' + esc(GROW.title)) +
        '</div><p class="cx-ghint">Drag to pan · hover to follow a thread</p></div>' +
        '<div class="cx-ro"><em></em><b></b><p></p><div class="cx-ron"></div></div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var gx = q(st, '.cx-gx'), gin = q(st, '.cx-gin'), svg = q(st, '.cx-gthr'), N = {}, POS = {}, PATHS = [];
      qa(st, '.cx-gn').forEach(function(n){ N[n.getAttribute('data-id')] = n; });
      var inp = q(st, '.cx-gs input'), found = q(st, '.cx-gs em'), tally = qa(st, '.cx-tally b'), growB = q(st, '.cx-growb'), form = q(st, '.cx-grow'), title = q(form, 'input'), chips = qa(form, '.cx-tc'), add = q(form, '.cx-add');
      var ro = q(st, '.cx-ro'), cur = q(st, '.cur.a');
      function isT(id){ return !!GT[id]; }
      function topicsFor(id){ return isT(id) ? [id] : TOP.filter(function(t){ return E[t].indexOf(id) > -1; }); }
      function nm(id){ return isT(id) ? GT[id][0] : GP[id] ? GP[id][1] : (N[id].textContent || '').trim(); }
      function kind(id){ return N[id].getAttribute('data-kind') || 'Insight'; }
      function links(){ return TOP.reduce(function(n, t){ return n + E[t].length; }, 0); }
      /* layout: graph.js (topics on an inner ring, each piece at the circular mean of its topics, spread, then relaxed) */
      function angleOf(t){ return (-90 + TOP.indexOf(t) * 60) * Math.PI / 180; }
      function target(id){ var ts = topicsFor(id), vx = 0, vy = 0; ts.forEach(function(t){ vx += Math.cos(angleOf(t)); vy += Math.sin(angleOf(t)); }); return Math.sqrt(vx * vx + vy * vy) < .3 ? angleOf(ts[0]) + .35 : Math.atan2(vy, vx); }
      function ring(a){ return { x: CX + Math.cos(a) * MA.ox, y: CY + Math.sin(a) * MA.oy }; }
      function place(id){ if (isT(id)){ var a = angleOf(id); return { x: CX + Math.cos(a) * MA.rx, y: CY + Math.sin(a) * MA.ry }; } return ring(target(id)); }
      function spread(ids){
        var T = 2 * Math.PI, L = ids.map(function(id){ var a = target(id); return { id: id, a: (a % T + T) % T }; });
        L.sort(function(p, r){ return p.a - r.a; });
        var n = L.length, off = 0;
        L.forEach(function(p, i){ var d = p.a - i * T / n; off += Math.atan2(Math.sin(d), Math.cos(d)); }); off /= n;
        L.forEach(function(p, i){ var s = off + i * T / n, d = Math.atan2(Math.sin(s - p.a), Math.cos(s - p.a)); POS[p.id] = ring(p.a + d * .65); });
      }
      function relax(ids, fixed){
        var R2 = ids.map(function(id){ return { id: id, x: POS[id].x, y: POS[id].y, w: N[id].offsetWidth + 14, h: N[id].offsetHeight + 12, fix: isT(id) || !!(fixed && fixed[id]) }; });
        function clamp(r){ var nx = Math.max(r.w / 2 + 6, Math.min(MA.w - r.w / 2 - 6, r.x)), ny = Math.max(r.h / 2 + 6, Math.min(MA.h - r.h / 2 - 6, r.y)); r.ex = nx !== r.x; r.ey = ny !== r.y; r.x = nx; r.y = ny; }
        for (var it = 0; it < 260; it++){
          var moved = false;
          for (var i = 0; i < R2.length; i++) for (var j = i + 1; j < R2.length; j++){
            var a = R2[i], b = R2[j]; if (a.fix && b.fix) continue;
            var ox = (a.w + b.w) / 2 - Math.abs(a.x - b.x), oy = (a.h + b.h) / 2 - Math.abs(a.y - b.y);
            if (ox <= 0 || oy <= 0) continue;
            moved = true;
            var wa = a.fix ? 0 : (b.fix ? 1 : .5), wb = 1 - wa, useX = ox * .45 < oy;
            if ((a.ex || b.ex) && useX) useX = false;
            if ((a.ey || b.ey) && !useX && !(a.ex || b.ex)) useX = true;
            if (useX){ var sx = (a.x < b.x || (a.x === b.x && i < j) ? -1 : 1) * (ox + .5); a.x += sx * wa; b.x -= sx * wb; }
            else { var sy = (a.y < b.y || (a.y === b.y && i < j) ? -1 : 1) * (oy + .5); a.y += sy * wa; b.y -= sy * wb; }
            clamp(a); clamp(b);
          }
          if (!moved) break;
        }
        R2.forEach(function(r){ POS[r.id] = { x: r.x, y: r.y }; });
      }
      // nodes are centered on their point by CSS (translate: -50% -50%), so a late web font can't shift them
      function applyPos(id, p){ p = p || POS[id]; var n = N[id]; n.style.left = p.x.toFixed(1) + 'px'; n.style.top = p.y.toFixed(1) + 'px'; }
      function curve(a, b){ var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, qx = mx + (CX - mx) * .18, qy = my + (CY - my) * .18; return 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'Q' + qx.toFixed(1) + ' ' + qy.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1); }
      function thread(t, id){ var p = pth(svg, curve(POS[t], POS[id]), 'cx-gl'); p.style.setProperty('--c', GT[t][1]); p.setAttribute('data-t', t); p.setAttribute('data-n', id); return p; }
      var BASE = Object.keys(N).filter(function(id){ return id !== GROW.id; });
      BASE.forEach(function(id){ POS[id] = place(id); });
      spread(BASE.filter(function(id){ return !isT(id); }));
      relax(BASE);
      BASE.forEach(function(id){ applyPos(id); });
      TOP.forEach(function(t){ E[t].forEach(function(id){ PATHS.push(thread(t, id)); }); });
      // the autoplay's new piece: starts between its topics, settles where the layout puts it (everything else holds still)
      var fixed = {}; BASE.forEach(function(id){ fixed[id] = 1; });
      GROW.tags.forEach(function(t){ E[t].push(GROW.id); });
      var gStart = { x: 0, y: 0 }; GROW.tags.forEach(function(t){ gStart.x += POS[t].x / GROW.tags.length; gStart.y += POS[t].y / GROW.tags.length; });
      POS[GROW.id] = place(GROW.id); relax(Object.keys(N), fixed);
      var gEnd = POS[GROW.id], gNode = N[GROW.id]; applyPos(GROW.id);
      var gPaths = GROW.tags.map(function(t){ return thread(t, GROW.id); });
      GROW.tags.forEach(function(t){ E[t].splice(E[t].indexOf(GROW.id), 1); });
      var grownOn = false;
      function setGrown(on){ grownOn = on; GROW.tags.forEach(function(t){ var k = E[t].indexOf(GROW.id); if (on && k < 0) E[t].push(GROW.id); if (!on && k > -1) E[t].splice(k, 1); }); }
      /* focus + readout (graph.js) */
      function kinds(t){ var c = { Insight: 0, Video: 0, Project: 0, Service: 0, FAQ: 0 }; E[t].forEach(function(x){ c[kind(x)]++; }); return c; }
      function readout(id){
        var ts = topicsFor(id); if (!ts.length) return;
        var t0 = ts[0], c = kinds(t0);
        q(ro, 'em').textContent = isT(id) ? 'Topic page · ' + GT[t0][2] : kind(id) + ' · tagged with ' + ts.length + ' topic' + (ts.length === 1 ? '' : 's');
        q(ro, 'b').textContent = nm(id);
        q(ro, 'p').textContent = isT(id) ? GT[t0][3] : 'Shows up on ' + ts.map(function(t){ return GT[t][0]; }).join(', ') + '.';
        q(ro, '.cx-ron').innerHTML = [['insights', c.Insight + c.Video], ['projects', c.Project], ['services', c.Service], ['answers', c.FAQ]].map(function(r){ return '<span><b>' + r[1] + '</b>' + r[0] + '</span>'; }).join('');
      }
      function focus(id){
        var ts = topicsFor(id), lit = {};
        ts.forEach(function(t){ lit[t] = 1; E[t].forEach(function(n){ if (isT(id) || n === id) lit[n] = 1; }); });
        gx.classList.toggle('has-focus', !!id);
        Object.keys(N).forEach(function(k){ var n = N[k]; n.classList.toggle('lit', !!lit[k]); n.classList.toggle('src', k === id); if (!isT(k)) n.style.setProperty('--c', lit[k] && ts[0] ? GT[ts[0]][1] : ''); });
        qa(svg, 'path').forEach(function(p){ var on = !!id && ts.indexOf(p.getAttribute('data-t')) > -1 && (isT(id) || p.getAttribute('data-n') === id); p.classList.toggle('on', on); if (on) svg.appendChild(p); });
        if (id) readout(id);
      }
      function unfocus(){ gx.classList.remove('has-focus'); Object.keys(N).forEach(function(k){ N[k].classList.remove('lit', 'src'); if (!isT(k)) N[k].style.removeProperty('--c'); }); qa(svg, 'path').forEach(function(p){ p.classList.remove('on'); }); readout('t5'); }
      function search(v){
        v = (v || '').trim().toLowerCase();
        if (v.length < 2){ found.textContent = ''; unfocus(); gx.classList.remove('is-search'); return; }
        var hit = Object.keys(N).filter(function(k){ return (N[k].style.visibility !== 'hidden' && !(k === GROW.id && !grownOn)) && nm(k).toLowerCase().indexOf(v) > -1; });
        gx.classList.add('is-search', 'has-focus');
        Object.keys(N).forEach(function(k){ N[k].classList.toggle('lit', hit.indexOf(k) > -1); N[k].classList.remove('src'); });
        qa(svg, 'path').forEach(function(p){ p.classList.toggle('on', hit.indexOf(p.getAttribute('data-t')) > -1 || hit.indexOf(p.getAttribute('data-n')) > -1); });
        found.textContent = hit.length + ' found';
        if (hit[0]) readout(hit[0]);
      }
      function setTally(p, l){ tally[0].textContent = p; tally[1].textContent = l; }
      function openForm(on){ form.classList.toggle('on', on); growB.setAttribute('aria-pressed', on ? 'true' : 'false'); }
      /* a visitor's own pieces (not part of the loop; the next loop clears them) */
      var mine = [];
      function growMine(){
        var tags = chips.filter(function(c){ return c.getAttribute('aria-pressed') === 'true'; }).map(function(c){ return c.getAttribute('data-t'); });
        var tt = (title.value || '').trim().slice(0, 60);
        if (!tt || !tags.length){ q(form, '.cx-note').textContent = !tt ? 'Give it a title first.' : 'Pick at least one topic.'; return; }
        var id = 'm' + (mine.length + 1), b = document.createElement('button');
        b.type = 'button'; b.className = 'cx-gn is-new is-mine'; b.setAttribute('data-id', id); b.setAttribute('data-kind', 'Insight');
        b.innerHTML = '<span class="k">' + GICO.Insight + '</span>' + esc(tt); gin.appendChild(b); N[id] = b; bind(id);
        tags.forEach(function(t){ E[t].push(id); });
        var fx = {}; Object.keys(POS).forEach(function(k){ fx[k] = 1; });
        var s0 = { x: 0, y: 0 }; tags.forEach(function(t){ s0.x += POS[t].x / tags.length; s0.y += POS[t].y / tags.length; });
        POS[id] = place(id); relax(Object.keys(POS).concat(id), fx);
        var e1 = POS[id], ps = tags.map(function(t){ return thread(t, id); });
        applyPos(id, s0); mine.push({ id: id, tags: tags, paths: ps });
        if (window.gsap && !K.reduce){
          gsap.fromTo(b, { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.6)' });
          gsap.to(b, { left: e1.x, top: e1.y, duration: .9, ease: 'power3.inOut', delay: .35 });
          ps.forEach(function(p, i){ gsap.to(p, { strokeDashoffset: 0, duration: .6, delay: 1.1 + i * .12 }); });
        } else { applyPos(id); ps.forEach(function(p){ p.style.strokeDashoffset = 0; }); }
        setTally(12 + (grownOn ? 1 : 0) + mine.length, links());
        title.value = ''; chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); });
        q(form, '.cx-note').textContent = 'Added. It found its place from its tags.'; openForm(false);
        setTimeout(function(){ focus(id); }, 900);
      }
      function clearMine(){ mine.forEach(function(m){ m.tags.forEach(function(t){ var k = E[t].indexOf(m.id); if (k > -1) E[t].splice(k, 1); }); m.paths.forEach(function(p){ p.remove(); }); N[m.id].remove(); delete N[m.id]; delete POS[m.id]; }); mine = []; }
      function bind(id){
        var n = N[id];
        n.addEventListener('pointerenter', function(){ if (!gx.classList.contains('is-search')) focus(id); });
        n.addEventListener('pointerleave', function(){ if (sc.paused || gx.classList.contains('is-search')) return; unfocus(); });
        tap(n, function(){ if (sc.hold) sc.hold(); focus(id); });
      }
      Object.keys(N).forEach(bind);
      inp.addEventListener('focus', function(){ if (sc.hold) sc.hold(); });
      inp.addEventListener('input', function(){ search(inp.value); });
      tap(growB, function(){ if (sc.hold) sc.hold(); openForm(!form.classList.contains('on')); if (form.classList.contains('on')) title.focus(); });
      title.addEventListener('focus', function(){ if (sc.hold) sc.hold(); });
      chips.forEach(function(c){ tap(c, function(){ if (sc.hold) sc.hold(); c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
      form.addEventListener('submit', function(e){ e.preventDefault(); if (sc.hold) sc.hold(); growMine(); });
      // drag to pan
      var pan = { x: 0, y: 0 }, drag = null;
      gx.addEventListener('pointerdown', function(e){ if (e.target.closest('.cx-gn')) return; drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }; gx.setPointerCapture(e.pointerId); gx.classList.add('is-drag'); });
      gx.addEventListener('pointermove', function(e){ if (!drag) return; var k = sc.k || 1; pan.x = drag.px + (e.clientX - drag.x) / k; pan.y = drag.py + (e.clientY - drag.y) / k; gin.style.transform = 'translate(' + pan.x + 'px,' + pan.y + 'px)'; if (sc.hold && (Math.abs(e.clientX - drag.x) > 4)) sc.hold(); });
      gx.addEventListener('pointerup', function(){ drag = null; gx.classList.remove('is-drag'); });
      /* the loop */
      var nodesT = TOP.map(function(t){ return N[t]; }), nodesP = BASE.filter(function(id){ return !isT(id); }).map(function(id){ return N[id]; });
      var R = run(sc, function(){
        clearMine(); pan.x = pan.y = 0; gin.style.transform = '';
        setGrown(false); inp.value = ''; title.value = ''; found.textContent = ''; gx.classList.remove('is-search'); openForm(false);
        chips.forEach(function(c){ c.setAttribute('aria-pressed', 'false'); }); q(form, '.cx-note').textContent = 'Adds to this monitor only. Nothing is saved.';
        unfocus(); setTally(12, 26);
      });
      var tl = R.tl;
      tl.addLabel('map', 0);
      PATHS.concat(gPaths).forEach(function(p){ hide(R, p); });
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0).set(gNode, { autoAlpha: 0, scale: .4, left: gStart.x, top: gStart.y }, 0);
      tl.fromTo(nodesT, { autoAlpha: 0, scale: .5 }, { autoAlpha: 1, scale: 1, duration: .45, stagger: .08, ease: 'back.out(1.8)', immediateRender: false }, .2);
      tl.fromTo(nodesP, { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, stagger: .04, immediateRender: false }, .7);
      PATHS.forEach(function(p, i){ draw(R, p, 1.1 + i * .035, .5); });
      count(R, tally[0], 0, 12, .7, .9); count(R, tally[1], 0, 26, 1.1, 1.2);
      var t = 3.2;
      tl.addLabel('search', t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      move(R, cur, pos(st, inp, .3, .7), t, .7); click(R, q(st, '.cx-gs'), t + .7);
      var te = typeVal(R, inp, 'hand', t + .9, .7);
      R.at(te + .05, function(){ search('hand'); });
      tl.set(inp, { value: '' }, 0);
      R.at(te + 2.4, function(){ inp.value = ''; search(''); });
      t = te + 2.8;
      tl.addLabel('grow', t);
      move(R, cur, pos(st, growB, .5, .6), t, .7); click(R, growB, t + .7);
      R.at(t + .75, function(){ openForm(true); });
      move(R, cur, pos(st, title, .3, .7), t + 1.1, .6);
      tl.set(title, { value: '' }, 0);
      t = typeVal(R, title, GROW.title, t + 1.8, 1.4);
      GROW.tags.forEach(function(k, i){ var c = q(form, '[data-t="' + k + '"]'); move(R, cur, pos(st, c, .5, .7), t + .2 + i * .9, .55); click(R, c, t + .75 + i * .9); R.at(t + .8 + i * .9, function(){ c.setAttribute('aria-pressed', 'true'); }); });
      t += .3 + GROW.tags.length * .9;
      move(R, cur, pos(st, add, .5, .6), t, .55); click(R, add, t + .55);
      R.at(t + .6, function(){ openForm(false); setGrown(true); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + .8);
      tl.to(gNode, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' }, t + .7);
      tl.to(gNode, { left: gEnd.x, top: gEnd.y, duration: 1, ease: 'power3.inOut' }, t + 1.2);
      gPaths.forEach(function(p, i){ draw(R, p, t + 2 + i * .15, .6); });
      count(R, tally[0], 12, 13, t + 2, .3, '', true); count(R, tally[1], 26, 28, t + 2, .6, '', true);
      R.at(t + 2.3, function(){ focus(GROW.id); });
      end(sc, R, t + 7.2, t + 4, [{ t: 'Map', at: 'map' }, { t: 'Search', at: 'search' }, { t: 'Grow', at: 'grow' }]);
    });

    /* ---------------- 4 · SKETCH YOUR SYSTEM: the sketch tool ---------------- */
    // sketch.js: each term is [label, keywords]; keywords are matched against page titles (US spelling here)
    var SKF = ['#F2A93B', '#EF5B3F', '#139E8A', '#2F5BEA', '#C7832A', '#0B1B2B'];
    var SKV = {
      law: [['Who you help', [['Family businesses', 'family business owner owners farm company'], ['Founders', 'founder founders cofounder'], ['Landlords', 'landlord landlords property'], ['Non-profits', 'nonprofit charity charities']]],
        ['Practice areas', [['Succession planning', 'succession exit retire retirement generation'], ['Buy-sell agreements', 'buysell buyout agreement agreements'], ['Commercial leases', 'lease leases commercial tenant'], ['Wills and trusts', 'will wills trust trusts estate'], ['Employment law', 'employment employee employees contract contracts hire']]],
        ['How you work', [['Fixed fees', 'fee fees fixed cost costs price'], ['Plain-language drafting', 'plain drafting language'], ['Kitchen-table meetings', 'meeting meetings kitchen consultation']]],
        ['What you watch for', [['Family disputes', 'dispute disputes conflict'], ['Tax on exit', 'tax taxes'], ['Key-person risk', 'risk keyperson']]],
        ['Ideas', [['The handshake is not the plan', 'handshake'], ['Start before you need to', 'start early when']]],
        ['Known for', [['Succession planning', 'succession generation'], ['Plain-language drafting', 'plain']]]],
      bakery: [['Who it’s for', [['Neighbors', 'neighbor neighbors neighbour neighbours neighborhood neighbourhood local community corner'], ['Cafés and restaurants', 'cafe cafes café cafés restaurant restaurants wholesale'], ['Weddings and parties', 'wedding weddings party parties celebration']]],
        ['What we bake', [['Sourdough', 'sourdough bread breads loaf loaves'], ['Pastries', 'pastry pastries croissant croissants bun buns'], ['Celebration cakes', 'cake cakes birthday celebration'], ['Wholesale bread', 'wholesale']]],
        ['How we make it', [['Long fermentation', 'ferment fermentation overnight'], ['Local flour', 'flour miller mill grain wheat'], ['Baked each morning', 'fresh daily']]],
        ['What we care about', [['Less waste', 'waste yesterday leftover leftovers'], ['Allergies and labels', 'allergy allergies allergen gluten glutenfree label labels']]],
        ['Ideas', [['Slow bread is better bread', 'slow'], ['Bread is a neighborhood thing', 'neighborhood neighbourhood']]],
        ['Known for', [['Sourdough', 'sourdough'], ['Morning buns', 'bun buns']]]],
      clinic: [['Who you help', [['Runners', 'runner runners running marathon'], ['Desk workers', 'desk office posture'], ['After surgery', 'surgery postop rehab']]],
        ['Treatments', [['Sports physio', 'sport sports physiotherapy injury'], ['Back and neck pain', 'neck pain backache'], ['Knee rehab', 'knee acl'], ['Pelvic health', 'pelvic']]],
        ['How it works', [['Movement assessment', 'assessment assess sessions'], ['Home exercise plans', 'exercise exercises stretch stretches home'], ['Online appointments', 'online video appointment appointments']]],
        ['What we watch for', [['Injuries that come back', 'recurring return again'], ['Pain that isn’t improving', 'improving persistent chronic']]],
        ['Ideas', [['Rest isn’t always the answer', 'rest'], ['Strength is the treatment', 'strength strong']]],
        ['Known for', [['Knee rehab', 'knee acl'], ['Runners', 'marathon runner runners']]]]
    };
    var SKS = {
      law: { n: 'Counsel', d: 'A law firm · 12 pages', sw: ['#F4EDE1', '#7A1F2B'], cut: 'Landlords', ren: ['Founders', 'Company founders'], pages: [
        ['Service', 'Succession planning'], ['Service', 'Commercial leases'], ['Service', 'Wills and trusts'], ['Service', 'Employment law'],
        ['Project', 'Passing the family farm to the next generation'], ['Project', 'A buyout between two founders'],
        ['Article', 'What a buy-sell agreement covers'], ['Article', 'When should owners start succession talks?'],
        ['Answer', 'How much does a will cost?'], ['Answer', 'Do you offer fixed fees?'],
        ['News', 'Office closed for the holidays'], ['News', 'A new partner joins the firm']] },
      bakery: { n: 'Bakehouse', d: 'A neighborhood bakery · 12 pages', sw: ['#FFF3D6', '#E0402B'], cut: 'Weddings and parties', ren: ['Neighbors', 'Regulars'], pages: [
        ['Product', 'Our breads'], ['Product', 'Celebration cakes'], ['Product', 'Wholesale for cafés'],
        ['Story', 'The corner café we’ve baked for since day one'],
        ['Article', 'Why we ferment for 36 hours'], ['Article', 'Meet our miller'], ['Article', 'What happens to yesterday’s bread'],
        ['Answer', 'Do you have gluten-free options?'], ['Answer', 'Can I order a cake for Saturday?'],
        ['News', 'Holiday opening hours'], ['News', 'We’re hiring a morning baker'], ['Page', 'About us']] },
      clinic: { n: 'Clinic', d: 'A physio practice · 12 pages', sw: ['#EAF5F2', '#23867B'], cut: 'Pain that isn’t improving', ren: ['Desk workers', 'Office workers'], pages: [
        ['Service', 'Sports physiotherapy'], ['Service', 'Pelvic health'], ['Service', 'Online appointments'],
        ['Story', 'Back to the marathon after ACL surgery'],
        ['Article', 'Why rest isn’t always the answer for back pain'], ['Article', 'Five desk stretches that actually help'], ['Article', 'What happens at your first assessment'],
        ['Answer', 'Do I need a referral?'], ['Answer', 'How many sessions will I need?'],
        ['News', 'Our new clinic in Eastside'], ['Page', 'Meet the team'], ['Page', 'Prices']] }
    };
    var STOP = ' a an the and or of for to in on at is are do does you your we our it its what who how why when which with can should i me my be by from this that they them after before about into than then there their so if as not up out new meet one five day us all ';
    function stem(w){ return w.toLowerCase().replace(/[’'.,!?:;()"“”]/g, '').replace(/-/g, '').replace(/(ies)$/, 'y').replace(/(ings|ing|es|s|ed)$/, ''); }
    function words(t){ return (t.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(function(w){ return w.toLowerCase(); }).filter(function(w){ return w.length > 2 && STOP.indexOf(' ' + w.replace(/[’']/g, '') + ' ') < 0; }).map(stem).filter(function(w){ return w.length > 2; }); }
    function hit(a, b){ return a === b || (a.length >= 5 && b.length >= 5 && (a.indexOf(b) === 0 || b.indexOf(a) === 0)); }
    var PRI = [1, 2, 0, 3, 4, 5];
    // sketch.js connect(): merge the same label across categories, tag each page with up to three terms
    function connect(key){
      var s = SKS[key], byLabel = {}, merged = [];
      SKV[key].forEach(function(f, fi){ f[1].forEach(function(t){
        if (t[0] === s.cut) return;
        var lab = t[0] === s.ren[0] ? s.ren[1] : t[0], k = lab.toLowerCase();
        if (!byLabel[k]){ byLabel[k] = { label: lab, fs: [], kw: [] }; merged.push(byLabel[k]); }
        var m = byLabel[k]; if (m.fs.indexOf(fi) < 0) m.fs.push(fi);
        t[1].split(' ').map(stem).forEach(function(w){ if (m.kw.indexOf(w) < 0) m.kw.push(w); });
      }); });
      var links = [], pages = s.pages.map(function(p, pi){
        var ws = words(p[1]), fd = [];
        merged.forEach(function(m, mi){ if (m.kw.some(function(k){ return ws.some(function(w){ return hit(w, k); }); })) fd.push(mi); });
        fd.sort(function(a, b){ return PRI.indexOf(merged[a].fs[0]) - PRI.indexOf(merged[b].fs[0]); });
        fd = fd.slice(0, 3); fd.forEach(function(mi){ links.push([pi, mi]); });
        return { type: p[0], title: p[1], terms: fd };
      });
      merged.forEach(function(m, mi){ m.n = links.filter(function(l){ return l[1] === mi; }).length; });
      return { pages: pages, terms: merged, links: links };
    }
    SCENE.add('cks-sketch', function(sc){
      fonts(sc);
      var st = sc.stg;
      if (!sc.skKey) sc.skKey = 'law';
      render(sc.skKey);
      function render(key){
        var P = sc.portrait, s = SKS[key], G = connect(key), V = SKV[key];
        var total = 0; V.forEach(function(f){ total += f[1].length; });
        var usedAll = G.terms.map(function(t, i){ return i; }).filter(function(i){ return G.terms[i].n > 0; }).sort(function(a, b){ return G.terms[b].n - G.terms[a].n; }), used = usedAll.slice(0, P ? 8 : 10);
        var conn = G.pages.filter(function(p){ return p.terms.length; }).length, empty = G.terms.filter(function(t){ return !t.n; }), strong = G.terms.filter(function(t){ return t.n >= 3; });
        var types = []; s.pages.forEach(function(p){ if (types.indexOf(p[0]) < 0) types.push(p[0]); });
        function chip(t, fi){ return '<span class="cx-vt" style="--c:' + SKF[fi] + '" data-l="' + esc(t[0]) + '"><b>' + esc(t[0]) + '</b></span>'; }
        function pageCard(p, pi){ return '<div class="cx-skp' + (p.terms.length ? '' : ' is-orphan') + '" data-p="' + pi + '"><small>' + esc(p.type) + '</small><b>' + esc(p.title) + '</b></div>'; }
        var Lc = [], Rc = []; G.pages.forEach(function(p, pi){ (pi % 2 ? Rc : Lc).push(pageCard(p, pi)); });
        st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/sketch.html') +
          '<div class="cx-sk-top"><ol class="cx-sks">' + [['Your site', 'Pick a sample'], ['Your vocabulary', 'Keep, cut or rename'], ['How it connects', 'Your pages, woven']].map(function(x, i){ return '<li><button type="button" data-go="' + i + '"><i>' + (i + 1) + '</i><span><b>' + x[0] + '</b><small>' + x[1] + '</small></span></button></li>'; }).join('') + '</ol>' +
            '<div class="cx-skpick"><em>Sample</em>' + Object.keys(SKS).map(function(k){ return '<button type="button" data-k="' + k + '" class="' + (k === key ? 'on' : '') + '" style="--a:' + SKS[k].sw[0] + ';--b:' + SKS[k].sw[1] + '"><span class="sw"></span>' + esc(SKS[k].n) + '</button>'; }).join('') + '</div></div>' +
          /* step 1 */
          '<div class="cx-skpan" data-pan="0"><h4>Start with a site.</h4><div class="cx-samples">' + Object.keys(SKS).map(function(k){ return '<div class="cx-sam' + (k === key ? ' is-me' : '') + '" style="--a:' + SKS[k].sw[0] + ';--b:' + SKS[k].sw[1] + '"><span class="sw"></span><span><b>' + esc(SKS[k].n) + '</b><small>' + esc(SKS[k].d) + '</small></span></div>'; }).join('') + '</div>' +
            '<p class="cx-sklab">Your site today <span>· nothing points anywhere else</span></p><div class="cx-silos">' + types.slice(0, P ? 4 : 5).map(function(ty){ return '<div class="cx-silo"><em>' + esc(ty) + '</em>' + s.pages.filter(function(p){ return p[0] === ty; }).map(function(p){ return '<span>' + esc(p[1]) + '</span>'; }).join('') + '</div>'; }).join('') + '</div>' +
            '<span class="cx-skbtn" data-b="0">Draft my vocabulary →</span></div>' +
          /* step 2 */
          '<div class="cx-skpan" data-pan="1"><h4>React to a strawman.</h4><p class="cx-skcnt"><b class="k">' + total + '</b> terms kept · <span class="c">0</span> cut · <span class="r">0</span> renamed</p><div class="cx-facets">' +
            V.map(function(f, fi){ return '<div class="cx-facet" style="--c:' + SKF[fi] + '"><em>' + esc(f[0]) + '</em><div>' + f[1].map(function(t){ return chip(t, fi); }).join('') + '</div></div>'; }).join('') +
            '</div><span class="cx-skbtn" data-b="1">Connect my pages →</span></div>' +
          /* step 3 */
          '<div class="cx-skpan" data-pan="2"><div class="cx-skstats">' +
            [[conn + '<small>/' + G.pages.length + '</small>', 'pages connect to your vocabulary'], [G.links.length, 'links built from tags alone'], [usedAll.length + '<small>/' + G.terms.length + '</small>', 'terms with a page behind them'], [G.pages.length - conn, 'page' + (G.pages.length - conn === 1 ? '' : 's') + ' with no match yet']].map(function(x){ return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>' +
            '<div class="cx-skmap"><svg class="cx-skthr" aria-hidden="true"></svg><div class="cx-skc l">' + Lc.join('') + '</div><div class="cx-skc t">' +
              used.map(function(ti){ var t = G.terms[ti]; return '<div class="cx-skt" data-t="' + ti + '" style="--c:' + SKF[t.fs[0]] + '"><span>' + t.fs.map(function(f){ return '<i style="--c:' + SKF[f] + '"></i>'; }).join('') + '</span>' + esc(t.label) + '<b>' + t.n + '</b></div>'; }).join('') +
            '</div><div class="cx-skc r">' + Rc.join('') + '</div></div>' +
            '<div class="cx-gaps">' +
              '<div><em>Not connected yet</em><p>' + G.pages.filter(function(p){ return !p.terms.length; }).map(function(p){ return esc(p.title); }).join(' · ') + '</p></div>' +
              '<div class="w"><em>Nothing behind these yet</em><p>' + empty.slice(0, 6).map(function(t){ return '<span style="--c:' + SKF[t.fs[0]] + '">' + esc(t.label) + '</span>'; }).join('') + '</p></div>' +
              '<div class="k"><em>Connects everywhere</em><p>' + (strong.length ? strong.map(function(t){ return '<span style="--c:' + SKF[t.fs[0]] + '">' + esc(t.label) + ' · ' + t.n + '</span>'; }).join('') : '<small>Nothing yet with three or more pages</small>') + '</p></div>' +
            '</div></div>' +
          cursor('a', 'You') + '<div class="fg-fade"></div>';
        var pans = qa(st, '.cx-skpan'), goB = qa(st, '.cx-sks button'), cur = q(st, '.cur.a'), me = q(st, '.cx-sam.is-me'), silos = qa(st, '.cx-silo'), btn = qa(st, '.cx-skbtn');
        var cutEl = q(st, '.cx-vt[data-l="' + s.cut + '"]'), renEl = q(st, '.cx-vt[data-l="' + s.ren[0] + '"]'), kept = q(st, '.cx-skcnt .k'), cutN = q(st, '.cx-skcnt .c'), renN = q(st, '.cx-skcnt .r');
        var facets = qa(st, '.cx-facet'), stats = qa(st, '.cx-skstats div'), map = q(st, '.cx-skmap'), svg = q(st, '.cx-skthr'), pcs = qa(st, '.cx-skp'), tms = qa(st, '.cx-skt'), gaps = qa(st, '.cx-gaps > div');
        // threads: page edge → term edge (drawn once the step-3 layout exists)
        svg.setAttribute('viewBox', '0 0 ' + map.offsetWidth + ' ' + map.offsetHeight);
        var TH = [];
        G.links.forEach(function(l){
          var pe = q(map, '.cx-skp[data-p="' + l[0] + '"]'), te = q(map, '.cx-skt[data-t="' + l[1] + '"]'); if (!pe || !te) return;
          var left = l[0] % 2 === 0, a = pos(map, pe, left ? 1 : 0, .5), b = pos(map, te, left ? 0 : 1, .5);
          var p = pth(svg, X.curve(a, b), 'cx-skl'); p.style.stroke = te.style.getPropertyValue('--c'); TH.push(p);
        });
        function show(i){ pans.forEach(function(p, k){ p.classList.toggle('on', k === i); }); goB.forEach(function(b, k){ b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); }); }
        var R = run(sc, function(){ show(0); if (cutEl) cutEl.classList.remove('cut'); if (renEl){ renEl.classList.remove('ed'); q(renEl, 'b').textContent = s.ren[0]; } kept.textContent = total; cutN.textContent = '0'; renN.textContent = '0'; if (me) me.classList.remove('on'); }), tl = R.tl;
        tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0);
        tl.addLabel('site', 0);
        tl.set(silos, { autoAlpha: 0 }, 0);
        tl.to(cur, { autoAlpha: 1, duration: .2 }, .5);
        move(R, cur, pos(st, me, .5, .6), .5, .8); click(R, me, 1.3);
        R.at(1.35, function(){ me.classList.add('on'); });
        tl.fromTo(silos, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .12, immediateRender: false }, 1.5);
        move(R, cur, pos(st, btn[0], .5, .6), 3, .7); click(R, btn[0], 3.7);
        var t = 3.9;
        tl.addLabel('vocab', t);
        R.at(t, function(){ show(1); });
        tl.fromTo(facets, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .08, immediateRender: false }, t + .1);
        if (cutEl){ move(R, cur, pos(st, cutEl, .5, .6), t + .9, .7); click(R, cutEl, t + 1.6); R.at(t + 1.65, function(){ cutEl.classList.add('cut'); kept.textContent = total - 1; cutN.textContent = '1'; }); }
        if (renEl){
          move(R, cur, pos(st, renEl, .5, .6), t + 2.4, .7); click(R, renEl, t + 3.1); click(R, renEl, t + 3.3);
          var rb = q(renEl, 'b'), o = { n: 0 };
          R.at(t + 3.4, function(){ renEl.classList.add('ed'); });
          tl.fromTo(o, { n: 0 }, { n: s.ren[1].length, duration: 1, ease: 'none', immediateRender: false, onUpdate: function(){ rb.textContent = s.ren[1].slice(0, Math.round(o.n)) || '|'; } }, t + 3.5);
          R.at(t + 4.6, function(){ renEl.classList.remove('ed'); rb.textContent = s.ren[1]; renN.textContent = '1'; });
        }
        move(R, cur, pos(st, btn[1], .5, .6), t + 5, .7); click(R, btn[1], t + 5.7);
        t += 5.9;
        tl.addLabel('connect', t);
        R.at(t, function(){ show(2); });
        tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
        tl.fromTo(stats, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .1, immediateRender: false }, t + .1);
        tl.fromTo(pcs, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, stagger: .04, immediateRender: false }, t + .4);
        tl.fromTo(tms, { autoAlpha: 0, scale: .8 }, { autoAlpha: 1, scale: 1, duration: .3, stagger: .06, ease: 'back.out(2)', immediateRender: false }, t + .8);
        TH.forEach(function(p, i){ hide(R, p); draw(R, p, t + 1.2 + i * .06, .5); });
        tl.fromTo(gaps, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .2, immediateRender: false }, t + 1.6 + TH.length * .06);
        end(sc, R, t + 8, t + 5.5);
        // interactive: step buttons jump, a sample reloads the sketch for that site
        // (each lands on the moment that step is complete)
        goB.forEach(function(b, i){ tap(b, function(){ if (sc.hold) sc.hold(); tl.seek(tl.labels[['site', 'vocab', 'connect'][i]] + [2.8, 4.8, 4][i]); if (sc.onSeek) sc.onSeek(); }); });
        show(0);
        qa(st, '.cx-skpick button').forEach(function(b){ tap(b, function(){
          var k = b.getAttribute('data-k'); sc.skKey = k;
          if (sc.tl) sc.tl.kill(); qa(sc.view, '.scn-ctl').forEach(function(n){ n.remove(); });
          render(k); sc.paused = false; sc.started = true; sc.tl.restart();
        }); });
      }
    });

    /* ---------------- 5 · PUBLISH ONCE: one entry, the site does the rest ---------------- */
    var PT = [['Client onboarding', SAF], ['Service design', COR], ['Journey mapping', TEA], ['Client handoffs', COB], ['Plain-language UX', INK], ['Professional firms', OCH]];
    var PUB = { title: 'Onboarding is a design problem', theme: 'How we work', tags: [0, 1, 2], slug: 'onboarding-is-a-design-problem' };
    SCENE.add('cks-publish', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var json = [
        ['{', ''], ['  "@context": "https://schema.org",', ''], ['  "@graph": [{', ''], ['    "@type": "Article",', ''],
        ['    "headline": "' + PUB.title + '",', 'hot'], ['    "articleSection": "' + PUB.theme + '",', ''],
        ['    "about": [' + PUB.tags.map(function(i){ return '"' + PT[i][0] + '"'; }).join(', ') + '],', 'hot'],
        ['    "url": "https://yoursite.com/insights/' + PUB.slug + '"', ''], ['  },', '']
      ].concat(PUB.tags.map(function(i, k){ return ['  { "@type": "DefinedTerm", "name": "' + PT[i][0] + '" }' + (k < PUB.tags.length - 1 ? ',' : ''), 'hot']; })).concat([[']}', '']]);
      st.innerHTML = '<div class="cx-bg is-paper"></div>' + bar('getcks.io/#update') +
        '<div class="cx-ed"><div class="cx-edh"><span>Collections / <b>Insights</b> / New item</span><em class="cx-pill">Draft</em></div>' +
          '<label class="cx-f"><span>Title <i>Required</i></span><div class="cx-in cx-ti"><b></b><u></u></div></label>' +
          '<label class="cx-f cx-thm"><span>Theme</span><div class="cx-in cx-sel"><b>' + PUB.theme + '</b><i>▾</i></div></label>' +
          '<div class="cx-f"><span>Topics <i>Pick one or more</i></span><div class="cx-tps">' + PT.map(function(t, i){ return '<button type="button" class="cx-tp" data-i="' + i + '" aria-pressed="false" style="--c:' + t[1] + '">' + esc(t[0]) + '</button>'; }).join('') + '</div></div>' +
          '<div class="cx-f cx-vid"><span>Video URL <i>Optional</i></span><div class="cx-in"><b class="cx-ph">https://youtube.com/…</b></div></div>' +
          '<div class="cx-pubr"><button type="button" class="cx-pub">Publish</button><span class="cx-stl">Nothing is live until you publish.</span></div></div>' +
        '<div class="cx-pv cx-lib"><div class="cx-url">yoursite.com/insights</div><div class="cx-pvh"><b>The library</b><span><i>7</i> places</span></div><div class="cx-lcs">' +
          '<div class="cx-lc is-new"><em>How we work</em><b>' + PUB.title + '</b><span>Just now</span></div>' +
          [['How we work', 'What a journey map is really for', TEA], ['What you watch for', 'Why handoffs fail on Friday afternoons', COB], ['Ideas', 'The first 30 days decide the next three years', COR]].map(function(c){ return '<div class="cx-lc" style="--c:' + c[2] + '"><em>' + c[0] + '</em><b>' + c[1] + '</b><span>Read →</span></div>'; }).join('') +
        '</div></div>' +
        '<div class="cx-pv cx-top"><div class="cx-url">yoursite.com/topics/client-onboarding</div><b class="cx-pvt">Client onboarding</b><p>The first month with a new client is a product.</p><em>Reading list</em><div class="cx-rl"><div class="is-new">' + PUB.title + '<span>New</span></div><div>The first 30 days decide the next three years</div></div></div>' +
        '<div class="cx-pv cx-prj"><div class="cx-url">yoursite.com/work/riverside-clinic</div><b class="cx-pvt">Riverside Clinic intake</b><em>This project demonstrates</em><div class="cx-dem"><span style="--c:' + TEA + '">Journey mapping</span><span class="is-new" style="--c:' + SAF + '">Client onboarding</span><span class="is-new" style="--c:' + COR + '">Service design</span></div><em>Related reading</em><div class="cx-rl"><div class="is-new">' + PUB.title + '</div></div></div>' +
        '<div class="cx-code"><div class="cx-codeh"><span>JSON-LD · generated from the same fields</span><i></i></div><pre>' + json.map(function(l){ return '<span class="' + l[1] + '">' + esc(l[0]) + '</span>'; }).join('\n') + '</pre></div>' +
        '<div class="fg-toast"><i></i><span></span></div>' + cursor('a', 'You') + '<div class="fg-fade"></div>';
      var ti = q(st, '.cx-ti b'), tiCur = q(st, '.cx-ti u'), tps = qa(st, '.cx-tp'), pub = q(st, '.cx-pub'), pill = q(st, '.cx-pill'), stl = q(st, '.cx-stl'), sel = q(st, '.cx-sel');
      var libN = q(st, '.cx-lib .cx-pvh i'), newEls = qa(st, '.is-new'), lines = qa(st, '.cx-code pre span'), toast = q(st, '.fg-toast'), cur = q(st, '.cur.a'), pvs = qa(st, '.cx-pv, .cx-code');
      function setPub(on){ pill.textContent = on ? 'Published' : 'Draft'; pill.classList.toggle('live', on); stl.textContent = on ? 'Published · the library, a topic page and a project updated.' : 'Nothing is live until you publish.'; libN.textContent = on ? 8 : 7; }
      var R = run(sc, function(){ setPub(false); tps.forEach(function(b){ b.setAttribute('aria-pressed', 'false'); }); tiCur.style.display = ''; sel.classList.remove('on'); toast.classList.remove('ok'); q(toast, 'span').textContent = ''; }), tl = R.tl;
      tl.addLabel('write', 0);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 300 : 200, y: sc.SH + 30 }, 0).set(newEls, { autoAlpha: 0 }, 0).set(lines, { autoAlpha: 0 }, 0).set(toast, { autoAlpha: 0, xPercent: -50 }, 0);
      tl.fromTo(pvs, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .2);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .6);
      move(R, cur, pos(st, q(st, '.cx-ti'), .2, .6), .6, .7); click(R, q(st, '.cx-ti'), 1.3);
      var t = type(R, ti, PUB.title, 1.4, 1.5);
      move(R, cur, pos(st, sel, .5, .6), t + .2, .6); click(R, sel, t + .8); R.at(t + .85, function(){ sel.classList.add('on'); });
      t += 1.3;
      tl.addLabel('tag', t);
      PUB.tags.forEach(function(k, i){ var b = tps[k]; move(R, cur, pos(st, b, .5, .6), t + i * .85, .55); click(R, b, t + .55 + i * .85); R.at(t + .6 + i * .85, function(){ b.setAttribute('aria-pressed', 'true'); }); });
      t += PUB.tags.length * .85 + .3;
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .6), t, .6); click(R, pub, t + .6);
      R.at(t + .65, function(){ setPub(true); tiCur.style.display = 'none'; toast.classList.add('ok'); q(toast, 'span').textContent = 'Published · 4 places updated'; });
      tl.fromTo(toast, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + .7).to(toast, { autoAlpha: 0, duration: .3 }, t + 3.2);
      tl.fromTo(newEls, { autoAlpha: 0, y: -8, scale: .95 }, { autoAlpha: 1, y: 0, scale: 1, duration: .45, stagger: .22, ease: 'back.out(1.8)', immediateRender: false }, t + .9);
      tl.fromTo(lines, { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: .15, stagger: .09, immediateRender: false }, t + 1.2);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1.1);
      end(sc, R, t + 7, t + 4, [{ t: 'Write', at: 'write' }, { t: 'Tag', at: 'tag' }, { t: 'Publish', at: 'publish' }]);
      // interactive: topics toggle, Publish replays the publish (from wherever you are)
      tps.forEach(function(b){ tap(b, function(){ if (sc.hold) sc.hold(); b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
      tap(pub, function(){ tl.seek(tl.labels.publish + .5); if (sc.onSeek) sc.onSeek(); if (sc.resume) sc.resume(); });
    });

    /* ---------------- 6 · SITE PLAN: a FigJam board on CKS paper, four threads woven through every decision ---------------- */
    // lanes of stickies (Plan / Design / Build); each thread is an idea that runs through one sticky per lane
    var PL = [
      ['Plan', 'ideation: what the site has to do', '#FFE68A', [['One link that sells the install', 'Proposals get a single URL that explains, demos and prices it.'], ['A six-category vocabulary', 'Reused by the story, the map and the sketch tool.'], ['Show it, don’t claim it', 'Every promise becomes a demo you can touch.'], ['No fake numbers', 'No logos, reviews or rankings. One real stat or none.']]],
      ['Design', 'wireframes, then the look', '#FFC9BB', [['The loom = connecting what you know', 'A woven hero instead of another gradient blob.'], ['Four thread colors, four ideas', 'Saffron, coral, teal, cobalt: the mark, the loom and the map share them.'], ['Five personalities, one set', 'The same components wear a law firm, a bakery, a studio…'], ['Every demo says it’s a demo', 'Simulations are labeled in the interface, not a footnote.']]],
      ['Build', 'coded by hand from the wireframes', '#BFEBDF', [['Plain HTML, CSS, JS', 'No framework. GitHub Actions ships it to Hostinger.'], ['Each demo loads on its own page', 'Small scripts, nothing shared that isn’t needed.'], ['⌘K search that never drifts', 'The index reads every page’s sections.'], ['The demo form says so', 'It sends nothing, and tells you before you type.']]]
    ];
    // [name, color, sticky column per lane]
    var TH = [['One link', COB, [0, 0, 0]], ['Vocabulary', SAF, [1, 1, 2]], ['Show, don’t claim', COR, [2, 2, 1]], ['Honesty', TEA, [3, 3, 3]]];
    SCENE.add('cks-plan', function(sc){
      fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var L = P ? { x: 16, w: 608, top: 96, h: 222, gap: 12, sw: 138, sh: 150, sx: 10, sy: 48, step: 148 } : { x: 36, w: 1128, top: 62, h: 198, gap: 18, sw: 214, sh: 132, sx: 64, sy: 52, step: 272 };
      function laneY(i){ return L.top + i * (L.h + L.gap); }
      function stick(li, ci){ return { x: L.x + L.sx + ci * L.step, y: laneY(li) + L.sy }; }
      // threads run down each note's left edge, so a stitch over the note never crosses its text
      function center(li, ci){ var p = stick(li, ci); return { x: p.x + 11, y: p.y + L.sh / 2 }; }
      var html = '<div class="cx-bg is-paper"></div><div class="cx-fj-file"><b>#</b> CKS — Site plan <em>FigJam</em></div>' +
        '<div class="cx-fj-tools"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<svg class="cx-fj-thr" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>';
      PL.forEach(function(ln, li){
        html += '<div class="cx-fj-lane" style="left:' + L.x + 'px;top:' + laneY(li) + 'px;width:' + L.w + 'px;height:' + L.h + 'px;--c:' + ln[2] + '"><span><b>0' + (li + 1) + ' · ' + ln[0] + '</b> ' + esc(ln[1]) + '</span></div>';
        ln[3].forEach(function(n, ci){
          var p = stick(li, ci), th = TH.filter(function(t){ return t[2][li] === ci; }).map(function(t){ return TH.indexOf(t); });
          html += '<div class="cx-fj-st" data-l="' + li + '" data-th="' + th.join(' ') + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + L.sw + 'px;height:' + L.sh + 'px;--c:' + ln[2] + ';--r:' + ((li * 4 + ci) % 3 - 1) * 1.4 + 'deg"><b data-t="' + esc(n[0]) + '"></b><p>' + esc(n[1]) + '</p><em>Angelino</em></div>';
        });
      });
      html += '<svg class="cx-fj-over" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="cx-fj-leg">' + TH.map(function(t, i){ return '<button type="button" data-th="' + i + '" style="--c:' + t[1] + '"><i></i>' + esc(t[0]) + '</button>'; }).join('') + '</div>' +
        '<div class="cx-fj-cap">Four threads run through every decision.</div>' + cursor('a', 'Angelino') + '<div class="fg-fade"></div>';
      st.innerHTML = html;
      var svg = q(st, '.cx-fj-thr'), over = q(st, '.cx-fj-over'), lanes = qa(st, '.cx-fj-lane'), sts = qa(st, '.cx-fj-st'), leg = qa(st, '.cx-fj-leg button'), cap = q(st, '.cx-fj-cap'), cur = q(st, '.cur.a');
      // each thread: in from the top, through its three stickies (swaying as it goes), out at the bottom
      var paths = [], stitches = [];
      TH.forEach(function(t, ti){
        var pts = [{ x: center(0, t[2][0]).x + (ti % 2 ? 26 : -26), y: L.top - 14 }].concat(t[2].map(function(c, li){ return center(li, c); }));
        var last = pts[pts.length - 1]; pts.push({ x: last.x + (ti % 2 ? -26 : 26), y: laneY(2) + L.h + 12 });
        var d = 'M' + pts[0].x + ' ' + pts[0].y;
        for (var k = 1; k < pts.length; k++){ var a = pts[k - 1], b = pts[k], my = (a.y + b.y) / 2, sw = (k % 2 ? 1 : -1) * (ti % 2 ? 22 : -22); d += 'C' + (a.x + sw) + ' ' + my + ' ' + (b.x - sw) + ' ' + my + ' ' + b.x + ' ' + b.y; }
        var p = pth(svg, d, 'cx-fj-t'); p.style.stroke = t[1]; p.setAttribute('data-th', ti); paths.push(p);
        // over / under: on alternate stickies the thread is stitched across the face of the note
        t[2].forEach(function(c, li){ if ((li + ti) % 2) return; var m = center(li, c), s = pth(over, 'M' + m.x + ' ' + (m.y - L.sh / 2 - 8) + 'L' + m.x + ' ' + (m.y + L.sh / 2 + 8), 'cx-fj-t is-over'); s.style.stroke = t[1]; s.setAttribute('data-th', ti); stitches.push(s); });
      });
      function light(k){
        st.classList.toggle('fj-hl', k != null);
        qa(st, '[data-th]').forEach(function(e){ var ks = (e.getAttribute('data-th') || '').split(' '); e.classList.toggle('hl', k != null && ks.indexOf(String(k)) > -1); });
      }
      leg.forEach(function(b){
        b.addEventListener('pointerenter', function(){ light(+b.getAttribute('data-th')); });
        b.addEventListener('pointerleave', function(){ if (!sc.paused) light(null); });
        tap(b, function(){ if (sc.hold) sc.hold(); light(+b.getAttribute('data-th')); });
      });
      sts.forEach(function(s){
        s.addEventListener('pointerenter', function(){ var k = s.getAttribute('data-th'); if (k) light(+k.split(' ')[0]); });
        s.addEventListener('pointerleave', function(){ light(null); });
        tap(s, function(){ if (sc.hold) sc.hold(); var on = !s.classList.contains('big'); sts.forEach(function(o){ o.classList.remove('big'); }); s.classList.toggle('big', on); });
      });
      var R = run(sc, function(){ light(null); sts.forEach(function(s){ s.classList.remove('big'); }); paths.concat(stitches).forEach(function(p){ p.classList.remove('woven'); }); }), tl = R.tl;
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .5, y: sc.SH + 30 }, 0).set(sts.concat(leg, [cap], lanes), { autoAlpha: 0 }, 0);
      paths.concat(stitches).forEach(function(p){ hide(R, p); });
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .3);
      var t = .3, names = ['plan', 'design', 'build'];
      PL.forEach(function(ln, li){
        tl.addLabel(names[li], t);
        tl.fromTo(lanes[li], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
        t += .3;
        sts.filter(function(s){ return +s.getAttribute('data-l') === li; }).forEach(function(s, ci){
          var p = stick(li, ci);
          move(R, cur, { x: p.x + L.sw * .5, y: p.y + L.sh * .45 }, t, .45);
          tl.fromTo(s, { autoAlpha: 0, scale: .7, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .35, ease: 'back.out(2)', immediateRender: false }, t + .4);
          var b = q(s, 'b'); type(R, b, b.getAttribute('data-t'), t + .55, .55);
          t += P ? .75 : .85;
        });
        t += .25;
      });
      tl.addLabel('weave', t);
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t);
      paths.forEach(function(p, i){
        draw(R, p, t + i * .7, 1.1);
        stitches.filter(function(s){ return s.getAttribute('data-th') === String(i); }).forEach(function(s){ draw(R, s, t + i * .7 + .8, .3); });
        tl.fromTo(leg[i], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, t + i * .7 + .3);
      });
      t += paths.length * .7 + 1.2;
      R.at(t, function(){ paths.concat(stitches).forEach(function(p){ p.classList.add('woven'); }); });
      tl.fromTo(cap, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, immediateRender: false }, t);
      [0, 1, 2, 3].forEach(function(k, i){ R.at(t + .8 + i * 1.1, function(){ light(k); }); });
      R.at(t + 5.2, function(){ light(null); });
      end(sc, R, t + 6.4, t + .6, [{ t: 'Plan', at: 'plan' }, { t: 'Design', at: 'design' }, { t: 'Build', at: 'build' }, { t: 'Weave', at: 'weave' }]);
    });
  })();

  /* ===== mission/30-mission.js ===== */
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
  // "Test flight" (a proof of concept) is a status, not a discipline: badge its chip, keep it out of the discipline counts
  var TEST = AB.testFlight ? AB.testFlight($$('[data-meta-types] .ab_meta_chip')) : false;
  TYPES = TYPES.filter(function(t){ return !/^test flight$/i.test(t); });
  // an identity mission: logo/branding work with no website or app of its own (kip is branded, but it's a site + app)
  var isLogo = (TYPES.indexOf('Logo') > -1 || TYPES.indexOf('Branding') > -1) && TYPES.indexOf('Website') < 0 && TYPES.indexOf('App') < 0;
  // a system mission (content system with no website of its own, e.g. the Knowledge System add-on)
  var isSystem = !isLogo && TYPES.indexOf('Content system') > -1 && TYPES.indexOf('Website') < 0;

  /* ---------- channels (Mission Channels list) ---------- */
  var CH = $$('[data-channels-source] .w-dyn-item').map(function(item, i){
    var it = $('[data-channel]', item) || item;
    var imgs = $$('img', it).filter(function(im){ return !im.classList.contains('w-dyn-bind-empty'); }).map(function(im){ return im.getAttribute('src') || ''; }).filter(function(s){ return s && !/placeholder/i.test(s); });
    var cid = it.getAttribute('data-id') || ('ch' + i);
    // coded scenes are picked by channel id (the CMS Kind option can't gain values via the API); cks-* ids are their own kind
    return { id: cid, kind: (/^cks-/.test(cid) ? cid : ({ sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable' })[cid]) || (it.getAttribute('data-kind') || 'img').toLowerCase(), mode: (it.getAttribute('data-mode') || '').toLowerCase(),
      label: it.getAttribute('data-label') || ('Channel ' + (i + 1)), caption: it.getAttribute('data-caption') || '', src: imgs[0] || '', before: imgs[0] || '', after: imgs[1] || imgs[0] || '' };
  });
  // image channels whose loops live in the repo (MOCKS[slug].img: id → [loop, still], on jsDelivr, so Webflow can't flatten
  // an animated WebP); reduced motion or Save-Data shows the still. A CMS image, when set, still wins.
  (function(){
    var MI = MOCKS[SLUG] && MOCKS[SLUG].img; if (!MI) return;
    var still = reduce || !!(navigator.connection && navigator.connection.saveData);
    CH.forEach(function(c){ var L = MI[c.id]; if (!L || c.src) return; c.src = still ? (L[1] || L[0]) : L[0]; c.before = c.src; c.after = L[1] || L[0]; c.loop = !still; });
  })();
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
  // a mission whose monitor runs its site's own demos (MOCKS[slug].live) says so
  if (M.mock && M.mock.live){ var ml3 = $('[data-mission-lede="monitor"]'); if (ml3) ml3.textContent = 'Switch channels to try the site’s own demos: match any style, weave the story, grow the map, sketch a vocabulary, publish once.'; }
  document.title = txt('#heroTitle') + ' · Mission debrief · Angelino Barajas';

  /* ---------- live check: a mission whose site isn't up yet (mock.live) asks it for a small file first ---------- */
  // An <img> load can't be blocked by CORS: the favicon loading means the real site is up (a parked domain 404s it).
  // The answer is cached for the session. 40-monitor waits on the same promise before showing the live channels.
  M.liveCheck = (function(){
    var L = M.mock && M.mock.live; if (!L) return null;
    var key = 'ab:live:' + L.base;
    try { var c = sessionStorage.getItem(key); if (c) return Promise.resolve(c === '1'); } catch(e){}
    return new Promise(function(res){
      var im = new Image(), done = false;
      function fin(ok){ if (done) return; done = true; try { sessionStorage.setItem(key, ok ? '1' : '0'); } catch(e){} res(ok); }
      im.onload = function(){ fin(true); }; im.onerror = function(){ fin(false); };
      setTimeout(function(){ fin(false); }, 6000);
      im.src = L.base + L.probe + '?probe=' + Date.now();
    });
  })();

  /* ---------- live links: hide them when the mission has no live URL (or its site isn't up yet) ---------- */
  (function(){
    var any = false;
    function unlink(a){
      // (the built hero marks its arrow as a bare aria-hidden span, the prototype as .ab_meta_live-arrow)
      if (a.classList.contains('ab_meta_live')){ var s = document.createElement('span'); s.className = a.className; s.innerHTML = a.innerHTML; a.parentNode.replaceChild(s, a); var ar = $('.ab_meta_live-arrow', s) || $('span[aria-hidden]', s); if (ar) ar.remove(); return s; }
      a.remove(); return null;
    }
    $$('[data-mission-live]').forEach(function(a){
      var h = a.getAttribute('href') || '';
      if (h && h !== '#' && !/^\/?$/.test(h)){
        any = true; M.live = h; a.target = '_blank'; a.rel = 'noopener';
        // pre-launch: keep the link out of sight until the site answers; if it doesn't, it reads "launching soon"
        if (M.liveCheck){ a.style.visibility = 'hidden'; M.liveCheck.then(function(ok){ if (ok){ a.style.visibility = ''; return; } var s = unlink(a); if (s){ s.style.visibility = ''; var lt = $('.ab_meta_live-text', s) || $('[data-field="status"]', s); if (lt) lt.textContent = 'Launching soon'; } }); }
        return;
      }
      unlink(a);
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

  /* ---------- briefing: benefits for the people using it (one per line, no numbers; optional field) ---------- */
  (function(){
    var src = $('[data-field="benefits"]'), ul = $('#params');
    var B = src ? src.textContent.split(/\n+/).map(function(s){ return s.trim(); }).filter(Boolean) : [];
    if (!B.length || !ul) return;
    // reuses the parameters' own Designer classes (eyebrow + list), so it needs no stylesheet release
    ul.insertAdjacentHTML('afterend', '<div class="ab_benefits" style="margin-top:32px"><div class="text-style-eyebrow ab_brief_params-h">Benefits for the people using it</div><ul class="ab_params ab_benefits_l" role="list">' +
      B.map(function(b, i){ var k = b.indexOf(':'); return '<li><span>B-' + pad2(i + 1) + '</span><span class="ab_param_t">' + (k > 0 ? '<b style="color:var(--star);font-weight:600">' + esc(b.slice(0, k)) + '</b>' + esc(b.slice(k)) : esc(b)) + '</span></li>'; }).join('') + '</ul></div>');
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
    var word = suf && /^[a-z]/i.test(suf);
    n.setAttribute('data-suffix', word ? '' : (suf || ''));
    if (v === '' || isNaN(+v)){ n.removeAttribute('data-count'); n.textContent = suf || '∞'; n.classList.remove('w-dyn-bind-empty'); t.classList.add('is-symbol'); }
    else if (word){
      // a word unit (hrs, min) sits small beside the number so big values fit their column; this bundle counts it up
      // itself (core's counter skips an element once data-count is gone)
      var unit = '<small class="ab_tel_u">' + esc(suf) + '</small>', target = +v;
      n.removeAttribute('data-count'); n.innerHTML = target + unit;
      if (!reduce && hasGsap && window.ScrollTrigger){
        var o = { v: 0 }; n.innerHTML = '0' + unit;
        ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: function(){ gsap.to(o, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: function(){ n.innerHTML = Math.round(o.v) + unit; } }); } });
      }
    }
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
    // website missions: every tile draws a tiny version of its page (a hero, a grid, three price tiers, dated rows…),
    // in one of three looks per mission: build (wireframe fills in with the brand's colors), woven (CKS paper, a thread
    // stitched tile to tile) or blueprint (the fallback)
    var TSTYLE = {
      '510-visuals': ['build', '#1c1e24', '#d0e0e3', '#5eead4', 'linear-gradient(135deg,#5a8a94,#1c2227)', '#4a5a60'],
      'daniel-aguirre-law': ['build', '#FCF6EC', '#1a2840', '#891E2D', 'linear-gradient(135deg,#A88B5C,#efe2c8)', '#c9bda8'],
      'cks': ['woven', '#F7F5F0', '#0B1B2B', '#EF5B3F', 'linear-gradient(135deg,#2F5BEA,#139E8A)', '#C9CED4'],
      'kip': ['build', '#FFF4E6', '#1E1B2E', '#FF7A45', 'linear-gradient(135deg,#FFC94A,#5FD3A8)', '#E6D3BD']
    };
    var TS = TSTYLE[SLUG] || ['blueprint'], THREADS = ['#F2A93B', '#EF5B3F', '#139E8A', '#2F5BEA'];
    function g(c, l, t, w, h){ return '<i class="' + c + '" style="left:' + l + '%;top:' + t + '%;width:' + w + '%;height:' + h + '%"></i>'; }
    function glyph(p){
      var s = g('m', 5, 8, 90, 7);
      if (/home|landing/i.test(p)) return s + g('f', 6, 26, 42, 9) + g('f', 6, 40, 32, 9) + g('m', 6, 56, 26, 6) + g('a', 6, 70, 18, 11) + g('img', 55, 24, 39, 62);
      if (/about|team|crew|pilot/i.test(p)) return s + g('img r', 7, 26, 22, 56) + g('f', 36, 30, 54, 8) + g('m', 36, 46, 46, 6) + g('m', 36, 58, 40, 6) + g('a', 36, 72, 16, 9);
      if (/pric|plan|package/i.test(p)) return s + [6, 37, 68].map(function(l, i){ return g(i === 1 ? 'a' : 'o', l, 22, 26, 68) + g('f', l + 4, 34, 18, 7) + g('m', l + 4, 50, 14, 5) + g('m', l + 4, 60, 16, 5); }).join('');
      if (/contact|book|call|form/i.test(p)) return s + g('o', 22, 24, 56, 11) + g('o', 22, 40, 56, 11) + g('o', 22, 56, 56, 11) + g('a', 22, 74, 22, 12);
      if (/blog|insight|news|what.s new|changelog|observ|article/i.test(p)) return s + [24, 45, 66].map(function(t){ return g('a', 6, t, 10, 8) + g('f', 20, t, 64, 8) + g('m', 20, t + 10, 40, 5); }).join('');
      // (before the grid rule, so 'How it works' isn't read as work)
      if (/how|process|service|install|guide|expertise|practice|hub/i.test(p)) return s + [8, 40, 72].map(function(l, i){ return g('r ' + (i ? 'f' : 'a'), l, 26, 13, 28) + g('m', l - 2, 64, 22, 6) + g('m', l - 2, 76, 16, 5); }).join('');
      if (/project|work|portfolio|result|case|inspiration|gallery/i.test(p)) return s + [6, 37, 68].map(function(l, i){ return g(i % 2 ? 'a' : 'img', l, 22, 26, 30) + g('img', l, 58, 26, 30); }).join('');
      if (/template|detail/i.test(p)) return s + g('img', 6, 20, 88, 36) + g('f', 6, 62, 64, 8) + g('m', 6, 76, 50, 6);
      if (/style|token|brand|color/i.test(p)) return s + [0, 1, 2, 3, 4].map(function(i){ return g(['a', 'f', 'img', 'm', 'o'][i], 6 + i * 18, 28, 14, 56); }).join('');
      if (/voice|audio|podcast/i.test(p)) return s + [30, 60, 85, 45, 95, 70, 40, 80, 55, 35, 65, 50].map(function(h, i){ return g(i % 3 ? 'f' : 'a', 8 + i * 7.3, 60 - h * .4, 4, h * .6); }).join('');
      if (/sketch|idea|board/i.test(p)) return s + g('a', 8, 26, 24, 38) + g('img', 38, 30, 24, 38) + g('f', 68, 24, 24, 38) + g('m', 8, 78, 80, 5);
      if (/review|testimonial|quote/i.test(p)) return s + g('a', 8, 24, 10, 22) + g('f', 22, 28, 64, 8) + g('f', 22, 42, 56, 8) + g('m', 22, 60, 30, 6);
      if (/space|bny|studio|map/i.test(p)) return s + g('img', 6, 20, 88, 70) + g('a', 10, 70, 20, 10);
      return s + g('f', 6, 28, 70, 9) + g('f', 6, 44, 56, 9) + g('m', 6, 60, 40, 6) + g('a', 70, 72, 22, 12);
    }
    if (site && !isLogo && !isSystem){
      site.setAttribute('data-style', TS[0]);
      if (TS[1]) ['--tb', '--tf', '--ta', '--ti', '--tm'].forEach(function(k, i){ site.style.setProperty(k, TS[i + 1]); });
    }
    if (site){
      site.innerHTML = pages.map(function(p, i){ var ax = isLogo || isSystem ? art(p) : ''; return '<div class="vs-t' + (ax ? ' is-art' : '') + '" style="--d:' + (i * .12) + 's;--th:' + THREADS[i % 4] + '" data-p="' + esc(p) + '">' + (ax ? '<div class="vs-w is-art">' + ax + '</div>' : '<div class="vs-w g">' + glyph(p) + '</div>') + '<span>' + esc(p) + '</span><em>✓</em></div>'; }).join('') +
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
    var stc = $('.ab_mf_status', sec); if (stc) orbitCard(stc, (txt('#hero [data-field="status"]') || '').toLowerCase());
    // the status card's orbit: the mission's own planet, a probe on a tilted orbit that passes behind it.
    // in orbit = circling · live = circling and transmitting · shipped = flag planted on the surface, the probe drifts slowly
    function orbitCard(card, status){
      var cols = (HERO_PLANET.getAttribute('data-colors') || '#2a2263,#5b4bd6,#a597ff').split(',').map(function(c){ return c.trim(); });
      var mode = /live/.test(status) ? 'live' : /ship|done|landed/.test(status) ? 'shipped' : 'orbit';
      var id = 'mfp' + Math.round(Math.random() * 1e6), stars = '';
      for (var k = 0; k < 16; k++) stars += '<circle class="mfo-st" cx="' + (10 + (k * 53) % 240) + '" cy="' + (8 + (k * 37) % 180) + '" r="' + (k % 3 ? .7 : 1.1) + '"/>';
      var O = 'transform="translate(168 112) rotate(-9)"';
      card.insertAdjacentHTML('afterbegin', '<svg class="mf-orbit is-' + mode + '" viewBox="0 0 260 200" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="' + cols[cols.length - 2 >= 0 ? cols.length - 2 : 0] + '"/><stop offset=".55" stop-color="' + cols[1 % cols.length] + '"/><stop offset="1" stop-color="' + cols[0] + '"/></radialGradient></defs>' + stars +
        '<g ' + O + '><path class="mfo-orb" d="M-86 0A86 22 0 0 1 86 0"/><g class="mfo-back"></g></g>' +
        '<circle class="mfo-pl" cx="168" cy="112" r="30" fill="url(#' + id + ')"/><path class="mfo-plsh" d="M168 82a30 30 0 0 1 0 60a38 38 0 0 0 0-60z"/>' +
        (mode === 'shipped' ? '<g class="mfo-flag"><path d="M160 84V64"/><path class="mfo-fl" d="M160 64h14l-4 5 4 5h-14z"/></g>' : '') +
        '<g ' + O + '><path class="mfo-orb mfo-fr" d="M86 0A86 22 0 0 1 -86 0"/><g class="mfo-front"><g class="mfo-sat"><rect x="-3" y="-3" width="6" height="6" rx="1"/><path class="mfo-pn" d="M-12 -2h7v4h-7zM5 -2h7v4h-7z"/>' +
          (mode === 'live' ? '<circle class="mfo-sig" r="6"/><circle class="mfo-sig mfo-s2" r="6"/><circle class="mfo-sig mfo-s3" r="6"/>' : '') + '</g></g></g></svg>');
      var svg = $('.mf-orbit', card), sat = $('.mfo-sat', svg), back = $('.mfo-back', svg), front = $('.mfo-front', svg), a = mode === 'shipped' ? 1.1 : .4, on = false;
      function place(){ var x = Math.cos(a) * 86, y = Math.sin(a) * 22; sat.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); var host = y < 0 ? back : front; if (sat.parentNode !== host) host.appendChild(sat); }
      place();
      if (reduce || !hasGsap) return;
      new IntersectionObserver(function(es){ on = es[0].isIntersecting; }).observe(card);
      gsap.ticker.add(function(t, dt){ if (!on) return; a += dt / 1000 * (mode === 'live' ? .9 : mode === 'shipped' ? .2 : .6); place(); });
    }
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

  /* ===== mission/40-monitor.js ===== */
  /* =========================================================
     MISSION CONTROL monitor · views built from the Mission Channels list
     ========================================================= */
  (function(){
    var screen = $('#screen'), chans = $('#chans'); if (!screen || !CH.length) { var sec = $('#monitor'); if (sec && !CH.length) sec.remove(); return; }
    // the AB planet monogram (AB.markSVG in core): build/grid show the construction grid, grid adds its measurements
    function markSVG(mode){ return AB.markSVG({ grid: mode !== 'light' && mode !== 'plain', dims: mode === 'grid' }); }
    function smallMark(color){ var M = AB.MARK; return '<svg viewBox="0 0 490.16 241.75" aria-hidden="true"><g fill="' + color + '"><path d="' + M.a + '"/><path d="' + M.planet + '"/><path d="' + M.b + '"/></g></svg>'; }
    function channelView(c){
      // (a mobile still/loop centers its phone inline too, so it doesn't wait on a stylesheet release)
      var v = '<div class="view ' + c.kind + (c.mode === 'light' ? ' light' : '') + '" data-ch="' + esc(c.id) + '" data-kind="' + c.kind + '" role="tabpanel" aria-label="' + esc(c.label) + '"' + (c.kind === 'mobile' ? ' style="display:grid;place-items:center"' : '') + '>';
      if (c.kind === 'img') v += c.src ? '<img class="full" src="' + esc(c.src) + '" alt="' + esc(c.caption) + '" loading="lazy">' : '';
      else if (c.kind === 'mobile') v += '<div class="phone-f"><div><img src="' + esc(c.src) + '" alt="' + esc(c.caption) + '" loading="lazy"></div></div>';
      else if (c.kind === 'wipe') v += '<div class="wipe"><img src="' + esc(c.before) + '" alt="Design file"><img class="aft" src="' + esc(c.after) + '" alt="Built site"><span class="hdl"><i>⇆</i></span><span class="lab l">Design</span><span class="lab r">Build</span></div>';
      else if (c.kind === 'live-globe') v += '<div class="boot">Booting globe…</div>';
      else if (c.kind === 'live-map') v += '<div class="boot">Booting map engine…</div>';
      else if (c.kind === 'logo') v += markSVG(c.mode);
      else if (c.kind === 'apps') v += '<div class="app"><div class="tab">' + smallMark('#F2F0EA') + '<span>Angelino Barajas</span></div>Favicon · 16px</div>' +
        '<div class="app"><div class="av">' + smallMark('#F2F0EA') + '</div>Avatar</div>' +
        '<div class="app"><div class="card" tabindex="0"><div><div class="f">' + smallMark('#F2F0EA') + '</div><div class="b"><b>Angelino Barajas</b>Webflow designer + developer</div></div></div>Card · hover to flip</div>' +
        '<div class="app"><div class="stk">' + smallMark('#0B0C14') + '</div>Sticker</div>';
      return v + '</div>';
    }
    var TYPE = { 'live-globe': 'Live', 'live-map': 'Live', 'wipe': 'Compare', 'mobile': 'Phone', 'img': 'Still', 'logo': 'Vector', 'apps': 'Mockups', 'figma': 'Build', 'phone': 'Phone', 'flow': 'Plan', 'exploded': 'Layers', 'cms': 'CMS', 'sketch': 'Sketch', 'vector': 'Vector', 'graph': 'Graph', 'library': 'Library', 'voice': 'AI + you', 'setup': 'CMS', 'video': 'Video', 'schema': 'Schema', 'portable': 'Model',
      'cks-styles': 'Try it', 'cks-story': 'Scroll', 'cks-map': 'Explore', 'cks-sketch': 'Try it', 'cks-publish': 'Demo', 'cks-plan': 'Plan' };
    var KIND = { 'live-globe': 'LIVE · three.js r128', 'live-map': 'LIVE · d3 v7', 'wipe': 'COMPARE · figma ↔ webflow', 'figma': 'MOCKUP · figma → webflow', 'phone': 'MOCKUP · mobile', 'flow': 'MOCKUP · figjam → build', 'exploded': 'BREAKDOWN · layers', 'cms': 'MOCKUP · cms → site', 'mobile': 'STILL · mobile', 'img': 'STILL', 'logo': 'VECTOR · svg', 'apps': 'MOCKUPS', 'sketch': 'SKETCH · pen + paper', 'vector': 'MOCKUP · illustrator', 'graph': 'MOCKUP · knowledge graph', 'library': 'MOCKUP · insights library', 'voice': 'MOCKUP · voice kit → review', 'setup': 'MOCKUP · cms → site', 'video': 'MOCKUP · video + chapters', 'schema': 'MOCKUP · json-ld → search + ai', 'portable': 'MOCKUP · content model',
      'cks-styles': 'DEMO · design tokens, live', 'cks-story': 'DEMO · scroll story', 'cks-map': 'DEMO · knowledge map', 'cks-sketch': 'DEMO · sketch tool', 'cks-publish': 'DEMO · cms → site + json-ld', 'cks-plan': 'FIGJAM · ideation → wireframes → build' };
    screen.innerHTML = CH.map(channelView).join('') + '<div class="scan"></div><div class="roll"></div><div class="vig"></div><canvas class="noise" id="noise" width="160" height="100"></canvas>' +
      '<i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i><div class="osd" id="osd">CH 1</div>';
    // a recorded loop of the real site (MOCKS[slug].img) is labeled as a recording, not a still
    CH.forEach(function(c){ if (c.loop){ TYPE['loop-' + c.kind] = 'Loop'; KIND['loop-' + c.kind] = 'LOOP · recorded from the site' + (c.kind === 'mobile' ? ' · phone' : ''); } });
    function tk(c){ return c.loop ? 'loop-' + c.kind : c.kind; }
    chans.innerHTML = CH.map(function(c, i){ return '<button type="button" role="tab" data-ch="' + esc(c.id) + '" aria-selected="' + (i ? 'false' : 'true') + '"><span class="k">' + (i + 1) + '</span><span>' + esc(c.label) + '</span><span class="t">' + (TYPE[tk(c)] || '') + '</span></button>'; }).join('');
    chans.style.setProperty('--n', CH.length);
    var views = $$('.view', screen), chBtns = $$('button', chans), osd = $('#osd'), monLabel = $('#monLabel'), monCap = $('#monCap'), monKind = $('#monKind');
    // coded scenes need this mission's mockup spec for that kind; one broken scene never stops the monitor
    var NEED = { figma: 'els', phone: 'mobile', flow: 'flow', exploded: 'explode', cms: 'cms', sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable',
      'cks-styles': 'cks', 'cks-story': 'cks', 'cks-map': 'cks', 'cks-sketch': 'cks', 'cks-publish': 'cks', 'cks-plan': 'cks' };
    views.forEach(function(v, k){
      var c = CH[k], key = NEED[c.kind]; if (!key) return;
      if (!(M.mock && M.mock[key])){ v.innerHTML = '<div class="boot">Mockup coming soon</div>'; return; }
      try { SCENE.mount(v, c, M); } catch(err){ if (window.console) console.warn('[ab-mission] scene', c.id, err); v.innerHTML = '<div class="boot">Mockup unavailable</div>'; }
    });
    var noise = $('#noise'), nctx = noise.getContext('2d'), curCh = 0, booted = {}, monVisible = false;
    function staticBurst(){
      if (reduce || !hasGsap) return;
      var o = { t: 0 };
      gsap.fromTo(noise, { opacity: .9 }, { opacity: 0, duration: .38, ease: 'power2.in' });
      gsap.to(o, { t: 1, duration: .38, onUpdate: function(){ var img = nctx.createImageData(160, 100), d = img.data; for (var i = 0; i < d.length; i += 4){ var v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } nctx.putImageData(img, 0, 0); } });
      gsap.fromTo(screen, { filter: 'brightness(2) saturate(0)' }, { filter: 'brightness(1) saturate(1)', duration: .45, ease: 'power2.out', clearProps: 'filter' });
    }
    var seenCh = {};
    function setCh(i, silent){
      i = (i + CH.length) % CH.length; var c = CH[i]; curCh = i;
      seenCh[i] = true; if (CH.length > 1 && Object.keys(seenCh).length >= CH.length && AB.quest) AB.quest('channels');
      views.forEach(function(v, k){ v.classList.toggle('on', k === i); });
      chBtns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      monLabel.textContent = c.label; monCap.textContent = c.caption; monKind.textContent = KIND[tk(c)] || '';
      $('#tCh').textContent = (i + 1) + ' / ' + CH.length;
      $('#tSrc').textContent = c.kind.indexOf('live') === 0 ? 'Live code' : liveOn(c) ? 'Live site' : c.loop ? 'Recording' : /^cks-/.test(c.kind) ? 'Coded demo' : c.kind === 'wipe' ? 'Figma + site' : /^(figma|phone|flow|exploded|cms|sketch|vector|graph|library|voice|setup|video|schema|portable)$/.test(c.kind) ? 'Mockup' : c.kind === 'logo' || c.kind === 'apps' ? 'Vector' : 'Screenshot';
      if (liveOn(c)){ monKind.textContent = 'LIVE · ' + LIVE.host; chBtns[i].querySelector('.t').textContent = 'Live'; }
      osd.textContent = 'CH ' + (i + 1) + ' · ' + c.label;
      if (!silent){ staticBurst(); if (!reduce && hasGsap) gsap.fromTo(osd, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 3, yoyo: true }); }
      boot(c, views[i]);
      if (c.kind === 'logo') logoAnim(views[i], c.mode);
      SCENE.activate(c.id);
    }
    chBtns.forEach(function(b, i){ b.addEventListener('click', function(){ if (i !== curCh) setCh(i); }); });
    // "Show on the monitor" buttons in systems + problems
    document.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-show]'); if (!b) return;
      e.preventDefault();
      var i = -1; CH.forEach(function(c, k){ if (i < 0 && c.id === b.getAttribute('data-show')) i = k; }); if (i < 0) return;
      var go = function(){ setCh(i); }, mon = $('#monitor');
      if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(mon, { offset: -80, duration: 1.2, onComplete: go }); else { mon.scrollIntoView({ behavior: 'smooth' }); setTimeout(go, 600); }
    });
    new IntersectionObserver(function(es){ monVisible = es[0].isIntersecting; if (monVisible) boot(CH[curCh], views[curCh]); }, { rootMargin: '200px' }).observe(screen);
    document.addEventListener('keydown', function(e){
      if (!monVisible || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
      var n = parseInt(e.key, 10); if (n >= 1 && n <= CH.length && n - 1 !== curCh) setCh(n - 1);
    });
    // timecode + frame rate
    if (hasGsap) (function(){
      var tc = $('#monTC'), fpsEl = $('#tFps'), t0 = performance.now(), acc = 0, frames = 0;
      gsap.ticker.add(function(time, dt){
        if (!monVisible) return;
        frames++; acc += dt;
        if (acc > 500){ fpsEl.textContent = Math.round(frames * 1000 / acc) + ' fps'; frames = 0; acc = 0; }
        var s = (performance.now() - t0) / 1000, f = Math.floor((s % 1) * 24);
        tc.textContent = pad2(Math.floor(s / 3600)) + ':' + pad2(Math.floor(s / 60) % 60) + ':' + pad2(Math.floor(s) % 60) + ':' + pad2(f);
      });
    })();
    // design → build wipe
    $$('.wipe', screen).forEach(function(w){
      var p = 50, drag = false;
      function set(x){ var r = w.getBoundingClientRect(); p = Math.max(0, Math.min(100, (x - r.left) / r.width * 100)); w.style.setProperty('--p', p + '%'); w.setAttribute('aria-valuenow', Math.round(p)); }
      w.addEventListener('pointerdown', function(e){ drag = true; w.setPointerCapture(e.pointerId); set(e.clientX); });
      w.addEventListener('pointermove', function(e){ if (drag) set(e.clientX); });
      w.addEventListener('pointerup', function(){ drag = false; });
      w.tabIndex = 0; w.setAttribute('role', 'slider'); w.setAttribute('aria-label', 'Compare design and build'); w.setAttribute('aria-valuemin', 0); w.setAttribute('aria-valuemax', 100);
      w.addEventListener('keydown', function(e){ var d = { ArrowLeft: -5, ArrowRight: 5 }[e.key]; if (!d) return; e.preventDefault(); p = Math.max(0, Math.min(100, p + d)); w.style.setProperty('--p', p + '%'); w.setAttribute('aria-valuenow', Math.round(p)); });
    });
    // live channels: the real production code, loaded on first view (vendor copies in this repo)
    function boot(c, view){
      if (liveOn(c) && monVisible) liveSite(c, view);
      if (booted[c.id] || !view.classList.contains('on') || (!monVisible && c.kind.indexOf('live') === 0)) return;
      var bootEl = $('.boot', view);
      if (c.kind === 'live-globe'){
        booted[c.id] = true;
        var data = document.createElement('div'); data.className = 'globe_cms-data'; data.hidden = true;
        data.innerHTML = PINS.map(function(p, i){ return '<div class="globe_cms-item" data-globe-lat="' + p.lat + '" data-globe-lng="' + p.lng + '" data-globe-city="' + esc(p.city) + '" data-globe-title="' + esc(p.title) + '" data-globe-slug="p' + i + '"' + (p.link ? ' data-globe-link="' + esc(p.link) + '"' : ' data-globe-has-case-study="false"') + '><img class="globe_cms-img" src="' + esc(p.img) + '" alt=""></div>'; }).join('');
        document.body.appendChild(data);
        var w = document.createElement('div'); w.className = 'globe-hero_canvas-wrapper'; view.appendChild(w);
        var cue = document.createElement('div'); cue.className = 'globe-cue'; cue.textContent = 'Drag to explore · Click + Scroll to zoom'; view.appendChild(cue);
        window.__globeCtaHref = M.live || '';
        loadScript(VENDOR + '510-globe.js').then(function(){ setTimeout(function(){ if (bootEl) bootEl.classList.add('gone'); }, 900); })
          .catch(function(){ if (bootEl) bootEl.textContent = 'Live demo unavailable'; });
      }
      if (c.kind === 'live-map'){
        booted[c.id] = true;
        var types = ['Asylum', 'Family-Based', 'Removal Defense', 'Work Visa', 'Humanitarian'];
        var m = document.createElement('div'); m.className = 'case-map is-fill';
        m.innerHTML = '<div class="case-map_canvas-wrap" id="canvasWrap"><div class="map_loading" id="loadingMsg"></div><canvas class="map_canvas" id="mapCanvas"></canvas>' +
          '<button class="map_zoom-reset" id="zoomReset" aria-label="Reset view" type="button"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 3 3 3 3 9"/><polyline points="15 3 21 3 21 9"/><polyline points="3 15 3 21 9 21"/><polyline points="21 15 21 21 15 21"/></svg></button>' +
          '<div class="map_hint"><span>Hover a pin to preview · Click for details</span></div>' +
          '<div class="pin-tooltip" id="pinTooltip"><span class="pin-tooltip-type" id="pinTooltipType"></span><span class="pin-tooltip-outcome" id="pinTooltipOutcome"></span></div>' +
          '<div class="popup" id="popup"><div class="popup-rule"></div><div class="popup-body" id="popup-body"></div></div></div>' +
          '<div class="hero_filters"><span class="hero_filters-label">Filter by</span><button type="button" class="filter_chip is-active" data-type="all">All cases</button>' + types.map(function(t){ return '<button type="button" class="filter_chip" data-type="' + t + '">' + t + '</button>'; }).join('') + '</div>';
        view.appendChild(m);
        window.__daMapNoLinks = true;
        loadScript(VENDOR + 'aguirre-case-map.js').then(function(){ setTimeout(function(){ if (bootEl) bootEl.classList.add('gone'); }, 1400); })
          .catch(function(){ if (bootEl) bootEl.textContent = 'Live demo unavailable'; });
      }
    }
    // logo channels: the mark draws itself on its grid
    function logoAnim(view, mode){
      var svg = $('svg', view); if (!svg) return;
      if (reduce || !hasGsap) return;
      var gs = $$('.lg-g', view), mk = $('.lg-m', view), ps = $$('.lg-m path', view), dm = $('.lg-d', view);
      gsap.killTweensOf([gs, mk, ps, dm]);
      gs.forEach(function(g){ var L = g.getTotalLength ? g.getTotalLength() : 600; gsap.fromTo(g, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', delay: Math.random() * .3 }); });
      if (dm) gsap.fromTo(dm, { opacity: 0 }, { opacity: 1, duration: .5, delay: .9 });
      // the mark warps in from a point, spinning, as an outline, then fills
      var d = gs.length ? .6 : .1;
      gsap.fromTo(mk, { scale: .05, rotation: -720, opacity: 0, svgOrigin: '240 121' }, { scale: 1, rotation: 0, opacity: 1, duration: 1.1, ease: 'expo.out', delay: d });
      gsap.fromTo(ps, { fillOpacity: 0, stroke: 'currentColor', strokeWidth: 5, strokeOpacity: 1 }, { fillOpacity: 1, strokeOpacity: 0, duration: .6, stagger: .12, ease: 'power2.out', delay: d + .9 });
    }
    /* live sites: a mission whose real site isn't up yet (mock.live) runs coded demos; once the site answers
       (M.liveCheck in 30-mission), the live channels show the real page in an iframe, the coded demo one tap away.
       Phones keep the demo (battery + data) and get a link out instead. */
    var LIVE = null;
    function liveOn(c){ return !!(LIVE && LIVE.ok && LIVE.pages[c.id]); }
    function liveSite(c, view){
      if (view.__live) return; view.__live = true;
      var url = LIVE.base + LIVE.pages[c.id], sc = SCENE.get(c.id);
      if (coarse){ view.insertAdjacentHTML('beforeend', '<a class="cx-open" href="' + esc(url) + '" target="_blank" rel="noopener">Open the live site ↗</a>'); return; }
      var box = document.createElement('div'); box.className = 'cx-live';
      box.innerHTML = '<iframe title="' + esc(c.label) + ', live on ' + esc(LIVE.host) + '" src="' + esc(url) + '" loading="lazy" referrerpolicy="no-referrer"></iframe>';
      var bar = document.createElement('div'); bar.className = 'cx-live-bar';
      bar.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener"><i></i>Live · ' + esc(LIVE.host) + ' ↗</a><button type="button">Show the coded demo</button>';
      view.appendChild(box); view.appendChild(bar);
      var fr = $('iframe', box), btn = $('button', bar);
      // the page renders at desktop width, scaled down to the screen
      function fit(){ var W = view.clientWidth, H = view.clientHeight; if (!W) return; var k = Math.min(1, W / 1280); fr.style.width = W / k + 'px'; fr.style.height = H / k + 'px'; fr.style.transform = 'scale(' + k + ')'; }
      fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(view);
      // one class flips between the real page and the coded demo (which pauses while hidden)
      function show(live){ view.classList.toggle('is-live', live); btn.textContent = live ? 'Show the coded demo' : 'Show the live site'; if (sc){ if (live && sc.hold) sc.hold(); if (!live && sc.resume) sc.resume(); } }
      btn.addEventListener('click', function(){ show(!view.classList.contains('is-live')); });
      show(true);
    }
    if (M.liveCheck) M.liveCheck.then(function(ok){
      if (!ok) return;
      var L = M.mock.live; LIVE = { ok: true, base: L.base, pages: L.pages || {}, host: L.base.replace(/^https?:\/\//, '').replace(/\/$/, '') };
      CH.forEach(function(c, k){ if (liveOn(c)){ var t = chBtns[k].querySelector('.t'); if (t) t.textContent = 'Live'; } });
      setCh(curCh, true);
    });
    setCh(0, true);
  })();

});
