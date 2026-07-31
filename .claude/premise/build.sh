#!/usr/bin/env bash
# Assemble assets/premise/premise-sequence.mp4
#
# The cut is driven by reading time, not by the length of the clips that
# happen to exist.  Each beat is stated once here and once in index.html
# (as a fraction of DUR); checks/timing.py checks the pair and checks/shipped.py
# checks that index.html really carries what timing.py verified.
#
#   converge  3.80  points gather INTO the scaffold form  opening copy reads
#   materia   2.40  the points fuse into solid matter
#   matter    1.90  matter, formed and alive              caption 01 reads
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
#  * THE OPENING IS THE HERO'S LANGUAGE.  The hero is 160k points that take
#    the shape of things; this section opens the same way — a scattered cloud
#    GATHERS INTO THE SCAFFOLD'S FORM, and only then fuses into material, under
#    the words "Designing the materials that should exist."
#
#    That needs an intermediate keyframe, 00b-pontos-forma: the scaffold drawn
#    ENTIRELY in points, right silhouette and right pores, nothing solid.  It
#    is the same lesson as 02b-meio — without a keyframe in the middle the
#    model takes the shortcut.  Two earlier attempts to prompt one clip from
#    scattered points straight to solid matter both delivered finished material
#    by 0.6s, and a clip of points with themselves only ever produced aimless
#    drifting ("pontos que vao e vem"), which is movement without intent.
#
#    Every seam here is frame-identical, so nothing is cross-faded:
#      00-pontos -> 00b-pontos-forma -> 01-matter -> (transA)
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

for f in converge-raw.mp4 materia-raw.mp4 idleM2-raw.mp4 transA-raw.mp4 transB1-raw.mp4 \
         transB2-raw.mp4 transC3-raw.mp4; do
  [ -f "$f" ] || { echo "falta $SRC/$f — ver os job IDs em PREMISE-GENERATION-LOG.md" >&2; exit 1; }
done

FIX="crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24"
MI="minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
ENC="-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium"

seg () { echo "  -> $1"; }

# ── 1. the points gather into the scaffold's form ────────────────────────
# Scattered cloud -> the same cloud arranged into the scaffold: right
# silhouette, right pores, still nothing solid.  Purposeful movement, which is
# what "vao e vem" was missing.
seg "s1-converge.mp4  3.80s"
ffmpeg -v error -y -i converge-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/1.3263[v]" -map "[v]" $ENC s1-converge.mp4

# ── 2. the points fuse into material ─────────────────────────────────────
# Same silhouette, same pores; only the substance changes.  Ends exactly on
# the Matter keyframe, which is frame 0 of the idle clip AND of transA.
seg "s2-materia.mp4   2.40s"
ffmpeg -v error -y -i materia-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/2.1000[v]" -map "[v]" $ENC s2-materia.mp4

# ── 3. matter, formed, alive ─────────────────────────────────────────────
# The pore walls flex, particles cross, the light travels.  Only the first
# seconds of that clip are usable — its last second is where the model brakes
# to land back on its end frame, and 19 of those 24 frames are near-duplicates.
seg "s3-matter.mp4    1.90s"
ffmpeg -v error -y -i idleM2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:1.90,setpts=PTS-STARTPTS[v]" -map "[v]" $ENC s3-matter.mp4

# ── 4. matter -> lattice, at essentially real speed ──────────────────────
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
printf "file '%s'\n" s1-converge.mp4 s2-materia.mp4 s3-matter.mp4 s3-transA.mp4 \
  s4-intel.mp4 s5-peel.mp4 s6-unfurl.mp4 s7-life.mp4 s8-recuo.mp4 s9-todo.mp4 > concat.txt

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

# ── versao para telefone ─────────────────────────────────────────────────
# RETRATO 4:5, nao o 16:9 espremido numa faixa. O 16:9 tem o terco esquerdo
# deliberadamente VAZIO, porque no desktop o texto fica POR CIMA dali; no
# telefone o texto fica ABAIXO, entao esse vazio seria so' ecra desperdicado.
#
# O corte e' fixo em x=880 de 1600 porque da' para ser: medido nos dez beats,
# o centro de massa do conteudo varia so' de 0,71 a 0,77 da largura, e a massa
# corre para fora pela direita. Um corte de altura cheia ancorado a' direita
# segue o assunto o filme inteiro sem precisar de pan.
#
# 4:5 e nao 1:1 porque e' o que a coluna de texto deixa: com os estados de
# texto empilhados numa so' celula (ver index.html), a copia encurta ~150px e
# a caixa da imagem passa a ~0,83 de proporcao num telefone tipico. O video
# tem de ser talhado para a caixa que existe, nao ao contrario.
#
# 720x900 e CRF 30: o telefone recebe o filme de verdade em vez de uma
# sequencia de imagens, e ainda assim pesa uma fracao do master.
echo "  -> premise-mobile.mp4"
ffmpeg -v error -y -f concat -safe 0 -i concat.txt -filter_complex \
"[0:v]crop=720:900:880:0,scale=720:900,fps=24,setsar=1[v]" -map "[v]" -an \
-c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 30 -g 48 -keyint_min 48 -sc_threshold 0 -preset veryslow \
-x264-params "aq-mode=3:aq-strength=1.3:mbtree=0" \
-movflags +faststart "$OUT/premise-mobile.mp4"

rm -f concat.txt
echo

# The fractions in index.html are counted off THIS file, frame by frame, so
# print the segment lengths the table has to be built from.
echo "  quadros por beat (para a tabela em checks/timing.py):"
for f in s1-converge s2-materia s3-matter s3-transA s4-intel s5-peel s6-unfurl s7-life s8-recuo s9-todo; do
  n=$(ffprobe -v error -select_streams v -count_frames \
      -show_entries stream=nb_read_frames -of csv=p=0 $f.mp4)
  printf "    %-22s %4s\n" "$f" "$n"
done
echo
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=width,height,nb_frames \
  -of default=noprint_wrappers=1 "$OUT/premise-sequence.mp4"
