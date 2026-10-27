/* Brand navigation, product anchors and the study site's image-preview behavior. */
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('hamburger');
  const menu = document.getElementById('gnb');
  if (menuButton && menu) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'gnb');
    const syncMenu = () => {
      const expanded = menu.classList.contains('mobile-open');
      menuButton.setAttribute('aria-expanded', String(expanded));
      menuButton.setAttribute('aria-label', expanded ? '메뉴 닫기' : '메뉴 열기');
    };
    menuButton.addEventListener('click', syncMenu);
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', syncMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('mobile-open')) {
        menu.classList.remove('mobile-open');
        menuButton.classList.remove('open');
        syncMenu();
        menuButton.focus();
      }
    });
  }

  const modal = document.getElementById('control-image-modal');
  const modalImage = modal?.querySelector('img');
  const closeButton = modal?.querySelector('button');
  let trigger = null;
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    trigger?.focus({ preventScroll: true });
  };
  const openModal = (image, button) => {
    if (!modal || !modalImage) return;
    trigger = button;
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    closeButton?.focus();
  };
  document.querySelectorAll('.control-zoomable').forEach(image => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt} 확대 보기`);
    image.addEventListener('click', () => openModal(image, image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(image, image);
      }
    });
  });
  document.querySelectorAll('.control-theme-preview').forEach(button => {
    button.addEventListener('click', () => openModal(button.querySelector('img'), button));
  });
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (!modal || modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') { event.preventDefault(); closeButton?.focus(); }
  });
  document.querySelectorAll('.control-proposal-pending').forEach(button => {
    button.addEventListener('click', () => showToast('컨트롤큐브 제안서를 준비하고 있습니다. 도입문의로 상담해 주세요.'));
  });
});
