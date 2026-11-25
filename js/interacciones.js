
(() => {
  const videos=[...document.querySelectorAll('.eco-hero-video')];
  const hero=document.querySelector('#inicio');
  const motion=document.getElementById('motion');
  const audio=document.getElementById('eco-voice');
  const sound=document.getElementById('eco-audio-toggle');
  const label=document.getElementById('eco-audio-label');
  const icon=sound?.querySelector('.eco-play-icon');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncVideo(){videos.forEach(vid=>{if(reduce.matches || hero.classList.contains('paused') || document.hidden){vid.pause()} else {vid.play().catch(()=>{})}})}
  if(videos.length){videos.forEach(vid=>{vid.muted=true;vid.defaultMuted=true;vid.addEventListener('loadeddata',syncVideo)});motion?.addEventListener('click',()=>setTimeout(syncVideo,0));document.addEventListener('visibilitychange',syncVideo);if(reduce.addEventListener)reduce.addEventListener('change',syncVideo);syncVideo()}
  function setAudioUI(playing){label.textContent=playing?'Pausar mensaje de ECO':'Escucha el mensaje de ECO';icon.textContent=playing?'Ⅱ':'▷';sound.setAttribute('aria-pressed',String(playing));}
  if(sound&&audio){sound.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();setAudioUI(true)}catch{setAudioUI(false)}}else{audio.pause();setAudioUI(false)}});audio.addEventListener('ended',()=>setAudioUI(false));audio.addEventListener('pause',()=>setAudioUI(false));}
  const manifest=document.querySelector('.eco-manifesto');if(manifest&&'IntersectionObserver' in window){new IntersectionObserver(([entry],observer)=>{if(entry.isIntersecting){manifest.classList.add('is-visible');observer.disconnect()}},{threshold:.15}).observe(manifest)}
})();
