/* ==========================================================================
   news-hero-network.js — a rede do hidrogel, animada sobre o hero da news
   ==========================================================================
   Desenha impulsos correndo pela rede que EXISTE na fotografia do hero
   (news/Assets/ai-living-lab-hydrogel-wide.png). Os 29 nos nao foram
   inventados: foram detectados por cor na propria imagem (mascara ciano,
   b-r > 0.06), e as arestas vem da triangulacao desses nos, podada por
   comprimento. As linhas impressas na foto ficaram tenues demais para se
   lerem sozinhas, por isso o canvas redesenha a malha por cima — como os
   nos coincidem, le-se uma rede so'.

   Cada impulso percorre UM caminho: ao chegar num no' escolhe a proxima
   aresta, nunca se divide (decisao do Vinicius, 2026-08-04). O no' estala
   por CHEGADA, e dois impulsos chegando juntos somam o brilho.

   O canvas vive DENTRO do .nw-hero com z-index 1 — abaixo do veu (z-index
   2), para o impulso se dissolver em ivory na esquerda junto com a foto em
   vez de passar por cima da manchete.
   ========================================================================== */

var NET={"w":1672,"h":941,"nodes":[[0.55024,0.43075],[0.593,0.44102],[0.6741,0.44563],[0.73497,0.45893],[0.53106,0.47465],[0.82563,0.47508],[0.60969,0.48762],[0.64691,0.49356],[0.69102,0.50624],[0.80191,0.51751],[0.56467,0.52165],[0.74306,0.53194],[0.64448,0.54762],[0.60428,0.54866],[0.52153,0.57811],[0.69708,0.58944],[0.56962,0.60744],[0.5328,0.61655],[0.7811,0.62487],[0.7847,0.63248],[0.70881,0.65141],[0.57325,0.66372],[0.81953,0.66339],[0.63991,0.66956],[0.61754,0.68445],[0.74599,0.6998],[0.66477,0.72248],[0.57304,0.72719],[0.70215,0.74123]],"edges":[[6,12],[24,27],[16,17],[12,13],[20,26],[14,16],[17,21],[8,12],[9,11],[1,6],[8,15],[2,8],[25,28],[24,26],[18,19],[15,20],[20,25],[18,25],[12,15],[21,24],[5,9],[21,27],[23,24],[4,14],[20,28],[0,1],[8,11],[0,4],[2,7],[10,14],[0,10],[13,16],[6,7],[6,13],[7,12],[6,10],[16,21],[16,24],[26,28],[3,11],[4,10],[3,8],[23,26],[14,17],[10,13],[2,3],[1,7],[9,18],[19,25],[19,22],[1,10],[11,15],[10,16],[7,8]],"depth":[0.0,0.0331,0.0479,0.0908,0.1414,0.1428,0.1832,0.2023,0.2431,0.2794,0.2928,0.3259,0.3764,0.3798,0.4746,0.5111,0.5691,0.5984,0.6252,0.6497,0.7107,0.7504,0.7493,0.7692,0.8171,0.8666,0.9396,0.9548,1.0],"layer":[0,1,3,4,0,6,2,2,3,5,1,4,3,2,0,4,1,0,6,6,4,1,7,3,2,5,3,2,4],"maxLayer":7};

