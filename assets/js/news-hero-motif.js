/* news-hero-motif.js — o topo das materias de periodico.
 *
 * Mesma mecanica do hero da home (index.html): UMA nuvem de pontos que MIGRA
 * entre formas. La' o hidrogel vira retículo cristalino e depois holograma;
 * aqui a migracao e' um ZOOM — o conjunto dente + ligamento + osso se aproxima
 * ate a insercao das fibras e volta. Os mesmos N pontos estao em todas as
 * formas: nada aparece e nada some, tudo se reorganiza.
 *
 *     <header class="na-hero na-hero--motif" data-hero-motif="molar-pdl">
 *
 * O MOTIVO E' DADO PELO VINICIUS, materia por materia. Adicionar um novo e'
 * escrever uma entrada em MOTIFS — o motor nao muda.
 *
 * ── ANATOMIA CODIFICADA (Ten Cate / Nanci, histologia oral) ───────────────
 * Nao e' licenca grafica; cada numero abaixo esta' no desenho:
 *  · Espaco do ligamento em AMPULHETA — mais estreito no terco medio da raiz
 *    (o fulcro) e mais largo na crista e no apice. Largura MEDIDA por micro-CT
 *    em molares e pre-molares humanos: 0.16 a 0.28 mm (Tayman et al., Aust
 *    Endod J 2020;46(3):365-373, doi:10.1111/aej.12416), razao ~1.75 entre o
 *    maior e o menor. E' essa razao que pdlHalf() reproduz.
 *  · Grupos principais, da coroa para o apice: crista alveolar, horizontal,
 *    OBLIQUO (o maior, ~2/3 das fibras), apical e INTERRADICULAR — este ultimo
 *    so' existe em dente multirradicular, na furca. Por isso o molar.
 *  · Direcao do grupo obliquo: a insercao no CEMENTO e' APICAL a' insercao no
 *    OSSO. A fibra sobe para fora. E' o que converte carga axial em tracao no
 *    osso; desenhar ao contrario inverte a biomecanica.
 *  · Grupo da crista alveolar corre ao contrario: do cemento logo abaixo da
 *    JCE para BAIXO e para fora, ate a crista ossea.
 *  · Crista ossea ~1-2 mm apical a' juncao cemento-esmalte.
 *  · Fibras de Sharpey = as pontas mineralizadas embutidas no cemento e no
 *    osso; por isso os feixes ATRAVESSAM as duas paredes no zoom alto.
 *  · O ligamento e' muito vascularizado, com os vasos mais proximos da parede
 *    ossea que da radicular.
 *
 * ── POR QUE CANVAS E NAO PNG ──────────────────────────────────────────────
 * A versao em imagem falhou por medida: a posicao era dada em % DA IMAGEM e
 * object-fit:cover remapeia isso. Com o hero na altura minima (420px) o "19%
 * da altura" caia em 79px na pagina — dentro da .na-topbar (64 a 86px), e o
 * nome do periodico saiu por baixo do seletor de idioma. Aqui o canvas ocupa
 * o hero em inset:0: as coordenadas do canvas SAO as do hero.
 *
 * ── ZONA LIVRE, medida do CSS ─────────────────────────────────────────────
 *   .na-hero-copy  max-width 30rem = 480px -> a coluna de texto morre em 46%
 *   .na-topbar     atravessa a LARGURA TODA e termina em ~17% / ~20.5%
 *   => x 48%..94%, y 24%..100%. Centro horizontal em 71%.
 */
