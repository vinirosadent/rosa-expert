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

**v5.** Cinco correções: tremor da abertura, tempos, tipografia, sincronia e o
fecho recortado. Detalhes na tabela abaixo — todas continuam valendo, e a v6 as
levou adiante em três pontos.

**v6 — atual.** Quatro coisas:

| problema relatado | causa | correção |
|---|---|---|
| "o fade no começo está bom mas não ótimo, ele já começa com material e fica no vai e vem" | a abertura precisava de 8,5 s e o clipe de repouso tinha 4,25 s, então tocava adiante-e-atrás; a virada era perceptível | a abertura passou a ser **pontos que se tornam Matter** — deriva pura, formação, consolidação. Nada mais é revertido |
| "quase nem dá pra ver a parte materials" | eu tinha corrigido demais na v5: empurrei o calor para a zona limpa e a espuma mineral virou mancha de canto | fecho reproporcionado — presença mineral 55,0 → 94,0, calor mantido em +81,6 |
| "as fontes ainda pequenas" | 32,8px no nome do estágio ainda era escala de legenda, não de cartela | nome do estágio 41,6px, título 49,6px, corpo 21,5px |
| "a transição de 1 para 2 é muito rápida" | `transA` estava comprimida a 2,90 s (1,45×) | 4,30 s de 4,20 s de fonte — praticamente tempo real, e agora a **transição mais longa do filme**, o que `checks/timing.py` exige |

A abertura de pontos custou três clipes porque o kling **não** segura a
transformação a pedido. Pedi duas vezes, em termos cada vez mais explícitos, que
os pontos derivassem por quatro quintos do plano e só então fechassem em
material: nas duas o material estava pronto em 0,6 s. Com `start_image` e
`end_image` ele interpola entre os dois e adianta a maior mudança. **Ritmo se
resolve na montagem, não no prompt** — a solução foi um clipe de pontos com eles
mesmos para a deriva longa, e o clipe de formação depois.

### O que a v5 corrigiu

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

26,38 s, 633 quadros a 24 fps. As frações estão em `index.html` e são contadas
do master pronto, quadro a quadro — não das durações pretendidas, porque os
trechos interpolados aterram alguns quadros curtos e estimar poria toda legenda
levemente fora de lugar.

| beat | quadros | fração | imagem | texto |
|---|---|---|---|---|
| converge | 92 | 0,000–0,145 | pontos se organizando na forma | texto da premissa |
| materia | 59 | 0,145–0,238 | os pontos se fundem em material | idem |
| matter | 46 | 0,238–0,310 | matéria formada, viva | **01 Matter** |
| transA | 101 | 0,310–0,469 | reorganizando | 01 sai, 02 entra |
| intel | 41 | 0,469–0,534 | a malha descansa | **02 Intelligence** |
| peel | 63 | 0,534–0,633 | descolando, ainda frio | 02 sai |
| unfurl | 63 | 0,633–0,732 | desdobrando, o calor chega | 03 entra |
| life | 46 | 0,732–0,805 | Life descansa | **03 Life** |
| recuo | 68 | 0,805–0,912 | a câmera recua | 03 sai, título volta |
| todo | 54 | 0,912–1,000 | os três estratos | **título de fecho** |

Seis regras governam as janelas de texto. Três existem porque uma versão
publicada as quebrou:

1. duas peças de texto nunca são legíveis ao mesmo tempo;
2. nenhuma legenda fica legível sobre um estado que ela não nomeia;
3. a legenda 01 não pode aparecer antes de o material existir — ela espera a
   consolidação, porque nomear matéria sobre uma nuvem de pontos descreveria
   algo que não está na tela;
4. cada legenda fica 2,4 s ou mais totalmente opaca;
5. o título de fecho fica opaco quando a imagem final assenta;
6. matter→intelligence é a transição mais longa do filme.

Ambas são verificadas por programa (`.claude/premise/checks/timing.py`), não por intenção,
e um segundo script confere que as constantes em `index.html` reproduzem a
tabela verificada — inclusive as travessias de imagem do caminho mobile, que
caem com diferença de 0,00 s das suas legendas.

### A abertura é a linguagem do hero

O hero são 160 mil pontos que tomam a forma das coisas. Esta seção abre do mesmo
jeito: uma nuvem dispersa **se organiza na forma do scaffold**, e só então se
funde em material — sob a frase *Designing the materials that should exist*.

