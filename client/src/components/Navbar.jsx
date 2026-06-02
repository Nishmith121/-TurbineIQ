import React from 'react';

const Navbar = ({ onAuthClick, user, onLogout }) => {
  return (
    <nav className="navbar" id="navbar">
      <div className="container">
        <a href="#" className="nav-logo" id="nav-logo-link">
          <div className="nav-logo-icon">⚡</div>
          <div className="nav-logo-text">Turbine<span>IQ</span></div>
        </a>
        <div className="nav-actions" id="nav-actions">
          {user ? (
            <>
              <span style={{ color: 'var(--text-secondary)', marginRight: '1rem', fontWeight: 500 }}>Welcome!</span>
              <button className="btn btn-secondary" onClick={onLogout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => onAuthClick('login')}>Log In</button>
              <button className="btn btn-primary" onClick={() => onAuthClick('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
