import React from 'react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for form submission
  };

  return (
    <section id="contact" className="section">
      <div className="container contact-container">
        <div className="contact-info">
          <h2>Visit Our Showroom</h2>
          <p>Experience the texture and quality of LIM terrazzo in person.</p>
          <ul className="contact-details">
            <li><strong>Email:</strong> limfactoryy@gmail.com</li>
            <li><strong>Phone:</strong> +44 (0) 203 514 0483</li>
            <li><strong>Location:</strong> 106 Columbia Road, London E2 7RG</li>
          </ul>
        </div>
        <div className="contact-form">
          <form id="inquiry-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="4" placeholder="How can we help you?" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Inquiry</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
