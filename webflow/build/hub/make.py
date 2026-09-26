"""Write the Services hub (/services) section files (html + css), then run ../prep.py on each.

usage: python webflow/build/hub/make.py

Prototype: prototypes/services-hub.html (parts in prototypes/_parts/hub.*). Page `6ab74df0ae2408ea9be939c7` (/services, static;
duplicate of Process, Process sections removed). Default content = the first launch (Webflow development, AB-01 / WFD).
Reused classes (already in Webflow, no CSS here): padding-global, container-large, ab_dbh*, ab_crumb*, ab_rec, ab_rec_dot (+ is-live),
ab_planet (+ is-dbh), ab_section-head (+ is-flush), text-style-eyebrow, text-style-mono, text-size-lede, heading-style-h2, t-outline,
button (+ is-primary / is-ghost), ab_button-*, theme-light, ab_light-glow (+ is-top / is-bottom), ab_light-bg, ab_frame-label,
ab_mc, ab_mon, ab_mon_bar, ab_mon_rec, ab_mon_tc, ab_screen, ab_mon_cap, ab_console, ab_panel, ab_panel_h, ab_tele, ab_tele_item,
ab_tele_k, ab_tele_v (+ is-ok).
Collection Lists (built with data_element_builder, not WHTML): chips + manifest rows (Services, sort asc); item templates below.
Script-built (ab-hub.js): manifest cells + column heads, launch keys, peek planets, monitor decor (scan/vig/roll/brackets/osd),
pass brackets/glare/QR, trajectory map + planner panel, flight path/pad/ship/dock + legs, logbook pages + controls, final-call cells.
Everything the Designer can't hold lives in code/src/ab-hub.css.
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


def FL(n):
    return '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ %s</span>' % n


def btn(kind, href, label, arrow=None, attrs=''):
    return ('<a class="button %s" href="%s" data-magnetic=""%s>%s<span class="ab_button-label">%s</span>%s</a>'
            % (kind, href, attrs, '<span class="ab_button-shine"></span>' if 'is-primary' in kind else '', label,
               '<span class="ab_button-arrow" aria-hidden="true">%s</span>' % arrow if arrow else ''))


PLANET = ('data-planet="gas" data-seed="11" data-colors="#0d2a66,#146EF5,#8fb8ff,#e8f0ff,#1d2350" data-ring="#cfe0ff,#146EF5,#0d2a66" '
          'data-tilt="-16" data-spin="50" data-glow="rgba(20,110,245,.4)"')

# ---------- 1 · hero: launch control + monitor + launch pass ----------
hero = (
    '<section class="section_hub-hero" id="hero" data-frame="launch-control" aria-labelledby="heroTitle">' + FL('launch-control') +
    '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-hub">'
    '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">services</span></div>'
    '<div class="ab_rec text-style-mono"><span class="ab_rec_dot is-live" aria-hidden="true"></span>AB spaceport · pads open</div></div>'
    '<div class="ab_planet is-dbh is-hub" ' + PLANET + ' data-drag="" data-label="Go for launch · Website" data-hub-planet=""></div>'
    '<div class="ab_hub-hero_grid"><div class="ab_hub-hero_copy"><div class="ab_dbh_eyebrow text-style-mono">Services · <span data-hub-count="">8</span> launches on the manifest</div>'
    '<h1 class="ab_dbh_title is-hub" id="heroTitle"><span class="ab_dbh_word">Launch</span> <span class="ab_dbh_word t-outline">control</span></h1></div>'
    '<p class="ab_dbh_sum is-hub">Eight destinations, one pilot. Arm the launch your site needs and mission control prints your launch pass.</p></div>'
    '<div class="ab_hub-sym"><div class="ab_hub-sym_label" id="hbSymL"><span class="ab_hub-sym_dot" aria-hidden="true"></span>Run diagnostics · what’s wrong right now?</div>'
    '<div class="ab_hub-sym_chips" role="group" aria-labelledby="hbSymL" data-hub-chips=""><div class="ab_chip is-diag is-reset" data-diag="-1">All clear</div></div></div>'
    '<div class="ab_hub-board" data-hub-board="">'
    '<div class="ab_mc is-hub"><div class="ab_mon is-hub" data-selectable="" data-name="Monitor / launch manifest" data-hub-mon="">'
    '<div class="ab_mon_bar text-style-mono"><span class="ab_mon_rec">Live · <span class="ab_hub-wide">launch </span>manifest</span>'
    '<span class="ab_mon_tc"><span data-hub-clock="">--:--</span> <span data-bind="tz-label">ET</span><span class="ab_hub-wide"> · <span data-hub-count="">8</span> launches</span></span></div>'
    '<div class="ab_screen is-hub" data-hub-screen=""><div class="ab_hub-scr" data-hub-rows=""></div></div>'
    '<div class="ab_mon_cap"><span class="ab_hub-prompt" data-hub-prompt="">&gt; Click a launch to print its pass</span><span class="text-style-mono">AB-OS 2.6</span></div>'
    '<div class="ab_hub-slot" aria-hidden="true"><span class="ab_hub-slot_line"></span><span class="ab_hub-slot_label">Pass printer</span></div></div>'
    '<div class="ab_console is-hub">'
    '<div class="ab_panel"><div class="ab_panel_h text-style-mono"><span>Launch keys</span><span>01–<span data-hub-count2="">08</span></span></div>'
    '<div class="ab_hub-keys" role="group" aria-label="Arm a launch" data-hub-keys=""></div></div>'
    '<div class="ab_panel"><div class="ab_panel_h text-style-mono"><span>Telemetry</span><span data-tele="n">AB-01</span></div><div class="ab_tele">'
    '<div class="ab_tele_item"><span class="ab_tele_k">Destination</span><span class="ab_tele_v" data-tele="d">WFD</span></div>'
    '<div class="ab_tele_item"><span class="ab_tele_k">Orbit</span><span class="ab_tele_v" data-tele="o">GAS</span></div>'
    '<div class="ab_tele_item"><span class="ab_tele_k">Transfers</span><span class="ab_tele_v" data-tele="t">2</span></div>'
    '<div class="ab_tele_item"><span class="ab_tele_k">Status</span><span class="ab_tele_v is-ok" data-tele="s">GO</span></div>'
    '</div></div></div></div></div>'
    # 2 · the launch pass: a translucent data slate that slides out of the monitor's slot
    '<div class="ab_hub-print" data-hub-print="" aria-live="polite"><article class="ab_hub-pass" data-selectable="" data-name="Slate / launch-pass" data-hub-pass="">'
    '<div class="ab_hub-pass_main">'
    '<div class="ab_hub-pass_top"><span class="ab_hub-pass_ok">Cleared for launch</span><span>Launch pass · <span class="ab_hub-pass_b" data-pass="flight">AB-01</span></span></div>'
    '<div class="ab_hub-pass_route"><div class="ab_hub-pass_end"><span class="ab_hub-pass_small">Launch site</span><span class="ab_hub-pass_code">EARTH</span></div>'
    '<div class="ab_hub-pass_arc" aria-hidden="true"><span class="ab_hub-pass_dash"></span><div class="ab_planet is-pass" ' + PLANET.replace('data-seed="11"', 'data-seed="80"') + ' data-pass="planet"></div><span class="ab_hub-pass_dash"></span></div>'
    '<div class="ab_hub-pass_end is-to"><span class="ab_hub-pass_small">Destination</span><span class="ab_hub-pass_code is-to" data-pass="code">WFD</span></div></div>'
    '<a class="ab_hub-pass_link" href="/services/webflow-development" data-pass="link"><h2 class="ab_hub-pass_title" data-pass="title"><span class="ab_hub-pass_t1">Webflow</span> <span class="ab_hub-pass_t2 t-outline">development</span></h2>'
    '<span class="ab_hub-pass_open">Open service →</span></a>'
    '<p class="ab_hub-pass_sum" data-pass="sum">Sites your team can actually edit. Planned, designed in Figma and built in Webflow from the ground up, with clean classes, a CMS that makes sense and motion that survives a copy edit.</p>'
    '<div class="ab_hub-pass_facts">'
    '<div class="ab_hub-pass_fact"><div class="ab_hub-pass_k">Crew seat</div><div class="ab_hub-pass_v" data-pass="best">Marketing sites, portfolios, studios</div></div>'
    '<div class="ab_hub-pass_fact"><div class="ab_hub-pass_k">Orbit class</div><div class="ab_hub-pass_v" data-pass="orbit">Gas giant</div></div>'
    '<div class="ab_hub-pass_fact"><div class="ab_hub-pass_k">Transfers</div><div class="ab_hub-pass_v" data-pass="via">CMS sync · Motion</div></div>'
    '<div class="ab_hub-pass_fact"><div class="ab_hub-pass_k">Payload</div><div class="ab_hub-pass_v">6 deliverables · 4 stages</div></div></div>'
    '<div class="ab_hub-pass_tools" data-pass="tools"><span class="ab_chip is-tool">Webflow</span><span class="ab_chip is-tool">Client-First</span><span class="ab_chip is-tool">GSAP</span><span class="ab_chip is-tool">Figma</span></div>'
    '</div>'
    '<div class="ab_hub-pass_stub"><span class="ab_hub-pass_stub-t">Service briefing</span><div class="ab_hub-pass_qr" data-pass="qr" aria-hidden="true"></div>'
    '<span class="ab_hub-pass_stub-f"><span class="ab_hub-pass_stub-code" data-pass="code2">WFD</span> · <span data-pass="flight2">AB-01</span></span>'
    + btn('is-primary is-stub', '/services/webflow-development', 'Explore service', '→', ' data-pass="stub"') +
    '</div></article></div>'
    '</div></div></div></section>'
)

# ---------- 3 · plot a trajectory (light; the map bleeds to the left edge) ----------
trajectory = (
    '<section class="section_hub-map theme-light" id="trajectory" data-frame="trajectory-planner" aria-labelledby="map-h">' + FL('trajectory-planner') +
    '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-glow is-bottom" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>'
    '<div class="padding-global"><div class="container-large"><div class="ab_hub-map_head">'
    '<div class="ab_section-head is-flush"><div class="text-style-eyebrow">/trajectory · <span data-hub-routes="">10</span> transfer orbits</div>'
    '<h2 class="heading-style-h2" id="map-h" data-split="">Plot a <span class="t-outline">trajectory</span></h2></div>'
    '<div class="ab_hub-map_side"><p class="text-size-lede">Most missions stop at more than one planet. Set your main destination, add up to two stops, and send the whole trajectory to the flight planner.</p>'
    '<div class="ab_hub-steps" data-hub-steps="">'
    '<div class="ab_hub-step" data-step="1"><span class="ab_hub-step_n">1</span>Main destination</div>'
    '<div class="ab_hub-step" data-step="2"><span class="ab_hub-step_n">2</span>Stops · up to 2</div>'
    '<div class="ab_hub-step" data-step="3"><span class="ab_hub-step_n">3</span>Launch</div></div></div>'
    '</div></div></div>'
    '<div class="ab_hub-plan"><div class="ab_hub-map" data-hub-map="" aria-label="Trajectory map"></div>'
    '<aside class="ab_hub-planner" data-selectable="" data-name="Panel / trajectory" data-hub-planner="" aria-live="polite"></aside></div>'
    '</section>'
)

# ---------- 3b · your flight plan (hidden until launch; the Process route re-plotted) ----------
STAGES = [
    ('Pre-flight', 'Discovery call', 'A call to learn your goals, your audience and what a win looks like.', 'Creative brief', 'Share your goals, sites you like and any brand files.', 'the brief'),
    ('Flight plan', 'Alignment', 'Scope, timeline and content plan agreed before any pixels move.', 'Plan + dates', 'Sign off on scope and dates.', 'the plan'),
    ('Payload', 'Brand + assets', 'Logo, color, type, content and data, gathered or made, then turned into tokens.', 'Brand kit + tokens', 'Send what you have, or tell me to make it.', 'the brand kit'),
    ('Test flight', 'Prototype', 'The key pieces, working and clickable, reviewed together before the build.', 'Clickable prototype', 'Two rounds of feedback, live or async.', 'the prototype'),
    ('Assembly', 'Build', 'The real thing: built, wired to your content and tested on real devices.', 'Staging link', 'Load content and test on your own devices.', 'the build'),
    ('Launch', 'Deploy', 'Go live, connect analytics and hand over a guide so your team owns it.', 'Live + handoff', 'Celebrate. Then tell people.', 'the live result'),
]
cards = ''.join(
    '<div class="ab_hub-wp" data-wp="%d" data-stage="%s"><span class="ab_hub-wp_node" aria-hidden="true"></span>'
    '<article class="ab_hub-wp_card"><div class="ab_hub-wp_top"><span><span class="ab_hub-wp_code">T−%d</span> · %s</span><span>%d / 6</span></div>'
    '<h3 class="ab_hub-wp_title">%s</h3><p class="ab_hub-wp_text">%s</p><div class="ab_hub-wp_legs" data-fl-legs=""></div>'
    '<div class="ab_hub-wp_meta"><div><div class="ab_hub-wp_k">You get</div><div class="ab_hub-wp_v">%s</div></div>'
    '<div><div class="ab_hub-wp_k">Your part</div><div class="ab_hub-wp_v">%s</div></div></div>'
    '<a class="ab_hub-wp_flown" href="/work" data-fl-flown="" data-flown-what="%s">See %s →</a></article></div>'
    % (i, s[0], 5 - i, s[0], i + 1, s[1], s[2], s[3], s[4], s[5], s[5])
    for i, s in enumerate(STAGES))
flight = (
    '<section class="section_hub-flight" id="flight" data-frame="flight-plan" aria-labelledby="flight-h" data-hub-flight="">' + FL('flight-plan') +
    '<div class="padding-global"><div class="container-large"><div class="ab_hub-flight_head">'
    '<div class="ab_section-head is-flush"><div class="text-style-eyebrow">/flight plan · <span data-fl="codes">WFD</span></div>'
    '<h2 class="heading-style-h2 is-flight" id="flight-h">Your flight <span class="t-outline">plan</span></h2>'
    '<p class="text-size-lede ab_hub-flight_lede" data-fl="lede">Six stages, re-plotted for Website. Scroll to fly it.</p></div>'
    '<div class="ab_hub-flight_acts">' + btn('is-ghost', '#trajectory', 'Edit trajectory', '↑', ' data-fl-edit=""') +
    btn('is-ghost is-abort', '#trajectory', 'Abort mission', '✕', ' data-fl-abort=""') + '</div>'
    '</div></div></div>'
    '<div class="ab_hub-flight_wrap"><div class="ab_hub-flight_hud" aria-live="polite"><span class="ab_hub-flight_n" data-fl="n">T−6</span><span data-fl="l">On the pad</span></div>'
    '<div class="ab_hub-flight_track" data-fl-track="">' + cards + '</div></div>'
    '</section>'
)

# ---------- 4 · crew logbook ----------
log = (
    '<section class="section_hub-log" id="patches" data-frame="crew-logbook" aria-labelledby="log-h">' + FL('crew-logbook') +
    '<div class="padding-global"><div class="container-large"><div class="ab_hub-log_grid">'
    '<div class="ab_hub-log_head"><div class="text-style-eyebrow">/crew logbook · <span data-log-count="">7</span> missions</div>'
    '<h2 class="heading-style-h2 is-log" id="log-h" data-split="">Mission <span class="t-outline">patches</span></h2>'
    '<p class="text-size-lede">Every mission earns a patch for each service that flew on it. Tap a patch to open the service, or the page to open the mission.</p>'
    '<div class="ab_hub-log_ctl" data-log-ctl=""></div></div>'
    '<div class="ab_hub-log" data-selectable="" data-name="Object / crew-logbook" data-hub-log=""></div>'
    '</div></div></div></section>'
)

# ---------- 5 · final call ----------
call = (
    '<section class="section_hub-call" data-frame="final-call" aria-labelledby="call-h">' + FL('final-call') +
    '<div class="padding-global"><div class="container-large">'
    '<div class="ab_mon is-call"><div class="ab_hub-call_row" data-hub-call="" aria-label="Mission AB-09, custom charter, any transfer, orbit to be decided, on request"></div></div>'
    '<div class="ab_hub-call_body"><h2 class="heading-style-h2" id="call-h" data-split="">Not on the <span class="t-outline">manifest?</span></h2>'
    '<div class="ab_hub-call_copy"><p class="text-size-lede">Custom charters launch too. Plot it on the star chart, or tell me where you’re headed.</p>'
    '<div class="ab_hub-call_btns">' + btn('is-ghost', '/process#chart', 'Plot it with me', '→') + btn('is-primary', '/#launch', 'Book a call', '→') + '</div></div></div>'
    '</div></div></section>'
)

# ---------- Collection List item templates (inserted into the DynamoItems) ----------
chip_item = '<div class="ab_chip is-diag" data-diag=""><p class="ab_chip_text" data-field="solve-1-problem">Every text change needs a developer.</p></div>'
row_item = ('<div class="ab_hub-row" data-hub-row=""><p class="ab_hub-row_name" data-field="name">Webflow development</p>'
            '<p class="ab_hub-row_sum" data-field="summary">Sites your team can actually edit.</p>'
            '<a class="ab_hub-go" href="#" data-hub-go=""><span class="ab_hub-go_t">Explore</span><span class="ab_hub-go_a" aria-hidden="true">→</span></a></div>')

# ---------- CSS: Designer-expressible layout/type/color only ----------
css = {
'hero': '''
.section_hub-hero{position:relative;z-index:4}
.ab_dbh.is-hub{padding-bottom:0}
.ab_planet.is-dbh.is-hub{left:auto;right:clamp(10px,7vw,130px);top:clamp(170px,14vw,230px);width:clamp(130px,16vw,260px);z-index:2}
.ab_hub-hero_grid{position:relative;z-index:4;display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(16px,2vw,24px)}
.ab_hub-hero_copy{position:relative;min-width:0}
.ab_dbh_title.is-hub{font-size:clamp(52px,8.6vw,150px)}
.ab_dbh_sum.is-hub{max-width:44ch;margin-top:0;justify-self:start}
.ab_hub-sym{position:relative;z-index:4;display:flex;flex-wrap:wrap;align-items:baseline;gap:12px 20px;margin-top:clamp(32px,4.5vw,56px)}
.ab_hub-sym_label{display:inline-flex;flex:none;align-items:center;gap:8px;font-family:var(--mono);font-size:11.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal)}
.ab_hub-sym_dot{width:8px;height:8px;border-radius:50%;background-color:#ff4d3a}
.ab_hub-sym_chips{display:flex;flex:1;flex-wrap:wrap;gap:8px;min-width:0}
.ab_chip{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid var(--hair2);font-family:var(--mono);font-size:11px;line-height:1.35;letter-spacing:0.04em;color:var(--soft);cursor:pointer}
.ab_chip:hover{border-color:var(--star);color:var(--star)}
.ab_chip.is-diag{background-color:transparent}
.ab_chip.is-diag.is-reset{border-style:dashed;color:var(--dust);text-transform:uppercase;letter-spacing:0.08em}
.ab_hub-board{position:relative;margin-top:clamp(18px,2vw,26px)}
.ab_mc.is-hub{z-index:2}
.ab_mon.is-hub{z-index:2}
.ab_hub-wide{position:relative}
.ab_screen.is-hub{aspect-ratio:auto;color:var(--star)}
.ab_hub-scr{position:relative;z-index:2;padding:48px clamp(10px,1.4vw,18px) clamp(14px,1.6vw,20px)}
.ab_hub-prompt{font-family:var(--mono);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:var(--soft)}
.ab_hub-slot{position:relative;height:14px;margin:12px 10% 2px;background-color:#030305}
.ab_hub-slot_line{position:absolute;left:10%;right:10%;top:6px;height:2px;background-color:var(--signal);opacity:0}
.ab_hub-slot_label{position:absolute;right:0;top:-16px;font-family:var(--mono);font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_console.is-hub{position:relative}
.ab_hub-keys{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px}
.ab_hub-print{position:relative;z-index:6;margin-top:-4px}
.ab_hub-pass{position:relative;display:grid;grid-template-columns:minmax(0,1fr) clamp(200px,18vw,240px);width:78%;margin-left:auto;margin-right:auto;border:1px solid rgba(255,255,255,0.14);color:var(--star)}
.ab_hub-pass_main{position:relative;padding:clamp(18px,2vw,26px)}
.ab_hub-pass_top{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_ok{display:inline-flex;align-items:center;gap:7px;color:var(--live)}
.ab_hub-pass_b{color:var(--star);font-weight:500}
.ab_hub-pass_route{display:flex;align-items:center;gap:clamp(10px,1.4vw,18px);margin-top:clamp(12px,1.6vw,18px)}
.ab_hub-pass_end{display:flex;flex-direction:column;line-height:1.1}
.ab_hub-pass_small{font-family:var(--mono);font-size:9.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_code{margin-top:4px;font-family:var(--display);font-size:clamp(26px,2.8vw,42px);font-weight:900;letter-spacing:-0.01em}
.ab_hub-pass_arc{display:flex;flex:1;align-items:center;gap:8px;min-width:60px}
.ab_hub-pass_dash{flex:1;height:0;border-top:1.5px dashed rgba(242,240,234,0.35)}
.ab_planet.is-pass{position:relative;left:auto;right:auto;top:auto;flex:none;width:clamp(44px,4.4vw,64px)}
.ab_hub-pass_link{position:relative;display:block;color:inherit;text-decoration:none}
.ab_hub-pass_title{margin-top:clamp(14px,1.8vw,20px);margin-bottom:0;font-family:var(--display);font-size:clamp(26px,2.6vw,40px);font-weight:900;line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase}
.ab_hub-pass_t1{display:block}
.ab_hub-pass_t2{display:block}
.ab_hub-pass_open{display:inline-block;margin-top:6px;font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_sum{max-width:62ch;margin-top:10px;margin-bottom:0;font-size:15px;line-height:1.55;color:var(--soft)}
.ab_hub-pass_facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;margin-top:16px;border:1px solid rgba(255,255,255,0.08);background-color:rgba(255,255,255,0.08)}
.ab_hub-pass_fact{padding:9px 11px;background-color:rgba(7,8,13,0.45)}
.ab_hub-pass_k{font-family:var(--mono);font-size:9.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_v{margin-top:3px;font-size:13px;font-weight:500;line-height:1.3}
.ab_hub-pass_tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.ab_chip.is-tool{padding:4px 8px;border-color:rgba(255,255,255,0.16);font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;cursor:default}
.ab_hub-pass_stub{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:clamp(18px,2vw,26px) clamp(16px,1.6vw,22px);border-left:1px dashed rgba(255,255,255,0.18);background-color:rgba(7,8,13,0.3)}
.ab_hub-pass_stub-t{margin-top:14px;font-family:var(--mono);font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_qr{display:block;width:100%;max-width:150px;aspect-ratio:1;padding:8px;border:1px solid rgba(255,255,255,0.12);background-color:rgba(242,240,234,0.06)}
.ab_hub-pass_stub-f{font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_hub-pass_stub-code{font-weight:600}
.button.is-primary.is-stub{width:100%;margin-top:auto;justify-content:space-between;padding:12px 14px;font-size:12px;letter-spacing:0.04em;white-space:nowrap}
@media screen and (max-width: 767px){.ab_planet.is-dbh.is-hub{right:-24px;top:118px;width:120px}.ab_dbh_title.is-hub{font-size:clamp(52px,17vw,96px)}.ab_hub-sym{flex-direction:column;align-items:stretch}.ab_hub-keys{grid-template-columns:repeat(4,minmax(0,1fr))}.ab_hub-pass{grid-template-columns:minmax(0,1fr);width:94%}.ab_hub-slot{margin-left:3%;margin-right:3%}.ab_planet.is-pass{width:40px}}
''',
'row': '''
.ab_hub-row{position:relative;display:flex;align-items:center;padding:5px 8px;border:1px solid transparent}
.ab_hub-row_name{margin-top:0;margin-bottom:0}
.ab_hub-row_sum{margin-top:0;margin-bottom:0}
.ab_hub-go{position:relative;z-index:2;display:inline-flex;flex:none;align-items:center;gap:6px;margin-left:auto;padding:0 8px;border:1px solid var(--hair2);color:var(--dust);text-decoration:none}
.ab_hub-go:hover{border-color:var(--signal);background-color:var(--signal);color:var(--on-signal)}
.ab_hub-go_t{font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase}
.ab_hub-go_a{position:relative}
''',
'chip': '''
.ab_chip_text{margin-top:0;margin-bottom:0}
''',
'trajectory': '''
.section_hub-map{position:relative;z-index:1;padding-bottom:clamp(64px,8vw,110px)}
.ab_hub-map_head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px 48px}
.ab_hub-map_side{display:flex;flex-direction:column;gap:18px;max-width:52ch}
.ab_hub-steps{display:flex;flex-wrap:wrap;gap:8px}
.ab_hub-step{display:inline-flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border:1px solid var(--hair2);font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_hub-step_n{display:grid;width:20px;height:20px;place-items:center;border:1px solid var(--hair2);font-size:11px;font-weight:600}
.ab_hub-plan{position:relative;display:grid;grid-template-columns:minmax(0,1fr) min(440px,34vw);align-items:start;gap:clamp(20px,3vw,44px);margin-top:clamp(28px,4vw,52px);padding-right:var(--gutter)}
.ab_hub-map{position:relative;height:clamp(420px,40vw,600px)}
.ab_hub-planner{position:relative;border:1px solid var(--hair);background-color:var(--panel)}
@media screen and (max-width: 991px){.ab_hub-plan{grid-template-columns:minmax(0,1fr);padding-left:var(--gutter)}}
@media screen and (max-width: 767px){.ab_hub-map{height:400px}}
''',
'flight': '''
.section_hub-flight{position:relative;overflow:hidden;padding-top:clamp(84px,9vh,110px);padding-bottom:clamp(40px,5vw,70px)}
.ab_hub-flight_head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:14px 40px}
.heading-style-h2.is-flight{font-size:clamp(36px,4.2vw,64px)}
.ab_hub-flight_lede{max-width:52ch;margin-top:4px;font-size:clamp(15px,1.2vw,17px)}
.ab_hub-flight_acts{display:flex;flex:none;flex-wrap:wrap;gap:10px;margin-left:auto}
.button.is-ghost.is-abort{position:relative}
.ab_hub-flight_wrap{position:relative;margin-top:clamp(18px,2.4vw,30px)}
.ab_hub-flight_hud{position:absolute;right:var(--gutter);top:-4px;z-index:6;display:flex;align-items:baseline;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_hub-flight_n{font-family:var(--display);font-size:clamp(34px,3.4vw,52px);font-weight:900;line-height:1;letter-spacing:-0.03em;color:var(--star)}
.ab_hub-flight_track{position:relative;height:clamp(480px,calc(100vh - 230px),700px)}
.ab_hub-wp{position:absolute;left:0;top:150px;z-index:3;width:clamp(290px,24vw,350px)}
.ab_hub-wp_node{position:absolute;left:48px;top:-40px;z-index:4;width:16px;height:16px;margin-top:-8px;margin-left:-8px;border:2px solid var(--hair2);background-color:var(--void)}
.ab_hub-wp_card{position:relative;padding:16px 16px 14px;border:1px solid var(--hair);background-color:rgba(14,16,32,0.82)}
.ab_hub-wp_top{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_hub-wp_code{color:var(--signal);font-weight:500}
.ab_hub-wp_title{margin-top:8px;margin-bottom:0;font-family:var(--display);font-size:clamp(20px,1.8vw,26px);font-weight:800;line-height:1;text-transform:uppercase}
.ab_hub-wp_text{margin-top:6px;margin-bottom:0;font-size:14.5px;color:var(--soft)}
.ab_hub-wp_legs{position:relative}
.ab_hub-wp_meta{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin-top:10px}
.ab_hub-wp_k{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_hub-wp_v{margin-top:2px;font-size:13px;color:var(--star)}
.ab_hub-wp_flown{display:inline-flex;align-items:center;gap:8px;margin-top:10px;font-family:var(--mono);font-size:10.5px;letter-spacing:0.08em;text-transform:uppercase;color:var(--dust);text-decoration:none}
.ab_hub-wp_flown:hover{color:var(--signal)}
''',
'log': '''
.section_hub-log{position:relative;padding-top:clamp(56px,7vw,96px);padding-bottom:clamp(56px,7vw,96px)}
.ab_hub-log_grid{display:grid;grid-template-columns:minmax(0,0.75fr) minmax(0,1.25fr);align-items:center;gap:clamp(24px,4vw,64px)}
.ab_hub-log_head{display:flex;flex-direction:column;gap:18px}
.heading-style-h2.is-log{font-size:clamp(44px,5.6vw,84px)}
.ab_hub-log_ctl{display:flex;align-items:center;gap:14px;margin-top:8px}
.ab_hub-log{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);width:100%;max-width:860px;aspect-ratio:1.46;justify-self:end;border:1px solid rgba(255,255,255,0.14);color:var(--star)}
@media screen and (max-width: 991px){.ab_hub-log_grid{grid-template-columns:minmax(0,1fr)}.ab_hub-log{justify-self:center}}
@media screen and (max-width: 767px){.ab_hub-log{grid-template-columns:minmax(0,1fr);aspect-ratio:auto}}
''',
'call': '''
.section_hub-call{position:relative;padding-top:clamp(44px,5vw,72px);padding-bottom:clamp(56px,6vw,90px)}
.ab_mon.is-call{display:inline-block;max-width:100%;padding:10px}
.ab_hub-call_row{position:relative;display:flex;align-items:center;overflow:hidden;padding:12px 16px;background-color:#05060a;font-family:var(--mono)}
.ab_hub-call_body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,0.8fr);align-items:end;gap:20px clamp(24px,4vw,64px);margin-top:clamp(24px,3vw,40px)}
.ab_hub-call_copy{position:relative}
.ab_hub-call_btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
@media screen and (max-width: 991px){.ab_hub-call_body{grid-template-columns:minmax(0,1fr)}}
@media screen and (max-width: 767px){.ab_hub-call_row{flex-wrap:wrap;row-gap:4px}}
''',
}

for n, h in (('hero', hero), ('trajectory', trajectory), ('flight', flight), ('log', log), ('call', call), ('chip', chip_item), ('row', row_item)):
    w(n + '.html', h)
    w(n + '.css', css[n] if n in css else '')
    subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)])
