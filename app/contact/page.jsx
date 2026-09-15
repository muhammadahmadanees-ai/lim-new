/**
 * /contact — Server-rendered Contact Page
 *
 * Renders the homepage layout with the Contact section in focus.
 * Canonical: https://www.limfactory.co/contact
 * Zero hash in URL.
 */

import { fetchAllCollections, fetchAllProducts } from '../../src/lib/supabase-server';
import HomeClient from '../../src/components/HomeClient';
import HomepageProductsJsonLd from '../../src/components/HomepageProductsJsonLd';

export const revalidate = 3600; // ISR: 1 hour

export const metadata = {
  title: 'Contact Us — Get in Touch | LIM Factory',
  description:
    'Contact LIM Factory for custom terrazzo orders, architectural consultations, quotes, and sample requests. Reach out via WhatsApp, phone, or email.',
  alternates: {
    canonical: 'https://www.limfactory.co/contact',
  },
  openGraph: {
    title: 'Contact Us — Get in Touch | LIM Factory',
    description:
      'Contact LIM Factory for custom terrazzo orders, quotes, and sample requests.',
    url: 'https://www.limfactory.co/contact',
    siteName: 'LIM Factory',
    images: [{ url: 'https://www.limfactory.co/tiles_cover.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function ContactPage() {
  let collections = [];
  let products = [];

  try {
    [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching contact page data:', error);
  }

  return (
    <>
      <HomepageProductsJsonLd collections={collections} products={products} />
      <HomeClient
        initialCollections={collections}
        initialProducts={products}
        initialSection="contact"
      />
    </>
  );
}
