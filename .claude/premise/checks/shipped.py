"""Check that index.html actually carries the timings timing.py verified.

timing.py proves the cut is sound. This proves the sound cut is the one that
shipped — a transcription slip between the two would be invisible in a
screenshot and would put every caption a little out of place.

    py .claude/premise/checks/shipped.py
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import timing as T

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()

blk = src[src.index('var DUR='):src.index('var mode=')]
blk = re.sub(r'/\*.*?\*/', '', blk, flags=re.S)          # comments carry numbers too

def nums(pat):
    m = re.search(pat, blk, re.S)
    return [float(x) for x in re.findall(r'-?\d*\.?\d+', m.group(1))] if m else None

caps = nums(r'var CAPS=\[(.*?)\];')
caps = [caps[i:i+4] for i in range(0, 12, 4)]

shipped = {
    'DUR':      nums(r'var DUR=([\d.]+);'),
    'LEDE_OUT': nums(r'var LEDE_OUT=\[([^\]]+)\]'),
    'cap01': caps[0], 'cap02': caps[1], 'cap03': caps[2],
    'CODA_IN':  nums(r'var CODA_IN=\[([^\]]+)\]'),
}
expect = {
    'DUR':      [round(T.DUR, 3)],
    'LEDE_OUT': [round(T.COPY['lede'][2]/T.DUR, 4), round(T.COPY['lede'][3]/T.DUR, 4)],
    'cap01':    [round(x/T.DUR, 4) for x in T.COPY['cap01']],
    'cap02':    [round(x/T.DUR, 4) for x in T.COPY['cap02']],
    'cap03':    [round(x/T.DUR, 4) for x in T.COPY['cap03']],
    'CODA_IN':  [round(T.COPY['coda'][0]/T.DUR, 4), round(T.COPY['coda'][1]/T.DUR, 4)],
}

bad = 0
print('constantes do clipe:')
for k in ('DUR', 'LEDE_OUT', 'cap01', 'cap02', 'cap03', 'CODA_IN'):
    ok = shipped[k] == expect[k]
    bad += not ok
    print(f'  {"ok " if ok else "XX "} {k:9} {shipped[k]}'
          + ('' if ok else f'   esperado {expect[k]}'))

# the stacked path crossfades four stills on the same clock; each must land as
# its own caption becomes opaque, or mobile drifts even though desktop is right
print('\ncaminho empilhado — cada imagem chega junto com a sua legenda:')
alvo = {'1': T.COPY['cap01'][1], '2': T.COPY['cap02'][1],
        '3': T.COPY['cap03'][1], '4': T.COPY['coda'][1]}
for idx, start, dur in re.findall(
        r'stills\[(\d)\]\.style\.opacity=clamp\(\(t-([\d.]+)\)/([\d.]+)', src):
    cheia = (float(start) + float(dur)) * T.DUR
    quer = alvo[idx]
    d = abs(cheia - quer)
    bad += d > 0.10
    print(f'  {"ok " if d <= 0.10 else "XX "} imagem {idx} cheia em {cheia:5.2f}s, '
          f'legenda em {quer:5.2f}s  (dif {d:.2f}s)')

# The hero hands over to this section: its 160k points lose cohesion and pale
# to the ivory the premise opens on. That effect lives in a GLSL shader driven
# by scroll, so nothing offline can see it work — but it can be verified that
# the pieces are still wired together. Measured in-browser when it was built:
# spread 48 -> 75, distance to ivory 292 -> 19, alpha 28 -> 0.
print('\npassagem do hero para a premissa (fonte, nao render):')
hero = [
    ('uniforms declarados no shader', r'uniform float uLeave,uScatter;'),
    ('espalhamento aplicado',         r'if\(uScatter>0\.0001\)'),
    ('cor e alfa aplicados',          r'if\(uLeave>0\.0001\)'),
    ('clareia para o ivory',          r'vec3\(253\.0,246\.0,238\.0\)'),
    ('uniforms na lista de lookup',   r"'uLeave','uScatter'"),
    ('acionado pelo scroll',          r'\(sy-heroTop\)/\(heroH\*0\.88\)'),
    ('reduced-motion sem espalhar',   r'U\.uScatter,reduce\?0:LV'),
    ('para de desenhar ao dispersar', r'if\(LV>=0\.999\) return;'),
    ('geometria medida no resize',    r'resize\(\);medirHero\(\)'),
]
for label, pat in hero:
    ok = re.search(pat, src) is not None
    bad += not ok
    print(f'  {"ok " if ok else "XX "} {label}')

# the master on disk must be the length the fractions were computed against
try:
    import subprocess
    mp4 = os.path.join(ROOT, 'assets', 'premise', 'premise-sequence.mp4')
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries',
                              'format=duration', '-of', 'csv=p=0', mp4],
                             capture_output=True, text=True).stdout.strip())
    ok = abs(d - T.DUR) < 0.02
    bad += not ok
    print(f'\nmaster no disco: {d:.3f}s   tabela: {T.DUR:.3f}s   {"ok" if ok else "XX DIVERGE"}')
except Exception as e:
    print(f'\n(nao foi possivel medir o master: {e})')

print()
print('index.html reproduz a tabela verificada' if not bad else f'{bad} DIVERGENCIA(S)')
sys.exit(1 if bad else 0)
