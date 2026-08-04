/* ============================================================
   news-apparition.js — o campo de pontos do hero da news
   Sem dependências. Carregar com defer, DEPOIS de shared.js.

   O QUE ISTO É (e o que não é)
   Este NÃO é um efeito de fundo. Em rosa.expert os pontos comunicam
   (nuvem do hero da home, frentes de onda em Connected Science), e a
   regra do hero da news, aprovada em 2026-08-04, é:

     a nuvem só existe na FAIXA onde a fotografia já virou ivory.

   A foto se desfaz da direita para a esquerda pelo véu de 96° (o mesmo
   da premissa na home) e é exatamente ali, no papel, que os pontos
   ganham densidade. Não é sobreposição: a imagem termina e o campo
   começa. Por isso o guard vive na ALPHA DE CADA PARTÍCULA e não numa
   máscara — máscara cria borda, e borda denuncia que são duas coisas.

   Consequência prática: a faixa é definida em FRAÇÃO DA LARGURA, não em
   px, porque ela tem de acompanhar a coluna de texto e o gradiente do
   véu, que também são frações. Ver GUARDS abaixo antes de mexer em
   qualquer número.
   ============================================================ */

(function () {
  'use strict';

  /* ── Faixas ────────────────────────────────────────────────
     Cada valor é fração da largura (fx) ou da altura (fy) do canvas.

     'left'  — hero full-bleed (desktop, 5a). A coluna de copy vai até
               ~0.45 e a foto só volta a ser legível depois de ~0.72:
               a faixa é o que sobra. Onset em 0.50 (não 0.42) porque a
               0.42 mediu-se ponto DENTRO das contraforma da serif da
               manchete de 50px — alpha máxima 22/255.
     'wide'  — mesmo hero SEM fotografia (estado degradado): a manchete
               ocupa 34rem em vez de 30rem, então a faixa começa depois.
     'lower' — hero do telefone: a foto entra em cima e se apaga para
               baixo; a faixa é o canto inferior direito, fora da copy.
     Qualquer faixa nova entra aqui e em nenhum outro lugar. */
  /* e = borda direita REAL da coluna de copy, em fração da largura do
     canvas, medida no DOM a cada build. Fração fixa não serve: a coluna
     tem largura em rem (30rem/34rem) e a página tem largura fluida, então
     a 912px de viewport a mesma coluna ocupa 53% e a 1440px ocupa 34% —
     com onset fixo em 0.50 mediu-se alpha 67/255 dentro da manchete a
     912px. A faixa é "depois do texto", não "depois de 50% da largura". */
  var GUARDS = {
    left:  function (fx, fy, s, e) { return s(e, e + 0.10, fx) * (1 - s(0.70, 0.86, fx)); },
    wide:  function (fx, fy, s, e) { return s(e, e + 0.12, fx); },
    right: function (fx, fy, s, e) { return s(e, e + 0.12, fx); },
    lower: function (fx, fy, s, e) { return s(0.30, 0.58, fy) * s(e, e + 0.12, fx); }
  };

  /* Lobos: onde a densidade mora dentro da faixa. Três, de pesos
     diferentes (62% / 24% / 14%), porque um lobo só lê como borrão
     circular e quatro lê como ruído. */
  var LOBES = {
    left:  [[0.54, 0.46], [0.62, 0.70], [0.48, 0.26]],
    wide:  [[0.66, 0.46], [0.78, 0.66], [0.60, 0.30]],
    right: [[0.60, 0.46], [0.80, 0.66], [0.42, 0.30]],
    lower: [[0.76, 0.78], [0.88, 0.62], [0.68, 0.90]]
  };

  var TINT = '0,61,124';      /* --blue-500  */
  var SPARK = '239,124,0';    /* --orange-500, em 7% dos pontos */

  function smoothstep(a, b, x) {
    var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function Field(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.pts = [];
    this.W = 0;
    this.H = 0;
    this.t0 = (window.performance || Date).now();
    this.raf = 0;
    this.timer = 0;
    this.live = false;
    this.onScreen = true;
  }

  Field.prototype.build = function () {
    /* lido a cada build, não uma vez no construtor: o telefone usa outra
       faixa ('lower'), e girar o aparelho tem de trocar a faixa junto com
       a geometria — o atributo é a fonte da verdade. */
    this.side = this.cv.getAttribute('data-cloud') || 'left';
    var r = this.cv.getBoundingClientRect();
    this.W = Math.max(1, Math.round(r.width));
    this.H = Math.max(1, Math.round(r.height));

    /* dpr limitado a 1.5: a 2.0 o custo dobra e nenhum ponto de 1.5px
       fica visivelmente melhor. */
    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    this.cv.width = Math.round(this.W * dpr);
    this.cv.height = Math.round(this.H * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Densidade por ÁREA, não número fixo: um hero de 1440px e um de
       390px precisam da mesma sensação de rarefação. Teto de 5200 para
       o frame caber no orçamento (~4ms) em máquina modesta. */
    var N = Math.max(1500, Math.min(5200, Math.round(this.W * this.H / 190)));

    /* PRNG próprio (LCG): a nuvem tem de ser a MESMA a cada carga e a
       cada resize — com Math.random o hero "pisca" outra composição
       depois de girar o telefone. */
    var s = 7;
    var rnd = function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    var gauss = function () { return (rnd() + rnd() + rnd() + rnd() - 2) / 2; };

    var lobes = LOBES[this.side] || LOBES.left;
    var guard = GUARDS[this.side] || GUARDS.left;

    /* A borda da coluna de copy é a origem da faixa. Sem coluna no DOM
       (uso fora do hero), cai para 0.50 — o valor antigo. */
    var edge = 0.50;
    var copy = this.cv.parentNode && this.cv.parentNode.querySelector('.nw-hero-copy');
    if (copy) {
      var cr = this.cv.getBoundingClientRect(), pr = copy.getBoundingClientRect();
      /* +18px de respiro: ponto encostado na haste da serif ainda lê como
         sujeira na letra, mesmo com alpha baixa. */
      /* Sem teto artificial: se a coluna de texto for larga demais, a faixa
         simplesmente não existe e a nuvem não é desenhada. Preferível a
         empurrá-la para debaixo da manchete — com teto em 0.72 mediu-se
         alpha 29/255 dentro de uma manchete de 40rem. */
      edge = Math.max(0.30, (pr.right - cr.left + 18) / Math.max(1, cr.width));
    }
    this.edge = edge;

    this.pts = [];
    for (var i = 0; i < N; i++) {
      var q = rnd();
      var c = q < 0.62 ? lobes[0] : q < 0.86 ? lobes[1] : lobes[2];
      var sx = q < 0.62 ? 0.20 : 0.13;
      var sy = q < 0.62 ? 0.22 : 0.15;
      /* o lobo é posicionado em relação à faixa (borda → 1.0), não em
         fração absoluta: a 912px a faixa é estreita e o lobo tem de caber
         nela em vez de nascer atrás do texto e ser zerado pelo guard. */
      var span = Math.max(0.14, 0.96 - edge);
      var x = (edge + (c[0] - 0.42) / 0.58 * span) * this.W + gauss() * sx * this.W * 0.55;
      var y = (c[1] + gauss() * sy) * this.H;
      this.pts.push({
        x: x, y: y,
        a: 0.05 + rnd() * 0.30,          /* alpha de repouso próprio: nada nasce do zero */
        sz: 0.9 + rnd() * 1.5,
        ph: rnd() * 6.2832,
        sp: 0.16 + rnd() * 0.40,          /* respiração individual, senão o campo pulsa junto */
        amp: 2 + rnd() * 7,
        spark: rnd() > 0.93,
        g: guard(x / this.W, y / this.H, smoothstep, edge)
      });
    }
  };

  Field.prototype.draw = function (T) {
    var ctx = this.ctx, pts = this.pts;
    ctx.clearRect(0, 0, this.W, this.H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (p.g < 0.004) continue;                    /* fora da faixa: nem entra no laço de pintura */
      var dy = Math.sin(T * p.sp + p.ph) * p.amp;
      var dx = Math.cos(T * p.sp * 0.7 + p.ph) * p.amp * 0.5;
      var a = p.a * (0.75 + 0.25 * Math.sin(T * 0.5 + p.ph)) * p.g;
      if (a < 0.006) continue;
      ctx.fillStyle = 'rgba(' + (p.spark ? SPARK : TINT) + ',' + a.toFixed(3) + ')';
      ctx.fillRect(p.x + dx, p.y + dy, p.sz, p.sz);
    }
  };

  /* ── Laço ──────────────────────────────────────────────────
     Três armadilhas conhecidas, todas já custaram um diagnóstico:

     1. rAF não dispara em frame oculto NEM em painel de preview
        embutido (ver CLAUDE.md). Então: primeiro quadro é desenhado
        SÍNCRONO — canvas em branco nunca é estado aceitável — e, se
        nenhum QUADRO (não "nenhum tempo") tiver corrido em 400ms, um
        setInterval assume.
     2. IntersectionObserver também roda no ciclo de renderização: num
        frame oculto ele reporta tudo como fora de tela. Pausar por
        isso trancava o campo para sempre. Só pausa quando o documento
        está de fato visível.
     3. visibilitychange reabre o portão (onScreen = true) antes de
        religar; quem estiver realmente fora de tela é pausado pelo
        próximo callback do observer. */
  Field.prototype.stop = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    if (this.timer) { clearInterval(this.timer); this.timer = 0; }
    this.live = false;
  };

  Field.prototype.start = function () {
    if (this.live || !this.onScreen || this.reduce) return;
    this.live = true;
    var self = this;
    var clock = function () { return ((window.performance || Date).now() - self.t0) / 1000; };

    if (document.visibilityState === 'hidden') {
      this.timer = setInterval(function () { self.draw(clock()); }, 45);
      return;
    }
    var frames = 0;
    var frame = function () { frames++; self.draw(clock()); self.raf = requestAnimationFrame(frame); };
    this.raf = requestAnimationFrame(frame);
    setTimeout(function () {
      if (self.live && frames < 2) {
        self.stop();
        self.live = true;
        self.timer = setInterval(function () { self.draw(clock()); }, 45);
      }
    }, 400);
  };

  Field.prototype.init = function () {
    var self = this;
    this.build();
    this.draw(0.9);                                  /* estado sem JS de animação: nuvem parada, forma legível */
    if (this.reduce) return;                         /* reduced-motion para aqui, de propósito */

    var restart = function () { self.stop(); self.onScreen = true; self.start(); };
    document.addEventListener('visibilitychange', restart);

    var gated = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        gated = true;
        for (var i = 0; i < es.length; i++) {
          var e = es[i];
          if (!e.isIntersecting && document.visibilityState !== 'visible') continue;
          self.onScreen = e.isIntersecting;
          if (self.onScreen) self.start(); else self.stop();
        }
      }, { threshold: 0.01, rootMargin: '120px' }).observe(this.cv);
      setTimeout(restart, 450);                      /* fail-safe: nenhum callback chegou */
    }
    if (document.visibilityState === 'hidden' || !('IntersectionObserver' in window)) this.start();

    /* A faixa depende da largura da COLUNA DE TEXTO, que pode mudar sem o
       canvas mudar de tamanho (fonte carregando, zoom de texto). Então
       reconstrói também no resize da janela e depois das webfonts. */
    var rebuild = function () { self.build(); self.draw(0.9); };
    var wt = 0;
    window.addEventListener('resize', function () { clearTimeout(wt); wt = setTimeout(rebuild, 140); });
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) document.fonts.ready.then(rebuild);

    if ('ResizeObserver' in window) {
      var t = 0;
      new ResizeObserver(function () {
        clearTimeout(t);
        t = setTimeout(function () { self.build(); self.draw(0.9); }, 120);
      }).observe(this.cv);
    }
  };

  function boot() {
    var list = document.querySelectorAll('canvas[data-cloud]');
    for (var i = 0; i < list.length; i++) new Field(list[i]).init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
