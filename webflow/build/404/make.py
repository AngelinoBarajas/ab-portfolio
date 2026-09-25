"""Write the 404 (signal-lost) section files (html + css), then run ../prep.py.

usage: python webflow/build/404/make.py

Webflow's 404 utility page: page `6ab6e4a645ff2d1bd12b1c3e`. Prototype: prototypes/404.html (section `signal-lost`).
Reused classes (already in Webflow, no CSS here): page-wrapper, main-wrapper, padding-global, container-large,
ab_dbh_top, ab_crumb*, ab_rec, ab_rec_dot, ab_planet, heading-style-h2, t-outline, text-style-mono, ab_frame-label.
Everything the Designer can't hold (keyframes, pseudos, gradients, parent-hover colors, nth-child borders,
script states) lives in code/src/ab-404.css. The astronaut SVG is injected by ab-404.js into [data-astro-art].
The big "404" is decorative (aria-hidden); the page's h1 is "Lost in space" (prototype had h1 = 404, h2 = lost-h).
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


ROUTES = [
    ('1', '/', 'Return to base', 'Homepage · safest route', True),
    ('2', '/work', 'Mission archive', 'Every project, filterable', False),
    ('3', '/about', 'Meet the pilot', 'Who built this place', False),
    ('4', '/#launch', 'Plan a mission', 'Start a project together', False),
]
route = ''.join(
    '<a class="ab_route%s" href="%s" data-key="%s">'
    '<span class="ab_route_key">%s</span>'
    '<span class="ab_route_text"><span class="ab_route_title">%s</span><span class="ab_route_sub">%s</span></span>'
    '<span class="ab_route_go" aria-hidden="true">→</span></a>' % (' is-primary' if p else '', h, k, k, b, s)
    for k, h, b, s, p in ROUTES)

cells = [('Requested', '/mission-to-nowhere', ' is-warn', 'data-lost-path=""'),
         ('Last contact', '00:00:00', '', 'data-tele-last=""'),
         ('Pings sent', '0', '', 'data-tele-pings=""'),
         ('Coordinates', 'Unknown', '', 'data-tele-xy=""')]
cell = ''.join('<div class="ab_lsig_cell"><div class="ab_lsig_dt">%s</div><div class="ab_lsig_dd%s" %s>%s</div></div>' % (t, c, a, v)
               for t, v, c, a in cells)

html = (
    '<div class="page-wrapper"><main class="main-wrapper">'
    '<section class="section_lost" data-frame="signal-lost" aria-labelledby="lostTitle">'
    '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ signal-lost</span>'
    '<div class="padding-global"><div class="container-large"><div class="ab_lost">'
    # top row
    '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / '
    '<span class="ab_crumb_current" data-lost-path="bare">mission-to-nowhere</span></div>'
    '<div class="ab_rec is-alert text-style-mono"><span class="ab_rec_dot is-alert" aria-hidden="true"></span>Error 404 · signal lost</div></div>'
    # the big 404 with planet zero
    '<div class="ab_lost_404" aria-hidden="true">'
    '<div class="ab_lost_digit">4</div>'
    '<div class="ab_lost_zero"><div class="ab_lost_ring"></div>'
    '<div class="ab_planet is-lost" data-planet="rocky" data-seed="404" data-colors="#2a1a10,#7a4a2a,#c08050,#ffd29a" '
    'data-spin="30" data-glow="rgba(255,106,61,.4)" data-label="Planet 0" data-lost-planet=""></div>'
    '<div class="ab_lost_tag">Drag me</div></div>'
    '<div class="ab_lost_digit is-b">4</div></div>'
    # astronaut
    '<div class="ab_astro" data-astro="" role="img" aria-label="An astronaut drifting in space">'
    '<div class="ab_astro_art" data-astro-art=""></div>'
    '<div class="ab_astro_bubble" data-astro-say="">Houston, I think we took a wrong turn.</div></div>'
    '<div class="ab_astro_hint">Grab the astronaut</div>'
    # copy + routes | telemetry
    '<div class="ab_lost_grid"><div class="ab_lost_copy">'
    '<h1 class="heading-style-h2" id="lostTitle" data-split="">Lost in <span class="t-outline">space</span></h1>'
    '<p class="ab_lost_text">We couldn’t find <span class="ab_lost_path" data-lost-path="">/mission-to-nowhere</span>. '
    'It drifted out of orbit, moved, or never launched. Nothing’s broken on your end. Pick a route home.</p>'
    '<nav class="ab_routes" aria-label="Return routes"><div class="ab_routes_head"><div>Return routes</div><div class="ab_routes_keys">Press 1–4</div></div>'
    + route +
    '</nav></div>'
    '<aside class="ab_lsig" aria-label="Signal telemetry">'
    '<div class="ab_lsig_head"><div>Deep-space scan</div><div class="ab_lsig_status" data-tele-st="">No signal</div></div>'
    '<div class="ab_radar" data-radar="" role="button" tabindex="0" aria-label="Ping the radar">'
    '<div class="ab_radar_sweep"></div><div class="ab_radar_you" aria-hidden="true"></div></div>'
    '<div class="ab_lsig_grid">' + cell + '</div>'
    '<div class="ab_lsig_hint">Click the radar to ping for the missing page</div>'
    '</aside></div>'
    '</div></div></div></section></main></div>'
)
w('lost.html', html)

w('lost.css', '''
.section_lost{position:relative;overflow:hidden}
.ab_lost{position:relative;display:flex;flex-direction:column;min-height:100vh;padding-top:clamp(110px,12vw,150px);padding-bottom:clamp(60px,8vw,110px)}
.ab_rec.is-alert{color:var(--alert)}
.ab_rec_dot.is-alert{background-color:var(--alert)}
.ab_lost_404{position:relative;z-index:3;display:flex;justify-content:center;align-items:center;gap:clamp(6px,1.5vw,24px);margin-top:clamp(24px,4vw,48px);font-family:var(--display);font-weight:900;font-size:clamp(120px,27vw,400px);line-height:0.8;letter-spacing:-0.04em;color:var(--star);user-select:none}
.ab_lost_digit{position:relative;display:block}
.ab_lost_zero{position:relative;display:grid;place-items:center;flex:none;width:0.72em;height:0.72em}
.ab_lost_ring{position:absolute;inset:-9%;border:1.5px dashed rgba(255,106,61,0.45);border-radius:50%;pointer-events:none}
.ab_planet.is-lost{position:relative;left:auto;top:auto;right:auto;width:100%;cursor:grab;touch-action:none}
.ab_lost_tag{position:absolute;left:50%;top:calc(100% + 14px);transform:translateX(-50%);font-family:var(--mono);font-size:11px;font-weight:400;letter-spacing:0.1em;line-height:1.2;text-transform:uppercase;white-space:nowrap;color:var(--dust)}
.ab_astro{position:absolute;left:8%;top:clamp(170px,20vw,300px);z-index:6;width:clamp(78px,8vw,120px);cursor:grab;touch-action:none;user-select:none}
.ab_astro_art{position:relative;width:100%;aspect-ratio:120 / 150}
.ab_astro_bubble{position:absolute;left:78%;bottom:92%;padding:8px 10px;background-color:var(--star);color:var(--on-signal);font-family:var(--mono);font-size:11px;line-height:1.35;width:max-content;max-width:190px;pointer-events:none}
.ab_astro_hint{position:absolute;left:8%;top:calc(clamp(170px,20vw,300px) + clamp(118px,11vw,170px));z-index:5;font-family:var(--mono);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust);pointer-events:none}
.ab_lost_grid{position:relative;z-index:4;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);align-items:start;gap:clamp(28px,5vw,80px);margin-top:clamp(56px,7vw,96px)}
.ab_lost_copy{position:relative;min-width:0}
.ab_lost_text{max-width:46ch;margin-top:20px;font-size:clamp(17px,1.5vw,20px);color:var(--soft)}
.ab_lost_path{padding:2px 6px;border:1px solid rgba(255,106,61,0.25);background-color:rgba(255,106,61,0.08);font-family:var(--mono);font-size:0.85em;color:var(--signal);overflow-wrap:anywhere}
.ab_routes{position:relative;display:block;margin-top:34px;border:1px solid var(--hair);background-color:var(--glass)}
.ab_routes_head{display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_routes_keys{position:relative}
.ab_route{position:relative;display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:14px;padding:16px;border-bottom:1px solid var(--hair);overflow:hidden;color:var(--star);text-decoration:none}
.ab_route_key{position:relative;z-index:1;display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--hair2);font-family:var(--mono);font-size:12px;color:var(--dust)}
.ab_route.is-primary{position:relative}
.ab_route_text{position:relative;z-index:1;min-width:0}
.ab_route_title{display:block;font-family:var(--display);font-weight:800;font-size:clamp(18px,1.6vw,22px);line-height:1.05;text-transform:uppercase}
.ab_route_sub{display:block;margin-top:3px;font-family:var(--mono);font-size:11px;letter-spacing:0.06em;color:var(--dust)}
.ab_route_go{position:relative;z-index:1;font-family:var(--mono);font-size:16px}
.ab_lsig{position:relative;display:block;border:1px solid var(--hair);background-color:var(--glass)}
.ab_lsig_head{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_lsig_status{color:var(--alert);font-weight:500}
.ab_radar{position:relative;width:min(86%,360px);max-height:360px;aspect-ratio:1;margin:18px auto;overflow:hidden;border:1px solid rgba(59,227,138,0.35);border-radius:50%;cursor:crosshair}
.ab_radar_sweep{position:absolute;inset:0;border-radius:50%}
.ab_radar_you{position:absolute;left:50%;top:50%;width:8px;height:8px;margin-left:-4px;margin-top:-4px;background-color:var(--star)}
.ab_lsig_grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border-top:1px solid var(--hair)}
.ab_lsig_cell{min-width:0;padding:12px 16px}
.ab_lsig_dt{font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_lsig_dd{margin-top:4px;font-family:var(--mono);font-size:14px;color:var(--star);overflow-wrap:anywhere}
.ab_lsig_dd.is-warn{color:var(--signal)}
.ab_lsig_hint{padding:10px 16px;border-top:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--dust)}
@media screen and (max-width: 991px){.ab_lost_grid{grid-template-columns:minmax(0,1fr)}.ab_astro{left:auto;right:4%;top:clamp(120px,24vw,200px);width:70px}.ab_astro_hint{display:none}.ab_astro_bubble{left:auto;right:70%}.ab_routes_keys{display:none}}
@media screen and (max-width: 479px){.ab_lost_404{font-size:34vw}.ab_route{grid-template-columns:28px minmax(0,1fr) auto;gap:10px;padding:14px 12px}.ab_lsig_dd{font-size:12.5px}}
''')

subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, 'lost')])
