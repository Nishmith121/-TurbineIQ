import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RealModelTester = ({ project }) => {
  const [params, setParams] = useState({});
  const [machineParams, setMachineParams] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/simulations/defaults/${project.machineType}`);
        if (res.data.success) {
          const { parameterInfo, defaultParameters } = res.data.data;
          setMachineParams(parameterInfo || []);
          setParams(defaultParameters || {});
        }
      } catch (err) {
        console.error("Failed to fetch defaults", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDefaults();
  }, [project.machineType]);

  const handleInputChange = (id, value) => {
    setParams(prev => ({
      ...prev,
      [id]: parseFloat(value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleValidate = async () => {
    if (!image) {
      alert("Please upload an image of your physical model first!");
      return;
    }

    setIsValidating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/simulations/projects/${project.id}/validate-real`, {
        description,
        image,
        sensorData: params
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      console.error("Validation failed", err);
      alert("Failed to validate real model. Check console for details.");
    } finally {
      setIsValidating(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading sensor parameters...</div>;
  }

  return (
    <div className="real-model-tester">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
        
        {/* Left Side: Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '10px', color: 'var(--accent-emerald)' }}>1. Model Inspection</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Upload a clear photo of your physical {project.machineType.replace('_', ' ').toLowerCase()} model for our Gemini Vision AI to inspect.
            </p>
            
            <textarea
              placeholder="Describe your model (e.g., 'I built this with 3D printed PLA blades and a small 12V DC motor...')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '15px', color: 'white', marginBottom: '20px', resize: 'none', fontFamily: 'var(--font-body)' }}
            />

            <div style={{ border: '2px dashed var(--accent-emerald)', padding: '20px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Model Preview" style={{ maxHeight: '200px', borderRadius: '4px' }} />
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📸</div>
                  Click to upload a photo of your physical model
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '10px', color: 'var(--accent-cyan)' }}>2. Sensor Data Input</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Input the raw data collected from your sensors during operation.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {machineParams.map(param => (
                <div key={param.key} className="form-group">
                  <label style={{ color: 'white', fontWeight: 'bold', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>{param.label}</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <input 
                      type="number" 
                      min={param.min} 
                      max={param.max} 
                      step={param.step}
                      value={params[param.key] !== undefined ? params[param.key] : param.min}
                      onChange={(e) => handleInputChange(param.key, e.target.value)}
                      style={{ 
                        flex: 1, 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'white', 
                        fontSize: '1rem', 
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                    {param.unit && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '10px' }}>
                        {param.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '30px', padding: '15px', fontSize: '1.1rem', background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))', border: 'none', color: '#000' }}
              onClick={handleValidate}
              disabled={isValidating}
            >
              {isValidating ? '🤖 AI is Analyzing...' : '🔍 Run Full AI Diagnostics'}
            </button>
          </div>

        </div>

        {/* Right Side: Results Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {result ? (
            <>
              {/* Vision AI Feedback */}
              <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--accent-purple)', borderRadius: '12px', boxShadow: 'var(--shadow-glow-purple)' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>👁️</span> Gemini Vision Inspector
                </h3>
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {result.visionFeedback}
                </div>
              </div>

              {/* ML Sensor Diagnostics */}
              <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--accent-cyan)', borderRadius: '12px', boxShadow: 'var(--shadow-glow-cyan)' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>📊</span> Machine Learning Diagnostics
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Estimated Real Power</div>
                    <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                      {result.powerOutput > 1000000 
                        ? (result.powerOutput / 1000000).toFixed(2) + ' MW' 
                        : result.powerOutput > 1000 
                          ? (result.powerOutput / 1000).toFixed(2) + ' kW' 
                          : result.powerOutput.toFixed(2) + ' W'}
                    </div>
                  </div>
                </div>
                
                {result.aiRecommendation && (
                  <div style={{ padding: '15px', background: 'rgba(57, 255, 20, 0.05)', borderLeft: '4px solid var(--accent-emerald)', borderRadius: '4px' }}>
                    <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '5px' }}>Optimization Strategy:</strong> 
                    <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{result.aiRecommendation}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px dashed var(--border-light)', borderRadius: '12px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.5 }}>🔬</div>
                <h3 style={{ color: 'var(--text-secondary)' }}>Awaiting Model Data</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto', fontSize: '0.9rem' }}>Upload a photo and input your sensor data to receive an AI-powered diagnostic report.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RealModelTester;
