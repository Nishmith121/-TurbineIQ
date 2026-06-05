import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AcademicResearch = ({ project }) => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/dataset/research/${project.machineType}`);
        if (res.data.success) {
          setPapers(res.data.data);
        } else {
          setError(res.data.error || 'Failed to load papers');
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setPapers([]);
        } else {
          console.error("Error fetching research papers", err);
          setError('Failed to fetch research papers. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [project.machineType]);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '50px' }}>Loading academic literature...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--accent-red)', textAlign: 'center', padding: '50px' }}>{error}</div>;
  }

  return (
    <div className="academic-research" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', marginBottom: '15px' }}>
          📚 Academic Research Hub
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          Dive into advanced thermodynamics and aerodynamics. These peer-reviewed papers from leading journals provide the mathematical foundation for your {project.machineType.replace('_', ' ').toLowerCase()} model.
        </p>
      </div>

      {papers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No research papers currently indexed for this machine type.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {papers.map((paper, index) => (
            <div 
              key={paper.id || index} 
              className="card research-card"
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-light)', 
                borderRadius: '12px',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 212, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ 
                  background: 'rgba(0, 212, 255, 0.1)', 
                  color: 'var(--accent-cyan)', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {paper.author}
                </span>
              </div>
              
              <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '15px', lineHeight: '1.4' }}>
                {paper.title}
              </h3>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, marginBottom: '25px' }}>
                {paper.summary}
              </p>
              
              <a 
                href={paper.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '12px', fontSize: '1rem', fontWeight: 'bold' }}
              >
                Read Paper ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicResearch;
