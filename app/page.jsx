/**
 * Homepage — Server Component (SSR/ISR)
 *
 * Fetches collections and products server-side from Supabase, then passes
 * the data to <HomeClient> (client component) as serializable props.
 *
 * This eliminates the "Loading collections catalog..." and "Loading tiles..."
 * placeholder text that crawlers previously saw — the HTML now contains
 * real catalog data in the initial server response.
 *
 * Also injects server-rendered Product/ItemList JSON-LD for SEO (Section 4.2).
 *
 * ISR revalidates every hour so Supabase is queried at most once per hour,
 * not once per visitor — dramatically reducing egress bandwidth.
 */

import { fetchAllCollections, fetchAllProducts } from '../src/lib/supabase-server';
import HomeClient from '../src/components/HomeClient';
import HomepageProductsJsonLd from '../src/components/HomepageProductsJsonLd';

export const revalidate = 3600; // ISR: revalidate every 1 hour

export default async function HomePage() {
  let collections = [];
  let products = [];

  try {
    [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Fallback: let client components fetch their own data
  }

  // Pre-compute dynamic sizes for FAQ (avoids extra client-side Supabase query)
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
      {/* Server-rendered Product/ItemList JSON-LD (invisible markup in <head>) */}
      <HomepageProductsJsonLd collections={collections} products={products} />

      {/* Client-side interactive homepage shell with server-fetched data */}
      <HomeClient
        initialCollections={collections}
        initialProducts={products}
        initialSizes={initialSizes}
      />
    </>
  );
}
