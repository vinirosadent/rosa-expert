# The Premise — log de geração dos assets

Assets da seção fixada **Matter → Intelligence → Life** da home
(`index.html`, `<section id="premise">`). Gerados em 29 de julho de 2026 via
Higgsfield MCP. Nenhum texto, número ou logo dentro das imagens — toda a
tipografia da página é HTML.

> **Esta é a versão 2.** A primeira tentativa foi rejeitada: os nós viraram
> esferas 3D grandes e brilhantes, que foram arrastadas para dentro do estágio
> LIFE e viraram pérolas — "parece ova de peixe". Além disso a continuidade
> geométrica foi forçada tanto que os três estados viraram o mesmo objeto com
> enfeites diferentes, e a transformação não lia como transformação.
> Os arquivos rejeitados estão em `v1-rejeitado/`.

## O que mudou na v2

| | v1 (rejeitada) | v2 |
|---|---|---|
| MATTER | blob liso com ~15 poros enormes | espuma mineral fina, centenas de poros pequenos, paredes finíssimas |
| INTELLIGENCE | esferas 3D brilhantes grudadas no blob | pontos minúsculos e **chapados**, malha de fios capilares tipo constelação |
| LIFE | pérolas cor-de-rosa espalhadas | tecido translúcido com microvasos que **ramificam** |
| Leitura | três estados quase idênticos | denso e frio → aéreo → blush vascular |

A correção de prompt que resolveu as bolas foi banir explicitamente o
vocabulário inteiro (`spheres, balls, beads, pearls, orbs, marbles, eggs,
caviar, fish roe`), exigir "TINY FLAT MATTE DOTS ... like fine ink dots on
paper", e dizer o critério de falha em voz alta: *"If any point looks like a
small shiny ball, the image is wrong."*

---

## Cadeia de proveniência

Cada chave deriva da anterior como edição image-to-image — é isso que mantém
câmera, silhueta, luz e o percurso do fio âmbar constantes. Os dois clipes são
então ancorados exatamente nesse par de quadros.

```
01-matter ──(img2img)──> 02-intelligence ──(img2img)──> 03-life
    │                          │                            │
    └──── Transição A ─────────┘                            │
         (start → end)          └──── Transição B ──────────┘
                                     (start → end)
```

## Chaves — modelo `nano_banana_pro`

`aspect_ratio 16:9`, `resolution 2k`, `count 2` (dois candidatos por estágio,
um escolhido). Saída 2752 × 1536 PNG.

| Estágio | Job ID escolhido | Entrada |
|---|---|---|
| 01 Matter | `5d679efb-b32d-4380-a20e-adc5636dc957` | só texto |
| 02 Intelligence | `e35de0e3-ae6b-43fc-994a-5593511f047e` | imagem → job `5d679efb…` |
| 03 Life | `ea99fbbf-9328-4002-8697-a86ebfa47739` | imagem → job `e35de0e3…` |

Critério de escolha: finura do material, fidelidade da silhueta e do percurso do
fio âmbar à chave 1, limpeza do espaço vazio à esquerda, e ausência total de
formas esféricas.

## Transições — modelo `kling3_0`

Escolhido por ser o modelo do catálogo que aceita **`start_image` e `end_image`
ao mesmo tempo**, o que ancora cada clipe nas chaves em vez de deixar derivar.
`mode: pro`, `duration: 5`, `sound: off`, `aspect_ratio: 16:9`.
Saída 1928 × 1076, 24 fps, 121 quadros. 8,75 créditos cada.

| Clipe | Job ID | start_image | end_image |
|---|---|---|---|
| A — Matter → Intelligence | `a6b8ec36-4809-4124-8d60-1aff910ec585` | `5d679efb…` | `e35de0e3…` |
| B — Intelligence → Life | `980c5ab1-3b44-423f-a8a2-899043bd1993` | `e35de0e3…` | `ea99fbbf…` |

Os prompts de vídeo repetem a proibição de esferas, porque o modelo tende a
"engordar" pontos em bolas ao longo da interpolação.

---

## Pós-produção (ffmpeg 8.1.2)

Os dois clipes viram um master com crossfade de 0,2 s na junção. Como o
crossfade é centrado na emenda, o estado Intelligence cai exatamente no meio do
clipe (4,94 s de 9,875 s = progresso 0,5).

```
ffmpeg -i v2-transA.mp4 -i v2-transB.mp4 -filter_complex \
"[0:v]crop=1912:1076:8:0,scale=1600:900,setsar=1,fps=24[a];\
 [1:v]crop=1912:1076:8:0,scale=1600:900,setsar=1,fps=24[b];\
 [a][b]xfade=transition=fade:duration=0.2:offset=4.84[v]" \
-map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
-crf 27 -g 6 -keyint_min 6 -sc_threshold 0 -preset slow \
-movflags +faststart premise-sequence.mp4
```

`-g 6` = keyframe a cada 0,25 s; é isso que deixa o scrub fluido (latência
medida: 2–3 ms, nos dois sentidos). `+faststart` põe o moov atom na frente.
O crop corrige o 1928 × 1076 do modelo (1,792:1) para 16:9 real.

