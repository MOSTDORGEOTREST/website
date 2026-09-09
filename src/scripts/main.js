import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

(function(){

var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
var hasGsap = typeof gsap !== 'undefined';
var isTouch = matchMedia('(hover: none)').matches;
var isDesktop = innerWidth > 900;
if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (hasGsap) ScrollTrigger.config({ ignoreMobileResize:true });

/* ================= LENIS SMOOTH SCROLL ================= */
var lenis = null;
if (!reduced && typeof Lenis !== 'undefined'){
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
  window.__lenis = lenis;
  lenis.on('scroll', function(){ if (hasGsap) ScrollTrigger.update(); });
  if (hasGsap){
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
  } else {
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
}
document.querySelectorAll('[data-scroll]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id = a.getAttribute('href');
    if (!id || id[0] !== '#') return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    document.body.classList.remove('menu-open');
    var b = document.getElementById('burger'); if (b) b.setAttribute('aria-expanded','false');
    var ease = function(t){ return 1 - Math.pow(1-t, 4); };
    /* «Главная» = самый верх страницы: герой запинен ScrollTrigger'ом, поэтому целимся в 0, а не в элемент */
    if (id === '#hero') {
      if (lenis) lenis.scrollTo(0, { duration: 1.8, easing: ease });
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: ease });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
});

/* ================= HELPERS ================= */
function splitChars(el){
  var out = [];
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g,' ').trim());
  function doNode(node, amber){
    var words = node.textContent.split(/(\s+)/);
    words.forEach(function(w){
      if (/^\s+$/.test(w)) { out.push(document.createTextNode(' ')); return; }
      if (!w) return;
      var word = document.createElement('span'); word.className='word'; word.setAttribute('aria-hidden','true');
      for (var i=0;i<w.length;i++){
        var c = document.createElement('span'); c.className = 'char' + (amber?' h-amber':'');
        c.textContent = w[i]; word.appendChild(c);
      }
      out.push(word);
    });
  }
  Array.prototype.slice.call(el.childNodes).forEach(function(n){
    if (n.nodeType===3) doNode(n,false);
    else doNode(n, n.classList && n.classList.contains('h-amber'));
  });
  el.innerHTML=''; out.forEach(function(n){ el.appendChild(n); });
  return el.querySelectorAll('.char');
}
function pad(n){ return ('0'+n).slice(-2); }

