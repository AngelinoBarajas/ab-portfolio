"""Prepare a section for data_whtml_builder.

usage: python prep.py home/hero      (reads home/hero.html + home/hero.css)

CSS is written with short aliases (var(--dust), var(--display) ...) and normal
shorthands. This script:
  1. maps aliases to the Webflow variable CSS names,
  2. expands shorthands into the longhands Webflow stores,
  3. pulls font-family variables out (WHTML drops them),
  4. writes out/<name>.whtml.css (for the builder) and
     out/<name>.rebind.json (update_style actions that link the variables).
"""
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
IDS = os.path.join(HERE, '..', '..', 'docs', 'webflow-ids.md')

ALIAS = {
    'void': '--_color---neutral--void', 'deep': '--_color---neutral--deep',
    'panel': '--_color---neutral--panel', 'hair': '--_color---neutral--hair',
    'hair2': '--_color---neutral--hair-strong', 'glass': '--_color---neutral--glass',
    'star': '--_color---text--primary', 'soft': '--_color---text--secondary',
    'dust': '--_color---text--tertiary', 'signal': '--_color---brand--signal',
    'on-signal': '--_color---brand--on-signal', 'nebula': '--_color---brand--nebula',
    'select': '--_color---ui--select', 'live': '--_color---status--live',
    'alert': '--_color---status--alert',
    'display': '--_typography---font--display', 'body': '--_typography---font--body',
    'mono': '--_typography---font--mono', 'script': '--_typography---font--script',
    'gutter': '--_spacing---layout--gutter', 'max': '--_spacing---layout--max-width',
    'gap': '--_spacing---grid--gap', 'gap-l': '--_spacing---grid--gap-large',
    'btn-h': '--_spacing---button--height',
    'fs-h2': '--_size---heading--h2', 'fs-h3': '--_size---heading--h3',
    'fs-lede': '--_size---text--lede', 'fs-small': '--_size---text--small',
    'fs-eyebrow': '--_size---text--eyebrow', 'fs-micro': '--_size---text--micro',
}
BP = {'991': 'medium', '767': 'small', '479': 'tiny'}


def varmap():
    v = {}
    for line in open(IDS, encoding='utf-8'):
        m = re.match(r'\| .*? \| `(--[^`]+)` \| `(variable-[^`]+)` \|', line)
        if m:
            v[m.group(1)] = m.group(2)
    return v


def alias(val):
    return re.sub(r'var\(--([\w-]+)\)',
                  lambda m: 'var(%s)' % ALIAS.get(m.group(1), '--' + m.group(1)), val)


def split_top(v):
    """split on spaces that are not inside parentheses"""
    out, depth, cur = [], 0, ''
    for ch in v:
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if ch == ' ' and depth == 0:
            if cur:
                out.append(cur)
            cur = ''
        else:
            cur += ch
    if cur:
        out.append(cur)
    return out


def four(parts):
    if len(parts) == 1: return parts * 4
    if len(parts) == 2: return [parts[0], parts[1], parts[0], parts[1]]
    if len(parts) == 3: return [parts[0], parts[1], parts[2], parts[1]]
    return parts[:4]


SIDES = ['top', 'right', 'bottom', 'left']


def expand(k, v):
    p = split_top(v)
    if k in ('padding', 'margin'):
        return [('%s-%s' % (k, s), x) for s, x in zip(SIDES, four(p))]
    if k in ('padding-inline', 'margin-inline'):
        b = k.split('-')[0]; p = p if len(p) == 2 else p * 2
        return [(b + '-left', p[0]), (b + '-right', p[1])]
    if k in ('padding-block', 'margin-block'):
        b = k.split('-')[0]; p = p if len(p) == 2 else p * 2
        return [(b + '-top', p[0]), (b + '-bottom', p[1])]
    if k == 'inset':
        return list(zip(SIDES, four(p)))
    if k == 'gap':
        return [('grid-row-gap', p[0]), ('grid-column-gap', p[-1])]
    if k == 'row-gap':
        return [('grid-row-gap', v)]
    if k == 'column-gap':
        return [('grid-column-gap', v)]
    if k == 'overflow':
        return [('overflow-x', p[0]), ('overflow-y', p[-1])]
    if k == 'border-radius' and len(p) == 1:
        return [('border-%s-radius' % c, v) for c in ('top-left', 'top-right', 'bottom-right', 'bottom-left')]
    if k == 'flex':
        if v == 'none': return [('flex-grow', '0'), ('flex-shrink', '0'), ('flex-basis', 'auto')]
        if v == '1': return [('flex-grow', '1'), ('flex-shrink', '1'), ('flex-basis', '0%')]
        return [('flex-grow', p[0]), ('flex-shrink', p[1] if len(p) > 1 else '1'), ('flex-basis', p[2] if len(p) > 2 else '0%')]
    if k == 'place-items':
        return [('align-items', p[0]), ('justify-items', p[-1])]
    if k in ('border-color', 'border-style', 'border-width'):
        prop = k.split('-')[1]
        return [('border-%s-%s' % (s, prop), x) for s, x in zip(SIDES, four(p))]
    if k == 'border' or k in ('border-%s' % s for s in SIDES):
        sides = SIDES if k == 'border' else [k.split('-')[1]]
        if v in ('0', 'none'):
            return [('border-%s-style' % s, 'none') for s in sides]
        w, st, col = p[0], p[1], ' '.join(p[2:])
        out = []
        for s in sides:
            out += [('border-%s-width' % s, w), ('border-%s-style' % s, st), ('border-%s-color' % s, col)]
        return out
    return [(k, v)]


