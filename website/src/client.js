(()=>{'use strict';const toggle=document.getElementById('menu-button');const nav=document.getElementById('primary-nav');if(toggle&&nav){const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','فتح القائمة');};toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'إغلاق القائمة':'فتح القائمة');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!nav.contains(e.target))close()});window.addEventListener('resize',()=>{if(window.innerWidth>880&&nav.classList.contains('open'))close();});}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();})();


/* Brand intro is first-visit only; never hold the page for a slow logo/network. */
(()=>{
  const layer=document.querySelector('[data-clinic-brand-intro]');
  if(!layer)return;
  const root=document.documentElement;
  if(!root.classList.contains('clinic-intro-pending')){layer.remove();return;}
  let finished=false;
  let timer=0;
  const cleanup=(remember=true)=>{
    if(finished)return;
    finished=true;
    window.clearTimeout(timer);
    root.classList.remove('clinic-intro-pending','clinic-intro-active');
    if(remember){try{localStorage.setItem('dr-fayza-intro-v1','seen')}catch(_e){}}
    layer.remove();
  };
  const onDone=e=>{
    if(e.target===layer&&e.animationName==='clinic-intro-out')cleanup();
  };
  layer.addEventListener('animationend',onDone);
  layer.addEventListener('pointerdown',()=>cleanup(),{once:true});
  document.addEventListener('keydown',e=>{
    if((e.key==='Escape'||e.key==='Enter'||e.key===' ')&&!finished)cleanup();
  });
  window.addEventListener('pagehide',()=>cleanup(false),{once:true});
  const logo=layer.querySelector('.clinic-brand-intro__layer--finished');
  const decoded=logo&&typeof logo.decode==='function'
    ? logo.decode().then(()=>true,()=>false)
    : Promise.resolve(Boolean(logo&&logo.complete&&logo.naturalWidth));
  // A slow or missing logo must never keep a blank or blocked page open.
  Promise.race([decoded,new Promise(resolve=>window.setTimeout(()=>resolve(false),950))])
    .then(ready=>{
      if(finished)return;
      if(!ready){cleanup();return;}
      root.classList.remove('clinic-intro-pending');
      root.classList.add('clinic-intro-active');
      timer=window.setTimeout(()=>cleanup(),2050);
    }).catch(()=>cleanup());
})();
