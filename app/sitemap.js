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

    const staticRoutes = [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/visualizer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
      { url: `${BASE_URL}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ];

    const categoryEntries = collections
      .filter((col) => col.type === 'category')
      .map((cat) => ({
        url: `${BASE_URL}/collections/${slugify(cat.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    const collectionEntries = [];
    collections
      .filter((col) => col.type !== 'category')
      .forEach((col) => {
        const colSlug = slugify(col.name);
        const parent = col.parent_id
          ? collections.find((c) => c.id === col.parent_id)
          : null;

        if (parent) {
          collectionEntries.push({
            url: `${BASE_URL}/collections/${slugify(parent.name)}/${colSlug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
        collectionEntries.push({
          url: `${BASE_URL}/collections/${colSlug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });

    const productEntries = products
      .map((prod) => ({
        url: `${BASE_URL}/products/${slugify(prod.name)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
      .filter((entry) => !entry.url.endsWith('/products/'));

    return [
      ...staticRoutes,
      ...categoryEntries,
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
