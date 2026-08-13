/* ============================================================
   news-article.js — o índice da margem ("In this story")
   Sem dependências. Carregar com defer, depois de shared.js.

   Por que existe: numa matéria longa o leitor não quer rolar até
   achar o trecho; quer ver a estrutura e pular. O índice é montado
   a partir dos SUBTÍTULOS REAIS do corpo (h2.na-sub) — nunca de uma
   lista escrita à mão, que sai de sincronia na primeira revisão.

   Regras que o design impõe e este script respeita:
   · menos de 2 subtítulos → o índice não existe (a coluna some);
   · o marcador laranja marca a seção em leitura, nunca o rótulo;
   · sem JS, o rail já vem renderizado vazio e a coluna colapsa.
   ============================================================ */

/* ── "Related": quatro linhas, geradas de news.js ─────────────
   Lista fixa em HTML sai de sincronia na primeira notícia nova, então o
   bloco é montado do mesmo array que alimenta a listagem. Sem NEWS (ou
   sem JS) o bloco simplesmente não aparece — nunca um buraco rotulado. */
(function () {
  'use strict';
  var box = document.querySelector('[data-related-for]');
  if (!box || !window.NEWS) return;

  var slug = box.getAttribute('data-related-for');
  var me = null, i;
  for (i = 0; i < NEWS.length; i++) if (NEWS[i].slug === slug) me = NEWS[i];

  /* Primeiro as da mesma categoria, depois o resto — as duas listas já
     vêm na ordem do array, que é cronológica. */
  var same = [], other = [];
  for (i = 0; i < NEWS.length; i++) {
    var n = NEWS[i];
    if (n.slug === slug) continue;
    (me && n.category === me.category ? same : other).push(n);
  }
  var pick = same.concat(other).slice(0, 4);
  if (!pick.length) { box.parentNode.style.display = 'none'; return; }

  box.innerHTML = pick.map(function (n) {
    return '<a class="na-row" href="' + n.slug + '.html">' +
      '<span class="na-row-date">' + n.date + '</span>' +
      '<span class="na-row-title">' + n.headline + '</span></a>';
  }).join('');
})();

(function () {
  'use strict';

  var rail = document.querySelector('[data-article-index]');
  var body = document.querySelector('[data-article-body]');
  if (!rail || !body) return;

  var subs = [].slice.call(body.querySelectorAll('h2.na-sub'));

  /* Uma matéria de três parágrafos não tem estrutura para indexar, e um
     índice de um item é decoração. O grid usa :has() para colapsar a coluna,
     e o atributo é o sinal para quem não suporta :has(). */
  if (subs.length < 2) {
    rail.setAttribute('data-empty', '');
    rail.innerHTML = '';
    return;
  }

  subs.forEach(function (h, i) { if (!h.id) h.id = 'sec-' + (i + 1); });

  var html = '<div class="na-rail-inner">' +
    '<span class="na-rail-label" data-i18n="indexLabel">In this story</span>' +
    '<span class="na-rail-line" aria-hidden="true"></span>' +
    '<span class="na-rail-mark" aria-hidden="true"></span>' +
    subs.map(function (h) {
      return '<a class="na-rail-item" href="#' + h.id + '">' + h.textContent + '</a>';
    }).join('') + '</div>';
  rail.innerHTML = html;

  var items = [].slice.call(rail.querySelectorAll('.na-rail-item'));
  var mark = rail.querySelector('.na-rail-mark');
  var current = -1;

  /* O trilho é montado por JS DEPOIS que o i18n inline já capturou os nós da
     página, então ele nunca entra na troca de idioma: o rótulo ficaria em
     inglês e os itens congelados no idioma do carregamento. Ressincronizar
     aqui é mais barato que reescrever o IIFE inline das 41 páginas.
     Fallback embutido porque "indexLabel" não existe nos dicionários. */
  var RAIL_LABEL = {
    en: 'In this story', es: 'En esta historia', pt: 'Nesta matéria',
    fr: 'Dans cet article', zh: '\u672C\u6587\u5BFC\u8BFB',
    ar: '\u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631'
  };
  var label = rail.querySelector('.na-rail-label');
  function syncRail(lang) {
    var dict = (window.I18N || {})[lang] || {};
    if (label) label.innerHTML = dict.indexLabel || RAIL_LABEL[lang] || RAIL_LABEL.en;
    /* o texto do item vem do h2 já traduzido, não de uma cópia guardada */
    items.forEach(function (a, k) { if (subs[k]) a.textContent = subs[k].textContent; });
  }
  document.querySelectorAll('.lang-opt').forEach(function (b) {
    b.addEventListener('click', function () { syncRail(b.getAttribute('data-lang')); });
  });
  var on = document.querySelector('.lang-opt.active');
  syncRail(on ? on.getAttribute('data-lang') : 'en');

  function activate(i) {
    if (i === current) return;
    current = i;
    items.forEach(function (a, k) { a.classList.toggle('is-on', k === i); });
    /* O marcador é posicionado a partir da posição REAL do item, não de um
       passo fixo: item de duas linhas quebra qualquer cálculo por múltiplo. */
    var a = items[i];
    if (!a || !mark) return;
    mark.style.top = a.offsetTop + 'px';
    mark.style.height = a.offsetHeight + 'px';
  }

  /* Scroll-spy: a seção ativa é a última cujo topo já passou da linha de
     leitura (1/3 da altura da janela). rootMargin faria a mesma coisa com
     IntersectionObserver, mas com N observers e um estado por seção; um
     único cálculo no scroll é mais simples de auditar — e é o que o resto
     do site já faz. */
  var ticking = false;
  function measure() {
    ticking = false;
    var line = window.innerHeight / 3;
    var idx = 0;
    for (var i = 0; i < subs.length; i++) {
      if (subs[i].getBoundingClientRect().top <= line) idx = i;
    }
    activate(idx);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(measure); }
  }, { passive: true });
  window.addEventListener('resize', function () { current = -1; measure(); });

  /* rAF pode estar estrangulado (aba de fundo, painel de preview): o estado
     inicial é desenhado de forma síncrona, nunca dependendo de um frame. */
  activate(0);
  measure();

  /* Clique com rolagem suave, respeitando reduced-motion. scrollIntoView não
     é usado de propósito — o offset do header sticky tem de entrar na conta. */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  items.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (!t) return;
      e.preventDefault();
      var y = window.pageYOffset + t.getBoundingClientRect().top - 96;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
})();

/* ── Fontes árabes, sob demanda ────────────────────────────────────────
   DM Sans e Source Serif 4 não trazem glifos árabes. Carregar as duas
   famílias Noto sempre custaria a todo leitor das outras quatro línguas
   um download que ele nunca usa, então o <link> só entra no primeiro
   clique em العربية. Listener delegado em captura: o IIFE de i18n é
   inline em cada página e este arquivo carrega com defer — não há ordem
   garantida entre os dois. */
(function () {
  var loaded = false;
  document.addEventListener('click', function (e) {
    if (loaded || !e.target || !e.target.closest) return;
    if (!e.target.closest('.lang-opt[data-lang="ar"]')) return;
    loaded = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;700&family=Noto+Naskh+Arabic:wght@400;500;600&display=swap';
    document.head.appendChild(l);
  }, true);
})();
