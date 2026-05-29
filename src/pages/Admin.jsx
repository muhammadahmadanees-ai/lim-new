import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import '../admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('collections'); // 'collections' | 'orders'
  const [collectionsList, setCollectionsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  // --- CRUD States ---
  const [currentCollection, setCurrentCollection] = useState(null);
  const [productsList, setProductsList] = useState([]);

  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [colFormData, setColFormData] = useState({ id: '', name: '', description: '', img: '', order: 0 });

  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [prodFormData, setProdFormData] = useState({ id: '', name: '', price: '', description: '', img: '', sizes: '', refcode: '', order: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCollections();
        fetchOrders();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const fetchCollections = async () => {
    try {
      const q = query(collection(db, "collections"), orderBy("order"));
      const snapshot = await getDocs(q);
      const cols = [];
      snapshot.forEach(d => cols.push({ id: d.id, ...d.data() }));
      setCollectionsList(cols);
    } catch (e) {
      console.warn("orderBy failed, falling back to unordered", e);
      const snapshot = await getDocs(collection(db, "collections"));
      const cols = [];
      snapshot.forEach(d => cols.push({ id: d.id, ...d.data() }));
      cols.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCollectionsList(cols);
    }
  };

  const fetchProducts = async (colId) => {
    try {
      const q = query(collection(db, "collections", colId, "products"), orderBy("order"));
      const snapshot = await getDocs(q);
      const prods = [];
      snapshot.forEach(d => prods.push({ id: d.id, ...d.data() }));
      setProductsList(prods);
    } catch (e) {
      console.warn("orderBy failed, falling back to unordered", e);
      const snapshot = await getDocs(collection(db, "collections", colId, "products"));
      const prods = [];
      snapshot.forEach(d => prods.push({ id: d.id, ...d.data() }));
      prods.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProductsList(prods);
    }
  };

  const fetchOrders = async () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const ords = [];
    snapshot.forEach(doc => ords.push({ id: doc.id, ...doc.data() }));
    setOrdersList(ords);
  };

  // --- Collection CRUD ---
  const handleSaveCollection = async (e) => {
    e.preventDefault();
    const data = {
      name: colFormData.name,
      description: colFormData.description,
      img: colFormData.img,
      order: Number(colFormData.order) || 0
    };
    if (colFormData.id) {
      await updateDoc(doc(db, "collections", colFormData.id), data);
    } else {
      await addDoc(collection(db, "collections"), data);
    }
    setIsColModalOpen(false);
    fetchCollections();
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection? All products inside must be deleted manually first if you want to keep Firebase clean.")) {
      await deleteDoc(doc(db, "collections", id));
      fetchCollections();
    }
  };

  const handleEditCollection = (col) => {
    setColFormData({ id: col.id, name: col.name || col.title || '', description: col.description || col.desc || '', img: col.img || col.image || '', order: col.order || 0 });
    setIsColModalOpen(true);
  };

  // --- Product CRUD ---
  const handleOpenProducts = (col) => {
    setCurrentCollection(col);
    fetchProducts(col.id);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!currentCollection) return;
    const data = {
      name: prodFormData.name,
      price: prodFormData.price,
      description: prodFormData.description,
      img: prodFormData.img,
      sizes: prodFormData.sizes,
      refcode: prodFormData.refcode,
      order: Number(prodFormData.order) || 0
    };
    if (prodFormData.id) {
      await updateDoc(doc(db, "collections", currentCollection.id, "products", prodFormData.id), data);
    } else {
      await addDoc(collection(db, "collections", currentCollection.id, "products"), data);
    }
    setIsProdModalOpen(false);
    fetchProducts(currentCollection.id);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "collections", currentCollection.id, "products", id));
      fetchProducts(currentCollection.id);
    }
  };

  const handleEditProduct = (prod) => {
    setProdFormData({
      id: prod.id,
      name: prod.name || '',
      price: prod.price || '',
      description: prod.description || prod.desc || '',
      img: prod.img || prod.image || '',
      sizes: prod.sizes || '',
      refcode: prod.refcode || '',
      order: prod.order || 0
    });
    setIsProdModalOpen(true);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order record?")) {
      await deleteDoc(doc(db, "orders", orderId));
      fetchOrders();
    }
  };

  if (!user) {
    return (
      <div id="login-container" className="admin-login-wrapper">
        <div className="login-box">
          <h2>Admin Login</h2>
          <p>Please enter your credentials to access the admin panel.</p>
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="btn">Login</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard">
      <header id="admin-navbar">
        <div className="container nav-container" style={{ justifyContent: 'space-between' }}>
          <div className="logo">
            <h2>LIM Admin</h2>
          </div>
          <div>
            <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid white' }}>Logout</button>
          </div>
        </div>
      </header>

      <div className="container admin-content">
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => { setActiveTab('collections'); setCurrentCollection(null); }}>Collections</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>

        {activeTab === 'collections' && (
          <div id="tab-collections" className="tab-content active">
            
            {!currentCollection ? (
              <>
                <div className="header-action">
                  <h3>Manage Collections</h3>
                  <button className="btn" onClick={() => { setColFormData({ id: '', name: '', description: '', img: '', order: 0 }); setIsColModalOpen(true); }}><i className="fas fa-plus"></i> Add Collection</button>
                </div>
                <div id="admin-collections-list" className="admin-grid">
                  {collectionsList.map(col => (
                    <div key={col.id} className="admin-card">
                      <div className="admin-card-img" style={{ backgroundImage: `url(${col.img || col.image || ''})` }}>
                        {!(col.img || col.image) && 'No Image'}
                      </div>
                      <div className="admin-card-content">
                        <h4>{col.name || col.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Order: {col.order ?? 0}</p>
                        <div className="admin-actions">
                          <button className="admin-btn admin-btn-view" onClick={() => handleOpenProducts(col)}>Products</button>
                          <button className="admin-btn admin-btn-edit" onClick={() => handleEditCollection(col)}><i className="fas fa-edit"></i> Edit</button>
                          <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteCollection(col.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="header-action">
                  <div>
                    <button className="btn" style={{ background: 'var(--light-bg)', color: 'var(--text-color)', marginRight: '15px' }} onClick={() => setCurrentCollection(null)}><i className="fas fa-arrow-left"></i> Back</button>
                    <h3 style={{ display: 'inline-block' }}>{currentCollection.name || currentCollection.title} Products</h3>
                  </div>
                  <button className="btn" onClick={() => { setProdFormData({ id: '', name: '', price: '', description: '', img: '', sizes: '', refcode: '', order: 0 }); setIsProdModalOpen(true); }}><i className="fas fa-plus"></i> Add Product</button>
                </div>
                <div id="admin-products-list" className="admin-grid">
                  {productsList.length === 0 ? <p>No products found in this collection.</p> : productsList.map(prod => (
                    <div key={prod.id} className="admin-card">
                      <div className="admin-card-img" style={{ backgroundImage: `url(${prod.img || prod.image || ''})` }}>
                        {!(prod.img || prod.image) && 'No Image'}
                      </div>
                      <div className="admin-card-content">
                        <h4>{prod.name}</h4>
                        {prod.price && <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '5px' }}>{prod.price}</p>}
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Order: {prod.order ?? 0}</p>
                        <div className="admin-actions">
                          <button className="admin-btn admin-btn-edit" onClick={() => handleEditProduct(prod)}><i className="fas fa-edit"></i> Edit</button>
                          <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteProduct(prod.id)}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        )}

        {activeTab === 'orders' && (
          <div id="tab-orders" className="tab-content active">
            <div className="header-action">
              <h3>Manage Orders & Inquiries</h3>
            </div>
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email / Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map(order => (
                    <tr key={order.id}>
                      <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : ''}</td>
                      <td>{order.name}</td>
                      <td>{order.email}<br/>{order.phone}</td>
                      <td>{order.type}</td>
                      <td>
                        <select 
                          value={order.status || 'new'} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                          style={{ padding: '5px', borderRadius: '4px' }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <button className="admin-btn admin-btn-delete" style={{ display: 'inline-block', width: 'auto' }} onClick={() => deleteOrder(order.id)}><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isColModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '20px', cursor: 'pointer', fontSize: '1.5rem', color: '#999' }} onClick={() => setIsColModalOpen(false)}>&times;</span>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>{colFormData.id ? 'Edit Collection' : 'Add Collection'}</h3>
            <form onSubmit={handleSaveCollection}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Collection Name</label>
                <input type="text" value={colFormData.name} onChange={e => setColFormData({...colFormData, name: e.target.value})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Description</label>
                <textarea rows="3" value={colFormData.description} onChange={e => setColFormData({...colFormData, description: e.target.value})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Cover Image URL</label>
                <input type="url" value={colFormData.img} onChange={e => setColFormData({...colFormData, img: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Sort Order</label>
                <input type="number" value={colFormData.order} onChange={e => setColFormData({...colFormData, order: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Save Collection</button>
            </form>
          </div>
        </div>
      )}

      {isProdModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <span style={{ position: 'absolute', top: '15px', right: '20px', cursor: 'pointer', fontSize: '1.5rem', color: '#999' }} onClick={() => setIsProdModalOpen(false)}>&times;</span>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>{prodFormData.id ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSaveProduct}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
                <input type="text" value={prodFormData.name} onChange={e => setProdFormData({...prodFormData, name: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price</label>
                <input type="text" placeholder="e.g. £120.00 / sqm" value={prodFormData.price} onChange={e => setProdFormData({...prodFormData, price: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea rows="3" value={prodFormData.description} onChange={e => setProdFormData({...prodFormData, description: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image URL</label>
                <input type="url" value={prodFormData.img} onChange={e => setProdFormData({...prodFormData, img: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Available Sizes</label>
                <input type="text" placeholder="e.g. 80x80, 60x60" value={prodFormData.sizes} onChange={e => setProdFormData({...prodFormData, sizes: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reference Code</label>
                <input type="text" value={prodFormData.refcode} onChange={e => setProdFormData({...prodFormData, refcode: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sort Order</label>
                <input type="number" value={prodFormData.order} onChange={e => setProdFormData({...prodFormData, order: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
