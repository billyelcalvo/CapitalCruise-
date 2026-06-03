// ============================
// Capital Cruise — Main JS
// ============================

document.addEventListener('DOMContentLoaded', () => {
  // ---- Initialize Lucide icons ----
  if (window.lucide) {
    lucide.createIcons();
  }

  // ---- Footer year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile burger toggle ----
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  let menuOpen = false;

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      navLinks.classList.toggle('open', menuOpen);
      // Swap icon
      const icon = burger.querySelector('[data-lucide]');
      if (icon) {
        icon.setAttribute('data-lucide', menuOpen ? 'x' : 'menu');
        lucide.createIcons({ nodes: [icon] });
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        menuOpen = false;
        navLinks.classList.remove('open');
        const icon = burger.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons({ nodes: [icon] });
        }
      });
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.navbar__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '-80px 0px -50% 0px',
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ---- Scroll reveal animation ----
  const revealElements = document.querySelectorAll('.card, .timeline__item, .role-card, .cta-box');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ---- Parallax effect on dashboard mockup ----
  const dashboard = document.getElementById('dashboard-mockup');
  if (dashboard && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener(
      'scroll',
      () => {
        const rect = dashboard.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) * 0.025;
        dashboard.style.transform = `translateY(${offset}px)`;
      },
      { passive: true }
    );
  }

  // ---- Animate dashboard stat values on scroll ----
  const statValues = document.querySelectorAll('.dashboard__stat-value');
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statValues.forEach((el) => statsObserver.observe(el));

  // ---- Animate hero metric values ----
  const metricValues = document.querySelectorAll('.hero__metric-value');
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fade-in-up 0.5s ease forwards';
          metricObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricValues.forEach((el) => metricObserver.observe(el));
});

// ---- Animate numeric values ----
function animateValue(el) {
  const text = el.textContent.trim();
  const original = text;

  const match = text.match(/^([\d,.]+)(.*)$/);
  if (!match) return;

  const endVal = parseFloat(match[1].replace(',', '.'));
  const suffix = match[2];
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
  const duration = 700;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = endVal * eased;

    el.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = original;
    }
  }

  requestAnimationFrame(update);
}
