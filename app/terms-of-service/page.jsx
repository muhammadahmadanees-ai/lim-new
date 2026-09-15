import Link from 'next/link';

const BASE_URL = 'https://www.limfactory.co';

export const metadata = {
  title: 'Terms of Service | LIM Factory',
  description: 'LIM Factory Terms & Conditions — Material characteristics, ordering process, custom manufacturing, payment, and delivery policies for our terrazzo products.',
  alternates: {
    canonical: `${BASE_URL}/terms-of-service`,
  },
  openGraph: {
    title: 'Terms of Service | LIM Factory',
    description: 'LIM Factory Terms & Conditions — Material characteristics, ordering process, custom manufacturing, payment, and delivery policies.',
    url: `${BASE_URL}/terms-of-service`,
    siteName: 'LIM Factory',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  const logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/lim_transparent_logo.png`;

  return (
    <div className="home-page">
      <main>
        {/* ── Navbar ── */}
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
                <li><Link href="/#collections">Collections</Link></li>
                <li><Link href="/#visualizer">Visualizer</Link></li>
                <li><Link href="/#faq">FAQ</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* ── Breadcrumb ── */}
        <section className="section" style={{ paddingTop: '120px', paddingBottom: '0' }}>
          <div className="container">
            <nav className="explorer-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/" className="breadcrumb-item">
                <i className="fas fa-home" style={{ marginRight: '4px' }}></i> Home
              </Link>
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-item active">Terms of Service</span>
            </nav>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-color)' }}>
              Terms &amp; Conditions
            </h1>
            <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444' }}>
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>1. Material Characteristics</h3>
              <p>Terrazzo is a handcrafted cementitious product manufactured using natural aggregates, pigments, and cement. Variations in color, tone, texture, aggregate distribution, porosity, pinholes, edge details, and dimensions are inherent characteristics of the material and shall not be considered defects.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>2. Sample Disclaimer</h3>
              <p>Product samples, mockups, photographs, renders, and digital representations are provided for reference only. Minor variations between approved samples and final production batches are normal and expected due to the natural composition and manufacturing process of terrazzo.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>3. Made-to-Order Production</h3>
              <p>All terrazzo products are manufactured exclusively upon order confirmation and are considered custom-made products. Standard production lead time is approximately <strong>25–30 working days</strong> from receipt of advance payment and final approval of specifications. Production timelines may vary depending on order quantity, complexity, and material availability.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>4. Payment Terms</h3>
              <p>All confirmed orders require an advance payment as agreed in the quotation. Since all products are custom-manufactured, payments made are strictly <strong>non-refundable</strong> once production has commenced.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>5. Packaging</h3>
              <p>Quoted prices exclude specialized packaging unless explicitly mentioned in the quotation. Any custom crating, palletization, export packaging, or special handling requirements shall incur additional charges.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>6. Inspection &amp; Acceptance</h3>
              <p>Customers are required to inspect all products upon delivery and before installation. Any concerns regarding quantity, dimensions, visible damage, or manufacturing discrepancies must be reported in writing within 48 hours of delivery. Installation of the material constitutes acceptance of the product.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>7. Installation Responsibility</h3>
              <p>All terrazzo products must be installed by qualified and experienced professionals following industry best practices. LIM Factory shall not be held responsible for damages, failures, cracks, unevenness, discoloration, or performance issues resulting from improper installation methods, substrate conditions, workmanship, or site conditions.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>8. Sealing &amp; Surface Protection</h3>
              <p>Terrazzo surfaces must be properly sealed after installation using a suitable sealer selected by the installer or project consultant. Customers are advised to allow the material to dry for a minimum of 24 hours before applying sealers. LIM Factory shall not be liable for staining, moisture penetration, discoloration, or deterioration resulting from inadequate sealing or maintenance.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>9. Dimensional Tolerances</h3>
              <p>Minor dimensional variations, edge irregularities, surface pinholes, and slight warpage within acceptable manufacturing tolerances are normal characteristics of cement-based terrazzo products and shall not constitute grounds for rejection.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>10. Transportation &amp; Handling</h3>
              <p>Risk associated with loading, transportation, unloading, storage, and on-site handling transfers to the customer upon dispatch from our facility. LIM Factory shall not be responsible for breakage, chipping, cracking, or damages occurring during transportation or after delivery.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>11. Storage Requirements</h3>
              <p>Products must be stored in a clean, dry, covered area on a level surface and protected from excessive moisture, contamination, impact, and weather exposure prior to installation.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>12. Maintenance</h3>
              <p>Terrazzo is a natural material that requires routine maintenance. Customers are responsible for following recommended cleaning, sealing, and maintenance procedures to preserve the appearance and performance of the material.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>13. Returns, Exchanges &amp; Cancellations</h3>
              <p>Due to the custom-made nature of terrazzo products, orders cannot be returned, exchanged, modified, or cancelled once production has begun. No refunds shall be issued for custom-manufactured products.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>14. Force Majeure</h3>
              <p>LIM Factory shall not be liable for delays or failure to perform due to circumstances beyond reasonable control, including but not limited to natural disasters, material shortages, transportation disruptions, labor disputes, government actions, or unforeseen production interruptions.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>15. Limitation of Liability</h3>
              <p>The maximum liability of LIM Factory shall be limited to the replacement value of the supplied material only. Under no circumstances shall LIM Factory be liable for indirect, consequential, incidental, labor, installation, project delay, or other associated costs.</p>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>16. Acceptance of Terms</h3>
              <p>Placement of an order, payment of an advance, approval of samples, or acceptance of a quotation shall constitute acknowledgment and acceptance of these Terms &amp; Conditions.</p>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer>
          <div className="container footer-content">
            <div className="footer-brand">
              <h3>LIM Factory</h3>
              <p>&copy; 2026 LIM Factory. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <a href="https://www.instagram.com/terrazzobylimfactory" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
