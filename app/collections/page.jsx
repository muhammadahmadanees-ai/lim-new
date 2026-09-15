/**
 * /collections — Server-rendered Collections Page
 *
 * Renders the homepage layout with the Collections section in focus.
 * Canonical: https://www.limfactory.co/collections
 * Zero hash in URL.
 */

import { fetchAllCollections, fetchAllProducts } from '../../src/lib/supabase-server';
import HomeClient from '../../src/components/HomeClient';
import HomepageProductsJsonLd from '../../src/components/HomepageProductsJsonLd';

export const revalidate = 3600; // ISR: 1 hour

export const metadata = {
  title: 'Terrazzo Tile Collections — LIM Factory',
  description:
    'Explore our premium range of customizable terrazzo tile collections handcrafted from 100% recycled marble by LIM Factory.',
  alternates: {
    canonical: 'https://www.limfactory.co/collections',
  },
  openGraph: {
    title: 'Terrazzo Tile Collections — LIM Factory',
    description:
      'Explore our premium range of customizable terrazzo tile collections handcrafted from 100% recycled marble by LIM Factory.',
    url: 'https://www.limfactory.co/collections',
    siteName: 'LIM Factory',
    images: [{ url: 'https://www.limfactory.co/tiles_cover.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function CollectionsPage() {
  let collections = [];
  let products = [];

  try {
    [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching collections page data:', error);
  }

  return (
    <>
      <HomepageProductsJsonLd collections={collections} products={products} />
      <HomeClient
        initialCollections={collections}
        initialProducts={products}
        initialSection="collections"
      />
    </>
  );
}
