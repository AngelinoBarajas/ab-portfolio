  /* ---------- forms: missing-data checks (AB.formCheck, used by the Home planner, Contact and Process forms) ----------
     One on-brand layer instead of native bubbles, toasts and silent no-ops. A page script builds a checker with its
     rules and calls chk.ok() at the top of its submit handler; false = stop. A failed check marks every problem field
     (aria-invalid + aria-describedby → an inline "◆ Missing" line under it), writes a one-line summary above the
     submit ("2 systems not go: name, email", polite live region), shakes the problem groups and focuses the first one.
     Each message clears as soon as its field is fixed; nothing shows before the first attempt.
     Webflow's bot check (Turnstile) keeps the submit DISABLED until its token arrives, and a disabled button fires no
     click, so pointerup on it (pointer events still fire) and Enter in a field run the same check, then say the
     security check is still running instead of doing nothing. The form gets novalidate so browser bubbles don't
     compete; `required` stays for semantics. Rules:
       { el, name, box?, focus?, need, bad?, test?(el) → '' | 'need' | 'bad', email? }
     el = the input, or the group element for chip rows (then pass test); box = what the message goes under. ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/, chkN = 0;
  function formCheck(form, o){
    if (!form) return null;
    o = o || {};
    form.noValidate = true;
    var btn = o.btn || $('[type="submit"]', form), tried = false, wrap = form.closest('.w-form') || form.parentNode;
    var rules = (o.rules || []).filter(function(r){ return r && r.el; });
    rules.forEach(function(r){
      var isIn = /^(INPUT|TEXTAREA|SELECT)$/.test(r.el.tagName);
      r.box = r.box || (isIn && r.el.closest('label')) || r.el;
      r.focus = r.focus || (isIn ? r.el : $('button, input', r.el)) || r.el;
      if (!r.test) r.test = function(el){ var v = (el.value || '').trim(); return !v ? 'need' : (r.email || el.type === 'email') && !EMAIL_RE.test(v) ? 'bad' : ''; };
      // inside the field's <label> (a sibling would become a stray cell in grid rows like the planner's Name | Email);
      // aria-hidden keeps it out of the label's name, aria-describedby still reads it
      var m = r.msg = document.createElement('span'); m.className = 'abx-msg'; m.id = 'abx-m' + (++chkN); m.hidden = true;
      if (r.box.tagName === 'LABEL'){ m.setAttribute('aria-hidden', 'true'); r.box.appendChild(m); }
      else r.box.parentNode.insertBefore(m, r.box.nextSibling);
      var ev = function(){ if (tried) setTimeout(function(){ check(r, false); summary(); }, 0); };
      // fixed → the message goes at once; still wrong → the wording updates when the visitor leaves the field. Leaving
      // never ADDS a message: blur fires on the submit's mousedown, and a new line above it would move the button out
      // from under the pointer (the click is lost). New problems show on the next submit.
      if (isIn){ r.el.addEventListener('input', ev); r.el.addEventListener('change', function(){ if (tried && r.state){ check(r, true); summary(); } }); }
      else r.el.addEventListener('click', ev);
    });
    // the summary line sits right above the submit row
    var sum = document.createElement('div'); sum.className = 'abx-sum'; sum.setAttribute('role', 'status'); sum.setAttribute('aria-live', 'polite'); sum.hidden = true;
    var row = o.at || (btn && btn.parentNode !== form ? btn.parentNode : btn);
    if (row && row.parentNode) row.parentNode.insertBefore(sum, row); else form.appendChild(sum);
    sum.addEventListener('click', function(e){
      var b = e.target.closest('[data-abx-go]'); if (!b) return;
      var r = rules[+b.getAttribute('data-abx-go')]; if (r) go(r);
    });

    function tag(k){ return k === 'bad' ? (o.badTag || 'Signal check') : (o.needTag || 'Missing'); }
    function mark(r, k){
      var on = !!k; r.state = k;
      r.el.setAttribute('aria-invalid', on ? 'true' : 'false');
      r.box.classList.toggle('abx-bad', on);
      var ids = (r.focus.getAttribute('aria-describedby') || '').split(' ').filter(function(x){ return x && x !== r.msg.id; });
      if (on) ids.push(r.msg.id);
      if (ids.length) r.focus.setAttribute('aria-describedby', ids.join(' ')); else r.focus.removeAttribute('aria-describedby');
      if (r.focus !== r.el && r.el.getAttribute('role') === 'group'){ if (on) r.el.setAttribute('aria-describedby', r.msg.id); else r.el.removeAttribute('aria-describedby'); }
      if (on) r.msg.innerHTML = '<span class="abx-k">◆ ' + esc(tag(k)) + '</span><span>' + esc(k === 'bad' && r.bad ? r.bad : r.need) + '</span>';
      r.msg.hidden = !on;
    }
    // soft = while typing: only ever clears (a half-typed email isn't an error yet)
    function check(r, full){
      var k = r.test(r.el) || '';
      if (!full && ((k === 'bad' && r.state !== 'bad') || (k === 'need' && !r.state))) k = '';
      mark(r, k); return k;
    }
    function summary(extra){
      var bad = rules.filter(function(r){ return r.state; });
      sum.classList.remove('is-go', 'is-wait');
      if (!tried){ sum.hidden = true; return; }
      if (extra){ sum.classList.add('is-wait'); sum.innerHTML = '<span class="abx-k">◆ ' + esc(extra[0]) + '</span><span>' + esc(extra[1]) + '</span>'; sum.hidden = false; return; }
      // "all systems go" only when every rule really passes (an unflagged field emptied after the check isn't go)
      if (!bad.length && rules.some(function(r){ return r.test(r.el); })){ sum.hidden = true; return; }
      if (!bad.length){ sum.classList.add('is-go'); sum.innerHTML = '<span class="abx-k">◆ All systems go</span><span>Ready when you are.</span>'; sum.hidden = false; return; }
      sum.innerHTML = '<span class="abx-k">◆ ' + esc(o.holdTag || 'Hold launch') + '</span><span>' + bad.length + ' system' + (bad.length > 1 ? 's' : '') + ' not go: ' +
        bad.map(function(r){ return '<button type="button" class="abx-go" data-abx-go="' + rules.indexOf(r) + '">' + esc(r.name) + '</button>'; }).join(', ') + '</span>';
      sum.hidden = false;
    }
    function go(r){
      try { r.focus.focus({ preventScroll: true }); } catch (e){ r.focus.focus(); }
      var b = r.box.getBoundingClientRect();
      if (b.top < 90 || b.bottom > innerHeight - 40){
        if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(r.box, { offset: -140 });
        else r.box.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
    }
    function shake(el){ if (reduce) return; el.classList.remove('abx-shake'); void el.offsetWidth; el.classList.add('abx-shake'); }
    function ok(){
      tried = true;
      var bad = rules.filter(function(r){ return check(r, true); });
      summary();
      if (!bad.length) return true;
      bad.forEach(function(r){ shake(r.box); });
      go(bad[0]);
      return false;
    }
    // Turnstile still holding the button: check anyway, then say why it can't go yet
    function blocked(){
      if (!btn || !btn.disabled || form.classList.contains('is-sending') || form.classList.contains('is-flying')) return;
      if (btn.getAttribute('data-wait') && btn.value === btn.getAttribute('data-wait')) return; // Webflow is posting it
      if (!ok()) return;
      summary(wrap && wrap.classList.contains('w-form-loading')
        ? ['Pre-flight', 'Running a quick security check. Give it a second, then try again.']
        : ['Pre-flight', 'The security check didn’t clear. Refresh the page and try again.']);
    }
    if (btn){
      (btn.parentNode || form).addEventListener('pointerup', function(e){ if (e.button === 0 && (e.target === btn || btn.contains(e.target))) blocked(); });
      // the token arrived: drop the pre-flight note
      new MutationObserver(function(){ if (!btn.disabled && sum.classList.contains('is-wait')) summary(); }).observe(btn, { attributes: true, attributeFilter: ['disabled'] });
    }
    form.addEventListener('keydown', function(e){
      if (e.key === 'Enter' && btn && btn.disabled && e.target.tagName === 'INPUT' && !/^(button|submit|checkbox|radio|range)$/.test(e.target.type)){ e.preventDefault(); blocked(); }
    });
    function reset(){ tried = false; rules.forEach(function(r){ mark(r, ''); r.box.classList.remove('abx-shake'); }); summary(); }
    form.addEventListener('reset', function(){ setTimeout(reset, 0); });
    return { ok: ok, reset: reset, email: EMAIL_RE };
  }
  AB.formCheck = formCheck;
