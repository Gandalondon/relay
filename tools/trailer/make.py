"""Joins the trailer frames and the two voices into tools/trailer/out/relay-trailer-<16x9|9x16>.mp4 (30 fps, H.264, AAC).
Run from the repo root after render.js:  python3 tools/trailer/make.py
Opening: the filmed home scene, the game, the filmed talk scene (anim.html), then hard cuts for the words and the lockup."""
import os, json, subprocess
R = os.path.dirname(os.path.abspath(__file__)); FR = os.path.join(R, "frames"); OUT = os.path.join(R, "out"); os.makedirs(OUT, exist_ok=True)
T = json.load(open(os.path.join(R, "audio/timing.json")))
ENC = ["-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p"]
def run(a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + a, check=True)
def words(key, lead, tail):  # (frame suffix, seconds) for each step of a spoken line
    w = T[key]["words"]; st = [lead + x[1] for x in w]; end = lead + T[key]["dur"] + tail
    seq = [("-0", st[0])] + [("-%d" % (i + 1), (st[i + 1] if i + 1 < len(st) else end) - st[i]) for i in range(len(st))]
    return seq, end
TL = json.load(open(os.path.join(FR, "timeline.json")))
def clip(f, sc):  # a filmed scene (render_anim.js) as video
    out = os.path.join(OUT, f + "-" + sc + ".mp4")
    run(["-framerate", "30", "-i", os.path.join(FR, f + "-anim-" + sc, "%05d.jpg"), "-vf", "format=yuv420p"] + ENC + [out]); return out
for f, name in (("h", "16x9"), ("v", "9x16")):
    p = lambda s: os.path.join(FR, f + "-" + s + ".png")
    HM, TK = clip(f, "home"), clip(f, "talk")
    # home, fade to the game, fade into the talk scene (the phone moving, words as they're spoken)
    A = os.path.join(OUT, "a.mp4"); X1, LOAD = 0.5, 3.4; X2 = 0.4
    run(["-i", HM, "-framerate", "30", "-loop", "1", "-t", str(LOAD), "-i", p("load"), "-i", TK, "-filter_complex",
         "[0]settb=1/30,fps=30[h];[1]settb=1/30,fps=30[l];[2]settb=1/30,fps=30[k];[h][l]xfade=transition=fade:duration=%s:offset=%.3f[x];[x][k]xfade=transition=fade:duration=%s:offset=%.3f,fade=t=in:st=0:d=0.4,format=yuv420p[o]"
         % (X1, TL["home"] - X1, X2, TL["home"] - X1 + LOAD - X2), "-map", "[o]"] + ENC + [A])
    talk_at = TL["home"] - X1 + LOAD - X2; a_len = talk_at + TL["talk"]
    # music: Jonas Blakewood "Synthwave Retro Wave" (Pixabay, free licence). Its drop (7.93 s) lands as the talk scene starts;
    # Ask. Find. Get out. fall on its beats (bar 2.22 s, beat 0.555 s), Ask on the bar at 20.02 s.
    MUSIC, MDROP, BEAT, ASK_AT = "music-jonasblakewood-synthwave-retro-wave-618632.mp3", 7.93, 0.555, 20.02
    mstart = MDROP - talk_at; pin = (ASK_AT - mstart) - a_len
    seq = [("pin", pin), ("w1", BEAT), ("w2", BEAT), ("w3", BEAT * 2)] + [("end-%d" % k, 0.05) for k in range(12)] + [("end-12", 2.8)]
    lst = os.path.join(OUT, "b.txt")
    with open(lst, "w") as L:
        for s, d in seq: L.write("file '%s'\nduration %.3f\n" % (p(s), d))
        L.write("file '%s'\n" % p(seq[-1][0]))
    B = os.path.join(OUT, "b.mp4"); run(["-f", "concat", "-safe", "0", "-i", lst, "-vf", "fps=30,format=yuv420p"] + ENC + [B]); os.remove(lst)
    total = a_len + sum(d for _, d in seq)
    cat = os.path.join(OUT, "c.txt"); open(cat, "w").write("file '%s'\nfile '%s'\n" % (A, B))
    V = os.path.join(OUT, "v.mp4"); run(["-f", "concat", "-safe", "0", "-i", cat, "-c", "copy", V])
    ben = int((talk_at + TL["B0"]) * 1000); maya = int((talk_at + TL["Y0"]) * 1000)
    tmp = os.path.join(OUT, "tmp-" + name + ".mp4"); dst = os.path.join(OUT, "relay-trailer-" + name + ".mp4")
    b0, b1 = ben / 1000, ben / 1000 + T["ben"]["dur"]; m0, m1 = maya / 1000, maya / 1000 + T["maya"]["dur"]
    duck = "if(between(t,%.2f,%.2f)+between(t,%.2f,%.2f),0.28,0.55)" % (b0 - .2, b1 + .2, m0 - .2, m1 + .2)
    run(["-i", V, "-i", os.path.join(R, "audio/ben.wav"), "-i", os.path.join(R, "audio/maya.wav"),
         "-ss", "%.2f" % mstart, "-t", "%.2f" % (total + 1), "-i", os.path.join(R, "audio", MUSIC), "-filter_complex",
         "[3]aresample=48000,volume='%s':eval=frame,afade=t=in:st=0:d=1.2,afade=t=out:st=%.2f:d=1.8[mu];"
         "[1]aresample=48000,adelay=%d|%d,volume=1.6[b];[2]aresample=48000,adelay=%d|%d,volume=1.6[m];[b][m][mu]amix=inputs=3:normalize=0,alimiter=limit=0.95,apad,atrim=0:%.2f[a]"
         % (duck, total - 1.8, ben, ben, maya, maya, total),
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", tmp])
    os.replace(tmp, dst)
    for x in (A, B, V, cat, HM, TK): os.remove(x)
    print("wrote", dst, "%.1f s" % total)
