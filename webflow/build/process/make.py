"""Write the Process page section files (html + css), then run ../prep.py on each.

usage: python webflow/build/process/make.py

Prototype: prototypes/process.html (source parts in prototypes/_parts/). Page `6ab701e2df00b2e38832af5b` (/process).
Reused classes (already in Webflow, no CSS here): padding-global, container-large, padding-section-medium, ab_dbh*, ab_crumb*,
ab_rec, ab_rec_dot, ab_sec-h, ab_section-head (+ is-flush), ab_sec-h_lede, text-style-eyebrow, text-size-lede, heading-style-h2,
t-outline, button (+ is-primary / is-ghost), ab_button-*, theme-light, ab_light-glow (+ is-top / is-bottom), ab_light-bg,
ab_planet (+ is-dbh), ab_faq_list, hide, ab_frame-label.
Script-built (ab-process.js): star-chart planets + orbits, route path/ship/launchpad, crew ticks, gauge SVG, option buttons.
Everything the Designer can't hold lives in code/src/ab-process.css.
Default content = the "Website" destination; the script re-plots from the hidden Services list ([data-dest-source]).
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


def wrap(inner, pad='padding-section-medium'):
    return '<div class="padding-global"><div class="container-large"><div class="%s">%s</div></div></div>' % (pad, inner)


def btn(kind, href, label, arrow=None, attrs=''):
    return ('<a class="button %s" href="%s" data-magnetic=""%s>%s<span class="ab_button-label">%s</span>%s</a>'
            % (kind, href, attrs, '<span class="ab_button-shine"></span>' if kind == 'is-primary' else '', label,
               '<span class="ab_button-arrow" aria-hidden="true">%s</span>' % arrow if arrow else ''))


# ---------- 1 · hero: the countdown ----------
hero = (
    '<section class="section_process-hero" id="hero" data-frame="launch-sequence" aria-labelledby="heroTitle">' + FL('launch-sequence') +
    '<div class="padding-global"><div class="container-large"><div class="ab_dbh">'
    '<div class="ab_planet is-dbh is-process" data-planet="gas" data-seed="11" data-colors="#0d2a66,#146EF5,#8fb8ff,#e8f0ff,#1d2350" '
    'data-ring="#cfe0ff,#146EF5,#0d2a66" data-tilt="-16" data-spin="50" data-glow="rgba(20,110,245,.4)" data-drag="" '
    'data-label="Destination · Website" data-process-planet=""></div>'
    '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">process</span></div>'
    '<div class="ab_rec text-style-mono"><span class="ab_rec_dot is-live" aria-hidden="true"></span>Mission control · live</div></div>'
    '<div class="ab_process-hero_grid"><div class="ab_process-hero_copy">'
    '<div class="ab_dbh_eyebrow text-style-mono">Flight plan · every mission</div>'
    '<h1 class="ab_dbh_title" id="heroTitle"><span class="ab_dbh_word">The flight</span> <span class="ab_dbh_word t-outline">plan</span></h1>'
    '<p class="ab_dbh_sum">Six stages, every time. Pick where you’re headed and the route re-plots: the stages stay the same, the work inside them changes.</p>'
    '<div class="ab_process-hero_cta">' + btn('is-primary', '#chart', 'Pick a destination', '↓') + btn('is-ghost', '#launch', 'Plan a mission') + '</div></div>'
    '<div class="ab_count" data-selectable="" data-name="Countdown / T-minus" aria-label="Countdown to launch">'
    '<div class="ab_count_number" data-count="">T<span class="ab_count_dash">−</span><span class="ab_count_n" data-count-n="">6</span></div>'
    '<div class="ab_count_meta"><div>Countdown to launch</div><div class="ab_count_dest"><span class="ab_count_dot" aria-hidden="true"></span>Destination · <span class="ab_count_short" data-dest-short="">Website</span></div></div>'
    '</div></div></div></div></div></section>'
)

# ---------- 2 · star chart ----------
chart = (
    '<section class="section_process-chart" id="chart" data-frame="star-chart" aria-labelledby="chart-h">' + FL('star-chart') +
    wrap(sech('/destinations · 8 services', 'chart-h', 'Pick a', 'destination', 'Every service is a planet. Pick one and the rest of this page re-plots the route for it.') +
         '<div class="ab_chart_grid"><div class="ab_chart" data-chart="" role="radiogroup" aria-label="Destinations">'
         '<div class="ab_chart_sun" aria-hidden="true"><div class="ab_chart_sun-label">You · the brief</div></div></div>'
         '<aside class="ab_chart_panel" data-selectable="" data-name="Panel / destination" aria-live="polite">'
         '<div class="ab_chart_panel-head"><div>Destination locked</div><div class="ab_chart_panel-short" data-dest-short="">Website</div></div>'
         '<div class="ab_chart_panel-body"><h3 class="ab_chart_title" data-dest-title=""><span class="ab_chart_title-a">Webflow</span> <span class="ab_chart_title-b t-outline">development</span></h3>'
         '<p class="ab_chart_sum" data-dest-sum="">Sites your team can actually edit. Planned, designed in Figma and built in Webflow from the ground up.</p>'
         '<div class="ab_chart_plan" data-dest-plan="">' + ''.join('<div class="ab_chart_plan-item"><div class="ab_chart_plan-no">Stage 0%d</div><div class="ab_chart_plan-name">%s</div></div>' % (i + 1, n)
                                                               for i, n in enumerate(['Discovery', 'Plan + design', 'Build', 'Launch + handoff'])) + '</div>'
         '<div class="ab_chart_actions">' + btn('is-ghost', '/services/webflow-development', 'Service page', '→', ' data-dest-link=""') + btn('is-primary', '#route', 'Plot the course', '↓') + '</div>'
         '</div></aside></div>') +
    '</section>'
)

# ---------- 3 · the route ----------
STAGES = [
    ('Pre-flight', 'Discovery call', 'A call to learn your goals, your audience and what a win looks like.', 'Creative brief', 'Share your goals, sites you like and any brand files.', 'the brief', 'Goals, audience and what the site has to do.'),
    ('Flight plan', 'Alignment', 'Scope, timeline and content plan agreed before any pixels move.', 'Plan + dates', 'Sign off on scope and dates.', 'the plan', 'Sitemap, content plan and wireframes, signed off before design.'),
    ('Payload', 'Brand + assets', 'Logo, color, type, content and data, gathered or made, then turned into tokens.', 'Brand kit + tokens', 'Send what you have, or tell me to make it.', 'the brand kit', 'Brand, copy and photos gathered, then turned into design tokens.'),
    ('Test flight', 'Prototype', 'The key pieces, working and clickable, reviewed together before the build.', 'Clickable prototype', 'Two rounds of feedback, live or async.', 'the prototype', 'Key pages designed in Figma and clicked through as a prototype.'),
    ('Assembly', 'Build', 'The real thing: built, wired to your content and tested on real devices.', 'Staging link', 'Load content and test on your own devices.', 'the build', 'Built in Webflow from the ground up: components, CMS, motion.'),
    ('Launch', 'Deploy', 'Go live, connect analytics and hand over a guide so your team owns it.', 'Live + handoff', 'Celebrate. Then tell people.', 'the live result', 'QA, a Lighthouse pass, launch day and a walkthrough for your team.'),
]
cards = ''.join(
    '<div class="ab_route_wp" data-wp="%d"><div class="ab_route_node" aria-hidden="true"></div>'
    '<article class="ab_route_card" data-selectable="" data-name="Waypoint / %s">'
    '<div class="ab_route_card-top"><div><span class="ab_route_card-code">T−%d</span> · %s</div><div>%d / 6</div></div>'
    '<h3 class="ab_route_card-title">%s</h3><p class="ab_route_card-text">%s</p>'
    '<div class="ab_route_leg"><div class="ab_route_leg-label" data-leg-label="">For Website</div><div class="ab_route_leg-text" data-leg="">%s</div></div>'
    '<div class="ab_route_meta"><div><div class="ab_route_meta-label">You get</div><div class="ab_route_meta-value">%s</div></div>'
    '<div><div class="ab_route_meta-label">Your part</div><div class="ab_route_meta-value">%s</div></div></div>'
    '<a class="ab_route_flown" href="/work/daniel-aguirre-law" data-flown="" data-flown-what="%s">See %s · Daniel Aguirre Law →</a>'
    '</article></div>' % (i, s[0].lower(), 5 - i, s[0], i + 1, s[1], s[2], s[6], s[3], s[4], s[5], s[5])
    for i, s in enumerate(STAGES))
route = (
    '<section class="section_process-route" id="route" data-frame="trajectory" aria-labelledby="route-h">' + FL('trajectory') +
    '<div class="padding-global"><div class="container-large"><div class="ab_route_head">' +
    sech('/trajectory · 6 waypoints', 'route-h', 'The', 'route', 'Scroll to fly it. Each waypoint shows what happens, what you get and what I need from you.') +
    '</div></div></div>'
    '<div class="ab_route_wrap"><div class="ab_route_hud" aria-live="polite"><div class="ab_route_hud-n" data-hud-n="">T−6</div><div class="ab_route_hud-l" data-hud-l="">On the pad</div></div>'
    '<div class="ab_route_track" data-route-track="">' + cards + '</div></div></section>'
)

# ---------- 4 · crew roles (light) ----------
ME = ['Plan the route and keep the dates', 'Design and build every piece', 'Write the code and host it on GitHub', 'Tell you early when something changes', 'Hand over the keys, the guide and the files']
YOU = ['Share the brief and the sites you like', 'Pick one person to make the call', 'Send content, or tell me to make it', 'Give feedback at each checkpoint', 'Tell people when it launches']


def crewcol(title, who, items, name):
    return ('<div class="ab_crew_col" data-selectable="" data-name="Card / %s"><div class="ab_crew_head"><h3 class="ab_crew_title">%s</h3><div class="ab_crew_who">%s</div></div>'
            '<ul class="ab_crew_list">%s</ul></div>' % (name, title, who, ''.join('<li class="ab_crew_item"><span class="ab_crew_tick" aria-hidden="true"></span><span>%s</span></li>' % t for t in items)))


crew = (
    '<section class="section_process-crew theme-light" data-frame="crew-roles" aria-labelledby="crew-h">' + FL('crew-roles') +
    '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-glow is-bottom" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>' +
    wrap(sech('/crew · who does what', 'crew-h', 'Crew', 'roles', 'Two seats in the cockpit. Here is who flies what, so nothing falls between them.') +
         '<div class="ab_crew_grid">' + crewcol('Mission control', 'Me', ME, 'mission-control') +
         '<div class="ab_crew_link" aria-hidden="true"><div class="ab_crew_link-label">Comms open</div></div>' + crewcol('Crew', 'You', YOU, 'crew') + '</div>'
         '<div class="ab_crew_comms"><div class="ab_crew_comms-label">Comms</div><div>Updates at every waypoint</div><div>A shared board you can check any time</div><div>A real person on the other end</div></div>') +
    '</section>'
)

# ---------- 5 · what moves the timeline ----------
FACTORS = [('Scope', 'How big is it?', ['A few pages', 'A full site', 'A platform']),
           ('Content', 'Is the copy ready?', ['Ready to go', 'Partly there', 'From zero']),
           ('Brand', 'Is the brand set?', ['Ready', 'Needs a refresh', 'From scratch']),
           ('3D + motion', 'Anything custom?', ['None', 'A few moments', 'A signature piece']),
           ('Data', 'Where does content live?', ['Static', 'In a CMS', 'Synced sources']),
           ('Sign-off', 'Who makes the call?', ['One person', 'Two or three', 'A committee'])]
BUCKETS = [('Short hop', 'Fewer moving parts and fewer stops. The route goes almost straight from brief to launch.'),
           ('Standard orbit', 'A full route with every waypoint. Most missions fly this one.'),
           ('Deep-space mission', 'More stops, more people and more custom pieces. Worth it, and planned for from day one.')]
eta = (
    '<section class="section_process-eta" id="eta" data-frame="timeline" aria-labelledby="eta-h">' + FL('timeline') +
    wrap(sech('/eta · no guesses', 'eta-h', 'What moves the', 'timeline', 'Every mission gets real dates after the discovery call. These are the things that stretch or shorten the route.') +
         '<div class="ab_eta_grid"><div class="ab_eta_factors">' + ''.join(
             '<div class="ab_eta_factor"><div class="ab_eta_factor-name">%s<div class="ab_eta_factor-q">%s</div></div>'
             '<div class="ab_eta_seg" data-factor="%d" role="group" aria-label="%s">%s</div></div>' % (k, q, i, k, ''.join('<span class="ab_eta_opt">%s</span>' % o for o in opts))
             for i, (k, q, opts) in enumerate(FACTORS)) + '</div>'
         '<div class="ab_eta_gauge" data-selectable="" data-name="Gauge / route length" aria-live="polite"><div class="ab_eta_dial" data-gauge="" aria-hidden="true"></div>'
         '<div class="ab_eta_out"><div class="ab_eta_title" data-eta-title="">Standard orbit</div><p class="ab_eta_text" data-eta-text="">A full route with every waypoint. Most missions fly this one.</p></div>'
         '<div class="ab_eta_adds" data-eta-adds=""></div><div class="ab_eta_note">Not a quote · real dates come with the flight plan</div>'
         '<div class="hide" data-eta-buckets="">' + ''.join('<div class="ab_eta_bucket"><div class="ab_eta_bucket-t">%s</div><p class="ab_eta_bucket-p">%s</p></div>' % b for b in BUCKETS) + '</div>'
         '</div></div>') +
    '</section>'
)

# ---------- 6 · FAQ (FAQ item component instances go into .ab_faq_list after the insert) ----------
faq = (
    '<section class="section_process-faq" data-frame="faq" aria-labelledby="faq-h">' + FL('faq') +
    wrap(sech('/faq · before we fly', 'faq-h', 'Flight', 'checks', 'The questions most crews ask before launch.') + '<div class="ab_faq_list" data-process-faq=""></div>') +
    '</section>'
)

# ---------- 7 · launch (the Webflow Form goes into [data-launch-form] after the insert) ----------
launch = (
    '<section class="section_process-launch" id="launch" data-frame="launch" aria-labelledby="launch-h">' + FL('launch') +
    wrap('<div class="ab_launch_grid"><div class="ab_launch_copy"><div class="text-style-eyebrow">/launch · plan this mission</div>'
         '<h2 class="heading-style-h2" id="launch-h" data-split="">Ready for <span class="t-outline">launch?</span></h2>'
         '<p class="ab_launch_lede text-size-lede">Tell me where you’re headed. You’ll hear back with a time for the discovery call, and the countdown starts there.</p>'
         '<div class="ab_launch_steps">' + ''.join('<div class="ab_launch_step"><div class="ab_launch_step-no">0%d</div><div>%s</div></div>' % (i + 1, t) for i, t in enumerate(
             ['Pick a destination (it follows the star chart)', 'Tell me what you’re launching', 'We book the discovery call'])) + '</div></div>'
         '<div class="ab_launch_form" data-launch-form="" data-selectable="" data-name="Form / mission request">'
         '<div class="ab_launch_form-head"><div>Mission request</div><div>Destination · <span class="ab_launch_form-dest" data-dest-short="">Website</span></div></div></div></div>') +
    '</section>'
)

# ---------- CSS: Designer-expressible layout/type/color only ----------
css = {
'hero': '''
.section_process-hero{position:relative}
.ab_planet.is-dbh.is-process{left:54%;right:auto;top:clamp(170px,14vw,220px);width:clamp(80px,8vw,130px);z-index:5}
.ab_rec_dot.is-live{background-color:var(--live)}
.ab_process-hero_grid{position:relative;z-index:4;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:end;gap:clamp(24px,4vw,64px)}
.ab_process-hero_copy{position:relative;min-width:0}
.ab_process-hero_cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.ab_count{position:relative;justify-self:end;text-align:right}
.ab_count_number{font-family:var(--display);font-weight:900;font-size:clamp(130px,19vw,310px);line-height:0.78;letter-spacing:-0.05em;white-space:nowrap;color:var(--star)}
.ab_count_dash{color:var(--signal)}
.ab_count_n{position:relative}
.ab_count_meta{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:10px 18px;margin-top:18px;font-family:var(--mono);font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_count_dest{display:flex;align-items:center;gap:6px}
.ab_count_dot{width:8px;height:8px;border-radius:50%;background-color:var(--select)}
.ab_count_short{color:var(--star);font-weight:500}
@media screen and (max-width: 991px){.ab_process-hero_grid{grid-template-columns:minmax(0,1fr)}.ab_count{justify-self:start;text-align:left}.ab_count_meta{justify-content:flex-start}}
@media screen and (max-width: 767px){.ab_planet.is-dbh.is-process{left:auto;right:-28px;top:92px;width:104px}}
''',
'chart': '''
.section_process-chart{position:relative}
.ab_chart_grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,0.75fr);align-items:center;gap:clamp(24px,4vw,64px)}
.ab_chart{position:relative;width:100%;max-width:760px;aspect-ratio:1;margin-left:auto;margin-right:auto;border-radius:50%}
.ab_chart_sun{position:absolute;left:43.5%;top:43.5%;z-index:2;width:13%;aspect-ratio:1;border-radius:50%;background-color:var(--signal)}
.ab_chart_sun-label{position:absolute;left:50%;top:calc(100% + 10px);transform:translateX(-50%);font-family:var(--mono);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap;color:var(--dust)}
.ab_chart_panel{position:relative;display:block;border:1px solid var(--hair);background-color:var(--glass)}
.ab_chart_panel-head{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_chart_panel-short{display:flex;align-items:center;gap:8px;color:var(--star);font-weight:500}
.ab_chart_panel-body{padding:clamp(18px,2.4vw,28px)}
.ab_chart_title{font-family:var(--display);font-weight:900;font-size:clamp(26px,2.5vw,40px);line-height:0.92;letter-spacing:-0.02em;text-transform:uppercase;overflow-wrap:anywhere}
.ab_chart_title-a{display:block}
.ab_chart_title-b{display:block}
.ab_chart_sum{margin-top:16px;font-size:16px;color:var(--soft)}
.ab_chart_plan{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1px;margin-top:18px;border:1px solid var(--hair);background-color:var(--hair)}
.ab_chart_plan-item{padding:10px 12px;background-color:var(--deep)}
.ab_chart_plan-no{font-family:var(--mono);font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--dust)}
.ab_chart_plan-name{margin-top:2px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:var(--star)}
.ab_chart_actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
@media screen and (max-width: 991px){.ab_chart_grid{grid-template-columns:minmax(0,1fr)}.ab_chart{max-width:560px}}
@media screen and (max-width: 479px){.ab_chart_plan{grid-template-columns:minmax(0,1fr)}}
''',
'route': '''
.section_process-route{position:relative;overflow:hidden;padding-top:clamp(64px,9vw,120px);padding-bottom:clamp(64px,9vw,120px)}
.ab_route_head{position:relative}
.ab_route_wrap{position:relative;margin-top:clamp(28px,4vw,48px)}
.ab_route_hud{position:absolute;right:var(--gutter);top:-6px;z-index:6;display:flex;align-items:baseline;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_route_hud-n{font-family:var(--display);font-weight:900;font-size:clamp(34px,3.4vw,52px);line-height:1;letter-spacing:-0.03em;color:var(--star)}
.ab_route_hud-l{position:relative}
.ab_route_track{position:relative;height:clamp(600px,72vh,720px)}
.ab_route_wp{position:absolute;left:0;top:200px;z-index:3;width:clamp(290px,24vw,350px)}
.ab_route_node{position:absolute;left:48px;top:-100px;z-index:4;width:16px;height:16px;margin-top:-8px;margin-left:-8px;border:2px solid var(--hair2);background-color:var(--void)}
.ab_route_card{position:relative;padding:18px 18px 16px;border:1px solid var(--hair);background-color:var(--glass)}
.ab_route_card-top{display:flex;justify-content:space-between;gap:10px;font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_route_card-code{color:var(--signal);font-weight:500}
.ab_route_card-title{margin-top:10px;font-family:var(--display);font-weight:800;font-size:clamp(22px,2vw,28px);line-height:1;text-transform:uppercase}
.ab_route_card-text{margin-top:8px;font-size:15px;color:var(--soft)}
.ab_route_leg{margin-top:12px;padding:10px 12px;border-left:2px solid var(--select);font-size:14.5px;color:var(--star)}
.ab_route_leg-label{margin-bottom:3px;font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_route_leg-text{position:relative}
.ab_route_meta{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;margin-top:12px}
.ab_route_meta-label{font-family:var(--mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_route_meta-value{margin-top:2px;font-size:13.5px;color:var(--star)}
.ab_route_flown{display:inline-block;margin-top:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;color:var(--dust)}
.ab_route_flown:hover{color:var(--signal)}
@media screen and (max-width: 767px){.ab_route_track{height:auto;padding-left:36px;padding-right:var(--gutter)}.ab_route_wp{position:relative;top:auto;width:auto;margin-bottom:22px}.ab_route_node{left:-34px;top:22px;margin-top:0;margin-left:0}.ab_route_hud{position:relative;right:auto;top:auto;margin-left:var(--gutter);margin-bottom:16px}}
@media screen and (max-width: 479px){.ab_route_meta{grid-template-columns:minmax(0,1fr)}}
''',
'crew': '''
.section_process-crew{position:relative}
.ab_crew_grid{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:stretch;gap:clamp(18px,3vw,40px)}
.ab_crew_col{padding:clamp(18px,2.4vw,30px);border:1px solid var(--hair);background-color:var(--panel)}
.ab_crew_head{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.ab_crew_title{font-family:var(--display);font-weight:900;font-size:clamp(24px,2.4vw,34px);line-height:1;text-transform:uppercase}
.ab_crew_who{font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_crew_list{margin-top:18px;margin-bottom:0;padding-left:0;list-style-type:none}
.ab_crew_item{display:grid;grid-template-columns:22px minmax(0,1fr);gap:10px;padding-top:11px;padding-bottom:11px;border-top:1px solid var(--hair);font-size:16px}
.ab_crew_tick{width:18px;height:18px;margin-top:3px;border:1.5px solid var(--hair2)}
.ab_crew_link{position:relative;width:2px}
.ab_crew_link-label{position:absolute;left:50%;top:50%;padding:6px 10px;border:1px solid var(--hair);background-color:var(--void);font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;white-space:nowrap;color:var(--dust)}
.ab_crew_comms{display:flex;flex-wrap:wrap;align-items:center;gap:10px 28px;margin-top:clamp(18px,2.4vw,28px);padding:14px 18px;border:1px solid var(--hair);font-family:var(--mono);font-size:12px;letter-spacing:0.06em;color:var(--soft)}
.ab_crew_comms-label{font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--star)}
@media screen and (max-width: 767px){.ab_crew_grid{grid-template-columns:minmax(0,1fr)}.ab_crew_link{width:auto;height:2px;margin-top:18px;margin-bottom:18px}}
''',
'eta': '''
.section_process-eta{position:relative}
.ab_eta_grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);align-items:start;gap:clamp(24px,4vw,64px)}
.ab_eta_factors{display:flex;flex-direction:column;border-top:1px solid var(--hair)}
.ab_eta_factor{display:grid;grid-template-columns:minmax(0,0.8fr) minmax(0,1.6fr);align-items:center;gap:12px 20px;padding-top:14px;padding-bottom:14px;border-bottom:1px solid var(--hair)}
.ab_eta_factor-name{font-family:var(--mono);font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--dust)}
.ab_eta_factor-q{margin-top:2px;font-family:var(--body);font-size:16px;font-weight:500;letter-spacing:0;text-transform:none;color:var(--star)}
.ab_eta_seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--hair2)}
.ab_eta_opt{display:block;padding:10px 8px;border-right:1px solid var(--hair2);font-family:var(--mono);font-size:11px;line-height:1.25;letter-spacing:0.04em;text-align:center;color:var(--dust);cursor:pointer}
.ab_eta_gauge{position:sticky;top:110px;padding:clamp(18px,2.4vw,28px);border:1px solid var(--hair);background-color:var(--glass)}
.ab_eta_dial{position:relative;width:100%;aspect-ratio:300 / 170}
.ab_eta_out{margin-top:10px;text-align:center}
.ab_eta_title{font-family:var(--display);font-weight:900;font-size:clamp(26px,2.6vw,38px);line-height:1;text-transform:uppercase}
.ab_eta_text{max-width:38ch;margin-top:10px;margin-left:auto;margin-right:auto;font-size:15px;color:var(--soft)}
.ab_eta_adds{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;min-height:26px;margin-top:14px}
.ab_eta_note{margin-top:14px;font-family:var(--mono);font-size:11px;letter-spacing:0.06em;text-align:center;color:var(--dust)}
.ab_eta_bucket{position:relative}
.ab_eta_bucket-t{position:relative}
.ab_eta_bucket-p{position:relative}
@media screen and (max-width: 991px){.ab_eta_grid{grid-template-columns:minmax(0,1fr)}.ab_eta_gauge{position:relative;top:auto}}
@media screen and (max-width: 479px){.ab_eta_factor{grid-template-columns:minmax(0,1fr)}}
''',
'faq': '''
.section_process-faq{position:relative}
''',
'launch': '''
.section_process-launch{position:relative}
.ab_launch_grid{display:grid;grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);align-items:start;gap:clamp(24px,4vw,64px)}
.ab_launch_copy{position:relative;min-width:0}
.ab_launch_lede{margin-top:18px}
.ab_launch_steps{margin-top:22px;border-top:1px solid var(--hair)}
.ab_launch_step{display:flex;gap:14px;padding-top:12px;padding-bottom:12px;border-bottom:1px solid var(--hair);font-size:15.5px;color:var(--soft)}
.ab_launch_step-no{min-width:28px;padding-top:3px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:0.1em;color:var(--signal)}
.ab_launch_form{position:relative;overflow:hidden;border:1px solid var(--hair);background-color:var(--glass)}
.ab_launch_form-head{display:flex;justify-content:space-between;gap:12px;padding:10px 16px;border-bottom:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_launch_form-dest{color:var(--star);font-weight:500}
@media screen and (max-width: 991px){.ab_launch_grid{grid-template-columns:minmax(0,1fr)}}
''',
}

for n, h in (('hero', hero), ('chart', chart), ('route', route), ('crew', crew), ('eta', eta), ('faq', faq), ('launch', launch)):
    w(n + '.html', h)
    w(n + '.css', css[n])
    subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)])
