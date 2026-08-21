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
2. **Notícia** — `news/<slug>.html`. Layout `.na-*` (de
   `assets/css/news-article.css`, folha **compartilhada por ~42 páginas** — toda
   edição na regra base tem raio de alcance do site inteiro; prefira uma classe
   modificadora) e seletor de idioma na própria página: `data-lang` em
   `en · es · pt · fr · zh · ar`. As seis versões convivem no mesmo arquivo.
   **Só o dicionário árabe é escrito com entidades** (`&#xHEX;`); es/pt/fr/zh
   ficam em UTF-8 literal dentro do literal JS — não "padronize" isso.
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

## Figuras animadas dentro de página

Vale para o motivo de pontos do hero, a rede de `news.html`, a trajetória de
ranking (`assets/js/rank-trajectory.js`) e os fundos das páginas de programa.
Sem framework: JS vanilla + DOM/SVG/canvas por `requestAnimationFrame`.

### Peça vinda do Claude Design

O `.zip` que o Vinicius exporta traz um componente **React** sobre um motor de
composição próprio, pensado para **export de vídeo** — não dá para publicar como
está. Reimplemente a coreografia em vanilla e reancorе nos tokens: `OM_SCENES` dá
a linha do tempo (cues = soma acumulada das durações), copie as curvas de easing
**literalmente** (confira qual é o *default* de `animate()` antes de assumir — o
original usa `easeOutCubic`, e trocar por `easeInOutCubic` inverte a sensação das
entradas) e os pontos de corte. **Não copie a geometria.** O arquivo não é
fetchável por URL; peça o export.

### Recalibrar tipo primeiro, derivar o canvas depois

Encolher um canvas de vídeo (1400×900) para a coluna de ~650px joga kicker e
rótulos para 6–9px, ilegíveis. A ordem é: **recalibrar as fontes à mão** para o
tamanho de exibição real, e **só então fechar a altura do canvas** no que o
conteúdo passa a ocupar. Manter a proporção original com fonte maior produz,
alternando, sobreposição ou faixa morta — e **faixa morta numa figura no meio do
texto não lê como respiro, lê como quebra de página**. Alvo: margem parecida em
cima e embaixo, e parecida **entre as fases** da animação.

### Medir, nunca estimar

Para centralizar, leia `element.offsetHeight` — altura de *layout*, imune ao
`transform:scale` aplicado por cima. Somar `font-size × line-height + margin` à
mão nunca bate com o navegador, e o erro inteiro sobra num lado só (margem de
cima maior que a de baixo). Guarde em cache e **invalide na troca de idioma e no
resize**. Mesmo princípio do `matchCopy` no `news-hero-motif.js`.

### Estado inicial ≠ estado de repouso

Se o elemento nasce num lugar e termina em outro, **não** o centralize pelo
container: um flex container do tamanho do quadro centraliza desde o primeiro
frame, e o número final aparece por cima da linha do tempo ainda sendo desenhada.
Padrão certo: **ancorar e viajar** — posicionado onde pertence, `translate` para
o centro só no beat de destaque. Se ele tem partes invisíveis mas presentes no
fluxo (um kicker que só aparece depois), compense a altura delas na âncora. E se
ele precisa nascer do tamanho dos irmãos e crescer depois, **anime a escala do
bloco** (começando em `corpo-irmão / corpo-herói`) em vez de duplicar o dado em
dois elementos que fazem crossfade.

### Verificar — o painel de preview mente

O preview **não dispara `requestAnimationFrame`** e o sandbox não instala
Chromium. Três camadas, nesta ordem:

1. **Varredura numérica** — rodar o JS real em Node/jsdom, chamar `render(t)` de
   0 ao fim do loop em passos de 0,05s, assertando zero exceção e zero
   `NaN`/`Infinity`.
2. **Troca de idioma** — percorrer os 6 e comparar cada rótulo com o dict.
3. **Rasterizar e OLHAR** — despejar o DOM em quadros-chave e reconstruir com PIL
   num contact sheet. Validação só numérica já deixou passar figura ilegível com
   todos os limites corretos. `.claude/motif/` já faz isso; siga o desenho.

Em jsdom, `offsetHeight` devolve 0 (precisa de fallback explícito) e um loop de
`requestAnimationFrame` sem guarda trava o processo — force
`prefers-reduced-motion` no stub de `matchMedia` nos testes que só chamam
`render(t)`.

---

## Deploy: o agente prepara, o Vinicius commita

Não há build system — nenhum `package.json`, Jekyll, Action ou `dist`. **O HTML
do repo É o artefato publicado.** Se a página no ar está velha, não existe
"build desatualizado" para culpar.

### `.git\index.lock` — a armadilha que já custou uma sessão inteira

Um lock órfão (script interrompido) faz **todo `git add`/`commit`/`rm` falhar**
com `Unable to create '.../index.lock': File exists`, enquanto o `git push`
responde, corretamente, **"Everything up-to-date"** — porque nada foi preparado.
O agente relata "publicado", a página mostra a versão velha, e a conversa entra
em rodadas de "está feito"/"não está". Aconteceu em duas frentes na mesma sessão.

Todo script de commit começa com:

```powershell
Remove-Item ".git\index.lock" -Force -ErrorAction SilentlyContinue
```

Se não sair, há processo segurando — o GitHub Desktop é o suspeito de sempre,
inclusive minimizado na bandeja.

### Verificação em três níveis antes de dizer "está no ar"

Arquivo local correto não significa publicado:

1. **Fonte** — conteúdo novo no arquivo, e 0 bytes NUL.
2. **Branch publicado** — `git fetch origin main`; `git rev-parse HEAD` e
   `origin/main` têm de bater; `git show origin/main:<caminho>` contém a string
   nova e **não** contém a velha.
3. **URL pública** — buscar `https://rosa.expert/<caminho>`.

Cache é a **última** hipótese, nunca a primeira: antes dele vêm o lock, o escopo
do `git add` e o push.

### Higiene do script PowerShell

`$ErrorActionPreference = "Stop"`, try/catch, `$LASTEXITCODE` conferido depois de
**cada** comando git, `git commit -m "..." -m "..."` (nada de here-string, que
vira cascata de `>>` quando colada), e `Read-Host` no fim para a janela não
fechar antes de dar pra ler o erro. Todo bloco começa com `cd` no repo.

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
