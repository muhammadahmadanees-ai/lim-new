import Link from 'next/link';

const BASE_URL = 'https://www.limfactory.co';

export const metadata = {
  title: 'Privacy Policy | LIM Factory',
  description: 'LIM Factory Privacy Policy — Learn how we collect, use, protect, and handle your personal information when using our website and services.',
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | LIM Factory',
    description: 'LIM Factory Privacy Policy — Learn how we collect, use, protect, and handle your personal information.',
    url: `${BASE_URL}/privacy-policy`,
    siteName: 'LIM Factory',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
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
              <span className="breadcrumb-item active">Privacy Policy</span>
            </nav>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-color)' }}>
              Privacy Policy
            </h1>
            <div style={{ fontSize: '1rem', lineHeight: '1.7', color: '#444' }}>
              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Introduction</h3>
              <p>LIM Factory is committed to protecting your privacy and safeguarding any personal information you provide while using our website. This Privacy Policy explains how we collect, use, store, and protect your information.</p>
              <p>By accessing or using our website, you agree to the terms outlined in this Privacy Policy.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Information We Collect</h3>
              <p>We may collect the following information when you interact with our website:</p>
              <strong>Personal Information</strong>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Company Name</li>
                <li>Project Information</li>
                <li>Delivery Address</li>
                <li>Any information voluntarily submitted through contact forms, quotation requests, sample requests, or email correspondence</li>
              </ul>
              <strong>Technical Information</strong>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>IP Address</li>
                <li>Browser Type</li>
                <li>Device Information</li>
                <li>Website Usage Data</li>
                <li>Cookies and Analytics Data</li>
              </ul>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>How We Use Your Information</h3>
              <p>The information collected may be used to:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Respond to inquiries and quotation requests</li>
                <li>Process sample requests and product inquiries</li>
                <li>Provide customer support</li>
                <li>Improve our products, services, and website experience</li>
                <li>Communicate project updates and order-related information</li>
                <li>Send marketing communications, promotions, or product updates (only where permitted)</li>
              </ul>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Cookies</h3>
              <p>Our website may use cookies and similar technologies to improve user experience and analyze website performance.</p>
              <p>Cookies help us:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Understand visitor behavior</li>
                <li>Improve website functionality</li>
                <li>Remember user preferences</li>
                <li>Monitor website traffic and performance</li>
              </ul>
              <p>Users may disable cookies through their browser settings; however, certain website features may not function properly.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Information Sharing</h3>
              <p>LIM Factory does not sell, rent, or trade personal information to third parties.</p>
              <p>Information may be shared only with:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Service providers assisting with website operations</li>
                <li>Shipping and logistics partners</li>
                <li>Professional advisors and legal authorities when required by law</li>
                <li>Payment processing providers when applicable</li>
              </ul>
              <p>All third-party partners are expected to maintain appropriate confidentiality and security standards.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Data Security</h3>
              <p>We implement reasonable technical and organizational measures to protect personal information against unauthorized access, disclosure, alteration, or destruction.</p>
              <p>While we strive to protect your information, no method of internet transmission or electronic storage can be guaranteed to be completely secure.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Data Retention</h3>
              <p>Personal information will be retained only for as long as necessary to:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Fulfill business and contractual obligations</li>
                <li>Provide customer support</li>
                <li>Comply with legal, accounting, and regulatory requirements</li>
              </ul>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Third-Party Links</h3>
              <p>Our website may contain links to external websites, social media platforms, or third-party services.</p>
              <p>LIM Factory is not responsible for the privacy practices, content, or policies of third-party websites. Users are encouraged to review their respective privacy policies.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Your Rights</h3>
              <p>Subject to applicable laws, you may request to:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Update your details</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>
              <p>Requests may be submitted using the contact information provided below.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Children's Privacy</h3>
              <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Changes to This Policy</h3>
              <p>LIM Factory reserves the right to update or modify this Privacy Policy at any time. Changes become effective immediately upon publication on the website.</p>
              <p>Users are encouraged to review this page periodically for updates.</p>

              <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

              <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>Contact Information</h3>
              <p>For questions regarding this Privacy Policy or requests concerning your personal information, please contact:</p>
              <p>
                <strong>LIM Factory</strong><br/>
                Main Road Lahore–Kasur Road, Kasur, Punjab, Pakistan<br/>
                Email: <a href="mailto:limfactoryy@gmail.com" style={{ color: 'var(--accent-color, #b83a2a)' }}>limfactoryy@gmail.com</a><br/>
                Instagram: <a href="https://instagram.com/terrazzobylimfactory" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color, #b83a2a)' }}>@terrazzobylimfactory</a>
              </p>
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
