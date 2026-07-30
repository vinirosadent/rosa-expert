#!/usr/bin/env bash
# Assemble assets/premise/premise-sequence.mp4
#
# The cut is driven by reading time, not by the length of the clips that
# happen to exist.  Each beat is stated once here and once in index.html
# (as a fraction of DUR); checks/timing.py checks the pair and checks/shipped.py
# checks that index.html really carries what timing.py verified.
#
#   deriva    3.60  points drifting, nothing formed yet   opening copy reads
#   forma     0.50  the points close into material
#   consolida 2.90  the material consolidates             caption 01 reads
#   transA    4.30  matter -> lattice                     the 1->2 transition
#   intel     1.90  the lattice rests                     caption 02 reads
#   peel      2.60  the lattice peeling, still cool       caption 02 leaves
#   unfurl    2.60  unfurling; warmth arrives             caption 03 enters
#   life      2.10  the warm layers rest                  caption 03 reads
#   recuo     2.80  the camera retreats
#   todo      2.40  three strata                          the title returns
#                  -----
#                  25.70
#
# Three things this build does deliberately:
#
#  * THE OPENING IS NOT THE MATERIAL.  It is a cloud of fine points that
#    drifts for three and a half seconds and only then closes into the porous
#    scaffold — so the section opens on something that BECOMES matter, under
#    the words "Designing the materials that should exist."  The version before
#    this one opened on the finished material and had to fill 8.5s from a 4.25s
#    clip by playing it forward then backward; the turnaround was perceptible
#    ("fica no vai e vem").  Nothing is reversed any more.
#
#  * transA gets 4.30s out of 4.20s of source — essentially real time.  It had
#    been compressed to 2.90s, which is 1.45x, and the matter-to-intelligence
#    transformation went by too fast to follow.  This is the conceptual centre
#    of the section and it is now the longest transition in the film, which
#    checks/timing.py asserts.
#
#  * The holds are not freezes.  Each one is the TAIL of its own clip played
#    very slowly with motion-compensated interpolation, so the picture keeps
#    breathing while it rests.  Hard freezes would put 6.4s of literally dead
#    frames into a 25.7s film.
#
# What this build does NOT do is zoompan.  That filter rounds its crop to
# whole pixels, so a slow drift becomes a 1px shuffle: an earlier cut measured
# 10 sign reversals of frame-to-frame displacement per 100 frames, which is
# what read as trembling.

set -euo pipefail

# This script is versioned (here), but its inputs are not: the raw clips and
# full-res keyframes live under _source/, which .gitignore excludes because of
# their size. Run it from anywhere.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/_source/premise"
OUT="$ROOT/assets/premise"
cd "$SRC"

for f in deriva-raw.mp4 pontos2-raw.mp4 transA-raw.mp4 transB1-raw.mp4 \
         transB2-raw.mp4 transC3-raw.mp4; do
  [ -f "$f" ] || { echo "falta $SRC/$f — ver os job IDs em PREMISE-GENERATION-LOG.md" >&2; exit 1; }
done

FIX="crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24"
MI="minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
ENC="-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium"

seg () { echo "  -> $1"; }

# ── 1. the points only drift ─────────────────────────────────────────────
# A clip of the point cloud with ITSELF (start == end frame), so nothing can
# form: 3.85s of specks floating, the cloud turning, a few crossing the empty
# ivory on the left.  This exists because kling will NOT hold off the
# transformation on request.  Asked twice, in increasingly explicit terms, for
# the points to drift for four fifths of the shot and only then close into
# material, it delivered finished material by 0.6s both times: with a
# start_image and an end_image it interpolates between them and front-loads
# whatever change is largest.  Pacing has to be cut, not prompted.
seg "s1-deriva.mp4   3.85s"
ffmpeg -v error -y -i deriva-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:3.85,setpts=PTS-STARTPTS[v]" -map "[v]" $ENC s1-deriva.mp4

# ── 2. the points close into matter, and it consolidates ─────────────────
# The whole points->matter clip at 1.48x.  Its formation lands in the first
# half-second and the rest is the mass consolidating and deepening, which is
# why caption 01 does not appear until the consolidation is under way — by
# then there really is a material on screen to name.  Ends exactly on the
# Matter keyframe, which is frame 0 of transA.
seg "s2-forma.mp4    3.40s"
ffmpeg -v error -y -i pontos2-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/1.4824[v]" -map "[v]" $ENC s2-forma.mp4

