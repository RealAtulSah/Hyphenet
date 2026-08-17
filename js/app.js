/**
 * Hyphenet Enterprises - Core Interactive Script
 * Pure Vanilla JavaScript (Zero External Dependencies)
 * v2.0 — Enhanced with scroll-reveal animations and smooth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initHeroSlider();
  initCounters();
  initCatalogTabs();
  initTestimonialSlider();
  initFaqAccordion();
  initQuoteModal();
  initContactForm();
  initMobileNav();
  initDropdownDeepLinks();
  initScrollReveal();
});

/* ==========================================================================
   1. Sticky Header & ScrollSpy
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScroll = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ScrollSpy for Nav Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Hero Carousel (5 Dynamic Slides)
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const container = document.querySelector('.hero-slider-container');

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5500);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      showSlide(targetIndex);
      startAutoPlay();
    });
  });

  // Touch swipe support for hero slider
  if (container) {
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          showSlide(currentIndex + 1);
        } else {
          showSlide(currentIndex - 1);
        }
        startAutoPlay();
      }
    }, { passive: true });

    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* ==========================================================================
   3. Counter Animation (IntersectionObserver) — Eased
   ========================================================================== */
function initCounters() {
  const counterClients = document.getElementById('counterClients');
  const counterUnits = document.getElementById('counterUnits');

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const rawProgress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = easeOutExpo(rawProgress);
      const val = Math.floor(easedProgress * (end - start) + start);
      element.textContent = `${val.toLocaleString('en-IN')}${suffix}`;
      if (rawProgress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateValue(counterClients, 0, 100, 1800, '+');
        animateValue(counterUnits, 0, 5000, 2200, '+');
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
}

/* ==========================================================================
   4. Products & Services 5-Tab Catalog (with fade animation)
   ========================================================================== */
function initCatalogTabs() {
  const tabButtons = document.querySelectorAll('.catalog-tab-btn');
  const tabPanes = document.querySelectorAll('.catalog-tab-pane');

  if (!tabButtons.length) return;

  function switchTab(tabId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    tabPanes.forEach(pane => {
      const isTarget = pane.id === `pane-${tabId}`;
      pane.classList.toggle('active', isTarget);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  window.switchProductCatalogTab = switchTab;
}

/* ==========================================================================
   5. Dropdown Deep Linking to Product Tabs
   ========================================================================== */
function initDropdownDeepLinks() {
  const deepLinks = document.querySelectorAll('[data-tab-target]');
  deepLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const tabTarget = link.getAttribute('data-tab-target');
      if (tabTarget && window.switchProductCatalogTab) {
        window.switchProductCatalogTab(tabTarget);
      }
    });
  });
}

/* ==========================================================================
   6. Testimonial Carousel (smooth crossfade)
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  if (!slides.length) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 6000);
}

/* ==========================================================================
   7. 10-Item FAQ Accordion (smooth max-height)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        const otherBtn = otherItem.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. Instant Quote Modal (Web3Forms Integrated)
   ========================================================================== */
const WEB3FORMS_KEY = '7acce36c-cb21-437e-a09a-9df2571e970f';

