/**
 * /collections/[slug] — Server-rendered collection page
 *
 * SSG at build time via generateStaticParams, revalidated every 24 hours (ISR).
 * Fetches collection data and its products from Supabase server-side.
 * Renders full HTML with product grid — no client-side JS required for content.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchAllCollections, fetchProductsByCollection } from '../../../src/lib/supabase-server';
import { slugify } from '../../../src/lib/slugify';

export const revalidate = 86400; // ISR: revalidate every 24 hours

const BASE_URL = 'https://www.limfactory.co';

// ── Generate static params for all collections ──────────────────────────
export async function generateStaticParams() {
  const collections = await fetchAllCollections();
  return collections
    .filter((col) => col.type !== 'category') // Only actual collections, not category folders
    .map((col) => ({
      slug: slugify(col.name),
    }))
    .filter((p) => p.slug); // Skip empty slugs
}

// ── Dynamic metadata per collection ─────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collections = await fetchAllCollections();
  const collection = collections.find(
    (col) => slugify(col.name) === slug && col.type !== 'category'
  );

  if (!collection) {
    return { title: 'Collection Not Found' };
  }

  const title = `${collection.name} — Terrazzo Tiles by LIM Factory`;
  const description =
    collection.description ||
    `Explore the ${collection.name} collection of premium terrazzo tiles handcrafted from 100% recycled marble by LIM Factory.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/collections/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/collections/${slug}`,
      siteName: 'LIM Factory',
      images: collection.img
        ? [{ url: collection.img, width: 1200, height: 630, alt: collection.name }]
        : [{ url: `${BASE_URL}/tiles_cover.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: collection.img ? [collection.img] : [`${BASE_URL}/tiles_cover.png`],
    },
  };
}

// ── Page Component ──────────────────────────────────────────────────────
export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collections = await fetchAllCollections();
  const collection = collections.find(
    (col) => slugify(col.name) === slug && col.type !== 'category'
  );

  if (!collection) {
    notFound();
  }

  const products = await fetchProductsByCollection(collection.id);

  // Find parent collection for breadcrumbs if exists
  const parent = collection.parent_id
    ? collections.find((c) => c.id === collection.parent_id)
    : null;

  // Build breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'Collections', url: `${BASE_URL}/#collections` },
  ];
  if (parent) {
    breadcrumbs.push({
      name: parent.name,
      url: `${BASE_URL}/collections/${slugify(parent.name)}`,
    });
  }
  breadcrumbs.push({
    name: collection.name,
    url: `${BASE_URL}/collections/${slug}`,
  });

  // JSON-LD: BreadcrumbList
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
        name: collection.name,
        description:
          collection.description ||
          `Premium terrazzo tiles from the ${collection.name} collection by LIM Factory.`,
        url: `${BASE_URL}/collections/${slug}`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  };

  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ── Navbar ── */}
        <header id="navbar" className="scrolled">
          <div className="container nav-container mobile-nav-layout">
            <Link href="/" className="logo nav-mobile-center">
              <img
                src="https://wqkdkypfpgvubxfzokmg.supabase.co/storage/v1/object/public/images/lim_transparent_logo.png"
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
                <li><Link href="/#collections">Collections</Link></li>
                <li><Link href="/#visualizer">Visualizer</Link></li>
                <li><Link href="/#faq">FAQ</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
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
              <Link href="/#collections" className="breadcrumb-item">
                Collections
              </Link>
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
              <span className="breadcrumb-item active">{collection.name}</span>
            </nav>
          </div>
        </section>

        {/* ── Collection Header ── */}
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="container">
            <div className="section-header">
              <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{collection.name}</h1>
              {collection.description && (
                <p>{collection.description}</p>
              )}
            </div>

            {/* ── Product Grid ── */}
            {products.length === 0 ? (
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
                          <img
                            src={imgUrl}
                            alt={`${prodName} — terrazzo tile by LIM Factory`}
                            loading="lazy"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
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
            )}

            {/* ── Back link ── */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/#collections" className="btn btn-outline">
                &larr; Back to All Collections
              </Link>
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
