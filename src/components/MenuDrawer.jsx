"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';
import { slugify } from '../lib/slugify';
import RecentlyViewed from './RecentlyViewed';

// Construct hierarchy dynamically
const buildTree = (items) => {
  const itemMap = {};
  const roots = [];

  items.forEach(item => {
    itemMap[item.id] = { ...item, children: [] };
  });

  items.forEach(item => {
    const mapped = itemMap[item.id];
    if (mapped.parentId && itemMap[mapped.parentId]) {
      itemMap[mapped.parentId].children.push(mapped);
    } else {
      roots.push(mapped);
    }
  });

  const sortTree = (node) => {
    if (node.children) {
      node.children.sort((a, b) => (a.order || 0) - (b.order || 0));
      node.children.forEach(sortTree);
    }
  };
  roots.forEach(sortTree);
  roots.sort((a, b) => (a.order || 0) - (b.order || 0));
  return roots;
};

const processCollections = (rawItems) => {
  const cols = [];
  rawItems.forEach((rawData) => {
    const data = {};
    for (let key in rawData) {
      const cleanKey = key.toLowerCase().replace(/[\s_]+/g, '');
      data[cleanKey] = rawData[key];
    }
    cols.push({
      id: rawData.id,
      name: data.name || data.title || 'Unnamed',
      desc: data.description || data.desc || data.detail || '',
      img: data.img || data.imageurl || data.imgurl || data.image || data.pic || '',
      parentId: data.parentid || '',
      type: data.type || 'collection',
      order: data.order !== undefined ? Number(data.order) : 0
    });
  });

  const roots = buildTree(cols);
  const initialExpanded = {};
  roots.forEach(r => {
    initialExpanded[r.id] = true;
    if (r.children) {
      r.children.forEach(c => {
        initialExpanded[c.id] = true;
      });
    }
  });
  return { cols, roots, initialExpanded };
};

