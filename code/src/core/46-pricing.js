  /* ---------- pricing estimate (shared by the Services hub trajectory, the /process request and the Home planner) ----------
     One source for the tier rules decided 2026-10-09 (pricing doc: claude.ai/code/artifact/b50a885d-…):
     - Website = Launch from $6,500 (performance pass included).
     - Website + motion or design system = Orbit from $12,000 (includes motion, design system, one CMS integration,
       performance).
     - Orbit-level picks + interactive 3D = Deep space from $22,000 (everything in Orbit + one 3D piece).
     - On Launch, 3D (+$4,500) and a CMS integration (+$2,500) are add-ons. Brand identity is +$3,500 on every tier.
       Performance never changes the tier and is included with every tier, the coded track, and any 3D or motion work.
     - Custom deploys (or "Web app") = the coded-build track from $8,000 + add-ons.
     - No website picked = the services' own starting prices added up (work on an existing site).
     Slugs are the Services collection slugs. Change prices here and in the pricing doc together. */
  (function(){
    var PRICE = { branding: 3500, motion: 1500, 'webgl-data': 4500, 'cms-integrations': 2500, 'design-systems': 3000, performance: 1500 };
    var NAME = { 'webflow-development': 'Website', branding: 'Brand identity', motion: 'Signature motion', 'webgl-data': 'Interactive 3D piece',
      'cms-integrations': 'CMS integration', 'design-systems': 'Design system', performance: 'Performance pass', 'custom-deploys': 'Coded build' };
    var BANDS = [6500, 12000, 22000, 40000]; // Under $6.5k · $6.5–12k · $12–22k · $22–40k · $40k+ (same order as the forms)
    function money(n){ return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function estimate(slugs){
      var has = {}; (slugs || []).forEach(function(s){ has[s] = true; });
      var r = { tier: '', from: 0, included: [], addons: [], total: 0, track: '' };
      if (!slugs || !slugs.length) return null;
      function add(s){ if (PRICE[s]) { r.addons.push({ s: s, name: NAME[s], price: PRICE[s] }); r.total += PRICE[s]; } }
      if (has['custom-deploys']){
        r.track = 'coded'; r.tier = 'Coded build'; r.from = 8000; r.total = 8000;
        if (has.performance) r.included.push(NAME.performance);
        ['branding', 'motion', 'webgl-data', 'cms-integrations', 'design-systems'].forEach(function(s){ if (has[s]) add(s); });
      } else if (has['webflow-development']){
        r.track = 'site';
        var orbit = has.motion || has['design-systems'], deep = orbit && has['webgl-data'];
        r.tier = deep ? 'Deep space' : orbit ? 'Orbit' : 'Launch'; r.from = deep ? 22000 : orbit ? 12000 : 6500; r.total = r.from;
        if (has.performance) r.included.push(NAME.performance);
        if (orbit){
          ['motion', 'design-systems', 'cms-integrations'].forEach(function(s){ if (has[s]) r.included.push(NAME[s]); });
          if (deep) r.included.push(NAME['webgl-data']);
        } else {
          ['webgl-data', 'cms-integrations'].forEach(function(s){ if (has[s]) add(s); });
        }
        if (has.branding) add('branding');
      } else {
        r.track = 'existing'; r.tier = '';
        ['branding', 'motion', 'webgl-data', 'cms-integrations', 'design-systems'].forEach(function(s){ if (has[s]) add(s); });
        // a performance pass comes with any 3D or motion work; on its own it's the audit + fixes
        if (has.performance){ if (has.motion || has['webgl-data']) r.included.push(NAME.performance); else add('performance'); }
      }
      r.band = 4; for (var i = 0; i < BANDS.length; i++) if (r.total < BANDS[i]){ r.band = i; break; }
      return r;
    }
    function html(r, o){
      o = o || {};
      if (!r) return '<div class="ab_est is-empty"><span class="ab_est_k">Estimate</span><p class="ab_est_note">Pick a destination to see where it starts.</p></div>';
      var h = '<div class="ab_est"><span class="ab_est_k">Estimate</span>';
      if (r.tier) h += '<p class="ab_est_tier">' + (r.track === 'site' ? 'Recommended tier · ' : '') + '<b>' + AB.esc(r.tier) + '</b> from ' + money(r.from) + '</p>';
      else h += '<p class="ab_est_tier"><b>Services on their own</b> (no new site)</p>';
      if (r.included.length) h += '<p class="ab_est_line">Includes ' + AB.esc(r.included.join(', ')) + '</p>';
      if (r.addons.length) h += '<ul class="ab_est_adds">' + r.addons.map(function(a){ return '<li><span>' + (r.tier ? '+ ' : '') + AB.esc(a.name) + '</span><span>' + money(a.price) + '</span></li>'; }).join('') + '</ul>';
      h += '<p class="ab_est_total">Estimate from <b>' + money(r.total) + '</b></p>';
      if (o.note !== false) h += '<p class="ab_est_note">Estimates only. Your quote is fixed once we scope the project together.</p>';
      return h + '</div>';
    }
    AB.estimate = estimate; AB.estimateHTML = html; AB.money = money;
  })();
