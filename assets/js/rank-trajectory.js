/* rank-trajectory.js — animação da trajetória de ranking (Top 2% Scientists,
 * Dentistry, 2022→2025), reanexada dos tokens do site.
 *
 * ── ORIGEM ─────────────────────────────────────────────────────────────────
 * Vinicius desenhou esta peça no Claude Design ("Ranking growth animation
 * 2025") como um componente React sobre um motor de composição próprio
 * (CompositionStage/useComposition/animate/Easing, ~1400x900px, pensado para
 * export de vídeo). O site não tem build system nem React — é HTML/CSS/JS
 * puro publicado direto pelo GitHub Pages. Este arquivo reimplementa a MESMA
 * coreografia (mesmos segundos, mesmas curvas de easing, mesmos pontos de
 * corte) em JS vanilla + SVG, sem framework, tocada por requestAnimationFrame.
 *
 * ── POR QUE NÃO É 1400×900 DIVIDIDO NA METADE SEM MAIS NADA ────────────────
 * A peça original foi desenhada para um canvas bem maior que a coluna de
 * texto do artigo (~650-700px, escolha do Vinicius: manter na coluna, não
 * esticar pro container inteiro). Se o canvas de 1400x900 for só encolhido
 * via transform:scale(~0.46), o texto menor (o "kicker" acima do título, os
 * rótulos de ano, o texto de delta) cai a 6-9px — ilegível. Então as FONTES
 * foram recalibradas à mão pra esse tamanho de exibição (não são a metade
 * matemática das originais), e a ALTURA do canvas foi fechada em cima do
 * que o conteúdo realmente ocupa com essas fontes: 700x400, não a metade
 * proporcional de 900. Tentar manter a proporção original com fontes
 * maiores foi o que produziu, em duas revisões, ou sobreposição ou uma
 * faixa morta embaixo. A escala responsiva (fit) fica perto de 1.0 na
 * coluna real do artigo, então as fontes chegam quase no tamanho literal.
 *
 * ── COMO A LINHA DO TEMPO FUNCIONA ─────────────────────────────────────────
 * O piece original expõe OM_SCENES (uma lista de cenas nomeadas com duração)
 * e deriva CUES = {NomeDaCena: tempo-de-início-acumulado}. Como nenhuma cena
 * usa "nat" (tempo natural distinto do tempo de reprodução), tempo-de-corte
 * autoral == tempo real em segundos. As durações autorais são:
 *   Opening 2.4s · Y2022 1.8s · Y2023 1.7s · Y2024 1.6s · Y2025 1.9s ·
 *   Focus 3.6s · Close 3.2s  → total 16.2s, em loop.
 * CUES (início de cada cena): Y2022=2.4 Y2023=4.2 Y2024=5.9 Y2025=7.5
 * Focus=9.4 Close=13.0. Esses números estão fixos abaixo (CUE/FOCUS/TOTAL) —
 * não são configuráveis por página, porque são a coreografia autoral desta
 * peça específica, não um motor genérico.
 *
 * ── O QUE MUDA POR IDIOMA ───────────────────────────────────────────────────
 * A GEOMETRIA (posição, tempo, easing) é fixa. O TEXTO (kicker, título,
 * rótulos de "of"/"Top X%"/delta em cada ano, texto do herói 2025) vem de um
 * bloco <script type="application/json" id="<container-id>-data"> na própria
 * página — o mesmo padrão do bloco I18N que já existe nela. A troca de idioma
 * é detectada por um MutationObserver no atributo lang de <html> (o mecanismo
 * setLang() da página já troca esse atributo; este motor só observa, nunca
 * precisou ser cabeado nele).
 *
 * ── ANOS: SEMPRE ALGARISMOS OCIDENTAIS, EM TODOS OS IDIOMAS ────────────────
 * Confirmado no restante do próprio texto multilíngue da página (p1-p4,
 * cartão lateral): mesmo em zh e ar os anos e a maioria dos números seguem
 * separador ocidental (1,075 / 79,530 / 0.78%). Este motor segue a mesma
 * convenção — os rótulos "2022".."2025" nunca são traduzidos.
 *
 * ── ORIENTAÇÃO EM ÁRABE (RTL) ───────────────────────────────────────────────
 * O gráfico em si (linha, pontos, eixo temporal) permanece esquerda→direita
 * mesmo em ar — é uma convenção universal para dados cronológicos (a mesma
 * lógica de qualquer gráfico de série temporal em locale árabe: o eixo do
 * tempo não espelha). Só o TEXTO dentro de cada rótulo é o texto árabe already
 * traduzido; a peça inteira não é um bloco de leitura corrido, é uma figura,
 * então não herda a regra de mirror do .na-traj (que é uma linha de texto
 * fluida, não uma composição de coordenadas).
 */
