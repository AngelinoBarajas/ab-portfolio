from playwright.sync_api import sync_playwright
SHOTS = [("home","https://barajasdsgn.com/",0),("work","https://barajasdsgn.com/work",0),("obs","https://barajasdsgn.com/observatory",0),("about","https://barajasdsgn.com/about",0),("process","https://barajasdsgn.com/process",0)]
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=angle","--enable-gpu"])
    for name,url,y in SHOTS:
        pg = b.new_page(viewport={"width":1440,"height":900}, device_scale_factor=2)
        pg.goto(url, wait_until="networkidle"); pg.wait_for_timeout(5000)
        pg.mouse.move(900,450); pg.wait_for_timeout(1500)
        pg.screenshot(path=f"{name}.png")
        pg.close()
    b.close()
