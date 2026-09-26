"""Write the Contact page (/contact) section files (html + css), then run ../prep.py on each.

usage: python webflow/build/contact/make.py

Prototype: prototypes/contact.html (parts in prototypes/_parts/contact.*), plan: docs/contact-plan.md.
Page `6ab75d8abdfdf7aa5d9e7c2d` (/contact, static; duplicate of About, About sections removed).
Reused classes (already in Webflow, no CSS here): padding-global, container-large, ab_dbh*, ab_crumb*, ab_rec, ab_rec_dot (+ is-live),
text-style-mono, text-style-eyebrow, heading-style-h2, t-outline, ab_sec-h, ab_sec-h_lede, ab_section-head (+ is-flush), text-size-lede,
theme-light, ab_light-glow (+ is-top), ab_light-bg, ab_frame-label, button (+ is-primary / is-ghost / is-email), ab_button-*,
ab_footer_email-copy, ab_footer_link.
The Webflow Form goes into [data-ct-form] after the insert; its fields are an Embed (form-fields.embed.html).
Stations (the Reason field) are a hidden Designer list [data-ct-stations]: edit the label, message label, placeholder and hint there.
Script-built (ab-contact.js): dish + cliff + cone (in [data-ct-dish]), signal line + packet ([data-ct-scope]), tuner band, chips,
meter bars, transmit sequence, local clock. Everything the Designer can't hold lives in code/src/ab-contact.css.
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


# frequency, color, Reason value, chip label, message label, placeholder, hint (html)
STATIONS = [
    ('101.4', '#FF6A3D', 'New project', 'New project', 'What are you launching?',
     'A few lines about the project, the audience and the date you have in mind.',
     'Scoping a full project? The <a class="ab_ct-link" href="/#launch">mission planner</a> sends back a flight plan and a quote. Or keep transmitting here.'),
    ('103.8', '#4C8DFF', 'Book a call', 'Book a call', 'When works for a call?',
     'A few days and times that work, your time zone, and what you would like to cover.',
     'Thirty minutes, no slides needed. I’ll reply with a time and a link.'),
    ('106.2', '#0AE448', 'Help with an existing site', 'Existing site', 'What needs a hand?',
     'The site URL, what is broken or slow, and what you would like it to do instead.',
     'Webflow fixes, speed passes, new sections, CMS cleanups: all fair game.'),
    ('109.5', '#7C5CFF', 'Collaboration', 'Collaboration', 'What did you have in mind?',
     'Who you are, what you are making and where I would fit in.',
     'Studios and agencies welcome. I bring interactive 3D that’s useful to your clients and their visitors.'),
    ('112.7', '#F9A03C', 'Hiring', 'Hiring', 'Tell me about the role',
     'The team, the role, freelance or full-time, and a link to the listing.',
     'Freelance, contract or full-time. A link to the listing helps.'),
    ('118.0', '#FF98A2', 'Just saying hi', 'Just saying hi', 'Your message',
     'Say hello, share a site you love, or ask about the black hole in the footer.',
     'No agenda needed. Hellos get answered too.'),
]
stations = ''.join(
    '<div class="ab_ct-station" data-f="%s" data-c="%s" data-v="%s"><div class="ab_ct-station_k" data-k="">%s</div>'
    '<div class="ab_ct-station_l" data-l="">%s</div><div class="ab_ct-station_ph" data-ph="">%s</div>'
    '<div class="ab_ct-station_hint" data-hint="">%s</div></div>' % s for s in STATIONS)

STEPS = ['Tune in: pick why you’re writing', 'Transmit a few lines', 'A reply within one business day']

# ---------- 1 · hero: the channel (copy + form console; dish + signal line injected) ----------
hero = (
    '<section class="section_contact-hero" id="channel" data-frame="comms-array" aria-labelledby="heroTitle">' + FL('comms-array') +
    '<div class="ab_ct-dish" data-ct-dish="" aria-hidden="true"></div><div class="ab_ct-scope" data-ct-scope="" aria-hidden="true"></div>'
    '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-contact">'
    '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">contact</span></div>'
    '<div class="ab_rec text-style-mono"><span class="ab_rec_dot is-live" aria-hidden="true"></span>Channel open · replies within one business day</div></div>'
    '<div class="ab_ct-grid">'
    '<div class="ab_ct-copy"><div class="ab_dbh_eyebrow text-style-mono is-contact">Comms · open a channel</div>'
    '<h1 class="ab_dbh_title is-contact" id="heroTitle"><span class="ab_dbh_word">Come</span> <span class="ab_dbh_word t-outline">in</span></h1></div>'
    '<div class="ab_ct-side"><p class="ab_dbh_sum is-contact">Questions, collaborations, a site that needs a hand, or just a hello. Tune the frequency, send the signal, and a real person answers.</p>'
    '<div class="ab_ct-steps">' + ''.join('<div class="ab_ct-step"><div class="ab_ct-step_no">0%d</div><div>%s</div></div>' % (i + 1, t) for i, t in enumerate(STEPS)) + '</div></div>'
    '<div class="ab_ct-form" data-ct-form="" data-selectable="" data-name="Console / transmission">'
    '<div class="ab_ct-form_head"><div class="ab_ct-form_ch"><span class="ab_ct-dot" aria-hidden="true"></span>Transmission · <span class="ab_ct-form_chn" data-ct-ch="">CH-01</span></div>'
    '<div class="ab_ct-meter" data-ct-meter="">No signal</div></div></div>'
    '</div>'
    '<div class="ab_ct-stations" data-ct-stations="">' + stations + '</div>'
    '</div></div></div></section>')

# ---------- 2 · other channels (light, short) ----------
def cell(name, k, h, body):
    return '<div class="ab_ct-cell" data-selectable="" data-name="Card / %s"><div class="ab_ct-cell_k">%s</div><h3 class="ab_ct-cell_h">%s</h3>%s</div>' % (name, k, h, body)


others = (
    '<section class="section_contact-else theme-light" data-frame="other-frequencies" aria-labelledby="else-h">' + FL('other-frequencies') +
    '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>'
    '<div class="padding-global"><div class="container-large"><div class="ab_ct-else_pad">'
    '<div class="ab_sec-h"><div class="ab_section-head is-flush"><div class="text-style-eyebrow">/elsewhere · other frequencies</div>'
    '<h2 class="heading-style-h2" id="else-h" data-split="">Other <span class="t-outline">channels</span></h2></div>'
    '<p class="ab_sec-h_lede text-size-lede">Prefer another frequency? All of these reach the same desk.</p></div>'
    '<div class="ab_ct-cells">' +
    cell('direct-line', 'Direct line', 'Email', '<p class="ab_ct-cell_p">Write straight in. Replies come from me, not a ticket system.</p>'
         '<a class="button is-ghost is-email is-contact" href="#" data-copy-email=""><span class="ab_button-label" data-bind="email">hello@[your-domain]</span><span class="ab_footer_email-copy">Copy</span></a>') +
    cell('voice-channel', 'Voice channel · 103.8', 'Book a call', '<p class="ab_ct-cell_p">Thirty minutes to talk it through. Send a few times that work and I’ll reply with a link.</p>' +
         btn('is-ghost', '#channel', 'Tune to 103.8', '↑', ' data-ct-station="1"')) +
    cell('mission-control', 'Mission control', 'Replies in one business day',
         '<div class="ab_ct-facts text-style-mono"><div class="ab_ct-fact"><span class="ab_ct-fact_dot" aria-hidden="true"></span><span data-bind="availability">Available</span></div>'
         '<div class="ab_ct-fact">Local time <span class="ab_ct-fact_v" data-ct-clock="">--:--</span> <span data-bind="tz-label">ET</span></div></div>') +
    cell('elsewhere', 'Elsewhere', 'Say hi in public', '<div class="ab_ct-social">' + ''.join(
        '<a class="ab_footer_link" href="#" data-social="%s">%s ↗</a>' % (s.lower(), s) for s in ('LinkedIn', 'Behance', 'GitHub', 'Dribbble')) + '</div>') +
    '</div>'
    '<div class="ab_ct-route" data-selectable="" data-name="Banner / scoping"><div class="ab_ct-route_copy"><div class="ab_ct-cell_k">Scoping a whole mission?</div>'
    '<p class="ab_ct-route_p">The planner and the flight plan are built for that: pick the services, set a budget, get a quote.</p></div>'
    '<div class="ab_ct-route_btns">' + btn('is-primary', '/#launch', 'Open the mission planner', '→') + btn('is-ghost', '/process#launch', 'See the flight plan') + '</div></div>'
    '</div></div></div></section>')

css = {
'hero': '''
.section_contact-hero{position:relative;overflow:clip;padding-bottom:clamp(150px,14vw,200px)}
.ab_ct-dish{position:absolute;right:-12vw;top:clamp(80px,7vw,120px);z-index:2;width:min(42vw,700px);aspect-ratio:0.8333;pointer-events:none}
.ab_ct-scope{position:absolute;left:0;right:0;bottom:clamp(28px,3.4vw,52px);z-index:3;height:clamp(70px,8vw,110px);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);pointer-events:none}
.ab_dbh.is-contact{padding-bottom:0}
.ab_ct-grid{position:relative;z-index:4;display:grid;grid-template-columns:minmax(240px,330px) minmax(0,600px);grid-template-areas:"copy copy" "side form";align-items:start;grid-column-gap:clamp(24px,3vw,44px);grid-row-gap:clamp(22px,2.6vw,34px)}
.ab_ct-copy{position:relative;grid-area:copy}
.ab_dbh_eyebrow.text-style-mono.is-contact{margin-top:clamp(26px,3.4vw,48px)}
.ab_dbh_title.is-contact{margin-top:clamp(10px,1.2vw,16px)}
.ab_ct-side{position:relative;grid-area:side}
.ab_dbh_sum.is-contact{max-width:34ch;margin-top:4px;font-size:clamp(17px,1.35vw,19px)}
.ab_ct-steps{margin-top:22px;border-top:1px solid var(--hair)}
.ab_ct-step{display:flex;gap:14px;padding-top:11px;padding-bottom:11px;border-bottom:1px solid var(--hair);font-size:15px;color:var(--soft)}
.ab_ct-step_no{min-width:26px;padding-top:3px;font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:0.1em;color:var(--signal)}
.ab_ct-form{position:relative;grid-area:form;border:1px solid var(--hair);background-color:var(--glass)}
.ab_ct-form_head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--hair);font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_ct-form_ch{display:flex;align-items:center}
.ab_ct-dot{display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:50%;background-color:var(--signal)}
.ab_ct-form_chn{margin-left:6px;color:var(--star);font-weight:500}
.ab_ct-meter{display:flex;align-items:flex-end;gap:3px}
.ab_ct-stations{display:none}
.ab_ct-station{position:relative}
.ab_ct-station_k{position:relative}
.ab_ct-station_l{position:relative}
.ab_ct-station_ph{position:relative}
.ab_ct-station_hint{position:relative}
.ab_ct-link{color:var(--star)}
@media screen and (max-width: 991px){.ab_ct-grid{grid-template-columns:minmax(0,600px);grid-template-areas:"copy" "side" "form"}.ab_dbh_sum.is-contact{max-width:44ch}.ab_ct-steps{display:none}.ab_ct-dish{right:-14vw;width:min(56vw,620px)}}
@media screen and (max-width: 767px){.ab_ct-grid{grid-template-columns:minmax(0,1fr)}.ab_ct-dish{right:-30vw;top:70px;width:78vw;opacity:0.55}}
''',
'others': '''
.section_contact-else{position:relative}
.ab_ct-else_pad{padding-top:clamp(56px,7vw,100px);padding-bottom:clamp(56px,7vw,100px)}
.ab_ct-cells{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;border:1px solid var(--hair);background-color:var(--hair)}
.ab_ct-cell{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:clamp(18px,2vw,26px);background-color:var(--panel)}
.ab_ct-cell_k{font-family:var(--mono);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--dust)}
.ab_ct-cell_h{font-family:var(--display);font-weight:900;font-size:clamp(20px,1.7vw,26px);line-height:1;text-transform:uppercase}
.ab_ct-cell_p{font-size:15px;color:var(--soft)}
.button.is-ghost.is-email.is-contact{max-width:100%;margin-top:auto}
.ab_ct-facts{display:flex;flex-direction:column;gap:8px;font-size:12px;letter-spacing:0.06em;color:var(--soft)}
.ab_ct-fact{display:flex;align-items:center;gap:8px}
.ab_ct-fact_dot{width:8px;height:8px;border-radius:50%;background-color:var(--live)}
.ab_ct-fact_v{color:var(--star);font-weight:500}
.ab_ct-social{display:flex;flex-direction:column;gap:6px;margin-top:auto}
.ab_ct-route{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px 28px;margin-top:clamp(18px,2vw,26px);padding:clamp(16px,2vw,24px);border:1px solid var(--hair2)}
.ab_ct-route_copy{flex:1 1 380px}
.ab_ct-route_p{max-width:52ch;margin-top:6px;color:var(--soft)}
.ab_ct-route_btns{display:flex;flex-wrap:wrap;gap:12px}
@media screen and (max-width: 991px){.ab_ct-cells{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media screen and (max-width: 767px){.ab_ct-cells{grid-template-columns:minmax(0,1fr)}}
''',
}

for n, h in (('hero', hero), ('others', others)):
    w(n + '.html', h)
    w(n + '.css', css[n])
    subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)])