/* ================= CURSOR ================= */
if (!isTouch && !reduced && hasGsap){
  var dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring');
  var dx = gsap.quickTo(dot,'x',{duration:.08,ease:'power2.out'}), dy = gsap.quickTo(dot,'y',{duration:.08,ease:'power2.out'});
  var rx = gsap.quickTo(ring,'x',{duration:.35,ease:'power3.out'}), ry = gsap.quickTo(ring,'y',{duration:.35,ease:'power3.out'});
  addEventListener('pointermove', function(e){ dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, {passive:true});
  document.addEventListener('pointerover', function(e){
    if (e.target.closest('#h-view')) { ring.classList.add('is-drag'); ring.classList.remove('is-link'); }
    else if (e.target.closest('a,button,.test-card')) { ring.classList.add('is-link'); ring.classList.remove('is-drag'); }
    else { ring.classList.remove('is-link','is-drag'); }
  }, {passive:true});
}

/* ================= WEBGL PLANET → DIVE SHADER ================= */
(function(){
  var cv = document.getElementById('gl'); if (!cv) return;
  var gl = cv.getContext('webgl', { antialias:false, alpha:false });
  var uScroll = { v: 0 }; window.__setEarthScroll = function(v){ uScroll.v = v; };
  window.__earthState = { mx:.5, my:.5, zoom:0 };
  if (!gl || reduced){ cv.style.background = 'radial-gradient(1000px 600px at 60% 40%, #0d1a2a, #0A0908 70%)'; return; }
  var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs = [
  'precision highp float;',
  'uniform vec2 uRes;uniform float uT;uniform vec2 uM;uniform float uS;uniform float uDpr;',
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
  ' return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}',
  /* быстрый хеш: четыре значения за один sin */
  'vec4 h4(vec2 p){vec4 q=vec4(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9)),dot(p,vec2(113.5,271.9)));return fract(sin(q)*43758.5453);}',
  /* одна звезда на ячейку: круглое ядро с гало, своя величина, цвет,
     фаза мерцания; при погружении вытягивается вдоль радиуса (rd) */
  'vec3 star(vec2 uv,vec2 rd,float dens,float thr,float radPx,float amp,float resY,float t,float stre,float twk){',
  ' vec2 p=uv*dens,id=floor(p),fq=fract(p);',
  ' vec4 a=h4(id),b=h4(id+17.3);',
  ' float occ=step(1.-thr,a.z);',
  ' vec2 e=fq-(vec2(.5)+(a.xy-.5)*.66);',
  ' vec2 ee=vec2(dot(e,rd)/stre,dot(e,vec2(-rd.y,rd.x)));',
  ' float dd=length(ee);',
  ' float mg=b.x;',
  ' float rad=radPx*uDpr*dens/resY*(.45+.55*mg);',
  ' float core=smoothstep(rad,0.,dd);',
  ' float halo=exp(-dd*dd/(rad*rad*10.))*.34;',
  ' float ph=b.y*6.2831,spd=.55+.45*b.z;',
  ' float tw=1.-twk*mg*(.5+.5*sin(t*spd*1.9+ph))*(.5+.5*sin(t*spd*.73+ph*2.3));',
  ' vec3 tint=mix(vec3(.78,.86,1.),vec3(1.,.85,.66),pow(b.w,3.));',
  ' return tint*(core+halo)*amp*(.16+.84*mg*mg)*tw*occ/pow(stre,.35);}',
  'void main(){',
  ' vec2 frag=gl_FragCoord.xy/uRes;',
  ' vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
  ' float zoom=clamp(uS,0.,1.);',
  ' vec2 par=(uM-.5)*vec2(.05,.04);',
  /* --- геометрия планеты считается первой: небу нужен её радиус --- */
  ' float aspect=uRes.x/uRes.y;',
  ' float portrait=step(aspect,.9);',
  /* в портрете планета делит экран с текстом: считаем полосу, которая
     остаётся над текстовым блоком, и вписываем шар в неё — иначе на
     коротких телефонах он наезжает на заголовок */
  ' float Hc=uRes.y/max(uDpr,.001);',
  ' float cUv=440./Hc;',
  /* пробуем зарезервировать полосу под надпись над планетой; если шар от
     этого становится мельче 95 px — надпись не показываем и место отдаём ему */
  ' float Wc=uRes.x/max(uDpr,.001);',
  ' float navPx=mix(86.,76.,step(Wc,600.));',
  ' float t1=(navPx+46.)/Hc;',
  ' float r1=min(.395*aspect,max(1.-cUv-t1,.14)*.5);',
  ' float tUv=mix(84./Hc,t1,step(95.,r1*Hc));',
  ' float band=max(1.-cUv-tUv,.14);',
  ' float Rp=min(.395*aspect,band*.5);',
  ' float R0=mix(.36,Rp,portrait);',
  ' vec2 base=mix(vec2(.36,-.02),vec2(0.,.5-(tUv+band*.5)),portrait);',
  ' vec2 c=mix(base,vec2(0.),smoothstep(0.,.65,zoom))+par;',
  ' float R=mix(R0,3.4,pow(zoom,1.7));',
  ' vec2 d=uv-c;',
  ' float r=length(d);',
  /* --- предрассветное небо: градиент плюс очень мягкая неоднородность --- */
  ' vec3 col=mix(vec3(.055,.07,.10),vec3(.027,.037,.061),clamp(uv.y+.5,0.,1.));',
  ' col+=vec3(.045,.062,.105)*(n(uv*2.2+7.7)-.5)*.5*(1.-zoom);',
  /* --- звёзды: три плана глубины; при погружении поле разлетается
         от центра планеты и вытягивается в штрихи --- */
  ' float warp=smoothstep(.02,.52,zoom);',
  ' float stre=1.+warp*14.;',
  ' float dl=max(r,1e-4); vec2 rdir=d/dl;',
  ' vec2 sw=c+d/(1.+warp*1.9);',
  ' float sfade=mix(.42,1.,smoothstep(-.52,.06,uv.y))*smoothstep(R+.015,R+.28,r)*(1.-smoothstep(.10,.56,zoom));',
  ' vec3 sky=star(sw+par*.22,rdir,122.,.042,.75,.62,uRes.y,uT,stre,.40)',
  '  +star(sw+par*.58,rdir,78.,.030,1.05,1.10,uRes.y,uT,stre,.50)',
  '  +star(sw+par*1.05,rdir,40.,.026,1.6,1.85,uRes.y,uT,stre,.58);',
  ' col+=sky*sfade;',
  /* --- редкий метеор: примерно раз в полминуты, живёт около двух секунд --- */
  ' vec4 mh=h4(vec2(floor(uT/9.),7.3));',
  ' float mtp=fract(uT/9.);',
  ' float mlife=smoothstep(0.,.04,mtp)*(1.-smoothstep(.05,.26,mtp));',
  ' vec2 mdir=normalize(vec2(mix(-.9,.9,mh.z),-.85));',
  ' vec2 mP=vec2(mix(-.75,.75,mh.x),mix(.18,.46,mh.y))+mdir*(mtp/.26)*.95;',
  ' vec2 mba=-mdir*.13,mpa=uv-mP;',
  ' float mhh=clamp(dot(mpa,mba)/dot(mba,mba),0.,1.);',
  ' float mdd=length(mpa-mba*mhh);',
  ' col+=vec3(1.,.95,.85)*exp(-mdd*mdd/2.2e-6)*(1.-mhh)*mlife*step(.62,mh.w)*(1.-zoom);',
  ' if(r<R){',
  '  vec2 q=d/R;',
  '  float z=sqrt(max(0.,1.-dot(q,q)));',
  '  vec3 nn=vec3(q,z);',
  '  float lon=atan(nn.x,nn.z)+uT*.085;',
  '  float lat=asin(clamp(nn.y,-1.,1.));',
  '  vec2 s=vec2(lon*1.15,lat*1.55);',
  '  float sc=mix(2.1,7.5,pow(zoom,1.4));',
  '  float f=fbm(s*sc+7.3);',
  '  float f2=fbm(s*sc*2.6+3.1);',
  '  float land=smoothstep(.505,.545,f);',
  '  vec3 ocean=mix(vec3(.025,.09,.17),vec3(.05,.17,.29),f2);',
  '  vec3 terra=mix(vec3(.12,.16,.07),vec3(.34,.26,.14),f2);',
  '  terra=mix(terra,vec3(.5,.46,.4),smoothstep(.72,.88,f));',
  '  vec3 surf=mix(ocean,terra,land);',
  '  surf=mix(surf,vec3(.78,.84,.9),smoothstep(.72,.92,abs(lat)/1.5708));',
  '  vec3 L=normalize(vec3(-.5,.38,.76));',
  '  float dif=max(dot(nn,L),0.);',
  '  float spec=pow(max(dot(reflect(-L,nn),vec3(0.,0.,1.)),0.),26.)*(1.-land)*.55;',
  '  float cl=smoothstep(.56,.76,fbm(s*sc*1.35+vec2(uT*.02,0.)+31.7))*(1.-zoom*.9);',
  '  surf=mix(surf,vec3(.92),cl*.7);',
  '  vec3 pc=surf*(.13+.95*dif)+spec;',
  /* --- градусная сетка знака: меридианы и параллели через 30 градусов --- */
  '  float gz=max(z,.02);',
  '  float qpx=1./max(R*uRes.y,1.);',
  '  float cl2=max(cos(lat),.02);',
  '  float gstep=.5235988;',
  '  float dLat=abs(fract(lat/gstep+.5)-.5)*gstep;',
  '  float gLon=sqrt(1.+(q.x*q.x*q.y*q.y)/(cl2*cl2*cl2*cl2))/gz;',
  '  float dLon=abs(fract(lon/gstep+.5)-.5)*gstep;',
  '  float lw=.9*uDpr*qpx;',
  '  float gA=(1.-smoothstep(0.,lw,dLat*cl2))*smoothstep(2.5,7.5,gstep*cl2/qpx/uDpr);',
  '  float gB=(1.-smoothstep(0.,lw,dLon/gLon))*smoothstep(2.5,7.5,gstep/gLon/qpx/uDpr);',
  '  float grid=max(gA,gB)*smoothstep(0.,.30,z)*(1.-smoothstep(0.,.34,zoom));',
  '  pc+=vec3(.365,.71,.522)*grid*(.05+.27*dif);',
  '  pc+=vec3(.9,.6,.22)*pow(1.-abs(dot(nn,L)),3.5)*.14;',
  '  pc=mix(pc,vec3(.3,.5,.85),pow(1.-z,3.)*.4*(1.-zoom));',
  '  col=mix(col,pc,smoothstep(0.,.012,R-r));',
  ' }',
  /* --- atmosphere halo --- */
  ' float halo=exp(-max(r-R,0.)*9./max(R,.4));',
  ' col+=vec3(.22,.42,.8)*halo*.4*(1.-zoom*.92)*step(R,r);',
  ' col+=vec3(.9,.62,.25)*exp(-max(r-R,0.)*30./max(R,.4))*.18*(1.-zoom)*step(R,r);',
  /* --- dive: punch through the surface and fly down through soil --- */
  ' float g=smoothstep(.56,.74,zoom);',
  ' if(g>0.){',
  '  float off=pow(smoothstep(.56,1.,zoom),1.6)*24.;',
  '  float settle=smoothstep(.86,1.,zoom);',
  '  float fly=fbm(vec2(frag.x*4.5+fbm(frag*2.3)*.7,(frag.y+off)*.5));',
  '  float fine=fbm(vec2(frag.x*2.6,(frag.y+off*.12)*3.2));',
  '  float mt=mix(fly,fine,settle);',
  '  vec3 c1=vec3(.44,.34,.24); vec3 c2=vec3(.33,.25,.17);',
  '  vec3 soil=mix(c2,c1,mt);',
  '  float band=sin((frag.y+off)*8.+mt*5.);',
  '  soil=mix(soil,vec3(.55,.42,.27),smoothstep(.7,.95,band)*(1.-settle)*.55);',
  '  soil=mix(soil,vec3(.24,.18,.12),smoothstep(.75,.98,sin((frag.y+off)*13.+3.))*(1.-settle)*.4);',
  '  float speck=step(.94,h(floor(frag*vec2(170.,95.)+vec2(0.,off*9.))));',
  '  soil=mix(soil,vec3(.2,.15,.09),speck*.45*settle);',
  '  float sl=off-frag.y*1.04;',
  '  float edge=smoothstep(0.,.14,sl);',
  '  col=mix(col,soil,g*edge);',
  '  col=mix(col,vec3(.2,.24,.13),smoothstep(.05,.0,abs(sl))*.85*(1.-settle));',
  ' }',
  ' if(false){',
  ' }',
  ' float grain=h(gl_FragCoord.xy+uT)*.05;',
  ' col+=grain-.024;',
  ' float vig=smoothstep(1.3,.35,length(uv));',
  ' col*=vig*.9+.14;',
  ' gl_FragColor=vec4(col,1.);}'
  ].join('\n');
  function sh(type,src){ var s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ return null; } return s; }
  var v=sh(gl.VERTEX_SHADER,vs), f=sh(gl.FRAGMENT_SHADER,fs);
  if(!v||!f){ cv.style.background='#0A0908'; return; }
  var pr=gl.createProgram(); gl.attachShader(pr,v); gl.attachShader(pr,f); gl.linkProgram(pr); gl.useProgram(pr);
  window.__earthOK = true;
  var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  var uRes=gl.getUniformLocation(pr,'uRes'), uT=gl.getUniformLocation(pr,'uT'), uM=gl.getUniformLocation(pr,'uM'), uS=gl.getUniformLocation(pr,'uS'), uDpr=gl.getUniformLocation(pr,'uDpr');
  var DPR=1;
  var mx=.5,my=.5,tmx=.5,tmy=.5;
  if(!isTouch) addEventListener('pointermove',function(e){ tmx=e.clientX/innerWidth; tmy=1-e.clientY/innerHeight; },{passive:true});
  function resize(){ var d=Math.min(devicePixelRatio||1,1.6); DPR=d;
    cv.width=cv.clientWidth*d; cv.height=cv.clientHeight*d; gl.viewport(0,0,cv.width,cv.height); }
  resize(); addEventListener('resize',resize);
  var t0=performance.now();
  (function frame(){
    requestAnimationFrame(frame);
    /* рендерим, пока герой в кадре (пин ~3.3 экрана + запас) */
    if(scrollY > innerHeight*4.6) return;
    mx+=(tmx-mx)*.05; my+=(tmy-my)*.05;
    window.__earthState.mx=mx; window.__earthState.my=my; window.__earthState.zoom=uScroll.v;
    gl.uniform2f(uRes,cv.width,cv.height);
    gl.uniform1f(uT,(performance.now()-t0)/1000);
    gl.uniform2f(uM,mx,my);
    gl.uniform1f(uS,uScroll.v);
    gl.uniform1f(uDpr,DPR);
    gl.drawArrays(gl.TRIANGLES,0,3);
  })();
})();

