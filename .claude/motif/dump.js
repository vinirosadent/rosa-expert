/* Captura as chamadas de desenho do JS REAL (nao uma reimplementacao) e
 * despeja em JSON, para rasterizar e OLHAR. Sem isso a validacao fica so'
 * numerica e a legibilidade nunca e' verificada. */
const fs=require('fs');
const src=fs.readFileSync('/sessions/adoring-clever-albattani/mnt/rosa-expert/assets/js/news-hero-motif.js','utf8');
const W=1180,H=504;
let arcs=[],lines=[],fillC='#000',strokeC='#000',cur=[],mode=null;
const ctx={
  setTransform(){},clearRect(){arcs=[];lines=[];},
  beginPath(){cur=[];mode=null;},
  moveTo(x,y){cur.push(['m',x,y]);},
  lineTo(x,y){cur.push(['l',x,y]);},
  arc(x,y,r){cur.push(['a',x,y,r]);},
  stroke(){for(let i=0;i<cur.length-1;i++){if(cur[i][0]==='m'&&cur[i+1][0]==='l')lines.push([cur[i][1],cur[i][2],cur[i+1][1],cur[i+1][2],strokeC]);}cur=[];},
  fill(){for(const c of cur)if(c[0]==='a')arcs.push([c[1],c[2],c[3],fillC]);cur=[];},
  set fillStyle(v){fillC=v;}, get fillStyle(){return fillC;},
  set strokeStyle(v){strokeC=v;}, get strokeStyle(){return strokeC;},
  set lineWidth(v){}
};
/* HERO_H / TOPBAR_BOT / COPY_TOP / COPY_BOT (px, opcionais) fabricam
 * getBoundingClientRect para .na-topbar e .na-hero-copy, para exercitar
 * motivos com matchCopy (petri-paper). Sem eles host.querySelector nao
 * existe e o motor cai no fallback estatico (C.top/C.bottom) — o mesmo
 * caminho que roda de verdade em qualquer motivo sem matchCopy. */
const H2 = Number(process.env.HERO_H || H);
let host;
if (process.env.COPY_TOP) {
  const tb = { top: 0, bottom: Number(process.env.TOPBAR_BOT || 58) };
  const cp = { top: Number(process.env.COPY_TOP), bottom: Number(process.env.COPY_BOT || H2 - 20) };
  host = { getAttribute:()=>(process.env.MOTIF||'molar-pdl'), insertBefore(el){el.clientWidth=W;el.clientHeight=H2;}, firstChild:null,
    getBoundingClientRect:()=>({top:0,height:H2}),
    querySelector:(sel)=> sel==='.na-topbar'?{getBoundingClientRect:()=>tb} : sel==='.na-hero-copy'?{getBoundingClientRect:()=>cp} : null };
} else {
  host = {getAttribute:()=>(process.env.MOTIF||'molar-pdl'),insertBefore(el){el.clientWidth=W;el.clientHeight=H2;},firstChild:null};
}
global.document={querySelectorAll:()=>[host],createElement:()=>({getContext:()=>ctx,setAttribute(){},style:{}}),hidden:false};
global.window=global; global.matchMedia=()=>({matches:false}); global.devicePixelRatio=1;
global.addEventListener=()=>{}; delete global.IntersectionObserver; global.performance={now:()=>0};
let raf=null; global.requestAnimationFrame=f=>{raf=f;};
eval(src);
const t=Number(process.argv[2]||0);
raf(t);
fs.writeFileSync('/tmp/mot/frame.json',JSON.stringify({W,H,arcs,lines}));
console.log('t='+t,'arcs',arcs.length,'lines',lines.length);
