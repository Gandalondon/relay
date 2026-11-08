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
    seq = [("pin", 2.5), ("w1", 0.4), ("w2", 0.4), ("w3", 0.8)] + [("end-%d" % k, 0.05) for k in range(12)] + [("end-12", 2.8)]
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
    run(["-i", V, "-i", os.path.join(R, "audio/ben.wav"), "-i", os.path.join(R, "audio/maya.wav"), "-filter_complex",
         "[1]adelay=%d|%d[b];[2]adelay=%d|%d[m];[b][m]amix=inputs=2:normalize=0,apad,atrim=0:%.2f[a]" % (ben, ben, maya, maya, total),
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", tmp])
    os.replace(tmp, dst)
    for x in (A, B, V, cat, HM, TK): os.remove(x)
    print("wrote", dst, "%.1f s" % total)
