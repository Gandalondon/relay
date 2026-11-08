"""Trailer B, type-led (8 Nov): out/relay-trailer-<b1|b2>-<16x9|9x16>.mp4.
Run:  PAGE=type SCENES=hey,ask,answer,afg,afg2,legal,end ALPHA=afg,afg2,legal node tools/trailer/render_anim.js
then: GAME=tools/trailer/game/<clip>.mp4 python3 tools/trailer/make_b.py   (VER=b1 or b2; both by default)
Order (Tony, 8 Nov): Hey Relay (Ben, big type) / Ben's question / Relay's answer (Maya), same size and place, on the
music's drop / game, one take: the map, the cursor moves and drops a pin, then running / the ending. The legal line is
on every frame.
B1: Ask. Find. Get out. all at once over the run under a flat 10% black, then the end card (address said there).
B2: Ask. Find. Get out. over greyscale gameplay under ink, the phone straight on at the right, then getarcrelay.app
(said) under the words; a 0.2 s fade to the end card.
C: no gameplay at all. After the answer, Ask. / Find. / Get out. on the plain background with the phone on its home
greeting, the same beats as B2, then the end card (address said there, as in B2).
D: C with an opening: the app's mic button centred, tapped, its listening rings, a quick fade, then Hey Relay.
E (Tony, 8 Nov): a bigger mic button, tapped; Hey Relay is heard over the listening rings (no Hey Relay card); a hard cut to
the question, the answer, C's end frame, the end card. About 16 s.
E, 8 Nov evening (Tony): the mic behaves exactly as in the app: the icon swaps to the still waveform and only the halo
rings breathe (no bounce, press or tap circle). C's end frame cut to 3.0 s and the end card to 4.0 s (less hold).
F (Tony, 8 Nov): E without the mic: Hey Relay as big bold type (cut to 1.6 s), then E's question, answer and ending.
All end cards: the folio lockup at Sniff's end-card size, the Play badge bottom right, Google's trademark line.
Game clip windows (seconds into GAME) are in CUTS; the 9:16 version crops the middle of the 16:9 footage."""
import os, json, subprocess
R = os.path.dirname(os.path.abspath(__file__)); FR = os.path.join(R, "frames"); OUT = os.path.join(R, "out"); A = os.path.join(R, "audio")
GAME = os.environ.get("GAME", os.path.join(R, "game", "test-buried-city.mp4"))
CUTS = {"game": (1.05, 5.0)}  # test clip: map from ~1 s, cursor pans, waypoint drops ~3.1 s, running from 3.75 s; the ending carries on
TL = json.load(open(os.path.join(FR, "type-timeline.json")))
ENC = ["-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p"]
def run(a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + a, check=True)
# music at 12% (Tony, 8 Nov evening: was 18%, voices hard to hear)
MUSIC, MDROP = "music-jonasblakewood-synthwave-retro-wave-618632.mp3", 7.93
if os.environ.get("MUSIC") == "mountain": MUSIC, MDROP = "music-the_mountain-synthwave-593074.mp3", float(os.environ.get("MDROP", "0"))  # Tony, 8 Nov
os.makedirs(OUT, exist_ok=True)