(function () {
  var HOSTS = [].slice.call(document.querySelectorAll('.rank-traj'));
  if (!HOSTS.length) return;

  var REDUCE = false;
  try { REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // ── Easing (mesmas fórmulas do motor original) ───────────────────────────
  function easeLinear(t) { return t; }
  function easeOutCubic(t) { t -= 1; return t * t * t + 1; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  // animate({from,to,start,end,ease})(t) do original — aqui como função pura
  // de t, chamada a cada frame. Default de ease é easeOutCubic (era
  // MOTION.enter no arquivo original, não easeInOutCubic — conferido linha a
  // linha pra não inverter a sensação das entradas "leves" vs. dos
  // deslocamentos "draw").
  function mix(t, from, to, start, end, ease) {
    ease = ease || easeOutCubic;
    if (t <= start) return from;
    if (t >= end) return to;
    var local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  }

  // ── Linha do tempo autoral (fixa; ver comentário acima) ──────────────────
  var CUE = [2.4, 4.2, 5.9, 7.5]; // início de Y2022, Y2023, Y2024, Y2025
  var FOCUS = 9.4;
  var TOTAL = 16.2;

  // ── Geometria (canvas nativo 700x360) ────────────────────────────────────
  // A altura saiu de 520 pra 360 porque 520 deixava uma faixa morta embaixo
  // que lia como QUEBRA de página, não como respiro: a figura interrompia o
  // fluxo de leitura entre p1 e p2 em vez de pertencer a ele. 360 é a altura
  // do que o conteúdo REALMENTE ocupa mais respiro simétrico:
  //   construção  cabeçalho 34..104, fileira 150..~321  → 34 em cima, 39 embaixo
  //   repouso     herói 138.4 medidos x 2.05             → ~38 dos dois lados
  // As duas fases fecham com a mesma margem, então nenhuma delas parece
  // frouxa. Em ~650px de coluna isso vira ~334px renderizados — proporção de
  // figura de artigo, não de banner.
  var CANVAS_W = 700, CANVAS_H = 360;
  var CX = CANVAS_W / 2;
  var PTS = [
    { x: 100.0, y: 190.0 },
    { x: 267.5, y: 183.0 },
    { x: 435.0, y: 176.0 },
    { x: 602.5, y: 168.0 }
  ];
  var RANK_Y = 225.0, PCT_Y = 285.0;
  var HERO_S_TARGET = 2.05;

  // ── Tipografia recalibrada para exibição em ~650-700px (ver nota acima) ──
  var F = {
    kicker: 13, title: 26, yearLabel: 16,
    rank: 34, // fixo — a fileira não encolhe, só desaparece (ver render())
    pct: 15, of: 11, delta: 14,
    heroKicker: 11, heroRank: 56, heroPct: 16, heroOf: 12
  };

  // O herói NASCE na coluna de 2025, alinhado com os outros ranks, e só
  // depois viaja pro centro. Como ele tem um kicker ACIMA do número (que
  // fica invisível durante a construção mas ocupa espaço no fluxo), o topo
  // da caixa precisa subir a altura desse kicker pra que o "#738" caia na
  // mesma linha de "#1,075"/"#832"/"#794".
  var HERO_KICKER_STACK = F.heroKicker * 1.15 + 5; // linha do kicker + margin-bottom
  var HERO_TOP = (RANK_Y - 32) - HERO_KICKER_STACK;
  var HERO_LEFT = PTS[3].x - 150; // caixa de 300px centrada no ponto de 2025
  var HERO_DX_TARGET = CX - PTS[3].x;
  // Altura de fluxo do herói: MEDIDA em runtime (offsetHeight), nunca
  // estimada. Foi a estimativa que deixou a margem de cima maior que a de
  // baixo na revisão anterior — o line-height real do navegador não bate
  // com o cálculo à mão, e o erro todo sobrava num lado só. Este valor é
  // apenas o fallback pra ambiente sem layout (jsdom nos testes).
  var HERO_FLOW_FALLBACK = 138.4;

  var YEAR_LABELS = ['2022', '2023', '2024', '2025'];

  function el(tag, cls, styles) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (styles) for (var k in styles) e.style[k] = styles[k];
    return e;
  }
  function svgEl(tag, attrs) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function RankTraj(root, cfg) {
    this.root = root;
    this.cfg = cfg;
    this.lang = 'en';
    this.build();
    this.applyLang(this.currentLang());
    this.wireResize();
    this.wireLangWatch();
    this.wireVisibility();
    this.start();
  }

  RankTraj.prototype.currentLang = function () {
    var l = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    if (l.indexOf('zh') === 0) return 'zh';
    if (this.cfg[l]) return l;
    return 'en';
  };

  RankTraj.prototype.build = function () {
    var root = this.root;
    root.setAttribute('aria-hidden', 'true'); // a <figcaption> ao lado já descreve o conteúdo
    root.style.position = 'relative';
    root.style.width = '100%';
    root.style.aspectRatio = CANVAS_W + ' / ' + CANVAS_H;
    root.style.overflow = 'hidden';
    root.style.background = 'var(--na-ivory, #FDF6EE)';

    var stage = el('div', 'rt-stage', {
      position: 'absolute', left: '0', top: '0', width: CANVAS_W + 'px', height: CANVAS_H + 'px',
      transformOrigin: '0 0', fontFamily: 'var(--font-sans)', WebkitFontSmoothing: 'antialiased'
    });
    root.appendChild(stage);
    this.stage = stage;

    // Header ----------------------------------------------------------------
    var header = el('div', 'rt-header', { position: 'absolute', left: '70px', top: '34px', width: '480px' });
    var kicker = el('div', 'rt-kicker', {
      fontSize: F.kicker + 'px', letterSpacing: '.16em', textTransform: 'uppercase',
      fontWeight: '600', color: 'var(--text-muted)'
    });
    var title = el('div', 'rt-title', {
      fontFamily: 'var(--font-serif)', fontSize: F.title + 'px', color: 'var(--text-strong)',
      marginTop: '9px', letterSpacing: '-0.01em', lineHeight: '1.15'
    });
    var rule = el('div', 'rt-rule', { height: '2px', background: 'var(--orange-500)', marginTop: '14px' });
    header.appendChild(kicker); header.appendChild(title); header.appendChild(rule);
    stage.appendChild(header);
    this.kicker = kicker; this.title = title; this.rule = rule;

    // Row (linha + pontos + rótulos) -----------------------------------------
    var row = el('div', 'rt-row', { position: 'absolute', left: '0', top: '0', width: CANVAS_W + 'px', height: CANVAS_H + 'px' });
    stage.appendChild(row);
    this.row = row;

    var svg = svgEl('svg', { width: CANVAS_W, height: CANVAS_H, style: 'position:absolute;left:0;top:0;overflow:visible' });
    row.appendChild(svg);
    this.svg = svg;

    this.lines = [];
    for (var i = 0; i < 3; i++) {
      var a = PTS[i], b = PTS[i + 1];
      var line = svgEl('line', { x1: a.x, y1: a.y, x2: a.x, y2: a.y, stroke: 'var(--orange-500)', 'stroke-width': '2', 'stroke-linecap': 'round' });
      svg.appendChild(line);
      this.lines.push(line);
    }
    this.dots = [];
    for (var d = 0; d < 4; d++) {
      var dot = svgEl('circle', { cx: PTS[d].x, cy: PTS[d].y, r: '0', fill: d === 3 ? 'var(--orange-500)' : 'var(--na-ivory, #FDF6EE)', stroke: 'var(--orange-500)', 'stroke-width': '2' });
      svg.appendChild(dot);
      this.dots.push(dot);
    }

    this.yearEls = []; this.rankEls = []; this.pctEls = []; this.ofEls = [];
    for (var y = 0; y < 4; y++) {
      var p = PTS[y];
      var yearDiv = el('div', 'rt-year', {
        position: 'absolute', left: (p.x - 90) + 'px', top: (p.y - 40) + 'px', width: '180px', textAlign: 'center',
        fontSize: F.yearLabel + 'px', fontWeight: '500', color: y === 3 ? 'var(--orange-500)' : 'var(--text-muted)'
      });
      yearDiv.textContent = YEAR_LABELS[y];
      row.appendChild(yearDiv); this.yearEls.push(yearDiv);

      if (y < 3) {
        var rankDiv = el('div', 'rt-rank', {
          position: 'absolute', left: (p.x - 125) + 'px', top: (RANK_Y - 32) + 'px', width: '250px', textAlign: 'center',
          fontFamily: 'var(--font-serif)', fontSize: F.rank + 'px', lineHeight: '1', color: 'var(--text-strong)', letterSpacing: '-0.01em'
        });
        row.appendChild(rankDiv); this.rankEls.push(rankDiv);

        // A fileira não encolhe mais no Focus (ver render()), então pct/of
        // ficam num lugar FIXO — não precisam de "top" animado.
        var pctWrap = el('div', 'rt-pctof', {
          position: 'absolute', left: (p.x - 125) + 'px', top: PCT_Y + 'px', width: '250px', textAlign: 'center'
        });
        var pctSpan = el('div', 'rt-pct', { fontSize: F.pct + 'px', fontWeight: '500', color: 'var(--orange-600)' });
        var ofSpan = el('div', 'rt-of', { fontSize: F.of + 'px', color: 'var(--text-muted)', marginTop: '5px', fontWeight: '400' });
        pctWrap.appendChild(pctSpan); pctWrap.appendChild(ofSpan);
        row.appendChild(pctWrap); this.pctEls.push(pctSpan); this.ofEls.push(ofSpan);
        pctWrap._el = pctWrap;
        if (!this._pctWraps) this._pctWraps = [];
        this._pctWraps.push(pctWrap);
      } else {
        this.rankEls.push(null); this.pctEls.push(null); this.ofEls.push(null);
      }
    }

    this.deltaEls = [null];
    for (var i3 = 1; i3 < 4; i3++) {
      var a2 = PTS[i3 - 1], b2 = PTS[i3];
      var mx = (a2.x + b2.x) / 2, my = (a2.y + b2.y) / 2;
      var deltaDiv = el('div', 'rt-delta', {
        position: 'absolute', left: (mx - 60) + 'px', top: (my - 28) + 'px', width: '120px', textAlign: 'center',
        fontSize: F.delta + 'px', fontWeight: '600', color: 'var(--orange-600)'
      });
      row.appendChild(deltaDiv); this.deltaEls.push(deltaDiv);
    }

    // Herói (2025) ------------------------------------------------------------
    // Ancorado NA COLUNA DE 2025, não centrado no quadro. A revisão anterior
    // fez dele um flex container do tamanho do quadro, o que centralizava o
    // "#738" desde o primeiro frame — ele aparecia no meio da figura, por
    // cima da linha do tempo ainda sendo desenhada. Aqui ele nasce onde
    // pertence (embaixo do ponto de 2025, com o número na mesma linha dos
    // outros ranks) e só VIAJA pro centro no beat de Focus.
    var hero = el('div', 'rt-hero', {
      position: 'absolute', left: HERO_LEFT + 'px', top: HERO_TOP + 'px', width: '300px',
      textAlign: 'center', transformOrigin: '50% 0'
    });
    var heroKicker = el('div', 'rt-hero-kicker', {
      fontSize: F.heroKicker + 'px', letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: '600',
      color: 'var(--text-muted)', marginBottom: '5px'
    });
    var heroRank = el('div', 'rt-hero-rank', {
      fontFamily: 'var(--font-serif)', fontSize: F.heroRank + 'px', lineHeight: '1', color: 'var(--orange-500)', letterSpacing: '-0.01em'
    });
    heroRank.textContent = this.cfg.en.years[3].rank;
    var heroRule = el('div', 'rt-hero-rule', { height: '1.5px', background: 'var(--orange-500)', margin: '13px auto 0' });
    var heroPct = el('div', 'rt-hero-pct', { fontSize: F.heroPct + 'px', fontWeight: '500', color: 'var(--orange-600)', marginTop: '11px' });
    var heroOf = el('div', 'rt-hero-of', { fontSize: F.heroOf + 'px', color: 'var(--text-strong)', marginTop: '7px' });
    hero.appendChild(heroKicker); hero.appendChild(heroRank); hero.appendChild(heroRule); hero.appendChild(heroPct); hero.appendChild(heroOf);
    stage.appendChild(hero);
    this.hero = hero; this.heroKicker = heroKicker; this.heroRank = heroRank; this.heroRule = heroRule; this.heroPct = heroPct; this.heroOf = heroOf;
  };

  RankTraj.prototype.applyLang = function (lang) {
    var d = this.cfg[lang] || this.cfg.en;
    // A composição em si (linha, pontos, eixo do tempo) fica sempre
    // esquerda->direita, mesmo em árabe — convenção universal pra dados
    // cronológicos (ver nota no topo do arquivo). dir="rtl" aqui só corrige
    // a ordem interna de cada RÓTULO de texto (ex.: palavra árabe seguida de
    // número), nunca a geometria; como cada rótulo é position:absolute com
    // text-align:center explícito, não há reflow para o dir afetar.
    this.stage.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    this.kicker.textContent = d.kicker;
    this.title.textContent = d.title;
    this.heroKicker.textContent = d.heroKicker;
    this.heroOf.textContent = d.heroOf;
    for (var i = 0; i < 4; i++) {
      var yd = d.years[i];
      if (this.rankEls[i]) this.rankEls[i].textContent = yd.rank;
      if (this.pctEls[i]) this.pctEls[i].textContent = yd.pct;
      if (this.ofEls[i]) this.ofEls[i].textContent = yd.of;
      if (i > 0 && this.deltaEls[i]) this.deltaEls[i].textContent = yd.delta || '';
    }
    this.heroRank.textContent = d.years[3].rank;
    this.heroPct.textContent = d.years[3].pct;
    this._heroH = null; // texto novo pode ter altura nova (legenda quebrando linha)
    this.lang = lang;
  };

  RankTraj.prototype.wireLangWatch = function () {
    var self = this;
    var mo = new MutationObserver(function () {
      var l = self.currentLang();
      if (l !== self.lang) self.applyLang(l);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  };

  RankTraj.prototype.wireResize = function () {
    var self = this;
    function fit() {
      var w = self.root.clientWidth || self.root.getBoundingClientRect().width;
      if (!w) return;
      var k = w / CANVAS_W;
      self.stage.style.transform = 'scale(' + k + ')';
      self._heroH = null; // remede o herói na largura nova
    }
    fit();
    addEventListener('resize', fit);
    this._fit = fit;
  };

  RankTraj.prototype.wireVisibility = function () {
    var self = this;
    self._onScreen = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { self._onScreen = es[0].isIntersecting; })
        .observe(self.root);
    }
    document.addEventListener('visibilitychange', function () {
      self._docVisible = !document.hidden;
    });
    self._docVisible = !document.hidden;
  };

  // Altura real do bloco do herói, em px do canvas nativo. offsetHeight é a
  // altura de LAYOUT — não sofre efeito do transform:scale que a gente aplica
  // por cima —, então dá a altura sem escala mesmo com a animação rodando.
  // Fica em cache porque é uma leitura que força layout; o cache é limpo em
  // applyLang (texto muda, altura pode mudar se a legenda quebrar linha) e
  // no resize.
  RankTraj.prototype.heroFlowHeight = function () {
    if (this._heroH == null) {
      var h = this.hero.offsetHeight;
      this._heroH = h > 0 ? h : HERO_FLOW_FALLBACK; // 0 = ambiente sem layout (jsdom)
    }
    return this._heroH;
  };

  RankTraj.prototype.heroDyTarget = function () {
    return (CANVAS_H - this.heroFlowHeight() * HERO_S_TARGET) / 2 - HERO_TOP;
  };

  RankTraj.prototype.render = function (t) {
    var f = FOCUS;

    // A fileira inteira (linha, pontos, anos, ranks, pct/of, deltas) só
    // desaparece — não encolhe nem muda de lugar. Uma única opacidade no
    // CONTAINER (this.row) já apaga tudo dentro dela junto (opacity de pai
    // multiplica a dos filhos em CSS), então os elementos individuais só
    // precisam da própria animação de ENTRADA (cue por ano); a SAÍDA é toda
    // resolvida aqui, uma vez só.
    var rowFade = mix(t, 1, 0, f - 0.1, f + 0.7, easeInOutCubic);
    // O cabeçalho (kicker+título+régua) some junto, na mesma janela — nada
    // disputa atenção com o número de 2025 no repouso.
    var headFadeOut = mix(t, 1, 0, f - 0.1, f + 0.7, easeInOutCubic);

    var heroS = mix(t, 1, HERO_S_TARGET, f - 0.1, f + 1.4, easeInOutCubic);
    // Destino vertical calculado com a altura MEDIDA do bloco (ver
    // heroFlowHeight): centraliza a caixa já escalada no quadro. Medir em
    // vez de estimar é o que garante margem de cima == margem de baixo.
    var heroDX = mix(t, 0, HERO_DX_TARGET, f - 0.1, f + 1.4, easeInOutCubic);
    var heroDY = mix(t, 0, this.heroDyTarget(), f - 0.1, f + 1.4, easeInOutCubic);
    var heroMeta = mix(t, 0, 1, f + 1.0, f + 1.9);
    var heroRuleP = mix(t, 0, 1, f + 0.8, f + 1.7, easeInOutCubic);

    var head = mix(t, 0, 1, 0.35, 1.5);
    var headY = mix(t, 10, 0, 0.35, 1.5);
    var master = mix(t, 1, 0, TOTAL - 0.55, TOTAL - 0.05, easeLinear);
    var ruleW = mix(t, 0, 56, 0.7, 1.9, easeInOutCubic);

    this.stage.style.opacity = String(master);

    this.kicker.parentNode.style.opacity = String(head * headFadeOut);
    this.kicker.parentNode.style.transform = 'translateY(' + headY + 'px)';
    this.rule.style.width = ruleW + 'px';

    this.row.style.opacity = String(rowFade);

    for (var i = 0; i < 3; i++) {
      var p = mix(t, 0, 1, CUE[i + 1] - 0.05, CUE[i + 1] + 0.6, easeInOutCubic);
      var a = PTS[i], b = PTS[i + 1];
      this.lines[i].setAttribute('x2', a.x + (b.x - a.x) * p);
      this.lines[i].setAttribute('y2', a.y + (b.y - a.y) * p);
    }
    for (var d = 0; d < 4; d++) {
      var s = mix(t, 0, 1, CUE[d], CUE[d] + 0.5, easeOutBack);
      this.dots[d].setAttribute('r', Math.max(0, 6 * s));
    }

    for (var y = 0; y < 4; y++) {
      var yOp = mix(t, 0, 1, CUE[y] - 0.15, CUE[y] + 0.5);
      var yY = mix(t, 10, 0, CUE[y] - 0.15, CUE[y] + 0.5);
      this.yearEls[y].style.opacity = String(yOp);
      this.yearEls[y].style.transform = 'translateY(' + yY + 'px)';

      if (y < 3) {
        var rOp = mix(t, 0, 1, CUE[y] + 0.15, CUE[y] + 0.9);
        var rY = mix(t, 22, 0, CUE[y] + 0.15, CUE[y] + 0.9);
        this.rankEls[y].style.opacity = String(rOp);
        this.rankEls[y].style.transform = 'translateY(' + rY + 'px)';

        var pOp = mix(t, 0, 1, CUE[y] + 0.45, CUE[y] + 1.1);
        this._pctWraps[y].style.opacity = String(pOp);
      }
    }

    for (var i2 = 1; i2 < 4; i2++) {
      var dOp = mix(t, 0, 1, CUE[i2] + 0.35, CUE[i2] + 1.0);
      var dY = mix(t, 8, 0, CUE[i2] + 0.35, CUE[i2] + 1.0);
      this.deltaEls[i2].style.opacity = String(dOp);
      this.deltaEls[i2].style.transform = 'translateY(' + dY + 'px)';
    }

    var heroBoxOp = mix(t, 0, 1, CUE[3] + 0.15, CUE[3] + 0.9);
    this.hero.style.opacity = String(heroBoxOp);
    this.hero.style.transform = 'translate(' + heroDX + 'px,' + heroDY + 'px) scale(' + heroS + ')';

    this.heroKicker.style.opacity = String(heroMeta);
    this.heroKicker.style.transform = 'translateY(' + ((1 - heroMeta) * 4) + 'px)';
    var heroRankY = mix(t, 22, 0, CUE[3] + 0.15, CUE[3] + 0.9);
    this.heroRank.style.transform = 'translateY(' + heroRankY + 'px)';
    this.heroRule.style.opacity = String(0.5 * heroRuleP);
    this.heroRule.style.width = (100 * heroRuleP) + 'px';
    var heroPctOp = mix(t, 0, 1, CUE[3] + 0.45, CUE[3] + 1.1);
    this.heroPct.style.opacity = String(heroPctOp);
    this.heroOf.style.opacity = String(heroMeta);
    this.heroOf.style.transform = 'translateY(' + ((1 - heroMeta) * 4) + 'px)';
  };

  RankTraj.prototype.start = function () {
    var self = this;
    if (REDUCE) {
      // Repouso: dentro do beat Close, com o herói já assentado — nunca um
      // quadro em t=0 (cabeçalho sem gráfico), que pareceria quebrado.
      self.render(FOCUS + 3.0);
      return;
    }
    var t0 = null;
    function step(now) {
      if (!self._docVisible || !self._onScreen) { self._raf = requestAnimationFrame(step); return; }
      if (t0 === null) t0 = now;
      var t = ((now - t0) / 1000) % TOTAL;
      self.render(t);
      self._raf = requestAnimationFrame(step);
    }
    self._raf = requestAnimationFrame(step);
  };

  // Instâncias vivas ficam expostas aqui só para depuração manual no
  // console (ex.: window.__RANK_TRAJ__[0].render(9.4) pra pausar num
  // instante exato); nada no motor depende disso.
  window.__RANK_TRAJ__ = [];

  HOSTS.forEach(function (rootEl) {
    var dataEl = document.getElementById(rootEl.id + '-data');
    if (!dataEl) return;
    var cfg;
    try { cfg = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!cfg || !cfg.en) return;
    window.__RANK_TRAJ__.push(new RankTraj(rootEl, cfg));
  });
})();
