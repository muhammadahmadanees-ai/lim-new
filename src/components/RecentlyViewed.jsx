import React, { useState, useEffect } from 'react';

const RecentlyViewed = ({ onOpenProduct }) => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('lim_recently_viewed');
        if (stored) {
          setRecent(JSON.parse(stored));
        }
      } catch (e) {}
    };
    handleStorage();
    window.addEventListener('recentlyViewedUpdated', handleStorage);
    return () => window.removeEventListener('recentlyViewedUpdated', handleStorage);
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="drawer-section" style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eaeaea' }}>
      <h4 className="sidebar-title drawer-section-title" style={{ marginBottom: '12px' }}>Recently Viewed</h4>
      <div className="pm-recently-viewed-strip">
        {recent.map((item) => (
          <div key={item.id} className="pm-recently-viewed-item" onClick={() => onOpenProduct(item)}>
            {item.img ? (
              <img src={item.img} className="pm-recently-viewed-thumb" alt={item.name} />
            ) : (
              <div className="pm-recently-viewed-thumb" style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>No Img</div>
            )}
            <div className="pm-recently-viewed-name" title={item.name}>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
