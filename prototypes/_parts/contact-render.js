  /* =========================================================
     CONTACT · open a channel (static page; copy lives in the Designer)
     The hero is the form: tune a frequency (the reason), write, transmit.
     ========================================================= */
  var PROC = 'process.html';
  // the stations (Reason field): frequency, chip label, form value, message label + placeholder, hint under the tuner
  var STATIONS = [
    { f: 101.4, k: 'New project', v: 'New project', c: '#FF6A3D', l: 'What are you launching?', ph: 'A few lines about the project, the audience and the date you have in mind.',
      hint: 'Scoping a full project? The <a href="' + HOME + '#launch">mission planner</a> sends back a flight plan and a quote. Or keep transmitting here.' },
    { f: 103.8, k: 'Book a call', v: 'Book a call', c: '#4C8DFF', l: 'When works for a call?', ph: 'A few days and times that work, your time zone, and what you would like to cover.',
      hint: 'Thirty minutes, no slides needed. I\'ll reply with a time and a link.' },
    { f: 106.2, k: 'Existing site', v: 'Help with an existing site', c: '#0AE448', l: 'What needs a hand?', ph: 'The site URL, what is broken or slow, and what you would like it to do instead.',
      hint: 'Webflow fixes, speed passes, new sections, CMS cleanups: all fair game.' },
    { f: 109.5, k: 'Collaboration', v: 'Collaboration', c: '#7C5CFF', l: 'What did you have in mind?', ph: 'Who you are, what you are making and where I would fit in.',
      hint: 'Studios and agencies welcome. I bring interactive 3D that\'s useful to your clients and their visitors.' },
    { f: 112.7, k: 'Hiring', v: 'Hiring', c: '#F9A03C', l: 'Tell me about the role', ph: 'The team, the role, freelance or full-time, and a link to the listing.',
      hint: 'Freelance, contract or full-time. A link to the listing helps.' },
    { f: 118.0, k: 'Just saying hi', v: 'Just saying hi', c: '#FF98A2', l: 'Your message', ph: 'Say hello, share a site you love, or ask about the black hole in the footer.',
      hint: 'No agenda needed. Hellos get answered too.' }
  ];
  var F0 = 100, F1 = 120;
  function fPct(f){ return ((f - F0) / (F1 - F0) * 100).toFixed(2); }

  // the dish (pivot 390,330; aims left, toward the form)
  var DISH = '<svg class="ct-dish" viewBox="0 0 600 720" aria-hidden="true">' +
    '<defs><linearGradient id="ctConeG" x1="1" x2="0" y1="0" y2="0"><stop offset="0" style="stop-color:var(--ch)" stop-opacity=".18"/><stop offset=".55" style="stop-color:var(--ch)" stop-opacity=".05"/><stop offset="1" style="stop-color:var(--ch)" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="ctFaceG" cx=".62" cy=".42" r=".75"><stop offset="0" stop-color="#262b48"/><stop offset="1" stop-color="#0b0d18"/></radialGradient>' +
      '<linearGradient id="ctBackG" x1="0" x2="1"><stop offset="0" stop-color="#1a1e34"/><stop offset="1" stop-color="#07080d"/></linearGradient><linearGradient id="ctCliffG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#171b33"/><stop offset=".45" stop-color="#0c0e1c"/><stop offset="1" stop-color="#07080d"/></linearGradient><linearGradient id="ctFadeG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".14" stop-color="#fff"/><stop offset=".34" stop-color="#000"/></linearGradient><mask id="ctCliffM" maskUnits="userSpaceOnUse" x="0" y="680" width="900" height="760"><rect x="0" y="680" width="900" height="760" fill="url(#ctFadeG)"/></mask></defs><g class="ct-cliff" mask="url(#ctCliffM)"><path d="M236 712 L300 708 L420 711 L520 706 L640 710 L900 704 L900 1420 L60 1420 L92 1330 L70 1250 L118 1170 L104 1090 L150 1010 L138 930 L182 860 L170 790 L214 740 Z" fill="url(#ctCliffG)"/><g fill="none" stroke="rgba(255,255,255,.07)"><path d="M214 762 L330 752 L470 762 L620 754"/><path d="M176 880 L300 868 L420 882 L560 872 L720 880"/><path d="M142 1032 L280 1020 L430 1034 L600 1024"/><path d="M110 1190 L260 1178 L400 1192"/></g><path d="M236 712 L214 740 L170 790 L182 860 L138 930 L150 1010 L104 1090 L118 1170 L70 1250 L92 1330 L60 1420" fill="none" stroke="rgba(255,255,255,.14)"/><path d="M236 712 L300 708 L420 711 L520 706 L640 710 L900 704" fill="none" stroke="rgba(242,240,234,.38)" stroke-width="1.5"/><path d="M548 708 L560 694 L580 691 L596 706 Z M612 710 L620 702 L632 703 L638 710 Z" fill="#12152a" stroke="rgba(255,255,255,.18)"/></g>' +
    '<g class="ct-mast" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.5">' +
      '<path d="M362 470 L330 700 M418 470 L450 700 M362 470 H418" /><path d="M356 520 L436 590 M424 520 L344 590 M348 610 L440 680 M432 610 L340 680" stroke="rgba(255,255,255,.12)"/>' +
      '<path d="M372 470 L390 336 L408 470" stroke-width="3" stroke="rgba(255,255,255,.3)"/><rect x="300" y="700" width="180" height="10" fill="#0E1020"/></g><circle class="ct-beacon" cx="468" cy="694" r="3.5" fill="#FF6A3D"/>' +
    '<g id="ctAim" transform="rotate(-14 390 330)">' +
      '<polygon class="ct-cone" points="120,330 -1400,-240 -1400,900" fill="url(#ctConeG)"/>' +
      '<g class="ct-rings" fill="none" stroke-width="3"><path d="M120 262 A 80 80 0 0 0 120 398"/><path d="M120 262 A 80 80 0 0 0 120 398"/><path d="M120 262 A 80 80 0 0 0 120 398"/></g>' +
      '<path d="M300 90 C 440 130 470 530 300 570 Z" fill="url(#ctBackG)" stroke="rgba(255,255,255,.18)"/>' +
      '<rect x="400" y="306" width="46" height="48" fill="#0E1020" stroke="rgba(255,255,255,.22)"/>' +
      '<ellipse cx="300" cy="330" rx="54" ry="240" fill="url(#ctFaceG)" stroke="#F2F0EA" stroke-width="2"/>' +
      '<g fill="none" stroke="rgba(255,255,255,.14)"><ellipse cx="300" cy="330" rx="38" ry="168"/><ellipse cx="300" cy="330" rx="20" ry="88"/><path d="M300 90 V570 M247 330 H353"/></g>' +
      '<g stroke="rgba(242,240,234,.55)" stroke-width="2"><path d="M296 100 L128 326 M296 560 L128 334 M300 330 H132"/></g>' +
      '<rect class="ct-feed" x="104" y="316" width="28" height="28"/><circle class="ct-led" cx="118" cy="330" r="4" fill="#07080D"/>' +
    '</g></svg>';

  var H = '';
  // 1 · the channel: hero + form in one
  H += '<section class="dbh ct-hero" id="channel" data-frame="comms-array">' +
    '<div class="ct-dish-wrap" id="ctDish">' + DISH + '<span class="ct-dish-tag mono">Ground station AB-01 · <b id="ctAz">az 194°</b></span></div>' +
    '<div class="ct-scope" id="ctScopeWrap" aria-hidden="true"><svg id="ctScope" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="ct-grid" d="M0 50 H1000"/><path class="ct-wave" id="ctWave" d="M0 50 H1000"/></svg><span class="ct-packet" id="ctPacket"></span><span class="ct-scope-l mono">Signal · <b id="ctScopeF">101.4 MHz</b></span></div>' +
    '<div class="wrap ct-in-wrap">' +
      '<div class="dbh-top"><div class="crumb mono"><a href="' + HOME + '#top">/home</a> / <b>contact</b></div><span class="pr-rec ct-rec mono"><i aria-hidden="true"></i>Channel open · replies within one business day</span></div>' +
      '<div class="ct-grid">' +
        '<div class="ct-copy">' +
          '<div class="dbh-eyebrow mono">Comms · open a channel</div>' +
          '<h1 class="dbh-title" id="heroTitle"><span class="w">Come</span> <span class="w t-outline">in</span></h1>' +
        '</div>' +
        '<div class="ct-side"><p class="dbh-sum ct-sum">Questions, collaborations, a site that needs a hand, or just a hello. Tune the frequency, send the signal, and a real person answers.</p>' +
          '<ol class="ct-steps"><li><b>01</b>Tune in: pick why you\'re writing</li><li><b>02</b>Transmit a few lines</li><li><b>03</b>A reply within one business day</li></ol></div>' +
        '<form class="ct-form selectable" data-name="Console / transmission" id="ctForm" novalidate>' +
          '<div class="ct-form-h"><span><i class="ct-dot" aria-hidden="true"></i>Transmission · <b id="ctCh">CH-01</b></span>' +
            '<span class="ct-meter" id="ctMeter"><span id="ctMeterT">No signal</span><i></i><i></i><i></i><i></i><i></i></span></div>' +
          '<div class="ct-form-b">' +
            '<div class="ct-tuner"><div class="ct-tuner-h"><span class="ct-fl" id="ctTunL">01 · Tune the frequency</span><span class="ct-read mono"><b id="ctFreq">101.4</b> MHz</span></div>' +
              '<div class="ct-band" id="ctBand" aria-hidden="true"><span class="ct-ticks"></span>' +
                STATIONS.map(function(s){ return '<span class="ct-mark" style="left:' + fPct(s.f) + '%">' + s.f.toFixed(1) + '</span>'; }).join('') +
                '<span class="ct-needle" id="ctNeedle" style="left:' + fPct(STATIONS[0].f) + '%"></span></div>' +
              '<div class="ct-chips" role="group" aria-labelledby="ctTunL">' + STATIONS.map(function(s, i){ return '<button type="button" class="ct-chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '" style="--c:' + s.c + '"><i aria-hidden="true"></i>' + esc(s.k) + '</button>'; }).join('') + '</div>' +
              '<p class="ct-hint" id="ctHint" aria-live="polite">' + STATIONS[0].hint + '</p></div>' +
            '<div class="ct-row2"><label><span class="ct-fl">02 · Name</span><input class="ct-in" name="Name" autocomplete="name" required></label><label><span class="ct-fl">03 · Email</span><input class="ct-in" type="email" name="Email" autocomplete="email" required></label></div>' +
            '<label><span class="ct-fl">04 · <span id="ctMsgL">' + STATIONS[0].l + '</span></span><textarea class="ct-in" name="Message" id="ctMsg" placeholder="' + esc(STATIONS[0].ph) + '"></textarea></label>' +
            '<input type="hidden" name="Reason" id="ctReason" value="' + STATIONS[0].v + '"><div class="ct-err" id="ctErr" role="alert"></div>' +
            '<div class="ct-go"><button class="btn btn-primary magnetic" type="submit"><span class="shine" aria-hidden="true"></span><span id="ctGoL">Transmit</span><span class="arr" aria-hidden="true">→</span></button><span class="ct-go-n mono">Same desk as the planner · one reply, no newsletter</span></div>' +
          '</div>' +
          '<div class="ct-sent" role="status"><div><span class="mono">Signal received · <b id="ctSentF">101.4</b> MHz</span><b>Transmission logged</b><p>Expect a reply within one business day, usually sooner.</p><button type="button" class="btn btn-ghost" id="ctAgain"><span>Open another channel</span></button></div></div>' +
        '</form>' +
      '</div>' +
    '</div></section>';

  // 2 · other channels (light, short)
  H += '<section class="wrap theme-light ct-else" data-frame="other-frequencies"><div class="light-glow top" aria-hidden="true"></div><div class="light-bg" aria-hidden="true"></div>' +
    '<div class="sec-h"><div class="section-head" style="margin:0"><span class="eyebrow">/elsewhere · other frequencies</span><h2 class="h2 split">Other <span class="t-outline">channels</span></h2></div><p class="lede">Prefer another frequency? All of these reach the same desk.</p></div>' +
    '<div class="ct-else-grid">' +
      '<div class="ct-cell selectable" data-name="Card / direct-line"><span class="ct-cell-k mono">Direct line</span><h3>Email</h3><p>Write straight in. Replies come from me, not a ticket system.</p><button type="button" class="email ct-email" id="ctEmail"><span data-bind="email">hello@[your-domain]</span><span class="cp">Copy</span></button></div>' +
      '<div class="ct-cell selectable" data-name="Card / voice-channel"><span class="ct-cell-k mono">Voice channel · 103.8</span><h3>Book a call</h3><p>Thirty minutes to talk it through. Send a few times that work and I\'ll reply with a link.</p><a class="btn btn-ghost magnetic" href="#channel" data-station="1"><span>Tune to 103.8</span><span class="arr" aria-hidden="true">↑</span></a></div>' +
      '<div class="ct-cell selectable" data-name="Card / mission-control"><span class="ct-cell-k mono">Mission control</span><h3>Replies in one business day</h3><ul class="ct-facts mono"><li><span class="dot" aria-hidden="true"></span><span data-bind="availability">Available</span></li><li>Local time <b id="ctClock">--:--</b> <span data-bind="tz-label">ET</span></li></ul></div>' +
      '<div class="ct-cell selectable" data-name="Card / elsewhere"><span class="ct-cell-k mono">Elsewhere</span><h3>Say hi in public</h3><div class="ct-social"><a href="#social" class="social">LinkedIn ↗</a><a href="#social" class="social">Behance ↗</a><a href="#social" class="social">GitHub ↗</a><a href="#social" class="social">Dribbble ↗</a></div></div>' +
    '</div>' +
    '<div class="ct-route selectable" data-name="Banner / scoping"><div><span class="ct-cell-k mono">Scoping a whole mission?</span><p>The planner and the flight plan are built for that: pick the services, set a budget, get a quote.</p></div>' +
      '<div class="ct-route-a"><a class="btn btn-primary magnetic" href="' + HOME + '#launch"><span class="shine" aria-hidden="true"></span><span>Open the mission planner</span><span class="arr" aria-hidden="true">→</span></a><a class="btn btn-ghost magnetic" href="' + PROC + '#launch"><span>See the flight plan</span></a></div></div>' +
    '</section>';

  $('#contact').innerHTML = H;
  document.title = 'Contact · Open a channel · Angelino Barajas';
