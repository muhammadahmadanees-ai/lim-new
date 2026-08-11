# LIM Factory | Premium Terrazzo & Stone Surfaces

Discover premium, handcrafted terrazzo tiles and surfaces designed for high-end residential and commercial spaces. Founded by architects, **LIM Factory (Less Is More)** creates materials that bring back a sense of depth, permanence, and timeless craftsmanship to modern architecture.

This project is a modern web application built using **Next.js 16** and **React 19**, integrated with **Supabase** for database management and realtime updates, **EmailJS** for sample order dispatching, a custom **Admin Portal** with drag-and-drop catalog reordering and analytics, and a comprehensive, search-engine-optimized landing page structure.

---

## 🌟 Key Features

### 1. Immersive Client Showcase
*   **Fluid & Responsive Design**: Elegant, premium typography (Outfit & Blanka) coupled with glassmorphism layouts, CSS grids, and flexbox.
*   **Dynamic Micro-Animations**: Smooth scroll-triggered entry animations (`fade-in-up`), interactive hover state effects, and micro-interactive UI elements.
*   **Terrazzo Visualizer**: A custom-built web application tool letting clients preview custom terrazzo surfaces dynamically in real-time.
*   **Live Fuzzy Search**: Fast, client-side fuzzy search (`SearchModal`) that scans across the entire collections and product catalog instantly.
*   **Recently Viewed Product History**: A client-side tracking system (`RecentlyViewed`) leveraging `localStorage` to display the last 5 products browsed.
*   **Interactive Image Lightbox**: Immersion view overlay (`Lightbox`) for full-screen exploration of high-resolution product photography.
*   **Floating WhatsApp Contact**: Constant, non-intrusive floating chat widget (`WhatsAppButton`) for immediate customer queries.
*   **Smooth Scroll Navigation**: Floating sticky navigation header alongside an animated "Scroll-to-Top" button.
*   **Sample Ordering System**: Direct integrations with EmailJS to capture user address specifications and send automated email confirmations.

### 2. Powerful Admin Portal (`/admin`)
*   **Real-Time CRUD**: Manage stone/terrazzo collections and individual products directly in the browser with immediate Supabase syncing.
*   **Drag-and-Drop Reordering**: Rearrange the display order of collections and products using **SortableJS**, writing order ranks to the database automatically.
*   **Interactive Analytics Dashboard**: Live metrics, collection inventory size, and product category distributions rendered beautifully with **Chart.js**.

---

## 🔍 Search Engine Optimization (SEO) & Structured Data

The website is fully optimized for search engine bots and Google Rich Results:

### 1. Primary Metadata (`app/layout.jsx`)
*   **Browser & Social Titles**: Set up dynamically with Next.js's Metadata API (`title.default`, `title.template`).
*   **Meta Description**: Target keywords regarding premium terrazzo tiles, recycled marble materials, custom sizing, and geographic distribution.
*   **Robots Settings**: Injects standard indexing headers (`index: true, follow: true`) instructing search engines to crawl all public resources.
*   **Geographic Targeting**: Injected meta tags for geo-regions (`geo.region`, `geo.placename` configured for Asia) and regional indexing rules.

### 2. Open Graph & Twitter Cards
*   Provides standardized schemas for Facebook, WhatsApp, LinkedIn, and Twitter/X.
*   Pulls a high-resolution preview cover (`public/tiles_cover.png`, size `1200x630`) ensuring beautiful, high-click-through sharing previews.

### 3. JSON-LD Structured Data Schema (`app/page.jsx`)
Injects four Google-compliant structured data scripts directly into the DOM:
*   **Organization**: Defines corporate identity, branding assets (using `/lim transparent logo (2).png`), contact info (`limfactoryy@gmail.com`), and social channels.
*   **WebSite**: Incorporates site search query formats directly into Google search results.
*   **Product**: Exposes materials, custom sizing flags, worldwide shipping options, and availability schema tags to Google Shopping and search listings.
*   **FAQPage**: Lists 9 pre-filled interactive Q&As matching searcher intent, enabling dropdown answers directly on the Google SERP page.

### 4. Sitemap & Crawl Rules
*   **`public/robots.txt`**: Declares crawl permissions, directs crawlers to index the root directory, blocks system routes (`/_next/`, `/api/`, `/admin/`) from polluting indices, and references the XML sitemap.
*   **`public/sitemap.xml`**: Pre-maps core page sectors (`#collections`, `#faq`, `#contact`) with appropriate priority ranks (up to `1.0`) and contains image-sitemap extensions for `/tiles_cover.png`.

