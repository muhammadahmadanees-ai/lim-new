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
          <p>We craft every piece with precision, offering bespoke solutions for floors, walls, and custom furnishings.</p>

          <div className="social-links" style={{ marginTop: '1.5rem' }}>
            <a href="https://wa.me/4402035140483" target="_blank" rel="noreferrer" className="social-icon whatsapp">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://www.instagram.com/terrazzobylimfactory" target="_blank" rel="noreferrer" className="social-icon instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:limfactoryy@gmail.com" target="_blank" rel="noreferrer" className="social-icon gmail">
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
