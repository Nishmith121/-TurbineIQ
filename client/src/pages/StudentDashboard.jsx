import React from 'react';

const StudentDashboard = () => {
  return (
    <section className="screen active" id="screen-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <div className="welcome-info">
              <h1 id="dashboard-welcome-text">Welcome back, Student</h1>
              <p id="dashboard-institution-text">Track and manage your validation projects</p>
            </div>
            <button className="btn btn-primary" id="dashboard-new-project-btn">+ New Project</button>
          </div>
        </div>

        <div className="stats-row" id="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-value" id="stat-projects">0</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧪</div>
            <div className="stat-value" id="stat-tests">0</div>
            <div className="stat-label">Tests Run</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value" id="stat-accuracy">—</div>
            <div className="stat-label">Avg Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value" id="stat-best">—</div>
            <div className="stat-label">Best Score</div>
          </div>
        </div>

        <div className="feedback-banner" id="feedback-banner" style={{ display: 'none' }}>
          <h3>📬 Teacher Feedback</h3>
          <div id="feedback-banner-content"></div>
        </div>

        <div className="projects-section">
          <h2>My Projects</h2>
          <div className="projects-grid" id="projects-grid"></div>
        </div>
      </div>
    </section>
  );
};

export default StudentDashboard;
