"use client";
import React from 'react';

const Navbar = ({ onOrderSamples, onToggleDrawer, onOpenSearch, onNavigate }) => {
  const handleNavClick = (e, sectionId) => {
    if (onNavigate) onNavigate();
    if (!sectionId) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${sectionId}`);
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
        <a href="#" className="logo nav-mobile-center" onClick={(e) => handleNavClick(e, '')}>
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
        </a>
        <nav>
          <ul className="nav-links pc-only-flex">
            <li><a href="#" id="nav-home-btn" onClick={(e) => handleNavClick(e, '')}>Home</a></li>
            <li><a href="#collections" onClick={(e) => handleNavClick(e, 'collections')}>Collections</a></li>
            <li><a href="#visualizer" onClick={(e) => handleNavClick(e, 'visualizer')}>Visualizer</a></li>
            <li><a href="#faq" onClick={(e) => handleNavClick(e, 'faq')}>FAQ</a></li>
            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
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
