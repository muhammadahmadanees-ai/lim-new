/**
 * ProductJsonLd — Server Component
 *
 * Generates per-product JSON-LD structured data with:
 *   - Product schema (name, image, description, sku, material, sizes, offers)
 *   - BreadcrumbList schema matching the URL hierarchy
 *
 * Only emits `offers.price` if a real price value exists — never fabricates data.
 */

const BASE_URL = 'https://www.limfactory.co';

export default function ProductJsonLd({ product, collection, breadcrumbs }) {
  const graph = [];

  // ── BreadcrumbList ─────────────────────────────────────────────────────
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  // ── Product ────────────────────────────────────────────────────────────
  const productSchema = {
    '@type': 'Product',
    name: product.name || 'Terrazzo Tile',
    description:
      product.description ||
      'Handcrafted terrazzo tile made from 100% recycled marble chips, suitable for residential and commercial flooring.',
    brand: {
      '@type': 'Brand',
      name: 'LIM Factory',
    },
    material: 'Recycled marble terrazzo',
    manufacturer: {
      '@id': `${BASE_URL}/#organization`,
    },
  };

  // Image
  if (product.img) {
    productSchema.image = [product.img];
  }

  // SKU from refcode
  if (product.refcode) {
    productSchema.sku = product.refcode;
  }

  // Sizes as additionalProperty
  const additionalProps = [];
  if (product.sizes) {
    const sizeList = product.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (sizeList.length > 0) {
      additionalProps.push({
        '@type': 'PropertyValue',
        name: 'Available Sizes',
        value: sizeList.join(', ') + ' cm',
      });
    }
  }
  additionalProps.push({
    '@type': 'PropertyValue',
    name: 'Minimum Order Quantity',
    value: '20 sqft',
  });
  if (additionalProps.length > 0) {
    productSchema.additionalProperty = additionalProps;
  }

  // Offers — only if we have a real URL for this product
  const productUrl = product.slug
    ? `${BASE_URL}/products/${product.slug}`
    : undefined;

  if (productUrl) {
    const offer = {
      '@type': 'Offer',
      url: productUrl,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${BASE_URL}/#organization`,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'PK',
        },
      },
    };

    // Only add price if a real price value exists
    // Price is currently hidden in the UI per business request,
    // so we intentionally omit it from schema to avoid Google penalties.
    // Uncomment and populate when prices are ready to be public:
    //
    // if (product.price) {
    //   offer.priceCurrency = 'PKR';
    //   offer.price = parsedPrice;
    // }

    productSchema.offers = offer;
  }

  graph.push(productSchema);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