(function () {
  var HOSTS = [].slice.call(document.querySelectorAll('[data-hero-motif]'));
  if (!HOSTS.length) return;

  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* O ciclo INTEIRO e' uma ampliacao continua. MORPH e' so' o trecho final,
   * em que a forma ja' ampliada e' substituida pela forma seguinte — que foi
   * desenhada como a mesma regiao no aumento maior. Nao ha' pausa: quando o
   * quadro parece parado, ele esta' ampliando. */
  var SPAN = 9200, MORPH = 4600;
  /* Ampliacao DISCRETA por etapa. Comecou em 3.4: com esse valor o quadro
   * esta' sempre crescendo de forma perceptivel e o hero rouba a atencao da
   * manchete, que e' o oposto do que um hero deve fazer. Em 1.22 a ampliacao
   * le como uma aproximacao lenta — movimento, nao efeito. O salto de escala
   * de verdade acontece na TROCA de forma, nao dentro dela. */
  var ZOOM = 1.22;
  var FOCUS = [0, 0.52];                  /* para onde a ancora e' trazida    */

  /* Tinta padrao — a mesma paleta da figura de publicacao do site (blue-500
   * primario, orange-500 reservado para PUXAR o olho, teal-500 so' como apoio,
   * nunca como segunda cor de peso igual). molar-pdl usa exatamente isso: azul
   * e' dente, teal e' ligamento (estrutura anatomica propria, justifica o
   * apoio), laranja e' celula/vaso. Motivos com menos justificativa anatomica
   * para o teal declaram o proprio INK (ver petri-paper) em vez de herdar
   * este — copiar a paleta sem copiar a razao dela e' o que ficou generico. */
  var INK = {
    body:   [0, 61, 124],     /* dente  — blue-500   */
    band:   [23, 140, 140],   /* ligamento — teal-500 */
    accent: [239, 124, 0],    /* celula/vaso — orange-500 */
    faint:  [74, 90, 105]     /* osso   — slate-600  */
  };

  function inside(px, py, poly) {
    var hit = false, n = poly.length, i, j;
    for (i = 0, j = n - 1; i < n; j = i++) {
      var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > py) !== (yj > py) &&
          px < (xj - xi) * (py - yi) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  }

  function walk(poly, step) {
    var out = [], i, k;
    for (i = 0; i < poly.length - 1; i++) {
      var a = poly[i], b = poly[i + 1];
      var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      if (!len) continue;
      var nx = dy / len, ny = -dx / len;
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (inside(mx + nx * 0.02, my + ny * 0.02, poly)) { nx = -nx; ny = -ny; }
      var n = Math.max(1, Math.round(len / step));
      for (k = 0; k < n; k++) {
        var t = k / n;
        out.push({ x: a[0] + dx * t, y: a[1] + dy * t, nx: nx, ny: ny });
      }
    }
    return out;
  }

  var MOTIFS = {};

  (function () {
    /* Raizes de um molar em corte, SEM APICE: o contorno desce ate 1.05 e a
     * moldura corta. A furca em y=0.23 e' o que faz a forma ler como molar —
     * e e' tambem o que autoriza o grupo interradicular. */
    var ROOT = [
      [-0.46, 0.00], [-0.48, 0.14], [-0.46, 0.34], [-0.42, 0.58],
      [-0.37, 0.82], [-0.33, 1.05],
      [-0.20, 1.05],
      [-0.17, 0.82], [-0.14, 0.58], [-0.11, 0.38], [-0.08, 0.27],
      [-0.02, 0.23], [ 0.03, 0.24], [ 0.07, 0.29],
      [ 0.10, 0.40], [ 0.13, 0.58], [ 0.16, 0.82], [ 0.19, 1.05],
      [ 0.34, 1.05],
      [ 0.38, 0.80], [ 0.42, 0.56], [ 0.45, 0.32], [ 0.47, 0.12],
      [ 0.46, 0.00]
    ];
    var EDGE = walk(ROOT, 0.005);

    /* Ampulheta: meia-largura do espaco do ligamento em funcao da altura.
     * Minima no terco medio (y=0.55, o fulcro), maior na crista e no apice. */
    function pdlHalf(y) {
      var u = (y - 0.55) / 0.55;
      /* 0.014 -> 0.0245: razao 1.75, a mesma medida por micro-CT */
      return 0.014 + 0.0105 * Math.min(1, u * u);
    }

    /* Deslocamento coronal-apical da fibra ao atravessar o espaco, por altura.
     * u = 0 no cemento, 1 no osso. Sinal negativo = sobe (coronal). */
    function fibreRise(y, u) {
      if (y < 0.11) return  0.055 * u;        /* crista: desce para fora      */
      if (y < 0.19) return  0.004 * u;        /* horizontal                   */
      if (y > 0.94) return  0.030 * u;        /* apical: irradia              */
      return -0.052 * u;                      /* obliquo: cemento apical ao osso */
    }

    function distToRoot(x, y) {
      var best = 9;
      for (var i = 0; i < EDGE.length; i += 6) {
        var dx = x - EDGE[i].x, dy = y - EDGE[i].y, d = dx * dx + dy * dy;
        if (d < best) best = d;
      }
      return Math.sqrt(best);
    }

    /* ── FORMA 1 — o conjunto: dente, ligamento e osso ────────────────────
     * Duas licoes ja' pagas, ambas visiveis so' quando o quadro foi
     * rasterizado e olhado:
     *
     * 1. ORCAMENTO EXATO. As formas produziam MAIS pontos que N, e o excesso
     *    era descartado depois da ordenacao por raio — ou seja, sempre o mais
     *    externo. Sumiam as paredes externas das raizes e o osso inteiro.
     *    Cada categoria agora recebe uma cota de N e se ajusta a ela.
     * 2. ESTRUTURA VEM DE DENSIDADE AO LONGO DE CURVAS, nao de cor. Contorno,
     *    dentina, ligamento e osso com o mesmo tamanho e a mesma opacidade nao
     *    produzem borda nenhuma — o conjunto vira ruido. */
    function formWide(N) {
      var out = [], i, k;

      var nEdge = Math.round(N * 0.24);   /* cemento: a parede interna       */
      var nLam  = Math.round(N * 0.15);   /* lamina dura: a parede externa   */
      var nDent = Math.round(N * 0.16);
      var nPdl  = Math.round(N * 0.22);
      var nBone = N - nEdge - nLam - nDent - nPdl;

      /* comprimento do contorno, para o passo sair da cota e nao do chute */
      var L = 0;
      for (i = 0; i < ROOT.length - 1; i++)
        L += Math.hypot(ROOT[i + 1][0] - ROOT[i][0], ROOT[i + 1][1] - ROOT[i][1]);

      var per = walk(ROOT, L / nEdge);
      for (i = 0; i < per.length && i < nEdge; i++) {
        var e = per[i];
        out.push({ x: e.x + e.nx * (Math.random() - 0.5) * 0.004,
                   y: e.y + e.ny * (Math.random() - 0.5) * 0.004,
                   ink: 'body', r: 1.5, a: 0.55 });
      }

      /* LAMINA DURA — a parede do alveolo, tao definida quanto a do dente.
       * Sem ela o ligamento flutua ao lado da raiz e nao le como ligamento:
       * o que identifica um ligamento periodontal e' estar ENTRE duas paredes. */
      var lam = walk(ROOT, L / nLam);
      for (i = 0; i < lam.length && i < nLam; i++) {
        var q = lam[i];
        if (q.y < 0.035) continue;
        out.push({ x: q.x + q.nx * (0.082 + (Math.random() - 0.5) * 0.006),
                   y: q.y + q.ny * (0.082 + (Math.random() - 0.5) * 0.006),
                   ink: 'faint', r: 1.4, a: 0.46 });
      }

      var g = 0;
      while (nDent > 0 && g < N * 60) {
        g++;
        var rx = (Math.random() - 0.5), ry = Math.random() * 1.04;
        if (!inside(rx, ry, ROOT)) continue;
        out.push({ x: rx, y: ry, ink: 'body', r: 1.05, a: 0.17 });
        nDent--;
      }

      /* Ligamento: cada fibra e' uma FILA de pontos da superficie da raiz ate'
       * a parede do alveolo. Nuvem solta nao le como fibra, le como poeira. */
      /* O limite tem de ser calculado A PARTIR do que ja' foi emitido. Uma
       * versao anterior usava uma soma de cotas desatualizada e o laco parava
       * no meio do contorno: as fibras apareciam so' de um lado do dente. */
      var steps = 8, fibres = Math.max(20, Math.round(nPdl / (steps + 1)));
      var pdlLimit = out.length + nPdl;
      var edge2 = walk(ROOT, L / fibres);
      for (i = 0; i < edge2.length && out.length < pdlLimit; i++) {
        var f = edge2[i];
        if (f.y < 0.035) continue;
        for (k = 0; k <= steps; k++) {
          var u = k / steps;
          /* o feixe atravessa o vao inteiro, do cemento a' lamina dura */
          var d = 0.010 + u * 0.068;
          var accent = (k === steps) && Math.random() < 0.10;
          out.push({ x: f.x + f.nx * d, y: f.y + f.ny * d + fibreRise(f.y, u),
                     ink: accent ? 'accent' : 'band', r: accent ? 1.6 : 1.15,
                     a: accent ? 0.75 : 0.42 });
        }
      }

      /* Osso: trabeculas como fios continuos, com vazios entre elas. Pontos
       * avulsos davam chuvisco cinza. */
      var strands = Math.max(12, Math.round(nBone / 34));
      for (var s2 = 0; s2 < strands && out.length < N; s2++) {
        var se = EDGE[Math.floor(Math.random() * EDGE.length)];
        var bx = se.x + se.nx * (0.095 + Math.random() * 0.02);
        var by = se.y + se.ny * (0.095 + Math.random() * 0.02);
        var ang = Math.atan2(se.ny, se.nx) + (Math.random() - 0.5) * 1.2;
        for (k = 0; k < 34 && out.length < N; k++) {
          ang += (Math.random() - 0.5) * 0.30;
          bx += Math.cos(ang) * 0.010; by += Math.sin(ang) * 0.010;
          var dd = distToRoot(bx, by);
          if (dd > 0.24 || dd < 0.088 || inside(bx, by, ROOT)) {
            ang += Math.PI * (0.7 + Math.random() * 0.3);
            bx += Math.cos(ang) * 0.02; by += Math.sin(ang) * 0.02;
          }
          if (by < 0.05) { by = 0.05 + Math.random() * 0.02; ang = Math.abs(ang); }
          if (by > 1.04) { by = 1.04 - Math.random() * 0.03; ang = -Math.abs(ang); }
          out.push({ x: bx, y: by, ink: 'faint', r: 1.15,
                     a: 0.40 * Math.max(0.32, 1 - dd / 0.24) });
        }
      }
      while (out.length < N) out.push({ x: 0, y: 0.6, ink: 'faint', r: 1.0, a: 0.08 });
      out.length = N;                       /* cota exata: nada e' descartado depois */
      return out;
    }

    /* ── FORMA 2 — a mesma regiao, ~6x ─────────────────────────────────────
     * NAO e' outra figura: e' o ponto marcado na forma 1 (superficie externa
     * da raiz distal, terco medio) visto de perto. Tres faixas verticais —
     * cemento | ligamento | osso — com os feixes atravessando o espaco. Sem a
     * crista: a crista fica na regiao cervical, e o alvo esta' no terco medio.
     * O que muda para a forma 3 e' so' o aumento: aqui os feixes sao muitos e
     * finos; la' sao poucos e grossos. */
    function formMid(N) {
      var out = [], i, k;
      /* O vao ocupa o centro do quadro e e' a coisa mais larga da composicao:
       * o assunto desta forma e' a INTERFACE dente-osso, nao o campo osseo.
       * Na primeira versao o osso pegava de 0.04 a 0.56 — mais da metade da
       * largura — e o olho lia "osso" em vez de "insercao". */
      var xC = -0.20, xB = 0.14;               /* paredes do espaco           */

      var nTooth = Math.round(N * 0.24);
      for (i = 0; i < nTooth; i++) {
        /* linhas incrementais do cemento: bandas horizontais tenues */
        var ty = Math.random() * 1.04;
        if (Math.random() < 0.82) ty = Math.round(ty / 0.075) * 0.075 + (Math.random() - 0.5) * 0.008;
        var near = Math.random() < 0.4;
        out.push({ x: near ? xC - Math.random() * 0.04 : -0.56 + Math.random() * (xC + 0.56),
                   y: Math.max(0.005, Math.min(1.035, ty)),
                   ink: 'body', r: near ? 1.4 : 1.15 });
      }

      /* osso: trabeculas com espacos medulares */
      var holes = [];
      for (i = 0; i < 7; i++)
        holes.push([xB + 0.08 + Math.random() * 0.42, Math.random() * 1.02, 0.045 + Math.random() * 0.045]);
      var nBone = Math.round(N * 0.22), gb = 0;
      while (nBone > 0 && gb < N * 30) {
        gb++;
        var bx = xB + Math.random() * (0.56 - xB), by = Math.random() * 1.04;
        var inHole = false;
        for (i = 0; i < holes.length; i++)
          if (Math.hypot(bx - holes[i][0], by - holes[i][1]) < holes[i][2]) { inHole = true; break; }
        if (inHole) continue;
        var wall = bx < xB + 0.035;
        out.push({ x: bx, y: by, ink: 'faint', r: wall ? 1.4 : 1.1 });
        nBone--;
      }

      /* ligamento: muitos feixes finos, obliquos — insercao no cemento APICAL
       * a' insercao no osso, entao o feixe sobe ao sair para fora */
      /* Resolucao NA DIRECAO DA FIBRA. Com poucos pontos por feixe e muitos
       * feixes, o espacamento vertical fica menor que o horizontal e o olho le
       * colunas verticais em vez de fibras atravessando — foi o que aconteceu.
       * Um feixe precisa de pontos suficientes para virar uma linha. */
      var per = 26, left = N - out.length, bundles = Math.ceil(left / per), bb;
      for (bb = 0; bb < bundles && out.length < N; bb++) {
        var fy = -0.14 + (bb + 0.5) / bundles * 1.32;
        for (k = 0; k < per && out.length < N; k++) {
          var u = k / (per - 1);
          var accent = Math.random() < 0.05;
          out.push({ x: xC + (xB - xC) * u + (Math.random() - 0.5) * 0.006,
                     y: fy + 0.20 * u + (Math.random() - 0.5) * 0.006,
                     ink: accent ? 'accent' : 'band', r: accent ? 1.6 : 1.15 });
        }
      }
      while (out.length < N) out.push({ x: -0.09, y: 0.5, ink: 'band', r: 1.15, a: 0.1 });
      out.length = N;
      return out;
    }

    /* ── FORMA 3 — a insercao, ~25x ─────────────────────────────────────────
     * A mesma faixa da forma 2, mais perto. Agora os feixes sao poucos e
     * grossos e CONTINUAM dentro das duas paredes: sao as fibras de Sharpey, a
     * porcao mineralizada. Entre os feixes, fibroblastos; do lado osseo, vasos
     * em corte — o ligamento e' muito vascularizado e os vasos ficam mais
     * proximos do osso que da raiz. */
    function formClose(N) {
      var out = [], i, k;
      var xC = -0.26, xB = 0.24;

      var nTooth = Math.round(N * 0.19);
      for (i = 0; i < nTooth; i++) {
        var ty = Math.random() * 1.04;
        if (Math.random() < 0.85) ty = Math.round(ty / 0.055) * 0.055 + (Math.random() - 0.5) * 0.007;
        out.push({ x: -0.56 + Math.random() * (xC + 0.56),
                   y: Math.max(0.005, Math.min(1.035, ty)), ink: 'body', r: 1.3 });
      }

      var holes = [];
      for (i = 0; i < 6; i++)
        holes.push([xB + 0.10 + Math.random() * 0.34, Math.random() * 1.02, 0.055 + Math.random() * 0.05]);
      var nBone = Math.round(N * 0.21), gb = 0;
      while (nBone > 0 && gb < N * 30) {
        gb++;
        var bx = xB + Math.random() * (0.56 - xB), by = Math.random() * 1.04;
        var inHole = false;
        for (i = 0; i < holes.length; i++)
          if (Math.hypot(bx - holes[i][0], by - holes[i][1]) < holes[i][2]) { inHole = true; break; }
        if (inHole) continue;
        out.push({ x: bx, y: by, ink: 'faint', r: 1.3 });
        nBone--;
      }

      /* dois vasos em corte, do lado osseo */
      for (var v = 0; v < 2; v++) {
        var vx = xB - 0.06 - v * 0.05, vy = 0.24 + v * 0.46, vr = 0.040 + v * 0.012;
        for (i = 0; i < Math.round(N * 0.022); i++) {
          var an = Math.random() * 6.283, rr = vr * (0.84 + Math.random() * 0.18);
          out.push({ x: vx + Math.cos(an) * rr, y: vy + Math.sin(an) * rr * 0.92,
                     ink: 'accent', r: 1.4 });
        }
      }

      /* Poucos feixes, GROSSOS. Muitos feixes finos com espacamento regular
       * leem como uma grade de pontos — foi o que a primeira versao produziu.
       * Cada feixe aqui tem tres fios paralelos e uma leve curvatura propria. */
      var left = N - out.length, bundles = 13;
      var perB = Math.max(20, Math.floor(left / (bundles * 3)));
      for (var bb = 0; bb < bundles && out.length < N; bb++) {
        var y0 = -0.18 + (bb + 0.5) / bundles * 1.40;
        var bow = (Math.random() - 0.5) * 0.05;      /* curvatura do feixe */
        for (var row = 0; row < 3 && out.length < N; row++) {
          var off = (row - 1) * 0.016 + (Math.random() - 0.5) * 0.006;
          for (var kk = 0; kk < perB && out.length < N; kk++) {
            /* u fora de [0,1] = ponto DENTRO da parede: fibra de Sharpey */
            var u = -0.20 + kk / (perB - 1) * 1.40;
            var sharpey = (u < 0 || u > 1);
            var fibro = !sharpey && (kk % 7 === 3) && row === 1;
            out.push({ x: xC + (xB - xC) * u + (Math.random() - 0.5) * 0.005,
                       y: y0 + off + 0.30 * u + bow * Math.sin(u * 3.14) + (Math.random() - 0.5) * 0.005,
                       ink: fibro ? 'accent' : (sharpey ? 'faint' : 'band'),
                       r: fibro ? 1.8 : 1.25,
                       a: fibro ? 0.75 : (sharpey ? 0.34 : 0.46) });
          }
        }
      }
      while (out.length < N) out.push({ x: 0, y: 0.5, ink: 'band', r: 1.3, a: 0.1 });
      out.length = N;
      return out;
    }

    /* Trava de moldura: y=0 cai em 27% da altura do hero, logo abaixo da
     * .na-topbar, e y=1.04 e' o sangramento pela base. A forma do zoom alto
     * subia a -0.40 normalizado (medido) — o que colocaria pontos DENTRO da
     * barra do seletor de idioma, exatamente o erro da versao em PNG. O clamp
     * e' aplicado a todas as formas, nao so' a que falhou. */
    function clamp(list) {
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (p.y < 0.005) p.y = 0.005 + Math.random() * 0.03;
        if (p.y > 1.04)  p.y = 1.04 - Math.random() * 0.03;
        if (p.x < -0.55) p.x = -0.55 + Math.random() * 0.02;
        if (p.x >  0.55) p.x =  0.55 - Math.random() * 0.02;
      }
      return list;
    }

    /* ANCORA DO ZOOM — o que faz as tres formas serem O MESMO LUGAR em tres
     * escalas, e nao tres figuras diferentes.
     * Na forma 1 e' a superficie externa da raiz distal no terco medio: o
     * ponto que a referencia do Vinicius circula em vermelho. Nas formas 2 e 3
     * e' o centro do espaco do ligamento — a mesma regiao, ja' ampliada.
     * O motor ordena cada forma em torno da SUA ancora, entao a particula que
     * estava ao lado do alvo continua ao lado do alvo depois da migracao: a
     * vizinhanca se abre ate preencher o quadro. E' isso que le como zoom em
     * vez de troca de imagem. */
    MOTIFS['molar-pdl'] = [
      { build: formWide,  anchor: [ 0.445, 0.56] },
      { build: formMid,   anchor: [-0.030, 0.50] },
      { build: formClose, anchor: [-0.010, 0.50] }
    ].map(function (f) {
      return { build: function (N) { return clamp(f.build(N)); }, anchor: f.anchor };
    });
  })();


  /* ── petri-paper — o storyboard do guidance paper ─────────────────────────
   * Quatro formas: placa de Petri com celulas -> grafico de viabilidade com os
   * dias 1 a 3 medidos -> o MESMO grafico com os dias 4 e 5 -> o grafico vira
   * a figura de um artigo aberto. E volta.
   *
   * ── CORRESPONDENCIA POR INDICE, nao por raio ──────────────────────────────
   * Este motivo desliga a ordenacao radial do motor (keepOrder). No molar a
   * ordenacao por distancia a' ancora era o que fazia a migracao ler como zoom;
   * aqui a narrativa e' NOMEADA — uma celula vira uma replica, o aro da placa
   * vira o eixo — e raio nao sabe disso. Com keepOrder as quatro formas emitem
   * os mesmos quatro blocos, na mesma ordem, com a mesma cota, e a particula de
   * indice i e' a MESMA COISA em todas elas:
   *
   *   A 20%  vidro da placa     -> eixos + ticks        -> moldura, dobra, titulo
   *   B 36%  monocamada         -> replicas de cada dia -> replicas dentro da figura
   *   C 09%  celulas periferia  -> a linha de tendencia -> a linha dentro da figura
   *   D 35%  meio de cultura    -> grades horizontais   -> filas de texto
   *
   * O bloco B e' dividido em cinco quintos iguais, um por dia. E' o que faz a
   * monocamada se ORGANIZAR em pontos de dados em vez de ser substituida por
   * eles — a leitura pedida no painel 02 do storyboard.
   *
   * ── OS DOIS GRAFICOS SAO O MESMO GRAFICO ──────────────────────────────────
   * Eixos, ticks, grade e caixa do plot sao identicos nas formas 2 e 3, ate' o
   * dia 5 desde o inicio. O que muda: as replicas dos dias 4 e 5, que na forma 2
   * estao deitadas SOBRE o eixo x (palidas, sem altura — nada e' afirmado sobre
   * elas), sobem para os seus valores; e a linha, que tem sempre os mesmos
   * pontos e portanto se ESTICA de tres para cinco dias em vez de ser trocada.
   *
   * ── PALETA ────────────────────────────────────────────────────────────────
   * Azul, e so' azul, do blue-500 ao blue-200 conforme a profundidade — o tom
   * do hero da home, que e' o padrao. A versao anterior herdava o INK do molar,
   * onde o teal-500 e' uma cor de PESO IGUAL ao azul; la' isso se justifica
   * (o ligamento e' um tecido a parte do dente e do osso), aqui nao havia
   * nenhuma razao anatomica e o resultado foi teal e laranja brigando em
   * partes iguais, sem hierarquia.
   * O laranja ficou em UM elemento so', o bloco C: as celulas que se acumulam
   * na periferia da placa e que depois formam a LINHA DE TENDENCIA. E' o unico
   * uso que o sistema do site autoriza — "orange-500, accent used to lead the
   * eye" —, e conduz o olho exatamente onde a materia quer: da esquerda para a
   * direita, viabilidade subindo. As replicas voltaram a ser azuis: sao o dado
   * bruto, nao a conclusao.
   *
   * ── PROFUNDIDADE ──────────────────────────────────────────────────────────
   * Todo ponto declara z (-1 fundo, +1 frente) e o motor tira dali tamanho,
   * opacidade e cor. Na placa o z e' geometria de verdade (a borda da frente
   * esta' mais perto que a do fundo, e por isso pesa mais); no grafico e no
   * artigo e' hierarquia de leitura — grade e moldura vao para tras, dado e
   * linha vem para a frente.
   *
   * NENHUM TEXTO. Titulo, autoria, legenda e corpo sao filas de pontos. */
  (function () {
    /* C caiu para 0.05. Com 0.09 a linha laranja era a MASSA maior da figura
     * e as replicas azuis viravam pontinhos por cima dela — o acento tinha
     * virado o assunto, que e' o contrario de conduzir o olho. O laranja tem de
     * ser fino: o que enche o grafico e' o dado (B), nao a conclusao (C). */
    var A_FR = 0.20, B_FR = 0.42, C_FR = 0.05;   /* D = o que sobrar */

    /* O desenho abaixo foi tracado numa caixa de meia-largura 0.65 e e'
     * comprimido para 0.62 na saida. A razao: a faixa livre do hero mede
     * ~392x325 px (1.21), e uma caixa de meia-largura h tem razao 2h — com
     * 0.65 a LARGURA passava a mandar no dimensionamento e sobrava altura sem
     * uso, que e' o vazio marcado em cima e embaixo. Em 0.62 as duas dimensoes
     * chegam ao limite juntas. */
    var KX = 0.954;

    function q(N, f) { return Math.round(N * f); }
    function rnd(s) { return (Math.random() - 0.5) * (s || 0); }

    function fit(out, N) {
      while (out.length < N) out.push({ x: 0, y: 0.5, ink: 'faint', r: 0.9, a: 0.05, z: -1 });
      out.length = N;
      for (var i = 0; i < N; i++) out[i].x *= KX;
      return out;
    }
    function pad(out, upTo, x, y, ink, a, z) {
      while (out.length < upTo) out.push({ x: x, y: y, ink: ink, r: 0.9, a: a, z: z });
    }
    function line(out, x1, y1, x2, y2, n, ink, r, a, jit, z, zs) {
      for (var i = 0; i < n; i++) {
        var t = n < 2 ? 0.5 : i / (n - 1);
        out.push({ x: x1 + (x2 - x1) * t + rnd(jit), y: y1 + (y2 - y1) * t + rnd(jit),
                   ink: ink, r: r, a: a, z: z + rnd(zs) });
      }
    }
    /* fila de texto: jitter anisotropico — solto na horizontal, apertado na
     * vertical. E' o que distingue uma fila de texto de um fio. */
    function bar(out, x1, x2, y, n, ink, r, a, z, zs) {
      for (var i = 0; i < n; i++) {
        var t = n < 2 ? 0.5 : i / (n - 1);
        out.push({ x: x1 + (x2 - x1) * t + rnd(0.011), y: y + rnd(0.006),
                   ink: ink, r: r, a: a, z: z + rnd(zs) });
      }
    }
    /* elipse em perspectiva: z acompanha o seno, entao a metade da FRENTE fica
     * maior e mais escura que a do fundo. E' so' isso que faz um anel de pontos
     * ler como circulo inclinado no espaco em vez de elipse desenhada. */
    function ell(out, cx, cy, rx, ry, n, ink, r, a, jit, z0, zamp) {
      for (var i = 0; i < n; i++) {
        var th = i / n * 6.2832;
        out.push({ x: cx + Math.cos(th) * rx + rnd(jit), y: cy + Math.sin(th) * ry + rnd(jit),
                   ink: ink, r: r, a: a, z: z0 + zamp * Math.sin(th) + rnd(0.12) });
      }
    }
    /* replicas: soma de tres uniformes ~ gaussiana. Replica se acumula perto da
     * media e rareia nas caudas; nuvem uniforme le como mancha. O z espalhado
     * da' volume a' nuvem — sem ele sao cinco discos chapados. */
    function cloud(out, cx, cy, rx, ry, n, ink, r, a, z, zs) {
      for (var i = 0; i < n; i++) {
        var g1 = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        var g2 = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        out.push({ x: cx + g1 * rx, y: cy + g2 * ry, ink: ink, r: r, a: a, z: z + rnd(zs) });
      }
    }
    /* celula = anel achatado (o contorno) + nucleo. Ponto solto le como poeira.
     * Achatamento 0.55-0.80 porque a base da placa esta' em perspectiva. */
    function cells(out, n, place, ringInk, coreInk, coreR, coreA) {
      var made = 0, k;
      while (made < n) {
        var c = place(), zc = c[2];
        var rad = 0.015 + Math.random() * 0.010;
        var fl = 0.55 + Math.random() * 0.25, ro = Math.random() * 3.1416;
        for (k = 0; k < 7 && made < n; k++) {
          var an = k / 7 * 6.2832 + Math.random() * 0.35;
          var px = Math.cos(an) * rad, py = Math.sin(an) * rad * fl;
          out.push({ x: c[0] + px * Math.cos(ro) - py * Math.sin(ro),
                     y: c[1] + px * Math.sin(ro) + py * Math.cos(ro),
                     ink: ringInk, r: 1.15, a: 0.40, z: zc + rnd(0.18) });
          made++;
        }
        for (k = 0; k < 4 && made < n; k++) {
          out.push({ x: c[0] + rnd(rad * 0.75), y: c[1] + rnd(rad * 0.55),
                     ink: coreInk, r: coreR, a: coreA, z: zc + 0.14 + rnd(0.12) });
          made++;
        }
      }
    }

    /* ── 1. PLACA DE PETRI ────────────────────────────────────────────────── */
    var RIM_Y = 0.330, RIM_RX = 0.630, RIM_RY = 0.288;
    var BAS_Y = 0.605, BAS_RX = 0.598, BAS_RY = 0.282;

    function formPetri(N) {
      var out = [], i;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;

      /* A — o vidro. Aro DUPLO: a espessura da borda e' o que distingue uma
       * placa de Petri de um disco. */
      var r1 = Math.round(nA * 0.36), r2 = Math.round(nA * 0.20), r3 = Math.round(nA * 0.26);
      ell(out, 0, RIM_Y, RIM_RX, RIM_RY, r1, 'faint', 1.5, 0.60, 0.004, 0.30, 0.66);
      ell(out, 0, RIM_Y + 0.020, RIM_RX * 0.982, RIM_RY * 0.955, r2, 'faint', 1.15, 0.32, 0.004, 0.16, 0.60);
      ell(out, 0, BAS_Y, BAS_RX, BAS_RY, r3, 'faint', 1.35, 0.48, 0.004, -0.26, 0.58);
      var w = nA - r1 - r2 - r3, wh = Math.round(w / 2);
      line(out, -RIM_RX, RIM_Y, -BAS_RX, BAS_Y, wh, 'faint', 1.25, 0.48, 0.005, -0.05, 0.20);
      line(out,  RIM_RX, RIM_Y,  BAS_RX, BAS_Y, w - wh, 'faint', 1.25, 0.48, 0.005, -0.05, 0.20);
      pad(out, nA, 0, BAS_Y, 'faint', 0.05, -0.9);

      /* B — a monocamada, AZUL. Sai em ordem sequencial e o motor parte o bloco
       * em cinco quintos: cada quinto vira as replicas de um dia. */
      cells(out, nB, function () {
        var t = Math.random() * 6.2832, d = Math.sqrt(Math.random()) * 0.86;
        var sy = Math.sin(t) * d;
        return [Math.cos(t) * d * BAS_RX, BAS_Y + sy * BAS_RY, -0.26 + sy * 0.58];
      }, 'band', 'body', 1.45, 0.62);

      /* C — as mesmas celulas periféricas, mas AZUIS aqui. A primeira versao
       * pintava esse grupo de laranja ja' na placa, e o laranja nao dizia
       * nada: sao celulas iguais as do bloco B, so' que na borda — nao ha'
       * diferenca biologica para marcar com uma segunda cor, e a placa ficava
       * com pontos laranja soltos sem explicacao. Elas se tornam a linha de
       * tendencia so' na TRANSICAO para o grafico, quando de fato passam a
       * significar algo (a curva de viabilidade) — o laranja nasce ali,
       * gradualmente, puxado pela propria migracao de cor entre formas. */
      cells(out, nC, function () {
        var t = Math.random() * 6.2832, d = 0.80 + Math.random() * 0.16;
        var sy = Math.sin(t) * d;
        return [Math.cos(t) * d * BAS_RX, BAS_Y + sy * BAS_RY, -0.20 + sy * 0.58];
      }, 'band', 'body', 1.4, 0.62);

      /* D — o meio de cultura */
      for (i = 0; i < nD; i++) {
        var t2 = Math.random() * 6.2832, d2 = Math.sqrt(Math.random());
        var s2 = Math.sin(t2) * d2;
        out.push({ x: Math.cos(t2) * d2 * BAS_RX * 0.95, y: BAS_Y + s2 * BAS_RY * 0.95,
                   ink: 'band', r: 1.0, a: 0.18, z: -0.48 + s2 * 0.42 + rnd(0.2) });
      }
      return fit(out, N);
    }

    /* ── 2 e 3. O GRAFICO ─────────────────────────────────────────────────── */
    var AXX = -0.60, AXY = 0.935, AXT = 0.045, XEND = 0.64;
    var DAY = [-0.42, -0.16, 0.10, 0.34, 0.58];
    var VIA = [0.35, 0.55, 0.70, 0.80, 0.90];
    function vy(v) { return AXY - v * (AXY - AXT); }

    function graph(N, upto) {
      var out = [], k;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;

      /* A — eixos SEMPRE completos, ate' o dia 5 desde o inicio. Sao os mesmos
       * pontos nas duas formas, entao nao se mexem: o grafico fica parado e so'
       * a medida avanca. Uma fila densa com jitter minimo — num grafico o eixo
       * e' a coisa mais reta da figura; se ele treme, nada parece medido. */
      var ay = Math.round(nA * 0.20), ax = Math.round(nA * 0.18);
      line(out, AXX, AXY, AXX, AXT, ay, 'body', 1.25, 0.50, 0.0018, -0.20, 0.10);
      line(out, AXX, AXY, XEND, AXY, ax, 'body', 1.25, 0.50, 0.0018, -0.20, 0.10);
      var tn = Math.max(2, Math.round(nA * 0.14 / 9));
      for (k = 1; k <= 4; k++)
        line(out, AXX - 0.021, vy(k * 0.25), AXX - 0.004, vy(k * 0.25), tn, 'body', 1.05, 0.40, 0.0018, -0.30, 0.08);
      for (k = 0; k < 5; k++)
        line(out, DAY[k], AXY + 0.004, DAY[k], AXY + 0.023, tn, 'body', 1.05, 0.40, 0.0018, -0.30, 0.08);
      /* CAIXA DO PLOT (spine de cima e da direita), bem ao fundo. Existe por
       * duas razoes: o bloco A tem a massa que a placa precisa no aro de vidro,
       * e dois eixos sozinhos nao consomem isso — o excedente ia todo para a
       * espessura das linhas e o eixo saia borrado. E ela corresponde a' moldura
       * da pagina na forma seguinte. */
      var fr = nA - out.length, fh = Math.round(fr / 2);
      line(out, AXX, AXT, XEND, AXT, fh, 'faint', 0.95, 0.24, 0.004, -0.70, 0.10);
      line(out, XEND, AXT, XEND, AXY, fr - fh, 'faint', 0.95, 0.24, 0.004, -0.70, 0.10);
      pad(out, nA, XEND, AXY, 'faint', 0.05, -0.9);

      /* B — cinco nuvens de replicas AZUIS, uma por dia, um quinto do bloco
       * cada. As dos dias ainda nao medidos ficam DEITADAS sobre o eixo x, ao
       * fundo: nao afirmam viabilidade nenhuma, e na passagem sobem ate' o
       * valor. */
      var per = Math.floor(nB / 5), lim = out.length + nB;
      for (k = 0; k < 5; k++) {
        var n5 = (k === 4) ? lim - out.length : per;
        if (k < upto) cloud(out, DAY[k], vy(VIA[k]), 0.046, 0.076, n5, 'body', 1.3, 0.44, 0.36, 0.86);
        else          cloud(out, DAY[k], AXY + 0.003, 0.058, 0.007, n5, 'faint', 1.0, 0.16, -0.62, 0.24);
      }

      /* C — a linha de tendencia, o unico laranja. Sempre os MESMOS pontos: com
       * tres dias ela sai curta e densa, com cinco ela se estica. E' isso que le
       * como a linha crescendo em vez de um segundo grafico entrando no lugar do
       * primeiro. Cinco filas finas e nao tres grossas: a linha tem de ler como
       * faixa de pontos; solida, denuncia que foi desenhada. */
      var segs = upto - 1, cl = out.length + nC;
      var pseg = Math.max(1, Math.floor(nC / segs / 3));
      for (k = 0; k < segs && out.length < cl; k++)
        for (var rw = 0; rw < 3; rw++)
          line(out, DAY[k], vy(VIA[k]) + (rw - 1) * 0.0055,
                    DAY[k + 1], vy(VIA[k + 1]) + (rw - 1) * 0.0055,
                    pseg, 'accent', 1.05, 0.60, 0.0045, 0.86, 0.18);
      pad(out, cl, DAY[upto - 1], vy(VIA[upto - 1]), 'accent', 0.4, 0.7);

      /* D — 8 grades e nao 4: com 4 o orcamento de D cai todo em quatro filas e
       * elas viram linhas cheias. Oito alternando forte/fraca preenchem o
       * interior do grafico — que vazio era metade do quadro — sem nenhuma
       * competir com o dado. */
      var gr = 8, pg = Math.floor(nD * 0.82 / gr), dl = out.length + nD;
      for (k = 1; k <= gr; k++)
        line(out, AXX + 0.004, vy(k * 0.125), XEND - 0.01, vy(k * 0.125), pg,
             'band', 1.0, (k % 2 ? 0.11 : 0.19), 0.004, -0.62, 0.16);
      while (out.length < dl)
        out.push({ x: AXX + 0.01 + Math.random() * (XEND - AXX - 0.02),
                   y: AXT + Math.random() * (AXY - AXT - 0.01),
                   ink: 'band', r: 0.95, a: 0.12, z: -0.78 + rnd(0.14) });
      return fit(out, N);
    }
    function formG3(N) { return graph(N, 3); }
    function formG5(N) { return graph(N, 5); }

    /* ── 4. O ARTIGO ABERTO ───────────────────────────────────────────────── */
    /* Um SPREAD, nao uma pagina. A faixa livre do hero e' 1.2x mais larga que
     * alta; uma pagina de artigo tem proporcao 0.71, entao sozinha ela deixaria
     * um terco do quadro vazio dos dois lados. Duas paginas abertas preenchem a
     * faixa e ainda dao o lugar natural para a figura: pagina direita, no alto. */
    var SL = -0.64, SR = 0.64, ST = 0.018, SB = 0.982;
    var FX0 = 0.055, FX1 = 0.615, FY0 = 0.062, FY1 = 0.452;
    function fx(k) { return FX0 + 0.058 + (FX1 - 0.045 - FX0 - 0.058) * k / 4; }
    function fy(v) { return (FY1 - 0.040) - v * ((FY1 - 0.040) - (FY0 + 0.028)); }

    function formPaper(N) {
      var out = [], k;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;

      /* A — moldura, dobra central, titulo e autoria */
      var e = Math.round(nA * 0.115), al = out.length + nA;
      line(out, SL, ST, SR, ST, e, 'faint', 1.2, 0.48, 0.004, -0.18, 0.10);
      line(out, SL, SB, SR, SB, e, 'faint', 1.2, 0.48, 0.004, -0.10, 0.10);
      line(out, SL, ST, SL, SB, e, 'faint', 1.2, 0.48, 0.004, -0.14, 0.10);
      line(out, SR, ST, SR, SB, e, 'faint', 1.2, 0.48, 0.004, -0.14, 0.10);
      /* a dobra e' o que faz duas paginas em vez de um retangulo dividido; ela
       * fica um pouco a' frente porque o papel se ergue ali */
      line(out, 0, ST, 0, SB, Math.round(nA * 0.16), 'faint', 1.3, 0.40, 0.006, -0.20, 0.16);
      bar(out, -0.585, -0.115, 0.085, Math.round(nA * 0.16), 'body', 1.6, 0.50, 0.20, 0.16);
      bar(out, -0.585, -0.265, 0.130, Math.round(nA * 0.12), 'body', 1.6, 0.50, 0.16, 0.16);
      bar(out, -0.585, -0.360, 0.184, Math.round(nA * 0.06), 'body', 1.1, 0.30, -0.10, 0.14);
      /* cabeca de secao: consome o resto da cota, que na placa e' o aro de vidro
       * e aqui nao pode virar espessura de titulo — titulo grosso demais e' a
       * unica coisa que o olho ve */
      pad(out, al, -0.430 + Math.random() * 0.2, 0.240 + rnd(0.008), 'body', 0.34, 0.02);

      /* B — as mesmas replicas, agora dentro da figura */
      var per = Math.floor(nB / 5), bl = out.length + nB;
      for (k = 0; k < 5; k++)
        cloud(out, fx(k), fy(VIA[k]), 0.024, 0.037,
              (k === 4) ? bl - out.length : per, 'body', 1.15, 0.42, 0.40, 0.76);

      /* C — a mesma linha, dentro da figura */
      var cl = out.length + nC, pseg = Math.max(1, Math.floor(nC / 4 / 3));
      for (k = 0; k < 4 && out.length < cl; k++)
        for (var rw = 0; rw < 3; rw++)
          line(out, fx(k), fy(VIA[k]) + (rw - 1) * 0.0032,
                    fx(k + 1), fy(VIA[k + 1]) + (rw - 1) * 0.0032,
                    pseg, 'accent', 1.0, 0.60, 0.003, 0.84, 0.16);
      pad(out, cl, fx(2), fy(VIA[2]), 'accent', 0.4, 0.7);

      /* D — moldura e eixos da figura, legenda e as filas de texto */
      var dl = out.length + nD;
      var fe = Math.round(nD * 0.028);
      line(out, FX0, FY0, FX1, FY0, fe, 'faint', 1.0, 0.22, 0.004, -0.34, 0.10);
      line(out, FX0, FY1, FX1, FY1, fe, 'faint', 1.0, 0.22, 0.004, -0.30, 0.10);
      line(out, FX0, FY0, FX0, FY1, fe, 'faint', 1.0, 0.22, 0.004, -0.32, 0.10);
      line(out, FX1, FY0, FX1, FY1, fe, 'faint', 1.0, 0.22, 0.004, -0.32, 0.10);
      line(out, FX0 + 0.040, FY1 - 0.040, FX0 + 0.040, FY0 + 0.020, Math.round(nD * 0.024), 'body', 1.15, 0.44, 0.003, 0.02, 0.10);
      line(out, FX0 + 0.040, FY1 - 0.040, FX1 - 0.030, FY1 - 0.040, Math.round(nD * 0.028), 'body', 1.15, 0.44, 0.003, 0.02, 0.10);
      bar(out, 0.055, 0.500, 0.492, Math.round(nD * 0.020), 'body', 1.0, 0.26, -0.24, 0.14);
      bar(out, 0.055, 0.330, 0.516, Math.round(nD * 0.014), 'body', 1.0, 0.26, -0.24, 0.14);

      /* 14 filas na pagina esquerda, 9 na direita (o alto dela e' a figura).
       * Com 29 filas o orcamento dava 28 pontos por fila e o bloco lia como
       * poeira; 23 filas dao o dobro, com passo de ~3.5 px, que e' onde uma
       * fila de pontos comeca a ler como linha de texto. A ultima fila de cada
       * paragrafo e' curta — e' o que faz um bloco ler como texto e nao tarja. */
      var rest = dl - out.length, rows = 23, pr = Math.max(3, Math.floor(rest / rows));
      for (k = 0; k < 14 && out.length + pr <= dl; k++) {
        var sL = (k % 5 === 4) ? 0.52 : 1;
        bar(out, -0.585, -0.585 + 0.525 * sL, 0.288 + k * 0.050, pr, 'body', 1.05, 0.30, -0.42, 0.22);
      }
      for (k = 0; k < 9 && out.length + pr <= dl; k++) {
        var sR = (k % 4 === 3) ? 0.45 : 1;
        bar(out, 0.055, 0.055 + 0.545 * sR, 0.560 + k * 0.050, pr, 'body', 1.05, 0.30, -0.42, 0.22);
      }
      while (out.length < dl)
        out.push({ x: 0.055 + Math.random() * 0.545, y: 0.955 + Math.random() * 0.014,
                   ink: 'body', r: 1.05, a: 0.28, z: -0.42 + rnd(0.2) });
      return fit(out, N);
    }

    var M = [
      { build: formPetri, anchor: [0, 0.50] },
      { build: formG3,    anchor: [0, 0.50] },
      { build: formG5,    anchor: [0, 0.50] },
      { build: formPaper, anchor: [0, 0.50] }
    ];
    /* 6.6 s por etapa, 2.2 s de passagem, volta de 26 s. A passagem e' 1/3 do
     * tempo e nao metade como no molar: la' a transicao ERA o assunto (a
     * aproximacao continua), aqui o assunto sao as quatro figuras. */
    M.span = 6600; M.morph = 2200; M.zoom = 1.04; M.focus = [0, 0.50];
    M.keepOrder = true;
    M.lit = true;
    /* AZUL, do blue-500 ao blue-200 conforme a profundidade — o tom do hero da
     * home. O teal saiu: no molar ele e' o ligamento, um tecido a parte, e por
     * isso pode ter peso igual ao azul; aqui nao havia nada que o justificasse
     * e ele so' brigava com o laranja. */
    M.ink = {
      body:   [  0,  61, 124],   /* blue-500 — replicas, eixos, texto, titulo   */
      band:   [ 62, 111, 168],   /* blue-400 — membrana da celula, grade, meio  */
      accent: [239, 124, 0  ],   /* orange-500 — SO' a linha de tendencia       */
      faint:  [124, 162, 204]    /* blue-300 — vidro, moldura, caixa do plot    */
    };
    M.far = [186, 207, 229];     /* para onde a tinta desbota: blue-200 clareado */
    /* Densidade: 4.4 contra 1.43 do molar, teto de 6800 contra 3200. O hero da
     * home roda 160 mil pontos em WebGL; em canvas 2D cada ponto e' uma chamada
     * de caminho, entao a conta e' outra. 6 mil nucleos mais ~1.4 mil halos e'
     * o que cabe num quadro de 16 ms com folga — e a leitura de "cheio" vem
     * muito mais da variacao de tamanho e opacidade do que da contagem. */
    M.area = 4.4; M.cap = 6800;
    /* Enquadramento. half 0.62 e nao 0.65: a faixa livre mede ~392x325 px
     * (razao 1.21) e uma caixa de meia-largura h tem razao 2h — em 0.65 a
     * largura passava a mandar sozinha no dimensionamento e sobrava altura sem
     * uso. bottom 0.95, e cada forma agora desenha de 0.02 a 0.98 da caixa:
     * antes o grafico so' ocupava de 0.10 a 0.92 e o vazio somava ~120 px.
     * lo/hi na faixa TOTALMENTE opaca da mascara (0.545-0.885): uma forma de
     * borda reta nao pode encostar na rampa, senao a moldura apagada le como
     * pagina cortada. */
    /* half caiu para 0.50: com 0.62 a LARGURA vencia a disputa de tamanho antes
     * da altura, e a caixa nunca crescia o bastante para preencher a faixa
     * vertical — sobrava vazio em cima E embaixo. Em 0.50 quem manda e' fitH
     * (a altura), e a caixa cresce ate' tocar o teto e o piso da faixa.
     * top 0.27 (nao 0.30): a mascara so' apaga de verdade abaixo de 0.24 — de
     * 0.24 a 0.30 ela so' esmaece em rampa, de proposito ("corte duro
     * denunciaria o retangulo", ver a mascara mais abaixo). Deixar a borda de
     * cima entrar nessa rampa e' o unico jeito de reduzir o vazio sem colidir
     * com a .na-topbar. center=true faz o resto: mede o y real do desenho e
     * reparte a sobra IGUAL para cima e para baixo dentro da faixa — o
     * ancoramento padrao (max(top, bottom-S)) empurra tudo para o piso e deixa
     * a sobra inteira em cima, que era exatamente o defeito apontado. */
    /* top/bottom agora sao so' o PISO — matchCopy mede a `.na-hero-copy` de
     * verdade e usa isso se vier mais generoso que o piso. 0.24 e' o limite
     * duro da mascara (abaixo disso o ponto some por inteiro); 0.99 quase
     * encosta na borda de baixo, que aqui nao tem topbar para proteger. */
    M.half = 0.50; M.foot = 1.00; M.top = 0.24; M.bottom = 0.99;
    M.lo = 0.545; M.hi = 0.885;
    M.fitH = true; M.center = true; M.matchCopy = true;
    MOTIFS['petri-paper'] = M;
  })();


  /* ── earth-iso — a materia do ISO/TC 194 ──────────────────────────────────
   * Nao e' "globo -> mapa": e' O MESMO GLOBO, mais perto. A grade e' sempre a
   * mesma malha de meridianos e paralelos da esfera, so' com espacamento mais
   * fino no zoom — uma grade retangular local, que a versao anterior usava,
   * denuncia mapa plano na hora. E o mundo NAO para de girar durante a
   * aproximacao: ele desacelera, que e' o que uma camera travando num alvo faz.
   *
   * ── A COREOGRAFIA, em numeros ─────────────────────────────────────────────
   * Ciclo de 24 s: tres etapas de 8 s, cada uma com 2 s parada e 6 s de
   * passagem. Uma volta do mundo por ciclo = 15 graus/s.
   *
   *    0.0 s  abre com Singapura 55 graus a esquerda do centro (x = -0.39,
   *           perto do limbo), entrando da esquerda para a direita
   *    2.0 s  comeca a descida; Singapura ainda 25 graus a esquerda (x = -0.20)
   *    5.0 s  meio da descida, 11 graus a direita (x = +0.23)
   *    8.0 s  zoom completo, 9 graus a direita (x = +0.29), em evidencia
   *   10.0 s  comeca a virar ISO; 14 graus a direita (x = +0.42), saindo
   *
   * A posicao inicial vem de uma FASE na rotacao (spinPhase), nao de girar o
   * eixo entre as formas: a diferenca de eixo viraria rotacao extra durante a
   * passagem e jogaria Singapura para fora do quadro — foi o que aconteceu.
   * Durante a descida o giro cai de 1x para 0.14x. Nao para: as outras terras
   * seguem cruzando o quadro, e e' por isso que Singapura acaba saindo.
   *
   * ── AS COSTAS SAO REAIS ───────────────────────────────────────────────────
   * Natural Earth 110m (dominio publico, via world-atlas land-110m TopoJSON),
   * reamostrada a passo constante em DISTANCIA REAL — o delta de longitude
   * entra multiplicado por cos(lat). Reamostrar em graus, como a versao
   * anterior, dava ao Artico quatro vezes mais pontos por quilometro de
   * litoral.
   *
   * ── A FAIXA HORIZONTAL ERA FIJI ───────────────────────────────────────────
   * A linha que atravessava o globo nao era o equador, nem grade, nem
   * projecao: era um SEGMENTO FANTASMA nos dados. Fiji cruza o antimeridiano,
   * e o GeoJSON grava isso com vertices em +180 e -180; o par consecutivo vira
   * um segmento reto de 345 graus de arco a -16.5 de latitude, atravessando o
   * planeta inteiro. Reamostrado a passo constante, ele preenchia essa linha
   * inexistente com 967 pontos — 17.4% de TODA a costa numa unica latitude.
   * O gerador agora salta qualquer segmento acima de 12 graus de arco (sao 7
   * no dataset, todos em anticruzamentos de antimeridiano). Pior latitude
   * depois: 89 pontos, 2%.
   *
   * ── OS POLOS SAO CORTADOS: lat -56 a +70 ──────────────────────────────────
   * As duas faixas densas que atravessavam o globo — uma em cima, outra
   * embaixo — nao eram grade nem artefato de projecao (diagnostiquei errado
   * tres vezes antes de medir direito). Eram COSTA DE VERDADE: a Antartica e'
   * um anel de litoral a ~70S que circunda o globo INTEIRO, e o Artico
   * (Groenlandia, arquipelago canadense, Siberia) e' o litoral mais recortado
   * do planeta. Juntas eram 14.8% dos pontos, desenhando duas bandas
   * horizontais em regioes que nao dizem nada nesta materia. Cortadas fora,
   * mais o afinamento por cos(lat) acima de 40 graus: acima de 60N sobram 7%.
   * E' um recorte declarado da faixa de latitudes, nao geografia inventada.
   * Singapura: 1.3521N, 103.8198E.
   *
   * ── OCEANO ────────────────────────────────────────────────────────────────
   * Poeira esparsa na superficie da esfera, distribuida por area (o arco-seno
   * na latitude, senao ela se acumula nos polos). No globo mal se nota; no
   * zoom e' o mar entre as ilhas, e e' o que impede o quadro de esvaziar
   * quando a vista deriva para o Pacifico. Nao afirma nada: e' textura.
   *
   * ── AS LETRAS ─────────────────────────────────────────────────────────────
   * A fonte do site, amostrada de um canvas fora de tela, com a caixa MEDIDA
   * dos pixels e escala UNICA nos dois eixos. Nao e' o logotipo registrado da
   * ISO. */
  (function () {
    var COAST_G = 'yYHJgcmCyYLIgsmAyYDIgcmDyYDIgciCyYPJf8iCyIPJhMl+yILIg8l+yYXJfseCx4PJhceEyn3HgsmGx4XHg8p8x4XGg8p8xn/HfsiHx33HhsZ/x33GhMiIx3zGgMeGxoDHfMaBy3vIiMh7xYLIiMaFzYHNgMh6xYLNgcaHzX/Les2CzX/Fhch6xYPHiceIzYLIec1+ynnJeceJxYbFg8aJzX7JeMp5xYTOgsWGyXjGic19xITHisp4ynfOfMp3xIXHi86CxorKjMWHynfOg8t3zoPOe8qMx4vEhct3xIfKjcp2y3fOe8+ExovLjcSGxozKdsSHzHfFi857ynbLjct2yo7Dhs+Exo3Md8WLw4fKjsWLz3vMdst1y47GjcmOw4fJjsmP0ITLdcWMzHbDh897y47FjdCEzHXGjs12yY/Pe8WOxo7Mj8x0zXbQhcx1yJDGj9B7znbOdsyPzXXFj8aQ0IbIkc520HvNkM10xpDIkcWQ0YbIkc92x5HGkc2QznTHkdF70YfFkc50z3bGks2R0YfRes50x5PFkceSxpLPdM2S0XrQddKIxZLSfc900n3SetB1zZPSiNJ80nvQdNJ70nrSfsWT0HXThNKJ0HTTgM2T03/TftOD04XTgdF00onTgsWU0HPTg82U04XSidOC04HTiNF004nRc8WVzZXUgdFz04fSi8yW1IbTiNSB0XTFlcyW04zUh9R8zJfTjNSHzJfUftR804zUftSH1H/FltR71IDLmNOM1YDTjdV/1YDUe8SX0nTLmNJzw5bUetONw5bVgcSX043VftWAy5nUedR5xJfTdNN01HjTc8OW1XvUjdWB1I7Ve9WAy5rVftN01I7VetR303PVgcKW1I7VedV81XvNmc2Z1XjVesyayprWftaA1I7UdNaB03PCl9V41n3Uj82a1XrMmtSO1HPCmNaA1nzUj9Z91n7OmtaBy5vUkNRyzJvWedZ61nzWfdR0wpnWgNRy1nnWitRz1n7LnNaJ1nrOm9Ry14HXftZ7zZzCmdRy1orWedV014DWes2c1orLndZ4137Vc9aL1HHXf86b1nnXgdZ5zpzNnNd51XLXgMud14rOnMKa1njOnNVz1XHVc9aO13nMnteB1o3Xi9WR1ZLVcdWT14rWj9aN1ZHVcdd4zZ3WjteM1nPOndZ0zJ7YgMKb1ZPWkNiB1ZHXi9aQ1ZPXic2ezJ7Cm82e147XjNeI1o/WdNeN1nPVk9iB1ZXVlNWT1ZTWkteL1pDOntSV2IrYgtd014/BnNeO1nPVlM6e2ILYiNWU1pPXjtSW14/PnteQ14/BnNSX14/VltaT2IzXjtiH1pTPntaT1pTWktiJ14/YjNaV1ZfPn9aU2YjBndeP15PXktiP2XvVmNiO13HQn7mJ2JDXcddy2YrWlLmJ15LZibmK1pbZiNiM2I/Xcdl6wZ7XkdWY2I25iNhz15PZe9mJ15LYjtiR2I/Qn7mL13HYkNiR2JDXktCf2JDZjcGe2YrVmdhz2HO5iNmK15PWl9hx2Yu5jNiR2oHZjNl72XrYctmN2oDYctqC2HPRoNaX1ZrZj7iIuYzBn9p72n/YkNiR2JHYctqD0aDZdLiJ2oK5jdp/1pjVmtqAv57aftlz1pnSoLiJ1pnae8CguY24itp+wJ/ae7+e2XS/n9lz24LWmbiKwKDbgNuA24HSoNaav5+4jLiLuI3ZdL6euI3AoNlz0GG/n9t723y9nNKh0mK9ndp0vp7SYriOvJzRYdFh0mK8m7iPvp7QYLiN23u8m7ub02LTobuau5m4kNNi23zTY7iOu5nQYNdovZ7WaLiOupnWZ7iRuJLUY7iRt423jNRj1GO6l9t7upi4k9Bf06HXadWf12jWZrqYuZfYadx712i4k9Rj2Gu3jNWf2Grce9Zl1mbVY7eL2WvQXrmW1aDTotx+2WvYaNWf12e4lNBe1WTVZNlsuZa2i9x712fcetlruJXVodx72WzcfdSi1aC4ltBd3H7ceraL2mzdfdBd1KPVotWh2mzQXN1/tozdfdSj1qHVoraN2mvdfNBc0Fvdf918to3UpNai1aPde7WO0FvQW9Bb3XzQW9583n/aatSltY/ee9561qPQWtaj0FrefNBatZDefN563n/batWl22vbbNxs0Fncbdxu3nq1kN583G3efNWm3nrefttq0Fncbt9+tZHffd1w33zfetWntZLffN1u3XDQWN53tJLdbt9333rdb99433vfdtWntJPdbt920Vffd95v33fWp9950Ve0lN974Hnge95vtJXWqdFW4Hzged5vtJbWqdFV327geeB9tJbWqtaq32+0l9Wr4XjRVOF9s5jfbrOY1qvhfeF40VOzmeBv4X3heLOa1qzRU+Bu1q3hd+Bv4XTifeBt1a3fa+F0s5vga+F14GzfauJ34G3VrtJSs5zifeBt4nbhbuF01a+znOBq4nXRUdWvs53gaeJ043yzntFQ1bDUseJ01LHRUNFQs53jfOJ0sp3RT+Fp1LKyneN80U/jdOFp1bLSTrGd5Hvjc9Wz4WjSTtRPsZ7TTuNz1E/haOR7007VT9S11LTUT9Wz007iaNVQ07Xkc7Ge3Kzcq9S11rTle9W12bCxn9ZP11HiZ9O23K3kc9ZP1rTYUbCf2FHZseJn5XvZUtuu11DWtdW12rDdrLGg3K3XT9a126/Tt+Ru5HDkb+Vy4mfkb+V65G3aUuRt5Gzdrdmy5HDbr9S32lKwoOVz2rHldNpS5GvjZuZ65GvZs9yv1bflcNtS5XPdruRq5Grkadm05W/bU+No5GjjZ+V01rfmerCh27HUuOVv3LDcU92v1rfYtda33a7lbuZ02bTYteZ62LXdrtyw2LXYtdW42bTdsNxT1bnertuy2bXdr+Z12bXmea+h5W3dsNi23VPdsNa417jlbdi227PlbN6v2Levot1T3bHXuOd55WvmdN6w3rDbtOd43q/fr9a65WvYuN6w2LfYuN1S3bGvo9i427XesOd05mvnd9u13lLdst6wr6TesOdz36/attq32rffsOZr2rffr96y37Dod+h253Ouo+Cv3lLauOh137Hmat6y6Hbmaq6j6Hfgr+hy31Hmad5R6HXfsuh252ito9u46HLfsuCw6XfpeOdo6HTfUOCyraPnaOhx6Xjpc+Gx31DnZ+l34LKso+dm6XHhsel452bpc99P6Xeso+Cz4rHfT+lx6nfnZep427rpc+ly4LTqeKyj6njiselx4E/qeNy74VHhUOBP4VDqd+C06nzoZOpy4bTgTquj6nHqfOKx6nLcu+p44VDqd9y76nDhT+G0qp/oZOpx63iqn6qe63uro6me4U7rfOOx4E7rd+t6qqCpnet44rXhT+px63nqcamc63vhTqqj63upoOhj3byom6ia63jjsut6qZ3re+K1qJuonOJO47Preet663nhTaqjqJrevKmh7Hrseuli47TpY+K23ryomex5qJqppOx6p5njtOJNqaHseeK347XpYamkp5niTOO26WGooaeY372nmOO3qaTqYONMppjktqii6mCopOO57Xjfvu1440ummKil5LfteO136mCno+pg4L7teKimpZfqX6ekp6TkuKil7XbjSqel47rqXqekqKall+535LmnpO5247rkuqek617udqej47zudqem5Emll6SWpqPrXaSWpqKnpeHA5Enudu52pI+moqSQpI+klaSR5Lykjqal612jjaON4cHlSeS773WjkaSVo4ylouW773brXKOLpqXhwe91o5CjiqOV5UnvdaOK5knsXOZK5byjiaWipaWjkOZK7FujlaKI5L/mSexb8HWiiKKQpabwdexapKKjlKKHpKKjauLD7FmjbOdJopCja/B1pKLkv6Nro23mvaNpooeilPB15b6jbqWnpKOkouxYo2mihqSk5r6ibqNqopCik/B0573kwfB07FihhaSn50ijaKNp7FekpOTBo6Oij+hJ576ibqNo6EnsVqKT8HTsVqSkom3mRaOj8XShhePE7FWjpOhK5r6kp+xVo2ejo6GT8XLxcutR6UrxdKGPomyjZ+tQ8XPqT+tQ7FTmRaGEo2bxcupO48WjpOTDpKjsU+pN6k7sUutRomzpSqGPo6Shk6Ol6kyiZaCE5kTxcqOl48bnRaJspKjxdOlK6kuhbPFxomShj+hF5MXqSvFy8XPlxKCD8XSjqaGSoWvnQ6Jk8XLyc7E6o6aiY6CPo6rycuXFprSmtPJzoWqgguPH5MaipqJi8nGwO+lGo6rycqCSomKgj7E5prXycqW0oWrjyJ+CoqegkuXFprajqvJwomGwOrE5oJLycaa350KfjqKnomDoQ+lE6ELfzehCpbPyceTIn5KfgebGoGmwOeHMn5GiqKFg4M3kyKKqn47zcOhC4cyhX6KqpbfgzqBppLSfgeTKpbifkqKpoqmhXp+OprqhXqBp5MqfkaGqnoDgzqS05MuluZ6P48yhXaW5prvlyp9pno+egJ6RoVyekJ6Ro7SekJ5/npKek59pnpHhz56TpbyfaJ5/npDkzJ6UoFylvJ6SnpWiteXNn2Selp1+n2eelp6Xn2afZZ6Vn2ajuZ9jnZKgXJ19npekvKK2o7mdfaK3n2Oit+LQnZigW6K2nZikvZ2Tn2KjuaXAn2L0Y6XBn1z0Y6S9nH2dmaTA9GOeYZ2UnHyiuqXC9GKdmePRnl6eYJ9cnl+eXaTAnl+eXZx8nZqclPRi9GOjvpx7orukwp2bo7+cm5xw9muclfVinHqccJxx9mqcbpxunG+cbZxr9WGcbJx5nJz2aZxrpML1YpxxnJX2avZpobyccpt1m3acapycm3mcc/Zp9mn2afVhm3ShvJt1m3j1YJtzm5acnPZpnGmhvfZom3abl5t39mGbl/ZonGibnfZgob7m05uYm2j2YJueob+bn5uZm5/n1Jtom6Dn05qam2eboe7KmprvyJqbmqKaZ+7MmpyanZqc8MmanZqimp6aZ5qf6tSao5qjmZ+aZpqknbuZn+7PmWbwy5mk7NO03528maCZZZy6s9+Zpe3TmaGZoJy8mWWZoZmm8cyZopu6mWScvZmm8cyYopy9m7qYZJlgmKPv0plgmWGYp5lgmV+YYZlemGOYpJhimV6ZXZu+sOCYqZhimKju1ZipmKmYp5mxmbGYqZmy8s2YpZiombKYXZq6mbCZs/DSma+Yp5iu8s7u1piul6WYrpmzmKeYrZismKzyz5emmbOYrJq+mrqXp+/Xm8Ku4ZvCl6eYXJer88+bwZq/l6j2P5iyl6f2QPPQmLT2PpvCmsCXqPLSl1yYsZeomLGZu5ixl6vx1Zep90GYs5epl7KawpnAl7Gq4JaqlqqXXPdBmLuawvLW+k+XsJdal7Py1Zasl7KXWvhC+k+XsZdal1uWq5exl7GZwJi7+k6Yv5dZlqzz1PhDl7OXWJaxllf6TpjA+k2Yv/lD9z35RJaz89eYwZZX9NT5Rf1mlaz4PvlF+0z9ZvPXlrOXu6Xg+079Z6bh+kb5P/tN+0z7S5ZWpuGWs/XU+kaWu/5ml8D01/tMlaz+Z5ZW+0j7SJfA+kX6QaTg/meWupWs+0uVs/pC+0z+aKPglbP7Sv5mlVWXwP5n+0mWwPpD+0b7R/5n/EyWuvpD+kH8S5VU/mj7RPtFlKuVs6De+0f8S5VU/2iVuvtFlsH7RvxKlKuUs/fVlsKVU/xFlboAaZOsAGiVU5Sz+NQAaZXB/UqUuvjVlcGUUvxFk6yTs5S5lLqf4P1GlLr9SJS/nNuUUv1K/Uf9SJOs/UeTs5S/k7qUUf5Kk7SUvZzdkqyb25O7/kiTUZO1k7qTvf5Jmtr+Sf5Kk7mTvPrWk7mSspKskrec4JKxkraSuJK2k1CSspKxmt2SuJK3kaySsfvXk1CSuZGtkrn24pGyka2RsZJQkbH815K5mN6QrZGyklCRuvzYkbGST5jekK2RtZG2kLL92JCxkK2RUJC4+eOQtpC0kLmQrpCzkLeRT5C4kLWQtJC3kLT+2pC4k9SPrpFPj7P/2ZPVkLn+25C5/OKQUJLUluKPro+0j7SQT4+1kdCR0o6ujraPUJDQAdwB3Y62AOGQ046tj0+Oq5DRkNOOrI63j9GOuI2rj0+OuI64AuCPzpDdj9GQ2o7OjaoC4I7PjtCNuo25jbsD345PjauNu47NBN+NzY24jk6NuY28jLiMq47ajLmNTo3NBdwG2YyrjLmNT43VjLwG2QbejdmM1Iy3jU+Mt4u5i72Luo3iBt6LrAfZjU+Lt4xTjU+MUoxQjFCLuIu2jFMH2YzWB92MUYu7i7WLt4vRi82L0IxUi72Lu4u2jFWLuIusi7aLtYu+i+GKtoxVjFWLzIqtiriKvoq1irSLVoqti+CKtYqzCdWKuItWir+KzIrgis+KtotXirkJ3Andiq6KzIrAi1iKtIm8icCJv4nMi1iJ3grUicCJv4m0ia6JtYm9iN0L4YpZic6KWonPicCIz4pbib6I3IjPibWIzgzfibQL3YpciNAM3gziibqKXAziia6H3IpdiL6IzIpfil+KXoi/iMCIz4pgiLaIv4fSiK6ItYfTiW+Iu4lwiWGJbofOh88N2ofUh8yH0YfPhtqJcYlhiLuIrolziW6Hzw3ZiXSJcoliDdOHz4e8iXUO24ltiXOJc4ljDtqIrobQiXaGzobTiW2HtIlkh7SHr4eyh72IZYhsh7GId4e+h7GF0oevhtCId4hsiHeHs4eyDtOF0IbNiGuIZYhqhr6IeIe0hc+HtIeviGoOz4a7hriHsIhpiGaGt4hniGmIeYTShNiIaA/ShrqGvg/QhrSGt4a8h3qFvoPXD9OEyw/RhreGtITTh3qFuYW4hbeHe4W0ENOFvRDQh3uDy4aEhbSGg4Z8EdGGgoaBhoWFtIPLhnyGgYaAg8oR0YZ9hoWEtIZ/hL2CyYaGEtSGfoZ+EtKGhoS0hoYT0oO9Dp8T0Q6fEtAOn4S0E9KFhg+fFNaDvQ+fD58Z4xTVg7SByBTTgcqFhhTRg7SByYHIhYaByBXUgccPng+egr2AyoSGD54V1IK0grx/zBCeEJ5+0RCeftEQnhCef82BuhfVfdMW1H7Nfs6CtH/Hfs8QnRfUhIYQnoG6HeJ90hfWf8Z90hCdEJ2DhhCdEZ2BuoGzEZ0RnXzTg4ce4RjVEZ19zH7HEZ2Aun3Ng4gRnYC5EZ0Rm37GgbN+xRGcfsR70RGcEZwRmhGbEZx8zhGcIOKDiHzPfccRmoCzfM1/wIC4fcgRm37Ff78RnHzLfM5/uH+/gLYSnH3KfsKAsxKbf74SnHXcf7d9yIKIfcMSm3vNEpt/thvVddt+vX+yfMmCiHvMfMl9xX+1fcN/soGIfMd+vXzEfMZ8w361dNqBiH+ye8p9vX60gYh+shzUfrN6yXnMfL2BiHHdc9p+sSficN5+s3nMecuAiH6xecly2R3TfL19s32xeclw3ICIHtJw23jJfbJw2oCHfLNv2x/SfLJ/h3q9fLMf0nyyLeF6vXyyaN9/hy3hLuF7s3uyfoYv4Xm9e7No33u0e7F+hnm8L+F5vHuxebp6tHm5foYx4XuwL995uCHQerR5uH2HMN804jPherR5tlvjMuB5tSLPebc34n2Heq95tnm2ebQ14XqvIcw54n2HN+Fa4iHMea824DrhIsx5rmPcfIciy0PjWuA/4nmuOuAiy0XiROIiyiPMR+JQ4nmtfIdJ4nmsWuA64CPMeax5q3mqe4c/4TzfT+FJ4Xipe4Zi2STKUOBB4HipUuBK4EngTOB7hiTKYtl4qFrceoZ4qEzfeoYlyUbfeoZ3p1vbJcdF3iXIJcdb23eneYZP3SXIJcYlx1Pcd6db2kLceYZD3U/dUdxb2SbHS90mxkLcQ9x2p2HVeYdS3CbGS9xc2ETcJscnx0LbdqZ4hyfGRdt2pSbFeIhg1SfGP9pL23iISdtI2nWlJ8Z4iUPaT9o+2T/ZJ8RE2kfad4lN2nWkKMUoxT7YJ8R1oyfEd4lM2VHZPtdQ2XWiJ8MoxCjEKMVN2XWid4onwk7YUdgowlDYR9g91lHXKcR2i0rYdotH2HShKMNL2HaMTNdH1ynDKMF2jSnDPNV0oHSgKMB2jii/dJ9O1k3WdY50nCi+dY5S1XWPdJ10m3Sbc59O1XWPdJp0mUjWKL1znjzTdJgnvVLUdY9znXSYTtVS1HSXdJB0lii7SdRT03SWdJAounSQdJBzlXSTKLpI1D7RdJF0k1HTdJF0knOVc5QnuXOUUNI+0Ci4SNJU0Ci3QNBJ0Si2VM9J0VXPKLVCzym1KbVXzFjMV8wptFjLSc8ps0TORc5YyimzSM1HzSqyWMlHzCqxV8hIyyqxVsgqsFfHSMtQMU4xWMdYx0bKWsVZxlEyTjFQMiuwUTJaxE0yWMZGySuwWsRIyVbGLLBQMyyvR8lUxk0zU8dTx1Y2WcNNM0wzR8hNM1LHVTUsr1c2TTRMM1LGU8ZTxlU2UMdPNFnDWsJMNFjDVMVawlLFTDRZwlPFVsRQxk41LK5PNUs1UcVONU81WMItrlXDUcVLNVDFVsMtrVDFLaxPxEo2VcJPNy2sT8RRwy2rVMFVwU7DVcFOw1TBUsIurU84LaourFLBTzlKOFTBVcBSwVPBTsIuq1PBL6xTwVPAUsEuqS+sVMBQOlPASjlNwi6qLqlQO0o6L6ovrFLAU79QO1HAL6tROy6oUb8vqS6nLqdRPC+oUb8upy+pMKpQvy+nUr5RPS+oUb5Qvy6mL6gwqVK+SjxRvi+oT74vqDCpUD0vplG9MKlPvi+lMKdLPS+lSj1OvUo9MKgwpjCmMKUxp1BATbxLPzCkUUAwpTGnTbswpEs/MaUwozGmTrtOuzGkTrpLQFFCTEFNuk26UkIwoktBMaNNulJDMqVMukxBTLpMujGjTbkypTGiUkRMQku5MaIypEtCTLlRREu5MaEypDGiZ3VndGd0Z3NndlNFUUVLQzGhMqNSRVNGZ3cyoWZyTENLuGd4S0RRRTOjMqBmcUq3TERTR1JGMqBLtzKhZnhKtzKgZnFKt1dJSbdLRFZJVklKt2ZwSrdVSVdKZngzolNISrZVSEm2SbZXS2VwY2RUSGJgY2NLRWNlZW9meGNhZGZXS2NjSrZUSGJgZGdjZmNiSrZlbjOiZGhiX0m2U0hkaWJgZGlJtWVuV0xKtUq1SbVLRmRqZG1hX1lPZGtleVlONKFZTkq1ZG1kbFpQSbVXTWFfWlBLR0q0ZXlKtFhOWlE0oGFfWE5JtFtSSrRXTlpSW1NcVGV6XFRgX0xIV05cVUqzXFU0oF1XZHpgXlxWV05dWFdPTElKs19eXVhXTzWfZHtdWUtJX15WTzWeSrJke19dXVpWT0qxS0peXTWeNZ01nV5cNZxdW11cY3tJsUmxNZ1LS0mwTEs1nGN7PKk7qDypO6c7qDyoTEw9qkiwSK87pmJ7Pao1m0evTExiezulR64+qTaaP6pHrkxNO6VifEeuQKpAqj+pO6Q7pDukNppMTkGrYXw7pECqRq0/qTqjQapAqUKqTE9AqTaZQKlhfEKrRqxAqTqiQKlNT0OqN5lhfDqhRqtEqk1QN5lEqkOqYHxDqTqgRKpNUTqfN5lGqmB8RKlgfDeZTVI6n0apYH1FqTiYTVJGqTueX344mEWoTVNffkaoO504l0WnTVRGpzucX35Fpk1UOZc7nE1VRaZHpl5+OZdFpTubTVZHpkimXn9IpkimSKU6l0imRaVJpTyaSKVdfkmlSKVJpUilTVdHpTqWRqRdfl1+XX88mkakR6RJpE1XSaQ8mjuWXX9Go0ejRqNNWEijSKM9mVx/XII7llyBPZlNWUCdSKNAnj2aP507lkiiQJ5cgFyCPJZBnk1aXH8/nFyDSaI+mkiiPJZbhFuFXIA/nFuFQZ4+mk1aPJZFoESgRaBCnkWgRJ8/mkmhP5tbhUihW4ZGoEKeTVtEn0WgRqBDn0WgRZ9En1qHRqBHoD2WRJ9EnkKdRJ9Fn01cR6BCnFqHRp89lkafSJ9In0efTl1Bm0afSJ9ah0KbR54+lU5dSZ9HnlmIQZpBmkeeSJ5BmkmeQZo+lU5eQZlZiEGZQZlKnkmeSJ0+lE5fQZhKnVmIUZpBmFGZSJ1RmkqdSp1JnUGYTmBBmE2cTptRmT+UUJpJnE6bTptLnE2cUJpOm0+aWIhBl0mcTZtMnEGWUJlMnEucTppMnEGXWIhOYE+aP5NBlkqcSZxJnEicUJlKnEubTJtBlkGWT5o/k05hT5lXiEGWTppBlkGWTJtOmkGWTZpClk6ZQpZAk05iTJpXiE6ZTZlXiEKWQJNLmkyaS5pLmkiaTJlClkiaTZlJmkOWTmNCllaJTJlLmUmaS5lImUOWQJNWik2ZVopNmEOWSZlLmVSPVolWi0OWQ5ZUj05kSJlBkkqZSZlElkmZVYtUjkSWQZJOZFSPVYxBkkSWVI1Uj1SOVI5BklSNQpJOZUSVVYxUjUGSVI5BklOOVI5Tj0KSRJVCkk5mU45TjlOPRZVFlUKRRZRNZlKPRZRCkU1mRJNSj0KQTWdSjkSTTWdEkkOQUo5EkkxoQ49Dj1GOTGhEkVGPRJFDj0toRJBQj0OORJBDjktpTpFEkFCOQ45PkE+PRI9LaU+PUI5NkU2RTpBDjUOOTpBNkUSPT45LaUONQ45DjU6QTZBKakyQRI1Ejk2QTY9KakyQRI1NkEprRY5MkE2PRI1Nj0prS49LkESMTY5FjUuPRIxNjkSMSo9JbE2NRItJbEWNSo9FjEyNRoxJbUaMRYtFi02NTYxKjkWLR41Fi0aMTYxJbkaMR41IjUaMRYtIjUqNSI1Gi0luR4xKjUiNR4xKjUeMR4tGiklvR4tIjEaLRotIjEmMRopJjElvSYxIi0iLRopHikeKSItIcEeKSHFIikhySIpIckmJSHNJiEh0R3RJiEmHRndHdUd2RnZJh0Z3RnhGeUmGRnpJhUmFRnpGfEmERn5GfUZ9R3tIg0eBRn5Ig0d8SINHf0d7R4BIgkeBSIJHfEiBR3w=';
    var COAST_L = 'XHpcelx6W3lcelt5XXpbeV16Wnldelp5Wnpeell6Xnpeel57WXpee158WXpefF59WXtefV59Xn5Ye15+WHtef11/WHtdf1h8XYBdgFd8XYBXfF2BV31dgVd9XYJWfVyCVn1cgld1WHNXdllzWHNXdVZ2WXNYdFd1XINWflZ2WXJYdFd0Vndacld0VndaclZ4WnJcg1V4Vn5aclV4W3FVeVyEW3FVflV5W3FchFV5XHFVflV6W4RccFR6W4RVf1R6XHBbhVR7VX9ccFuFVHtUf1qFW29Ue1qGW29Uf1N8WoZbblSAU3xahltuU3xUgFqHW25TfFOAWodSfVttU4BSfVqIW21TgVJ9Wm1aiFOBUn1abFqIUoFRflpsWolSgVF+WmtaiVF+UoJaa1qKUX9SglprWYpQf1GCWmpZi1B/UYJZalpqWYtQf1ppUYNaaVCAWYtbaVGDW2lPgFtpWYxQg1toT4BcaFmMUINcaE+AXGhZjVCET4BdZ11nWY1PhF1nToBdZ15nXmdeZ1mOT4RfZ06AX2dZjk+EToBfZlmPTYBPhV9mWY9NgE6FX2ZNgFmQToVfZUyAWZBOhV9lTIBZkE6GX2RMgE6GWZFfZE2GS4BZkU2HX2RLgFmSTYdgY0uATYhZkmBjTYhLgFmTTYlgYkqAWZNNiUqAYGJNilmUSoBgYU2KWZRJgGBhTYpZlEmBYGFMi0mBWZVgYEmBTItZlWFgSIJMi1mWYWBIgkyMYV9ZlkiCS4xhX1mXSINLjEiDWZdhXkuNR4NZl2FeR4RLjViYYl5HhEuNWJhiXUeESo5YmWJdYl1HhWNdSo5YmWNdRoVjXViZSo5kXUaFZF1YmkqPRoZkXWRcV5pKj0aGZVxKj2VcV5pFhmVcSZBXm2ZcRYdJkGZcRmpHakdqR2lHaUdoR2hGa0doV5tFh0hnSGdGa0hnSZFIZkhmZlxGa0hlSGVFh1ecRWxJkUllSWRFbElkZ1xFbEljVpxFiEmSSWNFbEljZ1tKYkVtVpxJkkSISmJEbUpiRG1KYWdbSZJWnUSISmFEbkpgRG5KYEmTZ1tWnUSJQ25LYEtfQ29Jk0tfVp1nWkSJQ29LXkteSZRDb1WeTF5nWkSJQnBMXUmUTF1CcFWeTF1oWkOJQnBMXEmVVZ5MXEJwaFlDik1bSZVBcU1bVZ5BcUFxaFlNW0OKQXJJlkFyQXNBc01aQXNUn0F0QHRNWmhZQHVDikmWQHVNWkB1VJ9Adk5ZQHZoWEKKQHdOWUiWQHdOWVSfQHdOWEB4aVhCi09YP3hIl1SgT1g/eU9XaVg/eUKLSJdPV1SgP3lPVz96aVdCi1BWSJc/elOgUFY/e2lXUFZToUGLP3tImFBVU6FpVj57UVVBjD58UqFRVUiYaVY+fFFUUqFBjD59UVRpVUeYUqE+fVFUQYxSUz59aVVSoUeZenV6dXp1enZ6dHp2UlM+fnp0end5c3p3eXN6eHp4enl6eUCMaVV6eXlyUlM9fnp6enpRokeZenJSUnpyaVR6e0CNPX56cVGiUlJHmnpxe3toVD1/enBAjVNSUaJ6cHt7R5poU1NRem89f0CNR5p7fHpvUaNTUWhTem88f0ebe3w/jlNRem5Ro2hSR5t6bnt8PH9TUD+Oem1oUlCjR5x8fVRQem08gEecP456bGhSfH1UT1Ckemw8gEedfH1oUVRPP45QpHpsR507gFRPfH5oUT6Pe2tHnVCkVE58fjuAaFB7a0eePo9VTk+lfX47gVVOaFBHnntqVU19fz6PT6VVTTuBR59oT3tqVk19f1ZNPpBHn0+lOoF7amhPVk19f0+lVkxHoD6Qe2k6gVdMaE9+gE6lV0x7aUegTqY9kFdMOoJoTn5/V0tOpnxoR6BYSz2QaE46gn5/TaZYS3xoTaZYS0ehZ01+fzmCPZF8aFlKTaZZSn9/R6FnTTmCPZFMpnxnWUpMpn9/WUpHojmDZ0x8ZzyRWkpMpn9+Wkl8ZziDZ0xGokumPJJaSYB+fWY4g1pJZ0tGokunPJJbSYB+fWY4g2dLRqNbSDySS6c4hH1lgH5bSGdLRqM4hFtIO5NLp31lgH5cSDiFZ0pGozuTXEdLqIF+fWU3hWdKXEdGpDuTgX03hUqofmVcR2dJN4Y7lIF9RaRKqF1HfmQ3hmdJgn07lEWkXUZKqDeHfmSCfWdIXUY6lEWlN4dKqV1GfmRnSDaHgn06lUWlXkVJqTaIf2RnSIJ9OpVeRUSlNohJqX9kZ0deRTqVg302iESmSapeRGdHf2M2iTqVg31Epl5ESao2iWdGOZaAY4N9X0REpjWKSKpnRjmWX0OAY4R9NYpEp4BiSKtfQ2dFOZaAYjWKhH5Ep19DSKuAYmdFOZc1ioBhhH5gQ0OnSKyAYWdEOJdgQjSLhX6AYEOoSKxnRGBCOJeAYDSLhX5DqIBfSKxgQmdEOJiAXzSLhX5gQUOpSK2AX2dDOJg0jGFBgF6GfkOpSK1nQziYgF5hQTOMYUFhQWJBgF1iQYZ+SK5DqmJBZ0JjQTeZY0EzjIBdY0FkQWRBSK6GfkOqgFxkQWdCY7Q3mWVBhn8zjGVBhn+AXGVBZLSGgGZBY7RIr0OqZ0FmQTeZh4CBXGZBM42HgGdBZLVjtWdBh4GBW0ivQqtnQTeZh4EyjWS1gVtjtYeCh4JHsDaZQquBWmS1h4MyjWO2h4OBWkewZbU2moeDaUFCq2O2Mo2HhIFZaUFoQGW2h4RpQUewNppitoFZQqxqQYeFMo5oQGW2akCHhYFZYrdHsTWaakBoP0GsMY5mtmtAgViIhWg/YrdrQDWaR7FmtmtAQawxjoFYaD+IhWtAYrg1mma3R7JsQGc+MY5BrYFYbEBiuIiGZz5mt2xANJpHsjGPglhtQGK4Qa1nPomGZ7dtQDSaR7JnPTCPYbltQIJYQa1nuImGbkBnPTSaMI9huW5AR7OCWGe4iYZArmc9bkAzmjCQZ7hvQGG6g1hmPEeziYZArm9AM5owkGi4ZjxvQINYYrpHtIqGcEBArmY8aLkzmjCQg1hiuoqHZjtGtHBAaLlAry+RMppmO4RYcEBiu4qHRrRouS+RP68ymmU6hFhxQGm5YruLh0a1ZTovkT+vMppxP4RYabplOmK8i4dGtS+SMppxPz+wabplOYVXYrwukouHRrZxP2U5MZppuj+whVdlOWU5LpJivXI/ZjmLh2q6RrYxmmY5hVc/sGY5cj8ukmc5Yr1quzyujIdGtzGaZzmGVz6wZzlyPjyuLpNqu2c5Y708rjCbaDmMh4ZXRbc8r3M+PrFoOS6Tars8r2g5PK5jvoZXMJtpOYyHRbdzPjyva7xpOC2TPrE8r4dXaThjvjywMJtzPmo4jYdFuGu8LZQ+sWo4PLCHVzyvcz5jvy+bPbGNh0W4a7wtlIdXY789smo4O7B0PT2xL5tiv2u8LZSNh0W5h1c9smK/O7A9snQ9ajgvm2LAPbJsvYhYLZWOiEW5dD07sGLAPbJqN0W5LpuIWGy9YcAslXU9RLmOiDuxYcB1PUS5iFhqNy6bbL0slWHBRLl1PTuxjohhwYlYLptDuWy+LJZrNnY9YME7skO5j4iJWHY9LZtgwiyWbL5DuWs2O7J2PWDCiVhCuY+ILZsrlm2+YMI7s3Y8QrlrNYpXX8KPiEK5O7Mtm3c8K5dtv1/DQblrNTuzilcsm5CIdzxBuV/DK5dtv2s1O7Rfw2w1ildewyybXsM7tEG6kIgrl17Ddzxtv13DbDVdxF3EK5iKVju1XMRsNSybXMRBum7AXMR3O5CIK5hbxG00O7VbxIpWW8Qsm200K5laxEG7bsA7tVrEdzuRiFrEbTQrmYtWK5s7tm00QbtuwCqZdzpaxZGIO7ZuNItVK5sqmkG7bsFZxW40kYk7t3c6KpqLVSubbjQ7t1nFQbxuwSqbkYlvNHg6i1U8uCqbWcZvNHg6kolBvG/BPLhvNHg6i1RZxpKKPLhvwkG9cDR4OYtUPLlZxnAzkop5OW/CQb1wMzy5jFR5OVjHkopxM3k5PLpvwkG+jFRYx5KLcTN6OTy6jFRwwkG+cTN6OVjHPLqTi41UcMNxM3o5PLtBv1jIjVSTi3Izezlwwzy7jVVyM0G/WMh7OZOMccM8vHIzjlV7OUG/V8iTjD28ccNzM3w5jlVBwD29czJxw1fJk4x8OY5VQcA9vXMyfDlxxJSNQcGOVVfJdDI9vX05csRBwY9VlI10Mj2+V8p9OUHBj1VyxHQyPb59OZSNV8pBwnUyj1VyxH45Pb+UjnUyQsJXypBWfjlyxT2/lY51MkLDfjmQVlfLc8V2Mj3Afzl2MkLDlY6QVnYydjJzxXcyVst/OXcyQsQ9wJFWdzKVj3gzc8V/OXgzQsRWzJFWlY89wHgzfzl0xULEkVZWzJWPeTOAOT3BdMZCxZFWeTKAOZaQVsw9wULFdMaSVnkygDmWkELGVs16Mj3CdMaSV4E5lpBDxnoygTmSV3XGVs09woQ8lpF6MoQ8Q8aBOXXGhDuEPJNWVs49w3sylpFDx4I5gzt1x4M6ezKFPD3Dl5FWzoI5k1ZDx4M6ezJ1x4M6gjmFPJeSQ8g9w1XOgzmTVnwydseDOUPIhTyXkj3EfDJVz5NWdsdDyJeShTt8Mj3EVc+UVkPJdsiXk3wyhjs9xUPJVdCXk5RVd8h9MoY7PcVEylXQmJN9MT3Fd8iGO5RVRMo9xpiUfTFV0Ic7d8iUVUTLPcZ+MZiUhztV0XfJPcdEy5VVfjFU0ZiUPceHO0TLeMlU0ZVUfjE9x5mVRMyIO1TReMk+yH8xlVRT0UTMmZWIOz7IeMlT0n8xRM2WVD7JiDuZlVPSfzB4ykTNPslT0pZUiTqZlYAwUtI+ykXNecqWVIk6mZZS04AwPspFznnKUtOJOj7Kl1SAMJqWRc5R03nLPsuJOoAwl1SalkXPUdN5y1HTijqBMD7LRc+al5dUUNR6y4EwijpF0D7Ml1RQ1JqXgTB6y0XQijpQ1D7MmFSbl4IvUNRF0Is6esxP1JhUPsybl4IvT9RF0U/Uizp6zE7UTtRO1JhURtGCL03UPs2bmIs5TdR7zE3UTNRG0oMvmVRM1Iw5nJg9zUzUe81L1EvUgy9G0kvUmVSMOUrUnJg9zXvNgy9G05lUjDlK1YQvnJh7zT3ORtOaU405StWEL5yZe849zkbTmlONOYQvS9V7zp2ZPc+FLppTRtSNOUvWe8+dmYUumlKNOT3PRtRL1oUue8+dmZpSjjlG1TzPS9eFLnvQmlGOOJ2aRtU80EvXhi570JtRjjiemjzQhi5G1kvYe9CbUY84hi480UvYnppG1ptQe9GHLo84PdFL2EbWnpqHLptQe9E90o83S9lG15+ahy6bUHvSPdJL2Y83RteILp+bnE890nvSS9qILY83Rtifm5xPPdN700vaiC1G2I82nE+fmz3TiS1700vanE9L2kbZkDZL2qCciS091EranU971EraStqJLUbZkDWgnEnaPdSdT0nae9SKLUnaSNqdUEbaoJw91ZA1SNqKLUjae9SdUEfaRto91Ufaii2gnJA1R9qeUHvVRtqLLT3WRtqhnZ5QkDR71YstPdaeUKGdiy2QNHvWn1A91qGdiy2RM59Re9Y914wtoZ6fUZEze9eMLT3XoFGhnowtkTN71z3YoFGino0tkTOgUXvXPdiNLaKekjOgUXzYjS092KKfkjOhUo4tfNg92aFSkjOin44tfNmhUjzZpmSTM44tpmOjn6ZjpWKiUqZkfNmlYo8tkzM82qVio6ClYaJSpmSlYY8tkzOlYHzapWA82qZko6CiUqVfjy2lX5QzpV582qdlolKQLaVePNqjoKVelDOlXadlkC2jUqVdfNs826VcpKGlXJQyp2WQLaVbo1GlW6VbpVqlWnzbpVmlWaVYpVikoaVYO9uRLaVXp2ajUaRXlTKkVqRWe9ukVaRVpFWkoZEtqGakVKNQpFQ725UypFOkU3vcpFOkUpEtqGakUqSio1CjUaNRlTJ73Dvco1CSLaNQqGajUKSiljJ73ZItqGc73KSiki2WMnvdqWc73KWjky173alnljKlo5MtOt2pZ3velzKqiaWjky2paHveOt2qiZcyqoqULaWkqomqaHvfqoqXMjreqoilpJQtqmircKqKq3CriHvfq2+rcZgyq2+rb6poOt6riKtxpaWrbquLlC2rbnvgq3KrbauHmDKrbatpq3Kri6tspqWrbDreq4eULXvgrHKra6trmDKraauMrHOrh6trpqWraqxze+CrapUsOt+shquMq2mYMqxzpqashqx0e+GrjJUsOt+sdJkyrIampqx1q4164ayFrXWVLJkyOuCmpqyNrXWshXrirXathZYsmTKsjqanOuB64q2ErI6tdq1+liyaMa2Ep6d6461/OuGsjq1/rX6thK12liyaMa1/euOsj6enrYM64a6Arn6ug66ArnaXLHrjrI+aMaenrn2uga6COuGtj66BeuSXK652roKbMa59roGop62QOeKugnrklyuufa52mzGtkKineuU54q98mCutka92mzCop3rlr3w545grrZGvdpsweuapp698OeOpppgrrpGvdnrmnDCppq98qqaYKznkrpF65qqmsHuwdpwwqqWZKnnnOeSwe6qlrpGwdpwwqqV557B7mSqrpK+ROeSdMLB2rJ+rpKygeeiweqygq6SZKqyhr5KsnznlrKGro50vsXasobF6eeisoqyjmiqtn6yir5KsoznlnS+xerF2eeitn5oqr5KxejnmeemdL5oqsXatn5sqsXmwknnpOeabKp4vrp6xdnnqmyqyebCSrp4553nqni+bK7J2snmcK3jqrp6wkznnni6cK7J3eOuyeK6enCt467GTOOifLrJ4nSuyd6+eeOudK7GTs3h47K+eOOifLp0rs3ewl6myd+yxl54rs3ixlrGTr52xlrGVny446LGVnix37LN3sZWps7GUsZepsrN3sJ2xlJ4ssZN37Z8uOOmzd54sqbOzd3ftsJ2xl6qznyx37qAtOOm0d7Cdnyyqs7GXqrN27p8soC046rCddu6qtKAsspeqs3bvoC2xnaAtOOqqtKAtdu+yl6q0sZyhLTjrdu+qtLGcspd18Ku0dfA466q1dfCynHXws5ertKu1OOt08bKcdPGzl3Txq7SrtjjsdPKynLJZc/KyWrOXq7Vz8qu2s5yzWrJZOOxz8rNacvOzW7NYtJeznKy1q7azW3LzOO2zW3Lzs1i0XLObcvOrt7SXrLW0XLNYOO1x9LRdcfS0m7Rds1est3H0tJi0Xay1OO60XnD0s1e0mLSbtV5w9bVktWS1ZLVjtmW1Y7VitWKst7VhtWG0mLVhtWC1YLZltV+1X7NXtV6ttrZmOO62ZrSZtJu2ZnD1tmezVrWZtmesuLZotmittnD1OO+1mrSbtmmzVrdptZq3aay4cPa3arRVtZu3aq22OO+3a7drb/a3a7RVrLi3bLdsOO+ttm/2t220VbhtuG2tuW/3uG60VDjwuG6ut7hvuG9v97RUrbm4cLhwN/Cut2/3uHC4cbRUrbm5cW/4N/Gut7lytVRu+K26uXI38blyrrdu+bVUuXOuurlzbvk38a+4tVS6dK66bvm6dDfytlSvuG76unSuujfybfq2VK+4unW6a667umy6bG36um26bbp1um62VDfzum66bq+4um+6b7prunBt+7pwr7u6cbt1unG7cbdUNvO6a237sLm7dbdTr7u3U7tybfu6a6ksNvO7dqgssLmoK7dSqCuoK6gqr7xs/Kgqt1K7aqcpu3apLLtypyk29Kcpt1KnKLC5pyhs/Kcou2q8dq+8t1GpLLtyNvRs/bdRpyixurx3u2qqLLdQsLwr7SvtK+1s/SztvHIs7izuLO63ULx3Le6nKDb1Le8t77tpLe+qLLG6Lu8q7S7wLvC3T2z9L/CwvC/wL/G8d6coL/G8cjDxt0+7aSrtMPE29aosMPKxujDybP4x8rdPMfK8dzHyqCiwvSrtvGky87xyt06qLGv+MvM29bG6vXgy8yntt06oKDL0sL28aDP0a/6rLLdNvXIz9L14Ke2xuzX2M/SoKLdNM/W8aGv/sb2rLDT1Ke29eLdMvXI09bK7qSg09TX2vGi3TCjtt0yrLDT2t0uxvr15t0u3SrdKNfa3SrdJqSi3SbK8t0i9cjX2t0i2SCjtvWe2RzX2tkesLL55rC2sLbZGrC2tLrZGsb6tLq0utkatL7ZFqSitL7ZFKO2yvL1nvnK+ebG+qign7q4vsry9Z755tkS+cqooJ+6xv756vWa7WLK9ri+qKLZEu1i+cifusr+7V796vma8WKsosr27V64uJ+63RLtWv3KrKLK/vma8Wb96u1azvbtWJu6uLqsot0S/crtVvma8WbLAv3q7VbO+Ju6sKLtUry6+ZbxZv3O3Q7tUssCsKMB6Ju6zvrtTvmW9WbxTrCivLcBzssC3QyXvvFLAebO+v2W8UqwovVm8Uq8tJe+zwcBzuEOzv8B5rSi8Ub9kvVq8USXvs8GtKK8tv2W8ULS/wHPAebhDvlq8UCTvrSm/ZbAtvE+zwbS/vlrBc8F5vE+4Qq4pwGUk77AtvE6zwrxOvlq0wMBluUKuKcF5wXMk77xOsC28TcBms8K/Wq4puUMk8LxNtMDBebEtwXO8TMBmrykk8L9auUO8TLTCsS3BZrxLwni1wMJzrykk8bxLv1u5Q7TDv1rBZ79asS28S79ZJPGvKcJ4v1m1wLxKv1jCc7pDv1jBZ7TDvEq/WLItJPKwKb9Xv1e8ScJ4v1bBZ7pDtcG/VrxJwnO0wyTysi2/VbApv1W8SMJnv1W6Q79Uw3gk8rxIsi2wKb9UtcG0xMJzv1O8R8Jov1Ml87tDvEexKbMuw3i0xMJovEe2wcNzJfO/U7tDvEaxKbMuw3i0xbxGwmgl9LbCsSnDc7tDvEW/UrMtvEUl9LXFw3jDaLIpvEO8RLbCv1LDcyX1sy28RLXFsirEeLxEw2gl9cBStsLCYMRzsyyyKrXGJfXEeMNowmDAUcJhsiq0LLfCxHO1xiX2w2DEd8Row2GzKsBRtCwl9rfDtcfEc8NfsyrDYcRoxXcl98BRtCu1x8Nft8PFc7Mqw2El98RpwVG0K8V3w1+2x7Qqt8Mm+MVzxGHDXrQrwVDFabbItCrFdyb4xGG4xMVzxF64xLQqwVAm+LbIxWm4xcZ3xGK3xcRexnMm+bfFtsnBUMVpxGK3xsZ3xF23xib5xnO3x7bJwlDFYsRdxWm3x8Z3t8gm+rbJxnO3yMRdwk/FYsZpt8jHd7fJJvrEXLbKxWLCT8dzt8nGabfKx3fFXCb7xmK3ysJPx3PGacVbx3fGYyb7w07FW8dzx2nGY8h3syPCS8JMJvvCTMJMw03DTcNOw07FW8hzxmPHabQjwkvId7QjxVol/LQkx2PIc8dpxlrCSsh3tCMl/LQkx2PGWshzw0rIabUktCPJdyX9x2PGWbksw0q1JMlzx2TIabkstSPJdyX9xlnIZLkstSTDSrkryGXIaslzxlm6LLYkuSu1IiX+yXfIZcNJuSu6Lchlx1jJarYkyXO5KiX+xEm1Isl3yGa6LbYkx1jFqbkqyWbJasWoynPEScWouSm7LSX/tyS1IsWoxanKd8lmx1jFp8WnyWrJZ8RJynO7LcWqtyTGp7kpx1cl/7YiynfJZ8RJuy3Fqrclx1PKaslnynPHV8anx1S6KcdUtiLFqrstynfKaMVKuCXHVcdTx1fHVcpqxqfKc8pouinHVcWrvC24JcVKyFa2IcdTy3fIVsWrvC3KasanuCW6KctzymjFSsdStyHLd8asvC25JceouynLasZKy3LHUspoxqy9LrkltyHLd8ZKx6i7KchSxqzLastyvS7LaLkltyHGSsx3xq3IUceouym9LstqzHLLaMatx0u5JchRtyG+Lsx3vCnHqMxqxq7McsdLy2fIUbokvi64IMx3vCnIqcauzGrHS8xyyFDMZ8auvi66JLggvCnIqc13x0vMaslQzXLHr8xnvSm+LbokyEvIqbggzXfJUMZFx6/Ma8dGzXLHRshLx0fMZ70pzGe/Lcipx7DMaMlPuyTNaLkgx0fNac13x0XNac1qx0fNas1rx0jNcshLyEi9KclPyaq/LchJx7C7I7kfx0XOd8hJyEnJTM5yyErJT74pyarISr8tx0W7I7kfx7DJSs53yUzJS8pOznLJS74pyarJTMdEwC3JTLsjuR/IsM53yk7Ocr4pyarIRMAsyk68I7ofz3fIsL4pznLIRMqrwCzKTbwjuh/Pd8ixvynPcchEyqvKTcAsuh68Is93ybG/KchDyk3PcsqrwSy7Hrwiz3e/KctMybHIQ8qrz3LBLMtMux7AKNB3vSLJQ8urybHQcsEsy0zJQ8Aoux7Lq9B3vSHQcsqxyUPCLMtLux7AKMur0HfKQ70h0HLCLMqxy0u8HspEzKvBKNF3wizMS9FyvSG8HsqyxcPKRMEozKvFw8MszEq8HtF3ykTHvdFyxcS+IMxKwSnLssXDx73MScyrxcTDLMi8vR7LRMxJ0XfFxce9yLzMSNFywim+1r7Wvde+1r3XvtW9177Vvdi92L3YvNm+ILzZvNnLsrzavtTGw7zaxcXIvMxIu9u728tEzau/1L0ewyy/1L4g0nfMSMi7v9PFxr/TwinIvsxHvh/Ju8DT0nLLRcDSxca828xHvR7Lss2rwNK+H8m7xsPDLNJ4wNLMRsXGwNHJusIpvh7B0ci+zEXMRsHRybq8274e0nPNq8XHzEXELMuz0njGw8m6wynMRcq5wdHIvsXHvNvKuc2s0nPELNJ4zLPDKcbEyrnFyMHSyL+928q4zazELNN4xcjTc8q4wynMs8HSx8TLuL3byL/Fyc6ty7fTecUsxCnTc8HTzLPFycfEvdvJv9N5zq3FLMu4xCnB08XK03O+28y0x8TFLMnA03nOrcXKxCnLuMHT03PGLL7bxcvNtMnA1HTUesXLyMTFKc6uwdTFy8y4xczGLb7bxczUdMXN1HrFKcnAzbTC1M6uxc3IxcYtzLnFzdR0xM6/28+uxM7FKtR6wtXHLcnB1HXNtL3e0KbIxcy50KbFzs+tv9vRptGlvd7GKtR1xy3C1dGl1Hq93tGkysHFztGk0KfPrc21vt7RpMjFzLnRo7/b1XXHLdGjvd/GKsLWxc7RotV7vt3PrdKi0afKwdKh1XbSocguzrW938bOvt3A29KhzLrJxdCtwtbGKs601XvKwtGo1Xa/3cbNveDOtMgu0KzSoMDbysLNusLWzrS/3ccq1XbGzcnF1XvRqL3gzrPILtCsysO/3dKgz7PGzcDbzbrVd8LXxyrB2r3g0ajWe8+z0Ky/3cguwdrKw8nGwdrHzdZ3z7LB2dOgzbu658DcuufC17rmuubB2b3hu+a75ccq0ay75bvlz7LKxLvk0anJLrzkwtm85NZ8x8y847zjuue948LYveLWd8Dc0LLJxsLYzbvToL3h0au66MrEwtjQscfMyS7HKtKp1njWfLrovePRq8rEzbvIzNOgwNy56ckvysbWeNKpyCq+4tCxuenWfMrF0qvIzL3jzbzUoLnpyi/WeMHc0qrIKsrFysfSqrnq13y+4tCyzby95MjM13nKL9SfuerKxtKqwdzIKsrH13nOvdd9yi+5673ky8bUn9GyvuLKL8nMyi7JKtd613zB3couuevOvcotysfUn73kyi3LxsnM0bLXetd8vuLKLLnsySvOvcoswt3KLNWfveXXetd8yivLyM3BuezLxsnMySvRss6+v+PYe9h7wt3NwtWfue295c3CvuXOvsvIy8bKzM3CvuXYe9Gyue2/49WevuTC3b7kzr7Nw83Cv+S57cvIzMbKzL/k1p7Sss3Dv+PD3c6/ue7Nws3DzMfKzNaey8nSsrnuw93Pv8vJzcTOw9aey8zMx8vJue/NxNKzz7/D3cvKzsO579aezcXLzMvKzcfTs7nwz8DE3c7Dy8vNxdedzMvLzM3HufDOxtOzzsTXnc/AzMvE3c7GufHMzM3H153OxM7G0MDTs8TdufHOx9idufLPxdDB1LPF3bny2J258rnxz8W68dDBxd268dSzuvHYnLrwu/DPxbvwu+/QwcXd1LPYnMXdxt278M/G1LTG3dHBxtzZnMPixty78NS00cLH3MPiz8bH29mcxOLD49HCx9vUtbvxw+PH29HD2Z3I2tDGxOLD49W1yNq78cPk0cPI2tmdxOHVtcjaw+TQx9HEyNm78cPlydnZntW2xeHRxMPlydm78tDHw+bVttHF2p7F4cPmu/LJ2dHF1bfZpsPm0MfansXh2aXZpcLn0cXZpLvz1bfZpMLn2aban8nZxuHZpNHG0MjZo8Lo2aO789qj0cbC6NqfxuHVt9mm2qLK2tqi0MjRx7v02qHan8bhwunaodmn2qHWt9HH2qDK2rv00cjH4dqgwunRyNmnu/TWt9HIytrRycLpx+Hap9HJu/XWt8LqytvRycfhu/XaqMLq17fK27v22qjI4cPru/bXt8rcy9vaqMvby9vL2sPry9rI4czZzNnM2bv3zNjM2MzYzdfXt9qow+y7983XyOHbqcPs2LfN19PGvPjTx9xW08fN19XAyOLTyM4h26nD7M4h1cHTyNxWziG8+Ni3ziDO1tPJzyLUxtXBzyLTyc4gzyPcVtPJzyPVwtxVztbD7cnizh/PI9up1sHTyrz40CTTytXCzh/QJNi30CTSy87W1MbdVc4e0CXVwtLL0CXD7c4e0Sbbqt1WvPnVw9upz9bJ4tup3VXWwdyo1cPcqNm33KjUxs/V08vcp8Pu0SbJ4tXE3Ke8+d1U3Kbcps4e3VbVxNymz9Xcpcrh3aXWwdEm3VTD7tXF08vdpNm3vPrVxt2kz9XdpNXFyuHdo91Uzh3do91W0SbVxdDV3aLD77z63aLTy8rh3aLXwdm31cbdU9DU2bjSJsvh2bi8+92izh3eVtTL3VPQ1MPv2bjSJtm5y+HeotfB0dS8+88d2bnUy9m63qPL4d5W0ifeU9HUxO/Zurz7zx3Zu96j18LM4NHT1MvZu9Mn2bzepN5WvPzM4M8d3lPE79m80dTTJ9XL2bzepNfCzODZvc8d0dS8/N9W2b3TJ96k3lLE78zg1cvR1dAe2MLepdm91CfN4Lz931bR1d9SxfDepdXL0NnQHtm9zd/UJ9jC0NnYw9jD2MPeptjE18TXxdfF0dbXxdfGvP3XxtfH0tTXx9DZzd/Vy9Ae2r3fVtLT0NnF8NQo31LT09+m18fR1tPTzt/R2NDa09LXyNq80R68/tPU36bT0tbL1CjXyNHY09LS1uBWzt/F8N9S1NHQ2tbL2rzfp9fJ1NHR2NEe1SjWy9TR09TS17z+zt/XydTQ0dfQ29+n2rzWzNTQ4FbXysXw31LRHtXQ1SjP3tLX1szVz9+o0NvT1Lz+27zVz9bN18rP3tXP1SjSHt+o1c7gV9bN0NzG8OBS27zWzs/e09TWzrz/18nfqNYo0h7Q3Nu7z97fqeFXxvHgUt+p18nWKdTU36rSHtDd36rcu9De36vfq9+s2MnWKdYp1ynXKuFX1yrfrNDd1yvTH8bx0N7cu+BS1NTfrN+t363Yyd+u0N3frty70x/XK9+v36/hV9TU37DH8eFS37DYyd+w3LrfsdMf37HYK9+y0x/essfy1dTUH96z4lfZyd6z3brhUd6z1CDetN602CvUIN613rXkeNQg3rbH8t262cnV1N625Hjkd9Qh3rbiV+R45HfVId634VHYK9635XnldtUh3breuNnIx/Lled645XbVItXU4lbeueV64lLVIuV13rnYK+V63rrVIuV12cjle9Yjx/PldeJS4lble9Yj1tTldOV72SvWI+V02sjiUuV81iTjVuVzx/PlfNck5XPlfdbU2SvXJOJT5XPayOV91yXjVeVyx/TlfuJT5XLmftkr1tPayOVx41XXJeVxx/TjU+Z+5nDbyNos41XYJdfT5nDjU8f05nDmf9vI5m/aLONU2CXbyONU28jmb9fT5n/bycf15m7bydvK41TYJdos5m7bytrL5n/mbdfT2svH9drL2CXazNss5m3azOeA2s3Y09rNyPbZJtjT2s7mbdss2NPazueA2NLaztnS2s/nbNkmyPbZ0trP54DZ0dnQ2yzZ0dnQ52zZ0NkmyPfngdws52zaJueByPfna+eA6IDcLOiA6H/aJuh/6H7na+h+yPfofeh93Czofdom52vobsj46G7oasj46G7bJt0s6G/ofMj56G3ob8j56GrocMf56HDbJ90s6HHobcf66Gnoceh8x/roctsnx/vocuht6Gnpcsf73SzH++l83Cfoacf86GzG/N0s6XLG/eho3CfpbOl8xv3G/d4s3Cfpculr6WnpfNwnxv7pa94t6Wnpct0o6WvqfMb+3i3paepy51XdKOlq51XqfMb/51Xpad8t6FbdKOpq6nLoVuhV6FfoV+pp6nzfLd4o6mroV+hY6nLoVOhY3ijqaehZ3y3rfOlZ63LeKOhU4C3rfOlZ3ynrcuhU4C3fKet86Vnre+ty63vgLelU3ynre+x66lnseuEt63Lscuxy7HPseexz3ynsdOx07HXsdex26VTsdux57Hbsd+x37HjseOx54S3qWeAp6VThLeAp6lnhLepU4CrqWeIu4SrqVOEq61niLepU4SrrWeIt61TiKutZ4irjLetU4ivsWeIr61TjLeMr7FnjLOxU4y3jLOxZ7FTjLOQt7VnkLOxU5C3tWe1U7VntVe5Z7VXuWe5V7lnuVe9Z7lXvWe9V71nvVe9Z71XwWe9V8FnwVfBZ8FXxWfBV8VnxWfFU8lnxVPJY8VTyWPJU81jyVPNY8lTzWPNU81jzVPRY81T0WPRU9Fj0VPVX9FT1V/Zo9VP3aPVX92j1U/dn9lf3aPdn9VP3Z/ZX92j1U/dm+Gj2V/ZT+Gb2V/ho+Gb2UvZW91b4Zfhp9lL3Vfhl+Wn3VfdS+GXfAPdU+WnfAPlk91L3VOAA+WT3VPlp91LgAPdT+WT6aeAB+FP3UeEB+FL5ZPpp+FH4UuEB+mT4Uvpp4QH4UfhR4QH6ZPpp+FHiAfpk+2niAeIB+2T7aftk4wH7aftj4wH8afxj/GnjAfxj/GrkAPxj/WrkAP1j/Wr9Y/1q/WP+av1j/mr+Y/5q/2r+Y/5i/2r+Yv9i/2H/Yf9Z8QDyAPIB8gHyAvIC8gLzA/MD9Af1B/MD9Qj1CPUJ8wP1CfUH9gn2CvQE9gr2CvYL9Qb0BPcL9wv3DPQE9Qb3DPUE+Az1BfUG+Az1BfgN9QX4DfkN+Q35DfkO+g76DvoO+g77DvsO+w7+Fv4W/A7+Fv8W/A7/Ff8W/A7/Ff0O/Q79Dv4O/g7+Dv8O';
    /* Pontos de mar da janela local, testados um a um contra os poligonos de
     * terra do Natural Earth (ray-casting, com anel-dentro-de-anel contando
     * como lago). Antes o "oceano" era poeira uniforme sobre a esfera e caia
     * dentro de Sumatra, Borneo e da peninsula tanto quanto no mar — no globo
     * inteiro passa, no zoom denuncia. 80% da janela e' agua, o que bate com a
     * geografia da regiao. */
    var SBOX = [74, 152, -26, 32];   /* a janela da agua e' bem maior que a
                                       da costa: a vista deriva para leste */
    var SEA_L = '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';
    var LBOX = [88, 132, -14, 18];
    var SG_LON = 103.8198, SG_LAT = 1.3521;
    var D2R = Math.PI / 180;

    function unpack(b64, x0, x1, y0, y1) {
      var raw = atob(b64), out = [], i;
      for (i = 0; i + 1 < raw.length; i += 2)
        out.push([x0 + (raw.charCodeAt(i)     / 255) * (x1 - x0),
                  y0 + (raw.charCodeAt(i + 1) / 255) * (y1 - y0)]);
      return out;
    }
    var GL = null, LC = null, SL = null;
    function coastG() { return GL || (GL = unpack(COAST_G, -180, 180, -90, 90)); }
    function coastL() { return LC || (LC = unpack(COAST_L, LBOX[0], LBOX[1], LBOX[2], LBOX[3])); }
    function seaL()   { return SL || (SL = unpack(SEA_L,   SBOX[0], SBOX[1], SBOX[2], SBOX[3])); }

    /*  A costa e' o desenho; grade, marcador e oceano sao apoio. */
    var A_FR = 0.56, B_FR = 0.17, C_FR = 0.04;   /* D (oceano) = o que sobrar */
    function q(N, f) { return Math.round(N * f); }
    function rnd(s) { return (Math.random() - 0.5) * (s || 0); }

    var TILT = 20 * D2R, CT = Math.cos(TILT), ST = Math.sin(TILT);
    function proj(cfg) { cfg.ct = CT; cfg.st = ST; return cfg; }
    function projY(latDeg, rad) {
      var la = latDeg * D2R;
      return -(Math.sin(la) * CT - Math.cos(la) * ST) * rad;
    }
    /* x/y/z sao gravados com a rotacao zero: e' o que C.center mede e o que
     * serve de reserva se o motivo rodar sem C.spin. */
    function sph(out, lonDeg, latDeg, cfg, ink, r, a, spin) {
      var lon = (lonDeg - cfg.lon0) * D2R, lat = latDeg * D2R;
      var cl = Math.cos(lat), y0 = Math.sin(lat), z0 = cl * Math.cos(lon);
      out.push({ lon: lon, lat: lat, rad: cfg.rad, cx: cfg.cx, cy: cfg.cy,
                 ct: cfg.ct, st: cfg.st, spin: spin == null ? 1 : spin,
                 ink: ink, r: r, a: a,
                 x: cfg.cx + cl * Math.sin(lon) * cfg.rad,
                 y: cfg.cy - (y0 * CT - z0 * ST) * cfg.rad,
                 z: y0 * ST + z0 * CT });
    }
    function fit(out, N) {
      while (out.length < N) out.push({ x: 0, y: 0.5, z: -1, ink: 'faint', r: 0.9, a: 0.04 });
      out.length = N;
      return out;
    }
    function line(out, x1, y1, x2, y2, n, ink, r, a, jit, z, zs) {
      for (var i = 0; i < n; i++) {
        var t = n < 2 ? 0.5 : i / (n - 1);
        out.push({ x: x1 + (x2 - x1) * t + rnd(jit), y: y1 + (y2 - y1) * t + rnd(jit),
                   ink: ink, r: r, a: a, z: z + rnd(zs) });
      }
    }

    /* MALHA DA ESFERA — meridianos inteiros e paralelos inteiros, sempre. No
     * zoom eles simplesmente cruzam o quadro curvos, porque continuam sendo a
     * esfera; e' isso que separa "o mesmo globo mais perto" de "um mapa".
     * SEM PARALELOS. Tirar so' a latitude 0 nao resolvia: em projecao
     * ortografica TODO paralelo e' uma elipse tangente a horizontal nos
     * extremos, e nesses dois pontos a densidade se acumula — um caustico. O
     * de maior raio (o equador, e depois os de +-20) desenha a faixa
     * horizontal que atravessava o globo. Medindo, a faixa nem era mais densa
     * que a media (0.066 contra 0.088 pt/px2): o que a fazia LER como linha
     * era ser a unica coisa horizontal num desenho de curvas. So' meridianos,
     * entao, e mais deles para compensar. O que sobra de horizontal ali e'
     * costa de verdade — Sumatra, Java e Borneo estao sobre o equador. */
    var PAR = [];
    function grid(out, n, cfg, spin, ink, aBase, stepDeg) {
      var mer = Math.round(360 / stepDeg), i, k;
      var pars = [], la;
      for (la = -80; la <= 80; la += stepDeg) {
        if (!PAR.length || stepDeg >= 30) break;
        if (Math.abs(la) > 1) pars.push(la);
      }
      if (!pars.length) pars = PAR;
      var per = Math.max(2, Math.floor(n / (mer + pars.length)));
      var lim = out.length + n;
      for (i = 0; i < mer && out.length < lim; i++) {
        var lo = -180 + i * stepDeg;
        /* Cada meridiano termina numa latitude DIFERENTE (58 a 76). Com todos
         * parando em 70 as doze pontas caiam sobre o mesmo paralelo e
         * desenhavam dois arcos, um em cima e outro embaixo — uma linha que
         * ninguem pediu, feita so' de bordas. */
        var la0 = -58 - (i % 4) * 6, la1 = 58 + ((i + 2) % 4) * 6;
        for (k = 0; k < per && out.length < lim; k++)
          sph(out, lo, la0 + (la1 - la0) * k / (per - 1 || 1), cfg, ink, 0.95, aBase, spin);
      }
      for (i = 0; i < pars.length && out.length < lim; i++) {
        var pn = Math.max(4, Math.round(per * Math.max(0.25, Math.cos(pars[i] * D2R))));
        for (k = 0; k < pn && out.length < lim; k++)
          sph(out, -180 + 360 * k / pn, pars[i], cfg, ink, 0.95, aBase, spin);
      }
      while (out.length < lim) sph(out, rnd(360), rnd(140), cfg, ink, 0.9, aBase * 0.6, spin);
    }
    /* oceano: distribuido por AREA — a latitude sai de asin(uniforme), senao a
     * poeira se acumula nos polos e some no equador. Com `win` a poeira fica
     * numa janela em volta do alvo: no zoom, espalhar pela esfera inteira
     * jogava quase tudo fora do quadro e a nuvem visivel caia pela metade. */
    function sea(out, n, cfg, spin, aBase, win) {
      for (var i = 0; i < n; i++) {
        var lo, la;
        if (win) { lo = SG_LON + rnd(2 * win); la = SG_LAT + rnd(2 * win); }
        else     { lo = rnd(360); la = Math.asin(rnd(2)) / D2R; }
        sph(out, lo, la, cfg, 'faint', 0.85, aBase * (0.55 + Math.random() * 0.9), spin);
      }
    }
    /* Malha da esfera restrita a uma janela. As linhas continuam sendo
     * meridianos e paralelos de verdade — curvas, cruzando o quadro — mas so'
     * o trecho util e' emitido. A janela e' 50% mais larga que o campo visivel
     * para nenhuma linha terminar dentro do quadro e denunciar uma moldura.
     * Com 24 graus as linhas ainda paravam nos cantos de cima e de baixo e o
     * conjunto lia como um quadriculado recortado — mapa, nao esfera. */
    function gridWin(out, n, cfg, spin, ink, aBase, stepDeg, halfDeg) {
      var lim = out.length + n;
      var nl = Math.floor(2 * halfDeg / stepDeg) + 1;
      var per = Math.max(3, Math.floor(n / (2 * nl))), i, k;
      for (i = 0; i < nl && out.length < lim; i++) {
        var lo = SG_LON - halfDeg + i * stepDeg;
        for (k = 0; k < per && out.length < lim; k++)
          sph(out, lo, SG_LAT - halfDeg + 2 * halfDeg * k / (per - 1), cfg, ink, 0.95, aBase, spin);
      }
      for (i = 0; i < nl && out.length < lim; i++) {
        var la = SG_LAT - halfDeg + i * stepDeg;
        for (k = 0; k < per && out.length < lim; k++)
          sph(out, SG_LON - halfDeg + 2 * halfDeg * k / (per - 1), la, cfg, ink, 0.95, aBase, spin);
      }
      while (out.length < lim)
        sph(out, SG_LON + rnd(2 * halfDeg), SG_LAT + rnd(2 * halfDeg), cfg, ink, 0.9, aBase * 0.6, spin);
    }

    /* ── as tres esferas: MESMO eixo (lon0), so' o raio muda ───────────────── */
    var GLOBE = proj({ cx: 0, cy: 0.50, rad: 0.475, lon0: SG_LON });
    var ZOOM  = proj({ cx: 0, cy: 0, rad: 1.80, lon0: SG_LON });
    ZOOM.cy = 0.50 - projY(SG_LAT, ZOOM.rad);
    /* o globo do logotipo e' visto DE FRENTE: sem inclinacao (ct=1, st=0).
     * Raio 0.36 porque as letras sao 1.25x o raio e precisam caber em +-0.45. */
    var BACK  = { cx: 0, cy: 0.50, rad: 0.36, lon0: SG_LON, ct: 1, st: 0 };
    var KSPIN = 0.14;          /* giro do mundo ja' no fundo do zoom */

    function formGlobe(N) {
      var out = [], i;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;
      var cg = coastG(), st = cg.length / nA;
      for (i = 0; i < nA; i++) {
        var p = cg[Math.min(cg.length - 1, Math.floor(i * st))];
        sph(out, p[0] + rnd(0.06), p[1] + rnd(0.06), GLOBE, 'body', 1.45, 0.80, 1);
      }
      grid(out, nB, GLOBE, 1, 'band', 0.30, 30);
      for (i = 0; i < nC; i++)
        sph(out, SG_LON + rnd(1.6), SG_LAT + rnd(1.6), GLOBE, 'accent', 2.0, 0.95, 1);
      sea(out, nD, GLOBE, 1, 0.13, 0);
      return fit(out, N);
    }

    function formZoom(N) {
      var out = [], i;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;
      /* So' os ~45% mais proximos de Singapura migram para a costa fina (os
       * dois arrays estao ordenados por distancia a ela). O resto FICA onde
       * esta' e sai de cena pelo crescimento do raio, como numa camera: com
       * todos migrando, um ponto saindo do Brasil atravessava o lado oposto do
       * globo e passava a travessia inteira fora do quadro. */
      var cl = coastL(), cg = coastG();
      var agua = seaL();
      var mig = Math.round(nA * 0.45), sl = cl.length / mig, sg = cg.length / nA;
      for (i = 0; i < nA; i++) {
        if (i < mig) {
          var p = cl[Math.min(cl.length - 1, Math.floor(i * sl))];
          sph(out, p[0] + rnd(0.02), p[1] + rnd(0.02), ZOOM, 'body', 1.5, 0.80, KSPIN);
        } else if (i % 5 < 3) {
          /* tres em cada cinco viram mar em volta da area: sem isso mais da
           * metade da nuvem terminava fora do quadro e o fundo do zoom ficava
           * com 3.100 pontos visiveis de 7.600 */
          var w = agua[(i * 7919) % agua.length];
          sph(out, w[0], w[1], ZOOM, 'faint', 0.9, 0.16, KSPIN);
        } else {
          var g = cg[Math.min(cg.length - 1, Math.floor(i * sg))];
          sph(out, g[0], g[1], ZOOM, 'body', 1.1, 0.42, KSPIN);
        }
      }
      gridWin(out, nB, ZOOM, KSPIN, 'band', 0.20, 6, 38);
      for (i = 0; i < nC; i++)
        sph(out, SG_LON + rnd(0.40), SG_LAT + rnd(0.40), ZOOM, 'accent', 2.0, 0.95, KSPIN);
      /* janela 24 e nao 38: o campo visivel e' ~16 graus, entao espalhar o mar
       * por 38 deixava so' um sexto dele dentro do quadro e o oceano saia ralo
       * demais para preencher */
      /* mar do zoom: sorteado do conjunto de AGUA, nao espalhado a esmo */
      var lim2 = out.length + nD;
      while (out.length < lim2) {
        var wp = agua[(Math.random() * agua.length) | 0];
        sph(out, wp[0], wp[1], ZOOM, 'faint', 0.9, 0.20 * (0.55 + Math.random() * 0.9), KSPIN);
      }
      return fit(out, N);
    }

    /* ── ISO parada, mundo girando ────────────────────────────────────────── */
    /* Escala UNICA nos dois eixos, a partir da caixa MEDIDA dos pixels: nada
     * de estimar metrica de fonte, e nada de esticar a letra. */
    function letters(n, targetW) {
      var W = 900, H = 340, pts = [], x, y;
      try {
        var cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        var c = cv.getContext('2d');
        var fam = (getComputedStyle(document.documentElement)
                   .getPropertyValue('--font-sans') || 'sans-serif').trim();
        c.fillStyle = '#000'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = '700 230px ' + fam;
        c.fillText('ISO', W / 2, H / 2);
        var d = c.getImageData(0, 0, W, H).data;
        for (y = 0; y < H; y += 2)
          for (x = 0; x < W; x += 2)
            if (d[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
      } catch (e) { pts = []; }
      if (pts.length < 40) return null;
      var x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (i = 0; i < pts.length; i++) {
        if (pts[i][0] < x0) x0 = pts[i][0]; if (pts[i][0] > x1) x1 = pts[i][0];
        if (pts[i][1] < y0) y0 = pts[i][1]; if (pts[i][1] > y1) y1 = pts[i][1];
      }
      var k = targetW / (x1 - x0), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      var out = [], step = pts.length / n, i;
      for (i = 0; i < n; i++) {
        var p = pts[Math.floor(i * step) % pts.length];
        out.push([(p[0] - mx) * k + rnd(0.004), (p[1] - my) * k + rnd(0.004)]);
      }
      return out;
    }

    /* ── 3. O LOGOTIPO DA ISO ─────────────────────────────────────────────
     * Marca registrada da ISO, usada aqui num contexto editorial sobre a
     * propria ISO. Reconstruido a partir das proporcoes MEDIDAS do logotipo,
     * nao de memoria:
     *   raio do globo         473 px numa arte de 1600x1000
     *   letras                semi-largura 1.25 do raio (sao MAIS largas que
     *                         o globo) e meia-altura 0.49 do raio
     *   inicio das calotas    sin(lat) = 0.49, ou seja ~29 graus
     * O globo do logotipo nao tem inclinacao: as calotas sao simetricas. Por
     * isso BACK zera o tilt (ct=1, st=0) — e com tilt zero o filtro por
     * latitude e' exato, entao a calota nunca invade a faixa das letras por
     * mais que o globo gire.
     * As calotas GIRAM (spin 1) e as letras ficam PARADAS (spin 0): e' o
     * logotipo com o mundo rodando dentro dele. */
    function capPts(out, n, ink, r, a) {
      var lim = out.length + n, k, i2;
      var mer = 16, par = [34, 46, 60, 76];
      var per = Math.max(3, Math.floor(n / (mer * 2 + par.length * 2 + 2)));
      /* meridianos: so' as calotas, de 32 graus ao polo */
      for (i2 = 0; i2 < mer && out.length < lim; i2++) {
        var lo = -180 + i2 * (360 / mer);
        for (k = 0; k < per && out.length < lim; k++) {
          var t = k / (per - 1 || 1);
          sph(out, lo,  32 + 56 * t, BACK, ink, r, a, 1);
          if (out.length < lim) sph(out, lo, -32 - 56 * t, BACK, ink, r, a, 1);
        }
      }
      /* paralelos das calotas */
      for (i2 = 0; i2 < par.length && out.length < lim; i2++) {
        var pn = Math.max(6, Math.round(per * 2.2 * Math.cos(par[i2] * D2R)));
        for (k = 0; k < pn && out.length < lim; k++) {
          var lo2 = -180 + 360 * k / pn;
          sph(out, lo2,  par[i2], BACK, ink, r, a, 1);
          if (out.length < lim) sph(out, lo2, -par[i2], BACK, ink, r, a, 1);
        }
      }
      /* a silhueta: o limbo do globo, so' fora da faixa das letras */
      while (out.length < lim) {
        var th = Math.random() * 6.2832, sy = Math.sin(th);
        if (Math.abs(sy) < 0.50) continue;          /* onde as letras estao */
        out.push({ x: Math.cos(th) * BACK.rad, y: 0.50 + sy * BACK.rad,
                   ink: ink, r: r, a: a, z: 0.1 + rnd(0.1) });
      }
    }

    function formISO(N) {
      var out = [], i;
      var nA = q(N, A_FR), nB = q(N, B_FR), nC = q(N, C_FR), nD = N - nA - nB - nC;
      /* As letras nao precisam da cota inteira: elas saturam bem antes. 52%
       * para a palavra, 48% para o wireframe das calotas. */
      var nLet = Math.round(nA * 0.52), nExtra = nA - nLet;
      var L = letters(nLet, 0.90);
      if (L) {
        for (i = 0; i < nLet; i++)
          out.push({ x: L[i][0], y: 0.50 + L[i][1], ink: 'body', r: 1.6, a: 0.88,
                     z: 0.80 + rnd(0.14) });
        capPts(out, nExtra, 'body', 1.5, 0.86);
      } else {
        /* fonte indisponivel: so' o globo, em vez de desenhar uma letra a mao */
        var cg = coastG(), st = cg.length / nA;
        for (i = 0; i < nA; i++) {
          var p = cg[Math.min(cg.length - 1, Math.floor(i * st))];
          sph(out, p[0], p[1], BACK, 'body', 1.45, 0.80, 1);
        }
      }
      capPts(out, nB, 'body', 1.4, 0.80);
      capPts(out, nC, 'body', 1.3, 0.70);
      capPts(out, nD, 'band', 1.2, 0.46);
      return fit(out, N);
    }

    var M = [
      { build: formGlobe, anchor: [0, 0.50] },
      { build: formZoom,  anchor: [0, 0.50] },
      { build: formISO,   anchor: [0, 0.50] }
    ];
    M.span = 8000; M.morph = 6000; M.zoom = 1.0; M.focus = [0, 0.50];
    M.keepOrder = true; M.lit = true; M.lag = 0.14; M.back = 1;
    M.spin = 6.2831853 / 24000;        /* uma volta por ciclo: 15 graus/s   */
    /* 75 graus, nao 55. O zoom vai de 2 a 8 s, entao a metade dele e' 5 s; a
     * 15 graus/s isso da' 75 graus de rotacao ate' la'. Com 55 Singapura
     * cruzava o centro aos 3.5 s e ja' estava em +0.37 no meio da descida. */
    M.spinPhase = 75 * D2R;
    M.ink = {
      body:   [  0,  61, 124],
      band:   [ 62, 111, 168],
      accent: [239, 124, 0  ],
      faint:  [124, 162, 204]
    };
    M.far = [186, 207, 229];
    /* Menos pontos e cada um maior. Densidade nao e' legibilidade: com 6800 o
     * globo virava um bloco onde nada se distinguia. */
    M.area = 2.5; M.cap = 4000;
    M.half = 0.50; M.foot = 1.00; M.top = 0.24; M.bottom = 0.99;
    M.lo = 0.545; M.hi = 0.885;
    M.fitH = true; M.center = true; M.centerOn = 0; M.matchCopy = true;
    MOTIFS['earth-iso'] = M;
  })();

  /* Proximos motivos entram aqui, um por materia. */

  /* ── MOTOR ─────────────────────────────────────────────────────────────── */

  /* Ordena em torno da ANCORA da forma, por raio e depois por angulo.
   * O raio manda: a particula de rank i esta' a mesma distancia relativa do
   * alvo em todas as formas, entao a migracao le como a vizinhanca do alvo se
   * abrindo (zoom) e nao como uma troca de figura. Ordenar pelo centroide,
   * como na versao anterior, dava rotacao — nunca aproximacao. */
  function order(list, anchor) {
    var ax = anchor[0], ay = anchor[1], i;
    for (i = 0; i < list.length; i++) {
      var p = list[i], dx = p.x - ax, dy = p.y - ay;
      p._r = Math.hypot(dx, dy);
      p._a = Math.atan2(dy, dx);
    }
    list.sort(function (a, b) {
      /* faixas concentricas de 0.04, e dentro de cada faixa por angulo:
       * mantem a coerencia radial sem congelar a ordem angular */
      var ra = (a._r / 0.04) | 0, rb = (b._r / 0.04) | 0;
      return ra !== rb ? ra - rb : a._a - b._a;
    });
    return list;
  }

  function smooth(t) { return t * t * (3 - 2 * t); }

  HOSTS.forEach(function (host) {
    var forms = MOTIFS[host.getAttribute('data-hero-motif')];
    if (!forms || !forms.length) return;

    /* CONFIGURACAO POR MOTIVO. Os defaults abaixo sao os numeros do molar, que
     * era o unico motivo quando o motor nasceu — trocar de motivo nao pode
     * exigir editar o motor. Cada motivo declara o que difere:
     *   span/morph  ritmo (o molar tem 3 formas, petri-paper tem 4)
     *   zoom/focus  quanto o ciclo amplia; 1.0 = so' metamorfose
     *   half        meia-largura do desenho, em unidades do motivo
     *   top/bottom  onde y=0 e y=foot caem na altura do hero
     *   lo/hi       a faixa horizontal em que o desenho tem de caber
     *   keepOrder   desliga a ordenacao radial: a correspondencia entre formas
     *               passa a ser por indice de emissao. Use quando a narrativa
     *               for NOMEADA (esta celula vira esta replica) em vez de
     *               geometrica (a vizinhanca do alvo se abre)
     *   matchCopy   em vez de C.top/C.bottom fixos, mede a `.na-hero-copy` de
     *               verdade (getBoundingClientRect) e alinha a caixa a ela.
     *               Existe porque `.na-hero` centra o proprio conteudo por
     *               flex quando o hero cresce mais que o texto (headline
     *               longo empurra o hero para baixo do min-height) — a fracao
     *               onde o texto comeca muda de pagina para pagina, e chutar
     *               esse numero foi o que ficou errado duas vezes seguidas.
     *               C.top/C.bottom viram PISO de seguranca (nunca mais alto
     *               que a rampa da mascara, nunca mais baixo que quase a
     *               borda), nao mais o valor usado direto.
     *   center      centraliza o desenho DE VERDADE no eixo vertical, medindo o
     *               y minimo e maximo real das quatro formas — nao supoe que o
     *               motivo ocupa local y de 0 a foot. Usado quando a moldura e'
     *               um retangulo fechado (pagina/grafico): sobrava vazio em cima
     *               porque o ancoramento padrao (max(top, bottom-S)) empurra o
     *               desenho para o PISO da faixa e deixa a sobra inteira no teto
     *   ink/far     paleta propria e a cor para onde ela desbota. Copiar a do
     *               molar sem copiar a RAZAO dela (teal = ligamento, um tecido
     *               a parte) foi o que deixou o petri-paper generico: teal e
     *               laranja com o mesmo peso e nenhuma hierarquia
     *   spin        rad/ms de rotacao para pontos ESFERICOS. Um ponto com
     *               `lon`/`lat`/`rad`/`cx`/`cy` e' reprojetado a cada quadro em
     *               vez de ter x/y fixos, e o z que sai da projecao alimenta
     *               direto o sombreamento por profundidade — o lado de tras do
     *               globo fica pequeno e palido sozinho, sem codigo de oclusao.
     *               `spin` no PONTO multiplica a rotacao: 0 congela aquele
     *               ponto (as letras de earth-iso) enquanto o resto gira
     *   lit         sombreamento por PROFUNDIDADE (ver abaixo) + halo + varredura
     *   cap         teto de pontos (o padrao 3200 e' o do molar)
     *   fitH        proibe sangrar embaixo (forma com borda reta: pagina)
     *   area        densidade de pontos */
    var C = {
      span:   forms.span   || SPAN,
      morph:  forms.morph  || MORPH,
      zoom:   forms.zoom   || ZOOM,
      focus:  forms.focus  || FOCUS,
      half:   forms.half   || 0.715,
      foot:   forms.foot   || 1.02,
      top:    forms.top    || 0.27,
      bottom: forms.bottom || 1.02,
      area:   forms.area   || 1.43,
      lo:     forms.lo     || 0.48,
      hi:     forms.hi     || 0.94,
      cap:    forms.cap    || 3200,
      ink:    forms.ink    || INK,
      far:    forms.far    || [168, 184, 197],
      center: !!forms.center,
      /* qual forma define o enquadramento; null = a extensao de todas */
      centerOn: forms.centerOn == null ? null : forms.centerOn,
      matchCopy: !!forms.matchCopy,
      fitH:   !!forms.fitH,
      keep:   !!forms.keepOrder,
      /* espalhamento do atraso entre particulas. Alto = a nuvem se DESFAZ e
       * se refaz (bom quando as formas nao tem relacao geometrica); baixo = o
       * conjunto se move junto (bom num zoom, onde o movimento e' coerente e o
       * atraso so' produz chuvisco em transito). */
      lag:    forms.lag == null ? 0.40 : forms.lag,
      lit:    !!forms.lit,
      /* velocidade de rotacao da esfera, rad/ms; 0 = motivo sem esfera */
      spin:   forms.spin || 0,
      /* fase inicial, em radianos: quanto a esfera ja' esta' girada em el=0.
       * E' assim que se coloca um lugar entrando pela esquerda — girar o EIXO
       * (lon0) entre as formas nao serve, porque a diferenca de eixo vira
       * rotacao extra durante a passagem e empurra o alvo para fora. */
      spinPhase: forms.spinPhase || 0
    };

    var cv = document.createElement('canvas');
    cv.className = 'na-hero-motif';
    cv.setAttribute('aria-hidden', 'true');
    host.insertBefore(cv, host.firstChild);

    var LIT = C.lit, PAL = C.ink;
    /* Onde a mascara comeca e termina de esmaecer no topo, em fracao de H.
     * Fixo em 0.240/0.300 por padrao — os numeros que sempre protegeram a
     * .na-topbar. Com matchCopy eles saem daqui: 0.24/0.30 sao a folga certa
     * para um hero de ~504px (o do molar), mas um headline longo empurra o
     * hero para 600+ px e a MESMA fracao vira folga em dobro — a `.na-topbar`
     * so' precisa de ~30px de respiro, nao de 30% do hero. build() recalcula
     * FLO/FHI a partir da .na-topbar real quando isso se aplica. */
    var FLO = 0.240, FHI = 0.300;
    /* a cor do "fundo" — para onde a tinta desbota conforme o ponto se afasta.
     * Nunca cinza neutro: sobre o ivory do site ele fica sujo. */
    var FAR = C.far;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, DPR = 1, N = 0, S = 0, ox = 0, oy = 0;
    var SET = [], CUR = [], onScreen = true, t0 = -1, MR = 0;

    function build() {
      /* y=0 (altura cervical) em 27% da altura do hero — abaixo da .na-topbar,
       * que termina em ~20.5% na pior tela. y=1.02 cai FORA: a raiz sai pela
       * borda de baixo em vez de terminar em ponta.
       * A largura REAL e' a raiz (0.95) mais o alcance do osso (0.22 de cada
       * lado) = 1.43. Dimensionar so' pela raiz jogou o osso para fora da zona
       * livre numa montagem anterior. */
      S = H * 0.79;
      ox = W * 0.71;
      var half = Math.min(ox - W * C.lo, W * C.hi - ox);
      if (S * C.half > half) S = half / C.half;

      /* mTop/mBot sao o que o resto da funcao usa. Com matchCopy os dois vem
       * de medida real, nao de fracao chutada — inclusive o PISO do topo, que
       * deixou de ser o C.top generico (0.24, calibrado para o hero de ~504px
       * do molar) e passou a ser FLO, calculado a partir da `.na-topbar` de
       * verdade logo abaixo. C.top/C.bottom so' entram se a medida falhar ou
       * vier absurda (`.na-hero-copy` ausente, layout ainda nao assentado). */
      var mTop = C.top, mBot = C.bottom;
      if (C.matchCopy) {
        try {
          var hb = host.getBoundingClientRect();
          var topbarEl = host.querySelector('.na-topbar');
          if (topbarEl && hb.height > 0) {
            var tb = topbarEl.getBoundingClientRect();
            /* fim da topbar + 14px de respiro = piso da mascara; +28px de
             * rampa ate' a opacidade plena. Pixels fixos, nao fracao: a
             * topbar nao cresce com o headline, a folga que ela precisa
             * tambem nao deve. */
            FLO = (tb.bottom - hb.top + 14) / H;
            FHI = FLO + 28 / H;
          }
          /* LIMITES DEFINIDOS PELO VINICIUS, marcados a mao sobre a pagina:
           * o alto do motivo alinha com o alto do H1 e a base com o fim do
           * deck. NAO e' a `.na-hero-copy` inteira — ela comeca na linha de
           * metadados ("DENTAL MATERIALS · JUNE 2026"), ~30px acima, e usar
           * ela punha o motivo acima da marca. O par H1/deck e' o BLOCO DE
           * LEITURA: e' com ele que o desenho tem de conversar. */
          var h1El = host.querySelector('.na-h1');
          var deckEl = host.querySelector('.na-deck');
          var copyEl = host.querySelector('.na-hero-copy');
          var topEl = h1El || copyEl, botEl = deckEl || h1El || copyEl;
          if (topEl && botEl && hb.height > 0) {
            var ct = topEl.getBoundingClientRect(), cbm = botEl.getBoundingClientRect();
            mTop = Math.max(FLO, (ct.top - hb.top) / hb.height);
            mBot = Math.min(C.bottom, (cbm.bottom - hb.top) / hb.height);
            if (mBot - mTop < 0.20) { mTop = C.top; mBot = C.bottom; FLO = 0.240; FHI = 0.300; }  /* medida absurda: nao confia */
          }
        } catch (e) { mTop = C.top; mBot = C.bottom; FLO = 0.240; FHI = 0.300; }
      }

      /* fitH: a forma nao pode passar da base da zona livre. Sem isso um motivo
       * de altura 1.0 desenhado a partir de 31% da altura sairia 35 px por baixo
       * do hero — no molar isso e' o sangramento desejado, numa pagina e' um
       * retangulo cortado. */
      if (C.fitH) S = Math.min(S, (mBot - mTop) * H / C.foot);
      oy = Math.max(H * mTop, H * mBot - S * C.foot);

      /* Densidade alta: ~1 ponto a cada 120px2 de motivo. */
      N = Math.max(1200, Math.min(C.cap, Math.round(S * S * C.area / 70)));
      /* O raio da malha encolhe com a densidade, senao o numero de ligacoes
       * cresce com N^2 e o quadro cai. */
      MR = S * 0.055 * Math.sqrt(700 / N);

      SET = forms.map(function (f) {
        var L = f.build(N), i;
        /* z e' opcional: sem ele o ponto fica no plano medio e o motivo se
         * comporta como antes. */
        for (i = 0; i < L.length; i++) if (L[i].z == null) L[i].z = 0;
        return C.keep ? L : order(L, f.anchor);
      });
      if (C.center) {
        /* Com centerOn o enquadramento sai de UMA forma. Em earth-iso a forma
         * do zoom e' uma esfera de raio 2.4 que se estende muito alem do
         * quadro de proposito; deixar ela entrar na conta jogava a composicao
         * inteira para baixo (medido: o globo caiu para 59-107% da altura). */
        var yLo = Infinity, yHi = -Infinity, fi, li, arr;
        for (fi = 0; fi < SET.length; fi++) {
          if (C.centerOn != null && fi !== C.centerOn) continue;
          arr = SET[fi];
          for (li = 0; li < arr.length; li++) {
            if (arr[li].y < yLo) yLo = arr[li].y;
            if (arr[li].y > yHi) yHi = arr[li].y;
          }
        }
        var bandTop = H * mTop, bandBot = H * mBot;
        oy = bandTop + ((bandBot - bandTop) - (yHi - yLo) * S) / 2 - yLo * S;
      }
      /* ATRASO POR RAIO, nao aleatorio. As formas ja' estao ordenadas por
       * distancia a' ancora, entao o indice e' o raio: os pontos da PERIFERIA
       * (indice alto) migram PRIMEIRO, os do centro por ultimo.
       *
       * E' a logica do proprio zoom — quem sai do quadro pela ampliacao e'
       * reciclado como estrutura nova, em vez de deixar buraco. Com atraso
       * aleatorio a nuvem esvaziava no meio da transicao: os pontos de fora
       * ainda estavam a caminho, mascarados, e nada os substituia. */
      CUR = [];
      for (var i = 0; i < N; i++) {
        var far = i / (N - 1);                    /* 0 no centro, 1 na borda  */
        /* com keepOrder o indice e' a CATEGORIA, nao o raio: escalonar por
         * indice faria blocos inteiros partirem juntos, o que le como slide.
         * Atraso aleatorio, entao — e sem zoom forte nao ha' o esvaziamento
         * que motivou o atraso radial. */
        CUR.push({ x: 0, y: 0, ph: Math.random() * 6.28,
                   lag: C.keep ? Math.random() * C.lag
                               : (1 - far) * 0.42 + (Math.random() - 0.5) * 0.06 });
      }
    }

    function size() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      if (!W || !H) return;
      cv.width = W * DPR; cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build();
    }

    function draw(now) {
      if (!W || !H || !N) return;
      /* sentinela -1, nao 0: `!t0` com now=0 reinicializa a cada quadro e o
       * ciclo nunca avanca. No navegador performance.now() nunca vale 0 depois
       * do carregamento, entao o defeito so' aparece fora dele. */
      if (t0 < 0) t0 = now;
      var el = REDUCE ? 0 : (now - t0);
      var idx = Math.floor(el / C.span) % SET.length;
      var nxt = (idx + 1) % SET.length;
      var local = el % C.span;
      var prog = local / C.span;                     /* 0..1 no ciclo todo    */
      var base = local < C.span - C.morph ? 0 : (local - (C.span - C.morph)) / C.morph;

      /* Ampliacao exponencial: em escala logaritmica a velocidade aparente do
       * zoom fica constante. Linear parece acelerar no fim. */
      var Z = Math.exp(Math.log(C.zoom) * prog);
      /* A ancora e' trazida ao centro do quadro enquanto amplia — e' o que a
       * platina de um microscopio faz. Sem isso a estrutura sai pela lateral. */
      var anc = forms[idx].anchor, sm = smooth(prog);
      var zx = anc[0] + (C.focus[0] - anc[0]) * sm;
      var zy = anc[1] + (C.focus[1] - anc[1]) * sm;

      var mb = smooth(base);          /* progresso comum da passagem */
      var A = SET[idx], B = SET[nxt], i, p, a, b;
      var tt = now * 0.001;
      /* `el`, nao `now`: com o relogio absoluto o angulo inicial dependia da
       * hora em que a pagina carregou, entao "comeca na Asia" so' valia por
       * acaso. Com o tempo decorrido a rotacao parte de zero no load — e, se o
       * periodo for multiplo do ciclo, a forma 1 reabre sempre no mesmo
       * meridiano toda vez que volta. */
      /* SP e' PERIODICO no ciclo. Sem o modulo o angulo acumulado cresce sem
       * limite e, multiplicado por um spin fracionario (a desaceleracao do
       * zoom), a posicao da forma 2 seria diferente a cada volta. Com uma
       * volta exata por ciclo, o produto e' o mesmo em todas. */
      var CYC = C.span * SET.length;
      var SP = C.spin ? (el % CYC) * C.spin - C.spinPhase : 0;
      var swp = (now * 0.0000525) % 1.6 - 0.3;      /* varredura, ~19 s */
      ctx.clearRect(0, 0, W, H);

      for (i = 0; i < N; i++) {
        p = CUR[i]; a = A[i]; b = B[i];
        /* Atraso por ponto: sem ele os N pontos partem juntos e a migracao le
         * como um slide de bloco. Escalonado, a forma se DESFAZ e se REFAZ. */
        var m = smooth(Math.max(0, Math.min(1, (base - p.lag) / (1 - p.lag))));
        /* A forma atual e' ampliada em torno da ancora; a forma seguinte entra
         * ja' no tamanho natural, porque ela FOI desenhada como esta regiao no
         * aumento maior. E' isso que faz a troca passar despercebida. */
        /* Ponto esferico: reprojeta agora, com a rotacao do quadro. x/y/z
         * gravados no build (rotacao zero) continuam servindo de fallback e
         * sao o que C.center mede — a esfera nao muda de extensao ao girar. */
        var aX = a.x, aY = a.y, aZ = a.z, bX = b.x, bY = b.y, bZ = b.z, lo, cl;
        if (C.spin) {
          /* Inclinacao do eixo (a.ct/a.st). Sem ela o EQUADOR e' o unico
           * paralelo que projeta como reta horizontal, e todo ponto perto de
           * lat 0 — costa, grade, atmosfera — empilha na mesma altura: nasce
           * uma barra escura atravessando o globo de ponta a ponta que nenhum
           * dos emissores desenhou. Tirar os pontos nao resolveria; e' a
           * projecao. Inclinado, nenhum paralelo e' reto. */
          if (a.lon != null && b.lon != null) {
            /* ZOOM ESFERICO. Os dois pontos estao na esfera, entao interpola os
             * PARAMETROS (longitude, latitude, raio, centro) e projeta UMA vez.
             * Projetar os dois e interpolar os pixels — o que o motor faz para
             * formas planas — daria um cross-fade entre duas fotos: o ponto
             * atravessaria o quadro em linha reta, cortando por dentro da
             * esfera. Aqui ele ANDA NA SUPERFICIE enquanto a esfera cresce, que
             * e' o que faz o zoom parecer camera e nao troca de imagem.
             * A longitude interpola pelo caminho curto: sem normalizar, um
             * ponto a 179 graus daria a volta inteira ao migrar para -179. */
            /* A ROTACAO E' SINCRONA, a MIGRACAO e' que tem atraso por ponto.
             * Misturar as duas foi um erro caro: cada particula cancelava uma
             * fracao diferente do angulo acumulado (porque cada uma tem seu
             * `m`), e o marcador de Singapura — 267 pontos que deviam formar um
             * ponto — saia esticado num arco de paralelo com mais de 100 px.
             * `mb` vem do progresso GLOBAL da passagem, igual para todos. */
            var dlon = b.lon - a.lon;
            while (dlon >  Math.PI) dlon -= 6.2831853;
            while (dlon < -Math.PI) dlon += 6.2831853;
            var iSpin = a.spin + (b.spin - a.spin) * mb;
            lo = a.lon + dlon * m + SP * iSpin;
            var iLat = a.lat + (b.lat - a.lat) * m;
            /* A ESFERA e' uma so': raio e centro vem de `mb`, o progresso
             * global. Com `m` cada particula ficava numa esfera de tamanho
             * diferente — em plena passagem havia pontos a raio 0.48 e outros
             * a 1.44 ao mesmo tempo — e o conjunto virava rastros radiais
             * saindo do centro, o oposto de uma camera descendo. O atraso por
             * ponto fica so' onde faz sentido: em ONDE o ponto esta' no mapa
             * (lon/lat), que e' o rearranjo. */
            var iRad = a.rad + (b.rad - a.rad) * mb;
            var iCx  = a.cx + (b.cx - a.cx) * mb;
            var iCy  = a.cy + (b.cy - a.cy) * mb;
            cl = Math.cos(iLat);
            var iY0 = Math.sin(iLat), iZ0 = cl * Math.cos(lo);
            aX = iCx + cl * Math.sin(lo) * iRad;
            aY = iCy - (iY0 * a.ct - iZ0 * a.st) * iRad;
            aZ = iY0 * a.st + iZ0 * a.ct;
            bX = aX; bY = aY; bZ = aZ;    /* ja' esta' interpolado */
          } else {
            if (a.lon != null) {
              lo = a.lon + SP * a.spin; cl = Math.cos(a.lat);
              var aY0 = Math.sin(a.lat), aZ0 = cl * Math.cos(lo);
              aX = a.cx + cl * Math.sin(lo) * a.rad;
              aY = a.cy - (aY0 * a.ct - aZ0 * a.st) * a.rad;
              aZ = aY0 * a.st + aZ0 * a.ct;
            }
            if (b.lon != null) {
              lo = b.lon + SP * b.spin; cl = Math.cos(b.lat);
              var bY0 = Math.sin(b.lat), bZ0 = cl * Math.cos(lo);
              bX = b.cx + cl * Math.sin(lo) * b.rad;
              bY = b.cy - (bY0 * b.ct - bZ0 * b.st) * b.rad;
              bZ = bY0 * b.st + bZ0 * b.ct;
            }
          }
        }
        var ax = anc[0] + (aX - anc[0]) * Z + (zx - anc[0]);
        var ay = anc[1] + (aY - anc[1]) * Z + (zy - anc[1]);
        var nx = ax + (bX - ax) * m, ny = ay + (bY - ay) * m;
        var br = REDUCE ? 0 : 0.009;
        nx += Math.sin(tt * 0.9 + p.ph) * br;
        ny += Math.cos(tt * 0.75 + p.ph * 1.3) * br;
        p.x = ox + nx * S; p.y = oy + ny * S;
        p.r = a.r + (b.r - a.r) * m;
        var ca = PAL[a.ink], cb = PAL[b.ink];
        p.cr = ca[0] + (cb[0] - ca[0]) * m;
        p.cg = ca[1] + (cb[1] - ca[1]) * m;
        p.cb = ca[2] + (cb[2] - ca[2]) * m;
        /* a nuvem clareia no meio da passagem: dissolucao, nao translacao */
        var aa = (a.a == null ? 0.34 : a.a), ab = (b.a == null ? 0.34 : b.a);
        p.al = (aa + (ab - aa) * m) * (1 - 0.18 * Math.sin(m * Math.PI));

        /* ── LUZ E PROFUNDIDADE ──────────────────────────────────────────
         * O hero da home e' WebGL com 160 mil pontos, e o que produz a
         * riqueza dele nao e' a contagem: e' que TAMANHO, OPACIDADE e COR
         * saem todos da profundidade do ponto, entao a mesma aresta tem
         * peso diferente ao longo do seu comprimento. Em 2D nao da' para
         * pagar 160 mil pontos, mas da' para pagar a variacao — que e' a
         * parte que se ve. Aqui z (-1 fundo, +1 frente) governa as tres:
         *   tamanho  0.58x a 1.42x     (o fundo vira poeira, a frente pesa)
         *   opacidade 0.46x a 1.36x
         *   cor      do slate palido ate' a tinta cheia
         * Sem a cor a nuvem fica monotona mesmo com tamanho variavel: e' o
         * desbotamento do fundo que cria as camadas. */
        if (LIT) {
          var dz = 0.5 + 0.5 * (aZ + (bZ - aZ) * m);
          p.hz = dz;
          p.r *= 0.58 + 0.84 * dz;
          p.al *= 0.46 + 0.90 * dz;
          var kf = 0.24 + 0.76 * dz;
          p.cr = FAR[0] + (p.cr - FAR[0]) * kf;
          p.cg = FAR[1] + (p.cg - FAR[1]) * kf;
          p.cb = FAR[2] + (p.cb - FAR[2]) * kf;
          /* VARREDURA: uma faixa de luz atravessa o motivo em ~19 s. E' o
           * `sweep` do shader da home. Sozinha ela nao se nota; o que ela
           * faz e' impedir que a nuvem parada pareca uma imagem parada. */
          var xn = (nx / (C.half * 2)) + 0.5;
          p.al *= 1 + 0.42 * Math.exp(-Math.pow((xn - swp) * 3.0, 2));
          if (p.al > 0.92) p.al = 0.92;
        }
        /* MASCARA DA ZONA LIVRE — nao e' a borda do canvas, e' a borda da
         * area em que o motivo pode existir. A ampliacao empurra pontos para
         * fora do motivo: eles continuam DENTRO do canvas, e sem mascara
         * apareceriam por cima da manchete (x < 46%) e dentro da barra do
         * seletor de idioma (y < 23.5%) — o mesmo erro que derrubou a versao
         * em PNG. Apagam em rampa; corte duro denunciaria o retangulo. */
        var mk = 1;
        if (p.x < W * 0.54) mk *= Math.max(0, (p.x - W * 0.48) / (W * 0.06));
        if (p.x > W * 0.89) mk *= Math.max(0, (W * 0.94 - p.x) / (W * 0.05));
        if (p.y < H * FHI) mk *= Math.max(0, (p.y - H * FLO) / (H * (FHI - FLO)));
        p.al *= mk;
      }

      /* SEM malha de proximidade. Ela ligava pontos de tecidos diferentes —
       * cemento com osso, osso com ligamento — e o resultado era uma teia
       * riscada que apagava as bordas em vez de reforca-las. A estrutura agora
       * vem da densidade ao longo das curvas, nao de ligacoes. */

      /* HALO. No shader da home cada ponto e' um blob com queda radial
       * (alpha * (1-r^2)); em canvas 2D o arc e' um disco duro e a nuvem sai
       * chapada. O halo devolve a queda: um segundo circulo de 2.6x o raio a
       * ~12% da opacidade, so' para os pontos da frente. E' o que faz a
       * densidade virar LUZ em vez de mancha. */
      if (LIT) {
        var hal = {}, hk;
        for (i = 0; i < N; i++) {
          p = CUR[i];
          if (p.al < 0.06 || p.hz < 0.50) continue;
          var ha = p.al * 0.30 * (p.hz - 0.50);
          if (ha < 0.007) continue;
          hk = ((p.cr / 40) | 0) + ',' + ((p.cg / 40) | 0) + ',' + ((p.cb / 40) | 0) + ',' + ((ha * 120) | 0);
          (hal[hk] || (hal[hk] = [])).push(i);
        }
        for (var hk2 in hal) {
          var hl = hal[hk2], hf = CUR[hl[0]];
          ctx.fillStyle = 'rgba(' + (hf.cr | 0) + ',' + (hf.cg | 0) + ',' + (hf.cb | 0) + ',' +
                          (hf.al * 0.30 * (hf.hz - 0.50)).toFixed(3) + ')';
          ctx.beginPath();
          for (i = 0; i < hl.length; i++) {
            p = CUR[hl[i]];
            ctx.moveTo(p.x + p.r * 2.6, p.y);
            ctx.arc(p.x, p.y, p.r * 2.6, 0, 6.283);
          }
          ctx.fill();
        }
      }

      /* Pontos agrupados por cor quantizada: um beginPath/fill por grupo. Um
       * fill() por ponto seriam ate 1.800 chamadas por quadro. */
      var buckets = {};
      for (i = 0; i < N; i++) {
        p = CUR[i];
        if (p.al < 0.012) continue;      /* invisivel: nao entra na malha nem no desenho */
        var key = ((p.cr / 26) | 0) + ',' + ((p.cg / 26) | 0) + ',' + ((p.cb / 26) | 0) + ',' + ((p.al * 40) | 0);
        (buckets[key] || (buckets[key] = [])).push(i);
      }
      for (var key2 in buckets) {
        var list = buckets[key2], f = CUR[list[0]];
        ctx.fillStyle = 'rgba(' + (f.cr | 0) + ',' + (f.cg | 0) + ',' + (f.cb | 0) + ',' + f.al.toFixed(3) + ')';
        ctx.beginPath();
        for (i = 0; i < list.length; i++) {
          p = CUR[list[i]];
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, 6.283);
        }
        ctx.fill();
      }
    }

    /* O rAF fica no finally. Chamado depois do draw, UMA excecao mata o loop
     * para sempre e a faixa congela sem nenhum sinal — o mesmo cuidado que o
     * hero da home ja' toma. O erro e' reportado uma vez, para aparecer no
     * console em vez de sumir. */
    var barked = false;
    function loop(now) {
      try {
        if (onScreen && !document.hidden) draw(now);
      } catch (e) {
        if (!barked) { barked = true; console.error('news-hero-motif:', e); }
      } finally {
        requestAnimationFrame(loop);
      }
    }

    addEventListener('resize', function () { size(); draw(performance.now()); });
    size(); draw(performance.now());

    if (REDUCE) return;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; })
        .observe(host);
    }
    requestAnimationFrame(loop);
  });
})();
