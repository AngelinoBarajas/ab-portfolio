"""Open Graph cards (1200x630) from the AB mark.

python og/build.py  ->  og/out/og-<variant>.png
Renders og/_card.html per variant with headless Chrome.
"""
import os, re, subprocess, random, pathlib

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent
OUT = HERE / "out"
OUT.mkdir(exist_ok=True)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

svg = (ROOT / "logo" / "ab-logo.svg").read_text(encoding="utf-8")
MARK = re.sub(r"<defs>.*?</defs>", "", re.search(r"<svg[^>]*>(.*)</svg>", svg, re.S).group(1), flags=re.S)
MARK = MARK.replace('class="cls-1"', 'fill="#F2F0EA"')

# The planets are the site's own: same data-* as the pages, drawn by the real planet code
# (code/src/core/10-space.js + the planet block of code/src/ab-core.css).
HOME_GIANT = 'data-planet="gas" data-seed="3" data-colors="#24183f,#4b3380,#c28ac0,#3a2f6b,#f0b48a" data-ring="#eadbc6,#b99c88,#6d5a7a" data-tilt="-16" data-glow="rgba(124,92,255,.35)"'
ARCHIVE = 'data-planet="gas" data-seed="21" data-colors="#1d2350,#3f4fa8,#8fb1ff,#e9d9ff,#2b1f5c" data-ring="#f0e6ff,#9a8cd6,#4d4488" data-tilt="-18" data-glow="rgba(143,177,255,.4)"'
HUB = 'data-planet="gas" data-seed="11" data-colors="#0d2a66,#146EF5,#8fb8ff,#e8f0ff,#1d2350" data-ring="#cfe0ff,#146EF5,#0d2a66" data-tilt="-16" data-glow="rgba(20,110,245,.4)"'
POS = ".ab_planet{width:340px;height:340px;right:36px;bottom:-112px}.inner,.label{z-index:5}"

# eyebrow, line 1, line 2 (outlined word ~x~, accent word *x*), tag, planet (Home hero giant / Work archive / Services hub)
VARIANTS = {
    "site":     ("Webflow designer + developer", "Websites ~with~", "*gravity.*", "Portfolio", HOME_GIANT),
    "work":     ("Mission archive", "Missions ~that~", "*landed.*", "Work", ARCHIVE),
    "services": ("Launch control · 8 services", "Pick a", "*destination.*", "Services", HUB),
}

css = (ROOT / "code" / "src" / "ab-core.css").read_text(encoding="utf-8")
PLANET_CSS = css[css.index("/* ---------- planets"):css.index(".ab_planet .pring-front > i")]
PLANET_CSS += css[css.index(".ab_planet .pring-front > i"):].split("\n", 1)[0]
core = (ROOT / "code" / "src" / "core")
base = (core / "00-base.js").read_text(encoding="utf-8")
space = (core / "10-space.js").read_text(encoding="utf-8")
HELPERS = "\n".join(l for l in base.splitlines() if l.strip().startswith(("function num(", "function hex(")))
BUILDER = space[space.index("  function mix("):space.index("  var planets = $$")]
PLANET_JS = ("window.requestIdleCallback=function(f){f();};window.requestAnimationFrame=function(f){f();};\n"
             + HELPERS + "\n" + BUILDER
             + "\n[].forEach.call(document.querySelectorAll('.ab_planet'), buildPlanet);")

random.seed(7)
stars = "".join(
    '<circle cx="%.1f" cy="%.1f" r="%.2f" fill="#F2F0EA" opacity="%.2f"/>'
    % (random.uniform(0, 1200), random.uniform(0, 630), random.choice([0.6, 0.8, 1, 1.3]), random.uniform(0.15, 0.7))
    for _ in range(170)
)

def words(s):
    s = re.sub(r"~([^~]+)~", r'<span class="o">\1</span>', s)
    return re.sub(r"\*([^*]+)\*", r'<span class="a">\1</span>', s)

tpl = (HERE / "_card.html").read_text(encoding="utf-8")
for key, (eyebrow, l1, l2, tag, planet) in VARIANTS.items():
    page = (tpl.replace("{{MARK}}", MARK).replace("{{STARS}}", stars)
               .replace("{{EYEBROW}}", eyebrow).replace("{{L1}}", words(l1))
               .replace("{{L2}}", words(l2)).replace("{{TAG}}", tag)
               .replace("{{PLANET_CSS}}", PLANET_CSS).replace("{{PLANET_POS}}", POS)
               .replace("{{PLANET}}", '<div class="ab_planet" %s></div>' % planet)
               .replace("{{PLANET_JS}}", PLANET_JS))
    src = HERE / ("_render-%s.html" % key)
    src.write_text(page, encoding="utf-8")
    png = OUT / ("og-%s.png" % key)
    prof = HERE / ".chrome" / key
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--user-data-dir=%s" % prof, "--window-size=1200,630",
                    "--force-device-scale-factor=1", "--virtual-time-budget=4000",
                    "--screenshot=%s" % png, src.resolve().as_uri()], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    src.unlink()
    print(png, os.path.getsize(png))

# AB Identity social image: the Work card's "Mark" cover (AB.markSVG with the construction grid),
# drawn by the site's own code/src/core/21-mark.js + the .ab_mark / .is-mark rules of ab-core.css.
markjs = (core / "21-mark.js").read_text(encoding="utf-8")
MARK_JS = markjs[markjs.index("  var MARK = {"):markjs.index("  Object.assign(AB")]
mark_css = "\n".join(l for l in css.splitlines() if l.startswith((".ab_mark .lg-m path", ".ab_mark .lg-g", ".ab_mark .lg-d")))
cover = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>*{margin:0;padding:0}html,body{width:1200px;height:630px;overflow:hidden;background:#07080D}
:root{--mono:"JetBrains Mono",monospace}
.cv{width:1200px;height:630px;display:grid;place-items:center;background:#07080D;color:#F2F0EA}
.cv svg{width:58%;height:auto;overflow:visible}
.cv .lg-m path{fill:#F2F0EA}
{{MARK_CSS}}
.label{position:absolute;left:56px;top:30px;font:500 13px/1 var(--mono);color:#4C8DFF}
</style></head><body><div class="label">AB / Work / ab-identity</div><div class="cv" id="cv"></div>
<script>{{MARK_JS}}
document.getElementById('cv').innerHTML = markSVG({ grid: true });</script></body></html>""".replace("{{MARK_CSS}}", mark_css).replace("{{MARK_JS}}", MARK_JS)
src = HERE / "_render-ab-identity.html"
src.write_text(cover, encoding="utf-8")
png = OUT / "og-ab-identity.png"
subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                "--user-data-dir=%s" % (HERE / ".chrome" / "ab-identity"), "--window-size=1200,630",
                "--force-device-scale-factor=1", "--virtual-time-budget=4000",
                "--screenshot=%s" % png, src.resolve().as_uri()], check=True,
               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
src.unlink()
print(png, os.path.getsize(png))
