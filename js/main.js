/* ============================================
   THE MISAMIS COAST — Main JavaScript
   Scroll animations, navigation, and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll-triggered animations via IntersectionObserver ----
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .gallery__item--blur'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => revealObserver.observe(el));

  // ---- Navbar scroll state ----
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;
  let ticking = false;

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ---- Mobile hamburger menu ----
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
      if (navOverlay) navOverlay.classList.toggle('is-active');
      document.body.style.overflow = navLinks.classList.contains('is-open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      navLinks.classList.remove('is-open');
      navOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('is-open')) {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        if (navOverlay) navOverlay.classList.remove('is-active');
        document.body.style.overflow = '';
      }
    });
  });

  // ---- Smooth scrolling for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Parallax effect (for resort page) ----
  const parallaxBgs = document.querySelectorAll('.parallax-bg[data-speed]');
  
  if (parallaxBgs.length > 0) {
    let parallaxTicking = false;

    function updateParallax() {
      const scrolled = window.scrollY;
      parallaxBgs.forEach(bg => {
        const speed = parseFloat(bg.dataset.speed) || 0.3;
        const rect = bg.parentElement.getBoundingClientRect();
        const offset = (rect.top + scrolled) * speed;
        bg.style.transform = `translateY(${scrolled * speed - offset}px)`;
      });
      parallaxTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ---- Page loaded transition ----
  document.body.classList.add('page-transition');

  // ---- Active nav link highlighting ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

});