/* ================= GLOBE MARK — приборный слой знака на планете =================
   Кольцо с азимутальной шкалой, надпись МОСТДОРГЕОТРЕСТ по дуге и скрещённые
   молотки-печать. Слой привязан к спроецированной окружности планеты: центр,
   радиус, параллакс мыши и зум при погружении считаются по той же формуле,
   что и в шейдере, поэтому знак «сидит» на планете при любом ресайзе.        */
(function(){
  var svg = document.getElementById('globe-mark');
  var cv  = document.getElementById('gl');
  if(!svg || !cv) return;
  /* без WebGL планеты нет — знаку не на чем сидеть */
  if(reduced || !window.__earthOK){ if(svg.parentNode) svg.parentNode.removeChild(svg); return; }

  var A0 = -30, A1 = 120;        /* окно дуги: от «11 часов» вправо и вниз */
  var TXT = 46;                  /* центр надписи по дуге */
  var G = null, fitG = null;

  function pt(r,a){ var t=a*Math.PI/180; return [r*Math.sin(t), -r*Math.cos(t)]; }
  function f(n){ return (Math.round(n*100)/100); }
  function arc(r,a0,a1){
    var p0=pt(r,a0), p1=pt(r,a1);
    return 'M'+f(p0[0])+' '+f(p0[1])+'A'+f(r)+' '+f(r)+' 0 '+((a1-a0)>180?1:0)+' 1 '+f(p1[0])+' '+f(p1[1]);
  }
  function smooth(a,b,x){ x=(x-a)/(b-a); x=x<0?0:(x>1?1:x); return x*x*(3-2*x); }

  /* геометрия планеты — зеркало формул фрагментного шейдера */
  function geom(){
    var W=cv.clientWidth, H=cv.clientHeight;
    if(!W||!H) return null;
    var aspect=W/H, portrait=aspect<=0.9;
    var navPx=W<=600?76:86;                 /* высота шапки: логотип 44 или 54 + 2x16 */
    var cUv=440/H, t1=(navPx+46)/H;
    var r1=Math.min(0.395*aspect, Math.max(1-cUv-t1,0.14)*0.5);
    var cap=r1*H>=95;                       /* хватает ли места на надпись */
    var tUv=cap?t1:84/H;
    var band=Math.max(1-cUv-tUv,0.14);
    var Rp=Math.min(0.395*aspect, band*0.5);
    var R0=portrait?Rp:0.36;
    var bx=portrait?0:0.36, by=portrait?(0.5-(tUv+band*0.5)):-0.02;
    return { W:W, H:H, portrait:portrait, cap:cap, R0uv:R0, R0:R0*H, cx:W/2+bx*H, cy:H/2-by*H };
  }

  /* Портрет: дуге со шкалой места нет, поэтому знак сплющивается в подпись
     над планетой — тот же моношрифт с широким трекингом, что и на дуге,
     с двумя волосяными линиями, растворяющимися к краям, и северным штрихом. */
  function buildPortrait(g){
    var Rl=g.R0;
    if(!g.cap) return false;
    var fs=Math.max(9.5, Math.min(12.5, Rl*0.072));
    var base=-(Rl+14);
    svg.setAttribute('viewBox','0 0 '+g.W+' '+g.H);
    svg.innerHTML=
      '<g id="gm-fit">'+
        '<text class="gm-word gm-word--flat" x="0" y="'+f(base)+'" text-anchor="middle" '+
          'style="font-size:'+f(fs)+'px;letter-spacing:'+f(fs*0.42)+'px">МОСТДОРГЕОТРЕСТ</text>'+
        '<path class="gm-tick gm-north" d="M0 '+f(base+7)+'L0 '+f(base+15)+'"/>'+
      '</g>';
    fitG=svg.querySelector('#gm-fit');
    var tx=fitG.querySelector('text');
    var half=(tx.getComputedTextLength?tx.getComputedTextLength():fs*9)/2;
    var len=Math.min(46, Rl-half-18);
    if(len>=14){
      var y=f(base-fs*0.32), x1=f(-(half+12)), x2=f(-(half+12+len));
      var NS='http://www.w3.org/2000/svg';
      var gr=document.createElementNS(NS,'linearGradient');
      gr.setAttribute('id','gm-fade'); gr.setAttribute('gradientUnits','userSpaceOnUse');
      gr.setAttribute('x1',x2); gr.setAttribute('x2',x1); gr.setAttribute('y1',y); gr.setAttribute('y2',y);
      gr.innerHTML='<stop offset="0" stop-color="rgb(93,181,133)" stop-opacity="0"/>'+
                   '<stop offset="1" stop-color="rgb(93,181,133)" stop-opacity=".55"/>';
      var defs=document.createElementNS(NS,'defs'); defs.appendChild(gr);
      svg.insertBefore(defs,fitG);
      var d='M'+x2+' '+y+'L'+x1+' '+y;
      fitG.insertAdjacentHTML('afterbegin',
        '<path class="gm-cap-line" d="'+d+'"/>'+
        '<g transform="scale(-1,1)"><path class="gm-cap-line" d="'+d+'"/></g>');
    }
    return true;
  }

  function build(g){
    var Rl=g.R0, rRing=Rl*1.13, rText=Rl*1.04;
    var fs=Math.max(12, Math.min(17, Rl*0.048));
    /* на узких экранах планета уходит за правый край — укорачиваем дугу,
       чтобы надпись и печать не обрезались окном */
    var fit=(g.W-34-g.cx)/rRing;
    var A1e=fit>=1 ? A1 : Math.asin(Math.max(-1,Math.min(1,fit)))*180/Math.PI;
    A1e=Math.min(A1, A1e);
    if(A1e<55) return false;
    var TXTe=Math.min(TXT, A1e-26);
    var ticks='', majors='';
    for(var a=A0; a<=A1e+0.01; a+=5){
      var major=Math.abs(a%30)<0.01, len=major?10:5;
      var p1=pt(rRing,a), p2=pt(rRing-len,a);
      var d='M'+f(p1[0])+' '+f(p1[1])+'L'+f(p2[0])+' '+f(p2[1]);
      if(major) majors+=d; else ticks+=d;
    }
    svg.setAttribute('viewBox','0 0 '+g.W+' '+g.H);
    svg.innerHTML=
      '<defs><path id="gm-arc" fill="none" d="'+arc(rText,TXTe-42,TXTe+42)+'"/></defs>'+
      '<g id="gm-fit">'+
        '<path class="gm-ring gm-glow" d="'+arc(rRing,A0,A1e)+'"/>'+
        '<path class="gm-ring" d="'+arc(rRing,A0,A1e)+'"/>'+
        '<path class="gm-tick" d="'+ticks+'"/>'+
        '<path class="gm-tick gm-tick--maj" d="'+majors+'"/>'+
        '<text class="gm-word" style="font-size:'+f(fs)+'px;letter-spacing:'+f(fs*0.55)+'px">'+
          '<textPath href="#gm-arc" startOffset="50%" text-anchor="middle">МОСТДОРГЕОТРЕСТ</textPath>'+
        '</text>'+
      '</g>';
    fitG=svg.querySelector('#gm-fit');
    return true;
  }

  function layout(){
    var g=geom();
    if(!g){ svg.style.display='none'; return; }
    /* портрет — плоская подпись над планетой; ландшафт узкого экрана
       не тянет ни то, ни другое: там роль знака берёт сетка на сфере */
    var ok = g.portrait ? buildPortrait(g) : (g.W>900 && build(g));
    if(!ok){ svg.style.display='none'; G=null; return; }
    svg.style.display='';
    G=g;
  }

  layout();
  addEventListener('resize',layout);

  var lastT='';
  (function frame(){
    requestAnimationFrame(frame);
    if(!G||!fitG) return;
    if(scrollY > innerHeight*4.6) return;
    var st=window.__earthState;
    var zoom=Math.max(0,Math.min(1,st.zoom));
    /* портретная подпись стоит вплотную к шапке: при зуме она уезжает вверх,
       поэтому гаснет раньше, чем успевает дойти до логотипа */
    var op=G.portrait ? 1-smooth(0.008,0.055,zoom) : 1-smooth(0.015,0.13,zoom);
    var Ruv=G.R0uv+(3.4-G.R0uv)*Math.pow(zoom,1.7);
    var x=G.cx+(st.mx-0.5)*0.05*G.H;
    var y=G.cy-(st.my-0.5)*0.04*G.H;
    var t='translate('+f(x)+' '+f(y)+') scale('+(Math.round(Ruv/G.R0uv*1000)/1000)+')';
    if(t!==lastT){ fitG.setAttribute('transform',t); lastT=t; }
    fitG.style.opacity=op<0.002?0:(Math.round(op*1000)/1000);
  })();
})();