async function sendWeb3FormData(form, submitBtn, successEl, customSubject, onSuccessCallback) {
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 6px;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
      </svg>
      Sending Proposal...
    `;
  }

  const formData = new FormData(form);
  formData.append('access_key', WEB3FORMS_KEY);
  formData.append('from_name', 'Hyphenet Web Portal');
  formData.append('subject', customSubject || `[Hyphenet Lead] ${document.title.split('|')[0].trim()}`);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      form.reset();
      form.style.display = 'none';
      if (successEl) successEl.style.display = 'block';
      if (onSuccessCallback) onSuccessCallback(true);
    } else {
      alert(result.message || 'Submission failed. Please call our sales team directly at +91 9354045878');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
      if (onSuccessCallback) onSuccessCallback(false);
    }
  } catch (error) {
    console.error('Web3Forms Error:', error);
    alert('Could not submit request. Please call us at +91 9354045878 or email sales@hyphenet.net');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
    if (onSuccessCallback) onSuccessCallback(false);
  }
}

function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const quoteButtons = document.querySelectorAll('.open-quote-modal');
  const productInput = document.getElementById('modalProductInput');
  const modalForm = document.getElementById('modalQuoteForm');
  const successMsg = document.getElementById('modalSuccessMessage');

  if (!modal) return;

  function openModal(productName = 'Enterprise Hardware') {
    if (productInput) productInput.value = productName;
    if (successMsg) successMsg.style.display = 'none';
    if (modalForm) {
      modalForm.style.display = 'block';
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Quick Request &rarr;';
      }
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  quoteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const prod = btn.getAttribute('data-product') || 'Enterprise Hardware';
      openModal(prod);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const hardwareName = productInput ? productInput.value : 'Hardware';
      const customerName = modalForm.querySelector('input[name="name"]')?.value || 'Client';
      const subject = `[Hyphenet Instant Quote] ${hardwareName} - ${customerName}`;
      const submitBtn = modalForm.querySelector('button[type="submit"]');

      sendWeb3FormData(modalForm, submitBtn, successMsg, subject, (success) => {
        if (success) {
          setTimeout(closeModal, 3500);
        }
      });
    });
  }
}

/* ==========================================================================
   9. Main Proposal Contact Form & Sidebar Form (Web3Forms Integrated)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Determine dynamic subject line based on page / form content
    let subject = `[Hyphenet Lead] ${document.title.split('|')[0].trim()}`;
    const nameVal = form.querySelector('input[name="name"]')?.value || 'Client';
    const roleVal = form.querySelector('select[name="role_applied"]')?.value;
    const hardwareVal = form.querySelector('select[name="hardware_category"], select[name="hardware_needed"], input[name="selected_hardware"]')?.value;

    if (roleVal) {
      subject = `[Hyphenet Career Application] ${roleVal} - ${nameVal}`;
    } else if (hardwareVal) {
      subject = `[Hyphenet Quote Request] ${hardwareVal} - ${nameVal}`;
    } else {
      subject = `[Hyphenet Proposal Request] ${nameVal} (${document.title.split('|')[0].trim()})`;
    }

    sendWeb3FormData(form, submitBtn, successAlert, subject);
  });
}

/* ==========================================================================
   10. Mobile Navigation & Dropdown Accordion System
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  // Toggle main mobile drawer
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('mobile-open');
    toggleBtn.classList.toggle('active', isOpen);
  });

  // Handle dropdown toggle on mobile touch
  const navItems = navMenu.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown-menu');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          const isAlreadyOpen = item.classList.contains('dropdown-open');

          // If not currently open, prevent default navigation and expand the accordion
          if (!isAlreadyOpen) {
            e.preventDefault();
            navItems.forEach(other => {
              if (other !== item) other.classList.remove('dropdown-open');
            });
            item.classList.add('dropdown-open');
          }
        }
      });
    }
  });

  // Close drawer on clicking direct child links (not parent categories)
  navMenu.querySelectorAll('.dropdown-link, .nav-item:not(:has(.dropdown-menu)) .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        navMenu.classList.remove('mobile-open');
        toggleBtn.classList.remove('active');
      }
    });
  });

  // Close drawer on click outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      navMenu.classList.remove('mobile-open');
      toggleBtn.classList.remove('active');
    }
  });
}

/* ==========================================================================
   11. Scroll Reveal Animation System (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  // Auto-tag sections and grids with reveal classes
  const sectionsToReveal = document.querySelectorAll(
    '.about-section, .values-section, .benefits-section, .why-section, ' +
    '.products-section, .testimonials-section, .query-section, .faq-section, ' +
    '.metrics-section, .blog-section, .page-content-section'
  );

  sectionsToReveal.forEach(section => {
    // Tag section headers
    const headers = section.querySelectorAll('.section-header-center, .section-label, .section-title, .section-desc');
    headers.forEach(h => {
      if (!h.classList.contains('reveal') && !h.closest('.reveal')) {
        h.classList.add('reveal');
      }
    });
  });

  // Tag grids with stagger
  const gridsToStagger = document.querySelectorAll(
    '.values-grid, .benefits-grid, .products-grid, .blog-grid, ' +
    '.office-hubs-grid, .careers-grid, .blog-full-grid, .process-steps-grid, ' +
    '.feature-checklist-grid, .why-differentiator-list, .faq-list'
  );

  gridsToStagger.forEach(grid => {
    grid.classList.add('reveal-stagger');
  });

  // Tag two-column layouts
  const leftPanels = document.querySelectorAll('.about-card-left, .why-left-box, .cta-left-box');
  leftPanels.forEach(el => el.classList.add('reveal-left'));

  const rightPanels = document.querySelectorAll('.about-content-right, .why-right-list, .testimonial-slider');
  rightPanels.forEach(el => el.classList.add('reveal-right'));

  // Tag misc elements
  const miscReveals = document.querySelectorAll(
    '.query-form-card, .spec-matrix-wrapper, .sidebar-card, .metric-counter-box'
  );
  miscReveals.forEach(el => el.classList.add('reveal'));

  // Now observe all reveal elements
  const allRevealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger'
  );

  if (!allRevealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        // Once revealed, stop observing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  allRevealElements.forEach(el => {
    revealObserver.observe(el);
  });
}
