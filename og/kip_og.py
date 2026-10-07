"""kip mission social image (1200 x 630), made from the real kipvillage.com renders and cast portraits.
Brand art rule: no look-alikes. Sources: X:/Claude-Skills/kip-site/debrief-kit/renders/desktop-02-house-full.png
(the live site's full-screen house) and code/vendor/kip/cast/*.webp (the site's 3D portraits).
python og/kip_og.py  ->  og/out/og-kip-v2.jpg (+ .png)"""
import base64, io, os
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
RENDER = r'X:/Claude-Skills/kip-site/debrief-kit/renders/desktop-02-house-full.png'
OUT = os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)


def data_url(im, fmt='PNG'):
    b = io.BytesIO(); im.save(b, fmt); return 'data:image/%s;base64,' % fmt.lower() + base64.b64encode(b.getvalue()).decode()


# the house card from the live render (3200 x 2000: the sky card spans ~x 380–2840, y 235–1660)
house = Image.open(RENDER).convert('RGB').crop((380, 235, 2840, 1665))
house.thumbnail((1400, 1400))
faces = {n: data_url(Image.open(os.path.join(ROOT, 'code', 'vendor', 'kip', 'cast', n + '.webp')).convert('RGBA')) for n in ('sam', 'june', 'nana')}

HTML = '''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito+Sans:wght@400;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#FFF4E6;font-family:'Nunito Sans',sans-serif;color:#1E1B2E;position:relative;overflow:hidden}
.ball{position:absolute;border-radius:50%;opacity:.9}
.l{position:absolute;left:64px;top:62px;width:470px}
.logo{font:800 46px/1 'Baloo 2';letter-spacing:-.02em}.logo sup{color:#FF7A45;font-size:18px;margin-left:2px}
.pill{display:inline-flex;align-items:center;gap:10px;margin-top:40px;font:800 14px 'Nunito Sans';letter-spacing:.14em}
.pill i{width:12px;height:12px;border-radius:50%;background:#FF7A45;box-shadow:0 0 0 5px #FFD9C6}
h1{margin-top:18px;font:800 64px/1.02 'Baloo 2';letter-spacing:-.015em}
p{margin-top:22px;font:400 22px/1.45 'Nunito Sans';color:#4A4560;max-width:430px}
.url{position:absolute;left:64px;bottom:54px;font:800 20px 'Nunito Sans';color:#FF7A45;letter-spacing:.02em}
.card{position:absolute;left:560px;top:70px;width:600px;height:349px;border-radius:30px;overflow:hidden;box-shadow:0 26px 60px -24px rgba(30,27,46,.45);background:url(@@HOUSE@@) center/cover}
.faces{position:absolute;left:592px;top:430px;display:flex;gap:6px}
.faces img{width:96px;height:96px;filter:drop-shadow(0 8px 12px rgba(30,27,46,.22))}
.cap{position:absolute;left:910px;top:462px;width:240px;font:700 17px/1.4 'Nunito Sans';color:#4A4560}
</style></head><body>
<div class="ball" style="left:-40px;bottom:-60px;width:180px;height:180px;background:radial-gradient(circle at 34% 30%,#fff 0,#FFC94A 40%,#E5A82C 100%)"></div>
<div class="ball" style="right:-30px;top:-40px;width:120px;height:120px;background:radial-gradient(circle at 34% 30%,#fff 0,#5FD3A8 40%,#2E9E76 100%)"></div>
<div class="l"><div class="logo">kip<sup>z</sup></div><div class="pill"><i></i>A CONCEPT BABY LOG</div>
<h1>One little log. The whole village in it.</h1>
<p>A 3D house you can step into: every room is one feature, and every phone works.</p></div>
<div class="url">kipvillage.com</div>
<div class="card"></div>
<div class="faces"><img src="@@SAM@@"><img src="@@JUNE@@"><img src="@@NANA@@"></div>
<div class="cap">Sam, June and Nana, three of the nine in June’s village.</div>
</body></html>'''.replace('@@SAM@@', faces['sam']).replace('@@JUNE@@', faces['june']).replace('@@NANA@@', faces['nana']).replace('@@HOUSE@@', data_url(house, 'JPEG'))  # unique tokens: base64 can contain plain words

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={'width': 1200, 'height': 630})
    pg.set_content(HTML, wait_until='networkidle')
    pg.wait_for_timeout(800)
    png = os.path.join(OUT, 'og-kip-v2.png')
    pg.screenshot(path=png)
    br.close()
Image.open(png).convert('RGB').save(os.path.join(OUT, 'og-kip-v2.jpg'), quality=88, optimize=True)
print('->', os.path.join(OUT, 'og-kip-v2.jpg'))
