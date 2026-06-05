import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('teams');
  
  // Data state
  const [teams, setTeams] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', machineType: 'WIND_TURBINE', dueDate: '', teamIds: [] });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [teamsRes, assignRes] = await Promise.all([
        axios.get('http://localhost:5000/api/teams', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/assignments', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setTeams(teamsRes.data.data || []);
      setAssignments(assignRes.data.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/teams', { name: newTeamName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTeamName('');
      fetchData();
    } catch (err) {
      alert('Error creating team');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/assignments', newAssignment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAssignment({ title: '', description: '', machineType: 'WIND_TURBINE', dueDate: '', teamIds: [] });
      setActiveTab('assignments');
      fetchData();
    } catch (err) {
      alert('Error creating assignment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleTeamSelection = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setNewAssignment({ ...newAssignment, teamIds: value });
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-cyan)', marginBottom: '30px' }}>👨‍🏫 Professor Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <button 
          className={`btn ${activeTab === 'teams' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('teams')}
        >
          Manage Teams
        </button>
        <button 
          className={`btn ${activeTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`btn ${activeTab === 'grading' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('grading')}
        >
          Grading & Validation
        </button>
      </div>

      {/* TEAMS TAB */}
      {activeTab === 'teams' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          <div className="card" style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>Team Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ width: '100%', padding: '10px' }} 
                  value={newTeamName} 
                  onChange={(e) => setNewTeamName(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Team</button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '20px' }}>Your Teams ({teams.length})</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {teams.map(team => (
                <div key={team.id} className="card" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-cyan)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{team.name}</h4>
                    <div style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent-cyan)', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                      Join Code: {team.joinCode}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                    Members: {team.members?.length || 0} / 6
                  </p>
                  {team.members && team.members.length > 0 && (
                    <ul style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
                      {team.members.map(m => <li key={m.id}>{m.name} ({m.email})</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          <div className="card" style={{ background: 'var(--bg-secondary)', padding: '25px', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>Create Assignment</h3>
            <form onSubmit={handleCreateAssignment}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title</label>
                <input type="text" className="form-input" style={{ width: '100%', padding: '10px' }} value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description (Goal)</label>
                <textarea className="form-input" style={{ width: '100%', padding: '10px', height: '100px' }} value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Target Machine</label>
                <select className="form-input" style={{ width: '100%', padding: '10px' }} value={newAssignment.machineType} onChange={e => setNewAssignment({...newAssignment, machineType: e.target.value})}>
                  <option value="WIND_TURBINE">Wind Turbine</option>
                  <option value="STEAM_TURBINE">Steam Turbine</option>
                  <option value="GAS_TURBINE">Gas Turbine</option>
                  <option value="HYDRO_TURBINE">Hydro Turbine</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Assign to Teams (Hold Ctrl to select multiple)</label>
                <select multiple className="form-input" style={{ width: '100%', padding: '10px', height: '120px' }} onChange={handleTeamSelection} required>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Due Date</label>
                <input type="date" className="form-input" style={{ width: '100%', padding: '10px' }} value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Distribute Assignment</button>
            </form>
          </div>

          <div>
            <h3 style={{ marginBottom: '20px' }}>Active Assignments</h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {assignments.map(a => (
                <div key={a.id} className="card" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--accent-orange)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{a.title}</h4>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{a.description}</p>
                      <span style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', marginRight: '10px' }}>{a.machineType}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Submissions: {a._count?.submissions || 0}</div>
                      {a.dueDate && <div style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginTop: '5px' }}>Due: {new Date(a.dueDate).toLocaleDateString()}</div>}
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned to: {a.teams.map(t => t.name).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GRADING TAB */}
      {activeTab === 'grading' && (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
          <h3>Grading Queue</h3>
          <p style={{ color: 'var(--text-muted)' }}>Select an assignment to grade submissions.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
             {assignments.map(a => (
                <button key={a.id} className="btn btn-secondary" onClick={() => navigate(`/teacher/grading/${a.id}`)}>
                  Grade: {a.title}
                </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
