# 🎈 Balloon Decoration Website

A stunning, fully responsive **balloon decoration business website** built with pure HTML, CSS, and JavaScript. Designed with a clean Indian e-commerce aesthetic inspired by [7eventzz.com](https://7eventzz.com) and [balloondekor.com](https://balloondekor.com).

> **No frameworks. No dependencies. Just open `index.html` and go.**

---

## ✨ Features

### 🎨 Design & UI
- Clean white/light-grey background with **hot pink (#E91E8C)** primary accent
- **Poppins** font family (Google Fonts) — 400, 500, 600, 700 weights
- Glassmorphism-inspired cards with subtle shadows
- Smooth micro-animations and hover effects
- Mobile-first responsive design (Desktop → Tablet → Mobile)
- Page loader with animated balloon emoji

### 📱 Sections (Single Page)
| Section | Description |
|---------|-------------|
| **Top Bar** | City location + phone/WhatsApp quick links |
| **Navbar** | Sticky with scroll shadow, hamburger menu, scroll spy |
| **Hero Banner** | Animated headline, stats, CTA buttons, CSS balloon cluster |
| **Categories** | Horizontal scrollable icon pills with filtering |
| **Services Grid** | 6 service cards with sort/filter, pricing, WhatsApp booking |
| **How It Works** | 3-step process with arrow connectors |
| **Gallery** | Masonry grid with lightbox modal |
| **About Us** | Brand story, stats counters, feature cards |
| **Testimonials** | 6 review cards with ratings, verified badges |
| **Trust Badges** | 4 trust indicators |
| **FAQ** | 6-item accordion with smooth expand/collapse |
| **Contact** | Info card + enquiry form → WhatsApp redirect |
| **Footer** | 4-column layout with links, social icons, copyright |
| **Floating WhatsApp** | Fixed button with pulse animation + tooltip |
| **Mobile Bottom Bar** | Sticky Call + WhatsApp buttons (mobile only) |

### ⚡ JavaScript Modules
- `initNavbar()` — Sticky shadow, hamburger toggle, click-outside close
- `initScrollReveal()` — IntersectionObserver with staggered delays
- `initCategoryFilter()` — Smooth opacity/scale filter + sort
- `initFAQ()` — Accordion with one-open-at-a-time logic
- `initWhatsApp()` — Auto-replaces all placeholder phone/email links
- `initStickyBar()` — Top bar hide on scroll, navbar shadow
- `initScrollSpy()` — Throttled nav link highlighting
- `initContactForm()` — Validation + formatted WhatsApp message redirect

### 🔍 SEO & Performance
- LocalBusiness JSON-LD structured data
- Open Graph + Twitter Card meta tags
- Canonical URL tag
- `font-display: swap` for web fonts
- Critical CSS inlined in `<head>`
- `preconnect` hints for Google Fonts
- Print-optimized CSS stylesheet
- Keyboard focus-visible outlines (WCAG accessibility)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure |
| **CSS3** | Custom properties, Grid, Flexbox, animations |
| **Vanilla JavaScript** | DOM manipulation, IntersectionObserver, event handling |
| **Google Fonts** | Poppins typeface |
| **WhatsApp API** | `wa.me` deep links for booking |

**Zero dependencies. Zero build tools. Zero frameworks.**

---

## 📁 Project Structure

```
Balloon_Decoration/
├── index.html              # Main HTML page (all sections)
├── README.md               # This file
├── css/
│   ├── style.css           # Master stylesheet (~2900 lines)
│   │   ├── CSS Variables    # Design tokens (colors, shadows, radii)
│   │   ├── Reset & Base     # Box-sizing, typography, utilities
│   │   ├── Components       # All section-specific styles
│   │   ├── Responsive       # Media queries (768px, 480px)
│   │   ├── Accessibility    # :focus-visible outlines
│   │   └── Print CSS        # Print-friendly overrides
│   └── animations.css      # @keyframes (fadeUp, pulse, shimmer, etc.)
└── js/
    └── main.js             # All JavaScript modules (~690 lines)
        ├── CONFIG object    # Single source of truth for branding
        ├── 8 init functions # Modular, self-contained
        ├── Lightbox         # Gallery image viewer
        ├── Page Loader      # Auto-dismiss after 800ms
        └── Boot sequence    # DOMContentLoaded orchestration
```

---

## 🚀 Getting Started

### Quick Start
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Balloon_Decoration.git

# Open in browser
cd Balloon_Decoration
open index.html
```

### Local Development Server (Optional)
```bash
# Using Python (built into macOS/Linux)
python3 -m http.server 8000

# Then open: http://localhost:8000
```

### Using VS Code Live Server
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**
3. Auto-reloads on file save

---

## ⚙️ Customization Guide

### Step 1: Update Business Details

Open `js/main.js` and update the `CONFIG` object at the top:

```javascript
const CONFIG = {
  phone: "919876543210",        // WhatsApp number (with country code, no +)
  brand: "Your Brand Name",
  tagline: "Your Tagline Here",
  city: "Your City",
  email: "you@email.com",
  instagram: "@yourhandle",
  defaultMessage: "Hi! I'd like to book a decoration. Can you help me?",
};
```

### Step 2: Replace HTML Placeholders

Search for `CLIENT REPLACE` in the code to find all spots that need updating:

| Placeholder | Replace With | Found In |
|-------------|-------------|----------|
| `BRAND_NAME_HERE` | Your brand name | `index.html`, `main.js` |
| `TAGLINE_HERE` | Your tagline | `index.html`, `main.js` |
| `CITY_HERE` | Your city | `index.html`, `main.js` |
| `CITY_ADDRESS_HERE` | Full street address | `index.html` |
| `PHONE_NUMBER_HERE` | Phone with country code | `index.html`, `main.js` |
| `EMAIL_HERE` | Your email address | `index.html`, `main.js` |
| `INSTAGRAM_HERE` | Instagram handle | `index.html`, `main.js` |
| `example.com` | Your actual domain | `index.html` |

### Step 3: Add Google Maps

Find the map placeholder in the Contact section and replace:

```html
<!-- Replace the placeholder div with your Google Maps iframe -->
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  width="100%"
  height="300"
  style="border:0;"
  allowfullscreen=""
  loading="lazy">
</iframe>
```

### Step 4: Add Real Images (Optional)

Replace the CSS gradient gallery cards with actual images:
```html
<div class="gallery__card"
     style="background: url('images/your-photo.jpg') center/cover;"
     data-label="Birthday Setup"
     onclick="openLightbox(this)">
</div>
```

### Step 5: Update Service Prices

Find each `.service-card` in `index.html` and update:
- `data-price` attribute (for sorting)
- Price display text
- Package names
- WhatsApp booking message

---

## 🌐 Deployment

### GitHub Pages (Free)
1. Push code to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/ (root)`
4. Your site will be live at `https://username.github.io/Balloon_Decoration/`

### Netlify (Free)
1. Connect your GitHub repo at [netlify.com](https://netlify.com)
2. Build command: *(leave empty)*
3. Publish directory: `.`
4. Deploy!

### Vercel (Free)
1. Import your repo at [vercel.com](https://vercel.com)
2. Framework: **Other**
3. Deploy — it auto-detects static sites

### Custom Domain
After deploying, add a `CNAME` file with your domain:
```
www.yourdomain.com
```

---

## 🌍 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Android | 90+ |

---

## 📋 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Hot Pink | `#E91E8C` | Primary — buttons, accents, highlights |
| Orange | `#FF6B35` | Secondary — badges, tags |
| Light Grey | `#FAFAFA` | Page background |
| Light Pink | `#FFF0F8` | Section backgrounds |
| White | `#FFFFFF` | Cards, navbar, footer |
| Dark | `#1A1A2E` | Heading text |
| Muted | `#666680` | Body text |
| Border | `#F0E0EB` | Card borders, dividers |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

If you need help customizing this template for your business:
- Open an [Issue](https://github.com/YOUR_USERNAME/Balloon_Decoration/issues) on GitHub
- Star ⭐ the repo if you find it useful!

---

<p align="center">
  Made with ❤️ and 🎈
</p>
