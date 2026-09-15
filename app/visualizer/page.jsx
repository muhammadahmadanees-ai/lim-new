/**
 * /visualizer — Server-rendered Room Visualizer Page
 *
 * Renders the homepage layout with the Room Visualizer section in focus.
 * Canonical: https://www.limfactory.co/visualizer
 * Zero hash in URL.
 */

import { fetchAllCollections, fetchAllProducts } from '../../src/lib/supabase-server';
import HomeClient from '../../src/components/HomeClient';
import HomepageProductsJsonLd from '../../src/components/HomepageProductsJsonLd';

export const revalidate = 3600; // ISR: 1 hour

export const metadata = {
  title: 'Room Visualizer — Terrazzo Tile Simulator | LIM Factory',
  description:
    'Experience handcrafted terrazzo tiles in your space with LIM Factory’s interactive room visualizer. Preview patterns, chip densities, and finishes.',
  alternates: {
    canonical: 'https://www.limfactory.co/visualizer',
  },
  openGraph: {
    title: 'Room Visualizer — Terrazzo Tile Simulator | LIM Factory',
    description:
      'Experience handcrafted terrazzo tiles in your space with LIM Factory’s interactive room visualizer.',
    url: 'https://www.limfactory.co/visualizer',
    siteName: 'LIM Factory',
    images: [{ url: 'https://www.limfactory.co/tiles_cover.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default async function VisualizerPage() {
  let collections = [];
  let products = [];

  try {
    [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);
  } catch (error) {
    console.error('Error fetching visualizer page data:', error);
  }

  return (
    <>
      <HomepageProductsJsonLd collections={collections} products={products} />
      <HomeClient
        initialCollections={collections}
        initialProducts={products}
        initialSection="visualizer"
      />
    </>
  );
}
