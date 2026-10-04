"""Topicweave mission cover (1600x1000 webp) + social image (1200x630 jpg), screenshotted from the v3 site's own code
(cks-v3 served locally, loom intro settled, cookie notice dismissed). Output: og/out/topicweave-cover.webp, og/out/og-topicweave.jpg"""
import subprocess, time, sys, os
from playwright.sync_api import sync_playwright
V3 = r'X:/Claude-Skills/case-study-sites/cks-v3'
port = 8771
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(OUT, exist_ok=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port)], cwd=V3, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
try:
    with sync_playwright() as p:
        br = p.chromium.launch(channel='chrome', headless=True)
        for name, vw, vh, dsf, wait in [('cover', 1280, 800, 1.25, 9), ('og', 1200, 630, 1, 9)]:
            pg = br.new_page(viewport={'width': vw, 'height': vh}, device_scale_factor=dsf)
            pg.add_init_script("try{localStorage.setItem('tw-cookies','1')}catch(e){}")
            pg.goto('http://localhost:%d/index.html' % port, wait_until='load')
            time.sleep(wait)
            pg.screenshot(path=os.path.join(OUT, 'tw-%s.png') % name)
            pg.close()
        br.close()
finally:
    srv.terminate()
from PIL import Image
Image.open(os.path.join(OUT, 'tw-cover.png')).convert('RGB').save(os.path.join(OUT, 'topicweave-cover.webp'), quality=86, method=6)
Image.open(os.path.join(OUT, 'tw-og.png')).convert('RGB').save(os.path.join(OUT, 'og-topicweave.jpg'), quality=88, optimize=True, progressive=True)
