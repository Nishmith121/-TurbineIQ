import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { COMPONENT_OPTIONS } from '../data/componentOptions';
import ModelViewer3D from './ModelViewer3D';

const AssemblyBuilder = ({ project }) => {
  const [params, setParams] = useState({}); // Manual params for AI evaluation
  const [buildParams, setBuildParams] = useState({}); // Real-time params for dropdowns
  const [machineParams, setMachineParams] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null); // AI Results
  const [realTimeResult, setRealTimeResult] = useState(null); // Real-time results

  // 3D Assembly State
  const [selected3DConfig, setSelected3DConfig] = useState(null);
  
  // Ref to prevent initial render simulations
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/simulations/defaults/${project.machineType}`);
        if (res.data.success) {
          setMachineParams(res.data.data.parameterInfo || []);
          let initialParams = { ...res.data.data.defaultParameters };

          if (COMPONENT_OPTIONS[project.machineType]) {
            const opts = COMPONENT_OPTIONS[project.machineType];
            const initConfig = {
              blades: opts.blades[0],
              motors: opts.motors[0],
              bases: opts.bases[0]
            };
            setSelected3DConfig(initConfig);
            initialParams = { ...initialParams, ...initConfig.blades.params, ...initConfig.motors.params, ...initConfig.bases.params };
          }
          setBuildParams(initialParams);
          setParams(initialParams);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDefaults();
  }, [project.machineType, project.id]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const token = localStorage.getItem('token');
      // Full params are already stored in state (setParams)

      const res = await axios.post(`http://localhost:5000/api/simulations/projects/${project.id}/simulate`, {
        parameters: params
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setResult(res.data.data.results);
      }
    } catch (err) {
      console.error("Simulation failed", err);
      // alert("Failed to validate data. Please try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  // Automatically run simulation when buildParams change (for Real-time Performance panel)
  useEffect(() => {
    const runRealTime = async () => {
      if (Object.keys(buildParams).length === 0) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`http://localhost:5000/api/simulations/projects/${project.id}/simulate`, {
          parameters: buildParams
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setRealTimeResult(res.data.data.results);
        }
      } catch (err) {
        console.error("Realtime simulation failed", err);
      }
    };
    runRealTime();
  }, [buildParams, project.id]);

  const handleInputChange = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handle3DConfigChange = (category, selectedId) => {
    const opts = COMPONENT_OPTIONS[project.machineType][category];
    const newComponent = opts.find(o => o.id === selectedId);
    if (!newComponent) return;

    setSelected3DConfig(prev => ({ ...prev, [category]: newComponent }));
    
    // Update simulation parameters based on the selected component's params
    setBuildParams(prev => ({
      ...prev,
      ...newComponent.params
    }));
    setParams(prev => ({
      ...prev,
      ...newComponent.params
    }));
  };

  if (!COMPONENT_OPTIONS[project.machineType]) {
    return <div style={{ color: 'var(--text-muted)', padding: '50px', textAlign: 'center' }}>3D Assembly is not available for this machine type yet.</div>;
  }

  return (
    <div className="assembly-builder">
      {selected3DConfig && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Component Selection & Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
              <h2 style={{ marginBottom: '10px', color: 'var(--accent-orange)' }}>🛠️ Build Configuration</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                Select physical components to assemble your {project.machineType.replace('_', ' ').toLowerCase()}.
              </p>
              
              {['blades', 'motors', 'bases'].map(category => {
                const currentOpt = COMPONENT_OPTIONS[project.machineType][category].find(o => o.id === selected3DConfig[category]?.id);
                return (
                  <div key={category} style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'white', fontWeight: 'bold', marginBottom: '8px', textTransform: 'capitalize' }}>
                      Select {category}
                    </label>
                    <select 
                      className="form-input" 
                      value={selected3DConfig[category]?.id || ''}
                      onChange={(e) => handle3DConfigChange(category, e.target.value)}
                      style={{ width: '100%', padding: '10px', fontSize: '1rem', marginBottom: '8px' }}
                    >
                      {COMPONENT_OPTIONS[project.machineType][category].map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                    {currentOpt && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Applied Parameters:</div>
                        {Object.entries(currentOpt.params).map(([key, val]) => (
                          <div key={key} style={{ fontSize: '0.85rem', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--accent-cyan)' }}>{key}:</span> 
                            <span style={{ fontWeight: 'bold' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results Output */}
            {realTimeResult && (
              <div className="card" style={{ padding: '30px', background: 'var(--bg-tertiary)', border: `1px solid ${realTimeResult.efficiency > 60 ? '#4caf50' : 'var(--accent-red)'}`, borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '15px', color: 'white' }}>Real-time Performance</h3>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Current Efficiency</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: realTimeResult.efficiency > 60 ? '#4caf50' : 'var(--accent-red)' }}>
                      {realTimeResult.efficiency}%
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Current Power Output</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                      {Math.round(realTimeResult.powerOutput)}W
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 3D Model Viewer - Wrapped in Digital Blueprint Theme */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ 
              padding: '20px', 
              background: '#040810', 
              border: '1px solid rgba(0, 212, 255, 0.3)', 
              borderRadius: '12px', 
              minHeight: '400px', 
              position: 'relative', 
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.1) inset, 0 0 15px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '15px', borderBottom: '1px solid rgba(0, 212, 255, 0.2)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
                <span><span style={{color: 'white'}}>⚡</span> DIGITAL BLUEPRINT</span>
                <span style={{fontSize: '0.8rem', opacity: 0.7}}>MODEL_RENDER_{project.machineType}</span>
              </h3>
              
              {/* Premium Background Grid & Scanning Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.15) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, opacity: 0.6 }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, transparent 30%, #040810 90%)', zIndex: 1 }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-cyan)', opacity: 0.5, boxShadow: '0 0 10px var(--accent-cyan)', animation: 'scanline 4s linear infinite', zIndex: 2 }}></div>
              
              {/* HUD Elements */}
              <div style={{ position: 'absolute', top: 60, left: 15, fontSize: '0.75rem', color: 'rgba(0, 212, 255, 0.8)', fontFamily: 'monospace', zIndex: 2, textShadow: '0 0 5px rgba(0,212,255,0.5)' }}>
                [SYS.OP.MODE: {isSimulating ? 'VALIDATING' : 'IDLE'}]<br/>
                LOAD: {Math.floor(Math.random() * 20 + 80)}%
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 15, fontSize: '0.75rem', color: 'rgba(0, 212, 255, 0.8)', fontFamily: 'monospace', zIndex: 2, textShadow: '0 0 5px rgba(0,212,255,0.5)', textAlign: 'right' }}>
                DATALINK_STABLE // REV.A<br/>
                UPLINK_SYNC: OK
              </div>

              {/* The 3D Model */}
              <div style={{ zIndex: 3, flex: 1, position: 'relative', minHeight: '400px' }}>
                <ModelViewer3D machineType={project.machineType} config={selected3DConfig} />
              </div>
            </div>

            {/* Detailed AI Results Dashboard */}
            {result && (
              <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                <h3 style={{ marginBottom: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🤖</span> AI Simulation Results
                </h3>
                
                {(() => {
                  let totalGain = 0;
                  if (result.specificResults?.predictions) {
                    totalGain = result.specificResults.predictions.reduce((acc, curr) => acc + (curr.expectedEfficiencyGain || 0), 0);
                  }
                  const optEfficiency = Math.min(100, result.efficiency + totalGain).toFixed(1);
                  const optPower = Math.round(result.powerOutput * (optEfficiency / Math.max(0.1, result.efficiency)));
                  
                  return (
                    <>
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                        <div style={{ flex: 1, background: 'rgba(255,136,0,0.1)', padding: '20px', borderRadius: '8px', borderLeft: `4px solid var(--accent-orange)` }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', marginBottom: '5px' }}>AI Predicted Target Efficiency</div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                            {optEfficiency}%
                          </div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,136,0,0.1)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--accent-orange)' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--accent-orange)', marginBottom: '5px' }}>AI Predicted Target Power</div>
                          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
                            {optPower} <span style={{ fontSize: '1.2rem' }}>W</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 136, 0, 0.3)', padding: '20px', borderRadius: '8px' }}>
                        <h4 style={{ color: 'var(--accent-orange)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>💡</span> AI Insights & Optimization
                        </h4>
                        <p style={{ color: 'white', lineHeight: '1.5', fontSize: '0.95rem', margin: 0, marginBottom: '15px' }}>
                          {result.specificResults?.aiRecommendation || "Based on the simulation model, this configuration is functioning normally. Consider adjusting parameters in the Validate Data section to experiment with higher efficiencies."}
                        </p>
                        
                        {result.specificResults?.predictions && result.specificResults.predictions.length > 0 && (
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '6px' }}>
                            <h5 style={{ color: 'var(--accent-cyan)', marginBottom: '10px', fontSize: '0.9rem' }}>Required Actions to hit Target:</h5>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'white', fontSize: '0.9rem' }}>
                              {result.specificResults.predictions.map((pred, i) => (
                                <li key={i} style={{ marginBottom: '8px' }}>
                                  Adjust <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{pred.param}</span> to <span style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>{pred.recommendedValue}</span> (Expected gain: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>+{pred.expectedEfficiencyGain}%</span>)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* Validate Data Form */}
      <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px', marginTop: '40px' }}>
        <h2 style={{ marginBottom: '10px', color: 'var(--accent-cyan)' }}>💻 Validate Data Parameters</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Fine-tune the operational and design specifications for your {project.machineType.replace('_', ' ').toLowerCase()}. The values from your 3D assembly above have been automatically applied.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {machineParams.map(param => (
            <div key={param.key} className="form-group" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <label style={{ color: 'white', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>{param.label}</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="number" 
                  min={param.min} 
                  max={param.max} 
                  step={param.step}
                  value={params[param.key] !== undefined ? params[param.key] : param.min}
                  onChange={(e) => handleInputChange(param.key, e.target.value)}
                  style={{ 
                    flex: 1, 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid var(--border-light)', 
                    color: 'white', 
                    fontSize: '1rem', 
                    padding: '8px 12px',
                    borderRadius: '6px',
                    outline: 'none',
                    width: '100%'
                  }}
                />
                {param.unit && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '10px', minWidth: '40px' }}>
                    {param.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '30px', padding: '15px', fontSize: '1.1rem' }}
          onClick={handleRunSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? 'Evaluating...' : '🚀 Run Full Evaluation'}
        </button>
      </div>
    </div>
  );
};

export default AssemblyBuilder;
