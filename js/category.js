/**
 * category.js — Shared logic for all category pages
 * (category-birthday.html, category-anniversary.html, etc.)
 *
 * Assumes CONFIG object is defined in main.js and loaded first:
 *   CONFIG = { phone: "91XXXXXXXXXX", brand: "...", city: "..." }
 *
 * Load order in HTML:
 *   <script src="js/main.js"></script>
 *   <script src="js/category.js"></script>
 */

'use strict';

/* ─────────────────────────────────────────────
   Internal State — active filter values
   ───────────────────────────────────────────── */
let activeSubcat = 'all';
let activeVenue  = 'all';

/* ─────────────────────────────────────────────
   Helper — get all design cards
   ───────────────────────────────────────────── */
function getCards() {
  return Array.from(document.querySelectorAll('.design-card'));
}

/* ─────────────────────────────────────────────
   1. applyFilters() — combined AND logic
      Called by both filter pill click handlers.
      A card is visible only when BOTH active
      filters match (or are "all").
   ───────────────────────────────────────────── */
function applyFilters() {
  const cards = getCards();

  cards.forEach(card => {
    const cardSubcat = (card.dataset.subcategory || '').trim().toLowerCase();
    const cardVenue  = (card.dataset.venue || '').trim().toLowerCase();

    const subcatMatch = activeSubcat === 'all' || cardSubcat === activeSubcat;
    const venueMatch  = activeVenue  === 'all' || cardVenue  === activeVenue;

    if (subcatMatch && venueMatch) {
      card.classList.remove('hidden');
      // Trigger reflow so the CSS transition fires after removing hidden
      void card.offsetWidth;
      card.style.opacity  = '1';
      card.style.transform = 'translateY(0)';
    } else {
      card.style.opacity  = '0';
      card.style.transform = 'translateY(8px)';
      // Add .hidden after the fade-out transition completes
      setTimeout(() => {
        // Re-check: don't re-hide if filter changed again during timeout
        const sc = (card.dataset.subcategory || '').trim().toLowerCase();
        const vn = (card.dataset.venue || '').trim().toLowerCase();
        const scMatch = activeSubcat === 'all' || sc === activeSubcat;
        const vnMatch = activeVenue  === 'all' || vn === activeVenue;
        if (!(scMatch && vnMatch)) {
          card.classList.add('hidden');
        }
      }, 300); // matches transition duration in CSS
    }
  });

  // Update results counter — run after the 300ms hide-timeout settles
  setTimeout(() => {
    const counter = document.getElementById('results-counter');
    if (!counter) return;
    const visibleCount = getCards().filter(c => !c.classList.contains('hidden')).length;
    counter.textContent = `${visibleCount} design${visibleCount !== 1 ? 's' : ''} found`;
  }, 320); // slightly after the 300ms card-hide timeout
}

/* ─────────────────────────────────────────────
   2. initSubcategoryFilter()
      Pills: .subcat-pill
      Card attribute: data-subcategory
   ───────────────────────────────────────────── */
function initSubcategoryFilter() {
  const pills = document.querySelectorAll('.subcat-pill');
  if (!pills.length) {
    console.warn('[category.js] initSubcategoryFilter: no .subcat-pill elements found.');
    return;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill styling
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Update active filter state
      activeSubcat = (pill.dataset.filter || 'all').trim().toLowerCase();

      applyFilters();
    });
  });
}

/* ─────────────────────────────────────────────
   3. initVenueFilter()
      Pills: .venue-pill
      Card attribute: data-venue
   ───────────────────────────────────────────── */
function initVenueFilter() {
  const pills = document.querySelectorAll('.venue-pill');
  if (!pills.length) {
    console.warn('[category.js] initVenueFilter: no .venue-pill elements found.');
    return;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill styling
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Update active filter state
      activeVenue = (pill.dataset.filter || 'all').trim().toLowerCase();

      applyFilters();
    });
  });
}

