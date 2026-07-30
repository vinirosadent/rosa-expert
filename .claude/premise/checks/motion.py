"""Measure per-frame global shift and frame-to-frame change of a clip.

Detects two distinct failure modes:
  * JITTER  - the shift series oscillates in sign at high frequency (what
              ffmpeg's zoompan produces when it rounds the crop to integers)
  * JUDDER  - consecutive frames are near-identical in runs, i.e. the slow
              motion is stepping instead of flowing
"""
import subprocess, sys, os, glob, tempfile, shutil

def frames(path, w=240, h=135):
    d = tempfile.mkdtemp()
    subprocess.run(['ffmpeg','-v','error','-y','-i',path,'-vf',f'scale={w}:{h}',
                    '-pix_fmt','gray', os.path.join(d,'f%04d.pgm')], check=True)
    out = []
    for p in sorted(glob.glob(os.path.join(d,'*.pgm'))):
        b = open(p,'rb').read()
        # P5 <w> <h> <max>\n<data>
        n, i = 0, 2
        vals = []
        while len(vals) < 3:
            while b[i:i+1].isspace(): i += 1
            if b[i:i+1] == b'#':
                while b[i:i+1] != b'\n': i += 1
                continue
            s = i
            while not b[i:i+1].isspace(): i += 1
            vals.append(int(b[s:i]))
        i += 1
        out.append((vals[0], vals[1], b[i:i+vals[0]*vals[1]]))
    shutil.rmtree(d, ignore_errors=True)
    return out

def profiles(w, h, px):
    col = [0]*w
    row = [0]*h
    for y in range(h):
        base = y*w
        r = 0
        for x in range(w):
            v = px[base+x]
            r += v
            col[x] += v
        row[y] = r
    return col, row

def best_shift(a, b, rng=4):
    """Integer shift minimising SAD, refined to sub-pixel by parabola."""
    n = len(a)
    best, bd = 0, None
    sads = {}
    for s in range(-rng, rng+1):
        lo, hi = max(0, s), min(n, n+s)
        if hi - lo < n//2: continue
        d = sum(abs(a[k]-b[k-s]) for k in range(lo, hi))/(hi-lo)
        sads[s] = d
        if bd is None or d < bd: best, bd = s, d
    if best-1 in sads and best+1 in sads:
        y0, y1, y2 = sads[best-1], sads[best], sads[best+1]
        den = (y0 - 2*y1 + y2)
        if den != 0:
            return best + 0.5*(y0-y2)/den
    return float(best)

def report(name, path):
    fs = frames(path)
    prev = None
    dx, dy, mad = [], [], []
    for (w,h,px) in fs:
        cur = profiles(w,h,px)
        if prev is not None:
            dx.append(best_shift(prev[0][0], cur[0]))
            dy.append(best_shift(prev[0][1], cur[1]))
            n = min(len(px), len(prev[1]))
            mad.append(sum(abs(px[k]-prev[1][k]) for k in range(0,n,2))/(n/2))
        prev = (cur, px)
    # sign flips in the shift series = jitter
    def flips(seq):
        s = [v for v in seq if abs(v) > 0.05]
        return sum(1 for i in range(1,len(s)) if (s[i] > 0) != (s[i-1] > 0))
    dups = sum(1 for m in mad if m < 0.08)
    print(f'--- {name}  ({len(fs)} frames)')
    print(f'    dx  range {min(dx):+.2f}..{max(dx):+.2f}   sign flips {flips(dx):3d}/{len(dx)}')
    print(f'    dy  range {min(dy):+.2f}..{max(dy):+.2f}   sign flips {flips(dy):3d}/{len(dy)}')
    print(f'    frame-to-frame change  min {min(mad):.3f}  mean {sum(mad)/len(mad):.3f}  max {max(mad):.3f}')
    print(f'    near-duplicate frames  {dups}/{len(mad)}')
    return dict(flipx=flips(dx), flipy=flips(dy), n=len(dx), dups=dups,
                mad_min=min(mad), mad_mean=sum(mad)/len(mad))

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        name, path = arg.split('=', 1)
        report(name, path)
