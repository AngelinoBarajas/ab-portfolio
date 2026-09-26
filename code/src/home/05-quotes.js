  /* ---------- testimonials: Missions › Client quote (the Designer list filters out Hide from site). A mission
     without a quote drops out; with no quotes left the whole section hides, so a removed client leaves no trace. ---------- */
  (function(){
    var sec = $('.section_testimonials'); if (!sec) return;
    $$('.ab_quotes .w-dyn-item', sec).forEach(function(it){
      var q = $('.ab_quote_text', it);
      if (!q || !q.textContent.trim() || q.classList.contains('w-dyn-bind-empty')) it.parentNode.removeChild(it);
    });
    if (!$('.ab_quotes .ab_quote', sec)) sec.style.display = 'none';
  })();
