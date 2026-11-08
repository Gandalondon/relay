"""Builds src/docs/style-guide.html from template.html: embeds Inter Tight and the app's icons, so the guide opens offline.
Run from the repo root:  python3 tools/style-guide/make.py"""
import base64, json, os, re
R = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(R))
t = open(os.path.join(R, "template.html")).read()
faces = "".join('@font-face{font-family:"Inter Tight";font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}\n'
                % (w, base64.b64encode(open(os.path.join(ROOT, "www/fonts/inter-tight-%d.woff2" % w), "rb").read()).decode()) for w in (400, 500, 600, 700))
app = open(os.path.join(ROOT, "www/index.html")).read()
def grab(pat):
    m = re.search(pat, app, flags=re.S)
    if not m: raise SystemExit("icon not found in www/index.html: " + pat)
    return m.group(1)
icons = {
    "mic": grab(r'<svg class="mc"[^>]*><path d="([^"]+)"'),
    "wave": grab(r'<svg class="wv"[^>]*><path d="([^"]+)"'),
    "close": grab(r'id="close"[^>]*><svg[^>]*><path d="([^"]+)"'),
    "cog": grab(r'id="cog"[^>]*><svg[^>]*><path d="([^"]+)"'),
    "back": grab(r'id="setback"[^>]*><svg[^>]*><path d="([^"]+)"'),
    "play": grab(r"const PLAY_ICON = '<svg[^>]*><path d=\"([^\"]+)\""),
}
for k, f in (("map", "map"), ("pin", "my_location"), ("whole", "zoom_out_map"), ("route", "route"), ("shaft", "mode_fan"), ("hatch", "download"), ("arrow_outward", "arrow_outward")):
    icons[k] = re.search(r'<path d="([^"]+)"', open(os.path.join(R, "icons", f + ".svg")).read()).group(1)
t = t.replace("{{FONTS}}", faces)
t = re.sub(r"\{\{I:(\w+)\}\}", lambda m: '<svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="%s"/></svg>' % icons[m.group(1)], t)
# clear route (7 Nov): a whole masked SVG, so it is taken from the app as is; each copy gets its own mask id
routeoff = re.search(r"routeOff: '(<svg.*?</svg>)'", app, flags=re.S).group(1)
n = [0]
def ro(_):
    n[0] += 1
    return routeoff.replace("rtoff", "rtoff%d" % n[0])
t = re.sub(r"\{\{SVG:routeOff\}\}", ro, t)
assert "{{" not in t
os.makedirs(os.path.join(ROOT, "src/docs"), exist_ok=True)
open(os.path.join(ROOT, "src/docs/style-guide.html"), "w").write(t)
print("wrote src/docs/style-guide.html", len(t) // 1024, "KB")
