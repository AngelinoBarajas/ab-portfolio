"""Write the Services template section files (html + css), then run ../prep.py on each.

usage: python webflow/build/services/make.py
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


def FL(n):
    return '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ %s</span>' % n


def sech(eyebrow, hid, h, o, lede=None):
    return ('<div class="ab_sec-h"><div class="ab_section-head is-flush"><div class="text-style-eyebrow">%s</div>'
            '<h2 class="heading-style-h2" id="%s" data-split="">%s <span class="t-outline">%s</span></h2></div>%s</div>'
            % (eyebrow, hid, h, o, ('<p class="ab_sec-h_lede text-size-lede">%s</p>' % lede) if lede else ''))


def wrap(inner):
    return '<div class="padding-global"><div class="container-large"><div class="padding-section-medium">%s</div></div></div>' % inner


# ---------- hero ----------
w('hero.html', '<section class="section_dbh" id="hero" data-frame="service" aria-labelledby="heroTitle">' + FL('service') +
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh">'
  '<div class="ab_planet is-dbh" data-drag="" data-label="Service planet" data-service-planet="" data-spin="60"></div>'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a><span class="ab_crumb_sep">/</span>'
  '<a class="ab_crumb_link" href="/#capabilities">services</a><span class="ab_crumb_sep">/</span><p class="ab_crumb_current" data-field="slug">service-slug</p></div></div>'
  '<div class="ab_dbh_eyebrow text-style-mono">Service <span data-sv="no">01</span> / <span data-sv="total">08</span> · <span data-sv="name">Service</span></div>'
  '<h1 class="ab_dbh_title is-service" id="heroTitle" data-field="name">Service name</h1>'
  '<p class="ab_dbh_sum" data-field="summary">Service summary.</p>'
  '<div class="ab_sv_cta"><a class="button is-primary" href="/#launch" data-magnetic=""><span class="ab_button-shine"></span><span class="ab_button-label">Plan a mission</span><span class="ab_button-arrow" aria-hidden="true">→</span></a>'
  '<a class="button is-ghost" href="#missions" data-magnetic=""><span class="ab_button-label">See related missions</span></a></div>'
  '<div class="ab_meta is-service">'
  '<div class="ab_meta_item"><div class="ab_meta_label">Discipline</div><p class="ab_meta_value" data-field="name">Service</p></div>'
  '<div class="ab_meta_item"><div class="ab_meta_label">Best for</div><p class="ab_meta_value" data-field="best-for">Best for</p></div>'
  '<div class="ab_meta_item"><div class="ab_meta_label">Tools</div><div class="ab_meta_chips" data-sv-tools=""></div></div>'
  '<div class="ab_meta_item"><div class="ab_meta_label">Pairs with</div><div class="ab_sv_pairs" data-sv-pairs=""></div></div>'
  '<div class="ab_meta_item"><div class="ab_meta_label">Related missions</div><div class="ab_meta_value" data-sv="missions-count">Yours could be first</div></div>'
  '</div>'
  '<nav class="ab_sv_rail" id="svRail" aria-label="All services"></nav>'
  '<div class="ab_cms-source" aria-hidden="true"><p data-field="title-1">Title</p><p data-field="title-2">line two</p></div>'
  '</div></div></div></section>')
w('hero.css', '''
.ab_dbh_title.is-service{max-width:none}
.ab_sv_cta{position:relative;z-index:4;display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.ab_meta.is-service{grid-template-columns:repeat(5,minmax(0,1fr))}
.ab_sv_pairs{display:flex;flex-direction:column;gap:4px;font-size:15px}
.ab_sv_rail{position:relative;z-index:4;display:flex;gap:8px;margin-top:26px;padding-top:2px;padding-bottom:6px;overflow-x:auto}
@media screen and (max-width: 991px){.ab_meta.is-service{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media screen and (max-width: 479px){.ab_meta.is-service{grid-template-columns:repeat(2,minmax(0,1fr))}}
''')

# ---------- problems solved ----------
cards = ''.join(
    '<article class="ab_sv_s" data-selectable="" data-name="Card / solve-0%d"><div class="ab_sv_s_pb"><div class="ab_sv_s_k text-style-mono"><span>Anomaly 0%d</span>'
    '<span class="ab_sv_s_before">● Before</span></div><p class="ab_sv_s_p" data-field="solve-%d-problem">The problem.</p></div>'
    '<div class="ab_sv_s_fx"><div class="ab_sv_s_fx-k text-style-mono">Resolved</div><h3 class="ab_sv_s_h" data-field="solve-%d-heading">What changes</h3>'
    '<p class="ab_sv_s_a" data-field="solve-%d-answer">How it gets fixed.</p></div></article>' % (i, i, i, i, i) for i in (1, 2, 3))
w('solve.html', '<section class="section_sv-solve" id="solves" data-frame="problems-solved" aria-labelledby="solves-h">' + FL('problems-solved') + wrap(
    sech('/impact · what this fixes', 'solves-h', 'Problems', 'solved', 'The problems this service usually walks in with, and what you get instead.') +
    '<div class="ab_sv_solve">' + cards + '</div>') + '</section>')
w('solve.css', '''
.section_sv-solve{position:relative}
.ab_sv_solve{position:relative;z-index:3;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.ab_sv_s{position:relative;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--hair);background-color:rgba(14,16,32,0.62)}
.ab_sv_s_pb{padding:20px 22px 18px;border-bottom:1px dashed var(--hair2)}
.ab_sv_s_k{display:flex;justify-content:space-between;color:var(--dust);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase}
.ab_sv_s_before{font-weight:500;color:#ff5a5a}
.ab_sv_s_p{margin-top:10px;margin-bottom:0;color:var(--soft);font-size:17px;line-height:1.4}
.ab_sv_s_fx{position:relative;display:flex;flex:1;flex-direction:column;gap:8px;padding:18px 22px 22px}
.ab_sv_s_fx-k{color:var(--signal);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase}
.ab_sv_s_h{margin-top:0;margin-bottom:0;font-family:var(--display);font-weight:800;font-stretch:112%;font-size:clamp(20px,1.7vw,24px);line-height:1.06;text-transform:uppercase}
.ab_sv_s_a{margin-bottom:0;color:var(--soft);font-size:15.5px;line-height:1.55}
@media screen and (max-width: 991px){.ab_sv_solve{grid-template-columns:minmax(0,1fr)}}
''')

# ---------- what's included (light bento) ----------
items = ''.join(
    '<div class="ab_bento_cell"><article class="ab_bento-card is-sv" data-selectable="" data-name="Card / item-0%d"><div class="ab_sv_dl_n text-style-mono"><span>Item 0%d</span>'
    '<span class="ab_sv_dl_ck" aria-hidden="true"></span></div><div class="ab_sv_dl_ic" data-sv-icon="" aria-hidden="true"></div>'
    '<div class="ab_bento-card_copy"><h3 class="ab_bento-card_title" data-field="deliverable-%d">Deliverable</h3>'
    '<p class="ab_bento-card_text" data-field="deliverable-%d-desc">What it is.</p></div></article></div>' % (i, i, i, i) for i in range(1, 7))
w('included.html', '<section class="section_sv-included theme-light" id="included" data-frame="whats-included" aria-labelledby="inc-h">' + FL('whats-included') +
  '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-glow is-bottom" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>' + wrap(
      sech('/payload · <span data-sv="deliver-count">6</span> deliverables', 'inc-h', 'What’s', 'included',
           'Everything this mission ships with, planned and mocked up first, then built from the ground up.') +
      '<div class="ab_bento_grid is-included">' + items + '</div>') + '</section>')
w('included.css', '''
.section_sv-included{position:relative}
.ab_bento_grid.is-included{grid-auto-rows:minmax(190px,auto)}
.ab_bento-card.is-sv{justify-content:space-between}
.ab_sv_dl_n{display:flex;justify-content:space-between;align-items:center;color:var(--dust);font-size:11px;letter-spacing:0.12em;text-transform:uppercase}
.ab_sv_dl_ck{display:grid;place-items:center;width:20px;height:20px;border:1.5px solid var(--hair2)}
.ab_sv_dl_ic{width:44px;height:44px;color:var(--star);opacity:0.8}
''')

# ---------- flight plan ----------
st = ''.join(
    '<div class="ab_sv_plan_item" data-selectable="" data-name="Card / stage-0%d"><div class="ab_sv_plan_k text-style-mono">Stage 0%d</div>'
    '<h3 class="ab_sv_plan_h" data-field="stage-%d">Stage</h3><p class="ab_sv_plan_p" data-field="stage-%d-desc">What happens.</p></div>' % (i, i, i, i) for i in (1, 2, 3, 4))
w('plan.html', '<section class="section_sv-plan" id="plan" data-frame="flight-plan" aria-labelledby="plan-h">' + FL('flight-plan') + wrap(
    sech('/flight-plan · <span data-sv="plan-count">4</span> stages', 'plan-h', 'Flight', 'plan', 'How this service usually runs, from first call to launch.') +
    '<div class="ab_sv_plan" id="svPlan"><div class="ab_sv_plan_line" aria-hidden="true"></div><div class="ab_sv_plan_fill" aria-hidden="true"></div>' + st + '</div>') + '</section>')
w('plan.css', '''
.section_sv-plan{position:relative}
.ab_sv_plan{position:relative;z-index:3;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;padding-top:34px}
.ab_sv_plan_line{position:absolute;left:0;right:0;top:8px;height:2px;background-color:var(--hair)}
.ab_sv_plan_fill{position:absolute;left:0;top:8px;width:100%;height:2px;background-image:linear-gradient(90deg,#FF6A3D,#ffb08f)}
.ab_sv_plan_item{position:relative;padding:20px 20px 22px;border:1px solid var(--hair);background-color:rgba(14,16,32,0.62)}
.ab_sv_plan_k{color:var(--signal);font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase}
.ab_sv_plan_h{margin-top:10px;margin-bottom:0;font-family:var(--display);font-weight:800;font-stretch:112%;font-size:clamp(19px,1.6vw,23px);line-height:1.06;text-transform:uppercase}
.ab_sv_plan_p{margin-top:8px;margin-bottom:0;color:var(--soft);font-size:15px;line-height:1.5}
@media screen and (max-width: 991px){.ab_sv_plan{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:52px}.ab_sv_plan_line{display:none}.ab_sv_plan_fill{display:none}}
@media screen and (max-width: 479px){.ab_sv_plan{grid-template-columns:minmax(0,1fr)}}
''')

# ---------- related missions ----------
w('missions.html', '<section class="section_sv-missions" id="missions" data-frame="related-missions" aria-labelledby="ms-h">' + FL('related-missions') + wrap(
    sech('/missions · <span data-sv="missions-n">0</span> related', 'ms-h', 'Related', 'missions', 'Work where this service did the heavy lifting.') +
    '<div class="ab_arc_grid" id="svMissions"></div>'
    '<div class="ab_sv_all"><div class="ab_sv_all_note text-style-mono">Every mission lives in the archive</div>'
    '<a class="button is-ghost" href="/work" data-magnetic=""><span class="ab_button-label">Mission archive</span><span class="ab_button-arrow" aria-hidden="true">→</span></a></div>'
    '<div class="ab_cms-source" data-related-source="" aria-hidden="true"></div>') + '</section>')
w('missions.css', '''
.section_sv-missions{position:relative}
.ab_sv_all{position:relative;z-index:3;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px;margin-top:18px}
.ab_sv_all_note{color:var(--dust);font-size:12px;letter-spacing:0.08em;text-transform:uppercase}
''')

# ---------- under the hood ----------
w('hood.html', '<section class="section_sv-hood" id="hood" data-frame="under-the-hood" aria-labelledby="hood-h">' + FL('under-the-hood') + wrap(
    '<div class="ab_sv_code"><div class="ab_sv_code_copy"><div class="text-style-eyebrow">/engineer · under the hood</div>'
    '<h2 class="heading-style-h2 is-hood" id="hood-h" data-split="">Under the <span class="t-outline">hood</span></h2>'
    '<p class="ab_sec-h_lede text-size-lede">A peek at the kind of code behind this service. Short, readable and written so the next developer can follow it.</p></div>'
    '<div class="ab_sv_code_slot" id="svCode"></div></div>'
    '<div class="ab_cms-source" aria-hidden="true"><p data-field="code-label">Code label</p><p data-field="code">code</p></div>') + '</section>')
w('hood.css', '''
.section_sv-hood{position:relative}
.ab_sv_code{position:relative;z-index:3;display:grid;grid-template-columns:minmax(0,0.8fr) minmax(0,1.2fr);gap:clamp(24px,4vw,56px);align-items:start}
.ab_sv_code_copy{display:flex;flex-direction:column;gap:18px}
.heading-style-h2.is-hood{font-size:clamp(36px,4.4vw,64px)}
.ab_sv_code_slot{min-width:0}
@media screen and (max-width: 991px){.ab_sv_code{grid-template-columns:minmax(0,1fr)}}
''')

# ---------- faq ----------
w('faq.html', '<section class="section_sv-faq" id="faq" data-frame="faq" aria-labelledby="svfaq-h">' + FL('faq') + wrap(
    sech('/faq · <span data-sv="faq-count">3</span> questions', 'svfaq-h', 'Before we', 'launch') +
    '<div class="ab_sv_faq" id="svFaq"></div>') + '</section>')
w('faq.css', '''
.section_sv-faq{position:relative}
.ab_sv_faq{position:relative;z-index:3}
''')

# ---------- next service ----------
w('next.html', '<section class="section_sv-next" data-frame="next-service" aria-label="Next service">' + FL('next-service') +
  '<div class="padding-global"><div class="container-large"><div><div class="ab_arc-cta" id="nextSlot"></div></div></div></div></section>')  # ab_arc-cta carries its own 64/92px padding (same as Mission); no padding-section wrapper
w('next.css', '.section_sv-next{position:relative}')

for s in ('hero', 'solve', 'included', 'plan', 'missions', 'hood', 'faq', 'next'):
    r = subprocess.run([sys.executable, os.path.join(HERE, '..', 'prep.py'), 'services/' + s], capture_output=True, text=True)
    print(s, (r.stdout.strip().splitlines() or [''])[-1], r.stderr.strip()[-300:])
