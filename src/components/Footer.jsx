"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';

const Footer = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
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
      {isTermsOpen && <TermsModal onClose={() => setIsTermsOpen(false)} />}
      {isPrivacyOpen && <PrivacyModal onClose={() => setIsPrivacyOpen(false)} />}
    </footer>
  );
};

export default Footer;
