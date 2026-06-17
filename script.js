/* ===========================
   VIVA DRIVING SCHOOL GB
   script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar scroll state ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile burger menu ---- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Close mobile menu on resize back to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) closeMenu();
  });

  /* ---- Scroll reveal (fade-in elements) ---- */
  const revealEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---- Animated stat counters ---- */
  const statNums = document.querySelectorAll('.stat-num');

  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const duration = 1400;
    const start = performance.now();

    const isInt = Number.isInteger(target);

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = isInt ? Math.round(value) : value.toFixed(1);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isInt ? target : target.toFixed(1);
      }
    };
    requestAnimationFrame(step);
  };

  if (statNums.length) {
    if ('IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      statNums.forEach(el => statObserver.observe(el));
    } else {
      statNums.forEach(el => {
        el.textContent = el.getAttribute('data-target');
      });
    }
  }

  /* ---- Contact form (static site — no backend) ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const phone = contactForm.phone.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !phone || !message) return;

      // Build a WhatsApp message so enquiries reach VIVA instantly
      const text = `Hi VIVA Driving School, my name is ${name} (${phone}). ${message}`;
      const waUrl = `https://wa.me/447908969686?text=${encodeURIComponent(text)}`;

      formSuccess.classList.add('show');
      contactForm.reset();

      window.open(waUrl, '_blank', 'noopener');

      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    });
  }

  /* ---- Smooth-scroll offset correction for fixed navbar on hash links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const targetEl = document.querySelector(id);
      if (!targetEl) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