/* ================= FEM MESH CANVAS ================= */
(function(){
  var cv=document.getElementById('mesh-canvas'); if(!cv)return;
  var ctx=cv.getContext('2d'); var W,H,t=0,run=true;
  function rs(){ var d=Math.min(devicePixelRatio||1,2); W=cv.clientWidth; H=cv.clientHeight; cv.width=W*d; cv.height=H*d; ctx.setTransform(d,0,0,d,0,0); }
  rs(); addEventListener('resize',rs);
  new IntersectionObserver(function(en){ run=en[0].isIntersecting; }).observe(cv);
  var C=13,R=11;
  (function fr(){
    requestAnimationFrame(fr); if(!run)return; if(!reduced)t+=.012;
    ctx.clearRect(0,0,W,H);
    var pad=26,gw=(W-pad*2)/(C-1),gh=(H-pad*2)/(R-1),pts=[];
    for(var r=0;r<R;r++){pts[r]=[];for(var c=0;c<C;c++){
      var d=r/(R-1),load=Math.sin(t+c*.55)*Math.cos(t*.7+r*.4);
      pts[r][c]={x:pad+c*gw+Math.sin(t*.8+r*.6)*3*(1-d),y:pad+r*gh+load*7*(1-d),s:Math.abs(load)*(1-d)};}}
    function ln(a,b,s){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle=s>.45?'rgba(166,106,20,'+(.35+s*.5)+')':'rgba(34,26,14,'+(.1+s*.22)+')';ctx.lineWidth=1;ctx.stroke();}
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){var p=pts[r][c];
      if(c<C-1)ln(p,pts[r][c+1],p.s); if(r<R-1)ln(p,pts[r+1][c],p.s); if(c<C-1&&r<R-1)ln(p,pts[r+1][c+1],p.s*.7);}
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){var p=pts[r][c];
      if(p.s>.5){ctx.beginPath();ctx.arc(p.x,p.y,1.8,0,6.283);ctx.fillStyle='rgba(166,106,20,.95)';ctx.fill();}}
  })();
})();