/* ─────────────────────────────────────────────
   4. initSort()
      Sorts visible .design-card elements in the
      grid container by DOM reordering.
      Select: #sort-select
      Options: "popular" | "rating" | "newest"
      Card attributes:
        data-rating      (number, e.g. 4.8)
        data-popularity  (number, higher = more popular)
        data-date        (number, higher = newer)
   ───────────────────────────────────────────── */
function initSort() {
  const select = document.getElementById('sort-select');
  if (!select) {
    console.warn('[category.js] initSort: #sort-select not found.');
    return;
  }

  select.addEventListener('change', () => {
    const sortBy  = select.value; // "popular" | "rating" | "newest"
    const cards   = getCards();
    const grid    = cards[0]?.parentElement;

    if (!grid) {
      console.warn('[category.js] initSort: could not find grid container.');
      return;
    }

    // Sort ALL cards (hidden ones maintain position within their filtered group)
    const sorted = [...cards].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
        case 'newest':
          return parseFloat(b.dataset.date || 0) - parseFloat(a.dataset.date || 0);
        case 'popular':
        default:
          return parseFloat(b.dataset.popularity || 0) - parseFloat(a.dataset.popularity || 0);
      }
    });

    // Re-append in sorted order (DOM move, no re-render of HTML)
    sorted.forEach(card => grid.appendChild(card));
  });
}

/* ─────────────────────────────────────────────
   5. initCardWhatsApp()
      For each .enquire-btn inside a .design-card,
      opens a WhatsApp chat with a pre-filled message.
      Uses CONFIG.phone from main.js.
   ───────────────────────────────────────────── */
function initCardWhatsApp() {
  const btns = document.querySelectorAll('.design-card .enquire-btn');
  if (!btns.length) {
    console.warn('[category.js] initCardWhatsApp: no .enquire-btn elements found.');
    return;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();

      const card     = btn.closest('.design-card');
      const title    = (card?.dataset.title    || 'this design').trim();
      const category = (card?.dataset.category || 'Balloon Decoration').trim();

      const message = `Hi! I'm interested in the '${title}' design from your ${category} collection. Could you share more details and pricing?`;

      // Safely read CONFIG — it must be defined in main.js
      let phone = '';
      if (typeof CONFIG !== 'undefined' && CONFIG.phone) {
        phone = String(CONFIG.phone).replace(/\D/g, ''); // strip non-digits
      } else {
        console.warn('[category.js] CONFIG.phone is not defined. Falling back to empty phone.');
      }

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

/* ─────────────────────────────────────────────
   6. initRelatedCategoryHover()
      Adds touch-friendly hover effect to
      .related-category-card elements.
      Pure CSS handles :hover; this adds
      .touch-active on touchstart for touch devices.
   ───────────────────────────────────────────── */
function initRelatedCategoryHover() {
  const cards = document.querySelectorAll('.related-category-card');
  if (!cards.length) {
    console.warn('[category.js] initRelatedCategoryHover: no .related-category-card elements found.');
    return;
  }

  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      // Small delay so the visual feedback is perceivable
      setTimeout(() => card.classList.remove('touch-active'), 200);
    }, { passive: true });

    card.addEventListener('touchcancel', () => {
      card.classList.remove('touch-active');
    }, { passive: true });
  });
}

/* ─────────────────────────────────────────────
   7. DOMContentLoaded — init all modules
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  try {
    initSubcategoryFilter();
  } catch (err) {
    console.warn('[category.js] initSubcategoryFilter failed:', err);
  }

  try {
    initVenueFilter();
  } catch (err) {
    console.warn('[category.js] initVenueFilter failed:', err);
  }

  try {
    initSort();
  } catch (err) {
    console.warn('[category.js] initSort failed:', err);
  }

  try {
    initCardWhatsApp();
  } catch (err) {
    console.warn('[category.js] initCardWhatsApp failed:', err);
  }

  try {
    initRelatedCategoryHover();
  } catch (err) {
    console.warn('[category.js] initRelatedCategoryHover failed:', err);
  }

});
