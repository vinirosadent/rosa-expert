"""The cut and the captions, in one place, with the invariants asserted.

Two bugs shipped from this section because the timing lived only in someone's
intention. First a caption stayed legible while the picture had already moved
on to the next idea ("a flor vem quando o ponto 2 ainda esta na tela"). Then a
transition was compressed so hard it could not be followed ("a transicao de 1
para 2 e' muito rapida"). Both are now conditions checked by code.

    py .claude/premise/checks/timing.py
"""

# FRAME COUNTS MEASURED FROM THE BUILT SEGMENTS, not the ones intended.
# build.sh prints these; paste them here after a rebuild. Guessing puts every
# caption slightly out, because the motion-interpolated holds land short.
FPS = 24.0
# A abertura (particulas voando ate' tomarem a forma) NAO esta neste filme:
# e' desenhada ao vivo em WebGL antes de o clipe comecar. Por isso o texto da
# premissa tambem nao aparece aqui — ele pertence ao prelúdio.
BEATS = [          # name,          frames,  what the picture is
    ('matter',      123, 'matter'),
    # transA e' UM segmento, dividido aqui em dois estados: medido quadro a
    # quadro, os pontos da malha aparecem aos 2,0s do transA bruto, que neste
    # corte cai 45 quadros depois de a transicao comecar. A partir dali o que
    # esta na tela ja' e' Intelligence a emergir, e a legenda 01 nao pode estar
    # no ar — foi exactamente esse o defeito relatado.
    ('transA',       38, 'matter->intel'),
    ('transA2',      82, 'intel-emergindo'),
    ('intel',        39, 'intel'),
    ('peel',         64, 'intel->meio'),
    ('unfurl',       64, 'meio->life'),
    ('life',         43, 'life'),
    ('recuo',        69, 'life->todo'),
    ('todo',         50, 'todo'),
]

t = 0.0
SPAN = {}
for name, fr, state in BEATS:
    SPAN[name] = (t, t + fr/FPS, state)
    t += fr/FPS
DUR = t

# copy windows in seconds: (fade-in start, fade-in end, fade-out start, fade-out end)
PRELUDIO = 6.2     # segundos de premissa em ivory antes de o clipe comecar
COPY = {
    'cap01': (0.35,  1.10,   4.75,  5.50),
    'cap02': (7.05,  7.85,  12.65, 13.35),
    'cap03': (15.60, 16.30, 19.50, 20.25),
    'coda':  (20.55, 21.42, None,  None),
}
# which picture-state each piece of copy may be legible over.
# cap01 is NOT allowed over 'pontos': the material does not exist yet there,
# so naming it would describe something the viewer cannot see.
ALLOWED = {
    # 'intel-emergindo' esta deliberadamente FORA de cap01: a partir dali a
    # malha ja' se ve, e chamar-lhe Matter descreve o que ja' nao esta na tela.
    'cap01': {'matter', 'matter->intel'},
    'cap02': {'intel', 'matter->intel', 'intel-emergindo', 'intel->meio'},
    'cap03': {'life', 'meio->life', 'life->todo'},
    'coda':  {'todo', 'life->todo'},
}

def legible(w):
    return (0.0 if w[0] is None else w[0]), (DUR if w[3] is None else w[3])

def solid(w):
    return (0.0 if w[1] is None else w[1]), (DUR if w[2] is None else w[2])

if __name__ == '__main__':
    print(f'clip {DUR:.2f} s ({int(sum(b[1] for b in BEATS))} quadros)\n')
    print(f'{"beat":10} {"from":>7} {"to":>7} {"dur":>6} {"frac":>15}  picture')
    for name, (a, b, s) in SPAN.items():
        print(f'{name:10} {a:7.2f} {b:7.2f} {b-a:6.2f}  {a/DUR:6.4f}-{b/DUR:6.4f}  {s}')

    print(f'\n{"copy":8} {"solid from":>11} {"to":>7} {"dwell":>7}   fractions')
    for k, w in COPY.items():
        s0, s1 = solid(w)
        fr = [f'{(x/DUR):.4f}' if x is not None else '-' for x in w]
        print(f'{k:8} {s0:11.2f} {s1:7.2f} {s1-s0:6.2f}s   [{", ".join(fr)}]')