# ── 1b. the one seam that is not frame-continuous ────────────────────────
# The drift clip ends at its own 3.85s mark; the formation clip begins on the
# points keyframe.  Both frames are the same cloud in a different phase of its
# drifting, so a 0.25s dissolve makes the join invisible where a hard cut
# would pop.  Every OTHER seam in this film is a straight cut, because each
# segment genuinely begins where the previous one ended.
seg "s12-abertura.mp4  7.00s (emenda com dissolve de 0,25s)"
ffmpeg -v error -y -i s1-deriva.mp4 -i s2-forma.mp4 -filter_complex \
"[0:v][1:v]xfade=transition=fade:duration=0.25:offset=3.60,fps=24,setsar=1[v]" \
-map "[v]" $ENC s12-abertura.mp4

# ── 3. matter -> lattice, at essentially real speed ──────────────────────
# 4.30s out of 4.20s of source.  It had been 2.90s (1.45x) and the
# transformation went by too fast to follow: this is the conceptual centre of
# the section and it is now the longest transition in the film.
seg "s3-transA.mp4   4.30s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/0.9767[v]" -map "[v]" $ENC s3-transA.mp4

# ── 4. the lattice rests ─────────────────────────────────────────────────
seg "s4-intel.mp4    1.90s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4421,${MI}[v]" -map "[v]" $ENC s4-intel.mp4

# ── 5. peeling — must stay COOL: caption 02 is still leaving here ────────
seg "s5-peel.mp4     2.60s"
ffmpeg -v error -y -i transB1-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/1.9385[v]" -map "[v]" $ENC s5-peel.mp4

# ── 6. unfurling: warmth arrives, caption 03 comes in over it ───────────
seg "s6-unfurl.mp4   2.60s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.6154[v]" -map "[v]" $ENC s6-unfurl.mp4

# ── 7. Life rests ────────────────────────────────────────────────────────
seg "s7-life.mp4     2.10s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4000,${MI}[v]" -map "[v]" $ENC s7-life.mp4

# ── 8. the camera retreats ───────────────────────────────────────────────
seg "s8-recuo.mp4    2.80s"
ffmpeg -v error -y -i transC3-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.5000[v]" -map "[v]" $ENC s8-recuo.mp4

# ── 9. the whole body rests, and the title comes back over it ────────────
seg "s9-todo.mp4     2.40s"
ffmpeg -v error -y -i transC3-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.3500,${MI}[v]" -map "[v]" $ENC s9-todo.mp4

# ── join ─────────────────────────────────────────────────────────────────
printf "file '%s'\n" s12-abertura.mp4 s3-transA.mp4 s4-intel.mp4 s5-peel.mp4 \
  s6-unfurl.mp4 s7-life.mp4 s8-recuo.mp4 s9-todo.mp4 > concat.txt

echo "  -> premise-sequence.mp4"
# -g 48 (keyframe every 2s) is all that is needed: the clip only ever plays
# forward.  The dense keyframes of the scrubbing version cost 2MB and bought
# nothing once scrubbing was abandoned.
#
# aq-mode=3 / mbtree=0 are NOT cosmetic.  The opening is deliberately quiet,
# and by default x264 spends almost nothing on quiet regions: at plain CRF 25
# it quantised an earlier opening flat and produced an 18-frame (750ms) frozen
# run starting at frame 6, with 22 of the first 24 frames pixel-identical —
# the encoder re-creating the exact fault this cut exists to fix.  mbtree
# lowers quality on static areas assuming they will be referenced later;
# turning it off plus stronger adaptive quantisation puts the bits back.
#
# 1600x900, not 1920x1080.  Those extra bits went entirely on a 20% upscale
# of soft abstract gradients, which nobody can see, and cost 2.8MB.
ffmpeg -v error -y -f concat -safe 0 -i concat.txt -filter_complex \
"[0:v]scale=1600:900,fps=24,setsar=1[v]" -map "[v]" -an \
-c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 25 -g 48 -keyint_min 48 -sc_threshold 0 -preset veryslow \
-x264-params "aq-mode=3:aq-strength=1.3:mbtree=0" \
-movflags +faststart "$OUT/premise-sequence.mp4"

rm -f concat.txt
echo

# The fractions in index.html are counted off THIS file, frame by frame, so
# print the segment lengths the table has to be built from.
echo "  quadros por beat (para a tabela em checks/timing.py):"
for f in s1-deriva s2-forma s12-abertura s3-transA s4-intel s5-peel s6-unfurl s7-life s8-recuo s9-todo; do
  n=$(ffprobe -v error -select_streams v -count_frames \
      -show_entries stream=nb_read_frames -of csv=p=0 $f.mp4)
  printf "    %-22s %4s\n" "$f" "$n"
done
echo
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=width,height,nb_frames \
  -of default=noprint_wrappers=1 "$OUT/premise-sequence.mp4"
