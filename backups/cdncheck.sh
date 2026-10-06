cd X:/Claude-Skills/ab-portfolio/code/dist
until [ "$(curl -s -o /dev/null -w '%{http_code}' https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.30.7/code/package.json)" = 200 ]; do sleep 5; done
for f in ab-process.prod.js; do curl -s "https://purge.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.30.7/code/dist/$f" >/dev/null; done
for f in ab-process.prod.js; do h="sha384-$(curl -s "https://cdn.jsdelivr.net/gh/AngelinoBarajas/ab-portfolio@v0.30.7/code/dist/$f" | openssl dgst -sha384 -binary | base64 -w0)"; e=$(python -c "import json;print(json.load(open('sri.json'))['$f'])"); [ "$h" = "$e" ] && echo "OK $f $e" || echo "MISMATCH $f"; done
