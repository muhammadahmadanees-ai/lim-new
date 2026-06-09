"use client";
import React, { useEffect, useState } from 'react';
import { supabase, fetchProductsCached, getProductsCache } from '../supabase';

const ProductsView = ({ collectionData, onBack, onOpenProduct }) => {
  const processProducts = (rawProducts) => {
    const prods = [];
    rawProducts.forEach((rawData) => {
      const data = {};
      for (let key in rawData) {
          const cleanKey = key.toLowerCase().replace(/[\s_]+/g, '');
          data[cleanKey] = rawData[key];
      }
      prods.push({
        id: rawData.id,
        collection: collectionData.name,
        name: data.name || data.title || 'Unnamed',
        desc: data.description || data.desc || data.detail || '',
        img: data.imageurl || data.imgurl || data.image || data.img || data.pic || '',
        sizesImg: data.sizesimageurl || data.sizeimage || data.sizesimage || data.sizepic || '',
        sizes: data.sizes || data.size || '',
        refcode: data.refcode || data.referencecode || data.code || data.refercode || '',
        price: data.price || data.cost || ''
      });
    });
    return prods;
  };

  const cachedSnapshot = collectionData ? getProductsCache(collectionData.id) : null;
  const initialProducts = cachedSnapshot ? processProducts(cachedSnapshot) : [];

  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!cachedSnapshot);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!collectionData) return;
    
    // Check if we already have cache for this specific collection to avoid loading state flicker when collectionData changes
    const currentCache = getProductsCache(collectionData.id);
    if (currentCache) {
      setProducts(processProducts(currentCache));
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const rawProducts = await fetchProductsCached(collectionData.id);
        setProducts(processProducts(rawProducts));
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionData]);

  if (!collectionData) return null;

  return (
    <section id="products-view" className="section">
      <div className="container">
        <div className="section-header">
          <button id="back-to-collections" className="btn btn-outline" style={{ marginBottom: 'var(--spacing-md)' }} onClick={onBack}>
            &larr; Back to Collections
          </button>
          <h2 id="products-view-title">{collectionData.name}</h2>
          <p>Select a product to view detailed specifications.</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No products found in this collection.</p>
        ) : (
          <div className="grid" id="products-container">
            {products.map(prod => (
              <div className="collection-card fade-in-up" key={prod.id} style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div
                  className="img-placeholder"
                  style={prod.img ? {
                    backgroundImage: `url('${prod.img}'), linear-gradient(#ffffff, #ffffff)`,
                    backgroundSize: 'contain, cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    color: 'transparent',
                    padding: '1.5rem',
                    backgroundOrigin: 'content-box, padding-box',
                    cursor: 'zoom-in'
                  } : {}}
                  title={prod.img ? 'Product Image' : ''}
                >
                  {!prod.img && <span>Product Image</span>}
                </div>
                <div className="card-content">
                  <h3 style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {prod.name}
                    {prod.refcode && <span className="ref-code" style={{ marginLeft: 'auto' }}>{prod.refcode}</span>}
                  </h3>
                  <p className="card-desc" style={{ marginTop: '0.5rem' }}>{prod.desc}</p>
                  <a href="#" className="link view-details-btn" onClick={(e) => { e.preventDefault(); onOpenProduct(prod); }}>
                    View Details <span className="arrow-icon">&rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsView;
