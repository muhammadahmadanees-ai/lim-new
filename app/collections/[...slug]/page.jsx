/**
 * /collections/[...slug] — Server-rendered hierarchical collection and category page
 *
 * Supports:
 *   - /collections/[category]               -> e.g. /collections/tiles
 *   - /collections/[category]/[collection]  -> e.g. /collections/tiles/single-body-tiles
 *   - /collections/[collection]             -> e.g. /collections/single-body-tiles (backward-compatible)
 *
 * SSG at build time via generateStaticParams, revalidated every 24 hours (ISR).
 * Zero hash (#) fragments in breadcrumbs, links, and canonical URLs.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAllCollections, fetchProductsByCollection } from '../../../src/lib/supabase-server';
import { slugify } from '../../../src/lib/slugify';

export const revalidate = 86400; // ISR: revalidate every 24 hours

const BASE_URL = 'https://www.limfactory.co';

// Helper to resolve route parameters to either a category or a collection
function resolveRoute(collections, slugArray) {
  if (!slugArray || slugArray.length === 0) return null;

  if (slugArray.length === 1) {
    const s = slugArray[0];
    // 1. Check if it's a category (e.g. 'tiles')
    const category = collections.find(
      (c) => c.type === 'category' && slugify(c.name) === s
    );
    if (category) {
      const childCollections = collections.filter(
        (c) => c.parent_id === category.id
      );
      return { type: 'category', item: category, children: childCollections, parent: null };
    }

    // 2. Check if it's a direct collection (e.g. 'single-body-tiles')
    const collection = collections.find(
      (c) => c.type !== 'category' && slugify(c.name) === s
    );
    if (collection) {
      const parent = collection.parent_id
        ? collections.find((c) => c.id === collection.parent_id)
        : null;
      return { type: 'collection', item: collection, children: [], parent };
    }

    return null;
  }

  if (slugArray.length === 2) {
    const parentSlug = slugArray[0];
    const colSlug = slugArray[1];

    const parent = collections.find(
      (c) => slugify(c.name) === parentSlug
    );
    if (!parent) return null;

    const collection = collections.find(
      (c) => c.parent_id === parent.id && slugify(c.name) === colSlug
    );
    if (collection) {
      return { type: 'collection', item: collection, children: [], parent };
    }

    return null;
  }

  return null;
}

// ── Generate static params for all categories & collections ──────────────
export async function generateStaticParams() {
  const collections = await fetchAllCollections();
  const params = [];

  const categories = collections.filter((c) => c.type === 'category');
  const leafCollections = collections.filter((c) => c.type !== 'category');

  // 1. Categories: ['tiles']
  categories.forEach((cat) => {
    const catSlug = slugify(cat.name);
    if (catSlug) {
      params.push({ slug: [catSlug] });
    }
  });

  // 2. Leaf collections with parent: ['tiles', 'single-body-tiles']
  leafCollections.forEach((col) => {
    const colSlug = slugify(col.name);
    if (!colSlug) return;

    const parent = col.parent_id
      ? collections.find((c) => c.id === col.parent_id)
      : null;

    if (parent) {
      const parentSlug = slugify(parent.name);
      if (parentSlug) {
        params.push({ slug: [parentSlug, colSlug] });
      }
    }

    // Also single-segment collection for backward compatibility
    params.push({ slug: [colSlug] });
  });

  return params;
}

// ── Dynamic metadata per collection or category ─────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collections = await fetchAllCollections();
  const route = resolveRoute(collections, slug);

  if (!route) {
    return { title: 'Collection Not Found' };
  }

  const { type, item, parent } = route;
  const isCategory = type === 'category';

  let canonicalPath = '';
  if (isCategory) {
    canonicalPath = `/collections/${slugify(item.name)}`;
  } else if (parent) {
    canonicalPath = `/collections/${slugify(parent.name)}/${slugify(item.name)}`;
  } else {
    canonicalPath = `/collections/${slugify(item.name)}`;
  }

  const title = isCategory
    ? `${item.name} Terrazzo Collections — LIM Factory`
    : `${item.name} — Terrazzo Tiles by LIM Factory`;

  const description =
    item.description ||
    (isCategory
      ? `Explore handcrafted terrazzo tile collections in the ${item.name} category made from 100% recycled marble by LIM Factory.`
      : `Explore the ${item.name} collection of premium terrazzo tiles handcrafted from 100% recycled marble by LIM Factory.`);

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: 'LIM Factory',
      images: item.img
        ? [{ url: item.img, width: 1200, height: 630, alt: item.name }]
        : [{ url: `${BASE_URL}/tiles_cover.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: item.img ? [item.img] : [`${BASE_URL}/tiles_cover.png`],
    },
  };
}

// ── Page Component ──────────────────────────────────────────────────────
export default async function CollectionCatchAllPage({ params }) {
  const { slug } = await params;
  const collections = await fetchAllCollections();
  const route = resolveRoute(collections, slug);

  if (!route) {
    notFound();
  }

  const { type, item, children, parent } = route;
  const isCategory = type === 'category';

  // Build Breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Collections', url: `${BASE_URL}/collections` },
  ];

  if (isCategory) {
    breadcrumbs.push({
      name: item.name,
      url: `${BASE_URL}/collections/${slugify(item.name)}`,
    });
  } else {
    if (parent) {
      breadcrumbs.push({
        name: parent.name,
        url: `${BASE_URL}/collections/${slugify(parent.name)}`,
      });
    }
    const currentUrl = parent
      ? `${BASE_URL}/collections/${slugify(parent.name)}/${slugify(item.name)}`
      : `${BASE_URL}/collections/${slugify(item.name)}`;
    breadcrumbs.push({
      name: item.name,
      url: currentUrl,
    });
  }

  // If leaf collection, fetch products
  let products = [];
  if (!isCategory) {
    products = await fetchProductsByCollection(item.id);
  }

  const pageUrl = breadcrumbs[breadcrumbs.length - 1].url;

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      },
      {
        '@type': 'CollectionPage',
        name: item.name,
        description:
          item.description ||
          (isCategory
            ? `Handcrafted terrazzo tile collections in ${item.name} by LIM Factory.`
            : `Premium terrazzo tiles from the ${item.name} collection by LIM Factory.`),
        url: pageUrl,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  };

  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/lim_transparent_logo.png`;

  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Clean Navbar ── */}
        <header id="navbar" className="scrolled">
          <div className="container nav-container mobile-nav-layout">
            <Link href="/" className="logo nav-mobile-center">
              <img
                src={logoUrl}
                alt="LIM Factory Logo"
                className="logo-img"
              />
              <span className="logo-text">
                <span style={{ color: '#000000' }}>L</span>
                <span style={{ color: '#7b7474' }}>I</span>
                <span style={{ color: '#d47b07' }}>M</span>{' '}
                <span style={{ color: '#000000' }}>F</span>
                <span style={{ color: '#8f0606' }}>ACT</span>
                <span style={{ color: '#000000' }}>OR</span>
                <span style={{ color: '#004aad' }}>Y</span>
              </span>
            </Link>
            <nav>
              <ul className="nav-links pc-only-flex">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/collections">Collections</Link></li>
                <li><Link href="/visualizer">Visualizer</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* ── Breadcrumbs ── */}
        <section className="section" style={{ paddingTop: '120px', paddingBottom: '0' }}>
          <div className="container">
            <nav
              className="explorer-breadcrumbs"
              style={{ marginBottom: '1rem' }}
              aria-label="Breadcrumb"
            >
              <Link href="/" className="breadcrumb-item">
                <i className="fas fa-home" style={{ marginRight: '4px' }}></i> Home
              </Link>
              <span className="breadcrumb-sep">&gt;</span>
              <Link href="/collections" className="breadcrumb-item">
                Collections
              </Link>
              {isCategory ? (
                <>
                  <span className="breadcrumb-sep">&gt;</span>
                  <span className="breadcrumb-item active">{item.name}</span>
                </>
              ) : (
                <>
                  {parent && (
                    <>
                      <span className="breadcrumb-sep">&gt;</span>
                      <Link
                        href={`/collections/${slugify(parent.name)}`}
                        className="breadcrumb-item"
                      >
                        {parent.name}
                      </Link>
                    </>
                  )}
                  <span className="breadcrumb-sep">&gt;</span>
                  <span className="breadcrumb-item active">{item.name}</span>
                </>
              )}
            </nav>
          </div>
        </section>

        {/* ── Category or Collection Content ── */}
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="container">
            <div className="section-header">
              <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{item.name}</h1>
              {item.description && (
                <p>{item.description}</p>
              )}
            </div>

            {/* If Category: display child collection cards */}
            {isCategory ? (
              children.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem 0' }}>
                  No sub-collections found in this category.
                </p>
              ) : (
                <div className="grid collections-grid" id="collections-container">
                  {children.map((child) => {
                    const childColSlug = slugify(child.name);
                    const childHref = `/collections/${slugify(item.name)}/${childColSlug}`;
                    const childImg = child.img || child.image || child.imageurl || '';

                    return (
                      <Link
                        href={childHref}
                        key={child.id}
                        className="collection-card fade-in-up explorer-card"
                        style={{
                          opacity: 1,
                          transform: 'translateY(0)',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <div
                          className="img-placeholder explorer-card-img"
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          {childImg ? (
                            <Image
                              src={childImg}
                              alt={`${child.name} — terrazzo tile collection by LIM Factory`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{
                                objectFit: 'contain',
                                padding: '1.5rem',
                                boxSizing: 'border-box',
                              }}
                            />
                          ) : (
                            <i className="fas fa-layer-group fa-4x" style={{ color: '#ccc' }}></i>
                          )}
                        </div>
                        <div className="card-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <i className="fas fa-layer-group" style={{ color: 'var(--accent-color)' }}></i>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>
                              Collection
                            </span>
                          </div>
                          <h3 style={{ fontWeight: 'bold' }}>{child.name}</h3>
                          <p className="card-desc">{child.description || child.desc || ''}</p>
                          <span className="link view-products-btn">
                            View Products <span className="arrow-icon">&rarr;</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )
            ) : (
              /* If Collection: display product grid */
              products.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '3rem 0' }}>
                  No products found in this collection.
                </p>
              ) : (
                <div className="grid" id="products-container">
                  {products.map((prod) => {
                    const prodSlug = slugify(prod.name);
                    const imgUrl =
                      prod.img || prod.image || prod.imageurl || prod.imgurl || '';
                    const prodName = prod.name || prod.title || 'Unnamed';
                    const prodDesc =
                      prod.description || prod.desc || prod.detail || '';
                    const prodRefcode =
                      prod.refcode || prod.referencecode || prod.code || '';

                    return (
                      <Link
                        href={`/products/${prodSlug}`}
                        key={prod.id}
                        className="collection-card fade-in-up"
                        style={{
                          opacity: 1,
                          transform: 'translateY(0)',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <div
                          className="img-placeholder"
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={`${prodName} — terrazzo tile by LIM Factory`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{
                                objectFit: 'contain',
                                padding: '1.5rem',
                                boxSizing: 'border-box',
                              }}
                            />
                          ) : (
                            <span>Product Image</span>
                          )}
                        </div>
                        <div className="card-content">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              width: '100%',
                              gap: '0.4rem',
                            }}
                          >
                            <h3
                              style={{
                                margin: 0,
                                fontWeight: 'bold',
                                width: '100%',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontSize: '1.2rem',
                                textAlign: 'left',
                                lineHeight: '1.2',
                              }}
                            >
                              {prodName}
                            </h3>
                            {prodRefcode && (
                              <span className="ref-code" style={{ fontWeight: 'normal' }}>
                                {prodRefcode}
                              </span>
                            )}
                          </div>
                          <p className="card-desc" style={{ marginTop: '0.4rem' }}>
                            {prodDesc}
                          </p>
                          <span className="link view-details-btn">
                            View Details <span className="arrow-icon">&rarr;</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )
            )}

            {/* ── Back button ── */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              {isCategory ? (
                <Link href="/collections" className="btn btn-outline">
                  &larr; Back to All Collections
                </Link>
              ) : parent ? (
                <Link href={`/collections/${slugify(parent.name)}`} className="btn btn-outline">
                  &larr; Back to {parent.name}
                </Link>
              ) : (
                <Link href="/collections" className="btn btn-outline">
                  &larr; Back to All Collections
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer>
          <div className="container footer-content">
            <div className="footer-brand">
              <h3>LIM Factory</h3>
              <p>© 2026 LIM Factory. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <a
                href="https://www.instagram.com/terrazzobylimfactory"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
