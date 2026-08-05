# rosa.expert

Site estático do laboratório do A/P Vinicius Rosa (NUS). HTML/CSS/JS puro, sem
build system, sem framework, sem dependências. Publicado por GitHub Pages a
partir de `main` — o que está no repositório é o que está no ar.

Vinicius escreve em português; responda em português. **Respostas curtas:**
entregue a conclusão em poucas linhas. Números, medições e raciocínio vão para a
mensagem de commit e para os logs do projeto, não para o chat.

**O conteúdo vem dele.** Não invente texto, dado, data, link, autoria ou
métrica. Falta de conteúdo vira placeholder explícito e uma pergunta — nunca
prosa plausível. Esta é a regra que mais custa caro quebrar: o site é o registro
público de um pesquisador, e uma frase inventada é indistinguível de uma frase
verdadeira para quem lê.

---

## O sistema de design é compartilhado — parta dele, não o reinvente

Três arquivos governam a aparência de tudo:

- `assets/css/tokens.css` — cor, tipografia, espaçamento, containers.
  `--container-base: 1180px` e `--gutter: clamp(1.25rem, 5vw, 4rem)` definem a
  margem do site. Hero, seção e imagem se alinham a essa margem; **nada de
  `width:100vw`** escapando das bordas do header. Para uma imagem "sangrar", use
  máscara/feather nas bordas, não largura maior que o container.
- `assets/css/components.css` — cards, botões, badges, footer.
- `assets/js/shared.js` — **injeta header e footer em runtime**. Detecta se a
  página está em `news/`, `publications/` ou `research/` e reescreve todos os
  `href`/`src` com prefixo `../`. O nav é a constante `NAV` ali dentro; hoje:
  Home · Who · **Living Matter Engines** · **Matter for Vitality** · To read ·
  News · Contact. Trocar um rótulo é editar `NAV`, não sete arquivos.

Componente novo só quando o sistema existente comprovadamente não resolve.

---

## Mapa

```
index.html  who.html  publications.html  news.html  contact.html  research.html
news/<slug>.html          41 páginas de notícia
publications/<slug>.html   9 Article Spotlights
research/<slug>.html       páginas de programa (imersivas)
assets/js/data/pubs.js     fonte das publicações  (PUBS)
assets/js/data/news.js     fonte das notícias
assets/spotlights/<slug>/  figuras + card.png de cada spotlight
Research papers/           PDFs dos artigos + Handoffs/
```

### Quatro arquétipos de página

1. **Conteúdo** — `index`, `who`, `publications`, `news`, `contact`. Chrome
   compartilhado, container 1180, tema claro.
2. **Notícia** — `news/<slug>.html`. Layout `.art-*` e seletor de idioma na
   própria página: `data-lang` em `en · es · pt · fr · zh`. As cinco versões
   convivem no mesmo arquivo.
