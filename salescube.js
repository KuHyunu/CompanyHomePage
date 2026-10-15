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

  const productLinks = [...document.querySelectorAll('.sales-product-nav a')];
  const selectProduct = id => productLinks.forEach(link => {
    const active = link.hash === `#${id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  productLinks.forEach((link, index) => {
    link.addEventListener('click', () => selectProduct(link.hash.slice(1)));
    link.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? productLinks.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + productLinks.length) % productLinks.length;
      productLinks[next].focus();
      productLinks[next].click();
    });
  });
  if (productLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) selectProduct(entry.target.id); });
    }, { rootMargin: '-40% 0px -25% 0px', threshold: 0 });
    document.querySelectorAll('.sales-product-card').forEach(card => observer.observe(card));
  }

  const modal = document.getElementById('sales-image-modal');
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
  document.querySelectorAll('.sales-zoomable').forEach(image => {
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
  document.querySelectorAll('.sales-theme-preview').forEach(button => {
    button.addEventListener('click', () => openModal(button.querySelector('img'), button));
  });
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (!modal || modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') { event.preventDefault(); closeButton?.focus(); }
  });
  document.querySelectorAll('.sales-proposal-pending').forEach(button => {
    button.addEventListener('click', () => showToast('세일즈큐브 제안서를 준비하고 있습니다. 도입문의로 상담해 주세요.'));
  });
});
