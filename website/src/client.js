(()=>{'use strict';const toggle=document.getElementById('menu-button');const nav=document.getElementById('primary-nav');if(toggle&&nav){const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','فتح القائمة');};toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'إغلاق القائمة':'فتح القائمة');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!nav.contains(e.target))close()});window.addEventListener('resize',()=>{if(window.innerWidth>880&&nav.classList.contains('open'))close();});}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();})();

/* One original image, no server-rendered intro markup and no screen-blocking
 * placeholders. If the real stylesheet is absent, there is nothing to leak.
 */
(()=>{
  const root=document.documentElement;
  const key='dr-fayza-intro-v2';
  try{if(localStorage.getItem(key)==='seen')return;}catch(_e){}
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  const net=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  if(net&&(net.saveData||['slow-2g','2g'].includes(net.effectiveType)))return;
  // This sentinel exists ONLY in the current stylesheet. Never render
  // a decorative loader against old, missing or failed CSS.
  if(getComputedStyle(root).getPropertyValue('--clinic-logo-reveal-ready').trim()!=='v2')return;
  const headerLogo=document.querySelector('.header .logo img');
  if(!headerLogo)return;
  let canceled=false;
  const onPageHide=()=>{canceled=true;};
  window.addEventListener('pagehide',onPageHide,{once:true});
  const ready=typeof headerLogo.decode==='function'
    ? headerLogo.decode().then(()=>true,()=>false)
    : Promise.resolve(Boolean(headerLogo.complete&&headerLogo.naturalWidth));
  // Do not introduce an overlay after a slow load; keep the site usable.
  Promise.race([ready,new Promise(resolve=>setTimeout(()=>resolve(false),650))]).then(ok=>{
    if(!ok||canceled||!document.body.isConnected)return;
    if(getComputedStyle(root).getPropertyValue('--clinic-logo-reveal-ready').trim()!=='v2')return;
    const intro=document.createElement('div');
    intro.className='clinic-logo-reveal';
    intro.setAttribute('aria-hidden','true');
    const mark=document.createElement('div');
    mark.className='clinic-logo-reveal__mark';
    const img=document.createElement('img');
    img.className='clinic-logo-reveal__image';
    img.src=headerLogo.currentSrc||headerLogo.src;
    img.width=480;img.height=143;img.alt='';
    img.decoding='async';
    const line=document.createElement('span');
    line.className='clinic-logo-reveal__line';
    mark.append(img,line);
    intro.append(mark);
    document.body.append(intro);
    // Mark after showing, not after another network request.
    try{localStorage.setItem(key,'seen')}catch(_e){}
    let disposed=false;
    const finish=()=>{
      if(disposed)return;
      disposed=true;
      clearTimeout(failsafe);
      intro.remove();
      window.removeEventListener('pagehide',finish);
    };
    const failsafe=setTimeout(finish,2200);
    intro.addEventListener('animationend',e=>{
      if(e.target===intro&&e.animationName==='clinic-logo-reveal-exit')finish();
    });
    intro.addEventListener('pointerdown',finish,{once:true});
    window.addEventListener('pagehide',finish,{once:true});
  }).catch(()=>{});
})();
