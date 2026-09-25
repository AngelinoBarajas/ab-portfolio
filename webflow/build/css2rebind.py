import json,re,sys,rebind
BP={'991':'medium','767':'small','479':'tiny'}
def parse(css):
    out=[]
    def rules(block,bp):
        for sel,body in re.findall(r'([^{}]+)\{([^{}]*)\}',block):
            out.append((sel.strip(),body,bp))
    # media blocks
    rest=css
    for m in re.finditer(r'@media[^{]*max-width:\s*(\d+)px\)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}',css):
        rules(m.group(2),BP[m.group(1)]); rest=rest.replace(m.group(0),'')
    rules(rest,None)
    return out
def actions(css,extra_fonts={}):
    acts=[]
    for sel,body,bp in parse(css):
        pseudo=None
        if ':' in sel: sel,pseudo=sel.split(':',1)
        chain=[c for c in sel.split('.') if c]
        d=dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)',body))
        d={k:v.strip() for k,v in d.items()}
        p,rm=rebind.props(d)
        if not p: continue
        a={"style_name":chain[-1],"properties":p}
        if len(chain)>1: a["parent_style_names"]=chain[:-1]
        if rm: a["remove_properties"]=rm
        if pseudo: a["pseudo"]=pseudo
        if bp: a["breakpoint_id"]=bp
        acts.append({"label":sel+(':'+pseudo if pseudo else '')+('@'+bp if bp else ''),"update_style":a})
    for name,var in extra_fonts.items():
        acts.append({"label":name+" font","update_style":{"style_name":name,"properties":[{"property_name":"font-family","variable_as_value":var}]}})
    return acts
if __name__=='__main__':
    css=open(sys.argv[1],encoding='utf-8').read()
    fonts=json.loads(sys.argv[2]) if len(sys.argv)>2 else {}
    print(json.dumps(actions(css,fonts),separators=(',',':')))
