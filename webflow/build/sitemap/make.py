"""Write the Site map page (/site-map) section files (html + css), then run ../prep.py on each.

usage: python webflow/build/sitemap/make.py

Page `6ac3b3e7a2b23444c2d6d6f5` (/site-map, static; duplicate of Contact, Contact sections removed). Asked for by Angelino
2026-10-05: "a nice organized list of the pages, styled to match the space theme, auto-updating".
Reused classes (already in Webflow, no CSS here): padding-global, container-large, ab_dbh*, ab_crumb*, ab_rec, ab_rec_dot (+ is-live),
text-style-mono, t-outline, ab_frame-label, ab_planet.
Sectors 02-05 are CMS Collection Lists built after the insert (into each [data-sm-list] host, see push notes in the build notes):
Missions (Hide from site = off, sort Sort asc), Services (sort Sort asc), Observatory (sort Sort desc, newest first),
Topics (sort Category, then Sort). Each item: LinkBlock.ab_sm-link (link = the item's page) > ab_sm-dot + name + path.
No script and no stylesheet: everything here is a real Webflow class, so it renders in the Designer too.
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def w(n, s):
    io.open(os.path.join(HERE, n), 'w', encoding='utf-8', newline='\n').write(s.strip() + '\n')


def FL(n):
    return '<span class="ab_frame-label" data-frame-label="" aria-hidden="true">▢ %s</span>' % n


def planet(kind, colors, extra=''):
    return '<div class="ab_planet is-sm" data-planet="%s" data-colors="%s" data-spin="60" aria-hidden="true"%s></div>' % (kind, colors, extra)


ROUTES = [('Home', '/', 'Start here'), ('Work', '/work', 'The mission archive'), ('Services', '/services', 'Launch control'),
          ('Process', '/process', 'The flight plan'), ('About', '/about', 'Meet the pilot'), ('Observatory', '/observatory', 'Field notes'),
          ('Topics', '/topics', 'The star chart'), ('Contact', '/contact', 'Open a channel')]


def link(name, href, desc):
    return ('<a class="ab_sm-link" href="%s"><span class="ab_sm-dot" aria-hidden="true"></span><span class="ab_sm-link_n">%s</span>'
            '<span class="ab_sm-link_p">%s</span></a>' % (href, name, desc))


# no, key, path, title (plain, outline), lede, planet, wide, all-link label
SECTORS = [
    ('01', 'routes', '/', 'Main', 'routes', 'The pages the nav and the footer point to.',
     planet('rocky', '#6b6258,#9a8c7a,#433c35'), False, None),
    ('02', 'missions', '/work', 'Mission', 'debriefs', 'Every launch: what I built, how, and why.',
     planet('gas', '#3b1f12,#a44a1f,#ff8a4c,#ffd29a,#6b2b16', ' data-ring="#ffd29a,#ff6a3d,#6b2b16" data-tilt="-18"'), False, 'Open the archive'),
    ('03', 'services', '/services', 'Services', '', 'Eight services, one pilot.',
     planet('ice', '#0f2a3a,#3f8fa8,#9fe8ff,#eaffff'), True, 'Open launch control'),
    ('04', 'notes', '/observatory', 'Field', 'notes', 'Build notes and why-before-how essays from the Observatory, newest first.',
     planet('gas', '#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c'), True, 'Open the Observatory'),
    ('05', 'topics', '/topics', 'Topics', '', 'The shared vocabulary. Every word is a page that links the notes, missions and services behind it.',
     planet('terra', '#0e3a5c,#1e6e8c,#3f8f4a,#a88b5c,#f2f0ea'), True, 'Open the star chart'),
]


def sector(s):
    no, key, path, t1, t2, lede, pl, wide, allk = s
    title = t1 + (' <span class="t-outline">%s</span>' % t2 if t2 else '')
    body = (''.join(link(*r) for r in ROUTES) if key == 'routes'
            else '<div class="ab_sm-host" data-sm-list="%s"></div>' % key)
    return ('<div class="ab_sm-sector%s" id="sector-%s">'
            '<div class="ab_sm-sector_head text-style-mono"><span class="ab_sm-sector_no">Sector %s</span><span class="ab_sm-sector_path">%s</span></div>'
            '<div class="ab_sm-sector_title">%s<h2 class="ab_sm-sector_h">%s</h2></div>'
            '<p class="ab_sm-sector_p">%s</p>'
            '<div class="ab_sm-list%s">%s</div>%s</div>'
            % (' is-wide' if wide else '', key, no, path, pl, title, lede, ' is-cols' if wide else '', body,
               '<a class="ab_sm-all text-style-mono" href="%s">%s →</a>' % (path, allk) if allk else ''))


jumps = ''.join('<a class="ab_sm-jump" href="#sector-%s"><span class="ab_sm-jump_no">%s</span>%s</a>'
                % (s[1], s[0], (s[3] + ' ' + s[4]).strip()) for s in SECTORS)

hero = (
    '<section class="section_sm-hero" id="hero" data-frame="nav-chart" aria-labelledby="heroTitle">' + FL('nav-chart') +
    '<div class="padding-global"><div class="container-large"><div class="ab_dbh is-sm">'
    '<div class="ab_dbh_top"><div class="ab_crumb text-style-mono"><a class="ab_crumb_link" href="/">/home</a> / <span class="ab_crumb_current">site map</span></div>'
    '<div class="ab_rec text-style-mono"><span class="ab_rec_dot is-live" aria-hidden="true"></span>Chart updates with every launch</div></div>'
    '<div class="ab_sm-hero_grid"><div class="ab_sm-hero_copy">'
    '<div class="ab_dbh_eyebrow text-style-mono is-sm">Navigation chart · every page on this site</div>'
    '<h1 class="ab_dbh_title is-sm" id="heroTitle"><span class="ab_dbh_word">Site</span> <span class="ab_dbh_word t-outline">map</span></h1>'
    '<p class="ab_dbh_sum is-sm">Every route through this site on one chart: the main pages, each mission debrief, the services, '
    'field notes from the Observatory and the topics that tie them together.</p></div>'
    '<div class="ab_sm-hero_planet"><div class="ab_planet is-sm-hero" data-planet="gas" data-colors="#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c" '
    'data-ring="#e9d9ff,#8fb1ff,#3f4fa8" data-tilt="-16" data-spin="80" data-glow="rgba(143,177,255,.35)" data-drag="" data-label="Chart planet"></div></div></div>'
    '<nav class="ab_sm-jumps text-style-mono" aria-label="Sectors">' + jumps + '</nav>'
    '</div></div></div></section>')

chart = (
    '<section class="section_sm-chart" id="chart" data-frame="sectors" aria-label="Site map">' + FL('sectors') +
    '<div class="padding-global"><div class="container-large"><div class="ab_sm-grid">' +
    ''.join(sector(s) for s in SECTORS) +
    '</div></div></div></section>')

css = {
'hero': '''
.section_sm-hero{position:relative;overflow:clip;padding-bottom:clamp(28px,4vw,56px)}
.ab_dbh.is-sm{padding-bottom:0}
.ab_sm-hero_grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,320px);align-items:center;grid-column-gap:clamp(24px,4vw,64px)}
.ab_sm-hero_copy{position:relative;z-index:2}
.ab_dbh_eyebrow.text-style-mono.is-sm{margin-top:clamp(26px,3.4vw,48px)}
.ab_dbh_title.is-sm{margin-top:clamp(10px,1.2vw,16px)}
.ab_dbh_sum.is-sm{max-width:46ch;margin-top:clamp(14px,1.6vw,22px);font-size:clamp(17px,1.35vw,19px);color:var(--soft)}
.ab_sm-hero_planet{position:relative;display:flex;justify-content:center;align-items:center;aspect-ratio:1}
.ab_planet.is-sm-hero{width:62%;height:62%}
.ab_sm-jumps{display:flex;flex-wrap:wrap;gap:8px;margin-top:clamp(26px,3vw,40px)}
.ab_sm-jump{display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--hair);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--soft);text-decoration:none}
.ab_sm-jump_no{color:var(--signal)}
@media screen and (max-width: 767px){.ab_sm-hero_grid{grid-template-columns:minmax(0,1fr)}.ab_sm-hero_planet{display:none}}
''',
'chart': '''
.section_sm-chart{position:relative;padding-top:clamp(24px,3vw,40px);padding-bottom:clamp(64px,8vw,120px)}
.ab_sm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;border:1px solid var(--hair);background-color:var(--hair)}
.ab_sm-sector{position:relative;display:flex;flex-direction:column;gap:14px;padding:clamp(20px,2.4vw,34px);background-color:var(--deep)}
.ab_sm-sector.is-wide{grid-column-start:1;grid-column-end:-1}
.ab_sm-sector_head{display:flex;justify-content:space-between;gap:12px;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust)}
.ab_sm-sector_no{color:var(--signal)}
.ab_sm-sector_path{color:var(--dust)}
.ab_sm-sector_title{display:flex;align-items:center;gap:14px}
.ab_planet.is-sm{position:relative;top:auto;left:auto;right:auto;bottom:auto;flex:none;width:34px;height:34px}
.ab_sm-sector_h{font-family:var(--display);font-weight:900;font-size:clamp(26px,2.6vw,40px);line-height:1;text-transform:uppercase}
.ab_sm-sector_p{max-width:56ch;font-size:15px;color:var(--soft)}
.ab_sm-list{display:grid;grid-template-columns:minmax(0,1fr);border-top:1px solid var(--hair)}
.ab_sm-list.is-cols{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));grid-column-gap:28px}
.ab_sm-host{display:contents}
.ab_sm-items{display:contents}
.ab_sm-item{display:contents}
.ab_sm-link{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:baseline;grid-column-gap:10px;padding-top:10px;padding-bottom:10px;border-bottom:1px solid var(--hair);color:var(--star);text-decoration:none}
.ab_sm-dot{width:6px;height:6px;border-radius:50%;background-color:var(--signal);transform:translateY(-2px)}
.ab_sm-link_n{font-size:16px;line-height:1.3;color:var(--star)}
.ab_sm-link_p{font-family:var(--mono);font-size:11px;letter-spacing:0.04em;color:var(--dust);text-align:right}
.ab_sm-all{align-self:flex-start;margin-top:auto;padding-top:6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--signal);text-decoration:none}
@media screen and (max-width: 767px){.ab_sm-grid{grid-template-columns:minmax(0,1fr)}.ab_sm-list.is-cols{grid-template-columns:minmax(0,1fr)}.ab_sm-link{grid-template-columns:auto minmax(0,1fr)}.ab_sm-link_p{display:none}}
''',
}

for n, h in (('hero', hero), ('chart', chart)):
    w(n + '.html', h)
    w(n + '.css', css[n])
    subprocess.check_call([sys.executable, os.path.join(HERE, '..', 'prep.py'), os.path.join(HERE, n)])
