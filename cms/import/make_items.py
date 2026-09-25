"""Build create_collection_items actions from cms/seed/*.json.

Usage: python make_items.py <phase>
Reads item-ids.json (slug -> Webflow item ID per collection, filled in as phases land)
and writes items-<phase>.json.
"""
import json
import re
import sys
import unicodedata

IDS = json.load(open('cms-ids.json'))['collections']
IMG = 'https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@f00bace/prototypes/'
try:
    ITEM_IDS = json.load(open('item-ids.json'))
except FileNotFoundError:
    ITEM_IDS = {}

SCHEMA = {c['slug']: {f['slug']: f for f in c['fields']} for c in json.load(open('../cms/schema.json', encoding='utf-8'))['collections']}
HELPER_KEYS = {'_key', '_id', '_placeholder', 'slug'}


def seed(name):
    return json.load(open('../cms/seed/%s.json' % name, encoding='utf-8'))


def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')[:80]


def item_slug(coll, it):
    if it.get('slug'):
        return it['slug']
    if coll == 'faq':
        return it['_key']
    if 'mission' in it and coll != 'missions':
        return slugify(it['mission'] + '-' + it['name'])
    return slugify(it['name'])


def ref(coll, key):
    return ITEM_IDS[coll][key]


def ref_by_name(coll, name):
    return ITEM_IDS[coll][slugify(name)]


def field_data(coll, it, skip=()):
    fields = SCHEMA[coll]
    out = {'name': it['name'], 'slug': item_slug(coll, it)}
    for k, v in it.items():
        if k in HELPER_KEYS or k == 'name' or k in skip:
            continue
        if v is None or v == '' or v == []:
            continue
        f = fields.get(k)
        t = f['type'] if f else None
        if coll == 'missions' and k == 'services':
            out[k] = [ref('services', s) for s in v]
            continue
        if t == 'Image':
            if isinstance(v, str) and v.startswith('['):
                continue  # bracket placeholder: Image fields can't hold text
            path = v if v.startswith('prototypes/') else 'prototypes/' + v
            out[k] = {'url': IMG + path[len('prototypes/'):]}
        elif t in ('Link', 'Email'):
            if '[' in v:
                continue  # bracket placeholder: typed field rejects it
            out[k] = v
        elif t == 'MultiReference':
            target = f['collection']
            if target in ('mission-types', 'tools'):
                out[k] = [ref_by_name(target, n) for n in v]
            elif target == 'faq':
                out[k] = [ref('faq', n) for n in v]
            else:
                out[k] = [ref(target, n) for n in v]
        elif t == 'Reference':
            out[k] = ref(f['collection'], v)
        elif coll == 'globe-pins' and k in ('lat', 'lng'):
            out[k] = repr(v)
        else:
            out[k] = v
    return out


def actions(coll, items, skip=()):
    reqs = [{'isDraft': False, 'fieldData': field_data(coll, it, skip)} for it in items]
    return [{'label': coll, 'create_collection_items': {'collection_id': IDS[coll], 'request': {'items': reqs}}}]


phase = sys.argv[1]
acts = []
if phase == '1':
    tools = [t for t in seed('tools') if t['name'] != 'Webflow']  # Webflow created in the option-name test
    acts += actions('tools', tools)
    for c in ('mission-types', 'site-settings', 'quotes', 'glossary', 'faq'):
        acts += actions(c, seed(c))
elif phase == '2':
    acts += actions('missions', seed('missions'), skip=('next-mission', 'services'))
elif phase == '3':
    acts += actions('services', seed('services'), skip=('pairs-with',))
elif phase == '4':
    for c in ('mission-channels', 'mission-systems', 'problems-solved', 'mission-stats', 'globe-pins'):
        acts += actions(c, seed(c))
elif phase == 'links':
    ups = []
    for m in seed('missions'):
        fd = {}
        if m.get('next-mission'):
            fd['next-mission'] = ref('missions', m['next-mission'])
        if m.get('services'):
            fd['services'] = [ref('services', s) for s in m['services']]
        if fd:
            ups.append({'id': ref('missions', m['slug']), 'fieldData': fd})
    acts.append({'label': 'missions-links', 'update_collection_items': {'collection_id': IDS['missions'], 'request': {'items': ups}}})
    ups = [{'id': ref('services', s['slug']), 'fieldData': {'pairs-with': [ref('services', p) for p in s['pairs-with']]}} for s in seed('services')]
    acts.append({'label': 'services-pairs', 'update_collection_items': {'collection_id': IDS['services'], 'request': {'items': ups}}})

open('items-%s.json' % phase, 'w', encoding='utf-8').write(json.dumps(acts, ensure_ascii=False, separators=(',', ':')))
print(sum(len(a[next(k for k in a if k != 'label')]['request']['items']) for a in acts), 'items')
