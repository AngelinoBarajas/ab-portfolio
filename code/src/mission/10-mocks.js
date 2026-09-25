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

