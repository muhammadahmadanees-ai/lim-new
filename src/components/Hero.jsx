import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container hero-split-container">
        <div className="hero-content">
          <h1 className="fade-in-up hero-title">LESS IS MORE</h1>
          <div className="hero-text-body fade-in-up delay-1" style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-color)', opacity: 0.9, fontFamily: "'Century Gothic', sans-serif" }}>
            <p style={{ marginBottom: '1rem' }}>In a world of temporary finishes and visual noise, we believe materials should feel timeless.</p>
            <p style={{ marginBottom: '1rem' }}>Founded by architects, LIM Factory was created from a struggle to accept how surfaces today have lost their meaning. In the past, terrazzo floors and stone surfaces were not just finishes — they were part of people’s homes, memories, and architecture. They aged with time, carried craftsmanship, and gave spaces an identity.</p>
            <p style={{ marginBottom: '1rem' }}>Today, surfaces are often selected for trends alone.</p>
            <p style={{ marginBottom: '0' }}>LIM Factory exists to bring back that sense of depth. Through terrazzo crafted with precision, texture, and permanence, we create materials that do not merely cover spaces — they belong to them.</p>
          </div>
          <a href="#collections" className="btn btn-primary fade-in-up delay-2">Explore Collections</a>
        </div>
        <div className="hero-video-wrapper">
          <video autoPlay loop muted playsInline src="https://res.cloudinary.com/doiujqcpw/video/upload/v1780236097/IMG_0671_cektka.mp4"></video>
        </div>
      </div>
    </section>
  );
};

export default Hero;
