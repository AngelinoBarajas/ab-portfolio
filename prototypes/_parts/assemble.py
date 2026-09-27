"""Build page prototypes from the About prototype shell + the _parts/<page>.* files.

usage: python prototypes/_parts/assemble.py            (all pages)
       python prototypes/_parts/assemble.py hub        (one page)
Shell ranges (about.html, 1-based, inclusive): page CSS 1525-1752, page render 2508-2620, page interactions 3168-3310.
Nav/footer "Process" links point at process.html, "Services" at services-hub.html, "Contact" at contact.html ("Book a call" at contact.html#call).
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROTO = os.path.dirname(HERE)
L = io.open(os.path.join(PROTO, 'about.html'), encoding='utf-8').read().split('\n')
part = lambda n: io.open(os.path.join(HERE, n), encoding='utf-8').read().rstrip('\n')

PAGES = {
    'process': dict(css='process.css', render='process-render.js', ix='process-ix.js', out='process.html',
                    main='<main id="process" class="db pr-page"></main>', title='Flight Plan',
                    desc='How a mission flies: six stages from discovery call to launch, re-plotted for websites, interactive 3D, motion, brand, CMS, design systems and performance.',
                    active='process.html'),
    'hub': dict(css='hub.css', render='hub-render.js', ix='hub-ix.js', out='services-hub.html',
                main='<main id="hub" class="db hb-page"></main>', title='Launch Control',
                desc='Launch control: eight services, one pilot: Webflow development, interactive 3D + data, motion, brand identity, custom builds, CMS integrations, design systems and performance.',
                active='services-hub.html'),
    'contact': dict(css='contact.css', render='contact-render.js', ix='contact-ix.js', out='contact.html',
                    main='<main id="contact" class="db ct-page"></main>', title='Open a Channel',
                    desc='Contact Angelino Barajas: questions, help with an existing site, collaborations, hiring or a call. Tune the frequency and send the signal; replies within one business day.',
                    active='contact.html'),
}
# Knowledge System pages: one CSS/render/ix set, the view picks the page; render = generated data + renderer
KS_DESC = {
    'library': ('observatory.html', 'The Observatory', 'The Observatory: notes from real Webflow builds: structured data, smooth scroll, interactive 3D, touch bugs, versioned code, and the ideas behind the work. Organized by topic, not by date.'),
    'article': ('observation.html', 'Observation', 'An observation from the Angelino Barajas Observatory.'),
    'chart': ('topics.html', 'Star Chart', 'The shared vocabulary behind this site: 27 topics in six constellations, each linked to the notes, missions and services that prove it.'),
    'topic': ('topic.html', 'Topic', 'A topic from the site vocabulary, with every note, mission and service tagged with it.'),
    'rows': ('ks-rows.html', 'Template Rows', 'Review page: the rows the Knowledge System adds to the Mission, Service and Home pages.'),
}
for _v, (_out, _t, _d) in KS_DESC.items():
    PAGES['ks-' + _v] = dict(css='ks.css', render=['ks-data.js', 'ks-render.js'], ix='ks-ix.js', out=_out, ks=True,
                             main='<main id="ks" class="db ks-page" data-view="' + _v + '"></main>', title=_t, desc=_d, active='observatory.html')
SHIM = ('<script>if(location.search.indexOf("shim")>-1){window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},16)};'
        'window.cancelAnimationFrame=clearTimeout;}'
        'var _q=new URLSearchParams(location.search);if(_q.get("at")){document.documentElement.setAttribute("data-shot",_q.get("at"));}</script>')  # test-only: hidden pane freezes rAF; ?at=<frame> hides the sections above it for headless shots


def build(key):
    P = PAGES[key]
    rend = P['render'] if isinstance(P['render'], list) else [P['render']]
    out = L[:1524] + [part(P['css']), ''] + L[1752:2507] + [part(r) for r in rend] + L[2620:3167] + [part(P['ix'])] + L[3310:]
    h = '\n'.join(out)
    h = h.replace('<main id="about" class="db ab-page"></main>', P['main'])
    # site links: Process page + Services hub
    h = h.replace('href="home.html#log"', 'href="process.html"')
    h = h.replace('href="home.html#capabilities"', 'href="services-hub.html"')
    # contact: Contact links -> contact.html, Book a call -> contact.html#call; Plan a mission CTAs stay on the Home planner
    h = h.replace('<a href="home.html#launch" data-scramble>Contact</a>', '<a href="contact.html" data-scramble>Contact</a>')
    h = h.replace('<a class="btn btn-primary btn-cta" href="home.html#launch">', '<a class="btn btn-primary btn-cta" href="contact.html#call">')
    h = h.replace('<a href="home.html#launch">Contact<span', '<a href="contact.html">Contact<span')
    h = h.replace('<a href="home.html#launch">Contact</a>', '<a href="contact.html">Contact</a>')
    h = h.replace('<span class="mono foot-h">Services</span>', '<a class="mono foot-h" href="services-hub.html">Services</a>')
    h = h.replace('<title>Pilot Dossier</title>', '<meta charset="utf-8">' + chr(10) + '<meta name="viewport" content="width=device-width, initial-scale=1">' + chr(10) + '<title>' + P['title'] + '</title>', 1)
    h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="' + P['desc'] + '">', h, count=1)
    h = h.replace('<title>' + P['title'] + '</title>', '<title>' + P['title'] + '</title>' + chr(10) + SHIM, 1)
    # nav: mark this page active, About becomes a plain link
    h = h.replace('<a href="#top" class="is-active" aria-current="page" data-scramble>About</a>', '<a href="about.html" data-scramble>About</a>')
    h = h.replace('<a href="' + P['active'] + '" data-scramble>', '<a href="' + P['active'] + '" class="is-active" aria-current="page" data-scramble>', 1)
    h = h.replace('<a href="#top">About</a>', '<a href="about.html">About</a>')
    h = h.replace('>Globes, maps + 3D<', '>Interactive 3D + data<')
    if P.get('ks'):
        # site-wide: Observatory joins the nav (before Contact) and the footer
        h = h.replace('<a href="contact.html" data-scramble>Contact</a>', '<a href="observatory.html" data-scramble>Observatory</a>\n      <a href="contact.html" data-scramble>Contact</a>', 1)
        h = h.replace('<a href="observatory.html" data-scramble>', '<a href="observatory.html" class="is-active" aria-current="page" data-scramble>', 1)
        h = h.replace('<a href="contact.html">Contact<span', '<a href="observatory.html">Observatory<span class="mono">/observatory</span></a>\n    <a href="contact.html">Contact<span', 1)
        h = h.replace('<a href="contact.html">Contact</a>', '<a href="observatory.html">Observatory</a><a href="topics.html">Star chart</a><a href="contact.html">Contact</a>', 1)
    io.open(os.path.join(PROTO, P['out']), 'w', encoding='utf-8', newline='\n').write(h)
    print(P['out'], len(h.split('\n')), 'lines')


for k in (sys.argv[1:] or PAGES):
    build(k)
