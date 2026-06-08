import React from 'react';

const LandingPage = ({ onAuthClick }) => {
  return (
    <section className="screen active" id="screen-landing">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Digital Twin Platform for Engineers</div>
            <h1 className="hero-title">
              Build It. Test It.<br />
              <span className="gradient-text">Validate It.</span>
            </h1>
            <p className="hero-description">
              Create a digital twin of your turbine, motor, pump, or generator. Input your design parameters, upload real measurements, and let TurbineIQ identify exactly where and why your machine underperforms — with actionable fixes.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" id="hero-get-started" onClick={() => onAuthClick('signup')}>🚀 Get Started</button>
              <button className="btn btn-secondary btn-lg" id="hero-explore-demo" onClick={() => alert('Demo coming soon!')}>📊 Explore Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <img 
              src="/hero_turbine.png" 
              alt="Futuristic Turbine Digital Twin" 
              style={{ 
                width: '100%', 
                maxWidth: '550px', 
                filter: 'drop-shadow(0 0 40px rgba(0, 212, 255, 0.3))', 
                animation: 'float-icon 6s ease-in-out infinite',
                borderRadius: '20px'
              }} 
            />
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">Three Steps to Validated Performance</h2>
            <p className="section-subtitle">From design parameters to root-cause diagnosis in minutes</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Select & Learn</h3>
              <p>Choose from 7 different machines. Our AI tutor and comprehensive curriculum will teach you the physics, components, and how it works.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Design & Validate</h3>
              <p>Input your theoretical design parameters. The platform builds a physics-based digital twin and calculates the expected performance.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Test & Validate</h3>
              <p>Upload your real-world sensor measurements to compare against the virtual model. Instantly identify inefficiencies and actionable fixes.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="machine-showcase">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Supported Machines</div>
            <h2 className="section-title">7 Machine Types, One Platform</h2>
          </div>
          <div className="machine-row">
            <div className="machine-pill"><span className="icon">🌀</span><span className="label">Wind Turbine</span></div>
            <div className="machine-pill"><span className="icon">🔥</span><span className="label">Gas Turbine</span></div>
            <div className="machine-pill"><span className="icon">💨</span><span className="label">Steam Turbine</span></div>
            <div className="machine-pill"><span className="icon">💧</span><span className="label">Hydraulic Turbine</span></div>
            <div className="machine-pill"><span className="icon">🔄</span><span className="label">Water Pump</span></div>
            <div className="machine-pill"><span className="icon">⚡</span><span className="label">Electric Motor</span></div>
            <div className="machine-pill"><span className="icon">🔋</span><span className="label">Generator</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
