import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Collections = ({ onSelectCollection }) => {
  const [collections, setCollections] = useState([]);
  const [treeRoots, setTreeRoots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation states
  const [activeNode, setActiveNode] = useState(null); // Selected category node in tree
  const [expandedNodes, setExpandedNodes] = useState({}); // Expanded folders state { nodeId: boolean }

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data: querySnapshot, error } = await supabase.from('collections').select('*').order('order');
        if (error) throw error;
        const cols = [];
        querySnapshot.forEach((rawData) => {
          const data = {};
          for (let key in rawData) {
              const cleanKey = key.toLowerCase().replace(/[\s_]+/g, '');
              data[cleanKey] = rawData[key];
          }
            const catName = data.name || data.title || 'Unnamed';
            let imgUrl = data.img || data.imageurl || data.imgurl || data.image || data.pic || '';
            if (catName === 'Tiles') {
                imgUrl = 'https://files.catbox.moe/j6ipn4.png';
            }
            cols.push({
              id: rawData.id,
              name: catName,
              desc: data.description || data.desc || data.detail || '',
              img: imgUrl,
              parentId: data.parentid || '',
            type: data.type || 'collection', // default to collection
            order: data.order !== undefined ? Number(data.order) : 0
          });
        });

        setCollections(cols);
        const roots = buildTree(cols);
        setTreeRoots(roots);
        
        // Auto-expand top level nodes
        const initialExpanded = {};
        roots.forEach(r => {
          initialExpanded[r.id] = true;
          if (r.children) {
            r.children.forEach(c => {
              initialExpanded[c.id] = true;
            });
          }
        });
        setExpandedNodes(initialExpanded);
      } catch (err) {
        console.error("Error fetching collections", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

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

  // Toggle tree node expansion
  const toggleExpand = (nodeId, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Select node in the explorer
  const selectNode = (node) => {
    if (node === null) {
      setActiveNode(null);
    } else if (node.type === 'collection') {
      onSelectCollection(node);
    } else {
      setActiveNode(node);
    }
  };

  // Get active directory content
  const getActiveContent = () => {
    if (!activeNode) {
      return treeRoots;
    }
    return activeNode.children || [];
  };

  // Get breadcrumbs path list
  const getBreadcrumbs = () => {
    const crumbs = [];
    let current = activeNode;
    while (current) {
      crumbs.unshift(current);
      current = collections.find(c => c.id === current.parentId);
    }
    return crumbs;
  };

  // Recursively render Left Sidebar Tree List
  const renderTreeNodes = (nodes) => {
    return (
      <ul className="tree-list">
        {nodes.map(node => {
          const isCategory = node.type === 'category';
          const isExpanded = !!expandedNodes[node.id];
          const isActive = activeNode?.id === node.id;
          const hasChildren = node.children && node.children.length > 0;

          return (
            <li key={node.id} className={`tree-node ${isActive ? 'active' : ''}`}>
              <div 
                className="tree-node-header" 
                onClick={() => selectNode(node)}
              >
                {isCategory ? (
                  <span className="tree-toggle" onClick={(e) => toggleExpand(node.id, e)}>
                    <i className={`fas ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon`}></i>
                  </span>
                ) : (
                  <span className="tree-indent-dot"><i className="far fa-circle"></i></span>
                )}
                <i className={`fas ${isCategory ? (isExpanded ? 'fa-folder-open' : 'fa-folder') : 'fa-layer-group'} node-icon`}></i>
                <span className="node-name">{node.name}</span>
              </div>
              
              {isCategory && isExpanded && hasChildren && (
                <div className="tree-subnodes">
                  {renderTreeNodes(node.children)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const activeContent = getActiveContent();
  const breadcrumbs = getBreadcrumbs();

  return (
    <section id="collections" className="section bg-dark">
      <div className="container">
        <div className="section-header">
          <h2>Our Collections</h2>
          <p>Discover our premium range of customizable terrazzo products, organized in a modern catalog.</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0' }}>Loading collections catalog...</p>
        ) : (
          <div className="category-explorer-layout">
            
            {/* Left Column: Interactive Tree Navigation */}
            <aside className="explorer-sidebar">
              <h4 className="sidebar-title">Catalog Explorer</h4>
              <div className="tree-container">
                <div 
                  className={`tree-node-header root-header ${!activeNode ? 'active' : ''}`}
                  onClick={() => selectNode(null)}
                >
                  <i className="fas fa-database node-icon"></i>
                  <span className="node-name" style={{ fontWeight: '500' }}>All Collections</span>
                </div>
                {renderTreeNodes(treeRoots)}
              </div>
            </aside>

            {/* Right Column: Active Category Content */}
            <main className="explorer-main">
              {/* Breadcrumb Navigation Trail */}
              <nav className="explorer-breadcrumbs">
                <span className="breadcrumb-item" onClick={() => selectNode(null)}>
                  <i className="fas fa-home" style={{ marginRight: '4px' }}></i> Collections
                </span>
                {breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.id} className="breadcrumb-path">
                    <span className="breadcrumb-sep">&gt;</span>
                    <span 
                      className={`breadcrumb-item ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}
                      onClick={() => selectNode(crumb)}
                    >
                      {crumb.name}
                    </span>
                  </span>
                ))}
              </nav>

              {/* Title & Description of Current Category */}
              <div className="category-info-panel">
                <h3>{activeNode ? activeNode.name : 'Collections Home'}</h3>
                <p>{activeNode ? activeNode.desc : 'Browse our premium terrazzo products organized by pressing techniques and layouts.'}</p>
              </div>

              {/* Grid content */}
              {activeContent.length === 0 ? (
                <div className="empty-category-message">
                  <i className="fas fa-folder-open empty-icon"></i>
                  <p>No subcategories or collections in this folder.</p>
                </div>
              ) : (
                <div className="grid collections-grid" id="collections-container">
                  {activeContent.map((item) => {
                    const isCategory = item.type === 'category';
                    return (
                      <div 
                        className={`collection-card fade-in-up explorer-card ${isCategory ? 'category-folder-card' : ''}`} 
                        key={item.id} 
                        onClick={() => selectNode(item)}
                      >
                        <div
                          className="img-placeholder explorer-card-img"
                          style={item.img ? {
                            backgroundImage: `url('${item.img}'), linear-gradient(#ffffff, #ffffff)`,
                            backgroundSize: 'contain, cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            color: 'transparent',
                            padding: '1.5rem',
                            backgroundOrigin: 'content-box, padding-box'
                          } : {}}
                        >
                          {!item.img && <i className={`fas ${isCategory ? 'fa-folder fa-4x' : 'fa-layer-group fa-4x'}`} style={{ color: '#ccc' }}></i>}
                        </div>
                        <div className="card-content">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <i className={`fas ${isCategory ? 'fa-folder' : 'fa-layer-group'}`} style={{ color: 'var(--accent-color)' }}></i>
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>
                              {isCategory ? 'Category' : 'Collection'}
                            </span>
                          </div>
                          <h3>{item.name}</h3>
                          <p className="card-desc">{item.desc}</p>
                          <a href="#" className="link view-products-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); selectNode(item); }}>
                            {isCategory ? 'Open Folder' : 'View Products'} <span className="arrow-icon">&rarr;</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>

          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;

