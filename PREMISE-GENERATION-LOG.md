# The Premise — log de geração dos assets

Assets da seção fixada **Matter → Intelligence → Life → o todo** da home
(`index.html`, `<section id="premise">`). Gerados via Higgsfield MCP.
Nenhum texto, número ou logo dentro das imagens — toda a tipografia é HTML.

O clipe **toca**, nunca é raspado pelo scroll. O scroll só decide se ele está
rodando. Todas as legendas leem o relógio do próprio clipe, então imagem e
palavra não podem se soltar uma da outra.

---

## Versões

**v1 — rejeitada.** Os nós viraram esferas 3D brilhantes, que a cadeia
image-to-image arrastou para dentro do LIFE e transformou em pérolas ("parece
ova de peixe"). A continuidade geométrica foi forçada tanto que os três estados
viraram o mesmo objeto com enfeites diferentes. `_source/premise/v1-rejeitado/`.

**v2 — parcialmente rejeitada.** MATTER e INTELLIGENCE sobreviveram. O LIFE
virou tecido fotorrealista com verniz molhado e vasos vermelhos: "parece uma
membrana de ovo". Diagnóstico: **quebra de registro** — dois painéis abstratos
e um concreto/anatômico. `_source/premise/v2-com-fio/`.

**v3.** LIFE refeito como camadas translúcidas retroiluminadas, e o filamento
âmbar removido de arte e código.

**v4 — scroll abandonado.** O scrub tinha um limite de taxa para não pular
quadros, e isso dessincronizou: o texto seguia o scroll, o vídeo ficava atrás.
"eu consigo rolar para a tela abaixo sem sequer ver a animacao 3". O clipe
passou a simplesmente tocar. Entrou o fecho (recuo de câmera) e a frase de
abertura passou a voltar no fim.

**v5 — atual.** Cinco correções, cada uma com a causa medida:

| problema relatado | causa encontrada | correção |
|---|---|---|
| "tremendo não é o caminho" | `zoompan` arredonda o corte para pixel inteiro, então a deriva de 3,5% virava vai-e-vem de 1px — **10 inversões de sinal do deslocamento em 100 quadros** | abertura passou a ser um clipe do Matter consigo mesmo, movimento real; medido 0 inversões |
| "os timings não estão ótimos" | o corte dava ao Matter quase nenhum tempo próprio e à Intelligence tempo demais | corte refeito a partir do tempo de leitura; cada legenda tem 2,8–3,2 s totalmente legíveis |
| "as fontes estão pequenas" | o nome do estágio estava em 13px sans caixa-alta, e o número decorativo em 41px levava a atenção | nome do estágio virou serif 32,8px; número virou índice de 12px |
| "a flor vem quando o ponto 2 ainda está na tela" | legenda 02 ia até a fração 0,700 e o LIFE só chegava em 0,715 | 02 sai em 0,578, antes de o desdobramento esquentar em 0,623 |
| "o último quadro mostra quase nada da flor" | o calor estava nos 40% da esquerda, **debaixo do véu de ivory que existe para o texto ser legível** | composição empilhada com o calor na zona limpa: calor visível na zona limpa passou de +19,0 para +89,7 |

O quinto foi o mais instrutivo. Eu tinha medido "calor +28" na versão anterior e
concluído que estava resolvido. A medida estava certa e a conclusão errada: ela
somava o quadro inteiro, e o scrim cobre de ivory os 40% da esquerda, que era
justamente onde a flor estava. A métrica passou a pesar cada pixel pela
transparência do scrim naquela coluna.

---

## O corte

25,08 s, 602 quadros a 24 fps. As frações estão em `index.html` e são contadas
do master pronto, quadro a quadro — não das durações pretendidas, porque os
trechos interpolados aterram alguns quadros curtos e estimar poria toda legenda
levemente fora de lugar.

| beat | quadros | fração | imagem | texto |
|---|---|---|---|---|
| abertura | 130 | 0,000–0,216 | Matter, vivo | texto da premissa |
| matter | 74 | 0,216–0,339 | Matter, vivo | **01 Matter** |
| transA | 71 | 0,339–0,457 | reorganizando | 01 sai, 02 entra |
| intel | 41 | 0,457–0,525 | a malha descansa | **02 Intelligence** |
| peel | 59 | 0,525–0,623 | descolando, ainda frio | 02 sai |
| unfurl | 59 | 0,623–0,721 | desdobrando, o calor chega | 03 entra |
| life | 46 | 0,721–0,797 | Life descansa | **03 Life** |
| recuo | 68 | 0,797–0,910 | a câmera recua | 03 sai, título volta |
| todo | 54 | 0,910–1,000 | os três estratos | **título de fecho** |

Duas regras governam as janelas de texto, e a v4 quebrava as duas:

1. duas peças de texto nunca são legíveis ao mesmo tempo;
2. nenhuma legenda fica legível sobre um estado que ela não nomeia.

Ambas são verificadas por programa (`.claude/premise/checks/timing.py`), não por intenção,
e um segundo script confere que as constantes em `index.html` reproduzem a
tabela verificada — inclusive as travessias de imagem do caminho mobile, que
caem com diferença de 0,00 s das suas legendas.

### Por que a abertura não pode usar a transição

Medida quadro a quadro, `transA` já mostra pontos de malha em 2,0 s. O andaime
só continua legível como andaime até ~1,5 s. Não há como dar tempo de ler
"Matter" sobre matéria usando a transição — ela transforma sem parar. Daí o
clipe do Matter consigo mesmo (`start_image` = `end_image`), 0→4,25 s adiante e
o mesmo revertido: 8,50 s que terminam no quadro 0, que é também o primeiro
quadro de `transA`. A emenda é idêntica quadro a quadro.

O último segundo do clipe bruto é descartado porque é onde o modelo freia para
aterrar na imagem final: 19 dos seus 24 quadros são quase-duplicados.

### Os platôs não são congelamentos

Cada platô é a **cauda do próprio clipe**, tocada bem devagar com interpolação
compensada por movimento. Congelamentos de verdade poriam 6,5 s de quadros
literalmente mortos num filme de 25,5 s.

---

## Cadeia de proveniência

```
01-matter ─┬─> idleM2 (Matter consigo mesmo)  ── abertura + matter
           └─> 02-intelligence ──> 02b-meio ──> 03-life ──> 04-fecho
                └ transA ┘  └ transB1 ┘ └ transB2 ┘ └ transC2 ┘
```

O **02b-meio** existe por um motivo específico: da malha de pontos até camadas
desdobradas o salto topológico é grande, e salto grande faz o modelo trapacear
e entregar algo próximo de um dissolve. Com o intermediário ancorado, a
transformação é obrigada a passar por uma geometria meio-aberta plausível.

O LIFE mantém de propósito um resquício do scaffold perfurado no canto inferior
direito: é o que dá ao morph um ponto de partida visível.

### Chaves — `nano_banana_pro`, 16:9, 2k (2752 × 1536)

| Estágio | Job ID |
|---|---|
| 01 Matter | `69e6b1ee-587b-400e-bd94-7ab4183653cf` |
| 02 Intelligence | `26a74527-1cbf-4059-9453-a8d7ef84ce01` |
| 02b Meio | `cc5fd49d-cee7-4bd9-9a26-080b3a018e18` |
| 03 Life | `71ad741b-63ad-4352-87bd-3365a27eae8b` |
| 04 Fecho (empilhado) | `c55aa9fb-43d4-4a5b-af8b-7fa5d9b4d3a4` |

O fecho foi gerado com **duas** referências ao mesmo tempo — 03-life para o
calor e a luz, 02-intelligence para a malha. Com só a primeira, o modelo
devolvia os nós como esferas 3D sombreadas, o vocabulário rejeitado na v1. A
malha aprovada são discos **chatos, opacos, azul-marinho**, de tamanhos
variados, ligados por fios finíssimos: desenhados, não modelados. Vale dizer
isso literalmente no prompt, e proibir esfera/bola/pérola/nó tridimensional por
escrito.

### Trechos — `kling3_0`, `mode: pro`, `duration: 5`, 16:9

Único modelo do catálogo que aceita `start_image` e `end_image` juntos, o que
ancora cada clipe nas chaves. Saída 1928 × 1076, 24 fps, ~8,75 créditos cada.

| Trecho | Job ID | De → para |
|---|---|---|
| idle Matter | `500bc7d8-ffa1-46d5-bdc2-39593cbd19ed` | Matter → Matter |
| A | `d36cc479-976e-4c4e-bb1e-e05a70c36d77` | Matter → Intelligence |
| B1 | `dad2e3ba-95dd-4105-b487-0da2a2c8731d` | Intelligence → Meio |
| B2 | `869d68cd-588f-43b1-b036-7236b77ee6a8` | Meio → Life |
| C2 | `cf2b6d4b-3c21-4757-bdef-fdf2357e56cd` | Life → Fecho |

O que faz o morph funcionar é descrever o **mecanismo**, não o resultado: em vez
de "vira tecido vivo", "as bordas se descolam, levantam, enrolam para fora e
varrem por cima das aberturas, que se fecham".

**Sobre pedir movimento sutil:** a primeira tentativa de clipe de repouso
(`09d326fc`) usava as palavras "calmo", "em repouso", "quase imperceptível". O
modelo congelou: 92 de 120 quadros quase-duplicados. A segunda descreve o
movimento em termos concretos e verificáveis ("a massa incha e contrai", "as
membranas ondulam continuamente", "partículas atravessam sem parar") e proíbe
parar por escrito. Resultado: 25 de 120. Descrever *o que se move* funciona;
pedir *pouco movimento* faz o modelo entregar nenhum.

Nota operacional: prompts assim disparam a recomendação do preset "IN THE DARK"
do Higgsfield. É preciso declinar com `declined_preset_id` e reenviar literal.

---

## Pós-produção

Tudo em `.claude/premise/build.sh`, que reconstrói o master de ponta a ponta e
documenta cada escolha. Rodar com `bash .claude/premise/build.sh` (as entradas ficam em `_source/premise/`, que não é versionado).

**Nada de `zoompan`.** Foi a causa do tremor.

**`aq-mode=3` e `mbtree=0` não são cosmética.** Por padrão o x264 gasta quase
nada em regiões quietas, e a abertura é quieta de propósito. Em CRF 25 puro ele
quantizou a abertura chapada e produziu **uma sequência de 18 quadros (750 ms)
congelada a partir do quadro 6, com 22 dos 24 primeiros quadros idênticos** — o
encoder recriando exatamente o defeito que o corte existe para corrigir. Com os
dois ajustes: quadros parados na abertura 81 → 48, maior pausa 750 ms → 500 ms,
e ela migra para o quadro 96, que é a virada do vai-e-volta, onde a fonte tem a
sua própria pausa natural.

**1600 × 900, não 1920 × 1080.** Os bits extras iam todos num upscale de 20% de
gradientes suaves, que ninguém vê, e custavam 2,8 MB: 8,7 MB a 1920 contra
5,9 MB a 1600 para o mesmo movimento medido. 5,9 MB é o que pesava o corte
anterior de 20,5 s — o filme ficou 4,6 s mais longo de graça.

Stills gerados dos PNG originais, não de quadros do vídeo:

```
ffmpeg -i <chave>.png -vf "crop=2731:1536:10:0,scale=2200:1238" \
  -quality 76 -compression_level 6 <stage>.webp
```

---

## Verificação

O painel de preview **não dispara rAF nem IntersectionObserver**, e o seu
relógio de animação fica parado em zero. Isso já esconde bugs duas vezes nesta
seção, então o que se verifica aqui é numérico e geométrico, não visual.

Scripts em `.claude/premise/checks/`:

- `motion.py` — deslocamento global por quadro e variação entre quadros.
  Separa **tremor** (inversões de sinal em alta frequência) de **travamento**
  (sequências de quadros quase idênticos). Foi o que provou o diagnóstico do
  `zoompan` e o que aprovou cada clipe novo.
- `film_audit.py` — o mesmo por beat, mais a garantia de que a coluna de texto
  fica ivory em todos os 602 quadros (o pixel mais escuro que já apareceu ali
  foi 233 de 255).
- `frame_audit.py` — audita uma chave contra os **dois** recortes que a página
  realmente aplica: o `object-fit: cover` e o véu de ivory do texto. Trata os
  dois sentidos do cover, porque um palco mais estreito que 16:9 corta a
  largura e não a altura.
- `timing.py` — o corte e as legendas num só lugar, com as invariantes
  afirmadas como código.

O fecho foi conferido em toda a faixa real de aspecto do palco, de 1,72:1
(laptop 1440×900) a 2,64:1 (janela baixa e larga). Calor na zona limpa entre
+89,0 e +91,0, massa quente 2,6:1 a 2,9:1 à direita em todos eles.

O ajuste de layout foi medido em 360×640, 390×667, 390×844, 768×1024, 880×620,
1440×720, 1440×900, 1920×560 e 1920×1080 — a coluna de texto cabe no palco
fixado em todos, sem transbordo horizontal. Duas consultas de mídia por altura
existem porque uma janela desktop de meia altura tem tão pouco espaço vertical
quanto um telefone: a 1920×560 a coluna estourava por 16 px.

### O vídeo exige HTTP Range no servidor

`python -m http.server` **não** implementa Range; o GitHub Pages implementa.
Para testar local:

```
python .claude/devserver.py 8128
```

Sem Range o navegador reporta `video.seekable = [0, 0]`. Isso importava muito
mais quando o clipe era raspado (toda atribuição de `currentTime` era truncada
para 0 em silêncio, e a figura congelava no primeiro quadro). Hoje o clipe só
toca, mas o servidor com Range continua sendo o jeito de testar de verdade.

O código detecta falha sozinho e troca para o crossfade das imagens,
registrando o motivo em `data-fallback` na seção. A figura nunca fica parada.
`data-phase` expõe a fase para diagnóstico de fora — foi assim que se pegou o
observador que nunca disparava porque o threshold era inalcançável (a seção tem
200vh, então numa janela de 900px a sua razão de interseção não passa de 0,5, e
o threshold era 0,55; hoje observa-se o palco, que tem uma janela de altura).

---

## Arquivos

**Publicados** — `assets/premise/` (6,8 MB)

| Arquivo | Tamanho | Usado em |
|---|---|---|
| `premise-sequence.mp4` | 5,9 MB | 1600 × 900, 25,08 s, desktop |
| `stage-01-matter.webp` | 199 KB | pôster + mobile + reduced-motion |
| `stage-02-intelligence.webp` | 173 KB | crossfade mobile + reduced-motion |
| `stage-03-life.webp` | 55 KB | idem |
| `stage-04-fecho.webp` | 135 KB | idem |

Custo por visita: **~6,5 MB no desktop**, **562 KB no mobile** (o clipe nunca é
requisitado), **562 KB em reduced-motion**.

**Fonte, não publicada** — `_source/premise/` (no .gitignore): as 5 chaves em
2752 px, os clipes brutos, os 8 segmentos montados, o `build.sh`, e as pastas
das versões rejeitadas.
