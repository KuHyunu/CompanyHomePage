document.addEventListener('DOMContentLoaded', () => {
  const tickerItems = [...document.querySelectorAll('.ticker-item')];
  if (tickerItems.length > 1) {
    let tickerIndex = 0;
    window.setInterval(() => {
      tickerItems[tickerIndex].classList.remove('is-active');
      tickerIndex = (tickerIndex + 1) % tickerItems.length;
      tickerItems[tickerIndex].classList.add('is-active');
    }, 3200);
  }
  const menuButton = document.querySelector('.gate-menu-button');
  const menu = document.querySelector('.gate-menu');
  const toast = document.querySelector('.gate-toast');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.coming-soon').forEach((button) => button.addEventListener('click', () => {
    toast.textContent = `${button.dataset.service} 서비스 페이지를 준비하고 있습니다.`;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  }));

  const partnerCiRows = [
    ['KETI.png', 'KT.png', 'LGU플러스png.png', 'SK텔레콤.png', '공주시.png', '구로구.png', '그루.png', '노벨.png', '다다르다.png', '당진시.png', '동승.png', '디딤.png', '레즈고.png', '롯데아울렛.png', '마스터플랜.png', '봄날의서재.png', '봉화군.jpg', '비온탑.png', '비허밍.png', '서강대.png', '서울대.png', '서울시.png'],
    ['시작스터디카페.png', '얼리버드.png', '에트리.png', '엠큐뷔.png', '온더테스크.png', '올탑.png', '와이즈.png', '위라운드.png', '유한대.png', '이니셜.png', '이마트.jpg', '전남대병원.png', '전북대병원.png', '탐앤탐스.png', '토즈.png', '팜에이트.png', '한국금거래소.jpg', '한국파이롯트.png', '해양대.png', '해커스.jpg', '화수초등학교.png']
  ];
  document.querySelectorAll('[data-gate-ci-row]').forEach((track) => {
    const row = partnerCiRows[Number(track.dataset.gateCiRow) - 1] ?? [];
    const makeLogo = (fileName) => {
      const card = document.createElement('div');
      card.className = 'gate-logo-item';
      const logo = document.createElement('img');
      logo.src = `image/partner-ci/${fileName}`;
      logo.alt = '';
      card.appendChild(logo);
      return card;
    };
    const originals = row.map(makeLogo);
    track.replaceChildren(...originals, ...originals.map((item) => item.cloneNode(true)));
  });

  const partnerKpi = document.querySelector('.gate-partners-kpi');
  if (partnerKpi) {
    const startCounters = () => document.querySelectorAll('.gate-kpi-num[data-target]').forEach((el) => {
      const target = Number(el.dataset.target);
      const started = Date.now();
      const duration = 1300;
      const tick = () => {
        const progress = Math.min((Date.now() - started) / duration, 1);
        el.textContent = Math.floor(target * progress).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    new IntersectionObserver((entries, observer) => { if (entries[0]?.isIntersecting) { startCounters(); observer.disconnect(); } }, { threshold: .35 }).observe(partnerKpi);
  }

  window.handleGateConsultSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('.gate-consult-submit');
    const terms = form.querySelector('#gate-consult-terms');
    if (!terms?.checked) return;
    button.disabled = true;
    button.textContent = '상담 요청을 접수했습니다';
    form.reset();
    const notice = document.querySelector('.gate-toast');
    if (notice) {
      notice.textContent = '상담 신청이 완료되었습니다. 영업일 기준 24시간 이내 연락드립니다.';
      notice.classList.add('show');
      window.setTimeout(() => notice.classList.remove('show'), 4500);
    }
    window.setTimeout(() => {
      button.disabled = false;
      button.innerHTML = '✉&nbsp; 도입상담 요청완료';
    }, 1600);
  };
});
