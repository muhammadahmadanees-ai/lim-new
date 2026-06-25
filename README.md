# LIM Factory | Premium Terrazzo & Stone Surfaces

Premium, handcrafted terrazzo tiles and surfaces designed for high-end residential and commercial spaces. **LIM Factory (Less Is More)** is a full-stack e-commerce application with a powerful admin portal for managing collections, products, and analytics.

**🌐 Live Site:** https://www.limfactory.co/

## Features

- **Immersive Showcase**: Fluid & responsive design with glassmorphism, dynamic micro-animations, and elegant typography (Outfit & Blanka)
- **Terrazzo Visualizer**: Real-time interactive preview of surfaces with custom canvas-based perspective mapping
- **Advanced Search & History**: Instant fuzzy search across catalog + local-storage-based recently viewed products
- **Sample Ordering System**: Seamless EmailJS integration for automated order confirmations and inquiries
- **Admin Portal** (`/admin`): Real-time CRUD operations, drag-and-drop product reordering, and interactive Chart.js analytics
- **Zero Loading States**: In-memory prefetching and Supabase caching for instantaneous page transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16, React 19 |
| **Database & Backend** | Supabase (PostgreSQL, Realtime) |
| **Styling** | Vanilla CSS (variables, grids, flexbox, animations) |
| **Email & Orders** | EmailJS |
| **Admin Features** | SortableJS (drag-and-drop), Chart.js (analytics) |
| **Hosting** | Vercel |

## Architecture

```
User → Next.js Frontend → Supabase
                      ↓
                  Realtime Sync
                      ↓
              Admin Portal (CRUD, Reorder, Analytics)
```

## Project Structure

```text
├── app/                           # Next.js App Router
│   ├── admin/page.jsx             # Admin dashboard (CRUD, analytics, sorting)
│   ├── page.jsx                   # Client landing page
│   ├── layout.jsx                 # Root layout & metadata
│   └── globals.css                # Core styles & variables
├── src/components/
│   ├── Collections.jsx            # Material collection grid
│   ├── ProductsView.jsx           # Collection detail view
│   ├── ProductModal.jsx           # Product details modal
│   ├── Visualizer.jsx             # Interactive terrazzo preview
│   ├── OrderModal.jsx             # Sample request form
│   └── SearchModal.jsx            # Fuzzy search dialog
├── src/supabase.js                # Supabase client & prefetch cache
├── public/                        # Static assets
└── vercel.json                    # Vercel config
```

## Local Development

Clone and install:
```bash
git clone https://github.com/muhammadahmadanees-ai/limstore.git
cd limstore
npm install
```

Set up environment variables (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Run the dev server:
```bash
npm run dev
```
Open http://localhost:3000

Build for production:
```bash
npm run build
npm run start
```

## Environment Variables

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` — EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` — EmailJS template ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — EmailJS public key

## Deployment

Deployed on **Vercel** with automatic deployments from GitHub. The admin portal syncs in real-time with Supabase, and all static assets are optimized for production.

## Repository

https://github.com/muhammadahmadanees-ai/limstore

## License

Proprietary. Built specifically for **LIM Factory**. All rights reserved.
