/* ============================================
   BRAND_NAME_HERE — Main JavaScript
   Complete Implementation — All Modules
   ============================================ */


/* ─────────────────────────────────────────────
   SITE CONFIG (single source of truth)
   CLIENT REPLACE: Update all values below
   ───────────────────────────────────────────── */
const CONFIG = {
  phone: "PHONE_NUMBER_HERE",
  brand: "BRAND_NAME_HERE",
  tagline: "TAGLINE_HERE",
  city: "CITY_HERE",
  email: "EMAIL_HERE",
  instagram: "@INSTAGRAM_HERE",
  defaultMessage: "Hi! I'd like to book a decoration. Can you help me?",
  whatsappBase: "https://wa.me/",
};


/* ─────────────────────────────────────────────
   HELPER — Build WhatsApp URL
   Used by all WhatsApp CTAs across the site
   ───────────────────────────────────────────── */
function getWhatsAppURL(message) {
  const msg = encodeURIComponent(message || CONFIG.defaultMessage);
  return `${CONFIG.whatsappBase}${CONFIG.phone}?text=${msg}`;
}


/* ─────────────────────────────────────────────
   HELPER — Throttle function
   Limits function calls to once per `limit` ms
   ───────────────────────────────────────────── */
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}


/* ═══════════════════════════════════════════════
   1. NAVBAR
   Shadow on scroll, hamburger toggle,
   close on link tap, close on ESC,
   close on click outside
   ═══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navbar-hamburger');
  const menu = document.getElementById('navbar-menu');
  const navLinks = document.querySelectorAll('.navbar__link');

  if (!navbar || !hamburger || !menu) return;

  // --- Hamburger toggle ---
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('open');
    menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // --- Close menu on nav link click ---
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // --- Close menu on ESC ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- Close menu on click outside ---
  document.addEventListener('click', (e) => {
    if (
      menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // --- Shadow on scroll past 60px ---
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 100), { passive: true });

  function closeMenu() {
    hamburger.classList.remove('open');
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  console.log('[init] Navbar ready ✓');
}


/* ═══════════════════════════════════════════════
   2. SCROLL REVEAL
   IntersectionObserver — adds .visible to .reveal
   elements when 15% in viewport.
   Supports: data-delay for individual delays,
   auto-stagger for .reveal-grid children
   ═══════════════════════════════════════════════ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);

          if (delay > 0) {
            setTimeout(() => el.classList.add('visible'), delay);
          } else {
            el.classList.add('visible');
          }

          observer.unobserve(el);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));

  // --- Auto-stagger children of .reveal-grid ---
  document.querySelectorAll('.reveal-grid').forEach((grid) => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, index) => {
      if (!child.dataset.delay) {
        child.dataset.delay = String(index * 100);
      }
    });
  });

  console.log(`[init] Scroll Reveal ready — ${revealElements.length} elements ✓`);
}


/* ═══════════════════════════════════════════════
   3. CATEGORY FILTER + SORT
   Click category pill → filter cards with
   smooth opacity/scale transitions.
   Sort pills reorder cards in the DOM.
   ═══════════════════════════════════════════════ */
function initCategoryFilter() {
  const pills = document.querySelectorAll('.category-pill');
  const cards = document.querySelectorAll('.service-card');
  const sortPills = document.querySelectorAll('.sort-pill');
  const gridContainer = document.getElementById('services-grid-container');

  if (pills.length === 0 || cards.length === 0) return;

  // --- Category filter with smooth transitions ---
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      // Update active pill
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.category;

      cards.forEach((card) => {
        if (category === 'all') {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = 'auto';
          card.classList.remove('hidden');
        } else {
          const cardCategories = card.dataset.category || '';
          if (cardCategories.includes(category)) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.pointerEvents = 'auto';
            card.classList.remove('hidden');
          } else {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
            card.style.pointerEvents = 'none';
            // Don't add .hidden — keep layout, just visually fade
          }
        }
      });
    });
  });

  // --- Sort pills ---
  if (sortPills.length > 0 && gridContainer) {
    sortPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        sortPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const sortType = pill.dataset.sort;
        const cardsArray = Array.from(gridContainer.querySelectorAll('.service-card'));

        cardsArray.sort((a, b) => {
          if (sortType === 'popular') {
            return parseInt(a.dataset.popular || '99') - parseInt(b.dataset.popular || '99');
          } else if (sortType === 'price-low') {
            return parseInt(a.dataset.price || '0') - parseInt(b.dataset.price || '0');
          } else if (sortType === 'new') {
            const aNew = a.dataset.new === 'true' ? 0 : 1;
            const bNew = b.dataset.new === 'true' ? 0 : 1;
            return aNew - bNew;
          }
          return 0;
        });

        // Re-append in sorted order
        cardsArray.forEach((card) => gridContainer.appendChild(card));
      });
    });
  }

  // Add CSS transition to cards for smooth filter effect
  cards.forEach((card) => {
    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  });

  console.log('[init] Category Filter ready ✓');
}


