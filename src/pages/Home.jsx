import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Collections from '../components/Collections';
import ProductsView from '../components/ProductsView';
import About from '../components/About';
import Contact from '../components/Contact';
import Visualizer from '../components/Visualizer';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

// Drawer & Modals
import MenuDrawer from '../components/MenuDrawer';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';
import SampleFormModal from '../components/SampleFormModal';
import Lightbox from '../components/Lightbox';

const Home = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSampleFormOpen, setIsSampleFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

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
        onOpenProduct={(prod) => setSelectedProduct(prod)}
      />
      
      {!selectedCollection ? (
        <>
          <Hero />
          <Collections onSelectCollection={setSelectedCollection} />
        </>
      ) : (
        <ProductsView 
          collectionData={selectedCollection} 
          onBack={() => setSelectedCollection(null)} 
          onOpenProduct={(prod) => setSelectedProduct(prod)}
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
            setIsSampleFormOpen(true);
          }} 
        />
      )}

      {isSampleFormOpen && (
        <SampleFormModal onClose={() => setIsSampleFormOpen(false)} />
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOpenLightbox={(img) => setLightboxImg(img)}
        />
      )}

      {lightboxImg && (
        <Lightbox img={lightboxImg} onClose={() => setLightboxImg(null)} />
      )}
    </div>
  );
};

export default Home;
