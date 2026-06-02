import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// Generic Rotating Component
const RotatingGroup = ({ children, speed = 0.05, axis = 'z' }) => {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation[axis] += speed;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// ==========================================
// Specific Machine Type Renderers
// ==========================================

const WindTurbine = ({ config }) => {
  const bladeLength = config.blades?.length || 30;
  const bladeColor = config.blades?.color || '#eeeeee';
  const motorSize = config.motors?.size || 1;
  const motorColor = config.motors?.color || '#4444ff';
  const baseHeight = config.bases?.height || 40;
  const baseColor = config.bases?.color || '#cccccc';

  const scale = 0.05; // Scale down for view

  return (
    <group scale={[scale, scale, scale]} position={[0, -baseHeight*scale/2, 0]}>
      {/* Tower */}
      <mesh position={[0, baseHeight / 2, 0]}>
        <cylinderGeometry args={[1, 1.5, baseHeight, 32]} />
        <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Nacelle (Motor) */}
      <mesh position={[0, baseHeight, -2 * motorSize]}>
        <boxGeometry args={[3, 3, 6 * motorSize]} />
        <meshStandardMaterial color={motorColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotor and Blades */}
      <group position={[0, baseHeight, 1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        <RotatingGroup speed={0.05} axis="z">
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * 2 * Math.PI) / 3]} position={[0, 0, 0]}>
              <boxGeometry args={[1, bladeLength, 0.2]} />
              <meshStandardMaterial color={bladeColor} />
            </mesh>
          ))}
        </RotatingGroup>
      </group>
    </group>
  );
};

const SteamTurbine = ({ config }) => {
  const rotorColor = config.blades?.color || '#999999';
  const rotorLength = config.blades?.length || 10;
  const boilerColor = config.motors?.color || '#a0522d';
  const boilerSize = config.motors?.size || 1;
  const condenserColor = config.bases?.color || '#555555';

  return (
    <group scale={[0.1, 0.1, 0.1]}>
      {/* Boiler */}
      <mesh position={[-15, 0, 0]}>
        <cylinderGeometry args={[4 * boilerSize, 4 * boilerSize, 10, 32]} />
        <meshStandardMaterial color={boilerColor} />
      </mesh>
      
      {/* Pipe */}
      <mesh position={[-8, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 10, 16]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>

      {/* Turbine Stages */}
      <group position={[0, 0, 0]}>
        <RotatingGroup speed={0.1} axis="x">
          {/* Shaft */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, rotorLength * 1.5, 32]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          {/* Stages */}
          {[1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} position={[(i - 3) * 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[i * 1.5, i * 1.5, 0.5, 32]} />
              <meshStandardMaterial color={rotorColor} metalness={0.8} />
            </mesh>
          ))}
        </RotatingGroup>
      </group>

      {/* Condenser */}
      <mesh position={[5, -8, 0]}>
        <boxGeometry args={[10, 6, 8]} />
        <meshStandardMaterial color={condenserColor} />
      </mesh>
    </group>
  );
};

