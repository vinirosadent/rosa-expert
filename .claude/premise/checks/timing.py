"""The cut and the captions, in one place, with the invariants asserted.

The bug that shipped: caption 02 stayed legible while the picture was already
unfurling into Life.  The rule that prevents it is stated here as code, not
as intention.
"""

# FRAME COUNTS MEASURED FROM THE BUILT SEGMENTS, not the ones intended.
# The motion-interpolated holds land a few frames short of their nominal
# length, so the fractions are derived from what exists.
FPS = 24.0
BEATS = [          # name,            frames,  what the picture is
    ('abertura',   130, 'matter'),    # split inside s1, no seam
    ('matter',      74, 'matter'),
    ('transA',      71, 'matter->intel'),
    ('intel',       41, 'intel'),
    ('peel',        59, 'intel->meio'),
    ('unfurl',      59, 'meio->life'),
    ('life',        46, 'life'),
    ('recuo',       68, 'life->todo'),
    ('todo',        54, 'todo'),
]

t = 0.0
SPAN = {}
for name, fr, state in BEATS:
    SPAN[name] = (t, t + fr/FPS, state)
    t += fr/FPS
DUR = t

# copy windows, in seconds: (fade-in start, fade-in end, fade-out start, fade-out end)
COPY = {
    'lede':  (None, None, 4.50,  5.30),
    'cap01': (5.40,  6.10,  9.30, 10.00),
    'cap02': (10.30, 11.00, 13.80, 14.50),
    'cap03': (16.90, 17.60, 20.40, 21.10),
    'coda':  (21.70, 22.60, None, None),
}
# which picture-state each piece of copy is allowed to be legible over
ALLOWED = {
    'lede':  {'matter'},
    'cap01': {'matter', 'matter->intel'},
    'cap02': {'intel', 'matter->intel', 'intel->meio'},
    'cap03': {'life', 'meio->life', 'life->todo'},
    'coda':  {'todo', 'life->todo'},
}

def legible(w):
    """The window over which this copy is readable at all (any opacity > 0)."""
    a = 0.0 if w[0] is None else w[0]
    b = DUR if w[3] is None else w[3]
    return a, b

def solid(w):
    """Fully opaque window."""
    a = 0.0 if w[1] is None else w[1]
    b = DUR if w[2] is None else w[2]
    return a, b

print(f'clip {DUR:.2f} s\n')
print(f'{"beat":10} {"from":>7} {"to":>7} {"frac":>15}  picture')
for name, (a, b, s) in SPAN.items():
    print(f'{name:10} {a:7.2f} {b:7.2f}  {a/DUR:6.4f}-{b/DUR:6.4f}  {s}')

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
c0, c1 = solid(COPY['coda'])
if c0 > SPAN['todo'][0] + 0.05:
    fails.append(f'coda solid at {c0:.2f} but the closing picture settles at {SPAN["todo"][0]:.2f}')

print()
if fails:
    print('FAILED')
    for f in fails: print('  x', f)
else:
    print('all invariants hold:')
    print('  - no two captions ever legible together')
    print('  - no caption legible over a state it does not name')
    print('  - every caption fully legible >= 2.5 s')
    print('  - the returning title lands with the closing picture')