Isso exige uma chave intermédia, `00b-pontos-forma`: o scaffold desenhado
**inteiramente em pontos**, silhueta certa e poros certos, nada sólido. É a
mesma lição do `02b-meio` — sem uma chave no meio o modelo atalha. Duas
tentativas de pedir num só clipe, de pontos dispersos direto a material sólido,
entregaram material pronto em 0,6 s; e um clipe dos pontos com eles mesmos só
produzia deriva sem rumo ("pontos que vão e vêm"), que é movimento sem intenção.

A cadeia é `00-pontos → 00b-pontos-forma → 01-matter`, e com ela **todas as
emendas do filme voltaram a ser contínuas quadro a quadro** — o dissolve de
0,25 s que existia na abertura deixou de ser necessário.

Não dá para usar a transição para isto: medida quadro a quadro, `transA` já
mostra pontos de malha em 2,0 s, e o andaime só continua legível como andaime
até ~1,5 s.

### Os platôs não são congelamentos

Cada platô é a **cauda do próprio clipe**, tocada bem devagar com interpolação
compensada por movimento. Congelamentos de verdade poriam 6,5 s de quadros
literalmente mortos num filme de 25,5 s.

---

## Telefone

O telefone recebe **outro corte do mesmo filme**: `premise-mobile.mp4`,
720 × 900 (4:5), 2,0 MB contra os 6,9 MB do desktop. Mesma duração e mesmos
633 quadros, então a tabela de legendas serve para os dois sem ajuste — e
`checks/shipped.py` verifica isso, porque uma divergência dessincronizaria o
telefone em silêncio.

Não é o 16:9 espremido numa faixa. O 16:9 tem o terço esquerdo deliberadamente
**vazio**, porque no desktop o texto fica por cima dali; no telefone o texto
fica **abaixo**, e esse vazio seria só ecrã desperdiçado. O corte é fixo em
x = 880 de 1600 porque dá para ser: medido nos dez beats, o centro de massa do
conteúdo varia só de 0,71 a 0,77 da largura, e a massa corre para fora pela
direita.

### O buraco entre a imagem e a palavra

A coluna de texto nunca reflui: a cópia de abertura continua no fluxo com
opacidade 0 enquanto a legenda aparece. No desktop isso é invisível, porque a
coluna fica **ao lado** da imagem. No telefone ela fica **abaixo**, e a legenda
passava a aparecer depois de ~226 px de texto invisível — um buraco entre a
figura e a palavra que media zero em qualquer teste de espaço livre, porque o
espaço não estava livre, estava ocupado por texto que não se vê.

A correção é empilhar: no telefone a abertura e as legendas ocupam a **mesma
célula** de grade, então a coluna tem a altura do **maior** dos dois estados em
vez da **soma**. Encurta ~150 px, e é esse espaço que deixa a imagem ser
retrato — de 35% para 61% da tela num 390 × 844.

O `h2` continua sendo **um** elemento que nunca se move: quem carrega as duas
aparições é o invólucro `.premise-lede`, e no fecho só o `h2` fica visível
dentro dele. Verificado: o topo do título é o mesmo nos quatro estados.

### A caixa das legendas é medida, não escrita à mão

O `clamp` reservava 181 px para uma legenda de 127 num 390 × 844, e 216 para
156 no desktop. Esses pixels saíam directamente do tamanho da imagem.
`ajustarCaixa()` mede a legenda mais alta no layout real e fixa a caixa nela —
exacto em qualquer ecrã, com qualquer tipo carregado, e não envelhece se o
texto mudar.

### Medido

| tela | imagem | proporção da caixa | sobra vazia |
|---|---|---|---|
| 360 × 640 | 55% | 1,15 | 0 |
| 390 × 844 | 61% | 0,83 | 0 |
| 430 × 932 | 65% | 0,78 | 0 |

O layout é uma coluna flex, não percentagens: a cópia ocupa a altura de que
precisa e a imagem fica com todo o resto, o que torna impossível sobrar faixa
branca em qualquer telefone.

**Não é limitação do GitHub Pages.** Ele serve qualquer ficheiro. O telefone
recebia imagens porque o código estava escrito assim, para não gastar 6,9 MB de
dados móveis. Hoje `Save-Data` é o único motivo restante para servir imagens.

