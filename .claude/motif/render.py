import json, sys, re
from PIL import Image, ImageDraw
d=json.load(open('/tmp/mot/frame.json'))
W,H=d['W'],d['H']
SS=2
im=Image.new('RGB',(W*SS,H*SS),(253,246,238))
ov=Image.new('RGBA',(W*SS,H*SS),(0,0,0,0))
dr=ImageDraw.Draw(ov,'RGBA')
def rgba(s):
    m=re.findall(r'[\d.]+',s)
    r,g,b=int(float(m[0])),int(float(m[1])),int(float(m[2]))
    a=float(m[3]) if len(m)>3 else 1.0
    return (r,g,b,int(a*255))
for x1,y1,x2,y2,c in d['lines']:
    dr.line([x1*SS,y1*SS,x2*SS,y2*SS],fill=rgba(c),width=SS)
for x,y,r,c in d['arcs']:
    rr=max(1.0,r*SS)
    dr.ellipse([x*SS-rr,y*SS-rr,x*SS+rr,y*SS+rr],fill=rgba(c))
im=Image.alpha_composite(im.convert('RGBA'),ov).convert('RGB')
# guias da zona livre
g=ImageDraw.Draw(im)
for f,col in ((0.48,(239,124,0)),(0.94,(239,124,0))): g.line([W*SS*f,0,W*SS*f,H*SS],fill=col,width=SS)
g.line([0,H*SS*0.24,W*SS,H*SS*0.24],fill=(226,75,74),width=SS)
im.resize((W,H),Image.LANCZOS).save(sys.argv[1])
print('ok',sys.argv[1])
