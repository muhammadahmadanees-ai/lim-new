import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const SampleFormModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', collection: '', tile: '', quantity: '',
    address: '', city: '', postcode: '', country: '', notes: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, "orders"), {
        type: 'Sample Request',
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="modal show" onClick={(e) => { if(e.target.classList.contains('modal')) onClose(); }}>
      <div className="modal-content sample-form-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <div style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ marginBottom: '0.25rem', textAlign: 'center' }}>Sample Request Form</h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>Fill in the details below and we will send your samples directly to you.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" placeholder="Your full name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone / WhatsApp</label>
                <input type="tel" name="phone" placeholder="+44 ..." value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Collection *</label>
                <select name="collection" required value={formData.collection} onChange={handleChange}>
                  <option value="">Select a collection</option>
                  <option>Terrazzo Tiles</option>
                  <option>Terrazzo Slabs</option>
                  <option>Geometric Collection</option>
                  <option>Organic Collection</option>
                  <option>Cristal Collection</option>
                  <option>Not sure — please advise</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tile / Product Name</label>
                <input type="text" name="tile" placeholder="e.g. Ash Matrix, or leave blank" value={formData.tile} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Number of Samples *</label>
                <select name="quantity" required value={formData.quantity} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5+</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Shipping Address *</label>
              <input type="text" name="address" placeholder="Street address" required style={{ marginBottom: '0.5rem' }} value={formData.address} onChange={handleChange} />
              <div className="form-row">
                <input type="text" name="city" placeholder="City" style={{ width: '100%', padding: '1rem', background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-color)', fontFamily: 'var(--font-primary)', borderRadius: '4px' }} value={formData.city} onChange={handleChange} />
                <input type="text" name="postcode" placeholder="Postcode / ZIP" style={{ width: '100%', padding: '1rem', background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-color)', fontFamily: 'var(--font-primary)', borderRadius: '4px' }} value={formData.postcode} onChange={handleChange} />
                <input type="text" name="country" placeholder="Country" style={{ width: '100%', padding: '1rem', background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-color)', fontFamily: 'var(--font-primary)', borderRadius: '4px' }} value={formData.country} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Notes</label>
              <textarea name="notes" rows="3" placeholder="Any specific requirements, preferred colours, project details..." value={formData.notes} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
              {status === 'idle' ? 'Send Sample Request' : status === 'sending' ? 'Sending...' : status === 'success' ? '✅ Request Sent!' : 'Error!'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SampleFormModal;
