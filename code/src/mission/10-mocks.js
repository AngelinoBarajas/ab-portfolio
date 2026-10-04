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

