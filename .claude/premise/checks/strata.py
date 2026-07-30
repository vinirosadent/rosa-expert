"""Is each of the three strata actually PRESENT in the closing frame?

The closing frame has now failed twice in opposite directions. First the warm
layers were hidden under the text scrim; correcting that overshot, and the
mineral foam became a pale patch in a corner ("quase nem da pra ver a parte
materials"). Warmth alone cannot catch this, because the mineral stratum is
defined by having no warmth.

So each band is scored on three things, inside the region the page really
shows (the object-fit crop) and really lets through (the text scrim):

  presenca  how far the pixels sit from the empty ivory ground. A stratum
            that is nearly invisible scores near zero whatever it is made of.
  textura   mean local contrast. Pores and dots have high-frequency detail;
            a smooth wash does not. This is what separates real material
            from a faint tint.
  calor     R-B, which identifies the stratum rather than measuring it.

    py .claude/premise/checks/strata.py imagem.png [outra.png ...]
"""
import subprocess, sys, os, tempfile, shutil

W, H = 480, 270
IVORY = (253, 246, 238)

SCRIM = [(0.00,1.00),(0.26,0.96),(0.40,0.74),(0.55,0.20),(0.68,0.00),(1.00,0.00)]

def scrim_at(fx):
    for k in range(len(SCRIM)-1):
        x0,a0 = SCRIM[k]; x1,a1 = SCRIM[k+1]
        if x0 <= fx <= x1:
            t = 0 if x1==x0 else (fx-x0)/(x1-x0)
            return a0 + t*(a1-a0)
    return 0.0

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
    px = b[i+1:]
    shutil.rmtree(d, ignore_errors=True)
    return px

def at(px, x, y):
    o = (y*W + x)*3
    return px[o], px[o+1], px[o+2]

BANDS = [('calor   topo', .14, .42),
         ('malha   meio', .38, .62),
         ('mineral base', .56, .92)]

def audit(name, path, aspect):
    px = rgb(path)
    keep_y = min(1.0, (16/9)/aspect)
    keep_x = min(1.0, aspect/(16/9))
    y0 = int(round(H*(1-keep_y)/2)); y1 = H - y0
    x0 = int(round(W*(1-keep_x)/2)); x1 = W - x0
    print(f'  {name}  (palco {aspect:.2f}:1)')
    for label, a, b in BANDS:
        ya, yb = int(H*a), int(H*b)
        va, vb = max(ya, y0+1), min(yb, y1-1)
        if vb <= va + 2:
            print(f'    {label}: FORA DO QUADRO'); continue
        pres = tex = warm = wsum = 0.0
        n = 0
        for y in range(va, vb, 2):
            for x in range(x0+1, x1-1, 2):
                r,g,bb = at(px, x, y)
                vis = 1 - scrim_at((x-x0)/(x1-x0))
                if vis <= 0.02: continue
                dev = (abs(r-IVORY[0]) + abs(g-IVORY[1]) + abs(bb-IVORY[2]))/3
                lc = (abs(at(px,x-1,y)[1]-g) + abs(at(px,x+1,y)[1]-g)
                      + abs(at(px,x,y-1)[1]-g) + abs(at(px,x,y+1)[1]-g))/4
                pres += dev*vis; tex += lc*vis; warm += (r-bb)*vis
                wsum += vis; n += 1
        cut = 100*(1-(vb-va)/(yb-ya))
        print(f'    {label}: presenca {pres/wsum:5.1f}  textura {tex/wsum:4.1f}  '
              f'calor {warm/wsum:+6.1f}   cortado {cut:3.0f}%')

if __name__ == '__main__':
    for p in sys.argv[1:]:
        print(f'=== {os.path.basename(p)}')
        for asp in (1425/828, 1920/1008, 1920/728):
            audit('', p, asp)
        print()
