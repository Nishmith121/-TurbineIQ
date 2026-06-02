import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VirtualBuilder = ({ project }) => {
  const [components, setComponents] = useState([]);
  const [sourcedItems, setSourcedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const compRes = await axios.get(`http://localhost:5000/api/dataset/components/${project.machineType}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (compRes.data.success) {
          setComponents(compRes.data.data);
        }
      } catch (err) {
        console.error("Failed to load components", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [project.machineType, project.id]);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading marketplace...</div>;
  }

  return (
    <div className="virtual-builder">
      {/* Step 1: Component Sourcing Marketplace */}
      <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--accent-purple)' }}>🛒 Sourcing Marketplace</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Select the physical components you want to use for your {project.machineType.replace('_', ' ').toLowerCase()}. Click to explore real products from our partners that match your design criteria.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {components.map((comp) => {
            const isSourced = sourcedItems.has(comp.id);
            return (
              <div 
                key={comp.id} 
                style={{ 
                  padding: '20px', 
                  background: isSourced ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255,255,255,0.05)', 
                  border: `1px solid ${isSourced ? '#4caf50' : 'var(--border-light)'}`, 
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: isSourced ? '#4caf50' : 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                      {comp.category}
                    </div>
                    {isSourced && <span style={{ color: '#4caf50', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ SOURCED</span>}
                  </div>
                  <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '1.1rem' }}>{comp.resourceName}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.4' }}>
                    {comp.purpose}
                  </p>
                </div>
                
                <a 
                  href={comp.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setSourcedItems(prev => new Set(prev).add(comp.id))}
                  className="btn"
                  style={{ 
                    display: 'block', 
                    textAlign: 'center', 
                    background: isSourced ? 'transparent' : 'var(--accent-purple)', 
                    color: isSourced ? '#4caf50' : 'white',
                    border: isSourced ? '1px solid #4caf50' : 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginTop: 'auto'
                  }}
                >
                  {isSourced ? 'View Product Details' : 'Buy Real Product'}
                </a>
              </div>
            );
          })}
        </div>
        
        {components.length > 0 && sourcedItems.size === components.length && (
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(76, 175, 80, 0.2)', border: '1px solid #4caf50', borderRadius: '8px', color: 'white', textAlign: 'center' }}>
            🎉 <strong>Awesome!</strong> You have sourced all necessary components for your physical scale model. Now head over to the <strong>3D Assembly & Validation</strong> tab to simulate!
          </div>
        )}
        {components.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No components found in the dataset for this machine type.</div>}
      </div>
    </div>
  );
};

export default VirtualBuilder;