3. **Article Spotlight** — `publications/<slug>.html`. Página modular por artigo:
   header fixo, hero editorial + caixa do registro do paper, fast-facts, faixa
   azul de números, seções de leitura com trilho lateral (figura / pull-quote /
   key-result / what's-next), bloco de citação, footer. Referência canônica:
   `publications/designing-c3s-cements-on-demand.html`.
   Essas páginas **não carregam `shared.js`** — o header é próprio. Por isso é
   fácil elas ficarem sem o nav global; toda spotlight tem de trazer
   Home · Who · To read · News · Contact + "Read full paper", responsivo.
4. **Programa / pilar** — `research/*.html`. Tema escuro imersivo montado **por
   cima do chrome compartilhado**: `tokens.css` + `components.css` +
   `shared.js`, conteúdo dentro de `<div id="app">`, largura 1180. As classes de
   conteúdo são prefixadas por página (ex.: `vp*` em `pulp-regeneration.html`)
   para não colidir com o CSS global.

---

## A seção "The premise" na home tem um ponto de retorno

A seção fixada Matter → Intelligence → Life (`index.html`, `<section
id="premise">`) foi aprovada e marcada como **`premissa-v1`**.

Qualquer alteração parte daí. Se não ficar boa, volta-se a esse estado:

```
git checkout premissa-v1 -- index.html assets/premise .claude/premise
```

`git show premissa-v1` descreve a versão inteira: a linha do tempo, os pesos, as
invariantes e o que já foi tentado e rejeitado.

### Antes de commitar qualquer mudança nessa seção

```
py .claude/premise/checks/timing.py      # a tabela do corte e as 7 invariantes
py .claude/premise/checks/shipped.py     # index.html reproduz a tabela
py .claude/premise/checks/film_audit.py  # tremor, beats mortos, coluna ivory
```

Os três têm de passar. **Não são cerimônia:** cada invariante existe porque a
seção errou aquilo pelo menos uma vez, e o erro era invisível numa captura de
tela. A mais teimosa: *a matéria não pode começar a mudar enquanto a legenda 01
ainda está sendo lida* — isso quebrou de três formas diferentes.

Para reconstruir o filme: `bash .claude/premise/build.sh`. As entradas ficam em
`_source/premise/`, que **não** é versionado (arquivos grandes). Os job IDs de
tudo estão em `PREMISE-GENERATION-LOG.md`, então dá para regerar.

O telefone recebe **outro corte**, `premise-mobile.mp4`, 4:5 — não o 16:9
espremido numa faixa. Os dois arquivos têm de ter a mesma duração e o mesmo
número de quadros, porque compartilham uma só tabela de legendas; `shipped.py`
verifica isso.

### O que já foi tentado nessa seção e rejeitado

Não repita sem motivo novo:

- **scroll raspando o clipe** — dessincronizava texto e imagem;
- **deriva de câmera com `zoompan`** — treme, porque o filtro arredonda o corte
  para pixel inteiro (medido: 10 inversões de sinal por 100 quadros);
- **quatro aberturas com movimento de imagem**, incluindo partículas WebGL reais
  amostradas do próprio scaffold — todas lidas como pesadas ou arbitrárias. A
  abertura hoje é só a premissa em ivory, e carrega o movimento na tipografia.

### O hero acima dela

Texto à esquerda, dente à direita. Quando o enquadramento não fecha, mova **a
imagem** para acompanhar o glow (~71% da largura); nunca recentre o glow para
deixar um dente centralizado — isso devolve o site aos anos 90.

---

## Heros de matéria com motivo de pontos

`news/<slug>.html` pode trocar a fotografia por um campo de pontos animado
(`assets/js/news-hero-motif.js`), o mesmo mecanismo do hero da home: N
partículas migram entre formas. Hoje: `molar-pdl` (JCP) e `petri-paper`
(guidance paper). O motivo vem do Vinicius, matéria por matéria.

### As alturas-limite são o bloco de leitura, medido — não uma fração

**O alto do motivo alinha com o alto do `.na-h1` e a base com o fim do
`.na-deck`.** Vinicius marcou essas duas linhas à mão sobre a página; são
elas, não a `.na-hero-copy` inteira (que começa na linha de metadados, ~30px
acima) e não uma fração de altura.

Fração fixa não serve, e isso custou três rodadas: `.na-hero` centra o próprio
conteúdo por flex, então um headline longo empurra o hero acima do
`min-height` e a fração onde o texto começa **muda de página para página**. O
mesmo vale para a máscara que protege a `.na-topbar` — a topbar tem altura
fixa em pixels, então reservá-la como fração de `H` dobra a folga num hero
alto. O motor mede `getBoundingClientRect()` das duas coisas (`matchCopy`) e
usa pixels; a fração sobrou só como piso de segurança se a medida falhar.

### O laranja é um elemento por forma, nunca uma segunda cor de peso

A paleta é a do site, mas herdar o `INK` de um motivo para outro sem herdar a
razão dele é erro: em `molar-pdl` o teal tem peso igual ao azul porque o
ligamento *é* um tecido à parte do dente e do osso. Em `petri-paper` não havia
nada equivalente, e teal + laranja brigavam sem hierarquia. Cada motivo
declara o próprio `ink`/`far`.

O acento só entra onde significa alguma coisa, e uma vez por forma. Células na
borda da placa em laranja não diziam nada — são as mesmas células do meio, só
que na periferia. O laranja nasce na transição para o gráfico, quando essas
partículas passam a ser a curva de viabilidade.

### Verificar sem browser

O sandbox não instala Chromium, e validação só numérica já deixou passar
figura ilegível com todos os limites corretos. `.claude/motif/` roda o JS real
em Node contra um canvas stub, rasteriza com PIL e deixa **olhar** o quadro.
Os defeitos que só apareceram assim estão listados no README de lá.

---

## Publicações e spotlights

`assets/js/data/pubs.js` alimenta os cards e o arquivo. Cada entrada pode ter
`doi`, `spotlight`, `thumb`, `featured`, `category` (`bio` | `regen` | `ai`).
Todas as publicações têm link de DOI verificado, com uma exceção conhecida
(Yang, *Pediatric Dentistry* — não tem DOI). `publications.html` tem um botão
**Cite** próprio da página, que copia a citação do card ou da linha do arquivo.

**Verifique antes de construir.** `pubs.js` já esteve errado sobre autoria e
citação. Confira no PubMed o primeiro autor, o journal, o ano, o volume e as
páginas antes de escrever o bloco de citação de uma spotlight — um erro já
passou desse jeito (o *Guidance paper* é Sriram G, *Dent Mater* 2024;40(11):
1773–1785).

Os cards em destaque de `publications.html` devem ser justamente os papers que
têm spotlight.

### Handoff das spotlights

`Research papers/Handoffs/` guarda um `HANDOFF-<slug>.md` por página, mais um
`README.md`. **Leia a pasta antes de qualquer trabalho de figura** — ela diz o
que já foi decidido. No fim, quando figuras e texto estiverem fechados,
*pergunte* se falta algo e só então escreva o handoff da página.

---

## Figuras

- **Nada de "cara de IA".** Nem fotorrealismo, nem CGI, nem brilho de render.
  O registro é editorial/aquarela, matte. Páginas escuras de polpa mantêm a
  identidade `#120C0E` — não abra uma placa clara no meio.
- **Precisão anatômica e científica é obrigatória.** Verifique a estrutura ou o
  processo real antes de gerar qualquer coisa, em qualquer tema; entregue à IA
  um esboço anatômico rotulado + a referência de estilo, e cheque proporções.
  Exemplo caro: a ordem das camadas no capeamento pulpar direto.
- **Toda tipografia é HTML.** Nenhum texto embutido em imagem. **Uma exceção:**
  o wordmark do próprio periódico, quando o periódico é o assunto da matéria
  (entrada em corpo editorial, editor associado, conselho consultivo). Aí a
  identidade gráfica *é* a informação — o JDR tem tipografia reconhecível,
  "Dental Materials" é lido pelo azul da capa. Mas ele vem da **capa real,
  editada**, nunca gerado do zero: difusão desenha uma aproximação da fonte, e
  num wordmark conhecido "quase certo" lê como falsificação. O fluxo está em
  `news/Assets/drop/PROMPTS-HERO-PERIODICOS.md`.
- **Proporções por posição** na spotlight: 24:9 (faixa), 16:9 (panorâmica),
  4:3 (par lado a lado), 3:4 (figura de margem, alta).
- **A figura de margem 3:4 é a armadilha recorrente:** a prosa ao lado precisa
  *preencher* a altura dela — na prática ≥3 parágrafos mais a caixa teal de
  interpretação. Aquelas ~83 palavras são o piso, não a meta; abaixo disso sobra
  um rasgo branco ao lado da imagem.
- **Graphical abstract** entra, quando entra, como bloco opcional no fim da
  página, largura total, clique para ampliar — sempre secundário ao hero, e
  **pergunte antes**: costumam ser densos e enfatizar o ponto secundário do
  paper.
- Ao publicar uma notícia, cheque a capa na home: se a matéria aparece lá, o
  card precisa da imagem, recortada de propósito para o formato do card.

---

## Regras de escrita que já foram corrigidas

- Sem artigo antes de "A/P Rosa" — "A/P Rosa led…", não "the A/P Rosa".
- Cargos no ADM: **"appointed"**, não "elected".
- Os eixos de `research/matter-for-vitality.html` são **Matter · Tissue ·
  Innovation**. Nunca "Method", nunca "Pillars". *Reading the field* é uma
  seção à parte, não um eixo.
- Regeneração de polpa não é overclaim: "pulp-like tissue", "experimental
  models". Nada de "AI-guided", nada de "standards".
- Pull-quotes são centrados.
- Nada de estatística vaidosa nas páginas de pilar (nº de citações, rankings).

---

## Testar localmente

```
python .claude/devserver.py 8128
```

Use este servidor, **não** `python -m http.server`: aquele não implementa HTTP
Range, e sem Range o navegador reporta `video.seekable = [0,0]`. Já custou um
diagnóstico inteiro.

---

## Armadilhas do ambiente

- **O repositório mora no Google Drive** (`My Drive/Claude Projects/rosa-expert`).
  Agentes que rodam em sandbox montado não conseguem escrever `.git` nem dar
  push. O fluxo é: o agente prepara os arquivos e a mensagem exata de commit, e
  Vinicius commita pelo GitHub Desktop ou PowerShell. Ofereça isso nos marcos.
- **Escrita pelo mount do Drive já corrompeu arquivo em silêncio.** Sintoma:
  padding de bytes NUL depois do `</html>`, invisível ao reler o arquivo, mas o
  `grep` passa a tratá-lo como binário. Medido hoje: 622–645 bytes de NUL em
  todos os 9 arquivos de `publications/`. Como conferir e limpar:

  ```
  tr -cd '\000' < arquivo.html | wc -c        # tem de dar 0
  ```

  Quando der diferente de zero, reescreva o arquivo fora do mount e copie por
  cima com `cp`.
- **O painel de preview do Claude Code não dispara `requestAnimationFrame`** e o
  relógio de animação fica parado em zero. Verificação de animação aqui é
  numérica e geométrica, nunca visual — foi isso que escondeu dois bugs.

---

## Convenções

- Comentários e mensagens de commit explicam **por quê**, não o quê — de
  preferência com o número que motivou a decisão. O histórico da seção premise é
  a referência do tom.
- Tokens de design em `assets/css/tokens.css`. Use-os; mas o token não é lei:
  `--ease-out` é um expo-out e está errado para varreduras, por exemplo.
- Mudança é mínima e dirigida: não reescreva o que não foi pedido, e não
  redesenhe área já aprovada sem pedido explícito.
- Toda página tem de funcionar em desktop, tablet e telefone, sem scroll
  horizontal.