/* ================= SOIL PARTICLES ================= */
(function(){
  function rnd(a,b){ return a+Math.random()*(b-a); }
  var makers={
    humus:function(el){ var r=Math.random();
      if(r<.6){ el.dataset.k='clump'; st(el,{width:rnd(7,18)+'px',height:rnd(5,12)+'px',borderRadius:'54% 46% 48% 52%',background:'radial-gradient(circle at 35% 30%, rgba(90,64,38,.55), rgba(30,20,10,.5))',transform:'rotate('+rnd(0,180)+'deg)'}); }
      else if(r<.85){ el.dataset.k='root'; st(el,{width:'1.5px',height:rnd(34,100)+'px',background:'linear-gradient(180deg,rgba(38,26,12,.6),transparent)',transform:'rotate('+rnd(-22,22)+'deg)',borderRadius:'2px',transformOrigin:'top center'}); }
      else { st(el,{width:rnd(3,5)+'px',height:rnd(3,5)+'px',borderRadius:'50%',background:'rgba(235,203,156,'+rnd(.25,.45)+')'}); } },
    loam:function(el){ el.dataset.k='pebble'; st(el,{width:rnd(9,30)+'px',height:rnd(7,20)+'px',borderRadius:'46% 54% 52% 48%',
      background:'radial-gradient(circle at 34% 28%, rgba(190,140,80,.6), rgba(80,50,20,.55))',
      boxShadow:'inset 0 -2px 4px rgba(0,0,0,.25)',transform:'rotate('+rnd(0,180)+'deg)'}); },
    sand:function(el){ var s=rnd(2.5,6);
      st(el,{width:s+'px',height:s+'px',borderRadius:'50%',
      background:'radial-gradient(circle at 35% 30%, rgba(255,248,214,'+rnd(.6,.9)+'), rgba(170,128,60,'+rnd(.25,.45)+'))'}); },
    frost:function(el){ var r=Math.random();
      if(r<.42){ /* ледяные шлиры — горизонтальные линзы */
        el.dataset.k='lens';
        st(el,{width:rnd(46,170)+'px',height:rnd(3,7)+'px',borderRadius:'99px',
        background:'linear-gradient(90deg, transparent, rgba(255,255,255,'+rnd(.5,.75)+'), transparent)'}); }
      else if(r<.72){ /* кристаллы */
        el.dataset.k='crystal';
        st(el,{width:rnd(10,26)+'px',height:rnd(12,30)+'px',
        clipPath:'polygon(50% 0%, 100% '+rnd(30,45)+'%, '+rnd(60,85)+'% 100%, '+rnd(15,40)+'% 100%, 0% '+rnd(30,45)+'%)',
        background:'linear-gradient(180deg, rgba(255,255,255,.8), rgba(190,226,255,.25))',transform:'rotate('+rnd(-30,30)+'deg)'}); }
      else { /* иней */
        el.dataset.k='sparkle';
        st(el,{width:rnd(1.5,3.5)+'px',height:rnd(1.5,3.5)+'px',borderRadius:'50%',
        background:'rgba(255,255,255,'+rnd(.55,.9)+')',boxShadow:'0 0 '+rnd(4,9)+'px rgba(255,255,255,.75)'}); } },
    rock:function(el){ var r=Math.random();
      if(r<.5){ /* крупные гранёные блоки */
        st(el,{width:rnd(36,130)+'px',height:rnd(26,86)+'px',
        clipPath:'polygon('+rnd(0,14)+'% '+rnd(24,44)+'%, '+rnd(32,56)+'% 0%, 100% '+rnd(14,38)+'%, '+rnd(82,96)+'% '+rnd(78,96)+'%, '+rnd(16,36)+'% 100%)',
        background:'linear-gradient('+rnd(100,160)+'deg, rgba(255,255,255,.2), rgba(40,42,48,.3) 65%)',
        transform:'rotate('+rnd(0,180)+'deg)'}); }
      else if(r<.8){ /* трещины */
        el.dataset.k='crack';
        st(el,{width:rnd(50,150)+'px',height:'1.5px',background:'linear-gradient(90deg, transparent, rgba(28,30,36,'+rnd(.4,.6)+'), transparent)',transform:'rotate('+rnd(-45,45)+'deg)',transformOrigin:'left center'}); }
      else { st(el,{width:rnd(8,18)+'px',height:rnd(6,14)+'px',
        clipPath:'polygon(20% 40%, 55% 0%, 100% 30%, 80% 100%, 10% 88%)',
        background:'rgba(240,242,246,.28)',transform:'rotate('+rnd(0,180)+'deg)'}); } },
    aqua:function(el){ var r=Math.random();
      if(r<.62){ el.dataset.k='bubble'; var s=rnd(5,16); st(el,{width:s+'px',height:s+'px',borderRadius:'50%',
        border:'1px solid rgba(210,255,232,.4)',
        background:'radial-gradient(circle at 32% 26%, rgba(255,255,255,.55), rgba(255,255,255,.05) 48%, transparent 72%)'}); }
      else { el.dataset.k='flow'; st(el,{width:rnd(60,190)+'px',height:'1.5px',borderRadius:'99px',
        background:'linear-gradient(90deg, transparent, rgba(200,255,230,.32), transparent)'}); } }
  };
  function st(el,obj){ for(var k in obj) el.style[k]=obj[k]; }
  document.querySelectorAll('.stratum').forEach(function(strat){
    var type=strat.getAttribute('data-soil'), box=strat.querySelector('.st-particles');
    if(!type||!box||!makers[type]) return;
    var n = type==='sand' ? 110 : (type==='frost' ? 52 : 38);
    for(var i=0;i<n;i++){
      var el=document.createElement('i');
      el.style.left=(Math.random()*100)+'%';
      el.style.top=(9+Math.random()*89)+'%';
      makers[type](el);
      box.appendChild(el);
    }
  });
  /* ---- живые анимации слоёв: у каждой лаборатории своя ---- */
  if(typeof gsap!=='undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var q=function(soil,k){ return gsap.utils.toArray('.stratum[data-soil="'+soil+'"] [data-k="'+k+'"]'); };

    /* 01 Физика · почва: корни медленно прорастают, комки едва дышат */
    q('humus','root').forEach(function(el){
      gsap.fromTo(el,{scaleY:.25,opacity:.4},{scaleY:1,opacity:1,duration:rnd(5,9),ease:'power1.inOut',
        repeat:-1,yoyo:true,repeatDelay:rnd(1,4),delay:rnd(0,6)});
    });

    /* 02 Механика · суглинок: консолидация — галька медленно оседает и приподнимается */
    q('loam','pebble').forEach(function(el,i){
      if(i%2) return;
      gsap.to(el,{y:'+='+rnd(3,7),duration:rnd(4,8),ease:'power1.inOut',repeat:-1,yoyo:true,delay:rnd(0,5)});
    });

    /* 03 Динамика · песок: сейсмо-дрожь 0.5 Гц (период 2 с) */
    var dyn=document.querySelector('.stratum[data-soil="sand"]');
    if(dyn){
      gsap.to(dyn.querySelector('.st-band'),{x:5,duration:1,ease:'sine.inOut',yoyo:true,repeat:-1});
      gsap.to(dyn.querySelector('.st-particles'),{x:-6,y:2.5,duration:1,ease:'sine.inOut',yoyo:true,repeat:-1});
      gsap.to(dyn.querySelector('.st-in'),{x:2.5,duration:1,ease:'sine.inOut',yoyo:true,repeat:-1});
    }

    /* 04 Мерзлота: линзы льда вспыхивают холодным глинтом, кристаллы дышат,
       иней искрится, вдоль слоя плывёт позёмка, с линз капает оттаивание */
    q('frost','lens').forEach(function(el){
      gsap.to(el,{opacity:rnd(.5,.78),scaleX:rnd(1.05,1.14),duration:rnd(2,4),ease:'sine.inOut',repeat:-1,yoyo:true,delay:rnd(0,3)});
      /* редкий яркий глинт по льду */
      gsap.timeline({repeat:-1,repeatDelay:rnd(3,8),delay:rnd(0,7)})
        .to(el,{filter:'brightness(2.3)',duration:.22,ease:'power2.in'})
        .to(el,{filter:'brightness(1)',duration:.65,ease:'power2.out'});
    });
    q('frost','crystal').forEach(function(el){
      gsap.to(el,{scale:rnd(1.08,1.2),rotation:'+='+rnd(-9,9),duration:rnd(2.5,5),ease:'sine.inOut',repeat:-1,yoyo:true,delay:rnd(0,4)});
    });
    q('frost','sparkle').forEach(function(el,i){
      gsap.to(el,{opacity:rnd(.15,.4),duration:rnd(1.2,2.8),ease:'sine.inOut',repeat:-1,yoyo:true,delay:rnd(0,3)});
      /* каждый третий — редкая яркая вспышка */
      if(i%3===0) gsap.timeline({repeat:-1,repeatDelay:rnd(3,9),delay:rnd(0,8)})
        .to(el,{scale:rnd(1.8,2.6),opacity:1,duration:.22,ease:'power2.out'})
        .to(el,{scale:1,duration:.55,ease:'power2.in'});
    });
    var frostBox=document.querySelector('.stratum[data-soil="frost"] .st-particles');
    if(frostBox){
      /* позёмка: холодная дымка медленно плывёт вдоль горизонта */
      for(var fi=0;fi<4;fi++){
        var mist=document.createElement('i');
        mist.style.cssText='position:absolute;left:'+rnd(0,75)+'%;top:'+rnd(15,80)+'%;width:'+rnd(160,320)+'px;height:'+rnd(26,54)+'px;border-radius:50%;background:radial-gradient(closest-side,rgba(235,248,255,.17),transparent 70%);filter:blur(10px);pointer-events:none';
        frostBox.appendChild(mist);
        gsap.to(mist,{x:'+='+rnd(70,150),duration:rnd(7,13),ease:'sine.inOut',repeat:-1,yoyo:true,delay:rnd(0,5)});
        gsap.to(mist,{opacity:rnd(.35,.7),duration:rnd(3,6),ease:'sine.inOut',repeat:-1,yoyo:true});
      }
      q('frost','lens').slice(0,10).forEach(function(lens){
        var d=document.createElement('i');
        d.style.cssText='position:absolute;width:3px;height:5px;border-radius:50% 50% 60% 60%;background:rgba(215,240,255,.9);left:'+(parseFloat(lens.style.left)+rnd(0,3))+'%;top:'+lens.style.top+';opacity:0';
        frostBox.appendChild(d);
        gsap.timeline({repeat:-1,repeatDelay:rnd(1.5,5),delay:rnd(0,5)})
          .set(d,{y:0,opacity:0})
          .to(d,{opacity:.95,duration:.25})
          .to(d,{y:rnd(80,170),duration:rnd(.7,1.2),ease:'power2.in'},'<')
          .to(d,{opacity:0,duration:.25},'-=.2');
      });
    }

    /* 05 Скала: трещины прорастают рывками; на разрыве — микротолчок слоя
       и осыпь мелких обломков, затем трещина затягивается */
    var rockBox=document.querySelector('.stratum[data-soil="rock"] .st-particles');
    var tremorBusy=false;
    function rockTremor(){
      if(tremorBusy||!rockBox)return; tremorBusy=true;
      gsap.fromTo(rockBox,{x:0},{x:3,duration:.05,repeat:5,yoyo:true,ease:'sine.inOut',
        onComplete:function(){ gsap.set(rockBox,{x:0}); tremorBusy=false; }});
    }
    function rockDebris(src){
      if(!rockBox)return;
      var n=2+Math.floor(Math.random()*2);
      for(var di=0;di<n;di++){
        var d=document.createElement('i');
        var s=rnd(3,7);
        d.style.cssText='position:absolute;left:'+(parseFloat(src.style.left)+rnd(-2,5))+'%;top:'+src.style.top+';width:'+s+'px;height:'+(s*.8)+'px;clip-path:polygon(20% 40%,55% 0%,100% 30%,80% 100%,10% 88%);background:rgba(226,229,236,.55);pointer-events:none';
        rockBox.appendChild(d);
        gsap.to(d,{y:rnd(60,150),x:rnd(-16,16),rotation:rnd(-170,170),opacity:0,duration:rnd(.9,1.6),ease:'power2.in',
          onComplete:(function(el){ return function(){ el.remove(); }; })(d)});
      }
    }
    q('rock','crack').forEach(function(el){
      gsap.timeline({repeat:-1,repeatDelay:rnd(3,8),delay:rnd(0,8)})
        .fromTo(el,{scaleX:0,opacity:1},{scaleX:1,duration:rnd(.5,.9),ease:'steps(6)'}) /* рывками, как настоящий разрыв */
        .add(function(){ rockTremor(); rockDebris(el); })
        .to(el,{opacity:0,duration:1.3,ease:'power1.in'},'+='+rnd(2,5))
        .set(el,{scaleX:0,opacity:1});
    });

    /* 06 Химия · водоносный: пузырьки всплывают, течение дрейфует */
    q('aqua','bubble').forEach(function(el){
      gsap.timeline({repeat:-1,repeatDelay:rnd(.5,3),delay:rnd(0,5)})
        .fromTo(el,{y:rnd(10,30),opacity:0},{opacity:.9,duration:.6})
        .to(el,{y:'-='+rnd(50,130),x:'+='+rnd(-14,14),duration:rnd(4,8),ease:'sine.inOut'},'<')
        .to(el,{opacity:0,duration:.8},'-=.8');
    });
    q('aqua','flow').forEach(function(el){
      gsap.to(el,{x:'+='+rnd(20,50),duration:rnd(4,7),ease:'sine.inOut',repeat:-1,yoyo:true,delay:rnd(0,4)});
    });
  }
})();

/* ================= NAV / MENU ================= */
var nav=document.getElementById('nav');
addEventListener('scroll',function(){ nav.classList.toggle('scrolled', scrollY>40); },{passive:true});

/* ================= ВЫКЛЮЧКА ПОДПИСИ БРЕНДА =================
   «геотехническая лаборатория» набирается разрядкой так, чтобы её правый край
   встал ровно под правым краем «МОСТДОРГЕОТРЕСТ». Кегли и гарнитуры у строк
   разные, поэтому трекинг считается по факту, а не подбирается в CSS. */
(function(){
  var ttl=document.querySelector('.nav-brand .nb b');
  var sub=document.querySelector('.nav-brand .nb > span');
  if(!ttl||!sub) return;
  function textW(el){
    var r=document.createRange(); r.selectNodeContents(el);
    return r.getBoundingClientRect().width;
  }
  function fit(){
    sub.style.letterSpacing='0px';
    var w0=textW(sub), target=textW(ttl);
    if(!w0||!target) return;
    sub.style.letterSpacing='10px';
    var n=(textW(sub)-w0)/10;          /* сколько раз браузер добавит трекинг */
    if(!(n>1)){ sub.style.letterSpacing=''; return; }
    /* последняя добавка висит за последней буквой и в выключку не входит */
    var ls=(target-w0)/(n-1);
    sub.style.letterSpacing=(ls>0?Math.round(ls*1000)/1000:0)+'px';
  }
  fit();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit).catch(function(){});
  var t; addEventListener('resize',function(){ clearTimeout(t); t=setTimeout(fit,120); },{passive:true});
})();
var burger=document.getElementById('burger');
burger.addEventListener('click',function(){
  var open=document.body.classList.toggle('menu-open');
  burger.setAttribute('aria-expanded',open);
});

