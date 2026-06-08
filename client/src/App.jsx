import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthOverlay from './components/AuthOverlay';
import Dashboard from './pages/Dashboard';
import ProjectWorkspace from './pages/ProjectWorkspace';
import TeacherDashboard from './pages/TeacherDashboard';
import GradingView from './pages/GradingView';

function App() {
  const [authOverlayVisible, setAuthOverlayVisible] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setUser({ ...data.data, token });
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUser();
  }, []);

  const handleAuthClick = (tab) => {
    setAuthTab(tab);
    setAuthOverlayVisible(true);
  };

  const closeAuthOverlay = () => {
    setAuthOverlayVisible(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setAuthOverlayVisible(false);
    alert('Login is successful!');
  };

  return (
    <Router>
      <div className="bg-particles">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <div className="toast-container" id="toast-container"></div>

      <Navbar onAuthClick={handleAuthClick} user={user} onLogout={() => {
        localStorage.removeItem('token');
        setUser(null);
      }} />

      {authOverlayVisible && (
        <AuthOverlay 
          activeTab={authTab} 
          onClose={closeAuthOverlay}
          onTabChange={setAuthTab}
          onSuccess={handleLoginSuccess}
        />
      )}

      <Routes>
        <Route path="/" element={user ? (user.role === 'TEACHER' ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/dashboard" />) : <LandingPage onAuthClick={handleAuthClick} />} />
        <Route path="/dashboard" element={user ? (user.role === 'TEACHER' ? <Navigate to="/teacher/dashboard" /> : <Dashboard />) : <Navigate to="/" />} />
        <Route path="/teacher/dashboard" element={user ? (user.role === 'TEACHER' ? <TeacherDashboard /> : <Navigate to="/dashboard" />) : <Navigate to="/" />} />
        <Route path="/teacher/grading/:assignmentId" element={user ? (user.role === 'TEACHER' ? <GradingView /> : <Navigate to="/dashboard" />) : <Navigate to="/" />} />
        <Route path="/project/:projectId" element={user ? <ProjectWorkspace /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
