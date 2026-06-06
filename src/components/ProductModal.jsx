"use client";
import React, { useState } from 'react';
import './ProductModal.css';

const PREDEFINED_SIZES = [
  { id: '30x30', w: 20, h: 20 },
  { id: '30x60', w: 20, h: 40 },
  { id: '45x45', w: 26, h: 26 },
  { id: '60x60', w: 32, h: 32 },
  { id: '60x120', w: 24, h: 48 },
];

const ProductModal = ({ product, onClose, onOpenLightbox, onOpenSampleForm }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) return null;

  return (
    <div className="pm-overlay" onClick={(e) => { if (e.target.classList.contains('pm-overlay')) onClose(); }}>
      <div className="pm-container">
        
        {/* Left Column — Image Panel */}
        <div className="pm-left">
          <div className="pm-image-box">
            <img 
              src={product.img} 
              alt={product.name} 
              onClick={() => { if(product.img) onOpenLightbox(product.img); }}
            />
          </div>
          <div className="pm-caption">
            * The tile shown in the picture is a 60&times;60 cm sample.
          </div>
        </div>

        {/* Right Column — Content Panel */}
        <div className="pm-right">
          <div className="pm-header-row">
            <h2 className="pm-title">{product.name}</h2>
            {product.refcode && <span className="pm-sku">{product.refcode}</span>}
            <span className="pm-close" onClick={onClose}>&times;</span>
          </div>
          
          {product.price && <div className="pm-price">{product.price}</div>}
          
          <div className="pm-desc">{product.desc}</div>
          
          <div className="pm-sizes-label">SIZES AVAILABLE</div>
          <div className="pm-sizes-row">
            {PREDEFINED_SIZES.map(sz => (
              <div 
                key={sz.id} 
                className={`pm-size-item ${selectedSize === sz.id ? 'selected' : ''}`}
                onClick={() => setSelectedSize(sz.id)}
              >
                <div className="pm-size-box" style={{ width: `${sz.w}px`, height: `${sz.h}px` }}></div>
                <div className="pm-size-label">{sz.id}</div>
              </div>
            ))}
          </div>

          <div className="pm-contact-label">For orders, contact us:</div>
          <div className="pm-social-row">
            <a href={`https://wa.me/923164934687?text=${encodeURIComponent(`Hello! I'm interested in the ${product.name} tile. Check it out here: ${window.location.href}`)}`} target="_blank" rel="noreferrer" className="pm-social-icon whatsapp" title="Order via WhatsApp"><i className="fab fa-whatsapp"></i></a>
            <a href="https://ig.me/m/terrazzobylimfactory" target="_blank" rel="noreferrer" className="pm-social-icon instagram" title="Order via Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://mail.google.com/mail/?view=cm&to=limfactoryy@gmail.com" target="_blank" rel="noreferrer" className="pm-social-icon email" title="Order via Email"><i className="fas fa-envelope"></i></a>
          </div>

          <div className="pm-buttons-row">
            <button className="pm-btn-inquire" onClick={onOpenSampleForm}>
              REQUEST SAMPLE
            </button>
            <button className="pm-btn-inquire" onClick={() => { document.getElementById('contact').scrollIntoView(); onClose(); }}>
              INQUIRE NOW
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProductModal;