/* ================= PRICE MODAL ================= */
(function(){
  var modal=document.getElementById('price-modal'); if(!modal) return;
  var card=document.getElementById('pm-card'), frame=document.getElementById('pm-frame');
  var scrim=modal.querySelector('.pm-scrim');
  var lastFocus=null, isOpen=false;
  function openM(e){
    if(e) e.preventDefault();
    if(isOpen) return; isOpen=true;
    lastFocus=document.activeElement;
    if(frame && !frame.src){
      frame.src=frame.getAttribute('data-src');
      var w=document.getElementById('pm-wait');
      frame.addEventListener('load',function(){ if(w) w.classList.add('off'); },{once:true});
      setTimeout(function(){ if(w) w.classList.add('off'); },12000);
    }
    modal.hidden=false;
    document.body.style.overflow='hidden';
    if(lenis) lenis.stop();
    if(hasGsap && !reduced){
      gsap.fromTo(scrim,{opacity:0},{opacity:1,duration:.35,ease:'power2.out'});
      gsap.fromTo(card,{y:46,scale:.96,opacity:0},{y:0,scale:1,opacity:1,duration:.55,ease:'expo.out'});
    }
    var cb=modal.querySelector('.pm-close'); if(cb) cb.focus();
  }
  function closeM(){
    if(!isOpen) return; isOpen=false;
    function done(){ modal.hidden=true; document.body.style.overflow=''; if(lenis) lenis.start(); if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
    if(hasGsap && !reduced){
      gsap.to(scrim,{opacity:0,duration:.28,ease:'power1.in'});
      gsap.to(card,{y:30,scale:.97,opacity:0,duration:.3,ease:'power2.in',onComplete:done});
    } else done();
  }
  document.querySelectorAll('[data-price-open]').forEach(function(b){ b.addEventListener('click', openM); });
  modal.querySelectorAll('[data-price-close]').forEach(function(b){ b.addEventListener('click', closeM); });
  addEventListener('keydown', function(e){ if(e.key==='Escape') closeM(); });
})();

/* ================= PRELOADER: запуск фильма по реальной загрузке ================= */
var introDone=false;
function startFilm(){
  if(introDone)return; introDone=true;
  var loader=document.getElementById('loader');
  if(!loader){ heroIn(true); return; }
  if(!hasGsap||reduced){ loader.style.display='none'; heroIn(true); return; }
  var tl=gsap.timeline();
  tl.to('#loader .ld-top, #loader .ld-name, #loader .ld-bottom',{opacity:0,y:-16,duration:.4,ease:'power2.in',stagger:.05})
    .to('#loader .curtain i',{yPercent:-101,duration:.85,ease:'expo.inOut',stagger:.06},'-=.1')
    .set(loader,{display:'none'})
    .add(function(){ heroIn(false); },'-=.75');
}
var loaderEl=document.getElementById('loader');
if(loaderEl){
  if(window.__ldFinished){ startFilm(); }
  else { addEventListener('mdgt:loaded', startFilm, {once:true}); setTimeout(startFilm, 9000); }
} else { startFilm(); }

/* ================= HERO ENTRANCE + PIN ================= */
var counted=false;
function counters(){
  if(counted)return; counted=true;
  document.querySelectorAll('[data-count]').forEach(function(el){
    var t=parseFloat(el.getAttribute('data-count')), suf=el.getAttribute('data-suffix')||'';
    if(!hasGsap||reduced){ el.textContent=t+suf; return; }
    var o={v:0};
    gsap.to(o,{v:t,duration:1.8,ease:'power2.out',onUpdate:function(){ el.textContent=Math.round(o.v)+suf; }});
  });
}
function heroIn(instant){
  document.body.classList.add('is-ready');
  var titleEl=document.getElementById('hero-h');
  if(instant||!titleEl){ counters(); return; }
  var chars=splitChars(titleEl);
  gsap.timeline()
    .from('.nav',{y:-28,opacity:0,duration:.7,ease:'power3.out'},0)
    .from('.hero-tag',{y:16,opacity:0,duration:.5,ease:'power3.out'},.1)
    .from(chars,{yPercent:118,rotateX:-45,duration:.85,stagger:.018,ease:'expo.out'},.15)
    .from('.hero-sub',{y:20,opacity:0,duration:.6,ease:'power3.out'},.55)
    .from('.hf-left .btn',{y:18,opacity:0,duration:.5,ease:'power3.out'},.62)
    .from('.hero-metrics .hm',{y:22,opacity:0,duration:.55,stagger:.09,ease:'power3.out',onComplete:counters},.65)
    .from('.hero-scroll',{opacity:0,duration:.5},.9);
}

if(hasGsap && !reduced){

/* ---- глубиномер: откалиброван по реальным горизонтам разреза ----
   0–2 / 2–8 / 8–16 / 16–24 / 24–36 / 36–48 м. Цель задаётся пинами,
   отображение сглаживается в rAF (dt-нормированный lerp) — без скачков
   и мёртвых зон между пином героя и пином разреза. */
var hd=document.getElementById('hd-num'), rf=document.getElementById('r-fill');
var D_TOPS=[0,2,8,16,24,36], D_BOTS=[2,8,16,24,36,48];
var D_MIDS=D_TOPS.map(function(t,i){ return (t+D_BOTS[i])/2; }); /* 1,5,12,20,30,42 */
var depthTarget=0;
function setDepth(v){ depthTarget=v; }
if(hd){
  (function(){
    var shown=0, last=-1, t0=performance.now();
    (function loop(now){
      requestAnimationFrame(loop);
      var dt=Math.min(Math.max(now-t0,1),120); t0=now;
      shown+=(depthTarget-shown)*(1-Math.exp(-dt/150));
      if(Math.abs(shown-depthTarget)<.02) shown=depthTarget;
      if(Math.abs(shown-last)<.01) return;
      last=shown;
      hd.textContent='−'+shown.toFixed(1)+' м';
    })(t0);
  })();
}

/* hero pin: camera starts descending */
ScrollTrigger.matchMedia({
  '(min-width: 901px)': function(){
    if(!document.getElementById('hero')) return;
    var heroTl=gsap.timeline({
      scrollTrigger:{ trigger:'#hero', start:'top top', end:'+=230%', scrub:.6, pin:true,
        onUpdate:function(self){
          if(window.__setEarthScroll) window.__setEarthScroll(self.progress);
          /* глубина тикает только после касания грунта (~56% пина):
             к концу пролёта камера — в толще первого горизонта (~1 м) */
          setDepth(Math.max(0,(self.progress-.56)/.44)*D_MIDS[0]);
        } }
    });
    heroTl.to('#hero-content',{yPercent:-40,opacity:0,ease:'power1.in',duration:.4},0)
      .to('.hero-foot',{yPercent:60,opacity:0,ease:'power1.in',duration:.35},0)
      .to('.hero-scroll',{opacity:0,duration:.2},0);
  },
  '(max-width: 900px) and (orientation: portrait)': function(){
    /* та же хореография, что на десктопе: герой пинится с самого верха,
       планета приближается ровно по прокрутке и уходит в грунт. Ход короче —
       на телефоне это большой палец, а не колесо мыши */
    if(!document.getElementById('hero')) return;
    var mTl=gsap.timeline({
      scrollTrigger:{ trigger:'#hero', start:'top top', end:'+=170%', scrub:.5, pin:true, anticipatePin:1,
        onUpdate:function(self){
          if(window.__setEarthScroll) window.__setEarthScroll(self.progress);
          setDepth(Math.max(0,(self.progress-.56)/.44)*D_MIDS[0]);
        } }
    });
    mTl.to('#hero-content',{yPercent:-36,opacity:0,ease:'power1.in',duration:.4},0)
      .to('.hero-foot',{yPercent:55,opacity:0,ease:'power1.in',duration:.35},0)
      .to('.hero-scroll',{opacity:0,duration:.2},0);
  },
  '(max-width: 900px) and (orientation: landscape)': function(){
    /* в ландшафте герой выше экрана и пинить его нечестно — мягкий зум без пина */
    if(!document.getElementById('hero')) return;
    ScrollTrigger.create({ trigger:'#hero', start:'top top', end:'bottom 30%', scrub:1.2,
      onUpdate:function(self){
        if(window.__setEarthScroll) window.__setEarthScroll(Math.min(.22,self.progress*.3));
        setDepth(Math.max(0,(self.progress-.62)/.38)*D_MIDS[0]);
      } });
  }
});

/* ================= GLOBAL RAIL ================= */
if(rf) ScrollTrigger.create({ trigger:document.body, start:'top top', end:'max',
  onUpdate:function(self){ rf.style.height=(self.progress*100)+'%'; }});

/* ================= MARQUEES (velocity-reactive) ================= */
document.querySelectorAll('.strip-track').forEach(function(track){
  var dir=parseFloat(track.getAttribute('data-marquee'))||1;
  track.innerHTML+=track.innerHTML;
  var tween=gsap.to(track,{xPercent:-50*dir,duration:26,ease:'none',repeat:-1});
  if (dir<0) gsap.set(track,{xPercent:-50}); /* start shifted so reverse dir loops seamlessly */
  ScrollTrigger.create({ trigger:track, start:'top bottom', end:'bottom top',
    onUpdate:function(self){
      var v=Math.abs(self.getVelocity())/900;
      gsap.to(tween,{timeScale:1+Math.min(v,3),duration:.3,overwrite:true});
    }});
});
document.querySelectorAll('.client-row').forEach(function(row){
  var dir=parseFloat(row.getAttribute('data-row'))||1;
  row.innerHTML+=row.innerHTML;
  gsap.to(row,{xPercent:-50*dir,duration:52,ease:'none',repeat:-1});
  if(dir<0) gsap.set(row,{xPercent:-50});
});

/* ================= ACT II : DESCENT ================= */
ScrollTrigger.matchMedia({
  '(min-width: 641px)': function(){
    if(!document.getElementById('shaft-view')) return;
    var strata=gsap.utils.toArray('#shaft .stratum');
    var N=strata.length;
    /* прогресс разреза → метры: кусочно-линейно через середины горизонтов,
       границы слоёв проходятся ровно на отметках 2 / 8 / 16 / 24 / 36 м */
    var descentDepth=function(p){
      var TD=master.duration(), SH=N-1;
      var tt=p*TD;
      if(tt>=SH){ /* последний горизонт: доезжаем до забоя 48 м */
        var q=TD>SH ? Math.min(1,(tt-SH)/(TD-SH)) : 1;
        return D_MIDS[N-1]+(D_BOTS[N-1]-D_MIDS[N-1])*q;
      }
      var k=Math.min(N-2,Math.floor(tt)), f=tt-k;
      return f<.5
        ? D_MIDS[k]+(D_BOTS[k]-D_MIDS[k])*(f/.5)
        : D_BOTS[k]+(D_MIDS[k+1]-D_BOTS[k])*((f-.5)/.5);
    };
    var master=gsap.timeline({
      scrollTrigger:{ trigger:'#shaft-view', start:'top top', end:'+='+(N*85)+'%', scrub:.7, pin:true, anticipatePin:1,
        onUpdate:function(self){ setDepth(descentDepth(self.progress)); },
        onLeave:function(){ setDepth(D_BOTS[N-1]); },
        onEnterBack:function(){ setDepth(descentDepth(1)); } }
    });
    master.to('#shaft',{yPercent:-100*(N-1), ease:'none', duration:N-1},0);
    strata.forEach(function(st,i){
      var body=st.querySelector('.st-body'), idx=st.querySelector('.st-idx');
      if(i===0){
        /* первый горизонт виден сразу; шапка акта уходит при движении дальше */
        master.to('.st-act',{opacity:0,y:-30,duration:.3,ease:'power1.in'},.22);
        master.to(body.children,{y:-40,opacity:0,duration:.25,stagger:.03,ease:'power1.in'},.6);
      } else {
        master.fromTo(idx,{yPercent:36,opacity:0},{yPercent:-16,opacity:1,duration:.9,ease:'none'},Math.max(0,i-.48));
        master.fromTo(body.children,{y:54,opacity:0},{y:0,opacity:1,duration:.4,stagger:.05,ease:'power2.out'},i-.44);
        if(i<N-1) master.to(body.children,{y:-40,opacity:0,duration:.25,stagger:.03,ease:'power1.in'},i+.6);
      }
    });
  },
  '(max-width: 640px)': function(){
    var sv=document.getElementById('shaft-view'), sh=document.getElementById('shaft');
    if(!sv) return;
    sv.style.height='auto'; sv.style.overflow='visible'; sh.style.position='relative';
    document.querySelectorAll('#shaft .stratum').forEach(function(st,i){
      st.style.position='relative'; st.style.top='auto'; st.style.height='auto'; st.style.padding='calc(clamp(56px,10vh,100px) + 90px) 0 96px';
      gsap.utils.toArray(st.querySelector('.st-body').children).forEach(function(el,k){
        gsap.fromTo(el,{y:26,opacity:0},{y:0,opacity:1,duration:.55,delay:k*.06,ease:'power2.out',clearProps:'transform,opacity',
          scrollTrigger:{trigger:st,start:'top 82%',once:true}});
      });
      /* мобильный глубиномер: метры идут по мере прохода горизонта */
      ScrollTrigger.create({ trigger:st, start:'top 68%', end:'bottom 68%',
        onUpdate:function(self){ setDepth(D_TOPS[i]+(D_BOTS[i]-D_TOPS[i])*self.progress); },
        onLeave:function(){ setDepth(D_BOTS[i]); } });
    });
  }
});

/* ================= ОТЛОЖЕННАЯ ЗАГРУЗКА КАДРОВ ОБЪЕКТОВ =================
   Восемь снимков — это ~1,6 МБ, и все они лежат ниже двух экранов разреза.
   Подставляем их не в первый заход, а когда до секции остаётся полтора экрана:
   к моменту, когда лента поедет, картинки уже на месте. Работает и без
   IntersectionObserver — тогда просто грузим сразу. */
(function(){
  var lazy=document.querySelectorAll('.pan-img[data-bg]');
  if(!lazy.length) return;
  var load=function(){
    lazy.forEach(function(el){
      var u=el.getAttribute('data-bg');
      if(!u) return;
      el.style.backgroundImage="url('"+u+"')";
      el.removeAttribute('data-bg');
    });
  };
  var host=document.getElementById('objects');
  if(!host || !('IntersectionObserver' in window)){ load(); return; }
  var io=new IntersectionObserver(function(en){
    if(en[0].isIntersecting){ load(); io.disconnect(); }
  },{rootMargin:'150% 0px'});
  io.observe(host);
})();

/* ================= ACT IV : HORIZONTAL DOLLY ================= */
ScrollTrigger.matchMedia({
  '(min-width: 901px)': function(){
    var track=document.getElementById('h-track');
    if(!track) return;
    var pans=gsap.utils.toArray('.pan');
    var fill=document.getElementById('h-fill'), count=document.getElementById('h-count');
    var getDist=function(){ return track.scrollWidth - innerWidth; };
    var scrollTween=gsap.to(track,{
      x:function(){ return -getDist(); },
      ease:'none',
      scrollTrigger:{
        trigger:'#h-view', start:'top top',
        end:function(){ return '+='+getDist(); },
        scrub:.7, pin:true, anticipatePin:1, invalidateOnRefresh:true,
        onUpdate:function(self){
          fill.style.transform='scaleX('+self.progress+')';
          var i=Math.min(pans.length,Math.max(1,Math.round(self.progress*pans.length+.4)));
          count.textContent=pad(i)+' / '+pad(pans.length);
          /* velocity skew — Spielberg dolly shake */
          var v=gsap.utils.clamp(-9,9,self.getVelocity()/-260);
          gsap.to(pans,{skewX:v*.5,rotate:v*.06,duration:.5,ease:'power2.out',overwrite:'auto'});
        },
        onLeave:function(){ gsap.to(pans,{skewX:0,rotate:0,duration:.5}); },
        onLeaveBack:function(){ gsap.to(pans,{skewX:0,rotate:0,duration:.5}); }
      }
    });
    /* internal image parallax against dolly */
    pans.forEach(function(pan){
      var img=pan.querySelector('.pan-img');
      gsap.fromTo(img,{xPercent:-7},{xPercent:7,ease:'none',
        scrollTrigger:{ trigger:pan, containerAnimation:scrollTween, start:'left right', end:'right left', scrub:true }});
      gsap.from(pan.querySelector('.pan-cap').children,{y:26,opacity:0,duration:.6,stagger:.07,ease:'power2.out',
        scrollTrigger:{ trigger:pan, containerAnimation:scrollTween, start:'left 78%' }});
      gsap.from(pan.querySelector('.pan-idx'),{x:60,opacity:0,duration:.7,ease:'power3.out',
        scrollTrigger:{ trigger:pan, containerAnimation:scrollTween, start:'left 85%' }});
    });
    gsap.from('.h-head > *',{y:30,opacity:0,duration:.7,stagger:.09,ease:'power3.out',
      scrollTrigger:{trigger:'#objects',start:'top 70%'}});
  },
  '(max-width: 900px)': function(){
    var hv=document.getElementById('h-view'), tr=document.getElementById('h-track');
    if(!hv) return;
    hv.style.height='auto'; hv.style.overflow='visible';
    tr.style.position='relative'; tr.style.flexDirection='column'; tr.style.alignItems='stretch'; tr.style.padding='70px 4vw';
    document.querySelectorAll('.pan').forEach(function(p){
      p.style.width='100%'; p.style.height='54vh'; p.style.margin='0 0 46px';
      gsap.from(p,{y:40,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:p,start:'top 85%'}});
    });
    document.querySelector('.h-progress').style.display='none';
    document.getElementById('h-count').style.display='none';
  }
});

/* ================= GENERIC REVEALS ================= */
var REVEAL_SEL='.test-card,.edu-card,.contact-card,.eq-card,.fin-main,.live-card,.gx-panel,.svc-card,.pub-row,.doc-card,.docs-ledger li';
if(!isTouch){
  gsap.utils.toArray('.sec-head').forEach(function(head){
    gsap.from(head.children,{y:40,opacity:0,duration:.75,stagger:.1,ease:'power3.out',
      scrollTrigger:{trigger:head,start:'top 85%'}});
  });
  gsap.utils.toArray(REVEAL_SEL).forEach(function(card,k){
    gsap.fromTo(card,{y:34,opacity:0},{y:0,opacity:1,duration:.6,ease:'power2.out',
      delay:(k%4)*.06, immediateRender:true, clearProps:'transform,opacity',
      onComplete:function(){ card.classList.add('is-in'); }, /* запускает отрисовку графиков в карточках */
      scrollTrigger:{trigger:card,start:'top 94%',once:true}});
  });
} else {
  /* touch: появления через IntersectionObserver + CSS (.rv / .rv-in) с принудительным показом всего, что в кадре */
  var rvEls=gsap.utils.toArray(REVEAL_SEL);
  rvEls.forEach(function(el){ el.classList.add('rv'); });
  function rvShow(el){ if(el.classList.contains('rv-in')) return; el.classList.add('rv-in'); el.classList.add('is-in'); }
  function rvSweep(){ var vh=innerHeight; rvEls.forEach(function(el){ if(el.classList.contains('rv-in')) return; var r=el.getBoundingClientRect(); if(r.top<vh*1.05 && r.bottom>-40) rvShow(el); }); }
  if('IntersectionObserver' in window){
    var rvIO=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ rvShow(e.target); rvIO.unobserve(e.target); } }); },{rootMargin:'0px 0px -4% 0px',threshold:.01});
    rvEls.forEach(function(el){ rvIO.observe(el); });
  } else { rvEls.forEach(rvShow); }
  addEventListener('scroll',rvSweep,{passive:true});
  addEventListener('load',rvSweep); addEventListener('pageshow',rvSweep); addEventListener('orientationchange',function(){ setTimeout(rvSweep,300); });
  setTimeout(rvSweep,1200); setTimeout(rvSweep,3500);
  setTimeout(function(){ rvEls.forEach(function(el){ if(el.getBoundingClientRect().bottom<innerHeight) rvShow(el); }); },8000);
}
/* витрина оснащения: 100+ стабилометров — набегающий счётчик */
var ehn=document.getElementById('eq-hero-n');
if(ehn){
  gsap.from('.eq-hero > *',{y:28,opacity:0,duration:.7,stagger:.12,ease:'power3.out',
    scrollTrigger:{trigger:'.eq-hero',start:'top 86%',once:true}});
  ScrollTrigger.create({trigger:'.eq-hero',start:'top 80%',once:true,onEnter:function(){
    var o={v:0};
    gsap.to(o,{v:100,duration:1.6,ease:'power2.out',onUpdate:function(){ ehn.textContent=Math.round(o.v); }});
  }});
}
if(document.querySelector('.calc-copy')){
  gsap.from('.calc-copy > *',{y:26,opacity:0,duration:.7,stagger:.1,ease:'power2.out',
    scrollTrigger:{trigger:'#calc .calc-grid',start:'top 82%'}});
  gsap.from('#mesh-canvas',{opacity:0,scale:.97,duration:.9,ease:'power2.out',
    scrollTrigger:{trigger:'#mesh-canvas',start:'top 86%'}});
}
gsap.from('.fin-head > *, .strat-strip',{y:36,opacity:0,duration:.8,stagger:.09,ease:'power3.out',
  scrollTrigger:{trigger:'.fin',start:'top 80%'}});
