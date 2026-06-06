"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const ProductsView = ({ collectionData, onBack, onOpenProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      if (!collectionData) return;
      try {
        const { data: rawProducts, error } = await supabase.from('products').select('*').eq('collection_id', collectionData.id).order('order');
        if (error) throw error;
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
        setProducts(prods);
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
                  {prod.price && <p style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0' }}>{prod.price}</p>}
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
