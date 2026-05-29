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
    const q = query(collection(db, "collections"), orderBy("order"));
    const snapshot = await getDocs(q);
    const cols = [];
    snapshot.forEach(doc => cols.push({ id: doc.id, ...doc.data() }));
    setCollectionsList(cols);
  };

  const fetchOrders = async () => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const ords = [];
    snapshot.forEach(doc => ords.push({ id: doc.id, ...doc.data() }));
    setOrdersList(ords);
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
          <button className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>Collections</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>

        {activeTab === 'collections' && (
          <div id="tab-collections" className="tab-content active">
            <div className="header-action">
              <h3>Manage Collections</h3>
              <button className="btn"><i className="fas fa-plus"></i> Add Collection</button>
            </div>
            <div id="admin-collections-list" className="admin-grid">
              {collectionsList.map(col => (
                <div key={col.id} className="admin-card">
                  <h4>{col.name || col.title}</h4>
                  <p>{col.description || col.desc}</p>
                </div>
              ))}
            </div>
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
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map(order => (
                    <tr key={order.id}>
                      <td>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : ''}</td>
                      <td>{order.name}</td>
                      <td>{order.email}<br/>{order.phone}</td>
                      <td>{order.type}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
