"""Audit a keyframe against the two crops the page actually applies.

The stage is object-fit:cover, so a wide viewport shows only the central
slice of a 16:9 frame.  On top of that a horizontal scrim washes the left
side to ivory so the copy stays legible.  A stratum only counts if it
survives BOTH.
"""
import subprocess, sys, os, tempfile, shutil

W, H = 480, 270

def rgb(path):
    d = tempfile.mkdtemp()
    out = os.path.join(d, 'x.ppm')
    subprocess.run(['ffmpeg','-v','error','-y','-i',path,'-vf',
                    f'crop=2731:1536:10:0,scale={W}:{H}','-pix_fmt','rgb24',out], check=True)
    b = open(out,'rb').read()
    vals, i = [], 2
    while len(vals) < 3:
        while b[i:i+1].isspace(): i += 1
        s = i
        while not b[i:i+1].isspace(): i += 1
        vals.append(int(b[s:i]))
    i += 1
    px = b[i:]
    shutil.rmtree(d, ignore_errors=True)
    return px

def px_at(px, x, y):
    o = (y*W + x)*3
    return px[o], px[o+1], px[o+2]

# scrim opacity of ivory over the picture, from the 96deg gradient in the CSS
SCRIM = [(0.00,1.00),(0.26,0.96),(0.40,0.74),(0.55,0.20),(0.68,0.00),(1.00,0.00)]
def scrim_at(fx):
    for k in range(len(SCRIM)-1):
        x0,a0 = SCRIM[k]; x1,a1 = SCRIM[k+1]
        if x0 <= fx <= x1:
            t = 0 if x1==x0 else (fx-x0)/(x1-x0)
            return a0 + t*(a1-a0)
    return 0.0

def audit(name, path, aspect=2.38):
    px = rgb(path)
    # object-fit: cover on a 16:9 source shown in an `aspect`:1 box.
    # A stage WIDER than 16:9 crops the height; a stage NARROWER than 16:9
    # crops the width and shows the full height.
    keep_y = min(1.0, (16/9) / aspect)
    keep_x = min(1.0, aspect / (16/9))
    y0 = int(round(H*(1-keep_y)/2)); y1 = H - y0
    x0 = int(round(W*(1-keep_x)/2)); x1 = W - x0
    print(f'=== {name}')
    print(f'    crop {aspect:.2f}:1 shows {keep_y*100:.0f}% of the height '
          f'(rows {y0}-{y1}) and {keep_x*100:.0f}% of the width (cols {x0}-{x1})')
    bands = [('warm  top   15-45%', .15, .45),
             ('lattice mid 42-62%', .42, .62),
             ('foam  low  58-88%', .58, .88)]
    for label, a, b in bands:
        ya, yb = int(H*a), int(H*b)
        vis_a, vis_b = max(ya,y0), min(yb,y1)
        if vis_b <= vis_a:
            print(f'    {label}: CROPPED AWAY ENTIRELY'); continue
        # warmth weighted by how much of the picture the scrim lets through
        tot_w = tot_n = 0.0
        clear_w = clear_n = 0.0
        for y in range(vis_a, vis_b, 2):
            for x in range(x0, x1, 2):
                r,g,b_ = px_at(px, x, y)
                warm = r - b_
                # the scrim gradient is laid over the VISIBLE box, so its
                # position must be measured across the crop, not the frame
                vis = 1 - scrim_at((x-x0)/(x1-x0))
                tot_w += warm*vis; tot_n += vis
                if (x-x0)/(x1-x0) >= 0.60:
                    clear_w += warm; clear_n += 1
        lost = 100*(1-(vis_b-vis_a)/(yb-ya))
        print(f'    {label}: {lost:4.0f}% of band cropped | '
              f'warmth as seen {tot_w/tot_n:+6.1f} | in clear zone {clear_w/clear_n:+6.1f}')
    # how much of the picture's "interest" sits where the scrim hides it
    xm = x0 + (x1-x0)*0.4
    xr = x0 + (x1-x0)*0.6
    left = sum(abs(px_at(px,x,y)[0]-px_at(px,x,y)[2])
               for y in range(y0,y1,4) for x in range(x0,int(xm),4))
    right = sum(abs(px_at(px,x,y)[0]-px_at(px,x,y)[2])
                for y in range(y0,y1,4) for x in range(int(xr),x1,4))
    print(f'    warmth mass left-40% {left/1000:.0f}k  vs  right-40% {right/1000:.0f}k'
          f'   (right must dominate)')

if __name__ == '__main__':
    for arg in sys.argv[1:]:
        n,p = arg.split('=',1)
        audit(n,p)