fails = []

# 1. no two pieces of copy may be legible at the same time
keys = list(COPY)
for i in range(len(keys)):
    for j in range(i+1, len(keys)):
        a0, a1 = legible(COPY[keys[i]]); b0, b1 = legible(COPY[keys[j]])
        ov = min(a1, b1) - max(a0, b0)
        if ov > 0.001:
            fails.append(f'{keys[i]} and {keys[j]} overlap by {ov:.2f}s')

# 2. copy may only be legible over picture states it belongs to
for k, w in COPY.items():
    a, b = legible(w)
    for name, (s0, s1, state) in SPAN.items():
        ov = min(b, s1) - max(a, s0)
        if ov > 0.001 and state not in ALLOWED[k]:
            fails.append(f'{k} legible for {ov:.2f}s over "{state}" ({name})')

# 3. every caption needs real reading time
for k in ('cap01', 'cap02', 'cap03', 'coda'):
    s0, s1 = solid(COPY[k])
    if s1 - s0 < 2.4:
        fails.append(f'{k} only fully legible for {s1-s0:.2f}s (want >= 2.4)')

# 4. the returning title must be solid by the time the closing picture settles
c0, _ = solid(COPY['coda'])
if c0 > SPAN['todo'][0] + 0.05:
    fails.append(f'coda solid at {c0:.2f} but the closing picture settles at {SPAN["todo"][0]:.2f}')

# 5. matter -> intelligence is the conceptual centre of the section and was
#    reported as too fast to follow. It must stay the longest transition.
trans = {k: SPAN[k][1]-SPAN[k][0] for k in ('peel', 'unfurl', 'recuo')}
trans['transA'] = (SPAN['transA'][1]-SPAN['transA'][0]) + (SPAN['transA2'][1]-SPAN['transA2'][0])
if trans['transA'] < max(trans.values()):
    fails.append(f'transA is {trans["transA"]:.2f}s, shorter than '
                 f'{max(trans, key=trans.get)} at {max(trans.values()):.2f}s')
if trans['transA'] < 4.5:
    fails.append(f'transA is only {trans["transA"]:.2f}s (want >= 4.0)')

# 6. THE MATERIAL MUST NOT START CHANGING WHILE CAPTION 01 IS STILL BEING READ.
#    This is the rule the section kept breaking: the transformation began 0.8s
#    before the reader had finished with "Matter", so the material was already
#    becoming a lattice while the word said matter.
s0, s1 = solid(COPY['cap01'])
if s1 > SPAN['matter'][1] + 0.01:
    fails.append(f'the material starts changing at {SPAN["matter"][1]:.2f}s but '
                 f'caption 01 is still solid until {s1:.2f}s')

# 7. the film must open ON the material: the particles land exactly where it
#    is about to be, so anything else here would break the hand-off.
if BEATS[0][2] != 'matter':
    fails.append(f'the film opens on "{BEATS[0][2]}", but the particle prelude '
                 f'hands over on solid matter')

if __name__ == '__main__':
    print()
    if fails:
        print('FAILED')
        for f in fails: print('  x', f)
    else:
        print('all invariants hold:')
        print('  - no two captions ever legible together')
        print('  - no caption legible over a state it does not name')
        print('  - every caption fully legible >= 2.4 s')
        print('  - the returning title lands with the closing picture')
        print(f'  - matter->intelligence is the longest transition ({trans["transA"]:.2f}s)')
        print('  - the film opens on the material the particles land on')
        print(f'  - the transformation begins at {PRELUDIO+SPAN["matter"][1]:.2f}s from the '
              f'top of the section, after caption 01 is read '
              f'({PRELUDIO+solid(COPY["cap01"])[1]:.2f}s)')
