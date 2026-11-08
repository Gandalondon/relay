"""Estimates when each word is spoken (from the loudness of the wav), for the word-by-word captions. Writes timing.json.
The lines live here; run say.py for each first:  python3 timing.py"""
import soundfile as sf, numpy as np, json, re, os
H = os.path.dirname(os.path.abspath(__file__))
LINES = {"ben": "Hey Relay, I’m at the Village. Where’s the nearest Rocketeer?",
         "hey": "Hey Relay.", "afg": "Ask. Find. Get out.", "url": "Get Arc Relay dot app.", "ask": "I’m at the Village. Where’s the nearest Rocketeer?",
         "maya": "The nearest rocketeer spawn is about 90 metres west of you."}
def timing(wav, text):
    a, sr = sf.read(wav)
    if a.ndim > 1: a = a.mean(1)
    hop = int(sr * 0.01); e = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2)) for i in range(0, len(a) - hop, hop)])
    on = e > max(e) * 0.04; idx = np.where(on)[0]; s, t = idx[0] * 0.01, idx[-1] * 0.01
    pauses, i = [], idx[0]
    while i < idx[-1]:
        if not on[i]:
            j = i
            while j < idx[-1] and not on[j]: j += 1
            if j - i >= 10: pauses.append((i * 0.01, j * 0.01))
            i = j
        else: i += 1
    words = text.split(); phrases, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r'[,.?!]$', w): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    pp = sorted(pauses, key=lambda p: p[0] - p[1])[:len(phrases) - 1]; pp.sort()
    if len(pp) == len(phrases) - 1:
        b = [s] + [x for p in pp for x in p] + [t]; segs = [(b[2 * k], b[2 * k + 1]) for k in range(len(phrases))]
    else: phrases, segs = [words], [(s, t)]
    out = []
    for ph, (a0, a1) in zip(phrases, segs):
        L = [len(re.sub(r'\W', '', w)) + 1 for w in ph]; tot = sum(L); x = a0
        for w, l in zip(ph, L): out.append([w, round(x, 2)]); x += (a1 - a0) * l / tot
    return {"dur": round(len(a) / sr, 2), "words": out}
R = {k: timing(os.path.join(H, k + ".wav"), v) for k, v in LINES.items()}
R["hey"]["words"] = [["Hey", 0.2], ["Relay.", 0.5]]  # two short words: the loudness split misplaces them, so set by ear
json.dump(R, open(os.path.join(H, "timing.json"), "w"), indent=0)
print(open(os.path.join(H, "timing.json")).read())
