
  /* ---------- nav: you are here. Webflow marks exact matches (w--current); detail pages mark their parent section
     (/work/x → Work, /services/x → Services, /observatory/x + /topics → Observatory), in the bar and the menu ---------- */
  (function(){
    var path = location.pathname.replace(/\/+$/, '') || '/', SEC = { work: '/work', services: '/services', observatory: '/observatory', topics: '/observatory' };
    var top = path.split('/')[1] || '', parent = SEC[top];
    if (!parent) return;
    $$('.ab_nav_link, .ab_menu_link').forEach(function(a){
      var h = (a.getAttribute('href') || '').replace(/\/+$/, '');
      if (h !== parent) return;
      a.classList.add('is-current');
      if (!a.hasAttribute('aria-current')) a.setAttribute('aria-current', path === parent ? 'page' : 'true');
    });
  })();

  /* ---------- selection UI ([data-selectable]: Figma-style box, handles, name + size tags) ---------- */
  function addSel(el){
    var s = document.createElement('div'); s.className = 'sel'; s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<i class="tl"></i><i class="tc"></i><i class="tr"></i><i class="ml"></i><i class="mr"></i><i class="bl"></i><i class="bc"></i><i class="br"></i><span class="sel-tag"></span><span class="sel-size"></span>';
    // forms use data-sel-name (their data-name is the Webflow Forms inbox name)
    s.querySelector('.sel-tag').textContent = el.getAttribute('data-sel-name') || el.getAttribute('data-name') || 'Frame';
    el.appendChild(s);
    function size(){ s.querySelector('.sel-size').textContent = el.getAttribute('data-size') || (Math.round(el.offsetWidth) + ' × ' + Math.round(el.offsetHeight)); }
    size(); el.addEventListener('mouseenter', size);
    el.__sel = s;
    return s;
  }
  $$('[data-selectable]:not(.t-select)').forEach(addSel);

  // text decorations, added after a heading's reveal so SplitText never splits them
  function decorate(root){
    $$('.t-select', root).forEach(function(el){
      if (el.__dec) return; el.__dec = true;
      var s = addSel(el);
      if (!$('.sel-cur')){ var cur = document.createElement('div'); cur.className = 'sel-cur'; cur.innerHTML = '<svg width="18" height="22" viewBox="0 0 18 22"><path d="M1 1 L1 18 L6 13.5 L9.5 21 L12.5 19.5 L9 12.5 L16 12.5 Z" fill="#FF6A3D" stroke="#07080D" stroke-width="1.2"/></svg><span>Angelino</span>'; s.appendChild(cur); }
      setTimeout(function(){ el.classList.add('is-selected'); }, 300);
    });
    $$('.t-orbit', root).forEach(function(el){
      if (el.__dec) return; el.__dec = true;
      var o = document.createElement('i'); o.className = 'orb'; o.setAttribute('aria-hidden', 'true'); o.appendChild(document.createElement('b')); el.appendChild(o);
    });
  }

  /* ---------- Figma-style frame names on sections (component Frame label) ---------- */
  $$('section[data-frame]').forEach(function(sec){
    var l = $('[data-frame-label]', sec);
    if (!l){ l = document.createElement('span'); l.className = 'ab_frame-label'; l.setAttribute('aria-hidden', 'true'); sec.insertBefore(l, sec.firstChild); }
    function upd(){ l.textContent = '▢ ' + sec.getAttribute('data-frame') + '   ' + sec.offsetWidth + ' × ' + sec.offsetHeight; }
    upd(); addEventListener('resize', upd); setTimeout(upd, 1500);
  });

  /* ---------- layout grid overlay (Shift+G, footer toggle) ---------- */
  var gbtn = $('#gridToggle');
  // the toast reads the overlay's real numbers (columns shown at this width, gap, side margins, max width), so it never drifts from the CSS
  function gridInfo(){
    var inner = $('.ab_lgrid-inner', lgrid); if (!inner) return '';
    var cs = getComputedStyle(inner), n = $$('i', inner).filter(function(i){ return getComputedStyle(i).display !== 'none'; }).length;
    return ' · ' + n + ' columns · ' + Math.round(parseFloat(cs.columnGap)) + 'px gap · ' + Math.round(parseFloat(getComputedStyle(lgrid).paddingLeft)) + 'px margins · ' + Math.round(parseFloat(cs.maxWidth)) + 'px max';
  }
  function toggleGrid(){ var on = !lgrid.classList.contains('on'); lgrid.classList.toggle('on', on); if (gbtn) gbtn.setAttribute('aria-pressed', on); toast(on ? 'Layout grid on' + gridInfo() : 'Layout grid off'); }
  if (gbtn){
    if (!gbtn.hasAttribute('tabindex')) gbtn.tabIndex = 0;
    gbtn.setAttribute('aria-pressed', 'false');
    gbtn.addEventListener('click', toggleGrid);
    gbtn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleGrid(); } });
  }
  document.addEventListener('keydown', function(e){ if (e.shiftKey && (e.key === 'G' || e.key === 'g') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); toggleGrid(); } });

  /* ---------- Calm mode (footer bar toggle, Shift+M): the visitor's own reduced-motion switch ----------
     Stored in localStorage ab:calm and applied on reload (00-base reads it into AB.reduce, abwarpin sets html.ab-calm
     before first paint), so every animation takes the same path as the system setting. A device that already asks
     for less motion shows it as on and locked. */
  (function(){
    var bar = $('.ab_footer_bar'), btn = document.createElement('span');
    function label(){ return 'Calm mode · ' + (reduce ? 'On' : 'Off') + (AB.sysReduce ? ' (device setting)' : ''); }
    function flip(){
      if (AB.sysReduce){ toast('Your device asks for reduced motion, so Calm mode stays on.'); return; }
      try { if (AB.calm) localStorage.removeItem('ab:calm'); else localStorage.setItem('ab:calm', '1'); }
      catch (er){ toast('Calm mode needs site storage, which this browser is blocking.'); return; }
      toast(AB.calm ? 'Calm mode off · motion back on' : 'Calm mode on · motion off');
      setTimeout(function(){ location.reload(); }, 450);
    }
    btn.className = 'ab_footer_grid-toggle is-calm'; btn.id = 'calmToggle';
    btn.setAttribute('role', 'button'); btn.tabIndex = 0;
    btn.setAttribute('aria-pressed', reduce ? 'true' : 'false');
    if (AB.sysReduce) btn.setAttribute('aria-disabled', 'true');
    btn.title = 'Turn the site’s motion ' + (reduce ? 'back on' : 'off') + ' (Shift+M)';
    btn.textContent = label();
    btn.addEventListener('click', flip);
    btn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flip(); } });
    if (bar){ if (gbtn && gbtn.parentNode === bar) bar.insertBefore(btn, gbtn); else bar.appendChild(btn); }
    document.addEventListener('keydown', function(e){ if (e.shiftKey && (e.key === 'M' || e.key === 'm') && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable){ e.preventDefault(); flip(); } });
  })();

  /* ---------- copy the email ([data-copy-email]) ---------- */
  $$('[data-copy-email]').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      var src = $('[data-bind="email"]', b) || b, t = S0.email || src.textContent.trim();
      copyText(t, 'Copied to clipboard ✓', function(){ var r = document.createRange(); r.selectNodeContents(src); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Selected. Press Ctrl/Cmd + C to copy.'); });
    });
  });

  /* ---------- cursor readout (HUD) ---------- */
  (function(){
    if (coarse) return;
    inject('<div class="ab_hud" id="hud" aria-hidden="true"><span class="ab_hud-k">X</span><span id="hudX">0000</span><span class="ab_hud-k">Y</span><span id="hudY">0000</span><span class="ab_hud-sec" id="hudSec">hero</span></div>');
    var hx = $('#hudX'), hy = $('#hudY'), hs = $('#hudSec'), px = 0, py = 0, dirty = false;
    var secs = $$('section[data-frame], #hero, #siteFoot');
    function p4(n){ n = String(n); while (n.length < 4) n = '0' + n; return n; }
    addEventListener('pointermove', function(e){ px = e.clientX; py = e.clientY; dirty = true; }, { passive: true });
    addEventListener('scroll', function(){ dirty = true; }, { passive: true });
    (function frame(){
      if (dirty){
        dirty = false; var ay = Math.round(py + scrollY);
        hx.textContent = p4(Math.round(px)); hy.textContent = p4(ay);
        var name = 'space';
        for (var i = 0; i < secs.length; i++){ var r = secs[i].getBoundingClientRect(); if (py >= r.top && py <= r.bottom){ name = secs[i].getAttribute('data-frame') || (secs[i].id === 'hero' ? 'hero' : 'footer'); } }
        hs.textContent = name;
      }
      requestAnimationFrame(frame);
    })();
  })();

  Object.assign(AB, { addSel: addSel, decorate: decorate });
