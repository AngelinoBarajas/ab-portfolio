"""Knowledge System (Observatory) import payloads for the Webflow MCP.

usage: python cms/import/knowledge_payloads.py topics            -> Topics create_collection_items request
       python cms/import/knowledge_payloads.py observatory <ids> -> Observatory items (needs topics ids json)
Reads cms/seed/_draft-topics.json, content/insights/drafts/*.md (status: approved only),
docs/webflow-cms-ids.json. Body markdown -> HTML for the Rich text field.
"""
import io, os, re, sys, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
rd = lambda *p: io.open(os.path.join(ROOT, *p), encoding='utf-8').read()
VOC = json.loads(rd('cms', 'seed', '_draft-topics.json'))
IDS = json.loads(rd('docs', 'webflow-cms-ids.json'))
SVC, MIS = IDS['items']['services'], IDS['items']['missions']
_AF = os.path.join(ROOT, 'content', 'insights', 'drafts', 'images', 'assets.json')
ASSETS = json.loads(rd('content', 'insights', 'drafts', 'images', 'assets.json')) if os.path.exists(_AF) else {}
CAT_OPT = {'who': '36126d486b6d8c4fd5b9039279f3cba3', 'what': '04a7b1cd57287279bab0459dc22e327e', 'how': '94b02790854e096f509a3fe6e1a1222f',
           'watch': '7674f3b31826cddef3e99f65e888ebe2', 'ideas': '6a0a81df0a481f2b21655c57387598bc', 'known': 'be6b72f1686593b6131f66c48f2b9706'}
THEME_OPT = {'Build notes': '4b0092c451ac19fa10b30b785e05a661', 'Why before how': 'c7bb6077816439c84bdf6b09d6049071'}


def topics():
    items = []
    for i, t in enumerate(VOC['topics']):
        items.append({'isDraft': False, 'fieldData': {
            'name': t['name'], 'slug': t['slug'], 'category': CAT_OPT[t['category']], 'definition': t['definition'],
            'services': [SVC[s] for s in t['services']], 'sort': i + 1,
            'meta-description': t['definition']}})
    return {'items': items}


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def inline(t):
    codes = []
    t = re.sub(r'`([^`]+)`', lambda m: codes.append(m.group(1)) or '\x00%d\x00' % (len(codes) - 1), t)
    t = esc(t)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'<em>\1</em>', t)
    return re.sub('\x00(\\d+)\x00', lambda m: '<code>' + esc(codes[int(m.group(1))]) + '</code>', t)


def body_html(md):
    out, lines, i = [], md.split('\n'), 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith('```'):
            lang, j = ln[3:].strip(), i + 1
            while not lines[j].startswith('```'): j += 1
            # code blocks travel as <pre><code>; the script turns them into the site's code panels
            out.append('<pre><code data-lang="%s">%s</code></pre>' % (lang, esc('\n'.join(lines[i + 1:j]))))
            i = j + 1; continue
        if ln.startswith('## '): out.append('<h2>' + inline(ln[3:]) + '</h2>'); i += 1; continue
        if ln.startswith('### '): out.append('<h3>' + inline(ln[4:]) + '</h3>'); i += 1; continue
        if re.match(r'^(\d+\.|-) ', ln):
            tag = 'ol' if ln[0].isdigit() else 'ul'; items = []
            while i < len(lines) and re.match(r'^(\d+\.|-) ', lines[i]):
                items.append(inline(re.sub(r'^(\d+\.|-) ', '', lines[i]))); i += 1
            out.append('<%s>%s</%s>' % (tag, ''.join('<li>' + x + '</li>' for x in items), tag)); continue
        if ln.startswith('> '): out.append('<blockquote>' + inline(ln[2:]) + '</blockquote>'); i += 1; continue
        # ![alt](images/x.jpg) on its own line -> a full-width rich text image (Webflow asset url from images/assets.json)
        im = re.match(r'^!\[([^\]]*)\]\(([^)]+)\)(?:\{width=(\d+)\})?\s*$', ln)
        if im:
            src = ASSETS.get(os.path.basename(im.group(2)))
            if not src: raise SystemExit('no Webflow asset for ' + im.group(2) + ' (add it to content/insights/drafts/images/assets.json)')
            alt = esc(im.group(1)).replace('"', '&quot;')
            if im.group(3):  # {width=N}: a centered figure capped at N px (tall portrait photos)
                out.append('<figure class="w-richtext-figure-type-image w-richtext-align-center" style="max-width:%spx" data-rt-type="image" data-rt-align="center" data-rt-max-width="%spx"><div><img src="%s" alt="%s" loading="lazy"></div></figure>' % (im.group(3), im.group(3), src, alt))
            else:
                out.append('<figure class="w-richtext-figure-type-image w-richtext-align-fullwidth" data-rt-type="image" data-rt-align="fullwidth"><div><img src="%s" alt="%s" loading="lazy"></div></figure>' % (src, alt))
            i += 1; continue
        if ln.strip() in ('', '---'): i += 1; continue
        para = [ln]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#|```|\d+\. |- |> |!\[)', lines[i]):
            para.append(lines[i]); i += 1
        out.append('<p>' + inline(' '.join(para)) + '</p>')
    return ''.join(out)


def observatory(topic_ids):
    items, seen = [], {}
    for path in sorted(glob.glob(os.path.join(ROOT, 'content', 'insights', 'drafts', '[0-9]*.md'))):
        num = os.path.basename(path)[:2]
        raw = io.open(path, encoding='utf-8').read()
        fm_txt, body = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S).groups()
        fm = {}
        for l in fm_txt.split('\n'):
            k, v = l.split(':', 1); v = v.strip()
            fm[k.strip()] = [s.strip() for s in v[1:-1].split(',') if s.strip()] if v.startswith('[') else v
        if fm['status'] != 'approved': continue
        body = body.split('**Review notes**')[0]
        body = re.sub(r'\n---\s*$', '', body.strip())
        m = re.match(r'^\*\*The short answer:\*\*\s*(.+?)\n\n(.*)$', body, re.S)
        answer, body = m.group(1).strip(), m.group(2)
        answer = answer[0].upper() + answer[1:]
        answer = answer.replace('**', '')  # plain text field: drop emphasis marks, keep `code`
        answer = re.sub(r'(?<![\w*])\*([^*\n]+)\*(?![\w*])', r'\1', answer)
        code = 'BN' if fm['theme'] == 'Build notes' else 'WB'
        seen[code] = seen.get(code, 0) + 1
        words = len(re.findall(r'\w+', answer + ' ' + re.sub(r'```.*?```', '', body, flags=re.S)))
        items.append({'isDraft': False, 'fieldData': {
            'name': fm['title'], 'slug': fm['slug'], 'code': '%s-%02d' % (code, seen[code]), 'theme': THEME_OPT[fm['theme']],
            'short-answer': answer, 'body': body_html(body),
            'topics': [topic_ids[s] for s in VOC['insight_topics'][num]],
            'services': [SVC[s] for s in fm['services']], 'missions': [MIS[s] for s in fm['missions'] if s in MIS and s != 'daniel-aguirre-law'],
            'reading-time': max(2, -(-words // 200)), 'featured-on-home': num in ('01', '04', '09'), 'sort': int(num),
            'meta-description': fm['meta_description']}})
    return {'items': items}


if __name__ == '__main__':
    what = sys.argv[1]
    if what == 'topics':
        print(json.dumps(topics(), ensure_ascii=False))
    else:
        print(json.dumps(observatory(json.load(open(sys.argv[2]))), ensure_ascii=False))
