/* Verificacao numerica das TRES formas ao longo do ciclo. Sem browser
 * headless no sandbox: DOM e contexto 2D falsos, geometria medida. */
const fs=require('fs');
const src=fs.readFileSync('/sessions/adoring-clever-albattani/mnt/rosa-expert/assets/js/news-hero-motif.js','utf8');

function run(W,H,times){
  let drawn=[],ops=0,nan=0,raf=null;
  const ctx={setTransform(){},clearRect(){ },beginPath(){},moveTo(){},lineTo(){},
    stroke(){ops++;},fill(){ops++;},
    arc(x,y,r){if(!isFinite(x)||!isFinite(y)||!isFinite(r))nan++;drawn.push([x,y]);},
    set fillStyle(v){if(/NaN|undefined/.test(String(v)))nan++;},
    set strokeStyle(v){if(/NaN|undefined/.test(String(v)))nan++;},
    set lineWidth(v){}};
  const host={getAttribute:()=>(process.env.MOTIF||'molar-pdl'),insertBefore(el){el.clientWidth=W;el.clientHeight=H;},firstChild:null};
  global.document={querySelectorAll:()=>[host],createElement:()=>({getContext:()=>ctx,setAttribute(){},style:{}}),hidden:false};
  global.window=global; global.matchMedia=()=>({matches:false}); global.devicePixelRatio=2;
  global.addEventListener=()=>{}; delete global.IntersectionObserver;
  global.performance={now:()=>0};
  global.requestAnimationFrame=(fn)=>{raf=fn;};
  eval(src);
  const res=[];
  for(const t of times){ drawn=[];ops=0; raf(t);
    const xs=drawn.map(p=>p[0]),ys=drawn.map(p=>p[1]);
    res.push({t,n:drawn.length,x0:Math.min(...xs)/W*100,x1:Math.max(...xs)/W*100,
              y0:Math.min(...ys)/H*100,y1:Math.max(...ys)/H*100,ops,nan});
  }
  return res;
}
const span=5400;
const times=[0, 1300, 2700, 4000, 5000, span+1300, span+4000, span*2+1300, span*2+5000, span*3-1];
for(const [W,H,label] of [[1180,504,'desktop alto'],[1180,420,'desktop baixo'],[834,420,'tablet retrato']]){
  console.log('== '+label+' ==');
  for(const r of run(W,H,times)){
    const okx=r.x0>=48&&r.x1<=94, oky=r.y0>=24;
    console.log(`  t=${String(r.t).padStart(6)}ms  ${String(r.n).padStart(4)} pts  x ${r.x0.toFixed(1)}–${r.x1.toFixed(1)}% ${okx?'OK  ':'FORA'}  y ${r.y0.toFixed(1)}–${r.y1.toFixed(1)}% ${oky?'OK':'FORA'}  ops ${r.ops}  NaN ${r.nan}`);
  }
}
