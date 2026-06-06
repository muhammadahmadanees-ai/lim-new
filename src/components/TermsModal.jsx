"use client";
import React from 'react';

const TermsModal = ({ onClose }) => {
  return (
    <div className="modal show" onClick={onClose} style={{ zIndex: 10000, alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '800px', padding: '2rem', borderRadius: '12px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Terms & Conditions</h2>
          <button className="close-btn" onClick={onClose} style={{ position: 'static', padding: '0', fontSize: '1.5rem' }}>&times;</button>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#444' }}>
          <h4>1. Material Characteristics</h4>
          <p>Terrazzo is a handcrafted cementitious product manufactured using natural aggregates, pigments, and cement. Variations in color, tone, texture, aggregate distribution, porosity, pinholes, edge details, and dimensions are inherent characteristics of the material and shall not be considered defects.</p>

          <h4>2. Sample Disclaimer</h4>
          <p>Product samples, mockups, photographs, renders, and digital representations are provided for reference only. Minor variations between approved samples and final production batches are normal and expected due to the natural composition and manufacturing process of terrazzo.</p>

          <h4>3. Made-to-Order Production</h4>
          <p>All terrazzo products are manufactured exclusively upon order confirmation and are considered custom-made products. Standard production lead time is approximately <strong>25–30 working days</strong> from receipt of advance payment and final approval of specifications. Production timelines may vary depending on order quantity, complexity, and material availability.</p>

          <h4>4. Payment Terms</h4>
          <p>All confirmed orders require an advance payment as agreed in the quotation. Since all products are custom-manufactured, payments made are strictly <strong>non-refundable</strong> once production has commenced.</p>

          <h4>5. Packaging</h4>
          <p>Quoted prices exclude specialized packaging unless explicitly mentioned in the quotation. Any custom crating, palletization, export packaging, or special handling requirements shall incur additional charges.</p>

          <h4>6. Inspection & Acceptance</h4>
          <p>Customers are required to inspect all products upon delivery and before installation. Any concerns regarding quantity, dimensions, visible damage, or manufacturing discrepancies must be reported in writing within 48 hours of delivery. Installation of the material constitutes acceptance of the product.</p>

          <h4>7. Installation Responsibility</h4>
          <p>All terrazzo products must be installed by qualified and experienced professionals following industry best practices. LIM Factory shall not be held responsible for damages, failures, cracks, unevenness, discoloration, or performance issues resulting from improper installation methods, substrate conditions, workmanship, or site conditions.</p>

          <h4>8. Sealing & Surface Protection</h4>
          <p>Terrazzo surfaces must be properly sealed after installation using a suitable sealer selected by the installer or project consultant. Customers are advised to allow the material to dry for a minimum of 24 hours before applying sealers. LIM Factory shall not be liable for staining, moisture penetration, discoloration, or deterioration resulting from inadequate sealing or maintenance.</p>

          <h4>9. Dimensional Tolerances</h4>
          <p>Minor dimensional variations, edge irregularities, surface pinholes, and slight warpage within acceptable manufacturing tolerances are normal characteristics of cement-based terrazzo products and shall not constitute grounds for rejection.</p>

          <h4>10. Transportation & Handling</h4>
          <p>Risk associated with loading, transportation, unloading, storage, and on-site handling transfers to the customer upon dispatch from our facility. LIM Factory shall not be responsible for breakage, chipping, cracking, or damages occurring during transportation or after delivery.</p>

          <h4>11. Storage Requirements</h4>
          <p>Products must be stored in a clean, dry, covered area on a level surface and protected from excessive moisture, contamination, impact, and weather exposure prior to installation.</p>

          <h4>12. Maintenance</h4>
          <p>Terrazzo is a natural material that requires routine maintenance. Customers are responsible for following recommended cleaning, sealing, and maintenance procedures to preserve the appearance and performance of the material.</p>

          <h4>13. Returns, Exchanges & Cancellations</h4>
          <p>Due to the custom-made nature of terrazzo products, orders cannot be returned, exchanged, modified, or cancelled once production has begun. No refunds shall be issued for custom-manufactured products.</p>

          <h4>14. Force Majeure</h4>
          <p>LIM Factory shall not be liable for delays or failure to perform due to circumstances beyond reasonable control, including but not limited to natural disasters, material shortages, transportation disruptions, labor disputes, government actions, or unforeseen production interruptions.</p>

          <h4>15. Limitation of Liability</h4>
          <p>The maximum liability of LIM Factory shall be limited to the replacement value of the supplied material only. Under no circumstances shall LIM Factory be liable for indirect, consequential, incidental, labor, installation, project delay, or other associated costs.</p>

          <h4>16. Acceptance of Terms</h4>
          <p>Placement of an order, payment of an advance, approval of samples, or acceptance of a quotation shall constitute acknowledgment and acceptance of these Terms & Conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
