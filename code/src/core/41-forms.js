  /* ---------- forms: success + failure without a layout jump (every native Webflow form) ----------
     Webflow hides the <form> and shows .w-form-done with inline styles, so the page used to shrink by the difference
     (Process: 783px form → 313px message). The done block now takes the form's height from the submit, centers its
     copy and plays one shared reveal: a square signal beacon pings, a scan line sweeps down, the copy rises in.
     Page scripts keep their extras (planner flight, Contact toast); their "send another" buttons hide the block,
     which releases the lock. Never style .w-form-done's display in CSS (it beats Webflow's display:none): the flex
     is set inline here, only while the block is shown. */
  (function(){
    $$('.w-form').forEach(function(w){
      var form = $('form', w), done = $('.w-form-done', w), fail = $('.w-form-fail', w);
      if (!form || !done) return;
      var h = 0;
      // Webflow shows the block with done.focus() and no preventScroll: the browser jumped ~840px to it behind Lenis's back
      // and Lenis then "corrected" to the wrong place. Its focus never scrolls; reveal() glides there instead.
      done.focus = function(){ HTMLElement.prototype.focus.call(done, { preventScroll: true }); };
      if (fail) fail.focus = function(){ HTMLElement.prototype.focus.call(fail, { preventScroll: true }); };
      // capture phase: runs before any page handler, and again on a script's requestSubmit() second pass
      form.addEventListener('submit', function(){ if (form.offsetHeight) h = form.offsetHeight; }, true);

      // the copy to animate: the single inner wrapper's children (planner, Contact) or the block's own children
      var kids = $$(':scope > *', done), box = kids.length === 1 && kids[0].children.length > 1 ? kids[0] : done;
      var sig = document.createElement('span'); sig.className = 'abx-sig'; sig.setAttribute('aria-hidden', 'true');
      sig.innerHTML = '<b></b><i></i><i></i>';
      box.insertBefore(sig, box.firstChild);
      var scan = document.createElement('span'); scan.className = 'abx-scan'; scan.setAttribute('aria-hidden', 'true');
      done.appendChild(scan);

      function shown(el){ return !!el.style.display && el.style.display !== 'none'; }
      function reveal(){
        if (h) done.style.minHeight = h + 'px';
        done.style.display = 'flex';
        done.classList.add('abx-sent');
        requestAnimationFrame(function(){ done.classList.add('is-in'); });
        // "while you wait": three places to go next (not the page you're on), so the message isn't a dead end
        if (!done.__next){
          done.__next = true;
          var here = location.pathname.replace(/\/$/, '') || '/';
          var NEXT = [['/work', 'See the missions'], ['/observatory', 'Read the field notes'], ['/process', 'How a mission flies'], ['/about', 'Meet the pilot']]
            .filter(function(n){ return n[0] !== here; }).slice(0, 3);
          var nx = document.createElement('nav'); nx.className = 'abx-next'; nx.setAttribute('aria-label', 'While you wait');
          nx.innerHTML = '<span class="abx-next_l">While you wait</span><div class="abx-next_row">' +
            NEXT.map(function(n){ return '<a href="' + n[0] + '">' + n[1] + ' <span aria-hidden="true">→</span></a>'; }).join('') + '</div>';
          box.appendChild(nx);
        }
        var items = $$(':scope > *', box).filter(function(n){ return n !== sig && n !== scan; });
        if (hasGsap && !reduce && items.length) gsap.fromTo(items, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: .15, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity' });
        try { done.focus({ preventScroll: true }); } catch (e){}
        // a tall form (Home planner 1084px) left a huge, mostly empty message box, and bringing its centered copy into view
        // scrolled the page a long way. Now: copy at the top, glide up to it, then shrink the box to its own height.
        var keep = done.style.minHeight; done.style.minHeight = '0px'; var nh = done.offsetHeight; done.style.minHeight = keep;
        var shrink = h && h - nh > 40;
        if (shrink) done.style.justifyContent = 'flex-start';
        var top = done.getBoundingClientRect().top, far = top < 60 || top > innerHeight * .45;
        if (far){
          if (AB.lenis && AB.lenis.scrollTo) AB.lenis.scrollTo(done, { offset: -120, duration: reduce ? 0 : 1, immediate: reduce });
          else done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }
        if (!shrink) return;
        function settle(){ done.style.minHeight = ''; if (window.ScrollTrigger) ScrollTrigger.refresh(); }
        if (hasGsap && !reduce) gsap.fromTo(done, { minHeight: h }, { minHeight: nh, duration: .7, ease: 'power3.inOut', delay: far ? .9 : .25, onComplete: settle });
        else settle();
      }
      new MutationObserver(function(){
        var on = shown(done);
        if (on && !done.__abx){ done.__abx = true; reveal(); }
        else if (!on && done.__abx){ done.__abx = false; done.classList.remove('abx-sent', 'is-in'); done.style.minHeight = ''; done.style.justifyContent = ''; if (hasGsap) gsap.killTweensOf(done); }
      }).observe(done, { attributes: true, attributeFilter: ['style'] });

      // failure: the form stays, the message slides in under it (only what's below moves, and only a line)
      if (fail) new MutationObserver(function(){
        var on = shown(fail);
        if (on && !fail.__abx){
          fail.__abx = true; fail.classList.add('abx-fail');
          if (hasGsap && !reduce) gsap.fromTo(fail, { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power2.out', clearProps: 'transform,opacity' });
        } else if (!on) fail.__abx = false;
      }).observe(fail, { attributes: true, attributeFilter: ['style'] });
    });
  })();
