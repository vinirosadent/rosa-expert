# Ver o motivo do hero sem navegador

O sandbox nao tem Chromium headless (rede bloqueia o download do Playwright e
nao ha' root para apt). Durante a construcao do `assets/js/news-hero-motif.js`
isso custou caro: a validacao ficou so' numerica — os pontos estavam todos
dentro da zona livre e mesmo assim o desenho nao lia como dente. Bugs que so'
apareceram quando o quadro foi finalmente rasterizado e olhado:

- as formas produziam MAIS pontos que N, e o excesso era descartado depois da
  ordenacao por raio — sumiam as paredes externas das raizes e o osso inteiro;
- o laco das fibras parava no meio do contorno por causa de uma soma de cotas
  desatualizada: as fibras so' apareciam de um lado do dente;
- feixes com poucos pontos e espacamento vertical menor que o horizontal leem
  como colunas de pontos, nao como fibras atravessando;
- `if (!t0) t0 = now` nunca inicializa quando `now` e' 0.

## O loop

```
node dump.js <ms>          # executa o JS REAL contra um canvas falso e grava
                           # /tmp/mot/frame.json com arcos e linhas
python3 render.py saida.png  # rasteriza com PIL, sobre o ivory do site, com as
                           # guias de 48% / 94% / 24%
node h2.js                 # medicao numerica em varios instantes e tamanhos
```

`dump.js` nao reimplementa nada: ele intercepta `arc`, `moveTo`, `lineTo`,
`fill` e `stroke` do contexto 2D. O que a imagem mostra e' o que o navegador
desenharia.

`MOTIF=<nome>` escolhe qual motivo rodar; sem a variavel, `molar-pdl`:

```
MOTIF=petri-paper node dump.js 19600 && python3 render.py /tmp/mot/f.png
MOTIF=petri-paper node h2.js
```

`COPY_TOP`/`COPY_BOT`/`TOPBAR_BOT`/`HERO_H` (px) fabricam a `.na-topbar` e a
`.na-hero-copy` para motivos com `matchCopy` (petri-paper): sem eles
`host.querySelector` nao existe e o motor cai no fallback estatico — o mesmo
caminho que roda de verdade em qualquer pagina sem esse recurso.

```
COPY_TOP=91 COPY_BOT=483 TOPBAR_BOT=58 HERO_H=620 MOTIF=petri-paper node dump.js 8000
```

Ajuste os caminhos no topo de `dump.js` se o arquivo do motivo mudar de lugar.

## Defeitos que so' apareceram rasterizando o petri-paper

Mesma classe dos anteriores — todos passavam nos limites numericos:

- forma desenhada com 59% da altura util fica BOIANDO no quadro. O numero
  (limites OK) nao denuncia; a imagem sim;
- eixo de grafico em duas filas deslocadas 2.4 px com alfas diferentes le como
  fio desfiado. Num grafico cientifico, se o eixo treme nada parece medido;
- pagina virando com o levantamento maximo no MEIO e zero na borda livre le
  como duas paginas planas lado a lado. Precisa de tres deformacoes juntas:
  encurtamento horizontal, encolhimento vertical e subida;
- filas de "texto" sem vaos entre palavras leem como persiana, e os vaos
  precisam de fase por fila, senao formam colunas verticais;
- forma de borda RETA (pagina) nao pode encostar na rampa da mascara: a borda
  apagada le como pagina cortada. Por isso o motivo declara `lo`/`hi` na faixa
  totalmente opaca em vez da borda da zona livre.

## Defeitos que so' apareceram medindo o layout de verdade (matchCopy)

- `.na-hero` centraliza o proprio conteudo por flex (`align-items:center`);
  um headline longo empurra o hero acima do min-height e a fracao onde a
  `.na-hero-copy` comeca MUDA de pagina para pagina. Uma fracao fixa
  (`C.top`) acertava numa materia e sobrava vazio em outra — a caixa so'
  alinha com o texto medindo `getBoundingClientRect()` de verdade;
- a mascara que protege a `.na-topbar` tambem estava em FRACAO fixa
  (0.24-0.30 de H). A topbar tem altura fixa em pixels; um hero mais alto
  (headline longo) faz a mesma fracao reservar folga em dobro do que a
  topbar precisa. A mascara tem de vir de pixels medidos (fim da topbar +
  respiro fixo), nao de uma fracao de H.
