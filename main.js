/* ============================================================
   STUDYCUBE HOMEPAGE — main.js (Fixed)
   ============================================================ */

// ─── HEADER SCROLL ───────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  toggleQuickButtons();
}, { passive: true });

// ─── HAMBURGER MENU ──────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const gnb = document.getElementById('gnb');
if (hamburger && gnb) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    gnb.classList.toggle('mobile-open');
  });
  gnb.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    gnb.classList.remove('mobile-open');
  }));
}

// ─── HERO PARTICLES ──────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  const colors = ['#1a6bc7', '#0ea47a', '#6aacf0', '#25c299', '#3a8ee6', '#7c3aed'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.classList.add('hero-particle');
    const size = Math.random() * 70 + 10;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 14 + 10}s;
      animation-delay:${Math.random() * 12}s;
    `;
    container.appendChild(p);
  }
})();

// ─── COUNTER ANIMATION ───────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

let countersStarted = false;
const counterObserver = new IntersectionObserver(entries => {
  if (countersStarted) return;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countersStarted = true;
      document.querySelectorAll('.kpi-num[data-target]').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const kpiSection = document.querySelector('.partner-kpi-row');
if (kpiSection) counterObserver.observe(kpiSection);

// ─── PARTNER CI MARQUEE ─────────────────────────────────────
// Replace the former text chips with the supplied customer CI images.
const partnerCiRows = [
  ['KETI.png', 'KT.png', 'LGU플러스png.png', 'SK텔레콤.png', '공주시.png', '구로구.png', '그루.png', '노벨.png', '다다르다.png', '당진시.png', '동승.png', '디딤.png', '레즈고.png', '롯데아울렛.png', '마스터플랜.png', '봄날의서재.png', '봉화군.jpg', '비온탑.png', '비허밍.png', '서강대.png', '서울대.png', '서울시.png'],
  ['시작스터디카페.png', '얼리버드.png', '에트리.png', '엠큐뷔.png', '온더테스크.png', '올탑.png', '와이즈.png', '위라운드.png', '유한대.png', '이니셜.png', '이마트.jpg', '전남대병원.png', '전북대병원.png', '탐앤탐스.png', '토즈.png', '팜에이트.png', '한국금거래소.jpg', '한국파이롯트.png', '해양대.png', '해커스.jpg', '화수초등학교.png']
];

partnerCiRows.forEach((row, index) => {
  const track = document.querySelector(`#logo-inner-${index + 1}`);
  if (!track) return;
  const createCi = (fileName) => {
    const item = document.createElement('div');
    item.className = 'partner-logo-item';
    const image = document.createElement('img');
    image.src = `image/partner-ci/${fileName}`;
    image.alt = '';
    item.appendChild(image);
    return item;
  };
  const originals = row.map(createCi);
  track.replaceChildren(...originals, ...originals.map((item) => item.cloneNode(true)));
});

// ─── SCROLL REVEAL ───────────────────────────────────────────
function setupReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
    const parent = el.parentElement;
    const siblings = parent ? Array.from(parent.querySelectorAll(':scope > .reveal, :scope > .reveal-left, :scope > .reveal-right')) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.10}s`;
    observer.observe(el);
  });
}

// ─── PARTNER LOGO SLIDER PAUSE ON HOVER ──────────────────────
document.querySelectorAll('.logo-slider-inner').forEach(el => {
  el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
  el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
});

// ─── QUICK BUTTONS ───────────────────────────────────────────
const quickButtons = document.getElementById('quick-buttons');
function toggleQuickButtons() {
  if (!quickButtons) return;
  quickButtons.classList.toggle('visible', window.scrollY > 300);
}

// ─── SCROLL TO TOP ───────────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── PROPOSAL DOWNLOAD ───────────────────────────────────────
const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    showToast('📄 제안서 요청이 접수되었습니다. 담당자가 이메일로 발송드립니다.');
  });
}

// ─── CONTACT FORM (index.html) ───────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;
  const originalText = btn.textContent;
  btn.textContent = '처리 중...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = originalText;
    btn.disabled = false;
    e.target.reset();
    showToast('✅ 상담 신청이 완료되었습니다! 빠르게 연락드리겠습니다.');
  }, 1300);
}

const CONSULTATION_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwDyxi4cpZJ8FQTqLK8uUyFAoJ5kXRxzVFUWB2nfAHJnWVoUdqhG16Q0zQszNz-bGAN/exec';

async function handleContactSubmit(e) {
  e.preventDefault();
  const terms = document.getElementById('cf-terms');
  if (!terms?.checked) {
    showToast('개인정보 수집 및 이용 동의가 필요합니다.');
    return;
  }

  const btn = e.target.querySelector('.btn-submit-contact');
  if (!btn) return;
  const originalContent = btn.innerHTML;
  const form = e.target;
  const value = (id) => document.getElementById(id)?.value?.trim() || '';
  const payload = {
    name: value('cf-name'),
    contact: value('cf-contact'),
    availableTime: value('cf-time'),
    region: value('cf-region'),
    consultationType: value('cf-type'),
    industry: value('cf-industry'),
    product: value('cf-product'),
    message: value('cf-msg')
  };

  btn.textContent = '접수 중...';
  btn.disabled = true;

  try {
    await fetch(CONSULTATION_SHEET_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    btn.innerHTML = originalContent;
    btn.disabled = false;
    form.reset();
    showToast('도입상담 요청이 완료되었습니다. 담당자가 빠르게 연락드리겠습니다.');
  } catch (error) {
    btn.innerHTML = originalContent;
    btn.disabled = false;
    showToast('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

function toggleTerms() {
  const termsContent = document.getElementById('terms-content');
  if (!termsContent) return;
  termsContent.style.display = termsContent.style.display === 'block' ? 'none' : 'block';
}

// ─── TOAST ───────────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  if (message) toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const selector = this.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    e.preventDefault();
    const offset = (document.getElementById('site-header')?.offsetHeight ?? 70) + 8;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});

// ─── BFK ACC BUTTON ACTIVE TOGGLE ────────────────────────────
document.querySelectorAll('.bfk-acc-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.bfk-acc-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  toggleQuickButtons();
});
