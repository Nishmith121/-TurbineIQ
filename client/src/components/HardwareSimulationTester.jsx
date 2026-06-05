import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HardwareSimulationTester = ({ project }) => {
  const [params, setParams] = useState({});
  const [machineParams, setMachineParams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardware & Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [serialPort, setSerialPort] = useState(null);
  
  // Chart State
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDatasets, setChartDatasets] = useState({});
  const maxDataPoints = 30;
  const simulationIntervalRef = useRef(null);

  useEffect(() => {
    const fetchDefaults = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/simulations/defaults/${project.machineType}`);
        if (res.data.success) {
          const { parameterInfo, defaultParameters } = res.data.data;
          setMachineParams(parameterInfo || []);
          setParams(defaultParameters || {});
          
          // Initialize chart datasets
          const initialDatasets = {};
          parameterInfo.forEach((param, idx) => {
            const colors = ['#39ff14', '#00d4ff', '#ff007f', '#ffea00'];
            initialDatasets[param.key] = {
              label: param.label,
              data: [],
              borderColor: colors[idx % colors.length],
              backgroundColor: colors[idx % colors.length] + '33',
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 0
            };
          });
          setChartDatasets(initialDatasets);
        }
      } catch (err) {
        console.error("Failed to fetch defaults", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDefaults();
    
    return () => stopSimulation();
  }, [project.machineType]);

  const updateChartAndParams = (newData) => {
    setParams(prev => {
      const updated = { ...prev, ...newData };
      return updated;
    });

    setChartLabels(prev => {
      const newLabels = [...prev, new Date().toLocaleTimeString()];
      if (newLabels.length > maxDataPoints) newLabels.shift();
      return newLabels;
    });

    setChartDatasets(prev => {
      const updated = { ...prev };
      Object.keys(newData).forEach(key => {
        if (updated[key]) {
          const newDataArr = [...updated[key].data, newData[key]];
          if (newDataArr.length > maxDataPoints) newDataArr.shift();
          updated[key] = { ...updated[key], data: newDataArr };
        }
      });
      return updated;
    });
  };

  const startSimulation = () => {
    if (isSimulating || isConnected) return;
    setIsSimulating(true);
    
    simulationIntervalRef.current = setInterval(() => {
      setParams(currentParams => {
        const simData = {};
        machineParams.forEach(param => {
          const currentVal = currentParams[param.key] || ((param.max + param.min) / 2);
          const fluctuation = (Math.random() - 0.5) * ((param.max - param.min) * 0.05);
          let nextVal = currentVal + fluctuation;
          nextVal = Math.max(param.min, Math.min(param.max, nextVal));
          simData[param.key] = parseFloat(nextVal.toFixed(2));
        });
        updateChartAndParams(simData);
        return { ...currentParams, ...simData };
      });
    }, 1000);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const connectArduino = async () => {
    if (!('serial' in navigator)) {
      alert("Web Serial API is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setSerialPort(port);
      setIsConnected(true);
      
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      let buffer = '';
      
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += value;
              const lines = buffer.split('\n');
              buffer = lines.pop();
              
              for (let line of lines) {
                line = line.trim();
                if (line) {
                  try {
                    const parsed = JSON.parse(line);
                    updateChartAndParams(parsed);
                  } catch (e) {
                    console.log("Failed to parse serial line:", line);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Serial read error", error);
        } finally {
          reader.releaseLock();
        }
      };
      
      readLoop();
    } catch (err) {
      console.error("Arduino connection failed", err);
      alert("Failed to connect to hardware. Check console for details.");
    }
  };

  const disconnectArduino = async () => {
    if (serialPort) {
      setIsConnected(false);
      setSerialPort(null); 
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading sensor parameters...</div>;
  }

  const chartDataConfig = {
    labels: chartLabels,
    datasets: Object.values(chartDatasets)
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 
    },
    scales: {
      x: {
        display: false 
      },
      y: {
        grid: {
          color: 'rgba(57, 255, 20, 0.1)'
        },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'white', font: { family: 'JetBrains Mono' } }
      }
    }
  };

  return (
    <div className="hardware-simulation-tester">
      <div className="card" style={{ padding: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h2 style={{ marginBottom: '5px', color: 'var(--accent-cyan)' }}>Live Data & Hardware</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              Connect your physical prototype via USB or run a local simulation to see real-time data streaming.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            {!isConnected ? (
              <button className="btn btn-secondary" onClick={connectArduino} disabled={isSimulating} style={{ border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                🔌 Connect Hardware
              </button>
            ) : (
              <button className="btn btn-danger" onClick={disconnectArduino}>
                Disconnect
              </button>
            )}
            
            {!isSimulating ? (
              <button className="btn btn-secondary" onClick={startSimulation} disabled={isConnected} style={{ border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
                🧪 Simulate Test
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopSimulation}>
                Stop Simulation
              </button>
            )}
          </div>
        </div>
        
        {/* Live Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {machineParams.map(param => (
            <div key={param.key} style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '15px', borderRadius: '8px', border: (isSimulating || isConnected) ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)', transition: 'border-color 0.3s' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '5px' }}>{param.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <div style={{ color: (isSimulating || isConnected) ? 'var(--accent-emerald)' : 'white', fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                  {params[param.key] !== undefined ? params[param.key] : '0.00'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{param.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Chart */}
        <div style={{ height: '400px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-subtle)' }}>
           <Line data={chartDataConfig} options={chartOptions} />
        </div>
        
      </div>
    </div>
  );
};

export default HardwareSimulationTester;
