"""Knowledge System data for the prototypes: Insights drafts + Topics vocabulary + FAQs -> _parts/ks-data.js

usage: python prototypes/_parts/ks_data.py
Reads content/insights/drafts/*.md, cms/seed/_draft-topics.json, cms/seed/faq.json.
The same parse feeds the Webflow import later (body -> Rich text), so keep it plain.
"""
import io, os, re, json, glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
rd = lambda *p: io.open(os.path.join(ROOT, *p), encoding='utf-8').read()

VOC = json.loads(rd('cms', 'seed', '_draft-topics.json'))
FAQ = {f['_key']: f for f in json.loads(rd('cms', 'seed', 'faq.json'))}
THEME = {'Build notes': ('build-notes', 'BN'), 'Why before how': ('why-before-how', 'WB')}


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def link(href):
    # site paths -> prototype pages
    m = re.match(r'^/work/([a-z0-9-]+)', href)
    if m: return 'mission-debrief.html#' + m.group(1)
    m = re.match(r'^/services/([a-z0-9-]+)', href)
    if m: return 'services.html#' + m.group(1)
    if href.startswith('/observatory/'): return 'observation.html#' + href[13:]
    if href.startswith('/topics/'): return 'topic.html#' + href[8:]
    return href


def inline(t):
    codes = []
    t = re.sub(r'`([^`]+)`', lambda m: codes.append(m.group(1)) or '\x00%d\x00' % (len(codes) - 1), t)
    t = esc(t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', lambda m: '<a href="%s">%s</a>' % (link(m.group(2)), m.group(1)), t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'<em>\1</em>', t)
    return re.sub('\x00(\\d+)\x00', lambda m: '<code>' + esc(codes[int(m.group(1))]) + '</code>', t)


def slugify(t):
    return re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', t).lower()).strip('-')


def blocks(md):
    out, lines, i = [], md.split('\n'), 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith('```'):
            lang, j = ln[3:].strip(), i + 1
            while not lines[j].startswith('```'): j += 1
            out.append({'t': 'code', 'lang': lang, 'code': '\n'.join(lines[i + 1:j])}); i = j + 1; continue
        if ln.startswith('## ') or ln.startswith('### '):
            lvl = 'h2' if ln.startswith('## ') else 'h3'; x = inline(ln.split(' ', 1)[1])
            out.append({'t': lvl, 'x': x, 'id': slugify(x)}); i += 1; continue
        if re.match(r'^(\d+\.|-) ', ln):
            kind = 'ol' if ln[0].isdigit() else 'ul'; items = []
            while i < len(lines) and re.match(r'^(\d+\.|-) ', lines[i]):
                items.append(inline(re.sub(r'^(\d+\.|-) ', '', lines[i]))); i += 1
                while i < len(lines) and lines[i].startswith('   ') and lines[i].strip():
                    items[-1] += ' ' + inline(lines[i].strip()); i += 1
            out.append({'t': kind, 'items': items}); continue
        if ln.startswith('> '):
            out.append({'t': 'quote', 'x': inline(ln[2:])}); i += 1; continue
        if ln.strip() in ('', '---'):
            i += 1; continue
        para = [ln]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|```|\d+\. |- |> )', lines[i]):
            para.append(lines[i]); i += 1
        out.append({'t': 'p', 'x': inline(' '.join(para))})
    return out


insights = []
for path in sorted(glob.glob(os.path.join(ROOT, 'content', 'insights', 'drafts', '[0-9]*.md'))):
    num = os.path.basename(path)[:2]
    raw = io.open(path, encoding='utf-8').read()
    fm_txt, body = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S).groups()
    fm = {}
    for l in fm_txt.split('\n'):
        k, v = l.split(':', 1); v = v.strip()
        fm[k.strip()] = [s.strip() for s in v[1:-1].split(',') if s.strip()] if v.startswith('[') else v
    if 'approved' not in fm['status']: continue  # the approval gate: only approved notes are published
    body, _, notes = body.partition('**Review notes**')
    body = re.sub(r'\n---\s*$', '', body.strip())
    m = re.match(r'^\*\*The short answer:\*\*\s*(.+?)\n\n(.*)$', body, re.S)
    answer, body = m.group(1).strip(), m.group(2)
    answer = answer[0].upper() + answer[1:]  # drafts write 'The short answer: paste a...'; on its own it starts a sentence
    tslug, tcode = THEME[fm['theme']]
    words = len(re.findall(r'\w+', answer + ' ' + body))
    insights.append({
        'n': num, 'slug': fm['slug'], 'title': fm['title'], 'theme': tslug, 'themeName': fm['theme'], 'code': tcode,
        'status': fm['status'], 'desc': fm['meta_description'], 'answer': inline(answer),
        'topics': VOC['insight_topics'][num], 'services': fm['services'], 'missions': fm['missions'],
        'mins': max(2, -(-words // 200)), 'words': words, 'body': blocks(body),
        'notes': [inline(re.sub(r'^- ', '', l)) for l in notes.strip().split('\n') if l.strip()],
    })
# per-theme numbering: BN-01..07, WB-01..03
seen = {}
for x in insights:
    seen[x['code']] = seen.get(x['code'], 0) + 1; x['no'] = '%s-%02d' % (x['code'], seen[x['code']])

faqs = {}
for t in VOC['topics']:
    for k in t['faq']:
        faqs[k] = [FAQ[k]['name'], FAQ[k]['answer']]

SVCS = {x['slug']: {'type': x['planet-type'], 'colors': x['planet-colors'], 'glow': x['planet-glow']} for x in json.loads(rd('cms', 'seed', 'services.json'))}
data = {'cats': VOC['categories'], 'topics': VOC['topics'], 'insights': insights, 'faq': faqs, 'svcPlanet': SVCS}
js = '  /* generated by _parts/ks_data.py from content/insights/drafts + cms/seed/_draft-topics.json. Do not edit by hand. */\n' \
     '  var KS = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'  # a </script> in an article would end the page script
io.open(os.path.join(HERE, 'ks-data.js'), 'w', encoding='utf-8', newline='\n').write(js)
print('ks-data.js', len(insights), 'insights,', len(VOC['topics']), 'topics,', len(faqs), 'faqs,', len(js) // 1024, 'KB')