/* ═══════════════════════════════════════════════
   4. FAQ ACCORDION
   Click question → toggle answer with smooth
   max-height transition. Only one open at a time.
   Plus/minus icon toggles via CSS rotation.
   ═══════════════════════════════════════════════ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq__item');

  if (faqItems.length === 0) return;

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items first
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const btn = other.querySelector('.faq__question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  console.log('[init] FAQ Accordion ready ✓');
}


/* ═══════════════════════════════════════════════
   5. WHATSAPP INTEGRATION
   Global URL builder + replace all placeholder
   hrefs + attach click handlers to card CTAs
   ═══════════════════════════════════════════════ */
function initWhatsApp() {
  // --- Replace all wa.me placeholder links ---
  const waLinks = document.querySelectorAll('a[href*="wa.me/PHONE_NUMBER_HERE"]');
  waLinks.forEach((link) => {
    const href = link.getAttribute('href');
    link.setAttribute('href', href.replace(/PHONE_NUMBER_HERE/g, CONFIG.phone));
  });

  // --- Replace all tel: placeholder links ---
  const telLinks = document.querySelectorAll('a[href*="tel:PHONE_NUMBER_HERE"]');
  telLinks.forEach((link) => {
    link.setAttribute('href', `tel:${CONFIG.phone}`);
  });

  // --- Replace all mailto: placeholder links ---
  const mailLinks = document.querySelectorAll('a[href*="mailto:EMAIL_HERE"]');
  mailLinks.forEach((link) => {
    link.setAttribute('href', `mailto:${CONFIG.email}`);
  });

  // --- Attach click handlers to card CTA buttons ---
  const cardCTAs = document.querySelectorAll('.service-card__cta');
  cardCTAs.forEach((btn) => {
    // Remove inline onclick if present (we'll use event listener)
    btn.removeAttribute('onclick');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      bookOnWhatsApp(btn);
    });
  });

  // --- Set floating WhatsApp href ---
  const floatBtn = document.getElementById('whatsapp-float');
  if (floatBtn) {
    floatBtn.setAttribute('href', getWhatsAppURL(CONFIG.defaultMessage));
  }

  // --- Set mobile bar WhatsApp href ---
  const mobileWA = document.querySelector('.mobile-bottom-bar__btn--wa');
  if (mobileWA) {
    mobileWA.setAttribute('href', getWhatsAppURL(CONFIG.defaultMessage));
  }

  // --- Set mobile bar Call href ---
  const mobileCall = document.querySelector('.mobile-bottom-bar__btn--call');
  if (mobileCall) {
    mobileCall.setAttribute('href', `tel:${CONFIG.phone}`);
  }

  console.log('[init] WhatsApp Integration ready ✓');
}


/* ─────────────────────────────────────────────
   GLOBAL: Book on WhatsApp (card CTA)
   Opens wa.me with package name in message
   ───────────────────────────────────────────── */
function bookOnWhatsApp(btn) {
  const packageName = btn.dataset.package || 'a decoration';
  const message = `Hi! I'd like to book the *${packageName}* package. Please share details.`;
  const url = getWhatsAppURL(message);
  window.open(url, '_blank');
}


/* ═══════════════════════════════════════════════
   6. STICKY BAR + TOP BAR
   - Hide top bar on scroll down
   - Add shadow to navbar on scroll
   - Mobile sticky bar is always visible via CSS
   ═══════════════════════════════════════════════ */
function initStickyBar() {
  const navbar = document.getElementById('navbar');
  const topBar = document.getElementById('top-bar');

  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateBar() {
    const currentScrollY = window.scrollY;

    // Add shadow to navbar when scrolled past 60px
    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide top bar when scrolled past 80px
    if (topBar) {
      if (currentScrollY > 80) {
        topBar.style.transform = 'translateY(-100%)';
        topBar.style.opacity = '0';
        topBar.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        topBar.style.position = 'relative';
      } else {
        topBar.style.transform = 'translateY(0)';
        topBar.style.opacity = '1';
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateBar);
      ticking = true;
    }
  }, { passive: true });

  console.log('[init] Sticky Bar ready ✓');
}


/* ═══════════════════════════════════════════════
   7. TESTIMONIAL SLIDER
   Auto-scroll testimonial cards horizontally
   (future enhancement — structure ready)
   ═══════════════════════════════════════════════ */
function initTestimonialSlider() {
  console.log('[init] Testimonial Slider ready ✓');
}


/* ═══════════════════════════════════════════════
   8. SCROLL SPY
   Throttled scroll listener that highlights
   the nav link matching the current section
   ═══════════════════════════════════════════════ */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = [];

  // Build sections array from nav links
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.substring(1));
      if (section) {
        sections.push({ el: section, link: link });
      }
    }
  });

  if (sections.length === 0) return;

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    let currentSection = null;

    // Find which section is in the viewport center
    const viewportCenter = scrollY + windowHeight * 0.35;

    sections.forEach(({ el, link }) => {
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionBottom = sectionTop + rect.height;

      if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
        currentSection = link;
      }
    });

    // Update active states
    if (currentSection) {
      navLinks.forEach((link) => link.classList.remove('active'));
      currentSection.classList.add('active');
    }
  }

  // Throttled scroll listener (16ms ≈ 60fps)
  window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });

  // Run once on load
  updateActiveLink();

  console.log('[init] Scroll Spy ready ✓');
}


