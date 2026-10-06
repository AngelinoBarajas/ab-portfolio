import re, pathlib
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent
svg = (HERE.parent.parent / "logo" / "AB Logo v2.svg").read_text(encoding="utf-8")
MARK = re.sub(r"<defs>.*?</defs>", "", svg, flags=re.S).replace('class="cls-1"', 'fill="#F2F0EA"').replace('class="cls-2"', 'fill="#f36c42"')
def win(img, cls, url):
    return f'''<div class="win {cls}"><div class="bar"><i></i><i></i><i></i><span>{url}</span></div><img src="{img}.png"></div>'''
html = f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0}}
body{{width:1650px;height:600px;overflow:hidden;background:#07080f;font-family:"Archivo",sans-serif;color:#F2F0EA;position:relative}}
.sky{{position:absolute;inset:0;background:
 radial-gradient(60% 70% at 78% 55%,rgba(124,92,255,.28),transparent 70%),
 radial-gradient(40% 50% at 10% 100%,rgba(255,106,61,.16),transparent 70%)}}
.stars{{position:absolute;inset:0}}
.copy{{position:absolute;left:80px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center;z-index:5}}
.mark svg{{width:110px;height:auto;display:block;margin-bottom:30px}}
.eb{{font-family:"JetBrains Mono",monospace;font-size:16px;letter-spacing:.18em;text-transform:uppercase;color:#c9c6bd;display:flex;align-items:center;gap:14px;margin-bottom:18px}}
.eb b{{width:10px;height:10px;border-radius:50%;background:#FF6A3D;box-shadow:0 0 14px #FF6A3D}}
h1{{font-weight:900;font-stretch:125%;text-transform:uppercase;font-size:60px;line-height:.92;letter-spacing:-.01em}}
h1 .o{{color:transparent;-webkit-text-stroke:2px #F2F0EA}}
h1 .a{{color:#FF6A3D}}
.url{{margin-top:28px;font-family:"JetBrains Mono",monospace;font-size:20px;color:#F2F0EA;display:inline-flex;align-items:center;gap:14px;border:1px solid rgba(242,240,234,.25);padding:11px 18px;align-self:flex-start;background:rgba(14,16,32,.6)}}
.url span{{color:#FF6A3D}}
.stage{{position:absolute;left:640px;top:0;width:1010px;height:600px;perspective:2200px}}
.win{{position:absolute;width:880px;border-radius:12px;overflow:hidden;background:#0e1020;border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 90px rgba(0,0,0,.7),0 0 0 1px rgba(0,0,0,.4)}}
.win img{{display:block;width:100%}}
.bar{{height:34px;display:flex;align-items:center;gap:8px;padding:0 14px;background:#141629;border-bottom:1px solid rgba(255,255,255,.08)}}
.bar i{{width:11px;height:11px;border-radius:50%;background:#3a3d55}}
.bar i:first-child{{background:#FF6A3D}}
.bar span{{margin-left:14px;font-family:"JetBrains Mono",monospace;font-size:13px;color:#9a98a8}}
.w1{{left:40px;top:150px;width:720px;transform:rotateY(-12deg) rotateX(2deg);z-index:4}}
.w2{{left:420px;top:40px;width:640px;transform:rotateY(-12deg) rotateX(2deg) scale(.9);z-index:3;filter:brightness(.62)}}
.fade{{position:absolute;inset:0;background:linear-gradient(90deg,#07080f 0%,#07080f 36%,rgba(7,8,15,0) 46%),linear-gradient(0deg,rgba(7,8,15,.9),transparent 22%);z-index:4;pointer-events:none}}
</style></head><body>
<div class="sky"></div><canvas class="stars" id="s" width="3300" height="1200"></canvas>
<div class="stage">{win("about_crop","w2","barajasdsgn.com/about")}{win("home","w1","barajasdsgn.com")}</div>
<div class="fade"></div>
<div class="copy">
 <div class="mark">{MARK}</div>
 <div class="eb"><b></b>Just launched · Built in Webflow</div>
 <h1>My new<br><span class="o">portfolio</span><br><span class="a">is live.</span></h1>
 <div class="url"><span>→</span> barajasdsgn.com</div>
</div>
<script>
const c=document.getElementById('s'),x=c.getContext('2d');let r=7;const R=()=>(r=(r*9301+49297)%233280)/233280;
for(let i=0;i<520;i++){{x.fillStyle='rgba(242,240,234,'+(.15+R()*.6)+')';const s=R()<.08?2.6:1.3;x.fillRect(R()*3300,R()*1200,s,s);}}
</script></body></html>'''
(HERE/"banner.html").write_text(html, encoding="utf-8")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width":1650,"height":600}, device_scale_factor=2)
    pg.goto((HERE/"banner.html").as_uri(), wait_until="networkidle"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(800)
    pg.screenshot(path=str(HERE/"ab-portfolio-forum-banner@2x.png")); b.close()
from PIL import Image
im = Image.open(HERE/"ab-portfolio-forum-banner@2x.png").convert("RGB")
im.save(HERE/"ab-portfolio-forum-banner@2x.jpg", quality=90)
im.resize((1650,600), Image.LANCZOS).save(HERE/"ab-portfolio-forum-banner.jpg", quality=90)
