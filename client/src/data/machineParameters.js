export const MACHINE_PARAMETERS = {
  WIND_TURBINE: [
    { id: 'rotorRadius', label: 'Rotor Radius (m)', type: 'number', min: 10, max: 120, default: 40, step: 1, desc: 'Length of a single blade.' },
    { id: 'windSpeed', label: 'Average Wind Speed (m/s)', type: 'number', min: 1, max: 30, default: 10, step: 0.1, desc: 'Incoming wind velocity.' },
    { id: 'airDensity', label: 'Air Density (kg/m³)', type: 'number', min: 0.9, max: 1.4, default: 1.225, step: 0.001, desc: '1.225 at sea level.' },
    { id: 'pitchAngle', label: 'Blade Pitch Angle (°)', type: 'number', min: 0, max: 30, default: 0, step: 0.5, desc: 'Angle of blades to the wind.' }
  ],
  STEAM_TURBINE: [
    { id: 'inletTemp', label: 'Inlet Steam Temp (°C)', type: 'number', min: 150, max: 600, default: 400, step: 5, desc: 'Temperature of steam entering.' },
    { id: 'inletPressure', label: 'Inlet Pressure (bar)', type: 'number', min: 10, max: 200, default: 50, step: 1, desc: 'Pressure of steam entering.' },
    { id: 'massFlow', label: 'Mass Flow Rate (kg/s)', type: 'number', min: 1, max: 500, default: 100, step: 1, desc: 'Amount of steam per second.' },
    { id: 'isentropicEff', label: 'Isentropic Efficiency (%)', type: 'number', min: 50, max: 99, default: 85, step: 1, desc: 'Internal turbine efficiency.' }
  ],
  GAS_TURBINE: [
    { id: 'pressureRatio', label: 'Compressor Pressure Ratio', type: 'number', min: 5, max: 40, default: 15, step: 0.5, desc: 'Ratio of exit to inlet pressure.' },
    { id: 'turbineInletTemp', label: 'Turbine Inlet Temp (°C)', type: 'number', min: 800, max: 1600, default: 1200, step: 10, desc: 'TIT before expansion.' },
    { id: 'massFlow', label: 'Air Mass Flow (kg/s)', type: 'number', min: 10, max: 800, default: 200, step: 5, desc: 'Flow rate of air.' }
  ],
  HYDRO_TURBINE: [
    { id: 'netHead', label: 'Net Head (m)', type: 'number', min: 2, max: 1000, default: 50, step: 1, desc: 'Height of falling water.' },
    { id: 'flowRate', label: 'Flow Rate (m³/s)', type: 'number', min: 0.1, max: 500, default: 20, step: 0.5, desc: 'Volume of water per second.' },
    { id: 'efficiency', label: 'Turbine Efficiency (%)', type: 'number', min: 60, max: 98, default: 90, step: 1, desc: 'Mechanical efficiency.' }
  ],
  MOTOR: [
    { id: 'voltage', label: 'Input Voltage (V)', type: 'number', min: 12, max: 4160, default: 400, step: 1, desc: 'Supply voltage.' },
    { id: 'current', label: 'Current (A)', type: 'number', min: 1, max: 1000, default: 50, step: 1, desc: 'Current drawn.' },
    { id: 'powerFactor', label: 'Power Factor', type: 'number', min: 0.5, max: 1.0, default: 0.85, step: 0.01, desc: 'Phase difference (cos φ).' }
  ],
  GENERATOR: [
    { id: 'rpm', label: 'Rotor Speed (RPM)', type: 'number', min: 100, max: 3600, default: 1500, step: 10, desc: 'Mechanical rotational speed.' },
    { id: 'poles', label: 'Number of Poles', type: 'number', min: 2, max: 48, default: 4, step: 2, desc: 'Magnetic poles.' },
    { id: 'fieldCurrent', label: 'Field Current (A)', type: 'number', min: 0.1, max: 50, default: 5, step: 0.1, desc: 'Excitation current.' }
  ],
  PUMP: [
    { id: 'flowRate', label: 'Required Flow (m³/h)', type: 'number', min: 1, max: 10000, default: 100, step: 5, desc: 'Target volume flow.' },
    { id: 'head', label: 'Total Dynamic Head (m)', type: 'number', min: 1, max: 500, default: 30, step: 1, desc: 'Pressure resistance.' },
    { id: 'density', label: 'Fluid Density (kg/m³)', type: 'number', min: 500, max: 2000, default: 1000, step: 10, desc: '1000 for water.' }
  ]
};
