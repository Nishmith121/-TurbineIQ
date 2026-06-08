import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MACHINE_TYPES = [
  { id: 'WIND_TURBINE', name: 'Wind Turbine', icon: '🌀', desc: 'Convert wind energy into electrical power' },
  { id: 'STEAM_TURBINE', name: 'Steam Turbine', icon: '💨', desc: 'Extract thermal energy from pressurized steam' },
  { id: 'GAS_TURBINE', name: 'Gas Turbine', icon: '🔥', desc: 'Combustion engine that converts natural gas to energy' },
  { id: 'HYDRO_TURBINE', name: 'Hydro Turbine', icon: '💧', desc: 'Generate power from flowing water' },
  { id: 'MOTOR', name: 'Electric Motor', icon: '⚡', desc: 'Convert electrical energy into mechanical energy' },
  { id: 'GENERATOR', name: 'Generator', icon: '🔋', desc: 'Convert motive power into electrical power' },
  { id: 'PUMP', name: 'Water Pump', icon: '🔄', desc: 'Move fluids by mechanical action' },
];

const Dashboard = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const [myProjects, setMyProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Assignment Submission State
  const [submittingAssignments, setSubmittingAssignments] = useState({});
  const [selectedProjects, setSelectedProjects] = useState({});
  const [reportFiles, setReportFiles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [projRes, assignRes, teamRes] = await Promise.all([
          axios.get('http://localhost:5000/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/assignments', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:5000/api/teams', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { data: [] } }))
        ]);
        if (projRes.data.success) {
          setMyProjects(projRes.data.data);
        }
        if (assignRes.data.success) {
          setAssignments(assignRes.data.data);
        }
        if (teamRes.data.success) {
          setTeams(teamRes.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignmentSubmit = async (assignId) => {
    const projectId = selectedProjects[assignId];
    if (!projectId) {
      alert("Please select a project to submit");
      return;
    }
    
    setSubmittingAssignments(prev => ({ ...prev, [assignId]: true }));
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('projectId', projectId);
      
      const file = reportFiles[assignId];
      if (file) {
        formData.append('report', file);
      }

      await axios.post(`http://localhost:5000/api/assignments/${assignId}/submit`, formData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      });
      alert('Assignment submitted successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting assignment');
    } finally {
      setSubmittingAssignments(prev => ({ ...prev, [assignId]: false }));
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError("Please provide a project name.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/projects', {
        name: projectName,
        description: projectDesc,
        machineType: selectedMachine.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Navigate to the newly created project workspace
        navigate(`/project/${res.data.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      
      {/* Welcome Hero Area */}
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', marginBottom: '15px' }}>
          Hi! I am Turbine IQ, your guide. ⚡
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
          I can help you learn, build, and validate everything for your turbine, motor, or generator projects.
        </p>
      </div>

      {!selectedMachine ? (
        <>
          {/* Top Header: Teams and Join Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <button className="btn btn-secondary" onClick={() => {
              const code = prompt('Enter your 6-character Team Join Code:');
              if (code) {
                const token = localStorage.getItem('token');
                axios.post('http://localhost:5000/api/teams/join', { joinCode: code }, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => {
                  alert(res.data.message);
                  window.location.reload();
                })
                .catch(err => {
                  alert(err.response?.data?.error || 'Failed to join team');
                });
              }
            }}>
              + Join a Team
            </button>
          </div>

          {/* Teams Section (If member of any) */}
          {teams.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--accent-cyan)' }}>👨‍🎓 My Teams</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {teams.map(t => (
                  <div key={t.id} style={{ background: 'var(--bg-secondary)', padding: '10px 20px', borderRadius: '20px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{t.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>(Prof. {t.teacher?.name})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Section */}
          {assignments.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--accent-orange)' }}>📌 Your Assignments</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {assignments.map(assign => {
                  const submission = assign.submissions?.[0];
                  return (
                    <div key={assign.id} className="card" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${submission ? 'var(--accent-cyan)' : 'var(--accent-orange)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{assign.title}</h4>
                        <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>{assign.machineType}</span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>{assign.description}</p>
                      
                      <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>
                          <span style={{ fontWeight: 'bold' }}>📅 Deadline:</span> {assign.dueDate ? new Date(assign.dueDate).toLocaleDateString() : 'No deadline set'}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 'bold' }}>📊 Marks Criteria:</span> Efficiency (40%), Power Output (40%), Structural Integrity (20%).
                        </div>
                      </div>
                      
                      {submission ? (
                        <div style={{ padding: '10px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '6px' }}>
                          <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Status: {submission.status}
                          </div>
                          {submission.score !== null && (
                            <div style={{ color: '#fff', marginTop: '5px' }}>Grade: {submission.score}%</div>
                          )}
                          {submission.feedback && (
                            <div style={{ color: 'var(--text-muted)', marginTop: '5px', fontStyle: 'italic', fontSize: '0.85rem' }}>
                              " {submission.feedback} "
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                          <div style={{ color: 'var(--accent-red)', fontSize: '0.9rem', marginBottom: '10px' }}>
                            Status: PENDING
                          </div>
                          
                          <select 
                            className="form-input" 
                            style={{ width: '100%', marginBottom: '10px', fontSize: '0.85rem', padding: '8px' }}
                            value={selectedProjects[assign.id] || ''}
                            onChange={(e) => setSelectedProjects(prev => ({ ...prev, [assign.id]: e.target.value }))}
                          >
                            <option value="">-- Select a {assign.machineType} Project --</option>
                            {myProjects.filter(p => p.machineType === assign.machineType).map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>

                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            style={{ fontSize: '0.75rem', marginBottom: '10px', width: '100%', color: 'var(--text-muted)' }}
                            onChange={e => setReportFiles(prev => ({ ...prev, [assign.id]: e.target.files[0] }))}
                          />

                          <button 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                            disabled={submittingAssignments[assign.id]}
                            onClick={() => handleAssignmentSubmit(assign.id)}
                          >
                            {submittingAssignments[assign.id] ? 'Submitting...' : 'Submit Assignment'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* My Projects Section */}
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{ color: 'white', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Your Recent Projects</h2>
            {loadingProjects ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading projects...</p>
            ) : myProjects.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {myProjects.map(project => (
                  <div 
                    key={project.id} 
                    className="step-card" 
                    style={{ cursor: 'pointer', textAlign: 'left', padding: '20px', transition: 'all 0.2s', border: '1px solid var(--border-light)' }}
                    onClick={() => navigate(`/project/${project.id}`)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = 'var(--accent-purple)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ margin: '0', color: 'white' }}>{project.name}</h3>
                      <span style={{ fontSize: '1.5rem' }}>
                        {MACHINE_TYPES.find(m => m.id === project.machineType)?.icon}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 15px 0', color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {MACHINE_TYPES.find(m => m.id === project.machineType)?.name || project.machineType}
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description || 'No description provided.'}
                    </p>
                    <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                      Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="step-card" style={{ padding: '30px', textAlign: 'center', borderStyle: 'dashed' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>You haven't created any projects yet. Start one below!</p>
              </div>
            )}
          </div>

          {/* Start New Project Section */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'white' }}>Start a New Project</h2>
            <p style={{ color: 'var(--text-muted)' }}>Select a machine type below to begin.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {MACHINE_TYPES.map(machine => (
              <div 
                key={machine.id} 
                className="step-card" 
                style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-light)' }}
                onClick={() => setSelectedMachine(machine)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div style={{ fontSize: '3rem', margin: '0 auto 15px auto', width: 'fit-content' }}>{machine.icon}</div>
                <h3 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>{machine.name}</h3>
                <p style={{ textAlign: 'center', margin: 0 }}>{machine.desc}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="step-card" style={{ padding: '30px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedMachine(null)}
              style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              &larr; Back
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
              <div style={{ fontSize: '3rem' }}>{selectedMachine.icon}</div>
              <h2>New {selectedMachine.name} Project</h2>
            </div>

            {error && <div style={{ color: 'var(--accent-red)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleCreateProject}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Project Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ width: '100%', padding: '12px' }}
                  placeholder="E.g. Senior Design Project" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Project Description (Optional)</label>
                <textarea 
                  className="form-input" 
                  style={{ width: '100%', padding: '12px', minHeight: '100px', resize: 'vertical' }}
                  placeholder="What is the goal of this project?" 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '15px' }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
