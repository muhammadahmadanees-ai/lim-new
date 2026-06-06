"use client";
import React from 'react';

const About = () => {
  return (
    <section id="about" className="section bg-dark">
      <div className="container about-container">
        <div className="about-text">
          <h2>The Art of Terrazzo</h2>
          <p>
            At LIM Factory, we believe in the harmony of natural materials and modern design. Our exclusive
            high-performance mineral binder ensures our slabs are exceptionally strong, durable, and uniquely beautiful.
          </p>
          <p>We craft every piece with precision, offering custom solutions for floors, walls, and furnishings.</p>

          <div className="about-stats">
            <a href={`https://wa.me/923164934687?text=${encodeURIComponent("Hello LIM Factory! 👋 I visited your website and I'm interested in placing an order. Could you please help me with your terrazzo tile collections, pricing, and availability? Thank you!")}`} target="_blank" rel="noreferrer" className="social-icon whatsapp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.instagram.com/terrazzobylimfactory" target="_blank" rel="noreferrer" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=limfactoryy@gmail.com" target="_blank" rel="noreferrer" className="social-icon gmail">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
        <div className="about-stats">
          <div className="stat">
            <h3>20+</h3>
            <p>Years of Excellence</p>
          </div>
          <div className="stat">
            <h3>100%</h3>
            <p>Recycled Marble</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
