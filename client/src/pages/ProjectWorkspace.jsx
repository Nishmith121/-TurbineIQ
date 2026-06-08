import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { MACHINE_CONTENT } from '../data/machineContent';
import VirtualBuilder from '../components/VirtualBuilder';
import RealModelTester from '../components/RealModelTester';
import HardwareSimulationTester from '../components/HardwareSimulationTester';
import AcademicResearch from '../components/AcademicResearch';
import AssemblyBuilder from '../components/AssemblyBuilder';
import ProjectNotes from '../components/ProjectNotes';
import ProjectReport from '../components/ProjectReport';

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('learning');
  const [loading, setLoading] = useState(true);

  // Q&A State
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProject(res.data.data);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error("Error fetching project", err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchProject();
  }, [projectId, navigate]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newChat = { role: 'user', content: question };
    setChatHistory([...chatHistory, newChat]);
    setQuestion('');
    setAsking(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/learning/ask`, {
        machineId: project.machineType,
        question: newChat.content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setChatHistory(prev => [...prev, { role: 'ai', content: res.data.answer }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't get an answer right now." }]);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading project...</div>;
  }

  if (!project) return null;

  const content = MACHINE_CONTENT[project.machineType] || { title: "Unknown", content: "No content available." };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '70px' }}>
      
      {/* Left Sidebar Navigation */}
      <div style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-light)', padding: '20px', position: 'fixed', top: '70px', bottom: '0', overflowY: 'auto' }}>
        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', marginBottom: '30px', padding: '10px' }} 
          onClick={() => navigate('/dashboard')}
        >
          &larr; Back to Dashboard
        </button>

        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>Project Workspace</h3>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--accent-cyan)' }}>{project.name}</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '30px', wordWrap: 'break-word' }}>
          {project.description || "No description provided."}
        </p>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('learning')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'learning' ? 'var(--accent-cyan)' : 'transparent', color: activeTab === 'learning' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'learning' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              📚 Learning Module
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('virtual')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'virtual' ? 'var(--accent-cyan)' : 'transparent', color: activeTab === 'virtual' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'virtual' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              🛒 Sourcing Marketplace
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('assembly')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'assembly' ? 'var(--accent-cyan)' : 'transparent', color: activeTab === 'assembly' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'assembly' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              🛠️ 3D Assembly & Validation
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('real')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'real' ? 'var(--accent-cyan)' : 'transparent', color: activeTab === 'real' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'real' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              👁️ Test Real Model
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('hardware')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'hardware' ? 'var(--accent-emerald)' : 'transparent', color: activeTab === 'hardware' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'hardware' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              🔌 Hardware & Simulation
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('research')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'research' ? 'var(--accent-cyan)' : 'transparent', color: activeTab === 'research' ? '#000' : 'var(--text-primary)', fontWeight: activeTab === 'research' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              📚 Academic Research
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('notes')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'notes' ? 'var(--accent-purple)' : 'transparent', color: activeTab === 'notes' ? '#fff' : 'var(--text-primary)', fontWeight: activeTab === 'notes' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              📝 Engineering Notes
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setActiveTab('report')}
              style={{ width: '100%', padding: '12px 15px', textAlign: 'left', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'report' ? 'var(--accent-green)' : 'transparent', color: activeTab === 'report' ? '#fff' : 'var(--text-primary)', fontWeight: activeTab === 'report' ? 'bold' : 'normal', transition: 'all 0.2s' }}
            >
              📄 Project Report
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: '250px', padding: '40px', background: 'var(--bg-primary)' }}>
        
        {activeTab === 'learning' && (
          <div style={{ display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto', alignItems: 'flex-start' }}>
            
            {/* The PDF-like Document Viewer */}
            <div style={{ flex: 2, background: '#ffffff', borderRadius: '12px', padding: '60px 80px', color: '#1a1a1a', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#000', marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
                  {content.title}
                </h1>
                {content.heroImage && (
                  <img src={content.heroImage} alt={content.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
              </div>
              
              <div className="pdf-markdown">
                <ReactMarkdown>{content.content}</ReactMarkdown>
              </div>
            </div>

            {/* The Sticky Q&A Sidebar */}
            <div style={{ flex: 1, position: 'sticky', top: '100px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>AI Tutor</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Have questions while reading the document? Ask TurbineIQ!
              </p>
              
              <div style={{ height: '400px', overflowY: 'auto', marginBottom: '15px', padding: '15px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                {chatHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40%' }}>
                    Ask a question to get started.
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} style={{ 
                      marginBottom: '15px', 
                      textAlign: msg.role === 'user' ? 'right' : 'left' 
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '10px 15px',
                        borderRadius: '12px',
                        background: msg.role === 'user' ? 'var(--accent-cyan)' : 'var(--bg-primary)',
                        color: msg.role === 'user' ? '#000' : 'var(--text-primary)',
                        maxWidth: '85%',
                        fontSize: '0.95rem',
                        lineHeight: '1.4',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.content}
                      </span>
                    </div>
                  ))
                )}
                {asking && <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Typing...</div>}
              </div>

              <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1, padding: '10px', fontSize: '0.95rem' }} 
                  placeholder="Ask a question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={asking}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 15px' }} disabled={asking || !question.trim()}>Ask</button>
              </form>
            </div>

          </div>
        )}

        {activeTab === 'virtual' && (
          <VirtualBuilder project={project} />
        )}

        {activeTab === 'assembly' && (
          <AssemblyBuilder project={project} />
        )}

        {activeTab === 'real' && (
          <RealModelTester project={project} />
        )}

        {activeTab === 'hardware' && (
          <HardwareSimulationTester project={project} />
        )}

        {activeTab === 'research' && (
          <AcademicResearch project={project} />
        )}

        {activeTab === 'notes' && (
          <ProjectNotes project={project} />
        )}

        {activeTab === 'report' && (
          <ProjectReport project={project} />
        )}

      </div>
    </div>
  );
};

export default ProjectWorkspace;
