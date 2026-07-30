#!/usr/bin/env bash
# Assemble assets/premise/premise-sequence.mp4
#
# The cut is driven by reading time, not by the length of the clips that
# happen to exist.  Each beat is stated once here and once in index.html
# (as a fraction of DUR); scratchpad/timing.py checks the pair.
#
#   abertura  5.40  Matter, alive           opening copy reads
#   matter    3.10  Matter, alive           caption 01 reads
#   transA    2.90  scaffold -> lattice
#   intel     1.90  lattice                 caption 02 reads
#   peel      2.40  lattice peeling         caption 02 leaves
#   unfurl    2.40  warmth arrives          caption 03 enters
#   life      2.10  warm layers             caption 03 reads
#   recuo     2.80  camera retreats
#   todo      2.50  three strata            the title returns
#                  -----
#                  25.50
#
# Two things this build does deliberately:
#
#  * The 8.50s opening is a clip of Matter with ITSELF (start == end frame),
#    played forward then backward.  The reversal lands exactly on frame 0,
#    which is also the first frame of transA, so the seam is frame-identical.
#    The transitions cannot be used for the opening: measured frame by frame,
#    transA already shows lattice dots by 2.0s, so there would be no time to
#    read "Matter" over matter.
#
#  * The holds are not freezes.  Each one is the TAIL of its own clip played
#    very slowly with motion-compensated interpolation, so the picture keeps
#    breathing while it rests.  Hard freezes would have put 6.5s of literally
#    dead frames into a 25.5s film.
#
# What this build does NOT do is zoompan.  That filter rounds its crop to
# whole pixels, so a slow drift becomes a 1px shuffle: the previous cut
# measured 10 sign reversals of frame-to-frame displacement per 100 frames,
# which is what read as trembling.

set -euo pipefail

# This script is versioned (here), but its inputs are not: the raw clips and
# full-res keyframes live under _source/, which .gitignore excludes because of
# their size. Run it from anywhere.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/_source/premise"
OUT="$ROOT/assets/premise"
cd "$SRC"

for f in idleM2-raw.mp4 transA-raw.mp4 transB1-raw.mp4 transB2-raw.mp4 transC2-raw.mp4; do
  [ -f "$f" ] || { echo "falta $SRC/$f — ver os job IDs em PREMISE-GENERATION-LOG.md" >&2; exit 1; }
done

FIX="crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24"
MI="minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
ENC="-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium"

seg () { echo "  -> $1"; }

# ── 1. opening: 8.50s of Matter that never stops moving ──────────────────
# The last second of the raw clip is where the model brakes to land on the
# end frame (measured: 19 of its 24 frames are near-duplicates), so it is
# cut away.  0->4.25s forward, then the same reversed = 8.50s, ending on
# frame 0.
seg "s1-abertura.mp4  8.50s"
ffmpeg -v error -y -i idleM2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.25,setpts=PTS-STARTPTS,split[f][r];\
 [r]reverse[rv];[f][rv]concat=n=2:v=1[v]" -map "[v]" $ENC s1-abertura.mp4

# ── 2. scaffold -> lattice ───────────────────────────────────────────────
seg "s2-transA.mp4    2.90s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.4483[v]" -map "[v]" $ENC s2-transA.mp4

# ── 3. the lattice rests ─────────────────────────────────────────────────
seg "s3-intel.mp4     1.90s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4421,${MI}[v]" -map "[v]" $ENC s3-intel.mp4

# ── 4. peeling (still cool: no warmth may appear here, caption 02 is out
#       only at 0.577 and the unfurl must not beat it) ───────────────────
seg "s4-peel.mp4      2.40s"
ffmpeg -v error -y -i transB1-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/2.1000[v]" -map "[v]" $ENC s4-peel.mp4

# ── 5. unfurling: warmth arrives ─────────────────────────────────────────
seg "s5-unfurl.mp4    2.40s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.7500[v]" -map "[v]" $ENC s5-unfurl.mp4

# ── 6. Life rests ────────────────────────────────────────────────────────
seg "s6-life.mp4      2.10s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4000,${MI}[v]" -map "[v]" $ENC s6-life.mp4

# ── 7. the camera retreats ───────────────────────────────────────────────
seg "s7-recuo.mp4     2.80s"
ffmpeg -v error -y -i transC2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.5000[v]" -map "[v]" $ENC s7-recuo.mp4

# ── 8. the whole body rests, and the title comes back over it ────────────
seg "s8-todo.mp4      2.50s"
ffmpeg -v error -y -i transC2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.3360,${MI}[v]" -map "[v]" $ENC s8-todo.mp4

# ── join ─────────────────────────────────────────────────────────────────
# Straight concat, no crossfades: every seam is already frame-continuous
# because each segment begins where the previous one ended.
printf "file '%s'\n" s1-abertura.mp4 s2-transA.mp4 s3-intel.mp4 s4-peel.mp4 \
  s5-unfurl.mp4 s6-life.mp4 s7-recuo.mp4 s8-todo.mp4 > concat.txt

echo "  -> premise-sequence.mp4"
# -g 48 (keyframe every 2s) is all that is needed now: the clip only ever
# plays forward.  The dense keyframes of the scrubbing version cost 2MB and
# bought nothing once scrubbing was abandoned.
#
# aq-mode=3 / mbtree=0 are NOT cosmetic.  The opening is a deliberately quiet
# shot, and by default x264 spends almost nothing on quiet regions: at plain
# CRF 25 it quantised the opening flat and produced an 18-frame (750ms) frozen
# run starting at frame 6, with 22 of the first 24 frames pixel-identical.
# That is the encoder re-creating the exact fault this cut exists to fix.
# mbtree lowers quality on static areas on the assumption they will be
# referenced later; turning it off plus stronger adaptive quantisation puts
# the bits back. Measured: still frames in the opening 81 -> 48, longest
# frozen run 750ms -> 500ms and moved off the start to frame 96, which is the
# ping-pong turnaround where the source has its own natural lull.
#
# 1600x900, not 1920x1080. Those extra bits went entirely on a 20% upscale of
# soft abstract gradients, which nobody can see, and cost 2.8MB: 8.7MB at 1920
# against 5.9MB at 1600 for the same measured motion (mean 0.116 vs 0.115,
# same longest pause in the same place). 5.9MB is what the previous 20.5s cut
# weighed, so the film got 4.6s longer for nothing.
ffmpeg -v error -y -f concat -safe 0 -i concat.txt -filter_complex \
"[0:v]scale=1600:900,fps=24,setsar=1[v]" -map "[v]" -an \
-c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 25 -g 48 -keyint_min 48 -sc_threshold 0 -preset veryslow \
-x264-params "aq-mode=3:aq-strength=1.3:mbtree=0" \
-movflags +faststart "$OUT/premise-sequence.mp4"

rm -f concat.txt
echo
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,nb_frames \
  -of default=noprint_wrappers=1 "$OUT/premise-sequence.mp4"