gsap.fromTo('.fin-watermark',{yPercent:30},{yPercent:-10,ease:'none',
  scrollTrigger:{trigger:'#contacts',start:'top bottom',end:'bottom top',scrub:true}});
gsap.from('.client-rows',{opacity:0,y:24,duration:.8,ease:'power2.out',
  scrollTrigger:{trigger:'#clients',start:'top 80%'}});

/* ================= LIGHT ZONE (только на главной, свет после разреза) ================= */
if(document.getElementById('hero') && document.getElementById('objects')){
  ScrollTrigger.create({ trigger:'#objects', start:'top 70%',
    /* глубиномер меряет погружение — после разреза он не нужен и налезал бы
       на карточки объектов, досье и контактов, поэтому гасим его вместе с уходом в свет */
    onEnter:function(){ document.body.classList.add('on-light','hud-off'); },
    onLeaveBack:function(){ document.body.classList.remove('on-light','hud-off'); }});
}

/* ================= NAV ACTIVE ================= */
['contacts'].forEach(function(id){
  if(!document.getElementById(id)) return;
  ScrollTrigger.create({ trigger:'#'+id, start:'top 40%', end:'bottom 40%',
    onToggle:function(self){
      if(self.isActive) document.querySelectorAll('[data-nav]').forEach(function(a){
        var h=a.getAttribute('href')||'';
        a.classList.toggle('active', h.indexOf('#'+id)>=0);
      });
    }});
});

