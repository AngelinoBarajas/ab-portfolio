
  /* ---------- orbit (Tools Collection List → chips on two rings), shared system in ab-core ---------- */
  AB.orbit($('#orbit'), $('#toolReadout'));

  /* ---------- altitude meter (page scroll → Earth-to-Moon) ---------- */
  (function(){
    if (!hasGsap) return;
    AB.inject('<div class="ab_alt" aria-hidden="true"><div class="ab_alt-fill" id="altFill"></div><div class="ab_alt-lab" id="altLab">ALT 0 km</div></div>');
    var altFill = $('#altFill'), altLab = $('#altLab'), nf = new Intl.NumberFormat('en-US');
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function(self){
      var p = self.progress; altFill.style.height = (p * 100) + '%'; altLab.style.bottom = (p * 100) + '%';
      altLab.textContent = p > .995 ? 'ALT 384,400 km · Moon reached' : 'ALT ' + nf.format(Math.round(p * 384400)) + ' km';
    } });
  })();

  /* ---------- transmission (Quotes via the site-data block) ---------- */
  (function(){
    var box = $('#iq'); if (!box || !QUOTES.length) return;
    var textEl = $('#iqText'), byEl = $('#iqBy'), idx = 0, scrub;
    $('#iqTotal').textContent = pad2(QUOTES.length);
    function render(i, reveal){
      var q = QUOTES[i]; idx = i;
      $('#iqIdx').textContent = pad2(i + 1);
      textEl.classList.toggle('long', q.t.length > 80);
      textEl.innerHTML = ''; q.t.split(/\s+/).forEach(function(w){ var s = document.createElement('span'); s.className = 'qw'; s.textContent = w; textEl.appendChild(s); textEl.appendChild(document.createTextNode(' ')); });
      byEl.textContent = q.a + ' · ' + q.c;
      var words = $$('.qw', textEl);
      if (reduce || !hasGsap) return;
      if (reveal === 'scrub'){
        // reveal once when the quote comes into view (robust to pinned sections above changing the page height)
        gsap.set(words, { opacity: .12, y: 10 }); gsap.set(byEl, { opacity: 0 });
        scrub = ScrollTrigger.create({ trigger: box, start: 'top 78%', once: true, onEnter: function(){
          gsap.to(words, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' });
          gsap.to(byEl, { opacity: 1, duration: .6, delay: .4 });
        } });
      } else {
        // the next transmission plots in like the INCOMING label: each word decodes from noise, left to right
        gsap.set(words, { opacity: 1, y: 0 });
        if (window.ScrambleTextPlugin) words.forEach(function(w, k){ var txt = w.textContent; gsap.fromTo(w, { opacity: .35 }, { opacity: 1, duration: .5, delay: k * .05, scrambleText: { text: txt, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+', speed: .6, revealDelay: .15 } }); });
        else gsap.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, stagger: .035, ease: 'power3.out' });
        gsap.fromTo(byEl, { opacity: 0 }, { opacity: 1, duration: .5, delay: .3 + words.length * .05 });
      }
    }
    render(0, 'scrub');
    function next(){ if (scrub){ scrub.kill(); scrub = null; } render((idx + 1) % QUOTES.length, 'pop'); }
    // transmissions change by themselves while the section is on screen (paused on hover); longer quotes stay up longer
    var auto = null, seen = false, held = false;
    function queue(){ clearTimeout(auto); if (reduce || !hasGsap || !seen || held || QUOTES.length < 2) return; auto = setTimeout(function(){ next(); queue(); }, 4200 + QUOTES[idx].t.length * 30); }
    onView(box, function(x){ seen = x; if (x) queue(); else clearTimeout(auto); });
    box.addEventListener('mouseenter', function(){ held = true; clearTimeout(auto); });
    box.addEventListener('mouseleave', function(){ held = false; queue(); });
    $('#iqNext').addEventListener('click', function(){ next(); queue(); });
  })();