const MenuDrawer = ({ isOpen, onClose, onSelectCollection, onOpenProduct, onNavigate, initialCollections, initialProducts }) => {
  const initialProcessed = initialCollections && initialCollections.length > 0
    ? processCollections(initialCollections)
    : null;

  const [collections, setCollections] = useState(initialProcessed ? initialProcessed.cols : []);
  const [treeRoots, setTreeRoots] = useState(initialProcessed ? initialProcessed.roots : []);
  const [allProducts, setAllProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProcessed);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(initialProcessed ? initialProcessed.initialExpanded : {});

  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (collections.length > 0 && allProducts.length > 0) return; // already loaded from server props

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Collections if not available
        let cols = collections;
        if (cols.length === 0) {
          const { data: querySnapshot, error } = await supabase.from('collections').select('*').order('order');
          if (error) throw error;
          const processed = processCollections(querySnapshot);
          cols = processed.cols;
          setCollections(cols);
          setTreeRoots(processed.roots);
          setExpandedNodes(processed.initialExpanded);
        }

        // 2. Fetch all products from all collections for search indexing if not available
        if (allProducts.length === 0) {
          const productsIndex = [];
          for (const col of cols) {
            if (col.type === 'category') continue; // only leaf collections hold products
            try {
              const { data: pSnapshot, error: pError } = await supabase.from('products').select('*').eq('collection_id', col.id).order('order');
              if (pError) throw pError;
              
              pSnapshot.forEach((rawData) => {
                const pData = {};
                for (let key in rawData) {
                    const cleanKey = key.toLowerCase().replace(/[\s_]+/g, '');
                    pData[cleanKey] = rawData[key];
                }
                productsIndex.push({
                  id: rawData.id,
                  name: pData.name || pData.title || 'Unnamed',
                  desc: pData.description || pData.desc || pData.detail || '',
                  img: pData.img || pData.imageurl || pData.imgurl || pData.image || pData.pic || '',
                  price: pData.price || pData.cost || '',
                  refcode: pData.refcode || pData.referencecode || pData.code || '',
                  sizes: pData.sizes || pData.size || pData.availablesizes || pData.available_sizes || '',
                  collectionId: col.id,
                  collectionName: col.name
                });
              });
            } catch (pe) {
              console.warn(`Could not index products for collection ${col.name}:`, pe);
            }
          }
          setAllProducts(productsIndex);
        }

      } catch (err) {
        console.error("Error fetching data for menu drawer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isOpen, collections.length, allProducts.length]);

  // Handle Search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    const filtered = allProducts.filter(p => {
      const matchName = p.name.toLowerCase().includes(queryLower);
      const matchCode = p.refcode && p.refcode.toLowerCase().includes(queryLower);
      return matchName || matchCode;
    });

    setSearchResults(filtered);
  }, [searchQuery, allProducts]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleExpand = (nodeId, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Render Category tree recursively inside the drawer
  const renderTreeNodes = (nodes) => {
    return (
      <ul className="drawer-tree-list">
        {nodes.map(node => {
          const isCategory = node.type === 'category';
          const isExpanded = !!expandedNodes[node.id];
          const hasChildren = node.children && node.children.length > 0;

          return (
            <li key={node.id} className="drawer-tree-node">
              <div 
                className={`drawer-tree-node-header ${isCategory && isExpanded ? 'expanded' : ''}`}
                onClick={() => {
                  if (isCategory) {
                    setExpandedNodes(prev => ({ ...prev, [node.id]: !prev[node.id] }));
                  } else {
                    const parent = collections.find(c => c.id === node.parentId);
                    const path = parent
                      ? `/collections/${slugify(parent.name)}/${slugify(node.name)}`
                      : `/collections/${slugify(node.name)}`;
                    if (typeof window !== 'undefined') {
                      window.history.pushState(null, '', path);
                    }
                    onSelectCollection(node);
                    onClose();
                  }
                }}
              >
                {isCategory ? (
                  <span className="drawer-tree-toggle" onClick={(e) => { e.stopPropagation(); toggleExpand(node.id, e); }}>
                    <i className={`fas ${isExpanded ? 'fa-minus' : 'fa-plus'} toggle-icon`}></i>
                  </span>
                ) : (
                  <span className="drawer-tree-indent-dot"><i className="far fa-circle"></i></span>
                )}
                <i className={`fas ${isCategory ? (isExpanded ? 'fa-folder-open' : 'fa-folder') : 'fa-layer-group'} node-icon`}></i>
                <span className="node-name">{node.name}</span>
              </div>
              
              {isCategory && hasChildren && (
                <div className={`drawer-tree-subnodes-wrapper ${isExpanded ? 'expanded' : ''}`}>
                  <div className="drawer-tree-subnodes-inner">
                    <div className="drawer-tree-subnodes">
                      {renderTreeNodes(node.children)}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`drawer-backdrop ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      />

      {/* Main Drawer Panel */}
      <aside 
        ref={drawerRef}
        className={`menu-drawer ${isOpen ? 'open' : ''}`}
      >
        {/* Header / Close button */}
        <div className="drawer-header">
          <h3>Menu</h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close Menu">
            &times;
          </button>
        </div>

        <div className="drawer-body">
          {/* 1. Global Product Search Bar */}
          <div className="drawer-search-wrap">
            <div className="search-input-container">
              <i className="fas fa-search search-bar-icon"></i>
              <input 
                type="text" 
                placeholder="Search products by name or ref..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="drawer-search-input"
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  &times;
                </button>
              )}
            </div>

            {/* Live Search Results */}
            {searchQuery && (
              <div className="drawer-search-results">
                {searchResults.length === 0 ? (
                  <p className="no-search-results">No products match your search.</p>
                ) : (
                  <div className="search-results-list">
                    {searchResults.map(prod => (
                      <div 
                        key={prod.id} 
                        className="search-result-item"
                        onClick={() => {
                          onOpenProduct(prod);
                          onClose();
                          setSearchQuery('');
                        }}
                      >
                        <div 
                          className="search-result-thumb" 
                          style={prod.img ? { backgroundImage: `url('${prod.img}')` } : {}}
                        />
                        <div className="search-result-info">
                          <div className="search-result-name-row">
                            <span className="search-result-name">{prod.name}</span>
                            {prod.refcode && <span className="ref-code search-ref-code">{prod.refcode}</span>}
                          </div>
                          <span className="search-result-collection">{prod.collectionName}</span>
                          {prod.price && <span className="search-result-price">{prod.price}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Navigation Links */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Navigation</h4>
            <ul className="drawer-nav-links">
              <li>
                <Link href="/" onClick={(e) => { if (onNavigate) onNavigate(); onClose(); if (typeof window !== 'undefined' && window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.pushState(null, '', '/'); } }}>
                  <i className="fas fa-home section-link-icon"></i> Home
                </Link>
              </li>
              <li>
                <Link href="/collections" onClick={(e) => { if (onNavigate) onNavigate(); onClose(); const el = document.getElementById('collections'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.pushState(null, '', '/collections'); } }}>
                  <i className="fas fa-cubes section-link-icon"></i> Collections
                </Link>
              </li>
              <li>
                <Link href="/visualizer" onClick={(e) => { if (onNavigate) onNavigate(); onClose(); const el = document.getElementById('visualizer'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.pushState(null, '', '/visualizer'); } }}>
                  <i className="fas fa-palette section-link-icon"></i> Room Visualizer
                </Link>
              </li>
              <li>
                <Link href="/faq" onClick={(e) => { if (onNavigate) onNavigate(); onClose(); const el = document.getElementById('faq'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.pushState(null, '', '/faq'); } }}>
                  <i className="fas fa-question-circle section-link-icon"></i> FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={(e) => { if (onNavigate) onNavigate(); onClose(); const el = document.getElementById('contact'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.history.pushState(null, '', '/contact'); } }}>
                  <i className="fas fa-envelope section-link-icon"></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Collapsible Category Tree */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Collections Catalog</h4>
            {loading ? (
              <p style={{ fontSize: '0.85rem', color: '#888', padding: '10px 0' }}>Loading catalog...</p>
            ) : (
              <div className="drawer-tree-container">
                {renderTreeNodes(treeRoots)}
              </div>
            )}
          </div>

          <RecentlyViewed onOpenProduct={(prod) => {
            onOpenProduct(prod);
            onClose();
          }} />
        </div>
      </aside>
    </>
  );
};

export default MenuDrawer;