const GasTurbine = ({ config }) => {
  const compColor = config.blades?.color || '#666666';
  const compLength = config.blades?.length || 20;
  const combColor = config.motors?.color || '#ff8800';
  const exhaustColor = config.bases?.color || '#777777';

  return (
    <group scale={[0.15, 0.15, 0.15]}>
      {/* Compressor */}
      <mesh position={[-5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[4, compLength, 32]} />
        <meshStandardMaterial color={compColor} />
      </mesh>
      
      {/* Combustor */}
      <mesh position={[7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4, 4, 8, 32]} />
        <meshStandardMaterial color={combColor} emissive={combColor} emissiveIntensity={0.5} />
      </mesh>

      {/* Turbine & Exhaust */}
      <mesh position={[14, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[4.5, 6, 32]} />
        <meshStandardMaterial color={exhaustColor} />
      </mesh>
      
      {/* Rotating Shaft/Blades inside (visible at front) */}
      <RotatingGroup speed={0.2} axis="x">
        <mesh position={[-15.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 1, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        {[0, 1, 2, 3].map(i => (
          <mesh key={i} position={[-15, 0, 0]} rotation={[i * Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.5, 3.5, 0.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </RotatingGroup>
    </group>
  );
};

const HydroTurbine = ({ config }) => {
  const runnerColor = config.blades?.color || '#336699';
  const genColor = config.motors?.color || '#44aa44';
  const genSize = config.motors?.size || 1;
  const penstockColor = config.bases?.color || '#666666';

  return (
    <group scale={[0.1, 0.1, 0.1]}>
      {/* Penstock (Pipe) */}
      <mesh position={[12, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 16, 32]} />
        <meshStandardMaterial color={penstockColor} metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Spiral Casing */}
      <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 2.5, 32, 100]} />
        <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Guide Vanes (Static) */}
      <group position={[0, -2, 0]}>
        {[...Array(12)].map((_, i) => (
          <mesh key={`vane-${i}`} rotation={[0, (i * Math.PI) / 6, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[7, 1.5, 0.2]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Runner (Blades) */}
      <group position={[0, -2, 0]}>
        <RotatingGroup speed={0.08} axis="y">
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
            <meshStandardMaterial color={runnerColor} metalness={0.8} roughness={0.2} />
          </mesh>
          {[...Array(8)].map((_, i) => (
            <mesh key={`blade-${i}`} rotation={[0, (i * Math.PI) / 4, 0]} position={[0, 0, 0]}>
              <boxGeometry args={[4, 1.8, 0.4]} />
              <meshStandardMaterial color={runnerColor} metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </RotatingGroup>
      </group>

      {/* Shaft */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 14, 32]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Generator Base */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[5 * genSize, 5 * genSize, 2, 32]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Generator Housing */}
      <mesh position={[0, 14, 0]}>
        <cylinderGeometry args={[4.5 * genSize, 4.5 * genSize, 8, 32]} />
        <meshStandardMaterial color={genColor} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
};

const ElectricMotor = ({ config }) => {
  const rotorColor = config.blades?.color || '#b87333';
  const statorColor = config.motors?.color || '#4444ff';
  const statorSize = config.motors?.size || 1;
  const frameColor = config.bases?.color || '#555555';

  return (
    <group scale={[0.15, 0.15, 0.15]}>
      {/* Outer Frame */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6 * statorSize, 6 * statorSize, 12, 32]} />
        <meshStandardMaterial color={frameColor} metalness={0.6} roughness={0.5} />
      </mesh>
      
      {/* Stator Windings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5 * statorSize, 5 * statorSize, 10, 32]} />
        <meshStandardMaterial color={statorColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Rotating Rotor & Shaft */}
      <RotatingGroup speed={0.2} axis="y">
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[4, 4, 10.5, 32]} />
            <meshStandardMaterial color={rotorColor} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Shaft */}
          <mesh position={[0, 8, 0]}>
            <cylinderGeometry args={[1, 1, 6, 16]} />
            <meshStandardMaterial color="#cccccc" metalness={0.9} />
          </mesh>
        </group>
      </RotatingGroup>
    </group>
  );
};

const WaterPump = ({ config }) => {
  const impellerColor = config.blades?.color || '#336699';
  const motorColor = config.motors?.color || '#88cc88';
  const motorSize = config.motors?.size || 1;
  const casingColor = config.bases?.color || '#666666';

  return (
    <group scale={[0.15, 0.15, 0.15]}>
      {/* Volute Casing */}
      <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 2, 32, 100]} />
        <meshStandardMaterial color={casingColor} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Discharge Pipe */}
      <mesh position={[4.5, 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 6, 32]} />
        <meshStandardMaterial color={casingColor} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Rotating Impeller */}
      <group position={[0, -2, 0]}>
        <RotatingGroup speed={0.15} axis="y">
          {[...Array(6)].map((_, i) => (
            <mesh key={`impeller-${i}`} rotation={[0, (i * Math.PI) / 3, 0]} position={[0, 0, 0]}>
              <boxGeometry args={[5, 1, 0.5]} />
              <meshStandardMaterial color={impellerColor} metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </RotatingGroup>
      </group>

      {/* Motor */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[3 * motorSize, 3 * motorSize, 8, 32]} />
        <meshStandardMaterial color={motorColor} metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

const Generator = ({ config }) => {
  const rotorColor = config.blades?.color || '#aaaaaa';
  const statorColor = config.motors?.color || '#ff8800';
  const statorSize = config.motors?.size || 1.2;
  const housingColor = config.bases?.color || '#333333';

  return (
    <group scale={[0.12, 0.12, 0.12]}>
      {/* Housing */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7 * statorSize, 7 * statorSize, 14, 32]} />
        <meshStandardMaterial color={housingColor} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Stator */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6 * statorSize, 6 * statorSize, 12, 32]} />
        <meshStandardMaterial color={statorColor} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Rotating Field / Rotor */}
      <RotatingGroup speed={0.1} axis="y">
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[4.5, 4.5, 13, 32]} />
            <meshStandardMaterial color={rotorColor} metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Shaft input */}
          <mesh position={[0, -8, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 6, 16]} />
            <meshStandardMaterial color="#999999" metalness={0.8} />
          </mesh>
        </group>
      </RotatingGroup>
    </group>
  );
};

// ==========================================
// Main Viewer Component
// ==========================================

const ModelViewer3D = ({ machineType, config }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', background: 'transparent', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {machineType === 'WIND_TURBINE' && <WindTurbine config={config} />}
        {machineType === 'STEAM_TURBINE' && <SteamTurbine config={config} />}
        {machineType === 'GAS_TURBINE' && <GasTurbine config={config} />}
        {machineType === 'HYDRO_TURBINE' && <HydroTurbine config={config} />}
        {machineType === 'ELECTRIC_MOTOR' && <ElectricMotor config={config} />}
        {machineType === 'WATER_PUMP' && <WaterPump config={config} />}
        {machineType === 'GENERATOR' && <Generator config={config} />}
        
        {(!machineType || !['WIND_TURBINE', 'STEAM_TURBINE', 'GAS_TURBINE', 'HYDRO_TURBINE', 'ELECTRIC_MOTOR', 'WATER_PUMP', 'GENERATOR'].includes(machineType)) && (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        )}

        <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={true} autoRotateSpeed={0.5} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ModelViewer3D;
