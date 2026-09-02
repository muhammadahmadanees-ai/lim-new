/**
 * /products/[slug] — Server-rendered product detail page
 *
 * SSG at build time via generateStaticParams, revalidated every 24 hours (ISR).
 * Fetches product data from Supabase server-side and renders complete HTML
 * with product specs, sizes, CTAs — no client-side JS needed for content.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  fetchAllProducts,
  fetchAllCollections,
  fetchProductsByCollection,
} from '../../../src/lib/supabase-server';
import { slugify } from '../../../src/lib/slugify';
import ProductJsonLd from '../../../src/components/ProductJsonLd';

export const revalidate = 86400; // ISR: revalidate every 24 hours

const BASE_URL = 'https://www.limfactory.co';

const PREDEFINED_SIZES = [
  { id: '30x30', w: 15, h: 15 },
  { id: '30x60', w: 15, h: 30 },
  { id: '45x45', w: 23, h: 23 },
  { id: '60x60', w: 30, h: 30 },
  { id: '60x120', w: 30, h: 60 },
];

// ── Generate static params for all products ─────────────────────────────
export async function generateStaticParams() {
  const products = await fetchAllProducts();
  return products
    .map((prod) => ({
      slug: slugify(prod.name),
    }))
    .filter((p) => p.slug);
}

// ── Dynamic metadata per product ────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await fetchAllProducts();
  const product = products.find((p) => slugify(p.name) === slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const title = `${product.name} — Terrazzo Tile by LIM Factory`;
  const description =
    product.description ||
    `${product.name} — handcrafted terrazzo tile made from 100% recycled marble. Available in custom sizes. Order from LIM Factory.`;
  const imgUrl =
    product.img || product.image || product.imageurl || product.imgurl || '';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/products/${slug}`,
      siteName: 'LIM Factory',
      images: imgUrl
        ? [{ url: imgUrl, width: 800, height: 800, alt: product.name }]
        : [{ url: `${BASE_URL}/tiles_cover.png`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imgUrl ? [imgUrl] : [`${BASE_URL}/tiles_cover.png`],
    },
  };
}

// ── Page Component ──────────────────────────────────────────────────────
export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [products, collections] = await Promise.all([
    fetchAllProducts(),
    fetchAllCollections(),
  ]);

  const product = products.find((p) => slugify(p.name) === slug);
  if (!product) {
    notFound();
  }

  // Find parent collection
  const collection = collections.find((c) => c.id === product.collection_id);
  const collectionSlug = collection ? slugify(collection.name) : null;

  // Find parent category (if collection has a parent)
  const parentCategory =
    collection && collection.parent_id
      ? collections.find((c) => c.id === collection.parent_id)
      : null;

  // Get related products from the same collection (excluding current)
  const relatedProducts = products
    .filter((p) => p.collection_id === product.collection_id && p.id !== product.id)
    .slice(0, 4);

  // Extract fields with fallbacks
  const imgUrl = product.img || product.image || product.imageurl || product.imgurl || '';
  const prodName = product.name || product.title || 'Unnamed';
  const prodDesc = product.description || product.desc || product.detail || '';
  const prodRefcode = product.refcode || product.referencecode || product.code || '';
  const prodSizes = product.sizes || product.size || '';

  // Parse available sizes
  const availableSizeIds = prodSizes
    ? prodSizes.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const displaySizes =
    availableSizeIds.length > 0
      ? availableSizeIds.map((sizeStr) => {
          const predefined = PREDEFINED_SIZES.find(
            (ps) => ps.id.toLowerCase() === sizeStr.toLowerCase()
          );
          if (predefined) return predefined;
          let w = 23,
            h = 23;
          const match = sizeStr.match(/(\d+)\s*x\s*(\d+)/i);
          if (match) {
            w = Math.round(parseInt(match[1]) * 0.5);
            h = Math.round(parseInt(match[2]) * 0.5);
          }
          return { id: sizeStr, w, h };
        })
      : PREDEFINED_SIZES;

  // Build breadcrumbs
  const breadcrumbs = [{ name: 'Home', url: BASE_URL }];
  breadcrumbs.push({ name: 'Collections', url: `${BASE_URL}/#collections` });
  if (parentCategory) {
    breadcrumbs.push({
      name: parentCategory.name,
      url: `${BASE_URL}/collections/${slugify(parentCategory.name)}`,
    });
  }
  if (collection) {
    breadcrumbs.push({
      name: collection.name,
      url: `${BASE_URL}/collections/${collectionSlug}`,
    });
  }
  breadcrumbs.push({
    name: prodName,
    url: `${BASE_URL}/products/${slug}`,
  });

  // WhatsApp message
  const whatsappMsg = encodeURIComponent(
    `Hello LIM Factory! 👋 I'm interested in the ${prodName} tile${prodRefcode ? ` (Ref: ${prodRefcode})` : ''}. Could you please share the pricing and availability details? Thank you!`
  );

  // Email params
  const emailSubject = encodeURIComponent(`Inquiry for ${prodName}`);
  const emailBody = encodeURIComponent(
    `Hello LIM Factory,\n\nI am interested in learning more about the product: ${prodName}.\nReference Code: ${prodRefcode || 'N/A'}\nLink: ${BASE_URL}/products/${slug}\n\nPlease share the pricing and availability details.\n\nThank you!`
  );

  return (
    <div className="home-page">
      <ProductJsonLd
        product={{ ...product, slug }}
        collection={collection}
        breadcrumbs={breadcrumbs}
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
              {parentCategory && (
                <>
                  <span className="breadcrumb-sep">&gt;</span>
                  <Link
                    href={`/collections/${slugify(parentCategory.name)}`}
                    className="breadcrumb-item"
                  >
                    {parentCategory.name}
                  </Link>
                </>
              )}
              {collection && (
                <>
                  <span className="breadcrumb-sep">&gt;</span>
                  <Link
                    href={`/collections/${collectionSlug}`}
                    className="breadcrumb-item"
                  >
                    {collection.name}
                  </Link>
                </>
              )}
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-item active">{prodName}</span>
            </nav>
          </div>
        </section>

        {/* ── Product Detail ── */}
        <section className="section" style={{ paddingTop: '1rem' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '3rem',
                alignItems: 'start',
              }}
              className="product-detail-grid"
            >
              {/* Left: Image */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius)',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`${prodName} — terrazzo tile by LIM Factory`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '500px',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>Product Image</span>
                )}
              </div>

              {/* Right: Details */}
              <div>
                <h1
                  style={{
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    marginBottom: '0.5rem',
                    lineHeight: '1.2',
                  }}
                >
                  {prodName}
                </h1>

                {prodRefcode && (
                  <span
                    className="ref-code"
                    style={{
                      display: 'inline-block',
                      marginBottom: '1rem',
                      fontWeight: 'normal',
                    }}
                  >
                    {prodRefcode}
                  </span>
                )}

                {collection && (
                  <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
                    Collection:{' '}
                    <Link
                      href={`/collections/${collectionSlug}`}
                      style={{ color: 'var(--accent-color, #d47b07)' }}
                    >
                      {collection.name}
                    </Link>
                  </p>
                )}

                {prodDesc && (
                  <p
                    style={{
                      lineHeight: '1.7',
                      marginBottom: '1.5rem',
                      color: 'var(--text-color)',
                      opacity: 0.85,
                    }}
                  >
                    {prodDesc}
                  </p>
                )}

                {/* Sizes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    Sizes Available
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {displaySizes.map((sz) => (
                      <div
                        key={sz.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <div
                          style={{
                            width: `${sz.w}px`,
                            height: `${sz.h}px`,
                            border: '2px solid var(--accent-color, #d47b07)',
                            borderRadius: '2px',
                            backgroundColor: 'rgba(212, 123, 7, 0.08)',
                          }}
                        />
                        <span style={{ fontSize: '0.7rem', color: '#666' }}>
                          {sz.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material info */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    borderRadius: 'var(--radius)',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    <strong>Material:</strong> 100% recycled marble terrazzo
                  </p>
                  <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    <strong>Min. Order:</strong> 20 sqft
                  </p>
                  <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0', fontStyle: 'italic', color: '#999' }}>
                    * The tile shown is a 60×60 cm sample.
                  </p>
                </div>

                {/* CTA: Contact buttons */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  For orders, contact us:
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <a
                    href={`https://wa.me/923164934687?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon whatsapp"
                    title="Order via WhatsApp"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a
                    href="https://ig.me/m/terrazzobylimfactory"
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon instagram"
                    title="Order via Instagram"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=limfactoryy@gmail.com&su=${emailSubject}&body=${emailBody}`}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon gmail"
                    title="Order via Email"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className="fas fa-envelope"></i>
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/#contact" className="btn btn-primary">
                    INQUIRE NOW
                  </Link>
                  {collection && (
                    <Link href={`/collections/${collectionSlug}`} className="btn btn-outline">
                      &larr; Back to {collection.name}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* ── Related Products ── */}
            {relatedProducts.length > 0 && (
              <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  More from {collection?.name || 'this collection'}
                </h2>
                <div className="grid" id="related-products">
                  {relatedProducts.map((rp) => {
                    const rpSlug = slugify(rp.name);
                    const rpImg =
                      rp.img || rp.image || rp.imageurl || rp.imgurl || '';
                    const rpName = rp.name || rp.title || 'Unnamed';

                    return (
                      <Link
                        href={`/products/${rpSlug}`}
                        key={rp.id}
                        className="collection-card"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <div
                          className="img-placeholder"
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          {rpImg ? (
                            <img
                              src={rpImg}
                              alt={`${rpName} — terrazzo tile by LIM Factory`}
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
                          <h3
                            style={{
                              margin: 0,
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                            }}
                          >
                            {rpName}
                          </h3>
                          <span className="link view-details-btn">
                            View Details <span className="arrow-icon">&rarr;</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
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

      {/* ── Responsive grid override for product detail ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .product-detail-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
