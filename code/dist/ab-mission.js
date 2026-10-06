/*! AB Portfolio · ab-mission v0.33.60 · github.com/AngelinoBarajas/ab-portfolio */
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
  // CKS: the product site for the Knowledge System. Renamed Topicweave (cks-v3): the coded scenes are 24-tw-*.js (key `tw`),
  // plus this figma + phone spec in the v3 look (black, Fraunces + Inter Tight, lilac labels, one cobalt action, square corners).
  // Nothing from v3 is deployed, so no `live` swap. Styles: the TOPICWEAVE section of ab-mission.css.
  // The marks come from the Topicweave kit (23-tw-base.js loads after this file), so `els` and `mobile` are getters that
  // build their markup the first time a scene reads them, and start the site's fonts (rebuilding that scene once they land).
  (function(){
    function kitTw(){ return typeof SCENE !== 'undefined' && SCENE && SCENE.kit ? SCENE.kit.tw : null; }
    var WV = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff'];
    var ARROW = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var MOON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M15.5 12.6A6.5 6.5 0 017.4 4.5a6.5 6.5 0 108.1 8.1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    // the loom's threads, drawn as short fibers: each band scatters fibers along a segment (the woven mark = four bars),
    // `loose` adds stray fibers around it. One path per color and strength keeps the DOM small.
    function rng(seed){ var s = seed; return function(){ s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
    function fibers(o){
      var r = rng(o.seed || 7), P = {}, keys = [], sw = o.sw || .5, i, k;
      function add(col, strong, x, y, a, l){
        var key = col + (strong ? '|b' : '|d'); if (!P[key]){ P[key] = ''; keys.push(key); }
        var ex = Math.cos(a) * l, ey = Math.sin(a) * l;
        P[key] += 'M' + (x - ex / 2).toFixed(1) + ' ' + (y - ey / 2).toFixed(1) + 'l' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      }
      (o.bands || []).forEach(function(b){
        var dx = b[2] - b[0], dy = b[3] - b[1], L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, base = Math.atan2(uy, ux);
        for (i = 0; i < b[6]; i++){
          var t = r(), off = (r() - .5) * b[4];
          add(b[5], r() > .3, b[0] + dx * t - uy * off, b[1] + dy * t + ux * off, base + (r() - .5) * .32, (o.len || 3.2) * (.75 + r() * .6));
        }
      });
      if (o.loose) for (i = 0; i < o.loose.n; i++){
        var ang = r() * Math.PI * 2, rad = o.loose.r0 + r() * (o.loose.r1 - o.loose.r0);
        add(o.loose.cols[Math.floor(r() * o.loose.cols.length)], false, o.loose.cx + Math.cos(ang) * rad, o.loose.cy + Math.sin(ang) * rad, r() * Math.PI, (o.len || 3.2) * (.6 + r() * .5));
      }
      var s = '<svg viewBox="' + o.vb + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
      for (k = 0; k < keys.length; k++){
        var c = keys[k].split('|');
        s += '<path d="' + P[keys[k]] + '" fill="none" stroke="' + c[0] + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-opacity="' + (c[1] === 'b' ? .92 : .38) + '"/>';
      }
      return s + '</svg>';
    }
    // the hero shape: the woven mark in threads (left bar lilac, right bar cobalt, top coral, bottom teal), as on Home
    function markSvg(n, seed){
      var a = 21.5, b = 45.2, w = 13.5, e = 66.7;
      return fibers({ vb: '-24 -24 114.7 114.7', seed: seed, sw: .55, len: 3.4,
        bands: [[a, 0, a, e, w, WV[0], n], [b, 0, b, e, w, WV[3], n], [0, a, e, a, w, WV[1], n], [0, b, e, b, w, WV[2], n]],
        loose: { n: Math.round(n * .45), cx: 33.4, cy: 33.4, r0: 40, r1: 56, cols: ['#8a8a8a', '#8a8a8a', WV[0], WV[3]] } });
    }
    // The problem: the same threads scattered loose
    function scatterSvg(){
      return fibers({ vb: '0 0 120 70', seed: 31, sw: .6, len: 3.6, loose: { n: 150, cx: 60, cy: 35, r0: 2, r1: 34, cols: WV } });
    }
    // How it works: a spine of terms with four things hanging off it
    function spineSvg(){
      return fibers({ vb: '0 0 120 80', seed: 53, sw: .6, len: 3.4,
        bands: [[60, 4, 60, 76, 5, WV[0], 60], [60, 20, 22, 10, 4, WV[1], 26], [60, 34, 98, 24, 4, WV[2], 26], [60, 50, 24, 60, 4, WV[3], 26], [60, 64, 96, 72, 4, WV[1], 22]],
        loose: { n: 30, cx: 60, cy: 40, r0: 30, r1: 48, cols: ['#8a8a8a'] } });
    }

    var cache = {}, MK;
    // start the site's fonts and rebuild the figma/phone scene reading this spec once they arrive (layout is measured at build)
    function kick(){
      var T = kitTw(); if (!T) return;
      T.fonts();
      Array.prototype.forEach.call(document.querySelectorAll('.view[data-ch]'), function(v){
        var sc = SCENE.get(v.getAttribute('data-ch'));
        if (sc && sc.M && sc.M.mock === MK && (sc.kind === 'figma' || sc.kind === 'phone')) T.fonts(sc);
      });
    }
    function logo(T){ return T ? T.LOGO : '<b class="tw-mk-word">Topicweave</b>'; }
    function icon(T){ return T ? T.ICON : ''; }

    function figmaEls(){
      var T = kitTw(); kick();
      if (cache.els) return cache.els;
      var els = [
        { id: 'nav', name: 'Nav / logo + links', icon: 'comp', type: 'Component', x: 88, y: 6, w: 824, h: 40, wire: 'nav',
          props: { fill: '#000000', font: 'Inter Tight', weight: 'SemiBold', size: '14', ls: '2.5%' },
          html: '<div class="tw-mk-nav"><span class="tw-mk-logo">' + logo(T) + '</span><span class="tw-mk-links"><span>How it works</span><span>The app</span><span>Voice Kit</span><span>Install</span><span>Pricing</span><span>Roadmap</span></span><span class="tw-mk-btn">Join the beta</span><span class="tw-mk-tile">' + MOON + '</span></div>' },
        { id: 'label', name: 'Label / Be known for what you know', icon: 'text', type: 'Text', x: 89, y: 98, w: 260, h: 16, wire: 'lines:1',
          props: { fill: '#9B87F5', font: 'Inter Tight', weight: 'SemiBold', size: '14', lh: '120%', ls: '2.5%' },
          html: '<div class="tw-mk-eb">Be known for what you know</div>' },
        { id: 'heading', name: 'H1 / Turn what you know', icon: 'text', type: 'Text', x: 89, y: 128, w: 360, h: 262, wire: 'lines:4:big',
          props: { fill: '#FFFFFF', font: 'Fraunces', weight: 'Light 350', size: '94', lh: '98%', ls: '-3%' },
          html: '<div class="tw-mk-h1">Turn what you know into a site people and AI can follow.</div>' },
        { id: 'lede', name: 'Lede / one connected system', icon: 'text', type: 'Text', x: 89, y: 408, w: 360, h: 76, wire: 'lines:4',
          props: { fill: '#FFFFFF', font: 'Inter Tight', weight: 'Regular', size: '18', lh: '150%' },
          html: '<p class="tw-mk-lede">Topicweave builds your expertise into your website as one connected system: a vocabulary in your own words, every page tagged to it, and topic pages that build themselves. Then it shows you what’s working and lets you keep adding to it from anywhere.</p>' },
        { id: 'cta', name: 'Buttons / Join the beta', icon: 'comp', type: 'Component', x: 89, y: 502, w: 280, h: 32, wire: 'btn',
          props: { fill: '#2F5BEA', font: 'Inter Tight', weight: 'SemiBold', size: '14', ls: '2.5%' },
          html: '<div class="tw-mk-acts"><span class="tw-mk-cta hv">Join the beta ' + ARROW + '</span><span class="tw-mk-ghost">See how it works ' + ARROW + '</span></div>' },
        { id: 'loom', name: 'Canvas / loom · mark', icon: 'img', type: 'Embed', x: 520, y: 60, w: 470, h: 520, wire: 'img',
          props: { fill: 'Canvas · 2D' },
          html: '<div class="tw-mk-loom">' + markSvg(150, 11) + '</div>' }
      ];
      if (T) cache.els = els;
      return els;
    }

    function phone(){
      var T = kitTw(); kick();
      if (cache.mobile) return cache.mobile;
      var LINKS = ['Home', 'How it works', 'The app', 'Voice Kit', 'Install', 'Pricing', 'Roadmap'];
      var mm = {
        bg: '#000', statusFg: '#fff',
        nav: '<div class="tw-pn"><span class="tw-pn-brand"><span class="tw-pn-logo">' + logo(T) + '</span><span class="tw-pn-icon">' + icon(T) + '</span></span>' +
          '<span class="tw-pn-end"><span class="tw-pn-t tw-pm-theme">' + MOON + '</span><span class="tw-pn-t tw-pm-menu"><span class="tw-burger"><i></i><i></i><i></i></span></span></span></div>' +
          '<div class="tw-pm-cloth" aria-hidden="true"></div>',
        menu: '<div class="tw-pmn"><div class="tw-pmn-weave"></div><div class="tw-pmn-top"><span class="tw-pn-t">' + icon(T) + '</span><span class="tw-pn-t"><span class="tw-burger is-x"><i></i><i></i><i></i></span></span></div>' +
          '<ol class="tw-pmn-l">' + LINKS.map(function(l, i){ return '<li class="tw-pmn-i tw-pmn-i' + (i + 1) + '" style="transition-delay:' + (.08 + i * .04).toFixed(2) + 's"><small>0' + (i + 1) + '</small>' + l + '</li>'; }).join('') + '</ol>' +
          '<span class="tw-pmn-cta">Join the beta ' + ARROW + '</span></div>',
        html: '<div class="tw-pm">' +
          '<div class="tw-pm-pg tw-pm-home">' +
            '<p class="tw-pm-eb">Be known for what you know</p>' +
            '<div class="tw-pm-h1">Turn what you know into a site people and AI can follow.</div>' +
            '<div class="tw-pm-loom">' + markSvg(80, 5) + '</div>' +
            '<p class="tw-pm-p">Topicweave builds your expertise into your website as one connected system: a vocabulary in your own words, every page tagged to it, and topic pages that build themselves.</p>' +
            '<div class="tw-pm-acts"><span class="tw-pm-btn">Join the beta ' + ARROW + '</span><span class="tw-pm-ghost">See how it works ' + ARROW + '</span></div>' +
            '<div class="tw-pm-sec tw-pm-prob"><p class="tw-pm-eb">The problem</p><div class="tw-pm-h2">AI answers reward sites that connect the dots. Most don’t.</div>' +
              '<div class="tw-pm-shape">' + scatterSvg() + '</div>' +
              '<p class="tw-pm-p">Search engines and AI assistants look for a clear source: named ideas, proof behind them, and pages that point to each other.</p></div>' +
            '<div class="tw-pm-sec"><p class="tw-pm-eb">Step one</p><div class="tw-pm-h2">Name the ideas, in your words.</div>' +
              '<dl class="tw-pm-terms">' + [['Who you help', 'Professional firms', 0], ['Services', 'Onboarding redesign', 1], ['How it works', 'Journey mapping', 2], ['What you watch for', 'Client handoffs', 3], ['Ideas', 'Client onboarding', 0]].map(function(r){ return '<div><dt><i style="background:' + WV[r[2]] + '"></i>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl></div>' +
          '</div>' +
          '<div class="tw-pm-pg tw-pm-hiw">' +
            '<p class="tw-pm-eb">How it works</p>' +
            '<div class="tw-pm-h1">Five parts, one shared vocabulary.</div>' +
            '<div class="tw-pm-loom tw-pm-spine">' + spineSvg() + '</div>' +
            '<p class="tw-pm-p">Topicweave is a spine of terms in your own words, and four things that hang off it. Tag a piece of content once and it shows up everywhere it belongs.</p>' +
            '<div class="tw-pm-acts"><span class="tw-pm-btn">Join the beta ' + ARROW + '</span></div>' +
          '</div></div>',
        notes: [
          { t: 'Three glass tiles, no bar', d: 'The mark, the theme switch and a menu button in the mark’s colors. At the top the mark tile opens to the full logo, and folds back to the icon once you scroll.' },
          { t: 'Headline above the shape', d: 'On a phone each section’s label and headline sit above its thread shape and the copy follows below, so a shape never draws through the words.' },
          { t: 'Dark by default, light on tap', d: 'Black is the default. The switch swaps to paper and ink, and the threads keep their four colors in both.' },
          { t: 'Page changes knit a cloth', d: 'Pick a page from the menu and a cloth of threads knits across the screen from the link, then unravels on the next page.' }
        ],
        steps: [
          { note: 0, hold: 2.2 },
          { note: 1, add: 'tw-sc', hold: 0 }, { scroll: '.tw-pm-prob', off: 74, hold: 2.2 },
          { note: 2, hold: .3 }, { tap: '.tw-pm-theme', toggle: 'tw-light', hold: 2 }, { tap: '.tw-pm-theme', toggle: 'tw-light', hold: .5 },
          { note: 3, tap: '.tw-pm-menu', toggle: 'menu', hold: 1.5 }, { tap: '.tw-pmn-i2', add: 'tw-pw', hold: .75 },
          { remove: 'menu', hold: 0 }, { add: 'tw-hiw', hold: 0 }, { remove: 'tw-sc', hold: 0 }, { scroll: 0, hold: .05 },
          { add: 'tw-pwo', hold: 2.8 },
          { note: -1, hold: .3 }
        ]
      };
      if (T) cache.mobile = mm;
      return mm;
    }

    MK = {
      accent: '#9B87F5', tw: true,
      file: 'Topicweave — Product site', page: 'Home', frame: 'Desktop · Hero', url: 'topicweave.com',
      bg: '#000000', hover: 'cta',
      comment: { on: 'heading', by: 'Review', text: 'The threads run into the headline when the window narrows.', reply: 'Threads now fade near text and the screen edges, so the mark keeps right and the headline stays clear.' },
      get els(){ return figmaEls(); },
      get mobile(){ return phone(); }
    };
    MOCKS.topicweave = MK;
  })();
  // Keyed under both slugs until the CMS slug change (cks → topicweave) is published.
  MOCKS.cks = MOCKS.topicweave;
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
    var reduce = AB.reduce;
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
          var s = c.s, inner = s.mark ? '<g transform="translate(10 30) scale(.367)"><path class="sk-l" style="' + swm + '" d="' + M.a + '"/><path class="sk-l" style="' + swm + '" d="' + M.leg + '"/><path class="sk-l" style="' + swm + '" d="' + M.planet + '"/><path class="sk-l" style="' + swm + '" d="' + M.b + '"/></g>' :
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
      var names = ['A stroke', 'A leg', 'B', 'Planet + ring'], keys = ['a', 'leg', 'b', 'planet'];
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
        var L = p.getTotalLength ? p.getTotalLength() : 800, pl = keys[i] === 'planet', n = pl ? 16 : keys[i] === 'leg' ? 6 : 10, pts = [];
        for (var j = 0; j <= n; j++){ var a = p.getPointAtLength ? p.getPointAtLength(L * j / n) : { x: 0, y: 0 }; pts.push(toStage(a)); }
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'ai-an'); anch.appendChild(g);
        g.innerHTML = pts.map(function(pt, j){
          var h = '';
          if (pl && j % 4 === 2 && pts[j + 1]){ var dx = pts[j + 1].x - pts[j - 1].x, dy = pts[j + 1].y - pts[j - 1].y, dl = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / dl * 22, uy = dy / dl * 22;
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
        var d = keys[i] === 'planet' ? 2.6 : keys[i] === 'leg' ? .9 : 1.5, prog = { v: 0 };
        tl.to(o.p, { strokeDashoffset: 0, duration: d, ease: 'none' }, t);
        tl.fromTo(prog, { v: 0 }, { v: 1, duration: d, ease: 'none', immediateRender: false, onUpdate: function(){ if (!o.p.getPointAtLength) return; var pt = toStage(o.p.getPointAtLength(prog.v * o.L)); gsap.set(pen, { x: pt.x - 3, y: pt.y - 21 }); } }, t);
        tl.fromTo(o.dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .18, stagger: d / o.dots.length, ease: 'back.out(3)', immediateRender: false }, t);
        (function(li){ if (layers[li]) at(t + d, function(){ layers[li].classList.add('on'); }); })(layers.length - 2 - i);
        t += d + .25;
      });
      // pathfinder: select all, Minus Front → solid shapes with real cuts
      tl.addLabel('pathfinder', t);
      tl.to(pen, { autoAlpha: 0, duration: .2 }, t).to(curA, { autoAlpha: 1, duration: .2 }, t);
      at(t + .1, function(){ st.classList.add('is-sel'); if (mode) mode.textContent = 'Selection · 4 paths'; });
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

    // shared with the Topicweave scenes (24-tw-*.js)
    K.ks = { pos: pos, run: run, end: end, type: type, count: count, path: path, hide: hide, draw: draw, curve: curve, click: click, move: move, cursor: cursor };
  })();

  /* ===== mission/23-tw-base.js ===== */
  /* =========================================================
     TOPICWEAVE KIT (mission topicweave, renamed from CKS; the scenes are 24-tw-*.js)
     The v3 site's own look: black, bone, Fraunces + Inter Tight, square corners, and the four weave colors
     (lilac, coral, teal, cobalt). Marks are the site's real SVGs (cks-v3/build.py LOGO + ICON).
     K.tw.weave is the site's thread cloth (cks-v3 js/site.js sheetWeave), ported to ES5:
       radial: threads fly out from a point and knit a cover, then unravel (monitor channel changes)
       band  : a strip of cloth knits in from one side with a slow wave running through it (section seams)
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K) return;
    var q = K.q, esc = K.esc;
    var C = { void: '#000', bone: '#fff', ash: '#9a9a9a', mist: '#bdbdbd', soft: '#e2e2e2', line: 'rgba(255,255,255,.12)',
      lilac: '#9b87f5', lilacText: '#b9a6ff', coral: '#ef5b3f', teal: '#139e8a', cobalt: '#4f7bff', cobaltDeep: '#2f5bea', paper: '#f7f5f0', night: '#0b1b2b' };
    var WEAVE = [C.lilac, C.coral, C.teal, C.cobalt];
    var LOGO = '<svg viewBox="0 0 528.58 76.07" aria-hidden="true"><path fill="#9085bf" d="M28.98,1.78v31h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#9085bf" d="M14.15,56.54h14.83v8.41c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-8.41Z"/><path fill="#f05b40" d="M1.78,14.15h7.41v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78Z"/><path fill="#0f9e8a" d="M32.78,37.74v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78h31Z"/><path fill="#0f9e8a" d="M66.73,39.52v11.27c0,.98-.8,1.78-1.78,1.78h-7.41v-14.83h7.41c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M52.57,1.78v7.41h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M37.74,33.95h14.83v31c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-31Z"/><path fill="#f05b40" d="M66.73,15.94v11.27c0,.98-.8,1.78-1.78,1.78h-31v-14.83h31c.98,0,1.78.8,1.78,1.78Z"/><g fill="currentColor"><path d="M146.47,17.57c.27-.49.32-1.13.16-1.9l-2.68-12.83c-.27-1.04-.63-1.77-1.1-2.2C142.38.21,141.7,0,140.79,0c-.59,0-1.13.12-1.64.36-.51.24-1.08.49-1.72.74-.64.25-1.47.38-2.48.38h-27.9c-1.01,0-1.84-.13-2.48-.38-.64-.25-1.21-.5-1.72-.74C102.35.12,101.8,0,101.22,0c-.91,0-1.59.21-2.06.64-.47.43-.83,1.16-1.1,2.2l-2.68,12.83c-.16.77-.1,1.41.18,1.9.28.49.74.79,1.38.9.61.13,1.16.09,1.64-.14.48-.23.88-.69,1.2-1.38,1.38-3.09,2.57-5.44,3.56-7.04.99-1.6,1.98-2.69,2.98-3.28,1-.59,2.21-.88,3.62-.88h4.88v44.89c0,.61-.17,1.11-.52,1.48s-.84.65-1.48.84l-2.28.52c-1.15.35-1.72,1.04-1.72,2.08,0,.56.2,1.01.6,1.36.4.35,1.03.52,1.88.52h19.43c1.65,0,2.48-.63,2.48-1.88,0-1.04-.57-1.73-1.72-2.08l-2.28-.52c-.64-.19-1.13-.47-1.48-.84-.35-.37-.52-.87-.52-1.48V5.76h4.88c1.44,0,2.65.29,3.64.88s1.97,1.68,2.96,3.28,2.17,3.94,3.56,7.04c.32.69.72,1.15,1.2,1.38.48.23,1.03.27,1.64.14.67-.11,1.13-.41,1.4-.9Z"/><path d="M177.26,21.13c-3.13-1.69-6.76-2.54-10.89-2.54s-7.87.86-11.05,2.58c-3.18,1.72-5.68,4.07-7.47,7.05-1.8,2.99-2.7,6.38-2.7,10.19s.88,7.38,2.64,10.39,4.2,5.37,7.32,7.08,6.74,2.56,10.87,2.56,7.87-.87,11.05-2.6c3.18-1.73,5.68-4.1,7.47-7.1s2.7-6.38,2.7-10.13c0-3.97-.87-7.46-2.62-10.45-1.75-3-4.18-5.34-7.32-7.04ZM175.72,45.91c-.29,2.44-.99,4.35-2.1,5.74s-2.58,2.23-4.42,2.52c-1.87.32-3.6,0-5.2-.98s-2.99-2.57-4.18-4.8c-1.19-2.22-2.09-5.04-2.7-8.46-.61-3.44-.78-6.38-.5-8.81.28-2.44.97-4.35,2.08-5.74,1.11-1.39,2.58-2.22,4.42-2.52,1.86-.32,3.6,0,5.22.98,1.61.97,3,2.57,4.18,4.8,1.17,2.23,2.06,5.04,2.68,8.45.64,3.44.81,6.38.52,8.81Z"/><path d="M226.98,21.01c-2.49-1.61-5.31-2.42-8.45-2.42-3.38,0-6.46.93-9.23,2.8-1.3.87-2.52,1.91-3.68,3.1v-3.1c0-.77-.22-1.4-.66-1.88-.44-.48-1.13-.72-2.06-.72-.51,0-1.08.08-1.72.24-.64.16-1.45.44-2.44.84l-6.84,2.72c-.72.29-1.21.57-1.48.82-.27.25-.4.61-.4,1.06,0,.4.11.72.32.96.21.24.56.41,1.04.52l2.12.16c.45.08.79.27,1,.58.21.31.32.81.32,1.5v41.37c0,.85-.12,1.47-.36,1.86-.24.39-.6.66-1.08.82l-1.56.4c-.51.19-.88.42-1.12.7-.24.28-.36.63-.36,1.06,0,.51.18.91.54,1.22.36.31.93.46,1.7.46h16.35c.77,0,1.34-.15,1.7-.46.36-.31.54-.71.54-1.22,0-.43-.12-.79-.36-1.08-.24-.29-.63-.52-1.16-.68l-2.12-.44c-.48-.13-.84-.4-1.08-.8-.24-.4-.36-1.01-.36-1.84v-14.16c.38.28.76.54,1.16.79,2.48,1.5,5.32,2.26,8.51,2.26,3.6,0,6.85-.86,9.75-2.58s5.21-4.14,6.92-7.28c1.71-3.13,2.56-6.83,2.56-11.09,0-3.7-.71-6.98-2.14-9.81-1.43-2.84-3.38-5.06-5.88-6.68ZM222.01,47.25c-.83,2.24-1.96,3.89-3.4,4.96-1.44,1.07-3.06,1.6-4.88,1.6-1.92,0-3.7-.54-5.34-1.62-.8-.53-1.57-1.19-2.3-1.99v-21.94c.76-.86,1.56-1.58,2.38-2.15,1.69-1.17,3.51-1.76,5.46-1.76,1.79,0,3.38.52,4.78,1.56,1.4,1.04,2.5,2.62,3.32,4.74.81,2.12,1.22,4.8,1.22,8.05,0,3.46-.41,6.32-1.24,8.55Z"/><path d="M257.47,54l-1.48-.4c-.48-.16-.84-.44-1.08-.84-.24-.4-.36-1.01-.36-1.84v-29.54c0-.77-.22-1.4-.66-1.88-.44-.48-1.11-.72-2.02-.72-.45,0-1,.08-1.64.24-.64.16-1.49.44-2.56.84l-7.31,2.72c-.72.27-1.21.53-1.48.8-.27.27-.4.63-.4,1.08,0,.4.11.72.32.96s.56.41,1.04.52l2.12.16c.45.08.79.27,1,.58.21.31.32.81.32,1.5v22.75c0,.85-.12,1.47-.36,1.84-.24.37-.6.65-1.08.84l-1.56.4c-.51.19-.88.42-1.12.7-.24.28-.36.63-.36,1.06,0,.51.18.91.54,1.22.36.31.93.46,1.7.46h15.71c.77,0,1.35-.15,1.72-.46.37-.31.56-.71.56-1.22,0-.43-.13-.79-.38-1.08s-.65-.52-1.18-.68Z"/><path d="M242.86,10.99c1.29,1.09,3.02,1.64,5.18,1.64s3.89-.55,5.2-1.64c1.31-1.09,1.96-2.54,1.96-4.36s-.65-3.22-1.96-4.3-3.04-1.62-5.2-1.62-3.88.54-5.18,1.62c-1.29,1.08-1.94,2.51-1.94,4.3s.65,3.26,1.94,4.36Z"/><path d="M297.4,44.05c-.32,0-.62.09-.9.28-.28.19-.66.55-1.14,1.08-.99,1.68-2.33,2.98-4.04,3.9-1.71.92-3.69,1.38-5.96,1.38-2.56,0-4.84-.59-6.84-1.78-2-1.19-3.56-2.92-4.7-5.22-1.13-2.29-1.7-5.12-1.7-8.47,0-2.64.39-4.9,1.16-6.78.77-1.88,1.83-3.32,3.16-4.32,1.33-1,2.84-1.5,4.52-1.5,1.92,0,3.44.55,4.56,1.66,1.12,1.11,1.68,2.57,1.68,4.38v1.24c0,1.52.45,2.75,1.36,3.7.91.95,2.21,1.42,3.92,1.42s3.21-.52,4.28-1.56c1.07-1.04,1.6-2.3,1.6-3.8,0-2.03-.65-3.88-1.94-5.56-1.29-1.68-3.12-3.02-5.5-4.02-2.37-1-5.18-1.5-8.43-1.5-4.18,0-7.82.91-10.89,2.72-3.08,1.81-5.46,4.28-7.16,7.42-1.69,3.13-2.54,6.67-2.54,10.61s.85,7.19,2.56,10.05c1.71,2.87,4.05,5.09,7.04,6.68s6.41,2.38,10.27,2.38c3.22,0,6.08-.57,8.55-1.7,2.48-1.13,4.45-2.64,5.92-4.54,1.46-1.89,2.25-3.96,2.36-6.2.03-.56-.06-1.03-.26-1.4-.2-.37-.51-.56-.94-.56Z"/><path d="M366.21,19.97c-.39-.31-.93-.46-1.62-.46h-10.15c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.13.78.38,1.06.25.28.67.49,1.26.62l1.48.28c1.01.19,1.59.63,1.74,1.34s-.09,1.98-.7,3.82l-6.59,20.52-6.92-21.4c-.48-1.52-.66-2.59-.54-3.22.12-.62.51-.99,1.18-1.1l1.84-.28c.53-.08.92-.27,1.16-.56.24-.29.36-.65.36-1.08,0-1.15-.71-1.72-2.12-1.72h-16.43c-1.47,0-2.2.57-2.2,1.72,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.32.36c.45.11.82.31,1.1.6.28.29.58.89.9,1.8l.84,2.47-7.24,20.66-6.99-21.14c-.56-1.71-.76-2.84-.6-3.4s.69-.93,1.6-1.12l1.48-.28c.61-.13,1.05-.34,1.3-.62.25-.28.38-.63.38-1.06,0-.53-.19-.95-.58-1.26-.39-.31-.91-.46-1.58-.46h-17.11c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.28.36c.43.11.79.33,1.1.66s.62.99.94,1.98l10.23,29.14c.35.99.83,1.68,1.44,2.08.61.4,1.33.6,2.16.6h3.96c.72,0,1.4-.17,2.04-.5s1.15-.97,1.52-1.9l7.59-20.84,7,20.6c.32.93.8,1.61,1.44,2.02s1.36.62,2.16.62h3.8c.72,0,1.41-.17,2.08-.5.67-.33,1.16-.97,1.48-1.9l9.43-27.74c.53-1.54.99-2.64,1.38-3.28.39-.64.82-1.03,1.3-1.16l1.24-.28c.64-.16,1.07-.38,1.28-.66.21-.28.32-.62.32-1.02,0-.53-.19-.95-.58-1.26Z"/><path d="M402.48,37.08c.83-.79,1.24-1.9,1.24-3.34,0-2.96-.67-5.58-2-7.85-1.33-2.28-3.26-4.06-5.8-5.36-2.53-1.29-5.58-1.94-9.15-1.94-4.18,0-7.79.89-10.81,2.66-3.03,1.77-5.35,4.21-6.98,7.32-1.63,3.1-2.44,6.7-2.44,10.77,0,3.84.85,7.19,2.56,10.05,1.71,2.87,4.06,5.09,7.05,6.68s6.43,2.38,10.29,2.38c3.3,0,6.23-.57,8.77-1.7,2.54-1.13,4.56-2.65,6.04-4.56,1.48-1.9,2.27-3.98,2.38-6.22.03-.56-.06-1.03-.26-1.42-.2-.39-.51-.58-.94-.58-.29,0-.59.09-.88.28-.29.19-.68.55-1.16,1.08-1.01,1.71-2.41,3.03-4.18,3.96s-3.83,1.4-6.18,1.4c-4,0-7.21-1.29-9.63-3.88-1.92-2.05-3.07-4.91-3.47-8.55h21.93c1.57,0,2.77-.39,3.6-1.18ZM390.29,35.14h-13.51c0-2.6.36-4.84,1.08-6.7.72-1.88,1.72-3.32,3-4.32,1.28-1,2.76-1.5,4.44-1.5,2.16,0,3.88.9,5.16,2.7s1.92,4.44,1.92,7.93c0,1.25-.69,1.88-2.08,1.88Z"/><path d="M447.94,50.77c-.24,0-.44.07-.6.2-.16.13-.32.29-.48.48-.21.27-.47.54-.76.82-.29.28-.73.42-1.32.42s-.99-.19-1.3-.56c-.31-.37-.46-.93-.46-1.68v-20.79c0-3.38-1.2-6.07-3.6-8.05s-6.05-2.98-10.95-2.98c-3.97,0-7.31.53-10.01,1.58-2.71,1.05-4.75,2.39-6.14,4.02-1.39,1.63-2.08,3.28-2.08,4.96,0,1.39.43,2.47,1.28,3.26s2.12,1.18,3.8,1.18c1.95,0,3.46-.43,4.54-1.3s1.62-2.11,1.62-3.74v-3.52c0-.96.43-1.78,1.28-2.46.85-.68,2.07-1.02,3.64-1.02,1.73,0,3.08.51,4.04,1.54.96,1.03,1.44,2.49,1.44,4.38v11.25c-.51-.15-1.04-.29-1.62-.41-1.4-.29-2.96-.44-4.7-.44-5.36,0-9.53,1.03-12.51,3.08-2.99,2.05-4.48,4.74-4.48,8.07,0,2.8,1.09,5.06,3.28,6.8,2.18,1.73,5.02,2.6,8.51,2.6,2.77,0,5.4-.57,7.87-1.7,1.76-.8,3.26-1.86,4.52-3.14.26,1.3.93,2.37,2.02,3.2,1.42,1.09,3.34,1.64,5.74,1.64,1.84,0,3.38-.34,4.64-1.02,1.25-.68,2.19-1.51,2.82-2.48.62-.97.94-1.91.94-2.82,0-.4-.08-.73-.24-.98-.16-.25-.4-.38-.72-.38ZM425.79,53.32c-1.68,0-3.05-.53-4.12-1.6s-1.6-2.58-1.6-4.56.63-3.56,1.88-4.7c1.25-1.13,2.98-1.7,5.2-1.7,1.09,0,2.11.12,3.06.36.56.14,1.11.33,1.66.54v9.39c-.58.49-1.22.91-1.92,1.26-1.33.67-2.72,1-4.16,1Z"/><path d="M491.07,19.97c-.39-.31-.93-.46-1.62-.46h-10.87c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.13.78.4,1.06.27.28.69.49,1.28.62l1.48.28c1.2.27,1.92.72,2.16,1.36s.05,1.77-.56,3.4l-8.17,21.61-8.38-21.61c-.61-1.62-.8-2.76-.56-3.4.24-.64.97-1.09,2.2-1.36l1.44-.28c.61-.13,1.04-.34,1.3-.62.25-.28.38-.63.38-1.06,0-1.15-.72-1.72-2.16-1.72h-17.91c-.67,0-1.19.15-1.58.46-.39.31-.58.73-.58,1.26,0,.43.11.78.32,1.06.21.28.57.5,1.08.66l1.28.36c.4.11.74.33,1.02.68.28.35.63,1.04,1.06,2.08l11.75,29.06c.37.91.86,1.57,1.46,2,.6.43,1.31.64,2.14.64h4.08c.75,0,1.43-.16,2.06-.48.62-.32,1.12-.96,1.5-1.92l11.03-27.74c.61-1.54,1.12-2.64,1.54-3.28.41-.64.86-1.03,1.34-1.16l1.24-.28c.64-.16,1.07-.38,1.28-.66.21-.28.32-.62.32-1.02,0-.53-.19-.95-.58-1.26Z"/><path d="M527.3,43.97c-.29,0-.59.09-.88.28-.29.19-.68.55-1.16,1.08-1.01,1.71-2.41,3.03-4.18,3.96s-3.83,1.4-6.18,1.4c-4,0-7.21-1.29-9.63-3.88-1.92-2.05-3.07-4.91-3.47-8.55h21.93c1.57,0,2.77-.39,3.6-1.18s1.24-1.9,1.24-3.34c0-2.96-.67-5.58-2-7.85-1.33-2.28-3.26-4.06-5.8-5.36-2.53-1.29-5.58-1.94-9.15-1.94-4.18,0-7.79.89-10.81,2.66-3.03,1.77-5.35,4.21-6.98,7.32-1.63,3.1-2.44,6.7-2.44,10.77,0,3.84.85,7.19,2.56,10.05,1.71,2.87,4.06,5.09,7.05,6.68s6.43,2.38,10.29,2.38c3.3,0,6.23-.57,8.77-1.7,2.54-1.13,4.56-2.65,6.04-4.56,1.48-1.9,2.27-3.98,2.38-6.22.03-.56-.06-1.03-.26-1.42-.2-.39-.51-.58-.94-.58ZM505.72,24.12c1.28-1,2.76-1.5,4.44-1.5,2.16,0,3.88.9,5.16,2.7s1.92,4.44,1.92,7.93c0,1.25-.69,1.88-2.08,1.88h-13.51c0-2.6.36-4.84,1.08-6.7.72-1.88,1.72-3.32,3-4.32Z"/></g></svg>';
    var ICON = '<svg viewBox="0 0 66.73 66.73" aria-hidden="true"><path fill="#9085bf" d="M28.98,1.78v31h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#9085bf" d="M14.15,56.54h14.83v8.41c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-8.41Z"/><path fill="#f05b40" d="M1.78,14.15h7.41v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78Z"/><path fill="#0f9e8a" d="M32.78,37.74v14.83H1.78c-.98,0-1.78-.8-1.78-1.78v-11.27c0-.98.8-1.78,1.78-1.78h31Z"/><path fill="#0f9e8a" d="M66.73,39.52v11.27c0,.98-.8,1.78-1.78,1.78h-7.41v-14.83h7.41c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M52.57,1.78v7.41h-14.83V1.78c0-.98.8-1.78,1.78-1.78h11.27c.98,0,1.78.8,1.78,1.78Z"/><path fill="#4861ad" d="M37.74,33.95h14.83v31c0,.98-.8,1.78-1.78,1.78h-11.27c-.98,0-1.78-.8-1.78-1.78v-31Z"/><path fill="#f05b40" d="M66.73,15.94v11.27c0,.98-.8,1.78-1.78,1.78h-31v-14.83h31c.98,0,1.78.8,1.78,1.78Z"/></svg>';
    // the site's typefaces, loaded once, only when a Topicweave scene is built; a scene measured before Fraunces
    // arrived rebuilds itself once (fonts.check() reports true while the stylesheet itself is still loading)
    var FP = null, FONTS_OK = false;
    function fonts(sc){
      if (!FP) FP = new Promise(function(done){
        function res(){ FONTS_OK = true; done(); }
        var l = document.createElement('link'); l.id = 'tw-fonts'; l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..500,0..100&family=Inter+Tight:wght@300;400;500;600&display=swap';
        l.onload = function(){ (document.fonts ? Promise.all([document.fonts.load('350 24px "Fraunces"'), document.fonts.load('400 12px "Inter Tight"')]) : Promise.resolve()).then(res, res); };
        l.onerror = function(){ res(); };
        document.head.appendChild(l);
        setTimeout(res, 5000);
      });
      if (sc && !sc._tf && !FONTS_OK){ sc._tf = true; FP.then(function(){ if (K.rebuild) K.rebuild(sc); }); }
    }
    // a browser bar in the site's look (black glass, the mark, the url)
    function bar(url){ return '<div class="tw-bar"><i></i><i></i><i></i><span>' + ICON + esc(url) + '</span></div>'; }
    // images shipped in this repo (code/vendor/topicweave/), same tag as the bundle
    function asset(name){ return VENDOR + 'topicweave/' + name; }
    function c01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(v){ return 1 - Math.pow(1 - v, 3); }

    /* ---------- the thread cloth ---------- */
    // weave(host, { mode: 'radial'|'band', cover: '#000', grid: 15, len: 11, durIn: .5, durOut: .75, from: 'left'|'right' })
    // returns fn(open, [x, y]) + fn.destroy(); the canvas fills the host (position it with CSS: .tw-weave)
    function weave(host, o){
      o = o || {};
      var cv = document.createElement('canvas'); cv.className = 'tw-weave' + (o.cls ? ' ' + o.cls : ''); cv.setAttribute('aria-hidden', 'true');
      host.appendChild(cv);
      var ctx = cv.getContext('2d'), radial = o.mode !== 'band', cells = [], w = 0, h = 0, dpr = 1, gsz = o.grid || 15, len = o.len || 11;
      var P = 0, target = 0, raf = 0, last = 0, t0 = 0, ox = 0, oy = 0, PS = null, TILE = null, dead = false, onDone = null;
      var cover = o.cover || C.void, durIn = o.durIn || .5, durOut = o.durOut || .75;
      function size(){
        w = cv.clientWidth; h = cv.clientHeight; if (!w || !h) return false;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
        cells = [];
        for (var r = 0; r * gsz < h + gsz; r++) for (var c = 0; c * gsz < w + gsz; c++){
          var vert = ((c >> 1) + (r >> 1)) & 1, x = c * gsz + gsz / 2, y = r * gsz + gsz / 2, j = ((c * 37 + r * 91) % 100) / 100, d, ux, uy;
          if (radial){
            var dx = x - ox, dy = y - oy, L = Math.sqrt(dx * dx + dy * dy) || 1, far = Math.sqrt(Math.pow(Math.max(ox, w - ox), 2) + Math.pow(Math.max(oy, h - oy), 2)) || 1;
            d = (L / far) * .62 + ((c * 7 + r * 13) % 10) / 10 * .08; ux = dx / L; uy = dy / L;
          } else {
            var fx = o.from === 'right' ? 1 - x / Math.max(1, w) : x / Math.max(1, w);
            d = fx * .55 + j * .25; ux = o.from === 'right' ? 1 : -1; uy = (j - .5) * .45;
          }
          cells.push({ x: x, y: y, c: c, r: r, vert: vert, col: WEAVE[(vert ? c : r) % 4], d: d, j: j, ux: ux, uy: uy, over: ((c + r) & 1) === (vert ? 0 : 1) });
        }
        PS = new Float32Array(cells.length); TILE = null;
        return true;
      }
      // the settled cloth repeats every 4 cells: one tile, drawn once, filled across every settled cell in one call
      function tile(){
        var key = cover + gsz + dpr; if (TILE && TILE.k === key) return TILE.pat;
        var tc = document.createElement('canvas'), T4 = gsz * 4; tc.width = tc.height = Math.round(T4 * dpr);
        var tx = tc.getContext('2d'); tx.setTransform(dpr, 0, 0, dpr, 0, 0); tx.fillStyle = cover; tx.fillRect(0, 0, T4, T4); tx.lineCap = 'round'; tx.lineWidth = 1.4;
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++){
          var vert = ((c >> 1) + (r >> 1)) & 1, over = ((c + r) & 1) === (vert ? 0 : 1), x = Math.round(c * gsz + gsz / 2) + .5, y = Math.round(r * gsz + gsz / 2) + .5;
          tx.globalAlpha = over ? .85 : .2; tx.strokeStyle = WEAVE[(vert ? c : r) % 4]; tx.beginPath();
          if (vert){ tx.moveTo(x, y - len / 2); tx.lineTo(x, y + len / 2); } else { tx.moveTo(x - len / 2, y); tx.lineTo(x + len / 2, y); }
          tx.stroke();
        }
        var pat = ctx.createPattern(tc, 'repeat'); if (pat.setTransform && window.DOMMatrix) pat.setTransform(new DOMMatrix().scale(1 / dpr));
        TILE = { k: key, pat: pat }; return pat;
      }
      function line(k, x, y, a, alpha){
        var ex = Math.cos(a) * len / 2, ey = Math.sin(a) * len / 2;
        ctx.globalAlpha = alpha; ctx.strokeStyle = k.col; ctx.beginPath(); ctx.moveTo(x - ex, y - ey); ctx.lineTo(x + ex, y + ey); ctx.stroke();
      }
      function draw(now){
        if (dead) return;
        var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
        if (radial) P = target ? Math.min(1, P + Math.min(dt, .034) / durIn) : Math.max(0, P - Math.min(dt, .034) / durOut);
        else { P += (target - P) * Math.min(1, dt * (target ? 2.6 : 6)); if (Math.abs(target - P) < .002) P = target; }
        var T = (now - t0) / 1000, n, k, p;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.lineCap = 'round'; ctx.lineWidth = 1.4;
        if (radial){
          // first the cover, one square per cell (solid once its threads are mostly in), then the threads on top
          ctx.fillStyle = cover;
          for (n = 0; n < cells.length; n++){
            k = cells[n];
            p = ease(c01(target ? (P * 1.6 - k.d) / .9 : (P * 1.6 - (.7 - k.d)) / .9)); PS[n] = p;
            if (p <= 0 || p * 1.7 >= 1) continue;
            ctx.globalAlpha = p * 1.7; ctx.fillRect(k.c * gsz - .5, k.r * gsz - .5, gsz + 1, gsz + 1);
          }
          ctx.globalAlpha = 1; ctx.beginPath();
          for (n = 0; n < cells.length; n++){ if (PS[n] * 1.7 >= 1 && PS[n] < .999){ k = cells[n]; ctx.rect(k.c * gsz - .5, k.r * gsz - .5, gsz + 1, gsz + 1); } }
          ctx.fillStyle = cover; ctx.fill();
          ctx.beginPath();
          for (n = 0; n < cells.length; n++){ if (PS[n] >= .999){ k = cells[n]; ctx.rect(k.c * gsz, k.r * gsz, gsz, gsz); } }
          ctx.fillStyle = tile(); ctx.fill();
          for (n = 0; n < cells.length; n++){
            p = PS[n]; if (p <= 0 || p >= .999) continue; k = cells[n];
            var fly = (1 - p) * (target ? -(40 + k.j * 50) : 70 + k.j * 90);
            line(k, Math.round(k.x + k.ux * fly) + .5, Math.round(k.y + k.uy * fly) + .5, (k.vert ? Math.PI / 2 : 0) * (target ? p : 1), p * (k.over ? .85 : .2));
          }
        } else {
          // a slow wave runs through the cloth and the thread on top brightens as it passes
          for (n = 0; n < cells.length; n++){
            k = cells[n]; p = ease(c01((P * 1.7 - k.d) / .7)); if (p <= 0) continue;
            var wv = K.reduce ? 0 : Math.sin(k.c * .45 - k.r * .3 + T * 1.3);
            var x = k.x + (k.vert ? wv * 1.2 : 0) - k.ux * (1 - p) * (90 + k.j * 140), y = k.y + (k.vert ? 0 : wv * 1.2) + (1 - p) * (k.j - .5) * 40;
            line(k, x, y, (k.vert ? Math.PI / 2 : 0) * p, p * (k.over ? .8 + .2 * wv : .14));
          }
        }
        ctx.globalAlpha = 1;
        var settled = P === target;
        raf = 0;
        if (settled && onDone){ var f = onDone; onDone = null; f(); settled = P === target; if (raf) return; }
        // a band keeps its wave running while woven and on screen; everything else stops once it settles
        raf = !settled || (!radial && target && !K.reduce && o.live !== false && seen) ? requestAnimationFrame(draw) : 0;
      }
      var seen = true;
      if (!radial && window.IntersectionObserver) new IntersectionObserver(function(es){
        seen = es[0].isIntersecting; if (seen && target && !raf && !dead){ last = 0; raf = requestAnimationFrame(draw); }
      }).observe(cv);
      function fn(open, at, done){
        if (dead) return;
        target = open ? 1 : 0; onDone = done || null;
        if (at){ ox = at[0]; oy = at[1]; }
        if (open || !cells.length){ if (!size()) { if (done) done(); return; } }
        if (!t0) t0 = window.performance ? performance.now() : Date.now();
        if (!raf){ last = 0; raf = requestAnimationFrame(draw); }
      }
      // jump to a settled state (no motion), e.g. under reduced motion
      fn.set = function(open){ if (dead) return; target = P = open ? 1 : 0; if (!cells.length && !size()) return; last = 0; if (!raf) raf = requestAnimationFrame(draw); };
      fn.canvas = cv;
      fn.destroy = function(){ dead = true; if (raf) cancelAnimationFrame(raf); if (cv.parentNode) cv.parentNode.removeChild(cv); };
      return fn;
    }

    K.tw = { C: C, WEAVE: WEAVE, LOGO: LOGO, ICON: ICON, fonts: fonts, bar: bar, asset: asset, weave: weave, c01: c01, ease: ease };
  })();

  /* ===== mission/24-tw-app.js ===== */
  /* =========================================================
     TOPICWEAVE · THE APP (channel tw-app): the dashboard prototype (cks-v3/app/index.html) as a coded scene
       Overview : the site's numbers count up, the topic list fills in
       Topics   : one topic opens in the drawer with the pages tied to it
       Map      : the knowledge map's nodes and threads draw in; a topic lights its threads
       Health   : a suggestion card for a topic with nothing behind it yet
     Hover or tap a topic (Overview list, Topics table, map node) to light it: that holds the loop, the play
     button hands it back. The nav items switch views too. Landscape: sidebar; portrait: top bar + nav strip.
     Sample data is the prototype's own (app/data.js, app/data-more.js) and the interface says so.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';

    var IC = {
      overview: '<path d="M3 13h4v4H3zM8 8h4v9H8zM13 3h4v14h-4z"/>',
      topics: '<circle cx="10" cy="10" r="2.5"/><circle cx="4" cy="5" r="1.6"/><circle cx="16" cy="5" r="1.6"/><circle cx="4" cy="15" r="1.6"/><circle cx="16" cy="15" r="1.6"/><path d="M5.3 6l3 2.6M14.7 6l-3 2.6M5.3 14l3-2.6M14.7 14l-3-2.6"/>',
      health: '<path d="M10 17s-6-3.6-6-8.3A3.4 3.4 0 0 1 10 6.6a3.4 3.4 0 0 1 6 2.1C16 13.4 10 17 10 17z"/>',
      ideas: '<path d="M7 16h6M8 18.5h4M10 2.5a5.5 5.5 0 0 0-3.2 10c.5.4.7 1 .7 1.5h5c0-.5.2-1.1.7-1.5A5.5 5.5 0 0 0 10 2.5z"/>',
      ai: '<path d="M10 2.5l1.8 4.7 4.7 1.8-4.7 1.8L10 15.5l-1.8-4.7L3.5 9l4.7-1.8z"/>',
      review: '<rect x="3" y="3" width="14" height="14" rx="3"/><path d="M6.5 10l2.3 2.3L13.5 7.6"/>',
      changes: '<path d="M4 7h9M10 4l3 3-3 3M16 13H7M10 10l-3 3 3 3"/>',
      inbox: '<path d="M3 11l2.2-6.5h9.6L17 11v5H3z"/><path d="M3 11h4l1 2h4l1-2h4"/>',
      map: '<circle cx="5" cy="6" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="10" cy="15" r="2"/><path d="M6.8 6.6l6.4-1.2M6 7.8l3 5.4M14 6.8l-3 6.4"/>',
      machine: '<rect x="3" y="4" width="14" height="12" rx="2"/><path d="M7 8l-2 2 2 2M13 8l2 2-2 2M11 7.5l-2 5"/>',
      reports: '<path d="M5 2.5h7l3 3v12H5z"/><path d="M8 10h4M8 13h4M8 7h2"/>',
      conn: '<path d="M8 12l4-4M6.5 9.5l-2 2a2.8 2.8 0 0 0 4 4l2-2M13.5 10.5l2-2a2.8 2.8 0 0 0-4-4l-2 2"/>'
    };
    function icon(k){ return '<svg viewBox="0 0 20 20" aria-hidden="true">' + IC[k] + '</svg>'; }
    // [route or '', label, icon, count, shown in the portrait strip]; a label with no icon is a group heading
    var NAV = [['overview', 'Overview', 'overview', '', 1], ['topics', 'Topics', 'topics', '', 1], ['health', 'Link health', 'health', '7', 1], ['', 'Search ideas', 'ideas', '5', 1], ['', 'AI visibility', 'ai'],
      ['', 'Content'], ['', 'Review queue', 'review', '2'], ['', 'Changes', 'changes'], ['', 'Capture inbox', 'inbox', '5'],
      ['', 'Publish'], ['map', 'Knowledge map', 'map', '', 1], ['', 'For machines', 'machine'],
      ['', 'Setup'], ['', 'Reports', 'reports'], ['', 'Connections', 'conn']];

    /* sample data: app/data.js + app/data-more.js (every number there is made up for the demo) */
    var KPI = [['Search impressions', 'Search Console', 14750, '', '+27%', 'vs the 28 days before'], ['Search clicks', 'Search Console', 568, '', '+19%', 'vs the 28 days before'],
      ['Visits from AI assistants', 'Topicweave pixel', 61, '', '+41%', 'ChatGPT, Perplexity, Claude, Gemini'], ['Assistant mentions', 'Assistant checks', 4, ' of 12', '+2 since August', 'questions where you were named'],
      ['Link health', 'Topicweave', 82, '', '+6 this month', 'out of 100']];
    var TOP = [
      { n: 'Client onboarding', cat: 'Ideas', c: '#9B87F5', pg: 7, pr: 2, ai: 2, imp: [420, 510, 640, 780, 930, 1240], st: 'ok', stt: 'Healthy',
        pc: ['Onboarding is a design problem', 'The first 30 days decide the next three years', 'Riverside Clinic intake (project)', 'Hale & Partners onboarding (project)'] },
      { n: 'Journey mapping', cat: 'How it works', c: '#139E8A', pg: 5, pr: 3, ai: 1, imp: [380, 400, 450, 520, 610, 780], st: 'ok', stt: 'Healthy',
        pc: ['What a journey map is really for (video)', 'Riverside Clinic intake (project)', 'Northgate client portal (project)'] },
      { n: 'Client handoffs', cat: 'What you watch for', c: '#EF5B3F', pg: 3, pr: 0, ai: 0, imp: [120, 150, 190, 260, 380, 610], st: 'gap', stt: 'No project proves it',
        pc: ['Why handoffs fail on Friday afternoons', 'Every complaint starts at a handoff'] },
      { n: 'Service design', cat: 'Services · Known for', c: '#4F7BFF', pg: 6, pr: 3, ai: 1, imp: [510, 520, 560, 570, 600, 620], st: 'ok', stt: 'Healthy',
        pc: ['Service design sprint (service)', 'Northgate client portal (project)'] },
      { n: 'Professional firms', cat: 'Who you help', c: '#B18CFF', pg: 4, pr: 2, ai: 0, imp: [200, 230, 250, 270, 300, 330], st: 'ok', stt: 'Healthy',
        pc: ['Hale & Partners onboarding (project)'] },
      { n: 'Plain-language UX', cat: 'Known for', c: '#9AA3AD', pg: 2, pr: 1, ai: 0, imp: [260, 250, 240, 235, 225, 215], st: 'gap', stt: 'Going quiet',
        pc: ['The form we rewrote eleven times'] },
      { n: 'Accessibility', cat: 'What you watch for', c: '#36C28F', pg: 1, pr: 0, ai: 0, imp: [40, 45, 60, 55, 70, 80], st: 'bad', stt: 'No definition', pc: [] }
    ];
    var INS = [['#EF5B3F', 'Client handoffs is your fastest-growing topic (+64%), but no project proves it yet.', 'Riverside Clinic intake mentions handoffs three times. Tag it?', 'Review tag'],
      ['#9B87F5', 'Claude named you for “Who designs client onboarding for professional firms?”', 'First mention for this question. Quote saved to the assistant log.', 'See the answer'],
      ['#4F7BFF', '5 searches bring people to your site that no topic covers yet.', 'Top one: “what is a service blueprint”, 260 impressions.', 'See ideas']];
    // knowledge map (mapNodes): the first six topics, and pieces with the topics they're tagged with
    var MP = [['Onboarding is a design problem', [0, 3]], ['The first 30 days', [0]], ['What a journey map is for', [1]], ['Riverside Clinic intake', [0, 1, 2]], ['Hale & Partners', [0, 4]],
      ['Northgate client portal', [3, 1]], ['Why handoffs fail', [2]], ['The form we rewrote', [5, 0]], ['Service design sprint', [3]], ['Do you work with small firms?', [4]]];
    var MW = 720, MH = 440, MT = 6, MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    var FOCUS = 0, OPEN = 0; // the loop opens and lights Client onboarding (most pages tied to it)

    function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function delta(a){ return Math.round((a[a.length - 1] / a[a.length - 2] - 1) * 100); }
    function pct(n){ return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) + '%'; }
    function spark(v, c){
      var w = 84, h = 24, mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      var d = v.map(function(x, i){ return (i ? 'L' : 'M') + (i / (v.length - 1) * w).toFixed(1) + ' ' + (h - 3 - (x - mn) / (mx - mn || 1) * (h - 6)).toFixed(1); }).join(' ');
      return '<svg class="tw-a-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path d="' + d + '" stroke="' + c + '"/></svg>';
    }
    function lineD(v, w, h, max){
      return v.map(function(x, i){ return (i ? 'L' : 'M') + (8 + i / (v.length - 1) * (w - 16)).toFixed(1) + ' ' + (h - 18 - x / max * (h - 30)).toFixed(1); }).join(' ');
    }
    function tPos(k){ var a = -Math.PI / 2 + k / MT * Math.PI * 2; return [MW / 2 + Math.cos(a) * 120, MH / 2 + Math.sin(a) * 110]; }
    function pPos(k){ var a = -Math.PI / 2 + (k + .5) / MP.length * Math.PI * 2; return [MW / 2 + Math.cos(a) * 290, MH / 2 + Math.sin(a) * 190]; }
    function tiedTo(t){ return MP.filter(function(p){ return p[1].indexOf(t) > -1; }).length; }

    SCENE.add('tw-app', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      function head(h, s, tools){ return '<header class="tw-a-top"><div><h1>' + h + '</h1><p>' + s + '</p></div><div class="tw-a-tools">' + (tools || '') + '<span class="tw-a-note">Sample data</span></div></header>'; }
      var seg = '<span class="tw-a-seg"><i>7 days</i><i class="on">28 days</i><i>6 months</i></span>';

      var side = '<aside class="tw-a-side"><div class="tw-a-brand">' + T.LOGO + '<span>App</span></div>' +
        '<div class="tw-a-site"><i></i><span><b>Example Studio</b><small>yoursite.com · Webflow</small></span></div><nav class="tw-a-nav">' +
        NAV.map(function(n){
          if (!n[2]) return '<p class="tw-a-grp">' + esc(n[1]) + '</p>';
          return '<button type="button" class="tw-a-ni' + (n[0] ? ' is-r' : '') + (n[4] ? ' is-p' : '') + '"' + (n[0] ? ' data-r="' + n[0] + '"' : ' tabindex="-1"') + '>' + icon(n[2]) + '<span>' + esc(n[1]) + '</span>' + (n[3] ? '<em>' + n[3] + '</em>' : '') + '</button>';
        }).join('') + '</nav><div class="tw-a-foot">Prototype · sample data</div></aside>';

      var vOv = '<section class="tw-a-v" data-v="overview">' + head('Good morning. Here’s what moved.', 'yoursite.com · Last 28 days. Every number is grouped by your own vocabulary.', seg) +
        '<div class="tw-a-kpis">' + KPI.map(function(k){ return '<div class="tw-a-card tw-a-kpi"><div class="tw-a-kl">' + esc(k[0]) + '<small>' + esc(k[1]) + '</small></div><b data-to="' + k[2] + '" data-suf="' + k[3] + '">' + fmt(k[2]) + k[3] + '</b><div class="tw-a-up">' + esc(k[4]) + '<span> · ' + esc(k[5]) + '</span></div></div>'; }).join('') + '</div>' +
        '<div class="tw-a-row2"><div class="tw-a-card tw-a-tlist"><div class="tw-a-ch"><h2>Your topics</h2><small>Impressions by topic · Search Console</small></div>' +
          TOP.map(function(t, i){ var d = delta(t.imp); return '<div class="tw-a-trow" data-i="' + i + '" style="--c:' + t.c + '"><i></i><span><b>' + esc(t.n) + '</b><small>' + esc(t.cat) + '</small></span>' + spark(t.imp, t.c) + '<span class="tw-a-num">' + fmt(t.imp[5]) + '</span><span class="' + (d < 0 ? 'tw-a-dn' : 'tw-a-up') + '">' + pct(d) + '</span></div>'; }).join('') +
        '</div><div class="tw-a-card tw-a-ins"><div class="tw-a-ch"><h2>What changed</h2><small>Written for you, not a chart</small></div>' +
          INS.map(function(n){ return '<div class="tw-a-in"><i style="background:' + n[0] + '"></i><div><p>' + esc(n[1]) + '</p><small>' + esc(n[2]) + '</small><em>' + esc(n[3]) + ' →</em></div></div>'; }).join('') +
        '</div></div></section>';

      var vTp = '<section class="tw-a-v" data-v="topics">' + head('Topics', 'Your vocabulary, with the proof and the traffic behind each term. Click a topic for its pages.', seg) +
        '<div class="tw-a-card tw-a-tbl"><div class="tw-a-th"><span>Topic</span><span class="tw-a-cat">Category</span><span class="tw-a-num">Pieces</span><span class="tw-a-num tw-a-pr">Projects</span><span class="tw-a-num">Impressions</span><span>6 months</span><span class="tw-a-stc">Status</span></div>' +
          TOP.map(function(t, i){ return '<div class="tw-a-tr" data-i="' + i + '" style="--c:' + t.c + '"><span class="tw-a-tn"><i></i>' + esc(t.n) + '</span><span class="tw-a-cat">' + esc(t.cat) + '</span><span class="tw-a-num">' + t.pg + '</span><span class="tw-a-num tw-a-pr' + (t.pr ? '' : ' tw-a-dn') + '">' + t.pr + '</span><span class="tw-a-num">' + fmt(t.imp[5]) + '</span>' + spark(t.imp, t.c) + '<span class="tw-a-stc"><em class="tw-a-pill is-' + t.st + '">' + esc(t.stt) + '</em></span></div>'; }).join('') +
        '</div><aside class="tw-a-drawer"><p class="tw-a-lab"></p><h3></h3><p class="tw-a-meta"></p>' +
          '<svg class="tw-a-dchart" viewBox="0 0 360 120" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path class="tw-a-grid" d="M8 30H352M8 66H352M8 102H352"/><path class="tw-a-dl" pathLength="1" d=""/>' + MONTHS.map(function(m, i){ return '<text x="' + (8 + i / 5 * 344) + '" y="117" text-anchor="' + (i ? i === 5 ? 'end' : 'middle' : 'start') + '">' + m + '</text>'; }).join('') + '</svg>' +
          '<p class="tw-a-lab">Pages tied to it</p><ul class="tw-a-pcs"><li></li><li></li><li></li><li></li></ul><p class="tw-a-none">Nothing tagged yet.</p>' +
          '<div class="tw-a-dact"><em class="tw-a-pill"></em><button type="button" class="tw-a-tomap">Show on the map →</button></div></aside></section>';

      var lines = '', nodes = '';
      MP.forEach(function(p, k){ var a = pPos(k); nodes += '<g class="tw-a-mn is-pc" data-p="' + k + '" tabindex="-1"><circle cx="' + a[0] + '" cy="' + a[1] + '" r="6"/><text x="' + a[0] + '" y="' + (a[1] + (a[1] > MH / 2 ? 21 : -13)) + '" text-anchor="middle">' + esc(p[0]) + '</text></g>'; });
      TOP.slice(0, MT).forEach(function(t, k){ var a = tPos(k); nodes += '<g class="tw-a-mn is-t" data-t="' + k + '" tabindex="-1"><circle cx="' + a[0] + '" cy="' + a[1] + '" r="14" fill="' + t.c + '"/><circle class="tw-a-halo" cx="' + a[0] + '" cy="' + a[1] + '" r="22" stroke="' + t.c + '"/><text x="' + a[0] + '" y="' + (a[1] + 32) + '" text-anchor="middle">' + esc(t.n) + '</text></g>'; });
      var vMap = '<section class="tw-a-v" data-v="map">' + head('Knowledge map', 'An explorable map of your topics and the work that proves them, for your own site’s hub page. It updates itself on publish.') +
        '<div class="tw-a-row2 tw-a-mrow"><div class="tw-a-card tw-a-mcard"><div class="tw-a-ch"><h2>Preview</h2><small>Hover a topic to follow its threads</small></div>' +
          '<div class="tw-a-mapw"><svg class="tw-a-map" viewBox="0 0 ' + MW + ' ' + MH + '" aria-label="Knowledge map preview, sample data"><g class="tw-a-mls"></g>' + nodes + '</svg></div><p class="tw-a-ro"></p></div>' +
        '<div class="tw-a-card tw-a-emb"><div class="tw-a-ch"><h2>Embed it</h2><small>One line, or a CMS component</small></div><pre>&lt;div data-topicweave-map="yoursite"&gt;&lt;/div&gt;</pre>' +
          '<div class="tw-a-li"><b>Where it shows</b><small>The hub page (/topics) and, smaller, on each topic page</small></div><div class="tw-a-li"><b>What visitors can do</b><small>Hover a topic to light up its proof; click to open the page</small></div>' +
          '<div class="tw-a-li"><b>Links stay real</b><small>The map is decoration on top of the CMS links, never a replacement for them</small></div></div></div></section>';

      var RC = 2 * Math.PI * 64;
      var vHl = '<section class="tw-a-v" data-v="health">' + head('Link health', 'What Topicweave checks every night: proof, tags, links, definitions and structured data. Fixes are suggestions; you confirm each one.') +
        '<div class="tw-a-hrow"><div class="tw-a-card tw-a-score"><div class="tw-a-ring"><svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="64"/><circle class="tw-a-arc" cx="75" cy="75" r="64" style="stroke-dasharray:' + RC.toFixed(1) + '"/></svg><b>82</b><small>of 100</small></div>' +
          '<div><h2>Up 6 this month.</h2><p>Tagging two pieces and linking two orphan pages would take it past 90.</p></div></div>' +
        '<div class="tw-a-card tw-a-how"><div class="tw-a-ch"><h2>How the score works</h2><small>Weights, so it’s never a mystery</small></div>' +
          '<div class="tw-a-in"><i style="background:#36C28F"></i><div><p>Proof, 35%</p><small>Every topic has at least one project and one piece of writing.</small></div></div>' +
          '<div class="tw-a-in"><i style="background:#4F7BFF"></i><div><p>Connections, 35%</p><small>Every piece is tagged; every page is linked from somewhere.</small></div></div>' +
          '<div class="tw-a-in"><i style="background:#9B87F5"></i><div><p>Machine-readable, 30%</p><small>Definitions filled in and structured data valid on every template.</small></div></div></div></div>' +
        '<div class="tw-a-card tw-a-sug"><div class="tw-a-sl"><span class="tw-a-lab">Suggestion</span><em class="tw-a-pill is-bad">Topics with no proof · 2</em></div>' +
          '<h2>Accessibility is a topic with nothing behind it yet.</h2><p>No project mentions it, and its topic page has no definition. The definition is the page: without it the topic page stays hidden.</p>' +
          '<div class="tw-a-sact"><button type="button" class="tw-a-go">Draft definition</button><button type="button" class="tw-a-ghost">Not now</button><small>Drafted from your Voice Kit. You approve it before anything publishes.</small></div></div></section>';

      st.innerHTML = '<div class="tw-a-bg"></div><div class="tw-a-bar"><i></i><i></i><i></i><span class="tw-a-url">' + T.ICON + '<b>topicweave.com/app/#overview</b></span><span class="tw-a-proto">Prototype · sample data</span></div>' + side +
        '<main class="tw-a-main">' + vOv + vTp + vMap + vHl + '<div class="tw-a-toast" role="status"></div></main>' + X.cursor('a tw-a-cur', 'You') + '<div class="fg-fade"></div>';

      var views = qa(st, '.tw-a-v'), navs = qa(st, '.tw-a-ni.is-r'), url = q(st, '.tw-a-url b'), cur = q(st, '.tw-a-cur'), toast = q(st, '.tw-a-toast');
      var kpis = qa(st, '.tw-a-kpi'), kNums = qa(st, '.tw-a-kpi b'), tRows = qa(st, '.tw-a-trow'), ins = qa(q(st, '.tw-a-ins'), '.tw-a-in');
      var trs = qa(st, '.tw-a-tr'), drawer = q(st, '.tw-a-drawer'), dLine = q(drawer, '.tw-a-dl'), dLis = qa(drawer, '.tw-a-pcs li');
      var mapW = q(st, '.tw-a-mapw'), mapSvg = q(st, '.tw-a-map'), mls = q(st, '.tw-a-mls'), ro = q(st, '.tw-a-ro');
      var mT = qa(st, '.tw-a-mn.is-t'), mPc = qa(st, '.tw-a-mn.is-pc'), arc = q(st, '.tw-a-arc'), score = q(st, '.tw-a-ring b');
      var sug = q(st, '.tw-a-sug'), goB = q(st, '.tw-a-go');
      var ML = [];
      MP.forEach(function(p, k){ var a = pPos(k); p[1].forEach(function(t){ var b = tPos(t), l = X.path(mls, 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), 'tw-a-ml'); l.setAttribute('stroke', TOP[t].c); l.setAttribute('data-t', t); l.setAttribute('data-p', k); ML.push(l); }); });

      /* state */
      function show(r){
        views.forEach(function(v){ v.classList.toggle('on', v.getAttribute('data-v') === r); });
        navs.forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-r') === r); });
        url.textContent = 'topicweave.com/app/#' + r;
      }
      function fill(i){
        var t = TOP[i], max = Math.max.apply(null, t.imp) * 1.1;
        var ps = qa(drawer, 'p.tw-a-lab'); ps[0].textContent = t.cat;
        q(drawer, 'h3').textContent = t.n;
        q(drawer, '.tw-a-meta').textContent = t.pg + ' pieces · ' + t.pr + ' projects · ' + fmt(t.imp[5]) + ' impressions this month · ' + t.ai + ' of 4 assistants';
        dLine.setAttribute('d', lineD(t.imp, 360, 120, max)); dLine.style.stroke = t.c;
        dLis.forEach(function(li, k){ li.textContent = t.pc[k] || ''; li.classList.toggle('is-x', !t.pc[k]); });
        q(drawer, '.tw-a-none').classList.toggle('on', !t.pc.length);
        var pill = q(drawer, '.tw-a-dact .tw-a-pill'); pill.className = 'tw-a-pill is-' + t.st; pill.textContent = t.stt;
        drawer.setAttribute('data-i', i);
        trs.forEach(function(r, k){ r.classList.toggle('on', k === i); });
      }
      function openD(on){ drawer.classList.toggle('on', on); if (!on) trs.forEach(function(r){ r.classList.remove('on'); }); }
      function rowLit(i){ tRows.forEach(function(r, k){ r.classList.toggle('on', k === i); }); }
      // light a topic (t) or a piece (p) on the map; -1 clears
      function focus(t, p){
        var on = t > -1 || p > -1;
        mapSvg.classList.toggle('is-focus', on);
        ML.forEach(function(l){ var hit = t > -1 ? +l.getAttribute('data-t') === t : +l.getAttribute('data-p') === p; l.classList.toggle('on', on && hit); if (on && hit) mls.appendChild(l); });
        mT.forEach(function(n, k){ n.classList.toggle('on', t > -1 ? k === t : p > -1 && MP[p][1].indexOf(k) > -1); });
        mPc.forEach(function(n, k){ n.classList.toggle('on', p > -1 ? k === p : t > -1 && MP[k][1].indexOf(t) > -1); });
        if (t > -1){ var c = tiedTo(t); ro.innerHTML = '<i style="background:' + TOP[t].c + '"></i><b>' + esc(TOP[t].n) + '</b> · ' + c + ' page' + (c === 1 ? '' : 's') + ' tied to it on the map'; }
        else if (p > -1) ro.innerHTML = '<i></i><b>' + esc(MP[p][0]) + '</b> · tagged with ' + MP[p][1].map(function(k){ return TOP[k].n; }).join(', ');
        else ro.innerHTML = '<i></i>Hover a topic to follow its threads';
      }
      // a topic with no node yet (Accessibility): the map says so instead of lighting anything
      function focusTopic(i){ if (i < MT) focus(i, -1); else { focus(-1, -1); ro.innerHTML = '<i style="background:' + TOP[i].c + '"></i><b>' + esc(TOP[i].n) + '</b> · nothing tied to it on the map yet'; } }
      function say(s){ toast.textContent = s; toast.classList.toggle('on', !!s); }
      function suggestDone(on){ goB.textContent = on ? 'Sent to review ✓' : 'Draft definition'; goB.classList.toggle('is-done', on); }

      /* interaction: hover/tap a topic lights it and holds the loop; play hands it back (state replays to the playhead) */
      var dirty = false;
      function hold(){ dirty = true; if (sc.hold) sc.hold(); }
      function touch(e){ return e && e.pointerType === 'touch'; }
      // a real pointer move (not content sliding under a resting pointer, which fires enter events) takes over
      function hover(el, fn){
        var inside = false;
        el.addEventListener('pointerleave', function(){ inside = false; });
        el.addEventListener('pointermove', function(e){ if (inside || touch(e)) return; inside = true; hold(); fn(); });
      }
      function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
      tRows.forEach(function(r, i){
        hover(r, function(){ rowLit(i); });
        tap(r, function(){ hold(); rowLit(i); show('map'); focusTopic(i); });
      });
      trs.forEach(function(r, i){
        hover(r, function(){ fill(i); openD(true); });
        tap(r, function(){ hold(); fill(i); openD(true); });
      });
      tap(q(drawer, '.tw-a-tomap'), function(){ hold(); var i = +drawer.getAttribute('data-i'); openD(false); show('map'); focusTopic(i); });
      mT.forEach(function(n, k){
        hover(n, function(){ focus(k, -1); });
        tap(n, function(){ hold(); focus(k, -1); });
      });
      mPc.forEach(function(n, k){
        hover(n, function(){ focus(-1, k); });
        tap(n, function(){ hold(); focus(-1, k); });
      });
      navs.forEach(function(n){ tap(n, function(){ hold(); openD(false); show(n.getAttribute('data-r')); }); });
      tap(goB, function(){ hold(); suggestDone(true); say('Draft written from your Voice Kit and sent to Review'); });
      tap(q(st, '.tw-a-ghost'), function(){ hold(); say('Kept for later. It stays on the Link health list.'); });

      /* positions (unscaled stage) */
      var pos = X.pos;
      function navAt(r){ return pos(st, q(st, '.tw-a-ni[data-r="' + r + '"]'), P ? .5 : .3, .6); }
      function mapAt(k){ var o = pos(st, mapW, 0, 0), s = mapW.offsetWidth / MW, a = tPos(k); return { x: o.x + a[0] * s + 10, y: o.y + a[1] * s - 21 }; }

      /* the loop */
      var R = X.run(sc, function(){ dirty = false; show('overview'); openD(false); fill(OPEN); rowLit(-1); focus(-1, -1); say(''); suggestDone(false); });
      var tl = R.tl, fade = q(st, '.fg-fade');
      function countTo(el, to, suf, t, d){
        var o = { v: 0 };
        tl.set(el, { textContent: '0' + suf }, 0);
        tl.fromTo(o, { v: 0 }, { v: to, duration: d, ease: 'power2.out', immediateRender: false, onUpdate: function(){ el.textContent = fmt(Math.round(o.v)) + suf; } }, t);
      }
      tl.set(fade, { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .62, y: sc.SH + 30 }, 0);
      ML.forEach(function(l){ X.hide(R, l); });
      // everything that staggers in starts hidden (a fromTo only takes its from-state when it begins)
      tl.set([kpis, tRows, ins, trs, mT, mPc, dLis, sug], { autoAlpha: 0 }, 0);
      tl.set(dLine, { strokeDasharray: 1, strokeDashoffset: 1 }, 0).set(arc, { strokeDashoffset: RC }, 0);

      // 1 · Overview
      tl.addLabel('ov', 0);
      tl.fromTo(kpis, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .3);
      kNums.forEach(function(b, i){ countTo(b, +b.getAttribute('data-to'), b.getAttribute('data-suf'), .5 + i * .08, 1.3); });
      tl.fromTo(tRows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .1, immediateRender: false }, 1.3);
      tl.fromTo(ins, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .15, immediateRender: false }, 2.1);
      R.at(3.4, function(){ rowLit(OPEN); });
      R.at(4.4, function(){ rowLit(-1); });

      // 2 · Topics: open one topic
      var t = 4.6;
      tl.addLabel('tp', t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      X.move(R, cur, navAt('topics'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="topics"]'), t + .6);
      R.at(t + .65, function(){ show('topics'); });
      tl.fromTo(trs, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, stagger: .06, immediateRender: false }, t + .8);
      X.move(R, cur, pos(st, trs[OPEN], P ? .3 : .16, .55), t + 1.3, .6); X.click(R, trs[OPEN], t + 1.95);
      R.at(t + 2, function(){ fill(OPEN); openD(true); });
      tl.to(dLine, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, t + 2.4);
      tl.fromTo(dLis, { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .35, stagger: .12, immediateRender: false }, t + 2.6);
      R.at(t + 5.4, function(){ openD(false); });

      // 3 · Knowledge map: nodes, threads, one topic lit
      t += 5.7;
      tl.addLabel('map', t);
      X.move(R, cur, navAt('map'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="map"]'), t + .6);
      R.at(t + .65, function(){ show('map'); });
      tl.fromTo(mT, { autoAlpha: 0, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .45, stagger: .08, ease: 'back.out(1.8)', immediateRender: false }, t + .9);
      tl.fromTo(mPc, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, stagger: .05, immediateRender: false }, t + 1.3);
      ML.forEach(function(l, i){ X.draw(R, l, t + 1.6 + i * .05, .55); });
      X.move(R, cur, mapAt(FOCUS), t + 2.9, .8);
      R.at(t + 3.7, function(){ focus(FOCUS, -1); });
      var rest = t + 4.6;
      R.at(t + 5.9, function(){ focus(-1, -1); });

      // 4 · Link health: the suggestion card
      t += 6.1;
      tl.addLabel('hl', t);
      X.move(R, cur, navAt('health'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="health"]'), t + .6);
      R.at(t + .65, function(){ show('health'); });
      tl.to(arc, { strokeDashoffset: RC * (1 - .82), duration: 1.2, ease: 'power2.out' }, t + .9);
      countTo(score, 82, '', t + .9, 1.2);
      tl.fromTo(sug, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, t + 2);
      X.move(R, cur, pos(st, goB, .5, .6), t + 2.9, .7); X.click(R, goB, t + 3.65);
      R.at(t + 3.7, function(){ suggestDone(true); say('Draft written from your Voice Kit and sent to Review'); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 4.4);
      R.at(t + 5.6, function(){ say(''); });

      X.end(sc, R, t + 6.4, rest, [{ t: 'Overview', at: 'ov' }, { t: 'Topics', at: 'tp' }, { t: 'Map', at: 'map' }, { t: 'Health', at: 'hl' }]);
      // after a hold, the play button resumes: put the scene back where the playhead is (chips need their own onUpdate, so chain it)
      var mark = tl.eventCallback('onUpdate');
      tl.eventCallback('onUpdate', function(){
        if (dirty && !tl.paused()){ dirty = false; setTimeout(function(){ if (sc.onSeek) sc.onSeek(); }, 0); }
        if (mark) mark.apply(this, arguments);
      });
    });
  })();

  /* ===== mission/24-tw-capture.js ===== */
  /* =========================================================
     TOPICWEAVE · VOICE KIT (channel tw-capture)
     A coded replica of the Capture phone prototype (cks-v3 app/mobile.html) in its phone frame, with the
     Voice Kit idea beside it ("Capture, not homework."):
       Record : tap the mic, a live waveform and timer, the transcript types in
       Review : it comes back as a draft in the speaker's words, topic tags arrive one by one
       Publish: Approve, then Publish; the draft card lands on the topic page beside the phone, a thread between
     The mic/stop and Approve buttons are live: they jump to that phase and hold the loop.
     Content is the prototype's own example data (app/mobile.html, app/data.js): "Prototype · sample data".
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, C = T.C, q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';
    var run = X.run, end = X.end, type = X.type;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
    // offset of el inside root, in root's own (unscaled) pixels
    function rel(el, root){ var x = 0, y = 0, n = el; while (n && n !== root){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; }

    var MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
    var TABS = '<nav class="tw-cap-tabs" aria-hidden="true">' +
      '<span class="on">' + MIC + 'Capture</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2.6-8h12.8L21 13v6H3z"/><path d="M3 13h5l1 2h6l1-2h5"/></svg>Inbox</span>' +
      '<span><i>2</i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12l3 3 5-6"/></svg>Review</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>Pulse</span></nav>';
    // the prototype's own example: the Friday handoff memo, its draft and its tags (colors from app/data.js)
    var SAY = '“…the partner closes on Thursday, and the invoice goes out Friday from someone the client has never heard of. That’s where it starts to go wrong…”';
    var TITLE = 'Every complaint starts at a handoff';
    var TAGS = [['Client handoffs', '#EF5B3F', 1], ['Client onboarding', '#9B87F5', 1], ['Professional firms', '#B18CFF', 0], ['Journey mapping', '#139E8A', 0]];
    var NOTES = [['01', 'Talk', 'A memo after a call. Two minutes is plenty.'], ['02', 'In your words', 'The draft starts from your own sentences, tagged from your vocabulary.'], ['03', 'You approve', 'Nothing publishes until you say so. That’s the rule, not a setting.']];
    var WCOL = ['#9B87F5', '#EF5B3F', '#139E8A', '#4F7BFF'];

    SCENE.add('tw-capture', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      // phone at the prototype's native size (390×800), scaled into place
      var ph = P ? { k: .72, x: (640 - 390 * .72) / 2, y: 10 } : { k: .86, x: (1200 - 390 * .86) / 2, y: (750 - 800 * .86) / 2 };
      var cd = P ? { x: 40, y: 618, w: 560, h: 124 } : { x: 836, y: 196, w: 330, h: 360 };
      st.innerHTML =
        '<div class="tw-cap-bg"></div>' +
        '<svg class="tw-cap-thr" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        (P ? '' : '<div class="tw-cap-notes"><p class="tw-cap-eye">Voice Kit · Topicweave Capture</p><h3>Capture, not homework.</h3><ol>' +
          NOTES.map(function(n, i){ return '<li data-i="' + i + '"><b>' + n[0] + '</b><strong>' + esc(n[1]) + '</strong><span>' + esc(n[2]) + '</span></li>'; }).join('') + '</ol></div>') +
        '<div class="tw-cap-phone" style="left:' + ph.x + 'px;top:' + ph.y + 'px;transform:scale(' + ph.k + ')"><div class="tw-cap-screen">' +
          '<div class="tw-cap-island"></div><div class="tw-cap-status"><span>9:41</span><span>●●● ⌁ ▮</span></div>' +
          // home
          '<section class="tw-cap-sc" data-sc="home"><p class="tw-cap-sub">Good morning</p><h2>What’s on your mind?</h2>' +
            '<button type="button" class="tw-cap-mic" aria-label="Record a voice memo (jumps to Record)">' + MIC + '</button>' +
            '<p class="tw-cap-q">Tap and talk. Two minutes is plenty.</p>' +
            '<div class="tw-cap-mini"><b>2</b><p>drafts waiting for your review</p></div></section>' +
          // recording
          '<section class="tw-cap-sc" data-sc="rec"><p class="tw-cap-sub">Recording · simulated</p><h2>“What do new clients get wrong?”</h2>' +
            '<canvas class="tw-cap-wave" aria-hidden="true"></canvas><div class="tw-cap-timer">1:14</div>' +
            '<div class="tw-cap-field tw-cap-live"><p class="tw-cap-lab"><i></i>Live transcript</p><p class="tw-cap-say"></p></div>' +
            '<button type="button" class="tw-cap-stop" aria-label="Record again (jumps to Record)"></button></section>' +
          // matching
          '<section class="tw-cap-sc" data-sc="work"><div class="tw-cap-spin"><svg viewBox="0 0 120 120" aria-hidden="true"><line x1="20" y1="40" x2="100" y2="40" stroke="#EF5B3F"/><line x1="20" y1="80" x2="100" y2="80" stroke="#139E8A"/><line x1="40" y1="20" x2="40" y2="100" stroke="#9B87F5"/><line x1="80" y1="20" x2="80" y2="100" stroke="#2F5BEA"/></svg><p>Transcribing and matching<br>to your vocabulary…</p></div></section>' +
          // the draft, in the speaker's words
          '<section class="tw-cap-sc" data-sc="draft"><p class="tw-cap-sub">Draft · from your voice memo · 2:14</p><h2>' + esc(TITLE) + '</h2>' +
            '<div class="tw-cap-read"><p>We’ve read a lot of client complaints over the years. Almost every one of them started at a handoff, the moment work passed from one person to another.</p>' +
            '<p>The partner closes the deal. Then someone new sends the first invoice, and nobody has told the client who that person is.</p></div>' +
            '<div class="tw-cap-field"><p class="tw-cap-lab">Suggested tags · from your vocabulary</p><div class="tw-cap-tags">' +
              TAGS.map(function(t){ return '<span class="tw-cap-tag' + (t[2] ? ' on' : '') + '" style="--c:' + t[1] + '"><i></i>' + esc(t[0]) + '</span>'; }).join('') + '</div></div>' +
            '<div class="tw-cap-cta"><button type="button" class="tw-cap-ok">Approve</button></div></section>' +
          // published
          '<section class="tw-cap-sc" data-sc="done"><div class="tw-cap-done"><div class="tw-cap-tick">✓</div><h2>Published.</h2><p>The library, two topic pages and their related rows updated.</p></div></section>' +
          TABS + '<div class="tw-cap-toast"></div><div class="tw-cap-touch"></div>' +
        '</div></div>' +
        // the topic page on the site
        '<div class="tw-cap-site' + (P ? ' is-p' : '') + '" style="left:' + cd.x + 'px;top:' + cd.y + 'px;width:' + cd.w + 'px;height:' + cd.h + 'px">' + T.bar('yoursite.com/topics/client-handoffs') +
          '<div class="tw-cap-pg"><div class="tw-cap-pgh"><p class="tw-cap-eye"><i style="background:#EF5B3F"></i>Topic · What you watch for</p><h4>Client handoffs</h4><em class="tw-cap-pill">Draft in review</em></div>' +
          '<div class="tw-cap-pgl"><p class="tw-cap-lab">Reading list</p><div class="tw-cap-row tw-cap-new"><b>' + esc(TITLE) + '</b><span>New</span></div>' +
          (P ? '' : '<div class="tw-cap-row"><b>Why handoffs fail on Friday afternoons</b></div><p class="tw-cap-lab">Related topics</p><div class="tw-cap-rel"><span style="--c:#9B87F5"><i></i>Client onboarding</span><span style="--c:#B18CFF"><i></i>Professional firms</span></div>') + '</div></div></div>' +
        '<div class="tw-cap-fly"><b>' + esc(TITLE) + '</b><span><i style="background:#EF5B3F"></i>Client handoffs <i style="background:#9B87F5"></i>Client onboarding</span></div>' +
        '<p class="tw-cap-proto">Prototype · sample data</p>' +
        '<div class="fg-fade"></div>';

      var phone = q(st, '.tw-cap-phone'), scr = q(st, '.tw-cap-screen'), scs = qa(st, '.tw-cap-sc'), mic = q(st, '.tw-cap-mic'), stop = q(st, '.tw-cap-stop');
      var cv = q(st, '.tw-cap-wave'), timer = q(st, '.tw-cap-timer'), say = q(st, '.tw-cap-say'), reads = qa(st, '.tw-cap-read p'), tags = qa(st, '.tw-cap-tag'), okB = q(st, '.tw-cap-ok');
      var cta = q(st, '.tw-cap-cta'), toast = q(st, '.tw-cap-toast'), touch = q(st, '.tw-cap-touch'), site = q(st, '.tw-cap-site'), pill = q(st, '.tw-cap-pill'), nrow = q(st, '.tw-cap-new');
      var fly = q(st, '.tw-cap-fly'), notes = qa(st, '.tw-cap-notes li'), svg = q(st, '.tw-cap-thr'), fade = q(st, '.fg-fade'), lab = q(st, '.tw-cap-live .tw-cap-lab'), nkids = qa(nrow, 'b, span');

      function show(id){ scs.forEach(function(s){ s.classList.toggle('on', s.getAttribute('data-sc') === id); }); }
      function note(i){ notes.forEach(function(n, k){ n.classList.toggle('on', k === i); }); }
      function msg(s){ toast.textContent = s || ''; toast.classList.toggle('on', !!s); }
      function setPub(on){ site.classList.toggle('live', on); nrow.classList.toggle('wait', !on); pill.textContent = on ? 'Published' : 'Draft in review'; }

      // the waveform, drawn from the timeline (no loop of its own)
      var cx = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), CW = 350, CH = 120;
      cv.width = CW * dpr; cv.height = CH * dpr;
      function wave(s, amp){
        cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, CW, CH); cx.lineWidth = 3; cx.lineCap = 'round';
        for (var i = 0, n = 46; i < n; i++){
          var x = (i + .5) * (CW / n), env = Math.sin(i / (n - 1) * Math.PI);
          var a = Math.max(1.5, env * (.2 + .8 * Math.abs(Math.sin(i * .5 + s * 5) * Math.sin(i * .17 - s * 3))) * CH * .45 * amp);
          cx.strokeStyle = WCOL[i % 4]; cx.beginPath(); cx.moveTo(x, CH / 2 - a); cx.lineTo(x, CH / 2 + a); cx.stroke();
        }
      }
      function clock(s){ s = Math.floor(s); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }

      // stage geometry: phone-local points → stage
      function sp(el, fx, fy){ var r = rel(el, phone); return { x: ph.x + (r.x + r.w * fx) * ph.k, y: ph.y + (r.y + r.h * fy) * ph.k }; }
      function stp(el, fx, fy){ var r = rel(el, st); return { x: r.x + r.w * fx, y: r.y + r.h * fy }; }
      var h2d = q(st, '[data-sc="done"] h2');
      var a = P ? { x: ph.x + 195 * ph.k, y: ph.y + 800 * ph.k - 4 } : { x: ph.x + 390 * ph.k - 4, y: sp(h2d, 1, .5).y };
      var b = P ? stp(nrow, .3, 0) : stp(nrow, 0, .5);
      var thr = document.createElementNS(NS, 'path');
      thr.setAttribute('d', P ? X.curve(a, { x: b.x, y: b.y - 2 }, true) : X.curve(a, { x: b.x - 2, y: b.y }));
      thr.setAttribute('class', 'tw-cap-ln'); svg.appendChild(thr);
      var L = (thr.getTotalLength ? thr.getTotalLength() : 400) + 2; thr.style.strokeDasharray = L; thr.style.strokeDashoffset = L;
      var dots = [a, b].map(function(p){ var c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', 4); c.setAttribute('class', 'tw-cap-dot'); svg.appendChild(c); return c; });
      var fs = sp(h2d, 0, 0), fw = 300 * ph.k; fs.x += 22 * ph.k;   // the card lifts off the draft's headline, then lands in the reading list
      var fe = stp(nrow, 0, 0);

      // a fingertip on the glass
      function press(R, el, t){
        var r = rel(el, scr);
        R.tl.set(touch, { x: r.x + r.w / 2 - 22, y: r.y + r.h / 2 - 22 }, t - .01)
          .fromTo(touch, { autoAlpha: 0, scale: 1.5 }, { autoAlpha: 1, scale: 1, duration: .18, immediateRender: false }, t)
          .to(touch, { autoAlpha: 0, scale: .8, duration: .25 }, t + .3);
        X.click(R, el, t + .12);
      }

      var R = run(sc, function(){
        show('home'); note(0); msg(''); setPub(false); okB.textContent = 'Approve'; timer.textContent = '1:14'; wave(0, .15);
        lab.classList.remove('on');
      }), tl = R.tl;
      tl.set(fade, { autoAlpha: 0 }, 0).set(touch, { autoAlpha: 0 }, 0).set(fly, { autoAlpha: 0, x: fs.x, y: fs.y, width: fw, scale: 1 }, 0)
        .set(thr, { strokeDashoffset: L }, 0).set(dots, { autoAlpha: 0 }, 0).set(nkids, { autoAlpha: 0 }, 0)
        .set(reads, { autoAlpha: 0 }, 0).set(tags, { autoAlpha: 0 }, 0).set(cta, { autoAlpha: 0 }, 0);

      /* 1 · Record */
      tl.addLabel('record', 0);
      tl.fromTo(phone, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .05);
      press(R, mic, 1.7);
      R.at(1.95, function(){ show('rec'); lab.classList.add('on'); });
      var w = { s: 0, a: .15 };
      tl.fromTo(w, { s: 0, a: .15 }, { s: 5, a: 1, duration: 5, ease: 'none', immediateRender: false, onUpdate: function(){ wave(w.s, Math.min(1, w.a * 3)); timer.textContent = clock(74 + w.s * 1.6); } }, 2);
      type(R, say, SAY, 2.5, 4);
      press(R, stop, 7.1);
      R.at(7.3, function(){ show('work'); lab.classList.remove('on'); });

      /* 2 · Review */
      tl.addLabel('review', 8.1);
      R.at(8.1, function(){ show('draft'); note(1); });
      tl.fromTo(reads, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .3, immediateRender: false }, 8.4);
      tags.forEach(function(g, i){ tl.fromTo(g, { autoAlpha: 0, y: 6, scale: .92 }, { autoAlpha: 1, y: 0, scale: 1, duration: .35, ease: 'back.out(2)', immediateRender: false }, 9.5 + i * .5); });
      tl.fromTo(cta, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .35, immediateRender: false }, 11.6);
      var restAt = 12.5;

      /* 3 · Publish */
      tl.addLabel('publish', 13.1);
      R.at(13.1, function(){ note(2); });
      press(R, okB, 13.5);
      R.at(13.7, function(){ okB.textContent = 'Publish'; msg('Approved. Publish is unlocked.'); });
      press(R, okB, 14.7);
      R.at(14.9, function(){ msg(''); show('done'); setPub(true); });
      tl.fromTo(fly, { autoAlpha: 0, x: fs.x, y: fs.y, scale: 1 }, { autoAlpha: 1, y: fs.y - 10, duration: .3, immediateRender: false }, 14.9)
        .to(fly, { x: fe.x, y: fe.y, width: nrow.offsetWidth, duration: .9, ease: 'power2.inOut' }, 15.25)
        .to(fly, { autoAlpha: 0, duration: .2 }, 16.15)
        .fromTo(nkids, { autoAlpha: 0, y: -4 }, { autoAlpha: 1, y: 0, duration: .3, immediateRender: false }, 16.05)
        .to(dots[0], { autoAlpha: 1, duration: .2 }, 15.2)
        .to(thr, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, 15.25)
        .to(dots[1], { autoAlpha: 1, duration: .2 }, 16.1);
      end(sc, R, 20.2, restAt, [{ t: 'Record', at: 'record' }, { t: 'Review', at: 'review' }, { t: 'Publish', at: 'publish' }]);

      // interactive: the mic/stop and Approve jump to their phase, play it through, then hold
      var hop = null;
      function jump(label, to){
        if (hop) hop.kill();
        if (sc.hold) sc.hold();
        tl.seek(tl.labels[label]); if (sc.onSeek) sc.onSeek();
        hop = tl.tweenTo(to, { ease: 'none' });
      }
      tap(mic, function(){ jump('record', 7); });
      tap(stop, function(){ jump('record', 7); });
      tap(okB, function(){ jump('publish', 17.7); });
      // the play button or a phase chip takes the loop back
      sc.capHop = function(){ if (hop){ hop.kill(); hop = null; } };
      if (!sc.capL){ sc.capL = true; sc.view.addEventListener('click', function(e){ var t = e.target; if (sc.capHop && t.closest && t.closest('.scn-ctl')) sc.capHop(); }, true); }
    });
  })();

  /* ===== mission/24-tw-cms.js ===== */
  /* =========================================================
     TOPICWEAVE · TAG ONCE (channel tw-cms)
     A coded replica of the CMS panel prototype (cks-v3 app/cms.html): a generic CMS editor with the Topicweave
     panel beside it, joined to "Five parts, one shared vocabulary" (src/how-it-works.html): tag once and the
     entry shows up everywhere it belongs.
       Entry     : the cursor types a title, the panel reads the draft and suggests topics from the vocabulary
       Tag       : two suggestions accepted, thread-colored chips land in the Related topics field
       Publish   : threads draw from the entry to a topic page, a related-reading list and the JSON-LD,
                   which fills in (Article + about DefinedTerms built from the picked tags)
       Topic page: the topic page's piece count ticks up
     Live: a suggested topic toggles (holds the loop, the JSON-LD and the pages update); Publish replays.
     Content is the prototype's own example data (app/cms.html, app/data.js): "Prototype · sample data".
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, C = T.C, q = K.q, qa = K.qa, esc = K.esc;
    var run = X.run, end = X.end, type = X.type, pos = X.pos, move = X.move, click = X.click;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    var TITLE = 'Every complaint starts at a handoff', SLUG = 'every-complaint-starts-at-a-handoff';
    // the prototype's three suggestions (app/cms.html), counts and pieces from app/data.js
    var TOP = [
      { n: 'Client handoffs', c: C.coral, cat: 'What you watch for', m: 'strong match', pages: 3, slug: 'client-handoffs',
        list: ['Why handoffs fail on Friday afternoons'], rel: ['Why handoffs fail on Friday afternoons', 'insights/why-handoffs-fail', 'The first 30 days decide the next three years'],
        links: [['Topic page: Client handoffs', '+1 piece'], ['Related reading on 2 insights', 'auto']] },
      { n: 'Client onboarding', c: C.lilac, cat: 'Ideas', m: 'strong match', pages: 7, slug: 'client-onboarding',
        list: ['Onboarding is a design problem', 'The first 30 days decide the next three years'], rel: ['The first 30 days decide the next three years', 'insights/the-first-30-days', 'Onboarding is a design problem'],
        links: [['Topic page: Client onboarding', '+1 piece'], ['Riverside Clinic · related reading', 'auto'], ['Library · For new clients', 'auto']] },
      { n: 'Professional firms', c: C.teal, cat: 'Who you help', m: 'possible', pages: 4, slug: 'professional-firms',
        list: ['Hale & Partners onboarding'], rel: ['Hale & Partners onboarding', 'work/hale-partners-onboarding', 'Onboarding is a design problem'],
        links: [['Topic page: Professional firms', '+1 piece']] }
    ];
    var PICK = [0, 1];
    // JSON-LD syntax colors: keys lilac, strings teal (the prototype's pre)
    function hl(s){
      var out = '', last = 0, re = /"[^"]*"/g, m;
      while ((m = re.exec(s))){ var key = /^\s*:/.test(s.slice(re.lastIndex)); out += esc(s.slice(last, m.index)) + '<span class="' + (key ? 'k' : 's') + '">' + esc(m[0]) + '</span>'; last = re.lastIndex; }
      return out + esc(s.slice(last));
    }

    SCENE.add('tw-cms', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var ED = P ? { x: 20, y: 44, w: 600, h: 384, f: 330 } : { x: 28, y: 52, w: 640, h: 648, f: 360 };
      var RC = P ? { top: [20, 466, 290, 164], rel: [20, 644, 290, 136], ld: [330, 466, 290, 314] }
                 : { top: [756, 52, 420, 196], rel: [756, 262, 420, 128], ld: [756, 404, 420, 296] };
      function box(r){ return 'left:' + r[0] + 'px;top:' + r[1] + 'px;width:' + r[2] + 'px;height:' + r[3] + 'px'; }
      function fld(lab, inner, cls){ return '<div class="tw-cm-f' + (cls ? ' ' + cls : '') + '"><label>' + lab + '</label>' + inner + '</div>'; }

      st.innerHTML = '<div class="tw-cm-bg"></div>' +
        '<div class="tw-cm-lab"><b>Topicweave inside your CMS</b><span>Prototype · sample data</span></div>' +
        '<svg class="tw-cm-svg" width="' + sc.SW + '" height="' + sc.SH + '" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-cm-ed" style="left:' + ED.x + 'px;top:' + ED.y + 'px;width:' + ED.w + 'px;height:' + ED.h + 'px;grid-template-columns:' + ED.f + 'px 1fr">' +
          '<div class="tw-cm-bar"><span class="tw-cm-dots"><i></i><i></i><i></i></span><b>Insights</b><span class="tw-cm-path">/ New item</span><em class="tw-cm-pill">Draft</em><button type="button" class="tw-cm-pub">Publish</button></div>' +
          '<div class="tw-cm-form">' +
            fld('Name', '<div class="tw-cm-in tw-cm-ti"><b></b><u></u></div>') +
            fld('Slug', '<div class="tw-cm-in tw-cm-sl"><b></b></div>') +
            fld('Related topics <span>· multi-reference</span>', '<div class="tw-cm-ref"></div>') +
            (P ? '' : fld('Short summary', '<div class="tw-cm-in tw-cm-ml">Almost every client complaint starts when work passes from one person to another.</div>')) +
            fld('Body', '<div class="tw-cm-rt"><p>We’ve read a lot of client complaints over the years. Every single one we can remember started at a <span>handoff</span>, the moment work passed from one person to another.</p>' +
              (P ? '' : '<p>The fix is rarely a new system. It’s one <span>short email on day two</span>: here’s who you’ll hear from next, and why. We send it for every client now.</p>') + '</div>', 'tw-cm-body') +
          '</div>' +
          '<aside class="tw-cm-pn" aria-label="Topicweave panel"><div class="tw-cm-ph">' + T.ICON + '<b>Topicweave</b><span>Example Studio</span></div>' +
            '<div class="tw-cm-blk tw-cm-sugs"><h3>Suggested topics<span>from your vocabulary</span></h3><p class="tw-cm-wait">Suggestions appear as you write.</p>' +
              TOP.map(function(t, i){ return '<div class="tw-cm-sug" style="--c:' + t.c + '"><i></i><span>' + esc(t.n) + '<small>' + t.m + '</small></span><button type="button" data-i="' + i + '" aria-pressed="false">Add</button></div>'; }).join('') + '</div>' +
            '<div class="tw-cm-blk"><h3 class="tw-cm-ch">Once published, it connects to</h3><div class="tw-cm-conn"></div></div>' +
            (P ? '' : '<div class="tw-cm-blk"><h3>Before you publish</h3><div class="tw-cm-ok">Title is a sentence in your voice</div><div class="tw-cm-ok">No words from your never list</div><div class="tw-cm-warn tw-cm-chk">No topic tagged yet</div></div>') +
          '</aside></div>' +
        '<div class="tw-cm-card tw-cm-top" style="' + box(RC.top) + '"><div class="tw-cm-url"></div><div class="tw-cm-th1"><div><em class="tw-cm-cat"></em><b class="tw-cm-tn"></b></div><div class="tw-cm-cnt"><b>3</b><span>pieces</span><i>+1</i></div></div>' +
          '<div class="tw-cm-rl"><div class="tw-cm-new"><span>' + esc(TITLE) + '</span><em>New</em></div><div class="tw-cm-base"></div></div><div class="tw-cm-also"></div></div>' +
        '<div class="tw-cm-card tw-cm-rel" style="' + box(RC.rel) + '"><div class="tw-cm-url"></div><b class="tw-cm-rt2"></b><em class="tw-cm-sub">Related reading</em>' +
          '<div class="tw-cm-rl"><div class="tw-cm-new"><span>' + esc(TITLE) + '</span><em>New</em></div></div></div>' +
        '<div class="tw-cm-card tw-cm-ld" style="' + box(RC.ld) + '"><div class="tw-cm-ldh"><span>JSON-LD · built from your tags</span><i></i></div><p class="tw-cm-ldw">Fills in when you publish.</p><pre></pre></div>' +
        X.cursor('a', 'You') + '<div class="fg-fade"></div>';

      var svg = q(st, '.tw-cm-svg'), ed = q(st, '.tw-cm-ed'), ti = q(st, '.tw-cm-ti b'), sl = q(st, '.tw-cm-sl b'), refBox = q(st, '.tw-cm-ref');
      var pill = q(st, '.tw-cm-pill'), pub = q(st, '.tw-cm-pub'), wait = q(st, '.tw-cm-wait'), sugs = qa(st, '.tw-cm-sug'), sugB = qa(st, '.tw-cm-sug button');
      var conn = q(st, '.tw-cm-conn'), connH = q(st, '.tw-cm-ch'), chk = q(st, '.tw-cm-chk');
      var top = q(st, '.tw-cm-top'), rel = q(st, '.tw-cm-rel'), ldc = q(st, '.tw-cm-ld'), pre = q(ldc, 'pre'), ldw = q(ldc, '.tw-cm-ldw');
      var cnt = q(top, '.tw-cm-cnt b'), plus = q(top, '.tw-cm-cnt i'), news = qa(st, '.tw-cm-new'), cur = q(st, '.cur.a'), cards = qa(st, '.tw-cm-card');

      // state: which topics are tagged, published yet, counted yet
      var sel = [false, false, false], was = [false, false, false], published = false, counted = false;
      function picked(){ var a = []; sel.forEach(function(s, i){ if (s) a.push(i); }); return a; }
      function ld(){
        var pk = picked(), L = [['{']];
        if (!P) L.push(['  "@context": "https://schema.org",']);
        L.push(['  "@type": "Article",'], ['  "headline": "' + TITLE + '",'], ['  "about": [' + (pk.length ? '' : ']')]);
        pk.forEach(function(i, n){
          var t = TOP[i], last = n === pk.length - 1;
          if (P) L.push(['    { "@type": "DefinedTerm",', t.c], ['      "name": "' + t.n + '",', t.c], ['      "url": "/topics/' + t.slug + '" }' + (last ? '' : ','), t.c]);
          else L.push(['    { "@type": "DefinedTerm", "name": "' + t.n + '",', t.c], ['      "url": "/topics/' + t.slug + '" }' + (last ? '' : ','), t.c]);
        });
        if (pk.length) L.push(['  ]']);
        L.push(['}']);
        return L.map(function(l){ return '<span' + (l[1] ? ' class="hot" style="--c:' + l[1] + '"' : '') + '>' + hl(l[0]) + '</span>'; }).join('\n');
      }
      function base(){ var pk = picked(); return pk.length ? TOP[pk[0]].pages : 0; }
      function render(){
        var pk = picked();
        st.className = st.className.replace(/\s*tw-s\d/g, '') + pk.map(function(i){ return ' tw-s' + i; }).join('');
        sugB.forEach(function(b, i){ b.textContent = sel[i] ? 'Added' : 'Add'; b.classList.toggle('on', sel[i]); b.setAttribute('aria-pressed', sel[i] ? 'true' : 'false'); });
        refBox.innerHTML = pk.length ? pk.map(function(i){ return '<span class="tw-cm-chip' + (was[i] ? '' : ' is-in') + '" style="--c:' + TOP[i].c + '">' + esc(TOP[i].n) + '</span>'; }).join('')
          : '<span class="tw-cm-emp">No topics yet. Accept a suggestion from Topicweave →</span>';
        was = sel.slice();
        connH.textContent = published ? 'Connected to' : 'Once published, it connects to';
        conn.innerHTML = pk.length ? pk.map(function(i){ return TOP[i].links.map(function(l){ return '<div style="--c:' + TOP[i].c + '"><i></i>' + esc(l[0]) + '<span>' + (published ? (l[1] === 'auto' ? 'linked' : 'added') : l[1]) + '</span></div>'; }).join(''); }).join('')
          : '<div class="tw-cm-none">Nothing yet<span>add a topic</span></div>';
        if (chk){ chk.className = pk.length ? 'tw-cm-ok tw-cm-chk' : 'tw-cm-warn tw-cm-chk'; chk.textContent = pk.length ? pk.length + ' topic' + (pk.length > 1 ? 's' : '') + ' tagged' : 'No topic tagged yet'; }
        pill.textContent = published ? 'Published' : 'Draft'; pill.classList.toggle('on', published);
        // the topic page and related reading follow the first tagged topic
        var t = pk.length ? TOP[pk[0]] : null;
        top.classList.toggle('is-none', !t); rel.classList.toggle('is-none', !t);
        q(top, '.tw-cm-url').textContent = 'yoursite.com/topics/' + (t ? t.slug : '…');
        q(top, '.tw-cm-cat').textContent = t ? 'Topic page · ' + t.cat : 'Topic page';
        q(top, '.tw-cm-tn').textContent = t ? t.n : 'Tag a topic to give it a home';
        top.style.setProperty('--c', t ? t.c : C.ash); rel.style.setProperty('--c', t ? t.c : C.ash);
        cnt.textContent = t ? base() + (counted ? 1 : 0) : '0';
        q(top, '.tw-cm-base').innerHTML = t ? t.list.slice(0, 1).map(function(x){ return '<div><span>' + esc(x) + '</span></div>'; }).join('') : '';
        var also = pk.slice(1).map(function(i){ return TOP[i].n + ' (' + (TOP[i].pages + (counted ? 1 : 0)) + ')'; });
        q(top, '.tw-cm-also').textContent = published && also.length ? 'Also updated: ' + also.join(', ') : '';
        q(rel, '.tw-cm-url').textContent = 'yoursite.com/' + (t ? t.rel[1] : '…');
        q(rel, '.tw-cm-rt2').textContent = t ? t.rel[0] : 'No related pages yet';
        pre.innerHTML = ld();
      }

      // threads: one strand per topic to each of the three places, shown only for tagged topics
      var ths = [], knots = [];
      var eb = ED.y + ED.h, er = ED.x + ED.w, by = ED.y + 18;
      [top, rel, ldc].forEach(function(card, j){
        var r = j === 0 ? RC.top : j === 1 ? RC.rel : RC.ld, kx, ky;
        TOP.forEach(function(t, k){
          var o = (k - 1) * 6, a, b, d;
          if (P){
            if (j === 1){ var gx = 320 + o, gy = r[1] + r[3] / 2 + o; d = 'M' + gx + ' ' + eb + 'L' + gx + ' ' + (gy - 18) + 'Q' + gx + ' ' + gy + ' ' + (r[0] + r[2] + 2) + ' ' + gy; kx = r[0] + r[2]; ky = r[1] + r[3] / 2; }
            else { a = { x: r[0] + r[2] / 2 + o * 1.4, y: eb }; b = { x: a.x, y: r[1] - 2 }; d = X.curve(a, b, true); kx = r[0] + r[2] / 2; ky = r[1]; }
          } else {
            a = { x: er, y: by + o }; b = { x: r[0] - 2, y: (j === 2 ? r[1] + 40 : r[1] + r[3] / 2) + o }; d = X.curve(a, b, false); kx = r[0]; ky = b.y - o;
          }
          var p = X.path(svg, d, 'tw-cm-th k' + k); p.style.stroke = t.c; ths.push({ p: p, j: j, k: k });
        });
        var kn = K.mk('div', 'tw-cm-knot'); kn.style.left = kx + 'px'; kn.style.top = ky + 'px'; st.appendChild(kn); knots.push(kn);
      });

      var R = run(sc, function(){
        sel = [false, false, false]; was = sel.slice(); published = false; counted = false;
        st.classList.add('is-typing'); wait.textContent = 'Suggestions appear as you write.'; wait.classList.remove('is-busy');
        render();
      }), tl = R.tl;

      // 1 · entry
      tl.addLabel('entry', 0);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: P ? 420 : 300, y: sc.SH + 30 }, 0)
        .set(sugs, { autoAlpha: 0, y: 6 }, 0).set(wait, { autoAlpha: 1 }, 0).set(news, { autoAlpha: 0, height: 0 }, 0)
        .set(pre, { '--f': 0 }, 0).set(ldw, { autoAlpha: 1 }, 0).set(plus, { autoAlpha: 0 }, 0).set(knots, { autoAlpha: 0, scale: .4 }, 0);
      ths.forEach(function(o){ X.hide(R, o.p); });
      tl.fromTo([ed].concat(cards), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .1);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, .45);
      move(R, cur, pos(st, q(st, '.tw-cm-ti'), .25, .6), .45, .65); click(R, q(st, '.tw-cm-ti'), 1.12);
      var t = type(R, ti, TITLE, 1.2);
      type(R, sl, SLUG, 1.2, t - 1.2);
      R.at(t + .1, function(){ wait.textContent = 'Reading the draft…'; wait.classList.add('is-busy'); });
      tl.to(wait, { autoAlpha: 0, duration: .2 }, t + .6);
      tl.to(sugs, { autoAlpha: 1, y: 0, duration: .35, stagger: .14 }, t + .7);
      t += 1.5;

      // 2 · tag
      tl.addLabel('tag', t);
      R.at(t, function(){ st.classList.remove('is-typing'); });
      PICK.forEach(function(k, i){
        var b = sugB[k], tt = t + i * .95;
        move(R, cur, pos(st, b, .5, .6), tt, .55); click(R, b, tt + .58);
        R.at(tt + .62, function(){ sel[k] = true; render(); });
      });
      t += PICK.length * .95 + .35;

      // 3 · publish
      tl.addLabel('publish', t);
      move(R, cur, pos(st, pub, .5, .6), t, .6); click(R, pub, t + .62);
      R.at(t + .66, function(){ published = true; render(); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 1);
      ths.forEach(function(o){ X.draw(R, o.p, t + .75 + o.j * .28 + o.k * .07, .75); });
      knots.forEach(function(kn, j){ tl.to(kn, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, t + 1.45 + j * .28); });
      tl.to(news, { autoAlpha: 1, height: 'auto', duration: .4, stagger: .28, ease: 'power2.out' }, t + 1.5);
      tl.to(ldw, { autoAlpha: 0, duration: .2 }, t + 1.85);
      tl.to(pre, { '--f': 1, duration: 1.3, ease: 'steps(16)' }, t + 1.95);
      t += 3.6;

      // 4 · the topic page counts the new piece
      tl.addLabel('count', t);
      tl.fromTo(top, { boxShadow: '0 0 0 1px rgba(155,135,245,0)' }, { boxShadow: '0 0 0 1px rgba(155,135,245,.9), 0 0 40px rgba(155,135,245,.35)', duration: .35, yoyo: true, repeat: 1, immediateRender: false }, t);
      var o = { v: 0 };
      tl.fromTo(o, { v: 0 }, { v: 1, duration: .6, ease: 'power1.out', immediateRender: false, onUpdate: function(){ if (picked().length) cnt.textContent = base() + Math.round(o.v); } }, t + .1);
      tl.fromTo(plus, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, ease: 'back.out(2)', immediateRender: false }, t + .3);
      R.at(t + .72, function(){ counted = true; render(); });

      end(sc, R, t + 5, t + 1.6, [{ t: 'Entry', at: 'entry' }, { t: 'Tag', at: 'tag' }, { t: 'Publish', at: 'publish' }, { t: 'Topic page', at: 'count' }]);
      var done = tl.labels.count + 1;

      // live: a suggestion toggles the tag (jumping to the published state first), the JSON-LD and pages follow
      sugB.forEach(function(b, i){ tap(b, function(){
        if (sc.hold) sc.hold();
        if (!counted){ tl.seek(done); if (sc.onSeek) sc.onSeek(); }
        sel[i] = !sel[i]; render();
        ldc.classList.remove('is-flash'); void ldc.offsetWidth; ldc.classList.add('is-flash');
      }); });
      tap(pub, function(){ tl.seek(tl.labels.publish + .5); if (sc.onSeek) sc.onSeek(); if (sc.resume) sc.resume(); });
    });
  })();

  /* ===== mission/24-tw-loom.js ===== */
  /* =========================================================
     TOPICWEAVE · THE LOOM (channel tw-loom)
     A compact port of the v3 site's signature (cks-v3 js/loom.js): short thread fibers in the four weave
     colors fly in and weave the Topicweave mark (the loom's MARK bar geometry, over/under included) beside
     the Home hero, then re-weave through the shapes Home uses per section, each with that section's line:
       scatter (The problem) → threads (Tag once) → graph (Connected) → weave (Your CMS) → night sky
     Positions are a pure function of the timeline time (so phase chips seek cleanly); drawing happens in a
     tween's onUpdate, i.e. only while the scene plays. Click/tap sends a burst + ripple through the threads
     (CKSLoom.burst), a fine pointer parts them gently; both kick a short rAF only while the timeline is paused.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var TAU = Math.PI * 2, PI = Math.PI, HP = Math.PI / 2;
    var LIL = 0, COR = 1, TEA = 2, COB = 3, BONE = 4, WHITE = 5;
    var COLS = [T.C.lilac, T.C.coral, T.C.teal, T.C.cobalt, '#E9E6DF', '#f3f1ff'];
    var LEVELS = 8;
    function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
    function smooth(t){ return t * t * (3 - 2 * t); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    function fract(v){ return v - Math.floor(v); }
    function ease3(v){ return 1 - Math.pow(1 - v, 3); }
    function angleLerp(a, b, t){ var d = (b - a) % PI; if (d > HP) d -= PI; else if (d < -HP) d += PI; return a + d * t; }

    // ---- the loom's MARK (24-unit box, the 2026-10-02 logo) — x0, y0, x1, y1, horizontal ----
    var MARK = [];
    MARK[COR] = [2.5, 6.53, 21.5, 10.75, true];
    MARK[TEA] = [2.5, 13.25, 21.5, 17.47, true];
    MARK[LIL] = [6.53, 2.5, 10.75, 21.5, false];
    MARK[COB] = [13.25, 2.5, 17.47, 21.5, false];
    // lilac over coral · coral over cobalt · teal over lilac · cobalt over teal
    function under(c, gx, gy){
      if (c === COR) return gx > 6.53 && gx < 10.75;
      if (c === COB) return gy > 6.53 && gy < 10.75;
      if (c === LIL) return gy > 13.25 && gy < 17.47;
      if (c === TEA) return gx > 13.25 && gx < 17.47;
      return false;
    }
    // ---- Home's example content (cks-v3 loom.js label sets) ----
    var ISLES = [[-0.95, -0.72], [0.75, -0.9], [1.05, 0.45], [-0.55, 0.78], [0.1, -0.05]];
    var ISLE_N = ['Services page', 'Portfolio', 'Blog', 'FAQ', 'YouTube'];
    var PAGES = ['Services page', 'Riverside Clinic', 'Hale & Partners', 'Blog · 2023', 'FAQ', 'YouTube'];
    var TOPICS = ['Client onboarding', 'Journey mapping', 'Client handoffs'];
    var TLINKS = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2], [3, 0], [3, 2], [4, 0], [5, 1], [5, 2]];
    function py(k){ return -0.85 + (k / 5) * 1.7; }
    function ty(j){ return -0.6 + j * 0.6; }
    var HUBS = ['Professional firms', 'Service design', 'Journey mapping', 'Client handoffs', 'Client onboarding', 'Plain-language UX'];
    var EDGES = [];
    (function(){ for (var p = 0; p < 12; p++){ var a = Math.floor(p / 2); EDGES.push([p, a], [p, (a + 1) % 6]); if (p === 0 || p === 6) EDGES.push([p, (a + 3) % 6]); } })();
    function hubXY(k){ var a = -HP + (k / 6) * TAU; return [Math.cos(a) * 0.42, Math.sin(a) * 0.42]; }
    function pieceXY(p){ var a = -HP + ((p + 0.5) / 12) * TAU; return [Math.cos(a) * 0.98, Math.sin(a) * 0.98]; }
    var MOON = [0, -0.12, 0.3], BITE = [0.14, -0.2, 0.26];

    // ---- the story: one formation per phase, with Home's section line ----
    var PH = [
      { f: 'mark', chip: 'Mark', eb: 'Be known for what you know', h: 'Turn what you know into a site people and AI can follow.', hero: true },
      { f: 'scatter', chip: 'Scattered', eb: 'The problem', h: 'AI answers reward sites that connect the dots. Most don’t.' },
      { f: 'threads', chip: 'Tag once', eb: 'Step two', h: 'Tag once. Get real links.' },
      { f: 'graph', chip: 'Connected', eb: 'Step three', h: 'Then it connects itself.' },
      { f: 'weave', chip: 'Woven', eb: 'No lock-in', h: 'Built into your CMS. Works with your tools.', tags: [['Webflow CMS', LIL], ['WordPress', COB], ['Sanity', TEA], ['Markdown', COR]] },
      { f: 'sky', chip: 'Night', eb: 'While you get on with your day', h: 'It works while you don’t.', clock: '2:00 am' }
    ];
    var START = [0, 5.2, 10, 15, 19.8, 24.6], TR = 1.7, LOOP = 29.6, REST = 4.2;

    SCENE.add('tw-loom', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg, SW = sc.SW, SH = sc.SH;
      var CX = P ? 320 : 820, CY = P ? 505 : 378, RU = P ? 176 : 245; // the shape's stage: center + unit radius
      var N = P ? 340 : 600, reduce = K.reduce;
      var fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);

      // ---- DOM: night backdrop, canvas, brand, captions, chip labels, hint ----
      function chip(txt, col){ return '<span class="tw-lm-chip"><i style="background:' + COLS[col] + '"></i>' + esc(txt) + '</span>'; }
      function lab(ux, uy, txt, col, al){ return '<div class="tw-lm-lab tw-lm-' + al + '" style="left:' + Math.round(CX + ux * RU) + 'px;top:' + Math.round(CY + uy * RU) + 'px">' + chip(txt, col) + '</div>'; }
      var labs = ['', '', '', '', '', ''];
      labs[1] = ISLE_N.map(function(s, k){ return lab(ISLES[k][0], ISLES[k][1] + 0.34, s, k % 4, 'c'); }).join('');
      labs[2] = PAGES.map(function(s, k){ return lab(-0.9, py(k), s, k % 4, 'r'); }).join('') + TOPICS.map(function(s, j){ return lab(0.93, ty(j), s, [LIL, COR, TEA][j], 'l'); }).join('');
      labs[3] = HUBS.map(function(s, k){ var h = hubXY(k), d = Math.sqrt(h[0] * h[0] + h[1] * h[1]) || 1; return lab(h[0] + h[0] / d * 0.2, h[1] + h[1] / d * 0.16, s, (k + 1) % 4, 'c'); }).join('');
      st.innerHTML =
        '<div class="tw-lm-sky"></div><canvas class="tw-lm-cv" aria-hidden="true"></canvas>' +
        '<div class="tw-lm-brand">' + T.LOGO + '</div>' +
        (reduce ? '' : '<div class="tw-lm-hint">' + (fine ? 'Click the threads' : 'Tap the threads') + '</div>') +
        '<div class="tw-lm-copy">' + PH.map(function(p, i){
          return '<div class="tw-lm-cap' + (p.hero ? ' is-hero' : '') + '" data-p="' + i + '"><p class="tw-lm-eb">' + esc(p.eb) + '</p>' +
            (p.hero ? '<h3 class="tw-lm-h1">' : '<h3 class="tw-lm-h2">') + esc(p.h) + '</h3>' +
            (p.tags ? '<div class="tw-lm-tags">' + p.tags.map(function(g){ return chip(g[0], g[1]); }).join('') + '</div>' : '') +
            (p.clock ? '<p class="tw-lm-clock">' + esc(p.clock) + '</p>' : '') + '</div>';
        }).join('') + '</div>' +
        labs.map(function(s, i){ return s ? '<div class="tw-lm-labs" data-p="' + i + '">' + s + '</div>' : ''; }).join('') +
        '<div class="fg-fade"></div>';
      var cv = q(st, '.tw-lm-cv'), ctx = cv.getContext('2d'), caps = qa(st, '.tw-lm-cap'), lsets = qa(st, '.tw-lm-labs'), sky = q(st, '.tw-lm-sky'), hint = q(st, '.tw-lm-hint');
      var DS = Math.min(2, Math.max(1, (sc.k || 1) * (window.devicePixelRatio || 1)));
      cv.width = Math.round(SW * DS); cv.height = Math.round(SH * DS);

      // ---- threads ----
      var seed = 20260930;
      function rnd(){ seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      function F32(){ return new Float32Array(N); }
      var R1 = F32(), R2 = F32(), R3 = F32(), R4 = F32(), R5 = F32(), SX = F32(), SY = F32(), SA = F32(), OX = F32(), OY = F32(), DX = F32(), DY = F32(), MX = F32(), MY = F32();
      var C = new Uint8Array(N), BK = new Int16Array(N), ORDER = new Int32Array(N), NB = COLS.length * LEVELS, CNT = new Int32Array(NB + 1), FILL = new Int32Array(NB + 1);
      var EXA = F32(), EYA = F32();
      var i, s3 = 104729;
      function r3(){ s3 = (s3 * 16807) % 2147483647; return s3 / 2147483647; }
      for (i = 0; i < N; i++){
        var v = rnd();
        C[i] = v < 0.1 ? BONE : Math.min(3, Math.floor((v - 0.1) / 0.225));
        R1[i] = rnd(); R2[i] = rnd(); R3[i] = rnd(); R4[i] = rnd(); R5[i] = rnd();
        // the intro: each fiber flies in from outside the stage
        var th = R5[i] * TAU, far = 1.9 + R2[i] * 1.2;
        SX[i] = Math.cos(th) * far * (SW / RU) * 0.5; SY[i] = Math.sin(th) * far * (SH / RU) * 0.5; SA[i] = R3[i] * PI;
        // the moon: a disc with a bite out of it
        var mx = 0, my = 0;
        for (var n = 0; n < 40; n++){ var a = r3() * TAU, rr = Math.sqrt(r3()) * MOON[2]; mx = MOON[0] + Math.cos(a) * rr; my = MOON[1] + Math.sin(a) * rr; if (Math.sqrt(Math.pow(mx - BITE[0], 2) + Math.pow(my - BITE[1], 2)) > BITE[2]) break; }
        MX[i] = mx; MY[i] = my;
      }

      // ---- formations (unit space, y down), ported from loom.js ----
      var o = [0, 0, 0, 0, 1], Pt = { x: 0, y: 0, a: 0 };
      function set(x, y, a, al, ln){ o[0] = x; o[1] = y; o[2] = a; o[3] = al; o[4] = ln == null ? 1 : ln; }
      function cubic(p0, p1, p2, p3, s){
        var m = 1 - s;
        Pt.x = m * m * m * p0[0] + 3 * m * m * s * p1[0] + 3 * m * s * s * p2[0] + s * s * s * p3[0];
        Pt.y = m * m * m * p0[1] + 3 * m * m * s * p1[1] + 3 * m * s * s * p2[1] + s * s * s * p3[1];
        var dx = 3 * m * m * (p1[0] - p0[0]) + 6 * m * s * (p2[0] - p1[0]) + 3 * s * s * (p3[0] - p2[0]);
        var dy = 3 * m * m * (p1[1] - p0[1]) + 6 * m * s * (p2[1] - p1[1]) + 3 * s * s * (p3[1] - p2[1]);
        Pt.a = Math.atan2(dy, dx);
      }
      function knot(i, cx, cy, rad, t, al){ var th = R1[i] * TAU + t * (R5[i] - 0.5) * 0.8, rr = rad * Math.sqrt(R2[i]); set(cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, th + HP, al); }
      function drift(i, t, spread, al){
        set((R1[i] * 2 - 1) * spread + Math.sin(t * 0.07 + R3[i] * 9) * 0.08, (R2[i] * 2 - 1) * spread * 0.62 + Math.cos(t * 0.06 + R4[i] * 9) * 0.08,
          R3[i] * PI + t * 0.05 * (R5[i] - 0.5), al * (0.5 + 0.5 * R5[i]));
      }
      var F = {
        mark: function(i, t){
          var c = C[i]; if (c === BONE) return drift(i, t, P ? 1.7 : 2.4, 0.3);
          var b = MARK[c], along = fract(R1[i] + t * 0.035 * (c % 2 ? 1 : -1) * (0.8 + R4[i] * 0.4)), across = R2[i];
          var wob = Math.sin(along * 9 + t * 1.1 + c) * 0.24, gx, gy, a;
          if (b[4]){ gx = b[0] + (b[2] - b[0]) * along; gy = b[1] + 0.35 + (b[3] - b[1] - 0.7) * across + wob; a = 0; }
          else { gy = b[1] + (b[3] - b[1]) * along; gx = b[0] + 0.35 + (b[2] - b[0] - 0.7) * across + wob; a = HP; }
          var tilt = Math.sin(t * 0.25) * 0.05, x = (gx - 12) / 11.2, y = (gy - 12) / 11.2, cs = Math.cos(tilt), sn = Math.sin(tilt);
          set(x * cs - y * sn, x * sn + y * cs, a + tilt + (R3[i] - 0.5) * 0.3, under(c, gx, gy) ? 0.14 : 0.95, 1.2);
        },
        scatter: function(i, t){
          if (R4[i] < 0.34) return drift(i, t, P ? 1.7 : 2.3, 0.4);
          var k = i % 5, c = ISLES[k], th = R1[i] * TAU + t * 0.04 * (k % 2 ? 1 : -1), rr = 0.26 * Math.sqrt(R2[i]);
          set(c[0] + Math.cos(th) * rr, c[1] + Math.sin(th) * rr * 0.8, R3[i] * PI + t * 0.1, 0.75);
        },
        threads: function(i, t){
          if (R4[i] < 0.2){ var left = R3[i] < 0.62, k = left ? i % 6 : i % 3; return knot(i, left ? -0.8 : 0.8, left ? py(k) : ty(k), left ? 0.05 : 0.09, t, 0.9); }
          var e = TLINKS[i % TLINKS.length], y0 = py(e[0]), y1 = ty(e[1]);
          cubic([-0.8, y0], [-0.15, y0], [0.15, y1], [0.8, y1], fract(R1[i] + t * 0.05));
          var sp = (R2[i] - 0.5) * 0.035;
          set(Pt.x - Math.sin(Pt.a) * sp, Pt.y + Math.cos(Pt.a) * sp, Pt.a, 0.85);
        },
        graph: function(i, t){
          var r = R4[i], h, a, b;
          if (r < 0.2){ h = hubXY(i % 6); return knot(i, h[0], h[1], 0.1, t, 0.95); }
          if (r < 0.32){ h = pieceXY(i % 12); return knot(i, h[0], h[1], 0.045, t, 0.8); }
          var e = EDGES[i % EDGES.length]; a = pieceXY(e[0]); b = hubXY(e[1]);
          var mx = (a[0] + b[0]) / 2 * 0.9, my = (a[1] + b[1]) / 2 * 0.9;
          cubic(a, [mx, my], [mx, my], b, fract(R1[i] + t * 0.04 * (R5[i] < 0.5 ? 1 : -1)));
          set(Pt.x, Pt.y, Pt.a, 0.62);
        },
        weave: function(i, t){
          var c = C[i]; if (c === BONE) return drift(i, t, P ? 1.7 : 2.3, 0.3);
          var n = 9, vert = c === LIL || c === COB, j = i % n, lane = -0.88 + (j / (n - 1)) * 1.76, along = -0.95 + R1[i] * 1.9;
          var wave = Math.sin(along * 3 + t * 0.7 + j) * 0.03, x = vert ? lane + wave : along, y = vert ? along : lane + wave;
          var gx = Math.round((x + 0.88) / 0.22), gy = Math.round((y + 0.88) / 0.22);
          var near = Math.abs(x - (-0.88 + gx * 0.22)) < 0.06 && Math.abs(y - (-0.88 + gy * 0.22)) < 0.06, top = (gx + gy) % 2 === 0 ? vert : !vert;
          var yaw = Math.sin(t * 0.18) * 0.35, z = x * Math.sin(yaw), persp = 1 / (1 + z * 0.35);
          set(x * Math.cos(yaw) * persp, y * persp, vert ? HP : 0, near && !top ? 0.12 : 0.9);
        },
        sky: function(i, t){
          var g = i % 20;
          if (g < 8){ var nx = MX[i] + Math.sin(t * 0.6 + R3[i] * 9) * 0.004; return set(nx, MY[i], Math.atan2(MY[i] - MOON[1], nx - MOON[0]) + HP, 1, 1.05); }
          var x = (-CX + R3[i] * SW) / RU, y = (-CY + R5[i] * SH) / RU;
          var near = Math.sqrt(Math.pow(x - MOON[0], 2) + Math.pow(y - MOON[1], 2)) < MOON[2] + 0.1;
          if (g === 15){ // a shooting star every few seconds: a bright head with a fading tail
            var per = 4, k = Math.floor(t / per), ph = t - k * per, dur = 0.9, pr = clamp(ph / dur, 0, 1);
            var hs1 = fract(Math.sin(k * 12.9898 + 78.233) * 43758.5453), dir = hs1 < 0.5 ? -1 : 1, ang = 0.45 + hs1 * 0.2;
            var head = smooth(pr) * 0.9, d = Math.max(0, head - R1[i] * 0.32 * Math.min(1, pr * 3)), x0 = dir * 0.62, y0 = -0.75;
            return set(x0 + Math.cos(ang) * dir * d, y0 + Math.sin(ang) * d, Math.atan2(Math.sin(ang), Math.cos(ang) * dir), ph < dur ? (1 - R1[i]) * Math.sin(pr * PI) * 1.1 : 0, 0.9);
          }
          set(x, y, R2[i] * PI, near ? 0 : 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + R1[i] * 40)), 0.4);
        }
      };

      // ---- interaction state ----
      var mxp = -9999, myp = -9999, bAt = -1, bx = 0, by = 0, lastNow = 0, raf = 0;
      function toStage(e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * SW, (e.clientY - r.top) / r.height * SH]; }
      function idle(){ return !sc.tl || sc.tl.paused(); }
      // while the timeline is paused, a click or pointer still animates: a short rAF that stops once the threads settle
      function kick(){
        if (raf || !idle()) return;
        lastNow = 0;
        raf = requestAnimationFrame(function step(){
          raf = 0; if (!cv.isConnected || !idle()) return;
          var busy = render();
          if (busy) raf = requestAnimationFrame(step);
        });
      }
      if (!reduce){
        cv.addEventListener('pointerdown', function(e){
          var p = toStage(e); bx = p[0]; by = p[1]; bAt = performance.now();
          for (var i = 0; i < N; i++){
            var dx = DX[i] - bx, dy = DY[i] - by, d = Math.sqrt(dx * dx + dy * dy) || 1, f = 34 * (0.35 + R3[i]) * (1 - smooth(clamp(d / 620, 0, 1)));
            OX[i] += dx / d * f; OY[i] += dy / d * f;
          }
          if (hint) hint.classList.add('is-used');
          kick();
        });
        if (fine){
          cv.addEventListener('pointermove', function(e){ var p = toStage(e); mxp = p[0]; myp = p[1]; kick(); });
          cv.addEventListener('pointerleave', function(){ mxp = myp = -9999; });
        }
      }

      // ---- one frame at the timeline's current time ----
      var tl;
      function render(){
        if (!tl || !cv.isConnected) return false;
        var t = tl.time(), now = performance.now(), dt = lastNow ? clamp((now - lastNow) / 1000, 0, 0.05) : 0.016, FR = dt * 60;
        lastNow = now;
        var ph = 0; for (var k = 1; k < START.length; k++) if (t >= START[k]) ph = k;
        var loc = t - START[ph], fa = F[PH[ph].f], fb = null, bt = 1;
        if (ph > 0 && loc < TR){ fb = fa; fa = F[PH[ph - 1].f]; bt = loc / TR; }
        var nightA = PH[ph].f === 'sky', nightB = ph > 0 && PH[ph - 1].f === 'sky';
        var el = bAt > 0 ? (now - bAt) / 1000 : 9, ripOn = el < 1.6, busy = ripOn;
        var baseLen = P ? 11 : 12, copyEdge = P ? 300 : (ph === 0 ? 560 : 500);
        var i, ux, uy, ang, al, ln, ti;
        for (i = 0; i < N; i++){
          fa(i, t); ux = o[0]; uy = o[1]; ang = o[2]; al = o[3]; ln = o[4];
          var col = C[i];
          if (ph === 0){ // the intro: fly in from outside and settle into the mark, each fiber at its own moment
            var pi = ease3(clamp((t - 0.15 - R1[i] * 1.5) / 1.15, 0, 1));
            if (pi < 1){
              var sw = Math.sin(pi * PI) * 0.25;
              ux = lerp(SX[i], ux, pi) + Math.sin(R2[i] * 30 + t * 2) * sw; uy = lerp(SY[i], uy, pi) + Math.cos(R4[i] * 30 + t * 2) * sw;
              ang = angleLerp(SA[i], ang, pi); al = lerp(0.35, al, pi); ln = lerp(1.6, ln, pi);
            }
          } else if (fb){
            fb(i, t); ti = smooth(clamp(bt * 1.6 - R4[i] * 0.6, 0, 1));
            ux = lerp(ux, o[0], ti); uy = lerp(uy, o[1], ti); ang = angleLerp(ang, o[2], ti); al = lerp(al, o[3], ti); ln = lerp(ln, o[4], ti);
            var loose = Math.sin(ti * PI) * 0.18; ux += Math.sin(R1[i] * 40 + t) * loose; uy += Math.cos(R2[i] * 40 + t) * loose;
            if (nightA && ti > 0.5) col = WHITE;
          }
          if (nightA && !fb) col = WHITE;
          if (nightB && fb && ti < 0.5) col = WHITE;
          var x = CX + ux * RU, y = CY + uy * RU;
          // pointer: fibers part around the cursor; burst offsets ease back
          if (mxp > -999){
            var dx = x + OX[i] - mxp, dy = y + OY[i] - myp, d2 = dx * dx + dy * dy;
            if (d2 < 8100){ var dd = Math.sqrt(d2) || 1, f = (1 - dd / 90) * 4.2; OX[i] += dx / dd * f * FR; OY[i] += dy / dd * f * FR; busy = true; }
          }
          var dk = Math.pow(0.92, FR); OX[i] *= dk; OY[i] *= dk;
          if (OX[i] > 0.3 || OX[i] < -0.3 || OY[i] > 0.3 || OY[i] < -0.3) busy = true;
          x += OX[i]; y += OY[i]; DX[i] = x; DY[i] = y;
          // fade near the copy and the stage edges (loom.js mask(), simplified)
          var m = P ? clamp((y - copyEdge) / 80, 0.15, 1) : clamp((x - copyEdge) / 110, 0.15, 1);
          if (nightA && !fb) m = Math.max(m, 0.55);
          m *= clamp(Math.min(x, SW - x, y, SH - y) / 50, 0, 1);
          var tw = reduce ? 1 : 0.8 + 0.2 * Math.sin(t * 1.7 + R5[i] * 30), rip = 0;
          if (ripOn){ var rd = Math.sqrt((x - bx) * (x - bx) + (y - by) * (y - by)), fr = el * 620, q2 = (rd - fr) / 55; rip = Math.exp(-q2 * q2) * (1 - el / 1.6); }
          var alpha = Math.min(1, al * m * tw + rip * m);
          if (alpha < 0.03){ BK[i] = -1; continue; }
          BK[i] = col * LEVELS + clamp(Math.round(alpha * LEVELS), 1, LEVELS) - 1;
          var hl = baseLen * ln * (1 + rip * 1.5) * (0.7 + R3[i] * 0.6) * 0.5;
          EXA[i] = Math.cos(ang) * hl; EYA[i] = Math.sin(ang) * hl;
        }
        // draw: one stroke per color × opacity step
        ctx.setTransform(DS, 0, 0, DS, 0, 0); ctx.clearRect(0, 0, SW, SH);
        ctx.lineCap = 'round'; ctx.lineWidth = P ? 1.7 : 1.6;
        var b;
        for (b = 0; b <= NB; b++) CNT[b] = 0;
        for (i = 0; i < N; i++) if (BK[i] >= 0) CNT[BK[i] + 1]++;
        for (b = 0; b < NB; b++) CNT[b + 1] += CNT[b];
        for (b = 0; b <= NB; b++) FILL[b] = CNT[b];
        for (i = 0; i < N; i++) if (BK[i] >= 0) ORDER[FILL[BK[i]]++] = i;
        for (b = 0; b < NB; b++){
          if (CNT[b] === CNT[b + 1]) continue;
          ctx.strokeStyle = COLS[Math.floor(b / LEVELS)]; ctx.globalAlpha = ((b % LEVELS) + 1) / LEVELS; ctx.beginPath();
          for (var j = CNT[b]; j < CNT[b + 1]; j++){ i = ORDER[j]; ctx.moveTo(DX[i] - EXA[i], DY[i] - EYA[i]); ctx.lineTo(DX[i] + EXA[i], DY[i] + EYA[i]); }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        return busy;
      }

      // ---- the timeline ----
      var R = X.run(sc, function(){ lastNow = 0; });
      tl = R.tl;
      tl.set(caps.concat(lsets), { autoAlpha: 0 }, 0).set(sky, { autoAlpha: 0 }, 0).set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0);
      var drv = { v: 0 };
      tl.to(drv, { v: 1, duration: LOOP + 0.5, ease: 'none', onUpdate: render }, 0);
      PH.forEach(function(p, n){
        var s = START[n], e = n < PH.length - 1 ? START[n + 1] : LOOP;
        tl.addLabel('p' + n, s);
        var c = caps[n], inner = qa(c, '.tw-lm-eb,h3,.tw-lm-tags,.tw-lm-clock'), at = n === 0 ? 1.2 : s + 0.55;
        tl.fromTo(c, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, at);
        tl.fromTo(inner, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', immediateRender: false }, at);
        if (n < PH.length - 1) tl.to(c, { autoAlpha: 0, y: -10, duration: 0.4, ease: 'power1.in' }, e - 0.35).set(c, { y: 0 }, e + 0.1);
        var ls = q(st, '.tw-lm-labs[data-p="' + n + '"]');
        if (ls){
          tl.fromTo(qa(ls, '.tw-lm-lab'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, stagger: 0.06, immediateRender: false }, s + 1.3);
          tl.fromTo(ls, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, s + 1.29);
          tl.to(ls, { autoAlpha: 0, duration: 0.3 }, e - 0.3);
        }
      });
      // night: the navy sky comes up behind the threads (the site's day-to-night section, at 2 am)
      tl.fromTo(sky, { autoAlpha: 0 }, { autoAlpha: 1, duration: TR, ease: 'power1.inOut', immediateRender: false }, START[5]);
      X.end(sc, R, LOOP, REST, PH.map(function(p, n){ return { t: p.chip, at: 'p' + n }; }));
      // seek() suppresses the driver's onUpdate: redraw after every chip / reduced-motion seek
      var os = sc.onSeek; sc.onSeek = function(){ os(); lastNow = 0; render(); };
      render();
    });
  })();

  /* ===== mission/24-tw-plan.js ===== */
  /* =========================================================
     TOPICWEAVE · SITE PLAN (channel tw-plan)
     The ideation board on a dark FigJam canvas: three lanes (Plan / Design / Build) of stickies typed in by a
     cursor, then four threads woven through one sticky per lane. Every sticky is a real v3 decision
     (cks-v3/docs/handoff.md + qa-log.md). Hover a thread in the legend (or a sticky) to trace it; click a sticky
     to bring it forward.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var pth = X.path, hide = X.hide, draw = X.draw, type = X.type, move = X.move, run = X.run, end = X.end, cursor = X.cursor;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    // lanes of stickies: [name, subtitle, [[title (≤ 6 words), one line of detail]]]
    var PL = [
      ['Plan', 'what the site has to do', [
        ['Rename CKS to Topicweave', 'A free name: USPTO clear, topicweave.com and .io registered.'],
        ['Be known for what you know', 'Everything you know, connected, in your own words.'],
        ['Every round checked on a phone', 'Notes from my phone and laptop; every fix checked at 390 and 1440.'],
        ['Join the beta, pricing TBD', 'Installs by hand at a beta price, for honest feedback.']]],
      ['Design', 'the look, locked Oct 1', [
        ['The loom is the signature', 'About 1,700 threads re-weave into a shape per section.'],
        ['Lilac replaces saffron', 'No more mustard: the mark’s bar and one thread go #9B87F5.'],
        ['Sample data, labeled on screen', 'Every prototype screen says Example data. No fake numbers.'],
        ['Glass tiles for the phone nav', 'The mark, the theme switch and a three-bar branded menu.']]],
      ['Build', 'coded by hand, no framework', [
        ['Plain HTML, CSS and JS', 'Coded by hand from the wireframes. No framework.'],
        ['Prototypes before the app', 'Four clickable prototypes get approved before Phase 0.'],
        ['Page-change cloth on phones only', 'Desktop gets a plain fade; the full cloth was too much on big screens.'],
        ['One cloth, site to prototypes', 'The prototypes reuse the site’s own weave code.']]]
    ];
    // four ideas that run through the decisions: [name, color, sticky column per lane]
    var TH = [['The weave', T.WEAVE[0], [1, 0, 3]], ['One identity', T.WEAVE[1], [0, 1, 0]], ['Show, don’t promise', T.WEAVE[2], [3, 2, 1]], ['Phones first', T.WEAVE[3], [2, 3, 2]]];

    SCENE.add('tw-plan', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      var L = P ? { x: 16, w: 608, top: 84, h: 200, gap: 10, sw: 138, sh: 138, sx: 10, sy: 48, step: 148 }
                : { x: 36, w: 1128, top: 62, h: 198, gap: 18, sw: 214, sh: 136, sx: 64, sy: 50, step: 272 };
      function laneY(i){ return L.top + i * (L.h + L.gap); }
      function stick(li, ci){ return { x: L.x + L.sx + ci * L.step, y: laneY(li) + L.sy }; }
      // threads run down each note's left edge, so a stitch over the note never crosses its text
      function center(li, ci){ var p = stick(li, ci); return { x: p.x + 11, y: p.y + L.sh / 2 }; }
      var html = '<div class="tw-pl-bg"></div><div class="tw-pl-file">' + T.ICON + '<b>Topicweave — Site plan</b><em>FigJam</em></div>' +
        '<div class="tw-pl-tools"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="tw-pl-cap">Four threads run through every decision.</div>' +
        '<svg class="tw-pl-thr" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>';
      PL.forEach(function(ln, li){
        html += '<div class="tw-pl-lane" style="left:' + L.x + 'px;top:' + laneY(li) + 'px;width:' + L.w + 'px;height:' + L.h + 'px"><span><b>0' + (li + 1) + ' · ' + ln[0] + '</b>' + esc(ln[1]) + '</span></div>';
        ln[2].forEach(function(n, ci){
          var p = stick(li, ci), th = [];
          TH.forEach(function(t, k){ if (t[2][li] === ci) th.push(k); });
          html += '<div class="tw-pl-st" data-l="' + li + '" data-th="' + th.join(' ') + '" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + L.sw + 'px;height:' + L.sh + 'px;--c:' + TH[th[0]][1] + ';--r:' + ((li * 4 + ci) % 3 - 1) * 1.1 + 'deg"><b data-t="' + esc(n[0]) + '"></b><p>' + esc(n[1]) + '</p><em>Angelino</em></div>';
        });
      });
      html += '<svg class="tw-pl-over" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-pl-leg">' + TH.map(function(t, i){ return '<button type="button" data-th="' + i + '" style="--c:' + t[1] + '"><i></i>' + esc(t[0]) + '</button>'; }).join('') + '</div>' +
        cursor('a', 'Angelino') + '<div class="fg-fade"></div>';
      st.innerHTML = html;
      var svg = q(st, '.tw-pl-thr'), over = q(st, '.tw-pl-over'), lanes = qa(st, '.tw-pl-lane'), sts = qa(st, '.tw-pl-st'), leg = qa(st, '.tw-pl-leg button'), cap = q(st, '.tw-pl-cap'), cur = q(st, '.cur.a');
      // each thread: in from the top, through its three stickies (swaying as it goes), out at the bottom
      var paths = [], stitches = [];
      TH.forEach(function(t, ti){
        var pts = [{ x: center(0, t[2][0]).x + (ti % 2 ? 26 : -26), y: L.top - 14 }].concat(t[2].map(function(c, li){ return center(li, c); }));
        var last = pts[pts.length - 1]; pts.push({ x: last.x + (ti % 2 ? -26 : 26), y: laneY(2) + L.h + 12 });
        var d = 'M' + pts[0].x + ' ' + pts[0].y;
        for (var k = 1; k < pts.length; k++){ var a = pts[k - 1], b = pts[k], my = (a.y + b.y) / 2, sw = (k % 2 ? 1 : -1) * (ti % 2 ? 22 : -22); d += 'C' + (a.x + sw) + ' ' + my + ' ' + (b.x - sw) + ' ' + my + ' ' + b.x + ' ' + b.y; }
        var p = pth(svg, d, 'tw-pl-t'); p.style.stroke = t[1]; p.setAttribute('data-th', ti); paths.push(p);
        // over / under: on alternate stickies the thread is stitched across the face of the note
        t[2].forEach(function(c, li){ if ((li + ti) % 2) return; var m = center(li, c), s = pth(over, 'M' + m.x + ' ' + (m.y - L.sh / 2 - 8) + 'L' + m.x + ' ' + (m.y + L.sh / 2 + 8), 'tw-pl-t is-over'); s.style.stroke = t[1]; s.setAttribute('data-th', ti); stitches.push(s); });
      });
      var marks = qa(st, '[data-th]');
      function light(k){
        st.classList.toggle('pl-hl', k != null);
        marks.forEach(function(e){ var ks = (e.getAttribute('data-th') || '').split(' '); e.classList.toggle('hl', k != null && ks.indexOf(String(k)) > -1); });
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

  /* ===== mission/24-tw-roadmap.js ===== */
  /* =========================================================
     TOPICWEAVE · ROADMAP (channel tw-roadmap)
     The v3 Roadmap page (cks-v3/src/roadmap.html): five build phases on a rail, a thread advancing knot to
     knot; each phase's real prototype screen slides into a glass frame with its title and one line from the page.
     Screens are the page's own dark screenshots (code/vendor/topicweave/roadmap/), loaded on first play.
     Click a phase on the rail to jump to it and hold.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc;
    var pth = X.path, hide = X.hide, draw = X.draw, run = X.run, end = X.end;
    function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }

    // [label, title, one line from the page, screenshot, what it delivers (handoff build plan), short chip]
    var PH = [
      ['Phase 0 · Now', 'The groundwork.', 'Sign-in, a workspace for each site, and the connections everything else stands on: your CMS and Google Search Console.', 'connections-dark.webp', ['Sign-in', 'Workspaces', 'CMS + Search Console'], 'Groundwork'],
      ['Phase 1 · With the first beta sites', 'Prove it works.', 'Your vocabulary imported from the site, link health checked every night, Search Console grouped by your topics, and a plain-language email on the 1st.', 'topics-dark.webp', ['Vocabulary import', 'Link health', 'Topic report', 'Monthly email'], 'Prove it'],
      ['Phase 2', 'Keep the library growing.', 'A review queue with a before and after and one-click undo, drafts in your voice from the Voice Kit, search ideas, and capture by email.', 'review-dark.webp', ['Review queue', 'Voice Kit drafts', 'Search ideas', 'Email capture'], 'Grow'],
      ['Phase 3', 'See what assistants see.', 'A cookieless counter for visits sent by ChatGPT, Perplexity, Claude and Gemini, a monthly assistant sample, and Topicweave Capture on your phone.', 'ai-dark.webp', ['AI visit counter', 'Assistant sample', 'Capture on a phone'], 'Measure'],
      ['Phase 4', 'Beyond one site.', 'The panel inside your CMS editor, a WordPress connector, and one login for agencies running Topicweave for their own clients.', 'cms-dark.webp', ['CMS panel', 'WordPress', 'Agency login'], 'Widen']
    ];

    SCENE.add('tw-roadmap', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg, N = PH.length;
      // rail: vertical on the left (landscape), horizontal under the frame (portrait)
      var F = P ? { x: 20, y: 112, w: 600, ih: 360 } : { x: 420, y: 104, w: 740, ih: 448 };
      var knots = PH.map(function(p, i){ return P ? { x: 60 + i * 130, y: 628 } : { x: 62, y: 196 + i * 110 }; });
      var html = '<div class="tw-rm-bg"></div>' +
        '<div class="tw-rm-head"><span>Roadmap</span><h3>Where Topicweave is headed.</h3></div>' +
        '<svg class="tw-rm-svg" viewBox="0 0 ' + sc.SW + ' ' + sc.SH + '" aria-hidden="true"></svg>' +
        '<div class="tw-rm-rail">' + PH.map(function(p, i){
          var k = knots[i];
          return '<button type="button" class="tw-rm-k" data-i="' + i + '" style="left:' + k.x + 'px;top:' + k.y + 'px" aria-label="' + esc(p[0] + ': ' + p[1]) + '"><i></i><span>' + esc(P ? 'Phase ' + i : p[0]) + '</span><b>' + esc(p[1]) + '</b></button>';
        }).join('') + '</div>' +
        '<div class="tw-rm-frame" style="left:' + F.x + 'px;top:' + F.y + 'px;width:' + F.w + 'px">' +
          '<div class="tw-rm-shots" style="height:' + F.ih + 'px">' + PH.map(function(p, i){
            return '<div class="tw-rm-shot" data-i="' + i + '"><img alt="" data-src="' + esc(p[3]) + '" decoding="async">' + (i === 3 ? '<img class="tw-rm-phone" alt="" data-src="phone-dark.webp" decoding="async">' : '') + '</div>';
          }).join('') + '<em class="tw-rm-tag">Prototype · sample data</em></div>' +
          '<div class="tw-rm-caps">' + PH.map(function(p, i){
            return '<div class="tw-rm-cap" data-i="' + i + '"><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b><p>' + esc(p[2]) + '</p><div class="tw-rm-chips">' + p[4].map(function(c){ return '<i>' + esc(c) + '</i>'; }).join('') + '</div></div>';
          }).join('') + '</div>' +
        '</div><div class="fg-fade"></div>';
      st.innerHTML = html;
      var svg = q(st, '.tw-rm-svg'), ks = qa(st, '.tw-rm-k'), shots = qa(st, '.tw-rm-shot'), caps = qa(st, '.tw-rm-cap'), imgs = qa(st, '.tw-rm-shot img'), head = q(st, '.tw-rm-head');
      // the base track (a faint hairline) and the thread, one segment per step, swaying between knots
      var segs = [], base = '';
      for (var i = 1; i < N; i++){
        var a = knots[i - 1], b = knots[i], sw = (i % 2 ? 1 : -1) * 12, d;
        if (P){ var mx = (a.x + b.x) / 2; d = 'M' + a.x + ' ' + a.y + 'C' + mx + ' ' + (a.y + sw) + ' ' + mx + ' ' + (b.y - sw) + ' ' + b.x + ' ' + b.y; }
        else { var my = (a.y + b.y) / 2; d = 'M' + a.x + ' ' + a.y + 'C' + (a.x + sw) + ' ' + my + ' ' + (b.x - sw) + ' ' + my + ' ' + b.x + ' ' + b.y; }
        base += d;
        segs.push(d);
      }
      var tr = document.createElementNS('http://www.w3.org/2000/svg', 'path'); tr.setAttribute('d', base); tr.setAttribute('class', 'tw-rm-track'); svg.appendChild(tr);
      // the thread comes in from above / the left before the first knot
      var k0 = knots[0], lead = pth(svg, P ? 'M' + (k0.x - 44) + ' ' + (k0.y - 18) + 'C' + (k0.x - 24) + ' ' + (k0.y - 18) + ' ' + (k0.x - 20) + ' ' + k0.y + ' ' + k0.x + ' ' + k0.y : 'M' + (k0.x - 18) + ' ' + (k0.y - 50) + 'C' + (k0.x - 18) + ' ' + (k0.y - 26) + ' ' + k0.x + ' ' + (k0.y - 24) + ' ' + k0.x + ' ' + k0.y, 'tw-rm-thr');
      var thr = segs.map(function(d, i){ var p = pth(svg, d, 'tw-rm-thr'); p.style.stroke = T.WEAVE[(i + 1) % 4]; return p; });
      lead.style.stroke = T.WEAVE[0];
      // images load the first time the scene plays (never at build)
      function load(){ imgs.forEach(function(im){ if (!im.getAttribute('src')) im.setAttribute('src', T.asset('roadmap/' + im.getAttribute('data-src'))); }); }
      function mark(n){ ks.forEach(function(k, i){ k.classList.toggle('done', i < n); k.classList.toggle('on', i === n); k.setAttribute('aria-current', i === n ? 'step' : 'false'); }); }
      var R = run(sc, function(){ mark(-1); }), tl = R.tl;
      R.at(.01, load);
      tl.set(q(st, '.fg-fade'), { autoAlpha: 0 }, 0).set(shots.concat(caps), { autoAlpha: 0 }, 0);
      [lead].concat(thr).forEach(function(p){ hide(R, p); });
      tl.fromTo(head, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .1);
      tl.fromTo(ks, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, stagger: .08, immediateRender: false }, .25);
      tl.fromTo(q(st, '.tw-rm-frame'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, .3);
      var t = .8, HOLD = 4.2, phases = [];
      PH.forEach(function(p, i){
        tl.addLabel('p' + i, t);
        phases.push({ t: P ? 'P' + i : p[5], at: 'p' + i });
        draw(R, i ? thr[i - 1] : lead, t, .8);
        (function(n){ R.at(t + .75, function(){ mark(n); }); })(i);
        if (i) {
          tl.to(shots[i - 1], { autoAlpha: 0, x: -40, duration: .45, ease: 'power2.in' }, t + .3);
          tl.to(caps[i - 1], { autoAlpha: 0, y: -8, duration: .3 }, t + .3);
        }
        tl.fromTo(shots[i], { autoAlpha: 0, x: 60, scale: 1.02 }, { autoAlpha: 1, x: 0, scale: 1, duration: .7, ease: 'power3.out', immediateRender: false }, t + .7);
        tl.fromTo(caps[i], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, immediateRender: false }, t + .9);
        tl.fromTo(qa(caps[i], '.tw-rm-chips i'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .1, immediateRender: false }, t + 1.2);
        if (i === 3) tl.fromTo(q(shots[i], '.tw-rm-phone'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: false }, t + 1.5);
        t += HOLD;
      });
      end(sc, R, t + .4, tl.labels.p0 + 2.6, phases);
      // interactive: a phase on the rail jumps there (its screen in place) and holds
      ks.forEach(function(k, i){ tap(k, function(){ if (sc.hold) sc.hold(); load(); tl.seek(tl.labels['p' + i] + 2.4); if (sc.onSeek) sc.onSeek(); }); });
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
  // phones: the switcher is one swipeable row (ab-core.css); start it with the current mission in view (scrollLeft, not
  // scrollIntoView, which would also scroll the page) and drop the edge fade at the end of the row
  (function(){
    // measured from the link's box: the list items are display:contents, so they have no offsets of their own
    var row = $('#mswitch .w-dyn-items'), cur = LIST[MI] && LIST[MI].el; if (!row) return;
    function end(){ row.classList.toggle('is-end', row.scrollLeft + row.clientWidth >= row.scrollWidth - 4); }
    if (cur && row.scrollWidth > row.clientWidth) row.scrollLeft = Math.max(0, cur.getBoundingClientRect().left - row.getBoundingClientRect().left - 16);
    end(); row.addEventListener('scroll', end, { passive: true });
  })();
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
    // coded scenes are picked by channel id (the CMS Kind option can't gain values via the API); tw-* ids are their own kind
    return { id: cid, kind: (/^tw-/.test(cid) ? cid : ({ sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable' })[cid]) || (it.getAttribute('data-kind') || 'img').toLowerCase(), mode: (it.getAttribute('data-mode') || '').toLowerCase(),
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
    var host = $('[data-mf="host"]'); if (host) host.textContent = M.live ? M.live.replace(/^https?:\/\//, '').replace(/\/$/, '') : isSystem ? 'Add-on · any Webflow site' : M.mock && M.mock.tw ? 'Product site · in beta' : 'Self-initiated identity';
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
    // phones: a smaller drop (from 2.2x the stamp ran past the screen edge) and no impact jolt (it read as the cards
    // wobbling, Angelino 2026-10-06). The waiting size is set inline too: the Missions head (CSS link) can't be
    // rewritten by API, so the CSS twin of this rule only ships with the next Designer CSS bump
    var narrow = innerWidth < 768, stp = $('.ab_stamp', a);
    a.classList.add('pre');
    if (narrow && stp) stp.style.transform = 'rotate(-8deg) scale(1.5)';
    ScrollTrigger.create({ trigger: a, start: 'top 78%', once: true, onEnter: function(){
      gsap.delayedCall((i % 2) * .18, function(){
        a.classList.remove('pre');
        gsap.fromTo(stp, { scale: narrow ? 1.5 : 2.2, opacity: 0, rotation: -18 }, { scale: 1, opacity: .9, rotation: -8, duration: .45, ease: 'back.out(2.2)' });
        if (!narrow) gsap.fromTo(a, { x: -3 }, { x: 0, duration: .3, ease: 'elastic.out(1,.3)', delay: .35 });
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
    else if (suf && /^[–-]/.test(suf)){
      // a range (30–60, 10–15): the full "30–60" must fit its column on one line, so it's set first, measured and shrunk
      // to fit (AB.fitWide), then counted up here (core's counter would measure "0")
      var rT = +v, full = rT + suf; n.removeAttribute('data-count'); n.style.whiteSpace = 'nowrap'; n.textContent = full;
      // measured on the final text whenever the column has a width (load, fonts, resize, scrolling in)
      var fit = function(){
        var cur = n.textContent; n.textContent = full; n.style.fontSize = '';
        var cw = n.clientWidth, sw = n.scrollWidth;
        if (cw && sw > cw + 1) n.style.fontSize = Math.max(26, Math.floor(parseFloat(getComputedStyle(n).fontSize) * cw / sw * .97)) + 'px';
        n.textContent = cur;
      };
      fit(); var rlw = innerWidth;
      addEventListener('resize', function(){ if (innerWidth !== rlw){ rlw = innerWidth; fit(); } });
      if (document.fonts) document.fonts.ready.then(fit);
      if (window.ScrollTrigger) ScrollTrigger.create({ trigger: n, start: 'top bottom', once: true, onEnter: fit });
      if (!reduce && hasGsap && window.ScrollTrigger){
        var ro = { v: 0 }; n.textContent = '0' + suf;
        ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true, onEnter: function(){ fit(); gsap.to(ro, { v: rT, duration: 1.6, ease: 'power3.out', onUpdate: function(){ n.textContent = Math.round(ro.v) + suf; } }); } });
      }
    }
    else n.textContent = v + (suf || '');
  });

  /* ---------- stack orbit (Tools the mission ran on) ---------- */
  (function(){
    var orbit = $('#stkOrbit'); if (!orbit) return;
    var TOOLC = { 'webflow': '#146EF5', 'client-first': '#4353FF', 'gsap': '#0AE448', 'three.js': '#FFFFFF', 'lenis': '#FF98A2', 'unicorn studio': '#7C5CFF', 'github': '#F0F6FC', 'd3': '#F9A03C', 'figma': '#A259FF', 'webflow cms': '#146EF5', 'finsweet': '#161616', 'claude': '#D97757', 'pen + paper': '#F2F0EA', 'photoshop': '#31A8FF', 'illustrator': '#FF9A00', 'vercel': '#FFFFFF', 'supabase': '#3ECF8E', 'resend': '#F2F0EA', 'hostinger': '#673DE6' };
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
      // Topicweave (was CKS; the old slug stays keyed until the item's slug change is published)
      'topicweave': ['woven', '#000000', '#FFFFFF', '#9B87F5', 'linear-gradient(135deg,#9B87F5,#4F7BFF)', '#3A3A3A'],
      'cks': ['woven', '#000000', '#FFFFFF', '#9B87F5', 'linear-gradient(135deg,#9B87F5,#4F7BFF)', '#3A3A3A'],
      'kip': ['build', '#FFF4E6', '#1E1B2E', '#FF7A45', 'linear-gradient(135deg,#FFC94A,#5FD3A8)', '#E6D3BD']
    };
    var TS = TSTYLE[SLUG] || ['blueprint'], THREADS = ['#9B87F5', '#EF5B3F', '#139E8A', '#4F7BFF'];
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

  /* ===== mission/35-signature.js ===== */
  /* =========================================================
     SIGNATURE PLANETS (mission pages only)
     A few missions get a one-off planet drawn from their own project's visual language instead of the generated
     surface: Topicweave = the v3 loom's globe of threads (cks-v3 js/loom.js F.sphere), 510 Visuals = the site's dotted continent
     globe, see-through, with its graticule, HQ pins and its arcs drawn as thin rings (vendor/510-globe.js).
     They replace that mission's planet where it shows on a mission page (hero, manifest status card, tools-in-orbit
     center, next-mission card) and nowhere else: the Work board, Home and Services keep the CMS planet, and these never join the random
     planet pool. The core planet is still built underneath (drag, magnet and hover keep working on .ab_planet);
     its sphere + rings are hidden and a canvas draws on top, animated only while on screen, one still frame under
     reduced motion.
     ========================================================= */
  (function(){
    var SIG = {};

    /* ---- Topicweave: a globe of threads ---- */
    SIG.topicweave = (function(){
      var COL = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff', '#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff', '#e9e6df'];
      var TAU = Math.PI * 2;
      function rnd(n){ var s = 7, a = []; for (var i = 0; i < n; i++){ s = (s * 16807) % 2147483647; a.push((s - 1) / 2147483646); } return a; }
      return function(R){
        // R = planet radius in px: only the globe (Angelino 2026-10-04: no bands or spokes around it)
        var small = R < 26, N = small ? 120 : R < 70 ? 300 : 700, rr = rnd(N * 3);
        // four regular rings, one per weave color (Angelino 2026-10-04): concentric, one tilted plane, thread dashes
        // drifting along each; the half behind the globe is drawn first and dimmer
        var RG = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff'], RR = [1.24, 1.36, 1.48, 1.6], NR = small ? 0 : R < 70 ? 50 : 110;
        function rings(ctx, cx, cy, t, front, len, lw, en){
          var open = .24, tilt = -.24, ca = Math.cos(tilt), sa = Math.sin(tilt);
          ctx.lineWidth = lw * (1.15 + .5 * en);
          RG.forEach(function(col, k){
            var r = RR[k], n = Math.round(NR * r / 1.4);
            for (var i = 0; i < n; i++){
              var u = (i / n) * Math.PI * 2 + t * (.05 + k * .015), cu = Math.cos(u), su = Math.sin(u);
              if ((su > 0) !== front) continue;
              var wv = en ? Math.sin(u * 9 - t * 4 + k) * .06 * en : 0, rw = r + wv, ex = rw * cu, ey = rw * Math.sin(open) * su, x = ex * ca - ey * sa, y = ex * sa + ey * ca;
              var tx = -r * su, ty = r * Math.sin(open) * cu, dx = tx * ca - ty * sa, dy = tx * sa + ty * ca, tl = Math.sqrt(dx * dx + dy * dy) || 1;
              ctx.globalAlpha = Math.min(1, (front ? .85 : (x * x + y * y < 1 ? .08 : .35)) + .25 * en);
              var X = cx + x * R, Y = cy + y * R, hx = dx / tl * len * .75, hy = dy / tl * len * .75;
              ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(X - hx, Y - hy); ctx.lineTo(X + hx, Y + hy); ctx.stroke();
            }
          });
          ctx.globalAlpha = 1;
        }
        return { pad: NR ? 1.7 : 1.12, pulse: '155,135,245', draw: function(ctx, cx, cy, t, en){
          en = en || 0;
          var len = Math.max(2.2, R * (small ? .2 : R < 70 ? .09 : .07)), lw = Math.max(1, Math.min(1.6, R / 70));
          ctx.lineCap = 'round';
          if (NR) rings(ctx, cx, cy, t, false, len, lw, en);
          ctx.lineWidth = lw;
          for (var i = 0; i < N; i++){
            var R1 = rr[i * 3], R2 = rr[i * 3 + 1], R3 = rr[i * 3 + 2];
            // a point on the sphere, turning, tilted toward us; the thread lies along its latitude, back threads faint
            var lat = Math.acos(2 * R1 - 1), lon = R2 * TAU + t * .12, sl = Math.sin(lat);
            var px = sl * Math.cos(lon), py = Math.cos(lat), pz = sl * Math.sin(lon), tl = .42, ct = Math.cos(tl), st = Math.sin(tl);
            var y2 = py * ct - pz * st, z2 = py * st + pz * ct, p = 1 / (1 + z2 * .3);
            var sw = en ? 1 + Math.sin(lat * 9 + t * 4 + R3 * 6) * .06 * en : 1, x = px * .95 * p * sw, y = y2 * .95 * p * sw, a = Math.atan2(-Math.cos(lon) * st, -Math.sin(lon));
            var c = COL[Math.floor(R3 * COL.length)], hx = Math.cos(a) * len / 2, hy = Math.sin(a) * len / 2, X = cx + x * R, Y = cy + y * R;
            ctx.globalAlpha = z2 > 0 ? .2 + .35 * en : .95; ctx.strokeStyle = c; ctx.lineWidth = lw * (1 + .6 * en); ctx.beginPath(); ctx.moveTo(X - hx, Y - hy); ctx.lineTo(X + hx, Y + hy); ctx.stroke();
          }
          if (NR) rings(ctx, cx, cy, t, true, len, lw, en);
          ctx.globalAlpha = 1;
        } };
      };
    })();

    /* ---- 510 Visuals: the dotted continent globe ---- */
    SIG['510-visuals'] = (function(){
      // the 510 globe's land dots, 2° lat × 2.5° lon (vendor/510-globe.js LAND_DOTS, Antarctica cap added like the site)
      var B64 = 'ESwRLRItEysTLBQqFCsULBRVFSoVKxUsFS0WKhYrFiwWLRaLFowXKxcsFy0XjBgrGCwYLRguGIIYgxiNGI4ZKxksGS0ZLhkvGYMZjhorGiwaLRouGi8aMBoxGoEaghqDGoQajhqPGysbLBstGy4bLxswGzEbfxuAG4EbghuDG4QcKxwsHC0cLhwvHDAcMRwyHFAcURx2HHccfxyAHIEcghyDHIQdLB0tHS4dLx0wHTEdMh0zHU8dUB1RHVIdUx13HXgdeR16HXsdfB19HX4dfx2AHYEdgh2DHYQdhR4sHi0eLh4vHjAeMR4yHjMeNB5PHlAeUR5SHlMeVB52HnceeB55Hnoeex58Hn0efh5/HoAegR6CHoMehB6FHywfLR8uHy8fMB8xHzIfMx80H08fUB9RH1IfUx9UH1Ufdh93H3gfeR96H3sffB99H34ffx+AH4Efgh+DH4QfhSAsIC0gLiAvIDAgMSAyIDMgNCBOIE8gUCBRIFIgUyBUIFUgdiB3IHggeSB6IHsgfCB9IH4gfyCAIIEggiCDIIQghSEsIS0hLiEvITAhMSEyITMhNCE1IU4hTyFQIVEhUiFTIVQhVSFWIVkhWiFbIXYhdyF4IXkheiF7IXwhfSF+IX8hgCGBIYIhgyGEIiwiLSIuIi8iMCIxIjIiMyI0IjUiNiI3Ik4iTyJQIlEiUiJTIlQiVSJWIloiWyJ3IngieSJ6InsifCJ9In4ifyKAIoEigiKDIoQjLCMtIy4jLyMwIzEjMiMzIzQjNSM2IzcjOCNOI08jUCNRI1IjUyNUI1UjWiNbI3gjeSN6I3sjfCN9I34jfyOAI4EjgiODJCwkLSQuJC8kMCQxJDIkMyQ0JDUkNiQ3JDgkTSROJE8kUCRRJFIkUyRUJFUkViRXJFokWyR5JHokeyR8JH0kfiR/JIAkgSSCJIwkjyUrJSwlLSUuJS8lMCUxJTIlMyU0JTUlNiU3JTglTSVOJU8lUCVRJVIlUyVUJVUlViVXJVglWiVbJXoleyV8JX0lfiWBJYImKiYrJiwmLSYuJi8mMCYxJjImMyY0JjUmNiY3JjgmTSZOJk8mUCZRJlImUyZUJlUmViZXJlgmWyZcJnsmfCZ9Jn4mgSaCJyknKicrJywnLScuJy8nMCcxJzInMyc0JzUnNic3JzgnOSdOJ08nUCdRJ1InUydUJ1UnVidXJ1gnfSgpKCooKygsKC0oLigvKDAoMSgyKDMoNCg1KDYoNyg4KDkoTShOKE8oUChRKFIoUyhUKFUoVihXKFgogSiEKIkpKSkqKSspLCktKS4pLykwKTEpMikzKTQpNSk2KTcpOCk5KTopTSlOKU8pUClRKVIpUylUKVUpVilXKVgpcyl0KXUpgCmBKYIpgyooKikqKiorKiwqLSouKi8qMCoxKjIqMyo0KjUqNio3KjgqOSpNKk4qTypQKlEqUipTKlQqVSpWKlcqcipzKoAqgSqCKoMqhisoKykrKisrKywrLSsuKy8rMCsxKzIrMys0KzUrNis3KzgrOStMK00rTitPK1ArUStSK1MrVCtVK1YrVytYK3Ercit2K3greSt7K34rfyuAK4ErgiwoLCksKiwrLCwsLSwuLC8sMCwxLDIsMyw0LDUsNixMLE0sTixPLFAsUSxSLFMsVCxVLFYsVyxYLHEscix0LHUsdix4LH0sfy0kLSgtKS0qLSstLC0tLS4tLy0wLTEtMi0zLTQtTC1NLU4tTy1QLVEtUi1TLVQtVS1WLVctWC1ZLXAtcS10LXUtdi13LXgteS16LXstfS4pLiouKy4sLi0uLi4vLjAuMS4yLjMuNC5MLk0uTi5PLlAuUS5SLlMuVC5VLlYuVy5YLlkuWi5wLnEudS52LncvKi8rLywvLS8uLy8vMC8xLzIvMy9FL0ovTC9NL04vTy9QL1EvUi9TL1QvVS9WL1cvWC9ZL1ovWy9vL3Evdi93MCkwKjArMCwwLTAuMC8wMDAxMDMwRDBFMEYwRzBIMEkwSjBLMEwwTTBOME8wUDBRMFIwUzBUMFUwVjBXMFgwWTBaMFswaDBuMG8wcDBxMHcwejEpMSoxKzEsMS0xLjEvMTAxQzFEMUUxRjFHMUgxSTFKMUsxTDFNMU4xTzFQMVExUjFTMVQxVTFWMVcxWDFZMVoxWzFcMWgxaTFwMXkxejImMicyKDIqMisyLDItMi4yLzJDMkQyRTJGMkcySDJJMkoySzJMMk0yTjJPMlAyUTJSMlMyVDJVMlYyVzJYMlkyWjJbMlwyZjJnMmgycDJyMnMyeTJ6MyYzKzNCM0MzRDNFM0YzRzNIM0kzSjNLM0wzTTNOM08zUDNRM1IzUzNUM1UzVjNXM1gzWTNmM2czaDNwM3EzcjNzM3QzejQjNCQ0JTQmNCc0QTRCNEM0RDRFNEY0RzRINEk0SjRLNEw0TTRONE80UDRRNFI0UzRUNFU0VjRXNFg0WTRaNFs0XDRmNGc0aDRvNHA0cTRyNHM0dDR4NHk1ITUiNSM1JDVCNUM1RDVFNUY1RzVINUk1SjVLNUw1TTVONU81UDVRNVI1UzVUNVU1VjVXNVk1WjVbNVw1XTVlNWY1ZzVoNW41bzVwNXE1cjVzNXk2HzYgNiE2IjYjNiQ2JTZCNkM2RDZFNkY2RzZINkk2SjZLNkw2TTZONk82UDZRNlI2UzZUNlU2VjZXNlk2WjZbNlw2XTZeNmY2ZzZoNmk2bjZvNnA2cTZyNnM2eDceNx83IDchNyQ3JTcpNyo3KzcsN0I3QzdEN0U3RjdHN0g3STdKN0s3TDdNN043TzdQN1E3UjdTN1Q3VTdWN1c3WDdZN1o3WzdcN103XjdfN2U3ZjdnN2g3aTdqN203bjdvN3A3cTdyN3Q4HjgfOCA4ITgoOCk4QjhDOEQ4RThGOEc4SDhJOEo4SzhMOE04TjhPOFA4UThSOFM4VDhVOFY4WDhZOFo4WzhcOF04XjhfOGQ4ZThmOGc4aDhpOGo4azhtOG44bzhwOHE4cjhzOHQ5HDkdOR45HzkgOSE5KTlCOUM5RDlFOUY5RzlIOUk5SjlLOUw5TTlOOU85UDlROVI5UzlUOVU5VjlXOVg5WTlaOVs5XDldOV45XzljOWQ5ZTlmOWc5aDlpOWo5azlsOW05bjlvOXA5cTlyOXM5dDl1OXY5dzl5Ohs6HToeOh86IDohOig6KTpDOkQ6RTpGOkc6SDpJOko6SzpMOk06TjpPOlA6UTpSOlM6VDpVOlc6WDpZOlo6WzpcOl86YDphOmI6YzpkOmU6ZjpnOmg6aTpqOms6bDptOm46bzpwOnE6cjpzOnQ6dTp2Onc6eDsaOxw7HTseOx87IDshOyc7KDtDO0Q7RTtGO0c7SDtJO0o7SztMO007TjtPO1A7UTtSO1M7VDtVO1Y7VztYO1k7WjtbO107XjtfO2A7YTtiO2M7ZDtlO2Y7ZztoO2k7ajtrO2w7bTtuO287cDtxO3I7czt0O3U7djt3O3g8GjwbPBw8HTwePB88IDwhPCI8IzwkPCY8JzxFPEY8RzxIPEk8SjxLPEw8TTxOPE88UDxRPFI8UzxUPFU8VjxXPFg8WTxaPFs8XTxePF88YDxhPGI8YzxkPGU8ZjxnPGg8aTxqPGs8bDxtPG48bzxwPHE8cjxzPHQ8dTx2PHc8eDx5PRk9Gj0bPRw9HT0ePR89ID0hPSI9Iz0kPSU9Jj0nPUQ9RT1GPUc9SD1JPUo9Sz1MPU09Tj1QPVE9Uj1WPVc9WD1ZPVo9Wz1cPV09Xj1fPWA9YT1iPWM9ZD1lPWY9Zz1oPWk9aj1rPWw9bT1uPW89cD1xPXI9cz10PXU9dj13PXg9fD4YPhk+Gj4bPhw+HT4ePh8+ID4hPiI+Iz4kPiU+Jj4nPig+KT5FPkY+Rz5IPkk+Sj5LPkw+TT5XPlg+WT5aPls+XD5dPl4+Xz5gPmE+Yj5jPmQ+ZT5mPmc+aD5pPmo+az5sPm0+bj5vPnA+cT5yPnM+dD51PnY+dz59Pn4/GD8ZPxo/Gz8cPx0/Hj8fPyA/IT8iPyM/JD8lPyY/Jz8oPyk/Rj9IP0k/Sj9LP0w/Vz9YP1k/Wj9bP1w/XT9eP18/YD9hP2I/Yz9kP2U/Zj9nP2g/aT9qP2s/bD9tP24/bz9wP3E/cj9zP3Q/dT92P3c/ez98P38/gEAXQBhAGUAaQBtAHEAdQB5AH0AgQCFAIkAjQCRAJUAmQCdAKEApQCpARUBGQEdASEBOQFFAUkBTQFRAVUBWQFdAWEBZQFpAW0BcQF1AXkBfQGBAYUBiQGNAZEBlQGZAZ0BoQGlAakBrQGxAbUBuQG9AcEBxQHJAc0B0QHVAdkB3QHhAeUB7QHxAgEEXQRhBGUEaQRtBHEEdQR5BH0EgQSFBIkEjQSRBJUEmQSdBKEEpQSpBRUFGQUdBSEFQQVNBVEFVQVZBV0FYQVlBWkFbQVxBXUFeQV9BYEFhQWJBY0FkQWVBZkFnQWhBaUFqQWtBbEFtQW5Bb0FwQXFBckFzQXRBdUF2QXdBeEF5QXpBe0GBQhZCF0IYQhlCGkIbQhxCHUIeQh9CIEIhQiJCI0IkQiVCJkInQihCKUIqQitCRUJGQkdCSEJNQk5CT0JQQlFCUkJTQlVCVkJYQllCWkJbQlxCXUJeQl9CYEJhQmJCY0JkQmVCZkJnQmhCaUJqQmtCbEJtQm5Cb0JwQnFCckJzQnRCdUJ2QndCeEJ5QnpCe0J8QoBCgUMXQxhDGUMaQxtDHEMdQx5DH0MgQyFDIkMjQyRDJUMmQydDKEMpQypDK0MsQy5DSENJQ0pDS0NNQ05DT0NQQ1FDUkNTQ1hDWUNaQ1tDXENdQ15DX0NgQ2FDYkNjQ2RDZUNmQ2dDaENpQ2pDa0NsQ21DbkNvQ3BDcUNyQ3NDdEN1Q3ZDd0N4Q3lDekN7Q3xDfUN+Q4FEF0QYRBlEGkQbRBxEHUQeRB9EIEQhRCJEI0QkRCVEJkQnRChEKUQqRCtELEQtRC5EL0RIRElESkRLRExETURORE9EUERRRFJEU0RURFVEVkRXRFhEWURaRFtEXERdRF5EX0RgRGFEYkRjRGREZURmRGdEaERpRGpEa0RsRG1EbkRvRHBEcURyRHNEdER1RHZEd0R4RHlEekR7RHxEfUR+RIFFF0UYRRlFGkUbRRxFHUUeRR9FIEUhRSJFI0UkRSVFJkUnRShFKUUqRStFLEUtRS5FMUUyRTNFR0VIRUlFSkVLRUxFTUVORU9FUEVRRVJFU0VURVVFVkVXRVhFWUVaRVtFXEVdRV5FX0VgRWFFYkVjRWRFZUVmRWdFaEVpRWpFa0VsRW1FbkVvRXBFcUVyRXNFdEV1RXZFd0V4RXlFekV7RXxFfUV+RX9FgUYWRhdGGEYZRhpGG0YcRh1GHkYfRiBGIUYiRiNGJEYlRiZGJ0YoRilGKkYrRixGLUYxRklGSkZLRkxGTUZORk9GUEZRRlJGU0ZURlVGVkZXRlhGWUZaRltGXEZdRl5GX0ZgRmFGYkZjRmRGZUZmRmdGaEZpRmpGa0ZsRm1GbkZvRnBGcUZyRnNGdEZ1RnZGd0Z4RnlGekZ7RnxGfUZ+Rn9GgEaBRwRHE0cVRxZHF0cYRxlHGkcbRxxHHUceRx9HIEchRyJHI0ckRyVHJkcnRyhHKUcqRytHLEctRy5HL0cwRzFHRUdHR0hHSUdKR0tHTEdNR05HT0dQR1FHUkdTR1RHVUdWR1dHWEdZR1pHW0dcR11HXkdfR2BHYUdiR2NHZEdlR2ZHZ0doR2lHakdrR2xHbUduR29HcEdxR3JHc0d0R3VHdkd3R3hHeUd6R3tHfEd9R35Hf0eAR4FHh0gTSBRIFUgWSBdIGEgZSBpIG0gcSB1IHkgfSCBIIUgiSCNIJEglSCZIJ0gpSCpIK0gsSC1ILkgvSDBIMUhFSEdITEhNSE5IT0hQSFFIUkhTSFRIVUhWSFdIWEhZSFpIW0hcSF1IXkhfSGBIYUhiSGNIZEhlSGZIZ0hoSGlIakhrSGxIbUhuSG9IcEhxSHJIc0h0SHVIdkh3SHhIeUh6SHtIfEh9SH5IgEiHSRJJE0kUSRVJFkkXSRhJGUkaSRtJHEkdSR5JH0kgSSFJIkkjSSRJJkkpSSpJK0ksSS1JLkkvSUdJTUlOSVFJUklTSVRJVUlWSVdJWElZSVpJW0lcSV1JXklfSWBJYUliSWNJZEllSWZJZ0loSWlJaklrSWxJbUluSW9JcElxSXJJc0l0SXVJdkl3SXhJeUl6SXtJfEl9SX5Jf0mHSYhJiUoKShJKE0oUShVKFkoXShhKGkobShxKHUoeSh9KIEohSiJKKUorSixKLUouSi9KRkpOSk9KUkpTSlRKVUpWSldKWEpZSlpKW0pcSl5KX0pgSmFKYkpjSmRKZUpmSmdKaEpqSmtKbEptSm5KcEpxSnJKc0p0SnVKdkp3SnhKeUp6SntKfEp9Sn5Kf0qISwhLCUsKSw5LEEsRSxJLE0sUSxVLFksXSxhLGUsbSxxLHUseSx9LIEshSylLKksrSzVLSktLS0xLTUtPS1FLVEtVS1ZLV0tYS1lLWktbS1xLXUteS19LYEthS2JLY0tkS2VLZktnS2hLaUtqS2tLbEtuS29LcEtxS3JLc0t0S3VLdkt3S3hLeUt6S3tLfEt9S35Lf0uAS4FLg0uES4VLiUuMTAZMB0wITApMC0wMTA1MD0wQTBFMEkwTTBRMFUwWTBdMGEwZTBtMHEwdTB5MH0whTCJMJ0wpTCpMLEwtTDRMNUw2TEtMTExNTE9MUUxSTFNMVUxWTFdMWExZTFpMW0xcTF1MXkxgTGFMYkxjTGRMZkxnTGhMaUxqTGxMbUxuTG9McExyTHNMdEx1THdMeEx5THpMe0x8TH1Mfkx/TIBMgUyDTIRMhUyGTIdMiEyJTIpMi0yMTI1NCU0KTQtNDU0OTQ9NEE0STRNNFE0WTRdNGE0ZTRtNHE0dTR5NIE0hTSJNJE0mTSdNK00sTS5NNE01TTdNQU1MTU1NT01QTVNNVE1VTVZNWE1ZTVpNW01dTV5NX01gTWJNY01kTWVNZ01oTWlNak1sTW1Nbk1wTXFNck1zTXVNdk13TXhNek17TXxNfk1/TYBNg02ETYVNhk2ITYlNik2LTY1Njk2PTgFOBE4FTgZOB04ITglOCk4LTgxODU4OTg9OEE4RThJOE04UThVOF04YThlOG04cTh1OHk4fTiBOIU4iTiNOJE4lTiZOJ04oTilOKk4rTixOLU4vTjBOMU4zTjRONU42TjdOOE45TjpOO048Tj1OPk4/TkBOQU5CTkNORE5FTkZOR05ITklOS05MTlFOV05ZTmROgU8BTwNPBE8GTwdPCU8KTwxPDk8PTxBPEk8TTxVPFk8YTxlPG08cTx5PH08hTyJPJE8lTydPKE8qTytPLU8uTzBPMU8zTzRPNk83TzlPOk88Tz1PP09AT0JPQ09FT0ZPSE9JT0tPTE9OT1hPW09mUAhQClALUA1QDlAQUBNQFVAYUBlQGlAbUB1QHlAiUCNQJVAmUCdQKVArUC1QM1A1UDZQN1A4UDlQOlA7UDxQPVA+UFBQUVBSUFNQVFBeUGFQZFBmUGdQaFBpUGpQa1BsUG1QblBvUHBQcVByUHNQdFB1UHZQd1B5UHtQfFB+UH9QgFCBUIJQg1CEUIVQhlCHUIlQilCOUI9RFlEYURpRG1EdUSFRJVEnUShRM1E1UTdROVE7UTxRPlFdUWVRalFsUW5RcFFyUXNRdVF3UXlRe1GAUYJSFlIYUhxSHlIgUiRSJVInUjJSNFI2UjhSOlI8Uj5SP1JpUmpSbFJuUnBSclKBUyJTI1M0UzpTPFNXU19TblNwU3RTgQ==', D = null;
      function dots(){
        if (D) return D; D = [];
        var bin = atob(B64), i, lat, lng, step;
        for (i = 0; i < bin.length; i += 2) D.push([bin.charCodeAt(i) * 2 - 90, bin.charCodeAt(i + 1) * 2.5 - 180]);
        for (lat = -64; lat >= -84; lat -= 3){ step = 3 / Math.max(.15, Math.cos(lat * Math.PI / 180)); for (lng = -180; lng < 180; lng += step) D.push([lat, lng]); }
        D.forEach(function(d){ var la = d[0] * Math.PI / 180, lo = d[1] * Math.PI / 180, r = Math.random(); d.push(Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo), r > .85 ? '#b8c9cc' : r > .6 ? '#5a8a94' : '#37535a'); });
        return D;
      }
      // the site's three HQ pins (Brooklyn, Shenzhen, Brussels) and its arcs, turned into thin rings around the globe
      var PINS = [[40.68, -73.94], [22.54, 114.06], [50.85, 4.35]];
      var RINGS = [{ r: 1.22, inc: .42, node: .3, sp: .55 }, { r: 1.36, inc: -.62, node: 1.9, sp: -.4 }, { r: 1.5, inc: .78, node: 3.6, sp: .3 }];
      function v3(lat, lng){ var la = lat * Math.PI / 180, lo = lng * Math.PI / 180; return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]; }
      return function(R){
        var list = dots(), small = R < 26;
        return { pad: small ? 1.3 : 1.62, pulse: '94,234,212', draw: function(ctx, cx, cy, t, en){
          en = en || 0;
          var rot = t * .16, cr = Math.cos(rot), sr = Math.sin(rot), tl = .38, ct = Math.cos(tl), st = Math.sin(tl);
          // world → screen: spin about the axis, tilt toward the viewer; returns [x, y, depth]
          function pr(x, y, z, spin){ var X = spin ? x * cr - z * sr : x, Z = spin ? x * sr + z * cr : z; return [X, y * ct - Z * st, y * st + Z * ct]; }
          var i, k, q, a;
          ctx.lineWidth = Math.max(.6, R / 260);
          // graticule: lat every 30° (−60..60), lng every 30°, thin, the back half fainter (the globe is see-through)
          if (!small){
            ctx.strokeStyle = '#5a8a94';
            for (var lat = -60; lat <= 60; lat += 30) for (var ln = -180; ln < 180; ln += 6){ seg(v3(lat, ln), v3(lat, ln + 6)); }
            for (var lg = -180; lg < 180; lg += 30) for (var lt = -90; lt < 90; lt += 6){ seg(v3(lt, lg), v3(lt + 6, lg)); }
          }
          function seg(p0, p1){ var A = pr(p0[0], p0[1], p0[2], true), B = pr(p1[0], p1[1], p1[2], true); ctx.globalAlpha = (A[2] + B[2]) > 0 ? .22 : .07; ctx.beginPath(); ctx.moveTo(cx + A[0] * R, cy - A[1] * R); ctx.lineTo(cx + B[0] * R, cy - B[1] * R); ctx.stroke(); }
          // continent dots, front bright, back faint
          var dr = Math.max(.55, R / (small ? 30 : 120)), skip = small ? 3 : R < 70 ? 2 : 1;
          for (i = 0; i < list.length; i += skip){
            var d = list[i]; q = pr(d[2], d[3], d[4], true);
            ctx.globalAlpha = q[2] >= 0 ? Math.min(1, .4 + .55 * q[2] + .3 * en) : .1 + .1 * en; ctx.fillStyle = en > .5 && d[5] === '#37535a' ? '#5a8a94' : d[5];
            ctx.fillRect(cx + q[0] * R - dr, cy - q[1] * R - dr, dr * 2, dr * 2);
          }
          // pins on the front: a teal core with a glow
          PINS.forEach(function(pn){ var v = v3(pn[0], pn[1]); q = pr(v[0], v[1], v[2], true); if (q[2] < .05) return; glow(cx + q[0] * R, cy - q[1] * R, Math.max(1.4, R / 70), .9); });
          function glow(x, y, r, al){ var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(94,234,212,' + al + ')'); g.addColorStop(.3, 'rgba(45,212,191,' + al * .5 + ')'); g.addColorStop(1, 'rgba(45,212,191,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill(); }
          // the arcs as rings: tilted circles around the globe, each with a pin of light travelling along it;
          // the part behind the globe is dimmer
          RINGS.forEach(function(rg, ri){
            var ci = Math.cos(rg.inc), si = Math.sin(rg.inc), cn = Math.cos(rg.node), sn = Math.sin(rg.node), prev = null, n = 96;
            function pt(u){ var x = Math.cos(u) * rg.r, z = Math.sin(u) * rg.r, y = z * si; z = z * ci; var X = x * cn - z * sn, Z = x * sn + z * cn; return pr(X, y, Z, false); }
            ctx.lineWidth = Math.max(.7, R / 200);
            for (k = 0; k <= n; k++){
              q = pt(k / n * Math.PI * 2);
              if (prev){ var behind = (prev[2] + q[2]) < 0 && Math.hypot((prev[0] + q[0]) / 2, (prev[1] + q[1]) / 2) < 1; ctx.globalAlpha = behind ? .1 : .55 + .4 * en; ctx.strokeStyle = ri ? '#2dd4bf' : '#5eead4'; ctx.beginPath(); ctx.moveTo(cx + prev[0] * R, cy - prev[1] * R); ctx.lineTo(cx + q[0] * R, cy - q[1] * R); ctx.stroke(); }
              prev = q;
            }
            if (!small){ a = t * rg.sp + ri * 2.1; q = pt(a); var hid = q[2] < 0 && Math.hypot(q[0], q[1]) < 1; if (!hid) glow(cx + q[0] * R, cy - q[1] * R, Math.max(1.2, R / 90), .85); }
          });
          ctx.globalAlpha = 1;
        } };
      };
    })();

    // styles injected from here, so they ship with the script alone (no stylesheet release)
    var css = document.createElement('style'); css.id = 'sig-planets';
    css.textContent = '.ab_planet.is-sig .sphere,.ab_planet.is-sig .pring,.ab_planet.is-sig .tex{opacity:0!important}' +
      '.ab_planet.is-sig{overflow:visible!important}.ab_planet.is-sig .sig-cv{position:absolute;left:50%;top:50%;pointer-events:none;z-index:2}' +
      // monitor scene controls: every button at least 24 × 24 (WCAG 2.2 target size); .scn-pp's own size lost to the
      // `all:unset` on `.scn-ctl button`. Also in ab-mission.css for its next release; injected here so it ships now.
      '.scn-ctl button{min-width:24px;min-height:24px;box-sizing:border-box}.scn-ctl .scn-pp{width:24px;height:24px}';
    document.head.appendChild(css);
    function mount(el, slug){
      var make = SIG[slug]; if (!make || el.__sig) return; el.__sig = true;
      el.classList.add('is-sig', 'is-sig-' + slug);
      var cv = document.createElement('canvas'); cv.className = 'sig-cv'; cv.setAttribute('aria-hidden', 'true'); el.appendChild(cv);
      var ctx = cv.getContext('2d'), P = null, W = 0, H = 0, raf = 0, on = false, last = 0, T = 6, EN = 0, until = 0, pulseT = -9, ptr = null;
      function size(){
        var r = el.getBoundingClientRect(), R = r.width / 2; if (!R) return false;
        P = make(R); var s = R * 2 * P.pad, dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.style.width = cv.style.height = s + 'px'; cv.style.marginLeft = cv.style.marginTop = (-s / 2) + 'px';
        W = H = s; cv.width = cv.height = Math.round(s * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        P.R = R; return true;
      }
      // supercharge (the v3 site's hover "energize"): the threads speed up, brighten and undulate, one pulse runs out
      function frame(now){
        if (!P) return; now = now || 0;
        var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
        // a resting pointer keeps it charged (also when the page scrolls the planet under a still pointer)
        if (ptr && !reduce){ var br = el.getBoundingClientRect(), qx = ptr[0] - (br.left + br.width / 2), qy = ptr[1] - (br.top + br.height / 2), qr = br.width / 2 * 1.15; if (qx * qx + qy * qy < qr * qr){ if (now >= until) pulseT = now / 1000; until = now + 300; } }
        var want = now < until ? 1 : 0; EN += (want - EN) * Math.min(1, dt * (want ? 4 : 2.5)); if (EN < .002) EN = 0;
        if (!reduce) T += dt * (1 + 2.4 * EN);
        ctx.clearRect(0, 0, W, H); P.draw(ctx, W / 2, H / 2, T, EN);
        var pa = (now / 1000 - pulseT) / 1.1;
        if (pa >= 0 && pa < 1){
          var R = P.R; ctx.globalAlpha = (1 - pa) * .7; ctx.strokeStyle = 'rgb(' + P.pulse + ')'; ctx.lineWidth = Math.max(1, R / 60) * (1 - pa * .6);
          ctx.beginPath(); ctx.arc(W / 2, H / 2, R * (1 + pa * (P.pad - 1) * .95), 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
        }
        raf = (on && !reduce) || EN > 0 || pa < 1 ? requestAnimationFrame(frame) : 0;
      }
      function charge(ms){
        if (reduce) return; var now = performance.now();
        if (now >= until) pulseT = now / 1000;
        until = now + (ms || 900); if (!raf){ last = 0; raf = requestAnimationFrame(frame); }
      }
      if (!size()) return;
      frame(performance.now());
      var lw = innerWidth; addEventListener('resize', function(){ if (innerWidth !== lw){ lw = innerWidth; if (size()) frame(performance.now()); } });
      if (window.IntersectionObserver) new IntersectionObserver(function(es){
        on = es[0].isIntersecting; if (on && !raf && !reduce){ last = 0; raf = requestAnimationFrame(frame); }
      }, { rootMargin: '100px' }).observe(el);
      // mouse: charged while the pointer is over the planet (hit-tested by position, since the hero title sits on top
      // of it); touch: a tap charges it for a moment
      addEventListener('pointermove', function(e){
        if (e.pointerType !== 'mouse' || !P || !on) return;
        var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), R = r.width / 2 * 1.15;
        ptr = [e.clientX, e.clientY]; if (dx * dx + dy * dy < R * R) charge(700);
      }, { passive: true });
      document.addEventListener('pointerleave', function(){ ptr = null; });
      el.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse') charge(1600); });
    }

    // this page's own planet: the hero + the manifest status card
    if (SIG[SLUG]){
      var hp = $('#hero .ab_planet[data-slug]'); if (hp) mount(hp, SLUG);
      $$('.ab_planet.is-mf, .ab_planet.is-orbit').forEach(function(p){ mount(p, SLUG); });
    }
    // the next-mission card, when the next mission has a signature planet
    if (NEXT && SIG[NEXT.slug]) $$('.ab_next-card .ab_planet').forEach(function(p){ mount(p, NEXT.slug); });
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
      'tw-loom': 'Play', 'tw-plan': 'Plan', 'tw-app': 'Explore', 'tw-capture': 'Phone', 'tw-cms': 'Try it', 'tw-roadmap': 'Phases' };
    var KIND = { 'live-globe': 'LIVE · three.js r128', 'live-map': 'LIVE · d3 v7', 'wipe': 'COMPARE · figma ↔ webflow', 'figma': 'MOCKUP · figma → webflow', 'phone': 'MOCKUP · mobile', 'flow': 'MOCKUP · figjam → build', 'exploded': 'BREAKDOWN · layers', 'cms': 'MOCKUP · cms → site', 'mobile': 'STILL · mobile', 'img': 'STILL', 'logo': 'VECTOR · svg', 'apps': 'MOCKUPS', 'sketch': 'SKETCH · pen + paper', 'vector': 'MOCKUP · illustrator', 'graph': 'MOCKUP · knowledge graph', 'library': 'MOCKUP · insights library', 'voice': 'MOCKUP · voice kit → review', 'setup': 'MOCKUP · cms → site', 'video': 'MOCKUP · video + chapters', 'schema': 'MOCKUP · json-ld → search + ai', 'portable': 'MOCKUP · content model',
      'tw-loom': 'DEMO · the loom, canvas', 'tw-plan': 'FIGJAM · ideation → wireframes → build', 'tw-app': 'DEMO · dashboard prototype', 'tw-capture': 'DEMO · voice kit, phone app', 'tw-cms': 'DEMO · cms → site + json-ld', 'tw-roadmap': 'ROADMAP · five phases' };
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
      'tw-loom': 'tw', 'tw-plan': 'tw', 'tw-app': 'tw', 'tw-capture': 'tw', 'tw-cms': 'tw', 'tw-roadmap': 'tw' };
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
    // the cloth for Topicweave channel changes (23-tw-base.js), on its own layer above the views
    var TWV = null, lastPt = null;
    if (M.mock && M.mock.tw && SCENE.kit.tw && !reduce){ var twl = document.createElement('div'); twl.className = 'tw-sw'; twl.setAttribute('aria-hidden', 'true'); screen.appendChild(twl); TWV = SCENE.kit.tw.weave(twl, { mode: 'radial', durIn: .42, durOut: .6, grid: 14 }); }
    chans.addEventListener('pointerdown', function(e){ lastPt = { x: e.clientX, y: e.clientY, t: Date.now() }; });
    function setCh(i, silent){
      i = (i + CH.length) % CH.length; var c = CH[i]; curCh = i;
      seenCh[i] = true; if (CH.length > 1 && Object.keys(seenCh).length >= CH.length && AB.quest) AB.quest('channels');
      // Topicweave: the site's thread cloth knits over the screen from the tab you pressed, then unravels onto the new channel
      var woven = !silent && TWV && !reduce;
      function show(){ views.forEach(function(v, k){ v.classList.toggle('on', k === i); }); }
      if (woven){ var sr = screen.getBoundingClientRect(), pt = lastPt && lastPt.t > Date.now() - 800 ? [lastPt.x - sr.left, lastPt.y - sr.top] : [sr.width / 2, sr.height / 2]; TWV(true, pt, function(){ if (curCh === i) show(); TWV(false); }); }
      else show();
      chBtns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      monLabel.textContent = c.label; monCap.textContent = c.caption; monKind.textContent = KIND[tk(c)] || '';
      $('#tCh').textContent = (i + 1) + ' / ' + CH.length;
      $('#tSrc').textContent = c.kind.indexOf('live') === 0 ? 'Live code' : liveOn(c) ? 'Live site' : c.loop ? 'Recording' : /^tw-/.test(c.kind) ? 'Coded demo' : c.kind === 'wipe' ? 'Figma + site' : /^(figma|phone|flow|exploded|cms|sketch|vector|graph|library|voice|setup|video|schema|portable)$/.test(c.kind) ? 'Mockup' : c.kind === 'logo' || c.kind === 'apps' ? 'Vector' : 'Screenshot';
      if (liveOn(c)){ monKind.textContent = 'LIVE · ' + LIVE.host; chBtns[i].querySelector('.t').textContent = 'Live'; }
      osd.textContent = 'CH ' + (i + 1) + ' · ' + c.label;
      if (!silent){ if (!woven) staticBurst(); if (!reduce && hasGsap) gsap.fromTo(osd, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 3, yoyo: true }); }
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
