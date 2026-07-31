#!/usr/bin/env bash
# Assemble assets/method/method-sequence.mp4
#
# O filme do metodo: MAP -> PREDICT -> PRESCRIBE -> VALIDATE, doze planos
# tirados de onze clipes. Substitui a linha estatica 1-2-3-4 na home.
#
# Este script e' versionado; as entradas nao sao. Os clipes crus ficam em
# _source/method/pro/ (ignorado pelo git, ~60MB). Os job IDs de tudo estao em
# METHOD-GENERATION-LOG.md, entao da' para regerar.
#
# ── O corte e' por TRIM, nao por velocidade ──────────────────────────────
# Cada clipe foi gerado para durar 5s e a acao dentro dele foi coreografada
# para esse tempo. Comprimir 5s em 3,6s com setpts (1,39x) apressaria a acao
# inteira, e a licao da seccao premise foi exactamente essa: a transformacao
# apressada deixa de poder ser seguida. Por isso os planos sao ENCURTADOS
# pelas pontas — o fim de cada clipe e' quase sempre um assentamento — e
# nenhum corre a velocidade errada.
#
# ── Onde cada plano acaba, e porque ──────────────────────────────────────
# Medido com diferenca media entre quadros consecutivos: um modelo generativo
# que nao consegue segurar a cena emite um SALTO, um par de quadros que difere
# muito mais que os vizinhos. Os numeros medidos:
#
#   c3a / c3b   pico 40x / 61x da mediana em 0,08s -> salto de arranque:
#               o primeiro quadro e' o keyframe cru e o segundo ja' nao e'.
#               Comeca-se em 0,15s.
#   c5          pico 37x em 1,04s -> a moldura do monitor escurece de vez.
#               Usa-se so' depois disso, com a moldura ja' estavel.
#   c8a         pico em 3,04s -> e' onde a espatula VIRA PINCEL. O prompt
#               proibiu pincel explicitamente e o modelo desenhou um na
#               mesma. O plano acaba antes, aos 2,60s, e a mistura passa
#               para o c8b — que e' melhor montagem de qualquer modo.
#   c8b         pico 14,5x em 3,58s -> mudanca de enquadramento para os
#               moldes. Vira DOIS planos com um corte seco de proposito;
#               um corte assumido le-se muito melhor que um morph acidental.
#   c1 c4 c6 c9 sem salto (2,4x a 4,3x da mediana). Tomada continua.
#
# c6 acaba aos 3,60s por outra razao, medida a parte: os nos da rede aquecem
# de navy para ambar ao longo do clipe, calor R-B de 4,5 para 13,3. Ate' aos
# ~3,6s (11,2) le-se como o sinal a atravessar a rede; depois disso le-se
# como a paleta a mudar, e o ambar neste site e' acento, nao materia.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$ROOT/_source/method/pro"
OUT="$ROOT/assets/method"
mkdir -p "$OUT"
cd "$SRC"

for f in c1-condition c2-eluate c3a-migration c3b-migration c4-mineral \
         c5-integrate c6-model c7-select c8a-weigh c8b-specimens c9-loop; do
  [ -f "$f.mp4" ] || { echo "falta $SRC/$f.mp4 — ver METHOD-GENERATION-LOG.md" >&2; exit 1; }
done

# 1916x1080 nao e' 16:9 exacto (1,774 contra 1,778); o crop acerta isso antes
# de escalar, senao o filme inteiro fica com 0,2% de esticamento vertical.
FIX="crop=1912:1076:2:2,setsar=1,fps=24"
ENC="-an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -preset medium"

# nome            fonte              de     ate'
CUTS="
s01-condition    c1-condition       0.00   4.00
s02-eluate       c2-eluate          0.00   4.00
s03-scratch-a    c3a-migration      0.15   3.65
s04-scratch-b    c3b-migration      0.15   3.65
s05-mineral      c4-mineral         0.00   4.00
s06-integrate    c5-integrate       1.15   5.00
s07-model        c6-model           0.00   3.60
s08-select       c7-select          0.15   3.55
s09-weigh        c8a-weigh          0.20   2.60
s10-mix          c8b-specimens      0.20   2.60
s11-specimens    c8b-specimens      3.70   5.00
s12-loop         c9-loop            0.00   5.00
"
# here-string com o CR removido, e nao um pipe. Este ficheiro pode ser gravado
# com CRLF (o repositorio mora no Drive, em Windows): um CR preso no ultimo
# campo entra no argumento do trim do ffmpeg, e um pipe ainda poria o laco num
# subshell onde o set -e nao aborta. Foi assim que dois planos falharam em
# silencio e so' o ffprobe seguinte deu pela falta.
LINHAS="$(printf '%s' "$CUTS" | tr -d '\r')"

rm -f concat.txt
while read -r name src a b; do
  [ -z "${name:-}" ] && continue
  printf "  -> %-16s %-16s %5.2f-%5.2f\n" "$name" "$src" "$a" "$b"
  # fps=24 DEPOIS do trim: sem ele o concat final insere quadros para fechar
  # as contas (foram 9 numa montagem da premissa) e a tabela de legendas
  # deixa de bater com o ficheiro.
  # -nostdin NAO e' opcional aqui: sem ele o ffmpeg le do stdin do laco e
  # engole caracteres do here-string. O sintoma foi absurdo — "s05-mineral"
  # chegava ao ffmpeg como "05-mineral", um plano por vez, e so' o ffprobe
  # seguinte dava pela falta do ficheiro.
  ffmpeg -nostdin -v error -y -i "$src.mp4" -filter_complex \
    "[0:v]${FIX},trim=${a}:${b},setpts=PTS-STARTPTS[v]" -map "[v]" $ENC "$name.mp4"
  echo "file '$name.mp4'" >> concat.txt
done <<< "$LINHAS"

echo "  -> method-sequence.mp4"
# aq-mode=3 / mbtree=0 nao sao cosmetica: por omissao o x264 gasta quase nada
# em regioes quietas, e este filme tem varios planos deliberadamente quietos
# (o condicionamento, o laco). Num corte anterior da premissa o CRF 25 simples
# quantizou uma abertura calma ate' 18 quadros ficarem identicos — o codificador
# a recriar exactamente o defeito que o corte existe para evitar.
#
# 1600x900 e nao 1920x1080: a premissa mediu que o upscale de 20% em gradientes
# suaves custou 2,8MB e nao se ve.
#
# CRF 26 e nao 25 (o da premissa): este filme e' 40,8s contra 23,8s e tem
# linha fina em todo o lado. A 24 dava 11,7MB, o dobro do master da premissa
# para uma pagina inicial. A 26 fica em paridade de taxa com ela.
ffmpeg -v error -y -f concat -safe 0 -i concat.txt -filter_complex \
"[0:v]scale=1600:900,fps=24,setsar=1[v]" -map "[v]" -an \
-c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 26 -g 48 -keyint_min 48 -sc_threshold 0 -preset veryslow \
-x264-params "aq-mode=3:aq-strength=1.3:mbtree=0" \
-movflags +faststart "$OUT/method-sequence.mp4"

echo
echo "  quadros por plano (para a tabela em checks/timing.py):"
while read -r name src a b; do
  [ -z "${name:-}" ] && continue
  n=$(ffprobe -v error -select_streams v -count_frames \
      -show_entries stream=nb_read_frames -of csv=p=0 "$name.mp4")
  printf "    ('%s', %4s),\n" "$name" "$n"
done <<< "$LINHAS"
rm -f concat.txt
echo
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=width,height,nb_frames \
  -of default=noprint_wrappers=1 "$OUT/method-sequence.mp4"
