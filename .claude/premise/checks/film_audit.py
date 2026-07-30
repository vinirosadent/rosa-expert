"""Whole-film checks that the browser preview cannot perform.

Three things have gone wrong on this section before, each of them invisible
in a screenshot:
  * the picture trembled  -> per-segment sign reversals of displacement
  * a beat sat dead       -> per-segment frame-to-frame change
  * text became illegible -> the ivory column must stay ivory in every frame
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from motion import frames, profiles, best_shift
import subprocess, tempfile, shutil, glob

PATH = 'assets/premise/premise-sequence.mp4'
SEAMS = [0, 204, 275, 316, 375, 434, 480, 548, 602]
NAMES = ['abertura+matter', 'transA', 'intel', 'peel',
         'unfurl', 'life', 'recuo', 'todo']

fs = frames(PATH)
print(f'{len(fs)} frames\n')

dx, dy, mad = [None], [None], [None]
prev = None
for (w, h, px) in fs:
    cur = profiles(w, h, px)
    if prev is not None:
        dx.append(best_shift(prev[0][0], cur[0]))
        dy.append(best_shift(prev[0][1], cur[1]))
        n = min(len(px), len(prev[1]))
        mad.append(sum(abs(px[k]-prev[1][k]) for k in range(0, n, 2))/(n/2))
    prev = (cur, px)

def flips(seq):
    s = [v for v in seq if v is not None and abs(v) > 0.05]
    return sum(1 for i in range(1, len(s)) if (s[i] > 0) != (s[i-1] > 0))

print(f'{"beat":18} {"frames":>7} {"jitter":>7} {"motion":>7} {"still":>7}')
bad = []
for i in range(len(SEAMS)-1):
    a, b = SEAMS[i], SEAMS[i+1]
    # skip the first frame of each beat: a seam is a legitimate direction change
    sx, sy = dx[a+2:b], dy[a+2:b]
    sm = [m for m in mad[a+2:b] if m is not None]
    fl = flips(sx) + flips(sy)
    still = sum(1 for m in sm if m < 0.08)
    print(f'{NAMES[i]:18} {b-a:7} {fl:7} {sum(sm)/len(sm):7.3f} {still:4}/{len(sm):<4}')
    if fl > 3:
        bad.append(f'{NAMES[i]}: {fl} sign reversals inside the beat -> trembling')
    if sum(sm)/len(sm) < 0.03:
        bad.append(f'{NAMES[i]}: mean change {sum(sm)/len(sm):.3f} -> reads as frozen')

# the copy sits over the left of the frame in every single frame
print('\nivory column (left 22% of the picture, every 10th frame):')
worst = (999, 999, 999, -1)
for i in range(0, len(fs), 10):
    w, h, px = fs[i]
    vals = [px[(y*w+x)] for y in range(0, h, 4) for x in range(0, int(w*0.22), 4)]
    lo = min(vals)
    if lo < worst[0]:
        worst = (lo, sum(vals)//len(vals), max(vals), i)
print(f'    darkest pixel found anywhere in that column: {worst[0]} '
      f'(frame {worst[3]}, mean there {worst[1]})')
if worst[0] < 215:
    bad.append(f'ivory column drops to {worst[0]} at frame {worst[3]} -> copy may not stay legible')

print()
if bad:
    print('PROBLEMS')
    for x in bad: print('  x', x)
else:
    print('film is clean: no beat trembles, no beat is frozen, the copy column '
          'stays ivory throughout')
