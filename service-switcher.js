(() => {
  const wrapper = document.querySelector('.service-switcher');
  if (!wrapper) return;
  const toggle = wrapper.querySelector('.service-switcher-toggle');
  const list = wrapper.querySelector('.service-switcher-list');
  let closeTimer;
  let pointer;
  const pointerInside = () => {
    if (!pointer || list.hidden) return false;
    const buttonBox = wrapper.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const within = box => pointer.x >= box.left && pointer.x <= box.right && pointer.y >= box.top && pointer.y <= box.bottom;
    const crossingGap = pointer.x >= Math.min(buttonBox.left, listBox.left) && pointer.x <= Math.max(buttonBox.right, listBox.right) && pointer.y >= buttonBox.bottom && pointer.y <= listBox.top;
    return within(buttonBox) || within(listBox) || crossingGap;
  };
  const cancelClose = () => clearTimeout(closeTimer);
  const setOpen = open => {
    clearTimeout(closeTimer);
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    wrapper.classList.toggle('is-open', open);
  };
  wrapper.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') setOpen(true);
  });
  const scheduleClose = () => {
    cancelClose();
    closeTimer = setTimeout(() => {
      if (!pointerInside() && !wrapper.matches(':hover') && !list.matches(':hover')) setOpen(false);
    }, 150);
  };
  wrapper.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') scheduleClose(); });
  list.addEventListener('pointerenter', cancelClose);
  list.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') scheduleClose(); });
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (list.hidden) return;
    if (pointerInside()) cancelClose();
    else scheduleClose();
  }, { passive: true });
  toggle.addEventListener('click', event => {
    // A mouse click keeps the menu that opened on hover available for selection.
    const mouseHover = matchMedia('(hover: hover)').matches && wrapper.matches(':hover') && event.detail > 0;
    setOpen(mouseHover || list.hidden);
  });
  toggle.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    setOpen(true);
    list.querySelector('a').focus();
  });
  wrapper.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    toggle.focus();
    setOpen(false);
  });
  wrapper.addEventListener('focusout', event => {
    if (!wrapper.contains(event.relatedTarget) && !pointerInside()) setOpen(false);
  });
  document.addEventListener('click', event => {
    if (!wrapper.contains(event.target)) setOpen(false);
  });
  document.querySelector('.hamburger, .gate-menu-button')?.addEventListener('click', () => setOpen(false));
  toggle.addEventListener('click', () => {
    if (list.hidden) return;
    document.querySelector('.gnb')?.classList.remove('mobile-open');
    document.querySelector('.hamburger')?.classList.remove('open');
    document.querySelector('.hamburger')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.gate-menu')?.classList.remove('open');
    document.querySelector('.gate-menu-button')?.setAttribute('aria-expanded', 'false');
  });
})();
