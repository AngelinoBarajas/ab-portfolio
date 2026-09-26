/*! AB Portfolio · ab-mission v0.18.0 · github.com/AngelinoBarajas/ab-portfolio */
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
    return { mount: mount, activate: activate, add: add, get: function(id){ return scenes[id]; },
      kit: { mk: mk, q: q, qa: qa, esc: esc, controls: controls, CURSOR: CURSOR, reduce: reduce } };
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
      if (anim){ var els = $$('main section, .ab_sys, .ab_anom'), vh = innerHeight * .35; for (var i = 0; i < els.length; i++){ var r = els[i].getBoundingClientRect(); if (r.bottom > vh){ anchor = els[i]; prevY = r.top; break; } } }
      cur = lv; document.body.classList.toggle('eng', lv === 'eng'); paint();
      if (hint) hint.textContent = lv === 'eng' ? 'Technical breakdowns, stack details and code excerpts are on.' : 'Plain-English briefings. Switch to Engineer for the technical details.';
      try { localStorage.setItem('ab-crew', lv); } catch(e){}
      if (anchor && prevY != null){ var dy = anchor.getBoundingClientRect().top - prevY; if (Math.abs(dy) > 1){ if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(scrollY + dy, { immediate: true, force: true }); else scrollBy(0, dy); } }
      if (anim && window.ScrollTrigger) setTimeout(function(){ ScrollTrigger.refresh(); }, 50);
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
    ul.innerHTML = PARAMS.map(function(p, i){ return '<li><span>P-' + pad2(i + 1) + '</span>' + esc(p) + '</li>'; }).join('');
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
      var v = '<div class="view ' + c.kind + (c.mode === 'light' ? ' light' : '') + '" data-ch="' + esc(c.id) + '" data-kind="' + c.kind + '" role="tabpanel" aria-label="' + esc(c.label) + '">';
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
    var TYPE = { 'live-globe': 'Live', 'live-map': 'Live', 'wipe': 'Compare', 'mobile': 'Phone', 'img': 'Still', 'logo': 'Vector', 'apps': 'Mockups', 'figma': 'Build', 'phone': 'Phone', 'flow': 'Plan', 'exploded': 'Layers', 'cms': 'CMS', 'sketch': 'Sketch', 'vector': 'Vector', 'graph': 'Graph', 'library': 'Library', 'voice': 'AI + you', 'setup': 'CMS', 'video': 'Video', 'schema': 'Schema', 'portable': 'Model' };
    var KIND = { 'live-globe': 'LIVE · three.js r128', 'live-map': 'LIVE · d3 v7', 'wipe': 'COMPARE · figma ↔ webflow', 'figma': 'MOCKUP · figma → webflow', 'phone': 'MOCKUP · mobile', 'flow': 'MOCKUP · figjam → build', 'exploded': 'BREAKDOWN · layers', 'cms': 'MOCKUP · cms → site', 'mobile': 'STILL · mobile', 'img': 'STILL', 'logo': 'VECTOR · svg', 'apps': 'MOCKUPS', 'sketch': 'SKETCH · pen + paper', 'vector': 'MOCKUP · illustrator', 'graph': 'MOCKUP · knowledge graph', 'library': 'MOCKUP · insights library', 'voice': 'MOCKUP · voice kit → review', 'setup': 'MOCKUP · cms → site', 'video': 'MOCKUP · video + chapters', 'schema': 'MOCKUP · json-ld → search + ai', 'portable': 'MOCKUP · content model' };
    screen.innerHTML = CH.map(channelView).join('') + '<div class="scan"></div><div class="roll"></div><div class="vig"></div><canvas class="noise" id="noise" width="160" height="100"></canvas>' +
      '<i class="brk tl"></i><i class="brk tr"></i><i class="brk bl"></i><i class="brk br"></i><div class="osd" id="osd">CH 1</div>';
    chans.innerHTML = CH.map(function(c, i){ return '<button type="button" role="tab" data-ch="' + esc(c.id) + '" aria-selected="' + (i ? 'false' : 'true') + '"><span class="k">' + (i + 1) + '</span><span>' + esc(c.label) + '</span><span class="t">' + (TYPE[c.kind] || '') + '</span></button>'; }).join('');
    var views = $$('.view', screen), chBtns = $$('button', chans), osd = $('#osd'), monLabel = $('#monLabel'), monCap = $('#monCap'), monKind = $('#monKind');
    // coded scenes need this mission's mockup spec for that kind; one broken scene never stops the monitor
    var NEED = { figma: 'els', phone: 'mobile', flow: 'flow', exploded: 'explode', cms: 'cms', sketch: 'sketch', vector: 'vector', graph: 'graph', library: 'library', voice: 'voice', setup: 'setup', video: 'video', schema: 'schema', portable: 'portable' };
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
    function setCh(i, silent){
      i = (i + CH.length) % CH.length; var c = CH[i]; curCh = i;
      views.forEach(function(v, k){ v.classList.toggle('on', k === i); });
      chBtns.forEach(function(b, k){ b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      monLabel.textContent = c.label; monCap.textContent = c.caption; monKind.textContent = KIND[c.kind] || '';
      $('#tCh').textContent = (i + 1) + ' / ' + CH.length;
      $('#tSrc').textContent = c.kind.indexOf('live') === 0 ? 'Live code' : c.kind === 'wipe' ? 'Figma + site' : /^(figma|phone|flow|exploded|cms|sketch|vector|graph|library|voice|setup|video|schema|portable)$/.test(c.kind) ? 'Mockup' : c.kind === 'logo' || c.kind === 'apps' ? 'Vector' : 'Screenshot';
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
    setCh(0, true);
  })();

});
