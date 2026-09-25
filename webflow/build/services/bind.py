"""Generate set_settings operations for the Services template from a get_all_elements dump.

usage: python bind.py <tree-dump.txt>   → out/bind-text.json, out/bind-attrs.json, out/classes.json

Text: every element with data-field="<slug>" binds its `text` to that field of the collection
the element sits in (the nearest Collection List's source, else the Services template item).
Attributes: raw static_json shape (the typed value_binding form is rejected by the API).
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = '6ab602e4e41add8af5e28b6c'
C = {
    'services': '6ab602e4e41add8af5e28b66', 'tools': '6ab602e12eeae1c3ec984d5c', 'missions': '6ab602e38e2fa6779570a302',
    'faq': '6ab602e36931639fba51fe95', 'site-settings': '6ab602e1f5e45955671fac33', 'quotes': '6ab602e2339877b1d3532240',
}
IDS = json.load(open(os.path.join(HERE, '..', '..', '..', 'docs', 'webflow-cms-ids.json'), encoding='utf-8'))
SLUG_IDS = {'services': '19832efca7feba76f8ac82abf16497ed', 'missions': '21d744ecbfa737adc81856a0d7c1bebc'}


def fid(col, slug):
    if slug == 'name' or (col == 'quotes' and slug == 'quote'):
        return IDS['nameFields'][col]
    if slug == 'slug':
        return SLUG_IDS[col]
    return IDS['fields'][col][slug]


# Collection List wrapper element id → collection key (set when the lists were created)
WRAP = {
    '7c9831d8-0b91-f86b-358b-b376b0773683': 'tools', 'e8b8b8e2-b56b-daa0-4c88-42851a8f053d': 'services',
    'f4ef7221-f9dd-d0f5-00cd-bcb5fb23f659': 'services', 'e5bde810-63d4-ec2d-1fc4-2b3a47139d31': 'missions',
    'cb7f817d-ae11-d58a-190f-b90cd71d5a65': 'faq', 'dbaff7a2-34bb-c01f-2aa0-9120349eebe8': 'site-settings',
    '0fd53822-690e-44a0-8061-fc9cacffe34f': 'quotes',
}

t = open(sys.argv[1], encoding='utf-8').read()
d = json.loads(t[t.find('{'):])


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


text_ops, attr_ops, found = [], [], []


def eid(n):
    return {'component': n['id']['component'], 'element': n['id']['element']}


def cms(col, slug):
    return {'sourceType': 'cms', 'collectionId': C[col], 'fieldId': fid(col, slug)}


def walk(n, col, in_rail):
    a = n.get('attributes') or {}
    e = n['id']['element']
    if n.get('type') == 'DynamoWrapper' and e in WRAP:
        col = WRAP[e]
        in_rail = e == 'f4ef7221-f9dd-d0f5-00cd-bcb5fb23f659'
    if 'data-field' in a:
        f = a['data-field']
        found.append((col, f, n.get('type')))
        text_ops.append({'label': '%s.%s' % (col, f), 'element_id': eid(n),
                         'settings': [{'key': 'text', 'binding': {'source_type': 'cms', 'collection_id': C[col], 'field_id': fid(col, f)}}]})
    # hero planet
    if 'data-service-planet' in a:
        attrs = [{'name': 'data-drag', 'value': ''}, {'name': 'data-label', 'value': 'Service planet'},
                 {'name': 'data-service-planet', 'value': ''}, {'name': 'data-spin', 'value': '60'},
                 {'name': 'data-slug', 'value': cms('services', 'slug')},
                 {'name': 'data-planet', 'value': cms('services', 'planet-type')},
                 {'name': 'data-colors', 'value': cms('services', 'planet-colors')},
                 {'name': 'data-ring', 'value': cms('services', 'planet-ring')},
                 {'name': 'data-glow', 'value': cms('services', 'planet-glow')}]
        attr_ops.append({'label': 'hero planet', 'element_id': eid(n), 'settings': [{'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    # deliverable icons: nth icon in page order binds deliverable-N-icon
    if 'data-sv-icon' in a:
        k = sum(1 for o in attr_ops if o['label'].startswith('icon')) + 1
        attrs = [{'name': 'data-sv-icon', 'value': cms('services', 'deliverable-%d-icon' % k)}, {'name': 'aria-hidden', 'value': 'true'}]
        attr_ops.append({'label': 'icon %d' % k, 'element_id': eid(n), 'settings': [{'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    # rail links carry slug + planet data for the next-service card; pairs + rail link to the item's template page
    styles = n.get('styleNames') or []
    if 'ab_sv_rail_link' in styles:
        attrs = [{'name': 'data-slug', 'value': cms('services', 'slug')}, {'name': 'data-planet', 'value': cms('services', 'planet-type')},
                 {'name': 'data-colors', 'value': cms('services', 'planet-colors')}, {'name': 'data-ring', 'value': cms('services', 'planet-ring')},
                 {'name': 'data-glow', 'value': cms('services', 'planet-glow')}]
        attr_ops.append({'label': 'rail link', 'element_id': eid(n), 'settings': [
            {'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    if 'ab_sv_pair' in styles:
        attrs = [{'name': 'data-slug', 'value': cms('services', 'slug')}]
        attr_ops.append({'label': 'pair link', 'element_id': eid(n), 'settings': [
            {'key': 'attributes', 'static_json': {'value': json.dumps(attrs)}}]})
    for c in n.get('children') or []:
        walk(c, col, in_rail)


walk(find_body(d), 'services', False)
out = os.path.join(HERE, 'out')
json.dump(text_ops, open(os.path.join(out, 'bind-text.json'), 'w', encoding='utf-8'))
json.dump(attr_ops, open(os.path.join(out, 'bind-attrs.json'), 'w', encoding='utf-8'))
print(len(text_ops), 'text bindings,', len(attr_ops), 'attribute ops')
for f in found:
    print('  ', f)
