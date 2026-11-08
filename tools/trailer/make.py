"""Joins the trailer frames and the two voices into tools/trailer/out/relay-trailer-<16x9|9x16>.mp4 (30 fps, H.264, AAC).
Run from the repo root after render.js:  python3 tools/trailer/make.py
Opening: crossfades (home, game, phone). From the first spoken word on: hard cuts, words appear as they're spoken."""
import os, json, subprocess
R = os.path.dirname(os.path.abspath(__file__)); FR = os.path.join(R, "frames"); OUT = os.path.join(R, "out"); os.makedirs(OUT, exist_ok=True)
T = json.load(open(os.path.join(R, "audio/timing.json")))
ENC = ["-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p"]
def run(a): subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + a, check=True)
def words(key, lead, tail):  # (frame suffix, seconds) for each step of a spoken line
    w = T[key]["words"]; st = [lead + x[1] for x in w]; end = lead + T[key]["dur"] + tail
    seq = [("-0", st[0])] + [("-%d" % (i + 1), (st[i + 1] if i + 1 < len(st) else end) - st[i]) for i in range(len(st))]
    return seq, end
for f, name in (("h", "16x9"), ("v", "9x16")):
    p = lambda s: os.path.join(FR, f + "-" + s + ".png")
    # A: home, fade to game, fade to the listening phone (ends as Ben starts)
    A = os.path.join(OUT, "a.mp4")
    run(["-framerate", "30", "-loop", "1", "-t", "3.0", "-i", p("home"), "-framerate", "30", "-loop", "1", "-t", "3.4", "-i", p("load"),
         "-framerate", "30", "-loop", "1", "-t", "0.7", "-i", p("ask-0"), "-filter_complex",
         "[0][1]xfade=transition=fade:duration=0.5:offset=2.5[x];[x][2]xfade=transition=fade:duration=0.4:offset=5.5,fade=t=in:st=0:d=0.4,format=yuv420p[o]",
         "-map", "[o]"] + ENC + [A])
    a_len = 6.2
    ask, ask_len = words("ben", 0, 0.4)
    ans, ans_len = words("maya", 0.25, 0.8)
    seq_ask = [("ask" + s, d) for s, d in ask]
    seq_rest = [("answer" + s, d) for s, d in ans] + [("pin", 2.5), ("w1", 0.4), ("w2", 0.4), ("w3", 0.8)] + \
               [("end-%d" % k, 0.05) for k in range(12)] + [("end-12", 2.8)]
    def part(seq, name_):
        lst = os.path.join(OUT, name_ + ".txt")
        with open(lst, "w") as L:
            for s, d in seq: L.write("file '%s'\nduration %.3f\n" % (p(s), max(d, 1 / 30)))
            L.write("file '%s'\n" % p(seq[-1][0]))
        out = os.path.join(OUT, name_ + ".mp4"); run(["-f", "concat", "-safe", "0", "-i", lst, "-vf", "fps=30,format=yuv420p"] + ENC + [out]); os.remove(lst)
        return out, sum(d for _, d in seq)
    B1, l1 = part(seq_ask, "b1"); B2, l2 = part(seq_rest, "b2")
    XF = 0.2  # the app fades .2 s between listening and the answer
    B = os.path.join(OUT, "b.mp4")
    run(["-i", B1, "-i", B2, "-filter_complex", "[0][1]xfade=transition=fade:duration=%s:offset=%.3f,format=yuv420p[o]" % (XF, l1 - XF), "-map", "[o]"] + ENC + [B])
    os.remove(B1); os.remove(B2)
    seq = [(None, l1 + l2 - XF)]; ask_len = l1 - XF
    total = a_len + sum(d for _, d in seq)
    cat = os.path.join(OUT, "c.txt"); open(cat, "w").write("file '%s'\nfile '%s'\n" % (A, B))
    V = os.path.join(OUT, "v.mp4"); run(["-f", "concat", "-safe", "0", "-i", cat, "-c", "copy", V])
    ben = int(a_len * 1000); maya = int((a_len + ask_len + 0.25) * 1000)
    tmp = os.path.join(OUT, "tmp-" + name + ".mp4"); dst = os.path.join(OUT, "relay-trailer-" + name + ".mp4")
    run(["-i", V, "-i", os.path.join(R, "audio/ben.wav"), "-i", os.path.join(R, "audio/maya.wav"), "-filter_complex",
         "[1]adelay=%d|%d[b];[2]adelay=%d|%d[m];[b][m]amix=inputs=2:normalize=0,apad,atrim=0:%.2f[a]" % (ben, ben, maya, maya, total),
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", tmp])
    os.replace(tmp, dst)
    for x in (A, B, V, cat): os.remove(x)
    print("wrote", dst, "%.1f s" % total)
