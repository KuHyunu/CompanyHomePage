(() => {
  const wrapper = document.querySelector('.gate-service-nav');
  if (!wrapper) return;
  const toggle = wrapper.querySelector('.gate-service-toggle');
  const list = wrapper.querySelector('.gate-service-dropdown');
  let pinned = false;
  let closeTimer;
  let pointer;
  const pointerInside = () => {
    if (!pointer) return false;
    const buttonBox = wrapper.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const within = box => pointer.x >= box.left && pointer.x <= box.right &&
      pointer.y >= box.top && pointer.y <= box.bottom;
    const crossingGap = pointer.x >= listBox.left && pointer.x <= listBox.right &&
      pointer.y >= buttonBox.bottom && pointer.y <= listBox.top;
    return within(buttonBox) || within(listBox) || crossingGap;
  };
  const cancelClose = () => { clearTimeout(closeTimer); };
  const setOpen = open => {
    cancelClose();
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    wrapper.classList.toggle('is-open', open);
  };
  const close = () => { pinned = false; setOpen(false); };
  wrapper.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && matchMedia('(hover: hover) and (min-width: 761px)').matches) setOpen(true);
  });
  const scheduleClose = () => {
    cancelClose();
    closeTimer = setTimeout(() => {
      const hovered = wrapper.matches(':hover') || list.matches(':hover') || pointerInside();
      const focusInsideList = list.contains(document.activeElement);
      const mouseMenu = matchMedia('(hover: hover) and (min-width: 761px)').matches;
      if (!hovered && (mouseMenu || (!pinned && !focusInsideList))) close();
    }, 120);
  };
  wrapper.addEventListener('pointerleave', scheduleClose);
  list.addEventListener('pointerenter', cancelClose);
  list.addEventListener('pointerleave', scheduleClose);
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (list.hidden) return;
    if (pointerInside()) cancelClose();
    else scheduleClose();
  }, { passive: true });
  toggle.addEventListener('click', () => {
    pinned = !pinned;
    setOpen(pinned);
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
    toggle.focus();
    close();
  });
  wrapper.addEventListener('focusout', event => {
    if (!wrapper.contains(event.relatedTarget) && !wrapper.matches(':hover')) close();
  });
  document.addEventListener('click', event => { if (!wrapper.contains(event.target)) close(); });
  list.addEventListener('click', event => {
    if (!event.target.closest('a, button')) return;
    close();
    document.querySelector('.gate-menu')?.classList.remove('open');
    document.querySelector('.gate-menu-button')?.setAttribute('aria-expanded', 'false');
  });
  document.querySelector('.gate-menu-button')?.addEventListener('click', close);
  matchMedia('(max-width:760px)').addEventListener('change', close);
})();
