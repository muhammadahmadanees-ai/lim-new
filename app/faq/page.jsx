/**
 * /faq — Server-rendered FAQ Page
 *
 * Renders the homepage layout with the FAQ section in focus.
 * Canonical: https://www.limfactory.co/faq
 * Zero hash in URL.
 */

import { fetchAllCollections, fetchAllProducts } from '../../src/lib/supabase-server';
import HomeClient from '../../src/components/HomeClient';
import HomepageProductsJsonLd from '../../src/components/HomepageProductsJsonLd';

export const revalidate = 3600; // ISR: 1 hour

export const metadata = {
  title: 'FAQ — Frequently Asked Questions | LIM Factory',
  description:
    'Answers to common questions about LIM Factory terrazzo tiles, specifications, custom sizes, international shipping, and sample ordering.',
  alternates: {
    canonical: 'https://www.limfactory.co/faq',
  },
  openGraph: {
    title: 'FAQ — Frequently Asked Questions | LIM Factory',
    description:
      'Answers to common questions about LIM Factory terrazzo tiles, specifications, custom sizes, and ordering.',
    url: 'https://www.limfactory.co/faq',
    siteName: 'LIM Factory',
    images: [{ url: 'https://www.limfactory.co/tiles_cover.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function FAQPage() {
  let collections = [];
  let products = [];

  try {
    [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching FAQ page data:', error);
  }

  // Pre-compute dynamic sizes for FAQ
  const allSizes = new Set();
  products.forEach((prod) => {
    const sizes =
      prod.sizes || prod.size || prod.availablesizes || prod.available_sizes || '';
    if (typeof sizes === 'string' && sizes.trim()) {
      sizes.split(',').forEach((s) => {
        const trimmed = s.trim();
        if (trimmed) allSizes.add(trimmed);
      });
    }
  });
  const sizesArray = Array.from(allSizes).filter((s) => s.length > 0);
  let initialSizes = null;
  if (sizesArray.length > 0) {
    const formatted = sizesArray.map((s) => `<strong>${s.replace(/x/gi, '×')} cm</strong>`);
    if (formatted.length === 1) {
      initialSizes = formatted[0];
    } else if (formatted.length === 2) {
      initialSizes = `${formatted[0]} and ${formatted[1]}`;
    } else {
      const last = formatted.pop();
      initialSizes = `${formatted.join(', ')}, and ${last}`;
    }
  }

  return (
    <>
      <HomepageProductsJsonLd collections={collections} products={products} />
      <HomeClient
        initialCollections={collections}
        initialProducts={products}
        initialSizes={initialSizes}
        initialSection="faq"
      />
    </>
  );
}
