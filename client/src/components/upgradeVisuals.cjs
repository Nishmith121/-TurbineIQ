const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/client/src/components/VirtualBuilder.jsx', 'utf8');

const startMarker = "          {/* Dynamic Digital Blueprint Visualizer */}\n";
const endMarker = "          {/* Results Dashboard */}\n";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found");
    process.exit(1);
}

const newVisualizer = `          {/* Dynamic Digital Blueprint Visualizer */}
          <div className="card" style={{ 
            padding: '20px', 
            background: '#040810', 
            border: '1px solid rgba(0, 212, 255, 0.3)', 
            borderRadius: '12px', 
            minHeight: '400px', 
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.1) inset, 0 0 15px rgba(0, 0, 0, 0.8)'
          }}>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '15px', borderBottom: '1px solid rgba(0, 212, 255, 0.2)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span><span style={{color: 'white'}}>⚡</span> DIGITAL BLUEPRINT</span>
              <span style={{fontSize: '0.8rem', opacity: 0.7}}>MODEL_RENDER_{project.machineType}</span>
            </h3>
            
            <div style={{ position: 'relative', height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Premium Background Grid & Scanning Line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.15) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 0, opacity: 0.6 }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, transparent 30%, #040810 90%)', zIndex: 1 }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--accent-cyan)', opacity: 0.5, boxShadow: '0 0 10px var(--accent-cyan)', animation: 'scanline 4s linear infinite', zIndex: 2 }}></div>
              
              {/* HUD Elements */}
              <div style={{ position: 'absolute', top: 10, left: 15, fontSize: '0.75rem', color: 'rgba(0, 212, 255, 0.8)', fontFamily: 'monospace', zIndex: 2, textShadow: '0 0 5px rgba(0,212,255,0.5)' }}>
                [SYS.OP.MODE: {isSimulating ? 'VALIDATING' : 'IDLE'}]<br/>
                LOAD: {Math.floor(Math.random() * 20 + 80)}%
              </div>
              <div style={{ position: 'absolute', bottom: 10, right: 15, fontSize: '0.75rem', color: 'rgba(0, 212, 255, 0.8)', fontFamily: 'monospace', zIndex: 2, textShadow: '0 0 5px rgba(0,212,255,0.5)', textAlign: 'right' }}>
                DATALINK_STABLE // REV.A<br/>
                UPLINK_SYNC: OK
              </div>

              {/* Conditional Rendering based on Machine Type */}
              <div style={{ zIndex: 3, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {project.machineType === 'WIND_TURBINE' && (() => {
                  const r = Math.min(120, (params.rotorDiameter || 80) * 1.2);
                  const blades = params.bladeCount || 3;
                  const speed = 20 / (params.windSpeed || 10);
                  const pitch = params.pitchAngle || 0;
                  return (
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <svg width="260" height="260" viewBox="-130 -130 260 260" style={{ animation: \`spin \${speed}s linear infinite\`, overflow: 'visible' }}>
                        <defs>
                          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--accent-cyan)" />
                            <stop offset="100%" stopColor="rgba(0, 100, 255, 0.8)" />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        {/* Outer swept area dashed ring */}
                        <circle cx="0" cy="0" r={r} fill="rgba(0, 212, 255, 0.05)" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="1" strokeDasharray="4, 12" />
                        <circle cx="0" cy="0" r={r + 5} fill="none" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.5" />
                        
                        {/* Blades */}
                        {Array.from({ length: blades }).map((_, i) => (
                          <g key={i} transform={\`rotate(\${(360 / blades) * i + pitch})\`}>
                            <path 
                              d={\`M -3,15 L 3,15 L 6,\${-r + 10} Q 0,\${-r - 5} -6,\${-r + 10} Z\`} 
                              fill="url(#bladeGrad)" 
                              filter="url(#glow)"
                              opacity="0.9"
                            />
                            {/* Aerodynamic highlight line */}
                            <line x1="0" y1="10" x2="0" y2={-r + 15} stroke="white" strokeWidth="0.5" opacity="0.6"/>
                          </g>
                        ))}
                        
                        {/* Hub */}
                        <circle cx="0" cy="0" r="12" fill="#fff" filter="url(#glow)"/>
                        <circle cx="0" cy="0" r="5" fill="var(--accent-purple)"/>
                      </svg>
                      {/* Premium Tower */}
                      <div style={{ 
                        width: '24px', 
                        height: '140px', 
                        background: 'linear-gradient(to right, #111 0%, #444 50%, #111 100%)', 
                        marginTop: '-130px', 
                        zIndex: -1,
                        borderLeft: '1px solid rgba(255,255,255,0.2)',
                        borderRight: '1px solid rgba(0,0,0,0.5)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.8)'
                      }}></div>
                      {/* Base platform */}
                      <div style={{ width: '60px', height: '10px', background: '#333', borderRadius: '5px 5px 0 0', borderTop: '2px solid var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}></div>
                    </div>
                  );
                })()}

                {project.machineType === 'STEAM_TURBINE' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '25px', position: 'relative' }}>
                    {/* Glowing Boiler */}
                    <div style={{ 
                      width: '70px', height: '110px', 
                      background: \`radial-gradient(circle, rgba(255, 50, 50, \${(params.inletTemperature || 400) / 700}) 0%, #330000 100%)\`, 
                      border: '2px solid rgba(255, 100, 100, 0.8)', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold',
                      boxShadow: \`0 0 30px rgba(255, 50, 50, \${(params.inletTemperature || 400) / 700})\`,
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30%', background: 'orange', opacity: 0.5, filter: 'blur(10px)', animation: 'pulse 2s infinite' }}></div>
                      BOILER
                    </div>
                    {/* Steam Pipe */}
                    <div style={{ height: '8px', width: '50px', background: 'linear-gradient(to bottom, #ddd, #fff, #ddd)', position: 'relative', boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '15px', background: 'rgba(0, 212, 255, 0.8)', filter: 'blur(2px)', animation: 'slideRight 1s linear infinite' }}></div>
                    </div>
                    {/* Advanced Turbine Stages */}
                    <div style={{ display: 'flex', gap: '8px', padding: '15px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 20px rgba(0,212,255,0.1)' }}>
                      {Array.from({ length: params.numberOfStages || 4 }).map((_, i) => (
                        <div key={i} style={{
                          width: \`\${30 + i * 12}px\`, height: \`\${80 + i * 25}px\`,
                          background: 'linear-gradient(to right, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1))',
                          border: '2px solid var(--accent-cyan)', borderRadius: '6px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
                          position: 'relative', overflow: 'hidden'
                        }}>
                          <div style={{ height: '120%', width: '6px', background: 'var(--accent-cyan)', boxShadow: '0 0 10px #fff', animation: 'spin 0.4s linear infinite' }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {project.machineType === 'GAS_TURBINE' && (
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Compressor */}
                    <div style={{ 
                      width: '90px', height: '130px', clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 80%)',
                      background: \`linear-gradient(to right, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, \${(params.compressorPressureRatio || 15) / 30}))\`, 
                      border: '2px solid var(--accent-cyan)', boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}>
                      {/* Blades inside */}
                      <div style={{ height: '80%', width: '4px', background: 'rgba(255,255,255,0.5)', animation: 'spin 0.3s linear infinite' }}></div>
                      <div style={{ fontSize: '0.8rem', color: 'white', position: 'absolute', bottom: '-25px' }}>COMPRESSOR</div>
                    </div>
                    {/* Combustor */}
                    <div style={{ width: '60px', height: '150px', background: 'linear-gradient(to right, rgba(255, 100, 0, 0.5), rgba(255, 0, 0, 0.8))', border: '2px solid orange', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(255, 50, 0, 0.6)', zIndex: 2 }}>
                      <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px yellow)' }}>🔥</div>
                    </div>
                    {/* Turbine */}
                    <div style={{ 
                      width: '120px', height: '130px', clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)',
                      background: 'linear-gradient(to right, rgba(255, 200, 0, 0.4), rgba(255, 100, 0, 0.2))', 
                      border: '2px solid gold', boxShadow: '0 0 20px rgba(255,200,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}>
                      <div style={{ height: '90%', width: '6px', background: 'gold', animation: 'spin 0.3s linear infinite' }}></div>
                      <div style={{ fontSize: '0.8rem', color: 'white', position: 'absolute', bottom: '-25px' }}>TURBINE</div>
                    </div>
                  </div>
                )}

                {project.machineType === 'HYDRO_TURBINE' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Water Source & Penstock */}
                    <div style={{ width: '180px', height: '20px', background: 'rgba(0, 150, 255, 0.3)', borderTop: '2px solid cyan' }}></div>
                    <div style={{ 
                      width: \`\${(params.flowRate || 50) / 1.5}px\`, 
                      height: \`\${Math.min(180, (params.waterHead || 100))}px\`, 
                      background: 'linear-gradient(to bottom, rgba(0, 150, 255, 0.8), rgba(0, 255, 255, 0.9))',
                      borderLeft: '3px solid rgba(0, 100, 255, 0.8)', borderRight: '3px solid rgba(0, 100, 255, 0.8)',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)', position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: '-20px', left: 0, right: 0, height: '40px', background: 'rgba(255,255,255,0.4)', filter: 'blur(5px)', animation: 'slideDown 0.5s linear infinite' }}></div>
                    </div>
                    {/* Advanced Turbine Casing */}
                    <div style={{ 
                      width: '150px', height: '80px', background: 'linear-gradient(to bottom, #444, #111)', borderRadius: '50% 50% 15px 15px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-cyan)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(0,212,255,0.4)',
                      position: 'relative', zIndex: 2
                    }}>
                       <div style={{ 
                         width: '50px', height: '50px', background: 'radial-gradient(circle, var(--accent-emerald) 20%, #003300 100%)', 
                         borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 20px var(--accent-emerald)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         animation: \`spin \${100 / (params.flowRate || 50)}s linear infinite\` 
                       }}>
                         <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
                         {/* Abstract blades inside */}
                         {[0, 60, 120, 180, 240, 300].map(deg => (
                           <div key={deg} style={{ position: 'absolute', width: '20px', height: '4px', background: 'rgba(255,255,255,0.8)', transform: \`rotate(\${deg}deg) translateX(15px)\`}}></div>
                         ))}
                       </div>
                    </div>
                  </div>
                )}
                
                {/* Fallback for other machines */}
                {!['WIND_TURBINE', 'STEAM_TURBINE', 'GAS_TURBINE', 'HYDRO_TURBINE'].includes(project.machineType) && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '120px', height: '120px', border: '4px dashed var(--accent-purple)', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                      animation: 'spin 8s linear infinite', boxShadow: '0 0 30px rgba(187, 134, 252, 0.3)'
                    }}>
                      <div style={{ fontSize: '3rem', animation: 'spin 4s linear infinite reverse' }}>⚙️</div>
                    </div>
                    <p style={{ color: 'var(--accent-cyan)', letterSpacing: '2px', fontWeight: 'bold' }}>UNIVERSAL BLUEPRINT_ACTIVE</p>
                  </div>
                )}

              </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(0, 212, 255, 0.15)', border: '1px solid var(--accent-cyan)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)' }}>
              <div style={{ width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%', boxShadow: '0 0 5px #4caf50', animation: 'pulse 1s infinite' }}></div>
              LIVE SIMULATION
            </div>
            
            <style>
              {\`
                @keyframes scanline {
                  0% { top: 0; }
                  100% { top: 100%; }
                }
                @keyframes slideRight {
                  0% { left: -15px; }
                  100% { left: 100%; }
                }
                @keyframes slideDown {
                  0% { top: -40px; }
                  100% { top: 100%; }
                }
              \`}
            </style>
          </div>
`;

const updatedContent = content.substring(0, startIndex) + newVisualizer + content.substring(endIndex);

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/client/src/components/VirtualBuilder.jsx', updatedContent, 'utf8');
console.log("SUCCESSFULLY UPDATED UI");
