  /* =========================================================
     TOPICWEAVE · THE APP (channel tw-app): the dashboard prototype (cks-v3/app/index.html) as a coded scene
       Overview : the site's numbers count up, the topic list fills in
       Topics   : one topic opens in the drawer with the pages tied to it
       Map      : the knowledge map's nodes and threads draw in; a topic lights its threads
       Health   : a suggestion card for a topic with nothing behind it yet
     Hover or tap a topic (Overview list, Topics table, map node) to light it: that holds the loop, the play
     button hands it back. The nav items switch views too. Landscape: sidebar; portrait: top bar + nav strip.
     Sample data is the prototype's own (app/data.js, app/data-more.js) and the interface says so.
     ========================================================= */
  (function(){
    var K = SCENE.kit; if (!K || !K.tw || !K.ks) return;
    var T = K.tw, X = K.ks, q = K.q, qa = K.qa, esc = K.esc, NS = 'http://www.w3.org/2000/svg';

    var IC = {
      overview: '<path d="M3 13h4v4H3zM8 8h4v9H8zM13 3h4v14h-4z"/>',
      topics: '<circle cx="10" cy="10" r="2.5"/><circle cx="4" cy="5" r="1.6"/><circle cx="16" cy="5" r="1.6"/><circle cx="4" cy="15" r="1.6"/><circle cx="16" cy="15" r="1.6"/><path d="M5.3 6l3 2.6M14.7 6l-3 2.6M5.3 14l3-2.6M14.7 14l-3-2.6"/>',
      health: '<path d="M10 17s-6-3.6-6-8.3A3.4 3.4 0 0 1 10 6.6a3.4 3.4 0 0 1 6 2.1C16 13.4 10 17 10 17z"/>',
      ideas: '<path d="M7 16h6M8 18.5h4M10 2.5a5.5 5.5 0 0 0-3.2 10c.5.4.7 1 .7 1.5h5c0-.5.2-1.1.7-1.5A5.5 5.5 0 0 0 10 2.5z"/>',
      ai: '<path d="M10 2.5l1.8 4.7 4.7 1.8-4.7 1.8L10 15.5l-1.8-4.7L3.5 9l4.7-1.8z"/>',
      review: '<rect x="3" y="3" width="14" height="14" rx="3"/><path d="M6.5 10l2.3 2.3L13.5 7.6"/>',
      changes: '<path d="M4 7h9M10 4l3 3-3 3M16 13H7M10 10l-3 3 3 3"/>',
      inbox: '<path d="M3 11l2.2-6.5h9.6L17 11v5H3z"/><path d="M3 11h4l1 2h4l1-2h4"/>',
      map: '<circle cx="5" cy="6" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="10" cy="15" r="2"/><path d="M6.8 6.6l6.4-1.2M6 7.8l3 5.4M14 6.8l-3 6.4"/>',
      machine: '<rect x="3" y="4" width="14" height="12" rx="2"/><path d="M7 8l-2 2 2 2M13 8l2 2-2 2M11 7.5l-2 5"/>',
      reports: '<path d="M5 2.5h7l3 3v12H5z"/><path d="M8 10h4M8 13h4M8 7h2"/>',
      conn: '<path d="M8 12l4-4M6.5 9.5l-2 2a2.8 2.8 0 0 0 4 4l2-2M13.5 10.5l2-2a2.8 2.8 0 0 0-4-4l-2 2"/>'
    };
    function icon(k){ return '<svg viewBox="0 0 20 20" aria-hidden="true">' + IC[k] + '</svg>'; }
    // [route or '', label, icon, count, shown in the portrait strip]; a label with no icon is a group heading
    var NAV = [['overview', 'Overview', 'overview', '', 1], ['topics', 'Topics', 'topics', '', 1], ['health', 'Link health', 'health', '7', 1], ['', 'Search ideas', 'ideas', '5', 1], ['', 'AI visibility', 'ai'],
      ['', 'Content'], ['', 'Review queue', 'review', '2'], ['', 'Changes', 'changes'], ['', 'Capture inbox', 'inbox', '5'],
      ['', 'Publish'], ['map', 'Knowledge map', 'map', '', 1], ['', 'For machines', 'machine'],
      ['', 'Setup'], ['', 'Reports', 'reports'], ['', 'Connections', 'conn']];

    /* sample data: app/data.js + app/data-more.js (every number there is made up for the demo) */
    var KPI = [['Search impressions', 'Search Console', 14750, '', '+27%', 'vs the 28 days before'], ['Search clicks', 'Search Console', 568, '', '+19%', 'vs the 28 days before'],
      ['Visits from AI assistants', 'Topicweave pixel', 61, '', '+41%', 'ChatGPT, Perplexity, Claude, Gemini'], ['Assistant mentions', 'Assistant checks', 4, ' of 12', '+2 since August', 'questions where you were named'],
      ['Link health', 'Topicweave', 82, '', '+6 this month', 'out of 100']];
    var TOP = [
      { n: 'Client onboarding', cat: 'Ideas', c: '#9B87F5', pg: 7, pr: 2, ai: 2, imp: [420, 510, 640, 780, 930, 1240], st: 'ok', stt: 'Healthy',
        pc: ['Onboarding is a design problem', 'The first 30 days decide the next three years', 'Riverside Clinic intake (project)', 'Hale & Partners onboarding (project)'] },
      { n: 'Journey mapping', cat: 'How it works', c: '#139E8A', pg: 5, pr: 3, ai: 1, imp: [380, 400, 450, 520, 610, 780], st: 'ok', stt: 'Healthy',
        pc: ['What a journey map is really for (video)', 'Riverside Clinic intake (project)', 'Northgate client portal (project)'] },
      { n: 'Client handoffs', cat: 'What you watch for', c: '#EF5B3F', pg: 3, pr: 0, ai: 0, imp: [120, 150, 190, 260, 380, 610], st: 'gap', stt: 'No project proves it',
        pc: ['Why handoffs fail on Friday afternoons', 'Every complaint starts at a handoff'] },
      { n: 'Service design', cat: 'Services · Known for', c: '#4F7BFF', pg: 6, pr: 3, ai: 1, imp: [510, 520, 560, 570, 600, 620], st: 'ok', stt: 'Healthy',
        pc: ['Service design sprint (service)', 'Northgate client portal (project)'] },
      { n: 'Professional firms', cat: 'Who you help', c: '#B18CFF', pg: 4, pr: 2, ai: 0, imp: [200, 230, 250, 270, 300, 330], st: 'ok', stt: 'Healthy',
        pc: ['Hale & Partners onboarding (project)'] },
      { n: 'Plain-language UX', cat: 'Known for', c: '#9AA3AD', pg: 2, pr: 1, ai: 0, imp: [260, 250, 240, 235, 225, 215], st: 'gap', stt: 'Going quiet',
        pc: ['The form we rewrote eleven times'] },
      { n: 'Accessibility', cat: 'What you watch for', c: '#36C28F', pg: 1, pr: 0, ai: 0, imp: [40, 45, 60, 55, 70, 80], st: 'bad', stt: 'No definition', pc: [] }
    ];
    var INS = [['#EF5B3F', 'Client handoffs is your fastest-growing topic (+64%), but no project proves it yet.', 'Riverside Clinic intake mentions handoffs three times. Tag it?', 'Review tag'],
      ['#9B87F5', 'Claude named you for “Who designs client onboarding for professional firms?”', 'First mention for this question. Quote saved to the assistant log.', 'See the answer'],
      ['#4F7BFF', '5 searches bring people to your site that no topic covers yet.', 'Top one: “what is a service blueprint”, 260 impressions.', 'See ideas']];
    // knowledge map (mapNodes): the first six topics, and pieces with the topics they're tagged with
    var MP = [['Onboarding is a design problem', [0, 3]], ['The first 30 days', [0]], ['What a journey map is for', [1]], ['Riverside Clinic intake', [0, 1, 2]], ['Hale & Partners', [0, 4]],
      ['Northgate client portal', [3, 1]], ['Why handoffs fail', [2]], ['The form we rewrote', [5, 0]], ['Service design sprint', [3]], ['Do you work with small firms?', [4]]];
    var MW = 720, MH = 440, MT = 6, MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    var FOCUS = 0, OPEN = 0; // the loop opens and lights Client onboarding (most pages tied to it)

    function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    function delta(a){ return Math.round((a[a.length - 1] / a[a.length - 2] - 1) * 100); }
    function pct(n){ return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n) + '%'; }
    function spark(v, c){
      var w = 84, h = 24, mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      var d = v.map(function(x, i){ return (i ? 'L' : 'M') + (i / (v.length - 1) * w).toFixed(1) + ' ' + (h - 3 - (x - mn) / (mx - mn || 1) * (h - 6)).toFixed(1); }).join(' ');
      return '<svg class="tw-a-spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><path d="' + d + '" stroke="' + c + '"/></svg>';
    }
    function lineD(v, w, h, max){
      return v.map(function(x, i){ return (i ? 'L' : 'M') + (8 + i / (v.length - 1) * (w - 16)).toFixed(1) + ' ' + (h - 18 - x / max * (h - 30)).toFixed(1); }).join(' ');
    }
    function tPos(k){ var a = -Math.PI / 2 + k / MT * Math.PI * 2; return [MW / 2 + Math.cos(a) * 120, MH / 2 + Math.sin(a) * 110]; }
    function pPos(k){ var a = -Math.PI / 2 + (k + .5) / MP.length * Math.PI * 2; return [MW / 2 + Math.cos(a) * 290, MH / 2 + Math.sin(a) * 190]; }
    function tiedTo(t){ return MP.filter(function(p){ return p[1].indexOf(t) > -1; }).length; }

    SCENE.add('tw-app', function(sc){
      T.fonts(sc);
      var P = sc.portrait, st = sc.stg;
      function head(h, s, tools){ return '<header class="tw-a-top"><div><h1>' + h + '</h1><p>' + s + '</p></div><div class="tw-a-tools">' + (tools || '') + '<span class="tw-a-note">Sample data</span></div></header>'; }
      var seg = '<span class="tw-a-seg"><i>7 days</i><i class="on">28 days</i><i>6 months</i></span>';

      var side = '<aside class="tw-a-side"><div class="tw-a-brand">' + T.LOGO + '<span>App</span></div>' +
        '<div class="tw-a-site"><i></i><span><b>Example Studio</b><small>yoursite.com · Webflow</small></span></div><nav class="tw-a-nav">' +
        NAV.map(function(n){
          if (!n[2]) return '<p class="tw-a-grp">' + esc(n[1]) + '</p>';
          return '<button type="button" class="tw-a-ni' + (n[0] ? ' is-r' : '') + (n[4] ? ' is-p' : '') + '"' + (n[0] ? ' data-r="' + n[0] + '"' : ' tabindex="-1"') + '>' + icon(n[2]) + '<span>' + esc(n[1]) + '</span>' + (n[3] ? '<em>' + n[3] + '</em>' : '') + '</button>';
        }).join('') + '</nav><div class="tw-a-foot">Prototype · sample data</div></aside>';

      var vOv = '<section class="tw-a-v" data-v="overview">' + head('Good morning. Here’s what moved.', 'yoursite.com · Last 28 days. Every number is grouped by your own vocabulary.', seg) +
        '<div class="tw-a-kpis">' + KPI.map(function(k){ return '<div class="tw-a-card tw-a-kpi"><div class="tw-a-kl">' + esc(k[0]) + '<small>' + esc(k[1]) + '</small></div><b data-to="' + k[2] + '" data-suf="' + k[3] + '">' + fmt(k[2]) + k[3] + '</b><div class="tw-a-up">' + esc(k[4]) + '<span> · ' + esc(k[5]) + '</span></div></div>'; }).join('') + '</div>' +
        '<div class="tw-a-row2"><div class="tw-a-card tw-a-tlist"><div class="tw-a-ch"><h2>Your topics</h2><small>Impressions by topic · Search Console</small></div>' +
          TOP.map(function(t, i){ var d = delta(t.imp); return '<div class="tw-a-trow" data-i="' + i + '" style="--c:' + t.c + '"><i></i><span><b>' + esc(t.n) + '</b><small>' + esc(t.cat) + '</small></span>' + spark(t.imp, t.c) + '<span class="tw-a-num">' + fmt(t.imp[5]) + '</span><span class="' + (d < 0 ? 'tw-a-dn' : 'tw-a-up') + '">' + pct(d) + '</span></div>'; }).join('') +
        '</div><div class="tw-a-card tw-a-ins"><div class="tw-a-ch"><h2>What changed</h2><small>Written for you, not a chart</small></div>' +
          INS.map(function(n){ return '<div class="tw-a-in"><i style="background:' + n[0] + '"></i><div><p>' + esc(n[1]) + '</p><small>' + esc(n[2]) + '</small><em>' + esc(n[3]) + ' →</em></div></div>'; }).join('') +
        '</div></div></section>';

      var vTp = '<section class="tw-a-v" data-v="topics">' + head('Topics', 'Your vocabulary, with the proof and the traffic behind each term. Click a topic for its pages.', seg) +
        '<div class="tw-a-card tw-a-tbl"><div class="tw-a-th"><span>Topic</span><span class="tw-a-cat">Category</span><span class="tw-a-num">Pieces</span><span class="tw-a-num tw-a-pr">Projects</span><span class="tw-a-num">Impressions</span><span>6 months</span><span class="tw-a-stc">Status</span></div>' +
          TOP.map(function(t, i){ return '<div class="tw-a-tr" data-i="' + i + '" style="--c:' + t.c + '"><span class="tw-a-tn"><i></i>' + esc(t.n) + '</span><span class="tw-a-cat">' + esc(t.cat) + '</span><span class="tw-a-num">' + t.pg + '</span><span class="tw-a-num tw-a-pr' + (t.pr ? '' : ' tw-a-dn') + '">' + t.pr + '</span><span class="tw-a-num">' + fmt(t.imp[5]) + '</span>' + spark(t.imp, t.c) + '<span class="tw-a-stc"><em class="tw-a-pill is-' + t.st + '">' + esc(t.stt) + '</em></span></div>'; }).join('') +
        '</div><aside class="tw-a-drawer"><p class="tw-a-lab"></p><h3></h3><p class="tw-a-meta"></p>' +
          '<svg class="tw-a-dchart" viewBox="0 0 360 120" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path class="tw-a-grid" d="M8 30H352M8 66H352M8 102H352"/><path class="tw-a-dl" pathLength="1" d=""/>' + MONTHS.map(function(m, i){ return '<text x="' + (8 + i / 5 * 344) + '" y="117" text-anchor="' + (i ? i === 5 ? 'end' : 'middle' : 'start') + '">' + m + '</text>'; }).join('') + '</svg>' +
          '<p class="tw-a-lab">Pages tied to it</p><ul class="tw-a-pcs"><li></li><li></li><li></li><li></li></ul><p class="tw-a-none">Nothing tagged yet.</p>' +
          '<div class="tw-a-dact"><em class="tw-a-pill"></em><button type="button" class="tw-a-tomap">Show on the map →</button></div></aside></section>';

      var lines = '', nodes = '';
      MP.forEach(function(p, k){ var a = pPos(k); nodes += '<g class="tw-a-mn is-pc" data-p="' + k + '" tabindex="-1"><circle cx="' + a[0] + '" cy="' + a[1] + '" r="6"/><text x="' + a[0] + '" y="' + (a[1] + (a[1] > MH / 2 ? 21 : -13)) + '" text-anchor="middle">' + esc(p[0]) + '</text></g>'; });
      TOP.slice(0, MT).forEach(function(t, k){ var a = tPos(k); nodes += '<g class="tw-a-mn is-t" data-t="' + k + '" tabindex="-1"><circle cx="' + a[0] + '" cy="' + a[1] + '" r="14" fill="' + t.c + '"/><circle class="tw-a-halo" cx="' + a[0] + '" cy="' + a[1] + '" r="22" stroke="' + t.c + '"/><text x="' + a[0] + '" y="' + (a[1] + 32) + '" text-anchor="middle">' + esc(t.n) + '</text></g>'; });
      var vMap = '<section class="tw-a-v" data-v="map">' + head('Knowledge map', 'An explorable map of your topics and the work that proves them, for your own site’s hub page. It updates itself on publish.') +
        '<div class="tw-a-row2 tw-a-mrow"><div class="tw-a-card tw-a-mcard"><div class="tw-a-ch"><h2>Preview</h2><small>Hover a topic to follow its threads</small></div>' +
          '<div class="tw-a-mapw"><svg class="tw-a-map" viewBox="0 0 ' + MW + ' ' + MH + '" aria-label="Knowledge map preview, sample data"><g class="tw-a-mls"></g>' + nodes + '</svg></div><p class="tw-a-ro"></p></div>' +
        '<div class="tw-a-card tw-a-emb"><div class="tw-a-ch"><h2>Embed it</h2><small>One line, or a CMS component</small></div><pre>&lt;div data-topicweave-map="yoursite"&gt;&lt;/div&gt;</pre>' +
          '<div class="tw-a-li"><b>Where it shows</b><small>The hub page (/topics) and, smaller, on each topic page</small></div><div class="tw-a-li"><b>What visitors can do</b><small>Hover a topic to light up its proof; click to open the page</small></div>' +
          '<div class="tw-a-li"><b>Links stay real</b><small>The map is decoration on top of the CMS links, never a replacement for them</small></div></div></div></section>';

      var RC = 2 * Math.PI * 64;
      var vHl = '<section class="tw-a-v" data-v="health">' + head('Link health', 'What Topicweave checks every night: proof, tags, links, definitions and structured data. Fixes are suggestions; you confirm each one.') +
        '<div class="tw-a-hrow"><div class="tw-a-card tw-a-score"><div class="tw-a-ring"><svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="64"/><circle class="tw-a-arc" cx="75" cy="75" r="64" style="stroke-dasharray:' + RC.toFixed(1) + '"/></svg><b>82</b><small>of 100</small></div>' +
          '<div><h2>Up 6 this month.</h2><p>Tagging two pieces and linking two orphan pages would take it past 90.</p></div></div>' +
        '<div class="tw-a-card tw-a-how"><div class="tw-a-ch"><h2>How the score works</h2><small>Weights, so it’s never a mystery</small></div>' +
          '<div class="tw-a-in"><i style="background:#36C28F"></i><div><p>Proof, 35%</p><small>Every topic has at least one project and one piece of writing.</small></div></div>' +
          '<div class="tw-a-in"><i style="background:#4F7BFF"></i><div><p>Connections, 35%</p><small>Every piece is tagged; every page is linked from somewhere.</small></div></div>' +
          '<div class="tw-a-in"><i style="background:#9B87F5"></i><div><p>Machine-readable, 30%</p><small>Definitions filled in and structured data valid on every template.</small></div></div></div></div>' +
        '<div class="tw-a-card tw-a-sug"><div class="tw-a-sl"><span class="tw-a-lab">Suggestion</span><em class="tw-a-pill is-bad">Topics with no proof · 2</em></div>' +
          '<h2>Accessibility is a topic with nothing behind it yet.</h2><p>No project mentions it, and its topic page has no definition. The definition is the page: without it the topic page stays hidden.</p>' +
          '<div class="tw-a-sact"><button type="button" class="tw-a-go">Draft definition</button><button type="button" class="tw-a-ghost">Not now</button><small>Drafted from your Voice Kit. You approve it before anything publishes.</small></div></div></section>';

      st.innerHTML = '<div class="tw-a-bg"></div><div class="tw-a-bar"><i></i><i></i><i></i><span class="tw-a-url">' + T.ICON + '<b>topicweave.com/app/#overview</b></span><span class="tw-a-proto">Prototype · sample data</span></div>' + side +
        '<main class="tw-a-main">' + vOv + vTp + vMap + vHl + '<div class="tw-a-toast" role="status"></div></main>' + X.cursor('a tw-a-cur', 'You') + '<div class="fg-fade"></div>';

      var views = qa(st, '.tw-a-v'), navs = qa(st, '.tw-a-ni.is-r'), url = q(st, '.tw-a-url b'), cur = q(st, '.tw-a-cur'), toast = q(st, '.tw-a-toast');
      var kpis = qa(st, '.tw-a-kpi'), kNums = qa(st, '.tw-a-kpi b'), tRows = qa(st, '.tw-a-trow'), ins = qa(q(st, '.tw-a-ins'), '.tw-a-in');
      var trs = qa(st, '.tw-a-tr'), drawer = q(st, '.tw-a-drawer'), dLine = q(drawer, '.tw-a-dl'), dLis = qa(drawer, '.tw-a-pcs li');
      var mapW = q(st, '.tw-a-mapw'), mapSvg = q(st, '.tw-a-map'), mls = q(st, '.tw-a-mls'), ro = q(st, '.tw-a-ro');
      var mT = qa(st, '.tw-a-mn.is-t'), mPc = qa(st, '.tw-a-mn.is-pc'), arc = q(st, '.tw-a-arc'), score = q(st, '.tw-a-ring b');
      var sug = q(st, '.tw-a-sug'), goB = q(st, '.tw-a-go');
      var ML = [];
      MP.forEach(function(p, k){ var a = pPos(k); p[1].forEach(function(t){ var b = tPos(t), l = X.path(mls, 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1), 'tw-a-ml'); l.setAttribute('stroke', TOP[t].c); l.setAttribute('data-t', t); l.setAttribute('data-p', k); ML.push(l); }); });

      /* state */
      function show(r){
        views.forEach(function(v){ v.classList.toggle('on', v.getAttribute('data-v') === r); });
        navs.forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-r') === r); });
        url.textContent = 'topicweave.com/app/#' + r;
      }
      function fill(i){
        var t = TOP[i], max = Math.max.apply(null, t.imp) * 1.1;
        var ps = qa(drawer, 'p.tw-a-lab'); ps[0].textContent = t.cat;
        q(drawer, 'h3').textContent = t.n;
        q(drawer, '.tw-a-meta').textContent = t.pg + ' pieces · ' + t.pr + ' projects · ' + fmt(t.imp[5]) + ' impressions this month · ' + t.ai + ' of 4 assistants';
        dLine.setAttribute('d', lineD(t.imp, 360, 120, max)); dLine.style.stroke = t.c;
        dLis.forEach(function(li, k){ li.textContent = t.pc[k] || ''; li.classList.toggle('is-x', !t.pc[k]); });
        q(drawer, '.tw-a-none').classList.toggle('on', !t.pc.length);
        var pill = q(drawer, '.tw-a-dact .tw-a-pill'); pill.className = 'tw-a-pill is-' + t.st; pill.textContent = t.stt;
        drawer.setAttribute('data-i', i);
        trs.forEach(function(r, k){ r.classList.toggle('on', k === i); });
      }
      function openD(on){ drawer.classList.toggle('on', on); if (!on) trs.forEach(function(r){ r.classList.remove('on'); }); }
      function rowLit(i){ tRows.forEach(function(r, k){ r.classList.toggle('on', k === i); }); }
      // light a topic (t) or a piece (p) on the map; -1 clears
      function focus(t, p){
        var on = t > -1 || p > -1;
        mapSvg.classList.toggle('is-focus', on);
        ML.forEach(function(l){ var hit = t > -1 ? +l.getAttribute('data-t') === t : +l.getAttribute('data-p') === p; l.classList.toggle('on', on && hit); if (on && hit) mls.appendChild(l); });
        mT.forEach(function(n, k){ n.classList.toggle('on', t > -1 ? k === t : p > -1 && MP[p][1].indexOf(k) > -1); });
        mPc.forEach(function(n, k){ n.classList.toggle('on', p > -1 ? k === p : t > -1 && MP[k][1].indexOf(t) > -1); });
        if (t > -1){ var c = tiedTo(t); ro.innerHTML = '<i style="background:' + TOP[t].c + '"></i><b>' + esc(TOP[t].n) + '</b> · ' + c + ' page' + (c === 1 ? '' : 's') + ' tied to it on the map'; }
        else if (p > -1) ro.innerHTML = '<i></i><b>' + esc(MP[p][0]) + '</b> · tagged with ' + MP[p][1].map(function(k){ return TOP[k].n; }).join(', ');
        else ro.innerHTML = '<i></i>Hover a topic to follow its threads';
      }
      // a topic with no node yet (Accessibility): the map says so instead of lighting anything
      function focusTopic(i){ if (i < MT) focus(i, -1); else { focus(-1, -1); ro.innerHTML = '<i style="background:' + TOP[i].c + '"></i><b>' + esc(TOP[i].n) + '</b> · nothing tied to it on the map yet'; } }
      function say(s){ toast.textContent = s; toast.classList.toggle('on', !!s); }
      function suggestDone(on){ goB.textContent = on ? 'Sent to review ✓' : 'Draft definition'; goB.classList.toggle('is-done', on); }

      /* interaction: hover/tap a topic lights it and holds the loop; play hands it back (state replays to the playhead) */
      var dirty = false;
      function hold(){ dirty = true; if (sc.hold) sc.hold(); }
      function touch(e){ return e && e.pointerType === 'touch'; }
      // a real pointer move (not content sliding under a resting pointer, which fires enter events) takes over
      function hover(el, fn){
        var inside = false;
        el.addEventListener('pointerleave', function(){ inside = false; });
        el.addEventListener('pointermove', function(e){ if (inside || touch(e)) return; inside = true; hold(); fn(); });
      }
      function tap(el, fn){ el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); fn(e); }); }
      tRows.forEach(function(r, i){
        hover(r, function(){ rowLit(i); });
        tap(r, function(){ hold(); rowLit(i); show('map'); focusTopic(i); });
      });
      trs.forEach(function(r, i){
        hover(r, function(){ fill(i); openD(true); });
        tap(r, function(){ hold(); fill(i); openD(true); });
      });
      tap(q(drawer, '.tw-a-tomap'), function(){ hold(); var i = +drawer.getAttribute('data-i'); openD(false); show('map'); focusTopic(i); });
      mT.forEach(function(n, k){
        hover(n, function(){ focus(k, -1); });
        tap(n, function(){ hold(); focus(k, -1); });
      });
      mPc.forEach(function(n, k){
        hover(n, function(){ focus(-1, k); });
        tap(n, function(){ hold(); focus(-1, k); });
      });
      navs.forEach(function(n){ tap(n, function(){ hold(); openD(false); show(n.getAttribute('data-r')); }); });
      tap(goB, function(){ hold(); suggestDone(true); say('Draft written from your Voice Kit and sent to Review'); });
      tap(q(st, '.tw-a-ghost'), function(){ hold(); say('Kept for later. It stays on the Link health list.'); });

      /* positions (unscaled stage) */
      var pos = X.pos;
      function navAt(r){ return pos(st, q(st, '.tw-a-ni[data-r="' + r + '"]'), P ? .5 : .3, .6); }
      function mapAt(k){ var o = pos(st, mapW, 0, 0), s = mapW.offsetWidth / MW, a = tPos(k); return { x: o.x + a[0] * s + 10, y: o.y + a[1] * s - 21 }; }

      /* the loop */
      var R = X.run(sc, function(){ dirty = false; show('overview'); openD(false); fill(OPEN); rowLit(-1); focus(-1, -1); say(''); suggestDone(false); });
      var tl = R.tl, fade = q(st, '.fg-fade');
      function countTo(el, to, suf, t, d){
        var o = { v: 0 };
        tl.set(el, { textContent: '0' + suf }, 0);
        tl.fromTo(o, { v: 0 }, { v: to, duration: d, ease: 'power2.out', immediateRender: false, onUpdate: function(){ el.textContent = fmt(Math.round(o.v)) + suf; } }, t);
      }
      tl.set(fade, { autoAlpha: 0 }, 0).set(cur, { autoAlpha: 0, x: sc.SW * .62, y: sc.SH + 30 }, 0);
      ML.forEach(function(l){ X.hide(R, l); });
      // everything that staggers in starts hidden (a fromTo only takes its from-state when it begins)
      tl.set([kpis, tRows, ins, trs, mT, mPc, dLis, sug], { autoAlpha: 0 }, 0);
      tl.set(dLine, { strokeDasharray: 1, strokeDashoffset: 1 }, 0).set(arc, { strokeDashoffset: RC }, 0);

      // 1 · Overview
      tl.addLabel('ov', 0);
      tl.fromTo(kpis, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .08, immediateRender: false }, .3);
      kNums.forEach(function(b, i){ countTo(b, +b.getAttribute('data-to'), b.getAttribute('data-suf'), .5 + i * .08, 1.3); });
      tl.fromTo(tRows, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .4, stagger: .1, immediateRender: false }, 1.3);
      tl.fromTo(ins, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .15, immediateRender: false }, 2.1);
      R.at(3.4, function(){ rowLit(OPEN); });
      R.at(4.4, function(){ rowLit(-1); });

      // 2 · Topics: open one topic
      var t = 4.6;
      tl.addLabel('tp', t);
      tl.to(cur, { autoAlpha: 1, duration: .2 }, t);
      X.move(R, cur, navAt('topics'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="topics"]'), t + .6);
      R.at(t + .65, function(){ show('topics'); });
      tl.fromTo(trs, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, stagger: .06, immediateRender: false }, t + .8);
      X.move(R, cur, pos(st, trs[OPEN], P ? .3 : .16, .55), t + 1.3, .6); X.click(R, trs[OPEN], t + 1.95);
      R.at(t + 2, function(){ fill(OPEN); openD(true); });
      tl.to(dLine, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, t + 2.4);
      tl.fromTo(dLis, { autoAlpha: 0, x: 10 }, { autoAlpha: 1, x: 0, duration: .35, stagger: .12, immediateRender: false }, t + 2.6);
      R.at(t + 5.4, function(){ openD(false); });

      // 3 · Knowledge map: nodes, threads, one topic lit
      t += 5.7;
      tl.addLabel('map', t);
      X.move(R, cur, navAt('map'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="map"]'), t + .6);
      R.at(t + .65, function(){ show('map'); });
      tl.fromTo(mT, { autoAlpha: 0, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .45, stagger: .08, ease: 'back.out(1.8)', immediateRender: false }, t + .9);
      tl.fromTo(mPc, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35, stagger: .05, immediateRender: false }, t + 1.3);
      ML.forEach(function(l, i){ X.draw(R, l, t + 1.6 + i * .05, .55); });
      X.move(R, cur, mapAt(FOCUS), t + 2.9, .8);
      R.at(t + 3.7, function(){ focus(FOCUS, -1); });
      var rest = t + 4.6;
      R.at(t + 5.9, function(){ focus(-1, -1); });

      // 4 · Link health: the suggestion card
      t += 6.1;
      tl.addLabel('hl', t);
      X.move(R, cur, navAt('health'), t, .6); X.click(R, q(st, '.tw-a-ni[data-r="health"]'), t + .6);
      R.at(t + .65, function(){ show('health'); });
      tl.to(arc, { strokeDashoffset: RC * (1 - .82), duration: 1.2, ease: 'power2.out' }, t + .9);
      countTo(score, 82, '', t + .9, 1.2);
      tl.fromTo(sug, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, immediateRender: false }, t + 2);
      X.move(R, cur, pos(st, goB, .5, .6), t + 2.9, .7); X.click(R, goB, t + 3.65);
      R.at(t + 3.7, function(){ suggestDone(true); say('Draft written from your Voice Kit and sent to Review'); });
      tl.to(cur, { autoAlpha: 0, duration: .3 }, t + 4.4);
      R.at(t + 5.6, function(){ say(''); });

      X.end(sc, R, t + 6.4, rest, [{ t: 'Overview', at: 'ov' }, { t: 'Topics', at: 'tp' }, { t: 'Map', at: 'map' }, { t: 'Health', at: 'hl' }]);
      // after a hold, the play button resumes: put the scene back where the playhead is (chips need their own onUpdate, so chain it)
      var mark = tl.eventCallback('onUpdate');
      tl.eventCallback('onUpdate', function(){
        if (dirty && !tl.paused()){ dirty = false; setTimeout(function(){ if (sc.onSeek) sc.onSeek(); }, 0); }
        if (mark) mark.apply(this, arguments);
      });
    });
  })();
