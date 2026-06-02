import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectNotes = ({ project }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (project && project.description) {
      setNotes(project.description);
    }
  }, [project]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/projects/${project.id}`, {
        description: notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSaveMessage('✅ Notes saved successfully!');
      }
    } catch (err) {
      console.error(err);
      setSaveMessage('❌ Failed to save notes. Please try again.');
    }
    setIsSaving(false);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  return (
    <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '15px', color: 'var(--accent-cyan)' }}>📝 Project Notes & Observations</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5' }}>
        Use this space to document your hypothesis, track your manual trial variations, or note down any insights gained from the AI Simulation. These notes are saved securely with your project.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type your engineering notes here..."
        style={{
          width: '100%',
          height: '350px',
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '1rem',
          fontFamily: 'monospace',
          lineHeight: '1.6',
          resize: 'vertical',
          outline: 'none',
          marginBottom: '20px'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn btn-primary"
          style={{ padding: '12px 30px', fontWeight: 'bold' }}
        >
          {isSaving ? 'Saving...' : '💾 Save Notes'}
        </button>
        {saveMessage && (
          <span style={{ color: saveMessage.includes('✅') ? '#4caf50' : 'var(--accent-red)', fontWeight: 'bold' }}>
            {saveMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectNotes;
