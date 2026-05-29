import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Collections = ({ onSelectCollection }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const q = query(collection(db, "collections"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const cols = [];
        querySnapshot.forEach((doc) => {
          const rawData = doc.data();
          const data = {};
          for (let key in rawData) {
              const cleanKey = key.toLowerCase().replace(/[\s_]+/g, '');
              data[cleanKey] = rawData[key];
          }
          cols.push({
            id: doc.id,
            name: data.name || data.title || 'Unnamed',
            desc: data.description || data.desc || data.detail || '',
            img: data.imageurl || data.imgurl || data.image || data.img || data.pic || '',
          });
        });
        setCollections(cols);
      } catch (err) {
        console.error("Error fetching collections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="collections" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Our Collections</h2>
          <p>Discover our range of customizable terrazzo tiles, from geometric patterns to organic textures.</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading collections...</p>
        ) : (
          <div className="grid collections-grid" id="collections-container">
            {collections.map((col) => (
              <div className="collection-card fade-in-up" key={col.id} style={{ opacity: 1, transform: 'translateY(0)' }}>
                <div
                  className="img-placeholder"
                  style={col.img ? {
                    backgroundImage: `url('${col.img}')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    color: 'transparent',
                    padding: '1.5rem',
                    backgroundOrigin: 'content-box'
                  } : {}}
                >
                  {!col.img && <span>Image loaded from Firebase</span>}
                </div>
                <div className="card-content">
                  <h3>{col.name}</h3>
                  <p className="card-desc">{col.desc}</p>
                  <a href="#" className="link view-products-btn" onClick={(e) => { e.preventDefault(); onSelectCollection(col); }}>
                    View Products <span className="arrow-icon">&rarr;</span>
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

export default Collections;
