"""Turns tools/captures/out/*.png (from capture.js) into every output that shows the app (7 Nov 2026):
- site/beta/screens/relay-*.webp and the homepage phones (placeholders replaced)
- www/onboard-find.webp, www/onboard-exit.webp (onboarding pictures, the map only)
- marketing/portfolio/relay-*.png (1125 x 2436, no frame), then tools/portfolio/phones.py for relay_app.png
Run from the repo root after capture.js: python3 tools/captures/publish.py"""
import json, os, re, shutil, subprocess
from PIL import Image

R = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
OUT = os.path.join(R, "tools/captures/out")
rects = json.load(open(os.path.join(OUT, "rects.json")))
shot = lambda s: Image.open(os.path.join(OUT, s + ".png")).convert("RGB")

# 1. site: homepage phones, 2x (750 wide)
SITE = {  # placeholder text on the page -> scene, alt text
    "Answer: nearest Bastion, about 90 m east. One dot on the map.": ("find", "Relay answers: Nearest Bastion, north-east. The Dam map shows you at the Scrap Yard and one dot on the nearest Bastion."),
    "Answer: nearest exit, which way and how far.": ("exit", "Relay answers: Eastern Station, north-west. On the Buried City map, a dashed line runs from you to the exit."),
    "Listening: Hey Relay, go ahead.": ("listening", "Relay listening: Go ahead."),
    "Answer: quest step, with the spot on the map.": ("quest", "Relay answers: Security office desk papers. Snap and Salvage, step 2, with the spot on the Stella Montis map."),
}
sd = os.path.join(R, "site/beta/screens"); os.makedirs(sd, exist_ok=True)
for ph, (s, alt) in SITE.items():
    shot(s).resize((750, 1624), Image.LANCZOS).save(os.path.join(sd, "relay-" + s + ".webp"), quality=86, method=6)
p = os.path.join(R, "site/beta/index.html"); h = open(p).read()
for ph, (s, alt) in SITE.items():
    h = h.replace('<div class="ph"><span>' + ph + '</span></div>',
                  '<img src="screens/relay-' + s + '.webp" alt="' + alt + '" loading="lazy" decoding="async">')
open(p, "w").write(h)
print("site: placeholders left", h.count('class="ph"'))

# 2. onboarding: the map tile only, 684 x 962
def mapcrop(s, size=(684, 962)):
    r = rects[s]; im = shot(s); k = im.width / 375
    box = [round(v * k) for v in (r["x"], r["y"], r["x"] + r["w"], r["y"] + r["h"])]
    m = im.crop(box); tw, th = size
    sc = max(tw / m.width, th / m.height); m = m.resize((round(m.width * sc), round(m.height * sc)), Image.LANCZOS)
    l, t = (m.width - tw) // 2, 0
    return m.crop((l, t, l + tw, t + th))
ONB = {"onboard-find": ("loot", "The map: you at the Wharf, one dot on the nearest apricot tree"),
       "onboard-exit": ("exit", "The map: a dashed line from you to the nearest exit")}
p = os.path.join(R, "www/index.html"); h = open(p).read()
for f, (s, alt) in ONB.items():
    mapcrop(s).save(os.path.join(R, "www", f + ".webp"), quality=86, method=6)
h = re.sub(r'<div class="obph">Image: the map, you at the Village[^<]*</div>', '<img src="onboard-find.webp" alt="' + ONB["onboard-find"][1] + '">', h)
h = re.sub(r'<div class="obph">Image: the map, you under fire[^<]*</div>', '<img src="onboard-exit.webp" alt="' + ONB["onboard-exit"][1] + '">', h)
open(p, "w").write(h)
print("onboarding: placeholders left", h.count('class="obph"'))

# 3. portfolio: full screens, no frame, then the framed row
PD = os.path.join(R, "marketing/portfolio")
for f in os.listdir(PD):
    if re.match(r"relay-\d-.*\.png$", f): os.remove(os.path.join(PD, f))
for i, s in enumerate(["listening", "find", "exit", "loot"], 1):
    shutil.copy(os.path.join(OUT, s + ".png"), os.path.join(PD, "relay-%d-%s.png" % (i, s)))
shutil.copy(os.path.join(OUT, "whole.png"), os.path.join(PD, "relay-whole-map.png"))
subprocess.run(["python3", os.path.join(R, "tools/portfolio/phones.py")], check=True)