/* ═══════════════════════════════════════════════
   GLOBAL: LIGHTBOX — Gallery image viewer
   Open: copies gradient + icon into modal
   Close: click backdrop / ESC / close button
   ═══════════════════════════════════════════════ */
function openLightbox(cardEl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxCard = document.getElementById('lightbox-card');
  const lightboxLabel = document.getElementById('lightbox-label');

  if (!lightbox || !lightboxCard) return;

  // Copy the card's gradient bg and icon
  const bg = cardEl.style.background || cardEl.style.backgroundImage || '';
  const icon = cardEl.querySelector('.gallery__card-icon');
  const label = cardEl.dataset.label || '';

  lightboxCard.style.background = bg;
  lightboxCard.innerHTML = icon ? icon.outerHTML : '';

  // Scale up the icon inside lightbox
  const lbIcon = lightboxCard.querySelector('.gallery__card-icon');
  if (lbIcon) {
    lbIcon.style.fontSize = '5rem';
  }

  lightboxLabel.textContent = label;

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════════
   9. CONTACT FORM
   Validate → format message → open WhatsApp
   Red border + shake on invalid fields
   "Opening WhatsApp..." loading state for 1s
   ═══════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('cf-submit');

  if (!form || !submitBtn) return;

  // Set min date to today
  const dateField = document.getElementById('cf-date');
  if (dateField) {
    const today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather fields
    const nameField = document.getElementById('cf-name');
    const phoneField = document.getElementById('cf-phone');
    const eventField = document.getElementById('cf-event');
    const dateField = document.getElementById('cf-date');
    const messageField = document.getElementById('cf-message');

    const requiredFields = [
      { el: nameField, value: nameField.value.trim() },
      { el: phoneField, value: phoneField.value.trim() },
      { el: eventField, value: eventField.value },
      { el: dateField, value: dateField.value },
    ];

    // Clear previous errors
    form.querySelectorAll('.form-input').forEach((input) => {
      input.classList.remove('error');
    });

    // Validate required fields
    let hasError = false;
    let firstError = null;

    requiredFields.forEach((field) => {
      if (!field.value) {
        field.el.classList.add('error');
        hasError = true;
        if (!firstError) firstError = field.el;
      }
    });

    // Phone number format check (basic — at least 10 digits)
    if (phoneField.value.trim() && !/^\d{10,15}$/.test(phoneField.value.trim().replace(/[\s\-\+]/g, ''))) {
      phoneField.classList.add('error');
      hasError = true;
      if (!firstError) firstError = phoneField;
    }

    if (hasError) {
      // Focus first error field
      if (firstError) firstError.focus();
      return;
    }

    // Build multi-line WhatsApp message
    const msgParts = [
      `Hi! New Enquiry from Website 🎈`,
      ``,
      `*Name:* ${nameField.value.trim()}`,
      `*Phone:* ${phoneField.value.trim()}`,
      `*Event:* ${eventField.value}`,
      `*Date:* ${dateField.value}`,
    ];

    if (messageField.value.trim()) {
      msgParts.push(`*Message:* ${messageField.value.trim()}`);
    }

    msgParts.push(``, `— Sent from ${CONFIG.brand} website`);

    const fullMessage = msgParts.join('\n');
    const waURL = getWhatsAppURL(fullMessage);

    // Show loading state on button
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Opening WhatsApp...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    submitBtn.style.cursor = 'wait';

    setTimeout(() => {
      window.open(waURL, '_blank');

      // Reset button after short delay
      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';
      }, 500);

      // Reset form
      form.reset();
    }, 1000);
  });

  // Remove error styling on focus
  form.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.classList.remove('error');
    });
  });

  console.log('[init] Contact Form ready ✓');
}


/* ═══════════════════════════════════════════════
   10. MOBILE MENU
   Handle opening and closing the mobile drawer
   ═══════════════════════════════════════════════ */
function initMobileMenu() {
  const burger = document.getElementById('header-burger');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (!burger || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);

  console.log('[init] Mobile Menu ready ✓');
}

/* ═══════════════════════════════════════════════
   BOOT — DOMContentLoaded
   Initialize all modules in order
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  console.log(`[${CONFIG.brand}] Initializing...`);

  // Dismiss page loader
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });
    }, 800);
  }

  // Core UI
  initNavbar();
  initStickyBar();
  initScrollReveal();
  initScrollSpy();
  initMobileMenu();

  // Interactive modules
  initCategoryFilter();
  initFAQ();
  initWhatsApp();
  initTestimonialSlider();
  initContactForm();

  // Lightbox ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  console.log(`[${CONFIG.brand}] All modules loaded ✓`);
});


document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile dropdowns
    const dropdownToggles = document.querySelectorAll('.mobile-has-dropdown > a');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const parentLi = this.parentElement;
        
        // Close others
        document.querySelectorAll('.mobile-has-dropdown').forEach(item => {
          if (item !== parentLi) {
            item.classList.remove('open');
          }
        });
        
        // Toggle current
        parentLi.classList.toggle('open');
      });
    });
});
