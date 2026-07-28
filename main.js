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
const heroSection = document.getElementById('hero');
if (heroSection) counterObserver.observe(heroSection);

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
