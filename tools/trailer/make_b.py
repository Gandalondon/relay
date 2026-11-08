"""Version B, type-led (8 Nov): out/relay-trailer-b-<16x9|9x16>.mp4. Run render.js, then PAGE=type SCENES=hey,ask,reply,afg,end render_anim.js, then this.
Hey Relay (spoken), the game (opening the map), the question in big type as it's spoken, the phone sweeps in with Relay's answer,
the game (pin and run), Ask. Find. Get out. said by Relay, the end lockup with the address said."""
import os, json, subprocess
R = os.path.dirname(os.path.abspath(__file__)); FR = os.path.join(R, "frames"); OUT = os.path.join(R, "out"); A = os.path.join(R, "audio")
TL = json.load(open(os.path.join(FR, "type-timeline.json")))
ENC = ["-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p"]
def run(a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + a, check=True)
MUSIC, MDROP = "music-jonasblakewood-synthwave-retro-wave-618632.mp3", 7.93
for f, name in (("h", "16x9"), ("v", "9x16")):
    parts, at, t = [], {}, 0.0
    def clip(sc):
        o = os.path.join(OUT, "b-%s-%s.mp4" % (f, sc))
        run(["-framerate", "30", "-i", os.path.join(FR, "%s-type-%s" % (f, sc), "%05d.jpg"), "-vf", "settb=1/30,format=yuv420p"] + ENC + [o]); return o, TL[sc]
    def still(png, d, tag):
        o = os.path.join(OUT, "b-%s-%s.mp4" % (f, tag))
        run(["-framerate", "30", "-loop", "1", "-t", "%.3f" % d, "-i", os.path.join(FR, f + "-" + png + ".png"), "-vf", "format=yuv420p"] + ENC + [o]); return o, d
    seq = [("hey", clip("hey")), ("map", still("load", 3.0, "map")), ("ask", clip("ask")), ("reply", clip("reply")),
           ("pin", still("pin", 2.3, "pin")), ("afg", clip("afg")), ("end", clip("end"))]
    for k, (p, d) in seq: at[k] = t; t += d
    total = t
    lst = os.path.join(OUT, "b.txt"); open(lst, "w").write("".join("file '%s'\n" % p for _, (p, _) in seq))
    V = os.path.join(OUT, "b-v.mp4"); run(["-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", V])
    Vt = TL["V"]
    voices = [("hey.wav", at["hey"] + Vt["hey"]), ("ask.wav", at["ask"] + Vt["ask"]), ("maya.wav", at["reply"] + Vt["maya"]),
              ("afg.wav", at["afg"] + Vt["afg"]), ("url.wav", at["end"] + Vt["url"])]
    ins, fl = ["-i", V], []
    for i, (w, s) in enumerate(voices, 1):
        ins += ["-i", os.path.join(A, w)]; d = int(s * 1000); fl.append("[%d]aresample=48000,adelay=%d|%d,volume=1.8[v%d]" % (i, d, d, i))
    lead = MDROP - at["reply"]  # the music's drop lands as the phone sweeps in
    mi = len(voices) + 1
    if lead >= 0: ins += ["-ss", "%.2f" % lead, "-i", os.path.join(A, MUSIC)]; mdel = 0
    else: ins += ["-i", os.path.join(A, MUSIC)]; mdel = int(-lead * 1000)
    fl.append("[%d]aresample=48000,adelay=%d|%d,volume=0.3,afade=t=in:st=0:d=0.6,afade=t=out:st=%.2f:d=1.6[mu]" % (mi, mdel, mdel, total - 1.6))
    fl.append("".join("[v%d]" % i for i in range(1, len(voices) + 1)) + "[mu]amix=inputs=%d:normalize=0,alimiter=limit=0.95,apad,atrim=0:%.2f[a]" % (len(voices) + 1, total))
    tmp = os.path.join(OUT, "tmp-b.mp4"); dst = os.path.join(OUT, "relay-trailer-b-" + name + ".mp4")
    run(ins + ["-filter_complex", ";".join(fl), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", tmp])
    os.replace(tmp, dst)
    for x in [p for _, (p, _) in seq] + [V, lst]: os.remove(x)
    print("wrote", dst, "%.1f s" % total)
