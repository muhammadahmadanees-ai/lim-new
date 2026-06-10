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

  const getDisplayPrice = () => {
    if (!product.price) return null;
    if (!selectedSize) return null;

    let baseStr = product.price;
    try {
      const parsed = JSON.parse(product.price);
      if (parsed[selectedSize]) return parsed[selectedSize];
      if (parsed['base']) {
        baseStr = parsed['base'];
      } else {
        return "Price on Request";
      }
    } catch (e) {}

    const baseMatch = baseStr.match(/[\d,.]+/);
    if (baseMatch) {
      const basePrice = parseFloat(baseMatch[0].replace(/,/g, ''));
      let areaSqm = 0.09;
      if (selectedSize === '30x30') areaSqm = 0.09;
      else if (selectedSize === '30x60') areaSqm = 0.18;
      else if (selectedSize === '45x45') areaSqm = 0.2025;
      else if (selectedSize === '60x60') areaSqm = 0.36;
      else if (selectedSize === '60x120') areaSqm = 0.72;
      
      const isPerSqm = baseStr.toLowerCase().includes('sqm');
      if (isPerSqm) {
         const pricePerTile = Math.round(basePrice * areaSqm);
         return `${pricePerTile} PKR / tile`;
      } else {
         const multiplier = areaSqm / 0.09;
         const newPrice = Math.round(basePrice * multiplier);
         return baseStr.replace(baseMatch[0], newPrice);
      }
    }
    return baseStr;
  };

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
          
          {/* Price hidden for now per request */}
          {/* {product.price && <div className="pm-price">{getDisplayPrice()}</div>} */}
          
          <div className="pm-desc">{product.desc}</div>
          
          <div className="pm-sizes-label">SIZES AVAILABLE</div>
          <div className="pm-sizes-row">
            {(() => {
              const availableSizeIds = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
              const displaySizes = availableSizeIds.length > 0 
                ? availableSizeIds.map(sizeStr => {
                    const predefined = PREDEFINED_SIZES.find(ps => ps.id.toLowerCase() === sizeStr.toLowerCase());
                    if (predefined) return predefined;
                    
                    let w = 26, h = 26; 
                    const match = sizeStr.match(/(\d+)\s*x\s*(\d+)/i);
                    if (match) {
                        const widthCm = parseInt(match[1]);
                        const heightCm = parseInt(match[2]);
                        w = Math.round(widthCm * 0.58);
                        h = Math.round(heightCm * 0.58);
                        w = Math.min(Math.max(w, 15), 50);
                        h = Math.min(Math.max(h, 15), 50);
                    }
                    return { id: sizeStr, w, h };
                })
                : PREDEFINED_SIZES;

              return displaySizes.map(sz => (
                <div 
                  key={sz.id} 
                  className={`pm-size-item ${selectedSize === sz.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(sz.id)}
                >
                  <div className="pm-size-box" style={{ width: `${sz.w}px`, height: `${sz.h}px` }}></div>
                  <div className="pm-size-label">{sz.id}</div>
                </div>
              ));
            })()}
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
