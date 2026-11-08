"""Joins the trailer frames into tools/trailer/out/relay-trailer-<16x9|9x16>.mp4 (30 fps, H.264).
Run from the repo root after render.js:  python3 tools/trailer/make.py"""
import os, subprocess
R = os.path.dirname(os.path.abspath(__file__)); os.makedirs(os.path.join(R, "out"), exist_ok=True)
# scene, seconds on screen, crossfade into the next one
SEQ = [("home", 3, .5), ("load", 3.5, .5), ("ask", 3, .3), ("answer", 4.5, .5), ("pin", 3, .3),
       ("w1", 1, .15), ("w2", 1, .15), ("w3", 2, .4), ("end", 3.5, 0)]
for f, name in (("h", "16x9"), ("v", "9x16")):
    args, fl, prev, off = [], [], "0:v", 0.0
    for i, (s, d, x) in enumerate(SEQ):
        args += ["-framerate", "30", "-loop", "1", "-t", str(d + (SEQ[i-1][2] if i else 0)), "-i", os.path.join(R, "frames", f + "-" + s + ".png")]
    for i in range(1, len(SEQ)):
        off += SEQ[i-1][1]; x = SEQ[i-1][2]
        out = "v%d" % i
        fl.append("[%s][%d:v]xfade=transition=fade:duration=%s:offset=%.2f[%s]" % (prev, i, x, off - x if i > 1 else off - x, out))
        prev = out
    fl.append("[%s]fade=t=in:st=0:d=0.4,fade=t=out:st=%.2f:d=0.5,format=yuv420p[o]" % (prev, sum(d for _, d, _ in SEQ) - .5))
    tmp = os.path.join(R, "out", "tmp-" + name + ".mp4"); dst = os.path.join(R, "out", "relay-trailer-" + name + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + args + ["-filter_complex", ";".join(fl), "-map", "[o]", "-r", "30",
                    "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", tmp], check=True)
    os.replace(tmp, dst); print("wrote", dst)
