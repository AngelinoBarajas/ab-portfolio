"""Generate set_settings operations for the Services hub (/services) from a get_all_elements dump.

usage: python bind.py <tree-dump.json>   → out/bind-text.json, out/bind-attrs.json, out/bind-links.json

Text: every element with data-field="<slug>" inside one of the hub's Collection Lists binds its `text` to that
field of the list's collection (WRAP below; lists outside it, e.g. Quotes / Settings / Glossary, are skipped).
Attributes (raw static_json shape): chips + manifest rows carry data-slug. Links: row Explore → the item's template page.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
C = {'services': '6ab602e4e41add8af5e28b66', 'tools': '6ab602e12eeae1c3ec984d5c', 'missions': '6ab602e38e2fa6779570a302',
     'manifest': '6ab74ea1e8e50b019e128d17'}
IDS = json.load(open(os.path.join(HERE, '..', '..', '..', 'docs', 'webflow-cms-ids.json'), encoding='utf-8'))
SLUG_IDS = {'services': '19832efca7feba76f8ac82abf16497ed', 'missions': '21d744ecbfa737adc81856a0d7c1bebc'}
MANIFEST = {'code': '2622730eeeb0f74841f5a8bf54a8468c', 'pair-notes': 'be57ef010dfe71d871a17c604b811d69',
            'service-slug': 'be2e9b2ce4429189e4eed23e7bbe8bd0:::' + SLUG_IDS['services']}
SERVICES_TEMPLATE = '6ab602e4e41add8af5e28b6c'


def fid(col, slug):
    if col == 'manifest':
        return MANIFEST[slug]
    if slug == 'name' or (col == 'tools' and slug == 'tool'):
        return IDS['nameFields'][col]
    if slug == 'slug':
        return SLUG_IDS[col]
    return IDS['fields'][col][slug]


# Collection List wrapper element id → collection key
WRAP = {
    '3f48f351-4b1e-6a36-feba-063a557e44b4': 'services',  # hero chips
    '2c7ffbed-64ff-5f94-1257-bf59e9a1f088': 'services',  # manifest rows
    'e5007278-da4e-79fa-fa39-36340553bae6': 'services',  # hidden source (from Process)
    '65190a2a-6f66-ca41-bb28-c4dc568c5f76': 'tools',     # nested: the service's tools
    'e3fb185f-47a7-f95e-c70a-729bb14e80fe': 'services',  # nested: pairs with
    'd40242ad-9395-c962-3231-bdaea654bad5': 'missions',  # nested: related missions
    '00034dd3-3c21-a13c-1a6e-80f223de3baf': 'manifest',  # hidden: codes + pair notes
    'b91957b8-1719-e862-aac2-e6b23a3f8fc0': 'missions',  # hidden: logbook source
}

t = open(sys.argv[1], encoding='utf-8').read()
d = json.loads(t[t.find('['):] if t.lstrip().startswith('[') else t[t.find('{'):])


def find_body(o):
    if isinstance(o, dict):
        if o.get('type') == 'Body':
            return o
        for v in o.values():
            r = find_body(v)
            if r:
                return r
    if isinstance(o, list):
        for v in o:
            r = find_body(v)
            if r:
                return r


text_ops, attr_ops, link_ops, found = [], [], [], []


def eid(n):
    return {'component': n['id']['component'], 'element': n['id']['element']}


def cms(col, slug):
    return {'sourceType': 'cms', 'collectionId': C[col], 'fieldId': fid(col, slug)}


DEST = 'e5007278-da4e-79fa-fa39-36340553bae6'
DEST_NEW = ('best-for', 'solve-1-problem')  # the rest of that list was bound on the Process page


def walk(n, col, w=None):
    a = n.get('attributes') or {}
    e = n['id']['element']
    if n.get('type') == 'DynamoWrapper':
        col = WRAP.get(e); w = e
    if col and 'data-field' in a and not (w == DEST and a['data-field'] not in DEST_NEW):
        f = a['data-field']
        found.append((col, f, n.get('type')))
        text_ops.append({'label': '%s.%s' % (col, f), 'element_id': eid(n),
                         'settings': [{'key': 'text', 'binding': {'source_type': 'cms', 'collection_id': C[col], 'field_id': fid(col, f)}}]})
    styles = n.get('styleNames') or []
    if col == 'services' and 'data-diag' in a and 'is-reset' not in styles:
        attrs = [{'name': 'data-diag', 'value': ''}, {'name': 'data-slug', 'value': cms('services', 'slug')}]
        attr_ops.append({'label': 'chip', 'element_id': eid(n), 'settings': [{'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    if col == 'services' and 'data-hub-row' in a:
        attrs = [{'name': 'data-hub-row', 'value': ''}, {'name': 'data-slug', 'value': cms('services', 'slug')}]
        attr_ops.append({'label': 'row', 'element_id': eid(n), 'settings': [{'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    if col == 'services' and 'data-hub-go' in a:
        link_ops.append({'label': 'explore', 'element_id': eid(n), 'settings': [{'key': 'link', 'static_link': {'mode': 'page', 'to': SERVICES_TEMPLATE}}]})
    for c in n.get('children') or []:
        walk(c, col, w)


walk(find_body(d), None)
out = os.path.join(HERE, 'out')
json.dump(text_ops, open(os.path.join(out, 'bind-text.json'), 'w', encoding='utf-8'))
json.dump(attr_ops, open(os.path.join(out, 'bind-attrs.json'), 'w', encoding='utf-8'))
json.dump(link_ops, open(os.path.join(out, 'bind-links.json'), 'w', encoding='utf-8'))
print(len(text_ops), 'text bindings,', len(attr_ops), 'attribute ops,', len(link_ops), 'links')
for f in found:
    print('  ', f)
