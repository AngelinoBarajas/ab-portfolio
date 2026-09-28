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
    var H = 'Baloo 2,Arial Rounded MT Bold,ui-rounded,sans-serif', B = 'Nunito Sans,system-ui,sans-serif';
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

