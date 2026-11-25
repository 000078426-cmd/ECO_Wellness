
(() => {
  const hero=document.querySelector('.hero'),ticker=document.querySelector('.ticker'),motion=document.querySelector('#motion'),media=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=false;
  function applyMotion(){hero.classList.toggle('paused',paused);ticker.classList.toggle('paused',paused);motion.hidden=media.matches;motion.children[0].textContent=paused?'▷':'Ⅱ';motion.children[1].textContent=paused?'Reanudar movimiento':'Pausar movimiento';requestUpdate()}
  motion.addEventListener('click',()=>{paused=!paused;applyMotion()});
  media.addEventListener('change',applyMotion);
  const menu=document.querySelector('.menu'),nav=document.querySelector('#menu');
  function setMenu(open){nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')}
  menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
  const pics=[...document.querySelectorAll('.stage img')],captions=['01 / La sala inmersiva','02 / En comunidad','03 / Un momento para respirar'];
  const stageLetter=document.querySelector('.stage-letter');
  const letterUse=stageLetter.querySelector('use'), letters=['e','c','o'];
  document.querySelectorAll('[data-pillar]').forEach(el=>el.addEventListener('toggle',()=>{if(!el.open)return;const n=+el.dataset.pillar;pics.forEach((p,i)=>{p.classList.toggle('active',i===n);p.setAttribute('aria-hidden',String(i!==n))});document.querySelector('#stage-caption').textContent=captions[n];letterUse.setAttribute('href','#ink-'+letters[n]);stageLetter.classList.remove('flash');if(!paused&&!media.matches){void stageLetter.getBoundingClientRect();stageLetter.classList.add('flash')}}));
  if('IntersectionObserver' in window){
    const reveal=new IntersectionObserver(items=>{items.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');reveal.unobserve(x.target)}})},{threshold:.08});
    document.querySelectorAll('[data-reveal]').forEach(el=>reveal.observe(el));document.documentElement.classList.add('enhanced');
    new IntersectionObserver(([x])=>hero.classList.toggle('outside',!x.isIntersecting)).observe(hero);
    new IntersectionObserver(([x])=>{ticker.querySelector('.ticker-inner').style.animationPlayState=x.isIntersecting?'':'paused'}).observe(ticker);
  }
  const progress=document.querySelector('.progress');

  const community=document.querySelector('[data-community-motion]');
  if(community){
    const resetCommunity=()=>{community.style.setProperty('--gx',0);community.style.setProperty('--gy',0)};
    const moveCommunity=e=>{
      if(paused||media.matches||innerWidth<=900){resetCommunity();return}
      const rect=community.getBoundingClientRect();
      const x=((e.clientX-rect.left)/rect.width)-0.5;
      const y=((e.clientY-rect.top)/rect.height)-0.5;
      community.style.setProperty('--gx',x.toFixed(3));
      community.style.setProperty('--gy',y.toFixed(3));
    };
    community.addEventListener('pointermove',moveCommunity);
    community.addEventListener('pointerleave',resetCommunity);
    addEventListener('resize',()=>{if(innerWidth<=900)resetCommunity()},{passive:true});
  }
  const dynamic=[...document.querySelectorAll('[data-depth], [data-parallax]')];
  const modest=(n,limit)=>Math.max(-limit,Math.min(limit,n));
  let frame=0;
  function update(){
    frame=0;
    const range=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform='scaleX('+(range>0?scrollY/range:0)+')';
    const manifesto=document.querySelector('.eco-manifesto');
    if(manifesto){
      const bounds=manifesto.getBoundingClientRect();
      const visible=bounds.bottom>0 && bounds.top<innerHeight;
      const motionFactor=(!paused && !media.matches && visible) ? Math.max(-1,Math.min(1,(innerHeight*.55-(bounds.top+bounds.height*.5))/Math.max(bounds.height,innerHeight*.7))) : 0;
      manifesto.style.setProperty('--eco-line-1',(motionFactor*42).toFixed(1)+'px');
      manifesto.style.setProperty('--eco-line-2',(motionFactor*-33).toFixed(1)+'px');
      manifesto.style.setProperty('--eco-line-3',(motionFactor*30).toFixed(1)+'px');
    }
    dynamic.forEach(el=>{
      const rect=el.getBoundingClientRect(), live=!paused&&!media.matches&&rect.bottom>-60&&rect.top<innerHeight+60;
      const delta=live?(innerHeight/2-rect.top-rect.height/2):0;
      const wide=innerWidth>810;
      el.style.setProperty('--depth',modest(delta*.048,wide?21:12)+'px');
      if(el.dataset.depth==='interlude'){
        el.style.setProperty('--line-one',modest(delta*.078,wide?31:10)+'px');
        el.style.setProperty('--line-two',modest(delta*-.13,wide?57:17)+'px');
      }
      if(el.hasAttribute('data-parallax')) el.style.setProperty('--letter-drift',modest(delta*.09,wide?27:12)+'px');
    });
  }
  function requestUpdate(){if(!frame)frame=requestAnimationFrame(update)}
  addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate,{passive:true});applyMotion();
})();