def build(VER, f, name, W, H):
    fit = "scale=%d:%d:force_original_aspect_ratio=increase:flags=lanczos,crop=%d:%d,setsar=1,fps=30" % (W, H, W, H)
    def clip(sc, skip=0, keep=None):  # skip: frames dropped from the start (D trims the Hey Relay card's lead-in after the mic); keep: seconds kept
        o = os.path.join(OUT, "b-%s-%s.mp4" % (f, sc)); d = keep or TL[sc] - skip / 30
        run(["-framerate", "30", "-start_number", str(1 + skip), "-i", os.path.join(FR, "%s-type-%s" % (f, sc), "%05d.jpg"), "-frames:v", str(round(d * 30)), "-vf", "settb=1/30,format=yuv420p"] + ENC + [o]); return o, d
    def game(tag, start, d, over, grey=False, fadeout=0):  # a window of the game clip under a clear-background overlay
        o = os.path.join(OUT, "b-%s-%s.mp4" % (f, tag))
        vf = "[0:v]%s%s[g];[g][1:v]overlay=shortest=0:eof_action=repeat,trim=duration=%.3f,format=yuv420p" % (fit, ",hue=s='max(0,1-t/0.2)'" if grey else "", d)  # colour drains in 0.2 s with the overlay
        if fadeout: vf += ",fade=t=out:st=%.3f:d=%.3f:color=0x1C1E22" % (d - fadeout, fadeout)
        run(["-ss", "%.3f" % start, "-t", "%.3f" % d, "-i", GAME, "-framerate", "30", "-loop", "1" if over == "legal" else "0",
             "-i", os.path.join(FR, "%s-type-%s" % (f, over), "%05d.png"), "-filter_complex", vf, "-an"] + ENC + [o])
        return o, d
    g0, gd = CUTS["game"]
    HSKIP = 10 if VER == "d" else 0  # 0.33 s
    ASKIP, MSKIP = (12, 9) if VER in ("e", "f") else (0, 0)  # E: the question and answer start on their first word, right on the cut
    if VER == "e": seq = [("mic", clip("mic2")), ("ask", clip("ask", ASKIP)), ("answer", clip("answer", MSKIP))]
    elif VER == "f": seq = [("hey", clip("hey", keep=1.6)), ("ask", clip("ask", ASKIP)), ("answer", clip("answer", MSKIP))]
    else: seq = ([("mic", clip("mic"))] if VER == "d" else []) + [("hey", clip("hey", HSKIP)), ("ask", clip("ask")), ("answer", clip("answer"))]
    if VER in ("c", "d", "e", "f"): seq += [("afg", clip("afg3")), ("end", clip("end"))]
    else: seq += [("game", game("game", g0, gd, "legal"))]
    if VER in ("c", "d", "e", "f"): pass
    elif VER == "b1": seq += [("afg", game("afg", g0 + gd, TL["afg"], "afg")), ("end", clip("end"))]
    else: seq += [("afg", game("afg2", g0 + gd, TL["afg2"], "afg2", grey=True, fadeout=.2)), ("end", clip("end"))]
    at, t = {}, 0.0
    for k, (p, d) in seq: at[k] = t; t += d
    total = t
    lst = os.path.join(OUT, "b.txt"); open(lst, "w").write("".join("file '%s'\n" % p for _, (p, _) in seq))
    V = os.path.join(OUT, "b-v.mp4"); run(["-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", V])
    Vt = TL["V"]
    url_at = at["end"] + Vt["url"] if VER == "b1" else at["afg"] + Vt["url2"]
    HEY_AT = at["mic"] + .72 - .34 if VER == "e" else at["hey"] + Vt["hey"] - HSKIP / 30  # E: heard just after the tap (onset .34 s)
    voices = [("hey.wav", HEY_AT), ("ask.wav", at["ask"] + Vt["ask"] - ASKIP / 30), ("maya.wav", at["answer"] + Vt["maya"] - MSKIP / 30)]
    if VER == "b1": voices += [("afg.wav", at["afg"] + Vt["afg"]), ("url.wav", url_at)]
    else:  # B2 and C: Maya's Ask. / Find. / Get out. cut from afg.wav and spaced to the beats; each placed so its first sound lands on its word
        AF = TL["AF"]; ON = {"afg-ask.wav": .12, "afg-find.wav": .10, "afg-getout.wav": .065, "url.wav": .29}
        sh = AF["ask"] if VER in ("c", "d", "e", "f") else 0  # C starts on Ask. (no overlay fade)
        voices += [(w, at["afg"] + AF[k] - sh - ON[w]) for w, k in (("afg-ask.wav", "ask"), ("afg-find.wav", "find"), ("afg-getout.wav", "out"))]
        voices += [("url.wav", at["end"] + TL["ENDURL"] - ON["url.wav"])]  # said once the end card's name and address are in
    ins, fl = ["-i", V], []
    for i, (w, s) in enumerate(voices, 1):
        ins += ["-i", os.path.join(A, w)]; d = int(s * 1000); fl.append("[%d]aresample=48000,adelay=%d|%d,volume=1.8[v%d]" % (i, d, d, i))
    lead = MDROP - at["answer"]  # the music's drop lands on Relay's answer
    mi = len(voices) + 1
    if lead >= 0: ins += ["-ss", "%.3f" % lead, "-i", os.path.join(A, MUSIC)]; mdel = 0
    else: ins += ["-i", os.path.join(A, MUSIC)]; mdel = int(-lead * 1000)
    fl.append("[%d]aresample=48000,adelay=%d|%d,volume=0.12,afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=1.6[mu]" % (mi, mdel, mdel, total - 1.6))
    fl.append("".join("[v%d]" % i for i in range(1, len(voices) + 1)) + "[mu]amix=inputs=%d:normalize=0,alimiter=limit=0.95,apad,atrim=0:%.2f[a]" % (len(voices) + 1, total))
    tmp = os.path.join(OUT, "tmp-b.mp4"); dst = os.path.join(OUT, "relay-trailer-%s-%s%s.mp4" % (VER, name, "-mountain" if os.environ.get("MUSIC") == "mountain" else ""))
    run(ins + ["-filter_complex", ";".join(fl), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", tmp])
    os.replace(tmp, dst)
    for x in [p for _, (p, _) in seq] + [V, lst]: os.remove(x)
    print("wrote", dst, "%.1f s" % total, {k: round(v, 2) for k, v in at.items()})

for VER in os.environ.get("VER", "b1,b2").split(","):
    for f, name, (W, H) in [x for x in (("h", "16x9", (1920, 1080)), ("v", "9x16", (1080, 1920))) if x[0] in os.environ.get("FMT", "h,v")]:
        build(VER, f, name, W, H)
