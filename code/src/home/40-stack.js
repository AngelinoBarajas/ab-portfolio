
  /* ---------- distance meter (page scroll → falling toward Gargantua, the footer's black hole): the marker slides down the
     track to the black hole at its foot and the readout counts the distance down; halfway it passes Miller's planet ---------- */
  (function(){
    if (!hasGsap) return;
    AB.inject('<div class="ab_alt" aria-hidden="true"><div class="ab_alt-fill" id="altFill"></div><div class="ab_alt-bh"></div><div class="ab_alt-lab" id="altLab">Gargantua · 1.50B km</div></div>');
    var altFill = $('#altFill'), altLab = $('#altLab'), nf = new Intl.NumberFormat('en-US'), FAR = 1.5e9;
    function dist(km){ return km >= 1e9 ? (km / 1e9).toFixed(2) + 'B km' : km >= 1e6 ? (km / 1e6).toFixed(1) + 'M km' : nf.format(Math.round(km)) + ' km'; }
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function(self){
      var p = self.progress; altFill.style.height = (p * 100) + '%'; altLab.style.top = (p * 100) + '%';
      // the waypoint stacks under the distance so the label never grows wide into the page
      var html = p > .995 ? 'Event horizon<span class="ab_alt-sub">Gargantua</span>' : 'Gargantua · ' + dist((1 - p) * (1 - p) * FAR) + (p > .46 && p < .54 ? '<span class="ab_alt-sub">Miller’s planet</span>' : '');
      if (html !== altLab.__h){ altLab.__h = html; altLab.innerHTML = html; }
    } });
  })();