---

## 🛠️ Tech Stack & Libraries

*   **Core Framework**: [Next.js 16.2.7](https://nextjs.org/) (React 19.2.6)
*   **Database & Realtime Backend**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
*   **Styling**: Vanilla CSS using CSS Custom Properties (Variables), Flexbox, Grids, and Webkit keyframe transitions.
*   **Integrations**:
    *   **EmailJS (`@emailjs/browser`)**: Captures user sample requests and coordinates email notifications.
    *   **Chart.js & React-Chartjs-2**: Dynamic charting dashboard on the admin interface.
    *   **SortableJS & React-Sortablejs**: Reorder collection lists using touch-friendly drag-and-drop lists.

---

## 📂 Codebase Structure

```text
├── app/                          # Next.js App Router Pages
│   ├── admin/                    # Admin Portal
│   │   └── page.jsx              # Admin Dashboard (CRUD, Chart.js & SortableJS)
│   ├── globals.css               # Core styling, variables, and typography definitions
│   ├── layout.jsx                # Root HTML layout and primary metadata (SEO API)
│   └── page.jsx                  # Main landing page assembling client components & JSON-LD schemas
├── src/                          # Source directory for reusable assets & logic
│   ├── components/               # Reusable UI components
│   │   ├── About.jsx             # Architectural heritage & craftsmanship showcase
│   │   ├── Collections.jsx       # Grid showcasing various terrazzo collections
│   │   ├── Contact.jsx           # Form with EmailJS integration
│   │   ├── FAQ.jsx               # Interactive accordion matching JSON-LD schemas
│   │   ├── Footer.jsx            # Copyright, brand info, and legal links
│   │   ├── Hero.jsx              # Intro banner utilizing Outfit & Blanka typography
│   │   ├── Lightbox.jsx          # Full-screen image magnifier overlay
│   │   ├── MenuDrawer.jsx        # Navigation drawer for smaller screen viewports
│   │   ├── Navbar.jsx            # Sticky navigation bar with search & sample CTA
│   │   ├── OrderModal.jsx        # Prompt detailing custom samples
│   │   ├── PrivacyModal.jsx      # Interactive Privacy Policy text pop-up
│   │   ├── ProductModal.css      # Detail layout stylesheet
│   │   ├── ProductModal.jsx      # Detail card showing terrazzo aggregates & sizes
│   │   ├── ProductsView.jsx      # Filterable product grid with background prefetch
│   │   ├── RecentlyViewed.jsx    # Local-storage history displaying recent items
│   │   ├── SampleFormModal.jsx   # Form capturing customer sample requirements
│   │   ├── ScrollToTop.css       # Top scroll widget styles
│   │   ├── ScrollToTop.jsx       # Floating scroll-to-top handler
│   │   ├── SearchModal.jsx       # Fuzzy-match catalog search modal
│   │   ├── TermsModal.jsx        # Legal Terms of Service pop-up
│   │   ├── Visualizer.jsx        # Live terrazzo interactive visualizer
│   │   ├── WhatsAppButton.css    # Stylesheet for floating chat widget
│   │   └── WhatsAppButton.jsx    # WhatsApp redirect overlay
│   ├── assets/                   # Local assets & SVGs
│   │   ├── hero.png              # Fallback hero visualizer background
│   │   ├── react.svg             # Tech stack asset
│   │   └── vite.svg              # Tech stack asset
│   ├── index.css                 # Supplementary styles
│   ├── admin.css                 # Custom stylesheet dedicated to the admin portal
│   └── supabase.js               # Supabase instance init & in-memory prefetch cache
├── public/                       # Static files exposed to search crawlers
│   ├── robots.txt                # Search index accessibility declarations
│   ├── sitemap.xml               # Sitemap containing images & priority indexes
│   ├── tiles_cover.png           # Open Graph meta preview card (1200x630 px)
│   ├── lim transparent logo (2).png # Primary branding logo asset
│   ├── favicon.svg               # Vector browser favicon
│   └── icons.svg                 # Generic vectors
├── package.json                  # Dependencies and execution script registers
└── vercel.json                   # Route rewrite settings for Vercel deployment
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 2. Environment Configuration
Create a `.env.local` file in the root directory and configure your Supabase variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies
Navigate to the project root and install all required modules:
```bash
npm install
```

### 4. Running Locally
Start the Next.js local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build & Production Deployment
To compile the application for production:
```bash
npm run build
```

To run the compiled production build:
```bash
npm run start
```

---

## 📄 License
This project is proprietary and built specifically for **LIM Factory**. All rights reserved.
