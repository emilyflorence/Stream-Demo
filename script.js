/* StreamUp — landing page interactions */
(function () {
  'use strict';

  // 1) Animated stat counters
  const counters = document.querySelectorAll('.stats__num');
  const animate = (el) => {
    const target = parseInt(el.dataset.count || '0', 10);
    if (!target) return;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((c) => io.observe(c));

  // 2) Reveal-on-scroll for headings, cards
  const revealTargets = document.querySelectorAll('.section__head, .match, .league, .feature, .faq, .cta-strip__inner, .form');
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i, 8) * 40) + 'ms';
  });
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach((el) => ro.observe(el));

  // 3) Form: lightweight client-side validation + faux submit
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      if (!data.name || !data.email || !data.password) {
        btn.textContent = 'Please complete every field';
        btn.style.background = '#ff4d3d';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
        }, 1800);
        return;
      }
      btn.textContent = '✓ Redirecting to packages…';
      btn.style.background = '#2ee59d';
      btn.style.color = '#0a0c10';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 2200);
    });
  }

  // 4) FAQ: ensure only one open at a time (nice polish)
  const faqs = document.querySelectorAll('.faq');
  faqs.forEach((f) => {
    f.addEventListener('toggle', () => {
      if (f.open) {
        faqs.forEach((other) => { if (other !== f) other.open = false; });
      }
    });
  });
})();
