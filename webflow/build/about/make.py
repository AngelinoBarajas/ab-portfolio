"""Write the About page section files (html + css), then run ../prep.py on each.

usage: python webflow/build/about/make.py

Only NEW classes carry CSS here (ab_dbh_*, ab_meta_*, ab_bento_*, ab_sec-h ... already exist in Webflow).
Everything the Designer can't hold (pseudos, keyframes, 3D, descendant selectors, script states) lives in
code/src/ab-about.css. Decorative SVGs (badge mark, silhouette, barcode, signature, heart, ship, icons,
hearts) are injected by ab-about.js into empty [data-about-*] slots.
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


def FL(n):
    return '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ %s</span>' % n


def sech(eyebrow, hid, h, o, lede):
    return ('<div class="ab_sec-h"><div class="ab_section-head is-flush"><div class="text-style-eyebrow">%s</div>'
            '<h2 class="heading-style-h2" id="%s" data-split="">%s <span class="t-outline">%s</span></h2></div>'
            '<p class="ab_sec-h_lede text-size-lede">%s</p></div>' % (eyebrow, hid, h, o, lede))


def wrap(inner):
    return '<div class="padding-global"><div class="container-large"><div class="padding-section-medium">%s</div></div></div>' % inner


# ---------- hero: pilot dossier ----------
fields = [('Role', 'Designer + developer'), ('Training', 'Self-taught'), ('Degree', 'Philosophy'), ('Crew', 'Spouse + 1 cadet')]
back = [('Favorite film', 'Interstellar'), ('Re-reading', 'Thus Spoke Zarathustra'), ('Side quest', 'Games'), ('Home base', 'Crew of three')]
meta = [('Callsign', 'AB'), ('Role', 'Designer + developer'), ('Training', 'Self-taught'), ('Degree', 'Philosophy'), ('Crew', 'Married · 1 kid')]
badge = (
    '<div class="ab_badge_wrap" data-badge-wrap="">'
    '<div class="ab_badge_lanyard" data-badge-lanyard="" aria-hidden="true"><div class="ab_badge_clip"></div></div>'
    '<div class="ab_badge_rig" data-badge-rig=""><div class="ab_badge_swing">'
    '<div class="ab_badge" data-badge="" data-selectable="" data-name="Component / crew-badge" tabindex="0" role="button" aria-label="Crew badge. Press to flip it over.">'
    '<div class="ab_badge_inner">'
    '<div class="ab_badge_face is-front">'
    '<div class="ab_badge_slot" aria-hidden="true"></div>'
    '<div class="ab_badge_head"><div class="ab_badge_head-text">Crew ID · <span class="ab_badge_id">AB-001</span></div><div class="ab_badge_mark" data-about-mark="" aria-hidden="true"></div></div>'
    '<div class="ab_badge_photo" data-badge-photo=""><div class="ab_badge_sil" data-about-sil="" aria-hidden="true"></div>'
    '<div class="ab_badge_ph-t">Headshot · 4:5 · incoming</div><div class="ab_badge_ph-s">4 : 5</div>'
    '<div class="ab_badge_cx is-a"></div><div class="ab_badge_cx is-b"></div><div class="ab_badge_cx is-c"></div><div class="ab_badge_cx is-d"></div>'
    '<div class="ab_badge_scan" aria-hidden="true"></div></div>'
    '<div class="ab_badge_name">Angelino<br>Barajas</div>'
    '<div class="ab_badge_fields">' + ''.join('<div class="ab_badge_field"><div class="ab_badge_dt">%s</div><div class="ab_badge_dd">%s</div></div>' % f for f in fields) + '</div>'
    '<div class="ab_badge_foot"><div class="ab_badge_barcode" data-about-barcode="" aria-hidden="true"></div><div class="ab_badge_clear">Clearance<br>Good missions only</div></div>'
    '</div>'
    '<div class="ab_badge_face is-back" aria-hidden="true"><div class="ab_badge_slot"></div><div class="ab_badge_back">'
    '<h3 class="ab_badge_back-title">If found, return to mission control</h3>'
    '<p class="ab_badge_back-text">This pilot runs on curiosity, big questions and one more chapter before bed.</p>'
    '<ul class="ab_badge_list">' + ''.join('<li class="ab_badge_li"><span>%s</span><span class="ab_badge_li-v">%s</span></li>' % b for b in back) +
    '<li class="ab_badge_li"><span>Status</span><span class="ab_badge_li-v" data-bind="availability">Available</span></li></ul>'
    '<div class="ab_sig-slot is-back" data-about-sig=""></div>'
    '</div></div>'
    '</div></div></div></div>'
    '<div class="ab_badge_hint" data-badge-hint="">Click the badge to flip it · drag it to swing</div>'
    '</div>')
w('hero.html', '<section class="section_about-hero" id="hero" data-frame="pilot-dossier" aria-labelledby="heroTitle">' + FL('pilot-dossier') +
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh">'
  '<div class="ab_planet is-dbh is-pilot" data-planet="gas" data-seed="61" data-colors="#2a0d04,#8a2c0c,#ff6a3d,#ffb27a,#ffe6cf,#c2451a" '
  'data-ring="#ffd9b8,#ff6a3d,#b8431c" data-tilt="16" data-open=".22" data-spin="70" data-glow="rgba(255,106,61,.45)" '
  'data-drag="" data-label="Home planet with two moons: my wife and my son" data-pilot-planet=""></div>'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">about</span></div>'
  '<div class="ab_rec text-style-mono"><span class="ab_rec_dot" aria-hidden="true"></span>Crew file · rec 001</div></div>'
  '<div class="ab_about-hero_grid"><div class="ab_about-hero_copy">'
  '<div class="ab_dbh_eyebrow text-style-mono">Pilot dossier · designer + developer</div>'
  '<h1 class="ab_dbh_title" id="heroTitle"><span class="ab_dbh_word">Meet the</span> <span class="ab_dbh_word t-outline">pilot</span></h1>'
  '<p class="ab_dbh_sum">Hi, I’m Angelino. I’m a self-taught designer and developer with a philosophy degree, a soft spot for space and a habit of asking <span class="ab_em">why</span> before <span class="ab_em">how</span>.</p>'
  '<div class="ab_about-hero_cta"><a class="button is-primary" href="/#launch" data-magnetic=""><span class="ab_button-shine"></span><span class="ab_button-label">Plan a mission</span><span class="ab_button-arrow" aria-hidden="true">→</span></a>'
  '<a class="button is-ghost" href="/work" data-magnetic=""><span class="ab_button-label">See the work</span></a></div>'
  '</div>' + badge + '</div>'
  '<div class="ab_meta">' + ''.join('<div class="ab_meta_item"><div class="ab_meta_label">%s</div><div class="ab_meta_value">%s</div></div>' % m for m in meta) +
  '<div class="ab_meta_item"><div class="ab_meta_label">Status</div><div class="ab_meta_value"><span class="ab_meta_live" data-bind="availability">Available</span></div></div>'
  '</div></div></div></div></section>')
w('hero.css', '''
.section_about-hero{position:relative}
.ab_planet.is-dbh.is-pilot{right:clamp(140px,11vw,190px);top:clamp(104px,9vw,130px);width:clamp(64px,5.6vw,92px);z-index:3}
.ab_rec{display:flex;align-items:center;gap:8px;color:var(--dust);letter-spacing:0.1em;text-transform:uppercase}
.ab_rec_dot{width:8px;height:8px;border-radius:50%;background-color:#FF3B3B}
.ab_about-hero_grid{position:relative;z-index:4;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,0.9fr);align-items:center;gap:clamp(32px,5vw,80px)}
.ab_about-hero_copy{position:relative;min-width:0}
.ab_em{color:var(--signal)}
.ab_about-hero_cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.ab_badge_wrap{position:relative;justify-self:center;width:100%;max-width:380px;padding-top:clamp(60px,7vw,110px);padding-bottom:40px}
.ab_badge_lanyard{position:absolute;left:50%;top:-40px;z-index:1;width:16px;margin-left:-8px;height:calc(clamp(60px,7vw,110px) + 58px);pointer-events:none;background-image:linear-gradient(90deg,#c9502c,#FF6A3D 30%,#ff8a5e 50%,#FF6A3D 70%,#c9502c);opacity:0.9}
.ab_badge_clip{position:absolute;left:50%;bottom:-6px;width:34px;height:20px;margin-left:-17px;border:3px solid #9aa0b4;border-top-style:none;border-bottom-left-radius:14px;border-bottom-right-radius:14px}
.ab_badge_rig{position:relative;z-index:2}
.ab_badge_swing{position:relative}
.ab_badge{position:relative;display:block;width:100%;aspect-ratio:5 / 7.6;cursor:grab}
.ab_badge_inner{position:absolute;inset:0}
.ab_badge_face{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--hair2);background-image:linear-gradient(160deg,#171a30,#0c0e1b 60%)}
.ab_badge_face.is-front{z-index:1}
.ab_badge_face.is-back{display:block}
.ab_badge_slot{position:absolute;left:50%;top:14px;width:54px;height:10px;margin-left:-27px;border-radius:6px;background-color:var(--void)}
.ab_badge_head{display:flex;justify-content:space-between;align-items:center;padding:36px 18px 12px;border-bottom:1px dashed var(--hair2);font-family:var(--mono);font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_badge_head-text{position:relative}
.ab_badge_id{color:var(--signal);font-weight:500}
.ab_badge_mark{width:46px;height:23px;color:var(--star)}
.ab_badge_photo{position:relative;display:grid;place-items:center;flex:1;min-height:0;margin:16px 18px 0;overflow:hidden;border:1px dashed var(--hair2)}
.ab_badge_sil{width:46%;opacity:0.55}
.ab_badge_ph-t{position:absolute;left:10px;bottom:8px;font-family:var(--mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_badge_ph-s{position:absolute;right:10px;top:8px;font-family:var(--mono);font-size:10px;color:var(--select)}
.ab_badge_cx{position:absolute;width:14px;height:14px;border:0 solid #FF6A3D}
.ab_badge_cx.is-a{left:6px;top:6px;border-left-width:1.5px;border-top-width:1.5px}
.ab_badge_cx.is-b{right:6px;top:6px;border-right-width:1.5px;border-top-width:1.5px}
.ab_badge_cx.is-c{left:6px;bottom:6px;border-left-width:1.5px;border-bottom-width:1.5px}
.ab_badge_cx.is-d{right:6px;bottom:6px;border-right-width:1.5px;border-bottom-width:1.5px}
.ab_badge_scan{position:absolute;left:0;right:0;top:-40%;height:40%;pointer-events:none;background-image:linear-gradient(180deg,transparent,rgba(255,106,61,0.16),transparent)}
.ab_badge_name{padding:14px 18px 0;font-family:var(--display);font-weight:900;font-stretch:118%;font-size:clamp(24px,2.2vw,30px);line-height:0.95;letter-spacing:-0.01em;text-transform:uppercase;color:var(--star)}
.ab_badge_fields{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;padding:12px 18px 0}
.ab_badge_field{min-width:0}
.ab_badge_dt{font-family:var(--mono);font-size:9.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_badge_dd{margin-top:2px;font-size:13.5px;line-height:1.3;color:var(--star)}
.ab_badge_foot{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;padding:12px 18px 16px}
.ab_badge_barcode{display:flex;align-items:stretch;gap:2px;height:26px}
.ab_badge_clear{font-family:var(--mono);font-size:10px;line-height:1.4;text-align:right;color:var(--dust)}
.ab_badge_back{display:flex;flex-direction:column;gap:16px;height:100%;padding:40px 22px 22px}
.ab_badge_back-title{font-family:var(--display);font-weight:900;font-stretch:118%;font-size:24px;line-height:1;text-transform:uppercase;color:var(--star)}
.ab_badge_back-text{font-size:14.5px;line-height:1.55;color:var(--soft)}
.ab_badge_list{display:grid;gap:8px;margin-top:0;margin-bottom:0;padding-left:0;list-style-type:none;font-family:var(--mono);font-size:12px;color:var(--soft)}
.ab_badge_li{display:flex;justify-content:space-between;gap:12px;padding-bottom:7px;border-bottom:1px dashed var(--hair)}
.ab_badge_li-v{color:var(--star);font-weight:500;text-align:right}
.ab_sig-slot{display:block;width:min(260px,70%)}
.ab_sig-slot.is-back{margin-top:auto}
.ab_badge_hint{position:absolute;left:0;right:0;bottom:0;font-family:var(--mono);font-size:11px;letter-spacing:0.08em;text-align:center;white-space:nowrap;color:var(--dust);pointer-events:none}
@media screen and (max-width: 991px){.ab_about-hero_grid{grid-template-columns:minmax(0,1fr)}.ab_badge_wrap{max-width:340px;margin-top:10px}}
@media screen and (max-width: 767px){.ab_planet.is-dbh.is-pilot{top:96px;right:90px;width:52px}}
''')

# ---------- mission statement ----------
promises = [
    ('I’ll be as excited as you are', 'Your project gets my full curiosity, not a template with your logo on it.'),
    ('You’ll always know where we are', 'Clear updates in plain language. No black boxes (the only black hole is in the footer).'),
    ('I’ll ask why', 'Old philosophy habit. Good questions early make for a better site later.'),
    ('We build it to last', 'A clean structure your team can run and grow long after launch day.'),
]
w('mission.html', '<section class="section_about-ms" id="mission" data-frame="mission-statement" aria-label="Mission statement">' + FL('mission-statement') + wrap(
    '<div class="text-style-eyebrow ab_ms_eyebrow">/mission-statement</div>'
    '<p class="ab_ms_big" data-ms="">I build for the <span class="ab_ms_hl">enthusiastic</span>: people who light up when they talk about their idea, and companies that use what they make to <span class="ab_ms_hl">do some good.</span></p>'
    '<div class="ab_ms_cols"><p class="ab_ms_text">The best projects start with someone who can’t stop talking about what they’re building. My job is to catch that spark and turn it into something people can see, use and remember: planned carefully, designed with intent and built from the ground up.</p>'
    '<p class="ab_ms_text">I’m not here to make the internet louder. I’d rather help a small team with a big heart than polish something that doesn’t matter. If you’re trying to leave things a little better than you found them, I’d love to be on your crew.</p></div>'
    '<div class="ab_ms_sign"><div class="ab_sig-slot" data-about-sig=""></div><div class="ab_ms_sign-text text-style-mono">Pilot · crew of three · accepting good missions</div></div>'
    '<ol class="ab_promise_list" data-promises="">' + ''.join(
        '<li class="ab_promise" data-selectable="" data-name="Card / promise-%02d"><div class="ab_promise_n">Parameter %02d<span class="ab_promise_ck" aria-hidden="true"></span></div>'
        '<h3 class="ab_promise_title">%s</h3><p class="ab_promise_text">%s</p></li>' % (i + 1, i + 1, h, p) for i, (h, p) in enumerate(promises)) +
    '</ol>') + '</section>')
w('mission.css', '''
.section_about-ms{position:relative}
.ab_ms_eyebrow{display:block;margin-bottom:28px}
.ab_ms_big{position:relative;z-index:3;max-width:22ch;font-family:var(--display);font-weight:800;font-stretch:108%;font-size:clamp(30px,4.6vw,68px);line-height:1.04;letter-spacing:-0.02em;text-transform:uppercase;color:var(--star)}
.ab_ms_hl{color:var(--signal)}
.ab_ms_cols{position:relative;z-index:3;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(24px,4vw,64px);max-width:1080px;margin-top:clamp(40px,5vw,64px)}
.ab_ms_text{font-size:clamp(17px,1.4vw,19px);line-height:1.65;color:var(--soft)}
.ab_ms_sign{position:relative;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:22px;margin-top:34px}
.ab_ms_sign-text{color:var(--dust);letter-spacing:0.1em;text-transform:uppercase}
.ab_promise_list{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:clamp(48px,6vw,80px);margin-bottom:0;padding-left:0;list-style-type:none}
.ab_promise{position:relative;display:flex;flex-direction:column;gap:10px;padding:20px 20px 22px;border:1px solid var(--hair);background-color:rgba(14,16,32,0.6)}
.ab_promise:hover{border-color:rgba(255,106,61,0.55);background-color:rgba(22,26,46,0.9)}
.ab_promise_n{display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_promise_ck{display:grid;place-items:center;width:18px;height:18px;border:1.5px solid var(--hair2)}
.ab_promise_title{font-family:var(--display);font-weight:800;font-stretch:112%;font-size:clamp(19px,1.5vw,22px);line-height:1.08;text-transform:uppercase;color:var(--star)}
.ab_promise_text{font-size:15px;line-height:1.5;color:var(--soft)}
@media screen and (max-width: 991px){.ab_promise_list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media screen and (max-width: 767px){.ab_ms_cols{grid-template-columns:minmax(0,1fr)}}
@media screen and (max-width: 479px){.ab_promise_list{grid-template-columns:minmax(0,1fr)}}
''')

# ---------- flight log ----------
LOG = [
    ('Origin', 'Waypoint 01', 'A philosophy degree', 'I studied how to ask better questions, take arguments apart and put them back together. Turns out that’s most of design.', 'book'),
    ('Ignition', 'Waypoint 02', 'Taught myself design', 'No design school. Just curiosity, a lot of late nights and pulling apart work I admired to see how it was made.', 'pen'),
    ('Liftoff', 'Waypoint 03', 'Then taught myself code', 'When a design needed something the tools couldn’t do, I learned to build it. That’s still how I pick up every new skill.', 'code'),
    ('Orbit', 'Waypoint 04', 'Webflow, WebGL + motion', 'Now I plan, design in Figma and build in Webflow from the ground up: globes, maps, CMS systems and interactions people remember.', 'orbit'),
    ('Next', 'Waypoint 05', 'Your mission', 'The next waypoint on this log is yours. Tell me what you’re building and we’ll plot the course together.', 'flag'),
]
items = ''
for i, (tag, k, h, p, ic) in enumerate(LOG):
    nxt = i == len(LOG) - 1
    items += ('<div class="ab_tl_item%s" role="listitem"><div class="ab_tl_wp" aria-hidden="true"></div>'
              '<div class="ab_tl_card%s%s" data-selectable="" data-name="Card / %s"><div class="ab_tl_icon" data-tl-icon="%s" aria-hidden="true"></div>'
              '<div class="ab_tl_tag">%s<span class="ab_tl_k">%s</span></div><h3 class="ab_tl_title">%s</h3><p class="ab_tl_text">%s</p>%s</div></div>'
              % (' is-next' if nxt else '', ' is-right' if i % 2 else '', ' is-next' if nxt else '', tag.lower(), ic, tag, k, h, p,
                 '<a class="ab_tl_link" href="/#launch">Plot the course →</a>' if nxt else ''))
w('log.html', '<section class="section_about-log" id="log" data-frame="flight-log" aria-labelledby="log-h">' + FL('flight-log') + wrap(
    sech('/flight-log · 5 waypoints', 'log-h', 'Flight', 'log', 'How a philosophy student ended up building globes in Webflow.') +
    '<div class="ab_tl" data-tl="" role="list"><div class="ab_tl_line" aria-hidden="true"></div><div class="ab_tl_fill" aria-hidden="true"></div>'
    '<div class="ab_tl_ship" data-tl-ship="" aria-hidden="true"></div>' + items + '</div>') + '</section>')
w('log.css', '''
.section_about-log{position:relative}
.ab_tl{position:relative;display:grid;gap:clamp(28px,4vw,48px);margin-top:clamp(40px,6vw,72px)}
.ab_tl_line{position:absolute;left:50%;top:6px;bottom:6px;width:2px;margin-left:-1px;background-color:var(--hair)}
.ab_tl_fill{position:absolute;left:50%;top:6px;bottom:6px;z-index:1;width:2px;margin-left:-1px;background-image:linear-gradient(180deg,#FF6A3D,#ffb08f)}
.ab_tl_ship{position:absolute;left:50%;top:0;z-index:3;width:26px;height:26px;margin-top:-13px;margin-left:-13px;pointer-events:none}
.ab_tl_item{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 60px minmax(0,1fr);align-items:center}
.ab_tl_item.is-next{z-index:1}
.ab_tl_wp{position:relative;z-index:2;grid-column-start:2;grid-column-end:3;grid-row-start:1;grid-row-end:2;justify-self:center;width:18px;height:18px;border:2px solid var(--hair2);background-color:var(--void)}
.ab_tl_card{position:relative;grid-column-start:1;grid-column-end:2;grid-row-start:1;grid-row-end:2;justify-self:end;width:100%;max-width:480px;padding:22px 24px;border:1px solid var(--hair);background-color:rgba(14,16,32,0.72)}
.ab_tl_card:hover{border-color:rgba(255,106,61,0.5)}
.ab_tl_card.is-right{grid-column-start:3;grid-column-end:4;justify-self:start}
.ab_tl_card.is-next{border-style:dashed;border-color:rgba(255,106,61,0.5)}
.ab_tl_icon{position:absolute;right:16px;bottom:16px;width:38px;height:38px;opacity:0.5;color:var(--star)}
.ab_tl_tag{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal)}
.ab_tl_k{color:var(--dust)}
.ab_tl_title{margin-top:10px;font-family:var(--display);font-weight:800;font-stretch:112%;font-size:clamp(22px,2vw,30px);line-height:1.02;text-transform:uppercase;color:var(--star)}
.ab_tl_text{max-width:40ch;margin-top:10px;font-size:16px;line-height:1.55;color:var(--soft)}
.ab_tl_link{display:inline-flex;gap:8px;margin-top:14px;font-family:var(--mono);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;color:var(--signal)}
.ab_tl_link:hover{text-decoration:underline}
@media screen and (max-width: 767px){.ab_tl_line{left:9px}.ab_tl_fill{left:9px}.ab_tl_ship{left:9px}.ab_tl_item{grid-template-columns:18px minmax(0,1fr);gap:18px;align-items:start}.ab_tl_wp{grid-column-start:1;grid-column-end:2;margin-top:26px}.ab_tl_card{grid-column-start:2;grid-column-end:3;justify-self:stretch;max-width:none}.ab_tl_card.is-right{grid-column-start:2;grid-column-end:3;justify-self:stretch}}
''')

# ---------- off duty (light bento) ----------
FACTS = [
    ('8 min 20 s', 'is how long sunlight takes to reach Earth. You are always seeing the Sun a little in the past.'),
    ('Venus', 'spins so slowly that a day there is longer than its year.'),
    ('Neutron stars', 'can spin hundreds of times a second, packing more than the Sun’s mass into a city-sized ball.'),
    ('Voyager 1', 'launched in 1977 and is still sending data home from interstellar space.'),
    ('Saturn', 'is less dense than water. Find a big enough bathtub and it would float.'),
    ('Olympus Mons', 'on Mars is roughly two and a half times the height of Everest.'),
    ('Light', 'from some of the galaxies Webb sees left them more than 13 billion years ago.'),
]
QS = ['Why does this page exist?', 'Who is it really for?', 'What should they feel when they leave?', 'What happens if we take it away?',
      'Is it true, or just loud?', 'What would make them come back?', 'Does it need to move, or just look cool moving?']
NOTES = {
    'Sci-fi': 'The genre that got me looking up.', 'Philosophy': 'Where the “why” habit started.', 'Astrophysics': 'Dense. Worth it.',
    'Design': 'Taking apart what I admire.', 'Cosmos': 'Re-read more than once.', 'Ethics': 'Why “do good” is in the mission statement.',
    'Typography': 'Yes, I read books about letters.', 'Black holes': 'See also: the footer.', 'Stoics': 'For launch weeks.',
    'Space opera': 'Big ships, bigger ideas.', 'Physics': 'Gravity is doing a lot of work on this site.', 'Game design': 'Onboarding lessons, disguised as fun.',
    'Logic': 'Old coursework. Still useful.', 'Exoplanets': 'Where every planet on this site comes from.', 'Interfaces': 'Craft notes.',
    'Time': 'Mandatory reading after Interstellar.', 'Epic fantasy': 'The occasional detour.', 'Mind': 'How people think, so sites can make sense.',
    'Rockets': 'Launch reference.', 'Cosmology': 'Where it all started, literally.', 'Kid lit (shared)': 'Read aloud. Many, many times.',
    'Zarathustra': 'Thus Spoke Zarathustra. On the nightstand right now, for another re-read.',
}
BOOKS = [
    ['Sci-fi', '#1d2350', 190], ['Philosophy', '#FF6A3D', 160, '#07080D'], ['Astrophysics', '#0B0C14', 205], ['Design', '#e0a45e', 150, '#07080D'], ['Cosmos', '#3f4fa8', 180],
    ['Ethics', '#6b6f80', 140], ['Sci-fi', '#7c5cff', 196], ['Typography', '#F2F0EA', 168, '#07080D'], ['Black holes', '#07080D', 210], ['Stoics', '#a44a1f', 150],
    ['Space opera', '#2f6b5a', 186], ['Zarathustra', '#c2451a', 194], ['Physics', '#146EF5', 176], ['Game design', '#4cf2a0', 158, '#07080D'], ['Sci-fi', '#1b2a4a', 200], ['Logic', '#c2412d', 146],
    ['Exoplanets', '#3b1f12', 192], ['Interfaces', '#9cc7ff', 170, '#07080D'], ['Time', '#161a2e', 184], ['Epic fantasy', '#6b3fa0', 206], ['Mind', '#e9d9ff', 152, '#07080D'],
    ['Rockets', '#ff8a4c', 174, '#07080D'], ['Sci-fi', '#0f1b2d', 198], ['Kid lit (shared)', '#ffd166', 138, '#07080D'], ['Cosmology', '#2b1f5c', 188],
]
books = ''.join(
    '<div class="ab_book%s" role="button" tabindex="0" data-book="" data-g="%s" data-c="%s" data-h="%d"%s data-note="%s"><span class="ab_book_label">%s</span></div>'
    % (' is-lean' if b[0] == 'Zarathustra' else '', b[0], b[1], b[2], (' data-fg="%s"' % b[3]) if len(b) > 3 else '', NOTES[b[0]], b[0]) for b in BOOKS)


def copy(label, title, text, extra=''):
    return ('<div class="ab_bento-card_copy"><div class="ab_bento-card_label text-style-mono">%s</div><h3 class="ab_bento-card_title">%s</h3>%s%s</div>'
            % (label, title, text, extra))


cards = (
    '<div class="ab_bento_cell is-xl"><article class="ab_bento-card is-dark" data-td="" data-selectable="" data-name="Card / interstellar">'
    '<div class="ab_bento-card_viz is-td"><div class="ab_planet is-td" data-planet="blackhole" data-label="Black hole" aria-hidden="true"></div>'
    '<div class="ab_td_clocks"><div class="ab_td_clock"><div class="ab_td_label">Near the black hole</div><div class="ab_td_value" data-td-here="">00:00:00</div><div class="ab_td_rate"><div class="ab_td_rate-fill is-full"></div></div></div>'
    '<div class="ab_td_clock"><div class="ab_td_label">Back on Earth</div><div class="ab_td_value is-earth" data-td-earth="">0y 000d 00h</div><div class="ab_td_rate"><div class="ab_td_rate-fill" data-td-rate=""></div></div></div></div></div>'
    + copy('Favorite film', 'Interstellar', '<p class="ab_bento-card_text">Love, time and gravity in one story. I’ve seen it more times than I’ll admit, and I still hold my breath during the docking scene.</p>')
    + '<div class="ab_off_hint">Hover to fly close · 1 hour there = 7 years here</div></article></div>'

    '<div class="ab_bento_cell is-tall"><article class="ab_bento-card is-dark" data-selectable="" data-name="Card / space-science">'
    '<div class="ab_bento-card_viz is-sp"><div class="ab_planet is-sp" data-planet="terra" data-seed="12" data-colors="#0f2a4a,#1f6f8b,#3f8a5a,#b89c6a,#e9f3ff" data-spin="40" data-glow="rgba(124,196,255,.35)" data-spin-drag="" aria-hidden="true"></div>'
    '<div class="ab_off_ptag text-style-mono">Drag to spin</div></div>'
    + copy('Space + science', 'Always looking up', '<p class="ab_bento-card_text ab_off_fact" data-fact="" aria-live="polite">Loading a fact…</p>')
    + '<div class="ab_off_more" data-fact-more="" role="button" tabindex="0">Another fact <span aria-hidden="true">→</span></div>'
    '<div class="ab_cms-source" data-about-facts="" aria-hidden="true">' + ''.join('<p data-k="%s">%s</p>' % f for f in FACTS) + '</div></article></div>'

    '<div class="ab_bento_cell"><article class="ab_bento-card" data-selectable="" data-name="Card / crew">'
    '<div class="ab_bento-card_viz is-crew" aria-hidden="true"><div class="ab_crew_sys"><div class="ab_crew_ring is-a"></div><div class="ab_crew_ring is-b"></div><div class="ab_crew_core"></div>'
    '<div class="ab_crew_orbit is-a"><div class="ab_crew_body is-me"></div></div><div class="ab_crew_orbit is-b"><div class="ab_crew_body is-spouse"></div><div class="ab_crew_moon"><div class="ab_crew_body is-kid"></div></div></div></div>'
    '<div class="ab_crew_legend"><span class="ab_crew_key"><span class="ab_crew_dot is-home"></span>Home</span><span class="ab_crew_key"><span class="ab_crew_dot is-spouse"></span>Spouse</span>'
    '<span class="ab_crew_key"><span class="ab_crew_dot is-kid"></span>Kid</span><span class="ab_crew_key"><span class="ab_crew_dot is-me"></span>Me</span></div></div>'
    + copy('Home base', 'Crew of three', '<p class="ab_bento-card_text">Married, with one kid. My favorite crew, and the reason I care about building things that last.</p>') + '</article></div>'

    '<div class="ab_bento_cell"><article class="ab_bento-card" data-selectable="" data-name="Card / philosophy">'
    '<div class="ab_bento-card_viz is-ph" data-ph="" role="button" tabindex="0" aria-label="Show another question"><div class="ab_ph_mark" aria-hidden="true">?</div>'
    '<div class="ab_ph_no text-style-mono" data-ph-no="">Question 01</div><div class="ab_ph_q" data-ph-q="">Why does this page exist?</div></div>'
    + copy('Philosophy degree', 'Why before how', '<p class="ab_bento-card_text">Every project still starts with a few good questions.</p>')
    + '<div class="ab_off_hint">Tap for another question</div>'
    '<div class="ab_cms-source" data-about-questions="" aria-hidden="true">' + ''.join('<p>%s</p>' % q for q in QS) + '</div></article></div>'

    '<div class="ab_bento_cell"><article class="ab_bento-card" data-gm-card="" data-selectable="" data-name="Card / player-one">'
    '<div class="ab_bento-card_viz is-gm" data-gm="" role="button" tabindex="0" aria-label="Earn XP">'
    '<div class="ab_gm_row"><span>Player one</span><span class="ab_gm_hearts" data-gm-hearts="" aria-hidden="true"></span></div>'
    '<div class="ab_gm_row"><span class="ab_gm_lvl" data-gm-lvl="">LV 07</span><span data-gm-xpn="">XP 000</span></div>'
    '<div class="ab_gm_xp"><div class="ab_gm_xp-fill" data-gm-xp=""></div></div><div class="ab_gm_press">Press start</div></div>'
    + copy('Gamer', 'Side quests', '<p class="ab_bento-card_text">Good games are a masterclass in onboarding, feedback and making people want to keep going.</p>')
    + '<div class="ab_off_hint">Click to earn XP · know any cheat codes?</div></article></div>'

    '<div class="ab_bento_cell is-full"><article class="ab_bento-card is-shelf" data-selectable="" data-name="Card / bookshelf">'
    + copy('Book nerd', 'Always mid-book', '<p class="ab_bento-card_text">There is always one on the nightstand. Mostly sci-fi, philosophy and science, plus the bedtime stories that are now half the shelf.</p>',
           '<div class="ab_off_hint is-shelf">Knock a book off the shelf</div>')
    + '<div class="ab_shelf" data-shelf="">' + books + '<div class="ab_shelf_floor" aria-hidden="true"></div><div class="ab_shelf_note" data-shelf-note="" role="status"></div></div></article></div>'
)
w('offduty.html', '<section class="section_about-off theme-light" id="between-launches" data-frame="between-launches" aria-labelledby="off-h">' + FL('between-launches') +
  '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-glow is-bottom" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>' + wrap(
      sech('/between-launches · crew quarters', 'off-h', 'Between', 'launches', 'The things that keep me curious when the laptop’s closed. Every card does something, so go ahead and poke them.') +
      '<div class="ab_bento_grid is-about">' + cards + '</div>') + '</section>')
w('offduty.css', '''
.section_about-off{position:relative}
.ab_bento_grid.is-about{grid-auto-rows:minmax(210px,auto)}
.ab_bento_cell.is-full{grid-column:1 / -1}
.ab_bento-card.is-dark{color:var(--star)}
.ab_bento-card.is-shelf{display:grid;grid-template-columns:minmax(0,0.8fr) minmax(0,2fr);align-items:stretch;gap:24px}
.ab_off_hint{margin-top:auto;font-family:var(--mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--dust)}
.ab_off_hint.is-shelf{margin-top:14px}
.ab_bento-card_viz.is-td{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;min-height:300px}
.ab_planet.is-td{position:relative;justify-self:center;width:78%}
.ab_td_clocks{position:relative;z-index:2;display:grid;gap:14px;padding:18px 20px 18px 0}
.ab_td_clock{padding:12px 14px;border:1px solid var(--hair);background-color:rgba(7,8,13,0.6)}
.ab_td_label{font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_td_value{margin-top:4px;font-family:var(--mono);font-weight:500;font-size:clamp(18px,2vw,26px);letter-spacing:0.02em;color:var(--star)}
.ab_td_value.is-earth{color:var(--signal)}
.ab_td_rate{height:3px;margin-top:6px;overflow:hidden;background-color:var(--hair)}
.ab_td_rate-fill{width:8%;height:100%;background-color:var(--signal)}
.ab_td_rate-fill.is-full{width:100%}
.ab_bento-card_viz.is-sp{display:grid;place-items:center;min-height:240px;border-style:none}
.ab_planet.is-sp{position:relative;width:56%;cursor:grab}
.ab_off_ptag{position:absolute;left:14px;bottom:12px;font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_off_fact{min-height:4.6em}
.ab_off_more{display:inline-flex;align-items:center;align-self:flex-start;gap:8px;padding:9px 12px;border:1px solid var(--hair2);cursor:pointer;font-family:var(--mono);font-size:11.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--star)}
.ab_off_more:hover{background-color:var(--signal);border-color:var(--signal);color:var(--on-signal)}
.ab_bento-card_viz.is-crew{display:grid;place-items:center;min-height:230px;padding-bottom:24px}
.ab_crew_sys{position:relative;width:170px;height:170px}
.ab_crew_ring{position:absolute;left:50%;top:50%;border:1px dashed var(--hair2);border-radius:50%}
.ab_crew_ring.is-a{width:92px;height:92px;margin-left:-46px;margin-top:-46px}
.ab_crew_ring.is-b{width:160px;height:160px;margin-left:-80px;margin-top:-80px}
.ab_crew_core{position:absolute;left:50%;top:50%;width:26px;height:26px;margin-left:-13px;margin-top:-13px;border-radius:50%;background-image:radial-gradient(circle at 35% 35%,#ffd29a,#ff6a3d 55%,#a3301a)}
.ab_crew_orbit{position:absolute;left:50%;top:50%;width:0;height:0}
.ab_crew_body{position:absolute;border-radius:50%}
.ab_crew_body.is-me{left:38px;top:-8px;width:16px;height:16px;background-image:radial-gradient(circle at 35% 35%,#bfe3ff,#3f6fb5 60%,#1b2a4a)}
.ab_crew_body.is-spouse{left:70px;top:-10px;width:20px;height:20px;background-image:radial-gradient(circle at 35% 35%,#e9d9ff,#7c5cff 60%,#2b1f5c)}
.ab_crew_moon{position:absolute;left:80px;top:0;width:0;height:0}
.ab_crew_body.is-kid{left:13px;top:-4px;width:8px;height:8px;background-color:#4cf2a0}
.ab_crew_legend{position:absolute;left:10px;bottom:8px;display:flex;flex-wrap:wrap;gap:4px 12px;font-family:var(--mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--dust)}
.ab_crew_key{display:inline-flex;align-items:center;gap:5px}
.ab_crew_dot{width:7px;height:7px;border-radius:50%}
.ab_crew_dot.is-home{background-color:#ff6a3d}
.ab_crew_dot.is-spouse{background-color:#7c5cff}
.ab_crew_dot.is-kid{background-color:#4cf2a0}
.ab_crew_dot.is-me{background-color:#3f6fb5}
.ab_bento-card_viz.is-ph{display:flex;flex-direction:column;justify-content:center;gap:8px;padding:18px 20px;cursor:pointer}
.ab_ph_mark{position:absolute;right:10px;top:-18px;font-family:var(--display);font-weight:900;font-size:150px;line-height:1;color:transparent;pointer-events:none}
.ab_ph_no{position:relative;font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal)}
.ab_ph_q{position:relative;z-index:1;max-width:14ch;font-family:var(--display);font-weight:800;font-stretch:108%;font-size:clamp(20px,1.8vw,26px);line-height:1.08;text-transform:uppercase;color:var(--star)}
.ab_bento-card_viz.is-gm{display:flex;flex-direction:column;justify-content:center;gap:12px;padding:18px 20px;cursor:pointer;background-color:#0b0c14}
.ab_gm_row{position:relative;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--mono);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#F2F0EA}
.ab_gm_hearts{display:flex;gap:6px}
.ab_gm_lvl{font-family:var(--display);font-weight:900;font-stretch:125%;font-size:34px;letter-spacing:0;color:#4cf2a0}
.ab_gm_xp{position:relative;display:flex;height:14px;padding:2px;border:2px solid #F2F0EA}
.ab_gm_xp-fill{width:0%;height:100%;background-image:repeating-linear-gradient(90deg,#4cf2a0 0 8px,#2fcf82 8px 10px)}
.ab_gm_press{position:relative;font-family:var(--mono);font-size:11px;letter-spacing:0.14em;color:#ffd166}
.ab_shelf{position:relative;display:flex;justify-content:center;align-items:flex-end;gap:3px;min-height:230px;padding:18px 18px 0;overflow:hidden;border:1px solid var(--hair);background-image:linear-gradient(180deg,#f7f5ef,#ece8de)}
.ab_book{position:relative;display:flex;justify-content:center;align-items:center;flex:none;width:28px;height:170px;margin-bottom:12px;cursor:pointer;background-color:#1d2350;color:#F2F0EA}
.ab_book.is-lean{margin-left:12px}
.ab_book_label{overflow:hidden;max-height:88%;font-family:var(--mono);font-size:9.5px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap}
.ab_shelf_floor{position:absolute;left:0;right:0;bottom:0;height:12px;background-color:#0B0C14}
.ab_shelf_note{position:absolute;right:16px;top:14px;z-index:4;max-width:260px;padding:10px 12px;background-color:#0B0C14;color:#F2F0EA;font-family:var(--mono);font-size:11.5px;line-height:1.45;opacity:0;pointer-events:none}
@media screen and (max-width: 991px){.ab_bento_cell.is-full{grid-column:1 / -1}}
@media screen and (max-width: 767px){.ab_bento-card_viz.is-td{grid-template-columns:minmax(0,1fr);min-height:0}.ab_planet.is-td{width:60%;margin-top:18px}.ab_td_clocks{padding:0 16px 16px}.ab_bento-card.is-shelf{grid-template-columns:minmax(0,1fr)}}
@media screen and (max-width: 479px){.ab_book{width:24px}}
''')

for n in ('hero', 'mission', 'log', 'offduty'):
    subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)])
