/* sub.js — 서브페이지 공통 스크립트 */

// Header scroll effect
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        toggleQuick();
    }, { passive: true });
}

// Hamburger
const ham = document.getElementById('hamburger');
const gnb = document.getElementById('gnb');
if (ham && gnb) {
    ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        gnb.classList.toggle('mobile-open');
    });
    gnb.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        ham.classList.remove('open');
        gnb.classList.remove('mobile-open');
    }));
}

// Quick Buttons
const quickBtns = document.getElementById('quick-buttons');
function toggleQuick() {
    if (quickBtns) quickBtns.classList.toggle('visible', window.scrollY > 250);
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const sel = this.getAttribute('href');
        if (!sel || sel === '#') return;
        const target = document.querySelector(sel);
        if (!target) return;
        e.preventDefault();
        const h = document.getElementById('site-header')?.offsetHeight ?? 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - h - 8, behavior: 'smooth' });
    });
});

// Scroll Reveal
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el, i) => {
    const siblings = Array.from((el.parentElement || document.body).querySelectorAll(':scope > .reveal, :scope > .reveal-left, :scope > .reveal-right'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.09}s`;
    revealObs.observe(el);
});

// Lineup Tabs (kiosk page)
document.querySelectorAll('.ltab').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.lineup-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const panel = document.getElementById(this.dataset.tab);
        if (panel) {
            panel.classList.add('active');
            panel.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
                setTimeout(() => el.classList.add('visible'), 50);
            });
        }
    });
});

// BFK Accessibility Button Toggle
document.querySelectorAll('.bfk-acc-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.bfk-acc-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Barrier-free kiosk screen slider
document.querySelectorAll('.bf-image-slider').forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('.bf-slide'));
    const dots = Array.from(slider.querySelectorAll('.bf-slider-dots button'));
    let current = 0;

    const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    };

    slider.querySelector('.bf-slider-prev')?.addEventListener('click', () => show(current - 1));
    slider.querySelector('.bf-slider-next')?.addEventListener('click', () => show(current + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
});

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    if (msg) t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4500);
}

// Init
window.addEventListener('DOMContentLoaded', () => { toggleQuick(); });
window.addEventListener('scroll', toggleQuick, { passive: true });
