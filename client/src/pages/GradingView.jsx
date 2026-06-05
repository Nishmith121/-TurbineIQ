import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GradingView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingState, setGradingState] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}/submissions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data.data);
        
        // Initialize grading state
        const initialGrading = {};
        res.data.data.forEach(sub => {
          initialGrading[sub.id] = {
            score: sub.score || '',
            feedback: sub.feedback || ''
          };
        });
        setGradingState(initialGrading);
      } catch (err) {
        console.error(err);
        alert('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const handleGrade = async (subId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/assignments/submissions/${subId}/grade`, {
        score: parseFloat(gradingState[subId].score),
        feedback: gradingState[subId].feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Grade submitted successfully!');
      // Update local state to show as GRADED
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'GRADED', score: gradingState[subId].score, feedback: gradingState[subId].feedback } : s));
    } catch (err) {
      alert('Error submitting grade');
    }
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading submissions...</div>;

  return (
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
      <button className="btn btn-secondary" onClick={() => navigate('/teacher/dashboard')} style={{ marginBottom: '20px' }}>&larr; Back to Dashboard</button>
      
      <h1 style={{ color: 'var(--accent-cyan)', marginBottom: '30px' }}>Submissions for Assignment</h1>

      {submissions.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No submissions yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '30px' }}>
          {submissions.map(sub => {
            const lastTrial = sub.project.trials?.[0];
            return (
              <div key={sub.id} className="card" style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                  
                  {/* Left Column: Submission Details */}
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>{sub.student.name}'s Project: {sub.project.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{sub.student.email}</p>
                    
                    <div style={{ background: 'var(--bg-tertiary)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>Latest Simulation Results</h4>
                      {lastTrial ? (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <div>Efficiency: <span style={{ color: 'var(--accent-cyan)' }}>{lastTrial.efficiency}%</span></div>
                          <div>Power Output: <span style={{ color: 'var(--accent-orange)' }}>{lastTrial.powerOutput} W</span></div>
                          {lastTrial.structuralIntegrity && <div>Integrity: <span style={{ color: 'var(--accent-green)' }}>{lastTrial.structuralIntegrity}%</span></div>}
                          {lastTrial.aiFeedback && <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{lastTrial.aiFeedback}"</div>}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No simulation data available.</div>
                      )}
                    </div>

                    {sub.fileUrl && (
                      <div style={{ background: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>Attached Report</h4>
                        <a 
                          href={`http://localhost:5000${sub.fileUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '5px 10px' }}
                        >
                          📄 View / Download Document
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Grading Interface */}
                  <div>
                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '15px' }}>Grade this Submission</h4>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Score (0-100)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          style={{ width: '100%', padding: '10px' }} 
                          value={gradingState[sub.id]?.score}
                          onChange={e => setGradingState({ ...gradingState, [sub.id]: { ...gradingState[sub.id], score: e.target.value } })}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Status</label>
                        <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '6px', color: sub.status === 'GRADED' ? 'var(--accent-cyan)' : 'var(--accent-orange)' }}>
                          {sub.status}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '5px' }}>Feedback / Advice</label>
                      <textarea 
                        className="form-input" 
                        style={{ width: '100%', padding: '10px', height: '100px' }} 
                        value={gradingState[sub.id]?.feedback}
                        onChange={e => setGradingState({ ...gradingState, [sub.id]: { ...gradingState[sub.id], feedback: e.target.value } })}
                        placeholder="Great job on the efficiency, but consider adjusting..."
                      />
                    </div>
                    
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      onClick={() => handleGrade(sub.id)}
                    >
                      {sub.status === 'GRADED' ? 'Update Grade' : 'Submit Grade'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GradingView;