---

## A passagem do hero para esta seção

O hero da home é um motor WebGL de 160 mil pontos. Quando esta seção passou a
abrir numa nuvem de pontos, os dois ficaram a falar a mesma língua sem que isso
fosse intencional — e em registos opostos, o hero em azul-noite e a premissa em
ivory claro. Em vez de deixar como coincidência, a emenda passou a ser
deliberada: ao sair do hero, os seus pontos **perdem coesão e clareiam até o
ivory desta seção**, que então abre nos seus.

A questão de fazer deste filme o hero foi considerada e recusada. O hero precisa
dizer de quem é o site em dois segundos — retrato, nome, tese, duas portas; o
filme precisa de 25 s para dizer uma coisa. E o fecho do filme só aterra como
conclusão porque a tese foi afirmada lá em cima: como abertura, não sobraria
nada para resolver. Somam-se 6,9 MB que hoje ficam fora da rota crítica e que o
mobile nunca baixa.

A dispersão vive no vertex shader do hero, em `index.html`, em dois uniforms:

| uniform | o que faz |
|---|---|
| `uScatter` | desloca cada ponto; fica em 0 sob `prefers-reduced-motion` |
| `uLeave` | clareia para o ivory, engorda o ponto e apaga |

São **três curvas deliberadamente defasadas**: os pontos primeiro ANDAM, depois
PALIDECEM, e só no fim DESAPARECEM. Se as três andassem juntas seria um
crossfade; é a defasagem que faz a saída parecer desenhada. Medido no
navegador, renderizando o shader e lendo os pixels:

| `uLeave` | espalhamento | alfa | distância ao ivory |
|---|---|---|---|
| 0,00 | 48,1 | 28 | 292 |
| 0,25 | 48,1 | 28 | 276 |
| 0,50 | 59,1 | 26 | 151 |
| 0,65 | 75,1 | 21 | 66 |
| 0,80 | — | 14 | 19 |
| 1,00 | nada visível | 0 | — |

A direção é radial (a forma se abre de si mesma) com uma parcela aleatória:
radial puro parece explosão, aleatório puro parece ruído, e perder coesão é o
meio-termo. Há um viés para baixo, porque o hero tem `overflow:hidden` e a borda
de baixo é onde esta seção começa — os pontos que descem são cortados ali, o que
lê como a matéria passando para a seção seguinte em vez de sumir no nada.

O acionamento é função pura do scroll, então **subir de volta reagrupa a forma
sozinho**. Completa em 0,88 da altura do hero, um pouco antes de o palco fixar.
O filme da premissa começa a tocar antes disso, com o hero a meio da dispersão:
os dois campos de pontos coexistem por um instante, o de baixo nítido e o de
cima a dissolver-se. Isso é o efeito, não um defeito.

Efeito colateral: quando `uLeave` chega a 1 o desenho para, o que poupa 160 mil
pontos por quadro em todo o resto da página.

Nada disto é visível às ferramentas offline — o painel de preview não dispara
rAF e o seu relógio de animação fica parado em zero. O que `checks/shipped.py`
consegue garantir é que as peças continuam ligadas; os números acima foram
medidos uma vez, no navegador, compilando o shader num contexto à parte e
usando `readPixels`, que funciona sem a página compor quadros.

---

## Cadeia de proveniência

