"""Build prototypes/process.html from the About prototype shell + the _parts/process.* files.

usage: python prototypes/_parts/assemble.py
Shell ranges (about.html, 1-based, inclusive): page CSS 1525-1752, page render 2508-2620, page interactions 3168-3310.
Nav/footer "Process" links point at process.html.
"""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))
PROTO = os.path.dirname(HERE)
L = io.open(os.path.join(PROTO, 'about.html'), encoding='utf-8').read().split('\n')
part = lambda n: io.open(os.path.join(HERE, n), encoding='utf-8').read().rstrip('\n')

out = L[:1524] + [part('process.css'), ''] + L[1752:2507] + [part('process-render.js')] + L[2620:3167] + [part('process-ix.js')] + L[3310:]
h = '\n'.join(out)
h = h.replace('<main id="about" class="db ab-page"></main>', '<main id="process" class="db pr-page"></main>')
h = h.replace('href="home.html#log"', 'href="process.html"')
h = h.replace('<title>Pilot Dossier</title>', '<meta charset="utf-8">' + chr(10) + '<meta name="viewport" content="width=device-width, initial-scale=1">' + chr(10) + '<title>Flight Plan</title>', 1)
import re
h = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="How a mission flies: six stages from discovery call to launch, re-plotted for websites, interactive 3D, motion, brand, CMS, design systems and performance.">', h, 1)
SHIM = ('<script>if(location.search.indexOf("shim")>-1){window.requestAnimationFrame=function(f){return setTimeout(function(){f(performance.now())},16)};'
        'window.cancelAnimationFrame=clearTimeout;}'
        'var _q=new URLSearchParams(location.search);if(_q.get("at")){document.documentElement.setAttribute("data-shot",_q.get("at"));}</script>')  # test-only: hidden pane freezes rAF; ?at=<frame> hides the sections above it for headless shots
h = h.replace('<title>Flight Plan</title>', '<title>Flight Plan</title>' + chr(10) + SHIM, 1)
h = h.replace('<a href="process.html" data-scramble>Process</a>', '<a href="process.html" class="is-active" aria-current="page" data-scramble>Process</a>')
h = h.replace('<a href="#top" class="is-active" aria-current="page" data-scramble>About</a>', '<a href="about.html" data-scramble>About</a>')
h = h.replace('<a href="#top">About</a>', '<a href="about.html">About</a>')
h = h.replace('>Globes, maps + 3D<', '>Interactive 3D + data<')
io.open(os.path.join(PROTO, 'process.html'), 'w', encoding='utf-8', newline='\n').write(h)
print('process.html', len(h.split('\n')), 'lines')
