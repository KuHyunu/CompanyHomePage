(() => {
  const menu = document.querySelector('.lounge-page .gate-menu');
  const target = document.getElementById('mini');
  if (!menu || !target) return;
  const link = menu.querySelector('[data-mini-section]');
  if (!link) return;
  link.setAttribute('href', '#mini');
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    menu.classList.remove('open');
    document.querySelector('.gate-menu-button')?.setAttribute('aria-expanded', 'false');
    history.replaceState(null, '', '#mini');
    if (typeof window.scrollAnchorToCenter === 'function') window.scrollAnchorToCenter(target);
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, true);
})();