def parse(css):
    """-> list of (selector, [(prop, val)], breakpoint)"""
    rules = []
    rest = css
    for m in re.finditer(r'@media[^{]*max-width:\s*(\d+)px\)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}', css):
        for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', m.group(2)):
            rules.append((sel.strip(), body, BP[m.group(1)]))
        rest = rest.replace(m.group(0), '')
    for sel, body in re.findall(r'([^{}]+)\{([^{}]*)\}', rest):
        rules.append((sel.strip(), body, None))
    out = []
    for sel, body, bp in rules:
        decls = []
        for k, v in re.findall(r'([\w-]+)\s*:\s*([^;]+)', body):
            for kk, vv in expand(k.strip(), alias(v.strip())):
                decls.append((kk, vv))
        out.append((sel, decls, bp))
    return out


def build(base):
    V = varmap()
    html = open(base + '.html', encoding='utf-8').read().strip()
    css = open(base + '.css', encoding='utf-8').read()
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    rules = parse(css)
    whtml, acts, blocks = [], [], {}
    for sel, decls, bp in rules:
        pseudo_ = (sel.split(':', 1) + [None])[1]
        pseudo_ = pseudo_.lstrip(':') if pseudo_ else None
        whtml_ok = pseudo_ in (None, 'hover', 'focus', 'active')
        keep = [(k, v) for k, v in decls if k != 'font-family']
        body = ';'.join('%s:%s' % kv for kv in keep)
        if body and whtml_ok:
            blocks.setdefault(bp, []).append('%s{%s}' % (sel, body))
        # rebind: variable-linked props (+ font families); every prop when WHTML can't take the rule
        props = []
        for k, v in decls:
            m = re.fullmatch(r'var\((--[\w-]+)\)', v)
            if m and m.group(1) in V:
                props.append({"property_name": k, "variable_as_value": V[m.group(1)]})
            elif not whtml_ok:
                props.append({"property_name": k, "property_value": v})
        if not props:
            continue
        s, pseudo = (sel.split(':', 1) + [None])[:2]
        chain = [c for c in s.split('.') if c]
        a = {"style_name": chain[-1], "properties": props}
        if len(chain) > 1: a["parent_style_names"] = chain[:-1]
        if pseudo: a["pseudo"] = pseudo.lstrip(':')
        if bp: a["breakpoint_id"] = bp
        acts.append({"label": sel + ('@' + bp if bp else ''), "update_style": a})
    order = {None: 0, 'medium': 991, 'small': 767, 'tiny': 479}
    out_css = ''
    for bp in sorted(blocks, key=lambda b: -order[b] if b else -10000):
        body = '\n'.join(blocks[bp])
        out_css += (body if bp is None else '@media screen and (max-width: %dpx) {\n%s\n}' % (order[bp], body)) + '\n'
    name = os.path.basename(base)
    od = os.path.join(os.path.dirname(base), 'out')
    os.makedirs(od, exist_ok=True)
    json.dump({"html": html, "css": out_css}, open(os.path.join(od, name + '.whtml.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(acts, open(os.path.join(od, name + '.rebind.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('html %d chars, css %d chars, %d rebind actions' % (len(html), len(out_css), len(acts)))


if __name__ == '__main__':
    build(sys.argv[1])
