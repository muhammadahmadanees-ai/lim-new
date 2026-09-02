import { fetchAllCollections, fetchAllProducts } from '../src/lib/supabase-server';
import { slugify } from '../src/lib/slugify';

const BASE_URL = 'https://www.limfactory.co';

export const revalidate = 86400; // ISR: 24 hours

export default async function sitemap() {
  try {
    const [collections, products] = await Promise.all([
      fetchAllCollections(),
      fetchAllProducts(),
    ]);

    const collectionEntries = collections
      .filter((col) => col.type !== 'category')
      .map((col) => ({
        url: `${BASE_URL}/collections/${slugify(col.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
      .filter((entry) => !entry.url.endsWith('/collections/'));

    const productEntries = products
      .map((prod) => ({
        url: `${BASE_URL}/products/${slugify(prod.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
      .filter((entry) => !entry.url.endsWith('/products/'));

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      ...collectionEntries,
      ...productEntries,
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ];
  }
}
