/* Additional category behavior; shared STUDYCUBE scripts own scrolling/forms. */
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
});
