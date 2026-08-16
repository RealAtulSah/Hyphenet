/**
 * Hyphenet Enterprises - Core Interactive Script
 * Pure Vanilla JavaScript (Zero External Dependencies)
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
});

/* ==========================================================================
   1. Sticky Header & ScrollSpy
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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

  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* ==========================================================================
   3. Counter Animation (IntersectionObserver)
   ========================================================================== */
function initCounters() {
  const counterClients = document.getElementById('counterClients');
  const counterUnits = document.getElementById('counterUnits');

  function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
      element.textContent = `${val.toLocaleString('en-IN')}${suffix}`;
      if (progress < 1) {
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
        animateValue(counterClients, 0, 100, 1200, '+');
        animateValue(counterUnits, 0, 5000, 1500, '+');
      }
    });
  }, { threshold: 0.3 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
}

/* ==========================================================================
   4. Products & Services 5-Tab Catalog
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
      pane.classList.toggle('active', pane.id === `pane-${tabId}`);
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
   6. Testimonial Carousel
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
   7. 10-Item FAQ Accordion
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
   8. Instant Quote Modal
   ========================================================================== */
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
    if (modalForm) modalForm.style.display = 'block';
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
      modalForm.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
      setTimeout(closeModal, 3000);
    });
  }
}

/* ==========================================================================
   9. Main Proposal Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    if (successAlert) successAlert.style.display = 'block';
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

