import './globals.css';
import JsonLdSchema from '../src/components/JsonLdSchema';

const BASE_URL = 'https://www.limfactory.co';

export const metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Primary SEO ──────────────────────────────────────────────────────────
  title: {
    default: 'LIM Factory | Premium Terrazzo Tiles & Terrazzo Chips Tiles',
    template: '%s | LIM Factory',
  },
  description:
    'Buy premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble. LIM Factory offers custom terrazzo flooring for residential & commercial spaces across Asia. Request free samples today.',
  keywords: [
    'terrazzo tile',
    'terrazzo chips tile',
    'buy terrazzo tiles',
    'terrazzo floor tiles',
    'custom terrazzo flooring',
    'terrazzo chips flooring',
    'handmade terrazzo tiles',
    'recycled marble terrazzo',
    'terrazzo tiles Asia',
    'terrazzo tiles online',
    'terrazzo mosaic tiles',
    'luxury floor tiles',
    'LIM Factory terrazzo',
    'terrazzo slabs',
    'pressed terrazzo tiles',
    'terrazzo tiles for home',
    'terrazzo tiles for commercial spaces',
  ],
  authors: [{ name: 'LIM Factory', url: BASE_URL }],
  creator: 'LIM Factory',
  publisher: 'LIM Factory',

  // ── Canonical & Alternates ───────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph (Facebook, WhatsApp, LinkedIn) ────────────────────────────
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'LIM Factory',
    title: 'LIM Factory | Premium Terrazzo Tiles & Terrazzo Chips Tiles',
    description:
      'Handcrafted terrazzo tiles and terrazzo chips tiles made from 100% recycled marble. Custom sizes available for homes and commercial spaces.',
    images: [
      {
        url: `${BASE_URL}/tiles_cover.png`,
        width: 1200,
        height: 630,
        alt: 'LIM Factory — Premium Terrazzo Tiles and Terrazzo Chips Tiles',
      },
    ],
    locale: 'en_US',
  },

  // ── Twitter / X Card ────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'LIM Factory | Premium Terrazzo Tiles & Terrazzo Chips Tiles',
    description:
      'Handcrafted terrazzo tiles and terrazzo chips tiles made from 100% recycled marble. Custom sizes available.',
    images: [`${BASE_URL}/tiles_cover.png`],
  },

  // ── Google Search Console Verification ──────────────────────────────────
  // TODO: Replace with your actual verification code from Google Search Console
  // verification: {
  //   google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  // },

  // ── Category ────────────────────────────────────────────────────────────
  category: 'Building Materials & Home Design',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.cdnfonts.com/css/blanka" rel="stylesheet" />

        {/* Geo / Regional targeting for Asia */}
        <meta name="geo.region" content="AS" />
        <meta name="geo.placename" content="Asia" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />

        {/* Server-rendered JSON-LD structured data for search engines */}
        <JsonLdSchema />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