/* ================= MAGNETIC BUTTONS ================= */
if(!isTouch){
  document.querySelectorAll('.btn,.nav-cta,.fin-phone').forEach(function(btn){
    btn.style.willChange='transform';
    btn.addEventListener('pointermove',function(e){
      var r=btn.getBoundingClientRect();
      gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.32,duration:.4,ease:'power2.out'});
    });
    btn.addEventListener('pointerleave',function(){
      gsap.to(btn,{x:0,y:0,duration:.7,ease:'elastic.out(1,.4)'});
    });
  });
}

/* hover glow position on test cards */
document.querySelectorAll('.test-card').forEach(function(c){
  c.addEventListener('pointermove',function(e){
    var r=c.getBoundingClientRect();
    c.style.setProperty('--gx',((e.clientX-r.left)/r.width*100)+'%');
  },{passive:true});
});

addEventListener('load',function(){ ScrollTrigger.refresh(); });
setTimeout(function(){ ScrollTrigger.refresh(); }, 800);

} /* end gsap && !reduced */

/* ================= REDUCED / NO-JS FALLBACK ================= */
if(!hasGsap||reduced){
  document.querySelectorAll('[data-count]').forEach(function(el){ el.textContent=el.getAttribute('data-count')+(el.getAttribute('data-suffix')||''); });
  var sv=document.getElementById('shaft-view'); if(sv){ sv.style.height='auto'; sv.style.overflow='visible'; }
  var sh=document.getElementById('shaft'); if(sh) sh.style.position='relative';
  document.querySelectorAll('#shaft .stratum').forEach(function(st){ st.style.position='relative'; st.style.top='auto'; st.style.height='auto'; st.style.padding='calc(clamp(56px,10vh,100px) + 84px) 0 90px'; st.style.flexDirection='column'; });
  var l=document.getElementById('loader'); if(l) l.style.display='none';
  document.querySelectorAll('.test-card,.live-card').forEach(function(c){ c.classList.add('is-in'); });
  var ldn=document.getElementById('ld-name'); if (ldn && !ldn.textContent) ldn.textContent='МОСТДОРГЕОТРЕСТ';
  var lightSec=document.getElementById('objects');
  if(lightSec && document.getElementById('hero')){
    addEventListener('scroll',function(){
      document.body.classList.toggle('on-light', scrollY > lightSec.offsetTop - innerHeight*.7);
    },{passive:true});
  }
}
})();
