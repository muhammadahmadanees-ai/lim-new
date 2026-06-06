"use client";
import React from 'react';

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="modal show" onClick={onClose} style={{ zIndex: 10000, alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '800px', padding: '2rem', borderRadius: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Privacy Policy</h2>
          <button className="close-btn" onClick={onClose} style={{ position: 'static', padding: '0', fontSize: '1.5rem' }}>&times;</button>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#444' }}>
          <h4>Introduction</h4>
          <p>LIM Factory is committed to protecting your privacy and safeguarding any personal information you provide while using our website. This Privacy Policy explains how we collect, use, store, and protect your information.</p>
          <p>By accessing or using our website, you agree to the terms outlined in this Privacy Policy.</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Information We Collect</h4>
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

          <h4>How We Use Your Information</h4>
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

          <h4>Cookies</h4>
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

          <h4>Information Sharing</h4>
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

          <h4>Data Security</h4>
          <p>We implement reasonable technical and organizational measures to protect personal information against unauthorized access, disclosure, alteration, or destruction.</p>
          <p>While we strive to protect your information, no method of internet transmission or electronic storage can be guaranteed to be completely secure.</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Data Retention</h4>
          <p>Personal information will be retained only for as long as necessary to:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
            <li>Fulfill business and contractual obligations</li>
            <li>Provide customer support</li>
            <li>Comply with legal, accounting, and regulatory requirements</li>
          </ul>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Third-Party Links</h4>
          <p>Our website may contain links to external websites, social media platforms, or third-party services.</p>
          <p>LIM Factory is not responsible for the privacy practices, content, or policies of third-party websites. Users are encouraged to review their respective privacy policies.</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Your Rights</h4>
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

          <h4>Children's Privacy</h4>
          <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Changes to This Policy</h4>
          <p>LIM Factory reserves the right to update or modify this Privacy Policy at any time. Changes become effective immediately upon publication on the website.</p>
          <p>Users are encouraged to review this page periodically for updates.</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderBottom: '1px solid #eee' }} />

          <h4>Contact Information</h4>
          <p>For questions regarding this Privacy Policy or requests concerning your personal information, please contact:</p>
          <p>
            <strong>LIM Factory</strong><br/>
            Main Road Lahore–Kasur Road, Kasur, Punjab, Pakistan<br/>
            Email: <a href="mailto:limfactoryy@gmail.com" style={{ color: 'var(--primary-color)' }}>limfactoryy@gmail.com</a><br/>
            Instagram: <a href="https://instagram.com/terrazzobylimfactory" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>@terrazzobylimfactory</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
