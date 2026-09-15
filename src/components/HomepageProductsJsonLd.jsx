/**
 * HomepageProductsJsonLd — Server Component
 *
 * Generates Product + ItemList JSON-LD structured data for the homepage,
 * built from server-fetched collection and product data.
 *
 * Per the audit (Section 4.2): this must be server-rendered, not client-side injected.
 * No `offers.price` is emitted since LIM Factory uses a quote-based model.
 */

import { slugify } from '../lib/slugify';

const BASE_URL = 'https://www.limfactory.co';

export default function HomepageProductsJsonLd({ collections, products }) {
  if (!collections || collections.length === 0) return null;

  // Only include actual collections (not category folders)
  const realCollections = collections.filter((c) => c.type !== 'category');

  // Build per-collection Product schemas
  const productSchemas = realCollections.map((col) => {
    const colSlug = slugify(col.name);
    const colProducts = (products || []).filter((p) => p.collection_id === col.id);

    // Use the collection image, or fallback to first product image
    const imgUrl =
      col.img || col.image || col.imageurl || col.imgurl || '';
    const firstProductImg = colProducts.length > 0
      ? (colProducts[0].img || colProducts[0].image || colProducts[0].imageurl || '')
      : '';
    const images = [imgUrl, firstProductImg].filter(Boolean);

    // Collect all unique sizes from products in this collection
    const allSizes = new Set();
    colProducts.forEach((p) => {
      const sizes = p.sizes || p.size || '';
      if (typeof sizes === 'string' && sizes.trim()) {
        sizes.split(',').forEach((s) => allSizes.add(s.trim()));
      }
    });
    const sizesValue = allSizes.size > 0
      ? Array.from(allSizes).join(', ')
      : '30×30 cm, 60×60 cm, 60×120 cm, Custom';

    const parent = (col.parent_id || col.parentId)
      ? collections.find((c) => c.id === (col.parent_id || col.parentId))
      : null;
    const colUrl = parent
      ? `${BASE_URL}/collections/${slugify(parent.name)}/${colSlug}`
      : `${BASE_URL}/collections/${colSlug}`;

    return {
      '@type': 'Product',
      '@id': `${BASE_URL}/#product-${colSlug}`,
      name: col.name || 'Terrazzo Tile Collection',
      image: images.length > 0 ? images : [`${BASE_URL}/tiles_cover.png`],
      description:
        col.description ||
        col.desc ||
        `${col.name} — handcrafted terrazzo tile collection made from 100% recycled marble by LIM Factory.`,
      brand: { '@type': 'Brand', name: 'LIM Factory' },
      manufacturer: { '@id': `${BASE_URL}/#organization` },
      material: 'Recycled marble terrazzo',
      category: 'Terrazzo Tiles',
      url: colUrl,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Available Sizes',
          value: sizesValue,
        },
      ],
    };
  });

  // Build ItemList referencing all products
  const itemList = {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#collections-list`,
    name: 'LIM Factory Terrazzo Tile Collections',
    itemListElement: productSchemas.map((ps, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: { '@id': ps['@id'] },
    })),
  };

  // Combine into a single @graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [itemList, ...productSchemas],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
