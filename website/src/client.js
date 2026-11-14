/* Progressive enhancements only: navigation, text and native lazy images work
   without this file. Optional motion never controls page visibility. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const motionAllowed = () => !reducedMotion.matches && !connection?.saveData &&
    getComputedStyle(document.documentElement).getPropertyValue('--clinic-motion-ready').trim() === '1';

  function initNavigation() {
    const toggle = document.getElementById('menu-button');
    const nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;
    const close = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'فتح القائمة');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); }
    });
    document.addEventListener('click', event => {
      if (!toggle.contains(event.target) && !nav.contains(event.target)) close();
    });
    addEventListener('resize', () => { if (innerWidth > 880) close(); });
  }

  function initLogoMotion() {
    // Animate the ONE existing header image, after decoding. No cloned image,
    // injected overlay, pending HTML, body lock or CSS-dependent hidden page.
    const logo = document.querySelector('.header .logo > img');
    const key = 'dr-fayza-header-motion-v3';
    if (!logo || !motionAllowed() || typeof logo.animate !== 'function') return;
    if (['slow-2g', '2g'].includes(connection?.effectiveType)) return;
    try { if (localStorage.getItem(key) === 'seen') return; } catch (_) {}
    let canceled = false;
    const cancelPending = () => { canceled = true; };
    addEventListener('pagehide', cancelPending, { once: true });
    const decoded = typeof logo.decode === 'function'
      ? logo.decode().then(() => true, () => false)
      : Promise.resolve(logo.complete && logo.naturalWidth > 0);
    let timer;
    const budget = new Promise(resolve => { timer = setTimeout(() => resolve(false), 650); });
    Promise.race([decoded, budget]).then(ready => {
      clearTimeout(timer);
      removeEventListener('pagehide', cancelPending);
      if (!ready || canceled || !motionAllowed()) return;
      const animation = logo.animate([
        { clipPath: 'inset(0 100% 0 0)', transform: 'translateX(18%)', offset: 0 },
        { clipPath: 'inset(0 72% 0 0)', transform: 'translateX(18%)', offset: .25 },
        { clipPath: 'inset(0 72% 0 0)', transform: 'translateX(0)', offset: .45 },
        { clipPath: 'inset(0 0 0 0)', transform: 'translateX(0)', offset: 1 }
      ], { duration: 680, easing: 'cubic-bezier(.22,.7,.2,1)' });
      logo.dataset.logoMotion = 'running';
      try { localStorage.setItem(key, 'seen'); } catch (_) {}
      const cancel = () => animation.cancel();
      const onPreference = () => { if (reducedMotion.matches) cancel(); };
      addEventListener('pagehide', cancel, { once: true });
      reducedMotion.addEventListener('change', onPreference);
      const finish = () => {
        logo.dataset.logoMotion = 'complete';
        removeEventListener('pagehide', cancel);
        reducedMotion.removeEventListener('change', onPreference);
      };
      animation.finished.then(finish, finish);
    }).catch(() => { clearTimeout(timer); removeEventListener('pagehide', cancelPending); });
  }

  function initImages() {
    for (const image of document.querySelectorAll('main img')) {
      const frame = image.parentElement;
      if (!frame || image.alt === '') continue;
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
          const sources = image.getAttribute('srcset');
          image.removeAttribute('srcset'); image.removeAttribute('src');
          if (sources) image.setAttribute('srcset', sources);
          if (src) image.setAttribute('src', src);
        });
        frame.append(retry);
      };
      image.addEventListener('load', loaded);
      image.addEventListener('error', failed);
      if (image.complete) { if (image.naturalWidth) loaded(); else failed(); }
      else if (image.loading === 'lazy') image.classList.add('clinic-image-loading');
    }
  }

  function initSectionMotion() {
    if (!motionAllowed() || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('clinic-in-view');
        observer.unobserve(entry.target);
      }
    }, { threshold: .08 });
    document.querySelectorAll('main > section:not(:first-child) > .container').forEach(node => observer.observe(node));
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) observer.disconnect(); });
    // Keep this observer when the browser suspends/restores a page via bfcache.
  }

  function initBackToTop() {
    const link = document.querySelector('[data-back-to-top]');
    const top = document.getElementById('page-top');
    if (!link || !top) return;
    let queued = false;
    const update = () => {
      queued = false;
      const hidden = scrollY < Math.max(400, innerHeight * .65);
      if (hidden && document.activeElement === link) top.focus({ preventScroll: true });
      link.hidden = hidden;
    };
    addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    addEventListener('pageshow', update);
    link.addEventListener('click', event => {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) top.focus({ preventScroll: true });
      // A real anchor performs the scroll; CSS honors reduced-motion automatically.
    });
    update();
  }

  initNavigation();
  initLogoMotion();
  initImages();
  initSectionMotion();
  initBackToTop();
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