(function(){
  var cv=document.getElementById('nw-pulse'), img=document.getElementById('nw-hero-img');
  if(!cv || !img) return;

  /* A animacao so' faz sentido sobre ESTA fotografia: os nos foram medidos
     nela. Se a materia principal mudar, o canvas sai de cena em vez de
     acender uma rede que nao existe na imagem nova. */
  var OWNER='ai-living-lab-hydrogel-wide';
  function belongs(){ return (img.getAttribute('src')||'').indexOf(OWNER)>=0; }

  /* Movimento reduzido: nem malha, nem pulso. A fotografia ja' carrega a
     rede impressa — a pagina nao perde informacao sem a animacao. */
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq && mq.matches){ cv.remove(); return; }
  var ctx=cv.getContext('2d'), DPR=Math.min(window.devicePixelRatio||1,2);

  /* NET.nodes sao os pontos cianos REAIS da fotografia (29, detectados por
     cor); as arestas vem da triangulacao desses nos, podada por comprimento.
     A malha desenhada por cima existe porque as linhas impressas na foto
     ficaram tenues demais para se lerem sozinhas quando nada passa por elas. */
  var IMG={w:NET.w,h:NET.h};
  /* Valores fechados com o Vinicius no rascunho _demo-hero-pulsos.html. */
  var P={speed:108, count:12, glow:.38, links:.14, mesh:1};
  var W=0,H=0,map=null,unit=1,running=true;

  function remap(){
    var r=cv.getBoundingClientRect(); W=r.width; H=r.height;
    cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
    var s=Math.max(W/IMG.w,H/IMG.h), dw=IMG.w*s, dh=IMG.h*s;
    var ox=(W-dw)*0.72, oy=(H-dh)*0.48;
    map=function(p){ return [(ox+p[0]*dw)*DPR,(oy+p[1]*dh)*DPR]; };
    unit=s*DPR;
  }

  /* adjacencia + comprimento de cada aresta em px da imagem */
  var adj={}, elen=[];
  (function(){
    for(var e=0;e<NET.edges.length;e++){
      var i=NET.edges[e][0], j=NET.edges[e][1];
      (adj[i]=adj[i]||[]).push(e); (adj[j]=adj[j]||[]).push(e);
      var dx=(NET.nodes[j][0]-NET.nodes[i][0])*NET.w;
      var dy=(NET.nodes[j][1]-NET.nodes[i][1])*NET.h;
      elen[e]=Math.hypot(dx,dy);
    }
  })();

  /* UM impulso, UM caminho: a particula ocupa uma aresta por vez e, ao
     chegar num no', escolhe a proxima — nao se divide. A preferencia por
     arestas que avancam de camada mantem um sentido geral de fluxo sem
     travar o percurso num vaivem. */
  var pulses=[], flashes=[];
  function spawn(p){
    var e=Math.floor(Math.random()*NET.edges.length);
    var d=Math.random()<0.5?1:-1;
    p=p||{}; p.e=e; p.dir=d; p.t=0; p.hops=0; return p;
  }
  function endsOf(p){
    var e=NET.edges[p.e];
    return p.dir>0 ? [e[0],e[1]] : [e[1],e[0]];
  }
  function advance(p){
    var ends=endsOf(p), from=ends[0], to=ends[1];
    flashes.push({n:to, a:1});
    var opts=(adj[to]||[]).filter(function(e){ return e!==p.e; });
    if(!opts.length || p.hops>26){ spawn(p); return; }
    /* 70% das vezes segue para a camada seguinte, se houver */
    var fwd=opts.filter(function(e){
      var o=NET.edges[e][0]===to?NET.edges[e][1]:NET.edges[e][0];
      return NET.layer[o]>NET.layer[to];
    });
    var pool=(fwd.length && Math.random()<0.7) ? fwd : opts;
    var ne=pool[Math.floor(Math.random()*pool.length)];
    p.e=ne; p.dir=(NET.edges[ne][0]===to)?1:-1; p.t=0; p.hops++;
  }

  /* Fora da tela ou aba em segundo plano: nada de queimar bateria
     desenhando 12 impulsos que ninguem esta' vendo. */
  var onScreen=true;
  if(window.IntersectionObserver){
    new IntersectionObserver(function(en){ onScreen=en[0].isIntersecting; },
      {rootMargin:'120px'}).observe(cv.parentNode);
  }

  var last=0;
  function frame(ts){
    requestAnimationFrame(frame);
    var now=ts/1000, dt=last?Math.min(now-last,.05):.016; last=now;
    if(document.hidden || !onScreen) return;
    if(!map) remap();
    ctx.clearRect(0,0,cv.width,cv.height);

    ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.lineCap='round';

    /* malha parada */
    for(var e2=0;e2<NET.edges.length;e2++){
      var i2=NET.edges[e2][0], j2=NET.edges[e2][1];
      var pa=map(NET.nodes[i2]), pb=map(NET.nodes[j2]);
      var k=0.45+0.55*((NET.depth[i2]+NET.depth[j2])/2);
      ctx.strokeStyle='rgba(120,215,245,'+(0.16*P.links*k*P.mesh)+')';
      ctx.lineWidth=(0.55*k)*DPR;
      ctx.beginPath(); ctx.moveTo(pa[0],pa[1]); ctx.lineTo(pb[0],pb[1]); ctx.stroke();
    }

    /* impulsos */
    while(pulses.length<P.count) pulses.push(spawn());
    while(pulses.length>P.count) pulses.pop();
    for(var q=0;q<pulses.length;q++){
      var p=pulses[q], L=elen[p.e]||1;
      if(running){ p.t += (P.speed*dt)/L; while(p.t>=1){ p.t-=1; advance(p); L=elen[p.e]||1; } }
      var ends2=endsOf(p);
      var A=map(NET.nodes[ends2[0]]), B=map(NET.nodes[ends2[1]]);
      var k2=0.5+0.5*((NET.depth[ends2[0]]+NET.depth[ends2[1]])/2);
      /* pacote de luz SIMETRICO: sem cabeca nem cauda, para nao virar seta */
      var amp=P.glow*k2, SEG=9, HALF=Math.min(0.34, 26/L);
      for(var s2=0;s2<SEG;s2++){
        var f0=(s2/SEG)*2-1, f1=((s2+1)/SEG)*2-1;
        var c0=p.t+f0*HALF, c1=p.t+f1*HALF;
        if(c1<=0||c0>=1) continue;
        c0=Math.max(0,c0); c1=Math.min(1,c1);
        var mid=((c0+c1)/2-p.t)/HALF, env=Math.exp(-3.2*mid*mid);
        var X0=A[0]+(B[0]-A[0])*c0, Y0=A[1]+(B[1]-A[1])*c0;
        var X1=A[0]+(B[0]-A[0])*c1, Y1=A[1]+(B[1]-A[1])*c1;
        ctx.strokeStyle='rgba(120,205,245,'+(0.26*env*amp)+')';
        ctx.lineWidth=(7.0*env*k2+0.6)*DPR;
        ctx.beginPath(); ctx.moveTo(X0,Y0); ctx.lineTo(X1,Y1); ctx.stroke();
        ctx.strokeStyle='rgba(190,238,255,'+(0.60*env*amp)+')';
        ctx.lineWidth=(3.2*env*k2+0.4)*DPR;
        ctx.beginPath(); ctx.moveTo(X0,Y0); ctx.lineTo(X1,Y1); ctx.stroke();
        ctx.strokeStyle='rgba(245,253,255,'+(0.92*env*env*amp)+')';
        ctx.lineWidth=(1.35*env*k2+0.25)*DPR;
        ctx.beginPath(); ctx.moveTo(X0,Y0); ctx.lineTo(X1,Y1); ctx.stroke();
      }
    }

    /* nos: brilho de base + estalo por CHEGADA (evento, nao agenda) */
    var fire={};
    for(var f=flashes.length-1;f>=0;f--){
      var fl=flashes[f]; fl.a -= dt*1.9;
      if(fl.a<=0){ flashes.splice(f,1); continue; }
      fire[fl.n]=Math.min(2.2,(fire[fl.n]||0)+fl.a);   /* dois chegando somam */
    }
    for(var n=0;n<NET.nodes.length;n++){
      var qq=map(NET.nodes[n]), kk=0.5+0.5*NET.depth[n];
      var fv=fire[n]||0; fv=fv*fv*(3-2*Math.min(1,fv));
      var R=Math.max((3.2+18.0*fv)*kk*unit*0.9,1.2);
      var g=ctx.createRadialGradient(qq[0],qq[1],0,qq[0],qq[1],R);
      g.addColorStop(0,'rgba(240,252,255,'+((0.16+0.84*Math.min(1,fv))*P.glow*kk)+')');
      g.addColorStop(.22,'rgba(190,238,255,'+((0.10+0.58*Math.min(1,fv))*P.glow*kk)+')');
      g.addColorStop(.50,'rgba(120,215,245,'+((0.05+0.30*Math.min(1,fv))*P.glow*kk)+')');
      g.addColorStop(1,'rgba(110,200,240,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(qq[0],qq[1],R,0,6.284); ctx.fill();
      if(fv>0.05){
        var CR=Math.max((0.9+4.2*fv)*kk*unit*0.9,0.8);
        ctx.fillStyle='rgba(255,255,255,'+(Math.min(1,0.95*fv)*P.glow)+')';
        ctx.beginPath(); ctx.arc(qq[0],qq[1],CR,0,6.284); ctx.fill();
        if(fv>0.40){
          var b=(fv-0.40)/2.0, BR=R*(1.0+2.2*b);
          var bg=ctx.createRadialGradient(qq[0],qq[1],R*0.30,qq[0],qq[1],BR);
          bg.addColorStop(0,'rgba(225,248,255,'+(0.55*b*P.glow)+')');
          bg.addColorStop(1,'rgba(140,220,250,0)');
          ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(qq[0],qq[1],BR,0,6.284); ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  /* Sem painel em producao: os numeros acima sao o resultado da calibragem. */
  window.addEventListener('resize',remap);
  /* O src do hero e' injetado pelo script da news.html a partir de
     news.js, entao esperar 'load' e' o unico ponto seguro para medir. */
  function start(){
    if(!belongs()){ cv.remove(); return; }
    remap(); requestAnimationFrame(frame);
  }
  if(img.complete && img.naturalWidth) start(); else img.addEventListener('load', start);
})();
