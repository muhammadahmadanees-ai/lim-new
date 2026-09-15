"use client";
import React from 'react';
import Link from 'next/link';

const Navbar = ({ onOrderSamples, onToggleDrawer, onOpenSearch, onNavigate }) => {
  const handleNavClick = (e, path, sectionId) => {
    if (onNavigate) onNavigate();
    if (!sectionId) {
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      }
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', path);
    }
  };

  return (
    <header id="navbar">
      <div className="container nav-container mobile-nav-layout">
        <button 
          id="nav-menu-toggle-btn" 
          className="menu-toggle-btn nav-mobile-left" 
          onClick={onToggleDrawer} 
          aria-label="Toggle Menu"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginRight: '15px',
            color: 'var(--text-color)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            transition: 'color 0.2s'
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        <Link href="/" className="logo nav-mobile-center" onClick={(e) => handleNavClick(e, '/', '')}>
          <img
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/lim_transparent_logo.png`}
            alt="LIM Factory Logo"
            className="logo-img"
          />
          <span className="logo-text">
            <span style={{ color: '#000000' }}>L</span>
            <span style={{ color: '#7b7474' }}>I</span>
            <span style={{ color: '#d47b07' }}>M</span>&nbsp;
            <span style={{ color: '#000000' }}>F</span>
            <span style={{ color: '#8f0606' }}>ACT</span>
            <span style={{ color: '#000000' }}>OR</span>
            <span style={{ color: '#004aad' }}>Y</span>
          </span>
        </Link>
        <nav>
          <ul className="nav-links pc-only-flex">
            <li><Link href="/" id="nav-home-btn" onClick={(e) => handleNavClick(e, '/', '')}>Home</Link></li>
            <li><Link href="/collections" onClick={(e) => handleNavClick(e, '/collections', 'collections')}>Collections</Link></li>
            <li><Link href="/visualizer" onClick={(e) => handleNavClick(e, '/visualizer', 'visualizer')}>Visualizer</Link></li>
            <li><Link href="/faq" onClick={(e) => handleNavClick(e, '/faq', 'faq')}>FAQ</Link></li>
            <li><Link href="/contact" onClick={(e) => handleNavClick(e, '/contact', 'contact')}>Contact</Link></li>
          </ul>
        </nav>
        <div className="nav-actions nav-mobile-right">
          <button className="search-icon-btn mobile-only-btn" onClick={onOpenSearch} aria-label="Search" style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-color)', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-search"></i>
          </button>
          <button className="btn btn-outline desktop-only-btn" id="order-samples-btn" onClick={onOrderSamples}>
            Order Samples
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
