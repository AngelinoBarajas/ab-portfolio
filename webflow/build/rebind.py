import json,re,sys
V={}
for line in open('../docs/webflow-ids.md',encoding='utf-8'):
    m=re.match(r'\| .*? \| `(--[^`]+)` \| `(variable-[^`]+)` \|',line)
    if m: V[m.group(1)]=m.group(2)
V['--_color---neutral--glass']='variable-d1d1ff59-2189-0b3c-da50-7a93570fcb47'
json.dump(V,open('var-map.json','w'),indent=0)
def props(d):
    out=[];rm=[]
    for k,v in d.items():
        if not isinstance(v,str) or 'var(' not in v: continue
        if k.startswith('border') and ' ' in v:
            w,st,var=re.match(r'(\S+) (\S+) var\((--[^)]+)\)',v).groups()
            sides=['top','right','bottom','left'] if k=='border' else [k.split('-')[1]]
            for s in sides:
                out+= [{"property_name":f"border-{s}-width","property_value":w},{"property_name":f"border-{s}-style","property_value":st},{"property_name":f"border-{s}-color","variable_as_value":V[var]}]
            rm.append(k)
        else:
            var=re.fullmatch(r'var\((--[^)]+)\)',v.strip()).group(1)
            out.append({"property_name":k,"variable_as_value":V[var]})
    return out,rm
