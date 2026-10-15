/* Shared, layout-stable anchor positioning for all service categories. */
(() => {
  let navigation = 0;
  let stopWatching = () => {};
  const layoutTop = element => {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  };
  const findTarget = hash => {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  };
  const visibleTop = target => {
    const header = document.querySelector('#site-header, .gate-header');
    let top = Math.max(0, header?.getBoundingClientRect().bottom || 0);
    if (target.matches('.sales-product-card')) {
      const tabs = document.querySelector('.sales-product-nav');
      if (tabs) top = Math.max(top, parseFloat(getComputedStyle(tabs).top) + tabs.offsetHeight);
    }
    return Math.min(innerHeight, top);
  };
  const destination = target => {
    if (target.id === 'top' || target.id === 'hero') return 0;
    const title = target.querySelector('h1, h2, .section-title, .sub-title') || target;
    const center = layoutTop(title) + title.offsetHeight / 2;
    const top = visibleTop(target);
    return Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight,
      center - (top + (innerHeight - top) / 2)));
  };
  const cancel = () => { navigation++; stopWatching(); };
  ['wheel', 'touchstart', 'pointerdown'].forEach(type =>
    window.addEventListener(type, cancel, { passive: true }));
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancel();
  });
  window.scrollAnchorToCenter = async (target, behavior = 'smooth') => {
    if (!target) return;
    const current = ++navigation;
    stopWatching();
    if (target.id === 'top' || target.id === 'hero') {
      window.scrollTo({ top: 0, behavior });
      return;
    }
    // Decode preceding lazy images before their natural dimensions can shift the target.
    const preceding = [...document.images].filter(image =>
      image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
    const imagesReady = preceding.map(image => {
      image.loading = 'eager';
      return image.decode().catch(() => {});
    });
    await Promise.race([
      Promise.all([document.fonts.ready, ...imagesReady]),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    if (current !== navigation) return;
    await new Promise(requestAnimationFrame);
    const motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior;
    window.scrollTo({ top: destination(target), behavior: motion === 'auto' ? 'instant' : motion });
    // Correct late layout changes, but stop as soon as the user takes control.
    let timer;
    const settle = () => {
      if (current !== navigation) return;
      const top = destination(target);
      if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, behavior: 'instant' });
    };
    window.addEventListener('scrollend', settle);
    const finalAlignment = setTimeout(settle, 1600);
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        settle();
      }, 1600);
    });
    observer.observe(document.body);
    const expiry = setTimeout(() => stopWatching(), 4000);
    stopWatching = () => {
      observer.disconnect(); clearTimeout(timer); clearTimeout(expiry); clearTimeout(finalAlignment);
      window.removeEventListener('scrollend', settle);
    };
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || link.hasAttribute('download') || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname ||
      url.search !== location.search || !url.hash) return;
    const target = findTarget(url.hash);
    if (!target) return;
    event.preventDefault();
    document.querySelector('#gnb')?.classList.remove('mobile-open');
    document.querySelector('#hamburger')?.classList.remove('open');
    document.querySelector('#hamburger')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.gate-menu')?.classList.remove('open');
    document.querySelector('.gate-menu-button')?.setAttribute('aria-expanded', 'false');
    history.replaceState(null, '', url.hash);
    window.scrollAnchorToCenter(target);
  });
  const followHash = () => {
    if (location.hash) window.scrollAnchorToCenter(findTarget(location.hash), 'instant');
  };
  window.addEventListener('hashchange', followHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', followHash);
  else followHash();
})();
