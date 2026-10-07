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
  // kip: a concept baby log, relaunched 2026-10-06 as a one-page site with an interactive 3D house (kipvillage.com,
  // repo kip-one). Figma frame = the live hero, element by element (the house card is cropped from the live render:
  // vendor/kip/hero-house.webp). Image channels are recordings of the live site (prototypes/img/kip2-ch-*, served at this
  // bundle's tag): `img` maps channel id → [loop, still]; a still-only entry is [still]. The live channel shows the real
  // site in an iframe once kipvillage.com answers (`live`); kip-plan is the coded site plan (25-kip-plan.js).
  (function(){
    var H = "'Baloo 2','Arial Rounded MT Bold',ui-rounded,sans-serif", B = 'Nunito Sans,system-ui,sans-serif';
    var INK = '#1E1B2E', TAN = '#FF7A45', CREAM = '#FFF4E6', BUTTER = '#FFC94A', MINT = '#5FD3A8', ROSE = '#FF8FA3';
    var REC = VENDOR.replace(/code\/vendor\/$/, 'prototypes/img/kip2-ch-');
    function rec(id, still, mp4){ return still ? [REC + id + '.webp'] : [REC + id + '-anim.webp', REC + id + '.webp'].concat(mp4 ? [REC + id + '-anim.mp4'] : []); }
    function ball(c){ return '<div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 34% 30%,#fff 0,' + c + ' 38%,' + c + ' 70%,rgba(0,0,0,.08) 100%);opacity:.85"></div>'; }
    MOCKS.kip = {
      accent: TAN,
      fontCss: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito+Sans:wght@400;700;800&display=swap',
      // desktop loops play their MP4 (the camera never rests, so a WebP under 4 MB turns blocky); the phone loop's WebP is clean
      img: { 'live-kip': rec('live', 1), house: rec('house', 0, 1), night: rec('night', 0, 1), dose: rec('dose', 0, 1), phone: rec('phone'), cast: rec('cast', 0, 1) },
      live: { base: 'https://kipvillage.com/', probe: 'img/house-poster.jpg', pages: { 'live-kip': 'index.html' } },
      plan: true,
      file: 'kip — Product site', page: 'Home', frame: 'Desktop · Hero', url: 'kipvillage.com',
      bg: CREAM, hover: 'cta',
      comment: { on: 'house', by: 'Review', text: 'On my phone the full-screen house is tiny. I can’t tell the rooms apart.', reply: 'On phones the house is now a wide card with room buttons under it, and the app phone sits below.' },
      els: [
        { id: 'b1', name: 'Shape / butter ball', icon: 'img', type: 'Ellipse', x: 120, y: 400, w: 88, h: 88, wire: 'img', props: { fill: BUTTER }, html: ball(BUTTER) },
        { id: 'b2', name: 'Shape / mint ball', icon: 'img', type: 'Ellipse', x: 803, y: 262, w: 57, h: 57, wire: 'img', props: { fill: MINT }, html: ball(MINT) },
        { id: 'b3', name: 'Shape / rose ball', icon: 'img', type: 'Ellipse', x: 300, y: 75, w: 38, h: 38, wire: 'img', props: { fill: ROSE }, html: ball(ROSE) },
        { id: 'nav', name: 'Nav / header', icon: 'comp', type: 'Component', x: 0, y: 0, w: 1000, h: 46, wire: 'nav',
          props: { fill: CREAM },
          html: '<div style="height:100%;display:flex;align-items:center;gap:18px;padding:0 34px;font:700 11px ' + B + ';color:' + INK + '"><b style="font:800 21px/1 ' + H + ';letter-spacing:-.02em">kip<sup style="color:' + TAN + ';font-size:9px">z</sup></b><span style="margin-left:auto">The house</span><span>How it works</span><span>Promises</span><span style="background:' + INK + ';color:' + CREAM + ';border-radius:999px;padding:7px 13px;font-weight:800">Get kip</span></div>' },
        { id: 'eyebrow', name: 'Eyebrow / a concept baby log', icon: 'text', type: 'Text', x: 420, y: 59, w: 160, h: 18, wire: 'lines:1',
          props: { fill: INK, font: 'Nunito Sans', weight: 'ExtraBold', size: '15', ls: '10%' },
          html: '<div style="display:flex;gap:7px;align-items:center;justify-content:center;font:800 9px ' + B + ';letter-spacing:.1em;color:' + INK + '"><i style="width:8px;height:8px;border-radius:50%;background:' + TAN + ';box-shadow:0 0 0 3px #FFD9C6"></i>A CONCEPT BABY LOG</div>' },
        { id: 'heading', name: 'H1 / One little log', icon: 'text', type: 'Text', x: 70, y: 80, w: 860, h: 60, wire: 'lines:1:big',
          props: { fill: INK, font: 'Baloo 2', weight: 'ExtraBold', size: '84', lh: '100%', ls: '-1%' },
          html: '<div style="font:800 53px/1.05 ' + H + ';letter-spacing:-.01em;color:' + INK + ';text-align:center;white-space:nowrap">One little log. The whole village in it.</div>' },
        { id: 'lede', name: 'Lede / what kip does', icon: 'text', type: 'Text', x: 290, y: 147, w: 420, h: 40, wire: 'lines:2',
          props: { fill: '#4A4560', font: 'Nunito Sans', weight: 'Regular', size: '20', lh: '150%' },
          html: '<p style="margin:0;font:400 12.5px/1.5 ' + B + ';color:#4A4560;text-align:center">Feeds, naps, diapers and meds in one shared log, with everyone who looks after June writing in the same place.</p>' },
        { id: 'cta', name: 'Buttons / hero', icon: 'comp', type: 'Component', x: 386, y: 202, w: 228, h: 33, wire: 'btn',
          props: { fill: TAN, font: 'Nunito Sans', weight: 'ExtraBold', size: '17' },
          html: '<div style="display:flex;gap:10px;height:100%"><span class="hv" style="flex:1.6;border-radius:999px;background:' + TAN + ';color:' + CREAM + ';box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 4px 10px rgba(255,122,69,.35);font:800 10.5px ' + B + ';display:flex;align-items:center;justify-content:center;white-space:nowrap">▶&nbsp; Step inside the house</span><span style="flex:1;border-radius:999px;background:#fff;color:' + INK + ';box-shadow:0 4px 10px rgba(30,27,46,.12);font:800 10.5px ' + B + ';display:flex;align-items:center;justify-content:center">Get kip</span></div>' },
        { id: 'house', name: 'Spline / the house', icon: 'img', type: 'Embed', x: 282, y: 294, w: 438, h: 268, wire: 'img',
          props: { fill: '#BFE6FF' },
          html: '<img src="' + VENDOR + 'kip/hero-house.webp" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:20px;display:block">' }
      ]
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

