(()=>{'use strict';const toggle=document.getElementById('menu-button');const nav=document.getElementById('primary-nav');if(toggle&&nav){const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','فتح القائمة');};toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'إغلاق القائمة':'فتح القائمة');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!nav.contains(e.target))close()});window.addEventListener('resize',()=>{if(window.innerWidth>880&&nav.classList.contains('open'))close();});}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();})();
/* Motion is progressive enhancement: content remains visible without JavaScript. */
(()=>{
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const dataSaver=navigator.connection?.saveData===true;
 const loader=document.querySelector('.clinic-loader');
 if(loader){
   try{sessionStorage.setItem('clinic-visited','1')}catch(e){}
   const dismiss=()=>loader.remove();
   if(reduced||dataSaver){dismiss();}
   else {loader.addEventListener('animationend',e=>{if(e.target===loader)dismiss()},{once:true});}
 }
 if(reduced||dataSaver||!('IntersectionObserver' in window))return;
 const targets=[...document.querySelectorAll('main .section > .container, main .clinic-hero__shell, main .clinic-inner-hero__grid, main .clinic-birth .container')];
 const watcher=new IntersectionObserver((entries,observer)=>{
   for(const entry of entries){
     if(!entry.isIntersecting)continue;
     entry.target.classList.add('clinic-in-view');
     observer.unobserve(entry.target);
   }
 },{rootMargin:'0px 0px -20px 0px',threshold:.06});
 for(const el of targets)watcher.observe(el);
})();
