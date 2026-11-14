(()=>{'use strict';const toggle=document.getElementById('menu-button');const nav=document.getElementById('primary-nav');if(toggle&&nav){const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','فتح القائمة');};toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));toggle.setAttribute('aria-label',opened?'إغلاق القائمة':'فتح القائمة');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!nav.contains(e.target))close()});window.addEventListener('resize',()=>{if(window.innerWidth>880&&nav.classList.contains('open'))close();});}const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();})();


/* A small signature appears once; it never covers or delays the page. */
(() => {
  const layer = document.querySelector('[data-clinic-brand-intro]');
  if (!layer) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const net = navigator.connection;
  const remove = () => { root.classList.remove('clinic-intro-active'); layer.remove(); };
  let seen = false;
  try { seen = localStorage.getItem('dr-fayza-intro-v1') === 'seen'; } catch (_) {}
  if (seen || reduced.matches || net?.saveData || /(^|-)2g$/.test(net?.effectiveType || '')) { remove(); return; }
  const logo = layer.querySelector('.clinic-brand-intro__layer--finished');
  let expired = false;
  const timeout = setTimeout(() => { expired = true; remove(); }, 950);
  const ready = logo?.decode ? logo.decode() : Promise.resolve();
  ready.then(() => {
    if (expired || !logo?.naturalWidth) return;
    clearTimeout(timeout);
    try { localStorage.setItem('dr-fayza-intro-v1', 'seen'); } catch (_) {}
    root.classList.add('clinic-intro-active');
    layer.addEventListener('animationend', e => { if (e.target === layer) remove(); });
    setTimeout(remove, 1800);
  }).catch(() => { clearTimeout(timeout); remove(); });
  addEventListener('pagehide', remove, { once: true });
})();

/* Native lazy loading works without JS. JS only adds image readiness/error states. */
(() => {
  for (const image of document.querySelectorAll('main img')) {
    const frame = image.parentElement;
    if (!frame || image.closest('.clinic-brand-intro')) continue;
    const loaded = () => {
      image.classList.remove('clinic-image-loading');
      image.classList.add('clinic-image-ready');
      frame.querySelector('[data-image-retry]')?.remove();
    };
    const failed = () => {
      image.classList.remove('clinic-image-loading');
      if (frame.querySelector('[data-image-retry]')) return;
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.dataset.imageRetry = '';
      retry.className = 'clinic-image-retry';
      retry.textContent = 'تعذّر تحميل الصورة. أعيدي المحاولة';
      retry.addEventListener('click', () => {
        retry.remove();
        image.classList.add('clinic-image-loading');
        const src = image.getAttribute('src');
        const set = image.getAttribute('srcset');
        image.removeAttribute('srcset'); image.removeAttribute('src');
        if (set) image.setAttribute('srcset', set);
        if (src) image.setAttribute('src', src);
      });
      frame.append(retry);
    };
    image.addEventListener('load', loaded);
    image.addEventListener('error', failed);
    if (image.complete) { if (image.naturalWidth) loaded(); else failed(); }
    else if (image.loading === 'lazy') image.classList.add('clinic-image-loading');
  }
})();

/* Observe once, with no scroll handler and no initially hidden content. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const net = navigator.connection;
  if (reduced.matches || net?.saveData || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('clinic-in-view');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  for (const section of document.querySelectorAll('main > section:not(:first-child) > .container')) observer.observe(section);
  reduced.addEventListener('change', () => { if (reduced.matches) observer.disconnect(); });
  addEventListener('pagehide', () => observer.disconnect(), { once: true });
})();
