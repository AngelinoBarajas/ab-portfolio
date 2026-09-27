"""Knowledge System (Observatory) section files for Webflow, then ../prep.py on each.

usage: python webflow/build/knowledge/make.py

Prototype: prototypes/observatory.html, observation.html, topics.html, topic.html, ks-rows.html (parts prototypes/_parts/ks*).
Plan: docs/knowledge-integration-plan.md.

Split of work (same pattern as the Services hub):
- Webflow holds the real content: hero copy + h1s, section heads, the observation cards (native Collection List, real links),
  the topic index, the article (name, short answer, rich-text body) and the topic name + definition.
- ab-knowledge.js reads hidden CMS source lists ([data-ks-src]) and builds the interactive layers: ask box, theme/topic
  filters, star chart, related rows, planets, TOC. Visual styling of every ab_ks-* class lives in code/src/ab-knowledge.css;
  the CSS here only gives each class a stub rule (WHTML drops classes without one) plus layout that must exist without JS.
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


def FL(n):
    return '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ %s</span>' % n


def btn(kind, href, label, arrow=None):
    return ('<a class="button %s" href="%s" data-magnetic="">%s<span class="ab_button-label">%s</span>%s</a>'
            % (kind, href, '<span class="ab_button-shine"></span>' if 'is-primary' in kind else '', label,
               '<span class="ab_button-arrow" aria-hidden="true">%s</span>' % arrow if arrow else ''))


def head(eyebrow, h_id, h1, h2, lede=''):
    return ('<div class="ab_sec-h"><div class="ab_section-head is-flush"><div class="text-style-eyebrow">%s</div>'
            '<h2 class="heading-style-h2" id="%s" data-split="">%s <span class="t-outline">%s</span></h2></div>%s</div>'
            % (eyebrow, h_id, h1, h2, '<p class="ab_sec-h_lede text-size-lede">%s</p>' % lede if lede else ''))


def rec(txt):
    return '<div class="ab_rec text-style-mono"><span class="ab_rec_dot is-live" aria-hidden="true"></span>%s</div>' % txt


PLANET_LIB = ('data-planet="gas" data-seed="31" data-colors="#120e2a,#2a2263,#5b4bd6,#a597ff,#ece8ff" '
              'data-ring="#ffd9cc,#FF6A3D,#2a2263" data-tilt="-14" data-spin="70" data-glow="rgba(165,151,255,.35)"')
STUB = 'position:relative'

# ---------- /observatory ----------
w('obs-hero.html', '<section class="section_ks-hero" id="hero" data-frame="observatory" data-ks-view="library" aria-labelledby="heroTitle">' + FL('observatory') +
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-ks">'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">observatory</span></div>' +
  rec('Observatory · <span data-ks-n="obs">10</span> observations · <span data-ks-n="topics">27</span> topics') + '</div>'
  '<div class="ab_planet is-dbh is-ks" ' + PLANET_LIB + ' data-drag="" data-label="The Observatory"></div>'
  '<div class="ab_dbh_eyebrow text-style-mono">Observatory · notes from real builds, and the ideas behind them</div>'
  '<h1 class="ab_dbh_title is-ks" id="heroTitle"><span class="ab_dbh_word">The</span> <span class="ab_dbh_word t-outline is-ks">Observatory</span></h1>'
  '<p class="ab_dbh_sum is-ks">What I learn building sites, written down so you don’t have to learn it the hard way. Organized by what it answers, not by when I wrote it.</p>'
  '<div class="ab_ks-ask" data-ks-ask=""></div><div class="ab_ks-hstats" data-ks-hstats=""></div>'
  '</div></div></div></section>')
w('obs-hero.css', '.section_ks-hero{position:relative;overflow:clip}\n.ab_dbh.is-ks{min-height:88svh}\n.ab_dbh_title.is-ks{font-size:clamp(46px,8.6vw,146px)}\n'
  '.ab_dbh_word.is-ks{display:block}\n.ab_dbh_sum.is-ks{max-width:52ch}\n.ab_planet.is-dbh.is-ks{top:clamp(140px,15vw,200px)}\n.ab_ks-ask{%s}\n.ab_ks-hstats{%s}' % (STUB, STUB))

w('obs-log.html', '<section class="section_ks-log" id="library" data-frame="observation-log" aria-labelledby="logH">' + FL('observation-log') +
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad">' +
  head('/log · <span data-ks-n="obs">10</span> observations', 'logH', 'Observation', 'log',
       'Two themes: build notes from real projects, and the ideas behind them. Filter by what you’re working on.') +
  '<div class="ab_ks-ctrl" data-ks-ctrl=""></div><div class="ab_ks-listwrap" data-ks-gridwrap=""></div><div class="ab_ks-empty" data-ks-empty=""></div>'
  '</div></div></div></section>')
w('obs-log.css', '.section_ks-log{position:relative}\n.ab_ks-pad{padding-top:clamp(70px,9vw,130px);padding-bottom:clamp(70px,9vw,130px)}\n'
  '.ab_ks-ctrl{%s}\n.ab_ks-listwrap{%s}\n.ab_ks-empty{display:none}' % (STUB, STUB))

w('obs-browse.html', '<section class="section_ks-browse theme-light" id="topics" data-frame="browse-by-topic" aria-labelledby="browseH">' + FL('browse-by-topic') +
  '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>'
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad">' +
  head('/topics · 6 constellations', 'browseH', 'Browse by', 'topic',
       'The same 27 words tag every observation, mission and service on this site. Pick one to see everything behind it.') +
  '<div class="ab_ks-catwrap" data-ks-catwrap=""></div>'
  '<div class="ab_ks-cta">' + btn('is-primary', '/topics', 'Open the star chart', '→') + '</div>'
  '</div></div></div></section>')
w('obs-browse.css', '.section_ks-browse{position:relative}\n.ab_ks-catwrap{%s}\n.ab_ks-cta{display:flex;flex-wrap:wrap;margin-top:clamp(26px,3vw,40px)}' % STUB)

# card that goes inside the Observatory Collection List item (also used on Home > Incoming signals)
w('card.html', '<a class="ab_ks-card" href="#" data-ks-card=""><span class="ab_ks-scan" aria-hidden="true"></span>'
  '<div class="ab_ks-card_top"><div class="ab_ks-card_code"><div class="ab_ks-card_no" data-field="code">BN-01</div><div class="ab_ks-card_sep">·</div><div class="ab_ks-card_theme" data-field="theme">Build notes</div></div>'
  '<div class="ab_ks-card_min"><div class="ab_ks-card_mins" data-field="reading-time">3</div><div class="ab_ks-card_minl">min</div></div></div>'
  '<h3 class="ab_ks-card_h" data-field="name">Observation title</h3><p class="ab_ks-card_p" data-field="short-answer">The short answer.</p>'
  '<div class="ab_ks-card_foot"><div class="ab_ks-tags" data-ks-tags=""></div><div class="ab_ks-go" aria-hidden="true">→</div></div></a>')
w('card.css', '.ab_ks-card{display:flex;flex-direction:column}\n.ab_ks-scan{%s}\n.ab_ks-card_top{display:flex;justify-content:space-between}\n.ab_ks-card_code{display:flex}\n.ab_ks-card_no{%s}\n.ab_ks-card_sep{%s}\n'
  '.ab_ks-card_theme{%s}\n.ab_ks-card_min{display:flex}\n.ab_ks-card_mins{%s}\n.ab_ks-card_minl{%s}\n.ab_ks-card_h{%s}\n.ab_ks-card_p{%s}\n.ab_ks-card_foot{display:flex;justify-content:space-between}\n.ab_ks-tags{display:flex}\n.ab_ks-go{%s}'
  % ((STUB,) * 9))

for n in ('obs-hero', 'obs-log', 'obs-browse', 'card'):
    subprocess.run([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)], check=True)

# ---------- /topics (star chart) ----------
w('top-hero.html', '<section class="section_ks-hero" id="hero" data-frame="star-chart" data-ks-view="chart" aria-labelledby="heroTitle">' + FL('star-chart') +
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-ks-chart">'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <a class="ab_crumb_link" href="/observatory">observatory</a> / <span class="ab_crumb_current">topics</span></div>' +
  rec('Observatory · <span data-ks-n="topics">27</span> topics · 6 constellations') + '</div>'
  '<div class="ab_dbh_eyebrow text-style-mono">Topics · the shared vocabulary</div>'
  '<h1 class="ab_dbh_title is-ks" id="heroTitle"><span class="ab_dbh_word">Star</span> <span class="ab_dbh_word t-outline">chart</span></h1>'
  '<p class="ab_dbh_sum is-ks">27 ideas I keep coming back to, in six constellations. Pick a star to see every observation, mission and service that proves it.</p>'
  '</div></div></div></section>')
w('top-hero.css', '.ab_dbh.is-ks-chart{position:relative}')
w('top-chart.html', '<section class="section_ks-chart" id="chart" data-frame="star-chart-map" aria-label="Star chart">' + FL('star-chart-map') +
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-chartwrap" data-ks-chart=""></div></div></div></section>')
w('top-chart.css', '.section_ks-chart{position:relative}\n.ab_ks-chartwrap{position:relative}')
w('top-vocab.html', '<section class="section_ks-browse theme-light" id="vocabulary" data-frame="vocabulary" aria-labelledby="vocabH">' + FL('vocabulary') +
  '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>'
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad">' +
  head('/vocabulary · every star, listed', 'vocabH', 'The', 'vocabulary', 'The same list, for reading. Each word is a page.') +
  '<div class="ab_ks-catwrap" data-ks-catwrap=""></div></div></div></div></section>')
w('top-vocab.css', '.section_ks-browse{position:relative}')
for n in ('top-hero', 'top-chart', 'top-vocab'):
    subprocess.run([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)], check=True)

# ---------- Observatory template (/observatory/[slug]) ----------
w('art.html', '<div class="page-wrapper"><main class="main-wrapper" id="top">'
  '<section class="section_ks-hero" id="hero" data-frame="observation" data-ks-view="article" aria-labelledby="heroTitle">' + FL('observation') +
  '<div class="ab_ks-prog" data-ks-prog="" aria-hidden="true"></div>'
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-ks-art">'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <a class="ab_crumb_link" href="/observatory">observatory</a> / <div class="ab_ks-inl ab_crumb_current" data-field="code">BN-01</div></div>' +
  rec('Observatory · observation log') + '</div>'
  '<div class="ab_dbh_eyebrow text-style-mono"><div class="ab_ks-inl" data-field="code">BN-01</div><div class="ab_ks-inl">·</div><div class="ab_ks-inl" data-field="theme">Build notes</div></div>'
  '<h1 class="ab_dbh_title is-ks-art" id="heroTitle" data-ks-title="" data-field="name">Observation title</h1>'
  '<div class="ab_ks-achips" data-ks-achips=""></div>'
  '<div class="ab_ks-meta text-style-mono"><div class="ab_ks-meta_i">Read <div class="ab_ks-inl ab_ks-meta_b" data-field="reading-time">3</div> min</div><div class="ab_ks-meta_i">By <div class="ab_ks-inl ab_ks-meta_b">Angelino Barajas</div></div></div>'
  '<div class="ab_ks-answer"><div class="ab_ks-answer_l text-style-mono">The short answer</div><p class="ab_ks-answer_p" data-ks-answer="" data-field="short-answer">The short answer.</p></div>'
  '</div></div></div></section>'
  '<section class="section_ks-article" id="article" data-frame="article"><div class="padding-global"><div class="container-large"><div class="ab_ks-body">'
  '<article class="ab_ks-prose" data-ks-prose=""></article><aside class="ab_ks-aside" data-ks-aside="" aria-label="About this observation"></aside>'
  '</div></div></div></section>'
  '<section class="section_ks-rel theme-light" id="related" data-frame="related-reading" aria-labelledby="relH">' + FL('related-reading') +
  '<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>'
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad">' +
  head('/related · by shared topics', 'relH', 'Related', 'reading') +
  '<div class="ab_ks-rel" data-ks-rel=""></div><div class="ab_ks-pager" data-ks-pager=""></div></div></div></div></section>'
  '</main><div class="ab_cms-source" data-ks-data="" aria-hidden="true"><div class="ab_ks-current" data-ks-current=""></div></div></div>')
w('art.css', '.section_ks-article{position:relative}\n.ab_dbh.is-ks-art{position:relative}\n.ab_dbh_title.is-ks-art{font-size:clamp(36px,5vw,78px);max-width:18ch}\n'
  '.ab_ks-inl{display:inline-block}\n.ab_ks-prog{position:fixed}\n.ab_ks-achips{position:relative}\n.ab_ks-meta{display:flex}\n.ab_ks-meta_i{position:relative}\n.ab_ks-meta_b{position:relative}\n'
  '.ab_ks-answer{position:relative}\n.ab_ks-answer_l{position:relative}\n.ab_ks-answer_p{position:relative}\n.ab_ks-body{display:grid}\n.ab_ks-prose{position:relative}\n.ab_ks-aside{position:relative}\n'
  '.section_ks-rel{position:relative}\n.ab_ks-rel{position:relative}\n.ab_ks-pager{position:relative}\n.ab_ks-current{display:none}')
subprocess.run([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, 'art')], check=True)

# ---------- Topics template (/topics/[slug]) ----------
def sec(cls, sid, frame, eyebrow, h1, h2, mount, light=False):
    return ('<section class="%s%s" id="%s" data-frame="%s" data-ks-sec="%s">' % (cls, ' theme-light' if light else '', sid, frame, sid) + FL(frame) +
            ('<div class="ab_light-glow is-top" aria-hidden="true"></div><div class="ab_light-bg" aria-hidden="true"></div>' if light else '') +
            '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad">' + head(eyebrow, sid + 'H', h1, h2) +
            '<div class="ab_ks-mount" %s=""></div></div></div></div></section>' % mount)

w('topic.html', '<div class="page-wrapper"><main class="main-wrapper" id="top">'
  '<section class="section_ks-hero" id="hero" data-frame="topic" data-ks-view="topic" aria-labelledby="heroTitle">' + FL('topic') +
  '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-ks-topic">'
  '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/observatory">/observatory</a> / <a class="ab_crumb_link" href="/topics">topics</a> / <div class="ab_ks-inl ab_crumb_current" data-field="name">Topic</div></div>' +
  rec('Star chart · the shared vocabulary') + '</div>'
  '<div class="ab_ks-mini" data-ks-mini="" aria-hidden="true"></div>'
  '<div class="ab_dbh_eyebrow text-style-mono" data-ks-eyebrow=""><div class="ab_ks-inl" data-field="category">Category</div></div>'
  '<h1 class="ab_dbh_title is-ks-topic" id="heroTitle" data-ks-title="" data-field="name">Topic</h1>'
  '<p class="ab_dbh_sum is-ks-topic" data-field="definition">Definition.</p>'
  '<div class="ab_ks-def text-style-mono">Definition · part of the site vocabulary</div>'
  '<div class="ab_ks-tstats" data-ks-tstats=""></div>'
  '</div></div></div></section>' +
  sec('section_ks-topic', 'practice', 'shown-in-practice', '/missions · where it shipped', 'Shown in', 'practice', 'data-ks-practice') +
  sec('section_ks-topic', 'services', 'related-services', '/services · related', 'Related', 'services', 'data-ks-services', True) +
  sec('section_ks-topic', 'notes', 'observations', '/observatory · tagged', 'Tagged', 'observations', 'data-ks-notes') +
  sec('section_ks-topic', 'questions', 'questions', '/faq · straight answers', 'Straight', 'answers', 'data-ks-faq') +
  '<section class="section_ks-topic" id="nearby" data-frame="nearby-stars" data-ks-sec="nearby">' + FL('nearby-stars') +
  '<div class="padding-global"><div class="container-large"><div class="ab_ks-pad is-tight"><div class="ab_ks-mount" data-ks-near=""></div></div></div></div></section>'
  '</main><div class="ab_cms-source" data-ks-data="" aria-hidden="true"><div class="ab_ks-current" data-ks-current=""></div></div></div>')
w('topic.css', '.ab_dbh.is-ks-topic{position:relative}\n.ab_dbh_title.is-ks-topic{font-size:clamp(48px,8.4vw,150px);max-width:14ch}\n.ab_dbh_sum.is-ks-topic{max-width:46ch}\n'
  '.ab_ks-mini{position:absolute}\n.ab_ks-def{position:relative}\n.ab_ks-tstats{position:relative}\n.section_ks-topic{position:relative}\n.ab_ks-mount{position:relative}\n.ab_ks-pad.is-tight{padding-top:0}\n'
  '.ab_ks-inl{display:inline-block}\n.ab_ks-current{display:none}')
subprocess.run([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, 'topic')], check=True)
