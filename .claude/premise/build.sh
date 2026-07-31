#!/usr/bin/env bash
# Assemble assets/premise/premise-sequence.mp4
#
# The cut is driven by reading time, not by the length of the clips that
# happen to exist.  Each beat is stated once here and once in index.html
# (as a fraction of DUR); checks/timing.py checks the pair and checks/shipped.py
# checks that index.html really carries what timing.py verified.
#
#   (a abertura NAO esta neste ficheiro: e' so' a premissa em ivory. Ver index.html)
#
#   matter    1.71  matter, barely stirring                caption 01 reads
#   transA    3.88  matter -> lattice                     the 1->2 transition
#   intel     1.90  the lattice rests                     caption 02 reads
#   peel      2.60  the lattice peeling, still cool       caption 02 leaves
#   unfurl    2.60  unfurling; warmth arrives             caption 03 enters
#   life      2.10  the warm layers rest                  caption 03 reads
#   recuo     2.80  the camera retreats
#   todo      2.40  three strata                          the title returns
#                  -----
#                  19.46
#
# Three things this build does deliberately:
#
#  * THE OPENING IS NOT IN THIS FILE and is not a picture at all.  The section
#    opens on the premise set in ivory, with nothing else in the frame; then
#    the material fades up and this clip runs.  Four attempts to put movement
#    there — generated drift, two point-scaffold keyframes, and real WebGL
#    particles — all read as heavy or arbitrary.  The film is the elegant
#    thing; the opening now gets out of its way, and carries its own movement
#    in the way the copy arrives (a left-to-right reveal, in index.html).
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

for f in transA-raw.mp4 transB1-raw.mp4 \
         transB2-raw.mp4 transC3-raw.mp4; do
  [ -f "$f" ] || { echo "falta $SRC/$f — ver os job IDs em PREMISE-GENERATION-LOG.md" >&2; exit 1; }
done

FIX="crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24"
# Cada segmento sai em taxa CONSTANTE: o setpts torna o tempo fraccionario, e
# sem um fps=24 depois dele o concat final acaba por inserir quadros para
# fechar as contas — foram 9 numa montagem, e a tabela de legendas deixa de
# bater com o ficheiro.
MI="minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
ENC="-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium"

seg () { echo "  -> $1"; }

# ── 1. matter, formed, barely stirring ───────────────────────────────────
# The first 0.35s of transA, slowed almost to a standstill.  NOT the idle clip:
# that one was asked to make the mass "swell and contract", and it obliged by
# growing a big smooth bubble from about its frame 30 — plainly visible in the
# phone crop, and read as a blob that does not belong on a mineral scaffold.
#
# This window is still clean scaffold (measured frame by frame, the lattice
# dots do not appear in transA until 2.0s), and using it means the beat is real
# forward motion continuous with the transition that follows: no repeated
# footage, no reversal, no seam.
seg "s1-matter.mp4    1.80s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:0.35,setpts=(PTS-STARTPTS)/0.1944,${MI}[v]" -map "[v]" $ENC s1-matter.mp4

# ── 2. matter -> lattice, at essentially real speed ──────────────────────
# Picks up exactly where the beat above stopped.  It had been compressed to
# 2.90s (1.45x) and the transformation went by too fast to follow: this is the
# conceptual centre of the section and it is now the longest transition.
seg "s3-transA.mp4   4.25s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0.35:4.20,setpts=(PTS-STARTPTS)/0.9059,fps=24[v]" -map "[v]" $ENC s3-transA.mp4

# ── 4. the lattice rests ─────────────────────────────────────────────────
seg "s4-intel.mp4    1.90s"
ffmpeg -v error -y -i transA-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4421,${MI}[v]" -map "[v]" $ENC s4-intel.mp4

# ── 5. peeling — must stay COOL: caption 02 is still leaving here ────────
seg "s5-peel.mp4     2.60s"
ffmpeg -v error -y -i transB1-raw.mp4 -filter_complex \
"[0:v]${FIX},setpts=(PTS-STARTPTS)/1.9385,fps=24[v]" -map "[v]" $ENC s5-peel.mp4

# ── 6. unfurling: warmth arrives, caption 03 comes in over it ───────────
seg "s6-unfurl.mp4   2.60s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.6154,fps=24[v]" -map "[v]" $ENC s6-unfurl.mp4

# ── 7. Life rests ────────────────────────────────────────────────────────
seg "s7-life.mp4     2.10s"
ffmpeg -v error -y -i transB2-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.4000,${MI}[v]" -map "[v]" $ENC s7-life.mp4

# ── 8. the camera retreats ───────────────────────────────────────────────
seg "s8-recuo.mp4    2.80s"
ffmpeg -v error -y -i transC3-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=0:4.20,setpts=(PTS-STARTPTS)/1.5000,fps=24[v]" -map "[v]" $ENC s8-recuo.mp4

# ── 9. the whole body rests, and the title comes back over it ────────────
seg "s9-todo.mp4     2.40s"
ffmpeg -v error -y -i transC3-raw.mp4 -filter_complex \
"[0:v]${FIX},trim=4.20:5.04,setpts=(PTS-STARTPTS)/0.3500,${MI}[v]" -map "[v]" $ENC s9-todo.mp4

# ── join ─────────────────────────────────────────────────────────────────
printf "file '%s'\n" s1-matter.mp4 s3-transA.mp4 \
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
for f in s1-matter s3-transA s4-intel s5-peel s6-unfurl s7-life s8-recuo s9-todo; do
  n=$(ffprobe -v error -select_streams v -count_frames \
      -show_entries stream=nb_read_frames -of csv=p=0 $f.mp4)
  printf "    %-22s %4s\n" "$f" "$n"
done
echo
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=width,height,nb_frames \
  -of default=noprint_wrappers=1 "$OUT/premise-sequence.mp4"
