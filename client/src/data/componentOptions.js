export const COMPONENT_OPTIONS = {
  WIND_TURBINE: {
    blades: [
      { id: 'blade_plastic', name: 'Standard Plastic Blades', color: '#eeeeee', length: 30, params: { rotorDiameter: 30, pitchAngle: 5 } },
      { id: 'blade_aluminum', name: 'Aluminum Alloy Blades', color: '#dddddd', length: 45, params: { rotorDiameter: 45, pitchAngle: 3 } },
      { id: 'blade_steel', name: 'Heavy Steel Blades', color: '#999999', length: 60, params: { rotorDiameter: 60, pitchAngle: 2 } },
      { id: 'blade_fiberglass', name: 'Fiberglass Blades', color: '#f5f5f5', length: 80, params: { rotorDiameter: 80, pitchAngle: 1 } },
      { id: 'blade_carbon', name: 'Advanced Carbon Fiber', color: '#222222', length: 100, params: { rotorDiameter: 100, pitchAngle: 0 } },
    ],
    motors: [
      { id: 'motor_hobby', name: 'Small Hobby Motor', color: '#333333', size: 0.5, params: { tipSpeedRatio: 4 } },
      { id: 'motor_std', name: 'Standard Generator', color: '#4444ff', size: 1, params: { tipSpeedRatio: 6 } },
      { id: 'motor_pro', name: 'High-Efficiency Generator', color: '#ff4444', size: 1.5, params: { tipSpeedRatio: 7 } },
      { id: 'motor_industrial', name: 'Industrial Megawatt Gen', color: '#222288', size: 2.5, params: { tipSpeedRatio: 8 } },
    ],
    bases: [
      { id: 'base_pvc', name: 'Short PVC Pipe', color: '#ffffff', height: 20, params: { windSpeed: 5 } },
      { id: 'base_short', name: 'Wooden Short Tower', color: '#8b5a2b', height: 40, params: { windSpeed: 8 } },
      { id: 'base_lattice', name: 'Steel Lattice Tower', color: '#888888', height: 70, params: { windSpeed: 10 } },
      { id: 'base_tall', name: 'Tall Tubular Steel', color: '#cccccc', height: 100, params: { windSpeed: 12 } },
    ]
  },
  STEAM_TURBINE: {
    blades: [ // "Rotors" for steam
      { id: 'rotor_basic', name: 'Basic Steel Rotor', color: '#999999', length: 8, params: { isentropicEfficiency: 0.75 } },
      { id: 'rotor_stainless', name: 'Stainless Steel Rotor', color: '#bbbbbb', length: 10, params: { isentropicEfficiency: 0.80 } },
      { id: 'rotor_alloy', name: 'Titanium Alloy Rotor', color: '#b8c6db', length: 12, params: { isentropicEfficiency: 0.88 } },
      { id: 'rotor_superalloy', name: 'Nickel Superalloy', color: '#555555', length: 14, params: { isentropicEfficiency: 0.92 } },
    ],
    motors: [ // "Boilers" for steam
      { id: 'boiler_low', name: 'Low-Pressure Boiler', color: '#a0522d', size: 1, params: { inletPressure: 50, inletTemperature: 300 } },
      { id: 'boiler_med', name: 'Medium-Pressure Boiler', color: '#cd5c5c', size: 1.5, params: { inletPressure: 100, inletTemperature: 400 } },
      { id: 'boiler_high', name: 'High-Pressure Boiler', color: '#8b0000', size: 2, params: { inletPressure: 165, inletTemperature: 540 } },
      { id: 'boiler_super', name: 'Supercritical Boiler', color: '#ff0000', size: 2.5, params: { inletPressure: 220, inletTemperature: 600 } },
    ],
    bases: [
      { id: 'condenser_air', name: 'Air-Cooled Condenser', color: '#888888', height: 15, params: { condenserPressure: 0.12 } },
      { id: 'condenser_std', name: 'Standard Water-Cooled', color: '#555555', height: 20, params: { condenserPressure: 0.08 } },
      { id: 'condenser_vac', name: 'Deep Vacuum Condenser', color: '#222222', height: 25, params: { condenserPressure: 0.045 } },
      { id: 'condenser_multi', name: 'Advanced Multi-Stage', color: '#111111', height: 30, params: { condenserPressure: 0.03 } },
    ]
  },
  GAS_TURBINE: {
    blades: [ // "Compressors"
      { id: 'comp_centrifugal', name: 'Centrifugal Compressor', color: '#888888', length: 15, params: { compressorPressureRatio: 8, compressorEfficiency: 0.75 } },
      { id: 'comp_axial', name: 'Low-Stage Axial', color: '#666666', length: 20, params: { compressorPressureRatio: 12, compressorEfficiency: 0.82 } },
      { id: 'comp_advanced', name: 'Multi-Stage Axial', color: '#333333', length: 30, params: { compressorPressureRatio: 20, compressorEfficiency: 0.88 } },
      { id: 'comp_aero', name: 'Advanced Aerodynamic', color: '#111111', length: 40, params: { compressorPressureRatio: 25, compressorEfficiency: 0.92 } },
    ],
    motors: [ // "Combustors"
      { id: 'combustor_can', name: 'Can-Type Combustor', color: '#ffaa00', size: 0.8, params: { turbineInletTemp: 1000 } },
      { id: 'combustor_std', name: 'Annular Combustor', color: '#ff8800', size: 1, params: { turbineInletTemp: 1200 } },
      { id: 'combustor_silo', name: 'Silo Combustor', color: '#ff5500', size: 1.2, params: { turbineInletTemp: 1400 } },
      { id: 'combustor_high', name: 'High-Temp Combustor', color: '#ff2200', size: 1.5, params: { turbineInletTemp: 1600 } },
    ],
    bases: [
      { id: 'exhaust_simple', name: 'Simple Exhaust', color: '#999999', height: 10, params: { airMassFlow: 30 } },
      { id: 'exhaust_std', name: 'Standard Diffuser', color: '#777777', height: 15, params: { airMassFlow: 40 } },
      { id: 'exhaust_wide', name: 'High-Bypass Exhaust', color: '#555555', height: 25, params: { airMassFlow: 60 } },
      { id: 'exhaust_hrs', name: 'Heat Recovery Sys (HRSG)', color: '#333333', height: 35, params: { airMassFlow: 80 } },
    ]
  },
  HYDRO_TURBINE: {
    blades: [ // "Runners"
      { id: 'runner_arch', name: 'Archimedes Screw', color: '#8b4513', length: 20, params: { guideVaneOpening: 100 } },
      { id: 'runner_cross', name: 'Cross-Flow Runner', color: '#4477aa', length: 18, params: { guideVaneOpening: 50 } },
      { id: 'runner_francis', name: 'Francis Runner', color: '#336699', length: 15, params: { guideVaneOpening: 70 } },
      { id: 'runner_pelton', name: 'Pelton Wheel', color: '#224466', length: 12, params: { guideVaneOpening: 88 } },
      { id: 'runner_kaplan', name: 'Kaplan Propeller', color: '#112233', length: 10, params: { guideVaneOpening: 95 } },
    ],
    motors: [ // "Generators"
      { id: 'hydro_gen_micro', name: 'Micro-Hydro Generator', color: '#88cc88', size: 0.5, params: { efficiency: 0.70 } },
      { id: 'hydro_gen_small', name: 'Small Generator', color: '#44aa44', size: 1, params: { efficiency: 0.85 } },
      { id: 'hydro_gen_med', name: 'Medium Generator', color: '#338833', size: 1.5, params: { efficiency: 0.90 } },
      { id: 'hydro_gen_large', name: 'Large Industrial Generator', color: '#226622', size: 2, params: { efficiency: 0.95 } },
    ],
    bases: [ // "Penstocks"
      { id: 'penstock_pvc', name: 'Low Head PVC Pipe', color: '#eeeeee', height: 20, params: { waterHead: 10, flowRate: 100 } },
      { id: 'penstock_low', name: 'Medium Head Steel Pipe', color: '#666666', height: 50, params: { waterHead: 50, flowRate: 80 } },
      { id: 'penstock_high', name: 'High Head Penstock', color: '#444444', height: 150, params: { waterHead: 150, flowRate: 40 } },
      { id: 'penstock_ultra', name: 'Ultra-High Head System', color: '#222222', height: 250, params: { waterHead: 250, flowRate: 20 } },
    ]
  },
  WATER_PUMP: {
    blades: [
      { id: 'impeller_standard', name: 'Standard Impeller', color: '#336699', length: 10, params: { flowCapacity: 50 } },
      { id: 'impeller_high_flow', name: 'High Flow Impeller', color: '#4477aa', length: 12, params: { flowCapacity: 100 } },
    ],
    motors: [
      { id: 'pump_motor_small', name: 'Small Pump Motor', color: '#88cc88', size: 1, params: { motorEfficiency: 0.8 } },
      { id: 'pump_motor_large', name: 'Industrial Pump Motor', color: '#226622', size: 2, params: { motorEfficiency: 0.92 } },
    ],
    bases: [
      { id: 'pump_casing_std', name: 'Standard Casing', color: '#666666', height: 20, params: { pressureRating: 50 } },
      { id: 'pump_casing_heavy', name: 'Heavy Duty Casing', color: '#444444', height: 30, params: { pressureRating: 150 } },
    ]
  },
  ELECTRIC_MOTOR: {
    blades: [
      { id: 'rotor_copper', name: 'Copper Rotor', color: '#b87333', length: 15, params: { conductivity: 0.95 } },
      { id: 'rotor_aluminum', name: 'Aluminum Rotor', color: '#cccccc', length: 15, params: { conductivity: 0.61 } },
    ],
    motors: [
      { id: 'stator_standard', name: 'Standard Stator', color: '#4444ff', size: 1, params: { windingEfficiency: 0.85 } },
      { id: 'stator_premium', name: 'Premium Stator', color: '#222288', size: 1.5, params: { windingEfficiency: 0.95 } },
    ],
    bases: [
      { id: 'motor_frame_steel', name: 'Steel Frame', color: '#888888', height: 20, params: { thermalDissipation: 40 } },
      { id: 'motor_frame_cast', name: 'Cast Iron Frame', color: '#555555', height: 25, params: { thermalDissipation: 80 } },
    ]
  },
  GENERATOR: {
    blades: [
      { id: 'gen_rotor_standard', name: 'Standard Rotor', color: '#aaaaaa', length: 20, params: { magneticFlux: 1.2 } },
      { id: 'gen_rotor_super', name: 'Superconducting Rotor', color: '#66ccff', length: 25, params: { magneticFlux: 2.5 } },
    ],
    motors: [
      { id: 'gen_stator_small', name: 'Small Stator', color: '#ff8800', size: 1.2, params: { outputVoltage: 400 } },
      { id: 'gen_stator_large', name: 'Utility Stator', color: '#ff2200', size: 2.5, params: { outputVoltage: 11000 } },
    ],
    bases: [
      { id: 'gen_housing_open', name: 'Open Housing', color: '#cccccc', height: 30, params: { coolingEfficiency: 0.7 } },
      { id: 'gen_housing_closed', name: 'TEFC Housing', color: '#333333', height: 40, params: { coolingEfficiency: 0.9 } },
    ]
  }
};