```
00-pontos ─┬─> deriva (pontos consigo mesmos)  ── deriva
           └─> 01-matter ──> 02-intelligence ──> 02b-meio ──> 03-life ──> 04-fecho
                └ forma ┘      └ transA ┘   └ transB1 ┘ └ transB2 ┘ └ transC3 ┘
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
| 00 Pontos (dispersos) | `511f780b-3fa3-4af2-a8a7-71e60aa76e4c` |
| 00b Pontos na forma | `2e0de1eb-5e53-4b08-aa72-48ca044d7ab6` |
| 01 Matter | `69e6b1ee-587b-400e-bd94-7ab4183653cf` |
| 02 Intelligence | `26a74527-1cbf-4059-9453-a8d7ef84ce01` |
| 02b Meio | `cc5fd49d-cee7-4bd9-9a26-080b3a018e18` |
| 03 Life | `71ad741b-63ad-4352-87bd-3365a27eae8b` |
| 04 Fecho (empilhado, reproporcionado) | `cc6bf568-bdf3-4228-bf1e-cf6158fef59e` |

O **00 Pontos** é o 01 Matter editado: mesma câmera, mesma silhueta, mesma luz,
mas a massa sólida trocada por uma suspensão de partículas chatas sem nada
ligando-as. Manter câmera e silhueta é o que faz a formação aterrar no lugar.

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

| Trecho | Job ID | De → para | usado |
|---|---|---|---|
| converge | `66e18a23-efb4-4d17-9c71-0ffdeb30c747` | Pontos → Pontos na forma | sim |
| materia | `b3129037-9670-421c-ab7b-e1cfb4260662` | Pontos na forma → Matter | sim |
| deriva (sem rumo) | `d10cb6fe-28db-4fa7-ba34-6faeb99d16da` | Pontos → Pontos | não |
| forma (2ª tentativa) | `7e130e71-a471-4149-8e9b-2db7230fd414` | Pontos → Matter | não |
| forma (1ª tentativa) | `43bc0ecd-d4a3-4da6-8cff-10060d082aad` | Pontos → Matter | não |
| idle Matter | `500bc7d8-ffa1-46d5-bdc2-39593cbd19ed` | Matter → Matter | não |
| A | `d36cc479-976e-4c4e-bb1e-e05a70c36d77` | Matter → Intelligence | sim |
| B1 | `dad2e3ba-95dd-4105-b487-0da2a2c8731d` | Intelligence → Meio | sim |
| B2 | `869d68cd-588f-43b1-b036-7236b77ee6a8` | Meio → Life | sim |
| C3 | `3af027ff-bf51-4326-b690-1a8946712347` | Life → Fecho | sim |

O que faz o morph funcionar é descrever o **mecanismo**, não o resultado: em vez
de "vira tecido vivo", "as bordas se descolam, levantam, enrolam para fora e
varrem por cima das aberturas, que se fecham".

**Sobre pedir ritmo interno:** não funciona. As duas tentativas de fazer os
pontos derivarem por quatro quintos do plano antes de formar o material
entregaram material pronto em 0,6 s, mesmo com a instrução em maiúsculas e
repetida. Com `start_image` e `end_image` o modelo interpola entre os dois e
adianta a maior mudança; não há como pedir que ele espere. A saída foi um clipe
do estado inicial consigo mesmo, que não tem para onde interpolar e por isso
fica onde está.

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
  fica ivory em todos os 633 quadros (o pixel mais escuro que já apareceu ali
  foi 235 de 255). O detector de tremor conta **reversões de alta frequência**
  (sequências de 1–2 quadros entre trocas de sinal) por 100 quadros, não trocas
  de sinal absolutas: contar todas acusava três beats perfeitamente lisos, porque
  num beat que transforma muito o deslocamento estimado cruza zero por ruído.
  Referências medidas: a deriva do `zoompan` que tremia dá **11 por 100**; todos
  os beats deste filme ficam abaixo de 3,5.
- `strata.py` — mede se cada um dos três estratos está de fato **presente** no
  quadro de fecho, dentro do que a página mostra e deixa passar. Calor sozinho
  não pega o problema, porque o estrato mineral se define por não ter calor;
  então mede também distância do ivory e contraste local, que é o que separa
  material de verdade de um tingimento fraco.
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
| `premise-sequence.mp4` | 7,7 MB | 1600 × 900, 26,38 s, desktop |
| `stage-00-pontos.webp` | 31 KB | pôster + crossfade mobile |
| `stage-01-matter.webp` | 199 KB | crossfade mobile + reduced-motion |
| `stage-02-intelligence.webp` | 173 KB | idem |
| `stage-03-life.webp` | 55 KB | idem |
| `stage-04-fecho.webp` | 142 KB | idem |

Custo por visita: **~7,5 MB no desktop**, **600 KB no mobile** (o clipe nunca é
requisitado), **600 KB em reduced-motion**.

O mp4 subiu 1 MB com a abertura de pontos: partículas finas sobre fundo liso são
detalhe de alta frequência e caro de comprimir. É o preço de os pontos existirem.

**Fonte, não publicada** — `_source/premise/` (no .gitignore): as 5 chaves em
2752 px, os clipes brutos, os 8 segmentos montados, o `build.sh`, e as pastas
das versões rejeitadas.
