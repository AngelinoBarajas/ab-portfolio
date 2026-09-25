
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
  function toggleGrid(){ var on = !lgrid.classList.contains('on'); lgrid.classList.toggle('on', on); if (gbtn) gbtn.setAttribute('aria-pressed', on); toast(on ? 'Layout grid on · 12 columns · 24px gutter' : 'Layout grid off'); }
  if (gbtn){
    if (!gbtn.hasAttribute('tabindex')) gbtn.tabIndex = 0;
    gbtn.setAttribute('aria-pressed', 'false');
    gbtn.addEventListener('click', toggleGrid);
    gbtn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleGrid(); } });
  }
  document.addEventListener('keydown', function(e){ if (e.shiftKey && (e.key === 'G' || e.key === 'g') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); toggleGrid(); } });

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
