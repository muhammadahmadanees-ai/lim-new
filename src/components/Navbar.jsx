import React from 'react';

const Navbar = ({ onOrderSamples }) => {
  return (
    <header id="navbar">
      <div className="container nav-container">
        <a href="#" className="logo">
          <img
            src="https://res.cloudinary.com/doiujqcpw/image/upload/v1780002822/lim_transparent_logo_2_3_rvmif4.png"
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
          <ul className="nav-links">
            <li><a href="#" id="nav-home-btn">Home</a></li>
            <li><a href="#collections">Collections</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#visualizer">Visualizer</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="nav-actions">
          <button className="btn btn-outline" id="order-samples-btn" onClick={onOrderSamples}>
            Order Samples
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
