"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../src/supabase';
import { ReactSortable } from 'react-sortablejs';
import emailjs from '@emailjs/browser';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../../src/admin.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Client-side image compression helper using canvas
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; // maintain white background for transparency
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob returned null'));
            }
            // Create a new File object from the blob, converting format to jpeg
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'collections' | 'orders'
  const [collectionsList, setCollectionsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  // --- Filter States for Orders ---
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');

  // --- CRUD States ---
  const [currentCollection, setCurrentCollection] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [colFormData, setColFormData] = useState({ id: '', name: '', description: '', img: '', order: 0, parentId: '', type: 'collection' });

  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [prodFormData, setProdFormData] = useState({ id: '', name: '', price: '', description: '', img: '', sizes: '', refcode: '', order: 0 });

  // --- Reply Modal States ---
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyData, setReplyData] = useState({ orderId: '', name: '', email: '', phone: '', message: '', replyMsg: '' });
  const [replyStatus, setReplyStatus] = useState('');

  const productDragTimeoutRef = useRef(null);
  const collectionDragTimeoutRef = useRef(null);

  useEffect(() => {
    emailjs.init("JeeX6f6eeMESMyxnL"); // From old-site/admin.html

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchCollections();
        fetchOrders();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchCollections();
        fetchOrders();
      }
    });
    return () => {
      subscription.unsubscribe();
      if (productDragTimeoutRef.current) clearTimeout(productDragTimeoutRef.current);
      if (collectionDragTimeoutRef.current) clearTimeout(collectionDragTimeoutRef.current);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Invalid email or password');
    else setError('');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase.from('collections').select('*').order('order');
      if (error) throw error;
      setCollectionsList(data || []);
      
      // Calculate total products in one fast query
      const { count, error: countError } = await supabase
        .from("products")
        .select('id', { count: 'exact', head: true });
      if (countError) throw countError;
      setTotalProductsCount(count || 0);
    } catch (e) {
      console.warn("fetchCollections failed", e);
      setCollectionsList([]);
    }
  };

  const fetchProducts = async (colId) => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('collection_id', colId).order('order');
      if (error) throw error;
      setProductsList(data || []);
    } catch (e) {
      console.warn("fetchProducts failed", e);
      setProductsList([]);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) {
      setOrdersList(data || []);
    }
  };

  // --- Collection CRUD ---
  const handleSaveCollection = async (e) => {
    e.preventDefault();
    const data = {
      name: colFormData.name,
      description: colFormData.description,
      img: colFormData.img,
      order: Number(colFormData.order) || 0,
      parent_id: colFormData.parentId || null,
      type: colFormData.type || 'collection'
    };
    if (colFormData.id) {
      await supabase.from('collections').update(data).eq('id', colFormData.id);
    } else {
      await supabase.from('collections').insert([data]);
    }
    setIsColModalOpen(false);
    fetchCollections();
  };

  const handleDeleteCollection = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection? All products inside must be deleted manually first if you want to keep Supabase clean.")) {
      await supabase.from('collections').delete().eq('id', id);
      fetchCollections();
    }
  };

  const handleEditCollection = (col) => {
    setColFormData({ 
      id: col.id, 
      name: col.name || col.title || '', 
      description: col.description || col.desc || '', 
      img: col.img || col.image || '', 
      order: col.order || 0,
      parentId: col.parent_id || col.parentId || '',
      type: col.type || 'collection'
    });
    setIsColModalOpen(true);
  };

  const handleColImageUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    try {
      // Compress the image before uploading to reduce egress and storage
      const file = await compressImage(rawFile);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setColFormData({ ...colFormData, img: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    }
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
      collection_id: currentCollection.id,
      name: prodFormData.name,
      price: prodFormData.price,
      description: prodFormData.description,
      img: prodFormData.img,
      sizes: prodFormData.sizes,
      refcode: prodFormData.refcode,
      order: Number(prodFormData.order) || 0
    };
    if (prodFormData.id) {
      await supabase.from('products').update(data).eq('id', prodFormData.id);
    } else {
      await supabase.from('products').insert([data]);
    }
    setIsProdModalOpen(false);
    fetchProducts(currentCollection.id);
    fetchCollections(); // Update total count
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts(currentCollection.id);
      fetchCollections(); // Update total count
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

  const handleProdImageUpload = async (e) => {
    const rawFile = e.target.files[0];
    if (!rawFile) return;

    try {
      // Compress the image before uploading to reduce egress and storage
      const file = await compressImage(rawFile);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage.from('images').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setProdFormData({ ...prodFormData, img: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    }
  };

  // --- Sortable Handlers ---
  const onCollectionsSortEnd = (newList) => {
    const updatedList = newList.map((col, index) => ({ ...col, order: index }));
    setCollectionsList(updatedList);

    if (collectionDragTimeoutRef.current) {
      clearTimeout(collectionDragTimeoutRef.current);
    }

    collectionDragTimeoutRef.current = setTimeout(async () => {
      const updates = updatedList.map(col => ({
        id: col.id,
        order: col.order
      }));
      const { error } = await supabase.from('collections').upsert(updates);
      if (error) {
        console.error("Failed to update collections order", error);
      }
    }, 500);
  };

  const onProductsSortEnd = (newList) => {
    const updatedList = newList.map((prod, index) => ({ ...prod, order: index }));
    setProductsList(updatedList);

    if (productDragTimeoutRef.current) {
      clearTimeout(productDragTimeoutRef.current);
    }

    productDragTimeoutRef.current = setTimeout(async () => {
      const updates = updatedList.map(prod => ({
        id: prod.id,
        order: prod.order
      }));
      const { error } = await supabase.from('products').upsert(updates);
      if (error) {
        console.error("Failed to update products order", error);
      }
    }, 500);
  };

  // --- Orders Logic ---
  const updateOrderStatus = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order record?")) {
      await supabase.from('orders').delete().eq('id', orderId);
      fetchOrders();
    }
  };

  const setDateFilter = (daysAgoStart, daysAgoEnd) => {
    if (daysAgoStart === null && daysAgoEnd === null) {
      setOrderDateFrom('');
      setOrderDateTo('');
    } else {
      const now = new Date();
      const start = new Date(now.getTime() - (daysAgoStart * 24 * 60 * 60 * 1000));
      const end = new Date(now.getTime() - (daysAgoEnd * 24 * 60 * 60 * 1000));
      setOrderDateFrom(start.toISOString().split('T')[0]);
      setOrderDateTo(end.toISOString().split('T')[0]);
    }
  };

  const filteredOrders = useMemo(() => {
    let list = [...ordersList];
    
    if (orderSearch) {
      const s = orderSearch.toLowerCase();
      list = list.filter(o => (o.name || '').toLowerCase().includes(s) || (o.email || '').toLowerCase().includes(s) || (o.type || '').toLowerCase().includes(s));
    }
    
    if (orderStatusFilter !== 'All') {
      list = list.filter(o => (o.status || 'new').toLowerCase() === orderStatusFilter.toLowerCase());
    }

    if (orderDateFrom) {
      const from = new Date(orderDateFrom + 'T00:00:00');
      list = list.filter(o => new Date(o.created_at) >= from);
    }

    if (orderDateTo) {
      const to = new Date(orderDateTo + 'T23:59:59');
      list = list.filter(o => new Date(o.created_at) <= to);
    }

    return list;
  }, [ordersList, orderSearch, orderStatusFilter, orderDateFrom, orderDateTo]);


  // --- Reply Modal ---
  const handleOpenReply = (order) => {
    let detailsStr = '';
    if (order.type === 'Sample Request') {
      detailsStr = `Collection: ${order.collection}<br>Tile: ${order.tile}<br>Qty: ${order.quantity}<br>Address: ${order.address}, ${order.city}`;
    } else {
      detailsStr = order.message || '';
    }

    setReplyData({
      orderId: order.id,
      name: order.name || 'Unknown',
      email: order.email || '',
      phone: order.phone || '',
      message: detailsStr,
      replyMsg: ''
    });
    setReplyStatus('');
    setIsReplyModalOpen(true);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = replyData.phone.replace(/[^0-9+]/g, '');
    if (!cleanPhone) return alert("No phone number available");
    if (!replyData.replyMsg) return alert("Type a message first");

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyData.replyMsg)}`, '_blank');
    updateOrderStatus(replyData.orderId, 'contacted');
  };

  const handleSendEmail = () => {
    if (!replyData.email || replyData.email === 'N/A') return alert("No email available");
    if (!replyData.replyMsg) return alert("Type a message first");

    setReplyStatus('Sending email...');

    const templateParams = {
        to_name: replyData.name,
        to_email: replyData.email,
        reply_message: replyData.replyMsg
    };

    emailjs.send('service_bwb75tb', 'template_046burx', templateParams)
        .then(() => {
            setReplyStatus('Email sent successfully!');
            updateOrderStatus(replyData.orderId, 'contacted');
            setTimeout(() => {
              setIsReplyModalOpen(false);
            }, 2000);
        })
        .catch(err => {
            console.error(err);
            setReplyStatus('Failed to send email. Check EmailJS setup.');
        });
  };

  // --- Dashboard Analytics Logic ---
  const dashboardStats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let weekCount = 0;
    let lastWeekCount = 0;
    let monthCount = 0;
    let lastMonthCount = 0;
    let statusCounts = { new: 0, contacted: 0, closed: 0 };
    
    let sampleRequests = 0;
    let generalInquiries = 0;

    let recentOrderStr = "None yet.";

    if (ordersList.length > 0) {
      const recent = ordersList[0];
      const dateStr = recent.created_at ? new Date(recent.created_at).toLocaleDateString() : '';
      recentOrderStr = `${recent.name || 'Unknown'} - ${recent.type || 'Inquiry'} (${dateStr})`;
    }

    const weeksData = [0, 0, 0, 0];

    ordersList.forEach(order => {
      if (order.created_at) {
        const d = new Date(order.created_at);
        if (d > oneWeekAgo) weekCount++;
        else if (d > twoWeeksAgo) lastWeekCount++;
        
        if (d > oneMonthAgo) monthCount++;
        else if (d > twoMonthsAgo) lastMonthCount++;

        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays < 7) weeksData[3]++;
        else if (diffDays >= 7 && diffDays < 14) weeksData[2]++;
        else if (diffDays >= 14 && diffDays < 21) weeksData[1]++;
        else if (diffDays >= 21 && diffDays < 28) weeksData[0]++;
      }

      if (order.type === 'Sample Request') sampleRequests++;
      else generalInquiries++;

      const s = (order.status || 'new').toLowerCase();
      if (statusCounts[s] !== undefined) statusCounts[s]++;
    });

    let weekDelta = lastWeekCount === 0 ? 100 : Math.round(((weekCount - lastWeekCount) / lastWeekCount) * 100);
    let monthDelta = lastMonthCount === 0 ? 100 : Math.round(((monthCount - lastMonthCount) / lastMonthCount) * 100);

    const labels = [];
    for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        labels.push(d.toLocaleDateString(undefined, {month:'short', day:'numeric'}));
    }

    return {
      weekCount, weekDelta, lastWeekCount,
      monthCount, monthDelta, lastMonthCount,
      statusCounts, recentOrderStr,
      weeksData, labels,
      sampleRequests, generalInquiries
    };
  }, [ordersList]);

  // Chart configs
  const barData = {
    labels: dashboardStats.labels,
    datasets: [{
      label: 'Inquiries (Last 4 Weeks)',
      data: dashboardStats.weeksData,
      backgroundColor: 'rgba(163, 26, 30, 0.7)',
      borderRadius: 4
    }]
  };

  const doughnutData = {
    labels: ['Sample Requests', 'General Inquiries'],
    datasets: [{
      data: [dashboardStats.sampleRequests, dashboardStats.generalInquiries],
      backgroundColor: ['rgba(163, 26, 30, 0.8)', 'rgba(60, 60, 60, 0.8)'],
      borderWidth: 0
    }]
  };

  const funnelData = {
    labels: ['New', 'Contacted', 'Closed'],
    datasets: [{
      label: 'Status Funnel',
      data: [dashboardStats.statusCounts.new, dashboardStats.statusCounts.contacted, dashboardStats.statusCounts.closed],
      backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
      borderRadius: 4
    }]
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
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
          <button className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => { setActiveTab('collections'); setCurrentCollection(null); }}>Collections</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>

        {activeTab === 'dashboard' && (
          <div id="tab-dashboard" className="tab-content active">
            <div className="header-action">
              <h3>Dashboard Analytics</h3>
            </div>
            <div className="dashboard-grid">
              <div className="stat-card">
                  <h5>TOTAL COLLECTIONS</h5>
                  <p id="dash-tot-collections">{collectionsList.length}</p>
              </div>
              <div className="stat-card">
                  <h5>TOTAL PRODUCTS</h5>
                  <p id="dash-tot-products">{totalProductsCount}</p>
              </div>
              <div className="stat-card">
                  <h5>ORDERS THIS WEEK</h5>
                  <p id="dash-orders-week">{dashboardStats.weekCount}</p>
                  <span id="badge-orders-week" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '12px', background: dashboardStats.weekDelta >= 0 ? '#e6f4ea' : '#fce8e6', color: dashboardStats.weekDelta >= 0 ? 'green' : 'red' }}>
                    {dashboardStats.lastWeekCount === 0 ? '+100% vs last week' : `${dashboardStats.weekDelta > 0 ? '+' : ''}${dashboardStats.weekDelta}% vs last week`}
                  </span>
              </div>
              <div className="stat-card">
                  <h5>ORDERS BY STATUS</h5>
                  <p id="dash-orders-status" style={{ fontSize: '1rem', lineHeight: '1.5', color: '#444', marginTop: '10px' }}>
                    New: {dashboardStats.statusCounts.new}<br/>
                    Contacted: {dashboardStats.statusCounts.contacted}<br/>
                    Closed: {dashboardStats.statusCounts.closed}
                  </p>
                  <span id="badge-orders-status" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '12px', background: dashboardStats.monthDelta >= 0 ? '#e6f4ea' : '#fce8e6', color: dashboardStats.monthDelta >= 0 ? 'green' : 'red' }}>
                    {dashboardStats.lastMonthCount === 0 ? '+100% vs last month' : `${dashboardStats.monthDelta > 0 ? '+' : ''}${dashboardStats.monthDelta}% vs last month`}
                  </span>
              </div>
              <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
                  <h5>MOST RECENT ORDER</h5>
                  <p id="dash-recent-order" style={{ fontSize: '1.1rem', color: '#555', marginTop: '10px' }}>{dashboardStats.recentOrderStr}</p>
              </div>
            </div>
            
            <div className="dashboard-chart-container" style={{ marginTop: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: '1 / -1', height: '200px' }}>
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
                <div style={{ gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4 style={{ marginBottom: '15px', color: '#555' }}>Inquiry Split</h4>
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                      <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%' }} />
                    </div>
                </div>
                <div style={{ gridColumn: '2 / 4', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4 style={{ marginBottom: '15px', color: '#555' }}>Status Funnel</h4>
                    <div style={{ height: '250px', width: '100%', position: 'relative' }}>
                      <Bar data={funnelData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'collections' && (
          <div id="tab-collections" className="tab-content active">
            
            {!currentCollection ? (
              <>
                <div className="header-action">
                  <h3>Manage Collections <span style={{fontSize: '0.8rem', fontWeight: 'normal', color: '#888', marginLeft: '10px'}}>(Drag to reorder)</span></h3>
                  <button className="btn" onClick={() => { setColFormData({ id: '', name: '', description: '', img: '', order: 0, parentId: '', type: 'collection' }); setIsColModalOpen(true); }}><i className="fas fa-plus"></i> Add Collection</button>
                </div>
                {collectionsList.length === 0 ? <p>No collections found.</p> : (
                  <ReactSortable 
                    list={collectionsList} 
                    setList={onCollectionsSortEnd} 
                    className="admin-grid" 
                    animation={150} 
                    ghostClass="dragging"
                  >
                    {collectionsList.map(col => (
                      <div key={col.id} className="admin-card">
                        <div className="admin-card-img" style={{ backgroundImage: `url(${col.img || col.image || ''})` }}>
                          {!(col.img || col.image) && 'No Image'}
                        </div>
                        <div className="admin-card-content">
                          <h4>{col.name || col.title}</h4>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span style={{ background: col.type === 'category' ? '#e0f2fe' : '#f0fdf4', color: col.type === 'category' ? '#0369a1' : '#15803d', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                              {col.type || 'collection'}
                            </span>
                            {col.parent_id && (
                              <span style={{ background: '#f3f4f6', color: '#4b5563', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                                Parent: {collectionsList.find(p => p.id === col.parent_id)?.name || 'Unknown'}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>Order: {col.order ?? 0}</p>
                          <div className="admin-actions">
                            {col.type !== 'category' && (
                              <button className="admin-btn admin-btn-view" onClick={() => handleOpenProducts(col)}>Products</button>
                            )}
                            <button className="admin-btn admin-btn-edit" onClick={() => handleEditCollection(col)}><i className="fas fa-edit"></i> Edit</button>
                            <button className="admin-btn admin-btn-delete" onClick={() => handleDeleteCollection(col.id)}><i className="fas fa-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ReactSortable>
                )}
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
                {productsList.length === 0 ? <p>No products found in this collection.</p> : (
                  <ReactSortable 
                    list={productsList} 
                    setList={onProductsSortEnd} 
                    className="admin-grid" 
                    animation={150} 
                    ghostClass="dragging"
                  >
                    {productsList.map(prod => (
                      <div key={prod.id} className="collection-card" style={{ opacity: 1, transform: 'translateY(0)', display: 'flex', flexDirection: 'column' }}>
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
                            width: '100%'
                          } : { width: '100%' }}
                          title={prod.img ? 'Product Image' : ''}
                        >
                          {!prod.img && <span>Product Image</span>}
                        </div>
                        <div className="card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flexGrow: 1 }}>
                          <div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', gap: '0.4rem', marginBottom: '0.5rem' }}>
                              <h3 style={{ margin: '0', fontWeight: 'bold', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textTransform: 'uppercase', fontSize: '1.2rem', color: '#000' }}>{prod.name}</h3>
                              {prod.refcode && <span className="ref-code" style={{ fontWeight: 'normal' }}>{prod.refcode}</span>}
                            </div>
                            <p className="card-desc" style={{ marginTop: '0.4rem', fontSize: '0.9rem', color: '#555' }}>{prod.description || prod.desc || ''}</p>

                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px', marginBottom: '15px' }}>Order: {prod.order ?? 0}</p>
                          </div>
                          <div className="admin-actions" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            <button className="admin-btn admin-btn-edit" style={{ flex: 1, padding: '8px 12px' }} onClick={() => handleEditProduct(prod)}><i className="fas fa-edit"></i> Edit</button>
                            <button className="admin-btn admin-btn-delete" style={{ width: '40px', padding: '8px 12px' }} onClick={() => handleDeleteProduct(prod.id)}><i className="fas fa-trash"></i></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ReactSortable>
                )}
              </>
            )}

          </div>
        )}

        {activeTab === 'orders' && (
          <div id="tab-orders" className="tab-content active">
            <div className="header-action">
              <h3>Manage Orders & Inquiries</h3>
            </div>

            <div className="order-filters" style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e5e7eb', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="Search by name, email or type..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 200px' }} />
                
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <option value="All">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                </select>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>From:</label>
                    <input type="date" value={orderDateFrom} onChange={e => setOrderDateFrom(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    <label style={{ fontSize: '0.9rem', color: '#666' }}>To:</label>
                    <input type="date" value={orderDateTo} onChange={e => setOrderDateTo(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn" style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#e5e7eb', color: '#374151' }} onClick={() => setDateFilter(0, 0)}>Today</button>
                    <button className="btn" style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#e5e7eb', color: '#374151' }} onClick={() => setDateFilter(7, 0)}>7D</button>
                    <button className="btn" style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#e5e7eb', color: '#374151' }} onClick={() => setDateFilter(30, 0)}>30D</button>
                    <button className="btn" style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#e5e7eb', color: '#374151' }} onClick={() => setDateFilter(null, null)}>All</button>
                </div>
            </div>

            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email / Phone</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan="7">No orders or inquiries found.</td></tr>
                  ) : (
                    filteredOrders.map(order => {
                      let detailsStr = '';
                      if (order.type === 'Sample Request') {
                          detailsStr = `Col: ${order.collection} | Tile: ${order.tile} | Qty: ${order.quantity} | Addr: ${order.address}, ${order.city}`;
                      } else {
                          detailsStr = order.message ? (order.message.length > 50 ? order.message.substring(0, 50) + '...' : order.message) : '';
                      }

                      return (
                      <tr key={order.id}>
                        <td>{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</td>
                        <td><strong>{order.name}</strong></td>
                        <td>{order.email}<br/>{order.phone}</td>
                        <td>{order.type}</td>
                        <td style={{ fontSize: '0.85rem' }}>{detailsStr}</td>
                        <td><span className={`status-badge status-${order.status || 'new'}`}>{(order.status || 'new').toUpperCase()}</span></td>
                        <td>
                          <select 
                            value={order.status || 'new'} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)} 
                            style={{ padding: '5px', borderRadius: '4px', marginBottom: '5px', display: 'block', width: '100%' }}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button className="admin-btn admin-btn-view" style={{ width: 'auto', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleOpenReply(order)}><i className="fas fa-reply"></i> Reply</button>
                          <button className="admin-btn admin-btn-delete" style={{ display: 'inline-block', width: 'auto', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => deleteOrder(order.id)}><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                      );
                    })
                  )}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Type</label>
                <select 
                  value={colFormData.type || 'collection'} 
                  onChange={e => setColFormData({...colFormData, type: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}
                >
                  <option value="collection">Product Collection (contains products)</option>
                  <option value="category">Category Folder (contains subfolders/collections)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Parent Category</label>
                <select 
                  value={colFormData.parentId || ''} 
                  onChange={e => setColFormData({...colFormData, parentId: e.target.value})} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' }}
                >
                  <option value="">None (Root Category)</option>
                  {collectionsList
                    .filter(c => c.type === 'category' && c.id !== colFormData.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name || c.title}</option>
                    ))
                  }
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Description</label>
                <textarea rows="3" value={colFormData.description} onChange={e => setColFormData({...colFormData, description: e.target.value})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--primary-color)' }}>Cover Image</label>
                <input type="file" accept="image/*" onChange={handleColImageUpload} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', textAlign: 'center' }}>- OR paste a URL below -</div>
                <input type="url" placeholder="https://..." value={colFormData.img} onChange={e => setColFormData({...colFormData, img: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Base Price (Fallback)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 700 PKr/sqm" 
                  value={(function(){
                    if (!prodFormData.price) return '';
                    try { const p = JSON.parse(prodFormData.price); return p.base !== undefined ? p.base : ''; } 
                    catch(e) { return prodFormData.price; }
                  })()} 
                  onChange={e => {
                    const val = e.target.value;
                    let p = {};
                    if (prodFormData.price) {
                      try { p = JSON.parse(prodFormData.price); } 
                      catch(err) { p = { base: prodFormData.price }; }
                    }
                    p.base = val;
                    setProdFormData({...prodFormData, price: JSON.stringify(p)});
                  }} 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px' }} 
                />
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem', color: '#555' }}>Override Price per Size (Optional)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {(prodFormData.sizes ? prodFormData.sizes.split(',').map(s => s.trim()).filter(Boolean) : []).map(size => (
                    <div key={size}>
                      <span style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>{size}</span>
                      <input 
                        type="text" 
                        placeholder={`Custom price`}
                        value={(function(){
                          if (!prodFormData.price) return '';
                          try { const p = JSON.parse(prodFormData.price); return p[size] || ''; } 
                          catch(e) { return ''; }
                        })()} 
                        onChange={e => {
                          const val = e.target.value;
                          let p = {};
                          if (prodFormData.price) {
                            try { p = JSON.parse(prodFormData.price); } 
                            catch(err) { p = { base: prodFormData.price }; }
                          }
                          if (val) p[size] = val; else delete p[size];
                          setProdFormData({...prodFormData, price: JSON.stringify(p)});
                        }} 
                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem' }} 
                      />
                    </div>
                  ))}
                  {(!prodFormData.sizes || prodFormData.sizes.trim() === '') && (
                    <div style={{ gridColumn: '1 / -1', fontSize: '0.85rem', color: '#888' }}>
                      Please enter available sizes below first to set custom prices.
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea rows="3" value={prodFormData.description} onChange={e => setProdFormData({...prodFormData, description: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleProdImageUpload} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', textAlign: 'center' }}>- OR paste a URL below -</div>
                <input type="url" placeholder="https://..." value={prodFormData.img} onChange={e => setProdFormData({...prodFormData, img: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }} />
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

      {isReplyModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="admin-modal" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '15px', right: '20px', cursor: 'pointer', fontSize: '1.5rem', color: '#999' }} onClick={() => setIsReplyModalOpen(false)}>&times;</span>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Reply to Inquiry</h3>
            <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }}>
                <p><strong>Name:</strong> {replyData.name}</p>
                <p><strong>Email:</strong> {replyData.email}</p>
                <p><strong>Phone:</strong> {replyData.phone}</p>
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                    <strong>Message/Details:</strong>
                    <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: replyData.message }}></p>
                </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Reply Message</label>
                <textarea 
                  rows="6" 
                  placeholder="Type your response here..." 
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit' }}
                  value={replyData.replyMsg}
                  onChange={e => setReplyData({...replyData, replyMsg: e.target.value})}
                ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" style={{ flex: 1, background: '#25D366', borderColor: '#25D366', color: 'white' }} onClick={handleSendWhatsApp}>
                    <i className="fab fa-whatsapp"></i> Send via WhatsApp
                </button>
                <button className="btn" style={{ flex: 1 }} onClick={handleSendEmail}>
                    <i className="fas fa-envelope"></i> Send Email
                </button>
            </div>
            {replyStatus && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{replyStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
