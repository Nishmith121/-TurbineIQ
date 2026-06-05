import React from 'react';

const ProjectReport = ({ project }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!project) return <div>Loading report data...</div>;

  const bestTrial = project.trials && project.trials.length > 0 
    ? project.trials.reduce((best, curr) => (curr.efficiencyPercent > best.efficiencyPercent ? curr : best), project.trials[0])
    : null;

  return (
    <div className="card report-container" style={{ padding: '40px', background: 'white', borderRadius: '12px', color: '#111' }}>
      
      {/* Print styles applied dynamically using an injected style tag */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .report-container, .report-container * { visibility: visible; }
          .report-container { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#222' }}>Project Summary Report</h1>
          <p style={{ color: '#555', margin: '5px 0 0 0' }}>TurbineIQ Platform — Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={handlePrint}
          className="btn btn-primary no-print"
          style={{ padding: '10px 20px' }}
        >
          🖨️ Print / Export PDF
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
        <div>
          <h3 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Project Details</h3>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '10px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Project Name:</td><td>{project.name}</td></tr>
              <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Machine Type:</td><td>{project.machineType.replace('_', ' ')}</td></tr>
              <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Created On:</td><td>{new Date(project.createdAt).toLocaleDateString()}</td></tr>
              <tr><td style={{ padding: '8px 0', fontWeight: 'bold' }}>Total Trials Run:</td><td>{project.trials?.length || 0}</td></tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Peak Performance</h3>
          {bestTrial ? (
            <div style={{ background: '#f5f7fa', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Max Efficiency:</span>
                <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.2rem' }}>{bestTrial.efficiencyPercent}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>Peak Power Output:</span>
                <span style={{ color: '#1565c0', fontWeight: 'bold', fontSize: '1.2rem' }}>{Math.round(bestTrial.powerOutput)} W</span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#777', fontStyle: 'italic' }}>No trials conducted yet.</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Engineering Notes</h3>
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap', fontFamily: 'serif', lineHeight: '1.6' }}>
          {project.description || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No notes have been added to this project.</span>}
        </div>
      </div>

      {project.trials && project.trials.length > 0 && (
        <div>
          <h3 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Trial History Log</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Trial #</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Efficiency</th>
                <th style={{ padding: '12px' }}>Power Output</th>
              </tr>
            </thead>
            <tbody>
              {project.trials.map((trial, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{trial.trialNumber || i + 1}</td>
                  <td style={{ padding: '12px' }}>{new Date(trial.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', color: trial.efficiencyPercent > 60 ? '#2e7d32' : 'inherit' }}>{trial.efficiencyPercent}%</td>
                  <td style={{ padding: '12px' }}>{Math.round(trial.powerOutput)} W</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ProjectReport;