Resolução final **1920 × 1080** (nativa dos clipes), CRF 25, `preset veryslow`
→ 5,2 MB. A primeira tentativa saiu a 1600 × 900 / CRF 27 (3,6 MB) e ficou
visivelmente macia: este conteúdo é quase todo detalhe de alta frequência
(malha capilar, poros finos), que é exatamente o que a compressão come primeiro.
Medições comparativas: 1600/CRF27 = 3,6 MB, 1600/CRF22 = 6,2 MB,
1920/CRF25 = 5,6 MB (5,2 com `veryslow`), 1920/CRF23 = 7,0 MB.

Tentei também usar os PNGs originais (2752 px) sobrepostos nos três platôs, para
ter nitidez máxima onde o olho descansa e deixar o vídeo só para o movimento.
Não deu: o SSIM entre o quadro de vídeo e a chave original é 0,93 no Matter,
0,94 no Intelligence, mas **0,75 no Life** — a câmera deriva o bastante no fim
para o crossfade dar salto visível.

Stills a partir dos PNG originais (não de quadros do vídeo), para ficarem
nítidos:

```
ffmpeg -i <chave>.png -vf "crop=2731:1536:10:0,scale=1600:900" \
  -quality 78 -compression_level 6 <stage>.webp
```

---

## O fio âmbar como instrumento

Na primeira versão o fio era só decoração: uma linha bonita pintada na imagem
que não fazia nada. Agora ele é o indicador de progresso da seção — acende da
esquerda para a direita conforme você rola, com uma cabeça mais clara na
posição atual. É o único elemento idêntico nos três estados, então é ele que
literalmente desenha "one connected system" enquanto você atravessa.

Isso substituiu a `.premise-rail`, uma barrinha de progresso genérica que
duplicava a função sem significado nenhum.

O overlay é um SVG cujo caminho foi **traçado do próprio material**: varrendo o
vídeo coluna a coluna e pegando o centróide ponderado dos pixels âmbar
(R−B > 78, R−G > 28, R > 170), com mediana entre quatro instantes frios do
clipe. Os quadros quentes (LIFE) são descartados do traço porque o tecido rosa
tem R−B alto e contamina a detecção.

Duas medições sustentam a técnica:

- **O fio praticamente não se move** durante o clipe: deriva média de 0,04% da
  altura, máxima 0,37% (≈3 px). Kling segurou o percurso, então um caminho
  estático serve para os 9,875 s.
- **O overlay cai em cima do fio pintado**: desvio médio de 0,67 px, máximo
  2 px, em 9 de 11 pontos amostrados ao longo da largura visível (os 2 restantes
  caem fora da tela, no recorte lateral do `cover`).

O alinhamento em qualquer viewport depende de uma coisa: o SVG usa
`viewBox="0 0 1920 1080"` com `preserveAspectRatio="xMidYMid slice"`, que é
exatamente `object-fit: cover` a partir do centro. Por isso o
`object-position` da mídia **tem de continuar `50% 50%`** — qualquer outro valor
desliza a arte por baixo do overlay.

## ⚠️ O vídeo exige HTTP Range no servidor

Um vídeo controlado por scroll depende de `video.currentTime`. Se o servidor
não implementa HTTP Range, o navegador reporta `video.seekable = [0, 0]`
mesmo com o arquivo inteiro em `buffered`, e **toda atribuição de currentTime
é silenciosamente truncada para 0** — a figura congela no primeiro quadro.

`python -m http.server` **não** implementa Range. Foi exatamente isso que fez a
seção parecer quebrada no teste local. GitHub Pages (onde o site é publicado)
implementa, então em produção funciona.

Para testar localmente use `.claude/devserver.py`, que adiciona Range:

```
python .claude/devserver.py 8128
```

O código da seção agora detecta isso sozinho: se `seekable` vier vazio, ou se o
clipe se recusar a avançar por ~40 quadros, ele troca para o crossfade das três
imagens e registra o motivo em `data-fallback` na seção. A figura nunca fica
parada.

---

## Arquivos

**Publicados** — `assets/premise/` (5,7 MB)

| Arquivo | Tamanho | Usado em |
|---|---|---|
| `premise-sequence.mp4` | 5,2 MB | 1920 × 1080, scrub no desktop |
| `stage-01-matter.webp` | 205 KB | 2200 px · poster/base (todos os modos) + mobile + reduced-motion |
| `stage-02-intelligence.webp` | 171 KB | crossfade mobile + reduced-motion |
| `stage-03-life.webp` | 85 KB | crossfade mobile + reduced-motion |

Custo real por visita: **~5,4 MB no desktop** (clipe + um still),
**461 KB no mobile** (só stills, o clipe nunca é requisitado),
**461 KB em reduced-motion**.

O salto de 3,7 → 5,4 MB no desktop é o preço da nitidez, e é deliberado: a
seção carrega uma viewport antes de ser alcançada e nunca disputa com o hero.

**Fonte, não publicado** — `_source/premise/` (no .gitignore)

`01-matter.png`, `02-intelligence.png`, `03-life.png` (2752 × 1536),
`transitionA-raw.mp4`, `transitionB-raw.mp4` (1928 × 1076),
e `v1-rejeitado/` com a primeira tentativa.
