import json

fid = json.load(open('field-ids.json'))
ids = json.load(open('cms-ids.json'))
s = json.load(open('../cms/schema.json', encoding='utf-8'))
acts = []
for c in s['collections']:
    k = c['slug']
    cid = ids['collections'][k]
    fields = list(c['fields'])
    if k == 'missions':
        fields.append({"slug": "services", "displayName": "Services"})
    for f in fields:
        if f['slug'] == 'name':
            if f['displayName'] != 'Name':
                acts.append({"label": k + ":name", "update_collection_field": {"collection_id": cid, "field_id": ids['nameFields'][k], "request": {"displayName": f['displayName']}}})
            continue
        if k == 'mission-types':
            continue
        acts.append({"label": k + ":" + f['slug'], "update_collection_field": {"collection_id": cid, "field_id": fid[k][f['slug']], "request": {"displayName": f['displayName']}}})
print(len(acts))
half = len(acts) // 2
for i, part in enumerate((acts[:half], acts[half:]), 1):
    open('rename-%d.json' % i, 'w', encoding='utf-8').write(json.dumps(part, ensure_ascii=False, separators=(',', ':')))
