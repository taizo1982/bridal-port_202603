/**
 * Bridal Port - 滋賀の和装結婚式 LP
 * JavaScript for interactions and scroll animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // ==========================================================================
  // Scroll Fade Animation (Intersection Observer)
  // ==========================================================================

  const scrollFadeElements = document.querySelectorAll('.scroll-fade');

  if (scrollFadeElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger the animation slightly for elements that appear together
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 50);
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    scrollFadeElements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  const header = document.querySelector('.header');
  let lastScrollY = 0;
  let ticking = false;

  if (header) {
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const currentScrollY = window.scrollY;

          // Add shadow on scroll
          if (currentScrollY > 10) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }

          // Hide/show header on scroll direction
          if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY) {
              header.style.transform = 'translateY(-100%)';
            } else {
              header.style.transform = 'translateY(0)';
            }
          } else {
            header.style.transform = 'translateY(0)';
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // Parallax Effect for Hero Image
  // ==========================================================================

  const heroImage = document.querySelector('.hero-image');

  if (heroImage) {
    let heroTicking = false;

    window.addEventListener('scroll', function() {
      if (!heroTicking) {
        window.requestAnimationFrame(function() {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;

          if (scrollY < heroHeight) {
            const parallaxOffset = scrollY * 0.3;
            heroImage.style.transform = `translateY(${parallaxOffset}px)`;
          }

          heroTicking = false;
        });
        heroTicking = true;
      }
    });
  }

  // ==========================================================================
  // Timeline Animation for Flow Section
  // ==========================================================================

  const flowItems = document.querySelectorAll('.flow-item');

  if (flowItems.length > 0) {
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger each flow item
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 150);
        }
      });
    }, {
      threshold: 0.2
    });

    flowItems.forEach(item => {
      flowObserver.observe(item);
    });
  }

  // ==========================================================================
  // LINE Button Click Tracking
  // ==========================================================================

  const cvButtons = document.querySelectorAll('[data-cv]');

  cvButtons.forEach(button => {
    button.addEventListener('click', function() {
      const cvType = this.getAttribute('data-cv');

      // Log conversion event (can be replaced with actual analytics)
      console.log('CV Event:', cvType);

      // If Google Analytics is available
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          'event_category': 'conversion',
          'event_label': cvType
        });
      }

      // If dataLayer is available (GTM)
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          'event': 'cv_click',
          'cv_type': cvType
        });
      }
    });
  });

  // ==========================================================================
  // Image Lazy Loading Enhancement
  // ==========================================================================

  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('is-loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ==========================================================================
  // Testimonial Card Hover Effect
  // ==========================================================================

  const testimonialCards = document.querySelectorAll('.testimonial-card');

  testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.08)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });

  // ==========================================================================
  // Pricing Card Number Animation
  // ==========================================================================

  const priceNumbers = document.querySelectorAll('.price-number');

  if (priceNumbers.length > 0) {
    const priceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const finalValue = parseInt(el.textContent.replace(/,/g, ''), 10);
          animateNumber(el, 0, finalValue, 1500);
          priceObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.5
    });

    priceNumbers.forEach(el => {
      priceObserver.observe(el);
    });
  }

  function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const formatter = new Intl.NumberFormat('ja-JP');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(start + (end - start) * easeOut);

      element.textContent = formatter.format(currentValue);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ==========================================================================
  // Mobile Touch Interactions
  // ==========================================================================

  if ('ontouchstart' in window) {
    document.body.classList.add('is-touch-device');

    // Improve touch responsiveness for buttons
    const touchButtons = document.querySelectorAll('.btn, .header-cta');

    touchButtons.forEach(btn => {
      btn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });

      btn.addEventListener('touchend', function() {
        this.style.transform = '';
      }, { passive: true });
    });
  }

  // ==========================================================================
  // Prevent Layout Shift on Font Load
  // ==========================================================================

  if ('fonts' in document) {
    document.fonts.ready.then(function() {
      document.body.classList.add('fonts-loaded');
    });
  }
});

/**
 * コンバージョン追跡用のプレースホルダー
 * ビルド時に実際のコードに置き換えられます
 */
// __CONVERSION_CODE_PLACEHOLDER__
