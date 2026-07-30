# The Premise — log de geração dos assets

Assets da seção fixada **Matter → Intelligence → Life** da home
(`index.html`, `<section id="premise">`). Gerados via Higgsfield MCP.
Nenhum texto, número ou logo dentro das imagens — toda a tipografia é HTML.

## Histórico das três versões

**v1 — rejeitada.** Os nós viraram esferas 3D brilhantes, que a cadeia
image-to-image arrastou para dentro do estágio LIFE e transformou em pérolas
("parece ova de peixe"). Além disso a continuidade geométrica foi forçada tanto
que os três estados viraram o mesmo objeto com enfeites diferentes.
Arquivos em `_source/premise/v1-rejeitado/`.

**v2 — parcialmente rejeitada.** MATTER e INTELLIGENCE ficaram certos e
sobreviveram. O LIFE virou tecido fotorrealista com verniz molhado e vasos
vermelhos: "parece uma membrana de ovo, não é prazeroso de olhar". O diagnóstico
foi **quebra de registro** — os dois primeiros painéis são abstratos, o terceiro
tinha virado concreto e anatômico. Arquivos em `_source/premise/v2-com-fio/`.

**v3 — atual.** LIFE refeito como camadas translúcidas se desdobrando com
backlight forte, e o **filamento âmbar removido de tudo**, arte e código.

## O que a v3 mudou

| | v2 | v3 |
|---|---|---|
| LIFE | tecido molhado, vasos vermelhos | camadas se desdobrando, retroiluminadas, matte |
| Fio âmbar | pintado na arte + overlay animado | **removido por completo** |
| Chaves | 3 | 4 (entrou um intermediário) |
| Trechos de vídeo | 2 | 3 |
| Duração | 9,875 s | 14,708 s |

Sobre o brilho, a lição foi separar **luminosidade de umidade**. Uma pétala
contra o sol responde à luz sem parecer molhada. Os prompts liberam luz
*transmitida* e proíbem por escrito reflexo especular, verniz e película líquida.

Sobre o fio: era decoração que não fazia nada, e as tentativas de dar-lhe função
(barra de progresso, depois pulso acendendo nós) não convenceram. Saiu.
Consequência: **o âmbar deixou de existir como cor de sinal.** O calor agora só
aparece no LIFE, como conteúdo do estágio em vez de enfeite. O arco ficou
frio → frio → quente, medível nos pixels.

---

## Cadeia de proveniência

Cada chave deriva da anterior como edição image-to-image, e é isso que mantém
câmera, silhueta e luz constantes. Os três clipes são ancorados nesses pares.

```
01-matter ──> 02-intelligence ──> 02b-meio ──> 03-life
    └ trecho A ┘   └ trecho B1 ┘   └ trecho B2 ┘
```

O **02b-meio** existe por um motivo específico. Da malha de pontos até camadas
desdobradas o salto topológico é grande, e salto grande faz o modelo trapacear e
entregar algo próximo de um dissolve. Com o intermediário ancorado, a
transformação é obrigada a passar por uma geometria meio-aberta plausível:
paredes descolando nas bordas, levantando, e varrendo os poros até fechá-los.

## Chaves — `nano_banana_pro`, 16:9, 2k (2752 × 1536)

| Estágio | Job ID | Origem |
|---|---|---|
| 01 Matter | `69e6b1ee-587b-400e-bd94-7ab4183653cf` | v2 com o fio removido |
| 02 Intelligence | `26a74527-1cbf-4059-9453-a8d7ef84ce01` | v2 com o fio removido |
| 02b Meio | `cc5fd49d-cee7-4bd9-9a26-080b3a018e18` | derivado de 02 |
| 03 Life | `71ad741b-63ad-4352-87bd-3365a27eae8b` | desdobramento retroiluminado |

A remoção do fio foi por edição direcionada — "reconstrua o material que estava
atrás, sem emenda, sombra ou fantasma" — e não regerando do zero, o que
preservou as composições já aprovadas.

O LIFE mantém de propósito um **resquício do scaffold perfurado no canto
inferior direito**. Não é só continuidade estética: é o que dá ao morph um ponto
de partida visível, com poros dentro do quadro para fechar.

## Trechos de vídeo — `kling3_0`

Único modelo do catálogo que aceita `start_image` e `end_image` juntos, o que
ancora cada clipe nas chaves. `mode: pro`, `duration: 5`, `sound: off`, 16:9.
Saída 1928 × 1076, 24 fps, ~8,75 créditos cada.

| Trecho | Job ID | De → para |
|---|---|---|
| A | `d36cc479-976e-4c4e-bb1e-e05a70c36d77` | Matter → Intelligence |
| B1 | `dad2e3ba-95dd-4105-b487-0da2a2c8731d` | Intelligence → Meio |
| B2 | `869d68cd-588f-43b1-b036-7236b77ee6a8` | Meio → Life |

