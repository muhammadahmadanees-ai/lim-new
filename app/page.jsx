"use client";
import React, { useState, useEffect } from 'react';
import { supabase, prefetchData, getProductByIdFromCache } from '../src/supabase';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import Collections from '../src/components/Collections';
import ProductsView from '../src/components/ProductsView';
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
import SearchModal from '../src/components/SearchModal';
import ScrollToTop from '../src/components/ScrollToTop';
import WhatsAppButton from '../src/components/WhatsAppButton';

// ── JSON-LD Structured Data for Google Rich Results ──────────────────────────
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LIM Factory',
  url: 'https://www.limfactory.co',
  logo: 'https://www.limfactory.co/lim transparent logo (2).png',
  description:
    'LIM Factory crafts premium terrazzo tiles and terrazzo chips tiles from 100% recycled marble. Founded by architects, we create surfaces that last generations.',
  email: 'limfactoryy@gmail.com',
  sameAs: ['https://www.instagram.com/terrazzobylimfactory'],
  areaServed: 'Asia',
  knowsAbout: [
    'terrazzo tile',
    'terrazzo chips tile',
    'terrazzo flooring',
    'recycled marble tiles',
    'custom terrazzo',
  ],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LIM Factory',
  url: 'https://www.limfactory.co',
  description:
    'Premium terrazzo tiles and terrazzo chips tiles handcrafted from recycled marble.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.limfactory.co/?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const jsonLdProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Terrazzo Tiles by LIM Factory',
  description:
    'Handcrafted terrazzo tiles and terrazzo chips tiles made from 100% recycled marble. Available in custom sizes including 30x30cm, 60x60cm, and 60x120cm. Suitable for residential and commercial flooring.',
  brand: {
    '@type': 'Brand',
    name: 'LIM Factory',
  },
  image: 'https://www.limfactory.co/tiles_cover.png',
  url: 'https://www.limfactory.co',
  material: 'Recycled marble, terrazzo chips',
  category: 'Flooring > Terrazzo Tiles',
  offers: {
    '@type': 'Offer',
    url: 'https://www.limfactory.co/#collections',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'LIM Factory',
    },
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Material', value: 'Terrazzo chips, recycled marble' },
    { '@type': 'PropertyValue', name: 'Custom Sizes', value: 'Yes' },
    { '@type': 'PropertyValue', name: 'Minimum Order', value: '20 sqft' },
    { '@type': 'PropertyValue', name: 'Shipping', value: 'International' },
  ],
};

const jsonLdFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are terrazzo chips tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Terrazzo chips tiles are flooring tiles made by embedding marble chips, glass, or other aggregates into a cement or epoxy base, then polishing to a smooth, durable surface. LIM Factory crafts handmade terrazzo chips tiles from 100% recycled marble.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I buy terrazzo tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'You can buy premium terrazzo tiles directly from LIM Factory at https://www.limfactory.co. We offer standard and custom terrazzo tiles shipped across Asia and internationally.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Standard orders are delivered within 2–4 weeks. Custom orders typically take 4–6 weeks depending on complexity and size.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get samples before ordering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes! We strongly recommend ordering samples first. Click the "Order Samples" button at the top of the page to request physical samples delivered to your address.',
      },
    },
    {
      '@type': 'Question',
      name: 'What sizes are available for terrazzo tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Our standard terrazzo tile sizes are 30×30 cm, 60×60 cm, and 60×120 cm. We also offer fully custom sizes — contact us to discuss your requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I install terrazzo tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Terrazzo tiles should be installed by a professional using a suitable adhesive for stone tiles. Ensure the subfloor is clean, flat, and dry. Grout joints of 1.5–2 mm are recommended.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I clean and maintain terrazzo tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Use a pH-neutral cleaner and a damp mop for daily cleaning — avoid acidic cleaners like vinegar as they can etch the surface. Re-seal every 1–2 years depending on traffic.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you ship terrazzo tiles internationally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes, we ship worldwide from Asia. Shipping costs and times vary by destination. Contact us at limfactoryy@gmail.com for a custom shipping quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum order quantity for terrazzo tiles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'For standard collections, the minimum order is 20 sqft. For custom orders, minimums may vary.',
      },
    },
  ],
};

const Home = () => {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSampleFormOpen, setIsSampleFormOpen] = useState(false);
  const [sampleProduct, setSampleProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenProduct = async (prod) => {
    let fullProd = prod;
    if (!prod.desc || !prod.refcode || prod.refcode === 'N/A') {
       const cached = getProductByIdFromCache(prod.id);
       if (cached) {
           fullProd = {
             id: cached.id,
             name: cached.name || cached.title || 'Unnamed',
             desc: cached.description || cached.desc || cached.detail || '',
             img: cached.imageurl || cached.imgurl || cached.image || cached.img || cached.pic || '',
             sizesImg: cached.sizesimageurl || cached.sizeimage || cached.sizesimage || cached.sizepic || '',
             sizes: cached.sizes || cached.size || cached.availablesizes || cached.available_sizes || cached['available sizes'] || cached['Available Sizes'] || '',
             refcode: cached.refcode || cached.referencecode || cached.code || cached.refercode || '',
             price: cached.price || cached.cost || ''
           };
       } else {
           const { data } = await supabase.from('products').select('*').eq('id', prod.id).single();
           if (data) {
               fullProd = {
                 id: data.id,
                 name: data.name || data.title || 'Unnamed',
                 desc: data.description || data.desc || data.detail || '',
                 img: data.imageurl || data.imgurl || data.image || data.img || data.pic || '',
                 sizesImg: data.sizesimageurl || data.sizeimage || data.sizesimage || data.sizepic || '',
                 sizes: data.sizes || data.size || data.availablesizes || data.available_sizes || data['available sizes'] || data['Available Sizes'] || '',
                 refcode: data.refcode || data.referencecode || data.code || data.refercode || '',
                 price: data.price || data.cost || ''
               };
           }
       }
    }
    setSelectedProduct(fullProd);
    try {
      let history = [];
      const stored = localStorage.getItem('lim_recently_viewed');
      if (stored) history = JSON.parse(stored);
      history = history.filter(i => i.id !== fullProd.id);
      history.unshift({ ...fullProd });
      if (history.length > 5) history = history.slice(0, 5);
      localStorage.setItem('lim_recently_viewed', JSON.stringify(history));
      window.dispatchEvent(new Event('recentlyViewedUpdated'));
    } catch(e) {}
  };

  useEffect(() => {
    // Start prefetching data immediately on mount
    prefetchData();

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
      {/* ── JSON-LD Structured Data (invisible to users, visible to Google) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <main>
      <Navbar 
        onOrderSamples={() => setIsOrderModalOpen(true)} 
        onToggleDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      
      <MenuDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCollection={setSelectedCollection}
        onOpenProduct={handleOpenProduct}
      />
      
      <div style={{ display: !selectedCollection ? 'block' : 'none' }}>
        <Hero />
        <Collections onSelectCollection={setSelectedCollection} onOpenProduct={handleOpenProduct} />
      </div>
      
      <div style={{ display: selectedCollection ? 'block' : 'none' }}>
        <ProductsView 
          collectionData={selectedCollection} 
          onBack={() => setSelectedCollection(null)} 
          onOpenProduct={handleOpenProduct}
          onOpenLightbox={(img) => setLightboxImg(img)}
        />
      </div>
      
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

      {isSearchOpen && (
        <SearchModal 
          onClose={() => setIsSearchOpen(false)}
          onOpenProduct={handleOpenProduct}
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
      <ScrollToTop />
      <WhatsAppButton />
      </main>
    </div>
  );
};

export default Home;
