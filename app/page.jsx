"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import Collections from '../src/components/Collections';
import ProductsView from '../src/components/ProductsView';
import About from '../src/components/About';
import Contact from '../src/components/Contact';
import Visualizer from '../src/components/Visualizer';
import FAQ from '../src/components/FAQ';
import Footer from '../src/components/Footer';

// Drawer & Modals
import MenuDrawer from '../src/components/MenuDrawer';
import ProductModal from '../src/components/ProductModal';
import OrderModal from '../src/components/OrderModal';
import SampleFormModal from '../src/components/SampleFormModal';
import Lightbox from '../src/components/Lightbox';

const Home = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSampleFormOpen, setIsSampleFormOpen] = useState(false);
  const [sampleProduct, setSampleProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  const handleOpenProduct = (prod) => {
    setSelectedProduct(prod);
    try {
      let history = [];
      const stored = localStorage.getItem('lim_recently_viewed');
      if (stored) history = JSON.parse(stored);
      history = history.filter(i => i.id !== prod.id);
      history.unshift({ ...prod });
      if (history.length > 5) history = history.slice(0, 5);
      localStorage.setItem('lim_recently_viewed', JSON.stringify(history));
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    } catch(e) {}
  };

  useEffect(() => {
    // Sticky Nav & Scroll handling
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Fade-in animations
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              obs.unobserve(entry.target);
          }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedCollection]);

  return (
    <div className="home-page">
      <Navbar 
        onOrderSamples={() => setIsOrderModalOpen(true)} 
        onToggleDrawer={() => setIsDrawerOpen(true)}
      />
      
      <MenuDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCollection={setSelectedCollection}
        onOpenProduct={handleOpenProduct}
      />
      
      {!selectedCollection ? (
        <>
          <Hero />
          <Collections onSelectCollection={setSelectedCollection} onOpenProduct={handleOpenProduct} />
        </>
      ) : (
        <ProductsView 
          collectionData={selectedCollection} 
          onBack={() => setSelectedCollection(null)} 
          onOpenProduct={handleOpenProduct}
        />
      )}
      
      <About />
      <Visualizer />
      <FAQ />
      <Contact />
      <Footer />

      {/* Modals */}
      {isOrderModalOpen && (
        <OrderModal 
          onClose={() => setIsOrderModalOpen(false)} 
          onOpenSampleForm={() => {
            setIsOrderModalOpen(false);
            setSampleProduct(null);
            setIsSampleFormOpen(true);
          }} 
        />
      )}

      {isSampleFormOpen && (
        <SampleFormModal 
          onClose={() => setIsSampleFormOpen(false)} 
          initialProduct={sampleProduct}
        />
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpenLightbox={(img) => setLightboxImg(img)}
          onOpenSampleForm={() => {
            setSampleProduct(selectedProduct);
            setSelectedProduct(null);
            setIsSampleFormOpen(true);
          }}
        />
      )}

      {lightboxImg && (
        <Lightbox img={lightboxImg} onClose={() => setLightboxImg(null)} />
      )}
    </div>
  );
};

export default Home;