O que faz o morph funcionar é descrever o **mecanismo**, não o resultado: em vez
de "vira tecido vivo", "as bordas se descolam, levantam, enrolam para fora e
varrem por cima das aberturas, que se fecham". Os prompts também proíbem
explicitamente qualquer linha ou ponto âmbar, senão o modelo reintroduz o fio.

Nota operacional: prompts assim disparam a recomendação do preset "IN THE DARK"
do Higgsfield. É preciso declinar com `declined_preset_id` e reenviar literal.

---

## Pós-produção (ffmpeg 8.1.2)

```
ffmpeg -i transA-raw.mp4 -i transB1-raw.mp4 -i transB2-raw.mp4 -filter_complex \
"[0:v]crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24[a];\
 [1:v]crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24[b];\
 [2:v]crop=1912:1076:8:0,scale=1920:1080,setsar=1,fps=24[c];\
 [a][b]xfade=transition=fade:duration=0.2:offset=4.84[ab];\
 [ab][c]xfade=transition=fade:duration=0.2:offset=9.68[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 26 -g 6 -keyint_min 6 -sc_threshold 0 -preset veryslow \
-movflags +faststart premise-sequence.mp4
```

`-g 6` = keyframe a cada 0,25 s; é o que deixa o scrub fluido (latência medida
1–9 ms, nos dois sentidos). `+faststart` põe o moov atom na frente. O crop
corrige o 1928 × 1076 do modelo para 16:9 real.

CRF 26 → 6,4 MB: 23% mais bytes para 49% mais duração que a v2, porque camadas
lisas e gradientes comprimem melhor que o detalhe vascular antigo.

**Marcos no clipe**, verificados no navegador:

| Fração | Segundo | Estado |
|---|---|---|
| 0,000 | 0,00 | Matter |
| 0,336 | 4,94 | Intelligence (emenda A/B1) |
| 0,665 | 9,78 | meio da abertura (emenda B1/B2) |
| 1,000 | 14,71 | Life |

Calor medido (R−B na zona da estrutura) ao longo do clipe:
−15 → +7 → +11 → +24 → +42 → +108 → +112, monotônico. O espaço vazio à
esquerda permanece ivory (de 254,247,235 a 255,253,244) em **todos** os quadros,
que é o que garante a legibilidade do texto sobreposto.

Stills gerados a partir dos PNG originais, não de quadros do vídeo:

```
ffmpeg -i <chave>.png -vf "crop=2731:1536:10:0,scale=2200:1238" \
  -quality 76 -compression_level 6 <stage>.webp
```

Uma tentativa descartada: sobrepor os PNG de 2752 px nos platôs, para ter nitidez
máxima onde o olho descansa. O SSIM entre quadro de vídeo e chave original é 0,93
no Matter e 0,94 no Intelligence, mas **0,75 no Life** — a câmera deriva o
bastante no fim para o crossfade dar salto visível.

---

## ⚠️ O vídeo exige HTTP Range no servidor

Um vídeo controlado por scroll depende de `video.currentTime`. Sem HTTP Range o
navegador reporta `video.seekable = [0, 0]` mesmo com o arquivo inteiro em
`buffered`, e **toda atribuição de currentTime é truncada para 0 em silêncio** —
a figura congela no primeiro quadro.

`python -m http.server` **não** implementa Range. GitHub Pages implementa.
Para testar local:

```
python .claude/devserver.py 8128
```

O código detecta isso sozinho: se `seekable` vier vazio, ou se o clipe se
recusar a avançar por ~40 quadros, troca para o crossfade das três imagens e
registra o motivo em `data-fallback` na seção. A figura nunca fica parada.

---

## Arquivos

**Publicados** — `assets/premise/` (6,9 MB)

| Arquivo | Tamanho | Usado em |
|---|---|---|
| `premise-sequence.mp4` | 6,4 MB | 1920 × 1080, 14,71 s, scrub no desktop |
| `stage-01-matter.webp` | 199 KB | 2200 px · poster/base + mobile + reduced-motion |
| `stage-02-intelligence.webp` | 173 KB | crossfade mobile + reduced-motion |
| `stage-03-life.webp` | 55 KB | idem |

Custo por visita: **~6,6 MB no desktop**, **427 KB no mobile** (o clipe nunca é
requisitado nem baixado), **427 KB em reduced-motion**.

**Fonte, não publicada** — `_source/premise/` (no .gitignore): as 4 chaves em
2752 px, os 3 clipes brutos, e as pastas `v1-rejeitado/` e `v2-com-fio/`.
