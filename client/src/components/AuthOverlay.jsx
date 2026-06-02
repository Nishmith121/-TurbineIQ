import React, { useState } from 'react';
import axios from 'axios';

const AuthOverlay = ({ activeTab, onClose, onTabChange, onSuccess }) => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        if (onSuccess) onSuccess(response.data.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
        name,
        role,
        institution,
        department
      });
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        if (onSuccess) onSuccess(response.data.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay active" id="auth-overlay">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} id="auth-close">&times;</button>
        
        <div className="auth-header">
          <h2 id="auth-title">Welcome to TurbineIQ</h2>
          <p id="auth-subtitle">Sign in to track your projects</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => onTabChange('login')}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} 
            onClick={() => onTabChange('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error active" id="auth-error">{error}</div>}

        {activeTab === 'login' && (
          <form className="auth-form active" id="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input className="form-input" type="email" id="login-email" placeholder="you@university.edu" required 
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <input className="form-input" type="password" id="login-password" placeholder="Enter your password" required 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form className="auth-form active" id="signup-form" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-selector" id="role-selector">
                <button 
                  type="button" 
                  className={`role-btn ${role === 'student' ? 'active' : ''}`} 
                  onClick={() => setRole('student')}
                >
                  🎓 Student
                </button>
                <button 
                  type="button" 
                  className={`role-btn ${role === 'teacher' ? 'active' : ''}`} 
                  onClick={() => setRole('teacher')}
                >
                  👨‍🏫 Teacher / Professor
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <input className="form-input" type="text" id="signup-name" placeholder="John Doe" required 
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <input className="form-input" type="email" id="signup-email" placeholder="you@university.edu" required 
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input className="form-input" type="password" id="signup-password" placeholder="Min 6 characters" required minLength="6" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-institution">Institution</label>
                <input className="form-input" type="text" id="signup-institution" placeholder="MIT, IIT, etc." 
                  value={institution} onChange={(e) => setInstitution(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-field">Department</label>
                <input className="form-input" type="text" id="signup-field" placeholder="Mech Eng." 
                  value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthOverlay;
